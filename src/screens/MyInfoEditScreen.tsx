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
  InteractionManager,
  Platform,
  Dimensions,
  TextInput,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Header, FormField, PrimaryButton, OptionButton, Dialog, SafeScrollView } from '../components';
import { COLORS, COMMON_STYLES, SIZES, FORM_STYLES, FONTS, COUNTRY_DIAL_CODES, GLOBAL_REGION, ALLOWED_COUNTRIES } from '../constants';
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
  signInWithApple,
} from '../services';
import { loadCountriesFromApi, loadRegionsFromApi, LoadRegionsResult } from '../utils/countryUtils';
import { CountryDialCode } from '../types';

const AGE_OPTIONS = ['10', '20', '30', '40', '50+'] as const;

const convertGenderToApi = (gender: 'male' | 'female'): number => {
  return gender === 'male' ? 2110 : 2111;
};

const convertGenderFromApi = (gender?: number | string | null): 'male' | 'female' => {

  if (gender === null || gender === undefined) {
    return 'male';
  }

  let genderNum: number;
  if (typeof gender === 'string') {
    genderNum = parseInt(gender, 10);
  } else {
    genderNum = gender;
  }

  if (isNaN(genderNum)) {
    return 'male';
  }

  if (genderNum === 0) {
    return 'male';
  }

  const result = genderNum === 2111 ? 'female' : 'male';
  return result;
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
  if (age === 0 || age === null || age === undefined) return '10'; 
  const ageMap: Record<number, (typeof AGE_OPTIONS)[number]> = {
    2210: '10',
    2220: '20',
    2230: '30',
    2240: '40',
    2250: '50+',
  };
  return ageMap[age] || '10'; 
};

export const MyInfoEditScreen = () => {
  const { t, i18n } = useTranslation();
  const { reset, canGoBack, goBack, navigate } = useAppNavigation();
  const { showAlert } = useAlertDialog();
  const { selectedCountryDialCode, setSelectedCountryDialCode, setVerificationEmail, setVerificationSuccessRoute, setSelectMode } = useAppContext();

  const hasLoadedUserInfoRef = React.useRef(false);
  const isMountedRef = React.useRef(false);

  const renderCountRef = React.useRef(0);

  const GENDER_OPTIONS = [
    { value: 'male' as const, label: t('screens.myInfoEdit.genderMale') },
    { value: 'female' as const, label: t('screens.myInfoEdit.genderFemale') },
  ];
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [datepinchanged, setDatepinchanged] = useState<string>('');
  const [phone, setPhone] = useState('');
  const [region, setRegion] = useState('대한민국 서울');
  const [regionCode, setRegionCode] = useState<number | null>(null);
  const [countryCode, setCountryCode] = useState<number | null>(null);
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [age, setAge] = useState<(typeof AGE_OPTIONS)[number]>('10');
  const [isLoading, setIsLoading] = useState(true);

  const FORM_DATA_KEY = 'myInfoEdit_formData';

  const [isSaving, setIsSaving] = useState(false);
  const [memberId, setMemberId] = useState<number | null>(null);
  const [regions, setRegions] = useState<Array<{ description?: string; subcode?: number; rCode?: number; rName?: string }>>([]);
  const [isLoadingRegions, setIsLoadingRegions] = useState(false);

  const [tempCountry, setTempCountry] = useState<{ cDesc: string; cCode: number | null }>({ cDesc: '', cCode: null });
  const [tempRegion, setTempRegion] = useState<{ rDesc: string; rCode: number | null }>({ rDesc: '', rCode: null });

  const [regionModalVisible, setRegionModalVisible] = useState(false);
  const [selectedRegionId, setSelectedRegionId] = useState<string | null>(null);

  const [countryModalVisible, setCountryModalVisible] = useState(false);
  const [countries, setCountries] = useState<CountryDialCode[]>(ALLOWED_COUNTRIES);
  const [isLoadingCountries, setIsLoadingCountries] = useState(false);

  const getTranslatedRegionName = React.useCallback((regionDesc: string, regionCode: number | null, countryCode: number | null): string => {

    if (regionCode === 0) {
      return t('screens.myInfoEdit.allRegions');
    }

    if (countryCode && regionCode !== null && regionCode !== undefined && regionCode > 0) {

      const COUNTRIES_WITH_MAPPING = [82, 81, 86, 1, 62];
      let regionKey: string;

      if (COUNTRIES_WITH_MAPPING.includes(countryCode)) {

        regionKey = `regions.${countryCode}_${regionCode}`;
      } else {

        const regionNameKey = regionDesc
          .replace(/[^a-zA-Z0-9\s]/g, '') 
          .replace(/\s+/g, '_') 
          .toLowerCase();
        regionKey = `regions.${countryCode}_${regionNameKey}`;
      }

      try {
        const translated = t(regionKey);

        if (translated && translated !== regionKey) {
          if (__DEV__) {
            console.log('[정보수정] 지역 번역 성공:', {
              key: regionKey,
              translated,
              original: regionDesc,
              countryCode,
              regionCode,
            });
          }
          return translated;
        } else {
          if (__DEV__) {
            console.warn('[정보수정] 지역 번역 키 없음:', {
              key: regionKey,
              countryCode,
              regionCode,
              original: regionDesc,
              translated,
            });
          }
        }
      } catch (error) {
        if (__DEV__) {
          console.warn('[정보수정] 지역 번역 오류:', error, {
            key: regionKey,
            countryCode,
            regionCode,
            original: regionDesc,
          });
        }
      }
    }

    return regionDesc;
  }, [t, i18n.language]);

  const getTranslatedCountryName = React.useCallback((countryName: string, iso2?: string): string => {
    if (!countryName) return '';

    if (iso2 && iso2 !== 'select' && iso2 !== 'global' && iso2.length === 2) {
      const countryKey = `countries.${iso2.toUpperCase()}`;
      try {
        const translated = t(countryKey);
        if (translated && translated !== countryKey) {
          return translated;
        }
      } catch (error) {
        if (__DEV__) {
          console.warn('[정보수정] 국가 번역 오류:', error);
        }
      }
    }

    return countryName;
  }, [t]);

  const [originalFirstName, setOriginalFirstName] = useState('');
  const [originalLastName, setOriginalLastName] = useState('');
  const [originalGender, setOriginalGender] = useState<'male' | 'female'>('male');
  const [originalAge, setOriginalAge] = useState<(typeof AGE_OPTIONS)[number]>('10');
  const [originalCountryCode, setOriginalCountryCode] = useState<number | null>(null);
  const [originalRegionCode, setOriginalRegionCode] = useState<number | null>(null);

  const [isCountryChanged, setIsCountryChanged] = useState(false);

  const saveFormData = async () => {
    try {
      const formData = {

        firstName,
        lastName,
        fullName,
        phone,
        gender,
        age,
        tempCountry,
        tempRegion,
        regionCode,
        countryCode,

        originalFirstName,
        originalLastName,
        originalGender,
        originalAge,
        originalCountryCode,
        originalRegionCode,
      };
      await AsyncStorage.setItem(FORM_DATA_KEY, JSON.stringify(formData));
      console.log('[정보수정] ✅ 입력값 저장 완료');
    } catch (error) {
      console.error('[정보수정] 입력값 저장 실패:', error);
    }
  };

  const restoreFormData = async (excludeRegion: boolean = false) => {
    try {
      const savedDataStr = await AsyncStorage.getItem(FORM_DATA_KEY);
      if (savedDataStr) {
        const savedData = JSON.parse(savedDataStr);

        if (savedData.firstName) {
          setFirstName(savedData.firstName);
        }
        if (savedData.lastName) {
          setLastName(savedData.lastName);
        }

        if (savedData.fullName) {
          setFullName(savedData.fullName);
        } else if (savedData.firstName || savedData.lastName) {

          const combinedName = `${savedData.lastName || ''} ${savedData.firstName || ''}`.trim();
          setFullName(combinedName);
        }
        if (savedData.phone) setPhone(savedData.phone);
        if (savedData.gender) setGender(savedData.gender);
        if (savedData.age) setAge(savedData.age);

        if (savedData.originalFirstName !== undefined) {
          setOriginalFirstName(savedData.originalFirstName);
        }
        if (savedData.originalLastName !== undefined) {
          setOriginalLastName(savedData.originalLastName);
        }
        if (savedData.originalGender !== undefined) {
          setOriginalGender(savedData.originalGender);
        }
        if (savedData.originalAge !== undefined) {
          setOriginalAge(savedData.originalAge);
        }
        if (savedData.originalCountryCode !== undefined) {
          setOriginalCountryCode(savedData.originalCountryCode);
        }
        if (savedData.originalRegionCode !== undefined) {
          setOriginalRegionCode(savedData.originalRegionCode);
        }

        if (excludeRegion) {

          setTempRegion({ rDesc: '', rCode: null });
          setSelectedRegionId(null);
          setRegionCode(null);
        } else {

          if (savedData.tempCountry) {
            setTempCountry(savedData.tempCountry);
          }
          if (savedData.tempRegion) {
            setTempRegion(savedData.tempRegion);
          }
          if (savedData.regionCode !== undefined) {
            setRegionCode(savedData.regionCode);
          }
          if (savedData.countryCode !== undefined) {
            setCountryCode(savedData.countryCode);
          }
        }

        return true; 
      }
      console.log('[정보수정] ⚠️ 저장된 입력값 없음');
      return false; 
    } catch (error) {
      console.error('[정보수정] 입력값 복원 실패:', error);
      return false;
    }
  };

  const clearFormData = async () => {
    try {
      await AsyncStorage.removeItem(FORM_DATA_KEY);
    } catch (error) {
      console.error('[정보수정] 입력값 삭제 실패:', error);
    }
  };

  useEffect(() => {

    if (isLoading || !hasLoadedUserInfoRef.current) {
      return;
    }

    const hasChanges =
      firstName !== originalFirstName ||
      lastName !== originalLastName ||
      gender !== originalGender ||
      age !== originalAge;

    if (hasChanges || tempCountry.cDesc || tempRegion.rDesc) {
      saveFormData();
    }
  }, [firstName, lastName, fullName, phone, gender, age, tempCountry, tempRegion, regionCode, countryCode, isLoading]);

  const loadUserInfo = async (showLoading: boolean = true) => {
    const stackTrace = new Error().stack;
    const caller = stackTrace?.split('\n')[2]?.trim() || 'unknown';

    if (!showLoading && hasLoadedUserInfoRef.current) {
      console.warn('[정보수정] ⚠️ 경고: 나라 선택 후 loadUserInfo가 호출되었습니다!');
    }

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

            const combinedName = `${loadedLastName || ''} ${loadedFirstName || ''}`.trim();
            setFullName(combinedName);
            setEmail(user.email || '');
            setDatepinchanged(user.datepinchanged || '');

            setOriginalFirstName(loadedFirstName);
            setOriginalLastName(loadedLastName);
            setOriginalGender(loadedGender);
            setOriginalAge(loadedAge);

            if (user.mobile) {
              setPhone(user.mobile.replace(/\s/g, ''));
            }

            const expectedGenderValue = (() => {
              const rawGender = user.gender;
              if (rawGender === null || rawGender === undefined) return 'male';
              const genderNum = typeof rawGender === 'string' ? parseInt(rawGender, 10) : rawGender;
              return isNaN(genderNum) ? 'male' : (genderNum === 2111 ? 'female' : 'male');
            })();

            setGender(loadedGender);

            setAge(loadedAge);

            let loadedCountryName = '';
            let loadedCountryCode: number | null = null;
            let loadedRegionName = '';
            let loadedRegionCode: number | null = null;

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

                const loadedCountries = await loadCountriesFromApi(
                  () => Promise.resolve(countriesResponse),
                  ALLOWED_COUNTRIES
                );
                setCountries(loadedCountries);

                const countryItem = countriesList.find((c) => {
                  const cCode = typeof c.cCode === 'string' ? parseInt(c.cCode, 10) : c.cCode;
                  const callnumber = typeof c.callnumber === 'string' ? parseInt(c.callnumber, 10) : c.callnumber;
                  return cCode === userCountry || callnumber === userCountry;
                });

                const countryName = countryItem?.country || countryItem?.cName || '';
                const countryCode = countryItem?.callnumber || countryItem?.cCode || userCountry;

                loadedCountryName = countryName;
                loadedCountryCode = countryCode;

                setTempCountry({ cDesc: countryName, cCode: countryCode });
                console.log('[정보수정] tempCountry 설정됨:', { cDesc: countryName, cCode: countryCode });

                const dialCodeStr = `+${countryCode}`;
                const matchingDialCode = COUNTRY_DIAL_CODES.find((cd) => cd.dialCode === dialCodeStr);
                if (matchingDialCode) {
                  setSelectedCountryDialCode(matchingDialCode);
                  console.log('[정보수정] selectedCountryDialCode 설정됨:', matchingDialCode);
                } else {

                  const dialCodeNum = parseInt(countryCode.toString().replace('+', ''), 10);
                  const matchingByNumber = COUNTRY_DIAL_CODES.find((cd) => {
                    const cdNum = parseInt(cd.dialCode.replace('+', ''), 10);
                    return cdNum === dialCodeNum;
                  });
                  if (matchingByNumber) {
                    setSelectedCountryDialCode(matchingByNumber);
                    console.log('[정보수정] selectedCountryDialCode 설정됨 (숫자 비교):', matchingByNumber);
                  }
                }

                if (userRegion !== undefined && userRegion !== null && !isNaN(userRegion)) {
                  const regionNum = typeof userRegion === 'string' ? parseInt(userRegion, 10) : userRegion;
                  setRegionCode(regionNum);
                  setOriginalRegionCode(regionNum);

                  console.log('[정보수정] 지역 정보 설정:', { regionNum, regionType: typeof regionNum });

                  if (regionNum === 0) {
                    const allRegionsText = t('screens.myInfoEdit.allRegions');
                    setTempRegion({ rDesc: allRegionsText, rCode: 0 });
                    setSelectedRegionId(allRegionsText);

                    setIsCountryChanged(false);
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

                      loadedRegionName = regionName;
                      loadedRegionCode = regionNum;

                      if (regionName) {
                        setTempRegion({ rDesc: regionName, rCode: regionNum });
                        setSelectedRegionId(regionName);

                        setIsCountryChanged(false);
                        console.log('[정보수정] 초기 로드 - 지역 이름 찾음:', { rDesc: regionName, rCode: regionNum });
                      } else {
                        setTempRegion({ rDesc: 'Please Select', rCode: regionNum });
                        setSelectedRegionId(null);
                        console.log('[정보수정] 초기 로드 - 지역 이름 없음:', { rCode: regionNum });
                        loadedRegionName = '알 수 없음';
                        loadedRegionCode = regionNum;
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
    const initializeUserInfo = async () => {
      try {

        const prevCountryIso2 = await AsyncStorage.getItem('PREV_COUNTRY_ISO2');
        const isReturningFromCountrySelect = prevCountryIso2 !== null;

        if (isReturningFromCountrySelect) {

          const userDataStr = await AsyncStorage.getItem('userData');
          if (userDataStr) {
            const userData = JSON.parse(userDataStr);
            const member = userData.member;
            if (member) {
              setMemberId(member);
            }
          }

          const currentIso2 = selectedCountryDialCode?.iso2;

          const isCountryActuallyChanged = Boolean(currentIso2 && prevCountryIso2 !== currentIso2);

          const restored = await restoreFormData(isCountryActuallyChanged);

          if (isCountryActuallyChanged && selectedCountryDialCode) {

            const newCountryCode = getCountryCodeFromDialCode(selectedCountryDialCode.dialCode);
            if (newCountryCode !== null) {
              setTempCountry({
                cDesc: selectedCountryDialCode.name,
                cCode: newCountryCode,
              });
            }
            setIsCountryChanged(true);
            setTempRegion({ rDesc: '', rCode: null });
            setSelectedRegionId(null);
            setRegionCode(null);
            setRegions([]);
          }

          if (currentIso2) {
            prevCountryDialCodeRef.current = currentIso2;
          }

          await AsyncStorage.removeItem('PREV_COUNTRY_ISO2');

          isMountedRef.current = true;

          if (restored) {
            console.log('[정보수정] ✅ 나라 선택 후 돌아옴 - 저장된 입력값 복원 완료');
          } else {
            console.log('[정보수정] ✅ 나라 선택 후 돌아옴 - 저장된 입력값 없음');
          }

          setIsLoading(false);
          return;
        }

        if (isMountedRef.current && hasLoadedUserInfoRef.current) {
          console.log('[정보수정] ✅ 이미 초기 로드 완료 - 스킵');
          return;
        }

        isMountedRef.current = true;
        console.log('[정보수정] 🚀 화면 진입 - 사용자 정보 로드 시작 (초기 로드)');

        const userDataStr = await AsyncStorage.getItem('userData');
        if (userDataStr) {
          const userData = JSON.parse(userDataStr);
          const member = userData.member;
          if (member) {
            setMemberId(member);

            if (!hasLoadedUserInfoRef.current) {

              await loadUserInfo();
              hasLoadedUserInfoRef.current = true;

              setIsCountryChanged(false);

              if (selectedCountryDialCode?.iso2) {
                prevCountryDialCodeRef.current = selectedCountryDialCode.iso2;
              } else {

                prevCountryDialCodeRef.current = '';
              }
            } else {

              const hasSavedData = await restoreFormData();
              if (!hasSavedData) {

                await loadUserInfo(false);
              }
            }

            console.log('[정보수정] ✅ loadUserInfo 완료, hasLoadedUserInfoRef = true로 설정');

            const loginType = await AsyncStorage.getItem('loginType');
            if (loginType === 'apple') {
              if (Platform.OS === 'ios') {

                InteractionManager.runAfterInteractions(() => {
                  setTimeout(() => {
                    showAlert(
                      t('screens.myInfoEdit.alerts.appleLoginInfo') || '알림',
                      t('screens.myInfoEdit.alerts.appleLoginMessage') || '애플 로그인 시 비밀번호, 전화번호 수정은 필수입니다.'
                    );
                  }, 300);
                });
              } else {

                await showAlert(
                  t('screens.myInfoEdit.alerts.appleLoginInfo') || '알림',
                  t('screens.myInfoEdit.alerts.appleLoginMessage') || '애플 로그인 시 비밀번호, 전화번호 수정은 필수입니다.'
                );
              }
            }
          } else {
            console.warn('[정보수정] 초기화 - member ID가 없습니다.');
            setIsLoading(false);
          }
        } else {
          console.warn('[정보수정] 초기화 - userData가 AsyncStorage에 없습니다.');
          setIsLoading(false);
        }
      } catch (error) {
        console.error('[정보수정] 초기화 실패:', error);
        setIsLoading(false);
      }
    };

    initializeUserInfo();
  }, []); 

  const handleSave = async () => {

    const nameParts = fullName.trim().split(/\s+/);
    let parsedFirstName = '';
    let parsedLastName = '';

    if (nameParts.length === 0) {
      await showAlert(t('screens.myInfoEdit.alerts.error'), t('screens.myInfoEdit.alerts.firstNameRequired'));
      return;
    } else if (nameParts.length === 1) {

      parsedFirstName = nameParts[0];
      parsedLastName = '';
    } else {

      parsedLastName = nameParts[0];
      parsedFirstName = nameParts.slice(1).join(' ');
    }

    if (!parsedFirstName.trim()) {
      await showAlert(t('screens.myInfoEdit.alerts.error'), t('screens.myInfoEdit.alerts.firstNameRequired'));
      return;
    }

    if (!gender) {
      await showAlert(t('screens.myInfoEdit.alerts.error'), t('screens.myInfoEdit.alerts.genderRequired'));
      return;
    }

    if (!age) {
      await showAlert(t('screens.myInfoEdit.alerts.error'), t('screens.myInfoEdit.alerts.ageRequired'));
      return;
    }

    if (!tempCountry.cCode && tempCountry.cCode !== 0) {
      await showAlert(t('screens.myInfoEdit.alerts.error'), t('screens.myInfoEdit.alerts.countryRequired'));
      return;
    }

    if (tempRegion.rCode === null || tempRegion.rCode === -1) {
      await showAlert(t('screens.myInfoEdit.alerts.error'), t('screens.myInfoEdit.alerts.regionRequired'));
      return;
    }

    if (!memberId) {
      await showAlert(t('screens.myInfoEdit.alerts.error'), t('screens.myInfoEdit.alerts.userDataNotFound'));
      return;
    }

    const genderCode = convertGenderToApi(gender);
    const ageCode = convertAgeToApi(age);

    const validationErrors: string[] = [];

    if (genderCode === 0 || genderCode === null || genderCode === undefined) {
      validationErrors.push(t('screens.myInfoEdit.alerts.genderRequired') || '성별을 선택해주세요.');
    }

    if (ageCode === 0 || ageCode === null || ageCode === undefined) {
      validationErrors.push(t('screens.myInfoEdit.alerts.ageRequired') || '연령대를 선택해주세요.');
    }

    if (tempCountry.cCode === 0 || tempCountry.cCode === null || tempCountry.cCode === undefined) {
      validationErrors.push(t('screens.myInfoEdit.alerts.countryRequired') || '국가를 선택해주세요.');
    }

    if (tempRegion.rCode === 0 || tempRegion.rCode === null || tempRegion.rCode === undefined || tempRegion.rCode === -1) {
      validationErrors.push(t('screens.myInfoEdit.alerts.regionRequired') || '지역을 선택해주세요.');
    }

    if (validationErrors.length > 0) {
      await showAlert(
        t('screens.myInfoEdit.alerts.error') || '오류',
        validationErrors.join('\n')
      );
      return;
    }

    setIsSaving(true);

    try {

      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('[정보수정] 📋 저장 버튼 클릭 - 현재 저장된 회원 정보 (원본)');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log(JSON.stringify({
        memberId: memberId,
        원본이름: originalFirstName,
        원본성: originalLastName,
        원본성별: {
          UI값: originalGender,
          API코드: convertGenderToApi(originalGender),
        },
        원본나이: {
          UI값: originalAge,
          API코드: convertAgeToApi(originalAge),
        },
        원본국가: {
          국가코드: originalCountryCode,
          국가명: tempCountry.cDesc || '알 수 없음',
        },
        원본지역: {
          지역코드: originalRegionCode,
          지역명: tempRegion.rDesc || '알 수 없음',
        },
      }, null, 2));
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('[정보수정] ✏️ 현재 입력된 값');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log(JSON.stringify({
        memberId: memberId,
        입력이름: firstName.trim(),
        입력성: lastName.trim(),
        입력성별: {
          UI값: gender,
          API코드: convertGenderToApi(gender),
        },
        입력나이: {
          UI값: age,
          API코드: convertAgeToApi(age),
        },
        입력국가: {
          국가코드: tempCountry.cCode,
          국가명: tempCountry.cDesc || '알 수 없음',
        },
        입력지역: {
          지역코드: tempRegion.rCode,
          지역명: tempRegion.rDesc || '알 수 없음',
        },
      }, null, 2));
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

      const promises = [];
      const apiCalls: Array<{ name: string; request: any }> = [];

      if (parsedFirstName.trim() !== originalFirstName.trim()) {
        const request = { member: memberId, firstname: parsedFirstName.trim() };
        apiCalls.push({ name: '이름', request });
        promises.push(updateName(memberId, parsedFirstName.trim(), navigate).then(response => {
          console.log('[정보수정] 📥 이름 수정 API 응답:', response);
          return response;
        }));
      } else {
        console.log('[정보수정] ❌ 이름 변경 없음:', {
          원본: originalFirstName,
          현재: parsedFirstName.trim()
        });
      }

      if (parsedLastName.trim() !== originalLastName.trim()) {
        const request = { member: memberId, lastname: parsedLastName.trim() };

        apiCalls.push({ name: '성', request });
        promises.push(updateLastName(memberId, parsedLastName.trim(), navigate).then(response => {
          console.log('[정보수정] 📥 성 수정 API 응답:', response);
          return response;
        }));
      } else {
        console.log('[정보수정] ❌ 성 변경 없음:', {
          원본: originalLastName,
          현재: parsedLastName.trim()
        });
      }

      const genderCode = convertGenderToApi(gender);
      const originalGenderCode = convertGenderToApi(originalGender);
      if (genderCode !== undefined && genderCode !== null && genderCode !== originalGenderCode) {
        const request = { member: memberId, gender: genderCode };
        apiCalls.push({ name: '성별', request });
        promises.push(updateGender(memberId, genderCode, navigate).then(response => {
          console.log('[정보수정] 📥 성별 수정 API 응답:', response);
          return response;
        }));
      } else {
        console.log('[정보수정] ❌ 성별 변경 없음:', {
          원본: originalGenderCode,
          현재: genderCode
        });
      }

      const ageCode = convertAgeToApi(age);
      const originalAgeCode = convertAgeToApi(originalAge);
      if (ageCode !== undefined && ageCode !== null && ageCode !== originalAgeCode) {
        const request = { member: memberId, ages: ageCode };
        apiCalls.push({ name: '나이', request });
        promises.push(updateAge(memberId, ageCode, navigate).then(response => {
          console.log('[정보수정] 📥 나이 수정 API 응답:', response);
          return response;
        }));
      } else {
        console.log('[정보수정] ❌ 나이 변경 없음:', {
          원본: originalAgeCode,
          현재: ageCode
        });
      }

      console.log('[정보수정] 🔍 국가/지역 저장 조건 확인:', {
        tempCountry: tempCountry,
        tempRegion: tempRegion,
        originalCountryCode: originalCountryCode,
        originalRegionCode: originalRegionCode,
        memberId: memberId,
        조건1: tempCountry.cCode !== null && tempCountry.cCode !== undefined,
        조건2: tempRegion.rCode !== null && tempRegion.rCode !== undefined,
        조건3: tempRegion.rCode !== -1,
      });

      if (tempCountry.cCode !== null && tempCountry.cCode !== undefined &&
        tempRegion.rCode !== null && tempRegion.rCode !== undefined &&
        tempRegion.rCode !== -1) {
        const currentCountryCode = tempCountry.cCode;
        const currentRegionCode = tempRegion.rCode;

        if (!memberId || memberId === null || memberId === undefined) {
          console.error('[정보수정] ❌ memberId가 유효하지 않습니다:', memberId);
          throw new Error('회원 ID가 유효하지 않습니다.');
        }

        const countryCodeNum = Number(currentCountryCode);
        const regionCodeNum = Number(currentRegionCode);

        if (isNaN(countryCodeNum)) {
          console.error('[정보수정] ❌ 국가 코드가 유효하지 않습니다:', currentCountryCode, '변환 후:', countryCodeNum);
          throw new Error('국가 코드가 유효하지 않습니다.');
        }

        if (isNaN(regionCodeNum)) {
          console.error('[정보수정] ❌ 지역 코드가 유효하지 않습니다:', currentRegionCode, '변환 후:', regionCodeNum);
          throw new Error('지역 코드가 유효하지 않습니다.');
        }

        const originalCountry = originalCountryCode ?? null;
        const originalRegion = originalRegionCode ?? null;
        const isCountryChanged = countryCodeNum !== originalCountry;
        const isRegionChanged = regionCodeNum !== originalRegion;

        if (isCountryChanged || isRegionChanged) {

          const memberNum = Number(memberId);
          const countryNum = countryCodeNum;
          const regionNum = regionCodeNum;

          const mobilecode = selectedCountryDialCode?.dialCode
            ? parseInt(selectedCountryDialCode.dialCode.replace('+', ''), 10)
            : null;

          const countrycode = mobilecode;

          const request: any = {
            member: memberNum,
            country: countryNum,
            region: regionNum,
          };

          if (mobilecode && !isNaN(mobilecode)) {
            request.mobilecode = mobilecode;

            request.countrycode = mobilecode;
          }

          const options: { countrycode?: number; mobilecode?: number } = {};
          if (countrycode !== null && countrycode !== undefined && !isNaN(countrycode)) {
            options.countrycode = countrycode;
          }
          if (mobilecode !== null && mobilecode !== undefined && !isNaN(mobilecode)) {
            options.mobilecode = mobilecode;
          }

          promises.push(updateRegion(
            memberNum,
            countryNum,
            regionNum,
            navigate,
            Object.keys(options).length > 0 ? options : undefined 
          ).then(response => {
            console.log('[정보수정] 📥 국가/지역 수정 API 응답:', response);
            return response;
          }).catch(error => {
            console.error('[정보수정] ❌ 국가/지역 수정 API 에러:', error);
            console.error('[정보수정] 에러 발생 시점의 요청 데이터:', {
              member: memberNum,
              country: countryNum,
              region: regionNum,
            });
            throw error;
          }));
        } else {
          console.log('[정보수정] ❌ 국가/지역 변경 없음:', {
            original: { country: originalCountryCode, region: originalRegionCode },
            current: { country: currentCountryCode, region: currentRegionCode },
          });
        }
      } else {
        console.log('[정보수정] ❌ 국가/지역 유효하지 않음:', {
          tempCountry,
          tempRegion,
          reason: tempCountry.cCode === null || tempCountry.cCode === undefined ? 'countryCode가 null/undefined' :
            tempRegion.rCode === null || tempRegion.rCode === undefined ? 'regionCode가 null/undefined' :
              tempRegion.rCode === -1 ? 'regionCode가 -1 (유효하지 않음)' : '알 수 없음',
        });
      }

      if (promises.length > 0) {

        const beforeRefresh = {
          이름: originalFirstName,
          성: originalLastName,
          성별: originalGender,
          성별코드: convertGenderToApi(originalGender),
          나이: originalAge,
          나이코드: convertAgeToApi(originalAge),
        };

        await clearFormData();

        await loadUserInfo(false);

        setTimeout(() => {
          const afterRefresh = {
            이름: firstName,
            성: lastName,
            성별: gender,
            성별코드: convertGenderToApi(gender),
            나이: age,
            나이코드: convertAgeToApi(age),
          };

          const changeCheck = {
            이름변경됨: firstName !== beforeRefresh.이름,
            성변경됨: lastName !== beforeRefresh.성,
            성별변경됨: gender !== beforeRefresh.성별,
            나이변경됨: age !== beforeRefresh.나이,
          };

          const anyChanged = changeCheck.이름변경됨 || changeCheck.성변경됨 || changeCheck.성별변경됨 || changeCheck.나이변경됨;

          if (anyChanged) {
            console.log('[정보수정] ✅ 수정이 성공적으로 반영되었습니다!');
            const changedItems = Object.entries(changeCheck)
              .filter(([_, changed]) => changed)
              .map(([key, _]) => key);
            console.log('변경된 항목:', changedItems.join(', '));
          } else {
            console.warn('[정보수정] ⚠️ 수정이 반영되지 않았습니다.');
            console.warn('가능한 원인:');
            console.warn('1. API 응답이 실패했을 수 있습니다 (위 API 응답 로그 확인)');
            console.warn('2. 서버에서 데이터를 업데이트하지 못했을 수 있습니다');
            console.warn('3. 새로고침이 너무 빨리 발생했을 수 있습니다 (500ms 후 다시 확인)');
          }

          showAlert(
            t('screens.myInfoEdit.alerts.saveSuccess'),
            t('screens.myInfoEdit.alerts.saveSuccessMessage'),
            [
              {
                text: t('screens.myInfoEdit.alerts.confirm') || '확인',
                onPress: () => {

                  if (canGoBack) {
                    goBack();
                  } else {
                    reset(ROUTES.myInfo);
                  }
                },
              },
            ],
          );
        }, 1000);
      } else {

        await showAlert(t('screens.myInfoEdit.alerts.error'), t('screens.myInfoEdit.alerts.noChanges'), [
          {
            text: t('screens.myInfoEdit.alerts.confirm'),
            onPress: () => {
              reset(ROUTES.myInfo);
            },
          },
        ]);
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

      const currentIso2 = selectedCountryDialCode?.iso2 || '';
      await AsyncStorage.setItem('PREV_COUNTRY_ISO2', currentIso2);
      console.log('[정보수정] 나라 선택 전 현재 나라 저장:', currentIso2);

      await saveFormData();

      if (countries.length === 0 || (countries.length === ALLOWED_COUNTRIES.length && countries[0]?.iso2 === ALLOWED_COUNTRIES[0]?.iso2)) {
        setIsLoadingCountries(true);
        try {
          const loadedCountries = await loadCountriesFromApi(
            () => getCountries(navigate),
            ALLOWED_COUNTRIES
          );
          setCountries(loadedCountries);
        } catch (error) {
          console.error('[정보수정] 국가 목록 로드 실패:', error);
          setCountries(ALLOWED_COUNTRIES);
        } finally {
          setIsLoadingCountries(false);
        }
      }

      setCountryModalVisible(true);
    } catch (error) {
      console.error('[정보수정] 국가 선택 모달 열기 실패:', error);
    }
  };

  const filteredCountries = useMemo(() => {
    if (!countrySearchQuery.trim()) {
      return countries;
    }
    const normalizedQuery = countrySearchQuery.trim().toLowerCase();
    return countries.filter((item) => {

      const searchName = item.name.toLowerCase();

      const searchIso = item.iso2.toLowerCase();

      const searchDialCode = item.dialCode.toLowerCase();

      let translatedName = '';
      if (item.iso2 && item.iso2 !== 'select' && item.iso2 !== 'global' && item.iso2.length === 2) {
        const countryKey = `countries.${item.iso2.toUpperCase()}`;
        const translated = t(countryKey);
        if (translated && translated !== countryKey) {
          translatedName = translated.toLowerCase();
        }
      }

      const isoExactMatch = searchIso === normalizedQuery;

      const nameMatch = searchName.includes(normalizedQuery);

      const translatedNameMatch = translatedName && translatedName.includes(normalizedQuery);

      let dialCodeMatch = false;
      if (normalizedQuery.match(/^\d+$/)) {

        const dialCodeNumbers = searchDialCode.replace(/[^0-9]/g, '');
        dialCodeMatch = dialCodeNumbers.includes(normalizedQuery);
      } else if (normalizedQuery.startsWith('+')) {

        dialCodeMatch = searchDialCode.includes(normalizedQuery);
      }

      return (
        isoExactMatch ||
        nameMatch ||
        translatedNameMatch ||
        dialCodeMatch
      );
    });
  }, [countrySearchQuery, countries, t]);

  const handleSelectCountry = (country: CountryDialCode) => {
    console.log('[정보수정] 국가 선택:', country);
    setSelectedCountryDialCode(country);
    setCountrySearchQuery('');
    setCountryModalVisible(false);
  };

  const prevCountryDialCodeRef = React.useRef<string | undefined>(undefined);

  useEffect(() => {
    const currentIso2 = selectedCountryDialCode?.iso2;
    const prevIso2 = prevCountryDialCodeRef.current;

    if (isLoading || !hasLoadedUserInfoRef.current) {

      if (currentIso2) {
        prevCountryDialCodeRef.current = currentIso2;
      }
      return;
    }

    if (prevIso2 === undefined) {
      if (currentIso2) {
        prevCountryDialCodeRef.current = currentIso2;
      }
      return;
    }

    const isCountryActuallyChanged = currentIso2 && prevIso2 && currentIso2 !== prevIso2;

    if (isCountryActuallyChanged && selectedCountryDialCode) {
      console.log('[정보수정] ✅ useEffect 나라 변경 감지 - 지역 화면 표시 초기화:', {
        이전나라: prevIso2,
        현재나라: currentIso2,
        현재화면표시: tempRegion.rDesc,
      });

      const newCountryCode = getCountryCodeFromDialCode(selectedCountryDialCode.dialCode);
      if (newCountryCode !== null) {
        setTempCountry({
          cDesc: selectedCountryDialCode.name,
          cCode: newCountryCode,
        });
      }

      setIsCountryChanged(true);

      console.log('[정보수정] ✅ 나라 변경으로 지역 필드 초기화 - placeholder 표시');
      setTempRegion({ rDesc: '', rCode: null }); 
      setSelectedRegionId(null);
      setRegionCode(null);
      setRegions([]);

      setTimeout(async () => {
        await saveFormData();
      }, 0);

    }

    if (currentIso2) {
      prevCountryDialCodeRef.current = currentIso2;
    }
  }, [selectedCountryDialCode?.iso2, selectedCountryDialCode?.name, selectedCountryDialCode?.dialCode, isLoading]);

  const handlePhoneEdit = async () => {

    const loginType = await AsyncStorage.getItem('loginType');
    const isAppleLogin = loginType === 'apple';

    if (isAppleLogin) {

      console.log('[정보수정] 애플 로그인 사용자 - 애플 로그인으로 인증 시작');

      try {
        const appleLoginResult = await signInWithApple(navigate);

        if (!appleLoginResult.success || !appleLoginResult.data) {
          console.error('[정보수정] 애플 로그인 인증 실패:', appleLoginResult.message);
          await showAlert(
            t('screens.myInfoEdit.alerts.error'),
            t('screens.myInfoEdit.alerts.verificationError') || '인증에 실패했습니다. 다시 시도해주세요.',
          );
          return;
        }

        console.log('[정보수정] 애플 로그인 인증 성공 - 전화번호 수정 화면으로 이동');
        navigate(ROUTES.myInfoPhoneEdit);
      } catch (error) {
        console.error('[정보수정] 애플 로그인 인증 오류:', error);
        await showAlert(t('screens.myInfoEdit.alerts.error'), t('screens.myInfoEdit.alerts.verificationError'));
      }
    } else {

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

      if (regionCode === -1 || regionCode === 0) {
        const allRegionsText = t('screens.myInfoEdit.allRegions');
        setTempRegion({
          rDesc: allRegionsText,
          rCode: 0, 
        });
        setSelectedRegionId(allRegionsText);

        setIsCountryChanged(false);
        console.log('[정보수정] 전체 지역 선택됨 (rCode: 0):', allRegionsText);
      } else {
        setTempRegion({
          rDesc: regionDesc,
          rCode: regionCode,
        });
        setSelectedRegionId(regionDesc);

        setIsCountryChanged(false);
        console.log('[정보수정] 지역 선택됨:', { rDesc: regionDesc, rCode: regionCode });
      }
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

        const result: LoadRegionsResult = await loadRegionsFromApi(
          (country: number) => getRegionsByCountry(country, navigate),
          countryCode,
          selectedCountryDialCode.iso2 
        );

        if (result.hasRegions && result.regions.length > 0) {

          const convertedRegions = result.regions.map((region) => ({
            description: region.name,
            subcode: parseInt(region.dialCode, 10) || 0,
            rCode: parseInt(region.dialCode, 10) || 0,
            rName: region.name,
          }));
          setRegions(convertedRegions);
        } else {

          console.log('[정보수정] 패키지에 지역 데이터 없음 - Global로 설정:', { countryCode, iso2: selectedCountryDialCode.iso2 });
          setRegions([{
            description: GLOBAL_REGION.name,
            subcode: 0,
            rCode: 0,
            rName: GLOBAL_REGION.name,
          }]);
        }

        setTempCountry({
          cDesc: selectedCountryDialCode.name,
          cCode: countryCode,
        });

        if (!result.hasRegions || result.regions.length === 0) {
          setTempRegion({
            rDesc: GLOBAL_REGION.name,
            rCode: 0,
          });
          setSelectedRegionId(GLOBAL_REGION.name);
        }
      } catch (error) {
        console.error('[정보수정] 지역 목록 로드 실패:', error);

        setRegions([{
          description: GLOBAL_REGION.name,
          subcode: 0,
          rCode: 0,
          rName: GLOBAL_REGION.name,
        }]);

        setTempRegion({
          rDesc: GLOBAL_REGION.name,
          rCode: 0,
        });
        setSelectedRegionId(GLOBAL_REGION.name);
      } finally {
        setIsLoadingRegions(false);
      }
    }

    const hasRegionsData = regions.length > 0 && regions[0].rCode !== 0 && regions[0].description !== GLOBAL_REGION.name;
    if (!hasRegionsData) {
      return;
    }

    setRegionModalVisible(true);
  };

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
              value={fullName}
              onChangeText={(text) => {
                setFullName(text);

                const nameParts = text.trim().split(/\s+/);
                if (nameParts.length === 0) {
                  setFirstName('');
                  setLastName('');
                } else if (nameParts.length === 1) {
                  setFirstName(nameParts[0]);
                  setLastName('');
                } else {
                  setLastName(nameParts[0]);
                  setFirstName(nameParts.slice(1).join(' '));
                }
              }}
              placeholder={t('screens.myInfoEdit.firstNamePlaceholder')}
              editable={!isSaving}
              containerStyle={styles.fieldContainer}
            />

            <View style={styles.fieldContainer}>
              <Text style={styles.label}>{t('screens.myInfoEdit.email')}</Text>
              <View style={styles.disabledInput}>
                <Text style={styles.disabledText}>{email || t('screens.myInfoEdit.email')}</Text>
              </View>
            </View>
            <View style={styles.fieldContainer}>
              <View style={[{ ...styles.inlineLabelRow, ...styles.label }]}>
                <Text style={styles.sectionLabel}>{t('screens.myInfoEdit.password')}</Text>
                <TouchableOpacity onPress={handleChangePassword} style={styles.linkTextContainer}>
                  <Text style={styles.linkText}>{t('screens.myInfoEdit.changePassword')}</Text>
                </TouchableOpacity>
              </View>
              <View style={[{ ...styles.readonlyInput }, { marginTop: 0 }]}>
                <Text style={styles.readonlyText}>
                  {t('screens.myInfoEdit.lastPasswordChangeDateLabel', 'e', { date: datepinchanged || '-' })}
                </Text>
              </View>
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
              {(() => {

                const hasRegionsData = regions.length > 0 && regions[0].rCode !== 0 && regions[0].description !== GLOBAL_REGION.name;

                if (!hasRegionsData) {
                  return null;
                }

              return (
                <View style={styles.fieldContainer}>
                  <Text style={styles.label}>{t('screens.myInfoEdit.region')}</Text>
                  <TouchableOpacity
                    style={styles.regionField}
                    onPress={handleOpenRegionModal}
                    activeOpacity={0.7}
                    disabled={isSaving || isLoadingRegions}
                  >
                    <Text style={[styles.regionValue, ((!tempCountry.cDesc && !selectedCountryDialCode?.name) || !tempRegion.rDesc || tempRegion.rCode === null || tempRegion.rCode === -1 || isCountryChanged) && styles.regionPlaceholder]}>
                      {(() => {

                        const originalCountryName = isCountryChanged && selectedCountryDialCode?.name
                          ? selectedCountryDialCode.name
                          : tempCountry.cDesc || selectedCountryDialCode?.name || '';

                        const countryName = getTranslatedCountryName(originalCountryName, selectedCountryDialCode?.iso2);

                        if (countryName && tempRegion.rDesc && tempRegion.rDesc !== 'Please Select' && tempRegion.rCode !== null && tempRegion.rCode !== -1 && !isCountryChanged) {

                          const translatedRegionName = getTranslatedRegionName(tempRegion.rDesc, tempRegion.rCode, tempCountry.cCode || countryCode);

                          if (tempRegion.rCode === 0) {
                            return translatedRegionName;
                          }

                          return `${countryName}, ${translatedRegionName}`;
                        }

                        if (countryName) {
                          return `${countryName}, ${t('screens.myInfoEdit.pleaseSelect')}`;
                        }

                        return t('screens.myInfoEdit.selectCountryAndRegion');
                      })()}
                    </Text>
                    <Text style={styles.arrow}>›</Text>
                  </TouchableOpacity>
                </View>
              );
            })()}

            <View style={styles.fieldContainer}>
              <Text style={styles.label}>{t('screens.myInfoEdit.gender')}</Text>
              <View style={styles.inlineOptions}>
                {GENDER_OPTIONS.map((option) => {
                  const isSelected = gender === option.value;
                  if (__DEV__) {
                    console.log(`[정보수정] 성별 옵션 렌더링: ${option.label} (${option.value})`, {
                      현재gender: gender,
                      옵션value: option.value,
                      선택됨: isSelected,
                    });
                  }
                  return (
                    <OptionButton
                      key={option.value}
                      label={option.label}
                      selected={isSelected}
                      onPress={() => {
                        console.log('[정보수정] 성별 선택됨:', { 이전: gender, 선택: option.value });
                        setGender(option.value);
                      }}
                      disabled={isSaving}
                    />
                  );
                })}
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
        visible={countryModalVisible}
        onRequestClose={() => setCountryModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <TouchableOpacity
            style={styles.modalBackdrop}
            activeOpacity={1}
            onPress={() => {
              setCountryModalVisible(false);
              setCountrySearchQuery('');
            }}
          />
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {t('screens.myInfoEdit.selectCountry')}
              </Text>
              <TouchableOpacity onPress={() => {
                setCountryModalVisible(false);
                setCountrySearchQuery('');
              }}>
                <Text style={styles.modalCloseButton}>✕</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.modalSearchBox}>
              <Ionicons name="search" size={18} color="#9ca3af" />
              <TextInput
                style={styles.modalSearchInput}
                value={countrySearchQuery}
                onChangeText={setCountrySearchQuery}
                placeholder={t('screens.countryCodeSelect.countrySearchPlaceholder') || '국가 검색'}
                placeholderTextColor="#c4c7d1"
                autoCorrect={false}
              />
            </View>
            {isLoadingCountries ? (
              <View style={styles.modalLoadingContainer}>
                <ActivityIndicator size="large" color={COLORS.buttonPrimary} />
              </View>
            ) : (
              <FlatList
                data={filteredCountries}
                keyExtractor={(item, index) => `${item.iso2}-${item.dialCode}-${item.name}-${index}`}
                renderItem={({ item: country }) => (
                  <TouchableOpacity
                    style={[
                      styles.modalItem,
                      selectedCountryDialCode?.iso2 === country.iso2 && styles.modalItemSelected,
                    ]}
                    onPress={() => handleSelectCountry(country)}
                  >
                    <View style={styles.modalItemContent}>
                      <Text style={styles.modalItemFlag}>{country.flagEmoji}</Text>
                      <View style={styles.modalItemInfo}>
                        <Text style={styles.modalItemText}>
                          {(() => {

                            if (country.iso2 && country.iso2 !== 'select' && country.iso2 !== 'global' && country.iso2.length === 2) {
                              const countryKey = `countries.${country.iso2.toUpperCase()}`;
                              const translated = t(countryKey);
                              return translated && translated !== countryKey ? translated : country.name;
                            }
                            return country.name;
                          })()}
                        </Text>
                        <Text style={styles.modalItemDialCode}>{country.dialCode}</Text>
                      </View>
                    </View>
                    {selectedCountryDialCode?.iso2 === country.iso2 && (
                      <Text style={styles.checkmark}>✓</Text>
                    )}
                  </TouchableOpacity>
                )}
                contentContainerStyle={styles.modalScrollView}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                ListEmptyComponent={
                  <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>
                      {t('screens.countryCodeSelect.noResults') || '검색 결과가 없습니다.'}
                    </Text>
                  </View>
                }
              />
            )}
          </View>
        </View>
      </Modal>

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
                {tempCountry.cDesc ? `${t('screens.myInfoEdit.selectRegion')} - ${getTranslatedCountryName(tempCountry.cDesc, selectedCountryDialCode?.iso2)}` : t('screens.myInfoEdit.selectRegion')}
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
                        {(() => {
                          const regionDesc = region.description || region.rName || 'Unknown';
                          const regionCode = region.subcode || region.rCode;
                          const currentCountryCode = tempCountry.cCode || countryCode;
                          return getTranslatedRegionName(regionDesc, regionCode || null, currentCountryCode);
                        })()}
                      </Text>
                      {(() => {
                        const regionName = region.description || region.rName || '';
                        const regionCode = region.subcode || region.rCode;

                        const isSelected = regionCode === 0
                          ? tempRegion.rCode === 0 && selectedRegionId === regionName
                          : selectedRegionId === regionName;
                        return isSelected && <Text style={styles.checkmark}>✓</Text>;
                      })()}
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
  regionHelper: {
    fontSize: FONTS.size.small,
    lineHeight: 18,
    color: '#8e9bae',
    fontFamily: 'Roboto-Regular',
    marginTop: 4,
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
    height: Dimensions.get('window').height * 0.8,
    minHeight: Dimensions.get('window').height * 0.6,
    maxHeight: Dimensions.get('window').height * 0.8,
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
  modalSearchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9fafc',
    borderRadius: 12,
    paddingHorizontal: 16,
    marginHorizontal: 20,
    marginTop: 16,
    marginBottom: 12,
    height: 48,
  },
  modalSearchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: FONTS.size.medium,
    fontFamily: 'Roboto-Regular',
    color: COLORS.headerText,
  },
  modalScrollView: {
    paddingHorizontal: 20,
    paddingBottom: 20,
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
  modalItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  modalItemFlag: {
    fontSize: 24,
    marginRight: 12,
  },
  modalItemInfo: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalItemDialCode: {
    fontSize: FONTS.size.medium,
    fontFamily: 'Roboto-Bold',
    color: COLORS.buttonPrimary,
    marginLeft: 8,
  },
  checkmark: {
    fontSize: FONTS.size.large,
    color: COLORS.buttonPrimary,
    fontFamily: 'Roboto-Bold',
    marginLeft: 8,
  },
  linkTextContainer: {
    marginBottom: 0,
  },
});

