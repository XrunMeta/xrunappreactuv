

import { Platform, NativeModules } from 'react-native';

const { PangleModule } = NativeModules;

export const PANGLE_SLOT_ID = '982684319';

export const isNativeModuleAvailable = (): boolean => {
  return Platform.OS === 'ios' && PangleModule !== undefined && PangleModule !== null;
};

export const showNativeScreen = async (): Promise<any> => {
  try {
    if (!isNativeModuleAvailable()) {
      console.warn('[Native] iOS 네이티브 모듈을 사용할 수 없습니다.');
      return { success: false, error: '모듈을 찾을 수 없습니다' };
    }

    console.log('[Native] 네이티브 화면 호출 시작');
    const result = await PangleModule.showNativeScreen();
    console.log('[Native] 네이티브 화면 표시 성공:', result);
    return result;
  } catch (error) {
    console.error('[Native] 네이티브 화면 표시 실패:', error);
    throw error;
  }
};

export const loadInterstitialAd = async (slotId: string = PANGLE_SLOT_ID): Promise<any> => {
  try {
    if (!isNativeModuleAvailable()) {
      return { success: false, error: '모듈을 찾을 수 없습니다' };
    }

    console.log('[Native] 팽글 전면광고 로드 시도:', slotId);
    const result = await PangleModule.loadInterstitialAd(slotId);
    console.log('[Native] 팽글 전면광고 로드 성공:', result);
    return result;
  } catch (error) {
    console.error('[Native] 팽글 전면광고 로드 실패:', error);
    throw error;
  }
};

export const showInterstitialAd = async (): Promise<any> => {
  try {
    if (!isNativeModuleAvailable()) {
      return { success: false, error: '모듈을 찾을 수 없습니다' };
    }

    console.log('[Native] 팽글 전면광고 노출 시도');
    const result = await PangleModule.showInterstitialAd();
    console.log('[Native] 팽글 전면광고 노출 성공');
    return result;
  } catch (error) {
    console.error('[Native] 팽글 전면광고 노출 실패:', error);
    throw error;
  }
};

export const loadAndShowInterstitialAd = async (slotId: string = PANGLE_SLOT_ID): Promise<any> => {
  try {
    if (!isNativeModuleAvailable()) {
      return { success: false, error: '모듈을 찾을 수 없습니다' };
    }

    console.log('[Native] 팽글 전면광고 로드 및 노출 시도 (통합):', slotId);
    const result = await PangleModule.loadAndShowInterstitialAd(slotId);
    console.log('[Native] 팽글 전면광고 호출 성공:', result);
    return result;
  } catch (error) {
    console.error('[Native] 팽글 전면광고 로드 및 노출 실패:', error);
    throw error;
  }
};

