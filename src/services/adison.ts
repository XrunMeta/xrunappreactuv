

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
    availableReward: () => Promise<{ points: number }>;
  };
};

export interface AdisonReward {
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
    const v_b7fbdb = v_c9c489.ADISON_SERVER || 'production';
    console.log(`[adison] ✅ 초기화 시작 — server=${v_b7fbdb}, appKey=${v_eb1151.slice(0, 8)}..., platform=${v_326be8.OS}`);
    await v_37118b!.initialize(v_eb1151, v_b7fbdb);
    v_37118b!.setConfig(v_c9c489.ADISON_OFFERWALL_TITLE || '바로 적립 받기', 'LIST', 'Light');
    v_c9f274 = true;
    console.log(`[adison] ✅ 초기화 완료 — ${v_b7fbdb === 'production' ? 'PRD 모드' : 'DEV 모드'}`);
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

const v_dc137f = (v_c99bd2): 'M' | 'F' | null => {
  const v_f4e98d = typeof v_c99bd2 === 'string' ? parseInt(v_c99bd2, 10) : v_c99bd2;
  if (v_f4e98d === 2110) return 'M';
  if (v_f4e98d === 2111) return 'F';
  return null;
};

const v_950423 = (v_c99bd2): number => {
  const v_f4e98d = typeof v_c99bd2 === 'string' ? parseInt(v_c99bd2, 10) : v_c99bd2;
  const v_7d8cc0 = new Date().getFullYear();

  switch (v_f4e98d) {
    case 2210: return v_7d8cc0 - 15; 
    case 2220: return v_7d8cc0 - 25; 
    case 2230: return v_7d8cc0 - 35; 
    case 2240: return v_7d8cc0 - 45; 
    case 2250: return v_7d8cc0 - 55; 
    default: return 0;
  }
};

export interface AdisonBindUserDataInput {

  gender?: number | string | null;

  age?: number | string | null;

  birthYear?: number | null;
}

const v_328503 = (v_717992, v_0c8987): void => {
  const v_c9c489 = v_e4a763();
  const v_694b25 = (v_c9c489.GATEWAY_WORKERS || '').replace(/\/oth-path\/?$/, '').replace(/\/$/, '');
  if (!v_694b25) return;
  const v_f71b56 = `${v_694b25}/registerAdisonUid`;
  fetch(v_f71b56, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ member: Number(v_717992), uid: v_0c8987 }),
  })
    .then(async (v_8f00b9) => {
      if (!v_8f00b9.ok) {
        const v_8d41d7 = await v_8f00b9.text().catch(() => '');
        console.warn('[adison] registerAdisonUid non-OK', v_8f00b9.status, v_8d41d7);
      }
    })
    .catch((v_9e86fd) => {
      console.warn('[adison] registerAdisonUid failed', v_9e86fd?.message ?? v_9e86fd);
    });
};

export const v_627d09 = (
  v_717992,
  v_ef7306,
): string | null => {
  if (!v_2911e0()) return null;
  const v_0c8987 = v_3847b5(v_717992);
  try {
    v_37118b!.setUid(v_0c8987);
  } catch (v_9e86fd) {
    console.warn('[adison] setUid failed', v_9e86fd?.message ?? v_9e86fd);
  }

  v_328503(v_717992, v_0c8987);

  if (v_ef7306) {
    const v_c3eac4 = v_dc137f(v_ef7306.gender);
    const v_a95e84 =
      v_ef7306.birthYear && v_ef7306.birthYear > 0
        ? v_ef7306.birthYear
        : v_950423(v_ef7306.age);
    if (v_c3eac4 || v_a95e84 > 0) {
      try {
        v_37118b!.setTargeting(v_a95e84, v_c3eac4);
      } catch (v_9e86fd) {
        console.warn('[adison] setTargeting failed', v_9e86fd?.message ?? v_9e86fd);
      }
    }
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
