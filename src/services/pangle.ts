

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

      if (v_326be8.OS === 'android') {
        console.log('[Pangle] Android에서는 Google Ad Manager 미디에이션을 통해 Pangle을 사용합니다.');
        v_d0574b = false;
        return;
      }

      console.warn('[Pangle] iOS 네이티브 모듈을 사용할 수 없습니다.');
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

    if (v_dae2ac && typeof v_dae2ac.isReady === 'function') {
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

  if (!v_8f0d89 || !v_d0574b) {
    return false;
  }

  if (v_326be8.OS === 'android') {
    return true;
  }

  if (v_326be8.OS === 'ios') {
    return v_986693();
  }

  return false;
};

export const v_3dc1fd = (): string => {
  if (v_326be8.OS === 'ios') {
    return v_573fcf('PANGLE_REWARDED_AD_UNIT_ID_IOS');
  }
  return v_573fcf('PANGLE_REWARDED_AD_UNIT_ID');
};

export const v_7522a9 = (): string => {
  if (v_326be8.OS === 'ios') {
    return v_573fcf('PANGLE_APP_OPENING_AD_UNIT_ID_IOS');
  }
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

    if (v_326be8.OS === 'ios') {
      if (!v_986693()) {
        console.warn('[Pangle] iOS 네이티브 모듈을 사용할 수 없습니다.');
        return;
      }

      const v_819f69 = v_61418d || v_3dc1fd();
      if (!v_819f69) {
        console.warn('[Pangle] iOS 보상형 광고 단위 ID가 설정되지 않았습니다.');
        return;
      }

      console.log('[Pangle] iOS 보상형 광고 로드 및 노출 시작:', v_819f69);

      const v_a0af7d = await v_ad3a98();
      if (!v_a0af7d) {
        console.warn('[Pangle] iOS Pangle SDK가 아직 준비되지 않았습니다. 초기화를 기다립니다.');

        await v_f095b0();
        const v_90eda0 = await v_ad3a98();
        if (!v_90eda0) {
          console.error('[Pangle] iOS Pangle SDK 초기화 실패');
          if (v_0721a3) v_0721a3(new Error('Pangle SDK not ready'));
          return;
        }
      }

      const v_60a14d = [];

      const v_23c114 = v_1619e5?.addListener(
        'onRewardedAdReward',
        (v_d48baf) => {
          console.log('[Pangle] iOS 보상 획득:', v_d48baf);
          if (v_6ae10d) {
            v_6ae10d({ type: v_d48baf.rewardType, amount: v_d48baf.rewardAmount });
          }
        }
      );
      if (v_23c114) v_60a14d.push(() => v_23c114.remove());

      const v_e6ceb8 = v_1619e5?.addListener(
        'onRewardedAdClose',
        () => {
          console.log('[Pangle] iOS 보상형 광고 닫힘');
          if (v_ecd42e) v_ecd42e();
          v_60a14d.forEach(v_f3c3f1 => v_f3c3f1());
        }
      );
      if (v_e6ceb8) v_60a14d.push(() => v_e6ceb8.remove());

      const v_30c524 = v_1619e5?.addListener(
        'onRewardedAdLoadError',
        (v_d48baf) => {
          console.error('[Pangle] iOS 보상형 광고 로드 실패:', v_d48baf.errorMsg);
          if (v_0721a3) {
            v_0721a3(new Error(v_d48baf.errorMsg));
          }
          v_60a14d.forEach(v_f3c3f1 => v_f3c3f1());
        }
      );
      if (v_30c524) v_60a14d.push(() => v_30c524.remove());

      await v_dae2ac.loadAndShowRewardedAd(v_819f69);
      return;
    }

    if (v_326be8.OS !== 'android') {
      console.warn('[Pangle] Android 또는 iOS에서만 지원됩니다.');
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
            if (v_ecd42e) v_ecd42e();
          }
        },
      );
      v_60a14d.push(() => v_e6ceb8.remove());

      const v_08c38a = v_1619e5.addListener(
        'onRewardedAdLoaded',
        (v_d48baf) => {
          if (v_d48baf.adUnitId === v_819f69) {
            console.log('[Pangle] 보상형 광고 로드 완료');
            if (v_dae2ac?.showRewardedAd) {
              v_dae2ac.showRewardedAd(v_819f69).catch((v_5e9bfe) => {
                console.error('[Pangle] 보상형 광고 표시 실패:', v_5e9bfe);
                v_60a14d.forEach(v_f3c3f1 => v_f3c3f1());
                if (v_0721a3) v_0721a3(v_5e9bfe);
              });
            }
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
            v_60a14d.forEach(v_f3c3f1 => v_f3c3f1());
            if (v_0721a3) {
              v_0721a3(new Error(`보상형 광고 로드 실패: ${v_d48baf.errorMsg} (${v_d48baf.errorCode})`));
            }
          }
        },
      );
      v_60a14d.push(() => v_30c524.remove());
    }

    if (!v_dae2ac || !v_dae2ac.loadRewardedAd) {
      const v_5e9bfe = new Error('Pangle 네이티브 모듈을 사용할 수 없습니다.');
      if (v_0721a3) v_0721a3(v_5e9bfe);
      return;
    }

    try {
      await v_dae2ac.loadRewardedAd(v_819f69);
    } catch (v_95616f) {
      if (v_1619e5) {
        await new Promise(v_6f7712 => setTimeout(v_6f7712, 100));
        if (v_1fc80e) return;

        const v_1744b9 = v_95616f instanceof Error ? v_95616f.message : String(v_95616f);
        console.warn('[Pangle] 보상형 광고 로드 promise reject (이벤트 미수신):', v_1744b9);
        return;
      }

      const v_1744b9 = v_95616f instanceof Error ? v_95616f.message : String(v_95616f);
      v_60a14d.forEach(v_f3c3f1 => v_f3c3f1());
      if (v_0721a3) {
        v_0721a3(new Error(v_1744b9));
      }
    }
  } catch (v_5e9bfe) {
    console.error('[Pangle] 보상형 광고 전체 프로세스 오류:', v_5e9bfe);
    if (v_0721a3) v_0721a3(v_5e9bfe as Error);
  }
};

let v_8e7548 = false;

export const v_e55270 = async (): Promise<void> => {
  try {

    if (v_326be8.OS === 'ios') {
      if (!v_986693()) {
        console.warn('[Pangle] iOS 네이티브 모듈을 사용할 수 없습니다.');
        return;
      }

      const v_819f69 = v_7522a9();
      if (!v_819f69) {
        console.warn('[Pangle] iOS 앱 오프닝 광고 단위 ID가 설정되지 않았습니다.');
        return;
      }

      console.log('[Pangle] iOS 앱 오프닝 광고 로드 및 노출 시작:', v_819f69);

      return new Promise((v_6f7712) => {
        let v_695d96 = false;

        const v_ea0359 = setTimeout(() => {
          if (!v_695d96) {
            console.log('[Pangle] iOS 앱 오프닝 광고 대기 타임아웃');
            v_695d96 = true;
            v_6f7712();
          }
        }, 15000); 

        const v_e6ceb8 = v_1619e5?.addListener(
          'onAppOpenAdClose',
          () => {
            console.log('[Pangle] iOS 앱 오프닝 광고 닫힘 이벤트 수신');
            if (!v_695d96) {
              v_695d96 = true;
              clearTimeout(v_ea0359);
              v_e6ceb8?.remove();
              v_6f7712();
            }
          }
        );

        const v_30c524 = v_1619e5?.addListener(
          'onAppOpenAdLoadError',
          () => {
            console.log('[Pangle] iOS 앱 오프닝 광고 에러 이벤트 수신');
            if (!v_695d96) {
              v_695d96 = true;
              clearTimeout(v_ea0359);
              v_e6ceb8?.remove();
              v_30c524?.remove();
              v_6f7712();
            }
          }
        );

        v_dae2ac.loadAndShowAppOpenAd(v_819f69).catch((v_5e9bfe) => {
          console.error('[Pangle] iOS 앱 오프닝 광고 호출 실패:', v_5e9bfe);
          if (!v_695d96) {
            v_695d96 = true;
            clearTimeout(v_ea0359);
            v_e6ceb8?.remove();
            v_30c524?.remove();
            v_6f7712();
          }
        });
      });
    }

    if (v_326be8.OS !== 'android') {
      console.warn('[Pangle] 안드로이드 또는 iOS에서만 지원됩니다.');
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

    return new Promise<void>((v_6f7712) => {
      let v_695d96 = false;
      const v_a983d4 = () => {
        if (!v_695d96) {
          v_695d96 = true;
          v_60a14d.forEach(v_f3c3f1 => v_f3c3f1());
          v_6f7712();
        }
      };

      const v_ea0359 = setTimeout(v_a983d4, 15000);

      const v_60a14d = [];
      let v_1fc80e = false;

      if (v_1619e5) {
        const v_08c38a = v_1619e5.addListener(
          'onAppOpenAdLoaded',
          (v_d48baf) => {
            if (v_d48baf.adUnitId === v_819f69 && !v_8e7548) {
              console.log('[Pangle] 앱 오프닝 광고 로드 완료');
              v_8e7548 = true;
              if (v_dae2ac?.showAppOpenAd) {
                v_dae2ac.showAppOpenAd(v_819f69).catch((v_5e9bfe) => {
                  console.error('[Pangle] 앱 오프닝 광고 표시 실패:', v_5e9bfe);
                  v_a983d4();
                });
              }
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
              clearTimeout(v_ea0359);
              v_a983d4();
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

              clearTimeout(v_ea0359);
              v_a983d4();
            }
          },
        );
        v_60a14d.push(() => v_30c524.remove());
      }

      if (!v_dae2ac || !v_dae2ac.loadAppOpenAd) {
        console.log('[Pangle] 네이티브 모듈을 사용할 수 없습니다. Android에서는 Google Ad Manager 미디에이션을 사용하세요.');
        v_a983d4();
        return;
      }

      v_dae2ac.loadAppOpenAd(v_819f69).catch((v_95616f) => {
        const v_1744b9 = v_95616f instanceof Error ? v_95616f.message : String(v_95616f);
        console.warn('[Pangle] 앱 오프닝 광고 로드 호출 실패:', v_1744b9);
        if (!v_1fc80e) {

          v_a983d4();
        }
      });
    });
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
      console.error('[Pangle] 앱 오프닝 광고 프로세스 중 오류:', v_5e9bfe);
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

