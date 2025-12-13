

import { Platform } from 'react-native';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import { getEnv } from '../utils/env';
import { ROUTES } from '../navigation';
import AsyncStorage from '@react-native-async-storage/async-storage';

const GOOGLE_WEB_CLIENT_ID = 'oth-client.googleusercontent.invalid';
const GOOGLE_IOS_CLIENT_ID = 'oth-client.googleusercontent.invalid';

const API_TIMEOUT = 20000;

export const initGoogleSignIn = () => {
  try {
    if (Platform.OS === 'ios') {
      GoogleSignin.configure({
        iosClientId: GOOGLE_IOS_CLIENT_ID,
        webClientId: GOOGLE_WEB_CLIENT_ID,
        offlineAccess: true, 
      });
    } else {

      GoogleSignin.configure({
        webClientId: GOOGLE_WEB_CLIENT_ID,
        offlineAccess: true, 
      });
    }
    console.log('[구글 로그인] GoogleSignin 초기화 완료');
  } catch (error) {
    console.error('[구글 로그인] 초기화 실패:', error);
  }
};

const handleTimeoutError = async (navigation: any) => {
  try {
    if (!navigation || typeof navigation.reset !== 'function') {
      console.log('[구글 로그인] 타임아웃 처리 스킵: navigation 또는 reset 함수가 없음');
      return;
    }

    const isLoggedIn = await AsyncStorage.getItem('isLoggedIn');
    if (isLoggedIn === 'true') {
      navigation.reset(ROUTES.map);
    } else {
      navigation.reset(ROUTES.login);
    }
  } catch (error) {
    console.error('[구글 로그인] 타임아웃 처리 중 오류:', error);
    if (navigation && typeof navigation.reset === 'function') {
      try {
        navigation.reset(ROUTES.login);
      } catch (resetError) {
        console.error('[구글 로그인] navigation.reset 호출 실패:', resetError);
      }
    }
  }
};

const getApiBaseUrl = (): string => {
  const env = getEnv();
  const baseUrl = env.GATEWAY_NODEJS;

  if (baseUrl.endsWith('/oth-path')) {
    return baseUrl.replace('/oth-path', '');
  }
  return baseUrl;
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
    requiresLinking?: boolean; 
    confirmationToken?: string; 
  };
  code?: string;
  message?: string;
}

export async function signInWithGoogle(navigation?: any): Promise<GoogleAuthResult> {
  try {
    console.log('[구글 로그인] 구글 로그인 시작');

    if (Platform.OS === 'android') {
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
    }

    await GoogleSignin.signOut(); 
    const userInfo = await GoogleSignin.signIn();

    console.log('[구글 로그인] Google 로그인 성공:', {
      id: userInfo.data?.user.id,
      email: userInfo.data?.user.email,
      name: userInfo.data?.user.name,
    });

    const idToken = userInfo.data?.idToken;
    if (!idToken) {
      return {
        success: false,
        code: 'ID_TOKEN_MISSING',
        message: 'ID 토큰을 받지 못했습니다.',
      };
    }

    console.log('[구글 로그인] ID Token 획득, 백엔드 API 호출');
    console.log('[구글 로그인] ID Token 확인:', {
      hasToken: !!idToken,
      tokenLength: idToken.length,
      tokenPreview: `${idToken.substring(0, 30)}...`,
    });

    const apiBaseUrl = getApiBaseUrl();
    const apiUrl = `${apiBaseUrl}/oth-path`;

    console.log('[구글 로그인] 백엔드 API URL:', apiUrl);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          idToken: idToken,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      const responseText = await response.text();
      console.log('[구글 로그인] 백엔드 응답 본문:', responseText);

      let data: any;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error('[구글 로그인] 응답 파싱 오류:', parseError);
        return {
          success: false,
          code: 'PARSE_ERROR',
          message: '서버 응답을 파싱할 수 없습니다.',
        };
      }

      const requiresSignup = data.code === 200 && !data.success && (data.data?.requiresSignup === true || data.data?.isSignupCompleted === false);

      if (requiresSignup) {
        console.log('[구글 로그인] 회원가입 필요 - 회원가입 화면으로 이동 필요');
        return {
          success: true,
          data: {
            ...data.data,
            isSignupCompleted: false,
          },
        };
      }

      if (data.code === 216) {
        console.log('[구글 로그인] 계정 연동 필요 - 연동 팝업 표시 필요');
        return {
          success: true,
          data: {
            ...data.data,
            requiresLinking: true,
            email: data.data?.email || '', 
            confirmationToken: data.data?.confirmationToken || '', 
          },
        };
      }

      if (!response.ok || !data.success) {
        console.error('[구글 로그인] 백엔드 API 실패:', data);
        return {
          success: false,
          code: data.code || 'AUTH_FAILED',
          message: data.message || '인증에 실패했습니다.',
        };
      }

      console.log('[구글 로그인] 백엔드 API 성공:', {
        success: data.success,
        isNewUser: data.data?.isNewUser,
        email: data.data?.email,
        isSignupCompleted: data.data?.isSignupCompleted,
      });

      return {
        success: true,
        data: data.data,
      };
    } catch (fetchError: any) {
      clearTimeout(timeoutId);
      if (fetchError instanceof Error && fetchError.name === 'AbortError') {

        console.error('[구글 로그인] API 타임아웃');
        if (navigation) {
          await handleTimeoutError(navigation);
        }
        return {
          success: false,
          code: 'TIMEOUT',
          message: '요청 시간이 초과되었습니다.',
        };
      }
      throw fetchError;
    }
  } catch (error: any) {
    console.error('[구글 로그인] 에러:', error);

    if (error.code === statusCodes.SIGN_IN_CANCELLED) {
      return {
        success: false,
        code: 'USER_CANCELLED',
        message: '사용자가 로그인을 취소했습니다.',
      };
    } else if (error.code === statusCodes.IN_PROGRESS) {
      return {
        success: false,
        code: 'IN_PROGRESS',
        message: '이미 로그인 진행 중입니다.',
      };
    } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
      return {
        success: false,
        code: 'PLAY_SERVICES_NOT_AVAILABLE',
        message: 'Google Play Services를 사용할 수 없습니다.',
      };
    }

    return {
      success: false,
      code: 'UNKNOWN_ERROR',
      message: error.message || '알 수 없는 오류가 발생했습니다.',
    };
  }
}
