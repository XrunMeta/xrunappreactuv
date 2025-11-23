import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { Header, TransactionListItem, WalletHeaderCard, WalletFilterDialog } from '../components';
import { COLORS } from '../constants';
import { ROUTES, useAppNavigation } from '../navigation';
import { copyToClipboard } from '../utils';

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
  const { navigate } = useAppNavigation();
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
      <StatusBar style="dark" />
      <Header title="NFT" showBackButton />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <WalletHeaderCard
          title="My Balance"
          mainValue="0 NFT"
          address={`${WALLET_ADDRESS.slice(0, 24)}.......`}
          onCopy={() => copyToClipboard(WALLET_ADDRESS)}
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
          <Text style={styles.sectionTitle}>History</Text>
          <TouchableOpacity onPress={() => setFilterVisible(true)} activeOpacity={0.7}>
            <Ionicons name="options-outline" size={20} color="#343434" />
          </TouchableOpacity>
        </View>

        <View style={styles.listWrapper}>
          {NFT_HISTORY.map((item) => (
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
        </View>
      </ScrollView>

      {Platform.OS === 'ios' && (
        <View style={styles.homeIndicator}>
          <View style={styles.homeIndicatorBar} />
        </View>
      )}

      <WalletFilterDialog
        visible={filterVisible}
        onClose={() => setFilterVisible(false)}
        onApply={(selection) => console.log('NFT filter', selection)}
      />
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
    paddingBottom: 40,
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


