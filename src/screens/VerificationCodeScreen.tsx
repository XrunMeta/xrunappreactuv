import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Header, PrimaryButton } from '../components';
import { COLORS } from '../constants';
import { useAppNavigation, ROUTES } from '../navigation';

const CODE_LENGTH = 6;
const RESEND_SECONDS = 300;

const keypadLayout = [['1', '2', '3'], ['4', '5', '6'], ['7', '8', '9'], ['', '0', '⌫']];

export const VerificationCodeScreen = () => {
  const { goBack, navigate } = useAppNavigation();
  const [code, setCode] = useState('');
  const [secondsLeft, setSecondsLeft] = useState(RESEND_SECONDS);

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

  const handleVerify = () => {
    console.log('코드 확인', code);
    navigate(ROUTES.login);
  };

  const handleResend = () => {
    setSecondsLeft(RESEND_SECONDS);
    setCode('');
    console.log('코드 재전송 요청');
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <Header title="인증코드를 입력하세요" onBackPress={goBack} showBackButton />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.descriptionWrapper}>
          <Text style={styles.description}>
            oth-staff@example.invalid 이메일로{'\n'}보내드린 6자리 코드를 입력하세요.
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
          onPress={secondsLeft <= 0 ? handleResend : undefined}
          activeOpacity={secondsLeft <= 0 ? 0.7 : 1}
        >
          <Text style={styles.resendText}>
            코드 재전송{' '}
            <Text style={styles.resendTimer} numberOfLines={1}>
              {formattedTimer}
            </Text>
          </Text>
        </TouchableOpacity>

        <View style={styles.buttonWrapper}>
          <PrimaryButton
            title="Verify"
            onPress={handleVerify}
            fullWidth
            disabled={code.length !== CODE_LENGTH}
          />
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
});


