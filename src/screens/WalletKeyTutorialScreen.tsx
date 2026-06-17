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
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants';
import { SafeView, FormCheckbox, PrimaryButton } from '../components';
import { useAppNavigation, ROUTES } from '../navigation';
import { recordWalletTutorialComplete } from '../services';
import {
  TOTAL_PAGES,
  isLastPage,
  canFinish,
  TUTORIAL_PENDING_KEY,
  TUTORIAL_COMPLETED_KEY,
} from './walletKeyTutorialHelpers';

type Mode = 'signup' | 'readonly';

const PAGE_ICONS: ReadonlyArray<keyof typeof Ionicons.glyphMap> = [
  'key-outline',
  'shield-checkmark-outline',
  'eye-outline',
];

const TutorialPage: React.FC<{
  width: number;
  title: string;
  body: string[];
  iconName: keyof typeof Ionicons.glyphMap;
}> = ({ width, title, body, iconName }) => (
  <ScrollView
    style={[styles.page, { width }]}
    contentContainerStyle={styles.pageContent}
    showsVerticalScrollIndicator={false}
  >
    {}
    <View style={styles.header}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.iconBox}>
        <Ionicons name={iconName} size={28} color={COLORS.buttonPrimary} />
      </View>
    </View>

    {}
    <View style={styles.card}>
      <Text style={styles.cardHeading}>꼭 기억해주세요</Text>
      {body.map((line, i) => (
        <View key={i} style={styles.checkRow}>
          <Ionicons
            name="checkmark-circle-outline"
            size={20}
            color={COLORS.buttonPrimary}
            style={styles.checkIcon}
          />
          <Text style={styles.checkText}>{line}</Text>
        </View>
      ))}
    </View>
  </ScrollView>
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
    recordWalletTutorialComplete().catch((e) =>
      console.warn('[WalletKeyTutorial] DB 기록 실패 (로컬만 저장됨):', e),
    );
    reset(ROUTES.map);
  }, [reset]);

  const pages = Array.from({ length: TOTAL_PAGES }, (_, i) => i).map((i) => ({
    title: t(`screens.walletKeyTutorial.page${i + 1}.title`),
    body: t(`screens.walletKeyTutorial.page${i + 1}.body`, {
      returnObjects: true,
    }) as string[],
    iconName: PAGE_ICONS[i] ?? PAGE_ICONS[0],
  }));

  const onLast = isLastPage(currentPage);
  const progressPct = ((currentPage + 1) / TOTAL_PAGES) * 100;

  return (
    <SafeView style={styles.container}>
      {}
      <View style={styles.progressHeader}>
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${progressPct}%` }]} />
        </View>
        <Text style={styles.progressLabel}>
          {currentPage + 1} / {TOTAL_PAGES}
        </Text>
      </View>

      {}
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
          <TutorialPage key={i} width={width} {...p} />
        ))}
      </ScrollView>

      {}
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
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  progressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 36,
    gap: 12,
  },
  progressTrack: {
    flex: 1,
    height: 4,
    backgroundColor: '#EEEEEE',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.buttonPrimary,
    borderRadius: 2,
  },
  progressLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#9CA3AF',
    minWidth: 32,
    textAlign: 'right',
  },

  page: {
    flex: 1,
  },
  pageContent: {
    paddingHorizontal: 24,
    paddingTop: 56,
    paddingBottom: 24,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 28,
    gap: 12,
  },
  title: {
    flex: 1,
    fontSize: 26,
    fontWeight: '800',
    color: COLORS.text,
    lineHeight: 34,
    letterSpacing: -0.3,
  },
  iconBox: {
    width: 56,
    height: 56,
    borderRadius: 14,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },

  card: {
    backgroundColor: '#F5F5F7',
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  cardHeading: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 16,
    lineHeight: 22,
  },
  checkRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  checkIcon: {
    marginTop: 2,
    marginRight: 10,
  },
  checkText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 22,
    color: '#374151',
  },

  footer: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 32,
  },
  agreeWrap: {
    marginBottom: 16,
  },
  buttonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  prevBtn: {
    paddingVertical: 14,
    paddingHorizontal: 20,
  },
  prevText: {
    fontSize: 15,
    color: '#6B7280',
    fontWeight: '500',
  },
  mainBtn: {
    flex: 1,
  },
});
