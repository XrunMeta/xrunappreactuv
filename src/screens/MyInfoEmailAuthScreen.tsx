import React, { useState } from 'react';
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

export const MyInfoEmailAuthScreen = () => {
  const { goBack, navigate } = useAppNavigation();
  const { setVerificationSuccessRoute } = useAppContext();
  const [email, setEmail] = useState('oth-staff@example.invalid');
  const [sending, setSending] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleSendEmail = async () => {
    if (!email.trim()) {
      Alert.alert('이메일 입력', '이메일 주소를 입력해주세요.');
      return;
    }
    try {
      setSending(true);
      await new Promise((resolve) => setTimeout(resolve, 600));
      setEmailSent(true);
      Alert.alert('전송 완료', '입력한 이메일로 인증코드를 전송했어요.');
    } finally {
      setSending(false);
    }
  };

  const handleConfirm = () => {
    if (!email.trim()) {
      Alert.alert('이메일 입력', '이메일 주소를 입력해주세요.');
      return;
    }
    setVerificationSuccessRoute(ROUTES.myInfoEdit);
    navigate(ROUTES.verificationCode);
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


