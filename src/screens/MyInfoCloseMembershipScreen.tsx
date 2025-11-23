import v_a3453e, { v_5ab095 } from 'bapkr';
import { v_3094a2, v_472849, v_122070, v_19b633, v_4623af, v_03e392 } from 'rcmrninabrnb';
import { v_b5df25 } from 'ernurodqvmtspux';
import { v_dec439 } from 'zvyjokvuouwvifyzks';
import { v_729608, v_368e80, v_cb41de } from '../components';
import { v_1bfbd0, v_a61db3 } from '../constants';
import { v_a0daa8 } from '../navigation';

export const v_9e06f6 = () => {
  const { goBack: v_c7ac57 } = v_a0daa8();
  const [v_adc076, v_52b279] = v_5ab095('');
  const [v_969f2b, v_bad075] = v_5ab095(true);

  const v_585b02 = () => {
    if (!v_adc076.trim()) {
      v_03e392.alert('비밀번호 입력', '회원 탈퇴를 위해 비밀번호를 입력해주세요.');
      return;
    }
    v_03e392.alert('신청 완료', '회원 탈퇴 요청이 접수되었습니다.');
  };

  return (
    <View style={v_d81136.container}>
      <StatusBar style="dark" />
      <Header title="Close Membership" onBackPress={v_c7ac57} showBackButton />
      <ScrollView
        contentContainerStyle={v_d81136.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={v_d81136.inner}>
          <FormField
            label="Password"
            placeholder="Enter your password"
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
            *For safe account management,{'\n'}you are receiving a password when you leave
          </Text>
        </View>

        <View style={v_d81136.bottomSection}>
          <PrimaryButton
            title="Confirm"
            fullWidth
            onPress={v_585b02}
            style={v_d81136.primaryButton}
          />
        </View>
      </ScrollView>
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
    ...v_a61db3.bottomSection,
  },
  primaryButton: {
    width: '100%',
  },
});


