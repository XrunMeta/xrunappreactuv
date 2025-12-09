import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import BigNumber from 'bignumber.js';
import { Header, FormField, PrimaryButton, SafeScrollView, SafeView, AddressInfoItem } from '../components';
import { COLORS, COMMON_STYLES, FONTS, SIZES } from '../constants';
import { ROUTES, useAppNavigation } from '../navigation';
import { useAppContext } from '../context';
import { useAlertDialog } from '../context/AlertDialogContext';

const SAMPLE_ADDRESS_BOOK = [
  {
    id: '1',
    name: '내 지갑',
    address: '0x1234567890abcdef1234567890abcdef12345678',
    network: 'Ethereum',
    networkColor: '#627EEA',
  },
  {
    id: '2',
    name: '회사 지갑',
    address: '0xabcdef1234567890abcdef1234567890abcdef12',
    network: 'Polygon',
    networkColor: '#8247E5',
  },
  {
    id: '3',
    name: '거래소 입금주소',
    address: '0x9876543210fedcba9876543210fedcba98765432',
    network: 'Ethereum',
    networkColor: '#627EEA',
  },
];

export const WalletSendScreen = () => {
  const { t } = useTranslation();
  const { goBack, navigate } = useAppNavigation();
  const { walletSendAddress, setWalletSendAddress, resetWalletSendAddress, walletSendAmount, setWalletSendAmount, selectedWalletAsset } = useAppContext();
  const { showAlert } = useAlertDialog();
  const [sendAmount, setSendAmount] = useState(walletSendAmount || '0');
  const amountInputRef = useRef<TextInput>(null);

  const formatNumberWithCommas = useCallback((value: string): string => {

    const cleanValue = value.replace(/[^\d.]/g, '');

    const parts = cleanValue.split('.');
    let integerPart = parts[0] || '';
    const decimalPart = parts.length > 1 ? parts[1] : '';

    if (integerPart.length > 1) {
      integerPart = integerPart.replace(/^0+/, '') || '0';
    }

    integerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

    if (parts.length > 1) {
      return `${integerPart}.${decimalPart}`;
    }
    return integerPart;
  }, []);

  const removeCommas = useCallback((value: string): string => {
    return value.replace(/,/g, '');
  }, []);

  const handleAmountChange = useCallback((text: string) => {
    const formatted = formatNumberWithCommas(text);
    const cleanValue = removeCommas(formatted);
    setSendAmount(formatted);
    setWalletSendAmount(cleanValue); 
  }, [formatNumberWithCommas, removeCommas, setWalletSendAmount]);

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

  const handlePastePress = () => {
    navigate(ROUTES.addWalletAddress);
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

    if (!sendAmount || sendAmount === '') {
      setSendAmount('0');
      setWalletSendAmount('0');
    }
  };
  const handleAvailableBalancePress = () => {
    setSendAmount(selectedWalletAsset?.amount || '0');
    setWalletSendAmount(selectedWalletAsset?.amount || '0');
  };

  const isConfirmEnabled = useMemo(() => {
    const hasAddress = walletSendAddress && walletSendAddress.trim().length > 0;
    return hasAddress;
  }, [walletSendAddress]);

  const handleConfirm = async () => {
    const cleanAmount = removeCommas(sendAmount);
    if (!walletSendAddress) {
      await showAlert(t('screens.walletSend.alerts.addressRequired'), t('screens.walletSend.errors.addressRequired'));
      return;
    }
    if (!cleanAmount || new BigNumber(cleanAmount || '0').lte(0)) {
      await showAlert(t('screens.walletSend.alerts.amountRequired'), t('screens.walletSend.errors.amountRequired'));
      return;
    }

    const balance = new BigNumber(selectedWalletAsset?.amount || '0');
    const amount = new BigNumber(cleanAmount || '0');
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
    <SafeView style={styles.container} showBottomBackground={true}>
      <Header title={t('screens.walletSend.title')} onBackPress={handleBackPress} showBackButton />

      <View style={styles.contentContainer}>
        <Text style={styles.amountLabel}>{t('screens.walletSend.amount')}</Text>
        <View style={styles.amountContainer}>
          <View style={styles.amountSection}>
            <TextInput
              ref={amountInputRef}
              style={styles.amountInput}
              value={sendAmount}
              onChangeText={handleAmountChange}
              onFocus={handleAmountFocus}
              onBlur={handleAmountBlur}
              keyboardType="decimal-pad"
              autoCapitalize="none"
              autoCorrect={false}
              textAlign="center"
              placeholder="0"
              placeholderTextColor="#c0c0c0"
              cursorColor="#10192d"
              selectionColor="#10192d"
              caretHidden={false}
            />
          </View>

          <View style={styles.tokenBadge}>
            <Text style={styles.tokenBadgeText}>{selectedWalletAsset.symbol || selectedWalletAsset.name}</Text>
          </View>
        </View>
        <View style={styles.helperContainer}>
          <Text style={styles.helperAmount}>10,0000,000 </Text><Text style={styles.helperText}>KRW</Text>
        </View>
        {}
        <TouchableOpacity onPress={handleAvailableBalancePress} activeOpacity={0.7} style={styles.availableBalanceContainer}>
          <Text style={styles.availableBalanceLabel}>{t('screens.walletSend.availableBalance')}</Text>
          <Text style={styles.availableBalanceValue}>{selectedWalletAsset.amount}</Text>
          <Text style={styles.availableBalanceToken}>{selectedWalletAsset.symbol || selectedWalletAsset.name} {t('screens.walletSend.input')}</Text>
        </TouchableOpacity>

        <FormField
          label={t('screens.walletSend.receiverAddress')}
          placeholder={t('screens.walletSend.receiverAddressPlaceholder')}
          value={walletSendAddress}
          onChangeText={setWalletSendAddress}
          autoCapitalize="none"
          autoCorrect={false}
          containerStyle={styles.formField}
          rightAccessory={
            <>
              {}
              <TouchableOpacity
                onPress={handleScanPress}
                activeOpacity={0.7}
                style={styles.qrButton}
              >
                <Ionicons name="qr-code-outline" size={22} color={COLORS.headerText} />
              </TouchableOpacity>
            </>
          }
        />
        <View style={styles.addressListSection}>
          <View style={styles.webViewContainer}>
            {}
            <Text style={styles.addressListTitle}>{t('screens.walletSend.addressBook')}</Text>
            {}
            <TouchableOpacity onPress={handlePastePress} activeOpacity={0.7} style={styles.addAddressButton}>
              <Ionicons name="add" size={18} color="#ffffff" />
            </TouchableOpacity>
          </View>

          {}
          <View style={styles.addressListContainer}>
            {SAMPLE_ADDRESS_BOOK.length === 0 ? (
              <View style={styles.emptyAddressContainer}>
                <Text style={styles.emptyAddressText}>{t('screens.walletSend.noAddresses')}</Text>
              </View>
            ) : (
              <SafeScrollView showsVerticalScrollIndicator={false} showBottomBackground={false} backgroundColor='transparent' autoAdjustKeyboardPadding={true}>
                {}
                {SAMPLE_ADDRESS_BOOK.map((item) => (
                  <AddressInfoItem
                    key={item.id}
                    symbol={selectedWalletAsset.symbol}
                    address={item.address}
                    network={item.network}
                    networkColor={item.networkColor}
                    name={item.name}
                    onPress={() => setWalletSendAddress(item.address)}
                  />
                ))}
              </SafeScrollView>
            )}
          </View>
        </View>
        <View style={[COMMON_STYLES.bottomSection, styles.bottomSection]}>
          <PrimaryButton
            title={t('screens.walletSend.confirm')}
            fullWidth
            onPress={handleConfirm}
            disabled={!isConfirmEnabled}
          />
        </View>
      </View>

    </SafeView>
  );
};

const styles = StyleSheet.create({
  container: {
    ...COMMON_STYLES.container,

  },
  contentContainer: {
    flexGrow: 1,
    ...COMMON_STYLES.contentContainer,
    paddingBottom: 0,
  },

  amountSection: {
    alignItems: 'center',
  },
  amountContainer: {
    flexDirection: 'row',
    alignItems: 'stretch',
    justifyContent: 'center',
    paddingHorizontal: SIZES.small,
    gap: SIZES.small,
  },
  amountLabel: {
    fontSize: FONTS.size.medium,
    lineHeight: 24,
    fontFamily: 'Roboto-Medium',
    color: '#8e9bae',
    textAlign: 'center',
  },
  amountInput: {
    fontSize: FONTS.size.xxxlarge,
    fontFamily: 'Roboto-Bold',
    color: '#10192d',
    textAlign: 'center',
    width: '100%',
    alignSelf: 'center',
  },
  helperContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  helperAmount: {
    fontSize: FONTS.size.medium,
    fontFamily: 'Roboto-Bold',
    color: '#10192d',
  },
  helperText: {
    fontSize: FONTS.size.medium,
    fontFamily: 'Roboto-Medium',
    color: '#8e9bae',
  },
  availableBalanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SIZES.small,
    paddingVertical: SIZES.xsmall,
    marginBottom: SIZES.small,
    gap: 6,
    backgroundColor: '#f8fafc',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#eef0f5',
    marginTop: SIZES.small,
  },
  availableBalanceLabel: {
    fontSize: FONTS.size.msmall,
    fontFamily: 'Roboto-Regular',
    color: '#8e9bae',
  },
  availableBalanceValue: {
    fontSize: FONTS.size.medium,
    fontFamily: 'Roboto-Bold',
    color: '#10192d',
  },
  availableBalanceToken: {
    fontSize: FONTS.size.msmall,
    fontFamily: 'Roboto-Medium',
    color: '#8e9bae',
  },
  tokenBadge: {
    alignSelf: 'center',
    backgroundColor: '#ffffff',
    fontSize: FONTS.size.large,
    alignContent: 'center',
  },
  tokenBadgeText: {
    fontSize: FONTS.size.large,
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
  addressListSection: {
    flexGrow: 1,
    marginTop: SIZES.small,
  },
  webViewContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SIZES.small,
    marginBottom: SIZES.small,
  },
  addressListTitle: {
    fontSize: FONTS.size.medium,
    fontFamily: 'Roboto-Medium',
    color: '#10192d',
  },
  addressListContainer: {
    flexGrow: 1,
  },
  emptyAddressContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SIZES.xlarge,
  },
  emptyAddressText: {
    fontSize: FONTS.size.medium,
    fontFamily: 'Roboto-Regular',
    color: '#8e9bae',
    textAlign: 'center',
  },
  addAddressButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
  },
  bottomSection: {
    ...COMMON_STYLES.bottomButtonContainer,
  },

});

