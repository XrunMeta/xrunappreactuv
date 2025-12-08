import v_a3453e, { v_c4deb2, v_df9f57, v_5ab095, v_e662ae } from 'bapkr';
import {
  v_3094a2,
  v_19b633,
  v_472849,
  v_4623af,
  v_326be8,
  v_39a996,
  v_79c4f2,
} from 'rcmrninabrnb';
import { v_b5df25 } from 'ernurodqvmtspux';
import { v_772971 } from 'jmpfvteuuztnp';
import v_e84827 from 'bkjbgtcoyuizqwgwtnaxmfkyvlqwevapsqmanbsnv';
import { v_729608, v_cb41de, v_570c34 } from '../components';
import { v_1bfbd0, v_a61db3, v_843035, v_9553a4, v_789afd } from '../constants';
import { v_ce4741, v_a0daa8 } from '../navigation';
import { v_700ef9 } from '../context';
import { v_4b1173 } from '../context/AlertDialogContext';
import {
  v_415628,
  v_a81308,
  v_a5170b,
  v_ea3493,
  v_8025d1,
  v_35200c,
  v_9d2541,
  v_91bb22,
} from '../services';

const v_683bb6 = 6;
const v_ef7132 = 300;

export const v_667a00 = () => {
  const { t: v_8d41d7 } = v_772971();
  const { goBack: v_c7ac57, reset: v_487a25, navigate: v_9b57fc } = v_a0daa8();
  const { showAlert: v_889fad } = v_4b1173();
  const {
    verificationSuccessRoute: v_e6976c,
    resetVerificationSuccessRoute: v_036f76,
    verificationEmail: v_fc0b2c,
  } = v_700ef9();
  const [v_c99bd2, v_537cbb] = v_5ab095('');
  const [v_ae68cd, v_83fe8f] = v_5ab095(v_ef7132);
  const [v_d1dd8f, v_ff0c7a] = v_5ab095(false);
  const [v_ff9533, v_f30c99] = v_5ab095(false);
  const v_56c646 = v_e662ae<v_79c4f2>(null);

  v_c4deb2(() => {
    if (v_ae68cd <= 0) {
      return;
    }
    const v_cb36b1 = setInterval(() => v_83fe8f((v_fd5f43) => v_fd5f43 - 1), 1000);
    return () => clearInterval(v_cb36b1);
  }, [v_ae68cd]);

  const v_8813df = v_df9f57(() => {
    const v_ef3543 = Math.floor(v_ae68cd / 60)
      .toString()
      .padStart(2, '0');
    const v_ec1a55 = (v_ae68cd % 60).toString().padStart(2, '0');
    return `${v_ef3543}:${v_ec1a55}`;
  }, [v_ae68cd]);

  const v_83b05b = async () => {
    if (!v_fc0b2c) {
      await v_889fad(v_8d41d7('screens.verificationCode.alerts.error'), v_8d41d7('screens.verificationCode.errors.emailNotFound'));
      return;
    }

    if (v_c99bd2.length !== v_683bb6) {
      await v_889fad(v_8d41d7('screens.verificationCode.alerts.codeInput'), v_8d41d7('screens.verificationCode.errors.codeRequired'));
      return;
    }

    v_ff0c7a(true);

    try {

      console.log('[인증] 이메일 인증 코드 확인 요청:', v_fc0b2c);
      const v_ac477d = await v_415628(v_fc0b2c, v_c99bd2, v_9b57fc);

      if (!v_ac477d) {
        await v_889fad(v_8d41d7('screens.verificationCode.alerts.verificationFailed'), v_8d41d7('screens.verificationCode.errors.verificationFailed'));
        v_ff0c7a(false);
        return;
      }

      if (v_e6976c === v_ce4741.signup) {

        console.log('[회원가입] 이메일 인증 완료 - 회원가입 진행');

        try {

          const v_378f94 = await v_e84827.getItem('pendingSignupData');
          if (!v_378f94) {
            await v_889fad(
              v_8d41d7('screens.verificationCode.alerts.error'),
              v_8d41d7('screens.verificationCode.errors.error') || '회원가입 데이터를 찾을 수 없습니다.',
            );
            v_ff0c7a(false);
            return;
          }

          const v_fad096 = JSON.parse(v_378f94);
          console.log('[회원가입] AsyncStorage에서 회원가입 데이터 읽기 완료');

          const v_6c3a47 = parseInt(v_fad096.selectedCountryDialCode.dialCode.replace('+', ''), 10) || 82;
          const v_a4d981 = v_fad096.selectedCountryDialCode.iso2 || 'KR';
          const v_94bdf5 = v_fad096.selectedRegion
            ? v_9553a4(v_fad096.selectedRegion.iso2)
            : parseInt(v_789afd.dialCode, 10);

          const v_df7dab = {
            email: v_fad096.email,
            pin: v_fad096.password,
            firstname: v_fad096.givenName,
            lastname: v_fad096.familyName,
            gender: v_91bb22.getGenderCode(v_fad096.gender),
            mobile: v_fad096.phoneNumber,
            mobilecode: v_6c3a47,
            countrycode: v_a4d981,
            country: v_6c3a47,
            region: v_94bdf5,
            age: v_91bb22.getAgeCode(v_fad096.ageRange),
            recommand: v_fad096.referralMemberId,
            os: v_91bb22.getOSCode(),
          };

          console.log('[회원가입] 회원가입 API 호출 시작');
          const v_d0b446 = await v_35200c(v_df7dab, v_9b57fc);

          if (!v_d0b446) {

            await v_e84827.removeItem('pendingSignupData');
            await v_889fad(
              v_8d41d7('screens.signup.alerts.signupFailed') || '회원가입 실패',
              v_8d41d7('screens.signup.errors.signupFailed') || '회원가입에 실패했습니다. 다시 시도해주세요.',
            );
            v_036f76();
            v_ff0c7a(false);
            return;
          }

          console.log('[회원가입] 로그인 확인 시작');
          const v_7e280a = await v_9d2541(v_fad096.email, v_fad096.password, v_9b57fc);

          if (!v_7e280a) {
            await v_889fad(
              v_8d41d7('screens.signup.alerts.loginCheckFailed') || '로그인 확인 실패',
              v_8d41d7('screens.signup.errors.loginCheckFailed') || '회원가입은 완료되었지만 로그인 확인에 실패했습니다. 로그인 화면에서 다시 시도해주세요.',
            );

            await v_e84827.removeItem('pendingSignupData');
            v_036f76();
            v_487a25(v_ce4741.authLanding);
            v_9b57fc(v_ce4741.login);
            v_ff0c7a(false);
            return;
          }

          await v_e84827.removeItem('pendingSignupData');
          console.log('[회원가입] 회원가입 및 로그인 확인 성공');

          v_036f76();
          await v_889fad(
            v_8d41d7('screens.signup.success.title') || '회원가입 완료',
            v_8d41d7('screens.signup.success.message') || '회원가입이 완료되었습니다.',
            [
              {
                text: v_8d41d7('screens.signup.success.confirm') || '확인',
                onPress: () => {
                  v_487a25(v_ce4741.authLanding);
                  v_9b57fc(v_ce4741.login);
                },
              },
            ],
          );
        } catch (v_5e9bfe) {
          console.error('[회원가입] 회원가입 처리 중 오류:', v_5e9bfe);
          await v_889fad(
            v_8d41d7('screens.signup.alerts.error') || '오류',
            v_8d41d7('screens.signup.errors.error') || '회원가입 중 오류가 발생했습니다.',
          );

          try {
            await v_e84827.removeItem('pendingSignupData');
          } catch (v_df17d5) {
            console.error('[회원가입] AsyncStorage 정리 실패:', v_df17d5);
          }
        } finally {
          v_ff0c7a(false);
        }
        return;
      }

      if (v_e6976c === v_ce4741.login || v_e6976c === v_ce4741.map) {

        console.log('[로그인] 이메일 로그인 요청:', v_fc0b2c);
        const v_b84499 = await v_a81308(v_fc0b2c, v_9b57fc);

        if (v_b84499.status !== 'success') {
          await v_889fad(v_8d41d7('screens.verificationCode.alerts.loginFailed'), v_8d41d7('screens.verificationCode.errors.loginFailed'));
          v_ff0c7a(false);
          return;
        }

        const v_ef7306 = v_b84499.data[0];
        if (!v_ef7306 || !v_ef7306.member) {
          await v_889fad(v_8d41d7('screens.verificationCode.alerts.loginFailed'), v_8d41d7('screens.verificationCode.errors.userDataNotFound'));
          v_ff0c7a(false);
          return;
        }

        const v_9e8d12 = v_ef7306.extrastr;
        if (v_9e8d12) {
          const v_06cee6 = v_a5170b(v_9e8d12);
          const v_aa0ad8 = await v_ea3493(v_ef7306.member, v_06cee6, v_9b57fc);
          if (!v_aa0ad8) {
            console.warn('[로그인] 세션 저장 실패');
          }
        }

        await v_e84827.removeItem('userData');
        await v_e84827.removeItem('userSessionToken');
        await v_e84827.setItem('userEmail', v_fc0b2c);
        await v_e84827.setItem('userData', JSON.stringify(v_ef7306));
        const v_00b91e = v_ef7306.extrastr || '';
        await v_e84827.setItem('userSessionToken', v_00b91e);
        await v_e84827.setItem('isLoggedIn', 'true');

        console.log('[로그인] 이메일 인증 로그인 성공');

        v_036f76();
        v_487a25(v_e6976c || v_ce4741.map);
      } else {

        console.log('[정보수정] 인증 코드 확인 성공');
        v_036f76();
        v_487a25(v_e6976c);
      }
    } catch (v_5e9bfe) {
      console.error('[인증] 인증 코드 확인 오류:', v_5e9bfe);

      if (v_e6976c === v_ce4741.signup) {
        try {
          await v_e84827.removeItem('pendingSignupData');
          console.log('[인증] 에러 발생으로 인한 AsyncStorage 정리 완료 (회원가입 모드)');
        } catch (v_df17d5) {
          console.error('[인증] AsyncStorage 정리 실패:', v_df17d5);
        }
      }

      await v_889fad(v_8d41d7('screens.verificationCode.alerts.error'), v_8d41d7('screens.verificationCode.errors.error'));
    } finally {
      v_ff0c7a(false);
    }
  };

  const v_cf9840 = async () => {
    if (!v_fc0b2c) {
      await v_889fad(v_8d41d7('screens.verificationCode.alerts.error'), v_8d41d7('screens.verificationCode.errors.emailNotFound'));
      return;
    }

    v_f30c99(true);

    try {
      console.log('[인증] 이메일 인증 코드 재전송 요청:', v_fc0b2c);
      const v_f438c1 = await v_8025d1(v_fc0b2c, v_9b57fc);

      if (v_f438c1) {
        v_83fe8f(v_ef7132);
        v_537cbb('');
        await v_889fad(v_8d41d7('screens.verificationCode.alerts.resendComplete'), v_8d41d7('screens.verificationCode.success.resendComplete'));
      } else {
        await v_889fad(v_8d41d7('screens.verificationCode.alerts.resendFailed'), v_8d41d7('screens.verificationCode.errors.resendFailed'));
      }
    } catch (v_5e9bfe) {
      console.error('[인증] 인증 코드 재전송 오류:', v_5e9bfe);
      await v_889fad(v_8d41d7('screens.verificationCode.alerts.error'), v_8d41d7('screens.verificationCode.errors.resendError'));
    } finally {
      v_f30c99(false);
    }
  };

  return (
    <View style={v_d81136.container}>
      <Header title={v_8d41d7('screens.verificationCode.title')} onBackPress={v_c7ac57} showBackButton />
      <SafeScrollView contentContainerStyle={v_d81136.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={v_d81136.descriptionWrapper}>
          <Text style={v_d81136.description}>
            {v_fc0b2c || '이메일'}{v_8d41d7('screens.verificationCode.description')}
          </Text>
        </View>

        <View style={v_d81136.codeRow}>
          {Array.from({ length: v_683bb6 }).map((v_37eab7, v_a56041) => {
            const v_5f701e = v_c99bd2[v_a56041] ?? '';
            return (
              <TouchableOpacity
                key={v_a56041}
                style={v_d81136.codeBox}
                onPress={() => {

                  v_56c646.current?.focus();
                }}
                activeOpacity={0.7}
              >
                <Text style={v_d81136.codeText}>{v_5f701e}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {}
        <TextInput
          ref={v_56c646}
          value={v_c99bd2}
          onChangeText={v_537cbb}
          keyboardType="number-pad"
          maxLength={v_683bb6}
          style={v_d81136.hiddenInput}
          autoFocus={false}
        />

        <TouchableOpacity
          style={v_d81136.resendWrapper}
          onPress={v_ae68cd <= 0 && !v_ff9533 ? v_cf9840 : undefined}
          activeOpacity={v_ae68cd <= 0 && !v_ff9533 ? 0.7 : 1}
          disabled={v_ae68cd > 0 || v_ff9533}
        >
          {v_ff9533 ? (
            <ActivityIndicator size="small" color="#2873ff" />
          ) : (
            <Text style={v_d81136.resendText}>
              {v_8d41d7('screens.verificationCode.resendCode')}{' '}
              {v_ae68cd > 0 && (
                <Text style={v_d81136.resendTimer} numberOfLines={1}>
                  {v_8813df}
                </Text>
              )}
            </Text>
          )}
        </TouchableOpacity>

        <View style={v_d81136.buttonWrapper}>
          {v_d1dd8f ? (
            <View style={v_d81136.loadingContainer}>
              <ActivityIndicator size="small" color={v_1bfbd0.buttonPrimary} />
            </View>
          ) : (
            <PrimaryButton
              title={v_8d41d7('screens.verificationCode.verifyButton')}
              onPress={v_83b05b}
              fullWidth
              disabled={v_c99bd2.length !== v_683bb6 || v_d1dd8f}
            />
          )}
        </View>

      </SafeScrollView>
    </View>
  );
};

const v_d81136 = v_472849.create({
  container: {
    ...v_a61db3.container,
  },
  scrollContent: {
    flexGrow: 1,
    ...v_a61db3.scrollContent,
  },
  descriptionWrapper: {
    width: '100%',
    maxWidth: 327,
    alignSelf: 'center',
    marginBottom: 24,
  },
  description: {
    fontSize: v_843035.size.msmall,
    lineHeight: 24,
    color: '#747474',
    fontFamily: 'Roboto-Regular',
  },
  codeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    maxWidth: 327,
    alignSelf: 'center',
    marginBottom: 24,
  },
  codeBox: {
    width: 45,
    height: 50,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#dedede',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  codeText: {
    fontSize: v_843035.size.large,
    fontFamily: 'Roboto-Bold',
    color: v_1bfbd0.headerText,
  },
  resendWrapper: {
    alignItems: 'center',
    marginBottom: 24,
  },
  resendText: {
    fontSize: v_843035.size.medium,
    lineHeight: 24,
    color: v_1bfbd0.headerText,
    fontFamily: 'Roboto-Medium',
  },
  resendTimer: {
    color: '#2873ff',
    fontFamily: 'Roboto-Medium',
  },
  buttonWrapper: {
    width: '100%',
    maxWidth: 780,
    alignSelf: 'center',
    marginBottom: 32,
  },

  loadingContainer: {
    height: 56,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  hiddenInput: {
    position: 'absolute',
    width: 0,
    height: 0,
    opacity: 0,
  },
});