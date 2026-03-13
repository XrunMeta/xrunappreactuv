

import { Country, State, ICountry, IState } from 'country-state-city';
import { CountryDialCode } from '../types';
import { GLOBAL_REGION } from '../constants/regions';
import { getSubcodeFromPackageRegion } from './regionSubcodeMapping';

const getFlagEmojiFromIso2 = (iso2: string): string => {

  const flagEmojis: { [key: string]: string } = {
    'kr': '🇰🇷',
    'jp': '🇯🇵',
    'cn': '🇨🇳',
    'us': '🇺🇸',
    'id': '🇮🇩',
    'gb': '🇬🇧',
    'fr': '🇫🇷',
    'de': '🇩🇪',
    'it': '🇮🇹',
    'es': '🇪🇸',
    'ca': '🇨🇦',
    'au': '🇦🇺',
    'br': '🇧🇷',
    'in': '🇮🇳',
    'ru': '🇷🇺',
    'mx': '🇲🇽',
    'za': '🇿🇦',
  };

  return flagEmojis[iso2.toLowerCase()] || '🌐';
};

export const convertPackageCountryToDialCode = (country: ICountry): CountryDialCode => {

  const phonecode = parseInt(country.phonecode.replace(/[^0-9]/g, ''), 10) || 0;
  const dialCode = country.phonecode.startsWith('+') 
    ? country.phonecode 
    : `+${country.phonecode}`;

  return {
    iso2: country.isoCode.toLowerCase(), 
    name: country.name, 
    dialCode,
    flagEmoji: country.flag || getFlagEmojiFromIso2(country.isoCode.toLowerCase()),
    countryCode: phonecode, 
  };
};

export const convertPackageRegionToDialCode = (
  state: IState,
  countryCode: number,
  index?: number
): CountryDialCode => {

  const subcode = getSubcodeFromPackageRegion(countryCode, state.name);

  const finalSubcode = subcode !== null 
    ? subcode 
    : (state.isoCode ? parseInt(state.isoCode, 10) || (index !== undefined ? index + 1 : 0) : (index !== undefined ? index + 1 : 0));

  return {
    iso2: state.name, 
    name: state.name, 
    dialCode: String(finalSubcode), 
    flagEmoji: '📍',
    countryCode: countryCode,
  };
};

export const loadCountriesFromPackage = (): CountryDialCode[] => {
  try {
    const countries = Country.getAllCountries();
    const converted = countries.map(convertPackageCountryToDialCode);

    const koreaIndex = converted.findIndex(c => c.iso2.toLowerCase() === 'kr');
    if (koreaIndex > 0) {
      const korea = converted[koreaIndex];
      const others = converted.filter(c => c.iso2.toLowerCase() !== 'kr');
      return [korea, ...others];
    }

    return converted;
  } catch (error) {
    console.error('[countryStateCityUtils] 국가 목록 로드 실패:', error);
    return [];
  }
};

export const loadRegionsFromPackage = (
  isoCode: string,
  countryCode: number
): CountryDialCode[] => {
  try {
    const states = State.getStatesOfCountry(isoCode.toUpperCase());
    const converted: CountryDialCode[] = [];

    for (let i = 0; i < states.length; i++) {
      const state = states[i];
      const region = convertPackageRegionToDialCode(state, countryCode, i);
      converted.push(region);
    }

    converted.sort((a, b) => {
      const subcodeA = parseInt(a.dialCode, 10);
      const subcodeB = parseInt(b.dialCode, 10);
      return subcodeA - subcodeB;
    });

    return converted;
  } catch (error) {
    console.error('[countryStateCityUtils] 지역 목록 로드 실패:', error);
    return [];
  }
};

export const isCountryWithRegions = (isoCode: string): boolean => {
  try {
    const states = State.getStatesOfCountry(isoCode.toUpperCase());
    return states.length > 0;
  } catch (error) {
    return false;
  }
};

export const isCountryWithRegionsByCode = (countryCode: number, isoCode?: string): boolean => {

  if (isoCode) {
    return isCountryWithRegions(isoCode);
  }

  const countryCodeToIso2: { [key: number]: string } = {
    82: 'kr', 81: 'jp', 86: 'cn', 1: 'us', 62: 'id',
  };
  const foundIso2 = countryCodeToIso2[countryCode];
  if (foundIso2) {
    return isCountryWithRegions(foundIso2);
  }

  return false;
};

