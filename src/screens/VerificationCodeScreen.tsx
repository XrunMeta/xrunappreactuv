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
  getGoogleIdToken,
  loginWithGoogleIdToken,
} from '../services';
import { signInWithApple } from '../services/appleAuth';
import { AxiosError } from 'axios';
import { TUTORIAL_PENDING_KEY, TUTORIAL_COMPLETED_KEY } from './walletKeyTutorialHelpers';

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
        const appleSignupRequired = await AsyncStorage.getItem('appleSignupRequired');
        const isGoogleSignupMode = googleSignupRequired === 'true';
        const isAppleSignupMode = appleSignupRequired === 'true';
        console.log('[회원가입] 구글 회원가입 모드:', isGoogleSignupMode, ', 애플 회원가입 모드:', isAppleSignupMode);

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

          const hasRegions = pendingData.hasRegions !== false; 
          const regionId = hasRegions && pendingData.selectedRegion
            ? parseInt(pendingData.selectedRegion.dialCode, 10) || 0
            : 0;

          const signupData = {
            email: pendingData.email,
            pin: isAppleSignupMode ? '' : (pendingData.password || ''), 
            firstname: pendingData.givenName,
            lastname: pendingData.familyName?.trim() || '', 
            gender: SignupHelpers.getGenderCode(pendingData.gender || '0'),
            mobile: pendingData.phoneNumber || '', 
            mobilecode: mobileCode,
            countrycode: countryCode,
            country: mobileCode,
            region: regionId,
            age: SignupHelpers.getAgeCode(pendingData.ageRange || '0'),
            recommand: pendingData.referralMemberId || 0,
            os: SignupHelpers.getOSCode(),
            social_code: isAppleSignupMode ? 2052 : (isGoogleSignupMode ? 2051 : undefined), 

            agree_service: !!pendingData.agree_service,
            agree_location: !!pendingData.agree_location,
            agree_privacy: !!pendingData.agree_privacy,
          };

          console.log('[회원가입] 회원가입 API 호출 시작', {
            isGoogleSignupMode,
            email: signupData.email,
            firstname: signupData.firstname,
            mobile: signupData.mobile,
          });

          let signupSuccess = false;
          try {
            signupSuccess = await signup(signupData, navigate);
          } catch (signupError) {

            if (signupError instanceof AxiosError && signupError.response?.status === 409) {
              console.log('[회원가입] 이미 사용중인 이메일 (409) - 회원가입이 이미 완료된 것으로 간주, 로그인 화면으로 이동');

              await AsyncStorage.removeItem('pendingSignupData');

              try {
                await AsyncStorage.removeItem('googleSignupRequired');
                await AsyncStorage.removeItem('googleSignupEmail');
                await AsyncStorage.removeItem('appleSignupRequired');
                await AsyncStorage.removeItem('appleSignupEmail');
              } catch (flagError) {
                console.warn('[회원가입] 소셜 회원가입 플래그 제거 실패:', flagError);
              }

              if (isAppleSignupMode) {
                await AsyncStorage.setItem('appleSignupCompleted', 'true');
                await AsyncStorage.setItem('appleSignupCompletedEmail', pendingData.email);
                console.log('[회원가입] 애플 회원가입 완료 플래그 저장 (409 에러):', pendingData.email);
              }

              resetVerificationSuccessRoute();

              if (isAppleSignupMode) {
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
              } else {
                await showAlert(
                  t('screens.signup.alerts.emailDuplicate') || '이미 가입된 이메일',
                  t('screens.signup.errors.emailDuplicate') || '이미 가입된 이메일입니다. 로그인 화면에서 로그인해주세요.',
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
              }
              setIsVerifying(false);
              return;
            }

            throw signupError;
          }

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

          if (!isAppleSignupMode) {
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
          } else {
            console.log('[회원가입] 애플 회원가입 모드 - 로그인 확인 건너뛰기 (애플 로그인으로 직접 로그인 필요)');
          }

          await AsyncStorage.removeItem('pendingSignupData');

          if (isAppleSignupMode) {
            await AsyncStorage.setItem('appleSignupCompleted', 'true');
            await AsyncStorage.setItem('appleSignupCompletedEmail', pendingData.email);
            console.log('[회원가입] 애플 회원가입 완료 플래그 저장:', pendingData.email);
          }

          try {
            await AsyncStorage.removeItem('googleSignupRequired');
            await AsyncStorage.removeItem('googleSignupEmail');
            await AsyncStorage.removeItem('appleSignupRequired');
            await AsyncStorage.removeItem('appleSignupEmail');
            console.log('[회원가입] 소셜 회원가입 플래그 제거 완료');
          } catch (flagError) {
            console.warn('[회원가입] 소셜 회원가입 플래그 제거 실패 (일반 회원가입일 수 있음):', flagError);
          }

          console.log('[회원가입] 회원가입 및 로그인 확인 성공');

          try {
            const { logEvent, XRUN_EVENTS } = await import('../services/analytics');
            const method = isAppleSignupMode ? 'apple' : isGoogleSignupMode ? 'google' : 'email';
            logEvent(XRUN_EVENTS.SIGN_UP, { method });
            const referralFromStorage = await AsyncStorage.getItem('signupReferralEmail');
            if (referralFromStorage?.trim()) {
              logEvent(XRUN_EVENTS.REFERRAL_SIGNUP_COMPLETED, { method });
            }
          } catch {  }

          try {
            await AsyncStorage.removeItem(TUTORIAL_COMPLETED_KEY);
            await AsyncStorage.setItem(TUTORIAL_PENDING_KEY, 'true');
          } catch (e) {
            console.warn('[회원가입] 튜토리얼 pending 플래그 저장 실패:', e);
          }

          resetVerificationSuccessRoute();

          if (isAppleSignupMode) {

            console.log('[회원가입] 애플 회원가입 완료 - 자동 로그인 시작');

            try {

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
                setIsVerifying(false);
                return;
              }

              const { memberId, email, name, accessToken, refreshToken } = appleLoginResult.data;

              console.log('[회원가입] 애플 자동 로그인 성공:', { memberId, email });

              const userData = {
                member: memberId,
                email: email,
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
              await AsyncStorage.setItem('userEmail', email);
              await AsyncStorage.setItem('userData', JSON.stringify(userData));
              await AsyncStorage.setItem('userSessionToken', accessToken || '');
              await AsyncStorage.setItem('isLoggedIn', 'true');
              await AsyncStorage.setItem('rememberMe', 'true');
              await AsyncStorage.setItem('loginType', 'apple');

              if (refreshToken) {
                await AsyncStorage.setItem('refreshToken', refreshToken);
              }

              console.log('[회원가입] 애플 자동 로그인 완료 - 맵 페이지로 이동');

              reset(ROUTES.map);
            } catch (autoLoginError) {
              console.error('[회원가입] 애플 자동 로그인 중 오류:', autoLoginError);

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
            }
          } else {
            const isGmail = (pendingData.email || '').toLowerCase().includes('@gmail.com');
            if (isGmail) {

              const signupEmailLower = (pendingData.email || '').trim().toLowerCase();
              while (true) {
                const result = await getGoogleIdToken();
                if (!result) {
                  await showAlert(
                    t('screens.verificationCode.gmailGoogleLogin.title') || '구글 로그인 안내',
                    t('screens.verificationCode.gmailGoogleLogin.message') || 'Gmail 계정은 Google 로그인으로 연동하면 다음부터 간편 로그인할 수 있어요.',
                    [{ text: t('screens.verificationCode.gmailGoogleLogin.button') || '구글 로그인', onPress: () => {} }],
                  );
                  continue;
                }

                if (result.email && signupEmailLower && result.email !== signupEmailLower) {

                  await showAlert(
                    t('screens.verificationCode.gmailGoogleLogin.emailMismatchTitle') || '이메일 불일치',
                    t('screens.verificationCode.gmailGoogleLogin.emailMismatchMessage', { email: pendingData.email })
                      || `가입 시 입력하신 이메일 (${pendingData.email}) 과 구글 로그인에 사용하신 이메일이 다릅니다.\n\n같은 이메일로 다시 로그인해주세요.`,
                    [{ text: t('screens.verificationCode.gmailGoogleLogin.emailMismatchButton') || '확인', onPress: () => {} }],
                    { hideCloseButton: true },
                  );
                  continue;
                }
                try {
                  const loginResponse = await loginWithGoogleIdToken(result.idToken, navigate);
                  if (loginResponse.status === 'success' && loginResponse.data?.[0]) {
                    const userData = loginResponse.data[0];
                    const extrastr = userData.extrastr;
                    const member = userData.member;
                    if (extrastr && member) {
                      const ssidw = encryptSHA256(extrastr);
                      await saveSession(member, ssidw, navigate);
                    }
                    await AsyncStorage.removeItem('userData');
                    await AsyncStorage.removeItem('userSessionToken');
                    await AsyncStorage.setItem('userEmail', userData.email ?? pendingData.email);
                    await AsyncStorage.setItem('userData', JSON.stringify(userData));
                    await AsyncStorage.setItem('userSessionToken', extrastr || '');
                    await AsyncStorage.setItem('isLoggedIn', 'true');
                    await AsyncStorage.setItem('rememberMe', 'true');
                    await AsyncStorage.setItem('loginType', 'google');
                    reset(ROUTES.map);
                    break;
                  }
                } catch (_) {

                }
                await showAlert(
                  t('screens.verificationCode.gmailGoogleLogin.title') || '구글 로그인 안내',
                  t('screens.verificationCode.gmailGoogleLogin.message') || 'Gmail 계정은 Google 로그인으로 연동하면 다음부터 간편 로그인할 수 있어요.',
                  [{ text: t('screens.verificationCode.gmailGoogleLogin.button') || '구글 로그인', onPress: () => {} }],
                );
              }
            } else {

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
            }
          }
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

        const targetRoute = verificationSuccessRoute;
        console.log('[인증] 타겟 화면으로 이동 (로그인 모드):', targetRoute);
        resetVerificationSuccessRoute();
        reset(targetRoute || ROUTES.map);
      } else {

        const targetRoute = verificationSuccessRoute;
        console.log('[인증] 타겟 화면으로 이동 (기타 모드):', targetRoute);
        resetVerificationSuccessRoute();
        reset(targetRoute || ROUTES.map);
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