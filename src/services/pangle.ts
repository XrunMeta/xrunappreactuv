

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

    if (isPangleInitialized && isPangleAvailable) {
      if (isPangleNativeModuleAvailable() && typeof PangleModule?.isReady === 'function') {
        try {
          const nativeReady = await PangleModule.isReady();
          if (nativeReady === true) {
            console.log('[Pangle] 이미 초기화되었습니다.');
            return;
          }
        } catch (e) {
          console.warn('[Pangle] 네이티브 준비 상태 확인 실패, 재초기화합니다.', e);
        }
        isPangleInitialized = false;
        isPangleAvailable = false;
      } else {
        console.log('[Pangle] 이미 초기화되었습니다.');
        return;
      }
    }

    if (!isPangleNativeModuleAvailable()) {

      if (Platform.OS === 'android') {
        console.log('[Pangle] Android에서는 Google Ad Manager 미디에이션을 통해 Pangle을 사용합니다.');
        isPangleAvailable = false;
        return;
      }

      console.warn('[Pangle] iOS 네이티브 모듈을 사용할 수 없습니다.');
      isPangleAvailable = false;
      return;
    }

    console.log('[Pangle] 네이티브 모듈 사용 가능:', {
      PangleModule: PangleModule !== null && PangleModule !== undefined,
      hasInitialize: typeof PangleModule?.initialize === 'function',
    });

    try {
      if (Platform.OS === 'android' || Platform.OS === 'ios') {
        const initPromise = PangleModule.initialize();
        const timeoutPromise = new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('Pangle 초기화 타임아웃')), 10000)
        );
        await Promise.race([initPromise, timeoutPromise]);
      }

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

    if (PangleModule && typeof PangleModule.isReady === 'function') {
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

  if (!isPangleInitialized || !isPangleAvailable) {
    return false;
  }

  if (Platform.OS === 'android') {
    return true;
  }

  if (Platform.OS === 'ios') {
    return isPangleNativeModuleAvailable();
  }

  return false;
};

export const getPangleRewardedAdUnitId = (): string => {
  if (Platform.OS === 'ios') {
    return getEnvValue('PANGLE_REWARDED_AD_UNIT_ID_IOS');
  }
  return getEnvValue('PANGLE_REWARDED_AD_UNIT_ID');
};

export const getPangleAppOpeningAdUnitId = (): string => {
  if (Platform.OS === 'ios') {
    return getEnvValue('PANGLE_APP_OPENING_AD_UNIT_ID_IOS');
  }
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

    if (Platform.OS === 'ios') {
      if (!isPangleNativeModuleAvailable()) {
        console.warn('[Pangle] iOS 네이티브 모듈을 사용할 수 없습니다.');
        return;
      }

      const finalAdUnitId = adUnitId || getPangleRewardedAdUnitId();
      if (!finalAdUnitId) {
        console.warn('[Pangle] iOS 보상형 광고 단위 ID가 설정되지 않았습니다.');
        return;
      }

      console.log('[Pangle] iOS 보상형 광고 로드 및 노출 시작:', finalAdUnitId);

      const pangleReady = await isPangleReady();
      if (!pangleReady) {
        console.warn('[Pangle] iOS Pangle SDK가 아직 준비되지 않았습니다. 초기화를 기다립니다.');

        await initializePangle();
        const recheckReady = await isPangleReady();
        if (!recheckReady) {
          console.error('[Pangle] iOS Pangle SDK 초기화 실패');
          if (onAdFailedToLoad) onAdFailedToLoad(new Error('Pangle SDK not ready'));
          return;
        }
      }

      const subscriptions: Array<() => void> = [];

      const rewardSubscription = pangleEventEmitter?.addListener(
        'onRewardedAdReward',
        (event: { rewardType: string; rewardAmount: number }) => {
          console.log('[Pangle] iOS 보상 획득:', event);
          if (onRewarded) {
            onRewarded({ type: event.rewardType, amount: event.rewardAmount });
          }
        }
      );
      if (rewardSubscription) subscriptions.push(() => rewardSubscription.remove());

      const closeSubscription = pangleEventEmitter?.addListener(
        'onRewardedAdClose',
        () => {
          console.log('[Pangle] iOS 보상형 광고 닫힘');
          if (onAdClosed) onAdClosed();
          subscriptions.forEach(unsubscribe => unsubscribe());
        }
      );
      if (closeSubscription) subscriptions.push(() => closeSubscription.remove());

      const errorSubscription = pangleEventEmitter?.addListener(
        'onRewardedAdLoadError',
        (event: { errorMsg: string }) => {
          console.error('[Pangle] iOS 보상형 광고 로드 실패:', event.errorMsg);
          if (onAdFailedToLoad) {
            onAdFailedToLoad(new Error(event.errorMsg));
          }
          subscriptions.forEach(unsubscribe => unsubscribe());
        }
      );
      if (errorSubscription) subscriptions.push(() => errorSubscription.remove());

      try {
        await PangleModule.loadRewardedAd(finalAdUnitId);
        await PangleModule.showRewardedAd(finalAdUnitId);
      } catch (loadOrShowError) {
        subscriptions.forEach(unsubscribe => unsubscribe());
        const msg =
          loadOrShowError instanceof Error ? loadOrShowError.message : String(loadOrShowError);
        console.error('[Pangle] iOS 보상형 로드/표시 실패:', msg);
        if (onAdFailedToLoad) onAdFailedToLoad(loadOrShowError as Error);
      }
      return;
    }

    if (Platform.OS !== 'android') {
      console.warn('[Pangle] Android 또는 iOS에서만 지원됩니다.');
      return;
    }

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
            if (onAdClosed) onAdClosed();
          }
        },
      );
      subscriptions.push(() => closeSubscription.remove());

      const loadedSubscription = pangleEventEmitter.addListener(
        'onRewardedAdLoaded',
        (event: { adUnitId: string }) => {
          if (event.adUnitId === finalAdUnitId) {
            console.log('[Pangle] 보상형 광고 로드 완료');
            if (PangleModule?.showRewardedAd) {
              PangleModule.showRewardedAd(finalAdUnitId).catch((error: Error) => {
                console.error('[Pangle] 보상형 광고 표시 실패:', error);
                subscriptions.forEach(unsubscribe => unsubscribe());
                if (onAdFailedToLoad) onAdFailedToLoad(error);
              });
            }
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
            subscriptions.forEach(unsubscribe => unsubscribe());
            if (onAdFailedToLoad) {
              onAdFailedToLoad(new Error(`보상형 광고 로드 실패: ${event.errorMsg} (${event.errorCode})`));
            }
          }
        },
      );
      subscriptions.push(() => errorSubscription.remove());
    }

    if (!PangleModule || !PangleModule.loadRewardedAd) {
      const error = new Error('Pangle 네이티브 모듈을 사용할 수 없습니다.');
      if (onAdFailedToLoad) onAdFailedToLoad(error);
      return;
    }

    try {
      await PangleModule.loadRewardedAd(finalAdUnitId);
    } catch (loadError) {
      if (pangleEventEmitter) {
        await new Promise(resolve => setTimeout(resolve, 100));
        if (errorHandledByEvent) return;

        const errorMessage = loadError instanceof Error ? loadError.message : String(loadError);
        console.warn('[Pangle] 보상형 광고 로드 promise reject (이벤트 미수신):', errorMessage);
        return;
      }

      const errorMessage = loadError instanceof Error ? loadError.message : String(loadError);
      subscriptions.forEach(unsubscribe => unsubscribe());
      if (onAdFailedToLoad) {
        onAdFailedToLoad(new Error(errorMessage));
      }
    }
  } catch (error) {
    console.error('[Pangle] 보상형 광고 전체 프로세스 오류:', error);
    if (onAdFailedToLoad) onAdFailedToLoad(error as Error);
  }
};

const APP_OPEN_AD_TIMEOUT_MS = 2000;

let appOpenAdLoaded = false;

export const loadAndShowAppOpenAd = async (): Promise<void> => {
  try {

    if (Platform.OS === 'ios') {
      if (!isPangleNativeModuleAvailable()) {
        console.warn('[Pangle] iOS 네이티브 모듈을 사용할 수 없습니다.');
        return;
      }

      if (typeof PangleModule.loadAndShowAppOpenAd !== 'function') {
        console.warn('[Pangle] iOS loadAndShowAppOpenAd 메서드가 아직 네이티브에 없습니다. 스킵합니다.');
        return;
      }

      const finalAdUnitId = getPangleAppOpeningAdUnitId();
      if (!finalAdUnitId) {
        console.warn('[Pangle] iOS 앱 오프닝 광고 단위 ID가 설정되지 않았습니다.');
        return;
      }

      console.log('[Pangle] iOS 앱 오프닝 광고 로드 및 노출 시작:', finalAdUnitId);

      const adStartTime = Date.now();
      const MIN_WAIT_MS = 2500; 

      type Sub = { remove: () => void } | undefined;
      const doResolve = (done: () => void, timeoutId: ReturnType<typeof setTimeout>, closeSub: Sub, errorSub: Sub) => {
        const elapsed = Date.now() - adStartTime;
        const delay = Math.max(0, MIN_WAIT_MS - elapsed);
        const cleanup = () => {
          closeSub?.remove();
          errorSub?.remove();
          clearTimeout(timeoutId);
          done();
        };
        if (delay > 0) setTimeout(cleanup, delay);
        else cleanup();
      };

      return new Promise((resolve) => {
        let isResolved = false;
        const resolveOnce = () => {
          if (!isResolved) {
            isResolved = true;
            resolve();
          }
        };

        const timeout = setTimeout(() => {
          if (!isResolved) {
            console.log('[Pangle] iOS 앱 오프닝 광고 대기 타임아웃');
            isResolved = true;
            closeSubscription?.remove();
            errorSubscription?.remove();
            resolve();
          }
        }, APP_OPEN_AD_TIMEOUT_MS);

        const closeSubscription = pangleEventEmitter?.addListener(
          'onAppOpenAdClose',
          () => {
            console.log('[Pangle] iOS 앱 오프닝 광고 닫힘 이벤트 수신');
            if (!isResolved) doResolve(resolveOnce, timeout, closeSubscription, errorSubscription);
          }
        );

        const errorSubscription = pangleEventEmitter?.addListener(
          'onAppOpenAdLoadError',
          () => {
            console.log('[Pangle] iOS 앱 오프닝 광고 에러 이벤트 수신');
            if (!isResolved) doResolve(resolveOnce, timeout, closeSubscription, errorSubscription);
          }
        );

        PangleModule.loadAndShowAppOpenAd(finalAdUnitId).catch((error: any) => {
          console.error('[Pangle] iOS 앱 오프닝 광고 호출 실패:', error);
          if (!isResolved) {
            isResolved = true;
            closeSubscription?.remove();
            errorSubscription?.remove();
            clearTimeout(timeout);
            resolve();
          }
        });
      });
    }

    if (Platform.OS !== 'android') {
      console.warn('[Pangle] 안드로이드 또는 iOS에서만 지원됩니다.');
      return;
    }

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

    return new Promise<void>((resolve) => {
      let isResolved = false;
      const cleanup = (reason: 'timeout' | 'close' | 'error' | 'load_reject') => {
        if (!isResolved) {
          isResolved = true;
          subscriptions.forEach(unsubscribe => unsubscribe());
          resolve();
        }
      };

      const timeout = setTimeout(() => cleanup('timeout'), APP_OPEN_AD_TIMEOUT_MS);

      const subscriptions: Array<() => void> = [];
      let errorHandledByEvent = false;

      if (pangleEventEmitter) {
        const loadedSubscription = pangleEventEmitter.addListener(
          'onAppOpenAdLoaded',
          (event: { adUnitId: string }) => {
            if (event.adUnitId === finalAdUnitId && !appOpenAdLoaded) {
              console.log('[Pangle] 앱 오프닝 광고 로드 완료');
              appOpenAdLoaded = true;
              if (PangleModule?.showAppOpenAd) {
                PangleModule.showAppOpenAd(finalAdUnitId).catch((error: Error) => {
                  console.error('[Pangle] 앱 오프닝 광고 표시 실패:', error);
                  cleanup('load_reject');
                });
              }
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
              clearTimeout(timeout);
              cleanup('close');
            }
          },
        );
        subscriptions.push(() => closeSubscription.remove());

        const errorSubscription = pangleEventEmitter.addListener(
          'onAppOpenAdLoadError',
          (event: { adUnitId: string; errorCode: number; errorMsg: string }) => {
            if (event.adUnitId === finalAdUnitId) {
              errorHandledByEvent = true;
              console.error('[Pangle] 앱 오프닝 광고 로드 실패:', event.errorMsg, `(${event.errorCode})`);

              if (event.errorCode === 40006) {
                console.warn('[Pangle] 해결 방법:', {
                  '1': 'Pangle 대시보드에서 광고 단위가 "사용 중" 상태인지 확인',
                  '2': '광고 단위가 App ID 8747763에 연결되어 있는지 확인',
                  '3': '몇 분 후 다시 시도 (광고 단위 활성화 지연 가능)',
                });
              }

              clearTimeout(timeout);
              cleanup('error');
            }
          },
        );
        subscriptions.push(() => errorSubscription.remove());
      }

      if (!PangleModule || !PangleModule.loadAppOpenAd) {
        console.log('[Pangle] 네이티브 모듈을 사용할 수 없습니다. Android에서는 Google Ad Manager 미디에이션을 사용하세요.');
        cleanup('error');
        return;
      }

      PangleModule.loadAppOpenAd(finalAdUnitId).catch((loadError: any) => {
        const errorMessage = loadError instanceof Error ? loadError.message : String(loadError);
        console.warn('[Pangle] 앱 오프닝 광고 로드 호출 실패:', errorMessage);
        if (!errorHandledByEvent) {
          cleanup('load_reject');
        }
      });

    });
  } catch (error) {
    appOpenAdLoaded = false;
    const errorMessage = error instanceof Error ? error.message : String(error);

    if (errorMessage.includes('40006')) {
      console.warn('[Pangle] 앱 오프닝 광고 단위 ID가 유효하지 않습니다. 광고 단위가 아직 완전히 활성화되지 않았을 수 있습니다. 잠시 후 다시 시도하세요.');
      console.warn('[Pangle] 해결 방법:', {
        '1': 'Pangle 대시보드에서 광고 단위가 "사용 중" 상태인지 확인',
        '2': '광고 단위가 App ID 8747763에 연결되어 있는지 확인',
        '3': '몇 분 후 다시 시도 (광고 단위 활성화 지연 가능)',
      });
    } else if (errorMessage.includes('40034') || errorMessage.includes('지원되지 않')) {
      console.warn('[Pangle] 앱 오프닝 광고가 현재 SDK 버전에서 지원되지 않거나 광고 단위 ID가 올바르지 않습니다. 앱은 계속 실행됩니다.');
    } else {
      console.error('[Pangle] 앱 오프닝 광고 프로세스 중 오류:', error);
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

export const showNativeScreen = async (): Promise<any> => {
  if (Platform.OS !== 'ios') {
    return { success: false, message: 'iOS에서만 지원됩니다.' };
  }
  if (!isPangleNativeModuleAvailable()) {
    throw new Error('Pangle 네이티브 모듈을 사용할 수 없습니다.');
  }
  return await PangleModule.showNativeScreen();
};

export const loadAndShowInterstitialAd = async (slotId: string = '982684319'): Promise<any> => {
  if (Platform.OS !== 'ios') {
    return { success: false, message: 'iOS에서만 지원됩니다.' };
  }
  if (!isPangleNativeModuleAvailable()) {
    throw new Error('Pangle 네이티브 모듈을 사용할 수 없습니다.');
  }
  return await PangleModule.loadAndShowInterstitialAd(slotId);
};

export const loadAndShowNativeAd = async (slotId: string = '982684334'): Promise<any> => {
  if (Platform.OS !== 'ios') {
    return { success: false, message: 'iOS에서만 지원됩니다.' };
  }
  if (!isPangleNativeModuleAvailable()) {
    throw new Error('Pangle 네이티브 모듈을 사용할 수 없습니다.');
  }
  return await PangleModule.loadAndShowNativeAd(slotId);
};

