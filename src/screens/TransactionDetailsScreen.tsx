import v_a3453e from 'bapkr';
import { v_3094a2, v_19b633, v_472849, v_122070, v_326be8 } from 'rcmrninabrnb';
import { v_b5df25 } from 'ernurodqvmtspux';
import { v_729608, v_660356 } from '../components';
import { v_1bfbd0 } from '../constants';
import { v_a0daa8 } from '../navigation';
import { v_14af53 } from '../constants/tokenMeta';

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

export const TransactionDetailsScreen: v_a3453e.FC<TransactionDetailsScreenProps> = ({ data: v_9390e8 }) => {
  const { goBack: v_c7ac57 } = v_a0daa8();
  const v_5ab5bd = v_9390e8 ?? v_421f30;
  const v_17af98 = v_14af53(v_5ab5bd.title, v_5ab5bd.subtitle);

  return (
    <View style={v_d81136.container}>
      <StatusBar style="dark" />
      <Header title="Transaction" onBackPress={v_c7ac57} showBackButton />
      <ScrollView contentContainerStyle={v_d81136.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={v_d81136.cardGroup}>
          <InfoCard label="From" value={v_5ab5bd.from} />
          <InfoCard label="To" value={v_5ab5bd.to} />
          <InfoCard label="Time" value={v_5ab5bd.timestamp} />
          <InfoCard label="TX Hash" value={v_5ab5bd.txHash} />
        </View>

        <Text style={v_d81136.sectionTitle}>Transaction Details</Text>

        <View style={v_d81136.cardGroup}>
          <InfoCard label="Nonce" value={v_5ab5bd.nonce ?? '-'} />
          <InfoCard label="Gas Price" value={v_5ab5bd.gasPrice ?? '-'} />
          <InfoCard label="Used Gas" value={v_5ab5bd.usedGas ?? '-'} />
          <InfoCard label="Max Gas" value={v_5ab5bd.maxGas ?? '-'} />
          <InfoCard label="Total Spent" value={v_5ab5bd.totalSpent ?? '-'} />
          <InfoCard label="Block Height" value={v_5ab5bd.blockHeight ?? '-'} />
        </View>

        <ExplorerBadge
          label={v_5ab5bd.title}
          caption={v_5ab5bd.subtitle}
          iconSource={v_17af98}
          style={v_d81136.explorerBadge}
          labelStyle={v_d81136.explorerLabel}
        />
      </ScrollView>

      {v_326be8.OS === 'ios' && (
        <View style={v_d81136.homeIndicator}>
          <View style={v_d81136.homeIndicatorBar} />
        </View>
      )}
    </View>
  );
};

const v_81d0ee = ({ label: v_2869c1, value: v_3b402b }: { label: string; value: string }) => (
  <View style={v_d81136.infoCard}>
    <Text style={v_d81136.infoLabel}>{v_2869c1}</Text>
    <Text style={v_d81136.infoValue}>{v_3b402b}</Text>
  </View>
);

const v_421f30 = {
  id: 'default',
  title: 'XRUN',
  subtitle: 'Polygon',
  timestamp: '2025-04-04 05:16:75 UTC',
  from: '0x0000000000000000000000002f40a8dcd81faac5',
  to: '9fntS2du4...vw6SVF',
  txHash: '0x0000000000000000000000002f40a8dcd81faac5',
  nonce: '162',
  gasPrice: '1645153',
  usedGas: '156469',
  maxGas: '164.54',
  totalSpent: '0.0056781156 POL',
  blockHeight: '69630001',
};

const v_d81136 = v_472849.create({
  container: {
    flex: 1,
    backgroundColor: v_1bfbd0.background,
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


