import v_a3453e, { v_5ab095, v_c4deb2 } from 'bapkr';
import { v_3094a2, v_472849, v_19b633, v_39a996, v_03e392 } from 'rcmrninabrnb';
import { v_570c34 } from '../components';
import { v_772971 } from 'jmpfvteuuztnp';
import { v_729608 } from '../components';
import { v_412fbc } from '../components/AnimatedDots';
import { v_a0daa8 } from '../navigation';
import { v_700ef9 } from '../context';
import { v_a61db3, v_843035, v_1bfbd0 } from '../constants';
import { v_519669 } from '../services';
import { v_5b1062 } from '../types';
import { v_5401ae } from '../testIDs';

export const v_d3f135 = () => {
  const { t: v_8d41d7 } = v_772971();
  const { goBack: v_c7ac57, navigate: v_9b57fc } = v_a0daa8();
  const { selectedAgreementType: v_eff210 } = v_700ef9();
  const [v_926463, v_a31883] = v_5ab095<v_5b1062 | null>(null);
  const [v_683210, v_34a50a] = v_5ab095(true);
  const [v_5e9bfe, v_3a7d09] = v_5ab095<string | null>(null);

  const v_b1a151 = v_eff210 || 'service';

  v_c4deb2(() => {
    const v_33650f = async () => {
      try {
        v_34a50a(true);
        v_3a7d09(null);

        console.log('[약관] 약관 데이터 로드 시작:', { agreementType: v_b1a151 });

        const v_3393e3 = await v_519669(v_b1a151, { navigate: v_9b57fc });

        if (v_3393e3.success && v_3393e3.data) {

          const v_9390e8 = Array.isArray(v_3393e3.data) ? v_3393e3.data[0] : v_3393e3.data;
          v_a31883(v_9390e8);
          console.log('[약관] 약관 데이터 로드 성공:', { type: v_9390e8.type, title: v_9390e8.title });
        } else {
          throw new Error('약관 데이터를 가져올 수 없습니다.');
        }
      } catch (v_49263d) {
        console.error('[약관] 약관 데이터 로드 실패:', v_49263d);
        const v_1744b9 = v_49263d instanceof Error ? v_49263d.message : '약관 데이터를 불러오는 중 오류가 발생했습니다.';
        v_3a7d09(v_1744b9);
        v_03e392.alert(
          v_8d41d7('screens.terms.error.title', '오류'),
          v_1744b9,
          [{ text: v_8d41d7('screens.terms.error.ok', '확인') }]
        );
      } finally {
        v_34a50a(false);
      }
    };

    v_33650f();
  }, [v_b1a151, v_9b57fc, v_8d41d7]);

  return (
    <View style={v_d81136.container}>
      <Header title={v_8d41d7('screens.terms.title')} onBackPress={v_c7ac57} showBackButton />
      <SafeScrollView
        contentContainerStyle={v_d81136.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {v_683210 ? (
          <View style={v_d81136.loadingContainer}>
            <ActivityIndicator size="large" color={v_1bfbd0.buttonPrimary} />
            <LoadingText text={v_8d41d7('screens.terms.loading', '약관을 불러오는 중...')} style={v_d81136.loadingText} />
          </View>
        ) : v_5e9bfe ? (
          <View style={v_d81136.errorContainer}>
            <Text style={v_d81136.errorText}>{v_5e9bfe}</Text>
          </View>
        ) : v_926463 ? (
          <View style={v_d81136.card}>
            {v_926463.title && (
              <Text testID={v_5401ae.terms.titleLabel} style={v_d81136.titleText}>{v_926463.title}</Text>
            )}
            <Text style={v_d81136.contentText}>{v_926463.content}</Text>
          </View>
        ) : (
          <View style={v_d81136.errorContainer}>
            <Text style={v_d81136.errorText}>{v_8d41d7('screens.terms.noData', '약관 데이터가 없습니다.')}</Text>
          </View>
        )}
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
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
    marginBottom: 10,
  },
  titleText: {
    fontSize: v_843035.size.large,
    fontWeight: 'bold',
    color: v_1bfbd0.text,
    marginBottom: 16,
    fontFamily: 'Roboto-Bold',
  },
  contentText: {
    fontSize: v_843035.size.medium,
    lineHeight: 18,
    fontFamily: 'Roboto-Regular',
    color: v_1bfbd0.text,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    marginTop: 16,
    fontSize: v_843035.size.medium,
    color: v_1bfbd0.text,
    fontFamily: 'Roboto-Regular',
  },
  errorContainer: {
    padding: 20,
    alignItems: 'center',
  },
  errorText: {
    fontSize: v_843035.size.medium,
    color: v_1bfbd0.error,
    fontFamily: 'Roboto-Regular',
    textAlign: 'center',
  },
});

