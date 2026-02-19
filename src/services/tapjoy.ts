

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
    const sdk = await import('tapjoy-react-native-sdk');
    const Tapjoy = sdk?.Tapjoy;
    const TJLoggingLevel = sdk?.TJLoggingLevel;
    if (!Tapjoy || typeof Tapjoy.connect !== 'function') {
      console.warn('[Tapjoy] SDK 로드 실패 (Tapjoy.connect 없음). Metro 캐시 리셋 후 재시도: npx react-native start --reset-cache');
      return false;
    }

    const flags: Record<string, string | number> = {
      TJC_OPTION_LOGGING_LEVEL: typeof __DEV__ !== 'undefined' && __DEV__ && TJLoggingLevel
        ? TJLoggingLevel.Debug
        : (TJLoggingLevel?.Error ?? 0),
    };
    if (userId && userId.trim()) flags.TJC_OPTION_USER_ID = userId;
    const onWarning = (event: { code?: string; message?: string }) => {
      console.warn('[Tapjoy] 연결 경고:', event?.code, event?.message);
    };
    await Tapjoy.connect(sdkKey, flags, onWarning);
    isTapjoyConnected = true;
    console.log('[Tapjoy] 연결 성공');
    return true;
  } catch (e) {
    console.warn('[Tapjoy] 연결 실패:', e);
    return false;
  }
};

const PLACEMENT_REQUEST_TIMEOUT_MS = 20000;

export const preloadTapjoyPlacement = async (placementName?: string): Promise<void> => {
  try {
    const name = placementName || getEnvValue('TAPJOY_PLACEMENT_NAME') || 'Offerwall';
    if (!isTapjoyConnected) return;
    const { NativeModules } = await import('react-native');
    const { TJPlacement } = await import('tapjoy-react-native-sdk');
    const placement = new TJPlacement(name);
    if (typeof NativeModules?.TapjoyReactNativeSdk?.setEntryPoint === 'function') {
      NativeModules.TapjoyReactNativeSdk.setEntryPoint(name, TAPJOY_ENTRY_POINT_OTHER);
    }
    placement.requestContent();
    console.log('[Tapjoy] 사전 요청(프리로드):', name);
  } catch {

  }
};

const TAPJOY_ENTRY_POINT_OTHER = 1;

export const showTapjoyPlacement = async (
  placementName?: string,
  onContentDismissed?: () => void
): Promise<{ success: boolean; message?: string }> => {
  try {
    const name = placementName || getEnvValue('TAPJOY_PLACEMENT_NAME') || 'Offerwall';
    const sdk = await import('tapjoy-react-native-sdk');
    const { Tapjoy, TJPlacement } = sdk;
    const setEntryPointNative = (await import('react-native')).NativeModules?.TapjoyReactNativeSdk?.setEntryPoint;

    if (!isTapjoyConnected) {
      const connected = await connectTapjoy();
      if (!connected) {
        return { success: false, message: 'Tapjoy SDK Key를 설정해 주세요.' };
      }
    }

    console.log('[Tapjoy] Placement 요청:', name);

    return new Promise((resolve) => {
      let settled = false;
      let requestSucceeded = false;
      const finish = (result: { success: boolean; message?: string }) => {
        if (settled) return;
        settled = true;
        clearTimeout(timeoutId);
        placement.off(TJPlacement.REQUEST_DID_SUCCEED, onRequestSucceed);
        placement.off(TJPlacement.REQUEST_DID_FAIL, onRequestFail);
        placement.off(TJPlacement.CONTENT_IS_READY, onContentReady);
        resolve(result);
      };

      const placement = new TJPlacement(name);

      if (typeof setEntryPointNative === 'function') {
        setEntryPointNative(name, TAPJOY_ENTRY_POINT_OTHER);
      }

      const timeoutId = setTimeout(() => {
        console.warn('[Tapjoy] Placement 응답 타임아웃:', name, requestSucceeded ? '(요청 성공, 콘텐츠 없음)' : '');
        finish({
          success: false,
          message: requestSucceeded
            ? '현재 참여 가능한 오퍼가 없습니다. 잠시 후 다시 시도해 주세요.'
            : '광고를 불러오는 데 시간이 걸립니다. 잠시 후 다시 시도해 주세요.',
        });
      }, PLACEMENT_REQUEST_TIMEOUT_MS);

      const onRequestFail = () => {
        const errMsg = placement.error || '광고를 불러올 수 없습니다.';
        console.warn('[Tapjoy] Placement 실패:', name, placement.error ?? '(error 없음)');
        finish({
          success: false,
          message: errMsg,
        });
      };

      const onRequestSucceed = () => {
        requestSucceeded = true;
        console.log('[Tapjoy] Placement 요청 성공(콘텐츠 대기):', name);
      };

      const onContentReady = () => {
        finish({ success: true });
        if (onContentDismissed) {
          placement.once(TJPlacement.CONTENT_DID_DISAPPEAR, () => {
            console.log('[Tapjoy] 오퍼월 닫힘 → 콜백 실행');
            onContentDismissed();

            preloadTapjoyPlacement(name).catch(() => {});
          });
        }
        placement.showContent();
      };

      placement.on(TJPlacement.REQUEST_DID_SUCCEED, onRequestSucceed);
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

let autoShowTapjoyRequested = false;
export const requestAutoShowTapjoy = (): void => {
  autoShowTapjoyRequested = true;
};
export const consumeAutoShowTapjoy = (): boolean => {
  const v = autoShowTapjoyRequested;
  autoShowTapjoyRequested = false;
  return v;
};
