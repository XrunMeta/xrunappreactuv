

import { NativeModules, NativeEventEmitter, Platform } from 'react-native'

const { NasmediaAdModule } = NativeModules as {
  NasmediaAdModule?: {
    initialize: (mediaKey: string, adUnitIds: string[]) => Promise<boolean>
    loadAndShowRewardedAd: (adUnitId: string, memberId: number) => Promise<boolean>
    stopAd: () => Promise<boolean>
  }
}

export const NASMEDIA_MEDIA_KEY = Platform.select({
  android: '10405',
  ios: '10407',
})!

export const NASMEDIA_AR_REWARD_ADUNIT = Platform.select({
  android: '105817',  
  ios: '105809',      
})!

let initialized = false
const emitter = NasmediaAdModule
  ? new NativeEventEmitter(NativeModules.NasmediaAdModule)
  : null

if (emitter) {
  const { Alert } = require('react-native')
  emitter.addListener('NasmediaAd_onLoaded', (p: any) =>
    console.log('[nasmedia-video] ✅ onLoaded', p),
  )
  emitter.addListener('NasmediaAd_onLoadFailed', (p: any) => {
    console.log('[nasmedia-video] ❌ onLoadFailed', p)
    Alert.alert(
      '나스미디어 광고 로드 실패',
      `code=${p?.errorCode}\nmsg=${p?.errorMsg}\nadUnitId=${p?.adUnitId}`,
    )
  })
  emitter.addListener('NasmediaAd_onEarnedReward', (p: any) =>
    console.log('[nasmedia-video] 🎉 onEarnedReward', p),
  )
  emitter.addListener('NasmediaAd_onClosed', (p: any) =>
    console.log('[nasmedia-video] 🚪 onClosed', p),
  )
  console.log('[nasmedia-video] module-level listener 등록 완료')
}

export function isNasmediaAdAvailable(): boolean {
  return !!NasmediaAdModule
}

let cachedRewardAmount: {
  value: number
  active: boolean
  pangleValue: number
  pangleActive: boolean
  fetchedAt: number
} | null = null;
const REWARD_AMOUNT_CACHE_MS = 30 * 1000; 

export async function getNasmediaRewardAmount(opts?: { force?: boolean }): Promise<{
  amount: number; active: boolean;
  pangleAmount: number; pangleActive: boolean;
}> {
  const now = Date.now();
  if (!opts?.force && cachedRewardAmount && now - cachedRewardAmount.fetchedAt < REWARD_AMOUNT_CACHE_MS) {
    return {
      amount: cachedRewardAmount.value, active: cachedRewardAmount.active,
      pangleAmount: cachedRewardAmount.pangleValue, pangleActive: cachedRewardAmount.pangleActive,
    };
  }
  try {
    const baseUrl = process.env.EXPO_PUBLIC_API_ENV === 'preview'
      ? 'https://edge-preview.example.invalid'
      : 'https://oth-path-gw.example.invalid';
    const res = await fetch(`${baseUrl}/nasmedia/video/reward-amount`, {
      headers: { 'Cache-Control': 'no-cache' },
    });
    if (res.ok) {
      const data = await res.json() as {
        reward_xrun: number; active: boolean;
        pangle_reward_xrun?: number; pangle_active?: boolean;
      };
      const amount = Number(data.reward_xrun) || 0;
      const active = !!data.active;
      const pangleAmount = Number(data.pangle_reward_xrun ?? 0);
      const pangleActive = !!data.pangle_active;
      cachedRewardAmount = { value: amount, active, pangleValue: pangleAmount, pangleActive, fetchedAt: now };
      return { amount, active, pangleAmount, pangleActive };
    }
  } catch (err) {
    console.warn('[nasmediaAd] reward-amount fetch failed:', err);
  }
  return {
    amount: cachedRewardAmount?.value ?? 0,
    active: cachedRewardAmount?.active ?? false,
    pangleAmount: cachedRewardAmount?.pangleValue ?? 0,
    pangleActive: cachedRewardAmount?.pangleActive ?? false,
  };
}

import i18n from 'i18next';

const cachedToastTexts: Record<string, { value: Record<string, { title: string; body: string; enabled: boolean }>; fetchedAt: number }> = {};
const TOAST_CACHE_MS = 5 * 60 * 1000;

function currentLang(): string {

  const raw = (i18n.language || 'ko').toLowerCase();
  if (raw.startsWith('zh')) return raw.startsWith('zh-tw') ? 'zh-CN' : 'zh-CN';
  return raw.split('-')[0];
}

export async function getToastTexts(language?: string): Promise<Record<string, { title: string; body: string; enabled: boolean }>> {
  const lang = language || currentLang();
  const now = Date.now();
  const cached = cachedToastTexts[lang];
  if (cached && now - cached.fetchedAt < TOAST_CACHE_MS) {
    return cached.value;
  }
  try {
    const baseUrl = process.env.EXPO_PUBLIC_API_ENV === 'preview'
      ? 'https://edge-preview.example.invalid'
      : 'https://oth-path-gw.example.invalid';
    const res = await fetch(`${baseUrl}/nasmedia/video/toast-texts?language=${encodeURIComponent(lang)}`);
    if (res.ok) {
      const data = await res.json() as { toasts: Record<string, { title: string; body: string; enabled: boolean }> };
      cachedToastTexts[lang] = { value: data.toasts ?? {}, fetchedAt: now };
      return cachedToastTexts[lang].value;
    }
  } catch (err) {
    console.warn('[nasmediaAd] toast-texts fetch failed:', err);
  }
  return cachedToastTexts[lang]?.value ?? {};
}

export function getToastBody(category: string, fallback: string): string {
  const lang = currentLang();
  const map = cachedToastTexts[lang]?.value ?? {};
  const t = map[category];
  if (t && t.enabled && t.body) return t.body;
  return fallback;
}

export async function initNasmediaAd(): Promise<boolean> {
  if (!NasmediaAdModule) {
    console.warn('[nasmediaAd] native module not linked (구 빌드)')
    return false
  }
  if (initialized) return true
  try {
    await NasmediaAdModule.initialize(NASMEDIA_MEDIA_KEY, [NASMEDIA_AR_REWARD_ADUNIT])
    initialized = true
    return true
  } catch (err) {
    console.error('[nasmediaAd] initialize failed:', err)
    return false
  }
}

export async function showNasmediaRewardedAd(memberId: number): Promise<boolean> {
  if (!NasmediaAdModule) {
    console.warn('[nasmediaAd] native module not linked')
    return false
  }
  if (!initialized) {
    const ok = await initNasmediaAd()
    if (!ok) return false
  }
  try {
    await NasmediaAdModule.loadAndShowRewardedAd(NASMEDIA_AR_REWARD_ADUNIT, memberId)
    return true
  } catch (err) {
    console.error('[nasmediaAd] showRewardedAd failed:', err)
    return false
  }
}

export type NasmediaAdEvent =
  | 'NasmediaAd_onLoaded'
  | 'NasmediaAd_onLoadFailed'
  | 'NasmediaAd_onEarnedReward'
  | 'NasmediaAd_onClosed'

export function addNasmediaAdListener<T = unknown>(
  event: NasmediaAdEvent,
  handler: (payload: T) => void,
): { remove: () => void } {
  if (!emitter) return { remove: () => {  } }
  const sub = emitter.addListener(event, handler)
  return { remove: () => sub.remove() }
}
