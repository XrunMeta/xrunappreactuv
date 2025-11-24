import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Header, FormField, PrimaryButton, OptionButton } from '../components';
import { COLORS, COMMON_STYLES } from '../constants';
import { useAppNavigation, ROUTES } from '../navigation';
import { useAppContext } from '../context';
import { getMyPageUserInfo, updateName } from '../services';

const GENDER_OPTIONS = [
  { value: 'male', label: '남' },
  { value: 'female', label: '여' },
] as const;

const AGE_OPTIONS = ['10', '20', '30', '40', '50+'] as const;

export const MyInfoEditScreen = () => {
  const { reset, canGoBack, goBack, navigate } = useAppNavigation();
  const { selectedCountryDialCode } = useAppContext();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('010 2487 6746');
  const [region, setRegion] = useState('대한민국 서울');
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [age, setAge] = useState<(typeof AGE_OPTIONS)[number]>('10');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [memberId, setMemberId] = useState<number | null>(null);

  useEffect(() => {
    const loadUserInfo = async () => {
      try {
        const userDataStr = await AsyncStorage.getItem('userData');
        if (userDataStr) {
          const userData = JSON.parse(userDataStr);
          const member = userData.member;

          if (member) {
            setMemberId(member);
            const response = await getMyPageUserInfo(member, navigate);
            const user = response.data[0];

            if (user) {
              setFirstName(user.firstname || '');
              setLastName(user.lastname || '');
              setEmail(user.email || '');

            }
          }
        }
      } catch (error) {
        console.error('[정보수정] 사용자 정보 로드 실패:', error);
        Alert.alert('오류', '사용자 정보를 불러오는데 실패했습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    loadUserInfo();
  }, [navigate]);

  const handleSave = async () => {

    if (!firstName.trim()) {
      Alert.alert('오류', '이름을 입력해주세요.');
      return;
    }

    if (!memberId) {
      Alert.alert('오류', '사용자 정보를 불러올 수 없습니다.');
      return;
    }

    setIsSaving(true);

    try {
      console.log('[정보수정] 이름 수정 시도:', { memberId, firstname: firstName });

      await updateName(memberId, firstName.trim(), navigate);

      Alert.alert('저장 완료', '변경 사항이 저장되었습니다.', [
        {
          text: '확인',
          onPress: () => {

            if (canGoBack) {
              goBack();
            } else {
              reset(ROUTES.myInfo);
            }
          },
        },
      ]);
    } catch (error) {
      console.error('[정보수정] 이름 수정 실패:', error);
      Alert.alert('저장 실패', '이름 수정 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleChangePassword = () => {
    Alert.alert('비밀번호 변경', '비밀번호 변경 프로세스는 추후 연동됩니다.');
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <Header
        title="Edit My Info"
        onBackPress={canGoBack ? goBack : () => reset(ROUTES.myInfo)}
        showBackButton
      />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={COLORS.buttonPrimary} />
          </View>
        ) : (
          <View style={styles.formWrapper}>
            <FormField
              label="First Name"
              value={firstName}
              onChangeText={setFirstName}
              placeholder="Enter first name"
              editable={!isSaving}
            />
            <FormField
              label="Last Name"
              value={lastName}
              onChangeText={setLastName}
              placeholder="Enter last name"
              editable={!isSaving}
            />
            <FormField
              label="Email"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              placeholder="Enter email address"
              editable={!isSaving}
            />

          <View style={styles.inlineLabelRow}>
            <Text style={styles.sectionLabel}>Password</Text>
            <TouchableOpacity onPress={handleChangePassword}>
              <Text style={styles.linkText}>Change Password</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.readonlyInput}>
            <Text style={styles.readonlyText}>최종변경날짜  : 2025.05.02</Text>
          </View>

            <FormField
              label="Phone Number"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              placeholder="Enter phone number"
              editable={!isSaving}
              leftAccessory={
                <TouchableOpacity
                  style={styles.phonePrefix}
                  onPress={() => navigate('countryCodeSelect')}
                  activeOpacity={0.7}
                  disabled={isSaving}
                >
                  <Text style={styles.flagEmoji}>{selectedCountryDialCode.flagEmoji}</Text>
                  <Text style={styles.phonePrefixText}>{selectedCountryDialCode.dialCode}</Text>
                </TouchableOpacity>
              }
            />

            <FormField
              label="Region"
              value={region}
              onChangeText={setRegion}
              placeholder="지역을 입력하세요"
              editable={!isSaving}
            />

            <View style={styles.formGroup}>
              <Text style={styles.sectionLabel}>성별</Text>
              <View style={styles.inlineOptions}>
                {GENDER_OPTIONS.map((option) => (
                  <OptionButton
                    key={option.value}
                    label={option.label}
                    selected={gender === option.value}
                    onPress={() => setGender(option.value)}
                    disabled={isSaving}
                  />
                ))}
              </View>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.sectionLabel}>나이</Text>
              <View style={[styles.inlineOptions, styles.ageOptionsRow]}>
                {AGE_OPTIONS.map((option, index) => {
                  const isLast = index === AGE_OPTIONS.length - 1;
                  return (
                    <OptionButton
                      key={option}
                      label={option}
                      selected={age === option}
                      onPress={() => setAge(option)}
                      flex={1}
                      disabled={isSaving}
                      style={[
                        styles.ageOptionButton,
                        !isLast && styles.ageOptionSpacing,
                      ]}
                    />
                  );
                })}
              </View>
            </View>
          </View>
        )}

        <View style={styles.bottomSection}>
          {isSaving ? (
            <View style={styles.loadingButtonContainer}>
              <ActivityIndicator size="small" color={COLORS.buttonPrimary} />
            </View>
          ) : (
            <PrimaryButton
              title="Save Changes"
              fullWidth
              onPress={handleSave}
              style={styles.primaryButton}
              disabled={isLoading}
            />
          )}
        </View>
      </ScrollView>
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
    paddingBottom: 40,
  },
  formWrapper: {
    width: '100%',
    maxWidth: 780,
    alignSelf: 'center',
  },
  inlineLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  sectionLabel: {
    fontSize: 16,
    color: '#2a2727',
    fontFamily: 'Roboto-Medium',
  },
  linkText: {
    fontSize: 12,
    color: '#707070',
    fontFamily: 'Roboto-SemiBold',
  },
  readonlyInput: {
    borderWidth: 1,
    borderColor: '#dedede',
    borderRadius: 10,
    backgroundColor: '#fefefe',
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginBottom: 24,
  },
  readonlyText: {
    fontSize: 13,
    color: '#1a2e35',
    fontFamily: 'Roboto-Bold',
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
  phonePrefixText: {
    fontSize: 16,
    fontFamily: 'Roboto-Medium',
    color: '#1a2e35',
  },
  formGroup: {
    marginTop: 24,
  },
  inlineOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
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
  bottomSection: {
    ...COMMON_STYLES.bottomSection,
  },
  primaryButton: {
    width: '100%',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 200,
  },
  loadingButtonContainer: {
    height: 56,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

