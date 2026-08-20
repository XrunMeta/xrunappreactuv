

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
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, SIZES } from '../constants';
import { LoadingText } from './AnimatedDots';
import { TID } from '../testIDs';
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

  skipVaultCheck?: boolean;

  processingLabel?: string;

  titleOverride?: string;

  descriptionOverride?: string;

  requireConfirm?: boolean;
}

type Step = 'enter' | 'confirm' | 'verifying' | 'processing' | 'error';

export const WalletKeyPinPromptModal: React.FC<Props> = ({
  memberId,
  email,
  visible,
  onSuccess,
  onCancel,
  skipVaultCheck = false,
  processingLabel,
  titleOverride,
  descriptionOverride,
  requireConfirm = false,
}) => {
  const { t } = useTranslation();
  const [step, setStep] = useState<Step>('enter');
  const [pin, setPin] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [firstPin, setFirstPin] = useState(''); 

  useEffect(() => {
    if (visible) {
      setStep('enter');
      setPin('');
      setFirstPin('');
      setErrorMsg('');
    }
  }, [visible]);

  useEffect(() => {
    if (pin.length !== 6) return;
    if (step === 'enter' || step === 'error') {
      if (requireConfirm) {
        setFirstPin(pin);
        setPin('');
        setErrorMsg('');
        setStep('confirm');
      } else {
        handleVerify(pin);
      }
    } else if (step === 'confirm') {
      if (pin === firstPin) {
        handleVerify(pin);
      } else {
        setErrorMsg(t('components.walletKeyPinPrompt.mismatch') || 'PIN 이 일치하지 않아요. 다시 입력해주세요.');
        setPin('');
        setFirstPin('');
        setStep('error');
      }
    }

  }, [pin, step]);

  const handleVerify = async (currentPin: string) => {
    setStep('verifying');

    await new Promise<void>((r) => setTimeout(r, 0));

    if (skipVaultCheck) {
      if (/^\d{6}$/.test(currentPin)) {
        setStep('processing');
        try { await onSuccess([], currentPin); } catch {  }
        setPin('');
        return;
      }
      setErrorMsg(t('components.walletKeyPinPrompt.formatError'));
      setStep('error');
      setPin('');
      return;
    }

    const result = await unlockUserWallets(currentPin, email, memberId);
    if (result.ok) {

      setStep('processing');
      try { await onSuccess(result.wallets, currentPin); } catch {  }
      setPin('');
      return;
    }

    if (__DEV__) {
      console.warn('[WalletKeyPinPromptModal] unlock fail reason:', result.reason);
    }
    setErrorMsg('');
    setStep('error');
    setPin('');
  };

  const _unusedHandleRetry = () => {
    setStep('enter');
    setPin('');
    setErrorMsg('');
  };
  void _unusedHandleRetry;

  const onPressDigit = (d: string) => {

    if (step === 'error') {
      setStep('enter');
      setErrorMsg('');
    } else if (step !== 'enter' && step !== 'confirm') return;
    if (pin.length >= 6) return;
    setPin(pin + d);
  };

  const onPressBackspace = () => {
    if (step === 'error') {
      setStep('enter');
      setErrorMsg('');
      return;
    }
    if (step !== 'enter' && step !== 'confirm') return;
    if (pin.length === 0) return;
    setPin(pin.slice(0, -1));
  };

  const isInputStep = step === 'enter' || step === 'error' || step === 'confirm';

  const canGoBack = step !== 'verifying' && step !== 'processing';

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={false}
      onRequestClose={canGoBack ? onCancel : () => {}}
    >
      <View style={styles.overlay}>
        {}
        <View style={styles.header}>
          {canGoBack && (
            <TouchableOpacity
              style={styles.headerBackButton}
              onPress={onCancel}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            >
              <Ionicons name="arrow-back" size={24} color={COLORS.text} />
            </TouchableOpacity>
          )}
        </View>
        {}
        <View style={styles.centerBlock}>
          {}
          <Text testID={TID.walletKeyPinPrompt.titleLabel} style={styles.title}>
            {step === 'confirm'
              ? (t('components.walletKeyPinPrompt.confirmTitle') || 'PIN 다시 입력')
              : (titleOverride ?? t('components.walletKeyPinPrompt.title'))}
          </Text>

          {}
          <Text style={styles.warning}>
            {descriptionOverride ?? t('components.walletKeyPinPrompt.warning')}
          </Text>

          {}
          {step === 'enter' && (
            <Text style={styles.prompt}>{t('components.walletKeyPinPrompt.enterPrompt')}</Text>
          )}
          {step === 'confirm' && (
            <Text style={styles.prompt}>
              {t('components.walletKeyPinPrompt.confirmPrompt') || '확인을 위해 같은 PIN 을 한 번 더 입력해주세요'}
            </Text>
          )}
          {step === 'verifying' && (
            <LoadingText text={t('components.walletKeyPinPrompt.verifying')} style={styles.prompt} />
          )}
          {step === 'processing' && (
            <View>
              <LoadingText
                text={processingLabel || t('components.walletKeyPinPrompt.processingDefault')}
                style={styles.prompt}
              />
              <Text style={styles.prompt}>{t('components.walletKeyPinPrompt.processingSubtitle')}</Text>
            </View>
          )}
          {step === 'error' && (
            <Text style={styles.prompt}>{t('components.walletKeyPinPrompt.error')}</Text>
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

          {(step === 'verifying' || step === 'processing') && (
            <View style={styles.loadingRow}>
              <ActivityIndicator size="small" color={COLORS.buttonPrimary} />
            </View>
          )}
          {}
        </View>

        {
}
        <View
          style={[styles.keypad, !isInputStep && { opacity: 0 }]}
          pointerEvents={isInputStep ? 'auto' : 'none'}
        >
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
              <TouchableOpacity
                key={n}
                testID={`${TID.walletKeyPinPrompt.key}-${n}`}
                style={styles.key}
                onPress={() => onPressDigit(String(n))}
              >
                <Text style={styles.keyText}>{n}</Text>
              </TouchableOpacity>
            ))}
            {}
            <TouchableOpacity testID={TID.walletKeyPinPrompt.cancel} style={styles.key} onPress={onCancel}>
              <Text style={[styles.keyText, { fontSize: 14, color: COLORS.darkGray }]}>{t('components.walletKeyPinPrompt.cancel')}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              testID={`${TID.walletKeyPinPrompt.key}-0`}
              style={styles.key}
              onPress={() => onPressDigit('0')}
            >
              <Text style={styles.keyText}>0</Text>
            </TouchableOpacity>
            <TouchableOpacity testID={TID.walletKeyPinPrompt.backspace} style={styles.key} onPress={onPressBackspace}>
              <Text style={[styles.keyText, { fontSize: 18 }]}>{'<'}</Text>
            </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: SIZES.large,
    alignItems: 'center',
  },

  header: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: Platform.OS === 'ios' ? 50 : 30,
    paddingBottom: 8,
  },
  headerBackButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerBlock: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: FONTS.size.large,
    fontWeight: '700',
    color: COLORS.text,
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 8,
  },
  warning: {
    fontSize: FONTS.size.msmall,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 24,
    paddingHorizontal: 8,
  },
  prompt: {
    fontSize: FONTS.size.medium,
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: 24,
    fontWeight: '500',
  },
  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  dot: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: '#CBD5E1',
    marginHorizontal: 8,
  },
  dotFilled: {
    backgroundColor: '#343a5a',
    borderColor: '#343a5a',
  },
  error: {
    fontSize: 13,
    color: '#EF4444',
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 8,
  },
  loadingRow: {
    marginTop: 12,
  },
  retryButton: {
    marginTop: 24,
    paddingHorizontal: 32,
    paddingVertical: 12,
    backgroundColor: COLORS.buttonPrimary,
    borderRadius: 8,
  },
  retryText: {
    color: '#fff',
    fontSize: FONTS.size.medium,
    fontWeight: '600',
  },
  keypad: {
    marginTop: 'auto',
    marginBottom: Platform.OS === 'ios' ? 32 : 16,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    width: '100%',
  },
  key: {
    width: '30%',
    aspectRatio: 1.5,
    margin: '1.5%',
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  keyText: {
    fontSize: 26,
    fontWeight: '600',
    color: COLORS.text,
  },
});
