import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { Dialog, SafeScrollView } from '../components';
import { useTranslation } from 'react-i18next';
import BigNumber from 'bignumber.js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Header, PrimaryButton } from '../components';
import { COLORS, COMMON_STYLES, FONTS } from '../constants';
import { ROUTES, useAppNavigation } from '../navigation';
import { useAppContext } from '../context';
import { useAlertDialog } from '../context/AlertDialogContext';
import { postTransferNew } from '../services';
import { consumePendingWallets, sendPolygonLocal, isLocalSendEnabledForUser, clearPendingWallets, recordOnchainTransfer } from '../services/walletSendLocal';

const InfoCard = ({ label, value }: { label: string; value: string }) => (
  <View style={styles.card}>
    <Text style={styles.cardLabel}>{label}</Text>
    <Text style={styles.cardValue}>{value}</Text>
  </View>
);

export const WalletTransactionProgressScreen = () => {
  const { t } = useTranslation();
  const { showAlert } = useAlertDialog();
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
  const [userEmail, setUserEmail] = useState<string>('');
  const [transferFailedDialogVisible, setTransferFailedDialogVisible] = useState(false);
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
          if (userData.email) {
            setUserEmail(String(userData.email));
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

        let transferResult: any;
        const pendingWallets = consumePendingWallets();

        const isClientSignSupported = currency === 1 || currency === 2 || currency === 16 || currency === 18;
        if (
          pendingWallets &&
          isLocalSendEnabledForUser(userEmail) &&
          isClientSignSupported
        ) {
          console.log('[WalletTransactionProgress] 🔥 클라사이드 송금 흐름 진입', {
            email: userEmail, currency, count: pendingWallets.length,
          });

          const isEthChain = currency === 1 || currency === 2;
          const targetCode = `c${currency}`;
          const target = pendingWallets.find(w => w.wallet_code === targetCode)
            ?? pendingWallets.find(w => isEthChain
              ? /^c[12]$|eth/i.test(w.wallet_code)
              : /^c(16|18)$|pol/i.test(w.wallet_code));
          if (!target) {
            console.error('[WalletTransactionProgress] 매칭 wallet 없음', { targetCode });
            clearPendingWallets();
            throw new Error('지갑 키 매칭 실패 — 다시 시도해주세요.');
          }
          const local = await sendPolygonLocal({
            privateKey: target.private_key,
            fromAddress: userAddress,
            toAddress: walletSendAddress,
            amount: formattedAmount,
            currency,
          });

          (target as any).private_key = '';
          pendingWallets.length = 0;

          if (!local.ok) {
            console.error('[WalletTransactionProgress] 로컬 송금 실패:', local);

            const failDetail = String((local as any).detail ?? '');
            const isGasShort = (local as any).reason === 'broadcast-failed'
              && /수수료|가스|insufficient funds/i.test(failDetail);
            if (isGasShort) {
              setIsProcessing(false);
              setIsSuccess(false);
              await showAlert(
                '가스비 부족',
                '지갑에 송금 수수료(가스비)가 부족해 송금을 진행할 수 없어요.\n\n폴리곤 네트워크 가스 토큰(POL) 을 충전한 뒤 다시 시도해주세요.',
              );
              return;
            }
            throw new Error(`송금 실패: ${(local as any).reason} ${(local as any).detail ?? ''}`);
          }

          recordOnchainTransfer({
            member: Number(member),
            from: userAddress,
            to: walletSendAddress,
            amount: formattedAmount,
            currency,
            network: local.network,  
            txHash: local.txHash,
            blockNumber: local.blockNumber,
          }).catch(() => {  });

          transferResult = {
            status: 'success',
            code: 200,
            data: [{ txHash: local.txHash, blockNumber: String(local.blockNumber) }],
            message: '클라사이드 송금 완료',
          };
        } else {
          console.log('[WalletTransactionProgress] 기존 서버 송금 흐름 (postTransferNew)');
          transferResult = await postTransferNew(
            userAddress,
            walletSendAddress,
            formattedAmount,
            member,
            network,
            currency,
            chainId,
            navigate,
          );
        }

        console.log('[WalletTransactionProgress] 전송 결과:', transferResult);
        console.log('[WalletTransactionProgress] 전송 결과 코드:', transferResult.code);
        console.log('[WalletTransactionProgress] 전송 결과 코드 타입:', typeof transferResult.code);

        const code = Number(transferResult.code);
        if (code === 2000) {
          setStatusMessage('전송가능 금액이 초과되었습니다.');          
          setIsProcessing(false);
          setIsSuccess(false);
          setTransferFailedDialogVisible(true);
          return;
        }

        const transferData = Array.isArray(transferResult.data)
          ? transferResult.data[0]
          : transferResult.data;

        if (transferResult.status !== 'success' || !transferData?.txHash) {
          const rawMsg = transferResult.message || t('screens.walletTransactionProgress.noTxHash') || 'No transaction hash';
          let krMsg = rawMsg;
          if (/amount is zero|Required fields missing/i.test(rawMsg)) {
            krMsg = '전송 금액이 0이거나 필수 정보가 누락되었습니다.';
          } else if (/limit exceeded|transfer limit/i.test(rawMsg)) {
            krMsg = '전송 가능 금액이 초과되었습니다.';
          } else if (/insufficient/i.test(rawMsg)) {
            krMsg = '잔액이 부족합니다.';
          } else if (/^[\x00-\x7F\s]+$/.test(rawMsg)) {
            krMsg = '전송 처리 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.';
          }
          throw new Error(
            (t('screens.walletTransactionProgress.transferFailed') || '전송 실패') + ': ' + krMsg
          );
        }

        const resultTxHash = transferData.txHash;
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
        setTransferFailedDialogVisible(true);
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

      <Dialog
        visible={transferFailedDialogVisible}
        title={t('screens.walletTransactionProgress.alerts.transferFailed')}
        onClose={() => {
          setTransferFailedDialogVisible(false);
          navigate(ROUTES.wallet);
        }}
        actions={[
          {
            label: t('screens.walletTransactionProgress.alerts.confirm'),
            variant: 'primary',
            onPress: () => {
              setTransferFailedDialogVisible(false);
              navigate(ROUTES.wallet);
            },
          },
        ]}
      >
        <Text style={styles.dialogMessage}>
          {statusMessage}
        </Text>
      </Dialog>
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
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 12,
  },
  progressText: {
    fontSize: FONTS.size.msmall,
    fontFamily: 'Roboto-Regular',
    color: '#707070',
  },
  bottomSection: {
    ...COMMON_STYLES.bottomButtonContainer,
  },
  dialogMessage: {
    fontSize: FONTS.size.msmall,
    fontFamily: 'Roboto-Regular',
    color: '#1a2e35',
    lineHeight: 22,
    textAlign: 'center',
  },
});
