

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
    const v_2b9521 = await import('dfqcugtrmkverogwhivhhcj');
    const v_c35e51 = v_2b9521?.Tapjoy;
    const v_dd5656 = v_2b9521?.TJLoggingLevel;
    if (!v_c35e51 || typeof v_c35e51.connect !== 'function') {
      console.warn('[Tapjoy] SDK 로드 실패 (Tapjoy.connect 없음). Metro 캐시 리셋 후 재시도: npx react-native start --reset-cache');
      return false;
    }

    const v_5ea7ba = {
      TJC_OPTION_LOGGING_LEVEL: typeof __DEV__ !== 'undefined' && __DEV__ && v_dd5656
        ? v_dd5656.Debug
        : (v_dd5656?.Error ?? 0),
    };
    if (v_43e90c && v_43e90c.trim()) v_5ea7ba.TJC_OPTION_USER_ID = v_43e90c;
    const v_51bf7b = (v_d48baf) => {
      console.warn('[Tapjoy] 연결 경고:', v_d48baf?.code, v_d48baf?.message);
    };
    await v_c35e51.connect(v_c76e4a, v_5ea7ba, v_51bf7b);
    v_c2fc75 = true;
    console.log('[Tapjoy] 연결 성공');
    return true;
  } catch (v_9e86fd) {
    console.warn('[Tapjoy] 연결 실패:', v_9e86fd);
    return false;
  }
};

const v_adefa3 = 20000;

export const v_9c6fa6 = async (v_7689ae): Promise<void> => {
  try {
    const v_1833e7 = v_7689ae || v_573fcf('TAPJOY_PLACEMENT_NAME') || 'Offerwall';
    if (!v_c2fc75) return;
    const { NativeModules: v_80fa10 } = await import('rcmrninabrnb');
    const { TJPlacement: v_37fb3b } = await import('dfqcugtrmkverogwhivhhcj');
    const v_f36218 = new v_37fb3b(v_1833e7);
    if (typeof v_80fa10?.TapjoyReactNativeSdk?.setEntryPoint === 'function') {
      v_80fa10.TapjoyReactNativeSdk.setEntryPoint(v_1833e7, v_5bd5c5);
    }
    v_f36218.requestContent();
    console.log('[Tapjoy] 사전 요청(프리로드):', v_1833e7);
  } catch {

  }
};

const v_5bd5c5 = 1;

export const v_82ad38 = async (
  v_7689ae,
  v_ca7283
): Promise<{ success: boolean; message?: string }> => {
  try {
    const v_1833e7 = v_7689ae || v_573fcf('TAPJOY_PLACEMENT_NAME') || 'Offerwall';
    const v_2b9521 = await import('dfqcugtrmkverogwhivhhcj');
    const { Tapjoy: v_c35e51, TJPlacement: v_37fb3b } = v_2b9521;
    const v_b73201 = (await import('rcmrninabrnb')).NativeModules?.TapjoyReactNativeSdk?.setEntryPoint;

    if (!v_c2fc75) {
      const v_89ac8f = await v_d5a49a();
      if (!v_89ac8f) {
        return { success: false, message: 'Tapjoy SDK Key를 설정해 주세요.' };
      }
    }

    console.log('[Tapjoy] Placement 요청:', v_1833e7);

    return new Promise((v_6f7712) => {
      let v_35db80 = false;
      let v_4f957d = false;
      const v_de1394 = (v_43c42e) => {
        if (v_35db80) return;
        v_35db80 = true;
        clearTimeout(v_3894d5);
        v_f36218.off(v_37fb3b.REQUEST_DID_SUCCEED, v_b989ac);
        v_f36218.off(v_37fb3b.REQUEST_DID_FAIL, v_0aa997);
        v_f36218.off(v_37fb3b.CONTENT_IS_READY, v_27b002);
        v_6f7712(v_43c42e);
      };

      const v_f36218 = new v_37fb3b(v_1833e7);

      if (typeof v_b73201 === 'function') {
        v_b73201(v_1833e7, v_5bd5c5);
      }

      const v_3894d5 = setTimeout(() => {
        console.warn('[Tapjoy] Placement 응답 타임아웃:', v_1833e7, v_4f957d ? '(요청 성공, 콘텐츠 없음)' : '');
        v_de1394({
          success: false,
          message: v_4f957d
            ? '현재 참여 가능한 오퍼가 없습니다. 잠시 후 다시 시도해 주세요.'
            : '광고를 불러오는 데 시간이 걸립니다. 잠시 후 다시 시도해 주세요.',
        });
      }, v_adefa3);

      const v_0aa997 = () => {
        const v_953d22 = v_f36218.error || '광고를 불러올 수 없습니다.';
        console.warn('[Tapjoy] Placement 실패:', v_1833e7, v_f36218.error ?? '(error 없음)');
        v_de1394({
          success: false,
          message: v_953d22,
        });
      };

      const v_b989ac = () => {
        v_4f957d = true;
        console.log('[Tapjoy] Placement 요청 성공(콘텐츠 대기):', v_1833e7);
      };

      const v_27b002 = () => {
        v_de1394({ success: true });
        if (v_ca7283) {
          v_f36218.once(v_37fb3b.CONTENT_DID_DISAPPEAR, () => {
            console.log('[Tapjoy] 오퍼월 닫힘 → 콜백 실행');
            v_ca7283();

            v_9c6fa6(v_1833e7).catch(() => {});
          });
        }
        v_f36218.showContent();
      };

      v_f36218.on(v_37fb3b.REQUEST_DID_SUCCEED, v_b989ac);
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

let v_d85760 = false;
export const v_592061 = (): void => {
  v_d85760 = true;
};
export const v_981fdd = (): boolean => {
  const v_81e2ef = v_d85760;
  v_d85760 = false;
  return v_81e2ef;
};
