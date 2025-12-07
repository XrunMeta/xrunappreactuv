import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Modal, Alert } from 'react-native';
import { SafeScrollView } from '../components';
import { StatusBar } from 'expo-status-bar';
import { useTranslation } from 'react-i18next';
import BigNumber from 'bignumber.js';
import { Header, PrimaryButton } from '../components';
import { COLORS, COMMON_STYLES, FONTS } from '../constants';
import { ROUTES, useAppNavigation } from '../navigation';
import { useAppContext } from '../context';
import { getGasEstimation } from '../services';
import AsyncStorage from '@react-native-async-storage/async-storage';

const InfoCard = ({ label, value }: { label: string; value: string }) => (
  <View style={styles.card}>
    <Text style={styles.cardLabel}>{label}</Text>
    <Text style={styles.cardValue}>{value}</Text>
  </View>
);

export const WalletEstimateFeeScreen = () => {
  const { t } = useTranslation();
  const { goBack, navigate } = useAppNavigation();
  const { walletSendAddress, walletSendAmount, selectedWalletAsset } = useAppContext();

  const [isLoading, setIsLoading] = useState(true);
  const [gasPrice, setGasPrice] = useState<number | null>(null);
  const [countdown, setCountdown] = useState(15);
  const countdownRef = useRef<NodeJS.Timeout | null>(null);
  const [userAddress, setUserAddress] = useState<string>('');

  useEffect(() => {
    const loadUserAddress = async () => {
      try {
        if (selectedWalletAsset?.originalData?.address) {
          setUserAddress(selectedWalletAsset.originalData.address);
        }
      } catch (error) {
        console.error('[WalletEstimateFee] 사용자 주소 로드 오류:', error);
      }
    };
    loadUserAddress();
  }, [selectedWalletAsset]);

  const fetchGasEstimation = async () => {
    if (!walletSendAddress || !walletSendAmount || !selectedWalletAsset || !userAddress) {
      console.warn('[WalletEstimateFee] 필수 정보가 없습니다.');
      return;
    }

    try {
      setIsLoading(true);

      const formattedAmount = new BigNumber(walletSendAmount || '0').toFixed();
      const token = selectedWalletAsset.symbol || '';
      const currency = selectedWalletAsset.currency || 0;

      const isPolygon = currency === 16 || currency === 18;
      const network = isPolygon ? 'POL' : 'ETH';
      const chainId = isPolygon ? 153 : 1;

      console.log('[WalletEstimateFee] 가스 수수료 예상 요청:', {
        fromAddress: userAddress,
        toAddress: walletSendAddress,
        amount: formattedAmount,
        token,
        currency,
        network,
        chainId,
      });

      const result = await getGasEstimation(
        userAddress,
        walletSendAddress,
        formattedAmount,
        token,
        currency,
        network,
        chainId,
        2, 
        navigate,
      );

      console.log('[WalletEstimateFee] 가스 수수료 예상 응답:', result);

      if (result?.data && Array.isArray(result.data) && result.data.length > 0) {
        const estimatedCost = result.data[0].estimatedCost;
        if (estimatedCost) {
          setGasPrice(estimatedCost);
        } else {
          setGasPrice(result.data[0].gasPrice || 0);
        }
      } else {
        console.warn('[WalletEstimateFee] 잘못된 가스 수수료 응답:', result);
        setGasPrice(0);
      }
    } catch (error) {
      console.error('[WalletEstimateFee] 가스 수수료 예상 실패:', error);
      setGasPrice(0);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;

    const initialTimer = setTimeout(() => {
      if (isMounted) {
        fetchGasEstimation();
      }
    }, 100);

    const intervalTimer = setInterval(() => {
      if (isMounted) {
        setCountdown((prev) => {
          if (prev <= 1) {
            console.log('[WalletEstimateFee] 가스 수수료 예상 갱신...');
            fetchGasEstimation();
            return 15; 
          }
          return prev - 1;
        });
      }
    }, 1000);

    countdownRef.current = intervalTimer;

    return () => {
      isMounted = false;
      clearTimeout(initialTimer);
      if (countdownRef.current) {
        clearInterval(countdownRef.current);
        countdownRef.current = null;
      }
    };
  }, [walletSendAddress, walletSendAmount, selectedWalletAsset, userAddress]);

  const formatGasFee = () => {
    if (isLoading || gasPrice === null) {
      return t('screens.walletEstimateFee.loading');
    }

    try {
      const currency = selectedWalletAsset?.currency || 0;
      const isPolygon = currency === 16 || currency === 18;
      const network = isPolygon ? 'POL' : 'ETH';
      return `${parseFloat(gasPrice.toString()).toFixed(6)} ${network}`;
    } catch (error) {
      console.error('[WalletEstimateFee] 가스 수수료 포맷팅 오류:', error);
      return t('screens.walletEstimateFee.error');
    }
  };

  const formatSpeed = () => {
    return t('screens.walletEstimateFee.speedNormal');
  };

  const handleConfirm = () => {
    if (!gasPrice && gasPrice !== 0) {
      Alert.alert(
        t('screens.walletEstimateFee.alerts.error'),
        t('screens.walletEstimateFee.alerts.gasNotReady'),
      );
      return;
    }

    if (countdownRef.current) {
      clearInterval(countdownRef.current);
      countdownRef.current = null;
    }

    navigate(ROUTES.walletTransactionProgress);
  };

  const formattedSendAmount = walletSendAmount
    ? new BigNumber(walletSendAmount || '0').toFixed()
    : '0';
  const sendToken = selectedWalletAsset?.symbol || '';

  if (!selectedWalletAsset) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Header title={t('screens.walletEstimateFee.title')} onBackPress={goBack} showBackButton />

      {isLoading && (
        <Modal transparent animationType="fade" visible={isLoading}>
          <View style={styles.loadingOverlay}>
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#FFFFFF" />
              <Text style={styles.loadingText}>
                {t('screens.walletEstimateFee.loadingGas')}
              </Text>
            </View>
          </View>
        </Modal>
      )}

      <SafeScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.balanceSection}>
          <Text style={styles.balanceLabel}>{t('screens.walletEstimateFee.amount')}</Text>
          <Text style={styles.balanceValue}>{formattedSendAmount}</Text>
          <Text style={styles.balanceToken}>{sendToken}</Text>
        </View>

        <InfoCard
          label={t('screens.walletEstimateFee.from')}
          value={userAddress || t('screens.walletEstimateFee.loading')}
        />
        <InfoCard
          label={t('screens.walletEstimateFee.to')}
          value={walletSendAddress || t('screens.walletEstimateFee.receiverAddressPlaceholder')}
        />
        <InfoCard
          label={t('screens.walletEstimateFee.networkFee')}
          value={formatGasFee()}
        />
        <InfoCard
          label={t('screens.walletEstimateFee.speed')}
          value={formatSpeed()}
        />

        <Text style={styles.helperText}>
          {t('screens.walletEstimateFee.estimation')} {countdown}{' '}
          {t('screens.walletEstimateFee.seconds')}
          {countdown !== 1 && (t('screens.walletEstimateFee.seconds') === 'second' || t('screens.walletEstimateFee.seconds') === 'detik') ? 's' : ''}
        </Text>

        <View style={[COMMON_STYLES.bottomSection, styles.bottomSection]}>
          <PrimaryButton
            title={t('screens.walletEstimateFee.confirm')}
            fullWidth
            onPress={handleConfirm}
            disabled={isLoading || (gasPrice === null && gasPrice !== 0)}
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

  balanceSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  balanceLabel: {
    fontSize: FONTS.size.medium,
    fontFamily: 'Roboto-Medium',
    color: '#8e9bae',
    marginBottom: 8,
  },
  balanceValue: {
    fontSize: FONTS.size.xxxlarge,
    fontFamily: 'Roboto-Bold',
    color: COLORS.headerText,
    lineHeight: 48,
  },
  balanceToken: {
    fontSize: FONTS.size.msmall,
    fontFamily: 'Roboto-Medium',
    color: '#10192d',
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
  cardValue: {
    fontSize: FONTS.size.medium,
    fontFamily: 'Roboto-Medium',
    color: '#1a2e35',
    lineHeight: 22,
  },
  helperText: {
    textAlign: 'center',
    fontSize: FONTS.size.msmall,
    fontFamily: 'Roboto-Regular',
    color: '#707070',
    marginTop: 8,
  },
  bottomSection: {
    width: '100%',
  },
  loadingOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContainer: {
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: FONTS.size.medium,
    fontFamily: 'Roboto-Regular',
    color: '#FFFFFF',
  },
});
