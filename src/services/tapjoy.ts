

import { Platform } from 'react-native';
import { getEnvValue } from '../utils/env';

let isTapjoyConnected = false;

export const connectTapjoy = async (userId?: string): Promise<boolean> => {
  try {
    if (isTapjoyConnected) {
      console.log('[Tapjoy] 이미 연결됨');
      return true;
    }
    const sdkKey =
      Platform.OS === 'ios'
        ? getEnvValue('TAPJOY_SDK_KEY_IOS')
        : getEnvValue('TAPJOY_SDK_KEY_ANDROID');
    if (!sdkKey || sdkKey.trim() === '') {
      console.warn('[Tapjoy] SDK Key가 설정되지 않았습니다. env의 TAPJOY_SDK_KEY_* 를 설정하세요.');
      return false;
    }
    const { Tapjoy } = await import('tapjoy-react-native-sdk');
    const flags: Record<string, string> = {};
    if (userId) flags.TJC_OPTION_USER_ID = userId;
    await Tapjoy.connect(sdkKey, flags);
    isTapjoyConnected = true;
    console.log('[Tapjoy] 연결 성공');
    return true;
  } catch (e) {
    console.warn('[Tapjoy] 연결 실패:', e);
    return false;
  }
};

export const showTapjoyPlacement = async (
  placementName?: string,
  onContentDismissed?: () => void
): Promise<{ success: boolean; message?: string }> => {
  try {
    const name = placementName || getEnvValue('TAPJOY_PLACEMENT_NAME') || 'Offerwall';
    const { Tapjoy, TJPlacement } = await import('tapjoy-react-native-sdk');

    if (!isTapjoyConnected) {
      const connected = await connectTapjoy();
      if (!connected) {
        return { success: false, message: 'Tapjoy SDK Key를 설정해 주세요.' };
      }
    }

    return new Promise((resolve) => {
      const placement = new TJPlacement(name);

      const onRequestFail = () => {
        placement.off(TJPlacement.REQUEST_DID_FAIL, onRequestFail);
        placement.off(TJPlacement.CONTENT_IS_READY, onContentReady);
        resolve({
          success: false,
          message: placement.error || '광고를 불러올 수 없습니다.',
        });
      };

      const onContentReady = () => {
        placement.off(TJPlacement.REQUEST_DID_FAIL, onRequestFail);
        placement.off(TJPlacement.CONTENT_IS_READY, onContentReady);
        if (onContentDismissed) {
          placement.once(TJPlacement.CONTENT_DID_DISAPPEAR, () => {
            console.log('[Tapjoy] 오퍼월 닫힘 → 콜백 실행');
            onContentDismissed();
          });
        }
        placement.showContent();
        resolve({ success: true });
      };

      placement.on(TJPlacement.REQUEST_DID_FAIL, onRequestFail);
      placement.on(TJPlacement.CONTENT_IS_READY, onContentReady);
      placement.requestContent();
    });
  } catch (e) {
    console.warn('[Tapjoy] showTapjoyPlacement 오류:', e);
    return {
      success: false,
      message: e instanceof Error ? e.message : 'Tapjoy SDK를 사용할 수 없습니다.',
    };
  }
};

export const isTapjoyReady = (): boolean => isTapjoyConnected;
