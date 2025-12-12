

import { v_326be8 } from 'rcmrninabrnb';
import { v_4eac84, v_8d3720 } from 'tdbilgxptaometuphydosyywsglhnlfgkfkzstthk';
import { v_e4a763 } from '../utils/env';
import { v_ce4741 } from '../navigation';
import v_e84827 from 'bkjbgtcoyuizqwgwtnaxmfkyvlqwevapsqmanbsnv';

const v_93942f = 'oth-client.googleusercontent.invalid';
const v_708346 = 'oth-client.googleusercontent.invalid';

const v_8a74cb = 20000;

export const v_83e499 = () => {
  try {
    if (v_326be8.OS === 'ios') {
      v_4eac84.configure({
        iosClientId: v_708346,
        webClientId: v_93942f,
        offlineAccess: true, 
      });
    } else {

      v_4eac84.configure({
        webClientId: v_93942f,
        offlineAccess: true, 
      });
    }
    console.log('[구글 로그인] GoogleSignin 초기화 완료');
  } catch (v_5e9bfe) {
    console.error('[구글 로그인] 초기화 실패:', v_5e9bfe);
  }
};

const v_e4d665 = async (v_c65f5d) => {
  try {
    if (!v_c65f5d || typeof v_c65f5d.reset !== 'function') {
      console.log('[구글 로그인] 타임아웃 처리 스킵: navigation 또는 reset 함수가 없음');
      return;
    }

    const v_042a8b = await v_e84827.getItem('isLoggedIn');
    if (v_042a8b === 'true') {
      v_c65f5d.reset(v_ce4741.map);
    } else {
      v_c65f5d.reset(v_ce4741.login);
    }
  } catch (v_5e9bfe) {
    console.error('[구글 로그인] 타임아웃 처리 중 오류:', v_5e9bfe);
    if (v_c65f5d && typeof v_c65f5d.reset === 'function') {
      try {
        v_c65f5d.reset(v_ce4741.login);
      } catch (v_16229f) {
        console.error('[구글 로그인] navigation.reset 호출 실패:', v_16229f);
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

export interface GoogleAuthResult {
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
  };
  code?: string;
  message?: string;
}

export async function v_2683ec(v_c65f5d): Promise<GoogleAuthResult> {
  try {
    console.log('[구글 로그인] 구글 로그인 시작');

    if (v_326be8.OS === 'android') {
      await v_4eac84.hasPlayServices({ showPlayServicesUpdateDialog: true });
    }

    await v_4eac84.signOut(); 
    const v_bb789b = await v_4eac84.signIn();

    console.log('[구글 로그인] Google 로그인 성공:', {
      id: v_bb789b.data?.user.id,
      email: v_bb789b.data?.user.email,
      name: v_bb789b.data?.user.name,
    });

    const v_b50834 = v_bb789b.data?.idToken;
    if (!v_b50834) {
      return {
        success: false,
        code: 'ID_TOKEN_MISSING',
        message: 'ID 토큰을 받지 못했습니다.',
      };
    }

    console.log('[구글 로그인] ID Token 획득, 백엔드 API 호출');
    console.log('[구글 로그인] ID Token 확인:', {
      hasToken: !!v_b50834,
      tokenLength: v_b50834.length,
      tokenPreview: `${v_b50834.substring(0, 30)}...`,
    });

    const v_e9a15d = v_755eb9();
    const v_8a32c8 = `${v_e9a15d}/oth-path`;

    console.log('[구글 로그인] 백엔드 API URL:', v_8a32c8);

    const v_4fc7c7 = new AbortController();
    const v_3894d5 = setTimeout(() => v_4fc7c7.abort(), v_8a74cb);

    try {
      const v_3393e3 = await fetch(v_8a32c8, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          idToken: v_b50834,
        }),
        signal: v_4fc7c7.signal,
      });

      clearTimeout(v_3894d5);

      const v_1e99f6 = await v_3393e3.text();
      console.log('[구글 로그인] 백엔드 응답 본문:', v_1e99f6);

      let v_9390e8;
      try {
        v_9390e8 = JSON.parse(v_1e99f6);
      } catch (v_5f9add) {
        console.error('[구글 로그인] 응답 파싱 오류:', v_5f9add);
        return {
          success: false,
          code: 'PARSE_ERROR',
          message: '서버 응답을 파싱할 수 없습니다.',
        };
      }

      const v_aa93c2 = v_9390e8.code === 200 && !v_9390e8.success && (v_9390e8.data?.requiresSignup === true || v_9390e8.data?.isSignupCompleted === false);

      if (v_aa93c2) {
        console.log('[구글 로그인] 회원가입 필요 - 회원가입 화면으로 이동 필요');
        return {
          success: true,
          data: {
            ...v_9390e8.data,
            isSignupCompleted: false,
          },
        };
      }

      if (!v_3393e3.ok || !v_9390e8.success) {
        console.error('[구글 로그인] 백엔드 API 실패:', v_9390e8);
        return {
          success: false,
          code: v_9390e8.code || 'AUTH_FAILED',
          message: v_9390e8.message || '인증에 실패했습니다.',
        };
      }

      console.log('[구글 로그인] 백엔드 API 성공:', {
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

        console.error('[구글 로그인] API 타임아웃');
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
    console.error('[구글 로그인] 에러:', v_5e9bfe);

    if (v_5e9bfe.code === v_8d3720.SIGN_IN_CANCELLED) {
      return {
        success: false,
        code: 'USER_CANCELLED',
        message: '사용자가 로그인을 취소했습니다.',
      };
    } else if (v_5e9bfe.code === v_8d3720.IN_PROGRESS) {
      return {
        success: false,
        code: 'IN_PROGRESS',
        message: '이미 로그인 진행 중입니다.',
      };
    } else if (v_5e9bfe.code === v_8d3720.PLAY_SERVICES_NOT_AVAILABLE) {
      return {
        success: false,
        code: 'PLAY_SERVICES_NOT_AVAILABLE',
        message: 'Google Play Services를 사용할 수 없습니다.',
      };
    }

    return {
      success: false,
      code: 'UNKNOWN_ERROR',
      message: v_5e9bfe.message || '알 수 없는 오류가 발생했습니다.',
    };
  }
}
