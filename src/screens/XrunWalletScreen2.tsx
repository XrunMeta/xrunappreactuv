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
import { useAppContext } from '../context';

const WALLET_ADDRESS = '0xf9072c1c5c60c55daa7ee1ea72c8e7fed1aa63df';

const HISTORY_DATA = [
  {
    id: 'xr-eth-1',
    title: 'XRUN',
    subtitle: 'Ethereum',
    timestamp: '2025.04.30 14:00',
    amount: '8,600',
    suffix: 'XRUN',
    icon: require('../../assets/xrun2-round-logo.png'),
  },
];

export const XrunWalletScreen2 = () => {
  const { t } = useTranslation();
  const { navigate, goBack } = useAppNavigation();
  const { showAlert } = useAlertDialog();
  const { setWalletReceiveAddress, setWalletReceiveCurrency } = useAppContext();
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
    let filtered = [...HISTORY_DATA];

    if (filterType !== 'all') {
      filtered = filtered.filter((item) => {
        const subtitle = item.subtitle.toLowerCase();
        if (filterType === 'send') {
          return subtitle.includes('send');
        } else if (filterType === 'receive') {
          return subtitle.includes('receive') || subtitle.includes('ethereum');
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
      <Header title={t('screens.xrunWallet2.title')} onBackPress={goBack} showBackButton />
      <SafeScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <WalletHeaderCard
          title={t('screens.xrunWallet2.myBalance')}
          mainValue="12,200 XRUN"
          address={`${WALLET_ADDRESS.slice(0, 24)}.......`}
          onCopy={() => copyToClipboard(WALLET_ADDRESS, showAlert)}
          actions={[
            { label: 'PolygonScan', icon: 'scan-outline', onPress: () => handleAction('scan') },
            {
              label: 'Receive',
              icon: 'download-outline',
              onPress: () => {

                setWalletReceiveAddress(WALLET_ADDRESS);
                setWalletReceiveCurrency(1);
                navigate(ROUTES.walletReceive);
              },
            },
            { label: 'Send', icon: 'send-outline', onPress: () => handleAction('send') },
          ]}
        />

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{t('screens.xrunWallet2.history')}</Text>
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
            suffix={item.suffix}
            iconSource={item.icon}
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

