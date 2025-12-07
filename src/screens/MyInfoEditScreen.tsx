import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Header, FormField, PrimaryButton, OptionButton, Dialog, SafeScrollView } from '../components';
import { COLORS, COMMON_STYLES, SIZES, FORM_STYLES, FONTS } from '../constants';
import { useAppNavigation, ROUTES } from '../navigation';
import { useAppContext } from '../context';
import { useAlertDialog } from '../context/AlertDialogContext';
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
  const { t } = useTranslation();
  const { reset, canGoBack, goBack, navigate } = useAppNavigation();
  const { showAlert } = useAlertDialog();
  const { selectedCountryDialCode, setVerificationEmail, setVerificationSuccessRoute, setSelectMode } = useAppContext();

  const GENDER_OPTIONS = [
    { value: 'male' as const, label: t('screens.myInfoEdit.genderMale') },
    { value: 'female' as const, label: t('screens.myInfoEdit.genderFemale') },
  ];
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
        await showAlert(t('screens.myInfoEdit.alerts.error'), t('screens.myInfoEdit.alerts.loadFailed'));
      } finally {
        setIsLoading(false);
      }
    };

    loadUserInfo();
  }, [navigate, t]);

  const handleSave = async () => {

    if (!firstName.trim()) {
      await showAlert(t('screens.myInfoEdit.alerts.error'), t('screens.myInfoEdit.alerts.firstNameRequired'));
      return;
    }

    if (!lastName.trim()) {
      await showAlert(t('screens.myInfoEdit.alerts.error'), t('screens.myInfoEdit.alerts.lastNameRequired'));
      return;
    }

    if (!memberId) {
      await showAlert(t('screens.myInfoEdit.alerts.error'), t('screens.myInfoEdit.alerts.userDataNotFound'));
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

      await showAlert(t('screens.myInfoEdit.alerts.saveSuccess'), t('screens.myInfoEdit.alerts.saveSuccessMessage'), [
        {
          text: t('screens.myInfoEdit.alerts.confirm'),
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
      await showAlert(t('screens.myInfoEdit.alerts.saveFailed'), t('screens.myInfoEdit.alerts.saveFailedMessage'));
    } finally {
      setIsSaving(false);
    }
  };

  const handleChangePassword = async () => {
    navigate(ROUTES.myInfoChangePassword);
  };

  const handlePhoneEdit = async () => {
    if (!email) {
      await showAlert(t('screens.myInfoEdit.alerts.error'), t('screens.myInfoEdit.alerts.emailNotFound'));
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
        await showAlert(t('screens.myInfoEdit.alerts.error'), t('screens.myInfoEdit.alerts.emailSendFailed'), [
          {
            text: t('screens.myInfoEdit.alerts.confirm'),
            onPress: () => {

            },
          },
        ]);
      }
    } catch (error) {
      console.error('[정보수정] 전화번호 수정 인증 오류:', error);
      await showAlert(t('screens.myInfoEdit.alerts.error'), t('screens.myInfoEdit.alerts.verificationError'));
    }
  };

  const handleCountrySelect = async () => {
    try {

      setSelectMode('country');
      navigate('countryCodeSelect');
    } catch (error) {
      console.error('[정보수정] 국가 선택 화면 이동 실패:', error);
    }
  };

  useEffect(() => {
    const updateCountryFromDialCode = async () => {
      if (!selectedCountryDialCode || isLoadingRegions) {
        return;
      }

      try {

        const dialCodeNumber = parseInt(selectedCountryDialCode.dialCode.replace('+', ''), 10);

        if (!dialCodeNumber) {
          return;
        }

        if (countries.length === 0) {
          const countriesResponse = await getCountries(navigate);
          const countriesList = countriesResponse.data || [];
          setCountries(countriesList);

          const countryItem = countriesList.find(
            (c) => (c.callnumber === dialCodeNumber || c.cCode === dialCodeNumber)
          );

          if (countryItem) {
            const countryCode = countryItem.callnumber || countryItem.cCode;
            const countryName = countryItem.country || countryItem.cName || selectedCountryDialCode.name;

            setTempCountry({
              cDesc: countryName,
              cCode: countryCode || dialCodeNumber,
            });

          } else {

            setTempCountry({
              cDesc: selectedCountryDialCode.name,
              cCode: dialCodeNumber,
            });

          }
        } else {

          const countryItem = countries.find(
            (c) => (c.callnumber === dialCodeNumber || c.cCode === dialCodeNumber)
          );

          if (countryItem) {
            const countryCode = countryItem.callnumber || countryItem.cCode;
            const countryName = countryItem.country || countryItem.cName || selectedCountryDialCode.name;

            setTempCountry({
              cDesc: countryName,
              cCode: countryCode || dialCodeNumber,
            });

          }
        }
      } catch (error) {
        console.error('[정보수정] 국가 정보 업데이트 실패:', error);
      } finally {
        setIsLoadingRegions(false);
      }
    };

    if (selectedCountryDialCode && !isLoading) {

      const timer = setTimeout(() => {
        updateCountryFromDialCode();
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [selectedCountryDialCode?.iso2, navigate]); 

  return (
    <View style={styles.container}>
      <Header
        title={t('screens.myInfoEdit.title')}
        onBackPress={() => {
          if (canGoBack) {
            goBack();
          } else {
            reset(ROUTES.myInfo);
          }
        }}
        showBackButton
      />
      <SafeScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        autoAdjustKeyboardPadding={true}
      >
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={COLORS.buttonPrimary} />
          </View>
        ) : (
          <View style={styles.formFieldContainer}>

            <FormField
              label={t('screens.myInfoEdit.firstName')}
              value={firstName}
              onChangeText={setFirstName}
              placeholder={t('screens.myInfoEdit.firstNamePlaceholder')}
              editable={!isSaving}
              containerStyle={styles.fieldContainer}
            />

            <FormField
              label={t('screens.myInfoEdit.lastName')}
              value={lastName}
              onChangeText={setLastName}
              placeholder={t('screens.myInfoEdit.lastNamePlaceholder')}
              editable={!isSaving}
              containerStyle={styles.fieldContainer}
            />

            <View style={styles.fieldContainer}>
              <Text style={styles.label}>{t('screens.myInfoEdit.email')}</Text>
              <View style={styles.disabledInput}>
                <Text style={styles.disabledText}>{email || t('screens.myInfoEdit.email')}</Text>
              </View>
            </View>

            <View style={styles.inlineLabelRow}>
              <Text style={styles.sectionLabel}>{t('screens.myInfoEdit.password')}</Text>
              <TouchableOpacity onPress={handleChangePassword}>
                <Text style={styles.linkText}>{t('screens.myInfoEdit.changePassword')}</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.readonlyInput}>
              <Text style={styles.readonlyText}>
                {t('screens.myInfoEdit.lastPasswordChangeDateLabel', { date: '2025.05.02' })}
              </Text>
            </View>

            <View style={styles.fieldContainer} >
              <Text style={styles.label}>{t('screens.myInfoEdit.phone')}</Text>
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
              <Text style={styles.label}>Country</Text>
              <TouchableOpacity
                style={styles.regionField}
                onPress={handleCountrySelect}
                activeOpacity={0.7}
                disabled={isSaving}
              >
                <Text style={[styles.regionValue, !tempCountry.cDesc && styles.regionPlaceholder]}>
                  {tempCountry.cDesc
                    ? `${tempCountry.cDesc} (+${tempCountry.cCode})`
                    : selectedCountryDialCode
                      ? `${selectedCountryDialCode.name} (${selectedCountryDialCode.dialCode})`
                      : '국가를 선택하세요'}
                </Text>
                <Text style={styles.arrow}>›</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.fieldContainer}>
              <Text style={styles.label}>{t('screens.myInfoEdit.gender')}</Text>
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

            <View style={styles.fieldContainer}>
              <Text style={styles.label}>{t('screens.myInfoEdit.age')}</Text>
              <View style={[styles.inlineOptions, styles.ageOptionsRow]}>
                {AGE_OPTIONS.map((option, index) => {
                  return (
                    <OptionButton
                      key={option}
                      label={option}
                      selected={age === option}
                      onPress={() => setAge(option)}
                      flex={1}
                      disabled={isSaving}
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
              title={t('screens.myInfoEdit.save')}
              fullWidth
              onPress={handleSave}
              style={styles.primaryButton}
              disabled={isLoading}
            />
          )}
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
    flexGrow: 1,
    ...COMMON_STYLES.scrollContent,
  },
  formFieldContainer: {
    ...FORM_STYLES.fieldContainer,
  },
  inlineLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  sectionLabel: {
    fontSize: FONTS.size.medium,
    color: '#2a2727',
    fontFamily: 'Roboto-Medium',
  },
  linkText: {
    fontSize: FONTS.size.small,
    color: '#707070',
    fontFamily: 'Roboto-SemiBold',
  },
  readonlyInput: {
    borderWidth: 1,
    borderColor: '#dedede',
    borderRadius: 10,
    backgroundColor: '#fefefe',
    paddingHorizontal: 16,
    minHeight: 52, 
    justifyContent: 'center',
  },
  readonlyText: {
    fontSize: FONTS.size.ssmall,
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
    minHeight: 52, 
    justifyContent: 'center',
    borderRightWidth: 1,
    borderRightColor: '#ededed',
    backgroundColor: '#f5f5f5',
  },
  flagEmoji: {
    fontSize: FONTS.size.large,
    marginRight: 6,
  },
  phonePrefixTextDisabled: {
    fontSize: FONTS.size.medium,
    fontFamily: 'Roboto-Medium',
    color: '#a8a8a7',
  },
  phoneValueContainer: {
    flex: 1,
    paddingHorizontal: 16,
    minHeight: 52, 
    justifyContent: 'center',
  },
  phoneValue: {
    fontSize: FONTS.size.medium,
    fontFamily: 'Roboto-Medium',
    color: '#343a59',
  },
  inlineOptions: {
    flexDirection: 'row',
    flexWrap: 'nowrap',
    justifyContent: 'flex-start',
    gap: 8,
    width: '100%',
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
    ...COMMON_STYLES.bottomButtonContainer,
    marginTop: SIZES.large,
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
    borderWidth: 0,
  },
  label: {
    fontSize: FONTS.size.medium,
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
  phoneValueText: {
    flex: 1,
    fontSize: FONTS.size.medium,
    fontFamily: 'Roboto-Regular',
    color: '#1a2e35',
    marginLeft: 12,
  },
  editHint: {
    fontSize: FONTS.size.small,
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
    minHeight: 52, 
  },
  regionValue: {
    flex: 1,
    fontSize: FONTS.size.medium,
    fontFamily: 'Roboto-Regular',
    color: '#1a2e35',
  },
  regionPlaceholder: {
    color: '#dedede',
  },
  arrow: {
    fontSize: FONTS.size.xlarge,
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
    fontSize: FONTS.size.medium,
    fontFamily: 'Roboto-Medium',
    color: '#1a2e35',
  },
  checkmark: {
    fontSize: FONTS.size.mmedium,
    color: COLORS.buttonPrimary,
    fontFamily: 'Roboto-Bold',
  },
  disabledInput: {
    borderWidth: 1,
    borderColor: '#dedede',
    borderRadius: 10,
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 16,
    minHeight: 52, 
    justifyContent: 'center',
  },
  disabledText: {
    fontSize: FONTS.size.medium,
    fontFamily: 'Roboto-Regular',
    color: '#9e9e9e',
  },
  emptyContainer: {
    paddingVertical: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: FONTS.size.medium,
    fontFamily: 'Roboto-Regular',
    color: '#9e9e9e',
  },
});

