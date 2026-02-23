

import { NativeModules, Platform } from 'react-native';

const { AyetOfferwallModule } = NativeModules;

export const AYET_AD_SLOT_NAME = 'Xplay';

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
  adSlotName: string = AYET_AD_SLOT_NAME
): Promise<AyetOfferItem[]> => {
  if (Platform.OS !== 'android' || !AyetOfferwallModule?.getOffers) {
    console.warn(`${AYET_LOG_PREFIX} getAyetOffers skipped (not Android or module unavailable), adSlotName=${adSlotName}`);
    return [];
  }
  const json: string = await AyetOfferwallModule.getOffers(adSlotName);
  if (!json || typeof json !== 'string') {
    console.error(`${AYET_LOG_PREFIX} getAyetOffers: SDK returned invalid response (empty or not string), adSlotName=${adSlotName}`);
    return [];
  }
  try {
    const parsed = JSON.parse(json);
    const list = Array.isArray(parsed) ? parsed : parsed?.offers ?? parsed?.data ?? [];
    if (list.length === 0) {
      console.warn(`${AYET_LOG_PREFIX} getAyetOffers: 0 offers for adSlotName=${adSlotName}. Check ayeT dashboard (placement, AdSlot #25617, Configure Offers).`);
    }
    return list;
  } catch (e) {
    console.error(`${AYET_LOG_PREFIX} getAyetOffers: JSON parse failed, adSlotName=${adSlotName}`, e);
    return [];
  }
};

export const setAyetUserId = (userId: string): void => {
  if (Platform.OS !== 'android' || !AyetOfferwallModule?.setUserId) return;
  const id = (userId && userId.trim()) ? String(userId).slice(0, 63) : 'guest';
  AyetOfferwallModule.setUserId(id);
};

export const showAyetOfferwall = async (
  adSlotName: string = AYET_AD_SLOT_NAME,
  options?: { memberId?: string }
): Promise<void> => {
  if (Platform.OS !== 'android' || !AyetOfferwallModule?.showOfferwall) {
    console.warn(`${AYET_LOG_PREFIX} showAyetOfferwall skipped (not Android or module unavailable), adSlotName=${adSlotName}`);
    return;
  }
  if (options?.memberId != null) setAyetUserId(options.memberId);
  await AyetOfferwallModule.showOfferwall(adSlotName);
};

export const isAyetOfferwallAvailable = (): boolean =>
  Platform.OS === 'android' && !!(NativeModules.AyetOfferwallModule?.showOfferwall ?? NativeModules.AyetOfferwallModule?.getOffers);
