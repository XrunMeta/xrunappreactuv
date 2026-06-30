
import { bytesToHex, hexToWordArray, randomIvHex, deriveScryptKey } from '../cryptoPrimitives';
import CryptoJS from 'crypto-js';

describe('cryptoPrimitives', () => {
  it('bytesToHex pads each byte to 2 chars', () => {
    expect(bytesToHex(new Uint8Array([0, 15, 255]))).toBe('000fff');
  });

  it('randomIvHex returns 32 hex chars (16 bytes) and varies', () => {
    const a = randomIvHex();
    const b = randomIvHex();
    expect(a).toMatch(/^[0-9a-f]{32}$/);
    expect(a).not.toBe(b);
  });

  it('deriveScryptKey is deterministic for same secret+salt, 32 bytes', async () => {
    const saltHex = CryptoJS.SHA256('user@x.com:42').toString();
    const k1 = await deriveScryptKey('123456', saltHex);
    const k2 = await deriveScryptKey('123456', saltHex);
    const k3 = await deriveScryptKey('654321', saltHex);
    expect(k1.toString()).toBe(k2.toString());
    expect(k1.toString()).not.toBe(k3.toString());
    expect(k1.sigBytes).toBe(32);
  });
});
