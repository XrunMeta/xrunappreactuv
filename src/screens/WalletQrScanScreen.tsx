import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { StatusBar, setStatusBarStyle, setStatusBarTranslucent } from 'expo-status-bar';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import {
  BarcodeScanningResult,
  CameraView,
  useCameraPermissions,
} from 'expo-camera';
import { COLORS, COMMON_STYLES, SIZES, FONTS } from '../constants';
import { useAppNavigation, ROUTES } from '../navigation';
import { useAppContext } from '../context';
import { SafeView } from '../components';
import { CombinedAsset } from '../types';

const createAssetFromCurrency = (currency: number): CombinedAsset => {
  switch (currency) {
    case 1:
      return { id: 1, symbol: 'XRUN', name: 'XRUN eth', amount: '0', icon: '', currency: 1, isCustom: false };
    case 2:
      return { id: 2, symbol: 'ETH', name: 'Ethereum', amount: '0', icon: '', currency: 2, isCustom: false };
    case 3:
      return { id: 3, symbol: 'RUN', name: 'RUN', amount: '0', icon: '', currency: 3, isCustom: false };
    case 16:
      return { id: 16, symbol: 'POL', name: 'Polygon', amount: '0', icon: '', currency: 16, isCustom: false };
    case 18:
      return { id: 18, symbol: 'XRUN', name: 'XRUN', amount: '0', icon: '', currency: 18, isCustom: false };
    case 19:
      return { id: 19, symbol: 'XRUN', name: 'AD XRUN', amount: '0', icon: '', currency: 19, isCustom: false };
    default:
      return { id: 1, symbol: 'XRUN', name: 'Wallet', amount: '0', icon: '', currency: 1, isCustom: false };
  }
};

export const WalletQrScanScreen = () => {
  const { t } = useTranslation();
  const { goBack, navigate, previousScreen } = useAppNavigation();
  const {
    setWalletSendAddress,
    walletReceiveCurrency,
    setSelectedWalletAsset,
    selectedWalletAsset,
    setWalletReceiveCurrency,
    setWalletReceiveAddress,
  } = useAppContext();
  const [permission, requestPermission] = useCameraPermissions();
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (!permission) {
      requestPermission();
    }
  }, [permission, requestPermission]);

  useEffect(() => {
    return () => {

      setStatusBarStyle('dark');
      setStatusBarTranslucent(false);
    };
  }, []);

  const handleBarCodeScanned = useCallback(
    ({ data }: BarcodeScanningResult) => {
      if (isProcessing) {
        return;
      }
      setIsProcessing(true);
      setWalletSendAddress(data);

      if (previousScreen === ROUTES.walletSend) {

        goBack();
      } else if (previousScreen === ROUTES.addWalletAddress) {

        goBack();
      } else {

        const asset = createAssetFromCurrency(walletReceiveCurrency);
        setSelectedWalletAsset(asset);
        navigate(ROUTES.walletSend);
      }
    },
    [goBack, navigate, isProcessing, setWalletSendAddress, previousScreen, walletReceiveCurrency, setSelectedWalletAsset],
  );
  const handleQrScanPress = () => {

    if (previousScreen === ROUTES.walletSend) {

      if (selectedWalletAsset?.currency) {
        setWalletReceiveCurrency(selectedWalletAsset.currency);
      }
      const assetAddress = (selectedWalletAsset?.originalData as any)?.address;
      if (typeof assetAddress === 'string' && assetAddress.trim().length > 0) {
        setWalletReceiveAddress(assetAddress.trim());
      }
      navigate(ROUTES.walletReceive);
      return;
    }
    goBack();
  };

  const renderPermissionFallback = () => {
    if (!permission) {
      return (
        <View style={styles.permissionState}>
          <ActivityIndicator size="large" color="#ffffff" />
          <Text style={styles.permissionText}>{t('screens.walletQrScan.checkingPermission')}</Text>
        </View>
      );
    }

    return (
      <View style={styles.permissionState}>
        <Text style={styles.permissionText}>{t('screens.walletQrScan.permissionRequired')}</Text>
        <TouchableOpacity
          style={styles.permissionButton}
          onPress={requestPermission}
          activeOpacity={0.8}
        >
          <Text style={styles.permissionButtonText}>{t('screens.walletQrScan.grantPermission')}</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeView style={styles.container} backgroundColor='#000'>
      <StatusBar style="light" translucent />
      {permission?.granted ? (
        <CameraView
          style={StyleSheet.absoluteFill}
          facing="back"
          onBarcodeScanned={isProcessing ? undefined : handleBarCodeScanned}
          barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
        />
      ) : (
        <View style={[StyleSheet.absoluteFill, styles.permissionPlaceholder]}>
          {renderPermissionFallback()}
        </View>
      )}

      <View style={styles.overlay}>
        <View style={styles.topBarContainer}>
          <View style={styles.topBar}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={goBack}
              activeOpacity={0.8}
            >
              <Ionicons name="chevron-back" size={24} color="#ffffff" />
            </TouchableOpacity>

          </View>
          {}
          <View style={styles.qrScanButtonContainer}>
            <TouchableOpacity style={styles.qrScanButton} onPress={handleQrScanPress}>
              <Text style={styles.qrScanButtonTextActive}>{t('screens.walletReceive.myQrCode')}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.qrScanButton, styles.buttonActive]}>
              <Text style={styles.qrScanButtonText}>{t('screens.walletReceive.scan')}</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.rectangleWrapper}>
          <View style={styles.frameOuter}>
            <View style={styles.frameInner} />
          </View>
        </View>
      </View>
    </SafeView>
  );
};

const styles = StyleSheet.create({
  container: {
    ...COMMON_STYLES.container,
    marginTop: 0,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-start',
  },
  topBarContainer: {
    flexDirection: 'column',

  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SIZES.xlarge,
    gap: SIZES.medium,
  },
  backButton: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
    marginTop: 50,
    marginBottom: 20,
  },
  rectangleWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  title: {
    fontSize: FONTS.size.xlarge,
    lineHeight: 28,
    fontFamily: 'Roboto-Bold',
    color: '#ffffff',
    marginBottom: 36,
    textAlign: 'center',
  },
  frameOuter: {
    width: 280,
    height: 280,
    borderRadius: 32,
    borderWidth: 4,
    borderColor: '#ffffff',
    backgroundColor: 'rgba(0,0,0,0.25)',
    overflow: 'hidden',
    marginTop: -150,
  },
  frameInner: {
    flex: 1,
    borderRadius: 28,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.15)',
    margin: 16,
  },
  permissionPlaceholder: {
    backgroundColor: '#0f172a',
  },
  permissionState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    gap: 16,
  },
  permissionText: {
    fontSize: FONTS.size.lsmall,
    lineHeight: 22,
    color: '#ffffff',
    textAlign: 'center',
    fontFamily: 'Roboto-Medium',
  },
  permissionButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 16,
    backgroundColor: COLORS.buttonPrimary,
  },
  permissionButtonText: {
    color: '#ffffff',
    fontSize: FONTS.size.lsmall,
    fontFamily: 'Roboto-Medium',
  },
  qrScanButtonContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: SIZES.small,
    padding: 4,
    gap: 8,
    marginHorizontal: SIZES.large,
    zIndex: 2,
  },
  qrScanButton: {
    flexGrow: 1,
    height: 40,
    borderRadius: SIZES.small,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
  },
  qrScanButtonText: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: FONTS.size.small,
    fontFamily: 'Roboto-Medium',
  },
  qrScanButtonTextActive: {
    color: '#ffffff',
    fontSize: FONTS.size.small,
    fontFamily: 'Roboto-Medium',
  },
});

