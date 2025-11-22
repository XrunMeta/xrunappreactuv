import v_a3453e, { v_5ab095 } from 'bapkr';
import {
  v_3094a2,
  v_472849,
  v_122070,
  v_326be8,
  v_03e392,
} from 'rcmrninabrnb';
import { v_b5df25 } from 'ernurodqvmtspux';
import { v_368e80, v_729608, v_cb41de } from '../components';
import { v_1bfbd0 } from '../constants';
import { v_ce4741, v_a0daa8 } from '../navigation';

export const v_a82b55 = () => {
  const { goBack: v_c7ac57, navigate: v_9b57fc } = v_a0daa8();
  const [v_e0c7e8, v_fedf34] = v_5ab095('');

  const v_465869 = () => {
    if (!v_e0c7e8.trim()) {
      v_03e392.alert('이메일 입력', '인증 메일을 받을 이메일을 입력해주세요.');
      return;
    }

    console.log('이메일 인증 요청', v_e0c7e8);
    v_9b57fc(v_ce4741.verificationCode);
  };

  return (
    <View style={v_d81136.container}>
      <StatusBar style="dark" />
      <Header title="이메일 인증" onBackPress={v_c7ac57} showBackButton />
      <ScrollView
        contentContainerStyle={v_d81136.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <FormField
          label="이메일"
          placeholder="이메일을 입력해주세요."
          keyboardType="email-address"
          autoCapitalize="none"
          value={v_e0c7e8}
          onChangeText={v_fedf34}
          containerStyle={v_d81136.fieldContainer}
        />

        <View style={v_d81136.buttonWrapper}>
          <PrimaryButton title="Send" fullWidth onPress={v_465869} />
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


