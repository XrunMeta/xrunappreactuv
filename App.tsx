import React, { useState, useEffect } from 'react';
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
  MyInfoScreen,
  MyInfoEmailAuthScreen,
  MyInfoEditScreen,
  PhoneEditScreen,
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
  XRUNinfoScreen,
} from './src/screens';
import { NavigationProvider, useAppNavigation } from './src/navigation';
import { AppProvider, useAppContext } from './src/context';
import { AlertDialogProvider } from './src/context/AlertDialogContext';
import { AddTokenDialog, AliveService, EmergencyStopDialog } from './src/components';
import { loadEnv } from './src/utils/env';
import { initI18n } from './src/locales';
import { initializeTaboola } from './src/services/taboola';
import {
  useFonts,
  Roboto_400Regular,
  Roboto_500Medium,
  Roboto_600SemiBold,
  Roboto_700Bold,
} from '@expo-google-fonts/roboto';
import { SafeAreaProvider } from 'react-native-safe-area-context';

const ScreenHost = () => {
  const { currentScreen } = useAppNavigation();

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

  if (currentScreen === 'xrunInfo') {
    return <XRUNinfoScreen />;
  }

  return <LoginSignupScreen />;
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
      <AppProvider>
        <NavigationProvider>
          <AlertDialogProvider>
            <AliveService />
            <ScreenHost />
            <GlobalDialogs />
          </AlertDialogProvider>
        </NavigationProvider>
      </AppProvider>
    </SafeAreaProvider>
  );
}
