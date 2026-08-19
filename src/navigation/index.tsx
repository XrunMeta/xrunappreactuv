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
import { trackScreen, trackEvent } from '../services/clickTracker';
import { resolveBackAction } from './backNavigationPolicy';
import { replaceTop } from './stackOps';

export const ROUTES = {
  authLanding: 'authLanding',
  login: 'login',
  forgotPassword: 'forgotPassword',
  signup: 'signup',
  countryCodeSelect: 'countryCodeSelect',
  emailVerification: 'emailVerification',
  verificationCode: 'verificationCode',
  referralInput: 'referralInput',
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
  shop: 'shop',
  shopTicket: 'shopTicket',
  shopMyTicket: 'shopMyTicket',
  shopMyItems: 'shopMyItems',
  shopMyTicketDetail: 'shopMyTicketDetail',
  shopProductDetail: 'shopProductDetail',
  shopBuy: 'shopBuy',
  shopSuccess: 'shopSuccess',
  shopTicketDetail: 'shopTicketDetail',
  shopItemRegister: 'shopItemRegister',
  showNapAd: 'showNapAd',
  showNapMxReward: 'showNapMxReward',
  showPockAd: 'showPockAd',
  showWebView: 'showWebView',
  xrunInfo: 'xrunInfo',
  xplayInfo: 'xplayInfo',
  xplayZone: 'xplayZone',
  xrunWalletDescription: 'xrunWalletDescription',
  myinfoShopSales: 'myinfoShopSales',
  pangleList: 'pangleList',
  ayetOffers: 'ayetOffers',
  ayetOffersXplay: 'ayetOffersXplay',
  webViewTest: 'webViewTest',
  tapjoyList: 'tapjoyList',
  walletPrivateKeyDisplay: 'walletPrivateKeyDisplay',
  walletPrivateKeyGoogleAuth: 'walletPrivateKeyGoogleAuth',
  walletRestore: 'walletRestore',
  myInfoEmailAuth: 'myInfoEmailAuth',
  myInfoPaymentPin: 'myInfoPaymentPin',
  myChipsOfferwall: 'myChipsOfferwall',
  adisonOfferwall: 'adisonOfferwall',
  adisonTest: 'adisonTest',
  walletKeyTutorial: 'walletKeyTutorial',
  walletKeyGuide: 'walletKeyGuide',

  deviceUnblockRequest: 'deviceUnblockRequest',
} as const;

export type ScreenName = keyof typeof ROUTES;

interface NavigationContextValue {
  currentScreen: ScreenName;
  previousScreen: ScreenName | null;
  navigate: (screen: ScreenName) => void;

  replace: (screen: ScreenName) => void;
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
    if (!isInitialized) return;
    trackScreen(currentScreen);
  }, [currentScreen, isInitialized]);

  useEffect(() => {
    const BOOT_SLOW_LOG = '[!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!부팅 느림]';
    const checkLoginStatus = async () => {
      const t0 = Date.now();
      console.log(BOOT_SLOW_LOG, '자동 로그인 확인(AsyncStorage) 시작');
      try {

        const remember = await AsyncStorage.getItem('rememberMe');
        const loggedIn = await AsyncStorage.getItem('isLoggedIn');
        console.log(BOOT_SLOW_LOG, '자동 로그인 확인 완료', `${Date.now() - t0}ms`, { remember, loggedIn });

        console.log('[Navigation] 자동 로그인 확인:', {
          remember,
          loggedIn,
          rememberType: typeof remember,
          loggedInType: typeof loggedIn,
        });

        if (remember === 'true' && loggedIn === 'true') {

          console.log('[Navigation] 자동 로그인 확인: MapMainScreen으로 이동');
          setStack([ROUTES.map]);
          setIsInitialized(true);
          return;
        }

        console.log('[Navigation] 자동 로그인 없음: 기본 화면 유지', {
          remember,
          loggedIn,
          rememberCheck: remember === 'true',
          loggedInCheck: loggedIn === 'true',
        });
      } catch (error) {
        console.error(BOOT_SLOW_LOG, '로그인 상태 확인 실패:', error);
      } finally {
        setIsInitialized(true);
        console.log(BOOT_SLOW_LOG, 'Navigation 초기화 완료 (첫 화면 결정됨)', `${Date.now() - t0}ms`);
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

  const replace = useCallback((screen: ScreenName) => {
    setStack((prev) => {
      const newStack = replaceTop(prev as string[], screen) as ScreenName[];
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

  const reset = useCallback((screenOrPayload: ScreenName | { index?: number; routes?: { name: string }[] }) => {
    const screen: ScreenName =
      typeof screenOrPayload === 'string'
        ? screenOrPayload
        : (screenOrPayload?.routes?.[0]?.name as ScreenName) ?? ROUTES.map;
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
      trackEvent('back_press', { category: 'navigation', params: { from: currentScreen } });

      const action = resolveBackAction({
        screen: currentScreen,
        canGoBack: currentStack.length > 1,
        source: 'hardware',
      });
      console.log('[Navigation] BackHandler: 정책 판정 =', action);

      if (action === 'block') {
        return true; 
      }

      if (action === 'goBack') {
        goBack();
        return true; 
      }

      if (action === 'resetMap') {
        reset(ROUTES.map);
        return true;
      }

      if (action === 'resetWallet') {
        reset(ROUTES.wallet);
        return true;
      }

      const now = Date.now();
      const timeSinceLastPress = now - backHandlerTimeRef.current;
      console.log('[Navigation] BackHandler: 루트 화면, 마지막 클릭으로부터 경과 시간:', timeSinceLastPress, 'ms');

      if (timeSinceLastPress < 2000) {
        console.log('[Navigation] BackHandler: 두 번 눌렀으므로 앱 종료');
        BackHandler.exitApp();
        return true;
      }

      backHandlerTimeRef.current = now;
      console.log('[Navigation] BackHandler: 첫 번째 클릭, 뒤로가기를 한 번 더 누르면 앱이 종료됩니다.');
      return true; 
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
      replace,
      goBack,
      reset,
      canGoBack: stack.length > 1,
    }),
    [currentScreen, previousScreen, navigate, replace, goBack, reset, stack.length],
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
