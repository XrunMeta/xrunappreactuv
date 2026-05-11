import v_a3453e, { v_c4deb2, v_5ab095 } from 'bapkr';
import {
  v_3094a2,
  v_19b633,
  v_472849,
  v_4623af,
  v_39a996,
  v_326be8,
} from 'rcmrninabrnb';
import { v_772971 } from 'jmpfvteuuztnp';
import { v_1bfbd0, v_843035, v_9b1a04 } from '../constants';
import { v_8025d1, v_415628 } from '../services';

interface Props {
  email: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export const EmailOtpGate: v_a3453e.FC<Props> = ({ email: v_e0c7e8, onSuccess: v_fe60db, onCancel: v_c7001c }) => {
  const { t: v_8d41d7 } = v_772971();
  const [v_ab4803, v_ae4844] = v_5ab095<'sending' | 'input' | 'verifying'>('sending');
  const [v_c99bd2, v_537cbb] = v_5ab095('');
  const [v_5e9bfe, v_3a7d09] = v_5ab095('');
  const [v_77cdad, v_13dcee] = v_5ab095(false);

  v_c4deb2(() => {
    (async () => {
      try {
        const v_3ed4c3 = await v_8025d1(v_e0c7e8);
        if (v_3ed4c3) {
          v_ae4844('input');
        } else {
          v_3a7d09(v_8d41d7('screens.emailOtp.sendFailed') || '인증 코드 발송에 실패했습니다.');
          v_ae4844('input');
        }
      } catch (v_9e86fd) {
        console.warn('[EmailOtpGate] send failed', v_9e86fd);
        v_3a7d09(v_8d41d7('screens.emailOtp.sendError') || '인증 코드 발송 중 오류가 발생했습니다.');
        v_ae4844('input');
      }
    })();

  }, [v_e0c7e8]);

  v_c4deb2(() => {
    if (v_ab4803 !== 'input' || v_c99bd2.length !== 6) return;
    (async () => {
      v_ae4844('verifying');
      v_3a7d09('');
      try {
        const v_3ed4c3 = await v_415628(v_e0c7e8, v_c99bd2);
        if (v_3ed4c3) {
          v_fe60db();
        } else {
          v_3a7d09(v_8d41d7('screens.emailOtp.wrongCode') || '인증 코드가 일치하지 않습니다.');
          v_537cbb('');
          v_ae4844('input');
        }
      } catch (v_9e86fd) {
        v_3a7d09(v_8d41d7('screens.emailOtp.verifyError') || '검증 중 오류가 발생했습니다.');
        v_537cbb('');
        v_ae4844('input');
      }
    })();

  }, [v_c99bd2, v_ab4803]);

  const v_4464f1 = (v_d5dda0) => {
    if (v_ab4803 !== 'input') return;
    v_3a7d09('');
    if (v_c99bd2.length >= 6) return;
    v_537cbb(v_c99bd2 + v_d5dda0);
  };
  const v_7e2cc5 = () => {
    if (v_ab4803 !== 'input') return;
    v_3a7d09('');
    if (v_c99bd2.length === 0) return;
    v_537cbb(v_c99bd2.slice(0, -1));
  };

  const v_6ee6a9 = async () => {
    v_13dcee(true);
    v_3a7d09('');
    v_537cbb('');
    try {
      const v_3ed4c3 = await v_8025d1(v_e0c7e8);
      if (!v_3ed4c3) v_3a7d09(v_8d41d7('screens.emailOtp.sendFailed') || '인증 코드 재발송에 실패했습니다.');
    } catch {
      v_3a7d09(v_8d41d7('screens.emailOtp.sendError') || '인증 코드 발송 중 오류가 발생했습니다.');
    } finally {
      v_13dcee(false);
    }
  };

  return (
    <View style={v_d81136.overlay}>
      <Text style={v_d81136.title}>{v_8d41d7('screens.emailOtp.title') || '이메일 인증'}</Text>
      <Text style={v_d81136.subtitle}>
        {v_8d41d7('screens.emailOtp.sentTo') || '인증 코드를 발송했습니다:'}
      </Text>
      <Text style={v_d81136.email}>{v_e0c7e8}</Text>
      <Text style={v_d81136.subtitle}>
        {v_8d41d7('screens.emailOtp.enterCode') || '이메일로 받은 6자리 코드를 입력해 주세요.'}
      </Text>

      <View style={v_d81136.dotsRow}>
        {Array.from({ length: 6 }).map((v_37eab7, v_ebec57) => (
          <View key={v_ebec57} style={[v_d81136.dot, v_c99bd2.length > v_ebec57 && v_d81136.dotFilled]}>
            {v_c99bd2.length > v_ebec57 && <Text style={v_d81136.digit}>{v_c99bd2[v_ebec57]}</Text>}
          </View>
        ))}
      </View>

      {!!v_5e9bfe && <Text style={v_d81136.error}>{v_5e9bfe}</Text>}
      {(v_ab4803 === 'verifying' || v_ab4803 === 'sending') && (
        <View style={{ marginTop: 8 }}>
          <ActivityIndicator size="small" color={v_1bfbd0.buttonPrimary} />
          {v_ab4803 === 'sending' && (
            <Text style={v_d81136.sendingHint}>
              {v_8d41d7('screens.emailOtp.sending') || '인증 코드 발송 중...'}
            </Text>
          )}
        </View>
      )}

      <TouchableOpacity onPress={v_6ee6a9} disabled={v_77cdad || v_ab4803 === 'sending'} style={v_d81136.resendBtn}>
        <Text style={[v_d81136.resendText, (v_77cdad || v_ab4803 === 'sending') && { opacity: 0.4 }]}>
          {v_77cdad ? (v_8d41d7('screens.emailOtp.resending') || '재발송 중...') : (v_8d41d7('screens.emailOtp.resend') || '인증 코드 재발송')}
        </Text>
      </TouchableOpacity>

      <View style={v_d81136.keypad}>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((v_f4e98d) => (
          <TouchableOpacity key={v_f4e98d} style={v_d81136.key} onPress={() => v_4464f1(String(v_f4e98d))} disabled={v_ab4803 !== 'input'}>
            <Text style={v_d81136.keyText}>{v_f4e98d}</Text>
          </TouchableOpacity>
        ))}
        <TouchableOpacity style={v_d81136.key} onPress={v_c7001c}>
          <Text style={[v_d81136.keyText, { fontSize: 14, color: '#94a3b8' }]}>
            {v_8d41d7('common.cancel') || '취소'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={v_d81136.key} onPress={() => v_4464f1('0')} disabled={v_ab4803 !== 'input'}>
          <Text style={v_d81136.keyText}>0</Text>
        </TouchableOpacity>
        <TouchableOpacity style={v_d81136.key} onPress={v_7e2cc5} disabled={v_ab4803 !== 'input'}>
          <Text style={[v_d81136.keyText, { fontSize: 18 }]}>⌫</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const v_d81136 = v_472849.create({
  overlay: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: '#fff',
    zIndex: 1000,
    paddingHorizontal: v_9b1a04.large,
    paddingTop: 60,
    alignItems: 'center',
  },
  title: {
    fontSize: v_843035.size.large,
    fontWeight: '700',
    color: v_1bfbd0.text,
    marginTop: 20,
    marginBottom: 12,
  },
  subtitle: {
    fontSize: v_843035.size.msmall,
    color: '#64748b',
    textAlign: 'center',
  },
  email: {
    fontSize: v_843035.size.medium,
    fontWeight: '600',
    color: v_1bfbd0.text,
    marginVertical: 6,
  },
  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 8,
  },
  dot: {
    width: 36,
    height: 44,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#CBD5E1',
    marginHorizontal: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dotFilled: { borderColor: '#343a5a', backgroundColor: '#f8fafc' },
  digit: { fontSize: 20, fontWeight: '700', color: '#343a5a' },
  error: {
    fontSize: 13,
    color: '#EF4444',
    textAlign: 'center',
    marginTop: 8,
  },
  sendingHint: {
    fontSize: 12,
    color: '#64748b',
    textAlign: 'center',
    marginTop: 8,
  },
  resendBtn: {
    marginTop: 12,
    padding: 8,
  },
  resendText: {
    fontSize: 13,
    color: v_1bfbd0.buttonPrimary,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  keypad: {
    marginTop: 'auto',
    marginBottom: v_326be8.OS === 'ios' ? 32 : 16,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    width: '100%',
  },
  key: {
    width: '30%',
    aspectRatio: 1.5,
    margin: '1.5%',
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  keyText: {
    fontSize: 26,
    fontWeight: '600',
    color: v_1bfbd0.text,
  },
});
