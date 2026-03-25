

const KR_MAPPING: { [key: string]: number } = {
  'Seoul': 2,
  'Gyeonggi Province': 31,
  'Incheon': 32,
  'Gangwon Province': 33,
  'South Chungcheong Province': 41,
  'Daejeon': 42,
  'North Chungcheong Province': 43,
  'Sejong City': 44,
  'Busan': 51,
  'Ulsan': 52,
  'Daegu': 53,
  'North Gyeongsang Province': 54,
  'South Gyeongsang Province': 55,
  'South Jeolla Province': 61,
  'Gwangju': 62,
  'North Jeolla Province': 63,
  'Jeju': 64,
};

const JP_MAPPING: { [key: string]: number } = {
  'Hokkaido': 1,
  'Aomori': 2,
  'Iwate': 3,
  'Miyagi': 4,
  'Akita': 5,
  'Yamagata': 6,
  'Fukushima': 7,
  'Ibaraki': 8,
  'Tochigi': 9,
  'Gunma': 10,
  'Saitama': 11,
  'Chiba': 12,
  'Tokyo': 13,
  'Kanagawa': 14,
  'Niigata': 15,
  'Toyama': 16,
  'Ishikawa': 17,
  'Fukui': 18,
  'Yamanashi': 19,
  'Nagano': 20,
  'Gifu': 21,
  'Shizuoka': 22,
  'Aichi': 23,
  'Mie': 24,
  'Shiga': 25,
  'Kyoto': 26,
  'Osaka': 27,
  'Hyogo': 28,
  'Nara': 29,
  'Wakayama': 30,
  'Tottori': 31,
  'Shimane': 32,
  'Okayama': 33,
  'Hiroshima': 34,
  'Yamaguchi': 35,
  'Tokushima': 36,
  'Kagawa': 37,
  'Ehime': 38,
  'Kochi': 39,
  'Fukuoka': 40,
  'Saga': 41,
  'Nagasaki': 42,
  'Kumamoto': 43,
  'Oita': 44,
  'Miyazaki': 45,
  'Kagoshima': 46,
  'Okinawa': 47,
};

const CN_MAPPING: { [key: string]: number } = {
  'Beijing': 1,
  'Tianjin': 2,
  'Hebei': 3,
  'Shanxi': 4,
  'Inner Mongolia': 5,
  'Liaoning': 6,
  'Jilin': 7,
  'Heilongjiang': 8,
  'Shanghai': 9,
  'Jiangsu': 10,
  'Zhejiang': 11,
  'Anhui': 12,
  'Fujian': 13,
  'Jiangxi': 14,
  'Shandong': 15,
  'Henan': 16,
  'Hubei': 17,
  'Hunan': 18,
  'Guangdong': 19,
  'Guangxi': 20,
  'Hainan': 21,
  'Chongqing': 22,
  'Sichuan': 23,
  'Guizhou': 24,
  'Yunnan': 25,
  'Tibet': 26,
  'Shaanxi': 27,
  'Gansu': 28,
  'Qinghai': 29,
  'Ningxia': 30,
  'Xinjiang': 31,
  'Hong Kong': 32,
  'Macau': 33,
  'Taiwan': 34,

  'Guangxi Zhuang': 20,   
  'Hong Kong SAR': 32,    
  'Macau SAR': 33,        
  'Ningxia Huizu': 30,    
  'Xizang': 26,           
};

const US_MAPPING: { [key: string]: number } = {
  'Alabama': 1,
  'Alaska': 2,
  'Arizona': 3,
  'Arkansas': 4,
  'California': 5,
  'Colorado': 6,
  'Connecticut': 7,
  'Delaware': 8,
  'Florida': 9,
  'Georgia': 10,
  'Hawaii': 11,
  'Idaho': 12,
  'Illinois': 13,
  'Indiana': 14,
  'Iowa': 15,
  'Kansas': 16,
  'Kentucky': 17,
  'Louisiana': 18,
  'Maine': 19,
  'Maryland': 20,
  'Massachusetts': 21,
  'Michigan': 22,
  'Minnesota': 23,
  'Mississippi': 24,
  'Missouri': 25,
  'Montana': 26,
  'Nebraska': 27,
  'Nevada': 28,
  'New Hampshire': 29,
  'New Jersey': 30,
  'New Mexico': 31,
  'New York': 32,
  'North Carolina': 33,
  'North Dakota': 34,
  'Ohio': 35,
  'Oklahoma': 36,
  'Oregon': 37,
  'Pennsylvania': 38,
  'Rhode Island': 39,
  'South Carolina': 40,
  'South Dakota': 41,
  'Tennessee': 42,
  'Texas': 43,
  'Utah': 44,
  'Vermont': 45,
  'Virginia': 46,
  'Washington': 47,
  'West Virginia': 48,
  'Wisconsin': 49,
  'Wyoming': 50,
  'District of Columbia': 51,
};

const ID_MAPPING: { [key: string]: number } = {
  'Aceh': 1,
  'Bali': 2,
  'Banten': 3,
  'Bengkulu': 4,
  'Yogyakarta': 5,
  'Jakarta': 6,
  'Gorontalo': 7,
  'Jambi': 8,
  'West Java': 9,
  'Central Java': 10,
  'East Java': 11,
  'West Kalimantan': 12,
  'South Kalimantan': 13,
  'Central Kalimantan': 14,
  'East Kalimantan': 15,
  'North Kalimantan': 16,
  'Bangka Belitung Islands': 17,
  'Riau Islands': 18,
  'Lampung': 19,
  'Maluku': 20,
  'North Maluku': 21,
  'West Nusa Tenggara': 22,
  'East Nusa Tenggara': 23,
  'Papua': 24,
  'West Papua': 25,
  'Riau': 26,
  'West Sulawesi': 27,
  'South Sulawesi': 28,
  'Central Sulawesi': 29,
  'Southeast Sulawesi': 30,
  'North Sulawesi': 31,
  'West Sumatra': 32,
  'South Sumatra': 33,
  'North Sumatra': 34,
  'West Jakarta': 35,
  'South Jakarta': 36,
  'Central Jakarta': 37,
  'East Jakarta': 38,
  'North Jakarta': 39,
};

const REGION_SUBCODE_MAPPING: { [countryCode: number]: { [regionName: string]: number } } = {
  82: KR_MAPPING,
  81: JP_MAPPING,
  86: CN_MAPPING,
  1: US_MAPPING,
  62: ID_MAPPING,
};

export const getSubcodeFromPackageRegion = (
  countryCode: number,
  packageRegionName: string
): number | null => {
  const countryMapping = REGION_SUBCODE_MAPPING[countryCode];
  if (!countryMapping) {
    if (__DEV__) {
      console.warn('[regionSubcodeMapping] 지원하지 않는 국가 코드:', countryCode);
    }
    return null;
  }

  let subcode = countryMapping[packageRegionName];
  if (subcode !== undefined) {
    return subcode;
  }

  const lowerRegionName = packageRegionName.toLowerCase();
  for (const [key, value] of Object.entries(countryMapping)) {
    if (key.toLowerCase() === lowerRegionName) {
      return value;
    }
  }

  const regionNameWithoutSuffix = packageRegionName
    .replace(/\s*(Province|Prefecture|City|State|Island|Islands|Autonomous Region|Special Administrative Region)$/i, '')
    .trim();

  if (regionNameWithoutSuffix !== packageRegionName) {
    subcode = countryMapping[regionNameWithoutSuffix];
    if (subcode !== undefined) {
      return subcode;
    }

    const normalizedName = regionNameWithoutSuffix
      .replace(/Ō/g, 'O')
      .replace(/ō/g, 'o')
      .replace(/ū/g, 'u')
      .replace(/ē/g, 'e')
      .replace(/ā/g, 'a')
      .replace(/ī/g, 'i');

    if (normalizedName !== regionNameWithoutSuffix) {
      subcode = countryMapping[normalizedName];
      if (subcode !== undefined) {
        return subcode;
      }
    }
  }

  if (__DEV__) {
    console.warn('[regionSubcodeMapping] 지역명 매핑 실패:', {
      countryCode,
      packageRegionName,
      regionNameWithoutSuffix,
      availableRegions: Object.keys(countryMapping),
    });
  }

  return null;
};

export const getPackageRegionNameFromSubcode = (
  countryCode: number,
  subcode: number
): string | null => {
  const countryMapping = REGION_SUBCODE_MAPPING[countryCode];
  if (!countryMapping) {
    return null;
  }

  for (const [regionName, mappedSubcode] of Object.entries(countryMapping)) {
    if (mappedSubcode === subcode) {
      return regionName;
    }
  }

  return null;
};

