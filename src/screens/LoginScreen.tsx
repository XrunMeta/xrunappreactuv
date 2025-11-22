import v_a3453e, { v_5ab095 } from 'bapkr';
import {
  v_3094a2,
  v_19b633,
  v_472849,
  v_122070,
  v_4623af,
  v_326be8,
} from 'rcmrninabrnb';
import { v_25515d } from 'zvyjokvuouwvifyzks';
import { v_b5df25 } from 'ernurodqvmtspux';
import { v_fa3feb, v_368e80, v_729608, v_cb41de } from '../components';
import { v_1bfbd0 } from '../constants';
import { v_a0daa8 } from '../navigation';

export const v_f4f851 = () => {
  const { goBack: v_c7ac57 } = v_a0daa8();
  const [v_e0c7e8, v_fedf34] = v_5ab095('');
  const [v_adc076, v_52b279] = v_5ab095('');
  const [v_9fe81c, v_d32265] = v_5ab095(false);
  const [v_f872c3, v_c6fe9e] = v_5ab095(false);

  const v_ec4736 = () => {
    console.log('로그인 시도', { email: v_e0c7e8, rememberId: v_9fe81c });

  };

  const v_c71e0a = () => {
    console.log('이메일 인증 화면으로 이동');

  };

  return (
    <View style={v_d81136.container}>
      <StatusBar style="dark" />
      <Header
        title="로그인"
        onBackPress={v_c7ac57}
        showBackButton
      />
      <ScrollView
        contentContainerStyle={v_d81136.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <FormField
          label="이메일"
          placeholder="이메일을 입력해주세요."
          keyboardType="email-address"
          autoCapitalize="none"
          value={v_e0c7e8}
          onChangeText={v_fedf34}
        />

        <FormField
          label="비밀번호"
          placeholder="비밀번호를 입력해주세요."
          secureTextEntry={!v_f872c3}
          value={v_adc076}
          onChangeText={v_52b279}
          rightAccessory={
            <TouchableOpacity
              style={v_d81136.eyeButton}
              onPress={() => v_c6fe9e((v_ba2215) => !v_ba2215)}
              activeOpacity={0.7}
            >
              <Ionicons
                name={v_f872c3 ? 'eye-outline' : 'eye-off-outline'}
                size={20}
                color="#666666"
              />
            </TouchableOpacity>
          }
        />

        <View style={v_d81136.checkboxRow}>
          <FormCheckbox
            label="아이디 기억하기"
            checked={v_9fe81c}
            onToggle={() => v_d32265((v_ba2215) => !v_ba2215)}
            variant="circle"
          />
        </View>

        <View style={v_d81136.loginButtonWrapper}>
          <PrimaryButton title="로그인" fullWidth onPress={v_ec4736} />
        </View>

        <Text style={v_d81136.disclaimer}>
          비밀번호를 잊으셨다면, 이메일로 받은 인증코드를 사용해 로그인할 수 있습니다.
        </Text>

        <TouchableOpacity
          style={v_d81136.emailVerification}
          onPress={v_c71e0a}
          activeOpacity={0.7}
        >
          <Text style={v_d81136.emailVerificationText}>이메일 인증</Text>
        </TouchableOpacity>
      </ScrollView>

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
    paddingTop: 24,
    paddingBottom: 40,
  },
  eyeButton: {
    height: 24,
    width: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxRow: {
    width: '100%',
    maxWidth: 780,
    alignSelf: 'center',
    marginTop: -8,
    marginBottom: 16,
  },
  loginButtonWrapper: {
    width: '100%',
    maxWidth: 780,
    alignSelf: 'center',
    marginTop: 48,
  },
  disclaimer: {
    marginTop: 24,
    width: '100%',
    alignSelf: 'center',
    fontSize: 12,
    lineHeight: 15,
    color: '#4c4e55',
    fontFamily: 'Roboto-Regular',
  },
  emailVerification: {
    marginTop: 24,
    alignSelf: 'flex-start',
    marginLeft: 24,
  },
  emailVerificationText: {
    fontSize: 14,
    lineHeight: 20,
    color: '#4c4e55',
    fontFamily: 'Roboto-Bold',
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

