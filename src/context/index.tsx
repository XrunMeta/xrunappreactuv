
import React, { createContext, useContext, useMemo, useState, useEffect } from 'react';
import { ROUTES, ScreenName } from '../navigation';
import { ClauseId, AgreementType, CountryDialCode, ShopItem, EmergencyStopInfo, AdvertisementParams, CombinedAsset } from '../types';
import { COUNTRY_DIAL_CODES, ALLOWED_COUNTRIES, REGIONS_AS_COUNTRY_DIAL_CODES, getRegionsByCountryIso2, GLOBAL_REGION } from '../constants';

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
  verificationSuccessRoute: ScreenName;
  setVerificationSuccessRoute: (route: ScreenName) => void;
  resetVerificationSuccessRoute: () => void;
  verificationEmail: string;
  setVerificationEmail: (email: string) => void;
  resetVerificationEmail: () => void;
  selectedClauseId: ClauseId;
  setSelectedClauseId: (clause: ClauseId) => void;
  selectedAgreementType: AgreementType | null;
  setSelectedAgreementType: (type: AgreementType | null) => void;
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
    gender: 'male' | 'female' | '0';
    ageRange: '0' | '10' | '20' | '30' | '40' | '50+';
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
  selectedTransactionDetails: import('../screens/TransactionDetailsScreen').TransactionDetails | null;
  setSelectedTransactionDetails: (details: import('../screens/TransactionDetailsScreen').TransactionDetails | null) => void;
  resetSelectedTransactionDetails: () => void;
};

const AppContext = createContext<AppContextValue | undefined>(undefined);

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [walletSendAddress, setWalletSendAddress] = useState('');
  const [walletSendAmount, setWalletSendAmount] = useState('0');
  const [walletReceiveAddress, setWalletReceiveAddress] = useState('');
  const [walletReceiveCurrency, setWalletReceiveCurrency] = useState<number>(1);
  const [addTokenDialogVisible, setAddTokenDialogVisible] = useState(false);
  const [verificationSuccessRoute, setVerificationSuccessRoute] =
    useState<ScreenName>(ROUTES.login);
  const [verificationEmail, setVerificationEmail] = useState('');
  const [selectedClauseId, setSelectedClauseId] = useState<ClauseId>('service');
  const [selectedAgreementType, setSelectedAgreementType] = useState<AgreementType | null>(null);
  const [selectedShopItem, setSelectedShopItem] = useState<ShopItem | undefined>(undefined);
  const [selectedReferralMember, setSelectedReferralMember] = useState<{ member: string; email: string } | undefined>(undefined);
  const [emergencyStop, setEmergencyStop] = useState<EmergencyStopInfo>(null);
  const defaultCountry = ALLOWED_COUNTRIES.find((country) => country.iso2 === 'kr') ?? ALLOWED_COUNTRIES[0];
  const [selectedCountryDialCode, setSelectedCountryDialCode] = useState<CountryDialCode>(defaultCountry);

  const initialRegion = useMemo(() => {
    const regions = getRegionsByCountryIso2(defaultCountry.iso2);
    return regions[0] || GLOBAL_REGION;
  }, []);
  const [selectedRegion, setSelectedRegion] = useState<CountryDialCode | null>(initialRegion);
  const [selectMode, setSelectMode] = useState<'country' | 'region'>('country');

  useEffect(() => {

    if (selectedRegion && (selectedRegion.dialCode === '0' || selectedRegion.iso2 === 'select')) {
      return;
    }

    const regions = getRegionsByCountryIso2(selectedCountryDialCode.iso2);
    const isRegionValid = selectedRegion
      ? regions.some((region) => 
          region.iso2 === selectedRegion.iso2 && 
          region.countryCode === selectedCountryDialCode.countryCode &&
          region.dialCode === selectedRegion.dialCode
        )
      : false;

    if (!isRegionValid && selectedRegion && selectedRegion.countryCode === selectedCountryDialCode.countryCode) {

      return;
    }
    if (!isRegionValid) {

      if (regions.length > 0 && regions[0].iso2 !== 'global') {
        setSelectedRegion(regions[0]);
      } else {
        setSelectedRegion(GLOBAL_REGION);
      }
    }
  }, [selectedCountryDialCode, selectedRegion]);
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
  const [advertisementParams, setAdvertisementParamsState] = useState<AdvertisementParams | null>(null);

  const setAdvertisementParams = (params: AdvertisementParams | null) => {
    setAdvertisementParamsState(params);
  };
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
  const [selectedTransactionDetails, setSelectedTransactionDetails] = useState<import('../screens/TransactionDetailsScreen').TransactionDetails | null>(null);

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
      walletReceiveCurrency,
      setWalletReceiveCurrency,
      resetWalletReceiveCurrency: () => setWalletReceiveCurrency(1),
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
      selectedAgreementType,
      setSelectedAgreementType,
      selectedShopItem,
      setSelectedShopItem,
      selectedReferralMember,
      setSelectedReferralMember,
      emergencyStop,
      setEmergencyStop,
      selectedCountryDialCode,
      setSelectedCountryDialCode,
      resetSelectedCountryDialCode: () => {
        setSelectedCountryDialCode(defaultCountry);
        const regions = getRegionsByCountryIso2(defaultCountry.iso2);
        setSelectedRegion(regions[0] || GLOBAL_REGION);
      },
      selectedRegion,
      setSelectedRegion,
      resetSelectedRegion: () => {
        const regions = getRegionsByCountryIso2(selectedCountryDialCode.iso2);
        setSelectedRegion(regions[0] || GLOBAL_REGION);
      },
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
      resetAdvertisementParams: () => {
        setAdvertisementParams(null);
      },
      selectedWalletAsset,
      setSelectedWalletAsset,
      resetSelectedWalletAsset: () => setSelectedWalletAsset(null),
      transactionResult,
      setTransactionResult,
      resetTransactionResult: () => setTransactionResult(null),
      selectedTransactionDetails,
      setSelectedTransactionDetails,
      resetSelectedTransactionDetails: () => setSelectedTransactionDetails(null),
    }),
    [
      walletSendAddress,
      walletSendAmount,
      walletReceiveAddress,
      walletReceiveCurrency,
      addTokenDialogVisible,
      verificationSuccessRoute,
      verificationEmail,
      selectedClauseId,
      selectedAgreementType,
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
      selectedTransactionDetails,
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

export { useAlertDialog, AlertDialogProvider } from './AlertDialogContext';
