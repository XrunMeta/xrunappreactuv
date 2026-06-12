import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, Switch, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeScrollView } from '../components';
import { useTranslation } from 'react-i18next';
import { Header, LanguageSelector } from '../components';
import { COLORS, IS_DEV_MODE, LIST_STYLES, COMMON_STYLES, FONTS, SIZES } from '../constants';
import { useAppNavigation, ROUTES } from '../navigation';
import {
  getCurrentAppVersionNumber,
  checkServerVersion,
  openStore
} from '../services/versionCheck';
import {
  getPushNotificationsEnabled,
  setPushNotificationsEnabled,
  loginWithEmailPassword,
} from '../services';
import { useAlertDialog } from '../context/AlertDialogContext';

const DEV_QUICK_LOGIN_EMAIL = 'oth-user@example.invalid';
const DEV_QUICK_LOGIN_SECRET_KEY = '__dev_quick_login_usr_secret';

export const MyInfoSettingsScreen = () => {
  const { goBack, navigate, reset } = useAppNavigation();
  const { t } = useTranslation();
  const { showAlert } = useAlertDialog();
  const [languageSelectorVisible, setLanguageSelectorVisible] = useState(false);
  const [quickLoginLoading, setQuickLoginLoading] = useState(false);
  const [versionInfo, setVersionInfo] = useState<{
    androidCurrent: number;
    androidLatest: number;
    iosCurrent: number;
    iosLatest: number;
  } | null>(null);

  const [pushEnabled, setPushEnabled] = useState<boolean>(true);
  const [pushToggleLoading, setPushToggleLoading] = useState<boolean>(false);
  const [memberId, setMemberId] = useState<number | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const enabled = await getPushNotificationsEnabled();
        setPushEnabled(enabled);
        const userDataStr = await AsyncStorage.getItem('userData');
        if (userDataStr) {
          const userData = JSON.parse(userDataStr);
          if (userData?.member) setMemberId(Number(userData.member));
        }
      } catch (err) {
        console.warn('[MyInfoSettings] 푸시 상태 로드 실패:', err);
      }
    })();
  }, []);

  const handleTogglePush = async (next: boolean) => {
    if (pushToggleLoading) return;
    if (!memberId) {
      console.warn('[MyInfoSettings] memberId 없음 — 토글 무시');
      return;
    }
    setPushToggleLoading(true);

    setPushEnabled(next);
    try {
      await setPushNotificationsEnabled(next, memberId, navigate);
    } catch (err) {
      console.warn('[MyInfoSettings] 푸시 토글 실패 — 롤백:', err);
      setPushEnabled(!next);
    } finally {
      setPushToggleLoading(false);
    }
  };

  useEffect(() => {
    const fetchVersionInfo = async () => {
      try {

        const currentVersion = getCurrentAppVersionNumber();

        const serverResponse = await checkServerVersion();

        if (serverResponse && serverResponse.data) {

          const androidLatest = serverResponse.data.version || 0;
          const iosLatest = serverResponse.data.version_ios || 0;

          const androidCurrent = Platform.OS === 'android' ? currentVersion : androidLatest;
          const iosCurrent = Platform.OS === 'ios' ? currentVersion : iosLatest;

          setVersionInfo({
            androidCurrent,
            androidLatest,
            iosCurrent,
            iosLatest,
          });
        } else {

          const androidCurrent = Platform.OS === 'android' ? currentVersion : 0;
          const iosCurrent = Platform.OS === 'ios' ? currentVersion : 0;

          setVersionInfo({
            androidCurrent,
            androidLatest: androidCurrent,
            iosCurrent,
            iosLatest: iosCurrent,
          });
        }
      } catch (error) {
        console.error('[MyInfoSettingsScreen] 버전 정보 가져오기 실패:', error);
      }
    };

    fetchVersionInfo();
  }, []);

  const handleQuickLogin = async () => {
    if (quickLoginLoading) return;
    setQuickLoginLoading(true);
    try {
      let secret = await AsyncStorage.getItem(DEV_QUICK_LOGIN_SECRET_KEY);
      if (!secret) {

        await showAlert(
          'USR_SECRET 입력 필요',
          'Metro 콘솔 또는 디바이스에서:\n' +
          'await AsyncStorage.setItem("__dev_quick_login_usr_secret", "<USR_SECRET>")\n\n' +
          '실행 후 다시 시도해주세요.',
        );
        setQuickLoginLoading(false);
        return;
      }

      const keepKeys = ['__xs_v1', '__xs_av1', DEV_QUICK_LOGIN_SECRET_KEY];
      const allKeys = await AsyncStorage.getAllKeys();
      const toRemove = allKeys.filter((k) => !keepKeys.includes(k) && (k.startsWith('userData') || k === 'userData' || k === 'jwt' || k === 'loggedIn' || k === 'userEmail'));
      if (toRemove.length > 0) await AsyncStorage.multiRemove(toRemove);

      const res = await loginWithEmailPassword(DEV_QUICK_LOGIN_EMAIL, secret);
      if (res?.status === 'success') {

        const userData = Array.isArray(res.data) ? res.data[0] : res.data;
        if (userData) {
          await AsyncStorage.setItem('userData', JSON.stringify(userData));
          await AsyncStorage.setItem('userEmail', userData.email || DEV_QUICK_LOGIN_EMAIL);
          await AsyncStorage.setItem('loggedIn', 'true');
          await AsyncStorage.setItem('remember', 'true');
        }
        console.log('[dev 빠른 로그인] 성공:', DEV_QUICK_LOGIN_EMAIL);
        reset(ROUTES.map);
      } else {
        await showAlert('로그인 실패', String((res as any)?.message ?? '시크릿 확인 후 다시 시도'));
      }
    } catch (e: any) {
      console.warn('[dev 빠른 로그인] 예외:', e?.message);
      await showAlert('로그인 오류', e?.message ?? '알 수 없는 오류');
    } finally {
      setQuickLoginLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Header title={t('screens.myInfoSettings.title')} onBackPress={goBack} showBackButton />
      <SafeScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.inner}>
          {}
          <View style={[styles.card, styles.rowCard]}>
            <View style={styles.rowCardLeft}>
              <Text style={styles.cardText}>
                {t('screens.myInfoSettings.pushNotifications')}
              </Text>
              <Text style={styles.rowCardSub}>
                {pushEnabled
                  ? t('screens.myInfoSettings.pushNotificationsOn')
                  : t('screens.myInfoSettings.pushNotificationsOff')}
              </Text>
            </View>
            {pushToggleLoading ? (
              <ActivityIndicator size="small" color={COLORS.buttonPrimary} />
            ) : (
              <Switch
                value={pushEnabled}
                onValueChange={handleTogglePush}
                disabled={!memberId}
                trackColor={{ false: '#d4d4d4', true: COLORS.buttonPrimary }}
                thumbColor={'#ffffff'}
              />
            )}
          </View>

          <TouchableOpacity
            style={styles.card}
            activeOpacity={0.85}
            onPress={() => setLanguageSelectorVisible(true)}
          >
            <Text style={styles.cardText}>{t('screens.myInfoSettings.languageSelect')}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.card}
            activeOpacity={0.85}
            onPress={() => navigate(ROUTES.walletPrivateKeyGoogleAuth)}
          >
            <Text style={styles.cardText}>{t('screens.myInfoSettings.walletBackup')}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.card}
            activeOpacity={0.85}
            onPress={() => navigate(ROUTES.walletRestore)}
          >
            <Text style={styles.cardText}>{t('screens.myInfoSettings.walletRestore')}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.card}
            activeOpacity={0.85}
            onPress={() => navigate(ROUTES.walletKeyGuide)}
          >
            <Text style={styles.cardText}>
              {t('screens.myInfoSettings.walletKeyGuide')}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.card}
            activeOpacity={0.85}
            onPress={() => navigate(ROUTES.myInfoCloseMembership)}
          >
            <Text style={styles.cardText}>{t('screens.myInfoSettings.closeMembership')}</Text>
          </TouchableOpacity>

          {}
          {IS_DEV_MODE && (
            <TouchableOpacity
              style={[styles.card, { backgroundColor: '#FEF3C7', borderWidth: 1, borderColor: '#F59E0B' }]}
              activeOpacity={0.85}
              onPress={handleQuickLogin}
              disabled={quickLoginLoading}
            >
              <Text style={[styles.cardText, { color: '#92400E' }]}>
                {quickLoginLoading ? '로그인 중...' : '🧪 khangyou7 빠른 로그인 (DEV)'}
              </Text>
            </TouchableOpacity>
          )}

          {}
          {versionInfo && (
            <TouchableOpacity
              style={styles.versionContainer}
              activeOpacity={0.7}
              onPress={openStore}
            >
              <Text style={styles.versionText}>
                {Platform.OS === 'android'
                  ? `Android : ${versionInfo.androidCurrent}/${versionInfo.androidLatest}`
                  : `iOS : ${versionInfo.iosCurrent}/${versionInfo.iosLatest}`}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </SafeScrollView>
      <LanguageSelector
        visible={languageSelectorVisible}
        onClose={() => setLanguageSelectorVisible(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...COMMON_STYLES.container,
  },
  scrollContent: {
    ...COMMON_STYLES.scrollContent,
  },
  inner: {
    ...LIST_STYLES.small,
  },
  card: {
    width: '100%',
    borderRadius: 15,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 18,
    shadowColor: '#3629b7',
    shadowOpacity: 0.07,
    shadowRadius: 15,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  cardText: {
    fontSize: FONTS.size.medium,
    fontFamily: 'Roboto-SemiBold',
    color: '#343434',
  },
  rowCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rowCardLeft: {
    flex: 1,
    marginRight: 12,
  },
  rowCardSub: {
    marginTop: 4,
    fontSize: FONTS.size.xsmall,
    fontFamily: 'Roboto-Regular',
    color: '#888888',
  },
  versionContainer: {
    width: '100%',
    paddingTop: SIZES.medium,
    paddingBottom: SIZES.small,
    alignItems: 'center',
  },
  versionText: {
    fontSize: FONTS.size.xsmall,
    fontFamily: FONTS.family.regular,
    color: '#999999',
    textAlign: 'center',
  },
});

