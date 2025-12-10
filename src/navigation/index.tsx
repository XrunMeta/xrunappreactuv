import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { BackHandler, Platform } from 'react-native';
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
  walletDetail: 'walletDetail',
  transactionDetails: 'transactionDetails',
  map: 'map',
  walletSend: 'walletSend',
  walletQrScan: 'walletQrScan',
  walletEstimate: 'walletEstimate',
  walletTransactionProgress: 'walletTransactionProgress',
  walletTransactionResult: 'walletTransactionResult',
  walletReceive: 'walletReceive',
  walletAddressBook: 'walletAddressBook',
  addWalletAddress: 'addWalletAddress',
  myInfo: 'myInfo',
  myInfoEmailAuth: 'myInfoEmailAuth',
  myInfoEdit: 'myInfoEdit',
  myInfoPhoneEdit: 'myInfoPhoneEdit',
  myInfoChangePassword: 'myInfoChangePassword',
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
  showPockAd: 'showPockAd',
  xrunInfo: 'xrunInfo',
  myinfoShopSales: 'myinfoShopSales',
} as const;

export type ScreenName = keyof typeof ROUTES;

interface NavigationContextValue {
  currentScreen: ScreenName;
  previousScreen: ScreenName | null;
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
  const backHandlerTimeRef = useRef<number>(0);
  const stackRef = useRef<ScreenName[]>(['authLanding']);

  const currentScreen = stack[stack.length - 1];
  const previousScreen = stack.length > 1 ? stack[stack.length - 2] : null;

  useEffect(() => {
    stackRef.current = stack;
  }, [stack]);

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
      const newStack = [...prev, screen];
      stackRef.current = newStack; 
      return newStack;
    });
  }, []);

  const goBack = useCallback(() => {
    setStack((prev) => {
      if (prev.length <= 1) {
        return prev;
      }
      const newStack = prev.slice(0, -1);
      stackRef.current = newStack; 
      return newStack;
    });
  }, []);

  const reset = useCallback((screen: ScreenName) => {
    const newStack = [screen];
    stackRef.current = newStack; 
    setStack(newStack);
  }, []);

  useEffect(() => {
    if (Platform.OS !== 'android') {
      console.log('[Navigation] BackHandler: iOS 환경이므로 BackHandler를 등록하지 않습니다.');
      return;
    }

    console.log('[Navigation] BackHandler: Android 하드웨어 백 버튼 리스너 등록');

    const backAction = () => {

      const currentStack = stackRef.current;
      const currentScreen = currentStack[currentStack.length - 1];
      console.log('[Navigation] BackHandler: 뒤로가기 버튼 감지, 현재 스택 길이:', currentStack.length, '화면:', currentStack, '현재 화면:', currentScreen);

      const isWalletScreen = currentScreen?.startsWith('wallet') || currentScreen === 'polygonHistory' || currentScreen === 'xrunHistory' || currentScreen === 'nftHistory' || currentScreen === 'xrunHistory2' || currentScreen === 'adHistory';

      const isMyInfoScreen = currentScreen?.startsWith('myInfo');

      const isShopScreen = currentScreen?.startsWith('shop');

      const isReferralScreen = currentScreen?.startsWith('referral');

      if (isWalletScreen || isMyInfoScreen) {
        if (currentStack.length > 1) {
          console.log('[Navigation] BackHandler: 지갑/정보 화면 - 이전 화면으로 이동');
          goBack();
          return true; 
        } else {

          console.log('[Navigation] BackHandler: 지갑/정보 화면 - 뒤로 갈 수 없으므로 맵으로 이동');
          reset(ROUTES.map);
          return true;
        }
      } else if (isShopScreen || isReferralScreen) {

        console.log('[Navigation] BackHandler: 쇼핑/추천 화면 - 맵으로 이동');
        reset(ROUTES.map);
        return true;
      } else {

        if (currentStack.length > 1) {
          console.log('[Navigation] BackHandler: 스택에 화면이 있으므로 이전 화면으로 이동');
          goBack();
          return true; 
        }

        const now = Date.now();
        const timeSinceLastPress = now - backHandlerTimeRef.current;
        console.log('[Navigation] BackHandler: 루트 화면, 마지막 클릭으로부터 경과 시간:', timeSinceLastPress, 'ms');

        if (timeSinceLastPress < 2000) {

          console.log('[Navigation] BackHandler: 두 번 눌렀으므로 앱 종료');
          BackHandler.exitApp();
          return true;
        } else {

          backHandlerTimeRef.current = now;
          console.log('[Navigation] BackHandler: 첫 번째 클릭, 뒤로가기를 한 번 더 누르면 앱이 종료됩니다.');
          return true; 
        }
      }
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
    console.log('[Navigation] BackHandler: 리스너 등록 완료');

    return () => {
      console.log('[Navigation] BackHandler: 리스너 제거');
      backHandler.remove();
    };
  }, [goBack, reset]); 

  const value = useMemo(
    () => ({
      currentScreen,
      previousScreen,
      navigate,
      goBack,
      reset,
      canGoBack: stack.length > 1,
    }),
    [currentScreen, previousScreen, navigate, goBack, reset, stack.length],
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
