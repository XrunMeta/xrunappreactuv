import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Text,
  Alert,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useTranslation } from 'react-i18next';
import { Header, FormField, PrimaryButton } from '../components';
import { COLORS, COMMON_STYLES } from '../constants';
import { useAppNavigation, ROUTES } from '../navigation';
import { useAppContext } from '../context';
import { sendEmailVerificationCode } from '../services';

const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const MyInfoEmailAuthScreen = () => {
  const { t } = useTranslation();
  const { goBack, navigate } = useAppNavigation();
  const { setVerificationSuccessRoute, verificationEmail, setVerificationEmail } = useAppContext();
  const [email, setEmail] = useState('');
  const [sending, setSending] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  useEffect(() => {
    if (verificationEmail) {
      setEmail(verificationEmail);
    }
  }, [verificationEmail]);

  const handleSendEmail = async () => {

    if (!email.trim()) {
      Alert.alert(t('screens.myInfoEmailAuth.alerts.emailInput'), t('screens.myInfoEmailAuth.alerts.emailRequired'));
      return;
    }

    if (!isValidEmail(email)) {
      Alert.alert(t('screens.myInfoEmailAuth.alerts.emailFormatError'), t('screens.myInfoEmailAuth.alerts.emailFormatInvalid'));
      return;
    }

    if (verificationEmail && email.trim() !== verificationEmail.trim()) {
      Alert.alert(t('screens.myInfoEmailAuth.alerts.emailMismatch'), t('screens.myInfoEmailAuth.alerts.emailMismatchMessage'));
      return;
    }

    try {
      setSending(true);
      console.log('[정보수정] 이메일 인증 코드 발송 요청:', email.trim());

      const success = await sendEmailVerificationCode(email.trim(), navigate);

      if (success) {
        setEmailSent(true);
        Alert.alert(t('screens.myInfoEmailAuth.alerts.sendSuccess'), t('screens.myInfoEmailAuth.alerts.sendSuccessMessage'));
      } else {
        Alert.alert(t('screens.myInfoEmailAuth.alerts.sendFailed'), t('screens.myInfoEmailAuth.alerts.sendFailedMessage'));
      }
    } catch (error) {
      console.error('[정보수정] 이메일 전송 오류:', error);
      Alert.alert(t('screens.myInfoEmailAuth.alerts.sendFailed'), t('screens.myInfoEmailAuth.alerts.sendError'));
    } finally {
      setSending(false);
    }
  };

  const handleConfirm = async () => {

    if (!email.trim()) {
      Alert.alert(t('screens.myInfoEmailAuth.alerts.emailInput'), t('screens.myInfoEmailAuth.alerts.emailRequired'));
      return;
    }

    if (!isValidEmail(email)) {
      Alert.alert(t('screens.myInfoEmailAuth.alerts.emailFormatError'), t('screens.myInfoEmailAuth.alerts.emailFormatInvalid'));
      return;
    }

    if (verificationEmail && email.trim() !== verificationEmail.trim()) {
      Alert.alert(t('screens.myInfoEmailAuth.alerts.emailMismatch'), t('screens.myInfoEmailAuth.alerts.emailMismatchMessage'));
      return;
    }

    if (!emailSent) {
      Alert.alert(t('screens.myInfoEmailAuth.alerts.codeNotSent'), t('screens.myInfoEmailAuth.alerts.codeNotSentMessage'));
      return;
    }

    try {
      setSending(true);
      console.log('[정보수정] 이메일 인증 코드 발송 요청 (확인 버튼):', email.trim());

      const success = await sendEmailVerificationCode(email.trim(), navigate);

      if (success) {

        setVerificationEmail(email.trim());
        setVerificationSuccessRoute(ROUTES.myInfoEdit);
        navigate(ROUTES.verificationCode);
      } else {
        Alert.alert(t('screens.myInfoEmailAuth.alerts.sendFailed'), t('screens.myInfoEmailAuth.alerts.sendFailedMessage'));
      }
    } catch (error) {
      console.error('[정보수정] 이메일 전송 오류:', error);
      Alert.alert(t('screens.myInfoEmailAuth.alerts.sendFailed'), t('screens.myInfoEmailAuth.alerts.sendError'));
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
            onChangeText={(text) => {
              setEmail(text);
              setEmailSent(false);
            }}
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="email-address"
            placeholder={t('screens.myInfoEmailAuth.emailPlaceholder')}
            containerStyle={styles.fieldContainer}
            rightAccessory={
              <TouchableOpacity
                style={[
                  styles.inlineButton,
                  emailSent && styles.inlineButtonSent,
                ]}
                onPress={handleSendEmail}
                disabled={sending}
                activeOpacity={0.7}
              >
                <Text style={styles.inlineButtonText}>
                  {sending ? t('screens.myInfoEmailAuth.sending') : (emailSent ? t('screens.myInfoEmailAuth.sendButton') : t('screens.myInfoEmailAuth.sendButton'))}
                </Text>
              </TouchableOpacity>
            }
          />
        </View>

        <View style={styles.bottomSection}>
          <PrimaryButton
            title={t('screens.myInfoEmailAuth.confirmButton')}
            fullWidth
            onPress={handleConfirm}
            style={styles.primaryButton}
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
  inlineButtonSent: {
    backgroundColor: '#595f7d',
  },
  inlineButtonText: {
    color: '#fff',
    fontSize: 12,
    fontFamily: 'Roboto-SemiBold',
  },
  bottomSection: {
    ...COMMON_STYLES.bottomSection,
  },
  primaryButton: {
    width: '100%',
  },
});

