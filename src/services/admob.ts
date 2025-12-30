

import { Platform } from 'react-native';
import mobileAds, { 
  InterstitialAd, 
  AdEventType, 
  RewardedAd, 
  RewardedAdEventType,
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
    const url = env.PANGLE_CALLBACK_URL || 'https://oth-path-app.example.invalid/nodeServerTest/gateway/callbackPangle';
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

    const result = await response.json();
    console.log('[AdMob] Pangle 콜백 응답:', result);
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

    const finalAdUnitId = adUnitId || getEnvValue('ADMOB_MEDIATION_GROUP_ID') || getAdMobAdUnitId();

    console.log('[AdMob] 사용할 광고 단위 ID:', finalAdUnitId);
    console.log('[AdMob] 광고 단위 ID 출처:', {
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

        if (member && deviceInfo) {
          try {
            await sendPangleCallback(member, deviceInfo, reward, finalAdUnitId);
            console.log('[AdMob] Pangle 콜백 전송 완료');
          } catch (callbackError) {
            console.error('[AdMob] Pangle 콜백 전송 실패 (보상은 수령됨):', callbackError);

          }
        }

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

