import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { COLORS, FONTS, SIZES } from '../constants';
import { sendEmailVerificationCode, verifyEmailCode } from '../services';

interface Props {
  email: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export const EmailOtpGate: React.FC<Props> = ({ email, onSuccess, onCancel }) => {
  const { t } = useTranslation();
  const [phase, setPhase] = useState<'sending' | 'input' | 'verifying'>('sending');
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [resending, setResending] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const ok = await sendEmailVerificationCode(email);
        if (ok) {
          setPhase('input');
        } else {
          setError(t('screens.emailOtp.sendFailed') || '인증 코드 발송에 실패했습니다.');
          setPhase('input');
        }
      } catch (e) {
        console.warn('[EmailOtpGate] send failed', e);
        setError(t('screens.emailOtp.sendError') || '인증 코드 발송 중 오류가 발생했습니다.');
        setPhase('input');
      }
    })();

  }, [email]);

  useEffect(() => {
    if (phase !== 'input' || code.length !== 6) return;
    (async () => {
      setPhase('verifying');
      setError('');
      try {
        const ok = await verifyEmailCode(email, code);
        if (ok) {
          onSuccess();
        } else {
          setError(t('screens.emailOtp.wrongCode') || '인증 코드가 일치하지 않습니다.');
          setCode('');
          setPhase('input');
        }
      } catch (e) {
        setError(t('screens.emailOtp.verifyError') || '검증 중 오류가 발생했습니다.');
        setCode('');
        setPhase('input');
      }
    })();

  }, [code, phase]);

  const onPressDigit = (d: string) => {
    if (phase !== 'input') return;
    setError('');
    if (code.length >= 6) return;
    setCode(code + d);
  };
  const onPressBackspace = () => {
    if (phase !== 'input') return;
    setError('');
    if (code.length === 0) return;
    setCode(code.slice(0, -1));
  };

  const onResend = async () => {
    setResending(true);
    setError('');
    setCode('');
    try {
      const ok = await sendEmailVerificationCode(email);
      if (!ok) setError(t('screens.emailOtp.sendFailed') || '인증 코드 재발송에 실패했습니다.');
    } catch {
      setError(t('screens.emailOtp.sendError') || '인증 코드 발송 중 오류가 발생했습니다.');
    } finally {
      setResending(false);
    }
  };

  return (
    <View style={styles.overlay}>
      <Text style={styles.title}>{t('screens.emailOtp.title') || '이메일 인증'}</Text>
      <Text style={styles.subtitle}>
        {t('screens.emailOtp.sentTo') || '인증 코드를 발송했습니다:'}
      </Text>
      <Text style={styles.email}>{email}</Text>
      <Text style={styles.subtitle}>
        {t('screens.emailOtp.enterCode') || '이메일로 받은 6자리 코드를 입력해 주세요.'}
      </Text>

      <View style={styles.dotsRow}>
        {Array.from({ length: 6 }).map((_, i) => (
          <View key={i} style={[styles.dot, code.length > i && styles.dotFilled]}>
            {code.length > i && <Text style={styles.digit}>{code[i]}</Text>}
          </View>
        ))}
      </View>

      {!!error && <Text style={styles.error}>{error}</Text>}
      {(phase === 'verifying' || phase === 'sending') && (
        <View style={{ marginTop: 8 }}>
          <ActivityIndicator size="small" color={COLORS.buttonPrimary} />
          {phase === 'sending' && (
            <Text style={styles.sendingHint}>
              {t('screens.emailOtp.sending') || '인증 코드 발송 중...'}
            </Text>
          )}
        </View>
      )}

      <TouchableOpacity onPress={onResend} disabled={resending || phase === 'sending'} style={styles.resendBtn}>
        <Text style={[styles.resendText, (resending || phase === 'sending') && { opacity: 0.4 }]}>
          {resending ? (t('screens.emailOtp.resending') || '재발송 중...') : (t('screens.emailOtp.resend') || '인증 코드 재발송')}
        </Text>
      </TouchableOpacity>

      <View style={styles.keypad}>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
          <TouchableOpacity key={n} style={styles.key} onPress={() => onPressDigit(String(n))} disabled={phase !== 'input'}>
            <Text style={styles.keyText}>{n}</Text>
          </TouchableOpacity>
        ))}
        <TouchableOpacity style={styles.key} onPress={onCancel}>
          <Text style={[styles.keyText, { fontSize: 14, color: '#94a3b8' }]}>
            {t('common.cancel') || '취소'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.key} onPress={() => onPressDigit('0')} disabled={phase !== 'input'}>
          <Text style={styles.keyText}>0</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.key} onPress={onPressBackspace} disabled={phase !== 'input'}>
          <Text style={[styles.keyText, { fontSize: 18 }]}>⌫</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: '#fff',
    zIndex: 1000,
    paddingHorizontal: SIZES.large,
    paddingTop: 60,
    alignItems: 'center',
  },
  title: {
    fontSize: FONTS.size.large,
    fontWeight: '700',
    color: COLORS.text,
    marginTop: 20,
    marginBottom: 12,
  },
  subtitle: {
    fontSize: FONTS.size.msmall,
    color: '#64748b',
    textAlign: 'center',
  },
  email: {
    fontSize: FONTS.size.medium,
    fontWeight: '600',
    color: COLORS.text,
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
    color: COLORS.buttonPrimary,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  keypad: {
    marginTop: 'auto',
    marginBottom: Platform.OS === 'ios' ? 32 : 16,
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
    color: COLORS.text,
  },
});
