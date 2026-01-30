import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Header, SafeView, PrimaryButton, SafeScrollView, FormField, FormCheckbox, Dialog } from '../components';
import { COLORS, COMMON_STYLES, FONTS, SIZES } from '../constants';
import { useAppNavigation, ROUTES } from '../navigation';
import { useAlertDialog } from '../context/AlertDialogContext';
import {
  signInWithGoogle,
  connectGoogleAccount,
  encryptSHA256,
  saveSession,
} from '../services';

export const WalletPrivateKeyGoogleAuthScreen = () => {
  const { t } = useTranslation();
  const { goBack, reset, navigate } = useAppNavigation();
  const { showAlert } = useAlertDialog();

  const [currentMemberId, setCurrentMemberId] = useState<number | null>(null);
  const [currentEmail, setCurrentEmail] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const [linkingDialogVisible, setLinkingDialogVisible] = useState(false);
  const [linkingPassword, setLinkingPassword] = useState('');
  const [linkingAgreed, setLinkingAgreed] = useState(false);
  const [linkingEmail, setLinkingEmail] = useState('');
  const [googleLoginData, setGoogleLoginData] = useState<any>(null);
  const [isLinkingLoading, setIsLinkingLoading] = useState(false);

  useEffect(() => {
    loadCurrentUserInfo();
  }, []);

  const loadCurrentUserInfo = async () => {
    try {
      const userDataStr = await AsyncStorage.getItem('userData');
      if (userDataStr) {
        const userData = JSON.parse(userDataStr);
        setCurrentMemberId(userData.member || null);
        setCurrentEmail(userData.email || '');
      }

      const userEmail = await AsyncStorage.getItem('userEmail');
      if (userEmail && !currentEmail) {
        setCurrentEmail(userEmail);
      }
    } catch (error) {
      console.error('[프라이빗키 인증] 사용자 정보 로드 실패:', error);
    }
  };

  const handleGoogleAuth = async () => {
    if (isLoading) {
      return;
    }

    if (!currentMemberId) {
      await showAlert(
        t('common.messages.error') || '오류',
        '로그인 정보를 찾을 수 없습니다. 다시 로그인해주세요.',
      );
      goBack();
      return;
    }

    setIsLoading(true);

    try {
      console.log('[프라이빗키 인증] 구글 인증 시작');

      const result = await signInWithGoogle(navigate);

      if (!result.success || !result.data) {
        const errorMessage = result.message || '구글 인증에 실패했습니다.';
        await showAlert(t('common.messages.error') || '오류', errorMessage);
        setIsLoading(false);
        return;
      }

      if (result.data.requiresLinking) {
        console.log('[프라이빗키 인증] 계정 연동 필요 - 팝업 표시');

        const googleEmail = result.data.email || '';

        setLinkingEmail(googleEmail);
        setGoogleLoginData(result.data);
        setLinkingPassword('');
        setLinkingAgreed(false);
        setLinkingDialogVisible(true);
        setIsLoading(false);
        return;
      }

      if (result.data.requiresSignup) {
        console.log('[프라이빗키 인증] 구글 소셜 정보 없음 - 계정 연동 팝업 표시');

        const googleEmail = result.data.email || '';

        setLinkingEmail(googleEmail);
        setGoogleLoginData(result.data);
        setLinkingPassword('');
        setLinkingAgreed(false);
        setLinkingDialogVisible(true);
        setIsLoading(false);
        return;
      }

      const { memberId, email, name, accessToken, refreshToken, isNewUser } = result.data;

      if (isNewUser) {
        console.log('[프라이빗키 인증] 구글 소셜 정보 없음 - 계정 연동 팝업 표시');

        const googleEmail = result.data.email || '';

        setLinkingEmail(googleEmail);
        setGoogleLoginData(result.data);
        setLinkingPassword('');
        setLinkingAgreed(false);
        setLinkingDialogVisible(true);
        setIsLoading(false);
        return;
      }

      if (memberId !== currentMemberId) {
        console.log('[프라이빗키 인증] 계정 불일치:', { memberId, currentMemberId });
        await showAlert(
          t('common.messages.error') || '오류',
          '현재 계정과 일치하지 않는 구글 계정입니다. 다시 시도해주세요.',
        );
        setIsLoading(false);
        return;
      }

      console.log('[프라이빗키 인증] 인증 성공 - 프라이빗 키 화면으로 이동');

      if (accessToken && memberId) {
        try {
          const ssidw = encryptSHA256(accessToken);
          await saveSession(memberId, ssidw);

          await AsyncStorage.setItem('userSessionToken', accessToken || '');
          if (refreshToken) {
            await AsyncStorage.setItem('refreshToken', refreshToken);
          }
        } catch (sessionError) {
          console.warn('[프라이빗키 인증] 세션 업데이트 실패 (계속 진행):', sessionError);
        }
      }

      reset(ROUTES.walletPrivateKeyDisplay);
    } catch (error: any) {
      console.error('[프라이빗키 인증] 오류:', error);
      await showAlert(
        t('common.messages.error') || '오류',
        error.message || '구글 인증 중 오류가 발생했습니다.',
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleLinkAccount = async () => {
    if (!linkingPassword.trim()) {
      await showAlert(t('common.messages.error'), t('screens.login.errors.passwordRequired') || '비밀번호를 입력해주세요.');
      return;
    }

    if (!linkingAgreed) {
      await showAlert(t('common.messages.error'), '계정 연동에 동의해주세요.');
      return;
    }

    setIsLinkingLoading(true);

    try {
      console.log('[프라이빗키 인증] 계정 연동 시작:', linkingEmail);

      const response = await connectGoogleAccount(
        googleLoginData,
        linkingPassword,
        undefined,
        currentMemberId ?? undefined,
      );

      if (!response.success || (response.code !== 200 && response.code !== '200')) {
        const errorMessage = response.message || t('screens.login.errors.loginFailed') || '계정 연동에 실패했습니다.';
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
        await showAlert(t('common.messages.error'), t('screens.login.errors.userDataNotFound') || '사용자 정보를 찾을 수 없습니다.');
        setIsLinkingLoading(false);
        return;
      }

      const linkedMemberId = userData.member || userData.memberId;
      if (linkedMemberId !== currentMemberId) {
        console.log('[프라이빗키 인증] 연동 후 계정 불일치:', { linkedMemberId, currentMemberId });
        await showAlert(
          t('common.messages.error') || '오류',
          '현재 계정과 일치하지 않습니다. 다시 시도해주세요.',
        );
        setIsLinkingLoading(false);
        return;
      }

      console.log('[프라이빗키 인증] 연동 성공 - 세션 저장 진행');

      const extrastr = userData.extrastr;
      if (extrastr && linkedMemberId) {
        const ssidw = encryptSHA256(extrastr);
        await saveSession(linkedMemberId, ssidw);
      }

      await AsyncStorage.setItem('userData', JSON.stringify(userData));
      const sessionToken = userData.extrastr || '';
      await AsyncStorage.setItem('userSessionToken', sessionToken);
      await AsyncStorage.setItem('isLoggedIn', 'true');
      await AsyncStorage.setItem('rememberMe', 'true');
      await AsyncStorage.setItem('loginType', 'google');

      console.log('[프라이빗키 인증] 연동 완료 - 프라이빗 키 화면으로 이동');

      setLinkingDialogVisible(false);

      reset(ROUTES.walletPrivateKeyDisplay);
    } catch (error) {
      console.error('[프라이빗키 인증] 계정 연동 오류:', error);
      await showAlert(
        t('common.messages.error'),
        '계정 연동 중 오류가 발생했습니다.',
      );
    } finally {
      setIsLinkingLoading(false);
    }
  };

  return (
    <SafeView style={styles.container}>
      <Header
        title="구글 인증"
        onBackPress={goBack}
        showBackButton
      />
      <SafeScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.descriptionContainer}>
          <Text style={styles.description}>
            프라이빗 키를 다운로드하기 위해 구글 계정으로 인증이 필요합니다.
          </Text>
        </View>

        <View style={styles.buttonWrapper}>
          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color={COLORS.buttonPrimary} />
            </View>
          ) : (
            <PrimaryButton
              title="구글로 인증하기"
              onPress={handleGoogleAuth}
              fullWidth
              disabled={isLoading}
            />
          )}
        </View>
      </SafeScrollView>

      {}
      <Dialog
        visible={linkingDialogVisible}
        title="계정 연결"
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
          <Text style={styles.linkingMessage}>
            {`XRUN 계정에 Google 계정을 연결하면
보다 간편하게 로그인할 수 있습니다.

구글 계정과 xrun계정 `}
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
    </SafeView>
  );
};

const styles = StyleSheet.create({
  container: {
    ...COMMON_STYLES.container,
  },
  scrollContent: {
    flexGrow: 1,
    ...COMMON_STYLES.scrollContent,
    padding: 20,
  },
  descriptionContainer: {
    marginBottom: 40,
    paddingHorizontal: 20,
  },
  description: {
    fontSize: FONTS.size.medium,
    lineHeight: 24,
    color: COLORS.text,
    fontFamily: FONTS.family.regular,
    textAlign: 'center',
  },
  buttonWrapper: {
    width: '100%',
    maxWidth: 780,
    alignSelf: 'center',
  },
  loadingContainer: {
    height: 56,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
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
});
