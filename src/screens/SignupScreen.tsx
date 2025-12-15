import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Platform,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  FormCheckbox,
  FormField,
  SafeScrollView,
  Header,
  OptionButton,
  PrimaryButton,
  Dialog,
} from '../components';
import { COLORS, SIZES, FONTS } from '../constants';
import { useAppNavigation, ROUTES } from '../navigation';
import { useAppContext } from '../context';
import { useAlertDialog } from '../context/AlertDialogContext';
import { getRegionIdByIso2, getRegionNameById, getRegionsByCountryIso2, GLOBAL_REGION, COMMON_STYLES, FORM_STYLES } from '../constants';
import { ClauseId } from '../types';
import { filterAsciiPrintable } from '../utils';

import {
  checkEmailAvailability,
  checkReferralEmail,
  signup,
  checkLogin,
  SignupHelpers,
  getClauseContent,
} from '../services';

const AGE_OPTIONS = ['10', '20', '30', '40', '50+'] as const;

type GenderValue = 'male' | 'female';
type AgeValue = (typeof AGE_OPTIONS)[number];

export const SignupScreen = () => {
  const { t, i18n } = useTranslation();
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
  const [fullName, setFullName] = useState(
    signupFormData.familyName || signupFormData.givenName
      ? `${signupFormData.familyName || ''} ${signupFormData.givenName || ''}`.trim()
      : ''
  );
  const [email, setEmail] = useState(signupFormData.email);
  const [password, setPassword] = useState(signupFormData.password);
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isPasswordConfirmVisible, setIsPasswordConfirmVisible] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState(signupFormData.phoneNumber);
  const [referralEmail, setReferralEmail] = useState(signupFormData.referralEmail);
  const [gender, setGender] = useState<GenderValue>(signupFormData.gender);
  const [ageRange, setAgeRange] = useState<AgeValue>(signupFormData.ageRange);
  const [serviceTermsAccepted, setServiceTermsAccepted] = useState(false);
  const [locationTermsAccepted, setLocationTermsAccepted] = useState(false);
  const [privacyTermsAccepted, setPrivacyTermsAccepted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleSignupMode, setIsGoogleSignupMode] = useState(false);

  const allTermsAccepted = serviceTermsAccepted && locationTermsAccepted && privacyTermsAccepted;

  const [clauseDialogVisible, setClauseDialogVisible] = useState(false);
  const [selectedClauseIdForDialog, setSelectedClauseIdForDialog] = useState<ClauseId>('service');
  const [clauseContent, setClauseContent] = useState<string>('');
  const [isClauseLoading, setIsClauseLoading] = useState(false);
  const [clauseError, setClauseError] = useState<string | null>(null);

  const handleAgreeClause = (clauseId: ClauseId) => {
    if (clauseId === 'service') {
      setServiceTermsAccepted(true);
    } else if (clauseId === 'location') {
      setLocationTermsAccepted(true);
    } else if (clauseId === 'personal') {
      setPrivacyTermsAccepted(true);
    }
    setClauseDialogVisible(false);
  };

  const openClauseDialog = async (clauseId: ClauseId) => {
    setSelectedClauseIdForDialog(clauseId);
    setClauseDialogVisible(true);
    setIsClauseLoading(true);
    setClauseError(null);
    setClauseContent('');

    try {

      let currentLanguage = i18n.language || 'ko';
      if (currentLanguage === 'zh' || currentLanguage === 'zhCN' || currentLanguage === 'zh-CN') {
        currentLanguage = 'zh-CN';
      }

      const clauseType = clauseId as 'service' | 'location' | 'personal';
      const clauseText = await getClauseContent(clauseType, currentLanguage, navigate);

      if (clauseText) {
        setClauseContent(clauseText);
      } else {
        setClauseError(t('screens.myInfoClauses.loadFailed'));
      }
    } catch (err) {
      console.error('[회원가입] 약관 내용 로드 오류:', err);
      setClauseError(t('screens.myInfoClauses.loadError'));
    } finally {
      setIsClauseLoading(false);
    }
  };

  const closeClauseDialog = () => {
    setClauseDialogVisible(false);
  };

  const isKoreaSelected = selectedCountryDialCode?.iso2?.toLowerCase() === 'kr';

  const regionDisplayValue = selectedRegion
    ? selectedRegion.name
    : isKoreaSelected
      ? ''
      : GLOBAL_REGION.name;

  const isMountedRef = React.useRef(false);

  React.useEffect(() => {
    const checkGoogleSignupMode = async () => {
      try {
        const googleSignupRequired = await AsyncStorage.getItem('googleSignupRequired');
        if (googleSignupRequired === 'true') {
          setIsGoogleSignupMode(true);
          const googleEmail = await AsyncStorage.getItem('googleSignupEmail');
          if (googleEmail) {
            setEmail(googleEmail);
            console.log('[회원가입] 구글 회원가입 모드, 이메일 자동 입력:', googleEmail);
          }
        }
      } catch (error) {
        console.error('[회원가입] 구글 회원가입 모드 확인 실패:', error);
      }
    };

    checkGoogleSignupMode();
  }, []);

  React.useEffect(() => {
    const loadReferralEmailFromStorage = async () => {
      try {
        const processedReferrer = await AsyncStorage.getItem('processed_install_referrer');
        if (processedReferrer) {

          const params = new URLSearchParams(processedReferrer);
          const utmSource = params.get('utm_source');
          const utmContent = params.get('utm_content');

          if (utmSource === 'referral' && utmContent) {
            const extractedEmail = decodeURIComponent(utmContent);

            if (!signupFormData.referralEmail || signupFormData.referralEmail === '') {
              setReferralEmail(extractedEmail);
              console.log('[회원가입] processed_install_referrer에서 추천인 이메일 로드:', extractedEmail);
            }
          }
        }
      } catch (error) {
        console.error('[회원가입] processed_install_referrer 로드 실패:', error);
      }
    };

    loadReferralEmailFromStorage();
  }, [signupFormData.referralEmail]);

  React.useEffect(() => {
    if (!isMountedRef.current) {

      if (!isGoogleSignupMode) {
        setEmail(signupFormData.email);
      }
      setFamilyName(signupFormData.familyName);
      setGivenName(signupFormData.givenName);

      const combinedName = `${signupFormData.familyName || ''} ${signupFormData.givenName || ''}`.trim();
      setFullName(combinedName);
      setPassword(signupFormData.password);
      setPasswordConfirm('');
      setIsPasswordVisible(false);
      setIsPasswordConfirmVisible(false);
      setPhoneNumber(signupFormData.phoneNumber);
      setReferralEmail(signupFormData.referralEmail);
      setGender(signupFormData.gender);
      setAgeRange(signupFormData.ageRange);

      setServiceTermsAccepted(false);
      setLocationTermsAccepted(false);
      setPrivacyTermsAccepted(false);
      isMountedRef.current = true;
    }
  }, [signupFormData, isGoogleSignupMode]);

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
      termsAccepted: allTermsAccepted,
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
    allTermsAccepted,

  ]);

  const handleSubmit = async () => {

    const nameParts = fullName.trim().split(/\s+/);
    let parsedGivenName = '';
    let parsedFamilyName = '';

    if (nameParts.length === 0) {
      await showAlert(t('screens.signup.alerts.inputError'), t('screens.signup.errors.nameRequired'));
      return;
    } else if (nameParts.length === 1) {

      parsedGivenName = nameParts[0];
      parsedFamilyName = '';
    } else {

      parsedFamilyName = nameParts[0];
      parsedGivenName = nameParts.slice(1).join(' ');
    }

    if (!parsedGivenName.trim()) {
      await showAlert(t('screens.signup.alerts.inputError'), t('screens.signup.errors.nameRequired'));
      return;
    }

    if (!email.trim()) {
      await showAlert(t('screens.signup.alerts.inputError'), t('screens.signup.errors.emailRequired'));
      return;
    }

    if (!password.trim()) {
      await showAlert(t('screens.signup.alerts.inputError'), t('screens.signup.errors.passwordRequired'));
      return;
    }

    const hasMinLength = password.length >= 7;
    const hasNumber = /\d/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasUppercase = /[A-Z]/.test(password);

    if (!(hasMinLength && hasNumber && hasLowercase && hasUppercase)) {
      await showAlert(t('screens.signup.alerts.inputError'), t('screens.signup.errors.passwordPolicy'));
      return;
    }

    if (!passwordConfirm.trim()) {
      await showAlert(
        t('screens.signup.alerts.inputError'),
        t('screens.signup.errors.passwordConfirmRequired'),
      );
      return;
    }

    if (password !== passwordConfirm) {
      await showAlert(t('screens.signup.alerts.inputError'), t('screens.signup.errors.passwordMismatch'));
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

    if (!allTermsAccepted) {
      await showAlert(t('screens.signup.alerts.termsRequired'), t('screens.signup.errors.termsRequired'));
      return;
    }

    setIsSubmitting(true);

    try {

      if (!isGoogleSignupMode) {
        console.log('[회원가입] 1단계: 이메일 중복 확인 시작');
        const isEmailAvailable = await checkEmailAvailability(email.trim(), navigate);

        if (!isEmailAvailable) {
          await showAlert(t('screens.signup.alerts.emailDuplicate'), t('screens.signup.errors.emailDuplicate'));
          setIsSubmitting(false);
          return;
        }
      } else {
        console.log('[회원가입] 구글 회원가입 모드 - 이메일 중복 확인 스킵');
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
          familyName: parsedFamilyName.trim(),
          givenName: parsedGivenName.trim(),
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

  const clauseTitleMap: Record<ClauseId, string> = {
    service: t('screens.myInfoClauses.serviceClause'),
    location: t('screens.myInfoClauses.locationClause'),
    personal: t('screens.myInfoClauses.personalClause'),
  };

  const dialogBodyMaxHeight = Math.min(520, Math.round(Dimensions.get('window').height * 0.55));

  const handleBackPress = () => {

    console.log('[회원가입] 뒤로가기 (구글 회원가입 모드:', isGoogleSignupMode, ')');

    if (isGoogleSignupMode) {

      navigate(ROUTES.login);
    } else {

      goBack();
    }
  };

  return (
    <View style={styles.container}>
      <Header
        title={isGoogleSignupMode ? '구글 회원가입' : t('screens.signup.title')}
        onBackPress={handleBackPress}
        showBackButton={true}
      />
      <Dialog
        visible={clauseDialogVisible}
        title={clauseTitleMap[selectedClauseIdForDialog]}
        onClose={closeClauseDialog}
        actions={[
          {
            label: t('screens.signup.agreeButton'),
            onPress: () => handleAgreeClause(selectedClauseIdForDialog),
            variant: 'primary',
          },
          {
            label: t('common.buttons.close'),
            onPress: closeClauseDialog,
            variant: 'secondary',
          },
        ]}
        containerStyle={styles.clauseDialogContainer}
      >
        <View style={{ maxHeight: dialogBodyMaxHeight }}>
          {isClauseLoading ? (
            <View style={styles.clauseLoadingContainer}>
              <ActivityIndicator size="small" color={COLORS.buttonPrimary} />
              <Text style={styles.clauseLoadingText}>{t('screens.myInfoClauses.loading')}</Text>
            </View>
          ) : clauseError ? (
            <Text style={styles.clauseErrorText}>{clauseError}</Text>
          ) : (
            <ScrollView showsVerticalScrollIndicator={true}>
              <Text style={styles.clauseContentText}>{clauseContent}</Text>
            </ScrollView>
          )}
        </View>
      </Dialog>

      <SafeScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        autoAdjustKeyboardPadding={true}
      >
        <View style={styles.formFieldContainer}>
          <FormField
            label={t('screens.signup.givenNameLabel')}
            placeholder={t('screens.signup.givenNamePlaceholder')}
            value={fullName}
            onChangeText={(text) => {
              setFullName(text);

              const nameParts = text.trim().split(/\s+/);
              if (nameParts.length === 0) {
                setFamilyName('');
                setGivenName('');
              } else if (nameParts.length === 1) {
                setFamilyName('');
                setGivenName(nameParts[0]);
              } else {
                setFamilyName(nameParts[0]);
                setGivenName(nameParts.slice(1).join(' '));
              }
            }}
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
            editable={!isGoogleSignupMode}
          />

          <FormField
            label={t('screens.signup.passwordLabel')}
            placeholder={t('screens.signup.passwordPlaceholder')}
            value={password}
            onChangeText={(text) => setPassword(filterAsciiPrintable(text))}
            secureTextEntry={!isPasswordVisible}
            autoCapitalize="none"
            containerStyle={styles.fieldContainer}
            rightAccessory={
              <TouchableOpacity
                style={styles.eyeButton}
                onPress={() => setIsPasswordVisible((prev) => !prev)}
                activeOpacity={0.7}
                disabled={isSubmitting}
              >
                <Ionicons
                  name={isPasswordVisible ? 'eye-outline' : 'eye-off-outline'}
                  size={20}
                  color="#666666"
                />
              </TouchableOpacity>
            }
          />

          <FormField
            label={t('screens.signup.passwordConfirmLabel')}
            placeholder={t('screens.signup.passwordConfirmPlaceholder')}
            value={passwordConfirm}
            onChangeText={(text) => setPasswordConfirm(filterAsciiPrintable(text))}
            secureTextEntry={!isPasswordConfirmVisible}
            autoCapitalize="none"
            containerStyle={styles.fieldContainer}
            rightAccessory={
              <TouchableOpacity
                style={styles.eyeButton}
                onPress={() => setIsPasswordConfirmVisible((prev) => !prev)}
                activeOpacity={0.7}
                disabled={isSubmitting}
              >
                <Ionicons
                  name={isPasswordConfirmVisible ? 'eye-outline' : 'eye-off-outline'}
                  size={20}
                  color="#666666"
                />
              </TouchableOpacity>
            }

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
                onPress={() => {
                  setSelectMode('country');
                  navigate('countryCodeSelect');
                }}
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
                showDisabledStyle={false}
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

          {}
          <View style={styles.termsRow}>
            <FormCheckbox
              checked={serviceTermsAccepted}
              onToggle={() => setServiceTermsAccepted((prev) => !prev)}
              variant="square"
            />
            <Text style={styles.termsText}>
              <Text style={styles.termsHighlight} onPress={() => openClauseDialog('service')}>
                {t('screens.signup.terms.service')}
              </Text>{' '}
              {t('screens.signup.termsAgree')}
            </Text>
          </View>

          {}
          <View style={styles.termsRow}>
            <FormCheckbox
              checked={locationTermsAccepted}
              onToggle={() => setLocationTermsAccepted((prev) => !prev)}
              variant="square"
            />
            <Text style={styles.termsText}>
              <Text style={styles.termsHighlight} onPress={() => openClauseDialog('location')}>
                {t('screens.signup.terms.location')}
              </Text>{' '}
              {t('screens.signup.termsAgree')}
            </Text>
          </View>

          {}
          <View style={styles.termsRow}>
            <FormCheckbox
              checked={privacyTermsAccepted}
              onToggle={() => setPrivacyTermsAccepted((prev) => !prev)}
              variant="square"
            />
            <Text style={styles.termsText}>
              <Text style={styles.termsHighlight} onPress={() => openClauseDialog('personal')}>
                {t('screens.signup.terms.privacy')}
              </Text>{' '}
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
    ...FORM_STYLES.label,
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
    fontSize: FONTS.size.msmall,
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
  clauseDialogContainer: {
    maxWidth: 420,
  },
  clauseLoadingContainer: {
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  clauseLoadingText: {
    fontSize: FONTS.size.small,
    lineHeight: 18,
    color: '#8e9bae',
    fontFamily: 'Roboto-Regular',
    textAlign: 'center',
  },
  clauseErrorText: {
    fontSize: FONTS.size.small,
    lineHeight: 18,
    color: '#ff6b6b',
    fontFamily: 'Roboto-Regular',
  },
  clauseContentText: {
    fontSize: FONTS.size.small,
    lineHeight: 20,
    color: '#333333',
    fontFamily: 'Roboto-Regular',
  },

});

