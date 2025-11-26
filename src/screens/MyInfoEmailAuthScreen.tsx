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
import { v_772971 } from 'jmpfvteuuztnp';
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
  const { t: v_8d41d7 } = v_772971();
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
      v_03e392.alert(v_8d41d7('screens.myInfoEmailAuth.alerts.emailInput'), v_8d41d7('screens.myInfoEmailAuth.alerts.emailRequired'));
      return;
    }

    if (!v_0e461e(v_e0c7e8)) {
      v_03e392.alert(v_8d41d7('screens.myInfoEmailAuth.alerts.emailFormatError'), v_8d41d7('screens.myInfoEmailAuth.alerts.emailFormatInvalid'));
      return;
    }

    if (v_fc0b2c && v_e0c7e8.trim() !== v_fc0b2c.trim()) {
      v_03e392.alert(v_8d41d7('screens.myInfoEmailAuth.alerts.emailMismatch'), v_8d41d7('screens.myInfoEmailAuth.alerts.emailMismatchMessage'));
      return;
    }

    try {
      v_10837f(true);
      console.log('[정보수정] 이메일 인증 코드 발송 요청:', v_e0c7e8.trim());

      const v_593e63 = await v_8025d1(v_e0c7e8.trim(), v_9b57fc);

      if (v_593e63) {
        v_e4a300(true);
        v_03e392.alert(v_8d41d7('screens.myInfoEmailAuth.alerts.sendSuccess'), v_8d41d7('screens.myInfoEmailAuth.alerts.sendSuccessMessage'));
      } else {
        v_03e392.alert(v_8d41d7('screens.myInfoEmailAuth.alerts.sendFailed'), v_8d41d7('screens.myInfoEmailAuth.alerts.sendFailedMessage'));
      }
    } catch (v_5e9bfe) {
      console.error('[정보수정] 이메일 전송 오류:', v_5e9bfe);
      v_03e392.alert(v_8d41d7('screens.myInfoEmailAuth.alerts.sendFailed'), v_8d41d7('screens.myInfoEmailAuth.alerts.sendError'));
    } finally {
      v_10837f(false);
    }
  };

  const v_03cae9 = async () => {

    if (!v_e0c7e8.trim()) {
      v_03e392.alert(v_8d41d7('screens.myInfoEmailAuth.alerts.emailInput'), v_8d41d7('screens.myInfoEmailAuth.alerts.emailRequired'));
      return;
    }

    if (!v_0e461e(v_e0c7e8)) {
      v_03e392.alert(v_8d41d7('screens.myInfoEmailAuth.alerts.emailFormatError'), v_8d41d7('screens.myInfoEmailAuth.alerts.emailFormatInvalid'));
      return;
    }

    if (v_fc0b2c && v_e0c7e8.trim() !== v_fc0b2c.trim()) {
      v_03e392.alert(v_8d41d7('screens.myInfoEmailAuth.alerts.emailMismatch'), v_8d41d7('screens.myInfoEmailAuth.alerts.emailMismatchMessage'));
      return;
    }

    if (!v_c5c953) {
      v_03e392.alert(v_8d41d7('screens.myInfoEmailAuth.alerts.codeNotSent'), v_8d41d7('screens.myInfoEmailAuth.alerts.codeNotSentMessage'));
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
        v_03e392.alert(v_8d41d7('screens.myInfoEmailAuth.alerts.sendFailed'), v_8d41d7('screens.myInfoEmailAuth.alerts.sendFailedMessage'));
      }
    } catch (v_5e9bfe) {
      console.error('[정보수정] 이메일 전송 오류:', v_5e9bfe);
      v_03e392.alert(v_8d41d7('screens.myInfoEmailAuth.alerts.sendFailed'), v_8d41d7('screens.myInfoEmailAuth.alerts.sendError'));
    } finally {
      v_10837f(false);
    }
  };

  return (
    <View style={v_d81136.container}>
      <StatusBar style="dark" />
      <Header title={v_8d41d7('screens.myInfoEmailAuth.title')} onBackPress={v_c7ac57} showBackButton />
      <ScrollView
        contentContainerStyle={v_d81136.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={v_d81136.formWrapper}>
          <FormField
            label={v_8d41d7('screens.myInfoEmailAuth.emailLabel')}
            value={v_e0c7e8}
            onChangeText={(v_9b6134) => {
              v_fedf34(v_9b6134);
              v_e4a300(false);
            }}
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="email-address"
            placeholder={v_8d41d7('screens.myInfoEmailAuth.emailPlaceholder')}
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
                  {v_5e23ec ? v_8d41d7('screens.myInfoEmailAuth.sending') : (v_c5c953 ? v_8d41d7('screens.myInfoEmailAuth.sendButton') : v_8d41d7('screens.myInfoEmailAuth.sendButton'))}
                </Text>
              </TouchableOpacity>
            }
          />
        </View>

        <View style={v_d81136.bottomSection}>
          <PrimaryButton
            title={v_8d41d7('screens.myInfoEmailAuth.confirmButton')}
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

