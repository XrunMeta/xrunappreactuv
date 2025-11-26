import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Platform,
  Alert,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useTranslation } from 'react-i18next';
import {
  FormCheckbox,
  FormField,
  Header,
  OptionButton,
  PrimaryButton,
} from '../components';
import { COLORS } from '../constants';
import { useAppNavigation } from '../navigation';
import { useAppContext } from '../context';
import { getRegionIdByIso2, getRegionNameById } from '../constants';
import {
  checkEmailAvailability,
  checkReferralEmail,
  signup,
  checkLogin,
  SignupHelpers,
} from '../services';

const AGE_OPTIONS = ['10', '20', '30', '40', '50+'] as const;

type GenderValue = (typeof GENDER_OPTIONS)[number]['value'];
type AgeValue = (typeof AGE_OPTIONS)[number];

export const SignupScreen = () => {
  const { t } = useTranslation();
  const { goBack, navigate, reset } = useAppNavigation();
  const {
    selectedCountryDialCode,
    selectedRegion,
    setSelectMode,
    signupFormData,
    setSignupFormData,
    resetSignupFormData,
  } = useAppContext();

  const GENDER_OPTIONS = [
    { value: 'male', label: t('screens.signup.genderMale') },
    { value: 'female', label: t('screens.signup.genderFemale') },
  ] as const;
  const [familyName, setFamilyName] = useState(signupFormData.familyName);
  const [givenName, setGivenName] = useState(signupFormData.givenName);
  const [email, setEmail] = useState(signupFormData.email);
  const [password, setPassword] = useState(signupFormData.password);
  const [phoneNumber, setPhoneNumber] = useState(signupFormData.phoneNumber);
  const [region, setRegion] = useState(signupFormData.region);
  const [referralEmail, setReferralEmail] = useState(signupFormData.referralEmail);
  const [gender, setGender] = useState<GenderValue>(signupFormData.gender);
  const [ageRange, setAgeRange] = useState<AgeValue>(signupFormData.ageRange);
  const [termsAccepted, setTermsAccepted] = useState(signupFormData.termsAccepted);
  const [isSubmitting, setIsSubmitting] = useState(false);

  React.useEffect(() => {
    setFamilyName(signupFormData.familyName);
    setGivenName(signupFormData.givenName);
    setEmail(signupFormData.email);
    setPassword(signupFormData.password);
    setPhoneNumber(signupFormData.phoneNumber);
    setRegion(signupFormData.region);
    setReferralEmail(signupFormData.referralEmail);
    setGender(signupFormData.gender);
    setAgeRange(signupFormData.ageRange);
    setTermsAccepted(signupFormData.termsAccepted);
  }, []); 

  React.useEffect(() => {
    setSignupFormData({
      familyName,
      givenName,
      email,
      password,
      phoneNumber,
      region,
      referralEmail,
      gender,
      ageRange,
      termsAccepted,
    });
  }, [
    familyName,
    givenName,
    email,
    password,
    phoneNumber,
    region,
    referralEmail,
    gender,
    ageRange,
    termsAccepted,
    setSignupFormData,
  ]);

  const handleSubmit = async () => {

    if (!termsAccepted) {
      Alert.alert(t('screens.signup.alerts.termsRequired'), t('screens.signup.errors.termsRequired'));
      return;
    }

    if (!familyName.trim() || !givenName.trim()) {
      Alert.alert(t('screens.signup.alerts.inputError'), t('screens.signup.errors.nameRequired'));
      return;
    }

    if (!email.trim()) {
      Alert.alert(t('screens.signup.alerts.inputError'), t('screens.signup.errors.emailRequired'));
      return;
    }

    if (!password.trim() || password.length < 6) {
      Alert.alert(t('screens.signup.alerts.inputError'), t('screens.signup.errors.passwordRequired'));
      return;
    }

    if (!phoneNumber.trim()) {
      Alert.alert(t('screens.signup.alerts.inputError'), t('screens.signup.errors.phoneRequired'));
      return;
    }

    if (!selectedRegion && !region.trim()) {
      Alert.alert(t('screens.signup.alerts.inputError'), t('screens.signup.errors.regionRequired'));
      return;
    }

    setIsSubmitting(true);

    try {

      console.log('[회원가입] 1단계: 이메일 중복 확인 시작');
      const isEmailAvailable = await checkEmailAvailability(email.trim(), navigate);

      if (!isEmailAvailable) {
        Alert.alert(t('screens.signup.alerts.emailDuplicate'), t('screens.signup.errors.emailDuplicate'));
        setIsSubmitting(false);
        return;
      }

      let referralMemberId = 0;
      if (referralEmail.trim()) {
        console.log('[회원가입] 2단계: 추천인 이메일 확인 시작');
        const referralId = await checkReferralEmail(referralEmail.trim(), navigate);
        if (referralId !== null) {
          referralMemberId = referralId;
        } else {

          const shouldContinue = await new Promise<boolean>((resolve) => {
            Alert.alert(
              t('screens.signup.alerts.referralConfirm'),
              t('screens.signup.errors.referralInvalid'),
              [
                {
                  text: t('screens.signup.alerts.cancel'),
                  style: 'cancel',
                  onPress: () => {
                    setIsSubmitting(false);
                    resolve(false);
                  },
                },
                {
                  text: t('screens.signup.alerts.continue'),
                  onPress: () => resolve(true),
                },
              ],
            );
          });

          if (!shouldContinue) {
            return;
          }

        }
      }

      console.log('[회원가입] 3단계: 회원가입 실행 시작');
      const mobileCode = parseInt(selectedCountryDialCode.dialCode.replace('+', ''), 10) || 82;
      const countryCode = selectedCountryDialCode.iso2 || 'KR';

      const regionId = selectedRegion
        ? getRegionIdByIso2(selectedRegion.iso2)
        : parseInt(region) || 2; 

      const signupData = {
        email: email.trim(),
        pin: password,
        firstname: givenName.trim(),
        lastname: familyName.trim(),
        gender: SignupHelpers.getGenderCode(gender),
        mobile: phoneNumber.trim(),
        mobilecode: mobileCode,
        countrycode: countryCode,
        country: mobileCode,
        region: regionId,
        age: SignupHelpers.getAgeCode(ageRange),
        recommand: referralMemberId,
        os: SignupHelpers.getOSCode(),
      };

      const signupSuccess = await signup(signupData, navigate);

      if (!signupSuccess) {
        Alert.alert(t('screens.signup.alerts.signupFailed'), t('screens.signup.errors.signupFailed'));
        setIsSubmitting(false);
        return;
      }

      console.log('[회원가입] 4단계: 로그인 확인 시작');
      const loginSuccess = await checkLogin(email.trim(), password, navigate);

      if (!loginSuccess) {
        Alert.alert(
          t('screens.signup.alerts.loginCheckFailed'),
          t('screens.signup.errors.loginCheckFailed'),
        );
        reset('authLanding');
        navigate('login');
        setIsSubmitting(false);
        return;
      }

      Alert.alert(t('screens.signup.success.title'), t('screens.signup.success.message'), [
        {
          text: t('screens.signup.success.confirm'),
          onPress: () => {

            resetSignupFormData();
            reset('authLanding');
            navigate('login');
          },
        },
      ]);
    } catch (error: any) {
      console.error('[회원가입] 전체 프로세스 실패:', error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        t('screens.signup.errors.error');
      Alert.alert(t('screens.signup.alerts.error'), errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <Header
        title="회원가입"
        onBackPress={goBack}
        showBackButton
      />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <FormField
          label="성"
          placeholder="Enter your First name"
          value={familyName}
          onChangeText={setFamilyName}
          autoCapitalize="none"
          containerStyle={styles.fieldContainer}
        />

        <FormField
          label="이름"
          placeholder="Enter your Last name"
          value={givenName}
          onChangeText={setGivenName}
          autoCapitalize="none"
          containerStyle={styles.fieldContainer}
        />

        <FormField
          label="Email"
          placeholder="Enter your email address"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          containerStyle={styles.fieldContainer}
        />

        <FormField
          label="비밀번호"
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          autoCapitalize="none"
          containerStyle={styles.fieldContainer}
        />

        <FormField
          label="전화번호"
          placeholder="휴대폰 번호를 입력해주세요."
          keyboardType="phone-pad"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          containerStyle={styles.fieldContainer}
          leftAccessory={
            <TouchableOpacity
              style={styles.phonePrefix}
              onPress={() => navigate('countryCodeSelect')}
              activeOpacity={0.7}
            >
              <Text style={styles.flagEmoji}>{selectedCountryDialCode.flagEmoji}</Text>
              <Text style={styles.countryCode}>{selectedCountryDialCode.dialCode}</Text>
            </TouchableOpacity>
          }
        />

        <TouchableOpacity
          onPress={() => {
            setSelectMode('region');
            navigate('countryCodeSelect');
          }}
          style={styles.fieldContainer}
        >
          <FormField
            label={t('screens.signup.regionLabel')}
            placeholder={t('screens.signup.regionPlaceholder')}
            value={selectedRegion ? selectedRegion.name : region || ''}
            editable={false}
            containerStyle={styles.fieldContainer}
          />
        </TouchableOpacity>

        <View style={styles.formGroup}>
          <Text style={styles.label}>{t('screens.signup.genderLabel')}</Text>
          <View style={styles.inlineOptions}>
            {GENDER_OPTIONS.map((option) => {
              const isActive = gender === option.value;
              return (
                <OptionButton
                  key={option.value}
                  label={option.label}
                  selected={isActive}
                  onPress={() => setGender(option.value)}
                />
              );
            })}
          </View>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>{t('screens.signup.ageLabel')}</Text>
          <View style={[styles.inlineOptions, styles.ageOptionsRow]}>
            {AGE_OPTIONS.map((option, index) => {
              const isActive = ageRange === option;
              const isLast = index === AGE_OPTIONS.length - 1;
              return (
                <OptionButton
                  key={option}
                  label={option}
                  selected={isActive}
                  onPress={() => setAgeRange(option)}
                  flex={1}
                  style={[
                    styles.ageOptionButton,
                    !isLast && styles.ageOptionSpacing,
                  ]}
                />
              );
            })}
          </View>
        </View>

        <FormField
          label={t('screens.signup.referralEmailLabel')}
          placeholder={t('screens.signup.referralEmailPlaceholder')}
          value={referralEmail}
          onChangeText={setReferralEmail}
          autoCapitalize="none"
          containerStyle={styles.fieldContainer}
        />

        <View style={styles.termsRow}>
          <FormCheckbox
            checked={termsAccepted}
            onToggle={() => setTermsAccepted((prev) => !prev)}
            variant="square"
          />
          <Text style={styles.termsText}>
            {t('screens.signup.termsText')}{' '}
            <Text style={styles.termsHighlight}>{t('screens.signup.termsHighlight')}</Text>{' '}
            {t('screens.signup.termsAgree')}
          </Text>
        </View>

        <View style={styles.buttonWrapper}>
          <PrimaryButton
            title={isSubmitting ? t('screens.signup.submitting') : t('screens.signup.submitButton')}
            fullWidth
            onPress={handleSubmit}
            disabled={isSubmitting}
          />
          {isSubmitting && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color={COLORS.buttonPrimary} />
            </View>
          )}
        </View>
      </ScrollView>

      {Platform.OS === 'ios' && (
        <View style={styles.homeIndicator}>
          <View style={styles.homeIndicatorBar} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
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

