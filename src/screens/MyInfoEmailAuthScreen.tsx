import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Text,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useTranslation } from 'react-i18next';
import { Header, FormField } from '../components';
import { COLORS } from '../constants';
import { useAppNavigation, ROUTES } from '../navigation';
import { useAppContext } from '../context';
import { sendEmailVerificationCode } from '../services';
import { useAlertDialog } from '../context/AlertDialogContext';

const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const MyInfoEmailAuthScreen = () => {
  const { t } = useTranslation();
  const { goBack, navigate } = useAppNavigation();
  const { showAlert } = useAlertDialog();
  const { setVerificationSuccessRoute, verificationEmail, setVerificationEmail } = useAppContext();
  const [email, setEmail] = useState('');
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (verificationEmail) {
      setEmail(verificationEmail);
    }
  }, [verificationEmail]);

  const handleSendEmail = async () => {

    if (!email.trim()) {
      await showAlert(t('screens.myInfoEmailAuth.alerts.emailInput'), t('screens.myInfoEmailAuth.alerts.emailRequired'));
      return;
    }

    if (!isValidEmail(email)) {
      await showAlert(t('screens.myInfoEmailAuth.alerts.emailFormatError'), t('screens.myInfoEmailAuth.alerts.emailFormatInvalid'));
      return;
    }

    if (verificationEmail && email.trim() !== verificationEmail.trim()) {
      await showAlert(t('screens.myInfoEmailAuth.alerts.emailMismatch'), t('screens.myInfoEmailAuth.alerts.emailMismatchMessage'));
      return;
    }

    try {
      setSending(true);
      console.log('[정보수정] 이메일 인증 코드 발송 요청:', email.trim());

      const success = await sendEmailVerificationCode(email.trim(), navigate);

      if (success) {

        setVerificationEmail(email.trim());
        setVerificationSuccessRoute(ROUTES.myInfoEdit);
        navigate(ROUTES.verificationCode);
      } else {
        await showAlert(t('screens.myInfoEmailAuth.alerts.sendFailed'), t('screens.myInfoEmailAuth.alerts.sendFailedMessage'));
      }
    } catch (error) {
      console.error('[정보수정] 이메일 전송 오류:', error);
      await showAlert(t('screens.myInfoEmailAuth.alerts.sendFailed'), t('screens.myInfoEmailAuth.alerts.sendError'));
    } finally {
      setSending(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <Header title={t('screens.myInfoEmailAuth.title')} onBackPress={goBack} showBackButton />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.formWrapper}>
          <FormField
            label={t('screens.myInfoEmailAuth.emailLabel')}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="email-address"
            placeholder={t('screens.myInfoEmailAuth.emailPlaceholder')}
            containerStyle={styles.fieldContainer}
            rightAccessory={
              <TouchableOpacity
                style={styles.inlineButton}
                onPress={handleSendEmail}
                disabled={sending}
                activeOpacity={0.7}
              >
                <Text style={styles.inlineButtonText}>
                  {sending ? t('screens.myInfoEmailAuth.sending') : t('screens.myInfoEmailAuth.sendButton')}
                </Text>
              </TouchableOpacity>
            }
          />
        </View>

      </ScrollView>
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
    paddingTop: 32,
    paddingBottom: 40,
  },
  formWrapper: {
    width: '100%',
    maxWidth: 780,
    alignSelf: 'center',
  },
  fieldContainer: {
    marginBottom: 32,
  },
  inlineButton: {
    backgroundColor: '#343a5a',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    minWidth: 80,
    alignItems: 'center',
  },
  inlineButtonText: {
    color: '#fff',
    fontSize: 12,
    fontFamily: 'Roboto-SemiBold',
  },
});

