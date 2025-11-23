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
import { COLORS, SIZES, COMMON_STYLES } from '../constants';
import { ROUTES, useAppNavigation } from '../navigation';

export const LoginScreen = () => {
  const { goBack, navigate } = useAppNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberId, setRememberId] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const emailVerificationRoute: any = ROUTES.emailVerification;

  const handleLogin = () => {
    console.log('로그인 시도', { email, rememberId });
    navigate(ROUTES.wallet);
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
        />

        <FormField
          label="비밀번호"
          placeholder="비밀번호를 입력해주세요."
          secureTextEntry={!isPasswordVisible}
          value={password}
          onChangeText={setPassword}
          containerStyle={styles.fieldContainer}
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

        <View style={styles.bottomSection}>
          <View style={styles.loginButtonWrapper}>
            <PrimaryButton title="로그인" fullWidth onPress={handleLogin} />
          </View>

          <Text style={styles.disclaimer}>
            비밀번호를 잊으셨다면, 이메일로 받은 인증코드를 사용해 로그인할 수 있습니다.
          </Text>

          <TouchableOpacity
            style={styles.emailVerification}
            onPress={() => navigate(emailVerificationRoute)}
            activeOpacity={0.7}
          >
            <Text style={styles.emailVerificationText}>이메일 인증</Text>

          </TouchableOpacity>

          <TouchableOpacity
            style={styles.mapLink}
            onPress={() => navigate(ROUTES.map)}
            activeOpacity={0.7}
          >
            <Text style={styles.mapLinkText}>맵 페이지 (임시 주의)</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.mapLink}
            onPress={() => navigate(ROUTES.myInfo)}
            activeOpacity={0.7}
          >
            <Text style={styles.mapLinkText}>마이페이지지</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.mapLink}
            onPress={() => navigate(ROUTES.referralMyGroup)}
            activeOpacity={0.7}
          >
            <Text style={styles.mapLinkText}>추천 화면</Text>
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
});

