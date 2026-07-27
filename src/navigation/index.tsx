import v_a3453e, {
  v_af12cb,
  v_de06a3,
  v_76a8a9,
  v_c4deb2,
  v_df9f57,
  v_e662ae,
  v_5ab095,
} from 'bapkr';
import { v_1ed974, v_326be8 } from 'rcmrninabrnb';
import v_e84827 from 'bkjbgtcoyuizqwgwtnaxmfkyvlqwevapsqmanbsnv';
import { v_9673ae, v_e1c2cb } from '../services/clickTracker';
import { v_be6b97 } from './backNavigationPolicy';
import { v_68ecf9 } from './stackOps';

export const v_ce4741 = {
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
} as const;

export type ScreenName = keyof typeof v_ce4741;

interface NavigationContextValue {
  currentScreen: ScreenName;
  previousScreen: ScreenName | null;
  navigate: (screen: ScreenName) => void;

  replace: (screen: ScreenName) => void;
  goBack: () => void;
  reset: (screen: ScreenName) => void;
  canGoBack: boolean;
}

const v_e7c788 = v_af12cb<NavigationContextValue | undefined>(
  undefined,
);

export const NavigationProvider: v_a3453e.FC<{ children: v_a3453e.ReactNode }> = ({
  children: v_21f619,
}) => {
  const [v_8d490a, v_768005] = v_5ab095<ScreenName[]>(['authLanding']);
  const [v_2167f0, v_da6fbe] = v_5ab095(false);
  const v_f5057b = v_e662ae<number>(0);
  const v_cf6dc2 = v_e662ae<ScreenName[]>(['authLanding']);

  const v_0f0c7b = v_8d490a[v_8d490a.length - 1];
  const v_640ccc = v_8d490a.length > 1 ? v_8d490a[v_8d490a.length - 2] : null;

  v_c4deb2(() => {
    v_cf6dc2.current = v_8d490a;
  }, [v_8d490a]);

  v_c4deb2(() => {
    if (!v_2167f0) return;
    v_9673ae(v_0f0c7b);
  }, [v_0f0c7b, v_2167f0]);

  v_c4deb2(() => {
    const v_8a5f7b = '[!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!부팅 느림]';
    const v_d0a230 = async () => {
      const v_b66f2c = Date.now();
      console.log(v_8a5f7b, '자동 로그인 확인(AsyncStorage) 시작');
      try {

        const v_efe339 = await v_e84827.getItem('rememberMe');
        const v_0fd7ed = await v_e84827.getItem('isLoggedIn');
        console.log(v_8a5f7b, '자동 로그인 확인 완료', `${Date.now() - v_b66f2c}ms`, { remember: v_efe339, loggedIn: v_0fd7ed });

        console.log('[Navigation] 자동 로그인 확인:', {
          remember: v_efe339,
          loggedIn: v_0fd7ed,
          rememberType: typeof v_efe339,
          loggedInType: typeof v_0fd7ed,
        });

        if (v_efe339 === 'true' && v_0fd7ed === 'true') {

          console.log('[Navigation] 자동 로그인 확인: MapMainScreen으로 이동');
          v_768005([v_ce4741.map]);
          v_da6fbe(true);
          return;
        }

        console.log('[Navigation] 자동 로그인 없음: 기본 화면 유지', {
          remember: v_efe339,
          loggedIn: v_0fd7ed,
          rememberCheck: v_efe339 === 'true',
          loggedInCheck: v_0fd7ed === 'true',
        });
      } catch (v_5e9bfe) {
        console.error(v_8a5f7b, '로그인 상태 확인 실패:', v_5e9bfe);
      } finally {
        v_da6fbe(true);
        console.log(v_8a5f7b, 'Navigation 초기화 완료 (첫 화면 결정됨)', `${Date.now() - v_b66f2c}ms`);
      }
    };

    v_d0a230();
  }, []);

  const v_9b57fc = v_de06a3((v_53746a) => {
    v_768005((v_ba2215) => {
      if (v_ba2215[v_ba2215.length - 1] === v_53746a) {
        return v_ba2215;
      }
      const v_0be3f3 = [...v_ba2215, v_53746a];
      v_cf6dc2.current = v_0be3f3; 
      return v_0be3f3;
    });
  }, []);

  const v_fc039d = v_de06a3((v_53746a) => {
    v_768005((v_ba2215) => {
      const v_0be3f3 = v_68ecf9(v_ba2215 as string[], v_53746a) as ScreenName[];
      v_cf6dc2.current = v_0be3f3;
      return v_0be3f3;
    });
  }, []);

  const v_c7ac57 = v_de06a3(() => {
    v_768005((v_ba2215) => {
      if (v_ba2215.length <= 1) {
        return v_ba2215;
      }
      const v_0be3f3 = v_ba2215.slice(0, -1);
      v_cf6dc2.current = v_0be3f3; 
      return v_0be3f3;
    });
  }, []);

  const v_487a25 = v_de06a3((v_1505cb) => {
    const v_53746a =
      typeof v_1505cb === 'string'
        ? v_1505cb
        : (v_1505cb?.routes?.[0]?.name as ScreenName) ?? v_ce4741.map;
    const v_0be3f3 = [v_53746a];
    v_cf6dc2.current = v_0be3f3; 
    v_768005(v_0be3f3);
  }, []);

  v_c4deb2(() => {
    if (v_326be8.OS !== 'android') {
      console.log('[Navigation] BackHandler: iOS 환경이므로 BackHandler를 등록하지 않습니다.');
      return;
    }

    console.log('[Navigation] BackHandler: Android 하드웨어 백 버튼 리스너 등록');

    const v_4499d0 = () => {

      const v_393a6b = v_cf6dc2.current;
      const v_0f0c7b = v_393a6b[v_393a6b.length - 1];
      console.log('[Navigation] BackHandler: 뒤로가기 버튼 감지, 현재 스택 길이:', v_393a6b.length, '화면:', v_393a6b, '현재 화면:', v_0f0c7b);
      v_e1c2cb('back_press', { category: 'navigation', params: { from: v_0f0c7b } });

      const v_9b064f = v_be6b97({
        screen: v_0f0c7b,
        canGoBack: v_393a6b.length > 1,
        source: 'hardware',
      });
      console.log('[Navigation] BackHandler: 정책 판정 =', v_9b064f);

      if (v_9b064f === 'block') {
        return true; 
      }

      if (v_9b064f === 'goBack') {
        v_c7ac57();
        return true; 
      }

      if (v_9b064f === 'resetMap') {
        v_487a25(v_ce4741.map);
        return true;
      }

      const v_5c2f9f = Date.now();
      const v_78e1e8 = v_5c2f9f - v_f5057b.current;
      console.log('[Navigation] BackHandler: 루트 화면, 마지막 클릭으로부터 경과 시간:', v_78e1e8, 'ms');

      if (v_78e1e8 < 2000) {
        console.log('[Navigation] BackHandler: 두 번 눌렀으므로 앱 종료');
        v_1ed974.exitApp();
        return true;
      }

      v_f5057b.current = v_5c2f9f;
      console.log('[Navigation] BackHandler: 첫 번째 클릭, 뒤로가기를 한 번 더 누르면 앱이 종료됩니다.');
      return true; 
    };

    const v_d9821c = v_1ed974.addEventListener('hardwareBackPress', v_4499d0);
    console.log('[Navigation] BackHandler: 리스너 등록 완료');

    return () => {
      console.log('[Navigation] BackHandler: 리스너 제거');
      v_d9821c.remove();
    };
  }, [v_c7ac57, v_487a25]); 

  const v_3b402b = v_df9f57(
    () => ({
      currentScreen: v_0f0c7b,
      previousScreen: v_640ccc,
      navigate: v_9b57fc,
      replace: v_fc039d,
      goBack: v_c7ac57,
      reset: v_487a25,
      canGoBack: v_8d490a.length > 1,
    }),
    [v_0f0c7b, v_640ccc, v_9b57fc, v_fc039d, v_c7ac57, v_487a25, v_8d490a.length],
  );

  return (
    <NavigationContext.Provider value={v_3b402b}>
      {v_21f619}
    </NavigationContext.Provider>
  );
};

export const v_a0daa8 = () => {
  const v_e3aeb3 = v_76a8a9(v_e7c788);

  if (!v_e3aeb3) {
    throw new Error('useAppNavigation must be used within NavigationProvider');
  }

  return v_e3aeb3;
};
