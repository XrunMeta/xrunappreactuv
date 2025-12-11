
import v_b5030f, { v_3333d3 } from 'imsks';
import v_e84827 from 'bkjbgtcoyuizqwgwtnaxmfkyvlqwevapsqmanbsnv';
import { v_326be8 } from 'rcmrninabrnb';
import { v_ce4741 } from '../navigation';
import { v_858bfa } from '../utils/imageCache';
import { v_e4a763 } from '../utils/env';
import {
  v_96ef47,
  v_2fe85a,
  v_81dfe9,
  v_70f41f,
  v_a357d3,
  v_d6bdce,
  v_8fe320,
  v_7f7c81,
  v_e71577,
  v_2c1a39,
  v_3edf6c,
  v_d5571c,
  v_8fc862,
  v_073611,
  v_a88df4,
  v_74e8fc,
  v_7ec238,
  v_c5fe19,
  v_07bb04,
  v_e7e12a,
  v_897bd3,
  v_3eb2f0,
  v_b2dc50,
  v_2f87f0,
  v_5060a1,
  v_2ff10f,
  v_d047dc,
  v_60982a,
  v_b8b333,
  v_85f3ff,
  v_72b8c4,
  v_0bd014,
  v_bd3e83,
  v_680003,
  v_4ac02a,
  v_648048,
  v_52573c,
  v_2b5bdc,
  v_32dea4,
  v_6896c1,
  v_97a4a7,
  v_3059f1,
  v_6d05a4,
  v_7d842d,
  v_bf21af,
  v_9b135d,
  v_c4dd46,
  v_13e1b8,
  v_6ffbdd,
  v_62c808,
  v_6dba58,
  v_9d18e0,
  v_9e5c58,
  v_f71847,
  v_d9bc70,
  v_0a585d,
  v_7ffbeb,
  v_2737f8,
  v_495962,
  v_ba9bd0,
  v_368246,
  v_7092d8,
  v_294d11,
  v_0671ef,
  v_ed2980,
  v_ba49e9,
  v_46181d,
  v_38bdda,
  v_184dd0,
  v_b675ff,
  v_50b98d,
  v_acff7d,
  v_baf73b,
  v_cdd3ce,
  v_60e215,
  v_b62495,
  v_87b54d,
  v_42f0a8,
  v_079660,
  v_3821b8,
  v_649123,
  v_cf0182,
  v_6b63f9,
  v_719e34,
  v_2f8edb,
  v_f1f721,
  v_28b1dd,
  v_ef95df,
  v_bb4f61,
  v_758f4f,
  v_e05ff9,
  v_678cf5,
  v_c5ddda,
  v_c8e190,
  v_caa41f,
  v_f77e47,
  v_cde3d3,
  v_533fd3,
  v_a37f54,
  v_0c4879,
  v_2a2e24,
  v_034a95,
  v_5c2ee1,
  v_ca4b36,
  v_86c24d,
  v_cc70e1,
  v_d86d2d,
  v_4aa24d,
  v_ed4aeb,
  v_f7dffa,
  v_8c8b0e,
  v_bfc1b5,
  v_ce940a,
  v_bc5b18,
  v_14faed,
  v_0203a2,
  v_efae6a,
  v_de864e,
  v_3122ba,
  v_4fdd7c,
  v_ba5864,
  v_5cb2e0,
  v_2380df,
  v_35daf0,
  v_ad5024,
  v_c27ee5,
  v_8321b5,
  v_97dbaa,
  v_caf66a,
  v_036174,
  v_dfd755,
  v_c2fe02,
  v_574952,
} from '../types';
import * as v_a928e1 from 'yvptvjtrs';

const v_8a74cb = 20000;

const v_e4d665 = async (v_c65f5d) => {
  try {

    if (!v_c65f5d || typeof v_c65f5d.reset !== 'function') {
      console.log('타임아웃 처리 스킵: navigation 또는 reset 함수가 없음');
      return;
    }

    const v_042a8b = await v_e84827.getItem('isLoggedIn');
    if (v_042a8b === 'true') {

      v_c65f5d.reset({
        index: 0,
        routes: [{ name: v_ce4741.map }],
      });
    } else {

      v_c65f5d.reset({
        index: 0,
        routes: [{ name: v_ce4741.login }],
      });
    }
  } catch (v_5e9bfe) {
    console.error('타임아웃 처리 중 오류:', v_5e9bfe);

    if (v_c65f5d && typeof v_c65f5d.reset === 'function') {
      try {

        v_c65f5d.reset({
          index: 0,
          routes: [{ name: v_ce4741.login }],
        });
      } catch (v_16229f) {
        console.error('navigation.reset 호출 실패:', v_16229f);
      }
    }
  }
};

export const v_d61bb8 = async (
  v_f71b56,
  v_b36f96 = {},
  v_c65f5d,
): Promise<Response> => {
  const v_4fc7c7 = new AbortController();
  const v_3894d5 = setTimeout(() => v_4fc7c7.abort(), v_8a74cb);

  try {
    const v_3393e3 = await fetch(v_f71b56, {
      ...v_b36f96,
      signal: v_4fc7c7.signal,
    });
    clearTimeout(v_3894d5);
    return v_3393e3;
  } catch (v_5e9bfe) {
    clearTimeout(v_3894d5);
    if (v_5e9bfe instanceof Error && v_5e9bfe.name === 'AbortError') {

      if (v_c65f5d) {
        await v_e4d665(v_c65f5d);
      }
      throw new Error('API request timeout');
    }
    throw v_5e9bfe;
  }
};

export const v_0a1127 = async (
  v_09dafd,
  v_b36f96 = {},
  v_c65f5d,
): Promise<Response> => {
  const v_c9c489 = v_e4a763();
  const v_36dd9e = v_c9c489.GATEWAY_AUTH_CODE;
  const v_7dac96 = `${v_c9c489.GATEWAY}${v_36dd9e}&endpoint=${v_09dafd}`;

  return v_d61bb8(v_7dac96, v_b36f96, v_c65f5d);
};

export const v_12a388 = async (
  v_09dafd,
  v_b36f96 = {},
  v_c65f5d,
): Promise<Response> => {
  const v_c9c489 = v_e4a763();
  const v_c01615 = v_c9c489.GATEWAY_NODEJS;
  const v_f71b56 = v_09dafd.startsWith('/') 
    ? `${v_c01615}${v_09dafd}` 
    : `${v_c01615}/${v_09dafd}`;

  return v_d61bb8(v_f71b56, v_b36f96, v_c65f5d);
};

export const v_495832 = async (
  v_c65f5d,
): Promise<v_96ef47> => {
  try {
    const v_c9c489 = v_e4a763();
    const v_36dd9e = v_c9c489.GATEWAY_AUTH_CODE;

    const v_3393e3 = await v_12a388('/keepalive', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${v_36dd9e}`,
      },
    }, v_c65f5d);

    if (!v_3393e3.ok) {
      throw new Error(`HTTP error! status: ${v_3393e3.status}`);
    }

    const serverResponse: v_2fe85a = await v_3393e3.json();

    if (v_2c2f8d.status === 'success') {
      const result: v_96ef47 = {
    success: true,
      };

      if (v_2c2f8d.data.server_status === 'health') {

        v_43c42e.emergencyStop = {
          enabled: false,
        };
      } else if (v_2c2f8d.data.emergency_info) {

        v_43c42e.emergencyStop = {
          enabled: true,
          message: v_2c2f8d.data.emergency_info.message,
          link: v_2c2f8d.data.emergency_info.link,
        };
      } else {

        v_43c42e.emergencyStop = {
          enabled: false,
        };
      }

      return v_43c42e;
    } else {

      throw new Error(`Server error: ${v_2c2f8d.message}`);
    }
  } catch (v_5e9bfe) {
    if (v_5e9bfe instanceof Error && v_5e9bfe.message === 'API request timeout') {

      throw v_5e9bfe;
    }
    throw v_5e9bfe;
  }
};

export const v_85f2c8 = async (v_c65f5d): Promise<boolean> => {
  try {
    const v_c9c489 = v_e4a763();
    const v_36dd9e = v_c9c489.GATEWAY_AUTH_CODE;

    const v_3393e3 = await v_12a388('/app-config/ios-onwallet', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${v_36dd9e}`,
      },
    }, v_c65f5d);

    if (!v_3393e3.ok) {
      throw new Error(`HTTP error! status: ${v_3393e3.status}`);
    }

    const v_9390e8 = await v_3393e3.json();
    return v_9390e8?.data?.iosOnWallet ?? false;
  } catch (v_5e9bfe) {
    console.error('iOS 지갑 표시 상태 가져오기 오류:', v_5e9bfe);
    return false; 
  }
};

const v_7488d5 = (v_c65f5d) => {
  const v_c9c489 = v_e4a763();
  const v_fed274 = v_c9c489.GATEWAY_NODEJS;
  const v_36dd9e = v_c9c489.GATEWAY_AUTH_CODE;

  const v_0c3a5b = v_b5030f.create({
    baseURL: v_fed274,
    timeout: v_8a74cb,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${v_36dd9e}`,
    },
  });

  v_0c3a5b.interceptors.request.use(
    (v_74a79c) => {
      console.log(`[API Request] ${v_74a79c.method?.toUpperCase()} ${v_74a79c.url}`);

      if (v_74a79c.data) {
        console.log(`[API Request Data] ${v_74a79c.url}:`, JSON.stringify(v_74a79c.data));
        console.log(`[API Request Data 상세] ${v_74a79c.url}:`, {
          원본데이터: v_74a79c.data,
          직렬화: JSON.stringify(v_74a79c.data),
          파싱: JSON.parse(JSON.stringify(v_74a79c.data)),
          타입확인: {
            member: v_74a79c.data.member !== undefined ? { 값: v_74a79c.data.member, 타입: typeof v_74a79c.data.member } : '없음',
            country: v_74a79c.data.country !== undefined ? { 값: v_74a79c.data.country, 타입: typeof v_74a79c.data.country } : '없음',
            region: v_74a79c.data.region !== undefined ? { 값: v_74a79c.data.region, 타입: typeof v_74a79c.data.region } : '없음',
          },
          undefined체크: {
            member: v_74a79c.data.member === undefined,
            country: v_74a79c.data.country === undefined,
            region: v_74a79c.data.region === undefined,
          },
        });
      }
      return v_74a79c;
    },
    (v_5e9bfe) => {
      console.error('[API Request Error]', v_5e9bfe);
      return Promise.reject(v_5e9bfe);
    },
  );

  v_0c3a5b.interceptors.response.use(
    (v_3393e3) => {
      console.log(`[API Response] ${v_3393e3.config.url}`, v_3393e3.status);
      return v_3393e3;
    },
    async (error: v_3333d3) => {

      if (v_5e9bfe.code === 'ECONNABORTED' || v_5e9bfe.message.includes('timeout')) {
        console.error('[API Timeout]', v_5e9bfe.config?.url);
        if (v_c65f5d) {
          await v_e4d665(v_c65f5d);
        }
      } else {

        console.error('[API Error]', {
          url: v_5e9bfe.config?.url,
          method: v_5e9bfe.config?.method,
          status: v_5e9bfe.response?.status,
          statusText: v_5e9bfe.response?.statusText,
          data: v_5e9bfe.response?.data,
          message: v_5e9bfe.message,
        });
      }
      return Promise.reject(v_5e9bfe);
    },
  );

  return v_0c3a5b;
};

export const v_60e3a5 = async (
  v_e0c7e8,
  v_c65f5d,
): Promise<boolean> => {
  try {
    const v_9f42a4 = v_7488d5(v_c65f5d);
    const request: v_81dfe9 = { email: v_e0c7e8 };

    console.log('[회원가입 1단계] 이메일 중복 확인 요청:', v_e0c7e8);

    const v_3393e3 = await v_9f42a4.post<v_70f41f>(
      '/login-checker-email',
      v_576f5a,
    );

    const v_43c42e = v_3393e3.data.data[0]?.value === 'OK';
    console.log('[회원가입 1단계] 이메일 중복 확인 결과:', v_43c42e ? '사용 가능' : '중복');

    return v_43c42e;
  } catch (v_5e9bfe) {
    console.error('[회원가입 1단계] 이메일 중복 확인 실패:', v_5e9bfe);
    throw v_5e9bfe;
  }
};

export const v_f5ecec = async (
  v_e0c7e8,
  v_c65f5d,
): Promise<boolean> => {
  try {
    const v_9f42a4 = v_7488d5(v_c65f5d);
    const request: v_8fe320 = { email: v_e0c7e8 };

    console.log('[로그인] 이메일 존재 확인 요청:', v_e0c7e8);

    const v_3393e3 = await v_9f42a4.post<v_7f7c81>(
      '/ap1810-i01',
      v_576f5a,
    );

    const v_43c42e = v_3393e3.data.data[0]?.result === true;
    console.log('[로그인] 이메일 존재 확인 결과:', v_43c42e ? '등록된 이메일' : '미등록 이메일');

    return v_43c42e;
  } catch (v_5e9bfe) {
    console.error('[로그인] 이메일 존재 확인 실패:', v_5e9bfe);
    throw v_5e9bfe;
  }
};

export const v_01332e = async (
  v_9bf12c,
  v_c65f5d,
): Promise<number | null> => {
  try {
    const v_9f42a4 = v_7488d5(v_c65f5d);
    const request: v_a357d3 = { email: v_9bf12c };

    console.log('[회원가입 2단계] 추천인 이메일 확인 요청:', v_9bf12c);

    const v_3393e3 = await v_9f42a4.post<v_d6bdce>(
      '/ap1810-i01',
      v_576f5a,
    );

    const v_43c42e = v_3393e3.data.data[0];
    if (v_43c42e?.result === true && v_43c42e.member) {
      console.log('[회원가입 2단계] 추천인 확인 성공, member ID:', v_43c42e.member);
      return v_43c42e.member;
    } else {
      console.log('[회원가입 2단계] 추천인 확인 실패: 유효하지 않은 이메일');
      return null;
    }
  } catch (v_5e9bfe) {
    console.error('[회원가입 2단계] 추천인 이메일 확인 실패:', v_5e9bfe);
    throw v_5e9bfe;
  }
};

export const v_35200c = async (
  signupData: v_e71577,
  v_c65f5d,
): Promise<boolean> => {
  try {
    const v_9f42a4 = v_7488d5(v_c65f5d);

    console.log('[회원가입 3단계] 회원가입 실행 요청:', {
      email: v_df7dab.email,
      firstname: v_df7dab.firstname,
      lastname: v_df7dab.lastname,
      gender: v_df7dab.gender,
      age: v_df7dab.age,
      os: v_df7dab.os,
    });

    const v_3393e3 = await v_9f42a4.post<v_2c1a39>(
      '/login-06-joinAndAccount',
      v_df7dab,
    );

    const v_43c42e = v_3393e3.data.data[0]?.text === 'ok';
    console.log('[회원가입 3단계] 회원가입 결과:', v_43c42e ? '성공' : '실패');

    return v_43c42e;
  } catch (v_5e9bfe) {
    console.error('[회원가입 3단계] 회원가입 실행 실패:', v_5e9bfe);
    throw v_5e9bfe;
  }
};

export const v_9d2541 = async (
  v_e0c7e8,
  v_6bee94,
  v_c65f5d,
): Promise<boolean> => {
  try {
    const v_9f42a4 = v_7488d5(v_c65f5d);
    const request: v_3edf6c = { email: v_e0c7e8, pin: v_6bee94 };

    console.log('[회원가입 4단계] 로그인 확인 요청:', v_e0c7e8);

    const v_3393e3 = await v_9f42a4.post<v_d5571c>(
      '/login-checker',
      v_576f5a,
    );

    const v_43c42e = v_3393e3.data.data[0]?.value === 'OK';
    console.log('[회원가입 4단계] 로그인 확인 결과:', v_43c42e ? '성공' : '실패');

    return v_43c42e;
  } catch (v_5e9bfe) {
    console.error('[회원가입 4단계] 로그인 확인 실패:', v_5e9bfe);
    throw v_5e9bfe;
  }
};

export const v_91bb22 = {

  getGenderCode: (v_c3eac4): number => {
    return v_c3eac4 === 'male' ? 2110 : 2111;
  },

  getAgeCode: (v_f83808): number => {
    const v_c3889d = {
      '10': 2210,
      '20': 2220,
      '30': 2230,
      '40': 2240,
      '50+': 2250,
    };
    return v_c3889d[v_f83808] || 2220;
  },

  getOSCode: (): number => {
    return v_326be8.OS === 'android' ? 3112 : 3113;
  },
};

export const v_a5170b = (v_9b6134): string => {
  return v_a928e1.SHA256(v_9b6134).toString();
};

export const v_b699a9 = async (
  v_e0c7e8,
  v_6bee94,
  v_c65f5d,
): Promise<v_74e8fc> => {
  try {
    const v_9f42a4 = v_7488d5(v_c65f5d);
    const request: v_8fc862 = {
      type: 4,
      email: v_e0c7e8,
      pin: v_6bee94,
    };

    console.log('[로그인] 이메일/비밀번호 로그인 요청:', v_e0c7e8);

    const v_3393e3 = await v_9f42a4.post<v_74e8fc>(
      '/login-01',
      v_576f5a,
    );

    if (v_3393e3.data.status === 'success') {
      console.log('[로그인] 이메일/비밀번호 로그인 성공');
    } else {
      console.error('[로그인] 이메일/비밀번호 로그인 실패:', v_3393e3.data);
    }

    return v_3393e3.data;
  } catch (v_5e9bfe) {
    console.error('[로그인] 이메일/비밀번호 로그인 오류:', v_5e9bfe);
    if (v_5e9bfe instanceof v_3333d3) {
      console.error('[로그인] 상세 오류 정보:', {
        url: v_5e9bfe.config?.url,
        method: v_5e9bfe.config?.method,
        status: v_5e9bfe.response?.status,
        statusText: v_5e9bfe.response?.statusText,
        data: v_5e9bfe.response?.data,
        message: v_5e9bfe.message,
      });
    }
    throw v_5e9bfe;
  }
};

export const v_508a17 = async (
  v_6bee94,
  v_49ea09,
  v_c65f5d,
): Promise<v_74e8fc> => {
  try {
    const v_9f42a4 = v_7488d5(v_c65f5d);
    const request: v_073611 = {
      type: 3,
      pin: v_6bee94,
      mobile: v_49ea09,
    };

    console.log('[로그인] 비밀번호 로그인 요청:', v_49ea09);

    const v_3393e3 = await v_9f42a4.post<v_74e8fc>(
      '/login-01',
      v_576f5a,
    );

    if (v_3393e3.data.status === 'success') {
      console.log('[로그인] 비밀번호 로그인 성공');
    } else {
      console.error('[로그인] 비밀번호 로그인 실패:', v_3393e3.data);
    }

    return v_3393e3.data;
  } catch (v_5e9bfe) {
    console.error('[로그인] 비밀번호 로그인 오류:', v_5e9bfe);
    if (v_5e9bfe instanceof v_3333d3) {
      console.error('[로그인] 상세 오류 정보:', {
        url: v_5e9bfe.config?.url,
        method: v_5e9bfe.config?.method,
        status: v_5e9bfe.response?.status,
        statusText: v_5e9bfe.response?.statusText,
        data: v_5e9bfe.response?.data,
        message: v_5e9bfe.message,
      });
    }
    throw v_5e9bfe;
  }
};

export const v_2ecc3f = async (
  v_b9bbbd,
  v_49ea09,
  v_c65f5d,
): Promise<boolean> => {
  try {
    const v_9f42a4 = v_7488d5(v_c65f5d);
    const request: v_7ec238 = {
      country: v_b9bbbd,
      mobile: v_49ea09,
    };

    console.log('[로그인] 전화번호 인증 코드 발송 요청:', v_49ea09);

    const v_3393e3 = await v_9f42a4.post<v_c5fe19>(
      '/login-02',
      v_576f5a,
    );

    const v_43c42e = v_3393e3.data.data[0]?.status === true;
    console.log('[로그인] 전화번호 인증 코드 발송 결과:', v_43c42e ? '성공' : '실패');

    return v_43c42e;
  } catch (v_5e9bfe) {
    console.error('[로그인] 전화번호 인증 코드 발송 오류:', v_5e9bfe);
    if (v_5e9bfe instanceof v_3333d3) {
      console.error('[로그인] 상세 오류 정보:', {
        url: v_5e9bfe.config?.url,
        method: v_5e9bfe.config?.method,
        status: v_5e9bfe.response?.status,
        statusText: v_5e9bfe.response?.statusText,
        data: v_5e9bfe.response?.data,
        message: v_5e9bfe.message,
      });
    }
    throw v_5e9bfe;
  }
};

export const v_3ca504 = async (
  v_49ea09,
  v_c99bd2,
  v_c65f5d,
): Promise<boolean> => {
  try {
    const v_9f42a4 = v_7488d5(v_c65f5d);
    const request: v_07bb04 = {
      mobile: v_49ea09,
      code: v_c99bd2,
    };

    console.log('[로그인] 전화번호 인증 코드 확인 요청:', v_49ea09);

    const v_3393e3 = await v_9f42a4.post<v_e7e12a>(
      '/login-03',
      v_576f5a,
    );

    const v_43c42e = v_3393e3.data.data === 'login';
    console.log('[로그인] 전화번호 인증 코드 확인 결과:', v_43c42e ? '로그인 가능' : '인증 실패');

    return v_43c42e;
  } catch (v_5e9bfe) {
    console.error('[로그인] 전화번호 인증 코드 확인 오류:', v_5e9bfe);
    if (v_5e9bfe instanceof v_3333d3) {
      console.error('[로그인] 상세 오류 정보:', {
        url: v_5e9bfe.config?.url,
        method: v_5e9bfe.config?.method,
        status: v_5e9bfe.response?.status,
        statusText: v_5e9bfe.response?.statusText,
        data: v_5e9bfe.response?.data,
        message: v_5e9bfe.message,
      });
    }
    throw v_5e9bfe;
  }
};

export const v_7e0a86 = async (
  v_49ea09,
  v_c65f5d,
): Promise<v_74e8fc> => {
  try {
    const v_9f42a4 = v_7488d5(v_c65f5d);
    const request: v_a88df4 = {
      type: 2,
      mobile: v_49ea09,
    };

    console.log('[로그인] 전화번호 로그인 요청:', v_49ea09);

    const v_3393e3 = await v_9f42a4.post<v_74e8fc>(
      '/login-01',
      v_576f5a,
    );

    if (v_3393e3.data.status === 'success') {
      console.log('[로그인] 전화번호 로그인 성공');
    } else {
      console.error('[로그인] 전화번호 로그인 실패:', v_3393e3.data);
    }

    return v_3393e3.data;
  } catch (v_5e9bfe) {
    console.error('[로그인] 전화번호 로그인 오류:', v_5e9bfe);
    if (v_5e9bfe instanceof v_3333d3) {
      console.error('[로그인] 상세 오류 정보:', {
        url: v_5e9bfe.config?.url,
        method: v_5e9bfe.config?.method,
        status: v_5e9bfe.response?.status,
        statusText: v_5e9bfe.response?.statusText,
        data: v_5e9bfe.response?.data,
        message: v_5e9bfe.message,
      });
    }
    throw v_5e9bfe;
  }
};

export const v_8025d1 = async (
  v_e0c7e8,
  v_c65f5d,
): Promise<boolean> => {
  try {
    const v_9f42a4 = v_7488d5(v_c65f5d);
    const request: v_897bd3 = {
      email: v_e0c7e8,
    };

    console.log('[로그인] 이메일 인증 코드 발송 요청:', v_e0c7e8);

    const v_3393e3 = await v_9f42a4.post<v_3eb2f0>(
      '/check-02-email',
      v_576f5a,
    );

    const v_d308b5 = v_3393e3.data.data[0]?.status;
    const v_43c42e = v_d308b5 === true || v_d308b5 === 'true';
    console.log('[로그인] 이메일 인증 코드 발송 결과:', v_43c42e ? '성공' : '실패', { status: v_d308b5 });

    return v_43c42e;
  } catch (v_5e9bfe) {
    console.error('[로그인] 이메일 인증 코드 발송 오류:', v_5e9bfe);
    if (v_5e9bfe instanceof v_3333d3) {
      console.error('[로그인] 상세 오류 정보:', {
        url: v_5e9bfe.config?.url,
        method: v_5e9bfe.config?.method,
        status: v_5e9bfe.response?.status,
        statusText: v_5e9bfe.response?.statusText,
        data: v_5e9bfe.response?.data,
        message: v_5e9bfe.message,
      });
    }
    throw v_5e9bfe;
  }
};

export const v_415628 = async (
  v_e0c7e8,
  v_c99bd2,
  v_c65f5d,
): Promise<boolean> => {
  try {
    const v_9f42a4 = v_7488d5(v_c65f5d);
    const request: v_b2dc50 = {
      email: v_e0c7e8,
      code: v_c99bd2,
    };

    console.log('[로그인] 이메일 인증 코드 확인 요청:', v_e0c7e8);

    const v_3393e3 = await v_9f42a4.post<v_2f87f0>(
      '/login-03-email',
      v_576f5a,
    );

    const v_43c42e = v_3393e3.data.status === 'success';
    console.log('[로그인] 이메일 인증 코드 확인 결과:', v_43c42e ? '성공' : '실패');

    return v_43c42e;
  } catch (v_5e9bfe) {
    console.error('[로그인] 이메일 인증 코드 확인 오류:', v_5e9bfe);
    if (v_5e9bfe instanceof v_3333d3) {
      console.error('[로그인] 상세 오류 정보:', {
        url: v_5e9bfe.config?.url,
        method: v_5e9bfe.config?.method,
        status: v_5e9bfe.response?.status,
        statusText: v_5e9bfe.response?.statusText,
        data: v_5e9bfe.response?.data,
        message: v_5e9bfe.message,
      });
    }
    throw v_5e9bfe;
  }
};

export const v_a81308 = async (
  v_e0c7e8,
  v_c65f5d,
): Promise<v_2ff10f> => {
  try {
    const v_9f42a4 = v_7488d5(v_c65f5d);
    const request: v_5060a1 = {
      email: v_e0c7e8,
    };

    console.log('[로그인] 이메일 인증 로그인 요청:', v_e0c7e8);

    const v_3393e3 = await v_9f42a4.post<v_2ff10f>(
      '/login-04-email',
      v_576f5a,
    );

    if (v_3393e3.data.status === 'success') {
      console.log('[로그인] 이메일 인증 로그인 성공');
    } else {
      console.error('[로그인] 이메일 인증 로그인 실패:', v_3393e3.data);
    }

    return v_3393e3.data;
  } catch (v_5e9bfe) {
    console.error('[로그인] 이메일 인증 로그인 오류:', v_5e9bfe);
    if (v_5e9bfe instanceof v_3333d3) {
      console.error('[로그인] 상세 오류 정보:', {
        url: v_5e9bfe.config?.url,
        method: v_5e9bfe.config?.method,
        status: v_5e9bfe.response?.status,
        statusText: v_5e9bfe.response?.statusText,
        data: v_5e9bfe.response?.data,
        message: v_5e9bfe.message,
      });
    }
    throw v_5e9bfe;
  }
};

export const v_ea3493 = async (
  v_660822,
  v_06cee6,
  v_c65f5d,
): Promise<boolean> => {
  try {
    const v_9f42a4 = v_7488d5(v_c65f5d);
    const request: v_d047dc = {
      member: v_660822,
      ssidw: v_06cee6,
    };

    console.log('[로그인] 세션 저장 요청:', v_660822);

    const v_3393e3 = await v_9f42a4.post<v_60982a>(
      '/saveSsidw',
      v_576f5a,
    );

    const v_43c42e = v_3393e3.data.data[0]?.affectedRows === 1;
    console.log('[로그인] 세션 저장 결과:', v_43c42e ? '성공' : '실패');

    return v_43c42e;
  } catch (v_5e9bfe) {
    console.error('[로그인] 세션 저장 오류:', v_5e9bfe);
    if (v_5e9bfe instanceof v_3333d3) {
      console.error('[로그인] 상세 오류 정보:', {
        url: v_5e9bfe.config?.url,
        method: v_5e9bfe.config?.method,
        status: v_5e9bfe.response?.status,
        statusText: v_5e9bfe.response?.statusText,
        data: v_5e9bfe.response?.data,
        message: v_5e9bfe.message,
      });
    }
    throw v_5e9bfe;
  }
};

export const v_98a863 = async (
  v_660822,
  v_c65f5d,
): Promise<v_85f3ff> => {
  try {
    const v_9f42a4 = v_7488d5(v_c65f5d);
    const request: v_b8b333 = {
      member: v_660822,
    };

    console.log('[로그인] 사용자 정보 조회 요청:', v_660822);

    const v_3393e3 = await v_9f42a4.get<v_85f3ff>(
      '/app7000-01',
      {
        params: v_576f5a,
      },
    );

    console.log('[로그인] 사용자 정보 조회 성공');

    return v_3393e3.data;
  } catch (v_5e9bfe) {
    console.error('[로그인] 사용자 정보 조회 오류:', v_5e9bfe);
    if (v_5e9bfe instanceof v_3333d3) {
      console.error('[로그인] 상세 오류 정보:', {
        url: v_5e9bfe.config?.url,
        method: v_5e9bfe.config?.method,
        status: v_5e9bfe.response?.status,
        statusText: v_5e9bfe.response?.statusText,
        data: v_5e9bfe.response?.data,
        message: v_5e9bfe.message,
      });
    }
    throw v_5e9bfe;
  }
};

export const v_a7ab3c = async (
  v_660822,
  v_c65f5d,
): Promise<v_0bd014> => {
  try {
    const v_9f42a4 = v_7488d5(v_c65f5d);
    const request: v_72b8c4 = {
      member: v_660822,
    };

    console.log('[마이페이지] 사용자 정보 조회 요청:', v_660822);

    const v_3393e3 = await v_9f42a4.post<v_0bd014>(
      '/app7110-01',
      v_576f5a,
    );

    console.log('[마이페이지] 사용자 정보 조회 성공');

    return v_3393e3.data;
  } catch (v_5e9bfe) {
    console.error('[마이페이지] 사용자 정보 조회 오류:', v_5e9bfe);
    if (v_5e9bfe instanceof v_3333d3) {
      console.error('[마이페이지] 상세 오류 정보:', {
        url: v_5e9bfe.config?.url,
        method: v_5e9bfe.config?.method,
        status: v_5e9bfe.response?.status,
        statusText: v_5e9bfe.response?.statusText,
        data: v_5e9bfe.response?.data,
        message: v_5e9bfe.message,
      });
    }
    throw v_5e9bfe;
  }
};

export const v_152d53 = async (
  v_660822,
  v_54d565,
  v_c65f5d,
): Promise<v_680003> => {
  try {
    const v_9f42a4 = v_7488d5(v_c65f5d);
    const request: v_bd3e83 = {
      member: v_660822,
      firstname: v_54d565,
    };

    console.log('[마이페이지] 이름 수정 요청:', { member: v_660822, firstname: v_54d565 });

    const v_3393e3 = await v_9f42a4.post<v_680003>(
      '/app7120-01',
      v_576f5a,
    );

    console.log('[마이페이지] 이름 수정 성공');

    return v_3393e3.data;
  } catch (v_5e9bfe) {
    console.error('[마이페이지] 이름 수정 오류:', v_5e9bfe);
    if (v_5e9bfe instanceof v_3333d3) {
      console.error('[마이페이지] 상세 오류 정보:', {
        url: v_5e9bfe.config?.url,
        method: v_5e9bfe.config?.method,
        status: v_5e9bfe.response?.status,
        statusText: v_5e9bfe.response?.statusText,
        data: v_5e9bfe.response?.data,
        message: v_5e9bfe.message,
      });
    }
    throw v_5e9bfe;
  }
};

export const v_7f8c9e = async (
  v_660822,
  v_9517dc,
  v_c65f5d,
): Promise<v_2b5bdc> => {
  try {
    const v_9f42a4 = v_7488d5(v_c65f5d);
    const request: v_52573c = {
      member: v_660822,
      lastname: v_9517dc,
    };

    console.log('[마이페이지] 성 수정 요청:', { member: v_660822, lastname: v_9517dc });

    const v_3393e3 = await v_9f42a4.post<v_2b5bdc>(
      '/app7130-01',
      v_576f5a,
    );

    console.log('[마이페이지] 성 수정 성공');

    return v_3393e3.data;
  } catch (v_5e9bfe) {
    console.error('[마이페이지] 성 수정 오류:', v_5e9bfe);
    if (v_5e9bfe instanceof v_3333d3) {
      console.error('[마이페이지] 상세 오류 정보:', {
        url: v_5e9bfe.config?.url,
        method: v_5e9bfe.config?.method,
        status: v_5e9bfe.response?.status,
        statusText: v_5e9bfe.response?.statusText,
        data: v_5e9bfe.response?.data,
        message: v_5e9bfe.message,
      });
    }
    throw v_5e9bfe;
  }
};

export const v_53d723 = async (
  v_660822,
  v_49ea09,
  v_3f1fb1,
  v_c65f5d,
): Promise<v_648048> => {
  try {
    const v_9f42a4 = v_7488d5(v_c65f5d);
    const request: v_4ac02a = {
      member: v_660822,
      mobile: v_49ea09,
      mobilecode: v_3f1fb1,
    };

    console.log('[전화번호수정] 전화번호 수정 요청:', { member: v_660822, mobile: v_49ea09, mobilecode: v_3f1fb1 });

    const v_3393e3 = await v_9f42a4.post<v_648048>(
      '/app7153-03',
      v_576f5a,
    );

    console.log('[전화번호수정] 전화번호 수정 성공:', v_3393e3.data);

    return v_3393e3.data;
  } catch (v_5e9bfe) {
    console.error('[전화번호수정] 전화번호 수정 오류:', v_5e9bfe);
    if (v_5e9bfe instanceof v_3333d3) {
      console.error('[전화번호수정] 상세 오류 정보:', {
        url: v_5e9bfe.config?.url,
        method: v_5e9bfe.config?.method,
        status: v_5e9bfe.response?.status,
        statusText: v_5e9bfe.response?.statusText,
        data: v_5e9bfe.response?.data,
        message: v_5e9bfe.message,
      });
    }
    throw v_5e9bfe;
  }
};

export const v_71d37e = async (
  v_660822,
  v_c3eac4,
  v_c65f5d,
): Promise<v_6896c1> => {
  try {
    const v_9f42a4 = v_7488d5(v_c65f5d);
    const request: v_32dea4 = {
      member: v_660822,
      gender: v_c3eac4,
    };

    console.log('[마이페이지] 성별 수정 요청:', { member: v_660822, gender: v_c3eac4 });

    const v_3393e3 = await v_9f42a4.post<v_6896c1>(
      '/app7180-01',
      v_576f5a,
    );

    console.log('[마이페이지] 성별 수정 성공');

    return v_3393e3.data;
  } catch (v_5e9bfe) {
    console.error('[마이페이지] 성별 수정 오류:', v_5e9bfe);
    if (v_5e9bfe instanceof v_3333d3) {
      console.error('[마이페이지] 상세 오류 정보:', {
        url: v_5e9bfe.config?.url,
        method: v_5e9bfe.config?.method,
        status: v_5e9bfe.response?.status,
        statusText: v_5e9bfe.response?.statusText,
        data: v_5e9bfe.response?.data,
        message: v_5e9bfe.message,
      });
    }
    throw v_5e9bfe;
  }
};

export const v_07f367 = async (
  v_660822,
  v_6e272b,
  v_c65f5d,
): Promise<v_3059f1> => {
  try {
    const v_9f42a4 = v_7488d5(v_c65f5d);
    const request: v_97a4a7 = {
      member: v_660822,
      ages: v_6e272b,
    };

    console.log('[마이페이지] 나이 수정 요청:', { member: v_660822, ages: v_6e272b });

    const v_3393e3 = await v_9f42a4.post<v_3059f1>(
      '/app7170-01',
      v_576f5a,
    );

    console.log('[마이페이지] 나이 수정 성공');

    return v_3393e3.data;
  } catch (v_5e9bfe) {
    console.error('[마이페이지] 나이 수정 오류:', v_5e9bfe);
    if (v_5e9bfe instanceof v_3333d3) {
      console.error('[마이페이지] 상세 오류 정보:', {
        url: v_5e9bfe.config?.url,
        method: v_5e9bfe.config?.method,
        status: v_5e9bfe.response?.status,
        statusText: v_5e9bfe.response?.statusText,
        data: v_5e9bfe.response?.data,
        message: v_5e9bfe.message,
      });
    }
    throw v_5e9bfe;
  }
};

export const v_60f557 = async (
  v_c65f5d,
): Promise<v_c4dd46> => {
  try {
    const v_9f42a4 = v_7488d5(v_c65f5d);

    console.log('[마이페이지] 국가 목록 조회 요청');

    const v_3393e3 = await v_9f42a4.get<v_c4dd46>('/countries');

    console.log('[마이페이지] 국가 목록 조회 성공');

    return v_3393e3.data;
  } catch (v_5e9bfe) {
    console.error('[마이페이지] 국가 목록 조회 오류:', v_5e9bfe);
    if (v_5e9bfe instanceof v_3333d3) {
      console.error('[마이페이지] 상세 오류 정보:', {
        url: v_5e9bfe.config?.url,
        method: v_5e9bfe.config?.method,
        status: v_5e9bfe.response?.status,
        statusText: v_5e9bfe.response?.statusText,
        data: v_5e9bfe.response?.data,
        message: v_5e9bfe.message,
      });
    }
    throw v_5e9bfe;
  }
};

export const v_11e39e = async (
  v_b9bbbd,
  v_c65f5d,
): Promise<v_7d842d> => {
  try {
    const v_9f42a4 = v_7488d5(v_c65f5d);
    const request: v_6d05a4 = {
      country: v_b9bbbd,
    };

    console.log('[마이페이지] 지역 목록 조회 요청:', { country: v_b9bbbd });

    const v_3393e3 = await v_9f42a4.post<v_7d842d>(
      '/app7190-01',
      v_576f5a,
    );

    console.log('[마이페이지] 지역 목록 조회 성공');

    return v_3393e3.data;
  } catch (v_5e9bfe) {
    console.error('[마이페이지] 지역 목록 조회 오류:', v_5e9bfe);
    if (v_5e9bfe instanceof v_3333d3) {
      console.error('[마이페이지] 상세 오류 정보:', {
        url: v_5e9bfe.config?.url,
        method: v_5e9bfe.config?.method,
        status: v_5e9bfe.response?.status,
        statusText: v_5e9bfe.response?.statusText,
        data: v_5e9bfe.response?.data,
        message: v_5e9bfe.message,
      });
    }
    throw v_5e9bfe;
  }
};

export const v_4296b8 = async (
  v_660822,
  v_b9bbbd,
  v_a6c30b,
  v_c65f5d,
  v_b36f96,
): Promise<v_9b135d> => {
  try {

    if (v_660822 === undefined || v_660822 === null || isNaN(v_660822)) {
      throw new Error('회원 ID가 유효하지 않습니다.');
    }

    if (v_b9bbbd === undefined || v_b9bbbd === null || isNaN(v_b9bbbd)) {
      throw new Error('국가 코드가 유효하지 않습니다.');
    }

    if (v_a6c30b === undefined || v_a6c30b === null || isNaN(v_a6c30b)) {
      throw new Error('지역 코드가 유효하지 않습니다.');
    }

    const v_9f42a4 = v_7488d5(v_c65f5d);

    const v_90772d = Number(v_660822);
    const v_f6907d = Number(v_b9bbbd);
    const v_5cf162 = Number(v_a6c30b);

    console.log('[마이페이지] 지역 수정 요청 - 입력 파라미터:', { 
      입력member: v_660822,
      입력country: v_b9bbbd,
      입력region: v_a6c30b,
      입력타입: {
        member: typeof v_660822,
        country: typeof v_b9bbbd,
        region: typeof v_a6c30b,
      },
    });

    console.log('[마이페이지] 지역 수정 요청 - 변환 후:', { 
      변환member: v_90772d,
      변환country: v_f6907d,
      변환region: v_5cf162,
      변환타입: {
        member: typeof v_90772d,
        country: typeof v_f6907d,
        region: typeof v_5cf162,
      },
      isNaN체크: {
        member: isNaN(v_90772d),
        country: isNaN(v_f6907d),
        region: isNaN(v_5cf162),
      },
    });

    const request: v_bf21af = {
      member: v_90772d,
      country: v_f6907d,
      region: v_5cf162,
    };

    if (v_b36f96?.countrycode !== undefined && v_b36f96?.countrycode !== null) {
      v_576f5a.countrycode = v_b36f96.countrycode;
    }
    if (v_b36f96?.mobilecode !== undefined && v_b36f96?.mobilecode !== null) {
      v_576f5a.mobilecode = v_b36f96.mobilecode;
    }

    const v_2bb785 = {};
    if (v_576f5a.member !== undefined) v_2bb785.member = v_576f5a.member;
    if (v_576f5a.country !== undefined) v_2bb785.country = v_576f5a.country;
    if (v_576f5a.region !== undefined) v_2bb785.region = v_576f5a.region;
    if (v_576f5a.countrycode !== undefined) v_2bb785.countrycode = v_576f5a.countrycode;
    if (v_576f5a.mobilecode !== undefined) v_2bb785.mobilecode = v_576f5a.mobilecode;

    console.log('[마이페이지] 지역 수정 요청 - 최종 request 객체:', JSON.stringify(v_2bb785, null, 2));
    console.log('[마이페이지] 지역 수정 요청 - cleanRequest 확인:', {
      원본: v_576f5a,
      정리됨: v_2bb785,
      JSON문자열: JSON.stringify(v_2bb785),
      파싱: JSON.parse(JSON.stringify(v_2bb785)),
    });
    console.log('[마이페이지] 지역 수정 요청 - request 상세:', { 
      member: v_576f5a.member, 
      country: v_576f5a.country, 
      region: v_576f5a.region,
      types: {
        member: typeof v_576f5a.member,
        country: typeof v_576f5a.country,
        region: typeof v_576f5a.region,
      },
      values: {
        memberValue: v_576f5a.member,
        countryValue: v_576f5a.country,
        regionValue: v_576f5a.region,
      },
      hasUndefined: {
        member: v_576f5a.member === undefined,
        country: v_576f5a.country === undefined,
        region: v_576f5a.region === undefined,
      },
    });

    const v_3393e3 = await v_9f42a4.post<v_9b135d>(
      '/app7190-02',
      v_2bb785, 
    );

    console.log('[마이페이지] 지역 수정 성공');

    return v_3393e3.data;
  } catch (v_5e9bfe) {
    console.error('[마이페이지] 지역 수정 오류:', v_5e9bfe);
    if (v_5e9bfe instanceof v_3333d3) {
      console.error('[마이페이지] 상세 오류 정보:', {
        url: v_5e9bfe.config?.url,
        method: v_5e9bfe.config?.method,
        status: v_5e9bfe.response?.status,
        statusText: v_5e9bfe.response?.statusText,
        data: v_5e9bfe.response?.data,
        message: v_5e9bfe.message,
      });
    }
    throw v_5e9bfe;
  }
};

export const v_d7d5a2 = async (
  v_660822,
  v_c65f5d,
): Promise<v_6ffbdd> => {
  try {
    const v_c9c489 = v_e4a763();
    const v_36dd9e = v_c9c489.GATEWAY_AUTH_CODE;
    const v_c01615 = v_c9c489.GATEWAY_NODEJS;
    const v_f71b56 = `${v_c01615}/logout-9705`;

    console.log('[로그아웃] 로그아웃 요청:', { member: v_660822 });

    const v_3393e3 = await v_12a388(
      '/logout-9705',
      {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
          Authorization: `Bearer ${v_36dd9e}`,
        },
        body: JSON.stringify({
          member: v_660822,
        } as v_13e1b8),
      },
      v_c65f5d,
    );

    if (!v_3393e3.ok) {
      throw new Error(`HTTP error! status: ${v_3393e3.status}`);
    }

    const data: v_6ffbdd = await v_3393e3.json();
    console.log('[로그아웃] 로그아웃 성공');

    return v_9390e8;
  } catch (v_5e9bfe) {
    console.error('[로그아웃] 로그아웃 오류:', v_5e9bfe);
    if (v_5e9bfe instanceof Error && v_5e9bfe.message === 'API request timeout') {

      throw v_5e9bfe;
    }
    throw v_5e9bfe;
  }
};

export const v_10a69f = async (
  v_660822,
  v_6bee94,
  v_58ca36,
  v_896cf8,
  v_c65f5d,
): Promise<boolean> => {
  try {
    const v_9f42a4 = v_7488d5(v_c65f5d);
    const request: v_62c808 = {
      pin: v_6bee94,
      reason: v_58ca36,
      reasonNum: v_896cf8,
      member: v_660822,
    };

    console.log('[회원 탈퇴] 회원 탈퇴 요청:', { member: v_660822, reasonNum: v_896cf8 });

    const v_3393e3 = await v_9f42a4.post<v_6dba58>(
      '/app8080-01',
      v_576f5a,
    );

    const v_43c42e = v_3393e3.data.data?.[0]?.count === 1;
    console.log('[회원 탈퇴] 회원 탈퇴 결과:', v_43c42e ? '성공' : '실패');

    return v_43c42e;
  } catch (v_5e9bfe) {
    console.error('[회원 탈퇴] 회원 탈퇴 오류:', v_5e9bfe);
    if (v_5e9bfe instanceof v_3333d3) {
      console.error('[회원 탈퇴] 상세 오류 정보:', {
        url: v_5e9bfe.config?.url,
        method: v_5e9bfe.config?.method,
        status: v_5e9bfe.response?.status,
        statusText: v_5e9bfe.response?.statusText,
        data: v_5e9bfe.response?.data,
        message: v_5e9bfe.message,
      });
    }
    throw v_5e9bfe;
  }
};

export const v_b954f5 = async (
  v_660822,
  v_6bee94,
  v_c65f5d,
): Promise<v_9e5c58> => {
  try {
    const v_9f42a4 = v_7488d5(v_c65f5d);
    const request: v_9d18e0 = {
      member: v_660822,
      pin: v_6bee94,
    };

    console.log('[비밀번호 변경] 비밀번호 변경 요청:', { member: v_660822 });

    const v_3393e3 = await v_9f42a4.post<v_9e5c58>(
      '/app7163-01',
      v_576f5a,
    );

    console.log('[비밀번호 변경] 비밀번호 변경 성공');

    return v_3393e3.data;
  } catch (v_5e9bfe) {
    console.error('[비밀번호 변경] 비밀번호 변경 오류:', v_5e9bfe);
    if (v_5e9bfe instanceof v_3333d3) {
      console.error('[비밀번호 변경] 상세 오류 정보:', {
        url: v_5e9bfe.config?.url,
        method: v_5e9bfe.config?.method,
        status: v_5e9bfe.response?.status,
        statusText: v_5e9bfe.response?.statusText,
        data: v_5e9bfe.response?.data,
        message: v_5e9bfe.message,
      });
    }
    throw v_5e9bfe;
  }
};

export const v_ab08d0 = async (
  v_660822,
  v_965edf = 0,
  v_c65f5d,
): Promise<v_7ffbeb> => {
  try {
    const v_9f42a4 = v_7488d5(v_c65f5d);
    const request: v_0a585d = {
      member: v_660822,
      start: v_965edf,
    };

    console.log('[알림] 알림 목록 조회 요청:', { member: v_660822, start: v_965edf });

    const v_3393e3 = await v_9f42a4.post<v_7ffbeb>(
      '/ap6000-01',
      v_576f5a,
    );

    console.log('[알림] 알림 목록 조회 성공, 알림 개수:', v_3393e3.data.data?.length || 0);

    return v_3393e3.data;
  } catch (v_5e9bfe) {
    console.error('[알림] 알림 목록 조회 오류:', v_5e9bfe);
    if (v_5e9bfe instanceof v_3333d3) {
      console.error('[알림] 상세 오류 정보:', {
        url: v_5e9bfe.config?.url,
        method: v_5e9bfe.config?.method,
        status: v_5e9bfe.response?.status,
        statusText: v_5e9bfe.response?.statusText,
        data: v_5e9bfe.response?.data,
        message: v_5e9bfe.message,
      });
    }
    throw v_5e9bfe;
  }
};

export const v_26e528 = async (
  v_660822,
  v_9f1622,
  v_a9d5df = false,
  v_c65f5d,
): Promise<v_495962> => {
  try {
    const v_9f42a4 = v_7488d5(v_c65f5d);
    const request: v_2737f8 = {
      isBroadcast: v_a9d5df,
      member: v_660822,
      title: v_9f1622,
    };

    console.log('[알림] 알림 메시지 전송 요청:', { member: v_660822, title: v_9f1622, isBroadcast: v_a9d5df });

    const v_3393e3 = await v_9f42a4.post<v_495962>(
      '/ap6000-02',
      v_576f5a,
    );

    console.log('[알림] 알림 메시지 전송 성공');

    return v_3393e3.data;
  } catch (v_5e9bfe) {
    console.error('[알림] 알림 메시지 전송 오류:', v_5e9bfe);
    if (v_5e9bfe instanceof v_3333d3) {
      console.error('[알림] 상세 오류 정보:', {
        url: v_5e9bfe.config?.url,
        method: v_5e9bfe.config?.method,
        status: v_5e9bfe.response?.status,
        statusText: v_5e9bfe.response?.statusText,
        data: v_5e9bfe.response?.data,
        message: v_5e9bfe.message,
      });
    }
    throw v_5e9bfe;
  }
};

export const v_1fc3f6 = async (
  v_660822,
  v_10046b,
  v_a9d5df = false,
  v_c65f5d,
): Promise<v_368246> => {
  try {
    const v_9f42a4 = v_7488d5(v_c65f5d);
    const request: v_ba9bd0 = {
      isBroadcast: v_a9d5df,
      member: v_660822,
      board: v_10046b,
    };

    console.log('[알림] 알림 메시지 삭제 요청:', { member: v_660822, board: v_10046b, isBroadcast: v_a9d5df });

    const v_3393e3 = await v_9f42a4.post<v_368246>(
      '/ap6000-03',
      v_576f5a,
    );

    console.log('[알림] 알림 메시지 삭제 성공');

    return v_3393e3.data;
  } catch (v_5e9bfe) {
    console.error('[알림] 알림 메시지 삭제 오류:', v_5e9bfe);
    if (v_5e9bfe instanceof v_3333d3) {
      console.error('[알림] 상세 오류 정보:', {
        url: v_5e9bfe.config?.url,
        method: v_5e9bfe.config?.method,
        status: v_5e9bfe.response?.status,
        statusText: v_5e9bfe.response?.statusText,
        data: v_5e9bfe.response?.data,
        message: v_5e9bfe.message,
      });
    }
    throw v_5e9bfe;
  }
};

export const v_3e4cca = async (
  v_660822,
  v_c65f5d,
): Promise<v_294d11> => {
  try {
    const v_9f42a4 = v_7488d5(v_c65f5d);
    const request: v_7092d8 = {
      member: v_660822,
    };

    console.log('[알림] 전체 알림 삭제 요청:', { member: v_660822 });

    const v_3393e3 = await v_9f42a4.post<v_294d11>(
      '/ap6000-04delete',
      v_576f5a,
    );

    console.log('[알림] 전체 알림 삭제 성공');

    return v_3393e3.data;
  } catch (v_5e9bfe) {
    console.error('[알림] 전체 알림 삭제 오류:', v_5e9bfe);
    if (v_5e9bfe instanceof v_3333d3) {
      console.error('[알림] 상세 오류 정보:', {
        url: v_5e9bfe.config?.url,
        method: v_5e9bfe.config?.method,
        status: v_5e9bfe.response?.status,
        statusText: v_5e9bfe.response?.statusText,
        data: v_5e9bfe.response?.data,
        message: v_5e9bfe.message,
      });
    }
    throw v_5e9bfe;
  }
};

export const v_903861 = async (
  v_4c1edc,
  v_660822,
  v_c65f5d,
): Promise<v_ed2980> => {
  try {
    const v_9f42a4 = v_7488d5(v_c65f5d);
    const request: v_0671ef = {
      pushkey: v_4c1edc,
      member: v_660822,
    };

    console.log('[알림] FCM 토큰 등록 요청:', { member: v_660822, pushkey: v_4c1edc.substring(0, 20) + '...' });

    const v_3393e3 = await v_9f42a4.post<v_ed2980>(
      '/login-pushkeyreg',
      v_576f5a,
    );

    console.log('[알림] FCM 토큰 등록 성공');

    return v_3393e3.data;
  } catch (v_5e9bfe) {
    console.error('[알림] FCM 토큰 등록 오류:', v_5e9bfe);
    if (v_5e9bfe instanceof v_3333d3) {
      console.error('[알림] 상세 오류 정보:', {
        url: v_5e9bfe.config?.url,
        method: v_5e9bfe.config?.method,
        status: v_5e9bfe.response?.status,
        statusText: v_5e9bfe.response?.statusText,
        data: v_5e9bfe.response?.data,
        message: v_5e9bfe.message,
      });
    }
    throw v_5e9bfe;
  }
};

const v_b464ed = (v_34b365, v_a36282, v_ed3911, v_5d858d): number => {
  const v_bef3bf = 6371000; 
  const v_32a354 = (v_ed3911 - v_34b365) * Math.PI / 180;
  const v_84b828 = (v_5d858d - v_a36282) * Math.PI / 180;
  const v_779914 =
    Math.sin(v_32a354 / 2) * Math.sin(v_32a354 / 2) +
    Math.cos(v_34b365 * Math.PI / 180) * Math.cos(v_ed3911 * Math.PI / 180) *
    Math.sin(v_84b828 / 2) * Math.sin(v_84b828 / 2);
  const v_3f4e2e = 2 * Math.atan2(Math.sqrt(v_779914), Math.sqrt(1 - v_779914));
  return v_bef3bf * v_3f4e2e;
};

const v_2dc24c = (v_34b365, v_a36282, v_ed3911, v_5d858d): number => {
  const v_84b828 = (v_5d858d - v_a36282) * Math.PI / 180;
  const v_53e984 = v_34b365 * Math.PI / 180;
  const v_01952a = v_ed3911 * Math.PI / 180;
  const v_64877a = Math.sin(v_84b828) * Math.cos(v_01952a);
  const v_62c214 = Math.cos(v_53e984) * Math.sin(v_01952a) - Math.sin(v_53e984) * Math.cos(v_01952a) * Math.cos(v_84b828);
  const v_6f4cf9 = Math.atan2(v_64877a, v_62c214) * 180 / Math.PI;
  return (v_6f4cf9 + 360) % 360;
};

export const v_c615aa = async (
  v_b5de9c,
  v_985be2,
  v_660822,
  v_c65f5d,
): Promise<any> => {
  try {
    const v_9f42a4 = v_7488d5(v_c65f5d);
    const v_cd6a57 = {
      member: v_660822,
      latitude: v_b5de9c,
      longitude: v_985be2,
      limit: 120,
    };

    console.log('=== fetchMapMarkerDataRaw API 호출 ===');
    console.log('endpoint: app2000-01');
    console.log('requestBody:', JSON.stringify(v_cd6a57));

    const v_3393e3 = await v_9f42a4.post(
      '/app2000-01',
      v_cd6a57,
    );

    const v_9390e8 = v_3393e3.data;
    console.log('=== fetchMapMarkerDataRaw API 응답 ===');
    console.log('data.data length:', v_9390e8?.data?.length);

    return v_9390e8;
  } catch (v_5e9bfe) {
    console.error('맵 마커 원본 데이터 가져오기 오류:', v_5e9bfe);
    if (v_5e9bfe instanceof v_3333d3) {
      console.error('[맵 마커 원본] 상세 오류 정보:', {
        url: v_5e9bfe.config?.url,
        method: v_5e9bfe.config?.method,
        status: v_5e9bfe.response?.status,
        statusText: v_5e9bfe.response?.statusText,
        data: v_5e9bfe.response?.data,
        message: v_5e9bfe.message,
      });
    }
    throw v_5e9bfe;
  }
};

export const v_f84ef5 = async (
  v_b5de9c,
  v_985be2,
  v_660822,
  v_c65f5d,
): Promise<v_f71847[]> => {
  try {
    const v_9f42a4 = v_7488d5(v_c65f5d);
    const v_cd6a57 = {
      member: v_660822,
      latitude: v_b5de9c,
      longitude: v_985be2,
      limit: 120,
    };

    console.log('🌐 [app2000-01] fetchMapMarkerData API 호출 시작');
    console.log('🌐 [app2000-01] endpoint: app2000-01');
    console.log('🌐 [app2000-01] requestBody:', JSON.stringify(v_cd6a57, null, 2));
    console.log('🌐 [app2000-01] axiosInstance.post 호출 전');

    const v_3393e3 = await v_9f42a4.post(
      '/app2000-01',
      v_cd6a57,
    );

    console.log('✅ [app2000-01] axiosInstance.post 응답 받음');
    const v_9390e8 = v_3393e3.data;
    console.log('✅ [app2000-01] fetchMapMarkerData API 응답 완료');
    console.log('✅ [app2000-01] data.data length:', v_9390e8?.data?.length);
    console.log('✅ [app2000-01] 전체 응답 구조:', {
      success: v_9390e8?.success,
      dataLength: v_9390e8?.data?.length,
      hasData: !!v_9390e8?.data,
    });

    if (v_9390e8?.data && Array.isArray(v_9390e8.data)) {
      return v_9390e8.data.map((v_8c0b26) => {
        const v_1906d6 = v_8c0b26.lat || v_8c0b26.latitude;
        const v_8cd402 = v_8c0b26.lng || v_8c0b26.longitude;

        let v_926d1c = v_8c0b26.distance || 0;
        if (v_1906d6 && v_8cd402 && (v_926d1c === 0 || !v_8c0b26.distance)) {
          v_926d1c = v_b464ed(v_b5de9c, v_985be2, v_1906d6, v_8cd402);
        }

        let v_1fec52 = v_8c0b26.direction || 0;
        if (v_1906d6 && v_8cd402 && (v_1fec52 === 0 || !v_8c0b26.direction)) {
          v_1fec52 = v_2dc24c(v_b5de9c, v_985be2, v_1906d6, v_8cd402);
        }

        return {
          spotID: v_8c0b26.spotid || v_8c0b26.spotID || v_8c0b26.id || 0,
          distance: v_926d1c,
          direction: v_1fec52,
          name: v_8c0b26.name || v_8c0b26.brand || v_8c0b26.coin || v_8c0b26.title || 'XRUN coin',
          latitude: v_1906d6,
          longitude: v_8cd402,
          xrunPrice: v_8c0b26.xrunprice || v_8c0b26.xrunPrice || v_8c0b26.price || 0,
          iconurl: v_8c0b26.iconurl || v_8c0b26.brandlogo || v_8c0b26.brandlogo_file || v_8c0b26.adthumbnail2 || v_8c0b26.adthumbnail2_file || '',
          joindesc: v_8c0b26.joindesc || v_8c0b26.description || '',
          brand: v_8c0b26.brand || v_8c0b26.coin || '',
          coins: v_8c0b26.coins || v_8c0b26.coin || '',
          coin: v_8c0b26.coin || '', 

          campid: v_8c0b26.campid || v_8c0b26.campId || v_8c0b26.campaignid || v_8c0b26.campaignId || '',

          advertisement: v_8c0b26.advertisement || v_8c0b26.adid || v_8c0b26.ad || v_8c0b26.coin || '',
        } as v_f71847 & { campid?: string; advertisement?: string | number };
      });
    }

    console.log('API 응답에 data.data가 없거나 배열이 아님');
    return [];
  } catch (v_5e9bfe) {
    console.error('맵 마커 데이터 가져오기 오류:', v_5e9bfe);
    if (v_5e9bfe instanceof v_3333d3) {
      console.error('[맵 마커] 상세 오류 정보:', {
        url: v_5e9bfe.config?.url,
        method: v_5e9bfe.config?.method,
        status: v_5e9bfe.response?.status,
        statusText: v_5e9bfe.response?.statusText,
        data: v_5e9bfe.response?.data,
        message: v_5e9bfe.message,
      });
    }

    return [];
  }
};

export const v_91d5e4 = async (
  v_660822,
  v_b5de9c,
  v_985be2,
  v_c65f5d,
): Promise<any> => {
  try {
    const v_c9c489 = v_e4a763();
    const v_f71b56 = `${v_c9c489.GATEWAY_NODEJS}/virtualCoin`;

    const v_cd6a57 = {
      member: v_660822,
      latitude: v_b5de9c,
      longitude: v_985be2,
    };

    console.log('=== virtualCoin API 호출 ===');
    console.log('requestBody:', JSON.stringify(v_cd6a57));

    const v_3393e3 = await fetch(v_f71b56, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${v_c9c489.GATEWAY_AUTH_CODE}`,
      },
      body: JSON.stringify(v_cd6a57),
    });

    if (!v_3393e3.ok) {
      throw new Error(`HTTP error! status: ${v_3393e3.status}`);
    }

    const v_43c42e = await v_3393e3.json();
    console.log('=== virtualCoin API 응답 ===');
    console.log('response.data length:', v_43c42e?.data?.length);

    return v_43c42e;
  } catch (v_5e9bfe) {
    console.error('virtualCoin API 호출 실패:', v_5e9bfe);
    if (v_c65f5d) {
      await v_e4d665(v_c65f5d);
    }
    throw v_5e9bfe;
  }
};

export const v_965f93 = async (
  v_c65f5d,
): Promise<any> => {
  try {
    const v_c9c489 = v_e4a763();
    const v_f71b56 = `${v_c9c489.GATEWAY_NODEJS}/getCoinNasPrice`;

    console.log('=== getCoinNasPrice API 호출 ===');

    const v_3393e3 = await fetch(v_f71b56, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${v_c9c489.GATEWAY_AUTH_CODE}`,
      },
      body: JSON.stringify({}),
    });

    if (!v_3393e3.ok) {
      throw new Error(`HTTP error! status: ${v_3393e3.status}`);
    }

    const v_43c42e = await v_3393e3.json();
    console.log('=== getCoinNasPrice API 응답 ===');
    console.log('calculatedNasPrice:', v_43c42e?.data?.coins);

    return v_43c42e;
  } catch (v_5e9bfe) {
    console.error('getCoinNasPrice API 호출 실패:', v_5e9bfe);
    if (v_c65f5d) {
      await v_e4d665(v_c65f5d);
    }
    throw v_5e9bfe;
  }
};

export const v_4b1d5e = async (
  v_660822,
  v_e0c7e8,
  v_c65f5d,
): Promise<v_46181d> => {
  try {
    const v_9f42a4 = v_7488d5(v_c65f5d);
    const request: v_ba49e9 = {
      member: v_660822,
      email: v_e0c7e8,
    };

    console.log('[추천] 추천인 등록 요청 (이메일):', { member: v_660822, email: v_e0c7e8 });

    const v_3393e3 = await v_9f42a4.post<v_46181d>(
      '/app7410-01',
      v_576f5a,
    );

    const v_43c42e = v_3393e3.data.data?.[0]?.data || '';
    console.log('[추천] 추천인 등록 결과:', v_43c42e);

    return v_3393e3.data;
  } catch (v_5e9bfe) {
    console.error('[추천] 추천인 등록 오류:', v_5e9bfe);
    if (v_5e9bfe instanceof v_3333d3) {
      console.error('[추천] 상세 오류 정보:', {
        url: v_5e9bfe.config?.url,
        method: v_5e9bfe.config?.method,
        status: v_5e9bfe.response?.status,
        statusText: v_5e9bfe.response?.statusText,
        data: v_5e9bfe.response?.data,
        message: v_5e9bfe.message,
      });
    }
    throw v_5e9bfe;
  }
};

export const v_176911 = async (
  v_c65f5d,
): Promise<v_38bdda> => {
  try {
    const v_9f42a4 = v_7488d5(v_c65f5d);

    console.log('[추천] 랜덤 추천인 목록 조회 요청');

    const v_3393e3 = await v_9f42a4.get<v_38bdda>(
      '/app7420-01',
    );

    console.log('[추천] 랜덤 추천인 목록 조회 성공, 개수:', v_3393e3.data.data?.length || 0);

    return v_3393e3.data;
  } catch (v_5e9bfe) {
    console.error('[추천] 랜덤 추천인 목록 조회 오류:', v_5e9bfe);
    if (v_5e9bfe instanceof v_3333d3) {
      console.error('[추천] 상세 오류 정보:', {
        url: v_5e9bfe.config?.url,
        method: v_5e9bfe.config?.method,
        status: v_5e9bfe.response?.status,
        statusText: v_5e9bfe.response?.statusText,
        data: v_5e9bfe.response?.data,
        message: v_5e9bfe.message,
      });
    }
    throw v_5e9bfe;
  }
};

export const v_2ce9ab = async (
  v_660822,
  v_830694,
  v_c65f5d,
): Promise<v_b675ff> => {
  try {
    const v_9f42a4 = v_7488d5(v_c65f5d);
    const request: v_184dd0 = {
      member: v_660822,
      posed: v_830694,
    };

    console.log('[추천] 랜덤 추천인 등록 요청:', { member: v_660822, posed: v_830694 });

    const v_3393e3 = await v_9f42a4.post<v_b675ff>(
      '/app7420-02',
      v_576f5a,
    );

    const v_43c42e = v_3393e3.data.data?.[0]?.data || '';
    console.log('[추천] 랜덤 추천인 등록 결과:', v_43c42e);

    return v_3393e3.data;
  } catch (v_5e9bfe) {
    console.error('[추천] 랜덤 추천인 등록 오류:', v_5e9bfe);
    if (v_5e9bfe instanceof v_3333d3) {
      console.error('[추천] 상세 오류 정보:', {
        url: v_5e9bfe.config?.url,
        method: v_5e9bfe.config?.method,
        status: v_5e9bfe.response?.status,
        statusText: v_5e9bfe.response?.statusText,
        data: v_5e9bfe.response?.data,
        message: v_5e9bfe.message,
      });
    }
    throw v_5e9bfe;
  }
};

export const v_e58c11 = async (
  v_660822,
  v_a149d6,
  v_c65f5d,
): Promise<v_acff7d> => {
  try {
    const v_9f42a4 = v_7488d5(v_c65f5d);
    const request: v_50b98d = {
      member: v_660822,
      recommand: v_a149d6,
    };

    console.log('[추천] 추천인 저장 요청:', { member: v_660822, recommand: v_a149d6 });

    const v_3393e3 = await v_9f42a4.post<v_acff7d>(
      '/saveRecommend',
      v_576f5a,
    );

    console.log('[추천] 추천인 저장 성공');

    return v_3393e3.data;
  } catch (v_5e9bfe) {
    console.error('[추천] 추천인 저장 오류:', v_5e9bfe);
    if (v_5e9bfe instanceof v_3333d3) {
      console.error('[추천] 상세 오류 정보:', {
        url: v_5e9bfe.config?.url,
        method: v_5e9bfe.config?.method,
        status: v_5e9bfe.response?.status,
        statusText: v_5e9bfe.response?.statusText,
        data: v_5e9bfe.response?.data,
        message: v_5e9bfe.message,
      });
    }
    throw v_5e9bfe;
  }
};

export const v_90af10 = async (
  v_660822,
  v_c65f5d,
): Promise<v_cdd3ce> => {
  try {
    const v_9f42a4 = v_7488d5(v_c65f5d);
    const request: v_baf73b = {
      member: v_660822,
    };

    console.log('[추천] 추천인 조회 요청:', { member: v_660822 });

    const v_3393e3 = await v_9f42a4.post<v_cdd3ce>(
      '/app7420-03',
      v_576f5a,
    );

    const v_43c42e = v_3393e3.data.data?.[0];
    console.log('[추천] 추천인 조회 결과:', {
      email: v_43c42e?.email,
      status: v_43c42e?.data,
    });

    return v_3393e3.data;
  } catch (v_5e9bfe) {
    console.error('[추천] 추천인 조회 오류:', v_5e9bfe);
    if (v_5e9bfe instanceof v_3333d3) {
      console.error('[추천] 상세 오류 정보:', {
        url: v_5e9bfe.config?.url,
        method: v_5e9bfe.config?.method,
        status: v_5e9bfe.response?.status,
        statusText: v_5e9bfe.response?.statusText,
        data: v_5e9bfe.response?.data,
        message: v_5e9bfe.message,
      });
    }
    throw v_5e9bfe;
  }
};

export const v_baf3b8 = async (
  v_660822,
  v_c65f5d,
): Promise<v_b62495> => {
  try {
    const v_9f42a4 = v_7488d5(v_c65f5d);
    const request: v_60e215 = {
      member: v_660822,
    };

    console.log('[추천] 내가 추천한 사람 목록 조회 요청:', { member: v_660822 });

    const v_3393e3 = await v_9f42a4.post<v_b62495>(
      '/getRecommendedToMe',
      v_576f5a,
    );

    console.log('[추천] 내가 추천한 사람 목록 조회 성공, 개수:', v_3393e3.data.data?.length || 0);

    return v_3393e3.data;
  } catch (v_5e9bfe) {
    console.error('[추천] 내가 추천한 사람 목록 조회 오류:', v_5e9bfe);
    if (v_5e9bfe instanceof v_3333d3) {
      console.error('[추천] 상세 오류 정보:', {
        url: v_5e9bfe.config?.url,
        method: v_5e9bfe.config?.method,
        status: v_5e9bfe.response?.status,
        statusText: v_5e9bfe.response?.statusText,
        data: v_5e9bfe.response?.data,
        message: v_5e9bfe.message,
      });
    }
    throw v_5e9bfe;
  }
};

export const v_bc3c7b = async (
  v_e0c7e8,
  v_c65f5d,
): Promise<v_42f0a8> => {
  try {
    const v_9f42a4 = v_7488d5(v_c65f5d);
    const request: v_87b54d = {
      email: v_e0c7e8,
    };

    console.log('[추천] 이메일로 회원 조회 요청:', { email: v_e0c7e8 });

    const v_3393e3 = await v_9f42a4.post<v_42f0a8>(
      '/ap1810-i01',
      v_576f5a,
    );

    const v_43c42e = v_3393e3.data.data?.[0];
    console.log('[추천] 이메일로 회원 조회 결과:', {
      exists: v_43c42e?.result,
      member: v_43c42e?.member,
    });

    return v_3393e3.data;
  } catch (v_5e9bfe) {
    console.error('[추천] 이메일로 회원 조회 오류:', v_5e9bfe);
    if (v_5e9bfe instanceof v_3333d3) {
      console.error('[추천] 상세 오류 정보:', {
        url: v_5e9bfe.config?.url,
        method: v_5e9bfe.config?.method,
        status: v_5e9bfe.response?.status,
        statusText: v_5e9bfe.response?.statusText,
        data: v_5e9bfe.response?.data,
        message: v_5e9bfe.message,
      });
    }
    throw v_5e9bfe;
  }
};

export const v_e10c7c = async (
  v_660822,
  v_c65f5d,
): Promise<v_3821b8> => {
  try {
    const v_9f42a4 = v_7488d5(v_c65f5d);
    const request: v_079660 = {
      member: v_660822,
    };

    console.log('[추천] 사용자 정보 조회 요청 (app7110-01):', { member: v_660822 });

    const v_3393e3 = await v_9f42a4.post<v_3821b8>(
      '/app7110-01',
      v_576f5a,
    );

    console.log('[추천] 사용자 정보 조회 성공');

    return v_3393e3.data;
  } catch (v_5e9bfe) {
    console.error('[추천] 사용자 정보 조회 오류:', v_5e9bfe);
    if (v_5e9bfe instanceof v_3333d3) {
      console.error('[추천] 상세 오류 정보:', {
        url: v_5e9bfe.config?.url,
        method: v_5e9bfe.config?.method,
        status: v_5e9bfe.response?.status,
        statusText: v_5e9bfe.response?.statusText,
        data: v_5e9bfe.response?.data,
        message: v_5e9bfe.message,
      });
    }
    throw v_5e9bfe;
  }
};

export const v_1c4683 = async (
  v_660822,
  v_a4f17b,
  deviceInfo: v_719e34,
  v_aa0917 = '',
  v_c65f5d,
): Promise<v_649123> => {
  try {
    const v_c9c489 = v_e4a763();
    const v_f71b56 = `${v_c9c489.GATEWAY_NODEJS}/getNasmobAds`;

    if (v_e7f87b.manufacturer = 'Apple' ){
      v_e7f87b.os = 'ios';
    } else {
      v_e7f87b.os = 'aos';
    }

    const v_cd6a57 = {
      member: v_660822,
      adid: v_a4f17b || '',
      os: v_e7f87b.os,
      osver: v_e7f87b.osVersion || '',
      ip: v_e7f87b.ipAddress || '',
      devid: v_e7f87b.deviceId || '',
      devmodel: v_e7f87b.model || '',
      devbrand: v_e7f87b.manufacturer || '',
      mnetwork: v_e7f87b.mnetwork || '4',
      carrier: v_e7f87b.carrierCode || '1',
      campid: v_aa0917 || '',
    };

    console.log('NStation 광고 API 요청:', v_cd6a57);

    const v_3393e3 = await fetch(v_f71b56, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${v_c9c489.GATEWAY_AUTH_CODE}`,
      },
      body: JSON.stringify(v_cd6a57),
    });

    const result: v_649123 = await v_3393e3.json();
    console.log('NStation 광고 API 응답:', v_43c42e);

    if (v_3393e3.ok && v_43c42e.status === 'success' && v_43c42e.code === 200) {
      return v_43c42e;
    } else {

      const v_1744b9 = v_43c42e.message || 'NStation 광고 API 호출 실패';
      const v_5e9bfe = new Error(v_1744b9);

      (v_5e9bfe as any).is404 = v_43c42e.code === 404;
      throw v_5e9bfe;
    }
  } catch (v_5e9bfe) {
    console.error('NStation 광고 API 호출 실패:', v_5e9bfe);

    if (v_5e9bfe.is404) {
      console.log('404 에러: 캠페인 데이터 없음 - 타임아웃 처리 스킵');
      throw v_5e9bfe;
    }

    if (v_c65f5d && typeof v_c65f5d.reset === 'function') {
      try {
        await v_e4d665(v_c65f5d);
      } catch (v_2d075f) {
        console.error('타임아웃 처리 중 오류:', v_2d075f);

      }
    }
    throw v_5e9bfe;
  }
};

export const v_aa7dc1 = async (
  v_660822,
  v_a4f17b,
  deviceInfo: v_719e34,
  v_aa0917 = '',
  v_c65f5d,
): Promise<v_6b63f9> => {
  try {
    const v_c9c489 = v_e4a763();
    const v_f71b56 = `${v_c9c489.GATEWAY_NODEJS}/getPockAds`;

    let v_eed089;
    let v_66fa3f;

    const v_df691e = v_326be8.OS === 'ios' || 
                  v_e7f87b.manufacturer === 'Apple' || 
                  (v_e7f87b.model && v_e7f87b.model.toLowerCase().includes('iphone')) ||
                  (v_e7f87b.model && v_e7f87b.model.toLowerCase().includes('ipad'));

    if (v_df691e) {
      v_eed089 = 3113; 
      v_66fa3f = 'IOS'; 
    } else {
      v_eed089 = 3112; 
      v_66fa3f = 'ANDROID'; 
    }
    console.log('osTypeString', v_66fa3f);
    console.log('osType', v_eed089);

    const v_cd6a57 = {
      member: v_660822,
      ad_key: v_aa0917 || '', 
      os: v_66fa3f, 
      device_ifa: v_a4f17b || '', 
      ip: v_e7f87b.ipAddress || '',
    };

    console.log('Pock 광고 API 요청:', v_cd6a57);

    const v_3393e3 = await fetch(v_f71b56, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${v_c9c489.GATEWAY_AUTH_CODE}`,
      },
      body: JSON.stringify(v_cd6a57),
    });

    const result: v_6b63f9 = await v_3393e3.json();
    console.log('Pock 광고 API 응답:', v_43c42e);

    if (v_3393e3.ok && v_43c42e.status === 'success' && v_43c42e.code === 200) {
      return v_43c42e;
    } else {

      const v_1744b9 = v_43c42e.message || 'Pock 광고 API 호출 실패';
      const v_5e9bfe = new Error(v_1744b9);

      (v_5e9bfe as any).is404 = v_43c42e.code === 404;
      throw v_5e9bfe;
    }
  } catch (v_5e9bfe) {
    console.error('Pock 광고 API 호출 실패:', v_5e9bfe);

    if (v_5e9bfe.is404) {
      console.log('404 에러: 캠페인 데이터 없음 - 타임아웃 처리 스킵');
      throw v_5e9bfe;
    }

    if (v_c65f5d && typeof v_c65f5d.reset === 'function') {
      try {
        await v_e4d665(v_c65f5d);
      } catch (v_2d075f) {
        console.error('타임아웃 처리 중 오류:', v_2d075f);

      }
    }
    throw v_5e9bfe;
  }
};

export const v_7a6f92 = async (
  callbackData: v_cf0182,
  v_c65f5d,
): Promise<any> => {
  try {
    const v_c9c489 = v_e4a763();
    const v_f71b56 = `${v_c9c489.GATEWAY_NODEJS}/callbackNasmob`;

    console.log('NStation 콜백 전송:', v_d8bcf0);

    const v_3393e3 = await fetch(v_f71b56, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${v_c9c489.GATEWAY_AUTH_CODE}`,
      },
      body: JSON.stringify(v_d8bcf0),
    });

    const v_43c42e = await v_3393e3.json();
    console.log('NStation 콜백 응답:', v_43c42e);
    return v_43c42e;
  } catch (v_5e9bfe) {
    console.error('NStation 콜백 전송 실패:', v_5e9bfe);
    if (v_c65f5d) {
      await v_e4d665(v_c65f5d);
    }
    throw v_5e9bfe;
  }
};

export const v_c07360 = async (
  v_09dafd,
  v_bfe9b9 = 'POST',
  v_cd6a57 = {},
  v_c65f5d,
): Promise<any> => {
  try {
    const v_c9c489 = v_e4a763();
    const v_f71b56 = `${v_c9c489.GATEWAY_NODEJS}/${v_09dafd}`;

    console.log(`🌐 [gatewayNodeJS] API 호출 시작`);
    console.log(`🌐 [gatewayNodeJS] endpoint: ${v_09dafd}`);
    console.log(`🌐 [gatewayNodeJS] method: ${v_bfe9b9}`);
    console.log(`🌐 [gatewayNodeJS] url: ${v_f71b56}`);
    console.log(`🌐 [gatewayNodeJS] requestBody:`, JSON.stringify(v_cd6a57, null, 2));
    console.log(`🌐 [gatewayNodeJS] fetch 호출 전`);

    const v_3393e3 = await fetch(v_f71b56, {
      method: v_bfe9b9,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${v_c9c489.GATEWAY_AUTH_CODE}`,
      },
      body: JSON.stringify(v_cd6a57),
    });

    console.log(`✅ [gatewayNodeJS] fetch 응답 받음, status: ${v_3393e3.status}`);

    if (!v_3393e3.ok) {
      throw new Error(`HTTP error! status: ${v_3393e3.status}`);
    }

    const v_43c42e = await v_3393e3.json();
    console.log(`✅ [gatewayNodeJS] API 응답 성공`);
    console.log(`✅ [gatewayNodeJS] endpoint: ${v_09dafd}`);
    console.log(`✅ [gatewayNodeJS] result.data length:`, v_43c42e?.data?.length || 'N/A');
    console.log(`✅ [gatewayNodeJS] 전체 응답 구조:`, {
      success: v_43c42e?.success,
      dataLength: v_43c42e?.data?.length,
      hasData: !!v_43c42e?.data,
    });

    return v_43c42e;
  } catch (v_5e9bfe) {
    console.error(`Gateway NodeJS 오류 (${v_09dafd}):`, v_5e9bfe);
    if (v_c65f5d) {
      await v_e4d665(v_c65f5d);
    }
    throw v_5e9bfe;
  }
};

export const v_ad146c = async (
  v_5389c3,
  v_51b584,
  v_660822,
  v_be49ae,
  v_1833e7,
  v_7be02f,
  v_c65f5d,
): Promise<any> => {
  try {
    const v_9f42a4 = v_7488d5(v_c65f5d);
    const v_cd6a57 = {
      advertisement: v_5389c3,
      coin: v_51b584,
      member: v_660822,
      joindesc: v_be49ae,
      name: v_1833e7,
      xrunPrice: v_7be02f,
    };

    console.log('Gateway NodeJS 요청 (app3100-01):', v_cd6a57);

    const v_3393e3 = await v_9f42a4.post('/app3100-01', v_cd6a57);

    console.log('Gateway NodeJS 응답 성공:', v_3393e3.data);
    return v_3393e3.data;
  } catch (v_5e9bfe) {
    console.error('Gateway NodeJS 오류:', v_5e9bfe);
    if (v_5e9bfe instanceof v_3333d3) {
      console.error('상세 오류 정보:', {
        url: v_5e9bfe.config?.url,
        method: v_5e9bfe.config?.method,
        status: v_5e9bfe.response?.status,
        statusText: v_5e9bfe.response?.statusText,
        data: v_5e9bfe.response?.data,
        message: v_5e9bfe.message,
      });
    }
    throw v_5e9bfe;
  }
};

export const v_c509a2 = async (
  v_660822,
  v_a832b3,
  v_ad0715,
  v_9b860a = 0,
  v_c65f5d,
): Promise<v_f1f721> => {
  try {
    const v_9f42a4 = v_7488d5(v_c65f5d);
    const request: v_2f8edb = {
      member: v_660822,
      currency: v_a832b3,
      daysbefore: v_ad0715,
      startwith: v_9b860a,
    };

    console.log('[정산] 총 기록 조회 요청:', { member: v_660822, currency: v_a832b3, daysbefore: v_ad0715, startwith: v_9b860a });

    const v_3393e3 = await v_9f42a4.post<v_f1f721>(
      '/app4200-05',
      v_576f5a,
    );

    console.log('[정산] 총 기록 조회 성공, 개수:', v_3393e3.data.data?.length || 0);
    console.log('[정산] 총 기록 응답 데이터:', JSON.stringify(v_3393e3.data, null, 2));

    return v_3393e3.data;
  } catch (v_5e9bfe) {
    console.error('[정산] 총 기록 조회 오류:', v_5e9bfe);
    if (v_5e9bfe instanceof v_3333d3) {
      console.error('[정산] 상세 오류 정보:', {
        url: v_5e9bfe.config?.url,
        method: v_5e9bfe.config?.method,
        status: v_5e9bfe.response?.status,
        statusText: v_5e9bfe.response?.statusText,
        data: v_5e9bfe.response?.data,
        message: v_5e9bfe.message,
      });
    }
    throw v_5e9bfe;
  }
};

export const v_c8f140 = async (
  v_660822,
  v_a832b3,
  v_ad0715,
  v_9b860a = 0,
  v_c65f5d,
): Promise<v_f1f721> => {
  try {
    const v_9f42a4 = v_7488d5(v_c65f5d);
    const request: v_2f8edb = {
      member: v_660822,
      currency: v_a832b3,
      daysbefore: v_ad0715,
      startwith: v_9b860a,
    };

    console.log('[정산] 이체 내역 조회 요청:', { member: v_660822, currency: v_a832b3, daysbefore: v_ad0715, startwith: v_9b860a });

    const v_3393e3 = await v_9f42a4.post<v_f1f721>(
      '/app4200-06',
      v_576f5a,
    );

    console.log('[정산] 이체 내역 조회 성공, 개수:', v_3393e3.data.data?.length || 0);

    return v_3393e3.data;
  } catch (v_5e9bfe) {
    console.error('[정산] 이체 내역 조회 오류:', v_5e9bfe);
    if (v_5e9bfe instanceof v_3333d3) {
      console.error('[정산] 상세 오류 정보:', {
        url: v_5e9bfe.config?.url,
        method: v_5e9bfe.config?.method,
        status: v_5e9bfe.response?.status,
        statusText: v_5e9bfe.response?.statusText,
        data: v_5e9bfe.response?.data,
        message: v_5e9bfe.message,
      });
    }
    throw v_5e9bfe;
  }
};

export const v_c6983d = async (
  v_660822,
  v_a832b3,
  v_ad0715,
  v_9b860a = 0,
  v_c65f5d,
): Promise<v_f1f721> => {
  try {
    const v_9f42a4 = v_7488d5(v_c65f5d);
    const request: v_2f8edb = {
      member: v_660822,
      currency: v_a832b3,
      daysbefore: v_ad0715,
      startwith: v_9b860a,
    };

    console.log('[정산] 받은 내역 조회 요청:', { member: v_660822, currency: v_a832b3, daysbefore: v_ad0715, startwith: v_9b860a });

    const v_3393e3 = await v_9f42a4.post<v_f1f721>(
      '/app4200-01',
      v_576f5a,
    );

    console.log('[정산] 받은 내역 조회 성공, 개수:', v_3393e3.data.data?.length || 0);

    return v_3393e3.data;
  } catch (v_5e9bfe) {
    console.error('[정산] 받은 내역 조회 오류:', v_5e9bfe);
    if (v_5e9bfe instanceof v_3333d3) {
      console.error('[정산] 상세 오류 정보:', {
        url: v_5e9bfe.config?.url,
        method: v_5e9bfe.config?.method,
        status: v_5e9bfe.response?.status,
        statusText: v_5e9bfe.response?.statusText,
        data: v_5e9bfe.response?.data,
        message: v_5e9bfe.message,
      });
    }
    throw v_5e9bfe;
  }
};

export const v_fc6912 = async (
  v_660822,
  v_a832b3,
  v_ad0715,
  v_9b860a = 0,
  v_c65f5d,
): Promise<v_f1f721> => {
  try {
    const v_9f42a4 = v_7488d5(v_c65f5d);
    const request: v_2f8edb = {
      member: v_660822,
      currency: v_a832b3,
      daysbefore: v_ad0715,
      startwith: v_9b860a,
    };

    console.log('[정산] 전송 내역 조회 요청:', { member: v_660822, currency: v_a832b3, daysbefore: v_ad0715, startwith: v_9b860a });

    const v_3393e3 = await v_9f42a4.post<v_f1f721>(
      '/app4200-03',
      v_576f5a,
    );

    console.log('[정산] 전송 내역 조회 성공, 개수:', v_3393e3.data.data?.length || 0);

    return v_3393e3.data;
  } catch (v_5e9bfe) {
    console.error('[정산] 전송 내역 조회 오류:', v_5e9bfe);
    if (v_5e9bfe instanceof v_3333d3) {
      console.error('[정산] 상세 오류 정보:', {
        url: v_5e9bfe.config?.url,
        method: v_5e9bfe.config?.method,
        status: v_5e9bfe.response?.status,
        statusText: v_5e9bfe.response?.statusText,
        data: v_5e9bfe.response?.data,
        message: v_5e9bfe.message,
      });
    }
    throw v_5e9bfe;
  }
};

export const v_f4cc2d = async (
  v_660822,
  v_c65f5d,
): Promise<v_ef95df> => {
  try {
    const v_9f42a4 = v_7488d5(v_c65f5d);
    const request: v_28b1dd = {
      member: v_660822,
    };

    console.log('[광고] 완료된 광고 조회 요청:', { member: v_660822 });

    const v_3393e3 = await v_9f42a4.post<v_ef95df>(
      '/app5010-02',
      v_576f5a,
    );

    console.log('[광고] 완료된 광고 조회 성공, 개수:', v_3393e3.data.data?.length || 0);

    return v_3393e3.data;
  } catch (v_5e9bfe) {
    console.error('[광고] 완료된 광고 조회 오류:', v_5e9bfe);
    if (v_5e9bfe instanceof v_3333d3) {
      console.error('[광고] 상세 오류 정보:', {
        url: v_5e9bfe.config?.url,
        method: v_5e9bfe.config?.method,
        status: v_5e9bfe.response?.status,
        statusText: v_5e9bfe.response?.statusText,
        data: v_5e9bfe.response?.data,
        message: v_5e9bfe.message,
      });
    }
    throw v_5e9bfe;
  }
};

export const v_010f9a = async (
  v_660822,
  v_dd4754 = 'datetime',
  v_c65f5d,
): Promise<v_758f4f> => {
  try {
    const v_9f42a4 = v_7488d5(v_c65f5d);
    const request: v_bb4f61 = {
      member: v_660822,
      orderField: v_dd4754,
    };

    console.log('[광고] 저장된 광고 목록 조회 요청:', { member: v_660822, orderField: v_dd4754 });

    const v_3393e3 = await v_9f42a4.post<v_758f4f>(
      '/app5010-01',
      v_576f5a,
    );

    console.log('[광고] 저장된 광고 목록 조회 성공, 개수:', v_3393e3.data.data?.length || 0);

    return v_3393e3.data;
  } catch (v_5e9bfe) {
    console.error('[광고] 저장된 광고 목록 조회 오류:', v_5e9bfe);
    if (v_5e9bfe instanceof v_3333d3) {
      console.error('[광고] 상세 오류 정보:', {
        url: v_5e9bfe.config?.url,
        method: v_5e9bfe.config?.method,
        status: v_5e9bfe.response?.status,
        statusText: v_5e9bfe.response?.statusText,
        data: v_5e9bfe.response?.data,
        message: v_5e9bfe.message,
      });
    }
    throw v_5e9bfe;
  }
};

export const v_b7594c = async (
  v_660822,
  v_c65f5d,
): Promise<v_678cf5> => {
  try {
    const v_9f42a4 = v_7488d5(v_c65f5d);
    const request: v_e05ff9 = { member: v_660822 };

    console.log('[정산] 정산 목록 조회 요청:', { member: v_660822 });

    const v_3393e3 = await v_9f42a4.post<v_678cf5>(
      '/getSettlementList',
      v_576f5a,
    );

    console.log('[정산] 정산 목록 조회 성공, 개수:', v_3393e3.data.data?.length || 0);

    return v_3393e3.data;
  } catch (v_5e9bfe) {
    console.error('[정산] 정산 목록 조회 오류:', v_5e9bfe);
    if (v_5e9bfe instanceof v_3333d3) {
      console.error('[정산] 상세 오류 정보:', {
        url: v_5e9bfe.config?.url,
        method: v_5e9bfe.config?.method,
        status: v_5e9bfe.response?.status,
        statusText: v_5e9bfe.response?.statusText,
        data: v_5e9bfe.response?.data,
        message: v_5e9bfe.message,
      });
    }
    throw v_5e9bfe;
  }
};

export const v_5bb1ab = async (
  v_660822,
  v_c65f5d,
): Promise<v_c8e190> => {
  try {
    const v_9f42a4 = v_7488d5(v_c65f5d);
    const request: v_c5ddda = { member: v_660822 };

    console.log('[정산] 정산 총액 조회 요청:', { member: v_660822 });

    const v_3393e3 = await v_9f42a4.post<v_c8e190>(
      '/getSettlementAmount',
      v_576f5a,
    );

    console.log('[정산] 정산 총액 조회 성공:', v_3393e3.data.data?.[0]?.amount || '0');

    return v_3393e3.data;
  } catch (v_5e9bfe) {
    console.error('[정산] 정산 총액 조회 오류:', v_5e9bfe);
    if (v_5e9bfe instanceof v_3333d3) {
      console.error('[정산] 상세 오류 정보:', {
        url: v_5e9bfe.config?.url,
        method: v_5e9bfe.config?.method,
        status: v_5e9bfe.response?.status,
        statusText: v_5e9bfe.response?.statusText,
        data: v_5e9bfe.response?.data,
        message: v_5e9bfe.message,
      });
    }
    throw v_5e9bfe;
  }
};

export const v_4a38fa = async (
  v_c65f5d,
): Promise<v_f77e47> => {
  try {
    const v_9f42a4 = v_7488d5(v_c65f5d);
    const request: v_caa41f = {};

    console.log('[Rank] 전체 순위 조회 요청');

    const v_3393e3 = await v_9f42a4.post<v_f77e47>(
      '/getRank',
      v_576f5a,
    );

    console.log('[Rank] 전체 순위 조회 성공, 개수:', v_3393e3.data.data?.length || 0);
    console.log('[Rank] 전체 순위 데이터:', v_3393e3.data.data);

    return v_3393e3.data;
  } catch (v_5e9bfe) {
    console.error('[Rank] 전체 순위 조회 오류:', v_5e9bfe);
    if (v_5e9bfe instanceof v_3333d3) {
      console.error('[Rank] 상세 오류 정보:', {
        url: v_5e9bfe.config?.url,
        method: v_5e9bfe.config?.method,
        status: v_5e9bfe.response?.status,
        statusText: v_5e9bfe.response?.statusText,
        data: v_5e9bfe.response?.data,
        message: v_5e9bfe.message,
      });
    }
    throw v_5e9bfe;
  }
};

export const v_6a034c = async (
  v_660822,
  v_c65f5d,
): Promise<v_ed4aeb> => {
  try {
    const v_9f42a4 = v_7488d5(v_c65f5d);
    const request: v_cde3d3 = { member: v_660822 };

    console.log('[Rank] 사용자 순위 조회 요청:', { member: v_660822 });

    const v_3393e3 = await v_9f42a4.post<v_ed4aeb>(
      '/getRankSpesific',
      v_576f5a,
    );

    console.log('[Rank] 사용자 순위 조회 성공:', v_3393e3.data.data?.[0]?.unique_rank || '-');

    return v_3393e3.data;
  } catch (v_5e9bfe) {
    console.error('[Rank] 사용자 순위 조회 오류:', v_5e9bfe);
    if (v_5e9bfe instanceof v_3333d3) {
      console.error('[Rank] 상세 오류 정보:', {
        url: v_5e9bfe.config?.url,
        method: v_5e9bfe.config?.method,
        status: v_5e9bfe.response?.status,
        statusText: v_5e9bfe.response?.statusText,
        data: v_5e9bfe.response?.data,
        message: v_5e9bfe.message,
      });
    }
    throw v_5e9bfe;
  }
};

export const v_fb1936 = async (
  v_660822,
  v_c65f5d,
): Promise<v_8c8b0e> => {
  try {
    const v_9f42a4 = v_7488d5(v_c65f5d);
    const request: v_f7dffa = { member: v_660822 };

    console.log('[내 그룹] 내 그룹 조회 요청:', { member: v_660822 });

    const v_3393e3 = await v_9f42a4.post<v_8c8b0e>(
      '/getMyGroup',
      v_576f5a,
    );

    console.log('[내 그룹] 내 그룹 조회 성공, 개수:', v_3393e3.data.data?.length || 0);

    return v_3393e3.data;
  } catch (v_5e9bfe) {
    console.error('[내 그룹] 내 그룹 조회 오류:', v_5e9bfe);
    if (v_5e9bfe instanceof v_3333d3) {
      console.error('[내 그룹] 상세 오류 정보:', {
        url: v_5e9bfe.config?.url,
        method: v_5e9bfe.config?.method,
        status: v_5e9bfe.response?.status,
        statusText: v_5e9bfe.response?.statusText,
        data: v_5e9bfe.response?.data,
        message: v_5e9bfe.message,
      });
    }
    throw v_5e9bfe;
  }
};

export const v_08316d = async (
  v_660822,
  v_c65f5d,
): Promise<v_ce940a> => {
  try {
    const v_9f42a4 = v_7488d5(v_c65f5d);
    const request: v_bfc1b5 = { member: v_660822 };

    console.log('[레퍼럴 수정] 현재 레퍼럴 조회 요청:', { member: v_660822 });

    const v_3393e3 = await v_9f42a4.post<v_ce940a>(
      '/getMyRecommender',
      v_576f5a,
    );

    console.log('[레퍼럴 수정] 현재 레퍼럴 조회 성공:', v_3393e3.data.status);

    return v_3393e3.data;
  } catch (v_5e9bfe) {
    console.error('[레퍼럴 수정] 현재 레퍼럴 조회 오류:', v_5e9bfe);
    if (v_5e9bfe instanceof v_3333d3) {
      console.error('[레퍼럴 수정] 상세 오류 정보:', {
        url: v_5e9bfe.config?.url,
        method: v_5e9bfe.config?.method,
        status: v_5e9bfe.response?.status,
        statusText: v_5e9bfe.response?.statusText,
        data: v_5e9bfe.response?.data,
        message: v_5e9bfe.message,
      });
    }
    throw v_5e9bfe;
  }
};

export const v_c58856 = async (
  v_660822,
  v_e0c7e8,
  v_c65f5d,
): Promise<v_14faed> => {
  try {
    const v_9f42a4 = v_7488d5(v_c65f5d);
    const request: v_bc5b18 = {
      member: v_660822,
      email: v_e0c7e8.trim(),
    };

    console.log('[레퍼럴 수정] 레퍼럴 설정 가능 여부 검증 요청:', { member: v_660822, email: v_e0c7e8.trim() });

    const v_3393e3 = await v_9f42a4.post<v_14faed>(
      '/checkCanSetRecommender',
      v_576f5a,
    );

    const v_f1a123 = v_3393e3.status;
    const v_f637a4 = v_3393e3.data;

    console.log('[레퍼럴 수정] 레퍼럴 설정 가능 여부 검증 응답:', {
      code: v_f1a123,
      status: v_f637a4.status,
      message: v_f637a4.message,
    });

    return {
      ...v_f637a4,
      code: v_f1a123,
      status_code: v_f1a123,
    };
  } catch (v_5e9bfe) {
    console.error('[레퍼럴 수정] 레퍼럴 설정 가능 여부 검증 오류:', v_5e9bfe);
    if (v_5e9bfe instanceof v_3333d3) {
      const v_408297 = v_5e9bfe.response?.status || 500;
      console.error('[레퍼럴 수정] 상세 오류 정보:', {
        url: v_5e9bfe.config?.url,
        method: v_5e9bfe.config?.method,
        status: v_408297,
        statusText: v_5e9bfe.response?.statusText,
        data: v_5e9bfe.response?.data,
        message: v_5e9bfe.message,
      });

      return {
        status: 'error',
        code: v_408297,
        status_code: v_408297,
        message: v_5e9bfe.response?.data?.message || v_5e9bfe.message,
        data: v_5e9bfe.response?.data?.data,
      };
    }
    throw v_5e9bfe;
  }
};

export const v_794a74 = async (
  v_660822,
  v_e0c7e8,
  v_c65f5d,
): Promise<v_efae6a> => {
  try {
    const v_9f42a4 = v_7488d5(v_c65f5d);
    const request: v_0203a2 = {
      member: v_660822,
      email: v_e0c7e8.trim(),
    };

    console.log('[레퍼럴 수정] 레퍼럴 설정 요청:', { member: v_660822, email: v_e0c7e8.trim() });

    const v_3393e3 = await v_9f42a4.post<v_efae6a>(
      '/setRecommender',
      v_576f5a,
    );

    console.log('[레퍼럴 수정] 레퍼럴 설정 성공:', v_3393e3.data.status);

    return v_3393e3.data;
  } catch (v_5e9bfe) {
    console.error('[레퍼럴 수정] 레퍼럴 설정 오류:', v_5e9bfe);
    if (v_5e9bfe instanceof v_3333d3) {
      console.error('[레퍼럴 수정] 상세 오류 정보:', {
        url: v_5e9bfe.config?.url,
        method: v_5e9bfe.config?.method,
        status: v_5e9bfe.response?.status,
        statusText: v_5e9bfe.response?.statusText,
        data: v_5e9bfe.response?.data,
        message: v_5e9bfe.message,
      });
    }
    throw v_5e9bfe;
  }
};

export const v_dd87bc = async (
  v_c65f5d,
): Promise<v_3122ba> => {
  try {
    const v_9f42a4 = v_7488d5(v_c65f5d);
    const request: v_de864e = {};

    console.log('[상점] 고팍스 XRUN 가격 조회 요청');

    const v_3393e3 = await v_9f42a4.post<v_3122ba>(
      '/getXRUNGopaxPrice',
      v_576f5a,
    );

    const v_6bbb57 = v_3393e3.data.data?.gopaxPrice || 0;
    console.log('[상점] 고팍스 XRUN 가격 조회 성공:', v_6bbb57);

    return v_3393e3.data;
  } catch (v_5e9bfe) {
    console.error('[상점] 고팍스 XRUN 가격 조회 오류:', v_5e9bfe);
    if (v_5e9bfe instanceof v_3333d3) {
      console.error('[상점] 상세 오류 정보:', {
        url: v_5e9bfe.config?.url,
        method: v_5e9bfe.config?.method,
        status: v_5e9bfe.response?.status,
        statusText: v_5e9bfe.response?.statusText,
        data: v_5e9bfe.response?.data,
        message: v_5e9bfe.message,
      });
    }
    throw v_5e9bfe;
  }
};

export const v_54d016 = async (
  v_660822,
  v_c65f5d,
): Promise<v_ba5864> => {
  try {
    const v_9f42a4 = v_7488d5(v_c65f5d);
    const request: v_4fdd7c = { member: v_660822 };

    console.log('[상점] 사용자 잔액 조회 요청:', { member: v_660822 });

    const v_3393e3 = await v_9f42a4.post<v_ba5864>(
      '/app4000-01-rev-01-18only',
      v_576f5a,
    );

    const v_c88e9b = v_3393e3.data.data?.realtimeBalance?.balance || '0';
    console.log('[상점] 사용자 잔액 조회 성공:', v_c88e9b);

    return v_3393e3.data;
  } catch (v_5e9bfe) {
    console.error('[상점] 사용자 잔액 조회 오류:', v_5e9bfe);
    if (v_5e9bfe instanceof v_3333d3) {
      console.error('[상점] 상세 오류 정보:', {
        url: v_5e9bfe.config?.url,
        method: v_5e9bfe.config?.method,
        status: v_5e9bfe.response?.status,
        statusText: v_5e9bfe.response?.statusText,
        data: v_5e9bfe.response?.data,
        message: v_5e9bfe.message,
      });
    }
    throw v_5e9bfe;
  }
};

export const v_8ee299 = async (
  v_660822,
  v_c65f5d,
): Promise<any> => {
  try {
    const v_9f42a4 = v_7488d5(v_c65f5d);
    const v_576f5a = { member: v_660822 };

    console.log('[잔액 업데이트] 사용자 잔액 업데이트 V2 요청:', { member: v_660822 });

    const v_3393e3 = await v_9f42a4.post<any>(
      '/oth-path',
      v_576f5a,
    );

    console.log('[잔액 업데이트] 사용자 잔액 업데이트 V2 성공');

    return v_3393e3.data;
  } catch (v_5e9bfe) {
    console.error('[잔액 업데이트] 사용자 잔액 업데이트 V2 오류:', v_5e9bfe);
    if (v_5e9bfe instanceof v_3333d3) {
      console.error('[잔액 업데이트] 상세 오류 정보:', {
        url: v_5e9bfe.config?.url,
        method: v_5e9bfe.config?.method,
        status: v_5e9bfe.response?.status,
        statusText: v_5e9bfe.response?.statusText,
        data: v_5e9bfe.response?.data,
        message: v_5e9bfe.message,
      });
    }
    throw v_5e9bfe;
  }
};

export const v_81c40d = async (
  v_660822,
  v_c65f5d,
): Promise<v_2380df> => {
  try {
    const v_9f42a4 = v_7488d5(v_c65f5d);
    const request: v_5cb2e0 = { member: v_660822 };

    console.log('[상점] 구매 가능한 아이템 조회 요청:', { member: v_660822 });

    const v_3393e3 = await v_9f42a4.post<v_2380df>(
      '/getXrunBuyableItems',
      v_576f5a,
    );

    console.log('[상점] 구매 가능한 아이템 조회 성공, 개수:', v_3393e3.data.data?.length || 0);

    return v_3393e3.data;
  } catch (v_5e9bfe) {
    console.error('[상점] 구매 가능한 아이템 조회 오류:', v_5e9bfe);
    if (v_5e9bfe instanceof v_3333d3) {
      console.error('[상점] 상세 오류 정보:', {
        url: v_5e9bfe.config?.url,
        method: v_5e9bfe.config?.method,
        status: v_5e9bfe.response?.status,
        statusText: v_5e9bfe.response?.statusText,
        data: v_5e9bfe.response?.data,
        message: v_5e9bfe.message,
      });
    }
    throw v_5e9bfe;
  }
};

export const v_97ad19 = async (
  v_660822,
  v_c65f5d,
): Promise<v_ad5024> => {
  try {
    const v_9f42a4 = v_7488d5(v_c65f5d);
    const request: v_35daf0 = { member: v_660822 };

    console.log('[상점] 구매한 아이템 조회 요청:', { member: v_660822 });

    const v_3393e3 = await v_9f42a4.post<v_ad5024>(
      '/getXrunPurchasedItems',
      v_576f5a,
    );

    console.log('[상점] 구매한 아이템 조회 성공, 개수:', v_3393e3.data.data?.length || 0);

    return v_3393e3.data;
  } catch (v_5e9bfe) {
    console.error('[상점] 구매한 아이템 조회 오류:', v_5e9bfe);
    if (v_5e9bfe instanceof v_3333d3) {
      console.error('[상점] 상세 오류 정보:', {
        url: v_5e9bfe.config?.url,
        method: v_5e9bfe.config?.method,
        status: v_5e9bfe.response?.status,
        statusText: v_5e9bfe.response?.statusText,
        data: v_5e9bfe.response?.data,
        message: v_5e9bfe.message,
      });
    }
    throw v_5e9bfe;
  }
};

export const v_9c9f1b = async (
  v_660822,
  v_8c0b26,
  v_f63e09,
  v_c65f5d,
): Promise<v_8321b5> => {
  try {
    const v_9f42a4 = v_7488d5(v_c65f5d);
    const request: v_c27ee5 = {
      member: v_660822,
      item: v_8c0b26,
      amount: v_f63e09.toString(),
    };

    console.log('[상점] XRUN 아이템 구매 요청:', { member: v_660822, item: v_8c0b26, amount: v_f63e09 });

    const v_3393e3 = await v_9f42a4.post<v_8321b5>(
      '/purchaseXrunItem',
      v_576f5a,
    );

    console.log('[상점] XRUN 아이템 구매 성공:', v_3393e3.data.status);

    return v_3393e3.data;
  } catch (v_5e9bfe) {
    console.error('[상점] XRUN 아이템 구매 오류:', v_5e9bfe);
    if (v_5e9bfe instanceof v_3333d3) {
      console.error('[상점] 상세 오류 정보:', {
        url: v_5e9bfe.config?.url,
        method: v_5e9bfe.config?.method,
        status: v_5e9bfe.response?.status,
        statusText: v_5e9bfe.response?.statusText,
        data: v_5e9bfe.response?.data,
        message: v_5e9bfe.message,
      });
    }
    throw v_5e9bfe;
  }
};

export const v_f271f9 = async (
  v_d308b5,
  v_660822,
  v_c65f5d,
): Promise<v_caf66a> => {
  try {
    const v_9f42a4 = v_7488d5(v_c65f5d);
    const request: v_97dbaa = {
      status: v_d308b5,
      member: v_660822,
    };

    console.log('[상점] 구매 로그 저장 요청:', { status: v_d308b5, member: v_660822 });

    const v_3393e3 = await v_9f42a4.post<v_caf66a>(
      '/saveInappPurchaseLog',
      v_576f5a,
    );

    const v_a45293 = v_3393e3.data.data?.[0]?.affectedRows || 0;
    console.log('[상점] 구매 로그 저장 성공:', v_a45293 === 1 ? 'ok' : 'no');

    return v_3393e3.data;
  } catch (v_5e9bfe) {
    console.error('[상점] 구매 로그 저장 오류:', v_5e9bfe);
    if (v_5e9bfe instanceof v_3333d3) {
      console.error('[상점] 상세 오류 정보:', {
        url: v_5e9bfe.config?.url,
        method: v_5e9bfe.config?.method,
        status: v_5e9bfe.response?.status,
        statusText: v_5e9bfe.response?.statusText,
        data: v_5e9bfe.response?.data,
        message: v_5e9bfe.message,
      });
    }
    throw v_5e9bfe;
  }
};

export const v_7b3801 = async (
  v_660822,
  v_dbd01d,
  v_c65f5d,
): Promise<v_dfd755> => {
  try {
    const v_9f42a4 = v_7488d5(v_c65f5d);
    const request: v_036174 = {
      member: v_660822,
      storage: v_dbd01d,
    };

    console.log('[상점] 구매한 아이템 삭제 요청:', { member: v_660822, storage: v_dbd01d });

    const v_f69c4d = [
      '/deleteXrunItem', 
      '/app4000-04-delete', 
      '/app4000-04delete',   
      '/deleteXrunPurchasedItem', 
      '/app4000-delete',     
    ];

    let v_1c274a = null;
    for (const v_09dafd of v_f69c4d) {
      try {
        console.log(`[상점] 삭제 API 엔드포인트 시도: ${v_09dafd}`);
        const v_3393e3 = await v_9f42a4.post<v_dfd755>(
          v_09dafd,
          v_576f5a,
        );

        console.log(`[상점] 엔드포인트 ${v_09dafd} 응답:`, v_3393e3.data);

        if (v_3393e3.data.status === 'success') {
          console.log(`[상점] 삭제 성공 (엔드포인트: ${v_09dafd}):`, v_3393e3.data.status);
          return v_3393e3.data;
        }

        if (v_3393e3.data.status === 'error') {

          if (v_3393e3.data.code === 404) {
            console.log(`[상점] 엔드포인트 ${v_09dafd} 404 에러, 다음 엔드포인트 시도`);
            v_1c274a = v_3393e3.data;
            continue;
          }

          console.log(`[상점] 삭제 실패 (엔드포인트: ${v_09dafd}):`, v_3393e3.data.message);
          return v_3393e3.data;
        }

        v_1c274a = v_3393e3.data;
      } catch (v_5e9bfe) {
        const v_1744b9 = v_5e9bfe?.response?.data?.message || v_5e9bfe?.message || '알 수 없는 오류';
        const v_7a5fef = v_5e9bfe?.response?.data?.code || v_5e9bfe?.response?.status;
        console.log(`[상점] 엔드포인트 ${v_09dafd} 실패:`, v_1744b9);

        if (v_5e9bfe?.response?.status && v_5e9bfe.response.status !== 404) {
          v_1c274a = v_5e9bfe;
          break;
        }

        if (v_7a5fef && v_7a5fef !== 404) {
          v_1c274a = v_5e9bfe;
          break;
        }

        v_1c274a = v_5e9bfe;
      }
    }

    console.error('[상점] 모든 삭제 API 엔드포인트 실패');
    if (v_1c274a) {

      if (v_1c274a.status || v_1c274a.code) {
        throw v_1c274a;
      }

      if (v_1c274a.response) {
        throw v_1c274a;
      }
    }
    throw new Error('삭제 API 엔드포인트를 찾을 수 없습니다.');
  } catch (v_5e9bfe) {
    console.error('[상점] 구매한 아이템 삭제 오류:', v_5e9bfe);
    if (v_5e9bfe instanceof v_3333d3) {
      console.error('[상점] 상세 오류 정보:', {
        url: v_5e9bfe.config?.url,
        method: v_5e9bfe.config?.method,
        status: v_5e9bfe.response?.status,
        statusText: v_5e9bfe.response?.statusText,
        data: v_5e9bfe.response?.data,
        message: v_5e9bfe.message,
      });
    }
    throw v_5e9bfe;
  }
};

export const v_4d25ff = async (
  v_660822,
  v_ad0715 = 7,
  v_c65f5d,
): Promise<v_a37f54> => {
  try {
    const v_9f42a4 = v_7488d5(v_c65f5d);
    const v_cd6a57 = {
      member: v_660822,
      daysbefore: v_ad0715,
    };

    console.log('[지갑] 지갑 데이터 조회 요청:', { member: v_660822, daysbefore: v_ad0715 });

    const v_3393e3 = await v_9f42a4.post<v_a37f54>(
      '/app4000-01-rev-01',
      v_cd6a57,
    );

    console.log('[지갑] 지갑 데이터 조회 성공');

    return v_3393e3.data;
  } catch (v_5e9bfe) {
    console.error('[지갑] 지갑 데이터 조회 오류:', v_5e9bfe);
    if (v_5e9bfe instanceof v_3333d3) {
      console.error('[지갑] 상세 오류 정보:', {
        url: v_5e9bfe.config?.url,
        method: v_5e9bfe.config?.method,
        status: v_5e9bfe.response?.status,
        statusText: v_5e9bfe.response?.statusText,
        data: v_5e9bfe.response?.data,
        message: v_5e9bfe.message,
      });
    }
    throw v_5e9bfe;
  }
};

export const v_8ffd12 = async (
  v_660822,
  v_c65f5d,
): Promise<v_0c4879> => {
  try {
    const v_9f42a4 = v_7488d5(v_c65f5d);
    const v_cd6a57 = {
      member: v_660822,
    };

    console.log('[지갑] 다른 체인 상태 조회 요청:', { member: v_660822 });

    const v_3393e3 = await v_9f42a4.post<v_0c4879>(
      '/showOtherChains',
      v_cd6a57,
    );

    console.log('[지갑] 다른 체인 상태 조회 성공');

    return v_3393e3.data;
  } catch (v_5e9bfe) {
    console.error('[지갑] 다른 체인 상태 조회 오류:', v_5e9bfe);
    if (v_5e9bfe instanceof v_3333d3) {
      console.error('[지갑] 상세 오류 정보:', {
        url: v_5e9bfe.config?.url,
        method: v_5e9bfe.config?.method,
        status: v_5e9bfe.response?.status,
        statusText: v_5e9bfe.response?.statusText,
        data: v_5e9bfe.response?.data,
        message: v_5e9bfe.message,
      });
    }
    throw v_5e9bfe;
  }
};

export const v_dcc367 = async (
  v_660822,
  v_c65f5d,
): Promise<v_2a2e24> => {
  try {
    const v_9f42a4 = v_7488d5(v_c65f5d);
    const v_cd6a57 = {
      member: v_660822,
    };

    console.log('[지갑] AD XRUN 배너 데이터 조회 요청:', { member: v_660822 });

    const v_3393e3 = await v_9f42a4.post<v_2a2e24>(
      '/ap4000-adxrun-topbanners',
      v_cd6a57,
    );

    console.log('[지갑] AD XRUN 배너 데이터 조회 성공');

    return v_3393e3.data;
  } catch (v_5e9bfe) {
    console.error('[지갑] AD XRUN 배너 데이터 조회 오류:', v_5e9bfe);
    if (v_5e9bfe instanceof v_3333d3) {
      console.error('[지갑] 상세 오류 정보:', {
        url: v_5e9bfe.config?.url,
        method: v_5e9bfe.config?.method,
        status: v_5e9bfe.response?.status,
        statusText: v_5e9bfe.response?.statusText,
        data: v_5e9bfe.response?.data,
        message: v_5e9bfe.message,
      });
    }
    throw v_5e9bfe;
  }
};

export const v_a88281 = async (
  v_157c04,
  v_1c958d,
  v_a832b3,
  v_c65f5d,
): Promise<v_d86d2d> => {
  try {
    const v_9f42a4 = v_7488d5(v_c65f5d);
    const v_cd6a57 = {
      address: v_157c04,
      contract: v_1c958d,
      currency: v_a832b3,
    };

    console.log('[지갑] 토큰 잔액 조회 요청:', { address: v_157c04, contract: v_1c958d, currency: v_a832b3 });

    const v_3393e3 = await v_9f42a4.post<v_d86d2d>(
      '/refreshBalancesCommon',
      v_cd6a57,
    );

    console.log('[지갑] 토큰 잔액 조회 성공');

    return v_3393e3.data;
  } catch (v_5e9bfe) {
    console.error('[지갑] 토큰 잔액 조회 오류:', v_5e9bfe);
    if (v_5e9bfe instanceof v_3333d3) {
      console.error('[지갑] 상세 오류 정보:', {
        url: v_5e9bfe.config?.url,
        method: v_5e9bfe.config?.method,
        status: v_5e9bfe.response?.status,
        statusText: v_5e9bfe.response?.statusText,
        data: v_5e9bfe.response?.data,
        message: v_5e9bfe.message,
      });
    }
    throw v_5e9bfe;
  }
};

export const v_ce7f8e = async (
  v_660822,
  v_2365e9 = 1,
  v_c65f5d,
): Promise<v_034a95> => {
  try {
    const v_9f42a4 = v_7488d5(v_c65f5d);
    const v_cd6a57 = {
      member: v_660822,
      page: v_2365e9,
    };

    console.log('[AD XRUN] 심사중 리스트 조회 요청:', { member: v_660822, page: v_2365e9 });

    const v_3393e3 = await v_9f42a4.post<v_034a95>(
      '/ap4000-adxrun-estimatelist',
      v_cd6a57,
    );

    console.log('[AD XRUN] 심사중 리스트 조회 성공');

    return v_3393e3.data;
  } catch (v_5e9bfe) {
    console.error('[AD XRUN] 심사중 리스트 조회 오류:', v_5e9bfe);
    if (v_5e9bfe instanceof v_3333d3) {
      console.error('[AD XRUN] 상세 오류 정보:', {
        url: v_5e9bfe.config?.url,
        method: v_5e9bfe.config?.method,
        status: v_5e9bfe.response?.status,
        statusText: v_5e9bfe.response?.statusText,
        data: v_5e9bfe.response?.data,
        message: v_5e9bfe.message,
      });
    }
    throw v_5e9bfe;
  }
};

export const v_2e777a = async (
  v_660822,
  v_2365e9 = 1,
  v_c65f5d,
): Promise<v_5c2ee1> => {
  try {
    const v_9f42a4 = v_7488d5(v_c65f5d);
    const v_cd6a57 = {
      member: v_660822,
      page: v_2365e9,
    };

    console.log('[AD XRUN] 정산완료 리스트 조회 요청:', { member: v_660822, page: v_2365e9 });

    const v_3393e3 = await v_9f42a4.post<v_5c2ee1>(
      '/ap4000-adxrun-resultlist',
      v_cd6a57,
    );

    console.log('[AD XRUN] 정산완료 리스트 조회 성공');

    return v_3393e3.data;
  } catch (v_5e9bfe) {
    console.error('[AD XRUN] 정산완료 리스트 조회 오류:', v_5e9bfe);
    if (v_5e9bfe instanceof v_3333d3) {
      console.error('[AD XRUN] 상세 오류 정보:', {
        url: v_5e9bfe.config?.url,
        method: v_5e9bfe.config?.method,
        status: v_5e9bfe.response?.status,
        statusText: v_5e9bfe.response?.statusText,
        data: v_5e9bfe.response?.data,
        message: v_5e9bfe.message,
      });
    }
    throw v_5e9bfe;
  }
};

export const v_fe6b99 = async (
  v_660822,
  v_c65f5d,
): Promise<v_ca4b36> => {
  try {
    const v_9f42a4 = v_7488d5(v_c65f5d);
    const v_cd6a57 = {
      member: v_660822,
    };

    console.log('[AD XRUN] 정산완료 배너 데이터 조회 요청:', { member: v_660822 });

    const v_3393e3 = await v_9f42a4.post<v_ca4b36>(
      '/ap4000-adxrun-topbannersSattled',
      v_cd6a57,
    );

    console.log('[AD XRUN] 정산완료 배너 데이터 조회 성공');

    return v_3393e3.data;
  } catch (v_5e9bfe) {
    console.error('[AD XRUN] 정산완료 배너 데이터 조회 오류:', v_5e9bfe);
    if (v_5e9bfe instanceof v_3333d3) {
      console.error('[AD XRUN] 상세 오류 정보:', {
        url: v_5e9bfe.config?.url,
        method: v_5e9bfe.config?.method,
        status: v_5e9bfe.response?.status,
        statusText: v_5e9bfe.response?.statusText,
        data: v_5e9bfe.response?.data,
        message: v_5e9bfe.message,
      });
    }
    throw v_5e9bfe;
  }
};

export const v_cf99e2 = async (
  v_1c958d,
  v_a832b3,
  v_c65f5d,
): Promise<v_4aa24d> => {
  try {
    const v_9f42a4 = v_7488d5(v_c65f5d);
    const v_cd6a57 = {
      contract: v_1c958d,
      currency: v_a832b3,
    };

    console.log('[지갑] ERC20 토큰 검증 요청:', { contract: v_1c958d, currency: v_a832b3 });

    const v_3393e3 = await v_9f42a4.post<v_4aa24d>(
      '/checkERC20Token',
      v_cd6a57,
    );

    console.log('[지갑] ERC20 토큰 검증 성공');

    return v_3393e3.data;
  } catch (v_5e9bfe) {
    console.error('[지갑] ERC20 토큰 검증 오류:', v_5e9bfe);
    if (v_5e9bfe instanceof v_3333d3) {
      console.error('[지갑] 상세 오류 정보:', {
        url: v_5e9bfe.config?.url,
        method: v_5e9bfe.config?.method,
        status: v_5e9bfe.response?.status,
        statusText: v_5e9bfe.response?.statusText,
        data: v_5e9bfe.response?.data,
        message: v_5e9bfe.message,
      });
    }
    throw v_5e9bfe;
  }
};

export const v_3ff307 = async (
  v_660822,
  v_a832b3,
  v_ad0715 = 7,
  v_9b860a = 0,
  v_c65f5d,
): Promise<v_86c24d> => {
  try {
    const v_9f42a4 = v_7488d5(v_c65f5d);
    const v_cd6a57 = {
      member: v_660822,
      currency: v_a832b3,
      daysbefore: v_ad0715,
      startwith: v_9b860a,
    };

    console.log('[트랜잭션] 전체 히스토리 조회 요청:', { member: v_660822, currency: v_a832b3, daysbefore: v_ad0715, startwith: v_9b860a });

    const v_3393e3 = await v_9f42a4.post<v_86c24d>(
      '/app4200-05',
      v_cd6a57,
    );

    console.log('[트랜잭션] 전체 히스토리 조회 성공');

    return v_3393e3.data;
  } catch (v_5e9bfe) {
    console.error('[트랜잭션] 전체 히스토리 조회 오류:', v_5e9bfe);
    if (v_5e9bfe instanceof v_3333d3) {
      console.error('[트랜잭션] 상세 오류 정보:', {
        url: v_5e9bfe.config?.url,
        method: v_5e9bfe.config?.method,
        status: v_5e9bfe.response?.status,
        statusText: v_5e9bfe.response?.statusText,
        data: v_5e9bfe.response?.data,
        message: v_5e9bfe.message,
      });
    }
    throw v_5e9bfe;
  }
};

export const v_c87170 = async (
  v_660822,
  v_a832b3,
  v_ad0715 = 7,
  v_9b860a = 0,
  v_c65f5d,
): Promise<v_86c24d> => {
  try {
    const v_9f42a4 = v_7488d5(v_c65f5d);
    const v_cd6a57 = {
      member: v_660822,
      currency: v_a832b3,
      daysbefore: v_ad0715,
      startwith: v_9b860a,
    };

    console.log('[트랜잭션] 전송 히스토리 조회 요청:', { member: v_660822, currency: v_a832b3, daysbefore: v_ad0715, startwith: v_9b860a });

    const v_3393e3 = await v_9f42a4.post<v_86c24d>(
      '/app4200-06',
      v_cd6a57,
    );

    console.log('[트랜잭션] 전송 히스토리 조회 성공');

    return v_3393e3.data;
  } catch (v_5e9bfe) {
    console.error('[트랜잭션] 전송 히스토리 조회 오류:', v_5e9bfe);
    if (v_5e9bfe instanceof v_3333d3) {
      console.error('[트랜잭션] 상세 오류 정보:', {
        url: v_5e9bfe.config?.url,
        method: v_5e9bfe.config?.method,
        status: v_5e9bfe.response?.status,
        statusText: v_5e9bfe.response?.statusText,
        data: v_5e9bfe.response?.data,
        message: v_5e9bfe.message,
      });
    }
    throw v_5e9bfe;
  }
};

export const v_f730b0 = async (
  v_660822,
  v_a832b3,
  v_ad0715 = 7,
  v_9b860a = 0,
  v_c65f5d,
): Promise<v_86c24d> => {
  try {
    const v_9f42a4 = v_7488d5(v_c65f5d);
    const v_cd6a57 = {
      member: v_660822,
      currency: v_a832b3,
      daysbefore: v_ad0715,
      startwith: v_9b860a,
    };

    console.log('[트랜잭션] 수신 상세 조회 요청:', { member: v_660822, currency: v_a832b3, daysbefore: v_ad0715, startwith: v_9b860a });

    const v_3393e3 = await v_9f42a4.post<v_86c24d>(
      '/app4200-01',
      v_cd6a57,
    );

    console.log('[트랜잭션] 수신 상세 조회 성공');

    return v_3393e3.data;
  } catch (v_5e9bfe) {
    console.error('[트랜잭션] 수신 상세 조회 오류:', v_5e9bfe);
    if (v_5e9bfe instanceof v_3333d3) {
      console.error('[트랜잭션] 상세 오류 정보:', {
        url: v_5e9bfe.config?.url,
        method: v_5e9bfe.config?.method,
        status: v_5e9bfe.response?.status,
        statusText: v_5e9bfe.response?.statusText,
        data: v_5e9bfe.response?.data,
        message: v_5e9bfe.message,
      });
    }
    throw v_5e9bfe;
  }
};

export const v_629c7b = async (
  v_660822,
  v_a832b3,
  v_ad0715 = 7,
  v_9b860a = 0,
  v_c65f5d,
): Promise<v_86c24d> => {
  try {
    const v_9f42a4 = v_7488d5(v_c65f5d);
    const v_cd6a57 = {
      member: v_660822,
      currency: v_a832b3,
      daysbefore: v_ad0715,
      startwith: v_9b860a,
    };

    console.log('[트랜잭션] 전환 히스토리 조회 요청:', { member: v_660822, currency: v_a832b3, daysbefore: v_ad0715, startwith: v_9b860a });

    const v_3393e3 = await v_9f42a4.post<v_86c24d>(
      '/app4200-03',
      v_cd6a57,
    );

    console.log('[트랜잭션] 전환 히스토리 조회 성공');

    return v_3393e3.data;
  } catch (v_5e9bfe) {
    console.error('[트랜잭션] 전환 히스토리 조회 오류:', v_5e9bfe);
    if (v_5e9bfe instanceof v_3333d3) {
      console.error('[트랜잭션] 상세 오류 정보:', {
        url: v_5e9bfe.config?.url,
        method: v_5e9bfe.config?.method,
        status: v_5e9bfe.response?.status,
        statusText: v_5e9bfe.response?.statusText,
        data: v_5e9bfe.response?.data,
        message: v_5e9bfe.message,
      });
    }
    throw v_5e9bfe;
  }
};

export const v_927baf = async (
  v_231c19,
  v_0d793b,
  v_f63e09,
  v_21cc31,
  v_a832b3,
  v_74efc1 = 'ETH',
  v_bcd61d = 1,
  v_039314 = 2,
  v_c65f5d,
): Promise<any> => {
  try {
    const v_c9c489 = v_e4a763();
    const v_36dd9e = v_c9c489.GATEWAY_AUTH_CODE;

    const v_4d33b2 = {
      from: v_231c19,
      to: v_0d793b,
      amount: v_f63e09,
      token: v_21cc31,
      currency: v_a832b3,
      network: v_74efc1,
      chainId: v_bcd61d,
      priorityGasTracker: v_039314,
    };

    console.log('[가스 수수료 예상] API 요청:', v_4d33b2);

    const v_3393e3 = await v_12a388('/gasEstimated', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${v_36dd9e}`,
      },
      body: JSON.stringify(v_4d33b2),
    }, v_c65f5d);

    if (!v_3393e3.ok) {
      throw new Error(`HTTP error! status: ${v_3393e3.status}`);
    }

    const v_43c42e = await v_3393e3.json();
    console.log('[가스 수수료 예상] API 응답:', v_43c42e);

    return v_43c42e;
  } catch (v_5e9bfe) {
    console.error('[가스 수수료 예상] API 호출 실패:', v_5e9bfe);
    if (v_c65f5d) {
      await v_e4d665(v_c65f5d);
    }
    throw v_5e9bfe;
  }
};

export const v_76d832 = async (
  v_231c19,
  v_0d793b,
  v_f63e09,
  v_660822,
  v_74efc1,
  v_a832b3,
  v_bcd61d,
  v_c65f5d,
): Promise<any> => {
  try {
    const v_c9c489 = v_e4a763();
    const v_36dd9e = v_c9c489.GATEWAY_AUTH_CODE;

    const v_4d33b2 = {
      from: v_231c19,
      to: v_0d793b,
      amount: v_f63e09,
      member: v_660822,
      network: v_74efc1,
      currency: v_a832b3,
      chainId: v_bcd61d,
    };

    console.log('[블록체인 전송] API 요청:', v_4d33b2);

    const v_3393e3 = await v_12a388('/postTransferNew', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${v_36dd9e}`,
      },
      body: JSON.stringify(v_4d33b2),
    }, v_c65f5d);

    if (!v_3393e3.ok) {
      throw new Error(`HTTP error! status: ${v_3393e3.status}`);
    }

    const v_43c42e = await v_3393e3.json();
    console.log('[블록체인 전송] API 응답:', v_43c42e);

    return v_43c42e;
  } catch (v_5e9bfe) {
    console.error('[블록체인 전송] API 호출 실패:', v_5e9bfe);
    if (v_c65f5d) {
      await v_e4d665(v_c65f5d);
    }
    throw v_5e9bfe;
  }
};

export const v_4dba02 = async (
  v_4898e2,
  v_05bb19,
  v_c65f5d,
): Promise<string> => {
  try {
    const v_9f42a4 = v_7488d5(v_c65f5d);

    let v_8a32c8 = 'app7010-01';
    if (v_05bb19 === 'id') {
      v_8a32c8 += '-id';
    } else if (v_05bb19 === 'ko') {
      v_8a32c8 += '-kr';
    } else if (v_05bb19 === 'en') {
      v_8a32c8 += '-en';
    } else if (v_05bb19 === 'zh-CN' || v_05bb19 === 'zh') {
      v_8a32c8 += '-zh';
    } else {

      v_8a32c8 += '-en';
    }

    console.log('[약관] 약관 내용 요청:', { clauseType: v_4898e2, language: v_05bb19, apiUrl: v_8a32c8 });

    const v_3393e3 = await v_9f42a4.get<{ data: Array<{ c: string }> }>(v_8a32c8);

    console.log('[약관] API 응답 데이터:', {
      language: v_05bb19,
      dataLength: v_3393e3.data.data?.length,
      data: v_3393e3.data.data,
    });

    let v_b43b74 = '';
    if (v_4898e2 === 'service') {
      v_b43b74 = v_3393e3.data.data?.[0]?.c || '';
    } else if (v_4898e2 === 'personal') {
      v_b43b74 = v_3393e3.data.data?.[1]?.c || '';
    } else if (v_4898e2 === 'location') {
      v_b43b74 = v_3393e3.data.data?.[2]?.c || '';
    }

    if ((v_05bb19 === 'zh-CN' || v_05bb19 === 'zh') && !v_b43b74) {
      console.warn('[약관] 중국어 약관 내용이 비어있습니다. 전체 응답 확인:', v_3393e3.data);

      if (v_3393e3.data.data && v_3393e3.data.data.length > 0) {

        for (let v_ebec57 = 0; v_ebec57 < v_3393e3.data.data.length; v_ebec57++) {
          const v_8c0b26 = v_3393e3.data.data[v_ebec57];
          if (v_8c0b26 && v_8c0b26.c && v_8c0b26.c.trim()) {

            if (v_4898e2 === 'service' && v_ebec57 === 0) {
              v_b43b74 = v_8c0b26.c;
              break;
            } else if (v_4898e2 === 'personal' && v_ebec57 === 1) {
              v_b43b74 = v_8c0b26.c;
              break;
            } else if (v_4898e2 === 'location' && v_ebec57 === 2) {
              v_b43b74 = v_8c0b26.c;
              break;
            }
          }
        }

        if (!v_b43b74 && v_3393e3.data.data.length > 0) {
          const v_08588b = v_3393e3.data.data.find(v_8c0b26 => v_8c0b26 && v_8c0b26.c && v_8c0b26.c.trim());
          if (v_08588b) {
            v_b43b74 = v_08588b.c;
            console.log('[약관] Fallback으로 첫 번째 비어있지 않은 항목 사용');
          }
        }
      }
    }

    console.log('[약관] 약관 내용 로드 성공:', { clauseType: v_4898e2, language: v_05bb19, contentLength: v_b43b74.length });

    return v_b43b74;
  } catch (v_5e9bfe) {
    console.error('[약관] 약관 내용 로드 실패:', v_5e9bfe);
    if (v_5e9bfe instanceof v_3333d3) {
      console.error('[약관] 상세 오류 정보:', {
        url: v_5e9bfe.config?.url,
        method: v_5e9bfe.config?.method,
        status: v_5e9bfe.response?.status,
        statusText: v_5e9bfe.response?.statusText,
        data: v_5e9bfe.response?.data,
        message: v_5e9bfe.message,
      });
    }
    if (v_c65f5d) {
      await v_e4d665(v_c65f5d);
    }
    throw v_5e9bfe;
  }
};

const v_332c06 = 'topAd5Data';

export const v_563153 = async (v_c65f5d): Promise<any> => {
  try {
    const v_e16099 = v_326be8.OS === 'ios' ? 'ios' : 'android';

    let v_660822 = '';
    try {
      const v_ef7306 = await v_e84827.getItem('userData');
      if (v_ef7306) {
        const v_ff39bc = JSON.parse(v_ef7306);
        v_660822 = v_ff39bc?.member || '';
      }
    } catch (v_7f5774) {
      console.log('[getTopAd5] userData 가져오기 실패:', v_7f5774);
    }

    const v_cd6a57 = { os: v_e16099, member: v_660822 };

    console.log('[getTopAd5] API 호출 시작');
    console.log('[getTopAd5] OS:', v_e16099);
    console.log('[getTopAd5] member:', v_660822);

    const v_3393e3 = await v_c07360('getTopAd5', 'POST', v_cd6a57, v_c65f5d);

    console.log('[getTopAd5] API 호출 완료 - 원본 response 타입:', typeof v_3393e3);
    console.log('[getTopAd5] API 호출 완료 - 원본 response:', v_3393e3);

    if (!v_3393e3) {
      console.warn('[getTopAd5] API 응답이 없습니다.');
      return null;
    }

    let v_e36b07 = [];
    if (Array.isArray(v_3393e3)) {

      v_e36b07 = v_3393e3;
    } else if (v_3393e3?.data?.ads && Array.isArray(v_3393e3.data.ads)) {

      v_e36b07 = v_3393e3.data.ads;
    } else if (v_3393e3?.ads && Array.isArray(v_3393e3.ads)) {

      v_e36b07 = v_3393e3.ads;
    } else {
      console.warn('[getTopAd5] 예상하지 못한 response 구조:', v_3393e3);
      return null;
    }

    console.log('[getTopAd5] 추출된 topAd5Response 길이:', v_e36b07.length);

    if (v_e36b07 && v_e36b07.length > 0) {
      await v_e84827.setItem(v_332c06, JSON.stringify(v_e36b07));
      console.log('[getTopAd5] AsyncStorage에 저장 완료:', v_e36b07.length, '개 광고');
    } else {
      console.warn('[getTopAd5] 저장할 광고 데이터가 없습니다.');
    }

    return v_e36b07;
  } catch (v_5e9bfe) {
    console.error('[getTopAd5] API 호출 실패:', v_5e9bfe);
    throw v_5e9bfe;
  }
};

export const v_5d7ca4 = async (): Promise<any | null> => {
  try {
    const v_fe7102 = await v_e84827.getItem(v_332c06);
    if (v_fe7102) {
      return JSON.parse(v_fe7102);
    }
    return null;
  } catch (v_5e9bfe) {
    console.error('[getStoredTopAd5] AsyncStorage 읽기 실패:', v_5e9bfe);
    return null;
  }
};

export const v_d751d6 = async (
  request: v_c2fe02,
  v_c65f5d,
): Promise<v_574952> => {
  try {
    const v_9f42a4 = v_7488d5(v_c65f5d);

    console.log('========================================');
    console.log('[인앱구매 API] 구매 데이터 전송 시작');
    console.log('========================================');
    console.log('[인앱구매 API] 요청 데이터:');
    console.log(JSON.stringify(v_576f5a, null, 2));
    console.log('----------------------------------------');

    const v_3393e3 = await v_9f42a4.post<v_574952>(
      '/inapp/purchase',
      v_576f5a,
    );

    console.log('========================================');
    console.log('[인앱구매 API] ✅ 전송 성공');
    console.log('========================================');
    console.log('[인앱구매 API] 응답 데이터:');
    console.log(JSON.stringify(v_3393e3.data, null, 2));
    console.log('----------------------------------------');
    console.log('[인앱구매 API] 상태:', v_3393e3.data?.status);
    console.log('[인앱구매 API] 메시지:', v_3393e3.data?.message);
    if (v_3393e3.data?.data?.savedCount !== undefined) {
      console.log('[인앱구매 API] 저장된 수:', v_3393e3.data.data.savedCount);
    }
    console.log('========================================');

    return v_3393e3.data;
  } catch (v_5e9bfe) {
    console.log('========================================');
    console.error('[인앱구매 API] ❌ 전송 실패');
    console.log('========================================');
    if (v_5e9bfe instanceof v_3333d3) {
      console.error('[인앱구매 API] 상세 오류 정보:', {
        url: v_5e9bfe.config?.url,
        method: v_5e9bfe.config?.method,
        status: v_5e9bfe.response?.status,
        statusText: v_5e9bfe.response?.statusText,
        data: v_5e9bfe.response?.data,
        message: v_5e9bfe.message,
      });
    } else {
      console.error('[인앱구매 API] 오류:', v_5e9bfe);
    }
    console.log('========================================');

    if (v_c65f5d) {
      await v_e4d665(v_c65f5d);
    }
    throw v_5e9bfe;
  }
};

export const v_dedaa7 = async (
  v_660822,
  v_c65f5d,
): Promise<any> => {
  try {
    const v_cd6a57 = {
      member: v_660822,
    };

    console.log('[레벨 정보] 사용자 레벨 정보 조회 요청:', v_660822);

    const v_3393e3 = await v_c07360('getMembersLevelInfo', 'POST', v_cd6a57, v_c65f5d);

    console.log('[레벨 정보] 사용자 레벨 정보 조회 성공:', v_3393e3);

    return v_3393e3;
  } catch (v_5e9bfe) {
    console.error('[레벨 정보] 사용자 레벨 정보 조회 오류:', v_5e9bfe);
    throw v_5e9bfe;
  }
};

