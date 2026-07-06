import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, ActivityIndicator, Alert } from 'react-native';
import { SafeScrollView } from '../components';
import { useTranslation } from 'react-i18next';
import { Header } from '../components';
import { LoadingText } from '../components/AnimatedDots';
import { useAppNavigation } from '../navigation';
import { useAppContext } from '../context';
import { COMMON_STYLES, FONTS, COLORS } from '../constants';
import { getAgreementByType } from '../services';
import { AgreementData } from '../types';

export const TermsScreen = () => {
  const { t } = useTranslation();
  const { goBack, navigate } = useAppNavigation();
  const { selectedAgreementType } = useAppContext();
  const [agreementData, setAgreementData] = useState<AgreementData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const agreementType = selectedAgreementType || 'service';

  useEffect(() => {
    const fetchAgreement = async () => {
      try {
        setLoading(true);
        setError(null);

        console.log('[약관] 약관 데이터 로드 시작:', { agreementType });

        const response = await getAgreementByType(agreementType, { navigate });

        if (response.success && response.data) {

          const data = Array.isArray(response.data) ? response.data[0] : response.data;
          setAgreementData(data);
          console.log('[약관] 약관 데이터 로드 성공:', { type: data.type, title: data.title });
        } else {
          throw new Error('약관 데이터를 가져올 수 없습니다.');
        }
      } catch (err) {
        console.error('[약관] 약관 데이터 로드 실패:', err);
        const errorMessage = err instanceof Error ? err.message : '약관 데이터를 불러오는 중 오류가 발생했습니다.';
        setError(errorMessage);
        Alert.alert(
          t('screens.terms.error.title', '오류'),
          errorMessage,
          [{ text: t('screens.terms.error.ok', '확인') }]
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAgreement();
  }, [agreementType, navigate, t]);

  return (
    <View style={styles.container}>
      <Header title={t('screens.terms.title')} onBackPress={goBack} showBackButton />
      <SafeScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={COLORS.buttonPrimary} />
            <LoadingText text={t('screens.terms.loading', '약관을 불러오는 중...')} style={styles.loadingText} />
          </View>
        ) : error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : agreementData ? (
          <View style={styles.card}>
            {agreementData.title && (
              <Text style={styles.titleText}>{agreementData.title}</Text>
            )}
            <Text style={styles.contentText}>{agreementData.content}</Text>
          </View>
        ) : (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{t('screens.terms.noData', '약관 데이터가 없습니다.')}</Text>
          </View>
        )}
      </SafeScrollView>
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
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
    marginBottom: 10,
  },
  titleText: {
    fontSize: FONTS.size.large,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 16,
    fontFamily: 'Roboto-Bold',
  },
  contentText: {
    fontSize: FONTS.size.medium,
    lineHeight: 18,
    fontFamily: 'Roboto-Regular',
    color: COLORS.text,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    marginTop: 16,
    fontSize: FONTS.size.medium,
    color: COLORS.text,
    fontFamily: 'Roboto-Regular',
  },
  errorContainer: {
    padding: 20,
    alignItems: 'center',
  },
  errorText: {
    fontSize: FONTS.size.medium,
    color: COLORS.error,
    fontFamily: 'Roboto-Regular',
    textAlign: 'center',
  },
});

