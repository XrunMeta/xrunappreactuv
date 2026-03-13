import { v_da1883 } from '../types';
import { v_c4dd46, v_7d842d } from '../types';
import { v_202d44, v_1bd8ad } from '../constants/countryDialCodes';
import { v_789afd } from '../constants/regions';
import {
  v_e30d2f,
  v_071875,
  v_58c98d,
} from './countryStateCityUtils';

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

  if (!v_cc0c7d && v_d38c53.country) {
    const v_34c566 = v_d38c53.country.toLowerCase();

    let v_f96d6d = v_202d44.find(
      (v_3f4e2e) => v_3f4e2e.name.toLowerCase() === v_34c566
    );

    if (!v_f96d6d) {
      v_f96d6d = v_202d44.find(
        (v_3f4e2e) => {
          const v_67cb9c = v_3f4e2e.name.toLowerCase();

          return v_34c566.includes(v_67cb9c) || 
                 v_67cb9c.includes(v_34c566);
        }
      );
    }

    if (!v_f96d6d && (v_34c566.includes('korea') || v_34c566.includes('south korea'))) {
      v_f96d6d = v_202d44.find((v_3f4e2e) => v_3f4e2e.iso2 === 'kr');
    }

    if (v_f96d6d) {
      v_cc0c7d = v_f96d6d.iso2;
      if (__DEV__) {
        console.log('[countryUtils] country 필드에서 ISO2 추출 성공:', {
          country: v_d38c53.country,
          iso2: v_cc0c7d,
          matchedName: v_f96d6d.name,
        });
      }
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

  if (__DEV__ && (!v_cc0c7d || v_cc0c7d.length !== 2)) {
    console.warn('[countryUtils] ISO2 추출 실패:', {
      code: v_d38c53.code,
      lcode: v_d38c53.lcode,
      country: v_d38c53.country,
      description: v_d38c53.description,
      callnumber: v_d38c53.callnumber,
      extractedIso2: v_cc0c7d,
    });
  }

  const v_9e281f = v_cc0c7d.toLowerCase();
  if (__DEV__) {
    console.log('[countryUtils] 국가 변환 결과:', {
      original: v_d38c53.country || v_d38c53.description,
      iso2: v_9e281f,
      dialCode: v_146092,
      countryCode: v_d38c53.callnumber,
    });
  }

  return {
    iso2: v_9e281f,
    name: v_d38c53.country || v_d38c53.description || '',
    dialCode: v_146092,
    flagEmoji: v_eebb85(v_9e281f),
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

export const v_fb6ba6 = (
  countries: v_da1883[]
): v_da1883[] => {

  const v_e8b858 = v_6c7bef.findIndex(v_3f4e2e => v_3f4e2e.iso2.toLowerCase() === 'kr');
  if (v_e8b858 === 0) {

    return v_6c7bef;
  }

  const v_621722 = v_6c7bef.find(v_3f4e2e => v_3f4e2e.iso2.toLowerCase() === 'kr');
  const v_986d86 = v_6c7bef.filter(v_3f4e2e => v_3f4e2e.iso2.toLowerCase() !== 'kr');
  return v_621722 ? [v_621722, ...v_986d86] : v_6c7bef;
};

export const v_151d5f = async (
  getCountries: () => Promise<v_c4dd46>,
  fallback: v_da1883[] = v_1bd8ad
): Promise<v_da1883[]> => {

  try {
    const v_24a9a4 = v_e30d2f();
    if (v_24a9a4.length > 0) {
      if (__DEV__) {
        console.log('[countryUtils] 패키지에서 국가 목록 로드 성공:', v_24a9a4.length);
      }
      return v_24a9a4;
    }
  } catch (v_5e9bfe) {
    if (__DEV__) {
      console.warn('[countryUtils] 패키지 국가 목록 로드 실패, API fallback 시도:', v_5e9bfe);
    }
  }

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

const v_90ad93 = [82, 81, 86, 1, 62];

export const v_5c7129 = async (
  getRegionsByCountry: (country: number) => Promise<v_7d842d>,
  v_a4d981,
  v_52c475, 
  fallback: v_da1883[] = [v_789afd]
): Promise<LoadRegionsResult> => {

  const v_46b18e = {
    82: 'kr', 81: 'jp', 86: 'cn', 1: 'us', 62: 'id',
  };
  const v_b35ebd = v_52c475 || v_46b18e[v_a4d981];

  if (v_b35ebd) {
    try {
      const v_866d77 = v_071875(v_b35ebd, v_a4d981);
      if (v_866d77.length > 0) {
        if (__DEV__) {
          console.log('[countryUtils] 패키지에서 지역 목록 로드 성공:', {
            countryCode: v_a4d981,
            isoCode: v_b35ebd,
            regionCount: v_866d77.length,
          });
        }
        return {
          regions: v_866d77,
          hasRegions: true,
        };
      } else {

        if (__DEV__) {
          console.log('[countryUtils] 패키지에 지역 데이터 없음:', {
            countryCode: v_a4d981,
            isoCode: v_b35ebd,
          });
        }
        return {
          regions: [v_789afd],
          hasRegions: false,
        };
      }
    } catch (v_5e9bfe) {
      if (__DEV__) {
        console.warn('[countryUtils] 패키지 지역 목록 로드 실패, API fallback 시도:', v_5e9bfe);
      }
    }
  }

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

      if (v_68476a && v_3393e3.data) {
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
        regions: [v_789afd],
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
      regions: v_05f37b ? v_0debf4 : [v_789afd],
      hasRegions: v_05f37b,
    };
  }
};

