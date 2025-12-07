import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { SafeScrollView } from '../components';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { Header, TransactionListItem, WalletHeaderCard, WalletFilterDialog } from '../components';
import { COLORS, COMMON_STYLES, FONTS } from '../constants';
import { ROUTES, useAppNavigation } from '../navigation';
import { copyToClipboard } from '../utils';
import { useAlertDialog } from '../context/AlertDialogContext';

const WALLET_ADDRESS = '0xf9072c1c5c60c55daa7ee1ea72c8e7fed1aa63df';

const HISTORY_DATA = [
  {
    id: 'xr-1',
    title: 'XRUN',
    subtitle: 'AD XRUN',
    timestamp: '2025.04.30 14:00',
    amount: '8,600',
    suffix: 'XRUN',
    icon: require('../../assets/xrun-round-logo.png'),
  },
  {
    id: 'xr-2',
    title: 'XRUN',
    subtitle: 'Receive',
    timestamp: '2025.04.30 14:00',
    amount: '3,600',
    suffix: 'XRUN',
    icon: require('../../assets/xrun-round-logo.png'),
  },
  {
    id: 'xr-3',
    title: 'XRUN',
    subtitle: 'Send',
    timestamp: '2025.04.30 14:00',
    amount: '3,600',
    suffix: 'XRUN',
    icon: require('../../assets/xrun-round-logo.png'),
  },
];

export const XrunWalletScreen = () => {
  const { t } = useTranslation();
  const { navigate } = useAppNavigation();
  const { showAlert } = useAlertDialog();
  const handleAction = (type: 'scan' | 'receive' | 'send') => {
    if (type === 'send') {
      navigate(ROUTES.walletSend);
      return;
    }
    console.log(type);
  };
  const [filterVisible, setFilterVisible] = useState(false);

  return (
    <View style={styles.container}>
      <Header title={t('screens.xrunWallet.title')} showBackButton />
      <SafeScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <WalletHeaderCard
          title={t('screens.xrunWallet.myBalance')}
          mainValue="12,200 XRUN"
          address={`${WALLET_ADDRESS.slice(0, 24)}.......`}
          onCopy={() => copyToClipboard(WALLET_ADDRESS, showAlert)}
          actions={[
            { label: 'PolygonScan', icon: 'scan-outline', onPress: () => handleAction('scan') },
            { label: 'Receive', icon: 'download-outline', onPress: () => navigate(ROUTES.walletReceive) },
            { label: 'Send', icon: 'send-outline', onPress: () => handleAction('send') },
          ]}
        />

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{t('screens.xrunWallet.history')}</Text>
          <TouchableOpacity onPress={() => setFilterVisible(true)} activeOpacity={0.7}>
            <Ionicons name="options-outline" size={20} color="#343434" />
          </TouchableOpacity>
        </View>

        {HISTORY_DATA.map((item) => (
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
        onApply={(selection) => console.log('XRUN filter', selection)}
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


