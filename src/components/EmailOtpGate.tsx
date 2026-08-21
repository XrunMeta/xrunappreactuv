import v_a3453e, { v_c4deb2, v_df9f57, v_e662ae, v_5ab095 } from 'bapkr';
import {
  v_3094a2,
  v_19b633,
  v_79c4f2,
  v_472849,
  v_4623af,
  v_39a996,
} from 'rcmrninabrnb';
import { v_772971 } from 'jmpfvteuuztnp';
import { v_729608, v_cb41de, v_570c34 } from '.';
import { v_1bfbd0, v_a61db3, v_843035 } from '../constants';
import { v_8025d1, v_415628 } from '../services';
import { v_5401ae } from '../testIDs';

const v_683bb6 = 6;
const v_ef7132 = 180;

interface Props {
  email: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export const EmailOtpGate: v_a3453e.FC<Props> = ({ email: v_e0c7e8, onSuccess: v_fe60db, onCancel: v_c7001c }) => {
  const { t: v_8d41d7 } = v_772971();
  const [v_c99bd2, v_537cbb] = v_5ab095('');
  const [v_ae68cd, v_83fe8f] = v_5ab095(v_ef7132);
  const [v_d1dd8f, v_ff0c7a] = v_5ab095(false);
  const [v_ff9533, v_f30c99] = v_5ab095(false);
  const [v_5e9bfe, v_3a7d09] = v_5ab095('');
  const [v_9dc9e2, v_ad85ac] = v_5ab095(false);
  const v_56c646 = v_e662ae<v_79c4f2>(null);

  v_c4deb2(() => {
    if (v_9dc9e2) return;
    (async () => {
      try {

        await v_8025d1(v_e0c7e8, 'send_confirm');
        v_ad85ac(true);
      } catch (v_9e86fd) {
        console.warn('[EmailOtpGate] send failed', v_9e86fd);
        v_3a7d09(v_8d41d7('screens.emailOtp.sendError') || '인증 코드 발송 중 오류가 발생했습니다.');
        v_ad85ac(true);
      }
    })();

  }, [v_e0c7e8]);

  v_c4deb2(() => {
    if (v_ae68cd <= 0) return;
    const v_cb36b1 = setInterval(() => v_83fe8f((v_fd5f43) => v_fd5f43 - 1), 1000);
    return () => clearInterval(v_cb36b1);
  }, [v_ae68cd]);

  const v_8813df = v_df9f57(() => {
    const v_35f85c = Math.floor(v_ae68cd / 60).toString().padStart(2, '0');
    const v_fd5f43 = (v_ae68cd % 60).toString().padStart(2, '0');
    return `${v_35f85c}:${v_fd5f43}`;
  }, [v_ae68cd]);

  const v_83b05b = async () => {
    if (v_c99bd2.length !== v_683bb6) return;
    v_ff0c7a(true);
    v_3a7d09('');
    try {
      const v_3ed4c3 = await v_415628(v_e0c7e8, v_c99bd2);
      if (v_3ed4c3) {
        v_fe60db();
      } else {
        v_3a7d09(v_8d41d7('screens.emailOtp.wrongCode') || '인증 코드가 일치하지 않습니다.');
        v_537cbb('');
      }
    } catch (v_9e86fd) {
      v_3a7d09(v_8d41d7('screens.emailOtp.verifyError') || '검증 중 오류가 발생했습니다.');
      v_537cbb('');
    } finally {
      v_ff0c7a(false);
    }
  };

  const v_cf9840 = async () => {
    v_f30c99(true);
    v_3a7d09('');
    v_537cbb('');
    try {
      await v_8025d1(v_e0c7e8, 'send_confirm');
      v_83fe8f(v_ef7132);
    } catch {
      v_3a7d09(v_8d41d7('screens.emailOtp.sendError') || '인증 코드 발송 중 오류가 발생했습니다.');
    } finally {
      v_f30c99(false);
    }
  };

  return (
    <View style={v_d81136.overlay}>
      <Header
        title={v_8d41d7('screens.verificationCode.title') || '이메일 인증'}
        onBackPress={v_c7001c}
        showBackButton
      />
      <SafeScrollView contentContainerStyle={v_d81136.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={v_d81136.descriptionWrapper}>
          <Text testID={v_5401ae.emailOtpGate.emailLabel} style={v_d81136.description}>
            {v_e0c7e8}
            {v_8d41d7('screens.verificationCode.description') || '로 발송된 인증 코드를 입력해 주세요.'}
          </Text>
        </View>

        <View style={v_d81136.codeRow}>
          {Array.from({ length: v_683bb6 }).map((v_37eab7, v_a56041) => {
            const v_5f701e = v_c99bd2[v_a56041] ?? '';
            return (
              <TouchableOpacity testID={v_5401ae.emailOtpGate.hiddenInputRef}
                key={v_a56041}
                style={v_d81136.codeBox}
                onPress={() => v_56c646.current?.focus()}
                activeOpacity={0.7}
              >
                <Text style={v_d81136.codeText}>{v_5f701e}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <TextInput testID={v_5401ae.emailOtpGate.codeInput}
          ref={v_56c646}
          value={v_c99bd2}
          onChangeText={(v_81e2ef) => v_537cbb(v_81e2ef.replace(/[^0-9]/g, '').slice(0, v_683bb6))}
          keyboardType="number-pad"
          maxLength={v_683bb6}
          style={v_d81136.hiddenInput}
          autoFocus={true}
        />

        {!!v_5e9bfe && <Text style={v_d81136.errorText}>{v_5e9bfe}</Text>}

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
              {v_8d41d7('screens.verificationCode.resendCode') || '인증 코드 재발송'}{' '}
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
              title={v_8d41d7('screens.verificationCode.verifyButton') || '확인'}
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
  overlay: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: '#fff',
    zIndex: 1000,
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
  errorText: {
    fontSize: 13,
    color: '#EF4444',
    textAlign: 'center',
    marginTop: -12,
    marginBottom: 16,
  },
});
