import v_a3453e, { v_5ab095, v_c4deb2 } from 'bapkr';
import { v_3094a2, v_19b633, v_472849, v_122070, v_4623af, v_39a996 } from 'rcmrninabrnb';
import { v_b5df25 } from 'ernurodqvmtspux';
import { v_772971 } from 'jmpfvteuuztnp';
import { v_729608 } from '../components';
import { v_1bfbd0 } from '../constants';
import { v_a0daa8 } from '../navigation';
import { v_700ef9 } from '../context';
import { v_9dd03c } from '../types';
import { v_4dba02 } from '../services';

const clauseTitleMap: Record<v_9dd03c, string> = {
  service: 'Terms of Service',
  location: 'Personal Location Information',
  personal: 'Personal Information Usage',
};

export const v_5fdcb2 = () => {
  const { t: v_8d41d7, i18n: v_9c213b } = v_772971();
  const { goBack: v_c7ac57, navigate: v_9b57fc } = v_a0daa8();
  const { selectedClauseId: v_6e7459 } = v_700ef9();
  const [v_b43b74, v_f435cb] = v_5ab095<string>('');
  const [v_cd31a8, v_deef62] = v_5ab095(true);
  const [v_5e9bfe, v_3a7d09] = v_5ab095<string | null>(null);

  v_c4deb2(() => {
    const v_b29dc3 = async () => {
      try {
        v_deef62(true);
        v_3a7d09(null);

        const v_7c5e9b = v_9c213b.language || 'ko';

        const v_4898e2 = v_6e7459 as 'service' | 'location' | 'personal';

        const v_75fec9 = await v_4dba02(v_4898e2, v_7c5e9b, v_9b57fc);

        if (v_75fec9) {
          v_f435cb(v_75fec9);
        } else {
          v_3a7d09('약관 내용을 불러올 수 없습니다.');
        }
      } catch (v_49263d) {
        console.error('[약관] 약관 내용 로드 오류:', v_49263d);
        v_3a7d09('약관 내용을 불러오는 중 오류가 발생했습니다.');
      } finally {
        v_deef62(false);
      }
    };

    v_b29dc3();
  }, [v_6e7459, v_9c213b.language, v_9b57fc]);

  const v_9f1622 = v_c6eb94[v_6e7459];

  return (
    <View style={v_d81136.container}>
      <StatusBar style="dark" />
      <Header title={v_9f1622} onBackPress={v_c7ac57} showBackButton />
      <ScrollView contentContainerStyle={v_d81136.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={v_d81136.inner}>
          {v_cd31a8 ? (
            <View style={v_d81136.loadingContainer}>
              <ActivityIndicator size="large" color={v_1bfbd0.buttonPrimary} />
              <Text style={v_d81136.loadingText}>약관 내용을 불러오는 중...</Text>
            </View>
          ) : v_5e9bfe ? (
            <View style={v_d81136.errorContainer}>
              <Text style={v_d81136.errorText}>{v_5e9bfe}</Text>
            </View>
          ) : (
            <Text style={v_d81136.contentText}>{v_b43b74}</Text>
          )}
        </View>
        <View style={v_d81136.buttonRow}>
          <TouchableOpacity style={v_d81136.secondaryButton} activeOpacity={0.85} onPress={v_c7ac57}>
            <Text style={v_d81136.secondaryText}>{v_8d41d7('screens.clauseDetail.declined')}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={v_d81136.primaryButton} activeOpacity={0.85} onPress={v_c7ac57}>
            <Text style={v_d81136.primaryText}>{v_8d41d7('screens.clauseDetail.accept')}</Text>
          </TouchableOpacity>
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
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 32,
  },
  inner: {
    width: '100%',
    maxWidth: 780,
    alignSelf: 'center',
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 14,
    fontFamily: 'Roboto-Regular',
    color: '#8e9bae',
  },
  errorContainer: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  errorText: {
    fontSize: 14,
    fontFamily: 'Roboto-Regular',
    color: '#ff6b6b',
  },
  contentText: {
    fontSize: 14,
    lineHeight: 24,
    fontFamily: 'Roboto-Regular',
    color: '#8e9bae',
    marginBottom: 24,
  },
  buttonRow: {
    width: '100%',
    maxWidth: 780,
    alignSelf: 'center',
    flexDirection: 'row',
    gap: 16,
    marginTop: 16,
  },
  secondaryButton: {
    flex: 1,
    height: 56,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e4e6ed',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  primaryButton: {
    flex: 1,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#343a5a',
  },
  secondaryText: {
    fontSize: 16,
    fontFamily: 'Roboto-Bold',
    color: '#10192d',
  },
  primaryText: {
    fontSize: 16,
    fontFamily: 'Roboto-Bold',
    color: '#fff',
  },
});

