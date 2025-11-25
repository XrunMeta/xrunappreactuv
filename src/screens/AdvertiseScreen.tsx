import v_a3453e, { v_5ab095, v_c4deb2, v_de06a3 } from 'bapkr';
import {
  v_3094a2,
  v_19b633,
  v_472849,
  v_122070,
  v_9cabcb,
  v_39a996,
  v_6c4f62,
} from 'rcmrninabrnb';
import { v_b5df25 } from 'ernurodqvmtspux';
import v_e84827 from 'bkjbgtcoyuizqwgwtnaxmfkyvlqwevapsqmanbsnv';
import { v_729608 } from '../components';
import { v_1bfbd0 } from '../constants';
import { v_a0daa8 } from '../navigation';
import { v_f4cc2d, v_010f9a } from '../services';
import { v_574252 } from '../types';

interface CompletedAdData {
  transaction: string | number;
  title: string;
  coin: string;
  extracode: string | number;
  datetime: string;
  statusSuccess: string;
  statusPending: string;
}

const v_fe0253 = (v_a86996): string => {
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

export const v_52e916 = () => {
  const { goBack: v_c7ac57 } = v_a0daa8();
  const [v_717992, v_9d6aeb] = v_5ab095<number | null>(null);
  const [v_00f110, v_1edbc0] = v_5ab095<CompletedAdData[]>([]);
  const [v_683210, v_34a50a] = v_5ab095(true);
  const [v_612e9f, v_575aad] = v_5ab095(false);

  v_c4deb2(() => {
    const v_0e1f49 = async () => {
      try {
        const v_f24fd5 = await v_e84827.getItem('userData');
        if (v_f24fd5) {
          const v_ef7306 = JSON.parse(v_f24fd5);
          if (v_ef7306.member) {
            v_9d6aeb(v_ef7306.member);
          }
        }
      } catch (v_5e9bfe) {
        console.error('[광고] 사용자 정보 로드 실패:', v_5e9bfe);
      }
    };
    v_0e1f49();
  }, []);

  const v_90988e = v_de06a3(async () => {
    if (!v_717992) return;

    try {
      v_34a50a(true);
      const v_3393e3 = await v_f4cc2d(v_717992, v_c7ac57);

      if (v_3393e3 && v_3393e3.data && v_3393e3.data.length > 0) {

        const v_3a292f = v_3393e3.data
          .filter((v_ddcfed) => v_ddcfed.title && v_ddcfed.title.trim() !== '')
          .map((ad: v_574252) => {
            const v_0e7d84 = v_fe0253(v_ddcfed.datetime);
            return {
              transaction: v_ddcfed.transaction,
              title: v_ddcfed.title || v_ddcfed.actiontext || v_ddcfed.extratext || '코인 획득',
              coin: `${v_ddcfed.amount} ${v_ddcfed.symbol}`,
              extracode: v_ddcfed.extracode,
              datetime: v_0e7d84,
              statusSuccess: 'Coin acquisition completed',
              statusPending: 'Waiting for Coin Acquisition',
            };
          });

        v_1edbc0(v_3a292f);

        try {
          await v_010f9a(v_717992, 'datetime', v_c7ac57);
        } catch (v_5e9bfe) {
          console.error('[광고] 저장된 광고 목록 조회 실패:', v_5e9bfe);
        }
      } else {
        v_1edbc0([]);

        try {
          await v_010f9a(v_717992, 'datetime', v_c7ac57);
        } catch (v_5e9bfe) {
          console.error('[광고] 저장된 광고 목록 조회 실패:', v_5e9bfe);
        }
      }
    } catch (v_5e9bfe) {
      console.error('[광고] 완료된 광고 조회 실패:', v_5e9bfe);
      v_1edbc0([]);
    } finally {
      v_34a50a(false);
      v_575aad(false);
    }
  }, [v_717992, v_c7ac57]);

  v_c4deb2(() => {
    if (v_717992) {
      v_90988e();
    }
  }, [v_717992, v_90988e]);

  const v_d5345f = v_de06a3(() => {
    v_575aad(true);
    v_90988e();
  }, [v_90988e]);

  const v_7f27ea = ({ item: v_8c0b26 }: { item: CompletedAdData }) => {
    const v_0d7b93 =
      v_8c0b26.extracode === '9416' || v_8c0b26.extracode === 9416
        ? v_8c0b26.statusPending
        : v_8c0b26.statusSuccess;

    return (
      <View style={v_d81136.listItem} key={String(v_8c0b26.transaction)}>
        <View style={v_d81136.listUpWrapper}>
          <Text
            style={[v_d81136.mediumText, { width: 160 }]}
            ellipsizeMode="tail"
            numberOfLines={1}
          >
            {v_8c0b26.title}
          </Text>
          <Text style={[v_d81136.smallText, { marginTop: -4 }]}>{v_0d7b93}</Text>
        </View>
        <View style={[v_d81136.listUpWrapper, { marginTop: -5, marginBottom: 8 }]}>
          <Text style={[v_d81136.smallText, { marginTop: -1 }]}>{v_8c0b26.datetime}</Text>
          <Text style={v_d81136.mediumText}>{v_8c0b26.coin}</Text>
        </View>
      </View>
    );
  };

  const v_5b2a38 = (v_8c0b26) => String(v_8c0b26.transaction);

  return (
    <View style={v_d81136.container}>
      <StatusBar style="dark" />
      <Header title="AD" onBackPress={v_c7ac57} showBackButton />
      <View style={v_d81136.content}>
        {v_683210 ? (
          <View style={v_d81136.loadingContainer}>
            <ActivityIndicator size="large" color={v_1bfbd0.buttonPrimary} />
            <Text style={[v_d81136.normalText, { color: '#7d7e83', marginTop: 12 }]}>
              로딩 중...
            </Text>
          </View>
        ) : v_00f110.length === 0 ? (
          <View style={v_d81136.emptyContainer}>
            <Text style={v_d81136.emptyText}>정산 내역이 없습니다.</Text>
          </View>
        ) : (
          <FlatList
            data={v_00f110}
            keyExtractor={v_5b2a38}
            renderItem={v_7f27ea}
            contentContainerStyle={v_d81136.listContent}
            refreshControl={<RefreshControl refreshing={v_612e9f} onRefresh={v_d5345f} />}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </View>
  );
};

const v_d81136 = v_472849.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f7fb',
  },
  content: {
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
    fontSize: 14,
    fontFamily: 'Roboto-Regular',
    color: '#7d7e83',
  },
  listContent: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 32,
  },
  listItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginBottom: 14,
    shadowColor: '#00000014',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  listUpWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  mediumText: {
    fontSize: 16,
    fontFamily: 'Roboto-SemiBold',
    color: '#343434',
  },
  smallText: {
    fontSize: 12,
    fontFamily: 'Roboto-Regular',
    color: '#707070',
  },
  normalText: {
    fontSize: 14,
    fontFamily: 'Roboto-Regular',
    color: '#343434',
  },
});

