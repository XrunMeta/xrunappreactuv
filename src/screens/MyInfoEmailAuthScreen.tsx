import v_a3453e, { v_5ab095, v_c4deb2 } from 'bapkr';
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
import { v_8025d1 } from '../services';

const v_0e461e = (v_e0c7e8): boolean => {
  const v_9a3638 = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return v_9a3638.test(v_e0c7e8);
};

export const v_dec378 = () => {
  const { goBack: v_c7ac57, navigate: v_9b57fc } = v_a0daa8();
  const { setVerificationSuccessRoute: v_8f89f3, verificationEmail: v_fc0b2c, setVerificationEmail: v_b572c3 } = v_700ef9();
  const [v_e0c7e8, v_fedf34] = v_5ab095('');
  const [v_5e23ec, v_10837f] = v_5ab095(false);
  const [v_c5c953, v_e4a300] = v_5ab095(false);

  v_c4deb2(() => {
    if (v_fc0b2c) {
      v_fedf34(v_fc0b2c);
    }
  }, [v_fc0b2c]);

  const v_d23445 = async () => {

    if (!v_e0c7e8.trim()) {
      v_03e392.alert('이메일 입력', '이메일 주소를 입력해주세요.');
      return;
    }

    if (!v_0e461e(v_e0c7e8)) {
      v_03e392.alert('이메일 형식 오류', '올바른 이메일 형식을 입력해주세요.');
      return;
    }

    if (v_fc0b2c && v_e0c7e8.trim() !== v_fc0b2c.trim()) {
      v_03e392.alert('이메일 불일치', '기존 이메일과 일치하지 않습니다.');
      return;
    }

    try {
      v_10837f(true);
      console.log('[정보수정] 이메일 인증 코드 발송 요청:', v_e0c7e8.trim());

      const v_593e63 = await v_8025d1(v_e0c7e8.trim(), v_9b57fc);

      if (v_593e63) {
        v_e4a300(true);
        v_03e392.alert('전송 완료', '입력한 이메일로 인증코드를 전송했어요.');
      } else {
        v_03e392.alert('전송 실패', '이메일 전송에 실패했습니다. 다시 시도해주세요.');
      }
    } catch (v_5e9bfe) {
      console.error('[정보수정] 이메일 전송 오류:', v_5e9bfe);
      v_03e392.alert('전송 실패', '이메일 전송 중 오류가 발생했습니다.');
    } finally {
      v_10837f(false);
    }
  };

  const v_03cae9 = async () => {

    if (!v_e0c7e8.trim()) {
      v_03e392.alert('이메일 입력', '이메일 주소를 입력해주세요.');
      return;
    }

    if (!v_0e461e(v_e0c7e8)) {
      v_03e392.alert('이메일 형식 오류', '올바른 이메일 형식을 입력해주세요.');
      return;
    }

    if (v_fc0b2c && v_e0c7e8.trim() !== v_fc0b2c.trim()) {
      v_03e392.alert('이메일 불일치', '기존 이메일과 일치하지 않습니다.');
      return;
    }

    if (!v_c5c953) {
      v_03e392.alert('인증 코드 미발송', '먼저 이메일 인증 코드를 발송해주세요.');
      return;
    }

    try {
      v_10837f(true);
      console.log('[정보수정] 이메일 인증 코드 발송 요청 (확인 버튼):', v_e0c7e8.trim());

      const v_593e63 = await v_8025d1(v_e0c7e8.trim(), v_9b57fc);

      if (v_593e63) {

        v_b572c3(v_e0c7e8.trim());
        v_8f89f3(v_ce4741.myInfoEdit);
        v_9b57fc(v_ce4741.verificationCode);
      } else {
        v_03e392.alert('전송 실패', '이메일 전송에 실패했습니다. 다시 시도해주세요.');
      }
    } catch (v_5e9bfe) {
      console.error('[정보수정] 이메일 전송 오류:', v_5e9bfe);
      v_03e392.alert('전송 실패', '이메일 전송 중 오류가 발생했습니다.');
    } finally {
      v_10837f(false);
    }
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

