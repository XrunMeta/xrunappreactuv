

import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AxiosError } from 'axios';
import { Header, PrimaryButton, SafeScrollView, FormField } from '../components';
import { ROUTES, useAppNavigation } from '../navigation';
import { useAlertDialog } from '../context/AlertDialogContext';
import { requestDeviceUnblock } from '../services';

const EMAIL_STORAGE_KEY = 'deviceUnblockRequestEmail';

export const DeviceUnblockRequestScreen = () => {
  const { t } = useTranslation();
  const tr = (k: string) => t(`screens.deviceBinding.${k}` as any);
  const { goBack, navigate } = useAppNavigation();
  const { showAlert } = useAlertDialog();

  const [email, setEmail] = useState('');
  const [reasonText, setReasonText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const stored = await AsyncStorage.getItem(EMAIL_STORAGE_KEY);
        if (stored) setEmail(stored);
      } catch {  }
    })();
  }, []);

  const handleSubmit = async () => {
    if (!email) {

      await showAlert(tr('unblockScreenTitle'), tr('unblockSubmitFailed'));
      return;
    }
    setIsSubmitting(true);
    try {
      await requestDeviceUnblock(email, reasonText.trim() || undefined);
      setIsSubmitting(false);
      try { await AsyncStorage.removeItem(EMAIL_STORAGE_KEY); } catch {  }
      await showAlert(
        tr('unblockScreenTitle'),
        tr('unblockSubmitted'),
        [{ text: t('common.buttons.confirm') || '확인', onPress: () => navigate(ROUTES.login) }],
      );
    } catch (error) {
      setIsSubmitting(false);
      if (error instanceof AxiosError && error.response?.status === 429) {
        await showAlert(tr('unblockScreenTitle'), tr('unblockTooMany'));
      } else {
        await showAlert(tr('unblockScreenTitle'), tr('unblockSubmitFailed'));
      }
    }
  };

  return (
    <View style={styles.container}>
      <Header title={tr('unblockScreenTitle')} onBackPress={goBack} showBackButton />
      <SafeScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <FormField
          label={tr('unblockReasonLabel')}
          placeholder={tr('unblockReasonPlaceholder')}
          value={reasonText}
          onChangeText={setReasonText}
          editable={!isSubmitting}
          multiline
          numberOfLines={4}
          containerStyle={styles.fieldContainer}
          style={styles.multilineInput}
        />
        <View style={styles.buttonWrapper}>
          {isSubmitting
            ? <ActivityIndicator size="small" color="#000" />
            : <PrimaryButton title={tr('unblockSubmit')} fullWidth onPress={handleSubmit} />}
        </View>
      </SafeScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  scrollContent: { padding: 20, flexGrow: 1 },
  fieldContainer: { marginBottom: 14 },
  multilineInput: { minHeight: 100, textAlignVertical: 'top', paddingTop: 12 },
  buttonWrapper: { width: '100%', maxWidth: 780, alignSelf: 'center', marginTop: 10, marginBottom: 16 },
});
