import React, { useEffect, useRef, useState } from 'react';
import {
  Platform,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import QRCode from 'react-native-qrcode-svg';
import { Header, SafeScrollView, SafeView } from '../components';
import { COLORS, COMMON_STYLES, FONTS, SIZES } from '../constants';
import { copyToClipboard } from '../utils';
import { useAlertDialog } from '../context/AlertDialogContext';
import { useAppContext } from '../context';
import { useAppNavigation, ROUTES } from '../navigation';

export const WalletReceiveScreen = () => {
  const { t } = useTranslation();
  const { goBack, navigate } = useAppNavigation();
  const { showAlert } = useAlertDialog();
  const { walletReceiveAddress, walletReceiveCurrency, resetWalletReceiveAddress, resetWalletReceiveCurrency } = useAppContext();
  const qrCodeRef = useRef<any>(null);
  const [walletAddress, setWalletAddress] = useState('');

  const getCurrencyInfo = (currency: number) => {
    switch (currency) {
      case 1:
        return { symbol: 'XRUN', name: 'Main Wallet', network: 'Ethereum Network' };
      case 2:
        return { symbol: 'ETH', name: 'Ethereum', network: 'Ethereum Network' };
      case 3:
        return { symbol: 'RUN', name: 'RUN', network: 'Ethereum Network' };
      case 16:
        return { symbol: 'POL', name: 'Polygon', network: 'Polygon Network' };
      case 18:
        return { symbol: 'XRUN', name: 'XRUN', network: 'Polygon Network' };
      case 19:
        return { symbol: 'XRUN', name: 'AD XRUN', network: '' };
      default:
        return { symbol: 'XRUN', name: 'Main Wallet', network: 'Ethereum Network' };
    }
  };

  const currencyInfo = getCurrencyInfo(walletReceiveCurrency);

  useEffect(() => {
    console.log('[WalletReceiveScreen] currency:', walletReceiveCurrency);
    console.log('[WalletReceiveScreen] currencyInfo:', currencyInfo);
  }, [walletReceiveCurrency, currencyInfo]);

  useEffect(() => {

    if (walletReceiveAddress) {
      setWalletAddress(walletReceiveAddress);
    } else {

    }
  }, [walletReceiveAddress]);

  useEffect(() => {
    return () => {

      console.log('[WalletReceiveScreen] cleanup 실행 - Context 초기화');
      resetWalletReceiveAddress();
      resetWalletReceiveCurrency();
    };

  }, []); 

  const handleCopyAddress = async () => {
    if (walletAddress) {
      await copyToClipboard(walletAddress, showAlert);
    } else {
      await showAlert(
        t('screens.walletReceive.alerts.error'),
        t('screens.walletReceive.errors.addressNotLoaded'),
      );
    }
  };

  const handleShareAddress = async () => {
    if (!walletAddress) {
      Alert.alert(
        t('screens.walletReceive.alerts.error'),
        t('screens.walletReceive.errors.addressNotLoaded'),
      );
      return;
    }

    try {
      await Share.share({
        message: walletAddress,
      });
    } catch (error) {
      await showAlert(t('screens.walletReceive.alerts.shareFailed'), t('screens.walletReceive.errors.shareFailed'));
    }
  };

  const handleQrScanPress = () => {
    navigate(ROUTES.walletQrScan);
  };

  return (
    <SafeView style={styles.container} backgroundColor={"#f7f7fb"}>
      <Header
        title={t('screens.walletReceive.title')}
        onBackPress={goBack}
        showBackButton
        containerStyle={{ backgroundColor: 'transparent' }}
      />

      <SafeScrollView
        contentContainerStyle={styles.scrollContent}
        backgroundColor="transparent"
        showsVerticalScrollIndicator={false}
        showBottomBackground={false}
      >
        {}
        <View style={styles.qrScanButtonContainer}>
          <TouchableOpacity style={[styles.qrScanButton, styles.buttonActive]}>
            <Text style={styles.qrScanButtonTextActive}>{t('screens.walletReceive.myQrCode')}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.qrScanButton} onPress={handleQrScanPress}>
            <Text style={styles.qrScanButtonText}>{t('screens.walletReceive.scan')}</Text>
          </TouchableOpacity>
        </View>
        {}
        <View style={styles.topSection}>
          <View style={styles.tokenInfo}>
            <Text style={styles.tokenName}>
              {currencyInfo.symbol}
            </Text>
            <Text style={styles.walletName}>{currencyInfo.name}</Text>
          </View>

          <View style={styles.qrContainer}>
            <View style={styles.qrBorder}>
              <View style={styles.qrBase}>
                {walletAddress ? (
                  <QRCode
                    value={walletAddress}
                    size={180}
                    color="#000000"
                    backgroundColor="#FFFFFF"
                    getRef={(c) => (qrCodeRef.current = c)}
                  />
                ) : (
                  <Ionicons name="qr-code" size={180} color="#121212" />
                )}
                <View style={styles.qrLogoBadge}>
                  <Ionicons name="logo-electron" size={24} color="white" />
                </View>
              </View>
            </View>
          </View>

          {}
          <View style={styles.actionRow}>
            <ActionItem
              icon="copy-outline"
              label={t('screens.walletReceive.copyAddress')}
              onPress={handleCopyAddress}
            />
            <ActionItem
              icon="share-social-outline"
              label={t('screens.walletReceive.shareAddress')}
              onPress={handleShareAddress}
            />
          </View>
        </View>

        {}
        <View style={styles.bottomCard}>
          <InfoRow
            label="Network"
            value={currencyInfo.network || '-'}
            icon="git-network-outline"
          />
          <View style={styles.divider} />
          <InfoRow
            label={t('screens.walletReceive.address')}
            value={walletAddress || t('screens.walletReceive.loadingAddress')}
            icon="wallet-outline"
            isAddress
            onCopy={handleCopyAddress}
          />
        </View>
      </SafeScrollView>
    </SafeView >
  );
};

interface ActionItemProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress: () => void;
}

const ActionItem: React.FC<ActionItemProps> = ({ icon, label, onPress }) => (
  <View style={styles.actionItem}>
    <TouchableOpacity style={styles.actionBtn} onPress={onPress} activeOpacity={0.8}>
      <Ionicons name={icon} size={24} color="white" />
    </TouchableOpacity>
    <Text style={styles.actionLabel}>{label}</Text>
  </View>
);

interface InfoRowProps {
  label: string;
  value: string;
  icon: keyof typeof Ionicons.glyphMap;
  isAddress?: boolean;
  onCopy?: () => void;
}

const InfoRow: React.FC<InfoRowProps> = ({ label, value, icon, isAddress, onCopy }) => (
  <View style={styles.infoRow}>
    <View style={styles.infoIconWrapper}>
      <Ionicons name={icon} size={20} color={COLORS.text} />
    </View>
    <View style={styles.infoContent}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text
        style={[styles.infoValue, isAddress && styles.addressValue]}
        numberOfLines={1}
        ellipsizeMode="middle"
      >
        {value}
      </Text>
    </View>
    {isAddress && onCopy && (
      <TouchableOpacity onPress={onCopy} style={styles.copyIconBtn}>
        <Ionicons name="copy-outline" size={18} color={COLORS.headerText} />
      </TouchableOpacity>
    )}
  </View>
);

const styles = StyleSheet.create({
  container: {
    ...COMMON_STYLES.container,
  },
  scrollContent: {
    flexGrow: 1,
    ...COMMON_STYLES.scrollContent,
  },
  topSection: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 30,
  },
  tokenInfo: {
    alignItems: 'center',
    marginBottom: 30,
  },
  tokenName: {
    fontSize: 24,
    fontFamily: FONTS.family.bold,
    color: COLORS.text,
    marginBottom: 4,
  },
  walletName: {
    fontSize: 14,
    fontFamily: FONTS.family.regular,
    color: COLORS.headerText,
    opacity: 0.6,
  },
  qrContainer: {
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  qrBorder: {
    padding: 10,
    backgroundColor: 'white',
    borderRadius: 24,
  },
  qrBase: {
    width: 220,
    height: 220,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  qrLogoBadge: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F7931A', 
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: 'white',
  },
  actionRow: {
    flexDirection: 'row',
    gap: 40,
  },
  actionItem: {
    alignItems: 'center',
    gap: 8,
  },
  actionBtn: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: COLORS.primary, 
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  actionLabel: {
    fontSize: 13,
    fontFamily: FONTS.family.medium,
    color: COLORS.text,
  },
  bottomCard: {
    backgroundColor: 'white',
    borderRadius: 24,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  infoIconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F5F7FA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    fontFamily: FONTS.family.regular,
    color: COLORS.headerText,
    opacity: 0.6,
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 16,
    fontFamily: FONTS.family.bold,
    color: COLORS.text,
  },
  addressValue: {
    fontSize: 14,
    fontFamily: FONTS.family.medium,
  },
  divider: {
    height: 1,
    backgroundColor: '#EEF0F5',
    marginVertical: 16,
    marginLeft: 52, 
  },
  copyIconBtn: {
    padding: 8,
  },
  qrScanButtonContainer: {
    flexDirection: 'row',
    backgroundColor: '#ebeff5',
    borderWidth: 1,
    borderColor: '#dfe3eb',
    borderRadius: SIZES.small,
    padding: 4,
    gap: 8,
  },
  qrScanButton: {
    flexGrow: 1,
    height: 40,
    borderRadius: SIZES.small,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonActive: {
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: SIZES.small,
    elevation: 2,
  },
  qrScanButtonText: {
    color: '#a3adc2',
  },
  qrScanButtonTextActive: {
    color: '#111111',
  },
});
