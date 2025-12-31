

import { v_326be8, v_80fa10, v_0cafec } from 'rcmrninabrnb';
import { v_573fcf, v_e4a763 } from '../utils/env';
import { v_719e34 } from '../types';

const { PangleModule: v_dae2ac } = v_80fa10;
const v_1619e5 = v_dae2ac ? new v_0cafec(v_dae2ac) : null;

let v_8f0d89 = false;
let v_d0574b = false;

export const v_986693 = (): boolean => {
  try {
    return v_dae2ac !== null && v_dae2ac !== undefined;
  } catch (v_5e9bfe) {
    return false;
  }
};

export const v_f095b0 = async (): Promise<void> => {
  try {

    if (v_8f0d89) {
      console.log('[Pangle] 이미 초기화되었습니다.');
      return;
    }

    if (!v_986693()) {
      console.warn('[Pangle] 네이티브 모듈을 사용할 수 없습니다.');
      v_d0574b = false;
      return;
    }

    try {
      const v_e1fe95 = v_dae2ac.initialize();
      const v_06d9af = new Promise<never>((v_37eab7, v_bad6f3) => 
        setTimeout(() => v_bad6f3(new Error('Pangle 초기화 타임아웃')), 10000)
      );

      await Promise.race([v_e1fe95, v_06d9af]);

      v_8f0d89 = true;
      v_d0574b = true;
      console.log('[Pangle] 초기화 완료');
    } catch (v_dedc69) {
      console.error('[Pangle] 초기화 실패:', v_dedc69);
      v_d0574b = false;
      throw v_dedc69;
    }
  } catch (v_5e9bfe) {
    console.error('[Pangle] 초기화 중 오류:', v_5e9bfe);
    v_d0574b = false;

  }
};

export const v_ad3a98 = async (): Promise<boolean> => {
  try {
    if (!v_8f0d89 || !v_d0574b) {
      return false;
    }

    if (v_dae2ac && v_dae2ac.isReady) {
      const v_be47b8 = await v_dae2ac.isReady();
      return v_be47b8 === true;
    }

    return v_8f0d89 && v_d0574b;
  } catch (v_5e9bfe) {
    console.error('[Pangle] 초기화 상태 확인 중 오류:', v_5e9bfe);
    return false;
  }
};

export const v_8c8ab6 = (): boolean => {
  return v_8f0d89 && v_d0574b;
};

export const v_3dc1fd = (): string => {
  return v_573fcf('PANGLE_REWARDED_AD_UNIT_ID');
};

export const v_7522a9 = (): string => {
  return v_573fcf('PANGLE_APP_OPENING_AD_UNIT_ID');
};

export const v_18f201 = async (
  v_61418d,
  v_660822,
  deviceInfo?: v_719e34,
  v_6ae10d,
  v_ecd42e,
  v_0721a3,
): Promise<void> => {
  try {
    if (!v_d0574b) {
      console.warn('[Pangle] Pangle이 사용 불가능합니다.');
      if (v_0721a3) {
        v_0721a3(new Error('Pangle이 초기화되지 않았습니다.'));
      }
      return;
    }

    const v_819f69 = v_61418d || v_3dc1fd();

    if (!v_819f69) {
      const v_5e9bfe = new Error('Pangle 보상형 광고 단위 ID가 설정되지 않았습니다.');
      console.error('[Pangle]', v_5e9bfe.message);
      if (v_0721a3) {
        v_0721a3(v_5e9bfe);
      }
      return;
    }

    console.log('[Pangle] 보상형 광고 로드 시작:', v_819f69);

    const v_60a14d = [];

    if (v_1619e5) {

      const v_23c114 = v_1619e5.addListener(
        'onRewardedAdReward',
        (v_d48baf) => {
          if (v_d48baf.adUnitId === v_819f69) {
            console.log('[Pangle] 보상 수령:', v_d48baf);
            if (v_6ae10d) {
              v_6ae10d({ type: v_d48baf.type, amount: v_d48baf.amount });
            }
          }
        },
      );
      v_60a14d.push(() => v_23c114.remove());

      const v_e6ceb8 = v_1619e5.addListener(
        'onRewardedAdClose',
        (v_d48baf) => {
          if (v_d48baf.adUnitId === v_819f69) {
            console.log('[Pangle] 보상형 광고 닫힘');

            v_60a14d.forEach(v_f3c3f1 => v_f3c3f1());
            if (v_ecd42e) {
              v_ecd42e();
            }
          }
        },
      );
      v_60a14d.push(() => v_e6ceb8.remove());

      const v_08c38a = v_1619e5.addListener(
        'onRewardedAdLoaded',
        (v_d48baf) => {
          if (v_d48baf.adUnitId === v_819f69) {
            console.log('[Pangle] 보상형 광고 로드 완료');

            v_dae2ac.showRewardedAd(v_819f69).catch((v_5e9bfe) => {
              console.error('[Pangle] 보상형 광고 표시 실패:', v_5e9bfe);
              v_60a14d.forEach(v_f3c3f1 => v_f3c3f1());
              if (v_0721a3) {
                v_0721a3(v_5e9bfe);
              }
            });
          }
        },
      );
      v_60a14d.push(() => v_08c38a.remove());

      const v_30c524 = v_1619e5.addListener(
        'onRewardedAdVideoError',
        (v_d48baf) => {
          if (v_d48baf.adUnitId === v_819f69) {
            console.error('[Pangle] 보상형 광고 로드 실패');
            v_60a14d.forEach(v_f3c3f1 => v_f3c3f1());
            if (v_0721a3) {
              v_0721a3(new Error('보상형 광고 로드 실패'));
            }
          }
        },
      );
      v_60a14d.push(() => v_30c524.remove());
    }

    await v_dae2ac.loadRewardedAd(v_819f69);
  } catch (v_5e9bfe) {
    console.error('[Pangle] 보상형 광고 로드 중 오류:', v_5e9bfe);
    if (v_0721a3) {
      v_0721a3(v_5e9bfe as Error);
    }
  }
};

let v_8e7548 = false;

export const v_e55270 = async (): Promise<void> => {
  try {
    if (!v_d0574b) {
      console.warn('[Pangle] Pangle이 사용 불가능합니다. 앱 오프닝 광고를 표시할 수 없습니다.');
      return;
    }

    const v_819f69 = v_7522a9();

    if (!v_819f69) {
      console.warn('[Pangle] 앱 오프닝 광고 단위 ID가 설정되지 않았습니다.');
      return;
    }

    console.log('[Pangle] 앱 오프닝 광고 로드 시작:', v_819f69);

    const v_60a14d = [];

    if (v_1619e5) {

      const v_08c38a = v_1619e5.addListener(
        'onAppOpenAdLoaded',
        (v_d48baf) => {
          if (v_d48baf.adUnitId === v_819f69 && !v_8e7548) {
            console.log('[Pangle] 앱 오프닝 광고 로드 완료');
            v_8e7548 = true;

            v_dae2ac.showAppOpenAd(v_819f69).catch((v_5e9bfe) => {
              console.error('[Pangle] 앱 오프닝 광고 표시 실패:', v_5e9bfe);
              v_60a14d.forEach(v_f3c3f1 => v_f3c3f1());
            });
          }
        },
      );
      v_60a14d.push(() => v_08c38a.remove());

      const v_e6ceb8 = v_1619e5.addListener(
        'onAppOpenAdClose',
        (v_d48baf) => {
          if (v_d48baf.adUnitId === v_819f69) {
            console.log('[Pangle] 앱 오프닝 광고 닫힘');
            v_8e7548 = false;
            v_60a14d.forEach(v_f3c3f1 => v_f3c3f1());
          }
        },
      );
      v_60a14d.push(() => v_e6ceb8.remove());
    }

    await v_dae2ac.loadAppOpenAd(v_819f69);
  } catch (v_5e9bfe) {
    console.error('[Pangle] 앱 오프닝 광고 로드 중 오류:', v_5e9bfe);
    v_8e7548 = false;
  }
};

export const v_05fa9c = async (
  v_660822,
  deviceInfo: v_719e34,
  v_36c043,
  v_61418d,
): Promise<any> => {

  console.log('[Pangle] 콜백 전송 스킵 (리워드 제공 안 함)');
  return { success: true, message: '콜백 전송 스킵됨' };
};

