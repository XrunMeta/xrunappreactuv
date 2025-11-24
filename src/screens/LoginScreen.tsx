import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FormCheckbox, FormField, Header, PrimaryButton } from '../components';
import { COLORS, SIZES, COMMON_STYLES } from '../constants';
import { ROUTES, useAppNavigation } from '../navigation';
import {
  loginWithEmailPassword,
  encryptSHA256,
  saveSession,
} from '../services';

export const LoginScreen = () => {
  const { goBack, navigate } = useAppNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberId, setRememberId] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const emailVerificationRoute: any = ROUTES.emailVerification;

  const handleLogin = async () => {

    if (!email.trim()) {
      Alert.alert('오류', '이메일을 입력해주세요.');
      return;
    }

    if (!password.trim()) {
      Alert.alert('오류', '비밀번호를 입력해주세요.');
      return;
    }

    setIsLoading(true);

    try {
      console.log('[로그인] 로그인 시도:', { email, rememberId });

      const loginResponse = await loginWithEmailPassword(
        email.trim(),
        password,
        navigate,
      );

      if (loginResponse.status !== 'success') {
        Alert.alert('로그인 실패', '이메일 또는 비밀번호가 올바르지 않습니다.');
        setIsLoading(false);
        return;
      }

      const userData = loginResponse.data[0];
      if (!userData) {
        Alert.alert('로그인 실패', '사용자 정보를 가져올 수 없습니다.');
        setIsLoading(false);
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

      await AsyncStorage.removeItem('userEmail');
      await AsyncStorage.removeItem('userData');
      await AsyncStorage.removeItem('userSessionToken');

      await AsyncStorage.setItem('userEmail', email.trim());
      await AsyncStorage.setItem('userData', JSON.stringify(userData));

      const sessionToken = userData.extrastr || '';
      await AsyncStorage.setItem('userSessionToken', sessionToken);

      if (rememberId) {
        await AsyncStorage.setItem('rememberMe', 'true');
      } else {
        await AsyncStorage.removeItem('rememberMe');
      }

      await AsyncStorage.setItem('isLoggedIn', 'true');

      console.log('[로그인] 로그인 성공');

      navigate(ROUTES.map);
    } catch (error) {
      console.error('[로그인] 로그인 오류:', error);
      Alert.alert(
        '로그인 실패',
        '로그인 중 오류가 발생했습니다. 다시 시도해주세요.',
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <Header
        title="로그인"
        onBackPress={goBack}
        showBackButton
      />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <FormField
          label="이메일"
          placeholder="이메일을 입력해주세요."
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
          containerStyle={styles.fieldContainer}
          editable={!isLoading}
        />

        <FormField
          label="비밀번호"
          placeholder="비밀번호를 입력해주세요."
          secureTextEntry={!isPasswordVisible}
          value={password}
          onChangeText={setPassword}
          containerStyle={styles.fieldContainer}
          editable={!isLoading}
          rightAccessory={
            <TouchableOpacity
              style={styles.eyeButton}
              onPress={() => setIsPasswordVisible((prev) => !prev)}
              activeOpacity={0.7}
              disabled={isLoading}
            >
              <Ionicons
                name={isPasswordVisible ? 'eye-outline' : 'eye-off-outline'}
                size={20}
                color="#666666"
              />
            </TouchableOpacity>
          }
        />

        <View style={styles.checkboxRow}>
          <FormCheckbox
            label="아이디 기억하기"
            checked={rememberId}
            onToggle={() => setRememberId((prev) => !prev)}
            variant="circle"
            disabled={isLoading}
          />
        </View>

        <View style={styles.bottomSection}>
          <View style={styles.loginButtonWrapper}>
            {isLoading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="small" color={COLORS.buttonPrimary} />
              </View>
            ) : (
              <PrimaryButton title="로그인" fullWidth onPress={handleLogin} />
            )}
          </View>

          <Text style={styles.disclaimer}>
            비밀번호를 잊으셨다면, 이메일로 받은 인증코드를 사용해 로그인할 수 있습니다.
          </Text>

          <TouchableOpacity
            style={styles.emailVerification}
            onPress={() => navigate(emailVerificationRoute)}
            activeOpacity={0.7}
            disabled={isLoading}
          >
            <Text style={styles.emailVerificationText}>이메일 인증</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

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
    paddingTop: 24,
    paddingBottom: Platform.OS === 'android' 
      ? 16 + SIZES.medium 
      : 40,
    justifyContent: 'space-between',
  },
  fieldContainer: {
    width: '100%',
    maxWidth: 780,
    alignSelf: 'center',
  },
  eyeButton: {
    height: 24,
    width: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxRow: {
    width: '100%',
    maxWidth: 780,
    alignSelf: 'center',
    marginTop: -8,
    marginBottom: 16,
  },
  bottomSection: {
    ...COMMON_STYLES.bottomSection,
  },
  loginButtonWrapper: {
    width: '100%',
    marginBottom: SIZES.medium, 
  },
  disclaimer: {
    width: '100%',
    fontSize: 12,
    lineHeight: 15,
    color: '#4c4e55',
    fontFamily: 'Roboto-Regular',
  },
  emailVerification: {
    marginTop: 24,
    width: '100%',
    alignItems: 'flex-start',
  },
  emailVerificationText: {
    fontSize: 14,
    lineHeight: 20,
    color: '#4c4e55',
    fontFamily: 'Roboto-Bold',
  },
  mapLink: {
    marginTop: 24,
    width: '100%',
    alignItems: 'flex-start',
  },
  mapLinkText: {
    fontSize: 14,
    lineHeight: 20,
    color: '#4c4e55',
    fontFamily: 'Roboto-Bold',
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
  loadingContainer: {
    height: 56,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

