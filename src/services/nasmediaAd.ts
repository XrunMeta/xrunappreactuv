

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
