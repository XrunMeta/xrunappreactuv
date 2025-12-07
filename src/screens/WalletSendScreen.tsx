import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import BigNumber from 'bignumber.js';
import { Header, FormField, PrimaryButton, SafeScrollView } from '../components';
import { COLORS, COMMON_STYLES, FONTS } from '../constants';
import { ROUTES, useAppNavigation } from '../navigation';
import { useAppContext } from '../context';
import { useAlertDialog } from '../context/AlertDialogContext';

export const WalletSendScreen = () => {
  const { t } = useTranslation();
  const { goBack, navigate } = useAppNavigation();
  const { walletSendAddress, setWalletSendAddress, resetWalletSendAddress, walletSendAmount, setWalletSendAmount, selectedWalletAsset } = useAppContext();
  const { showAlert } = useAlertDialog();
  const [sendAmount, setSendAmount] = useState(walletSendAmount || '0');
  const amountInputRef = useRef<TextInput>(null);

  useEffect(() => {
    if (!selectedWalletAsset) {
      goBack();
    }
  }, [selectedWalletAsset, goBack]);

  const handleBackPress = () => {
    setSendAmount('0');
    setWalletSendAmount('0');
    resetWalletSendAddress();
    goBack();
  };

  const handleScanPress = () => {
    navigate(ROUTES.walletQrScan);
  };

  const handleAmountFocus = () => {
    if (sendAmount === '0') {
      setSendAmount('');
      setWalletSendAmount('');
    } else if (sendAmount && amountInputRef.current) {

      setTimeout(() => {
        amountInputRef.current?.setNativeProps({
          selection: { start: sendAmount.length, end: sendAmount.length },
        });
      }, 0);
    }
  };

  const handleAmountBlur = () => {

  };

  const isConfirmEnabled = useMemo(() => {
    const hasAmount = sendAmount && sendAmount !== '0' && new BigNumber(sendAmount || '0').gt(0);
    const hasAddress = walletSendAddress && walletSendAddress.trim().length > 0;
    return hasAmount && hasAddress;
  }, [sendAmount, walletSendAddress]);

  const handleConfirm = async () => {
    if (!walletSendAddress) {
      await showAlert(t('screens.walletSend.alerts.addressRequired'), t('screens.walletSend.errors.addressRequired'));
      return;
    }
    if (!sendAmount || new BigNumber(sendAmount || '0').lte(0)) {
      await showAlert(t('screens.walletSend.alerts.amountRequired'), t('screens.walletSend.errors.amountRequired'));
      return;
    }

    const balance = new BigNumber(selectedWalletAsset?.amount || '0');
    const amount = new BigNumber(sendAmount || '0');
    if (amount.gt(balance)) {
      await showAlert(t('screens.walletSend.alerts.insufficientBalance'), t('screens.walletSend.errors.insufficientBalance'));
      return;
    }
    navigate(ROUTES.walletEstimate);
  };

  if (!selectedWalletAsset) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Header title={t('screens.walletSend.title')} onBackPress={handleBackPress} showBackButton />

      <SafeScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        autoAdjustKeyboardPadding={true}
      >
        <View style={[styles.mainSection]}>
          <View style={styles.amountSection}>
            <Text style={styles.amountLabel}>{t('screens.walletSend.amount')}</Text>
            <TextInput
              ref={amountInputRef}
              style={styles.amountInput}
              value={sendAmount}
              onChangeText={(text) => {
                setSendAmount(text);
                setWalletSendAmount(text);
              }}
              onFocus={handleAmountFocus}
              onBlur={handleAmountBlur}
              keyboardType="decimal-pad"
              autoCapitalize="none"
              autoCorrect={false}
              textAlign="center"
            />
          </View>

          <View style={styles.tokenBadge}>
            <Text style={styles.tokenBadgeText}>{selectedWalletAsset.symbol || selectedWalletAsset.name}</Text>
          </View>

          <FormField
            label={t('screens.walletSend.receiverAddress')}
            placeholder={t('screens.walletSend.receiverAddressPlaceholder')}
            value={walletSendAddress}
            onChangeText={setWalletSendAddress}
            autoCapitalize="none"
            autoCorrect={false}
            containerStyle={styles.formField}
            rightAccessory={
              <TouchableOpacity
                onPress={handleScanPress}
                activeOpacity={0.7}
                style={styles.qrButton}
              >
                <Ionicons name="qr-code-outline" size={22} color={COLORS.headerText} />
              </TouchableOpacity>
            }
          />
        </View>

        <View style={[COMMON_STYLES.bottomSection, styles.bottomSection]}>
          <PrimaryButton
            title={t('screens.walletSend.confirm')}
            fullWidth
            onPress={handleConfirm}
            disabled={!isConfirmEnabled}
          />
        </View>
      </SafeScrollView>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...COMMON_STYLES.container,
  },
  scrollContent: {
    flexGrow: 1,
    ...COMMON_STYLES.scrollContent,
  },

  mainSection: {
    flexGrow: 1,
  },
  amountSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  amountLabel: {
    fontSize: FONTS.fontSize.medium,
    lineHeight: 24,
    fontFamily: 'Roboto-Medium',
    color: '#8e9bae',
    marginBottom: 8,
    textAlign: 'center',
  },
  amountInput: {
    fontSize: FONTS.fontSize.xxxlarge,
    lineHeight: 48,
    fontFamily: 'Roboto-Bold',
    color: '#10192d',
    textAlign: 'center',
    width: '100%',
    minHeight: 48,
  },
  tokenBadge: {
    alignSelf: 'center',
    paddingHorizontal: 24,
    paddingVertical: 8,
    borderRadius: 40,
    backgroundColor: '#ffffff',
    marginBottom: 32,
  },
  tokenBadgeText: {
    fontSize: FONTS.fontSize.medium,
    lineHeight: 24,
    fontFamily: 'Roboto-SemiBold',
    color: COLORS.headerText,
  },
  formField: {
    width: '100%',
  },
  qrButton: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8fafc',
  },
  bottomSection: {
    ...COMMON_STYLES.bottomButtonContainer,
  },

});

