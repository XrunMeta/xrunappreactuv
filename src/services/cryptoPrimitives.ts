
import CryptoJS from 'crypto-js';
import * as Crypto from 'expo-crypto';
import { scryptAsync } from '@noble/hashes/scrypt';

export function bytesToHex(u8: Uint8Array): string {
  return Array.from(u8, (b) => b.toString(16).padStart(2, '0')).join('');
}

export function hexToWordArray(hex: string): CryptoJS.lib.WordArray {
  return CryptoJS.enc.Hex.parse(hex);
}

export function randomIvHex(): string {
  return bytesToHex(Crypto.getRandomBytes(16));
}

const SCRYPT_PARAMS = { N: 2 ** 14, r: 8, p: 1, dkLen: 32 } as const;

export async function deriveScryptKey(
  secret: string,
  saltHex: string,
): Promise<CryptoJS.lib.WordArray> {
  const saltBytes = Uint8Array.from(
    saltHex.match(/.{2}/g)!.map((h) => parseInt(h, 16)),
  );
  const dk = await scryptAsync(secret, saltBytes, SCRYPT_PARAMS);
  return hexToWordArray(bytesToHex(dk));
}
