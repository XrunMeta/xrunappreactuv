import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  Modal,
  ScrollView,
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
  const [regions, setRegions] = useState<Array<{ description?: string; subcode?: number; rCode?: number; rName?: string }>>([]);
  const [isLoadingRegions, setIsLoadingRegions] = useState(false);

  const [tempCountry, setTempCountry] = useState<{ cDesc: string; cCode: number | null }>({ cDesc: '', cCode: null });
  const [tempRegion, setTempRegion] = useState<{ rDesc: string; rCode: number | null }>({ rDesc: '', rCode: null });

  const [regionModalVisible, setRegionModalVisible] = useState(false);
  const [selectedRegionId, setSelectedRegionId] = useState<string | null>(null);

  const [originalFirstName, setOriginalFirstName] = useState('');
  const [originalLastName, setOriginalLastName] = useState('');
  const [originalGender, setOriginalGender] = useState<'male' | 'female'>('male');
  const [originalAge, setOriginalAge] = useState<(typeof AGE_OPTIONS)[number]>('10');
  const [originalCountryCode, setOriginalCountryCode] = useState<number | null>(null);
  const [originalRegionCode, setOriginalRegionCode] = useState<number | null>(null);

  const loadUserInfo = async (showLoading: boolean = true) => {
    try {
      if (showLoading) {
        setIsLoading(true);
      }
      const userDataStr = await AsyncStorage.getItem('userData');
      if (userDataStr) {
        const userData = JSON.parse(userDataStr);
        const member = userData.member;

        if (member) {
          setMemberId(member);
          const response = await getMyPageUserInfo(member, navigate);
          const user = response.data[0];

          if (user) {
            const loadedFirstName = user.firstname || '';
            const loadedLastName = user.lastname || '';
            const loadedGender = convertGenderFromApi(user.gender);
            const loadedAge = convertAgeFromApi(user.ages);

            setFirstName(loadedFirstName);
            setLastName(loadedLastName);
            setEmail(user.email || '');

            setOriginalFirstName(loadedFirstName);
            setOriginalLastName(loadedLastName);
            setOriginalGender(loadedGender);
            setOriginalAge(loadedAge);

            if (user.mobile) {
              setPhone(user.mobile.replace(/\s/g, ''));
            }

            setGender(loadedGender);

            setAge(loadedAge);

            console.log('[정보수정] 사용자 국가/지역 정보 (원본):', { country: user.country, region: user.region, countryType: typeof user.country, regionType: typeof user.region });

            const userCountry = typeof user.country === 'string' ? parseInt(user.country, 10) : user.country;
            const userRegion = typeof user.region === 'string' ? parseInt(user.region, 10) : user.region;

            console.log('[정보수정] 변환된 국가/지역 정보:', { country: userCountry, region: userRegion, countryType: typeof userCountry, regionType: typeof userRegion });

            if (userCountry && !isNaN(userCountry)) {
              setCountryCode(userCountry);
              setOriginalCountryCode(userCountry);

              try {
                const countriesResponse = await getCountries(navigate);
                const countriesList = countriesResponse.data || [];

                const countryItem = countriesList.find((c) => {
                  const cCode = typeof c.cCode === 'string' ? parseInt(c.cCode, 10) : c.cCode;
                  const callnumber = typeof c.callnumber === 'string' ? parseInt(c.callnumber, 10) : c.callnumber;
                  return cCode === userCountry || callnumber === userCountry;
                });

                const countryName = countryItem?.country || countryItem?.cName || '';
                const countryCode = countryItem?.callnumber || countryItem?.cCode || userCountry;

                console.log('[정보수정] 국가 매칭 결과:', {
                  userCountry,
                  countryItem,
                  countryName,
                  countryCode,
                });

                setTempCountry({ cDesc: countryName, cCode: countryCode });
                console.log('[정보수정] tempCountry 설정됨:', { cDesc: countryName, cCode: countryCode });

                if (userRegion !== undefined && userRegion !== null && !isNaN(userRegion)) {
                  const regionNum = typeof userRegion === 'string' ? parseInt(userRegion, 10) : userRegion;
                  setRegionCode(regionNum);
                  setOriginalRegionCode(regionNum);

                  console.log('[정보수정] 지역 정보 설정:', { regionNum, regionType: typeof regionNum });

                  if (regionNum === 0) {
                    const allRegionsText = t('screens.myInfoEdit.allRegions');
                    setTempRegion({ rDesc: allRegionsText, rCode: 0 });
                    setSelectedRegionId(allRegionsText);
                    console.log('[정보수정] 전체지역 설정됨 (region: 0)');
                  } else {

                    try {
                      setIsLoadingRegions(true);
                      const regionsResponse = await getRegionsByCountry(countryCode, navigate);
                      const regionsList = regionsResponse.data || [];
                      setRegions(regionsList);

                      const regionItem = regionsList.find((r) => {
                        const rCode = typeof r.subcode === 'string' ? parseInt(r.subcode, 10) : r.subcode;
                        const rCode2 = typeof r.rCode === 'string' ? parseInt(r.rCode, 10) : r.rCode;
                        return rCode === regionNum || rCode2 === regionNum;
                      });

                      const regionName = regionItem?.description || regionItem?.rName || '';

                      if (regionName) {
                        setTempRegion({ rDesc: regionName, rCode: regionNum });
                        setSelectedRegionId(regionName);
                        console.log('[정보수정] 초기 로드 - 지역 이름 찾음:', { rDesc: regionName, rCode: regionNum });
                      } else {
                        setTempRegion({ rDesc: 'Please Select', rCode: regionNum });
                        setSelectedRegionId(null);
                        console.log('[정보수정] 초기 로드 - 지역 이름 없음:', { rCode: regionNum });
                      }
                      setIsLoadingRegions(false);
                    } catch (error) {
                      console.error('[정보수정] 초기 로드 - 지역 목록 로드 실패:', error);
                      setTempRegion({ rDesc: 'Please Select', rCode: regionNum });
                      setSelectedRegionId(null);
                      setIsLoadingRegions(false);
                    }
                  }
                } else {

                  setTempRegion({ rDesc: 'Please Select', rCode: 0 });
                  setSelectedRegionId(null);
                  console.log('[정보수정] 지역 정보 없음 - 초기화');
                }
              } catch (error) {
                console.error('[정보수정] 국가/지역 정보 로드 실패:', error);
              }
            } else {

              if (userRegion !== undefined && userRegion !== null && !isNaN(userRegion)) {
                const regionNum = typeof userRegion === 'string' ? parseInt(userRegion, 10) : userRegion;
                setRegionCode(regionNum);
                setOriginalRegionCode(regionNum);

                if (regionNum === 0) {
                  const allRegionsText = t('screens.myInfoEdit.allRegions');
                  setTempRegion({ rDesc: allRegionsText, rCode: 0 });
                  setSelectedRegionId(allRegionsText);
                  console.log('[정보수정] 전체지역 설정됨 (region: 0, country 없음)');
                } else {
                  setTempRegion({ rDesc: 'Please Select', rCode: regionNum });
                  setSelectedRegionId(null);
                }
              } else {

                setTempCountry({ cDesc: '', cCode: null });
                setTempRegion({ rDesc: 'Please Select', rCode: 0 });
                setSelectedRegionId(null);
                console.log('[정보수정] 국가와 지역 모두 없음 - 초기화');
              }
            }
          }
        }
      }
    } catch (error) {
      console.error('[정보수정] 사용자 정보 로드 실패:', error);
      await showAlert(t('screens.myInfoEdit.alerts.error'), t('screens.myInfoEdit.alerts.loadFailed'));
    } finally {
      if (showLoading) {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
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

      if (firstName.trim() !== originalFirstName.trim()) {
        console.log('[정보수정] 이름 변경 감지:', { original: originalFirstName, new: firstName.trim() });
        promises.push(updateName(memberId, firstName.trim(), navigate));
      }

      if (lastName.trim() !== originalLastName.trim()) {
        console.log('[정보수정] 성 변경 감지:', { original: originalLastName, new: lastName.trim() });
        promises.push(updateLastName(memberId, lastName.trim(), navigate));
      }

      const genderCode = convertGenderToApi(gender);
      const originalGenderCode = convertGenderToApi(originalGender);
      if (genderCode !== undefined && genderCode !== null && genderCode !== originalGenderCode) {
        console.log('[정보수정] 성별 변경 감지:', { original: originalGenderCode, new: genderCode });
        promises.push(updateGender(memberId, genderCode, navigate));
      }

      const ageCode = convertAgeToApi(age);
      const originalAgeCode = convertAgeToApi(originalAge);
      if (ageCode !== undefined && ageCode !== null && ageCode !== originalAgeCode) {
        console.log('[정보수정] 나이 변경 감지:', { original: originalAgeCode, new: ageCode });
        promises.push(updateAge(memberId, ageCode, navigate));
      }

      if (tempCountry.cCode !== null && tempRegion.rCode !== null && tempRegion.rCode !== 0 && tempRegion.rCode !== -1) {
        const currentCountryCode = tempCountry.cCode;
        const currentRegionCode = tempRegion.rCode;
        if (currentCountryCode !== originalCountryCode || currentRegionCode !== originalRegionCode) {
          console.log('[정보수정] 국가/지역 변경 감지:', {
            original: { country: originalCountryCode, region: originalRegionCode },
            new: { country: currentCountryCode, region: currentRegionCode },
          });
          promises.push(updateRegion(memberId, currentCountryCode, currentRegionCode, navigate));
        }
      }

      if (promises.length > 0) {

        await Promise.all(promises);

        await showAlert(t('screens.myInfoEdit.alerts.saveSuccess'), t('screens.myInfoEdit.alerts.saveSuccessMessage'));

        await loadUserInfo(false);
      } else {

        await showAlert(t('screens.myInfoEdit.alerts.error'), t('screens.myInfoEdit.alerts.noChanges'));
      }
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

  const handleCountrySelect = async () => {
    try {

      setSelectMode('country');
      navigate('countryCodeSelect');
    } catch (error) {
      console.error('[정보수정] 국가 선택 화면 이동 실패:', error);
    }
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

  const getCountryCodeFromDialCode = (dialCode: string): number | null => {

    try {

      const dialCodeNumber = parseInt(dialCode.replace('+', ''), 10);
      return dialCodeNumber || null;
    } catch (error) {
      console.error('[정보수정] 국가 코드 추출 실패:', error);
      return null;
    }
  };

  const handleSelectRegion = (selectedRegion: { description?: string; subcode?: number; rCode?: number; rName?: string }) => {
    const regionCode = selectedRegion.subcode || selectedRegion.rCode || 0;
    const regionDesc = selectedRegion.description || selectedRegion.rName || '';

    console.log('[정보수정] 지역 선택:', { regionCode, regionDesc, selectedRegion });

    if (!regionDesc) {
      console.warn('[정보수정] 지역 설명이 없습니다:', selectedRegion);

      const fallbackDesc = 'Unknown';
      setTempRegion({
        rDesc: fallbackDesc,
        rCode: regionCode,
      });
      setSelectedRegionId(fallbackDesc);
    } else {

      if (regionCode === -1) {
        setTempRegion({
          rDesc: regionDesc,
          rCode: -1, 
        });
        console.log('[정보수정] 전체 지역 선택됨:', regionDesc);
      } else {
        setTempRegion({
          rDesc: regionDesc,
          rCode: regionCode,
        });
        console.log('[정보수정] 지역 선택됨:', { rDesc: regionDesc, rCode: regionCode });
      }

      setSelectedRegionId(regionDesc);
    }

    setRegionModalVisible(false);

    setTimeout(() => {
      console.log('[정보수정] 지역 선택 후 상태 확인:', {
        tempCountry,
        tempRegion: { rDesc: regionDesc || 'Unknown', rCode: regionCode },
        selectedRegionId: regionDesc || 'Unknown',
      });
    }, 100);
  };

  const handleOpenRegionModal = async () => {
    console.log('handleOpenRegionModal');

    if (!selectedCountryDialCode || !selectedCountryDialCode.dialCode) {
      await showAlert(
        t('screens.myInfoEdit.alerts.error'),
        t('screens.myInfoEdit.alerts.selectCountryFirst')
      );

      handleCountrySelect();
      return;
    }

    const countryCode = getCountryCodeFromDialCode(selectedCountryDialCode.dialCode); 
    if (!countryCode) {
      await showAlert(
        t('screens.myInfoEdit.alerts.error'),
        t('screens.myInfoEdit.alerts.invalidCountryCode')
      );
      return;
    }

    const currentCountryCode = tempCountry.cCode;
    if (regions.length === 0 || currentCountryCode !== countryCode) {
      setIsLoadingRegions(true);
      try {
        console.log('[정보수정] 지역 목록 조회:', { countryCode, dialCode: selectedCountryDialCode.dialCode });

        const regionsResponse = await getRegionsByCountry(countryCode, navigate);
        const regionsList = regionsResponse.data || [];
        setRegions(regionsList);

        setTempCountry({
          cDesc: selectedCountryDialCode.name,
          cCode: countryCode,
        });

        if (regionsList.length === 0) {
          console.log('[정보수정] 지역 목록이 없습니다. 전체 지역을 선택할 수 있습니다.');
          setRegions([{
            description: t('screens.myInfoEdit.allRegions'),
            subcode: -1,
            rCode: -1,
            rName: t('screens.myInfoEdit.allRegions'),
          }]);
        }
      } catch (error) {
        console.error('[정보수정] 지역 목록 로드 실패:', error);

        setRegions([{
          description: t('screens.myInfoEdit.allRegions'),
          subcode: -1,
          rCode: -1,
          rName: t('screens.myInfoEdit.allRegions'),
        }]);
      } finally {
        setIsLoadingRegions(false);
      }
    }

    setRegionModalVisible(true);
  };

  useEffect(() => {
    console.log('[정보수정] useEffect 트리거됨 - selectedCountryDialCode 변경 감지:', {
      selectedCountryDialCode,
      iso2: selectedCountryDialCode?.iso2,
      isLoading,
      조건체크: selectedCountryDialCode && !isLoading,
    });
    console.log('selectedCountryDialCode', selectedCountryDialCode);
    console.log('isLoading', isLoading);
    console.log('selectedCountryDialCode && !isLoading', selectedCountryDialCode && !isLoading);

      console.log('[정보수정] 전화번호 국가 선택됨 (CountryCodeSelectScreen에서):', {
        iso2: selectedCountryDialCode.iso2,
        name: selectedCountryDialCode.name,
        dialCode: selectedCountryDialCode.dialCode,
        flagEmoji: selectedCountryDialCode.flagEmoji,
      });

      const countryCode = getCountryCodeFromDialCode(selectedCountryDialCode.dialCode);
      console.log('[정보수정] 추출된 국가 코드:', { dialCode: selectedCountryDialCode.dialCode, countryCode });

      if (countryCode) {

        setTempCountry({
          cDesc: selectedCountryDialCode.name,
          cCode: countryCode,
        });
        console.log('[정보수정] tempCountry 업데이트 완료:', {
          cDesc: selectedCountryDialCode.name,
          cCode: countryCode,
        });

        setRegions([]);

        if (tempRegion.rCode !== null && tempRegion.rCode !== 0) {
          setTempRegion({ rDesc: 'Please Select', rCode: 0 });
          setSelectedRegionId(null);
        } 
    }
  }, [selectedCountryDialCode?.iso2]);

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
                <TouchableOpacity
                  style={styles.phonePrefix}
                  onPress={handleCountrySelect}
                  activeOpacity={0.7}
                  disabled={isSaving}
                >
                  <Text style={styles.flagEmoji}>{selectedCountryDialCode.flagEmoji}</Text>
                  <Text style={styles.phonePrefixText}>
                    {selectedCountryDialCode.dialCode}
                  </Text>
                </TouchableOpacity>
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

            {}
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>{t('screens.myInfoEdit.region')}</Text>
              <TouchableOpacity
                style={styles.regionField}
                onPress={handleOpenRegionModal}
                activeOpacity={0.7}
                disabled={isSaving || isLoadingRegions}
              >
                <Text style={[styles.regionValue, (!tempCountry.cDesc || !tempRegion.rDesc || tempRegion.rCode === 0 || tempRegion.rCode === null || tempRegion.rCode === -1) && styles.regionPlaceholder]}>
                  {tempCountry.cDesc && tempRegion.rDesc && tempRegion.rDesc !== 'Please Select' && tempRegion.rCode !== null && tempRegion.rCode !== 0 && tempRegion.rCode !== -1
                    ? `${tempCountry.cDesc}, ${tempRegion.rDesc}`
                    : tempCountry.cDesc
                      ? `${tempCountry.cDesc}, ${t('screens.myInfoEdit.pleaseSelect')}`
                      : t('screens.myInfoEdit.selectCountryAndRegion')}
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

      {}
      <Modal
        animationType="slide"
        transparent={true}
        visible={regionModalVisible}
        onRequestClose={() => setRegionModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <TouchableOpacity
            style={styles.modalBackdrop}
            activeOpacity={1}
            onPress={() => setRegionModalVisible(false)}
          />
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {tempCountry.cDesc ? `${t('screens.myInfoEdit.selectRegion')} - ${tempCountry.cDesc}` : t('screens.myInfoEdit.selectRegion')}
              </Text>
              <TouchableOpacity onPress={() => setRegionModalVisible(false)}>
                <Text style={styles.modalCloseButton}>✕</Text>
              </TouchableOpacity>
            </View>
            {isLoadingRegions ? (
              <View style={styles.modalLoadingContainer}>
                <ActivityIndicator size="large" color={COLORS.buttonPrimary} />
              </View>
            ) : (
              <ScrollView style={styles.modalScrollView}>
                {regions.length > 0 ? (
                  regions.map((region) => (
                    <TouchableOpacity
                      key={region.subcode || region.rCode || region.description}
                      style={[
                        styles.modalItem,
                        selectedRegionId === (region.description || region.rName) && styles.modalItemSelected,
                      ]}
                      onPress={() => handleSelectRegion(region)}
                    >
                      <Text style={styles.modalItemText}>
                        {region.description || region.rName || 'Unknown'}
                      </Text>
                      {selectedRegionId === (region.description || region.rName) && (
                        <Text style={styles.checkmark}>✓</Text>
                      )}
                    </TouchableOpacity>
                  ))
                ) : (
                  <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>{t('screens.myInfoEdit.noRegions')}</Text>
                    <Text style={styles.emptyTextSub}>{t('screens.myInfoEdit.selectAllRegions')}</Text>
                  </View>
                )}
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>

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
  phonePrefix: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    minHeight: 52, 
    justifyContent: 'center',
    borderRightWidth: 1,
    borderRightColor: '#ededed',
    backgroundColor: '#fefefe',
  },
  flagEmoji: {
    fontSize: FONTS.size.large,
    marginRight: 6,
  },
  phonePrefixText: {
    fontSize: FONTS.size.medium,
    fontFamily: 'Roboto-Medium',
    color: '#343a59',
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
  emptyTextSub: {
    fontSize: FONTS.size.small,
    fontFamily: 'Roboto-Regular',
    color: '#9e9e9e',
    marginTop: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 16,
    width: '90%',
    maxWidth: 400,
    maxHeight: '80%',
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ededed',
  },
  modalTitle: {
    fontSize: FONTS.size.large,
    fontFamily: 'Roboto-Bold',
    color: '#1a2e35',
    flex: 1,
  },
  modalCloseButton: {
    fontSize: FONTS.size.xlarge,
    fontFamily: 'Roboto-Regular',
    color: '#9e9e9e',
    padding: 4,
  },
  modalScrollView: {
    maxHeight: 400,
  },
  modalLoadingContainer: {
    paddingVertical: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalItem: {
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
    marginHorizontal: 16,
  },
  modalItemSelected: {
    borderColor: COLORS.buttonPrimary,
    backgroundColor: '#f5f6fa',
  },
  modalItemText: {
    fontSize: FONTS.size.medium,
    fontFamily: 'Roboto-Medium',
    color: '#1a2e35',
    flex: 1,
  },
});

