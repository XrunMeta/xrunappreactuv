
import v_a3453e, { v_af12cb, v_76a8a9, v_df9f57, v_5ab095 } from 'bapkr';
import { v_ce4741, v_01e0ec } from '../navigation';
import { v_9dd03c, v_da1883, v_745d71, v_ac312b } from '../types';
import { v_202d44, v_52495e } from '../constants';

type AppContextValue = {
  walletSendAddress: string;
  setWalletSendAddress: (address: string) => void;
  resetWalletSendAddress: () => void;
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
  selectedShopItem?: v_745d71;
  setSelectedShopItem: (item?: v_745d71) => void;
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
    gender: 'male' | 'female';
    ageRange: '10' | '20' | '30' | '40' | '50+';
    termsAccepted: boolean;
  };
  setSignupFormData: (data: Partial<AppContextValue['signupFormData']>) => void;
  resetSignupFormData: () => void;
};

const v_b657db = v_af12cb<AppContextValue | undefined>(undefined);

export const v_4b64f4 = ({ children: v_21f619 }: { children: v_a3453e.ReactNode }) => {
  const [v_ee27aa, v_134f07] = v_5ab095('');
  const [v_750b67, v_2cdd41] = v_5ab095(false);
  const [v_e6976c, v_8f89f3] =
    v_5ab095<v_01e0ec>(v_ce4741.login);
  const [v_fc0b2c, v_b572c3] = v_5ab095('');
  const [v_6e7459, v_48a083] = v_5ab095<v_9dd03c>('service');
  const [v_dfe883, v_d0fbad] = v_5ab095<v_745d71 | undefined>(undefined);
  const [v_b135ca, v_69fcdc] = v_5ab095<v_ac312b>(null);
  const v_d7c38a = v_202d44.find((v_b9bbbd) => v_b9bbbd.iso2 === 'kr') ?? v_202d44[0];
  const [v_459d5e, v_f693e7] = v_5ab095<v_da1883>(v_d7c38a);
  const [v_2f03bc, v_2f2d51] = v_5ab095<v_da1883 | null>(null);
  const [v_479a37, v_67ab1c] = v_5ab095<'country' | 'region'>('country');
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

  const v_3b402b = v_df9f57(
    () => ({
      walletSendAddress: v_ee27aa,
      setWalletSendAddress: v_134f07,
      resetWalletSendAddress: () => v_134f07(''),
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
      selectedShopItem: v_dfe883,
      setSelectedShopItem: v_d0fbad,
      emergencyStop: v_b135ca,
      setEmergencyStop: v_69fcdc,
      selectedCountryDialCode: v_459d5e,
      setSelectedCountryDialCode: v_f693e7,
      resetSelectedCountryDialCode: () => v_f693e7(v_d7c38a),
      selectedRegion: v_2f03bc,
      setSelectedRegion: v_2f2d51,
      resetSelectedRegion: () => v_2f2d51(null),
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
    }),
    [
      v_ee27aa,
      v_750b67,
      v_e6976c,
      v_fc0b2c,
      v_6e7459,
      v_dfe883,
      v_b135ca,
      v_459d5e,
      v_2f03bc,
      v_479a37,
      v_8d7bc8,
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

