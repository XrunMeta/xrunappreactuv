

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

export function v_d46e1b(): boolean {
  return !!v_6a3da4
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
