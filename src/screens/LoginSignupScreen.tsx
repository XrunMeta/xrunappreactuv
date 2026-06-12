import v_a3453e, { v_5ab095, v_e662ae, v_c4deb2 } from 'bapkr';
import { v_3094a2, v_19b633, v_472849, v_cf9c33, v_700696, v_9cabcb, v_4623af } from 'rcmrninabrnb';
import { v_b5df25 } from 'ernurodqvmtspux';
import { v_772971 } from 'jmpfvteuuztnp';
import v_e84827 from 'bkjbgtcoyuizqwgwtnaxmfkyvlqwevapsqmanbsnv';
import { v_cb41de, v_8714fe, v_556baf } from '../components';
import { v_1bfbd0, v_9b1a04, v_a61db3, v_843035, v_731ab4 } from '../constants';
import { v_ce4741, v_a0daa8 } from '../navigation';
import { v_4c7b5d } from '../components/TaboolaBanner';
import { v_b699a9 } from '../services';
import { v_4b1173 } from '../context/AlertDialogContext';

const v_649e06 = 'oth-user@example.invalid';
const v_851158 = '__dev_quick_login_usr_secret';
const v_1a1319 = 'Aaaaaa1';

const { height: v_28d8d8, width: v_0d9f50 } = v_700696.get('window');

interface TutorialItem {
  id: number;
  text: string;
  image: any;
}

const v_5f5d0e = ['tutorial1', 'tutorial2', 'tutorial3'] as const;
const v_e142e4 = [
  require('../../assets/title2.png'),
  require('../../assets/title3.png'),
  require('../../assets/title1.png'),
];

export const v_54d331 = () => {
  const { navigate: v_9b57fc, reset: v_487a25 } = v_a0daa8();
  const { t: v_8d41d7 } = v_772971();
  const { showAlert: v_889fad } = v_4b1173();
  const [v_7815ff, v_be9dba] = v_5ab095(0);
  const [v_590bd5, v_59e88a] = v_5ab095(false);
  const v_ebdf9a = v_e662ae<v_9cabcb>(null);

  v_c4deb2(() => {
    if (!v_731ab4) return;
    (async () => {
      const v_3c8572 = await v_e84827.getItem(v_851158);
      if (!v_3c8572) {
        await v_e84827.setItem(v_851158, v_1a1319);
      }
    })();
  }, []);

  const v_ea4e8c = async () => {
    if (v_590bd5) return;
    v_59e88a(true);
    try {
      const v_43fd42 = await v_e84827.getItem(v_851158);
      if (!v_43fd42) {
        await v_889fad('오류', 'USR_SECRET 가 저장되지 않았습니다.');
        return;
      }

      const v_e66bb4 = await v_e84827.getAllKeys();
      const v_55369f = v_e66bb4.filter((v_0eb677) =>
        v_0eb677 === 'userData' || v_0eb677 === 'jwt' || v_0eb677 === 'loggedIn' || v_0eb677 === 'userEmail' || v_0eb677 === 'remember'
      );
      if (v_55369f.length > 0) await v_e84827.multiRemove(v_55369f);

      const v_8f00b9 = await v_b699a9(v_649e06, v_43fd42);
      if (v_8f00b9?.status === 'success') {
        const v_ef7306 = Array.isArray(v_8f00b9.data) ? v_8f00b9.data[0] : v_8f00b9.data;
        if (v_ef7306) {
          await v_e84827.setItem('userData', JSON.stringify(v_ef7306));
          await v_e84827.setItem('userEmail', v_ef7306.email || v_649e06);
          await v_e84827.setItem('loggedIn', 'true');
          await v_e84827.setItem('remember', 'true');
        }
        console.log('[dev 빠른 로그인] 성공:', v_649e06);
        v_487a25(v_ce4741.map);
      } else {
        await v_889fad('로그인 실패', String((v_8f00b9 as any)?.message ?? '시크릿 또는 서버 설정 확인'));
      }
    } catch (v_9e86fd) {
      console.warn('[dev 빠른 로그인] 예외:', v_9e86fd?.message);
      await v_889fad('로그인 오류', v_9e86fd?.message ?? '알 수 없는 오류');
    } finally {
      v_59e88a(false);
    }
  };

  const v_ec4736 = () => v_9b57fc(v_ce4741.login);
  const v_c5a058 = async () => {
    try {
      await v_e84827.multiRemove([
        'googleSignupRequired',
        'googleSignupEmail',
        'appleSignupRequired',
        'appleSignupEmail',
      ]);
    } catch (v_5e9bfe) {
      console.error('[회원가입] 소셜 회원가입 플래그 제거 실패:', v_5e9bfe);
    }
    v_9b57fc(v_ce4741.signup);
  };

  const v_c76e2c = (v_d48baf) => {
    const v_2365e9 = Math.round(v_d48baf.nativeEvent.contentOffset.x / v_0d9f50);
    v_be9dba(v_2365e9);
  };

  const v_03112b = v_5f5d0e.map((v_b24339, v_e86ad8) => ({
    id: v_e86ad8 + 1,
    text: v_8d41d7(`screens.loginSignup.${v_b24339}`),
    image: v_e142e4[v_e86ad8],
  }));

  const v_c57acf = ({ item: v_8c0b26 }: { item: TutorialItem }) => (
    <View style={v_d81136.tutorialItem}>
      <Text style={v_d81136.tutorialText}>{v_8c0b26.text}</Text>
      <Image source={v_8c0b26.image} style={v_d81136.tutorialImage} resizeMode="contain" />
    </View>
  );

  return (
    <SafeView style={v_d81136.container}>
      <StatusBar style="dark" />

      {}
      <View style={v_d81136.tutorialContainer}>
        <FlatList
          ref={v_ebdf9a}
          data={v_03112b}
          renderItem={v_c57acf}
          keyExtractor={(v_8c0b26) => `tutorial-${v_8c0b26.id}`}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={v_c76e2c}
          style={v_d81136.tutorialFlatList}
        />

        {}
        <View style={v_d81136.paginationContainer}>
          {v_03112b.map((v_37eab7, v_a56041) => (
            <View
              key={v_a56041}
              style={[
                v_d81136.paginationDot,
                v_a56041 === v_7815ff && v_d81136.paginationDotActive,
              ]}
            />
          ))}
        </View>
      </View>

      {}
      <View style={v_d81136.buttonContainer}>
        <PrimaryButton
          title={v_8d41d7('screens.loginSignup.loginButton')}
          onPress={v_ec4736}
          fullWidth
        />
        <SecondaryButton
          title={v_8d41d7('screens.loginSignup.signupButton')}
          onPress={v_c5a058}
          fullWidth
        />

        {}
        {v_731ab4 && (
          <TouchableOpacity
            style={v_d81136.devQuickLoginButton}
            onPress={v_ea4e8c}
            disabled={v_590bd5}
            activeOpacity={0.85}
          >
            <Text style={v_d81136.devQuickLoginText}>
              {v_590bd5 ? '로그인 중...' : '🧪 khangyou7 빠른 로그인 (DEV)'}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {}
      <View style={v_d81136.taboolaContainer}>
        <TaboolaBanner placementType="shop" />
      </View>
    </SafeView>
  );
};

const v_d81136 = v_472849.create({
  container: {
    ...v_a61db3.container,
    flex: 1,
  },
  tutorialContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingTop: v_9b1a04.xlarge,
    paddingBottom: v_9b1a04.small,
  },
  tutorialFlatList: {
    width: '100%',
  },
  tutorialItem: {
    width: v_0d9f50,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingHorizontal: v_9b1a04.large,
    paddingTop: 0,
    paddingBottom: 0,
  },
  tutorialText: {
    fontSize: v_843035.size.xlarge,
    fontFamily: 'Roboto-Bold',
    color: '#333333',
    textAlign: 'center',
    marginBottom: v_9b1a04.large,
    paddingHorizontal: v_9b1a04.large,
    lineHeight: v_843035.size.xlarge * 1.4,
  },
  tutorialImage: {
    width: '100%',
    height: v_28d8d8 * 0.38,
    maxWidth: v_0d9f50 - v_9b1a04.large * 2,
    marginBottom: 0,
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: v_9b1a04.small,
    gap: v_9b1a04.small,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#CCCCCC',
  },
  paginationDotActive: {
    backgroundColor: '#1E3A8A',
  },
  buttonContainer: {
    width: '100%',
    gap: v_9b1a04.medium,
    paddingHorizontal: v_9b1a04.large,
    paddingTop: v_9b1a04.large,
    paddingBottom: v_9b1a04.medium,
  },
  taboolaContainer: {
    borderWidth: 2,
    borderColor: '#ededed',
  },

  devQuickLoginButton: {
    marginTop: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#FEF3C7',
    borderWidth: 1,
    borderColor: '#F59E0B',
    borderRadius: 8,
    alignItems: 'center',
  },
  devQuickLoginText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#92400E',
  },
});
