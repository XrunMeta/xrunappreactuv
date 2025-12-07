import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { SafeScrollView } from '../components';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { Header, TransactionListItem, WalletHeaderCard, WalletFilterDialog } from '../components';
import { COLORS, COMMON_STYLES } from '../constants';
import { ROUTES, useAppNavigation } from '../navigation';
import { copyToClipboard } from '../utils';
import { useAlertDialog } from '../context/AlertDialogContext';

const WALLET_ADDRESS = '0xf9072c1c5c60c55daa7ee1ea72c8e7fed1aa63df';

const HISTORY_DATA = [
  {
    id: 'tx-1',
    title: 'POL',
    subtitle: 'Send',
    timestamp: '2025.04.30 14:10',
    amount: '1,600',
    suffix: 'POL',
    icon: require('../../assets/pol-round-logo.png'),
  },
  {
    id: 'tx-2',
    title: 'POL',
    subtitle: 'Receive',
    timestamp: '2025.04.30 14:00',
    amount: '1,600',
    suffix: 'POL',
    icon: require('../../assets/pol-round-logo.png'),
  },
];

export const PolygonWalletScreen = () => {
  const { t } = useTranslation();
  const { goBack, navigate } = useAppNavigation();
  const { showAlert } = useAlertDialog();
  const [filterVisible, setFilterVisible] = useState(false);

  const handleFilter = () => {
    setFilterVisible(true);
  };

  return (
    <View style={styles.container}>
      <Header title={t('screens.polygonWallet.title')} onBackPress={goBack} showBackButton />
      <SafeScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <WalletHeaderCard
          title={t('screens.polygonWallet.myBalance')}
          mainValue="1,657 POL"
          address={`${WALLET_ADDRESS.slice(0, 24)}.......`}
          onCopy={() => copyToClipboard(WALLET_ADDRESS, showAlert)}
          actions={[
            { label: 'PolygonScan', icon: 'scan-outline', onPress: () => console.log('scan') },
            { label: 'Receive', icon: 'download-outline', onPress: () => navigate(ROUTES.walletReceive) },
            {
              label: 'Send',
              icon: 'send-outline',
              onPress: () => navigate(ROUTES.walletSend),
            },
          ]}
          theme={{
            background: '#683ab5',
            accentOne: 'rgba(255,255,255,0.18)',
            accentTwo: 'rgba(255,255,255,0.12)',
          }}
        />

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{t('screens.polygonWallet.history')}</Text>
          <TouchableOpacity onPress={handleFilter} activeOpacity={0.7}>
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
        onApply={(selection) => console.log('Polygon filter', selection)}
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
    fontSize: 16,
    fontFamily: 'Roboto-Medium',
    color: '#121212',
  },


});


