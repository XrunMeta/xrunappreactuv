import v_a3453e, { v_df9f57, v_e662ae, v_5ab095, v_c4deb2, v_de06a3 } from 'bapkr';
import { v_3094a2, v_472849, v_4623af, v_19b633 } from 'rcmrninabrnb';
import { v_b5df25 } from 'ernurodqvmtspux';
import { v_772971 } from 'jmpfvteuuztnp';
import { v_dec439 } from 'zvyjokvuouwvifyzks';
import v_e84827 from 'bkjbgtcoyuizqwgwtnaxmfkyvlqwevapsqmanbsnv';
import { v_729608, v_814266, v_f16775, v_b34ce5, v_60b263, v_029581 } from '../components';
import { v_1bfbd0, v_4922a9 } from '../constants';
import { v_ce4741, v_a0daa8 } from '../navigation';
import { v_700ef9 } from '../context';
import { v_a3bbf0 } from '../utils';
import { v_4b1173 } from '../context/AlertDialogContext';
import { v_5b0045, v_ae32ae } from '../types/pagination';
import { v_fb1936 } from '../services';
import { v_b0f886 } from '../types';

interface MemberData {
  rank: number;
  email: string;
  date: string;
  member: string; 
  highlight?: boolean;
  hideHighlightBorder?: boolean;
}

export const v_58584a = () => {
  const { t: v_8d41d7 } = v_772971();
  const { navigate: v_9b57fc } = v_a0daa8();
  const { showAlert: v_889fad } = v_4b1173();
  const { setSelectedReferralMember: v_779227 } = v_700ef9();
  const v_e5fc4b = v_e662ae<v_029581>(null);
  const [v_717992, v_9d6aeb] = v_5ab095<string | null>(null);
  const [v_f4fb5e, v_d9bcc7] = v_5ab095<string>('');
  const [v_03be4c, v_e2e8ad] = v_5ab095<number>(0);
  const [v_87203a, v_8d99ff] = v_5ab095<MemberData[]>([]);
  const [v_cd31a8, v_deef62] = v_5ab095<boolean>(true);
  const v_bce118 = v_e662ae<boolean>(false);
  const v_58d2fc = v_e662ae<boolean>(false);
  const v_61b66e = v_e662ae<MemberData[]>([]);

  v_c4deb2(() => {
    const v_0e1f49 = async () => {
      try {
        const v_f24fd5 = await v_e84827.getItem('userData');
        if (v_f24fd5) {
          const v_ef7306 = JSON.parse(v_f24fd5);
          if (v_ef7306.member) {

            v_9d6aeb(String(v_ef7306.member));

            v_58d2fc.current = false;
            v_8d99ff([]);
            v_e2e8ad(0);
          }
          if (v_ef7306.email) {
            v_d9bcc7(v_ef7306.email);
          }
        }
      } catch (v_5e9bfe) {
        console.error('[추천] 사용자 정보 로드 실패:', v_5e9bfe);
      }
    };
    v_0e1f49();
  }, []);

  const v_e5b428 = v_de06a3(async (
    params: v_5b0045
  ): Promise<v_ae32ae<MemberData>> => {
    if (!v_717992) {
      return { data: [], total: 0, hasMore: false };
    }

    try {

      if (v_24baff.page === 1 && !v_58d2fc.current && !v_bce118.current) {
        v_bce118.current = true;

        try {
          const v_3393e3 = await v_fb1936(v_717992, v_9b57fc);

          if (v_3393e3.status === 'success' && v_3393e3.data) {

            const v_8673d6 = v_3393e3.data.map((item: v_b0f886, v_a56041) => {

              let v_14b228 = '';
              try {
                const v_a86996 = v_8c0b26.datejoin.replace(' ', 'T');
                const v_8dffde = new Date(v_a86996);
                if (isNaN(v_8dffde.getTime())) {
                  console.log('[내 그룹] 잘못된 날짜:', v_8c0b26.datejoin);
                  v_14b228 = '';
                } else {
                  v_14b228 = v_8dffde
                    .toISOString()
                    .split('T')[0]
                    .replace(/-/g, '.');
                }
              } catch (v_5e9bfe) {
                console.log('[내 그룹] 날짜 파싱 오류:', v_8c0b26.datejoin, v_5e9bfe);
                v_14b228 = '';
              }

              return {
                rank: v_a56041 + 1,
                email: v_8c0b26.email || '',
                date: v_14b228,
                member: v_8c0b26.member || '',
                highlight: v_a56041 === 0, 
                hideHighlightBorder: true, 
              };
            });

            v_61b66e.current = v_8673d6;
            v_8d99ff(v_8673d6);
            v_e2e8ad(v_8673d6.length);
            v_58d2fc.current = true;
            v_deef62(false);
          } else {
            v_61b66e.current = [];
            v_8d99ff([]);
            v_e2e8ad(0);
            v_58d2fc.current = true;
            v_deef62(false);
          }
        } finally {
          v_bce118.current = false;
        }
      }

      const v_8673d6 = v_61b66e.current;
      const v_6e5804 = (v_24baff.page - 1) * v_24baff.pageSize;
      const v_402079 = v_6e5804 + v_24baff.pageSize;
      const v_98f5bb = v_8673d6.slice(v_6e5804, v_402079);
      const v_6bbe19 = v_402079 < v_8673d6.length;

      return {
        data: v_98f5bb,
        total: v_8673d6.length,
        hasMore: v_6bbe19,
      };
    } catch (v_5e9bfe) {
      console.error('[추천] 내가 추천한 사람 목록 조회 실패:', v_5e9bfe);
      v_bce118.current = false;
      v_deef62(false);
      return { data: [], total: 0, hasMore: false };
    }
  }, [v_717992, v_9b57fc]);

  const v_1c4d31 = v_df9f57(
    () => [
      { label: v_8d41d7('screens.referralRank.group'), value: 'group' },
      { label: v_8d41d7('screens.referralRank.settlement'), value: 'settlement' },
      { label: '순위', value: 'rank' }, 
    ] as const,
    [v_8d41d7],
  );

  const v_c411e0 = (value: typeof v_1c4d31[number]['value']) => {
    if (v_3b402b === 'settlement') {
      v_9b57fc(v_ce4741.referralSettlement);
    } else if (v_3b402b === 'rank') {
      v_9b57fc(v_ce4741.referralRank);
    } else if (v_3b402b === 'group') {

      v_58d2fc.current = false;
      v_8d99ff([]);
      v_e2e8ad(0);
      v_deef62(true);
      v_e5fc4b.current?.reloadData();
    }
  };

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

  return (
    <View style={v_d81136.container}>
      <StatusBar style="dark" />
      <Header title={v_8d41d7('screens.referralMyGroup.title')} />
      <View style={v_d81136.content}>
        <View style={v_d81136.wrapper}>
          <View style={v_d81136.topRow}>
            <ReferralStatsCard 
              title={v_8d41d7('screens.referralMyGroup.myGroupMembers')} 
              value={`${v_03be4c} ${v_8d41d7('screens.referralMyGroup.members')}`}
              containerStyle={v_d81136.statsCardCenter}
            />
            <TouchableOpacity style={v_d81136.iconButton} onPress={v_22cd2d} activeOpacity={0.7}>
              <Feather name="share-2" size={18} color={v_1bfbd0.headerText} />
            </TouchableOpacity>
          </View>

          <SegmentedControl
            options={v_1c4d31}
            value="group"
            onChange={v_c411e0}
            containerStyle={v_d81136.segmented}
            hideIndicator={true}
          />
        </View>

        <View style={v_d81136.listContainer}>
          {!v_cd31a8 && v_03be4c === 0 ? (
            <View style={v_d81136.emptyContainer}>
              <Text style={v_d81136.emptyTitle}>그룹 멤버 없음</Text>
              <Text style={v_d81136.emptyDescription}>
                아직 그룹에 멤버를 추가하지 않았습니다.{'\n'}
                네트워크를 확장하기 위해 사람들을 초대해보세요!
              </Text>
            </View>
          ) : (
            <DataList<MemberData>
              ref={v_e5fc4b}
              fetchData={v_e5b428}
              ItemComponent={v_814266}
              pageSize={20}
              keyExtractor={(v_8c0b26, v_a56041) => `member-${v_8c0b26.rank}-${v_8c0b26.email}-${v_a56041}`}
              onItemPress={(v_8c0b26) => {

                v_779227({ member: v_8c0b26.member, email: v_8c0b26.email, depth: 2 });
                v_9b57fc(v_ce4741.referralDepthOne);
              }}
              contentContainerStyle={{ ...v_d81136.listContent, paddingVertical: 0, paddingBottom: 32 }}
            />
          )}
        </View>
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
  wrapper: {
    width: '100%',
    maxWidth: 780,
    alignSelf: 'center',
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 16,
  },
  topRow: {
    position: 'relative',
    marginBottom: 16,
  },
  statsCardCenter: {
    justifyContent: 'center',
  },
  iconButton: {
    position: 'absolute',
    right: 16,
    top: 16,
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  segmented: {
    marginTop: 0,
    marginBottom: 0,
  },
  listContainer: {
    flex: 1,
    width: '100%',
    maxWidth: 780,
    alignSelf: 'center',
    paddingHorizontal: 24,
    paddingTop: 0,
  },
  listContent: {
    paddingTop: 0,
    paddingBottom: 32,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 18,
    fontFamily: 'Roboto-Bold',
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
});

