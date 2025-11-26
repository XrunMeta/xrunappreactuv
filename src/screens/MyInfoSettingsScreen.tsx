import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useTranslation } from 'react-i18next';
import { Header, LanguageSelector } from '../components';
import { COLORS, IS_DEV_MODE } from '../constants';
import { useAppNavigation, ROUTES } from '../navigation';

export const MyInfoSettingsScreen = () => {
  const { goBack, navigate } = useAppNavigation();
  const { t } = useTranslation();
  const [languageSelectorVisible, setLanguageSelectorVisible] = useState(false);

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <Header title="Setting" onBackPress={goBack} showBackButton />
      <ScrollView
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
              <Text style={styles.cardText}>🌐 언어 선택 (개발 모드)</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={styles.card}
            activeOpacity={0.85}
            onPress={() => navigate(ROUTES.myInfoCloseMembership)}
          >
            <Text style={styles.cardText}>Close Membership</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      {IS_DEV_MODE && (
        <LanguageSelector
          visible={languageSelectorVisible}
          onClose={() => setLanguageSelectorVisible(false)}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 40,
  },
  inner: {
    width: '100%',
    maxWidth: 780,
    alignSelf: 'center',
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
    fontSize: 16,
    fontFamily: 'Roboto-SemiBold',
    color: '#343434',
  },
});


