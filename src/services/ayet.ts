

import { NativeModules, Platform } from 'react-native';
import { getEnv, getEnvValue } from '../utils/env';

const { AyetOfferwallModule } = NativeModules;

export const AYET_AD_SLOT_NAME = 'XRUN';

let ayetInitialized = false;

export const initAyetSdk = async (memberId: string): Promise<boolean> => {
  if (ayetInitialized) return true;
  if (Platform.OS !== 'android' || !AyetOfferwallModule?.initialize) return false;
  try {
    const env = getEnv();
    const placementId = parseInt(env.AYET_PLACEMENT_ID_ANDROID || '0', 10);
    if (!placementId) {
      console.warn('[ayeT] AYET_PLACEMENT_ID_ANDROID가 설정되지 않았습니다.');
      return false;
    }
    await AyetOfferwallModule.initialize(placementId, memberId || 'guest');
    ayetInitialized = true;
    console.log('[ayeT] SDK 초기화 완료');
    return true;
  } catch (e: any) {
    console.error('[ayeT] SDK 초기화 실패:', e.message);
    return false;
  }
};

const getDefaultAdSlotName = (): string =>
  Platform.OS === 'ios' ? (getEnvValue('AYET_AD_SLOT_NAME_IOS') || '25755') : AYET_AD_SLOT_NAME;

const resolveAdSlotName = (adSlotName: string): string =>
  Platform.OS === 'ios' && adSlotName === 'Xplay'
    ? (getEnvValue('AYET_AD_SLOT_NAME_IOS') || '25755')
    : adSlotName;

export const getAyetRewardConfig = () => {
  try {
    const env = getEnv();
    return {
      placementIdIos: env.AYET_PLACEMENT_ID_IOS,
      adSlotNameIos: env.AYET_AD_SLOT_NAME_IOS,
      currencyId: env.AYET_CURRENCY_ID,
      currencyName: env.AYET_CURRENCY_NAME,
      currencyNamePlural: env.AYET_CURRENCY_NAME_PLURAL,
      conversionRate: parseInt(env.AYET_CONVERSION_RATE || '1000', 10),
      minPayoutUsd: parseFloat(env.AYET_MIN_PAYOUT_USD || '10'),
    };
  } catch {
    return {
      placementIdIos: '22062',
      adSlotNameIos: '25755',
      currencyId: 'Xplay',
      currencyName: 'Xplay',
      currencyNamePlural: 'Xplay',
      conversionRate: 1000,
      minPayoutUsd: 10,
    };
  }
};

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

export const setAyetUserIdAsync = async (userId: string): Promise<void> => {
  if (!AyetOfferwallModule?.setUserId) return;
  const id = userId && userId.trim() ? String(userId).slice(0, 63) : 'guest';
  await AyetOfferwallModule.setUserId(id);
};

export const setAyetUserId = (userId: string): void => {
  void setAyetUserIdAsync(userId);
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

  if (Platform.OS === 'android' && !ayetInitialized && options?.memberId) {
    await initAyetSdk(options.memberId);
  }
  if (options?.memberId != null && String(options.memberId).trim() !== '') {
    await setAyetUserIdAsync(String(options.memberId));
  }
  await AyetOfferwallModule.showOfferwall(slotName);
};

export const isAyetOfferwallAvailable = (): boolean =>
  !!(NativeModules.AyetOfferwallModule?.showOfferwall ?? NativeModules.AyetOfferwallModule?.getOffers);
