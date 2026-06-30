import React, { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, Linking, Modal, Alert } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BigNumber from 'bignumber.js';
import { Header, WalletHeaderCard, WalletFilterDialog, DataList, TransactionListItem, SafeView } from '../components';
import { COMMON_STYLES, FONTS } from '../constants';
import { ROUTES, useAppNavigation } from '../navigation';
import { useAppContext } from '../context';
import { TransactionDetails, TransactionDetailsScreen } from './TransactionDetailsScreen';
import {
  fetchEtherscanTransactions,
  getXRUNGopaxPrice,
} from '../services';
import { TransactionHistoryItem, TransactionHistoryResponse } from '../types';
import { PaginationParams, PaginationResponse } from '../types/pagination';
import { useAlertDialog } from '../context/AlertDialogContext';
import { copyToClipboard, showToast } from '../utils';
import { findEntriesForUser } from '../services/walletKeyStore';
import { getWalletKeyATStatus } from '../services';
import { isLocalSendEnabledForUser } from '../services/walletSendLocal';
import { WalletKeyPinSetupModal } from '../components';

const iconEtherscan = require('../../assets/icon_etherscan.png');
const iconPolygonscan = require('../../assets/icon_polyganscan_color.png');

interface EtherscanTransactionItem {
  blockNumber: string;
  timeStamp: string;
  hash: string;
  nonce: string;
  blockHash: string;
  from: string;
  contractAddress: string;
  to: string;
  value: string;
  tokenName: string;
  tokenSymbol: string;
  tokenDecimal: string;
  transactionIndex: string;
  gas: string;
  gasPrice: string;
  gasUsed: string;
  cumulativeGasUsed: string;
  input: string;
  methodId: string;
  functionName: string;
  confirmations: string;
}

interface EtherscanTransactionsResponse {
  status: string;
  code: number;
  message: string;
  data: EtherscanTransactionItem[];
}

const timestampToDate = (timestamp: string): string => {
  try {
    const date = new Date(parseInt(timestamp, 10) * 1000);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}.${month}.${day} ${hours}:${minutes}`;
  } catch {
    return timestamp;
  }
};

const weiToEth = (weiValue: string, decimals: string = '18'): string => {
  try {
    const decimalPlaces = parseInt(decimals, 10);
    const divisor = new BigNumber(10).pow(decimalPlaces);
    const ethValue = new BigNumber(weiValue).dividedBy(divisor);

    return ethValue.toFixed(4).replace(/\.?0+$/, '');
  } catch {
    return '0';
  }
};

const weiToGwei = (weiValue: string): string => {
  try {
    const gweiValue = new BigNumber(weiValue).dividedBy(new BigNumber(10).pow(9));
    return gweiValue.toFixed(2).replace(/\.?0+$/, '');
  } catch {
    return '0';
  }
};

const calculateTotalSpent = (
  gasUsed: string | undefined,
  gasPrice: string | undefined,
  currency: number
): string | undefined => {
  if (!gasUsed || !gasPrice) {
    return undefined;
  }

  try {

    const totalWei = new BigNumber(gasUsed).multipliedBy(new BigNumber(gasPrice));

    const totalEth = totalWei.dividedBy(new BigNumber(10).pow(18));

    let symbol = 'ETH';
    if (currency === 16 || currency === 18) {
      symbol = 'POL';
    } else if (currency === 1 || currency === 2) {
      symbol = 'ETH';
    }

    return `${totalEth.toFixed(8).replace(/\.?0+$/, '')} ${symbol}`;
  } catch {
    return undefined;
  }
};

const getActionType = (actionCode: number, t: any): string => {
  switch (actionCode) {
    case 3304:
      return t('screens.walletDetail.received');
    case 3305:
      return t('screens.walletDetail.transfer');
    case 3306:
      return t('screens.walletDetail.conversion');
    case 3307:
      return t('screens.walletDetail.exchange');
    case 3308:
      return t('screens.walletDetail.exComplete');
    case 3651:
      return t('screens.walletDetail.withdrawal');
    case 10400:
      return t('screens.walletDetail.shop');
    default:
      return t('screens.walletDetail.other');
  }
};

const getCurrencyTheme = (currency: number) => {
  switch (currency) {
    case 1: 
      return {
        background: '#27345c',
        accentOne: 'rgba(255,255,255,0.12)',
        accentTwo: 'rgba(255,255,255,0.08)',
      };
    case 16: 
      return {
        background: '#683ab5',
        accentOne: 'rgba(255,255,255,0.12)',
        accentTwo: 'rgba(255,255,255,0.08)',
      };
    default:
      return {
        background: '#27345c',
        accentOne: 'rgba(255,255,255,0.12)',
        accentTwo: 'rgba(255,255,255,0.08)',
      };
  }
};

const getExplorerLink = (currency: number, address: string): string | null => {
  if (!address) return null;

  switch (currency) {
    case 1: 
    case 2: 
      return `https://etherscan.io/address/${address}`;
    case 16: 
    case 18: 
      return `https://polygonscan.com/address/${address}`;
    default:
      return null;
  }
};

interface TransactionListItemData extends TransactionHistoryItem {
  title: string;
  subtitle: string;
  timestamp: string;
  amount: string;
  suffix?: string;
  iconSource?: any;
  iconName?: keyof typeof Ionicons.glyphMap;
  iconColor?: string;
  amountColor?: string;

  hash?: string;
  from?: string;
  to?: string;
  nonce?: string;
  gasPrice?: string;
  gasUsed?: string;
  gas?: string;
  blockNumber?: string;
  excuteddatetime?: string;
  transaction?: string;
}

const TransactionListItemWrapper: React.FC<TransactionListItemData> = (props) => {
  return (
    <TransactionListItem
      title={props.title}
      subtitle={props.subtitle}
      timestamp={props.timestamp}
      amount={props.amount}
      suffix={props.suffix}
      iconSource={props.iconSource}
      iconName={props.iconName}
      iconColor={props.iconColor}
      amountColor={props.amountColor}
      onPress={(props as any).onPress}
    />
  );
};

export const WalletDetailScreen = () => {
  const { t } = useTranslation();
  const { navigate, goBack } = useAppNavigation();
  const {
    selectedWalletAsset,
    resetSelectedWalletAsset,
    setSelectedWalletAsset,
    setWalletReceiveAddress,
    setWalletReceiveCurrency,
    setSelectedTransactionDetails,
  } = useAppContext();
  const { showAlert } = useAlertDialog();

  useEffect(() => {

  }, [selectedWalletAsset]);

  const [filterVisible, setFilterVisible] = useState(false);
  const [selectedType, setSelectedType] = useState<'all' | 'send' | 'receive'>('all');
  const [member, setMember] = useState<number | null>(null);
  const [publicAddress, setPublicAddress] = useState<string>('');
  const [gopaxPrice, setGopaxPrice] = useState<number | null>(null);

  const [pinSetupVisible, setPinSetupVisible] = useState(false);
  const [pinSetupCtx, setPinSetupCtx] = useState<{ memberId: number; email: string } | null>(null);
  const isNavigatingToSendRef = useRef(false);
  const [transactionDetailsModalVisible, setTransactionDetailsModalVisible] = useState(false);
  const [selectedTransactionDetailsForModal, setSelectedTransactionDetailsForModal] = useState<TransactionDetails | null>(null);

  const [cachedTransactionData, setCachedTransactionData] = useState<TransactionListItemData[] | null>(null);
  const [cacheKey, setCacheKey] = useState<string>('');

  useEffect(() => {
    if (!selectedWalletAsset) {
      goBack();
      return;
    }

    const loadMember = async () => {
      try {
        const userDataStr = await AsyncStorage.getItem('userData');
        if (userDataStr) {
          const userData = JSON.parse(userDataStr);
          setMember(userData.member || null);
        }
      } catch (error) {
        console.error('[WalletDetail] member 로드 오류:', error);
      }
    };

    loadMember();

    if (selectedWalletAsset.originalData?.address) {
      setPublicAddress(selectedWalletAsset.originalData.address);
    }

    setCachedTransactionData(null);
    setCacheKey('');

    const loadGopaxPrice = async () => {

      if (selectedWalletAsset.currency !== 18 && selectedWalletAsset.currency !== 19) {
        setGopaxPrice(null);
        return;
      }

      try {
        const result = await getXRUNGopaxPrice();
        const price = result?.data?.gopaxPrice || null;
        if (price) {
          setGopaxPrice(price);
          await AsyncStorage.setItem('xrungopaxprice', JSON.stringify(result));
          console.log('[WalletDetail] 고팍스 XRUN 가격 로드:', price);
        }
      } catch (error) {
        console.error('[WalletDetail] 고팍스 XRUN 가격 API 오류, fallback:', error);
        try {
          const priceDataStr = await AsyncStorage.getItem('xrungopaxprice');
          if (priceDataStr) {
            const priceData = JSON.parse(priceDataStr);
            setGopaxPrice(priceData?.data?.gopaxPrice || null);
          }
        } catch {}
      }
    };

    loadGopaxPrice();

    return () => {
      if (!isNavigatingToSendRef.current) {
        resetSelectedWalletAsset();
      }
      isNavigatingToSendRef.current = false;
    };
  }, [selectedWalletAsset, goBack, resetSelectedWalletAsset]);

  const handleFilterApply = useCallback(
    (selection: { type: 'all' | 'send' | 'receive' }) => {
      setSelectedType(selection.type);

      setCachedTransactionData(null);
      setCacheKey('');
    },
    [],
  );

  const createFetchFunction = useCallback(() => {
    return async (params: PaginationParams): Promise<PaginationResponse<TransactionListItemData>> => {
      if (!member || !selectedWalletAsset || !publicAddress) {
        return { data: [], total: 0, hasMore: false };
      }

      if (![1, 2, 16, 18].includes(selectedWalletAsset.currency)) {
        console.warn('[WalletDetail] 지원하지 않는 currency:', selectedWalletAsset.currency);
        return { data: [], total: 0, hasMore: false };
      }

      const currentCacheKey = `${member}-${selectedWalletAsset.currency}-${selectedType}`;

      if (params.page === 1 && cachedTransactionData && cacheKey === currentCacheKey) {
        console.log('[WalletDetail] 캐시된 데이터 사용:', {
          cacheKey,
          currentCacheKey,
          cachedDataLength: cachedTransactionData.length,
        });

        const startIndex = (params.page - 1) * params.pageSize;
        const endIndex = startIndex + params.pageSize;
        const paginatedData = cachedTransactionData.slice(startIndex, endIndex);
        const hasMore = endIndex < cachedTransactionData.length;

        return {
          data: paginatedData,
          total: cachedTransactionData.length,
          hasMore,
        };
      }

      try {
        const response = await fetchEtherscanTransactions(
          member,
          selectedWalletAsset.currency,
          params.page,
          params.pageSize,
        ) as EtherscanTransactionsResponse;

        console.log('[WalletDetail] Etherscan raw 응답 개수:', response.data.length);
        if (response.data.length > 0) {
          console.log('[WalletDetail] 첫 row sample:', {
            contractAddress: response.data[0].contractAddress,
            tokenSymbol: response.data[0].tokenSymbol,
            from: response.data[0].from,
            to: response.data[0].to,
          });
        }

        if (!response.data || !Array.isArray(response.data)) {
          console.warn('[WalletDetail] 응답 데이터 형식이 올바르지 않습니다.');
          return { data: [], total: 0, hasMore: false };
        }

        const XRUN_POLYGON_CONTRACT = '0xda7cdea482b4e5f3d5b41aa286811d111f066b6b';
        const XRUN_ETHEREUM_CONTRACT = '0x5833dbb0749887174b254ba4a5df747ff523a905';
        const expectedContract =
          selectedWalletAsset.currency === 18
            ? XRUN_POLYGON_CONTRACT.toLowerCase()
            : selectedWalletAsset.currency === 1
              ? XRUN_ETHEREUM_CONTRACT.toLowerCase()
              : (selectedWalletAsset as any).contractAddress?.toLowerCase?.();
        const expectedSymbol = (selectedWalletAsset.symbol || '').toUpperCase();
        response.data = response.data.filter((item: any) => {
          const c = (item.contractAddress || '').toLowerCase();
          const s = (item.tokenSymbol || '').toUpperCase();
          if (expectedContract) return c === expectedContract;

          return !s || s === expectedSymbol;
        });

        const myAddressLower = publicAddress.toLowerCase();

        const userAddress = '0xc3769f23e0b94d5d36f558c8f79e81d589ea119f';
        const userAddressLower = userAddress.toLowerCase();

        const expandedData: any[] = [];
        for (const it of response.data) {
          const fromLower = (it.from || '').toLowerCase();
          const toLower = (it.to || '').toLowerCase();
          if (fromLower === myAddressLower && toLower === myAddressLower) {

            expandedData.push({ ...it, __selfSplit: 'out', __syntheticTo: it.to });
            expandedData.push({ ...it, __selfSplit: 'in', __syntheticFrom: it.from });
          } else {
            expandedData.push(it);
          }
        }

        const items: TransactionListItemData[] = expandedData.map((item) => {

          const isSelfOut = item.__selfSplit === 'out';
          const isSelfIn = item.__selfSplit === 'in';

          const isReceive = isSelfIn || (!isSelfOut && item.to.toLowerCase() === myAddressLower);
          const isSend = isSelfOut || (!isSelfIn && item.from.toLowerCase() === myAddressLower);

          const isToUserAddress = item.to.toLowerCase() === userAddressLower;
          const iconName = isToUserAddress ? 'download-outline' : 'send-outline';

          const iconColor = '#6B7280'; 

          const amountColor = '#6B7280'; 

          let actionType: string;
          if (isReceive) {
            actionType = t('screens.walletDetail.received');
          } else if (isSend) {
            actionType = t('screens.walletDetail.transfer');
          } else {
            actionType = t('screens.walletDetail.other');
          }

          const onchainCategory = (item as any).category as string | undefined;
          if (onchainCategory && onchainCategory.trim()) {
            const trimmed = onchainCategory.trim();
            if (trimmed.startsWith('cat:')) {
              const key = trimmed.slice(4);
              actionType = t(`screens.walletDetail.cat_${key}`);
            } else {
              actionType = trimmed;
            }
          }

          const amountInEth = weiToEth(item.value, item.tokenDecimal);

          if (typeof (globalThis as any).__walletDetailAmtLogged === 'undefined') {
            console.log('[WalletDetail] 첫 변환 sample:', {
              rawValue: item.value,
              tokenDecimal: item.tokenDecimal,
              amountInEth,
              from: item.from,
              to: item.to,
            });
            (globalThis as any).__walletDetailAmtLogged = true;

            setTimeout(() => { delete (globalThis as any).__walletDetailAmtLogged; }, 5000);
          }

          const formattedTimestamp = timestampToDate(item.timeStamp);

          const uniqueId = item.__selfSplit
            ? `${item.hash}-${item.__selfSplit}`
            : item.hash;
          return {
            id: uniqueId,
            transaction: item.hash,
            excuteddatetime: timestampToDate(item.timeStamp),
            date: timestampToDate(item.timeStamp),
            amount: amountInEth,
            symbol: item.tokenSymbol || selectedWalletAsset.symbol,
            action: isReceive ? 3304 : isSend ? 3305 : 0, 
            status: 9101, 
            currency: selectedWalletAsset.currency,

            title: item.tokenSymbol || selectedWalletAsset.symbol || selectedWalletAsset.name,
            subtitle: actionType,
            timestamp: formattedTimestamp,
            suffix: item.tokenSymbol || selectedWalletAsset.symbol,
            iconName: iconName,
            iconColor: iconColor,
            amountColor: amountColor,

            blockNumber: item.blockNumber,
            from: item.from,
            to: item.to,
            contractAddress: item.contractAddress,
            gasUsed: item.gasUsed,
            gas: item.gas, 
            gasPrice: item.gasPrice, 
            nonce: item.nonce,
            confirmations: item.confirmations,
            timeStamp: item.timeStamp, 
            hash: item.hash,
            tokenDecimal: item.tokenDecimal,
          } as TransactionListItemData;
        });

        items.sort((a, b) => {
          const tA = parseInt(((a as any).timeStamp ?? '0'), 10);
          const tB = parseInt(((b as any).timeStamp ?? '0'), 10);
          if (tB !== tA) return tB - tA;

          const aIsSend = a.action === 3305;
          const bIsSend = b.action === 3305;
          if (aIsSend && !bIsSend) return -1;
          if (!aIsSend && bIsSend) return 1;
          return 0;
        });

        const dateFilteredItems = items;

        const hasMore = dateFilteredItems.length >= params.pageSize;

        if (params.page === 1) {
          setCachedTransactionData(dateFilteredItems);
          setCacheKey(currentCacheKey);
          console.log('[WalletDetail] 데이터 캐시에 저장:', {
            cacheKey: currentCacheKey,
            dataLength: dateFilteredItems.length,
          });
        }

        const startIndex = (params.page - 1) * params.pageSize;
        const endIndex = startIndex + params.pageSize;
        const paginatedData = dateFilteredItems.slice(startIndex, endIndex);
        const paginatedHasMore = endIndex < dateFilteredItems.length;

        return {
          data: paginatedData,
          total: dateFilteredItems.length,
          hasMore: paginatedHasMore,
        };
      } catch (error) {
        console.error('[WalletDetail] API 호출 오류:', error);
        return { data: [], total: 0, hasMore: false };
      }
    };
  }, [member, selectedWalletAsset, publicAddress, selectedType, t, cachedTransactionData, cacheKey]);

  const createSendFetchFunction = useCallback(() => {
    return async (params: PaginationParams): Promise<PaginationResponse<TransactionListItemData>> => {
      const baseFetch = createFetchFunction();
      const result = await baseFetch(params);

      console.log('[WalletDetailScreen] result', params);

      const filteredData = result.data.filter((item) => item.action === 3305);

      const shouldLoadMore = filteredData.length < params.pageSize && result.hasMore;

      return {
        data: filteredData,
        total: filteredData.length,
        hasMore: shouldLoadMore || result.hasMore,
      };
    };
  }, [createFetchFunction]);

  const createReceiveFetchFunction = useCallback(() => {
    return async (params: PaginationParams): Promise<PaginationResponse<TransactionListItemData>> => {
      const baseFetch = createFetchFunction();
      const result = await baseFetch(params);

      const filteredData = result.data.filter((item) => item.action === 3304);

      const shouldLoadMore = filteredData.length < params.pageSize && result.hasMore;

      return {
        data: filteredData,
        total: filteredData.length,
        hasMore: shouldLoadMore || result.hasMore,
      };
    };
  }, [createFetchFunction]);

  const getFetchData = useCallback(() => {
    console.log('[WalletDetailScreen] selectedType', selectedType);
    switch (selectedType) {
      case 'all':
        return createFetchFunction();
      case 'send':
        return createSendFetchFunction();
      case 'receive':
        return createReceiveFetchFunction();
      default:
        return createFetchFunction();
    }
  }, [selectedType, createFetchFunction, createSendFetchFunction, createReceiveFetchFunction]);

  const handleAction = useCallback(
    async (type: 'scan' | 'receive' | 'send') => {
      if (type === 'send') {
        if (!selectedWalletAsset) {
          console.warn('[WalletDetail] selectedWalletAsset이 없어 보내기 화면으로 이동할 수 없습니다.');
          return;
        }

        try {
          const userDataStr = await AsyncStorage.getItem('userData');
          const userData = userDataStr ? JSON.parse(userDataStr) : null;
          const email = (userData?.email ?? '').toLowerCase().trim();
          const memberId = userData?.member != null ? Number(userData.member) : null;
          console.log('[WalletDetail] send 분기 진입', { email, memberId, inWhitelist: isLocalSendEnabledForUser(email) });
          if (isLocalSendEnabledForUser(email) && email && memberId != null) {
            const entries = await findEntriesForUser(email, memberId);
            const hasKey = (entries.eth?.s === 's1') || (entries.pol?.s === 's1');
            console.log('[WalletDetail] vault 체크', { hasKey, eth: entries.eth?.s, pol: entries.pol?.s });
            if (!hasKey) {
              const atStatus = await getWalletKeyATStatus().catch(() => ({ at: false, at_at: null, ok: false }));
              console.log('[WalletDetail] AT 상태', atStatus);

              const shouldShowRestore = atStatus.at || !atStatus.ok;
              if (shouldShowRestore) {

                const choice = await showAlert(
                  t('screens.walletRestore.restoreNeededTitle'),
                  t('screens.walletRestore.restoreNeededMessage'),
                  [
                    { text: t('screens.walletRestore.restoreLater') },
                    { text: t('screens.walletRestore.restoreNow') },
                  ],
                );
                if (choice === 1) navigate(ROUTES.walletRestore);
              } else {

                setPinSetupCtx({ memberId, email });
                setPinSetupVisible(true);
              }
              return;
            }
          }
        } catch (e: any) {
          console.warn('[WalletDetail] vault/AT check failed:', e?.message);

        }
        isNavigatingToSendRef.current = true;
        setSelectedWalletAsset(selectedWalletAsset);
        navigate(ROUTES.walletSend);
        return;
      }
      if (type === 'receive') {
        if (publicAddress) {
          setWalletReceiveAddress(publicAddress);
        }
        if (selectedWalletAsset?.currency) {
          console.log(
            '[WalletDetailScreen] receive 버튼 클릭 - currency:',
            selectedWalletAsset.currency,
          );
          setWalletReceiveCurrency(selectedWalletAsset.currency);
        }
        navigate(ROUTES.walletReceive);
        return;
      }
      if (type === 'scan') {
        const explorerLink = getExplorerLink(
          selectedWalletAsset?.currency || 0,
          publicAddress,
        );
        if (explorerLink) {
          Linking.openURL(explorerLink);
        }
        return;
      }
    },
    [
      navigate,
      selectedWalletAsset,
      publicAddress,
      setWalletReceiveAddress,
      setWalletReceiveCurrency,
      setSelectedWalletAsset,
      showAlert,
    ],
  );

  const handleCopyAddress = useCallback(() => {
    if (publicAddress) {
      copyToClipboard(publicAddress, showAlert);
    }
  }, [publicAddress, showAlert]);

  const handleDownload = useCallback(async () => {

    const confirmed = await showAlert(
      t('screens.walletPrivateKeyDisplay.confirmDownloadTitle'),
      t('screens.walletPrivateKeyDisplay.confirmDownloadMessage'),
      [
        { text: t('common.cancel') },
        { text: t('common.confirm') },
      ],
    );

    if (confirmed === 1) {
      navigate(ROUTES.walletPrivateKeyGoogleAuth);
    }
  }, [t, showAlert, navigate]);

  const formattedBalance = useMemo(() => {

    if (!selectedWalletAsset?.amount) return '0';
    const amount = selectedWalletAsset?.amount;
    console.log('[WalletDetailScreen] amount', amount);
    return `${amount} ${selectedWalletAsset.symbol || ''}`;
  }, [selectedWalletAsset]);

  const krwValue = useMemo(() => {

    if (!selectedWalletAsset || (selectedWalletAsset.currency !== 18 && selectedWalletAsset.currency !== 19)) {
      return null;
    }

    if (!gopaxPrice) {
      return t('screens.walletDetail.priceUpdating');
    }

    try {

      const balanceAmount = new BigNumber(selectedWalletAsset.amount || '0');
      const krwAmount = balanceAmount.multipliedBy(gopaxPrice);

      const formatted = krwAmount.toFixed(0);
      const parts = formatted.split('.');
      const integerPart = parts[0];
      const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

      return `KRW ${formattedInteger}`;
    } catch (error) {
      console.error('[WalletDetail] KRW 금액 계산 오류:', error);
      return t('screens.walletDetail.priceUpdating');
    }
  }, [selectedWalletAsset, gopaxPrice, t]);

  const shortenedAddress = useMemo(() => {
    return publicAddress || '';
  }, [publicAddress]);

  const explorerLabel = useMemo(() => {
    const currency = selectedWalletAsset?.currency || 0;
    if (currency === 1 || currency === 2) {
      return 'Etherscan';
    }
    if (currency === 16 || currency === 18) {
      return 'PolygonScan';
    }
    return 'Explorer';
  }, [selectedWalletAsset]);

  if (!selectedWalletAsset) {
    return null;
  }

  return (
    <SafeView style={styles.container}>
      <Header
        title={selectedWalletAsset.name || selectedWalletAsset.symbol}
        showBackButton
        onBackPress={() => navigate(ROUTES.wallet)} 
      />

      <View style={styles.content}>
        <WalletHeaderCard
          title={t('screens.walletDetail.myBalance')}
          mainValue={formattedBalance}
          subValue={krwValue || ''}
          address={shortenedAddress}
          onCopy={handleCopyAddress}

          onDownload={undefined}
          actions={[
            {
              label: explorerLabel,
              iconImage:
                selectedWalletAsset.currency === 1 || selectedWalletAsset.currency === 2
                  ? iconEtherscan
                  : iconPolygonscan,
              onPress: () => handleAction('scan'),
            },
            {
              label: t('screens.walletDetail.receive'),
              icon: 'download-outline',
              onPress: () => handleAction('receive'),
            },
            {
              label: t('screens.walletDetail.send'),
              icon: 'send-outline',
              onPress: () => handleAction('send'),
            },
          ]}
          theme={getCurrencyTheme(selectedWalletAsset.currency)}
        />

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{t('screens.walletDetail.history')}</Text>
          <TouchableOpacity onPress={() => setFilterVisible(true)} activeOpacity={0.7}>
            <Ionicons name="options-outline" size={20} color="#343434" />
          </TouchableOpacity>
        </View>

        <View style={styles.listWrapper}>
          <DataList
            fetchData={getFetchData()}
            ItemComponent={TransactionListItemWrapper}
            pageSize={20}
            keyExtractor={(item, index) => item.id?.toString() || `txn_${index}`}
            onItemPress={(item: TransactionListItemData) => {

              const itemData = item as TransactionListItemData & {
                hash?: string;
                from?: string;
                to?: string;
                nonce?: string;
                gasPrice?: string;
                gasUsed?: string;
                gas?: string;
                blockNumber?: string;
                excuteddatetime?: string;
                transaction?: string;
              };

              const details: TransactionDetails = {
                id: itemData.id?.toString() || itemData.hash || '',
                title: itemData.title || selectedWalletAsset?.symbol || '',
                subtitle: itemData.subtitle || '',
                timestamp: itemData.timestamp || itemData.excuteddatetime || '',
                from: itemData.from || '',
                to: itemData.to || '',
                txHash: itemData.hash || itemData.transaction || '',
                amount: itemData.amount || undefined, 
                symbol: itemData.symbol || selectedWalletAsset?.symbol || undefined, 
                nonce: itemData.nonce || undefined,
                gasPrice: itemData.gasPrice
                  ? weiToGwei(itemData.gasPrice)
                  : undefined,
                usedGas: itemData.gasUsed || undefined,
                maxGas: itemData.gas || undefined,
                totalSpent: calculateTotalSpent(
                  itemData.gasUsed,
                  itemData.gasPrice,
                  selectedWalletAsset?.currency || 0
                ),
                blockHeight: itemData.blockNumber || undefined,
                fromWalletList: true, 
              };

              console.log('[WalletDetailScreen] 모달에 표시할 데이터:', JSON.stringify(details, null, 2));
              setSelectedTransactionDetailsForModal(details);
              setTransactionDetailsModalVisible(true);
            }}
            emptyMessage={t('screens.walletDetail.noHistory')}
          />
        </View>
      </View>

      <WalletFilterDialog
        visible={filterVisible}
        onClose={() => setFilterVisible(false)}
        onApply={handleFilterApply}
        defaultType={selectedType}
      />

      <Modal
        visible={transactionDetailsModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => {
          setTransactionDetailsModalVisible(false);
          setSelectedTransactionDetailsForModal(null);
        }}
      >
        {selectedTransactionDetailsForModal && (
          <TransactionDetailsScreen
            data={selectedTransactionDetailsForModal}
            onClose={() => {
              setTransactionDetailsModalVisible(false);
              setSelectedTransactionDetailsForModal(null);
            }}
          />
        )}
      </Modal>

      {}
      {pinSetupCtx != null && pinSetupVisible && (
        <WalletKeyPinSetupModal
          memberId={pinSetupCtx.memberId}
          email={pinSetupCtx.email}
          visible={pinSetupVisible}
          onSuccess={() => {
            setPinSetupVisible(false);
            setPinSetupCtx(null);

            if (selectedWalletAsset) {
              isNavigatingToSendRef.current = true;
              setSelectedWalletAsset(selectedWalletAsset);
              navigate(ROUTES.walletSend);
            }
          }}
        />
      )}
    </SafeView>
  );
};

const styles = StyleSheet.create({
  container: {
    ...COMMON_STYLES.container,
  },
  content: {
    ...COMMON_STYLES.scrollContent,
    flexGrow: 1,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    maxWidth: 780,
    alignSelf: 'center',
    marginBottom: 16,
    paddingRight: 15,
  },
  sectionTitle: {
    fontSize: FONTS.size.medium,
    fontFamily: 'Roboto-Medium',
    color: '#121212',
    paddingLeft: 15,
  },
  listWrapper: {
    flex: 1,
    width: '100%',
    maxWidth: 780,
    alignSelf: 'center',
  },
});
