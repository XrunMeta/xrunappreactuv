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
import {
  checkEmailAvailability,
  checkReferralEmail,
  signup,
  checkLogin,
  SignupHelpers,
} from '../services';

const GENDER_OPTIONS = [
  { value: 'male', label: '남' },
  { value: 'female', label: '여' },
] as const;

const AGE_OPTIONS = ['10', '20', '30', '40', '50+'] as const;

type GenderValue = (typeof GENDER_OPTIONS)[number]['value'];
type AgeValue = (typeof AGE_OPTIONS)[number];

export const SignupScreen = () => {
  const { goBack, navigate, reset } = useAppNavigation();
  const { selectedCountryDialCode } = useAppContext();
  const [familyName, setFamilyName] = useState('');
  const [givenName, setGivenName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [region, setRegion] = useState('');
  const [referralEmail, setReferralEmail] = useState('');
  const [gender, setGender] = useState<GenderValue>('male');
  const [ageRange, setAgeRange] = useState<AgeValue>('10');
  const [termsAccepted, setTermsAccepted] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {

    if (!termsAccepted) {
      Alert.alert('동의 필요', '약관에 동의해야 가입을 진행할 수 있습니다.');
      return;
    }

    if (!familyName.trim() || !givenName.trim()) {
      Alert.alert('입력 오류', '성과 이름을 입력해주세요.');
      return;
    }

    if (!email.trim()) {
      Alert.alert('입력 오류', '이메일을 입력해주세요.');
      return;
    }

    if (!password.trim() || password.length < 6) {
      Alert.alert('입력 오류', '비밀번호는 6자 이상 입력해주세요.');
      return;
    }

    if (!phoneNumber.trim()) {
      Alert.alert('입력 오류', '전화번호를 입력해주세요.');
      return;
    }

    if (!region.trim()) {
      Alert.alert('입력 오류', '지역을 입력해주세요.');
      return;
    }

    setIsSubmitting(true);

    try {

      console.log('[회원가입] 1단계: 이메일 중복 확인 시작');
      const isEmailAvailable = await checkEmailAvailability(email.trim(), navigate);

      if (!isEmailAvailable) {
        Alert.alert('이메일 중복', '이미 사용 중인 이메일입니다.');
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
          Alert.alert(
            '추천인 확인',
            '유효하지 않은 추천인 이메일입니다. 계속 진행하시겠습니까?',
            [
              { text: '취소', style: 'cancel', onPress: () => setIsSubmitting(false) },
              { text: '계속', onPress: () => {} },
            ],
          );

        }
      }

      console.log('[회원가입] 3단계: 회원가입 실행 시작');
      const mobileCode = parseInt(selectedCountryDialCode.dialCode.replace('+', ''), 10) || 82;
      const countryCode = selectedCountryDialCode.iso2 || 'KR';
      const regionId = parseInt(region) || 2; 

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
        Alert.alert('회원가입 실패', '회원가입에 실패했습니다. 다시 시도해주세요.');
        setIsSubmitting(false);
        return;
      }

      console.log('[회원가입] 4단계: 로그인 확인 시작');
      const loginSuccess = await checkLogin(email.trim(), password, navigate);

      if (!loginSuccess) {
        Alert.alert(
          '로그인 확인 실패',
          '회원가입은 완료되었지만 로그인 확인에 실패했습니다. 로그인 화면에서 다시 시도해주세요.',
        );
        reset('authLanding');
        navigate('login');
        setIsSubmitting(false);
        return;
      }

      Alert.alert('회원가입 완료', '회원가입이 완료되었습니다.', [
        {
          text: '확인',
          onPress: () => {
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
        '회원가입 중 오류가 발생했습니다.';
      Alert.alert('오류', errorMessage);
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

        <FormField
          label="지역"
          placeholder="Korea"
          value={region}
          onChangeText={setRegion}
          autoCapitalize="none"
          containerStyle={styles.fieldContainer}
        />

        <View style={styles.formGroup}>
          <Text style={styles.label}>성별</Text>
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
          <Text style={styles.label}>나이</Text>
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
          label="추천이메일"
          placeholder="oth-staff@example.invalid"
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
            XRUN 서비스 약관 및{' '}
            <Text style={styles.termsHighlight}>개인정보 보호정책</Text>에
            동의합니다.
          </Text>
        </View>

        <View style={styles.buttonWrapper}>
          <PrimaryButton
            title={isSubmitting ? '처리 중...' : '가입하기'}
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

