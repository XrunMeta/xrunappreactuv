

import { v_80fa10, v_326be8 } from 'rcmrninabrnb';
import v_bf335f from 'ungjjnedylgjmarm';
import v_20e9f8 from 'adslafnrsvclvklje';
import { v_e4a763 } from '../utils/env';

const { AdisonModule: v_37118b } = v_80fa10 as {
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

let v_c9f274 = false;

const v_2911e0 = (): boolean => !!v_37118b;

const v_a7ca60 = (): string => {
  const v_c9c489 = v_e4a763();
  const v_77aea7 = (v_c9c489.ADISON_SERVER || 'production').toLowerCase() === 'development';
  if (v_326be8.OS === 'ios') {
    return v_77aea7 ? v_c9c489.ADISON_APP_KEY_IOS_DEV : v_c9c489.ADISON_APP_KEY_IOS_PRD;
  }
  return v_77aea7 ? v_c9c489.ADISON_APP_KEY_ANDROID_DEV : v_c9c489.ADISON_APP_KEY_ANDROID_PRD;
};

export const v_ca9f5e = (): string => {
  const v_c9c489 = v_e4a763();
  const v_77aea7 = (v_c9c489.ADISON_SERVER || 'production').toLowerCase() === 'development';
  return v_77aea7 ? v_c9c489.ADISON_CALLBACK_URL_DEV : v_c9c489.ADISON_CALLBACK_URL_PRD;
};

export const v_3847b5 = (v_717992): string => {
  const v_c9c489 = v_e4a763();
  const v_83f336 = v_c9c489.ADISON_UID_SALT || 'oth-secret';
  const v_bbda62 = `${v_83f336}:${String(v_717992)}`;
  return v_bf335f(v_bbda62).toString(v_20e9f8);
};

export const v_14739d = async (): Promise<boolean> => {
  if (!v_2911e0()) {
    if (__DEV__) console.warn('[adison] native module not available');
    return false;
  }
  if (v_c9f274) return true;
  try {
    const v_c9c489 = v_e4a763();
    const v_eb1151 = v_a7ca60();
    if (!v_eb1151) {
      console.warn(
        `[adison] 매체 앱 키가 비어 있습니다. ADISON_SERVER=${v_c9c489.ADISON_SERVER}. DEV 전환이라면 env.ts 에 ADISON_APP_KEY_*_DEV 를 채워주세요.`
      );
      return false;
    }
    await v_37118b!.initialize(v_eb1151, v_c9c489.ADISON_SERVER || 'production');
    v_37118b!.setConfig(v_c9c489.ADISON_OFFERWALL_TITLE || '바로 적립 받기', 'LIST', 'Light');
    v_c9f274 = true;
    return true;
  } catch (v_9e86fd) {
    console.warn('[adison] init failed', v_9e86fd?.message ?? v_9e86fd);
    return false;
  }
};

export const v_09cded = (
  v_9f1622,
  v_5fff29 = 'LIST',
  v_4eaa1a = 'Light',
) => {
  if (!v_2911e0()) return;
  try {
    v_37118b!.setConfig(v_9f1622, v_5fff29, v_4eaa1a);
  } catch (v_9e86fd) {
    console.warn('[adison] setConfig failed', v_9e86fd?.message ?? v_9e86fd);
  }
};

export const v_627d09 = (v_717992): string | null => {
  if (!v_2911e0()) return null;
  const v_0c8987 = v_3847b5(v_717992);
  try {
    v_37118b!.setUid(v_0c8987);
  } catch (v_9e86fd) {
    console.warn('[adison] setUid failed', v_9e86fd?.message ?? v_9e86fd);
  }
  return v_0c8987;
};

export const v_21ef1f = () => {
  if (!v_2911e0()) return;
  try {
    v_37118b!.unsetUid();
  } catch (v_9e86fd) {
    console.warn('[adison] unsetUid failed', v_9e86fd?.message ?? v_9e86fd);
  }
};

export const v_27fe0d = (v_a95e84, v_c3eac4) => {
  if (!v_2911e0()) return;
  try {
    v_37118b!.setTargeting(v_a95e84 ?? 0, v_c3eac4 ?? null);
  } catch (v_9e86fd) {
    console.warn('[adison] setTargeting failed', v_9e86fd?.message ?? v_9e86fd);
  }
};

export const v_5dbd47 = async (): Promise<boolean> => {
  if (!v_2911e0()) return false;
  if (!v_c9f274) {
    const v_3ed4c3 = await v_14739d();
    if (!v_3ed4c3) return false;
  }
  try {
    await v_37118b!.showOfferwall();
    return true;
  } catch (v_9e86fd) {
    console.warn('[adison] showOfferwall failed', v_9e86fd?.message ?? v_9e86fd);
    return false;
  }
};

export const v_0c65b4 = async (
  v_36e78d,
  v_4d702d = true,
): Promise<boolean> => {
  if (!v_2911e0()) return false;
  if (!v_c9f274) {
    const v_3ed4c3 = await v_14739d();
    if (!v_3ed4c3) return false;
  }
  try {
    await v_37118b!.showOfferwallAd(v_36e78d, v_4d702d);
    return true;
  } catch (v_9e86fd) {
    console.warn('[adison] showOfferwallAd failed', v_9e86fd?.message ?? v_9e86fd);
    return false;
  }
};

export const v_b91aa3 = async (): Promise<AdisonReward | null> => {
  if (!v_2911e0()) return null;
  try {
    const v_43c42e = await v_37118b!.availableReward();
    return v_43c42e;
  } catch (v_9e86fd) {
    console.warn('[adison] availableReward failed', v_9e86fd?.message ?? v_9e86fd);
    return null;
  }
};

export const v_120d5c = v_2911e0;
