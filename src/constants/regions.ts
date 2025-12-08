import { CountryDialCode } from '../types';

export interface Region {
  id: number;
  name: string;
  nameEn: string;
}

export const REGIONS_AS_COUNTRY_DIAL_CODES: CountryDialCode[] = [

  { iso2: 'aceh', name: 'ACEH', dialCode: '1', flagEmoji: '📍' , 'countryCode': 62},
  { iso2: 'bali', name: 'BALI', dialCode: '2', flagEmoji: '📍' , 'countryCode': 62},
  { iso2: 'banten', name: 'BANTEN', dialCode: '3', flagEmoji: '📍' , 'countryCode': 62},
  { iso2: 'bengkulu', name: 'BENGKULU', dialCode: '4', flagEmoji: '📍' , 'countryCode': 62},
  { iso2: 'di_yogyakarta', name: 'DI YOGYAKARTA', dialCode: '5', flagEmoji: '📍' , 'countryCode': 62},
  { iso2: 'dki_jakarta', name: 'DKI JAKARTA', dialCode: '6', flagEmoji: '📍' , 'countryCode': 62},
  { iso2: 'gorontalo', name: 'GORONTALO', dialCode: '7', flagEmoji: '📍' , 'countryCode': 62},
  { iso2: 'jambi', name: 'JAMBI', dialCode: '8', flagEmoji: '📍' , 'countryCode': 62},
  { iso2: 'jawa_barat', name: 'JAWA BARAT', dialCode: '9', flagEmoji: '📍' , 'countryCode': 62},
  { iso2: 'jawa_tengah', name: 'JAWA TENGAH', dialCode: '10', flagEmoji: '📍' , 'countryCode': 62},
  { iso2: 'jawa_timur', name: 'JAWA TIMUR', dialCode: '11', flagEmoji: '📍' , 'countryCode': 62},
  { iso2: 'kalimantan_barat', name: 'KALIMANTAN BARAT', dialCode: '12', flagEmoji: '📍' , 'countryCode': 62},
  { iso2: 'kalimantan_selatan', name: 'KALIMANTAN SELATAN', dialCode: '13', flagEmoji: '📍' , 'countryCode': 62},
  { iso2: 'kalimantan_tengah', name: 'KALIMANTAN TENGAH', dialCode: '14', flagEmoji: '📍' , 'countryCode': 62},
  { iso2: 'kalimantan_timur', name: 'KALIMANTAN TIMUR', dialCode: '15', flagEmoji: '📍' , 'countryCode': 62},
  { iso2: 'kalimantan_utara', name: 'KALIMANTAN UTARA', dialCode: '16', flagEmoji: '📍' , 'countryCode': 62},
  { iso2: 'kepulauan_bangka_belitung', name: 'KEPULAUAN BANGKA BELITUNG', dialCode: '17', flagEmoji: '📍' , 'countryCode': 62},
  { iso2: 'kepulauan_riau', name: 'KEPULAUAN RIAU', dialCode: '18', flagEmoji: '📍' , 'countryCode': 62},
  { iso2: 'lampung', name: 'LAMPUNG', dialCode: '19', flagEmoji: '📍' , 'countryCode': 62},
  { iso2: 'maluku', name: 'MALUKU', dialCode: '20', flagEmoji: '📍' , 'countryCode': 62},
  { iso2: 'maluku_utara', name: 'MALUKU UTARA', dialCode: '21', flagEmoji: '📍' , 'countryCode': 62},
  { iso2: 'nusa_tenggara_barat', name: 'NUSA TENGGARA BARAT', dialCode: '22', flagEmoji: '📍' , 'countryCode': 62},
  { iso2: 'nusa_tenggara_timur', name: 'NUSA TENGGARA TIMUR', dialCode: '23', flagEmoji: '📍' , 'countryCode': 62},
  { iso2: 'papua', name: 'PAPUA', dialCode: '24', flagEmoji: '📍' , 'countryCode': 62},
  { iso2: 'papua_barat', name: 'PAPUA BARAT', dialCode: '25', flagEmoji: '📍' , 'countryCode': 62},
  { iso2: 'riau', name: 'RIAU', dialCode: '26', flagEmoji: '📍' , 'countryCode': 62},
  { iso2: 'sulawesi_barat', name: 'SULAWESI BARAT', dialCode: '27', flagEmoji: '📍' , 'countryCode': 62},
  { iso2: 'sulawesi_selatan', name: 'SULAWESI SELATAN', dialCode: '28', flagEmoji: '📍' , 'countryCode': 62},
  { iso2: 'sulawesi_tengah', name: 'SULAWESI TENGAH', dialCode: '29', flagEmoji: '📍' , 'countryCode': 62},
  { iso2: 'sulawesi_tenggara', name: 'SULAWESI TENGGARA', dialCode: '30', flagEmoji: '📍' , 'countryCode': 62},
  { iso2: 'sulawesi_utara', name: 'SULAWESI UTARA', dialCode: '31', flagEmoji: '📍' , 'countryCode': 62},
  { iso2: 'sumatera_barat', name: 'SUMATERA BARAT', dialCode: '32', flagEmoji: '📍' , 'countryCode': 62},
  { iso2: 'sumatera_selatan', name: 'SUMATERA SELATAN', dialCode: '33', flagEmoji: '📍' , 'countryCode': 62},
  { iso2: 'sumatera_utara', name: 'SUMATERA UTARA', dialCode: '34', flagEmoji: '📍' , 'countryCode': 62},
  { iso2: 'jakarta_barat', name: 'JAKARTA BARAT', dialCode: '35', flagEmoji: '📍' , 'countryCode': 62},
  { iso2: 'jakarta_selatan', name: 'JAKARTA SELATAN', dialCode: '36', flagEmoji: '📍' , 'countryCode': 62},
  { iso2: 'jakarta_tengah', name: 'JAKARTA TENGAH', dialCode: '37', flagEmoji: '📍' , 'countryCode': 62},
  { iso2: 'jakarta_timur', name: 'JAKARTA TIMUR', dialCode: '38', flagEmoji: '📍' , 'countryCode': 62},
  { iso2: 'jakarta_utara', name: 'JAKARTA UTARA', dialCode: '39', flagEmoji: '📍' , 'countryCode': 62},

  { iso2: '서울', name: '서울', dialCode: '2', flagEmoji: '📍' , 'countryCode': 82},
  { iso2: '경기도', name: '경기도 (Kyeonggi-do)', dialCode: '31', flagEmoji: '📍' , 'countryCode': 82},
  { iso2: '인천광역시', name: '인천광역시', dialCode: '32', flagEmoji: '📍' , 'countryCode': 82},
  { iso2: '강원도', name: '강원도', dialCode: '33', flagEmoji: '📍' , 'countryCode': 82},
  { iso2: '충청남도', name: '충청남도', dialCode: '41', flagEmoji: '📍' , 'countryCode': 82},
  { iso2: '대전광역시', name: '대전광역시', dialCode: '42', flagEmoji: '📍' , 'countryCode': 82},
  { iso2: '충청북도', name: '충청북도', dialCode: '43', flagEmoji: '📍' , 'countryCode': 82},
  { iso2: '세종특별자치시', name: '세종특별자치시', dialCode: '44', flagEmoji: '📍' , 'countryCode': 82},
  { iso2: '부산광역시', name: '부산광역시', dialCode: '51', flagEmoji: '📍' , 'countryCode': 82},
  { iso2: '울산광역시', name: '울산광역시', dialCode: '52', flagEmoji: '📍' , 'countryCode': 82},
  { iso2: '대구광역시', name: '대구광역시', dialCode: '53', flagEmoji: '📍' , 'countryCode': 82},
  { iso2: '경상북도', name: '경상북도', dialCode: '54', flagEmoji: '📍' , 'countryCode': 82},
  { iso2: '경상남도', name: '경상남도', dialCode: '55', flagEmoji: '📍' , 'countryCode': 82},
  { iso2: '전라남도', name: '전라남도', dialCode: '61', flagEmoji: '📍' , 'countryCode': 82},
  { iso2: '광주광역시', name: '광주광역시', dialCode: '62', flagEmoji: '📍' , 'countryCode': 82},
  { iso2: '전라북도', name: '전라북도', dialCode: '63', flagEmoji: '📍' , 'countryCode': 82},
  { iso2: '제주특별자치도', name: '제주특별자치도', dialCode: '64', flagEmoji: '📍' , 'countryCode': 82},
];

export const getRegionIdByIso2 = (iso2: string): number => {
  const region = REGIONS_AS_COUNTRY_DIAL_CODES.find((r) => r.iso2 === iso2);

  return region ? parseInt(region.dialCode, 10) : 2; 
};

export const getIso2ByRegionId = (id: number): string => {
  const region = REGIONS_AS_COUNTRY_DIAL_CODES.find((r) => parseInt(r.dialCode, 10) === id);
  return region ? region.iso2 : 'seoul';
};

export const getRegionNameById = (id: number): string => {
  const region = REGIONS_AS_COUNTRY_DIAL_CODES.find((r) => parseInt(r.dialCode, 10) === id);
  return region ? region.name : '서울';
};