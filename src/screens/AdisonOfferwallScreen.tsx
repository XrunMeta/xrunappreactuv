import v_a3453e, { v_c4deb2, v_e662ae } from 'bapkr';
import { v_3094a2, v_19b633, v_472849, v_39a996 } from 'rcmrninabrnb';
import v_e84827 from 'bkjbgtcoyuizqwgwtnaxmfkyvlqwevapsqmanbsnv';
import { v_729608 } from '../components';
import { v_a0daa8 } from '../navigation';
import { v_772971 } from 'jmpfvteuuztnp';
import { v_1bfbd0, v_a61db3, v_843035, v_9b1a04 } from '../constants';
import {
  v_627d09,
  v_14739d,
  v_120d5c,
  v_5dbd47,
} from '../services/adison';
import { v_cba33f } from '../utils';

export const AdisonOfferwallScreen: v_a3453e.FC = () => {
  const { goBack: v_c7ac57 } = v_a0daa8();
  const { t: v_8d41d7 } = v_772971();
  const v_124e9d = v_e662ae(false);

  v_c4deb2(() => {
    if (v_124e9d.current) return;
    const v_207c31 = async () => {
      v_124e9d.current = true;
      try {
        if (!v_120d5c()) {
          v_cba33f('Adison SDK가 이 빌드에 포함되어 있지 않습니다.');
          v_c7ac57();
          return;
        }

        const v_3ed4c3 = await v_14739d();
        if (!v_3ed4c3) {
          v_cba33f('Adison 초기화에 실패했습니다.');
          v_c7ac57();
          return;
        }

        try {
          const v_f24fd5 = await v_e84827.getItem('userData');
          if (v_f24fd5) {
            const v_ef7306 = JSON.parse(v_f24fd5);
            if (v_ef7306?.member != null) {
              v_627d09(v_ef7306.member);
            }
          }
        } catch (v_37eab7) {

        }

        const v_d1b432 = await v_5dbd47();
        if (!v_d1b432) {
          v_cba33f('Adison 오퍼월을 열 수 없습니다.');
        }
      } catch (v_9e86fd) {
        v_cba33f(v_9e86fd?.message ?? 'Adison 오퍼월 오류');
      } finally {
        v_c7ac57();
      }
    };
    v_207c31();
  }, [v_c7ac57, v_8d41d7]);

  return (
    <View style={v_d81136.container}>
      <Header title={'Adison 오퍼월'} onBackPress={v_c7ac57} showBackButton />
      <View style={v_d81136.centered}>
        <ActivityIndicator size="small" color={v_1bfbd0.buttonPrimary} />
        <Text style={v_d81136.loadingText}>오퍼월을 여는 중...</Text>
      </View>
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
});
