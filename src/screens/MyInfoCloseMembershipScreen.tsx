import v_a3453e, { v_5ab095 } from 'bapkr';
import { v_3094a2, v_472849, v_19b633, v_4623af } from 'rcmrninabrnb';
import { v_570c34 } from '../components';
import { v_772971 } from 'jmpfvteuuztnp';
import { v_dec439 } from 'zvyjokvuouwvifyzks';
import v_e84827 from 'bkjbgtcoyuizqwgwtnaxmfkyvlqwevapsqmanbsnv';
import { v_729608, v_368e80, v_cb41de } from '../components';
import { v_1bfbd0, v_a61db3, v_704d15, v_843035 } from '../constants';
import { v_a0daa8, v_ce4741 } from '../navigation';
import { v_10a69f } from '../services';
import { v_4b1173 } from '../context/AlertDialogContext';

export const v_9e06f6 = () => {
  const { t: v_8d41d7 } = v_772971();
  const { goBack: v_c7ac57, navigate: v_9b57fc } = v_a0daa8();
  const { showAlert: v_889fad } = v_4b1173();
  const [v_adc076, v_52b279] = v_5ab095('');
  const [v_969f2b, v_bad075] = v_5ab095(true);
  const [v_88dca2, v_e33ec0] = v_5ab095(false);

  const v_585b02 = async () => {

    if (!v_adc076.trim()) {
      await v_889fad(v_8d41d7('screens.myInfoCloseMembership.alerts.passwordRequired'), v_8d41d7('screens.myInfoCloseMembership.alerts.passwordRequiredMessage'));
      return;
    }

    await v_889fad(
      v_8d41d7('screens.myInfoCloseMembership.alerts.closeMembership'),
      v_8d41d7('screens.myInfoCloseMembership.alerts.closeMembershipMessage'),
      [
        {
          text: v_8d41d7('screens.myInfoCloseMembership.alerts.cancel'),
          style: 'cancel',
        },
        {
          text: v_8d41d7('screens.myInfoCloseMembership.alerts.confirm'),
          style: 'destructive',
          onPress: async () => {
            try {
              v_e33ec0(true);

              const v_f24fd5 = await v_e84827.getItem('userData');
              if (!v_f24fd5) {
                await v_889fad(v_8d41d7('screens.myInfoCloseMembership.alerts.error'), v_8d41d7('screens.myInfoCloseMembership.alerts.errorMessage'));
                v_e33ec0(false);
                return;
              }

              const v_ef7306 = JSON.parse(v_f24fd5);
              const v_660822 = v_ef7306.member;

              if (!v_660822) {
                await v_889fad(v_8d41d7('screens.myInfoCloseMembership.alerts.error'), v_8d41d7('screens.myInfoCloseMembership.alerts.errorMessage'));
                v_e33ec0(false);
                return;
              }

              const v_593e63 = await v_10a69f(
                v_660822,
                v_adc076,
                '',
                0,
                v_9b57fc,
              );

              if (!v_593e63) {
                await v_889fad(v_8d41d7('screens.myInfoCloseMembership.alerts.closeFailed'), v_8d41d7('screens.myInfoCloseMembership.alerts.closeFailedMessage'));
                v_e33ec0(false);
                return;
              }

              v_9b57fc(v_ce4741.myInfoCloseMembershipSuccess);
            } catch (v_5e9bfe) {
              console.error('[회원 탈퇴] 탈퇴 처리 중 오류:', v_5e9bfe);
              await v_889fad(v_8d41d7('screens.myInfoCloseMembership.alerts.error'), v_8d41d7('screens.myInfoCloseMembership.alerts.closeError'));
              v_e33ec0(false);
            }
          },
        },
      ],
    );
  };

  return (
    <View style={v_d81136.container}>
      <Header title={v_8d41d7('screens.myInfoCloseMembership.title')} onBackPress={v_c7ac57} showBackButton />
      <SafeScrollView
        contentContainerStyle={v_d81136.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        autoAdjustKeyboardPadding={true}
      >
        <View style={v_d81136.inner}>
          <Text style={v_d81136.warningText}>
            회원을 탈퇴하시면, 
            앱을 사용하기 위해 저장된 개인정보, 지갑키 등 관련된 정보가 모두 삭제됩니다. 
            삭제후에는 복구가 불가능하니 반드시 확인하십시오.
          </Text>
        </View> 
        <View style={v_d81136.inner}>
          <FormField
            label={v_8d41d7('screens.myInfoCloseMembership.passwordLabel')}
            placeholder={v_8d41d7('screens.myInfoCloseMembership.passwordPlaceholder')}
            secureTextEntry={v_969f2b}
            value={v_adc076}
            onChangeText={v_52b279}
            rightAccessory={
              <TouchableOpacity onPress={() => v_bad075((v_ba2215) => !v_ba2215)}>
                <Feather name={v_969f2b ? 'eye-off' : 'eye'} size={20} color="#b3b6be" />
              </TouchableOpacity>
            }
          />
          <Text style={v_d81136.helperText}>
            {v_8d41d7('screens.myInfoCloseMembership.helperText')}
          </Text>
        </View>

        <View style={v_d81136.bottomSection}>
          <PrimaryButton
            title={v_88dca2 ? v_8d41d7('screens.myInfoCloseMembership.processing') : v_8d41d7('screens.myInfoCloseMembership.confirmButton')}
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
  inner: {
    ...v_704d15.small,
  },
  helperText: {
    marginTop: 8,
    fontSize: v_843035.size.small,
    lineHeight: 15,
    color: '#747474',
    fontFamily: 'Roboto-Regular',
  },
  warningText: {
    marginTop: 8,
    marginBottom: 24,
    fontSize: v_843035.size.medium,
    lineHeight: 24,
    color: '#aa0000',
    fontFamily: 'Roboto-Regular',
  },
  bottomSection: {
    ...v_a61db3.bottomButtonContainer,
  },
  primaryButton: {
    width: '100%',
  },
});

