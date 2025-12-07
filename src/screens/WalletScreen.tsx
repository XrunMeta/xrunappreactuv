import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
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
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BigNumber from 'bignumber.js';
import { Header, WalletHeaderCard, DataList, AddTokenModal, SafeView } from '../components';
import { COLORS, COMMON_STYLES, LIST_STYLES, FONTS, SIZES } from '../constants';
import { ROUTES, useAppNavigation } from '../navigation';
import { useAppContext } from '../context';
import { copyToClipboard, loadCustomTokens, saveCustomTokens } from '../utils';
import { useAlertDialog } from '../context/AlertDialogContext';
import {
  fetchWalletData,
  fetchOtherChainsStatus,
  fetchADXRUNTopBanners,
  fetchTokenBalance,
  checkERC20Token,
} from '../services';
import {
  WalletData,
  CombinedAsset,
  CustomToken,
} from '../types';
import { PaginationParams, PaginationResponse } from '../types/pagination';

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
    (walletData: WalletData[], customTokens: CustomToken[], adXrunAmount: number): CombinedAsset[] => {

      const walletAssets: CombinedAsset[] = walletData
        .filter((item) => item.currency !== 2) 
        .map((item) => ({
          id: item.currency,
          symbol: item.symbol,
          name: item.currencyname,
          subCurrencyName: item.subCurrencyName,
          amount: new BigNumber(item.Wamount || item.amount || '0').toFixed(2),
          icon:
            item.currency === 1
              ? require('../../assets/xrun-round-logo.png')
              : `data:image/png;base64,${item.symbolimg?.replace(/(\r\n|\n|\r)/gm, '') || ''}`,
          currency: item.currency,
          isCustom: false,
          contractAddress: item.address,
          subcurrency: item.subcurrency,
          originalData: item,
        }));

      const customAssets: CombinedAsset[] = customTokens
        .filter((token) => token.currency !== 2) 
        .map((token) => {

          const matchingWalletData = walletData.find(
            (wallet) => wallet.currency === token.currency,
          );

          return {
            id: token.currency,
            symbol: token.symbol,
            name: token.name,
            amount: new BigNumber(token.amount || '0').toFixed(2),
            icon: matchingWalletData
              ? `data:image/png;base64,${matchingWalletData.symbolimg?.replace(
                /(\r\n|\n|\r)/gm,
                '',
              ) || ''}`
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
        amount: new BigNumber(adXrunAmount || '0').toFixed(2),
        icon: require('../../assets/ad-round-logo.png'),
        currency: 19,
        isCustom: false,
        subCurrencyName: 'AD XRUN',
        contractAddress: '',
        subcurrency: undefined,
        originalData: undefined,
      };

      allAssets.push(adXrunItem);

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
        const priorityOrder = [18, 16, 19, 1]; 

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
      const combined = combineTokenData(cardsData, customTokens, adXrunAmount);
      setCombinedAssets(combined);
    }
  }, [cardsData, customTokens, adXrunAmount, combineTokenData]);

  useEffect(() => {
    if (!member) return;

    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    const fetchWalletDataAsync = async () => {
      try {

        const walletResponse = await fetchWalletData(member, 7, navigate);

        if (walletResponse && walletResponse.data) {

          const filteredData = walletResponse.data.filter((item) => {
            if (statusOtherChain === 'on') {
              return true; 
            } else {

              return (
                item.subcurrency === 5000 ||
                item.subcurrency === 5100 ||
                item.subcurrency === 5200
              );
            }
          });

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

          const xrunWallet = sortedData.find((item) => Number(item.currency) === 1);

          if (xrunWallet) {
            setPublicAddress(xrunWallet.address);
          }

          setIsLoading(false);
        }
      } catch (error: any) {
        if (error.name !== 'AbortError') {
          console.error('Failed to fetch wallet data:', error);
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

    fetchWalletDataAsync();
    fetchOtherChainsStatusAsync();
    fetchADXRUNTopBannersAsync();

    return () => {
      abortController.abort();
    };
  }, [member, statusOtherChain, navigate]);

  const handleCopyAddress = () => {
    if (publicAddress) {
      copyToClipboard(publicAddress, showAlert);
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
    console.log('[WalletScreen] receive 버튼 클릭 - currency: 1 (XRUN)');
    setWalletReceiveAddress(publicAddress);
    setWalletReceiveCurrency(1); 
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
      const getIconColor = (currency: number): { background: string; text: string } => {
        switch (currency) {
          case 1: 
            return { background: '#EFF4F5', text: '#000000' };
          case 2: 
            return { background: '#627EEA', text: '#FFFFFF' };
          case 3: 
            return { background: '#5F59E0', text: '#FFFFFF' };
          case 16: 
            return { background: '#8347E6', text: '#FFFFFF' };
          case 18: 
            return { background: '#1e1e1e', text: '#FFFFFF' };
          case 19: 
            return { background: '#25292C', text: '#FFFFFF' };
          default:
            return { background: '#EDEDED', text: '#343434' };
        }
      };

      const iconColors = getIconColor(asset.currency);
      const iconSource =
        typeof asset.icon === 'string' && asset.icon.startsWith('data:image')
          ? { uri: asset.icon }
          : asset.icon;

      return {
        ...asset,
        title: asset.symbol,
        subtitle: asset.subCurrencyName || asset.name,
        amount: new BigNumber(asset.amount || '0').toFormat(2, {
          decimalSeparator: '.',
          groupSeparator: ',',
          groupSize: 3,
        }),
        suffix: asset.symbol,
        iconSource,
        fallbackLabel: asset.symbol.slice(0, 2).toUpperCase(),
        fallbackColors: iconColors,
      };
    },
    [],
  );

  const fetchTokenListData = useCallback(
    async (params: PaginationParams): Promise<PaginationResponse<TokenListItemData>> => {

      const tokenListData = combinedAssets.map(convertAssetToTokenListItem);

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
      } else {

        setSelectedWalletAsset(item);
        navigate(ROUTES.walletDetail);
      }
    },
    [navigate, setSelectedWalletAsset],
  );

  const TokenListItemComponent: React.FC<TokenListItemData & { onPress?: () => void }> = (props) => {
    const { title, subtitle, amount, suffix, iconSource, fallbackLabel, fallbackColors, onPress } =
      props;

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
              { backgroundColor: fallbackColors?.background || '#EDEDED' },
            ]}
          >
            {iconSource ? (
              <Image
                source={iconSource}
                style={styles.tokenIconImage}
                resizeMode="contain"
              />
            ) : (
              <Text
                style={[
                  styles.tokenIconText,
                  { color: fallbackColors?.text || '#343434' },
                ]}
              >
                {fallbackLabel?.slice(0, 2).toUpperCase() || '??'}
              </Text>
            )}
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

  return (
    <SafeView style={styles.container}>
      <Header title={t('screens.wallet.title')} onBackPress={goBack} showBackButton />
      <View style={styles.content}>
        <View style={styles.headerCardWrapper}>
          <WalletHeaderCard
            title={t('screens.wallet.myWallet')}
            address={publicAddress || ''}
            onCopy={handleCopyAddress}
            actions={[
              {
                label: t('screens.wallet.polygonScan'),
                icon: 'scan-outline',
                onPress: handlePolygonscan,
              },
              {
                label: t('screens.wallet.etherscan'),
                icon: 'globe-outline',
                onPress: handleEtherscan,
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
              <Text>{t('screens.wallet.loading')}</Text>
            </View>
          ) : (
            <DataList
              fetchData={fetchTokenListData}
              ItemComponent={TokenListItemComponent}
              pageSize={combinedAssets.length || 20}
              contentContainerStyle={styles.dataListContent}
              keyExtractor={(item, index) => `token-${item.id}-${index}`}
              onItemPress={handleTokenPress}
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
  },
  headerCardWrapper: {
    marginBottom: 0,
    zIndex: 10,
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
  },
  tokenIconImage: {
    width: 40,
    height: 40,
  },
  tokenIconText: {
    fontSize: FONTS.size.medium,
    fontFamily: 'Roboto-Bold',
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
});
