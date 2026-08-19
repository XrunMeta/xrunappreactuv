import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { Header, PrimaryButton, SafeScrollView } from '.';
import { COLORS, COMMON_STYLES, FONTS } from '../constants';
import { sendEmailVerificationCode, verifyEmailCode } from '../services';
import { TID } from '../testIDs';

const CODE_LENGTH = 6;
const RESEND_SECONDS = 180;

interface Props {
  email: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export const EmailOtpGate: React.FC<Props> = ({ email, onSuccess, onCancel }) => {
  const { t } = useTranslation();
  const [code, setCode] = useState('');
  const [secondsLeft, setSecondsLeft] = useState(RESEND_SECONDS);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState('');
  const [sentOnce, setSentOnce] = useState(false);
  const hiddenInputRef = useRef<TextInput>(null);

  useEffect(() => {
    if (sentOnce) return;
    (async () => {
      try {

        await sendEmailVerificationCode(email, 'send_confirm');
        setSentOnce(true);
      } catch (e) {
        console.warn('[EmailOtpGate] send failed', e);
        setError(t('screens.emailOtp.sendError') || '인증 코드 발송 중 오류가 발생했습니다.');
        setSentOnce(true);
      }
    })();

  }, [email]);

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const timer = setInterval(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearInterval(timer);
  }, [secondsLeft]);

  const formattedTimer = useMemo(() => {
    const m = Math.floor(secondsLeft / 60).toString().padStart(2, '0');
    const s = (secondsLeft % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  }, [secondsLeft]);

  const handleVerify = async () => {
    if (code.length !== CODE_LENGTH) return;
    setIsVerifying(true);
    setError('');
    try {
      const ok = await verifyEmailCode(email, code);
      if (ok) {
        onSuccess();
      } else {
        setError(t('screens.emailOtp.wrongCode') || '인증 코드가 일치하지 않습니다.');
        setCode('');
      }
    } catch (e) {
      setError(t('screens.emailOtp.verifyError') || '검증 중 오류가 발생했습니다.');
      setCode('');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResend = async () => {
    setIsResending(true);
    setError('');
    setCode('');
    try {
      await sendEmailVerificationCode(email, 'send_confirm');
      setSecondsLeft(RESEND_SECONDS);
    } catch {
      setError(t('screens.emailOtp.sendError') || '인증 코드 발송 중 오류가 발생했습니다.');
    } finally {
      setIsResending(false);
    }
  };

  return (
    <View style={styles.overlay}>
      <Header
        title={t('screens.verificationCode.title') || '이메일 인증'}
        onBackPress={onCancel}
        showBackButton
      />
      <SafeScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.descriptionWrapper}>
          <Text testID={TID.emailOtpGate.emailLabel} style={styles.description}>
            {email}
            {t('screens.verificationCode.description') || '로 발송된 인증 코드를 입력해 주세요.'}
          </Text>
        </View>

        <View style={styles.codeRow}>
          {Array.from({ length: CODE_LENGTH }).map((_, index) => {
            const digit = code[index] ?? '';
            return (
              <TouchableOpacity testID={TID.emailOtpGate.hiddenInputRef}
                key={index}
                style={styles.codeBox}
                onPress={() => hiddenInputRef.current?.focus()}
                activeOpacity={0.7}
              >
                <Text style={styles.codeText}>{digit}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <TextInput testID={TID.emailOtpGate.codeInput}
          ref={hiddenInputRef}
          value={code}
          onChangeText={(v) => setCode(v.replace(/[^0-9]/g, '').slice(0, CODE_LENGTH))}
          keyboardType="number-pad"
          maxLength={CODE_LENGTH}
          style={styles.hiddenInput}
          autoFocus={true}
        />

        {!!error && <Text style={styles.errorText}>{error}</Text>}

        <TouchableOpacity
          style={styles.resendWrapper}
          onPress={secondsLeft <= 0 && !isResending ? handleResend : undefined}
          activeOpacity={secondsLeft <= 0 && !isResending ? 0.7 : 1}
          disabled={secondsLeft > 0 || isResending}
        >
          {isResending ? (
            <ActivityIndicator size="small" color="#2873ff" />
          ) : (
            <Text style={styles.resendText}>
              {t('screens.verificationCode.resendCode') || '인증 코드 재발송'}{' '}
              {secondsLeft > 0 && (
                <Text style={styles.resendTimer} numberOfLines={1}>
                  {formattedTimer}
                </Text>
              )}
            </Text>
          )}
        </TouchableOpacity>

        <View style={styles.buttonWrapper}>
          {isVerifying ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color={COLORS.buttonPrimary} />
            </View>
          ) : (
            <PrimaryButton
              title={t('screens.verificationCode.verifyButton') || '확인'}
              onPress={handleVerify}
              fullWidth
              disabled={code.length !== CODE_LENGTH || isVerifying}
            />
          )}
        </View>
      </SafeScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: '#fff',
    zIndex: 1000,
    ...COMMON_STYLES.container,
  },
  scrollContent: {
    flexGrow: 1,
    ...COMMON_STYLES.scrollContent,
  },
  descriptionWrapper: {
    width: '100%',
    maxWidth: 327,
    alignSelf: 'center',
    marginBottom: 24,
  },
  description: {
    fontSize: FONTS.size.msmall,
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
    fontSize: FONTS.size.large,
    fontFamily: 'Roboto-Bold',
    color: COLORS.headerText,
  },
  resendWrapper: {
    alignItems: 'center',
    marginBottom: 24,
  },
  resendText: {
    fontSize: FONTS.size.medium,
    lineHeight: 24,
    color: COLORS.headerText,
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
