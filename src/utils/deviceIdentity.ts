

import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import * as Application from 'expo-application';
import * as Crypto from 'expo-crypto';
import { Platform } from 'react-native';

const SECURE_STORE_KEY = 'xrun_device_id';
const MIRROR_KEY = 'xrun_device_id_v2';

let _memCache: string | null = null;

function generateFallbackUuid(): string {
  try {
    if (typeof (Crypto as any).randomUUID === 'function') {
      return (Crypto as any).randomUUID();
    }
  } catch {  }
  const bytes = Crypto.getRandomBytes(16);
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

export async function getInstallUuid(): Promise<string> {
  if (_memCache) return _memCache;

  try {
    const stored = await SecureStore.getItemAsync(SECURE_STORE_KEY);
    if (stored) {
      _memCache = stored;
      return stored;
    }
  } catch {  }

  let seed: string | null = null;
  try {
    if (Platform.OS === 'ios') {
      seed = (await Application.getIosIdForVendorAsync()) || null;
    } else if (Platform.OS === 'android') {
      seed = Application.getAndroidId() || null;
    }
  } catch {  }

  if (!seed) {
    seed = generateFallbackUuid();
  }

  _memCache = seed;
  try { await SecureStore.setItemAsync(SECURE_STORE_KEY, seed); } catch {  }
  try { await AsyncStorage.setItem(MIRROR_KEY, seed); } catch {  }

  return seed;
}

export function __resetInstallUuidCacheForTests(): void {
  _memCache = null;
}
