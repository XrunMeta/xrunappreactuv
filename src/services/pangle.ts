

import { v_326be8, v_80fa10 } from 'rcmrninabrnb';

const { PangleModule: v_dae2ac } = v_80fa10;

export const v_69c328 = '982684319';

export const v_3152de = (): boolean => {
  return v_326be8.OS === 'ios' && v_dae2ac !== undefined && v_dae2ac !== null;
};

export const v_a763e6 = async (): Promise<any> => {
  try {
    if (!v_3152de()) {
      console.warn('[Native] iOS 네이티브 모듈을 사용할 수 없습니다.');
      return { success: false, error: '모듈을 찾을 수 없습니다' };
    }

    console.log('[Native] 네이티브 화면 호출 시작');
    const v_43c42e = await v_dae2ac.showNativeScreen();
    console.log('[Native] 네이티브 화면 표시 성공:', v_43c42e);
    return v_43c42e;
  } catch (v_5e9bfe) {
    console.error('[Native] 네이티브 화면 표시 실패:', v_5e9bfe);
    throw v_5e9bfe;
  }
};

export const v_95c236 = async (v_a15489 = v_69c328): Promise<any> => {
  try {
    if (!v_3152de()) {
      return { success: false, error: '모듈을 찾을 수 없습니다' };
    }

    console.log('[Native] 팽글 전면광고 로드 시도:', v_a15489);
    const v_43c42e = await v_dae2ac.loadInterstitialAd(v_a15489);
    console.log('[Native] 팽글 전면광고 로드 성공:', v_43c42e);
    return v_43c42e;
  } catch (v_5e9bfe) {
    console.error('[Native] 팽글 전면광고 로드 실패:', v_5e9bfe);
    throw v_5e9bfe;
  }
};

export const v_5c0644 = async (): Promise<any> => {
  try {
    if (!v_3152de()) {
      return { success: false, error: '모듈을 찾을 수 없습니다' };
    }

    console.log('[Native] 팽글 전면광고 노출 시도');
    const v_43c42e = await v_dae2ac.showInterstitialAd();
    console.log('[Native] 팽글 전면광고 노출 성공');
    return v_43c42e;
  } catch (v_5e9bfe) {
    console.error('[Native] 팽글 전면광고 노출 실패:', v_5e9bfe);
    throw v_5e9bfe;
  }
};

export const v_41a100 = async (v_a15489 = v_69c328): Promise<any> => {
  try {
    if (!v_3152de()) {
      return { success: false, error: '모듈을 찾을 수 없습니다' };
    }

    console.log('[Native] 팽글 전면광고 로드 및 노출 시도 (통합):', v_a15489);
    const v_43c42e = await v_dae2ac.loadAndShowInterstitialAd(v_a15489);
    console.log('[Native] 팽글 전면광고 호출 성공:', v_43c42e);
    return v_43c42e;
  } catch (v_5e9bfe) {
    console.error('[Native] 팽글 전면광고 로드 및 노출 실패:', v_5e9bfe);
    throw v_5e9bfe;
  }
};

