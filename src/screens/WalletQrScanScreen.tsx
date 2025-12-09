import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
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

export const WalletQrScanScreen = () => {
  const { t } = useTranslation();
  const { goBack, navigate } = useAppNavigation();
  const { setWalletSendAddress } = useAppContext();
  const [permission, requestPermission] = useCameraPermissions();
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (!permission) {
      requestPermission();
    }
  }, [permission, requestPermission]);

  const handleBarCodeScanned = useCallback(
    ({ data }: BarcodeScanningResult) => {
      if (isProcessing) {
        return;
      }
      setIsProcessing(true);
      setWalletSendAddress(data);
      goBack();
    },
    [goBack, isProcessing, setWalletSendAddress],
  );
  const handleQrScanPress = () => {
    navigate(ROUTES.walletReceive);
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
              <Text style={styles.qrScanButtonTextActive}>{t('screens.walletReceive.scan')}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.qrScanButton, styles.buttonActive]}>
              <Text style={styles.qrScanButtonText}>{t('screens.walletReceive.myQrCode')}</Text>
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
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-start',
    paddingTop: 60,
  },
  topBarContainer: {
    flexDirection: 'column',
    gap: SIZES.medium,
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
  },
  rectangleWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -150,
    flex: 1,
    borderWidth: 5,
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

