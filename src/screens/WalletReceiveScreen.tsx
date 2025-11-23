import React from 'react';
import {
  Alert,
  Platform,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { Header, PrimaryButton, SecondaryButton } from '../components';
import { COLORS, COMMON_STYLES } from '../constants';
import { copyToClipboard } from '../utils';

const WALLET_ADDRESS =
  '0x61cf20b2ebd91caa22782a740f82dcf87ad2b2be7b6401ec3daf2234e7531fbf';

export const WalletReceiveScreen = () => {
  const handleCopy = () => {
    copyToClipboard(WALLET_ADDRESS);
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: WALLET_ADDRESS,
      });
    } catch (error) {
      Alert.alert('공유 실패', '주소를 공유하지 못했습니다.');
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <Header title="Share Wallet Address" showBackButton />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.contentWidth, styles.content]}>
          <View style={styles.qrWrapper}>
            <View style={styles.qrBorder}>
              <View style={styles.qrInnerBorder}>
                <View style={styles.qrPlaceholder}>
                  <Ionicons name="qr-code-outline" size={120} color="#10192d" />
                </View>
              </View>
            </View>
          </View>

          <View style={styles.addressSection}>
            <Text style={styles.addressLabel}>Address</Text>
            <View style={styles.addressBox}>
              <Text style={styles.addressValue}>{WALLET_ADDRESS}</Text>
            </View>
          </View>
        </View>

        <View style={[COMMON_STYLES.bottomSection, styles.bottomSection]}>
          <PrimaryButton
            title="Copy Address"
            fullWidth
            onPress={handleCopy}
            style={styles.primaryButton}
          />
          <SecondaryButton
            title="Share Address"
            fullWidth
            onPress={handleShare}
            style={styles.secondaryButton}
          />
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


