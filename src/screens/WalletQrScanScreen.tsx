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
import { COLORS } from '../constants';
import { useAppNavigation } from '../navigation';
import { useAppContext } from '../context';

export const WalletQrScanScreen = () => {
  const { t } = useTranslation();
  const { goBack } = useAppNavigation();
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
    <View style={styles.container}>
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
        <View style={styles.topBar}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={goBack}
            activeOpacity={0.8}
          >
            <Ionicons name="chevron-back" size={24} color="#ffffff" />
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <Text style={styles.title}>{t('screens.walletQrScan.scanQrCode')}</Text>
          <View style={styles.frameOuter}>
            <View style={styles.frameInner} />
          </View>
        </View>
      </View>

      {Platform.OS === 'ios' && (
        <View style={styles.homeIndicator}>
          <View style={styles.homeIndicatorBar} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-start',
    paddingTop: 60,
  },
  topBar: {
    paddingHorizontal: 24,
    alignItems: 'flex-start',
  },
  backButton: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 24,
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
    fontSize: 15,
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
    fontSize: 15,
    fontFamily: 'Roboto-Medium',
  },
  homeIndicator: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 34,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 9,
  },
  homeIndicatorBar: {
    width: 134,
    height: 5,
    backgroundColor: '#10192d',
    borderRadius: 100,
  },
});


