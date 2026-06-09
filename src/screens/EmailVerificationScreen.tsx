import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FormField, Header, PrimaryButton, SafeScrollView } from '../components';
import { COLORS, COMMON_STYLES } from '../constants';
import { ROUTES, useAppNavigation } from '../navigation';
import { useAppContext } from '../context';
import { checkEmailExists, sendEmailVerificationCode } from '../services';
import { useAlertDialog } from '../context/AlertDialogContext';

export const EmailVerificationScreen = () => {
  const { t } = useTranslation();
  const { goBack, navigate } = useAppNavigation();
  const { showAlert } = useAlertDialog();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { setVerificationSuccessRoute, setVerificationEmail, verificationSuccessRoute } = useAppContext();

  const isSignupMode = verificationSuccessRoute === ROUTES.signup;

  useEffect(() => {
    if (isSignupMode) {
      const loadSignupEmail = async () => {
        try {
          const pendingData = await AsyncStorage.getItem('pendingSignupData');
          if (pendingData) {
            const data = JSON.parse(pendingData);
            if (data.email) {
              setEmail(data.email);
              setVerificationEmail(data.email);
            }
          }
        } catch (error) {
          console.error('[이메일 인증] AsyncStorage에서 이메일 읽기 실패:', error);
        }
      };
      loadSignupEmail();
    }
  }, [isSignupMode, setVerificationEmail]);

  const handleSend = async () => {
    if (!email.trim()) {
      await showAlert(t('screens.emailVerification.alerts.emailInput'), t('screens.emailVerification.errors.emailRequired'));
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      await showAlert(t('screens.emailVerification.alerts.emailFormatError'), t('screens.emailVerification.errors.emailInvalid'));
      return;
    }

    setIsLoading(true);

    try {

      if (!isSignupMode) {
        console.log('[로그인] 이메일 존재 확인 요청:', email.trim());
        const emailExists = await checkEmailExists(email.trim(), navigate);

        if (!emailExists) {
          await showAlert(
            t('screens.emailVerification.alerts.emailCheck'),
            t('screens.emailVerification.errors.emailNotRegistered'),
          );
          setIsLoading(false);
          return;
        }
      } else {
        console.log('[회원가입] 이메일 존재 확인 건너뛰기 (회원가입 모드)');
      }

      const logPrefix = isSignupMode ? '[회원가입]' : '[로그인]';
      console.log(`${logPrefix} 이메일 인증 코드 전송 요청:`, email.trim());
      const codeSent = await sendEmailVerificationCode(email.trim(), navigate);

      if (!codeSent) {
        await showAlert(t('screens.emailVerification.alerts.sendFailed'), t('screens.emailVerification.errors.sendFailed'));
        setIsLoading(false);
        return;
      }

      setVerificationEmail(email.trim());

      if (!isSignupMode && (verificationSuccessRoute === ROUTES.login || !verificationSuccessRoute)) {
        setVerificationSuccessRoute(ROUTES.map);
      }

      navigate(ROUTES.verificationCode);

    } catch (error) {
      console.error('[이메일 인증] 이메일 인증 처리 중 오류:', error);

      if (isSignupMode) {
        try {
          await AsyncStorage.removeItem('pendingSignupData');
          console.log('[이메일 인증] 에러 발생으로 인한 AsyncStorage 정리 완료 (회원가입 모드)');
        } catch (storageError) {
          console.error('[이메일 인증] AsyncStorage 정리 실패:', storageError);
        }
      }

      await showAlert(t('screens.emailVerification.alerts.error'), t('screens.emailVerification.errors.error'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Header title={t('screens.emailVerification.title')} onBackPress={goBack} showBackButton />
      <SafeScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <FormField
          label={t('screens.emailVerification.emailLabel')}
          placeholder={t('screens.emailVerification.emailPlaceholder')}
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
          containerStyle={styles.fieldContainer}

          editable={false}
        />

        <View style={styles.buttonWrapper}>
          <PrimaryButton
            title={isLoading ? t('screens.emailVerification.processing') : t('screens.emailVerification.sendButton')}
            fullWidth
            onPress={handleSend}
            disabled={isLoading}
          />
        </View>
      </SafeScrollView>

      {Platform.OS === 'ios' && (
        <View style={styles.homeIndicator}>
          <View style={styles.homeIndicatorBar} />
        </View>
      )}
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
  fieldContainer: {
    width: '100%',
    maxWidth: 780,
    alignSelf: 'center',
    marginBottom: 40,
  },
  buttonWrapper: {
    width: '100%',
    maxWidth: 780,
    alignSelf: 'center',
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
});

