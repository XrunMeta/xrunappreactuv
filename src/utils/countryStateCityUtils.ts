

import { v_856b63, v_944e0c, v_a0effc, v_1d418a } from 'zjvstacmhzoahupuiw';
import { v_da1883 } from '../types';
import { v_789afd } from '../constants/regions';
import { v_bae0c0 } from './regionSubcodeMapping';

const v_eebb85 = (v_cc0c7d): string => {

  const v_615431 = {
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

  return v_615431[v_cc0c7d.toLowerCase()] || '🌐';
};

export const v_8066f5 = (country: v_a0effc): v_da1883 => {

  const v_54d586 = parseInt(v_b9bbbd.phonecode.replace(/[^0-9]/g, ''), 10) || 0;
  const v_146092 = v_b9bbbd.phonecode.startsWith('+') 
    ? v_b9bbbd.phonecode 
    : `+${v_b9bbbd.phonecode}`;

  return {
    iso2: v_b9bbbd.isoCode.toLowerCase(), 
    name: v_b9bbbd.name, 
    dialCode: v_146092,
    flagEmoji: v_b9bbbd.flag || v_eebb85(v_b9bbbd.isoCode.toLowerCase()),
    countryCode: v_54d586, 
  };
};

export const v_9816af = (
  state: v_1d418a,
  v_a4d981,
  v_a56041
): v_da1883 => {

  const v_ad59cf = v_bae0c0(v_a4d981, v_b6e533.name);

  const v_86ceee = v_ad59cf !== null 
    ? v_ad59cf 
    : (v_b6e533.isoCode ? parseInt(v_b6e533.isoCode, 10) || (v_a56041 !== undefined ? v_a56041 + 1 : 0) : (v_a56041 !== undefined ? v_a56041 + 1 : 0));

  return {
    iso2: v_b6e533.name, 
    name: v_b6e533.name, 
    dialCode: String(v_86ceee), 
    flagEmoji: '📍',
    countryCode: v_a4d981,
  };
};

export const v_e30d2f = (): v_da1883[] => {
  try {
    const v_6c7bef = v_856b63.getAllCountries();
    const v_9b07bc = v_6c7bef.map(v_8066f5);

    const v_e8b858 = v_9b07bc.findIndex(v_3f4e2e => v_3f4e2e.iso2.toLowerCase() === 'kr');
    if (v_e8b858 > 0) {
      const v_621722 = v_9b07bc[v_e8b858];
      const v_986d86 = v_9b07bc.filter(v_3f4e2e => v_3f4e2e.iso2.toLowerCase() !== 'kr');
      return [v_621722, ...v_986d86];
    }

    return v_9b07bc;
  } catch (v_5e9bfe) {
    console.error('[countryStateCityUtils] 국가 목록 로드 실패:', v_5e9bfe);
    return [];
  }
};

export const v_071875 = (
  v_52c475,
  v_a4d981
): v_da1883[] => {
  try {
    const v_4cbaf4 = v_944e0c.getStatesOfCountry(v_52c475.toUpperCase());
    const converted: v_da1883[] = [];

    for (let v_ebec57 = 0; v_ebec57 < v_4cbaf4.length; v_ebec57++) {
      const v_b6e533 = v_4cbaf4[v_ebec57];
      const v_a6c30b = v_9816af(v_b6e533, v_a4d981, v_ebec57);
      v_9b07bc.push(v_a6c30b);
    }

    v_9b07bc.sort((v_779914, v_148ff6) => {
      const v_5375a8 = parseInt(v_779914.dialCode, 10);
      const v_931f91 = parseInt(v_148ff6.dialCode, 10);
      return v_5375a8 - v_931f91;
    });

    return v_9b07bc;
  } catch (v_5e9bfe) {
    console.error('[countryStateCityUtils] 지역 목록 로드 실패:', v_5e9bfe);
    return [];
  }
};

export const v_56ad9c = (v_52c475): boolean => {
  try {
    const v_4cbaf4 = v_944e0c.getStatesOfCountry(v_52c475.toUpperCase());
    return v_4cbaf4.length > 0;
  } catch (v_5e9bfe) {
    return false;
  }
};

export const v_58c98d = (v_a4d981, v_52c475): boolean => {

  if (v_52c475) {
    return v_56ad9c(v_52c475);
  }

  const v_46b18e = {
    82: 'kr', 81: 'jp', 86: 'cn', 1: 'us', 62: 'id',
  };
  const v_2afc27 = v_46b18e[v_a4d981];
  if (v_2afc27) {
    return v_56ad9c(v_2afc27);
  }

  return false;
};

