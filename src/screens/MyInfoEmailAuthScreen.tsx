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
      Alert.alert('이메일 입력', '이메일 주소를 입력해주세요.');
      return;
    }

    if (!isValidEmail(email)) {
      Alert.alert('이메일 형식 오류', '올바른 이메일 형식을 입력해주세요.');
      return;
    }

    if (verificationEmail && email.trim() !== verificationEmail.trim()) {
      Alert.alert('이메일 불일치', '기존 이메일과 일치하지 않습니다.');
      return;
    }

    try {
      setSending(true);
      console.log('[정보수정] 이메일 인증 코드 발송 요청:', email.trim());

      const success = await sendEmailVerificationCode(email.trim(), navigate);

      if (success) {
        setEmailSent(true);
        Alert.alert('전송 완료', '입력한 이메일로 인증코드를 전송했어요.');
      } else {
        Alert.alert('전송 실패', '이메일 전송에 실패했습니다. 다시 시도해주세요.');
      }
    } catch (error) {
      console.error('[정보수정] 이메일 전송 오류:', error);
      Alert.alert('전송 실패', '이메일 전송 중 오류가 발생했습니다.');
    } finally {
      setSending(false);
    }
  };

  const handleConfirm = async () => {

    if (!email.trim()) {
      Alert.alert('이메일 입력', '이메일 주소를 입력해주세요.');
      return;
    }

    if (!isValidEmail(email)) {
      Alert.alert('이메일 형식 오류', '올바른 이메일 형식을 입력해주세요.');
      return;
    }

    if (verificationEmail && email.trim() !== verificationEmail.trim()) {
      Alert.alert('이메일 불일치', '기존 이메일과 일치하지 않습니다.');
      return;
    }

    if (!emailSent) {
      Alert.alert('인증 코드 미발송', '먼저 이메일 인증 코드를 발송해주세요.');
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
        Alert.alert('전송 실패', '이메일 전송에 실패했습니다. 다시 시도해주세요.');
      }
    } catch (error) {
      console.error('[정보수정] 이메일 전송 오류:', error);
      Alert.alert('전송 실패', '이메일 전송 중 오류가 발생했습니다.');
    } finally {
      setSending(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <Header title="Email Authentification" onBackPress={goBack} showBackButton />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.formWrapper}>
          <FormField
            label="Email"
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              setEmailSent(false);
            }}
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="email-address"
            placeholder="Enter your email address"
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
                  {emailSent ? 'Sent' : 'Send Email'}
                </Text>
              </TouchableOpacity>
            }
          />
        </View>

        <View style={styles.bottomSection}>
          <PrimaryButton
            title="Confirm"
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

