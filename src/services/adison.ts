

import { NativeModules, Platform } from 'react-native';
import SHA256 from 'crypto-js/sha256';
import EncHex from 'crypto-js/enc-hex';
import { getEnv } from '../utils/env';

const { AdisonModule } = NativeModules as {
  AdisonModule?: {
    initialize: (appKey: string, server: string) => Promise<boolean>;
    setConfig: (title: string, listType: string, themeMode: string) => void;
    setUid: (uid: string) => void;
    unsetUid: () => void;
    setTargeting: (birthYear: number, gender: string | null) => void;
    showOfferwall: () => Promise<boolean>;
    showOfferwallAd: (adId: number, keepParent: boolean) => Promise<boolean>;
    availableReward: () => Promise<{ name: string; unit: string; points: number }>;
  };
};

export interface AdisonReward {
  name: string;
  unit: string;
  points: number;
}

export type AdisonListType = 'LIST' | 'FEED';
export type AdisonTheme = 'Light' | 'Dark' | 'System';

let initialized = false;

const isAvailable = (): boolean => !!AdisonModule;

const getAppKey = (): string => {
  const env = getEnv();
  const isDev = (env.ADISON_SERVER || 'production').toLowerCase() === 'development';
  if (Platform.OS === 'ios') {
    return isDev ? env.ADISON_APP_KEY_IOS_DEV : env.ADISON_APP_KEY_IOS_PRD;
  }
  return isDev ? env.ADISON_APP_KEY_ANDROID_DEV : env.ADISON_APP_KEY_ANDROID_PRD;
};

export const getAdisonCallbackUrl = (): string => {
  const env = getEnv();
  const isDev = (env.ADISON_SERVER || 'production').toLowerCase() === 'development';
  return isDev ? env.ADISON_CALLBACK_URL_DEV : env.ADISON_CALLBACK_URL_PRD;
};

export const buildAdisonUid = (memberId: string | number): string => {
  const env = getEnv();
  const salt = env.ADISON_UID_SALT || 'xrun-adison-v1';
  const input = `${salt}:${String(memberId)}`;
  return SHA256(input).toString(EncHex);
};

export const initAdison = async (): Promise<boolean> => {
  if (!isAvailable()) {
    if (__DEV__) console.warn('[adison] native module not available');
    return false;
  }
  if (initialized) return true;
  try {
    const env = getEnv();
    const appKey = getAppKey();
    if (!appKey) {
      console.warn(
        `[adison] 매체 앱 키가 비어 있습니다. ADISON_SERVER=${env.ADISON_SERVER}. DEV 전환이라면 env.ts 에 ADISON_APP_KEY_*_DEV 를 채워주세요.`
      );
      return false;
    }
    await AdisonModule!.initialize(appKey, env.ADISON_SERVER || 'production');
    AdisonModule!.setConfig(env.ADISON_OFFERWALL_TITLE || '바로 적립 받기', 'LIST', 'Light');
    initialized = true;
    return true;
  } catch (e: any) {
    console.warn('[adison] init failed', e?.message ?? e);
    return false;
  }
};

export const setAdisonConfig = (
  title: string,
  listType: AdisonListType = 'LIST',
  theme: AdisonTheme = 'Light',
) => {
  if (!isAvailable()) return;
  try {
    AdisonModule!.setConfig(title, listType, theme);
  } catch (e: any) {
    console.warn('[adison] setConfig failed', e?.message ?? e);
  }
};

const xrunGenderToAdison = (code?: number | string | null): 'M' | 'F' | null => {
  const n = typeof code === 'string' ? parseInt(code, 10) : code;
  if (n === 2110) return 'M';
  if (n === 2111) return 'F';
  return null;
};

const xrunAgeToBirthYear = (code?: number | string | null): number => {
  const n = typeof code === 'string' ? parseInt(code, 10) : code;
  const currentYear = new Date().getFullYear();

  switch (n) {
    case 2210: return currentYear - 15; 
    case 2220: return currentYear - 25; 
    case 2230: return currentYear - 35; 
    case 2240: return currentYear - 45; 
    case 2250: return currentYear - 55; 
    default: return 0;
  }
};

export interface AdisonBindUserDataInput {

  gender?: number | string | null;

  age?: number | string | null;

  birthYear?: number | null;
}

export const bindAdisonUid = (
  memberId: string | number,
  userData?: AdisonBindUserDataInput,
): string | null => {
  if (!isAvailable()) return null;
  const uid = buildAdisonUid(memberId);
  try {
    AdisonModule!.setUid(uid);
  } catch (e: any) {
    console.warn('[adison] setUid failed', e?.message ?? e);
  }

  if (userData) {
    const gender = xrunGenderToAdison(userData.gender);
    const birthYear =
      userData.birthYear && userData.birthYear > 0
        ? userData.birthYear
        : xrunAgeToBirthYear(userData.age);
    if (gender || birthYear > 0) {
      try {
        AdisonModule!.setTargeting(birthYear, gender);
      } catch (e: any) {
        console.warn('[adison] setTargeting failed', e?.message ?? e);
      }
    }
  }

  return uid;
};

export const unbindAdisonUid = () => {
  if (!isAvailable()) return;
  try {
    AdisonModule!.unsetUid();
  } catch (e: any) {
    console.warn('[adison] unsetUid failed', e?.message ?? e);
  }
};

export const setAdisonTargeting = (birthYear?: number, gender?: 'M' | 'F' | null) => {
  if (!isAvailable()) return;
  try {
    AdisonModule!.setTargeting(birthYear ?? 0, gender ?? null);
  } catch (e: any) {
    console.warn('[adison] setTargeting failed', e?.message ?? e);
  }
};

export const showAdisonOfferwall = async (): Promise<boolean> => {
  if (!isAvailable()) return false;
  if (!initialized) {
    const ok = await initAdison();
    if (!ok) return false;
  }
  try {
    await AdisonModule!.showOfferwall();
    return true;
  } catch (e: any) {
    console.warn('[adison] showOfferwall failed', e?.message ?? e);
    return false;
  }
};

export const showAdisonOfferwallAd = async (
  adId: number,
  keepParent = true,
): Promise<boolean> => {
  if (!isAvailable()) return false;
  if (!initialized) {
    const ok = await initAdison();
    if (!ok) return false;
  }
  try {
    await AdisonModule!.showOfferwallAd(adId, keepParent);
    return true;
  } catch (e: any) {
    console.warn('[adison] showOfferwallAd failed', e?.message ?? e);
    return false;
  }
};

export const getAdisonAvailableReward = async (): Promise<AdisonReward | null> => {
  if (!isAvailable()) return null;
  try {
    const result = await AdisonModule!.availableReward();
    return result;
  } catch (e: any) {
    console.warn('[adison] availableReward failed', e?.message ?? e);
    return null;
  }
};

export const isAdisonAvailable = isAvailable;
