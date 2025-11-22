import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Header, PrimaryButton } from '../components';
import { COLORS } from '../constants';

interface LoginScreenProps {
  onBackPress?: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onBackPress }) => {
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
        onBackPress={onBackPress}
        showBackButton={Boolean(onBackPress)}
      />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.formField}>
          <Text style={styles.label}>이메일</Text>
          <TextInput
            style={styles.input}
            placeholder="이메일을 입력해주세요."
            placeholderTextColor="#dedede"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />
        </View>

        <View style={styles.formField}>
          <Text style={styles.label}>비밀번호</Text>
          <View style={styles.passwordWrapper}>
            <TextInput
              style={[styles.input, styles.passwordInput]}
              placeholder="비밀번호를 입력해주세요."
              placeholderTextColor="#dedede"
              secureTextEntry={!isPasswordVisible}
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity
              style={styles.eyeButton}
              onPress={() => setIsPasswordVisible((prev) => !prev)}
              activeOpacity={0.7}
            >
              <Text style={styles.eyeText}>{isPasswordVisible ? '숨김' : '보기'}</Text>
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity
          style={styles.rememberRow}
          onPress={() => setRememberId((prev) => !prev)}
          activeOpacity={0.8}
        >
          <View style={[styles.checkbox, rememberId && styles.checkboxSelected]}>
            {rememberId && <View style={styles.checkboxDot} />}
          </View>
          <Text style={styles.rememberLabel}>아이디 기억하기</Text>
        </TouchableOpacity>

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
  formField: {
    width: '100%',
    maxWidth: 327,
    alignSelf: 'center',
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    lineHeight: 24,
    color: '#2a2727',
    fontFamily: 'Roboto-Medium',
    marginBottom: 8,
  },
  input: {
    height: 52,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#dedede',
    backgroundColor: '#fefefe',
    paddingHorizontal: 16,
    fontSize: 14,
    color: '#2a2727',
    fontFamily: 'Roboto-Bold',
  },
  passwordWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  passwordInput: {
    flex: 1,
    paddingRight: 46,
  },
  eyeButton: {
    position: 'absolute',
    right: 12,
    height: 24,
    width: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  eyeText: {
    fontSize: 12,
    color: '#a0a0a0',
    fontFamily: 'Roboto-Medium',
  },
  rememberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: -8,
    width: '100%',
    maxWidth: 327,
    alignSelf: 'center',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#dedede',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxSelected: {
    borderColor: COLORS.buttonPrimary,
  },
  checkboxDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: COLORS.buttonPrimary,
  },
  rememberLabel: {
    fontSize: 13,
    color: '#2a2727',
    fontFamily: 'Roboto-Bold',
    marginLeft: 12,
  },
  loginButtonWrapper: {
    width: '100%',
    maxWidth: 327,
    alignSelf: 'center',
    marginTop: 48,
  },
  disclaimer: {
    marginTop: 24,
    width: '100%',
    maxWidth: 327,
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

