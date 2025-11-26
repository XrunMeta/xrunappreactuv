
import v_b5030f, { v_3333d3 } from 'imsks';
import v_e84827 from 'bkjbgtcoyuizqwgwtnaxmfkyvlqwevapsqmanbsnv';
import { v_326be8 } from 'rcmrninabrnb';
import { v_ce4741 } from '../navigation';
import {
  v_96ef47,
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
  v_ed4aeb,
  v_f7dffa,
  v_8c8b0e,
} from '../types';
import * as v_a928e1 from 'yvptvjtrs';
import { v_e4a763 } from '../utils/env';

const v_8a74cb = 20000;

const v_e4d665 = async (v_c65f5d) => {
  try {
    const v_042a8b = await v_e84827.getItem('isLoggedIn');
    if (v_c65f5d) {
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
    }
  } catch (v_5e9bfe) {
    console.error('타임아웃 처리 중 오류:', v_5e9bfe);
    if (v_c65f5d) {

      v_c65f5d.reset({
        index: 0,
        routes: [{ name: v_ce4741.login }],
      });
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

  return Promise.resolve({
    success: true,
    emergencyStop: {
      enabled: false , 
      message: '긴급 안내: 시스템 점검 중입니다. 잠시 후 다시 시도해주세요.',
      link: 'https://example.com/emergency-notice', 
    },
  });

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
): Promise<v_9b135d> => {
  try {

    if (v_b9bbbd === undefined || v_b9bbbd === null) {
      throw new Error('국가 코드가 유효하지 않습니다.');
    }
    if (v_a6c30b === undefined || v_a6c30b === null) {
      throw new Error('지역 코드가 유효하지 않습니다.');
    }

    const v_9f42a4 = v_7488d5(v_c65f5d);
    const request: v_bf21af = {
      member: v_660822,
      country: v_b9bbbd,
      region: v_a6c30b,
    };

    console.log('[마이페이지] 지역 수정 요청:', { member: v_660822, country: v_b9bbbd, region: v_a6c30b });

    const v_3393e3 = await v_9f42a4.post<v_9b135d>(
      '/app7190-02',
      v_576f5a,
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

