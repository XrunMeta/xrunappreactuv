import React from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Header, PrimaryButton } from '../components';
import { COLORS, COMMON_STYLES } from '../constants';
import { ROUTES, useAppNavigation } from '../navigation';
import { useAppContext } from '../context';

const WALLET_ADDRESS = '0x8067fef89BCba0d8C0C8ec...';

const InfoCard = ({ label, value }: { label: string; value: string }) => (
  <View style={styles.card}>
    <Text style={styles.cardLabel}>{label}</Text>
    <Text style={styles.cardValue}>{value}</Text>
  </View>
);

export const WalletTransactionProgressScreen = () => {
  const { goBack, navigate } = useAppNavigation();
  const { walletSendAddress } = useAppContext();

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <Header title="Transaction" onBackPress={goBack} showBackButton />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.contentWidth}>
          <View style={styles.balanceSection}>
            <Text style={styles.balanceLabel}>Balance</Text>
            <Text style={styles.balanceValue}>9,876</Text>
            <Text style={styles.balanceToken}>POL</Text>
          </View>

          <InfoCard label="From" value={WALLET_ADDRESS} />
          <InfoCard label="To" value={walletSendAddress || WALLET_ADDRESS} />
          <InfoCard label="Gas Price" value="1645153" />

          <View style={styles.progressRow}>
            <ActivityIndicator size="small" color={COLORS.buttonPrimary} />
            <Text style={styles.progressText}>In Progress . . .</Text>
          </View>
        </View>

        <View style={[COMMON_STYLES.bottomSection, styles.bottomSection]}>
          <PrimaryButton
            title="List page"
            fullWidth
            onPress={() => navigate(ROUTES.walletTransactionResult)}
          />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 32,
  },
  contentWidth: {
    width: '100%',
    maxWidth: 780,
    alignSelf: 'center',
  },
  balanceSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  balanceLabel: {
    fontSize: 16,
    fontFamily: 'Roboto-Medium',
    color: '#8e9bae',
    marginBottom: 8,
  },
  balanceValue: {
    fontSize: 32,
    fontFamily: 'Roboto-Bold',
    color: COLORS.headerText,
    lineHeight: 48,
  },
  balanceToken: {
    fontSize: 14,
    fontFamily: 'Roboto-Medium',
    color: '#10192d',
  },
  card: {
    borderWidth: 1.5,
    borderColor: '#eef0f5',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#ffffff',
    marginBottom: 16,
  },
  cardLabel: {
    fontSize: 14,
    fontFamily: 'Roboto-Regular',
    color: '#747474',
    marginBottom: 6,
  },
  cardValue: {
    fontSize: 16,
    fontFamily: 'Roboto-Medium',
    color: '#1a2e35',
    lineHeight: 22,
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 12,
  },
  progressText: {
    fontSize: 14,
    fontFamily: 'Roboto-Regular',
    color: '#707070',
  },
  bottomSection: {
    width: '100%',
  },
});


