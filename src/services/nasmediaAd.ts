

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

export function isNasmediaAdAvailable(): boolean {
  return !!NasmediaAdModule
}

let cachedRewardAmount: { value: number; active: boolean; fetchedAt: number } | null = null;
const REWARD_AMOUNT_CACHE_MS = 5 * 60 * 1000;

export async function getNasmediaRewardAmount(): Promise<{ amount: number; active: boolean }> {
  const now = Date.now();
  if (cachedRewardAmount && now - cachedRewardAmount.fetchedAt < REWARD_AMOUNT_CACHE_MS) {
    return { amount: cachedRewardAmount.value, active: cachedRewardAmount.active };
  }
  try {
    const baseUrl = process.env.EXPO_PUBLIC_API_ENV === 'preview'
      ? 'https://edge-preview.example.invalid'
      : 'https://oth-path-gw.example.invalid';
    const res = await fetch(`${baseUrl}/nasmedia/video/reward-amount`, {
      headers: { 'Cache-Control': 'no-cache' },
    });
    if (res.ok) {
      const data = await res.json() as { reward_xrun: number; active: boolean };
      const amount = Number(data.reward_xrun) || 0;
      const active = !!data.active;
      cachedRewardAmount = { value: amount, active, fetchedAt: now };
      return { amount, active };
    }
  } catch (err) {
    console.warn('[nasmediaAd] reward-amount fetch failed:', err);
  }
  return { amount: cachedRewardAmount?.value ?? 0, active: cachedRewardAmount?.active ?? false };
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
