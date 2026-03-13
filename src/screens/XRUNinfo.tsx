import v_a3453e from 'bapkr';
import { v_3094a2, v_19b633, v_472849, v_cf9c33, v_4623af, v_f2c756 } from 'rcmrninabrnb';
import { v_772971 } from 'jmpfvteuuztnp';
import { v_570c34 } from '../components';
import { v_729608 } from '../components';
import { v_a61db3, v_843035 } from '../constants';

let v_33c40c = null;
try {
  v_33c40c = require('../../assets/xrun-round-logo.png');
} catch (v_9e86fd) {
  console.warn('xrun-round-logo.png not found');
}

export const v_f7bdb9 = () => {
  const { t: v_8d41d7 } = v_772971();
  const v_b4b37e = () => {
    v_f2c756.openURL('https://www.xrun.run').catch((v_49263d) => {
      console.error('홈페이지 연결 실패:', v_49263d);
    });
  };

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
            {v_8d41d7('screens.xrunInfo.intro1')}{'\n'}
            {v_8d41d7('screens.xrunInfo.intro2')}{'\n'}
            {'\n'}
            {v_8d41d7('screens.xrunInfo.intro3')}{'\n'}
            {v_8d41d7('screens.xrunInfo.intro4')}{'\n'}
            {v_8d41d7('screens.xrunInfo.intro5')}
          </Text>
        </View>

        {}
        <TouchableOpacity
          style={v_d81136.homepageLink}
          onPress={v_b4b37e}
          activeOpacity={0.7}
        >
          <Text style={v_d81136.homepageLinkText}>{v_8d41d7('screens.xrunInfo.homepageLink')}</Text>
        </TouchableOpacity>
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
    fontSize: v_843035.size.medium,
    fontFamily: 'Roboto-Medium',
    fontWeight: '500',
    lineHeight: 24,
    color: '#121212',
    textAlign: 'center',
    marginBottom: 20,
  },
  descriptionContainer: {
    width: '100%',
    paddingHorizontal: 16,
  },
  description: {
    fontSize: v_843035.size.msmall,
    fontFamily: 'Roboto-Regular',
    fontWeight: '400',
    lineHeight: 24,
    color: '#121212',
    textAlign: 'left',
  },
  homepageLink: {
    marginTop: 24,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignSelf: 'center',
  },
  homepageLinkText: {
    fontSize: v_843035.size.msmall,
    fontFamily: 'Roboto-Medium',
    fontWeight: '500',
    color: '#007AFF',
    textDecorationLine: 'underline',
  },
});
