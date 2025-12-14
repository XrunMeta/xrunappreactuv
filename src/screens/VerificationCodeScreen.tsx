import React, { useEffect, useMemo, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Header, PrimaryButton, SafeScrollView } from '../components';
import { COLORS, COMMON_STYLES, FONTS, getRegionIdByIso2, GLOBAL_REGION } from '../constants';
import { ROUTES, useAppNavigation } from '../navigation';
import { useAppContext } from '../context';
import { useAlertDialog } from '../context/AlertDialogContext';
import {
  verifyEmailCode,
  loginWithEmailAuth,
  encryptSHA256,
  saveSession,
  sendEmailVerificationCode,
  signup,
  checkLogin,
  SignupHelpers,
} from '../services';

const CODE_LENGTH = 6;
const RESEND_SECONDS = 300;

export const VerificationCodeScreen = () => {
  const { t } = useTranslation();
  const { goBack, reset, navigate } = useAppNavigation();
  const { showAlert } = useAlertDialog();
  const {
    verificationSuccessRoute,
    resetVerificationSuccessRoute,
    verificationEmail,
  } = useAppContext();
  const [code, setCode] = useState('');
  const [secondsLeft, setSecondsLeft] = useState(RESEND_SECONDS);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const hiddenInputRef = useRef<TextInput>(null);

  useEffect(() => {
    if (secondsLeft <= 0) {
      return;
    }
    const timer = setInterval(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearInterval(timer);
  }, [secondsLeft]);

  const formattedTimer = useMemo(() => {
    const minutes = Math.floor(secondsLeft / 60)
      .toString()
      .padStart(2, '0');
    const seconds = (secondsLeft % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
  }, [secondsLeft]);

  const handleVerify = async () => {
    if (!verificationEmail) {
      await showAlert(t('screens.verificationCode.alerts.error'), t('screens.verificationCode.errors.emailNotFound'));
      return;
    }

    if (code.length !== CODE_LENGTH) {
      await showAlert(t('screens.verificationCode.alerts.codeInput'), t('screens.verificationCode.errors.codeRequired'));
      return;
    }

    setIsVerifying(true);

    try {

      console.log('[인증] 이메일 인증 코드 확인 요청:', verificationEmail);
      const codeVerified = await verifyEmailCode(verificationEmail, code, navigate);

      if (!codeVerified) {
        await showAlert(t('screens.verificationCode.alerts.verificationFailed'), t('screens.verificationCode.errors.verificationFailed'));
        setIsVerifying(false);
        return;
      }

      if (verificationSuccessRoute === ROUTES.signup) {

        console.log('[회원가입] 이메일 인증 완료 - 회원가입 진행');

        const googleSignupRequired = await AsyncStorage.getItem('googleSignupRequired');
        const isGoogleSignupMode = googleSignupRequired === 'true';
        console.log('[회원가입] 구글 회원가입 모드:', isGoogleSignupMode);

        try {

          const pendingDataStr = await AsyncStorage.getItem('pendingSignupData');
          if (!pendingDataStr) {
            await showAlert(
              t('screens.verificationCode.alerts.error'),
              t('screens.verificationCode.errors.error') || '회원가입 데이터를 찾을 수 없습니다.',
            );
            setIsVerifying(false);
            return;
          }

          const pendingData = JSON.parse(pendingDataStr);
          console.log('[회원가입] AsyncStorage에서 회원가입 데이터 읽기 완료');

          const mobileCode = parseInt(pendingData.selectedCountryDialCode.dialCode.replace('+', ''), 10) || 82;
          const countryCode = pendingData.selectedCountryDialCode.iso2 || 'KR';
          const regionId = pendingData.selectedRegion
            ? getRegionIdByIso2(pendingData.selectedRegion.iso2)
            : parseInt(GLOBAL_REGION.dialCode, 10);

          const signupData = {
            email: pendingData.email,
            pin: pendingData.password,
            firstname: pendingData.givenName,
            lastname: pendingData.familyName?.trim() || '', 
            gender: SignupHelpers.getGenderCode(pendingData.gender),
            mobile: pendingData.phoneNumber,
            mobilecode: mobileCode,
            countrycode: countryCode,
            country: mobileCode,
            region: regionId,
            age: SignupHelpers.getAgeCode(pendingData.ageRange),
            recommand: pendingData.referralMemberId,
            os: SignupHelpers.getOSCode(),
          };

          console.log('[회원가입] 회원가입 API 호출 시작', {
            isGoogleSignupMode,
            email: signupData.email,
            firstname: signupData.firstname,
            mobile: signupData.mobile,
          });
          const signupSuccess = await signup(signupData, navigate);

          if (!signupSuccess) {

            await AsyncStorage.removeItem('pendingSignupData');
            await showAlert(
              t('screens.signup.alerts.signupFailed') || '회원가입 실패',
              t('screens.signup.errors.signupFailed') || '회원가입에 실패했습니다. 다시 시도해주세요.',
            );
            resetVerificationSuccessRoute();
            setIsVerifying(false);
            return;
          }

          console.log('[회원가입] 로그인 확인 시작');
          const loginSuccess = await checkLogin(pendingData.email, pendingData.password, navigate);

          if (!loginSuccess) {
            await showAlert(
              t('screens.signup.alerts.loginCheckFailed') || '로그인 확인 실패',
              t('screens.signup.errors.loginCheckFailed') || '회원가입은 완료되었지만 로그인 확인에 실패했습니다. 로그인 화면에서 다시 시도해주세요.',
            );

            await AsyncStorage.removeItem('pendingSignupData');
            resetVerificationSuccessRoute();
            reset(ROUTES.authLanding);
            navigate(ROUTES.login);
            setIsVerifying(false);
            return;
          }

          await AsyncStorage.removeItem('pendingSignupData');

          try {
            await AsyncStorage.removeItem('googleSignupRequired');
            await AsyncStorage.removeItem('googleSignupEmail');
            console.log('[회원가입] 구글 회원가입 플래그 제거 완료');
          } catch (flagError) {
            console.warn('[회원가입] 구글 회원가입 플래그 제거 실패 (일반 회원가입일 수 있음):', flagError);
          }

          console.log('[회원가입] 회원가입 및 로그인 확인 성공');

          resetVerificationSuccessRoute();
          await showAlert(
            t('screens.signup.success.title') || '회원가입 완료',
            t('screens.signup.success.message') || '회원가입이 완료되었습니다.',
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
        } catch (error) {
          console.error('[회원가입] 회원가입 처리 중 오류:', error);
          await showAlert(
            t('screens.signup.alerts.error') || '오류',
            t('screens.signup.errors.error') || '회원가입 중 오류가 발생했습니다.',
          );

          try {
            await AsyncStorage.removeItem('pendingSignupData');
          } catch (storageError) {
            console.error('[회원가입] AsyncStorage 정리 실패:', storageError);
          }
        } finally {
          setIsVerifying(false);
        }
        return;
      }

      if (verificationSuccessRoute === ROUTES.login || verificationSuccessRoute === ROUTES.map) {

        console.log('[로그인] 이메일 로그인 요청:', verificationEmail);
        const loginResponse = await loginWithEmailAuth(verificationEmail, navigate);

        if (loginResponse.status !== 'success') {
          await showAlert(t('screens.verificationCode.alerts.loginFailed'), t('screens.verificationCode.errors.loginFailed'));
          setIsVerifying(false);
          return;
        }

        const userData = loginResponse.data[0];
        if (!userData || !userData.member) {
          await showAlert(t('screens.verificationCode.alerts.loginFailed'), t('screens.verificationCode.errors.userDataNotFound'));
          setIsVerifying(false);
          return;
        }

        const extrastr = userData.extrastr;
        if (extrastr) {
          const ssidw = encryptSHA256(extrastr);
          const sessionSaved = await saveSession(userData.member, ssidw, navigate);
          if (!sessionSaved) {
            console.warn('[로그인] 세션 저장 실패');
          }
        }

        await AsyncStorage.removeItem('userData');
        await AsyncStorage.removeItem('userSessionToken');
        await AsyncStorage.setItem('userEmail', verificationEmail);
        await AsyncStorage.setItem('userData', JSON.stringify(userData));
        const sessionToken = userData.extrastr || '';
        await AsyncStorage.setItem('userSessionToken', sessionToken);
        await AsyncStorage.setItem('isLoggedIn', 'true');

        const otpRememberMeTemp = await AsyncStorage.getItem('otpRememberMeTemp');
        if (otpRememberMeTemp === 'true') {
          await AsyncStorage.setItem('rememberMe', 'true');
          console.log('[로그인] OTP 로그인 상태 유지 저장 완료');
        } else {
          await AsyncStorage.removeItem('rememberMe');
          console.log('[로그인] OTP 로그인 상태 유지 해제');
        }

        await AsyncStorage.removeItem('otpRememberMeTemp');

        console.log('[로그인] 이메일 인증 로그인 성공');

        resetVerificationSuccessRoute();
        reset(verificationSuccessRoute || ROUTES.map);
      } else {

        console.log('[정보수정] 인증 코드 확인 성공');
        resetVerificationSuccessRoute();
        reset(verificationSuccessRoute);
      }
    } catch (error) {
      console.error('[인증] 인증 코드 확인 오류:', error);

      if (verificationSuccessRoute === ROUTES.signup) {
        try {
          await AsyncStorage.removeItem('pendingSignupData');
          console.log('[인증] 에러 발생으로 인한 AsyncStorage 정리 완료 (회원가입 모드)');
        } catch (storageError) {
          console.error('[인증] AsyncStorage 정리 실패:', storageError);
        }
      }

      await showAlert(t('screens.verificationCode.alerts.error'), t('screens.verificationCode.errors.error'));
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResend = async () => {
    if (!verificationEmail) {
      await showAlert(t('screens.verificationCode.alerts.error'), t('screens.verificationCode.errors.emailNotFound'));
      return;
    }

    setIsResending(true);

    try {
      console.log('[인증] 이메일 인증 코드 재전송 요청:', verificationEmail);
      const codeSent = await sendEmailVerificationCode(verificationEmail, navigate);

      if (codeSent) {
        setSecondsLeft(RESEND_SECONDS);
        setCode('');
        await showAlert(t('screens.verificationCode.alerts.resendComplete'), t('screens.verificationCode.success.resendComplete'));
      } else {
        await showAlert(t('screens.verificationCode.alerts.resendFailed'), t('screens.verificationCode.errors.resendFailed'));
      }
    } catch (error) {
      console.error('[인증] 인증 코드 재전송 오류:', error);
      await showAlert(t('screens.verificationCode.alerts.error'), t('screens.verificationCode.errors.resendError'));
    } finally {
      setIsResending(false);
    }
  };

  return (
    <View style={styles.container}>
      <Header title={t('screens.verificationCode.title')} onBackPress={goBack} showBackButton />
      <SafeScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.descriptionWrapper}>
          <Text style={styles.description}>
            {verificationEmail || '이메일'}{t('screens.verificationCode.description')}
          </Text>
        </View>

        <View style={styles.codeRow}>
          {Array.from({ length: CODE_LENGTH }).map((_, index) => {
            const digit = code[index] ?? '';
            return (
              <TouchableOpacity
                key={index}
                style={styles.codeBox}
                onPress={() => {

                  hiddenInputRef.current?.focus();
                }}
                activeOpacity={0.7}
              >
                <Text style={styles.codeText}>{digit}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {}
        <TextInput
          ref={hiddenInputRef}
          value={code}
          onChangeText={setCode}
          keyboardType="number-pad"
          maxLength={CODE_LENGTH}
          style={styles.hiddenInput}
          autoFocus={false}
        />

        <TouchableOpacity
          style={styles.resendWrapper}
          onPress={secondsLeft <= 0 && !isResending ? handleResend : undefined}
          activeOpacity={secondsLeft <= 0 && !isResending ? 0.7 : 1}
          disabled={secondsLeft > 0 || isResending}
        >
          {isResending ? (
            <ActivityIndicator size="small" color="#2873ff" />
          ) : (
            <Text style={styles.resendText}>
              {t('screens.verificationCode.resendCode')}{' '}
              {secondsLeft > 0 && (
                <Text style={styles.resendTimer} numberOfLines={1}>
                  {formattedTimer}
                </Text>
              )}
            </Text>
          )}
        </TouchableOpacity>

        <View style={styles.buttonWrapper}>
          {isVerifying ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color={COLORS.buttonPrimary} />
            </View>
          ) : (
            <PrimaryButton
              title={t('screens.verificationCode.verifyButton')}
              onPress={handleVerify}
              fullWidth
              disabled={code.length !== CODE_LENGTH || isVerifying}
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
  descriptionWrapper: {
    width: '100%',
    maxWidth: 327,
    alignSelf: 'center',
    marginBottom: 24,
  },
  description: {
    fontSize: FONTS.size.msmall,
    lineHeight: 24,
    color: '#747474',
    fontFamily: 'Roboto-Regular',
  },
  codeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    maxWidth: 327,
    alignSelf: 'center',
    marginBottom: 24,
  },
  codeBox: {
    width: 45,
    height: 50,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#dedede',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  codeText: {
    fontSize: FONTS.size.large,
    fontFamily: 'Roboto-Bold',
    color: COLORS.headerText,
  },
  resendWrapper: {
    alignItems: 'center',
    marginBottom: 24,
  },
  resendText: {
    fontSize: FONTS.size.medium,
    lineHeight: 24,
    color: COLORS.headerText,
    fontFamily: 'Roboto-Medium',
  },
  resendTimer: {
    color: '#2873ff',
    fontFamily: 'Roboto-Medium',
  },
  buttonWrapper: {
    width: '100%',
    maxWidth: 780,
    alignSelf: 'center',
    marginBottom: 32,
  },

  loadingContainer: {
    height: 56,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  hiddenInput: {
    position: 'absolute',
    width: 0,
    height: 0,
    opacity: 0,
  },
});