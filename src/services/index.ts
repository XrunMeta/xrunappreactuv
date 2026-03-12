
import axios, { AxiosError } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import { ROUTES } from '../navigation';
import { cashingimages } from '../utils/imageCache';
import { getEnv } from '../utils/env';
import { getPlayStoreUrl } from '../utils/playStoreUrl';

export * from './googleAuth';

export * from './appleAuth';

export * from './pangle';
export { sendPangleCallback } from './pangle';
export { logRewardedAdCompleted, getAppsFlyerAdNetworkFromCompany } from './appsflyer';
import {
  AliveResponse,
  KeepAliveServerResponse,
  EmailCheckRequest,
  EmailCheckResponse,
  ReferralCheckRequest,
  ReferralCheckResponse,
  EmailExistsRequest,
  EmailExistsResponse,
  SignupRequest,
  SignupResponse,
  LoginCheckRequest,
  LoginCheckResponse,
  EmailPasswordLoginRequest,
  PasswordOnlyLoginRequest,
  MobileLoginRequest,
  LoginResponse,
  ConnectGoogleAccountRequest,
  ConnectGoogleAccountResponse,
  GoogleAuthForWalletRequest,
  GoogleAuthForWalletResponse,
  CheckSocialForWalletRequest,
  CheckSocialForWalletResponse,
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
  CloseMembershipRequest,
  CloseMembershipResponse,
  UpdatePasswordRequest,
  UpdatePasswordResponse,
  SpotData,
  NotificationItem,
  NotificationListRequest,
  NotificationListResponse,
  NotificationSendRequest,
  NotificationSendResponse,
  NotificationDeleteRequest,
  NotificationDeleteResponse,
  NotificationDeleteAllRequest,
  NotificationDeleteAllResponse,
  FCMTokenRegisterRequest,
  FCMTokenRegisterResponse,
  RegisterReferralByEmailRequest,
  RegisterReferralByEmailResponse,
  GetRandomReferralListResponse,
  RegisterRandomReferralRequest,
  RegisterRandomReferralResponse,
  SaveReferralRequest,
  SaveReferralResponse,
  GetMyReferralRequest,
  GetMyReferralResponse,
  GetRecommendedToMeRequest,
  GetRecommendedToMeResponse,
  GetMemberByEmailRequest,
  GetMemberByEmailResponse,
  GetUserInfoForReferralRequest,
  GetUserInfoForReferralResponse,
  NasmobAdsResponse,
  NasmobCallbackRequest,
  PockAdsResponse,
  DeviceInfo,
  SettlementListRequest,
  SettlementListResponse,
  GetCompletedAdsRequest,
  GetCompletedAdsResponse,
  GetSavedAdsRequest,
  GetSavedAdsResponse,
  GetSettlementListRequest,
  GetSettlementListResponse,
  GetSettlementCompletedListResponse,
  SettlementCompletedItem,
  GetSettlementAmountRequest,
  GetSettlementAmountResponse,
  GetRankRequest,
  GetRankResponse,
  GetRankSpesificRequest,
  WalletData,
  WalletDataResponse,
  OtherChainsStatusResponse,
  ADXRUNTopBannersResponse,
  ADXRUNEstimateListResponse,
  ADXRUNResultListResponse,
  ADXRUNTopBannersSettledResponse,
  QuestListResponse,
  QuestItem,
  QuestCheckUserRequest,
  QuestCheckUserResponse,
  QuestJoinRequest,
  QuestJoinResponse,
  TransactionHistoryResponse,
  TransactionHistoryItem,
  TokenBalanceResponse,
  ERC20TokenCheckResponse,
  GetRankSpesificResponse,
  GetMyGroupRequest,
  GetMyGroupResponse,
  GetMyRecommenderRequest,
  GetMyRecommenderResponse,
  CheckCanSetRecommenderRequest,
  CheckCanSetRecommenderResponse,
  SetRecommenderRequest,
  SetRecommenderResponse,
  GetXRUNGopaxPriceRequest,
  GetXRUNGopaxPriceResponse,
  CreateItemFromAppRequest,
  CreateItemFromAppResponse,
  GetUserBalanceRequest,
  GetUserBalanceResponse,
  GetXrunBuyableItemsRequest,
  GetXrunBuyableItemsResponse,
  GetXrunPurchasedItemsRequest,
  GetXrunPurchasedItemsResponse,
  GetMyGiftishowCouponsResponse,
  MyGiftishowCouponItem,
  PurchaseGiftWithXplayPointsRequest,
  PurchaseGiftWithXplayPointsResponse,
  PurchaseXrunItemRequest,
  PurchaseXrunItemResponse,
  SaveInappPurchaseLogRequest,
  SaveInappPurchaseLogResponse,
  DeleteXrunPurchasedItemRequest,
  DeleteXrunPurchasedItemResponse,
  InAppPurchaseRequest,
  InAppPurchaseResponse,
  AgreementResponse,
  AgreementData,
  AgreementType,
  GetItemInfoRequest,
  GetItemInfoResponse,
  DeleteShopItemRequest,
  DeleteShopItemResponse,
} from '../types';
import * as CryptoJS from 'crypto-js';
import { checkLatestVersion, getCurrentAppVersion, getCurrentAppVersionNumber } from './versionCheck';

const API_TIMEOUT = 20000;

const handleTimeoutError = async (navigation?: any) => {
  try {

    if (!navigation || typeof navigation.reset !== 'function') {
      console.log('타임아웃 처리 스킵: navigation 또는 reset 함수가 없음');
      return;
    }

    const isLoggedIn = await AsyncStorage.getItem('isLoggedIn');
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
  } catch (error) {
    console.error('타임아웃 처리 중 오류:', error);

    if (navigation && typeof navigation.reset === 'function') {
      try {

        navigation.reset({
          index: 0,
          routes: [{ name: ROUTES.login }],
        });
      } catch (resetError) {
        console.error('navigation.reset 호출 실패:', resetError);
      }
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
  try {
    const env = getEnv();
    const authCode = env.GATEWAY_AUTH_CODE;

    const response = await nodeGatewayRequest('/keepalive', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authCode}`,
      },
    }, navigation);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const serverResponse: KeepAliveServerResponse = await response.json();

    if (serverResponse.status === 'success') {
      const result: AliveResponse = {
        success: true,
      };
      console.log('[KeepAlive] [App] 서버 응답:', serverResponse);

      if (serverResponse.data.server_status === 'health') {

        result.emergencyStop = {
          enabled: false,
        };
      } else if (serverResponse.data.emergency_info) {

        result.emergencyStop = {
          enabled: true,
          message: serverResponse.data.emergency_info.message,
          link: serverResponse.data.emergency_info.link,
        };
      } else {

        result.emergencyStop = {
          enabled: false,
        };
      }

     const currentVersion = getCurrentAppVersionNumber();  
      const serverAndroidVersion = Number(serverResponse.data.version) || 0;
      const serverIOSVersion = Number(serverResponse.data.version_ios) || 0;

      console.log('[App] 버전 확인:', {
        currentVersion,
        serverAndroidVersion,
        serverIOSVersion,
        platform: Platform.OS,
      });

      if (Platform.OS === 'android') {
        if (currentVersion && serverAndroidVersion > currentVersion) {
          console.log('[App] 새 버전 발견 - 현재:', currentVersion, '서버:', serverAndroidVersion); 
          result.emergencyStop = {
            enabled: true,
            message: 'UPDATE_FOUND\nPLEASE_UPDATE',
            link: getPlayStoreUrl({ gl: 'us' }),
          };
        } else {
          console.log('[App android] 최신 버전입니다. 현재:', currentVersion, '서버:', serverAndroidVersion);
        }
      } else if (Platform.OS === 'ios') {
        if (currentVersion && serverIOSVersion > currentVersion) {
          console.log('[App] 새 버전 발견 - 현재:', currentVersion, '서버:', serverIOSVersion);
          if (__DEV__) {
            console.log('[App] 개발 모드이므로 버전 업데이트 진행하지 않습니다. index.ts sendAliveSignal'); 
          } else {
            result.emergencyStop = {
              enabled: true,
              message: 'UPDATE_FOUND\nPLEASE_UPDATE',
              link: 'https://apps.apple.com/kr/app/xrun-go/id6502924173',
            };
          }
        } else {
          console.log('[App ios] 최신 버전입니다. 현재:', currentVersion, '서버:', serverIOSVersion);
        }
      }

      return result;
    } else {

      throw new Error(`Server error: ${serverResponse.message}`);
    }
  } catch (error) {
    if (error instanceof Error && error.message === 'API request timeout') {

      throw error;
    }
    throw error;
  }
};

export const getIosWalletShowStatus = async (navigation?: any): Promise<boolean> => {
  try {
    const env = getEnv();
    const authCode = env.GATEWAY_AUTH_CODE;

    const response = await nodeGatewayRequest('/app-config/ios-onwallet', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authCode}`,
      },
    }, navigation);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data?.data?.iosOnWallet ?? false;
  } catch (error) {
    console.error('iOS 지갑 표시 상태 가져오기 오류:', error);
    return false; 
  }
};

export const createAxiosInstance = (navigation?: any) => {
  const env = getEnv();
  const baseURL = env.GATEWAY_NODEJS;
  const authCode = env.GATEWAY_AUTH_CODE;

  console.log('[createAxiosInstance] GATEWAY_NODEJS:', baseURL);
  console.log('[createAxiosInstance] __DEV__ 모드:', __DEV__);

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

      const finalUrl = config.baseURL
        ? (config.baseURL.endsWith('/') && config.url?.startsWith('/')
          ? `${config.baseURL.slice(0, -1)}${config.url}`
          : `${config.baseURL}${config.url}`)
        : config.url;

      console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`);
      console.log(`[API Request] baseURL: ${config.baseURL}`);
      console.log(`[API Request] 최종 요청 URL: ${finalUrl}`);

      if (config.data instanceof FormData) {
        console.log('[API Request] ========== FormData 요청 처리 시작 ==========');
        console.log('[API Request] FormData 타입 확인:', config.data instanceof FormData);
        console.log('[API Request] URL:', config.url);
        console.log('[API Request] Method:', config.method);

        delete config.headers['Content-Type'];
        delete config.headers['content-type'];
        console.log('[API Request] Content-Type 헤더 삭제 완료');

        config.transformRequest = [];
        console.log('[API Request] transformRequest를 빈 배열로 설정');

        config.maxContentLength = Infinity;
        config.maxBodyLength = Infinity;
        console.log('[API Request] maxContentLength=Infinity, maxBodyLength=Infinity 설정');

        if (Platform.OS !== 'web') {

          config.adapter = async (adapterConfig) => {
            return new Promise((resolve, reject) => {
              const xhr = new XMLHttpRequest();
              const url = adapterConfig.baseURL
                ? (adapterConfig.baseURL.endsWith('/') && adapterConfig.url?.startsWith('/')
                  ? `${adapterConfig.baseURL.slice(0, -1)}${adapterConfig.url || ''}`
                  : `${adapterConfig.baseURL}${adapterConfig.url || ''}`)
                : (adapterConfig.url || '');

              if (!url) {
                reject(new Error('URL is required'));
                return;
              }

              console.log('[API Request] XMLHttpRequest adapter - URL:', url);
              console.log('[API Request] XMLHttpRequest adapter - Method:', adapterConfig.method);

              xhr.open((adapterConfig.method || 'GET').toUpperCase(), url, true);

              Object.keys(adapterConfig.headers || {}).forEach((key) => {
                const lowerKey = key.toLowerCase();
                if (lowerKey !== 'content-type' && lowerKey !== 'contenttype') {
                  try {
                    xhr.setRequestHeader(key, adapterConfig.headers[key]);
                    console.log(`[API Request] XMLHttpRequest adapter - 헤더 설정: ${key} = ${adapterConfig.headers[key]}`);
                  } catch (e) {
                    console.warn(`[API Request] XMLHttpRequest adapter - 헤더 설정 실패: ${key}`, e);
                  }
                } else {
                  console.log(`[API Request] XMLHttpRequest adapter - Content-Type 헤더 건너뜀: ${key}`);
                }
              });

              if (adapterConfig.data instanceof FormData) {
                console.log('[API Request] XMLHttpRequest adapter - FormData 감지, Content-Type 헤더 설정 안 함');
              }

              xhr.onload = () => {
                console.log('[API Request] XMLHttpRequest adapter - 응답 수신:', xhr.status);
                try {

                  let responseData = xhr.response;
                  const contentType = xhr.getResponseHeader('Content-Type');
                  if (contentType && contentType.includes('application/json')) {
                    try {
                      responseData = JSON.parse(xhr.responseText);
                    } catch (e) {
                      console.warn('[API Request] XMLHttpRequest adapter - JSON 파싱 실패, 원본 데이터 사용');
                    }
                  }

                  const headersString = xhr.getAllResponseHeaders();
                  const headers: any = {};
                  if (headersString) {
                    headersString.trim().split('\r\n').forEach((line) => {
                      const parts = line.split(': ');
                      if (parts.length === 2) {
                        headers[parts[0].toLowerCase()] = parts[1];
                      }
                    });
                  }

                  const response = {
                    data: responseData,
                    status: xhr.status,
                    statusText: xhr.statusText,
                    headers: headers,
                    config: adapterConfig,
                    request: xhr,
                  };
                  resolve(response as any);
                } catch (e) {
                  console.error('[API Request] XMLHttpRequest adapter - 응답 처리 오류:', e);
                  reject(e);
                }
              };

              xhr.onerror = (error) => {
                console.error('[API Request] XMLHttpRequest adapter - 네트워크 오류:', error);
                console.error('[API Request] XMLHttpRequest adapter - readyState:', xhr.readyState);
                console.error('[API Request] XMLHttpRequest adapter - status:', xhr.status);
                reject(new Error('Network Error'));
              };

              xhr.ontimeout = () => {
                console.error('[API Request] XMLHttpRequest adapter - 타임아웃');
                reject(new Error('Timeout'));
              };

              xhr.timeout = adapterConfig.timeout || 60000;
              console.log('[API Request] XMLHttpRequest adapter - 타임아웃 설정:', xhr.timeout);

              if (adapterConfig.data instanceof FormData) {
                console.log('[API Request] XMLHttpRequest adapter - FormData 전송 시작');
                xhr.send(adapterConfig.data);
              } else {
                console.log('[API Request] XMLHttpRequest adapter - 일반 데이터 전송');
                xhr.send(adapterConfig.data);
              }
            });
          };
          console.log('[API Request] React Native XMLHttpRequest adapter 설정 완료');
        }

        console.log('[API Request] 최종 헤더:', JSON.stringify(config.headers, null, 2));
        console.log('[API Request] ========== FormData 요청 처리 완료 ==========');
      }

      if (config.data) {

        if (!(config.data instanceof FormData)) {

        }
      }
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

      if (error.config?.data instanceof FormData) {
        console.error('[API Error] ========== FormData 요청 오류 ==========');
        console.error('[API Error] URL:', error.config.url);
        console.error('[API Error] Method:', error.config.method);
        console.error('[API Error] Error Code:', error.code);
        console.error('[API Error] Error Message:', error.message);
        console.error('[API Error] Has Response:', !!error.response);
        console.error('[API Error] Has Request:', !!error.request);

        if (error.response) {
          console.error('[API Error] Response Status:', error.response.status);
          console.error('[API Error] Response Status Text:', error.response.statusText);
          console.error('[API Error] Response Data:', error.response.data);
          console.error('[API Error] Response Headers:', error.response.headers);
        } else if (error.request) {
          console.error('[API Error] Request Object:', error.request);
          console.error('[API Error] Request Type:', typeof error.request);
          if (error.request._response) {
            console.error('[API Error] Request Response:', error.request._response);
          }
        }
        console.error('[API Error] ========== FormData 요청 오류 끝 ==========');
      }

      if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
        console.error('[API Timeout]', error.config?.url);
        if (navigation) {
          await handleTimeoutError(navigation);
        }
      } else {

        const status = error.response?.status;
        const url = error.config?.url ?? '';
        const isExpectedAuthResponse =
          (status === 409 || status === 401 || status === 400) &&
          url.includes('google-auth-for-wallet');
        const logPayload = {
          url: error.config?.url,
          method: error.config?.method,
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
          message: error.message,
          code: error.code,
        };
        if (isExpectedAuthResponse) {
          console.warn('[API] 예상된 응답 (앱에서 안내 처리):', logPayload);
        } else {
          console.error('[API Error]', logPayload);
        }
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

export const checkEmailExists = async (
  email: string,
  navigation?: any,
): Promise<boolean> => {
  try {
    const axiosInstance = createAxiosInstance(navigation);
    const request: EmailExistsRequest = { email };

    console.log('[로그인] 이메일 존재 확인 요청:', email);

    const response = await axiosInstance.post<EmailExistsResponse>(
      '/ap1810-i01',
      request,
    );

    const result = response.data.data[0]?.result === true;
    console.log('[로그인] 이메일 존재 확인 결과:', result ? '등록된 이메일' : '미등록 이메일');

    return result;
  } catch (error) {
    console.error('[로그인] 이메일 존재 확인 실패:', error);
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
      mobile: signupData.mobile,
      region: signupData.region,
    });

    const response = await axiosInstance.post<SignupResponse>(
      '/login-06-joinAndAccount',
      signupData,
    );

    console.log('[회원가입 3단계] 회원가입 응답:', {
      status: response.status,
      data: response.data,
    });

    const result = response.data.data[0]?.text === 'ok';
    console.log('[회원가입 3단계] 회원가입 결과:', result ? '성공' : '실패');

    return result;
  } catch (error) {
    console.error('[회원가입 3단계] 회원가입 실행 실패:', error);
    if (error instanceof AxiosError) {
      console.error('[회원가입 3단계] 상세 오류 정보:', {
        url: error.config?.url,
        method: error.config?.method,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        requestData: error.config?.data,
      });
    }
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

  getGenderCode: (gender: 'male' | 'female' | '0'): number => {
    if (gender === '0') return 0;
    return gender === 'male' ? 2110 : 2111;
  },

  getAgeCode: (ageRange: '0' | '10' | '20' | '30' | '40' | '50+'): number => {
    if (ageRange === '0') return 0;
    const ageMap: Record<string, number> = {
      '10': 2210,
      '20': 2220,
      '30': 2230,
      '40': 2240,
      '50+': 2250,
    };
    return ageMap[ageRange] || 0;
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

    if (__DEV__) {
      if (error instanceof AxiosError) {

        if (error.code === 'ERR_NETWORK') {
          console.warn('[로그인] 이메일/비밀번호 로그인 네트워크 에러');
        } else {
          console.error('[로그인] 이메일/비밀번호 로그인 오류:', error);
          console.error('[로그인] 상세 오류 정보:', {
            url: error.config?.url,
            method: error.config?.method,
            status: error.response?.status,
            statusText: error.response?.statusText,
            data: error.response?.data,
            message: error.message,
          });
        }
      } else {
        console.error('[로그인] 이메일/비밀번호 로그인 오류:', error);
      }
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

    if (__DEV__) {
      if (error instanceof AxiosError) {

        if (error.code === 'ERR_NETWORK') {
          console.warn('[로그인] 비밀번호 로그인 네트워크 에러');
        } else {
          console.error('[로그인] 비밀번호 로그인 오류:', error);
          console.error('[로그인] 상세 오류 정보:', {
            url: error.config?.url,
            method: error.config?.method,
            status: error.response?.status,
            statusText: error.response?.statusText,
            data: error.response?.data,
            message: error.message,
          });
        }
      } else {
        console.error('[로그인] 비밀번호 로그인 오류:', error);
      }
    }
    throw error;
  }
};

export const connectGoogleAccount = async (
  googleData: any,
  pin: string,
  navigation?: any,
  memberId?: number,
): Promise<ConnectGoogleAccountResponse> => {
  try {
    const confirmationToken =
      googleData?.confirmationToken ??
      googleData?.token ??
      googleData?.connectToken ??
      googleData?.linkToken ??
      googleData?.authToken ??
      '';
    if (!confirmationToken) {
      console.error('[계정 연동] confirmationToken 없음. googleData 키:', googleData ? Object.keys(googleData) : [], '- 백엔드에서 계정 연동용 토큰을 내려주는지 확인해 주세요.');
      throw new Error('confirmationToken is required. 구글 로그인을 다시 시도해 주세요.');
    }

    const axiosInstance = createAxiosInstance(navigation);
    const request: ConnectGoogleAccountRequest = {
      ...googleData,
      memberId: memberId || googleData.memberId,
      pin,
      confirmationToken,
    };

    console.log('[계정 연동] 구글 계정 연동 요청');
    console.log('[계정 연동] 요청 데이터 (비밀번호 포함):', JSON.stringify(request, null, 2));

    const response = await axiosInstance.post<ConnectGoogleAccountResponse>(
      '/connect-google-account',
      request,
    );

    console.log('[계정 연동] 요청 성공, 응답:', JSON.stringify(response.data, null, 2));
    return response.data;
  } catch (error: any) {
    console.error('[계정 연동] 요청 오류:', error);
    if (error.response?.status === 401) {
      console.log('[계정 연동] 비밀번호 불일치 (401)');
      return {
        success: false,
        code: '401',
        message: '비밀번호가 일치하지 않습니다.',
      };
    }
    throw error;
  }
};

export const checkSocialForWallet = async (
  memberId: number,
  navigation?: any,
): Promise<CheckSocialForWalletResponse> => {
  const axiosInstance = createAxiosInstance(navigation);
  const body: CheckSocialForWalletRequest = { memberId };
  const response = await axiosInstance.post<CheckSocialForWalletResponse>(
    '/check-social-for-wallet',
    body,
  );
  return response.data;
};

export const googleAuthForWallet = async (
  memberId: number,
  idToken: string,
  pin?: string,
  navigation?: any,
): Promise<GoogleAuthForWalletResponse> => {
  const axiosInstance = createAxiosInstance(navigation);
  const body: GoogleAuthForWalletRequest = { memberId, idToken };
  if (pin !== undefined && pin !== '') {
    body.pin = pin;
  }

  const response = await axiosInstance.post<GoogleAuthForWalletResponse>(
    '/google-auth-for-wallet',
    body,
  );
  return response.data;
};

export const connectAppleAccount = async (
  appleData: any,
  pin: string,
  navigation?: any,
): Promise<any> => {
  try {
    const axiosInstance = createAxiosInstance(navigation);
    const request: any = {
      ...appleData,
      pin,
    };

    console.log('[계정 연동] 애플 계정 연동 요청');
    console.log('[계정 연동] 요청 데이터 (비밀번호 포함):', JSON.stringify(request, null, 2));

    const response = await axiosInstance.post<any>(
      '/connect-apple-account',
      request,
    );

    console.log('[계정 연동] 요청 성공, 응답:', JSON.stringify(response.data, null, 2));
    return response.data;
  } catch (error: any) {
    console.error('[계정 연동] 요청 오류:', error);
    if (error.response?.status === 401) {
      console.log('[계정 연동] 비밀번호 불일치 (401)');
      return {
        success: false,
        code: '401',
        message: '비밀번호가 일치하지 않습니다.',
      };
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

    if (__DEV__) {
      if (error instanceof AxiosError) {

        if (error.code === 'ERR_NETWORK') {
          console.warn('[로그인] 전화번호 로그인 네트워크 에러');
        } else {
          console.error('[로그인] 전화번호 로그인 오류:', error);
          console.error('[로그인] 상세 오류 정보:', {
            url: error.config?.url,
            method: error.config?.method,
            status: error.response?.status,
            statusText: error.response?.statusText,
            data: error.response?.data,
            message: error.message,
          });
        }
      } else {
        console.error('[로그인] 전화번호 로그인 오류:', error);
      }
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

    const result = !!(response.data.member || response.data.status === 'success');
    console.log('[로그인] 이메일 인증 코드 확인 결과:', result ? '성공' : '실패', {
      member: response.data.member,
      transaction: response.data.transaction,
      status: response.data.status,
    });

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

    if (__DEV__) {
      if (error instanceof AxiosError) {

        if (error.code === 'ERR_NETWORK') {
          console.warn('[로그인] 이메일 인증 로그인 네트워크 에러');
        } else {
          console.error('[로그인] 이메일 인증 로그인 오류:', error);
          console.error('[로그인] 상세 오류 정보:', {
            url: error.config?.url,
            method: error.config?.method,
            status: error.response?.status,
            statusText: error.response?.statusText,
            data: error.response?.data,
            message: error.message,
          });
        }
      } else {
        console.error('[로그인] 이메일 인증 로그인 오류:', error);
      }
    }
    throw error;
  }
};

export const loginWithGoogleIdToken = async (
  idToken: string,
  navigation?: any,
): Promise<LoginResponse> => {
  try {
    const axiosInstance = createAxiosInstance(navigation);

    console.log('[로그인] Google ID Token 로그인 요청');

    const response = await axiosInstance.post<LoginResponse>('/login-google', {
      idToken,
    });

    if (response.data.status === 'success') {
      console.log('[로그인] Google ID Token 로그인 성공');
    } else {
      console.error('[로그인] Google ID Token 로그인 실패:', response.data);
    }

    return response.data;
  } catch (error) {
    if (__DEV__ && error instanceof AxiosError) {
      console.error('[로그인] Google ID Token 로그인 오류:', {
        status: error.response?.status,
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
    console.log('[마이페이지] 지역 목록 응답 데이터:', {
      status: response.data.status,
      has_regions: response.data.has_regions,
      dataLength: response.data.data?.length || 0,
      data: response.data.data,
    });

    return response.data;
  } catch (error) {

    if (__DEV__) {
      console.error('[마이페이지] 지역 목록 조회 오류:', error);
      if (error instanceof AxiosError) {

        if (error.code === 'ERR_NETWORK') {
          console.warn('[마이페이지] 지역 목록 조회 네트워크 에러 - fallback 사용');
        } else {
          console.error('[마이페이지] 상세 오류 정보:', {
            url: error.config?.url,
            method: error.config?.method,
            status: error.response?.status,
            statusText: error.response?.statusText,
            data: error.response?.data,
            message: error.message,
          });
        }
      }
    }
    throw error;
  }
};

export const updateRegion = async (
  member: number,
  country: number,
  region: number,
  navigation?: any,
  options?: { countrycode?: number; mobilecode?: number },
): Promise<UpdateRegionResponse> => {
  try {

    if (member === undefined || member === null || isNaN(member)) {
      throw new Error('회원 ID가 유효하지 않습니다.');
    }

    if (country === undefined || country === null || isNaN(country)) {
      throw new Error('국가 코드가 유효하지 않습니다.');
    }

    if (region === undefined || region === null || isNaN(region)) {
      throw new Error('지역 코드가 유효하지 않습니다.');
    }

    const axiosInstance = createAxiosInstance(navigation);

    const memberNum = Number(member);
    const countryNum = Number(country);
    const regionNum = Number(region);

    console.log('[마이페이지] 지역 수정 요청 - 입력 파라미터:', {
      입력member: member,
      입력country: country,
      입력region: region,
      입력타입: {
        member: typeof member,
        country: typeof country,
        region: typeof region,
      },
    });

    console.log('[마이페이지] 지역 수정 요청 - 변환 후:', {
      변환member: memberNum,
      변환country: countryNum,
      변환region: regionNum,
      변환타입: {
        member: typeof memberNum,
        country: typeof countryNum,
        region: typeof regionNum,
      },
      isNaN체크: {
        member: isNaN(memberNum),
        country: isNaN(countryNum),
        region: isNaN(regionNum),
      },
    });

    const request: UpdateRegionRequest = {
      member: memberNum,
      country: countryNum,
      region: regionNum,
    };

    if (options?.countrycode !== undefined && options?.countrycode !== null) {
      request.countrycode = options.countrycode;
    }
    if (options?.mobilecode !== undefined && options?.mobilecode !== null) {
      request.mobilecode = options.mobilecode;
    }

    const buildPayload = (obj: any): any => {
      if (obj === undefined) return null;
      if (obj === null || typeof obj !== 'object') return obj;
      if (Array.isArray(obj)) return obj.map(buildPayload);
      const out: any = {};
      for (const k of Object.keys(obj)) {
        const v = (obj as any)[k];
        out[k] = v === undefined ? null : buildPayload(v);
      }
      return out;
    };
    const cleanRequest: any = {
      member: request.member,
      country: request.country,
      region: request.region,

      countrycode: options?.countrycode != null && !isNaN(options.countrycode) ? options.countrycode : null,
      mobilecode: options?.mobilecode != null && !isNaN(options.mobilecode) ? options.mobilecode : null,
    };
    const payload = buildPayload(cleanRequest);

    const response = await axiosInstance.post<UpdateRegionResponse>(
      '/app7190-02',
      payload,
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

export const closeMembership = async (
  member: number,
  pin: string,
  reason: string,
  reasonNum: number,
  navigation?: any,
): Promise<boolean> => {
  try {
    const axiosInstance = createAxiosInstance(navigation);
    const request: CloseMembershipRequest = {
      pin,
      reason,
      reasonNum,
      member,
    };

    console.log('[회원 탈퇴] 회원 탈퇴 요청:', { member, reasonNum });

    const response = await axiosInstance.post<CloseMembershipResponse>(
      '/app8080-01',
      request,
    );

    const result = response.data.data?.[0]?.count === 1;
    console.log('[회원 탈퇴] 회원 탈퇴 결과:', result ? '성공' : '실패');

    return result;
  } catch (error) {
    console.error('[회원 탈퇴] 회원 탈퇴 오류:', error);
    if (error instanceof AxiosError) {
      console.error('[회원 탈퇴] 상세 오류 정보:', {
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

export const updatePassword = async (
  member: number,
  pin: string,
  navigation?: any,
): Promise<UpdatePasswordResponse> => {
  try {
    const axiosInstance = createAxiosInstance(navigation);
    const request: UpdatePasswordRequest = {
      member,
      pin,
    };

    console.log('[비밀번호 변경] 비밀번호 변경 요청:', { member });

    const response = await axiosInstance.post<UpdatePasswordResponse>(
      '/app7163-01',
      request,
    );

    console.log('[비밀번호 변경] 비밀번호 변경 성공');

    return response.data;
  } catch (error) {
    console.error('[비밀번호 변경] 비밀번호 변경 오류:', error);
    if (error instanceof AxiosError) {
      console.error('[비밀번호 변경] 상세 오류 정보:', {
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

export const getNotificationList = async (
  member: number,
  start: number = 0,
  navigation?: any,
): Promise<NotificationListResponse> => {
  try {
    const axiosInstance = createAxiosInstance(navigation);
    const request: NotificationListRequest = {
      member,
      start,
    };

    console.log('[알림] 알림 목록 조회 요청:', { member, start });

    const response = await axiosInstance.post<NotificationListResponse>(
      '/ap6000-01',
      request,
    );

    console.log('[알림] 알림 목록 조회 성공, 알림 개수:', response.data.data?.length || 0);

    return response.data;
  } catch (error) {
    console.error('[알림] 알림 목록 조회 오류:', error);
    if (error instanceof AxiosError) {
      console.error('[알림] 상세 오류 정보:', {
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

export const sendNotificationMessage = async (
  member: number,
  title: string,
  isBroadcast: boolean = false,
  navigation?: any,
): Promise<NotificationSendResponse> => {
  try {
    const axiosInstance = createAxiosInstance(navigation);
    const request: NotificationSendRequest = {
      isBroadcast,
      member,
      title,
    };

    console.log('[알림] 알림 메시지 전송 요청:', { member, title, isBroadcast });

    const response = await axiosInstance.post<NotificationSendResponse>(
      '/ap6000-02',
      request,
    );

    console.log('[알림] 알림 메시지 전송 성공');

    return response.data;
  } catch (error) {
    console.error('[알림] 알림 메시지 전송 오류:', error);
    if (error instanceof AxiosError) {
      console.error('[알림] 상세 오류 정보:', {
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

export const deleteNotificationMessage = async (
  member: number,
  board: number,
  isBroadcast: boolean = false,
  navigation?: any,
): Promise<NotificationDeleteResponse> => {
  try {
    const axiosInstance = createAxiosInstance(navigation);
    const request: NotificationDeleteRequest = {
      isBroadcast,
      member,
      board,
    };

    console.log('[알림] 알림 메시지 삭제 요청:', { member, board, isBroadcast });

    const response = await axiosInstance.post<NotificationDeleteResponse>(
      '/ap6000-03',
      request,
    );

    console.log('[알림] 알림 메시지 삭제 성공');

    return response.data;
  } catch (error) {
    console.error('[알림] 알림 메시지 삭제 오류:', error);
    if (error instanceof AxiosError) {
      console.error('[알림] 상세 오류 정보:', {
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

export const deleteAllNotifications = async (
  member: number,
  navigation?: any,
): Promise<NotificationDeleteAllResponse> => {
  try {
    const axiosInstance = createAxiosInstance(navigation);
    const request: NotificationDeleteAllRequest = {
      member,
    };

    console.log('[알림] 전체 알림 삭제 요청:', { member });

    const response = await axiosInstance.post<NotificationDeleteAllResponse>(
      '/ap6000-04delete',
      request,
    );

    console.log('[알림] 전체 알림 삭제 성공');

    return response.data;
  } catch (error) {
    console.error('[알림] 전체 알림 삭제 오류:', error);
    if (error instanceof AxiosError) {
      console.error('[알림] 상세 오류 정보:', {
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

export const registerFCMToken = async (
  pushkey: string,
  member: number,
  navigation?: any,
): Promise<FCMTokenRegisterResponse> => {
  try {
    const axiosInstance = createAxiosInstance(navigation);
    const request: FCMTokenRegisterRequest = {
      pushkey,
      member,
    };

    console.log('[알림] FCM 토큰 등록 요청:', { member, pushkey: pushkey.substring(0, 20) + '...' });

    const response = await axiosInstance.post<FCMTokenRegisterResponse>(
      '/login-pushkeyreg',
      request,
    );

    console.log('[알림] FCM 토큰 등록 성공');

    return response.data;
  } catch (error) {
    console.error('[알림] FCM 토큰 등록 오류:', error);
    if (error instanceof AxiosError) {
      console.error('[알림] 상세 오류 정보:', {
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

const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371000; 
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

const calculateDirection = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const lat1Rad = lat1 * Math.PI / 180;
  const lat2Rad = lat2 * Math.PI / 180;
  const y = Math.sin(dLon) * Math.cos(lat2Rad);
  const x = Math.cos(lat1Rad) * Math.sin(lat2Rad) - Math.sin(lat1Rad) * Math.cos(lat2Rad) * Math.cos(dLon);
  const bearing = Math.atan2(y, x) * 180 / Math.PI;
  return (bearing + 360) % 360;
};

export const fetchMapMarkerDataRaw = async (
  latitude: number,
  longitude: number,
  member: number,
  navigation?: any,
): Promise<any> => {
  try {
    const axiosInstance = createAxiosInstance(navigation);
    const requestBody = {
      member,
      latitude,
      longitude,
      limit: 120,
    };

    console.log('=== fetchMapMarkerDataRaw API 호출 ===');
    console.log('endpoint: app2000-01');
    console.log('requestBody:', JSON.stringify(requestBody));

    const response = await axiosInstance.post(
      '/app2000-01',
      requestBody,
    );

    const data = response.data;
    console.log('=== fetchMapMarkerDataRaw API 응답 ===');
    console.log('data.data length:', data?.data?.length);

    return data;
  } catch (error) {
    console.error('맵 마커 원본 데이터 가져오기 오류:', error);
    if (error instanceof AxiosError) {
      console.error('[맵 마커 원본] 상세 오류 정보:', {
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

let fetchMapMarkerPromise: Promise<SpotData[]> | null = null;

export const fetchMapMarkerData = async (
  latitude: number,
  longitude: number,
  member: number,
  navigation?: any,
  deviceInfo?: any, 
): Promise<SpotData[]> => {
  if (fetchMapMarkerPromise) {
    console.log('[Deduplication] fetchMapMarkerData is already in progress, returning pending promise');
    return fetchMapMarkerPromise;
  }

  fetchMapMarkerPromise = (async () => {
    try {
      const axiosInstance = createAxiosInstance(navigation);
      const requestBody = {
        member,
        latitude,
        longitude,
        limit: 120,
        ...(deviceInfo || {}),
      };

      const response = await axiosInstance.post(
        '/app2000-01',
        requestBody,
      );

      const data = response.data;

      if (data?.data && Array.isArray(data.data)) {
        return data.data.map((item: any) => {
          const markerLat = item.lat || item.latitude;
          const markerLng = item.lng || item.longitude;

          let distance = item.distance || 0;
          if (markerLat && markerLng && (distance === 0 || !item.distance)) {
            distance = calculateDistance(latitude, longitude, markerLat, markerLng);
          }

          let direction = item.direction || 0;
          if (markerLat && markerLng && (direction === 0 || !item.direction)) {
            direction = calculateDirection(latitude, longitude, markerLat, markerLng);
          }

          return {
            spotID: item.spotid || item.spotID || item.id || 0,
            distance: distance,
            direction: direction,
            name: item.name || item.brand || item.coin || item.title || 'XRUN coin',
            latitude: markerLat,
            longitude: markerLng,
            xrunPrice: item.xrunprice || item.xrunPrice || item.price || 0,
            iconurl: item.iconurl || item.brandlogo || item.brandlogo_file || item.adthumbnail2 || item.adthumbnail2_file || '',
            joindesc: item.joindesc || item.description || '',
            brand: item.brand || item.coin || '',
            coins: item.coins || item.coin || '',
            coin: item.coin || '',
            campid: item.campid || item.campId || item.campaignid || item.campaignId || '',
            advertisement: item.advertisement || item.adid || item.ad || item.coin || '',
          } as SpotData & { campid?: string; advertisement?: string | number };
        });
      }

      console.log('API 응답에 data.data가 없거나 배열이 아님');
      return [];
    } catch (error) {
      console.error('맵 마커 데이터 가져오기 오류:', error);
      if (error instanceof AxiosError) {
        console.error('[맵 마커] 상세 오류 정보:', {
          url: error.config?.url,
          method: error.config?.method,
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
          message: error.message,
        });
      }
      return [];
    } finally {
      fetchMapMarkerPromise = null;
    }
  })();

  return fetchMapMarkerPromise as Promise<SpotData[]>;
};

let fetchVirtualCoinPromise: Promise<any> | null = null;

export const fetchVirtualCoin = async (
  member: number | string,
  latitude: number,
  longitude: number,
  navigation?: any,
): Promise<any> => {
  if (fetchVirtualCoinPromise) {
    console.log('[Deduplication] fetchVirtualCoin is already in progress, returning pending promise');
    return fetchVirtualCoinPromise as Promise<any>;
  }

  fetchVirtualCoinPromise = (async () => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);

    try {
      const env = getEnv();
      const url = `${env.GATEWAY_NODEJS}/virtualCoin`;

      const requestBody = {
        member: member,
        latitude: latitude,
        longitude: longitude,
      };

      console.log('=== virtualCoin API 호출 ===');
      console.log('requestBody:', JSON.stringify(requestBody));

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${env.GATEWAY_AUTH_CODE}`,
        },
        body: JSON.stringify(requestBody),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {

        if (response.status === 504) {
          console.warn('virtualCoin API 504 에러 (게이트웨이 타임아웃) - 빈 데이터 반환');
          return { data: [] };
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('=== virtualCoin API 응답 ===');
      console.log('response.data length:', result?.data?.length);

      return result;
    } catch (error: any) {
      clearTimeout(timeoutId);

      if (error?.name === 'AbortError' || error?.message?.includes('504') || error?.message?.includes('timeout')) {
        console.warn('virtualCoin API 타임아웃 또는 504 에러 - 빈 데이터 반환');
        return { data: [] };
      }

      console.error('virtualCoin API 호출 실패:', error);

      if (navigation && error?.name === 'AbortError') {
        try {
          await handleTimeoutError(navigation);
        } catch (handlerError) {
          console.warn('타임아웃 처리 스킵:', handlerError);
        }
      }

      return { data: [] };
    } finally {
      fetchVirtualCoinPromise = null;
    }
  })();

  return fetchVirtualCoinPromise;
};

let getCoinNasPricePromise: Promise<any> | null = null;

export const getCoinNasPrice = async (
  navigation?: any,
): Promise<any> => {
  if (getCoinNasPricePromise) {
    console.log('[Deduplication] getCoinNasPrice is already in progress, returning pending promise');
    return getCoinNasPricePromise as Promise<any>;
  }

  getCoinNasPricePromise = (async () => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);

    try {
      const env = getEnv();
      const url = `${env.GATEWAY_NODEJS}/getCoinNasPrice`;

      console.log('=== getCoinNasPrice API 호출 ===');

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${env.GATEWAY_AUTH_CODE}`,
        },
        body: JSON.stringify({}),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {

        if (response.status === 504) {
          console.warn('getCoinNasPrice API 504 에러 (게이트웨이 타임아웃) - 기본값 반환');
          return { data: { coins: 0 } };
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('=== getCoinNasPrice API 응답 ===');
      console.log('calculatedNasPrice:', result?.data?.coins);

      return result;
    } catch (error: any) {
      clearTimeout(timeoutId);

      if (error?.name === 'AbortError' || error?.message?.includes('504') || error?.message?.includes('timeout')) {
        console.warn('getCoinNasPrice API 타임아웃 또는 504 에러 - 기본값 반환');
        return { data: { coins: 0 } };
      }

      console.error('getCoinNasPrice API 호출 실패:', error);

      if (navigation && error?.name === 'AbortError') {
        try {
          await handleTimeoutError(navigation);
        } catch (handlerError) {
          console.warn('타임아웃 처리 스킵:', handlerError);
        }
      }

      return { data: { coins: 0 } };
    } finally {
      getCoinNasPricePromise = null;
    }
  })();

  return getCoinNasPricePromise as Promise<any>;
};

export const registerReferralByEmail = async (
  member: number,
  email: string,
  navigation?: any,
): Promise<RegisterReferralByEmailResponse> => {
  try {
    const axiosInstance = createAxiosInstance(navigation);
    const request: RegisterReferralByEmailRequest = {
      member,
      email,
    };

    console.log('[추천] 추천인 등록 요청 (이메일):', { member, email });

    const response = await axiosInstance.post<RegisterReferralByEmailResponse>(
      '/app7410-01',
      request,
    );

    const result = response.data.data?.[0]?.data || '';
    console.log('[추천] 추천인 등록 결과:', result);

    return response.data;
  } catch (error) {
    console.error('[추천] 추천인 등록 오류:', error);
    if (error instanceof AxiosError) {
      console.error('[추천] 상세 오류 정보:', {
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

export const getRandomReferralList = async (
  navigation?: any,
): Promise<GetRandomReferralListResponse> => {
  try {
    const axiosInstance = createAxiosInstance(navigation);

    console.log('[추천] 랜덤 추천인 목록 조회 요청');

    const response = await axiosInstance.get<GetRandomReferralListResponse>(
      '/app7420-01',
    );

    console.log('[추천] 랜덤 추천인 목록 조회 성공, 개수:', response.data.data?.length || 0);

    return response.data;
  } catch (error) {
    console.error('[추천] 랜덤 추천인 목록 조회 오류:', error);
    if (error instanceof AxiosError) {
      console.error('[추천] 상세 오류 정보:', {
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

export const registerRandomReferral = async (
  member: number,
  posed: number,
  navigation?: any,
): Promise<RegisterRandomReferralResponse> => {
  try {
    const axiosInstance = createAxiosInstance(navigation);
    const request: RegisterRandomReferralRequest = {
      member,
      posed,
    };

    console.log('[추천] 랜덤 추천인 등록 요청:', { member, posed });

    const response = await axiosInstance.post<RegisterRandomReferralResponse>(
      '/app7420-02',
      request,
    );

    const result = response.data.data?.[0]?.data || '';
    console.log('[추천] 랜덤 추천인 등록 결과:', result);

    return response.data;
  } catch (error) {
    console.error('[추천] 랜덤 추천인 등록 오류:', error);
    if (error instanceof AxiosError) {
      console.error('[추천] 상세 오류 정보:', {
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

export const saveReferral = async (
  member: number,
  recommand: number,
  navigation?: any,
): Promise<SaveReferralResponse> => {
  try {
    const axiosInstance = createAxiosInstance(navigation);
    const request: SaveReferralRequest = {
      member,
      recommand,
    };

    console.log('[추천] 추천인 저장 요청:', { member, recommand });

    const response = await axiosInstance.post<SaveReferralResponse>(
      '/saveRecommend',
      request,
    );

    console.log('[추천] 추천인 저장 성공');

    return response.data;
  } catch (error) {
    console.error('[추천] 추천인 저장 오류:', error);
    if (error instanceof AxiosError) {
      console.error('[추천] 상세 오류 정보:', {
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

export const getMyReferral = async (
  member: number,
  navigation?: any,
): Promise<GetMyReferralResponse> => {
  try {
    const axiosInstance = createAxiosInstance(navigation);
    const request: GetMyReferralRequest = {
      member,
    };

    console.log('[추천] 추천인 조회 요청:', { member });

    const response = await axiosInstance.post<GetMyReferralResponse>(
      '/app7420-03',
      request,
    );

    const result = response.data.data?.[0];
    console.log('[추천] 추천인 조회 결과:', {
      email: result?.email,
      status: result?.data,
    });

    return response.data;
  } catch (error) {
    console.error('[추천] 추천인 조회 오류:', error);
    if (error instanceof AxiosError) {
      console.error('[추천] 상세 오류 정보:', {
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

export const getRecommendedToMe = async (
  member: number,
  navigation?: any,
): Promise<GetRecommendedToMeResponse> => {
  try {
    const axiosInstance = createAxiosInstance(navigation);
    const request: GetRecommendedToMeRequest = {
      member,
    };

    console.log('[추천] 내가 추천한 사람 목록 조회 요청:', { member });

    const response = await axiosInstance.post<GetRecommendedToMeResponse>(
      '/getRecommendedToMe',
      request,
    );

    console.log('[추천] 내가 추천한 사람 목록 조회 성공, 개수:', response.data.data?.length || 0);

    return response.data;
  } catch (error) {
    console.error('[추천] 내가 추천한 사람 목록 조회 오류:', error);
    if (error instanceof AxiosError) {
      console.error('[추천] 상세 오류 정보:', {
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

export const getMemberByEmail = async (
  email: string,
  navigation?: any,
): Promise<GetMemberByEmailResponse> => {
  try {
    const axiosInstance = createAxiosInstance(navigation);
    const request: GetMemberByEmailRequest = {
      email,
    };

    console.log('[추천] 이메일로 회원 조회 요청:', { email });

    const response = await axiosInstance.post<GetMemberByEmailResponse>(
      '/ap1810-i01',
      request,
    );

    const result = response.data.data?.[0];
    console.log('[추천] 이메일로 회원 조회 결과:', {
      exists: result?.result,
      member: result?.member,
    });

    return response.data;
  } catch (error) {
    console.error('[추천] 이메일로 회원 조회 오류:', error);
    if (error instanceof AxiosError) {
      console.error('[추천] 상세 오류 정보:', {
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

export const getUserInfoForReferral = async (
  member: number,
  navigation?: any,
): Promise<GetUserInfoForReferralResponse> => {
  try {
    const axiosInstance = createAxiosInstance(navigation);
    const request: GetUserInfoForReferralRequest = {
      member,
    };

    console.log('[추천] 사용자 정보 조회 요청 (app7110-01):', { member });

    const response = await axiosInstance.post<GetUserInfoForReferralResponse>(
      '/app7110-01',
      request,
    );

    console.log('[추천] 사용자 정보 조회 성공');

    return response.data;
  } catch (error) {
    console.error('[추천] 사용자 정보 조회 오류:', error);
    if (error instanceof AxiosError) {
      console.error('[추천] 상세 오류 정보:', {
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

export const getNasmobAds = async (
  member: string,
  adid: string,
  deviceInfo: DeviceInfo,
  campid: string = '',
  navigation?: any,
): Promise<NasmobAdsResponse> => {
  try {
    const env = getEnv();
    const url = `${env.GATEWAY_NODEJS}/getNasmobAds`;

    const isIOS = Platform.OS === 'ios' ||
      deviceInfo.manufacturer === 'Apple' ||
      (deviceInfo.model && deviceInfo.model.toLowerCase().includes('iphone')) ||
      (deviceInfo.model && deviceInfo.model.toLowerCase().includes('ipad'));

    if (isIOS) {
      deviceInfo.os = 'ios';
    } else {
      deviceInfo.os = 'aos';
    }

    const requestBody = {
      member: member,
      adid: adid || '',
      os: deviceInfo.os,
      osver: deviceInfo.osVersion || '',
      ip: deviceInfo.ipAddress || '',
      devid: deviceInfo.deviceId || '',
      devmodel: deviceInfo.model || '',
      devbrand: deviceInfo.manufacturer || '',
      mnetwork: deviceInfo.mnetwork || '4',
      carrier: deviceInfo.carrierCode || '1',
      campid: campid || '',
    };

    console.log('NStation 광고 API 요청:', requestBody);

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${env.GATEWAY_AUTH_CODE}`,
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {

      const errorText = await response.text();
      console.error(`[NStation] HTTP 에러 (${response.status}):`, errorText.substring(0, 500));

      if (response.status === 403) {
        try {
          const errorJson = JSON.parse(errorText);
          if (errorJson.status === 'error' && errorJson.code === 403) {
            console.warn(`[NStation] 블록리스트된 캠페인: ${campid} - ${errorJson.message || 'Campaign is blocked'}`);

            if (campid) {
              await removeBlocklistedCampaignFromCache(campid);
            }

            const error = new Error(errorJson.message || 'Campaign is blocked');
            (error as any).is403 = true;
            (error as any).campid = campid;
            throw error;
          }
        } catch (parseError) {

          console.warn(`[NStation] 403 에러 (JSON 파싱 실패): ${errorText.substring(0, 200)}`);
          const error = new Error(`Campaign is blocked (403)`);
          (error as any).is403 = true;
          (error as any).campid = campid;
          throw error;
        }
      }

      if (response.status >= 500) {
        throw new Error(`서버 에러 (${response.status}): ${errorText.substring(0, 200)}`);
      }

      try {
        const errorJson = JSON.parse(errorText);
        const errorMessage = errorJson.message || `HTTP error! status: ${response.status}`;
        const error = new Error(errorMessage);
        (error as any).is404 = errorJson.code === 404 || response.status === 404;
        throw error;
      } catch (parseError) {

        throw new Error(`HTTP error! status: ${response.status}, body: ${errorText.substring(0, 200)}`);
      }
    }

    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      const text = await response.text();
      console.error('[NStation] 비-JSON 응답:', contentType, text.substring(0, 500));
      throw new Error(`Expected JSON but got ${contentType || 'unknown'}`);
    }

    const result: NasmobAdsResponse = await response.json();
    console.log('NStation 광고 API 응답:', result);

    if (result.status === 'error' && result.code === 403) {
      console.warn(`[NStation] 블록리스트된 캠페인: ${campid} - ${result.message || 'Campaign is blocked'}`);

      if (campid) {
        await removeBlocklistedCampaignFromCache(campid);
      }
      const error = new Error(result.message || 'Campaign is blocked');
      (error as any).is403 = true;
      (error as any).campid = campid;
      throw error;
    }

    if (result.status === 'success' && result.code === 200) {
      return result;
    } else {

      const errorMessage = result.message || 'NStation 광고 API 호출 실패';
      const error = new Error(errorMessage);

      (error as any).is404 = result.code === 404;
      throw error;
    }
  } catch (error: any) {
    console.error('NStation 광고 API 호출 실패:', error);

    if (error.is403) {
      console.log('403 에러: 블록리스트된 캠페인 - 타임아웃 처리 스킵');
      throw error;
    }

    if (error.is404) {
      console.log('404 에러: 캠페인 데이터 없음 - 타임아웃 처리 스킵');
      throw error;
    }

    if (navigation && typeof navigation.reset === 'function') {
      try {
        await handleTimeoutError(navigation);
      } catch (timeoutError) {
        console.error('타임아웃 처리 중 오류:', timeoutError);

      }
    }
    throw error;
  }
};

export const getPockAds = async (
  member: string,
  adid: string,
  deviceInfo: DeviceInfo,
  campid: string = '',
  navigation?: any,
): Promise<PockAdsResponse> => {
  try {
    const env = getEnv();
    const url = `${env.GATEWAY_NODEJS}/getPockAds`;

    let osType: number;
    let osTypeString: string;

    const isIOS = Platform.OS === 'ios' ||
      deviceInfo.manufacturer === 'Apple' ||
      (deviceInfo.model && deviceInfo.model.toLowerCase().includes('iphone')) ||
      (deviceInfo.model && deviceInfo.model.toLowerCase().includes('ipad'));

    if (isIOS) {
      osType = 3113; 
      osTypeString = 'IOS'; 
    } else {
      osType = 3112; 
      osTypeString = 'ANDROID'; 
    }
    console.log('osTypeString', osTypeString);
    console.log('osType', osType);

    const requestBody = {
      member: member,
      ad_key: campid || '', 
      os: osTypeString, 
      device_ifa: adid || '', 
      ip: deviceInfo.ipAddress || '',
    };

    console.log('Pock 광고 API 요청:', requestBody);

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${env.GATEWAY_AUTH_CODE}`,
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {

      const errorText = await response.text();
      console.error(`[Pock] HTTP 에러 (${response.status}):`, errorText.substring(0, 500));

      if (response.status === 403) {
        try {
          const errorJson = JSON.parse(errorText);
          if (errorJson.status === 'error' && errorJson.code === 403) {
            console.warn(`[Pock] 블록리스트된 캠페인: ${campid} - ${errorJson.message || 'Campaign is blocked'}`);

            if (campid) {
              await removeBlocklistedCampaignFromCache(campid);
            }

            const error = new Error(errorJson.message || 'Campaign is blocked');
            (error as any).is403 = true;
            (error as any).campid = campid;
            throw error;
          }
        } catch (parseError) {

          console.warn(`[Pock] 403 에러 (JSON 파싱 실패): ${errorText.substring(0, 200)}`);
          const error = new Error(`Campaign is blocked (403)`);
          (error as any).is403 = true;
          (error as any).campid = campid;
          throw error;
        }
      }

      if (response.status >= 500) {
        throw new Error(`서버 에러 (${response.status}): ${errorText.substring(0, 200)}`);
      }

      try {
        const errorJson = JSON.parse(errorText);
        const errorMessage = errorJson.message || `HTTP error! status: ${response.status}`;
        const error = new Error(errorMessage);
        (error as any).is404 = errorJson.code === 404 || response.status === 404;
        throw error;
      } catch (parseError) {

        throw new Error(`HTTP error! status: ${response.status}, body: ${errorText.substring(0, 200)}`);
      }
    }

    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      const text = await response.text();
      console.error('[Pock] 비-JSON 응답:', contentType, text.substring(0, 500));
      throw new Error(`Expected JSON but got ${contentType || 'unknown'}`);
    }

    const result: PockAdsResponse = await response.json();
    console.log('Pock 광고 API 응답:', result);

    if (result.status === 'error' && result.code === 403) {
      console.warn(`[Pock] 블록리스트된 캠페인: ${campid} - ${result.message || 'Campaign is blocked'}`);

      if (campid) {
        await removeBlocklistedCampaignFromCache(campid);
      }
      const error = new Error(result.message || 'Campaign is blocked');
      (error as any).is403 = true;
      (error as any).campid = campid;
      throw error;
    }

    if (result.status === 'success' && result.code === 200) {
      return result;
    } else {

      const errorMessage = result.message || 'Pock 광고 API 호출 실패';
      const error = new Error(errorMessage);

      (error as any).is404 = result.code === 404;
      throw error;
    }
  } catch (error: any) {
    console.error('Pock 광고 API 호출 실패:', error);

    if (error.is404) {
      console.log('404 에러: 캠페인 데이터 없음 - 타임아웃 처리 스킵');
      throw error;
    }

    if (navigation && typeof navigation.reset === 'function') {
      try {
        await handleTimeoutError(navigation);
      } catch (timeoutError) {
        console.error('타임아웃 처리 중 오류:', timeoutError);

      }
    }
    throw error;
  }
};

export const getPointClickAds = async (
  member: string,
  adid: string,
  deviceInfo: DeviceInfo,
  ad_key: string = '',
  navigation?: any,
): Promise<PockAdsResponse> => {
  try {
    const env = getEnv();
    const url = `${env.GATEWAY_NODEJS}/getPointClickAds`;

    let osTypeString: string;

    const isIOS = Platform.OS === 'ios' ||
      deviceInfo.manufacturer === 'Apple' ||
      (deviceInfo.model && deviceInfo.model.toLowerCase().includes('iphone')) ||
      (deviceInfo.model && deviceInfo.model.toLowerCase().includes('ipad'));

    if (isIOS) {
      osTypeString = 'IOS';
    } else {
      osTypeString = 'ANDROID';
    }

    const requestBody = {
      member: member,
      ad_key: ad_key || '',
      os: osTypeString,
      device_ifa: adid || '',
      ip: deviceInfo.ipAddress || '',
    };

    console.log('PointClick 광고 API 요청:', requestBody);

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${env.GATEWAY_AUTH_CODE}`,
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {

      const errorText = await response.text();
      console.error(`[PointClick] HTTP 에러 (${response.status}):`, errorText.substring(0, 500));

      if (response.status === 403) {
        try {
          const errorJson = JSON.parse(errorText);
          if (errorJson.status === 'error' && errorJson.code === 403) {
            console.warn(`[PointClick] 블록리스트된 캠페인: ${ad_key} - ${errorJson.message || 'Campaign is blocked'}`);

            if (ad_key) {
              await removeBlocklistedCampaignFromCache(ad_key);
            }

            const error = new Error(errorJson.message || 'Campaign is blocked');
            (error as any).is403 = true;
            (error as any).campid = ad_key;
            throw error;
          }
        } catch (parseError) {

          console.warn(`[PointClick] 403 에러 (JSON 파싱 실패): ${errorText.substring(0, 200)}`);
          const error = new Error(`Campaign is blocked (403)`);
          (error as any).is403 = true;
          (error as any).campid = ad_key;
          throw error;
        }
      }

      if (response.status >= 500) {
        throw new Error(`서버 에러 (${response.status}): ${errorText.substring(0, 200)}`);
      }

      try {
        const errorJson = JSON.parse(errorText);
        const errorMessage = errorJson.message || `HTTP error! status: ${response.status}`;
        const error = new Error(errorMessage);
        (error as any).is404 = errorJson.code === 404 || response.status === 404;
        throw error;
      } catch (parseError) {

        throw new Error(`HTTP error! status: ${response.status}, body: ${errorText.substring(0, 200)}`);
      }
    }

    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      const text = await response.text();
      console.error('[PointClick] 비-JSON 응답:', contentType, text.substring(0, 500));
      throw new Error(`Expected JSON but got ${contentType || 'unknown'}`);
    }

    const result: PockAdsResponse = await response.json();
    console.log('PointClick 광고 API 응답:', result);

    if (result.status === 'error' && result.code === 403) {
      console.warn(`[PointClick] 블록리스트된 캠페인: ${ad_key} - ${result.message || 'Campaign is blocked'}`);

      if (ad_key) {
        await removeBlocklistedCampaignFromCache(ad_key);
      }
      const error = new Error(result.message || 'Campaign is blocked');
      (error as any).is403 = true;
      (error as any).campid = ad_key;
      throw error;
    }

    if (response.ok && result.status === 'success' && result.code === 200) {
      return result;
    } else {

      const errorMessage = result.message || 'PointClick 광고 API 호출 실패';
      const error = new Error(errorMessage);

      (error as any).is404 = result.code === 404;
      throw error;
    }
  } catch (error: any) {
    console.error('PointClick 광고 API 호출 실패:', error);

    if (error.is403) {
      console.log('403 에러: 블록리스트된 캠페인 - 타임아웃 처리 스킵');
      throw error;
    }

    if (error.is404) {
      console.log('404 에러: 캠페인 데이터 없음 - 타임아웃 처리 스킵');
      throw error;
    }

    if (navigation && typeof navigation.reset === 'function') {
      try {
        await handleTimeoutError(navigation);
      } catch (timeoutError) {
        console.error('타임아웃 처리 중 오류:', timeoutError);

      }
    }
    throw error;
  }
};

export const sendNasmobCallback = async (
  callbackData: NasmobCallbackRequest,
  navigation?: any,
): Promise<any> => {
  try {
    const env = getEnv();
    const url = `${env.GATEWAY_NODEJS}/callbackNasmob`;

    console.log('NStation 콜백 전송:', callbackData);

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${env.GATEWAY_AUTH_CODE}`,
      },
      body: JSON.stringify(callbackData),
    });

    const result = await response.json();
    console.log('NStation 콜백 응답:', result);
    return result;
  } catch (error) {
    console.error('NStation 콜백 전송 실패:', error);
    if (navigation) {
      await handleTimeoutError(navigation);
    }
    throw error;
  }
};

export const gatewayNodeJS = async (
  endpoint: string,
  method: string = 'POST',
  requestBody: any = {},
  navigation?: any,
): Promise<any> => {
  try {
    const env = getEnv();
    const url = `${env.GATEWAY_NODEJS}/${endpoint}`;

    console.log(`🌐 [gatewayNodeJS] API 호출 시작`);
    if (endpoint === 'getTopAd5') {
      console.log(`🌐 [gatewayNodeJS] endpoint: ${endpoint}`);
      console.log(`🌐 [gatewayNodeJS] method: ${method}`);
      console.log(`🌐 [gatewayNodeJS] url: ${url}`);
      console.log(`🌐 [gatewayNodeJS] requestBody:`, JSON.stringify(requestBody, null, 2));
    }

    const fetchOptions: RequestInit = {
      method: method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${env.GATEWAY_AUTH_CODE}`,
      },
    };

    if (method.toUpperCase() !== 'GET') {
      fetchOptions.body = JSON.stringify(requestBody);
    }

    const response = await fetch(url, fetchOptions);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    if (endpoint === 'getTopAd5') {
      console.log(`✅ [gatewayNodeJS] API 응답 성공`);
      console.log(`✅ [gatewayNodeJS] endpoint: ${endpoint}`);
      console.log(`✅ [gatewayNodeJS] result.data length:`, result?.data?.length || 'N/A');
      console.log(`✅ [gatewayNodeJS] 전체 응답 구조:`, {
        success: result?.success,
        dataLength: result?.data?.length,
        hasData: !!result?.data,
        hasAds: !!result?.ads,
        isArray: Array.isArray(result),
      });
    }

    return result;
  } catch (error) {
    console.error(`Gateway NodeJS 오류 (${endpoint}):`, error);
    if (navigation) {
      await handleTimeoutError(navigation);
    }
    throw error;
  }
};

export const getCryptoPricesInKRW = async (
  navigation?: any,
): Promise<any> => {
  try {
    const env = getEnv();
    const url = `${env.GATEWAY_NODEJS}/cryptoPricesInKRW`;

    console.log('=== cryptoPricesInKRW API 호출 ===');

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${env.GATEWAY_AUTH_CODE}`,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log('=== cryptoPricesInKRW API 응답 ===');
    console.log('response:', JSON.stringify(result, null, 2));

    return result;
  } catch (error) {
    console.error('cryptoPricesInKRW API 호출 실패:', error);
    if (navigation) {
      await handleTimeoutError(navigation);
    }
    throw error;
  }
};

export const getMemberLimits = async (
  member: string,
  navigation?: any,
): Promise<any> => {
  try {
    const env = getEnv();
    const url = `${env.GATEWAY_NODEJS}/memberLimits`;

    const requestBody = {
      member: member,
    };

    console.log('=== memberLimits API 호출 ===');
    console.log('requestBody:', JSON.stringify(requestBody));

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${env.GATEWAY_AUTH_CODE}`,
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log('=== memberLimits API 응답 ===');
    console.log('response:', JSON.stringify(result, null, 2));

    return result;
  } catch (error) {
    console.error('memberLimits API 호출 실패:', error);
    if (navigation) {
      await handleTimeoutError(navigation);
    }
    throw error;
  }
};

export const gatewayNodeJSApp3100 = async (
  advertisement: number,
  coin: string,
  member: string,
  joindesc: string,
  name: string,
  xrunPrice: number,
  navigation?: any,
): Promise<any> => {
  try {
    const axiosInstance = createAxiosInstance(navigation);
    const requestBody = {
      advertisement: advertisement,
      coin: coin,
      member: member,
      joindesc: joindesc,
      name: name,
      xrunPrice: xrunPrice,
    };

    console.log('Gateway NodeJS 요청 (app3100-01):', requestBody);

    const response = await axiosInstance.post('/app3100-01', requestBody);

    console.log('Gateway NodeJS 응답 성공:', response.data);
    return response.data;
  } catch (error) {
    console.error('Gateway NodeJS 오류:', error);
    if (error instanceof AxiosError) {
      console.error('상세 오류 정보:', {
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

export const processAdReward = async (
  member: number | string,
  adId: number | string,
  adType: 'nas' | 'pointclick' = 'nas',
  navigation?: any,
): Promise<any> => {
  try {
    const env = getEnv();
    const url = `${env.GATEWAY_NODEJS}/processAdReward`;

    const requestBody = {
      member: typeof member === 'number' ? member : parseInt(String(member), 10),
      adId: typeof adId === 'number' ? adId : String(adId),
      adType: adType,
    };

    console.log('processAdReward 요청:', requestBody);

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${env.GATEWAY_AUTH_CODE}`,
      },
      body: JSON.stringify(requestBody),
    });

    const result = await response.json();
    console.log('processAdReward 응답:', result);
    return result;
  } catch (error) {
    console.error('processAdReward 호출 실패:', error);
    if (navigation) {
      await handleTimeoutError(navigation);
    }
    throw error;
  }
};

export const getTotalHistory = async (
  member: number,
  currency: number,
  daysbefore: number,
  startwith: number = 0,
  navigation?: any,
): Promise<SettlementListResponse> => {
  try {
    const axiosInstance = createAxiosInstance(navigation);
    const request: SettlementListRequest = {
      member,
      currency,
      daysbefore,
      startwith,
    };

    console.log('[정산] 총 기록 조회 요청:', { member, currency, daysbefore, startwith });

    const response = await axiosInstance.post<SettlementListResponse>(
      '/app4200-05',
      request,
    );

    console.log('[정산] 총 기록 조회 성공, 개수:', response.data.data?.length || 0);
    console.log('[정산] 총 기록 응답 데이터:', JSON.stringify(response.data, null, 2));

    return response.data;
  } catch (error) {
    console.error('[정산] 총 기록 조회 오류:', error);
    if (error instanceof AxiosError) {
      console.error('[정산] 상세 오류 정보:', {
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

export const getTransferHistory = async (
  member: number,
  currency: number,
  daysbefore: number,
  startwith: number = 0,
  navigation?: any,
): Promise<SettlementListResponse> => {
  try {
    const axiosInstance = createAxiosInstance(navigation);
    const request: SettlementListRequest = {
      member,
      currency,
      daysbefore,
      startwith,
    };

    console.log('[정산] 이체 내역 조회 요청:', { member, currency, daysbefore, startwith });

    const response = await axiosInstance.post<SettlementListResponse>(
      '/app4200-06',
      request,
    );

    console.log('[정산] 이체 내역 조회 성공, 개수:', response.data.data?.length || 0);

    return response.data;
  } catch (error) {
    console.error('[정산] 이체 내역 조회 오류:', error);
    if (error instanceof AxiosError) {
      console.error('[정산] 상세 오류 정보:', {
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

export const getReceivedDetails = async (
  member: number,
  currency: number,
  daysbefore: number,
  startwith: number = 0,
  navigation?: any,
): Promise<SettlementListResponse> => {
  try {
    const axiosInstance = createAxiosInstance(navigation);
    const request: SettlementListRequest = {
      member,
      currency,
      daysbefore,
      startwith,
    };

    console.log('[정산] 받은 내역 조회 요청:', { member, currency, daysbefore, startwith });

    const response = await axiosInstance.post<SettlementListResponse>(
      '/app4200-01',
      request,
    );

    console.log('[정산] 받은 내역 조회 성공, 개수:', response.data.data?.length || 0);

    return response.data;
  } catch (error) {
    console.error('[정산] 받은 내역 조회 오류:', error);
    if (error instanceof AxiosError) {
      console.error('[정산] 상세 오류 정보:', {
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

export const getTransitionHistory = async (
  member: number,
  currency: number,
  daysbefore: number,
  startwith: number = 0,
  navigation?: any,
): Promise<SettlementListResponse> => {
  try {
    const axiosInstance = createAxiosInstance(navigation);
    const request: SettlementListRequest = {
      member,
      currency,
      daysbefore,
      startwith,
    };

    console.log('[정산] 전송 내역 조회 요청:', { member, currency, daysbefore, startwith });

    const response = await axiosInstance.post<SettlementListResponse>(
      '/app4200-03',
      request,
    );

    console.log('[정산] 전송 내역 조회 성공, 개수:', response.data.data?.length || 0);

    return response.data;
  } catch (error) {
    console.error('[정산] 전송 내역 조회 오류:', error);
    if (error instanceof AxiosError) {
      console.error('[정산] 상세 오류 정보:', {
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

export const getCompletedAds = async (
  member: number,
  navigation?: any,
): Promise<GetCompletedAdsResponse> => {
  try {
    const axiosInstance = createAxiosInstance(navigation);
    const request: GetCompletedAdsRequest = {
      member,
    };

    console.log('[광고] 완료된 광고 조회 요청:', { member });

    const response = await axiosInstance.post<GetCompletedAdsResponse>(
      '/app5010-02',
      request,
    );

    console.log('[광고] 완료된 광고 조회 성공, 개수:', response.data.data?.length || 0);

    return response.data;
  } catch (error) {
    console.error('[광고] 완료된 광고 조회 오류:', error);
    if (error instanceof AxiosError) {
      console.error('[광고] 상세 오류 정보:', {
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

export const getSavedAds = async (
  member: number,
  orderField: 'datetime' | 'dateleft' | 'amount' = 'datetime',
  navigation?: any,
): Promise<GetSavedAdsResponse> => {
  try {
    const axiosInstance = createAxiosInstance(navigation);
    const request: GetSavedAdsRequest = {
      member,
      orderField,
    };

    console.log('[광고] 저장된 광고 목록 조회 요청:', { member, orderField });

    const response = await axiosInstance.post<GetSavedAdsResponse>(
      '/app5010-01',
      request,
    );

    console.log('[광고] 저장된 광고 목록 조회 성공, 개수:', response.data.data?.length || 0);

    return response.data;
  } catch (error) {
    console.error('[광고] 저장된 광고 목록 조회 오류:', error);
    if (error instanceof AxiosError) {
      console.error('[광고] 상세 오류 정보:', {
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

export const getSettlementList = async (
  member: number,
  navigation?: any,
): Promise<GetSettlementListResponse> => {
  try {
    const axiosInstance = createAxiosInstance(navigation);
    const request: GetSettlementListRequest = { member };

    console.log('[정산] 정산 목록 조회 요청:', { member });

    const response = await axiosInstance.post<GetSettlementListResponse>(
      '/getSettlementList',
      request,
    );

    console.log('[정산] 정산 목록 조회 성공, 개수:', response.data.data?.length || 0);

    return response.data;
  } catch (error) {
    console.error('[정산] 정산 목록 조회 오류:', error);
    if (error instanceof AxiosError) {
      console.error('[정산] 상세 오류 정보:', {
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

export const getSettlementCompletedList = async (
  member: number,
  navigation?: any,
): Promise<GetSettlementCompletedListResponse> => {
  try {
    const axiosInstance = createAxiosInstance(navigation);
    const request = { member };

    console.log('[정산완료] 정산완료 리스트 조회 요청:', { member });

    const response = await axiosInstance.post<GetSettlementCompletedListResponse>(
      '/getSettlementList',
      request,
    );

    console.log('[정산완료] 정산완료 리스트 조회 성공, 개수:', response.data.data?.length || 0);

    return response.data;
  } catch (error) {
    console.error('[정산완료] 정산완료 리스트 조회 오류:', error);
    if (error instanceof AxiosError) {
      console.error('[정산완료] 상세 오류 정보:', {
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

export const getSettlementAmount = async (
  member: number,
  navigation?: any,
): Promise<GetSettlementAmountResponse> => {
  try {
    const axiosInstance = createAxiosInstance(navigation);
    const request: GetSettlementAmountRequest = { member };

    console.log('[정산] 정산 총액 조회 요청:', { member });

    const response = await axiosInstance.post<GetSettlementAmountResponse>(
      '/getSettlementAmount',
      request,
    );

    console.log('[정산] 정산 총액 조회 성공:', response.data.data?.[0]?.amount || '0');

    return response.data;
  } catch (error) {
    console.error('[정산] 정산 총액 조회 오류:', error);
    if (error instanceof AxiosError) {
      console.error('[정산] 상세 오류 정보:', {
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

export const getRank = async (
  navigation?: any,
): Promise<GetRankResponse> => {
  try {
    const axiosInstance = createAxiosInstance(navigation);
    const request: GetRankRequest = {};

    console.log('[Rank] 전체 순위 조회 요청');

    const response = await axiosInstance.post<GetRankResponse>(
      '/getRank',
      request,
    );

    console.log('[Rank] 전체 순위 조회 성공, 개수:', response.data.data?.length || 0);
    console.log('[Rank] 전체 순위 데이터:', response.data.data);

    return response.data;
  } catch (error) {
    console.error('[Rank] 전체 순위 조회 오류:', error);
    if (error instanceof AxiosError) {
      console.error('[Rank] 상세 오류 정보:', {
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

export const getRankSpesific = async (
  member: number,
  navigation?: any,
): Promise<GetRankSpesificResponse> => {
  try {
    const axiosInstance = createAxiosInstance(navigation);
    const request: GetRankSpesificRequest = { member };

    console.log('[Rank] 사용자 순위 조회 요청:', { member });

    const response = await axiosInstance.post<GetRankSpesificResponse>(
      '/getRankSpesific',
      request,
    );

    console.log('[Rank] 사용자 순위 조회 성공:', response.data.data?.[0]?.unique_rank || '-');

    return response.data;
  } catch (error) {
    console.error('[Rank] 사용자 순위 조회 오류:', error);
    if (error instanceof AxiosError) {
      console.error('[Rank] 상세 오류 정보:', {
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

export const getMyGroup = async (
  member: string,
  navigation?: any,
): Promise<GetMyGroupResponse> => {
  try {
    const axiosInstance = createAxiosInstance(navigation);
    const request: GetMyGroupRequest = { member };

    console.log('[내 그룹] 내 그룹 조회 요청:', { member });

    const response = await axiosInstance.post<GetMyGroupResponse>(
      '/getMyGroup',
      request,
    );

    console.log('[내 그룹] 내 그룹 조회 성공, 개수:', response.data.data?.length || 0);

    return response.data;
  } catch (error) {
    console.error('[내 그룹] 내 그룹 조회 오류:', error);
    if (error instanceof AxiosError) {
      console.error('[내 그룹] 상세 오류 정보:', {
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

export const getMyRecommender = async (
  member: string,
  navigation?: any,
): Promise<GetMyRecommenderResponse> => {
  try {
    const axiosInstance = createAxiosInstance(navigation);
    const request: GetMyRecommenderRequest = { member };

    console.log('[레퍼럴 수정] 현재 레퍼럴 조회 요청:', { member });

    const response = await axiosInstance.post<GetMyRecommenderResponse>(
      '/getMyRecommender',
      request,
    );

    console.log('[레퍼럴 수정] 현재 레퍼럴 조회 성공:', response.data.status);

    return response.data;
  } catch (error) {
    console.error('[레퍼럴 수정] 현재 레퍼럴 조회 오류:', error);
    if (error instanceof AxiosError) {
      console.error('[레퍼럴 수정] 상세 오류 정보:', {
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

export const checkCanSetRecommender = async (
  member: string,
  email: string,
  navigation?: any,
): Promise<CheckCanSetRecommenderResponse> => {
  try {
    const axiosInstance = createAxiosInstance(navigation);
    const request: CheckCanSetRecommenderRequest = {
      member,
      email: email.trim(),
    };

    console.log('[레퍼럴 수정] 레퍼럴 설정 가능 여부 검증 요청:', { member, email: email.trim() });

    const response = await axiosInstance.post<CheckCanSetRecommenderResponse>(
      '/checkCanSetRecommender',
      request,
    );

    const responseCode = response.status;
    const responseData = response.data;

    console.log('[레퍼럴 수정] 레퍼럴 설정 가능 여부 검증 응답:', {
      code: responseCode,
      status: responseData.status,
      message: responseData.message,
    });

    return {
      ...responseData,
      code: responseCode,
      status_code: responseCode,
    };
  } catch (error) {
    console.error('[레퍼럴 수정] 레퍼럴 설정 가능 여부 검증 오류:', error);
    if (error instanceof AxiosError) {
      const statusCode = error.response?.status || 500;
      console.error('[레퍼럴 수정] 상세 오류 정보:', {
        url: error.config?.url,
        method: error.config?.method,
        status: statusCode,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message,
      });

      return {
        status: 'error',
        code: statusCode,
        status_code: statusCode,
        message: error.response?.data?.message || error.message,
        data: error.response?.data?.data,
      };
    }
    throw error;
  }
};

export const setRecommender = async (
  member: string,
  email: string,
  navigation?: any,
): Promise<SetRecommenderResponse> => {
  try {
    const axiosInstance = createAxiosInstance(navigation);
    const request: SetRecommenderRequest = {
      member,
      email: email.trim(),
    };

    console.log('[레퍼럴 수정] 레퍼럴 설정 요청:', { member, email: email.trim() });

    const response = await axiosInstance.post<SetRecommenderResponse>(
      '/setRecommender',
      request,
    );

    console.log('[레퍼럴 수정] 레퍼럴 설정 성공:', response.data.status);

    return response.data;
  } catch (error) {
    console.error('[레퍼럴 수정] 레퍼럴 설정 오류:', error);
    if (error instanceof AxiosError) {
      console.error('[레퍼럴 수정] 상세 오류 정보:', {
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

export const getXRUNGopaxPrice = async (
  navigation?: any,
): Promise<GetXRUNGopaxPriceResponse> => {
  try {
    const axiosInstance = createAxiosInstance(navigation);
    const request: GetXRUNGopaxPriceRequest = {};

    console.log('[상점] 고팍스 XRUN 가격 조회 요청');

    const response = await axiosInstance.post<GetXRUNGopaxPriceResponse>(
      '/getXRUNGopaxPrice',
      request,
    );

    const price = response.data.data?.gopaxPrice || 0;
    console.log('[상점] 고팍스 XRUN 가격 조회 성공:', price);

    return response.data;
  } catch (error) {
    console.error('[상점] 고팍스 XRUN 가격 조회 오류:', error);
    if (error instanceof AxiosError) {
      console.error('[상점] 상세 오류 정보:', {
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

const XRUN_MOCK_EMAIL = 'oth-test@example.invalid';
const XRUN_MOCK_BALANCE = '4000';

export const getUserBalance = async (
  member: string,
  navigation?: any,
): Promise<GetUserBalanceResponse> => {
  try {
    const storedEmail = await AsyncStorage.getItem('userEmail');
    if (storedEmail?.trim().toLowerCase() === XRUN_MOCK_EMAIL.toLowerCase()) {
      console.log('[상점] 개발용 XRUN mock 잔액:', XRUN_MOCK_BALANCE, '(이메일:', XRUN_MOCK_EMAIL, ')');
      return {
        status: 'success',
        code: 200,
        data: {
          realtimeBalance: {
            balance: XRUN_MOCK_BALANCE,
            lastUpdated: new Date().toISOString(),
            success: true,
          },
        },
      };
    }

    const axiosInstance = createAxiosInstance(navigation);
    const request: GetUserBalanceRequest = { member };

    console.log('[상점] 사용자 잔액 조회 요청:', { member });

    const response = await axiosInstance.post<GetUserBalanceResponse>(
      '/app4000-01-rev-01-18only',
      request,
    );

    const balance = response.data.data?.realtimeBalance?.balance || '0';
    console.log('[상점] 사용자 잔액 조회 성공:', balance);

    return response.data;
  } catch (error) {
    console.error('[상점] 사용자 잔액 조회 오류:', error);
    if (error instanceof AxiosError) {
      console.error('[상점] 상세 오류 정보:', {
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

export const getUsersBalanceUpdateV2 = async (
  member: string,
  navigation?: any,
): Promise<any> => {
  try {
    const axiosInstance = createAxiosInstance(navigation);
    const request = { member };

    console.log('[잔액 업데이트] 사용자 잔액 업데이트 V2 요청:', { member });

    const response = await axiosInstance.post<any>(
      '/getUsersBalanceUpdateV2',
      request,
    );

    console.log('[잔액 업데이트] 사용자 잔액 업데이트 V2 성공');

    return response.data;
  } catch (error) {
    console.error('[잔액 업데이트] 사용자 잔액 업데이트 V2 오류:', error);
    if (error instanceof AxiosError) {
      console.error('[잔액 업데이트] 상세 오류 정보:', {
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

export const getXrunBuyableItems = async (
  member: string,
  navigation?: any,
): Promise<GetXrunBuyableItemsResponse> => {
  try {
    const axiosInstance = createAxiosInstance(navigation);
    const request: GetXrunBuyableItemsRequest = { member };

    console.log('[상점] 구매 가능한 아이템 조회 요청:', { member });

    const response = await axiosInstance.post<GetXrunBuyableItemsResponse>(
      '/getXrunBuyableItems',
      request,
    );

    console.log('[상점] 구매 가능한 아이템 조회 성공, 개수:', response.data.data?.length || 0);

    return response.data;
  } catch (error) {
    console.error('[상점] 구매 가능한 아이템 조회 오류:', error);
    if (error instanceof AxiosError) {
      console.error('[상점] 상세 오류 정보:', {
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

export const getPointsBalance = async (
  snuid: string,
  navigation?: any,
): Promise<{ current_p_balance: number }> => {
  try {
    const axiosInstance = createAxiosInstance(navigation);
    const request = { snuid };

    console.log('[포인트] 잔액 조회 요청:', { snuid });

    const response = await axiosInstance.post<{ data?: { current_p_balance?: number } }>(
      '/oth-path',
      request,
    );

    const current_p_balance = response.data?.data?.current_p_balance ?? 0;
    console.log('[포인트] 잔액 조회 성공:', current_p_balance);

    return { current_p_balance };
  } catch (error) {
    console.error('[포인트] 잔액 조회 오류:', error);
    if (error instanceof AxiosError) {
      console.error('[포인트] 상세 오류 정보:', {
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

export interface SpendPointsParams {
  snuid: string;
  order_id: string;
  item_name: string;
  spent_amount: number;
}

export const spendPoints = async (
  params: SpendPointsParams,
  navigation?: any,
): Promise<{ remaining_balance: number }> => {
  try {
    const axiosInstance = createAxiosInstance(navigation);

    console.log('[포인트] 사용 요청:', params);

    const response = await axiosInstance.post<{
      data?: { remaining_balance?: number; message?: string };
      message?: string;
    }>('/oth-path', params);

    const remaining_balance = response.data?.data?.remaining_balance ?? 0;
    console.log('[포인트] 사용 성공, remaining_balance:', remaining_balance);

    return { remaining_balance };
  } catch (error) {
    console.error('[포인트] 사용 오류:', error);
    if (error instanceof AxiosError) {
      console.error('[포인트] 상세 오류 정보:', {
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

export interface GetAyetPointsBalanceResponse {
  status?: string;
  code?: number;
  message?: string;
  data?: {
    member?: number;
    total_ayet_points?: number;
    transaction_count?: number;
  };
}

export interface AyetPointsHistoryItem {
  transaction?: number;
  amount?: number;
  datetime?: string;
  ayet_transaction_id?: string;
  campaign_id?: string;
  reward_amount?: number;
  callback_created_at?: string;
  [key: string]: unknown;
}

export interface GetAyetPointsHistoryResponse {
  status?: string;
  code?: number;
  message?: string;
  data?: {
    member?: number;
    history?: AyetPointsHistoryItem[];
    total?: number;
    limit?: number;
    offset?: number;
  };
}

export const getAyetPointsBalance = async (
  member: number | string,
  navigation?: any,
): Promise<{ total_ayet_points: number; transaction_count: number }> => {
  try {
    const axiosInstance = createAxiosInstance(navigation);
    const request = { member: typeof member === 'number' ? member : Number(member) };

    const response = await axiosInstance.post<GetAyetPointsBalanceResponse>(
      '/getAyetPointsBalance',
      request,
    );
    const raw: any = response.data;
    const data: any = raw?.data ?? raw;

    const totalCandidates = [
      data?.total_ayet_points,
      raw?.total_ayet_points,
      data?.balance,
      raw?.balance,
    ];
    const txCountCandidates = [
      data?.transaction_count,
      raw?.transaction_count,
      data?.count,
      raw?.count,
    ];

    const parsedTotal = totalCandidates
      .map((v) => (v == null ? NaN : Number(v)))
      .find((v) => Number.isFinite(v));
    const parsedTxCount = txCountCandidates
      .map((v) => (v == null ? NaN : Number(v)))
      .find((v) => Number.isFinite(v));

    if (!Number.isFinite(parsedTotal as number)) {
      if (__DEV__) {
        console.warn('[ayeT 포인트] 응답 포맷 불일치(raw):', raw);
      }
      throw new Error('getAyetPointsBalance 응답 형식을 해석하지 못했습니다.');
    }

    const total_ayet_points = Number(parsedTotal);
    const transaction_count = Number.isFinite(parsedTxCount as number) ? Number(parsedTxCount) : 0;
    console.log('[ayeT 포인트] 잔액 조회 응답:', {
      member: request.member,
      total_ayet_points,
      transaction_count,
    });
    return { total_ayet_points, transaction_count };
  } catch (error) {
    console.error('[ayeT 포인트] 잔액 조회 오류:', error);
    throw error;
  }
};

export const getXrunWalletBalance = async (
  member: number | string,
  navigation?: any,
): Promise<{ balance: string; formatted: string; symbol: string }> => {
  try {
    const axiosInstance = createAxiosInstance(navigation);
    const response = await axiosInstance.post('/getXrunWalletBalance', {
      member: typeof member === 'number' ? member : Number(member),
    });
    const raw: any = response.data;
    if (raw?.status !== 'success' || !raw?.data) {
      throw new Error(raw?.message ?? 'getXrunWalletBalance 응답 오류');
    }
    return {
      balance: raw.data.balance ?? '0',
      formatted: raw.data.formatted ?? '0',
      symbol: raw.data.symbol ?? 'XRUN',
    };
  } catch (error) {
    console.error('[XRUN 잔액] 조회 오류:', error);
    throw error;
  }
};

export const getAyetPointsHistory = async (
  member: number | string,
  limit: number = 50,
  offset: number = 0,
  navigation?: any,
): Promise<{ history: AyetPointsHistoryItem[]; total: number }> => {
  try {
    const axiosInstance = createAxiosInstance(navigation);
    const request = {
      member: typeof member === 'number' ? member : Number(member),
      limit,
      offset,
    };

    const response = await axiosInstance.post<GetAyetPointsHistoryResponse>(
      '/getAyetPointsHistory',
      request,
    );

    const data = response.data?.data;
    const history = data?.history ?? [];
    const total = data?.total ?? 0;
    return { history, total };
  } catch (error) {
    console.error('[ayeT 포인트] 내역 조회 오류:', error);
    throw error;
  }
};

export const getXrunPurchasedItems = async (
  member: string,
  navigation?: any,
): Promise<GetXrunPurchasedItemsResponse> => {
  try {
    const axiosInstance = createAxiosInstance(navigation);
    const request: GetXrunPurchasedItemsRequest = { member };

    console.log('[상점] 구매한 아이템 조회 요청:', { member });

    const response = await axiosInstance.post<GetXrunPurchasedItemsResponse>(
      '/getXrunPurchasedItems',
      request,
    );

    console.log('[상점] 구매한 아이템 조회 성공, 개수:', response.data.data?.length || 0);

    return response.data;
  } catch (error) {
    console.error('[상점] 구매한 아이템 조회 오류:', error);
    if (error instanceof AxiosError) {
      console.error('[상점] 상세 오류 정보:', {
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

export const getMyGiftishowCoupons = async (
  member: string,
  navigation?: any,
): Promise<GetMyGiftishowCouponsResponse> => {
  try {
    const axiosInstance = createAxiosInstance(navigation);
    const response = await axiosInstance.post<GetMyGiftishowCouponsResponse>(
      '/getMyGiftishowCoupons',
      { member },
    );
    return response.data;
  } catch (error) {
    console.error('[기프티쇼] 구매 쿠폰 목록 조회 오류:', error);
    if (error instanceof AxiosError) {
      console.error('[기프티쇼] 상세:', error.response?.status, error.response?.data);
    }
    throw error;
  }
};

export const purchaseGiftWithXplayPoints = async (
  params: PurchaseGiftWithXplayPointsRequest,
  navigation?: any,
): Promise<PurchaseGiftWithXplayPointsResponse> => {
  try {
    const body = {
      member: params.member,
      goods_code: params.goods_code,
      phone_no: params.phone_no ?? '',
    };
    if (__DEV__) {
      console.log('[기프티쇼] Xplay 구매 요청 body:', { ...body, phone_no: body.phone_no ? `${body.phone_no.slice(0, 3)}***` : '(없음)' });
    }
    const axiosInstance = createAxiosInstance(navigation);
    const response = await axiosInstance.post<PurchaseGiftWithXplayPointsResponse>(
      '/purchaseGiftWithXplayPoints',
      body,
    );
    const data = response.data;
    if (data?.status === 'success') {
      console.log('[기프티쇼] Xplay 구매 성공:', { member: params.member, goods_code: params.goods_code, data: data?.data });
    } else {
      console.warn('[기프티쇼] Xplay 구매 실패(응답):', data?.message ?? data);
    }
    return data;
  } catch (error) {
    const msg = error instanceof AxiosError
      ? (error.response?.data as any)?.message || error.message
      : (error as Error).message;
    console.error('[기프티쇼] Xplay 구매 오류:', msg, error);
    if (error instanceof AxiosError) {
      const data = error.response?.data as any;
      return {
        status: 'error',
        code: error.response?.status,
        message: data?.message || error.message,
      };
    }
    return { status: 'error', message: (error as Error).message };
  }
};

export const purchaseXrunItem = async (
  member: string,
  item: number,
  amount: string,
  navigation?: any,
): Promise<PurchaseXrunItemResponse> => {
  try {
    const axiosInstance = createAxiosInstance(navigation);
    const request: PurchaseXrunItemRequest = {
      member,
      item,
      amount: amount.toString(),
    };

    console.log('[상점] XRUN 아이템 구매 요청:', { member, item, amount });

    const response = await axiosInstance.post<PurchaseXrunItemResponse>(
      '/purchaseXrunItem',
      request,
    );

    console.log('[상점] XRUN 아이템 구매 성공:', response.data.status);

    return response.data;
  } catch (error) {
    console.error('[상점] XRUN 아이템 구매 오류:', error);
    if (error instanceof AxiosError) {
      console.error('[상점] 상세 오류 정보:', {
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

export const saveInappPurchaseLog = async (
  status: string,
  member: string,
  navigation?: any,
): Promise<SaveInappPurchaseLogResponse> => {
  try {
    const axiosInstance = createAxiosInstance(navigation);
    const request: SaveInappPurchaseLogRequest = {
      status,
      member,
    };

    console.log('[상점] 구매 로그 저장 요청:', { status, member });

    const response = await axiosInstance.post<SaveInappPurchaseLogResponse>(
      '/saveInappPurchaseLog',
      request,
    );

    const affectedRows = response.data.data?.[0]?.affectedRows || 0;
    console.log('[상점] 구매 로그 저장 성공:', affectedRows === 1 ? 'ok' : 'no');

    return response.data;
  } catch (error) {
    console.error('[상점] 구매 로그 저장 오류:', error);
    if (error instanceof AxiosError) {
      console.error('[상점] 상세 오류 정보:', {
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

export const deleteXrunPurchasedItem = async (
  member: string,
  storage: string,
  navigation?: any,
): Promise<DeleteXrunPurchasedItemResponse> => {
  try {
    const axiosInstance = createAxiosInstance(navigation);
    const request: DeleteXrunPurchasedItemRequest = {
      member,
      storage,
    };

    console.log('[상점] 구매한 아이템 삭제 요청:', { member, storage });

    const possibleEndpoints = [
      '/deleteXrunItem', 
      '/app4000-04-delete', 
      '/app4000-04delete',   
      '/deleteXrunPurchasedItem', 
      '/app4000-delete',     
    ];

    let lastError: any = null;
    for (const endpoint of possibleEndpoints) {
      try {
        console.log(`[상점] 삭제 API 엔드포인트 시도: ${endpoint}`);
        const response = await axiosInstance.post<DeleteXrunPurchasedItemResponse>(
          endpoint,
          request,
        );

        console.log(`[상점] 엔드포인트 ${endpoint} 응답:`, response.data);

        if (response.data.status === 'success') {
          console.log(`[상점] 삭제 성공 (엔드포인트: ${endpoint}):`, response.data.status);
          return response.data;
        }

        if (response.data.status === 'error') {

          if (response.data.code === 404) {
            console.log(`[상점] 엔드포인트 ${endpoint} 404 에러, 다음 엔드포인트 시도`);
            lastError = response.data;
            continue;
          }

          console.log(`[상점] 삭제 실패 (엔드포인트: ${endpoint}):`, response.data.message);
          return response.data;
        }

        lastError = response.data;
      } catch (error: any) {
        const errorMessage = error?.response?.data?.message || error?.message || '알 수 없는 오류';
        const errorCode = error?.response?.data?.code || error?.response?.status;
        console.log(`[상점] 엔드포인트 ${endpoint} 실패:`, errorMessage);

        if (error?.response?.status && error.response.status !== 404) {
          lastError = error;
          break;
        }

        if (errorCode && errorCode !== 404) {
          lastError = error;
          break;
        }

        lastError = error;
      }
    }

    console.error('[상점] 모든 삭제 API 엔드포인트 실패');
    if (lastError) {

      if (lastError.status || lastError.code) {
        throw lastError;
      }

      if (lastError.response) {
        throw lastError;
      }
    }
    throw new Error('삭제 API 엔드포인트를 찾을 수 없습니다.');
  } catch (error) {
    console.error('[상점] 구매한 아이템 삭제 오류:', error);
    if (error instanceof AxiosError) {
      console.error('[상점] 상세 오류 정보:', {
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

export const fetchWalletData = async (
  member: number | string,
  daysbefore: number = 7,
  navigation?: any,
): Promise<WalletDataResponse> => {
  try {
    const axiosInstance = createAxiosInstance(navigation);
    const requestBody = {
      member,
      daysbefore,
    };

    console.log('[지갑] 지갑 데이터 조회 요청:', { member, daysbefore });

    const response = await axiosInstance.post<WalletDataResponse>(
      '/app4000-01-rev-01',
      requestBody,
    );

    console.log('[지갑] 지갑 데이터 조회 성공');

    return response.data;
  } catch (error) {
    console.error('[지갑] 지갑 데이터 조회 오류:', error);
    if (error instanceof AxiosError) {
      console.error('[지갑] 상세 오류 정보:', {
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

export const fetchOtherChainsStatus = async (
  member: number | string,
  navigation?: any,
): Promise<OtherChainsStatusResponse> => {
  try {
    const axiosInstance = createAxiosInstance(navigation);
    const requestBody = {
      member,
    };

    console.log('[지갑] 다른 체인 상태 조회 요청:', { member });

    const response = await axiosInstance.post<OtherChainsStatusResponse>(
      '/showOtherChains',
      requestBody,
    );

    console.log('[지갑] 다른 체인 상태 조회 성공');

    return response.data;
  } catch (error) {
    console.error('[지갑] 다른 체인 상태 조회 오류:', error);
    if (error instanceof AxiosError) {
      console.error('[지갑] 상세 오류 정보:', {
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

export const fetchADXRUNTopBanners = async (
  member: number | string,
  navigation?: any,
): Promise<ADXRUNTopBannersResponse> => {
  try {
    const axiosInstance = createAxiosInstance(navigation);
    const requestBody = {
      member,
    };

    console.log('[지갑] AD XRUN 배너 데이터 조회 요청:', { member });

    const response = await axiosInstance.post<ADXRUNTopBannersResponse>(
      '/ap4000-adxrun-topbanners',
      requestBody,
    );

    console.log('[지갑] AD XRUN 배너 데이터 조회 성공');

    return response.data;
  } catch (error) {
    console.error('[지갑] AD XRUN 배너 데이터 조회 오류:', error);
    if (error instanceof AxiosError) {
      console.error('[지갑] 상세 오류 정보:', {
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

export const fetchTokenBalance = async (
  address: string,
  contract: string,
  currency: number,
  navigation?: any,
): Promise<TokenBalanceResponse> => {
  try {
    const axiosInstance = createAxiosInstance(navigation);
    const requestBody = {
      address,
      contract,
      currency,
    };

    console.log('[지갑] 토큰 잔액 조회 요청:', { address, contract, currency });

    const response = await axiosInstance.post<TokenBalanceResponse>(
      '/refreshBalancesCommon',
      requestBody,
    );

    console.log('[지갑] 토큰 잔액 조회 성공');

    return response.data;
  } catch (error) {
    console.error('[지갑] 토큰 잔액 조회 오류:', error);
    if (error instanceof AxiosError) {
      console.error('[지갑] 상세 오류 정보:', {
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

export const fetchADXRUNEstimateList = async (
  member: number | string,
  page: number = 1,
  navigation?: any,
): Promise<ADXRUNEstimateListResponse> => {
  try {
    const axiosInstance = createAxiosInstance(navigation);
    const requestBody = {
      member,
      page,
    };

    console.log('[AD XRUN] 심사중 리스트 조회 요청:', { member, page });

    const response = await axiosInstance.post<ADXRUNEstimateListResponse>(
      '/ap4000-adxrun-estimatelist',
      requestBody,
    );

    console.log('[AD XRUN] 심사중 리스트 조회 성공');

    return response.data;
  } catch (error) {
    console.error('[AD XRUN] 심사중 리스트 조회 오류:', error);
    if (error instanceof AxiosError) {
      console.error('[AD XRUN] 상세 오류 정보:', {
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

export const fetchADXRUNResultList = async (
  member: number | string,
  page: number = 1,
  navigation?: any,
): Promise<ADXRUNResultListResponse> => {
  try {
    const axiosInstance = createAxiosInstance(navigation);
    const requestBody = {
      member,
      page,
    };

    console.log('[AD XRUN] 정산완료 리스트 조회 요청:', { member, page });

    const response = await axiosInstance.post<ADXRUNResultListResponse>(
      '/ap4000-adxrun-resultlist',
      requestBody,
    );

    console.log('[AD XRUN] 정산완료 리스트 조회 성공');

    return response.data;
  } catch (error) {
    console.error('[AD XRUN] 정산완료 리스트 조회 오류:', error);
    if (error instanceof AxiosError) {
      console.error('[AD XRUN] 상세 오류 정보:', {
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

export const fetchADXRUNTopBannersSettled = async (
  member: number | string,
  navigation?: any,
): Promise<ADXRUNTopBannersSettledResponse> => {
  try {
    const axiosInstance = createAxiosInstance(navigation);
    const requestBody = {
      member,
    };

    console.log('[AD XRUN] 정산완료 배너 데이터 조회 요청:', { member });

    const response = await axiosInstance.post<ADXRUNTopBannersSettledResponse>(
      '/ap4000-adxrun-topbannersSattled',
      requestBody,
    );

    console.log('[AD XRUN] 정산완료 배너 데이터 조회 성공');

    return response.data;
  } catch (error) {
    console.error('[AD XRUN] 정산완료 배너 데이터 조회 오류:', error);
    if (error instanceof AxiosError) {
      console.error('[AD XRUN] 상세 오류 정보:', {
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

export const fetchQuestList = async (
  member?: number,
  navigation?: any,
): Promise<QuestListResponse> => {
  try {
    const axiosInstance = createAxiosInstance(navigation);

    const url = member ? `/Quests/list?member=${member}` : '/Quests/list';

    console.log('[Quest] 퀘스트 리스트 조회 요청', member ? `(member: ${member})` : '');

    const response = await axiosInstance.get<QuestListResponse>(url);

    console.log('[Quest] 퀘스트 리스트 조회 성공:', response.data.data?.length || 0, '개');

    const attendanceCheckQuest = response.data.data?.find(
      (item) => item.id === 1 || item.id === '1'
    );
    if (attendanceCheckQuest) {
      console.log('[Quest] 출석체크 보상 금액 (서버 응답):', {
        id: attendanceCheckQuest.id,
        title: attendanceCheckQuest.title,
        reward_amount: attendanceCheckQuest.reward_amount,
        reward_amount_asxrun: attendanceCheckQuest.reward_amount_asxrun,
        reward_amount_asxrun_type: typeof attendanceCheckQuest.reward_amount_asxrun,
      });
    }

    return response.data;
  } catch (error) {
    console.error('[Quest] 퀘스트 리스트 조회 오류:', error);
    if (error instanceof AxiosError) {
      console.error('[Quest] 상세 오류 정보:', {
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

export const checkQuestUser = async (
  member: number,
  navigation?: any,
): Promise<QuestCheckUserResponse> => {
  try {
    const axiosInstance = createAxiosInstance(navigation);
    const request: QuestCheckUserRequest = { member };

    console.log('[Quest] 출석 체크 조회 요청:', request);

    let response;
    try {
      response = await axiosInstance.post<QuestCheckUserResponse>(
        '/Quests/checkuser',
        request,
      );
      console.log('[Quest] 출석 체크 조회 성공 (/Quests/checkuser):', response.data);
    } catch (error) {

      console.log('[Quest] /Quests/checkuser 실패, /quest/checkuser 시도');
      response = await axiosInstance.post<QuestCheckUserResponse>(
        '/quest/checkuser',
        request,
      );
      console.log('[Quest] 출석 체크 조회 성공 (/quest/checkuser):', response.data);
    }

    return response.data;
  } catch (error) {
    console.error('[Quest] 출석 체크 조회 오류:', error);
    if (error instanceof AxiosError) {
      console.error('[Quest] 상세 오류 정보:', {
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

export const joinQuest = async (
  request: QuestJoinRequest,
  navigation?: any,
): Promise<QuestJoinResponse> => {
  try {
    const axiosInstance = createAxiosInstance(navigation);

    console.log('[Quest] 퀘스트 참여 요청:', request);

    let response;
    try {
      response = await axiosInstance.post<QuestJoinResponse>(
        '/Quests/join',
        request,
      );
      console.log('[Quest] 퀘스트 참여 성공 (/Quests/join):', response.data);
    } catch (error) {

      console.log('[Quest] /Quests/join 실패, /quest/join 시도');
      response = await axiosInstance.post<QuestJoinResponse>(
        '/quest/join',
        request,
      );
      console.log('[Quest] 퀘스트 참여 성공 (/quest/join):', response.data);
    }

    return response.data;
  } catch (error) {
    console.error('[Quest] 퀘스트 참여 오류:', error);
    if (error instanceof AxiosError) {
      console.error('[Quest] 상세 오류 정보:', {
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

export const checkERC20Token = async (
  contract: string,
  currency: number,
  navigation?: any,
): Promise<ERC20TokenCheckResponse> => {
  try {
    const axiosInstance = createAxiosInstance(navigation);
    const requestBody = {
      contract,
      currency,
    };

    console.log('[지갑] ERC20 토큰 검증 요청:', { contract, currency });

    const response = await axiosInstance.post<ERC20TokenCheckResponse>(
      '/checkERC20Token',
      requestBody,
    );

    console.log('[지갑] ERC20 토큰 검증 성공');

    return response.data;
  } catch (error) {
    console.error('[지갑] ERC20 토큰 검증 오류:', error);
    if (error instanceof AxiosError) {
      console.error('[지갑] 상세 오류 정보:', {
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

export const fetchTotalHistory = async (
  member: number | string,
  currency: number,
  daysbefore: number = 7,
  startwith: number = 0,
  navigation?: any,
): Promise<TransactionHistoryResponse> => {
  try {
    const axiosInstance = createAxiosInstance(navigation);
    const requestBody = {
      member,
      currency,
      daysbefore,
      startwith,
    };

    console.log('[트랜잭션] 전체 히스토리 조회 요청:', { member, currency, daysbefore, startwith });

    const response = await axiosInstance.post<TransactionHistoryResponse>(
      '/app4200-05',
      requestBody,
    );

    console.log('[트랜잭션] 전체 히스토리 조회 성공');

    return response.data;
  } catch (error) {
    console.error('[트랜잭션] 전체 히스토리 조회 오류:', error);
    if (error instanceof AxiosError) {
      console.error('[트랜잭션] 상세 오류 정보:', {
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

export const fetchTransferHistory = async (
  member: number | string,
  currency: number,
  daysbefore: number = 7,
  startwith: number = 0,
  navigation?: any,
): Promise<TransactionHistoryResponse> => {
  try {
    const axiosInstance = createAxiosInstance(navigation);
    const requestBody = {
      member,
      currency,
      daysbefore,
      startwith,
    };

    console.log('[트랜잭션] 전송 히스토리 조회 요청:', { member, currency, daysbefore, startwith });

    const response = await axiosInstance.post<TransactionHistoryResponse>(
      '/app4200-06',
      requestBody,
    );

    console.log('[트랜잭션] 전송 히스토리 조회 성공');

    return response.data;
  } catch (error) {
    console.error('[트랜잭션] 전송 히스토리 조회 오류:', error);
    if (error instanceof AxiosError) {
      console.error('[트랜잭션] 상세 오류 정보:', {
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

export const fetchReceivedDetails = async (
  member: number | string,
  currency: number,
  daysbefore: number = 7,
  startwith: number = 0,
  navigation?: any,
): Promise<TransactionHistoryResponse> => {
  try {
    const axiosInstance = createAxiosInstance(navigation);
    const requestBody = {
      member,
      currency,
      daysbefore,
      startwith,
    };

    console.log('[트랜잭션] 수신 상세 조회 요청:', { member, currency, daysbefore, startwith });

    const response = await axiosInstance.post<TransactionHistoryResponse>(
      '/app4200-01',
      requestBody,
    );

    console.log('[트랜잭션] 수신 상세 조회 성공');

    return response.data;
  } catch (error) {
    console.error('[트랜잭션] 수신 상세 조회 오류:', error);
    if (error instanceof AxiosError) {
      console.error('[트랜잭션] 상세 오류 정보:', {
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

export const fetchTransitionHistory = async (
  member: number | string,
  currency: number,
  daysbefore: number = 7,
  startwith: number = 0,
  navigation?: any,
): Promise<TransactionHistoryResponse> => {
  try {
    const axiosInstance = createAxiosInstance(navigation);
    const requestBody = {
      member,
      currency,
      daysbefore,
      startwith,
    };

    console.log('[트랜잭션] 전환 히스토리 조회 요청:', { member, currency, daysbefore, startwith });

    const response = await axiosInstance.post<TransactionHistoryResponse>(
      '/app4200-03',
      requestBody,
    );

    console.log('[트랜잭션] 전환 히스토리 조회 성공');

    return response.data;
  } catch (error) {
    console.error('[트랜잭션] 전환 히스토리 조회 오류:', error);
    if (error instanceof AxiosError) {
      console.error('[트랜잭션] 상세 오류 정보:', {
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

export const fetchEtherscanTransactions = async (
  member: number | string,
  currency: number,
  page: number = 1,
  offset: number = 20,
  navigation?: any,
): Promise<any> => {
  try {
    const axiosInstance = createAxiosInstance(navigation);
    const requestBody = {
      member: String(member),
      currency,
      page,
      offset,
    };

    console.log('[트랜잭션] Etherscan 거래내역 조회 요청:', requestBody);

    const response = await axiosInstance.post<any>(
      '/etherscan-transactions',
      requestBody,
    );

    console.log('[트랜잭션] Etherscan 거래내역 조회 성공');

    return response.data;
  } catch (error) {
    console.error('[트랜잭션] Etherscan 거래내역 조회 오류:', error);
    if (error instanceof AxiosError) {
      console.error('[트랜잭션] 상세 오류 정보:', {
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

export const getGasEstimation = async (
  fromAddress: string,
  toAddress: string,
  amount: string,
  token: string,
  currency: number,
  network: string = 'ETH',
  chainId: number = 1,
  priorityGasTracker: number = 2,
  navigation?: any,
): Promise<any> => {
  try {
    const env = getEnv();
    const authCode = env.GATEWAY_AUTH_CODE;

    const body = {
      from: fromAddress,
      to: toAddress,
      amount: amount,
      token: token,
      currency: currency,
      network: network,
      chainId: chainId,
      priorityGasTracker: priorityGasTracker,
    };

    console.log('[가스 수수료 예상] API 요청:', body);

    const response = await nodeGatewayRequest('/gasEstimated', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authCode}`,
      },
      body: JSON.stringify(body),
    }, navigation);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log('[가스 수수료 예상] API 응답:', result);

    return result;
  } catch (error) {
    console.error('[가스 수수료 예상] API 호출 실패:', error);
    if (navigation) {
      await handleTimeoutError(navigation);
    }
    throw error;
  }
};

export const postTransferNew = async (
  fromAddress: string,
  toAddress: string,
  amount: string,
  member: string,
  network: string,
  currency: number,
  chainId: number,
  navigation?: any,
): Promise<any> => {
  try {
    const env = getEnv();
    const authCode = env.GATEWAY_AUTH_CODE;

    const body = {
      from: fromAddress,
      to: toAddress,
      amount: amount,
      member: member,
      network: network,
      currency: currency,
      chainId: chainId,
    };

    console.log('[블록체인 전송] API 요청:', body);

    const response = await nodeGatewayRequest('/postTransferNew', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authCode}`,
      },
      body: JSON.stringify(body),
    }, navigation);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log('[블록체인 전송] API 응답:', result);

    return result;
  } catch (error) {
    console.error('[블록체인 전송] API 호출 실패:', error);
    if (navigation) {
      await handleTimeoutError(navigation);
    }
    throw error;
  }
};

export const getWalletPrivateKey = async (
  member: string | number,
  navigation?: any,
): Promise<any> => {
  try {
    const env = getEnv();
    const authCode = env.GATEWAY_AUTH_CODE;

    const body = {
      member: member,
    };

    console.log('[지갑] 프라이빗키 조회 요청:', body);

    const response = await nodeGatewayRequest('/getWalletPrivateKey', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authCode}`,
      },
      body: JSON.stringify(body),
    }, navigation);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log('[지갑] 프라이빗키 조회 응답:', result);

    return result;
  } catch (error) {
    console.error('[지갑] 프라이빗키 조회 실패:', error);
    if (navigation) {
      await handleTimeoutError(navigation);
    }
    throw error;
  }
};

export const getClauseContent = async (
  clauseType: 'service' | 'location' | 'personal',
  language: string,
  navigation?: any,
): Promise<string> => {

  const typeMap: Record<'service' | 'location' | 'personal', number> = {
    service: 1,
    location: 2,
    personal: 3,
  };

  try {
    const env = getEnv();
    const authCode = env.GATEWAY_AUTH_CODE;
    const baseUrl = env.GATEWAY_NODEJS;

    const typeNumber = typeMap[clauseType];
    const endpoint = `/agreements?type=${typeNumber}`;
    const fullUrl = endpoint.startsWith('/')
      ? `${baseUrl}${endpoint}`
      : `${baseUrl}/${endpoint}`;

    console.log('[약관] 약관 내용 요청:', {
      clauseType,
      typeNumber,
      endpoint,
      fullUrl,
      language,
      baseUrl,
    });

    let response: Response;
    try {
      response = await nodeGatewayRequest(endpoint, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authCode}`,
        },
      }, navigation);
    } catch (networkError) {
      console.error('[약관] 네트워크 요청 실패:', {
        clauseType,
        typeNumber,
        endpoint,
        fullUrl,
        error: networkError,
        errorType: networkError instanceof Error ? networkError.constructor.name : typeof networkError,
        errorMessage: networkError instanceof Error ? networkError.message : String(networkError),
        errorStack: networkError instanceof Error ? networkError.stack : undefined,
      });
      throw networkError;
    }

    console.log('[약관] HTTP 응답 상태:', {
      ok: response.ok,
      status: response.status,
      statusText: response.statusText,
      headers: Object.fromEntries(response.headers.entries()),
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => '응답 본문 읽기 실패');
      console.error('[약관] HTTP 에러 응답:', {
        status: response.status,
        statusText: response.statusText,
        errorText,
      });
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
    }

    let data: any;
    try {
      data = await response.json();
    } catch (jsonError) {
      const responseText = await response.text().catch(() => '응답 본문 읽기 실패');
      console.error('[약관] JSON 파싱 실패:', {
        clauseType,
        typeNumber,
        responseText,
        error: jsonError,
      });
      throw new Error(`JSON 파싱 실패: ${jsonError instanceof Error ? jsonError.message : String(jsonError)}`);
    }

    console.log('[약관] API 응답 데이터:', JSON.stringify(data, null, 2));
    console.log('[약관] 응답 구조 분석:', {
      code: data.code,
      hasData: !!data.data,
      dataType: Array.isArray(data.data) ? 'array' : typeof data.data,
      dataLength: Array.isArray(data.data) ? data.data.length : 'N/A',
      dataKeys: data.data && typeof data.data === 'object' && !Array.isArray(data.data)
        ? Object.keys(data.data)
        : 'N/A',
    });

    if (data.code !== 200 || !data.data) {
      console.error('[약관] 응답 데이터 검증 실패:', {
        code: data.code,
        hasData: !!data.data,
        fullResponse: data,
      });
      throw new Error('약관 데이터를 가져올 수 없습니다.');
    }

    const agreementData = data.data;

    if (!agreementData.content) {
      console.error('[약관] 약관 내용이 없습니다:', {
        agreementData,
        hasContent: !!agreementData.content,
      });
      throw new Error('약관 내용이 없습니다.');
    }

    console.log('[약관] 약관 내용 로드 성공:', {
      clauseType,
      typeNumber,
      language,
      contentLength: agreementData.content.length
    });

    return agreementData.content;
  } catch (error) {
    console.error('[약관] 약관 내용 로드 실패:', error);
    if (error instanceof Error) {
      console.error('[약관] 상세 오류 정보:', {
        message: error.message,
        name: error.name,
        stack: error.stack,
        clauseType,
        typeNumber: typeMap[clauseType],
        language,
        endpoint: `/oth-path?type=${typeMap[clauseType]}`,
      });
    } else {
      console.error('[약관] 알 수 없는 에러:', {
        error,
        errorType: typeof error,
        clauseType,
        typeNumber: typeMap[clauseType],
        language,
      });
    }

    throw error;
  }
};

export const getAgreementByType = async (
  type?: 'service' | 'location' | 'personal',
  navigation?: any,
): Promise<AgreementResponse> => {
  try {
    const env = getEnv();
    const authCode = env.GATEWAY_AUTH_CODE;

    const typeMap: Record<'service' | 'location' | 'personal', number> = {
      service: 1,
      location: 2,
      personal: 3,
    };

    const endpoint = type
      ? `/oth-path?type=${typeMap[type]}`
      : '/oth-path';

    console.log('[약관] 약관 데이터 요청:', { type, typeNumber: type ? typeMap[type] : undefined, endpoint });

    const response = await nodeGatewayRequest(endpoint, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authCode}`,
      },
    }, navigation);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: AgreementResponse = await response.json();

    console.log('[약관] 약관 데이터 로드 성공:', { type, hasData: !!data.data });

    return data;
  } catch (error) {
    console.error('[약관] 약관 데이터 로드 실패:', error);
    if (error instanceof Error && error.message === 'API request timeout') {

      throw error;
    }
    throw error;
  }
};

export const getAllAgreements = async (
  navigation?: any,
): Promise<AgreementResponse> => {
  return getAgreementByType(undefined, navigation);
};

const TOP_AD5_STORAGE_KEY = 'topAd5Data';
const TOP_AD5_TIMESTAMP_KEY = 'topAd5Timestamp';
const NEXT_ADS_STORAGE_KEY = 'nextAdsData'; 
const TOP_AD5_REFRESH_INTERVAL = 10 * 60 * 1000; 

const BLOCKLISTED_CAMPAIGN_IDS = new Set<string>(['2151261']);

const isBlocklistedCampaign = (campid: string | number | undefined): boolean => {
  if (!campid) return false;
  return BLOCKLISTED_CAMPAIGN_IDS.has(String(campid));
};

const filterBlocklistedAds = (ads: any[]): any[] => {
  if (!Array.isArray(ads)) return [];
  return ads.filter((ad) => !isBlocklistedCampaign(ad?.campid));
};

let isFetchingTopAd5 = false;
let pendingTopAd5Promise: Promise<any> | null = null;

export const filterBlocklistedAdsFromCache = async (): Promise<void> => {
  try {
    const cachedAdStr = await AsyncStorage.getItem('cached_AD');
    if (cachedAdStr) {
      const cachedAd = JSON.parse(cachedAdStr);
      const beforeCount = Object.keys(cachedAd).length;

      const filteredCache: any = {};
      for (const [campid, data] of Object.entries(cachedAd)) {
        if (!isBlocklistedCampaign(campid)) {
          filteredCache[campid] = data;
        }
      }

      if (Object.keys(filteredCache).length !== beforeCount) {
        await AsyncStorage.setItem('cached_AD', JSON.stringify(filteredCache));
        console.log(`[filterBlocklistedAdsFromCache] 블록리스트 필터링: ${Object.keys(filteredCache).length}/${beforeCount}개 유효`);
      }
    }
  } catch (error) {
    console.error('[filterBlocklistedAdsFromCache] 필터링 실패:', error);
  }
};

export const removeBlocklistedCampaignFromCache = async (campid: string | number): Promise<void> => {
  const campidStr = String(campid);
  try {

    const cachedAdStr = await AsyncStorage.getItem('cached_AD');
    if (cachedAdStr) {
      const cachedAd = JSON.parse(cachedAdStr);
      if (cachedAd[campidStr]) {
        delete cachedAd[campidStr];
        await AsyncStorage.setItem('cached_AD', JSON.stringify(cachedAd));
        console.log(`[removeBlocklistedCampaignFromCache] cached_AD에서 제거: ${campidStr}`);
      }
    }

    await removeAdFromTopAd5(campidStr, undefined); 
  } catch (error) {
    console.error(`[removeBlocklistedCampaignFromCache] ${campidStr} 제거 실패:`, error);
  }
};

export const removeAdFromTopAd5 = async (campid: string | number, navigation?: any): Promise<void> => {
  try {
    const campidStr = String(campid);
    console.log(`[removeAdFromTopAd5] ${campidStr} 제거 및 대체 시작`);

    const storedData = await AsyncStorage.getItem(TOP_AD5_STORAGE_KEY);
    let topAd5Data: any[] = [];
    if (storedData) {
      topAd5Data = JSON.parse(storedData);
      if (Array.isArray(topAd5Data)) {
        const beforeCount = topAd5Data.length;
        topAd5Data = topAd5Data.filter((ad: any) => String(ad.campid || '') !== campidStr);
        if (topAd5Data.length !== beforeCount) {
          console.log(`[removeAdFromTopAd5] TopAd5에서 제거: ${beforeCount} → ${topAd5Data.length}개`);
        }
      }
    }

    try {
      console.log(`[removeAdFromTopAd5] 새로운 광고 가져오기 시작`);
      const newTopAd5Data = await getTopAd5(navigation, true); 

      if (newTopAd5Data && Array.isArray(newTopAd5Data) && newTopAd5Data.length > 0) {

        const existingCampids = new Set(topAd5Data.map((ad: any) => String(ad.campid || '')));
        const newAds = newTopAd5Data.filter((ad: any) => {
          const newCampid = String(ad.campid || '');
          return newCampid !== campidStr && !existingCampids.has(newCampid);
        });

        if (newAds.length > 0) {

          const replacementAd = newAds[0];
          topAd5Data.push(replacementAd);
          console.log(`[removeAdFromTopAd5] 새로운 광고 추가: ${replacementAd.campid || 'N/A'}`);

          await AsyncStorage.setItem(TOP_AD5_STORAGE_KEY, JSON.stringify(topAd5Data));
          await AsyncStorage.setItem(TOP_AD5_TIMESTAMP_KEY, Date.now().toString());
          console.log(`[removeAdFromTopAd5] TopAd5 업데이트 완료: ${topAd5Data.length}개`);
        } else {
          console.log(`[removeAdFromTopAd5] 새로운 광고 없음 - 기존 데이터만 업데이트`);

          await AsyncStorage.setItem(TOP_AD5_STORAGE_KEY, JSON.stringify(topAd5Data));
        }
      } else {
        console.log(`[removeAdFromTopAd5] 새로운 TopAd5 데이터 없음 - 기존 데이터만 업데이트`);

        await AsyncStorage.setItem(TOP_AD5_STORAGE_KEY, JSON.stringify(topAd5Data));
      }
    } catch (newAdError) {
      console.warn(`[removeAdFromTopAd5] 새로운 광고 가져오기 실패:`, newAdError);

      await AsyncStorage.setItem(TOP_AD5_STORAGE_KEY, JSON.stringify(topAd5Data));
    }

    const cachedAdStr = await AsyncStorage.getItem('cached_AD');
    if (cachedAdStr) {
      const cachedAd = JSON.parse(cachedAdStr);
      if (cachedAd[campidStr]) {
        delete cachedAd[campidStr];
        await AsyncStorage.setItem('cached_AD', JSON.stringify(cachedAd));
        console.log(`[removeAdFromTopAd5] cached_AD에서 제거: ${campidStr}`);
      }
    }

    const failedStr = await AsyncStorage.getItem('failedPreFetchCampids');
    if (failedStr) {
      const failed = JSON.parse(failedStr);
      if (Array.isArray(failed) && failed.includes(campidStr)) {
        const filteredFailed = failed.filter((id: string) => id !== campidStr);
        await AsyncStorage.setItem('failedPreFetchCampids', JSON.stringify(filteredFailed));
        console.log(`[removeAdFromTopAd5] failedPreFetchCampids에서 제거: ${campidStr}`);
      }
    }

    console.log(`[removeAdFromTopAd5] ${campidStr} 제거 및 대체 완료`);
  } catch (error) {
    console.error(`[removeAdFromTopAd5] ${campid} 제거 실패:`, error);
  }
};

const COMPLETED_ADS_CACHE_KEY = 'completedAdsCache';
const COMPLETED_ADS_CACHE_TIMESTAMP_KEY = 'completedAdsCacheTimestamp';
const COMPLETED_ADS_CACHE_INTERVAL = 5 * 60 * 1000; 
const COMPLETED_ADS_CACHE_MAX_SIZE = 1000; 

export const getCompletedAdsSet = async (member: number | string, navigation?: any, forceRefresh: boolean = false): Promise<Set<string>> => {
  try {
    const memberNum = typeof member === 'string' ? parseInt(member, 10) : member;

    if (!forceRefresh) {
      try {
        const timestampStr = await AsyncStorage.getItem(COMPLETED_ADS_CACHE_TIMESTAMP_KEY);
        if (timestampStr) {
          const timestamp = parseInt(timestampStr, 10);
          const now = Date.now();
          const elapsed = now - timestamp;

          if (elapsed < COMPLETED_ADS_CACHE_INTERVAL) {
            const cachedStr = await AsyncStorage.getItem(COMPLETED_ADS_CACHE_KEY);
            if (cachedStr) {
              const cached = JSON.parse(cachedStr);
              console.log(`[getCompletedAdsSet] 캐시 사용 (${Math.floor(elapsed / 1000)}초 전 저장)`);
              return new Set(cached);
            }
          }
        }
      } catch (cacheError) {
        console.warn('[getCompletedAdsSet] 캐시 확인 실패, API 호출:', cacheError);
      }
    } else {
      console.log('[getCompletedAdsSet] 강제 새로고침 - 캐시 무시');
    }

    const completedAdsResponse = await getCompletedAds(memberNum, navigation);
    const completedAdsSet = new Set<string>();

    if (completedAdsResponse?.data && Array.isArray(completedAdsResponse.data)) {
      completedAdsResponse.data.forEach((ad: any) => {

        const adTransaction = String(ad.transaction || '');
        const adExtracode = String(ad.extracode || '');
        const adTitle = String(ad.title || '');

        if (adTransaction && /^\d+$/.test(adTransaction)) {
          completedAdsSet.add(adTransaction);
        }
        if (adExtracode && /^\d+$/.test(adExtracode)) {
          completedAdsSet.add(adExtracode);
        }
      });

      try {
        const cacheArray = Array.from(completedAdsSet);

        const limitedArray = cacheArray.length > COMPLETED_ADS_CACHE_MAX_SIZE
          ? cacheArray.slice(-COMPLETED_ADS_CACHE_MAX_SIZE) 
          : cacheArray;

        await AsyncStorage.setItem(COMPLETED_ADS_CACHE_KEY, JSON.stringify(limitedArray));
        await AsyncStorage.setItem(COMPLETED_ADS_CACHE_TIMESTAMP_KEY, Date.now().toString());
        console.log(`[getCompletedAdsSet] 캐시 저장 완료: ${limitedArray.length}개${cacheArray.length > COMPLETED_ADS_CACHE_MAX_SIZE ? ` (${cacheArray.length - COMPLETED_ADS_CACHE_MAX_SIZE}개 제거됨)` : ''}`);
      } catch (cacheError) {
        console.warn('[getCompletedAdsSet] 캐시 저장 실패:', cacheError);

        if (cacheError instanceof Error && cacheError.message.includes('exceeds')) {
          try {
            console.log('[getCompletedAdsSet] 캐시 용량 초과 감지 - 캐시 초기화');
            await AsyncStorage.removeItem(COMPLETED_ADS_CACHE_KEY);
            await AsyncStorage.removeItem(COMPLETED_ADS_CACHE_TIMESTAMP_KEY);

            const limitedArray = Array.from(completedAdsSet).slice(-Math.floor(COMPLETED_ADS_CACHE_MAX_SIZE / 2));
            await AsyncStorage.setItem(COMPLETED_ADS_CACHE_KEY, JSON.stringify(limitedArray));
            await AsyncStorage.setItem(COMPLETED_ADS_CACHE_TIMESTAMP_KEY, Date.now().toString());
            console.log(`[getCompletedAdsSet] 캐시 초기화 후 저장 완료: ${limitedArray.length}개`);
          } catch (resetError) {
            console.error('[getCompletedAdsSet] 캐시 초기화 실패:', resetError);
          }
        }
      }
    }

    return completedAdsSet;
  } catch (error) {
    console.error('[getCompletedAdsSet] 완료된 광고 목록 조회 실패:', error);

    return new Set<string>();
  }
};

export const addToCompletedAdsCache = async (campid: string): Promise<void> => {
  try {
    const cachedStr = await AsyncStorage.getItem(COMPLETED_ADS_CACHE_KEY);
    let cached: string[] = cachedStr ? JSON.parse(cachedStr) : [];

    if (cached.includes(campid)) {
      return;
    }

    cached.push(campid);

    if (cached.length > COMPLETED_ADS_CACHE_MAX_SIZE) {
      const removeCount = cached.length - COMPLETED_ADS_CACHE_MAX_SIZE;
      cached = cached.slice(removeCount); 
      console.log(`[addToCompletedAdsCache] 크기 제한 초과 - ${removeCount}개 오래된 항목 제거`);
    }

    await AsyncStorage.setItem(COMPLETED_ADS_CACHE_KEY, JSON.stringify(cached));
    await AsyncStorage.setItem(COMPLETED_ADS_CACHE_TIMESTAMP_KEY, Date.now().toString());
    console.log(`[addToCompletedAdsCache] completedAdsCache에 추가: ${campid} (총 ${cached.length}개)`);
  } catch (cacheError) {
    console.warn('[addToCompletedAdsCache] completedAdsCache 업데이트 실패:', cacheError);

    if (cacheError instanceof Error && cacheError.message.includes('exceeds')) {
      try {
        console.log('[addToCompletedAdsCache] 캐시 용량 초과 감지 - 캐시 초기화');
        await AsyncStorage.removeItem(COMPLETED_ADS_CACHE_KEY);
        await AsyncStorage.removeItem(COMPLETED_ADS_CACHE_TIMESTAMP_KEY);

        await AsyncStorage.setItem(COMPLETED_ADS_CACHE_KEY, JSON.stringify([campid]));
        await AsyncStorage.setItem(COMPLETED_ADS_CACHE_TIMESTAMP_KEY, Date.now().toString());
        console.log('[addToCompletedAdsCache] 캐시 초기화 후 새로 추가 완료');
      } catch (resetError) {
        console.error('[addToCompletedAdsCache] 캐시 초기화 실패:', resetError);
      }
    }
  }
};

export const getTopAd5 = async (navigation?: any, forceRefresh: boolean = false, showDetailedLog: boolean = false): Promise<any> => {

  if (isFetchingTopAd5 && pendingTopAd5Promise) {
    console.log('[getTopAd5] 이미 호출 중입니다. 기존 Promise 반환');
    return pendingTopAd5Promise;
  }

  try {

    if (!forceRefresh) {
      const storedData = await getStoredTopAd5();
      if (storedData && storedData.length > 0) {
        try {
          const timestampStr = await AsyncStorage.getItem(TOP_AD5_TIMESTAMP_KEY);
          if (timestampStr) {
            const timestamp = parseInt(timestampStr, 10);
            const now = Date.now();
            const elapsed = now - timestamp;

            if (elapsed < TOP_AD5_REFRESH_INTERVAL) {
              console.log(`[getTopAd5] 캐시 사용 (${Math.floor(elapsed / 1000)}초 전 저장, ${Math.floor((TOP_AD5_REFRESH_INTERVAL - elapsed) / 1000)}초 남음)`);
              return storedData;
            } else {
              console.log(`[getTopAd5] 캐시 만료 (${Math.floor(elapsed / 1000)}초 경과, 10분 초과)`);
            }
          }
        } catch (timestampError) {
          console.log('[getTopAd5] timestamp 확인 실패, API 호출 진행:', timestampError);
        }
      } else {

        try {
          const nextAdsStr = await AsyncStorage.getItem(NEXT_ADS_STORAGE_KEY);
          if (nextAdsStr) {
            const nextAds = JSON.parse(nextAdsStr);
            if (Array.isArray(nextAds) && nextAds.length > 0) {

              const adsFromNext = nextAds.slice(0, 5);
              const remainingNextAds = nextAds.slice(5);

              await AsyncStorage.setItem(TOP_AD5_STORAGE_KEY, JSON.stringify(adsFromNext));
              await AsyncStorage.setItem(TOP_AD5_TIMESTAMP_KEY, Date.now().toString());

              if (remainingNextAds.length > 0) {
                await AsyncStorage.setItem(NEXT_ADS_STORAGE_KEY, JSON.stringify(remainingNextAds));
              } else {
                await AsyncStorage.removeItem(NEXT_ADS_STORAGE_KEY);
              }

              console.log(`[getTopAd5] nextAds에서 ${adsFromNext.length}개 사용, ${remainingNextAds.length}개 남음`);
              return adsFromNext;
            }
          }
        } catch (nextAdsError) {
          console.log('[getTopAd5] nextAds 확인 실패, API 호출 진행:', nextAdsError);
        }
      }
    } else {
      console.log('[getTopAd5] 강제 새로고침 모드 - API 호출');
    }

    if (isFetchingTopAd5 && pendingTopAd5Promise) {
      console.log('[getTopAd5] 캐시 확인 중 다른 호출이 시작되었습니다. 기존 Promise 반환');
      return pendingTopAd5Promise;
    }

    isFetchingTopAd5 = true;
    const apiCallPromise = (async () => {
      const os = Platform.OS === 'ios' ? 'ios' : 'android';

      let member: number | string = '';
      try {
        const userData = await AsyncStorage.getItem('userData');
        if (userData) {
          const parsedUserData = JSON.parse(userData);
          member = parsedUserData?.member || '';
        }
      } catch (userDataError) {
        console.log('[getTopAd5] userData 가져오기 실패:', userDataError);
      }

      let deviceInfo = {};
      try {
        const { collectDeviceInfo } = require('../utils/napApiUtils');
        deviceInfo = await collectDeviceInfo();
      } catch (deviceInfoError) {
        console.log('[getTopAd5] 디바이스 정보 수집 실패:', deviceInfoError);
      }

      const requestBody = {
        os,
        member,
        ...deviceInfo
      };

      console.log('[getTopAd5] ========== API 호출 시작 ==========');
      console.log('[getTopAd5] 요청 파라미터:', { os, member });

      const response = await gatewayNodeJS('getTopAd5', 'POST', requestBody, navigation);

      return response;
    })();

    pendingTopAd5Promise = apiCallPromise;

    const response = await apiCallPromise;

    if (!response) {
      console.warn('[getTopAd5] API 응답이 없습니다.');
      return null;
    }

    console.log('[getTopAd5] ========== 응답 구조 분석 ==========');
    console.log('[getTopAd5] response 타입:', typeof response);
    console.log('[getTopAd5] response가 배열인가?', Array.isArray(response));

    let topAd5Response: any[] = [];
    let nextAdsResponse: any[] = [];

    if (response?.ads && Array.isArray(response.ads)) {
      topAd5Response = response.ads;
      nextAdsResponse = Array.isArray(response.nextAds) ? response.nextAds : [];
    } else if (Array.isArray(response)) {

      topAd5Response = response;
    } else if (response?.data?.ads && Array.isArray(response.data.ads)) {

      topAd5Response = response.data.ads;
      nextAdsResponse = Array.isArray(response.data.nextAds) ? response.data.nextAds : [];
    } else if (response?.data && Array.isArray(response.data)) {

      topAd5Response = response.data;
    } else {
      console.warn('[getTopAd5] 예상하지 못한 response 구조:', response);
      console.warn('[getTopAd5] response 키 목록:', Object.keys(response || {}));
      return null;
    }

    if (topAd5Response.length === 0) {
      console.log('[getTopAd5] ℹ️ 활성 광고 캠페인이 없습니다 (정상 응답)');
      return [];
    }

    const beforeBlocklistFilter = topAd5Response.length;
    topAd5Response = filterBlocklistedAds(topAd5Response);
    const blocklistFilteredCount = beforeBlocklistFilter - topAd5Response.length;

    const seenCampids = new Set<string>();
    let duplicateCount = 0;
    topAd5Response.forEach((ad: any) => {
      const campid = String(ad.campid || '');
      if (campid && campid !== '' && campid !== 'undefined') {
        if (seenCampids.has(campid)) {
          duplicateCount++;
        } else {
          seenCampids.add(campid);
        }
      }
    });

    if (nextAdsResponse && nextAdsResponse.length > 0) {

      try {
        const existingNextAdsStr = await AsyncStorage.getItem(NEXT_ADS_STORAGE_KEY);
        let existingNextAds: any[] = [];
        if (existingNextAdsStr) {
          existingNextAds = JSON.parse(existingNextAdsStr);
        }

        const existingCampids = new Set(existingNextAds.map((ad: any) => String(ad.campid || '')));
        const newNextAds = nextAdsResponse.filter((ad: any) => {
          const campid = String(ad.campid || '');
          return !existingCampids.has(campid);
        });

        const mergedNextAds = [...existingNextAds, ...newNextAds];
        await AsyncStorage.setItem(NEXT_ADS_STORAGE_KEY, JSON.stringify(mergedNextAds));
        console.log('[getTopAd5] ✅ nextAds 저장 완료:', mergedNextAds.length, '개 (기존:', existingNextAds.length, '개 + 신규:', newNextAds.length, '개)');
        if (newNextAds.length > 0) {
          console.log('[getTopAd5] 신규 nextAds campid 목록:', newNextAds.map((ad: any) => ad.campid).join(', '));
        }
      } catch (storageError) {
        console.error('[getTopAd5] nextAds 저장 실패:', storageError);

        await AsyncStorage.setItem(NEXT_ADS_STORAGE_KEY, JSON.stringify(nextAdsResponse));
        console.log('[getTopAd5] nextAds 저장 완료 (병합 실패, 신규만 저장):', nextAdsResponse.length, '개');
      }
    }

    if (topAd5Response && topAd5Response.length > 0) {
      await AsyncStorage.setItem(TOP_AD5_STORAGE_KEY, JSON.stringify(topAd5Response));
      await AsyncStorage.setItem(TOP_AD5_TIMESTAMP_KEY, Date.now().toString());
      console.log('[getTopAd5] AsyncStorage에 저장 완료:', topAd5Response.length, '개 광고');
    } else {
      console.warn('[getTopAd5] 저장할 광고 데이터가 없습니다.');
    }

    return topAd5Response;
  } catch (error) {
    console.error('[getTopAd5] API 호출 실패:', error);

    const storedData = await getStoredTopAd5();
    if (storedData) {
      console.log('[getTopAd5] 에러 발생, 저장된 데이터 반환');
      return storedData;
    }
    throw error;
  } finally {

    isFetchingTopAd5 = false;
    pendingTopAd5Promise = null;
  }
};

export const getStoredTopAd5 = async (): Promise<any | null> => {
  try {
    const storedData = await AsyncStorage.getItem(TOP_AD5_STORAGE_KEY);
    if (storedData) {
      const parsedData = JSON.parse(storedData);

      return parsedData;
    }
    return null;
  } catch (error) {
    console.error('[getStoredTopAd5] AsyncStorage 읽기 실패:', error);
    return null;
  }
};

export const validateTopAd5Urls = async (topAd5Data: any[]): Promise<any[]> => {
  if (!Array.isArray(topAd5Data) || topAd5Data.length === 0) {
    return topAd5Data;
  }

  const itemsWithUrl = topAd5Data.filter(item => {
    const urlAD = item.urlAD;

    if (!urlAD || typeof urlAD !== 'string' || urlAD.trim() === '' || urlAD === '없음' || urlAD === 'No') {
      console.warn('[validateTopAd5Urls] ⚠️ 백엔드에서 필터링되지 않은 항목 발견:', {
        campid: item.campid,
        urlAD: urlAD,
      });
      return false;
    }
    return true;
  });

  if (itemsWithUrl.length === 0) {
    console.log('[validateTopAd5Urls] urlAD가 있는 항목이 없습니다.');
    return topAd5Data.map(item => ({
      ...item,
      isValid: true, 
      urlValidatedAt: Date.now(),
    }));
  }

  console.log(`[validateTopAd5Urls] URL 검증 시작: ${itemsWithUrl.length}개 항목`);

  const validationResults = await Promise.allSettled(
    itemsWithUrl.map(async (item) => {
      try {
        const urlAD = item.urlAD;

        const isIOSAppStoreUrl = urlAD && typeof urlAD === 'string' && (
          urlAD.includes('apps.apple.com') ||
          urlAD.startsWith('itms-apps://') ||
          urlAD.startsWith('itms://')
        );

        if (isIOSAppStoreUrl) {
          console.log(`[validateTopAd5Urls] iOS App Store URL 검증 건너뜀: ${urlAD}`);
          return {
            item,
            isValid: true,
            errorMessage: null,
          };
        }

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000); 

        const response = await fetch(urlAD, {
          method: 'HEAD',
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (response.ok) {
          return {
            item,
            isValid: true,
            errorMessage: null,
          };
        } else {
          return {
            item,
            isValid: false,
            errorMessage: `HTTP ${response.status}`,
          };
        }
      } catch (error: any) {
        return {
          item,
          isValid: false,
          errorMessage: error.name === 'AbortError' ? '타임아웃' : error.message || '알 수 없는 오류',
        };
      }
    })
  );

  const validatedData = topAd5Data.map((item) => {
    if (!item.urlAD || typeof item.urlAD !== 'string' || item.urlAD.trim() === '') {

      return {
        ...item,
        isValid: true,
        urlValidatedAt: Date.now(),
      };
    }

    const result = validationResults.find(
      (result) => result.status === 'fulfilled' && result.value.item === item
    );

    if (result && result.status === 'fulfilled') {
      return {
        ...item,
        isValid: result.value.isValid,
        errorMessage: result.value.errorMessage || undefined,
        urlValidatedAt: Date.now(),
      };
    } else {

      return {
        ...item,
        isValid: false,
        errorMessage: '검증 실패',
        urlValidatedAt: Date.now(),
      };
    }
  });

  const validCount = validatedData.filter(item => item.isValid).length;
  const invalidCount = validatedData.length - validCount;
  console.log(`[validateTopAd5Urls] URL 검증 완료: 유효 ${validCount}개, 무효 ${invalidCount}개`);

  return validatedData;
};

export const sendInAppPurchase = async (
  request: InAppPurchaseRequest,
  navigation?: any,
): Promise<InAppPurchaseResponse> => {
  try {
    const axiosInstance = createAxiosInstance(navigation);

    console.log('========================================');
    console.log('[인앱구매 API] 구매 데이터 전송 시작');
    console.log('========================================');
    console.log('[인앱구매 API] 요청 데이터:');
    console.log(JSON.stringify(request, null, 2));
    console.log('----------------------------------------');

    const response = await axiosInstance.post<InAppPurchaseResponse>(
      '/inapp/purchase',
      request,
    );

    console.log('========================================');
    console.log('[인앱구매 API] ✅ 전송 성공');
    console.log('========================================');
    console.log('[인앱구매 API] 응답 데이터:');
    console.log(JSON.stringify(response.data, null, 2));
    console.log('----------------------------------------');
    console.log('[인앱구매 API] 상태:', response.data?.status);
    console.log('[인앱구매 API] 메시지:', response.data?.message);
    if (response.data?.data?.savedCount !== undefined) {
      console.log('[인앱구매 API] 저장된 수:', response.data.data.savedCount);
    }
    console.log('========================================');

    return response.data;
  } catch (error) {
    console.log('========================================');
    console.error('[인앱구매 API] ❌ 전송 실패');
    console.log('========================================');
    if (error instanceof AxiosError) {
      console.error('[인앱구매 API] 상세 오류 정보:', {
        url: error.config?.url,
        method: error.config?.method,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message,
      });
    } else {
      console.error('[인앱구매 API] 오류:', error);
    }
    console.log('========================================');

    if (navigation) {
      await handleTimeoutError(navigation);
    }
    throw error;
  }
};

export const getMembersLevelInfo = async (
  member: number,
  navigation?: any,
): Promise<any> => {
  try {
    const requestBody = {
      member: member,
    };

    console.log('[레벨 정보] 사용자 레벨 정보 조회 요청:', member);

    const response = await gatewayNodeJS('getMembersLevelInfo', 'POST', requestBody, navigation);

    console.log('[레벨 정보] 사용자 레벨 정보 조회 성공:', response);

    return response;
  } catch (error) {
    console.error('[레벨 정보] 사용자 레벨 정보 조회 오류:', error);
    throw error;
  }
};

export const checkShopSalesMenu = async (
  member: string,
  navigation?: any,
): Promise<any> => {
  try {
    const axiosInstance = createAxiosInstance(navigation);
    const request: any = {
      member,
    };

    console.log('[Shop 매출] 메뉴 표시 여부 확인 요청:', { member });

    const response = await axiosInstance.post<any>(
      '/checkShopSalesMenu',
      request,
    );

    console.log('[Shop 매출] 메뉴 표시 여부 확인 성공:', response.data.data?.showMenu || false);

    return response.data;
  } catch (error) {
    console.error('[Shop 매출] 메뉴 표시 여부 확인 오류:', error);
    if (error instanceof AxiosError) {
      console.error('[Shop 매출] 상세 오류 정보:', {
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

export const getItemInfo = async (
  shopmember: string,
  navigation?: any,
): Promise<GetItemInfoResponse> => {
  try {
    const axiosInstance = createAxiosInstance(navigation);
    const request: GetItemInfoRequest = {
      shopmember,
    };

    console.log('[Shop 매출] 상품 정보 조회 요청:', { shopmember });

    const response = await axiosInstance.post<GetItemInfoResponse>(
      '/getItemInfo',
      request,
    );

    console.log('[Shop 매출] 상품 정보 조회 성공:', response.data.data?.title || 'No title');

    return response.data;
  } catch (error) {
    console.error('[Shop 매출] 상품 정보 조회 오류:', error);
    if (error instanceof AxiosError) {
      console.error('[Shop 매출] 상세 오류 정보:', {
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

export const getItemPurchaseList = async (
  shopmember: string,
  dateFrom?: string,
  dateTo?: string,
  navigation?: any,
): Promise<any> => {
  try {
    const axiosInstance = createAxiosInstance(navigation);
    const request: any = {
      shopmember,
    };

    if (dateFrom) {
      request.dateFrom = dateFrom;
    }
    if (dateTo) {
      request.dateTo = dateTo;
    }

    console.log('[Shop 매출] 구매자 명단 조회 요청:', { shopmember, dateFrom, dateTo });

    const response = await axiosInstance.post<any>(
      '/getItemPurchaseList',
      request,
    );

    console.log('[Shop 매출] 구매자 명단 조회 성공, 개수:', response.data.data?.purchaseList?.length || 0);

    return response.data;
  } catch (error) {
    console.error('[Shop 매출] 구매자 명단 조회 오류:', error);
    if (error instanceof AxiosError) {
      console.error('[Shop 매출] 상세 오류 정보:', {
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

export const deleteShopItem = async (
  shopmember: string,
  item: string,
  navigation?: any,
): Promise<DeleteShopItemResponse> => {
  try {
    const axiosInstance = createAxiosInstance(navigation);
    const request: DeleteShopItemRequest = {
      shopmember,
      item,
    };

    console.log('[Shop 매출] 상품 삭제 요청:', { shopmember, item });

    const response = await axiosInstance.post<DeleteShopItemResponse>(
      '/deleteShopItem',
      request,
    );

    console.log('[Shop 매출] 상품 삭제 성공:', response.data.status);

    return response.data;
  } catch (error) {
    console.error('[Shop 매출] 상품 삭제 오류:', error);
    if (error instanceof AxiosError) {
      console.error('[Shop 매출] 상세 오류 정보:', {
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

export * from './pangle';

export const createItemFromApp = async (
  request: CreateItemFromAppRequest,
  navigation?: any,
): Promise<CreateItemFromAppResponse> => {
  try {
    const axiosInstance = createAxiosInstance(navigation);

    console.log('[상품 등록] 요청:', request);

    const response = await axiosInstance.post<CreateItemFromAppResponse>(
      '/createItemFromApp',
      request,
    );

    console.log('[상품 등록] 성공:', response.data.status);

    return response.data;
  } catch (error) {
    console.error('[상품 등록] 오류:', error);
    if (error instanceof AxiosError) {
      console.error('[상품 등록] 상세 오류 정보:', {
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
