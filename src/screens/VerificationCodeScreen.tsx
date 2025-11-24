import React, { useEffect, useMemo, useState } from 'react';
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
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Header, PrimaryButton } from '../components';
import { COLORS } from '../constants';
import { ROUTES, useAppNavigation } from '../navigation';
import { useAppContext } from '../context';
import {
  verifyEmailCode,
  loginWithEmailAuth,
  encryptSHA256,
  saveSession,
  sendEmailVerificationCode,
} from '../services';

const CODE_LENGTH = 6;
const RESEND_SECONDS = 300;

const keypadLayout = [['1', '2', '3'], ['4', '5', '6'], ['7', '8', '9'], ['', '0', '⌫']];

export const VerificationCodeScreen = () => {
  const { goBack, reset, navigate } = useAppNavigation();
  const {
    verificationSuccessRoute,
    resetVerificationSuccessRoute,
    verificationEmail,
  } = useAppContext();
  const [code, setCode] = useState('');
  const [secondsLeft, setSecondsLeft] = useState(RESEND_SECONDS);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);

  useEffect(() => {
    if (secondsLeft <= 0) {
      return;
    }
    const timer = setInterval(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearInterval(timer);
  }, [secondsLeft]);

  const formattedTimer = useMemo(() => {
    const minutes = Math.floor(secondsLeft / 60)
      .toString()
      .padStart(2, '0');
    const seconds = (secondsLeft % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
  }, [secondsLeft]);

  const handleKeyPress = (value: string) => {
    if (value === '⌫') {
      setCode((prev) => prev.slice(0, -1));
      return;
    }
    if (value === '' || code.length >= CODE_LENGTH) {
      return;
    }
    setCode((prev) => prev + value);
  };

  const handleVerify = async () => {
    if (!verificationEmail) {
      Alert.alert('오류', '이메일 정보를 찾을 수 없습니다.');
      return;
    }

    if (code.length !== CODE_LENGTH) {
      Alert.alert('인증 코드 입력', '6자리 인증 코드를 입력해주세요.');
      return;
    }

    setIsVerifying(true);

    try {

      console.log('[로그인] 이메일 인증 코드 확인 요청:', verificationEmail);
      const codeVerified = await verifyEmailCode(verificationEmail, code, navigate);

      if (!codeVerified) {
        Alert.alert('인증 실패', '인증 코드가 올바르지 않습니다. 다시 확인해주세요.');
        setIsVerifying(false);
        return;
      }

      console.log('[로그인] 이메일 로그인 요청:', verificationEmail);
      const loginResponse = await loginWithEmailAuth(verificationEmail, navigate);

      if (loginResponse.status !== 'success') {
        Alert.alert('로그인 실패', '로그인에 실패했습니다. 다시 시도해주세요.');
        setIsVerifying(false);
        return;
      }

      const userData = loginResponse.data[0];
      if (!userData || !userData.member) {
        Alert.alert('로그인 실패', '사용자 정보를 가져올 수 없습니다.');
        setIsVerifying(false);
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

      await AsyncStorage.removeItem('userData');
      await AsyncStorage.removeItem('userSessionToken');
      await AsyncStorage.setItem('userEmail', verificationEmail);
      await AsyncStorage.setItem('userData', JSON.stringify(userData));
      const sessionToken = userData.extrastr || '';
      await AsyncStorage.setItem('userSessionToken', sessionToken);
      await AsyncStorage.setItem('isLoggedIn', 'true');

      console.log('[로그인] 이메일 인증 로그인 성공');

      resetVerificationSuccessRoute();
      reset(verificationSuccessRoute || ROUTES.map);
    } catch (error) {
      console.error('[로그인] 이메일 인증 로그인 오류:', error);
      Alert.alert('오류', '로그인 처리 중 오류가 발생했습니다.');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResend = async () => {
    if (!verificationEmail) {
      Alert.alert('오류', '이메일 정보를 찾을 수 없습니다.');
      return;
    }

    setIsResending(true);

    try {
      console.log('[로그인] 이메일 인증 코드 재전송 요청:', verificationEmail);
      const codeSent = await sendEmailVerificationCode(verificationEmail, navigate);

      if (codeSent) {
        setSecondsLeft(RESEND_SECONDS);
        setCode('');
        Alert.alert('재전송 완료', '인증 코드를 다시 전송했습니다.');
      } else {
        Alert.alert('재전송 실패', '인증 코드 재전송에 실패했습니다. 다시 시도해주세요.');
      }
    } catch (error) {
      console.error('[로그인] 인증 코드 재전송 오류:', error);
      Alert.alert('오류', '인증 코드 재전송 중 오류가 발생했습니다.');
    } finally {
      setIsResending(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <Header title="인증코드를 입력하세요" onBackPress={goBack} showBackButton />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.descriptionWrapper}>
          <Text style={styles.description}>
            {verificationEmail || '이메일'}로{'\n'}보내드린 6자리 코드를 입력하세요.
          </Text>
        </View>

        <View style={styles.codeRow}>
          {Array.from({ length: CODE_LENGTH }).map((_, index) => {
            const digit = code[index] ?? '';
            return (
              <View key={index} style={styles.codeBox}>
                <Text style={styles.codeText}>{digit}</Text>
              </View>
            );
          })}
        </View>

        <TouchableOpacity
          style={styles.resendWrapper}
          onPress={secondsLeft <= 0 && !isResending ? handleResend : undefined}
          activeOpacity={secondsLeft <= 0 && !isResending ? 0.7 : 1}
          disabled={secondsLeft > 0 || isResending}
        >
          {isResending ? (
            <ActivityIndicator size="small" color="#2873ff" />
          ) : (
            <Text style={styles.resendText}>
              코드 재전송{' '}
              {secondsLeft > 0 && (
                <Text style={styles.resendTimer} numberOfLines={1}>
                  {formattedTimer}
                </Text>
              )}
            </Text>
          )}
        </TouchableOpacity>

        <View style={styles.buttonWrapper}>
          {isVerifying ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color={COLORS.buttonPrimary} />
            </View>
          ) : (
            <PrimaryButton
              title="Verify"
              onPress={handleVerify}
              fullWidth
              disabled={code.length !== CODE_LENGTH || isVerifying}
            />
          )}
        </View>

        <View style={styles.keyboardContainer}>
          {keypadLayout.map((row, rowIndex) => (
            <View key={rowIndex} style={styles.keyboardRow}>
              {row.map((value, colIndex) => (
                <TouchableOpacity
                  key={colIndex}
                  style={[styles.keyButton, value === '' && styles.keyButtonPlaceholder]}
                  activeOpacity={value ? 0.6 : 1}
                  onPress={() => value && handleKeyPress(value)}
                >
                  {value !== '' && <Text style={styles.keyText}>{value}</Text>}
                </TouchableOpacity>
              ))}
            </View>
          ))}
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
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 60,
  },
  descriptionWrapper: {
    width: '100%',
    maxWidth: 327,
    alignSelf: 'center',
    marginBottom: 24,
  },
  description: {
    fontSize: 14,
    lineHeight: 24,
    color: '#747474',
    fontFamily: 'Roboto-Regular',
  },
  codeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    maxWidth: 327,
    alignSelf: 'center',
    marginBottom: 24,
  },
  codeBox: {
    width: 45,
    height: 50,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#dedede',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  codeText: {
    fontSize: 20,
    fontFamily: 'Roboto-Bold',
    color: COLORS.headerText,
  },
  resendWrapper: {
    alignItems: 'center',
    marginBottom: 24,
  },
  resendText: {
    fontSize: 16,
    lineHeight: 24,
    color: COLORS.headerText,
    fontFamily: 'Roboto-Medium',
  },
  resendTimer: {
    color: '#2873ff',
    fontFamily: 'Roboto-Medium',
  },
  buttonWrapper: {
    width: '100%',
    maxWidth: 780,
    alignSelf: 'center',
    marginBottom: 32,
  },
  keyboardContainer: {
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 16,
  },
  keyboardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  keyButton: {
    flex: 1,
    marginHorizontal: 4,
    height: 56,
    borderRadius: 12,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#f2f2f2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  keyButtonPlaceholder: {
    borderWidth: 0,
    backgroundColor: 'transparent',
  },
  keyText: {
    fontSize: 24,
    fontFamily: 'Roboto-Bold',
    color: '#10192d',
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

