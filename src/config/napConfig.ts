

export const v_ebc3c8 = {

  API_BASE_URL: 'https://oth-path.nstation.co.kr/v2',

  CAMPAIGN_LIST_URL: 'https://oth-path.nstation.co.kr/v2/camp_list',

  API_KEY: 'YOUR_API_KEY',

  TIMEOUT: 30000,

  DEVICE_INFO_CACHE_DURATION: 24 * 60 * 60 * 1000,

  MAX_RETRY_COUNT: 3,

  RETRY_DELAY: 1000,

  MKEY: '1191',
  MCKEY: '10737',

  CB_PARAM: 'T015',
};

export const v_2c02b7 = (v_e0a4be = 'production') => {
  const v_151ce4 = {
    development: {
      API_BASE_URL: 'https://oth-path.nstation.co.kr/v2',
      CAMPAIGN_LIST_URL: 'https://oth-path.nstation.co.kr/v2/camp_list',
      API_KEY: 'DEV_API_KEY',
    },
    staging: {
      API_BASE_URL: 'https://oth-path.nstation.co.kr/v2',
      CAMPAIGN_LIST_URL: 'https://oth-path.nstation.co.kr/v2/camp_list',
      API_KEY: 'STAGING_API_KEY',
    },
    production: {
      API_BASE_URL: 'https://oth-path.nstation.co.kr/v2',
      CAMPAIGN_LIST_URL: 'https://oth-path.nstation.co.kr/v2/camp_list',
      API_KEY: 'PRODUCTION_API_KEY',
    },
  };

  return {
    ...v_ebc3c8,
    ...v_151ce4[v_e0a4be],
  };
};

