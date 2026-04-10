import React, { useState, useMemo, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Platform,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Dimensions,
  Modal,
  FlatList,
  TextInput,
  Keyboard,
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
  CountryCodeListItem,
} from '../components';
import { COLORS, SIZES, FONTS } from '../constants';
import { useAppNavigation, ROUTES } from '../navigation';
import { useAppContext } from '../context';
import { useAlertDialog } from '../context/AlertDialogContext';
import { getRegionIdByIso2, getRegionNameById, getRegionsByCountryIso2, GLOBAL_REGION, COMMON_STYLES, FORM_STYLES, REGIONS_AS_COUNTRY_DIAL_CODES, ALLOWED_COUNTRIES } from '../constants';
import { CountryDialCode } from '../types';
import { ClauseId } from '../types';
import { filterAsciiPrintable } from '../utils';
import { getRegionsByCountry, getCountries } from '../services';
import { loadRegionsFromApi, LoadRegionsResult, loadCountriesFromApi } from '../utils/countryUtils';

import {
  checkEmailAvailability,
  checkReferralEmail,
  signup,
  SignupHelpers,
  getClauseContent,
  encryptSHA256,
  saveSession,
} from '../services';
import { signInWithApple } from '../services/appleAuth';
import { AxiosError } from 'axios';

const AGE_OPTIONS = ['0', '10', '20', '30', '40', '50+'] as const;

type GenderValue = 'male' | 'female' | '0';
type AgeValue = (typeof AGE_OPTIONS)[number];

export const SignupScreen = () => {
  const { t, i18n } = useTranslation();
  const { goBack, navigate, reset } = useAppNavigation();
  const { showAlert } = useAlertDialog();
  const {
    selectedCountryDialCode,
    setSelectedCountryDialCode,
    selectedRegion,
    setSelectedRegion,
    setSelectMode,
    signupFormData,
    setSignupFormData,
    resetSignupFormData,
    setVerificationEmail,
    setVerificationSuccessRoute,
  } = useAppContext();

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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleSignupMode, setIsGoogleSignupMode] = useState(false);
  const [isAppleSignupMode, setIsAppleSignupMode] = useState(false);

  const [gender, setGender] = useState<GenderValue>(
    (isAppleSignupMode || Platform.OS === 'ios') ? '0' : (signupFormData.gender || 'male')
  );
  const [ageRange, setAgeRange] = useState<AgeValue>(
    (isAppleSignupMode || Platform.OS === 'ios') ? '0' : (signupFormData.ageRange || '10')
  );
  const [serviceTermsAccepted, setServiceTermsAccepted] = useState(false);
  const [locationTermsAccepted, setLocationTermsAccepted] = useState(false);
  const [privacyTermsAccepted, setPrivacyTermsAccepted] = useState(false);

  const allTermsAccepted = serviceTermsAccepted && locationTermsAccepted && privacyTermsAccepted;

  const [clauseDialogVisible, setClauseDialogVisible] = useState(false);
  const [selectedClauseIdForDialog, setSelectedClauseIdForDialog] = useState<ClauseId>('service');
  const [clauseContent, setClauseContent] = useState<string>('');
  const [isClauseLoading, setIsClauseLoading] = useState(false);
  const [clauseError, setClauseError] = useState<string | null>(null);
  const [regionModalVisible, setRegionModalVisible] = useState(false);
  const [regionSearchQuery, setRegionSearchQuery] = useState('');
  const [availableRegions, setAvailableRegions] = useState<CountryDialCode[]>(REGIONS_AS_COUNTRY_DIAL_CODES);
  const [hasRegions, setHasRegions] = useState<boolean>(true); 
  const [isLoadingRegions, setIsLoadingRegions] = useState(false);

  const [countryModalVisible, setCountryModalVisible] = useState(false);
  const [countrySearchQuery, setCountrySearchQuery] = useState('');
  const [availableCountries, setAvailableCountries] = useState<CountryDialCode[]>(ALLOWED_COUNTRIES);
  const [isLoadingCountries, setIsLoadingCountries] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);

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

  const isCountryWithRegions = hasRegions;

  const isOptionalFields = isAppleSignupMode || Platform.OS === 'ios';

  const regionDisplayValue = React.useMemo(() => {

    if (!isCountryWithRegions) {
      return GLOBAL_REGION.name;
    }

    if (!selectedRegion || (selectedRegion.iso2 === 'select' || selectedRegion.dialCode === '0')) {
      return t('screens.countryCodeSelect.selectOption') || '선택';
    }

    let value = '';
    if (selectedRegion) {

      const regionCode = selectedRegion.dialCode ? parseInt(selectedRegion.dialCode, 10) : null;
      const countryCode = selectedCountryDialCode?.countryCode || null;

      if (regionCode === 0) {
        value = t('screens.signup.allRegions') || t('screens.myInfoEdit.allRegions') || '전체 지역';
      } else if (countryCode && regionCode !== null && regionCode !== undefined && regionCode > 0) {

        const COUNTRIES_WITH_MAPPING = [82, 81, 86, 1, 62];
        let regionKey: string;

        if (COUNTRIES_WITH_MAPPING.includes(countryCode)) {

          regionKey = `regions.${countryCode}_${regionCode}`;
        } else {

          const regionNameKey = selectedRegion.name
            .replace(/[^a-zA-Z0-9\s]/g, '') 
            .replace(/\s+/g, '_') 
            .toLowerCase();
          regionKey = `regions.${countryCode}_${regionNameKey}`;
        }

        try {
          const translated = t(regionKey);
          if (translated && translated !== regionKey) {
            value = translated;
          } else {

            value = selectedRegion.name;
          }
        } catch (error) {

          value = selectedRegion.name;
        }
      } else {

        value = selectedRegion.name;
      }
    } else {
      value = isKoreaSelected ? (t('screens.countryCodeSelect.selectOption') || '선택') : GLOBAL_REGION.name;
    }
    if (__DEV__) {
      console.log('[회원가입] regionDisplayValue 계산:', {
        selectedRegion,
        selectedRegionName: selectedRegion?.name,
        selectedRegionIso2: selectedRegion?.iso2,
        selectedRegionDialCode: selectedRegion?.dialCode,
        isKoreaSelected,
        isCountryWithRegions,
        value,
      });
    }
    return value;
  }, [selectedRegion, isKoreaSelected, isCountryWithRegions, selectedCountryDialCode, t, i18n.language]);

  React.useEffect(() => {
    const loadRegionsForCountry = async () => {
      if (!selectedCountryDialCode?.countryCode) return;

      setIsLoadingRegions(true);
      try {
        const result: LoadRegionsResult = await loadRegionsFromApi(
          (country: number) => getRegionsByCountry(country, navigate),
          selectedCountryDialCode.countryCode || 0,
          selectedCountryDialCode.iso2, 
          getRegionsByCountryIso2(selectedCountryDialCode.iso2)
        );
        setAvailableRegions(result.regions);
        setHasRegions(result.hasRegions);

        if (result.hasRegions && result.regions.length > 0) {

          if (!keepRegionSelectRef.current) {

          if (selectedRegion && selectedRegion.dialCode !== '0' && selectedRegion.iso2 !== 'select') {
            const isRegionValid = result.regions.some(
              (r) => r.iso2 === selectedRegion.iso2 && r.dialCode === selectedRegion.dialCode
            );
            if (!isRegionValid) {
              console.log('[회원가입] 선택된 지역이 새로운 목록에 없음, 첫 번째 지역으로 변경');
              setSelectedRegion(result.regions[0]);
            } else {
              console.log('[회원가입] 선택된 지역 유지:', selectedRegion.name);
            }
          } else if (!selectedRegion || selectedRegion.iso2 === 'select' || selectedRegion.dialCode === '0') {
            console.log('[회원가입] 지역 자동 선택 건너뜀 (사용자 선택 대기)');
          }
          } else {
            console.log('[회원가입] 지역 "선택" 유지 (목록 로드 후 덮어쓰지 않음)');
          }
        } else {

          setSelectedRegion(GLOBAL_REGION);
        }
      } catch (error) {
        console.error('[회원가입] 지역 목록 로드 실패:', error);
        const fallbackRegions = getRegionsByCountryIso2(selectedCountryDialCode.iso2);
        setAvailableRegions(fallbackRegions);

        setHasRegions(fallbackRegions.length > 0 && fallbackRegions[0].iso2 !== 'global');
      } finally {
        setIsLoadingRegions(false);
      }
    };

    loadRegionsForCountry();

  }, [selectedCountryDialCode, navigate]);

  React.useEffect(() => {
    if (countryModalVisible) {
      const loadCountriesForModal = async () => {
        setIsLoadingCountries(true);
        try {
          const loadedCountries = await loadCountriesFromApi(
            () => getCountries(navigate),
            ALLOWED_COUNTRIES
          );
          setAvailableCountries(loadedCountries);
        } catch (error) {
          console.error('[회원가입] 국가 목록 로드 실패:', error);
          setAvailableCountries(ALLOWED_COUNTRIES);
        } finally {
          setIsLoadingCountries(false);
        }
      };
      loadCountriesForModal();
    }
  }, [countryModalVisible, navigate]);

  useEffect(() => {
    if (!countryModalVisible && !regionModalVisible) {
      setKeyboardHeight(0);
      return;
    }

    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const showSubscription = Keyboard.addListener(showEvent, (event) => {
      setKeyboardHeight(event.endCoordinates.height);
    });

    const hideSubscription = Keyboard.addListener(hideEvent, () => {
      setKeyboardHeight(0);
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, [countryModalVisible, regionModalVisible]);

  const filteredCountries = useMemo(() => {
    if (!countrySearchQuery.trim()) {
      return availableCountries;
    }
    const normalizedQuery = countrySearchQuery.trim().toLowerCase();
    return availableCountries.filter((item) => {

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
  }, [countrySearchQuery, availableCountries, t]);

  const handleSelectCountry = (country: CountryDialCode) => {
    console.log('[회원가입] 국가 선택:', {
      country,
      iso2: country.iso2,
      name: country.name,
      dialCode: country.dialCode,
      countryCode: country.countryCode,
    });
    setSelectedCountryDialCode(country);
    setCountryModalVisible(false);
    setCountrySearchQuery('');
  };

  const selectOption: CountryDialCode = useMemo(() => ({
    iso2: 'select',
    name: t('screens.countryCodeSelect.selectOption') || '선택',
    dialCode: '0',
    flagEmoji: '📍',
    countryCode: 0,
  }), [t]);

  const regionDataSource = useMemo(() => {

    return isOptionalFields ? [selectOption, ...availableRegions] : availableRegions;
  }, [isOptionalFields, selectOption, availableRegions]);

  const filteredRegions = useMemo(() => {
    if (!regionSearchQuery.trim()) {
      return regionDataSource;
    }
    const normalizedQuery = regionSearchQuery.trim().toLowerCase();
    return regionDataSource.filter((item) => {

      const searchName = item.name.toLowerCase();

      const searchIso = item.iso2.toLowerCase();

      let translatedName = '';
      if (item.countryCode && item.dialCode) {
        const regionCode = parseInt(item.dialCode, 10);
        if (!isNaN(regionCode) && regionCode > 0) {
          const COUNTRIES_WITH_MAPPING = [82, 81, 86, 1, 62];
          if (COUNTRIES_WITH_MAPPING.includes(item.countryCode)) {
            const regionKey = `regions.${item.countryCode}_${regionCode}`;
            const translated = t(regionKey);
            if (translated && translated !== regionKey) {
              translatedName = translated.toLowerCase();
            }
          }
        }
      }

      return (
        searchName.includes(normalizedQuery) ||
        translatedName.includes(normalizedQuery) ||
        searchIso.includes(normalizedQuery)
      );
    });
  }, [regionSearchQuery, regionDataSource, t]);

  const handleSelectRegion = (region: CountryDialCode) => {
    console.log('[회원가입] 지역 선택:', {
      region,
      iso2: region.iso2,
      name: region.name,
      dialCode: region.dialCode,
      countryCode: region.countryCode,
    });

    if (region.iso2 === 'select' || region.dialCode === '0') {
      console.log('[회원가입] "선택" 옵션 선택 - null로 설정');
      setSelectedRegion(null);
    } else {
      console.log('[회원가입] 지역 선택:', region.name);
      keepRegionSelectRef.current = false; 
      setSelectedRegion(region);
    }
    setRegionModalVisible(false);
    setRegionSearchQuery('');
  };

  const isMountedRef = React.useRef(false);

  React.useEffect(() => {
    const checkSocialSignupMode = async () => {
      try {

        const googleSignupRequired = await AsyncStorage.getItem('googleSignupRequired');
        if (googleSignupRequired === 'true') {
          setIsGoogleSignupMode(true);
          const googleEmail = await AsyncStorage.getItem('googleSignupEmail');
          if (googleEmail) {
            setEmail(googleEmail);
            console.log('[회원가입] 구글 회원가입 모드, 이메일 자동 입력:', googleEmail);
          }
          return; 
        }

        const appleSignupRequired = await AsyncStorage.getItem('appleSignupRequired');
        if (appleSignupRequired === 'true') {
          setIsAppleSignupMode(true);
          const appleEmail = await AsyncStorage.getItem('appleSignupEmail');
          if (appleEmail) {
            setEmail(appleEmail);
            console.log('[회원가입] 애플 회원가입 모드, 이메일 자동 입력:', appleEmail);
          }

          const appleFullName = await AsyncStorage.getItem('appleSignupFullName');
          const appleGivenName = await AsyncStorage.getItem('appleSignupGivenName');
          const appleFamilyName = await AsyncStorage.getItem('appleSignupFamilyName');

          if (appleFullName || appleGivenName || appleFamilyName) {

            const nameToUse = appleFullName || `${appleFamilyName || ''} ${appleGivenName || ''}`.trim();
            if (nameToUse) {
              setFullName(nameToUse);
              setGivenName(appleGivenName || '');
              setFamilyName(appleFamilyName || '');
              console.log('[회원가입] 애플 회원가입 모드, 이름 자동 입력:', { fullName: nameToUse, givenName: appleGivenName, familyName: appleFamilyName });
            }
          }

          setGender('0');
          setAgeRange('0');

          if (setSelectedRegion) {

            const isInitialValue = !selectedRegion || 
              (selectedRegion.iso2 === '서울' && selectedRegion.countryCode === 82) ||
              (selectedRegion.iso2 === 'global' && selectedRegion.dialCode === '0');

            if (isInitialValue) {
              const selectRegionOption = {
                iso2: 'select',
                name: t('screens.signup.genderSelect') || '선택',
                dialCode: '0',
                flagEmoji: '📍',
                countryCode: 0,
              };
              setSelectedRegion(selectRegionOption);
              console.log('[회원가입] 애플 회원가입 모드, 지역 "선택" 옵션 설정:', selectRegionOption);
            } else {
              console.log('[회원가입] 애플 회원가입 모드 - 이미 지역이 선택되어 있음, 유지:', selectedRegion?.name);
            }
          }
        }

        if ((Platform.OS === 'ios' || Platform.OS === 'android') && appleSignupRequired !== 'true') {
          setGender('0');
          setAgeRange('0');
        }
      } catch (error) {
        console.error('[회원가입] 소셜 회원가입 모드 확인 실패:', error);
      }
    };

    checkSocialSignupMode();
  }, [t]); 

  const keepRegionSelectRef = React.useRef(false);

  const signupRegionInitializedRef = React.useRef(false);
  React.useEffect(() => {
    if (!setSelectedRegion || signupRegionInitializedRef.current) return;

    const isDefaultRegion =
      !selectedRegion ||
      selectedRegion.iso2 === 'select' ||
      selectedRegion.dialCode === '0' ||
      (selectedRegion.iso2 === '서울' && selectedRegion.countryCode === 82) ||
      selectedRegion.iso2 === 'global';
    if (isDefaultRegion) {
      keepRegionSelectRef.current = true;
      setSelectedRegion(selectOption);
    }
    signupRegionInitializedRef.current = true;
    return () => {
      signupRegionInitializedRef.current = false;
      keepRegionSelectRef.current = false;
    };
  }, [selectedRegion, setSelectedRegion, selectOption]);

  const appleRegionInitializedRef = React.useRef(false);
  React.useEffect(() => {

    if (isOptionalFields && setSelectedRegion && !appleRegionInitializedRef.current) {

      if (!selectedRegion || (selectedRegion.iso2 !== 'select' && selectedRegion.dialCode !== '0')) {

        const isContextInitialValue = selectedRegion && (
          (selectedRegion.iso2 === '서울' && selectedRegion.countryCode === 82) || 
          selectedRegion.iso2 === 'global' ||
          (!selectedRegion.countryCode && selectedRegion.dialCode !== '0' && selectedRegion.iso2 !== 'select')
        );

        if (isContextInitialValue || !selectedRegion) {
          setSelectedRegion(selectOption);
          appleRegionInitializedRef.current = true;
        } else {
          appleRegionInitializedRef.current = true;
        }
      } else {
        appleRegionInitializedRef.current = true;
      }
    }
  }, [isOptionalFields, selectedRegion, setSelectedRegion, selectOption, t]);

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

        if (!isGoogleSignupMode && !isAppleSignupMode) {
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

      setGender(isOptionalFields ? (signupFormData.gender || '0') : (signupFormData.gender || 'male'));
      setAgeRange(isOptionalFields ? (signupFormData.ageRange || '0') : (signupFormData.ageRange || '10'));

      setServiceTermsAccepted(false);
      setLocationTermsAccepted(false);
      setPrivacyTermsAccepted(false);
      isMountedRef.current = true;
    }
  }, [signupFormData, isGoogleSignupMode, isAppleSignupMode, isOptionalFields]);

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

    if (!isAppleSignupMode) {
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
    }

    if (!isOptionalFields) {
      if (!phoneNumber.trim()) {
        await showAlert(t('screens.signup.alerts.inputError'), t('screens.signup.errors.phoneRequired'));
        return;
      }
      if (hasRegions && isKoreaSelected && (!selectedRegion || selectedRegion.dialCode === '0')) {
        await showAlert(t('screens.signup.alerts.inputError'), t('screens.signup.errors.regionRequired'));
        return;
      }
      if (!gender || gender === '0') {
        await showAlert(t('screens.signup.alerts.inputError'), t('screens.signup.errors.genderRequired') || '성별을 선택해주세요.');
        return;
      }
      if (!ageRange || ageRange === '0') {
        await showAlert(t('screens.signup.alerts.inputError'), t('screens.signup.errors.ageRequired') || '연령대를 선택해주세요.');
        return;
      }
    }

    if (!allTermsAccepted) {
      await showAlert(t('screens.signup.alerts.termsRequired'), t('screens.signup.errors.termsRequired'));
      return;
    }

    setIsSubmitting(true);

    try {

      if (!isGoogleSignupMode && !isAppleSignupMode) {
        console.log('[회원가입] 1단계: 이메일 중복 확인 시작');
        const isEmailAvailable = await checkEmailAvailability(email.trim(), navigate);

        if (!isEmailAvailable) {
          await showAlert(t('screens.signup.alerts.emailDuplicate'), t('screens.signup.errors.emailDuplicate'));
          setIsSubmitting(false);
          return;
        }
      } else {
        console.log('[회원가입] 소셜 회원가입 모드 - 이메일 중복 확인 스킵');
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
        const title = t('screens.signup.alerts.referralEmpty');
        const message = t('screens.signup.errors.referralEmpty');
        const button1Text = t('screens.signup.alerts.inputReferral');
        const button2Text = t('screens.signup.alerts.confirm');

        console.log('[회원가입] 알림 파라미터:', { title, message, button1Text, button2Text });

        try {
          const buttonIndex = await showAlert(
            title,
            message,
            [
              {
                text: button1Text,
                style: 'cancel',
                onPress: () => {
                  console.log('[회원가입] 입력하기 버튼 클릭');
                  setIsSubmitting(false);
                },
              },
              {
                text: button2Text,
                onPress: () => {
                  console.log('[회원가입] 확인 버튼 클릭');

                },
              },
            ],
          );

          console.log('[회원가입] 알림 버튼 인덱스:', buttonIndex);

          if (buttonIndex === 0) {
            console.log('[회원가입] 입력하기 선택 - 회원가입 중단');
            return;
          }

          console.log('[회원가입] 확인 선택 - 계속 진행');
        } catch (error) {
          console.error('[회원가입] 알림 표시 오류:', error);

        }
      }

      if (isAppleSignupMode) {
        console.log('[회원가입] 애플 회원가입 모드 - 이메일 인증 건너뛰고 바로 회원가입 진행');

        try {

          const mobileCode = parseInt(selectedCountryDialCode.dialCode.replace('+', ''), 10) || 82;
          const countryCode = selectedCountryDialCode.iso2 || 'KR';

          const regionId = hasRegions && selectedRegion
            ? parseInt(selectedRegion.dialCode, 10) || 0
            : 0;

          const signupData = {
            email: email.trim(),
            pin: '', 
            firstname: parsedGivenName.trim(),
            lastname: parsedFamilyName.trim() || '',
            gender: SignupHelpers.getGenderCode(gender || '0'),
            mobile: phoneNumber.trim() || '',
            mobilecode: mobileCode,
            countrycode: countryCode,
            country: mobileCode,
            region: regionId,
            age: SignupHelpers.getAgeCode(ageRange || '0'),
            recommand: referralMemberId || 0,
            os: SignupHelpers.getOSCode(),
            social_code: 2052, 
          };

          console.log('[회원가입] 애플 회원가입 API 호출 시작');

          let signupSuccess = false;
          try {
            signupSuccess = await signup(signupData, navigate);
          } catch (signupError) {

            if (signupError instanceof AxiosError && signupError.response?.status === 409) {
              console.log('[회원가입] 이미 사용중인 이메일 (409) - 애플 로그인으로 로그인 안내');
              await showAlert(
                t('screens.signup.alerts.emailDuplicate') || '이미 가입된 이메일',
                t('screens.signup.errors.emailDuplicate') || '이미 가입된 이메일입니다. 애플 로그인으로 로그인해주세요.',
                [
                  {
                    text: t('screens.signup.success.confirm') || '확인',
                    onPress: () => {
                      reset(ROUTES.authLanding);
                      navigate(ROUTES.login);
                    },
                  },
                ],
              );
              setIsSubmitting(false);
              return;
            }
            throw signupError;
          }

          if (!signupSuccess) {
            await showAlert(
              t('screens.signup.alerts.signupFailed') || '회원가입 실패',
              t('screens.signup.errors.signupFailed') || '회원가입에 실패했습니다. 다시 시도해주세요.',
            );
            setIsSubmitting(false);
            return;
          }

          await AsyncStorage.setItem('appleSignupCompleted', 'true');
          await AsyncStorage.setItem('appleSignupCompletedEmail', email.trim());
          console.log('[회원가입] 애플 회원가입 완료 플래그 저장:', email.trim());

          await AsyncStorage.removeItem('appleSignupRequired');
          await AsyncStorage.removeItem('appleSignupEmail');

          console.log('[회원가입] 애플 회원가입 완료 - 자동 로그인 시작');

          const appleLoginResult = await signInWithApple(navigate);

          if (!appleLoginResult.success || !appleLoginResult.data) {
            console.error('[회원가입] 애플 자동 로그인 실패:', appleLoginResult.message);
            await showAlert(
              t('screens.signup.alerts.error') || '오류',
              t('screens.signup.errors.autoLoginFailed') || '회원가입은 완료되었지만 자동 로그인에 실패했습니다. 로그인 화면에서 다시 시도해주세요.',
              [
                {
                  text: t('screens.signup.success.confirm') || '확인',
                  onPress: () => {
                    reset(ROUTES.authLanding);
                    navigate(ROUTES.login);
                  },
                },
              ],
            );
            setIsSubmitting(false);
            return;
          }

          const { memberId, email: loginEmail, name, accessToken, refreshToken } = appleLoginResult.data;

          console.log('[회원가입] 애플 자동 로그인 성공:', { memberId, email: loginEmail });

          const userData = {
            member: memberId,
            email: loginEmail,
            firstname: name ? (name.split(' ')[0] || name) : '',
            lastname: name ? name.split(' ').slice(1).join(' ') : '',
            extrastr: accessToken || '',
          };

          if (accessToken && memberId) {
            const ssidw = encryptSHA256(accessToken);
            const sessionSaved = await saveSession(memberId, ssidw, navigate);
            if (!sessionSaved) {
              console.warn('[회원가입] 세션 저장 실패');
            }
          }

          await AsyncStorage.removeItem('userData');
          await AsyncStorage.removeItem('userSessionToken');
          await AsyncStorage.setItem('userEmail', loginEmail);
          await AsyncStorage.setItem('userData', JSON.stringify(userData));
          await AsyncStorage.setItem('userSessionToken', accessToken || '');
          await AsyncStorage.setItem('isLoggedIn', 'true');
          await AsyncStorage.setItem('rememberMe', 'true');
          await AsyncStorage.setItem('loginType', 'apple');

          if (refreshToken) {
            await AsyncStorage.setItem('refreshToken', refreshToken);
          }

          console.log('[회원가입] 애플 자동 로그인 완료 - 맵 페이지로 이동');

          setIsSubmitting(false);
          reset(ROUTES.map);
          return;
        } catch (error: any) {
          console.error('[회원가입] 애플 회원가입 처리 중 오류:', error);
          await showAlert(
            t('screens.signup.alerts.error'),
            t('screens.signup.errors.error') || '회원가입 처리 중 오류가 발생했습니다. 다시 시도해주세요.',
          );
          setIsSubmitting(false);
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
          hasRegions: hasRegions,
          referralMemberId: referralMemberId,
          gender: gender,
          ageRange: ageRange,
          isAppleSignupMode: false,
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

  const handleBackPress = async () => {

    console.log('[회원가입] 뒤로가기 (구글 회원가입 모드:', isGoogleSignupMode, ', 애플 회원가입 모드:', isAppleSignupMode, ')');

    if (isGoogleSignupMode || isAppleSignupMode) {

      await AsyncStorage.removeItem('googleSignupRequired');
      await AsyncStorage.removeItem('googleSignupEmail');
      await AsyncStorage.removeItem('appleSignupRequired');
      await AsyncStorage.removeItem('appleSignupEmail');
      navigate(ROUTES.login);
    } else {

      goBack();
    }
  };

  return (
    <View style={styles.container}>
        <Header
          title={isGoogleSignupMode ? '구글 회원가입' : isAppleSignupMode ? '애플 회원가입' : t('screens.signup.title')}
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
            editable={!isGoogleSignupMode && !isAppleSignupMode}
          />

          {}
          {!isAppleSignupMode && (
            <>
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
            </>
          )}

          <FormField
            containerStyle={styles.fieldContainer}
            label={isOptionalFields ? `${t('screens.signup.phoneNumberLabel')} (${t('screens.signup.optional') || '선택사항'})` : t('screens.signup.phoneNumberLabel')}
            placeholder={t('screens.signup.phoneNumberPlaceholder')}
            keyboardType="phone-pad"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            leftAccessory={
              <TouchableOpacity
                style={styles.phonePrefix}
                onPress={() => {
                  setCountryModalVisible(true);
                }}
                activeOpacity={0.7}
              >
                <Text style={styles.flagEmoji}>{selectedCountryDialCode.flagEmoji}</Text>
                <Text style={styles.countryCode}>{selectedCountryDialCode.dialCode}</Text>
              </TouchableOpacity>
            }
          />

          {}
          {isCountryWithRegions && (
            <View style={styles.fieldContainer}>
              <FormField
                label={isOptionalFields ? `${t('screens.signup.regionLabel')} (${t('screens.signup.optional') || '선택사항'})` : t('screens.signup.regionLabel')}
                placeholder={t('screens.signup.regionPlaceholder')}
                value={regionDisplayValue}
                editable={false}
                showDisabledStyle={false}
                onPress={() => {

                  if (!hasRegions || isSubmitting) {
                    return;
                  }
                  setRegionModalVisible(true);
                }}
              />
            </View>
          )}

          <View style={styles.fieldContainer}>
            <Text style={styles.label}>
              {isOptionalFields 
                ? `${t('screens.signup.genderLabel')} (${t('screens.signup.optional') || '선택사항'})`
                : t('screens.signup.genderLabel')}
            </Text>
            <View style={[styles.inlineOptions]}>
              {React.useMemo(() => {
                const selectOption = { value: '0' as const, label: t('screens.signup.genderSelect') || '선택' };
                const maleOption = { value: 'male' as const, label: t('screens.signup.genderMale') };
                const femaleOption = { value: 'female' as const, label: t('screens.signup.genderFemale') };

                return isOptionalFields
                  ? [selectOption, maleOption, femaleOption]
                  : [maleOption, femaleOption];
              }, [isOptionalFields, t]).map((option) => {
                const isActive = gender === option.value;
                return (
                  <OptionButton
                    key={option.value}
                    label={option.value === '0' ? (t('screens.signup.genderSelect') || '선택') : option.label}
                    selected={isActive}
                    onPress={() => setGender(option.value)}
                  />
                );
              })}
            </View>
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.label}>
              {isOptionalFields 
                ? `${t('screens.signup.ageLabel')} (${t('screens.signup.optional') || '선택사항'})`
                : t('screens.signup.ageLabel')}
            </Text>
            <View style={[styles.inlineOptions]}>
              {React.useMemo(() => {
                return isOptionalFields 
                  ? AGE_OPTIONS 
                  : AGE_OPTIONS.filter(option => option !== '0');
              }, [isOptionalFields]).map((option, index, array) => {
                const isActive = ageRange === option;
                const isLast = index === array.length - 1;
                return (
                  <OptionButton
                    key={option}
                    label={option === '0' ? (t('screens.signup.ageSelect') || '선택') : option}
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
                {t('screens.countryCodeSelect.countrySelectTitle') || '국가 선택'}
              </Text>
              <TouchableOpacity
                onPress={() => {
                  setCountryModalVisible(false);
                  setCountrySearchQuery('');
                }}
              >
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
                renderItem={({ item }) => (
                  <CountryCodeListItem
                    country={item}
                    isSelected={item.iso2 === selectedCountryDialCode?.iso2 && item.dialCode === selectedCountryDialCode?.dialCode}
                    onPress={handleSelectCountry}
                    hideDialCode={false}
                  />
                )}
                contentContainerStyle={styles.modalListContent}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                ListEmptyComponent={
                  <View style={styles.modalEmptyState}>
                    <Text style={styles.modalEmptyText}>
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
            onPress={() => {
              setRegionModalVisible(false);
              setRegionSearchQuery('');
            }}
          />
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {t('screens.countryCodeSelect.regionSelectTitle') || '지역 선택'}
              </Text>
              <TouchableOpacity
                onPress={() => {
                  setRegionModalVisible(false);
                  setRegionSearchQuery('');
                }}
              >
                <Text style={styles.modalCloseButton}>✕</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.modalSearchBox}>
              <Ionicons name="search" size={18} color="#9ca3af" />
              <TextInput
                style={styles.modalSearchInput}
                value={regionSearchQuery}
                onChangeText={setRegionSearchQuery}
                placeholder={t('screens.countryCodeSelect.regionSearchPlaceholder') || '지역 검색'}
                placeholderTextColor="#c4c7d1"
                autoCorrect={false}
              />
            </View>
            {isLoadingRegions ? (
              <View style={styles.modalLoadingContainer}>
                <ActivityIndicator size="large" color={COLORS.buttonPrimary} />
              </View>
            ) : (
              <FlatList
                data={filteredRegions}
                keyExtractor={(item, index) => `${item.iso2}-${item.dialCode}-${item.name}-${index}`}
                renderItem={({ item }) => (
                  <CountryCodeListItem
                    country={item}
                    isSelected={item.iso2 === selectedRegion?.iso2 && item.dialCode === selectedRegion?.dialCode}
                    onPress={handleSelectRegion}
                    hideDialCode={true}
                  />
                )}
                contentContainerStyle={styles.modalListContent}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                ListEmptyComponent={
                  <View style={styles.modalEmptyState}>
                    <Text style={styles.modalEmptyText}>
                      {t('screens.countryCodeSelect.noResults') || '검색 결과가 없습니다.'}
                    </Text>
                  </View>
                }
              />
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalBackdrop: {
    flex: 1,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: Dimensions.get('window').height * 0.8,
    minHeight: Dimensions.get('window').height * 0.6,
    maxHeight: Dimensions.get('window').height * 0.8,
    paddingBottom: Platform.OS === 'ios' ? 34 : 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  modalTitle: {
    fontSize: FONTS.size.large,
    fontFamily: 'Roboto-Bold',
    color: COLORS.headerText,
  },
  modalCloseButton: {
    fontSize: 24,
    color: '#8e9bae',
    lineHeight: 24,
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
  modalListContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  modalEmptyState: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  modalEmptyText: {
    fontSize: FONTS.size.medium,
    fontFamily: 'Roboto-Regular',
    color: '#8e9bae',
  },
  modalLoadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
});

