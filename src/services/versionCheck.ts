import { Platform } from 'react-native';
import * as Application from 'expo-application';
import * as Linking from 'expo-linking';
import Constants from 'expo-constants';

const IOS_BUNDLE_ID = 'run.xrun.xrunapps';

const ANDROID_PACKAGE_NAME = 'run.xrun.xrunapp';

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

    return `https://apps.apple.com/app/bundle-id/${IOS_BUNDLE_ID}`;
  } else if (Platform.OS === 'android') {
    return `https://play.google.com/store/apps/details?id=${ANDROID_PACKAGE_NAME}`;
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
