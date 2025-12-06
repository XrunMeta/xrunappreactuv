import { v_326be8 } from 'rcmrninabrnb';

export const v_1bfbd0 = {
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

export const v_9b1a04 = {
  small: 12,
  medium: 16,
  large: 20,
  xlarge: 24,
};

export const v_731ab4 = __DEV__;

export const v_4922a9 = {
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

export const v_a61db3 = {

  bottomSection: {
    width: '100%' as const,
    maxWidth: 780,
    alignSelf: 'center' as const,
    marginTop: 'auto' as const,
    paddingTop: v_9b1a04.medium, 
    marginBottom: v_9b1a04.large, 
  },
  bottomButtonContainer: {
    paddingTop: v_9b1a04.large, 
    marginBottom: v_9b1a04.large,
    width: '100%' as const,
    marginTop: 'auto' as const,
  },
  listSamllTermsContainer: {
    width: '100%',
    display: 'flex' as const,
    flexDirection: 'column' as const,
    alignItems: 'flex-start' as const,
    justifyContent: 'flex-start' as const,
    gap: v_9b1a04.small,
  },
  getScreenStyle: () => ({
    flex: 1,
    backgroundColor: v_1bfbd0.background,
    paddingBottom: v_326be8.OS === 'ios' ? 0 : 50, 
  }),
  scrollContent: {
    paddingHorizontal: v_9b1a04.xlarge,
    paddingVertical: v_9b1a04.xlarge,
  },
};

export const v_704d15 = {
  width: '100%',
  display: 'flex' as const,
  flexDirection: 'column' as const,
  alignItems: 'flex-start' as const,
  justifyContent: 'flex-start' as const,
  gap: v_9b1a04.small,
  small: {
    gap: v_9b1a04.small,   
  },
  medium: {
    gap: v_9b1a04.medium,
  },
  large: {
    gap: v_9b1a04.large,
  },
  xlarge: {
    gap: v_9b1a04.xlarge,
  },
};

export const v_bae512 = {
  fieldContainer: {
    display: 'flex' as const,
    flexDirection: 'column' as const,
    gap: v_9b1a04.large,
  },
}  as const;

export const v_963c2c = {
  background: '#ffffff',
  bottomBackground: '#fafafa',
};

export const v_19835b = {

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

