

import { v_326be8 } from 'rcmrninabrnb';
import v_ebba42, { 
  v_726e10, 
  v_6f6da6, 
  v_29536b, 
  v_a23081,
  v_43eac7,
  v_54fae1,
} from 'mbbgvwchnlgdjovshfkutboodeoyky';
import { v_573fcf, v_e4a763 } from '../utils/env';
import { v_719e34 } from '../types';

let v_a422f4 = false;
let v_d94015 = false;

export const v_e88e47 = (): boolean => {
  try {

    return v_d94015;
  } catch (v_5e9bfe) {
    return false;
  }
};

export const v_b357c3 = async (): Promise<void> => {
  try {

    if (v_a422f4) {
      console.log('[AdMob] 이미 초기화되었습니다.');
      return;
    }

    try {

      if (!v_ebba42 || typeof v_ebba42 !== 'function') {
        console.warn('[AdMob] 네이티브 모듈을 사용할 수 없습니다. mobileAds 함수가 없습니다.');
        v_d94015 = false;
        return;
      }
    } catch (v_a5e990) {
      console.warn('[AdMob] 네이티브 모듈을 로드할 수 없습니다:', v_a5e990);
      v_d94015 = false;
      return;
    }

    let v_903837;
    try {
      v_903837 = v_326be8.OS === 'android' 
        ? v_573fcf('ADMOB_APPID')
        : v_573fcf('ADMOB_APPID_IOS');
    } catch (v_1df4c8) {
      console.warn('[AdMob] 환경 변수 로드 실패:', v_1df4c8);
      v_d94015 = false;
      return;
    }

    if (!v_903837) {
      console.warn('[AdMob] App ID가 설정되지 않았습니다.');
      v_d94015 = false;
      return;
    }

    try {
      const v_e1fe95 = v_ebba42().initialize();
      const v_06d9af = new Promise<never>((v_37eab7, v_bad6f3) => 
        setTimeout(() => v_bad6f3(new Error('AdMob 초기화 타임아웃')), 10000)
      );

      await Promise.race([v_e1fe95, v_06d9af]);

      try {
        await v_ebba42().setRequestConfiguration({

          testDeviceIdentifiers: [],
        });
      } catch (v_15fb2a) {
        console.warn('[AdMob] RequestConfiguration 설정 실패 (계속 진행):', v_15fb2a);
      }

      v_a422f4 = true;
      v_d94015 = true;

      console.log('[AdMob] 초기화 완료:', {
        appId: v_903837,
        platform: v_326be8.OS,
      });
    } catch (v_dedc69) {
      console.error('[AdMob] 초기화 중 오류 발생:', v_dedc69);
      v_d94015 = false;
      v_a422f4 = false;

    }
  } catch (v_5e9bfe) {
    console.error('[AdMob] 초기화 실패 (앱은 계속 실행됩니다):', v_5e9bfe);
    v_d94015 = false;
    v_a422f4 = false;

  }
};

export const v_f78e83 = (): string => {
  return v_326be8.OS === 'android'
    ? v_573fcf('ADMOB_APPID')
    : v_573fcf('ADMOB_APPID_IOS');
};

export const v_2ccc13 = (): string => {

  return v_326be8.OS === 'android'
    ? '' 
    : v_573fcf('ADMOB_ADUNIT_IOS');
};

export const v_41a100 = async (
  v_61418d,
  v_ecd42e,
  v_0721a3,
): Promise<void> => {
  try {
    if (!v_d94015) {
      console.warn('[AdMob] AdMob이 사용 불가능합니다.');
      return;
    }

    const v_077aae = v_726e10.createForAdRequest(v_61418d, {
      requestNonPersonalizedAdsOnly: false,
    });

    const v_4293e9 = v_077aae.addAdEventListener(
      v_6f6da6.LOADED,
      () => {
        console.log('[AdMob] 전면 광고 로드 완료');
        v_077aae.show();
      },
    );

    const v_c1d506 = v_077aae.addAdEventListener(
      v_6f6da6.CLOSED,
      () => {
        console.log('[AdMob] 전면 광고 닫힘');
        v_4293e9();
        v_c1d506();
        if (v_ecd42e) {
          v_ecd42e();
        }
      },
    );

    const v_2b24ac = v_077aae.addAdEventListener(
      v_6f6da6.ERROR,
      (v_5e9bfe) => {
        console.error('[AdMob] 전면 광고 로드 실패:', v_5e9bfe);
        v_4293e9();
        v_c1d506();
        v_2b24ac();
        if (v_0721a3) {
          v_0721a3(v_5e9bfe as Error);
        }
      },
    );

    await v_077aae.load();
  } catch (v_5e9bfe) {
    console.error('[AdMob] 전면 광고 로드 중 오류:', v_5e9bfe);
    if (v_0721a3) {
      v_0721a3(v_5e9bfe as Error);
    }
  }
};

export const v_05fa9c = async (
  v_660822,
  deviceInfo: v_719e34,
  v_36c043,
  v_61418d,
): Promise<any> => {
  try {
    const v_c9c489 = v_e4a763();
    const v_e9a15d = v_c9c489.USE_WORKERS_API === 'true' ? v_c9c489.GATEWAY_WORKERS : v_c9c489.GATEWAY_NODEJS;
    const v_f71b56 = v_c9c489.PANGLE_CALLBACK_URL || `${v_e9a15d}/callbackPangle`;
    const v_fc569c = v_c9c489.PANGLE_SECURITY_KEY;

    const v_d8bcf0 = {
      app_id: v_c9c489.PANGLE_APP_ID,
      ad_unit_id: v_61418d,
      user_id: v_660822,
      reward_name: v_36c043.type || 'XRUN',
      reward_amount: v_36c043.amount || 1,
      device_id: v_e7f87b.deviceId || '',
      adid: v_e7f87b.adid || '',
      os: v_e7f87b.os || v_326be8.OS === 'android' ? 'android' : 'ios',
      os_version: v_e7f87b.osVersion || '',
      timestamp: Math.floor(Date.now() / 1000),
      security_key: v_fc569c,
    };

    console.log('[AdMob] Pangle 콜백 전송:', v_d8bcf0);

    const v_3393e3 = await fetch(v_f71b56, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${v_c9c489.GATEWAY_AUTH_CODE}`,
      },
      body: JSON.stringify(v_d8bcf0),
    });

    const v_1e99f6 = await v_3393e3.text();
    console.log('[AdMob] Pangle 콜백 응답 (원본):', {
      status: v_3393e3.status,
      statusText: v_3393e3.statusText,
      contentType: v_3393e3.headers.get('content-type'),
      text: v_1e99f6.substring(0, 200), 
    });

    let v_43c42e;
    try {
      v_43c42e = JSON.parse(v_1e99f6);
      console.log('[AdMob] Pangle 콜백 응답 (파싱됨):', v_43c42e);
    } catch (v_5f9add) {

      console.warn('[AdMob] Pangle 콜백 응답이 JSON이 아닙니다:', v_5f9add);

      if (v_3393e3.ok) {
        console.log('[AdMob] Pangle 콜백 전송 성공 (비JSON 응답)');
        return { success: true, message: '콜백 전송 완료 (비JSON 응답)' };
      }
      throw new Error(`콜백 응답 파싱 실패: ${v_1e99f6.substring(0, 100)}`);
    }

    return v_43c42e;
  } catch (v_5e9bfe) {
    console.error('[AdMob] Pangle 콜백 전송 실패:', v_5e9bfe);
    throw v_5e9bfe;
  }
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
    if (!v_d94015) {
      console.warn('[AdMob] AdMob이 사용 불가능합니다.');
      return;
    }

    let v_819f69;
    if (__DEV__) {

      v_819f69 = v_54fae1.REWARDED;
      console.log('[AdMob] 개발 모드: 테스트 광고 단위 ID 사용');
    } else {

      v_819f69 = v_61418d || v_573fcf('ADMOB_MEDIATION_GROUP_ID') || v_2ccc13();
    }

    console.log('[AdMob] 사용할 광고 단위 ID:', v_819f69);
    console.log('[AdMob] 광고 단위 ID 출처:', {
      개발모드: __DEV__,
      adUnitId: v_61418d || '없음',
      mediationGroupId: v_573fcf('ADMOB_MEDIATION_GROUP_ID') || '없음',
      defaultAdUnitId: v_2ccc13() || '없음',
    });

    const v_c59680 = v_29536b.createForAdRequest(v_819f69, {
      requestNonPersonalizedAdsOnly: false,
    });

    const v_ed9e6f = v_c59680.addAdEventListener(
      v_a23081.EARNED_REWARD,
      async (v_36c043) => {
        console.log('[AdMob] 보상 수령:', v_36c043);

        if (v_6ae10d) {
          v_6ae10d(v_36c043);
        }
      },
    );

    const v_4293e9 = v_c59680.addAdEventListener(
      v_a23081.LOADED,
      () => {
        console.log('[AdMob] 보상형 광고 로드 완료');
        v_c59680.show();
      },
    );

    const v_c1d506 = v_c59680.addAdEventListener(
      v_6f6da6.CLOSED,
      () => {
        console.log('[AdMob] 보상형 광고 닫힘');
        v_ed9e6f();
        v_4293e9();
        v_c1d506();
        if (v_ecd42e) {
          v_ecd42e();
        }
      },
    );

    const v_2b24ac = v_c59680.addAdEventListener(
      v_6f6da6.ERROR,
      (v_5e9bfe) => {
        console.error('[AdMob] 보상형 광고 로드 실패:', v_5e9bfe);
        v_ed9e6f();
        v_4293e9();
        v_c1d506();
        v_2b24ac();
        if (v_0721a3) {
          v_0721a3(v_5e9bfe as Error);
        }
      },
    );

    await v_c59680.load();
  } catch (v_5e9bfe) {
    console.error('[AdMob] 보상형 광고 로드 중 오류:', v_5e9bfe);
    if (v_0721a3) {
      v_0721a3(v_5e9bfe as Error);
    }
  }
};

export const v_2b25f9 = (): boolean => {
  return v_a422f4 && v_d94015;
};

export const v_3dc1fd = (): string => {
  return v_573fcf('PANGLE_REWARDED_AD_UNIT_ID');
};

export const v_84fca1 = (): string => {
  return v_573fcf('ADMOB_MEDIATION_GROUP_ID') || v_2ccc13();
};

export const v_7522a9 = (): string => {
  return v_573fcf('PANGLE_APP_OPENING_AD_UNIT_ID');
};

let appOpenAd: v_43eac7 | null = null;

export const v_e55270 = async (): Promise<void> => {
  try {
    if (!v_d94015) {
      console.warn('[AdMob] AdMob이 사용 불가능합니다. 앱 오프닝 광고를 표시할 수 없습니다.');
      return;
    }

    let v_819f69;
    if (__DEV__) {
      v_819f69 = v_54fae1.APP_OPEN;
      console.log('[AdMob] 개발 모드: 테스트 앱 오프닝 광고 단위 ID 사용');
    } else {
      v_819f69 = v_7522a9();
    }

    if (!v_819f69) {
      console.warn('[AdMob] 앱 오프닝 광고 단위 ID가 설정되지 않았습니다.');
      return;
    }

    console.log('[AdMob] 앱 오프닝 광고 로드 시작:', v_819f69);

    v_d27d1b = v_43eac7.createForAdRequest(v_819f69, {
      requestNonPersonalizedAdsOnly: false,
    });

    const v_4293e9 = v_d27d1b.addAdEventListener(
      v_6f6da6.LOADED,
      () => {
        console.log('[AdMob] 앱 오프닝 광고 로드 완료');

        if (v_d27d1b) {
          v_d27d1b.show();
        }
      },
    );

    const v_346536 = v_d27d1b.addAdEventListener(
      v_6f6da6.OPENED,
      () => {
        console.log('[AdMob] 앱 오프닝 광고 표시됨');
      },
    );

    const v_c1d506 = v_d27d1b.addAdEventListener(
      v_6f6da6.CLOSED,
      () => {
        console.log('[AdMob] 앱 오프닝 광고 닫힘');

        v_4293e9();
        v_346536();
        v_c1d506();
        v_d27d1b = null;
      },
    );

    const v_2b24ac = v_d27d1b.addAdEventListener(
      v_6f6da6.ERROR,
      (v_5e9bfe) => {
        console.error('[AdMob] 앱 오프닝 광고 로드 실패:', v_5e9bfe);

        v_4293e9();
        v_346536();
        v_c1d506();
        v_2b24ac();
        v_d27d1b = null;
      },
    );

    v_d27d1b.load();
  } catch (v_5e9bfe) {
    console.error('[AdMob] 앱 오프닝 광고 로드 중 오류:', v_5e9bfe);
    v_d27d1b = null;
  }
};

