
export type ClauseId = 'service' | 'location' | 'personal';

export type ShopItem = {
  id: string;
  title: string;
  subtitle?: string;
  priceLabel: string;
  detailPrice?: string;
  detailFee?: string;
  detailTotal?: string;
  image: any;
};

export {};

export interface TokenData {
  spotID: number;
  x: number;
  y: number;
  xrunPrice?: number;
  distance?: number;
  name?: string;
  iconurl?: string;
  joindesc?: string;
  brand?: string;
  advertisement?: string;
  coin?: string;
  member?: string;
  campid?: string;
}

export interface AliveResponse {
  success: boolean;
  emergencyStop?: {
    enabled: boolean;
    message?: string;
    link?: string;
  };
}

export type EmergencyStopInfo = {
  enabled: boolean;
  message?: string;
  link?: string;
} | null;

export type CountryDialCode = {
  iso2: string;
  name: string;
  dialCode: string;
  flagEmoji: string;
};

export interface EmailCheckRequest {
  email: string;
}

export interface EmailCheckResponse {
  data: Array<{
    value: 'OK' | 'NO';
  }>;
}

export interface ReferralCheckRequest {
  email: string;
}

export interface ReferralCheckResponse {
  data: Array<{
    result: boolean;
    member?: number;
  }>;
}

export interface SignupRequest {
  email: string;
  pin: string;
  firstname: string;
  lastname: string;
  gender: number; 
  mobile: string;
  mobilecode: number;
  countrycode: string;
  country: number;
  region: number;
  age: number; 
  recommand: number; 
  os: number; 
}

export interface SignupResponse {
  data: Array<{
    text: string; 
  }>;
}

export interface LoginCheckRequest {
  email: string;
  pin: string;
}

export interface LoginCheckResponse {
  data: Array<{
    value: 'OK' | 'NO';
  }>;
}

export interface EmailPasswordLoginRequest {
  type: 4;
  email: string;
  pin: string;
}

export interface PasswordOnlyLoginRequest {
  type: 3;
  pin: string;
  mobile: string;
}

export interface MobileLoginRequest {
  type: 2;
  mobile: string;
}

export interface LoginResponse {
  status: string;
  data: Array<{
    member?: number;
    email?: string;
    mobile?: string;
    extrastr?: string;
    [key: string]: any;
  }>;
}

export interface PhoneVerificationRequest {
  country: string;
  mobile: string;
}

export interface PhoneVerificationResponse {
  data: Array<{
    status: boolean;
  }>;
}

export interface PhoneVerificationCodeRequest {
  mobile: string;
  code: string;
}

export interface PhoneVerificationCodeResponse {
  data: string; 
}

export interface EmailVerificationRequest {
  email: string;
}

export interface EmailVerificationResponse {
  data: Array<{
    status: string | boolean;
  }>;
}

export interface EmailVerificationCodeRequest {
  email: string;
  code: string;
}

export interface EmailVerificationCodeResponse {
  status: string;
}

export interface EmailAuthLoginRequest {
  email: string;
}

export interface EmailAuthLoginResponse {
  status: string;
  data: Array<{
    member?: number;
    email?: string;
    [key: string]: any;
  }>;
}

export interface SaveSessionRequest {
  member: number;
  ssidw: string;
}

export interface SaveSessionResponse {
  data: Array<{
    affectedRows: number;
  }>;
}

export interface GetUserInfoRequest {
  member: number;
}

export interface GetUserInfoResponse {
  data: Array<{
    member?: number;
    email?: string;
    mobile?: string;
    [key: string]: any;
  }>;
}

export interface GetMyPageUserInfoRequest {
  member: number;
}

export interface GetMyPageUserInfoResponse {
  data: Array<{
    email?: string;
    firstname?: string;
    lastname?: string;
    member?: number;
    gender?: number;
    extrastr?: string;
    country?: number;
    countrycode?: string;
    region?: number;
    ages?: number;
    [key: string]: any;
  }>;
}

export interface UpdateNameRequest {
  member: number;
  firstname: string;
}

export interface UpdateNameResponse {
  data?: Array<{
    affectedRows?: number;
    [key: string]: any;
  }>;
  status?: string;
  [key: string]: any;
}

export interface UpdatePhoneRequest {
  member: number;
  mobile: string;
  mobilecode: number;
}

export interface UpdatePhoneResponse {
  data?: Array<{
    count?: number;
    [key: string]: any;
  }>;
  status?: string;
  [key: string]: any;
}

export interface UpdateLastNameRequest {
  member: number;
  lastname: string;
}

export interface UpdateLastNameResponse {
  data?: Array<{
    affectedRows?: number;
    [key: string]: any;
  }>;
  status?: string;
  [key: string]: any;
}

export interface UpdateGenderRequest {
  member: number;
  gender: number; 
}

export interface UpdateGenderResponse {
  data?: Array<{
    affectedRows?: number;
    [key: string]: any;
  }>;
  status?: string;
  [key: string]: any;
}

export interface UpdateAgeRequest {
  member: number;
  ages: number; 
}

export interface UpdateAgeResponse {
  data?: Array<{
    affectedRows?: number;
    [key: string]: any;
  }>;
  status?: string;
  [key: string]: any;
}

export interface GetRegionsByCountryRequest {
  country: number;
}

export interface GetRegionsByCountryResponse {
  data?: Array<{
    country?: string;
    callnumber?: number;
    description?: string;
    subcode?: number;
    [key: string]: any;
  }>;
  status?: string;
  [key: string]: any;
}

export interface UpdateRegionRequest {
  member: number;
  country: number;
  region: number;
}

export interface UpdateRegionResponse {
  data?: Array<{
    affectedRows?: number;
    [key: string]: any;
  }>;
  status?: string;
  [key: string]: any;
}

export interface GetCountriesResponse {
  data?: Array<{
    country?: string;
    callnumber?: number;
    description?: string;
    subcode?: number;
    [key: string]: any;
  }>;
  status?: string;
  [key: string]: any;
}

export interface LogoutRequest {
  member: number;
}

export interface LogoutResponse {
  status?: string;
  data?: Array<{
    [key: string]: any;
  }>;
  [key: string]: any;
}

export interface CloseMembershipRequest {
  pin: string;        
  reason: string;      
  reasonNum: number;  
  member: number;     
}

export interface CloseMembershipResponse {
  data?: Array<{
    count?: number;  
    [key: string]: any;
  }>;
  status?: string;
  [key: string]: any;
}

