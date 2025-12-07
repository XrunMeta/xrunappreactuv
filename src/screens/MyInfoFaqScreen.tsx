import v_a3453e, { v_df9f57, v_5ab095 } from 'bapkr';
import {
  v_94c965,
  v_326be8,
  v_472849,
  v_19b633,
  v_4623af,
  v_bfa1d6,
  v_3094a2,
} from 'rcmrninabrnb';
import { v_b5df25 } from 'ernurodqvmtspux';
import { v_772971 } from 'jmpfvteuuztnp';
import { v_25515d } from 'zvyjokvuouwvifyzks';
import { v_729608, v_570c34 } from '../components';
import { v_1bfbd0, v_a61db3, v_704d15, v_9b1a04, v_843035 } from '../constants';

if (v_326be8.OS === 'android' && v_bfa1d6.setLayoutAnimationEnabledExperimental) {
  v_bfa1d6.setLayoutAnimationEnabledExperimental(true);
}

type FaqItem = {
  id: string;
  question: string;
  answer: string;
};

export const v_083aa7 = () => {
  const { t: v_8d41d7 } = v_772971();
  const [v_c2c485, v_d24017] = v_5ab095<string[]>([]);

  const v_0ab8c5 = (v_389afb) => {
    v_94c965.configureNext(v_94c965.Presets.easeInEaseOut);
    v_d24017((v_ba2215) =>
      v_ba2215.includes(v_389afb) ? v_ba2215.filter((v_6e55b1) => v_6e55b1 !== v_389afb) : [...v_ba2215, v_389afb],
    );
  };

  const v_4622b9 = v_df9f57(() => {
    const v_a7a4ae = v_8d41d7('screens.myInfoFaq.items', { returnObjects: true }) as any;
    return [
      {
        id: 'exchange-submit',
        question: v_a7a4ae?.exchangeSubmit?.question || '',
        answer: v_a7a4ae?.exchangeSubmit?.answer || '',
      },
      {
        id: 'conversion-schedule',
        question: v_a7a4ae?.conversionSchedule?.question || '',
        answer: v_a7a4ae?.conversionSchedule?.answer || '',
      },
      {
        id: 'mission-complete',
        question: v_a7a4ae?.missionComplete?.question || '',
        answer: v_a7a4ae?.missionComplete?.answer || '',
      },
      {
        id: 'reward-check',
        question: v_a7a4ae?.rewardCheck?.question || '',
        answer: v_a7a4ae?.rewardCheck?.answer || '',
      },
      {
        id: 'xrun-exchange',
        question: v_a7a4ae?.xrunExchange?.question || '',
        answer: v_a7a4ae?.xrunExchange?.answer || '',
      },
      {
        id: 'reward-usage',
        question: v_a7a4ae?.rewardUsage?.question || '',
        answer: v_a7a4ae?.rewardUsage?.answer || '',
      },
      {
        id: 'ad-reward',
        question: v_a7a4ae?.adReward?.question || '',
        answer: v_a7a4ae?.adReward?.answer || '',
      },
      {
        id: 'change-password-request',
        question: v_a7a4ae?.changePasswordRequest?.question || '',
        answer: v_a7a4ae?.changePasswordRequest?.answer || '',
      },
      {
        id: 'change-password-how',
        question: v_a7a4ae?.changePasswordHow?.question || '',
        answer: v_a7a4ae?.changePasswordHow?.answer || '',
      },
    ];
  }, [v_8d41d7]);

  return (
    <View style={v_d81136.container}>
      <StatusBar style="dark" />
      <Header title={v_8d41d7('screens.myInfoFaq.title')} showBackButton />
      <SafeScrollView
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
      </SafeScrollView>
    </View>
  );
};

const v_d81136 = v_472849.create({
  container: {
    ...v_a61db3.container,
  },
  scrollContent: {
    ...v_a61db3.scrollContent,
  },
  list: {
    ...v_704d15.small,
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
    fontSize: v_843035.fontSize.lsmall,
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
    marginBottom: v_9b1a04.small,
  },
  answer: {
    fontSize: v_843035.fontSize.msmall,
    lineHeight: 20,
    color: '#4b5563',
    fontFamily: 'Roboto-Regular',
  },
});

