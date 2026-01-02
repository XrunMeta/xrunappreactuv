

import { Platform, NativeModules, NativeEventEmitter } from 'react-native';
import { getEnvValue, getEnv } from '../utils/env';
import { DeviceInfo } from '../types';

const { PangleModule } = NativeModules;
const pangleEventEmitter = PangleModule ? new NativeEventEmitter(PangleModule) : null;

let isPangleInitialized = false;
let isPangleAvailable = false;

export const isPangleNativeModuleAvailable = (): boolean => {
  try {
    return PangleModule !== null && PangleModule !== undefined;
  } catch (error) {
    return false;
  }
};

export const initializePangle = async (): Promise<void> => {
  try {

    if (isPangleInitialized) {
      console.log('[Pangle] 이미 초기화되었습니다.');
      return;
    }

    if (!isPangleNativeModuleAvailable()) {
      console.warn('[Pangle] 네이티브 모듈을 사용할 수 없습니다.');
      console.warn('[Pangle] PangleModule이 null이거나 undefined입니다.');
      console.warn('[Pangle] 네이티브 모듈이 제대로 등록되었는지 확인하세요.');
      isPangleAvailable = false;
      return;
    }

    console.log('[Pangle] 네이티브 모듈 사용 가능:', {
      PangleModule: PangleModule !== null && PangleModule !== undefined,
      hasInitialize: typeof PangleModule?.initialize === 'function',
    });

    try {
      const initPromise = PangleModule.initialize();
      const timeoutPromise = new Promise<never>((_, reject) => 
        setTimeout(() => reject(new Error('Pangle 초기화 타임아웃')), 10000)
      );

      await Promise.race([initPromise, timeoutPromise]);

      isPangleInitialized = true;
      isPangleAvailable = true;
      console.log('[Pangle] 초기화 완료');
    } catch (initError) {
      console.error('[Pangle] 초기화 실패:', initError);
      isPangleAvailable = false;
      throw initError;
    }
  } catch (error) {
    console.error('[Pangle] 초기화 중 오류:', error);
    isPangleAvailable = false;

  }
};

export const isPangleReady = async (): Promise<boolean> => {
  try {
    if (!isPangleInitialized || !isPangleAvailable) {
      return false;
    }

    if (PangleModule && PangleModule.isReady) {
      const nativeReady = await PangleModule.isReady();
      return nativeReady === true;
    }

    return isPangleInitialized && isPangleAvailable;
  } catch (error) {
    console.error('[Pangle] 초기화 상태 확인 중 오류:', error);
    return false;
  }
};

export const isPangleReadySync = (): boolean => {
  return isPangleInitialized && isPangleAvailable;
};

export const getPangleRewardedAdUnitId = (): string => {
  return getEnvValue('PANGLE_REWARDED_AD_UNIT_ID');
};

export const getPangleAppOpeningAdUnitId = (): string => {
  return getEnvValue('PANGLE_APP_OPENING_AD_UNIT_ID');
};

export const loadAndShowRewardedAd = async (
  adUnitId?: string,
  member?: string,
  deviceInfo?: DeviceInfo,
  onRewarded?: (reward: { type: string; amount: number }) => void,
  onAdClosed?: () => void,
  onAdFailedToLoad?: (error: Error) => void,
): Promise<void> => {
  try {
    if (!isPangleAvailable) {
      console.warn('[Pangle] Pangle이 사용 불가능합니다.');
      if (onAdFailedToLoad) {
        onAdFailedToLoad(new Error('Pangle이 초기화되지 않았습니다.'));
      }
      return;
    }

    const finalAdUnitId = adUnitId || getPangleRewardedAdUnitId();

    if (!finalAdUnitId) {
      const error = new Error('Pangle 보상형 광고 단위 ID가 설정되지 않았습니다.');
      console.error('[Pangle]', error.message);
      if (onAdFailedToLoad) {
        onAdFailedToLoad(error);
      }
      return;
    }

    console.log('[Pangle] 보상형 광고 로드 시작:', finalAdUnitId);

    const subscriptions: Array<() => void> = [];
    let errorHandledByEvent = false; 

    if (pangleEventEmitter) {

      const rewardSubscription = pangleEventEmitter.addListener(
        'onRewardedAdReward',
        (event: { type: string; amount: number; adUnitId: string }) => {
          if (event.adUnitId === finalAdUnitId) {
            console.log('[Pangle] 보상 수령:', event);
            if (onRewarded) {
              onRewarded({ type: event.type, amount: event.amount });
            }
          }
        },
      );
      subscriptions.push(() => rewardSubscription.remove());

      const closeSubscription = pangleEventEmitter.addListener(
        'onRewardedAdClose',
        (event: { adUnitId: string }) => {
          if (event.adUnitId === finalAdUnitId) {
            console.log('[Pangle] 보상형 광고 닫힘');

            subscriptions.forEach(unsubscribe => unsubscribe());
            if (onAdClosed) {
              onAdClosed();
            }
          }
        },
      );
      subscriptions.push(() => closeSubscription.remove());

      const loadedSubscription = pangleEventEmitter.addListener(
        'onRewardedAdLoaded',
        (event: { adUnitId: string }) => {
          if (event.adUnitId === finalAdUnitId) {
            console.log('[Pangle] 보상형 광고 로드 완료');

            PangleModule.showRewardedAd(finalAdUnitId).catch((error: Error) => {
              console.error('[Pangle] 보상형 광고 표시 실패:', error);
              subscriptions.forEach(unsubscribe => unsubscribe());
              if (onAdFailedToLoad) {
                onAdFailedToLoad(error);
              }
            });
          }
        },
      );
      subscriptions.push(() => loadedSubscription.remove());

      const errorSubscription = pangleEventEmitter.addListener(
        'onRewardedAdLoadError',
        (event: { adUnitId: string; errorCode: number; errorMsg: string }) => {
          if (event.adUnitId === finalAdUnitId) {
            errorHandledByEvent = true; 
            console.error('[Pangle] 보상형 광고 로드 실패:', event.errorMsg, `(${event.errorCode})`);

            if (event.errorCode === 40034) {
              console.warn('[Pangle] 해결 방법:', {
                '1': 'Pangle 대시보드에서 광고 단위 ID가 올바른지 확인',
                '2': '광고 형식(보상형 광고)이 활성화되어 있는지 확인',
                '3': 'App ID와 App Key가 올바른지 확인',
                '4': '네트워크 연결 상태 확인',
              });
            }

            subscriptions.forEach(unsubscribe => unsubscribe());
            if (onAdFailedToLoad) {
              onAdFailedToLoad(new Error(`보상형 광고 로드 실패: ${event.errorMsg} (${event.errorCode})`));
            }
          }
        },
      );
      subscriptions.push(() => errorSubscription.remove());
    }

    try {
      await PangleModule.loadRewardedAd(finalAdUnitId);
    } catch (loadError) {

      if (pangleEventEmitter) {

        await new Promise(resolve => setTimeout(resolve, 100));

        if (errorHandledByEvent) {
          return; 
        }

        const errorMessage = loadError instanceof Error ? loadError.message : String(loadError);
        console.warn('[Pangle] 보상형 광고 로드 promise reject (이벤트 리스너 있음, 이벤트 미수신):', errorMessage);

        return;
      }

      const errorMessage = loadError instanceof Error ? loadError.message : String(loadError);
      console.error('[Pangle] 보상형 광고 로드 promise 실패 (이벤트 리스너 없음):', loadError);

      let userFriendlyMessage = errorMessage;
      if (errorMessage.includes('40034')) {
        userFriendlyMessage = `Pangle 서버 오류 (40034): 광고 단위 ID(${finalAdUnitId})가 올바르지 않거나 Pangle 대시보드에서 활성화되지 않았을 수 있습니다. Pangle 대시보드를 확인해주세요.`;
        console.warn('[Pangle] 해결 방법:', {
          '1': 'Pangle 대시보드에서 광고 단위 ID가 올바른지 확인',
          '2': '광고 형식(보상형 광고)이 활성화되어 있는지 확인',
          '3': 'App ID와 App Key가 올바른지 확인',
          '4': '네트워크 연결 상태 확인',
        });
      }

      subscriptions.forEach(unsubscribe => unsubscribe());
      if (onAdFailedToLoad) {
        onAdFailedToLoad(new Error(userFriendlyMessage));
      }
    }
  } catch (error) {
    console.error('[Pangle] 보상형 광고 로드 중 오류:', error);
    if (onAdFailedToLoad) {
      onAdFailedToLoad(error as Error);
    }
  }
};

let appOpenAdLoaded = false;

export const loadAndShowAppOpenAd = async (): Promise<void> => {
  try {
    if (!isPangleAvailable) {
      console.warn('[Pangle] Pangle이 사용 불가능합니다. 앱 오프닝 광고를 표시할 수 없습니다.');
      return;
    }

    const finalAdUnitId = getPangleAppOpeningAdUnitId();

    if (!finalAdUnitId) {
      console.warn('[Pangle] 앱 오프닝 광고 단위 ID가 설정되지 않았습니다.');
      return;
    }

    console.log('[Pangle] 앱 오프닝 광고 로드 시작:', finalAdUnitId);

    const subscriptions: Array<() => void> = [];

    if (pangleEventEmitter) {

      const loadedSubscription = pangleEventEmitter.addListener(
        'onAppOpenAdLoaded',
        (event: { adUnitId: string }) => {
          if (event.adUnitId === finalAdUnitId && !appOpenAdLoaded) {
            console.log('[Pangle] 앱 오프닝 광고 로드 완료');
            appOpenAdLoaded = true;

            PangleModule.showAppOpenAd(finalAdUnitId).catch((error: Error) => {
              console.error('[Pangle] 앱 오프닝 광고 표시 실패:', error);
              subscriptions.forEach(unsubscribe => unsubscribe());
            });
          }
        },
      );
      subscriptions.push(() => loadedSubscription.remove());

      const closeSubscription = pangleEventEmitter.addListener(
        'onAppOpenAdClose',
        (event: { adUnitId: string }) => {
          if (event.adUnitId === finalAdUnitId) {
            console.log('[Pangle] 앱 오프닝 광고 닫힘');
            appOpenAdLoaded = false;
            subscriptions.forEach(unsubscribe => unsubscribe());
          }
        },
      );
      subscriptions.push(() => closeSubscription.remove());
    }

    await PangleModule.loadAppOpenAd(finalAdUnitId);
  } catch (error) {
    appOpenAdLoaded = false;
    const errorMessage = error instanceof Error ? error.message : String(error);

    if (errorMessage.includes('40034') || errorMessage.includes('지원되지 않')) {
      console.warn('[Pangle] 앱 오프닝 광고가 현재 SDK 버전에서 지원되지 않거나 광고 단위 ID가 올바르지 않습니다. 앱은 계속 실행됩니다.');
    } else {
      console.error('[Pangle] 앱 오프닝 광고 로드 중 오류:', error);
    }
  }
};

export const sendPangleCallback = async (
  member: string,
  deviceInfo: DeviceInfo,
  reward: { type: string; amount: number },
  adUnitId: string,
): Promise<any> => {

  console.log('[Pangle] 콜백 전송 스킵 (리워드 제공 안 함)');
  return { success: true, message: '콜백 전송 스킵됨' };
};

