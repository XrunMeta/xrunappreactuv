import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, Switch, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeScrollView } from '../components';
import { useTranslation } from 'react-i18next';
import { Header, LanguageSelector } from '../components';
import { COLORS, LIST_STYLES, COMMON_STYLES, FONTS, SIZES } from '../constants';
import { useAppNavigation, ROUTES } from '../navigation';
import {
  getCurrentAppVersionNumber,
  checkServerVersion,
  openStore
} from '../services/versionCheck';
import {
  getPushNotificationsEnabled,
  setPushNotificationsEnabled,
  getNotificationSettings,
  updateNotificationSettings,
} from '../services';
import { useAlertDialog } from '../context/AlertDialogContext';

export const MyInfoSettingsScreen = () => {
  const { goBack, navigate } = useAppNavigation();
  const { t } = useTranslation();
  const { showAlert } = useAlertDialog();
  const [languageSelectorVisible, setLanguageSelectorVisible] = useState(false);
  const [versionInfo, setVersionInfo] = useState<{
    androidCurrent: number;
    androidLatest: number;
    iosCurrent: number;
    iosLatest: number;
  } | null>(null);

  const [pushEnabled, setPushEnabled] = useState<boolean>(true);
  const [pushToggleLoading, setPushToggleLoading] = useState<boolean>(false);
  const [memberId, setMemberId] = useState<number | null>(null);

  const [noticeEnabled, setNoticeEnabled] = useState<boolean>(true);
  const [eventEnabled, setEventEnabled] = useState<boolean>(true);
  const [noticeToggleLoading, setNoticeToggleLoading] = useState<boolean>(false);
  const [eventToggleLoading, setEventToggleLoading] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      try {
        const enabled = await getPushNotificationsEnabled();
        setPushEnabled(enabled);
        const userDataStr = await AsyncStorage.getItem('userData');
        if (userDataStr) {
          const userData = JSON.parse(userDataStr);
          if (userData?.member) {
            const mid = Number(userData.member);
            setMemberId(mid);

            try {
              const res = await getNotificationSettings(mid);
              if (res) {
                setNoticeEnabled(res.notice);
                setEventEnabled(res.event);
              }
            } catch (e) {
              console.warn('[MyInfoSettings] 카테고리 설정 로드 실패:', e);
            }
          }
        }
      } catch (err) {
        console.warn('[MyInfoSettings] 푸시 상태 로드 실패:', err);
      }
    })();
  }, []);

  const handleToggleNotice = async (next: boolean) => {
    if (noticeToggleLoading || !memberId) return;
    setNoticeToggleLoading(true);
    setNoticeEnabled(next); 
    try {
      await updateNotificationSettings(memberId, { notice: next });
    } catch (e) {
      console.warn('[MyInfoSettings] 공지 토글 실패 — 롤백:', e);
      setNoticeEnabled(!next);
    } finally {
      setNoticeToggleLoading(false);
    }
  };

  const handleToggleEvent = async (next: boolean) => {
    if (eventToggleLoading || !memberId) return;
    setEventToggleLoading(true);
    setEventEnabled(next);
    try {
      await updateNotificationSettings(memberId, { event: next });
    } catch (e) {
      console.warn('[MyInfoSettings] 이벤트 토글 실패 — 롤백:', e);
      setEventEnabled(!next);
    } finally {
      setEventToggleLoading(false);
    }
  };

  const handleTogglePush = async (next: boolean) => {
    if (pushToggleLoading) return;
    if (!memberId) {
      console.warn('[MyInfoSettings] memberId 없음 — 토글 무시');
      return;
    }
    setPushToggleLoading(true);

    setPushEnabled(next);

    const prevNotice = noticeEnabled;
    const prevEvent = eventEnabled;
    if (!next) {
      setNoticeEnabled(false);
      setEventEnabled(false);
    }
    try {
      await setPushNotificationsEnabled(next, memberId, navigate);
      if (!next) {

        await updateNotificationSettings(memberId, { notice: false, event: false }).catch(() => {});
      }
    } catch (err) {
      console.warn('[MyInfoSettings] 푸시 토글 실패 — 롤백:', err);
      setPushEnabled(!next);
      if (!next) {

        setNoticeEnabled(prevNotice);
        setEventEnabled(prevEvent);
      }
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

  return (
    <View style={styles.container}>
      <Header title={t('screens.myInfoSettings.title')} onBackPress={goBack} showBackButton />
      <SafeScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.inner}>
          {
}
          <View style={[styles.card, styles.rowCard]}>
            <View style={styles.rowCardLeft}>
              <Text style={styles.cardText}>
                {t('screens.myInfoSettings.pushNotifications')}
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

          {}
          <View style={[styles.card, styles.rowCard]}>
            <View style={styles.rowCardLeft}>
              <Text style={styles.cardText}>{t('screens.myInfoSettings.noticeNotifications')}</Text>
            </View>
            {noticeToggleLoading ? (
              <ActivityIndicator size="small" color={COLORS.buttonPrimary} />
            ) : (
              <Switch
                value={noticeEnabled}
                onValueChange={handleToggleNotice}
                disabled={!memberId || !pushEnabled}
                trackColor={{ false: '#d4d4d4', true: COLORS.buttonPrimary }}
                thumbColor={'#ffffff'}
              />
            )}
          </View>

          <View style={[styles.card, styles.rowCard]}>
            <View style={styles.rowCardLeft}>
              <Text style={styles.cardText}>{t('screens.myInfoSettings.eventNotifications')}</Text>
            </View>
            {eventToggleLoading ? (
              <ActivityIndicator size="small" color={COLORS.buttonPrimary} />
            ) : (
              <Switch
                value={eventEnabled}
                onValueChange={handleToggleEvent}
                disabled={!memberId || !pushEnabled}
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
          {}
          <TouchableOpacity
            style={styles.card}
            activeOpacity={0.85}
            onPress={() => navigate(ROUTES.myInfoCloseMembership)}
          >
            <Text style={styles.cardText}>{t('screens.myInfoSettings.closeMembership')}</Text>
          </TouchableOpacity>

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

