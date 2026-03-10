

import { NativeModules, Platform } from 'react-native';
import { getEnvValue } from '../utils/env';

const { AyetOfferwallModule } = NativeModules;

export const AYET_AD_SLOT_NAME = 'Xplay';

const getDefaultAdSlotName = (): string =>
  Platform.OS === 'ios' ? (getEnvValue('AYET_AD_SLOT_NAME_IOS') || 'XRun') : AYET_AD_SLOT_NAME;

const resolveAdSlotName = (adSlotName: string): string =>
  Platform.OS === 'ios' && adSlotName === 'Xplay'
    ? (getEnvValue('AYET_AD_SLOT_NAME_IOS') || 'XRun')
    : adSlotName;

export interface AyetOfferItem {
  id?: string;
  name?: string;
  reward?: string;
  reward_amount?: number;
  icon_url?: string;
  [key: string]: unknown;
}

const AYET_LOG_PREFIX = '[ayeT]';

export const getAyetOffers = async (
  adSlotName: string = getDefaultAdSlotName()
): Promise<AyetOfferItem[]> => {
  const slotName = resolveAdSlotName(adSlotName);
  if (!AyetOfferwallModule?.getOffers) {
    console.warn(`${AYET_LOG_PREFIX} getAyetOffers skipped (module unavailable), adSlotName=${slotName}`);
    return [];
  }
  const json: string = await AyetOfferwallModule.getOffers(slotName);
  if (!json || typeof json !== 'string') {
    console.error(`${AYET_LOG_PREFIX} getAyetOffers: SDK returned invalid response (empty or not string), adSlotName=${slotName}`);
    return [];
  }
  try {
    const parsed = JSON.parse(json);
    const list = Array.isArray(parsed) ? parsed : parsed?.offers ?? parsed?.data ?? [];
    if (list.length === 0) {
      console.warn(`${AYET_LOG_PREFIX} getAyetOffers: 0 offers for adSlotName=${slotName}. Check ayeT dashboard (placement, AdSlot, Configure Offers).`);
    }
    return list;
  } catch (e) {
    console.error(`${AYET_LOG_PREFIX} getAyetOffers: JSON parse failed, adSlotName=${slotName}`, e);
    return [];
  }
};

export const setAyetUserId = (userId: string): void => {
  if (!AyetOfferwallModule?.setUserId) return;
  const id = (userId && userId.trim()) ? String(userId).slice(0, 63) : 'guest';
  AyetOfferwallModule.setUserId(id);
};

export const showAyetOfferwall = async (
  adSlotName: string = getDefaultAdSlotName(),
  options?: { memberId?: string }
): Promise<void> => {
  const slotName = resolveAdSlotName(adSlotName);
  if (!AyetOfferwallModule?.showOfferwall) {
    const msg = 'OFFERWALL_UNAVAILABLE';
    console.warn(`${AYET_LOG_PREFIX} showAyetOfferwall skipped (module unavailable), adSlotName=${slotName}. Run with development build: npx expo run:ios`);
    throw new Error(msg);
  }
  if (options?.memberId != null) setAyetUserId(options.memberId);
  await AyetOfferwallModule.showOfferwall(slotName);
};

export const isAyetOfferwallAvailable = (): boolean =>
  !!(NativeModules.AyetOfferwallModule?.showOfferwall ?? NativeModules.AyetOfferwallModule?.getOffers);
