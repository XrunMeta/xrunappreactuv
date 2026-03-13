import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { SafeScrollView } from '../components';
import { Header, ExplorerBadge } from '../components';
import { COLORS, COMMON_STYLES, FONTS } from '../constants';
import { useAppNavigation } from '../navigation';
import { getTokenIcon } from '../constants/tokenMeta';
import { useTranslation } from 'react-i18next';
import { useAppContext } from '../context';

export interface TransactionDetails {
  id: string;
  title: string;
  subtitle: string;
  timestamp: string;
  from: string;
  to: string;
  txHash: string;
  amount?: string; 
  symbol?: string; 
  nonce?: string;
  gasPrice?: string;
  usedGas?: string;
  maxGas?: string;
  totalSpent?: string;
  blockHeight?: string;
  fromWalletList?: boolean; 
}

interface TransactionDetailsScreenProps {
  data?: TransactionDetails;
  onClose?: () => void;
}

export const TransactionDetailsScreen: React.FC<TransactionDetailsScreenProps> = ({ data, onClose }) => {
  const { t } = useTranslation();
  const { goBack } = useAppNavigation();
  const { selectedTransactionDetails, resetSelectedTransactionDetails } = useAppContext();

  const [localDetails, setLocalDetails] = React.useState<TransactionDetails | null>(null);

  React.useEffect(() => {
    const newDetails = selectedTransactionDetails || data || DEFAULT_DETAILS;
    if (newDetails && newDetails.id !== 'default') {
      setLocalDetails(newDetails);
      console.log('[TransactionDetailsScreen] 로컬 state에 저장:', {
        id: newDetails.id,
        fromWalletList: newDetails.fromWalletList,
      });
    }
  }, [selectedTransactionDetails, data]);

  React.useEffect(() => {
    return () => {

      setTimeout(() => {
        resetSelectedTransactionDetails();
      }, 100);
    };
  }, [resetSelectedTransactionDetails]);

  const details = localDetails || selectedTransactionDetails || data || DEFAULT_DETAILS;
  const tokenIcon = getTokenIcon(details.title, details.subtitle);

  React.useEffect(() => {
    if (selectedTransactionDetails || data) {
      console.log('[TransactionDetailsScreen] 수신한 데이터:', {
        selectedTransactionDetails: selectedTransactionDetails ? JSON.stringify(selectedTransactionDetails, null, 2) : null,
        propsData: data ? JSON.stringify(data, null, 2) : null,
        최종사용데이터: JSON.stringify(details, null, 2),
        지갑목록에서이동: details.fromWalletList ? '예' : '아니오',
      });
      console.log('[TransactionDetailsScreen] 각 필드 값:', {
        id: details.id,
        title: details.title,
        subtitle: details.subtitle,
        timestamp: details.timestamp,
        from: details.from,
        to: details.to,
        txHash: details.txHash,
        nonce: details.nonce,
        gasPrice: details.gasPrice,
        usedGas: details.usedGas,
        maxGas: details.maxGas,
        totalSpent: details.totalSpent,
        blockHeight: details.blockHeight,
      });
    }
  }, [selectedTransactionDetails, data, details]);

  const back = () => {

    const currentDetails = localDetails || selectedTransactionDetails || data || DEFAULT_DETAILS;
    console.log('[TransactionDetailsScreen] 뒤로가기 호출:', {
      localDetails: localDetails ? '있음' : '없음',
      selectedTransactionDetails: selectedTransactionDetails ? '있음' : '없음',
      data: data ? '있음' : '없음',
      currentDetails: currentDetails ? '있음' : '없음',
      fromWalletList: currentDetails.fromWalletList,
      details_fromWalletList: details.fromWalletList,
      onClose: onClose ? '있음' : '없음',
    });

    if (onClose) {
      onClose();
    } else if (currentDetails.fromWalletList) {

      goBack();
    } else {

      goBack();
    }
  };

  return (
    <View style={styles.container}>
      <Header title={t('screens.transactionDetails.title')} onBackPress={back} showBackButton />
      <SafeScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.cardGroup}>
          <InfoCard label={t('screens.transactionDetails.from')} value={details.from || '-'} />
          <InfoCard label={t('screens.transactionDetails.to')} value={details.to || '-'} />
          {details.amount && (
            <InfoCard 
              label={t('screens.transactionDetails.amount')} 
              value={`${details.amount} ${details.symbol || ''}`.trim()} 
            />
          )}
          <InfoCard label={t('screens.transactionDetails.time')} value={details.timestamp || '-'} />
          <InfoCard label={t('screens.transactionDetails.txHash')} value={details.txHash || '-'} />
        </View>

        <Text style={styles.sectionTitle}>{t('screens.transactionDetails.transactionDetails')}</Text>

        <View style={styles.cardGroup}>
          <InfoCard label={t('screens.transactionDetails.nonce')} value={details.nonce || '-'} />
          <InfoCard label={t('screens.transactionDetails.gasPrice')} value={details.gasPrice || '-'} />
          <InfoCard label={t('screens.transactionDetails.usedGas')} value={details.usedGas || '-'} />
          <InfoCard label={t('screens.transactionDetails.maxGas')} value={details.maxGas || '-'} />
          <InfoCard label={t('screens.transactionDetails.totalSpent')} value={details.totalSpent || '-'} />
          <InfoCard label={t('screens.transactionDetails.blockHeight')} value={details.blockHeight || '-'} />
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
    fontSize: FONTS.size.msmall,
    fontFamily: 'Roboto-Regular',
    color: '#B8B8B8',
  },
  infoValue: {
    fontSize: FONTS.size.medium,
    fontFamily: 'Roboto-Medium',
    color: '#121212',
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: FONTS.size.large,
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
    fontSize: FONTS.size.lsmall,
  },

});

