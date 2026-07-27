import v_a3453e, { v_df9f57, v_5ab095, v_c4deb2, v_de06a3 } from 'bapkr';
import { v_3094a2, v_472849, v_122070, v_39a996, v_19b633, v_9cabcb, v_4623af, v_cf9c33, v_6c4f62 } from 'rcmrninabrnb';
import { v_b5df25 } from 'ernurodqvmtspux';
import { v_772971 } from 'jmpfvteuuztnp';
import { v_dec439 } from 'zvyjokvuouwvifyzks';
import v_e84827 from 'bkjbgtcoyuizqwgwtnaxmfkyvlqwevapsqmanbsnv';
import { v_729608, v_f16775, v_b34ce5, v_556baf } from '../components';
import { v_a0daa8, v_ce4741 } from '../navigation';
import { v_1bfbd0, v_a61db3, v_4922a9, v_9b1a04, v_843035 } from '../constants';
import { v_2dc778, v_dd87bc } from '../services';
import type { v_cc1705, v_55701f } from '../services';
import { v_ca58e0, v_7ac54c } from '../services/referralSettlementCache';
import { v_5f9ea4 } from '../types';
import { v_35c0e0, v_d7e45e, v_b9db3d, v_a3bbf0 } from '../utils';
import { v_2396c3 } from '../utils/formatAmount';
import { v_4b1173 } from '../context/AlertDialogContext';

interface TransformedSettlementData {
  id: string;
  type: string; 
  description: string;
  amount: string; 
  date: string;
  transaction: number;
  status?: 'pending' | 'sent' | string; 
  fromName?: string | null; 
}

const v_464f82 = {
  nas: 'source_nas',
  nasmedia: 'source_nas',
  pocr: 'source_pocr',
  pointclick: 'source_pocr',
  ayet: 'source_xplay_zone1',
  maf: 'source_xplay_zone2',
  mychips: 'source_xplay_zone2',
  recommand: 'source_recommend',
  attendance: 'source_attendance',
};

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
        amount: `+${v_2396c3(v_8c0b26.amountasxrun, 2)} XRUN`,
        date: v_16897e(v_8c0b26.datetime),
        transaction: v_8c0b26.transaction,
      };
    })
    .filter((v_8c0b26): v_8c0b26 is TransformedSettlementData => v_8c0b26 !== null);
};

const v_0d35a8 = 15;

export const v_08aac3 = () => {
  const { navigate: v_9b57fc, replace: v_fc039d } = v_a0daa8();
  const { showAlert: v_889fad } = v_4b1173();
  const [v_717992, v_9d6aeb] = v_5ab095<number | null>(null);
  const [v_3af388, v_2f9613] = v_5ab095<TransformedSettlementData[]>([]);
  const [v_def2d0, v_690164] = v_5ab095<TransformedSettlementData[]>([]);

  const [v_683210, v_34a50a] = v_5ab095(false);
  const [v_a78eba, v_64f9bd] = v_5ab095(false);
  const [v_7815ff, v_be9dba] = v_5ab095(0);
  const [v_6bbe19, v_1454f0] = v_5ab095(true);
  const [v_13f115, v_54eab4] = v_5ab095<string>('0 XRUN');
  const [v_26e26f, v_a80d65] = v_5ab095<string>('₩0');
  const [v_beea9d, v_0d9a89] = v_5ab095<number>(0); 

  v_c4deb2(() => {
    (async () => {
      try {
        const v_43c42e = await v_dd87bc();
        const v_6bbb57 = Number(v_43c42e?.data?.gopaxPrice ?? 0);
        if (v_6bbb57 > 0) {
          v_0d9a89(v_6bbb57);
          await v_e84827.setItem('xrungopaxprice', JSON.stringify(v_43c42e));
          return;
        }
      } catch (v_9e86fd) {
        console.warn('[정산] 고팍스 가격 API 실패, AsyncStorage fallback:', v_9e86fd);
      }
      try {
        const v_e2a6a6 = await v_e84827.getItem('xrungopaxprice');
        if (v_e2a6a6) {
          const v_9390e8 = JSON.parse(v_e2a6a6);
          const v_e2a85c = Number(v_9390e8?.data?.gopaxPrice ?? 0);
          if (v_e2a85c > 0) v_0d9a89(v_e2a85c);
        }
      } catch {  }
    })();
  }, []);
  const [v_f4fb5e, v_d9bcc7] = v_5ab095<string>('');

  const { t: v_8d41d7 } = v_772971();

  const v_22cd2d = async () => {
    if (!v_f4fb5e) {
      await v_889fad(v_8d41d7('screens.referralMyGroup.shareFailed'), v_8d41d7('screens.referralMyGroup.shareFailedMessage'));
      return;
    }
    await v_a3bbf0(
      v_8d41d7,
      { email: v_f4fb5e, member: v_717992 ?? undefined },
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

  const v_5ee940 = v_de06a3(async (v_660822, prefetchedResponse?: v_55701f, v_669bef) => {
    try {

      if (!v_f08231 && !v_669bef) v_34a50a(true);

      console.log('═══════════════════════════════════════════');
      console.log('[정산 디버그] fetchSettlementData 시작, member:', v_660822, v_f08231 ? '(캐시 사용)' : '(API 호출)');
      console.log('═══════════════════════════════════════════');

      const v_11b884 = v_f08231 ?? await v_2dc778(v_660822, v_9b57fc);

      console.log('[정산 디버그] 백엔드 응답 status:', v_11b884.status);
      console.log('[정산 디버그] 백엔드 응답 message:', v_11b884.message);
      console.log('[정산 디버그] 백엔드 응답 data 개수:', v_11b884.data?.length ?? 0);
      if (v_11b884.data && v_11b884.data.length > 0) {
        console.log('[정산 디버그] 첫 행 샘플:', JSON.stringify(v_11b884.data[0], null, 2));
        console.log('[정산 디버그] source_type 분포:', v_11b884.data.reduce((v_9f1d92, v_8c0b26) => {
          const v_fd5f43 = v_8c0b26.source_type ?? 'NULL';
          v_9f1d92[v_fd5f43] = (v_9f1d92[v_fd5f43] || 0) + 1;
          return v_9f1d92;
        }, {}));
        console.log('[정산 디버그] status 분포:', v_11b884.data.reduce((v_9f1d92, v_8c0b26) => {
          const v_fd5f43 = v_8c0b26.status ?? 'NULL';
          v_9f1d92[v_fd5f43] = (v_9f1d92[v_fd5f43] || 0) + 1;
          return v_9f1d92;
        }, {}));
        console.log('[정산 디버그] xrun_amount 합계 (Number 변환 전):',
          v_11b884.data.reduce((v_dce0a8, v_8c0b26) => v_dce0a8 + (Number(v_8c0b26.xrun_amount) || 0), 0));
      } else {
        console.log('[정산 디버그] ⚠️ 백엔드 응답 data 가 비어있음');
      }

      if (v_11b884.status === 'success') {

        const v_18b8bf = (v_11b884.data || []).map((item: v_cc1705, v_e86ad8) => {

          const v_35fa84 = v_464f82[v_8c0b26.source_type];
          const v_2869c1 = v_35fa84
            ? v_8d41d7(`screens.referralSettlement.${v_35fa84}`)
            : (v_8c0b26.source_type || v_8d41d7('screens.referralSettlement.source_referral_share'));
          return {
            id: `ref_${v_8c0b26.id}_${v_e86ad8}`,
            type: v_2869c1,
            description: v_2869c1,
            amount: `${(Number(v_8c0b26.xrun_amount) || 0).toFixed(3).replace(/\.?0+$/, '') || '0'} XRUN`,
            date: v_16897e(v_8c0b26.created_at),
            transaction: v_8c0b26.id,
            status: v_8c0b26.status,
            fromName: v_8c0b26.from_name || (v_8c0b26.from_member ? `#${v_8c0b26.from_member}` : null),
          };
        });
        console.log('[정산 디버그] 변환된 rows 개수:', v_18b8bf.length);
        if (v_18b8bf.length > 0) console.log('[정산 디버그] 변환 첫 행:', JSON.stringify(v_18b8bf[0], null, 2));
        v_2f9613(v_18b8bf);

        const v_a35cbd = (v_11b884.data || []).reduce(
          (v_dce0a8, item: v_cc1705) => v_dce0a8 + (Number(v_8c0b26.xrun_amount) || 0),
          0
        );
        const v_e0fe28 = v_2396c3(v_a35cbd, 2);
        v_54eab4(`${v_e0fe28} XRUN`);

        let v_41185e = '';
        if (v_beea9d && v_beea9d > 0) {
          const v_f02564 = v_b9db3d(v_a35cbd, v_beea9d);
          v_41185e = v_d7e45e(v_f02564);
          console.log('[정산] 원화 환산:', { totalAmountNum: v_a35cbd, price: v_beea9d, formattedWon: v_41185e });
        }
        v_a80d65(v_41185e);

        const v_e45688 = v_18b8bf.slice(0, v_0d35a8);
        v_690164(v_e45688);
        v_be9dba(1);
        v_1454f0(v_18b8bf.length > v_0d35a8);
        console.log('[정산 디버그] ✅ 화면 표시 완료 — 총',
          v_e0fe28, 'XRUN /', v_18b8bf.length, '건 /', v_41185e);
        console.log('═══════════════════════════════════════════');
      } else {
        console.error('[정산 디버그] ❌ 백엔드 status !== success — message:', v_11b884.message);
        v_2f9613([]);
        v_690164([]);
        v_54eab4('0 XRUN');
        v_a80d65('₩0');
        v_1454f0(false);
      }
    } catch (v_5e9bfe) {
      console.error('[정산 디버그] ❌ 예외 발생');
      console.error('  message:', v_5e9bfe?.message);
      console.error('  response status:', v_5e9bfe?.response?.status);
      console.error('  response data:', JSON.stringify(v_5e9bfe?.response?.data ?? null));
      console.error('  stack:', v_5e9bfe?.stack);
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
    if (!v_717992) return;
    const v_e2a6a6 = v_ca58e0(v_717992);
    if (v_e2a6a6) {
      v_5ee940(v_717992, v_e2a6a6);
      setTimeout(() => { v_5ee940(v_717992, undefined, true); }, 0);
      return;
    }
    const v_d7fc78 = v_7ac54c(v_717992);
    if (v_d7fc78) {

      v_34a50a(true);
      v_d7fc78.then((v_9390e8) => {
        if (v_9390e8) v_5ee940(v_717992, v_9390e8);
        else v_5ee940(v_717992); 
      });
      return;
    }
    v_5ee940(v_717992);
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
      v_fc039d(v_ce4741.referralMyGroup);
    } else if (v_3b402b === 'rank') {
      v_fc039d(v_ce4741.referralRank);
    }
  };

  const v_d24ee8 = ({ item: v_8c0b26 }: { item: TransformedSettlementData }) => {
    const v_619bad = v_8c0b26.status === 'sent';
    const v_3fd4b5 = v_619bad
      ? (v_8d41d7('screens.referralSettlement.paid') || '지급 완료')
      : (v_8d41d7('screens.referralSettlement.pending') || '지급 대기');
    const v_18d53e = v_8c0b26.fromName ? v_8d41d7('screens.referralSettlement.fromUserRevenue', { name: v_8c0b26.fromName }) : null;
    return (
      <View style={[v_d81136.questCard, v_619bad && v_d81136.questCardPaid]}>
        <View style={[v_d81136.questBadge, v_619bad ? v_d81136.statusPaid : v_d81136.statusPending]}>
          <Text style={[v_d81136.questBadgeText, v_619bad ? v_d81136.statusPaidText : v_d81136.statusPendingText]}>
            {v_3fd4b5}
          </Text>
        </View>
        <Text style={[v_d81136.questTitle, v_619bad && v_d81136.textPaid]} numberOfLines={2}>
          {v_8c0b26.description}
        </Text>
        {(v_18d53e || v_8c0b26.date) ? (
          <Text style={[v_d81136.questSub, v_619bad && v_d81136.textPaidSub]} numberOfLines={2}>
            {v_18d53e}
            {v_18d53e && v_8c0b26.date ? '\n' : ''}
            {v_8c0b26.date}
          </Text>
        ) : null}
        <View style={v_d81136.questDivider} />
        <View style={v_d81136.questFooter}>
          <Text style={[v_d81136.questFooterLabel, v_619bad && v_d81136.textPaidSub]}>{v_8d41d7('screens.referralSettlement.rewardAmount')}</Text>
          <Text style={[v_d81136.questAmount, v_619bad && v_d81136.textPaid]}>{v_8c0b26.amount}</Text>
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
            <Text style={v_d81136.headerShareText}>{v_8d41d7('screens.referralSettlement.referralLabel')}</Text>
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
              refreshControl={
                <RefreshControl
                  refreshing={false}
                  onRefresh={() => { if (v_717992) v_5ee940(v_717992); }}
                />
              }
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

  questCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#eaeaef',
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 10,
    shadowColor: '#00000010',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  questCardPaid: {
    opacity: 0.65,
  },
  questBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    marginBottom: 10,
  },
  questBadgeText: {
    fontSize: 11,
    fontFamily: 'Roboto-Bold',
    letterSpacing: -0.3,
  },
  questTitle: {
    fontSize: 15,
    fontFamily: 'Roboto-Bold',
    color: '#1a1a1a',
    letterSpacing: -0.5,
    marginBottom: 6,
  },
  questSub: {
    fontSize: 12,
    fontFamily: 'Roboto-Regular',
    color: '#8a8a8f',
    lineHeight: 17,
    letterSpacing: -0.3,
  },
  questDivider: {
    height: 1,
    backgroundColor: '#f1f1f4',
    marginTop: 12,
    marginBottom: 12,
  },
  questFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  questFooterLabel: {
    fontSize: 12,
    fontFamily: 'Roboto-Regular',
    color: '#8a8a8f',
  },
  questAmount: {
    fontSize: 16,
    fontFamily: 'Roboto-Bold',
    color: '#1a1a1a',
    letterSpacing: -0.3,
  },
  textPaid: {
    color: '#b5b5b8',
  },
  textPaidSub: {
    color: '#c8c8cc',
  },
  statusPaid: {
    backgroundColor: '#eeeeee',
  },
  statusPending: {
    backgroundColor: '#e6efff',
  },
  statusPaidText: {
    color: '#9a9a9a',
  },
  statusPendingText: {
    color: '#3060d8',
  },
  loadingMoreContainer: {
    paddingVertical: 16,
  },
  headerShareButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerShareText: {
    marginTop: 2,
    fontSize: v_843035.size.xxsmall,
    fontFamily: 'Roboto-Medium',
    color: v_1bfbd0.headerText,
    lineHeight: 12,
  },
});
