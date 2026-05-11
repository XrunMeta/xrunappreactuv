import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  LayoutAnimation,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { Header, SafeScrollView } from '../components';
import { COLORS, COMMON_STYLES, LIST_STYLES, SIZES, FONTS } from '../constants';

const FAQ_API_BASE = 'https://oth-path-gw.example.invalid/oth-path';

type FaqItem = {
  id: string;
  question: string;
  answer: string;
};

export const MyInfoFaqScreen = () => {
  const { t, i18n } = useTranslation();
  const [expandedIds, setExpandedIds] = useState<string[]>([]);
  const [items, setItems] = useState<FaqItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {

        const lng = i18n.language || 'ko';
        const resp = await fetch(`${FAQ_API_BASE}?language=${encodeURIComponent(lng)}`);
        const json = await resp.json();
        if (json.success && Array.isArray(json.data)) {
          setItems(json.data.map((item: any) => ({
            id: `db-${item.id}`,
            question: item.question || '',
            answer: item.answer || '',
          })));
        }
      } catch (e) {
        console.warn('[FAQ] API 로드 실패:', e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const toggleItem = (id: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedIds((prev) =>
      prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id],
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <Header title={t('screens.myInfoFaq.title')} showBackButton />
      <SafeScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {loading && (
          <ActivityIndicator size="small" color={COLORS.primary} style={{ marginTop: 20 }} />
        )}
        <View style={styles.list}>
          {items.map((item) => {
            const expanded = expandedIds.includes(item.id);
            return (
              <View key={item.id} style={styles.card}>
                <TouchableOpacity
                  style={styles.cardHeader}
                  onPress={() => toggleItem(item.id)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.question}>{item.question}</Text>
                  <Ionicons
                    name={expanded ? 'chevron-up' : 'chevron-down'}
                    size={18}
                    color="#94a3b8"
                  />
                </TouchableOpacity>
                {expanded ? (
                  <View style={styles.answerWrapper}>
                    <Text style={styles.answer}>{item.answer}</Text>
                  </View>
                ) : null}
              </View>
            );
          })}
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
  },
  list: {
    ...LIST_STYLES.small,
  },
  card: {
    borderRadius: 16,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#eef1f6',
    overflow: 'hidden',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingVertical: 16,
  },
  question: {
    flex: 1,
    fontSize: FONTS.size.medium,
    fontFamily: 'Roboto-Medium',
    marginRight: 12,
  },
  answerWrapper: {
    borderTopWidth: 1,
    borderTopColor: '#f4f5f7',
    paddingHorizontal: 18,
    paddingVertical: 16,
    backgroundColor: '#f9fafc',
    marginBottom: SIZES.small,
  },
  answer: {
    fontSize: FONTS.size.msmall,
    lineHeight: 20,
    color: '#4b5563',
    fontFamily: 'Roboto-Regular',
  },
});

