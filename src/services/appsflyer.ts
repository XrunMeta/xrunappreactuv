

import { NativeModules } from 'react-native';
import appsFlyer from 'react-native-appsflyer';

export const APPSFLYER_EVENT_REWARDED_AD_COMPLETED = 'rewarded_ad_completed';
export const APPSFLYER_PARAM_AD_NETWORK = 'ad_network';

export type AppsFlyerAdNetwork = 'pangle' | 'nasmedia' | 'point_click' | 'tapjoy';

export function getAppsFlyerAdNetworkFromCompany(adCompany: string): AppsFlyerAdNetwork {
  const c = (adCompany || '').toLowerCase();
  if (c === 'tapjoy') return 'tapjoy';
  if (c === 'pock' || c === 'pointclick') return 'point_click';
  if (c === 'pangle') return 'pangle';
  return 'nasmedia';
}

function isAppsFlyerNativeReady(): boolean {
  const RNAppsFlyer = NativeModules.RNAppsFlyer;
  return RNAppsFlyer != null && typeof RNAppsFlyer.logEvent === 'function';
}

export function logRewardedAdCompleted(adNetwork: AppsFlyerAdNetwork): void {
  const eventValues = { [APPSFLYER_PARAM_AD_NETWORK]: adNetwork };
  console.log('[AppsFlyer] logRewardedAdCompleted 호출:', adNetwork);
  const trySend = (attempt = 0) => {
    const maxAttempts = 10;
    const delays = [0, 150, 300, 500, 800, 1200, 1600, 2000, 2500, 3000];
    const delay = delays[Math.min(attempt, delays.length - 1)];
    setTimeout(() => {
      if (attempt > 0) {
        console.log('[AppsFlyer] 재시도:', attempt, '/', maxAttempts - 1);
      }
      if (isAppsFlyerNativeReady()) {
        console.log('[AppsFlyer] 이벤트 전송 시도:', APPSFLYER_EVENT_REWARDED_AD_COMPLETED, eventValues);
        try {
          appsFlyer.logEvent(
            APPSFLYER_EVENT_REWARDED_AD_COMPLETED,
            eventValues,
            () => {
              console.log('[AppsFlyer] logRewardedAdCompleted 전송 성공:', adNetwork);
            },
            (e: unknown) => {
              console.warn('[AppsFlyer] logRewardedAdCompleted 실패:', e);
            },
          );
        } catch (e) {
          console.warn('[AppsFlyer] logRewardedAdCompleted 실패:', e);
        }
      } else if (attempt < maxAttempts - 1) {
        console.warn('[AppsFlyer] 네이티브 모듈 미준비, 재시도 예정');
        trySend(attempt + 1);
      } else {
        console.warn('[AppsFlyer] logRewardedAdCompleted 포기 (네이티브 모듈 미준비)');
      }
    }, delay);
  };
  trySend(0);
}
