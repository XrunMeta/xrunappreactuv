import v_a3453e, { v_5ab095 } from 'bapkr';
import {
  v_3094a2,
  v_19b633,
  v_472849,
  v_122070,
  v_326be8,
  v_03e392,
  v_4623af,
  v_39a996,
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
import { v_700ef9 } from '../context';
import { v_9553a4, v_6946fd } from '../constants';
import {
  v_60e3a5,
  v_01332e,
  v_35200c,
  v_9d2541,
  v_91bb22,
} from '../services';

const v_798085 = [
  { value: 'male', label: '남' },
  { value: 'female', label: '여' },
] as const;

const v_0c96f7 = ['10', '20', '30', '40', '50+'] as const;

type GenderValue = (typeof v_798085)[number]['value'];
type AgeValue = (typeof v_0c96f7)[number];

export const v_f40fc5 = () => {
  const { goBack: v_c7ac57, navigate: v_9b57fc, reset: v_487a25 } = v_a0daa8();
  const {
    selectedCountryDialCode: v_459d5e,
    selectedRegion: v_2f03bc,
    setSelectMode: v_67ab1c,
    signupFormData: v_8d7bc8,
    setSignupFormData: v_eee6b0,
    resetSignupFormData: v_4df356,
  } = v_700ef9();
  const [v_f142d8, v_6dde2f] = v_5ab095(v_8d7bc8.familyName);
  const [v_a7c7b7, v_15ded5] = v_5ab095(v_8d7bc8.givenName);
  const [v_e0c7e8, v_fedf34] = v_5ab095(v_8d7bc8.email);
  const [v_adc076, v_52b279] = v_5ab095(v_8d7bc8.password);
  const [v_3a6ac4, v_f768f9] = v_5ab095(v_8d7bc8.phoneNumber);
  const [v_a6c30b, v_c030e3] = v_5ab095(v_8d7bc8.region);
  const [v_9bf12c, v_fb6bbb] = v_5ab095(v_8d7bc8.referralEmail);
  const [v_c3eac4, v_bdc43c] = v_5ab095<GenderValue>(v_8d7bc8.gender);
  const [v_f83808, v_64a312] = v_5ab095<AgeValue>(v_8d7bc8.ageRange);
  const [v_91ca05, v_cbfe22] = v_5ab095(v_8d7bc8.termsAccepted);
  const [v_88dca2, v_e33ec0] = v_5ab095(false);

  v_a3453e.useEffect(() => {
    v_6dde2f(v_8d7bc8.familyName);
    v_15ded5(v_8d7bc8.givenName);
    v_fedf34(v_8d7bc8.email);
    v_52b279(v_8d7bc8.password);
    v_f768f9(v_8d7bc8.phoneNumber);
    v_c030e3(v_8d7bc8.region);
    v_fb6bbb(v_8d7bc8.referralEmail);
    v_bdc43c(v_8d7bc8.gender);
    v_64a312(v_8d7bc8.ageRange);
    v_cbfe22(v_8d7bc8.termsAccepted);
  }, []); 

  v_a3453e.useEffect(() => {
    v_eee6b0({
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
  }, [
    v_f142d8,
    v_a7c7b7,
    v_e0c7e8,
    v_adc076,
    v_3a6ac4,
    v_a6c30b,
    v_9bf12c,
    v_c3eac4,
    v_f83808,
    v_91ca05,
    v_eee6b0,
  ]);

  const v_585b02 = async () => {

    if (!v_91ca05) {
      v_03e392.alert('동의 필요', '약관에 동의해야 가입을 진행할 수 있습니다.');
      return;
    }

    if (!v_f142d8.trim() || !v_a7c7b7.trim()) {
      v_03e392.alert('입력 오류', '성과 이름을 입력해주세요.');
      return;
    }

    if (!v_e0c7e8.trim()) {
      v_03e392.alert('입력 오류', '이메일을 입력해주세요.');
      return;
    }

    if (!v_adc076.trim() || v_adc076.length < 6) {
      v_03e392.alert('입력 오류', '비밀번호는 6자 이상 입력해주세요.');
      return;
    }

    if (!v_3a6ac4.trim()) {
      v_03e392.alert('입력 오류', '전화번호를 입력해주세요.');
      return;
    }

    if (!v_2f03bc && !v_a6c30b.trim()) {
      v_03e392.alert('입력 오류', '지역을 선택해주세요.');
      return;
    }

    v_e33ec0(true);

    try {

      console.log('[회원가입] 1단계: 이메일 중복 확인 시작');
      const v_d854e8 = await v_60e3a5(v_e0c7e8.trim(), v_9b57fc);

      if (!v_d854e8) {
        v_03e392.alert('이메일 중복', '이미 사용 중인 이메일입니다.');
        v_e33ec0(false);
        return;
      }

      let v_65bdb1 = 0;
      if (v_9bf12c.trim()) {
        console.log('[회원가입] 2단계: 추천인 이메일 확인 시작');
        const v_8aae3c = await v_01332e(v_9bf12c.trim(), v_9b57fc);
        if (v_8aae3c !== null) {
          v_65bdb1 = v_8aae3c;
        } else {

          const v_411201 = await new Promise<boolean>((v_6f7712) => {
            v_03e392.alert(
              '추천인 확인',
              '유효하지 않은 추천인 이메일입니다. 계속 진행하시겠습니까?',
              [
                {
                  text: '취소',
                  style: 'cancel',
                  onPress: () => {
                    v_e33ec0(false);
                    v_6f7712(false);
                  },
                },
                {
                  text: '계속',
                  onPress: () => v_6f7712(true),
                },
              ],
            );
          });

          if (!v_411201) {
            return;
          }

        }
      }

      console.log('[회원가입] 3단계: 회원가입 실행 시작');
      const v_6c3a47 = parseInt(v_459d5e.dialCode.replace('+', ''), 10) || 82;
      const v_a4d981 = v_459d5e.iso2 || 'KR';

      const v_94bdf5 = v_2f03bc
        ? v_9553a4(v_2f03bc.iso2)
        : parseInt(v_a6c30b) || 2; 

      const v_df7dab = {
        email: v_e0c7e8.trim(),
        pin: v_adc076,
        firstname: v_a7c7b7.trim(),
        lastname: v_f142d8.trim(),
        gender: v_91bb22.getGenderCode(v_c3eac4),
        mobile: v_3a6ac4.trim(),
        mobilecode: v_6c3a47,
        countrycode: v_a4d981,
        country: v_6c3a47,
        region: v_94bdf5,
        age: v_91bb22.getAgeCode(v_f83808),
        recommand: v_65bdb1,
        os: v_91bb22.getOSCode(),
      };

      const v_d0b446 = await v_35200c(v_df7dab, v_9b57fc);

      if (!v_d0b446) {
        v_03e392.alert('회원가입 실패', '회원가입에 실패했습니다. 다시 시도해주세요.');
        v_e33ec0(false);
        return;
      }

      console.log('[회원가입] 4단계: 로그인 확인 시작');
      const v_7e280a = await v_9d2541(v_e0c7e8.trim(), v_adc076, v_9b57fc);

      if (!v_7e280a) {
        v_03e392.alert(
          '로그인 확인 실패',
          '회원가입은 완료되었지만 로그인 확인에 실패했습니다. 로그인 화면에서 다시 시도해주세요.',
        );
        v_487a25('authLanding');
        v_9b57fc('login');
        v_e33ec0(false);
        return;
      }

      v_03e392.alert('회원가입 완료', '회원가입이 완료되었습니다.', [
        {
          text: '확인',
          onPress: () => {

            v_4df356();
            v_487a25('authLanding');
            v_9b57fc('login');
          },
        },
      ]);
    } catch (v_5e9bfe) {
      console.error('[회원가입] 전체 프로세스 실패:', v_5e9bfe);
      const v_1744b9 =
        v_5e9bfe.response?.data?.message ||
        v_5e9bfe.message ||
        '회원가입 중 오류가 발생했습니다.';
      v_03e392.alert('오류', v_1744b9);
    } finally {
      v_e33ec0(false);
    }
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
            <TouchableOpacity
              style={v_d81136.phonePrefix}
              onPress={() => v_9b57fc('countryCodeSelect')}
              activeOpacity={0.7}
            >
              <Text style={v_d81136.flagEmoji}>{v_459d5e.flagEmoji}</Text>
              <Text style={v_d81136.countryCode}>{v_459d5e.dialCode}</Text>
            </TouchableOpacity>
          }
        />

        <TouchableOpacity
          onPress={() => {
            v_67ab1c('region');
            v_9b57fc('countryCodeSelect');
          }}
          style={v_d81136.fieldContainer}
        >
          <FormField
            label="지역"
            placeholder="지역을 선택하세요"
            value={v_2f03bc ? v_2f03bc.name : v_a6c30b || ''}
            editable={false}
            containerStyle={v_d81136.fieldContainer}
          />
        </TouchableOpacity>

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
            title={v_88dca2 ? '처리 중...' : '가입하기'}
            fullWidth
            onPress={v_585b02}
            disabled={v_88dca2}
          />
          {v_88dca2 && (
            <View style={v_d81136.loadingContainer}>
              <ActivityIndicator size="small" color={v_1bfbd0.buttonPrimary} />
            </View>
          )}
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
    paddingVertical: 4,
    borderRightWidth: 1,
    borderRightColor: '#ededed',
  },
  flagEmoji: {
    fontSize: 20,
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
  loadingContainer: {
    marginTop: 12,
    alignItems: 'center',
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

