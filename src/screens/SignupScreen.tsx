import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  Platform,
  Alert,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Header, PrimaryButton } from '../components';
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

  const renderInput = ({
    label,
    placeholder,
    value,
    onChangeText,
    keyboardType = 'default',
    secureTextEntry = false,
  }: {
    label: string;
    placeholder: string;
    value: string;
    onChangeText: (text: string) => void;
    keyboardType?: 'default' | 'email-address' | 'phone-pad';
    secureTextEntry?: boolean;
  }) => (
    <View style={styles.formGroup}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor="#dedede"
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        secureTextEntry={secureTextEntry}
        autoCapitalize="none"
      />
    </View>
  );

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
        {renderInput({
          label: '성',
          placeholder: 'Enter your First name',
          value: familyName,
          onChangeText: setFamilyName,
        })}

        {renderInput({
          label: '이름',
          placeholder: 'Enter your Last name',
          value: givenName,
          onChangeText: setGivenName,
        })}

        {renderInput({
          label: 'Email',
          placeholder: 'Enter your email address',
          value: email,
          onChangeText: setEmail,
          keyboardType: 'email-address',
        })}

        {renderInput({
          label: '비밀번호',
          placeholder: 'Password',
          value: password,
          onChangeText: setPassword,
          secureTextEntry: true,
        })}

        <View style={styles.formGroup}>
          <Text style={styles.label}>전화번호</Text>
          <View style={styles.phoneRow}>
            <View style={styles.countryBadge}>
              <Image source={FLAG_IMAGE} style={styles.flagIcon} />
              <Text style={styles.countryCode}>+82</Text>
            </View>
            <TextInput
              style={[styles.input, styles.phoneInput]}
              placeholder="휴대폰 번호를 입력해주세요."
              placeholderTextColor="#dedede"
              keyboardType="phone-pad"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
            />
          </View>
        </View>

        {renderInput({
          label: '지역',
          placeholder: 'Korea',
          value: region,
          onChangeText: setRegion,
        })}

        <View style={styles.formGroup}>
          <Text style={styles.label}>성별</Text>
          <View style={styles.inlineOptions}>
            {GENDER_OPTIONS.map((option) => {
              const isActive = gender === option.value;
              return (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.choiceButton,
                    isActive && styles.choiceButtonActive,
                  ]}
                  onPress={() => setGender(option.value)}
                  activeOpacity={0.8}
                >
                  <Text
                    style={[
                      styles.choiceLabel,
                      isActive && styles.choiceLabelActive,
                    ]}
                  >
                    {option.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>나이</Text>
          <View style={styles.inlineOptions}>
            {AGE_OPTIONS.map((option) => {
              const isActive = ageRange === option;
              return (
                <TouchableOpacity
                  key={option}
                  style={[
                    styles.choiceButton,
                    isActive && styles.choiceButtonActive,
                  ]}
                  onPress={() => setAgeRange(option)}
                  activeOpacity={0.8}
                >
                  <Text
                    style={[
                      styles.choiceLabel,
                      isActive && styles.choiceLabelActive,
                    ]}
                  >
                    {option}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {renderInput({
          label: '추천이메일',
          placeholder: 'oth-staff@example.invalid',
          value: referralEmail,
          onChangeText: setReferralEmail,
        })}

        <TouchableOpacity
          style={styles.termsRow}
          onPress={() => setTermsAccepted((prev) => !prev)}
          activeOpacity={0.8}
        >
          <View
            style={[
              styles.checkbox,
              termsAccepted && styles.checkboxSelected,
            ]}
          >
            {termsAccepted && <View style={styles.checkboxTick} />}
          </View>
          <Text style={styles.termsText}>
            XRUN 서비스 약관 및{' '}
            <Text style={styles.termsHighlight}>개인정보 보호정책</Text>에
            동의합니다.
          </Text>
        </TouchableOpacity>

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
  formGroup: {
    width: '100%',
    maxWidth: 327,
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
  input: {
    height: 52,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#dedede',
    backgroundColor: '#fefefe',
    paddingHorizontal: 16,
    fontSize: 14,
    color: '#2a2727',
    fontFamily: 'Roboto-Bold',
  },
  phoneRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  countryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#dedede',
    borderRadius: 10,
    backgroundColor: '#fefefe',
    paddingHorizontal: 12,
    height: 52,
    marginRight: 12,
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
  phoneInput: {
    flex: 1,
  },
  inlineOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  choiceButton: {
    height: 40,
    minWidth: 56,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e3e9ed',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    marginBottom: 12,
  },
  choiceButtonActive: {
    backgroundColor: COLORS.buttonPrimary,
    borderColor: COLORS.buttonPrimary,
  },
  choiceLabel: {
    fontSize: 13,
    fontFamily: 'Roboto-Bold',
    color: '#2a2727',
  },
  choiceLabelActive: {
    color: '#ffffff',
  },
  termsRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    width: '100%',
    maxWidth: 327,
    alignSelf: 'center',
    marginBottom: 24,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e3e9ed',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  checkboxSelected: {
    backgroundColor: COLORS.buttonPrimary,
    borderColor: COLORS.buttonPrimary,
  },
  checkboxTick: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#ffffff',
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
    maxWidth: 327,
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


