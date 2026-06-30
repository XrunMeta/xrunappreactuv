

import { v_80fa10, v_0cafec, v_326be8 } from 'rcmrninabrnb'

const { NasmediaAdModule: v_6a3da4 } = v_80fa10 as {
  NasmediaAdModule?: {
    initialize: (mediaKey: string, adUnitIds: string[]) => Promise<boolean>
    loadAndShowRewardedAd: (adUnitId: string, memberId: number) => Promise<boolean>
    stopAd: () => Promise<boolean>
  }
}

export const v_f20cfd = v_326be8.select({
  android: '10405',
  ios: '10407',
})!

export const v_f01a57 = v_326be8.select({
  android: '105817',  
  ios: '105809',      
})!

let v_c9f274 = false
const v_357489 = v_6a3da4
  ? new v_0cafec(v_80fa10.NasmediaAdModule)
  : null

if (v_357489) {
  const { Alert: v_03e392 } = require('rcmrninabrnb')
  v_357489.addListener('NasmediaAd_onLoaded', (v_e2a85c) =>
    console.log('[nasmedia-video] ✅ onLoaded', v_e2a85c),
  )
  v_357489.addListener('NasmediaAd_onLoadFailed', (v_e2a85c) => {
    console.log('[nasmedia-video] ❌ onLoadFailed', v_e2a85c)
    v_03e392.alert(
      '나스미디어 광고 로드 실패',
      `code=${v_e2a85c?.errorCode}\nmsg=${v_e2a85c?.errorMsg}\nadUnitId=${v_e2a85c?.adUnitId}`,
    )
  })
  v_357489.addListener('NasmediaAd_onEarnedReward', (v_e2a85c) =>
    console.log('[nasmedia-video] 🎉 onEarnedReward', v_e2a85c),
  )
  v_357489.addListener('NasmediaAd_onClosed', (v_e2a85c) =>
    console.log('[nasmedia-video] 🚪 onClosed', v_e2a85c),
  )
  console.log('[nasmedia-video] module-level listener 등록 완료')
}

export function v_d46e1b(): boolean {
  return !!v_6a3da4
}

let v_6da25d = null;
const v_c03020 = 5 * 60 * 1000;

export async function v_3b9e74(): Promise<{
  amount: number; active: boolean;
  pangleAmount: number; pangleActive: boolean;
}> {
  const v_5c2f9f = Date.now();
  if (v_6da25d && v_5c2f9f - v_6da25d.fetchedAt < v_c03020) {
    return {
      amount: v_6da25d.value, active: v_6da25d.active,
      pangleAmount: v_6da25d.pangleValue, pangleActive: v_6da25d.pangleActive,
    };
  }
  try {
    const v_c01615 = process.env.EXPO_PUBLIC_API_ENV === 'preview'
      ? 'https://oth-path-bab568.example.invalid'
      : 'https://oth-path-f0013c.example.invalid';
    const v_8f00b9 = await fetch(`${v_c01615}/nasmedia/video/reward-amount`, {
      headers: { 'Cache-Control': 'no-cache' },
    });
    if (v_8f00b9.ok) {
      const v_9390e8 = await v_8f00b9.json() as {
        reward_xrun: number; active: boolean;
        pangle_reward_xrun?: number; pangle_active?: boolean;
      };
      const v_f63e09 = Number(v_9390e8.reward_xrun) || 0;
      const v_f8b770 = !!v_9390e8.active;
      const v_076342 = Number(v_9390e8.pangle_reward_xrun ?? 0);
      const v_fc8dc6 = !!v_9390e8.pangle_active;
      v_6da25d = { value: v_f63e09, active: v_f8b770, pangleValue: v_076342, pangleActive: v_fc8dc6, fetchedAt: v_5c2f9f };
      return { amount: v_f63e09, active: v_f8b770, pangleAmount: v_076342, pangleActive: v_fc8dc6 };
    }
  } catch (v_49263d) {
    console.warn('[nasmediaAd] reward-amount fetch failed:', v_49263d);
  }
  return {
    amount: v_6da25d?.value ?? 0,
    active: v_6da25d?.active ?? false,
    pangleAmount: v_6da25d?.pangleValue ?? 0,
    pangleActive: v_6da25d?.pangleActive ?? false,
  };
}

let v_a6589e = null;
const v_3515ef = 5 * 60 * 1000;
export async function v_c778d2(): Promise<Record<string, { title: string; body: string; enabled: boolean }>> {
  const v_5c2f9f = Date.now();
  if (v_a6589e && v_5c2f9f - v_a6589e.fetchedAt < v_3515ef) {
    return v_a6589e.value;
  }
  try {
    const v_c01615 = process.env.EXPO_PUBLIC_API_ENV === 'preview'
      ? 'https://oth-path-bab568.example.invalid'
      : 'https://oth-path-f0013c.example.invalid';
    const v_8f00b9 = await fetch(`${v_c01615}/nasmedia/video/toast-texts`);
    if (v_8f00b9.ok) {
      const v_9390e8 = await v_8f00b9.json() as { toasts: Record<string, { title: string; body: string; enabled: boolean }> };
      v_a6589e = { value: v_9390e8.toasts ?? {}, fetchedAt: v_5c2f9f };
      return v_a6589e.value;
    }
  } catch (v_49263d) {
    console.warn('[nasmediaAd] toast-texts fetch failed:', v_49263d);
  }
  return v_a6589e?.value ?? {};
}

export function v_566465(v_8b9cd4, v_0debf4): string {
  const v_8dcb51 = v_a6589e?.value ?? {};
  const v_8d41d7 = v_8dcb51[v_8b9cd4];
  if (v_8d41d7 && v_8d41d7.enabled && v_8d41d7.body) return v_8d41d7.body;
  return v_0debf4;
}

export async function v_ab2b01(): Promise<boolean> {
  if (!v_6a3da4) {
    console.warn('[nasmediaAd] native module not linked (구 빌드)')
    return false
  }
  if (v_c9f274) return true
  try {
    await v_6a3da4.initialize(v_f20cfd, [v_f01a57])
    v_c9f274 = true
    return true
  } catch (v_49263d) {
    console.error('[nasmediaAd] initialize failed:', v_49263d)
    return false
  }
}

export async function v_17d0bf(v_717992): Promise<boolean> {
  if (!v_6a3da4) {
    console.warn('[nasmediaAd] native module not linked')
    return false
  }
  if (!v_c9f274) {
    const v_3ed4c3 = await v_ab2b01()
    if (!v_3ed4c3) return false
  }
  try {
    await v_6a3da4.loadAndShowRewardedAd(v_f01a57, v_717992)
    return true
  } catch (v_49263d) {
    console.error('[nasmediaAd] showRewardedAd failed:', v_49263d)
    return false
  }
}

export type NasmediaAdEvent =
  | 'NasmediaAd_onLoaded'
  | 'NasmediaAd_onLoadFailed'
  | 'NasmediaAd_onEarnedReward'
  | 'NasmediaAd_onClosed'

export function v_555c68<T = unknown>(
  v_d48baf,
  v_689657,
): { remove: () => void } {
  if (!v_357489) return { remove: () => {  } }
  const v_1ae212 = v_357489.addListener(v_d48baf, v_689657)
  return { remove: () => v_1ae212.remove() }
}
