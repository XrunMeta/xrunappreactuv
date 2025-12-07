import React, { useEffect, useMemo, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Header, PrimaryButton, SafeScrollView } from '../components';
import { COLORS, COMMON_STYLES, FONTS } from '../constants';
import { ROUTES, useAppNavigation } from '../navigation';
import { useAppContext } from '../context';
import { useAlertDialog } from '../context/AlertDialogContext';
import {
  verifyEmailCode,
  loginWithEmailAuth,
  encryptSHA256,
  saveSession,
  sendEmailVerificationCode,
} from '../services';

const CODE_LENGTH = 6;
const RESEND_SECONDS = 300;

export const VerificationCodeScreen = () => {
  const { t } = useTranslation();
  const { goBack, reset, navigate } = useAppNavigation();
  const { showAlert } = useAlertDialog();
  const {
    verificationSuccessRoute,
    resetVerificationSuccessRoute,
    verificationEmail,
  } = useAppContext();
  const [code, setCode] = useState('');
  const [secondsLeft, setSecondsLeft] = useState(RESEND_SECONDS);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const hiddenInputRef = useRef<TextInput>(null);

  useEffect(() => {
    if (secondsLeft <= 0) {
      return;
    }
    const timer = setInterval(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearInterval(timer);
  }, [secondsLeft]);

  const formattedTimer = useMemo(() => {
    const minutes = Math.floor(secondsLeft / 60)
      .toString()
      .padStart(2, '0');
    const seconds = (secondsLeft % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
  }, [secondsLeft]);

  const handleVerify = async () => {
    if (!verificationEmail) {
      await showAlert(t('screens.verificationCode.alerts.error'), t('screens.verificationCode.errors.emailNotFound'));
      return;
    }

    if (code.length !== CODE_LENGTH) {
      await showAlert(t('screens.verificationCode.alerts.codeInput'), t('screens.verificationCode.errors.codeRequired'));
      return;
    }

    setIsVerifying(true);

    try {

      console.log('[인증] 이메일 인증 코드 확인 요청:', verificationEmail);
      const codeVerified = await verifyEmailCode(verificationEmail, code, navigate);

      if (!codeVerified) {
        await showAlert(t('screens.verificationCode.alerts.verificationFailed'), t('screens.verificationCode.errors.verificationFailed'));
        setIsVerifying(false);
        return;
      }

      if (verificationSuccessRoute === ROUTES.login || verificationSuccessRoute === ROUTES.map) {

        console.log('[로그인] 이메일 로그인 요청:', verificationEmail);
        const loginResponse = await loginWithEmailAuth(verificationEmail, navigate);

        if (loginResponse.status !== 'success') {
          await showAlert(t('screens.verificationCode.alerts.loginFailed'), t('screens.verificationCode.errors.loginFailed'));
          setIsVerifying(false);
          return;
        }

        const userData = loginResponse.data[0];
        if (!userData || !userData.member) {
          await showAlert(t('screens.verificationCode.alerts.loginFailed'), t('screens.verificationCode.errors.userDataNotFound'));
          setIsVerifying(false);
          return;
        }

        const extrastr = userData.extrastr;
        if (extrastr) {
          const ssidw = encryptSHA256(extrastr);
          const sessionSaved = await saveSession(userData.member, ssidw, navigate);
          if (!sessionSaved) {
            console.warn('[로그인] 세션 저장 실패');
          }
        }

        await AsyncStorage.removeItem('userData');
        await AsyncStorage.removeItem('userSessionToken');
        await AsyncStorage.setItem('userEmail', verificationEmail);
        await AsyncStorage.setItem('userData', JSON.stringify(userData));
        const sessionToken = userData.extrastr || '';
        await AsyncStorage.setItem('userSessionToken', sessionToken);
        await AsyncStorage.setItem('isLoggedIn', 'true');

        console.log('[로그인] 이메일 인증 로그인 성공');

        resetVerificationSuccessRoute();
        reset(verificationSuccessRoute || ROUTES.map);
      } else {

        console.log('[정보수정] 인증 코드 확인 성공');
        resetVerificationSuccessRoute();
        reset(verificationSuccessRoute);
      }
    } catch (error) {
      console.error('[인증] 인증 코드 확인 오류:', error);
      await showAlert(t('screens.verificationCode.alerts.error'), t('screens.verificationCode.errors.error'));
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResend = async () => {
    if (!verificationEmail) {
      await showAlert(t('screens.verificationCode.alerts.error'), t('screens.verificationCode.errors.emailNotFound'));
      return;
    }

    setIsResending(true);

    try {
      console.log('[인증] 이메일 인증 코드 재전송 요청:', verificationEmail);
      const codeSent = await sendEmailVerificationCode(verificationEmail, navigate);

      if (codeSent) {
        setSecondsLeft(RESEND_SECONDS);
        setCode('');
        await showAlert(t('screens.verificationCode.alerts.resendComplete'), t('screens.verificationCode.success.resendComplete'));
      } else {
        await showAlert(t('screens.verificationCode.alerts.resendFailed'), t('screens.verificationCode.errors.resendFailed'));
      }
    } catch (error) {
      console.error('[인증] 인증 코드 재전송 오류:', error);
      await showAlert(t('screens.verificationCode.alerts.error'), t('screens.verificationCode.errors.resendError'));
    } finally {
      setIsResending(false);
    }
  };

  return (
    <View style={styles.container}>
      <Header title={t('screens.verificationCode.title')} onBackPress={goBack} showBackButton />
      <SafeScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.descriptionWrapper}>
          <Text style={styles.description}>
            {verificationEmail || '이메일'}{t('screens.verificationCode.description')}
          </Text>
        </View>

        <View style={styles.codeRow}>
          {Array.from({ length: CODE_LENGTH }).map((_, index) => {
            const digit = code[index] ?? '';
            return (
              <TouchableOpacity
                key={index}
                style={styles.codeBox}
                onPress={() => {

                  hiddenInputRef.current?.focus();
                }}
                activeOpacity={0.7}
              >
                <Text style={styles.codeText}>{digit}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {}
        <TextInput
          ref={hiddenInputRef}
          value={code}
          onChangeText={setCode}
          keyboardType="number-pad"
          maxLength={CODE_LENGTH}
          style={styles.hiddenInput}
          autoFocus={false}
        />

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
              {t('screens.verificationCode.resendCode')}{' '}
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
              title={t('screens.verificationCode.verifyButton')}
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
  container: {
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
});