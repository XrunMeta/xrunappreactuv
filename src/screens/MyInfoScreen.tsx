import v_a3453e, { v_5ab095, v_c4deb2, v_df9f57 } from 'bapkr';
import {
  v_3094a2,
  v_19b633,
  v_472849,
  v_4623af,
  v_39a996,
  v_cf9c33,
} from 'rcmrninabrnb';
import { v_dec439, v_f832ec, v_25515d } from 'zvyjokvuouwvifyzks';
import v_e84827 from 'bkjbgtcoyuizqwgwtnaxmfkyvlqwevapsqmanbsnv';
import { v_772971 } from 'jmpfvteuuztnp';
import { v_729608, v_4c7b5d } from '../components';
import { v_1bfbd0, v_a61db3, v_4922a9, v_843035, v_9b1a04 } from '../constants';
import { v_ce4741, v_a0daa8 } from '../navigation';
import { v_a7ab3c, v_d7d5a2, v_ab08d0 } from '../services';
import { v_21ef1f } from '../services/adison';
import { v_700ef9 } from '../context';
import { v_a3bbf0 } from '../utils';
import { v_4b1173 } from '../context/AlertDialogContext';
import { v_6e4589 } from '../hooks';
import { v_570c34, v_556baf } from '../components';

type MenuConfig = {
  id: string;
  label: string;
  subtitle: string;
  iconName: string;
  iconLibrary: 'Feather' | 'Material' | 'Ionicons' | 'MaterialCommunityIcons';
  iconColor: string;

  iconImage?: number;
  route?: keyof typeof v_ce4741;
  disabled?: boolean;
};

export const v_03a231 = () => {
  const { navigate: v_9b57fc, reset: v_487a25, goBack: v_c7ac57, canGoBack: v_7e32fb, currentScreen: v_0f0c7b } = v_a0daa8();
  const { t: v_8d41d7 } = v_772971();
  const { showAlert: v_889fad } = v_4b1173();
  const { setVerificationEmail: v_b572c3 } = v_700ef9();

  v_6e4589('myInfo');
  const [v_bb789b, v_a61751] = v_5ab095<{
    name?: string;
    email?: string;
    member?: number;
  } | null>(null);
  const [v_cd31a8, v_deef62] = v_5ab095(true);
  const [v_79b081, v_0dfa96] = v_5ab095(false);

  const v_e47202 = v_df9f57(
    () => [
      {
        id: 'edit',
        label: v_8d41d7('screens.myInfo.editInfo'),
        subtitle: v_8d41d7('screens.myInfo.editInfoSubtitle'),
        iconName: 'person-outline',
        iconLibrary: 'Ionicons',
        iconColor: '#6366F1',
        route: 'myInfoEdit',
      },

      {
        id: 'shopSales',
        label: v_8d41d7('screens.myInfo.shopSales'),
        subtitle: v_8d41d7('screens.myinfoShopSales.title'),
        iconName: 'storefront-outline',
        iconLibrary: 'Ionicons',
        iconColor: '#7ca6e8',
        route: 'myinfoShopSales',
      },

      {
        id: 'notify',
        label: v_8d41d7('screens.myInfo.notify'),
        subtitle: v_8d41d7('screens.myInfo.notifySubtitle'),
        iconName: 'notifications-outline',
        iconLibrary: 'Ionicons',
        iconColor: '#10B981',
        route: 'myInfoNotify',
      },
      {
        id: 'faq',
        label: v_8d41d7('screens.myInfo.faq'),
        subtitle: v_8d41d7('screens.myInfo.faqSubtitle'),
        iconName: 'help-circle-outline',
        iconLibrary: 'Ionicons',
        iconColor: '#F59E0B',
        route: 'myInfoFaq',
      },
      {
        id: 'clause',
        label: v_8d41d7('screens.myInfo.terms'),
        subtitle: v_8d41d7('screens.myInfo.termsSubtitle'),
        iconName: 'document-text-outline',
        iconLibrary: 'Ionicons',
        iconColor: '#3B82F6',
        route: 'myInfoClauses',
      },
      {
        id: 'setting',
        label: v_8d41d7('screens.myInfo.settings'),
        subtitle: v_8d41d7('screens.myInfo.settingsSubtitle'),
        iconName: 'settings-outline',
        iconLibrary: 'Ionicons',
        iconColor: '#8B5CF6',
        route: 'myInfoSettings',
      },
    ],
    [v_8d41d7],
  );

  v_c4deb2(() => {
    console.log('[MyInfoScreen] OTA_MARKER v2026-07-10-A — Apple 재인증은 정보수정 클릭 시에만');
  }, []);

  v_c4deb2(() => {

    let v_6ee6f3 = false;
    const v_3680c8 = async (v_58ca36) => {
      v_6ee6f3 = true;
      console.warn('[마이페이지] 사용자 정보 로드 실패 → 강제 로그아웃:', v_58ca36);
      try {
        await Promise.all([
          v_e84827.removeItem('isLoggedIn'),
          v_e84827.removeItem('userEmail'),
          v_e84827.removeItem('userData'),
          v_e84827.removeItem('rageProgress'),
          v_e84827.removeItem('userTickets'),
          v_e84827.removeItem('rageProgressLastUpdate'),
          v_e84827.removeItem('userSessionToken'),
          v_e84827.removeItem('jwt'),
          v_e84827.removeItem('appleSignupCompleted'),
          v_e84827.removeItem('appleSignupCompletedEmail'),
          v_e84827.removeItem('appleSignupRequired'),
          v_e84827.removeItem('appleSignupEmail'),
          v_e84827.removeItem('googleSignupRequired'),
          v_e84827.removeItem('googleSignupEmail'),
          v_e84827.removeItem('loginType'),
          v_e84827.removeItem('appleEditInfoAlertShownAt'),
        ]);
      } catch (v_37eab7) {}
      try { v_21ef1f(); } catch (v_37eab7) {}
      v_487a25(v_ce4741.login);
    };

    const v_ea3fa6 = async () => {
      try {
        const v_f24fd5 = await v_e84827.getItem('userData');
        if (!v_f24fd5) {
          await v_3680c8('userData 없음');
          return;
        }
        let v_ef7306;
        try {
          v_ef7306 = JSON.parse(v_f24fd5);
        } catch (v_dbd2f7) {
          await v_3680c8(`userData 파싱 실패: ${v_dbd2f7}`);
          return;
        }
        if (v_ef7306 == null || typeof v_ef7306 !== 'object') {
          await v_3680c8('userData 형식 오류');
          return;
        }
        const v_660822 = v_ef7306.member != null ? Number(v_ef7306.member) : undefined;
        if (!v_660822) {
          await v_3680c8('member ID 없음');
          return;
        }

        const v_3393e3 = await v_a7ab3c(v_660822, v_9b57fc);
        const v_9390e8 = v_3393e3?.data;
        const v_625c74 = v_9390e8 == null ? null : Array.isArray(v_9390e8) ? v_9390e8[0] : v_9390e8;

        if (v_625c74 == null || typeof v_625c74 !== 'object' || !v_625c74.email) {
          await v_3680c8('사용자 정보 응답 비어있음');
          return;
        }

        const v_a32a50 = v_625c74.firstname || '';
        const v_328bb4 = v_625c74.lastname || '';
        const v_05b02f = `${v_328bb4} ${v_a32a50}`.trim() || '사용자';

        v_a61751({
          name: v_05b02f,
          email: v_625c74.email,
          member: v_660822,
        });
      } catch (v_5e9bfe) {
        console.error('[마이페이지] 사용자 정보 로드 실패:', v_5e9bfe);
        await v_3680c8(`예외: ${v_5e9bfe}`);
      } finally {

        if (!v_6ee6f3) v_deef62(false);
      }
    };

    v_ea3fa6();
  }, [v_9b57fc, v_487a25]);

  v_c4deb2(() => {

    if (v_0f0c7b !== 'myInfo') {
      return;
    }

    const v_5e556c = async () => {
      try {
        const v_f24fd5 = await v_e84827.getItem('userData');
        if (v_f24fd5) {
          const v_ef7306 = JSON.parse(v_f24fd5);
          const v_660822 = v_ef7306.member;

          if (v_660822) {
            const v_3393e3 = await v_ab08d0(v_660822, 0, v_9b57fc);
            if (v_3393e3?.data && v_3393e3.data.length > 0) {

              const v_90af29 = await v_e84827.getItem('lastNotificationCheckTime');
              const v_910d40 = v_90af29 ? new Date(v_90af29).getTime() : 0;

              const v_ffe9e6 = (v_479f05): number => {
                const v_fd5f43 = String(v_479f05 ?? '').trim();
                if (!v_fd5f43) return 0;

                const v_6fc191 = v_fd5f43.includes('T') ? v_fd5f43 : v_fd5f43.replace(' ', 'T') + (v_fd5f43.endsWith('Z') ? '' : 'Z');
                return new Date(v_6fc191).getTime();
              };
              const v_4a7208 = v_3393e3.data.filter((v_b9faeb) => {

                if (Number(v_b9faeb.type) === 9303) return false;
                const v_85f156 = v_ffe9e6(v_b9faeb.datetime);
                return v_85f156 > v_910d40;
              });
              const v_f66810 = v_4a7208.length > 0;

              v_0dfa96(v_f66810);

            } else {
              v_0dfa96(false);
            }
          }
        }
      } catch (v_5e9bfe) {
        console.error('[마이페이지] 알림 확인 실패:', v_5e9bfe);

        v_0dfa96(false);
      }
    };

    v_5e556c();

    const v_ad1d65 = setInterval(v_5e556c, 30000);

    return () => clearInterval(v_ad1d65);
  }, [v_9b57fc, v_0f0c7b]);

  const v_18219f = async (v_714568) => {
    if (v_714568.route) {

      if (v_714568.id === 'edit') {

        const v_861648 = await v_e84827.getItem('loginType');
        const v_1fa4eb = v_861648 === 'apple';

        if (v_1fa4eb) {
          v_9b57fc(v_ce4741.myInfoEdit);
        } else {
          console.log('[내 정보] 일반 로그인 → 이메일 인증 화면으로 이동');
          if (v_bb789b?.email) {
            v_b572c3(v_bb789b.email);
          }
          v_9b57fc(v_ce4741.myInfoEmailAuth);
        }
      } else if (v_714568.id === 'notify') {

        v_9b57fc(v_ce4741[v_714568.route]);
      } else {
        v_9b57fc(v_ce4741[v_714568.route]);
      }
    }
  };

  const v_22cd2d = async () => {
    if (!v_bb789b?.email) {
      await v_889fad(v_8d41d7('screens.myInfo.alerts.shareFailed'), v_8d41d7('screens.myInfo.alerts.shareFailedMessage'));
      return;
    }
    await v_a3bbf0(v_8d41d7, { email: v_bb789b.email, member: v_bb789b.member }, v_889fad, v_9b57fc);
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
              let v_660822 = undefined;

              if (v_f24fd5) {
                try {
                  const v_ef7306 = JSON.parse(v_f24fd5);
                  v_660822 = v_ef7306.member;
                } catch (v_5f9add) {
                  console.error('[로그아웃] userData 파싱 오류:', v_5f9add);
                }
              }

              if (v_660822) {
                try {
                  await v_d7d5a2(v_660822, v_9b57fc);
                } catch (v_340b4d) {
                  console.error('[로그아웃] 로그아웃 API 호출 실패:', v_340b4d);

                }
              } else {
                console.log('[로그아웃] 사용자 정보 없음 - 로컬 데이터만 삭제하고 로그인 화면으로 이동');
              }

              try { v_21ef1f(); } catch (v_37eab7) {}

              await v_e84827.removeItem('isLoggedIn');
              await v_e84827.removeItem('userEmail');
              await v_e84827.removeItem('userData');
              await v_e84827.removeItem('rageProgress');
              await v_e84827.removeItem('userTickets');
              await v_e84827.removeItem('rageProgressLastUpdate');
              await v_e84827.removeItem('userSessionToken');
              await v_e84827.removeItem('jwt'); 

              await v_e84827.removeItem('appleSignupCompleted');
              await v_e84827.removeItem('appleSignupCompletedEmail');
              await v_e84827.removeItem('appleSignupRequired');
              await v_e84827.removeItem('appleSignupEmail');
              await v_e84827.removeItem('googleSignupRequired');
              await v_e84827.removeItem('googleSignupEmail');

              await v_e84827.removeItem('loginType');

              await v_e84827.removeItem('appleEditInfoAlertShownAt');

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
                await v_e84827.removeItem('jwt'); 

                await v_e84827.removeItem('appleSignupCompleted');
                await v_e84827.removeItem('appleSignupCompletedEmail');
                await v_e84827.removeItem('appleSignupRequired');
                await v_e84827.removeItem('appleSignupEmail');
                await v_e84827.removeItem('googleSignupRequired');
                await v_e84827.removeItem('googleSignupEmail');

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

  const v_03ce49 = (v_714568) => {
    const v_6fb2d1 = 24;
    if (v_714568.iconImage) {
      return (
        <Image
          source={v_714568.iconImage}
          style={{ width: v_6fb2d1, height: v_6fb2d1 }}
          resizeMode="contain"
        />
      );
    }
    if (v_714568.iconLibrary === 'Ionicons') {
      return <Ionicons name={v_714568.iconName as any} size={v_6fb2d1} color={v_714568.iconColor} />;
    }
    if (v_714568.iconLibrary === 'Material') {
      return (
        <MaterialCommunityIcons
          name={v_714568.iconName as any}
          size={v_6fb2d1}
          color={v_714568.iconColor}
        />
      );
    }
    return <Feather name={v_714568.iconName as any} size={v_6fb2d1} color={v_714568.iconColor} />;
  };

  return (
    <SafeView style={v_d81136.container} backgroundColor={"#f7f7fb"}>
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
        rightComponent={
          <TouchableOpacity
            onPress={v_06b8a4}
            style={v_d81136.headerLogoutButton}
            activeOpacity={0.7}
          >
            <MaterialCommunityIcons name="logout" size={20} color={v_1bfbd0.headerText} />
          </TouchableOpacity>
        }
      />
      {}
      <View style={v_d81136.adBanner}>
        < TaboolaBanner placementType="myinfo_OS_395x80" />
      </View>

      <View style={v_d81136.scrollContent}>
        <View style={v_d81136.profileCard}>
          <View style={v_d81136.profileIconContainer}>
            <Ionicons name="person-outline" size={28} color="#666666" />
          </View>
          <View style={v_d81136.profileInfo}>
            {}
            {v_cd31a8 || !v_bb789b?.email ? (
              <ActivityIndicator size="small" color={v_1bfbd0.headerText} />
            ) : (
              <>
                <Text style={v_d81136.profileName}>
                  {v_bb789b.name || '사용자'}
                </Text>
                <Text style={v_d81136.profileEmail}>
                  {v_bb789b.email}
                </Text>
              </>
            )}
          </View>

        </View>
        <SafeScrollView style={v_d81136.menuListContainer} showsVerticalScrollIndicator={false} showBottomBackground={false} backgroundColor='transparent'>
          {}
          <View style={v_d81136.menuList}>
            {v_e47202.map((v_714568, v_a56041) => (
              <React.Fragment key={v_714568.id}>
                <TouchableOpacity
                  style={v_d81136.menuItem}
                  onPress={() => v_18219f(v_714568)}
                  activeOpacity={0.7}
                >
                  <View style={v_d81136.menuIconContainer}>
                    {v_03ce49(v_714568)}
                    {v_714568.id === 'notify' && v_79b081 && (
                      <View style={v_d81136.notificationBadge} />
                    )}
                  </View>
                  <View style={v_d81136.menuTextContainer}>
                    <Text style={v_d81136.menuLabel}>{v_714568.label}</Text>
                    <Text style={v_d81136.menuSubtitle}>{v_714568.subtitle}</Text>
                  </View>
                </TouchableOpacity>
                {v_a56041 < v_e47202.length - 1 && <View style={v_d81136.menuDivider} />}
              </React.Fragment>
            ))}
          </View>
        </SafeScrollView>
      </View>
    </SafeView >
  );
};

const v_d81136 = v_472849.create({
  container: {
    ...v_a61db3.container,
  },
  scrollContent: {

    marginHorizontal: v_9b1a04.large,
    gap: v_9b1a04.small,
    paddingTop: v_9b1a04.small,
    flex: 1,
  },

  menuListContainer: {
    flex: 1,
  },
  adBanner: {
    width: '100%',
    height: 84,
    borderWidth: 1,
    overflow: 'hidden',
    borderColor: '#ededed',
  },
  adText: {
    fontSize: v_843035.size.large,
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
    alignItems: 'center',
    gap: 16,
  },
  profileIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 30,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#ededed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: v_843035.size.medium,
    fontFamily: 'Roboto-SemiBold',
    color: '#10192d',
  },
  profileEmail: {
    fontSize: v_843035.size.msmall,
    fontFamily: 'Roboto-Regular',
    color: '#4c4e55',
    marginTop: 4,
  },
  profileActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: v_9b1a04.small,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuList: {
    backgroundColor: '#fff',
    borderRadius: v_9b1a04.medium,
    overflow: 'hidden',
    shadowColor: '#00000014',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: v_9b1a04.large,
    paddingVertical: v_9b1a04.medium,
    gap: 16,
  },
  menuIconContainer: {
    position: 'relative',
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuTextContainer: {
    flex: 1,
  },
  menuLabel: {
    fontSize: v_843035.size.medium,
    fontFamily: 'Roboto-SemiBold',
    color: '#10192d',
    marginBottom: 2,
  },
  menuSubtitle: {
    fontSize: v_843035.size.small,
    fontFamily: 'Roboto-Regular',
    color: '#6B7280',
  },
  menuDivider: {
    height: 1,
    backgroundColor: '#EEF0F5',
    marginLeft: 60, 
  },
  notificationBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF6B6B',
    borderWidth: 1.5,
    borderColor: '#fff',
  },
  headerLogoutButton: {
    width: 40,
    height: 40,
    backgroundColor: v_1bfbd0.headerIconBg,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

