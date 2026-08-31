import React, { useState, useEffect, useCallback, useRef } from 'react';
import { AppState, AppStateStatus, InteractionManager, NativeModules, Platform } from 'react-native';
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
  ForgotPasswordScreen,
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
  MyInfoPaymentPinScreen,
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
  ShowNapMxRewardScreen,
  ShowPockAdScreen,
  ShowWebViewScreen,
  XRUNinfoScreen,
  XplayInfoScreen,
  XplayZoneScreen,
  MyinfoShopSalesScreen,
  ReferralInputScreen,
  PangleListScreen,
  TapjoyListScreen,
  WalletPrivateKeyDisplayScreen,
  WalletPrivateKeyGoogleAuthScreen,
  WalletRestoreScreen,
  MyChipsOfferwallScreen,
  WalletKeyTutorialScreen,
  DeviceUnblockRequestScreen,
} from './src/screens';
import { AyetOffersScreen } from './src/screens/AyetOffersScreen';
import { AdisonOfferwallScreen } from './src/screens/AdisonOfferwallScreen';
import { AdisonTestScreen } from './src/screens/AdisonTestScreen';
import AfterlifeGiftsScreen from './src/screens/AfterlifeGiftsScreen';

import { NavigationProvider, useAppNavigation, ROUTES } from './src/navigation';
import { logScreen, setAnalyticsUserId } from './src/services/analytics';
import { AppProvider, OTAUpdateProvider, useAppContext } from './src/context';
import { AlertDialogProvider } from './src/context/AlertDialogContext';
import { AddTokenDialog, AliveService, NotificationToastService, EmergencyStopDialog, VersionUpdateDialog, OTAUpdateDialog, DevDebugPanel } from './src/components';
import { loadEnvSync, getEnv } from './src/utils/env';
import { showToast } from './src/utils';
import appsFlyer from 'react-native-appsflyer';
import { initI18nSync, applyStoredLanguageAsync } from './src/locales';
import { initializeTaboola } from './src/services/taboola';
import { setAyetUserId } from './src/services/ayet';
import { checkEmailExists } from './src/services';
import { initializePangle, loadAndShowAppOpenAd } from './src/services/pangle';
import { getTopAd5, getXRUNGopaxPrice, getUsersBalanceUpdateV2 } from './src/services';
import { initGoogleSignIn } from './src/services/googleAuth';
import { initTracker } from './src/services/clickTracker';

let TrackingTransparency: any = null;
try {
  TrackingTransparency = require('expo-tracking-transparency');
} catch (e) {
  console.warn('[App] expo-tracking-transparency 모듈 없음 (구 빌드) — ATT 스킵');
}
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
import { fetchMapMarkerData, registerPushToken } from './src/services';
import { checkLatestVersion, getCurrentAppVersion, invalidateServerVersionCache, isNewVersionAvailable, isServerVersionUpdateRequired } from './src/services/versionCheck';
import { useTranslation } from 'react-i18next';
import * as Notifications from 'expo-notifications';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

let processedDeepLinkUrl: string | null = null;
let isDeepLinkProcessing = false;

const ScreenHost = () => {
  const { currentScreen, navigate } = useAppNavigation();
  const { setSignupFormData } = useAppContext();

  useEffect(() => {
    if (__DEV__) return;
    let cancelled = false;
    (async () => {
      try {

        await new Promise((r) => setTimeout(r, 1500));
        if (cancelled) return;
        const Updates = require('expo-updates');
        const check = await Updates.checkForUpdateAsync();
        if (cancelled || !check?.isAvailable) return;
        console.log('[OTA] 새 업데이트 감지 → fetch');
        await Updates.fetchUpdateAsync();
        if (cancelled) return;
        console.log('[OTA] fetch 완료 → reload');
        await Updates.reloadAsync();
      } catch (err: any) {

        console.warn('[OTA] runtime check/apply 실패:', err?.message ?? err);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const userDataStr = await AsyncStorage.getItem('userData');
        if (cancelled || !userDataStr) return;
        const userData = JSON.parse(userDataStr);
        if (userData?.member != null) {
          setAyetUserId(String(userData.member));

          registerPushToken(userData.member).catch(() => {});

          setAnalyticsUserId(userData.member);
        }
      } catch (_) {}
    })();
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    const handleTap = (response: Notifications.NotificationResponse) => {
      try {
        const data = (response?.notification?.request?.content?.data ?? {}) as Record<string, unknown>;
        const type = String(data.type ?? '');

        import('./src/services/analytics').then(({ logEvent, XRUN_EVENTS }) => {
          logEvent(XRUN_EVENTS.NOTIFICATION_OPENED, { type: type || 'unknown' });
        }).catch(() => {});

        const category = String(data.category ?? '');
        if (type === 'inquiry_reply' || category === 'inquiry_reply') {
          navigate(ROUTES.myInfoNotify);
          return;
        }

        AsyncStorage.setItem('pendingPushWalletNav', 'xrun_pol').catch(() => {});
        navigate(ROUTES.wallet);
      } catch (e) {
        console.warn('[push tap] navigate fail:', e);
      }
    };

    const sub = Notifications.addNotificationResponseReceivedListener(handleTap);

    Notifications.getLastNotificationResponseAsync()
      .then((resp) => { if (resp) handleTap(resp); })
      .catch(() => {});

    const recvSub = Notifications.addNotificationReceivedListener((notif) => {
      try {
        const data = (notif?.request?.content?.data ?? {}) as Record<string, unknown>;
        const category = String(data.category ?? '');

        if (['deposit', 'withdrawal', 'ar_nas', 'ar_pointclick', 'xplay_ayet', 'xplay_maf', 'referral_reward'].includes(category)) {

          import('./src/utils/walletEvents').then(({ emitWalletRefresh }) => {
            emitWalletRefresh(`push:${category}`);
          }).catch(() => {});
        }
      } catch (e) {
        console.warn('[push received] handler error:', e);
      }
    });

    return () => { sub.remove(); recvSub.remove(); };
  }, [navigate]);

  useEffect(() => {

    const handleDeepLink = async (url: string) => {

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

        const referral = (parsed.queryParams?.referral || parsed.queryParams?.ref) as string | undefined;

        const prefillEmail = parsed.queryParams?.email as string | undefined;
        const fromApp = parsed.queryParams?.from as string | undefined;

        if (prefillEmail && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(prefillEmail)) {
          console.log('[딥링크] 외부 앱 email 자동 입력:', prefillEmail, 'from:', fromApp);
          AsyncStorage.setItem('pendingPrefillEmail', prefillEmail).catch((storageErr) => {
            console.warn('[딥링크] prefill email 저장 실패:', storageErr);
          });
        }

        const wantSignup = parsed.queryParams?.signup === '1';

        if (referral) {
          console.log('[딥링크] 레퍼럴 코드 추출:', referral);
          processedDeepLinkUrl = url;

          const isEmailFormat = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(referral);
          if (isEmailFormat) {
            try {
              const exists = await checkEmailExists(referral.trim(), navigate);
              if (exists) {
                console.log('[딥링크] 기존 회원 이메일 감지 → 로그인 화면(이메일 자동입력)');
                await AsyncStorage.setItem('pendingPrefillEmail', referral.trim());
                navigate('login');
                return;
              }
            } catch (checkErr) {
              console.warn('[딥링크] checkEmailExists 실패, 회원가입으로 진행:', checkErr);
            }
          }

          setSignupFormData({ referralEmail: referral });
          if (isEmailFormat) {

            AsyncStorage.setItem('pendingSignupEmail', referral.trim()).catch(() => {});
          }
          console.log('[딥링크] 신규 회원 → 회원가입 화면으로 이동');
          navigate('signup');
        } else if (prefillEmail && wantSignup) {
          processedDeepLinkUrl = url;
          console.log('[딥링크] 회원가입 화면으로 이동 (email 자동 입력):', prefillEmail);
          AsyncStorage.setItem('pendingSignupEmail', prefillEmail).catch((storageErr) => {
            console.warn('[딥링크] pendingSignupEmail 저장 실패:', storageErr);
          });
          navigate('signup');
        } else if (prefillEmail) {

          processedDeepLinkUrl = url;
          console.log('[딥링크] 로그인 화면으로 이동 (email 자동 입력)');
          navigate('login');
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

          const processedReferrer = await AsyncStorage.getItem('processed_install_referrer');
          const alreadyProcessed = processedReferrer === installReferrer;

          if (utmSource === 'referral' && utmContent && !alreadyProcessed) {
            const referralEmail = decodeURIComponent(utmContent);
            console.log('[Install Referrer] 추천인 이메일:', referralEmail);
            await AsyncStorage.setItem('processed_install_referrer', installReferrer);
            setSignupFormData({ referralEmail });
            console.log('[Install Referrer] 회원가입 화면으로 이동');
            navigate('signup');
          } else if (utmSource === 'afterlife_signup' && utmContent && !alreadyProcessed) {

            const signupEmail = decodeURIComponent(utmContent);
            if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(signupEmail)) {
              console.log('[Install Referrer] afterlife 회원가입 이메일:', signupEmail);
              await AsyncStorage.setItem('processed_install_referrer', installReferrer);
              await AsyncStorage.setItem('pendingSignupEmail', signupEmail);
              console.log('[Install Referrer] 회원가입 화면으로 이동 (afterlife)');
              navigate('signup');
            }
          } else if (alreadyProcessed) {
            console.log('[Install Referrer] 이미 처리된 referrer, 건너뛰기');
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

  useEffect(() => {
    if (currentScreen) logScreen(currentScreen);
  }, [currentScreen]);

  if (currentScreen === 'login') {
    return <LoginScreen />;
  }

  if (currentScreen === 'signup') {
    return <SignupScreen />;
  }

  if (currentScreen === 'forgotPassword') {
    return <ForgotPasswordScreen />;
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

  if (currentScreen === 'deviceUnblockRequest') {
    return <DeviceUnblockRequestScreen />;
  }

  if (currentScreen === 'afterlifeGifts') {
    return <AfterlifeGiftsScreen />;
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

  if (currentScreen === 'walletKeyTutorial') {
    return <WalletKeyTutorialScreen mode="signup" />;
  }
  if (currentScreen === 'walletKeyGuide') {
    return <WalletKeyTutorialScreen mode="readonly" />;
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

  if (currentScreen === 'myInfoPaymentPin') {
    return <MyInfoPaymentPinScreen />;
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

  if (currentScreen === 'walletRestore') {
    return <WalletRestoreScreen />;
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

  if (currentScreen === 'showNapMxReward') {
    return <ShowNapMxRewardScreen />;
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

  if (currentScreen === 'xplayInfo') {
    return <XplayInfoScreen />;
  }

  if (currentScreen === 'xplayZone') {
    return <XplayZoneScreen />;
  }

  if (currentScreen === 'myChipsOfferwall') {
    return <MyChipsOfferwallScreen />;
  }

  if (currentScreen === 'adisonOfferwall') {
    return <AdisonOfferwallScreen />;
  }

  if (currentScreen === 'adisonTest') {
    return <AdisonTestScreen />;
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

  const versionCheckAppStateRef = useRef<AppStateStatus>(AppState.currentState);
  useEffect(() => {
    const handleAppStateChange = async (nextAppState: AppStateStatus) => {
      const prevState = versionCheckAppStateRef.current;
      versionCheckAppStateRef.current = nextAppState;

      const isReturningFromBackground = (prevState === 'background' || prevState === 'inactive') && nextAppState === 'active';
      if (!isReturningFromBackground) return;

      try {
        invalidateServerVersionCache();
        const needsServerUpdate = await isServerVersionUpdateRequired();
        const currentVersion = getCurrentAppVersion();
        const latest = await checkLatestVersion();
        const hasNewStoreVersion = latest ? isNewVersionAvailable(currentVersion, latest) : false;

        if (needsServerUpdate || hasNewStoreVersion) {
          if (!versionUpdateVisible) {
            setLatestVersion(latest ?? currentVersion);
            setIsServerUpdateRequired(needsServerUpdate);
            setVersionUpdateVisible(true);
          }
        } else {

          setVersionUpdateVisible(false);
        }
      } catch (error) {
        console.error('[App] 포그라운드 복귀 시 버전 확인 실패:', error);
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
    void initTracker({ enabled: true });
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
    if (appInitDoneRef.current) return;
    appInitDoneRef.current = true;

    if (__DEV__) {
      try {
        require('./src/utils/devDebugStore').devDebugStore.init();
      } catch (_) {}
    }

    initGoogleSignIn();

    const initializeApp = async () => {
      const devBoot = __DEV__ ? require('./src/utils/devDebugStore').devDebugStore : null;

      try {
        devBoot?.recordBootStep('start');
        loadEnvSync();
        initI18nSync();
        console.log('[App] 환경 변수·i18n 동기 초기화 완료 (저장 언어는 백그라운드 적용)');
      } catch (error) {
        console.error('[App] 초기화 실패:', error);
      }

      setIsAdFinished(true);
      setIsLoading(false);
      if (__DEV__) {
        try {
          require('./src/utils/devDebugStore').devDebugStore.recordBootTotal();
        } catch (_) {}
      }

      applyStoredLanguageAsync();

      const runBackground = async () => {

        if (Platform.OS === 'ios' && TrackingTransparency) {
          try {
            const current = await TrackingTransparency.getTrackingPermissionsAsync();
            console.log('[ATT] 현재 상태:', current.status);
            if (current.status === 'undetermined') {
              const res = await TrackingTransparency.requestTrackingPermissionsAsync();
              console.log('[ATT] 요청 결과:', res.status);
            }
          } catch (e: any) {
            console.warn('[ATT] 요청 실패:', e);
          }
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

      getTopAd5().then(() => console.log('[App] TopAd5 광고 캐시 완료')).catch((e) => console.error('[App] TopAd5 광고 캐시 실패:', e));
      setTimeout(runBackground, 1500);

      setTimeout(() => {
        const devBoot = __DEV__ ? require('./src/utils/devDebugStore').devDebugStore : null;
        devBoot?.recordBootStep('pangle_start');
        initializePangle()
          .then(() => loadAndShowAppOpenAd())
          .then(() => console.log('[App] 앱 오프닝 광고 프로세스 종료 (표시 완료 또는 실패)'))
          .catch((error) => console.warn('[App] Pangle 프로세스 실패:', error))
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
              <NotificationToastService />
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