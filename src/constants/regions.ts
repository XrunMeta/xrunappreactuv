import { v_da1883 } from '../types';

export interface Region {
  id: number;
  name: string;
  nameEn: string;
}

export const REGIONS_AS_COUNTRY_DIAL_CODES: v_da1883[] = [
  { iso2: 'seoul', name: '서울', dialCode: '1', flagEmoji: '📍' },
  { iso2: 'busan', name: '부산', dialCode: '2', flagEmoji: '📍' },
  { iso2: 'daegu', name: '대구', dialCode: '3', flagEmoji: '📍' },
  { iso2: 'incheon', name: '인천', dialCode: '4', flagEmoji: '📍' },
  { iso2: 'gwangju', name: '광주', dialCode: '5', flagEmoji: '📍' },
  { iso2: 'daejeon', name: '대전', dialCode: '6', flagEmoji: '📍' },
  { iso2: 'ulsan', name: '울산', dialCode: '7', flagEmoji: '📍' },
  { iso2: 'sejong', name: '세종', dialCode: '8', flagEmoji: '📍' },
  { iso2: 'gyeonggi', name: '경기', dialCode: '9', flagEmoji: '📍' },
  { iso2: 'gangwon', name: '강원', dialCode: '10', flagEmoji: '📍' },
  { iso2: 'chungbuk', name: '충북', dialCode: '11', flagEmoji: '📍' },
  { iso2: 'chungnam', name: '충남', dialCode: '12', flagEmoji: '📍' },
  { iso2: 'jeonbuk', name: '전북', dialCode: '13', flagEmoji: '📍' },
  { iso2: 'jeonnam', name: '전남', dialCode: '14', flagEmoji: '📍' },
  { iso2: 'gyeongbuk', name: '경북', dialCode: '15', flagEmoji: '📍' },
  { iso2: 'gyeongnam', name: '경남', dialCode: '16', flagEmoji: '📍' },
  { iso2: 'jeju', name: '제주', dialCode: '17', flagEmoji: '📍' },
];

export const v_9553a4 = (v_cc0c7d): number => {
  const v_a6c30b = v_52495e.find((v_cb35cb) => v_cb35cb.iso2 === v_cc0c7d);
  return v_a6c30b ? parseInt(v_a6c30b.dialCode, 10) : 2; 
};

export const v_9534f3 = (v_389afb): string => {
  const v_a6c30b = v_52495e.find((v_cb35cb) => parseInt(v_cb35cb.dialCode, 10) === v_389afb);
  return v_a6c30b ? v_a6c30b.iso2 : 'seoul';
};

export const v_6946fd = (v_389afb): string => {
  const v_a6c30b = v_52495e.find((v_cb35cb) => parseInt(v_cb35cb.dialCode, 10) === v_389afb);
  return v_a6c30b ? v_a6c30b.name : '서울';
};

