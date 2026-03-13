import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Linking } from 'react-native';
import { useTranslation } from 'react-i18next';
import { SafeScrollView } from '../components';
import { Header } from '../components';
import { COMMON_STYLES, FONTS } from '../constants';

let xrunRoundLogo: any = null;
try {
  xrunRoundLogo = require('../../assets/xrun-round-logo.png');
} catch (e) {
  console.warn('xrun-round-logo.png not found');
}

export const XRUNinfoScreen = () => {
  const { t } = useTranslation();
  const handleHomepagePress = () => {
    Linking.openURL('https://www.xrun.run').catch((err) => {
      console.error('홈페이지 연결 실패:', err);
    });
  };

  return (
    <View style={styles.container}>
      <Header title="XRUN" />
      <SafeScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {}
        {xrunRoundLogo && (
          <View style={styles.logoContainer}>
            <Image
              source={xrunRoundLogo}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>
        )}

        {}
        <Text style={styles.title}>XRUN</Text>

        {}
        <View style={styles.descriptionContainer}>
          <Text style={styles.description}>
            {t('screens.xrunInfo.intro1')}{'\n'}
            {t('screens.xrunInfo.intro2')}{'\n'}
            {'\n'}
            {t('screens.xrunInfo.intro3')}{'\n'}
            {t('screens.xrunInfo.intro4')}{'\n'}
            {t('screens.xrunInfo.intro5')}
          </Text>
        </View>

        {}
        <TouchableOpacity
          style={styles.homepageLink}
          onPress={handleHomepagePress}
          activeOpacity={0.7}
        >
          <Text style={styles.homepageLinkText}>{t('screens.xrunInfo.homepageLink')}</Text>
        </TouchableOpacity>
      </SafeScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...COMMON_STYLES.container,
  },
  scrollContent: {
    flexGrow: 1,
    ...COMMON_STYLES.scrollContent,
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 60,
    marginBottom: 20,
  },
  logo: {
    width: 113,
    height: 115,
  },
  title: {
    fontSize: FONTS.size.medium,
    fontFamily: 'Roboto-Medium',
    fontWeight: '500',
    lineHeight: 24,
    color: '#121212',
    textAlign: 'center',
    marginBottom: 20,
  },
  descriptionContainer: {
    width: '100%',
    paddingHorizontal: 16,
  },
  description: {
    fontSize: FONTS.size.msmall,
    fontFamily: 'Roboto-Regular',
    fontWeight: '400',
    lineHeight: 24,
    color: '#121212',
    textAlign: 'left',
  },
  homepageLink: {
    marginTop: 24,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignSelf: 'center',
  },
  homepageLinkText: {
    fontSize: FONTS.size.msmall,
    fontFamily: 'Roboto-Medium',
    fontWeight: '500',
    color: '#007AFF',
    textDecorationLine: 'underline',
  },
});
