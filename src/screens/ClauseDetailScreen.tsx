import v_a3453e, { v_5ab095, v_c4deb2 } from 'bapkr';
import { v_3094a2, v_19b633, v_472849, v_39a996 } from 'rcmrninabrnb';
import { v_570c34 } from '../components';
import { v_772971 } from 'jmpfvteuuztnp';
import { v_729608 } from '../components';
import { v_1bfbd0, v_a61db3, v_843035 } from '../constants';
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
  const { i18n: v_9c213b, t: v_8d41d7 } = v_772971();
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

        let v_7c5e9b = v_9c213b.language || 'ko';

        if (v_7c5e9b === 'zh' || v_7c5e9b === 'zhCN' || v_7c5e9b === 'zh-CN') {
          v_7c5e9b = 'zh-CN';
        }

        console.log('[약관] 현재 언어 코드:', v_7c5e9b, 'i18n.language:', v_9c213b.language);

        const v_4898e2 = v_6e7459 as 'service' | 'location' | 'personal';

        const v_75fec9 = await v_4dba02(v_4898e2, v_7c5e9b, v_9b57fc);

        if (v_75fec9) {
          v_f435cb(v_75fec9);
        } else {
          v_3a7d09(v_8d41d7('screens.myInfoClauses.loadFailed'));
        }
      } catch (v_49263d) {
        console.error('[약관] 약관 내용 로드 오류:', v_49263d);
        v_3a7d09(v_8d41d7('screens.myInfoClauses.loadError'));
      } finally {
        v_deef62(false);
      }
    };

    v_b29dc3();
  }, [v_6e7459, v_9c213b.language, v_9b57fc]);

  const v_9f1622 = v_c6eb94[v_6e7459];

  return (
    <View style={v_d81136.container}>
      <Header title={v_9f1622} onBackPress={v_c7ac57} showBackButton />
      <SafeScrollView contentContainerStyle={v_d81136.scrollContent} showsVerticalScrollIndicator={false}>
        {v_cd31a8 ? (
          <View style={v_d81136.loadingContainer}>
            <ActivityIndicator size="large" color={v_1bfbd0.buttonPrimary} />
            <Text style={v_d81136.loadingText}>{v_8d41d7('screens.myInfoClauses.loading')}</Text>
          </View>
        ) : v_5e9bfe ? (
          <View style={v_d81136.errorContainer}>
            <Text style={v_d81136.errorText}>{v_5e9bfe}</Text>
          </View>
        ) : (
          <Text style={v_d81136.contentText}>{v_b43b74}</Text>
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
    flexGrow: 1,
    ...v_a61db3.scrollContent,
  },

  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    marginTop: 16,
    fontSize: v_843035.size.msmall,
    fontFamily: 'Roboto-Regular',
    color: '#8e9bae',
  },
  errorContainer: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  errorText: {
    fontSize: v_843035.size.msmall,
    fontFamily: 'Roboto-Regular',
    color: '#ff6b6b',
  },
  contentText: {
    fontSize: v_843035.size.msmall,
    lineHeight: 24,
    fontFamily: 'Roboto-Regular',
    color: '#8e9bae',
  },
});

