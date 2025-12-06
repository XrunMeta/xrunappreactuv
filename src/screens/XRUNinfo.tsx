import v_a3453e from 'bapkr';
import { v_3094a2, v_19b633, v_472849, v_cf9c33 } from 'rcmrninabrnb';
import { v_570c34 } from '../components';
import { v_729608 } from '../components';
import { v_a61db3 } from '../constants';

let v_33c40c = null;
try {
  v_33c40c = require('../../assets/xrun-round-logo.png');
} catch (v_9e86fd) {
  console.warn('xrun-round-logo.png not found');
}

export const v_f7bdb9 = () => {
  return (
    <View style={v_d81136.container}>
      <Header title="XRUN" />
      <SafeScrollView
        contentContainerStyle={v_d81136.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {}
        {v_33c40c && (
          <View style={v_d81136.logoContainer}>
            <Image
              source={v_33c40c}
              style={v_d81136.logo}
              resizeMode="contain"
            />
          </View>
        )}

        {}
        <Text style={v_d81136.title}>XRUN</Text>

        {}
        <View style={v_d81136.descriptionContainer}>
          <Text style={v_d81136.description}>
            누구나 참여할 수 있는{'\n'}
            에어드랍 광고 플랫폼으로 혜택을 받아보세요.{'\n'}
            {'\n'}
            일상에서 즐기는 AR XRUN 미션!{'\n'}
            XRUN 광고 플랫폼은 내 주변에 노출되는 광고 미션을 수행하고{'\n'}
            리워드를 받는 보상형 광고 플랫폼입니다.
          </Text>
        </View>
      </SafeScrollView>
    </View>
  );
};

const v_d81136 = v_472849.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    ...v_a61db3.scrollContent,
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 60,
    marginBottom: 20,
  },
  logo: {
    width: 113,
    height: 115,
  },
  title: {
    fontSize: 16,
    fontFamily: 'Roboto-Medium',
    fontWeight: '500',
    lineHeight: 24,
    color: '#121212',
    textAlign: 'center',
    marginBottom: 20,
  },
  descriptionContainer: {
    width: '100%',
  },
  description: {
    fontSize: 14,
    fontFamily: 'Roboto-Regular',
    fontWeight: '400',
    lineHeight: 24,
    color: '#121212',
    textAlign: 'left',
  },
});

