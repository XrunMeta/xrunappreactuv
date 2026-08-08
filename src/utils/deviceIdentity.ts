

import AsyncStorage from '@react-native-async-storage/async-storage';

const CACHE_KEY = '__xrun_device_id_v1';
let _memCache: string | null = null;

export async function getDeviceId(): Promise<string | null> {
  if (_memCache) return _memCache;
  try {
    const cached = await AsyncStorage.getItem(CACHE_KEY);
    if (cached) {
      _memCache = cached;
      return cached;
    }
  } catch {  }
  try {
    const { collectDeviceInfo } = require('./napApiUtils');
    const info = await collectDeviceInfo();
    const raw =
      (info?.adid && String(info.adid).replace(/^0+$/, '')) ||
      (info?.deviceId && String(info.deviceId)) ||
      '';
    const cleaned = raw.trim();
    if (!cleaned || cleaned === 'unknown-unknown-unknown') return null;
    _memCache = cleaned;
    try { await AsyncStorage.setItem(CACHE_KEY, cleaned); } catch {  }
    return cleaned;
  } catch (e) {
    console.warn('[deviceIdentity] failed to resolve device_id:', e);
    return null;
  }
}
