import v_a3453e from 'bapkr';
import { v_3094a2, v_19b633, v_472849, v_326be8 } from 'rcmrninabrnb';
import { v_570c34 } from '../components';
import { v_729608, v_660356 } from '../components';
import { v_1bfbd0, v_a61db3, v_843035 } from '../constants';
import { v_a0daa8 } from '../navigation';
import { v_14af53 } from '../constants/tokenMeta';
import { v_772971 } from 'jmpfvteuuztnp';
import { v_700ef9 } from '../context';

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
}

export const TransactionDetailsScreen: v_a3453e.FC<TransactionDetailsScreenProps> = ({ data: v_9390e8 }) => {
  const { t: v_8d41d7 } = v_772971();
  const { goBack: v_c7ac57 } = v_a0daa8();
  const { selectedTransactionDetails: v_c51166, resetSelectedTransactionDetails: v_554d22 } = v_700ef9();

  const [v_d7f5e7, v_04e93e] = v_a3453e.useState<TransactionDetails | null>(null);

  v_a3453e.useEffect(() => {
    const v_b87b82 = v_c51166 || v_9390e8 || v_421f30;
    if (v_b87b82 && v_b87b82.id !== 'default') {
      v_04e93e(v_b87b82);
      console.log('[TransactionDetailsScreen] 로컬 state에 저장:', {
        id: v_b87b82.id,
        fromWalletList: v_b87b82.fromWalletList,
      });
    }
  }, [v_c51166, v_9390e8]);

  v_a3453e.useEffect(() => {
    return () => {

      setTimeout(() => {
        v_554d22();
      }, 100);
    };
  }, [v_554d22]);

  const v_5ab5bd = v_d7f5e7 || v_c51166 || v_9390e8 || v_421f30;
  const v_17af98 = v_14af53(v_5ab5bd.title, v_5ab5bd.subtitle);

  v_a3453e.useEffect(() => {
    if (v_c51166 || v_9390e8) {
      console.log('[TransactionDetailsScreen] 수신한 데이터:', {
        selectedTransactionDetails: v_c51166 ? JSON.stringify(v_c51166, null, 2) : null,
        propsData: v_9390e8 ? JSON.stringify(v_9390e8, null, 2) : null,
        최종사용데이터: JSON.stringify(v_5ab5bd, null, 2),
        지갑목록에서이동: v_5ab5bd.fromWalletList ? '예' : '아니오',
      });
      console.log('[TransactionDetailsScreen] 각 필드 값:', {
        id: v_5ab5bd.id,
        title: v_5ab5bd.title,
        subtitle: v_5ab5bd.subtitle,
        timestamp: v_5ab5bd.timestamp,
        from: v_5ab5bd.from,
        to: v_5ab5bd.to,
        txHash: v_5ab5bd.txHash,
        nonce: v_5ab5bd.nonce,
        gasPrice: v_5ab5bd.gasPrice,
        usedGas: v_5ab5bd.usedGas,
        maxGas: v_5ab5bd.maxGas,
        totalSpent: v_5ab5bd.totalSpent,
        blockHeight: v_5ab5bd.blockHeight,
      });
    }
  }, [v_c51166, v_9390e8, v_5ab5bd]);

  const v_56e16d = () => {

    const v_421263 = v_d7f5e7 || v_c51166 || v_9390e8 || v_421f30;
    console.log('[TransactionDetailsScreen] 뒤로가기 호출:', {
      localDetails: v_d7f5e7 ? '있음' : '없음',
      selectedTransactionDetails: v_c51166 ? '있음' : '없음',
      data: v_9390e8 ? '있음' : '없음',
      currentDetails: v_421263 ? '있음' : '없음',
      fromWalletList: v_421263.fromWalletList,
      details_fromWalletList: v_5ab5bd.fromWalletList,
    });
    if (v_421263.fromWalletList) {
      v_c7ac57();
    } else {

      v_c7ac57();
    }
  };

  return (
    <View style={v_d81136.container}>
      <Header title={v_8d41d7('screens.transactionDetails.title')} onBackPress={v_56e16d} showBackButton />
      <SafeScrollView contentContainerStyle={v_d81136.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={v_d81136.cardGroup}>
          <InfoCard label={v_8d41d7('screens.transactionDetails.from')} value={v_5ab5bd.from || '-'} />
          <InfoCard label={v_8d41d7('screens.transactionDetails.to')} value={v_5ab5bd.to || '-'} />
          {v_5ab5bd.amount && (
            <InfoCard 
              label={v_8d41d7('screens.transactionDetails.amount')} 
              value={`${v_5ab5bd.amount} ${v_5ab5bd.symbol || ''}`.trim()} 
            />
          )}
          <InfoCard label={v_8d41d7('screens.transactionDetails.time')} value={v_5ab5bd.timestamp || '-'} />
          <InfoCard label={v_8d41d7('screens.transactionDetails.txHash')} value={v_5ab5bd.txHash || '-'} />
        </View>

        <Text style={v_d81136.sectionTitle}>{v_8d41d7('screens.transactionDetails.transactionDetails')}</Text>

        <View style={v_d81136.cardGroup}>
          <InfoCard label={v_8d41d7('screens.transactionDetails.nonce')} value={v_5ab5bd.nonce || '-'} />
          <InfoCard label={v_8d41d7('screens.transactionDetails.gasPrice')} value={v_5ab5bd.gasPrice || '-'} />
          <InfoCard label={v_8d41d7('screens.transactionDetails.usedGas')} value={v_5ab5bd.usedGas || '-'} />
          <InfoCard label={v_8d41d7('screens.transactionDetails.maxGas')} value={v_5ab5bd.maxGas || '-'} />
          <InfoCard label={v_8d41d7('screens.transactionDetails.totalSpent')} value={v_5ab5bd.totalSpent || '-'} />
          <InfoCard label={v_8d41d7('screens.transactionDetails.blockHeight')} value={v_5ab5bd.blockHeight || '-'} />
        </View>

        <ExplorerBadge
          label={v_5ab5bd.title}
          caption={v_5ab5bd.subtitle}
          iconSource={v_17af98}
          style={v_d81136.explorerBadge}
          labelStyle={v_d81136.explorerLabel}
        />
      </SafeScrollView>
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
    ...v_a61db3.container,
  },
  scrollContent: {
    ...v_a61db3.scrollContent,
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
    fontSize: v_843035.size.msmall,
    fontFamily: 'Roboto-Regular',
    color: '#B8B8B8',
  },
  infoValue: {
    fontSize: v_843035.size.medium,
    fontFamily: 'Roboto-Medium',
    color: '#121212',
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: v_843035.size.large,
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
    fontSize: v_843035.size.lsmall,
  },

});

