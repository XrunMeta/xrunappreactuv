import v_a3453e, { v_5ab095 } from 'bapkr';
import {
  v_3094a2,
  v_472849,
  v_122070,
  v_326be8,
  v_39a996,
} from 'rcmrninabrnb';
import { v_b5df25 } from 'ernurodqvmtspux';
import { v_772971 } from 'jmpfvteuuztnp';
import { v_368e80, v_729608, v_cb41de } from '../components';
import { v_1bfbd0 } from '../constants';
import { v_ce4741, v_a0daa8 } from '../navigation';
import { v_700ef9 } from '../context';
import { v_f5ecec, v_8025d1 } from '../services';
import { v_4b1173 } from '../context/AlertDialogContext';

export const v_a82b55 = () => {
  const { t: v_8d41d7 } = v_772971();
  const { goBack: v_c7ac57, navigate: v_9b57fc } = v_a0daa8();
  const { showAlert: v_889fad } = v_4b1173();
  const [v_e0c7e8, v_fedf34] = v_5ab095('');
  const [v_cd31a8, v_deef62] = v_5ab095(false);
  const { setVerificationSuccessRoute: v_8f89f3, setVerificationEmail: v_b572c3 } = v_700ef9();

  const v_465869 = async () => {
    if (!v_e0c7e8.trim()) {
      await v_889fad(v_8d41d7('screens.emailVerification.alerts.emailInput'), v_8d41d7('screens.emailVerification.errors.emailRequired'));
      return;
    }

    const v_9a3638 = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!v_9a3638.test(v_e0c7e8.trim())) {
      await v_889fad(v_8d41d7('screens.emailVerification.alerts.emailFormatError'), v_8d41d7('screens.emailVerification.errors.emailInvalid'));
      return;
    }

    v_deef62(true);

    try {

      console.log('[로그인] 이메일 존재 확인 요청:', v_e0c7e8.trim());
      const v_dbae58 = await v_f5ecec(v_e0c7e8.trim(), v_9b57fc);

      if (!v_dbae58) {
        await v_889fad(
          v_8d41d7('screens.emailVerification.alerts.emailCheck'),
          v_8d41d7('screens.emailVerification.errors.emailNotRegistered'),
        );
        v_deef62(false);
        return;
      }

      console.log('[로그인] 이메일 인증 코드 전송 요청:', v_e0c7e8.trim());
      const v_f438c1 = await v_8025d1(v_e0c7e8.trim(), v_9b57fc);

      if (!v_f438c1) {
        await v_889fad(v_8d41d7('screens.emailVerification.alerts.sendFailed'), v_8d41d7('screens.emailVerification.errors.sendFailed'));
        v_deef62(false);
        return;
      }

      v_b572c3(v_e0c7e8.trim());
      v_8f89f3(v_ce4741.map); 
      v_9b57fc(v_ce4741.verificationCode);
    } catch (v_5e9bfe) {
      console.error('[로그인] 이메일 인증 처리 중 오류:', v_5e9bfe);
      await v_889fad(v_8d41d7('screens.emailVerification.alerts.error'), v_8d41d7('screens.emailVerification.errors.error'));
    } finally {
      v_deef62(false);
    }
  };

  return (
    <View style={v_d81136.container}>
      <StatusBar style="dark" />
      <Header title={v_8d41d7('screens.emailVerification.title')} onBackPress={v_c7ac57} showBackButton />
      <ScrollView
        contentContainerStyle={v_d81136.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <FormField
          label={v_8d41d7('screens.emailVerification.emailLabel')}
          placeholder={v_8d41d7('screens.emailVerification.emailPlaceholder')}
          keyboardType="email-address"
          autoCapitalize="none"
          value={v_e0c7e8}
          onChangeText={v_fedf34}
          containerStyle={v_d81136.fieldContainer}
        />

        <View style={v_d81136.buttonWrapper}>
          <PrimaryButton
            title={v_cd31a8 ? v_8d41d7('screens.emailVerification.processing') : v_8d41d7('screens.emailVerification.sendButton')}
            fullWidth
            onPress={v_465869}
            disabled={v_cd31a8}
          />
        </View>
      </ScrollView>

      {v_326be8.OS === 'ios' && (
        <View style={v_d81136.homeIndicator}>
          <View style={v_d81136.homeIndicatorBar} />
        </View>
      )}
    </View>
  );
};

const v_d81136 = v_472849.create({
  container: {
    flex: 1,
    backgroundColor: v_1bfbd0.background,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 80,
    paddingBottom: 40,
  },
  fieldContainer: {
    width: '100%',
    maxWidth: 780,
    alignSelf: 'center',
    marginBottom: 40,
  },
  buttonWrapper: {
    width: '100%',
    maxWidth: 780,
    alignSelf: 'center',
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
});

