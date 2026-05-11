import v_a3453e, { v_c4deb2, v_5ab095 } from 'bapkr';
import {
  v_39a996,
  v_94c965,
  v_472849,
  v_19b633,
  v_4623af,
  v_3094a2,
} from 'rcmrninabrnb';
import { v_b5df25 } from 'ernurodqvmtspux';
import { v_772971 } from 'jmpfvteuuztnp';
import { v_25515d } from 'zvyjokvuouwvifyzks';
import { v_729608, v_570c34 } from '../components';
import { v_1bfbd0, v_a61db3, v_704d15, v_9b1a04, v_843035 } from '../constants';

const v_fb6568 = 'https://oth-path-f0013c.example.invalid/oth-path';

type FaqItem = {
  id: string;
  question: string;
  answer: string;
};

export const v_083aa7 = () => {
  const { t: v_8d41d7, i18n: v_9c213b } = v_772971();
  const [v_c2c485, v_d24017] = v_5ab095<string[]>([]);
  const [v_4622b9, v_fa923c] = v_5ab095<FaqItem[]>([]);
  const [v_683210, v_34a50a] = v_5ab095(true);

  v_c4deb2(() => {
    (async () => {
      try {

        const v_c87b30 = v_9c213b.language || 'ko';
        const v_eb792a = await fetch(`${v_fb6568}?language=${encodeURIComponent(v_c87b30)}`);
        const v_7ecfd1 = await v_eb792a.json();
        if (v_7ecfd1.success && Array.isArray(v_7ecfd1.data)) {
          v_fa923c(v_7ecfd1.data.map((v_8c0b26) => ({
            id: `db-${v_8c0b26.id}`,
            question: v_8c0b26.question || '',
            answer: v_8c0b26.answer || '',
          })));
        }
      } catch (v_9e86fd) {
        console.warn('[FAQ] API 로드 실패:', v_9e86fd);
      } finally {
        v_34a50a(false);
      }
    })();
  }, []);

  const v_0ab8c5 = (v_389afb) => {
    v_94c965.configureNext(v_94c965.Presets.easeInEaseOut);
    v_d24017((v_ba2215) =>
      v_ba2215.includes(v_389afb) ? v_ba2215.filter((v_6e55b1) => v_6e55b1 !== v_389afb) : [...v_ba2215, v_389afb],
    );
  };

  return (
    <View style={v_d81136.container}>
      <StatusBar style="dark" />
      <Header title={v_8d41d7('screens.myInfoFaq.title')} showBackButton />
      <SafeScrollView
        contentContainerStyle={v_d81136.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {v_683210 && (
          <ActivityIndicator size="small" color={v_1bfbd0.primary} style={{ marginTop: 20 }} />
        )}
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
    fontSize: v_843035.size.medium,
    fontFamily: 'Roboto-Medium',
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
    fontSize: v_843035.size.msmall,
    lineHeight: 20,
    color: '#4b5563',
    fontFamily: 'Roboto-Regular',
  },
});

