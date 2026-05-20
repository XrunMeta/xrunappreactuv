import { useRef, useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, StyleSheet, TextInput } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useAppNavigation, ROUTES } from '../navigation';
import { SafeScrollView, FormField, PrimaryButton, Header } from '../components';
import { useAlertDialog } from '../context/AlertDialogContext';
import { sendForgotPasswordCode, resetPasswordWithCode } from '../services';
import { COLORS, FONTS } from '../constants';

type Stage = 'email' | 'code' | 'password';
const CODE_LENGTH = 6;

export const ForgotPasswordScreen = () => {
  const { t } = useTranslation();
  const tr = (k: string) => t(`screens.forgotPassword.${k}` as any);
  const { goBack, navigate } = useAppNavigation();
  const { showAlert } = useAlertDialog();
  const [stage, setStage] = useState<Stage>('email');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPin, setNewPin] = useState('');
  const [newPinConfirm, setNewPinConfirm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const hiddenInputRef = useRef<TextInput>(null);

  const handleSendCode = async () => {
    if (!email.trim()) { await showAlert(tr('alerts.notice'), tr('alerts.emailRequired')); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      await showAlert(tr('alerts.notice'), tr('alerts.emailInvalid')); return;
    }
    setIsLoading(true);
    const res = await sendForgotPasswordCode(email.trim(), navigate);
    setIsLoading(false);
    if (res.status === 'success') {
      await showAlert(tr('alerts.notice'), tr('alerts.codeSent'));
      setStage('code');
    } else if (res.code === 404) {
      await showAlert(tr('alerts.notice'), tr('alerts.emailNotRegistered'));
    } else {
      await showAlert(tr('alerts.notice'), res.message ?? tr('alerts.sendFailed'));
    }
  };

  const handleVerifyCode = async () => {
    if (code.length !== CODE_LENGTH) {
      await showAlert(tr('alerts.notice'), tr('alerts.codeRequired')); return;
    }
    setStage('password');
  };

  const handleResend = async () => {
    if (!email) return;
    setIsLoading(true);
    const res = await sendForgotPasswordCode(email.trim(), navigate);
    setIsLoading(false);
    if (res.status === 'success') {
      setCode('');
      await showAlert(tr('alerts.notice'), tr('alerts.codeResent'));
    } else {
      await showAlert(tr('alerts.notice'), res.message ?? tr('alerts.resendFailed'));
    }
  };

  const handleResetPassword = async () => {
    if (!newPin) {
      await showAlert(tr('alerts.notice'), tr('alerts.passwordRequired')); return;
    }
    const hasMinLength = newPin.length >= 7;
    const hasNumber = /\d/.test(newPin);
    const hasLowercase = /[a-z]/.test(newPin);
    const hasUppercase = /[A-Z]/.test(newPin);
    if (!(hasMinLength && hasNumber && hasLowercase && hasUppercase)) {
      await showAlert(tr('alerts.notice'), tr('alerts.passwordPolicy'));
      return;
    }
    if (newPin !== newPinConfirm) {
      await showAlert(tr('alerts.notice'), tr('alerts.passwordMismatch')); return;
    }
    setIsLoading(true);
    const res = await resetPasswordWithCode(email.trim(), code.trim(), newPin, navigate);
    setIsLoading(false);
    if (res.status === 'success') {
      await showAlert(tr('alerts.done'), tr('alerts.resetSuccess'), [
        { text: tr('alerts.confirm'), onPress: () => navigate(ROUTES.login) },
      ]);
    } else if (res.code === 401) {
      await showAlert(tr('alerts.notice'), tr('alerts.codeInvalid'), [
        { text: tr('alerts.reissue'), onPress: () => setStage('email') },
        { text: tr('alerts.confirm'), style: 'cancel' },
      ]);
    } else {
      await showAlert(tr('alerts.notice'), res.message ?? tr('alerts.resetFailed'));
    }
  };

  return (
    <View style={styles.container}>
      <Header title={stage === 'password' ? tr('titleReset') : tr('titleFind')} onBackPress={goBack} showBackButton />
      <SafeScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">

        {stage === 'email' && (
          <>
            <FormField label={tr('email.label')} placeholder={tr('email.placeholder')}
              keyboardType="email-address" autoCapitalize="none"
              value={email} onChangeText={setEmail} editable={!isLoading}
              containerStyle={styles.fieldContainer} />
            <View style={styles.buttonWrapper}>
              {isLoading
                ? <ActivityIndicator size="small" color="#000" />
                : <PrimaryButton title={tr('email.sendButton')} fullWidth onPress={handleSendCode} />}
            </View>
          </>
        )}

        {stage === 'code' && (
          <>
            <View style={styles.descriptionWrapper}>
              <Text style={styles.description}>{email}{tr('code.description')}</Text>
            </View>

            <View style={styles.codeRow}>
              {Array.from({ length: CODE_LENGTH }).map((_, index) => {
                const digit = code[index] ?? '';
                return (
                  <TouchableOpacity
                    key={index}
                    style={styles.codeBox}
                    onPress={() => hiddenInputRef.current?.focus()}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.codeText}>{digit}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <TextInput
              ref={hiddenInputRef}
              value={code}
              onChangeText={(v) => setCode(v.replace(/\D/g, '').slice(0, CODE_LENGTH))}
              keyboardType="number-pad"
              maxLength={CODE_LENGTH}
              style={styles.hiddenInput}
              autoFocus={false}
            />

            <TouchableOpacity onPress={!isLoading ? handleResend : undefined} style={styles.resendWrapper} disabled={isLoading}>
              {isLoading
                ? <ActivityIndicator size="small" color="#000" />
                : <Text style={styles.resendText}>{tr('code.resend')}</Text>}
            </TouchableOpacity>

            <View style={styles.buttonWrapper}>
              <PrimaryButton title={tr('code.next')} fullWidth onPress={handleVerifyCode} disabled={code.length !== CODE_LENGTH} />
            </View>

            <TouchableOpacity onPress={() => setStage('email')} style={styles.linkRow}>
              <Text style={styles.linkText}>{tr('code.backToEmail')}</Text>
            </TouchableOpacity>
          </>
        )}

        {stage === 'password' && (
          <>
            <FormField label={tr('password.newLabel')} placeholder={tr('password.newPlaceholder')}
              secureTextEntry value={newPin} onChangeText={setNewPin} editable={!isLoading}
              containerStyle={styles.fieldContainer} />
            <FormField label={tr('password.confirmLabel')} placeholder={tr('password.confirmPlaceholder')}
              secureTextEntry value={newPinConfirm} onChangeText={setNewPinConfirm} editable={!isLoading}
              containerStyle={styles.fieldContainer} />
            <View style={styles.buttonWrapper}>
              {isLoading
                ? <ActivityIndicator size="small" color="#000" />
                : <PrimaryButton title={tr('password.submit')} fullWidth onPress={handleResetPassword} />}
            </View>
          </>
        )}

      </SafeScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  scrollContent: { padding: 20, flexGrow: 1 },
  fieldContainer: { marginBottom: 14 },
  buttonWrapper: { width: '100%', maxWidth: 780, alignSelf: 'center', marginTop: 10, marginBottom: 16 },
  linkRow: { alignItems: 'center', padding: 8 },
  linkText: { fontSize: 13, color: '#000' },
  descriptionWrapper: { width: '100%', maxWidth: 327, alignSelf: 'center', marginBottom: 24 },
  description: { fontSize: FONTS.size.msmall, lineHeight: 24, color: '#747474', fontFamily: 'Roboto-Regular' },
  codeRow: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', maxWidth: 327, alignSelf: 'center', marginBottom: 24 },
  codeBox: { width: 45, height: 50, borderRadius: 16, borderWidth: 1, borderColor: '#dedede', alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff' },
  codeText: { fontSize: FONTS.size.large, fontFamily: 'Roboto-Bold', color: COLORS.headerText },
  resendWrapper: { alignItems: 'center', marginBottom: 24 },
  resendText: { fontSize: FONTS.size.medium, lineHeight: 24, color: COLORS.headerText, fontFamily: 'Roboto-Medium' },
  hiddenInput: { position: 'absolute', width: 0, height: 0, opacity: 0 },
});
