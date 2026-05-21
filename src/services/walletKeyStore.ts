

import AsyncStorage from '@react-native-async-storage/async-storage';
import CryptoJS from 'crypto-js';
import * as secp from '@noble/secp256k1';
import { keccak_256 } from '@noble/hashes/sha3';

export interface WalletKey {
  wallet_code: string;
  address: string;
  private_key: string;     
  derivation_path: string;
}

export type WalletNetwork = 'eth' | 'pol';

export interface VaultEntry {
  u: string;        
  c: string;        
  h?: string;       
  s: 's0' | 's1';   
  b?: string;       

  a?: string;
  k?: string;
  z?: string;
  p?: string;
}

export const NETWORK_MAP: Record<string, WalletNetwork> = {
  c1: 'eth',
  c2: 'eth',
  c16: 'pol',
  c18: 'pol',
};

export function classifyWalletsByNetwork(
  wallets: WalletKey[],
): { eth: WalletKey | null; pol: WalletKey | null } {
  const eth = wallets.find((w) => NETWORK_MAP[w.wallet_code] === 'eth') ?? null;
  const pol = wallets.find((w) => NETWORK_MAP[w.wallet_code] === 'pol') ?? null;
  return { eth, pol };
}

const VAULT_KEY = '__xs_v1';

let _vaultMutex: Promise<void> = Promise.resolve();
function withVaultLock<T>(fn: () => Promise<T>): Promise<T> {
  const prev = _vaultMutex;
  let release!: () => void;
  _vaultMutex = new Promise<void>((r) => { release = r; });
  return prev.then(fn).finally(() => release());
}

function normEmail(email: string): string {
  return (email ?? '').toLowerCase().trim();
}

export function jwtPayloadSub(jwt: string): number | null {
  try {
    const parts = jwt.split('.');
    if (parts.length !== 3) return null;
    let b64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    while (b64.length % 4) b64 += '=';
    const decoded = CryptoJS.enc.Base64.parse(b64).toString(CryptoJS.enc.Utf8);
    const payload = JSON.parse(decoded) as Record<string, unknown>;
    return typeof payload.sub === 'number' ? payload.sub : null;
  } catch {
    return null;
  }
}

export function obfuscateWithMember(plaintextJson: string, member: number): string {
  const keyHex = CryptoJS.SHA256('xrun-tmp-v1:' + String(member)).toString();

  const ivHex = CryptoJS.SHA256('xrun-tmp-iv-v1:' + String(member)).toString().slice(0, 32);
  const key = CryptoJS.enc.Hex.parse(keyHex);
  const iv = CryptoJS.enc.Hex.parse(ivHex);
  return CryptoJS.AES.encrypt(plaintextJson, key, {
    iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  }).toString();
}

export function deobfuscateWithMember(cipher: string, member: number): string {
  const keyHex = CryptoJS.SHA256('xrun-tmp-v1:' + String(member)).toString();
  const ivHex = CryptoJS.SHA256('xrun-tmp-iv-v1:' + String(member)).toString().slice(0, 32);
  const key = CryptoJS.enc.Hex.parse(keyHex);
  const iv = CryptoJS.enc.Hex.parse(ivHex);
  return CryptoJS.AES.decrypt(cipher, key, {
    iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  }).toString(CryptoJS.enc.Utf8);
}

function derivePinKey(
  pin: string,
  email: string,
  member: number,
): CryptoJS.lib.WordArray {
  const normalized = normEmail(email);
  const saltHex = CryptoJS.SHA256(normalized + ':' + String(member)).toString();
  const salt = CryptoJS.enc.Hex.parse(saltHex);
  return CryptoJS.PBKDF2(pin, salt, {
    keySize: 256 / 32,
    iterations: 10000,
    hasher: CryptoJS.algo.SHA256,
  });
}

function derivePinIv(email: string, member: number): CryptoJS.lib.WordArray {
  const normalized = normEmail(email);
  const ivHex = CryptoJS.SHA256(
    'xrun-pin-iv-v1:' + normalized + ':' + String(member),
  )
    .toString()
    .slice(0, 32); 
  return CryptoJS.enc.Hex.parse(ivHex);
}

export function encryptWithPin(
  plaintextJson: string,
  pin: string,
  email: string,
  member: number,
): string {
  const key = derivePinKey(pin, email, member);
  const iv = derivePinIv(email, member);
  return CryptoJS.AES.encrypt(plaintextJson, key, {
    iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  }).toString();
}

export function decryptWithPin(
  cipher: string,
  pin: string,
  email: string,
  member: number,
): string {
  const key = derivePinKey(pin, email, member);
  const iv = derivePinIv(email, member);
  return CryptoJS.AES.decrypt(cipher, key, {
    iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  }).toString(CryptoJS.enc.Utf8);
}

export function pinVerifyHash(pin: string, email: string, member: number): string {
  const normalized = normEmail(email);
  const saltHex = CryptoJS.SHA256(
    'xrun-pin-verify-v1:' + normalized + ':' + String(member),
  ).toString();
  const salt = CryptoJS.enc.Hex.parse(saltHex);
  const hash = CryptoJS.PBKDF2(pin, salt, {
    keySize: 256 / 32,
    iterations: 10000,
    hasher: CryptoJS.algo.SHA256,
  });
  return hash.toString(); 
}

async function deriveEvmAddress(privateKeyHex: string): Promise<string> {

  const pkHex = privateKeyHex.startsWith('0x')
    ? privateKeyHex.slice(2)
    : privateKeyHex;

  const pubUncompressed = secp.getPublicKey(pkHex, false);

  const pubNoPrefix = pubUncompressed.slice(1);

  const hash = keccak_256(pubNoPrefix);
  const addressBytes = hash.slice(-20);
  return '0x' + Array.from(addressBytes, (b) => b.toString(16).padStart(2, '0')).join('');
}

export async function verifyAllWallets(
  wallets: WalletKey[],
): Promise<{ ok: boolean; failed: string[] }> {
  const failed: string[] = [];
  for (const w of wallets) {

    if (!/^(0x)?[0-9a-fA-F]{64}$/.test(w.private_key)) {
      failed.push(`${w.wallet_code}:format`);
      continue;
    }

    try {
      const derived = await deriveEvmAddress(w.private_key);
      if (derived.toLowerCase() !== w.address.toLowerCase()) {
        failed.push(`${w.wallet_code}:address-mismatch`);
      }
    } catch {
      failed.push(`${w.wallet_code}:derive-error`);
    }
  }
  return { ok: failed.length === 0, failed };
}

export function userHash(email: string, member: number, network: WalletNetwork): string {
  const normalized = normEmail(email);
  return CryptoJS.SHA256(`xrun-user:${normalized}:${String(member)}:${network}`).toString();
}

function randomDecoys(): Partial<VaultEntry> {
  const fields = ['a', 'k', 'z', 'p'];

  for (let i = fields.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [fields[i], fields[j]] = [fields[j], fields[i]];
  }
  const picked = fields.slice(0, 3);
  const result: Partial<VaultEntry> = {};

  const B64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
  for (const f of picked) {
    const size = 12 + Math.floor(Math.random() * 20); 
    const targetLen = Math.ceil((size * 4) / 3);
    let s = '';
    for (let i = 0; i < targetLen; i++) {
      s += B64[Math.floor(Math.random() * 64)];
    }
    (result as Record<string, string>)[f] = s;
  }
  return result;
}

export async function readVault(): Promise<VaultEntry[]> {
  try {
    const raw = await AsyncStorage.getItem(VAULT_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    if (__DEV__) {

      console.warn('[walletKeyStore] readVault parse 실패 — vault 손상 가능', e);
    }
    return [];
  }
}

export async function writeVault(entries: VaultEntry[]): Promise<void> {
  await AsyncStorage.setItem(VAULT_KEY, JSON.stringify(entries));
}

export async function findEntry(
  email: string,
  member: number,
  network: WalletNetwork,
): Promise<VaultEntry | null> {
  const vault = await readVault();
  const u = userHash(email, member, network);
  return vault.find((e) => e.u === u) ?? null;
}

export async function findEntriesForUser(
  email: string,
  member: number,
): Promise<{ eth: VaultEntry | null; pol: VaultEntry | null }> {
  const vault = await readVault();
  const ethU = userHash(email, member, 'eth');
  const polU = userHash(email, member, 'pol');
  return {
    eth: vault.find((e) => e.u === ethU) ?? null,
    pol: vault.find((e) => e.u === polU) ?? null,
  };
}

export async function upsertEntry(entry: VaultEntry): Promise<void> {
  return withVaultLock(async () => {
    const vault = await readVault();
    const idx = vault.findIndex((e) => e.u === entry.u);

    const merged: VaultEntry = {
      u: entry.u,
      c: entry.c,
      s: entry.s,
      ...(entry.h ? { h: entry.h } : {}),
      ...(entry.b ? { b: entry.b } : {}),
      ...randomDecoys(),
    };
    if (idx >= 0) {
      vault[idx] = merged;
    } else {
      vault.push(merged);
    }
    await writeVault(vault);
  });
}

export async function upsertEntryIfNotS1(entry: VaultEntry): Promise<{ applied: boolean }> {
  return withVaultLock(async () => {
    const vault = await readVault();
    const idx = vault.findIndex((e) => e.u === entry.u);
    if (idx >= 0 && vault[idx].s === 's1') {

      return { applied: false };
    }

    const existingH = idx >= 0 ? vault[idx].h : undefined;
    const merged: VaultEntry = {
      u: entry.u,
      c: entry.c,
      s: entry.s,
      ...(entry.h ?? existingH ? { h: entry.h ?? existingH! } : {}),
      ...randomDecoys(),
    };
    if (idx >= 0) {
      vault[idx] = merged;
    } else {
      vault.push(merged);
    }
    await writeVault(vault);
    return { applied: true };
  });
}

export async function unlockUserWallets(
  pin: string,
  email: string,
  member: number,
): Promise<{ ok: true; wallets: WalletKey[] } | { ok: false; reason: string }> {
  const entries = await findEntriesForUser(email, member);
  const allWallets: WalletKey[] = [];
  const targets: WalletNetwork[] = ['eth', 'pol'];

  const candidates = targets.filter((n) => entries[n] !== null);
  if (candidates.length === 0) return { ok: false, reason: 'no-entries' };

  const expectedHash = pinVerifyHash(pin, email, member);

  for (const network of candidates) {
    const entry = entries[network]!;
    if (entry.s !== 's1' || !entry.h) {
      return { ok: false, reason: `${network}:not-set-up` };
    }

    if (entry.h !== expectedHash) {
      return { ok: false, reason: 'wrong-pin' };
    }

    let plaintext: string;
    try {
      plaintext = decryptWithPin(entry.c, pin, email, member);
    } catch {
      return { ok: false, reason: `${network}:decrypt-error` };
    }
    if (!plaintext) return { ok: false, reason: `${network}:decrypt-empty` };

    let wallets: WalletKey[];
    try {
      wallets = JSON.parse(plaintext);
    } catch {
      return { ok: false, reason: `${network}:json-parse-fail` };
    }
    if (!Array.isArray(wallets) || wallets.length === 0) {
      return { ok: false, reason: `${network}:empty-array` };
    }

    const v = await verifyAllWallets(wallets);
    if (!v.ok) {
      return { ok: false, reason: `${network}:verify-fail:${v.failed.join(',')}` };
    }
    allWallets.push(...wallets);
  }

  return { ok: true, wallets: allWallets };
}

const LEGACY_KEYS = ['wallets', 'walletsEncState', 'walletKeyPinHash', 'wallets_stage1_backup'];
let _legacyCleanedOnce = false;
export async function legacyCleanupOnce(): Promise<void> {
  if (_legacyCleanedOnce) return;
  _legacyCleanedOnce = true;
  try {
    await AsyncStorage.multiRemove(LEGACY_KEYS);
  } catch {

  }
}

export async function debugVault(): Promise<{ count: number; users: string[] }> {
  const vault = await readVault();
  return {
    count: vault.length,
    users: vault.map((e) => e.u.slice(0, 12) + '...'),
  };
}

const SESSION_UNLOCK_TTL_MS = 3 * 60 * 1000;
const _sessionUnlock = new Map<string, number>();

function sessionUnlockKey(email: string, member: number): string {
  const normalized = normEmail(email);
  return CryptoJS.SHA256(`xrun-session:${normalized}:${String(member)}`).toString();
}

export function markUserUnlocked(email: string, member: number): void {
  _sessionUnlock.set(sessionUnlockKey(email, member), Date.now());
}

export function isUserStillUnlocked(email: string, member: number): boolean {
  const k = sessionUnlockKey(email, member);
  const ts = _sessionUnlock.get(k);
  if (!ts) return false;
  if (Date.now() - ts > SESSION_UNLOCK_TTL_MS) {
    _sessionUnlock.delete(k);
    return false;
  }
  return true;
}

export function clearUserUnlock(email: string, member: number): void {
  _sessionUnlock.delete(sessionUnlockKey(email, member));
}

export type WalletAvailabilitySentinel = 'NQ' | 'DK' | 'ADC' | 'MISSING' | 'DECRYPT_FAIL';

export interface WalletUnavailable {
  wallet_code: string;                       
  savedstring: WalletAvailabilitySentinel;
}

export interface AvailabilityEntry {
  u: string;                       
  un: WalletUnavailable[];         
  t: number;                       
}

const AVAILABILITY_KEY = '__xs_av1';

export function userAvailabilityHash(email: string, member: number): string {
  const normalized = normEmail(email);
  return CryptoJS.SHA256(`xrun-av:${normalized}:${String(member)}`).toString();
}

export async function readAvailability(): Promise<AvailabilityEntry[]> {
  try {
    const raw = await AsyncStorage.getItem(AVAILABILITY_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    if (__DEV__) {
      console.warn('[walletKeyStore] readAvailability parse 실패', e);
    }
    return [];
  }
}

async function writeAvailability(entries: AvailabilityEntry[]): Promise<void> {
  await AsyncStorage.setItem(AVAILABILITY_KEY, JSON.stringify(entries));
}

export async function findUnavailable(
  email: string,
  member: number,
): Promise<WalletUnavailable[]> {
  const list = await readAvailability();
  const u = userAvailabilityHash(email, member);
  const entry = list.find((e) => e.u === u);
  return entry?.un ?? [];
}

export async function upsertAvailability(
  email: string,
  member: number,
  unavailable: WalletUnavailable[],
): Promise<void> {
  return withVaultLock(async () => {
    const list = await readAvailability();
    const u = userAvailabilityHash(email, member);
    const next: AvailabilityEntry = { u, un: unavailable, t: Date.now() };
    const idx = list.findIndex((e) => e.u === u);
    if (idx >= 0) {
      list[idx] = next;
    } else {
      list.push(next);
    }
    await writeAvailability(list);
  });
}
