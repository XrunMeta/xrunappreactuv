import v_a3453e, { v_df9f57, v_5ab095, v_c4deb2, v_de06a3 } from 'bapkr';
import { v_3094a2, v_472849, v_122070, v_19b633, v_39a996, v_9cabcb, v_4623af, v_cf9c33, v_6c4f62 } from 'rcmrninabrnb';
import { v_b5df25 } from 'ernurodqvmtspux';
import { v_772971 } from 'jmpfvteuuztnp';
import { v_dec439 } from 'zvyjokvuouwvifyzks';
import v_e84827 from 'bkjbgtcoyuizqwgwtnaxmfkyvlqwevapsqmanbsnv';
import { v_729608, v_814266, v_f16775, v_b34ce5, v_556baf } from '../components';
import { v_ce4741, v_a0daa8 } from '../navigation';
import { v_1bfbd0, v_a61db3, v_4922a9, v_9b1a04, v_843035 } from '../constants';
import { v_4a38fa, v_6a034c } from '../services';
import { v_1cc79a } from '../types';
import { v_a3bbf0, v_8cf86b } from '../utils';
import { v_4b1173 } from '../context/AlertDialogContext';

interface TransformedRankData {
  id: string;
  email: string;
  rank: number;
  member: number;
  referralCount: number;
}

const v_8b80b2 = (apiData: v_1cc79a[]): TransformedRankData[] => {
  return v_135b82.map((v_8c0b26, v_a56041) => ({
    id: `rank_${v_8c0b26.referrer_id}_${v_a56041}`,
    email: v_8cf86b(v_8c0b26.referrer_email), 
    rank: v_8c0b26.unique_rank,
    member: v_8c0b26.referrer_id,
    referralCount: v_8c0b26.referral_count,
  }));
};

const v_0d35a8 = 15;

export const v_f57686 = () => {
  const { navigate: v_9b57fc } = v_a0daa8();
  const { showAlert: v_889fad } = v_4b1173();
  const [v_717992, v_9d6aeb] = v_5ab095<number | null>(null);
  const [v_7c3743, v_883d57] = v_5ab095<TransformedRankData[]>([]);
  const [v_def2d0, v_690164] = v_5ab095<TransformedRankData[]>([]);
  const [v_683210, v_34a50a] = v_5ab095(true);
  const [v_a78eba, v_64f9bd] = v_5ab095(false);
  const [v_7815ff, v_be9dba] = v_5ab095(0);
  const [v_6bbe19, v_1454f0] = v_5ab095(true);
  const [v_ad21d1, v_dadb82] = v_5ab095<string>('-');
  const [v_f4fb5e, v_d9bcc7] = v_5ab095<string>('-');

  const { t: v_8d41d7 } = v_772971();

  const v_22cd2d = async () => {
    if (!v_f4fb5e || v_f4fb5e === '-') {
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
      { label: v_8d41d7('screens.referralRank.group'), value: 'group' },
      { label: v_8d41d7('screens.referralRank.settlement'), value: 'settlement' },
      { label: v_8d41d7('screens.referralRank.rank'), value: 'rank' },
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
        console.error('[Rank] 사용자 정보 로드 실패:', v_5e9bfe);
      }
    };
    v_0e1f49();
  }, []);

  const v_b53487 = v_de06a3(async (v_660822) => {
    try {
      v_34a50a(true);

      const [v_c3d24b, v_209f2c] = await Promise.all([
        v_4a38fa(v_660822, v_9b57fc),
        v_6a034c(v_660822, v_9b57fc),
      ]);

      if (v_c3d24b.status === 'success') {
        const v_2a6164 = v_8b80b2(v_c3d24b.data);
        console.log('[Rank] 변환된 데이터 개수:', v_2a6164.length);
        console.log('[Rank] 원본 API 데이터 개수:', v_c3d24b.data?.length || 0);
        v_883d57(v_2a6164);

        const v_e45688 = v_2a6164.slice(0, v_0d35a8);
        v_690164(v_e45688);
        v_be9dba(1);
        v_1454f0(v_2a6164.length > v_0d35a8);
        console.log('[Rank] 페이지네이션 설정:', {
          totalItems: v_2a6164.length,
          initialItems: v_e45688.length,
          hasMore: v_2a6164.length > v_0d35a8,
        });
      } else {
        console.error('[Rank] 전체 순위 조회 실패:', v_c3d24b.message);
        v_883d57([]);
        v_690164([]);
        v_1454f0(false);
      }

      if (v_209f2c.status === 'success' && v_209f2c.data && v_209f2c.data[0]) {
        const v_d8f6c4 = v_209f2c.data[0].unique_rank;
        v_dadb82(v_d8f6c4 ? String(v_d8f6c4) : '-');
      } else {
        v_dadb82('-');
      }
    } catch (v_5e9bfe) {
      console.error('[Rank] Rank 데이터 조회 실패:', v_5e9bfe);
      v_883d57([]);
      v_690164([]);
      v_dadb82('-');
      v_1454f0(false);
    } finally {
      v_34a50a(false);
    }
  }, [v_9b57fc]);

  v_c4deb2(() => {
    if (v_717992) {
      v_b53487(v_717992);
    }
  }, [v_717992, v_b53487]);

  const v_e15c3b = v_de06a3(() => {
    if (v_a78eba || !v_6bbe19) {
      console.log('[Rank] 페이지네이션 중단:', { isLoadingMore: v_a78eba, hasMore: v_6bbe19 });
      return;
    }

    v_64f9bd(true);

    setTimeout(() => {

      v_690164((v_ba2215) => {
        const v_375fda = v_ba2215.length;
        const v_6e5804 = v_375fda;
        const v_402079 = Math.min(v_6e5804 + v_0d35a8, v_7c3743.length);

        if (v_6e5804 >= v_7c3743.length) {
          console.log('[Rank] 더 이상 로드할 데이터 없음:', { startIndex: v_6e5804, totalData: v_7c3743.length });
          v_1454f0(false);
          v_64f9bd(false);
          return v_ba2215;
        }

        const v_b93b94 = v_7c3743.slice(v_6e5804, v_402079);

        console.log('[Rank] 페이지네이션 로드:', {
          currentCount: v_375fda,
          startIndex: v_6e5804,
          endIndex: v_402079,
          totalData: v_7c3743.length,
          newItemsCount: v_b93b94.length,
          hasMore: v_402079 < v_7c3743.length,
        });

        const v_5c3b27 = new Set(v_ba2215.map((v_8c0b26) => v_8c0b26.id));
        const v_a7685c = v_b93b94.filter((v_8c0b26) => !v_5c3b27.has(v_8c0b26.id));
        console.log('[Rank] 현재 표시 중인 데이터 개수:', v_ba2215.length);
        console.log('[Rank] 추가될 데이터 개수:', v_a7685c.length);
        const v_4d73f0 = [...v_ba2215, ...v_a7685c];
        console.log('[Rank] 최종 데이터 개수:', v_4d73f0.length);

        v_1454f0(v_402079 < v_7c3743.length);
        v_be9dba((v_fdb2cd) => v_fdb2cd + 1);
        v_64f9bd(false);

        return v_4d73f0;
      });
    }, 200);
  }, [v_a78eba, v_6bbe19, v_7c3743]);

  const v_c411e0 = (value: typeof v_1c4d31[number]['value']) => {
    if (v_3b402b === 'group') {
      v_9b57fc(v_ce4741.referralMyGroup);
    } else if (v_3b402b === 'settlement') {
      v_9b57fc(v_ce4741.referralSettlement);
    }
  };

  const v_be1ec5 = ({ item: v_8c0b26, index: v_a56041 }: { item: TransformedRankData; index: number }) => {

    const v_06c228 = v_717992 !== null && v_8c0b26.member === v_717992 && String(v_8c0b26.rank) === v_ad21d1;

    const v_2f2afb = typeof v_8c0b26.rank === 'number'
      ? Number(v_8c0b26.rank.toFixed(2))
      : v_8c0b26.rank;

    return (
      <ReferralMemberRow
        key={v_8c0b26.id}
        rank={v_2f2afb}
        email={v_8c0b26.email} 
        highlight={v_06c228} 
      />
    );
  };

  return (
    <SafeView style={v_d81136.container}
      showBottomBackground={true}
      backgroundColor={"#f7f7fb"}>
      <Header
        title={v_8d41d7('screens.referralRank.title')}
        rightComponent={
          <TouchableOpacity style={v_d81136.headerShareButton} onPress={v_22cd2d} activeOpacity={0.7}>
            <Feather name="share-2" size={18} color={v_1bfbd0.headerText} />
            <Text style={v_d81136.headerShareText}>{v_8d41d7('screens.referralRank.referralLabel')}</Text>
          </TouchableOpacity>
        }
      />
      <View style={v_d81136.content}>
        <ReferralStatsCard title="">
          <View style={v_d81136.rankCardContent}>
            <View style={v_d81136.rankLeft}>
              <Text style={v_d81136.rankHelper}>{v_8d41d7('screens.referralRank.myRank')}</Text>
              <Text style={v_d81136.rankEmail} numberOfLines={1} ellipsizeMode="tail">
                {v_f4fb5e}
              </Text>
            </View>
            <View style={v_d81136.rankDivider} />
            <View style={v_d81136.rankRight}>
              <Text style={v_d81136.rankValue}>
                {v_ad21d1 !== '-'
                  ? Number(v_ad21d1).toLocaleString('ko-KR', {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 2
                  })
                  : v_ad21d1}
              </Text>
            </View>
          </View>
        </ReferralStatsCard>

        <SegmentedControl
          options={v_1c4d31}
          value="rank"
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
              <Text style={v_d81136.emptyText}>{v_8d41d7('screens.referralRank.noRankData')}</Text>
            </View>
          ) : (
            <FlatList
              data={v_def2d0}
              renderItem={v_be1ec5}
              keyExtractor={(v_8c0b26) => v_8c0b26.id}
              onEndReached={v_e15c3b}
              onEndReachedThreshold={0.5}
              refreshControl={
                <RefreshControl
                  refreshing={false}
                  onRefresh={() => { if (v_717992) v_b53487(v_717992); }}
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
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: v_843035.size.msmall,
    fontFamily: 'Roboto-Regular',
    color: '#7d7e83',
  },
  list: {
    width: '100%',
  },
  rankCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 0,
    flex: 1,
    justifyContent: 'center',
    paddingTop: 0,
  },
  rankLeft: {
    flex: 1,
    justifyContent: 'center',
    minHeight: 20,
  },
  rankHelper: {
    fontSize: v_843035.size.medium,
    color: '#d2edf4',
    fontFamily: 'Roboto-Bold',
    marginBottom: 4,
    lineHeight: 20,
  },
  rankEmail: {
    fontSize: v_843035.size.mmedium,
    fontFamily: 'Roboto-Bold',
    color: '#ffffff',
    lineHeight: 22,
  },
  rankDivider: {
    width: 1,
    height: 48,
    backgroundColor: 'rgba(255,255,255,0.4)',
    marginHorizontal: 20,
  },
  rankRight: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  rankValue: {
    fontSize: v_843035.size.xxxlarge,
    color: '#ffffff',
    fontFamily: 'Roboto-Bold',
  },
  loadingMoreContainer: {
    paddingVertical: 16,
    alignItems: 'center',
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
