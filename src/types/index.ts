
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

