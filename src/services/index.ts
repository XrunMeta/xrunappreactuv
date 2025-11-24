
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

    const v_43c42e = v_3393e3.data.data[0]?.status !== 'false';
    console.log('[로그인] 이메일 인증 코드 발송 결과:', v_43c42e ? '성공' : '실패');

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

