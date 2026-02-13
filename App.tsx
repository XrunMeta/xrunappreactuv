import React, { useState, useEffect, useCallback, useRef } from 'react';
import { AppState, AppStateStatus, NativeModules, Platform } from 'react-native';
import * as Linking from 'expo-linking';
import * as Application from 'expo-application';
import * as Clipboard from 'expo-clipboard';
import {
  MyInfoFaqScreen,
  CountryCodeSelectScreen,
  EmailVerificationScreen,
  LoginScreen,
  LoginSignupScreen,
  SignupScreen,
  SplashScreen,
  TermsScreen,
  PrivacyPolicyScreen,
  VerificationCodeScreen,
  WalletScreen,
  WalletDetailScreen,
  PolygonWalletScreen,
  XrunWalletScreen,
  NftWalletScreen,
  XrunWalletScreen2,
  AdWalletScreen,
  TransactionDetailsScreen,
  MapMainScreen,
  WalletSendScreen,
  WalletQrScanScreen,
  WalletEstimateFeeScreen,
  WalletTransactionProgressScreen,
  WalletTransactionResultScreen,
  WalletReceiveScreen,
  AddWalletAddressScreen,
  MyInfoScreen,
  MyInfoEmailAuthScreen,
  MyInfoEditScreen,
  PhoneEditScreen,
  ChangePasswordScreen,
  MyInfoSettingsScreen,
  MyInfoCloseMembershipScreen,
  MyInfoCloseMembershipSuccessScreen,
  MyInfoClausesScreen,
  ClauseDetailScreen,
  MyInfoNotifyScreen,
  MyInfoReferralScreen,
  ReferralMyGroupScreen,
  ReferralSettlementScreen,
  ReferralRankScreen,
  ReferralDepthOneScreen,
  ReferralDepthTwoScreen,
  ShopScreen,
  ShopTicketScreen,
  ShopMyTicketScreen,
  ShopMyItemsScreen,
  ShopMyTicketDetailScreen,
  ShopProductDetailScreen,
  ShopBuyScreen,
  ShopSuccessScreen,
  ShopTicketDetailScreen,
  ShopItemRegisterScreen,
  ShowNapAdScreen,
  ShowPockAdScreen,
  ShowWebViewScreen,
  XRUNinfoScreen,
  MyinfoShopSalesScreen,
  ReferralInputScreen,
  PangleListScreen,
  TapjoyListScreen,
  WalletPrivateKeyDisplayScreen,
  WalletPrivateKeyGoogleAuthScreen,
} from './src/screens';
import { AyetOffersScreen } from './src/screens/AyetOffersScreen';

import { NavigationProvider, useAppNavigation } from './src/navigation';
import { AppProvider, useAppContext } from './src/context';
import { AlertDialogProvider } from './src/context/AlertDialogContext';
import { AddTokenDialog, AliveService, EmergencyStopDialog, VersionUpdateDialog, OTAUpdateDialog } from './src/components';
import { loadEnv, getEnv } from './src/utils/env';
import { showToast } from './src/utils';
import appsFlyer from 'react-native-appsflyer';
import { initI18n } from './src/locales';
import { initializeTaboola } from './src/services/taboola';
import { initializePangle, loadAndShowAppOpenAd } from './src/services/pangle';
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

let processedDeepLinkUrl: string | null = null;
let isDeepLinkProcessing = false;

const ScreenHost = () => {
  const { currentScreen, navigate } = useAppNavigation();
  const { setSignupFormData } = useAppContext();

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

      return;

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

  if (currentScreen === 'login') {
    return <LoginScreen />;
  }

  if (currentScreen === 'signup') {
    return <SignupScreen />;
  }

  if (currentScreen === 'countryCodeSelect') {
    return <CountryCodeSelectScreen />;
  }

  if (currentScreen === 'emailVerification') {
    return <EmailVerificationScreen />;
  }

  if (currentScreen === 'verificationCode') {
    return <VerificationCodeScreen />;
  }

  if (currentScreen === 'terms') {
    return <TermsScreen />;
  }

  if (currentScreen === 'privacy') {
    return <PrivacyPolicyScreen />;
  }

  if (currentScreen === 'wallet') {
    return <WalletScreen />;
  }

  if (currentScreen === 'polygonHistory') {
    return <PolygonWalletScreen />;
  }

  if (currentScreen === 'xrunHistory') {
    return <XrunWalletScreen />;
  }

  if (currentScreen === 'nftHistory') {
    return <NftWalletScreen />;
  }

  if (currentScreen === 'xrunHistory2') {
    return <XrunWalletScreen2 />;
  }

  if (currentScreen === 'adHistory') {
    return <AdWalletScreen />;
  }

  if (currentScreen === 'walletDetail') {
    return <WalletDetailScreen />;
  }

  if (currentScreen === 'transactionDetails') {
    return <TransactionDetailsScreen />;
  }

  if (currentScreen === 'map') {
    return <MapMainScreen />;
  }

  if (currentScreen === 'walletSend') {
    return <WalletSendScreen />;
  }

  if (currentScreen === 'walletQrScan') {
    return <WalletQrScanScreen />;
  }

  if (currentScreen === 'walletEstimate') {
    return <WalletEstimateFeeScreen />;
  }

  if (currentScreen === 'walletTransactionProgress') {
    return <WalletTransactionProgressScreen />;
  }

  if (currentScreen === 'walletTransactionResult') {
    return <WalletTransactionResultScreen />;
  }

  if (currentScreen === 'walletReceive') {
    return <WalletReceiveScreen />;
  }

  if (currentScreen === 'addWalletAddress') {
    return <AddWalletAddressScreen />;
  }

  if (currentScreen === 'myInfo') {
    return <MyInfoScreen />;
  }

  if (currentScreen === 'myInfoEmailAuth') {
    return <MyInfoEmailAuthScreen />;
  }

  if (currentScreen === 'myInfoFaq') {
    return <MyInfoFaqScreen />;
  }

  if (currentScreen === 'myInfoEdit') {
    return <MyInfoEditScreen />;
  }

  if (currentScreen === 'myInfoPhoneEdit') {
    return <PhoneEditScreen />;
  }

  if (currentScreen === 'myInfoChangePassword') {
    return <ChangePasswordScreen />;
  }

  if (currentScreen === 'myInfoSettings') {
    return <MyInfoSettingsScreen />;
  }

  if (currentScreen === 'pangleList') {
    return <PangleListScreen />;
  }

  if (currentScreen === 'tapjoyList') {
    return <TapjoyListScreen />;
  }

  if (currentScreen === 'ayetOffers') {
    return <AyetOffersScreen />;
  }

  if (currentScreen === 'ayetOffersXplay') {
    return <AyetOffersScreen slotName="Xplay" />;
  }

  if (currentScreen === 'walletPrivateKeyDisplay') {
    return <WalletPrivateKeyDisplayScreen />;
  }

  if (currentScreen === 'walletPrivateKeyGoogleAuth') {
    return <WalletPrivateKeyGoogleAuthScreen />;
  }

  if (currentScreen === 'myInfoCloseMembership') {

    return <MyInfoCloseMembershipScreen />;
  }

  if (currentScreen === 'myInfoCloseMembershipSuccess') {
    return <MyInfoCloseMembershipSuccessScreen />;
  }

  if (currentScreen === 'myInfoClauses') {
    return <MyInfoClausesScreen />;
  }

  if (currentScreen === 'myInfoClauseDetail') {
    return <ClauseDetailScreen />;
  }

  if (currentScreen === 'myInfoNotify') {
    return <MyInfoNotifyScreen />;
  }

  if (currentScreen === 'myInfoReferral') {
    return <MyInfoReferralScreen />;
  }

  if (currentScreen === 'referralMyGroup') {
    return <ReferralMyGroupScreen />;
  }

  if (currentScreen === 'referralSettlement') {
    return <ReferralSettlementScreen />;
  }

  if (currentScreen === 'referralRank') {
    return <ReferralRankScreen />;
  }

  if (currentScreen === 'referralDepthOne') {
    return <ReferralDepthOneScreen />;
  }

  if (currentScreen === 'referralDepthTwo') {
    return <ReferralDepthTwoScreen />;
  }

  if (currentScreen === 'referralInput') {
    return <ReferralInputScreen />;
  }

  if (currentScreen === 'shop') {
    console.log('[App.tsx] currentScreen이 shop이므로 ShopScreen 렌더링');
    return <ShopScreen />;
  }

  if (currentScreen === 'shopTicket') {
    return <ShopTicketScreen />;
  }

  if (currentScreen === 'shopMyTicket') {
    return <ShopMyTicketScreen />;
  }

  if (currentScreen === 'shopMyItems') {
    return <ShopMyItemsScreen />;
  }

  if (currentScreen === 'shopMyTicketDetail') {
    return <ShopMyTicketDetailScreen />;
  }

  if (currentScreen === 'shopProductDetail') {
    return <ShopProductDetailScreen />;
  }

  if (currentScreen === 'shopBuy') {
    return <ShopBuyScreen />;
  }

  if (currentScreen === 'shopSuccess') {
    return <ShopSuccessScreen />;
  }

  if (currentScreen === 'shopTicketDetail') {
    return <ShopTicketDetailScreen />;
  }

  if (currentScreen === 'shopItemRegister') {
    return <ShopItemRegisterScreen />;
  }

  if (currentScreen === 'showNapAd') {
    return <ShowNapAdScreen />;
  }

  if (currentScreen === 'showPockAd') {
    return <ShowPockAdScreen />;
  }

  if (currentScreen === 'showWebView') {
    return <ShowWebViewScreen />;
  }

  if (currentScreen === 'xrunInfo') {
    return <XRUNinfoScreen />;
  }

  if (currentScreen === 'myinfoShopSales') {
    return <MyinfoShopSalesScreen />;
  }

  return <LoginSignupScreen />;
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

    initGoogleSignIn();

    const initializeApp = async () => {
      try {
        await loadEnv();
        console.log('[App] 환경 변수 로드 완료');
      } catch (error) {
        console.error('[App] 환경 변수 로드 실패:', error);
      }

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
            appsFlyer.initSdk(
              initOptions,
              () => {
                console.log('[App] AppsFlyer 초기화 성공');
                if (initOptions.isDebug) {
                  console.log('[App] AppsFlyer 디버그 모드 활성화됨');
                }
              },
              (err: any) => console.warn('[App] AppsFlyer 초기화 경고/실패:', err),
            );
            console.log('[App] AppsFlyer 초기화 완료');
            return;
          }
          if (attempt < maxAttempts) {
            const delay = delays[Math.min(attempt, delays.length - 1)];
            console.log('[App] AppsFlyer 네이티브 모듈 대기 중,', delay, 'ms 후 재시도', attempt + 1, '/', maxAttempts);
            setTimeout(() => tryAppsFlyerInit(attempt + 1), delay);
          } else {
            console.warn('[App] AppsFlyer 네이티브 모듈을 찾을 수 없어 초기화를 건너뜁니다.');
          }
        };
        tryAppsFlyerInit(0);
      } catch (error) {
        console.error('[App] AppsFlyer 초기화 실패:', error);
      }

      try {
        await initI18n();
        console.log('[App] i18n 초기화 완료');
      } catch (error) {
        console.error('[App] i18n 초기화 실패:', error);
      }

      try {
        const cachedAdStr = await AsyncStorage.getItem('cached_AD');
        if (cachedAdStr) {
          const cachedAd = JSON.parse(cachedAdStr);
          let hasMarketUrl = false;
          const cleanedCache: any = {};

          Object.keys(cachedAd).forEach((campid) => {
            const urlAD = cachedAd[campid]?.urlAD;
            if (urlAD && (urlAD.startsWith('market://') || urlAD.startsWith('intent://'))) {
              console.log(`[App] 캐시에서 market:// 또는 intent:// 제거: ${campid}`);
              hasMarketUrl = true;
            } else {
              cleanedCache[campid] = cachedAd[campid];
            }
          });

          if (hasMarketUrl) {
            await AsyncStorage.setItem('cached_AD', JSON.stringify(cleanedCache));
            console.log('[App] 캐시 클리어 완료 (market:// 및 intent:// 제거)');
          }
        }
      } catch (cacheError) {
        console.warn('[App] 캐시 클리어 실패:', cacheError);
      }

      try {
        await loadEnv();
        console.log('[App] 환경 변수 로드 완료');
      } catch (error) {
        console.error('[App] 환경 변수 로드 실패:', error);
      }

      try {
        await initializeTaboola();
        console.log('[App] Taboola 초기화 완료');
      } catch (error) {
        console.error('[App] Taboola 초기화 실패:', error);
      }

      setTimeout(async () => {
        try {
          await initializePangle();
          console.log('[App] Pangle 초기화 완료');

          console.log('[App] 앱 오프닝 광고 표시 시작');
          await loadAndShowAppOpenAd();
          console.log('[App] 앱 오프닝 광고 프로세스 종료 (표시 완료 또는 실패)');
        } catch (error) {
          console.error('[App] Pangle 프로세스 실패:', error);
        } finally {

          setIsAdFinished(true);
        }
      }, 1000);

      try {
        console.log('[App] TopAd5 광고 캐시 시작');
        await getTopAd5();
        console.log('[App] TopAd5 광고 캐시 완료');
      } catch (error) {
        console.error('[App] TopAd5 광고 캐시 실패:', error);

      }

      try {
        console.log('[App] 고팍스 XRUN 가격 조회 시작');
        const priceResponse = await getXRUNGopaxPrice();
        const priceData = JSON.stringify(priceResponse);
        await AsyncStorage.setItem('xrungopaxprice', priceData);
        console.log('[App] 고팍스 XRUN 가격 조회 및 저장 완료:', priceResponse.data?.gopaxPrice);
      } catch (error) {
        console.error('[App] 고팍스 XRUN 가격 조회 및 저장 실패:', error);

      }

      try {
        const userDataStr = await AsyncStorage.getItem('userData');
        if (userDataStr) {
          const userData = JSON.parse(userDataStr);
          const member = userData?.member;
          if (member) {
            console.log('[App] 사용자 잔액 업데이트 V2 호출 시작');
            getUsersBalanceUpdateV2(String(member)).catch((error) => {
              console.error('[App] 사용자 잔액 업데이트 V2 호출 실패:', error);
            });
          }
        }
      } catch (error) {
        console.error('[App] 사용자 잔액 업데이트 V2 호출 실패:', error);

      }

    };

    initializeApp();

    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (!fontsLoaded || isLoading) {
    return (
      <SafeAreaProvider>
        <StatusBar style="dark" />
        <AppProvider>
          <NavigationProvider>
            <AlertDialogProvider>
              <SplashScreen />
              <GlobalDialogs />
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
            <PermissionRequester isAdFinished={isAdFinished} />
            <AliveService />
            <ScreenHost />
            <GlobalDialogs />
          </AlertDialogProvider>
        </NavigationProvider>
      </AppProvider>
    </SafeAreaProvider>
  );
}

