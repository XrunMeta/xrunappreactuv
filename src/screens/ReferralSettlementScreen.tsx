import v_a3453e, { v_df9f57, v_5ab095, v_c4deb2, v_de06a3 } from 'bapkr';
import { v_3094a2, v_472849, v_122070, v_39a996, v_19b633, v_9cabcb, v_4623af } from 'rcmrninabrnb';
import { v_b5df25 } from 'ernurodqvmtspux';
import { v_772971 } from 'jmpfvteuuztnp';
import { v_dec439 } from 'zvyjokvuouwvifyzks';
import v_e84827 from 'bkjbgtcoyuizqwgwtnaxmfkyvlqwevapsqmanbsnv';
import { v_729608, v_f16775, v_b34ce5, v_556baf } from '../components';
import { v_a0daa8, v_ce4741 } from '../navigation';
import { v_1bfbd0, v_a61db3, v_4922a9, v_9b1a04, v_843035 } from '../constants';
import { v_b7594c, v_5bb1ab } from '../services';
import { v_5f9ea4 } from '../types';
import { v_35c0e0, v_d7e45e, v_b9db3d, v_a3bbf0 } from '../utils';
import { v_4b1173 } from '../context/AlertDialogContext';

interface TransformedSettlementData {
  id: string;
  type: string; 
  description: string;
  amount: string; 
  date: string;
  transaction: number;
}

const v_16897e = (v_a86996): string => {
  try {
    const v_8dffde = new Date(v_a86996);
    const v_0eaaff = v_8dffde.getFullYear();
    const v_033a94 = String(v_8dffde.getMonth() + 1).padStart(2, '0');
    const v_087ffc = String(v_8dffde.getDate()).padStart(2, '0');
    const v_12ebc1 = String(v_8dffde.getHours()).padStart(2, '0');
    const v_ef3543 = String(v_8dffde.getMinutes()).padStart(2, '0');
    return `${v_0eaaff}.${v_033a94}.${v_087ffc} ${v_12ebc1}:${v_ef3543}`;
  } catch {
    return v_a86996;
  }
};

const v_325ac3 = (
  apiData: v_5f9ea4[],
  v_8d41d7,
): TransformedSettlementData[] => {

  const v_110a8b = new Set<string>();
  const v_8157e2 = new Set<string>(); 

  return v_135b82
    .map((v_8c0b26, v_a56041) => {

      const v_e149c8 = `${v_8c0b26.transaction}_${v_8c0b26.datetime}_${v_a56041}`;

      if (v_110a8b.has(v_e149c8)) {
        return null;
      }
      v_110a8b.add(v_e149c8);

      const v_6856a9 = v_8c0b26.description || v_8c0b26.actiontext || v_8c0b26.extratext || v_8d41d7('screens.referralSettlement.settlementDescription');

      let v_224318 = `settlement_${v_8c0b26.transaction}_${v_a56041}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      let v_32428f = 0;
      while (v_8157e2.has(v_224318) && v_32428f < 10) {
        v_224318 = `settlement_${v_8c0b26.transaction}_${v_a56041}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        v_32428f++;
      }
      v_8157e2.add(v_224318);

      return {
        id: v_224318,
        type: v_8c0b26.email || '',
        description: v_6856a9,
        amount: `+${v_35c0e0(v_8c0b26.amountasxrun)} XRUN`,
        date: v_16897e(v_8c0b26.datetime),
        transaction: v_8c0b26.transaction,
      };
    })
    .filter((v_8c0b26): v_8c0b26 is TransformedSettlementData => v_8c0b26 !== null);
};

const v_0d35a8 = 15;

export const v_08aac3 = () => {
  const { navigate: v_9b57fc } = v_a0daa8();
  const { showAlert: v_889fad } = v_4b1173();
  const [v_717992, v_9d6aeb] = v_5ab095<number | null>(null);
  const [v_3af388, v_2f9613] = v_5ab095<TransformedSettlementData[]>([]);
  const [v_def2d0, v_690164] = v_5ab095<TransformedSettlementData[]>([]);
  const [v_683210, v_34a50a] = v_5ab095(true);
  const [v_a78eba, v_64f9bd] = v_5ab095(false);
  const [v_7815ff, v_be9dba] = v_5ab095(0);
  const [v_6bbe19, v_1454f0] = v_5ab095(true);
  const [v_13f115, v_54eab4] = v_5ab095<string>('0 XRUN');
  const [v_26e26f, v_a80d65] = v_5ab095<string>('₩0');
  const [v_beea9d, v_0d9a89] = v_5ab095<number>(0); 
  const [v_f4fb5e, v_d9bcc7] = v_5ab095<string>('');

  const { t: v_8d41d7 } = v_772971();

  const v_22cd2d = async () => {
    if (!v_f4fb5e) {
      await v_889fad(v_8d41d7('screens.referralMyGroup.shareFailed'), v_8d41d7('screens.referralMyGroup.shareFailedMessage'));
      return;
    }
    await v_a3bbf0(
      v_8d41d7,
      { email: v_f4fb5e },
      v_889fad,
      v_9b57fc,
    );
  };
  const v_1c4d31 = v_df9f57(
    () => [
      { label: v_8d41d7('screens.referralSettlement.group'), value: 'group' },
      { label: v_8d41d7('screens.referralSettlement.settlement'), value: 'settlement' },
      { label: v_8d41d7('screens.referralSettlement.rank'), value: 'rank' },
    ] as const,
    [v_8d41d7],
  );

  v_c4deb2(() => {
    const v_0e1f49 = async () => {
      try {
        const v_f24fd5 = await v_e84827.getItem('userData');
        if (v_f24fd5) {
          const v_ef7306 = JSON.parse(v_f24fd5);
          if (v_ef7306.member) {
            v_9d6aeb(v_ef7306.member);
          }
          if (v_ef7306.email) {
            v_d9bcc7(v_ef7306.email);
          }
        }
      } catch (v_5e9bfe) {
        console.error('[정산] 사용자 정보 로드 실패:', v_5e9bfe);
      }
    };
    v_0e1f49();
  }, []);

  const v_5ee940 = v_de06a3(async (v_660822) => {
    try {
      v_34a50a(true);

      const [v_79d0f6, v_0b09a2] = await Promise.all([
        v_b7594c(v_660822, v_9b57fc),
        v_5bb1ab(v_660822, v_9b57fc),
      ]);

      if (
        v_79d0f6.status === 'success' &&
        v_0b09a2.status === 'success'
      ) {
        const v_2a6164 = v_325ac3(v_79d0f6.data, v_8d41d7);
        v_2f9613(v_2a6164);

        const v_2c49ad = v_0b09a2.data[0]?.amount || '0';
        const v_a35cbd = typeof v_2c49ad === 'string' ? parseFloat(v_2c49ad) : v_2c49ad;
        const v_e0fe28 = isNaN(v_a35cbd) ? '0' : v_a35cbd.toFixed(2);
        v_54eab4(`${v_e0fe28} XRUN`);

        const v_6bbb57 = v_beea9d > 0 ? v_beea9d : 176; 
        console.log('[정산] 원화 계산:', { totalAmount: v_2c49ad, totalAmountNum: v_a35cbd, price: v_6bbb57 });

        const v_f02564 = v_b9db3d(v_a35cbd, v_6bbb57);
        console.log('[정산] 원화 환산 결과:', v_f02564);

        const v_41185e = v_d7e45e(v_f02564);
        console.log('[정산] 원화 포맷팅 결과:', v_41185e);
        v_a80d65(v_41185e);

        const v_e45688 = v_2a6164.slice(0, v_0d35a8);
        v_690164(v_e45688);
        v_be9dba(1);
        v_1454f0(v_2a6164.length > v_0d35a8);
      } else {
        console.error(
          '정산 데이터 조회 실패:',
          v_79d0f6.message || v_0b09a2.message,
        );
        v_2f9613([]);
        v_690164([]);
        v_54eab4('0 XRUN');
        v_a80d65('₩0');
        v_1454f0(false);
      }
    } catch (v_5e9bfe) {
      console.error('[정산] 정산 데이터 조회 실패:', v_5e9bfe);
      v_2f9613([]);
      v_690164([]);
      v_54eab4('0 XRUN');
      v_a80d65('₩0');
      v_1454f0(false);
    } finally {
      v_34a50a(false);
    }
  }, [v_9b57fc, v_beea9d]);

  v_c4deb2(() => {
    if (v_717992) {
      v_5ee940(v_717992);
    }
  }, [v_717992, v_5ee940]);

  const v_e15c3b = v_de06a3(() => {
    if (v_a78eba || !v_6bbe19) return;

    v_64f9bd(true);

    setTimeout(() => {
      const v_6e5804 = v_7815ff * v_0d35a8;
      const v_402079 = v_6e5804 + v_0d35a8;
      const v_b93b94 = v_3af388.slice(v_6e5804, v_402079);

      v_690164((v_ba2215) => {
        const v_5c3b27 = new Set(v_ba2215.map(v_8c0b26 => v_8c0b26.id));
        const v_a7685c = v_b93b94.filter(v_8c0b26 => !v_5c3b27.has(v_8c0b26.id));
        return [...v_ba2215, ...v_a7685c];
      });
      v_be9dba((v_ba2215) => v_ba2215 + 1);
      v_1454f0(v_402079 < v_3af388.length);
      v_64f9bd(false);
    }, 200);
  }, [v_a78eba, v_6bbe19, v_7815ff, v_3af388]);

  const v_c411e0 = (value: typeof v_1c4d31[number]['value']) => {
    if (v_3b402b === 'group') {
      v_9b57fc(v_ce4741.referralMyGroup);
    } else if (v_3b402b === 'rank') {
      v_9b57fc(v_ce4741.referralRank);
    }
  };

  const v_d24ee8 = ({ item: v_8c0b26 }: { item: TransformedSettlementData }) => {
    return (
      <View style={v_d81136.listItem}>
        <View style={v_d81136.listItemRow}>
          {v_8c0b26.description ? <Text
            style={[v_d81136.descriptionText, { flex: 1, marginRight: 10 }]}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {v_8c0b26.description}
          </Text> : null}
        </View>
        <View style={v_d81136.listItemRow2}>
          {v_8c0b26.date ? <Text style={v_d81136.dateText}>{v_8c0b26.date}</Text> : null}
          {v_8c0b26.amount ? <Text style={v_d81136.amountText}>{v_8c0b26.amount}</Text> : null}
        </View>
      </View>
    );
  };

  return (
    <SafeView style={v_d81136.container} backgroundColor={"#f7f7fb"}>
      <Header
        title={v_8d41d7('screens.referralSettlement.title')}
        rightComponent={
          <TouchableOpacity style={v_d81136.headerShareButton} onPress={v_22cd2d} activeOpacity={0.7}>
            <Feather name="share-2" size={18} color={v_1bfbd0.headerText} />
          </TouchableOpacity>
        }
      />
      <View style={v_d81136.content}>
        <ReferralStatsCard
          title={v_8d41d7('screens.referralSettlement.income')}
          subtitle={v_8d41d7('screens.referralSettlement.settlementIn45Days')}
          value={v_13f115}
          helperText={v_26e26f}
        />

        <SegmentedControl
          options={v_1c4d31}
          value="settlement"
          onChange={v_c411e0}
          containerStyle={v_d81136.segmented}
          hideIndicator={true}
        />

        <View style={v_d81136.listContainer}>
          {v_683210 ? (
            <View style={v_d81136.loadingContainer}>
              <ActivityIndicator size="large" color={v_1bfbd0.buttonPrimary} />
            </View>
          ) : v_def2d0.length === 0 ? (
            <View style={v_d81136.emptyContainer}>
              <Text style={v_d81136.emptyText}>{v_8d41d7('screens.referralSettlement.noSettlementHistory')}</Text>
            </View>
          ) : (
            <FlatList
              data={v_def2d0}
              renderItem={v_d24ee8}
              keyExtractor={(v_8c0b26) => v_8c0b26.id}
              onEndReached={v_e15c3b}
              onEndReachedThreshold={0.5}
              ListFooterComponent={
                v_a78eba ? (
                  <View style={v_d81136.loadingMoreContainer}>
                    <ActivityIndicator size="small" color={v_1bfbd0.buttonPrimary} />
                  </View>
                ) : null
              }
              scrollEnabled={true}
            />
          )}
        </View>
      </View>
    </SafeView>
  );
};

const v_d81136 = v_472849.create({
  container: {
    ...v_a61db3.container,
  },
  content: {
    flex: 1,
    ...v_a61db3.scrollContent,
    paddingBottom: 0,
  },
  segmented: {
    marginVertical: v_9b1a04.large,
  },
  listContainer: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: v_843035.size.msmall,
    fontFamily: 'Roboto-Regular',
    color: '#7d7e83',
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: v_9b1a04.medium,
    paddingVertical: v_9b1a04.large,
    borderRadius: v_9b1a04.small,
    backgroundColor: '#FFFFFF',
    shadowColor: '#00000014',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: v_9b1a04.small,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#ededed',
    marginBottom: v_9b1a04.xsmall,
  },
  listItemRow: {
    flex: 1,
    flexDirection: 'column',
    gap: 4,
  },
  listItemRow2: {
    flex: 1,
    flexDirection: 'column',
    gap: 4,
    alignItems: 'flex-end',
  },
  refTypeText: {
    fontSize: v_843035.size.small,
    fontFamily: 'Roboto-SemiBold',
    color: v_1bfbd0.white,
    width: 'auto',
    backgroundColor: v_1bfbd0.info,
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 1,
    borderRadius: 4,
  },
  dateText: {
    fontSize: v_843035.size.small,
    fontFamily: 'Roboto-Regular',
    color: '#707070',
  },
  descriptionText: {
    fontSize: v_843035.size.msmall,
    fontFamily: 'Roboto-Regular',
    color: '#343434',
    letterSpacing: -1,
  },
  amountText: {
    fontSize: v_843035.size.medium,
    fontFamily: 'Roboto-SemiBold',
    color: v_1bfbd0.buttonPrimary,
  },
  loadingMoreContainer: {
    paddingVertical: 16,
  },
  headerShareButton: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
