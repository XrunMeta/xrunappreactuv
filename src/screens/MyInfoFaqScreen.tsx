import React, { useMemo, useState } from 'react';
import {
  LayoutAnimation,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  UIManager,
  View,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { Header } from '../components';
import { COLORS } from '../constants';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

type FaqItem = {
  id: string;
  question: string;
  answer: string;
};

const FAQ_ITEMS: FaqItem[] = [
  {
    id: 'exchange-submit',
    question: '교환 신청한 코인은 언제 지급되나요?',
    answer: '교환 신청한 코인은 신청서 제출 즉시 지급됩니다.',
  },
  {
    id: 'conversion-schedule',
    question: '전환 신청한 코인은 언제 지급되나요?',
    answer:
      '전환 신청한 코인은 신청 후 3일 이내에 신청 순서에 따라 지급됩니다.',
  },
  {
    id: 'mission-complete',
    question: '미션은 어떻게 완료하나요?',
    answer:
      '메인 화면에 표시된 미션 위치를 확인한 뒤, 해당 위치를 AR 기능으로 전환하여 증강된 암호화폐를 잡으면 미션을 수행할 수 있습니다.',
  },
  {
    id: 'reward-check',
    question: '보상받은 코인은 어디서 확인할 수 있나요?',
    answer:
      '미션을 완료한 후, 앱 내 지갑에서 보상받은 코인을 확인할 수 있습니다.',
  },
  {
    id: 'xrun-exchange',
    question: '다른 암호화폐를 XRUN 코인으로 교환하려면 어떻게 하나요?',
    answer:
      '다른 암호화폐는 인앱 지갑의 코인 교환을 통해 XRUN 코인으로 교환할 수 있습니다. 교환 시 교환할 코인 수량을 입력하고 요청하면 XRUN 코인 비율에 맞춰 교환되어 지급됩니다.',
  },
  {
    id: 'reward-usage',
    question: '보상받은 코인은 어떻게 사용하나요?',
    answer:
      '보상받은 코인은 인앱 지갑에서 전환 및 교환을 요청하여 실제 코인으로 교환할 수 있습니다. 실제 코인은 외부 거래소에서 자유롭게 판매 및 사용할 수 있습니다.',
  },
  {
    id: 'ad-reward',
    question: '광고 보상은 어떻게 받나요?',
    answer:
      'AR 미션에 참가하여 미션을 완료하면 광고에 설정된 보상 수만큼 코인을 받을 수 있습니다.',
  },
  {
    id: 'change-password-request',
    question: '비밀번호를 변경하고 싶습니다',
    answer: '내정보 > 정보수정 > 비밀번호에서 변경할 수 있습니다.',
  },
  {
    id: 'change-password-how',
    question: '비밀번호는 어떻게 변경하나요?',
    answer:
      '내정보 > 정보수정 > 비밀번호에서 변경할 수 있습니다. 좋은 하루 되세요^^!',
  },
];

export const MyInfoFaqScreen = () => {
  const { t } = useTranslation();
  const [expandedIds, setExpandedIds] = useState<string[]>([]);

  const toggleItem = (id: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedIds((prev) =>
      prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id],
    );
  };

  const items = useMemo(() => FAQ_ITEMS, []);

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <Header title={t('screens.myInfoFaq.title')} showBackButton />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
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
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 40,
  },
  list: {
    width: '100%',
    maxWidth: 780,
    alignSelf: 'center',
    gap: 12,
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
    fontSize: 15,
    fontFamily: 'Roboto-Medium',
    color: '#111827',
    marginRight: 12,
  },
  answerWrapper: {
    borderTopWidth: 1,
    borderTopColor: '#f4f5f7',
    paddingHorizontal: 18,
    paddingVertical: 16,
    backgroundColor: '#f9fafc',
  },
  answer: {
    fontSize: 14,
    lineHeight: 20,
    color: '#4b5563',
    fontFamily: 'Roboto-Regular',
  },
});

