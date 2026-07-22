

import {
  encryptWithPinV2,
  decryptEntry,
  encryptWithPin, 
  unlockUserWallets,
  upsertEntry,
  userHash,
  pinVerifyHash,
  readVault,
  deriveEvmAddress,
  setupPinForUser,

  encryptBackupJsonV2,
  decryptBackupJsonAny,
  encryptBackupJson,
  exportBackup,
  restoreBackup,
  findEntriesForUser,

  detectLegacyEntries,

  forceReseedEntry,
} from '../walletKeyStore';
import type { VaultEntry } from '../walletKeyStore';
import { deleteKek } from '../walletKek';

const SecureStore = require('expo-secure-store');
const AsyncStorage = require('@react-native-async-storage/async-storage');

beforeEach(async () => { SecureStore.__reset(); await AsyncStorage.clear(); });

const EMAIL = 'a@x.com';
const MEMBER = 7;
const PK = '0x' + '11'.repeat(32);

async function deriveAddr(): Promise<string> {
  return deriveEvmAddress(PK);
}
const PT = JSON.stringify([
  {
    wallet_code: 'c1',
    address: '0xabc',
    private_key: '0x' + '11'.repeat(32),
    derivation_path: '',
  },
]);

it('v2 round-trip: encrypt→decrypt returns plaintext', async () => {
  const { c, iv } = await encryptWithPinV2(PT, '123456', EMAIL, MEMBER);
  const entry: VaultEntry = { ver: 2, u: 'u', c, iv, s: 's1' };
  expect(await decryptEntry(entry, '123456', EMAIL, MEMBER)).toBe(PT);
});

it('v2 wrong pin always returns empty string — no throw, no PT (mizu M-1)', async () => {
  const { c, iv } = await encryptWithPinV2(PT, '123456', EMAIL, MEMBER);
  const entry: VaultEntry = { ver: 2, u: 'u', c, iv, s: 's1' };

  for (const wrongPin of ['000000', '111111', '999999', '654321']) {
    const out = await decryptEntry(entry, wrongPin, EMAIL, MEMBER);
    expect(out).toBe('');
  }
});

it('v1 entry still decrypts via legacy path', async () => {
  const v1c = encryptWithPin(PT, '123456', EMAIL, MEMBER); 
  const entry: VaultEntry = { ver: 1, u: 'u', c: v1c, s: 's1', h: 'x' };
  expect(await decryptEntry(entry, '123456', EMAIL, MEMBER)).toBe(PT);
});

it('v2 corrupted c — no separator returns empty string', async () => {

  const { iv } = await encryptWithPinV2(PT, '123456', EMAIL, MEMBER);
  const entry: VaultEntry = {
    ver: 2,
    u: 'u',
    c: 'deadbeef'.repeat(8), 
    iv,
    s: 's1',
  };
  expect(await decryptEntry(entry, '123456', EMAIL, MEMBER)).toBe('');
});

it('v2 corrupted c — outer IV length != 32 returns empty string', async () => {

  const { iv } = await encryptWithPinV2(PT, '123456', EMAIL, MEMBER);
  const entry: VaultEntry = {
    ver: 2,
    u: 'u',
    c: 'deadbeef0000:somegarbagedcipher', 
    iv,
    s: 's1',
  };
  expect(await decryptEntry(entry, '123456', EMAIL, MEMBER)).toBe('');
});

it('v2 entry without iv returns empty string', async () => {
  const { c } = await encryptWithPinV2(PT, '123456', EMAIL, MEMBER);

  const entry: VaultEntry = { ver: 2, u: 'u', c, s: 's1' };
  expect(await decryptEntry(entry, '123456', EMAIL, MEMBER)).toBe('');
});

it('v2 entry with short iv (< 32 hex chars) returns empty string', async () => {
  const { c } = await encryptWithPinV2(PT, '123456', EMAIL, MEMBER);

  const entry: VaultEntry = { ver: 2, u: 'u', c, iv: 'deadbeef'.repeat(2), s: 's1' };
  expect(await decryptEntry(entry, '123456', EMAIL, MEMBER)).toBe('');
});

it('v1 entry is migrated to v2 on successful unlock', async () => {

  const addr = await deriveAddr();
  const wallets = [{ wallet_code: 'c1', address: addr, private_key: PK, derivation_path: '' }];
  const pt = JSON.stringify(wallets);
  await upsertEntry({
    u: userHash(EMAIL, MEMBER, 'eth'),
    c: encryptWithPin(pt, '123456', EMAIL, MEMBER),
    h: pinVerifyHash('123456', EMAIL, MEMBER),
    s: 's1',
  } as any);

  const res = await unlockUserWallets('123456', EMAIL, MEMBER);
  expect(res.ok).toBe(true);

  const vault = await readVault();
  const e = vault.find((x) => x.u === userHash(EMAIL, MEMBER, 'eth'));
  expect(e?.ver).toBe(2);   
  expect(e?.h).toBeUndefined(); 
});

it('backup v2 round-trip with passphrase', async () => {
  const enc = await encryptBackupJsonV2('{"hello":1}', 'StrongPass!234');
  expect(enc.startsWith('bv2:')).toBe(true);
  expect(await decryptBackupJsonAny(enc, 'StrongPass!234')).toBe('{"hello":1}');
});

it('legacy backup (SHA256(PIN)) still restores with PIN only', async () => {
  const legacy = encryptBackupJson('{"hello":1}', '123456');
  expect(await decryptBackupJsonAny(legacy, '123456')).toBe('{"hello":1}');
});

it('B-1: migrated v2 vault entry exports and restores end-to-end (KEK-free plain PK)', async () => {

  const addr = await deriveAddr();
  const wallets = [{ wallet_code: 'c1', address: addr, private_key: PK, derivation_path: '' }];
  const pt = JSON.stringify(wallets);
  const { c, iv } = await encryptWithPinV2(pt, '123456', EMAIL, MEMBER);
  await upsertEntry({
    u: userHash(EMAIL, MEMBER, 'eth'),
    c,
    iv,
    ver: 2,
    s: 's1',
  });

  const payload = await exportBackup(EMAIL, MEMBER, '123456');
  expect(payload).not.toBeNull();
  const ethEntry = payload!.entries.find((e) => e.network === 'eth');
  expect(ethEntry).toBeDefined();

  expect(ethEntry!.wallets).toBeDefined();
  expect(Array.isArray(ethEntry!.wallets)).toBe(true);
  expect(ethEntry!.c).toBeUndefined();

  await AsyncStorage.clear();
  const result = await restoreBackup(payload!, EMAIL, MEMBER, '123456');
  expect(result.ok).toBe(true);
  expect(result.imported).toContain('eth');

  const vault = await readVault();
  const restored = vault.find((x) => x.u === userHash(EMAIL, MEMBER, 'eth'));
  expect(restored?.ver).toBe(2);
  expect(restored?.iv).toBeDefined();

  const unlock = await unlockUserWallets('123456', EMAIL, MEMBER);
  expect(unlock.ok).toBe(true);
});

it('new device: export → deleteKek (KEK 소실) → restore → unlockUserWallets succeeds (kek-missing 없음)', async () => {

  const addr = await deriveAddr();
  const wallets = [{ wallet_code: 'c1', address: addr, private_key: PK, derivation_path: '' }];
  const pt = JSON.stringify(wallets);
  const { c, iv } = await encryptWithPinV2(pt, '123456', EMAIL, MEMBER);
  await upsertEntry({
    u: userHash(EMAIL, MEMBER, 'eth'),
    c,
    iv,
    ver: 2,
    s: 's1',
  });

  const payload = await exportBackup(EMAIL, MEMBER, '123456');
  expect(payload).not.toBeNull();
  expect(payload!.v).toBe(2);

  await deleteKek();
  await AsyncStorage.clear();

  const result = await restoreBackup(payload!, EMAIL, MEMBER, '123456');
  expect(result.ok).toBe(true);
  expect(result.imported).toContain('eth');
  expect(result.skipped).toHaveLength(0);

  const unlock = await unlockUserWallets('123456', EMAIL, MEMBER);
  expect(unlock.ok).toBe(true);
  if (unlock.ok) {
    expect(unlock.wallets.some((w) => w.private_key === PK)).toBe(true);
  }
});

it('m-1: bv2 토큰 부족(salt만 있고 iv·cipher 없음) → empty string', async () => {
  expect(await decryptBackupJsonAny('bv2:aabbccdd', 'anypin')).toBe('');
});

it('m-1: bv2 salt 길이 != 64 → empty string', async () => {
  const badSalt = 'a'.repeat(32); 
  const validIv = 'b'.repeat(32);
  expect(await decryptBackupJsonAny(`bv2:${badSalt}:${validIv}:someCipher`, 'anypin')).toBe('');
});

it('m-1: bv2 iv 길이 != 32 → empty string', async () => {
  const validSalt = 'a'.repeat(64);
  const badIv = 'b'.repeat(16); 
  expect(await decryptBackupJsonAny(`bv2:${validSalt}:${badIv}:someCipher`, 'anypin')).toBe('');
});

it('m-1: bv2 cipher 빈 문자열 → empty string', async () => {
  const validSalt = 'a'.repeat(64);
  const validIv = 'b'.repeat(32);
  expect(await decryptBackupJsonAny(`bv2:${validSalt}:${validIv}:`, 'anypin')).toBe('');
});

it('C-1: encryptBackupJsonV2 with 6-digit PIN → decryptBackupJsonAny round-trip', async () => {
  const plaintext = JSON.stringify({ v: 2, wallets: [{ pk: '0x' + '11'.repeat(32) }] });
  const enc = await encryptBackupJsonV2(plaintext, '123456');
  expect(enc.startsWith('bv2:')).toBe(true);

  const parts = enc.slice(4).split(':');
  expect(parts.length).toBeGreaterThanOrEqual(3);
  expect(parts[0].length).toBe(64); 
  expect(parts[1].length).toBe(32); 
  expect(parts[2].length).toBeGreaterThan(0); 

  expect(await decryptBackupJsonAny(enc, '123456')).toBe(plaintext);

  expect(await decryptBackupJsonAny(enc, '000000')).toBe('');
});

it('newly set-up wallet is stored as ver:2 without h', async () => {
  const addr = await deriveAddr();
  await setupPinForUser(
    [{ wallet_code: 'c1', address: addr, private_key: PK, derivation_path: '' }],
    '123456',
    EMAIL,
    MEMBER,
  );
  const vault = await readVault();
  const e = vault.find((x) => x.u === userHash(EMAIL, MEMBER, 'eth'));
  expect(e?.ver).toBe(2);
  expect(e?.h).toBeUndefined();
  const res = await unlockUserWallets('123456', EMAIL, MEMBER);
  expect(res.ok).toBe(true);
});

it('restorePlainBackup stores ver:2 without h', async () => {
  const { restorePlainBackup } = require('../walletKeyStore');
  const addr = await deriveAddr();
  const payload = {
    v: 1 as const,
    warning: 'PLAIN_TEXT_DO_NOT_SHARE' as const,
    email: EMAIL,
    wallets: [{ network: 'eth' as const, wallet_code: 'c1', address: addr, private_key: PK }],
    exported_at: Date.now(),
  };
  const result = await restorePlainBackup(payload, EMAIL, MEMBER, '123456');
  expect(result.ok).toBe(true);
  const vault = await readVault();
  const e = vault.find((x) => x.u === userHash(EMAIL, MEMBER, 'eth'));
  expect(e?.ver).toBe(2);
  expect(e?.h).toBeUndefined();
  const res = await unlockUserWallets('123456', EMAIL, MEMBER);
  expect(res.ok).toBe(true);
});

it('v1 backup entry restore → re-encrypted as v2 in vault', async () => {

  const addr = await deriveAddr();
  const wallets = [{ wallet_code: 'c1', address: addr, private_key: PK, derivation_path: '' }];
  const pt = JSON.stringify(wallets);
  const { SHA256 } = require('crypto-js');
  const normEmail = EMAIL.toLowerCase().trim();

  const payload = {
    v: 1 as const,
    hash: SHA256(normEmail).toString(),
    email: normEmail,
    entries: [
      {
        network: 'eth' as const,
        c: encryptWithPin(pt, '123456', EMAIL, MEMBER),
        h: pinVerifyHash('123456', EMAIL, MEMBER),
        s: 's1' as const,
      },
    ],
    exported_at: Date.now(),
  };

  const result = await restoreBackup(payload, EMAIL, MEMBER, '123456');
  expect(result.ok).toBe(true);
  expect(result.imported).toContain('eth');

  const vault = await readVault();
  const e = vault.find((x) => x.u === userHash(EMAIL, MEMBER, 'eth'));
  expect(e?.ver).toBe(2);
  expect(e?.h).toBeUndefined();
});

it('C-1 — bv2 복원 후 vaultPin 으로 unlock 성공, passphrase 로는 실패 (decryptSecret≠vaultPin)', async () => {

  const addr = await deriveAddr();
  const wallets = [{ wallet_code: 'c1', address: addr, private_key: PK, derivation_path: '' }];
  const { SHA256 } = require('crypto-js');
  const normEmail = EMAIL.toLowerCase().trim();

  const payload = {
    v: 2 as const,
    hash: SHA256(normEmail).toString(),
    email: normEmail,
    entries: [
      {
        network: 'eth' as const,
        wallets,
        s: 's1' as const,
      },
    ],
    exported_at: Date.now(),
  };

  const passphrase = 'my-backup-passphrase!99'; 
  const vaultPin = '654321';                    

  await AsyncStorage.clear();

  const result = await restoreBackup(payload, EMAIL, MEMBER, passphrase, vaultPin);
  expect(result.ok).toBe(true);
  expect(result.imported).toContain('eth');

  const unlockOk = await unlockUserWallets(vaultPin, EMAIL, MEMBER);
  expect(unlockOk.ok).toBe(true);
  if (unlockOk.ok) {
    expect(unlockOk.wallets.some((w) => w.private_key === PK)).toBe(true);
  }

  const unlockFail = await unlockUserWallets(passphrase, EMAIL, MEMBER);
  expect(unlockFail.ok).toBe(false);
});

it('C-1 — v1 복원 하위호환: vaultPin 생략 시 decryptSecret(=PIN) 으로 vault 잠금', async () => {

  const addr = await deriveAddr();
  const wallets = [{ wallet_code: 'c1', address: addr, private_key: PK, derivation_path: '' }];
  const pt = JSON.stringify(wallets);
  const { SHA256 } = require('crypto-js');
  const normEmail = EMAIL.toLowerCase().trim();

  const payload = {
    v: 1 as const,
    hash: SHA256(normEmail).toString(),
    email: normEmail,
    entries: [
      {
        network: 'eth' as const,
        c: encryptWithPin(pt, '123456', EMAIL, MEMBER),
        h: pinVerifyHash('123456', EMAIL, MEMBER),
        s: 's1' as const,
      },
    ],
    exported_at: Date.now(),
  };

  const result = await restoreBackup(payload, EMAIL, MEMBER, '123456');
  expect(result.ok).toBe(true);
  expect(result.imported).toContain('eth');

  const unlock = await unlockUserWallets('123456', EMAIL, MEMBER);
  expect(unlock.ok).toBe(true);
});

const EMAIL_B = 'b@other.com';
const MEMBER_B = 99;

it('detectLegacyEntries returns true when current user has a v1 s1 entry', async () => {

  await upsertEntry({
    u: userHash(EMAIL, MEMBER, 'eth'),
    c: encryptWithPin(PT, '123456', EMAIL, MEMBER),
    h: pinVerifyHash('123456', EMAIL, MEMBER),
    s: 's1',
  } as any);
  expect(await detectLegacyEntries(EMAIL, MEMBER)).toBe(true);
});

it('detectLegacyEntries returns false when current user has only v2 entries', async () => {

  const { c, iv } = await encryptWithPinV2(PT, '123456', EMAIL, MEMBER);
  await upsertEntry({
    u: userHash(EMAIL, MEMBER, 'eth'),
    c,
    iv,
    ver: 2,
    s: 's1',
  });
  expect(await detectLegacyEntries(EMAIL, MEMBER)).toBe(false);
});

it('detectLegacyEntries returns false on empty vault', async () => {

  expect(await detectLegacyEntries(EMAIL, MEMBER)).toBe(false);
});

it('detectLegacyEntries returns false for current user when only OTHER account has v1 entry (cross-account non-trigger)', async () => {

  await upsertEntry({
    u: userHash(EMAIL_B, MEMBER_B, 'eth'),
    c: encryptWithPin(PT, '654321', EMAIL_B, MEMBER_B),
    h: pinVerifyHash('654321', EMAIL_B, MEMBER_B),
    s: 's1',
  } as any);

  expect(await detectLegacyEntries(EMAIL, MEMBER)).toBe(false);

  expect(await detectLegacyEntries(EMAIL_B, MEMBER_B)).toBe(true);
});

describe('T-147 forceReseedEntry', () => {
  it('s1 entry 를 강제 덮어쓰기 — c 교체, s=s0, 기존 h 제거', async () => {
    await upsertEntry({ u: 'u-t147', c: 'old-cipher', s: 's1', h: 'old-pin-hash' });
    await forceReseedEntry({ u: 'u-t147', c: 'new-cipher', s: 's0' });
    const vault = await readVault();
    const e = vault.find((x) => x.u === 'u-t147');
    expect(e?.c).toBe('new-cipher');
    expect(e?.s).toBe('s0');
    expect(e?.h).toBeUndefined();
  });
  it('entry 없으면 신규 생성', async () => {
    await forceReseedEntry({ u: 'u-t147-new', c: 'cipher-x', s: 's0' });
    const vault = await readVault();
    expect(vault.find((x) => x.u === 'u-t147-new')?.c).toBe('cipher-x');
  });
});
