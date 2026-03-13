

import { v_80fa10, v_326be8 } from 'rcmrninabrnb';
import { v_e4a763, v_573fcf } from '../utils/env';

const { AyetOfferwallModule: v_1bebcf } = v_80fa10;

export const v_c8c60c = 'Xplay';

const v_ddd026 = (): string =>
  v_326be8.OS === 'ios' ? (v_573fcf('AYET_AD_SLOT_NAME_IOS') || 'XRun') : v_c8c60c;

const v_78a093 = (v_bb8cc2): string =>
  v_326be8.OS === 'ios' && v_bb8cc2 === 'Xplay'
    ? (v_573fcf('AYET_AD_SLOT_NAME_IOS') || 'XRun')
    : v_bb8cc2;

export const v_563627 = () => {
  try {
    const v_c9c489 = v_e4a763();
    return {
      placementIdIos: v_c9c489.AYET_PLACEMENT_ID_IOS,
      adSlotNameIos: v_c9c489.AYET_AD_SLOT_NAME_IOS,
      currencyId: v_c9c489.AYET_CURRENCY_ID,
      currencyName: v_c9c489.AYET_CURRENCY_NAME,
      currencyNamePlural: v_c9c489.AYET_CURRENCY_NAME_PLURAL,
      conversionRate: parseInt(v_c9c489.AYET_CONVERSION_RATE || '1000', 10),
      minPayoutUsd: parseFloat(v_c9c489.AYET_MIN_PAYOUT_USD || '10'),
    };
  } catch {
    return {
      placementIdIos: '22062',
      adSlotNameIos: 'XRun',
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

const v_4c1151 = '[ayeT]';

export const v_3e930b = async (
  v_bb8cc2 = v_ddd026()
): Promise<AyetOfferItem[]> => {
  const v_b27fa5 = v_78a093(v_bb8cc2);
  if (!v_1bebcf?.getOffers) {
    console.warn(`${v_4c1151} getAyetOffers skipped (module unavailable), adSlotName=${v_b27fa5}`);
    return [];
  }
  const v_7ecfd1 = await v_1bebcf.getOffers(v_b27fa5);
  if (!v_7ecfd1 || typeof v_7ecfd1 !== 'string') {
    console.error(`${v_4c1151} getAyetOffers: SDK returned invalid response (empty or not string), adSlotName=${v_b27fa5}`);
    return [];
  }
  try {
    const v_8decf8 = JSON.parse(v_7ecfd1);
    const v_ef8ab1 = Array.isArray(v_8decf8) ? v_8decf8 : v_8decf8?.offers ?? v_8decf8?.data ?? [];
    if (v_ef8ab1.length === 0) {
      console.warn(`${v_4c1151} getAyetOffers: 0 offers for adSlotName=${v_b27fa5}. Check ayeT dashboard (placement, AdSlot, Configure Offers).`);
    }
    return v_ef8ab1;
  } catch (v_9e86fd) {
    console.error(`${v_4c1151} getAyetOffers: JSON parse failed, adSlotName=${v_b27fa5}`, v_9e86fd);
    return [];
  }
};

export const v_e8d7c0 = (v_43e90c): void => {
  if (!v_1bebcf?.setUserId) return;
  const v_389afb = (v_43e90c && v_43e90c.trim()) ? String(v_43e90c).slice(0, 63) : 'guest';
  v_1bebcf.setUserId(v_389afb);
};

export const v_961d2c = async (
  v_bb8cc2 = v_ddd026(),
  v_b36f96
): Promise<void> => {
  const v_b27fa5 = v_78a093(v_bb8cc2);
  if (!v_1bebcf?.showOfferwall) {
    const v_badeaf = 'OFFERWALL_UNAVAILABLE';
    console.warn(`${v_4c1151} showAyetOfferwall skipped (module unavailable), adSlotName=${v_b27fa5}. Run with development build: npx expo run:ios`);
    throw new Error(v_badeaf);
  }
  if (v_b36f96?.memberId != null) v_e8d7c0(v_b36f96.memberId);
  await v_1bebcf.showOfferwall(v_b27fa5);
};

export const v_609ab5 = (): boolean =>
  !!(v_80fa10.AyetOfferwallModule?.showOfferwall ?? v_80fa10.AyetOfferwallModule?.getOffers);
