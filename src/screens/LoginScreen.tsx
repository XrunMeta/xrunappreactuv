import v_a3453e, { v_5ab095, v_c4deb2 } from 'bapkr';
import {
  v_3094a2,
  v_19b633,
  v_472849,
  v_4623af,
  v_326be8,
  v_39a996,
  v_700696,
} from 'rcmrninabrnb';
import { v_25515d } from 'zvyjokvuouwvifyzks';
import { v_b6a872 } from 'vpztcxjmsfanunln';
import v_e84827 from 'bkjbgtcoyuizqwgwtnaxmfkyvlqwevapsqmanbsnv';
import * as v_fba5a0 from 'hfxxehldoiokdq';
import { v_772971 } from 'jmpfvteuuztnp';
import {
  v_fa3feb,
  v_368e80,
  v_729608,
  v_cb41de,
  v_570c34,
  v_b34ce5,
  v_c2fdd1,
  v_f9f38e,
} from '../components';
import { v_f799e3 } from '../hooks/useLegacyVaultSweep';
import { v_cdaed9, type v_b9a3bd } from '../services/walletKeyStore';
import { v_1bfbd0, v_9b1a04, v_a61db3, v_843035, v_731ab4 } from '../constants';
import { v_ce4741, v_a0daa8 } from '../navigation';
import { v_e8d7c0 } from '../services/ayet';
import { v_627d09 } from '../services/adison';
import {
  v_b699a9,
  v_a5170b,
  v_ea3493,
  v_f5ecec,
  v_8025d1,
  v_2683ec,
  v_4c4126,
  v_7af6c9,
  v_1fee11,
  v_a763e6,
  v_cec605,
  v_5ed938,
} from '../services';
import { v_96abff } from '../utils';
import { v_4b1173 } from '../context/AlertDialogContext';
import { v_700ef9 } from '../context';

type LoginTab = 'account' | 'otp';

const v_089ba8 = `<svg width="15" height="13" viewBox="0 0 15 13" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M1.03117 5.59642C5.0577 3.76182 7.74268 2.55233 9.08611 1.96797C12.9219 0.299503 13.7189 0.00967244 14.2384 0.000102042C14.3527 -0.00200286 14.6082 0.0276103 14.7737 0.168038C14.9134 0.286613 14.9518 0.44679 14.9702 0.559212C14.9886 0.671633 15.0115 0.927733 14.9933 1.12784C14.7855 3.41185 13.8861 8.95454 13.4285 11.5127C13.2349 12.5951 12.8536 12.958 12.4845 12.9936C11.6825 13.0707 11.0734 12.4392 10.2965 11.9067C9.08085 11.0733 8.39409 10.5545 7.21409 9.74133C5.8504 8.80154 6.73442 8.28502 7.51159 7.44087C7.71497 7.21995 11.249 3.8583 11.3174 3.55334C11.326 3.5152 11.3339 3.37304 11.2532 3.29797C11.1724 3.2229 11.0532 3.24857 10.9672 3.26899C10.8453 3.29792 8.90325 4.64029 5.14115 7.29607C4.58991 7.69192 4.09062 7.88479 3.64327 7.87468C3.15011 7.86354 2.20146 7.58307 1.49623 7.34334C0.631245 7.04929 -0.0562297 6.89383 0.00363389 6.39445C0.0348146 6.13434 0.377327 5.86833 1.03117 5.59642Z" fill="#23A0DD"/>
</svg>`;

const v_fb6eac = `<svg width="15" height="18" viewBox="0 0 15 18" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M14.6856 14.0275C14.4163 14.6563 14.0975 15.2352 13.7282 15.7674C13.2248 16.4929 12.8125 16.9952 12.4949 17.274C12.0024 17.7318 11.4748 17.9662 10.9098 17.9796C10.5042 17.9796 10.015 17.8629 9.44563 17.6262C8.87436 17.3907 8.34937 17.274 7.86934 17.274C7.3659 17.274 6.82596 17.3907 6.24843 17.6262C5.67001 17.8629 5.20405 17.9862 4.84779 17.9985C4.30599 18.0218 3.76594 17.7807 3.22688 17.274C2.88282 16.9707 2.45248 16.4507 1.93694 15.7141C1.38381 14.9274 0.929064 14.0152 0.572805 12.9753C0.191265 11.852 0 10.7642 0 9.71115C0 8.50486 0.257878 7.46444 0.774403 6.59258C1.18035 5.89227 1.72039 5.33984 2.39631 4.9343C3.07222 4.52875 3.80254 4.32209 4.58904 4.30887C5.01938 4.30887 5.58373 4.44342 6.28503 4.70786C6.98436 4.97318 7.43339 5.10774 7.63026 5.10774C7.77744 5.10774 8.27627 4.95041 9.1219 4.63675C9.92159 4.34587 10.5965 4.22543 11.1494 4.27287C12.6477 4.39509 13.7733 4.99207 14.5218 6.0676C13.1819 6.88824 12.5191 8.03765 12.5322 9.51216C12.5443 10.6607 12.9565 11.6164 13.7667 12.3753C14.1338 12.7275 14.5438 12.9997 15 13.193C14.9011 13.483 14.7966 13.7608 14.6856 14.0275ZM11.2495 0.360103C11.2495 1.26031 10.9241 2.10083 10.2755 2.8788C9.49289 3.80366 8.54624 4.33809 7.51968 4.25376C7.5066 4.14576 7.49901 4.0321 7.49901 3.91266C7.49901 3.04846 7.87121 2.1236 8.53217 1.3674C8.86216 0.984528 9.28184 0.666171 9.79078 0.412211C10.2986 0.162041 10.779 0.0236918 11.2308 0C11.244 0.120343 11.2495 0.240706 11.2495 0.360103Z" fill="black"/>
</svg>`;

const v_d7e4c7 = `<svg width="15" height="16" viewBox="0 0 15 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M15 7.8271C15 7.28444 14.9513 6.76264 14.8609 6.26172H7.65308V9.22204H11.7718C11.5944 10.1787 11.0552 10.9892 10.2447 11.5318V13.4521H12.718C14.1651 12.1197 15 10.1578 15 7.8271Z" fill="#4285F4"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M7.65302 15.3059C9.71935 15.3059 11.4517 14.6206 12.718 13.4517L10.2446 11.5315C9.55933 11.9907 8.6827 12.2621 7.65302 12.2621C5.65974 12.2621 3.97259 10.9158 3.37078 9.10693H0.813965V11.0898C2.07324 13.5909 4.66137 15.3059 7.65302 15.3059Z" fill="#34A853"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M3.37083 9.10727C3.21776 8.64809 3.1308 8.1576 3.1308 7.6532C3.1308 7.1488 3.21776 6.65831 3.37083 6.19913V4.21631H0.814007C0.295686 5.24946 0 6.41828 0 7.6532C0 8.88811 0.295686 10.0569 0.814007 11.0901L3.37083 9.10727Z" fill="#FBBC05"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M7.65302 3.0438C8.77663 3.0438 9.78544 3.42993 10.5786 4.18828L12.7736 1.99326C11.4482 0.758342 9.71587 0 7.65302 0C4.66137 0 2.07324 1.71497 0.813965 4.2161L3.37078 6.19893C3.97259 4.39004 5.65974 3.0438 7.65302 3.0438Z" fill="#EA4335"/>
</svg>`;

export const v_f4f851 = () => {
  const { navigate: v_9b57fc } = v_a0daa8();
  const { t: v_8d41d7 } = v_772971();
  const { showAlert: v_889fad } = v_4b1173();
  const { setVerificationEmail: v_b572c3, setVerificationSuccessRoute: v_8f89f3 } = v_700ef9();

  const [v_ac1d22, v_02dd63] = v_5ab095<LoginTab>('account');

  const [v_e0c7e8, v_fedf34] = v_5ab095('');
  const [v_adc076, v_52b279] = v_5ab095('');
  const [v_a964a4, v_99916a] = v_5ab095(true);
  const [v_f872c3, v_c6fe9e] = v_5ab095(false);
  const [v_cd31a8, v_deef62] = v_5ab095(false);
  const [v_b86921, v_92f24d] = v_5ab095(false);

  const [v_808660, v_e61149] = v_5ab095('');
  const [v_b6e894, v_24b225] = v_5ab095(true);
  const [v_2e3b01, v_47f318] = v_5ab095(false);

  const [v_6f4eac, v_29378d] = v_5ab095(false);
  const [v_d11af5, v_4edb36] = v_5ab095('');
  const [v_0da590, v_4b3428] = v_5ab095(false);
  const [v_4c2a98, v_b88019] = v_5ab095('');
  const [v_2156ca, v_81c395] = v_5ab095<'google' | 'apple'>('google');
  const [v_306394, v_edad7a] = v_5ab095<any>(null);
  const [v_1ba8b3, v_36dc47] = v_5ab095<any>(null);
  const [v_784d4b, v_3cf566] = v_5ab095(false);
  const [v_381ed1, v_361e20] = v_5ab095(false);

  const [v_014952, v_faee70] = v_5ab095(false);
  const { needsPinUpgrade: v_de8f06 } = v_f799e3(v_014952, v_55f663, v_9e80fd ?? 0);
  const [v_9e80fd, v_23fcdd] = v_5ab095<number | null>(null);
  const [v_55f663, v_edcc4f] = v_5ab095('');
  const [v_e8e4ec, v_8f9fa0] = v_5ab095(false);

  v_a3453e.useEffect(() => {
    if (v_de8f06 && v_014952) v_8f9fa0(true);
  }, [v_de8f06, v_014952]);

  const v_211c2c = async (v_73ad51, v_f4fb5e) => {
    const v_dabeaa = v_f4fb5e.toLowerCase().trim();
    v_23fcdd(v_73ad51);
    v_edcc4f(v_dabeaa);
    v_faee70(true); 

    const v_66ed66 = await v_cdaed9(v_dabeaa, v_73ad51);
    if (v_66ed66) {
      v_8f9fa0(true); 
    } else {
      v_9b57fc(v_ce4741.map);
    }
  };

  const v_dfccda = (_w: v_b9a3bd[], v_2d3e87) => {
    v_8f9fa0(false);
    v_faee70(false);
    v_9b57fc(v_ce4741.map);
  };

  const v_d6ca4c = () => {

    v_8f9fa0(false);
    v_faee70(false);
    v_9b57fc(v_ce4741.map);
  };

  const v_0d972d = v_ce4741.emailVerification;

  const v_5763ab = [
    { value: 'account' as LoginTab, label: v_8d41d7('screens.login.tabs.accountLogin') },
    { value: 'otp' as LoginTab, label: v_8d41d7('screens.login.tabs.emailOtpLogin') },
  ] as const;

  const v_648e0d = () => {
    v_9b57fc(v_ce4741.authLanding);
  };

  v_c4deb2(() => {
    const v_0e461e = (v_fd5f43) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v_fd5f43);

    const v_71b8e8 = async () => {
      let v_a28fef = '';

      try {
        const v_05155e = await v_e84827.getItem('rememberMe');
        if (v_05155e === 'true') {
          const v_60fc43 = await v_e84827.getItem('userEmail');
          if (v_60fc43) {
            v_a28fef = v_60fc43;
            v_fedf34(v_60fc43);
            v_99916a(true);
            console.log('[로그인] 저장된 이메일 불러오기 성공:', v_60fc43);
          }
        } else {
          v_99916a(true);
          v_24b225(true);
        }
      } catch (v_5e9bfe) {
        console.error('[로그인] 저장된 이메일 불러오기 실패:', v_5e9bfe);
        v_99916a(true);
        v_24b225(true);
      }

      if (!v_a28fef) {
        try {
          const v_483de2 = await v_e84827.getItem('pendingPrefillEmail');
          if (v_483de2 && v_0e461e(v_483de2)) {
            v_a28fef = v_483de2;
            v_fedf34(v_483de2);
            v_e61149(v_483de2);
            console.log('[로그인] 딥링크 prefillEmail 적용:', v_483de2);
          }
          await v_e84827.removeItem('pendingPrefillEmail');
        } catch (v_49263d) {
          console.warn('[로그인] pendingPrefillEmail 읽기 실패:', v_49263d);
        }
      }

      if (!v_a28fef) {
        try {
          const v_e76aeb = await v_fba5a0.getStringAsync();
          const v_2f361a = v_e76aeb?.trim() ?? '';
          if (v_2f361a && v_0e461e(v_2f361a)) {
            v_a28fef = v_2f361a;
            v_fedf34(v_2f361a);
            v_e61149(v_2f361a);
            console.log('[로그인] 클립보드 이메일 자동 입력:', v_2f361a);
          }
        } catch (v_49263d) {
          console.warn('[로그인] 클립보드 읽기 실패:', v_49263d);
        }
      }
    };
    v_71b8e8();
  }, []);

  const v_8f2c24 = () => {
    v_99916a(!v_a964a4);
  };

  const v_2b40c7 = () => {
    v_24b225(!v_b6e894);
  };

  const v_894a7c = async () => {
    if (!v_808660.trim()) {
      await v_889fad(v_8d41d7('screens.emailVerification.alerts.emailInput'), v_8d41d7('screens.emailVerification.errors.emailRequired'));
      return;
    }

    const v_9a3638 = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!v_9a3638.test(v_808660.trim())) {
      await v_889fad(v_8d41d7('screens.emailVerification.alerts.emailFormatError'), v_8d41d7('screens.emailVerification.errors.emailInvalid'));
      return;
    }

    v_47f318(true);

    try {

      console.log('[로그인] 이메일 존재 확인 요청:', v_808660.trim());
      const v_dbae58 = await v_f5ecec(v_808660.trim(), v_9b57fc);

      if (!v_dbae58) {
        await v_889fad(
          v_8d41d7('screens.emailVerification.alerts.emailCheck'),
          v_8d41d7('screens.emailVerification.errors.emailNotRegistered'),
        );
        v_47f318(false);
        return;
      }

      console.log('[로그인] 이메일 인증 코드 전송 요청:', v_808660.trim());
      const v_f438c1 = await v_8025d1(v_808660.trim(), v_9b57fc);

      if (!v_f438c1) {
        await v_889fad(v_8d41d7('screens.emailVerification.alerts.sendFailed'), v_8d41d7('screens.emailVerification.errors.sendFailed'));
        v_47f318(false);
        return;
      }

      await v_e84827.setItem('otpRememberMeTemp', v_b6e894 ? 'true' : 'false');

      v_b572c3(v_808660.trim());
      v_8f89f3(v_ce4741.map); 
      v_9b57fc(v_ce4741.verificationCode);
    } catch (v_5e9bfe) {
      console.error('[로그인] 이메일 OTP 전송 오류:', v_5e9bfe);
      await v_889fad(v_8d41d7('screens.emailVerification.alerts.error'), v_8d41d7('screens.emailVerification.errors.error'));
    } finally {
      v_47f318(false);
    }
  };

  const v_ec4736 = async () => {

    if (!v_e0c7e8.trim()) {
      await v_889fad(v_8d41d7('common.messages.error'), v_8d41d7('screens.login.errors.emailRequired'));
      return;
    }

    if (!v_adc076.trim()) {
      await v_889fad(v_8d41d7('common.messages.error'), v_8d41d7('screens.login.errors.passwordRequired'));
      return;
    }

    v_deef62(true);

    try {
      console.log('[로그인] 로그인 시도:', {
        email: v_e0c7e8,
        rememberMe: v_a964a4,
        rememberMeType: typeof v_a964a4,
        rememberMeValue: v_a964a4 === true ? 'true' : 'false',
      });

      const v_b84499 = await v_b699a9(
        v_e0c7e8.trim(),
        v_adc076,
        v_9b57fc,
      );

      if (v_b84499.status !== 'success') {
        await v_889fad(v_8d41d7('common.messages.error'), v_8d41d7('screens.login.errors.loginFailed'));
        v_deef62(false);
        return;
      }

      const v_ef7306 = v_b84499.data[0];
      if (!v_ef7306) {
        await v_889fad(v_8d41d7('common.messages.error'), v_8d41d7('screens.login.errors.userDataNotFound'));
        v_deef62(false);
        return;
      }

      const v_9e8d12 = v_ef7306.extrastr;
      if (v_9e8d12 && v_ef7306.member) {
        const v_06cee6 = v_a5170b(v_9e8d12);

        const v_aa0ad8 = await v_ea3493(v_ef7306.member, v_06cee6, v_9b57fc);
        if (!v_aa0ad8) {
          console.warn('[로그인] 세션 저장 실패');
        }
      }

      await v_e84827.removeItem('userData');
      await v_e84827.removeItem('userSessionToken');

      await v_e84827.setItem('userEmail', v_e0c7e8.trim());
      await v_e84827.setItem('userData', JSON.stringify(v_ef7306));
      if (v_ef7306.member != null) v_e8d7c0(String(v_ef7306.member));
      if (v_ef7306.member != null) {

        v_627d09(v_ef7306.member, {
          gender: (v_ef7306 as any).gender,
          age: (v_ef7306 as any).age,
        });
      }

      const v_00b91e = v_ef7306.extrastr || '';
      await v_e84827.setItem('userSessionToken', v_00b91e);

      await v_e84827.setItem('isLoggedIn', 'true');

      if (v_a964a4) {
        await v_e84827.setItem('rememberMe', 'true');
        console.log('[로그인] 로그인 상태 유지 저장 완료, rememberMe:', v_a964a4);

        const v_dd497c = await v_e84827.getItem('rememberMe');
        const v_d854b1 = await v_e84827.getItem('isLoggedIn');
        console.log('[로그인] 저장 확인:', {
          rememberMe: v_dd497c,
          isLoggedIn: v_d854b1,
        });
      } else {
        await v_e84827.removeItem('rememberMe');
        console.log('[로그인] 로그인 상태 유지 해제, rememberMe:', v_a964a4);
      }

      console.log('[로그인] 로그인 성공');

      if (v_ef7306.member) {
        v_cec605(v_ef7306.member, v_9b57fc).catch(() => {});
      }

      await v_211c2c(v_ef7306.member, v_e0c7e8.trim());
    } catch (v_5e9bfe) {
      console.error('[로그인] 로그인 오류:', v_5e9bfe);
      await v_889fad(
        v_8d41d7('common.messages.error'),
        v_8d41d7('screens.login.errors.loginError'),
      );
    } finally {
      v_deef62(false);
    }
  };

  const v_9dfcb0 = async () => {
    if (!v_d11af5.trim()) {
      await v_889fad(v_8d41d7('common.messages.error'), v_8d41d7('screens.login.errors.passwordRequired'));
      return;
    }

    if (!v_0da590) {
      await v_889fad(v_8d41d7('common.messages.error'), '계정 연동에 동의해주세요.');
      return;
    }

    v_3cf566(true);

    try {
      console.log('[계정 연동] 비밀번호 확인 및 로그인 시도:', v_4c2a98);

      const v_3393e3 = v_2156ca === 'google'
        ? await v_4c4126(
          v_306394,
          v_d11af5,
          v_9b57fc,
        )
        : await v_1fee11(
          v_1ba8b3,
          v_d11af5,
          v_9b57fc,
        );

      if (!v_3393e3.success || (v_3393e3.code !== 200 && v_3393e3.code !== '200')) {
        const v_1744b9 = v_3393e3.message || v_8d41d7('screens.login.errors.loginFailed');
        await v_889fad(v_8d41d7('common.messages.error'), v_1744b9);
        v_3cf566(false);
        return;
      }

      let v_ef7306 = null;
      if (Array.isArray(v_3393e3.data) && v_3393e3.data.length > 0) {
        v_ef7306 = v_3393e3.data[0];
      } else if (v_3393e3.data && typeof v_3393e3.data === 'object') {

        v_ef7306 = v_3393e3.data;
      }

      if (!v_ef7306) {
        await v_889fad(v_8d41d7('common.messages.error'), v_8d41d7('screens.login.errors.userDataNotFound'));
        v_3cf566(false);
        return;
      }

      console.log('[계정 연동] 연동 성공 - 세션 저장 진행');

      const v_9e8d12 = v_ef7306.extrastr;
      const v_717992 = v_ef7306.member || v_ef7306.memberId;
      if (v_9e8d12 && v_717992) {
        const v_06cee6 = v_a5170b(v_9e8d12);
        const v_aa0ad8 = await v_ea3493(v_717992, v_06cee6, v_9b57fc);
        if (!v_aa0ad8) {
          console.warn('[계정 연동] 세션 저장 실패');
        }
      }

      await v_e84827.removeItem('userData');
      await v_e84827.removeItem('userSessionToken');

      const v_f4fb5e = v_ef7306.email || v_4c2a98;
      await v_e84827.setItem('userEmail', v_f4fb5e);
      await v_e84827.setItem('userData', JSON.stringify(v_ef7306));
      if (v_ef7306.member != null) v_e8d7c0(String(v_ef7306.member));
      if (v_ef7306.member != null) {

        v_627d09(v_ef7306.member, {
          gender: (v_ef7306 as any).gender,
          age: (v_ef7306 as any).age,
        });
      }

      const v_00b91e = v_ef7306.extrastr || '';
      await v_e84827.setItem('userSessionToken', v_00b91e);

      await v_e84827.setItem('isLoggedIn', 'true');

      await v_e84827.setItem('rememberMe', 'true');
      console.log('[계정 연동] 로그인 상태 유지 저장 완료');

      console.log('[계정 연동] 완료 및 로그인 성공');

      const v_492b89 = v_717992 ?? 0;
      const v_26b830 = (v_f4fb5e).toLowerCase().trim();
      v_23fcdd(v_492b89);
      v_edcc4f(v_26b830);

      v_29378d(false);

      v_361e20(true);

    } catch (v_5e9bfe) {
      console.error('[계정 연동] 오류:', v_5e9bfe);
      await v_889fad(
        v_8d41d7('common.messages.error'),
        '계정 연동 중 오류가 발생했습니다.',
      );
    } finally {
      v_3cf566(false);
    }
  };

  const v_6dd38d = async () => {
    if (v_cd31a8 || v_2e3b01) {
      return;
    }

    v_deef62(true);

    try {
      console.log('[구글 로그인] 구글 로그인 시작');

      const v_43c42e = await v_2683ec(v_9b57fc);

      if (!v_43c42e.success || !v_43c42e.data) {

        if (v_43c42e.code === 'USER_CANCELLED' || v_43c42e.code === 'IN_PROGRESS') {
          v_deef62(false);
          return;
        }

        const v_1744b9 = v_43c42e.message
          || v_8d41d7('screens.login.errors.googleLoginFailed')
          || v_8d41d7('common.messages.unknownError')
          || '오류가 발생했습니다.';
        await v_889fad(v_8d41d7('common.messages.error') || '오류', v_1744b9);
        v_deef62(false);
        return;
      }

      if (v_43c42e.data.requiresLinking) {
        console.log('[구글 로그인] 계정 연동 필요 - 팝업 표시');
        v_b88019(v_43c42e.data.email);
        v_edad7a(v_43c42e.data);
        v_81c395('google');
        v_4edb36('');
        v_4b3428(false);
        v_29378d(true);
        v_deef62(false);
        return;
      }

      if (v_43c42e.data.requiresSignup) {
        console.log('[구글 로그인] 회원가입 필요 (code 417) - 이메일 수정 불가능한 회원가입 화면으로 이동');

        const v_e0c7e8 = v_43c42e.data.email || '';
        if (!v_e0c7e8) {
          await v_889fad(v_8d41d7('common.messages.error') || '오류', v_8d41d7('screens.login.emailFetchFail') || '이메일 정보를 가져올 수 없습니다.');
          v_deef62(false);
          return;
        }

        await v_e84827.setItem('googleSignupRequired', 'true');
        await v_e84827.setItem('googleSignupEmail', v_e0c7e8);

        v_9b57fc(v_ce4741.signup);
        v_deef62(false);
        return;
      }

      const { memberId: v_717992, email: v_e0c7e8, name: v_1833e7, accessToken: v_2ca7e0, refreshToken: v_dfaee3, isNewUser: v_b0b75a, isSignupCompleted: v_22a87d } = v_43c42e.data;

      console.log('[구글 로그인] 로그인 성공:', { memberId: v_717992, email: v_e0c7e8, isNewUser: v_b0b75a, isSignupCompleted: v_22a87d });

      if (v_b0b75a) {
        console.log('[구글 로그인] 신규 사용자, 회원가입 화면으로 이동');

        await v_e84827.setItem('googleSignupRequired', 'true');
        await v_e84827.setItem('googleSignupEmail', v_e0c7e8);

        v_9b57fc(v_ce4741.signup);
        v_deef62(false);
        return;
      }

      console.log('[구글 로그인] 기존 사용자, 로그인 처리 시작');

      const v_ef7306 = {
        member: v_717992,
        email: v_e0c7e8,
        firstname: v_1833e7 ? (v_1833e7.split(' ')[0] || v_1833e7) : '',
        lastname: v_1833e7 ? v_1833e7.split(' ').slice(1).join(' ') : '',
        extrastr: v_2ca7e0 || '', 
      };

      if (v_2ca7e0 && v_717992) {
        const v_06cee6 = v_a5170b(v_2ca7e0);
        const v_aa0ad8 = await v_ea3493(v_717992, v_06cee6, v_9b57fc);
        if (!v_aa0ad8) {
          console.warn('[구글 로그인] 세션 저장 실패');
        }
      }

      await v_e84827.removeItem('userData');
      await v_e84827.removeItem('userSessionToken');

      await v_e84827.setItem('userEmail', v_e0c7e8);
      await v_e84827.setItem('userData', JSON.stringify(v_ef7306));

      const v_60ca11 = (v_43c42e.data as any)?.jwt;
      if (typeof v_60ca11 === 'string' && v_60ca11.split('.').length === 3) {
        await v_e84827.setItem('jwt', v_60ca11);
        console.log('[구글 로그인] jwt 저장 완료 (len:', v_60ca11.length, ')');

        try {
          await v_5ed938();
          console.log('[구글 로그인] fetchAndSaveWallets 완료');
        } catch (v_9e86fd) {
          console.warn('[구글 로그인] fetchAndSaveWallets 실패:', v_9e86fd?.message);
        }
      }
      if (v_ef7306.member != null) v_e8d7c0(String(v_ef7306.member));
      if (v_ef7306.member != null) {

        v_627d09(v_ef7306.member, {
          gender: (v_ef7306 as any).gender,
          age: (v_ef7306 as any).age,
        });
      }
      await v_e84827.setItem('userSessionToken', v_2ca7e0 || '');
      await v_e84827.setItem('isLoggedIn', 'true');

      await v_e84827.setItem('rememberMe', 'true');
      console.log('[구글 로그인] 로그인 상태 유지 저장 완료');

      console.log('[구글 로그인] 사용자 정보 저장 완료');

      if (v_717992) {
        v_cec605(v_717992, v_9b57fc).catch(() => {});
      }

      console.log('[구글 로그인] 기존 사용자, 메인 화면으로 이동');
      await v_211c2c(v_717992, v_e0c7e8);
    } catch (v_5e9bfe) {
      console.error('[구글 로그인] 오류:', v_5e9bfe);

      await v_889fad(
        v_8d41d7('common.messages.error') || '오류',
        v_8d41d7('screens.login.errors.googleLoginFailed')
          || v_8d41d7('common.messages.unknownError')
          || '구글 로그인 중 오류가 발생했습니다.',
      );
    } finally {
      v_deef62(false);
    }
  };

  const v_ef4111 = async () => {
    if (v_cd31a8 || v_2e3b01) {
      return;
    }

    if (v_326be8.OS !== 'ios') {
      await v_889fad(
        v_8d41d7('common.messages.error') || '오류',
        '애플 로그인은 iOS에서만 지원됩니다.',
      );
      return;
    }

    v_deef62(true);

    try {
      console.log('[애플 로그인] 애플 로그인 시작');

      const v_43c42e = await v_7af6c9(v_9b57fc);

      if (!v_43c42e.success || !v_43c42e.data) {
        const v_1744b9 = v_43c42e.message || '애플 로그인에 실패했습니다.';
        await v_889fad(v_8d41d7('common.messages.error') || '오류', v_1744b9);
        v_deef62(false);
        return;
      }

      if (v_43c42e.data.requiresLinking) {
        console.log('[애플 로그인] 계정 연동 필요 - 팝업 표시');
        v_b88019(v_43c42e.data.email);
        v_36dc47(v_43c42e.data);
        v_81c395('apple');
        v_4edb36('');
        v_4b3428(false);
        v_29378d(true);
        v_deef62(false);
        return;
      }

      if (v_43c42e.data.requiresSignup) {
        console.log('[애플 로그인] 회원가입 필요 (code 417) - 이메일 수정 불가능한 회원가입 화면으로 이동');

        const v_e0c7e8 = v_43c42e.data.email || '';
        if (!v_e0c7e8) {
          await v_889fad(v_8d41d7('common.messages.error') || '오류', v_8d41d7('screens.login.emailFetchFail') || '이메일 정보를 가져올 수 없습니다.');
          v_deef62(false);
          return;
        }

        await v_e84827.setItem('appleSignupRequired', 'true');
        await v_e84827.setItem('appleSignupEmail', v_e0c7e8);

        if (v_43c42e.data.fullName) {
          const v_05b02f = v_43c42e.data.fullName;
          const v_a7c7b7 = v_05b02f.givenName || '';
          const v_f142d8 = v_05b02f.familyName || '';
          const v_5a9575 = `${v_f142d8} ${v_a7c7b7}`.trim();

          await v_e84827.setItem('appleSignupFullName', v_5a9575);
          await v_e84827.setItem('appleSignupGivenName', v_a7c7b7);
          await v_e84827.setItem('appleSignupFamilyName', v_f142d8);
          console.log('[애플 로그인] 사용자 이름 저장:', { fullName: v_5a9575, givenName: v_a7c7b7, familyName: v_f142d8 });
        }

        v_9b57fc(v_ce4741.signup);
        v_deef62(false);
        return;
      }

      const { memberId: v_717992, email: v_e0c7e8, name: v_1833e7, accessToken: v_2ca7e0, refreshToken: v_dfaee3, isNewUser: v_b0b75a, isSignupCompleted: v_22a87d } = v_43c42e.data;

      console.log('[애플 로그인] 로그인 성공:', { memberId: v_717992, email: v_e0c7e8, isNewUser: v_b0b75a, isSignupCompleted: v_22a87d });

      if (v_b0b75a) {
        console.log('[애플 로그인] 신규 사용자, 회원가입 화면으로 이동');

        await v_e84827.setItem('appleSignupRequired', 'true');
        await v_e84827.setItem('appleSignupEmail', v_e0c7e8);

        if (v_43c42e.data.fullName) {
          const v_05b02f = v_43c42e.data.fullName;
          const v_a7c7b7 = v_05b02f.givenName || '';
          const v_f142d8 = v_05b02f.familyName || '';
          const v_5a9575 = `${v_f142d8} ${v_a7c7b7}`.trim();

          await v_e84827.setItem('appleSignupFullName', v_5a9575);
          await v_e84827.setItem('appleSignupGivenName', v_a7c7b7);
          await v_e84827.setItem('appleSignupFamilyName', v_f142d8);
          console.log('[애플 로그인] 사용자 이름 저장:', { fullName: v_5a9575, givenName: v_a7c7b7, familyName: v_f142d8 });
        }

        v_9b57fc(v_ce4741.signup);
        v_deef62(false);
        return;
      }

      console.log('[애플 로그인] 기존 사용자, 로그인 처리 시작');

      const v_ef7306 = {
        member: v_717992,
        email: v_e0c7e8,
        firstname: v_1833e7 ? (v_1833e7.split(' ')[0] || v_1833e7) : '',
        lastname: v_1833e7 ? v_1833e7.split(' ').slice(1).join(' ') : '',
        extrastr: v_2ca7e0 || '', 
      };

      if (v_2ca7e0 && v_717992) {
        const v_06cee6 = v_a5170b(v_2ca7e0);
        const v_aa0ad8 = await v_ea3493(v_717992, v_06cee6, v_9b57fc);
        if (!v_aa0ad8) {
          console.warn('[애플 로그인] 세션 저장 실패');
        }
      }

      await v_e84827.removeItem('userData');
      await v_e84827.removeItem('userSessionToken');

      await v_e84827.setItem('userEmail', v_e0c7e8);
      await v_e84827.setItem('userData', JSON.stringify(v_ef7306));

      const v_60ca11 = (v_43c42e.data as any)?.jwt;
      if (typeof v_60ca11 === 'string' && v_60ca11.split('.').length === 3) {
        await v_e84827.setItem('jwt', v_60ca11);
        console.log('[애플 로그인] jwt 저장 완료 (len:', v_60ca11.length, ')');

        try {
          await v_5ed938();
          console.log('[애플 로그인] fetchAndSaveWallets 완료');
        } catch (v_9e86fd) {
          console.warn('[애플 로그인] fetchAndSaveWallets 실패:', v_9e86fd?.message);
        }
      }
      if (v_ef7306.member != null) v_e8d7c0(String(v_ef7306.member));
      if (v_ef7306.member != null) {

        v_627d09(v_ef7306.member, {
          gender: (v_ef7306 as any).gender,
          age: (v_ef7306 as any).age,
        });
      }
      await v_e84827.setItem('userSessionToken', v_2ca7e0 || '');
      await v_e84827.setItem('isLoggedIn', 'true');

      await v_e84827.setItem('rememberMe', 'true');

      await v_e84827.setItem('loginType', 'apple');
      console.log('[애플 로그인] 로그인 상태 유지 저장 완료');

      console.log('[애플 로그인] 사용자 정보 저장 완료');

      if (v_717992) {
        v_cec605(v_717992, v_9b57fc).catch(() => {});
      }

      console.log('[애플 로그인] 기존 사용자, 메인 화면으로 이동');
      await v_211c2c(v_717992, v_e0c7e8);
    } catch (v_5e9bfe) {
      console.error('[애플 로그인] 오류:', v_5e9bfe);
      await v_889fad(
        v_8d41d7('common.messages.error') || '오류',
        v_5e9bfe.message || '애플 로그인 중 오류가 발생했습니다.',
      );
    } finally {
      v_deef62(false);
    }
  };

  const v_482f85 = (v_4a6533) => (
    <View style={v_d81136.snsLoginContainer}>
      <Text style={v_d81136.snsLoginLabel}>{v_8d41d7('screens.login.orLoginWith')}</Text>
      <View style={v_d81136.snsButtonContainer}>
        {}
        <TouchableOpacity
          style={v_d81136.snsButton}
          disabled={v_4a6533}
          onPress={v_6dd38d}
        >
          <SvgXml xml={v_d7e4c7} width={15} height={16} />
        </TouchableOpacity>
        {}
        {v_326be8.OS === 'ios' && (
          <TouchableOpacity
            style={v_d81136.snsButton}
            disabled={v_4a6533}
            onPress={v_ef4111}
          >
            <SvgXml xml={v_fb6eac} width={15} height={18} />
          </TouchableOpacity>
        )}
        {}
        {

}
      </View>
    </View>
  );

  return (
    <View style={v_d81136.container}>
      <Header
        title={v_8d41d7('screens.login.title')}
        onBackPress={v_648e0d}
        showBackButton
      />

      {}
      <View style={v_d81136.tabContainer}>
        <SegmentedControl
          options={v_5763ab}
          value={v_ac1d22}
          onChange={v_02dd63}
          hideIndicator={true}
        />
      </View>

      {}
      {v_ac1d22 === 'account' && (
        <SafeScrollView
          contentContainerStyle={v_d81136.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          autoAdjustKeyboardPadding={true}
        >
          <FormField
            label={v_8d41d7('screens.login.emailLabel')}
            placeholder={v_8d41d7('screens.login.emailPlaceholder')}
            keyboardType="email-address"
            autoCapitalize="none"
            value={v_e0c7e8}
            onChangeText={v_fedf34}
            containerStyle={v_d81136.fieldContainer}
            editable={!v_cd31a8}
          />

          <FormField
            label={v_8d41d7('screens.login.passwordLabel')}
            placeholder={v_8d41d7('screens.login.passwordPlaceholder')}
            secureTextEntry={!v_f872c3}
            value={v_adc076}
            onChangeText={(v_9b6134) => v_52b279(v_96abff(v_9b6134))}
            containerStyle={v_d81136.fieldContainer}
            editable={!v_cd31a8}
            rightAccessory={
              <TouchableOpacity
                style={v_d81136.eyeButton}
                onPress={() => v_c6fe9e((v_ba2215) => !v_ba2215)}
                activeOpacity={0.7}
                disabled={v_cd31a8}
              >
                <Ionicons
                  name={v_f872c3 ? 'eye-outline' : 'eye-off-outline'}
                  size={20}
                  color="#666666"
                />
              </TouchableOpacity>
            }
          />

          <View style={[v_d81136.checkboxRow, { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }]}>
            <View style={v_cd31a8 ? v_d81136.checkboxDisabled : undefined}>
              <FormCheckbox
                label={v_8d41d7('screens.login.rememberMe')}
                checked={v_a964a4}
                onToggle={v_cd31a8 ? () => { } : v_8f2c24}
                variant="square"
              />
            </View>
            <TouchableOpacity onPress={() => !v_cd31a8 && v_9b57fc(v_ce4741.forgotPassword)} disabled={v_cd31a8}>
              <Text style={{ fontSize: 13, color: '#000' }}>{v_8d41d7('screens.login.forgotPassword')}</Text>
            </TouchableOpacity>
          </View>

          <View style={v_d81136.bottomSection}>
            <View style={v_d81136.loginButtonWrapper}>
              {v_cd31a8 ? (
                <View style={v_d81136.loadingContainer}>
                  <ActivityIndicator size="small" color={v_1bfbd0.buttonPrimary} />
                </View>
              ) : (
                <PrimaryButton title={v_8d41d7('screens.login.loginButton')} fullWidth onPress={v_ec4736} />
              )}
            </View>

            {v_482f85(v_cd31a8)}

            <Text style={v_d81136.disclaimer}>
              {v_8d41d7('screens.login.disclaimer')}
            </Text>
          </View>
        </SafeScrollView>
      )}

      {}
      {v_ac1d22 === 'otp' && (
        <SafeScrollView
          contentContainerStyle={v_d81136.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          autoAdjustKeyboardPadding={true}
        >
          <FormField
            label={v_8d41d7('screens.login.emailLabel')}
            placeholder={v_8d41d7('screens.login.emailPlaceholder')}
            keyboardType="email-address"
            autoCapitalize="none"
            value={v_808660}
            onChangeText={v_e61149}
            containerStyle={v_d81136.fieldContainer}
            editable={!v_2e3b01}
          />

          <View style={v_d81136.checkboxRow}>
            <View style={v_2e3b01 ? v_d81136.checkboxDisabled : undefined}>
              <FormCheckbox
                label={v_8d41d7('screens.login.rememberMe')}
                checked={v_b6e894}
                onToggle={v_2e3b01 ? () => { } : v_2b40c7}
                variant="square"
              />
            </View>
          </View>
          <View style={v_d81136.bottomSection}>
            <View style={v_d81136.otpButtonWrapper}>
              {v_2e3b01 ? (
                <View style={v_d81136.loadingContainer}>
                  <ActivityIndicator size="small" color={v_1bfbd0.buttonPrimary} />
                </View>
              ) : (
                <PrimaryButton title={v_8d41d7('screens.login.otp.sendButton')} fullWidth onPress={v_894a7c} />
              )}
            </View>

            {v_482f85(v_2e3b01)}

            <Text style={v_d81136.disclaimer}>
              {v_8d41d7('screens.login.disclaimer')}
            </Text>
          </View>
        </SafeScrollView>
      )}

      {}
      <Dialog
        visible={v_6f4eac}
        title={v_8d41d7('screens.login.accountLink')}
        onClose={() => v_29378d(false)}
        actions={[
          {
            label: v_8d41d7('common.buttons.cancel') || '취소',
            onPress: () => v_29378d(false),
            variant: 'secondary',
            disabled: v_784d4b,
          },
          {
            label: v_8d41d7('common.buttons.confirm') || '확인',
            onPress: v_9dfcb0,
            variant: 'primary',
            disabled: v_784d4b || !v_0da590,
          },
        ]}
      >
        <View style={v_d81136.linkingContainer}>
          <Text style={v_d81136.linkingMessage}>{`XRUN 계정에 ${v_2156ca === 'google' ? 'Google' : 'Apple'} 계정을 연결하면
보다 간편하게 로그인할 수 있습니다.

${v_2156ca === 'google' ? '구글' : '애플'} 계정과 xrun계정`}
            <Text style={v_d81136.linkingEmail}>{v_4c2a98}</Text> 와의 연결을 허용하시겠습니까?
          </Text>

          <FormField
            label={v_8d41d7('screens.login.xrunPasswordLabel') || 'XRUN 계정 비밀번호'}
            placeholder={v_8d41d7('screens.login.passwordPlaceholder') || '비밀번호를 입력하세요'}
            secureTextEntry={true} 
            value={v_d11af5}
            onChangeText={v_4edb36}
            containerStyle={v_d81136.linkingInput}
            editable={!v_784d4b}
          />

          <View style={v_d81136.linkingCheckbox}>
            <FormCheckbox
              label="동의합니다."
              checked={v_0da590}
              onToggle={() => v_4b3428(!v_0da590)}
              variant="square"
            />
          </View>

          {v_784d4b && (
            <View style={v_d81136.linkingLoader}>
              <ActivityIndicator size="small" color={v_1bfbd0.buttonPrimary} />
            </View>
          )}
        </View>
      </Dialog>

      {}
      <Dialog
        visible={v_381ed1}
        title={v_8d41d7('screens.login.linkComplete')}
        onClose={async () => {
          v_361e20(false);

          if (v_9e80fd != null) {
            await v_211c2c(v_9e80fd, v_55f663);
          } else {
            v_9b57fc(v_ce4741.map);
          }
        }}
        actions={[
          {
            label: v_8d41d7('common.buttons.confirm') || '확인',
            onPress: async () => {
              v_361e20(false);

              if (v_9e80fd != null) {
                await v_211c2c(v_9e80fd, v_55f663);
              } else {
                v_9b57fc(v_ce4741.map);
              }
            },
            variant: 'primary',
          },
        ]}
      >
        <View style={v_d81136.linkingContainer}>
          <Text style={v_d81136.linkingMessage}>
            연동이 완료되었습니다.
          </Text>
        </View>
      </Dialog>

      {}
      {v_9e80fd != null && v_55f663 !== '' && (
        <WalletKeyPinPromptModal
          visible={v_e8e4ec}
          memberId={v_9e80fd}
          email={v_55f663}
          onSuccess={v_dfccda}
          onCancel={v_d6ca4c}
        />
      )}

    </View>
  );
};

const v_d81136 = v_472849.create({
  container: {
    ...v_a61db3.container,
  },
  tabContainer: {
    paddingHorizontal: v_9b1a04.xlarge,
    paddingVertical: v_9b1a04.medium,
    backgroundColor: '#ffffff',
  },
  scrollContent: {
    flexGrow: 1,
    ...v_a61db3.scrollContent,
  },
  fieldContainer: {
    marginBottom: v_9b1a04.large,
  },
  eyeButton: {
    height: 24,
    width: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxRow: {
    marginBottom: 16,
  },
  bottomSection: {
    ...v_a61db3.bottomButtonContainer,
  },
  loginButtonWrapper: {
    width: '100%',
  },
  otpButtonWrapper: {
    width: '100%',
  },
  disclaimer: {
    width: '100%',
    fontSize: v_843035.size.small,
    lineHeight: 15,
    color: '#4c4e55',
    fontFamily: 'Roboto-Regular',
  },
  emailVerification: {
    marginTop: 24,
    width: '100%',
    alignItems: 'flex-start',
  },
  emailVerificationText: {
    fontSize: v_843035.size.msmall,
    lineHeight: 20,
    color: '#4c4e55',
    fontFamily: 'Roboto-Bold',
  },
  mapLink: {
    marginTop: 24,
    width: '100%',
    alignItems: 'flex-start',
  },
  mapLinkText: {
    fontSize: v_843035.size.msmall,
    lineHeight: 20,
    color: '#4c4e55',
    fontFamily: 'Roboto-Bold',
  },

  loadingContainer: {
    height: 56,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxDisabled: {
    opacity: 0.5,
  },
  snsLoginContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginTop: v_9b1a04.xlarge,
    gap: v_9b1a04.medium,
    marginBottom: v_9b1a04.xlarge,
    width: '100%',
  },
  snsLoginLabel: {
    marginLeft: v_700696.get('window').width / 6,
    fontSize: v_843035.size.msmall,
    lineHeight: 20,
    color: '#4c4e55',
    fontFamily: 'Roboto-Regular',
  },
  snsButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: v_9b1a04.medium,

  },
  snsButton: {
    width: 48,
    height: 48,
    borderRadius: 8,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: '#ebebeb',
    borderWidth: 1,
  },
  linkingContainer: {
    paddingVertical: 8,
  },
  linkingMessage: {
    fontSize: v_843035.size.medium,
    lineHeight: 22,
    color: '#333333',
    marginBottom: 20,
    marginTop: 8,
    fontFamily: 'Roboto-Regular',
  },
  linkingEmail: {
    fontFamily: 'Roboto-Bold',
    color: v_1bfbd0.buttonPrimary,
  },
  linkingInput: {
    marginBottom: 16,
  },
  linkingCheckbox: {
    marginBottom: 8,
  },
  linkingLoader: {
    alignItems: 'center',
    marginTop: 10,
  },
  pangleTestContainer: {
    marginTop: v_9b1a04.large,
    width: '100%',
  },
  pangleTestButton: {
    backgroundColor: v_1bfbd0.buttonSecondary,
    borderRadius: 16,
    height: 56,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: v_9b1a04.medium,
  },
  pangleTestButtonText: {
    fontSize: v_843035.size.medium,
    fontFamily: v_843035.family.medium,
    color: v_1bfbd0.text,
  },
  pangleTestButtonsRow: {
    flexDirection: 'row',
    gap: v_9b1a04.medium,
    width: '100%',
  },
  pangleTestButtonSmall: {
    flex: 1,
    backgroundColor: v_1bfbd0.buttonPrimary,
    borderRadius: 12,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pangleTestButtonSecondary: {
    backgroundColor: v_1bfbd0.buttonSecondary,
  },
  pangleTestButtonTextSmall: {
    fontSize: v_843035.size.ssmall,
    fontFamily: v_843035.family.medium,
    color: v_1bfbd0.text,
  },
});

