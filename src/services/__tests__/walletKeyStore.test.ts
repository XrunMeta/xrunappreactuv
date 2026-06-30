

import {
  encryptWithPinV2,
  decryptEntry,
  encryptWithPin, 
} from '../walletKeyStore';
import type { VaultEntry } from '../walletKeyStore';

const SecureStore = require('expo-secure-store');

beforeEach(() => SecureStore.__reset());

const EMAIL = 'a@x.com';
const MEMBER = 7;
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
