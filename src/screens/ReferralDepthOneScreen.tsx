import v_a3453e, { v_5ab095, v_c4deb2, v_de06a3 } from 'bapkr';
import { v_3094a2, v_472849, v_122070, v_39a996, v_19b633, v_9cabcb, v_4623af } from 'rcmrninabrnb';
import { v_772971 } from 'jmpfvteuuztnp';
import v_e84827 from 'bkjbgtcoyuizqwgwtnaxmfkyvlqwevapsqmanbsnv';
import { v_dec439 } from 'zvyjokvuouwvifyzks';
import { v_729608, v_814266 } from '../components';
import { v_a0daa8, v_ce4741 } from '../navigation';
import { v_700ef9 } from '../context';
import { v_1bfbd0, v_a61db3, v_843035 } from '../constants';
import { v_fb1936 } from '../services';
import { v_b0f886 } from '../types';
import { v_556baf } from '../components';

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
  const { navigate: v_9b57fc, goBack: v_c7ac57, reset: v_487a25 } = v_a0daa8();
  const { selectedReferralMember: v_f87030, setSelectedReferralMember: v_779227 } = v_700ef9();
  const [v_717992, v_9d6aeb] = v_5ab095<string | null>(null);
  const [v_200d98, v_284862] = v_5ab095<MemberData[]>([]);
  const [v_683210, v_34a50a] = v_5ab095(true);
  const [v_c09f1f, v_0d08b9] = v_5ab095<number>(2); 

  const v_7f2e65 = () => {
    v_487a25(v_ce4741.map);
  };

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

      const v_98c1d0 = v_f87030.depth || 2;
      v_0d08b9(v_98c1d0);
      v_ee33d3(v_f87030.member);
    } else if (v_717992) {

      v_0d08b9(2);
      v_ee33d3(v_717992);
    }
  }, [v_f87030, v_717992, v_ee33d3]);

  const v_a4780d = ({ item: v_8c0b26 }: { item: MemberData }) => {
    return (
      <ReferralMemberRow
        key={v_8c0b26.id}
        email={v_8c0b26.email}
        date={v_8c0b26.date}
        hideRank={true}
        hideHighlightBorder={true}
        onPress={() => {

          v_779227({
            member: v_8c0b26.member,
            email: v_8c0b26.email,
            depth: v_c09f1f + 1,
          });
          v_9b57fc(v_ce4741.referralDepthOne);
        }}
      />
    );
  };

  const { t: v_8d41d7 } = v_772971();

  return (
    <SafeView style={v_d81136.container}>
      <Header
        title={`${v_8d41d7('screens.referralDepthOne.title')} ${v_c09f1f}`}
        onBackPress={v_c7ac57}
        showBackButton
        rightComponent={
          <TouchableOpacity
            style={v_d81136.closeButton}
            onPress={v_7f2e65}
            activeOpacity={0.7}
          >
            <Feather name="x" size={20} color={v_1bfbd0.headerText} />
          </TouchableOpacity>
        }
      />
      {v_683210 ? (
        <View style={v_d81136.loadingContainer}>
          <ActivityIndicator size="large" color={v_1bfbd0.buttonPrimary} />
        </View>
      ) : v_200d98.length === 0 ? (
        <View style={v_d81136.emptyContainer}>
          <Text style={v_d81136.emptyTitle}>{v_8d41d7('screens.referralDepthOne.emptyTitle')}</Text>
          <Text style={v_d81136.emptyDescription}>
            {v_8d41d7('screens.referralDepthOne.emptyDescription')}
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
    </SafeView>
  );
};

const v_d81136 = v_472849.create({
  container: {
    ...v_a61db3.container,
  },
  loadingContainer: {
    flex: 1,
    ...v_a61db3.scrollContent,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: v_843035.size.medium,
    fontFamily: 'Roboto-SemiBold',
    color: '#2a2727',
    marginBottom: 12,
    textAlign: 'center',
  },
  emptyDescription: {
    fontSize: v_843035.size.msmall,
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
  closeButton: {
    width: 40,
    height: 40,
    backgroundColor: v_1bfbd0.headerIconBg,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
