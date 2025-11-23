import React from 'react';
import {
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { Header, FormField, PrimaryButton } from '../components';
import { COLORS, COMMON_STYLES } from '../constants';
import { ROUTES, useAppNavigation } from '../navigation';
import { useAppContext } from '../context';

export const WalletSendScreen = () => {
  const { goBack, navigate } = useAppNavigation();
  const { walletSendAddress, setWalletSendAddress } = useAppContext();

  const handleScanPress = () => {
    navigate(ROUTES.walletQrScan);
  };

  const handleConfirm = () => {
    if (!walletSendAddress) {
      Alert.alert('주소 필요', '바코드 스캔으로 수신자 주소를 입력해주세요.');
      return;
    }
    navigate(ROUTES.walletEstimate);
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <Header title="Sending" onBackPress={goBack} showBackButton />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.contentWidth, styles.mainSection]}>
          <View style={styles.balanceSection}>
            <Text style={styles.balanceLabel}>Balance</Text>
            <Text style={styles.balanceValue}>9,876</Text>
            <Text style={styles.balanceToken}>POL</Text>
          </View>

          <View style={styles.tokenBadge}>
            <Text style={styles.tokenBadgeText}>POL</Text>
          </View>

          <FormField
            label="Receiver Address"
            placeholder="지갑 주소를 입력하세요"
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
          <PrimaryButton title="Confirm" fullWidth onPress={handleConfirm} />
        </View>
      </ScrollView>

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
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 32,
  },
  contentWidth: {
    width: '100%',
    maxWidth: 780,
    alignSelf: 'center',
  },
  mainSection: {
    flexGrow: 1,
  },
  balanceSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  balanceLabel: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: 'Roboto-Medium',
    color: '#8e9bae',
    marginBottom: 8,
  },
  balanceValue: {
    fontSize: 32,
    lineHeight: 48,
    fontFamily: 'Roboto-Bold',
    color: COLORS.headerText,
  },
  balanceToken: {
    fontSize: 14,
    lineHeight: 24,
    fontFamily: 'Roboto-Medium',
    color: '#10192d',
  },
  tokenBadge: {
    alignSelf: 'center',
    paddingHorizontal: 24,
    paddingVertical: 8,
    borderRadius: 40,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#ebedf5',
    marginBottom: 32,
  },
  tokenBadgeText: {
    fontSize: 16,
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
    width: '100%',
  },
  homeIndicator: {
    height: 34,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 9,
  },
  homeIndicatorBar: {
    width: 134,
    height: 5,
    backgroundColor: '#10192d',
    borderRadius: 100,
    marginBottom: 9,
  },
});


