

import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Platform,
} from 'react-native';
import { COLORS, FONTS, SIZES } from '../constants';
import {
  unlockUserWallets,
  type WalletKey,
} from '../services/walletKeyStore';

interface Props {
  memberId: number;
  email: string;   
  visible: boolean;

  onSuccess: (wallets: WalletKey[], pin: string) => void;
  onCancel: () => void;
}

type Step = 'enter' | 'verifying' | 'error';

export const WalletKeyPinPromptModal: React.FC<Props> = ({
  memberId,
  email,
  visible,
  onSuccess,
  onCancel,
}) => {
  const [step, setStep] = useState<Step>('enter');
  const [pin, setPin] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (visible) {
      setStep('enter');
      setPin('');
      setErrorMsg('');
    }
  }, [visible]);

  useEffect(() => {
    if (step === 'enter' && pin.length === 6) {
      handleVerify(pin);
    }

  }, [pin, step]);

  const handleVerify = async (currentPin: string) => {
    setStep('verifying');

    await new Promise<void>((r) => setTimeout(r, 0));

    const result = await unlockUserWallets(currentPin, email, memberId);
    if (result.ok) {

      onSuccess(result.wallets, currentPin);
      setPin('');
      return;
    }

    const msg = result.reason === 'wrong-pin'
      ? 'PIN 이 일치하지 않습니다'
      : __DEV__
        ? `검증 실패: ${result.reason}`
        : '검증 실패 — 다시 시도해주세요';
    if (__DEV__) {
      console.warn('[WalletKeyPinPromptModal] unlock fail reason:', result.reason);
    }
    setErrorMsg(msg);
    setStep('error');
    setPin('');
  };

  const handleRetry = () => {
    setStep('enter');
    setPin('');
    setErrorMsg('');
  };

  const onPressDigit = (d: string) => {
    if (step !== 'enter') return;
    if (pin.length >= 6) return;
    setPin(pin + d);
  };

  const onPressBackspace = () => {
    if (step !== 'enter') return;
    if (pin.length === 0) return;
    setPin(pin.slice(0, -1));
  };

  const isInputStep = step === 'enter';

  return (
    <Modal visible={visible} animationType="fade" transparent={false}>
      <View style={styles.overlay}>
        {}
        <Text style={styles.title}>지갑 보호 PIN 확인</Text>

        {}
        <Text style={styles.warning}>
          지갑 키 보호 전용입니다.
        </Text>

        {}
        {step === 'enter' && (
          <Text style={styles.prompt}>6자리 PIN 을 입력해주세요</Text>
        )}
        {step === 'verifying' && (
          <Text style={styles.prompt}>검증 중...</Text>
        )}
        {step === 'error' && (
          <Text style={styles.prompt}>다시 시도해주세요</Text>
        )}

        {}
        <View style={styles.dotsRow}>
          {Array.from({ length: 6 }).map((_, i) => (
            <View
              key={i}
              style={[styles.dot, pin.length > i && styles.dotFilled]}
            />
          ))}
        </View>

        {step === 'error' && !!errorMsg && (
          <Text style={styles.error}>{errorMsg}</Text>
        )}

        {step === 'verifying' && (
          <View style={styles.loadingRow}>
            <ActivityIndicator size="small" color={COLORS.buttonPrimary} />
          </View>
        )}

        {step === 'error' && (
          <TouchableOpacity style={styles.retryButton} onPress={handleRetry}>
            <Text style={styles.retryText}>다시 시도</Text>
          </TouchableOpacity>
        )}

        {}
        {isInputStep && (
          <View style={styles.keypad}>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
              <TouchableOpacity
                key={n}
                style={styles.key}
                onPress={() => onPressDigit(String(n))}
              >
                <Text style={styles.keyText}>{n}</Text>
              </TouchableOpacity>
            ))}
            {}
            <TouchableOpacity style={styles.key} onPress={onCancel}>
              <Text style={[styles.keyText, { fontSize: 14, color: COLORS.darkGray }]}>취소</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.key}
              onPress={() => onPressDigit('0')}
            >
              <Text style={styles.keyText}>0</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.key} onPress={onPressBackspace}>
              <Text style={[styles.keyText, { fontSize: 18 }]}>{'<'}</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: SIZES.large,
    paddingTop: Platform.OS === 'ios' ? 80 : 60,
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontFamily: FONTS.semiBold,
    color: COLORS.titleText,
    marginBottom: 8,
  },
  warning: {
    fontSize: 13,
    color: COLORS.darkGray,
    marginBottom: 24,
    textAlign: 'center',
  },
  prompt: {
    fontSize: 16,
    fontFamily: FONTS.medium,
    color: COLORS.darkGray,
    marginBottom: 28,
  },
  dotsRow: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  dot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#eee',
    marginHorizontal: 8,
  },
  dotFilled: {
    backgroundColor: COLORS.buttonPrimary,
  },
  error: {
    fontSize: 14,
    color: '#d44',
    marginTop: 8,
    marginBottom: 16,
    textAlign: 'center',
  },
  loadingRow: {
    marginTop: 12,
  },
  retryButton: {
    marginTop: 12,
    paddingHorizontal: 28,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: COLORS.buttonPrimary,
  },
  retryText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: FONTS.semiBold,
  },
  keypad: {
    marginTop: 24,
    width: 300,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  key: {
    width: 90,
    height: 70,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 6,
  },
  keyText: {
    fontSize: 24,
    fontFamily: FONTS.semiBold,
    color: COLORS.titleText,
  },
});
