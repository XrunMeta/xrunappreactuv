

import AsyncStorage from '@react-native-async-storage/async-storage';
import CryptoJS from 'crypto-js';
import * as secp from '@noble/secp256k1';
import { keccak_256 } from '@noble/hashes/sha3';
import { deriveScryptKey, randomIvHex, hexToWordArray } from './cryptoPrimitives';
import { getOrCreateKek, loadKek } from './walletKek';

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
  ver?: 1 | 2;      
  iv?: string;      
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

export function pinSaltHex(email: string, member: number): string {
  return CryptoJS.SHA256(normEmail(email) + ':' + String(member)).toString();
}

export async function encryptWithPinV2(
  plaintextJson: string,
  pin: string,
  email: string,
  member: number,
): Promise<{ c: string; iv: string }> {

  const dk = await deriveScryptKey(pin, pinSaltHex(email, member));
  const ivInnerHex = randomIvHex();
  const inner = CryptoJS.AES.encrypt(plaintextJson, dk, {
    iv: hexToWordArray(ivInnerHex),
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  }).toString(); 

  const kek = await getOrCreateKek();
  const ivOuterHex = randomIvHex();
  const outer = CryptoJS.AES.encrypt(inner, kek, {
    iv: hexToWordArray(ivOuterHex),
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  }).toString(); 

  return { c: `${ivOuterHex}:${outer}`, iv: ivInnerHex };
}

export async function decryptEntry(
  entry: VaultEntry,
  pin: string,
  email: string,
  member: number,
): Promise<string> {
  if (entry.ver === 2) {
    const kek = await loadKek();
    if (!kek) throw new Error('kek-missing');

    const sep = entry.c.indexOf(':');
    if (sep < 0 || sep !== 32) return '';

    if (!entry.iv || entry.iv.length !== 32) return '';

    const ivOuterHex = entry.c.slice(0, sep);
    const outerCipher = entry.c.slice(sep + 1);

    let inner: string;
    try {
      inner = CryptoJS.AES.decrypt(outerCipher, kek, {
        iv: hexToWordArray(ivOuterHex),
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
      }).toString(CryptoJS.enc.Utf8);
    } catch {
      return '';
    }
    if (!inner) return '';

    const dk = await deriveScryptKey(pin, pinSaltHex(email, member));
    try {
      return CryptoJS.AES.decrypt(inner, dk, {
        iv: hexToWordArray(entry.iv),
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
      }).toString(CryptoJS.enc.Utf8);
    } catch {
      return '';
    }
  }

  return decryptWithPin(entry.c, pin, email, member);
}

export async function deriveEvmAddress(privateKeyHex: string): Promise<string> {

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
      ...(entry.ver !== undefined ? { ver: entry.ver } : {}),
      ...(entry.iv !== undefined ? { iv: entry.iv } : {}),
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
      ...(entry.ver !== undefined ? { ver: entry.ver } : {}),
      ...(entry.iv !== undefined ? { iv: entry.iv } : {}),
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

  const cached = tryGetCachedWallets(email, member, pin);
  if (cached) {
    console.log('[unlockUserWallets] 세션 캐시 hit — scrypt 우회');
    return { ok: true, wallets: cached };
  }

  const entries = await findEntriesForUser(email, member);
  const allWallets: WalletKey[] = [];
  const targets: WalletNetwork[] = ['eth', 'pol'];

  const candidates = targets.filter((n) => entries[n] !== null);
  if (candidates.length === 0) return { ok: false, reason: 'no-entries' };

  for (const network of candidates) {
    const entry = entries[network]!;
    if (entry.s !== 's1') {
      return { ok: false, reason: `${network}:not-set-up` };
    }

    let plaintext: string;
    try {
      plaintext = await decryptEntry(entry, pin, email, member);
    } catch (e) {
      if ((e as Error).message === 'kek-missing') return { ok: false, reason: 'kek-missing' };
      return { ok: false, reason: `${network}:decrypt-error` };
    }
    if (!plaintext) return { ok: false, reason: 'wrong-pin' };

    let wallets: WalletKey[];
    try {
      wallets = JSON.parse(plaintext);
    } catch {
      return { ok: false, reason: 'wrong-pin' };
    }
    if (!Array.isArray(wallets) || wallets.length === 0) {
      return { ok: false, reason: 'wrong-pin' };
    }

    const v = await verifyAllWallets(wallets);
    if (!v.ok) return { ok: false, reason: 'wrong-pin' };

    if (entry.ver !== 2) {
      const { c, iv } = await encryptWithPinV2(JSON.stringify(wallets), pin, email, member);
      await upsertEntry({ u: entry.u, c, iv, ver: 2, s: 's1' });
    }

    allWallets.push(...wallets);
  }

  cacheSessionUnlock(email, member, pin, allWallets);

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

type SessionUnlockCache = {
  pinHashFast: string;
  wallets: WalletKey[];
  ts: number;
};
const _sessionUnlockCache = new Map<string, SessionUnlockCache>();

function sessionUnlockKey(email: string, member: number): string {
  const normalized = normEmail(email);
  return CryptoJS.SHA256(`xrun-session:${normalized}:${String(member)}`).toString();
}

function fastPinHash(pin: string): string {
  return CryptoJS.SHA256(`xrun-session-pin:${pin}`).toString();
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
  _sessionUnlockCache.delete(sessionUnlockKey(email, member));
}

function cacheSessionUnlock(email: string, member: number, pin: string, wallets: WalletKey[]): void {
  _sessionUnlockCache.set(sessionUnlockKey(email, member), {
    pinHashFast: fastPinHash(pin),
    wallets,
    ts: Date.now(),
  });
}

function tryGetCachedWallets(email: string, member: number, pin: string): WalletKey[] | null {
  const k = sessionUnlockKey(email, member);
  const entry = _sessionUnlockCache.get(k);
  if (!entry) return null;
  if (Date.now() - entry.ts > SESSION_UNLOCK_TTL_MS) {
    _sessionUnlockCache.delete(k);
    return null;
  }
  if (entry.pinHashFast !== fastPinHash(pin)) return null;
  return entry.wallets;
}

export interface BackupEntry {
  network: WalletNetwork;
  wallets?: WalletKey[];   
  c?: string;              
  h?: string;              
  s: 's1';                 
  ver?: 1 | 2;            
  iv?: string;            
}

export interface BackupPayload {
  v: 1 | 2;
  hash: string;         
  email: string;        
  entries: BackupEntry[];
  exported_at: number;  
}

export async function exportBackup(
  email: string,
  member: number,
  pin: string,
): Promise<BackupPayload | null> {
  const entries = await findEntriesForUser(email, member);
  const result: BackupEntry[] = [];
  for (const network of ['eth', 'pol'] as const) {
    const e = entries[network];
    if (!e || e.s !== 's1') continue;

    let plaintext: string;
    try {
      if (e.ver === 2) {

        plaintext = await decryptEntry(e, pin, email, member);
      } else {

        plaintext = decryptWithPin(e.c, pin, email, member);
      }
    } catch {

      continue;
    }
    if (!plaintext) continue;

    let wallets: WalletKey[];
    try {
      wallets = JSON.parse(plaintext);
    } catch {
      continue;
    }
    if (!Array.isArray(wallets) || wallets.length === 0) continue;

    result.push({ network, wallets, s: 's1' });
  }
  if (result.length === 0) return null;
  const normalized = normEmail(email);
  return {
    v: 2,
    hash: CryptoJS.SHA256(normalized).toString(),
    email: normalized,
    entries: result,
    exported_at: Date.now(),
  };
}

function pseudoRandomIv(): CryptoJS.lib.WordArray {
  const words: number[] = [];
  for (let i = 0; i < 4; i++) {
    words.push((Math.random() * 0x100000000) | 0);
  }
  return CryptoJS.lib.WordArray.create(words, 16);
}

export function encryptBackupJson(json: string, pin: string): string {
  const keyHex = CryptoJS.SHA256(pin).toString();
  const key = CryptoJS.enc.Hex.parse(keyHex);
  const iv = pseudoRandomIv();
  const cipher = CryptoJS.AES.encrypt(json, key, {
    iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });
  const ivHex = iv.toString(CryptoJS.enc.Hex);

  return `${ivHex}:${cipher.toString()}`;
}

export async function encryptBackupJsonV2(json: string, secret: string): Promise<string> {
  const saltHex = randomIvHex() + randomIvHex(); 
  const ivHex = randomIvHex();                   
  const key = await deriveScryptKey(secret, saltHex);
  const cipher = CryptoJS.AES.encrypt(json, key, {
    iv: hexToWordArray(ivHex),
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  }).toString();
  return `bv2:${saltHex}:${ivHex}:${cipher}`;
}

export async function decryptBackupJsonAny(encrypted: string, secret: string): Promise<string> {
  if (encrypted.startsWith('bv2:')) {

    const rest = encrypted.slice(4); 
    const sep1 = rest.indexOf(':');
    if (sep1 < 0) return ''; 
    const saltHex = rest.slice(0, sep1);
    const afterSalt = rest.slice(sep1 + 1);
    const sep2 = afterSalt.indexOf(':');
    if (sep2 < 0) return ''; 
    const ivHex = afterSalt.slice(0, sep2);
    const cipher = afterSalt.slice(sep2 + 1);

    if (saltHex.length !== 64 || ivHex.length !== 32 || !cipher) return '';
    const key = await deriveScryptKey(secret, saltHex);
    try {
      return CryptoJS.AES.decrypt(cipher, key, {
        iv: hexToWordArray(ivHex),
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
      }).toString(CryptoJS.enc.Utf8);
    } catch {

      return '';
    }
  }
  return decryptBackupJson(encrypted, secret); 
}

export function decryptBackupJson(encrypted: string, pin: string): string {
  const idx = encrypted.indexOf(':');
  if (idx <= 0) throw new Error('invalid backup format');
  const ivHex = encrypted.slice(0, idx);
  const cipherB64 = encrypted.slice(idx + 1);
  const keyHex = CryptoJS.SHA256(pin).toString();
  const key = CryptoJS.enc.Hex.parse(keyHex);
  const iv = CryptoJS.enc.Hex.parse(ivHex);
  const decrypted = CryptoJS.AES.decrypt(cipherB64, key, {
    iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });
  return decrypted.toString(CryptoJS.enc.Utf8);
}

export interface RestoreResult {
  ok: boolean;
  imported: WalletNetwork[];
  skipped: { network: string; reason: string }[];
  reason?: string;
}

export async function restoreBackup(
  payload: BackupPayload,
  email: string,
  member: number,
  pin: string,
): Promise<RestoreResult> {
  if (payload.v !== 1 && payload.v !== 2) {
    return { ok: false, imported: [], skipped: [], reason: 'invalid-version' };
  }
  if (!Array.isArray(payload.entries) || payload.entries.length === 0) {
    return { ok: false, imported: [], skipped: [], reason: 'empty-entries' };
  }
  const normalized = normEmail(email);
  if (normEmail(payload.email) !== normalized) {
    return { ok: false, imported: [], skipped: [], reason: 'email-mismatch' };
  }
  const expectedHash = CryptoJS.SHA256(normalized).toString();
  if (payload.hash !== expectedHash) {
    return { ok: false, imported: [], skipped: [], reason: 'hash-mismatch' };
  }

  const imported: WalletNetwork[] = [];
  const skipped: { network: string; reason: string }[] = [];

  for (const e of payload.entries) {
    if (e.network !== 'eth' && e.network !== 'pol') {
      skipped.push({ network: String(e.network), reason: 'unknown-network' });
      continue;
    }
    if (e.s !== 's1') {
      skipped.push({ network: e.network, reason: 'malformed' });
      continue;
    }

    if (payload.v === 2) {

      if (!e.wallets || !Array.isArray(e.wallets) || e.wallets.length === 0) {
        skipped.push({ network: e.network, reason: 'malformed-v2-no-wallets' });
        continue;
      }
      const v = await verifyAllWallets(e.wallets);
      if (!v.ok) {
        skipped.push({ network: e.network, reason: `verify-fail:${v.failed.join(',')}` });
        continue;
      }

      const { c: newC, iv: newIv } = await encryptWithPinV2(
        JSON.stringify(e.wallets),
        pin,
        email,
        member,
      );
      await upsertEntry({
        u: userHash(email, member, e.network),
        c: newC,
        iv: newIv,
        ver: 2,
        s: 's1',
      });
      imported.push(e.network);
    } else {

      if (!e.c) {
        skipped.push({ network: e.network, reason: 'malformed' });
        continue;
      }
      if (!e.h) {
        skipped.push({ network: e.network, reason: 'malformed-v1-no-h' });
        continue;
      }
      const expectedH = pinVerifyHash(pin, email, member);
      if (e.h !== expectedH) {
        skipped.push({ network: e.network, reason: 'wrong-pin' });
        continue;
      }
      let plaintext: string;
      try {
        plaintext = decryptWithPin(e.c, pin, email, member);
      } catch {
        skipped.push({ network: e.network, reason: 'decrypt-error' });
        continue;
      }
      if (!plaintext) {
        skipped.push({ network: e.network, reason: 'decrypt-empty' });
        continue;
      }
      let wallets: WalletKey[];
      try {
        wallets = JSON.parse(plaintext);
      } catch {
        skipped.push({ network: e.network, reason: 'json-parse-fail' });
        continue;
      }
      if (!Array.isArray(wallets) || wallets.length === 0) {
        skipped.push({ network: e.network, reason: 'empty-array' });
        continue;
      }
      const v = await verifyAllWallets(wallets);
      if (!v.ok) {
        skipped.push({ network: e.network, reason: `verify-fail:${v.failed.join(',')}` });
        continue;
      }

      const { c: newC, iv: newIv } = await encryptWithPinV2(plaintext, pin, email, member);
      await upsertEntry({
        u: userHash(email, member, e.network),
        c: newC,
        iv: newIv,
        ver: 2,
        s: 's1',
      });
      imported.push(e.network);
    }
  }

  return {
    ok: imported.length > 0,
    imported,
    skipped,
  };
}

export interface PlainBackupPayload {
  v: 1;
  warning: 'PLAIN_TEXT_DO_NOT_SHARE';
  email: string;
  wallets: Array<{
    network: WalletNetwork;
    wallet_code: string;
    address: string;
    private_key: string;     
  }>;
  exported_at: number;
}

export async function setupPinForUser(
  wallets: WalletKey[],
  pin: string,
  email: string,
  member: number,
): Promise<void> {
  const grouped: Partial<Record<WalletNetwork, WalletKey[]>> = {};
  for (const w of wallets) {
    const net = NETWORK_MAP[w.wallet_code];
    if (!net) continue;
    (grouped[net] ??= []).push(w);
  }
  for (const [network, group] of Object.entries(grouped) as [WalletNetwork, WalletKey[]][]) {
    const { c, iv } = await encryptWithPinV2(JSON.stringify(group), pin, email, member);
    await upsertEntry({ u: userHash(email, member, network), c, iv, ver: 2, s: 's1' });
  }
}

export interface RestorePlainResult {
  ok: boolean;
  imported: WalletNetwork[];
  skipped: { wallet_code: string; reason: string }[];
  reason?: string;
}

export async function restorePlainBackup(
  payload: PlainBackupPayload,
  email: string,
  member: number,
  pin: string,
): Promise<RestorePlainResult> {
  if (payload.v !== 1 || payload.warning !== 'PLAIN_TEXT_DO_NOT_SHARE') {
    return { ok: false, imported: [], skipped: [], reason: 'invalid-format' };
  }
  if (!Array.isArray(payload.wallets) || payload.wallets.length === 0) {
    return { ok: false, imported: [], skipped: [], reason: 'empty-wallets' };
  }
  const normalized = normEmail(email);
  if (normEmail(payload.email) !== normalized) {
    return { ok: false, imported: [], skipped: [], reason: 'email-mismatch' };
  }

  const grouped: Record<WalletNetwork, WalletKey[]> = { eth: [], pol: [] };
  const skipped: { wallet_code: string; reason: string }[] = [];

  for (const w of payload.wallets) {
    const code = w.wallet_code || '?';
    if (w.network !== 'eth' && w.network !== 'pol') {
      skipped.push({ wallet_code: code, reason: 'unknown-network' });
      continue;
    }
    if (!w.private_key || !w.address) {
      skipped.push({ wallet_code: code, reason: 'malformed' });
      continue;
    }
    if (!/^(0x)?[0-9a-fA-F]{64}$/.test(w.private_key)) {
      skipped.push({ wallet_code: code, reason: 'pk-format' });
      continue;
    }
    grouped[w.network].push({
      wallet_code: w.wallet_code,
      address: w.address,
      private_key: w.private_key.startsWith('0x') ? w.private_key : '0x' + w.private_key,
      derivation_path: '',
    });
  }

  const imported: WalletNetwork[] = [];
  for (const network of ['eth', 'pol'] as const) {
    const wallets = grouped[network];
    if (wallets.length === 0) continue;
    const v = await verifyAllWallets(wallets);
    if (!v.ok) {
      for (const f of v.failed) {
        skipped.push({ wallet_code: f, reason: 'verify-fail' });
      }
      continue;
    }
    const plaintext = JSON.stringify(wallets);
    const { c, iv } = await encryptWithPinV2(plaintext, pin, email, member);
    await upsertEntry({
      u: userHash(email, member, network),
      c,
      iv,
      ver: 2,
      s: 's1',
    });
    imported.push(network);
  }

  return {
    ok: imported.length > 0,
    imported,
    skipped,
  };
}

export function buildPlainBackup(
  email: string,
  wallets: WalletKey[],
): PlainBackupPayload {
  const list: PlainBackupPayload['wallets'] = [];
  for (const w of wallets) {
    const network = NETWORK_MAP[w.wallet_code];
    if (!network) continue;
    const pk = w.private_key.startsWith('0x') ? w.private_key : '0x' + w.private_key;
    list.push({ network, wallet_code: w.wallet_code, address: w.address, private_key: pk });
  }
  return {
    v: 1,
    warning: 'PLAIN_TEXT_DO_NOT_SHARE',
    email: normEmail(email),
    wallets: list,
    exported_at: Date.now(),
  };
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
