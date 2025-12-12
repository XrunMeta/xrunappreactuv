import v_a3453e, { v_5ab095 } from 'bapkr';
import { v_3094a2, v_472849, v_19b633, v_4623af } from 'rcmrninabrnb';
import { v_772971 } from 'jmpfvteuuztnp';
import { v_dec439 } from 'zvyjokvuouwvifyzks';
import v_e84827 from 'bkjbgtcoyuizqwgwtnaxmfkyvlqwevapsqmanbsnv';
import { v_729608, v_368e80, v_cb41de, v_570c34 } from '../components';
import { v_1bfbd0, v_a61db3, v_843035, v_bae512 } from '../constants';
import { v_a0daa8, v_ce4741 } from '../navigation';
import { v_4b1173 } from '../context/AlertDialogContext';
import { v_b954f5 } from '../services';

export const v_18d397 = () => {
  const { t: v_8d41d7 } = v_772971();
  const { goBack: v_c7ac57, navigate: v_9b57fc } = v_a0daa8();
  const { showAlert: v_889fad } = v_4b1173();
  const [v_e2bd5a, v_889581] = v_5ab095('');
  const [v_0b3ebe, v_241a35] = v_5ab095('');
  const [v_cad69a, v_f9607d] = v_5ab095(true);
  const [v_9e430e, v_59222b] = v_5ab095(true);
  const [v_88dca2, v_e33ec0] = v_5ab095(false);

  const v_585b02 = async () => {

    if (!v_e2bd5a.trim()) {
      await v_889fad(
        v_8d41d7('screens.changePassword.alerts.error'),
        v_8d41d7('screens.changePassword.alerts.newPasswordRequired'),
      );
      return;
    }

    if (v_e2bd5a.length < 6) {
      await v_889fad(
        v_8d41d7('screens.changePassword.alerts.error'),
        v_8d41d7('screens.changePassword.alerts.passwordTooShort'),
      );
      return;
    }

    if (v_e2bd5a !== v_0b3ebe) {
      await v_889fad(
        v_8d41d7('screens.changePassword.alerts.error'),
        v_8d41d7('screens.changePassword.alerts.passwordMismatch'),
      );
      return;
    }

    try {
      v_e33ec0(true);

      const v_f24fd5 = await v_e84827.getItem('userData');
      if (!v_f24fd5) {
        await v_889fad(
          v_8d41d7('screens.changePassword.alerts.error'),
          v_8d41d7('screens.changePassword.alerts.userDataNotFound'),
        );
        v_e33ec0(false);
        return;
      }

      const v_ef7306 = JSON.parse(v_f24fd5);
      const v_660822 = v_ef7306.member;

      if (!v_660822) {
        await v_889fad(
          v_8d41d7('screens.changePassword.alerts.error'),
          v_8d41d7('screens.changePassword.alerts.userDataNotFound'),
        );
        v_e33ec0(false);
        return;
      }

      await v_b954f5(v_660822, v_e2bd5a, v_9b57fc);

      await v_889fad(
        v_8d41d7('screens.changePassword.alerts.success'),
        v_8d41d7('screens.changePassword.alerts.successMessage'),
        [
          {
            text: v_8d41d7('screens.changePassword.alerts.confirm'),
            onPress: () => {
              v_c7ac57();
            },
          },
        ],
      );
    } catch (v_5e9bfe) {
      console.error('[비밀번호 변경] 변경 처리 중 오류:', v_5e9bfe);
      await v_889fad(
        v_8d41d7('screens.changePassword.alerts.error'),
        v_8d41d7('screens.changePassword.alerts.changeFailed'),
      );
    } finally {
      v_e33ec0(false);
    }
  };

  return (
    <View style={v_d81136.container}>
      <Header title={v_8d41d7('screens.changePassword.title')} onBackPress={v_c7ac57} showBackButton />
      <SafeScrollView
        contentContainerStyle={v_d81136.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        autoAdjustKeyboardPadding={true}
      >
        <View style={v_d81136.formFieldContainer}>
          <FormField
            label={v_8d41d7('screens.changePassword.newPassword')}
            placeholder={v_8d41d7('screens.changePassword.newPasswordPlaceholder')}
            secureTextEntry={v_cad69a}
            value={v_e2bd5a}
            onChangeText={v_889581}
            rightAccessory={
              <TouchableOpacity onPress={() => v_f9607d((v_ba2215) => !v_ba2215)}>
                <Feather name={v_cad69a ? 'eye-off' : 'eye'} size={20} color="#b3b6be" />
              </TouchableOpacity>
            }
            containerStyle={v_d81136.fieldContainer}
          />

          <FormField
            label={v_8d41d7('screens.changePassword.confirmPassword')}
            placeholder={v_8d41d7('screens.changePassword.confirmPasswordPlaceholder')}
            secureTextEntry={v_9e430e}
            value={v_0b3ebe}
            onChangeText={v_241a35}
            rightAccessory={
              <TouchableOpacity onPress={() => v_59222b((v_ba2215) => !v_ba2215)}>
                <Feather name={v_9e430e ? 'eye-off' : 'eye'} size={20} color="#b3b6be" />
              </TouchableOpacity>
            }
            containerStyle={v_d81136.fieldContainer}
          />

          <Text style={v_d81136.helperText}>
            {v_8d41d7('screens.changePassword.helperText')}
          </Text>
        </View>

        <View style={v_d81136.bottomSection}>
          <PrimaryButton
            title={v_88dca2 ? v_8d41d7('screens.changePassword.processing') : v_8d41d7('screens.changePassword.changeButton')}
            fullWidth
            onPress={v_585b02}
            style={v_d81136.primaryButton}
            disabled={v_88dca2}
          />
        </View>
      </SafeScrollView>
    </View>
  );
};

const v_d81136 = v_472849.create({
  container: {
    ...v_a61db3.container,
  },
  scrollContent: {
    flexGrow: 1,
    ...v_a61db3.scrollContent,
  },
  formFieldContainer: {
    ...v_bae512.fieldContainer,
  },
  fieldContainer: {
    borderWidth: 0,
  },
  helperText: {
    fontSize: v_843035.size.small,
    lineHeight: 15,
    color: '#747474',
    fontFamily: 'Roboto-Regular',
  },
  bottomSection: {
    ...v_a61db3.bottomButtonContainer,
  },
  primaryButton: {
    width: '100%',
  },
});
