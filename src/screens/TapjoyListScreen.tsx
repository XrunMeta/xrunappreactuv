import v_a3453e, { v_5ab095, v_de06a3, v_c4deb2, v_e662ae } from 'bapkr';
import { v_3094a2, v_19b633, v_472849, v_4623af, v_39a996 } from 'rcmrninabrnb';
import { v_570c34 } from '../components';
import { v_729608 } from '../components';
import { v_a0daa8 } from '../navigation';
import { v_1bfbd0, v_a61db3, v_843035, v_9b1a04 } from '../constants';
import { v_82ad38, v_981fdd } from '../services/tapjoy';
import { v_fda57c } from '../services/appsflyer';
import { v_cba33f } from '../utils';
import { v_566465 } from '../services/nasmediaAd';
import { v_5401ae } from '../testIDs';

export const v_f2ecfa = () => {
  const { goBack: v_c7ac57 } = v_a0daa8();
  const [v_683210, v_34a50a] = v_5ab095(false);
  const v_7ed973 = v_e662ae(v_981fdd());

  const v_7a33ab = v_de06a3(
    async (v_afd01c) => {
      v_34a50a(true);
      try {
        const v_43c42e = await v_82ad38(undefined, () => {
          console.log('[TapjoyListScreen] 오퍼월 닫힘 → AppsFlyer tapjoy 이벤트 전송');
          v_fda57c('tapjoy');
          v_afd01c?.();
        });
        if (v_43c42e.success) {
          if (!v_7ed973.current) v_cba33f(v_566465('toast_tapjoy_loaded', '탭조이 광고를 불러왔습니다.'));
        } else {
          v_cba33f(v_43c42e.message || '광고를 불러올 수 없습니다.');
          if (v_7ed973.current) v_c7ac57();
        }
      } catch (v_9e86fd) {
        v_cba33f(v_566465('toast_general_error', '오류가 발생했습니다.'));
        if (v_7ed973.current) v_c7ac57();
      } finally {
        v_34a50a(false);
      }
    },
    [v_c7ac57]
  );

  v_c4deb2(() => {
    if (!v_7ed973.current) return;
    v_7a33ab(() => v_c7ac57());
  }, [v_7a33ab, v_c7ac57]);

  if (v_7ed973.current) {
    return (
      <View style={v_d81136.container}>
        <Header title="탭조이" onBackPress={v_c7ac57} showBackButton />
        <View style={v_d81136.centered}>
          <ActivityIndicator size="small" color={v_1bfbd0.primary} />
          <Text style={v_d81136.loadingText}>
            {v_683210 ? '오퍼월을 불러오는 중…' : '연결 중…'}
          </Text>
        </View>
      </View>
    );
  }

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
          <TouchableOpacity testID={v_5401ae.tapjoyList.showAd}
            style={[v_d81136.button, v_683210 && v_d81136.buttonDisabled]}
            activeOpacity={0.8}
            onPress={() => v_7a33ab()}
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
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: v_9b1a04.large,
  },
  loadingText: {
    marginTop: v_9b1a04.small,
    fontSize: v_843035.size.medium,
    color: v_1bfbd0.text,
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
