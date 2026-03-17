import React, { useState, useEffect, useCallback, useRef, lazy, Suspense } from 'react';
import { AppState, AppStateStatus, InteractionManager, NativeModules, Platform, View, ActivityIndicator } from 'react-native';
import * as Linking from 'expo-linking';
import * as Application from 'expo-application';
import * as Clipboard from 'expo-clipboard';

import { SplashScreen } from './src/screens/SplashScreen';
import { LoginScreen } from './src/screens/LoginScreen';
import { LoginSignupScreen } from './src/screens/LoginSignupScreen';
import { SignupScreen } from './src/screens/SignupScreen';
import { MapMainScreen } from './src/screens/MapMainScreen';

const MyInfoFaqScreen = lazy(() => import('./src/screens/MyInfoFaqScreen').then((m) => ({ default: m.MyInfoFaqScreen })));
const CountryCodeSelectScreen = lazy(() => import('./src/screens/CountryCodeSelectScreen').then((m) => ({ default: m.CountryCodeSelectScreen })));
const EmailVerificationScreen = lazy(() => import('./src/screens/EmailVerificationScreen').then((m) => ({ default: m.EmailVerificationScreen })));
const VerificationCodeScreen = lazy(() => import('./src/screens/VerificationCodeScreen').then((m) => ({ default: m.VerificationCodeScreen })));
const TermsScreen = lazy(() => import('./src/screens/TermsScreen').then((m) => ({ default: m.TermsScreen })));
const PrivacyPolicyScreen = lazy(() => import('./src/screens/PrivacyPolicyScreen').then((m) => ({ default: m.PrivacyPolicyScreen })));
const WalletScreen = lazy(() => import('./src/screens/WalletScreen').then((m) => ({ default: m.WalletScreen })));
const WalletDetailScreen = lazy(() => import('./src/screens/WalletDetailScreen').then((m) => ({ default: m.WalletDetailScreen })));
const PolygonWalletScreen = lazy(() => import('./src/screens/PolygonWalletScreen').then((m) => ({ default: m.PolygonWalletScreen })));
const XrunWalletScreen = lazy(() => import('./src/screens/XrunWalletScreen').then((m) => ({ default: m.XrunWalletScreen })));
const NftWalletScreen = lazy(() => import('./src/screens/NftWalletScreen').then((m) => ({ default: m.NftWalletScreen })));
const XrunWalletScreen2 = lazy(() => import('./src/screens/XrunWalletScreen2').then((m) => ({ default: m.XrunWalletScreen2 })));
const AdWalletScreen = lazy(() => import('./src/screens/AdWalletScreen').then((m) => ({ default: m.AdWalletScreen })));
const TransactionDetailsScreen = lazy(() => import('./src/screens/TransactionDetailsScreen').then((m) => ({ default: m.TransactionDetailsScreen })));
const WalletSendScreen = lazy(() => import('./src/screens/WalletSendScreen').then((m) => ({ default: m.WalletSendScreen })));
const WalletQrScanScreen = lazy(() => import('./src/screens/WalletQrScanScreen').then((m) => ({ default: m.WalletQrScanScreen })));
const WalletEstimateFeeScreen = lazy(() => import('./src/screens/WalletEstimateFeeScreen').then((m) => ({ default: m.WalletEstimateFeeScreen })));
const WalletTransactionProgressScreen = lazy(() => import('./src/screens/WalletTransactionProgressScreen').then((m) => ({ default: m.WalletTransactionProgressScreen })));
const WalletTransactionResultScreen = lazy(() => import('./src/screens/WalletTransactionResultScreen').then((m) => ({ default: m.WalletTransactionResultScreen })));
const WalletReceiveScreen = lazy(() => import('./src/screens/WalletReceiveScreen').then((m) => ({ default: m.WalletReceiveScreen })));
const AddWalletAddressScreen = lazy(() => import('./src/screens/AddWalletAddressScreen').then((m) => ({ default: m.AddWalletAddressScreen })));
const MyInfoScreen = lazy(() => import('./src/screens/MyInfoScreen').then((m) => ({ default: m.MyInfoScreen })));
const MyInfoEmailAuthScreen = lazy(() => import('./src/screens/MyInfoEmailAuthScreen').then((m) => ({ default: m.MyInfoEmailAuthScreen })));
const MyInfoEditScreen = lazy(() => import('./src/screens/MyInfoEditScreen').then((m) => ({ default: m.MyInfoEditScreen })));
const PhoneEditScreen = lazy(() => import('./src/screens/PhoneEditScreen').then((m) => ({ default: m.PhoneEditScreen })));
const ChangePasswordScreen = lazy(() => import('./src/screens/ChangePasswordScreen').then((m) => ({ default: m.ChangePasswordScreen })));
const MyInfoSettingsScreen = lazy(() => import('./src/screens/MyInfoSettingsScreen').then((m) => ({ default: m.MyInfoSettingsScreen })));
const MyInfoCloseMembershipScreen = lazy(() => import('./src/screens/MyInfoCloseMembershipScreen').then((m) => ({ default: m.MyInfoCloseMembershipScreen })));
const MyInfoCloseMembershipSuccessScreen = lazy(() => import('./src/screens/MyInfoCloseMembershipSuccessScreen').then((m) => ({ default: m.MyInfoCloseMembershipSuccessScreen })));
const MyInfoClausesScreen = lazy(() => import('./src/screens/MyInfoClausesScreen').then((m) => ({ default: m.MyInfoClausesScreen })));
const ClauseDetailScreen = lazy(() => import('./src/screens/ClauseDetailScreen').then((m) => ({ default: m.ClauseDetailScreen })));
const MyInfoNotifyScreen = lazy(() => import('./src/screens/MyInfoNotifyScreen').then((m) => ({ default: m.MyInfoNotifyScreen })));
const MyInfoReferralScreen = lazy(() => import('./src/screens/MyInfoReferralScreen').then((m) => ({ default: m.MyInfoReferralScreen })));
const ReferralMyGroupScreen = lazy(() => import('./src/screens/ReferralMyGroupScreen').then((m) => ({ default: m.ReferralMyGroupScreen })));
const ReferralSettlementScreen = lazy(() => import('./src/screens/ReferralSettlementScreen').then((m) => ({ default: m.ReferralSettlementScreen })));
const ReferralRankScreen = lazy(() => import('./src/screens/ReferralRankScreen').then((m) => ({ default: m.ReferralRankScreen })));
const ReferralDepthOneScreen = lazy(() => import('./src/screens/ReferralDepthOneScreen').then((m) => ({ default: m.ReferralDepthOneScreen })));
const ReferralDepthTwoScreen = lazy(() => import('./src/screens/ReferralDepthTwoScreen').then((m) => ({ default: m.ReferralDepthTwoScreen })));
const ReferralInputScreen = lazy(() => import('./src/screens/ReferralInputScreen').then((m) => ({ default: m.ReferralInputScreen })));
const ShopScreen = lazy(() => import('./src/screens/ShopScreen').then((m) => ({ default: m.ShopScreen })));
const ShopTicketScreen = lazy(() => import('./src/screens/ShopTicketScreen').then((m) => ({ default: m.ShopTicketScreen })));
const ShopMyTicketScreen = lazy(() => import('./src/screens/ShopMyTicketScreen').then((m) => ({ default: m.ShopMyTicketScreen })));
const ShopMyItemsScreen = lazy(() => import('./src/screens/ShopMyItemsScreen').then((m) => ({ default: m.ShopMyItemsScreen })));
const ShopMyTicketDetailScreen = lazy(() => import('./src/screens/ShopMyTicketDetailScreen').then((m) => ({ default: m.ShopMyTicketDetailScreen })));
const ShopProductDetailScreen = lazy(() => import('./src/screens/ShopProductDetailScreen').then((m) => ({ default: m.ShopProductDetailScreen })));
const ShopBuyScreen = lazy(() => import('./src/screens/ShopBuyScreen').then((m) => ({ default: m.ShopBuyScreen })));
const ShopSuccessScreen = lazy(() => import('./src/screens/ShopSuccessScreen').then((m) => ({ default: m.ShopSuccessScreen })));
const ShopTicketDetailScreen = lazy(() => import('./src/screens/ShopTicketDetailScreen').then((m) => ({ default: m.ShopTicketDetailScreen })));
const ShopItemRegisterScreen = lazy(() => import('./src/screens/ShopItemRegisterScreen').then((m) => ({ default: m.ShopItemRegisterScreen })));
const ShowNapAdScreen = lazy(() => import('./src/screens/ShowNapAdScreen').then((m) => ({ default: m.ShowNapAdScreen })));
const ShowPockAdScreen = lazy(() => import('./src/screens/ShowPockAdScreen').then((m) => ({ default: m.ShowPockAdScreen })));
const ShowWebViewScreen = lazy(() => import('./src/screens/ShowWebViewScreen').then((m) => ({ default: m.ShowWebViewScreen })));
const XRUNinfoScreen = lazy(() => import('./src/screens/XRUNinfo').then((m) => ({ default: m.XRUNinfoScreen })));
const XplayInfoScreen = lazy(() => import('./src/screens/XplayInfoScreen').then((m) => ({ default: m.XplayInfoScreen })));
const XplayZoneScreen = lazy(() => import('./src/screens/XplayZoneScreen').then((m) => ({ default: m.XplayZoneScreen })));
const MyinfoShopSalesScreen = lazy(() => import('./src/screens/MyinfoShopSalesScreen').then((m) => ({ default: m.MyinfoShopSalesScreen })));
const PangleListScreen = lazy(() => import('./src/screens/PangleListScreen').then((m) => ({ default: m.PangleListScreen })));
const AyetOffersScreen = lazy(() => import('./src/screens/AyetOffersScreen').then((m) => ({ default: m.AyetOffersScreen })));
const WalletPrivateKeyDisplayScreen = lazy(() => import('./src/screens/WalletPrivateKeyDisplayScreen').then((m) => ({ default: m.WalletPrivateKeyDisplayScreen })));
const WalletPrivateKeyGoogleAuthScreen = lazy(() => import('./src/screens/WalletPrivateKeyGoogleAuthScreen').then((m) => ({ default: m.WalletPrivateKeyGoogleAuthScreen })));

import { NavigationProvider, useAppNavigation } from './src/navigation';
import { AppProvider, OTAUpdateProvider, useAppContext } from './src/context';
import { AlertDialogProvider } from './src/context/AlertDialogContext';
import { AddTokenDialog, AliveService, EmergencyStopDialog, VersionUpdateDialog, OTAUpdateDialog, DevDebugPanel } from './src/components';
import { loadEnvSync, getEnv } from './src/utils/env';
import { showToast } from './src/utils';
import appsFlyer from 'react-native-appsflyer';
import { initI18nSync, applyStoredLanguageAsync } from './src/locales';
import { initializeTaboola } from './src/services/taboola';
import { setAyetUserId } from './src/services/ayet';

import { getTopAd5, getXRUNGopaxPrice, getUsersBalanceUpdateV2 } from './src/services';
import { initGoogleSignIn } from './src/services/googleAuth';
import {
  useFonts,
  Roboto_400Regular,
  Roboto_500Medium,
  Roboto_600SemiBold,
  Roboto_700Bold,
} from '@expo-google-fonts/roboto';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import * as Location from 'expo-location';
import { useAlertDialog } from './src/context/AlertDialogContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fetchMapMarkerData } from './src/services';
import { checkLatestVersion, getCurrentAppVersion, isNewVersionAvailable, isServerVersionUpdateRequired } from './src/services/versionCheck';
import { useTranslation } from 'react-i18next';

const _bootSlowLogAppModule = '[!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!부팅 느림]';
console.log(_bootSlowLogAppModule, '5. App.tsx 모듈 로드 완료 (import 체인 평가 끝, 컴포넌트 마운트 전)');

let processedDeepLinkUrl: string | null = null;
let isDeepLinkProcessing = false;

const ScreenHost = () => {
  const { currentScreen, navigate } = useAppNavigation();
  const { setSignupFormData } = useAppContext();

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const userDataStr = await AsyncStorage.getItem('userData');
        if (cancelled || !userDataStr) return;
        const userData = JSON.parse(userDataStr);
        if (userData?.member != null) setAyetUserId(String(userData.member));
      } catch (_) {}
    })();
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {

    const handleDeepLink = (url: string) => {

      if (isDeepLinkProcessing) {
        console.log('[딥링크] 이미 처리 중인 딥링크, 건너뛰기');
        return;
      }

      if (processedDeepLinkUrl === url) {
        console.log('[딥링크] 이미 처리된 URL, 건너뛰기:', url);
        return;
      }

      try {
        isDeepLinkProcessing = true;
        console.log('[딥링크] URL 처리 시작:', url);

        const parsed = Linking.parse(url);
        console.log('[딥링크] 파싱된 URL:', parsed);

        console.log('parsed.queryParams:', parsed.queryParams);

        const referral = parsed.queryParams?.referral as string | undefined;

        if (referral) {
          console.log('[딥링크] 레퍼럴 코드 추출:', referral);

          processedDeepLinkUrl = url;

          setSignupFormData({ referralEmail: referral });

          console.log('[딥링크] 회원가입 화면으로 이동');
          navigate('signup');
        } else {
          console.log('[딥링크] referral 파라미터가 없습니다.');
        }
      } catch (error) {
        console.error('[딥링크] URL 처리 실패:', error);
      } finally {
        isDeepLinkProcessing = false;
      }
    };

    const getInitialURL = async () => {
      try {
        const initialUrl = await Linking.getInitialURL();
        if (initialUrl) {
          const userDataStr = await AsyncStorage.getItem('userData');
          if (userDataStr) {
            const userData = JSON.parse(userDataStr);
            const member = userData?.member;
            if (member) {
              console.log('[딥링크] 로그인 되어 있음, 딥링크 처리안함');
            } else {
              console.log('[딥링크] 로그인 안되어 있음, 딥링크 처리');
              handleDeepLink(initialUrl);
            }
          } else {
            console.log('[딥링크] userData가 없음, 딥링크 처리');
            handleDeepLink(initialUrl);
          }

        } else {
          console.log('[딥링크] 앱 시작 시 딥링크 없음');
        }
      } catch (error) {
        console.error('[딥링크] 초기 URL 가져오기 실패:', error);
      }
    };

    const subscription = Linking.addEventListener('url', (event) => {
      console.log('[딥링크] 딥링크 이벤트 감지:', event.url);

      if (event.url !== processedDeepLinkUrl) {
        processedDeepLinkUrl = null;
      }
      handleDeepLink(event.url);
    });

    getInitialURL();

    const recheckTimer = setTimeout(() => {
      console.log('[딥링크] 스플래시 종료 후 딥링크 재확인');
      getInitialURL();
    }, 2500); 

    return () => {
      subscription.remove();
      clearTimeout(recheckTimer);
    };
  }, [setSignupFormData, navigate]);

  useEffect(() => {
    const checkInstallReferrer = async () => {

      if (Platform.OS !== 'android') {
        return;
      }

      try {

        const installReferrer = await Application.getInstallReferrerAsync();
        console.log('[Install Referrer] 원본:', installReferrer);

        if (installReferrer) {

          const params = new URLSearchParams(installReferrer);
          const utmSource = params.get('utm_source');
          const utmContent = params.get('utm_content');

          console.log('[Install Referrer] utm_source:', utmSource);
          console.log('[Install Referrer] utm_content:', utmContent);

          if (utmSource === 'referral' && utmContent) {
            const referralEmail = decodeURIComponent(utmContent);
            console.log('[Install Referrer] 추천인 이메일:', referralEmail);

            const processedReferrer = await AsyncStorage.getItem('processed_install_referrer');
            if (processedReferrer === installReferrer) {
              console.log('[Install Referrer] 이미 처리된 referrer, 건너뛰기');
              return;
            }

            await AsyncStorage.setItem('processed_install_referrer', installReferrer);

            setSignupFormData({ referralEmail });

            console.log('[Install Referrer] 회원가입 화면으로 이동');
            navigate('signup');
          }
        }
      } catch (error) {
        console.error('[Install Referrer] 처리 실패:', error);
      }
    };

    const timer = setTimeout(checkInstallReferrer, 3000);

    return () => clearTimeout(timer);
  }, [setSignupFormData, navigate]);

  useEffect(() => {
    const checkClipboardReferral = async () => {

      if (Platform.OS !== 'ios') {
        return;
      }

      try {

        const clipboardContent = await Clipboard.getStringAsync();
        console.log('[iOS Clipboard] 👀👀👀 클립보드 내용:', clipboardContent);

        if (clipboardContent && clipboardContent.startsWith('XRUN_REFERRAL:')) {
          const referralEmail = clipboardContent.replace('XRUN_REFERRAL:', '').trim();
          console.log('[iOS Clipboard] 추천인 이메일:', referralEmail);

          if (referralEmail) {

            const processedClipboard = await AsyncStorage.getItem('processed_clipboard_referral');
            if (processedClipboard === clipboardContent) {
              console.log('[iOS Clipboard] 이미 처리된 클립보드, 건너뛰기');
              return;
            }

            await AsyncStorage.setItem('processed_clipboard_referral', clipboardContent);

            await Clipboard.setStringAsync('');

            setSignupFormData({ referralEmail: decodeURIComponent(referralEmail) });

            console.log('[iOS Clipboard] 회원가입 화면으로 이동');
            navigate('signup');
          }
        }
      } catch (error) {
        console.error('[iOS Clipboard] 처리 실패:', error);
      }
    };

    const timer = setTimeout(checkClipboardReferral, 3000);

    return () => clearTimeout(timer);
  }, [setSignupFormData, navigate]);

  useEffect(() => {
    console.log('[App] 화면 변경 시 및 앱 포커스 시 광고 완료 상태 확인');

  }, [currentScreen]);

  const screenFallback = <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}><ActivityIndicator size="large" color="#007aff" /></View>;
  let screen: React.ReactNode;
  if (currentScreen === 'login') screen = <LoginScreen />;
  else if (currentScreen === 'signup') screen = <SignupScreen />;
  else if (currentScreen === 'countryCodeSelect') screen = <CountryCodeSelectScreen />;
  else if (currentScreen === 'emailVerification') screen = <EmailVerificationScreen />;
  else if (currentScreen === 'verificationCode') screen = <VerificationCodeScreen />;
  else if (currentScreen === 'terms') screen = <TermsScreen />;
  else if (currentScreen === 'privacy') screen = <PrivacyPolicyScreen />;
  else if (currentScreen === 'wallet') screen = <WalletScreen />;
  else if (currentScreen === 'polygonHistory') screen = <PolygonWalletScreen />;
  else if (currentScreen === 'xrunHistory') screen = <XrunWalletScreen />;
  else if (currentScreen === 'nftHistory') screen = <NftWalletScreen />;
  else if (currentScreen === 'xrunHistory2') screen = <XrunWalletScreen2 />;
  else if (currentScreen === 'adHistory') screen = <AdWalletScreen />;
  else if (currentScreen === 'walletDetail') screen = <WalletDetailScreen />;
  else if (currentScreen === 'transactionDetails') screen = <TransactionDetailsScreen />;
  else if (currentScreen === 'map') screen = <MapMainScreen />;
  else if (currentScreen === 'walletSend') screen = <WalletSendScreen />;
  else if (currentScreen === 'walletQrScan') screen = <WalletQrScanScreen />;
  else if (currentScreen === 'walletEstimate') screen = <WalletEstimateFeeScreen />;
  else if (currentScreen === 'walletTransactionProgress') screen = <WalletTransactionProgressScreen />;
  else if (currentScreen === 'walletTransactionResult') screen = <WalletTransactionResultScreen />;
  else if (currentScreen === 'walletReceive') screen = <WalletReceiveScreen />;
  else if (currentScreen === 'addWalletAddress') screen = <AddWalletAddressScreen />;
  else if (currentScreen === 'myInfo') screen = <MyInfoScreen />;
  else if (currentScreen === 'myInfoEmailAuth') screen = <MyInfoEmailAuthScreen />;
  else if (currentScreen === 'myInfoFaq') screen = <MyInfoFaqScreen />;
  else if (currentScreen === 'myInfoEdit') screen = <MyInfoEditScreen />;
  else if (currentScreen === 'myInfoPhoneEdit') screen = <PhoneEditScreen />;
  else if (currentScreen === 'myInfoChangePassword') screen = <ChangePasswordScreen />;
  else if (currentScreen === 'myInfoSettings') screen = <MyInfoSettingsScreen />;
  else if (currentScreen === 'pangleList') screen = <PangleListScreen />;
  else if (currentScreen === 'ayetOffers') screen = <AyetOffersScreen />;
  else if (currentScreen === 'ayetOffersXplay') screen = <AyetOffersScreen slotName="Xplay" />;
  else if (currentScreen === 'walletPrivateKeyDisplay') screen = <WalletPrivateKeyDisplayScreen />;
  else if (currentScreen === 'walletPrivateKeyGoogleAuth') screen = <WalletPrivateKeyGoogleAuthScreen />;
  else if (currentScreen === 'myInfoCloseMembership') screen = <MyInfoCloseMembershipScreen />;
  else if (currentScreen === 'myInfoCloseMembershipSuccess') screen = <MyInfoCloseMembershipSuccessScreen />;
  else if (currentScreen === 'myInfoClauses') screen = <MyInfoClausesScreen />;
  else if (currentScreen === 'myInfoClauseDetail') screen = <ClauseDetailScreen />;
  else if (currentScreen === 'myInfoNotify') screen = <MyInfoNotifyScreen />;
  else if (currentScreen === 'myInfoReferral') screen = <MyInfoReferralScreen />;
  else if (currentScreen === 'referralMyGroup') screen = <ReferralMyGroupScreen />;
  else if (currentScreen === 'referralSettlement') screen = <ReferralSettlementScreen />;
  else if (currentScreen === 'referralRank') screen = <ReferralRankScreen />;
  else if (currentScreen === 'referralDepthOne') screen = <ReferralDepthOneScreen />;
  else if (currentScreen === 'referralDepthTwo') screen = <ReferralDepthTwoScreen />;
  else if (currentScreen === 'referralInput') screen = <ReferralInputScreen />;
  else if (currentScreen === 'shop') {
    console.log('[App.tsx] currentScreen이 shop이므로 ShopScreen 렌더링');
    screen = <ShopScreen />;
  }
  else if (currentScreen === 'shopTicket') screen = <ShopTicketScreen />;
  else if (currentScreen === 'shopMyTicket') screen = <ShopMyTicketScreen />;
  else if (currentScreen === 'shopMyItems') screen = <ShopMyItemsScreen />;
  else if (currentScreen === 'shopMyTicketDetail') screen = <ShopMyTicketDetailScreen />;
  else if (currentScreen === 'shopProductDetail') screen = <ShopProductDetailScreen />;
  else if (currentScreen === 'shopBuy') screen = <ShopBuyScreen />;
  else if (currentScreen === 'shopSuccess') screen = <ShopSuccessScreen />;
  else if (currentScreen === 'shopTicketDetail') screen = <ShopTicketDetailScreen />;
  else if (currentScreen === 'shopItemRegister') screen = <ShopItemRegisterScreen />;
  else if (currentScreen === 'showNapAd') screen = <ShowNapAdScreen />;
  else if (currentScreen === 'showPockAd') screen = <ShowPockAdScreen />;
  else if (currentScreen === 'showWebView') screen = <ShowWebViewScreen />;
  else if (currentScreen === 'xrunInfo') screen = <XRUNinfoScreen />;
  else if (currentScreen === 'xplayInfo') screen = <XplayInfoScreen />;
  else if (currentScreen === 'xplayZone') screen = <XplayZoneScreen />;
  else if (currentScreen === 'myinfoShopSales') screen = <MyinfoShopSalesScreen />;
  else screen = <LoginSignupScreen />;
  return <Suspense fallback={screenFallback}>{screen}</Suspense>;
};

const PermissionRequester = ({ isAdFinished }: { isAdFinished: boolean }) => {
  const [locationPermissionStatus, setLocationPermissionStatus] = useState<Location.PermissionStatus | null>(null);
  const [hasCheckedPermissions, setHasCheckedPermissions] = useState(false);
  const [hasShownDialog, setHasShownDialog] = useState(false);
  const [isRequestingPermissions, setIsRequestingPermissions] = useState(false);
  const { showAlert } = useAlertDialog();

  const fetchAndStoreMarkerData = useCallback(async (latitude: number, longitude: number) => {
    try {
      console.log('[App] 마커 데이터 가져오기 시작:', { latitude, longitude });

      const existingMarkerData = await AsyncStorage.getItem('astorCoinsData');
      if (existingMarkerData) {
        try {
          const parsedData = JSON.parse(existingMarkerData);
          if (parsedData && Array.isArray(parsedData) && parsedData.length > 0) {
            console.log('[App] 마커 데이터가 이미 존재합니다. API 호출을 건너뜁니다:', parsedData.length, '개');
            return;
          }
        } catch (parseError) {
          console.log('[App] 기존 마커 데이터 파싱 실패, 새로 가져옵니다.');
        }
      }

      const userDataStr = await AsyncStorage.getItem('userData');
      if (!userDataStr) {
        console.log('[App] userData가 없어 마커 데이터를 가져올 수 없습니다.');
        return;
      }

      const userData = JSON.parse(userDataStr);
      const member = userData?.member;
      if (!member) {
        console.log('[App] userData에 member가 없어 마커 데이터를 가져올 수 없습니다.');
        return;
      }

      const markerData = await fetchMapMarkerData(latitude, longitude, member);

      if (markerData && Array.isArray(markerData) && markerData.length > 0) {

        await AsyncStorage.setItem('astorCoinsData', JSON.stringify(markerData));
        console.log('[App] 마커 데이터 저장 완료:', markerData.length, '개');
      } else {
        console.log('[App] 마커 데이터가 비어있습니다.');
      }
    } catch (error) {
      console.error('[App] 마커 데이터 가져오기 및 저장 실패:', error);

    }
  }, []);

  const requestLocationPermission = useCallback(async () => {
    try {
      console.log('[App] 위치 권한 요청 시작');
      const locationStatus = await Location.requestForegroundPermissionsAsync();
      setLocationPermissionStatus(locationStatus.status);
      if (locationStatus.status === 'granted') {
        console.log('[App] 위치 권한 허용됨');

        try {
          const currentLocation = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.Balanced,
          });
          const { latitude, longitude } = currentLocation.coords;
          console.log('[App] 현재 위치 가져옴:', { latitude, longitude });

          await fetchAndStoreMarkerData(latitude, longitude);
        } catch (locationError) {
          console.error('[App] 현재 위치 가져오기 실패:', locationError);
        }
      } else {
        console.log('[App] 위치 권한 거부됨:', locationStatus.status);
      }
      return locationStatus.status;
    } catch (error) {
      console.error('[App] 위치 권한 요청 실패:', error);
      return 'denied' as Location.PermissionStatus;
    }
  }, [fetchAndStoreMarkerData]);

  const checkAndShowPermissionDialog = useCallback(async () => {

    if (hasShownDialog || isRequestingPermissions) {
      return;
    }

    const currentLocationStatus = locationPermissionStatus || await Location.getForegroundPermissionsAsync().then(r => r.status);

    const locationDenied = currentLocationStatus !== 'granted';

    if (locationDenied) {
      setHasShownDialog(true);
      await showAlert(
        '위치 권한 필요',
        '앱의 주요 기능을 사용하려면 위치 정보 권한이 필요합니다. 설정에서 권한을 허용해주세요.',
        [
          {
            text: '다시 요청',
            onPress: async () => {
              setIsRequestingPermissions(true);
              setHasShownDialog(false); 

              console.log('[App] 다시 요청: 위치 권한 요청');
              const locationStatus = await requestLocationPermission();

              await new Promise(resolve => setTimeout(resolve, 1000));

              const latestLocationStatus = await Location.getForegroundPermissionsAsync().then(r => r.status);
              setLocationPermissionStatus(latestLocationStatus);

              setIsRequestingPermissions(false);

              setTimeout(() => {
                checkAndShowPermissionDialog();
              }, 500);
            },
          },
          {
            text: '확인',
          },
        ]
      );
    }
  }, [hasShownDialog, isRequestingPermissions, locationPermissionStatus, showAlert, requestLocationPermission]);

  useEffect(() => {
    const initializePermissions = async () => {

      if (!isAdFinished) {
        console.log('[App] 광고가 아직 끝나지 않아 위치 권한 요청을 대기합니다.');
        return;
      }

      const locationStatus = await requestLocationPermission();
      setLocationPermissionStatus(locationStatus);
      setHasCheckedPermissions(true);
    };

    initializePermissions();
  }, [requestLocationPermission, isAdFinished]);

  useEffect(() => {
    if (hasCheckedPermissions && locationPermissionStatus !== null && !isRequestingPermissions) {

      const timer = setTimeout(() => {
        checkAndShowPermissionDialog();
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [hasCheckedPermissions, locationPermissionStatus, isRequestingPermissions, checkAndShowPermissionDialog]);

  return null;
};

const GlobalDialogs = () => {
  const { t } = useTranslation();
  const { addTokenDialogVisible, closeAddTokenDialog, emergencyStop } = useAppContext();
  const [versionUpdateVisible, setVersionUpdateVisible] = useState(false);
  const [latestVersion, setLatestVersion] = useState<string | undefined>(undefined);
  const [isServerUpdateRequired, setIsServerUpdateRequired] = useState(false); 

  const translatedMessage = React.useMemo(() => {
    if (!emergencyStop?.message) {
      return t('common.emergencyStop.title');
    }

    if (emergencyStop.message === 'UPDATE_FOUND\nPLEASE_UPDATE') {
      return `${t('common.versionUpdate.updateFound')}\n${t('common.versionUpdate.pleaseUpdate')}`;
    }

    return emergencyStop.message;
  }, [emergencyStop?.message, t]);

  useEffect(() => {
    const checkVersion = async () => {
      try {

        const needsServerUpdate = await isServerVersionUpdateRequired();
        if (needsServerUpdate) {
          console.log('[App] 서버에서 업데이트 필요 확인');
          const currentVersion = getCurrentAppVersion();
          setLatestVersion(currentVersion);
          setIsServerUpdateRequired(true); 
          setVersionUpdateVisible(true);
          return;
        }

        const currentVersion = getCurrentAppVersion();
        const latest = await checkLatestVersion();

        if (latest && isNewVersionAvailable(currentVersion, latest)) {
          console.log('[App] 새 버전 발견:', latest);
          if (__DEV__) {
            console.log('[App] 개발 모드이므로 버전 확인을 건너뜁니다. app,tsx');
            return;
          } else {
            setLatestVersion(latest);
            setIsServerUpdateRequired(false); 
            setVersionUpdateVisible(true);
          }
        } else {

        }
      } catch (error) {
        console.error('[App] 버전 확인 실패:', error);

      }
    };

    const timer = setTimeout(() => {
      checkVersion();
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleAppStateChange = async (nextAppState: AppStateStatus) => {
      if (nextAppState === 'active') {

        try {
          const currentVersion = getCurrentAppVersion();
          const latest = await checkLatestVersion();

          if (latest && isNewVersionAvailable(currentVersion, latest)) {

            if (!versionUpdateVisible) {
              setLatestVersion(latest);
              setIsServerUpdateRequired(false); 
              setVersionUpdateVisible(true);
            }
          }
        } catch (error) {
          console.error('[App] 포그라운드 복귀 시 버전 확인 실패:', error);
        }
      }
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);

    return () => {
      subscription?.remove();
    };
  }, [versionUpdateVisible]);

  return (
    <>
      <AddTokenDialog visible={addTokenDialogVisible} onClose={closeAddTokenDialog} />
      <EmergencyStopDialog
        visible={emergencyStop?.enabled ?? false}
        message={translatedMessage}
        link={emergencyStop?.link}

      />
      <VersionUpdateDialog
        visible={versionUpdateVisible}
        latestVersion={latestVersion}
        showLaterButton={!isServerUpdateRequired} 
        onClose={() => setVersionUpdateVisible(false)}
      />
      <OTAUpdateDialog />
    </>
  );
};

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isAdFinished, setIsAdFinished] = useState(false); 
  const [fontsLoaded] = useFonts({
    'Roboto-Regular': Roboto_400Regular,
    'Roboto-Medium': Roboto_500Medium,
    'Roboto-SemiBold': Roboto_600SemiBold,
    'Roboto-Bold': Roboto_700Bold,
  });
  const appStateRef = useRef<AppStateStatus>(AppState.currentState);
  const appInitDoneRef = useRef(false);

  useEffect(() => {
    const initializeAppState = async () => {

      await AsyncStorage.setItem('app_last_state', AppState.currentState);
    };

    initializeAppState();
  }, []);

  useEffect(() => {
    const handleAppStateChange = async (nextAppState: AppStateStatus) => {
      const previousState = appStateRef.current;
      console.log('[App] AppState 변경 감지:', {
        previous: previousState,
        next: nextAppState,
        currentTime: new Date().toISOString(),
      });

      if (
        previousState.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {

        console.log('[App] 포그라운드 복귀 감지');
        await AsyncStorage.setItem('app_last_state', nextAppState);

        try {
          const isAdCompleted = await AsyncStorage.getItem('isAdCompleted');
          if (isAdCompleted === 'true') {
            console.log('[App] 광고 보기 완료');

            await AsyncStorage.removeItem('isAdCompleted');
            console.log('[App] isAdCompleted 제거 완료');
          }
        } catch (error) {
          console.error('[App] 광고 완료 상태 확인 실패:', error);
        }
      }

      else if (
        previousState === 'active' &&
        (nextAppState === 'inactive' || nextAppState === 'background')
      ) {

        console.log('[App] 백그라운드/비활성화 전환 감지:', nextAppState);
        try {

          const backgroundTimestamp = Math.floor(Date.now() / 1000);
          const timestampString = backgroundTimestamp.toString();
          await AsyncStorage.setItem('app_last_state', nextAppState);
          await AsyncStorage.setItem('app_last_background_timestamp', timestampString);
          console.log('[App] ✅ 백그라운드 시간 저장 완료:', {
            timestamp: timestampString,
            date: new Date(backgroundTimestamp * 1000).toISOString(),
            isNumeric: /^\d+$/.test(timestampString),
          });

          const savedValue = await AsyncStorage.getItem('app_last_background_timestamp');
          console.log('[App] 저장된 값 확인:', savedValue);
        } catch (error) {
          console.error('[App] ❌ 앱 상태 저장 실패:', error);
        }
      }

      else if (
        previousState === 'inactive' &&
        nextAppState === 'background'
      ) {

        console.log('[App] inactive -> background 전환 (타임스탬프는 이미 저장됨)');
        await AsyncStorage.setItem('app_last_state', nextAppState);
      }
      else {
        console.log('[App] AppState 변경 (처리하지 않음):', {
          previous: previousState,
          next: nextAppState,
        });
      }

      appStateRef.current = nextAppState;
    };

    console.log('[App] AppState 리스너 등록, 현재 상태:', AppState.currentState);

    const subscription = AppState.addEventListener('change', handleAppStateChange);

    return () => {
      console.log('[App] AppState 리스너 제거');
      subscription?.remove();
    };
  }, []);

  useEffect(() => {
    const BOOT_SLOW_LOG = '[!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!부팅 느림]';
    if (appInitDoneRef.current) return;
    appInitDoneRef.current = true;
    const bootStartAt = Date.now();
    console.log(BOOT_SLOW_LOG, '6. 부팅 시작 (initializeApp useEffect 진입)');

    if (__DEV__) {
      try {
        require('./src/utils/devDebugStore').devDebugStore.init();
      } catch (_) {}
    }

    console.log(BOOT_SLOW_LOG, 'initGoogleSignIn 시작');
    initGoogleSignIn();
    console.log(BOOT_SLOW_LOG, 'initGoogleSignIn 호출 완료 (동기)', `${Date.now() - bootStartAt}ms`);

    const initializeApp = async () => {
      const devBoot = __DEV__ ? require('./src/utils/devDebugStore').devDebugStore : null;

      try {
        devBoot?.recordBootStep('start');
        let t = Date.now();
        console.log(BOOT_SLOW_LOG, 'loadEnvSync 시작');
        loadEnvSync();
        console.log(BOOT_SLOW_LOG, 'loadEnvSync 완료', `${Date.now() - t}ms`);
        t = Date.now();
        console.log(BOOT_SLOW_LOG, 'initI18nSync 시작');
        initI18nSync();
        console.log(BOOT_SLOW_LOG, 'initI18nSync 완료', `${Date.now() - t}ms`);
        console.log('[App] 환경 변수·i18n 동기 초기화 완료 (저장 언어는 백그라운드 적용)');
      } catch (error) {
        console.error(BOOT_SLOW_LOG, '초기화 실패:', error);
      }

      console.log(BOOT_SLOW_LOG, '첫 화면 표시 가능 (setIsLoading false)', `${Date.now() - bootStartAt}ms 경과`);
      setIsAdFinished(true);
      setIsLoading(false);
      if (__DEV__) {
        try {
          require('./src/utils/devDebugStore').devDebugStore.recordBootTotal();
        } catch (_) {}
      }

      applyStoredLanguageAsync();

      const runBackground = () => {
        try {
          const env = getEnv();
          const initOptions = {
            devKey: env.APPSFLYER_DEV_KEY,
            appId: env.APPSFLYER_APP_ID_IOS,
            isDebug: true,
            onInstallConversionDataListener: true,
            onDeepLinkListener: true,
            timeToWaitForATTUserAuthorization: 10,
          };
          const maxAttempts = 12;
          const delays = [0, 200, 400, 600, 900, 1200, 1600, 2000, 2500, 3000, 3500, 4000];
          const tryAppsFlyerInit = (attempt: number) => {
            const RNAppsFlyer = NativeModules.RNAppsFlyer;
            if (RNAppsFlyer != null && typeof RNAppsFlyer.initSdkWithCallBack === 'function') {
              appsFlyer.initSdk(initOptions, () => console.log('[App] AppsFlyer 초기화 성공'), (err: any) => console.warn('[App] AppsFlyer 초기화 경고/실패:', err));
              return;
            }
            if (attempt < maxAttempts) setTimeout(() => tryAppsFlyerInit(attempt + 1), delays[Math.min(attempt, delays.length - 1)]);
            else console.warn('[App] AppsFlyer 네이티브 모듈을 찾을 수 없어 초기화를 건너뜁니다.');
          };
          tryAppsFlyerInit(0);
        } catch (error) {
          console.error('[App] AppsFlyer 초기화 실패:', error);
        }
        initializeTaboola().then(() => console.log('[App] Taboola 초기화 완료')).catch((e) => console.error('[App] Taboola 초기화 실패:', e));
        getXRUNGopaxPrice()
          .then((priceResponse) => AsyncStorage.setItem('xrungopaxprice', JSON.stringify(priceResponse)))
          .then(() => console.log('[App] 고팍스 XRUN 가격 조회 및 저장 완료'))
          .catch((e) => console.error('[App] 고팍스 XRUN 가격 조회 실패:', e));
        AsyncStorage.getItem('userData')
          .then((userDataStr) => {
            if (!userDataStr) return;
            try {
              const userData = JSON.parse(userDataStr);
              const member = userData?.member;
              if (member) getUsersBalanceUpdateV2(String(member)).catch((e) => console.error('[App] 사용자 잔액 업데이트 V2 실패:', e));
            } catch (_) {}
          })
          .catch(() => {});
        AsyncStorage.getItem('cached_AD')
          .then((cachedAdStr) => {
            if (!cachedAdStr) return;
            const cachedAd = JSON.parse(cachedAdStr);
            let hasMarketUrl = false;
            const cleanedCache: any = {};
            Object.keys(cachedAd).forEach((campid) => {
              const urlAD = cachedAd[campid]?.urlAD;
              if (urlAD && (urlAD.startsWith('market://') || urlAD.startsWith('intent://'))) hasMarketUrl = true;
              else cleanedCache[campid] = cachedAd[campid];
            });
            if (hasMarketUrl) return AsyncStorage.setItem('cached_AD', JSON.stringify(cleanedCache));
          })
          .catch(() => {});
      };

      if (__DEV__) {
        try {
          require('./src/utils/devDebugStore').devDebugStore.recordBootStep('before_background');
        } catch (_) {}
      }

      console.log(BOOT_SLOW_LOG, 'getTopAd5 호출 시작 (비동기)');
      getTopAd5()
        .then(() => console.log(BOOT_SLOW_LOG, 'getTopAd5 광고 캐시 완료', `${Date.now() - bootStartAt}ms 경과`))
        .catch((e) => console.error(BOOT_SLOW_LOG, 'getTopAd5 광고 캐시 실패:', e));
      console.log(BOOT_SLOW_LOG, 'runBackground 1.5초 후 예약 (Taboola/AppsFlyer/고팍스 등)');
      setTimeout(runBackground, 1500);

      console.log(BOOT_SLOW_LOG, '앱 오프닝 광고 setTimeout(0) 예약');
      setTimeout(() => {
        console.log(BOOT_SLOW_LOG, '앱 오프닝 광고 실행 시작', `${Date.now() - bootStartAt}ms 경과`);
        const devBoot = __DEV__ ? require('./src/utils/devDebugStore').devDebugStore : null;
        devBoot?.recordBootStep('pangle_start');
        const runAppOpenAd = () => {
          if (Platform.OS === 'android') {
            const admob = require('./src/services/admob');
            return admob.initializeAdMob().then(() => admob.loadAndShowAppOpenAd());
          }
          const pangle = require('./src/services/pangle');
          return pangle.initializePangle().then(() => pangle.loadAndShowAppOpenAd());
        };
        runAppOpenAd()
          .then(() => console.log(BOOT_SLOW_LOG, '앱 오프닝 광고 프로세스 종료 (표시 완료 또는 실패)', `${Date.now() - bootStartAt}ms 경과`))
          .catch((error) => console.error(BOOT_SLOW_LOG, '앱 오프닝 광고 실패:', error))
          .finally(() => devBoot?.recordBootStep('pangle_done'));
      }, 0);
    };

    initializeApp();
  }, []);

  if (isLoading) {
    return (
      <SafeAreaProvider>
        <StatusBar style="dark" />
        <AppProvider>
          <NavigationProvider>
            <AlertDialogProvider>
              <OTAUpdateProvider>
                <SplashScreen />
                <GlobalDialogs />
                {__DEV__ && <DevDebugPanel />}
              </OTAUpdateProvider>
            </AlertDialogProvider>
          </NavigationProvider>
        </AppProvider>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <AppProvider>
        <NavigationProvider>
          <AlertDialogProvider>
            <OTAUpdateProvider>
              <PermissionRequester isAdFinished={isAdFinished} />
              <AliveService />
              <ScreenHost />
              <GlobalDialogs />
              {__DEV__ && <DevDebugPanel />}
            </OTAUpdateProvider>
          </AlertDialogProvider>
        </NavigationProvider>
      </AppProvider>
    </SafeAreaProvider>
  );
}