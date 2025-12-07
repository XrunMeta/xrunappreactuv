
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
  xrunprice?: number | string; 
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

export interface SpotData {
  spotID: number;
  distance: number; 
  direction: number; 
  name: string;
  latitude?: number;
  longitude?: number;
  xrunPrice?: number;
  iconurl?: string;
  joindesc?: string;
  brand?: string;
  coins?: string; 
  coin?: string; 
  advertisement?: string | number; 
  campid?: string | number; 
}

export interface EmergencyInfo {
  message: string;
  link: string;
}

export interface KeepAliveServerResponse {
  status: 'success' | 'error';
  code: number;
  message: string;
  data: {
    server_status: string;
    timestamp: string;
    emergency_info: EmergencyInfo | null;
  };
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

export interface AdvertisementParams {
  member: string;
  advertisement: string;
  coin: string;
  campid: string;
  joindesc: string;
  name: string;
  xrunPrice: number;
  coinScreen: boolean;
}

export interface NasmobAdsResponse {
  status: 'success' | 'error';
  code: number;
  message?: string;
  data?: {
    urlResult: number;
    urlAD?: string;
    campid?: string;
    price?: number;
    name?: string;
    rewarddesc?: string;
    cbparam?: string;
  };
}

export interface NasmobCallbackRequest {
  cbparam: string;
  mkey: string;
  mckey: string;
  nstkey: string | null;
  subparam: string | null;
  userid: string;
  campid: string;
  adid: string;
  price: string;
  total_sales: string;
  postback_type: null;
  postback_rewardtype: null;
  raw_response: any;
}

export interface DeviceInfo {
  deviceId: string;
  adid: string;
  ipAddress: string;
  model: string;
  manufacturer: string;
  osVersion: string;
  carrier: string | null;
  appVersion: string;
  buildNumber: string;
  bundleId: string;
  deviceName: string;
  userAgent: string;
  isTablet: boolean;
  isLocationEnabled: boolean;
  timestamp: number;
  networkType?: string;
  isConnected?: boolean;
  isInternetReachable?: boolean;
  cellularGeneration?: string;
  carrierName?: string | null;
  ssid?: string | null;
  bssid?: string | null;
  mnetwork?: string;
  carrierCode?: string;
}

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

export interface MyGroupItem {
  member: string; 
  email: string; 
  datejoin: string; 
}

export interface GetMyGroupRequest {
  member: string; 
}

export interface GetMyGroupResponse {
  status: 'success' | 'error';
  data: MyGroupItem[];
  message?: string;
}

export interface GetMyRecommenderRequest {
  member: string; 
}

export interface GetMyRecommenderResponse {
  status: 'success' | 'error';
  data?: {
    email: string; 
    masked_email: string; 
    firstname: string; 
    lastname: string; 
  };
  message?: string;
}

export interface CheckCanSetRecommenderRequest {
  member: string; 
  email: string; 
}

export interface CheckCanSetRecommenderResponse {
  status?: 'success' | 'error';
  code?: number; 
  status_code?: number; 
  message?: string; 
  data?: {
    canSet?: boolean; 
  };
}

export interface SetRecommenderRequest {
  member: string; 
  email: string; 
}

export interface SetRecommenderResponse {
  status: 'success' | 'error';
  message?: string;
}

export interface GetXRUNGopaxPriceRequest {

}

export interface GetXRUNGopaxPriceResponse {
  status: 'success' | 'error';
  data: {
    gopaxPrice: number; 
  };
  message?: string;
}

export interface GetUserBalanceRequest {
  member: string; 
}

export interface GetUserBalanceResponse {
  status: 'success' | 'error';
  code?: number; 
  data: {
    realtimeBalance: {
      balance: string; 
      lastUpdated: string;
      success: boolean;
    };
  };
  message?: string;
}

export interface GetXrunBuyableItemsRequest {
  member: string; 
}

export interface ShopItemData {
  item: number; 
  title: string; 
  description: string; 
  image: string; 
  thumbnail: string; 
  priceKRW: string; 
  priceXrun: string; 
  isxrunbuy: number | { data?: number }; 
  gpkrprice: number | { data?: number }; 
  gtkrPrice?: number | { data?: number }; 
  sku: string; 
  type: string; 
  unit: string; 
  total_purchased?: number; 
  terms?: number; 
  [key: string]: any; 
}

export interface GetXrunBuyableItemsResponse {
  status: 'success' | 'error';
  data: ShopItemData[];
  message?: string;
}

export interface GetXrunPurchasedItemsRequest {
  member: string; 
}

export interface PurchasedItemData {
  item: number; 
  title: string; 
  description: string; 
  storage: string; 
  status: number; 
  txID: string; 
  icon: string; 
  [key: string]: any; 
}

export interface GetXrunPurchasedItemsResponse {
  status: 'success' | 'error';
  data: PurchasedItemData[];
  message?: string;
}

export interface PurchaseXrunItemRequest {
  member: string; 
  item: number; 
  amount: string; 
}

export interface PurchaseXrunItemResponse {
  status: 'success' | 'error';
  code?: number; 
  data?: any; 
  message?: string;
}

export interface SaveInappPurchaseLogRequest {
  status: string; 
  member: string; 
}

export interface SaveInappPurchaseLogResponse {
  status: 'success' | 'error';
  code?: number; 
  data?: Array<{
    affectedRows?: number; 
  }>;
  message?: string;
}

export interface DeleteXrunPurchasedItemRequest {
  member: string; 
  storage: string; 
}

export interface DeleteXrunPurchasedItemResponse {
  status: 'success' | 'error';
  code?: number; 
  data?: any; 
  message?: string;
}

export interface WalletData {
  currency: number; 
  subcurrency: number; 
  currencyname: string; 
  subCurrencyName?: string; 
  symbol: string; 
  symbolimg: string; 
  address: string; 
  amount: string; 
  Wamount: string; 
  [key: string]: any; 
}

export interface CombinedAsset {
  id: number | string; 
  symbol: string; 
  name: string; 
  subCurrencyName?: string; 
  amount: string; 
  icon: string | any; 
  currency: number; 
  isCustom: boolean; 
  contractAddress?: string; 
  decimals?: number; 
  subcurrency?: number; 
  originalData?: any; 
}

export interface CustomToken {
  id: string; 
  contractAddress: string; 
  symbol: string; 
  name: string; 
  amount: string; 
  decimals: number; 
  icon: string; 
  currency: number; 
  subcurrency?: number; 
  address: string; 
  [key: string]: any; 
}

export interface WalletDataResponse {
  status?: string;
  data?: WalletData[];
  [key: string]: any;
}

export interface OtherChainsStatusResponse {
  status?: string;
  data?: Array<{
    status: string; 
  }>;
  [key: string]: any;
}

export interface ADXRUNTopBannersResponse {
  status?: string;
  data?: {
    transactions?: Array<{
      krwamount: string;
      amountasxrun: string;
      [key: string]: any;
    }>;
    [key: string]: any;
  };
  [key: string]: any;
}

export interface TokenBalanceResponse {
  status?: string;
  data?: Array<{
    balance: string;
  }>;
  [key: string]: any;
}

export interface ERC20TokenCheckResponse {
  status?: string;
  data?: {
    isERC20: boolean;
    [key: string]: any;
  };
  [key: string]: any;
}

export interface TransactionHistoryItem {
  id?: string | number;
  transaction?: string;
  excuteddatetime?: string;
  date?: string;
  amount: string;
  symbol?: string;
  action: number; 
  status?: number; 
  currency?: number;
  [key: string]: any;
}

export interface TransactionHistoryResponse {
  status?: string;
  data?: TransactionHistoryItem[];
  [key: string]: any;
}

export interface ADXRUNEstimateItem {
  id: string | number;
  created_at?: string;
  datetime?: string; 
  priceasXrun?: string;
  amountasxrun?: string; 
  transaction?: string | number; 
  [key: string]: any;
}

export interface ADXRUNEstimateListResponse {
  status?: string;
  data?: {
    items?: ADXRUNEstimateItem[];
    pagination?: {
      hasNextPage?: boolean;
      [key: string]: any;
    };
    [key: string]: any;
  };
  items?: ADXRUNEstimateItem[];
  pagination?: {
    hasNextPage?: boolean;
    [key: string]: any;
  };
  [key: string]: any;
}

export interface ADXRUNResultItem {
  id: string | number;
  datetime?: string;
  amount?: string;
  extrastr4?: string;
  amountasxrun?: string;
  action?: number; 
  [key: string]: any;
}

export interface ADXRUNResultListResponse {
  status?: string;
  data?: {
    items?: ADXRUNResultItem[];
    pagination?: {
      hasNextPage?: boolean;
      [key: string]: any;
    };
    [key: string]: any;
  };
  items?: ADXRUNResultItem[];
  pagination?: {
    hasNextPage?: boolean;
    [key: string]: any;
  };
  [key: string]: any;
}

export interface ADXRUNTopBannersSettledResponse {
  status?: string;
  data?: {
    transactions?: Array<{
      krwamount: string;
      amountasxrun: string;
      [key: string]: any;
    }>;
    [key: string]: any;
  };
  [key: string]: any;
}