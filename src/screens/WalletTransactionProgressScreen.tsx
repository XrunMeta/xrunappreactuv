import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { SafeScrollView } from '../components';
import { useTranslation } from 'react-i18next';
import BigNumber from 'bignumber.js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Header, PrimaryButton } from '../components';
import { COLORS, COMMON_STYLES } from '../constants';
import { ROUTES, useAppNavigation } from '../navigation';
import { useAppContext } from '../context';
import { postTransferNew } from '../services';

const InfoCard = ({ label, value }: { label: string; value: string }) => (
  <View style={styles.card}>
    <Text style={styles.cardLabel}>{label}</Text>
    <Text style={styles.cardValue}>{value}</Text>
  </View>
);

export const WalletTransactionProgressScreen = () => {
  const { t } = useTranslation();
  const { goBack, navigate } = useAppNavigation();
  const {
    walletSendAddress,
    walletSendAmount,
    selectedWalletAsset,
    setTransactionResult,
  } = useAppContext();

  const [isProcessing, setIsProcessing] = useState(true);
  const [statusMessage, setStatusMessage] = useState(t('screens.walletTransactionProgress.processing') || 'Processing transaction...');
  const [isSuccess, setIsSuccess] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [userAddress, setUserAddress] = useState<string>('');
  const [member, setMember] = useState<string>('');
  const transferExecutedRef = useRef(false);

  useEffect(() => {
    const loadUserData = async () => {
      try {

        if (selectedWalletAsset?.originalData?.address) {
          setUserAddress(selectedWalletAsset.originalData.address);
        }

        const userDataStr = await AsyncStorage.getItem('userData');
        if (userDataStr) {
          const userData = JSON.parse(userDataStr);
          if (userData.member) {
            setMember(String(userData.member));
          }
        }
      } catch (error) {
        console.error('[WalletTransactionProgress] 사용자 데이터 로드 오류:', error);
      }
    };
    loadUserData();
  }, [selectedWalletAsset]);

  useEffect(() => {

    if (!walletSendAddress || !walletSendAmount || !selectedWalletAsset || !userAddress || !member) {
      console.log('[WalletTransactionProgress] 필수 정보 대기 중...');
      return;
    }

    if (transferExecutedRef.current) {
      console.log('[WalletTransactionProgress] 전송 이미 실행됨, 중복 실행 방지');
      return;
    }

    transferExecutedRef.current = true;

    const processTransfer = async () => {
      try {
        console.log('[WalletTransactionProgress] 전송 프로세스 시작...');

        setStatusMessage(t('screens.walletTransactionProgress.checkingTicket') || 'Checking transfer ticket...');

        setStatusMessage(t('screens.walletTransactionProgress.executingTransfer') || 'Executing blockchain transfer...');

        const formattedAmount = new BigNumber(walletSendAmount || '0').toFixed();
        const currency = selectedWalletAsset.currency || 0;
        const isPolygon = currency === 16 || currency === 18;
        const network = isPolygon ? 'POL' : 'ETH';
        const chainId = isPolygon ? 153 : 1;

        const transferResult = await postTransferNew(
          userAddress,
          walletSendAddress,
          formattedAmount,
          member,
          network,
          currency,
          chainId,
          navigate,
        );

        console.log('[WalletTransactionProgress] 전송 결과:', transferResult);

        if (transferResult.status !== 'success' || !transferResult.data?.txHash) {
          throw new Error(
            (t('screens.walletTransactionProgress.transferFailed') || 'Transfer failed') +
            ': ' +
            (transferResult.message || t('screens.walletTransactionProgress.noTxHash') || 'No transaction hash')
          );
        }

        const resultTxHash = transferResult.data.txHash;
        setTxHash(resultTxHash);
        setIsSuccess(true);
        setIsProcessing(false);
        setStatusMessage(t('screens.walletTransactionProgress.transferCompleted') || 'Transfer completed successfully!');

        setTransactionResult({
          txHash: resultTxHash,
          amount: formattedAmount,
          symbol: selectedWalletAsset.symbol || '',
          toAddress: walletSendAddress,
          gasPrice: '0', 
          network: network,
          currency: currency,
          chainId: chainId,
        });

        console.log('[WalletTransactionProgress] 전송 완료:', {
          txHash: resultTxHash,
          amount: formattedAmount,
          symbol: selectedWalletAsset.symbol,
          toAddress: walletSendAddress,
          network,
          currency,
          chainId,
        });

        setTimeout(() => {
          navigate(ROUTES.walletTransactionResult);
        }, 1000);
      } catch (error) {
        console.error('[WalletTransactionProgress] 전송 실패:', error);
        setIsProcessing(false);
        setIsSuccess(false);
        setStatusMessage(t('screens.walletTransactionProgress.transferFailed') || 'Transfer failed');

        Alert.alert(
          t('screens.walletTransactionProgress.alerts.transferFailed') || 'Transfer Failed',
          error instanceof Error ? error.message : (t('screens.walletTransactionProgress.alerts.transferFailedMessage') || 'Transfer failed. Please try again.'),
          [
            {
              text: t('screens.walletTransactionProgress.alerts.confirm') || 'OK',
              onPress: () => navigate(ROUTES.wallet),
            },
          ],
        );
      }
    };

    processTransfer();
  }, [walletSendAddress, walletSendAmount, selectedWalletAsset, userAddress, member, navigate, setTransactionResult, t]);

  const formattedSendAmount = walletSendAmount
    ? new BigNumber(walletSendAmount || '0').toFixed()
    : '0';
  const sendToken = selectedWalletAsset?.symbol || '';

  if (!selectedWalletAsset) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Header title={t('screens.walletTransactionProgress.title')} onBackPress={goBack} showBackButton />

      <SafeScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.balanceSection}>
          <Text style={styles.balanceLabel}>{t('screens.walletTransactionProgress.amount') || t('screens.walletTransactionProgress.balance')}</Text>
          <Text style={styles.balanceValue}>{formattedSendAmount}</Text>
          <Text style={styles.balanceToken}>{sendToken}</Text>
        </View>

        <InfoCard
          label={t('screens.walletTransactionProgress.from')}
          value={userAddress || t('screens.walletTransactionProgress.loading') || 'Loading...'}
        />
        <InfoCard
          label={t('screens.walletTransactionProgress.to')}
          value={walletSendAddress || t('screens.walletTransactionProgress.loading') || 'Loading...'}
        />
        <InfoCard
          label={t('screens.walletTransactionProgress.gasPrice')}
          value={t('screens.walletTransactionProgress.calculating') || 'Calculating...'}
        />

        <View style={styles.progressRow}>
          {isProcessing && <ActivityIndicator size="small" color={COLORS.buttonPrimary} />}
          <Text style={styles.progressText}>{statusMessage}</Text>
        </View>

        {!isProcessing && isSuccess && (
          <View style={[COMMON_STYLES.bottomSection, styles.bottomSection]}>
            <PrimaryButton
              title={t('screens.walletTransactionProgress.listPage')}
              fullWidth
              onPress={() => navigate(ROUTES.walletTransactionResult)}
            />
          </View>
        )}
      </SafeScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    fontSize: 16,
    fontFamily: 'Roboto-Medium',
    color: '#8e9bae',
    marginBottom: 8,
  },
  balanceValue: {
    fontSize: 32,
    fontFamily: 'Roboto-Bold',
    color: COLORS.headerText,
    lineHeight: 48,
  },
  balanceToken: {
    fontSize: 14,
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
    fontSize: 14,
    fontFamily: 'Roboto-Regular',
    color: '#747474',
    marginBottom: 6,
  },
  cardValue: {
    fontSize: 16,
    fontFamily: 'Roboto-Medium',
    color: '#1a2e35',
    lineHeight: 22,
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 12,
  },
  progressText: {
    fontSize: 14,
    fontFamily: 'Roboto-Regular',
    color: '#707070',
  },
  bottomSection: {
    ...COMMON_STYLES.bottomButtonContainer,
  },
});
