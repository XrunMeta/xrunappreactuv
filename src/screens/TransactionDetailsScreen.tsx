import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { SafeScrollView } from '../components';
import { Header, ExplorerBadge } from '../components';
import { COLORS, COMMON_STYLES } from '../constants';
import { useAppNavigation } from '../navigation';
import { getTokenIcon } from '../constants/tokenMeta';
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation();
  const { goBack } = useAppNavigation();
  const details = data ?? DEFAULT_DETAILS;
  const tokenIcon = getTokenIcon(details.title, details.subtitle);

  return (
    <View style={styles.container}>
      <Header title={t('screens.transactionDetails.title')} onBackPress={goBack} showBackButton />
      <SafeScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.cardGroup}>
          <InfoCard label={t('screens.transactionDetails.from')} value={details.from} />
          <InfoCard label={t('screens.transactionDetails.to')} value={details.to} />
          <InfoCard label={t('screens.transactionDetails.time')} value={details.timestamp} />
          <InfoCard label={t('screens.transactionDetails.txHash')} value={details.txHash} />
        </View>

        <Text style={styles.sectionTitle}>{t('screens.transactionDetails.transactionDetails')}</Text>

        <View style={styles.cardGroup}>
          <InfoCard label={t('screens.transactionDetails.nonce')} value={details.nonce ?? '-'} />
          <InfoCard label={t('screens.transactionDetails.gasPrice')} value={details.gasPrice ?? '-'} />
          <InfoCard label={t('screens.transactionDetails.usedGas')} value={details.usedGas ?? '-'} />
          <InfoCard label={t('screens.transactionDetails.maxGas')} value={details.maxGas ?? '-'} />
          <InfoCard label={t('screens.transactionDetails.totalSpent')} value={details.totalSpent ?? '-'} />
          <InfoCard label={t('screens.transactionDetails.blockHeight')} value={details.blockHeight ?? '-'} />
        </View>

        <ExplorerBadge
          label={details.title}
          caption={details.subtitle}
          iconSource={tokenIcon}
          style={styles.explorerBadge}
          labelStyle={styles.explorerLabel}
        />
      </SafeScrollView>
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
    ...COMMON_STYLES.container,
  },
  scrollContent: {
    ...COMMON_STYLES.scrollContent,
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

});


