import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { SafeScrollView } from '../components';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Header, FormField, PrimaryButton } from '../components';
import { COLORS, COMMON_STYLES, LIST_STYLES, FONTS } from '../constants';
import { ROUTES, useAppNavigation } from '../navigation';
import { getMyRecommender, checkCanSetRecommender, setRecommender } from '../services';
import { useAlertDialog } from '../context/AlertDialogContext';

export const MyInfoReferralScreen = () => {
  const { t } = useTranslation();
  const { goBack, navigate } = useAppNavigation();
  const { showAlert } = useAlertDialog();
  const [newRefEmail, setNewRefEmail] = useState('');
  const [currentRefEmail, setCurrentRefEmail] = useState('');
  const [currentRefName, setCurrentRefName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isDisable, setIsDisable] = useState(false);
  const [member, setMember] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const AsyncUserData = await AsyncStorage.getItem('userData');
        if (!AsyncUserData) {
          setIsLoading(false);
          return;
        }

        const data = JSON.parse(AsyncUserData);
        const memberId = data?.member ? String(data.member) : null;
        setMember(memberId);
        setUserEmail(data?.email || '');

        if (!memberId) {
          setIsLoading(false);
          return;
        }

        console.log('[레퍼럴 수정] 현재 레퍼럴 조회 요청, member:', memberId);

        const result = await getMyRecommender(memberId, navigate);

        console.log('[레퍼럴 수정] getMyRecommender 응답:', result);

        if (result && result.status === 'success') {

          const rawData = result.data;
          const recommender = Array.isArray(rawData) ? rawData[0] : rawData;

          if (recommender && recommender.email) {

            const displayEmail = recommender.masked_email || recommender.email || '';
            const displayName =
              recommender.email
                ? (recommender.firstname || recommender.lastname
                    ? `${recommender.firstname || ''}${recommender.lastname || ''}`
                    : recommender.email)
                : '';

            setCurrentRefEmail(displayEmail);
            setCurrentRefName(displayName);
          } else {

            setCurrentRefEmail('');
            setCurrentRefName('');
          }
        } else {

          console.error('[레퍼럴 수정] 레퍼럴 조회 오류:', result?.message);
          setCurrentRefEmail('');
          setCurrentRefName('');
        }
      } catch (err) {
        console.error('[레퍼럴 수정] 데이터 로드 오류:', err);
        setCurrentRefEmail('');
        setCurrentRefName('');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  const handleConfirm = async () => {

    if (!newRefEmail || newRefEmail.trim() === '') {
      await showAlert(t('screens.myInfoReferral.alerts.warning'), t('screens.myInfoReferral.alerts.emailRequired'));
      return;
    }

    if (newRefEmail === currentRefEmail) {
      await showAlert(t('screens.myInfoReferral.alerts.warning'), t('screens.myInfoReferral.alerts.noChange'));
      return;
    }

    if (!member) {
      await showAlert(t('screens.myInfoReferral.alerts.error'), t('screens.myInfoReferral.alerts.userDataNotFound'));
      return;
    }

    try {
      setIsDisable(true);

      console.log('[레퍼럴 수정] 레퍼럴 설정 가능 여부 검증 요청:', newRefEmail);
      const checkResult = await checkCanSetRecommender(member, newRefEmail.trim(), navigate);

      console.log('[레퍼럴 수정] checkCanSetRecommender 응답:', checkResult);

      if (!checkResult) {

        await showAlert(t('screens.myInfoReferral.alerts.failed'), t('screens.myInfoReferral.alerts.failedMessage'));
        setIsDisable(false);
        return;
      }

      const responseCode = checkResult.code || checkResult.status_code || 500;
      const responseMessage = (checkResult?.message || '').toLowerCase();

      const isSelfReferral =
        newRefEmail.trim().toLowerCase() === userEmail.toLowerCase() ||
        responseCode === 400 ||
        responseMessage.includes('self') ||
        responseMessage.includes('yourself') ||
        responseMessage.includes('own') ||
        responseMessage.includes('자기 자신') ||
        responseMessage.includes('본인') ||
        responseMessage.includes('cannot set yourself') ||
        (checkResult?.data && checkResult.data.canSet === false && responseCode === 400);

      if (isSelfReferral) {
        await showAlert(t('screens.myInfoReferral.alerts.warning'), t('screens.myInfoReferral.alerts.cannotSetSelf'));
        setIsDisable(false);
        return;
      }

      if (responseCode === 404) {
        await showAlert(t('screens.myInfoReferral.alerts.failed'), t('screens.myInfoReferral.alerts.notFound'));
        setIsDisable(false);
        return;
      }

      if (responseCode === 409) {

        const isAlreadyHasRecommender =
          responseMessage.includes('already has') ||
          responseMessage.includes('already have') ||
          responseMessage.includes('이미 추천') ||
          responseMessage.includes('추천 기록');

        const message = isAlreadyHasRecommender
          ? t('screens.myInfoReferral.alerts.alreadyHasRecommender')
          : t('screens.myInfoReferral.alerts.alreadyRegistered');

        await showAlert(t('screens.myInfoReferral.alerts.warning'), message);
        setIsDisable(false);
        return;
      }

      if (responseCode !== 200) {
        await showAlert(t('screens.myInfoReferral.alerts.failed'), t('screens.myInfoReferral.alerts.cannotSet'));
        setIsDisable(false);
        return;
      }

      const checkData = Array.isArray(checkResult.data) ? checkResult.data[0] : checkResult.data;
      if (checkData && checkData.canSet === false) {
        await showAlert(t('screens.myInfoReferral.alerts.warning'), t('screens.myInfoReferral.alerts.alreadyHasRecommender'));
        setIsDisable(false);
        return;
      }

      console.log('[레퍼럴 수정] 레퍼럴 설정 요청:', newRefEmail);
      const setResult = await setRecommender(member, newRefEmail.trim(), navigate);

      console.log('[레퍼럴 수정] setRecommender 응답:', setResult);

      if (setResult && setResult.status === 'success') {
        await showAlert(
          t('screens.myInfoReferral.alerts.success'),
          t('screens.myInfoReferral.alerts.successMessage'),
          [
            {
              text: t('screens.myInfoReferral.alerts.ok'),
              onPress: () => {
                navigate(ROUTES.myInfo);
              },
            },
          ],
        );
      } else {
        await showAlert(t('screens.myInfoReferral.alerts.failed'), t('screens.myInfoReferral.alerts.failedMessage'));
      }
    } catch (error) {
      console.error('[레퍼럴 수정] 레퍼럴 수정 오류:', error);
      await showAlert(t('screens.myInfoReferral.alerts.failed'), t('screens.myInfoReferral.alerts.failedMessage'));
    } finally {
      setIsDisable(false);
    }
  };

  return (
    <View style={styles.container}>
      <Header title={t('screens.myInfoReferral.title')} onBackPress={goBack} showBackButton />
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.buttonPrimary} />
        </View>
      ) : (
        <SafeScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          autoAdjustKeyboardPadding={true}
        >
          <View style={styles.inner}>
            {

}
            <FormField
              label={t('screens.myInfoReferral.currentReferral')}
              value={
                currentRefEmail || currentRefName
                  ? currentRefName && currentRefEmail
                    ? `${currentRefName} (${currentRefEmail})`
                    : currentRefEmail || currentRefName || ''
                  : t('screens.myInfoReferral.noReferral')
              }
              editable={false}
            />

            <FormField
              label={t('screens.myInfoReferral.newReferralLabel')}
              value={newRefEmail}
              onChangeText={setNewRefEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              placeholder={t('screens.myInfoReferral.newReferralPlaceholder')}
              editable={!isDisable}
            />
          </View>

          <View style={styles.bottomSection}>
            <PrimaryButton
              title={isDisable ? t('screens.myInfoReferral.processing') : t('screens.myInfoReferral.saveButton')}
              fullWidth
              onPress={handleConfirm}
              style={[styles.primaryButton, isDisable && styles.buttonDisabled]}
              disabled={isDisable}
            />
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    flexGrow: 1,
    ...COMMON_STYLES.scrollContent,
  },
  inner: {
    ...LIST_STYLES.large,
  },
  sectionLabel: {
    fontSize: FONTS.size.medium,
    lineHeight: 24,
    color: '#2a2727',
    fontFamily: 'Roboto-Medium',
    marginBottom: 8,
  },
  card: {
    width: '100%',
    borderRadius: 15,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 18,
    shadowColor: '#3629b7',
    shadowOpacity: 0.07,
    shadowRadius: 15,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  cardName: {
    fontSize: FONTS.size.mmedium,
    fontFamily: 'Roboto-Medium',
    color: '#33395b',
  },
  cardEmail: {
    fontSize: FONTS.size.small,
    fontFamily: 'Roboto-Regular',
    color: '#bababa',
  },
  bottomSection: {
    ...COMMON_STYLES.bottomButtonContainer,
  },
  primaryButton: {
    width: '100%',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
});
