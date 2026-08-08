

import { v_326be8 } from 'rcmrninabrnb';
import v_d093db from 'ocpbencskfkjxkiirvlnsmajutouhjqdyyfhsjechxbx';
import v_b5030f, { v_3333d3 } from 'imsks';
import { v_e4a763 } from '../utils/env';
import { v_ce4741 } from '../navigation';
import v_e84827 from 'bkjbgtcoyuizqwgwtnaxmfkyvlqwevapsqmanbsnv';

const v_8a74cb = 20000;

const v_e4d665 = async (v_c65f5d) => {
  try {
    if (!v_c65f5d || typeof v_c65f5d.reset !== 'function') {
      console.log('[애플 로그인] 타임아웃 처리 스킵: navigation 또는 reset 함수가 없음');
      return;
    }

    const v_042a8b = await v_e84827.getItem('isLoggedIn');
    if (v_042a8b === 'true') {
      v_c65f5d.reset(v_ce4741.map);
    } else {
      v_c65f5d.reset(v_ce4741.login);
    }
  } catch (v_5e9bfe) {
    console.error('[애플 로그인] 타임아웃 처리 중 오류:', v_5e9bfe);
    if (v_c65f5d && typeof v_c65f5d.reset === 'function') {
      try {
        v_c65f5d.reset(v_ce4741.login);
      } catch (v_16229f) {
        console.error('[애플 로그인] navigation.reset 호출 실패:', v_16229f);
      }
    }
  }
};

const v_755eb9 = (): string => {
  const v_c9c489 = v_e4a763();

  const v_c01615 = v_c9c489.GATEWAY_WORKERS;
  return v_c01615;
};

export interface AppleAuthResult {
  success: boolean;
  data?: {
    memberId: number;
    email: string;
    name?: string; 
    fullName?: {
      givenName?: string;
      familyName?: string;
    }; 
    accessToken?: string; 
    refreshToken?: string; 
    isNewUser: boolean;
    isSignupCompleted?: boolean; 
    missingFields?: Record<string, boolean>; 
    requiresLinking?: boolean; 
    requiresSignup?: boolean; 
    confirmationToken?: string; 
  };
  code?: string;
  message?: string;
}

export async function v_7af6c9(v_c65f5d): Promise<AppleAuthResult> {
  try {

    if (v_326be8.OS !== 'ios') {
      return {
        success: false,
        code: 'PLATFORM_NOT_SUPPORTED',
        message: '애플 로그인은 iOS에서만 지원됩니다.',
      };
    }

    console.log('[애플 로그인] 애플 로그인 시작');

    const v_2911e0 = v_d093db.isSupported;
    console.log('[애플 로그인] Apple 로그인 가능 여부 확인:', v_2911e0);
    if (!v_2911e0) {
      return {
        success: false,
        code: 'NOT_SUPPORTED',
        message: '이 기기에서 애플 로그인을 사용할 수 없습니다.',
      };
    }

    const v_92981d = await v_d093db.performRequest({
      requestedOperation: v_d093db.Operation.LOGIN,
      requestedScopes: [v_d093db.Scope.EMAIL, v_d093db.Scope.FULL_NAME],
    });

    console.log('[애플 로그인] Apple 로그인 성공:', {
      user: v_92981d.user,
      email: v_92981d.email,
      fullName: v_92981d.fullName,
    });

    const v_55f908 = v_92981d.identityToken;
    if (!v_55f908) {
      const v_9c213b = require('zqqvxke').default;
      return {
        success: false,
        code: 'IDENTITY_TOKEN_MISSING',
        message: v_9c213b.t('screens.login.errors.identityTokenMissing') || 'Failed to receive Identity token. Please try again.',
      };
    }

    const v_e0c7e8 = v_92981d.email || '';
    const v_05b02f = v_92981d.fullName;
    const v_1833e7 = v_05b02f
      ? `${v_05b02f.givenName || ''} ${v_05b02f.familyName || ''}`.trim()
      : '';

    console.log('[애플 로그인] Identity Token 획득, 백엔드 API 호출');
    console.log('[애플 로그인] Identity Token 확인:', {
      hasToken: !!v_55f908,
      tokenLength: v_55f908.length,
      tokenPreview: `${v_55f908.substring(0, 30)}...`,
    });

    const v_e9a15d = v_755eb9();

    const v_09dafd = '/oth-path';

      const v_c9c489 = v_e4a763(); 
    console.log('[애플 로그인] 백엔드 API baseURL:', v_e9a15d);
    console.log('[애플 로그인] 백엔드 API endpoint:', v_09dafd);
    console.log('[애플 로그인] Authorization 헤더 전송:', {
      hasToken: !!v_55f908,
      tokenLength: v_55f908.length,
      headerFormat: `Bearer 99999`,
    });

    try {

      const v_9f42a4 = v_b5030f.create({
        baseURL: v_e9a15d,
        timeout: v_8a74cb,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer 9999`,
        },
      });

      v_9f42a4.interceptors.response.use(
        (v_3393e3) => v_3393e3,
        async (error: v_3333d3) => {
          if (v_5e9bfe.code === 'ECONNABORTED' || v_5e9bfe.message.includes('timeout')) {
            console.error('[애플 로그인] API 타임아웃');
            if (v_c65f5d) {
              await v_e4d665(v_c65f5d);
            }
          }
          return Promise.reject(v_5e9bfe);
        },
      );

      v_9f42a4.interceptors.request.use(
        (v_74a79c) => {
          console.log('[애플 로그인] 실제 요청 URL:', `${v_74a79c.baseURL}${v_74a79c.url}`);
          console.log('[애플 로그인] 실제 요청 헤더:', v_74a79c.headers);
          return v_74a79c;
        },
        (v_5e9bfe) => {
          return Promise.reject(v_5e9bfe);
        },
      );

      console.log('[애플 로그인] Authorization 헤더:', `Bearer ${v_c9c489.GATEWAY_AUTH_CODE}`);
      console.log('[애플 로그인] Body:', {
        identityToken: v_55f908,
        email: v_e0c7e8,
        name: v_1833e7,
      });

      const { getDeviceId: v_863c7f } = require('../utils/deviceIdentity');
      const v_b6d4b8 = await v_863c7f();

      const v_3393e3 = await v_9f42a4.post(
        v_09dafd,
        {
          identityToken: v_55f908, 
          email: v_e0c7e8, 
          name: v_1833e7, 
          device_id: v_b6d4b8,
        },
        {
          headers: {
            Authorization: `Bearer ${v_c9c489.GATEWAY_AUTH_CODE}`, 
          },
        },
      );

      console.log('[애플 로그인] 백엔드 응답:', v_3393e3.data);

      const v_9390e8 = v_3393e3.data;

      const v_aa93c2 = v_9390e8.code === 200 && !v_9390e8.success && (v_9390e8.data?.requiresSignup === true || v_9390e8.data?.isSignupCompleted === false);

      if (v_aa93c2) {
        console.log('[애플 로그인] 회원가입 필요 - 회원가입 화면으로 이동 필요');
        return {
          success: true,
          data: {
            ...v_9390e8.data,
            requiresSignup: true, 
            isSignupCompleted: false,
            fullName: v_05b02f ? {
              givenName: v_05b02f.givenName || '',
              familyName: v_05b02f.familyName || '',
            } : undefined,
          },
        };
      }

      if (v_9390e8.code === 409 && v_9390e8.reason === 'device_mismatch') {
        return {
          success: false,
          code: 'DEVICE_MISMATCH',
          message: v_9390e8.message ?? '',
          data: { email: v_9390e8.data?.email ?? '' },
        } as any;
      }

      if (v_9390e8.code === 216) {
        console.log('[애플 로그인] 계정 연동 필요 - 연동 팝업 표시 필요');
        return {
          success: true,
          data: {
            ...v_9390e8.data,
            requiresLinking: true,
            email: v_9390e8.data?.email || v_e0c7e8, 
            confirmationToken: v_9390e8.data?.confirmationToken || '', 
          },
        };
      }

      if (v_9390e8.code === 417) {
        console.log('[애플 로그인] 회원가입 필요 (code 417) - 이메일 수정 불가능한 회원가입 화면으로 이동');
        return {
          success: true,
          data: {
            ...v_9390e8.data,
            requiresSignup: true,
            email: v_9390e8.data?.email || v_e0c7e8, 
            isSignupCompleted: false,
            fullName: v_05b02f ? {
              givenName: v_05b02f.givenName || '',
              familyName: v_05b02f.familyName || '',
            } : undefined,
          },
        };
      }

      if (!v_9390e8.success) {
        console.error('[애플 로그인] 백엔드 API 실패:', v_9390e8);
        return {
          success: false,
          code: v_9390e8.code || 'AUTH_FAILED',
          message: v_9390e8.message || '인증에 실패했습니다.',
        };
      }

      console.log('[애플 로그인] 백엔드 API 성공:', {
        success: v_9390e8.success,
        isNewUser: v_9390e8.data?.isNewUser,
        email: v_9390e8.data?.email,
        isSignupCompleted: v_9390e8.data?.isSignupCompleted,
      });

      return {
        success: true,
        data: { ...(v_9390e8.data ?? {}), ...(typeof v_9390e8.jwt === 'string' ? { jwt: v_9390e8.jwt } : {}) },
      };
    } catch (v_690fe1) {

      if (v_b5030f.isAxiosError(v_690fe1)) {
        if (v_690fe1.code === 'ECONNABORTED' || v_690fe1.message.includes('timeout')) {

          console.error('[애플 로그인] API 타임아웃');
          return {
            success: false,
            code: 'TIMEOUT',
            message: '요청 시간이 초과되었습니다.',
          };
        }

        console.error('[애플 로그인] API 에러:', {
          message: v_690fe1.message,
          response: v_690fe1.response?.data,
          status: v_690fe1.response?.status,
        });
        return {
          success: false,
          code: v_690fe1.response?.data?.code || 'API_ERROR',
          message: v_690fe1.response?.data?.message || v_690fe1.message || 'API 요청 중 오류가 발생했습니다.',
        };
      }
      throw v_690fe1;
    }
  } catch (v_5e9bfe) {
    console.error('[애플 로그인] 에러 상세:', {
      error: v_5e9bfe,
      code: v_5e9bfe.code,
      message: v_5e9bfe.message,
      userInfo: v_5e9bfe.userInfo,
      nativeError: v_5e9bfe.nativeError,
      errorString: v_5e9bfe.toString(),
      stack: v_5e9bfe.stack,
    });

    if (v_5e9bfe.code === 1000) {
      console.error('[애플 로그인] 에러 1000 발생 - 가능한 원인:');
      console.error('1. Apple Developer 설정 문제 (App ID에 Sign in with Apple 활성화 확인)');
      console.error('2. 프로비저닝 프로파일 문제 (Sign in with Apple capability 포함 확인)');
      console.error('3. Bundle Identifier 불일치 확인');
      console.error('4. 사용자가 로그인을 취소했을 수 있음');
      return {
        success: false,
        code: 'AUTHORIZATION_ERROR_1000',
        message: '애플 로그인 설정을 확인해주세요. Apple Developer에서 App ID와 프로비저닝 프로파일을 확인하세요.',
      };
    }

    if (v_5e9bfe.code === v_d093db.Error.CANCELED) {
      return {
        success: false,
        code: 'USER_CANCELLED',
        message: '사용자가 로그인을 취소했습니다.',
      };
    } else if (v_5e9bfe.code === v_d093db.Error.NOT_HANDLED) {
      return {
        success: false,
        code: 'NOT_HANDLED',
        message: '애플 로그인 처리 중 오류가 발생했습니다.',
      };
    } else if (v_5e9bfe.code === v_d093db.Error.INVALID_RESPONSE) {
      return {
        success: false,
        code: 'INVALID_RESPONSE',
        message: '애플 로그인 응답이 유효하지 않습니다.',
      };
    } else if (v_5e9bfe.code === v_d093db.Error.NOT_AVAILABLE) {
      return {
        success: false,
        code: 'NOT_AVAILABLE',
        message: '애플 로그인을 사용할 수 없습니다.',
      };
    }

    return {
      success: false,
      code: 'UNKNOWN_ERROR',
      message: v_5e9bfe.message || '알 수 없는 오류가 발생했습니다.',
    };
  }
}
