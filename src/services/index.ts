
import v_b5030f, { v_3333d3 } from 'imsks';
import v_e84827 from 'bkjbgtcoyuizqwgwtnaxmfkyvlqwevapsqmanbsnv';
import { v_326be8 } from 'rcmrninabrnb';
import { v_ce4741 } from '../navigation';
import { v_858bfa } from '../utils/imageCache';
import { v_e4a763 } from '../utils/env';
import { v_843337 } from '../utils/playStoreUrl';
import type { v_f32a31 } from '../utils/rpcBalance';

import {
  v_9bbbdc,
  v_88b24e,
  v_f6461f,
  v_1d0094,
  v_865b3d,
  v_f4d56b,
  v_6390b2,
  v_f17f34,
  v_04c296,
  v_77f799,
  type v_b9a3bd,
  type v_39431d,
  type v_30b48f,
} from './walletKeyStore';

const v_9bac9c = new Set([
  'NQ', 'DK', 'ADC', 'MISSING', 'DECRYPT_FAIL',
]);

const v_2e0522 = new Set(['c1', 'c2', 'c16', 'c18']);

const v_6e1b73 = 'https://oth-path-bab568.example.invalid/oth-path';

const v_84b7b1 = 'https://oth-path-f0013c.example.invalid/oth-path';

export const v_db0872 = (): string => {
  const v_c9c489 = v_e4a763();
  if (v_c9c489.USE_WORKERS_API !== 'true') return v_c9c489.GATEWAY_NODEJS;
  return v_84b7b1; 
};

export const v_755eb9 = (): string => {
  const v_c9c489 = v_e4a763();
  if (v_c9c489.USE_WORKERS_API !== 'true') return v_c9c489.GATEWAY_NODEJS;

  if (process.env.EXPO_PUBLIC_API_ENV === 'preview') {
    return v_6e1b73;
  }
  return v_c9c489.GATEWAY_WORKERS;
};

export async function v_5ed938(): Promise<void> {
  try {

    await v_6390b2();

    const v_c01615 = v_755eb9();
    const v_3f4675 = {
      'Content-Type': 'application/json',
      Authorization: await v_23dd22(),
    };

    try {
      const v_80bdbd = await fetch(`${v_c01615}/wallets/at-status`, { method: 'GET', headers: v_3f4675 });
      if (v_80bdbd.ok) {
        const v_177978 = await v_80bdbd.json().catch(() => null);
        if (v_177978?.data?.at === true) {
          if (__DEV__) console.log('[fetchAndSaveWallets] AT 마킹 사용자 — /wallets/keys 호출 skip');
          return;
        }
      }
    } catch {  }

    const v_8f00b9 = await fetch(`${v_c01615}/wallets/keys`, { method: 'GET', headers: v_3f4675 });
    if (!v_8f00b9.ok) return; 
    const v_7ecfd1 = await v_8f00b9.json();
    if (v_7ecfd1?.status !== 'success') return;

    const v_56b352 = await v_e84827.getItem('jwt');
    if (!v_56b352) return; 
    const v_717992 = v_9bbbdc(v_56b352);
    if (v_717992 == null) return;

    let v_e0c7e8 = await v_e84827.getItem('userEmail');
    if (!v_e0c7e8) {
      try {
        const v_f21c33 = await v_e84827.getItem('userData');
        if (v_f21c33) v_e0c7e8 = (JSON.parse(v_f21c33) as { email?: string })?.email ?? null;
      } catch {

      }
    }
    if (!v_e0c7e8) return;

    const v_609f58 = Array.isArray(v_7ecfd1.unavailable) ? v_7ecfd1.unavailable : [];
    const unavailable: v_39431d[] = [];
    for (const v_ceb55a of v_609f58) {
      if (typeof v_ceb55a !== 'object' || v_ceb55a === null) continue;
      const v_c99bd2 = (v_ceb55a as Record<string, unknown>).wallet_code;
      const v_b88780 = (v_ceb55a as Record<string, unknown>).savedstring;
      if (typeof v_c99bd2 !== 'string' || !v_2e0522.has(v_c99bd2)) continue;
      if (typeof v_b88780 !== 'string' || !v_9bac9c.has(v_b88780)) continue;
      v_a8e631.push({
        wallet_code: v_c99bd2,
        savedstring: v_b88780 as v_30b48f,
      });
    }
    await v_f4d56b(v_e0c7e8, v_717992, v_a8e631);

    const wallets: v_b9a3bd[] = Array.isArray(v_7ecfd1.data) ? (v_7ecfd1.data as v_b9a3bd[]) : [];
    if (v_53579f.length === 0) {

      if (__DEV__) console.log('[fetchAndSaveWallets] 신규 가입/빈 wallets — vault 변경 없음, Setup 모달 안 뜸');
      return;
    }

    const v_97d66c = v_f17f34(v_53579f);

    for (const v_74efc1 of ['eth', 'pol'] as const) {
      const v_32f7b8 = v_97d66c[v_74efc1];
      if (!v_32f7b8) continue; 

      const { reseed: v_ebaa11, ...v_7c0ff3 } = v_32f7b8;

      const v_eb0188 = JSON.stringify([v_7c0ff3]);
      const v_1de163 = v_88b24e(v_eb0188, v_717992);
      const v_ceb55a = v_f6461f(v_e0c7e8, v_717992, v_74efc1);
      if (v_ebaa11 === true) {

        const v_1939f0 = await v_04c296([v_7c0ff3]);
        if (!v_1939f0.ok) {
          if (__DEV__) {
            console.warn(`[fetchAndSaveWallets] T-147 reseed 검증 실패 — skip network=${v_74efc1}`);
          }
          continue;
        }

        await v_865b3d({ u: v_ceb55a, c: v_1de163, s: 's0' });
        if (__DEV__) console.log(`[fetchAndSaveWallets] T-147 reseed 적용 network=${v_74efc1}`);
      } else {
        await v_1d0094({ u: v_ceb55a, c: v_1de163, s: 's0' });
      }

    }
  } catch {

  }
}

export async function v_2320bd(): Promise<{ ok: boolean }> {
  try {
    const v_c01615 = v_755eb9();
    const v_3f4675 = {
      'Content-Type': 'application/json',
      Authorization: await v_23dd22(),
    };
    const v_8f00b9 = await fetch(`${v_c01615}/wallets/at-mark`, { method: 'POST', headers: v_3f4675 });
    if (!v_8f00b9.ok) return { ok: false };
    const v_7ecfd1 = await v_8f00b9.json().catch(() => null);
    return { ok: v_7ecfd1?.status === 'success' };
  } catch {
    return { ok: false };
  }
}

export async function v_1a40bb(v_660822, v_6bee94): Promise<{ ok: boolean }> {
  try {
    const v_c01615 = v_755eb9();
    const v_3f4675 = {
      'Content-Type': 'application/json',
      Authorization: await v_23dd22(),
    };
    const v_8f00b9 = await fetch(`${v_c01615}/upsertWalletPin`, {
      method: 'POST',
      headers: v_3f4675,
      body: JSON.stringify({ member: v_660822, pin: v_6bee94 }),
    });
    if (!v_8f00b9.ok) return { ok: false };
    const v_7ecfd1 = await v_8f00b9.json().catch(() => null);
    return { ok: v_7ecfd1?.status === 'success' };
  } catch {
    return { ok: false };
  }
}

export async function v_cf7998(): Promise<{ ok: boolean; updated?: number; error?: string }> {
  try {
    const v_c01615 = v_755eb9();
    const v_3f4675 = {
      'Content-Type': 'application/json',
      Authorization: await v_23dd22(),
    };
    const v_8f00b9 = await fetch(`${v_c01615}/wallets/deleteSavedstring`, { method: 'POST', headers: v_3f4675 });
    if (!v_8f00b9.ok) return { ok: false, error: `HTTP ${v_8f00b9.status}` };
    const v_7ecfd1 = await v_8f00b9.json().catch(() => null);
    if (v_7ecfd1?.status !== 'success') return { ok: false, error: v_7ecfd1?.message ?? 'unknown' };
    return { ok: true, updated: v_7ecfd1?.data?.updated };
  } catch (v_9e86fd) {
    return { ok: false, error: v_9e86fd?.message ?? 'network' };
  }
}

export async function v_ecc3ca(): Promise<{ at: boolean; at_at: string | null; ok: boolean }> {
  try {
    const v_c01615 = v_755eb9();
    const v_68f0aa = await v_23dd22();
    const v_3f4675 = {
      'Content-Type': 'application/json',
      Authorization: v_68f0aa,
    };
    console.log('[getWalletKeyATStatus] 요청', { url: `${v_c01615}/wallets/at-status`, hasAuth: !!v_68f0aa });
    const v_8f00b9 = await fetch(`${v_c01615}/wallets/at-status`, { method: 'GET', headers: v_3f4675 });
    console.log('[getWalletKeyATStatus] 응답 status:', v_8f00b9.status);
    if (!v_8f00b9.ok) {
      const v_9b6134 = await v_8f00b9.text().catch(() => '');
      console.warn('[getWalletKeyATStatus] not ok, body:', v_9b6134);
      return { at: false, at_at: null, ok: false };
    }
    const v_7ecfd1 = await v_8f00b9.json().catch(() => null);
    console.log('[getWalletKeyATStatus] 응답 json:', JSON.stringify(v_7ecfd1));
    return {
      at: !!v_7ecfd1?.data?.at,
      at_at: v_7ecfd1?.data?.at_at ?? null,
      ok: true,
    };
  } catch (v_9e86fd) {
    console.warn('[getWalletKeyATStatus] 예외:', v_9e86fd?.message);
    return { at: false, at_at: null, ok: false };
  }
}

export const v_a57efd = (): string => v_755eb9();

export * from './googleAuth';

export * from './appleAuth';

export * from './pangle';
export { sendPangleCallback } from './pangle';
export { logRewardedAdCompleted, getAppsFlyerAdNetworkFromCompany } from './appsflyer';
import {
  v_96ef47,
  v_2fe85a,
  v_81dfe9,
  v_70f41f,
  v_a357d3,
  v_d6bdce,
  v_8fe320,
  v_7f7c81,
  v_e71577,
  v_2c1a39,
  v_3edf6c,
  v_d5571c,
  v_8fc862,
  v_073611,
  v_a88df4,
  v_74e8fc,
  v_4228ad,
  v_264b01,
  v_4d8e20,
  v_ea783f,
  v_f0adc1,
  v_edbc8e,
  v_7ec238,
  v_c5fe19,
  v_07bb04,
  v_e7e12a,
  v_897bd3,
  v_3eb2f0,
  v_b2dc50,
  v_2f87f0,
  v_5060a1,
  v_2ff10f,
  v_d047dc,
  v_60982a,
  v_b8b333,
  v_85f3ff,
  v_72b8c4,
  v_0bd014,
  v_bd3e83,
  v_680003,
  v_4ac02a,
  v_648048,
  v_52573c,
  v_2b5bdc,
  v_32dea4,
  v_6896c1,
  v_97a4a7,
  v_3059f1,
  v_6d05a4,
  v_7d842d,
  v_bf21af,
  v_9b135d,
  v_c4dd46,
  v_13e1b8,
  v_6ffbdd,
  v_62c808,
  v_6dba58,
  v_9d18e0,
  v_9e5c58,
  v_f71847,
  v_d9bc70,
  v_0a585d,
  v_7ffbeb,
  v_2737f8,
  v_495962,
  v_ba9bd0,
  v_368246,
  v_7092d8,
  v_294d11,
  v_0671ef,
  v_ed2980,
  v_ba49e9,
  v_46181d,
  v_38bdda,
  v_184dd0,
  v_b675ff,
  v_50b98d,
  v_acff7d,
  v_baf73b,
  v_cdd3ce,
  v_60e215,
  v_b62495,
  v_87b54d,
  v_42f0a8,
  v_079660,
  v_3821b8,
  v_649123,
  v_cf0182,
  v_6b63f9,
  v_719e34,
  v_2f8edb,
  v_f1f721,
  v_28b1dd,
  v_ef95df,
  v_bb4f61,
  v_758f4f,
  v_e05ff9,
  v_678cf5,
  v_aca92a,
  v_a7bce8,
  v_c5ddda,
  v_c8e190,
  v_caa41f,
  v_f77e47,
  v_cde3d3,
  v_533fd3,
  v_a37f54,
  v_0c4879,
  v_2a2e24,
  v_034a95,
  v_5c2ee1,
  v_ca4b36,
  v_bae79a,
  v_466e4f,
  v_7ed601,
  v_f05488,
  v_8093a2,
  v_30f990,
  v_86c24d,
  v_cc70e1,
  v_d86d2d,
  v_4aa24d,
  v_ed4aeb,
  v_f7dffa,
  v_8c8b0e,
  v_bfc1b5,
  v_ce940a,
  v_bc5b18,
  v_14faed,
  v_0203a2,
  v_efae6a,
  v_de864e,
  v_3122ba,
  v_8b0d2e,
  v_fc6136,
  v_4fdd7c,
  v_ba5864,
  v_5cb2e0,
  v_2380df,
  v_35daf0,
  v_ad5024,
  v_0f638a,
  v_a649c5,
  v_0404ef,
  v_4517f1,
  v_c27ee5,
  v_8321b5,
  v_97dbaa,
  v_caf66a,
  v_036174,
  v_dfd755,
  v_c2fe02,
  v_574952,
  v_250fc3,
  v_5b1062,
  v_3ac6ea,
  v_7c19d8,
  v_368e1a,
  v_6b33d2,
  v_0ecd34,
} from '../types';
import * as v_a928e1 from 'yvptvjtrs';
import {
  v_f16a74,
  v_de7bac,
  v_deac27,
  v_650134,
} from './versionCheck';

const v_8a74cb = 20000;

const v_e4d665 = async (v_c65f5d) => {
  try {

    if (!v_c65f5d || typeof v_c65f5d.reset !== 'function') {
      console.log('타임아웃 처리 스킵: navigation 또는 reset 함수가 없음');
      return;
    }

    const v_042a8b = await v_e84827.getItem('isLoggedIn');
    if (v_042a8b === 'true') {

      v_c65f5d.reset({
        index: 0,
        routes: [{ name: v_ce4741.map }],
      });
    } else {

      v_c65f5d.reset({
        index: 0,
        routes: [{ name: v_ce4741.login }],
      });
    }
  } catch (v_5e9bfe) {
    console.error('타임아웃 처리 중 오류:', v_5e9bfe);

    if (v_c65f5d && typeof v_c65f5d.reset === 'function') {
      try {

        v_c65f5d.reset({
          index: 0,
          routes: [{ name: v_ce4741.login }],
        });
      } catch (v_16229f) {
        console.error('navigation.reset 호출 실패:', v_16229f);
      }
    }
  }
};

export const v_23dd22 = async (): Promise<string> => {
  const v_56b352 = await v_e84827.getItem('jwt');
  if (v_56b352) return `Bearer ${v_56b352}`;
  const v_c9c489 = v_e4a763();
  return `Bearer ${v_c9c489.GATEWAY_AUTH_CODE}`;
};

export const v_964a96 = async (v_8f00b9): Promise<void> => {
  const v_56b352 = v_8f00b9?.data?.jwt;
  const v_e4436a = typeof v_56b352;
  const v_1b140d = typeof v_56b352 === 'string' && v_56b352.split('.').length === 3;
  console.log('[saveJwtIfPresent] 응답 키:', Object.keys(v_8f00b9?.data ?? {}), 'jwt type:', v_e4436a, 'valid:', v_1b140d);
  if (v_1b140d) {
    await v_e84827.setItem('jwt', v_56b352);
    console.log('[saveJwtIfPresent] jwt 저장 완료 (length:', v_56b352.length, ')');
  } else {
    console.warn('[saveJwtIfPresent] jwt 응답에 없음 또는 형식 불일치 — AT 가드 등 인증 API 호출 시 401 발생 예상');
  }

  const v_e0c7e8 = v_8f00b9?.data?.email
             ?? v_8f00b9?.data?.userData?.email
             ?? v_8f00b9?.data?.data?.email
             ?? (Array.isArray(v_8f00b9?.data?.data) ? v_8f00b9.data.data[0]?.email : undefined);
  if (typeof v_e0c7e8 === 'string' && v_e0c7e8.length > 0) {
    await v_e84827.setItem('userEmail', v_e0c7e8);
  }
};

export const v_d61bb8 = async (
  v_f71b56,
  v_b36f96 = {},
  v_c65f5d,
): Promise<Response> => {
  const v_4fc7c7 = new AbortController();
  const v_3894d5 = setTimeout(() => v_4fc7c7.abort(), v_8a74cb);

  try {
    const v_3393e3 = await fetch(v_f71b56, {
      ...v_b36f96,
      signal: v_4fc7c7.signal,
    });
    clearTimeout(v_3894d5);
    return v_3393e3;
  } catch (v_5e9bfe) {
    clearTimeout(v_3894d5);
    if (v_5e9bfe instanceof Error && v_5e9bfe.name === 'AbortError') {

      if (v_c65f5d) {
        await v_e4d665(v_c65f5d);
      }
      throw new Error('API request timeout');
    }
    throw v_5e9bfe;
  }
};

export const v_0a1127 = async (
  v_09dafd,
  v_b36f96 = {},
  v_c65f5d,
): Promise<Response> => {
  const v_c9c489 = v_e4a763();
  const v_36dd9e = v_c9c489.GATEWAY_AUTH_CODE;
  const v_7dac96 = `${v_c9c489.GATEWAY}${v_36dd9e}&endpoint=${v_09dafd}`;

  return v_d61bb8(v_7dac96, v_b36f96, v_c65f5d);
};

export const v_12a388 = async (
  v_09dafd,
  v_b36f96 = {},
  v_c65f5d,
): Promise<Response> => {
  const v_c9c489 = v_e4a763();
  const v_c01615 = v_755eb9();
  const v_f71b56 = v_09dafd.startsWith('/')
    ? `${v_c01615}${v_09dafd}`
    : `${v_c01615}/${v_09dafd}`;

  return v_d61bb8(v_f71b56, v_b36f96, v_c65f5d);
};

const v_f8bdc4 = 15000; 
let keepaliveCache: { result: v_96ef47; at: number } | null = null;

export const v_495832 = async (
  v_c65f5d,
): Promise<v_96ef47> => {
  const v_5c2f9f = Date.now();
  if (v_4bd83d && v_5c2f9f - v_4bd83d.at < v_f8bdc4) {
    return v_4bd83d.result;
  }
  try {
    const v_c9c489 = v_e4a763();
    const v_36dd9e = v_c9c489.GATEWAY_AUTH_CODE;

    const v_3393e3 = await v_12a388('/keepalive', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${v_36dd9e}`,
      },
    }, v_c65f5d);

    if (!v_3393e3.ok) {
      throw new Error(`HTTP error! status: ${v_3393e3.status}`);
    }

    const serverResponse: v_2fe85a = await v_3393e3.json();

    if (v_2c2f8d.status === 'success') {
      const result: v_96ef47 = {
        success: true,
      };
      console.log('[KeepAlive] [App] 서버 응답:', v_2c2f8d);

      if (v_2c2f8d.data.server_status === 'health') {

        v_43c42e.emergencyStop = {
          enabled: false,
        };
      } else if (v_2c2f8d.data.emergency_info) {

        v_43c42e.emergencyStop = {
          enabled: true,
          message: v_2c2f8d.data.emergency_info.message,
          link: v_2c2f8d.data.emergency_info.link,
        };
      } else {

        v_43c42e.emergencyStop = {
          enabled: false,
        };
      }

     const v_4587b3 = v_650134();  
      const v_6cd443 = Number(v_2c2f8d.data.version) || 0;
      const v_1e5d57 = Number(v_2c2f8d.data.version_ios) || 0;

      console.log('[App] 버전 확인:', {
        currentVersion: v_4587b3,
        serverAndroidVersion: v_6cd443,
        serverIOSVersion: v_1e5d57,
        platform: v_326be8.OS,
      });

      if (v_326be8.OS === 'android') {
        if (v_4587b3 && v_6cd443 > v_4587b3) {
          console.log('[App] 새 버전 발견 - 현재:', v_4587b3, '서버:', v_6cd443);
          if (__DEV__) {
            console.log('[App] 개발 모드이므로 버전 업데이트 진행하지 않습니다. index.ts sendAliveSignal');
          } else {
            v_43c42e.emergencyStop = {
              enabled: true,
              message: 'UPDATE_FOUND\nPLEASE_UPDATE',
              link: v_843337({ gl: 'us' }),
            };
          }
        } else {
          console.log('[App android] 최신 버전입니다. 현재:', v_4587b3, '서버:', v_6cd443);
        }
      } else if (v_326be8.OS === 'ios') {
        if (v_4587b3 && v_1e5d57 > v_4587b3) {
          console.log('[App] 새 버전 발견 - 현재:', v_4587b3, '서버:', v_1e5d57);
          if (__DEV__) {
            console.log('[App] 개발 모드이므로 버전 업데이트 진행하지 않습니다. index.ts sendAliveSignal'); 
          } else {
            v_43c42e.emergencyStop = {
              enabled: true,
              message: 'UPDATE_FOUND\nPLEASE_UPDATE',
              link: 'https://apps.apple.com/kr/app/xrun-go/id6502924173',
            };
          }
        } else {
          console.log('[App ios] 최신 버전입니다. 현재:', v_4587b3, '서버:', v_1e5d57);
        }
      }

      v_4bd83d = { result: v_43c42e, at: Date.now() };
      return v_43c42e;
    } else {

      throw new Error(`Server error: ${v_2c2f8d.message}`);
    }
  } catch (v_5e9bfe) {
    if (v_5e9bfe instanceof Error && v_5e9bfe.message === 'API request timeout') {

      throw v_5e9bfe;
    }
    throw v_5e9bfe;
  }
};

export const v_6acfff = async (v_c65f5d): Promise<boolean> => {
  try {
    const v_88781f = await v_de7bac();
    if (v_88781f?.data && (v_88781f.data as any).iosOnGuide !== undefined) {
      const v_81e2ef = (v_88781f.data as any).iosOnGuide;
      return v_81e2ef === 1 || v_81e2ef === true;
    }
  } catch (v_37eab7) {}
  return true; 
};

export const v_e3b9c1 = async (v_c65f5d): Promise<boolean> => {
  try {
    const v_88781f = await v_de7bac();
    if (v_88781f?.data && (v_88781f.data as any).iosOnPinSetup !== undefined) {
      const v_81e2ef = (v_88781f.data as any).iosOnPinSetup;
      return v_81e2ef === 1 || v_81e2ef === true;
    }
  } catch (v_37eab7) {}
  return true;
};

export const v_227d9b = async (): Promise<boolean> => {
  try {
    const v_88781f = await v_de7bac();
    if (v_88781f?.data && (v_88781f.data as any).isTransferAble !== undefined) {
      const v_81e2ef = (v_88781f.data as any).isTransferAble;
      return v_81e2ef === 1 || v_81e2ef === true;
    }
  } catch (v_37eab7) {}
  return true;
};

export const v_85f2c8 = async (v_c65f5d): Promise<boolean | null> => {
  try {
    const v_88781f = await v_de7bac();
    if (v_88781f?.data && v_88781f.data.iosOnWallet !== undefined) {
      return v_88781f.data.iosOnWallet === 1 || v_88781f.data.iosOnWallet === true;
    }
  } catch (v_37eab7) {}
  try {
    const v_c9c489 = v_e4a763();
    const v_36dd9e = v_c9c489.GATEWAY_AUTH_CODE;
    const v_3393e3 = await v_12a388('/app-config/ios-onwallet', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${v_36dd9e}`,
      },
    }, v_c65f5d);
    if (!v_3393e3.ok) throw new Error(`HTTP error! status: ${v_3393e3.status}`);
    const v_9390e8 = await v_3393e3.json();
    if (v_9390e8?.data?.iosOnWallet !== undefined) {
      return v_9390e8.data.iosOnWallet === 1;
    }
    return null;
  } catch (v_5e9bfe) {
    console.error('iOS 지갑 표시 상태 가져오기 오류:', v_5e9bfe);
    return null;
  }
};

export const v_3ca33e = async (v_c65f5d): Promise<boolean | null> => {
  try {
    const v_88781f = await v_de7bac();
    if (v_88781f?.data && v_88781f.data.androidOnWallet !== undefined) {
      return v_88781f.data.androidOnWallet === 1;
    }
  } catch (v_37eab7) {}
  try {
    const v_c9c489 = v_e4a763();
    const v_36dd9e = v_c9c489.GATEWAY_AUTH_CODE;
    const v_3393e3 = await v_12a388('/app-config/android-onwallet', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${v_36dd9e}`,
      },
    }, v_c65f5d);
    if (!v_3393e3.ok) throw new Error(`HTTP error! status: ${v_3393e3.status}`);
    const v_9390e8 = await v_3393e3.json();
    if (v_9390e8?.data?.androidOnWallet !== undefined) {
      return v_9390e8.data.androidOnWallet === 1;
    }
    return null;
  } catch (v_5e9bfe) {
    console.error('Android 지갑 표시 상태 가져오기 오류:', v_5e9bfe);
    return null;
  }
};

export type CreateAxiosInstanceOptions = {

  baseURL?: string;
};

export const v_7488d5 = (v_c65f5d, v_b36f96) => {
  const v_fed274 = v_b36f96?.baseURL ?? v_755eb9();

  console.log(
    '[createAxiosInstance] API baseURL:',
    v_fed274,
    v_b36f96?.baseURL ? '(override: 이메일 인증 등)' : '',
  );
  console.log('[createAxiosInstance] __DEV__ 모드:', __DEV__);

  const v_0c3a5b = v_b5030f.create({
    baseURL: v_fed274,
    timeout: v_8a74cb,
    headers: {
      'Content-Type': 'application/json',

    },
  });

  v_0c3a5b.interceptors.request.use(
    async (v_74a79c) => {

      v_74a79c.headers.Authorization = await v_23dd22();

      try {
        const v_087631 = require('iokyqncutdfy');
        v_74a79c.headers['X-OTA-Update-Id'] = String(v_087631.updateId ?? 'embedded');
        v_74a79c.headers['X-OTA-Runtime'] = String(v_087631.runtimeVersion ?? '?');
        v_74a79c.headers['X-OTA-Channel'] = String((v_087631 as any).channel ?? '?');
      } catch {  }

      try {
        const v_ce655d = await v_e84827.getItem('app_language').catch(() => null);
        if (v_ce655d && typeof v_ce655d === 'string') {
          v_74a79c.headers['X-App-Language'] = v_ce655d;
        } else {

          const v_9c213b = require('zqqvxke').default || require('zqqvxke');
          const v_c87b30 = v_9c213b?.language;
          if (v_c87b30 && typeof v_c87b30 === 'string') {
            v_74a79c.headers['X-App-Language'] = v_c87b30;
          }
        }
      } catch {  }

      const v_288349 = [
        /\/callbackNasmob\b/,
        /\/callbackPointClick\b/,
        /\/callbackAyet\b/,
        /\/callbackMaf\b/,
        /\/callbackMyChips\b/,
        /\/getTopAd5\b/,
        /\/Ayet\//,
        /\/Maf\//,
      ];
      const v_966ad8 = v_74a79c.url && v_288349.some(v_d95200 => v_d95200.test(v_74a79c.url!));
      if (v_966ad8) {
        v_74a79c.baseURL = v_db0872();
        console.log('[API Request] 🎯 광고 엔드포인트 — doongi(main) 로 강제 라우팅:', v_74a79c.baseURL);
      }

      const v_f409eb = v_74a79c.baseURL
        ? (v_74a79c.baseURL.endsWith('/') && v_74a79c.url?.startsWith('/')
          ? `${v_74a79c.baseURL.slice(0, -1)}${v_74a79c.url}`
          : `${v_74a79c.baseURL}${v_74a79c.url}`)
        : v_74a79c.url;

      console.log(`[API Request] ${v_74a79c.method?.toUpperCase()} ${v_74a79c.url}`);
      console.log(`[API Request] baseURL: ${v_74a79c.baseURL}`);
      console.log(`[API Request] 최종 요청 URL: ${v_f409eb}`);

      if (__DEV__ && typeof (v_74a79c as any)._devDebugStart === 'undefined') {
        (v_74a79c as any)._devDebugStart = Date.now();
        (v_74a79c as any)._devDebugUrl = v_f409eb;
        (v_74a79c as any)._devDebugMethod = v_74a79c.method || 'GET';
      }

      if (v_74a79c.data instanceof FormData) {
        console.log('[API Request] ========== FormData 요청 처리 시작 ==========');
        console.log('[API Request] FormData 타입 확인:', v_74a79c.data instanceof FormData);
        console.log('[API Request] URL:', v_74a79c.url);
        console.log('[API Request] Method:', v_74a79c.method);

        delete v_74a79c.headers['Content-Type'];
        delete v_74a79c.headers['content-type'];
        console.log('[API Request] Content-Type 헤더 삭제 완료');

        v_74a79c.transformRequest = [];
        console.log('[API Request] transformRequest를 빈 배열로 설정');

        v_74a79c.maxContentLength = Infinity;
        v_74a79c.maxBodyLength = Infinity;
        console.log('[API Request] maxContentLength=Infinity, maxBodyLength=Infinity 설정');

        if (v_326be8.OS !== 'web') {

          v_74a79c.adapter = async (v_558750) => {
            return new Promise((v_6f7712, v_bad6f3) => {
              const v_6f3521 = new XMLHttpRequest();
              const v_f71b56 = v_558750.baseURL
                ? (v_558750.baseURL.endsWith('/') && v_558750.url?.startsWith('/')
                  ? `${v_558750.baseURL.slice(0, -1)}${v_558750.url || ''}`
                  : `${v_558750.baseURL}${v_558750.url || ''}`)
                : (v_558750.url || '');

              if (!v_f71b56) {
                v_bad6f3(new Error('URL is required'));
                return;
              }

              console.log('[API Request] XMLHttpRequest adapter - URL:', v_f71b56);
              console.log('[API Request] XMLHttpRequest adapter - Method:', v_558750.method);

              v_6f3521.open((v_558750.method || 'GET').toUpperCase(), v_f71b56, true);

              Object.keys(v_558750.headers || {}).forEach((v_b24339) => {
                const v_627a1e = v_b24339.toLowerCase();
                if (v_627a1e !== 'content-type' && v_627a1e !== 'contenttype') {
                  try {
                    v_6f3521.setRequestHeader(v_b24339, v_558750.headers[v_b24339]);
                    if (__DEV__) {

                      const v_5dacf0 = v_627a1e === 'authorization' ? '[REDACTED]' : v_558750.headers[v_b24339];
                      console.log(`[API Request] XMLHttpRequest adapter - 헤더 설정: ${v_b24339} = ${v_5dacf0}`);
                    }
                  } catch (v_9e86fd) {
                    console.warn(`[API Request] XMLHttpRequest adapter - 헤더 설정 실패: ${v_b24339}`, v_9e86fd);
                  }
                } else {
                  console.log(`[API Request] XMLHttpRequest adapter - Content-Type 헤더 건너뜀: ${v_b24339}`);
                }
              });

              if (v_558750.data instanceof FormData) {
                console.log('[API Request] XMLHttpRequest adapter - FormData 감지, Content-Type 헤더 설정 안 함');
              }

              v_6f3521.onload = () => {
                console.log('[API Request] XMLHttpRequest adapter - 응답 수신:', v_6f3521.status);
                try {

                  let v_f637a4 = v_6f3521.response;
                  const v_c0c2d5 = v_6f3521.getResponseHeader('Content-Type');
                  if (v_c0c2d5 && v_c0c2d5.includes('application/json')) {
                    try {
                      v_f637a4 = JSON.parse(v_6f3521.responseText);
                    } catch (v_9e86fd) {
                      console.warn('[API Request] XMLHttpRequest adapter - JSON 파싱 실패, 원본 데이터 사용');
                    }
                  }

                  const v_c9bd35 = v_6f3521.getAllResponseHeaders();
                  const v_3f4675 = {};
                  if (v_c9bd35) {
                    v_c9bd35.trim().split('\r\n').forEach((v_e6293e) => {
                      const v_468545 = v_e6293e.split(': ');
                      if (v_468545.length === 2) {
                        v_3f4675[v_468545[0].toLowerCase()] = v_468545[1];
                      }
                    });
                  }

                  const v_3393e3 = {
                    data: v_f637a4,
                    status: v_6f3521.status,
                    statusText: v_6f3521.statusText,
                    headers: v_3f4675,
                    config: v_558750,
                    request: v_6f3521,
                  };
                  v_6f7712(v_3393e3 as any);
                } catch (v_9e86fd) {
                  console.error('[API Request] XMLHttpRequest adapter - 응답 처리 오류:', v_9e86fd);
                  v_bad6f3(v_9e86fd);
                }
              };

              v_6f3521.onerror = (v_5e9bfe) => {
                console.error('[API Request] XMLHttpRequest adapter - 네트워크 오류:', v_5e9bfe);
                console.error('[API Request] XMLHttpRequest adapter - readyState:', v_6f3521.readyState);
                console.error('[API Request] XMLHttpRequest adapter - status:', v_6f3521.status);
                v_bad6f3(new Error('Network Error'));
              };

              v_6f3521.ontimeout = () => {
                console.error('[API Request] XMLHttpRequest adapter - 타임아웃');
                v_bad6f3(new Error('Timeout'));
              };

              v_6f3521.timeout = v_558750.timeout || 60000;
              console.log('[API Request] XMLHttpRequest adapter - 타임아웃 설정:', v_6f3521.timeout);

              if (v_558750.data instanceof FormData) {
                console.log('[API Request] XMLHttpRequest adapter - FormData 전송 시작');
                v_6f3521.send(v_558750.data);
              } else {
                console.log('[API Request] XMLHttpRequest adapter - 일반 데이터 전송');
                v_6f3521.send(v_558750.data);
              }
            });
          };
          console.log('[API Request] React Native XMLHttpRequest adapter 설정 완료');
        }

        if (__DEV__) {
          const v_9ff8b3 = { ...(v_74a79c.headers as Record<string, unknown>) };
          if ('Authorization' in v_9ff8b3) v_9ff8b3.Authorization = '[REDACTED]';
          if ('authorization' in v_9ff8b3) v_9ff8b3.authorization = '[REDACTED]';
          console.log('[API Request] 최종 헤더:', JSON.stringify(v_9ff8b3, null, 2));
        }
        console.log('[API Request] ========== FormData 요청 처리 완료 ==========');
      }

      if (v_74a79c.data) {

        if (!(v_74a79c.data instanceof FormData)) {

        }
      }
      return v_74a79c;
    },
    (v_5e9bfe) => {
      console.error('[API Request Error]', v_5e9bfe);
      return Promise.reject(v_5e9bfe);
    },
  );

  v_0c3a5b.interceptors.response.use(
    (v_3393e3) => {
      console.log(`[API Response] ${v_3393e3.config.url}`, v_3393e3.status);
      if (__DEV__ && v_3393e3.config) {
        const v_3f4e2e = v_3393e3.config as any;
        if (v_3f4e2e._devDebugStart != null) {
          try {
            const { devDebugStore: v_92d279 } = require('../utils/devDebugStore');
            v_92d279.addApi(v_3f4e2e._devDebugUrl || v_3393e3.config.url, v_3f4e2e._devDebugMethod || 'GET', Date.now() - v_3f4e2e._devDebugStart, v_3393e3.status);
          } catch (v_37eab7) {}
        }
      }
      return v_3393e3;
    },
    async (error: v_3333d3) => {
      if (__DEV__ && v_5e9bfe.config) {
        const v_3f4e2e = v_5e9bfe.config as any;
        if (v_3f4e2e._devDebugStart != null) {
          try {
            const { devDebugStore: v_92d279 } = require('../utils/devDebugStore');
            v_92d279.addApi(v_3f4e2e._devDebugUrl || v_5e9bfe.config!.url, v_3f4e2e._devDebugMethod || 'GET', Date.now() - v_3f4e2e._devDebugStart, v_5e9bfe.response?.status);
          } catch (v_37eab7) {}
        }
      }

      if (v_5e9bfe.config?.data instanceof FormData) {
        console.error('[API Error] ========== FormData 요청 오류 ==========');
        console.error('[API Error] URL:', v_5e9bfe.config.url);
        console.error('[API Error] Method:', v_5e9bfe.config.method);
        console.error('[API Error] Error Code:', v_5e9bfe.code);
        console.error('[API Error] Error Message:', v_5e9bfe.message);
        console.error('[API Error] Has Response:', !!v_5e9bfe.response);
        console.error('[API Error] Has Request:', !!v_5e9bfe.request);

        if (v_5e9bfe.response) {
          console.error('[API Error] Response Status:', v_5e9bfe.response.status);
          console.error('[API Error] Response Status Text:', v_5e9bfe.response.statusText);
          console.error('[API Error] Response Data:', v_5e9bfe.response.data);
          console.error('[API Error] Response Headers:', v_5e9bfe.response.headers);
        } else if (v_5e9bfe.request) {
          console.error('[API Error] Request Object:', v_5e9bfe.request);
          console.error('[API Error] Request Type:', typeof v_5e9bfe.request);
          if (v_5e9bfe.request._response) {
            console.error('[API Error] Request Response:', v_5e9bfe.request._response);
          }
        }
        console.error('[API Error] ========== FormData 요청 오류 끝 ==========');
      }

      {
        const v_d308b5 = v_5e9bfe.response?.status;
        const v_f71b56 = v_5e9bfe.config?.url ?? '';
        const v_f9da5d =
          v_f71b56.includes('google-auth-for-wallet') ||
          v_f71b56.includes('/login') ||
          v_f71b56.includes('/signup') ||
          v_f71b56.includes('/email-login') ||
          v_f71b56.includes('rotateSession');
        if (v_d308b5 === 401 && !v_f9da5d) {
          try {

            const v_d4b400 = (v_5e9bfe.response?.data as any)?.reason;
            if (v_d4b400 === 'session_invalidated') {
              try {
                const { Alert: v_03e392 } = await import('rcmrninabrnb');
                v_03e392.alert('알림', '다른 기기에서 로그인되어 자동 로그아웃되었습니다.');
              } catch {  }
            }
            console.warn('[API] 401 감지 — 로컬 auth state 클리어 + 로그인 화면으로 이동:', v_f71b56);

            let v_90f3c7 = null;
            let v_f24fd5 = null;
            try {
              [v_90f3c7, v_f24fd5] = await Promise.all([
                v_e84827.getItem('userEmail'),
                v_e84827.getItem('userData'),
              ]);
            } catch (v_9e86fd) {
              console.warn('[API] 언락 캐시 클리어용 스냅샷 조회 실패 — auth 클리어는 계속 진행:', v_9e86fd);
            }
            await Promise.all([
              v_e84827.removeItem('isLoggedIn'),
              v_e84827.removeItem('rememberMe'),
              v_e84827.removeItem('jwt'),
              v_e84827.removeItem('userData'),
            ]);
            try {
              const v_660822 = v_f24fd5 ? JSON.parse(v_f24fd5)?.member : undefined;
              if (v_90f3c7 && typeof v_660822 === 'number') {
                v_77f799(v_90f3c7, v_660822);
              }
            } catch (v_9e86fd) {
              console.warn('[API] 지갑 PIN 언락 캐시 클리어 실패 (userData 파싱):', v_9e86fd);
            }
          } catch (v_9e86fd) {
            console.warn('[API] auth state 클리어 실패:', v_9e86fd);
          }
          if (v_c65f5d?.reset) {
            try { v_c65f5d.reset(['login']); } catch {  }
          } else if (v_c65f5d?.navigate) {
            try { v_c65f5d.navigate('login'); } catch {  }
          }
        }
      }

      if (v_5e9bfe.code === 'ECONNABORTED' || v_5e9bfe.message.includes('timeout')) {
        console.error('[API Timeout]', v_5e9bfe.config?.url);
        if (v_c65f5d) {
          await v_e4d665(v_c65f5d);
        }
      } else {

        const v_d308b5 = v_5e9bfe.response?.status;
        const v_f71b56 = v_5e9bfe.config?.url ?? '';
        const v_4eac66 =
          (v_d308b5 === 409 || v_d308b5 === 401 || v_d308b5 === 400) &&
          v_f71b56.includes('google-auth-for-wallet');
        const v_88bc7e = {
          url: v_5e9bfe.config?.url,
          method: v_5e9bfe.config?.method,
          status: v_5e9bfe.response?.status,
          statusText: v_5e9bfe.response?.statusText,
          data: v_5e9bfe.response?.data,
          message: v_5e9bfe.message,
          code: v_5e9bfe.code,
        };
        if (v_4eac66) {
          console.warn('[API] 예상된 응답 (앱에서 안내 처리):', v_88bc7e);
        } else {
          console.error('[API Error]', v_88bc7e);
        }
      }
      return Promise.reject(v_5e9bfe);
    },
  );

  return v_0c3a5b;
};

export const v_60e3a5 = async (
  v_e0c7e8,
  v_c65f5d,
): Promise<boolean> => {
  try {
    const v_9f42a4 = v_7488d5(v_c65f5d);
    const request: v_81dfe9 = { email: v_e0c7e8 };

    console.log('[회원가입 1단계] 이메일 중복 확인 요청:', v_e0c7e8);

    const v_3393e3 = await v_9f42a4.post<v_70f41f>(
      '/login-checker-email',
      v_576f5a,
    );

    const v_43c42e = v_3393e3.data.data[0]?.value === 'OK';
    console.log('[회원가입 1단계] 이메일 중복 확인 결과:', v_43c42e ? '사용 가능' : '중복');

    return v_43c42e;
  } catch (v_5e9bfe) {
    console.error('[회원가입 1단계] 이메일 중복 확인 실패:', v_5e9bfe);
    throw v_5e9bfe;
  }
};

export const v_f5ecec = async (
  v_e0c7e8,
  v_c65f5d,
): Promise<boolean> => {
  try {
    const v_9f42a4 = v_7488d5(v_c65f5d);
    const request: v_8fe320 = { email: v_e0c7e8 };

    console.log('[로그인] 이메일 존재 확인 요청:', v_e0c7e8);

    const v_3393e3 = await v_9f42a4.post<v_7f7c81>(
      '/ap1810-i01',
      v_576f5a,
    );

    const v_43c42e = v_3393e3.data.data[0]?.result === true;
    console.log('[로그인] 이메일 존재 확인 결과:', v_43c42e ? '등록된 이메일' : '미등록 이메일');

    return v_43c42e;
  } catch (v_5e9bfe) {
    console.error('[로그인] 이메일 존재 확인 실패:', v_5e9bfe);
    throw v_5e9bfe;
  }
};

export const v_01332e = async (
  v_c4cf0d,
  v_c65f5d,
): Promise<number | null> => {
  try {
    const v_9f42a4 = v_7488d5(v_c65f5d);
    const v_2f361a = (v_c4cf0d || '').trim();

    const v_909fd0 = /^[23456789ABCDEFGHJKMNPQRSTUVWXYZ]{6}$/i.test(v_2f361a);
    if (v_909fd0) {
      console.log('[회원가입 2단계] 추천코드 형식 감지 → lookup-referral:', v_2f361a);
      const v_c1cd9e = await v_9f42a4.get(`/lookup-referral?code=${encodeURIComponent(v_2f361a.toUpperCase())}`);
      const v_3b7754 = v_c1cd9e.data?.data?.[0];
      if (v_3b7754?.exists && v_3b7754.member) {
        console.log('[회원가입 2단계] 추천코드 매칭 성공:', v_3b7754.member);
        return v_3b7754.member;
      }
      console.log('[회원가입 2단계] 추천코드 매칭 실패');
      return null;
    }

    const request: v_a357d3 = { email: v_2f361a };
    console.log('[회원가입 2단계] 추천이메일 확인 요청:', v_2f361a);
    const v_3393e3 = await v_9f42a4.post<v_d6bdce>(
      '/ap1810-i01',
      v_576f5a,
    );
    const v_43c42e = v_3393e3.data.data[0];
    if (v_43c42e?.result === true && v_43c42e.member) {
      console.log('[회원가입 2단계] 추천이메일 매칭 성공:', v_43c42e.member);
      return v_43c42e.member;
    }
    console.log('[회원가입 2단계] 추천이메일 매칭 실패');
    return null;
  } catch (v_5e9bfe) {
    console.error('[회원가입 2단계] 추천 입력 확인 실패:', v_5e9bfe);
    throw v_5e9bfe;
  }
};

export const v_35200c = async (
  signupData: v_e71577,
  v_c65f5d,
): Promise<boolean> => {
  try {
    const v_9f42a4 = v_7488d5(v_c65f5d);

    console.log('[회원가입 3단계] 회원가입 실행 요청:', {
      email: v_df7dab.email,
      firstname: v_df7dab.firstname,
      lastname: v_df7dab.lastname,
      gender: v_df7dab.gender,
      age: v_df7dab.age,
      os: v_df7dab.os,
      mobile: v_df7dab.mobile,
      region: v_df7dab.region,
    });

    const { getDeviceId: v_863c7f } = require('../utils/deviceIdentity');
    const v_b6d4b8 = await v_863c7f();
    const v_3393e3 = await v_9f42a4.post<v_2c1a39>(
      '/login-06-joinAndAccount',
      { ...v_df7dab, device_id: v_b6d4b8 },
    );

    console.log('[회원가입 3단계] 회원가입 응답:', {
      status: v_3393e3.status,
      data: v_3393e3.data,
    });

    const v_43c42e = v_3393e3.data.data[0]?.text === 'ok';
    console.log('[회원가입 3단계] 회원가입 결과:', v_43c42e ? '성공' : '실패');

    return v_43c42e;
  } catch (v_5e9bfe) {
    console.error('[회원가입 3단계] 회원가입 실행 실패:', v_5e9bfe);
    if (v_5e9bfe instanceof v_3333d3) {
      console.error('[회원가입 3단계] 상세 오류 정보:', {
        url: v_5e9bfe.config?.url,
        method: v_5e9bfe.config?.method,
        status: v_5e9bfe.response?.status,
        statusText: v_5e9bfe.response?.statusText,
        data: v_5e9bfe.response?.data,
        requestData: v_5e9bfe.config?.data,
      });
    }
    throw v_5e9bfe;
  }
};

export const v_9d2541 = async (
  v_e0c7e8,
  v_6bee94,
  v_c65f5d,
): Promise<boolean> => {
  try {
    const v_9f42a4 = v_7488d5(v_c65f5d);
    const request: v_3edf6c = { email: v_e0c7e8, pin: v_6bee94 };

    console.log('[회원가입 4단계] 로그인 확인 요청:', v_e0c7e8);

    const v_3393e3 = await v_9f42a4.post<v_d5571c>(
      '/login-checker',
      v_576f5a,
    );

    const v_43c42e = v_3393e3.data.data[0]?.value === 'OK';
    console.log('[회원가입 4단계] 로그인 확인 결과:', v_43c42e ? '성공' : '실패');

    await v_964a96(v_3393e3);

    await v_5ed938();

    return v_43c42e;
  } catch (v_5e9bfe) {
    console.error('[회원가입 4단계] 로그인 확인 실패:', v_5e9bfe);
    throw v_5e9bfe;
  }
};

export const v_91bb22 = {

  getGenderCode: (v_c3eac4): number => {
    if (v_c3eac4 === '0') return 0;
    return v_c3eac4 === 'male' ? 2110 : 2111;
  },

  getAgeCode: (v_f83808): number => {
    if (v_f83808 === '0') return 0;
    const v_c3889d = {
      '10': 2210,
      '20': 2220,
      '30': 2230,
      '40': 2240,
      '50+': 2250,
    };
    return v_c3889d[v_f83808] || 0;
  },

  getOSCode: (): number => {
    return v_326be8.OS === 'android' ? 3112 : 3113;
  },
};

export const v_a5170b = (v_9b6134): string => {
  return v_a928e1.SHA256(v_9b6134).toString();
};

export const v_b699a9 = async (
  v_e0c7e8,
  v_6bee94,
  v_c65f5d,
): Promise<v_74e8fc> => {
  try {
    const v_9f42a4 = v_7488d5(v_c65f5d);
    const { getDeviceId: v_863c7f } = require('../utils/deviceIdentity');
    const v_b6d4b8 = await v_863c7f();
    const v_576f5a = {
      type: 4,
      email: v_e0c7e8,
      pin: v_6bee94,
      device_id: v_b6d4b8,
    };

    console.log('[로그인] 이메일/비밀번호 로그인 요청:', v_e0c7e8);

    const v_3393e3 = await v_9f42a4.post<v_74e8fc>(
      '/login-01',
      v_576f5a,
    );

    if (v_3393e3.data.status === 'success') {
      console.log('[로그인] 이메일/비밀번호 로그인 성공');

      await v_964a96(v_3393e3);
    } else {
      console.error('[로그인] 이메일/비밀번호 로그인 실패:', v_3393e3.data);
    }

    await v_5ed938();

    return v_3393e3.data;
  } catch (v_5e9bfe) {

    if (__DEV__) {
      if (v_5e9bfe instanceof v_3333d3) {

        if (v_5e9bfe.code === 'ERR_NETWORK') {
          console.warn('[로그인] 이메일/비밀번호 로그인 네트워크 에러');
        } else {
          console.error('[로그인] 이메일/비밀번호 로그인 오류:', v_5e9bfe);
          console.error('[로그인] 상세 오류 정보:', {
            url: v_5e9bfe.config?.url,
            method: v_5e9bfe.config?.method,
            status: v_5e9bfe.response?.status,
            statusText: v_5e9bfe.response?.statusText,
            data: v_5e9bfe.response?.data,
            message: v_5e9bfe.message,
          });
        }
      } else {
        console.error('[로그인] 이메일/비밀번호 로그인 오류:', v_5e9bfe);
      }
    }
    throw v_5e9bfe;
  }
};

export const v_508a17 = async (
  v_6bee94,
  v_49ea09,
  v_c65f5d,
): Promise<v_74e8fc> => {
  try {
    const v_9f42a4 = v_7488d5(v_c65f5d);
    const request: v_073611 = {
      type: 3,
      pin: v_6bee94,
      mobile: v_49ea09,
    };

    console.log('[로그인] 비밀번호 로그인 요청:', v_49ea09);

    const v_3393e3 = await v_9f42a4.post<v_74e8fc>(
      '/login-01',
      v_576f5a,
    );

    if (v_3393e3.data.status === 'success') {
      console.log('[로그인] 비밀번호 로그인 성공');

      await v_964a96(v_3393e3);
    } else {
      console.error('[로그인] 비밀번호 로그인 실패:', v_3393e3.data);
    }

    await v_5ed938();

    return v_3393e3.data;
  } catch (v_5e9bfe) {

    if (__DEV__) {
      if (v_5e9bfe instanceof v_3333d3) {

        if (v_5e9bfe.code === 'ERR_NETWORK') {
          console.warn('[로그인] 비밀번호 로그인 네트워크 에러');
        } else {
          console.error('[로그인] 비밀번호 로그인 오류:', v_5e9bfe);
          console.error('[로그인] 상세 오류 정보:', {
            url: v_5e9bfe.config?.url,
            method: v_5e9bfe.config?.method,
            status: v_5e9bfe.response?.status,
            statusText: v_5e9bfe.response?.statusText,
            data: v_5e9bfe.response?.data,
            message: v_5e9bfe.message,
          });
        }
      } else {
        console.error('[로그인] 비밀번호 로그인 오류:', v_5e9bfe);
      }
    }
    throw v_5e9bfe;
  }
};

export const v_4c4126 = async (
  v_30a799,
  v_6bee94,
  v_c65f5d,
  v_717992,
): Promise<v_264b01> => {
  try {
    const v_94604b =
      v_30a799?.confirmationToken ??
      v_30a799?.token ??
      v_30a799?.connectToken ??
      v_30a799?.linkToken ??
      v_30a799?.authToken ??
      '';
    if (!v_94604b) {
      console.error('[계정 연동] confirmationToken 없음. googleData 키:', v_30a799 ? Object.keys(v_30a799) : [], '- 백엔드에서 계정 연동용 토큰을 내려주는지 확인해 주세요.');
      throw new Error('confirmationToken is required. 구글 로그인을 다시 시도해 주세요.');
    }

    const v_9f42a4 = v_7488d5(v_c65f5d);
    const request: v_4228ad = {
      ...v_30a799,
      memberId: v_717992 || v_30a799.memberId,
      pin: v_6bee94,
      confirmationToken: v_94604b,
    };

    console.log('[계정 연동] 구글 계정 연동 요청');
    console.log('[계정 연동] 요청 데이터 (비밀번호 포함):', JSON.stringify(v_576f5a, null, 2));

    const v_3393e3 = await v_9f42a4.post<v_264b01>(
      '/connect-google-account',
      v_576f5a,
    );

    console.log('[계정 연동] 요청 성공, 응답:', JSON.stringify(v_3393e3.data, null, 2));
    return v_3393e3.data;
  } catch (v_5e9bfe) {
    console.error('[계정 연동] 요청 오류:', v_5e9bfe);
    if (v_5e9bfe.response?.status === 401) {
      console.log('[계정 연동] 비밀번호 불일치 (401)');
      return {
        success: false,
        code: '401',
        message: '비밀번호가 일치하지 않습니다.',
      };
    }
    throw v_5e9bfe;
  }
};

export const v_c35640 = async (
  v_717992,
  v_c65f5d,
): Promise<v_edbc8e> => {
  const v_9f42a4 = v_7488d5(v_c65f5d);
  const body: v_f0adc1 = { memberId: v_717992 };
  const v_3393e3 = await v_9f42a4.post<v_edbc8e>(
    '/check-social-for-wallet',
    v_4d33b2,
  );
  return v_3393e3.data;
};

export const v_faae7b = async (
  v_717992,
  v_b50834,
  v_6bee94,
  v_c65f5d,
): Promise<v_ea783f> => {
  const v_9f42a4 = v_7488d5(v_c65f5d);
  const body: v_4d8e20 = { memberId: v_717992, idToken: v_b50834 };
  if (v_6bee94 !== undefined && v_6bee94 !== '') {
    v_4d33b2.pin = v_6bee94;
  }

  const v_3393e3 = await v_9f42a4.post<v_ea783f>(
    '/google-auth-for-wallet',
    v_4d33b2,
  );
  return v_3393e3.data;
};

export const v_1fee11 = async (
  v_39aae3,
  v_6bee94,
  v_c65f5d,
): Promise<any> => {
  try {
    const v_9f42a4 = v_7488d5(v_c65f5d);
    const v_576f5a = {
      ...v_39aae3,
      pin: v_6bee94,
    };

    console.log('[계정 연동] 애플 계정 연동 요청');
    console.log('[계정 연동] 요청 데이터 (비밀번호 포함):', JSON.stringify(v_576f5a, null, 2));

    const v_3393e3 = await v_9f42a4.post<any>(
      '/connect-apple-account',
      v_576f5a,
    );

    console.log('[계정 연동] 요청 성공, 응답:', JSON.stringify(v_3393e3.data, null, 2));
    return v_3393e3.data;
  } catch (v_5e9bfe) {
    console.error('[계정 연동] 요청 오류:', v_5e9bfe);
    if (v_5e9bfe.response?.status === 401) {
      console.log('[계정 연동] 비밀번호 불일치 (401)');
      return {
        success: false,
        code: '401',
        message: '비밀번호가 일치하지 않습니다.',
      };
    }
    throw v_5e9bfe;
  }
};

export const v_2ecc3f = async (
  v_b9bbbd,
  v_49ea09,
  v_c65f5d,
): Promise<boolean> => {
  try {
    const v_9f42a4 = v_7488d5(v_c65f5d);
    const request: v_7ec238 = {
      country: v_b9bbbd,
      mobile: v_49ea09,
    };

    console.log('[로그인] 전화번호 인증 코드 발송 요청:', v_49ea09);

    const v_3393e3 = await v_9f42a4.post<v_c5fe19>(
      '/login-02',
      v_576f5a,
    );

    const v_43c42e = v_3393e3.data.data[0]?.status === true;
    console.log('[로그인] 전화번호 인증 코드 발송 결과:', v_43c42e ? '성공' : '실패');

    return v_43c42e;
  } catch (v_5e9bfe) {
    console.error('[로그인] 전화번호 인증 코드 발송 오류:', v_5e9bfe);
    if (v_5e9bfe instanceof v_3333d3) {
      console.error('[로그인] 상세 오류 정보:', {
        url: v_5e9bfe.config?.url,
        method: v_5e9bfe.config?.method,
        status: v_5e9bfe.response?.status,
        statusText: v_5e9bfe.response?.statusText,
        data: v_5e9bfe.response?.data,
        message: v_5e9bfe.message,
      });
    }
    throw v_5e9bfe;
  }
};

export const v_3ca504 = async (
  v_49ea09,
  v_c99bd2,
  v_c65f5d,
): Promise<boolean> => {
  try {
    const v_9f42a4 = v_7488d5(v_c65f5d);
    const request: v_07bb04 = {
      mobile: v_49ea09,
      code: v_c99bd2,
    };

    console.log('[로그인] 전화번호 인증 코드 확인 요청:', v_49ea09);

    const v_3393e3 = await v_9f42a4.post<v_e7e12a>(
      '/login-03',
      v_576f5a,
    );

    const v_43c42e = v_3393e3.data.data === 'login';
    console.log('[로그인] 전화번호 인증 코드 확인 결과:', v_43c42e ? '로그인 가능' : '인증 실패');

    return v_43c42e;
  } catch (v_5e9bfe) {
    console.error('[로그인] 전화번호 인증 코드 확인 오류:', v_5e9bfe);
    if (v_5e9bfe instanceof v_3333d3) {
      console.error('[로그인] 상세 오류 정보:', {
        url: v_5e9bfe.config?.url,
        method: v_5e9bfe.config?.method,
        status: v_5e9bfe.response?.status,
        statusText: v_5e9bfe.response?.statusText,
        data: v_5e9bfe.response?.data,
        message: v_5e9bfe.message,
      });
    }
    throw v_5e9bfe;
  }
};

export const v_7e0a86 = async (
  v_49ea09,
  v_c65f5d,
): Promise<v_74e8fc> => {
  try {
    const v_9f42a4 = v_7488d5(v_c65f5d);
    const request: v_a88df4 = {
      type: 2,
      mobile: v_49ea09,
    };

    console.log('[로그인] 전화번호 로그인 요청:', v_49ea09);

    const v_3393e3 = await v_9f42a4.post<v_74e8fc>(
      '/login-01',
      v_576f5a,
    );

    if (v_3393e3.data.status === 'success') {
      console.log('[로그인] 전화번호 로그인 성공');

      await v_964a96(v_3393e3);
    } else {
      console.error('[로그인] 전화번호 로그인 실패:', v_3393e3.data);
    }

    await v_5ed938();

    return v_3393e3.data;
  } catch (v_5e9bfe) {

    if (__DEV__) {
      if (v_5e9bfe instanceof v_3333d3) {

        if (v_5e9bfe.code === 'ERR_NETWORK') {
          console.warn('[로그인] 전화번호 로그인 네트워크 에러');
        } else {
          console.error('[로그인] 전화번호 로그인 오류:', v_5e9bfe);
          console.error('[로그인] 상세 오류 정보:', {
            url: v_5e9bfe.config?.url,
            method: v_5e9bfe.config?.method,
            status: v_5e9bfe.response?.status,
            statusText: v_5e9bfe.response?.statusText,
            data: v_5e9bfe.response?.data,
            message: v_5e9bfe.message,
          });
        }
      } else {
        console.error('[로그인] 전화번호 로그인 오류:', v_5e9bfe);
      }
    }
    throw v_5e9bfe;
  }
};

export const v_8025d1 = async (
  v_e0c7e8,
  v_c65f5d,
): Promise<boolean> => {
  try {
    const v_9f42a4 = v_7488d5(v_c65f5d, {
      baseURL: v_a57efd(),
    });
    const request: v_897bd3 = {
      email: v_e0c7e8,
    };

    console.log('[로그인] 이메일 인증 코드 발송 요청:', v_e0c7e8);

    const v_3393e3 = await v_9f42a4.post<v_3eb2f0>(
      '/check-02-email',
      v_576f5a,
    );

    const v_d308b5 = v_3393e3.data.data[0]?.status;
    const v_43c42e = v_d308b5 === true || v_d308b5 === 'true';
    console.log('[로그인] 이메일 인증 코드 발송 결과:', v_43c42e ? '성공' : '실패', { status: v_d308b5 });

    return v_43c42e;
  } catch (v_5e9bfe) {
    console.error('[로그인] 이메일 인증 코드 발송 오류:', v_5e9bfe);
    if (v_5e9bfe instanceof v_3333d3) {
      console.error('[로그인] 상세 오류 정보:', {
        url: v_5e9bfe.config?.url,
        method: v_5e9bfe.config?.method,
        status: v_5e9bfe.response?.status,
        statusText: v_5e9bfe.response?.statusText,
        data: v_5e9bfe.response?.data,
        message: v_5e9bfe.message,
      });
    }
    throw v_5e9bfe;
  }
};

export const v_415628 = async (
  v_e0c7e8,
  v_c99bd2,
  v_c65f5d,
): Promise<boolean> => {
  try {
    const v_9f42a4 = v_7488d5(v_c65f5d, {
      baseURL: v_a57efd(),
    });
    const request: v_b2dc50 = {
      email: v_e0c7e8,
      code: v_c99bd2,
    };

    console.log('[로그인] 이메일 인증 코드 확인 요청:', v_e0c7e8);

    const v_3393e3 = await v_9f42a4.post<v_2f87f0>(
      '/login-03-email',
      v_576f5a,
    );

    const v_43c42e = !!(v_3393e3.data.member || v_3393e3.data.status === 'success');
    console.log('[로그인] 이메일 인증 코드 확인 결과:', v_43c42e ? '성공' : '실패', {
      member: v_3393e3.data.member,
      transaction: v_3393e3.data.transaction,
      status: v_3393e3.data.status,
    });

    return v_43c42e;
  } catch (v_5e9bfe) {
    console.error('[로그인] 이메일 인증 코드 확인 오류:', v_5e9bfe);
    if (v_5e9bfe instanceof v_3333d3) {
      console.error('[로그인] 상세 오류 정보:', {
        url: v_5e9bfe.config?.url,
        method: v_5e9bfe.config?.method,
        status: v_5e9bfe.response?.status,
        statusText: v_5e9bfe.response?.statusText,
        data: v_5e9bfe.response?.data,
        message: v_5e9bfe.message,
      });
    }
    throw v_5e9bfe;
  }
};

export const v_a81308 = async (
  v_e0c7e8,
  v_c65f5d,
): Promise<v_2ff10f> => {
  try {
    const v_9f42a4 = v_7488d5(v_c65f5d, {
      baseURL: v_a57efd(),
    });
    const { getDeviceId: v_863c7f } = require('../utils/deviceIdentity');
    const v_b6d4b8 = await v_863c7f();
    const v_576f5a = {
      email: v_e0c7e8,
      device_id: v_b6d4b8,
    };

    console.log('[로그인] 이메일 인증 로그인 요청:', v_e0c7e8);

    const v_3393e3 = await v_9f42a4.post<v_2ff10f>(
      '/login-04-email',
      v_576f5a,
    );

    if (v_3393e3.data.status === 'success') {
      console.log('[로그인] 이메일 인증 로그인 성공');

      await v_964a96(v_3393e3);
    } else {
      console.error('[로그인] 이메일 인증 로그인 실패:', v_3393e3.data);
    }

    await v_5ed938();

    return v_3393e3.data;
  } catch (v_5e9bfe) {

    if (__DEV__) {
      if (v_5e9bfe instanceof v_3333d3) {

        if (v_5e9bfe.code === 'ERR_NETWORK') {
          console.warn('[로그인] 이메일 인증 로그인 네트워크 에러');
        } else {
          console.error('[로그인] 이메일 인증 로그인 오류:', v_5e9bfe);
          console.error('[로그인] 상세 오류 정보:', {
            url: v_5e9bfe.config?.url,
            method: v_5e9bfe.config?.method,
            status: v_5e9bfe.response?.status,
            statusText: v_5e9bfe.response?.statusText,
            data: v_5e9bfe.response?.data,
            message: v_5e9bfe.message,
          });
        }
      } else {
        console.error('[로그인] 이메일 인증 로그인 오류:', v_5e9bfe);
      }
    }
    throw v_5e9bfe;
  }
};

export const v_32502f = async (
  v_b50834,
  v_c65f5d,
): Promise<v_74e8fc> => {
  try {
    const v_9f42a4 = v_7488d5(v_c65f5d);

    console.log('[로그인] Google ID Token 로그인 요청');

    const { getDeviceId: v_863c7f } = require('../utils/deviceIdentity');
    const v_b6d4b8 = await v_863c7f();
    const v_3393e3 = await v_9f42a4.post<v_74e8fc>('/login-google', {
      idToken: v_b50834,
      device_id: v_b6d4b8,
    });

    if (v_3393e3.data.status === 'success') {
      console.log('[로그인] Google ID Token 로그인 성공');

      await v_964a96(v_3393e3);
    } else {
      console.error('[로그인] Google ID Token 로그인 실패:', v_3393e3.data);
    }

    await v_5ed938();

    return v_3393e3.data;
  } catch (v_5e9bfe) {
    if (__DEV__ && v_5e9bfe instanceof v_3333d3) {
      console.error('[로그인] Google ID Token 로그인 오류:', {
        status: v_5e9bfe.response?.status,
        data: v_5e9bfe.response?.data,
        message: v_5e9bfe.message,
      });
    }
    throw v_5e9bfe;
  }
};

export const v_ea3493 = async (
  v_660822,
  v_06cee6,
  v_c65f5d,
): Promise<boolean> => {
  try {
    const v_9f42a4 = v_7488d5(v_c65f5d);
    const request: v_d047dc = {
      member: v_660822,
      ssidw: v_06cee6,
    };

    console.log('[로그인] 세션 저장 요청:', v_660822);

    const v_3393e3 = await v_9f42a4.post<v_60982a>(
      '/saveSsidw',
      v_576f5a,
    );

    const v_43c42e = v_3393e3.data.data[0]?.affectedRows === 1;
    console.log('[로그인] 세션 저장 결과:', v_43c42e ? '성공' : '실패');

    return v_43c42e;
  } catch (v_5e9bfe) {
    console.error('[로그인] 세션 저장 오류:', v_5e9bfe);
    if (v_5e9bfe instanceof v_3333d3) {
      console.error('[로그인] 상세 오류 정보:', {
        url: v_5e9bfe.config?.url,
        method: v_5e9bfe.config?.method,
        status: v_5e9bfe.response?.status,
        statusText: v_5e9bfe.response?.statusText,
        data: v_5e9bfe.response?.data,
        message: v_5e9bfe.message,
      });
    }
    throw v_5e9bfe;
  }
};

export const v_98a863 = async (
  v_660822,
  v_c65f5d,
): Promise<v_85f3ff> => {
  try {
    const v_9f42a4 = v_7488d5(v_c65f5d);
    const request: v_b8b333 = {
      member: v_660822,
    };

    console.log('[로그인] 사용자 정보 조회 요청:', v_660822);

    const v_3393e3 = await v_9f42a4.get<v_85f3ff>(
      '/app7000-01',
      {
        params: v_576f5a,
      },
    );

    console.log('[로그인] 사용자 정보 조회 성공');

    return v_3393e3.data;
  } catch (v_5e9bfe) {
    console.error('[로그인] 사용자 정보 조회 오류:', v_5e9bfe);
    if (v_5e9bfe instanceof v_3333d3) {
      console.error('[로그인] 상세 오류 정보:', {
        url: v_5e9bfe.config?.url,
        method: v_5e9bfe.config?.method,
        status: v_5e9bfe.response?.status,
        statusText: v_5e9bfe.response?.statusText,
        data: v_5e9bfe.response?.data,
        message: v_5e9bfe.message,
      });
    }
    throw v_5e9bfe;
  }
};

export const v_a7ab3c = async (
  v_660822,
  v_c65f5d,
): Promise<v_0bd014> => {
  try {
    const v_9f42a4 = v_7488d5(v_c65f5d);
    const request: v_72b8c4 = {
      member: v_660822,
    };

    console.log('[마이페이지] 사용자 정보 조회 요청:', v_660822);

    const v_3393e3 = await v_9f42a4.post<v_0bd014>(
      '/app7110-01',
      v_576f5a,
    );

    console.log('[마이페이지] 사용자 정보 조회 성공');

    return v_3393e3.data;
  } catch (v_5e9bfe) {
    console.error('[마이페이지] 사용자 정보 조회 오류:', v_5e9bfe);
    if (v_5e9bfe instanceof v_3333d3) {
      console.error('[마이페이지] 상세 오류 정보:', {
        url: v_5e9bfe.config?.url,
        method: v_5e9bfe.config?.method,
        status: v_5e9bfe.response?.status,
        statusText: v_5e9bfe.response?.statusText,
        data: v_5e9bfe.response?.data,
        message: v_5e9bfe.message,
      });
    }
    throw v_5e9bfe;
  }
};

export const v_152d53 = async (
  v_660822,
  v_54d565,
  v_c65f5d,
): Promise<v_680003> => {
  try {
    const v_9f42a4 = v_7488d5(v_c65f5d);
    const request: v_bd3e83 = {
      member: v_660822,
      firstname: v_54d565,
    };

    console.log('[마이페이지] 이름 수정 요청:', { member: v_660822, firstname: v_54d565 });

    const v_3393e3 = await v_9f42a4.post<v_680003>(
      '/app7120-01',
      v_576f5a,
    );

    console.log('[마이페이지] 이름 수정 성공');

    return v_3393e3.data;
  } catch (v_5e9bfe) {
    console.error('[마이페이지] 이름 수정 오류:', v_5e9bfe);
    if (v_5e9bfe instanceof v_3333d3) {
      console.error('[마이페이지] 상세 오류 정보:', {
        url: v_5e9bfe.config?.url,
        method: v_5e9bfe.config?.method,
        status: v_5e9bfe.response?.status,
        statusText: v_5e9bfe.response?.statusText,
        data: v_5e9bfe.response?.data,
        message: v_5e9bfe.message,
      });
    }
    throw v_5e9bfe;
  }
};

export const v_7f8c9e = async (
  v_660822,
  v_9517dc,
  v_c65f5d,
): Promise<v_2b5bdc> => {
  try {
    const v_9f42a4 = v_7488d5(v_c65f5d);
    const request: v_52573c = {
      member: v_660822,
      lastname: v_9517dc,
    };

    console.log('[마이페이지] 성 수정 요청:', { member: v_660822, lastname: v_9517dc });

    const v_3393e3 = await v_9f42a4.post<v_2b5bdc>(
      '/app7130-01',
      v_576f5a,
    );

    console.log('[마이페이지] 성 수정 성공');

    return v_3393e3.data;
  } catch (v_5e9bfe) {
    console.error('[마이페이지] 성 수정 오류:', v_5e9bfe);
    if (v_5e9bfe instanceof v_3333d3) {
      console.error('[마이페이지] 상세 오류 정보:', {
        url: v_5e9bfe.config?.url,
        method: v_5e9bfe.config?.method,
        status: v_5e9bfe.response?.status,
        statusText: v_5e9bfe.response?.statusText,
        data: v_5e9bfe.response?.data,
        message: v_5e9bfe.message,
      });
    }
    throw v_5e9bfe;
  }
};

export const v_53d723 = async (
  v_660822,
  v_49ea09,
  v_3f1fb1,
  v_c65f5d,
): Promise<v_648048> => {
  try {
    const v_9f42a4 = v_7488d5(v_c65f5d);
    const request: v_4ac02a = {
      member: v_660822,
      mobile: v_49ea09,
      mobilecode: v_3f1fb1,
    };

    console.log('[전화번호수정] 전화번호 수정 요청:', { member: v_660822, mobile: v_49ea09, mobilecode: v_3f1fb1 });

    const v_3393e3 = await v_9f42a4.post<v_648048>(
      '/app7153-03',
      v_576f5a,
    );

    console.log('[전화번호수정] 전화번호 수정 성공:', v_3393e3.data);

    return v_3393e3.data;
  } catch (v_5e9bfe) {
    console.error('[전화번호수정] 전화번호 수정 오류:', v_5e9bfe);
    if (v_5e9bfe instanceof v_3333d3) {
      console.error('[전화번호수정] 상세 오류 정보:', {
        url: v_5e9bfe.config?.url,
        method: v_5e9bfe.config?.method,
        status: v_5e9bfe.response?.status,
        statusText: v_5e9bfe.response?.statusText,
        data: v_5e9bfe.response?.data,
        message: v_5e9bfe.message,
      });
    }
    throw v_5e9bfe;
  }
};

export const v_71d37e = async (
  v_660822,
  v_c3eac4,
  v_c65f5d,
): Promise<v_6896c1> => {
  try {
    const v_9f42a4 = v_7488d5(v_c65f5d);
    const request: v_32dea4 = {
      member: v_660822,
      gender: v_c3eac4,
    };

    console.log('[마이페이지] 성별 수정 요청:', { member: v_660822, gender: v_c3eac4 });

    const v_3393e3 = await v_9f42a4.post<v_6896c1>(
      '/app7180-01',
      v_576f5a,
    );

    console.log('[마이페이지] 성별 수정 성공');

    return v_3393e3.data;
  } catch (v_5e9bfe) {
    console.error('[마이페이지] 성별 수정 오류:', v_5e9bfe);
    if (v_5e9bfe instanceof v_3333d3) {
      console.error('[마이페이지] 상세 오류 정보:', {
        url: v_5e9bfe.config?.url,
        method: v_5e9bfe.config?.method,
        status: v_5e9bfe.response?.status,
        statusText: v_5e9bfe.response?.statusText,
        data: v_5e9bfe.response?.data,
        message: v_5e9bfe.message,
      });
    }
    throw v_5e9bfe;
  }
};

export const v_07f367 = async (
  v_660822,
  v_6e272b,
  v_c65f5d,
): Promise<v_3059f1> => {
  try {
    const v_9f42a4 = v_7488d5(v_c65f5d);
    const request: v_97a4a7 = {
      member: v_660822,
      ages: v_6e272b,
    };

    console.log('[마이페이지] 나이 수정 요청:', { member: v_660822, ages: v_6e272b });

    const v_3393e3 = await v_9f42a4.post<v_3059f1>(
      '/app7170-01',
      v_576f5a,
    );

    console.log('[마이페이지] 나이 수정 성공');

    return v_3393e3.data;
  } catch (v_5e9bfe) {
    console.error('[마이페이지] 나이 수정 오류:', v_5e9bfe);
    if (v_5e9bfe instanceof v_3333d3) {
      console.error('[마이페이지] 상세 오류 정보:', {
        url: v_5e9bfe.config?.url,
        method: v_5e9bfe.config?.method,
        status: v_5e9bfe.response?.status,
        statusText: v_5e9bfe.response?.statusText,
        data: v_5e9bfe.response?.data,
        message: v_5e9bfe.message,
      });
    }
    throw v_5e9bfe;
  }
};

export const v_60f557 = async (
  v_c65f5d,
): Promise<v_c4dd46> => {
  try {
    const v_9f42a4 = v_7488d5(v_c65f5d);

    console.log('[마이페이지] 국가 목록 조회 요청');

    const v_3393e3 = await v_9f42a4.get<v_c4dd46>('/countries');

    console.log('[마이페이지] 국가 목록 조회 성공');

    return v_3393e3.data;
  } catch (v_5e9bfe) {
    console.error('[마이페이지] 국가 목록 조회 오류:', v_5e9bfe);
    if (v_5e9bfe instanceof v_3333d3) {
      console.error('[마이페이지] 상세 오류 정보:', {
        url: v_5e9bfe.config?.url,
        method: v_5e9bfe.config?.method,
        status: v_5e9bfe.response?.status,
        statusText: v_5e9bfe.response?.statusText,
        data: v_5e9bfe.response?.data,
        message: v_5e9bfe.message,
      });
    }
    throw v_5e9bfe;
  }
};

export const v_11e39e = async (
  v_b9bbbd,
  v_c65f5d,
): Promise<v_7d842d> => {
  try {
    const v_9f42a4 = v_7488d5(v_c65f5d);
    const request: v_6d05a4 = {
      country: v_b9bbbd,
    };

    console.log('[마이페이지] 지역 목록 조회 요청:', { country: v_b9bbbd });

    const v_3393e3 = await v_9f42a4.post<v_7d842d>(
      '/app7190-01',
      v_576f5a,
    );

    console.log('[마이페이지] 지역 목록 조회 성공');
    console.log('[마이페이지] 지역 목록 응답 데이터:', {
      status: v_3393e3.data.status,
      has_regions: v_3393e3.data.has_regions,
      dataLength: v_3393e3.data.data?.length || 0,
      data: v_3393e3.data.data,
    });

    return v_3393e3.data;
  } catch (v_5e9bfe) {

    if (__DEV__) {
      console.error('[마이페이지] 지역 목록 조회 오류:', v_5e9bfe);
      if (v_5e9bfe instanceof v_3333d3) {

        if (v_5e9bfe.code === 'ERR_NETWORK') {
          console.warn('[마이페이지] 지역 목록 조회 네트워크 에러 - fallback 사용');
        } else {
          console.error('[마이페이지] 상세 오류 정보:', {
            url: v_5e9bfe.config?.url,
            method: v_5e9bfe.config?.method,
            status: v_5e9bfe.response?.status,
            statusText: v_5e9bfe.response?.statusText,
            data: v_5e9bfe.response?.data,
            message: v_5e9bfe.message,
          });
        }
      }
    }
    throw v_5e9bfe;
  }
};

export const v_4296b8 = async (
  v_660822,
  v_b9bbbd,
  v_a6c30b,
  v_c65f5d,
  v_b36f96,
): Promise<v_9b135d> => {
  try {

    if (v_660822 === undefined || v_660822 === null || isNaN(v_660822)) {
      throw new Error('회원 ID가 유효하지 않습니다.');
    }

    if (v_b9bbbd === undefined || v_b9bbbd === null || isNaN(v_b9bbbd)) {
      throw new Error('국가 코드가 유효하지 않습니다.');
    }

    if (v_a6c30b === undefined || v_a6c30b === null || isNaN(v_a6c30b)) {
      throw new Error('지역 코드가 유효하지 않습니다.');
    }

    const v_9f42a4 = v_7488d5(v_c65f5d);

    const v_90772d = Number(v_660822);
    const v_f6907d = Number(v_b9bbbd);
    const v_5cf162 = Number(v_a6c30b);

    console.log('[마이페이지] 지역 수정 요청 - 입력 파라미터:', {
      입력member: v_660822,
      입력country: v_b9bbbd,
      입력region: v_a6c30b,
      입력타입: {
        member: typeof v_660822,
        country: typeof v_b9bbbd,
        region: typeof v_a6c30b,
      },
    });

    console.log('[마이페이지] 지역 수정 요청 - 변환 후:', {
      변환member: v_90772d,
      변환country: v_f6907d,
      변환region: v_5cf162,
      변환타입: {
        member: typeof v_90772d,
        country: typeof v_f6907d,
        region: typeof v_5cf162,
      },
      isNaN체크: {
        member: isNaN(v_90772d),
        country: isNaN(v_f6907d),
        region: isNaN(v_5cf162),
      },
    });

    const request: v_bf21af = {
      member: v_90772d,
      country: v_f6907d,
      region: v_5cf162,
    };

    if (v_b36f96?.countrycode !== undefined && v_b36f96?.countrycode !== null) {
      v_576f5a.countrycode = v_b36f96.countrycode;
    }
    if (v_b36f96?.mobilecode !== undefined && v_b36f96?.mobilecode !== null) {
      v_576f5a.mobilecode = v_b36f96.mobilecode;
    }

    const v_93e237 = (v_8839e3): any => {
      if (v_8839e3 === undefined) return null;
      if (v_8839e3 === null || typeof v_8839e3 !== 'object') return v_8839e3;
      if (Array.isArray(v_8839e3)) return v_8839e3.map(v_93e237);
      const v_8d4337 = {};
      for (const v_0eb677 of Object.keys(v_8839e3)) {
        const v_81e2ef = (v_8839e3 as any)[v_0eb677];
        v_8d4337[v_0eb677] = v_81e2ef === undefined ? null : v_93e237(v_81e2ef);
      }
      return v_8d4337;
    };
    const v_2bb785 = {
      member: v_576f5a.member,
      country: v_576f5a.country,
      region: v_576f5a.region,

      countrycode: v_b36f96?.countrycode != null && !isNaN(v_b36f96.countrycode) ? v_b36f96.countrycode : null,
      mobilecode: v_b36f96?.mobilecode != null && !isNaN(v_b36f96.mobilecode) ? v_b36f96.mobilecode : null,
    };
    const v_931bf0 = v_93e237(v_2bb785);

    const v_3393e3 = await v_9f42a4.post<v_9b135d>(
      '/app7190-02',
      v_931bf0,
    );

    console.log('[마이페이지] 지역 수정 성공');

    return v_3393e3.data;
  } catch (v_5e9bfe) {
    console.error('[마이페이지] 지역 수정 오류:', v_5e9bfe);
    if (v_5e9bfe instanceof v_3333d3) {
      console.error('[마이페이지] 상세 오류 정보:', {
        url: v_5e9bfe.config?.url,
        method: v_5e9bfe.config?.method,
        status: v_5e9bfe.response?.status,
        statusText: v_5e9bfe.response?.statusText,
        data: v_5e9bfe.response?.data,
        message: v_5e9bfe.message,
      });
    }
    throw v_5e9bfe;
  }
};

export const v_d7d5a2 = async (
  v_660822,
  v_c65f5d,
): Promise<v_6ffbdd> => {
  try {
    const v_c9c489 = v_e4a763();
    const v_36dd9e = v_c9c489.GATEWAY_AUTH_CODE;
    const v_c01615 = v_755eb9();
    const v_f71b56 = `${v_c01615}/logout-9705`;

    console.log('[로그아웃] 로그아웃 요청:', { member: v_660822 });

    const v_3393e3 = await v_12a388(
      '/logout-9705',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${v_36dd9e}`,
        },
        body: JSON.stringify({
          member: v_660822,
        } as v_13e1b8),
      },
      v_c65f5d,
    );

    if (!v_3393e3.ok) {
      throw new Error(`HTTP error! status: ${v_3393e3.status}`);
    }

    const data: v_6ffbdd = await v_3393e3.json();
    console.log('[로그아웃] 로그아웃 성공');

    return v_9390e8;
  } catch (v_5e9bfe) {
    console.error('[로그아웃] 로그아웃 오류:', v_5e9bfe);
    if (v_5e9bfe instanceof Error && v_5e9bfe.message === 'API request timeout') {

      throw v_5e9bfe;
    }
    throw v_5e9bfe;
  }
};

export const v_10a69f = async (
  v_660822,
  v_6bee94,
  v_58ca36,
  v_896cf8,
  v_c65f5d,
): Promise<boolean> => {
  try {
    const v_9f42a4 = v_7488d5(v_c65f5d);
    const request: v_62c808 = {
      pin: v_6bee94,
      reason: v_58ca36,
      reasonNum: v_896cf8,
      member: v_660822,
    };

    console.log('[회원 탈퇴] 회원 탈퇴 요청:', { member: v_660822, reasonNum: v_896cf8 });

    const v_3393e3 = await v_9f42a4.post<v_6dba58>(
      '/app8080-01',
      v_576f5a,
    );

    const v_43c42e = v_3393e3.data.data?.[0]?.count === 1;
    console.log('[회원 탈퇴] 회원 탈퇴 결과:', v_43c42e ? '성공' : '실패');

    return v_43c42e;
  } catch (v_5e9bfe) {
    console.error('[회원 탈퇴] 회원 탈퇴 오류:', v_5e9bfe);
    if (v_5e9bfe instanceof v_3333d3) {
      console.error('[회원 탈퇴] 상세 오류 정보:', {
        url: v_5e9bfe.config?.url,
        method: v_5e9bfe.config?.method,
        status: v_5e9bfe.response?.status,
        statusText: v_5e9bfe.response?.statusText,
        data: v_5e9bfe.response?.data,
        message: v_5e9bfe.message,
      });
    }
    throw v_5e9bfe;
  }
};

export const v_b954f5 = async (
  v_660822,
  v_6bee94,
  v_c65f5d,
): Promise<v_9e5c58> => {
  try {
    const v_9f42a4 = v_7488d5(v_c65f5d);
    const request: v_9d18e0 = {
      member: v_660822,
      pin: v_6bee94,
    };

    console.log('[비밀번호 변경] 비밀번호 변경 요청:', { member: v_660822 });

    const v_3393e3 = await v_9f42a4.post<v_9e5c58>(
      '/app7163-01',
      v_576f5a,
    );

    console.log('[비밀번호 변경] 비밀번호 변경 성공');

    return v_3393e3.data;
  } catch (v_5e9bfe) {
    console.error('[비밀번호 변경] 비밀번호 변경 오류:', v_5e9bfe);
    if (v_5e9bfe instanceof v_3333d3) {
      console.error('[비밀번호 변경] 상세 오류 정보:', {
        url: v_5e9bfe.config?.url,
        method: v_5e9bfe.config?.method,
        status: v_5e9bfe.response?.status,
        statusText: v_5e9bfe.response?.statusText,
        data: v_5e9bfe.response?.data,
        message: v_5e9bfe.message,
      });
    }
    throw v_5e9bfe;
  }
};

export const v_ab08d0 = async (
  v_660822,
  v_965edf = 0,
  v_c65f5d,
): Promise<v_7ffbeb> => {
  try {
    const v_9f42a4 = v_7488d5(v_c65f5d);
    const request: v_0a585d = {
      member: v_660822,
      start: v_965edf,
    };

    console.log('[알림] 알림 목록 조회 요청:', { member: v_660822, start: v_965edf });

    const v_3393e3 = await v_9f42a4.post<v_7ffbeb>(
      '/ap6000-01',
      v_576f5a,
    );

    console.log('[알림] 알림 목록 조회 성공, 알림 개수:', v_3393e3.data.data?.length || 0);

    return v_3393e3.data;
  } catch (v_5e9bfe) {
    console.error('[알림] 알림 목록 조회 오류:', v_5e9bfe);
    if (v_5e9bfe instanceof v_3333d3) {
      console.error('[알림] 상세 오류 정보:', {
        url: v_5e9bfe.config?.url,
        method: v_5e9bfe.config?.method,
        status: v_5e9bfe.response?.status,
        statusText: v_5e9bfe.response?.statusText,
        data: v_5e9bfe.response?.data,
        message: v_5e9bfe.message,
      });
    }
    throw v_5e9bfe;
  }
};

export const v_26e528 = async (
  v_660822,
  v_9f1622,
  v_a9d5df = false,
  v_c65f5d,
): Promise<v_495962> => {
  try {
    const v_9f42a4 = v_7488d5(v_c65f5d);
    const request: v_2737f8 = {
      isBroadcast: v_a9d5df,
      member: v_660822,
      title: v_9f1622,
    };

    console.log('[알림] 알림 메시지 전송 요청:', { member: v_660822, title: v_9f1622, isBroadcast: v_a9d5df });

    const v_3393e3 = await v_9f42a4.post<v_495962>(
      '/ap6000-02',
      v_576f5a,
    );

    console.log('[알림] 알림 메시지 전송 성공');

    return v_3393e3.data;
  } catch (v_5e9bfe) {
    console.error('[알림] 알림 메시지 전송 오류:', v_5e9bfe);
    if (v_5e9bfe instanceof v_3333d3) {
      console.error('[알림] 상세 오류 정보:', {
        url: v_5e9bfe.config?.url,
        method: v_5e9bfe.config?.method,
        status: v_5e9bfe.response?.status,
        statusText: v_5e9bfe.response?.statusText,
        data: v_5e9bfe.response?.data,
        message: v_5e9bfe.message,
      });
    }
    throw v_5e9bfe;
  }
};

export const v_1fc3f6 = async (
  v_660822,
  v_10046b,
  v_a9d5df = false,
  v_c65f5d,
): Promise<v_368246> => {
  try {
    const v_9f42a4 = v_7488d5(v_c65f5d);
    const request: v_ba9bd0 = {
      isBroadcast: v_a9d5df,
      member: v_660822,
      board: v_10046b,
    };

    console.log('[알림] 알림 메시지 삭제 요청:', { member: v_660822, board: v_10046b, isBroadcast: v_a9d5df });

    const v_3393e3 = await v_9f42a4.post<v_368246>(
      '/ap6000-03',
      v_576f5a,
    );

    console.log('[알림] 알림 메시지 삭제 성공');

    return v_3393e3.data;
  } catch (v_5e9bfe) {
    console.error('[알림] 알림 메시지 삭제 오류:', v_5e9bfe);
    if (v_5e9bfe instanceof v_3333d3) {
      console.error('[알림] 상세 오류 정보:', {
        url: v_5e9bfe.config?.url,
        method: v_5e9bfe.config?.method,
        status: v_5e9bfe.response?.status,
        statusText: v_5e9bfe.response?.statusText,
        data: v_5e9bfe.response?.data,
        message: v_5e9bfe.message,
      });
    }
    throw v_5e9bfe;
  }
};

export const v_3e4cca = async (
  v_660822,
  v_c65f5d,
): Promise<v_294d11> => {
  try {
    const v_9f42a4 = v_7488d5(v_c65f5d);
    const request: v_7092d8 = {
      member: v_660822,
    };

    console.log('[알림] 전체 알림 삭제 요청:', { member: v_660822 });

    const v_3393e3 = await v_9f42a4.post<v_294d11>(
      '/ap6000-04delete',
      v_576f5a,
    );

    console.log('[알림] 전체 알림 삭제 성공');

    return v_3393e3.data;
  } catch (v_5e9bfe) {
    console.error('[알림] 전체 알림 삭제 오류:', v_5e9bfe);
    if (v_5e9bfe instanceof v_3333d3) {
      console.error('[알림] 상세 오류 정보:', {
        url: v_5e9bfe.config?.url,
        method: v_5e9bfe.config?.method,
        status: v_5e9bfe.response?.status,
        statusText: v_5e9bfe.response?.statusText,
        data: v_5e9bfe.response?.data,
        message: v_5e9bfe.message,
      });
    }
    throw v_5e9bfe;
  }
};

export const v_f3c4d5 = 'pushNotificationsEnabled';

export const v_8b775f = async (): Promise<boolean> => {
  try {
    const v_e84827 = require('bkjbgtcoyuizqwgwtnaxmfkyvlqwevapsqmanbsnv').default;
    const v_81e2ef = await v_e84827.getItem(v_f3c4d5);
    if (v_81e2ef === null || v_81e2ef === undefined) return true; 
    return v_81e2ef === 'true';
  } catch {
    return true;
  }
};

export const v_415b23 = async (
  v_d20c84,
  v_660822,
  v_c65f5d,
): Promise<void> => {
  const v_e84827 = require('bkjbgtcoyuizqwgwtnaxmfkyvlqwevapsqmanbsnv').default;
  await v_e84827.setItem(v_f3c4d5, v_d20c84 ? 'true' : 'false');

  if (v_d20c84) {

    await v_cec605(v_660822, v_c65f5d);
  } else {

    try {
      const v_9f42a4 = v_7488d5(v_c65f5d);
      await v_9f42a4.post('/login-pushkeyreg', {
        pushkey: '',
        member: v_660822,
      });
      console.log('[푸시] 토큰 서버 해제 완료');
    } catch (v_5e9bfe) {
      console.warn('[푸시] 토큰 해제 실패:', v_5e9bfe);
    }
  }
};

export const v_cec605 = async (
  v_660822,
  v_c65f5d,
): Promise<void> => {
  try {

    const v_d20c84 = await v_8b775f();
    if (!v_d20c84) {
      console.log('[푸시] 사용자가 알림을 비활성화함 — 토큰 등록 건너뜀');
      return;
    }

    const v_2b7a17 = require('bpebbcghaffswkrsep');
    const v_a06ea0 = require('wtbgvqvuebu');
    const v_c9be60 = require('qfrscldecidiqs');
    const { Platform: v_326be8 } = require('rcmrninabrnb');

    if (!v_a06ea0.isDevice) {
      console.log('[푸시] 에뮬레이터에서는 푸시 토큰 등록을 건너뜁니다.');
      return;
    }

    const { status: v_3967ed } = await v_2b7a17.getPermissionsAsync();
    let v_54ff15 = v_3967ed;
    if (v_3967ed !== 'granted') {
      const { status: v_d308b5 } = await v_2b7a17.requestPermissionsAsync();
      v_54ff15 = v_d308b5;
    }
    if (v_54ff15 !== 'granted') {
      console.log('[푸시] 알림 권한이 거부되었습니다.');
      return;
    }

    if (v_326be8.OS === 'android') {
      await v_2b7a17.setNotificationChannelAsync('default', {
        name: 'default',
        importance: v_2b7a17.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }

    const v_06e736 = v_c9be60.default?.expoConfig?.extra?.eas?.projectId;
    const v_fb7579 = await v_2b7a17.getExpoPushTokenAsync({
      projectId: v_06e736 || '98780521-4749-4507-8e3a-62a2b3a80783',
    });
    const v_1a29d0 = v_fb7579.data; 

    console.log('[푸시] Expo Push Token:', v_1a29d0.substring(0, 30) + '...');

    const v_9f42a4 = v_7488d5(v_c65f5d);
    await v_9f42a4.post('/login-pushkeyreg', {
      pushkey: v_1a29d0,
      member: v_660822,
    });

    console.log('[푸시] 토큰 서버 등록 성공');
  } catch (v_5e9bfe) {
    console.warn('[푸시] 토큰 등록 오류:', v_5e9bfe);

  }
};

const v_b464ed = (v_34b365, v_a36282, v_ed3911, v_5d858d): number => {
  const v_bef3bf = 6371000; 
  const v_32a354 = (v_ed3911 - v_34b365) * Math.PI / 180;
  const v_84b828 = (v_5d858d - v_a36282) * Math.PI / 180;
  const v_779914 =
    Math.sin(v_32a354 / 2) * Math.sin(v_32a354 / 2) +
    Math.cos(v_34b365 * Math.PI / 180) * Math.cos(v_ed3911 * Math.PI / 180) *
    Math.sin(v_84b828 / 2) * Math.sin(v_84b828 / 2);
  const v_3f4e2e = 2 * Math.atan2(Math.sqrt(v_779914), Math.sqrt(1 - v_779914));
  return v_bef3bf * v_3f4e2e;
};

const v_2dc24c = (v_34b365, v_a36282, v_ed3911, v_5d858d): number => {
  const v_84b828 = (v_5d858d - v_a36282) * Math.PI / 180;
  const v_53e984 = v_34b365 * Math.PI / 180;
  const v_01952a = v_ed3911 * Math.PI / 180;
  const v_64877a = Math.sin(v_84b828) * Math.cos(v_01952a);
  const v_62c214 = Math.cos(v_53e984) * Math.sin(v_01952a) - Math.sin(v_53e984) * Math.cos(v_01952a) * Math.cos(v_84b828);
  const v_6f4cf9 = Math.atan2(v_64877a, v_62c214) * 180 / Math.PI;
  return (v_6f4cf9 + 360) % 360;
};

export const v_c615aa = async (
  v_b5de9c,
  v_985be2,
  v_660822,
  v_c65f5d,
): Promise<any> => {
  try {
    const v_9f42a4 = v_7488d5(v_c65f5d);
    const v_cd6a57 = {
      member: v_660822,
      latitude: v_b5de9c,
      longitude: v_985be2,
      limit: 120,
    };

    console.log('=== fetchMapMarkerDataRaw API 호출 ===');
    console.log('endpoint: app2000-01');
    console.log('requestBody:', JSON.stringify(v_cd6a57));

    const v_3393e3 = await v_9f42a4.post(
      '/app2000-01',
      v_cd6a57,
    );

    const v_9390e8 = v_3393e3.data;
    console.log('=== fetchMapMarkerDataRaw API 응답 ===');
    console.log('data.data length:', v_9390e8?.data?.length);

    return v_9390e8;
  } catch (v_5e9bfe) {
    console.error('맵 마커 원본 데이터 가져오기 오류:', v_5e9bfe);
    if (v_5e9bfe instanceof v_3333d3) {
      console.error('[맵 마커 원본] 상세 오류 정보:', {
        url: v_5e9bfe.config?.url,
        method: v_5e9bfe.config?.method,
        status: v_5e9bfe.response?.status,
        statusText: v_5e9bfe.response?.statusText,
        data: v_5e9bfe.response?.data,
        message: v_5e9bfe.message,
      });
    }
    throw v_5e9bfe;
  }
};

let fetchMapMarkerPromise: Promise<v_f71847[]> | null = null;

export const v_f84ef5 = async (
  v_b5de9c,
  v_985be2,
  v_660822,
  v_c65f5d,
  v_e7f87b, 
): Promise<v_f71847[]> => {
  if (v_69fe4e) {
    console.log('[Deduplication] fetchMapMarkerData is already in progress, returning pending promise');
    return v_69fe4e;
  }

  v_69fe4e = (async () => {
    try {
      const v_9f42a4 = v_7488d5(v_c65f5d);
      const v_cd6a57 = {
        member: v_660822,
        latitude: v_b5de9c,
        longitude: v_985be2,
        limit: 120,
        ...(v_e7f87b || {}),
      };

      const v_3393e3 = await v_9f42a4.post(
        '/app2000-01',
        v_cd6a57,
      );

      const v_9390e8 = v_3393e3.data;

      if (v_9390e8?.data && Array.isArray(v_9390e8.data)) {
        return v_9390e8.data.map((v_8c0b26) => {
          const v_1906d6 = v_8c0b26.lat || v_8c0b26.latitude;
          const v_8cd402 = v_8c0b26.lng || v_8c0b26.longitude;

          let v_926d1c = v_8c0b26.distance || 0;
          if (v_1906d6 && v_8cd402 && (v_926d1c === 0 || !v_8c0b26.distance)) {
            v_926d1c = v_b464ed(v_b5de9c, v_985be2, v_1906d6, v_8cd402);
          }

          let v_1fec52 = v_8c0b26.direction || 0;
          if (v_1906d6 && v_8cd402 && (v_1fec52 === 0 || !v_8c0b26.direction)) {
            v_1fec52 = v_2dc24c(v_b5de9c, v_985be2, v_1906d6, v_8cd402);
          }

          return {
            spotID: v_8c0b26.spotid || v_8c0b26.spotID || v_8c0b26.id || 0,
            distance: v_926d1c,
            direction: v_1fec52,
            name: v_8c0b26.name || v_8c0b26.brand || v_8c0b26.coin || v_8c0b26.title || 'XRUN coin',
            latitude: v_1906d6,
            longitude: v_8cd402,
            xrunPrice: v_8c0b26.xrunprice || v_8c0b26.xrunPrice || v_8c0b26.price || 0,
            iconurl: v_8c0b26.iconurl || v_8c0b26.brandlogo || v_8c0b26.brandlogo_file || v_8c0b26.adthumbnail2 || v_8c0b26.adthumbnail2_file || '',
            joindesc: v_8c0b26.joindesc || v_8c0b26.description || '',
            brand: v_8c0b26.brand || v_8c0b26.coin || '',
            coins: v_8c0b26.coins || v_8c0b26.coin || '',
            coin: v_8c0b26.coin || '',
            campid: v_8c0b26.campid || v_8c0b26.campId || v_8c0b26.campaignid || v_8c0b26.campaignId || '',
            advertisement: v_8c0b26.advertisement || v_8c0b26.adid || v_8c0b26.ad || v_8c0b26.coin || '',
          } as v_f71847 & { campid?: string; advertisement?: string | number };
        });
      }

      console.log('API 응답에 data.data가 없거나 배열이 아님');
      return [];
    } catch (v_5e9bfe) {
      console.error('맵 마커 데이터 가져오기 오류:', v_5e9bfe);
      if (v_5e9bfe instanceof v_3333d3) {
        console.error('[맵 마커] 상세 오류 정보:', {
          url: v_5e9bfe.config?.url,
          method: v_5e9bfe.config?.method,
          status: v_5e9bfe.response?.status,
          statusText: v_5e9bfe.response?.statusText,
          data: v_5e9bfe.response?.data,
          message: v_5e9bfe.message,
        });
      }
      return [];
    } finally {
      v_69fe4e = null;
    }
  })();

  return v_69fe4e as Promise<v_f71847[]>;
};

let v_be1ee0 = null;

export const v_91d5e4 = async (
  v_660822,
  v_b5de9c,
  v_985be2,
  v_c65f5d,
): Promise<any> => {
  if (v_be1ee0) {
    console.log('[Deduplication] fetchVirtualCoin is already in progress, returning pending promise');
    return v_be1ee0 as Promise<any>;
  }

  v_be1ee0 = (async () => {
    const v_4fc7c7 = new AbortController();
    const v_3894d5 = setTimeout(() => v_4fc7c7.abort(), v_8a74cb);

    try {
      const v_c9c489 = v_e4a763();
      const v_f71b56 = `${v_755eb9()}/virtualCoin`;

      const v_cd6a57 = {
        member: v_660822,
        latitude: v_b5de9c,
        longitude: v_985be2,
      };

      console.log('=== virtualCoin API 호출 ===');
      console.log('requestBody:', JSON.stringify(v_cd6a57));

      const v_3393e3 = await fetch(v_f71b56, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${v_c9c489.GATEWAY_AUTH_CODE}`,
        },
        body: JSON.stringify(v_cd6a57),
        signal: v_4fc7c7.signal,
      });

      clearTimeout(v_3894d5);

      if (!v_3393e3.ok) {

        if (v_3393e3.status === 504) {
          console.warn('virtualCoin API 504 에러 (게이트웨이 타임아웃) - 빈 데이터 반환');
          return { data: [] };
        }
        throw new Error(`HTTP error! status: ${v_3393e3.status}`);
      }

      const v_43c42e = await v_3393e3.json();
      console.log('=== virtualCoin API 응답 ===');
      console.log('response.data length:', v_43c42e?.data?.length);

      return v_43c42e;
    } catch (v_5e9bfe) {
      clearTimeout(v_3894d5);

      if (v_5e9bfe?.name === 'AbortError' || v_5e9bfe?.message?.includes('504') || v_5e9bfe?.message?.includes('timeout')) {
        console.warn('virtualCoin API 타임아웃 또는 504 에러 - 빈 데이터 반환');
        return { data: [] };
      }

      console.error('virtualCoin API 호출 실패:', v_5e9bfe);

      if (v_c65f5d && v_5e9bfe?.name === 'AbortError') {
        try {
          await v_e4d665(v_c65f5d);
        } catch (v_413e32) {
          console.warn('타임아웃 처리 스킵:', v_413e32);
        }
      }

      return { data: [] };
    } finally {
      v_be1ee0 = null;
    }
  })();

  return v_be1ee0;
};

let v_a71a9b = null;

export const v_965f93 = async (
  v_c65f5d,
): Promise<any> => {
  if (v_a71a9b) {
    console.log('[Deduplication] getCoinNasPrice is already in progress, returning pending promise');
    return v_a71a9b as Promise<any>;
  }

  v_a71a9b = (async () => {
    const v_4fc7c7 = new AbortController();
    const v_3894d5 = setTimeout(() => v_4fc7c7.abort(), v_8a74cb);

    try {
      const v_c9c489 = v_e4a763();
      const v_f71b56 = `${v_755eb9()}/getCoinNasPrice`;

      console.log('=== getCoinNasPrice API 호출 ===');

      const v_3393e3 = await fetch(v_f71b56, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${v_c9c489.GATEWAY_AUTH_CODE}`,
        },
        body: JSON.stringify({}),
        signal: v_4fc7c7.signal,
      });

      clearTimeout(v_3894d5);

      if (!v_3393e3.ok) {

        if (v_3393e3.status === 504) {
          console.warn('getCoinNasPrice API 504 에러 (게이트웨이 타임아웃) - 기본값 반환');
          return { data: { coins: 0 } };
        }
        throw new Error(`HTTP error! status: ${v_3393e3.status}`);
      }

      const v_43c42e = await v_3393e3.json();
      console.log('=== getCoinNasPrice API 응답 ===');
      console.log('calculatedNasPrice:', v_43c42e?.data?.coins);

      return v_43c42e;
    } catch (v_5e9bfe) {
      clearTimeout(v_3894d5);

      if (v_5e9bfe?.name === 'AbortError' || v_5e9bfe?.message?.includes('504') || v_5e9bfe?.message?.includes('timeout')) {
        console.warn('getCoinNasPrice API 타임아웃 또는 504 에러 - 기본값 반환');
        return { data: { coins: 0 } };
      }

      console.error('getCoinNasPrice API 호출 실패:', v_5e9bfe);

      if (v_c65f5d && v_5e9bfe?.name === 'AbortError') {
        try {
          await v_e4d665(v_c65f5d);
        } catch (v_413e32) {
          console.warn('타임아웃 처리 스킵:', v_413e32);
        }
      }

      return { data: { coins: 0 } };
    } finally {
      v_a71a9b = null;
    }
  })();

  return v_a71a9b as Promise<any>;
};

export const v_4b1d5e = async (
  v_660822,
  v_e0c7e8,
  v_c65f5d,
): Promise<v_46181d> => {
  try {
    const v_9f42a4 = v_7488d5(v_c65f5d);
    const request: v_ba49e9 = {
      member: v_660822,
      email: v_e0c7e8,
    };

    console.log('[추천] 추천인 등록 요청 (이메일):', { member: v_660822, email: v_e0c7e8 });

    const v_3393e3 = await v_9f42a4.post<v_46181d>(
      '/app7410-01',
      v_576f5a,
    );

    const v_43c42e = v_3393e3.data.data?.[0]?.data || '';
    console.log('[추천] 추천인 등록 결과:', v_43c42e);

    return v_3393e3.data;
  } catch (v_5e9bfe) {
    console.error('[추천] 추천인 등록 오류:', v_5e9bfe);
    if (v_5e9bfe instanceof v_3333d3) {
      console.error('[추천] 상세 오류 정보:', {
        url: v_5e9bfe.config?.url,
        method: v_5e9bfe.config?.method,
        status: v_5e9bfe.response?.status,
        statusText: v_5e9bfe.response?.statusText,
        data: v_5e9bfe.response?.data,
        message: v_5e9bfe.message,
      });
    }
    throw v_5e9bfe;
  }
};

export const v_176911 = async (
  v_c65f5d,
): Promise<v_38bdda> => {
  try {
    const v_9f42a4 = v_7488d5(v_c65f5d);

    console.log('[추천] 랜덤 추천인 목록 조회 요청');

    const v_3393e3 = await v_9f42a4.get<v_38bdda>(
      '/app7420-01',
    );

    console.log('[추천] 랜덤 추천인 목록 조회 성공, 개수:', v_3393e3.data.data?.length || 0);

    return v_3393e3.data;
  } catch (v_5e9bfe) {
    console.error('[추천] 랜덤 추천인 목록 조회 오류:', v_5e9bfe);
    if (v_5e9bfe instanceof v_3333d3) {
      console.error('[추천] 상세 오류 정보:', {
        url: v_5e9bfe.config?.url,
        method: v_5e9bfe.config?.method,
        status: v_5e9bfe.response?.status,
        statusText: v_5e9bfe.response?.statusText,
        data: v_5e9bfe.response?.data,
        message: v_5e9bfe.message,
      });
    }
    throw v_5e9bfe;
  }
};

export const v_2ce9ab = async (
  v_660822,
  v_830694,
  v_c65f5d,
): Promise<v_b675ff> => {
  try {
    const v_9f42a4 = v_7488d5(v_c65f5d);
    const request: v_184dd0 = {
      member: v_660822,
      posed: v_830694,
    };

    console.log('[추천] 랜덤 추천인 등록 요청:', { member: v_660822, posed: v_830694 });

    const v_3393e3 = await v_9f42a4.post<v_b675ff>(
      '/app7420-02',
      v_576f5a,
    );

    const v_43c42e = v_3393e3.data.data?.[0]?.data || '';
    console.log('[추천] 랜덤 추천인 등록 결과:', v_43c42e);

    return v_3393e3.data;
  } catch (v_5e9bfe) {
    console.error('[추천] 랜덤 추천인 등록 오류:', v_5e9bfe);
    if (v_5e9bfe instanceof v_3333d3) {
      console.error('[추천] 상세 오류 정보:', {
        url: v_5e9bfe.config?.url,
        method: v_5e9bfe.config?.method,
        status: v_5e9bfe.response?.status,
        statusText: v_5e9bfe.response?.statusText,
        data: v_5e9bfe.response?.data,
        message: v_5e9bfe.message,
      });
    }
    throw v_5e9bfe;
  }
};

export const v_e58c11 = async (
  v_660822,
  v_a149d6,
  v_c65f5d,
): Promise<v_acff7d> => {
  try {
    const v_9f42a4 = v_7488d5(v_c65f5d);
    const request: v_50b98d = {
      member: v_660822,
      recommand: v_a149d6,
    };

    console.log('[추천] 추천인 저장 요청:', { member: v_660822, recommand: v_a149d6 });

    const v_3393e3 = await v_9f42a4.post<v_acff7d>(
      '/saveRecommend',
      v_576f5a,
    );

    console.log('[추천] 추천인 저장 성공');

    return v_3393e3.data;
  } catch (v_5e9bfe) {
    console.error('[추천] 추천인 저장 오류:', v_5e9bfe);
    if (v_5e9bfe instanceof v_3333d3) {
      console.error('[추천] 상세 오류 정보:', {
        url: v_5e9bfe.config?.url,
        method: v_5e9bfe.config?.method,
        status: v_5e9bfe.response?.status,
        statusText: v_5e9bfe.response?.statusText,
        data: v_5e9bfe.response?.data,
        message: v_5e9bfe.message,
      });
    }
    throw v_5e9bfe;
  }
};

export const v_90af10 = async (
  v_660822,
  v_c65f5d,
): Promise<v_cdd3ce> => {
  try {
    const v_9f42a4 = v_7488d5(v_c65f5d);
    const request: v_baf73b = {
      member: v_660822,
    };

    console.log('[추천] 추천인 조회 요청:', { member: v_660822 });

    const v_3393e3 = await v_9f42a4.post<v_cdd3ce>(
      '/app7420-03',
      v_576f5a,
    );

    const v_43c42e = v_3393e3.data.data?.[0];
    console.log('[추천] 추천인 조회 결과:', {
      email: v_43c42e?.email,
      status: v_43c42e?.data,
    });

    return v_3393e3.data;
  } catch (v_5e9bfe) {
    console.error('[추천] 추천인 조회 오류:', v_5e9bfe);
    if (v_5e9bfe instanceof v_3333d3) {
      console.error('[추천] 상세 오류 정보:', {
        url: v_5e9bfe.config?.url,
        method: v_5e9bfe.config?.method,
        status: v_5e9bfe.response?.status,
        statusText: v_5e9bfe.response?.statusText,
        data: v_5e9bfe.response?.data,
        message: v_5e9bfe.message,
      });
    }
    throw v_5e9bfe;
  }
};

export const v_baf3b8 = async (
  v_660822,
  v_c65f5d,
): Promise<v_b62495> => {
  try {
    const v_9f42a4 = v_7488d5(v_c65f5d);
    const request: v_60e215 = {
      member: v_660822,
    };

    console.log('[추천] 내가 추천한 사람 목록 조회 요청:', { member: v_660822 });

    const v_3393e3 = await v_9f42a4.post<v_b62495>(
      '/getRecommendedToMe',
      v_576f5a,
    );

    console.log('[추천] 내가 추천한 사람 목록 조회 성공, 개수:', v_3393e3.data.data?.length || 0);

    return v_3393e3.data;
  } catch (v_5e9bfe) {
    console.error('[추천] 내가 추천한 사람 목록 조회 오류:', v_5e9bfe);
    if (v_5e9bfe instanceof v_3333d3) {
      console.error('[추천] 상세 오류 정보:', {
        url: v_5e9bfe.config?.url,
        method: v_5e9bfe.config?.method,
        status: v_5e9bfe.response?.status,
        statusText: v_5e9bfe.response?.statusText,
        data: v_5e9bfe.response?.data,
        message: v_5e9bfe.message,
      });
    }
    throw v_5e9bfe;
  }
};

export const v_bc3c7b = async (
  v_e0c7e8,
  v_c65f5d,
): Promise<v_42f0a8> => {
  try {
    const v_9f42a4 = v_7488d5(v_c65f5d);
    const request: v_87b54d = {
      email: v_e0c7e8,
    };

    console.log('[추천] 이메일로 회원 조회 요청:', { email: v_e0c7e8 });

    const v_3393e3 = await v_9f42a4.post<v_42f0a8>(
      '/ap1810-i01',
      v_576f5a,
    );

    const v_43c42e = v_3393e3.data.data?.[0];
    console.log('[추천] 이메일로 회원 조회 결과:', {
      exists: v_43c42e?.result,
      member: v_43c42e?.member,
    });

    return v_3393e3.data;
  } catch (v_5e9bfe) {
    console.error('[추천] 이메일로 회원 조회 오류:', v_5e9bfe);
    if (v_5e9bfe instanceof v_3333d3) {
      console.error('[추천] 상세 오류 정보:', {
        url: v_5e9bfe.config?.url,
        method: v_5e9bfe.config?.method,
        status: v_5e9bfe.response?.status,
        statusText: v_5e9bfe.response?.statusText,
        data: v_5e9bfe.response?.data,
        message: v_5e9bfe.message,
      });
    }
    throw v_5e9bfe;
  }
};

export const v_e10c7c = async (
  v_660822,
  v_c65f5d,
): Promise<v_3821b8> => {
  try {
    const v_9f42a4 = v_7488d5(v_c65f5d);
    const request: v_079660 = {
      member: v_660822,
    };

    console.log('[추천] 사용자 정보 조회 요청 (app7110-01):', { member: v_660822 });

    const v_3393e3 = await v_9f42a4.post<v_3821b8>(
      '/app7110-01',
      v_576f5a,
    );

    console.log('[추천] 사용자 정보 조회 성공');

    return v_3393e3.data;
  } catch (v_5e9bfe) {
    console.error('[추천] 사용자 정보 조회 오류:', v_5e9bfe);
    if (v_5e9bfe instanceof v_3333d3) {
      console.error('[추천] 상세 오류 정보:', {
        url: v_5e9bfe.config?.url,
        method: v_5e9bfe.config?.method,
        status: v_5e9bfe.response?.status,
        statusText: v_5e9bfe.response?.statusText,
        data: v_5e9bfe.response?.data,
        message: v_5e9bfe.message,
      });
    }
    throw v_5e9bfe;
  }
};

export const v_1c4683 = async (
  v_660822,
  v_a4f17b,
  deviceInfo: v_719e34,
  v_aa0917 = '',
  v_c65f5d,
): Promise<v_649123> => {
  try {
    const v_c9c489 = v_e4a763();
    const v_f71b56 = `${v_755eb9()}/getNasmobAds`;

    const v_df691e = v_326be8.OS === 'ios' ||
      v_e7f87b.manufacturer === 'Apple' ||
      (v_e7f87b.model && v_e7f87b.model.toLowerCase().includes('iphone')) ||
      (v_e7f87b.model && v_e7f87b.model.toLowerCase().includes('ipad'));

    if (v_df691e) {
      v_e7f87b.os = 'ios';
    } else {
      v_e7f87b.os = 'aos';
    }

    const v_cd6a57 = {
      member: v_660822,
      adid: v_a4f17b || '',
      os: v_e7f87b.os,
      osver: v_e7f87b.osVersion || '',
      ip: v_e7f87b.ipAddress || '',
      devid: v_e7f87b.deviceId || '',
      devmodel: v_e7f87b.model || '',
      devbrand: v_e7f87b.manufacturer || '',
      mnetwork: v_e7f87b.mnetwork || '4',
      carrier: v_e7f87b.carrierCode || '1',
      campid: v_aa0917 || '',
    };

    console.log('NStation 광고 API 요청:', v_cd6a57);

    const v_3393e3 = await fetch(v_f71b56, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${v_c9c489.GATEWAY_AUTH_CODE}`,
      },
      body: JSON.stringify(v_cd6a57),
    });

    if (!v_3393e3.ok) {

      const v_74dc8b = await v_3393e3.text();
      console.error(`[NStation] HTTP 에러 (${v_3393e3.status}):`, v_74dc8b.substring(0, 500));

      if (v_3393e3.status === 403) {
        try {
          const v_e15e6f = JSON.parse(v_74dc8b);
          if (v_e15e6f.status === 'error' && v_e15e6f.code === 403) {
            console.warn(`[NStation] 블록리스트된 캠페인: ${v_aa0917} - ${v_e15e6f.message || 'Campaign is blocked'}`);

            if (v_aa0917) {
              await v_18b723(v_aa0917);
            }

            const v_5e9bfe = new Error(v_e15e6f.message || 'Campaign is blocked');
            (v_5e9bfe as any).is403 = true;
            (v_5e9bfe as any).campid = v_aa0917;
            throw v_5e9bfe;
          }
        } catch (v_5f9add) {

          console.warn(`[NStation] 403 에러 (JSON 파싱 실패): ${v_74dc8b.substring(0, 200)}`);
          const v_5e9bfe = new Error(`Campaign is blocked (403)`);
          (v_5e9bfe as any).is403 = true;
          (v_5e9bfe as any).campid = v_aa0917;
          throw v_5e9bfe;
        }
      }

      if (v_3393e3.status >= 500) {
        throw new Error(`서버 에러 (${v_3393e3.status}): ${v_74dc8b.substring(0, 200)}`);
      }

      try {
        const v_e15e6f = JSON.parse(v_74dc8b);
        const v_1744b9 = v_e15e6f.message || `HTTP error! status: ${v_3393e3.status}`;
        const v_5e9bfe = new Error(v_1744b9);
        (v_5e9bfe as any).is404 = v_e15e6f.code === 404 || v_3393e3.status === 404;
        throw v_5e9bfe;
      } catch (v_5f9add) {

        throw new Error(`HTTP error! status: ${v_3393e3.status}, body: ${v_74dc8b.substring(0, 200)}`);
      }
    }

    const v_c0c2d5 = v_3393e3.headers.get('content-type');
    if (!v_c0c2d5 || !v_c0c2d5.includes('application/json')) {
      const v_9b6134 = await v_3393e3.text();
      console.error('[NStation] 비-JSON 응답:', v_c0c2d5, v_9b6134.substring(0, 500));
      throw new Error(`Expected JSON but got ${v_c0c2d5 || 'unknown'}`);
    }

    const result: v_649123 = await v_3393e3.json();
    console.log('NStation 광고 API 응답:', v_43c42e);

    if (v_43c42e.status === 'error' && v_43c42e.code === 403) {
      console.warn(`[NStation] 블록리스트된 캠페인: ${v_aa0917} - ${v_43c42e.message || 'Campaign is blocked'}`);

      if (v_aa0917) {
        await v_18b723(v_aa0917);
      }
      const v_5e9bfe = new Error(v_43c42e.message || 'Campaign is blocked');
      (v_5e9bfe as any).is403 = true;
      (v_5e9bfe as any).campid = v_aa0917;
      throw v_5e9bfe;
    }

    if (v_43c42e.status === 'success' && v_43c42e.code === 200) {
      return v_43c42e;
    } else {

      const v_1744b9 = v_43c42e.message || 'NStation 광고 API 호출 실패';
      const v_5e9bfe = new Error(v_1744b9);

      (v_5e9bfe as any).is404 = v_43c42e.code === 404;
      throw v_5e9bfe;
    }
  } catch (v_5e9bfe) {
    console.error('NStation 광고 API 호출 실패:', v_5e9bfe);

    if (v_5e9bfe.is403) {
      console.log('403 에러: 블록리스트된 캠페인 - 타임아웃 처리 스킵');
      throw v_5e9bfe;
    }

    if (v_5e9bfe.is404) {
      console.log('404 에러: 캠페인 데이터 없음 - 타임아웃 처리 스킵');
      throw v_5e9bfe;
    }

    if (v_c65f5d && typeof v_c65f5d.reset === 'function') {
      try {
        await v_e4d665(v_c65f5d);
      } catch (v_2d075f) {
        console.error('타임아웃 처리 중 오류:', v_2d075f);

      }
    }
    throw v_5e9bfe;
  }
};

export const v_aa7dc1 = async (
  v_660822,
  v_a4f17b,
  deviceInfo: v_719e34,
  v_aa0917 = '',
  v_c65f5d,
): Promise<v_6b63f9> => {
  try {
    const v_c9c489 = v_e4a763();
    const v_f71b56 = `${v_755eb9()}/getPockAds`;

    let v_eed089;
    let v_66fa3f;

    const v_df691e = v_326be8.OS === 'ios' ||
      v_e7f87b.manufacturer === 'Apple' ||
      (v_e7f87b.model && v_e7f87b.model.toLowerCase().includes('iphone')) ||
      (v_e7f87b.model && v_e7f87b.model.toLowerCase().includes('ipad'));

    if (v_df691e) {
      v_eed089 = 3113; 
      v_66fa3f = 'IOS'; 
    } else {
      v_eed089 = 3112; 
      v_66fa3f = 'ANDROID'; 
    }
    console.log('osTypeString', v_66fa3f);
    console.log('osType', v_eed089);

    const v_cd6a57 = {
      member: v_660822,
      ad_key: v_aa0917 || '', 
      os: v_66fa3f, 
      device_ifa: v_a4f17b || '', 
      ip: v_e7f87b.ipAddress || '',
    };

    console.log('Pock 광고 API 요청:', v_cd6a57);

    const v_3393e3 = await fetch(v_f71b56, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${v_c9c489.GATEWAY_AUTH_CODE}`,
      },
      body: JSON.stringify(v_cd6a57),
    });

    if (!v_3393e3.ok) {

      const v_74dc8b = await v_3393e3.text();
      console.error(`[Pock] HTTP 에러 (${v_3393e3.status}):`, v_74dc8b.substring(0, 500));

      if (v_3393e3.status === 403) {
        try {
          const v_e15e6f = JSON.parse(v_74dc8b);
          if (v_e15e6f.status === 'error' && v_e15e6f.code === 403) {
            console.warn(`[Pock] 블록리스트된 캠페인: ${v_aa0917} - ${v_e15e6f.message || 'Campaign is blocked'}`);

            if (v_aa0917) {
              await v_18b723(v_aa0917);
            }

            const v_5e9bfe = new Error(v_e15e6f.message || 'Campaign is blocked');
            (v_5e9bfe as any).is403 = true;
            (v_5e9bfe as any).campid = v_aa0917;
            throw v_5e9bfe;
          }
        } catch (v_5f9add) {

          console.warn(`[Pock] 403 에러 (JSON 파싱 실패): ${v_74dc8b.substring(0, 200)}`);
          const v_5e9bfe = new Error(`Campaign is blocked (403)`);
          (v_5e9bfe as any).is403 = true;
          (v_5e9bfe as any).campid = v_aa0917;
          throw v_5e9bfe;
        }
      }

      if (v_3393e3.status >= 500) {
        throw new Error(`서버 에러 (${v_3393e3.status}): ${v_74dc8b.substring(0, 200)}`);
      }

      try {
        const v_e15e6f = JSON.parse(v_74dc8b);
        const v_1744b9 = v_e15e6f.message || `HTTP error! status: ${v_3393e3.status}`;
        const v_5e9bfe = new Error(v_1744b9);
        (v_5e9bfe as any).is404 = v_e15e6f.code === 404 || v_3393e3.status === 404;
        throw v_5e9bfe;
      } catch (v_5f9add) {

        throw new Error(`HTTP error! status: ${v_3393e3.status}, body: ${v_74dc8b.substring(0, 200)}`);
      }
    }

    const v_c0c2d5 = v_3393e3.headers.get('content-type');
    if (!v_c0c2d5 || !v_c0c2d5.includes('application/json')) {
      const v_9b6134 = await v_3393e3.text();
      console.error('[Pock] 비-JSON 응답:', v_c0c2d5, v_9b6134.substring(0, 500));
      throw new Error(`Expected JSON but got ${v_c0c2d5 || 'unknown'}`);
    }

    const result: v_6b63f9 = await v_3393e3.json();
    console.log('Pock 광고 API 응답:', v_43c42e);

    if (v_43c42e.status === 'error' && v_43c42e.code === 403) {
      console.warn(`[Pock] 블록리스트된 캠페인: ${v_aa0917} - ${v_43c42e.message || 'Campaign is blocked'}`);

      if (v_aa0917) {
        await v_18b723(v_aa0917);
      }
      const v_5e9bfe = new Error(v_43c42e.message || 'Campaign is blocked');
      (v_5e9bfe as any).is403 = true;
      (v_5e9bfe as any).campid = v_aa0917;
      throw v_5e9bfe;
    }

    if (v_43c42e.status === 'success' && v_43c42e.code === 200) {
      return v_43c42e;
    } else {

      const v_1744b9 = v_43c42e.message || 'Pock 광고 API 호출 실패';
      const v_5e9bfe = new Error(v_1744b9);

      (v_5e9bfe as any).is404 = v_43c42e.code === 404;
      throw v_5e9bfe;
    }
  } catch (v_5e9bfe) {
    console.error('Pock 광고 API 호출 실패:', v_5e9bfe);

    if (v_5e9bfe.is404) {
      console.log('404 에러: 캠페인 데이터 없음 - 타임아웃 처리 스킵');
      throw v_5e9bfe;
    }

    if (v_c65f5d && typeof v_c65f5d.reset === 'function') {
      try {
        await v_e4d665(v_c65f5d);
      } catch (v_2d075f) {
        console.error('타임아웃 처리 중 오류:', v_2d075f);

      }
    }
    throw v_5e9bfe;
  }
};

export const v_167376 = async (
  v_660822,
  v_a4f17b,
  deviceInfo: v_719e34,
  v_b0495a = '',
  v_c65f5d,
): Promise<v_6b63f9> => {
  try {
    const v_c9c489 = v_e4a763();
    const v_f71b56 = `${v_755eb9()}/getPointClickAds`;

    let v_66fa3f;

    const v_df691e = v_326be8.OS === 'ios' ||
      v_e7f87b.manufacturer === 'Apple' ||
      (v_e7f87b.model && v_e7f87b.model.toLowerCase().includes('iphone')) ||
      (v_e7f87b.model && v_e7f87b.model.toLowerCase().includes('ipad'));

    if (v_df691e) {
      v_66fa3f = 'IOS';
    } else {
      v_66fa3f = 'ANDROID';
    }

    const v_cd6a57 = {
      member: v_660822,
      ad_key: v_b0495a || '',
      os: v_66fa3f,
      device_ifa: v_a4f17b || '',
      ip: v_e7f87b.ipAddress || '',
    };

    console.log('PointClick 광고 API 요청:', v_cd6a57);

    const v_3393e3 = await fetch(v_f71b56, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${v_c9c489.GATEWAY_AUTH_CODE}`,
      },
      body: JSON.stringify(v_cd6a57),
    });

    if (!v_3393e3.ok) {

      const v_74dc8b = await v_3393e3.text();
      console.error(`[PointClick] HTTP 에러 (${v_3393e3.status}):`, v_74dc8b.substring(0, 500));

      if (v_3393e3.status === 403) {
        try {
          const v_e15e6f = JSON.parse(v_74dc8b);
          if (v_e15e6f.status === 'error' && v_e15e6f.code === 403) {
            console.warn(`[PointClick] 블록리스트된 캠페인: ${v_b0495a} - ${v_e15e6f.message || 'Campaign is blocked'}`);

            if (v_b0495a) {
              await v_18b723(v_b0495a);
            }

            const v_5e9bfe = new Error(v_e15e6f.message || 'Campaign is blocked');
            (v_5e9bfe as any).is403 = true;
            (v_5e9bfe as any).campid = v_b0495a;
            throw v_5e9bfe;
          }
        } catch (v_5f9add) {

          console.warn(`[PointClick] 403 에러 (JSON 파싱 실패): ${v_74dc8b.substring(0, 200)}`);
          const v_5e9bfe = new Error(`Campaign is blocked (403)`);
          (v_5e9bfe as any).is403 = true;
          (v_5e9bfe as any).campid = v_b0495a;
          throw v_5e9bfe;
        }
      }

      if (v_3393e3.status >= 500) {
        throw new Error(`서버 에러 (${v_3393e3.status}): ${v_74dc8b.substring(0, 200)}`);
      }

      try {
        const v_e15e6f = JSON.parse(v_74dc8b);
        const v_1744b9 = v_e15e6f.message || `HTTP error! status: ${v_3393e3.status}`;
        const v_5e9bfe = new Error(v_1744b9);
        (v_5e9bfe as any).is404 = v_e15e6f.code === 404 || v_3393e3.status === 404;
        throw v_5e9bfe;
      } catch (v_5f9add) {

        throw new Error(`HTTP error! status: ${v_3393e3.status}, body: ${v_74dc8b.substring(0, 200)}`);
      }
    }

    const v_c0c2d5 = v_3393e3.headers.get('content-type');
    if (!v_c0c2d5 || !v_c0c2d5.includes('application/json')) {
      const v_9b6134 = await v_3393e3.text();
      console.error('[PointClick] 비-JSON 응답:', v_c0c2d5, v_9b6134.substring(0, 500));
      throw new Error(`Expected JSON but got ${v_c0c2d5 || 'unknown'}`);
    }

    const result: v_6b63f9 = await v_3393e3.json();
    console.log('PointClick 광고 API 응답:', v_43c42e);

    if (v_43c42e.status === 'error' && v_43c42e.code === 403) {
      console.warn(`[PointClick] 블록리스트된 캠페인: ${v_b0495a} - ${v_43c42e.message || 'Campaign is blocked'}`);

      if (v_b0495a) {
        await v_18b723(v_b0495a);
      }
      const v_5e9bfe = new Error(v_43c42e.message || 'Campaign is blocked');
      (v_5e9bfe as any).is403 = true;
      (v_5e9bfe as any).campid = v_b0495a;
      throw v_5e9bfe;
    }

    if (v_3393e3.ok && v_43c42e.status === 'success' && v_43c42e.code === 200) {
      return v_43c42e;
    } else {

      const v_1744b9 = v_43c42e.message || 'PointClick 광고 API 호출 실패';
      const v_5e9bfe = new Error(v_1744b9);

      (v_5e9bfe as any).is404 = v_43c42e.code === 404;
      throw v_5e9bfe;
    }
  } catch (v_5e9bfe) {
    console.error('PointClick 광고 API 호출 실패:', v_5e9bfe);

    if (v_5e9bfe.is403) {
      console.log('403 에러: 블록리스트된 캠페인 - 타임아웃 처리 스킵');
      throw v_5e9bfe;
    }

    if (v_5e9bfe.is404) {
      console.log('404 에러: 캠페인 데이터 없음 - 타임아웃 처리 스킵');
      throw v_5e9bfe;
    }

    if (v_c65f5d && typeof v_c65f5d.reset === 'function') {
      try {
        await v_e4d665(v_c65f5d);
      } catch (v_2d075f) {
        console.error('타임아웃 처리 중 오류:', v_2d075f);

      }
    }
    throw v_5e9bfe;
  }
};

export const v_7a6f92 = async (
  callbackData: v_cf0182,
  v_c65f5d,
): Promise<any> => {
  try {
    const v_c9c489 = v_e4a763();

    const v_f71b56 = `${v_db0872()}/callbackNasmob`;

    console.log('NStation 콜백 전송:', v_d8bcf0);

    const v_3393e3 = await fetch(v_f71b56, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${v_c9c489.GATEWAY_AUTH_CODE}`,
      },
      body: JSON.stringify(v_d8bcf0),
    });

    const v_43c42e = await v_3393e3.json();
    console.log('NStation 콜백 응답:', v_43c42e);
    return v_43c42e;
  } catch (v_5e9bfe) {
    console.error('NStation 콜백 전송 실패:', v_5e9bfe);
    if (v_c65f5d) {
      await v_e4d665(v_c65f5d);
    }
    throw v_5e9bfe;
  }
};

export const v_c07360 = async (
  v_09dafd,
  v_bfe9b9 = 'POST',
  v_cd6a57 = {},
  v_c65f5d,
): Promise<any> => {
  try {
    const v_c9c489 = v_e4a763();

    const v_288349 = [
      /^callbackNasmob$/,
      /^callbackPointClick$/,
      /^callbackAyet$/,
      /^callbackMaf$/,
      /^callbackMyChips$/,
      /^getTopAd5$/,
      /^Ayet\//,
      /^Maf\//,
    ];
    const v_966ad8 = v_288349.some(v_d95200 => v_d95200.test(v_09dafd));
    const v_c01615 = v_966ad8 ? v_db0872() : v_755eb9();
    const v_f71b56 = `${v_c01615}/${v_09dafd}`;

    console.log(`🌐 [gatewayNodeJS] API 호출 시작`);
    if (v_09dafd === 'getTopAd5') {
      console.log(`🌐 [gatewayNodeJS] endpoint: ${v_09dafd}`);
      console.log(`🌐 [gatewayNodeJS] method: ${v_bfe9b9}`);
      console.log(`🌐 [gatewayNodeJS] url: ${v_f71b56}`);
      console.log(`🌐 [gatewayNodeJS] requestBody:`, JSON.stringify(v_cd6a57, null, 2));
    }

    const v_a611c4 = {
      method: v_bfe9b9,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${v_c9c489.GATEWAY_AUTH_CODE}`,
      },
    };

    if (v_bfe9b9.toUpperCase() !== 'GET') {
      v_a611c4.body = JSON.stringify(v_cd6a57);
    }

    const v_3393e3 = await fetch(v_f71b56, v_a611c4);

    if (!v_3393e3.ok) {
      throw new Error(`HTTP error! status: ${v_3393e3.status}`);
    }

    const v_43c42e = await v_3393e3.json();
    if (v_09dafd === 'getTopAd5') {
      console.log(`✅ [gatewayNodeJS] API 응답 성공`);
      console.log(`✅ [gatewayNodeJS] endpoint: ${v_09dafd}`);
      console.log(`✅ [gatewayNodeJS] result.data length:`, v_43c42e?.data?.length || 'N/A');
      console.log(`✅ [gatewayNodeJS] 전체 응답 구조:`, {
        status: v_43c42e?.status,
        code: v_43c42e?.code,
        message: v_43c42e?.message,
        success: v_43c42e?.success,
        dataLength: v_43c42e?.data?.length,
        hasData: !!v_43c42e?.data,
        hasAds: !!v_43c42e?.ads,
        adsLength: Array.isArray(v_43c42e?.ads) ? v_43c42e.ads.length : 'N/A',
        hasDiag: !!v_43c42e?._diag,
        isArray: Array.isArray(v_43c42e),
      });

      if (v_09dafd === 'getTopAd5' && v_43c42e?.status === 'error') {
        console.error(`❌ [getTopAd5] 백엔드 에러 응답: code=${v_43c42e?.code} message="${v_43c42e?.message}"`);
      }

      if (v_09dafd === 'getTopAd5' && v_43c42e?._diag) {
        console.log(`📋 [getTopAd5 진단] 후보=${v_43c42e._diag.total_candidates} 실제 fetch=${v_43c42e._diag.fetched} 살아있음=${v_43c42e._diag.live} 죽음/skip=${v_43c42e._diag.dead_or_skip}`);
        if (Array.isArray(v_43c42e._diag.details)) {
          for (const v_d5dda0 of v_43c42e._diag.details) {
            const v_9ddfab = v_d5dda0.has_landing ? '✅' : '❌';
            console.log(`  ${v_9ddfab} ${v_d5dda0.ad_company} ${v_d5dda0.campid} "${v_d5dda0.name}" → ${v_d5dda0.reason ?? `code=${v_d5dda0.result_code}`}`);
          }
        }
      }
    }

    return v_43c42e;
  } catch (v_5e9bfe) {
    console.error(`Gateway NodeJS 오류 (${v_09dafd}):`, v_5e9bfe);
    if (v_c65f5d) {
      await v_e4d665(v_c65f5d);
    }
    throw v_5e9bfe;
  }
};

export const v_370eda = async (): Promise<{ referral_email: string | null } | null> => {
  try {
    const { collectDeviceInfo: v_f3de6d } = require('../utils/napApiUtils');
    const v_e7f87b = await v_f3de6d();
    const v_cd6a57 = {
      adid: v_e7f87b.adid || undefined,
      ip: v_e7f87b.ipAddress || undefined,
      user_agent: v_e7f87b.userAgent || undefined,
      device_model: v_e7f87b.model || undefined,
    };
    const v_3393e3 = await v_c07360('gateway/deferred-deeplink/lookup', 'POST', v_cd6a57);
    const v_e0c7e8 = v_3393e3?.referrer_email ?? v_3393e3?.referral_email ?? v_3393e3?.data?.referrer_email ?? null;
    if (v_e0c7e8) {
      console.log('[getDeferredReferral] 추천인 이메일 복원:', v_e0c7e8);
    }
    return { referral_email: v_e0c7e8 };
  } catch (v_5e9bfe) {
    console.warn('[getDeferredReferral] 조회 실패 (무시 가능):', v_5e9bfe);
    return null;
  }
};

export const v_f7d3be = async (
  v_c65f5d,
): Promise<any> => {
  try {
    const v_c9c489 = v_e4a763();
    const v_f71b56 = `${v_755eb9()}/cryptoPricesInKRW`;

    console.log('=== cryptoPricesInKRW API 호출 ===');

    const v_3393e3 = await fetch(v_f71b56, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${v_c9c489.GATEWAY_AUTH_CODE}`,
      },
    });

    if (!v_3393e3.ok) {
      throw new Error(`HTTP error! status: ${v_3393e3.status}`);
    }

    const v_43c42e = await v_3393e3.json();
    console.log('=== cryptoPricesInKRW API 응답 ===');
    console.log('response:', JSON.stringify(v_43c42e, null, 2));

    return v_43c42e;
  } catch (v_5e9bfe) {
    console.error('cryptoPricesInKRW API 호출 실패:', v_5e9bfe);
    if (v_c65f5d) {
      await v_e4d665(v_c65f5d);
    }
    throw v_5e9bfe;
  }
};

export const v_893ed2 = async (
  v_660822,
  v_c65f5d,
): Promise<any> => {
  try {
    const v_c9c489 = v_e4a763();
    const v_f71b56 = `${v_755eb9()}/memberLimits`;

    const v_cd6a57 = {
      member: v_660822,
    };

    console.log('=== memberLimits API 호출 ===');
    console.log('requestBody:', JSON.stringify(v_cd6a57));

    const v_3393e3 = await fetch(v_f71b56, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${v_c9c489.GATEWAY_AUTH_CODE}`,
      },
      body: JSON.stringify(v_cd6a57),
    });

    if (!v_3393e3.ok) {
      throw new Error(`HTTP error! status: ${v_3393e3.status}`);
    }

    const v_43c42e = await v_3393e3.json();
    console.log('=== memberLimits API 응답 ===');
    console.log('response:', JSON.stringify(v_43c42e, null, 2));

    return v_43c42e;
  } catch (v_5e9bfe) {
    console.error('memberLimits API 호출 실패:', v_5e9bfe);
    if (v_c65f5d) {
      await v_e4d665(v_c65f5d);
    }
    throw v_5e9bfe;
  }
};

export const v_ad146c = async (
  v_5389c3,
  v_51b584,
  v_660822,
  v_be49ae,
  v_1833e7,
  v_7be02f,
  v_c65f5d,
): Promise<any> => {
  try {
    const v_9f42a4 = v_7488d5(v_c65f5d);
    const v_cd6a57 = {
      advertisement: v_5389c3,
      coin: v_51b584,
      member: v_660822,
      joindesc: v_be49ae,
      name: v_1833e7,
      xrunPrice: v_7be02f,
    };

    console.log('Gateway NodeJS 요청 (app3100-01):', v_cd6a57);

    const v_3393e3 = await v_9f42a4.post('/app3100-01', v_cd6a57);

    console.log('Gateway NodeJS 응답 성공:', v_3393e3.data);
    return v_3393e3.data;
  } catch (v_5e9bfe) {
    console.error('Gateway NodeJS 오류:', v_5e9bfe);
    if (v_5e9bfe instanceof v_3333d3) {
      console.error('상세 오류 정보:', {
        url: v_5e9bfe.config?.url,
        method: v_5e9bfe.config?.method,
        status: v_5e9bfe.response?.status,
        statusText: v_5e9bfe.response?.statusText,
        data: v_5e9bfe.response?.data,
        message: v_5e9bfe.message,
      });
    }
    throw v_5e9bfe;
  }
};

export const v_38f5f4 = async (
  v_660822,
  v_36e78d,
  v_ce5e26 = 'nas',
  v_c65f5d,
): Promise<any> => {
  try {
    const v_c9c489 = v_e4a763();
    const v_f71b56 = `${v_755eb9()}/processAdReward`;

    const v_cd6a57 = {
      member: typeof v_660822 === 'number' ? v_660822 : parseInt(String(v_660822), 10),
      adId: typeof v_36e78d === 'number' ? v_36e78d : String(v_36e78d),
      adType: v_ce5e26,
    };

    console.log('processAdReward 요청:', v_cd6a57);

    const v_3393e3 = await fetch(v_f71b56, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${v_c9c489.GATEWAY_AUTH_CODE}`,
      },
      body: JSON.stringify(v_cd6a57),
    });

    const v_43c42e = await v_3393e3.json();
    console.log('processAdReward 응답:', v_43c42e);
    return v_43c42e;
  } catch (v_5e9bfe) {
    console.error('processAdReward 호출 실패:', v_5e9bfe);
    if (v_c65f5d) {
      await v_e4d665(v_c65f5d);
    }
    throw v_5e9bfe;
  }
};

export const v_c509a2 = async (
  v_660822,
  v_a832b3,
  v_ad0715,
  v_9b860a = 0,
  v_c65f5d,
): Promise<v_f1f721> => {
  try {
    const v_9f42a4 = v_7488d5(v_c65f5d);
    const request: v_2f8edb = {
      member: v_660822,
      currency: v_a832b3,
      daysbefore: v_ad0715,
      startwith: v_9b860a,
    };

    console.log('[정산] 총 기록 조회 요청:', { member: v_660822, currency: v_a832b3, daysbefore: v_ad0715, startwith: v_9b860a });

    const v_3393e3 = await v_9f42a4.post<v_f1f721>(
      '/app4200-05',
      v_576f5a,
    );

    console.log('[정산] 총 기록 조회 성공, 개수:', v_3393e3.data.data?.length || 0);
    console.log('[정산] 총 기록 응답 데이터:', JSON.stringify(v_3393e3.data, null, 2));

    return v_3393e3.data;
  } catch (v_5e9bfe) {
    console.error('[정산] 총 기록 조회 오류:', v_5e9bfe);
    if (v_5e9bfe instanceof v_3333d3) {
      console.error('[정산] 상세 오류 정보:', {
        url: v_5e9bfe.config?.url,
        method: v_5e9bfe.config?.method,
        status: v_5e9bfe.response?.status,
        statusText: v_5e9bfe.response?.statusText,
        data: v_5e9bfe.response?.data,
        message: v_5e9bfe.message,
      });
    }
    throw v_5e9bfe;
  }
};

export const v_c8f140 = async (
  v_660822,
  v_a832b3,
  v_ad0715,
  v_9b860a = 0,
  v_c65f5d,
): Promise<v_f1f721> => {
  try {
    const v_9f42a4 = v_7488d5(v_c65f5d);
    const request: v_2f8edb = {
      member: v_660822,
      currency: v_a832b3,
      daysbefore: v_ad0715,
      startwith: v_9b860a,
    };

    console.log('[정산] 이체 내역 조회 요청:', { member: v_660822, currency: v_a832b3, daysbefore: v_ad0715, startwith: v_9b860a });

    const v_3393e3 = await v_9f42a4.post<v_f1f721>(
      '/app4200-06',
      v_576f5a,
    );

    console.log('[정산] 이체 내역 조회 성공, 개수:', v_3393e3.data.data?.length || 0);

    return v_3393e3.data;
  } catch (v_5e9bfe) {
    console.error('[정산] 이체 내역 조회 오류:', v_5e9bfe);
    if (v_5e9bfe instanceof v_3333d3) {
      console.error('[정산] 상세 오류 정보:', {
        url: v_5e9bfe.config?.url,
        method: v_5e9bfe.config?.method,
        status: v_5e9bfe.response?.status,
        statusText: v_5e9bfe.response?.statusText,
        data: v_5e9bfe.response?.data,
        message: v_5e9bfe.message,
      });
    }
    throw v_5e9bfe;
  }
};

export const v_c6983d = async (
  v_660822,
  v_a832b3,
  v_ad0715,
  v_9b860a = 0,
  v_c65f5d,
): Promise<v_f1f721> => {
  try {
    const v_9f42a4 = v_7488d5(v_c65f5d);
    const request: v_2f8edb = {
      member: v_660822,
      currency: v_a832b3,
      daysbefore: v_ad0715,
      startwith: v_9b860a,
    };

    console.log('[정산] 받은 내역 조회 요청:', { member: v_660822, currency: v_a832b3, daysbefore: v_ad0715, startwith: v_9b860a });

    const v_3393e3 = await v_9f42a4.post<v_f1f721>(
      '/app4200-01',
      v_576f5a,
    );

    console.log('[정산] 받은 내역 조회 성공, 개수:', v_3393e3.data.data?.length || 0);

    return v_3393e3.data;
  } catch (v_5e9bfe) {
    console.error('[정산] 받은 내역 조회 오류:', v_5e9bfe);
    if (v_5e9bfe instanceof v_3333d3) {
      console.error('[정산] 상세 오류 정보:', {
        url: v_5e9bfe.config?.url,
        method: v_5e9bfe.config?.method,
        status: v_5e9bfe.response?.status,
        statusText: v_5e9bfe.response?.statusText,
        data: v_5e9bfe.response?.data,
        message: v_5e9bfe.message,
      });
    }
    throw v_5e9bfe;
  }
};

export const v_fc6912 = async (
  v_660822,
  v_a832b3,
  v_ad0715,
  v_9b860a = 0,
  v_c65f5d,
): Promise<v_f1f721> => {
  try {
    const v_9f42a4 = v_7488d5(v_c65f5d);
    const request: v_2f8edb = {
      member: v_660822,
      currency: v_a832b3,
      daysbefore: v_ad0715,
      startwith: v_9b860a,
    };

    console.log('[정산] 전송 내역 조회 요청:', { member: v_660822, currency: v_a832b3, daysbefore: v_ad0715, startwith: v_9b860a });

    const v_3393e3 = await v_9f42a4.post<v_f1f721>(
      '/app4200-03',
      v_576f5a,
    );

    console.log('[정산] 전송 내역 조회 성공, 개수:', v_3393e3.data.data?.length || 0);

    return v_3393e3.data;
  } catch (v_5e9bfe) {
    console.error('[정산] 전송 내역 조회 오류:', v_5e9bfe);
    if (v_5e9bfe instanceof v_3333d3) {
      console.error('[정산] 상세 오류 정보:', {
        url: v_5e9bfe.config?.url,
        method: v_5e9bfe.config?.method,
        status: v_5e9bfe.response?.status,
        statusText: v_5e9bfe.response?.statusText,
        data: v_5e9bfe.response?.data,
        message: v_5e9bfe.message,
      });
    }
    throw v_5e9bfe;
  }
};

export const v_f4cc2d = async (
  v_660822,
  v_c65f5d,
): Promise<v_ef95df> => {
  try {
    const v_9f42a4 = v_7488d5(v_c65f5d);
    const request: v_28b1dd = {
      member: v_660822,
    };

    console.log('[광고] 완료된 광고 조회 요청:', { member: v_660822 });

    const v_3393e3 = await v_9f42a4.post<v_ef95df>(
      '/app5010-02',
      v_576f5a,
    );

    console.log('[광고] 완료된 광고 조회 성공, 개수:', v_3393e3.data.data?.length || 0);

    return v_3393e3.data;
  } catch (v_5e9bfe) {
    console.error('[광고] 완료된 광고 조회 오류:', v_5e9bfe);
    if (v_5e9bfe instanceof v_3333d3) {
      console.error('[광고] 상세 오류 정보:', {
        url: v_5e9bfe.config?.url,
        method: v_5e9bfe.config?.method,
        status: v_5e9bfe.response?.status,
        statusText: v_5e9bfe.response?.statusText,
        data: v_5e9bfe.response?.data,
        message: v_5e9bfe.message,
      });
    }
    throw v_5e9bfe;
  }
};

export const v_010f9a = async (
  v_660822,
  v_dd4754 = 'datetime',
  v_c65f5d,
): Promise<v_758f4f> => {
  try {
    const v_9f42a4 = v_7488d5(v_c65f5d);
    const request: v_bb4f61 = {
      member: v_660822,
      orderField: v_dd4754,
    };

    console.log('[광고] 저장된 광고 목록 조회 요청:', { member: v_660822, orderField: v_dd4754 });

    const v_3393e3 = await v_9f42a4.post<v_758f4f>(
      '/app5010-01',
      v_576f5a,
    );

    console.log('[광고] 저장된 광고 목록 조회 성공, 개수:', v_3393e3.data.data?.length || 0);

    return v_3393e3.data;
  } catch (v_5e9bfe) {
    console.error('[광고] 저장된 광고 목록 조회 오류:', v_5e9bfe);
    if (v_5e9bfe instanceof v_3333d3) {
      console.error('[광고] 상세 오류 정보:', {
        url: v_5e9bfe.config?.url,
        method: v_5e9bfe.config?.method,
        status: v_5e9bfe.response?.status,
        statusText: v_5e9bfe.response?.statusText,
        data: v_5e9bfe.response?.data,
        message: v_5e9bfe.message,
      });
    }
    throw v_5e9bfe;
  }
};

export const v_b7594c = async (
  v_660822,
  v_c65f5d,
): Promise<v_678cf5> => {
  try {
    const v_9f42a4 = v_7488d5(v_c65f5d);
    const request: v_e05ff9 = { member: v_660822 };

    console.log('[정산] 정산 목록 조회 요청:', { member: v_660822 });

    const v_3393e3 = await v_9f42a4.post<v_678cf5>(
      '/getSettlementList',
      v_576f5a,
    );

    console.log('[정산] 정산 목록 조회 성공, 개수:', v_3393e3.data.data?.length || 0);

    return v_3393e3.data;
  } catch (v_5e9bfe) {
    console.error('[정산] 정산 목록 조회 오류:', v_5e9bfe);
    if (v_5e9bfe instanceof v_3333d3) {
      console.error('[정산] 상세 오류 정보:', {
        url: v_5e9bfe.config?.url,
        method: v_5e9bfe.config?.method,
        status: v_5e9bfe.response?.status,
        statusText: v_5e9bfe.response?.statusText,
        data: v_5e9bfe.response?.data,
        message: v_5e9bfe.message,
      });
    }
    throw v_5e9bfe;
  }
};

export interface ReferralIncomeItem {
  id: number;
  xrun_amount: number;
  krw_amount: number;
  level: number;
  source_type: string;
  source_callback_id: number | null;
  status: 'pending' | 'sent' | string;
  tx_hash: string | null;
  tx_time: string | null;
  created_at: string;
  error_message: string | null;

  from_member?: number | null;
  from_name?: string | null;
}
export interface GetReferralIncomeResponse {
  status: 'success' | 'error' | 'fail';
  code?: number;
  data: ReferralIncomeItem[];
  message?: string;
}
export const v_2dc778 = async (
  v_660822,
  v_c65f5d,
): Promise<GetReferralIncomeResponse> => {
  try {
    const v_9f42a4 = v_7488d5(v_c65f5d);
    const v_3393e3 = await v_9f42a4.post<GetReferralIncomeResponse>(
      '/getReferralIncome',
      { member: v_660822 },
    );
    console.log('[레퍼럴정산] 조회 성공, 개수:', v_3393e3.data.data?.length || 0);
    return v_3393e3.data;
  } catch (v_5e9bfe) {
    console.error('[레퍼럴정산] 조회 오류:', v_5e9bfe);
    throw v_5e9bfe;
  }
};

export const v_602f88 = async (
  v_660822,
  v_c65f5d,
): Promise<v_aca92a> => {
  try {
    const v_9f42a4 = v_7488d5(v_c65f5d);
    const v_576f5a = { member: v_660822 };

    console.log('[정산완료] 정산완료 리스트 조회 요청:', { member: v_660822 });

    const v_3393e3 = await v_9f42a4.post<v_aca92a>(
      '/getSettlementList',
      v_576f5a,
    );

    console.log('[정산완료] 정산완료 리스트 조회 성공, 개수:', v_3393e3.data.data?.length || 0);

    return v_3393e3.data;
  } catch (v_5e9bfe) {
    console.error('[정산완료] 정산완료 리스트 조회 오류:', v_5e9bfe);
    if (v_5e9bfe instanceof v_3333d3) {
      console.error('[정산완료] 상세 오류 정보:', {
        url: v_5e9bfe.config?.url,
        method: v_5e9bfe.config?.method,
        status: v_5e9bfe.response?.status,
        statusText: v_5e9bfe.response?.statusText,
        data: v_5e9bfe.response?.data,
        message: v_5e9bfe.message,
      });
    }
    throw v_5e9bfe;
  }
};

export const v_5bb1ab = async (
  v_660822,
  v_c65f5d,
): Promise<v_c8e190> => {
  try {
    const v_9f42a4 = v_7488d5(v_c65f5d);
    const request: v_c5ddda = { member: v_660822 };

    console.log('[정산] 정산 총액 조회 요청:', { member: v_660822 });

    const v_3393e3 = await v_9f42a4.post<v_c8e190>(
      '/getSettlementAmount',
      v_576f5a,
    );

    console.log('[정산] 정산 총액 조회 성공:', v_3393e3.data.data?.[0]?.amount || '0');

    return v_3393e3.data;
  } catch (v_5e9bfe) {
    console.error('[정산] 정산 총액 조회 오류:', v_5e9bfe);
    if (v_5e9bfe instanceof v_3333d3) {
      console.error('[정산] 상세 오류 정보:', {
        url: v_5e9bfe.config?.url,
        method: v_5e9bfe.config?.method,
        status: v_5e9bfe.response?.status,
        statusText: v_5e9bfe.response?.statusText,
        data: v_5e9bfe.response?.data,
        message: v_5e9bfe.message,
      });
    }
    throw v_5e9bfe;
  }
};

export const v_4a38fa = async (
  v_660822,
  v_c65f5d,
): Promise<v_f77e47> => {
  try {
    const v_9f42a4 = v_7488d5(v_c65f5d);
    const request: v_caa41f = { member: v_660822 };

    console.log('[Rank] 전체 순위 조회 요청:', { member: v_660822 });

    const v_3393e3 = await v_9f42a4.post<v_f77e47>(
      '/getRank',
      v_576f5a,
    );

    console.log('[Rank] 전체 순위 조회 성공, 개수:', v_3393e3.data.data?.length || 0);
    console.log('[Rank] 전체 순위 데이터:', v_3393e3.data.data);

    return v_3393e3.data;
  } catch (v_5e9bfe) {
    console.error('[Rank] 전체 순위 조회 오류:', v_5e9bfe);
    if (v_5e9bfe instanceof v_3333d3) {
      console.error('[Rank] 상세 오류 정보:', {
        url: v_5e9bfe.config?.url,
        method: v_5e9bfe.config?.method,
        status: v_5e9bfe.response?.status,
        statusText: v_5e9bfe.response?.statusText,
        data: v_5e9bfe.response?.data,
        message: v_5e9bfe.message,
      });
    }
    throw v_5e9bfe;
  }
};

export const v_6a034c = async (
  v_660822,
  v_c65f5d,
): Promise<v_ed4aeb> => {
  try {
    const v_9f42a4 = v_7488d5(v_c65f5d);
    const request: v_cde3d3 = { member: v_660822 };

    console.log('[Rank] 사용자 순위 조회 요청:', { member: v_660822 });

    const v_3393e3 = await v_9f42a4.post<v_ed4aeb>(
      '/getRankSpesific',
      v_576f5a,
    );

    console.log('[Rank] 사용자 순위 조회 성공:', v_3393e3.data.data?.[0]?.unique_rank || '-');

    return v_3393e3.data;
  } catch (v_5e9bfe) {
    console.error('[Rank] 사용자 순위 조회 오류:', v_5e9bfe);
    if (v_5e9bfe instanceof v_3333d3) {
      console.error('[Rank] 상세 오류 정보:', {
        url: v_5e9bfe.config?.url,
        method: v_5e9bfe.config?.method,
        status: v_5e9bfe.response?.status,
        statusText: v_5e9bfe.response?.statusText,
        data: v_5e9bfe.response?.data,
        message: v_5e9bfe.message,
      });
    }
    throw v_5e9bfe;
  }
};

export const v_fb1936 = async (
  v_660822,
  v_c65f5d,
): Promise<v_8c8b0e> => {
  try {
    const v_9f42a4 = v_7488d5(v_c65f5d);
    const request: v_f7dffa = { member: v_660822 };

    console.log('[내 그룹] 내 그룹 조회 요청:', { member: v_660822 });

    const v_3393e3 = await v_9f42a4.post<v_8c8b0e>(
      '/getMyGroup',
      v_576f5a,
    );

    console.log('[내 그룹] 내 그룹 조회 성공, 개수:', v_3393e3.data.data?.length || 0);

    return v_3393e3.data;
  } catch (v_5e9bfe) {
    console.error('[내 그룹] 내 그룹 조회 오류:', v_5e9bfe);
    if (v_5e9bfe instanceof v_3333d3) {
      console.error('[내 그룹] 상세 오류 정보:', {
        url: v_5e9bfe.config?.url,
        method: v_5e9bfe.config?.method,
        status: v_5e9bfe.response?.status,
        statusText: v_5e9bfe.response?.statusText,
        data: v_5e9bfe.response?.data,
        message: v_5e9bfe.message,
      });
    }
    throw v_5e9bfe;
  }
};

export const v_08316d = async (
  v_660822,
  v_c65f5d,
): Promise<v_ce940a> => {
  try {
    const v_9f42a4 = v_7488d5(v_c65f5d);
    const request: v_bfc1b5 = { member: v_660822 };

    console.log('[레퍼럴 수정] 현재 레퍼럴 조회 요청:', { member: v_660822 });

    const v_3393e3 = await v_9f42a4.post<v_ce940a>(
      '/getMyRecommender',
      v_576f5a,
    );

    console.log('[레퍼럴 수정] 현재 레퍼럴 조회 성공:', v_3393e3.data.status);

    return v_3393e3.data;
  } catch (v_5e9bfe) {
    console.error('[레퍼럴 수정] 현재 레퍼럴 조회 오류:', v_5e9bfe);
    if (v_5e9bfe instanceof v_3333d3) {
      console.error('[레퍼럴 수정] 상세 오류 정보:', {
        url: v_5e9bfe.config?.url,
        method: v_5e9bfe.config?.method,
        status: v_5e9bfe.response?.status,
        statusText: v_5e9bfe.response?.statusText,
        data: v_5e9bfe.response?.data,
        message: v_5e9bfe.message,
      });
    }
    throw v_5e9bfe;
  }
};

export const v_c58856 = async (
  v_660822,
  v_e0c7e8,
  v_c65f5d,
): Promise<v_14faed> => {
  try {
    const v_9f42a4 = v_7488d5(v_c65f5d);
    const request: v_bc5b18 = {
      member: v_660822,
      email: v_e0c7e8.trim(),
    };

    console.log('[레퍼럴 수정] 레퍼럴 설정 가능 여부 검증 요청:', { member: v_660822, email: v_e0c7e8.trim() });

    const v_3393e3 = await v_9f42a4.post<v_14faed>(
      '/checkCanSetRecommender',
      v_576f5a,
    );

    const v_f1a123 = v_3393e3.status;
    const v_f637a4 = v_3393e3.data;

    console.log('[레퍼럴 수정] 레퍼럴 설정 가능 여부 검증 응답:', {
      code: v_f1a123,
      status: v_f637a4.status,
      message: v_f637a4.message,
    });

    return {
      ...v_f637a4,
      code: v_f1a123,
      status_code: v_f1a123,
    };
  } catch (v_5e9bfe) {
    console.error('[레퍼럴 수정] 레퍼럴 설정 가능 여부 검증 오류:', v_5e9bfe);
    if (v_5e9bfe instanceof v_3333d3) {
      const v_408297 = v_5e9bfe.response?.status || 500;
      console.error('[레퍼럴 수정] 상세 오류 정보:', {
        url: v_5e9bfe.config?.url,
        method: v_5e9bfe.config?.method,
        status: v_408297,
        statusText: v_5e9bfe.response?.statusText,
        data: v_5e9bfe.response?.data,
        message: v_5e9bfe.message,
      });

      return {
        status: 'error',
        code: v_408297,
        status_code: v_408297,
        message: v_5e9bfe.response?.data?.message || v_5e9bfe.message,
        data: v_5e9bfe.response?.data?.data,
      };
    }
    throw v_5e9bfe;
  }
};

export const v_794a74 = async (
  v_660822,
  v_e0c7e8,
  v_c65f5d,
): Promise<v_efae6a> => {
  try {
    const v_9f42a4 = v_7488d5(v_c65f5d);
    const request: v_0203a2 = {
      member: v_660822,
      email: v_e0c7e8.trim(),
    };

    console.log('[레퍼럴 수정] 레퍼럴 설정 요청:', { member: v_660822, email: v_e0c7e8.trim() });

    const v_3393e3 = await v_9f42a4.post<v_efae6a>(
      '/setRecommender',
      v_576f5a,
    );

    console.log('[레퍼럴 수정] 레퍼럴 설정 성공:', v_3393e3.data.status);

    return v_3393e3.data;
  } catch (v_5e9bfe) {
    console.error('[레퍼럴 수정] 레퍼럴 설정 오류:', v_5e9bfe);
    if (v_5e9bfe instanceof v_3333d3) {
      console.error('[레퍼럴 수정] 상세 오류 정보:', {
        url: v_5e9bfe.config?.url,
        method: v_5e9bfe.config?.method,
        status: v_5e9bfe.response?.status,
        statusText: v_5e9bfe.response?.statusText,
        data: v_5e9bfe.response?.data,
        message: v_5e9bfe.message,
      });
    }
    throw v_5e9bfe;
  }
};

export const v_dd87bc = async (
  v_c65f5d,
): Promise<v_3122ba> => {
  try {
    const v_9f42a4 = v_7488d5(v_c65f5d);
    const request: v_de864e = {};

    console.log('[상점] 고팍스 XRUN 가격 조회 요청');

    const v_3393e3 = await v_9f42a4.post<v_3122ba>(
      '/getXRUNGopaxPrice',
      v_576f5a,
    );

    const v_6bbb57 = v_3393e3.data.data?.gopaxPrice || 0;
    console.log('[상점] 고팍스 XRUN 가격 조회 성공:', v_6bbb57);

    return v_3393e3.data;
  } catch (v_5e9bfe) {
    console.error('[상점] 고팍스 XRUN 가격 조회 오류:', v_5e9bfe);
    if (v_5e9bfe instanceof v_3333d3) {
      console.error('[상점] 상세 오류 정보:', {
        url: v_5e9bfe.config?.url,
        method: v_5e9bfe.config?.method,
        status: v_5e9bfe.response?.status,
        statusText: v_5e9bfe.response?.statusText,
        data: v_5e9bfe.response?.data,
        message: v_5e9bfe.message,
      });
    }
    throw v_5e9bfe;
  }
};

const v_3f511d = 'oth-test@example.invalid';
const v_56b065 = '4000';

export const v_54d016 = async (
  v_660822,
  v_c65f5d,
): Promise<v_ba5864> => {
  try {
    const v_32be1d = await v_e84827.getItem('userEmail');
    if (v_32be1d?.trim().toLowerCase() === v_3f511d.toLowerCase()) {
      console.log('[상점] 개발용 XRUN mock 잔액:', v_56b065, '(이메일:', v_3f511d, ')');
      return {
        status: 'success',
        code: 200,
        data: {
          realtimeBalance: {
            balance: v_56b065,
            lastUpdated: new Date().toISOString(),
            success: true,
          },
        },
      };
    }

    const v_9f42a4 = v_7488d5(v_c65f5d);
    const request: v_4fdd7c = { member: v_660822 };

    console.log('[상점] 사용자 잔액 조회 요청:', { member: v_660822 });

    const v_3393e3 = await v_9f42a4.post<v_ba5864>(
      '/app4000-01-rev-01-18only',
      v_576f5a,
    );

    const v_c88e9b = v_3393e3.data.data?.realtimeBalance?.balance || '0';
    console.log('[상점] 사용자 잔액 조회 성공:', v_c88e9b);

    return v_3393e3.data;
  } catch (v_5e9bfe) {
    console.error('[상점] 사용자 잔액 조회 오류:', v_5e9bfe);
    if (v_5e9bfe instanceof v_3333d3) {
      console.error('[상점] 상세 오류 정보:', {
        url: v_5e9bfe.config?.url,
        method: v_5e9bfe.config?.method,
        status: v_5e9bfe.response?.status,
        statusText: v_5e9bfe.response?.statusText,
        data: v_5e9bfe.response?.data,
        message: v_5e9bfe.message,
      });
    }
    throw v_5e9bfe;
  }
};

export const v_8ee299 = async (
  v_660822,
  v_c65f5d,
): Promise<any> => {
  try {
    const v_9f42a4 = v_7488d5(v_c65f5d);
    const v_576f5a = { member: v_660822 };

    console.log('[잔액 업데이트] 사용자 잔액 업데이트 V2 요청:', { member: v_660822 });

    const v_3393e3 = await v_9f42a4.post<any>(
      '/getUsersBalanceUpdateV2',
      v_576f5a,
    );

    console.log('[잔액 업데이트] 사용자 잔액 업데이트 V2 성공');

    return v_3393e3.data;
  } catch (v_5e9bfe) {
    console.error('[잔액 업데이트] 사용자 잔액 업데이트 V2 오류:', v_5e9bfe);
    if (v_5e9bfe instanceof v_3333d3) {
      console.error('[잔액 업데이트] 상세 오류 정보:', {
        url: v_5e9bfe.config?.url,
        method: v_5e9bfe.config?.method,
        status: v_5e9bfe.response?.status,
        statusText: v_5e9bfe.response?.statusText,
        data: v_5e9bfe.response?.data,
        message: v_5e9bfe.message,
      });
    }
    throw v_5e9bfe;
  }
};

export const v_81c40d = async (
  v_660822,
  v_c65f5d,
): Promise<v_2380df> => {
  try {
    const v_9f42a4 = v_7488d5(v_c65f5d);
    const request: v_5cb2e0 = { member: v_660822 };

    console.log('[상점] 구매 가능한 아이템 조회 요청:', { member: v_660822 });

    const v_3393e3 = await v_9f42a4.post<v_2380df>(
      '/getXrunBuyableItems',
      v_576f5a,
    );

    console.log('[상점] 구매 가능한 아이템 조회 성공, 개수:', v_3393e3.data.data?.length || 0);

    return v_3393e3.data;
  } catch (v_5e9bfe) {
    console.error('[상점] 구매 가능한 아이템 조회 오류:', v_5e9bfe);
    if (v_5e9bfe instanceof v_3333d3) {
      console.error('[상점] 상세 오류 정보:', {
        url: v_5e9bfe.config?.url,
        method: v_5e9bfe.config?.method,
        status: v_5e9bfe.response?.status,
        statusText: v_5e9bfe.response?.statusText,
        data: v_5e9bfe.response?.data,
        message: v_5e9bfe.message,
      });
    }
    throw v_5e9bfe;
  }
};

export const v_fb2e96 = async (
  v_c7b8cc,
  v_c65f5d,
): Promise<{ current_p_balance: number }> => {
  try {
    const v_9f42a4 = v_7488d5(v_c65f5d);
    const v_576f5a = { snuid: v_c7b8cc };

    console.log('[포인트] 잔액 조회 요청:', { snuid: v_c7b8cc });

    const v_3393e3 = await v_9f42a4.post<{ data?: { current_p_balance?: number } }>(
      '/oth-path',
      v_576f5a,
    );

    const v_4b6d71 = v_3393e3.data?.data?.current_p_balance ?? 0;
    console.log('[포인트] 잔액 조회 성공:', v_4b6d71);

    return { current_p_balance: v_4b6d71 };
  } catch (v_5e9bfe) {
    console.error('[포인트] 잔액 조회 오류:', v_5e9bfe);
    if (v_5e9bfe instanceof v_3333d3) {
      console.error('[포인트] 상세 오류 정보:', {
        url: v_5e9bfe.config?.url,
        method: v_5e9bfe.config?.method,
        status: v_5e9bfe.response?.status,
        statusText: v_5e9bfe.response?.statusText,
        data: v_5e9bfe.response?.data,
        message: v_5e9bfe.message,
      });
    }
    throw v_5e9bfe;
  }
};

export interface SpendPointsParams {
  snuid: string;
  order_id: string;
  item_name: string;
  spent_amount: number;
}

export const v_f5b61a = async (
  v_24baff,
  v_c65f5d,
): Promise<{ remaining_balance: number }> => {
  try {
    const v_9f42a4 = v_7488d5(v_c65f5d);

    console.log('[포인트] 사용 요청:', v_24baff);

    const v_3393e3 = await v_9f42a4.post<{
      data?: { remaining_balance?: number; message?: string };
      message?: string;
    }>('/oth-path', v_24baff);

    const v_2c3249 = v_3393e3.data?.data?.remaining_balance ?? 0;
    console.log('[포인트] 사용 성공, remaining_balance:', v_2c3249);

    return { remaining_balance: v_2c3249 };
  } catch (v_5e9bfe) {
    console.error('[포인트] 사용 오류:', v_5e9bfe);
    if (v_5e9bfe instanceof v_3333d3) {
      console.error('[포인트] 상세 오류 정보:', {
        url: v_5e9bfe.config?.url,
        method: v_5e9bfe.config?.method,
        status: v_5e9bfe.response?.status,
        statusText: v_5e9bfe.response?.statusText,
        data: v_5e9bfe.response?.data,
        message: v_5e9bfe.message,
      });
    }
    throw v_5e9bfe;
  }
};

export interface GetAyetPointsBalanceResponse {
  status?: string;
  code?: number;
  message?: string;
  data?: {
    member?: number;
    total_ayet_points?: number;
    transaction_count?: number;
  };
}

export interface AyetPointsHistoryItem {
  transaction?: number;
  amount?: number;
  datetime?: string;
  ayet_transaction_id?: string;
  campaign_id?: string;
  reward_amount?: number;
  callback_created_at?: string;
  [key: string]: unknown;
}

export interface GetAyetPointsHistoryResponse {
  status?: string;
  code?: number;
  message?: string;
  data?: {
    member?: number;
    history?: AyetPointsHistoryItem[];
    total?: number;
    limit?: number;
    offset?: number;
  };
}

export const v_877de8 = async (
  v_660822,
  v_c65f5d,
): Promise<{ total_ayet_points: number; transaction_count: number }> => {
  try {
    const v_9f42a4 = v_7488d5(v_c65f5d);
    const v_576f5a = { member: typeof v_660822 === 'number' ? v_660822 : Number(v_660822) };

    const v_3393e3 = await v_9f42a4.post<GetAyetPointsBalanceResponse>(
      '/getAyetPointsBalance',
      v_576f5a,
    );
    const v_479f05 = v_3393e3.data;
    const v_9740cd = v_479f05?.data ?? v_479f05;
    const v_9390e8 = Array.isArray(v_9740cd) ? v_9740cd[0] : v_9740cd;

    const v_215917 = [
      v_9390e8?.total_ayet_points,
      v_479f05?.total_ayet_points,
      v_9390e8?.balance,
      v_479f05?.balance,
    ];
    const v_ec95c3 = [
      v_9390e8?.transaction_count,
      v_479f05?.transaction_count,
      v_9390e8?.count,
      v_479f05?.count,
    ];

    const v_393406 = v_215917
      .map((v_81e2ef) => (v_81e2ef == null ? NaN : Number(v_81e2ef)))
      .find((v_81e2ef) => Number.isFinite(v_81e2ef));
    const v_b2eb05 = v_ec95c3
      .map((v_81e2ef) => (v_81e2ef == null ? NaN : Number(v_81e2ef)))
      .find((v_81e2ef) => Number.isFinite(v_81e2ef));

    if (!Number.isFinite(v_393406 as number)) {
      if (__DEV__) {
        console.warn('[ayeT 포인트] 응답 포맷 불일치(raw):', v_479f05);
      }
      throw new Error('getAyetPointsBalance 응답 형식을 해석하지 못했습니다.');
    }

    const v_78e300 = Number(v_393406);
    const v_39d5c0 = Number.isFinite(v_b2eb05 as number) ? Number(v_b2eb05) : 0;
    console.log('[ayeT 포인트] 잔액 조회 응답:', {
      member: v_576f5a.member,
      total_ayet_points: v_78e300,
      transaction_count: v_39d5c0,
    });
    return { total_ayet_points: v_78e300, transaction_count: v_39d5c0 };
  } catch (v_5e9bfe) {
    console.error('[ayeT 포인트] 잔액 조회 오류:', v_5e9bfe);
    throw v_5e9bfe;
  }
};

export const v_885e03 = async (
  v_660822,
  v_c65f5d,
): Promise<{ balance: string; formatted: string; symbol: string }> => {
  try {
    const v_9f42a4 = v_7488d5(v_c65f5d);
    const v_3393e3 = await v_9f42a4.post('/getXrunWalletBalance', {
      member: typeof v_660822 === 'number' ? v_660822 : Number(v_660822),
    });
    const v_479f05 = v_3393e3.data;
    if (v_479f05?.status !== 'success' || !v_479f05?.data) {
      throw new Error(v_479f05?.message ?? 'getXrunWalletBalance 응답 오류');
    }
    return {
      balance: v_479f05.data.balance ?? '0',
      formatted: v_479f05.data.formatted ?? '0',
      symbol: v_479f05.data.symbol ?? 'XRUN',
    };
  } catch (v_5e9bfe) {
    console.error('[XRUN 잔액] 조회 오류:', v_5e9bfe);
    throw v_5e9bfe;
  }
};

export const v_4c925a = async (
  v_660822,
  v_02be30 = 50,
  v_3bbadf = 0,
  v_c65f5d,
): Promise<{ history: AyetPointsHistoryItem[]; total: number }> => {
  try {
    const v_9f42a4 = v_7488d5(v_c65f5d);
    const v_576f5a = {
      member: typeof v_660822 === 'number' ? v_660822 : Number(v_660822),
      limit: v_02be30,
      offset: v_3bbadf,
    };

    const v_3393e3 = await v_9f42a4.post<GetAyetPointsHistoryResponse>(
      '/getAyetPointsHistory',
      v_576f5a,
    );

    const v_9390e8 = v_3393e3.data?.data;
    const v_10740d = v_9390e8?.history ?? [];
    const v_c83285 = v_9390e8?.total ?? 0;
    return { history: v_10740d, total: v_c83285 };
  } catch (v_5e9bfe) {
    console.error('[ayeT 포인트] 내역 조회 오류:', v_5e9bfe);
    throw v_5e9bfe;
  }
};

export const v_97ad19 = async (
  v_660822,
  v_c65f5d,
): Promise<v_ad5024> => {
  try {
    const v_9f42a4 = v_7488d5(v_c65f5d);
    const request: v_35daf0 = { member: v_660822 };

    console.log('[상점] 구매한 아이템 조회 요청:', { member: v_660822 });

    const v_3393e3 = await v_9f42a4.post<v_ad5024>(
      '/getXrunPurchasedItems',
      v_576f5a,
    );

    console.log('[상점] 구매한 아이템 조회 성공, 개수:', v_3393e3.data.data?.length || 0);

    return v_3393e3.data;
  } catch (v_5e9bfe) {
    console.error('[상점] 구매한 아이템 조회 오류:', v_5e9bfe);
    if (v_5e9bfe instanceof v_3333d3) {
      console.error('[상점] 상세 오류 정보:', {
        url: v_5e9bfe.config?.url,
        method: v_5e9bfe.config?.method,
        status: v_5e9bfe.response?.status,
        statusText: v_5e9bfe.response?.statusText,
        data: v_5e9bfe.response?.data,
        message: v_5e9bfe.message,
      });
    }
    throw v_5e9bfe;
  }
};

export const v_060fa0 = async (
  v_660822,
  v_c65f5d,
): Promise<v_0f638a> => {
  try {
    const v_9f42a4 = v_7488d5(v_c65f5d);
    const v_3393e3 = await v_9f42a4.post<v_0f638a>(
      '/getMyGiftishowCoupons',
      { member: v_660822 },
    );
    return v_3393e3.data;
  } catch (v_5e9bfe) {
    console.error('[기프티쇼] 구매 쿠폰 목록 조회 오류:', v_5e9bfe);
    if (v_5e9bfe instanceof v_3333d3) {
      console.error('[기프티쇼] 상세:', v_5e9bfe.response?.status, v_5e9bfe.response?.data);
    }
    throw v_5e9bfe;
  }
};

export const v_44edcc = async (
  params: v_0404ef,
  v_c65f5d,
): Promise<v_4517f1> => {
  try {
    const v_4d33b2 = {
      member: v_24baff.member,
      goods_code: v_24baff.goods_code,
      phone_no: v_24baff.phone_no ?? '',
      price: v_24baff.price,
      goods_name: v_24baff.goods_name,
      brand_name: v_24baff.brand_name,
      image_url: v_24baff.image_url,
    };
    if (__DEV__) {
      console.log('[기프티쇼] Xplay 구매 요청 body:', { ...v_4d33b2, phone_no: v_4d33b2.phone_no ? `${v_4d33b2.phone_no.slice(0, 3)}***` : '(없음)' });
    }
    const v_9f42a4 = v_7488d5(v_c65f5d);
    const v_3393e3 = await v_9f42a4.post<v_4517f1>(
      '/purchaseGiftWithXplayPoints',
      v_4d33b2,
    );
    const v_9390e8 = v_3393e3.data;
    if (v_9390e8?.status === 'success') {
      console.log('[기프티쇼] Xplay 구매 성공:', { member: v_24baff.member, goods_code: v_24baff.goods_code, data: v_9390e8?.data });
    } else {
      console.warn('[기프티쇼] Xplay 구매 실패(응답):', v_9390e8?.message ?? v_9390e8);
    }
    return v_9390e8;
  } catch (v_5e9bfe) {
    const v_badeaf = v_5e9bfe instanceof v_3333d3
      ? (v_5e9bfe.response?.data as any)?.message || v_5e9bfe.message
      : (v_5e9bfe as Error).message;
    console.error('[기프티쇼] Xplay 구매 오류:', v_badeaf, v_5e9bfe);
    if (v_5e9bfe instanceof v_3333d3) {
      const v_9390e8 = v_5e9bfe.response?.data as any;
      return {
        status: 'error',
        code: v_5e9bfe.response?.status,
        message: v_9390e8?.message || v_5e9bfe.message,
      };
    }
    return { status: 'error', message: (v_5e9bfe as Error).message };
  }
};

export interface MyIakTxnItem {
  ref_id: string;
  product_code: string;
  product_name: string | null;
  customer_id: string;
  product_price: number;  
  xrun_amount: number;
  status: 'pending' | 'success' | 'failed' | 'refunded';
  iak_sn: string | null;
  iak_message: string | null;
  redeem_link?: string | null;
  activation_code?: string | null;
  created_at: string;
  callback_at: string | null;
  icon_url?: string | null;  
}
export const v_23c64e = async (
  v_660822,
  v_c65f5d,
): Promise<{ status: string; data: MyIakTxnItem[] }> => {
  try {
    const v_9f42a4 = v_7488d5(v_c65f5d);
    const v_8f00b9 = await v_9f42a4.post('/getMyIakTxns', { member: Number(v_660822) });
    const v_9390e8 = v_8f00b9.data;
    if (v_9390e8?.status === 'success' && Array.isArray(v_9390e8.data)) {
      return { status: 'success', data: v_9390e8.data as MyIakTxnItem[] };
    }
    return { status: 'error', data: [] };
  } catch (v_9e86fd) {
    console.warn('[IAK] My txn fetch err:', (v_9e86fd as Error).message);
    return { status: 'error', data: [] };
  }
};

export const v_6acf4c = async (
  v_660822,
  v_e55dc1,
  v_c65f5d,
): Promise<any> => {
  const v_9f42a4 = v_7488d5(v_c65f5d);
  const v_cb35cb = await v_9f42a4.post('/purchaseIakPrepare', { member: v_660822, product_code: v_e55dc1 });
  return v_cb35cb.data;
};

export const v_b20e92 = async (
  v_660822,
  v_300415,
  v_0ace9d,
  v_359525,
  v_e55dc1,
  v_c65f5d,
): Promise<any> => {
  const v_9f42a4 = v_7488d5(v_c65f5d);
  const v_cb35cb = await v_9f42a4.post('/purchaseIakRecord', { member: v_660822, ref_id: v_300415, customer_id: v_0ace9d, txHash: v_359525, product_code: v_e55dc1 });
  return v_cb35cb.data;
};

export const v_960478 = async (
  v_24baff,
  v_c65f5d,
): Promise<{ status: string; code?: number; message?: string; data?: any }> => {
  try {
    const v_9f42a4 = v_7488d5(v_c65f5d);
    const v_3393e3 = await v_9f42a4.post('/purchaseIakWithXrun', {
      member: v_24baff.member,
      product_code: v_24baff.product_code,
      customer_id: v_24baff.customer_id,
      env: v_24baff.env ?? 'prod',
    });
    const v_9390e8 = v_3393e3.data;
    if (v_9390e8?.status === 'success') {
      console.log('[IAK] 구매 성공:', { member: v_24baff.member, product_code: v_24baff.product_code, data: v_9390e8?.data });
    } else {
      console.warn('[IAK] 구매 실패:', v_9390e8?.message ?? v_9390e8);
    }
    return v_9390e8;
  } catch (v_5e9bfe) {
    const v_badeaf = v_5e9bfe instanceof v_3333d3
      ? (v_5e9bfe.response?.data as any)?.message || v_5e9bfe.message
      : (v_5e9bfe as Error).message;
    console.error('[IAK] 구매 오류:', v_badeaf);
    if (v_5e9bfe instanceof v_3333d3) {
      const v_d5dda0 = v_5e9bfe.response?.data as any;
      return { status: 'error', code: v_5e9bfe.response?.status, message: v_d5dda0?.message || v_5e9bfe.message };
    }
    return { status: 'error', message: (v_5e9bfe as Error).message };
  }
};

export const v_47cccc = async (
  v_660822,
  v_b9de1d,
  v_c65f5d,
): Promise<{ status: string; code?: number; message?: string; data?: any }> => {
  try {
    const v_9f42a4 = v_7488d5(v_c65f5d);
    const v_3393e3 = await v_9f42a4.post('/cancelGiftishowCoupon', { member: v_660822, tr_id: v_b9de1d });
    return v_3393e3.data;
  } catch (v_5e9bfe) {
    const v_badeaf = v_5e9bfe instanceof v_3333d3
      ? (v_5e9bfe.response?.data as any)?.message || v_5e9bfe.message
      : (v_5e9bfe as Error).message;
    console.error('[기프티쇼] 쿠폰 취소 오류:', v_badeaf);
    if (v_5e9bfe instanceof v_3333d3) {
      return {
        status: 'error',
        code: v_5e9bfe.response?.status,
        message: (v_5e9bfe.response?.data as any)?.message || v_5e9bfe.message,
      };
    }
    return { status: 'error', message: (v_5e9bfe as Error).message };
  }
};

export interface PurchaseXrunItemPrepareData {
  userAddress: string;
  casherAddress: string;
  tokenAddress: string;
  actualPurchaseAmount: number;
  currency: number;
  sku: string;
  title: string;
}
export const v_070bef = async (
  v_660822,
  v_8c0b26,
  v_c65f5d,
): Promise<{ status: string; code: number; message: string; data: PurchaseXrunItemPrepareData[] | null }> => {
  const v_9f42a4 = v_7488d5(v_c65f5d);
  const v_3393e3 = await v_9f42a4.post('/purchaseXrunItemPrepare', { member: v_660822, item: v_8c0b26 });
  return v_3393e3.data;
};

export interface PurchaseGiftPrepareData {
  userAddress: string;
  casherAddress: string;
  tokenAddress: string;
  actualPurchaseAmount: number;
  currency: number;
  goods_code: string;
  goods_name: string;
  brand_name: string;
  image_url: string;
}
export const v_01eada = async (
  v_660822,
  v_bb5572,
  v_c65f5d,
): Promise<{ status: string; code: number; message: string; data: PurchaseGiftPrepareData[] | null }> => {
  const v_9f42a4 = v_7488d5(v_c65f5d);
  const v_3393e3 = await v_9f42a4.post('/purchaseGiftPrepare', { member: v_660822, goods_code: v_bb5572 });
  return v_3393e3.data;
};
export const v_48805f = async (
  v_660822,
  v_bb5572,
  v_3b9397,
  v_359525,
  v_f63e09,
  v_c65f5d,
): Promise<{ status: string; code: number; message: string; data: any }> => {
  const v_9f42a4 = v_7488d5(v_c65f5d);
  const v_3393e3 = await v_9f42a4.post('/purchaseGiftRecord', { member: v_660822, goods_code: v_bb5572, phone_no: v_3b9397, txHash: v_359525, amount: v_f63e09 });
  return v_3393e3.data;
};

export const v_ec4a4a = async (
  v_660822,
  v_bb5572,
  v_c65f5d,
): Promise<{ status: string; code: number; message: string; data: Array<{ pol_tx_hash: string; pol_amount: string }> | null }> => {
  const v_9f42a4 = v_7488d5(v_c65f5d);
  const v_3393e3 = await v_9f42a4.post('/sponsorGas', { member: v_660822, goods_code: v_bb5572 });
  return v_3393e3.data;
};

export const v_324bd9 = async (
  v_660822,
  v_8c0b26,
  v_359525,
  v_f63e09,
  v_c65f5d,
): Promise<{ status: string; code: number; message: string; data: any }> => {
  const v_9f42a4 = v_7488d5(v_c65f5d);
  const v_3393e3 = await v_9f42a4.post('/purchaseXrunItemRecord', { member: v_660822, item: v_8c0b26, txHash: v_359525, amount: v_f63e09 });
  return v_3393e3.data;
};

export const v_9c9f1b = async (
  v_660822,
  v_8c0b26,
  v_f63e09,
  v_c65f5d,
): Promise<v_8321b5> => {
  try {
    const v_9f42a4 = v_7488d5(v_c65f5d);
    const request: v_c27ee5 = {
      member: v_660822,
      item: v_8c0b26,
      amount: v_f63e09.toString(),
    };

    console.log('[상점] XRUN 아이템 구매 요청:', { member: v_660822, item: v_8c0b26, amount: v_f63e09 });

    const v_3393e3 = await v_9f42a4.post<v_8321b5>(
      '/purchaseXrunItem',
      v_576f5a,
    );

    console.log('[상점] XRUN 아이템 구매 성공:', v_3393e3.data.status);

    return v_3393e3.data;
  } catch (v_5e9bfe) {
    console.error('[상점] XRUN 아이템 구매 오류:', v_5e9bfe);
    if (v_5e9bfe instanceof v_3333d3) {
      console.error('[상점] 상세 오류 정보:', {
        url: v_5e9bfe.config?.url,
        method: v_5e9bfe.config?.method,
        status: v_5e9bfe.response?.status,
        statusText: v_5e9bfe.response?.statusText,
        data: v_5e9bfe.response?.data,
        message: v_5e9bfe.message,
      });
    }
    throw v_5e9bfe;
  }
};

export const v_f271f9 = async (
  v_d308b5,
  v_660822,
  v_c65f5d,
): Promise<v_caf66a> => {
  try {
    const v_9f42a4 = v_7488d5(v_c65f5d);
    const request: v_97dbaa = {
      status: v_d308b5,
      member: v_660822,
    };

    console.log('[상점] 구매 로그 저장 요청:', { status: v_d308b5, member: v_660822 });

    const v_3393e3 = await v_9f42a4.post<v_caf66a>(
      '/saveInappPurchaseLog',
      v_576f5a,
    );

    const v_a45293 = v_3393e3.data.data?.[0]?.affectedRows || 0;
    console.log('[상점] 구매 로그 저장 성공:', v_a45293 === 1 ? 'ok' : 'no');

    return v_3393e3.data;
  } catch (v_5e9bfe) {
    console.error('[상점] 구매 로그 저장 오류:', v_5e9bfe);
    if (v_5e9bfe instanceof v_3333d3) {
      console.error('[상점] 상세 오류 정보:', {
        url: v_5e9bfe.config?.url,
        method: v_5e9bfe.config?.method,
        status: v_5e9bfe.response?.status,
        statusText: v_5e9bfe.response?.statusText,
        data: v_5e9bfe.response?.data,
        message: v_5e9bfe.message,
      });
    }
    throw v_5e9bfe;
  }
};

export const v_7b3801 = async (
  v_660822,
  v_dbd01d,
  v_c65f5d,
): Promise<v_dfd755> => {
  try {
    const v_9f42a4 = v_7488d5(v_c65f5d);
    const request: v_036174 = {
      member: v_660822,
      storage: v_dbd01d,
    };

    console.log('[상점] 구매한 아이템 삭제 요청:', { member: v_660822, storage: v_dbd01d });

    const v_f69c4d = [
      '/deleteXrunItem', 
      '/app4000-04-delete', 
      '/app4000-04delete',   
      '/deleteXrunPurchasedItem', 
      '/app4000-delete',     
    ];

    let v_1c274a = null;
    for (const v_09dafd of v_f69c4d) {
      try {
        console.log(`[상점] 삭제 API 엔드포인트 시도: ${v_09dafd}`);
        const v_3393e3 = await v_9f42a4.post<v_dfd755>(
          v_09dafd,
          v_576f5a,
        );

        console.log(`[상점] 엔드포인트 ${v_09dafd} 응답:`, v_3393e3.data);

        if (v_3393e3.data.status === 'success') {
          console.log(`[상점] 삭제 성공 (엔드포인트: ${v_09dafd}):`, v_3393e3.data.status);
          return v_3393e3.data;
        }

        if (v_3393e3.data.status === 'error') {

          if (v_3393e3.data.code === 404) {
            console.log(`[상점] 엔드포인트 ${v_09dafd} 404 에러, 다음 엔드포인트 시도`);
            v_1c274a = v_3393e3.data;
            continue;
          }

          console.log(`[상점] 삭제 실패 (엔드포인트: ${v_09dafd}):`, v_3393e3.data.message);
          return v_3393e3.data;
        }

        v_1c274a = v_3393e3.data;
      } catch (v_5e9bfe) {
        const v_1744b9 = v_5e9bfe?.response?.data?.message || v_5e9bfe?.message || '알 수 없는 오류';
        const v_7a5fef = v_5e9bfe?.response?.data?.code || v_5e9bfe?.response?.status;
        console.log(`[상점] 엔드포인트 ${v_09dafd} 실패:`, v_1744b9);

        if (v_5e9bfe?.response?.status && v_5e9bfe.response.status !== 404) {
          v_1c274a = v_5e9bfe;
          break;
        }

        if (v_7a5fef && v_7a5fef !== 404) {
          v_1c274a = v_5e9bfe;
          break;
        }

        v_1c274a = v_5e9bfe;
      }
    }

    console.error('[상점] 모든 삭제 API 엔드포인트 실패');
    if (v_1c274a) {

      if (v_1c274a.status || v_1c274a.code) {
        throw v_1c274a;
      }

      if (v_1c274a.response) {
        throw v_1c274a;
      }
    }
    throw new Error('삭제 API 엔드포인트를 찾을 수 없습니다.');
  } catch (v_5e9bfe) {
    console.error('[상점] 구매한 아이템 삭제 오류:', v_5e9bfe);
    if (v_5e9bfe instanceof v_3333d3) {
      console.error('[상점] 상세 오류 정보:', {
        url: v_5e9bfe.config?.url,
        method: v_5e9bfe.config?.method,
        status: v_5e9bfe.response?.status,
        statusText: v_5e9bfe.response?.statusText,
        data: v_5e9bfe.response?.data,
        message: v_5e9bfe.message,
      });
    }
    throw v_5e9bfe;
  }
};

export const v_4d25ff = async (
  v_660822,
  v_ad0715 = 7,
  v_c65f5d,
): Promise<v_a37f54> => {
  try {
    const v_9f42a4 = v_7488d5(v_c65f5d);
    const v_cd6a57 = {
      member: v_660822,
      daysbefore: v_ad0715,
    };

    console.log('[지갑] 지갑 데이터 조회 요청:', { member: v_660822, daysbefore: v_ad0715 });

    const v_3393e3 = await v_9f42a4.post<v_a37f54>(
      '/app4000-01-rev-01',
      v_cd6a57,
    );

    console.log('[지갑] 지갑 데이터 조회 성공');

    return v_3393e3.data;
  } catch (v_5e9bfe) {
    console.error('[지갑] 지갑 데이터 조회 오류:', v_5e9bfe);
    if (v_5e9bfe instanceof v_3333d3) {
      console.error('[지갑] 상세 오류 정보:', {
        url: v_5e9bfe.config?.url,
        method: v_5e9bfe.config?.method,
        status: v_5e9bfe.response?.status,
        statusText: v_5e9bfe.response?.statusText,
        data: v_5e9bfe.response?.data,
        message: v_5e9bfe.message,
      });
    }
    throw v_5e9bfe;
  }
};

export const v_04b185 = async (
  v_660822,
  v_c65f5d,
): Promise<v_f32a31[]> => {
  const v_9f42a4 = v_7488d5(v_c65f5d);
  const v_3393e3 = await v_9f42a4.post<{ data?: v_f32a31[] }>(
    '/getWalletRpcBalances',
    { member: v_660822 },
  );
  return v_3393e3.data?.data ?? [];
};

export const v_8ffd12 = async (
  v_660822,
  v_c65f5d,
): Promise<v_0c4879> => {
  try {
    const v_9f42a4 = v_7488d5(v_c65f5d);
    const v_cd6a57 = {
      member: v_660822,
    };

    console.log('[지갑] 다른 체인 상태 조회 요청:', { member: v_660822 });

    const v_3393e3 = await v_9f42a4.post<v_0c4879>(
      '/showOtherChains',
      v_cd6a57,
    );

    console.log('[지갑] 다른 체인 상태 조회 성공');

    return v_3393e3.data;
  } catch (v_5e9bfe) {
    console.error('[지갑] 다른 체인 상태 조회 오류:', v_5e9bfe);
    if (v_5e9bfe instanceof v_3333d3) {
      console.error('[지갑] 상세 오류 정보:', {
        url: v_5e9bfe.config?.url,
        method: v_5e9bfe.config?.method,
        status: v_5e9bfe.response?.status,
        statusText: v_5e9bfe.response?.statusText,
        data: v_5e9bfe.response?.data,
        message: v_5e9bfe.message,
      });
    }
    throw v_5e9bfe;
  }
};

export const v_dcc367 = async (
  v_660822,
  v_c65f5d,
): Promise<v_2a2e24> => {
  try {
    const v_9f42a4 = v_7488d5(v_c65f5d);
    const v_cd6a57 = {
      member: v_660822,
    };

    console.log('[지갑] AD XRUN 배너 데이터 조회 요청:', { member: v_660822 });

    const v_3393e3 = await v_9f42a4.post<v_2a2e24>(
      '/ap4000-adxrun-topbanners',
      v_cd6a57,
    );

    console.log('[지갑] AD XRUN 배너 데이터 조회 성공');

    return v_3393e3.data;
  } catch (v_5e9bfe) {
    console.error('[지갑] AD XRUN 배너 데이터 조회 오류:', v_5e9bfe);
    if (v_5e9bfe instanceof v_3333d3) {
      console.error('[지갑] 상세 오류 정보:', {
        url: v_5e9bfe.config?.url,
        method: v_5e9bfe.config?.method,
        status: v_5e9bfe.response?.status,
        statusText: v_5e9bfe.response?.statusText,
        data: v_5e9bfe.response?.data,
        message: v_5e9bfe.message,
      });
    }
    throw v_5e9bfe;
  }
};

export const v_a88281 = async (
  v_157c04,
  v_1c958d,
  v_a832b3,
  v_c65f5d,
): Promise<v_d86d2d> => {
  try {
    const v_9f42a4 = v_7488d5(v_c65f5d);
    const v_cd6a57 = {
      address: v_157c04,
      contract: v_1c958d,
      currency: v_a832b3,
    };

    console.log('[지갑] 토큰 잔액 조회 요청:', { address: v_157c04, contract: v_1c958d, currency: v_a832b3 });

    const v_3393e3 = await v_9f42a4.post<v_d86d2d>(
      '/refreshBalancesCommon',
      v_cd6a57,
    );

    console.log('[지갑] 토큰 잔액 조회 성공');

    return v_3393e3.data;
  } catch (v_5e9bfe) {
    console.error('[지갑] 토큰 잔액 조회 오류:', v_5e9bfe);
    if (v_5e9bfe instanceof v_3333d3) {
      console.error('[지갑] 상세 오류 정보:', {
        url: v_5e9bfe.config?.url,
        method: v_5e9bfe.config?.method,
        status: v_5e9bfe.response?.status,
        statusText: v_5e9bfe.response?.statusText,
        data: v_5e9bfe.response?.data,
        message: v_5e9bfe.message,
      });
    }
    throw v_5e9bfe;
  }
};

export const v_ce7f8e = async (
  v_660822,
  v_2365e9 = 1,
  v_c65f5d,
): Promise<v_034a95> => {
  try {
    const v_9f42a4 = v_7488d5(v_c65f5d);
    const v_cd6a57 = {
      member: v_660822,
      page: v_2365e9,
    };

    console.log('[AD XRUN] 심사중 리스트 조회 요청:', { member: v_660822, page: v_2365e9 });

    const v_3393e3 = await v_9f42a4.post<v_034a95>(
      '/ap4000-adxrun-estimatelist',
      v_cd6a57,
    );

    console.log('[AD XRUN] 심사중 리스트 조회 성공');

    return v_3393e3.data;
  } catch (v_5e9bfe) {
    console.error('[AD XRUN] 심사중 리스트 조회 오류:', v_5e9bfe);
    if (v_5e9bfe instanceof v_3333d3) {
      console.error('[AD XRUN] 상세 오류 정보:', {
        url: v_5e9bfe.config?.url,
        method: v_5e9bfe.config?.method,
        status: v_5e9bfe.response?.status,
        statusText: v_5e9bfe.response?.statusText,
        data: v_5e9bfe.response?.data,
        message: v_5e9bfe.message,
      });
    }
    throw v_5e9bfe;
  }
};

export const v_2e777a = async (
  v_660822,
  v_2365e9 = 1,
  v_c65f5d,
): Promise<v_5c2ee1> => {
  try {
    const v_9f42a4 = v_7488d5(v_c65f5d);
    const v_cd6a57 = {
      member: v_660822,
      page: v_2365e9,
    };

    console.log('[AD XRUN] 정산완료 리스트 조회 요청:', { member: v_660822, page: v_2365e9 });

    const v_3393e3 = await v_9f42a4.post<v_5c2ee1>(
      '/ap4000-adxrun-resultlist',
      v_cd6a57,
    );

    console.log('[AD XRUN] 정산완료 리스트 조회 성공');

    return v_3393e3.data;
  } catch (v_5e9bfe) {
    console.error('[AD XRUN] 정산완료 리스트 조회 오류:', v_5e9bfe);
    if (v_5e9bfe instanceof v_3333d3) {
      console.error('[AD XRUN] 상세 오류 정보:', {
        url: v_5e9bfe.config?.url,
        method: v_5e9bfe.config?.method,
        status: v_5e9bfe.response?.status,
        statusText: v_5e9bfe.response?.statusText,
        data: v_5e9bfe.response?.data,
        message: v_5e9bfe.message,
      });
    }
    throw v_5e9bfe;
  }
};

export const v_fe6b99 = async (
  v_660822,
  v_c65f5d,
): Promise<v_ca4b36> => {
  try {
    const v_9f42a4 = v_7488d5(v_c65f5d);
    const v_cd6a57 = {
      member: v_660822,
    };

    console.log('[AD XRUN] 정산완료 배너 데이터 조회 요청:', { member: v_660822 });

    const v_3393e3 = await v_9f42a4.post<v_ca4b36>(
      '/ap4000-adxrun-topbannersSattled',
      v_cd6a57,
    );

    console.log('[AD XRUN] 정산완료 배너 데이터 조회 성공');

    return v_3393e3.data;
  } catch (v_5e9bfe) {
    console.error('[AD XRUN] 정산완료 배너 데이터 조회 오류:', v_5e9bfe);
    if (v_5e9bfe instanceof v_3333d3) {
      console.error('[AD XRUN] 상세 오류 정보:', {
        url: v_5e9bfe.config?.url,
        method: v_5e9bfe.config?.method,
        status: v_5e9bfe.response?.status,
        statusText: v_5e9bfe.response?.statusText,
        data: v_5e9bfe.response?.data,
        message: v_5e9bfe.message,
      });
    }
    throw v_5e9bfe;
  }
};

export const v_c1fabf = async (
  v_660822,
  v_c65f5d,
): Promise<v_bae79a> => {
  try {
    const v_9f42a4 = v_7488d5(v_c65f5d);

    const v_f71b56 = v_660822 ? `/Quests/list?member=${v_660822}` : '/Quests/list';

    console.log('[Quest] 퀘스트 리스트 조회 요청', v_660822 ? `(member: ${v_660822})` : '');

    const v_3393e3 = await v_9f42a4.get<v_bae79a>(v_f71b56);

    console.log('[Quest] 퀘스트 리스트 조회 성공:', v_3393e3.data.data?.length || 0, '개');

    const v_dbcc12 = v_3393e3.data.data?.find(
      (v_8c0b26) => v_8c0b26.id === 1 || v_8c0b26.id === '1'
    );
    if (v_dbcc12) {
      console.log('[Quest] 출석체크 보상 금액 (서버 응답):', {
        id: v_dbcc12.id,
        title: v_dbcc12.title,
        reward_amount: v_dbcc12.reward_amount,
        reward_amount_asxrun: v_dbcc12.reward_amount_asxrun,
        reward_amount_asxrun_type: typeof v_dbcc12.reward_amount_asxrun,
      });
    }

    return v_3393e3.data;
  } catch (v_5e9bfe) {
    console.error('[Quest] 퀘스트 리스트 조회 오류:', v_5e9bfe);
    if (v_5e9bfe instanceof v_3333d3) {
      console.error('[Quest] 상세 오류 정보:', {
        url: v_5e9bfe.config?.url,
        method: v_5e9bfe.config?.method,
        status: v_5e9bfe.response?.status,
        statusText: v_5e9bfe.response?.statusText,
        data: v_5e9bfe.response?.data,
        message: v_5e9bfe.message,
      });
    }
    throw v_5e9bfe;
  }
};

export const v_345245 = async (
  v_660822,
  v_c65f5d,
): Promise<v_f05488> => {
  try {
    const v_9f42a4 = v_7488d5(v_c65f5d);
    const request: v_7ed601 = { member: v_660822 };

    console.log('[Quest] 출석 체크 조회 요청:', v_576f5a);

    let v_3393e3;
    try {
      v_3393e3 = await v_9f42a4.post<v_f05488>(
        '/Quests/checkuser',
        v_576f5a,
      );
      console.log('[Quest] 출석 체크 조회 성공 (/Quests/checkuser):', v_3393e3.data);
    } catch (v_5e9bfe) {

      console.log('[Quest] /Quests/checkuser 실패, /quest/checkuser 시도');
      v_3393e3 = await v_9f42a4.post<v_f05488>(
        '/quest/checkuser',
        v_576f5a,
      );
      console.log('[Quest] 출석 체크 조회 성공 (/quest/checkuser):', v_3393e3.data);
    }

    return v_3393e3.data;
  } catch (v_5e9bfe) {
    console.error('[Quest] 출석 체크 조회 오류:', v_5e9bfe);
    if (v_5e9bfe instanceof v_3333d3) {
      console.error('[Quest] 상세 오류 정보:', {
        url: v_5e9bfe.config?.url,
        method: v_5e9bfe.config?.method,
        status: v_5e9bfe.response?.status,
        statusText: v_5e9bfe.response?.statusText,
        data: v_5e9bfe.response?.data,
        message: v_5e9bfe.message,
      });
    }
    throw v_5e9bfe;
  }
};

export const v_1b8181 = async (
  request: v_8093a2,
  v_c65f5d,
): Promise<v_30f990> => {
  try {
    const v_9f42a4 = v_7488d5(v_c65f5d);

    console.log('[Quest] 퀘스트 참여 요청:', v_576f5a);

    let v_3393e3;
    try {
      v_3393e3 = await v_9f42a4.post<v_30f990>(
        '/Quests/join',
        v_576f5a,
      );
      console.log('[Quest] 퀘스트 참여 성공 (/Quests/join):', v_3393e3.data);
    } catch (v_5e9bfe) {

      console.log('[Quest] /Quests/join 실패, /quest/join 시도');
      v_3393e3 = await v_9f42a4.post<v_30f990>(
        '/quest/join',
        v_576f5a,
      );
      console.log('[Quest] 퀘스트 참여 성공 (/quest/join):', v_3393e3.data);
    }

    return v_3393e3.data;
  } catch (v_5e9bfe) {
    console.error('[Quest] 퀘스트 참여 오류:', v_5e9bfe);
    if (v_5e9bfe instanceof v_3333d3) {
      console.error('[Quest] 상세 오류 정보:', {
        url: v_5e9bfe.config?.url,
        method: v_5e9bfe.config?.method,
        status: v_5e9bfe.response?.status,
        statusText: v_5e9bfe.response?.statusText,
        data: v_5e9bfe.response?.data,
        message: v_5e9bfe.message,
      });
    }
    throw v_5e9bfe;
  }
};

export const v_cf99e2 = async (
  v_1c958d,
  v_a832b3,
  v_c65f5d,
): Promise<v_4aa24d> => {
  try {
    const v_9f42a4 = v_7488d5(v_c65f5d);
    const v_cd6a57 = {
      contract: v_1c958d,
      currency: v_a832b3,
    };

    console.log('[지갑] ERC20 토큰 검증 요청:', { contract: v_1c958d, currency: v_a832b3 });

    const v_3393e3 = await v_9f42a4.post<v_4aa24d>(
      '/checkERC20Token',
      v_cd6a57,
    );

    console.log('[지갑] ERC20 토큰 검증 성공');

    return v_3393e3.data;
  } catch (v_5e9bfe) {
    console.error('[지갑] ERC20 토큰 검증 오류:', v_5e9bfe);
    if (v_5e9bfe instanceof v_3333d3) {
      console.error('[지갑] 상세 오류 정보:', {
        url: v_5e9bfe.config?.url,
        method: v_5e9bfe.config?.method,
        status: v_5e9bfe.response?.status,
        statusText: v_5e9bfe.response?.statusText,
        data: v_5e9bfe.response?.data,
        message: v_5e9bfe.message,
      });
    }
    throw v_5e9bfe;
  }
};

export const v_3ff307 = async (
  v_660822,
  v_a832b3,
  v_ad0715 = 7,
  v_9b860a = 0,
  v_c65f5d,
): Promise<v_86c24d> => {
  try {
    const v_9f42a4 = v_7488d5(v_c65f5d);
    const v_cd6a57 = {
      member: v_660822,
      currency: v_a832b3,
      daysbefore: v_ad0715,
      startwith: v_9b860a,
    };

    console.log('[트랜잭션] 전체 히스토리 조회 요청:', { member: v_660822, currency: v_a832b3, daysbefore: v_ad0715, startwith: v_9b860a });

    const v_3393e3 = await v_9f42a4.post<v_86c24d>(
      '/app4200-05',
      v_cd6a57,
    );

    console.log('[트랜잭션] 전체 히스토리 조회 성공');

    return v_3393e3.data;
  } catch (v_5e9bfe) {
    console.error('[트랜잭션] 전체 히스토리 조회 오류:', v_5e9bfe);
    if (v_5e9bfe instanceof v_3333d3) {
      console.error('[트랜잭션] 상세 오류 정보:', {
        url: v_5e9bfe.config?.url,
        method: v_5e9bfe.config?.method,
        status: v_5e9bfe.response?.status,
        statusText: v_5e9bfe.response?.statusText,
        data: v_5e9bfe.response?.data,
        message: v_5e9bfe.message,
      });
    }
    throw v_5e9bfe;
  }
};

export const v_c87170 = async (
  v_660822,
  v_a832b3,
  v_ad0715 = 7,
  v_9b860a = 0,
  v_c65f5d,
): Promise<v_86c24d> => {
  try {
    const v_9f42a4 = v_7488d5(v_c65f5d);
    const v_cd6a57 = {
      member: v_660822,
      currency: v_a832b3,
      daysbefore: v_ad0715,
      startwith: v_9b860a,
    };

    console.log('[트랜잭션] 전송 히스토리 조회 요청:', { member: v_660822, currency: v_a832b3, daysbefore: v_ad0715, startwith: v_9b860a });

    const v_3393e3 = await v_9f42a4.post<v_86c24d>(
      '/app4200-06',
      v_cd6a57,
    );

    console.log('[트랜잭션] 전송 히스토리 조회 성공');

    return v_3393e3.data;
  } catch (v_5e9bfe) {
    console.error('[트랜잭션] 전송 히스토리 조회 오류:', v_5e9bfe);
    if (v_5e9bfe instanceof v_3333d3) {
      console.error('[트랜잭션] 상세 오류 정보:', {
        url: v_5e9bfe.config?.url,
        method: v_5e9bfe.config?.method,
        status: v_5e9bfe.response?.status,
        statusText: v_5e9bfe.response?.statusText,
        data: v_5e9bfe.response?.data,
        message: v_5e9bfe.message,
      });
    }
    throw v_5e9bfe;
  }
};

export const v_f730b0 = async (
  v_660822,
  v_a832b3,
  v_ad0715 = 7,
  v_9b860a = 0,
  v_c65f5d,
): Promise<v_86c24d> => {
  try {
    const v_9f42a4 = v_7488d5(v_c65f5d);
    const v_cd6a57 = {
      member: v_660822,
      currency: v_a832b3,
      daysbefore: v_ad0715,
      startwith: v_9b860a,
    };

    console.log('[트랜잭션] 수신 상세 조회 요청:', { member: v_660822, currency: v_a832b3, daysbefore: v_ad0715, startwith: v_9b860a });

    const v_3393e3 = await v_9f42a4.post<v_86c24d>(
      '/app4200-01',
      v_cd6a57,
    );

    console.log('[트랜잭션] 수신 상세 조회 성공');

    return v_3393e3.data;
  } catch (v_5e9bfe) {
    console.error('[트랜잭션] 수신 상세 조회 오류:', v_5e9bfe);
    if (v_5e9bfe instanceof v_3333d3) {
      console.error('[트랜잭션] 상세 오류 정보:', {
        url: v_5e9bfe.config?.url,
        method: v_5e9bfe.config?.method,
        status: v_5e9bfe.response?.status,
        statusText: v_5e9bfe.response?.statusText,
        data: v_5e9bfe.response?.data,
        message: v_5e9bfe.message,
      });
    }
    throw v_5e9bfe;
  }
};

export const v_629c7b = async (
  v_660822,
  v_a832b3,
  v_ad0715 = 7,
  v_9b860a = 0,
  v_c65f5d,
): Promise<v_86c24d> => {
  try {
    const v_9f42a4 = v_7488d5(v_c65f5d);
    const v_cd6a57 = {
      member: v_660822,
      currency: v_a832b3,
      daysbefore: v_ad0715,
      startwith: v_9b860a,
    };

    console.log('[트랜잭션] 전환 히스토리 조회 요청:', { member: v_660822, currency: v_a832b3, daysbefore: v_ad0715, startwith: v_9b860a });

    const v_3393e3 = await v_9f42a4.post<v_86c24d>(
      '/app4200-03',
      v_cd6a57,
    );

    console.log('[트랜잭션] 전환 히스토리 조회 성공');

    return v_3393e3.data;
  } catch (v_5e9bfe) {
    console.error('[트랜잭션] 전환 히스토리 조회 오류:', v_5e9bfe);
    if (v_5e9bfe instanceof v_3333d3) {
      console.error('[트랜잭션] 상세 오류 정보:', {
        url: v_5e9bfe.config?.url,
        method: v_5e9bfe.config?.method,
        status: v_5e9bfe.response?.status,
        statusText: v_5e9bfe.response?.statusText,
        data: v_5e9bfe.response?.data,
        message: v_5e9bfe.message,
      });
    }
    throw v_5e9bfe;
  }
};

export const v_69bcd0 = async (
  v_660822,
  v_a832b3,
  v_2365e9 = 1,
  v_3bbadf = 20,
  v_c65f5d,
): Promise<any> => {
  try {
    const v_9f42a4 = v_7488d5(v_c65f5d);
    const v_cd6a57 = {
      member: String(v_660822),
      currency: v_a832b3,
      page: v_2365e9,
      offset: v_3bbadf,
    };

    console.log('[트랜잭션] Etherscan 거래내역 조회 요청:', v_cd6a57);

    const v_3393e3 = await v_9f42a4.post<any>(
      '/etherscan-transactions',
      v_cd6a57,
    );

    console.log('[트랜잭션] Etherscan 거래내역 조회 성공');

    const v_383106 = v_3393e3.headers?.['x-cache'] ?? v_3393e3.headers?.['X-Cache'];
    return { ...v_3393e3.data, __xCache: v_383106 };
  } catch (v_5e9bfe) {
    console.error('[트랜잭션] Etherscan 거래내역 조회 오류:', v_5e9bfe);
    if (v_5e9bfe instanceof v_3333d3) {
      console.error('[트랜잭션] 상세 오류 정보:', {
        url: v_5e9bfe.config?.url,
        method: v_5e9bfe.config?.method,
        status: v_5e9bfe.response?.status,
        statusText: v_5e9bfe.response?.statusText,
        data: v_5e9bfe.response?.data,
        message: v_5e9bfe.message,
      });
    }
    throw v_5e9bfe;
  }
};

export const v_927baf = async (
  v_231c19,
  v_0d793b,
  v_f63e09,
  v_21cc31,
  v_a832b3,
  v_74efc1 = 'ETH',
  v_bcd61d = 1,
  v_039314 = 2,
  v_c65f5d,
): Promise<any> => {
  try {
    const v_c9c489 = v_e4a763();
    const v_36dd9e = v_c9c489.GATEWAY_AUTH_CODE;

    const v_4d33b2 = {
      from: v_231c19,
      to: v_0d793b,
      amount: v_f63e09,
      token: v_21cc31,
      currency: v_a832b3,
      network: v_74efc1,
      chainId: v_bcd61d,
      priorityGasTracker: v_039314,
    };

    console.log('[가스 수수료 예상] API 요청:', v_4d33b2);

    const v_3393e3 = await v_12a388('/gasEstimated', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${v_36dd9e}`,
      },
      body: JSON.stringify(v_4d33b2),
    }, v_c65f5d);

    if (!v_3393e3.ok) {
      throw new Error(`HTTP error! status: ${v_3393e3.status}`);
    }

    const v_43c42e = await v_3393e3.json();
    console.log('[가스 수수료 예상] API 응답:', v_43c42e);

    return v_43c42e;
  } catch (v_5e9bfe) {
    console.error('[가스 수수료 예상] API 호출 실패:', v_5e9bfe);
    if (v_c65f5d) {
      await v_e4d665(v_c65f5d);
    }
    throw v_5e9bfe;
  }
};

export const v_76d832 = async (
  v_231c19,
  v_0d793b,
  v_f63e09,
  v_660822,
  v_74efc1,
  v_a832b3,
  v_bcd61d,
  v_c65f5d,
): Promise<any> => {
  try {
    const v_c9c489 = v_e4a763();
    const v_36dd9e = v_c9c489.GATEWAY_AUTH_CODE;

    const v_4d33b2 = {
      from: v_231c19,
      to: v_0d793b,
      amount: v_f63e09,
      member: v_660822,
      network: v_74efc1,
      currency: v_a832b3,
      chainId: v_bcd61d,
    };

    console.log('[블록체인 전송] API 요청:', v_4d33b2);

    const v_3393e3 = await v_12a388('/postTransferNew', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${v_36dd9e}`,
      },
      body: JSON.stringify(v_4d33b2),
    }, v_c65f5d);

    if (!v_3393e3.ok) {
      throw new Error(`HTTP error! status: ${v_3393e3.status}`);
    }

    const v_43c42e = await v_3393e3.json();
    console.log('[블록체인 전송] API 응답:', v_43c42e);

    return v_43c42e;
  } catch (v_5e9bfe) {
    console.error('[블록체인 전송] API 호출 실패:', v_5e9bfe);
    if (v_c65f5d) {
      await v_e4d665(v_c65f5d);
    }
    throw v_5e9bfe;
  }
};

export const v_143c62 = async (
  v_660822,
  v_c65f5d,
): Promise<any> => {
  try {
    const v_c9c489 = v_e4a763();
    const v_36dd9e = v_c9c489.GATEWAY_AUTH_CODE;

    const v_4d33b2 = {
      member: v_660822,
    };

    console.log('[지갑] 프라이빗키 조회 요청:', v_4d33b2);

    const v_3393e3 = await v_12a388('/getWalletPrivateKey', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${v_36dd9e}`,
      },
      body: JSON.stringify(v_4d33b2),
    }, v_c65f5d);

    if (!v_3393e3.ok) {
      throw new Error(`HTTP error! status: ${v_3393e3.status}`);
    }

    const v_43c42e = await v_3393e3.json();
    console.log('[지갑] 프라이빗키 조회 응답:', v_43c42e);

    return v_43c42e;
  } catch (v_5e9bfe) {
    console.error('[지갑] 프라이빗키 조회 실패:', v_5e9bfe);
    if (v_c65f5d) {
      await v_e4d665(v_c65f5d);
    }
    throw v_5e9bfe;
  }
};

export const v_4dba02 = async (
  v_4898e2,
  v_05bb19,
  v_c65f5d,
): Promise<string> => {
  const v_74cb95 = {
    service: 1,
    location: 2,
    personal: 3,
  };
  const v_8adf57 = v_74cb95[v_4898e2];

  try {
    const v_c87c7a = v_05bb19 ? `&language=${encodeURIComponent(v_05bb19)}` : '';
    const v_eb792a = await fetch(`https://oth-path-f0013c.example.invalid/agreements?type=${v_8adf57}${v_c87c7a}`);
    const v_9390e8 = await v_eb792a.json() as any;

    if (v_9390e8.code !== 200 || !v_9390e8.data?.content) {
      throw new Error('약관 데이터를 가져올 수 없습니다.');
    }

    return v_9390e8.data.content;
  } catch (v_5e9bfe) {
    console.error('[약관] 약관 내용 로드 실패:', v_5e9bfe);
    throw v_5e9bfe;
  }
};

export const v_519669 = async (
  v_3b27d9,
  v_c65f5d,
): Promise<v_250fc3> => {
  const v_74cb95 = {
    service: 1,
    location: 2,
    personal: 3,
  };

  try {

    const v_9c213b = require('zqqvxke').default || require('zqqvxke');
    const v_5254bf = (v_9c213b?.language as string | undefined) || 'ko';
    const v_653390 = v_3b27d9 ? v_74cb95[v_3b27d9] : 1;
    const v_f71b56 = `https://oth-path-f0013c.example.invalid/agreements?type=${v_653390}&language=${encodeURIComponent(v_5254bf)}`;
    console.log('[약관] 요청 URL:', v_f71b56);
    const v_eb792a = await fetch(v_f71b56);
    const v_9390e8 = await v_eb792a.json() as any;

    return {
      success: v_9390e8.code === 200,
      data: v_9390e8.data,
    } as v_250fc3;
  } catch (v_5e9bfe) {
    console.error('[약관] 약관 데이터 로드 실패:', v_5e9bfe);
    throw v_5e9bfe;
  }
};

export const v_724f1d = async (
  v_c65f5d,
): Promise<v_250fc3> => {
  return v_519669(undefined, v_c65f5d);
};

const v_332c06 = 'topAd5Data';
const v_b5dcce = 'topAd5Timestamp';
const v_69b0b7 = 'nextAdsData'; 
const v_887583 = 10 * 60 * 1000; 

const v_b4b8e7 = new Set<string>(['2151261']);

const v_bd0f81 = (v_aa0917): boolean => {
  if (!v_aa0917) return false;
  return v_b4b8e7.has(String(v_aa0917));
};

const v_60f584 = (v_04f49c): any[] => {
  if (!Array.isArray(v_04f49c)) return [];
  return v_04f49c.filter((v_ddcfed) => !v_bd0f81(v_ddcfed?.campid));
};

let v_5281af = false;
let v_21e89f = null;

export const v_e0bb32 = async (): Promise<void> => {
  try {
    const v_90e1d7 = await v_e84827.getItem('cached_AD');
    if (v_90e1d7) {
      const v_4fc87f = JSON.parse(v_90e1d7);
      const v_aeaa6e = Object.keys(v_4fc87f).length;

      const v_b793b5 = {};
      for (const [v_aa0917, v_9390e8] of Object.entries(v_4fc87f)) {
        if (!v_bd0f81(v_aa0917)) {
          v_b793b5[v_aa0917] = v_9390e8;
        }
      }

      if (Object.keys(v_b793b5).length !== v_aeaa6e) {
        await v_e84827.setItem('cached_AD', JSON.stringify(v_b793b5));
        console.log(`[filterBlocklistedAdsFromCache] 블록리스트 필터링: ${Object.keys(v_b793b5).length}/${v_aeaa6e}개 유효`);
      }
    }
  } catch (v_5e9bfe) {
    console.error('[filterBlocklistedAdsFromCache] 필터링 실패:', v_5e9bfe);
  }
};

export const v_18b723 = async (v_aa0917): Promise<void> => {
  const v_92fecf = String(v_aa0917);
  try {

    const v_90e1d7 = await v_e84827.getItem('cached_AD');
    if (v_90e1d7) {
      const v_4fc87f = JSON.parse(v_90e1d7);
      if (v_4fc87f[v_92fecf]) {
        delete v_4fc87f[v_92fecf];
        await v_e84827.setItem('cached_AD', JSON.stringify(v_4fc87f));
        console.log(`[removeBlocklistedCampaignFromCache] cached_AD에서 제거: ${v_92fecf}`);
      }
    }

    await v_8cba1e(v_92fecf, undefined); 
  } catch (v_5e9bfe) {
    console.error(`[removeBlocklistedCampaignFromCache] ${v_92fecf} 제거 실패:`, v_5e9bfe);
  }
};

export const v_8cba1e = async (v_aa0917, v_e7e852): Promise<void> => {

  try {
    const v_92fecf = String(v_aa0917);

    const v_fe7102 = await v_e84827.getItem(v_332c06);
    let v_4cf0ad = []
    let v_ae1fa0 = false
    if (v_fe7102) {
      const v_8decf8 = JSON.parse(v_fe7102);
      if (Array.isArray(v_8decf8)) {
        const v_e98932 = v_8decf8.length
        v_4cf0ad = v_8decf8.filter((v_ddcfed) => String(v_ddcfed.campid || '') !== v_92fecf);
        v_ae1fa0 = v_4cf0ad.length !== v_e98932
      }
    }

    if (!v_ae1fa0) {
      console.log(`[removeAdFromTopAd5] ${v_92fecf} — 이미 제거됨, 큐 차감 skip (중복 호출 방지)`)
      return
    }

    let v_79f0be = false
    const v_405e5f = await v_e84827.getItem(v_69b0b7)
    if (v_405e5f) {
      try {
        const v_17d86b = JSON.parse(v_405e5f)
        if (Array.isArray(v_17d86b) && v_17d86b.length > 0) {

          const v_8f199d = new Set(v_4cf0ad.map((v_779914) => String(v_779914.campid || '')))
          v_8f199d.add(v_92fecf)
          const v_faafe6 = v_17d86b.findIndex((v_779914) => !v_8f199d.has(String(v_779914.campid || '')))
          if (v_faafe6 >= 0) {
            const v_4a36a4 = v_17d86b.splice(v_faafe6, 1)[0]
            v_4cf0ad.push(v_4a36a4)
            await v_e84827.setItem(v_69b0b7, JSON.stringify(v_17d86b))
            console.log(`[removeAdFromTopAd5] ${v_92fecf} 제거, nextAds 큐에서 보충: ${v_4a36a4.campid} (큐 ${v_17d86b.length}개 남음)`)
            v_79f0be = true
          }
        }
      } catch (v_9e86fd) {
        console.warn(`[removeAdFromTopAd5] nextAds 파싱 실패:`, v_9e86fd?.message)
      }
    }
    if (!v_79f0be) {
      console.log(`[removeAdFromTopAd5] ${v_92fecf} 제거 (큐 비어있어 보충 X — 10분 갱신 대기)`)
    }

    await v_e84827.setItem(v_332c06, JSON.stringify(v_4cf0ad));
  } catch (v_5e9bfe) {
    console.error(`[removeAdFromTopAd5] ${v_aa0917} 처리 실패:`, v_5e9bfe);
  }
};

const v_3398a2 = 'completedAdsCache';
const v_8da311 = 'completedAdsCacheTimestamp';
const v_354e72 = 5 * 60 * 1000; 
const v_614136 = 1000; 

export const v_318c45 = async (v_660822, v_c65f5d, v_9d6a91 = false): Promise<Set<string>> => {
  try {
    const v_90772d = typeof v_660822 === 'string' ? parseInt(v_660822, 10) : v_660822;

    if (!v_9d6a91) {
      try {
        const v_dc1309 = await v_e84827.getItem(v_8da311);
        if (v_dc1309) {
          const v_42044e = parseInt(v_dc1309, 10);
          const v_5c2f9f = Date.now();
          const v_e56026 = v_5c2f9f - v_42044e;

          if (v_e56026 < v_354e72) {
            const v_c06630 = await v_e84827.getItem(v_3398a2);
            if (v_c06630) {
              const v_e2a6a6 = JSON.parse(v_c06630);
              console.log(`[getCompletedAdsSet] 캐시 사용 (${Math.floor(v_e56026 / 1000)}초 전 저장)`);
              return new Set(v_e2a6a6);
            }
          }
        }
      } catch (v_2bf859) {
        console.warn('[getCompletedAdsSet] 캐시 확인 실패, API 호출:', v_2bf859);
      }
    } else {
      console.log('[getCompletedAdsSet] 강제 새로고침 - 캐시 무시');
    }

    const v_628e93 = await v_f4cc2d(v_90772d, v_c65f5d);
    const v_905ecb = new Set<string>();

    if (v_628e93?.data && Array.isArray(v_628e93.data)) {
      v_628e93.data.forEach((v_ddcfed) => {

        const v_d207da = String(v_ddcfed.transaction || '');
        const v_b4efc9 = String(v_ddcfed.extracode || '');
        const v_c1f9bb = String(v_ddcfed.title || '');

        if (v_d207da && /^\d+$/.test(v_d207da)) {
          v_905ecb.add(v_d207da);
        }
        if (v_b4efc9 && /^\d+$/.test(v_b4efc9)) {
          v_905ecb.add(v_b4efc9);
        }
      });

      try {
        const v_3c955d = Array.from(v_905ecb);

        const v_f7f94d = v_3c955d.length > v_614136
          ? v_3c955d.slice(-v_614136) 
          : v_3c955d;

        await v_e84827.setItem(v_3398a2, JSON.stringify(v_f7f94d));
        await v_e84827.setItem(v_8da311, Date.now().toString());
        console.log(`[getCompletedAdsSet] 캐시 저장 완료: ${v_f7f94d.length}개${v_3c955d.length > v_614136 ? ` (${v_3c955d.length - v_614136}개 제거됨)` : ''}`);
      } catch (v_2bf859) {
        console.warn('[getCompletedAdsSet] 캐시 저장 실패:', v_2bf859);

        if (v_2bf859 instanceof Error && v_2bf859.message.includes('exceeds')) {
          try {
            console.log('[getCompletedAdsSet] 캐시 용량 초과 감지 - 캐시 초기화');
            await v_e84827.removeItem(v_3398a2);
            await v_e84827.removeItem(v_8da311);

            const v_f7f94d = Array.from(v_905ecb).slice(-Math.floor(v_614136 / 2));
            await v_e84827.setItem(v_3398a2, JSON.stringify(v_f7f94d));
            await v_e84827.setItem(v_8da311, Date.now().toString());
            console.log(`[getCompletedAdsSet] 캐시 초기화 후 저장 완료: ${v_f7f94d.length}개`);
          } catch (v_16229f) {
            console.error('[getCompletedAdsSet] 캐시 초기화 실패:', v_16229f);
          }
        }
      }
    }

    return v_905ecb;
  } catch (v_5e9bfe) {
    console.error('[getCompletedAdsSet] 완료된 광고 목록 조회 실패:', v_5e9bfe);

    return new Set<string>();
  }
};

export const v_5e0191 = async (v_aa0917): Promise<void> => {
  try {
    const v_c06630 = await v_e84827.getItem(v_3398a2);
    let v_e2a6a6 = v_c06630 ? JSON.parse(v_c06630) : [];

    if (v_e2a6a6.includes(v_aa0917)) {
      return;
    }

    v_e2a6a6.push(v_aa0917);

    if (v_e2a6a6.length > v_614136) {
      const v_158159 = v_e2a6a6.length - v_614136;
      v_e2a6a6 = v_e2a6a6.slice(v_158159); 
      console.log(`[addToCompletedAdsCache] 크기 제한 초과 - ${v_158159}개 오래된 항목 제거`);
    }

    await v_e84827.setItem(v_3398a2, JSON.stringify(v_e2a6a6));
    await v_e84827.setItem(v_8da311, Date.now().toString());
    console.log(`[addToCompletedAdsCache] completedAdsCache에 추가: ${v_aa0917} (총 ${v_e2a6a6.length}개)`);
  } catch (v_2bf859) {
    console.warn('[addToCompletedAdsCache] completedAdsCache 업데이트 실패:', v_2bf859);

    if (v_2bf859 instanceof Error && v_2bf859.message.includes('exceeds')) {
      try {
        console.log('[addToCompletedAdsCache] 캐시 용량 초과 감지 - 캐시 초기화');
        await v_e84827.removeItem(v_3398a2);
        await v_e84827.removeItem(v_8da311);

        await v_e84827.setItem(v_3398a2, JSON.stringify([v_aa0917]));
        await v_e84827.setItem(v_8da311, Date.now().toString());
        console.log('[addToCompletedAdsCache] 캐시 초기화 후 새로 추가 완료');
      } catch (v_16229f) {
        console.error('[addToCompletedAdsCache] 캐시 초기화 실패:', v_16229f);
      }
    }
  }
};

export const v_563153 = async (v_c65f5d, v_9d6a91 = false, v_751f24 = false): Promise<any> => {

  if (v_5281af && v_21e89f) {
    console.log('[getTopAd5] 이미 호출 중입니다. 기존 Promise 반환');
    return v_21e89f;
  }

  try {

    if (!v_9d6a91) {
      const v_fe7102 = await v_5d7ca4();
      if (v_fe7102 && v_fe7102.length > 0) {
        try {
          const v_dc1309 = await v_e84827.getItem(v_b5dcce);
          if (v_dc1309) {
            const v_42044e = parseInt(v_dc1309, 10);
            const v_5c2f9f = Date.now();
            const v_e56026 = v_5c2f9f - v_42044e;

            if (v_e56026 < v_887583) {
              console.log(`[getTopAd5] 캐시 사용 (${Math.floor(v_e56026 / 1000)}초 전 저장, ${Math.floor((v_887583 - v_e56026) / 1000)}초 남음)`);
              return v_fe7102;
            } else {

              console.log(`[getTopAd5] 캐시 만료 but 즉시 반환 (${Math.floor(v_e56026 / 1000)}초 경과) → 백그라운드 갱신`);

              setTimeout(() => { v_563153(v_c65f5d, true, false).catch(() => {}); }, 100);
              return v_fe7102;
            }
          }
        } catch (v_e6e506) {
          console.log('[getTopAd5] timestamp 확인 실패, API 호출 진행:', v_e6e506);
        }
      } else {

        try {
          const v_405e5f = await v_e84827.getItem(v_69b0b7);
          if (v_405e5f) {
            const v_17d86b = JSON.parse(v_405e5f);
            if (Array.isArray(v_17d86b) && v_17d86b.length > 0) {

              const v_5c17ee = v_17d86b.slice(0, 5);
              const v_caaab2 = v_17d86b.slice(5);

              await v_e84827.setItem(v_332c06, JSON.stringify(v_5c17ee));
              await v_e84827.setItem(v_b5dcce, Date.now().toString());

              if (v_caaab2.length > 0) {
                await v_e84827.setItem(v_69b0b7, JSON.stringify(v_caaab2));
              } else {
                await v_e84827.removeItem(v_69b0b7);
              }

              console.log(`[getTopAd5] nextAds에서 ${v_5c17ee.length}개 사용, ${v_caaab2.length}개 남음`);
              return v_5c17ee;
            }
          }
        } catch (v_44ab20) {
          console.log('[getTopAd5] nextAds 확인 실패, API 호출 진행:', v_44ab20);
        }
      }
    } else {
      console.log('[getTopAd5] 강제 새로고침 모드 - API 호출');
    }

    if (v_5281af && v_21e89f) {
      console.log('[getTopAd5] 캐시 확인 중 다른 호출이 시작되었습니다. 기존 Promise 반환');
      return v_21e89f;
    }

    v_5281af = true;
    const v_53a95f = (async () => {
      const v_e16099 = v_326be8.OS === 'ios' ? 'ios' : 'android';

      let v_660822 = '';
      try {
        const v_ef7306 = await v_e84827.getItem('userData');
        if (v_ef7306) {
          const v_ff39bc = JSON.parse(v_ef7306);
          v_660822 = v_ff39bc?.member || '';
        }
      } catch (v_7f5774) {
        console.log('[getTopAd5] userData 가져오기 실패:', v_7f5774);
      }

      let v_e7f87b = {};
      try {
        const { collectDeviceInfo: v_f3de6d } = require('../utils/napApiUtils');
        v_e7f87b = await v_f3de6d();
      } catch (v_b7d530) {
        console.log('[getTopAd5] 디바이스 정보 수집 실패:', v_b7d530);
      }

      const v_cd6a57 = {
        os: v_e16099,
        member: v_660822,
        ...v_e7f87b
      };

      console.log('[getTopAd5] ========== API 호출 시작 ==========');
      console.log('[getTopAd5] 요청 파라미터:', { os: v_e16099, member: v_660822 });

      const v_3393e3 = await v_c07360('getTopAd5', 'POST', v_cd6a57, v_c65f5d);

      return v_3393e3;
    })();

    v_21e89f = v_53a95f;

    const v_3393e3 = await v_53a95f;

    if (!v_3393e3) {
      console.warn('[getTopAd5] API 응답이 없습니다.');
      return null;
    }

    console.log('[getTopAd5] ========== 응답 구조 분석 ==========');
    console.log('[getTopAd5] response 타입:', typeof v_3393e3);
    console.log('[getTopAd5] response가 배열인가?', Array.isArray(v_3393e3));

    let v_e36b07 = [];
    let v_b1113a = [];

    if (v_3393e3?.ads && Array.isArray(v_3393e3.ads)) {
      v_e36b07 = v_3393e3.ads;
      v_b1113a = Array.isArray(v_3393e3.nextAds) ? v_3393e3.nextAds : [];
    } else if (Array.isArray(v_3393e3)) {

      v_e36b07 = v_3393e3;
    } else if (v_3393e3?.data?.ads && Array.isArray(v_3393e3.data.ads)) {

      v_e36b07 = v_3393e3.data.ads;
      v_b1113a = Array.isArray(v_3393e3.data.nextAds) ? v_3393e3.data.nextAds : [];
    } else if (v_3393e3?.data && Array.isArray(v_3393e3.data)) {

      v_e36b07 = v_3393e3.data;
    } else {
      console.warn('[getTopAd5] 예상하지 못한 response 구조:', v_3393e3);
      console.warn('[getTopAd5] response 키 목록:', Object.keys(v_3393e3 || {}));
      return null;
    }

    if (v_e36b07.length === 0) {
      console.log('[getTopAd5] ℹ️ 활성 광고 캠페인이 없습니다 (정상 응답)');
      return [];
    }

    const v_7be569 = v_e36b07.length;
    v_e36b07 = v_60f584(v_e36b07);
    const v_0c5d43 = v_7be569 - v_e36b07.length;

    const v_fa543d = new Set<string>();
    let v_6b5543 = 0;
    v_e36b07.forEach((v_ddcfed) => {
      const v_aa0917 = String(v_ddcfed.campid || '');
      if (v_aa0917 && v_aa0917 !== '' && v_aa0917 !== 'undefined') {
        if (v_fa543d.has(v_aa0917)) {
          v_6b5543++;
        } else {
          v_fa543d.add(v_aa0917);
        }
      }
    });

    if (v_b1113a && v_b1113a.length > 0) {

      try {
        const v_898796 = await v_e84827.getItem(v_69b0b7);
        let v_e3e5d0 = [];
        if (v_898796) {
          v_e3e5d0 = JSON.parse(v_898796);
        }

        const v_dc091b = new Set(v_e3e5d0.map((v_ddcfed) => String(v_ddcfed.campid || '')));
        const v_cda9f9 = v_b1113a.filter((v_ddcfed) => {
          const v_aa0917 = String(v_ddcfed.campid || '');
          return !v_dc091b.has(v_aa0917);
        });

        const v_fe3b1a = [...v_e3e5d0, ...v_cda9f9];
        await v_e84827.setItem(v_69b0b7, JSON.stringify(v_fe3b1a));
        console.log('[getTopAd5] ✅ nextAds 저장 완료:', v_fe3b1a.length, '개 (기존:', v_e3e5d0.length, '개 + 신규:', v_cda9f9.length, '개)');
        if (v_cda9f9.length > 0) {
          console.log('[getTopAd5] 신규 nextAds campid 목록:', v_cda9f9.map((v_ddcfed) => v_ddcfed.campid).join(', '));
        }
      } catch (v_df17d5) {
        console.error('[getTopAd5] nextAds 저장 실패:', v_df17d5);

        await v_e84827.setItem(v_69b0b7, JSON.stringify(v_b1113a));
        console.log('[getTopAd5] nextAds 저장 완료 (병합 실패, 신규만 저장):', v_b1113a.length, '개');
      }
    }

    if (v_e36b07 && v_e36b07.length > 0) {
      await v_e84827.setItem(v_332c06, JSON.stringify(v_e36b07));
      await v_e84827.setItem(v_b5dcce, Date.now().toString());
      console.log('[getTopAd5] AsyncStorage에 저장 완료:', v_e36b07.length, '개 광고');
    } else {
      console.warn('[getTopAd5] 저장할 광고 데이터가 없습니다.');
    }

    return v_e36b07;
  } catch (v_5e9bfe) {
    console.error('[getTopAd5] API 호출 실패:', v_5e9bfe);

    const v_fe7102 = await v_5d7ca4();
    if (v_fe7102) {
      console.log('[getTopAd5] 에러 발생, 저장된 데이터 반환');
      return v_fe7102;
    }
    throw v_5e9bfe;
  } finally {

    v_5281af = false;
    v_21e89f = null;
  }
};

export const v_5d7ca4 = async (): Promise<any | null> => {
  try {
    const v_fe7102 = await v_e84827.getItem(v_332c06);
    if (v_fe7102) {
      const v_75d360 = JSON.parse(v_fe7102);

      return v_75d360;
    }
    return null;
  } catch (v_5e9bfe) {
    console.error('[getStoredTopAd5] AsyncStorage 읽기 실패:', v_5e9bfe);
    return null;
  }
};

export const v_e3e9a7 = async (v_4cf0ad): Promise<any[]> => {
  if (!Array.isArray(v_4cf0ad) || v_4cf0ad.length === 0) {
    return v_4cf0ad;
  }

  const v_a35e21 = v_4cf0ad.filter(v_8c0b26 => {
    const v_7ec08d = v_8c0b26.urlAD;

    if (!v_7ec08d || typeof v_7ec08d !== 'string' || v_7ec08d.trim() === '' || v_7ec08d === '없음' || v_7ec08d === 'No') {
      console.warn('[validateTopAd5Urls] ⚠️ 백엔드에서 필터링되지 않은 항목 발견:', {
        campid: v_8c0b26.campid,
        urlAD: v_7ec08d,
      });
      return false;
    }
    return true;
  });

  if (v_a35e21.length === 0) {
    console.log('[validateTopAd5Urls] urlAD가 있는 항목이 없습니다.');
    return v_4cf0ad.map(v_8c0b26 => ({
      ...v_8c0b26,
      isValid: true, 
      urlValidatedAt: Date.now(),
    }));
  }

  console.log(`[validateTopAd5Urls] URL 검증 시작: ${v_a35e21.length}개 항목`);

  const v_cf5d30 = await Promise.allSettled(
    v_a35e21.map(async (v_8c0b26) => {
      try {
        const v_7ec08d = v_8c0b26.urlAD;

        const v_d201df = v_7ec08d && typeof v_7ec08d === 'string' && (
          v_7ec08d.includes('apps.apple.com') ||
          v_7ec08d.startsWith('itms-apps://') ||
          v_7ec08d.startsWith('itms://')
        );

        if (v_d201df) {
          console.log(`[validateTopAd5Urls] iOS App Store URL 검증 건너뜀: ${v_7ec08d}`);
          return {
            item: v_8c0b26,
            isValid: true,
            errorMessage: null,
          };
        }

        const v_4fc7c7 = new AbortController();
        const v_3894d5 = setTimeout(() => v_4fc7c7.abort(), 5000); 

        const v_3393e3 = await fetch(v_7ec08d, {
          method: 'HEAD',
          signal: v_4fc7c7.signal,
        });

        clearTimeout(v_3894d5);

        if (v_3393e3.ok) {
          return {
            item: v_8c0b26,
            isValid: true,
            errorMessage: null,
          };
        } else {
          return {
            item: v_8c0b26,
            isValid: false,
            errorMessage: `HTTP ${v_3393e3.status}`,
          };
        }
      } catch (v_5e9bfe) {
        return {
          item: v_8c0b26,
          isValid: false,
          errorMessage: v_5e9bfe.name === 'AbortError' ? '타임아웃' : v_5e9bfe.message || '알 수 없는 오류',
        };
      }
    })
  );

  const v_507ee6 = v_4cf0ad.map((v_8c0b26) => {
    if (!v_8c0b26.urlAD || typeof v_8c0b26.urlAD !== 'string' || v_8c0b26.urlAD.trim() === '') {

      return {
        ...v_8c0b26,
        isValid: true,
        urlValidatedAt: Date.now(),
      };
    }

    const v_43c42e = v_cf5d30.find(
      (v_43c42e) => v_43c42e.status === 'fulfilled' && v_43c42e.value.item === v_8c0b26
    );

    if (v_43c42e && v_43c42e.status === 'fulfilled') {
      return {
        ...v_8c0b26,
        isValid: v_43c42e.value.isValid,
        errorMessage: v_43c42e.value.errorMessage || undefined,
        urlValidatedAt: Date.now(),
      };
    } else {

      return {
        ...v_8c0b26,
        isValid: false,
        errorMessage: '검증 실패',
        urlValidatedAt: Date.now(),
      };
    }
  });

  const v_017ef3 = v_507ee6.filter(v_8c0b26 => v_8c0b26.isValid).length;
  const v_e65328 = v_507ee6.length - v_017ef3;
  console.log(`[validateTopAd5Urls] URL 검증 완료: 유효 ${v_017ef3}개, 무효 ${v_e65328}개`);

  return v_507ee6;
};

export const v_d751d6 = async (
  request: v_c2fe02,
  v_c65f5d,
): Promise<v_574952> => {
  try {
    const v_9f42a4 = v_7488d5(v_c65f5d);

    console.log('========================================');
    console.log('[인앱구매 API] 구매 데이터 전송 시작');
    console.log('========================================');
    console.log('[인앱구매 API] 요청 데이터:');
    console.log(JSON.stringify(v_576f5a, null, 2));
    console.log('----------------------------------------');

    const v_3393e3 = await v_9f42a4.post<v_574952>(
      '/inapp/purchase',
      v_576f5a,
    );

    console.log('========================================');
    console.log('[인앱구매 API] ✅ 전송 성공');
    console.log('========================================');
    console.log('[인앱구매 API] 응답 데이터:');
    console.log(JSON.stringify(v_3393e3.data, null, 2));
    console.log('----------------------------------------');
    console.log('[인앱구매 API] 상태:', v_3393e3.data?.status);
    console.log('[인앱구매 API] 메시지:', v_3393e3.data?.message);
    if (v_3393e3.data?.data?.savedCount !== undefined) {
      console.log('[인앱구매 API] 저장된 수:', v_3393e3.data.data.savedCount);
    }
    console.log('========================================');

    return v_3393e3.data;
  } catch (v_5e9bfe) {
    console.log('========================================');
    console.error('[인앱구매 API] ❌ 전송 실패');
    console.log('========================================');
    if (v_5e9bfe instanceof v_3333d3) {
      console.error('[인앱구매 API] 상세 오류 정보:', {
        url: v_5e9bfe.config?.url,
        method: v_5e9bfe.config?.method,
        status: v_5e9bfe.response?.status,
        statusText: v_5e9bfe.response?.statusText,
        data: v_5e9bfe.response?.data,
        message: v_5e9bfe.message,
      });
    } else {
      console.error('[인앱구매 API] 오류:', v_5e9bfe);
    }
    console.log('========================================');

    if (v_c65f5d) {
      await v_e4d665(v_c65f5d);
    }
    throw v_5e9bfe;
  }
};

export const v_dedaa7 = async (
  v_660822,
  v_c65f5d,
): Promise<any> => {
  try {
    const v_cd6a57 = {
      member: v_660822,
    };

    console.log('[레벨 정보] 사용자 레벨 정보 조회 요청:', v_660822);

    const v_3393e3 = await v_c07360('getMembersLevelInfo', 'POST', v_cd6a57, v_c65f5d);

    console.log('[레벨 정보] 사용자 레벨 정보 조회 성공:', v_3393e3);

    return v_3393e3;
  } catch (v_5e9bfe) {
    console.error('[레벨 정보] 사용자 레벨 정보 조회 오류:', v_5e9bfe);
    throw v_5e9bfe;
  }
};

export const v_96206e = async (
  v_660822,
  v_c65f5d,
): Promise<any> => {
  try {
    const v_9f42a4 = v_7488d5(v_c65f5d);
    const v_576f5a = {
      member: v_660822,
    };

    console.log('[Shop 매출] 메뉴 표시 여부 확인 요청:', { member: v_660822 });

    const v_3393e3 = await v_9f42a4.post<any>(
      '/checkShopSalesMenu',
      v_576f5a,
    );

    console.log('[Shop 매출] 메뉴 표시 여부 확인 성공:', v_3393e3.data.data?.showMenu || false);

    return v_3393e3.data;
  } catch (v_5e9bfe) {
    console.error('[Shop 매출] 메뉴 표시 여부 확인 오류:', v_5e9bfe);
    if (v_5e9bfe instanceof v_3333d3) {
      console.error('[Shop 매출] 상세 오류 정보:', {
        url: v_5e9bfe.config?.url,
        method: v_5e9bfe.config?.method,
        status: v_5e9bfe.response?.status,
        statusText: v_5e9bfe.response?.statusText,
        data: v_5e9bfe.response?.data,
        message: v_5e9bfe.message,
      });
    }
    throw v_5e9bfe;
  }
};

export const v_9509e3 = async (
  v_c5bd46,
  v_c65f5d,
): Promise<v_368e1a> => {
  try {
    const v_9f42a4 = v_7488d5(v_c65f5d);
    const request: v_7c19d8 = {
      shopmember: v_c5bd46,
    };

    console.log('[Shop 매출] 상품 정보 조회 요청:', { shopmember: v_c5bd46 });

    const v_3393e3 = await v_9f42a4.post<v_368e1a>(
      '/getItemInfo',
      v_576f5a,
    );

    console.log('[Shop 매출] 상품 정보 조회 성공:', v_3393e3.data.data?.title || 'No title');

    return v_3393e3.data;
  } catch (v_5e9bfe) {
    console.error('[Shop 매출] 상품 정보 조회 오류:', v_5e9bfe);
    if (v_5e9bfe instanceof v_3333d3) {
      console.error('[Shop 매출] 상세 오류 정보:', {
        url: v_5e9bfe.config?.url,
        method: v_5e9bfe.config?.method,
        status: v_5e9bfe.response?.status,
        statusText: v_5e9bfe.response?.statusText,
        data: v_5e9bfe.response?.data,
        message: v_5e9bfe.message,
      });
    }
    throw v_5e9bfe;
  }
};

export const v_09a96d = async (
  v_c5bd46,
  v_2ae65a,
  v_2272ed,
  v_c65f5d,
): Promise<any> => {
  try {
    const v_9f42a4 = v_7488d5(v_c65f5d);
    const v_576f5a = {
      shopmember: v_c5bd46,
    };

    if (v_2ae65a) {
      v_576f5a.dateFrom = v_2ae65a;
    }
    if (v_2272ed) {
      v_576f5a.dateTo = v_2272ed;
    }

    console.log('[Shop 매출] 구매자 명단 조회 요청:', { shopmember: v_c5bd46, dateFrom: v_2ae65a, dateTo: v_2272ed });

    const v_3393e3 = await v_9f42a4.post<any>(
      '/getItemPurchaseList',
      v_576f5a,
    );

    console.log('[Shop 매출] 구매자 명단 조회 성공, 개수:', v_3393e3.data.data?.purchaseList?.length || 0);

    return v_3393e3.data;
  } catch (v_5e9bfe) {
    console.error('[Shop 매출] 구매자 명단 조회 오류:', v_5e9bfe);
    if (v_5e9bfe instanceof v_3333d3) {
      console.error('[Shop 매출] 상세 오류 정보:', {
        url: v_5e9bfe.config?.url,
        method: v_5e9bfe.config?.method,
        status: v_5e9bfe.response?.status,
        statusText: v_5e9bfe.response?.statusText,
        data: v_5e9bfe.response?.data,
        message: v_5e9bfe.message,
      });
    }
    throw v_5e9bfe;
  }
};

export const v_d33616 = async (
  v_c5bd46,
  v_8c0b26,
  v_c65f5d,
): Promise<v_0ecd34> => {
  try {
    const v_9f42a4 = v_7488d5(v_c65f5d);
    const request: v_6b33d2 = {
      shopmember: v_c5bd46,
      item: v_8c0b26,
    };

    console.log('[Shop 매출] 상품 삭제 요청:', { shopmember: v_c5bd46, item: v_8c0b26 });

    const v_3393e3 = await v_9f42a4.post<v_0ecd34>(
      '/deleteShopItem',
      v_576f5a,
    );

    console.log('[Shop 매출] 상품 삭제 성공:', v_3393e3.data.status);

    return v_3393e3.data;
  } catch (v_5e9bfe) {
    console.error('[Shop 매출] 상품 삭제 오류:', v_5e9bfe);
    if (v_5e9bfe instanceof v_3333d3) {
      console.error('[Shop 매출] 상세 오류 정보:', {
        url: v_5e9bfe.config?.url,
        method: v_5e9bfe.config?.method,
        status: v_5e9bfe.response?.status,
        statusText: v_5e9bfe.response?.statusText,
        data: v_5e9bfe.response?.data,
        message: v_5e9bfe.message,
      });
    }
    throw v_5e9bfe;
  }
};

export * from './pangle';

export const v_5027e2 = async (
  request: v_8b0d2e,
  v_c65f5d,
): Promise<v_fc6136> => {
  try {
    const v_9f42a4 = v_7488d5(v_c65f5d);

    console.log('[상품 등록] 요청:', v_576f5a);

    const v_3393e3 = await v_9f42a4.post<v_fc6136>(
      '/createItemFromApp',
      v_576f5a,
    );

    console.log('[상품 등록] 성공:', v_3393e3.data.status);

    return v_3393e3.data;
  } catch (v_5e9bfe) {
    console.error('[상품 등록] 오류:', v_5e9bfe);
    if (v_5e9bfe instanceof v_3333d3) {
      console.error('[상품 등록] 상세 오류 정보:', {
        url: v_5e9bfe.config?.url,
        method: v_5e9bfe.config?.method,
        status: v_5e9bfe.response?.status,
        statusText: v_5e9bfe.response?.statusText,
        data: v_5e9bfe.response?.data,
        message: v_5e9bfe.message,
      });
    }
    throw v_5e9bfe;
  }
};

export const v_08c9ee = async (
  v_e0c7e8,
  v_c65f5d,
): Promise<{ status: 'success' | 'failed' | 'error'; code?: number; message?: string }> => {
  try {
    const v_9f42a4 = v_7488d5(v_c65f5d);
    const v_8f00b9 = await v_9f42a4.post('/forgot-password-send', { email: v_e0c7e8 });
    return v_8f00b9.data;
  } catch (v_5e9bfe) {
    const v_9390e8 = v_5e9bfe?.response?.data;
    return { status: 'error', code: v_5e9bfe?.response?.status, message: v_9390e8?.message || v_5e9bfe?.message || 'failed' };
  }
};

export const v_5e332c = async (
  v_e0c7e8,
  v_c99bd2,
  v_a85523,
  v_c65f5d,
): Promise<{ status: 'success' | 'failed' | 'error'; code?: number; message?: string }> => {
  try {
    const v_9f42a4 = v_7488d5(v_c65f5d);
    const v_8f00b9 = await v_9f42a4.post('/forgot-password-reset', { email: v_e0c7e8, code: v_c99bd2, newPin: v_a85523 });
    return v_8f00b9.data;
  } catch (v_5e9bfe) {
    const v_9390e8 = v_5e9bfe?.response?.data;
    return { status: 'error', code: v_5e9bfe?.response?.status, message: v_9390e8?.message || v_5e9bfe?.message || 'failed' };
  }
};

export const v_c07be3 = async (
  v_660822,
): Promise<{ all: boolean; notice: boolean; event: boolean } | null> => {
  try {
    const v_9f42a4 = v_7488d5();
    const v_8f00b9 = await v_9f42a4.get(`/notification-settings?member=${v_660822}`);
    const v_3ac7e7 = v_8f00b9.data?.data?.[0];
    if (!v_3ac7e7) return null;
    return { all: !!v_3ac7e7.all, notice: !!v_3ac7e7.notice, event: !!v_3ac7e7.event };
  } catch (v_9e86fd) {
    console.warn('[getNotificationSettings] failed:', v_9e86fd);
    return null;
  }
};

export const v_13c90a = async (
  v_660822,
  v_17dc8a,
): Promise<boolean> => {
  try {
    const v_9f42a4 = v_7488d5();
    await v_9f42a4.post('/notification-settings', { member: v_660822, ...v_17dc8a });
    return true;
  } catch (v_9e86fd) {
    console.warn('[updateNotificationSettings] failed:', v_9e86fd);
    throw v_9e86fd;
  }
};

export const v_884f91 = async (): Promise<boolean> => {
  try {
    const v_56b352 = await v_e84827.getItem('jwt');
    if (!v_56b352) return false;
    const v_660822 = v_9bbbdc(v_56b352);
    if (!v_660822) return false;
    const v_9f42a4 = v_7488d5();
    await v_9f42a4.post('/wallet-tutorial/complete', { member: v_660822 });
    return true;
  } catch (v_9e86fd) {
    console.warn('[recordWalletTutorialComplete] failed:', v_9e86fd);
    return false;
  }
};
