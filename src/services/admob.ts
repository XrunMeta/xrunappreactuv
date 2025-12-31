

import { Platform } from 'react-native';
import mobileAds, { 
  InterstitialAd, 
  AdEventType, 
  RewardedAd, 
  RewardedAdEventType,
  AppOpenAd,
  TestIds,
} from 'react-native-google-mobile-ads';
import { getEnvValue, getEnv } from '../utils/env';
import { DeviceInfo } from '../types';

let isAdMobInitialized = false;
let isAdMobAvailable = false;

export const isAdMobNativeModuleAvailable = (): boolean => {
  try {

    return isAdMobAvailable;
  } catch (error) {
    return false;
  }
};

export const initializeAdMob = async (): Promise<void> => {
  try {

    if (isAdMobInitialized) {
      console.log('[AdMob] 이미 초기화되었습니다.');
      return;
    }

    try {

      if (!mobileAds || typeof mobileAds !== 'function') {
        console.warn('[AdMob] 네이티브 모듈을 사용할 수 없습니다. mobileAds 함수가 없습니다.');
        isAdMobAvailable = false;
        return;
      }
    } catch (moduleError) {
      console.warn('[AdMob] 네이티브 모듈을 로드할 수 없습니다:', moduleError);
      isAdMobAvailable = false;
      return;
    }

    let appId: string | undefined;
    try {
      appId = Platform.OS === 'android' 
        ? getEnvValue('ADMOB_APPID')
        : getEnvValue('ADMOB_APPID_IOS');
    } catch (envError) {
      console.warn('[AdMob] 환경 변수 로드 실패:', envError);
      isAdMobAvailable = false;
      return;
    }

    if (!appId) {
      console.warn('[AdMob] App ID가 설정되지 않았습니다.');
      isAdMobAvailable = false;
      return;
    }

    try {
      const initPromise = mobileAds().initialize();
      const timeoutPromise = new Promise<never>((_, reject) => 
        setTimeout(() => reject(new Error('AdMob 초기화 타임아웃')), 10000)
      );

      await Promise.race([initPromise, timeoutPromise]);

      try {
        await mobileAds().setRequestConfiguration({

          testDeviceIdentifiers: [],
        });
      } catch (configError) {
        console.warn('[AdMob] RequestConfiguration 설정 실패 (계속 진행):', configError);
      }

      isAdMobInitialized = true;
      isAdMobAvailable = true;

      console.log('[AdMob] 초기화 완료:', {
        appId,
        platform: Platform.OS,
      });
    } catch (initError) {
      console.error('[AdMob] 초기화 중 오류 발생:', initError);
      isAdMobAvailable = false;
      isAdMobInitialized = false;

    }
  } catch (error) {
    console.error('[AdMob] 초기화 실패 (앱은 계속 실행됩니다):', error);
    isAdMobAvailable = false;
    isAdMobInitialized = false;

  }
};

export const getAdMobAppId = (): string => {
  return Platform.OS === 'android'
    ? getEnvValue('ADMOB_APPID')
    : getEnvValue('ADMOB_APPID_IOS');
};

export const getAdMobAdUnitId = (): string => {
  return Platform.OS === 'android'
    ? getEnvValue('ADMOB_ADUNIT_ANDROID')
    : getEnvValue('ADMOB_ADUNIT_IOS');
};

export const loadAndShowInterstitialAd = async (
  adUnitId: string,
  onAdClosed?: () => void,
  onAdFailedToLoad?: (error: Error) => void,
): Promise<void> => {
  try {
    if (!isAdMobAvailable) {
      console.warn('[AdMob] AdMob이 사용 불가능합니다.');
      return;
    }

    const interstitial = InterstitialAd.createForAdRequest(adUnitId, {
      requestNonPersonalizedAdsOnly: false,
    });

    const unsubscribeLoaded = interstitial.addAdEventListener(
      AdEventType.LOADED,
      () => {
        console.log('[AdMob] 전면 광고 로드 완료');
        interstitial.show();
      },
    );

    const unsubscribeClosed = interstitial.addAdEventListener(
      AdEventType.CLOSED,
      () => {
        console.log('[AdMob] 전면 광고 닫힘');
        unsubscribeLoaded();
        unsubscribeClosed();
        if (onAdClosed) {
          onAdClosed();
        }
      },
    );

    const unsubscribeFailedToLoad = interstitial.addAdEventListener(
      AdEventType.ERROR,
      (error) => {
        console.error('[AdMob] 전면 광고 로드 실패:', error);
        unsubscribeLoaded();
        unsubscribeClosed();
        unsubscribeFailedToLoad();
        if (onAdFailedToLoad) {
          onAdFailedToLoad(error as Error);
        }
      },
    );

    await interstitial.load();
  } catch (error) {
    console.error('[AdMob] 전면 광고 로드 중 오류:', error);
    if (onAdFailedToLoad) {
      onAdFailedToLoad(error as Error);
    }
  }
};

export const sendPangleCallback = async (
  member: string,
  deviceInfo: DeviceInfo,
  reward: { type: string; amount: number },
  adUnitId: string,
): Promise<any> => {
  try {
    const env = getEnv();

    const url = env.PANGLE_CALLBACK_URL || `${env.GATEWAY_NODEJS}/callbackPangle`;
    const securityKey = env.PANGLE_SECURITY_KEY;

    const callbackData = {
      app_id: env.PANGLE_APP_ID,
      ad_unit_id: adUnitId,
      user_id: member,
      reward_name: reward.type || 'XRUN',
      reward_amount: reward.amount || 1,
      device_id: deviceInfo.deviceId || '',
      adid: deviceInfo.adid || '',
      os: deviceInfo.os || Platform.OS === 'android' ? 'android' : 'ios',
      os_version: deviceInfo.osVersion || '',
      timestamp: Math.floor(Date.now() / 1000),
      security_key: securityKey,
    };

    console.log('[AdMob] Pangle 콜백 전송:', callbackData);

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${env.GATEWAY_AUTH_CODE}`,
      },
      body: JSON.stringify(callbackData),
    });

    const responseText = await response.text();
    console.log('[AdMob] Pangle 콜백 응답 (원본):', {
      status: response.status,
      statusText: response.statusText,
      contentType: response.headers.get('content-type'),
      text: responseText.substring(0, 200), 
    });

    let result: any;
    try {
      result = JSON.parse(responseText);
      console.log('[AdMob] Pangle 콜백 응답 (파싱됨):', result);
    } catch (parseError) {

      console.warn('[AdMob] Pangle 콜백 응답이 JSON이 아닙니다:', parseError);

      if (response.ok) {
        console.log('[AdMob] Pangle 콜백 전송 성공 (비JSON 응답)');
        return { success: true, message: '콜백 전송 완료 (비JSON 응답)' };
      }
      throw new Error(`콜백 응답 파싱 실패: ${responseText.substring(0, 100)}`);
    }

    return result;
  } catch (error) {
    console.error('[AdMob] Pangle 콜백 전송 실패:', error);
    throw error;
  }
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
    if (!isAdMobAvailable) {
      console.warn('[AdMob] AdMob이 사용 불가능합니다.');
      return;
    }

    let finalAdUnitId: string;
    if (__DEV__) {

      finalAdUnitId = TestIds.REWARDED;
      console.log('[AdMob] 개발 모드: 테스트 광고 단위 ID 사용');
    } else {

      finalAdUnitId = adUnitId || getEnvValue('ADMOB_MEDIATION_GROUP_ID') || getAdMobAdUnitId();
    }

    console.log('[AdMob] 사용할 광고 단위 ID:', finalAdUnitId);
    console.log('[AdMob] 광고 단위 ID 출처:', {
      개발모드: __DEV__,
      adUnitId: adUnitId || '없음',
      mediationGroupId: getEnvValue('ADMOB_MEDIATION_GROUP_ID') || '없음',
      defaultAdUnitId: getAdMobAdUnitId() || '없음',
    });

    const rewarded = RewardedAd.createForAdRequest(finalAdUnitId, {
      requestNonPersonalizedAdsOnly: false,
    });

    const unsubscribeRewarded = rewarded.addAdEventListener(
      RewardedAdEventType.EARNED_REWARD,
      async (reward) => {
        console.log('[AdMob] 보상 수령:', reward);

        if (onRewarded) {
          onRewarded(reward);
        }
      },
    );

    const unsubscribeLoaded = rewarded.addAdEventListener(
      RewardedAdEventType.LOADED,
      () => {
        console.log('[AdMob] 보상형 광고 로드 완료');
        rewarded.show();
      },
    );

    const unsubscribeClosed = rewarded.addAdEventListener(
      AdEventType.CLOSED,
      () => {
        console.log('[AdMob] 보상형 광고 닫힘');
        unsubscribeRewarded();
        unsubscribeLoaded();
        unsubscribeClosed();
        if (onAdClosed) {
          onAdClosed();
        }
      },
    );

    const unsubscribeFailedToLoad = rewarded.addAdEventListener(
      AdEventType.ERROR,
      (error) => {
        console.error('[AdMob] 보상형 광고 로드 실패:', error);
        unsubscribeRewarded();
        unsubscribeLoaded();
        unsubscribeClosed();
        unsubscribeFailedToLoad();
        if (onAdFailedToLoad) {
          onAdFailedToLoad(error as Error);
        }
      },
    );

    await rewarded.load();
  } catch (error) {
    console.error('[AdMob] 보상형 광고 로드 중 오류:', error);
    if (onAdFailedToLoad) {
      onAdFailedToLoad(error as Error);
    }
  }
};

export const isAdMobReady = (): boolean => {
  return isAdMobInitialized && isAdMobAvailable;
};

export const getPangleRewardedAdUnitId = (): string => {
  return getEnvValue('PANGLE_REWARDED_AD_UNIT_ID');
};

export const getAdMobMediationGroupId = (): string => {
  return getEnvValue('ADMOB_MEDIATION_GROUP_ID') || getAdMobAdUnitId();
};

export const getPangleAppOpeningAdUnitId = (): string => {
  return getEnvValue('PANGLE_APP_OPENING_AD_UNIT_ID');
};

let appOpenAd: AppOpenAd | null = null;

export const loadAndShowAppOpenAd = async (): Promise<void> => {
  try {
    if (!isAdMobAvailable) {
      console.warn('[AdMob] AdMob이 사용 불가능합니다. 앱 오프닝 광고를 표시할 수 없습니다.');
      return;
    }

    let finalAdUnitId: string;
    if (__DEV__) {
      finalAdUnitId = TestIds.APP_OPEN;
      console.log('[AdMob] 개발 모드: 테스트 앱 오프닝 광고 단위 ID 사용');
    } else {
      finalAdUnitId = getPangleAppOpeningAdUnitId();
    }

    if (!finalAdUnitId) {
      console.warn('[AdMob] 앱 오프닝 광고 단위 ID가 설정되지 않았습니다.');
      return;
    }

    console.log('[AdMob] 앱 오프닝 광고 로드 시작:', finalAdUnitId);

    appOpenAd = AppOpenAd.createForAdRequest(finalAdUnitId, {
      requestNonPersonalizedAdsOnly: false,
    });

    const unsubscribeLoaded = appOpenAd.addAdEventListener(
      AdEventType.LOADED,
      () => {
        console.log('[AdMob] 앱 오프닝 광고 로드 완료');

        if (appOpenAd) {
          appOpenAd.show();
        }
      },
    );

    const unsubscribeOpened = appOpenAd.addAdEventListener(
      AdEventType.OPENED,
      () => {
        console.log('[AdMob] 앱 오프닝 광고 표시됨');
      },
    );

    const unsubscribeClosed = appOpenAd.addAdEventListener(
      AdEventType.CLOSED,
      () => {
        console.log('[AdMob] 앱 오프닝 광고 닫힘');

        unsubscribeLoaded();
        unsubscribeOpened();
        unsubscribeClosed();
        appOpenAd = null;
      },
    );

    const unsubscribeFailedToLoad = appOpenAd.addAdEventListener(
      AdEventType.ERROR,
      (error) => {
        console.error('[AdMob] 앱 오프닝 광고 로드 실패:', error);

        unsubscribeLoaded();
        unsubscribeOpened();
        unsubscribeClosed();
        unsubscribeFailedToLoad();
        appOpenAd = null;
      },
    );

    appOpenAd.load();
  } catch (error) {
    console.error('[AdMob] 앱 오프닝 광고 로드 중 오류:', error);
    appOpenAd = null;
  }
};

