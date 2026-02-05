import v_a3453e, { v_5ab095, v_de06a3 } from 'bapkr';
import { v_3094a2, v_19b633, v_472849, v_4623af, v_39a996 } from 'rcmrninabrnb';
import { v_570c34 } from '../components';
import { v_729608 } from '../components';
import { v_a0daa8 } from '../navigation';
import { v_1bfbd0, v_a61db3, v_843035, v_9b1a04 } from '../constants';
import { v_82ad38 } from '../services/tapjoy';
import { v_cba33f } from '../utils';

export const v_f2ecfa = () => {
  const { goBack: v_c7ac57 } = v_a0daa8();
  const [v_683210, v_34a50a] = v_5ab095(false);

  const v_7a33ab = v_de06a3(async () => {
    v_34a50a(true);
    try {
      const v_43c42e = await v_82ad38();
      if (v_43c42e.success) {
        v_cba33f('탭조이 광고를 불러왔습니다.');
      } else {
        v_cba33f(v_43c42e.message || '광고를 불러올 수 없습니다.');
      }
    } catch (v_9e86fd) {
      v_cba33f('오류가 발생했습니다.');
    } finally {
      v_34a50a(false);
    }
  }, []);

  return (
    <View style={v_d81136.container}>
      <Header title="탭조이" onBackPress={v_c7ac57} showBackButton />
      <SafeScrollView
        contentContainerStyle={v_d81136.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={v_d81136.inner}>
          <Text style={v_d81136.title}>탭조이</Text>
          <Text style={v_d81136.description}>
            아래 버튼을 누르면 Tapjoy 오퍼월(보상형 광고)이 표시됩니다.
          </Text>
          <TouchableOpacity
            style={[v_d81136.button, v_683210 && v_d81136.buttonDisabled]}
            activeOpacity={0.8}
            onPress={v_7a33ab}
            disabled={v_683210}
          >
            {v_683210 ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={v_d81136.buttonText}>광고 보기</Text>
            )}
          </TouchableOpacity>
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
    paddingHorizontal: v_9b1a04.medium,
  },
  inner: {
    paddingVertical: v_9b1a04.large,
  },
  title: {
    fontSize: v_843035.size.large,
    fontFamily: v_843035.family.bold,
    color: v_1bfbd0.text,
    marginBottom: v_9b1a04.medium,
  },
  description: {
    fontSize: v_843035.size.medium,
    fontFamily: v_843035.family.regular,
    color: v_1bfbd0.text,
    opacity: 0.8,
    marginBottom: v_9b1a04.large,
  },
  button: {
    backgroundColor: v_1bfbd0.primary,
    paddingVertical: v_9b1a04.medium,
    paddingHorizontal: v_9b1a04.large,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    fontSize: v_843035.size.medium,
    fontFamily: v_843035.family.semibold,
    color: '#fff',
  },
});
