import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useTranslation } from 'react-i18next';
import * as Clipboard from 'expo-clipboard';
import { Ionicons } from '@expo/vector-icons';
import { Header, PrimaryButton, ExplorerBadge } from '../components';
import { COLORS, COMMON_STYLES } from '../constants';
import { ROUTES, useAppNavigation } from '../navigation';
import { getTokenIcon } from '../constants/tokenMeta';

const TX_HASH =
  '0x61cf20b2ebd91caa22782a740f82dcf87ad2b2be7b6401ec3daf2234e7531fbf';

const InfoCard = ({
  label,
  value,
  trailing,
}: {
  label: string;
  value: string;
  trailing?: React.ReactNode;
}) => (
  <View style={styles.card}>
    <Text style={styles.cardLabel}>{label}</Text>
    <View style={styles.cardRow}>
      <Text style={styles.cardValue}>{value}</Text>
      {trailing}
    </View>
  </View>
);

export const WalletTransactionResultScreen = () => {
  const { t } = useTranslation();
  const { reset } = useAppNavigation();
  const transactionToken = { title: 'POL', subtitle: 'Polygon' };
  const tokenIcon = getTokenIcon(
    transactionToken.title,
    transactionToken.subtitle,
  );

  const tokenBadge = (
    <ExplorerBadge
      label={transactionToken.title}
      caption={transactionToken.subtitle}
      iconSource={tokenIcon}
      compact
    />
  );

  const handleCopy = async () => {
    await Clipboard.setStringAsync(TX_HASH);
    Alert.alert(t('screens.walletTransactionResult.copySuccess'), t('screens.walletTransactionResult.copySuccessMessage'));
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <Header title={t('screens.walletTransactionResult.title')} showBackButton />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.contentWidth}>
          <View style={styles.hashRow}>
            <Text style={styles.hashValue} numberOfLines={2}>
              {TX_HASH}
            </Text>
            <TouchableOpacity style={styles.copyButton} onPress={handleCopy}>
              <View style={styles.copyIconWrapper}>
                <Ionicons name="copy-outline" size={20} color="#747474" />
              </View>
              <Text style={styles.copyText}>{t('screens.walletTransactionResult.copy')}</Text>
            </TouchableOpacity>
          </View>

          <InfoCard label={t('screens.walletTransactionResult.amount')} value="1.23 POL" />
          <InfoCard label={t('screens.walletTransactionResult.networkFree')} value="0.0065 POL" />
          <InfoCard
            label={t('screens.walletTransactionResult.networkFee')}
            value="0xe61C95a80....c40d964aa86"
            trailing={tokenBadge}
          />
          <InfoCard
            label={t('screens.walletTransactionResult.txHash')}
            value="0x61cf2.....7531fbf"
            trailing={tokenBadge}
          />

          <Text style={styles.statusText}>{t('screens.walletTransactionResult.completed')}</Text>
        </View>

        <View style={[COMMON_STYLES.bottomSection, styles.bottomSection]}>
          <PrimaryButton
            title={t('screens.walletTransactionResult.close')}
            fullWidth
            onPress={() => reset(ROUTES.wallet)}
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
  hashRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
    gap: 12,
  },
  hashValue: {
    flex: 1,
    fontSize: 13,
    fontFamily: 'Roboto-Bold',
    color: '#1a2e35',
  },
  copyButton: {
    alignItems: 'center',
  },
  copyIconWrapper: {
    width: 32,
    height: 32,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e3e8fc',
    alignItems: 'center',
    justifyContent: 'center',
  },
  copyText: {
    fontSize: 12,
    fontFamily: 'Roboto-SemiBold',
    color: '#747474',
    marginTop: 4,
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
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  cardValue: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Roboto-Medium',
    color: '#1a2e35',
    lineHeight: 22,
  },
  statusText: {
    textAlign: 'center',
    fontSize: 14,
    fontFamily: 'Roboto-Regular',
    color: '#1f6880',
    marginTop: 16,
  },
  bottomSection: {
    width: '100%',
  },
});


