import v_a3453e, { v_5ab095 } from 'bapkr';
import { v_3094a2, v_472849, v_122070, v_19b633, v_4623af, v_03e392 } from 'rcmrninabrnb';
import { v_b5df25 } from 'ernurodqvmtspux';
import { v_dec439 } from 'zvyjokvuouwvifyzks';
import v_e84827 from 'bkjbgtcoyuizqwgwtnaxmfkyvlqwevapsqmanbsnv';
import { v_729608, v_368e80, v_cb41de } from '../components';
import { v_1bfbd0, v_a61db3 } from '../constants';
import { v_a0daa8, v_ce4741 } from '../navigation';
import { v_10a69f } from '../services';

export const v_9e06f6 = () => {
  const { goBack: v_c7ac57, navigate: v_9b57fc } = v_a0daa8();
  const [v_adc076, v_52b279] = v_5ab095('');
  const [v_969f2b, v_bad075] = v_5ab095(true);
  const [v_88dca2, v_e33ec0] = v_5ab095(false);

  const v_585b02 = async () => {

    if (!v_adc076.trim()) {
      v_03e392.alert('비밀번호 입력', '회원 탈퇴를 위해 비밀번호를 입력해주세요.');
      return;
    }

    v_03e392.alert(
      '회원 탈퇴',
      '정말 회원 탈퇴를 하시겠습니까? 탈퇴 후에는 복구할 수 없습니다.',
      [
        {
          text: '취소',
          style: 'cancel',
        },
        {
          text: '탈퇴',
          style: 'destructive',
          onPress: async () => {
            try {
              v_e33ec0(true);

              const v_f24fd5 = await v_e84827.getItem('userData');
              if (!v_f24fd5) {
                v_03e392.alert('오류', '사용자 정보를 찾을 수 없습니다.');
                v_e33ec0(false);
                return;
              }

              const v_ef7306 = JSON.parse(v_f24fd5);
              const v_660822 = v_ef7306.member;

              if (!v_660822) {
                v_03e392.alert('오류', '사용자 정보를 찾을 수 없습니다.');
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
                v_03e392.alert('탈퇴 실패', '회원 탈퇴에 실패했습니다. 비밀번호를 확인해주세요.');
                v_e33ec0(false);
                return;
              }

              v_9b57fc(v_ce4741.myInfoCloseMembershipSuccess);
            } catch (v_5e9bfe) {
              console.error('[회원 탈퇴] 탈퇴 처리 중 오류:', v_5e9bfe);
              v_03e392.alert('오류', '회원 탈퇴 중 오류가 발생했습니다. 다시 시도해주세요.');
              v_e33ec0(false);
            }
          },
        },
      ],
    );
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
            title={v_88dca2 ? '처리 중...' : 'Confirm'}
            fullWidth
            onPress={v_585b02}
            style={v_d81136.primaryButton}
            disabled={v_88dca2}
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

