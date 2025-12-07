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
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import QRCode from 'react-native-qrcode-svg';
import { Header, PrimaryButton, SecondaryButton, SafeScrollView } from '../components';
import { COLORS, COMMON_STYLES } from '../constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { copyToClipboard } from '../utils';
import { useAlertDialog } from '../context/AlertDialogContext';
import { useAppContext } from '../context';
import { useAppNavigation } from '../navigation';

export const WalletReceiveScreen = () => {
  const { t } = useTranslation();
  const { goBack } = useAppNavigation();
  const { showAlert } = useAlertDialog();
  const { walletReceiveAddress, resetWalletReceiveAddress } = useAppContext();
  const qrCodeRef = useRef<any>(null);
  const [walletAddress, setWalletAddress] = useState('');

  useEffect(() => {

    if (walletReceiveAddress) {
      setWalletAddress(walletReceiveAddress);
    } else {

    }

    return () => {
      resetWalletReceiveAddress();
    };
  }, [walletReceiveAddress, resetWalletReceiveAddress]);

  const handleCopy = async () => {
    if (walletAddress) {
      await copyToClipboard(walletAddress, showAlert);
    } else {
      await showAlert(
        t('screens.walletReceive.alerts.error'),
        t('screens.walletReceive.errors.addressNotLoaded'),
      );
    }
  };

  const handleShare = async () => {
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

  return (
    <View style={styles.container}>
      <Header title={t('screens.walletReceive.title')} onBackPress={goBack} showBackButton />

      <SafeScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.content]}>
          <View style={styles.qrWrapper}>
            <View style={styles.qrBorder}>
              <View style={styles.qrInnerBorder}>
                <View style={styles.qrPlaceholder}>
                  {walletAddress ? (
                    <QRCode
                      value={walletAddress}
                      size={200}
                      color="#000000"
                      backgroundColor="#FFFFFF"
                      getRef={(c) => (qrCodeRef.current = c)}
                    />
                  ) : (
                    <Ionicons name="qr-code-outline" size={120} color="#10192d" />
                  )}
                </View>
              </View>
            </View>
          </View>

          <View style={styles.addressSection}>
            <Text style={styles.addressLabel}>{t('screens.walletReceive.address')}</Text>
            <View style={styles.addressBox}>
              <Text style={styles.addressValue}>{walletAddress || t('screens.walletReceive.loadingAddress')}</Text>
            </View>
          </View>
        </View>

        <View style={[COMMON_STYLES.bottomSection, styles.bottomSection]}>
          <PrimaryButton
            title={t('screens.walletReceive.copyAddress')}
            fullWidth
            onPress={handleCopy}
            style={styles.primaryButton}
          />
          <SecondaryButton
            title={t('screens.walletReceive.shareAddress')}
            fullWidth
            onPress={handleShare}
            style={styles.secondaryButton}
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
  content: {
    alignItems: 'center',
  },
  qrWrapper: {
    marginTop: 24,
    marginBottom: 32,
    width: '100%',
    alignItems: 'center',
  },
  qrBorder: {
    width: 263,
    height: 263,
    borderRadius: 32,
    backgroundColor: '#dedede',
    alignItems: 'center',
    justifyContent: 'center',
  },
  qrInnerBorder: {
    width: 247,
    height: 247,
    borderRadius: 24,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  qrPlaceholder: {
    width: 200,
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addressSection: {
    width: '100%',
    alignItems: 'flex-start',
  },
  addressLabel: {
    fontSize: 16,
    fontFamily: 'Roboto-SemiBold',
    color: '#1a2e35',
    marginBottom: 8,
  },
  addressBox: {
    width: '100%',
    borderRadius: 12,
    backgroundColor: '#ffffff',
    borderWidth: 1.5,
    borderColor: '#f0f0f5',
    padding: 16,
  },
  addressValue: {
    fontSize: 12,
    lineHeight: 15,
    fontFamily: 'Roboto-Regular',
    color: '#121212',
  },
  bottomSection: {
    width: '100%',
    gap: 12,
  },
  primaryButton: {
    borderRadius: 16,
  },
  secondaryButton: {
    borderRadius: 16,
  },

});

