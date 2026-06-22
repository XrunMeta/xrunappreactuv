import { Platform } from 'react-native';
import * as Application from 'expo-application';
import * as Linking from 'expo-linking';
import Constants from 'expo-constants';
import { getEnv } from '../utils/env';

const IOS_BUNDLE_ID = 'run.xrun.xrunapps';

const ANDROID_PACKAGE_NAME = 'run.xrun.xrunapp';

interface ServerCheckResponse {
  status: string;
  code: number;
  message: string;
  data: {
    id: number;
    iosOnWallet: boolean | number; 
    androidOnWallet?: number; 
    created_at: string;
    updated_at: string;
    isTransferAble: number;
    server_status: string;
    version: number; 
    version_ios: number; 
    iosOnGuide?: number; 
  };
}

const SERVERCHECK_CACHE_MS = 30000; 
let servercheckCache: { result: ServerCheckResponse; at: number } | null = null;

export const invalidateServerVersionCache = (): void => {
  servercheckCache = null;
};

export const checkServerVersion = async (): Promise<ServerCheckResponse | null> => {
  const now = Date.now();
  if (servercheckCache && now - servercheckCache.at < SERVERCHECK_CACHE_MS) {
    return servercheckCache.result;
  }
  const BOOT_SLOW_LOG = '[!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!부팅 느림]';
  const t0 = Date.now();
  try {
    console.log(BOOT_SLOW_LOG, '[VersionCheck] 서버 버전 확인 시작');
    const env = getEnv();
    const baseUrl = env.USE_WORKERS_API === 'true' ? env.GATEWAY_WORKERS : env.GATEWAY_NODEJS;
    const url = `${baseUrl}/servercheck`;
    const res = await fetch(url, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${env.GATEWAY_AUTH_CODE}` },
    });
    if (!res.ok) return null;
    const response = await res.json();
    if (response && response.status === 'success' && response.data) {
      console.log(BOOT_SLOW_LOG, '[VersionCheck] 서버 버전 확인 완료', `${Date.now() - t0}ms`, response.data);
      servercheckCache = { result: response as ServerCheckResponse, at: Date.now() };
      return servercheckCache.result;
    }
    return null;
  } catch (error) {
    console.error(BOOT_SLOW_LOG, '[VersionCheck] 서버 버전 확인 실패', `${Date.now() - t0}ms`, error);
    return null;
  }
};

export const getCurrentAppVersionNumber = (): number => {
  try {
    console.log('[VersionCheck] 현재 앱 버전 숫자 가져오기:', Platform.OS);
    if (Platform.OS === 'android') {

      const buildVersion = Application.nativeBuildVersion;
      if (buildVersion) {
        return parseInt(buildVersion, 10);
      }
      console.log('[VersionCheck] Android 버전 숫자 가져오기:', buildVersion);

      return Constants.expoConfig?.android?.versionCode || 0;
    } else if (Platform.OS === 'ios') {

      const version = Application.nativeApplicationVersion || Constants.expoConfig?.version || '0.0.0';
      const parts = version.split('.');

      const major = parseInt(parts[0] || '0', 10);
      const minor = parseInt(parts[1] || '0', 10);
      const patch = parseInt(parts[2] || '0', 10);
      console.log('[VersionCheck] iOS 버전 숫자 가져오기:', major * 100 + minor * 10 + patch);
      return major * 100 + minor * 10 + patch;
    }
    return 0;
  } catch (error) {
    console.error('[VersionCheck] 현재 앱 버전 숫자 가져오기 실패:', error);
    return 0;
  }
};

const checkIOSVersion = async (): Promise<string | null> => {
  try {
    const url = `https://itunes.apple.com/lookup?bundleId=${IOS_BUNDLE_ID}`;
    const response = await fetch(url);
    const data = await response.json();

    if (data.results && data.results.length > 0) {
      const latestVersion = data.results[0].version;
      return latestVersion;
    }
    return null;
  } catch (error) {
    console.error('[VersionCheck] iOS 버전 확인 실패:', error);
    return null;
  }
};

const checkAndroidVersion = async (): Promise<string | null> => {
  try {

    return null;
  } catch (error) {
    console.error('[VersionCheck] Android 버전 확인 실패:', error);
    return null;
  }
};

export const getCurrentAppVersion = (): string => {
  try {

    const version = Application.nativeApplicationVersion;
    return version || Constants.expoConfig?.version || '1.0.0';
  } catch (error) {
    console.error('[VersionCheck] 현재 앱 버전 가져오기 실패:', error);
    return '1.0.0';
  }
};

export const checkLatestVersion = async (): Promise<string | null> => {
  if (Platform.OS === 'ios') {
    return await checkIOSVersion();
  } else if (Platform.OS === 'android') {
    return await checkAndroidVersion();
  }
  return null;
};

export const isNewVersionAvailable = (currentVersion: string, latestVersion: string): boolean => {
  if (!latestVersion) return false;

  const parseVersion = (version: string): number[] => {
    return version.split('.').map(Number);
  };

  const current = parseVersion(currentVersion);
  const latest = parseVersion(latestVersion);

  for (let i = 0; i < Math.max(current.length, latest.length); i++) {
    const currentNum = current[i] || 0;
    const latestNum = latest[i] || 0;

    if (latestNum > currentNum) {
      return true;
    } else if (latestNum < currentNum) {
      return false;
    }
  }

  return false; 
};

export const getStoreUrl = (): string => {
  if (Platform.OS === 'ios') {

    return `https://apps.apple.com/id/app/xrun-go/id6502924173`;
  } else if (Platform.OS === 'android') {
    return `https://play.google.com/store/apps/details?id=run.xrun.xrunapp`;
  }
  return '';
};

export const openStore = async (): Promise<void> => {
  try {
    const storeUrl = getStoreUrl();
    if (storeUrl) {
      const canOpen = await Linking.canOpenURL(storeUrl);
      if (canOpen) {
        await Linking.openURL(storeUrl);
      } else {
        console.error('[VersionCheck] 스토어 링크를 열 수 없습니다:', storeUrl);
      }
    }
  } catch (error) {
    console.error('[VersionCheck] 스토어로 이동 실패:', error);
  }
};

export const isServerVersionUpdateRequired = async (): Promise<boolean> => {
  try {
    const serverResponse = await checkServerVersion();
    if (!serverResponse || !serverResponse.data) {
      console.log('[VersionCheck] 서버 응답이 없어 버전 확인을 건너뜁니다.');
      return false;
    }
    if (__DEV__) {
      console.log('[VersionCheck] 개발 모드이므로 버전 확인을 건너뜁니다.');
      return false;
    }

    const currentVersion = getCurrentAppVersionNumber();
    const serverVersion = Platform.OS === 'android' 
      ? serverResponse.data.version 
      : serverResponse.data.version_ios;

    console.log('[VersionCheck] 버전 비교:', {
      platform: Platform.OS,
      currentVersion,
      serverVersion,
      needsUpdate: currentVersion < serverVersion,
    });

    return currentVersion < serverVersion;
  } catch (error) {
    console.error('[VersionCheck] 서버 버전 비교 실패:', error);
    return false;
  }
};