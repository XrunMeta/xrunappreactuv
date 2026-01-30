import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Header, SafeView, PrimaryButton, SafeScrollView, FormField, Dialog } from '../components';
import { COLORS, COMMON_STYLES, FONTS, SIZES } from '../constants';
import { useAppNavigation, ROUTES } from '../navigation';
import { useAlertDialog } from '../context/AlertDialogContext';
import {
  getGoogleIdToken,
  googleAuthForWallet,
  checkSocialForWallet,
} from '../services';

export const WalletPrivateKeyGoogleAuthScreen = () => {
  const { t } = useTranslation();
  const { goBack, reset, navigate } = useAppNavigation();
  const { showAlert } = useAlertDialog();

  const [currentMemberId, setCurrentMemberId] = useState<number | null>(null);
  const [currentEmail, setCurrentEmail] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const [hasGoogleSocialPrefetched, setHasGoogleSocialPrefetched] = useState<boolean | null>(null);

  const [linkingDialogVisible, setLinkingDialogVisible] = useState(false);
  const [linkingPassword, setLinkingPassword] = useState('');
  const [passwordDialogIdToken, setPasswordDialogIdToken] = useState<string | null>(null);
  const [isLinkingLoading, setIsLinkingLoading] = useState(false);

  useEffect(() => {
    loadCurrentUserInfo();
  }, []);

  useEffect(() => {
    if (!currentMemberId) return;
    let cancelled = false;
    (async () => {
      try {
        const checkRes = await checkSocialForWallet(currentMemberId, navigate);
        if (!cancelled) {
          const has = checkRes.success && checkRes.data?.hasGoogleSocial === true;
          setHasGoogleSocialPrefetched(has);
          console.log('[프라이빗키 인증] 소셜 연동 여부 미리 조회:', has);
        }
      } catch (e) {
        if (!cancelled) setHasGoogleSocialPrefetched(null);
      }
    })();
    return () => { cancelled = true; };
  }, [currentMemberId]);

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

    let idToken: string | null = null;
    try {

      let hasGoogleSocial = false;
      if (hasGoogleSocialPrefetched !== null) {
        hasGoogleSocial = hasGoogleSocialPrefetched;
      } else {
        try {
          const checkRes = await checkSocialForWallet(currentMemberId, navigate);
          hasGoogleSocial = checkRes.success && checkRes.data?.hasGoogleSocial === true;
          console.log('[프라이빗키 인증] 구글 연동 여부:', hasGoogleSocial);
        } catch (checkErr) {
          console.warn('[프라이빗키 인증] check-social-for-wallet 실패, 기존 플로우로 진행:', checkErr);
        }
      }

      console.log('[프라이빗키 인증] 구글 인증 시작');
      const tokenResult = await getGoogleIdToken(!hasGoogleSocial);
      if (!tokenResult?.idToken) {
        await showAlert(
          t('common.messages.error') || '오류',
          '구글 로그인에 실패했거나 취소되었습니다.',
        );
        setIsLoading(false);
        return;
      }
      idToken = tokenResult.idToken;

      if (!hasGoogleSocial) {
        console.log('[프라이빗키 인증] 소셜 없음 - 비밀번호 입력 다이얼로그 표시');
        setPasswordDialogIdToken(idToken);
        setLinkingPassword('');
        setLinkingDialogVisible(true);
        setIsLoading(false);
        return;
      }

      const res = await googleAuthForWallet(currentMemberId, idToken, undefined, navigate);
      if (res.success && res.data?.canProceed) {
        console.log('[프라이빗키 인증] 인증 성공 - 프라이빗 키 화면으로 이동');
        reset(ROUTES.walletPrivateKeyDisplay);
        setIsLoading(false);
        return;
      }
      await showAlert(
        t('common.messages.error') || '오류',
        res.message || '구글 인증 처리 중 오류가 발생했습니다.',
      );
    } catch (error: any) {
      const status = error.response?.status;
      const body = error.response?.data;
      if (status === 400 && body?.data?.requirePassword === true && idToken) {
        console.log('[프라이빗키 인증] 소셜 없음 - 비밀번호 입력 다이얼로그 표시');
        setPasswordDialogIdToken(idToken);
        setLinkingPassword('');
        setLinkingDialogVisible(true);
        setIsLoading(false);
        return;
      }
      if (status === 401) {
        await showAlert(
          t('common.messages.error') || '오류',
          body?.message || '비밀번호가 일치하지 않습니다.',
        );
        setIsLoading(false);
        return;
      }
      if (status === 409) {
        await showAlert(
          t('common.messages.error') || '오류',
          body?.message || '이 구글 이메일은 이미 다른 계정에 가입되어 있습니다. 다른 구글 이메일을 사용해 주세요.',
        );
        setIsLoading(false);
        return;
      }
      console.error('[프라이빗키 인증] 오류:', error);
      await showAlert(
        t('common.messages.error') || '오류',
        body?.message || error.message || '구글 인증 중 오류가 발생했습니다.',
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordSubmit = async () => {
    if (!linkingPassword.trim()) {
      await showAlert(t('common.messages.error'), t('screens.login.errors.passwordRequired') || '비밀번호를 입력해주세요.');
      return;
    }
    if (!passwordDialogIdToken || !currentMemberId) {
      setLinkingDialogVisible(false);
      setPasswordDialogIdToken(null);
      return;
    }

    setIsLinkingLoading(true);
    try {
      console.log('[프라이빗키 인증] 비밀번호로 구글 연동 재호출');
      const res = await googleAuthForWallet(
        currentMemberId,
        passwordDialogIdToken,
        linkingPassword,
        navigate,
      );
      if (res.success && res.data?.canProceed) {
        console.log('[프라이빗키 인증] 연동 성공 - 프라이빗 키 화면으로 이동');
        setLinkingDialogVisible(false);
        setPasswordDialogIdToken(null);
        setLinkingPassword('');
        reset(ROUTES.walletPrivateKeyDisplay);
        setIsLinkingLoading(false);
        return;
      }
      await showAlert(
        t('common.messages.error') || '오류',
        res.message || '구글 인증 처리 중 오류가 발생했습니다.',
      );
    } catch (error: any) {
      const status = error.response?.status;
      const body = error.response?.data;
      if (status === 401) {
        await showAlert(
          t('common.messages.error') || '오류',
          body?.message || '비밀번호가 일치하지 않습니다.',
        );
      } else {
        console.error('[프라이빗키 인증] 비밀번호 연동 오류:', error);
        await showAlert(
          t('common.messages.error') || '오류',
          body?.message || error.message || '계정 연동 중 오류가 발생했습니다.',
        );
      }
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
        title="비밀번호 입력"
        onClose={() => {
          setLinkingDialogVisible(false);
          setPasswordDialogIdToken(null);
          setLinkingPassword('');
        }}
        actions={[
          {
            label: t('common.buttons.cancel') || '취소',
            onPress: () => {
              setLinkingDialogVisible(false);
              setPasswordDialogIdToken(null);
              setLinkingPassword('');
            },
            variant: 'secondary',
            disabled: isLinkingLoading,
          },
          {
            label: t('common.buttons.confirm') || '확인',
            onPress: handlePasswordSubmit,
            variant: 'primary',
            disabled: isLinkingLoading,
          },
        ]}
      >
        <View style={styles.linkingContainer}>
          <Text style={styles.linkingMessage}>
            현재 로그인된 계정(XRUN 계정)의 비밀번호를 입력해 주세요.
          </Text>
          <FormField
            label={t('screens.login.xrunPasswordLabel') || '현재 로그인된 계정(XRUN) 비밀번호'}
            placeholder={t('screens.login.passwordPlaceholder') || '비밀번호를 입력하세요'}
            secureTextEntry={true}
            value={linkingPassword}
            onChangeText={setLinkingPassword}
            containerStyle={styles.linkingInput}
            editable={!isLinkingLoading}
          />

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
    marginBottom: 8,
    marginTop: 8,
    fontFamily: 'Roboto-Regular',
  },
  linkingMessageSub: {
    marginBottom: 20,
    fontSize: FONTS.size.small,
    color: '#666666',
  },
  linkingInput: {
    marginBottom: 16,
  },
  linkingLoader: {
    alignItems: 'center',
    marginTop: 10,
  },
});
