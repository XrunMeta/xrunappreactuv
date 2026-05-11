import v_a3453e, { v_5ab095, v_e662ae } from 'bapkr';
import { v_3094a2, v_19b633, v_472849, v_cf9c33, v_700696, v_9cabcb } from 'rcmrninabrnb';
import { v_b5df25 } from 'ernurodqvmtspux';
import { v_772971 } from 'jmpfvteuuztnp';
import v_e84827 from 'bkjbgtcoyuizqwgwtnaxmfkyvlqwevapsqmanbsnv';
import { v_cb41de, v_8714fe, v_556baf } from '../components';
import { v_1bfbd0, v_9b1a04, v_a61db3, v_843035 } from '../constants';
import { v_ce4741, v_a0daa8 } from '../navigation';
import { v_4c7b5d } from '../components/TaboolaBanner';

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
  const { navigate: v_9b57fc } = v_a0daa8();
  const { t: v_8d41d7 } = v_772971();
  const [v_7815ff, v_be9dba] = v_5ab095(0);
  const v_ebdf9a = v_e662ae<v_9cabcb>(null);

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
});
