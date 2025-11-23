
import React, { createContext, useContext, useMemo, useState } from 'react';
import { ROUTES, ScreenName } from '../navigation';
import { ClauseId, ShopItem } from '../types';

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
};

const AppContext = createContext<AppContextValue | undefined>(undefined);

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [walletSendAddress, setWalletSendAddress] = useState('');
  const [addTokenDialogVisible, setAddTokenDialogVisible] = useState(false);
  const [verificationSuccessRoute, setVerificationSuccessRoute] =
    useState<ScreenName>(ROUTES.login);
  const [selectedClauseId, setSelectedClauseId] = useState<ClauseId>('service');
  const [selectedShopItem, setSelectedShopItem] = useState<ShopItem | undefined>(undefined);

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
    }),
    [
      walletSendAddress,
      addTokenDialogVisible,
      verificationSuccessRoute,
      selectedClauseId,
      selectedShopItem,
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

