
import v_a3453e, { v_af12cb, v_76a8a9, v_df9f57, v_5ab095 } from 'bapkr';

type AppContextValue = {
  walletSendAddress: string;
  setWalletSendAddress: (address: string) => void;
  resetWalletSendAddress: () => void;
  addTokenDialogVisible: boolean;
  openAddTokenDialog: () => void;
  closeAddTokenDialog: () => void;
};

const v_b657db = v_af12cb<AppContextValue | undefined>(undefined);

export const v_4b64f4 = ({ children: v_21f619 }: { children: v_a3453e.ReactNode }) => {
  const [v_ee27aa, v_134f07] = v_5ab095('');
  const [v_750b67, v_2cdd41] = v_5ab095(false);

  const v_3b402b = v_df9f57(
    () => ({
      walletSendAddress: v_ee27aa,
      setWalletSendAddress: v_134f07,
      resetWalletSendAddress: () => v_134f07(''),
      addTokenDialogVisible: v_750b67,
      openAddTokenDialog: () => v_2cdd41(true),
      closeAddTokenDialog: () => v_2cdd41(false),
    }),
    [v_ee27aa, v_750b67],
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

