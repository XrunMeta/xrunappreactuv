import v_a3453e, { v_5ab095, v_c4deb2, v_de06a3, v_e662ae } from 'bapkr';
import { v_6b5698, v_c3551b } from 'rcmrninabrnb';
import { v_326be8 } from 'rcmrninabrnb';
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
  v_38326c,
  v_052a8a,
  v_1a0a02,
  v_8734da,
  v_a1c4a5,
  v_287831,
  v_540580,
  v_f7bdb9,
  v_1cca63,
  v_0e5276,
} from './src/screens';
import { v_00e8f9, v_a0daa8 } from './src/navigation';
import { v_4b64f4, v_700ef9 } from './src/context';
import { v_0c450d } from './src/context/AlertDialogContext';
import { v_aabda8, v_b631a8, v_2806ef, v_6e8088 } from './src/components';
import { v_a2474a } from './src/utils/env';
import { v_cba33f } from './src/utils';
import { v_757c02 } from './src/locales';
import { v_0b0acf } from './src/services/taboola';
import { v_b357c3 } from './src/services/admob';
import { v_563153, v_dd87bc, v_8ee299 } from './src/services';
import { v_83e499 } from './src/services/googleAuth';
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
import { v_f84ef5 } from './src/services';
import { v_f16a74, v_deac27, v_790b4f, v_5ee4ec } from './src/services/versionCheck';

let v_308260 = null;
let v_435733 = false;

const v_c0dbdf = () => {
  const { currentScreen: v_0f0c7b, navigate: v_9b57fc } = v_a0daa8();
  const { setSignupFormData: v_eee6b0 } = v_700ef9();

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

        const v_fc7051 = v_8decf8.queryParams?.referral as string | undefined;

        if (v_fc7051) {
          console.log('[딥링크] 레퍼럴 코드 추출:', v_fc7051);

          v_308260 = v_f71b56;

          v_eee6b0({ referralEmail: v_fc7051 });

          console.log('[딥링크] 회원가입 화면으로 이동');
          v_9b57fc('signup');
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
            }else{
              console.log('[딥링크] 로그인 안되어 있음, 딥링크 처리');
              v_90a7e8(v_7b9c4e);
            }
          }else{
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

  if (v_0f0c7b === 'showPockAd') {
    return <ShowPockAdScreen />;
  }

  if (v_0f0c7b === 'xrunInfo') {
    return <XRUNinfoScreen />;
  }

  if (v_0f0c7b === 'myinfoShopSales') {
    return <MyinfoShopSalesScreen />;
  }

  return <LoginSignupScreen />;
};

const v_512b02 = () => {
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

      const v_4042b1 = await v_594d44();
      v_baa579(v_4042b1);
      v_aa65df(true);
    };

    v_42373f();
  }, [v_594d44]);

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
  const { addTokenDialogVisible: v_750b67, closeAddTokenDialog: v_b3106e, emergencyStop: v_b135ca } = v_700ef9();
  const [v_614e3c, v_80c653] = v_5ab095(false);
  const [v_14feb2, v_b5ebec] = v_5ab095<string | undefined>(undefined);
  const [v_2fa3d1, v_d97db8] = v_5ab095(false); 

  return (
    <>
      <AddTokenDialog visible={v_750b67} onClose={v_b3106e} />
      <EmergencyStopDialog
        visible={v_b135ca?.enabled ?? false}
        message={v_b135ca?.message ?? '긴급 안내가 있습니다.'}
        link={v_b135ca?.link}

      />
      <VersionUpdateDialog
        visible={v_614e3c}
        latestVersion={v_14feb2}
        showLaterButton={!v_2fa3d1} 
        onClose={() => v_80c653(false)}
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
  const v_1b7402 = v_e662ae<v_c3551b>(v_6b5698.currentState);

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
            v_cba33f('광고보기를 완료했습니다');
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

    v_83e499();

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

      try {
        await v_0b0acf();
        console.log('[App] Taboola 초기화 완료');
      } catch (v_5e9bfe) {
        console.error('[App] Taboola 초기화 실패:', v_5e9bfe);
      }

      setTimeout(() => {
        v_b357c3().then(() => {
          console.log('[App] AdMob 초기화 완료');
        }).catch((v_5e9bfe) => {
          console.error('[App] AdMob 초기화 실패 (앱은 계속 실행됩니다):', v_5e9bfe);
        });
      }, 1000); 

      try {
        console.log('[App] TopAd5 광고 캐시 시작');
        await v_563153();
        console.log('[App] TopAd5 광고 캐시 완료');
      } catch (v_5e9bfe) {
        console.error('[App] TopAd5 광고 캐시 실패:', v_5e9bfe);

      }

      try {
        console.log('[App] 고팍스 XRUN 가격 조회 시작');
        const v_d9a946 = await v_dd87bc();
        const v_300a65 = JSON.stringify(v_d9a946);
        await v_e84827.setItem('xrungopaxprice', v_300a65);
        console.log('[App] 고팍스 XRUN 가격 조회 및 저장 완료:', v_d9a946.data?.gopaxPrice);
      } catch (v_5e9bfe) {
        console.error('[App] 고팍스 XRUN 가격 조회 및 저장 실패:', v_5e9bfe);

      }

      try {
        const v_f24fd5 = await v_e84827.getItem('userData');
        if (v_f24fd5) {
          const v_ef7306 = JSON.parse(v_f24fd5);
          const v_660822 = v_ef7306?.member;
          if (v_660822) {
            console.log('[App] 사용자 잔액 업데이트 V2 호출 시작');
            v_8ee299(String(v_660822)).catch((v_5e9bfe) => {
              console.error('[App] 사용자 잔액 업데이트 V2 호출 실패:', v_5e9bfe);
            });
          }
        }
      } catch (v_5e9bfe) {
        console.error('[App] 사용자 잔액 업데이트 V2 호출 실패:', v_5e9bfe);

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
