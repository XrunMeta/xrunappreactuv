import v_a3453e, { v_5ab095, v_c4deb2 } from 'bapkr';
import {
  v_083aa7,
  v_379bd1,
  v_a82b55,
  v_f4f851,
  v_54d331,
  v_f40fc5,
  v_7c6176,
  v_d3f135,
  v_086cde,
  v_667a00,
  v_952e24,
  v_94455f,
  v_ab7114,
  v_7c7410,
  v_7e9335,
  v_5ea6a6,
  v_59ff6e,
  v_20d2c7,
  v_5b640b,
  v_2ba37d,
  v_a91257,
  v_31216c,
  v_1cd2a2,
  v_a023f9,
  v_03a231,
  v_dec378,
  v_cdb169,
  v_e14579,
  v_4a40b2,
  v_9e06f6,
  v_865e57,
  v_41dfd5,
  v_5fdcb2,
  v_386af2,
  v_6086b6,
  v_58584a,
  v_08aac3,
  v_f57686,
  v_5b4c5a,
  v_8c15c4,
  v_38326c,
  v_052a8a,
  v_1a0a02,
  v_8734da,
  v_a1c4a5,
  v_287831,
  v_f7bdb9,
} from './src/screens';
import { v_00e8f9, v_a0daa8 } from './src/navigation';
import { v_4b64f4, v_700ef9 } from './src/context';
import { v_aabda8, v_b631a8, v_2806ef } from './src/components';
import { v_a2474a } from './src/utils/env';
import { v_757c02 } from './src/locales';
import {
  v_c06f2c,
  v_259807,
  v_b1350e,
  v_f2f1ae,
  v_567640,
} from 'duafkibkrsnlsywaptcqakgas';

const v_c0dbdf = () => {
  const { currentScreen: v_0f0c7b } = v_a0daa8();

  if (v_0f0c7b === 'login') {
    return <LoginScreen />;
  }

  if (v_0f0c7b === 'signup') {
    return <SignupScreen />;
  }

  if (v_0f0c7b === 'countryCodeSelect') {
    return <CountryCodeSelectScreen />;
  }

  if (v_0f0c7b === 'emailVerification') {
    return <EmailVerificationScreen />;
  }

  if (v_0f0c7b === 'verificationCode') {
    return <VerificationCodeScreen />;
  }

  if (v_0f0c7b === 'terms') {
    return <TermsScreen />;
  }

  if (v_0f0c7b === 'privacy') {
    return <PrivacyPolicyScreen />;
  }

  if (v_0f0c7b === 'wallet') {
    return <WalletScreen />;
  }

  if (v_0f0c7b === 'polygonHistory') {
    return <PolygonWalletScreen />;
  }

  if (v_0f0c7b === 'xrunHistory') {
    return <XrunWalletScreen />;
  }

  if (v_0f0c7b === 'nftHistory') {
    return <NftWalletScreen />;
  }

  if (v_0f0c7b === 'xrunHistory2') {
    return <XrunWalletScreen2 />;
  }

  if (v_0f0c7b === 'adHistory') {
    return <AdWalletScreen />;
  }

  if (v_0f0c7b === 'transactionDetails') {
    return <TransactionDetailsScreen />;
  }

  if (v_0f0c7b === 'map') {
    return <MapMainScreen />;
  }

  if (v_0f0c7b === 'walletSend') {
    return <WalletSendScreen />;
  }

  if (v_0f0c7b === 'walletQrScan') {
    return <WalletQrScanScreen />;
  }

  if (v_0f0c7b === 'walletEstimate') {
    return <WalletEstimateFeeScreen />;
  }

  if (v_0f0c7b === 'walletTransactionProgress') {
    return <WalletTransactionProgressScreen />;
  }

  if (v_0f0c7b === 'walletTransactionResult') {
    return <WalletTransactionResultScreen />;
  }

  if (v_0f0c7b === 'walletReceive') {
    return <WalletReceiveScreen />;
  }

  if (v_0f0c7b === 'myInfo') {
    return <MyInfoScreen />;
  }

  if (v_0f0c7b === 'myInfoEmailAuth') {
    return <MyInfoEmailAuthScreen />;
  }

  if (v_0f0c7b === 'myInfoFaq') {
    return <MyInfoFaqScreen />;
  }

  if (v_0f0c7b === 'myInfoEdit') {
    return <MyInfoEditScreen />;
  }

  if (v_0f0c7b === 'myInfoPhoneEdit') {
    return <PhoneEditScreen />;
  }

  if (v_0f0c7b === 'myInfoSettings') {
    return <MyInfoSettingsScreen />;
  }

  if (v_0f0c7b === 'myInfoCloseMembership') {
    return <MyInfoCloseMembershipScreen />;
  }

  if (v_0f0c7b === 'myInfoCloseMembershipSuccess') {
    return <MyInfoCloseMembershipSuccessScreen />;
  }

  if (v_0f0c7b === 'myInfoClauses') {
    return <MyInfoClausesScreen />;
  }

  if (v_0f0c7b === 'myInfoClauseDetail') {
    return <ClauseDetailScreen />;
  }

  if (v_0f0c7b === 'myInfoNotify') {
    return <MyInfoNotifyScreen />;
  }

  if (v_0f0c7b === 'myInfoReferral') {
    return <MyInfoReferralScreen />;
  }

  if (v_0f0c7b === 'referralMyGroup') {
    return <ReferralMyGroupScreen />;
  }

  if (v_0f0c7b === 'referralSettlement') {
    return <ReferralSettlementScreen />;
  }

  if (v_0f0c7b === 'referralRank') {
    return <ReferralRankScreen />;
  }

  if (v_0f0c7b === 'referralDepthOne') {
    return <ReferralDepthOneScreen />;
  }

  if (v_0f0c7b === 'referralDepthTwo') {
    return <ReferralDepthTwoScreen />;
  }

  if (v_0f0c7b === 'shopTicket') {
    return <ShopTicketScreen />;
  }

  if (v_0f0c7b === 'shopMyTicket') {
    return <ShopMyTicketScreen />;
  }

  if (v_0f0c7b === 'shopBuy') {
    return <ShopBuyScreen />;
  }

  if (v_0f0c7b === 'shopSuccess') {
    return <ShopSuccessScreen />;
  }

  if (v_0f0c7b === 'shopTicketDetail') {
    return <ShopTicketDetailScreen />;
  }

  if (v_0f0c7b === 'showNapAd') {
    return <ShowNapAdScreen />;
  }

  if (v_0f0c7b === 'xrunInfo') {
    return <XRUNinfoScreen />;
  }

  return <LoginSignupScreen />;
};

const v_d0a391 = () => {
  const { addTokenDialogVisible: v_750b67, closeAddTokenDialog: v_b3106e, emergencyStop: v_b135ca } = v_700ef9();

  return (
    <>
      <AddTokenDialog visible={v_750b67} onClose={v_b3106e} />
      <EmergencyStopDialog
        visible={v_b135ca?.enabled ?? false}
        message={v_b135ca?.message ?? '긴급 안내가 있습니다.'}
        link={v_b135ca?.link}

      />
    </>
  );
};

export default function v_6540c3() {
  const [v_cd31a8, v_deef62] = v_5ab095(true);
  const [v_43f571] = v_c06f2c({
    'Roboto-Regular': v_259807,
    'Roboto-Medium': v_b1350e,
    'Roboto-SemiBold': v_f2f1ae,
    'Roboto-Bold': v_567640,
  });

  v_c4deb2(() => {

    const v_139fe0 = async () => {
      try {
        await v_a2474a();
        console.log('[App] 환경 변수 로드 완료');
      } catch (v_5e9bfe) {
        console.error('[App] 환경 변수 로드 실패:', v_5e9bfe);
      }

      try {
        await v_757c02();
        console.log('[App] i18n 초기화 완료');
      } catch (v_5e9bfe) {
        console.error('[App] i18n 초기화 실패:', v_5e9bfe);
      }
    };

    v_139fe0();

    const v_cb36b1 = setTimeout(() => {
      v_deef62(false);
    }, 2000);

    return () => clearTimeout(v_cb36b1);
  }, []);

  if (!v_43f571 || v_cd31a8) {
    return (
      <AppProvider>
        <NavigationProvider>
          <SplashScreen />
          <GlobalDialogs />
        </NavigationProvider>
      </AppProvider>
    );
  }

  return (
    <AppProvider>
      <NavigationProvider>
        <AliveService />
        <ScreenHost />
        <GlobalDialogs />
      </NavigationProvider>
    </AppProvider>
  );
}
