import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { SafeScrollView } from '../components';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { Header, TransactionListItem, WalletHeaderCard, WalletFilterDialog, WalletFilterType, WalletFilterRange } from '../components';
import { COLORS, COMMON_STYLES, FONTS } from '../constants';
import { ROUTES, useAppNavigation } from '../navigation';
import { copyToClipboard } from '../utils';
import { useAlertDialog } from '../context/AlertDialogContext';

const WALLET_ADDRESS = '0xf9072c1c5c60c55daa7ee1ea72c8e7fed1aa63df';

const NFT_HISTORY = [
  {
    id: 'nft-1',
    title: 'NFT #8282',
    subtitle: 'Round 1 Send',
    timestamp: '2025.04.30 14:20',
    amount: '1',
  },
  {
    id: 'nft-2',
    title: 'NFT #8283',
    subtitle: 'Round 1 Receive',
    timestamp: '2025.04.30 14:00',
    amount: '1',
  },
];

export const NftWalletScreen = () => {
  const { t } = useTranslation();
  const { navigate, goBack } = useAppNavigation();
  const { showAlert } = useAlertDialog();
  const handleAction = (type: 'scan' | 'receive' | 'send') => {
    if (type === 'send') {
      navigate(ROUTES.walletSend);
      return;
    }
    console.log(type);
  };
  const [filterVisible, setFilterVisible] = useState(false);
  const [filterType, setFilterType] = useState<WalletFilterType>('all');
  const [filterRange, setFilterRange] = useState<WalletFilterRange>('7d');

  const filteredData = useMemo(() => {
    let filtered = [...NFT_HISTORY];

    if (filterType !== 'all') {
      filtered = filtered.filter((item) => {
        const subtitle = item.subtitle.toLowerCase();
        if (filterType === 'send') {
          return subtitle.includes('send');
        } else if (filterType === 'receive') {
          return subtitle.includes('receive');
        }
        return true;
      });
    }

    const now = new Date();
    const daysAgo = filterRange === '7d' ? 7 : filterRange === '14d' ? 14 : 30;
    const cutoffDate = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);

    filtered = filtered.filter((item) => {

      const dateStr = item.timestamp.split(' ')[0]; 
      const [year, month, day] = dateStr.split('.').map(Number);
      const itemDate = new Date(year, month - 1, day);
      return itemDate >= cutoffDate;
    });

    return filtered;
  }, [filterType, filterRange]);

  const handleFilterApply = (selection: { type: WalletFilterType; range: WalletFilterRange }) => {
    setFilterType(selection.type);
    setFilterRange(selection.range);
  };

  return (
    <View style={styles.container}>
      <Header title={t('screens.nftWallet.title')} onBackPress={goBack} showBackButton />
      <SafeScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <WalletHeaderCard
          title={t('screens.nftWallet.myBalance')}
          mainValue="0 NFT"
          address={`${WALLET_ADDRESS.slice(0, 24)}.......`}
          onCopy={() => copyToClipboard(WALLET_ADDRESS, showAlert)}
          actions={[
            { label: 'PolygonScan', icon: 'scan-outline', onPress: () => handleAction('scan') },
            { label: 'Receive', icon: 'download-outline', onPress: () => navigate(ROUTES.walletReceive) },
            { label: 'Send', icon: 'send-outline', onPress: () => handleAction('send') },
          ]}
          theme={{
            background: '#111111',
            accentOne: 'rgba(255,255,255,0.18)',
            accentTwo: 'rgba(255,255,255,0.08)',
          }}
        />

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{t('screens.nftWallet.history')}</Text>
          <TouchableOpacity onPress={() => setFilterVisible(true)} activeOpacity={0.7}>
            <Ionicons name="options-outline" size={20} color="#343434" />
          </TouchableOpacity>
        </View>

        {filteredData.map((item) => (
          <TransactionListItem
            key={item.id}
            title={item.title}
            subtitle={item.subtitle}
            timestamp={item.timestamp}
            amount={item.amount}
            iconSource={undefined}
            fallbackLabel="N"
            fallbackColors={{ background: '#111111', text: '#ffffff' }}
            onPress={() => navigate(ROUTES.transactionDetails)}
          />
        ))}
      </SafeScrollView>

      <WalletFilterDialog
        visible={filterVisible}
        onClose={() => setFilterVisible(false)}
        onApply={handleFilterApply}
        defaultType={filterType}
        defaultRange={filterRange}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...COMMON_STYLES.container,
  },
  scrollContent: {
    ...COMMON_STYLES.scrollContent,
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

});

