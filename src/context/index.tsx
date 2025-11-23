
import React, { createContext, useContext, useMemo, useState } from 'react';

type AppContextValue = {
  walletSendAddress: string;
  setWalletSendAddress: (address: string) => void;
  resetWalletSendAddress: () => void;
  addTokenDialogVisible: boolean;
  openAddTokenDialog: () => void;
  closeAddTokenDialog: () => void;
};

const AppContext = createContext<AppContextValue | undefined>(undefined);

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [walletSendAddress, setWalletSendAddress] = useState('');
  const [addTokenDialogVisible, setAddTokenDialogVisible] = useState(false);

  const value = useMemo(
    () => ({
      walletSendAddress,
      setWalletSendAddress,
      resetWalletSendAddress: () => setWalletSendAddress(''),
      addTokenDialogVisible,
      openAddTokenDialog: () => setAddTokenDialogVisible(true),
      closeAddTokenDialog: () => setAddTokenDialogVisible(false),
    }),
    [walletSendAddress, addTokenDialogVisible],
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

