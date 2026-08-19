

import v_a3453e, { v_c4deb2, v_5ab095 } from 'bapkr';
import { v_3094a2, v_472849, v_39a996 } from 'rcmrninabrnb';
import { v_772971 } from 'jmpfvteuuztnp';
import v_e84827 from 'bkjbgtcoyuizqwgwtnaxmfkyvlqwevapsqmanbsnv';
import { v_3333d3 } from 'imsks';
import { v_729608, v_cb41de, v_570c34, v_368e80 } from '../components';
import { v_ce4741, v_a0daa8 } from '../navigation';
import { v_4b1173 } from '../context/AlertDialogContext';
import { v_dbd583 } from '../services';

const v_aca441 = 'deviceUnblockRequestEmail';

export const v_0f76b7 = () => {
  const { t: v_8d41d7 } = v_772971();
  const v_bee4c1 = (v_0eb677) => v_8d41d7(`screens.deviceBinding.${v_0eb677}` as any);
  const { goBack: v_c7ac57, navigate: v_9b57fc } = v_a0daa8();
  const { showAlert: v_889fad } = v_4b1173();

  const [v_e0c7e8, v_fedf34] = v_5ab095('');
  const [v_dd6d25, v_663b06] = v_5ab095('');
  const [v_88dca2, v_e33ec0] = v_5ab095(false);

  v_c4deb2(() => {
    (async () => {
      try {
        const v_5885b8 = await v_e84827.getItem(v_aca441);
        if (v_5885b8) v_fedf34(v_5885b8);
      } catch {  }
    })();
  }, []);

  const v_585b02 = async () => {
    if (!v_e0c7e8) {

      await v_889fad(v_bee4c1('unblockScreenTitle'), v_bee4c1('unblockSubmitFailed'));
      return;
    }
    v_e33ec0(true);
    try {
      await v_dbd583(v_e0c7e8, v_dd6d25.trim() || undefined);
      v_e33ec0(false);
      try { await v_e84827.removeItem(v_aca441); } catch {  }
      await v_889fad(
        v_bee4c1('unblockScreenTitle'),
        v_bee4c1('unblockSubmitted'),
        [{ text: v_8d41d7('common.buttons.confirm') || '확인', onPress: () => v_9b57fc(v_ce4741.login) }],
      );
    } catch (v_5e9bfe) {
      v_e33ec0(false);
      if (v_5e9bfe instanceof v_3333d3 && v_5e9bfe.response?.status === 429) {
        await v_889fad(v_bee4c1('unblockScreenTitle'), v_bee4c1('unblockTooMany'));
      } else {
        await v_889fad(v_bee4c1('unblockScreenTitle'), v_bee4c1('unblockSubmitFailed'));
      }
    }
  };

  return (
    <View style={v_d81136.container}>
      <Header title={v_bee4c1('unblockScreenTitle')} onBackPress={v_c7ac57} showBackButton />
      <SafeScrollView contentContainerStyle={v_d81136.scrollContent} keyboardShouldPersistTaps="handled">
        <FormField
          label={v_bee4c1('unblockReasonLabel')}
          placeholder={v_bee4c1('unblockReasonPlaceholder')}
          value={v_dd6d25}
          onChangeText={v_663b06}
          editable={!v_88dca2}
          multiline
          numberOfLines={4}
          containerStyle={v_d81136.fieldContainer}
          style={v_d81136.multilineInput}
        />
        <View style={v_d81136.buttonWrapper}>
          {v_88dca2
            ? <ActivityIndicator size="small" color="#000" />
            : <PrimaryButton title={v_bee4c1('unblockSubmit')} fullWidth onPress={v_585b02} />}
        </View>
      </SafeScrollView>
    </View>
  );
};

const v_d81136 = v_472849.create({
  container: { flex: 1, backgroundColor: '#fff' },
  scrollContent: { padding: 20, flexGrow: 1 },
  fieldContainer: { marginBottom: 14 },
  multilineInput: { minHeight: 100, textAlignVertical: 'top', paddingTop: 12 },
  buttonWrapper: { width: '100%', maxWidth: 780, alignSelf: 'center', marginTop: 10, marginBottom: 16 },
});
