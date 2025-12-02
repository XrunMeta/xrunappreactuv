import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from 'react-i18next';
import { Header, TaboolaBanner } from '../components';
import { COLORS, LANG } from '../constants';
import { ROUTES, useAppNavigation } from '../navigation';
import { getMyPageUserInfo, logout } from '../services';
import { useAppContext } from '../context';
import { shareReferralLink } from '../utils';
import { useAlertDialog } from '../context/AlertDialogContext';

type CardConfig = {
  id: string;
  label: string;
  iconName: string;
  iconLibrary: 'Feather' | 'Material';
  route?: keyof typeof ROUTES;
  disabled?: boolean;
};

export const MyInfoScreen = () => {
  const { navigate, reset, goBack, canGoBack } = useAppNavigation();
  const { t } = useTranslation();
  const { showAlert } = useAlertDialog();
  const { setVerificationEmail } = useAppContext();
  const [userInfo, setUserInfo] = useState<{
    name?: string;
    email?: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const cardConfigs: CardConfig[] = useMemo(
    () => [
      {
        id: 'edit',
        label: t('screens.myInfo.editInfo'),
        iconName: 'edit-3',
        iconLibrary: 'Feather',
        route: 'myInfoEmailAuth',
      },
      {
        id: 'notify',
        label: t('screens.myInfo.notify'),
        iconName: 'bell',
        iconLibrary: 'Feather',
        route: 'myInfoNotify',
      },
      {
        id: 'faq',
        label: t('screens.myInfo.faq'),
        iconName: 'head-question-outline',
        iconLibrary: 'Material',
        route: 'myInfoFaq',
      },
      {
        id: 'clause',
        label: t('screens.myInfo.terms'),
        iconName: 'file-text',
        iconLibrary: 'Feather',
        route: 'myInfoClauses',
      },
      {
        id: 'setting',
        label: t('screens.myInfo.settings'),
        iconName: 'settings',
        iconLibrary: 'Feather',
        route: 'myInfoSettings',
      },
      {
        id: 'referral',
        label: t('screens.myInfo.referralEdit'),
        iconName: 'refresh-ccw',
        iconLibrary: 'Feather',
        route: 'myInfoReferral',
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
              const fullName = `${firstName} ${lastName}`.trim() || '사용자';

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

  const handleCardPress = (card: CardConfig) => {
    if (card.route) {

      if (card.id === 'edit' && userInfo?.email) {
        setVerificationEmail(userInfo.email);
      }
      navigate(ROUTES[card.route]);
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
              if (!userDataStr) {
                await showAlert(t('screens.myInfo.alerts.error'), t('screens.myInfo.alerts.userDataNotFound'));
                return;
              }

              const userData = JSON.parse(userDataStr);
              const member = userData.member;

              if (!member) {
                await showAlert(t('screens.myInfo.alerts.error'), t('screens.myInfo.alerts.userDataNotFound'));
                return;
              }

              await logout(member, navigate);

              await AsyncStorage.removeItem('isLoggedIn');
              await AsyncStorage.removeItem('userEmail');
              await AsyncStorage.removeItem('userData');
              await AsyncStorage.removeItem('rageProgress');
              await AsyncStorage.removeItem('userTickets');
              await AsyncStorage.removeItem('rageProgressLastUpdate');
              await AsyncStorage.removeItem('userSessionToken');

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

  const renderIcon = (card: CardConfig) => {
    if (card.iconLibrary === 'Material') {
      return (
        <MaterialCommunityIcons
          name={card.iconName as any}
          size={18}
          color="#fff"
        />
      );
    }
    return <Feather name={card.iconName as any} size={18} color="#fff" />;
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
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
      />
      <View style={styles.scrollContent}>
        <View style={styles.inner}>
          {}
          <TaboolaBanner placementType="myinfo_OS_395x80" />

          <View style={styles.profileCard}>
            <View>
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
            <View style={styles.profileActions}>
              <TouchableOpacity
                onPress={handleShare}
                style={styles.actionButton}
                activeOpacity={0.7}
              >
                <Feather name="share-2" size={18} color={COLORS.headerText} />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleLogout}
                style={styles.actionButton}
                activeOpacity={0.7}
              >
                <MaterialCommunityIcons
                  name="logout"
                  size={18}
                  color={COLORS.headerText}
                />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.grid}>
            {cardConfigs.map((card) => (
              <TouchableOpacity
                key={card.id}
                style={[
                  styles.card,
                ]}
                onPress={() => handleCardPress(card)}
                activeOpacity={0.85}
              >
                <View style={styles.cardIcon}>{renderIcon(card)}</View>
                <Text style={styles.cardLabel}>{card.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
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

