import v_a3453e, { v_5ab095 } from 'bapkr';
import {
  v_3094a2,
  v_19b633,
  v_472849,
  v_122070,
  v_cf9c33,
  v_326be8,
  v_03e392,
} from 'rcmrninabrnb';
import { v_b5df25 } from 'ernurodqvmtspux';
import {
  v_fa3feb,
  v_368e80,
  v_729608,
  v_89c10a,
  v_cb41de,
} from '../components';
import { v_1bfbd0 } from '../constants';
import { v_a0daa8 } from '../navigation';

const v_f1883f = require('../../assets/flag-kr.png');

const v_798085 = [
  { value: 'male', label: '남' },
  { value: 'female', label: '여' },
] as const;

const v_0c96f7 = ['10', '20', '30', '40', '50+'] as const;

type GenderValue = (typeof v_798085)[number]['value'];
type AgeValue = (typeof v_0c96f7)[number];

export const v_f40fc5 = () => {
  const { goBack: v_c7ac57, navigate: v_9b57fc, reset: v_487a25 } = v_a0daa8();
  const [v_f142d8, v_6dde2f] = v_5ab095('');
  const [v_a7c7b7, v_15ded5] = v_5ab095('');
  const [v_e0c7e8, v_fedf34] = v_5ab095('');
  const [v_adc076, v_52b279] = v_5ab095('');
  const [v_3a6ac4, v_f768f9] = v_5ab095('');
  const [v_a6c30b, v_c030e3] = v_5ab095('');
  const [v_9bf12c, v_fb6bbb] = v_5ab095('');
  const [v_c3eac4, v_bdc43c] = v_5ab095<GenderValue>('male');
  const [v_f83808, v_64a312] = v_5ab095<AgeValue>('10');
  const [v_91ca05, v_cbfe22] = v_5ab095(true);

  const v_585b02 = () => {
    if (!v_91ca05) {
      v_03e392.alert('동의 필요', '약관에 동의해야 가입을 진행할 수 있습니다.');
      return;
    }

    console.log('회원가입 데이터', {
      familyName: v_f142d8,
      givenName: v_a7c7b7,
      email: v_e0c7e8,
      password: v_adc076,
      phoneNumber: v_3a6ac4,
      region: v_a6c30b,
      referralEmail: v_9bf12c,
      gender: v_c3eac4,
      ageRange: v_f83808,
      termsAccepted: v_91ca05,
    });

    v_487a25('authLanding');
    v_9b57fc('login');
  };

  return (
    <View style={v_d81136.container}>
      <StatusBar style="dark" />
      <Header
        title="회원가입"
        onBackPress={v_c7ac57}
        showBackButton
      />
      <ScrollView
        contentContainerStyle={v_d81136.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <FormField
          label="성"
          placeholder="Enter your First name"
          value={v_f142d8}
          onChangeText={v_6dde2f}
          autoCapitalize="none"
          containerStyle={v_d81136.fieldContainer}
        />

        <FormField
          label="이름"
          placeholder="Enter your Last name"
          value={v_a7c7b7}
          onChangeText={v_15ded5}
          autoCapitalize="none"
          containerStyle={v_d81136.fieldContainer}
        />

        <FormField
          label="Email"
          placeholder="Enter your email address"
          value={v_e0c7e8}
          onChangeText={v_fedf34}
          keyboardType="email-address"
          autoCapitalize="none"
          containerStyle={v_d81136.fieldContainer}
        />

        <FormField
          label="비밀번호"
          placeholder="Password"
          value={v_adc076}
          onChangeText={v_52b279}
          secureTextEntry
          autoCapitalize="none"
          containerStyle={v_d81136.fieldContainer}
        />

        <FormField
          label="전화번호"
          placeholder="휴대폰 번호를 입력해주세요."
          keyboardType="phone-pad"
          value={v_3a6ac4}
          onChangeText={v_f768f9}
          containerStyle={v_d81136.fieldContainer}
          leftAccessory={
            <View style={v_d81136.phonePrefix}>
              <Image source={v_f1883f} style={v_d81136.flagIcon} />
              <Text style={v_d81136.countryCode}>+82</Text>
            </View>
          }
        />

        <FormField
          label="지역"
          placeholder="Korea"
          value={v_a6c30b}
          onChangeText={v_c030e3}
          autoCapitalize="none"
          containerStyle={v_d81136.fieldContainer}
        />

        <View style={v_d81136.formGroup}>
          <Text style={v_d81136.label}>성별</Text>
          <View style={v_d81136.inlineOptions}>
            {v_798085.map((v_0bd920) => {
              const v_26dce6 = v_c3eac4 === v_0bd920.value;
              return (
                <OptionButton
                  key={v_0bd920.value}
                  label={v_0bd920.label}
                  selected={v_26dce6}
                  onPress={() => v_bdc43c(v_0bd920.value)}
                />
              );
            })}
          </View>
        </View>

        <View style={v_d81136.formGroup}>
          <Text style={v_d81136.label}>나이</Text>
          <View style={[v_d81136.inlineOptions, v_d81136.ageOptionsRow]}>
            {v_0c96f7.map((v_0bd920, v_a56041) => {
              const v_26dce6 = v_f83808 === v_0bd920;
              const v_0d0d82 = v_a56041 === v_0c96f7.length - 1;
              return (
                <OptionButton
                  key={v_0bd920}
                  label={v_0bd920}
                  selected={v_26dce6}
                  onPress={() => v_64a312(v_0bd920)}
                  flex={1}
                  style={[
                    v_d81136.ageOptionButton,
                    !v_0d0d82 && v_d81136.ageOptionSpacing,
                  ]}
                />
              );
            })}
          </View>
        </View>

        <FormField
          label="추천이메일"
          placeholder="oth-staff@example.invalid"
          value={v_9bf12c}
          onChangeText={v_fb6bbb}
          autoCapitalize="none"
          containerStyle={v_d81136.fieldContainer}
        />

        <View style={v_d81136.termsRow}>
          <FormCheckbox
            checked={v_91ca05}
            onToggle={() => v_cbfe22((v_ba2215) => !v_ba2215)}
            variant="square"
          />
          <Text style={v_d81136.termsText}>
            XRUN 서비스 약관 및{' '}
            <Text style={v_d81136.termsHighlight}>개인정보 보호정책</Text>에
            동의합니다.
          </Text>
        </View>

        <View style={v_d81136.buttonWrapper}>
          <PrimaryButton
            title="가입하기"
            fullWidth
            onPress={v_585b02}
          />
        </View>
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
    paddingBottom: 120,
  },
  fieldContainer: {
    width: '100%',
    maxWidth: 780,
    alignSelf: 'center',
  },
  formGroup: {
    width: '100%',
    maxWidth: 780,
    alignSelf: 'center',
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    lineHeight: 24,
    color: '#2a2727',
    fontFamily: 'Roboto-Medium',
    marginBottom: 8,
  },
  phonePrefix: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 12,
    borderRightWidth: 1,
    borderRightColor: '#ededed',
  },
  flagIcon: {
    width: 24,
    height: 16,
    resizeMode: 'contain',
    marginRight: 6,
  },
  countryCode: {
    fontSize: 16,
    color: '#2a2727',
    fontFamily: 'Roboto-Medium',
  },
  inlineOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: '100%',
    maxWidth: 780,
    alignSelf: 'center',
  },
  ageOptionsRow: {
    flexWrap: 'nowrap',
    justifyContent: 'space-between',
  },
  ageOptionButton: {
    marginRight: 0,
    marginBottom: 0,
  },
  ageOptionSpacing: {
    marginRight: 8,
  },
  termsRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    width: '100%',
    maxWidth: 780,
    alignSelf: 'center',
    marginBottom: 24,
    gap: 12,
  },
  termsText: {
    flex: 1,
    fontSize: 12,
    lineHeight: 15,
    color: '#8e9bae',
    fontFamily: 'Roboto-Regular',
  },
  termsHighlight: {
    fontFamily: 'Roboto-SemiBold',
    color: '#8e9bae',
  },
  buttonWrapper: {
    width: '100%',
    maxWidth: 780,
    alignSelf: 'center',
  },
  homeIndicator: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: 34,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 9,
  },
  homeIndicatorBar: {
    width: 134,
    height: 5,
    backgroundColor: '#10192d',
    borderRadius: 100,
  },
});


