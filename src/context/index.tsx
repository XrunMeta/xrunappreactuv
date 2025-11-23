
import v_a3453e, { v_af12cb, v_76a8a9, v_df9f57, v_5ab095 } from 'bapkr';
import { v_ce4741, v_01e0ec } from '../navigation';
import { v_9dd03c, v_745d71, v_ac312b } from '../types';

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
  selectedClauseId: v_9dd03c;
  setSelectedClauseId: (clause: v_9dd03c) => void;
  selectedShopItem?: v_745d71;
  setSelectedShopItem: (item?: v_745d71) => void;
  emergencyStop: v_ac312b;
  setEmergencyStop: (info: v_ac312b) => void;
};

const v_b657db = v_af12cb<AppContextValue | undefined>(undefined);

export const v_4b64f4 = ({ children: v_21f619 }: { children: v_a3453e.ReactNode }) => {
  const [v_ee27aa, v_134f07] = v_5ab095('');
  const [v_750b67, v_2cdd41] = v_5ab095(false);
  const [v_e6976c, v_8f89f3] =
    v_5ab095<v_01e0ec>(v_ce4741.login);
  const [v_6e7459, v_48a083] = v_5ab095<v_9dd03c>('service');
  const [v_dfe883, v_d0fbad] = v_5ab095<v_745d71 | undefined>(undefined);
  const [v_b135ca, v_69fcdc] = v_5ab095<v_ac312b>(null);

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
      selectedClauseId: v_6e7459,
      setSelectedClauseId: v_48a083,
      selectedShopItem: v_dfe883,
      setSelectedShopItem: v_d0fbad,
      emergencyStop: v_b135ca,
      setEmergencyStop: v_69fcdc,
    }),
    [
      v_ee27aa,
      v_750b67,
      v_e6976c,
      v_6e7459,
      v_dfe883,
      v_b135ca,
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

