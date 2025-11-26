import v_a3453e, { v_5ab095, v_c4deb2, v_de06a3 } from 'bapkr';
import { v_3094a2, v_472849, v_122070, v_39a996, v_19b633, v_9cabcb } from 'rcmrninabrnb';
import { v_b5df25 } from 'ernurodqvmtspux';
import { v_772971 } from 'jmpfvteuuztnp';
import v_e84827 from 'bkjbgtcoyuizqwgwtnaxmfkyvlqwevapsqmanbsnv';
import { v_729608, v_814266 } from '../components';
import { v_a0daa8, v_ce4741 } from '../navigation';
import { v_700ef9 } from '../context';
import { v_1bfbd0 } from '../constants';
import { v_fb1936 } from '../services';
import { v_b0f886 } from '../types';

interface MemberData {
  id: string;
  rank: number;
  email: string;
  date: string;
  member: string;
  highlight?: boolean;
}

const v_f181d8 = (apiData: v_b0f886[]): MemberData[] => {
  return v_135b82.map((v_8c0b26, v_a56041) => {

    let v_14b228 = '';
    try {
      const v_a86996 = v_8c0b26.datejoin.replace(' ', 'T');
      const v_8dffde = new Date(v_a86996);
      if (isNaN(v_8dffde.getTime())) {
        console.log('[Depth] 잘못된 날짜:', v_8c0b26.datejoin);
        v_14b228 = '';
      } else {
        v_14b228 = v_8dffde
          .toISOString()
          .split('T')[0]
          .replace(/-/g, '.');
      }
    } catch (v_5e9bfe) {
      console.log('[Depth] 날짜 파싱 오류:', v_8c0b26.datejoin, v_5e9bfe);
      v_14b228 = '';
    }

    return {
      id: `depth_${v_8c0b26.member}`,
      rank: v_a56041 + 1,
      email: v_8c0b26.email || '',
      date: v_14b228,
      member: v_8c0b26.member || '',
      highlight: v_a56041 === 0,
    };
  });
};

export const v_5b4c5a = () => {
  const { navigate: v_9b57fc, goBack: v_c7ac57 } = v_a0daa8();
  const { selectedReferralMember: v_f87030 } = v_700ef9();
  const [v_717992, v_9d6aeb] = v_5ab095<string | null>(null);
  const [v_200d98, v_284862] = v_5ab095<MemberData[]>([]);
  const [v_683210, v_34a50a] = v_5ab095(true);

  v_c4deb2(() => {
    const v_0e1f49 = async () => {
      try {
        const v_f24fd5 = await v_e84827.getItem('userData');
        if (v_f24fd5) {
          const v_ef7306 = JSON.parse(v_f24fd5);
          if (v_ef7306.member) {
            v_9d6aeb(String(v_ef7306.member));
          }
        }
      } catch (v_5e9bfe) {
        console.error('[Depth] 사용자 정보 로드 실패:', v_5e9bfe);
      }
    };
    v_0e1f49();
  }, []);

  const v_ee33d3 = v_de06a3(async (v_ce4e50) => {
    try {
      v_34a50a(true);
      const v_3393e3 = await v_fb1936(v_ce4e50, v_9b57fc);

      if (v_3393e3.status === 'success' && v_3393e3.data) {
        const v_2a6164 = v_f181d8(v_3393e3.data);
        v_284862(v_2a6164);
      } else {
        console.error('[Depth] Depth 데이터 조회 실패:', v_3393e3.message);
        v_284862([]);
      }
    } catch (v_5e9bfe) {
      console.error('[Depth] Depth 데이터 조회 실패:', v_5e9bfe);
      v_284862([]);
    } finally {
      v_34a50a(false);
    }
  }, [v_9b57fc]);

  v_c4deb2(() => {
    if (v_f87030?.member) {
      v_ee33d3(v_f87030.member);
    } else if (v_717992) {

      v_ee33d3(v_717992);
    }
  }, [v_f87030, v_717992, v_ee33d3]);

  const v_a4780d = ({ item: v_8c0b26 }: { item: MemberData }) => {
    return (
      <ReferralMemberRow
        key={v_8c0b26.id}
        rank={v_8c0b26.rank}
        email={v_8c0b26.email}
        date={v_8c0b26.date}
        highlight={v_8c0b26.highlight}
        onPress={() => {

          v_9b57fc(v_ce4741.referralDepthTwo);
        }}
      />
    );
  };

  const { t: v_8d41d7 } = v_772971();

  return (
    <View style={v_d81136.container}>
      <StatusBar style="dark" />
      <Header title={v_8d41d7('screens.referralDepthOne.title')} onBackPress={v_c7ac57} showBackButton />
      {v_683210 ? (
        <View style={v_d81136.loadingContainer}>
          <ActivityIndicator size="large" color={v_1bfbd0.buttonPrimary} />
        </View>
      ) : v_200d98.length === 0 ? (
        <View style={v_d81136.emptyContainer}>
          <Text style={v_d81136.emptyTitle}>이 멤버는 아직 하위 추천인이 없습니다.</Text>
          <Text style={v_d81136.emptyDescription}>
            이 사람의 직접 추천인이 추천한 멤버들이 여기에 표시됩니다.
          </Text>
        </View>
      ) : (
        <FlatList
          data={v_200d98}
          renderItem={v_a4780d}
          keyExtractor={(v_8c0b26) => v_8c0b26.id}
          contentContainerStyle={v_d81136.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};

const v_d81136 = v_472849.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f7fb',
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
    paddingHorizontal: 24,
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 16,
    fontFamily: 'Roboto-SemiBold',
    color: '#2a2727',
    marginBottom: 12,
    textAlign: 'center',
  },
  emptyDescription: {
    fontSize: 14,
    fontFamily: 'Roboto-Regular',
    color: '#7d7e83',
    textAlign: 'center',
    lineHeight: 20,
  },
  listContent: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 32,
  },
});
