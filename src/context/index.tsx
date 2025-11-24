
import React, { createContext, useContext, useMemo, useState } from 'react';
import { ROUTES, ScreenName } from '../navigation';
import { ClauseId, CountryDialCode, ShopItem, EmergencyStopInfo } from '../types';
import { COUNTRY_DIAL_CODES, REGIONS_AS_COUNTRY_DIAL_CODES } from '../constants';

type AppContextValue = {
  walletSendAddress: string;
  setWalletSendAddress: (address: string) => void;
  resetWalletSendAddress: () => void;
  addTokenDialogVisible: boolean;
  openAddTokenDialog: () => void;
  closeAddTokenDialog: () => void;
  verificationSuccessRoute: ScreenName;
  setVerificationSuccessRoute: (route: ScreenName) => void;
  resetVerificationSuccessRoute: () => void;
  selectedClauseId: ClauseId;
  setSelectedClauseId: (clause: ClauseId) => void;
  selectedShopItem?: ShopItem;
  setSelectedShopItem: (item?: ShopItem) => void;
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
};

const AppContext = createContext<AppContextValue | undefined>(undefined);

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [walletSendAddress, setWalletSendAddress] = useState('');
  const [addTokenDialogVisible, setAddTokenDialogVisible] = useState(false);
  const [verificationSuccessRoute, setVerificationSuccessRoute] =
    useState<ScreenName>(ROUTES.login);
  const [selectedClauseId, setSelectedClauseId] = useState<ClauseId>('service');
  const [selectedShopItem, setSelectedShopItem] = useState<ShopItem | undefined>(undefined);
  const [emergencyStop, setEmergencyStop] = useState<EmergencyStopInfo>(null);
  const defaultCountry = COUNTRY_DIAL_CODES.find((country) => country.iso2 === 'kr') ?? COUNTRY_DIAL_CODES[0];
  const [selectedCountryDialCode, setSelectedCountryDialCode] = useState<CountryDialCode>(defaultCountry);
  const [selectedRegion, setSelectedRegion] = useState<CountryDialCode | null>(null);
  const [selectMode, setSelectMode] = useState<'country' | 'region'>('country');

  const value = useMemo(
    () => ({
      walletSendAddress,
      setWalletSendAddress,
      resetWalletSendAddress: () => setWalletSendAddress(''),
      addTokenDialogVisible,
      openAddTokenDialog: () => setAddTokenDialogVisible(true),
      closeAddTokenDialog: () => setAddTokenDialogVisible(false),
      verificationSuccessRoute,
      setVerificationSuccessRoute,
      resetVerificationSuccessRoute: () => setVerificationSuccessRoute(ROUTES.login),
      selectedClauseId,
      setSelectedClauseId,
      selectedShopItem,
      setSelectedShopItem,
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
    }),
    [
      walletSendAddress,
      addTokenDialogVisible,
      verificationSuccessRoute,
      selectedClauseId,
      selectedShopItem,
      emergencyStop,
      selectedCountryDialCode,
      selectedRegion,
      selectMode,
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

