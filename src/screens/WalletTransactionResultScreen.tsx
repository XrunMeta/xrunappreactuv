import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { Alert } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { Ionicons } from '@expo/vector-icons';
import BigNumber from 'bignumber.js';
import { Header, PrimaryButton, ExplorerBadge, SafeScrollView } from '../components';
import { COLORS, COMMON_STYLES, FONTS } from '../constants';
import { ROUTES, useAppNavigation } from '../navigation';
import { useAppContext } from '../context';
import { getTokenIcon } from '../constants/tokenMeta';
import { useAlertDialog } from '../context/AlertDialogContext';

const InfoCard = ({
  label,
  value,
  trailing,
}: {
  label: string;
  value: string;
  trailing?: React.ReactNode;
}) => (
  <View style={styles.card}>
    <Text style={styles.cardLabel}>{label}</Text>
    <View style={styles.cardRow}>
      <Text style={styles.cardValue}>{value}</Text>
      {trailing}
    </View>
  </View>
);

export const WalletTransactionResultScreen = () => {
  const { t } = useTranslation();
  const { reset } = useAppNavigation();
  const { transactionResult, resetTransactionResult } = useAppContext();
  const [txHash, setTxHash] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [symbol, setSymbol] = useState<string>('');
  const [toAddress, setToAddress] = useState<string>('');
  const [gasPrice, setGasPrice] = useState<string>('');
  const [network, setNetwork] = useState<string>('');

  useEffect(() => {
    if (transactionResult) {
      setTxHash(transactionResult.txHash);
      setAmount(transactionResult.amount);
      setSymbol(transactionResult.symbol);
      setToAddress(transactionResult.toAddress);
      setGasPrice(transactionResult.gasPrice);
      setNetwork(transactionResult.network);
    }
  }, [transactionResult]);

  useEffect(() => {
    if (!txHash && !transactionResult) {
      reset(ROUTES.wallet);
    }
  }, [txHash, transactionResult, reset]);

  const transactionToken = {
    title: symbol || 'POL',
    subtitle: network === 'POL' ? 'Polygon' : 'Ethereum'
  };
  const tokenIcon = getTokenIcon(
    transactionToken.title,
    transactionToken.subtitle,
  );

  const tokenBadge = (
    <ExplorerBadge
      label={transactionToken.title}
      caption={transactionToken.subtitle}
      iconSource={tokenIcon}
      compact
    />
  );

  const handleCopy = async () => {
    if (txHash) {
      await Clipboard.setStringAsync(txHash);
      Alert.alert(
        t('screens.walletTransactionResult.copySuccess'),
        t('screens.walletTransactionResult.copySuccessMessage')
      );
    }
  };

  const shortenAddress = (address: string, frontChars: number = 6, backChars: number = 4) => {
    if (!address || address.length <= frontChars + backChars) {
      return address;
    }
    return `${address.substring(0, frontChars)}.....${address.substring(
      address.length - backChars,
    )}`;
  };

  const formattedAmount = amount ? new BigNumber(amount).toFixed() : '0';
  const formattedGasPrice = gasPrice ? parseFloat(gasPrice).toFixed(6) : '0.000000';

  if (!txHash && !transactionResult) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Header title={t('screens.walletTransactionResult.title')} showBackButton />

      <SafeScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.hashRow}>
          <Text style={styles.hashValue} numberOfLines={2}>
            {txHash}
          </Text>
          <TouchableOpacity style={styles.copyButton} onPress={handleCopy}>
            <View style={styles.copyIconWrapper}>
              <Ionicons name="copy-outline" size={20} color="#747474" />
            </View>
            <Text style={styles.copyText}>{t('screens.walletTransactionResult.copy')}</Text>
          </TouchableOpacity>
        </View>

        <InfoCard
          label={t('screens.walletTransactionResult.amount')}
          value={`${formattedAmount} ${symbol}`}
        />
        <InfoCard
          label={t('screens.walletTransactionResult.networkFee')}
          value={`${formattedGasPrice} ${network}`}
        />
        <InfoCard
          label={t('screens.walletTransactionResult.to')}
          value={shortenAddress(toAddress)}
          trailing={tokenBadge}
        />
        <InfoCard
          label={t('screens.walletTransactionResult.txHash')}
          value={shortenAddress(txHash)}
          trailing={tokenBadge}
        />

        <Text style={styles.statusText}>{t('screens.walletTransactionResult.completed')}</Text>

        <View style={[COMMON_STYLES.bottomSection, styles.bottomSection]}>
          <PrimaryButton
            title={t('screens.walletTransactionResult.close')}
            fullWidth
            onPress={() => {
              resetTransactionResult();
              reset(ROUTES.wallet);
            }}
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

  hashRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
    gap: 12,
  },
  hashValue: {
    flex: 1,
    fontSize: FONTS.size.ssmall,
    fontFamily: 'Roboto-Bold',
    color: '#1a2e35',
  },
  copyButton: {
    alignItems: 'center',
  },
  copyIconWrapper: {
    width: 32,
    height: 32,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e3e8fc',
    alignItems: 'center',
    justifyContent: 'center',
  },
  copyText: {
    fontSize: FONTS.size.small,
    fontFamily: 'Roboto-SemiBold',
    color: '#747474',
    marginTop: 4,
  },
  card: {
    borderWidth: 1.5,
    borderColor: '#eef0f5',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#ffffff',
    marginBottom: 16,
  },
  cardLabel: {
    fontSize: FONTS.size.msmall,
    fontFamily: 'Roboto-Regular',
    color: '#747474',
    marginBottom: 6,
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  cardValue: {
    flex: 1,
    fontSize: FONTS.size.medium,
    fontFamily: 'Roboto-Medium',
    color: '#1a2e35',
    lineHeight: 22,
  },
  statusText: {
    textAlign: 'center',
    fontSize: FONTS.size.msmall,
    fontFamily: 'Roboto-Regular',
    color: '#1f6880',
    marginTop: 16,
  },
  bottomSection: {
    ...COMMON_STYLES.bottomButtonContainer,
  },
});
