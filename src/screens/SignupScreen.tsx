import v_a3453e, { v_5ab095 } from 'bapkr';
import {
  v_3094a2,
  v_19b633,
  v_472849,
  v_326be8,
  v_4623af,
  v_39a996,
} from 'rcmrninabrnb';
import { v_25515d } from 'zvyjokvuouwvifyzks';
import { v_772971 } from 'jmpfvteuuztnp';
import v_e84827 from 'bkjbgtcoyuizqwgwtnaxmfkyvlqwevapsqmanbsnv';
import {
  v_fa3feb,
  v_368e80,
  v_570c34,
  v_729608,
  v_89c10a,
  v_cb41de,
} from '../components';
import { v_1bfbd0, v_9b1a04, v_843035 } from '../constants';
import { v_a0daa8, v_ce4741 } from '../navigation';
import { v_700ef9 } from '../context';
import { v_4b1173 } from '../context/AlertDialogContext';
import { v_9553a4, v_6946fd, v_369014, v_789afd, v_a61db3, v_bae512 } from '../constants';

import {
  v_60e3a5,
  v_01332e,
  v_35200c,
  v_9d2541,
  v_91bb22,
} from '../services';

const v_0c96f7 = ['10', '20', '30', '40', '50+'] as const;

type GenderValue = 'male' | 'female';
type AgeValue = (typeof v_0c96f7)[number];

export const v_f40fc5 = () => {
  const { t: v_8d41d7 } = v_772971();
  const { goBack: v_c7ac57, navigate: v_9b57fc, reset: v_487a25 } = v_a0daa8();
  const { showAlert: v_889fad } = v_4b1173();
  const {
    selectedCountryDialCode: v_459d5e,
    selectedRegion: v_2f03bc,
    setSelectMode: v_67ab1c,
    signupFormData: v_8d7bc8,
    setSignupFormData: v_eee6b0,
    resetSignupFormData: v_4df356,
    setVerificationEmail: v_b572c3,
    setVerificationSuccessRoute: v_8f89f3,
  } = v_700ef9();

  const v_798085 = [
    { value: 'male', label: v_8d41d7('screens.signup.genderMale') },
    { value: 'female', label: v_8d41d7('screens.signup.genderFemale') },
  ] as const;
  const [v_f142d8, v_6dde2f] = v_5ab095(v_8d7bc8.familyName);
  const [v_a7c7b7, v_15ded5] = v_5ab095(v_8d7bc8.givenName);
  const [v_05b02f, v_ef747e] = v_5ab095(
    v_8d7bc8.familyName || v_8d7bc8.givenName
      ? `${v_8d7bc8.familyName || ''} ${v_8d7bc8.givenName || ''}`.trim()
      : ''
  );
  const [v_e0c7e8, v_fedf34] = v_5ab095(v_8d7bc8.email);
  const [v_adc076, v_52b279] = v_5ab095(v_8d7bc8.password);
  const [v_1e51a9, v_014c88] = v_5ab095('');
  const [v_f872c3, v_c6fe9e] = v_5ab095(false);
  const [v_99a8a8, v_ed3503] = v_5ab095(false);
  const [v_3a6ac4, v_f768f9] = v_5ab095(v_8d7bc8.phoneNumber);
  const [v_9bf12c, v_fb6bbb] = v_5ab095(v_8d7bc8.referralEmail);
  const [v_c3eac4, v_bdc43c] = v_5ab095<GenderValue>(v_8d7bc8.gender);
  const [v_f83808, v_64a312] = v_5ab095<AgeValue>(v_8d7bc8.ageRange);
  const [v_471e49, v_7f4d53] = v_5ab095(v_8d7bc8.termsAccepted);
  const [v_68a5a9, v_8e53ad] = v_5ab095(v_8d7bc8.termsAccepted);
  const [v_e55f34, v_f932c8] = v_5ab095(v_8d7bc8.termsAccepted);
  const [v_88dca2, v_e33ec0] = v_5ab095(false);

  const v_b1f14f = v_471e49 && v_68a5a9 && v_e55f34;

  const v_590486 = v_459d5e?.iso2?.toLowerCase() === 'kr';

  const v_56743f = v_2f03bc
    ? v_2f03bc.name
    : v_590486
      ? ''
      : v_789afd.name;

  const v_2ca208 = v_a3453e.useRef(false);

  v_a3453e.useEffect(() => {
    if (!v_2ca208.current) {
      v_6dde2f(v_8d7bc8.familyName);
      v_15ded5(v_8d7bc8.givenName);

      const v_419da8 = `${v_8d7bc8.familyName || ''} ${v_8d7bc8.givenName || ''}`.trim();
      v_ef747e(v_419da8);
      v_fedf34(v_8d7bc8.email);
      v_52b279(v_8d7bc8.password);
      v_014c88('');
      v_c6fe9e(false);
      v_ed3503(false);
      v_f768f9(v_8d7bc8.phoneNumber);
      v_fb6bbb(v_8d7bc8.referralEmail);
      v_bdc43c(v_8d7bc8.gender);
      v_64a312(v_8d7bc8.ageRange);
      v_7f4d53(v_8d7bc8.termsAccepted);
      v_8e53ad(v_8d7bc8.termsAccepted);
      v_f932c8(v_8d7bc8.termsAccepted);
      v_2ca208.current = true;
    }
  }, [v_8d7bc8]);

  v_a3453e.useEffect(() => {
    if (!v_2ca208.current) return;

    v_eee6b0({
      familyName: v_f142d8,
      givenName: v_a7c7b7,
      email: v_e0c7e8,
      password: v_adc076,
      phoneNumber: v_3a6ac4,
      region: v_2f03bc ? v_2f03bc.iso2 : '',
      referralEmail: v_9bf12c,
      gender: v_c3eac4,
      ageRange: v_f83808,
      termsAccepted: v_b1f14f,
    });
  }, [
    v_f142d8,
    v_a7c7b7,
    v_e0c7e8,
    v_adc076,
    v_3a6ac4,
    v_2f03bc,
    v_9bf12c,
    v_c3eac4,
    v_f83808,
    v_b1f14f,

  ]);

  const v_585b02 = async () => {

    if (!v_b1f14f) {
      await v_889fad(v_8d41d7('screens.signup.alerts.termsRequired'), v_8d41d7('screens.signup.errors.termsRequired'));
      return;
    }

    const v_b63249 = v_05b02f.trim().split(/\s+/);
    let v_c0da8d = '';
    let v_eb8dd4 = '';

    if (v_b63249.length === 0) {
      await v_889fad(v_8d41d7('screens.signup.alerts.inputError'), v_8d41d7('screens.signup.errors.nameRequired'));
      return;
    } else if (v_b63249.length === 1) {

      v_c0da8d = v_b63249[0];
      v_eb8dd4 = '';
    } else {

      v_eb8dd4 = v_b63249[0];
      v_c0da8d = v_b63249.slice(1).join(' ');
    }

    if (!v_c0da8d.trim()) {
      await v_889fad(v_8d41d7('screens.signup.alerts.inputError'), v_8d41d7('screens.signup.errors.nameRequired'));
      return;
    }

    if (!v_e0c7e8.trim()) {
      await v_889fad(v_8d41d7('screens.signup.alerts.inputError'), v_8d41d7('screens.signup.errors.emailRequired'));
      return;
    }

    if (!v_adc076.trim()) {
      await v_889fad(v_8d41d7('screens.signup.alerts.inputError'), v_8d41d7('screens.signup.errors.passwordRequired'));
      return;
    }

    const v_b947d5 = v_adc076.length >= 7;
    const v_5af9de = /\d/.test(v_adc076);
    const v_f18523 = /[a-z]/.test(v_adc076);
    const v_f6f742 = /[A-Z]/.test(v_adc076);

    if (!(v_b947d5 && v_5af9de && v_f18523 && v_f6f742)) {
      await v_889fad(v_8d41d7('screens.signup.alerts.inputError'), v_8d41d7('screens.signup.errors.passwordPolicy'));
      return;
    }

    if (!v_1e51a9.trim()) {
      await v_889fad(
        v_8d41d7('screens.signup.alerts.inputError'),
        v_8d41d7('screens.signup.errors.passwordConfirmRequired'),
      );
      return;
    }

    if (v_adc076 !== v_1e51a9) {
      await v_889fad(v_8d41d7('screens.signup.alerts.inputError'), v_8d41d7('screens.signup.errors.passwordMismatch'));
      return;
    }

    if (!v_3a6ac4.trim()) {
      await v_889fad(v_8d41d7('screens.signup.alerts.inputError'), v_8d41d7('screens.signup.errors.phoneRequired'));
      return;
    }

    if (v_590486 && !v_2f03bc) {
      await v_889fad(v_8d41d7('screens.signup.alerts.inputError'), v_8d41d7('screens.signup.errors.regionRequired'));
      return;
    }

    v_e33ec0(true);

    try {

      console.log('[회원가입] 1단계: 이메일 중복 확인 시작');
      const v_d854e8 = await v_60e3a5(v_e0c7e8.trim(), v_9b57fc);

      if (!v_d854e8) {
        await v_889fad(v_8d41d7('screens.signup.alerts.emailDuplicate'), v_8d41d7('screens.signup.errors.emailDuplicate'));
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

          const v_af3e48 = await v_889fad(
            v_8d41d7('screens.signup.alerts.referralConfirm'),
            v_8d41d7('screens.signup.errors.referralInvalid'),
            [
              {
                text: v_8d41d7('screens.signup.alerts.cancel'),
                style: 'cancel',
                onPress: () => {
                  v_e33ec0(false);
                },
              },
              {
                text: v_8d41d7('screens.signup.alerts.continue'),
                onPress: () => {

                },
              },
            ],
          );

          if (v_af3e48 === 0) {
            return;
          }

        }
      } else {

        console.log('[회원가입] 2단계: 추천인 이메일이 비어있음 - 알림 표시');
        const v_af3e48 = await v_889fad(
          v_8d41d7('screens.signup.alerts.referralEmpty'),
          v_8d41d7('screens.signup.errors.referralEmpty'),
          [
            {
              text: v_8d41d7('screens.signup.alerts.inputReferral'),
              style: 'cancel',
              onPress: () => {
                v_e33ec0(false);
              },
            },
            {
              text: v_8d41d7('screens.signup.alerts.confirm'),
              onPress: () => {

              },
            },
          ],
        );

        if (v_af3e48 === 0) {
          return;
        }

      }

      console.log('[회원가입] 3단계: 회원가입 데이터 저장 및 이메일 인증 화면 이동');

      try {

        const v_0e0310 = {
          email: v_e0c7e8.trim(),
          password: v_adc076,
          familyName: v_eb8dd4.trim(),
          givenName: v_c0da8d.trim(),
          phoneNumber: v_3a6ac4.trim(),
          selectedCountryDialCode: {
            iso2: v_459d5e.iso2,
            dialCode: v_459d5e.dialCode,
            flagEmoji: v_459d5e.flagEmoji,
            name: v_459d5e.name,
          },
          selectedRegion: v_2f03bc
            ? {
              iso2: v_2f03bc.iso2,
              dialCode: v_2f03bc.dialCode,
              flagEmoji: v_2f03bc.flagEmoji,
              name: v_2f03bc.name,
            }
            : null,
          referralMemberId: v_65bdb1,
          gender: v_c3eac4,
          ageRange: v_f83808,
        };

        await v_e84827.setItem('pendingSignupData', JSON.stringify(v_0e0310));
        console.log('[회원가입] AsyncStorage에 회원가입 데이터 저장 완료');

        v_b572c3(v_e0c7e8.trim());
        v_8f89f3(v_ce4741.signup); 

        v_e33ec0(false);
        v_9b57fc(v_ce4741.emailVerification);
      } catch (v_df17d5) {
        console.error('[회원가입] AsyncStorage 저장 실패:', v_df17d5);
        await v_889fad(
          v_8d41d7('screens.signup.alerts.error'),
          v_8d41d7('screens.signup.errors.error') || '데이터 저장에 실패했습니다. 다시 시도해주세요.',
        );
        v_e33ec0(false);
        return;
      }
    } catch (v_5e9bfe) {
      console.error('[회원가입] 전체 프로세스 실패:', v_5e9bfe);

      try {
        await v_e84827.removeItem('pendingSignupData');
        console.log('[회원가입] 에러 발생으로 인한 AsyncStorage 정리 완료');
      } catch (v_df17d5) {
        console.error('[회원가입] AsyncStorage 정리 실패:', v_df17d5);
      }

      const v_1744b9 =
        v_5e9bfe.response?.data?.message ||
        v_5e9bfe.message ||
        v_8d41d7('screens.signup.errors.error');
      await v_889fad(v_8d41d7('screens.signup.alerts.error'), v_1744b9);
    } finally {
      v_e33ec0(false);
    }
  };

  return (
    <View style={v_d81136.container}>
      <Header
        title={v_8d41d7('screens.signup.title')}
        onBackPress={v_c7ac57}
        showBackButton
      />
      <SafeScrollView
        contentContainerStyle={v_d81136.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        autoAdjustKeyboardPadding={true}
      >
        <View style={v_d81136.formFieldContainer}>
          <FormField
            label={v_8d41d7('screens.signup.givenNameLabel')}
            placeholder={v_8d41d7('screens.signup.givenNamePlaceholder')}
            value={v_05b02f}
            onChangeText={(v_9b6134) => {
              v_ef747e(v_9b6134);

              const v_b63249 = v_9b6134.trim().split(/\s+/);
              if (v_b63249.length === 0) {
                v_6dde2f('');
                v_15ded5('');
              } else if (v_b63249.length === 1) {
                v_6dde2f('');
                v_15ded5(v_b63249[0]);
              } else {
                v_6dde2f(v_b63249[0]);
                v_15ded5(v_b63249.slice(1).join(' '));
              }
            }}
            autoCapitalize="none"
            containerStyle={v_d81136.fieldContainer}
          />

          <FormField
            label={v_8d41d7('screens.signup.emailLabel')}
            placeholder={v_8d41d7('screens.signup.emailPlaceholder')}
            value={v_e0c7e8}
            onChangeText={v_fedf34}
            keyboardType="email-address"
            autoCapitalize="none"
            containerStyle={v_d81136.fieldContainer}
          />

          <FormField
            label={v_8d41d7('screens.signup.passwordLabel')}
            placeholder={v_8d41d7('screens.signup.passwordPlaceholder')}
            value={v_adc076}
            onChangeText={v_52b279}
            secureTextEntry={!v_f872c3}
            autoCapitalize="none"
            containerStyle={v_d81136.fieldContainer}
            rightAccessory={
              <TouchableOpacity
                style={v_d81136.eyeButton}
                onPress={() => v_c6fe9e((v_ba2215) => !v_ba2215)}
                activeOpacity={0.7}
                disabled={v_88dca2}
              >
                <Ionicons
                  name={v_f872c3 ? 'eye-outline' : 'eye-off-outline'}
                  size={20}
                  color="#666666"
                />
              </TouchableOpacity>
            }
          />

          <FormField
            label={v_8d41d7('screens.signup.passwordConfirmLabel')}
            placeholder={v_8d41d7('screens.signup.passwordConfirmPlaceholder')}
            value={v_1e51a9}
            onChangeText={v_014c88}
            secureTextEntry={!v_99a8a8}
            autoCapitalize="none"
            containerStyle={v_d81136.fieldContainer}
            rightAccessory={
              <TouchableOpacity
                style={v_d81136.eyeButton}
                onPress={() => v_ed3503((v_ba2215) => !v_ba2215)}
                activeOpacity={0.7}
                disabled={v_88dca2}
              >
                <Ionicons
                  name={v_99a8a8 ? 'eye-outline' : 'eye-off-outline'}
                  size={20}
                  color="#666666"
                />
              </TouchableOpacity>
            }
          />

          <FormField
            containerStyle={v_d81136.fieldContainer}
            label={v_8d41d7('screens.signup.phoneNumberLabel')}
            placeholder={v_8d41d7('screens.signup.phoneNumberPlaceholder')}
            keyboardType="phone-pad"
            value={v_3a6ac4}
            onChangeText={v_f768f9}
            leftAccessory={
              <TouchableOpacity
                style={v_d81136.phonePrefix}
                onPress={() => {
                  v_67ab1c('country');
                  v_9b57fc('countryCodeSelect');
                }}
                activeOpacity={0.7}
              >
                <Text style={v_d81136.flagEmoji}>{v_459d5e.flagEmoji}</Text>
                <Text style={v_d81136.countryCode}>{v_459d5e.dialCode}</Text>
              </TouchableOpacity>
            }
          />

          <View style={v_d81136.fieldContainer}>
            <TouchableOpacity
              onPress={() => {
                if (!v_590486) {
                  return;
                }
                v_67ab1c('region');
                v_9b57fc('countryCodeSelect');
              }}
              disabled={!v_590486 || v_88dca2}
            >
              <FormField
                label={v_8d41d7('screens.signup.regionLabel')}
                placeholder={v_8d41d7('screens.signup.regionPlaceholder')}
                value={v_56743f}
                editable={false}
              />
            </TouchableOpacity>
            {!v_590486 && (
              <Text style={v_d81136.regionHelper}>
                {v_8d41d7('screens.signup.regionHelper') || 'Global 지역이 자동으로 적용됩니다.'}
              </Text>
            )}
          </View>

          <View style={v_d81136.fieldContainer}>
            <Text style={v_d81136.label}>{v_8d41d7('screens.signup.genderLabel')}</Text>
            <View style={[v_d81136.inlineOptions]}>
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

          <View style={v_d81136.fieldContainer}>
            <Text style={v_d81136.label}>{v_8d41d7('screens.signup.ageLabel')}</Text>
            <View style={[v_d81136.inlineOptions]}>
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
                  />
                );
              })}
            </View>
          </View>

          <FormField
            label={v_8d41d7('screens.signup.referralEmailLabel')}
            placeholder={v_8d41d7('screens.signup.referralEmailPlaceholder')}
            value={v_9bf12c}
            onChangeText={v_fb6bbb}
            autoCapitalize="none"
            containerStyle={v_d81136.fieldContainer}
          />

          {}
          <View style={v_d81136.termsRow}>
            <FormCheckbox
              checked={v_471e49}
              onToggle={() => v_7f4d53((v_ba2215) => !v_ba2215)}
              variant="square"
            />
            <Text style={v_d81136.termsText}>
              <Text style={v_d81136.termsHighlight}>{v_8d41d7('screens.signup.terms.service')}</Text>{' '}
              {v_8d41d7('screens.signup.termsAgree')}
            </Text>
          </View>

          {}
          <View style={v_d81136.termsRow}>
            <FormCheckbox
              checked={v_68a5a9}
              onToggle={() => v_8e53ad((v_ba2215) => !v_ba2215)}
              variant="square"
            />
            <Text style={v_d81136.termsText}>
              <Text style={v_d81136.termsHighlight}>{v_8d41d7('screens.signup.terms.location')}</Text>{' '}
              {v_8d41d7('screens.signup.termsAgree')}
            </Text>
          </View>

          {}
          <View style={v_d81136.termsRow}>
            <FormCheckbox
              checked={v_e55f34}
              onToggle={() => v_f932c8((v_ba2215) => !v_ba2215)}
              variant="square"
            />
            <Text style={v_d81136.termsText}>
              <Text style={v_d81136.termsHighlight}>{v_8d41d7('screens.signup.terms.privacy')}</Text>{' '}
              {v_8d41d7('screens.signup.termsAgree')}
            </Text>
          </View>

          <View style={v_d81136.buttonWrapper}>
            <PrimaryButton
              title={v_88dca2 ? v_8d41d7('screens.signup.submitting') : v_8d41d7('screens.signup.submitButton')}
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
        </View>
      </SafeScrollView>
    </View>
  );
};

const v_d81136 = v_472849.create({
  container: {
    ...v_a61db3.container,
  },
  scrollContent: {
    ...v_a61db3.scrollContent,
  },
  formFieldContainer: {
    ...v_bae512.fieldContainer,
  },
  fieldContainer: {
    borderWidth: 0,
  },
  label: {
    ...v_bae512.label,
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
    fontSize: v_843035.size.large,
    marginRight: 6,
  },
  countryCode: {
    fontSize: v_843035.size.medium,
    color: '#2a2727',
    fontFamily: 'Roboto-Medium',
  },
  inlineOptions: {
    flexDirection: 'row',
    flexWrap: 'nowrap',
    justifyContent: 'flex-start',
    gap: 8,
    width: '100%',
  },
  eyeButton: {
    height: 24,
    width: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  termsRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    width: '100%',
    maxWidth: 780,
    alignSelf: 'center',
    gap: 12,
  },
  termsText: {
    flex: 1,
    fontSize: v_843035.size.msmall,
    lineHeight: 15,
    color: '#8e9bae',
    fontFamily: 'Roboto-Regular',
    alignSelf: 'center',
  },
  termsHighlight: {
    fontFamily: 'Roboto-SemiBold',
    color: '#343A5A',
  },
  buttonWrapper: {
    ...v_a61db3.bottomButtonContainer,
  },
  loadingContainer: {
    marginTop: 12,
    alignItems: 'center',
  },
  regionHelper: {
    fontSize: v_843035.size.small,
    lineHeight: 18,
    color: '#8e9bae',
    fontFamily: 'Roboto-Regular',
    marginTop: 4,
  },
});

