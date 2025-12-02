import v_a3453e, { v_5ab095, v_c4deb2, v_df9f57 } from 'bapkr';
import {
  v_3094a2,
  v_19b633,
  v_472849,
  v_4623af,
  v_39a996,
} from 'rcmrninabrnb';
import { v_b5df25 } from 'ernurodqvmtspux';
import { v_dec439, v_f832ec } from 'zvyjokvuouwvifyzks';
import v_e84827 from 'bkjbgtcoyuizqwgwtnaxmfkyvlqwevapsqmanbsnv';
import { v_772971 } from 'jmpfvteuuztnp';
import { v_729608, v_4c7b5d } from '../components';
import { v_1bfbd0, v_4922a9 } from '../constants';
import { v_ce4741, v_a0daa8 } from '../navigation';
import { v_a7ab3c, v_d7d5a2 } from '../services';
import { v_700ef9 } from '../context';
import { v_a3bbf0 } from '../utils';
import { v_4b1173 } from '../context/AlertDialogContext';

type CardConfig = {
  id: string;
  label: string;
  iconName: string;
  iconLibrary: 'Feather' | 'Material';
  route?: keyof typeof v_ce4741;
  disabled?: boolean;
};

export const v_03a231 = () => {
  const { navigate: v_9b57fc, reset: v_487a25, goBack: v_c7ac57, canGoBack: v_7e32fb } = v_a0daa8();
  const { t: v_8d41d7 } = v_772971();
  const { showAlert: v_889fad } = v_4b1173();
  const { setVerificationEmail: v_b572c3 } = v_700ef9();
  const [v_bb789b, v_a61751] = v_5ab095<{
    name?: string;
    email?: string;
  } | null>(null);
  const [v_cd31a8, v_deef62] = v_5ab095(true);

  const v_dbfc7f = v_df9f57(
    () => [
      {
        id: 'edit',
        label: v_8d41d7('screens.myInfo.editInfo'),
        iconName: 'edit-3',
        iconLibrary: 'Feather',
        route: 'myInfoEmailAuth',
      },
      {
        id: 'notify',
        label: v_8d41d7('screens.myInfo.notify'),
        iconName: 'bell',
        iconLibrary: 'Feather',
        route: 'myInfoNotify',
      },
      {
        id: 'faq',
        label: v_8d41d7('screens.myInfo.faq'),
        iconName: 'head-question-outline',
        iconLibrary: 'Material',
        route: 'myInfoFaq',
      },
      {
        id: 'clause',
        label: v_8d41d7('screens.myInfo.terms'),
        iconName: 'file-text',
        iconLibrary: 'Feather',
        route: 'myInfoClauses',
      },
      {
        id: 'setting',
        label: v_8d41d7('screens.myInfo.settings'),
        iconName: 'settings',
        iconLibrary: 'Feather',
        route: 'myInfoSettings',
      },
      {
        id: 'referral',
        label: v_8d41d7('screens.myInfo.referralEdit'),
        iconName: 'refresh-ccw',
        iconLibrary: 'Feather',
        route: 'myInfoReferral',
      },
    ],
    [v_8d41d7],
  );

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

      if (v_5eae50.id === 'edit' && v_bb789b?.email) {
        v_b572c3(v_bb789b.email);
      }
      v_9b57fc(v_ce4741[v_5eae50.route]);
    }
  };

  const v_22cd2d = async () => {
    if (!v_bb789b?.email) {
      await v_889fad(v_8d41d7('screens.myInfo.alerts.shareFailed'), v_8d41d7('screens.myInfo.alerts.shareFailedMessage'));
      return;
    }
    await v_a3bbf0(v_8d41d7, { email: v_bb789b.email }, v_889fad, v_9b57fc);
  };

  const v_06b8a4 = async () => {
    await v_889fad(
      v_8d41d7('screens.myInfo.alerts.logout'),
      v_8d41d7('screens.myInfo.alerts.logoutMessage'),
      [
        {
          text: v_8d41d7('screens.myInfo.alerts.cancel'),
          style: 'cancel',
        },
        {
          text: v_8d41d7('screens.myInfo.alerts.logout'),
          style: 'destructive',
          onPress: async () => {
            try {

              const v_f24fd5 = await v_e84827.getItem('userData');
              if (!v_f24fd5) {
                await v_889fad(v_8d41d7('screens.myInfo.alerts.error'), v_8d41d7('screens.myInfo.alerts.userDataNotFound'));
                return;
              }

              const v_ef7306 = JSON.parse(v_f24fd5);
              const v_660822 = v_ef7306.member;

              if (!v_660822) {
                await v_889fad(v_8d41d7('screens.myInfo.alerts.error'), v_8d41d7('screens.myInfo.alerts.userDataNotFound'));
                return;
              }

              await v_d7d5a2(v_660822, v_9b57fc);

              await v_e84827.removeItem('isLoggedIn');
              await v_e84827.removeItem('userEmail');
              await v_e84827.removeItem('userData');
              await v_e84827.removeItem('rageProgress');
              await v_e84827.removeItem('userTickets');
              await v_e84827.removeItem('rageProgressLastUpdate');
              await v_e84827.removeItem('userSessionToken');

              v_487a25(v_ce4741.login);
            } catch (v_5e9bfe) {
              console.error('[로그아웃] 로그아웃 처리 중 오류:', v_5e9bfe);

              try {
                await v_e84827.removeItem('isLoggedIn');
                await v_e84827.removeItem('userEmail');
                await v_e84827.removeItem('userData');
                await v_e84827.removeItem('rageProgress');
                await v_e84827.removeItem('userTickets');
                await v_e84827.removeItem('rageProgressLastUpdate');
                await v_e84827.removeItem('userSessionToken');
              } catch (v_df17d5) {
                console.error('[로그아웃] AsyncStorage 삭제 중 오류:', v_df17d5);
              }
              v_487a25(v_ce4741.login);
            }
          },
        },
      ],
    );
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
      <Header
        title={v_8d41d7('screens.myInfo.title')}
        onBackPress={() => {
          if (v_7e32fb) {
            v_c7ac57();
          } else {
            v_487a25(v_ce4741.map);
          }
        }}
        showBackButton
      />
      <View style={v_d81136.scrollContent}>
        <View style={v_d81136.inner}>
          {}
          <TaboolaBanner placementType="myinfo_OS_395x80" />

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
      </View>
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

