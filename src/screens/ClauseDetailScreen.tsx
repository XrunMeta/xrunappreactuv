import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useTranslation } from 'react-i18next';
import { Header } from '../components';
import { COLORS } from '../constants';
import { useAppNavigation } from '../navigation';
import { useAppContext } from '../context';
import { ClauseId } from '../types';
import { getClauseContent } from '../services';

const clauseTitleMap: Record<ClauseId, string> = {
  service: 'Terms of Service',
  location: 'Personal Location Information',
  personal: 'Personal Information Usage',
};

export const ClauseDetailScreen = () => {
  const { i18n, t } = useTranslation();
  const { goBack, navigate } = useAppNavigation();
  const { selectedClauseId } = useAppContext();
  const [content, setContent] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchClauseContent = async () => {
      try {
        setIsLoading(true);
        setError(null);

        let currentLanguage = i18n.language || 'ko';

        if (currentLanguage === 'zh' || currentLanguage === 'zhCN' || currentLanguage === 'zh-CN') {
          currentLanguage = 'zh-CN';
        }

        console.log('[약관] 현재 언어 코드:', currentLanguage, 'i18n.language:', i18n.language);

        const clauseType = selectedClauseId as 'service' | 'location' | 'personal';

        const clauseText = await getClauseContent(clauseType, currentLanguage, navigate);

        if (clauseText) {
          setContent(clauseText);
        } else {
          setError(t('screens.myInfoClauses.loadFailed'));
        }
      } catch (err) {
        console.error('[약관] 약관 내용 로드 오류:', err);
        setError(t('screens.myInfoClauses.loadError'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchClauseContent();
  }, [selectedClauseId, i18n.language, navigate]);

  const title = clauseTitleMap[selectedClauseId];

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <Header title={title} onBackPress={goBack} showBackButton />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.inner}>
          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={COLORS.buttonPrimary} />
              <Text style={styles.loadingText}>{t('screens.myInfoClauses.loading')}</Text>
            </View>
          ) : error ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : (
            <Text style={styles.contentText}>{content}</Text>
          )}
        </View>
      </ScrollView>
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
    paddingTop: 24,
    paddingBottom: 32,
  },
  inner: {
    width: '100%',
    maxWidth: 780,
    alignSelf: 'center',
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 14,
    fontFamily: 'Roboto-Regular',
    color: '#8e9bae',
  },
  errorContainer: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  errorText: {
    fontSize: 14,
    fontFamily: 'Roboto-Regular',
    color: '#ff6b6b',
  },
  contentText: {
    fontSize: 14,
    lineHeight: 24,
    fontFamily: 'Roboto-Regular',
    color: '#8e9bae',
  },
});

