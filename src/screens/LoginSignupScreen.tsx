import React from 'react';
import { View, Text, StyleSheet, ScrollView, Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { PrimaryButton, SecondaryButton } from '../components';
import { COLORS } from '../constants';

interface LoginSignupScreenProps {
  onLoginPress?: () => void;
}

export const LoginSignupScreen: React.FC<LoginSignupScreenProps> = ({
  onLoginPress,
}) => {
  const handleLogin = () => {
    if (onLoginPress) {
      onLoginPress();
      return;
    }
    console.log('Login pressed');

  };

  const handleSignUp = () => {
    console.log('Sign up pressed');

  };

  const handleTermsOfService = () => {

    console.log('Terms of Service pressed');
  };

  const handlePrivacyPolicy = () => {

    console.log('Privacy Policy pressed');
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {}
        <View style={styles.adContainer}>
          <Text style={styles.adText}>전면 광고</Text>
        </View>

        {}
        <View style={styles.buttonContainer}>
          <PrimaryButton
            title="Login"
            onPress={handleLogin}
            fullWidth={true}
            style={styles.loginButton}
          />
          <SecondaryButton
            title="회원가입"
            onPress={handleSignUp}
            fullWidth={true}
          />
        </View>

        {}
        <View style={styles.termsContainer}>
          <Text style={styles.termsText}>
            이 앱에서 제공하는 기능과 정보 이용 방식에 대해 알아보려면{'\n'}
            아래의{' '}
            <Text style={styles.linkText} onPress={handleTermsOfService}>
              이용약관
            </Text>
            {' '}과{' '}
            <Text style={styles.linkText} onPress={handlePrivacyPolicy}>
              개인정보 처리방침
            </Text>
            을 읽고 동의해주세요.
          </Text>
        </View>
      </ScrollView>

      {}
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
    paddingTop: 58, 
    paddingBottom: 34,
  },
  adContainer: {
    width: 327,
    height: 393,
    backgroundColor: '#d9d9d9',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 44, 
    alignSelf: 'center',
  },
  adText: {
    fontSize: 30,
    fontWeight: '500',
    color: COLORS.text,
    fontFamily: 'Roboto-Medium',
  },
  buttonContainer: {
    width: 327,
    marginTop: 48, 
    gap: 15,
    alignSelf: 'center',
  },
  loginButton: {
    marginBottom: 0,
  },
  termsContainer: {
    width: 317,
    marginTop: 97, 
    alignSelf: 'center',
  },
  termsText: {
    fontSize: 12,
    lineHeight: 15,
    color: '#4c4e55',
    fontFamily: 'Roboto-Regular',
    textAlign: 'left',
    letterSpacing: 0.06,
  },
  linkText: {
    fontSize: 12,
    lineHeight: 15,
    color: '#4c4e55',
    fontFamily: 'Roboto-Bold',
    fontWeight: 'bold',
    letterSpacing: 0.06,
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

