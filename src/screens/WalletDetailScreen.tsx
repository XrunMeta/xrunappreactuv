import React, { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, Linking } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BigNumber from 'bignumber.js';
import { Header, WalletHeaderCard, WalletFilterDialog, DataList, TransactionListItem, SafeView } from '../components';
import { COMMON_STYLES, FONTS } from '../constants';
import { ROUTES, useAppNavigation } from '../navigation';
import { useAppContext } from '../context';
import {
  fetchTotalHistory,
  fetchTransferHistory,
  fetchReceivedDetails,
  fetchTransitionHistory,
} from '../services';
import { TransactionHistoryItem, TransactionHistoryResponse } from '../types';
import { PaginationParams, PaginationResponse } from '../types/pagination';
import { useAlertDialog } from '../context/AlertDialogContext';
import { copyToClipboard } from '../utils';

const iconEtherscan = require('../../assets/icon_etherscan.png');
const iconPolygonscan = require('../../assets/icon_polyganscan.png');
const iconSend = require('../../assets/icon-send.png');
const iconReceive = require('../../assets/icon-receive.png');

const dateFormatter = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}.${month}.${day} ${hours}:${minutes}`;
  } catch {
    return dateString;
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
}

export const WalletDetailScreen = () => {
  const { t } = useTranslation();
  const { navigate, goBack } = useAppNavigation();
  const {
    selectedWalletAsset,
    resetSelectedWalletAsset,
    setSelectedWalletAsset,
    setWalletReceiveAddress,
    setWalletReceiveCurrency,
  } = useAppContext();
  const { showAlert } = useAlertDialog();

  const [filterVisible, setFilterVisible] = useState(false);
  const [selectedType, setSelectedType] = useState<'all' | 'send' | 'receive'>('all');
  const [selectedRange, setSelectedRange] = useState<'7d' | '14d' | '30d'>('7d');
  const [member, setMember] = useState<number | null>(null);
  const [publicAddress, setPublicAddress] = useState<string>('');
  const [gopaxPrice, setGopaxPrice] = useState<number | null>(null);
  const isNavigatingToSendRef = useRef(false);

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

    const loadGopaxPrice = async () => {

      if (selectedWalletAsset.currency !== 18 && selectedWalletAsset.currency !== 19) {
        setGopaxPrice(null);
        return;
      }

      try {
        const priceDataStr = await AsyncStorage.getItem('xrungopaxprice');
        if (priceDataStr) {
          const priceData = JSON.parse(priceDataStr);
          const price = priceData?.data?.gopaxPrice || null;
          setGopaxPrice(price);
          console.log('[WalletDetail] 고팍스 XRUN 가격 로드:', price);
        }
      } catch (error) {
        console.error('[WalletDetail] 고팍스 XRUN 가격 로드 오류:', error);
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
    (selection: { type: 'all' | 'send' | 'receive'; range: '7d' | '14d' | '30d' }) => {
      setSelectedType(selection.type);
      setSelectedRange(selection.range);
    },
    [],
  );

  const getDaysBefore = useCallback((range: '7d' | '14d' | '30d'): number => {
    switch (range) {
      case '7d':
        return 7;
      case '14d':
        return 14;
      case '30d':
        return 30;
      default:
        return 7;
    }
  }, []);

  const createFetchFunction = useCallback(
    (
      apiFunction: (
        member: number | string,
        currency: number,
        daysbefore: number,
        startwith: number,
        navigation?: any,
      ) => Promise<TransactionHistoryResponse>,
    ) => {
      return async (params: PaginationParams): Promise<PaginationResponse<TransactionListItemData>> => {
        if (!member || !selectedWalletAsset) {
          return { data: [], total: 0, hasMore: false };
        }

        const daysbefore = getDaysBefore(selectedRange);
        const startwith = (params.page - 1) * params.pageSize;

        try {
          const response = await apiFunction(
            member,
            selectedWalletAsset.currency,
            daysbefore,
            startwith,
          );

          const items = (response.data || []).map((item) => {
            const formattedAmount = new BigNumber(item.amount || '0').toFixed();
            const actionType = getActionType(item.action || 0, t);
            const timestamp = dateFormatter(item.excuteddatetime || item.date || '');

            return {
              ...item,
              title: selectedWalletAsset.symbol || selectedWalletAsset.name,
              subtitle: actionType,
              timestamp,
              amount: formattedAmount,
              suffix: selectedWalletAsset.symbol,
              iconSource: selectedWalletAsset.icon,
            } as TransactionListItemData;
          });

          const hasMore = items.length >= params.pageSize;

          return {
            data: items,
            total: items.length,
            hasMore,
          };
        } catch (error) {
          console.error('[WalletDetail] API 호출 오류:', error);
          return { data: [], total: 0, hasMore: false };
        }
      };
    },
    [member, selectedWalletAsset, selectedRange, getDaysBefore, t],
  );

  const createSendFetchFunction = useCallback(() => {
    return async (
      params: PaginationParams,
    ): Promise<PaginationResponse<TransactionListItemData>> => {
      if (!member || !selectedWalletAsset) {
        return { data: [], total: 0, hasMore: false };
      }

      const daysbefore = getDaysBefore(selectedRange);
      const startwith = (params.page - 1) * params.pageSize;

      try {
        const [transferResponse, transitionResponse] = await Promise.all([
          fetchTransferHistory(member, selectedWalletAsset.currency, daysbefore, startwith),
          fetchTransitionHistory(member, selectedWalletAsset.currency, daysbefore, startwith),
        ]);

        const allItems = [...(transferResponse.data || []), ...(transitionResponse.data || [])];

        allItems.sort((a, b) => {
          const dateA = new Date(a.excuteddatetime || a.date || '').getTime();
          const dateB = new Date(b.excuteddatetime || b.date || '').getTime();
          return dateB - dateA;
        });

        const startIndex = (params.page - 1) * params.pageSize;
        const endIndex = startIndex + params.pageSize;
        const paginatedItems = allItems.slice(startIndex, endIndex);

        const items = paginatedItems.map((item) => {
          const formattedAmount = new BigNumber(item.amount || '0').toFixed();
          const actionType = getActionType(item.action || 0, t);
          const timestamp = dateFormatter(item.excuteddatetime || item.date || '');

          return {
            ...item,
            title: selectedWalletAsset.symbol || selectedWalletAsset.name,
            subtitle: actionType,
            timestamp,
            amount: formattedAmount,
            suffix: selectedWalletAsset.symbol,
            iconSource: selectedWalletAsset.icon,
          } as TransactionListItemData;
        });

        const hasMore = allItems.length > endIndex;

        return {
          data: items,
          total: allItems.length,
          hasMore,
        };
      } catch (error) {
        console.error('[WalletDetail] Send API 호출 오류:', error);
        return { data: [], total: 0, hasMore: false };
      }
    };
  }, [member, selectedWalletAsset, selectedRange, getDaysBefore, t]);

  const getFetchData = useCallback(() => {
    switch (selectedType) {
      case 'all':
        return createFetchFunction(fetchTotalHistory);
      case 'send':
        return createSendFetchFunction();
      case 'receive':
        return createFetchFunction(fetchReceivedDetails);
      default:
        return createFetchFunction(fetchTotalHistory);
    }
  }, [selectedType, createFetchFunction, createSendFetchFunction]);

  const handleAction = useCallback(
    (type: 'scan' | 'receive' | 'send') => {
      if (type === 'send') {
        if (selectedWalletAsset) {
          isNavigatingToSendRef.current = true;
          setSelectedWalletAsset(selectedWalletAsset);
          navigate(ROUTES.walletSend);
        } else {
          console.warn('[WalletDetail] selectedWalletAsset이 없어 보내기 화면으로 이동할 수 없습니다.');
        }
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
    ],
  );

  const handleCopyAddress = useCallback(() => {
    if (publicAddress) {
      copyToClipboard(publicAddress, showAlert);
    }
  }, [publicAddress, showAlert]);

  const formattedBalance = useMemo(() => {
    if (!selectedWalletAsset) return '0';
    const amount = new BigNumber(selectedWalletAsset.amount || '0').toFixed();
    return `${amount} ${selectedWalletAsset.symbol || ''}`;
  }, [selectedWalletAsset]);

  const krwValue = useMemo(() => {

    if (!selectedWalletAsset || (selectedWalletAsset.currency !== 18 && selectedWalletAsset.currency !== 19) || !gopaxPrice) {
      return null;
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
      return null;
    }
  }, [selectedWalletAsset, gopaxPrice]);

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
            ItemComponent={TransactionListItem}
            pageSize={20}
            keyExtractor={(item, index) => item.id?.toString() || `txn_${index}`}
            onItemPress={(item) => {
              navigate(ROUTES.transactionDetails);
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
        defaultRange={selectedRange}
      />
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
  },
  sectionTitle: {
    fontSize: FONTS.size.medium,
    fontFamily: 'Roboto-Medium',
    color: '#121212',
  },
  listWrapper: {
    flex: 1,
    width: '100%',
    maxWidth: 780,
    alignSelf: 'center',
  },
});
