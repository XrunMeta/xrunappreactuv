import v_a3453e, { v_5ab095, v_c4deb2 } from 'bapkr';
import {
  v_3094a2,
  v_19b633,
  v_472849,
  v_122070,
  v_4623af,
  v_5f4661,
  v_03e392,
  v_39a996,
} from 'rcmrninabrnb';
import { v_b5df25 } from 'ernurodqvmtspux';
import { v_dec439, v_f832ec } from 'zvyjokvuouwvifyzks';
import v_e84827 from 'bkjbgtcoyuizqwgwtnaxmfkyvlqwevapsqmanbsnv';
import { v_729608 } from '../components';
import { v_1bfbd0 } from '../constants';
import { v_ce4741, v_a0daa8 } from '../navigation';
import { v_a7ab3c } from '../services';

type CardConfig = {
  id: string;
  label: string;
  iconName: string;
  iconLibrary: 'Feather' | 'Material';
  route?: keyof typeof v_ce4741;
  disabled?: boolean;
};

const v_dbfc7f = [
  {
    id: 'edit',
    label: '정보수정',
    iconName: 'edit-3',
    iconLibrary: 'Feather',
    route: 'myInfoEmailAuth',
  },
  {
    id: 'notify',
    label: '알림',
    iconName: 'bell',
    iconLibrary: 'Feather',
    route: 'myInfoNotify',
  },
  {
    id: 'faq',
    label: 'FAQ',
    iconName: 'head-question-outline',
    iconLibrary: 'Material',
    route: 'myInfoFaq',
  },
  {
    id: 'clause',
    label: '이용약관',
    iconName: 'file-text',
    iconLibrary: 'Feather',
    route: 'myInfoClauses',
  },
  {
    id: 'setting',
    label: '설정',
    iconName: 'settings',
    iconLibrary: 'Feather',
    route: 'myInfoSettings',
  },
  {
    id: 'referral',
    label: '래퍼럴 수정',
    iconName: 'refresh-ccw',
    iconLibrary: 'Feather',
    route: 'myInfoReferral',
  },
];

export const v_03a231 = () => {
  const { navigate: v_9b57fc } = v_a0daa8();
  const [v_bb789b, v_a61751] = v_5ab095<{
    name?: string;
    email?: string;
  } | null>(null);
  const [v_cd31a8, v_deef62] = v_5ab095(true);

  v_c4deb2(() => {
    const v_ea3fa6 = async () => {
      try {

        const v_f24fd5 = await v_e84827.getItem('userData');
        if (v_f24fd5) {
          const v_ef7306 = JSON.parse(v_f24fd5);
          const v_660822 = v_ef7306.member;

          if (v_660822) {
            const v_3393e3 = await v_a7ab3c(v_660822, v_9b57fc);
            const v_625c74 = v_3393e3.data[0];

            if (v_625c74) {
              const v_a32a50 = v_625c74.firstname || '';
              const v_328bb4 = v_625c74.lastname || '';
              const v_05b02f = `${v_a32a50} ${v_328bb4}`.trim() || '사용자';

              v_a61751({
                name: v_05b02f,
                email: v_625c74.email || '',
              });
            }
          }
        }
      } catch (v_5e9bfe) {
        console.error('[마이페이지] 사용자 정보 로드 실패:', v_5e9bfe);
      } finally {
        v_deef62(false);
      }
    };

    v_ea3fa6();
  }, [v_9b57fc]);

  const v_b0f7df = (v_5eae50) => {
    if (v_5eae50.route) {
      v_9b57fc(v_ce4741[v_5eae50.route]);
    }
  };

  const v_22cd2d = async () => {
    try {
      const v_1833e7 = v_bb789b?.name || '사용자';
      const v_e0c7e8 = v_bb789b?.email || '';
      await v_5f4661.share({
        message: `${v_1833e7} • ${v_e0c7e8}`,
      });
    } catch (v_5e9bfe) {
      console.warn(v_5e9bfe);
    }
  };

  const v_06b8a4 = () => {
    v_03e392.alert('로그아웃', '로그아웃 기능은 추후 연동됩니다.');
  };

  const v_c273da = (v_5eae50) => {
    if (v_5eae50.iconLibrary === 'Material') {
      return (
        <MaterialCommunityIcons
          name={v_5eae50.iconName as any}
          size={18}
          color="#fff"
        />
      );
    }
    return <Feather name={v_5eae50.iconName as any} size={18} color="#fff" />;
  };

  return (
    <View style={v_d81136.container}>
      <StatusBar style="dark" />
      <Header title="My Info" />
      <ScrollView
        contentContainerStyle={v_d81136.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={v_d81136.inner}>
          <View style={v_d81136.adBanner}>
            <Text style={v_d81136.adText}>AD</Text>
          </View>

          <View style={v_d81136.profileCard}>
            <View>
              {v_cd31a8 ? (
                <ActivityIndicator size="small" color={v_1bfbd0.headerText} />
              ) : (
                <>
                  <Text style={v_d81136.profileName}>
                    {v_bb789b?.name || '사용자'}
                  </Text>
                  <Text style={v_d81136.profileEmail}>
                    {v_bb789b?.email || ''}
                  </Text>
                </>
              )}
            </View>
            <View style={v_d81136.profileActions}>
              <TouchableOpacity
                onPress={v_22cd2d}
                style={v_d81136.actionButton}
                activeOpacity={0.7}
              >
                <Feather name="share-2" size={18} color={v_1bfbd0.headerText} />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={v_06b8a4}
                style={v_d81136.actionButton}
                activeOpacity={0.7}
              >
                <MaterialCommunityIcons
                  name="logout"
                  size={18}
                  color={v_1bfbd0.headerText}
                />
              </TouchableOpacity>
            </View>
          </View>

          <View style={v_d81136.grid}>
            {v_dbfc7f.map((v_5eae50) => (
              <TouchableOpacity
                key={v_5eae50.id}
                style={[
                  v_d81136.card,
                ]}
                onPress={() => v_b0f7df(v_5eae50)}
                activeOpacity={0.85}
              >
                <View style={v_d81136.cardIcon}>{v_c273da(v_5eae50)}</View>
                <Text style={v_d81136.cardLabel}>{v_5eae50.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const v_d81136 = v_472849.create({
  container: {
    flex: 1,
    backgroundColor: v_1bfbd0.background,
  },
  scrollContent: {
    paddingBottom: 32,
  },
  inner: {
    width: '100%',
    maxWidth: 780,
    alignSelf: 'center',
    paddingHorizontal: 24,
    paddingTop: 24,
    gap: 24,
  },
  adBanner: {
    width: '100%',
    height: 97,
    borderRadius: 8,
    backgroundColor: '#d9d9d9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  adText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000',
  },
  profileCard: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 16,
    shadowColor: '#00000014',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  profileName: {
    fontSize: 16,
    fontFamily: 'Roboto-SemiBold',
    color: '#10192d',
  },
  profileEmail: {
    fontSize: 14,
    fontFamily: 'Roboto-Regular',
    color: '#4c4e55',
    marginTop: 4,
  },
  profileActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    width: '31%',
    minWidth: 100,
    height: 110,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e3e7ec',
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
    paddingHorizontal: 8,
    gap: 12,
  },
  cardIcon: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: '#343a5a',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardLabel: {
    fontSize: 16,
    fontFamily: 'Roboto-Medium',
    color: '#111',
  },
});

