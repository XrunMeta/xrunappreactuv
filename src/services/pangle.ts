

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
      console.warn('[Pangle] PangleModule이 null이거나 undefined입니다.');
      console.warn('[Pangle] 네이티브 모듈이 제대로 등록되었는지 확인하세요.');
      v_d0574b = false;
      return;
    }

    console.log('[Pangle] 네이티브 모듈 사용 가능:', {
      PangleModule: v_dae2ac !== null && v_dae2ac !== undefined,
      hasInitialize: typeof v_dae2ac?.initialize === 'function',
    });

    try {
      if (v_326be8.OS === 'android') {
        const v_e1fe95 = v_dae2ac.initialize();
        const v_06d9af = new Promise<never>((v_37eab7, v_bad6f3) =>
          setTimeout(() => v_bad6f3(new Error('Pangle 초기화 타임아웃')), 10000)
        );
        await Promise.race([v_e1fe95, v_06d9af]);
      }

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

  if (v_326be8.OS !== 'android') {
    return false;
  }
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

    if (v_326be8.OS !== 'android') {
      console.warn('[Pangle] 안드로이드에서만 지원됩니다.');
      if (v_0721a3) {
        v_0721a3(new Error('Pangle은 안드로이드에서만 지원됩니다.'));
      }
      return;
    }

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
    let v_1fc80e = false; 

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
        'onRewardedAdLoadError',
        (v_d48baf) => {
          if (v_d48baf.adUnitId === v_819f69) {
            v_1fc80e = true; 
            console.error('[Pangle] 보상형 광고 로드 실패:', v_d48baf.errorMsg, `(${v_d48baf.errorCode})`);

            if (v_d48baf.errorCode === 40034) {
              console.warn('[Pangle] 해결 방법:', {
                '1': 'Pangle 대시보드에서 광고 단위 ID가 올바른지 확인',
                '2': '광고 형식(보상형 광고)이 활성화되어 있는지 확인',
                '3': 'App ID와 App Key가 올바른지 확인',
                '4': '네트워크 연결 상태 확인',
              });
            }

            v_60a14d.forEach(v_f3c3f1 => v_f3c3f1());
            if (v_0721a3) {
              v_0721a3(new Error(`보상형 광고 로드 실패: ${v_d48baf.errorMsg} (${v_d48baf.errorCode})`));
            }
          }
        },
      );
      v_60a14d.push(() => v_30c524.remove());
    }

    try {
      await v_dae2ac.loadRewardedAd(v_819f69);
    } catch (v_95616f) {

      if (v_1619e5) {

        await new Promise(v_6f7712 => setTimeout(v_6f7712, 100));

        if (v_1fc80e) {
          return; 
        }

        const v_1744b9 = v_95616f instanceof Error ? v_95616f.message : String(v_95616f);
        console.warn('[Pangle] 보상형 광고 로드 promise reject (이벤트 리스너 있음, 이벤트 미수신):', v_1744b9);

        return;
      }

      const v_1744b9 = v_95616f instanceof Error ? v_95616f.message : String(v_95616f);
      console.error('[Pangle] 보상형 광고 로드 promise 실패 (이벤트 리스너 없음):', v_95616f);

      let v_8eaa8e = v_1744b9;
      if (v_1744b9.includes('40034')) {
        v_8eaa8e = `Pangle 서버 오류 (40034): 광고 단위 ID(${v_819f69})가 올바르지 않거나 Pangle 대시보드에서 활성화되지 않았을 수 있습니다. Pangle 대시보드를 확인해주세요.`;
        console.warn('[Pangle] 해결 방법:', {
          '1': 'Pangle 대시보드에서 광고 단위 ID가 올바른지 확인',
          '2': '광고 형식(보상형 광고)이 활성화되어 있는지 확인',
          '3': 'App ID와 App Key가 올바른지 확인',
          '4': '네트워크 연결 상태 확인',
        });
      }

      v_60a14d.forEach(v_f3c3f1 => v_f3c3f1());
      if (v_0721a3) {
        v_0721a3(new Error(v_8eaa8e));
      }
    }
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

    if (v_326be8.OS !== 'android') {
      console.warn('[Pangle] 안드로이드에서만 지원됩니다.');
      return;
    }

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
    let v_1fc80e = false; 

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

      const v_30c524 = v_1619e5.addListener(
        'onAppOpenAdLoadError',
        (v_d48baf) => {
          if (v_d48baf.adUnitId === v_819f69) {
            v_1fc80e = true;
            console.error('[Pangle] 앱 오프닝 광고 로드 실패:', v_d48baf.errorMsg, `(${v_d48baf.errorCode})`);

            if (v_d48baf.errorCode === 40006) {
              console.warn('[Pangle] 해결 방법:', {
                '1': 'Pangle 대시보드에서 광고 단위가 "사용 중" 상태인지 확인',
                '2': '광고 단위가 App ID 8747763에 연결되어 있는지 확인',
                '3': '몇 분 후 다시 시도 (광고 단위 활성화 지연 가능)',
              });
            }

            v_60a14d.forEach(v_f3c3f1 => v_f3c3f1());
          }
        },
      );
      v_60a14d.push(() => v_30c524.remove());
    }

    try {
      await v_dae2ac.loadAppOpenAd(v_819f69);
    } catch (v_95616f) {

      if (v_1619e5) {

        await new Promise(v_6f7712 => setTimeout(v_6f7712, 100));

        if (v_1fc80e) {
          return; 
        }

        const v_1744b9 = v_95616f instanceof Error ? v_95616f.message : String(v_95616f);
        console.warn('[Pangle] 앱 오프닝 광고 로드 promise reject (이벤트 리스너 있음, 이벤트 미수신):', v_1744b9);
        return;
      }

      const v_1744b9 = v_95616f instanceof Error ? v_95616f.message : String(v_95616f);
      console.error('[Pangle] 앱 오프닝 광고 로드 promise 실패 (이벤트 리스너 없음):', v_95616f);

      v_8e7548 = false;

      if (v_1744b9.includes('40006')) {
        console.warn('[Pangle] 앱 오프닝 광고 단위 ID가 유효하지 않습니다. 광고 단위가 아직 완전히 활성화되지 않았을 수 있습니다. 잠시 후 다시 시도하세요.');
        console.warn('[Pangle] 해결 방법:', {
          '1': 'Pangle 대시보드에서 광고 단위가 "사용 중" 상태인지 확인',
          '2': '광고 단위가 App ID 8747763에 연결되어 있는지 확인',
          '3': '몇 분 후 다시 시도 (광고 단위 활성화 지연 가능)',
        });
      } else if (v_1744b9.includes('40034') || v_1744b9.includes('지원되지 않')) {
        console.warn('[Pangle] 앱 오프닝 광고가 현재 SDK 버전에서 지원되지 않거나 광고 단위 ID가 올바르지 않습니다. 앱은 계속 실행됩니다.');
      } else {
        console.error('[Pangle] 앱 오프닝 광고 로드 중 오류:', v_95616f);
      }

      v_60a14d.forEach(v_f3c3f1 => v_f3c3f1());
    }
  } catch (v_5e9bfe) {
    v_8e7548 = false;
    const v_1744b9 = v_5e9bfe instanceof Error ? v_5e9bfe.message : String(v_5e9bfe);

    if (v_1744b9.includes('40006')) {
      console.warn('[Pangle] 앱 오프닝 광고 단위 ID가 유효하지 않습니다. 광고 단위가 아직 완전히 활성화되지 않았을 수 있습니다. 잠시 후 다시 시도하세요.');
      console.warn('[Pangle] 해결 방법:', {
        '1': 'Pangle 대시보드에서 광고 단위가 "사용 중" 상태인지 확인',
        '2': '광고 단위가 App ID 8747763에 연결되어 있는지 확인',
        '3': '몇 분 후 다시 시도 (광고 단위 활성화 지연 가능)',
      });
    } else if (v_1744b9.includes('40034') || v_1744b9.includes('지원되지 않')) {
      console.warn('[Pangle] 앱 오프닝 광고가 현재 SDK 버전에서 지원되지 않거나 광고 단위 ID가 올바르지 않습니다. 앱은 계속 실행됩니다.');
    } else {
      console.error('[Pangle] 앱 오프닝 광고 로드 중 오류:', v_5e9bfe);
    }
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

export const v_a763e6 = async (): Promise<any> => {
  if (v_326be8.OS !== 'ios') {
    return { success: false, message: 'iOS에서만 지원됩니다.' };
  }
  if (!v_986693()) {
    throw new Error('Pangle 네이티브 모듈을 사용할 수 없습니다.');
  }
  return await v_dae2ac.showNativeScreen();
};

export const v_41a100 = async (v_a15489 = '982684319'): Promise<any> => {
  if (v_326be8.OS !== 'ios') {
    return { success: false, message: 'iOS에서만 지원됩니다.' };
  }
  if (!v_986693()) {
    throw new Error('Pangle 네이티브 모듈을 사용할 수 없습니다.');
  }
  return await v_dae2ac.loadAndShowInterstitialAd(v_a15489);
};

export const v_df6735 = async (v_a15489 = '982684334'): Promise<any> => {
  if (v_326be8.OS !== 'ios') {
    return { success: false, message: 'iOS에서만 지원됩니다.' };
  }
  if (!v_986693()) {
    throw new Error('Pangle 네이티브 모듈을 사용할 수 없습니다.');
  }
  return await v_dae2ac.loadAndShowNativeAd(v_a15489);
};

