import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { SafeScrollView } from '../components';
import { StatusBar } from 'expo-status-bar';
import { useTranslation } from 'react-i18next';
import BigNumber from 'bignumber.js';
import { Header, PrimaryButton, WalletKeyPinPromptModal } from '../components';
import { COLORS, COMMON_STYLES, FONTS } from '../constants';
import { ROUTES, useAppNavigation } from '../navigation';
import { useAppContext } from '../context';
import { getGasEstimation } from '../services';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtPayloadSub, type WalletKey } from '../services/walletKeyStore';
import { hasPendingWallets, isLocalSendEnabledForUser } from '../services/walletSendLocal';

const InfoCard = ({ label, value, loading }: { label: string; value: string; loading?: boolean }) => (
  <View style={styles.card}>
    <Text style={styles.cardLabel}>{label}</Text>
    {loading ? (
      <View style={styles.cardValueLoadingRow}>
        <ActivityIndicator size="small" color={COLORS.buttonPrimary} />
        <Text style={styles.cardValueLoadingText}>{value}</Text>
      </View>
    ) : (
      <Text style={styles.cardValue}>{value}</Text>
    )}
  </View>
);

export const WalletEstimateFeeScreen = () => {
  const { t } = useTranslation();
  const { goBack, navigate } = useAppNavigation();
  const { walletSendAddress, walletSendAmount, selectedWalletAsset, setUnlockedWalletsForSend } = useAppContext();

  const [isLoading, setIsLoading] = useState(false);
  const [gasPrice, setGasPrice] = useState<number | null>(null);
  const [countdown, setCountdown] = useState(15);
  const countdownRef = useRef<NodeJS.Timeout | null>(null);
  const [userAddress, setUserAddress] = useState<string>('');

  const [pinPromptVisible, setPinPromptVisible] = useState(false);
  const [pinPromptProps, setPinPromptProps] = useState<{ memberId: number; email: string } | null>(null);

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
      console.warn('[WalletEstimateFee] 필수 정보가 없습니다.', {
        hasWalletSendAddress: !!walletSendAddress,
        hasWalletSendAmount: !!walletSendAmount,
        hasSelectedAsset: !!selectedWalletAsset,
        hasUserAddress: !!userAddress,
      });
      setIsLoading(false);
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

        const estimatedCost =
          result.data[0].estimatedFee ?? result.data[0].estimatedCost;
        if (estimatedCost != null) {
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
      const unit = currency === 16 || currency === 18 ? 'POL' : 'ETH';

      const fixed = new BigNumber(gasPrice.toString()).toFixed(10);
      const trimmed = fixed.replace(/(\.\d*?)0+$/, '$1').replace(/\.$/, '');
      return `${trimmed} ${unit}`;
    } catch (error) {
      console.error('[WalletEstimateFee] 가스 수수료 포맷팅 오류:', error);
      return t('screens.walletEstimateFee.error');
    }
  };

  const formatSpeed = () => {
    return t('screens.walletEstimateFee.speedNormal');
  };

  const triggerPinPrompt = async () => {
    try {
      const jwt = await AsyncStorage.getItem('jwt');
      const memberId = jwt ? jwtPayloadSub(jwt) : null;
      let emailRaw = await AsyncStorage.getItem('userEmail');
      if (!emailRaw) {
        const ud = await AsyncStorage.getItem('userData');
        if (ud) {
          try { emailRaw = (JSON.parse(ud) as { email?: string })?.email ?? null; } catch {}
        }
      }
      if (memberId == null || !emailRaw) {
        Alert.alert('오류', '세션 정보를 찾을 수 없습니다. 다시 로그인해주세요.');
        return false;
      }
      const email = emailRaw.toLowerCase().trim();
      setPinPromptProps({ memberId, email });
      setPinPromptVisible(true);
      return true;
    } catch (e) {
      console.error('[WalletEstimateFee] PIN prompt 초기화 실패:', e);
      Alert.alert('오류', '송금 준비 중 오류가 발생했습니다.');
      return false;
    }
  };

  const onPinSuccess = (wallets: WalletKey[], _pin: string) => {
    setPinPromptVisible(false);
    setPinPromptProps(null);

    setUnlockedWalletsForSend(wallets);

    if (countdownRef.current) {
      clearInterval(countdownRef.current);
      countdownRef.current = null;
    }
    navigate(ROUTES.walletTransactionProgress);
  };

  const onPinCancel = () => {
    setPinPromptVisible(false);
    setPinPromptProps(null);
  };

  const handleConfirm = async () => {
    if (!gasPrice && gasPrice !== 0) {
      Alert.alert(
        t('screens.walletEstimateFee.alerts.error'),
        t('screens.walletEstimateFee.alerts.gasNotReady'),
      );
      return;
    }

    if (hasPendingWallets()) {

      if (countdownRef.current) {
        clearInterval(countdownRef.current);
        countdownRef.current = null;
      }
      navigate(ROUTES.walletTransactionProgress);
      return;
    }

    try {
      const ud = await AsyncStorage.getItem('userData');
      const em = ud ? String(((JSON.parse(ud) as any)?.email ?? '')).toLowerCase().trim() : '';
      if (em === 'oth-test@example.invalid') {
        console.log('[WalletEstimateFee] dev 계정 oth-test@example.invalid — PIN modal skip · Progress 로 직행');
        if (countdownRef.current) {
          clearInterval(countdownRef.current);
          countdownRef.current = null;
        }
        navigate(ROUTES.walletTransactionProgress);
        return;
      }
    } catch {  }

    await triggerPinPrompt();
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
          loading={isLoading || gasPrice === null}
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
      {}
      {pinPromptProps && (
        <WalletKeyPinPromptModal
          visible={pinPromptVisible}
          memberId={pinPromptProps.memberId}
          email={pinPromptProps.email}
          onSuccess={onPinSuccess}
          onCancel={onPinCancel}
        />
      )}
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
  cardValueLoadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  cardValueLoadingText: {
    fontSize: FONTS.size.medium,
    fontFamily: 'Roboto-Medium',
    color: '#8e9bae',
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
