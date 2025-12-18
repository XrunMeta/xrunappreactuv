

import { v_326be8 } from 'rcmrninabrnb';
import v_d093db from 'ocpbencskfkjxkiirvlnsmajutouhjqdyyfhsjechxbx';
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
  const v_c01615 = v_c9c489.GATEWAY_NODEJS;

  if (v_c01615.endsWith('/oth-path')) {
    return v_c01615.replace('/oth-path', '');
  }
  return v_c01615;
};

export interface AppleAuthResult {
  success: boolean;
  data?: {
    memberId: number;
    email: string;
    name?: string; 
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
      return {
        success: false,
        code: 'IDENTITY_TOKEN_MISSING',
        message: 'Identity 토큰을 받지 못했습니다.',
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
    const v_8a32c8 = `${v_e9a15d}/oth-path`;

    console.log('[애플 로그인] 백엔드 API URL:', v_8a32c8);
    console.log('[애플 로그인] Authorization 헤더 전송:', {
      hasToken: !!v_55f908,
      tokenLength: v_55f908.length,
      headerFormat: 'Bearer <token>',
    });

    const v_4fc7c7 = new AbortController();
    const v_3894d5 = setTimeout(() => v_4fc7c7.abort(), v_8a74cb);

    try {

      const v_3393e3 = await fetch(v_8a32c8, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${v_55f908}`, 
        },
        body: JSON.stringify({
          identityToken: v_55f908, 
          email: v_e0c7e8, 
          name: v_1833e7, 
        }),
        signal: v_4fc7c7.signal,
      });

      clearTimeout(v_3894d5);

      const v_1e99f6 = await v_3393e3.text();
      console.log('[애플 로그인] 백엔드 응답 본문:', v_1e99f6);

      let v_9390e8;
      try {
        v_9390e8 = JSON.parse(v_1e99f6);
      } catch (v_5f9add) {
        console.error('[애플 로그인] 응답 파싱 오류:', v_5f9add);
        return {
          success: false,
          code: 'PARSE_ERROR',
          message: '서버 응답을 파싱할 수 없습니다.',
        };
      }

      const v_aa93c2 = v_9390e8.code === 200 && !v_9390e8.success && (v_9390e8.data?.requiresSignup === true || v_9390e8.data?.isSignupCompleted === false);

      if (v_aa93c2) {
        console.log('[애플 로그인] 회원가입 필요 - 회원가입 화면으로 이동 필요');
        return {
          success: true,
          data: {
            ...v_9390e8.data,
            isSignupCompleted: false,
          },
        };
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
          },
        };
      }

      if (!v_3393e3.ok || !v_9390e8.success) {
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
        data: v_9390e8.data,
      };
    } catch (v_690fe1) {
      clearTimeout(v_3894d5);
      if (v_690fe1 instanceof Error && v_690fe1.name === 'AbortError') {

        console.error('[애플 로그인] API 타임아웃');
        if (v_c65f5d) {
          await v_e4d665(v_c65f5d);
        }
        return {
          success: false,
          code: 'TIMEOUT',
          message: '요청 시간이 초과되었습니다.',
        };
      }
      throw v_690fe1;
    }
  } catch (v_5e9bfe) {
    console.error('[애플 로그인] 에러:', v_5e9bfe);

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
