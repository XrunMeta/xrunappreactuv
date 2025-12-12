import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { SafeScrollView } from '../components';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Header, FormField, PrimaryButton, SecondaryButton } from '../components';
import { COLORS, COMMON_STYLES, SIZES, FONTS } from '../constants';
import { ROUTES, useAppNavigation } from '../navigation';
import { checkReferralEmail, registerReferralByEmail } from '../services';
import { useAlertDialog } from '../context/AlertDialogContext';

export const ReferralInputScreen = () => {
  const { t } = useTranslation();
  const { reset } = useAppNavigation();
  const { showAlert } = useAlertDialog();
  const [referralEmail, setReferralEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [member, setMember] = useState<number | null>(null);
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const userDataStr = await AsyncStorage.getItem('userData');
        if (!userDataStr) {
          console.error('[추천인 입력] 사용자 데이터를 찾을 수 없습니다.');

          reset(ROUTES.map);
          return;
        }

        const userData = JSON.parse(userDataStr);
        const memberId = userData?.member;
        const email = userData?.email || '';

        if (!memberId) {
          console.error('[추천인 입력] member ID를 찾을 수 없습니다.');
          reset(ROUTES.map);
          return;
        }

        setMember(memberId);
        setUserEmail(email);
      } catch (error) {
        console.error('[추천인 입력] 데이터 로드 오류:', error);
        reset(ROUTES.map);
      }
    };

    loadUserData();
  }, [reset]);

  const handleSubmit = async () => {
    if (!referralEmail.trim()) {
      await showAlert(
        t('screens.referralInput.alerts.warning') || '알림',
        t('screens.referralInput.alerts.emailRequired') || '추천인 이메일을 입력해주세요.',
      );
      return;
    }

    if (!member) {
      await showAlert(
        t('screens.referralInput.alerts.error') || '오류',
        t('screens.referralInput.alerts.userDataNotFound') || '사용자 정보를 찾을 수 없습니다.',
      );
      return;
    }

    if (referralEmail.trim().toLowerCase() === userEmail.toLowerCase()) {
      await showAlert(
        t('screens.referralInput.alerts.warning') || '알림',
        t('screens.referralInput.alerts.selfReferral') || '자기 자신을 추천인으로 등록할 수 없습니다.',
      );
      return;
    }

    setIsSubmitting(true);

    try {

      console.log('[추천인 입력] 추천인 이메일 확인 요청:', referralEmail.trim());
      const referralMemberId = await checkReferralEmail(referralEmail.trim(), reset);

      if (!referralMemberId) {

        const buttonIndex = await showAlert(
          t('screens.referralInput.alerts.referralConfirm') || '추천인 확인',
          t('screens.referralInput.errors.referralInvalid') || '유효하지 않은 추천인 이메일입니다. 계속 진행하시겠습니까?',
          [
            {
              text: t('screens.referralInput.alerts.cancel') || '취소',
              style: 'cancel',
              onPress: () => {
                setIsSubmitting(false);
              },
            },
            {
              text: t('screens.referralInput.alerts.continue') || '계속',
              onPress: () => {

                handleSkip();
              },
            },
          ],
        );

        if (buttonIndex === 0) {

          setIsSubmitting(false);
          return;
        }

        return;
      }

      console.log('[추천인 입력] 추천인 등록 요청:', { member, email: referralEmail.trim() });
      const registerResult = await registerReferralByEmail(member, referralEmail.trim(), reset);

      console.log('[추천인 입력] 추천인 등록 결과:', registerResult);

      await showAlert(
        t('screens.referralInput.alerts.success') || '완료',
        t('screens.referralInput.alerts.registered') || '추천인이 등록되었습니다.',
      );

      reset(ROUTES.map);
    } catch (error: any) {
      console.error('[추천인 입력] 오류:', error);
      await showAlert(
        t('screens.referralInput.alerts.error') || '오류',
        error.message || t('screens.referralInput.errors.registerFailed') || '추천인 등록에 실패했습니다.',
      );
      setIsSubmitting(false);
    }
  };

  const handleSkip = () => {
    setIsSubmitting(false);
    reset(ROUTES.map);
  };

  return (
    <View style={styles.container}>
      <Header
        title={t('screens.referralInput.title') || '추천인 입력'}
        showBackButton={false}
      />

      <SafeScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          <Text style={styles.description}>
            {t('screens.referralInput.description') || '추천인 이메일을 입력하시면 보너스를 받으실 수 있습니다.\n(선택사항)'}
          </Text>

          <FormField
            label={t('screens.referralInput.emailLabel') || '추천인 이메일'}
            value={referralEmail}
            onChangeText={setReferralEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            placeholder={t('screens.referralInput.emailPlaceholder') || 'oth-staff@example.invalid'}
            editable={!isSubmitting}
            containerStyle={styles.formField}
          />

          {isSubmitting && (
            <ActivityIndicator size="large" color={COLORS.buttonPrimary} style={styles.loader} />
          )}

          <View style={styles.buttonContainer}>
            <PrimaryButton
              title={isSubmitting ? (t('screens.referralInput.processing') || '처리 중...') : (t('screens.referralInput.submit') || '등록')}
              fullWidth
              onPress={handleSubmit}
              disabled={isSubmitting}
              style={styles.submitButton}
            />

            <SecondaryButton
              title={t('screens.referralInput.skip') || '건너뛰기'}
              fullWidth
              onPress={handleSkip}
              disabled={isSubmitting}
              style={styles.skipButton}
            />
          </View>
        </View>
      </SafeScrollView>
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
    paddingHorizontal: SIZES.medium,
  },
  content: {
    flex: 1,
    paddingTop: SIZES.large,
  },
  description: {
    ...FONTS.body,
    color: COLORS.text,
    marginBottom: SIZES.xlarge,
    textAlign: 'center',
    lineHeight: 22,
  },
  formField: {
    marginBottom: SIZES.xlarge,
  },
  loader: {
    marginVertical: SIZES.medium,
  },
  buttonContainer: {
    ...COMMON_STYLES.bottomSection,
    gap: SIZES.medium,
  },
  submitButton: {
    marginBottom: 0,
  },
  skipButton: {
    marginBottom: 0,
  },
});
