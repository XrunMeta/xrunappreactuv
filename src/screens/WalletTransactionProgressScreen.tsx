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
import { JsonRpcProvider, Wallet, Contract, parseUnits, getAddress } from 'ethers';
import { getEnv } from '../utils';

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
    unlockedWalletsForSend,
    setUnlockedWalletsForSend,
  } = useAppContext();

  const [isProcessing, setIsProcessing] = useState(true);
  const [statusMessage, setStatusMessage] = useState(t('screens.walletTransactionProgress.processing') || 'Processing transaction...');
  const [isSuccess, setIsSuccess] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [userAddress, setUserAddress] = useState<string>('');
  const [member, setMember] = useState<string>('');
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
        console.log('[WalletTransactionProgress] 전송 프로세스 시작 (T-031 클라이언트 서명)...');

        setStatusMessage(t('screens.walletTransactionProgress.checkingTicket') || 'Checking transfer ticket...');

        if (!unlockedWalletsForSend || unlockedWalletsForSend.length === 0) {
          throw new Error('지갑 키가 잠겨있습니다. 이전 화면으로 돌아가서 PIN을 다시 입력해주세요.');
        }

        const formattedAmount = new BigNumber(walletSendAmount || '0').toFixed();
        const currency = selectedWalletAsset.currency || 0;
        const isPolygon = currency === 16 || currency === 18;
        const network = isPolygon ? 'POL' : 'ETH';
        const chainId = isPolygon ? 137 : 1;

        setStatusMessage('전송 한도 확인 중...');
        try {
          const env = getEnv();
          const limitRes = await fetch(`https://oth-path-gw.example.invalid/oth-path`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${env.GATEWAY_AUTH_CODE}` },
            body: JSON.stringify({ member, currency, amount: formattedAmount }),
          });
          const limitJson = await limitRes.json().catch(() => ({} as any));
          if (!limitJson?.data?.allowed) {
            throw new Error(`전송 한도 초과: 한도 ${limitJson?.data?.limit ?? 0}, 요청 ${limitJson?.data?.requested ?? 0}`);
          }
        } catch (limitErr: any) {
          throw new Error(limitErr?.message || '한도 확인 실패');
        }

        setStatusMessage(t('screens.walletTransactionProgress.executingTransfer') || 'Executing blockchain transfer...');

        const walletCode = `c${currency}`;
        const myWallet = unlockedWalletsForSend.find((w) => w.wallet_code === walletCode);
        if (!myWallet) {
          throw new Error(`해당 통화(${walletCode})의 지갑 키를 찾을 수 없습니다.`);
        }

        const env = getEnv();
        const rpcUrl = isPolygon
          ? `https://polygon-mainnet.infura.io/v3/${env.INFURA_APIKEY}`
          : `https://mainnet.infura.io/v3/${env.INFURA_APIKEY}`;
        const provider = new JsonRpcProvider(rpcUrl);
        const signer = new Wallet(myWallet.private_key, provider);

        const tokenAddress = isPolygon ? env.CONTRACT_ADDRESS_POLYGON : env.CONTRACT_ADDRESS_ETH;
        const isERC20 = currency === 1 || currency === 18; 
        const toAddressChecksum = getAddress(walletSendAddress);
        const value = parseUnits(formattedAmount, 18);

        let tx: { hash: string; wait?: () => Promise<unknown> };
        if (isERC20) {
          if (!tokenAddress) throw new Error('토큰 컨트랙트 주소가 설정되지 않았습니다.');
          const ERC20_ABI = ['function transfer(address to, uint256 amount) returns (bool)'];
          const contract = new Contract(tokenAddress, ERC20_ABI, signer);
          tx = await (contract.transfer as any)(toAddressChecksum, value);
        } else {

          tx = await signer.sendTransaction({ to: toAddressChecksum, value });
        }

        console.log('[WalletTransactionProgress] 트랜잭션 broadcast 완료:', tx.hash);

        try {
          setUnlockedWalletsForSend(null);
        } catch {  }

        const resultTxHash = tx.hash;
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
  }, [walletSendAddress, walletSendAmount, selectedWalletAsset, userAddress, member, navigate, setTransactionResult, t, unlockedWalletsForSend, setUnlockedWalletsForSend]);

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
