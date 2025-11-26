import v_a3453e, { v_df9f57, v_5ab095 } from 'bapkr';
import {
  v_94c965,
  v_326be8,
  v_122070,
  v_472849,
  v_19b633,
  v_4623af,
  v_bfa1d6,
  v_3094a2,
} from 'rcmrninabrnb';
import { v_b5df25 } from 'ernurodqvmtspux';
import { v_772971 } from 'jmpfvteuuztnp';
import { v_25515d } from 'zvyjokvuouwvifyzks';
import { v_729608 } from '../components';
import { v_1bfbd0 } from '../constants';

if (v_326be8.OS === 'android' && v_bfa1d6.setLayoutAnimationEnabledExperimental) {
  v_bfa1d6.setLayoutAnimationEnabledExperimental(true);
}

type FaqItem = {
  id: string;
  question: string;
  answer: string;
};

const v_0e9014 = [
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

export const v_083aa7 = () => {
  const { t: v_8d41d7 } = v_772971();
  const [v_c2c485, v_d24017] = v_5ab095<string[]>([]);

  const v_0ab8c5 = (v_389afb) => {
    v_94c965.configureNext(v_94c965.Presets.easeInEaseOut);
    v_d24017((v_ba2215) =>
      v_ba2215.includes(v_389afb) ? v_ba2215.filter((v_6e55b1) => v_6e55b1 !== v_389afb) : [...v_ba2215, v_389afb],
    );
  };

  const v_4622b9 = v_df9f57(() => v_0e9014, []);

  return (
    <View style={v_d81136.container}>
      <StatusBar style="dark" />
      <Header title={v_8d41d7('screens.myInfoFaq.title')} showBackButton />
      <ScrollView
        contentContainerStyle={v_d81136.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={v_d81136.list}>
          {v_4622b9.map((v_8c0b26) => {
            const v_ebda8f = v_c2c485.includes(v_8c0b26.id);
            return (
              <View key={v_8c0b26.id} style={v_d81136.card}>
                <TouchableOpacity
                  style={v_d81136.cardHeader}
                  onPress={() => v_0ab8c5(v_8c0b26.id)}
                  activeOpacity={0.8}
                >
                  <Text style={v_d81136.question}>{v_8c0b26.question}</Text>
                  <Ionicons
                    name={v_ebda8f ? 'chevron-up' : 'chevron-down'}
                    size={18}
                    color="#94a3b8"
                  />
                </TouchableOpacity>
                {v_ebda8f ? (
                  <View style={v_d81136.answerWrapper}>
                    <Text style={v_d81136.answer}>{v_8c0b26.answer}</Text>
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

const v_d81136 = v_472849.create({
  container: {
    flex: 1,
    backgroundColor: v_1bfbd0.background,
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

