import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Platform,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  FormCheckbox,
  FormField,
  SafeScrollView,
  Header,
  OptionButton,
  PrimaryButton,
} from '../components';
import { COLORS, SIZES, FONTS } from '../constants';
import { useAppNavigation, ROUTES } from '../navigation';
import { useAppContext } from '../context';
import { useAlertDialog } from '../context/AlertDialogContext';
import { getRegionIdByIso2, getRegionNameById, getRegionsByCountryIso2, GLOBAL_REGION, COMMON_STYLES, FORM_STYLES } from '../constants';

import {
  checkEmailAvailability,
  checkReferralEmail,
  signup,
  checkLogin,
  SignupHelpers,
} from '../services';

const AGE_OPTIONS = ['10', '20', '30', '40', '50+'] as const;

type GenderValue = 'male' | 'female';
type AgeValue = (typeof AGE_OPTIONS)[number];

export const SignupScreen = () => {
  const { t } = useTranslation();
  const { goBack, navigate, reset } = useAppNavigation();
  const { showAlert } = useAlertDialog();
  const {
    selectedCountryDialCode,
    selectedRegion,
    setSelectMode,
    signupFormData,
    setSignupFormData,
    resetSignupFormData,
    setVerificationEmail,
    setVerificationSuccessRoute,
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
  const [referralEmail, setReferralEmail] = useState(signupFormData.referralEmail);
  const [gender, setGender] = useState<GenderValue>(signupFormData.gender);
  const [ageRange, setAgeRange] = useState<AgeValue>(signupFormData.ageRange);
  const [termsAccepted, setTermsAccepted] = useState(signupFormData.termsAccepted);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isKoreaSelected = selectedCountryDialCode?.iso2?.toLowerCase() === 'kr';

  const regionDisplayValue = selectedRegion
    ? selectedRegion.name
    : isKoreaSelected
    ? ''
    : GLOBAL_REGION.name;

  const isMountedRef = React.useRef(false);

  React.useEffect(() => {
    if (!isMountedRef.current) {
      setFamilyName(signupFormData.familyName);
      setGivenName(signupFormData.givenName);
      setEmail(signupFormData.email);
      setPassword(signupFormData.password);
      setPhoneNumber(signupFormData.phoneNumber);
      setReferralEmail(signupFormData.referralEmail);
      setGender(signupFormData.gender);
      setAgeRange(signupFormData.ageRange);
      setTermsAccepted(signupFormData.termsAccepted);
      isMountedRef.current = true;
    }
  }, [signupFormData]);

  React.useEffect(() => {
    if (!isMountedRef.current) return;

    setSignupFormData({
      familyName,
      givenName,
      email,
      password,
      phoneNumber,
      region: selectedRegion ? selectedRegion.iso2 : '',
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
    selectedRegion,
    referralEmail,
    gender,
    ageRange,
    termsAccepted,

  ]);

  const handleSubmit = async () => {

    if (!termsAccepted) {
      await showAlert(t('screens.signup.alerts.termsRequired'), t('screens.signup.errors.termsRequired'));
      return;
    }

    if (!familyName.trim() || !givenName.trim()) {
      await showAlert(t('screens.signup.alerts.inputError'), t('screens.signup.errors.nameRequired'));
      return;
    }

    if (!email.trim()) {
      await showAlert(t('screens.signup.alerts.inputError'), t('screens.signup.errors.emailRequired'));
      return;
    }

    if (!password.trim() || password.length < 6) {
      await showAlert(t('screens.signup.alerts.inputError'), t('screens.signup.errors.passwordRequired'));
      return;
    }

    if (!phoneNumber.trim()) {
      await showAlert(t('screens.signup.alerts.inputError'), t('screens.signup.errors.phoneRequired'));
      return;
    }

    if (isKoreaSelected && !selectedRegion) {
      await showAlert(t('screens.signup.alerts.inputError'), t('screens.signup.errors.regionRequired'));
      return;
    }

    setIsSubmitting(true);

    try {

      console.log('[회원가입] 1단계: 이메일 중복 확인 시작');
      const isEmailAvailable = await checkEmailAvailability(email.trim(), navigate);

      if (!isEmailAvailable) {
        await showAlert(t('screens.signup.alerts.emailDuplicate'), t('screens.signup.errors.emailDuplicate'));
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

          const buttonIndex = await showAlert(
            t('screens.signup.alerts.referralConfirm'),
            t('screens.signup.errors.referralInvalid'),
            [
              {
                text: t('screens.signup.alerts.cancel'),
                style: 'cancel',
                onPress: () => {
                  setIsSubmitting(false);
                },
              },
              {
                text: t('screens.signup.alerts.continue'),
                onPress: () => {

                },
              },
            ],
          );

          if (buttonIndex === 0) {
            return;
          }

        }
      } else {

        console.log('[회원가입] 2단계: 추천인 이메일이 비어있음 - 알림 표시');
        const buttonIndex = await showAlert(
          t('screens.signup.alerts.referralEmpty'),
          t('screens.signup.errors.referralEmpty'),
          [
            {
              text: t('screens.signup.alerts.inputReferral'),
              style: 'cancel',
              onPress: () => {
                setIsSubmitting(false);
              },
            },
            {
              text: t('screens.signup.alerts.confirm'),
              onPress: () => {

              },
            },
          ],
        );

        if (buttonIndex === 0) {
          return;
        }

      }

      console.log('[회원가입] 3단계: 회원가입 데이터 저장 및 이메일 인증 화면 이동');

      try {

        const pendingSignupData = {
          email: email.trim(),
          password: password,
          familyName: familyName.trim(),
          givenName: givenName.trim(),
          phoneNumber: phoneNumber.trim(),
          selectedCountryDialCode: {
            iso2: selectedCountryDialCode.iso2,
            dialCode: selectedCountryDialCode.dialCode,
            flagEmoji: selectedCountryDialCode.flagEmoji,
            name: selectedCountryDialCode.name,
          },
          selectedRegion: selectedRegion
            ? {
                iso2: selectedRegion.iso2,
                dialCode: selectedRegion.dialCode,
                flagEmoji: selectedRegion.flagEmoji,
                name: selectedRegion.name,
              }
            : null,
          referralMemberId: referralMemberId,
          gender: gender,
          ageRange: ageRange,
        };

        await AsyncStorage.setItem('pendingSignupData', JSON.stringify(pendingSignupData));
        console.log('[회원가입] AsyncStorage에 회원가입 데이터 저장 완료');

        setVerificationEmail(email.trim());
        setVerificationSuccessRoute(ROUTES.signup); 

        setIsSubmitting(false);
        navigate(ROUTES.emailVerification);
      } catch (storageError) {
        console.error('[회원가입] AsyncStorage 저장 실패:', storageError);
        await showAlert(
          t('screens.signup.alerts.error'),
          t('screens.signup.errors.error') || '데이터 저장에 실패했습니다. 다시 시도해주세요.',
        );
        setIsSubmitting(false);
        return;
      }
    } catch (error: any) {
      console.error('[회원가입] 전체 프로세스 실패:', error);

      try {
        await AsyncStorage.removeItem('pendingSignupData');
        console.log('[회원가입] 에러 발생으로 인한 AsyncStorage 정리 완료');
      } catch (storageError) {
        console.error('[회원가입] AsyncStorage 정리 실패:', storageError);
      }

      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        t('screens.signup.errors.error');
      await showAlert(t('screens.signup.alerts.error'), errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <Header
        title={t('screens.signup.title')}
        onBackPress={goBack}
        showBackButton
      />
      <SafeScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        autoAdjustKeyboardPadding={true}
      >
        <View style={styles.formFieldContainer}>
          <FormField
            label={t('screens.signup.familyNameLabel')}
            placeholder={t('screens.signup.familyNamePlaceholder')}
            value={familyName}
            onChangeText={setFamilyName}
            autoCapitalize="none"
            containerStyle={styles.fieldContainer}
          />

          <FormField
            label={t('screens.signup.givenNameLabel')}
            placeholder={t('screens.signup.givenNamePlaceholder')}
            value={givenName}
            onChangeText={setGivenName}
            autoCapitalize="none"
            containerStyle={styles.fieldContainer}
          />

          <FormField
            label={t('screens.signup.emailLabel')}
            placeholder={t('screens.signup.emailPlaceholder')}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            containerStyle={styles.fieldContainer}
          />

          <FormField
            label={t('screens.signup.passwordLabel')}
            placeholder={t('screens.signup.passwordPlaceholder')}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoCapitalize="none"
            containerStyle={styles.fieldContainer}
          />

          <FormField
            containerStyle={styles.fieldContainer}
            label={t('screens.signup.phoneNumberLabel')}
            placeholder={t('screens.signup.phoneNumberPlaceholder')}
            keyboardType="phone-pad"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
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

          <View style={styles.fieldContainer}>
            <TouchableOpacity
              onPress={() => {
                if (!isKoreaSelected) {
                  return;
                }
                setSelectMode('region');
                navigate('countryCodeSelect');
              }}
              disabled={!isKoreaSelected || isSubmitting}
            >
              <FormField
                label={t('screens.signup.regionLabel')}
                placeholder={t('screens.signup.regionPlaceholder')}
                value={regionDisplayValue}
                editable={false}
              />
            </TouchableOpacity>
            {!isKoreaSelected && (
              <Text style={styles.regionHelper}>
                {t('screens.signup.regionHelper') || 'Global 지역이 자동으로 적용됩니다.'}
              </Text>
            )}
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.label}>{t('screens.signup.genderLabel')}</Text>
            <View style={[styles.inlineOptions]}>
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

          <View style={styles.fieldContainer}>
            <Text style={styles.label}>{t('screens.signup.ageLabel')}</Text>
            <View style={[styles.inlineOptions]}>
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
        </View>
      </SafeScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...COMMON_STYLES.container,
  },
  scrollContent: {
    ...COMMON_STYLES.scrollContent,
  },
  formFieldContainer: {
    ...FORM_STYLES.fieldContainer,
  },
  fieldContainer: {
    borderWidth: 0,
  },
  label: {
    fontSize: FONTS.size.medium,
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
    fontSize: FONTS.size.large,
    marginRight: 6,
  },
  countryCode: {
    fontSize: FONTS.size.medium,
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
    fontSize: FONTS.size.small,
    lineHeight: 15,
    color: '#8e9bae',
    fontFamily: 'Roboto-Regular',
  },
  termsHighlight: {
    fontFamily: 'Roboto-SemiBold',
    color: '#8e9bae',
  },
  buttonWrapper: {
    ...COMMON_STYLES.bottomButtonContainer,
  },
  loadingContainer: {
    marginTop: 12,
    alignItems: 'center',
  },
  regionHelper: {
    fontSize: FONTS.size.small,
    lineHeight: 18,
    color: '#8e9bae',
    fontFamily: 'Roboto-Regular',
    marginTop: 4,
  },
});

