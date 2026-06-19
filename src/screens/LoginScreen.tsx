import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SvgXml } from 'react-native-svg';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Clipboard from 'expo-clipboard';
import { useTranslation } from 'react-i18next';
import {
  FormCheckbox,
  FormField,
  Header,
  PrimaryButton,
  SafeScrollView,
  SegmentedControl,
  Dialog,
} from '../components';
import { COLORS, SIZES, COMMON_STYLES, FONTS, IS_DEV_MODE } from '../constants';
import { ROUTES, useAppNavigation } from '../navigation';
import { setAyetUserId } from '../services/ayet';
import { bindAdisonUid } from '../services/adison';
import {
  loginWithEmailPassword,
  encryptSHA256,
  saveSession,
  checkEmailExists,
  sendEmailVerificationCode,
  signInWithGoogle,
  connectGoogleAccount,
  signInWithApple,
  connectAppleAccount,
  showNativeScreen,
  registerPushToken,
} from '../services';
import { filterAsciiPrintable } from '../utils';
import { useAlertDialog } from '../context/AlertDialogContext';
import { useAppContext } from '../context';

type LoginTab = 'account' | 'otp';

const telegramIconSvg = `<svg width="15" height="13" viewBox="0 0 15 13" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M1.03117 5.59642C5.0577 3.76182 7.74268 2.55233 9.08611 1.96797C12.9219 0.299503 13.7189 0.00967244 14.2384 0.000102042C14.3527 -0.00200286 14.6082 0.0276103 14.7737 0.168038C14.9134 0.286613 14.9518 0.44679 14.9702 0.559212C14.9886 0.671633 15.0115 0.927733 14.9933 1.12784C14.7855 3.41185 13.8861 8.95454 13.4285 11.5127C13.2349 12.5951 12.8536 12.958 12.4845 12.9936C11.6825 13.0707 11.0734 12.4392 10.2965 11.9067C9.08085 11.0733 8.39409 10.5545 7.21409 9.74133C5.8504 8.80154 6.73442 8.28502 7.51159 7.44087C7.71497 7.21995 11.249 3.8583 11.3174 3.55334C11.326 3.5152 11.3339 3.37304 11.2532 3.29797C11.1724 3.2229 11.0532 3.24857 10.9672 3.26899C10.8453 3.29792 8.90325 4.64029 5.14115 7.29607C4.58991 7.69192 4.09062 7.88479 3.64327 7.87468C3.15011 7.86354 2.20146 7.58307 1.49623 7.34334C0.631245 7.04929 -0.0562297 6.89383 0.00363389 6.39445C0.0348146 6.13434 0.377327 5.86833 1.03117 5.59642Z" fill="#23A0DD"/>
</svg>`;

const appleIconSvg = `<svg width="15" height="18" viewBox="0 0 15 18" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M14.6856 14.0275C14.4163 14.6563 14.0975 15.2352 13.7282 15.7674C13.2248 16.4929 12.8125 16.9952 12.4949 17.274C12.0024 17.7318 11.4748 17.9662 10.9098 17.9796C10.5042 17.9796 10.015 17.8629 9.44563 17.6262C8.87436 17.3907 8.34937 17.274 7.86934 17.274C7.3659 17.274 6.82596 17.3907 6.24843 17.6262C5.67001 17.8629 5.20405 17.9862 4.84779 17.9985C4.30599 18.0218 3.76594 17.7807 3.22688 17.274C2.88282 16.9707 2.45248 16.4507 1.93694 15.7141C1.38381 14.9274 0.929064 14.0152 0.572805 12.9753C0.191265 11.852 0 10.7642 0 9.71115C0 8.50486 0.257878 7.46444 0.774403 6.59258C1.18035 5.89227 1.72039 5.33984 2.39631 4.9343C3.07222 4.52875 3.80254 4.32209 4.58904 4.30887C5.01938 4.30887 5.58373 4.44342 6.28503 4.70786C6.98436 4.97318 7.43339 5.10774 7.63026 5.10774C7.77744 5.10774 8.27627 4.95041 9.1219 4.63675C9.92159 4.34587 10.5965 4.22543 11.1494 4.27287C12.6477 4.39509 13.7733 4.99207 14.5218 6.0676C13.1819 6.88824 12.5191 8.03765 12.5322 9.51216C12.5443 10.6607 12.9565 11.6164 13.7667 12.3753C14.1338 12.7275 14.5438 12.9997 15 13.193C14.9011 13.483 14.7966 13.7608 14.6856 14.0275ZM11.2495 0.360103C11.2495 1.26031 10.9241 2.10083 10.2755 2.8788C9.49289 3.80366 8.54624 4.33809 7.51968 4.25376C7.5066 4.14576 7.49901 4.0321 7.49901 3.91266C7.49901 3.04846 7.87121 2.1236 8.53217 1.3674C8.86216 0.984528 9.28184 0.666171 9.79078 0.412211C10.2986 0.162041 10.779 0.0236918 11.2308 0C11.244 0.120343 11.2495 0.240706 11.2495 0.360103Z" fill="black"/>
</svg>`;

const googleIconSvg = `<svg width="15" height="16" viewBox="0 0 15 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M15 7.8271C15 7.28444 14.9513 6.76264 14.8609 6.26172H7.65308V9.22204H11.7718C11.5944 10.1787 11.0552 10.9892 10.2447 11.5318V13.4521H12.718C14.1651 12.1197 15 10.1578 15 7.8271Z" fill="#4285F4"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M7.65302 15.3059C9.71935 15.3059 11.4517 14.6206 12.718 13.4517L10.2446 11.5315C9.55933 11.9907 8.6827 12.2621 7.65302 12.2621C5.65974 12.2621 3.97259 10.9158 3.37078 9.10693H0.813965V11.0898C2.07324 13.5909 4.66137 15.3059 7.65302 15.3059Z" fill="#34A853"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M3.37083 9.10727C3.21776 8.64809 3.1308 8.1576 3.1308 7.6532C3.1308 7.1488 3.21776 6.65831 3.37083 6.19913V4.21631H0.814007C0.295686 5.24946 0 6.41828 0 7.6532C0 8.88811 0.295686 10.0569 0.814007 11.0901L3.37083 9.10727Z" fill="#FBBC05"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M7.65302 3.0438C8.77663 3.0438 9.78544 3.42993 10.5786 4.18828L12.7736 1.99326C11.4482 0.758342 9.71587 0 7.65302 0C4.66137 0 2.07324 1.71497 0.813965 4.2161L3.37078 6.19893C3.97259 4.39004 5.65974 3.0438 7.65302 3.0438Z" fill="#EA4335"/>
</svg>`;

export const LoginScreen = () => {
  const { navigate } = useAppNavigation();
  const { t } = useTranslation();
  const { showAlert } = useAlertDialog();
  const { setVerificationEmail, setVerificationSuccessRoute } = useAppContext();

  const [activeTab, setActiveTab] = useState<LoginTab>('account');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isPangleLoading, setIsPangleLoading] = useState(false);

  const [otpEmail, setOtpEmail] = useState('');
  const [otpRememberMe, setOtpRememberMe] = useState(true);
  const [isOtpLoading, setIsOtpLoading] = useState(false);

  const [linkingDialogVisible, setLinkingDialogVisible] = useState(false);
  const [linkingPassword, setLinkingPassword] = useState('');
  const [linkingAgreed, setLinkingAgreed] = useState(false);
  const [linkingEmail, setLinkingEmail] = useState('');
  const [linkingType, setLinkingType] = useState<'google' | 'apple'>('google');
  const [googleLoginData, setGoogleLoginData] = useState<any>(null);
  const [appleLoginData, setAppleLoginData] = useState<any>(null);
  const [isLinkingLoading, setIsLinkingLoading] = useState(false);
  const [successDialogVisible, setSuccessDialogVisible] = useState(false);

  const emailVerificationRoute: any = ROUTES.emailVerification;

  const tabOptions = [
    { value: 'account' as LoginTab, label: t('screens.login.tabs.accountLogin') },
    { value: 'otp' as LoginTab, label: t('screens.login.tabs.emailOtpLogin') },
  ] as const;

  const handleBackPress = () => {
    navigate(ROUTES.authLanding);
  };

  useEffect(() => {
    const isValidEmail = (s: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);

    const loadInitialEmail = async () => {
      let prefilled = '';

      try {
        const remembered = await AsyncStorage.getItem('rememberMe');
        if (remembered === 'true') {
          const savedEmail = await AsyncStorage.getItem('userEmail');
          if (savedEmail) {
            prefilled = savedEmail;
            setEmail(savedEmail);
            setRememberMe(true);
            console.log('[로그인] 저장된 이메일 불러오기 성공:', savedEmail);
          }
        } else {
          setRememberMe(true);
          setOtpRememberMe(true);
        }
      } catch (error) {
        console.error('[로그인] 저장된 이메일 불러오기 실패:', error);
        setRememberMe(true);
        setOtpRememberMe(true);
      }

      if (!prefilled) {
        try {
          const pending = await AsyncStorage.getItem('pendingPrefillEmail');
          if (pending && isValidEmail(pending)) {
            prefilled = pending;
            setEmail(pending);
            setOtpEmail(pending);
            console.log('[로그인] 딥링크 prefillEmail 적용:', pending);
          }
          await AsyncStorage.removeItem('pendingPrefillEmail');
        } catch (err) {
          console.warn('[로그인] pendingPrefillEmail 읽기 실패:', err);
        }
      }

      if (!prefilled) {
        try {
          const clip = await Clipboard.getStringAsync();
          const trimmed = clip?.trim() ?? '';
          if (trimmed && isValidEmail(trimmed)) {
            prefilled = trimmed;
            setEmail(trimmed);
            setOtpEmail(trimmed);
            console.log('[로그인] 클립보드 이메일 자동 입력:', trimmed);
          }
        } catch (err) {
          console.warn('[로그인] 클립보드 읽기 실패:', err);
        }
      }
    };
    loadInitialEmail();
  }, []);

  const toggleRememberMe = () => {
    setRememberMe(!rememberMe);
  };

  const toggleOtpRememberMe = () => {
    setOtpRememberMe(!otpRememberMe);
  };

  const handleSendOtp = async () => {
    if (!otpEmail.trim()) {
      await showAlert(t('screens.emailVerification.alerts.emailInput'), t('screens.emailVerification.errors.emailRequired'));
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(otpEmail.trim())) {
      await showAlert(t('screens.emailVerification.alerts.emailFormatError'), t('screens.emailVerification.errors.emailInvalid'));
      return;
    }

    setIsOtpLoading(true);

    try {

      console.log('[로그인] 이메일 존재 확인 요청:', otpEmail.trim());
      const emailExists = await checkEmailExists(otpEmail.trim(), navigate);

      if (!emailExists) {
        await showAlert(
          t('screens.emailVerification.alerts.emailCheck'),
          t('screens.emailVerification.errors.emailNotRegistered'),
        );
        setIsOtpLoading(false);
        return;
      }

      console.log('[로그인] 이메일 인증 코드 전송 요청:', otpEmail.trim());
      const codeSent = await sendEmailVerificationCode(otpEmail.trim(), navigate);

      if (!codeSent) {
        await showAlert(t('screens.emailVerification.alerts.sendFailed'), t('screens.emailVerification.errors.sendFailed'));
        setIsOtpLoading(false);
        return;
      }

      await AsyncStorage.setItem('otpRememberMeTemp', otpRememberMe ? 'true' : 'false');

      setVerificationEmail(otpEmail.trim());
      setVerificationSuccessRoute(ROUTES.map); 
      navigate(ROUTES.verificationCode);
    } catch (error) {
      console.error('[로그인] 이메일 OTP 전송 오류:', error);
      await showAlert(t('screens.emailVerification.alerts.error'), t('screens.emailVerification.errors.error'));
    } finally {
      setIsOtpLoading(false);
    }
  };

  const handleLogin = async () => {

    if (!email.trim()) {
      await showAlert(t('common.messages.error'), t('screens.login.errors.emailRequired'));
      return;
    }

    if (!password.trim()) {
      await showAlert(t('common.messages.error'), t('screens.login.errors.passwordRequired'));
      return;
    }

    setIsLoading(true);

    try {
      console.log('[로그인] 로그인 시도:', {
        email,
        rememberMe,
        rememberMeType: typeof rememberMe,
        rememberMeValue: rememberMe === true ? 'true' : 'false',
      });

      const loginResponse = await loginWithEmailPassword(
        email.trim(),
        password,
        navigate,
      );

      if (loginResponse.status !== 'success') {
        await showAlert(t('common.messages.error'), t('screens.login.errors.loginFailed'));
        setIsLoading(false);
        return;
      }

      const userData = loginResponse.data[0];
      if (!userData) {
        await showAlert(t('common.messages.error'), t('screens.login.errors.userDataNotFound'));
        setIsLoading(false);
        return;
      }

      const extrastr = userData.extrastr;
      if (extrastr && userData.member) {
        const ssidw = encryptSHA256(extrastr);

        const sessionSaved = await saveSession(userData.member, ssidw, navigate);
        if (!sessionSaved) {
          console.warn('[로그인] 세션 저장 실패');
        }
      }

      await AsyncStorage.removeItem('userData');
      await AsyncStorage.removeItem('userSessionToken');

      await AsyncStorage.setItem('userEmail', email.trim());
      await AsyncStorage.setItem('userData', JSON.stringify(userData));
      if (userData.member != null) setAyetUserId(String(userData.member));
      if (userData.member != null) {

        bindAdisonUid(userData.member, {
          gender: (userData as any).gender,
          age: (userData as any).age,
        });
      }

      const sessionToken = userData.extrastr || '';
      await AsyncStorage.setItem('userSessionToken', sessionToken);

      await AsyncStorage.setItem('isLoggedIn', 'true');

      if (rememberMe) {
        await AsyncStorage.setItem('rememberMe', 'true');
        console.log('[로그인] 로그인 상태 유지 저장 완료, rememberMe:', rememberMe);

        const savedRememberMe = await AsyncStorage.getItem('rememberMe');
        const savedIsLoggedIn = await AsyncStorage.getItem('isLoggedIn');
        console.log('[로그인] 저장 확인:', {
          rememberMe: savedRememberMe,
          isLoggedIn: savedIsLoggedIn,
        });
      } else {
        await AsyncStorage.removeItem('rememberMe');
        console.log('[로그인] 로그인 상태 유지 해제, rememberMe:', rememberMe);
      }

      console.log('[로그인] 로그인 성공');

      if (userData.member) {
        registerPushToken(userData.member, navigate).catch(() => {});
      }

      navigate(ROUTES.map);
    } catch (error) {
      console.error('[로그인] 로그인 오류:', error);
      await showAlert(
        t('common.messages.error'),
        t('screens.login.errors.loginError'),
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleLinkAccount = async () => {
    if (!linkingPassword.trim()) {
      await showAlert(t('common.messages.error'), t('screens.login.errors.passwordRequired'));
      return;
    }

    if (!linkingAgreed) {
      await showAlert(t('common.messages.error'), '계정 연동에 동의해주세요.');
      return;
    }

    setIsLinkingLoading(true);

    try {
      console.log('[계정 연동] 비밀번호 확인 및 로그인 시도:', linkingEmail);

      const response = linkingType === 'google'
        ? await connectGoogleAccount(
          googleLoginData,
          linkingPassword,
          navigate,
        )
        : await connectAppleAccount(
          appleLoginData,
          linkingPassword,
          navigate,
        );

      if (!response.success || (response.code !== 200 && response.code !== '200')) {
        const errorMessage = response.message || t('screens.login.errors.loginFailed');
        await showAlert(t('common.messages.error'), errorMessage);
        setIsLinkingLoading(false);
        return;
      }

      let userData: any = null;
      if (Array.isArray(response.data) && response.data.length > 0) {
        userData = response.data[0];
      } else if (response.data && typeof response.data === 'object') {

        userData = response.data;
      }

      if (!userData) {
        await showAlert(t('common.messages.error'), t('screens.login.errors.userDataNotFound'));
        setIsLinkingLoading(false);
        return;
      }

      console.log('[계정 연동] 연동 성공 - 세션 저장 진행');

      const extrastr = userData.extrastr;
      const memberId = userData.member || userData.memberId;
      if (extrastr && memberId) {
        const ssidw = encryptSHA256(extrastr);
        const sessionSaved = await saveSession(memberId, ssidw, navigate);
        if (!sessionSaved) {
          console.warn('[계정 연동] 세션 저장 실패');
        }
      }

      await AsyncStorage.removeItem('userData');
      await AsyncStorage.removeItem('userSessionToken');

      const userEmail = userData.email || linkingEmail;
      await AsyncStorage.setItem('userEmail', userEmail);
      await AsyncStorage.setItem('userData', JSON.stringify(userData));
      if (userData.member != null) setAyetUserId(String(userData.member));
      if (userData.member != null) {

        bindAdisonUid(userData.member, {
          gender: (userData as any).gender,
          age: (userData as any).age,
        });
      }

      const sessionToken = userData.extrastr || '';
      await AsyncStorage.setItem('userSessionToken', sessionToken);

      await AsyncStorage.setItem('isLoggedIn', 'true');

      await AsyncStorage.setItem('rememberMe', 'true');
      console.log('[계정 연동] 로그인 상태 유지 저장 완료');

      console.log('[계정 연동] 완료 및 로그인 성공');

      setLinkingDialogVisible(false);

      setSuccessDialogVisible(true);

    } catch (error) {
      console.error('[계정 연동] 오류:', error);
      await showAlert(
        t('common.messages.error'),
        '계정 연동 중 오류가 발생했습니다.',
      );
    } finally {
      setIsLinkingLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    if (isLoading || isOtpLoading) {
      return;
    }

    setIsLoading(true);

    try {
      console.log('[구글 로그인] 구글 로그인 시작');

      const result = await signInWithGoogle(navigate);

      if (!result.success || !result.data) {

        if (result.code === 'USER_CANCELLED' || result.code === 'IN_PROGRESS') {
          setIsLoading(false);
          return;
        }

        const errorMessage = result.message
          || t('screens.login.errors.googleLoginFailed')
          || t('common.messages.unknownError')
          || '오류가 발생했습니다.';
        await showAlert(t('common.messages.error') || '오류', errorMessage);
        setIsLoading(false);
        return;
      }

      if (result.data.requiresLinking) {
        console.log('[구글 로그인] 계정 연동 필요 - 팝업 표시');
        setLinkingEmail(result.data.email);
        setGoogleLoginData(result.data);
        setLinkingType('google');
        setLinkingPassword('');
        setLinkingAgreed(false);
        setLinkingDialogVisible(true);
        setIsLoading(false);
        return;
      }

      if (result.data.requiresSignup) {
        console.log('[구글 로그인] 회원가입 필요 (code 417) - 이메일 수정 불가능한 회원가입 화면으로 이동');

        const email = result.data.email || '';
        if (!email) {
          await showAlert(t('common.messages.error') || '오류', t('screens.login.emailFetchFail') || '이메일 정보를 가져올 수 없습니다.');
          setIsLoading(false);
          return;
        }

        await AsyncStorage.setItem('googleSignupRequired', 'true');
        await AsyncStorage.setItem('googleSignupEmail', email);

        navigate(ROUTES.signup);
        setIsLoading(false);
        return;
      }

      const { memberId, email, name, accessToken, refreshToken, isNewUser, isSignupCompleted } = result.data;

      console.log('[구글 로그인] 로그인 성공:', { memberId, email, isNewUser, isSignupCompleted });

      if (isNewUser) {
        console.log('[구글 로그인] 신규 사용자, 회원가입 화면으로 이동');

        await AsyncStorage.setItem('googleSignupRequired', 'true');
        await AsyncStorage.setItem('googleSignupEmail', email);

        navigate(ROUTES.signup);
        setIsLoading(false);
        return;
      }

      console.log('[구글 로그인] 기존 사용자, 로그인 처리 시작');

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
          console.warn('[구글 로그인] 세션 저장 실패');
        }
      }

      await AsyncStorage.removeItem('userData');
      await AsyncStorage.removeItem('userSessionToken');

      await AsyncStorage.setItem('userEmail', email);
      await AsyncStorage.setItem('userData', JSON.stringify(userData));

      const responseJwt = (result.data as any)?.jwt;
      if (typeof responseJwt === 'string' && responseJwt.split('.').length === 3) {
        await AsyncStorage.setItem('jwt', responseJwt);
        console.log('[구글 로그인] jwt 저장 완료 (len:', responseJwt.length, ')');
      }
      if (userData.member != null) setAyetUserId(String(userData.member));
      if (userData.member != null) {

        bindAdisonUid(userData.member, {
          gender: (userData as any).gender,
          age: (userData as any).age,
        });
      }
      await AsyncStorage.setItem('userSessionToken', accessToken || '');
      await AsyncStorage.setItem('isLoggedIn', 'true');

      await AsyncStorage.setItem('rememberMe', 'true');
      console.log('[구글 로그인] 로그인 상태 유지 저장 완료');

      console.log('[구글 로그인] 사용자 정보 저장 완료');

      if (memberId) {
        registerPushToken(memberId, navigate).catch(() => {});
      }

      console.log('[구글 로그인] 기존 사용자, 메인 화면으로 이동');
      navigate(ROUTES.map);
    } catch (error: any) {
      console.error('[구글 로그인] 오류:', error);

      await showAlert(
        t('common.messages.error') || '오류',
        t('screens.login.errors.googleLoginFailed')
          || t('common.messages.unknownError')
          || '구글 로그인 중 오류가 발생했습니다.',
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleAppleLogin = async () => {
    if (isLoading || isOtpLoading) {
      return;
    }

    if (Platform.OS !== 'ios') {
      await showAlert(
        t('common.messages.error') || '오류',
        '애플 로그인은 iOS에서만 지원됩니다.',
      );
      return;
    }

    setIsLoading(true);

    try {
      console.log('[애플 로그인] 애플 로그인 시작');

      const result = await signInWithApple(navigate);

      if (!result.success || !result.data) {
        const errorMessage = result.message || '애플 로그인에 실패했습니다.';
        await showAlert(t('common.messages.error') || '오류', errorMessage);
        setIsLoading(false);
        return;
      }

      if (result.data.requiresLinking) {
        console.log('[애플 로그인] 계정 연동 필요 - 팝업 표시');
        setLinkingEmail(result.data.email);
        setAppleLoginData(result.data);
        setLinkingType('apple');
        setLinkingPassword('');
        setLinkingAgreed(false);
        setLinkingDialogVisible(true);
        setIsLoading(false);
        return;
      }

      if (result.data.requiresSignup) {
        console.log('[애플 로그인] 회원가입 필요 (code 417) - 이메일 수정 불가능한 회원가입 화면으로 이동');

        const email = result.data.email || '';
        if (!email) {
          await showAlert(t('common.messages.error') || '오류', t('screens.login.emailFetchFail') || '이메일 정보를 가져올 수 없습니다.');
          setIsLoading(false);
          return;
        }

        await AsyncStorage.setItem('appleSignupRequired', 'true');
        await AsyncStorage.setItem('appleSignupEmail', email);

        if (result.data.fullName) {
          const fullName = result.data.fullName;
          const givenName = fullName.givenName || '';
          const familyName = fullName.familyName || '';
          const fullNameStr = `${familyName} ${givenName}`.trim();

          await AsyncStorage.setItem('appleSignupFullName', fullNameStr);
          await AsyncStorage.setItem('appleSignupGivenName', givenName);
          await AsyncStorage.setItem('appleSignupFamilyName', familyName);
          console.log('[애플 로그인] 사용자 이름 저장:', { fullName: fullNameStr, givenName, familyName });
        }

        navigate(ROUTES.signup);
        setIsLoading(false);
        return;
      }

      const { memberId, email, name, accessToken, refreshToken, isNewUser, isSignupCompleted } = result.data;

      console.log('[애플 로그인] 로그인 성공:', { memberId, email, isNewUser, isSignupCompleted });

      if (isNewUser) {
        console.log('[애플 로그인] 신규 사용자, 회원가입 화면으로 이동');

        await AsyncStorage.setItem('appleSignupRequired', 'true');
        await AsyncStorage.setItem('appleSignupEmail', email);

        if (result.data.fullName) {
          const fullName = result.data.fullName;
          const givenName = fullName.givenName || '';
          const familyName = fullName.familyName || '';
          const fullNameStr = `${familyName} ${givenName}`.trim();

          await AsyncStorage.setItem('appleSignupFullName', fullNameStr);
          await AsyncStorage.setItem('appleSignupGivenName', givenName);
          await AsyncStorage.setItem('appleSignupFamilyName', familyName);
          console.log('[애플 로그인] 사용자 이름 저장:', { fullName: fullNameStr, givenName, familyName });
        }

        navigate(ROUTES.signup);
        setIsLoading(false);
        return;
      }

      console.log('[애플 로그인] 기존 사용자, 로그인 처리 시작');

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
          console.warn('[애플 로그인] 세션 저장 실패');
        }
      }

      await AsyncStorage.removeItem('userData');
      await AsyncStorage.removeItem('userSessionToken');

      await AsyncStorage.setItem('userEmail', email);
      await AsyncStorage.setItem('userData', JSON.stringify(userData));

      const responseJwt = (result.data as any)?.jwt;
      if (typeof responseJwt === 'string' && responseJwt.split('.').length === 3) {
        await AsyncStorage.setItem('jwt', responseJwt);
        console.log('[애플 로그인] jwt 저장 완료 (len:', responseJwt.length, ')');
      }
      if (userData.member != null) setAyetUserId(String(userData.member));
      if (userData.member != null) {

        bindAdisonUid(userData.member, {
          gender: (userData as any).gender,
          age: (userData as any).age,
        });
      }
      await AsyncStorage.setItem('userSessionToken', accessToken || '');
      await AsyncStorage.setItem('isLoggedIn', 'true');

      await AsyncStorage.setItem('rememberMe', 'true');

      await AsyncStorage.setItem('loginType', 'apple');
      console.log('[애플 로그인] 로그인 상태 유지 저장 완료');

      console.log('[애플 로그인] 사용자 정보 저장 완료');

      if (memberId) {
        registerPushToken(memberId, navigate).catch(() => {});
      }

      console.log('[애플 로그인] 기존 사용자, 메인 화면으로 이동');
      navigate(ROUTES.map);
    } catch (error: any) {
      console.error('[애플 로그인] 오류:', error);
      await showAlert(
        t('common.messages.error') || '오류',
        error.message || '애플 로그인 중 오류가 발생했습니다.',
      );
    } finally {
      setIsLoading(false);
    }
  };

  const renderSnsButtons = (disabled: boolean) => (
    <View style={styles.snsLoginContainer}>
      <Text style={styles.snsLoginLabel}>{t('screens.login.orLoginWith')}</Text>
      <View style={styles.snsButtonContainer}>
        {}
        <TouchableOpacity
          style={styles.snsButton}
          disabled={disabled}
          onPress={handleGoogleLogin}
        >
          <SvgXml xml={googleIconSvg} width={15} height={16} />
        </TouchableOpacity>
        {}
        {Platform.OS === 'ios' && (
          <TouchableOpacity
            style={styles.snsButton}
            disabled={disabled}
            onPress={handleAppleLogin}
          >
            <SvgXml xml={appleIconSvg} width={15} height={18} />
          </TouchableOpacity>
        )}
        {}
        {

}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Header
        title={t('screens.login.title')}
        onBackPress={handleBackPress}
        showBackButton
      />

      {}
      <View style={styles.tabContainer}>
        <SegmentedControl
          options={tabOptions}
          value={activeTab}
          onChange={setActiveTab}
          hideIndicator={true}
        />
      </View>

      {}
      {activeTab === 'account' && (
        <SafeScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          autoAdjustKeyboardPadding={true}
        >
          <FormField
            label={t('screens.login.emailLabel')}
            placeholder={t('screens.login.emailPlaceholder')}
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
            containerStyle={styles.fieldContainer}
            editable={!isLoading}
          />

          <FormField
            label={t('screens.login.passwordLabel')}
            placeholder={t('screens.login.passwordPlaceholder')}
            secureTextEntry={!isPasswordVisible}
            value={password}
            onChangeText={(text) => setPassword(filterAsciiPrintable(text))}
            containerStyle={styles.fieldContainer}
            editable={!isLoading}
            rightAccessory={
              <TouchableOpacity
                style={styles.eyeButton}
                onPress={() => setIsPasswordVisible((prev) => !prev)}
                activeOpacity={0.7}
                disabled={isLoading}
              >
                <Ionicons
                  name={isPasswordVisible ? 'eye-outline' : 'eye-off-outline'}
                  size={20}
                  color="#666666"
                />
              </TouchableOpacity>
            }
          />

          <View style={[styles.checkboxRow, { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }]}>
            <View style={isLoading ? styles.checkboxDisabled : undefined}>
              <FormCheckbox
                label={t('screens.login.rememberMe')}
                checked={rememberMe}
                onToggle={isLoading ? () => { } : toggleRememberMe}
                variant="square"
              />
            </View>
            <TouchableOpacity onPress={() => !isLoading && navigate(ROUTES.forgotPassword)} disabled={isLoading}>
              <Text style={{ fontSize: 13, color: '#000' }}>{t('screens.login.forgotPassword')}</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.bottomSection}>
            <View style={styles.loginButtonWrapper}>
              {isLoading ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="small" color={COLORS.buttonPrimary} />
                </View>
              ) : (
                <PrimaryButton title={t('screens.login.loginButton')} fullWidth onPress={handleLogin} />
              )}
            </View>

            {renderSnsButtons(isLoading)}

            <Text style={styles.disclaimer}>
              {t('screens.login.disclaimer')}
            </Text>
          </View>
        </SafeScrollView>
      )}

      {}
      {activeTab === 'otp' && (
        <SafeScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          autoAdjustKeyboardPadding={true}
        >
          <FormField
            label={t('screens.login.emailLabel')}
            placeholder={t('screens.login.emailPlaceholder')}
            keyboardType="email-address"
            autoCapitalize="none"
            value={otpEmail}
            onChangeText={setOtpEmail}
            containerStyle={styles.fieldContainer}
            editable={!isOtpLoading}
          />

          <View style={styles.checkboxRow}>
            <View style={isOtpLoading ? styles.checkboxDisabled : undefined}>
              <FormCheckbox
                label={t('screens.login.rememberMe')}
                checked={otpRememberMe}
                onToggle={isOtpLoading ? () => { } : toggleOtpRememberMe}
                variant="square"
              />
            </View>
          </View>
          <View style={styles.bottomSection}>
            <View style={styles.otpButtonWrapper}>
              {isOtpLoading ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="small" color={COLORS.buttonPrimary} />
                </View>
              ) : (
                <PrimaryButton title={t('screens.login.otp.sendButton')} fullWidth onPress={handleSendOtp} />
              )}
            </View>

            {renderSnsButtons(isOtpLoading)}

            <Text style={styles.disclaimer}>
              {t('screens.login.disclaimer')}
            </Text>
          </View>
        </SafeScrollView>
      )}

      {}
      <Dialog
        visible={linkingDialogVisible}
        title={t('screens.login.accountLink')}
        onClose={() => setLinkingDialogVisible(false)}
        actions={[
          {
            label: t('common.buttons.cancel') || '취소',
            onPress: () => setLinkingDialogVisible(false),
            variant: 'secondary',
            disabled: isLinkingLoading,
          },
          {
            label: t('common.buttons.confirm') || '확인',
            onPress: handleLinkAccount,
            variant: 'primary',
            disabled: isLinkingLoading || !linkingAgreed,
          },
        ]}
      >
        <View style={styles.linkingContainer}>
          <Text style={styles.linkingMessage}>{`XRUN 계정에 ${linkingType === 'google' ? 'Google' : 'Apple'} 계정을 연결하면
보다 간편하게 로그인할 수 있습니다.

${linkingType === 'google' ? '구글' : '애플'} 계정과 xrun계정`}
            <Text style={styles.linkingEmail}>{linkingEmail}</Text> 와의 연결을 허용하시겠습니까?
          </Text>

          <FormField
            label={t('screens.login.xrunPasswordLabel') || 'XRUN 계정 비밀번호'}
            placeholder={t('screens.login.passwordPlaceholder') || '비밀번호를 입력하세요'}
            secureTextEntry={true} 
            value={linkingPassword}
            onChangeText={setLinkingPassword}
            containerStyle={styles.linkingInput}
            editable={!isLinkingLoading}
          />

          <View style={styles.linkingCheckbox}>
            <FormCheckbox
              label="동의합니다."
              checked={linkingAgreed}
              onToggle={() => setLinkingAgreed(!linkingAgreed)}
              variant="square"
            />
          </View>

          {isLinkingLoading && (
            <View style={styles.linkingLoader}>
              <ActivityIndicator size="small" color={COLORS.buttonPrimary} />
            </View>
          )}
        </View>
      </Dialog>

      {}
      <Dialog
        visible={successDialogVisible}
        title={t('screens.login.linkComplete')}
        onClose={() => {
          setSuccessDialogVisible(false);
          navigate(ROUTES.map);
        }}
        actions={[
          {
            label: t('common.buttons.confirm') || '확인',
            onPress: () => {
              setSuccessDialogVisible(false);
              navigate(ROUTES.map);
            },
            variant: 'primary',
          },
        ]}
      >
        <View style={styles.linkingContainer}>
          <Text style={styles.linkingMessage}>
            연동이 완료되었습니다.
          </Text>
        </View>
      </Dialog>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...COMMON_STYLES.container,
  },
  tabContainer: {
    paddingHorizontal: SIZES.xlarge,
    paddingVertical: SIZES.medium,
    backgroundColor: '#ffffff',
  },
  scrollContent: {
    flexGrow: 1,
    ...COMMON_STYLES.scrollContent,
  },
  fieldContainer: {
    marginBottom: SIZES.large,
  },
  eyeButton: {
    height: 24,
    width: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxRow: {
    marginBottom: 16,
  },
  bottomSection: {
    ...COMMON_STYLES.bottomButtonContainer,
  },
  loginButtonWrapper: {
    width: '100%',
  },
  otpButtonWrapper: {
    width: '100%',
  },
  disclaimer: {
    width: '100%',
    fontSize: FONTS.size.small,
    lineHeight: 15,
    color: '#4c4e55',
    fontFamily: 'Roboto-Regular',
  },
  emailVerification: {
    marginTop: 24,
    width: '100%',
    alignItems: 'flex-start',
  },
  emailVerificationText: {
    fontSize: FONTS.size.msmall,
    lineHeight: 20,
    color: '#4c4e55',
    fontFamily: 'Roboto-Bold',
  },
  mapLink: {
    marginTop: 24,
    width: '100%',
    alignItems: 'flex-start',
  },
  mapLinkText: {
    fontSize: FONTS.size.msmall,
    lineHeight: 20,
    color: '#4c4e55',
    fontFamily: 'Roboto-Bold',
  },

  loadingContainer: {
    height: 56,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxDisabled: {
    opacity: 0.5,
  },
  snsLoginContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginTop: SIZES.xlarge,
    gap: SIZES.medium,
    marginBottom: SIZES.xlarge,
    width: '100%',
  },
  snsLoginLabel: {
    marginLeft: Dimensions.get('window').width / 6,
    fontSize: FONTS.size.msmall,
    lineHeight: 20,
    color: '#4c4e55',
    fontFamily: 'Roboto-Regular',
  },
  snsButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SIZES.medium,

  },
  snsButton: {
    width: 48,
    height: 48,
    borderRadius: 8,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: '#ebebeb',
    borderWidth: 1,
  },
  linkingContainer: {
    paddingVertical: 8,
  },
  linkingMessage: {
    fontSize: FONTS.size.medium,
    lineHeight: 22,
    color: '#333333',
    marginBottom: 20,
    marginTop: 8,
    fontFamily: 'Roboto-Regular',
  },
  linkingEmail: {
    fontFamily: 'Roboto-Bold',
    color: COLORS.buttonPrimary,
  },
  linkingInput: {
    marginBottom: 16,
  },
  linkingCheckbox: {
    marginBottom: 8,
  },
  linkingLoader: {
    alignItems: 'center',
    marginTop: 10,
  },
  pangleTestContainer: {
    marginTop: SIZES.large,
    width: '100%',
  },
  pangleTestButton: {
    backgroundColor: COLORS.buttonSecondary,
    borderRadius: 16,
    height: 56,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SIZES.medium,
  },
  pangleTestButtonText: {
    fontSize: FONTS.size.medium,
    fontFamily: FONTS.family.medium,
    color: COLORS.text,
  },
  pangleTestButtonsRow: {
    flexDirection: 'row',
    gap: SIZES.medium,
    width: '100%',
  },
  pangleTestButtonSmall: {
    flex: 1,
    backgroundColor: COLORS.buttonPrimary,
    borderRadius: 12,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pangleTestButtonSecondary: {
    backgroundColor: COLORS.buttonSecondary,
  },
  pangleTestButtonTextSmall: {
    fontSize: FONTS.size.ssmall,
    fontFamily: FONTS.family.medium,
    color: COLORS.text,
  },
});

