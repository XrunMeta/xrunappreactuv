
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

export interface EmailExistsRequest {
  email: string;
}

export interface EmailExistsResponse {
  data: Array<{
    result: boolean; 
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

export type NotificationType = 9301 | 9302 | 9303; 

export interface NotificationItem {
  board: number; 
  title: string; 
  contents: string | null; 
  datetime: string; 
  type: NotificationType; 
  image: string | null; 
  guid: string | null; 
  datebegin: string | null; 
  dateends: string | null; 
}

export interface NotificationListRequest {
  member: number; 
  start: number; 
}

export interface NotificationListResponse {
  type: string; 
  data: NotificationItem[];
}

export interface NotificationSendRequest {
  isBroadcast: boolean; 
  member: number; 
  title: string; 
}

export interface NotificationSendResponse {
  success: boolean;
  message?: string;
}

export interface NotificationDeleteRequest {
  isBroadcast: boolean; 
  member: number; 
  board: number; 
}

export interface NotificationDeleteResponse {
  success: boolean;
  message?: string;
}

export interface NotificationDeleteAllRequest {
  member: number; 
}

export interface NotificationDeleteAllResponse {
  success: boolean;
  message?: string;
}

export interface FCMTokenRegisterRequest {
  pushkey: string; 
  member: number; 
}

export interface FCMTokenRegisterResponse {
  success: boolean;
  message?: string;
}

export interface RegisterReferralByEmailRequest {
  member: number; 
  email: string; 
}

export interface RegisterReferralByEmailResponse {
  data: Array<{
    data: string; 
  }>;
}

export interface RandomReferralItem {
  email: string;
  member: number;
  [key: string]: any;
}

export interface GetRandomReferralListResponse {
  status: string; 
  data: RandomReferralItem[];
}

export interface RegisterRandomReferralRequest {
  posed: number; 
  member: number; 
}

export interface RegisterRandomReferralResponse {
  data: Array<{
    data: string; 
  }>;
}

export interface SaveReferralRequest {
  member: number; 
  recommand: number; 
}

export interface SaveReferralResponse {
  success?: boolean;
  [key: string]: any;
}

export interface GetMyReferralRequest {
  member: number; 
}

export interface GetMyReferralResponse {
  data: Array<{
    email: string; 
    data: string | boolean; 
  }>;
}

export interface RecommendedToMeItem {
  email: string;
  masked_email: string;
  [key: string]: any;
}

export interface GetRecommendedToMeRequest {
  member: number; 
}

export interface GetRecommendedToMeResponse {
  status: string; 
  data: RecommendedToMeItem[];
}

export interface GetMemberByEmailRequest {
  email: string; 
}

export interface GetMemberByEmailResponse {
  data: Array<{
    result: boolean; 
    member?: number; 
  }>;
}

export interface GetUserInfoForReferralRequest {
  member: number; 
}

export interface GetUserInfoForReferralResponse {
  data: Array<{
    member: number;
    email: string;
    [key: string]: any;
  }>;
}

export interface SettlementListRequest {
  member: number; 
  currency: number; 
  daysbefore: number; 
  startwith: number; 
}

export interface SettlementListResponse {
  type: string; 
  data: Array<{
    [key: string]: any;
  }>;
}

export interface GetCompletedAdsRequest {
  member: number; 
}

export interface CompletedAdItem {
  transaction: string;
  title: string;
  amount: number;
  symbol: string;
  extracode: string;
  datetime: string;
}

export interface GetCompletedAdsResponse {
  data: CompletedAdItem[];
}

export interface GetSavedAdsRequest {
  member: number; 
  orderField?: 'datetime' | 'dateleft' | 'amount'; 
}

export interface SavedAdItem {
  [key: string]: any;
}

export interface GetSavedAdsResponse {
  data: SavedAdItem[];
}

export interface GetSettlementListRequest {
  member: number; 
}

export interface SettlementListItem {
  transaction: number;
  email?: string;
  amountasxrun: string; 
  datetime: string;
  [key: string]: any;
}

export interface GetSettlementListResponse {
  status: 'success' | 'error';
  data: SettlementListItem[];
  message?: string;
}

export interface GetSettlementAmountRequest {
  member: number; 
}

export interface GetSettlementAmountResponse {
  status: 'success' | 'error';
  data: Array<{
    amount: string; 
  }>;
  message?: string;
}

export interface RankItem {
  referrer_id: number;
  referrer_email: string;
  unique_rank: number;
  referral_count: number;
}

export interface GetRankRequest {

}

export interface GetRankResponse {
  status: 'success' | 'error';
  data: RankItem[];
  message?: string;
}

export interface GetRankSpesificRequest {
  member: number; 
}

export interface GetRankSpesificResponse {
  status: 'success' | 'error';
  data: Array<{
    unique_rank: number; 
  }>;
  message?: string;
}

