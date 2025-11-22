import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { FormCheckbox, FormField, Header, PrimaryButton } from '../components';
import { COLORS } from '../constants';
import { useAppNavigation } from '../navigation';

export const LoginScreen = () => {
  const { goBack } = useAppNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberId, setRememberId] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const handleLogin = () => {
    console.log('로그인 시도', { email, rememberId });

  };

  const handleEmailVerification = () => {
    console.log('이메일 인증 화면으로 이동');

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
        />

        <FormField
          label="비밀번호"
          placeholder="비밀번호를 입력해주세요."
          secureTextEntry={!isPasswordVisible}
          value={password}
          onChangeText={setPassword}
          rightAccessory={
            <TouchableOpacity
              style={styles.eyeButton}
              onPress={() => setIsPasswordVisible((prev) => !prev)}
              activeOpacity={0.7}
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
          />
        </View>

        <View style={styles.loginButtonWrapper}>
          <PrimaryButton title="로그인" fullWidth onPress={handleLogin} />
        </View>

        <Text style={styles.disclaimer}>
          비밀번호를 잊으셨다면, 이메일로 받은 인증코드를 사용해 로그인할 수 있습니다.
        </Text>

        <TouchableOpacity
          style={styles.emailVerification}
          onPress={handleEmailVerification}
          activeOpacity={0.7}
        >
          <Text style={styles.emailVerificationText}>이메일 인증</Text>
        </TouchableOpacity>
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
    paddingBottom: 40,
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
  loginButtonWrapper: {
    width: '100%',
    maxWidth: 780,
    alignSelf: 'center',
    marginTop: 48,
  },
  disclaimer: {
    marginTop: 24,
    width: '100%',
    alignSelf: 'center',
    fontSize: 12,
    lineHeight: 15,
    color: '#4c4e55',
    fontFamily: 'Roboto-Regular',
  },
  emailVerification: {
    marginTop: 24,
    alignSelf: 'flex-start',
    marginLeft: 24,
  },
  emailVerificationText: {
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
});

