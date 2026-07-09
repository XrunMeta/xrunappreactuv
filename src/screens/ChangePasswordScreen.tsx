import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Header, FormField, PrimaryButton, SafeScrollView } from '../components';
import { COLORS, COMMON_STYLES, FONTS, FORM_STYLES } from '../constants';
import { useAppNavigation, ROUTES } from '../navigation';
import { useAlertDialog } from '../context/AlertDialogContext';
import { updatePassword } from '../services';
import { verifyAppleIdentity, isAppleLoggedIn } from '../services/appleReauth';

export const ChangePasswordScreen = () => {
  const { t } = useTranslation();
  const { goBack, navigate } = useAppNavigation();
  const { showAlert } = useAlertDialog();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [newPasswordSecure, setNewPasswordSecure] = useState(true);
  const [confirmPasswordSecure, setConfirmPasswordSecure] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    (async () => {
      if (!(await isAppleLoggedIn())) return;
      const result = await verifyAppleIdentity('changePassword');
      if (!result.ok) goBack();
    })();

  }, []);

  const filterPasswordInput = (value: string) => value.replace(/[^\x21-\x7E]/g, '');

  const handleSubmit = async () => {

    if (!newPassword.trim()) {
      await showAlert(
        t('screens.changePassword.alerts.error'),
        t('screens.changePassword.alerts.newPasswordRequired'),
      );
      return;
    }

    if (newPassword.length < 6) {
      await showAlert(
        t('screens.changePassword.alerts.error'),
        t('screens.changePassword.alerts.passwordTooShort'),
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      await showAlert(
        t('screens.changePassword.alerts.error'),
        t('screens.changePassword.alerts.passwordMismatch'),
      );
      return;
    }

    try {
      setIsSubmitting(true);

      const userDataStr = await AsyncStorage.getItem('userData');
      if (!userDataStr) {
        await showAlert(
          t('screens.changePassword.alerts.error'),
          t('screens.changePassword.alerts.userDataNotFound'),
        );
        setIsSubmitting(false);
        return;
      }

      const userData = JSON.parse(userDataStr);
      const member = userData.member;

      if (!member) {
        await showAlert(
          t('screens.changePassword.alerts.error'),
          t('screens.changePassword.alerts.userDataNotFound'),
        );
        setIsSubmitting(false);
        return;
      }

      await updatePassword(member, newPassword, navigate);

      await showAlert(
        t('screens.changePassword.alerts.success'),
        t('screens.changePassword.alerts.successMessage'),
        [
          {
            text: t('screens.changePassword.alerts.confirm'),
            onPress: () => {
              goBack();
            },
          },
        ],
      );
    } catch (error) {
      console.error('[비밀번호 변경] 변경 처리 중 오류:', error);
      await showAlert(
        t('screens.changePassword.alerts.error'),
        t('screens.changePassword.alerts.changeFailed'),
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <Header title={t('screens.changePassword.title')} onBackPress={goBack} showBackButton />
      <SafeScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        autoAdjustKeyboardPadding={true}
      >
        <View style={styles.formFieldContainer}>
          <FormField
            label={t('screens.changePassword.newPassword')}
            placeholder={t('screens.changePassword.newPasswordPlaceholder')}
            secureTextEntry={newPasswordSecure}
            value={newPassword}
            onChangeText={(text) => setNewPassword(filterPasswordInput(text))}
            rightAccessory={
              <TouchableOpacity onPress={() => setNewPasswordSecure((prev) => !prev)}>
                <Feather name={newPasswordSecure ? 'eye-off' : 'eye'} size={20} color="#b3b6be" />
              </TouchableOpacity>
            }
            containerStyle={styles.fieldContainer}
          />

          <FormField
            label={t('screens.changePassword.confirmPassword')}
            placeholder={t('screens.changePassword.confirmPasswordPlaceholder')}
            secureTextEntry={confirmPasswordSecure}
            value={confirmPassword}
            onChangeText={(text) => setConfirmPassword(filterPasswordInput(text))}
            rightAccessory={
              <TouchableOpacity onPress={() => setConfirmPasswordSecure((prev) => !prev)}>
                <Feather name={confirmPasswordSecure ? 'eye-off' : 'eye'} size={20} color="#b3b6be" />
              </TouchableOpacity>
            }
            containerStyle={styles.fieldContainer}
          />

          <Text style={styles.helperText}>
            {t('screens.changePassword.helperText')}
          </Text>
        </View>

        <View style={styles.bottomSection}>
          <PrimaryButton
            title={isSubmitting ? t('screens.changePassword.processing') : t('screens.changePassword.changeButton')}
            fullWidth
            onPress={handleSubmit}
            style={styles.primaryButton}
            disabled={isSubmitting}
          />
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
  formFieldContainer: {
    ...FORM_STYLES.fieldContainer,
  },
  fieldContainer: {
    borderWidth: 0,
  },
  helperText: {
    fontSize: FONTS.size.small,
    lineHeight: 15,
    color: '#747474',
    fontFamily: 'Roboto-Regular',
  },
  bottomSection: {
    ...COMMON_STYLES.bottomButtonContainer,
  },
  primaryButton: {
    width: '100%',
  },
});
