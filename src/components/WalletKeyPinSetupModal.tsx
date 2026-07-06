

import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  BackHandler,
  ActivityIndicator,
  StyleSheet,
  Platform,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { COLORS, FONTS, SIZES } from '../constants';
import { LoadingText } from './AnimatedDots';
import {
  findEntry,
  findEntriesForUser,
  upsertEntry,
  deobfuscateWithMember,
  verifyAllWallets,
  setupPinForUser,
  type WalletKey,
  type VaultEntry,
  type WalletNetwork,
} from '../services/walletKeyStore';
import { markWalletKeyAT, upsertWalletPin, deleteServerSavedstring } from '../services';

interface Props {
  memberId: number;
  email: string;   
  visible: boolean;
  onSuccess: () => void;
}

type Step = 'enter' | 'confirm' | 'verifying' | 'error';

export const WalletKeyPinSetupModal: React.FC<Props> = ({
  memberId,
  email,
  visible,
  onSuccess,
}) => {
  const { t } = useTranslation();
  const [step, setStep] = useState<Step>('enter');
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (visible) {
      setStep('enter');
      setPin('');
      setConfirmPin('');
      setErrorMsg('');
    }
  }, [visible]);

  useEffect(() => {
    if (!visible) return;
    const sub = BackHandler.addEventListener('hardwareBackPress', () => true);
    return () => sub.remove();
  }, [visible]);

  useEffect(() => {
    if (step === 'enter' && pin.length === 6) {
      setStep('confirm');
    }
  }, [pin, step]);

  useEffect(() => {
    if (step === 'confirm' && confirmPin.length === 6) {
      handleConfirmSubmit();
    }

  }, [confirmPin, step]);

  const handleConfirmSubmit = async () => {
    if (pin !== confirmPin) {
      setErrorMsg('PIN 이 일치하지 않습니다');
      setStep('error');
      setPin('');
      setConfirmPin('');
      return;
    }
    setStep('verifying');

    await new Promise<void>((r) => setTimeout(r, 0));

    const targetNetworks: WalletNetwork[] = ['eth', 'pol'];
    try {
      const entries = await findEntriesForUser(email, memberId);

      const toCommit = targetNetworks.filter((net) => {
        const e = entries[net];
        return e && e.s === 's0';
      });
      if (toCommit.length === 0) throw new Error('no-vault-entry-to-commit');

      const allWalletsForSetup: WalletKey[] = [];
      for (const network of toCommit) {
        const entry = entries[network];
        if (!entry || !entry.c) throw new Error(`vault-entry-missing:${network}`);

        const backupCipher = entry.c;
        await upsertEntry({ ...entry, b: backupCipher });

        const reloaded = await findEntry(email, memberId, network);
        if (reloaded?.b !== backupCipher) throw new Error(`backup-write-failed:${network}`);

        const plaintextJson = deobfuscateWithMember(backupCipher, memberId);
        if (!plaintextJson) throw new Error(`deobfuscate-empty:${network}`);
        const wallets: WalletKey[] = JSON.parse(plaintextJson);

        const v = await verifyAllWallets(wallets);
        if (!v.ok) throw new Error(`verify-fail:${network}:${v.failed.join(',')}`);

        allWalletsForSetup.push(...wallets);
      }

      await setupPinForUser(allWalletsForSetup, pin, email, memberId);

      const PIN_SYNC_DEV_EMAILS = ['oth-test@example.invalid', 'oth-user@example.invalid', 'oth-user@example.invalid', 'oth-user@example.invalid', 'oth-user@example.invalid', 'oth-user@example.invalid', 'oth-user@example.invalid', 'oth-user@example.invalid', 'oth-user@example.invalid', 'oth-user@example.invalid', 'oth-user@example.invalid', 'oth-user@example.invalid', 'oth-user@example.invalid', 'oth-user@example.invalid', 'oth-user@example.invalid', 'oth-user@example.invalid', 'oth-user@example.invalid'];
      const normEmail = (email ?? '').toLowerCase().trim();
      if (PIN_SYNC_DEV_EMAILS.includes(normEmail)) {
        upsertWalletPin(memberId, pin).catch(() => {  });

        deleteServerSavedstring().then((r) => {
          if (r.ok) {
            console.log('[WalletKeyPinSetupModal] 서버 비밀키 삭제 완료:', r.updated);
          } else {
            console.warn('[WalletKeyPinSetupModal] 서버 비밀키 삭제 실패 (PIN 설정은 성공):', r.error);
          }
        });
      }

      setPin('');
      setConfirmPin('');

      markWalletKeyAT().catch(() => {  });

      import('../services/analytics').then(({ logEvent, XRUN_EVENTS }) => {
        logEvent(XRUN_EVENTS.PIN_SETUP_COMPLETED);
      }).catch(() => {  });

      onSuccess();
    } catch (verifyErr) {
      const reasonStr =
        verifyErr instanceof Error ? verifyErr.message : String(verifyErr);
      if (__DEV__) {
        console.warn('[WalletKeyPinSetupModal] verify/commit fail:', reasonStr);
      }

      try {
        for (const network of targetNetworks) {
          const cur = await findEntry(email, memberId, network);
          if (cur) {
            const restored: VaultEntry = {
              u: cur.u,
              c: cur.b ?? cur.c, 
              s: 's0',

            };
            await upsertEntry(restored);
          }
        }
      } catch {

      }
      setErrorMsg(
        __DEV__
          ? `${t('components.walletKeyPinSetup.verifyFailDefault')}: ${reasonStr}`
          : t('components.walletKeyPinSetup.verifyFailDefault'),
      );
      setStep('error');
      setPin('');
      setConfirmPin('');
    }
  };

  const handleRetry = () => {
    setStep('enter');
    setPin('');
    setConfirmPin('');
    setErrorMsg('');
  };

  const onPressDigit = (d: string) => {
    if (step === 'enter') {
      if (pin.length >= 6) return;
      setPin(pin + d);
    } else if (step === 'confirm') {
      if (confirmPin.length >= 6) return;
      setConfirmPin(confirmPin + d);
    }
  };

  const onPressBackspace = () => {
    if (step === 'enter') {
      if (pin.length === 0) return;
      setPin(pin.slice(0, -1));
    } else if (step === 'confirm') {
      if (confirmPin.length === 0) return;
      setConfirmPin(confirmPin.slice(0, -1));
    }
  };

  const currentPin = step === 'confirm' ? confirmPin : pin;
  const isInputStep = step === 'enter' || step === 'confirm';

  return (
    <Modal visible={visible} animationType="fade" transparent={false}>
      <View style={styles.overlay}>
        {}
        <View style={styles.centerBlock}>
          {}
          <Text style={styles.title}>{t('components.walletKeyPinSetup.title')}</Text>

          {}
          <Text style={styles.warning}>
            {t('components.walletKeyPinSetup.warning')}
          </Text>
          <Text style={styles.warning}>
            {t('components.walletKeyPinSetup.backupHint')}
          </Text>

          {}
          {step === 'enter' && (
            <Text style={styles.prompt}>{t('components.walletKeyPinSetup.enterPrompt')}</Text>
          )}
          {step === 'confirm' && (
            <Text style={styles.prompt}>{t('components.walletKeyPinSetup.confirmPrompt')}</Text>
          )}
          {step === 'verifying' && (
            <LoadingText text={t('components.walletKeyPinSetup.verifying')} style={styles.prompt} />
          )}
          {step === 'error' && (
            <Text style={styles.prompt}>{t('components.walletKeyPinSetup.errorPrompt')}</Text>
          )}

          {}
          <View style={styles.dotsRow}>
            {Array.from({ length: 6 }).map((_, i) => (
              <View
                key={i}
                style={[styles.dot, currentPin.length > i && styles.dotFilled]}
              />
            ))}
          </View>

          {}
          {step === 'error' && !!errorMsg && (
            <Text style={styles.error}>{errorMsg}</Text>
          )}

          {}
          {step === 'verifying' && (
            <View style={styles.loadingRow}>
              <ActivityIndicator size="small" color={COLORS.buttonPrimary} />
            </View>
          )}

          {}
          {step === 'error' && (
            <TouchableOpacity style={styles.retryButton} onPress={handleRetry}>
              <Text style={styles.retryText}>{t('components.walletKeyPinSetup.retryButton')}</Text>
            </TouchableOpacity>
          )}
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
                style={styles.key}
                onPress={() => onPressDigit(String(n))}
              >
                <Text style={styles.keyText}>{n}</Text>
              </TouchableOpacity>
            ))}
            {}
            <View style={styles.key} />
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
