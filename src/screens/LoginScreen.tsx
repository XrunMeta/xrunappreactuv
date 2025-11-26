import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from 'react-i18next';
import { FormCheckbox, FormField, Header, PrimaryButton } from '../components';
import { COLORS, SIZES, COMMON_STYLES } from '../constants';
import { ROUTES, useAppNavigation } from '../navigation';
import {
  loginWithEmailPassword,
  encryptSHA256,
  saveSession,
} from '../services';
import { useAlertDialog } from '../context/AlertDialogContext';

export const LoginScreen = () => {
  const { goBack, navigate } = useAppNavigation();
  const { t } = useTranslation();
  const { showAlert } = useAlertDialog();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const emailVerificationRoute: any = ROUTES.emailVerification;

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

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <Header
        title={t('screens.login.title')}
        onBackPress={goBack}
        showBackButton
      />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
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
              onToggle={isLoading ? () => {} : toggleRememberMe}
              variant="circle"
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

          <Text style={styles.disclaimer}>
            {t('screens.login.disclaimer')}
          </Text>

          <TouchableOpacity
            style={styles.emailVerification}
            onPress={() => navigate(emailVerificationRoute)}
            activeOpacity={0.7}
            disabled={isLoading}
          >
            <Text style={styles.emailVerificationText}>{t('screens.login.emailVerification')}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {Platform.OS === 'ios' && (
        <View style={styles.homeIndicator}>
          <View style={styles.homeIndicatorBar} />
        </View>
      )}
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
    paddingBottom: Platform.OS === 'android' 
      ? 16 + SIZES.medium 
      : 40,
    justifyContent: 'space-between',
  },
  fieldContainer: {
    width: '100%',
    maxWidth: 780,
    alignSelf: 'center',
  },
  eyeButton: {
    height: 24,
    width: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxRow: {
    width: '100%',
    maxWidth: 780,
    alignSelf: 'center',
    marginTop: -8,
    marginBottom: 16,
  },
  bottomSection: {
    ...COMMON_STYLES.bottomSection,
  },
  loginButtonWrapper: {
    width: '100%',
    marginBottom: SIZES.medium, 
  },
  disclaimer: {
    width: '100%',
    fontSize: 12,
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
    fontSize: 14,
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
    fontSize: 14,
    lineHeight: 20,
    color: '#4c4e55',
    fontFamily: 'Roboto-Bold',
  },
  homeIndicator: {
    height: 34,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 9,
  },
  homeIndicatorBar: {
    width: 134,
    height: 5,
    backgroundColor: '#10192d',
    borderRadius: 100,
    marginBottom: 9,
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
});

