import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SvgXml } from 'react-native-svg';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from 'react-i18next';
import { FormCheckbox, FormField, Header, PrimaryButton, SafeScrollView, SegmentedControl } from '../components';
import { COLORS, SIZES, COMMON_STYLES, FONTS } from '../constants';
import { ROUTES, useAppNavigation } from '../navigation';
import {
  loginWithEmailPassword,
  encryptSHA256,
  saveSession,
} from '../services';
import { useAlertDialog } from '../context/AlertDialogContext';

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

  const [activeTab, setActiveTab] = useState<LoginTab>('account');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [otpEmail, setOtpEmail] = useState('');
  const [otpRememberMe, setOtpRememberMe] = useState(false);
  const [isOtpLoading, setIsOtpLoading] = useState(false);

  const emailVerificationRoute: any = ROUTES.emailVerification;

  const tabOptions = [
    { value: 'account' as LoginTab, label: t('screens.login.tabs.accountLogin') },
    { value: 'otp' as LoginTab, label: t('screens.login.tabs.emailOtpLogin') },
  ] as const;

  const handleBackPress = () => {
    navigate(ROUTES.authLanding);
  };

  useEffect(() => {
    const loadRememberedEmail = async () => {
      try {
        const remembered = await AsyncStorage.getItem('rememberMe');
        if (remembered === 'true') {
          const savedEmail = await AsyncStorage.getItem('userEmail');
          if (savedEmail) {
            setEmail(savedEmail);
            setRememberMe(true);
            console.log('[로그인] 저장된 이메일 불러오기 성공:', savedEmail);
          }
        }
      } catch (error) {
        console.error('[로그인] 저장된 이메일 불러오기 실패:', error);
      }
    };
    loadRememberedEmail();
  }, []);

  const toggleRememberMe = () => {
    setRememberMe(!rememberMe);
  };

  const toggleOtpRememberMe = () => {
    setOtpRememberMe(!otpRememberMe);
  };

  const handleSendOtp = async () => {
    if (!otpEmail.trim()) {
      await showAlert(t('common.messages.error'), t('screens.login.errors.emailRequired'));
      return;
    }

    setIsOtpLoading(true);
    try {

      console.log('[OTP] OTP 전송 요청:', { email: otpEmail, rememberMe: otpRememberMe });

    } catch (error) {
      console.error('[OTP] OTP 전송 오류:', error);
      await showAlert(t('common.messages.error'), t('screens.login.errors.loginError'));
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
      console.log('[로그인] 로그인 시도:', { email, rememberMe });

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

      const sessionToken = userData.extrastr || '';
      await AsyncStorage.setItem('userSessionToken', sessionToken);

      await AsyncStorage.setItem('isLoggedIn', 'true');

      if (rememberMe) {
        await AsyncStorage.setItem('rememberMe', 'true');
        console.log('[로그인] 로그인 상태 유지 저장 완료');
      } else {
        await AsyncStorage.removeItem('rememberMe');
        console.log('[로그인] 로그인 상태 유지 해제');
      }

      console.log('[로그인] 로그인 성공');

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

  const renderSnsButtons = (disabled: boolean) => (
    <View style={styles.snsLoginContainer}>
      <Text style={styles.snsLoginLabel}>{t('screens.login.orLoginWith')}</Text>
      <View style={styles.snsButtonContainer}>
        {}
        <TouchableOpacity style={styles.snsButton} disabled={disabled}>
          <SvgXml xml={googleIconSvg} width={15} height={16} />
        </TouchableOpacity>
        {}
        <TouchableOpacity style={styles.snsButton} disabled={disabled}>
          <SvgXml xml={appleIconSvg} width={15} height={18} />
        </TouchableOpacity>
        {}
        <TouchableOpacity style={styles.snsButton} disabled={disabled}>
          <SvgXml xml={telegramIconSvg} width={15} height={13} />
        </TouchableOpacity>
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
            onChangeText={setPassword}
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

          <View style={styles.checkboxRow}>
            <View style={isLoading ? styles.checkboxDisabled : undefined}>
              <FormCheckbox
                label={t('screens.login.rememberMe')}
                checked={rememberMe}
                onToggle={isLoading ? () => { } : toggleRememberMe}
                variant="square"
              />
            </View>
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
            <View style={isLoading ? styles.checkboxDisabled : undefined}>
              <FormCheckbox
                label={t('screens.login.rememberMe')}
                checked={rememberMe}
                onToggle={isLoading ? () => { } : toggleRememberMe}
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
});

