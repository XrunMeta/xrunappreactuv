

import { v_80fa10, v_326be8 } from 'rcmrninabrnb';

const { AyetOfferwallModule: v_1bebcf } = v_80fa10;

export const v_c8c60c = 'Xplay';

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
  v_bb8cc2 = v_c8c60c
): Promise<AyetOfferItem[]> => {
  if (v_326be8.OS !== 'android' || !v_1bebcf?.getOffers) {
    console.warn(`${v_4c1151} getAyetOffers skipped (not Android or module unavailable), adSlotName=${v_bb8cc2}`);
    return [];
  }
  const v_7ecfd1 = await v_1bebcf.getOffers(v_bb8cc2);
  if (!v_7ecfd1 || typeof v_7ecfd1 !== 'string') {
    console.error(`${v_4c1151} getAyetOffers: SDK returned invalid response (empty or not string), adSlotName=${v_bb8cc2}`);
    return [];
  }
  try {
    const v_8decf8 = JSON.parse(v_7ecfd1);
    const v_ef8ab1 = Array.isArray(v_8decf8) ? v_8decf8 : v_8decf8?.offers ?? v_8decf8?.data ?? [];
    if (v_ef8ab1.length === 0) {
      console.warn(`${v_4c1151} getAyetOffers: 0 offers for adSlotName=${v_bb8cc2}. Check ayeT dashboard (placement, AdSlot #25617, Configure Offers).`);
    }
    return v_ef8ab1;
  } catch (v_9e86fd) {
    console.error(`${v_4c1151} getAyetOffers: JSON parse failed, adSlotName=${v_bb8cc2}`, v_9e86fd);
    return [];
  }
};

export const v_961d2c = async (
  v_bb8cc2 = v_c8c60c
): Promise<void> => {
  if (v_326be8.OS !== 'android' || !v_1bebcf?.showOfferwall) {
    console.warn(`${v_4c1151} showAyetOfferwall skipped (not Android or module unavailable), adSlotName=${v_bb8cc2}`);
    return;
  }
  await v_1bebcf.showOfferwall(v_bb8cc2);
};

export const v_609ab5 = (): boolean =>
  v_326be8.OS === 'android' && !!(v_80fa10.AyetOfferwallModule?.showOfferwall ?? v_80fa10.AyetOfferwallModule?.getOffers);
