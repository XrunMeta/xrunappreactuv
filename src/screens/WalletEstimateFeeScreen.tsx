import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useTranslation } from 'react-i18next';
import { Header, PrimaryButton } from '../components';
import { COLORS, COMMON_STYLES } from '../constants';
import { ROUTES, useAppNavigation } from '../navigation';
import { useAppContext } from '../context';

const WALLET_ADDRESS = '0xf9072c1c5c60c55daa7ee1ea72c8e7fed1aa63df';

const InfoCard = ({ label, value }: { label: string; value: string }) => (
  <View style={styles.card}>
    <Text style={styles.cardLabel}>{label}</Text>
    <Text style={styles.cardValue}>{value}</Text>
  </View>
);

export const WalletEstimateFeeScreen = () => {
  const { t } = useTranslation();
  const { goBack, navigate } = useAppNavigation();
  const { walletSendAddress } = useAppContext();

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <Header title={t('screens.walletEstimateFee.title')} onBackPress={goBack} showBackButton />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.contentWidth}>
          <View style={styles.balanceSection}>
            <Text style={styles.balanceLabel}>{t('screens.walletEstimateFee.balance')}</Text>
            <Text style={styles.balanceValue}>9,876</Text>
            <Text style={styles.balanceToken}>POL</Text>
          </View>

          <InfoCard label={t('screens.walletEstimateFee.from')} value={WALLET_ADDRESS} />
          <InfoCard
            label={t('screens.walletEstimateFee.to')}
            value={walletSendAddress || t('screens.walletEstimateFee.receiverAddressPlaceholder')}
          />
          <InfoCard label={t('screens.walletEstimateFee.networkFee')} value="0.002 POL < US$0.001" />
          <InfoCard label={t('screens.walletEstimateFee.speed')} value="Normal <15S" />

          <Text style={styles.helperText}>{t('screens.walletEstimateFee.estimation')} 10 second</Text>
        </View>

        <View style={[COMMON_STYLES.bottomSection, styles.bottomSection]}>
          <PrimaryButton
            title={t('screens.walletEstimateFee.confirm')}
            fullWidth
            onPress={() => navigate(ROUTES.walletTransactionProgress)}
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
    paddingBottom: 32,
    paddingTop: 24,
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
  helperText: {
    textAlign: 'center',
    fontSize: 14,
    fontFamily: 'Roboto-Regular',
    color: '#707070',
    marginTop: 8,
  },
  bottomSection: {
    width: '100%',
  },
});


