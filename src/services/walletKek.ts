import CryptoJS from 'crypto-js';
import * as SecureStore from 'expo-secure-store';
import * as Crypto from 'expo-crypto';
import { bytesToHex, hexToWordArray } from './cryptoPrimitives';

export const KEK_STORAGE_KEY = '__xs_kek';

const STORE_OPTS: SecureStore.SecureStoreOptions = {
  keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY,

};

export async function loadKek(): Promise<CryptoJS.lib.WordArray | null> {
  const hex = await SecureStore.getItemAsync(KEK_STORAGE_KEY, STORE_OPTS);
  return hex ? hexToWordArray(hex) : null;
}

let _inflight: Promise<CryptoJS.lib.WordArray> | null = null;

export async function getOrCreateKek(): Promise<CryptoJS.lib.WordArray> {
  if (_inflight) return _inflight;
  _inflight = (async () => {
    const existing = await loadKek();
    if (existing) return existing;
    const hex = bytesToHex(Crypto.getRandomBytes(32));
    await SecureStore.setItemAsync(KEK_STORAGE_KEY, hex, STORE_OPTS);
    return hexToWordArray(hex);
  })();
  try {
    return await _inflight;
  } finally {
    _inflight = null;
  }
}

export async function deleteKek(): Promise<void> {
  await SecureStore.deleteItemAsync(KEK_STORAGE_KEY, STORE_OPTS);
}
