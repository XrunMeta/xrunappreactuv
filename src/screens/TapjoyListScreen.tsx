import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeScrollView } from '../components';
import { Header } from '../components';
import { useAppNavigation } from '../navigation';
import { COLORS, COMMON_STYLES, FONTS, SIZES } from '../constants';
import { showTapjoyPlacement } from '../services/tapjoy';
import { showToast } from '../utils';

export const TapjoyListScreen = () => {
  const { goBack } = useAppNavigation();
  const [loading, setLoading] = useState(false);

  const handleShowAd = useCallback(async () => {
    setLoading(true);
    try {
      const result = await showTapjoyPlacement();
      if (result.success) {
        showToast('탭조이 광고를 불러왔습니다.');
      } else {
        showToast(result.message || '광고를 불러올 수 없습니다.');
      }
    } catch (e) {
      showToast('오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <View style={styles.container}>
      <Header title="탭조이" onBackPress={goBack} showBackButton />
      <SafeScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.inner}>
          <Text style={styles.title}>탭조이</Text>
          <Text style={styles.description}>
            아래 버튼을 누르면 Tapjoy 오퍼월(보상형 광고)이 표시됩니다.
          </Text>
          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            activeOpacity={0.8}
            onPress={handleShowAd}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.buttonText}>광고 보기</Text>
            )}
          </TouchableOpacity>
        </View>
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
    paddingHorizontal: SIZES.medium,
  },
  inner: {
    paddingVertical: SIZES.large,
  },
  title: {
    fontSize: FONTS.size.large,
    fontFamily: FONTS.family.bold,
    color: COLORS.text,
    marginBottom: SIZES.medium,
  },
  description: {
    fontSize: FONTS.size.medium,
    fontFamily: FONTS.family.regular,
    color: COLORS.text,
    opacity: 0.8,
    marginBottom: SIZES.large,
  },
  button: {
    backgroundColor: COLORS.primary,
    paddingVertical: SIZES.medium,
    paddingHorizontal: SIZES.large,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    fontSize: FONTS.size.medium,
    fontFamily: FONTS.family.semibold,
    color: '#fff',
  },
});
