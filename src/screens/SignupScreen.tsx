import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Platform,
  Alert,
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

const FLAG_IMAGE = require('../../assets/flag-kr.png');

const GENDER_OPTIONS = [
  { value: 'male', label: '남' },
  { value: 'female', label: '여' },
] as const;

const AGE_OPTIONS = ['10', '20', '30', '40', '50+'] as const;

type GenderValue = (typeof GENDER_OPTIONS)[number]['value'];
type AgeValue = (typeof AGE_OPTIONS)[number];

export const SignupScreen = () => {
  const { goBack, navigate, reset } = useAppNavigation();
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

  const handleSubmit = () => {
    if (!termsAccepted) {
      Alert.alert('동의 필요', '약관에 동의해야 가입을 진행할 수 있습니다.');
      return;
    }

    console.log('회원가입 데이터', {
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

    reset('authLanding');
    navigate('login');
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
            <View style={styles.phonePrefix}>
              <Image source={FLAG_IMAGE} style={styles.flagIcon} />
              <Text style={styles.countryCode}>+82</Text>
            </View>
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
            title="가입하기"
            fullWidth
            onPress={handleSubmit}
          />
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


