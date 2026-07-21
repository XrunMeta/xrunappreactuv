import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { StatusBar } from 'expo-status-bar';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Alert,
  Dimensions,
  Image,
  Linking,
  Modal,
  AppState,
} from 'react-native';
import type { AppStateStatus } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BigNumber from 'bignumber.js';
import { Header, WalletHeaderCard, DataList, AddTokenModal, SafeView, WalletKeyPinPromptModal } from '../components';
import {
  jwtPayloadSub,
  findEntriesForUser,
  isUserStillUnlocked,
  markUserUnlocked,
} from '../services/walletKeyStore';
import { COLORS, COMMON_STYLES, LIST_STYLES, FONTS, SIZES } from '../constants';
import { ROUTES, useAppNavigation } from '../navigation';
import { useAppContext } from '../context';
import { copyToClipboard, loadCustomTokens, saveCustomTokens } from '../utils';
import { fmtBalance } from '../utils/formatAmount';
import { useAlertDialog } from '../context/AlertDialogContext';
import {
  fetchWalletData,
  fetchOtherChainsStatus,
  fetchADXRUNTopBanners,
  fetchTokenBalance,
  checkERC20Token,
  getUsersBalanceUpdateV2,
  getReferralIncome,
  getApiBaseUrl,
  getAuthHeader,
} from '../services';
import {
  WalletData,
  CombinedAsset,
  CustomToken,
} from '../types';
import { PaginationParams, PaginationResponse } from '../types/pagination';
import { TaboolaBanner } from '../components/TaboolaBanner';
import { LoadingText } from '../components/AnimatedDots';
import { getTokenIcon } from '../constants/tokenMeta';

const iconEtherscan = require('../../assets/icon_etherscan.png');

const iconPolygonscan = require('../../assets/icon_polyganscan_color.png');
const iconSend = require('../../assets/icon-send.png');
const iconReceive = require('../../assets/icon-receive.png');

const screenWidth = Dimensions.get('window').width;

let front = 6;
let back = 4;

if (screenWidth < 350) {
  front = 6;
  back = 4;
} else if (screenWidth < 400) {
  front = 10;
  back = 8;
} else if (screenWidth < 500) {
  front = 14;
  back = 12;
} else {
  front = 16;
  back = 14;
}

const shortenAddress = (address: string, frontChars: number, backChars: number): string => {
  if (!address || address.length < frontChars + backChars + 3) {
    return address || '-';
  }
  return `${address.substring(0, frontChars)}...${address.substring(
    address.length - backChars,
  )}`;
};

const WALLET_LIST_DARK_DISKS = new Set(['#000000', '#111111', '#25292C', '#8347E6']);

function getWalletListDiskBackground(asset: CombinedAsset): string {
  const sym = (asset.symbol || '').toUpperCase();
  const sub = (asset.subCurrencyName || asset.name || '').toLowerCase();
  if (sym === 'XRUN' && sub.includes('ethereum')) {
    return '#FFFFFF';
  }
  switch (asset.currency) {
    case 1:
      return '#000000';
    case 2:
      return '#EFF4F5';
    case 11:
      return '#EFF4F5';
    case 16:
      return '#8347E6';
    case 18:
      return '#111111';
    case 19:
      return '#25292C';
    case 1900:

      return '#000000';
    default:
      return '#EFF4F5';
  }
}

function resolveWalletListIconSource(asset: CombinedAsset): any | null {
  const sym = (asset.symbol || '').toUpperCase();
  const sub = (asset.subCurrencyName || asset.name || '').toLowerCase();

  if (asset.currency === 1900 || asset.currency === 19) {
    return null;
  }
  if (sym === 'ETH' || asset.currency === 2) {
    if (typeof asset.icon === 'string' && /^https?:\/\//.test(asset.icon.trim())) {
      return { uri: asset.icon.trim() };
    }
    return require('../../assets/images/ethereum_thumb.png');
  }
  if (sym === 'POL' || asset.currency === 16) {
    return getTokenIcon('POL');
  }
  if (sym === 'XRUN') {
    if (sub.includes('ethereum')) {
      return getTokenIcon('XRUN', 'Ethereum');
    }
    return require('../../assets/xrun-round-logo.png');
  }

  if (typeof asset.icon === 'string' && /^https?:\/\//.test(asset.icon.trim())) {
    return { uri: asset.icon.trim() };
  }
  return null;
}

interface TokenListItemData extends CombinedAsset {
  title: string;
  subtitle: string;
  amount: string;
  suffix?: string;
  iconSource?: any;
  fallbackLabel?: string;
  fallbackColors?: {
    background: string;
    text: string;
  };

  listIndex?: number;
}

export const WalletScreen = () => {
  const { t } = useTranslation();
  const { goBack, navigate } = useAppNavigation();
  const { openAddTokenDialog, setWalletReceiveAddress, setWalletReceiveCurrency, setSelectedWalletAsset } = useAppContext();
  const { showAlert } = useAlertDialog();

  const [isLoading, setIsLoading] = useState(true);
  const [publicAddress, setPublicAddress] = useState('');
  const [cardsData, setCardsData] = useState<WalletData[]>([]);
  const [customTokens, setCustomTokens] = useState<CustomToken[]>([]);
  const [combinedAssets, setCombinedAssets] = useState<CombinedAsset[]>([]);
  const [adXrunAmount, setAdXrunAmount] = useState<number>(0);

  const [referralAmount, setReferralAmount] = useState<number>(0);
  const [statusOtherChain, setStatusOtherChain] = useState<string>('off');
  const [member, setMember] = useState<number | null>(null);
  const [userData, setUserData] = useState<any>(null);

  const [modalVisible, setModalVisible] = useState(false);
  const [activeTab, setActiveTab] = useState<'Token' | 'Contract' | 'Confirm'>('Token');
  const [contractAddress, setContractAddress] = useState('');
  const [tokenName, setTokenName] = useState('');
  const [tokenSymbol, setTokenSymbol] = useState('');
  const [tokenDecimals, setTokenDecimals] = useState('');
  const [selectedToken, setSelectedToken] = useState<{
    symbol: string;
    currency: number;
    subcurrency: number;
    name: string;
    icon: any;
  } | null>(null);
  const [isAddingToken, setIsAddingToken] = useState(false);

  const [pinPromptVisible, setPinPromptVisible] = useState(false);
  const [pinPromptProps, setPinPromptProps] = useState<{ memberId: number; email: string } | null>(null);

  const [walletInfoVisible, setWalletInfoVisible] = useState(false);

  const [walletsUnlocked, setWalletsUnlocked] = useState(false);

  useEffect(() => {

    setWalletsUnlocked(true);

  }, []);

  const onPinPromptSuccess = (_wallets: any[], _pin?: string) => {

    if (pinPromptProps) {
      markUserUnlocked(pinPromptProps.email, pinPromptProps.memberId);
    }
    setPinPromptVisible(false);
    setWalletsUnlocked(true);
  };

  const onPinPromptCancel = () => {

    setPinPromptVisible(false);
    goBack();
  };

  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    const getMember = async () => {
      try {
        const resUserData = await AsyncStorage.getItem('userData');
        if (!resUserData) {
          console.log('No userData found in AsyncStorage');
          return;
        }

        const parsedUserData = JSON.parse(resUserData);
        const memberData = parsedUserData.member;
        setMember(memberData);
        setUserData(parsedUserData);

        const existingTokens = await loadCustomTokens(memberData, parsedUserData?.email || '');
        setCustomTokens(existingTokens);
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          console.log(`Failed to get member from async storage: ${err}`);

          navigate(ROUTES.login);
        }
      }
    };

    getMember();

    return () => {
      abortController.abort();
    };
  }, [navigate]);

  const combineTokenData = useCallback(
    (walletData: WalletData[], customTokens: CustomToken[], adXrunAmount: number, referralAmount: number): CombinedAsset[] => {

      const walletAssets: CombinedAsset[] = walletData
        .map((item) => ({
          id: item.currency,
          symbol: item.symbol,
          name: item.currencyname,
          subCurrencyName: item.subCurrencyName,
          amount: fmtBalance(item.Wamount || item.amount || '0'),
          icon: item.file || '',
          currency: item.currency,
          isCustom: false,
          contractAddress: item.address,
          subcurrency: item.subcurrency,
          originalData: item,
        }));

      const primaryPolygonAddr =
        walletAssets.find((w) => Number(w.currency) === 1)?.contractAddress?.trim() || '';
      if (primaryPolygonAddr) {
        walletAssets.forEach((a) => {
          if (![16, 18].includes(Number(a.currency))) return;
          const cur = (a.contractAddress || '').trim();
          if (cur) return;
          a.contractAddress = primaryPolygonAddr;
          if (a.originalData && typeof a.originalData === 'object') {
            a.originalData = { ...a.originalData, address: primaryPolygonAddr };
          }
        });
      }

      const customAssets: CombinedAsset[] = customTokens
        .map((token) => {
          const matchingWalletData = walletData.find(
            (wallet) => wallet.currency === token.currency,
          );

          return {
            id: token.currency,
            symbol: token.symbol,
            name: token.name,
            amount: fmtBalance(token.amount || '0'),
            icon: matchingWalletData
              ? `data:image/png;base64,${matchingWalletData.symbolimg?.replace(/(\r\n|\n|\r)/gm, '') || ''}`
              : 'https://via.placeholder.com/24',
            currency: token.currency,
            subCurrencyName: token.subCurrencyName,
            isCustom: true,
            contractAddress: token.contractAddress,
            decimals: token.decimals,
            subcurrency: matchingWalletData?.subcurrency,
            originalData: token,
          };
        });

      const allAssets = [...walletAssets, ...customAssets];

      const adXrunItem: CombinedAsset = {
        id: 19,
        symbol: 'XRUN',
        name: 'AD XRUN',
        amount: fmtBalance(adXrunAmount || 0),
        icon: require('../../assets/ad-round-logo.png'),
        currency: 19,
        isCustom: false,
        subCurrencyName: 'AD XRUN',
        contractAddress: '',
        subcurrency: undefined,
        originalData: undefined,
      };
      allAssets.push(adXrunItem);

      const rfItem: CombinedAsset = {
        id: 1900,
        symbol: 'XRUN',
        name: 'REFERAL XRUN',
        amount: fmtBalance(referralAmount || 0),
        icon: '__RF__' as any,
        currency: 1900,
        isCustom: false,
        subCurrencyName: 'REFERAL XRUN',
        contractAddress: '',
        subcurrency: undefined,
        originalData: undefined,
      };
      allAssets.push(rfItem);

      const uniqueAssets = allAssets.reduce((acc: CombinedAsset[], current: CombinedAsset) => {
        const existingIndex = acc.findIndex((item) => {

          if (!current.isCustom && !item.isCustom) {
            return item.currency === current.currency;
          }

          if (current.isCustom && item.isCustom) {
            return (
              item.contractAddress?.toLowerCase() === current.contractAddress?.toLowerCase()
            );
          }

          return (
            item.currency === current.currency ||
            (item.contractAddress?.toLowerCase() === current.contractAddress?.toLowerCase() &&
              current.contractAddress &&
              item.contractAddress)
          );
        });

        if (existingIndex === -1) {
          return [...acc, current];
        } else {

          if (!current.isCustom && acc[existingIndex].isCustom) {
            acc[existingIndex] = current;
          }
          return acc;
        }
      }, []);

      const sortedAssets = uniqueAssets.sort((a, b) => {
        const priorityOrder = [18, 16, 19, 1900, 1, 2]; 

        const aPriority = priorityOrder.indexOf(a.currency);
        const bPriority = priorityOrder.indexOf(b.currency);

        if (aPriority !== -1 && bPriority !== -1) {
          return aPriority - bPriority;
        }

        if (aPriority !== -1) return -1;

        if (bPriority !== -1) return 1;

        return a.symbol.localeCompare(b.symbol);
      });

      return sortedAssets;
    },
    [],
  );

  useEffect(() => {
    if (cardsData.length > 0 || customTokens.length > 0) {
      const combined = combineTokenData(cardsData, customTokens, adXrunAmount, referralAmount);
      setCombinedAssets(combined);
    }
  }, [cardsData, customTokens, adXrunAmount, referralAmount, combineTokenData]);

  const pushAutoNavConsumed = useRef(false);
  useEffect(() => {
    if (pushAutoNavConsumed.current) return;
    if (combinedAssets.length === 0) return;
    (async () => {
      try {
        const flag = await AsyncStorage.getItem('pendingPushWalletNav');
        if (flag !== 'xrun_pol') return;
        pushAutoNavConsumed.current = true;
        await AsyncStorage.removeItem('pendingPushWalletNav');
        const target = combinedAssets.find((a) => Number(a.currency) === 18);
        if (target) {
          setSelectedWalletAsset(target);
          navigate(ROUTES.walletDetail);
        }
      } catch (e) {
        if (__DEV__) console.warn('[WalletScreen] push auto nav fail:', e);
      }
    })();
  }, [combinedAssets, navigate, setSelectedWalletAsset]);

  const [refreshing, setRefreshing] = useState(false);
  const refreshAllRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    if (!member) return;

    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    getUsersBalanceUpdateV2(String(member), navigate).catch((error) => {
      console.error('[지갑] 잔액 업데이트 V2 호출 실패:', error);
    });

    const fetchWalletDataAsync = async () => {
      try {

        console.log('[WalletScreen] fetchWalletData 호출 시작, member:', member);
        const walletResponse = await fetchWalletData(member, 7, navigate);

        console.log('[WalletScreen] walletResponse:', JSON.stringify({
          hasData: !!walletResponse?.data,
          dataLength: walletResponse?.data?.length,
          status: walletResponse?.status,
          code: walletResponse?.code,
        }));

        if (walletResponse && walletResponse.data) {

          console.log('[WalletScreen] 원본 데이터:', walletResponse.data.map((item: any) => ({
            currency: item.currency,
            subcurrency: item.subcurrency,
            address: item.address ? item.address.substring(0, 10) + '...' : 'NONE',
            symbol: item.symbol,
          })));

          console.log('[WalletScreen] statusOtherChain:', statusOtherChain);
          const filteredData = walletResponse.data.filter((item) => {
            if (statusOtherChain === 'on') {
              return true; 
            } else {

              return (
                item.currency === 1 ||
                item.subcurrency === 5000 ||
                item.subcurrency === 5100 ||
                item.subcurrency === 5200 ||
                item.currency === 2
              );
            }
          });

          console.log('[WalletScreen] 필터 후 데이터:', filteredData.map((item: any) => ({
            currency: item.currency,
            subcurrency: item.subcurrency,
            address: item.address ? item.address.substring(0, 10) + '...' : 'NONE',
            symbol: item.symbol,
          })));

          const sortedData = filteredData.sort((a, b) => {
            if (a.currency === 1) return -1; 
            if (b.currency === 1) return 1;
            if (a.currency === 2) return -1; 
            if (b.currency === 2) return 1;
            if (a.currency === 3) return -1; 
            if (b.currency === 3) return 1;
            if (a.currency === 16) return -1; 
            if (b.currency === 16) return 1;
            return 0;
          });

          setCardsData(sortedData);
          setIsLoading(false);

          (async () => {
            try {
              const baseUrl = getApiBaseUrl();
              const headers: Record<string, string> = {
                'Content-Type': 'application/json',
                Authorization: await getAuthHeader(),
              };
              const rpcRes = await fetch(`${baseUrl}/getWalletRpcBalances`, {
                method: 'POST',
                headers,
                body: JSON.stringify({ member }),
              });
              if (!rpcRes.ok) return;
              const rpcJson: any = await rpcRes.json().catch(() => null);
              const balances: Array<{ currency: number; rpcAmount: string | null; status: string }> = rpcJson?.data ?? [];
              const rpcByCurrency = new Map<number, string>();
              for (const b of balances) {
                if (b.status === 'ok' && b.rpcAmount != null) {
                  rpcByCurrency.set(Number(b.currency), b.rpcAmount);
                }
              }
              if (rpcByCurrency.size === 0) return;
              setCardsData((prev) => prev.map((item: any) => {
                const cur = Number(item.currency);
                if (!rpcByCurrency.has(cur)) return item;
                const rpcAmt = rpcByCurrency.get(cur)!;
                if (String(item.amount) === rpcAmt) return item;
                return { ...item, Wamount: rpcAmt, amount: rpcAmt };
              }));
            } catch (e: any) {
              console.warn('[WalletScreen] RPC 잔액 백그라운드 갱신 실패:', e?.message);
            }
          })();

          const xrunWallet = sortedData.find((item) => Number(item.currency) === 18)
            ?? sortedData.find((item) => Number(item.currency) === 1); 
          console.log('[WalletScreen] xrunWallet 찾기:', xrunWallet ? {
            currency: xrunWallet.currency,
            address: xrunWallet.address,
            subcurrency: xrunWallet.subcurrency,
          } : 'NOT FOUND');

          if (xrunWallet) {
            setPublicAddress(xrunWallet.address);
            console.log('[WalletScreen] publicAddress 설정:', xrunWallet.address);
          } else {
            console.warn('[WalletScreen] ⚠️ currency=1 지갑을 찾을 수 없음! sortedData currencies:', sortedData.map((d: any) => d.currency));
          }
        } else {
          console.warn('[WalletScreen] ⚠️ walletResponse에 data 없음:', walletResponse);
          setIsLoading(false);
        }
      } catch (error: any) {
        if (error.name !== 'AbortError') {
          console.error('[WalletScreen] ❌ fetchWalletData 실패:', error?.message || error);
          setIsLoading(false);
        }
      }
    };

    const fetchOtherChainsStatusAsync = async () => {
      try {
        const response = await fetchOtherChainsStatus(member, navigate);

        if (response && response.data) {
          const status = response.data[0]?.status?.toLowerCase() || 'off';
          setStatusOtherChain(status);
        }
      } catch (error: any) {
        if (error.name !== 'AbortError') {
          console.error('Failed to fetch other chains status:', error);
        }
      }
    };

    const fetchADXRUNTopBannersAsync = async () => {
      try {
        const response = await fetchADXRUNTopBanners(member, navigate);

        if (response && response.data) {
          const responseData = response.data || response;

          if (responseData && responseData.transactions && responseData.transactions.length > 0) {
            const transaction = responseData.transactions[0];
            const amountValue = new BigNumber(transaction.amountasxrun || '0').toNumber();
            setAdXrunAmount(amountValue);
          }
        }
      } catch (error: any) {
        if (error.name !== 'AbortError') {
          console.error('Failed to fetch AD XRUN top banners:', error);
        }
      }
    };

    const fetchReferralIncomeAsync = async () => {
      try {
        const res = await getReferralIncome(member, navigate);
        if (res?.status === 'success' && Array.isArray(res.data)) {
          const total = res.data
            .filter((r) => r.status === 'sent')
            .reduce((s, r) => s + (Number(r.xrun_amount) || 0), 0);
          setReferralAmount(total);
        }
      } catch (e: any) {
        if (e?.name !== 'AbortError') {
          console.warn('[지갑] RF 레퍼럴 조회 실패:', e?.message);
        }
      }
    };

    const refreshAll = () => {
      if (!member) return;
      console.log('[WalletScreen] refreshAll — 4종 데이터 fetch');
      getUsersBalanceUpdateV2(String(member), navigate).catch(() => {});
      fetchWalletDataAsync();
      fetchOtherChainsStatusAsync();
      fetchADXRUNTopBannersAsync();
      fetchReferralIncomeAsync();
    };
    refreshAllRef.current = refreshAll;

    fetchWalletDataAsync();
    fetchOtherChainsStatusAsync();
    fetchADXRUNTopBannersAsync();
    fetchReferralIncomeAsync();

    let prevAppState: AppStateStatus = AppState.currentState;
    const sub = AppState.addEventListener('change', (nextAppState) => {
      const wasBackground = !!prevAppState.match(/inactive|background/);
      const isNowActive = nextAppState === 'active';
      prevAppState = nextAppState;
      if (wasBackground && isNowActive) refreshAll();
    });

    let unsub: (() => void) | null = null;
    import('../utils/walletEvents').then(({ subscribeWalletRefresh }) => {
      unsub = subscribeWalletRefresh(() => {
        if (refreshAllRef.current) refreshAllRef.current();
      });
    }).catch(() => {});

    return () => {
      abortController.abort();
      sub.remove();
      if (unsub) unsub();
    };
  }, [member, statusOtherChain, navigate]);

  const onPullRefresh = useCallback(async () => {
    if (!member || refreshing) return;
    setRefreshing(true);
    try {
      if (refreshAllRef.current) refreshAllRef.current();
    } finally {

      setTimeout(() => setRefreshing(false), 1200);
    }
  }, [member, refreshing]);

  const handleCopyAddress = () => {
    if (publicAddress) {
      copyToClipboard(publicAddress, showAlert);
    }
  };

  const handleDownload = async () => {

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
  };

  const handlePolygonscan = () => {
    if (!publicAddress) {
      Alert.alert(
        t('screens.wallet.error'),
        t('screens.wallet.addressNotLoaded'),
      );
      return;
    }
    Linking.openURL(`https://polygonscan.com/address/${publicAddress}`);
  };

  const handleEtherscan = () => {
    if (!publicAddress) {
      Alert.alert(
        t('screens.wallet.error'),
        t('screens.wallet.addressNotLoaded'),
      );
      return;
    }
    Linking.openURL(`https://etherscan.io/address/${publicAddress}`);
  };

  const handleReceive = () => {
    if (!publicAddress) {
      Alert.alert(
        t('screens.wallet.error'),
        t('screens.wallet.addressNotLoaded'),
      );
      return;
    }
    console.log('[WalletScreen] receive 버튼 클릭 - currency: 18 (XRUN Polygon)');
    setSelectedWalletAsset(null); 
    setWalletReceiveAddress(publicAddress);
    setWalletReceiveCurrency(18); 
    navigate(ROUTES.walletReceive);
  };

  const handleAddToken = () => {
    setModalVisible(true);
  };

  const resetModalState = () => {
    setActiveTab('Token');
    setContractAddress('');
    setTokenName('');
    setTokenSymbol('');
    setTokenDecimals('');
    setSelectedToken(null);
  };

  const closeModal = () => {
    setModalVisible(false);
    resetModalState();
  };

  const handleTokenSelect = useCallback(
    (token: { symbol: string; currency: number; subcurrency: number; name: string; icon: any }) => {
      setSelectedToken(token);
    },
    [],
  );

  const handleTokenNext = useCallback(() => {
    if (selectedToken) {
      setActiveTab('Contract');
    }
  }, [selectedToken]);

  const handleContractNext = useCallback(() => {
    if (contractAddress) {
      setActiveTab('Confirm');
    }
  }, [contractAddress]);

  const handleAddTokenConfirm = async () => {
    if (!member || !userData || !selectedToken || !contractAddress) {
      Alert.alert(t('screens.wallet.error'), t('screens.wallet.missingInfo'));
      return;
    }

    setIsAddingToken(true);

    try {

      const erc20Check = await checkERC20Token(contractAddress, selectedToken.currency, navigate);

      if (!erc20Check?.data?.isERC20) {
        Alert.alert(
          t('screens.addToken.invalidTokenTitle'),
          t('screens.addToken.invalidTokenDesc'),
        );
        setIsAddingToken(false);
        return;
      }

      const existingTokens = await loadCustomTokens(member, userData?.email || '');
      const tokenExists = existingTokens.some(
        (token) =>
          token.contractAddress?.toLowerCase() === contractAddress.toLowerCase(),
      );

      if (tokenExists) {
        Alert.alert(
          t('screens.addToken.existTokenTitle'),
          t('screens.addToken.existTokenDesc'),
        );
        setIsAddingToken(false);
        return;
      }

      const balanceResponse = await fetchTokenBalance(
        publicAddress,
        contractAddress,
        selectedToken.currency,
        navigate,
      );
      const balance = balanceResponse?.data?.[0]?.balance || '0';

      const newToken: CustomToken = {
        id: `custom_${contractAddress}_${Date.now()}`,
        contractAddress,
        symbol: tokenSymbol || selectedToken.symbol,
        name: tokenName || selectedToken.name,
        amount: balance,
        decimals: parseInt(tokenDecimals || '18', 10),
        icon: selectedToken.icon || 'https://via.placeholder.com/24',
        currency: selectedToken.currency,
        subcurrency: selectedToken.subcurrency,
        address: publicAddress,
      };

      const updatedTokens = [...existingTokens, newToken];
      await saveCustomTokens(member, userData?.email || '', updatedTokens);

      setCustomTokens(updatedTokens);
      closeModal();
      Alert.alert(t('screens.addToken.success'), t('screens.addToken.successMessage'));
    } catch (error: any) {
      console.error('Error adding token:', error);
      Alert.alert(t('screens.addToken.error'), t('screens.addToken.errorMessage'));
    } finally {
      setIsAddingToken(false);
    }
  };

  const convertAssetToTokenListItem = useCallback(
    (asset: CombinedAsset): TokenListItemData => {
      const diskBg = getWalletListDiskBackground(asset);
      const iconSource = resolveWalletListIconSource(asset);
      const textOnDisk = WALLET_LIST_DARK_DISKS.has(diskBg) ? '#FFFFFF' : '#343434';

      return {
        ...asset,
        title: asset.symbol,
        subtitle: asset.subCurrencyName || asset.name,
        amount: fmtBalance(asset.amount || '0'),
        suffix: asset.symbol,
        iconSource,

        fallbackLabel:
          asset.currency === 1900 ? 'RF'
          : asset.currency === 19 ? 'AD'
          : asset.symbol.slice(0, 2).toUpperCase(),
        fallbackColors: {
          background: diskBg,
          text: textOnDisk,
        },
      };
    },
    [],
  );

  const fetchTokenListData = useCallback(
    async (params: PaginationParams): Promise<PaginationResponse<TokenListItemData>> => {
      let tokenListData = combinedAssets.map((asset, index) => ({
        ...convertAssetToTokenListItem(asset),
        listIndex: index,
      }));

      const fifthAsset = combinedAssets[4];
      if (fifthAsset && tokenListData[3]) {
        const diskBg = getWalletListDiskBackground(fifthAsset);
        const textOnDisk = WALLET_LIST_DARK_DISKS.has(diskBg) ? '#FFFFFF' : '#343434';
        tokenListData = tokenListData.map((row, i) =>

          i === 3 && row.currency !== 1900
            ? {
                ...row,
                fallbackColors: {
                  ...row.fallbackColors,
                  background: diskBg,
                  text: textOnDisk,
                },
              }
            : row,
        );
      }

      return {
        data: tokenListData,
        total: tokenListData.length,
        hasMore: false, 
      };
    },
    [combinedAssets, convertAssetToTokenListItem],
  );

  const handleTokenPress = useCallback(
    (item: TokenListItemData) => {
      const currency = item.currency;

      if (currency === 19) {

        navigate(ROUTES.adHistory);
      } else if (currency === 1900) {

        navigate(ROUTES.referralMyGroup);
      } else {

        setSelectedWalletAsset(item);
        navigate(ROUTES.walletDetail);
      }
    },
    [navigate, setSelectedWalletAsset],
  );

  const TokenListItemComponent: React.FC<TokenListItemData & { onPress?: () => void }> = (props) => {
    const {
      title,
      subtitle,
      amount,
      suffix,
      iconSource,
      fallbackLabel,
      fallbackColors,
      currency,
      listIndex,
      onPress,
    } = props;

    const isTextBadge = currency === 19 || currency === 1900;
    const iconSize = isTextBadge
      ? Math.round(48 * 0.9)
      : listIndex === 1 || listIndex === 2 ? Math.round(48 * 0.5)
      : listIndex === 4 ? Math.round(48 * 0.8)
      : Math.round(48 * 0.9);
    const [imgError, setImgError] = useState(false);

    useEffect(() => {
      setImgError(false);
    }, [iconSource, currency, listIndex]);

    return (
      <TouchableOpacity
        style={styles.tokenItem}
        activeOpacity={0.85}
        onPress={onPress}
      >
        <View style={styles.tokenItemLeft}>
          <View
            style={[
              styles.tokenIconWrapper,
              { backgroundColor: fallbackColors?.background || '#EFF4F5' },
            ]}
          >
            <View style={[styles.tokenIconInner, { width: iconSize, height: iconSize }]}>
              {iconSource && !imgError ? (
                <Image
                  source={iconSource}
                  style={{ width: iconSize, height: iconSize }}
                  resizeMode="contain"
                  onError={() => setImgError(true)}
                />
              ) : (
                <Text
                  style={[
                    styles.tokenIconText,

                    !isTextBadge && typeof listIndex === 'number' &&
                      listIndex > 0 &&
                      listIndex < 3 &&
                      styles.tokenIconTextCompact,
                    isTextBadge && { fontSize: 20, lineHeight: 24 },
                    { color: fallbackColors?.text || '#343434' },
                  ]}
                  numberOfLines={1}
                >
                  {fallbackLabel?.slice(0, 2).toUpperCase() || '??'}
                </Text>
              )}
            </View>
          </View>
        </View>
        <View style={styles.tokenItemMiddle}>
          <Text style={styles.tokenItemTitle}>{title}</Text>
          <Text style={styles.tokenItemSubtitle}>{subtitle}</Text>
        </View>
        <View style={styles.tokenItemRight}>
          <Text style={styles.tokenItemAmount} numberOfLines={2} ellipsizeMode="tail">
            {amount} {suffix || ''}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  if (!walletsUnlocked) {
    return (
      <SafeView style={styles.container}>
        <StatusBar style="dark" />
        {pinPromptProps && (
          <WalletKeyPinPromptModal
            visible={pinPromptVisible}
            memberId={pinPromptProps.memberId}
            email={pinPromptProps.email}
            onSuccess={onPinPromptSuccess}
            onCancel={onPinPromptCancel}
          />
        )}
      </SafeView>
    );
  }

  return (
    <SafeView style={styles.container}>
      <StatusBar style="dark" />
      <Header
        title={t('screens.wallet.title')}
        onBackPress={() => navigate(ROUTES.map)}
        showBackButton
      />
      {}
      <View style={styles.taboolaContainer}>
        <TaboolaBanner placementType="shop" />
      </View>

      <View style={styles.content}>
        <View style={styles.headerCardWrapper}>
          <WalletHeaderCard
            title={t('screens.wallet.myWallet')}
            cardStyle={styles.headerCard}
            address={publicAddress || ''}
            onCopy={handleCopyAddress}
            actions={[
              {
                label: t('screens.wallet.polygonScan'),
                iconImage: iconPolygonscan,
                onPress: handlePolygonscan,
              },

              {
                label: t('screens.wallet.walletInfo') || '지갑 정보',
                icon: 'information-circle-outline',
                onPress: () => setWalletInfoVisible(true),
              },
              {
                label: t('screens.wallet.receive'),
                icon: 'download-outline',
                onPress: handleReceive,
              },
            ]}
          />
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{t('screens.wallet.myBalance')}</Text>
          <TouchableOpacity style={styles.addTokenButton} onPress={handleAddToken} activeOpacity={0.7}>
            <Text style={styles.addTokenText}>{t('screens.wallet.addToken')}</Text>
            <Ionicons name="add-circle-outline" size={18} color="#000" />
          </TouchableOpacity>
        </View>

        <View style={styles.listWrapper}>
          {isLoading ? (
            <View style={styles.loadingContainer}>
              <LoadingText text={t('screens.wallet.loading')} />
            </View>
          ) : (
            <DataList
              fetchData={fetchTokenListData}
              ItemComponent={TokenListItemComponent}
              pageSize={combinedAssets.length || 20}
              contentContainerStyle={styles.dataListContent}
              keyExtractor={(item, index) => `token-${item.id}-${index}`}
              onItemPress={handleTokenPress}
              refreshing={refreshing}
              onRefresh={onPullRefresh}
            />
          )}
        </View>
      </View>

      <AddTokenModal
        modalVisible={modalVisible}
        closeModal={closeModal}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        selectedToken={selectedToken}
        contractAddress={contractAddress}
        setContractAddress={setContractAddress}
        tokenName={tokenName}
        setTokenName={setTokenName}
        tokenSymbol={tokenSymbol}
        setTokenSymbol={setTokenSymbol}
        tokenDecimals={tokenDecimals}
        setTokenDecimals={setTokenDecimals}
        handleTokenSelect={handleTokenSelect}
        handleTokenNext={handleTokenNext}
        handleContractNext={handleContractNext}
        handleAddTokenConfirm={handleAddTokenConfirm}
        isAddingToken={isAddingToken}
        existingCurrencies={cardsData.map((item) => item.currency)}
        walletTokens={cardsData}
        customTokens={customTokens}
      />

      {}
      {pinPromptProps && (
        <WalletKeyPinPromptModal
          visible={pinPromptVisible}
          memberId={pinPromptProps.memberId}
          email={pinPromptProps.email}
          onSuccess={onPinPromptSuccess}
          onCancel={onPinPromptCancel}
        />
      )}

      {}
      <Modal
        visible={walletInfoVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setWalletInfoVisible(false)}
      >
        <TouchableOpacity
          style={styles.walletInfoOverlay}
          activeOpacity={1}
          onPress={() => setWalletInfoVisible(false)}
        >
          <View style={styles.walletInfoSheet} onStartShouldSetResponder={() => true}>
            <View style={styles.walletInfoHeader}>
              <Text style={styles.walletInfoTitle}>{t('screens.wallet.walletInfo')}</Text>
              <Text style={styles.walletInfoSubtitle}>{t('screens.wallet.walletInfoSubtitle')}</Text>
            </View>
            {}
            <TouchableOpacity
              style={styles.walletInfoRow}
              onPress={() => {
                setWalletInfoVisible(false);
                setTimeout(() => navigate(ROUTES.walletKeyGuide), 250);
              }}
            >
              <View style={styles.walletInfoIconWrap}>
                <Ionicons name="help-circle-outline" size={22} color="#343a5a" />
              </View>
              <Text style={styles.walletInfoRowText}>{t('screens.myInfoSettings.walletKeyGuide')}</Text>
              <Ionicons name="chevron-forward" size={18} color="#9ca3af" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.walletInfoRow}
              onPress={() => {
                setWalletInfoVisible(false);
                setTimeout(() => navigate(ROUTES.walletPrivateKeyGoogleAuth), 250);
              }}
            >
              <View style={styles.walletInfoIconWrap}>
                <Ionicons name="shield-checkmark-outline" size={22} color="#343a5a" />
              </View>
              <Text style={styles.walletInfoRowText}>{t('screens.myInfoSettings.walletBackup')}</Text>
              <Ionicons name="chevron-forward" size={18} color="#9ca3af" />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.walletInfoRow, { borderBottomWidth: 0 }]}
              onPress={() => {
                setWalletInfoVisible(false);
                setTimeout(() => navigate(ROUTES.walletRestore), 250);
              }}
            >
              <View style={styles.walletInfoIconWrap}>
                <Ionicons name="cloud-download-outline" size={22} color="#343a5a" />
              </View>
              <Text style={styles.walletInfoRowText}>{t('screens.myInfoSettings.walletRestore')}</Text>
              <Ionicons name="chevron-forward" size={18} color="#9ca3af" />
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeView>
  );
};

const styles = StyleSheet.create({
  container: {
    ...COMMON_STYLES.container,
  },
  content: {
    flex: 1,
    ...COMMON_STYLES.scrollContent,
    paddingBottom: 0,
  },
  headerCardWrapper: {
    marginBottom: 0,
    paddingTop: 0,
    zIndex: 10,
  },

  walletInfoOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'flex-end',
  },
  walletInfoSheet: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 36,
  },
  walletInfoHeader: {
    paddingHorizontal: 4,
    paddingBottom: 16,
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  walletInfoTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  walletInfoSubtitle: {
    fontSize: 12,
    color: '#6b7280',
  },
  walletInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  walletInfoIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  walletInfoRowText: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    maxWidth: 780,
    alignSelf: 'center',
    marginBottom: 0,
  },
  sectionTitle: {
    fontSize: FONTS.size.medium,
    fontFamily: 'Roboto-Medium',
    color: '#121212',
  },
  addTokenButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    display: 'none',
  },
  addTokenText: {
    fontSize: FONTS.size.ssmall,
    fontFamily: 'Roboto-Bold',
    color: '#000000',
  },
  listWrapper: {
    flex: 1,
  },
  dataListContent: {
    paddingBottom: 32,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  tokenItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: SIZES.small,
    paddingVertical: 14,
    paddingHorizontal: SIZES.medium,
    marginHorizontal: 4,
    shadowColor: '#999999',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.05,
    shadowRadius: SIZES.medium,
    elevation: 6,
    marginBottom: SIZES.small,
    borderWidth: 1,
    borderColor: '#ededed',
  },
  tokenItemLeft: {
    marginRight: 12,
  },
  tokenIconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 0,
    boxSizing: 'border-box',
  },
  tokenIconInner: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  tokenIconText: {
    fontSize: FONTS.size.medium,
    fontFamily: 'Roboto-Bold',
  },
  tokenIconTextCompact: {
    fontSize: FONTS.size.small,
  },
  tokenItemMiddle: {
    flex: 1,
  },
  tokenItemTitle: {
    fontSize: FONTS.size.medium,
    fontFamily: 'Roboto-Medium',
    color: '#343434',
  },
  tokenItemSubtitle: {
    fontSize: FONTS.size.small,
    fontFamily: 'Roboto-Regular',
    color: '#979797',
  },
  tokenItemRight: {
    alignItems: 'flex-end',
    flexShrink: 0,
    minWidth: 0,
  },
  tokenItemAmount: {
    fontSize: FONTS.size.medium,
    fontFamily: 'Roboto-Bold',
    color: '#000000',
  },
  headerCard: {
    borderWidth: 1,
    borderColor: '#ebebeb',
    minHeight: 110,
  },
  taboolaContainer: {
    borderWidth: 2,
    borderColor: '#ededed',
  },
});
