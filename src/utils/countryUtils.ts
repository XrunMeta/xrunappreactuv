import { CountryDialCode } from '../types';
import { GetCountriesResponse, GetRegionsByCountryResponse } from '../types';
import { COUNTRY_DIAL_CODES, ALLOWED_COUNTRIES } from '../constants/countryDialCodes';
import { GLOBAL_REGION } from '../constants/regions';
import {
  loadCountriesFromPackage,
  loadRegionsFromPackage,
  isCountryWithRegionsByCode,
} from './countryStateCityUtils';

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

  if (!iso2 && apiCountry.country) {
    const countryNameLower = apiCountry.country.toLowerCase();

    let foundCountry = COUNTRY_DIAL_CODES.find(
      (c) => c.name.toLowerCase() === countryNameLower
    );

    if (!foundCountry) {
      foundCountry = COUNTRY_DIAL_CODES.find(
        (c) => {
          const countryName = c.name.toLowerCase();

          return countryNameLower.includes(countryName) || 
                 countryName.includes(countryNameLower);
        }
      );
    }

    if (!foundCountry && (countryNameLower.includes('korea') || countryNameLower.includes('south korea'))) {
      foundCountry = COUNTRY_DIAL_CODES.find((c) => c.iso2 === 'kr');
    }

    if (foundCountry) {
      iso2 = foundCountry.iso2;
      if (__DEV__) {
        console.log('[countryUtils] country 필드에서 ISO2 추출 성공:', {
          country: apiCountry.country,
          iso2,
          matchedName: foundCountry.name,
        });
      }
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

  if (__DEV__ && (!iso2 || iso2.length !== 2)) {
    console.warn('[countryUtils] ISO2 추출 실패:', {
      code: apiCountry.code,
      lcode: apiCountry.lcode,
      country: apiCountry.country,
      description: apiCountry.description,
      callnumber: apiCountry.callnumber,
      extractedIso2: iso2,
    });
  }

  const finalIso2 = iso2.toLowerCase();
  if (__DEV__) {
    console.log('[countryUtils] 국가 변환 결과:', {
      original: apiCountry.country || apiCountry.description,
      iso2: finalIso2,
      dialCode,
      countryCode: apiCountry.callnumber,
    });
  }

  return {
    iso2: finalIso2,
    name: apiCountry.country || apiCountry.description || '',
    dialCode,
    flagEmoji: getFlagEmojiFromIso2(finalIso2),
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

export const sortCountriesByOrder = (
  countries: CountryDialCode[]
): CountryDialCode[] => {

  const koreaIndex = countries.findIndex(c => c.iso2.toLowerCase() === 'kr');
  if (koreaIndex === 0) {

    return countries;
  }

  const korea = countries.find(c => c.iso2.toLowerCase() === 'kr');
  const others = countries.filter(c => c.iso2.toLowerCase() !== 'kr');
  return korea ? [korea, ...others] : countries;
};

export const loadCountriesFromApi = async (
  getCountries: () => Promise<GetCountriesResponse>,
  fallback: CountryDialCode[] = ALLOWED_COUNTRIES
): Promise<CountryDialCode[]> => {

  try {
    const packageCountries = loadCountriesFromPackage();
    if (packageCountries.length > 0) {
      if (__DEV__) {
        console.log('[countryUtils] 패키지에서 국가 목록 로드 성공:', packageCountries.length);
      }
      return packageCountries;
    }
  } catch (error) {
    if (__DEV__) {
      console.warn('[countryUtils] 패키지 국가 목록 로드 실패, API fallback 시도:', error);
    }
  }

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

const COUNTRIES_WITH_REGIONS = [82, 81, 86, 1, 62];

export const loadRegionsFromApi = async (
  getRegionsByCountry: (country: number) => Promise<GetRegionsByCountryResponse>,
  countryCode: number,
  isoCode?: string, 
  fallback: CountryDialCode[] = [GLOBAL_REGION]
): Promise<LoadRegionsResult> => {

  const countryCodeToIso2: { [key: number]: string } = {
    82: 'kr', 81: 'jp', 86: 'cn', 1: 'us', 62: 'id',
  };
  const foundIsoCode = isoCode || countryCodeToIso2[countryCode];

  if (foundIsoCode) {
    try {
      const packageRegions = loadRegionsFromPackage(foundIsoCode, countryCode);
      if (packageRegions.length > 0) {
        if (__DEV__) {
          console.log('[countryUtils] 패키지에서 지역 목록 로드 성공:', {
            countryCode,
            isoCode: foundIsoCode,
            regionCount: packageRegions.length,
          });
        }
        return {
          regions: packageRegions,
          hasRegions: true,
        };
      } else {

        if (__DEV__) {
          console.log('[countryUtils] 패키지에 지역 데이터 없음:', {
            countryCode,
            isoCode: foundIsoCode,
          });
        }
        return {
          regions: [GLOBAL_REGION],
          hasRegions: false,
        };
      }
    } catch (error) {
      if (__DEV__) {
        console.warn('[countryUtils] 패키지 지역 목록 로드 실패, API fallback 시도:', error);
      }
    }
  }

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

      if (hasData && response.data) {
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
        regions: [GLOBAL_REGION],
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
      regions: hasValidFallback ? fallback : [GLOBAL_REGION],
      hasRegions: hasValidFallback,
    };
  }
};

