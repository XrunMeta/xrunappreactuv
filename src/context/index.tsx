
import React, { createContext, useContext, useMemo, useState } from 'react';
import { ROUTES, ScreenName } from '../navigation';
import { ClauseId, CountryDialCode, ShopItem, EmergencyStopInfo, AdvertisementParams, CombinedAsset } from '../types';
import { COUNTRY_DIAL_CODES, REGIONS_AS_COUNTRY_DIAL_CODES } from '../constants';

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
  addTokenDialogVisible: boolean;
  openAddTokenDialog: () => void;
  closeAddTokenDialog: () => void;
  verificationSuccessRoute: ScreenName;
  setVerificationSuccessRoute: (route: ScreenName) => void;
  resetVerificationSuccessRoute: () => void;
  verificationEmail: string;
  setVerificationEmail: (email: string) => void;
  resetVerificationEmail: () => void;
  selectedClauseId: ClauseId;
  setSelectedClauseId: (clause: ClauseId) => void;
  selectedShopItem?: ShopItem;
  setSelectedShopItem: (item?: ShopItem) => void;
  selectedReferralMember?: { member: string; email: string; depth?: number };
  setSelectedReferralMember: (member?: { member: string; email: string; depth?: number }) => void;
  emergencyStop: EmergencyStopInfo;
  setEmergencyStop: (info: EmergencyStopInfo) => void;
  selectedCountryDialCode: CountryDialCode;
  setSelectedCountryDialCode: (country: CountryDialCode) => void;
  resetSelectedCountryDialCode: () => void;
  selectedRegion: CountryDialCode | null;
  setSelectedRegion: (region: CountryDialCode | null) => void;
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
  advertisementParams: AdvertisementParams | null;
  setAdvertisementParams: (params: AdvertisementParams | null) => void;
  resetAdvertisementParams: () => void;
  selectedWalletAsset: CombinedAsset | null;
  setSelectedWalletAsset: (asset: CombinedAsset | null) => void;
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
};

const AppContext = createContext<AppContextValue | undefined>(undefined);

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [walletSendAddress, setWalletSendAddress] = useState('');
  const [walletSendAmount, setWalletSendAmount] = useState('0');
  const [walletReceiveAddress, setWalletReceiveAddress] = useState('');
  const [addTokenDialogVisible, setAddTokenDialogVisible] = useState(false);
  const [verificationSuccessRoute, setVerificationSuccessRoute] =
    useState<ScreenName>(ROUTES.login);
  const [verificationEmail, setVerificationEmail] = useState('');
  const [selectedClauseId, setSelectedClauseId] = useState<ClauseId>('service');
  const [selectedShopItem, setSelectedShopItem] = useState<ShopItem | undefined>(undefined);
  const [selectedReferralMember, setSelectedReferralMember] = useState<{ member: string; email: string } | undefined>(undefined);
  const [emergencyStop, setEmergencyStop] = useState<EmergencyStopInfo>(null);
  const defaultCountry = COUNTRY_DIAL_CODES.find((country) => country.iso2 === 'kr') ?? COUNTRY_DIAL_CODES[0];
  const [selectedCountryDialCode, setSelectedCountryDialCode] = useState<CountryDialCode>(defaultCountry);
  const [selectedRegion, setSelectedRegion] = useState<CountryDialCode | null>(null);
  const [selectMode, setSelectMode] = useState<'country' | 'region'>('country');
  const [signupFormData, setSignupFormDataState] = useState<AppContextValue['signupFormData']>({
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
  const [advertisementParams, setAdvertisementParams] = useState<AdvertisementParams | null>(null);
  const [selectedWalletAsset, setSelectedWalletAsset] = useState<CombinedAsset | null>(null);
  const [transactionResult, setTransactionResult] = useState<{
    txHash: string;
    amount: string;
    symbol: string;
    toAddress: string;
    gasPrice: string;
    network: string;
    currency: number;
    chainId: number;
  } | null>(null);

  const value = useMemo(
    () => ({
      walletSendAddress,
      setWalletSendAddress,
      resetWalletSendAddress: () => setWalletSendAddress(''),
      walletSendAmount,
      setWalletSendAmount,
      resetWalletSendAmount: () => setWalletSendAmount('0'),
      walletReceiveAddress,
      setWalletReceiveAddress,
      resetWalletReceiveAddress: () => setWalletReceiveAddress(''),
      addTokenDialogVisible,
      openAddTokenDialog: () => setAddTokenDialogVisible(true),
      closeAddTokenDialog: () => setAddTokenDialogVisible(false),
      verificationSuccessRoute,
      setVerificationSuccessRoute,
      resetVerificationSuccessRoute: () => setVerificationSuccessRoute(ROUTES.login),
      verificationEmail,
      setVerificationEmail,
      resetVerificationEmail: () => setVerificationEmail(''),
      selectedClauseId,
      setSelectedClauseId,
      selectedShopItem,
      setSelectedShopItem,
      selectedReferralMember,
      setSelectedReferralMember,
      emergencyStop,
      setEmergencyStop,
      selectedCountryDialCode,
      setSelectedCountryDialCode,
      resetSelectedCountryDialCode: () => setSelectedCountryDialCode(defaultCountry),
      selectedRegion,
      setSelectedRegion,
      resetSelectedRegion: () => setSelectedRegion(null),
      selectMode,
      setSelectMode,
      signupFormData,
      setSignupFormData: (data: Partial<AppContextValue['signupFormData']>) => {
        setSignupFormDataState((prev) => ({ ...prev, ...data }));
      },
      resetSignupFormData: () => {
        setSignupFormDataState({
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
      advertisementParams,
      setAdvertisementParams,
      resetAdvertisementParams: () => setAdvertisementParams(null),
      selectedWalletAsset,
      setSelectedWalletAsset,
      resetSelectedWalletAsset: () => setSelectedWalletAsset(null),
      transactionResult,
      setTransactionResult,
      resetTransactionResult: () => setTransactionResult(null),
    }),
    [
      walletSendAddress,
      walletSendAmount,
      walletReceiveAddress,
      addTokenDialogVisible,
      verificationSuccessRoute,
      verificationEmail,
      selectedClauseId,
      selectedShopItem,
      selectedReferralMember,
      emergencyStop,
      selectedCountryDialCode,
      selectedRegion,
      selectMode,
      signupFormData,
      advertisementParams,
      selectedWalletAsset,
      transactionResult,
    ],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error('useAppContext must be used within AppProvider');
  }

  return context;
};

