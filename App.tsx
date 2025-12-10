import React, { useState, useEffect, useCallback } from 'react';
import * as Linking from 'expo-linking';
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
  ShopTicketScreen,
  ShopMyTicketScreen,
  ShopBuyScreen,
  ShopSuccessScreen,
  ShopTicketDetailScreen,
  ShowNapAdScreen,
  ShowPockAdScreen,
  XRUNinfoScreen,
  MyinfoShopSalesScreen,
} from './src/screens';
import { NavigationProvider, useAppNavigation } from './src/navigation';
import { AppProvider, useAppContext } from './src/context';
import { AlertDialogProvider } from './src/context/AlertDialogContext';
import { AddTokenDialog, AliveService, EmergencyStopDialog } from './src/components';
import { loadEnv } from './src/utils/env';
import { initI18n } from './src/locales';
import { initializeTaboola } from './src/services/taboola';
import { getTopAd5 } from './src/services';
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
import { useCameraPermissions } from 'expo-camera';
import { useAlertDialog } from './src/context/AlertDialogContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fetchMapMarkerData } from './src/services';

const ScreenHost = () => {
  const { currentScreen, navigate } = useAppNavigation();
  const { setReferralCode } = useAppContext();

  useEffect(() => {
    let isProcessing = false; 

    const handleDeepLink = (url: string) => {

      if (isProcessing) {
        console.log('[딥링크] 이미 처리 중인 딥링크, 건너뛰기:', url);
        return;
      }

      try {
        isProcessing = true;
        console.log('[딥링크] URL 처리 시작:', url);

        const parsed = Linking.parse(url);
        console.log('[딥링크] 파싱된 URL:', parsed);

        const referral = parsed.queryParams?.referral as string | undefined;

        if (referral) {
          console.log('[딥링크] 레퍼럴 코드 추출:', referral);

          setReferralCode(referral);

          if (currentScreen !== 'signup') {
            console.log('[딥링크] 회원가입 화면으로 이동');
            navigate('signup');
          }
        } else {
          console.log('[딥링크] referral 파라미터가 없습니다.');
        }
      } catch (error) {
        console.error('[딥링크] URL 처리 실패:', error);
      } finally {

        setTimeout(() => {
          isProcessing = false;
        }, 1000);
      }
    };

    const getInitialURL = async () => {
      try {
        const initialUrl = await Linking.getInitialURL();
        if (initialUrl) {
          console.log('[딥링크] 앱 시작 시 딥링크 감지:', initialUrl);
          handleDeepLink(initialUrl);
        } else {
          console.log('[딥링크] 앱 시작 시 딥링크 없음');
        }
      } catch (error) {
        console.error('[딥링크] 초기 URL 가져오기 실패:', error);
      }
    };

    const subscription = Linking.addEventListener('url', (event) => {
      console.log('[딥링크] 딥링크 이벤트 감지:', event.url);
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
  }, [setReferralCode, navigate, currentScreen]);

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

  if (currentScreen === 'shopTicket') {
    return <ShopTicketScreen />;
  }

  if (currentScreen === 'shopMyTicket') {
    return <ShopMyTicketScreen />;
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

  if (currentScreen === 'showNapAd') {
    return <ShowNapAdScreen />;
  }

  if (currentScreen === 'showPockAd') {
    return <ShowPockAdScreen />;
  }

  if (currentScreen === 'xrunInfo') {
    return <XRUNinfoScreen />;
  }

  if (currentScreen === 'myinfoShopSales') {
    return <MyinfoShopSalesScreen />;
  }

  return <LoginSignupScreen />;
};

const PermissionRequester = () => {
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
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

  const requestCameraPermissionAsync = useCallback(async () => {
    try {
      if (cameraPermission === null) {
        console.log('[App] 카메라 권한 상태 확인 중...');
        return 'undetermined' as const;
      }

      if (cameraPermission.granted) {
        console.log('[App] 카메라 권한이 이미 허용되어 있습니다.');
        return 'granted' as const;
      }

      console.log('[App] 카메라 권한 명시적 요청 시작');
      const result = await requestCameraPermission();
      if (result.granted) {
        console.log('[App] 카메라 권한 허용됨');
        return 'granted' as const;
      } else {
        console.log('[App] 카메라 권한 거부됨');
        return 'denied' as const;
      }
    } catch (error) {
      console.error('[App] 카메라 권한 요청 실패:', error);
      return 'denied' as const;
    }
  }, [cameraPermission, requestCameraPermission]);

  const checkAndShowPermissionDialog = useCallback(async () => {

    if (hasShownDialog || isRequestingPermissions) {
      return;
    }

    const currentLocationStatus = locationPermissionStatus || await Location.getForegroundPermissionsAsync().then(r => r.status);
    const cameraStatus = cameraPermission?.granted ? 'granted' : (cameraPermission?.canAskAgain === false ? 'denied' : 'undetermined');

    const locationDenied = currentLocationStatus !== 'granted';
    const cameraDenied = cameraStatus !== 'granted';

    if (locationDenied && cameraDenied) {
      setHasShownDialog(true);
      await showAlert(
        '권한 필요',
        '앱의 주요 기능을 사용하려면 위치 정보와 카메라 권한이 모두 필요합니다. 설정에서 권한을 허용해주세요.',
        [
          {
            text: '다시 요청',
            onPress: async () => {
              setIsRequestingPermissions(true);
              setHasShownDialog(false); 

              console.log('[App] 다시 요청: 위치 및 카메라 권한 요청');
              const locationStatus = await requestLocationPermission();

              await requestCameraPermissionAsync();

              await new Promise(resolve => setTimeout(resolve, 1500));

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
    } else if (locationDenied) {

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
    } else if (cameraDenied) {

      setHasShownDialog(true);
      await showAlert(
        '카메라 권한 필요',
        '앱의 주요 기능을 사용하려면 카메라 권한이 필요합니다. 설정에서 권한을 허용해주세요.',
        [
          {
            text: '다시 요청',
            onPress: async () => {
              setIsRequestingPermissions(true);
              setHasShownDialog(false); 

              console.log('[App] 다시 요청: 카메라 권한 요청');
              await requestCameraPermissionAsync();

              await new Promise(resolve => setTimeout(resolve, 1000));

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
  }, [hasShownDialog, isRequestingPermissions, locationPermissionStatus, cameraPermission, showAlert, requestLocationPermission, requestCameraPermissionAsync]);

  useEffect(() => {
    const initializePermissions = async () => {

      const locationStatus = await requestLocationPermission();
      setLocationPermissionStatus(locationStatus);
    };

    initializePermissions();
  }, [requestLocationPermission]);

  useEffect(() => {
    if (cameraPermission !== null && !hasCheckedPermissions) {
      setHasCheckedPermissions(true);
    }
  }, [cameraPermission, hasCheckedPermissions]);

  useEffect(() => {
    if (hasCheckedPermissions && cameraPermission !== null && locationPermissionStatus !== null && !isRequestingPermissions) {

      const timer = setTimeout(() => {
        checkAndShowPermissionDialog();
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [hasCheckedPermissions, cameraPermission, locationPermissionStatus, isRequestingPermissions, checkAndShowPermissionDialog]);

  return null;
};

const GlobalDialogs = () => {
  const { addTokenDialogVisible, closeAddTokenDialog, emergencyStop } = useAppContext();

  return (
    <>
      <AddTokenDialog visible={addTokenDialogVisible} onClose={closeAddTokenDialog} />
      <EmergencyStopDialog
        visible={emergencyStop?.enabled ?? false}
        message={emergencyStop?.message ?? '긴급 안내가 있습니다.'}
        link={emergencyStop?.link}

      />
    </>
  );
};

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [fontsLoaded] = useFonts({
    'Roboto-Regular': Roboto_400Regular,
    'Roboto-Medium': Roboto_500Medium,
    'Roboto-SemiBold': Roboto_600SemiBold,
    'Roboto-Bold': Roboto_700Bold,
  });

  useEffect(() => {

    const initializeApp = async () => {
      try {
        await loadEnv();
        console.log('[App] 환경 변수 로드 완료');
      } catch (error) {
        console.error('[App] 환경 변수 로드 실패:', error);
      }

      try {
        await initI18n();
        console.log('[App] i18n 초기화 완료');
      } catch (error) {
        console.error('[App] i18n 초기화 실패:', error);
      }

      try {
        await initializeTaboola();
        console.log('[App] Taboola 초기화 완료');
      } catch (error) {
        console.error('[App] Taboola 초기화 실패:', error);
      }

      try {
        console.log('[App] TopAd5 광고 캐시 시작');
        await getTopAd5();
        console.log('[App] TopAd5 광고 캐시 완료');
      } catch (error) {
        console.error('[App] TopAd5 광고 캐시 실패:', error);

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
            <PermissionRequester />
            <AliveService />
            <ScreenHost />
            <GlobalDialogs />
          </AlertDialogProvider>
        </NavigationProvider>
      </AppProvider>
    </SafeAreaProvider>
  );
}
