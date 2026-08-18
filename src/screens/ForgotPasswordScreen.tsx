import { v_e662ae, v_5ab095 } from 'bapkr';
import { v_3094a2, v_19b633, v_4623af, v_39a996, v_472849, v_79c4f2 } from 'rcmrninabrnb';
import { v_772971 } from 'jmpfvteuuztnp';
import { v_25515d } from 'zvyjokvuouwvifyzks';
import { v_a0daa8, v_ce4741 } from '../navigation';
import { v_570c34, v_368e80, v_cb41de, v_729608 } from '../components';
import { v_4b1173 } from '../context/AlertDialogContext';
import { v_08c9ee, v_5e332c } from '../services';
import { v_1bfbd0, v_843035 } from '../constants';
import { v_5401ae } from '../testIDs';

type Stage = 'email' | 'code' | 'password';
const v_683bb6 = 6;

export const v_040c8f = () => {
  const { t: v_8d41d7 } = v_772971();
  const v_bee4c1 = (v_0eb677) => v_8d41d7(`screens.forgotPassword.${v_0eb677}` as any);
  const { goBack: v_c7ac57, navigate: v_9b57fc } = v_a0daa8();
  const { showAlert: v_889fad } = v_4b1173();
  const [v_2ae4e7, v_cc5c9e] = v_5ab095<Stage>('email');
  const [v_e0c7e8, v_fedf34] = v_5ab095('');
  const [v_c99bd2, v_537cbb] = v_5ab095('');
  const [v_a85523, v_f8869d] = v_5ab095('');
  const [v_f3c499, v_7763dd] = v_5ab095('');
  const [v_3c03d9, v_9a358b] = v_5ab095(false);
  const [v_4df534, v_7dbd17] = v_5ab095(false);
  const [v_cd31a8, v_deef62] = v_5ab095(false);
  const v_56c646 = v_e662ae<v_79c4f2>(null);

  const v_2de427 = async () => {
    if (!v_e0c7e8.trim()) { await v_889fad(v_bee4c1('alerts.notice'), v_bee4c1('alerts.emailRequired')); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v_e0c7e8.trim())) {
      await v_889fad(v_bee4c1('alerts.notice'), v_bee4c1('alerts.emailInvalid')); return;
    }
    v_deef62(true);
    const v_8f00b9 = await v_08c9ee(v_e0c7e8.trim(), v_9b57fc);
    v_deef62(false);
    if (v_8f00b9.status === 'success') {
      await v_889fad(v_bee4c1('alerts.notice'), v_bee4c1('alerts.codeSent'));
      v_cc5c9e('code');
    } else if (v_8f00b9.code === 404) {
      await v_889fad(v_bee4c1('alerts.notice'), v_bee4c1('alerts.emailNotRegistered'));
    } else {
      await v_889fad(v_bee4c1('alerts.notice'), v_8f00b9.message ?? v_bee4c1('alerts.sendFailed'));
    }
  };

  const v_4f034c = async () => {
    if (v_c99bd2.length !== v_683bb6) {
      await v_889fad(v_bee4c1('alerts.notice'), v_bee4c1('alerts.codeRequired')); return;
    }
    v_cc5c9e('password');
  };

  const v_cf9840 = async () => {
    if (!v_e0c7e8) return;
    v_deef62(true);
    const v_8f00b9 = await v_08c9ee(v_e0c7e8.trim(), v_9b57fc);
    v_deef62(false);
    if (v_8f00b9.status === 'success') {
      v_537cbb('');
      await v_889fad(v_bee4c1('alerts.notice'), v_bee4c1('alerts.codeResent'));
    } else {
      await v_889fad(v_bee4c1('alerts.notice'), v_8f00b9.message ?? v_bee4c1('alerts.resendFailed'));
    }
  };

  const v_51e7d1 = async () => {
    if (!v_a85523) {
      await v_889fad(v_bee4c1('alerts.notice'), v_bee4c1('alerts.passwordRequired')); return;
    }
    const v_b947d5 = v_a85523.length >= 7;
    const v_5af9de = /\d/.test(v_a85523);
    const v_f18523 = /[a-z]/.test(v_a85523);
    const v_f6f742 = /[A-Z]/.test(v_a85523);
    if (!(v_b947d5 && v_5af9de && v_f18523 && v_f6f742)) {
      await v_889fad(v_bee4c1('alerts.notice'), v_bee4c1('alerts.passwordPolicy'));
      return;
    }
    if (v_a85523 !== v_f3c499) {
      await v_889fad(v_bee4c1('alerts.notice'), v_bee4c1('alerts.passwordMismatch')); return;
    }
    v_deef62(true);
    const v_8f00b9 = await v_5e332c(v_e0c7e8.trim(), v_c99bd2.trim(), v_a85523, v_9b57fc);
    v_deef62(false);
    if (v_8f00b9.status === 'success') {
      await v_889fad(v_bee4c1('alerts.done'), v_bee4c1('alerts.resetSuccess'), [
        { text: v_bee4c1('alerts.confirm'), onPress: () => v_9b57fc(v_ce4741.login) },
      ]);
    } else if (v_8f00b9.code === 410) {

      await v_889fad(v_bee4c1('alerts.notice'), v_bee4c1('alerts.codeExpired'), [
        { text: v_bee4c1('alerts.reissue'), onPress: () => v_cc5c9e('email') },
        { text: v_bee4c1('alerts.confirm'), style: 'cancel' },
      ]);
    } else if (v_8f00b9.code === 401) {

      await v_889fad(v_bee4c1('alerts.notice'), v_bee4c1('alerts.codeInvalid'), [
        { text: v_bee4c1('alerts.reissue'), onPress: () => v_cc5c9e('email') },
        { text: v_bee4c1('alerts.confirm'), style: 'cancel' },
      ]);
    } else {
      await v_889fad(v_bee4c1('alerts.notice'), v_8f00b9.message ?? v_bee4c1('alerts.resetFailed'));
    }
  };

  return (
    <View style={v_d81136.container}>
      <Header title={v_2ae4e7 === 'password' ? v_bee4c1('titleReset') : v_bee4c1('titleFind')} onBackPress={v_c7ac57} showBackButton />
      <SafeScrollView contentContainerStyle={v_d81136.scrollContent} keyboardShouldPersistTaps="handled">

        {v_2ae4e7 === 'email' && (
          <>
            <FormField label={v_bee4c1('email.label')} placeholder={v_bee4c1('email.placeholder')}
              keyboardType="email-address" autoCapitalize="none"
              value={v_e0c7e8} onChangeText={v_fedf34} editable={!v_cd31a8}
              containerStyle={v_d81136.fieldContainer} />
            <View style={v_d81136.buttonWrapper}>
              {v_cd31a8
                ? <ActivityIndicator size="small" color="#000" />
                : <PrimaryButton title={v_bee4c1('email.sendButton')} fullWidth onPress={v_2de427} />}
            </View>
          </>
        )}

        {v_2ae4e7 === 'code' && (
          <>
            <View style={v_d81136.descriptionWrapper}>
              <Text testID={v_5401ae.forgotPassword.emailLabel} style={v_d81136.description}>{v_e0c7e8}{v_bee4c1('code.description')}</Text>
            </View>

            <View style={v_d81136.codeRow}>
              {Array.from({ length: v_683bb6 }).map((v_37eab7, v_a56041) => {
                const v_5f701e = v_c99bd2[v_a56041] ?? '';
                return (
                  <TouchableOpacity testID={v_5401ae.forgotPassword.hiddenInputRef}
                    key={v_a56041}
                    style={v_d81136.codeBox}
                    onPress={() => v_56c646.current?.focus()}
                    activeOpacity={0.7}
                  >
                    <Text style={v_d81136.codeText}>{v_5f701e}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <TextInput testID={v_5401ae.forgotPassword.codeInput}
              ref={v_56c646}
              value={v_c99bd2}
              onChangeText={(v_81e2ef) => v_537cbb(v_81e2ef.replace(/\D/g, '').slice(0, v_683bb6))}
              keyboardType="number-pad"
              maxLength={v_683bb6}
              style={v_d81136.hiddenInput}
              autoFocus={false}
            />

            <TouchableOpacity onPress={!v_cd31a8 ? v_cf9840 : undefined} style={v_d81136.resendWrapper} disabled={v_cd31a8}>
              {v_cd31a8
                ? <ActivityIndicator size="small" color="#000" />
                : <Text style={v_d81136.resendText}>{v_bee4c1('code.resend')}</Text>}
            </TouchableOpacity>

            <View style={v_d81136.buttonWrapper}>
              <PrimaryButton title={v_bee4c1('code.next')} fullWidth onPress={v_4f034c} disabled={v_c99bd2.length !== v_683bb6} />
            </View>

            <TouchableOpacity onPress={() => v_cc5c9e('email')} style={v_d81136.linkRow}>
              <Text style={v_d81136.linkText}>{v_bee4c1('code.backToEmail')}</Text>
            </TouchableOpacity>
          </>
        )}

        {v_2ae4e7 === 'password' && (
          <>
            <FormField
              label={v_bee4c1('password.newLabel')} placeholder={v_bee4c1('password.newPlaceholder')}
              secureTextEntry={!v_3c03d9} value={v_a85523} onChangeText={v_f8869d}
              editable={!v_cd31a8} autoCapitalize="none" containerStyle={v_d81136.fieldContainer}
              rightAccessory={
                <TouchableOpacity onPress={() => v_9a358b(v_81e2ef => !v_81e2ef)} activeOpacity={0.7} disabled={v_cd31a8} style={v_d81136.eyeButton}>
                  <Ionicons name={v_3c03d9 ? 'eye-outline' : 'eye-off-outline'} size={20} color="#666666" />
                </TouchableOpacity>
              }
            />
            <FormField
              label={v_bee4c1('password.confirmLabel')} placeholder={v_bee4c1('password.confirmPlaceholder')}
              secureTextEntry={!v_4df534} value={v_f3c499} onChangeText={v_7763dd}
              editable={!v_cd31a8} autoCapitalize="none" containerStyle={v_d81136.fieldContainer}
              rightAccessory={
                <TouchableOpacity onPress={() => v_7dbd17(v_81e2ef => !v_81e2ef)} activeOpacity={0.7} disabled={v_cd31a8} style={v_d81136.eyeButton}>
                  <Ionicons name={v_4df534 ? 'eye-outline' : 'eye-off-outline'} size={20} color="#666666" />
                </TouchableOpacity>
              }
            />
            <View style={v_d81136.buttonWrapper}>
              {v_cd31a8
                ? <ActivityIndicator size="small" color="#000" />
                : <PrimaryButton title={v_bee4c1('password.submit')} fullWidth onPress={v_51e7d1} />}
            </View>
          </>
        )}

      </SafeScrollView>
    </View>
  );
};

const v_d81136 = v_472849.create({
  container: { flex: 1, backgroundColor: '#fff' },
  scrollContent: { padding: 20, flexGrow: 1 },
  fieldContainer: { marginBottom: 14 },
  eyeButton: { paddingHorizontal: 4, paddingVertical: 4 },
  buttonWrapper: { width: '100%', maxWidth: 780, alignSelf: 'center', marginTop: 10, marginBottom: 16 },
  linkRow: { alignItems: 'center', padding: 8 },
  linkText: { fontSize: 13, color: '#000' },
  descriptionWrapper: { width: '100%', maxWidth: 327, alignSelf: 'center', marginBottom: 24 },
  description: { fontSize: v_843035.size.msmall, lineHeight: 24, color: '#747474', fontFamily: 'Roboto-Regular' },
  codeRow: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', maxWidth: 327, alignSelf: 'center', marginBottom: 24 },
  codeBox: { width: 45, height: 50, borderRadius: 16, borderWidth: 1, borderColor: '#dedede', alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff' },
  codeText: { fontSize: v_843035.size.large, fontFamily: 'Roboto-Bold', color: v_1bfbd0.headerText },
  resendWrapper: { alignItems: 'center', marginBottom: 24 },
  resendText: { fontSize: v_843035.size.medium, lineHeight: 24, color: v_1bfbd0.headerText, fontFamily: 'Roboto-Medium' },
  hiddenInput: { position: 'absolute', width: 0, height: 0, opacity: 0 },
});
