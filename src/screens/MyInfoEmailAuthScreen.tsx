import v_a3453e, { v_5ab095 } from 'bapkr';
import {
  v_3094a2,
  v_472849,
  v_122070,
  v_4623af,
  v_19b633,
  v_03e392,
} from 'rcmrninabrnb';
import { v_b5df25 } from 'ernurodqvmtspux';
import { v_729608, v_368e80, v_cb41de } from '../components';
import { v_1bfbd0, v_a61db3 } from '../constants';
import { v_a0daa8, v_ce4741 } from '../navigation';
import { v_700ef9 } from '../context';

export const v_dec378 = () => {
  const { goBack: v_c7ac57, navigate: v_9b57fc } = v_a0daa8();
  const { setVerificationSuccessRoute: v_8f89f3 } = v_700ef9();
  const [v_e0c7e8, v_fedf34] = v_5ab095('oth-staff@example.invalid');
  const [v_5e23ec, v_10837f] = v_5ab095(false);
  const [v_c5c953, v_e4a300] = v_5ab095(false);

  const v_d23445 = async () => {
    if (!v_e0c7e8.trim()) {
      v_03e392.alert('이메일 입력', '이메일 주소를 입력해주세요.');
      return;
    }
    try {
      v_10837f(true);
      await new Promise((v_6f7712) => setTimeout(v_6f7712, 600));
      v_e4a300(true);
      v_03e392.alert('전송 완료', '입력한 이메일로 인증코드를 전송했어요.');
    } finally {
      v_10837f(false);
    }
  };

  const v_03cae9 = () => {
    if (!v_e0c7e8.trim()) {
      v_03e392.alert('이메일 입력', '이메일 주소를 입력해주세요.');
      return;
    }
    v_8f89f3(v_ce4741.myInfoEdit);
    v_9b57fc(v_ce4741.verificationCode);
  };

  return (
    <View style={v_d81136.container}>
      <StatusBar style="dark" />
      <Header title="Email Authentification" onBackPress={v_c7ac57} showBackButton />
      <ScrollView
        contentContainerStyle={v_d81136.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={v_d81136.formWrapper}>
          <FormField
            label="Email"
            value={v_e0c7e8}
            onChangeText={(v_9b6134) => {
              v_fedf34(v_9b6134);
              v_e4a300(false);
            }}
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="email-address"
            placeholder="Enter your email address"
            containerStyle={v_d81136.fieldContainer}
            rightAccessory={
              <TouchableOpacity
                style={[
                  v_d81136.inlineButton,
                  v_c5c953 && v_d81136.inlineButtonSent,
                ]}
                onPress={v_d23445}
                disabled={v_5e23ec}
                activeOpacity={0.7}
              >
                <Text style={v_d81136.inlineButtonText}>
                  {v_c5c953 ? 'Sent' : 'Send Email'}
                </Text>
              </TouchableOpacity>
            }
          />
        </View>

        <View style={v_d81136.bottomSection}>
          <PrimaryButton
            title="Confirm"
            fullWidth
            onPress={v_03cae9}
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
    paddingTop: 32,
    paddingBottom: 40,
  },
  formWrapper: {
    width: '100%',
    maxWidth: 780,
    alignSelf: 'center',
  },
  fieldContainer: {
    marginBottom: 32,
  },
  inlineButton: {
    backgroundColor: '#343a5a',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    minWidth: 80,
    alignItems: 'center',
  },
  inlineButtonSent: {
    backgroundColor: '#595f7d',
  },
  inlineButtonText: {
    color: '#fff',
    fontSize: 12,
    fontFamily: 'Roboto-SemiBold',
  },
  bottomSection: {
    ...v_a61db3.bottomSection,
  },
  primaryButton: {
    width: '100%',
  },
});


