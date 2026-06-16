import React, { useCallback, useRef, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  useWindowDimensions,
  StyleSheet,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS } from '../constants';
import { SafeView, FormCheckbox, PrimaryButton } from '../components';
import { useAppNavigation, ROUTES } from '../navigation';
import {
  TOTAL_PAGES,
  isLastPage,
  canFinish,
  TUTORIAL_PENDING_KEY,
  TUTORIAL_COMPLETED_KEY,
} from './walletKeyTutorialHelpers';

type Mode = 'signup' | 'readonly';

const TutorialPage: React.FC<{
  width: number;
  title: string;
  body: string[];
  pageIndex: number;
  totalPages: number;
}> = ({ width, title, body, pageIndex, totalPages }) => (

  <View style={[styles.page, { width }]}>
    <View style={styles.pageInner}>
      <Text style={styles.stepLabel}>
        {`STEP ${pageIndex + 1} / ${totalPages}`}
      </Text>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.divider} />
      {body.map((line, i) => (
        <Text key={i} style={styles.bodyLine}>
          {`• ${line}`}
        </Text>
      ))}
    </View>
  </View>
);

export const WalletKeyTutorialScreen: React.FC<{ mode: Mode }> = ({ mode }) => {
  const { t } = useTranslation();
  const { reset, goBack } = useAppNavigation();
  const { width } = useWindowDimensions();
  const scrollRef = useRef<ScrollView>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [agreed, setAgreed] = useState(false);

  const goToPage = useCallback(
    (page: number) => {
      const clamped = Math.max(0, Math.min(TOTAL_PAGES - 1, page));
      scrollRef.current?.scrollTo({ x: clamped * width, animated: true });
      setCurrentPage(clamped);
    },
    [width],
  );

  const onScrollEnd = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      const page = Math.round(e.nativeEvent.contentOffset.x / width);
      setCurrentPage(page);
    },
    [width],
  );

  const onFinish = useCallback(async () => {
    try {
      await AsyncStorage.setItem(TUTORIAL_COMPLETED_KEY, 'true');
      await AsyncStorage.removeItem(TUTORIAL_PENDING_KEY);
    } catch (e) {
      console.warn('[WalletKeyTutorial] 완료 플래그 저장 실패:', e);
    }
    reset(ROUTES.map);
  }, [reset]);

  const pages = Array.from({ length: TOTAL_PAGES }, (_, i) => i).map((i) => ({
    title: t(`screens.walletKeyTutorial.page${i + 1}.title`),
    body: t(`screens.walletKeyTutorial.page${i + 1}.body`, {
      returnObjects: true,
    }) as string[],
  }));

  const onLast = isLastPage(currentPage);

  return (
    <SafeView style={styles.container}>
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={onScrollEnd}
        scrollEventThrottle={16}
        style={{ flex: 1 }}
      >
        {pages.map((p, i) => (
          <TutorialPage key={i} width={width} pageIndex={i} totalPages={TOTAL_PAGES} {...p} />
        ))}
      </ScrollView>

      <View style={styles.dots}>
        {pages.map((_, i) => (
          <View
            key={i}
            style={[styles.dot, i === currentPage && styles.dotActive]}
          />
        ))}
      </View>

      <View style={styles.footer}>
        {mode === 'signup' && onLast && (
          <View testID="tutorial-agree-wrap" style={styles.agreeWrap}>
            <FormCheckbox
              testID="tutorial-agree"
              checked={agreed}
              onToggle={() => setAgreed((v) => !v)}
              label={t('screens.walletKeyTutorial.agree.label')}
            />
          </View>
        )}

        <View style={styles.buttonRow}>
          {currentPage > 0 && (
            <TouchableOpacity
              testID="tutorial-prev"
              style={styles.prevBtn}
              onPress={() => goToPage(currentPage - 1)}
            >
              <Text style={styles.prevText}>
                {t('screens.walletKeyTutorial.button.prev')}
              </Text>
            </TouchableOpacity>
          )}

          {mode === 'readonly' && onLast ? (
            <PrimaryButton
              testID="tutorial-close"
              title={t('screens.walletKeyTutorial.readonly.close')}
              onPress={goBack}
              style={styles.mainBtn}
            />
          ) : mode === 'signup' && onLast ? (
            <PrimaryButton
              testID="tutorial-start"
              title={t('screens.walletKeyTutorial.button.start')}
              disabled={!canFinish(currentPage, agreed)}
              onPress={onFinish}
              style={styles.mainBtn}
            />
          ) : (
            <PrimaryButton
              testID="tutorial-next"
              title={t('screens.walletKeyTutorial.button.next')}
              onPress={() => goToPage(currentPage + 1)}
              style={styles.mainBtn}
            />
          )}
        </View>
      </View>
    </SafeView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },

  page: {
    paddingHorizontal: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },

  pageInner: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingHorizontal: 24,
    paddingVertical: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 2,
  },
  stepLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.buttonPrimary,
    letterSpacing: 1,
    textAlign: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: 16,
  },
  divider: {
    height: 1,
    backgroundColor: '#EAEAEA',
    marginBottom: 20,
  },
  bodyLine: {
    fontSize: 15,
    lineHeight: 24,
    color: COLORS.text,
    marginBottom: 10,
  },
  dots: { flexDirection: 'row', justifyContent: 'center', marginVertical: 16 },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
    backgroundColor: '#D0D0D0',
  },
  dotActive: { backgroundColor: COLORS.buttonPrimary, width: 20 },
  footer: { paddingHorizontal: 24, paddingBottom: 32 },
  agreeWrap: { marginBottom: 16 },
  buttonRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  prevBtn: { paddingVertical: 14, paddingHorizontal: 20 },
  prevText: { fontSize: 16, color: COLORS.text },
  mainBtn: { flex: 1 },
});
