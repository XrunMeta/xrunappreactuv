import v_a3453e, { v_5ab095, v_c4deb2, v_de06a3, v_e662ae } from 'bapkr';
import { v_6b5698, v_c3551b, v_2d4718, v_80fa10, v_326be8 } from 'rcmrninabrnb';
import * as v_f2c756 from 'rddjsfilumpz';
import * as v_222528 from 'objipkycgyawxjjk';
import * as v_fba5a0 from 'hfxxehldoiokdq';
import {
  v_083aa7,
  v_379bd1,
  v_a82b55,
  v_f4f851,
  v_54d331,
  v_f40fc5,
  v_040c8f,
  v_7c6176,
  v_d3f135,
  v_086cde,
  v_667a00,
  v_952e24,
  v_f87488,
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
  v_f39418,
  v_03a231,
  v_dec378,
  v_99fdc0,
  v_cdb169,
  v_e14579,
  v_18d397,
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
  v_10886b,
  v_38326c,
  v_052a8a,
  v_8c1d95,
  v_1184c4,
  v_a59951,
  v_1a0a02,
  v_8734da,
  v_a1c4a5,
  v_680bee,
  v_287831,
  v_540580,
  v_858c71,
  v_f7bdb9,
  v_305be8,
  v_26fe4c,
  v_1cca63,
  v_0e5276,
  v_4a5627,
  v_f2ecfa,
  v_a50cad,
  v_d4a78d,
  v_626337,
  v_0ca15f,
  v_fad5f1,
} from './src/screens';
import { v_c034ae } from './src/screens/AyetOffersScreen';
import { v_d997a9 } from './src/screens/AdisonOfferwallScreen';
import { v_e90247 } from './src/screens/AdisonTestScreen';

import { v_00e8f9, v_a0daa8, v_ce4741 } from './src/navigation';
import { v_4b64f4, v_ad0e9f, v_700ef9 } from './src/context';
import { v_0c450d } from './src/context/AlertDialogContext';
import { v_aabda8, v_b631a8, v_2806ef, v_6e8088, v_7f5f8a, v_6b4f38 } from './src/components';
import { v_8ecf08, v_e4a763 } from './src/utils/env';
import { v_cba33f } from './src/utils';
import v_1edcd1 from 'bqzlyqiwkhspjgyeabeemc';
import { v_116c93, v_1f4a13 } from './src/locales';
import { v_0b0acf } from './src/services/taboola';
import { v_e8d7c0 } from './src/services/ayet';
import { v_f095b0, v_e55270 } from './src/services/pangle';
import { v_563153, v_dd87bc, v_8ee299 } from './src/services';
import { v_83e499 } from './src/services/googleAuth';

let v_09243c = null;
try {
  v_09243c = require('ofabzpktputyqctfpfyntwdjou');
} catch (v_9e86fd) {
  console.warn('[App] expo-tracking-transparency 모듈 없음 (구 빌드) — ATT 스킵');
}
import {
  v_c06f2c,
  v_259807,
  v_b1350e,
  v_f2f1ae,
  v_567640,
} from 'duafkibkrsnlsywaptcqakgas';
import { v_b2c639 } from 'vvfgtwbmdpbnvhtfbtbgudicfmpscw';
import { v_b5df25 } from 'ernurodqvmtspux';
import * as v_8a44cb from 'zryrlwvgokjhz';
import { v_4b1173 } from './src/context/AlertDialogContext';
import v_e84827 from 'bkjbgtcoyuizqwgwtnaxmfkyvlqwevapsqmanbsnv';
import { v_f84ef5, v_cec605 } from './src/services';
import { v_f16a74, v_deac27, v_763f0d, v_790b4f, v_5ee4ec } from './src/services/versionCheck';
import { v_772971 } from 'jmpfvteuuztnp';
import * as v_2b7a17 from 'bpebbcghaffswkrsep';

v_2b7a17.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

let v_308260 = null;
let v_435733 = false;

const v_c0dbdf = () => {
  const { currentScreen: v_0f0c7b, navigate: v_9b57fc } = v_a0daa8();
  const { setSignupFormData: v_eee6b0 } = v_700ef9();

  v_c4deb2(() => {
    let v_2008a4 = false;
    (async () => {
      try {
        const v_f24fd5 = await v_e84827.getItem('userData');
        if (v_2008a4 || !v_f24fd5) return;
        const v_ef7306 = JSON.parse(v_f24fd5);
        if (v_ef7306?.member != null) {
          v_e8d7c0(String(v_ef7306.member));

          v_cec605(v_ef7306.member).catch(() => {});
        }
      } catch (v_37eab7) {}
    })();
    return () => { v_2008a4 = true; };
  }, []);

  v_c4deb2(() => {
    const v_14b011 = (response: v_2b7a17.NotificationResponse) => {
      try {
        const v_9390e8 = (v_3393e3?.notification?.request?.content?.data ?? {}) as Record<string, unknown>;
        const v_3b27d9 = String(v_9390e8.type ?? '');
        if (v_3b27d9 === 'inquiry_reply') {
          v_9b57fc(v_ce4741.myInfoNotify);
          return;
        }
        v_9b57fc(v_ce4741.wallet);
      } catch (v_9e86fd) {
        console.warn('[push tap] navigate fail:', v_9e86fd);
      }
    };

    const v_1ae212 = v_2b7a17.addNotificationResponseReceivedListener(v_14b011);

    v_2b7a17.getLastNotificationResponseAsync()
      .then((v_eb792a) => { if (v_eb792a) v_14b011(v_eb792a); })
      .catch(() => {});

    return () => { v_1ae212.remove(); };
  }, [v_9b57fc]);

  v_c4deb2(() => {

    const v_90a7e8 = (v_f71b56) => {

      if (v_435733) {
        console.log('[딥링크] 이미 처리 중인 딥링크, 건너뛰기');
        return;
      }

      if (v_308260 === v_f71b56) {
        console.log('[딥링크] 이미 처리된 URL, 건너뛰기:', v_f71b56);
        return;
      }

      try {
        v_435733 = true;
        console.log('[딥링크] URL 처리 시작:', v_f71b56);

        const v_8decf8 = v_f2c756.parse(v_f71b56);
        console.log('[딥링크] 파싱된 URL:', v_8decf8);

        console.log('parsed.queryParams:', v_8decf8.queryParams);

        const v_fc7051 = (v_8decf8.queryParams?.referral || v_8decf8.queryParams?.ref) as string | undefined;

        const v_d136d6 = v_8decf8.queryParams?.email as string | undefined;
        const v_4be5e8 = v_8decf8.queryParams?.from as string | undefined;

        if (v_d136d6 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v_d136d6)) {
          console.log('[딥링크] 외부 앱 email 자동 입력:', v_d136d6, 'from:', v_4be5e8);
          v_e84827.setItem('pendingPrefillEmail', v_d136d6).catch((v_a0830e) => {
            console.warn('[딥링크] prefill email 저장 실패:', v_a0830e);
          });
        }

        if (v_fc7051) {
          console.log('[딥링크] 레퍼럴 코드 추출:', v_fc7051);

          v_308260 = v_f71b56;

          v_eee6b0({ referralEmail: v_fc7051 });

          console.log('[딥링크] 회원가입 화면으로 이동');
          v_9b57fc('signup');
        } else if (v_d136d6) {

          v_308260 = v_f71b56;
          console.log('[딥링크] 로그인 화면으로 이동 (email 자동 입력)');
          v_9b57fc('login');
        } else {
          console.log('[딥링크] referral 파라미터가 없습니다.');
        }
      } catch (v_5e9bfe) {
        console.error('[딥링크] URL 처리 실패:', v_5e9bfe);
      } finally {
        v_435733 = false;
      }
    };

    const v_442744 = async () => {
      try {
        const v_7b9c4e = await v_f2c756.getInitialURL();
        if (v_7b9c4e) {
          const v_f24fd5 = await v_e84827.getItem('userData');
          if (v_f24fd5) {
            const v_ef7306 = JSON.parse(v_f24fd5);
            const v_660822 = v_ef7306?.member;
            if (v_660822) {
              console.log('[딥링크] 로그인 되어 있음, 딥링크 처리안함');
            } else {
              console.log('[딥링크] 로그인 안되어 있음, 딥링크 처리');
              v_90a7e8(v_7b9c4e);
            }
          } else {
            console.log('[딥링크] userData가 없음, 딥링크 처리');
            v_90a7e8(v_7b9c4e);
          }

        } else {
          console.log('[딥링크] 앱 시작 시 딥링크 없음');
        }
      } catch (v_5e9bfe) {
        console.error('[딥링크] 초기 URL 가져오기 실패:', v_5e9bfe);
      }
    };

    const v_269481 = v_f2c756.addEventListener('url', (v_d48baf) => {
      console.log('[딥링크] 딥링크 이벤트 감지:', v_d48baf.url);

      if (v_d48baf.url !== v_308260) {
        v_308260 = null;
      }
      v_90a7e8(v_d48baf.url);
    });

    v_442744();

    const v_599769 = setTimeout(() => {
      console.log('[딥링크] 스플래시 종료 후 딥링크 재확인');
      v_442744();
    }, 2500); 

    return () => {
      v_269481.remove();
      clearTimeout(v_599769);
    };
  }, [v_eee6b0, v_9b57fc]);

  v_c4deb2(() => {
    const v_b85291 = async () => {

      if (v_326be8.OS !== 'android') {
        return;
      }

      try {

        const v_23b320 = await v_222528.getInstallReferrerAsync();
        console.log('[Install Referrer] 원본:', v_23b320);

        if (v_23b320) {

          const v_24baff = new URLSearchParams(v_23b320);
          const v_a560de = v_24baff.get('utm_source');
          const v_2c9a0c = v_24baff.get('utm_content');

          console.log('[Install Referrer] utm_source:', v_a560de);
          console.log('[Install Referrer] utm_content:', v_2c9a0c);

          if (v_a560de === 'referral' && v_2c9a0c) {
            const v_9bf12c = decodeURIComponent(v_2c9a0c);
            console.log('[Install Referrer] 추천인 이메일:', v_9bf12c);

            const v_4b1c8e = await v_e84827.getItem('processed_install_referrer');
            if (v_4b1c8e === v_23b320) {
              console.log('[Install Referrer] 이미 처리된 referrer, 건너뛰기');
              return;
            }

            await v_e84827.setItem('processed_install_referrer', v_23b320);

            v_eee6b0({ referralEmail: v_9bf12c });

            console.log('[Install Referrer] 회원가입 화면으로 이동');
            v_9b57fc('signup');
          }
        }
      } catch (v_5e9bfe) {
        console.error('[Install Referrer] 처리 실패:', v_5e9bfe);
      }
    };

    const v_cb36b1 = setTimeout(v_b85291, 3000);

    return () => clearTimeout(v_cb36b1);
  }, [v_eee6b0, v_9b57fc]);

  v_c4deb2(() => {
    const v_350d39 = async () => {

      if (v_326be8.OS !== 'ios') {
        return;
      }

      try {

        const v_46a232 = await v_fba5a0.getStringAsync();
        console.log('[iOS Clipboard] 👀👀👀 클립보드 내용:', v_46a232);

        if (v_46a232 && v_46a232.startsWith('XRUN_REFERRAL:')) {
          const v_9bf12c = v_46a232.replace('XRUN_REFERRAL:', '').trim();
          console.log('[iOS Clipboard] 추천인 이메일:', v_9bf12c);

          if (v_9bf12c) {

            const v_eee9fe = await v_e84827.getItem('processed_clipboard_referral');
            if (v_eee9fe === v_46a232) {
              console.log('[iOS Clipboard] 이미 처리된 클립보드, 건너뛰기');
              return;
            }

            await v_e84827.setItem('processed_clipboard_referral', v_46a232);

            await v_fba5a0.setStringAsync('');

            v_eee6b0({ referralEmail: decodeURIComponent(v_9bf12c) });

            console.log('[iOS Clipboard] 회원가입 화면으로 이동');
            v_9b57fc('signup');
          }
        }
      } catch (v_5e9bfe) {
        console.error('[iOS Clipboard] 처리 실패:', v_5e9bfe);
      }
    };

    const v_cb36b1 = setTimeout(v_350d39, 3000);

    return () => clearTimeout(v_cb36b1);
  }, [v_eee6b0, v_9b57fc]);

  v_c4deb2(() => {
    console.log('[App] 화면 변경 시 및 앱 포커스 시 광고 완료 상태 확인');

  }, [v_0f0c7b]);

  if (v_0f0c7b === 'login') {
    return <LoginScreen />;
  }

  if (v_0f0c7b === 'signup') {
    return <SignupScreen />;
  }

  if (v_0f0c7b === 'forgotPassword') {
    return <ForgotPasswordScreen />;
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

  if (v_0f0c7b === 'walletDetail') {
    return <WalletDetailScreen />;
  }

  if (v_0f0c7b === 'transactionDetails') {
    return <TransactionDetailsScreen />;
  }

  if (v_0f0c7b === 'walletKeyTutorial') {
    return <WalletKeyTutorialScreen mode="signup" />;
  }
  if (v_0f0c7b === 'walletKeyGuide') {
    return <WalletKeyTutorialScreen mode="readonly" />;
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

  if (v_0f0c7b === 'addWalletAddress') {
    return <AddWalletAddressScreen />;
  }

  if (v_0f0c7b === 'myInfo') {
    return <MyInfoScreen />;
  }

  if (v_0f0c7b === 'myInfoEmailAuth') {
    return <MyInfoEmailAuthScreen />;
  }

  if (v_0f0c7b === 'myInfoPaymentPin') {
    return <MyInfoPaymentPinScreen />;
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

  if (v_0f0c7b === 'myInfoChangePassword') {
    return <ChangePasswordScreen />;
  }

  if (v_0f0c7b === 'myInfoSettings') {
    return <MyInfoSettingsScreen />;
  }

  if (v_0f0c7b === 'pangleList') {
    return <PangleListScreen />;
  }

  if (v_0f0c7b === 'tapjoyList') {
    return <TapjoyListScreen />;
  }

  if (v_0f0c7b === 'ayetOffers') {
    return <AyetOffersScreen />;
  }

  if (v_0f0c7b === 'ayetOffersXplay') {
    return <AyetOffersScreen slotName="Xplay" />;
  }

  if (v_0f0c7b === 'walletPrivateKeyDisplay') {
    return <WalletPrivateKeyDisplayScreen />;
  }

  if (v_0f0c7b === 'walletPrivateKeyGoogleAuth') {
    return <WalletPrivateKeyGoogleAuthScreen />;
  }

  if (v_0f0c7b === 'walletRestore') {
    return <WalletRestoreScreen />;
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

  if (v_0f0c7b === 'referralInput') {
    return <ReferralInputScreen />;
  }

  if (v_0f0c7b === 'shop') {
    console.log('[App.tsx] currentScreen이 shop이므로 ShopScreen 렌더링');
    return <ShopScreen />;
  }

  if (v_0f0c7b === 'shopTicket') {
    return <ShopTicketScreen />;
  }

  if (v_0f0c7b === 'shopMyTicket') {
    return <ShopMyTicketScreen />;
  }

  if (v_0f0c7b === 'shopMyItems') {
    return <ShopMyItemsScreen />;
  }

  if (v_0f0c7b === 'shopMyTicketDetail') {
    return <ShopMyTicketDetailScreen />;
  }

  if (v_0f0c7b === 'shopProductDetail') {
    return <ShopProductDetailScreen />;
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

  if (v_0f0c7b === 'shopItemRegister') {
    return <ShopItemRegisterScreen />;
  }

  if (v_0f0c7b === 'showNapAd') {
    return <ShowNapAdScreen />;
  }

  if (v_0f0c7b === 'showPockAd') {
    return <ShowPockAdScreen />;
  }

  if (v_0f0c7b === 'showWebView') {
    return <ShowWebViewScreen />;
  }

  if (v_0f0c7b === 'xrunInfo') {
    return <XRUNinfoScreen />;
  }

  if (v_0f0c7b === 'xplayInfo') {
    return <XplayInfoScreen />;
  }

  if (v_0f0c7b === 'xplayZone') {
    return <XplayZoneScreen />;
  }

  if (v_0f0c7b === 'myChipsOfferwall') {
    return <MyChipsOfferwallScreen />;
  }

  if (v_0f0c7b === 'adisonOfferwall') {
    return <AdisonOfferwallScreen />;
  }

  if (v_0f0c7b === 'adisonTest') {
    return <AdisonTestScreen />;
  }

  if (v_0f0c7b === 'myinfoShopSales') {
    return <MyinfoShopSalesScreen />;
  }

  return <LoginSignupScreen />;
};

const v_512b02 = ({ isAdFinished: v_65941f }: { isAdFinished: boolean }) => {
  const [v_22d5f0, v_baa579] = v_5ab095<v_8a44cb.PermissionStatus | null>(null);
  const [v_94037c, v_aa65df] = v_5ab095(false);
  const [v_73ba28, v_735eac] = v_5ab095(false);
  const [v_6276b7, v_456561] = v_5ab095(false);
  const { showAlert: v_889fad } = v_4b1173();

  const v_317b57 = v_de06a3(async (v_b5de9c, v_985be2) => {
    try {
      console.log('[App] 마커 데이터 가져오기 시작:', { latitude: v_b5de9c, longitude: v_985be2 });

      const v_761df7 = await v_e84827.getItem('astorCoinsData');
      if (v_761df7) {
        try {
          const v_75d360 = JSON.parse(v_761df7);
          if (v_75d360 && Array.isArray(v_75d360) && v_75d360.length > 0) {
            console.log('[App] 마커 데이터가 이미 존재합니다. API 호출을 건너뜁니다:', v_75d360.length, '개');
            return;
          }
        } catch (v_5f9add) {
          console.log('[App] 기존 마커 데이터 파싱 실패, 새로 가져옵니다.');
        }
      }

      const v_f24fd5 = await v_e84827.getItem('userData');
      if (!v_f24fd5) {
        console.log('[App] userData가 없어 마커 데이터를 가져올 수 없습니다.');
        return;
      }

      const v_ef7306 = JSON.parse(v_f24fd5);
      const v_660822 = v_ef7306?.member;
      if (!v_660822) {
        console.log('[App] userData에 member가 없어 마커 데이터를 가져올 수 없습니다.');
        return;
      }

      const v_003147 = await v_f84ef5(v_b5de9c, v_985be2, v_660822);

      if (v_003147 && Array.isArray(v_003147) && v_003147.length > 0) {

        await v_e84827.setItem('astorCoinsData', JSON.stringify(v_003147));
        console.log('[App] 마커 데이터 저장 완료:', v_003147.length, '개');
      } else {
        console.log('[App] 마커 데이터가 비어있습니다.');
      }
    } catch (v_5e9bfe) {
      console.error('[App] 마커 데이터 가져오기 및 저장 실패:', v_5e9bfe);

    }
  }, []);

  const v_594d44 = v_de06a3(async () => {
    try {
      console.log('[App] 위치 권한 요청 시작');
      const v_4042b1 = await v_8a44cb.requestForegroundPermissionsAsync();
      v_baa579(v_4042b1.status);
      if (v_4042b1.status === 'granted') {
        console.log('[App] 위치 권한 허용됨');

        try {
          const v_7dd198 = await v_8a44cb.getCurrentPositionAsync({
            accuracy: v_8a44cb.Accuracy.Balanced,
          });
          const { latitude: v_b5de9c, longitude: v_985be2 } = v_7dd198.coords;
          console.log('[App] 현재 위치 가져옴:', { latitude: v_b5de9c, longitude: v_985be2 });

          await v_317b57(v_b5de9c, v_985be2);
        } catch (v_cd6da1) {
          console.error('[App] 현재 위치 가져오기 실패:', v_cd6da1);
        }
      } else {
        console.log('[App] 위치 권한 거부됨:', v_4042b1.status);
      }
      return v_4042b1.status;
    } catch (v_5e9bfe) {
      console.error('[App] 위치 권한 요청 실패:', v_5e9bfe);
      return 'denied' as v_8a44cb.PermissionStatus;
    }
  }, [v_317b57]);

  const v_941aca = v_de06a3(async () => {

    if (v_73ba28 || v_6276b7) {
      return;
    }

    const v_9bc4b6 = v_22d5f0 || await v_8a44cb.getForegroundPermissionsAsync().then(v_cb35cb => v_cb35cb.status);

    const v_8c27ae = v_9bc4b6 !== 'granted';

    if (v_8c27ae) {
      v_735eac(true);
      await v_889fad(
        '위치 권한 필요',
        '앱의 주요 기능을 사용하려면 위치 정보 권한이 필요합니다. 설정에서 권한을 허용해주세요.',
        [
          {
            text: '다시 요청',
            onPress: async () => {
              v_456561(true);
              v_735eac(false); 

              console.log('[App] 다시 요청: 위치 권한 요청');
              const v_4042b1 = await v_594d44();

              await new Promise(v_6f7712 => setTimeout(v_6f7712, 1000));

              const v_4b9906 = await v_8a44cb.getForegroundPermissionsAsync().then(v_cb35cb => v_cb35cb.status);
              v_baa579(v_4b9906);

              v_456561(false);

              setTimeout(() => {
                v_941aca();
              }, 500);
            },
          },
          {
            text: '확인',
          },
        ]
      );
    }
  }, [v_73ba28, v_6276b7, v_22d5f0, v_889fad, v_594d44]);

  v_c4deb2(() => {
    const v_42373f = async () => {

      if (!v_65941f) {
        console.log('[App] 광고가 아직 끝나지 않아 위치 권한 요청을 대기합니다.');
        return;
      }

      const v_4042b1 = await v_594d44();
      v_baa579(v_4042b1);
      v_aa65df(true);
    };

    v_42373f();
  }, [v_594d44, v_65941f]);

  v_c4deb2(() => {
    if (v_94037c && v_22d5f0 !== null && !v_6276b7) {

      const v_cb36b1 = setTimeout(() => {
        v_941aca();
      }, 1000);

      return () => clearTimeout(v_cb36b1);
    }
  }, [v_94037c, v_22d5f0, v_6276b7, v_941aca]);

  return null;
};

const v_d0a391 = () => {
  const { t: v_8d41d7 } = v_772971();
  const { addTokenDialogVisible: v_750b67, closeAddTokenDialog: v_b3106e, emergencyStop: v_b135ca } = v_700ef9();
  const [v_614e3c, v_80c653] = v_5ab095(false);
  const [v_14feb2, v_b5ebec] = v_5ab095<string | undefined>(undefined);
  const [v_2fa3d1, v_d97db8] = v_5ab095(false); 

  const v_87df97 = v_a3453e.useMemo(() => {
    if (!v_b135ca?.message) {
      return v_8d41d7('common.emergencyStop.title');
    }

    if (v_b135ca.message === 'UPDATE_FOUND\nPLEASE_UPDATE') {
      return `${v_8d41d7('common.versionUpdate.updateFound')}\n${v_8d41d7('common.versionUpdate.pleaseUpdate')}`;
    }

    return v_b135ca.message;
  }, [v_b135ca?.message, v_8d41d7]);

  v_c4deb2(() => {
    const v_bc755f = async () => {
      try {

        const v_090f7c = await v_5ee4ec();
        if (v_090f7c) {
          console.log('[App] 서버에서 업데이트 필요 확인');
          const v_4587b3 = v_deac27();
          v_b5ebec(v_4587b3);
          v_d97db8(true); 
          v_80c653(true);
          return;
        }

        const v_4587b3 = v_deac27();
        const v_1300ee = await v_f16a74();

        if (v_1300ee && v_790b4f(v_4587b3, v_1300ee)) {
          console.log('[App] 새 버전 발견:', v_1300ee);
          if (__DEV__) {
            console.log('[App] 개발 모드이므로 버전 확인을 건너뜁니다. app,tsx');
            return;
          } else {
            v_b5ebec(v_1300ee);
            v_d97db8(false); 
            v_80c653(true);
          }
        } else {

        }
      } catch (v_5e9bfe) {
        console.error('[App] 버전 확인 실패:', v_5e9bfe);

      }
    };

    const v_cb36b1 = setTimeout(() => {
      v_bc755f();
    }, 3000);

    return () => clearTimeout(v_cb36b1);
  }, []);

  const v_9aae33 = v_e662ae<v_c3551b>(v_6b5698.currentState);
  v_c4deb2(() => {
    const v_7a424f = async (nextAppState: v_c3551b) => {
      const v_0221a3 = v_9aae33.current;
      v_9aae33.current = v_3b10d8;

      const v_53d7c7 = (v_0221a3 === 'background' || v_0221a3 === 'inactive') && v_3b10d8 === 'active';
      if (!v_53d7c7) return;

      try {
        v_763f0d();
        const v_090f7c = await v_5ee4ec();
        const v_4587b3 = v_deac27();
        const v_1300ee = await v_f16a74();
        const v_50893c = v_1300ee ? v_790b4f(v_4587b3, v_1300ee) : false;

        if (v_090f7c || v_50893c) {
          if (!v_614e3c) {
            v_b5ebec(v_1300ee ?? v_4587b3);
            v_d97db8(v_090f7c);
            v_80c653(true);
          }
        } else {

          v_80c653(false);
        }
      } catch (v_5e9bfe) {
        console.error('[App] 포그라운드 복귀 시 버전 확인 실패:', v_5e9bfe);
      }
    };

    const v_269481 = v_6b5698.addEventListener('change', v_7a424f);

    return () => {
      v_269481?.remove();
    };
  }, [v_614e3c]);

  return (
    <>
      <AddTokenDialog visible={v_750b67} onClose={v_b3106e} />
      <EmergencyStopDialog
        visible={v_b135ca?.enabled ?? false}
        message={v_87df97}
        link={v_b135ca?.link}

      />
      <VersionUpdateDialog
        visible={v_614e3c}
        latestVersion={v_14feb2}
        showLaterButton={!v_2fa3d1} 
        onClose={() => v_80c653(false)}
      />
      <OTAUpdateDialog />
    </>
  );
};

export default function v_6540c3() {
  const [v_cd31a8, v_deef62] = v_5ab095(true);
  const [v_65941f, v_c355f2] = v_5ab095(false); 
  const [v_43f571] = v_c06f2c({
    'Roboto-Regular': v_259807,
    'Roboto-Medium': v_b1350e,
    'Roboto-SemiBold': v_f2f1ae,
    'Roboto-Bold': v_567640,
  });
  const v_1b7402 = v_e662ae<v_c3551b>(v_6b5698.currentState);
  const v_8c82fd = v_e662ae(false);

  v_c4deb2(() => {
    const v_6c5111 = async () => {

      await v_e84827.setItem('app_last_state', v_6b5698.currentState);
    };

    v_6c5111();
  }, []);

  v_c4deb2(() => {
    const v_7a424f = async (nextAppState: v_c3551b) => {
      const v_e263a1 = v_1b7402.current;
      console.log('[App] AppState 변경 감지:', {
        previous: v_e263a1,
        next: v_3b10d8,
        currentTime: new Date().toISOString(),
      });

      if (
        v_e263a1.match(/inactive|background/) &&
        v_3b10d8 === 'active'
      ) {

        console.log('[App] 포그라운드 복귀 감지');
        await v_e84827.setItem('app_last_state', v_3b10d8);

        try {
          const v_9ef7b6 = await v_e84827.getItem('isAdCompleted');
          if (v_9ef7b6 === 'true') {
            console.log('[App] 광고 보기 완료');

            await v_e84827.removeItem('isAdCompleted');
            console.log('[App] isAdCompleted 제거 완료');
          }
        } catch (v_5e9bfe) {
          console.error('[App] 광고 완료 상태 확인 실패:', v_5e9bfe);
        }
      }

      else if (
        v_e263a1 === 'active' &&
        (v_3b10d8 === 'inactive' || v_3b10d8 === 'background')
      ) {

        console.log('[App] 백그라운드/비활성화 전환 감지:', v_3b10d8);
        try {

          const v_3d8bda = Math.floor(Date.now() / 1000);
          const v_da5b2d = v_3d8bda.toString();
          await v_e84827.setItem('app_last_state', v_3b10d8);
          await v_e84827.setItem('app_last_background_timestamp', v_da5b2d);
          console.log('[App] ✅ 백그라운드 시간 저장 완료:', {
            timestamp: v_da5b2d,
            date: new Date(v_3d8bda * 1000).toISOString(),
            isNumeric: /^\d+$/.test(v_da5b2d),
          });

          const v_595ec2 = await v_e84827.getItem('app_last_background_timestamp');
          console.log('[App] 저장된 값 확인:', v_595ec2);
        } catch (v_5e9bfe) {
          console.error('[App] ❌ 앱 상태 저장 실패:', v_5e9bfe);
        }
      }

      else if (
        v_e263a1 === 'inactive' &&
        v_3b10d8 === 'background'
      ) {

        console.log('[App] inactive -> background 전환 (타임스탬프는 이미 저장됨)');
        await v_e84827.setItem('app_last_state', v_3b10d8);
      }
      else {
        console.log('[App] AppState 변경 (처리하지 않음):', {
          previous: v_e263a1,
          next: v_3b10d8,
        });
      }

      v_1b7402.current = v_3b10d8;
    };

    console.log('[App] AppState 리스너 등록, 현재 상태:', v_6b5698.currentState);

    const v_269481 = v_6b5698.addEventListener('change', v_7a424f);

    return () => {
      console.log('[App] AppState 리스너 제거');
      v_269481?.remove();
    };
  }, []);

  v_c4deb2(() => {
    if (v_8c82fd.current) return;
    v_8c82fd.current = true;

    if (__DEV__) {
      try {
        require('./src/utils/devDebugStore').devDebugStore.init();
      } catch (v_37eab7) {}
    }

    v_83e499();

    const v_139fe0 = async () => {
      const v_cbd24a = __DEV__ ? require('./src/utils/devDebugStore').devDebugStore : null;

      try {
        v_cbd24a?.recordBootStep('start');
        v_8ecf08();
        v_116c93();
        console.log('[App] 환경 변수·i18n 동기 초기화 완료 (저장 언어는 백그라운드 적용)');
      } catch (v_5e9bfe) {
        console.error('[App] 초기화 실패:', v_5e9bfe);
      }

      v_c355f2(true);
      v_deef62(false);
      if (__DEV__) {
        try {
          require('./src/utils/devDebugStore').devDebugStore.recordBootTotal();
        } catch (v_37eab7) {}
      }

      v_1f4a13();

      const v_9aae4b = async () => {

        if (v_326be8.OS === 'ios' && v_09243c) {
          try {
            const v_275ccd = await v_09243c.getTrackingPermissionsAsync();
            console.log('[ATT] 현재 상태:', v_275ccd.status);
            if (v_275ccd.status === 'undetermined') {
              const v_8f00b9 = await v_09243c.requestTrackingPermissionsAsync();
              console.log('[ATT] 요청 결과:', v_8f00b9.status);
            }
          } catch (v_9e86fd) {
            console.warn('[ATT] 요청 실패:', v_9e86fd);
          }
        }

        try {
          const v_c9c489 = v_e4a763();
          const v_280f96 = {
            devKey: v_c9c489.APPSFLYER_DEV_KEY,
            appId: v_c9c489.APPSFLYER_APP_ID_IOS,
            isDebug: true,
            onInstallConversionDataListener: true,
            onDeepLinkListener: true,
            timeToWaitForATTUserAuthorization: 10,
          };
          const v_3d627c = 12;
          const v_c3d02b = [0, 200, 400, 600, 900, 1200, 1600, 2000, 2500, 3000, 3500, 4000];
          const v_1059a9 = (v_bc21cd) => {
            const v_5c3b18 = v_80fa10.RNAppsFlyer;
            if (v_5c3b18 != null && typeof v_5c3b18.initSdkWithCallBack === 'function') {
              v_1edcd1.initSdk(v_280f96, () => console.log('[App] AppsFlyer 초기화 성공'), (v_49263d) => console.warn('[App] AppsFlyer 초기화 경고/실패:', v_49263d));
              return;
            }
            if (v_bc21cd < v_3d627c) setTimeout(() => v_1059a9(v_bc21cd + 1), v_c3d02b[Math.min(v_bc21cd, v_c3d02b.length - 1)]);
            else console.warn('[App] AppsFlyer 네이티브 모듈을 찾을 수 없어 초기화를 건너뜁니다.');
          };
          v_1059a9(0);
        } catch (v_5e9bfe) {
          console.error('[App] AppsFlyer 초기화 실패:', v_5e9bfe);
        }
        v_0b0acf().then(() => console.log('[App] Taboola 초기화 완료')).catch((v_9e86fd) => console.error('[App] Taboola 초기화 실패:', v_9e86fd));
        v_dd87bc()
          .then((v_d9a946) => v_e84827.setItem('xrungopaxprice', JSON.stringify(v_d9a946)))
          .then(() => console.log('[App] 고팍스 XRUN 가격 조회 및 저장 완료'))
          .catch((v_9e86fd) => console.error('[App] 고팍스 XRUN 가격 조회 실패:', v_9e86fd));
        v_e84827.getItem('userData')
          .then((v_f24fd5) => {
            if (!v_f24fd5) return;
            try {
              const v_ef7306 = JSON.parse(v_f24fd5);
              const v_660822 = v_ef7306?.member;
              if (v_660822) v_8ee299(String(v_660822)).catch((v_9e86fd) => console.error('[App] 사용자 잔액 업데이트 V2 실패:', v_9e86fd));
            } catch (v_37eab7) {}
          })
          .catch(() => {});
        v_e84827.getItem('cached_AD')
          .then((v_90e1d7) => {
            if (!v_90e1d7) return;
            const v_4fc87f = JSON.parse(v_90e1d7);
            let v_7306f6 = false;
            const v_8fb936 = {};
            Object.keys(v_4fc87f).forEach((v_aa0917) => {
              const v_7ec08d = v_4fc87f[v_aa0917]?.urlAD;
              if (v_7ec08d && (v_7ec08d.startsWith('market://') || v_7ec08d.startsWith('intent://'))) v_7306f6 = true;
              else v_8fb936[v_aa0917] = v_4fc87f[v_aa0917];
            });
            if (v_7306f6) return v_e84827.setItem('cached_AD', JSON.stringify(v_8fb936));
          })
          .catch(() => {});
      };

      if (__DEV__) {
        try {
          require('./src/utils/devDebugStore').devDebugStore.recordBootStep('before_background');
        } catch (v_37eab7) {}
      }

      v_563153().then(() => console.log('[App] TopAd5 광고 캐시 완료')).catch((v_9e86fd) => console.error('[App] TopAd5 광고 캐시 실패:', v_9e86fd));
      setTimeout(v_9aae4b, 1500);

      setTimeout(() => {
        const v_cbd24a = __DEV__ ? require('./src/utils/devDebugStore').devDebugStore : null;
        v_cbd24a?.recordBootStep('pangle_start');
        v_f095b0()
          .then(() => v_e55270())
          .then(() => console.log('[App] 앱 오프닝 광고 프로세스 종료 (표시 완료 또는 실패)'))
          .catch((v_5e9bfe) => console.warn('[App] Pangle 프로세스 실패:', v_5e9bfe))
          .finally(() => v_cbd24a?.recordBootStep('pangle_done'));
      }, 0);
    };

    v_139fe0();
  }, []);

  if (v_cd31a8) {
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
              <PermissionRequester isAdFinished={v_65941f} />
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