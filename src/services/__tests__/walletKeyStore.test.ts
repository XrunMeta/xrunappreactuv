

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

it('v2 wrong pin yields non-matching plaintext (no h shortcut)', async () => {
  const { c, iv } = await encryptWithPinV2(PT, '123456', EMAIL, MEMBER);
  const entry: VaultEntry = { ver: 2, u: 'u', c, iv, s: 's1' };
  const out = await decryptEntry(entry, '000000', EMAIL, MEMBER);
  expect(out).not.toBe(PT); 
});

it('v1 entry still decrypts via legacy path', async () => {
  const v1c = encryptWithPin(PT, '123456', EMAIL, MEMBER); 
  const entry: VaultEntry = { ver: 1, u: 'u', c: v1c, s: 's1', h: 'x' };
  expect(await decryptEntry(entry, '123456', EMAIL, MEMBER)).toBe(PT);
});
