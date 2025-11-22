import v_a3453e from 'bapkr';
import {
  v_3094a2,
  v_19b633,
  v_472849,
  v_122070,
  v_4623af,
  v_f2c756,
  v_326be8,
} from 'rcmrninabrnb';
import { v_b5df25 } from 'ernurodqvmtspux';
import { v_cb41de, v_8714fe } from '../components';
import { v_1bfbd0 } from '../constants';

export const v_54d331 = () => {
  const v_ec4736 = () => {
    console.log('Login pressed');

  };

  const v_c5a058 = () => {
    console.log('Sign up pressed');

  };

  const v_f4f55f = () => {

    console.log('Terms of Service pressed');
  };

  const v_1354b4 = () => {

    console.log('Privacy Policy pressed');
  };

  return (
    <View style={v_d81136.container}>
      <StatusBar style="dark" />
      <ScrollView
        contentContainerStyle={v_d81136.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {}
        <View style={v_d81136.adContainer}>
          <Text style={v_d81136.adText}>전면 광고</Text>
        </View>

        {}
        <View style={v_d81136.buttonContainer}>
          <PrimaryButton
            title="Login"
            onPress={v_ec4736}
            fullWidth={true}
            style={v_d81136.loginButton}
          />
          <SecondaryButton
            title="회원가입"
            onPress={v_c5a058}
            fullWidth={true}
          />
        </View>

        {}
        <View style={v_d81136.termsContainer}>
          <Text style={v_d81136.termsText}>
            이 앱에서 제공하는 기능과 정보 이용 방식에 대해 알아보려면{'\n'}
            아래의{' '}
            <Text style={v_d81136.linkText} onPress={v_f4f55f}>
              이용약관
            </Text>
            {' '}과{' '}
            <Text style={v_d81136.linkText} onPress={v_1354b4}>
              개인정보 처리방침
            </Text>
            을 읽고 동의해주세요.
          </Text>
        </View>
      </ScrollView>

      {}
      {v_326be8.OS === 'ios' && (
        <View style={v_d81136.homeIndicator}>
          <View style={v_d81136.homeIndicatorBar} />
        </View>
      )}
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
    paddingTop: 58, 
    paddingBottom: 34,
  },
  adContainer: {
    width: 327,
    height: 393,
    backgroundColor: '#d9d9d9',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 44, 
    alignSelf: 'center',
  },
  adText: {
    fontSize: 30,
    fontWeight: '500',
    color: v_1bfbd0.text,
    fontFamily: 'Roboto-Medium',
  },
  buttonContainer: {
    width: 327,
    marginTop: 48, 
    gap: 15,
    alignSelf: 'center',
  },
  loginButton: {
    marginBottom: 0,
  },
  termsContainer: {
    width: 317,
    marginTop: 97, 
    alignSelf: 'center',
  },
  termsText: {
    fontSize: 12,
    lineHeight: 15,
    color: '#4c4e55',
    fontFamily: 'Roboto-Regular',
    textAlign: 'left',
    letterSpacing: 0.06,
  },
  linkText: {
    fontSize: 12,
    lineHeight: 15,
    color: '#4c4e55',
    fontFamily: 'Roboto-Bold',
    fontWeight: 'bold',
    letterSpacing: 0.06,
  },
  homeIndicator: {
    height: 34,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 9,
  },
  homeIndicatorBar: {
    width: 134,
    height: 5,
    backgroundColor: '#10192d',
    borderRadius: 100,
    marginBottom: 9,
  },
});

