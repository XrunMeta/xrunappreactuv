import React from 'react';
import { View, Text, StyleSheet, ScrollView, Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Header, ExplorerBadge } from '../components';
import { COLORS } from '../constants';
import { useAppNavigation } from '../navigation';
import { getTokenIcon } from '../constants/tokenMeta';

export interface TransactionDetails {
  id: string;
  title: string;
  subtitle: string;
  timestamp: string;
  from: string;
  to: string;
  txHash: string;
  nonce?: string;
  gasPrice?: string;
  usedGas?: string;
  maxGas?: string;
  totalSpent?: string;
  blockHeight?: string;
}

interface TransactionDetailsScreenProps {
  data?: TransactionDetails;
}

export const TransactionDetailsScreen: React.FC<TransactionDetailsScreenProps> = ({ data }) => {
  const { goBack } = useAppNavigation();
  const details = data ?? DEFAULT_DETAILS;
  const tokenIcon = getTokenIcon(details.title, details.subtitle);

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <Header title="Transaction" onBackPress={goBack} showBackButton />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.cardGroup}>
          <InfoCard label="From" value={details.from} />
          <InfoCard label="To" value={details.to} />
          <InfoCard label="Time" value={details.timestamp} />
          <InfoCard label="TX Hash" value={details.txHash} />
        </View>

        <Text style={styles.sectionTitle}>Transaction Details</Text>

        <View style={styles.cardGroup}>
          <InfoCard label="Nonce" value={details.nonce ?? '-'} />
          <InfoCard label="Gas Price" value={details.gasPrice ?? '-'} />
          <InfoCard label="Used Gas" value={details.usedGas ?? '-'} />
          <InfoCard label="Max Gas" value={details.maxGas ?? '-'} />
          <InfoCard label="Total Spent" value={details.totalSpent ?? '-'} />
          <InfoCard label="Block Height" value={details.blockHeight ?? '-'} />
        </View>

        <ExplorerBadge
          label={details.title}
          caption={details.subtitle}
          iconSource={tokenIcon}
          style={styles.explorerBadge}
          labelStyle={styles.explorerLabel}
        />
      </ScrollView>

      {Platform.OS === 'ios' && (
        <View style={styles.homeIndicator}>
          <View style={styles.homeIndicatorBar} />
        </View>
      )}
    </View>
  );
};

const InfoCard = ({ label, value }: { label: string; value: string }) => (
  <View style={styles.infoCard}>
    <Text style={styles.infoLabel}>{label}</Text>
    <Text style={styles.infoValue}>{value}</Text>
  </View>
);

const DEFAULT_DETAILS: TransactionDetails = {
  id: 'default',
  title: 'XRUN',
  subtitle: 'Polygon',
  timestamp: '2025-04-04 05:16:75 UTC',
  from: '0xc3A62e8eC73FcB2073dC9878e86292c0131632e2',
  to: '9fntS2du4...vw6SVF',
  txHash: '0xc3A62e8eC73FcB2073dC9878e86292c0131632e2',
  nonce: '162',
  gasPrice: '1645153',
  usedGas: '156469',
  maxGas: '164.54',
  totalSpent: '0.0056781156 POL',
  blockHeight: '69630001',
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 40,
  },
  cardGroup: {
    gap: 12,
    marginBottom: 24,
  },
  infoCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#E4E4E4',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  infoLabel: {
    fontSize: 14,
    fontFamily: 'Roboto-Regular',
    color: '#B8B8B8',
  },
  infoValue: {
    fontSize: 16,
    fontFamily: 'Roboto-Medium',
    color: '#121212',
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Roboto-Bold',
    color: '#121212',
    marginBottom: 16,
  },
  explorerBadge: {
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  explorerLabel: {
    color: '#683AB5',
    fontSize: 15,
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


