import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Image,
} from 'react-native';
import { Feather, MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from 'react-i18next';
import { Header, TaboolaBanner } from '../components';
import { COLORS, COMMON_STYLES, LANG, FONTS, SIZES } from '../constants';
import { ROUTES, useAppNavigation } from '../navigation';
import { getMyPageUserInfo, logout, getNotificationList } from '../services';
import { useAppContext } from '../context';
import { shareReferralLink } from '../utils';
import { useAlertDialog } from '../context/AlertDialogContext';
import { SafeScrollView, SafeView } from '../components';

type MenuConfig = {
  id: string;
  label: string;
  subtitle: string;
  iconName: string;
  iconLibrary: 'Feather' | 'Material' | 'Ionicons' | 'MaterialCommunityIcons';
  iconColor: string;

  iconImage?: number;
  route?: keyof typeof ROUTES;
  disabled?: boolean;
};

export const MyInfoScreen = () => {
  const { navigate, reset, goBack, canGoBack, currentScreen } = useAppNavigation();
  const { t } = useTranslation();
  const { showAlert } = useAlertDialog();
  const { setVerificationEmail } = useAppContext();
  const [userInfo, setUserInfo] = useState<{
    name?: string;
    email?: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState(false);

  const menuConfigs: MenuConfig[] = useMemo(
    () => [
      {
        id: 'edit',
        label: t('screens.myInfo.editInfo'),
        subtitle: t('screens.myInfo.editInfoSubtitle'),
        iconName: 'person-outline',
        iconLibrary: 'Ionicons',
        iconColor: '#6366F1',
        route: 'myInfoEmailAuth',
      },
      {
        id: 'referralList',
        label: t('screens.myInfo.referral'),
        subtitle: t('screens.myInfo.referralSubtitle'),
        iconName: 'people-outline',
        iconLibrary: 'Ionicons',
        iconColor: '#6366F1',
        iconImage: require('../../assets/images/icon_referral_list.png'),
        route: 'referralMyGroup',
      },
      {
        id: 'referral',
        label: t('screens.myInfo.referralEdit'),
        subtitle: t('screens.myInfo.referralEditSubtitle'),
        iconName: 'people-outline',
        iconLibrary: 'Ionicons',
        iconColor: '#EC4899',
        route: 'myInfoReferral',
      },
      {
        id: 'shopSales',
        label: t('screens.myInfo.shopSales'),
        subtitle: t('screens.myinfoShopSales.title'),
        iconName: 'storefront-outline',
        iconLibrary: 'Ionicons',
        iconColor: '#7ca6e8',
        route: 'myinfoShopSales',
      },
      {
        id: 'notify',
        label: t('screens.myInfo.notify'),
        subtitle: t('screens.myInfo.notifySubtitle'),
        iconName: 'notifications-outline',
        iconLibrary: 'Ionicons',
        iconColor: '#10B981',
        route: 'myInfoNotify',
      },
      {
        id: 'faq',
        label: t('screens.myInfo.faq'),
        subtitle: t('screens.myInfo.faqSubtitle'),
        iconName: 'help-circle-outline',
        iconLibrary: 'Ionicons',
        iconColor: '#F59E0B',
        route: 'myInfoFaq',
      },
      {
        id: 'clause',
        label: t('screens.myInfo.terms'),
        subtitle: t('screens.myInfo.termsSubtitle'),
        iconName: 'document-text-outline',
        iconLibrary: 'Ionicons',
        iconColor: '#3B82F6',
        route: 'myInfoClauses',
      },
      {
        id: 'setting',
        label: t('screens.myInfo.settings'),
        subtitle: t('screens.myInfo.settingsSubtitle'),
        iconName: 'settings-outline',
        iconLibrary: 'Ionicons',
        iconColor: '#8B5CF6',
        route: 'myInfoSettings',
      },
    ],
    [t],
  );

  useEffect(() => {
    const loadUserInfo = async () => {
      try {

        const userDataStr = await AsyncStorage.getItem('userData');
        if (userDataStr) {
          const userData = JSON.parse(userDataStr);
          const member = userData.member;

          if (member) {
            const response = await getMyPageUserInfo(member, navigate);
            const user = response.data[0];

            if (user) {
              const firstName = user.firstname || '';
              const lastName = user.lastname || '';
              const fullName = `${lastName} ${firstName}`.trim() || '사용자';

              setUserInfo({
                name: fullName,
                email: user.email || '',
              });
            }
          }
        }
      } catch (error) {
        console.error('[마이페이지] 사용자 정보 로드 실패:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUserInfo();
  }, [navigate]);

  useEffect(() => {

    if (currentScreen !== 'myInfo') {
      return;
    }

    const checkNotifications = async () => {
      try {
        const userDataStr = await AsyncStorage.getItem('userData');
        if (userDataStr) {
          const userData = JSON.parse(userDataStr);
          const member = userData.member;

          if (member) {
            const response = await getNotificationList(member, 0, navigate);
            if (response?.data && response.data.length > 0) {

              const lastCheckedTime = await AsyncStorage.getItem('lastNotificationCheckTime');
              const lastChecked = lastCheckedTime ? new Date(lastCheckedTime).getTime() : 0;

              const hasNewNotifications = response.data.some((notification) => {
                const notificationTime = new Date(notification.datetime).getTime();
                return notificationTime > lastChecked;
              });

              setHasUnreadNotifications(hasNewNotifications);
            } else {
              setHasUnreadNotifications(false);
            }
          }
        }
      } catch (error) {
        console.error('[마이페이지] 알림 확인 실패:', error);

        setHasUnreadNotifications(false);
      }
    };

    checkNotifications();

    const interval = setInterval(checkNotifications, 30000);

    return () => clearInterval(interval);
  }, [navigate, currentScreen]);

  const handleMenuPress = async (menu: MenuConfig) => {
    if (menu.route) {

      if (menu.id === 'edit') {

        const loginType = await AsyncStorage.getItem('loginType');
        const isAppleLogin = loginType === 'apple';

        if (isAppleLogin) {

          console.log('[내 정보] 애플 로그인 사용자 - 정보 수정 화면으로 직접 이동');
          navigate(ROUTES.myInfoEdit);
        } else {

          if (userInfo?.email) {
            setVerificationEmail(userInfo.email);
          }
          navigate(ROUTES.myInfoEmailAuth);
        }
      } else {
        navigate(ROUTES[menu.route]);
      }
    }
  };

  const handleShare = async () => {
    if (!userInfo?.email) {
      await showAlert(t('screens.myInfo.alerts.shareFailed'), t('screens.myInfo.alerts.shareFailedMessage'));
      return;
    }
    await shareReferralLink(t, { email: userInfo.email }, showAlert, navigate);
  };

  const handleLogout = async () => {
    await showAlert(
      t('screens.myInfo.alerts.logout'),
      t('screens.myInfo.alerts.logoutMessage'),
      [
        {
          text: t('screens.myInfo.alerts.cancel'),
          style: 'cancel',
        },
        {
          text: t('screens.myInfo.alerts.logout'),
          style: 'destructive',
          onPress: async () => {
            try {

              const userDataStr = await AsyncStorage.getItem('userData');
              let member: number | undefined = undefined;

              if (userDataStr) {
                try {
                  const userData = JSON.parse(userDataStr);
                  member = userData.member;
                } catch (parseError) {
                  console.error('[로그아웃] userData 파싱 오류:', parseError);
                }
              }

              if (member) {
                try {
                  await logout(member, navigate);
                } catch (logoutError) {
                  console.error('[로그아웃] 로그아웃 API 호출 실패:', logoutError);

                }
              } else {
                console.log('[로그아웃] 사용자 정보 없음 - 로컬 데이터만 삭제하고 로그인 화면으로 이동');
              }

              await AsyncStorage.removeItem('isLoggedIn');
              await AsyncStorage.removeItem('userEmail');
              await AsyncStorage.removeItem('userData');
              await AsyncStorage.removeItem('rageProgress');
              await AsyncStorage.removeItem('userTickets');
              await AsyncStorage.removeItem('rageProgressLastUpdate');
              await AsyncStorage.removeItem('userSessionToken');

              await AsyncStorage.removeItem('appleSignupCompleted');
              await AsyncStorage.removeItem('appleSignupCompletedEmail');
              await AsyncStorage.removeItem('appleSignupRequired');
              await AsyncStorage.removeItem('appleSignupEmail');
              await AsyncStorage.removeItem('googleSignupRequired');
              await AsyncStorage.removeItem('googleSignupEmail');

              reset(ROUTES.login);
            } catch (error) {
              console.error('[로그아웃] 로그아웃 처리 중 오류:', error);

              try {
                await AsyncStorage.removeItem('isLoggedIn');
                await AsyncStorage.removeItem('userEmail');
                await AsyncStorage.removeItem('userData');
                await AsyncStorage.removeItem('rageProgress');
                await AsyncStorage.removeItem('userTickets');
                await AsyncStorage.removeItem('rageProgressLastUpdate');
                await AsyncStorage.removeItem('userSessionToken');

                await AsyncStorage.removeItem('appleSignupCompleted');
                await AsyncStorage.removeItem('appleSignupCompletedEmail');
                await AsyncStorage.removeItem('appleSignupRequired');
                await AsyncStorage.removeItem('appleSignupEmail');
                await AsyncStorage.removeItem('googleSignupRequired');
                await AsyncStorage.removeItem('googleSignupEmail');
              } catch (storageError) {
                console.error('[로그아웃] AsyncStorage 삭제 중 오류:', storageError);
              }
              reset(ROUTES.login);
            }
          },
        },
      ],
    );
  };

  const renderMenuIcon = (menu: MenuConfig) => {
    const iconSize = 24;
    if (menu.iconImage) {
      return (
        <Image
          source={menu.iconImage}
          style={{ width: iconSize, height: iconSize }}
          resizeMode="contain"
        />
      );
    }
    if (menu.iconLibrary === 'Ionicons') {
      return <Ionicons name={menu.iconName as any} size={iconSize} color={menu.iconColor} />;
    }
    if (menu.iconLibrary === 'Material') {
      return (
        <MaterialCommunityIcons
          name={menu.iconName as any}
          size={iconSize}
          color={menu.iconColor}
        />
      );
    }
    return <Feather name={menu.iconName as any} size={iconSize} color={menu.iconColor} />;
  };

  return (
    <SafeView style={styles.container} backgroundColor={"#f7f7fb"}>
      <Header
        title={t('screens.myInfo.title')}
        onBackPress={() => {
          if (canGoBack) {
            goBack();
          } else {
            reset(ROUTES.map);
          }
        }}
        showBackButton
        rightComponent={
          <TouchableOpacity
            onPress={handleLogout}
            style={styles.headerLogoutButton}
            activeOpacity={0.7}
          >
            <MaterialCommunityIcons name="logout" size={20} color={COLORS.headerText} />
          </TouchableOpacity>
        }
      />
      {}
      <View style={styles.adBanner}>
        < TaboolaBanner placementType="myinfo_OS_395x80" />
      </View>

      <View style={styles.scrollContent}>
        <View style={styles.profileCard}>
          <View style={styles.profileIconContainer}>
            <Ionicons name="person-outline" size={28} color="#666666" />
          </View>
          <View style={styles.profileInfo}>
            {isLoading ? (
              <ActivityIndicator size="small" color={COLORS.headerText} />
            ) : (
              <>
                <Text style={styles.profileName}>
                  {userInfo?.name || '사용자'}
                </Text>
                <Text style={styles.profileEmail}>
                  {userInfo?.email || ''}
                </Text>
              </>
            )}
          </View>

        </View>
        <SafeScrollView style={styles.menuListContainer} showsVerticalScrollIndicator={false} showBottomBackground={false} backgroundColor='transparent'>
          {}
          <View style={styles.menuList}>
            {menuConfigs.map((menu, index) => (
              <React.Fragment key={menu.id}>
                <TouchableOpacity
                  style={styles.menuItem}
                  onPress={() => handleMenuPress(menu)}
                  activeOpacity={0.7}
                >
                  <View style={styles.menuIconContainer}>
                    {renderMenuIcon(menu)}
                    {menu.id === 'notify' && hasUnreadNotifications && (
                      <View style={styles.notificationBadge} />
                    )}
                  </View>
                  <View style={styles.menuTextContainer}>
                    <Text style={styles.menuLabel}>{menu.label}</Text>
                    <Text style={styles.menuSubtitle}>{menu.subtitle}</Text>
                  </View>
                </TouchableOpacity>
                {index < menuConfigs.length - 1 && <View style={styles.menuDivider} />}
              </React.Fragment>
            ))}
          </View>
        </SafeScrollView>
      </View>
    </SafeView >
  );
};

const styles = StyleSheet.create({
  container: {
    ...COMMON_STYLES.container,
  },
  scrollContent: {

    marginHorizontal: SIZES.large,
    gap: SIZES.small,
    paddingTop: SIZES.small,
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
    fontSize: FONTS.size.large,
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
    fontSize: FONTS.size.medium,
    fontFamily: 'Roboto-SemiBold',
    color: '#10192d',
  },
  profileEmail: {
    fontSize: FONTS.size.msmall,
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
    borderRadius: SIZES.small,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuList: {
    backgroundColor: '#fff',
    borderRadius: SIZES.medium,
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
    paddingHorizontal: SIZES.large,
    paddingVertical: SIZES.medium,
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
    fontSize: FONTS.size.medium,
    fontFamily: 'Roboto-SemiBold',
    color: '#10192d',
    marginBottom: 2,
  },
  menuSubtitle: {
    fontSize: FONTS.size.small,
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
    backgroundColor: COLORS.headerIconBg,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

