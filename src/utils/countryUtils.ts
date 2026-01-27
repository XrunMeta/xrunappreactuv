import { v_da1883 } from '../types';
import { v_c4dd46, v_7d842d } from '../types';
import { v_202d44, v_1bd8ad } from '../constants/countryDialCodes';
import { v_789afd } from '../constants/regions';

const v_eebb85 = (v_cc0c7d): string => {
  if (!v_cc0c7d) return '🌐';

  const v_b9bbbd = v_202d44.find(
    (v_3f4e2e) => v_3f4e2e.iso2.toLowerCase() === v_cc0c7d.toLowerCase()
  );
  return v_b9bbbd?.flagEmoji || '🌐';
};

export const v_27df20 = (
  apiCountry: NonNullable<v_c4dd46['data']>[0]
): v_da1883 => {

  const v_146092 = v_d38c53.callnumber ? `+${v_d38c53.callnumber}` : '+0';

  let v_cc0c7d = '';
  if (v_d38c53.code) {
    v_cc0c7d = v_d38c53.code.toLowerCase();
  } else if (v_d38c53.lcode) {

    const v_866dae = v_d38c53.lcode.split('/');
    const v_c424ac = v_866dae[v_866dae.length - 1];
    v_cc0c7d = v_c424ac.replace('.png', '').toLowerCase();
  }

  if (!v_cc0c7d && v_d38c53.description) {

    const v_43d971 = v_d38c53.description.toLowerCase();
    const v_f96d6d = v_202d44.find(
      (v_3f4e2e) => v_3f4e2e.name.toLowerCase() === v_43d971 || v_3f4e2e.iso2.toLowerCase() === v_43d971
    );
    if (v_f96d6d) {
      v_cc0c7d = v_f96d6d.iso2;
    }
  }

  if (!v_cc0c7d && v_d38c53.callnumber) {
    const v_f96d6d = v_202d44.find(
      (v_3f4e2e) => v_3f4e2e.dialCode === v_146092
    );
    if (v_f96d6d) {
      v_cc0c7d = v_f96d6d.iso2;
    }
  }

  if (!v_cc0c7d) {
    v_cc0c7d = v_d38c53.description?.toLowerCase().replace(/\s+/g, '') || '';
  }

  return {
    iso2: v_cc0c7d.toLowerCase(),
    name: v_d38c53.country || v_d38c53.description || '',
    dialCode: v_146092,
    flagEmoji: v_eebb85(v_cc0c7d),
    countryCode: v_d38c53.callnumber || 0,
  };
};

export const v_18a84a = (
  apiRegion: NonNullable<v_7d842d['data']>[0],
  v_a4d981
): v_da1883 => {

  const v_222917 = v_3bed0a.subcode || v_3bed0a.code || 0;

  return {
    iso2: v_3bed0a.description || '',
    name: v_3bed0a.description || '',
    dialCode: String(v_222917),
    flagEmoji: '📍',
    countryCode: v_a4d981,
  };
};

const v_abb10c = ['kr', 'us', 'jp', 'cn', 'id'];

export const v_fb6ba6 = (
  countries: v_da1883[]
): v_da1883[] => {
  return [...v_6c7bef].sort((v_779914, v_148ff6) => {
    const v_8a984b = v_abb10c.indexOf(v_779914.iso2.toLowerCase());
    const v_9f575e = v_abb10c.indexOf(v_148ff6.iso2.toLowerCase());
    if (v_8a984b === -1 && v_9f575e === -1) return 0;
    if (v_8a984b === -1) return 1;
    if (v_9f575e === -1) return -1;
    return v_8a984b - v_9f575e;
  });
};

export const v_151d5f = async (
  getCountries: () => Promise<v_c4dd46>,
  fallback: v_da1883[] = v_1bd8ad
): Promise<v_da1883[]> => {
  try {
    const v_3393e3 = await v_60f557();
    if (v_3393e3.status === 'success' && v_3393e3.data && v_3393e3.data.length > 0) {
      const v_964b58 = v_3393e3.data.map(v_27df20);

      return v_fb6ba6(v_964b58);
    }
    return v_0debf4;
  } catch (v_5e9bfe) {
    console.error('[countryUtils] 국가 목록 API 로드 실패, fallback 사용:', v_5e9bfe);
    return v_0debf4;
  }
};

export interface LoadRegionsResult {
  regions: v_da1883[];
  hasRegions: boolean;
}

export const v_5c7129 = async (
  getRegionsByCountry: (country: number) => Promise<v_7d842d>,
  v_a4d981,
  fallback: v_da1883[] = [v_789afd]
): Promise<LoadRegionsResult> => {
  try {
    const v_3393e3 = await v_11e39e(v_a4d981);
    console.log('[countryUtils] 지역 목록 응답:', {
      status: v_3393e3.status,
      has_regions: v_3393e3.has_regions,
      dataLength: v_3393e3.data?.length || 0,
      data: v_3393e3.data,
    });

    if (v_3393e3.status === 'success') {

      const v_5f1e0e = v_3393e3.has_regions === true;
      const v_68476a = v_3393e3.data && v_3393e3.data.length > 0;

      if (v_68476a) {
        const v_a4cc88 = v_3393e3.data.map((v_a6c30b) =>
          v_18a84a(v_a6c30b, v_a4d981)
        );
        console.log('[countryUtils] 변환된 지역 목록:', v_a4cc88);
        return {
          regions: v_a4cc88,
          hasRegions: v_5f1e0e || v_68476a, 
        };
      }

      console.log('[countryUtils] 지역 데이터 없음 - hasRegions:', v_5f1e0e, 'dataLength:', v_3393e3.data?.length || 0);
      return {
        regions: [],
        hasRegions: false,
      };
    }
    return {
      regions: v_0debf4,
      hasRegions: v_0debf4.length > 0 && v_0debf4[0].iso2 !== 'global',
    };
  } catch (v_5e9bfe) {

    if (__DEV__) {
      if (v_5e9bfe instanceof Error && v_5e9bfe.message.includes('Network Error')) {
        console.warn('[countryUtils] 지역 목록 API 네트워크 에러 - fallback 사용');
        console.warn('[countryUtils] fallback 지역 목록:', {
          fallbackLength: v_0debf4.length,
          fallback: v_0debf4,
          countryCode: v_a4d981,
        });
      } else {
        console.error('[countryUtils] 지역 목록 API 로드 실패, fallback 사용:', v_5e9bfe);
      }
    }

    const v_05f37b = v_0debf4.length > 0 && v_0debf4[0].iso2 !== 'global' && v_0debf4[0].iso2 !== 'select';
    return {
      regions: v_05f37b ? v_0debf4 : [],
      hasRegions: v_05f37b,
    };
  }
};

