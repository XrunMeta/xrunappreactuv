import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { FormField, Header, PrimaryButton, SafeScrollView } from '../components';
import { COLORS } from '../constants';
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
  const { setVerificationSuccessRoute, setVerificationEmail } = useAppContext();

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

      console.log('[로그인] 이메일 인증 코드 전송 요청:', email.trim());
      const codeSent = await sendEmailVerificationCode(email.trim(), navigate);

      if (!codeSent) {
        await showAlert(t('screens.emailVerification.alerts.sendFailed'), t('screens.emailVerification.errors.sendFailed'));
        setIsLoading(false);
        return;
      }

      setVerificationEmail(email.trim());
      setVerificationSuccessRoute(ROUTES.map); 
      navigate(ROUTES.verificationCode);
    } catch (error) {
      console.error('[로그인] 이메일 인증 처리 중 오류:', error);
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
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 80,
    paddingBottom: 40,
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

