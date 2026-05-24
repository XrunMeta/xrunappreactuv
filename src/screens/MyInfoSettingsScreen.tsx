import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
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

export const MyInfoSettingsScreen = () => {
  const { goBack, navigate } = useAppNavigation();
  const { t } = useTranslation();
  const [languageSelectorVisible, setLanguageSelectorVisible] = useState(false);
  const [versionInfo, setVersionInfo] = useState<{
    androidCurrent: number;
    androidLatest: number;
    iosCurrent: number;
    iosLatest: number;
  } | null>(null);

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

