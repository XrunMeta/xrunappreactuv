
import v_a3453e, { v_af12cb, v_76a8a9, v_df9f57, v_5ab095, v_c4deb2 } from 'bapkr';
import { v_ce4741, v_01e0ec } from '../navigation';
import { v_9dd03c, v_3ac6ea, v_da1883, v_745d71, v_ac312b, v_fa3302, v_5681b1 } from '../types';
import { v_202d44, v_1bd8ad, v_52495e, v_369014, v_789afd } from '../constants';

type AppContextValue = {
  walletSendAddress: string;
  setWalletSendAddress: (address: string) => void;
  resetWalletSendAddress: () => void;
  walletSendAmount: string;
  setWalletSendAmount: (amount: string) => void;
  resetWalletSendAmount: () => void;
  walletReceiveAddress: string;
  setWalletReceiveAddress: (address: string) => void;
  resetWalletReceiveAddress: () => void;
  walletReceiveCurrency: number;
  setWalletReceiveCurrency: (currency: number) => void;
  resetWalletReceiveCurrency: () => void;
  addTokenDialogVisible: boolean;
  openAddTokenDialog: () => void;
  closeAddTokenDialog: () => void;
  verificationSuccessRoute: v_01e0ec;
  setVerificationSuccessRoute: (route: v_01e0ec) => void;
  resetVerificationSuccessRoute: () => void;
  verificationEmail: string;
  setVerificationEmail: (email: string) => void;
  resetVerificationEmail: () => void;
  selectedClauseId: v_9dd03c;
  setSelectedClauseId: (clause: v_9dd03c) => void;
  selectedAgreementType: v_3ac6ea | null;
  setSelectedAgreementType: (type: v_3ac6ea | null) => void;
  selectedShopItem?: v_745d71;
  setSelectedShopItem: (item?: v_745d71) => void;
  selectedReferralMember?: { member: string; email: string; depth?: number };
  setSelectedReferralMember: (member?: { member: string; email: string; depth?: number }) => void;
  emergencyStop: v_ac312b;
  setEmergencyStop: (info: v_ac312b) => void;
  selectedCountryDialCode: v_da1883;
  setSelectedCountryDialCode: (country: v_da1883) => void;
  resetSelectedCountryDialCode: () => void;
  selectedRegion: v_da1883 | null;
  setSelectedRegion: (region: v_da1883 | null) => void;
  resetSelectedRegion: () => void;
  selectMode: 'country' | 'region';
  setSelectMode: (mode: 'country' | 'region') => void;

  signupFormData: {
    familyName: string;
    givenName: string;
    email: string;
    password: string;
    phoneNumber: string;
    region: string;
    referralEmail: string;
    gender: 'male' | 'female' | '0';
    ageRange: '0' | '10' | '20' | '30' | '40' | '50+';
    termsAccepted: boolean;
  };
  setSignupFormData: (data: Partial<AppContextValue['signupFormData']>) => void;
  resetSignupFormData: () => void;
  advertisementParams: v_fa3302 | null;
  setAdvertisementParams: (params: v_fa3302 | null) => void;
  resetAdvertisementParams: () => void;
  selectedWalletAsset: v_5681b1 | null;
  setSelectedWalletAsset: (asset: v_5681b1 | null) => void;
  resetSelectedWalletAsset: () => void;
  transactionResult: {
    txHash: string;
    amount: string;
    symbol: string;
    toAddress: string;
    gasPrice: string;
    network: string;
    currency: number;
    chainId: number;
  } | null;
  setTransactionResult: (result: {
    txHash: string;
    amount: string;
    symbol: string;
    toAddress: string;
    gasPrice: string;
    network: string;
    currency: number;
    chainId: number;
  } | null) => void;
  resetTransactionResult: () => void;
  selectedTransactionDetails: import('../screens/TransactionDetailsScreen').TransactionDetails | null;
  setSelectedTransactionDetails: (details: import('../screens/TransactionDetailsScreen').TransactionDetails | null) => void;
  resetSelectedTransactionDetails: () => void;
};

const v_b657db = v_af12cb<AppContextValue | undefined>(undefined);

export const v_4b64f4 = ({ children: v_21f619 }: { children: v_a3453e.ReactNode }) => {
  const [v_ee27aa, v_134f07] = v_5ab095('');
  const [v_e5d0e8, v_8f0018] = v_5ab095('0');
  const [v_589fe1, v_f0d0d2] = v_5ab095('');
  const [v_4efba4, v_00796a] = v_5ab095<number>(1);
  const [v_750b67, v_2cdd41] = v_5ab095(false);
  const [v_e6976c, v_8f89f3] =
    v_5ab095<v_01e0ec>(v_ce4741.login);
  const [v_fc0b2c, v_b572c3] = v_5ab095('');
  const [v_6e7459, v_48a083] = v_5ab095<v_9dd03c>('service');
  const [v_eff210, v_dba657] = v_5ab095<v_3ac6ea | null>(null);
  const [v_dfe883, v_d0fbad] = v_5ab095<v_745d71 | undefined>(undefined);
  const [v_f87030, v_779227] = v_5ab095<{ member: string; email: string } | undefined>(undefined);
  const [v_b135ca, v_69fcdc] = v_5ab095<v_ac312b>(null);
  const v_d7c38a = v_1bd8ad.find((v_b9bbbd) => v_b9bbbd.iso2 === 'kr') ?? v_1bd8ad[0];
  const [v_459d5e, v_f693e7] = v_5ab095<v_da1883>(v_d7c38a);

  const v_2a5c62 = v_df9f57(() => {
    const v_e94fdf = v_369014(v_d7c38a.iso2);
    return v_e94fdf[0] || v_789afd;
  }, []);
  const [v_2f03bc, v_2f2d51] = v_5ab095<v_da1883 | null>(v_2a5c62);
  const [v_479a37, v_67ab1c] = v_5ab095<'country' | 'region'>('country');

  v_c4deb2(() => {

    if (v_2f03bc && (v_2f03bc.dialCode === '0' || v_2f03bc.iso2 === 'select')) {
      return;
    }

    const v_e94fdf = v_369014(v_459d5e.iso2);
    const v_d2a53b = v_2f03bc
      ? v_e94fdf.some((v_a6c30b) => 
          v_a6c30b.iso2 === v_2f03bc.iso2 && 
          v_a6c30b.countryCode === v_459d5e.countryCode &&
          v_a6c30b.dialCode === v_2f03bc.dialCode
        )
      : false;

    if (!v_d2a53b && v_2f03bc && v_2f03bc.countryCode === v_459d5e.countryCode) {

      return;
    }
    if (!v_d2a53b) {

      if (v_e94fdf.length > 0 && v_e94fdf[0].iso2 !== 'global') {
        v_2f2d51(v_e94fdf[0]);
      } else {
        v_2f2d51(v_789afd);
      }
    }
  }, [v_459d5e, v_2f03bc]);
  const [v_8d7bc8, v_d61c3a] = v_5ab095<AppContextValue['signupFormData']>({
    familyName: '',
    givenName: '',
    email: '',
    password: '',
    phoneNumber: '',
    region: '',
    referralEmail: '',
    gender: 'male',
    ageRange: '10',
    termsAccepted: true,
  });
  const [v_d0b6d4, v_50d169] = v_5ab095<v_fa3302 | null>(null);

  const v_d48a26 = (params: v_fa3302 | null) => {
    v_50d169(v_24baff);
  };
  const [v_ea6a7a, v_84bd3c] = v_5ab095<v_5681b1 | null>(null);
  const [v_0fc1c4, v_fcca8e] = v_5ab095<{
    txHash: string;
    amount: string;
    symbol: string;
    toAddress: string;
    gasPrice: string;
    network: string;
    currency: number;
    chainId: number;
  } | null>(null);
  const [v_c51166, v_b2bb9d] = v_5ab095<import('../screens/TransactionDetailsScreen').TransactionDetails | null>(null);

  const v_3b402b = v_df9f57(
    () => ({
      walletSendAddress: v_ee27aa,
      setWalletSendAddress: v_134f07,
      resetWalletSendAddress: () => v_134f07(''),
      walletSendAmount: v_e5d0e8,
      setWalletSendAmount: v_8f0018,
      resetWalletSendAmount: () => v_8f0018('0'),
      walletReceiveAddress: v_589fe1,
      setWalletReceiveAddress: v_f0d0d2,
      resetWalletReceiveAddress: () => v_f0d0d2(''),
      walletReceiveCurrency: v_4efba4,
      setWalletReceiveCurrency: v_00796a,
      resetWalletReceiveCurrency: () => v_00796a(1),
      addTokenDialogVisible: v_750b67,
      openAddTokenDialog: () => v_2cdd41(true),
      closeAddTokenDialog: () => v_2cdd41(false),
      verificationSuccessRoute: v_e6976c,
      setVerificationSuccessRoute: v_8f89f3,
      resetVerificationSuccessRoute: () => v_8f89f3(v_ce4741.login),
      verificationEmail: v_fc0b2c,
      setVerificationEmail: v_b572c3,
      resetVerificationEmail: () => v_b572c3(''),
      selectedClauseId: v_6e7459,
      setSelectedClauseId: v_48a083,
      selectedAgreementType: v_eff210,
      setSelectedAgreementType: v_dba657,
      selectedShopItem: v_dfe883,
      setSelectedShopItem: v_d0fbad,
      selectedReferralMember: v_f87030,
      setSelectedReferralMember: v_779227,
      emergencyStop: v_b135ca,
      setEmergencyStop: v_69fcdc,
      selectedCountryDialCode: v_459d5e,
      setSelectedCountryDialCode: v_f693e7,
      resetSelectedCountryDialCode: () => {
        v_f693e7(v_d7c38a);
        const v_e94fdf = v_369014(v_d7c38a.iso2);
        v_2f2d51(v_e94fdf[0] || v_789afd);
      },
      selectedRegion: v_2f03bc,
      setSelectedRegion: v_2f2d51,
      resetSelectedRegion: () => {
        const v_e94fdf = v_369014(v_459d5e.iso2);
        v_2f2d51(v_e94fdf[0] || v_789afd);
      },
      selectMode: v_479a37,
      setSelectMode: v_67ab1c,
      signupFormData: v_8d7bc8,
      setSignupFormData: (v_9390e8) => {
        v_d61c3a((v_ba2215) => ({ ...v_ba2215, ...v_9390e8 }));
      },
      resetSignupFormData: () => {
        v_d61c3a({
          familyName: '',
          givenName: '',
          email: '',
          password: '',
          phoneNumber: '',
          region: '',
          referralEmail: '',
          gender: 'male',
          ageRange: '10',
          termsAccepted: true,
        });
      },
      advertisementParams: v_d0b6d4,
      setAdvertisementParams: v_d48a26,
      resetAdvertisementParams: () => {
        v_d48a26(null);
      },
      selectedWalletAsset: v_ea6a7a,
      setSelectedWalletAsset: v_84bd3c,
      resetSelectedWalletAsset: () => v_84bd3c(null),
      transactionResult: v_0fc1c4,
      setTransactionResult: v_fcca8e,
      resetTransactionResult: () => v_fcca8e(null),
      selectedTransactionDetails: v_c51166,
      setSelectedTransactionDetails: v_b2bb9d,
      resetSelectedTransactionDetails: () => v_b2bb9d(null),
    }),
    [
      v_ee27aa,
      v_e5d0e8,
      v_589fe1,
      v_4efba4,
      v_750b67,
      v_e6976c,
      v_fc0b2c,
      v_6e7459,
      v_eff210,
      v_dfe883,
      v_f87030,
      v_b135ca,
      v_459d5e,
      v_2f03bc,
      v_479a37,
      v_8d7bc8,
      v_d0b6d4,
      v_ea6a7a,
      v_0fc1c4,
      v_c51166,
    ],
  );

  return <AppContext.Provider value={v_3b402b}>{v_21f619}</AppContext.Provider>;
};

export const v_700ef9 = () => {
  const v_e3aeb3 = v_76a8a9(v_b657db);

  if (!v_e3aeb3) {
    throw new Error('useAppContext must be used within AppProvider');
  }

  return v_e3aeb3;
};

export { useAlertDialog, AlertDialogProvider } from './AlertDialogContext';
