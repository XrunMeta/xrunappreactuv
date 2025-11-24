
import axios, { AxiosError } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import { ROUTES } from '../navigation';
import {
  AliveResponse,
  EmailCheckRequest,
  EmailCheckResponse,
  ReferralCheckRequest,
  ReferralCheckResponse,
  SignupRequest,
  SignupResponse,
  LoginCheckRequest,
  LoginCheckResponse,
  EmailPasswordLoginRequest,
  PasswordOnlyLoginRequest,
  MobileLoginRequest,
  LoginResponse,
  PhoneVerificationRequest,
  PhoneVerificationResponse,
  PhoneVerificationCodeRequest,
  PhoneVerificationCodeResponse,
  EmailVerificationRequest,
  EmailVerificationResponse,
  EmailVerificationCodeRequest,
  EmailVerificationCodeResponse,
  EmailAuthLoginRequest,
  EmailAuthLoginResponse,
  SaveSessionRequest,
  SaveSessionResponse,
  GetUserInfoRequest,
  GetUserInfoResponse,
  GetMyPageUserInfoRequest,
  GetMyPageUserInfoResponse,
  UpdateNameRequest,
  UpdateNameResponse,
  UpdatePhoneRequest,
  UpdatePhoneResponse,
  UpdateLastNameRequest,
  UpdateLastNameResponse,
  UpdateGenderRequest,
  UpdateGenderResponse,
  UpdateAgeRequest,
  UpdateAgeResponse,
  GetRegionsByCountryRequest,
  GetRegionsByCountryResponse,
  UpdateRegionRequest,
  UpdateRegionResponse,
  GetCountriesResponse,
  LogoutRequest,
  LogoutResponse,
} from '../types';
import * as CryptoJS from 'crypto-js';
import { getEnv } from '../utils/env';

const API_TIMEOUT = 20000;

const handleTimeoutError = async (navigation?: any) => {
  try {
    const isLoggedIn = await AsyncStorage.getItem('isLoggedIn');
    if (navigation) {
      if (isLoggedIn === 'true') {

        navigation.reset({
          index: 0,
          routes: [{ name: ROUTES.map }],
        });
      } else {

        navigation.reset({
          index: 0,
          routes: [{ name: ROUTES.login }],
        });
      }
    }
  } catch (error) {
    console.error('타임아웃 처리 중 오류:', error);
    if (navigation) {

      navigation.reset({
        index: 0,
        routes: [{ name: ROUTES.login }],
      });
    }
  }
};

export const apiRequest = async (
  url: string,
  options: RequestInit = {},
  navigation?: any,
): Promise<Response> => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof Error && error.name === 'AbortError') {

      if (navigation) {
        await handleTimeoutError(navigation);
      }
      throw new Error('API request timeout');
    }
    throw error;
  }
};

export const gatewayRequest = async (
  endpoint: string,
  options: RequestInit = {},
  navigation?: any,
): Promise<Response> => {
  const env = getEnv();
  const authCode = env.GATEWAY_AUTH_CODE;
  const gatewayUrl = `${env.GATEWAY}${authCode}&endpoint=${endpoint}`;

  return apiRequest(gatewayUrl, options, navigation);
};

export const nodeGatewayRequest = async (
  endpoint: string,
  options: RequestInit = {},
  navigation?: any,
): Promise<Response> => {
  const env = getEnv();
  const baseUrl = env.GATEWAY_NODEJS;
  const url = endpoint.startsWith('/') 
    ? `${baseUrl}${endpoint}` 
    : `${baseUrl}/${endpoint}`;

  return apiRequest(url, options, navigation);
};

export const sendAliveSignal = async (
  navigation?: any,
): Promise<AliveResponse> => {

  return Promise.resolve({
    success: true,
    emergencyStop: {
      enabled: false , 
      message: '긴급 안내: 시스템 점검 중입니다. 잠시 후 다시 시도해주세요.',
      link: 'https://example.com/emergency-notice', 
    },
  });

};

const createAxiosInstance = (navigation?: any) => {
  const env = getEnv();
  const baseURL = env.GATEWAY_NODEJS;
  const authCode = env.GATEWAY_AUTH_CODE;

  const instance = axios.create({
    baseURL,
    timeout: API_TIMEOUT,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${authCode}`,
    },
  });

  instance.interceptors.request.use(
    (config) => {
      console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`);
      return config;
    },
    (error) => {
      console.error('[API Request Error]', error);
      return Promise.reject(error);
    },
  );

  instance.interceptors.response.use(
    (response) => {
      console.log(`[API Response] ${response.config.url}`, response.status);
      return response;
    },
    async (error: AxiosError) => {

      if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
        console.error('[API Timeout]', error.config?.url);
        if (navigation) {
          await handleTimeoutError(navigation);
        }
      } else {

        console.error('[API Error]', {
          url: error.config?.url,
          method: error.config?.method,
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
          message: error.message,
        });
      }
      return Promise.reject(error);
    },
  );

  return instance;
};

export const checkEmailAvailability = async (
  email: string,
  navigation?: any,
): Promise<boolean> => {
  try {
    const axiosInstance = createAxiosInstance(navigation);
    const request: EmailCheckRequest = { email };

    console.log('[회원가입 1단계] 이메일 중복 확인 요청:', email);

    const response = await axiosInstance.post<EmailCheckResponse>(
      '/login-checker-email',
      request,
    );

    const result = response.data.data[0]?.value === 'OK';
    console.log('[회원가입 1단계] 이메일 중복 확인 결과:', result ? '사용 가능' : '중복');

    return result;
  } catch (error) {
    console.error('[회원가입 1단계] 이메일 중복 확인 실패:', error);
    throw error;
  }
};

export const checkReferralEmail = async (
  referralEmail: string,
  navigation?: any,
): Promise<number | null> => {
  try {
    const axiosInstance = createAxiosInstance(navigation);
    const request: ReferralCheckRequest = { email: referralEmail };

    console.log('[회원가입 2단계] 추천인 이메일 확인 요청:', referralEmail);

    const response = await axiosInstance.post<ReferralCheckResponse>(
      '/ap1810-i01',
      request,
    );

    const result = response.data.data[0];
    if (result?.result === true && result.member) {
      console.log('[회원가입 2단계] 추천인 확인 성공, member ID:', result.member);
      return result.member;
    } else {
      console.log('[회원가입 2단계] 추천인 확인 실패: 유효하지 않은 이메일');
      return null;
    }
  } catch (error) {
    console.error('[회원가입 2단계] 추천인 이메일 확인 실패:', error);
    throw error;
  }
};

export const signup = async (
  signupData: SignupRequest,
  navigation?: any,
): Promise<boolean> => {
  try {
    const axiosInstance = createAxiosInstance(navigation);

    console.log('[회원가입 3단계] 회원가입 실행 요청:', {
      email: signupData.email,
      firstname: signupData.firstname,
      lastname: signupData.lastname,
      gender: signupData.gender,
      age: signupData.age,
      os: signupData.os,
    });

    const response = await axiosInstance.post<SignupResponse>(
      '/login-06-joinAndAccount',
      signupData,
    );

    const result = response.data.data[0]?.text === 'ok';
    console.log('[회원가입 3단계] 회원가입 결과:', result ? '성공' : '실패');

    return result;
  } catch (error) {
    console.error('[회원가입 3단계] 회원가입 실행 실패:', error);
    throw error;
  }
};

export const checkLogin = async (
  email: string,
  pin: string,
  navigation?: any,
): Promise<boolean> => {
  try {
    const axiosInstance = createAxiosInstance(navigation);
    const request: LoginCheckRequest = { email, pin };

    console.log('[회원가입 4단계] 로그인 확인 요청:', email);

    const response = await axiosInstance.post<LoginCheckResponse>(
      '/login-checker',
      request,
    );

    const result = response.data.data[0]?.value === 'OK';
    console.log('[회원가입 4단계] 로그인 확인 결과:', result ? '성공' : '실패');

    return result;
  } catch (error) {
    console.error('[회원가입 4단계] 로그인 확인 실패:', error);
    throw error;
  }
};

export const SignupHelpers = {

  getGenderCode: (gender: 'male' | 'female'): number => {
    return gender === 'male' ? 2110 : 2111;
  },

  getAgeCode: (ageRange: '10' | '20' | '30' | '40' | '50+'): number => {
    const ageMap: Record<string, number> = {
      '10': 2210,
      '20': 2220,
      '30': 2230,
      '40': 2240,
      '50+': 2250,
    };
    return ageMap[ageRange] || 2220;
  },

  getOSCode: (): number => {
    return Platform.OS === 'android' ? 3112 : 3113;
  },
};

export const encryptSHA256 = (text: string): string => {
  return CryptoJS.SHA256(text).toString();
};

export const loginWithEmailPassword = async (
  email: string,
  pin: string,
  navigation?: any,
): Promise<LoginResponse> => {
  try {
    const axiosInstance = createAxiosInstance(navigation);
    const request: EmailPasswordLoginRequest = {
      type: 4,
      email,
      pin,
    };

    console.log('[로그인] 이메일/비밀번호 로그인 요청:', email);

    const response = await axiosInstance.post<LoginResponse>(
      '/login-01',
      request,
    );

    if (response.data.status === 'success') {
      console.log('[로그인] 이메일/비밀번호 로그인 성공');
    } else {
      console.error('[로그인] 이메일/비밀번호 로그인 실패:', response.data);
    }

    return response.data;
  } catch (error) {
    console.error('[로그인] 이메일/비밀번호 로그인 오류:', error);
    if (error instanceof AxiosError) {
      console.error('[로그인] 상세 오류 정보:', {
        url: error.config?.url,
        method: error.config?.method,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message,
      });
    }
    throw error;
  }
};

export const loginWithPassword = async (
  pin: string,
  mobile: string,
  navigation?: any,
): Promise<LoginResponse> => {
  try {
    const axiosInstance = createAxiosInstance(navigation);
    const request: PasswordOnlyLoginRequest = {
      type: 3,
      pin,
      mobile,
    };

    console.log('[로그인] 비밀번호 로그인 요청:', mobile);

    const response = await axiosInstance.post<LoginResponse>(
      '/login-01',
      request,
    );

    if (response.data.status === 'success') {
      console.log('[로그인] 비밀번호 로그인 성공');
    } else {
      console.error('[로그인] 비밀번호 로그인 실패:', response.data);
    }

    return response.data;
  } catch (error) {
    console.error('[로그인] 비밀번호 로그인 오류:', error);
    if (error instanceof AxiosError) {
      console.error('[로그인] 상세 오류 정보:', {
        url: error.config?.url,
        method: error.config?.method,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message,
      });
    }
    throw error;
  }
};

export const sendPhoneVerificationCode = async (
  country: string,
  mobile: string,
  navigation?: any,
): Promise<boolean> => {
  try {
    const axiosInstance = createAxiosInstance(navigation);
    const request: PhoneVerificationRequest = {
      country,
      mobile,
    };

    console.log('[로그인] 전화번호 인증 코드 발송 요청:', mobile);

    const response = await axiosInstance.post<PhoneVerificationResponse>(
      '/login-02',
      request,
    );

    const result = response.data.data[0]?.status === true;
    console.log('[로그인] 전화번호 인증 코드 발송 결과:', result ? '성공' : '실패');

    return result;
  } catch (error) {
    console.error('[로그인] 전화번호 인증 코드 발송 오류:', error);
    if (error instanceof AxiosError) {
      console.error('[로그인] 상세 오류 정보:', {
        url: error.config?.url,
        method: error.config?.method,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message,
      });
    }
    throw error;
  }
};

export const verifyPhoneCode = async (
  mobile: string,
  code: string,
  navigation?: any,
): Promise<boolean> => {
  try {
    const axiosInstance = createAxiosInstance(navigation);
    const request: PhoneVerificationCodeRequest = {
      mobile,
      code,
    };

    console.log('[로그인] 전화번호 인증 코드 확인 요청:', mobile);

    const response = await axiosInstance.post<PhoneVerificationCodeResponse>(
      '/login-03',
      request,
    );

    const result = response.data.data === 'login';
    console.log('[로그인] 전화번호 인증 코드 확인 결과:', result ? '로그인 가능' : '인증 실패');

    return result;
  } catch (error) {
    console.error('[로그인] 전화번호 인증 코드 확인 오류:', error);
    if (error instanceof AxiosError) {
      console.error('[로그인] 상세 오류 정보:', {
        url: error.config?.url,
        method: error.config?.method,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message,
      });
    }
    throw error;
  }
};

export const loginWithMobile = async (
  mobile: string,
  navigation?: any,
): Promise<LoginResponse> => {
  try {
    const axiosInstance = createAxiosInstance(navigation);
    const request: MobileLoginRequest = {
      type: 2,
      mobile,
    };

    console.log('[로그인] 전화번호 로그인 요청:', mobile);

    const response = await axiosInstance.post<LoginResponse>(
      '/login-01',
      request,
    );

    if (response.data.status === 'success') {
      console.log('[로그인] 전화번호 로그인 성공');
    } else {
      console.error('[로그인] 전화번호 로그인 실패:', response.data);
    }

    return response.data;
  } catch (error) {
    console.error('[로그인] 전화번호 로그인 오류:', error);
    if (error instanceof AxiosError) {
      console.error('[로그인] 상세 오류 정보:', {
        url: error.config?.url,
        method: error.config?.method,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message,
      });
    }
    throw error;
  }
};

export const sendEmailVerificationCode = async (
  email: string,
  navigation?: any,
): Promise<boolean> => {
  try {
    const axiosInstance = createAxiosInstance(navigation);
    const request: EmailVerificationRequest = {
      email,
    };

    console.log('[로그인] 이메일 인증 코드 발송 요청:', email);

    const response = await axiosInstance.post<EmailVerificationResponse>(
      '/check-02-email',
      request,
    );

    const status = response.data.data[0]?.status;
    const result = status === true || status === 'true';
    console.log('[로그인] 이메일 인증 코드 발송 결과:', result ? '성공' : '실패', { status });

    return result;
  } catch (error) {
    console.error('[로그인] 이메일 인증 코드 발송 오류:', error);
    if (error instanceof AxiosError) {
      console.error('[로그인] 상세 오류 정보:', {
        url: error.config?.url,
        method: error.config?.method,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message,
      });
    }
    throw error;
  }
};

export const verifyEmailCode = async (
  email: string,
  code: string,
  navigation?: any,
): Promise<boolean> => {
  try {
    const axiosInstance = createAxiosInstance(navigation);
    const request: EmailVerificationCodeRequest = {
      email,
      code,
    };

    console.log('[로그인] 이메일 인증 코드 확인 요청:', email);

    const response = await axiosInstance.post<EmailVerificationCodeResponse>(
      '/login-03-email',
      request,
    );

    const result = response.data.status === 'success';
    console.log('[로그인] 이메일 인증 코드 확인 결과:', result ? '성공' : '실패');

    return result;
  } catch (error) {
    console.error('[로그인] 이메일 인증 코드 확인 오류:', error);
    if (error instanceof AxiosError) {
      console.error('[로그인] 상세 오류 정보:', {
        url: error.config?.url,
        method: error.config?.method,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message,
      });
    }
    throw error;
  }
};

export const loginWithEmailAuth = async (
  email: string,
  navigation?: any,
): Promise<EmailAuthLoginResponse> => {
  try {
    const axiosInstance = createAxiosInstance(navigation);
    const request: EmailAuthLoginRequest = {
      email,
    };

    console.log('[로그인] 이메일 인증 로그인 요청:', email);

    const response = await axiosInstance.post<EmailAuthLoginResponse>(
      '/login-04-email',
      request,
    );

    if (response.data.status === 'success') {
      console.log('[로그인] 이메일 인증 로그인 성공');
    } else {
      console.error('[로그인] 이메일 인증 로그인 실패:', response.data);
    }

    return response.data;
  } catch (error) {
    console.error('[로그인] 이메일 인증 로그인 오류:', error);
    if (error instanceof AxiosError) {
      console.error('[로그인] 상세 오류 정보:', {
        url: error.config?.url,
        method: error.config?.method,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message,
      });
    }
    throw error;
  }
};

export const saveSession = async (
  member: number,
  ssidw: string,
  navigation?: any,
): Promise<boolean> => {
  try {
    const axiosInstance = createAxiosInstance(navigation);
    const request: SaveSessionRequest = {
      member,
      ssidw,
    };

    console.log('[로그인] 세션 저장 요청:', member);

    const response = await axiosInstance.post<SaveSessionResponse>(
      '/saveSsidw',
      request,
    );

    const result = response.data.data[0]?.affectedRows === 1;
    console.log('[로그인] 세션 저장 결과:', result ? '성공' : '실패');

    return result;
  } catch (error) {
    console.error('[로그인] 세션 저장 오류:', error);
    if (error instanceof AxiosError) {
      console.error('[로그인] 상세 오류 정보:', {
        url: error.config?.url,
        method: error.config?.method,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message,
      });
    }
    throw error;
  }
};

export const getUserInfo = async (
  member: number,
  navigation?: any,
): Promise<GetUserInfoResponse> => {
  try {
    const axiosInstance = createAxiosInstance(navigation);
    const request: GetUserInfoRequest = {
      member,
    };

    console.log('[로그인] 사용자 정보 조회 요청:', member);

    const response = await axiosInstance.get<GetUserInfoResponse>(
      '/app7000-01',
      {
        params: request,
      },
    );

    console.log('[로그인] 사용자 정보 조회 성공');

    return response.data;
  } catch (error) {
    console.error('[로그인] 사용자 정보 조회 오류:', error);
    if (error instanceof AxiosError) {
      console.error('[로그인] 상세 오류 정보:', {
        url: error.config?.url,
        method: error.config?.method,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message,
      });
    }
    throw error;
  }
};

export const getMyPageUserInfo = async (
  member: number,
  navigation?: any,
): Promise<GetMyPageUserInfoResponse> => {
  try {
    const axiosInstance = createAxiosInstance(navigation);
    const request: GetMyPageUserInfoRequest = {
      member,
    };

    console.log('[마이페이지] 사용자 정보 조회 요청:', member);

    const response = await axiosInstance.post<GetMyPageUserInfoResponse>(
      '/app7110-01',
      request,
    );

    console.log('[마이페이지] 사용자 정보 조회 성공');

    return response.data;
  } catch (error) {
    console.error('[마이페이지] 사용자 정보 조회 오류:', error);
    if (error instanceof AxiosError) {
      console.error('[마이페이지] 상세 오류 정보:', {
        url: error.config?.url,
        method: error.config?.method,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message,
      });
    }
    throw error;
  }
};

export const updateName = async (
  member: number,
  firstname: string,
  navigation?: any,
): Promise<UpdateNameResponse> => {
  try {
    const axiosInstance = createAxiosInstance(navigation);
    const request: UpdateNameRequest = {
      member,
      firstname,
    };

    console.log('[마이페이지] 이름 수정 요청:', { member, firstname });

    const response = await axiosInstance.post<UpdateNameResponse>(
      '/app7120-01',
      request,
    );

    console.log('[마이페이지] 이름 수정 성공');

    return response.data;
  } catch (error) {
    console.error('[마이페이지] 이름 수정 오류:', error);
    if (error instanceof AxiosError) {
      console.error('[마이페이지] 상세 오류 정보:', {
        url: error.config?.url,
        method: error.config?.method,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message,
      });
    }
    throw error;
  }
};

export const updateLastName = async (
  member: number,
  lastname: string,
  navigation?: any,
): Promise<UpdateLastNameResponse> => {
  try {
    const axiosInstance = createAxiosInstance(navigation);
    const request: UpdateLastNameRequest = {
      member,
      lastname,
    };

    console.log('[마이페이지] 성 수정 요청:', { member, lastname });

    const response = await axiosInstance.post<UpdateLastNameResponse>(
      '/app7130-01',
      request,
    );

    console.log('[마이페이지] 성 수정 성공');

    return response.data;
  } catch (error) {
    console.error('[마이페이지] 성 수정 오류:', error);
    if (error instanceof AxiosError) {
      console.error('[마이페이지] 상세 오류 정보:', {
        url: error.config?.url,
        method: error.config?.method,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message,
      });
    }
    throw error;
  }
};

export const updatePhone = async (
  member: number,
  mobile: string,
  mobilecode: number,
  navigation?: any,
): Promise<UpdatePhoneResponse> => {
  try {
    const axiosInstance = createAxiosInstance(navigation);
    const request: UpdatePhoneRequest = {
      member,
      mobile,
      mobilecode,
    };

    console.log('[전화번호수정] 전화번호 수정 요청:', { member, mobile, mobilecode });

    const response = await axiosInstance.post<UpdatePhoneResponse>(
      '/app7153-03',
      request,
    );

    console.log('[전화번호수정] 전화번호 수정 성공:', response.data);

    return response.data;
  } catch (error) {
    console.error('[전화번호수정] 전화번호 수정 오류:', error);
    if (error instanceof AxiosError) {
      console.error('[전화번호수정] 상세 오류 정보:', {
        url: error.config?.url,
        method: error.config?.method,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message,
      });
    }
    throw error;
  }
};

export const updateGender = async (
  member: number,
  gender: number,
  navigation?: any,
): Promise<UpdateGenderResponse> => {
  try {
    const axiosInstance = createAxiosInstance(navigation);
    const request: UpdateGenderRequest = {
      member,
      gender,
    };

    console.log('[마이페이지] 성별 수정 요청:', { member, gender });

    const response = await axiosInstance.post<UpdateGenderResponse>(
      '/app7180-01',
      request,
    );

    console.log('[마이페이지] 성별 수정 성공');

    return response.data;
  } catch (error) {
    console.error('[마이페이지] 성별 수정 오류:', error);
    if (error instanceof AxiosError) {
      console.error('[마이페이지] 상세 오류 정보:', {
        url: error.config?.url,
        method: error.config?.method,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message,
      });
    }
    throw error;
  }
};

export const updateAge = async (
  member: number,
  ages: number,
  navigation?: any,
): Promise<UpdateAgeResponse> => {
  try {
    const axiosInstance = createAxiosInstance(navigation);
    const request: UpdateAgeRequest = {
      member,
      ages,
    };

    console.log('[마이페이지] 나이 수정 요청:', { member, ages });

    const response = await axiosInstance.post<UpdateAgeResponse>(
      '/app7170-01',
      request,
    );

    console.log('[마이페이지] 나이 수정 성공');

    return response.data;
  } catch (error) {
    console.error('[마이페이지] 나이 수정 오류:', error);
    if (error instanceof AxiosError) {
      console.error('[마이페이지] 상세 오류 정보:', {
        url: error.config?.url,
        method: error.config?.method,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message,
      });
    }
    throw error;
  }
};

export const getCountries = async (
  navigation?: any,
): Promise<GetCountriesResponse> => {
  try {
    const axiosInstance = createAxiosInstance(navigation);

    console.log('[마이페이지] 국가 목록 조회 요청');

    const response = await axiosInstance.get<GetCountriesResponse>('/countries');

    console.log('[마이페이지] 국가 목록 조회 성공');

    return response.data;
  } catch (error) {
    console.error('[마이페이지] 국가 목록 조회 오류:', error);
    if (error instanceof AxiosError) {
      console.error('[마이페이지] 상세 오류 정보:', {
        url: error.config?.url,
        method: error.config?.method,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message,
      });
    }
    throw error;
  }
};

export const getRegionsByCountry = async (
  country: number,
  navigation?: any,
): Promise<GetRegionsByCountryResponse> => {
  try {
    const axiosInstance = createAxiosInstance(navigation);
    const request: GetRegionsByCountryRequest = {
      country,
    };

    console.log('[마이페이지] 지역 목록 조회 요청:', { country });

    const response = await axiosInstance.post<GetRegionsByCountryResponse>(
      '/app7190-01',
      request,
    );

    console.log('[마이페이지] 지역 목록 조회 성공');

    return response.data;
  } catch (error) {
    console.error('[마이페이지] 지역 목록 조회 오류:', error);
    if (error instanceof AxiosError) {
      console.error('[마이페이지] 상세 오류 정보:', {
        url: error.config?.url,
        method: error.config?.method,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message,
      });
    }
    throw error;
  }
};

export const updateRegion = async (
  member: number,
  country: number,
  region: number,
  navigation?: any,
): Promise<UpdateRegionResponse> => {
  try {

    if (country === undefined || country === null) {
      throw new Error('국가 코드가 유효하지 않습니다.');
    }
    if (region === undefined || region === null) {
      throw new Error('지역 코드가 유효하지 않습니다.');
    }

    const axiosInstance = createAxiosInstance(navigation);
    const request: UpdateRegionRequest = {
      member,
      country,
      region,
    };

    console.log('[마이페이지] 지역 수정 요청:', { member, country, region });

    const response = await axiosInstance.post<UpdateRegionResponse>(
      '/app7190-02',
      request,
    );

    console.log('[마이페이지] 지역 수정 성공');

    return response.data;
  } catch (error) {
    console.error('[마이페이지] 지역 수정 오류:', error);
    if (error instanceof AxiosError) {
      console.error('[마이페이지] 상세 오류 정보:', {
        url: error.config?.url,
        method: error.config?.method,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message,
      });
    }
    throw error;
  }
};

export const logout = async (
  member: number,
  navigation?: any,
): Promise<LogoutResponse> => {
  try {
    const env = getEnv();
    const authCode = env.GATEWAY_AUTH_CODE;
    const baseUrl = env.GATEWAY_NODEJS;
    const url = `${baseUrl}/logout-9705`;

    console.log('[로그아웃] 로그아웃 요청:', { member });

    const response = await nodeGatewayRequest(
      '/logout-9705',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authCode}`,
        },
        body: JSON.stringify({
          member,
        } as LogoutRequest),
      },
      navigation,
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: LogoutResponse = await response.json();
    console.log('[로그아웃] 로그아웃 성공');

    return data;
  } catch (error) {
    console.error('[로그아웃] 로그아웃 오류:', error);
    if (error instanceof Error && error.message === 'API request timeout') {

      throw error;
    }
    throw error;
  }
};

