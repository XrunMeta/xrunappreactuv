
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

export type CountryDialCode = {
  iso2: string;
  name: string;
  dialCode: string;
  flagEmoji: string;
};

