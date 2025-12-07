import { Platform } from 'react-native';

export const COLORS = {
  primary: '#007AFF',
  secondary: '#5856D6',
  background: '#FFFFFF',
  text: '#000000',
  error: '#FF3B30',
  success: '#34C759',

  buttonPrimary: '#343a5a',
  buttonSecondary: '#ffdc04',

  headerText: '#10192d',
  headerIconBg: '#F8FAFC',
};

export const SIZES = {
  small: 12,
  medium: 16,
  large: 20,
  xlarge: 24,
};

export const IS_DEV_MODE = __DEV__;

export const LANG = {
  referral: {
    settlement: {
      list: {
        desc: '추천 광고 수익 정산',
      },
    },
    card: {
      income: '총수익',
      myRank: '내 순위',
    },
  },
  wallet: {
    adxrun: {
      settlementIn45Days: '45일후 정산완료됨',
    },
  },
  screen_info: {
    button: {
      share: 'XRUN 레퍼럴을 참여하시면 광고수익이 유니레벨방식으로 8단계까지 20%씩 올라와요.\n추천해주세요!\n\n가입후에 아래의 이메일을 추천인으로 반드시 입력하세요. \n\n 👉추천인 이메일: \n',
    },
  },
} as const;

export const COMMON_STYLES = {
  container: {
    flex: 1,
    width: '100%' as const,
    maxWidth: 780,
  },

  bottomSection: {
    alignSelf: 'center' as const,
    marginTop: 'auto' as const,
    paddingTop: SIZES.medium, 
    marginBottom: SIZES.large, 
  },
  bottomButtonContainer: {
    paddingTop: SIZES.large, 
    marginBottom: SIZES.large,
    width: '100%' as const,
    marginTop: 'auto' as const,
  },
  listSamllTermsContainer: {
    width: '100%',
    display: 'flex' as const,
    flexDirection: 'column' as const,
    alignItems: 'flex-start' as const,
    justifyContent: 'flex-start' as const,
    gap: SIZES.small,
  },
  getScreenStyle: () => ({
    flex: 1,
    backgroundColor: COLORS.background,
    paddingBottom: Platform.OS === 'ios' ? 0 : 50, 
  }),
  scrollContent: {
    paddingHorizontal: SIZES.xlarge,
    paddingVertical: SIZES.xlarge,
  },
  contentContainer: {
    paddingHorizontal: SIZES.xlarge,
    paddingVertical: SIZES.xlarge,
  },
};

export const LIST_STYLES = {
  width: '100%',
  display: 'flex' as const,
  flexDirection: 'column' as const,
  alignItems: 'flex-start' as const,
  justifyContent: 'flex-start' as const,
  gap: SIZES.small,
  small: {
    gap: SIZES.small,   
  },
  medium: {
    gap: SIZES.medium,
  },
  large: {
    gap: SIZES.large,
  },
  xlarge: {
    gap: SIZES.xlarge,
  },
};

export const FORM_STYLES = {
  fieldContainer: {
    display: 'flex' as const,
    flexDirection: 'column' as const,
    gap: SIZES.large,
  },
}  as const;

export const SAFE_AREA = {
  background: '#ffffff',
  bottomBackground: '#fafafa',
};

export const HEADER = {

  contentHeight: 52,

  minHeight: 52,
} as const;

export { COUNTRY_DIAL_CODES } from './countryDialCodes';
export {
  REGIONS_AS_COUNTRY_DIAL_CODES,
  getRegionIdByIso2,
  getIso2ByRegionId,
  getRegionNameById,
} from './regions';

