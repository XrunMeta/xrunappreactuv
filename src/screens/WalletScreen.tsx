import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ImageSourcePropType,
  Platform,
  Alert,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { Header, TokenListItem, WalletHeaderCard } from '../components';
import { COLORS } from '../constants';
import { ROUTES, useAppNavigation } from '../navigation';
import { useAppContext } from '../context';
import { copyToClipboard } from '../utils';

const WALLET_ADDRESS = '0xf9072c1c5c60c55daa7ee1ea72c8e7fed1aa63df';

type TokenData = {
  id: string;
  title: string;
  subtitle: string;
  amount: string;
  suffix?: string;
  badgeLabel?: string;
  iconSource?: ImageSourcePropType;
  fallbackLabel?: string;
  fallbackColors?: {
    background: string;
    text: string;
  };
};

const TOKEN_DATA: TokenData[] = [
  {
    id: 'xrun-main',
    title: 'XRUN',
    subtitle: 'Polygon',
    amount: '12,200',
    suffix: 'XRUN',
    iconSource: require('../../assets/xrun-round-logo.png'),
  },
  {
    id: 'pol',
    title: 'POL',
    subtitle: 'Polygon',
    amount: '1,600',
    suffix: 'POL',
    iconSource: require('../../assets/pol-round-logo.png'),
  },
  {
    id: 'ad',
    title: 'AD XRUN',
    subtitle: 'XRUN',
    amount: '500',
    suffix: 'XRUN',
    iconSource: require('../../assets/ad-round-logo.png'),
  },
  {
    id: 'xrun-eth',
    title: 'XRUN',
    subtitle: 'Ethereum',
    amount: '12,200',
    suffix: 'XRUN',
    iconSource: require('../../assets/xrun2-round-logo.png'),
  },
  {
    id: 'nft',
    title: 'NFT',
    subtitle: 'non-fungible token',
    amount: '0',
    suffix: '',
    fallbackLabel: 'N',
    fallbackColors: { background: '#25292c', text: '#ffffff' },
  },
];

export const WalletScreen = () => {
  const { t } = useTranslation();
  const { goBack, navigate } = useAppNavigation();
  const { openAddTokenDialog } = useAppContext();
  const tokenList = useMemo(() => TOKEN_DATA, []);

  const handleCopyAddress = () => {
    copyToClipboard(WALLET_ADDRESS);
  };

  const handleAction = (type: 'scan' | 'receive' | 'send') => {
    if (type === 'send') {
      navigate(ROUTES.walletSend);
      return;
    }
    if (type === 'receive') {
      navigate(ROUTES.walletReceive);
      return;
    }
    Alert.alert(t('screens.wallet.preparing'), `${type} ${t('screens.wallet.preparingMessage')}`);
  };

  const handleAddToken = () => {
    openAddTokenDialog();
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <Header title={t('screens.wallet.title')} onBackPress={goBack} showBackButton />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <WalletHeaderCard
          title={t('screens.wallet.myWallet')}
          address={WALLET_ADDRESS}
          onCopy={handleCopyAddress}
          actions={[
            {
              label: t('screens.wallet.polygonScan'),
              icon: 'scan-outline',
              onPress: () => handleAction('scan'),
            },
            {
              label: t('screens.wallet.receive'),
              icon: 'download-outline',
              onPress: () => handleAction('receive'),
            },
            {
              label: t('screens.wallet.send'),
              icon: 'send-outline',
              onPress: () => handleAction('send'),
            },
          ]}
        />

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{t('screens.wallet.myBalance')}</Text>
          <TouchableOpacity style={styles.addTokenButton} onPress={handleAddToken} activeOpacity={0.7}>
            <Text style={styles.addTokenText}>{t('screens.wallet.addToken')}</Text>
            <Ionicons name='add-circle-outline' size={18} color='#000' />
          </TouchableOpacity>
        </View>

        <View style={styles.listWrapper}>
          {tokenList.map((token) => (
            <TokenListItem
              key={token.id}
              title={token.title}
              subtitle={token.subtitle}
              amount={token.amount}
              suffix={token.suffix}
              badgeLabel={token.badgeLabel}
              iconSource={token.iconSource}
              fallbackLabel={token.fallbackLabel}
              fallbackColors={token.fallbackColors}
              onPress={() => {
                if (token.id === 'pol') {
                  navigate(ROUTES.polygonHistory);
                } else if (token.id === 'xrun-main') {
                  navigate(ROUTES.xrunHistory);
                } else if (token.id === 'xrun-eth') {
                  navigate(ROUTES.xrunHistory2);
                } else if (token.id === 'nft') {
                  navigate(ROUTES.nftHistory);
                } else if (token.id === 'ad') {
                  navigate(ROUTES.adHistory);
                }
              }}
            />
          ))}
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
    paddingHorizontal: 24,
    paddingBottom: 32,
    paddingTop: 16,
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
    fontSize: 16,
    fontFamily: 'Roboto-Medium',
    color: '#121212',
  },
  addTokenButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  addTokenText: {
    fontSize: 13,
    fontFamily: 'Roboto-Bold',
    color: '#000000',
  },
  addTokenPlus: {
    fontSize: 16,
    color: '#000000',
  },
  listWrapper: {
    width: '100%',
    maxWidth: 780,
    alignSelf: 'center',
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


