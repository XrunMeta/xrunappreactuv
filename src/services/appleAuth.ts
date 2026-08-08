

import { Platform } from 'react-native';
import appleAuth from '@invertase/react-native-apple-authentication';
import axios, { AxiosError } from 'axios';
import { getEnv } from '../utils/env';
import { ROUTES } from '../navigation';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_TIMEOUT = 20000;

const handleTimeoutError = async (navigation: any) => {
  try {
    if (!navigation || typeof navigation.reset !== 'function') {
      console.log('[애플 로그인] 타임아웃 처리 스킵: navigation 또는 reset 함수가 없음');
      return;
    }

    const isLoggedIn = await AsyncStorage.getItem('isLoggedIn');
    if (isLoggedIn === 'true') {
      navigation.reset(ROUTES.map);
    } else {
      navigation.reset(ROUTES.login);
    }
  } catch (error) {
    console.error('[애플 로그인] 타임아웃 처리 중 오류:', error);
    if (navigation && typeof navigation.reset === 'function') {
      try {
        navigation.reset(ROUTES.login);
      } catch (resetError) {
        console.error('[애플 로그인] navigation.reset 호출 실패:', resetError);
      }
    }
  }
};

const getApiBaseUrl = (): string => {
  const env = getEnv();

  const baseUrl = env.GATEWAY_WORKERS;
  return baseUrl;
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

export async function signInWithApple(navigation?: any): Promise<AppleAuthResult> {
  try {

    if (Platform.OS !== 'ios') {
      return {
        success: false,
        code: 'PLATFORM_NOT_SUPPORTED',
        message: '애플 로그인은 iOS에서만 지원됩니다.',
      };
    }

    console.log('[애플 로그인] 애플 로그인 시작');

    const isAvailable = appleAuth.isSupported;
    console.log('[애플 로그인] Apple 로그인 가능 여부 확인:', isAvailable);
    if (!isAvailable) {
      return {
        success: false,
        code: 'NOT_SUPPORTED',
        message: '이 기기에서 애플 로그인을 사용할 수 없습니다.',
      };
    }

    const appleAuthRequestResponse = await appleAuth.performRequest({
      requestedOperation: appleAuth.Operation.LOGIN,
      requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
    });

    console.log('[애플 로그인] Apple 로그인 성공:', {
      user: appleAuthRequestResponse.user,
      email: appleAuthRequestResponse.email,
      fullName: appleAuthRequestResponse.fullName,
    });

    const identityToken = appleAuthRequestResponse.identityToken;
    if (!identityToken) {
      const i18n = require('i18next').default;
      return {
        success: false,
        code: 'IDENTITY_TOKEN_MISSING',
        message: i18n.t('screens.login.errors.identityTokenMissing') || 'Failed to receive Identity token. Please try again.',
      };
    }

    const email = appleAuthRequestResponse.email || '';
    const fullName = appleAuthRequestResponse.fullName;
    const name = fullName
      ? `${fullName.givenName || ''} ${fullName.familyName || ''}`.trim()
      : '';

    console.log('[애플 로그인] Identity Token 획득, 백엔드 API 호출');
    console.log('[애플 로그인] Identity Token 확인:', {
      hasToken: !!identityToken,
      tokenLength: identityToken.length,
      tokenPreview: `${identityToken.substring(0, 30)}...`,
    });

    const apiBaseUrl = getApiBaseUrl();

    const endpoint = '/oth-path';

      const env = getEnv(); 
    console.log('[애플 로그인] 백엔드 API baseURL:', apiBaseUrl);
    console.log('[애플 로그인] 백엔드 API endpoint:', endpoint);
    console.log('[애플 로그인] Authorization 헤더 전송:', {
      hasToken: !!identityToken,
      tokenLength: identityToken.length,
      headerFormat: `Bearer 99999`,
    });

    try {

      const axiosInstance = axios.create({
        baseURL: apiBaseUrl,
        timeout: API_TIMEOUT,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer 9999`,
        },
      });

      axiosInstance.interceptors.response.use(
        (response) => response,
        async (error: AxiosError) => {
          if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
            console.error('[애플 로그인] API 타임아웃');
            if (navigation) {
              await handleTimeoutError(navigation);
            }
          }
          return Promise.reject(error);
        },
      );

      axiosInstance.interceptors.request.use(
        (config) => {
          console.log('[애플 로그인] 실제 요청 URL:', `${config.baseURL}${config.url}`);
          console.log('[애플 로그인] 실제 요청 헤더:', config.headers);
          return config;
        },
        (error) => {
          return Promise.reject(error);
        },
      );

      console.log('[애플 로그인] Authorization 헤더:', `Bearer ${env.GATEWAY_AUTH_CODE}`);
      console.log('[애플 로그인] Body:', {
        identityToken: identityToken,
        email: email,
        name: name,
      });

      const { getDeviceId } = require('../utils/deviceIdentity');
      const device_id = await getDeviceId();

      const response = await axiosInstance.post(
        endpoint,
        {
          identityToken: identityToken, 
          email: email, 
          name: name, 
          device_id,
        },
        {
          headers: {
            Authorization: `Bearer ${env.GATEWAY_AUTH_CODE}`, 
          },
        },
      );

      console.log('[애플 로그인] 백엔드 응답:', response.data);

      const data = response.data;

      const requiresSignup = data.code === 200 && !data.success && (data.data?.requiresSignup === true || data.data?.isSignupCompleted === false);

      if (requiresSignup) {
        console.log('[애플 로그인] 회원가입 필요 - 회원가입 화면으로 이동 필요');
        return {
          success: true,
          data: {
            ...data.data,
            requiresSignup: true, 
            isSignupCompleted: false,
            fullName: fullName ? {
              givenName: fullName.givenName || '',
              familyName: fullName.familyName || '',
            } : undefined,
          },
        };
      }

      if (data.code === 216) {
        console.log('[애플 로그인] 계정 연동 필요 - 연동 팝업 표시 필요');
        return {
          success: true,
          data: {
            ...data.data,
            requiresLinking: true,
            email: data.data?.email || email, 
            confirmationToken: data.data?.confirmationToken || '', 
          },
        };
      }

      if (data.code === 417) {
        console.log('[애플 로그인] 회원가입 필요 (code 417) - 이메일 수정 불가능한 회원가입 화면으로 이동');
        return {
          success: true,
          data: {
            ...data.data,
            requiresSignup: true,
            email: data.data?.email || email, 
            isSignupCompleted: false,
            fullName: fullName ? {
              givenName: fullName.givenName || '',
              familyName: fullName.familyName || '',
            } : undefined,
          },
        };
      }

      if (!data.success) {
        console.error('[애플 로그인] 백엔드 API 실패:', data);
        return {
          success: false,
          code: data.code || 'AUTH_FAILED',
          message: data.message || '인증에 실패했습니다.',
        };
      }

      console.log('[애플 로그인] 백엔드 API 성공:', {
        success: data.success,
        isNewUser: data.data?.isNewUser,
        email: data.data?.email,
        isSignupCompleted: data.data?.isSignupCompleted,
      });

      return {
        success: true,
        data: { ...(data.data ?? {}), ...(typeof data.jwt === 'string' ? { jwt: data.jwt } : {}) },
      };
    } catch (fetchError: any) {

      if (axios.isAxiosError(fetchError)) {
        if (fetchError.code === 'ECONNABORTED' || fetchError.message.includes('timeout')) {

          console.error('[애플 로그인] API 타임아웃');
          return {
            success: false,
            code: 'TIMEOUT',
            message: '요청 시간이 초과되었습니다.',
          };
        }

        console.error('[애플 로그인] API 에러:', {
          message: fetchError.message,
          response: fetchError.response?.data,
          status: fetchError.response?.status,
        });
        return {
          success: false,
          code: fetchError.response?.data?.code || 'API_ERROR',
          message: fetchError.response?.data?.message || fetchError.message || 'API 요청 중 오류가 발생했습니다.',
        };
      }
      throw fetchError;
    }
  } catch (error: any) {
    console.error('[애플 로그인] 에러 상세:', {
      error,
      code: error.code,
      message: error.message,
      userInfo: error.userInfo,
      nativeError: error.nativeError,
      errorString: error.toString(),
      stack: error.stack,
    });

    if (error.code === 1000) {
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

    if (error.code === appleAuth.Error.CANCELED) {
      return {
        success: false,
        code: 'USER_CANCELLED',
        message: '사용자가 로그인을 취소했습니다.',
      };
    } else if (error.code === appleAuth.Error.NOT_HANDLED) {
      return {
        success: false,
        code: 'NOT_HANDLED',
        message: '애플 로그인 처리 중 오류가 발생했습니다.',
      };
    } else if (error.code === appleAuth.Error.INVALID_RESPONSE) {
      return {
        success: false,
        code: 'INVALID_RESPONSE',
        message: '애플 로그인 응답이 유효하지 않습니다.',
      };
    } else if (error.code === appleAuth.Error.NOT_AVAILABLE) {
      return {
        success: false,
        code: 'NOT_AVAILABLE',
        message: '애플 로그인을 사용할 수 없습니다.',
      };
    }

    return {
      success: false,
      code: 'UNKNOWN_ERROR',
      message: error.message || '알 수 없는 오류가 발생했습니다.',
    };
  }
}
