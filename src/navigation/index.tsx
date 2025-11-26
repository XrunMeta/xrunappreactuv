import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const ROUTES = {
  authLanding: 'authLanding',
  login: 'login',
  signup: 'signup',
  countryCodeSelect: 'countryCodeSelect',
  emailVerification: 'emailVerification',
  verificationCode: 'verificationCode',
  terms: 'terms',
  privacy: 'privacy',
  wallet: 'wallet',
  polygonHistory: 'polygonHistory',
  xrunHistory: 'xrunHistory',
  nftHistory: 'nftHistory',
  xrunHistory2: 'xrunHistory2',
  adHistory: 'adHistory',
  transactionDetails: 'transactionDetails',
  map: 'map',
  walletSend: 'walletSend',
  walletQrScan: 'walletQrScan',
  walletEstimate: 'walletEstimate',
  walletTransactionProgress: 'walletTransactionProgress',
  walletTransactionResult: 'walletTransactionResult',
  walletReceive: 'walletReceive',
  myInfo: 'myInfo',
  myInfoEmailAuth: 'myInfoEmailAuth',
  myInfoEdit: 'myInfoEdit',
  myInfoPhoneEdit: 'myInfoPhoneEdit',
  myInfoSettings: 'myInfoSettings',
  myInfoCloseMembership: 'myInfoCloseMembership',
  myInfoCloseMembershipSuccess: 'myInfoCloseMembershipSuccess',
  myInfoClauses: 'myInfoClauses',
  myInfoClauseDetail: 'myInfoClauseDetail',
  myInfoNotify: 'myInfoNotify',
  myInfoReferral: 'myInfoReferral',
  myInfoFaq: 'myInfoFaq',
  referralMyGroup: 'referralMyGroup',
  referralSettlement: 'referralSettlement',
  referralRank: 'referralRank',
  referralDepthOne: 'referralDepthOne',
  referralDepthTwo: 'referralDepthTwo',
  shopTicket: 'shopTicket',
  shopMyTicket: 'shopMyTicket',
  shopBuy: 'shopBuy',
  shopSuccess: 'shopSuccess',
  shopTicketDetail: 'shopTicketDetail',
  showNapAd: 'showNapAd',
} as const;

export type ScreenName = keyof typeof ROUTES;

interface NavigationContextValue {
  currentScreen: ScreenName;
  navigate: (screen: ScreenName) => void;
  goBack: () => void;
  reset: (screen: ScreenName) => void;
  canGoBack: boolean;
}

const NavigationContext = createContext<NavigationContextValue | undefined>(
  undefined,
);

export const NavigationProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [stack, setStack] = useState<ScreenName[]>(['authLanding']);
  const [isInitialized, setIsInitialized] = useState(false);

  const currentScreen = stack[stack.length - 1];

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const remember = await AsyncStorage.getItem('rememberMe');
        const loggedIn = await AsyncStorage.getItem('isLoggedIn');

        if (remember === 'true' && loggedIn === 'true') {

          console.log('[Navigation] 자동 로그인 확인: MapMainScreen으로 이동');
          setStack([ROUTES.map]);
        } else {

          console.log('[Navigation] 자동 로그인 없음: 기본 화면 유지');
        }
      } catch (error) {
        console.error('[Navigation] 로그인 상태 확인 실패:', error);
      } finally {
        setIsInitialized(true);
      }
    };

    checkLoginStatus();
  }, []);

  const navigate = useCallback((screen: ScreenName) => {
    setStack((prev) => {
      if (prev[prev.length - 1] === screen) {
        return prev;
      }
      return [...prev, screen];
    });
  }, []);

  const goBack = useCallback(() => {
    setStack((prev) => {
      if (prev.length <= 1) {
        return prev;
      }
      return prev.slice(0, -1);
    });
  }, []);

  const reset = useCallback((screen: ScreenName) => {
    setStack([screen]);
  }, []);

  const value = useMemo(
    () => ({
      currentScreen,
      navigate,
      goBack,
      reset,
      canGoBack: stack.length > 1,
    }),
    [currentScreen, navigate, goBack, reset, stack.length],
  );

  return (
    <NavigationContext.Provider value={value}>
      {children}
    </NavigationContext.Provider>
  );
};

export const useAppNavigation = () => {
  const context = useContext(NavigationContext);

  if (!context) {
    throw new Error('useAppNavigation must be used within NavigationProvider');
  }

  return context;
};
