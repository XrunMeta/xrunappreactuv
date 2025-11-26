import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Text, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useTranslation } from 'react-i18next';
import { Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Header, FormField, PrimaryButton } from '../components';
import { COLORS, COMMON_STYLES } from '../constants';
import { useAppNavigation, ROUTES } from '../navigation';
import { closeMembership } from '../services';
import { useAlertDialog } from '../context/AlertDialogContext';

export const MyInfoCloseMembershipScreen = () => {
  const { t } = useTranslation();
  const { goBack, navigate } = useAppNavigation();
  const { showAlert } = useAlertDialog();
  const [password, setPassword] = useState('');
  const [secure, setSecure] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {

    if (!password.trim()) {
      await showAlert(t('screens.myInfoCloseMembership.alerts.passwordRequired'), t('screens.myInfoCloseMembership.alerts.passwordRequiredMessage'));
      return;
    }

    await showAlert(
      t('screens.myInfoCloseMembership.alerts.closeMembership'),
      t('screens.myInfoCloseMembership.alerts.closeMembershipMessage'),
      [
        {
          text: t('screens.myInfoCloseMembership.alerts.cancel'),
          style: 'cancel',
        },
        {
          text: t('screens.myInfoCloseMembership.alerts.confirm'),
          style: 'destructive',
          onPress: async () => {
            try {
              setIsSubmitting(true);

              const userDataStr = await AsyncStorage.getItem('userData');
              if (!userDataStr) {
                await showAlert(t('screens.myInfoCloseMembership.alerts.error'), t('screens.myInfoCloseMembership.alerts.errorMessage'));
                setIsSubmitting(false);
                return;
              }

              const userData = JSON.parse(userDataStr);
              const member = userData.member;

              if (!member) {
                await showAlert(t('screens.myInfoCloseMembership.alerts.error'), t('screens.myInfoCloseMembership.alerts.errorMessage'));
                setIsSubmitting(false);
                return;
              }

              const success = await closeMembership(
                member,
                password,
                '',
                0,
                navigate,
              );

              if (!success) {
                await showAlert(t('screens.myInfoCloseMembership.alerts.closeFailed'), t('screens.myInfoCloseMembership.alerts.closeFailedMessage'));
                setIsSubmitting(false);
                return;
              }

              navigate(ROUTES.myInfoCloseMembershipSuccess);
            } catch (error) {
              console.error('[회원 탈퇴] 탈퇴 처리 중 오류:', error);
              await showAlert(t('screens.myInfoCloseMembership.alerts.error'), t('screens.myInfoCloseMembership.alerts.closeError'));
              setIsSubmitting(false);
            }
          },
        },
      ],
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <Header title={t('screens.myInfoCloseMembership.title')} onBackPress={goBack} showBackButton />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.inner}>
          <FormField
            label={t('screens.myInfoCloseMembership.passwordLabel')}
            placeholder={t('screens.myInfoCloseMembership.passwordPlaceholder')}
            secureTextEntry={secure}
            value={password}
            onChangeText={setPassword}
            rightAccessory={
              <TouchableOpacity onPress={() => setSecure((prev) => !prev)}>
                <Feather name={secure ? 'eye-off' : 'eye'} size={20} color="#b3b6be" />
              </TouchableOpacity>
            }
          />
          <Text style={styles.helperText}>
            {t('screens.myInfoCloseMembership.helperText')}
          </Text>
        </View>

        <View style={styles.bottomSection}>
          <PrimaryButton
            title={isSubmitting ? t('screens.myInfoCloseMembership.processing') : t('screens.myInfoCloseMembership.confirmButton')}
            fullWidth
            onPress={handleSubmit}
            style={styles.primaryButton}
            disabled={isSubmitting}
          />
        </View>
      </ScrollView>
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
    paddingBottom: 40,
  },
  inner: {
    width: '100%',
    maxWidth: 780,
    alignSelf: 'center',
  },
  helperText: {
    marginTop: 8,
    fontSize: 12,
    lineHeight: 15,
    color: '#747474',
    fontFamily: 'Roboto-Regular',
  },
  bottomSection: {
    ...COMMON_STYLES.bottomSection,
  },
  primaryButton: {
    width: '100%',
  },
});

