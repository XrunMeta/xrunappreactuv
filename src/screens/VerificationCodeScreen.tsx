import v_a3453e, { v_c4deb2, v_df9f57, v_5ab095 } from 'bapkr';
import {
  v_3094a2,
  v_19b633,
  v_472849,
  v_122070,
  v_4623af,
  v_326be8,
  v_03e392,
  v_39a996,
} from 'rcmrninabrnb';
import { v_b5df25 } from 'ernurodqvmtspux';
import v_e84827 from 'bkjbgtcoyuizqwgwtnaxmfkyvlqwevapsqmanbsnv';
import { v_729608, v_cb41de } from '../components';
import { v_1bfbd0 } from '../constants';
import { v_ce4741, v_a0daa8 } from '../navigation';
import { v_700ef9 } from '../context';
import {
  v_415628,
  v_a81308,
  v_a5170b,
  v_ea3493,
  v_8025d1,
} from '../services';

const v_683bb6 = 6;
const v_ef7132 = 300;

const v_79c59a = [['1', '2', '3'], ['4', '5', '6'], ['7', '8', '9'], ['', '0', '⌫']];

export const v_667a00 = () => {
  const { goBack: v_c7ac57, reset: v_487a25, navigate: v_9b57fc } = v_a0daa8();
  const {
    verificationSuccessRoute: v_e6976c,
    resetVerificationSuccessRoute: v_036f76,
    verificationEmail: v_fc0b2c,
  } = v_700ef9();
  const [v_c99bd2, v_537cbb] = v_5ab095('');
  const [v_ae68cd, v_83fe8f] = v_5ab095(v_ef7132);
  const [v_d1dd8f, v_ff0c7a] = v_5ab095(false);
  const [v_ff9533, v_f30c99] = v_5ab095(false);

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

  const v_fceada = (v_3b402b) => {
    if (v_3b402b === '⌫') {
      v_537cbb((v_ba2215) => v_ba2215.slice(0, -1));
      return;
    }
    if (v_3b402b === '' || v_c99bd2.length >= v_683bb6) {
      return;
    }
    v_537cbb((v_ba2215) => v_ba2215 + v_3b402b);
  };

  const v_83b05b = async () => {
    if (!v_fc0b2c) {
      v_03e392.alert('오류', '이메일 정보를 찾을 수 없습니다.');
      return;
    }

    if (v_c99bd2.length !== v_683bb6) {
      v_03e392.alert('인증 코드 입력', '6자리 인증 코드를 입력해주세요.');
      return;
    }

    v_ff0c7a(true);

    try {

      console.log('[인증] 이메일 인증 코드 확인 요청:', v_fc0b2c);
      const v_ac477d = await v_415628(v_fc0b2c, v_c99bd2, v_9b57fc);

      if (!v_ac477d) {
        v_03e392.alert('인증 실패', '인증 코드가 올바르지 않습니다. 다시 확인해주세요.');
        v_ff0c7a(false);
        return;
      }

      if (v_e6976c === v_ce4741.login || v_e6976c === v_ce4741.map) {

        console.log('[로그인] 이메일 로그인 요청:', v_fc0b2c);
        const v_b84499 = await v_a81308(v_fc0b2c, v_9b57fc);

        if (v_b84499.status !== 'success') {
          v_03e392.alert('로그인 실패', '로그인에 실패했습니다. 다시 시도해주세요.');
          v_ff0c7a(false);
          return;
        }

        const v_ef7306 = v_b84499.data[0];
        if (!v_ef7306 || !v_ef7306.member) {
          v_03e392.alert('로그인 실패', '사용자 정보를 가져올 수 없습니다.');
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
      v_03e392.alert('오류', '인증 처리 중 오류가 발생했습니다.');
    } finally {
      v_ff0c7a(false);
    }
  };

  const v_cf9840 = async () => {
    if (!v_fc0b2c) {
      v_03e392.alert('오류', '이메일 정보를 찾을 수 없습니다.');
      return;
    }

    v_f30c99(true);

    try {
      console.log('[인증] 이메일 인증 코드 재전송 요청:', v_fc0b2c);
      const v_f438c1 = await v_8025d1(v_fc0b2c, v_9b57fc);

      if (v_f438c1) {
        v_83fe8f(v_ef7132);
        v_537cbb('');
        v_03e392.alert('재전송 완료', '인증 코드를 다시 전송했습니다.');
      } else {
        v_03e392.alert('재전송 실패', '인증 코드 재전송에 실패했습니다. 다시 시도해주세요.');
      }
    } catch (v_5e9bfe) {
      console.error('[인증] 인증 코드 재전송 오류:', v_5e9bfe);
      v_03e392.alert('오류', '인증 코드 재전송 중 오류가 발생했습니다.');
    } finally {
      v_f30c99(false);
    }
  };

  return (
    <View style={v_d81136.container}>
      <StatusBar style="dark" />
      <Header title="인증코드를 입력하세요" onBackPress={v_c7ac57} showBackButton />
      <ScrollView contentContainerStyle={v_d81136.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={v_d81136.descriptionWrapper}>
          <Text style={v_d81136.description}>
            {v_fc0b2c || '이메일'}로{'\n'}보내드린 6자리 코드를 입력하세요.
          </Text>
        </View>

        <View style={v_d81136.codeRow}>
          {Array.from({ length: v_683bb6 }).map((v_37eab7, v_a56041) => {
            const v_5f701e = v_c99bd2[v_a56041] ?? '';
            return (
              <View key={v_a56041} style={v_d81136.codeBox}>
                <Text style={v_d81136.codeText}>{v_5f701e}</Text>
              </View>
            );
          })}
        </View>

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
              코드 재전송{' '}
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
              title="Verify"
              onPress={v_83b05b}
              fullWidth
              disabled={v_c99bd2.length !== v_683bb6 || v_d1dd8f}
            />
          )}
        </View>

        <View style={v_d81136.keyboardContainer}>
          {v_79c59a.map((v_3ac7e7, v_554071) => (
            <View key={v_554071} style={v_d81136.keyboardRow}>
              {v_3ac7e7.map((v_3b402b, v_a667ee) => (
                <TouchableOpacity
                  key={v_a667ee}
                  style={[v_d81136.keyButton, v_3b402b === '' && v_d81136.keyButtonPlaceholder]}
                  activeOpacity={v_3b402b ? 0.6 : 1}
                  onPress={() => v_3b402b && v_fceada(v_3b402b)}
                >
                  {v_3b402b !== '' && <Text style={v_d81136.keyText}>{v_3b402b}</Text>}
                </TouchableOpacity>
              ))}
            </View>
          ))}
        </View>
      </ScrollView>

      {v_326be8.OS === 'ios' && (
        <View style={v_d81136.homeIndicator}>
          <View style={v_d81136.homeIndicatorBar} />
        </View>
      )}
    </View>
  );
};

const v_d81136 = v_472849.create({
  container: {
    flex: 1,
    backgroundColor: v_1bfbd0.background,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 60,
  },
  descriptionWrapper: {
    width: '100%',
    maxWidth: 327,
    alignSelf: 'center',
    marginBottom: 24,
  },
  description: {
    fontSize: 14,
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
    fontSize: 20,
    fontFamily: 'Roboto-Bold',
    color: v_1bfbd0.headerText,
  },
  resendWrapper: {
    alignItems: 'center',
    marginBottom: 24,
  },
  resendText: {
    fontSize: 16,
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
  keyboardContainer: {
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 16,
  },
  keyboardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  keyButton: {
    flex: 1,
    marginHorizontal: 4,
    height: 56,
    borderRadius: 12,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#f2f2f2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  keyButtonPlaceholder: {
    borderWidth: 0,
    backgroundColor: 'transparent',
  },
  keyText: {
    fontSize: 24,
    fontFamily: 'Roboto-Bold',
    color: '#10192d',
  },
  homeIndicator: {
    height: 34,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 9,
  },
  homeIndicatorBar: {
    width: 134,
    height: 5,
    backgroundColor: '#10192d',
    borderRadius: 100,
    marginBottom: 9,
  },
  loadingContainer: {
    height: 56,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
});