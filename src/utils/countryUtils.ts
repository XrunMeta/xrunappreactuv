import { CountryDialCode } from '../types';
import { GetCountriesResponse, GetRegionsByCountryResponse } from '../types';
import { COUNTRY_DIAL_CODES, ALLOWED_COUNTRIES } from '../constants/countryDialCodes';
import { GLOBAL_REGION } from '../constants/regions';

const getFlagEmojiFromIso2 = (iso2: string): string => {
  if (!iso2) return '🌐';

  const country = COUNTRY_DIAL_CODES.find(
    (c) => c.iso2.toLowerCase() === iso2.toLowerCase()
  );
  return country?.flagEmoji || '🌐';
};

export const convertCountryApiToDialCode = (
  apiCountry: NonNullable<GetCountriesResponse['data']>[0]
): CountryDialCode => {

  const dialCode = apiCountry.callnumber ? `+${apiCountry.callnumber}` : '+0';

  let iso2 = '';
  if (apiCountry.code) {
    iso2 = apiCountry.code.toLowerCase();
  } else if (apiCountry.lcode) {

    const urlParts = apiCountry.lcode.split('/');
    const filename = urlParts[urlParts.length - 1];
    iso2 = filename.replace('.png', '').toLowerCase();
  }

  if (!iso2 && apiCountry.description) {

    const descLower = apiCountry.description.toLowerCase();
    const foundCountry = COUNTRY_DIAL_CODES.find(
      (c) => c.name.toLowerCase() === descLower || c.iso2.toLowerCase() === descLower
    );
    if (foundCountry) {
      iso2 = foundCountry.iso2;
    }
  }

  if (!iso2 && apiCountry.callnumber) {
    const foundCountry = COUNTRY_DIAL_CODES.find(
      (c) => c.dialCode === dialCode
    );
    if (foundCountry) {
      iso2 = foundCountry.iso2;
    }
  }

  if (!iso2) {
    iso2 = apiCountry.description?.toLowerCase().replace(/\s+/g, '') || '';
  }

  return {
    iso2: iso2.toLowerCase(),
    name: apiCountry.country || apiCountry.description || '',
    dialCode,
    flagEmoji: getFlagEmojiFromIso2(iso2),
    countryCode: apiCountry.callnumber || 0,
  };
};

export const convertRegionApiToDialCode = (
  apiRegion: NonNullable<GetRegionsByCountryResponse['data']>[0],
  countryCode: number
): CountryDialCode => {

  const regionCode = apiRegion.subcode || apiRegion.code || 0;

  return {
    iso2: apiRegion.description || '',
    name: apiRegion.description || '',
    dialCode: String(regionCode),
    flagEmoji: '📍',
    countryCode: countryCode,
  };
};

const COUNTRY_ORDER = ['kr', 'us', 'jp', 'cn', 'id'];

export const sortCountriesByOrder = (
  countries: CountryDialCode[]
): CountryDialCode[] => {
  return [...countries].sort((a, b) => {
    const indexA = COUNTRY_ORDER.indexOf(a.iso2.toLowerCase());
    const indexB = COUNTRY_ORDER.indexOf(b.iso2.toLowerCase());
    if (indexA === -1 && indexB === -1) return 0;
    if (indexA === -1) return 1;
    if (indexB === -1) return -1;
    return indexA - indexB;
  });
};

export const loadCountriesFromApi = async (
  getCountries: () => Promise<GetCountriesResponse>,
  fallback: CountryDialCode[] = ALLOWED_COUNTRIES
): Promise<CountryDialCode[]> => {
  try {
    const response = await getCountries();
    if (response.status === 'success' && response.data && response.data.length > 0) {
      const convertedCountries = response.data.map(convertCountryApiToDialCode);

      return sortCountriesByOrder(convertedCountries);
    }
    return fallback;
  } catch (error) {
    console.error('[countryUtils] 국가 목록 API 로드 실패, fallback 사용:', error);
    return fallback;
  }
};

export interface LoadRegionsResult {
  regions: CountryDialCode[];
  hasRegions: boolean;
}

export const loadRegionsFromApi = async (
  getRegionsByCountry: (country: number) => Promise<GetRegionsByCountryResponse>,
  countryCode: number,
  fallback: CountryDialCode[] = [GLOBAL_REGION]
): Promise<LoadRegionsResult> => {
  try {
    const response = await getRegionsByCountry(countryCode);
    console.log('[countryUtils] 지역 목록 응답:', {
      status: response.status,
      has_regions: response.has_regions,
      dataLength: response.data?.length || 0,
      data: response.data,
    });

    if (response.status === 'success') {

      const hasRegions = response.has_regions === true;
      const hasData = response.data && response.data.length > 0;

      if (hasData) {
        const convertedRegions = response.data.map((region) =>
          convertRegionApiToDialCode(region, countryCode)
        );
        console.log('[countryUtils] 변환된 지역 목록:', convertedRegions);
        return {
          regions: convertedRegions,
          hasRegions: hasRegions || hasData, 
        };
      }

      console.log('[countryUtils] 지역 데이터 없음 - hasRegions:', hasRegions, 'dataLength:', response.data?.length || 0);
      return {
        regions: [],
        hasRegions: false,
      };
    }
    return {
      regions: fallback,
      hasRegions: fallback.length > 0 && fallback[0].iso2 !== 'global',
    };
  } catch (error) {

    if (__DEV__) {
      if (error instanceof Error && error.message.includes('Network Error')) {
        console.warn('[countryUtils] 지역 목록 API 네트워크 에러 - fallback 사용');
        console.warn('[countryUtils] fallback 지역 목록:', {
          fallbackLength: fallback.length,
          fallback: fallback,
          countryCode: countryCode,
        });
      } else {
        console.error('[countryUtils] 지역 목록 API 로드 실패, fallback 사용:', error);
      }
    }

    const hasValidFallback = fallback.length > 0 && fallback[0].iso2 !== 'global' && fallback[0].iso2 !== 'select';
    return {
      regions: hasValidFallback ? fallback : [],
      hasRegions: hasValidFallback,
    };
  }
};

