import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { Header, TransactionListItem, WalletHeaderCard, WalletFilterDialog } from '../components';
import { COLORS } from '../constants';
import { ROUTES, useAppNavigation } from '../navigation';

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
  const { navigate } = useAppNavigation();
  const handleAction = (type: string) => console.log(type);
  const [filterVisible, setFilterVisible] = useState(false);

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <Header title="XRUN" showBackButton />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <WalletHeaderCard
          title="My Balance"
          mainValue="12,200 XRUN"
          address={`${WALLET_ADDRESS.slice(0, 24)}.......`}
          onCopy={() => console.log('copy xrun')}
          actions={[
            { label: 'PolygonScan', icon: 'scan-outline', onPress: () => handleAction('scan') },
            { label: 'Receive', icon: 'download-outline', onPress: () => handleAction('receive') },
            { label: 'Send', icon: 'send-outline', onPress: () => handleAction('send') },
          ]}
        />

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>History</Text>
          <TouchableOpacity onPress={() => setFilterVisible(true)} activeOpacity={0.7}>
            <Ionicons name="options-outline" size={20} color="#343434" />
          </TouchableOpacity>
        </View>

        <View style={styles.listWrapper}>
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
        onApply={(selection) => console.log('XRUN filter', selection)}
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


