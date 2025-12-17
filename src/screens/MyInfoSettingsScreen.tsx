import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeScrollView } from '../components';
import { useTranslation } from 'react-i18next';
import { Header, LanguageSelector } from '../components';
import { COLORS, IS_DEV_MODE, LIST_STYLES, COMMON_STYLES, FONTS } from '../constants';
import { useAppNavigation, ROUTES } from '../navigation';

export const MyInfoSettingsScreen = () => {
  const { goBack, navigate } = useAppNavigation();
  const { t } = useTranslation();
  const [languageSelectorVisible, setLanguageSelectorVisible] = useState(false);

  return (
    <View style={styles.container}>
      <Header title={t('screens.myInfoSettings.title')} onBackPress={goBack} showBackButton />
      <SafeScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.inner}>
          {IS_DEV_MODE && (
            <TouchableOpacity
              style={styles.card}
              activeOpacity={0.85}
              onPress={() => setLanguageSelectorVisible(true)}
            >
              <Text style={styles.cardText}>{t('screens.myInfoSettings.languageSelect')}</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={styles.card}
            activeOpacity={0.85}
            onPress={() => navigate(ROUTES.myInfoCloseMembership)}
          >
            <Text style={styles.cardText}>{t('screens.myInfoSettings.closeMembership')}</Text>
          </TouchableOpacity>
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
});


