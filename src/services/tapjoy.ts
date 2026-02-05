

import { v_326be8 } from 'rcmrninabrnb';
import { v_573fcf } from '../utils/env';

let v_c2fc75 = false;

export const v_d5a49a = async (v_43e90c): Promise<boolean> => {
  try {
    if (v_c2fc75) {
      console.log('[Tapjoy] 이미 연결됨');
      return true;
    }
    const v_c76e4a =
      v_326be8.OS === 'ios'
        ? v_573fcf('TAPJOY_SDK_KEY_IOS')
        : v_573fcf('TAPJOY_SDK_KEY_ANDROID');
    if (!v_c76e4a || v_c76e4a.trim() === '') {
      console.warn('[Tapjoy] SDK Key가 설정되지 않았습니다. env의 TAPJOY_SDK_KEY_* 를 설정하세요.');
      return false;
    }
    const { Tapjoy: v_c35e51 } = await import('dfqcugtrmkverogwhivhhcj');
    const v_5ea7ba = {};
    if (v_43e90c) v_5ea7ba.TJC_OPTION_USER_ID = v_43e90c;
    await v_c35e51.connect(v_c76e4a, v_5ea7ba);
    v_c2fc75 = true;
    console.log('[Tapjoy] 연결 성공');
    return true;
  } catch (v_9e86fd) {
    console.warn('[Tapjoy] 연결 실패:', v_9e86fd);
    return false;
  }
};

export const v_82ad38 = async (
  v_7689ae
): Promise<{ success: boolean; message?: string }> => {
  try {
    const v_1833e7 = v_7689ae || v_573fcf('TAPJOY_PLACEMENT_NAME') || 'Offerwall';
    const { Tapjoy: v_c35e51, TJPlacement: v_37fb3b } = await import('dfqcugtrmkverogwhivhhcj');

    if (!v_c2fc75) {
      const v_89ac8f = await v_d5a49a();
      if (!v_89ac8f) {
        return { success: false, message: 'Tapjoy SDK Key를 설정해 주세요.' };
      }
    }

    return new Promise((v_6f7712) => {
      const v_f36218 = new v_37fb3b(v_1833e7);

      const v_0aa997 = () => {
        v_f36218.off(v_37fb3b.REQUEST_DID_FAIL, v_0aa997);
        v_f36218.off(v_37fb3b.CONTENT_IS_READY, v_27b002);
        v_6f7712({
          success: false,
          message: v_f36218.error || '광고를 불러올 수 없습니다.',
        });
      };

      const v_27b002 = () => {
        v_f36218.off(v_37fb3b.REQUEST_DID_FAIL, v_0aa997);
        v_f36218.off(v_37fb3b.CONTENT_IS_READY, v_27b002);
        v_f36218.showContent();
        v_6f7712({ success: true });
      };

      v_f36218.on(v_37fb3b.REQUEST_DID_FAIL, v_0aa997);
      v_f36218.on(v_37fb3b.CONTENT_IS_READY, v_27b002);
      v_f36218.requestContent();
    });
  } catch (v_9e86fd) {
    console.warn('[Tapjoy] showTapjoyPlacement 오류:', v_9e86fd);
    return {
      success: false,
      message: v_9e86fd instanceof Error ? v_9e86fd.message : 'Tapjoy SDK를 사용할 수 없습니다.',
    };
  }
};

export const v_4940be = (): boolean => v_c2fc75;
