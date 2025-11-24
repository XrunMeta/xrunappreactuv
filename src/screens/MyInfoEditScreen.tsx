import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Header, FormField, PrimaryButton, OptionButton, Dialog } from '../components';
import { COLORS, COMMON_STYLES } from '../constants';
import { useAppNavigation, ROUTES } from '../navigation';
import { useAppContext } from '../context';
import {
  getMyPageUserInfo,
  updateName,
  updateLastName,
  updatePhone,
  updateGender,
  updateAge,
  getCountries,
  getRegionsByCountry,
  updateRegion,
  sendEmailVerificationCode,
} from '../services';

const GENDER_OPTIONS = [
  { value: 'male', label: '남' },
  { value: 'female', label: '여' },
] as const;

const AGE_OPTIONS = ['10', '20', '30', '40', '50+'] as const;

const convertGenderToApi = (gender: 'male' | 'female'): number => {
  return gender === 'male' ? 2110 : 2111;
};

const convertGenderFromApi = (gender?: number): 'male' | 'female' => {
  return gender === 2111 ? 'female' : 'male';
};

const convertAgeToApi = (age: string): number => {
  const ageMap: Record<string, number> = {
    '10': 2210,
    '20': 2220,
    '30': 2230,
    '40': 2240,
    '50+': 2250,
  };
  return ageMap[age] || 2210;
};

const convertAgeFromApi = (age?: number): (typeof AGE_OPTIONS)[number] => {
  const ageMap: Record<number, (typeof AGE_OPTIONS)[number]> = {
    2210: '10',
    2220: '20',
    2230: '30',
    2240: '40',
    2250: '50+',
  };
  return ageMap[age || 2210] || '10';
};

export const MyInfoEditScreen = () => {
  const { reset, canGoBack, goBack, navigate } = useAppNavigation();
  const { selectedCountryDialCode, setVerificationEmail, setVerificationSuccessRoute } = useAppContext();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('010 2487 6746');
  const [region, setRegion] = useState('대한민국 서울');
  const [regionCode, setRegionCode] = useState<number | null>(null);
  const [countryCode, setCountryCode] = useState<number | null>(null);
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [age, setAge] = useState<(typeof AGE_OPTIONS)[number]>('10');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [memberId, setMemberId] = useState<number | null>(null);
  const [countries, setCountries] = useState<Array<{ country?: string; callnumber?: number; cCode?: number; cName?: string }>>([]);
  const [regions, setRegions] = useState<Array<{ description?: string; subcode?: number; rCode?: number; rName?: string }>>([]);
  const [selectedCountry, setSelectedCountry] = useState<number | null>(null);
  const [selectedRegion, setSelectedRegion] = useState<number | null>(null);
  const [isLoadingRegions, setIsLoadingRegions] = useState(false);

  const [tempCountry, setTempCountry] = useState<{ cDesc: string; cCode: number | null }>({ cDesc: '', cCode: null });
  const [tempRegion, setTempRegion] = useState<{ rDesc: string; rCode: number | null }>({ rDesc: '', rCode: null });
  const [showCountryDialog, setShowCountryDialog] = useState(false);
  const [showRegionDialog, setShowRegionDialog] = useState(false);

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

              if (user.mobile) {
                setPhone(user.mobile.replace(/\s/g, ''));
              }

              setGender(convertGenderFromApi(user.gender));

              setAge(convertAgeFromApi(user.ages));

              if (user.country) {
                setCountryCode(user.country);
                setSelectedCountry(user.country);

                try {
                  const countriesResponse = await getCountries(navigate);
                  const countriesList = countriesResponse.data || [];
                  setCountries(countriesList);

                  const countryItem = countriesList.find((c) => (c.cCode === user.country || c.callnumber === user.country));
                  const countryName = countryItem?.country || countryItem?.cName || '';
                  const countryCode = countryItem?.callnumber || countryItem?.cCode || user.country;

                  setTempCountry({ cDesc: countryName, cCode: countryCode });

                  if (user.region) {
                    setRegionCode(user.region);
                    setSelectedRegion(user.region);

                    const regionsResponse = await getRegionsByCountry(user.country, navigate);
                    const regionsList = regionsResponse.data || [];
                    setRegions(regionsList);

                    const regionItem = regionsList.find((r) => (r.subcode === user.region || r.rCode === user.region));
                    const regionName = regionItem?.description || regionItem?.rName || '';
                    const regionCode = regionItem?.subcode || regionItem?.rCode || user.region;

                    setTempRegion({ rDesc: regionName, rCode: regionCode });

                    if (regionName) {
                      setRegion(`${countryName} ${regionName}`);
                    }
                  } else {

                    setTempRegion({ rDesc: 'Please Select', rCode: 0 });
                  }
                } catch (error) {
                  console.error('[정보수정] 국가/지역 정보 로드 실패:', error);
                }
              } else if (user.region) {
                setRegionCode(user.region);
              } else {

                setTempCountry({ cDesc: '', cCode: null });
                setTempRegion({ rDesc: 'Please Select', rCode: 0 });
              }
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

    if (!lastName.trim()) {
      Alert.alert('오류', '성을 입력해주세요.');
      return;
    }

    if (!memberId) {
      Alert.alert('오류', '사용자 정보를 불러올 수 없습니다.');
      return;
    }

    setIsSaving(true);

    try {
      console.log('[정보수정] 정보 수정 시도:', {
        memberId,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        phone: phone.replace(/\s/g, ''),
        gender: convertGenderToApi(gender),
        age: convertAgeToApi(age),
      });

      const promises = [];

      if (firstName.trim()) {
        promises.push(updateName(memberId, firstName.trim(), navigate));
      }

      if (lastName.trim()) {
        promises.push(updateLastName(memberId, lastName.trim(), navigate));
      }

      if (tempCountry.cCode !== null && tempCountry.cCode !== undefined && 
          tempRegion.rCode !== null && tempRegion.rCode !== undefined && tempRegion.rCode !== 0) {
        console.log('[정보수정] 지역 수정 시도:', {
          memberId,
          country: tempCountry.cCode,
          region: tempRegion.rCode,
        });
        promises.push(updateRegion(memberId, tempCountry.cCode, tempRegion.rCode, navigate));
      } else if (tempCountry.cCode === null || tempCountry.cCode === undefined) {

        console.warn('[정보수정] 국가가 선택되지 않아 지역 수정을 건너뜁니다.');
      } else if (tempRegion.rCode === null || tempRegion.rCode === undefined || tempRegion.rCode === 0) {

        console.warn('[정보수정] 지역이 선택되지 않아 지역 수정을 건너뜁니다.');
      }

      const genderCode = convertGenderToApi(gender);
      if (genderCode !== undefined && genderCode !== null) {
        promises.push(updateGender(memberId, genderCode, navigate));
      } else {
        console.warn('[정보수정] 성별 값이 유효하지 않습니다:', gender);
      }

      const ageCode = convertAgeToApi(age);
      if (ageCode !== undefined && ageCode !== null) {
        promises.push(updateAge(memberId, ageCode, navigate));
      } else {
        console.warn('[정보수정] 나이 값이 유효하지 않습니다:', age);
      }

      await Promise.all(promises);

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
      console.error('[정보수정] 정보 수정 실패:', error);
      Alert.alert('저장 실패', '정보 수정 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleChangePassword = () => {
    Alert.alert('비밀번호 변경', '비밀번호 변경 프로세스는 추후 연동됩니다.');
  };

  const handlePhoneEdit = async () => {
    if (!email) {
      Alert.alert('오류', '이메일 정보가 없습니다.');
      return;
    }

    try {

      const waitForResponse = async () => {
        try {
          return await sendEmailVerificationCode(email, navigate);
        } catch (error) {
          console.error('[정보수정] 이메일 인증 코드 발송 오류:', error);
          return false;
        }
      };

      const result = await Promise.race([
        waitForResponse(),
        new Promise<boolean>((resolve) => setTimeout(() => resolve(false), 5000)),
      ]);

      if (result) {

        setVerificationEmail(email);
        setVerificationSuccessRoute(ROUTES.myInfoPhoneEdit); 
        navigate(ROUTES.verificationCode);
      } else {
        Alert.alert('오류', '이메일 인증 코드 발송에 실패했습니다. 다시 시도해주세요.', [
          {
            text: '확인',
            onPress: () => {

            },
          },
        ]);
      }
    } catch (error) {
      console.error('[정보수정] 전화번호 수정 인증 오류:', error);
      Alert.alert('오류', '인증 과정에서 오류가 발생했습니다. 다시 시도해주세요.');
    }
  };

  const handleCountryDialogOpen = async () => {
    try {

      if (countries.length === 0) {
        const countriesResponse = await getCountries(navigate);
        const countriesList = countriesResponse.data || [];
        setCountries(countriesList);
      }
      setShowCountryDialog(true);
    } catch (error) {
      console.error('[정보수정] 국가 목록 로드 실패:', error);
      Alert.alert('오류', '국가 목록을 불러오는데 실패했습니다.');
    }
  };

  const handleRegionDialogOpen = async () => {
    try {

      if (!tempCountry.cCode) {
        Alert.alert('알림', '먼저 국가를 선택해주세요.');
        handleCountryDialogOpen();
        return;
      }

      setIsLoadingRegions(true);
      const regionsResponse = await getRegionsByCountry(tempCountry.cCode, navigate);
      const regionsList = regionsResponse.data || [];
      console.log('[정보수정] 지역 목록 로드 성공 (지역 다이얼로그 열기):', {
        countryCode: tempCountry.cCode,
        regionsCount: regionsList.length,
        regions: regionsList.map((r) => ({ description: r.description, subcode: r.subcode, rCode: r.rCode, rName: r.rName })),
      });

      const validRegions = regionsList.filter((r) => {
        const hasSubcode = r.subcode !== undefined && r.subcode !== null;
        const hasRCode = r.rCode !== undefined && r.rCode !== null;
        return hasSubcode || hasRCode;
      });
      console.log('[정보수정] 유효한 지역 목록 (다이얼로그):', validRegions.length, validRegions);
      setRegions(validRegions);
      setShowRegionDialog(true);
    } catch (error) {
      console.error('[정보수정] 지역 목록 로드 실패:', error);
      Alert.alert('오류', '지역 목록을 불러오는데 실패했습니다.');
    } finally {
      setIsLoadingRegions(false);
    }
  };

  const handleCountrySelect = async (country: { country?: string; callnumber?: number; cCode?: number; cName?: string }) => {

    if (isLoadingRegions) {
      return;
    }

    try {
      const countryCode = country.callnumber || country.cCode;
      const countryName = country.country || country.cName || '';

      if (!countryCode) {
        Alert.alert('오류', '국가 코드를 찾을 수 없습니다.');
        return;
      }

      setIsLoadingRegions(true);

      setTempCountry({
        cDesc: countryName,
        cCode: countryCode,
      });

      setTempRegion({
        rDesc: 'Please Select',
        rCode: 0,
      });

      setRegions([]);

      const regionsResponse = await getRegionsByCountry(countryCode, navigate);
      const regionsList = regionsResponse.data || [];
      console.log('[정보수정] 지역 목록 로드 성공 (국가 선택):', {
        country: countryName,
        countryCode: countryCode,
        regionsCount: regionsList.length,
        regions: regionsList.map((r) => ({ description: r.description, subcode: r.subcode, rCode: r.rCode, rName: r.rName })),
        rawResponse: JSON.stringify(regionsResponse),
      });

      const validRegions = regionsList.filter((r) => {
        const hasSubcode = r.subcode !== undefined && r.subcode !== null;
        const hasRCode = r.rCode !== undefined && r.rCode !== null;
        return hasSubcode || hasRCode;
      });
      console.log('[정보수정] 유효한 지역 목록:', validRegions.length, validRegions);
      setRegions(validRegions);

      if (validRegions.length === 0) {
        console.warn('[정보수정] 해당 국가의 지역 목록이 없습니다.');
      }

      setShowCountryDialog(false);
    } catch (error) {
      console.error('[정보수정] 지역 목록 로드 실패:', error);
      Alert.alert('오류', '지역 목록을 불러오는데 실패했습니다.');
    } finally {
      setIsLoadingRegions(false);
    }
  };

  const handleRegionSelect = (region: { description?: string; subcode?: number; rCode?: number; rName?: string }) => {
    const regionCode = region.subcode || region.rCode;
    const regionName = region.description || region.rName || '';

    if (!regionCode) {
      Alert.alert('오류', '지역 코드를 찾을 수 없습니다.');
      return;
    }

    setTempRegion({
      rDesc: regionName,
      rCode: regionCode,
    });

    setShowRegionDialog(false);
  };

  const handleCountryDialogClose = () => {
    setShowCountryDialog(false);
  };

  const handleRegionDialogClose = () => {
    setShowRegionDialog(false);
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
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Email</Text>
              <View style={styles.disabledInput}>
                <Text style={styles.disabledText}>{email || 'Enter email address'}</Text>
              </View>
            </View>

          <View style={styles.inlineLabelRow}>
            <Text style={styles.sectionLabel}>Password</Text>
            <TouchableOpacity onPress={handleChangePassword}>
              <Text style={styles.linkText}>Change Password</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.readonlyInput}>
            <Text style={styles.readonlyText}>최종변경날짜  : 2025.05.02</Text>
          </View>

            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Phone Number</Text>
              <View style={styles.phoneFieldContainer}>
                {}
                <View style={styles.phonePrefixDisabled}>
                  <Text style={styles.flagEmoji}>{selectedCountryDialCode.flagEmoji}</Text>
                  <Text style={styles.phonePrefixTextDisabled}>
                    +{selectedCountryDialCode.dialCode.replace('+', '')}
                  </Text>
                </View>
                {}
              <TouchableOpacity
                  style={styles.phoneValueContainer}
                  onPress={handlePhoneEdit}
                activeOpacity={0.7}
                  disabled={isSaving}
              >
                  <Text style={styles.phoneValue}>{phone}</Text>
              </TouchableOpacity>
              </View>
            </View>

            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Region</Text>
              <View style={styles.regionFieldContainer}>
                <TouchableOpacity
                  style={styles.regionField}
                  onPress={handleCountryDialogOpen}
                  activeOpacity={0.7}
                  disabled={isSaving}
                >
                  <Text style={[styles.regionValue, !tempCountry.cDesc && styles.regionPlaceholder]}>
                    {tempCountry.cDesc ? `${tempCountry.cDesc} (+${tempCountry.cCode})` : '국가를 선택하세요'}
                  </Text>
                  <Text style={styles.arrow}>›</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.regionField}
                  onPress={handleRegionDialogOpen}
                  activeOpacity={0.7}
                  disabled={isSaving || !tempCountry.cCode}
                >
                  <Text style={[styles.regionValue, (!tempRegion.rDesc || tempRegion.rDesc === 'Please Select') && styles.regionPlaceholder]}>
                    {tempRegion.rDesc && tempRegion.rDesc !== 'Please Select' ? tempRegion.rDesc : '지역을 선택하세요'}
                  </Text>
                  <Text style={styles.arrow}>›</Text>
                </TouchableOpacity>
              </View>
            </View>

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

      {}
      <Dialog
        visible={showCountryDialog}
        title="국가 선택"
        onClose={handleCountryDialogClose}
        containerStyle={styles.dialogContainer}
      >
        <FlatList
          data={countries}
          keyExtractor={(item, index) => {
            const countryCode = item.callnumber || item.cCode;
            return countryCode ? `country-${countryCode}-${index}` : `country-${index}`;
          }}
          renderItem={({ item }) => {
            const countryCode = item.callnumber || item.cCode;
            const countryName = item.country || item.cName || '국가명 없음';
            const isSelected = tempCountry.cCode === countryCode;

            return (
              <TouchableOpacity
                style={[
                  styles.listItem,
                  isSelected && styles.listItemSelected,
                  isLoadingRegions && styles.listItemDisabled,
                ]}
                onPress={() => handleCountrySelect(item)}
                activeOpacity={0.7}
                disabled={isLoadingRegions}
              >
                <Text style={styles.listItemText}>{countryName}</Text>
                {isSelected && (
                  <Text style={styles.checkmark}>✓</Text>
                )}
              </TouchableOpacity>
            );
          }}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>국가 목록이 없습니다.</Text>
            </View>
          }
        />
      </Dialog>

      {}
      <Dialog
        visible={showRegionDialog}
        title="지역 선택"
        onClose={handleRegionDialogClose}
        containerStyle={styles.dialogContainer}
      >
        <FlatList
          data={regions}
          keyExtractor={(item, index) => {
            const regionCode = item.subcode || item.rCode;

            return regionCode !== undefined && regionCode !== null 
              ? `region-${tempCountry.cCode}-${regionCode}-${index}` 
              : `region-${tempCountry.cCode}-${index}`;
          }}
          renderItem={({ item }) => {
            const regionCode = item.subcode !== undefined ? item.subcode : (item.rCode !== undefined ? item.rCode : null);
            const regionName = item.description || item.rName || '지역명 없음';

            const isSelected = tempRegion.rCode === regionCode && tempRegion.rDesc !== 'Please Select';

            return (
              <TouchableOpacity
                style={[
                  styles.listItem,
                  isSelected && styles.listItemSelected,
                ]}
                onPress={() => handleRegionSelect(item)}
                activeOpacity={0.7}
              >
                <Text style={styles.listItemText}>{regionName}</Text>
                {isSelected && (
                  <Text style={styles.checkmark}>✓</Text>
                )}
              </TouchableOpacity>
            );
          }}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>지역 목록이 없습니다.</Text>
            </View>
          }
        />
      </Dialog>
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
  phoneFieldContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#dedede',
    borderRadius: 10,
    backgroundColor: '#fefefe',
    minHeight: 52,
    overflow: 'hidden',
  },
  phonePrefixDisabled: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRightWidth: 1,
    borderRightColor: '#ededed',
    backgroundColor: '#f5f5f5',
  },
  flagEmoji: {
    fontSize: 20,
    marginRight: 6,
  },
  phonePrefixTextDisabled: {
    fontSize: 16,
    fontFamily: 'Roboto-Medium',
    color: '#a8a8a7',
  },
  phoneValueContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 16,
    justifyContent: 'center',
  },
  phoneValue: {
    fontSize: 16,
    fontFamily: 'Roboto-Medium',
    color: '#343a59',
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
  fieldContainer: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    color: '#2a2727',
    fontFamily: 'Roboto-Medium',
    marginBottom: 8,
  },
  phoneField: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#dedede',
    borderRadius: 10,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 16,
    minHeight: 56,
  },
  phoneValue: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Roboto-Regular',
    color: '#1a2e35',
    marginLeft: 12,
  },
  editHint: {
    fontSize: 12,
    fontFamily: 'Roboto-Regular',
    color: '#707070',
    marginLeft: 8,
  },
  regionFieldContainer: {
    gap: 12,
  },
  regionField: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#dedede',
    borderRadius: 10,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 16,
    minHeight: 56,
  },
  regionValue: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Roboto-Regular',
    color: '#1a2e35',
  },
  regionPlaceholder: {
    color: '#dedede',
  },
  arrow: {
    fontSize: 24,
    color: '#747474',
    marginLeft: 8,
  },
  dialogContainer: {
    maxWidth: 400,
    maxHeight: 600,
  },
  listContainer: {
    paddingVertical: 8,
    maxHeight: 400,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: '#f0f0f0',
    borderRadius: 12,
    backgroundColor: '#fff',
    marginBottom: 8,
  },
  listItemSelected: {
    borderColor: COLORS.buttonPrimary,
    backgroundColor: '#f5f6fa',
  },
  listItemDisabled: {
    opacity: 0.5,
  },
  listItemText: {
    fontSize: 16,
    fontFamily: 'Roboto-Medium',
    color: '#1a2e35',
  },
  checkmark: {
    fontSize: 18,
    color: COLORS.buttonPrimary,
    fontFamily: 'Roboto-Bold',
  },
  disabledInput: {
    borderWidth: 1,
    borderColor: '#dedede',
    borderRadius: 10,
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 16,
    paddingVertical: 16,
    minHeight: 56,
    justifyContent: 'center',
  },
  disabledText: {
    fontSize: 16,
    fontFamily: 'Roboto-Regular',
    color: '#9e9e9e',
  },
  emptyContainer: {
    paddingVertical: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 16,
    fontFamily: 'Roboto-Regular',
    color: '#9e9e9e',
  },
});

