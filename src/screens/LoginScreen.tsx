import v_a3453e, { v_5ab095, v_c4deb2 } from 'bapkr';
import {
  v_3094a2,
  v_19b633,
  v_472849,
  v_4623af,
  v_326be8,
  v_39a996,
} from 'rcmrninabrnb';
import { v_25515d } from 'zvyjokvuouwvifyzks';
import v_e84827 from 'bkjbgtcoyuizqwgwtnaxmfkyvlqwevapsqmanbsnv';
import { v_772971 } from 'jmpfvteuuztnp';
import { v_fa3feb, v_368e80, v_729608, v_cb41de, v_570c34 } from '../components';
import { v_1bfbd0, v_9b1a04, v_a61db3, v_843035 } from '../constants';
import { v_ce4741, v_a0daa8 } from '../navigation';
import {
  v_b699a9,
  v_a5170b,
  v_ea3493,
} from '../services';
import { v_4b1173 } from '../context/AlertDialogContext';

export const v_f4f851 = () => {
  const { navigate: v_9b57fc } = v_a0daa8();
  const { t: v_8d41d7 } = v_772971();
  const { showAlert: v_889fad } = v_4b1173();
  const [v_e0c7e8, v_fedf34] = v_5ab095('');
  const [v_adc076, v_52b279] = v_5ab095('');
  const [v_a964a4, v_99916a] = v_5ab095(false);
  const [v_f872c3, v_c6fe9e] = v_5ab095(false);
  const [v_cd31a8, v_deef62] = v_5ab095(false);
  const v_0d972d = v_ce4741.emailVerification;

  const v_648e0d = () => {
    v_9b57fc(v_ce4741.authLanding);
  };

  v_c4deb2(() => {
    const v_2a6af5 = async () => {
      try {
        const v_05155e = await v_e84827.getItem('rememberMe');
        if (v_05155e === 'true') {
          const v_60fc43 = await v_e84827.getItem('userEmail');
          if (v_60fc43) {
            v_fedf34(v_60fc43);
            v_99916a(true);
            console.log('[로그인] 저장된 이메일 불러오기 성공:', v_60fc43);
          }
        }
      } catch (v_5e9bfe) {
        console.error('[로그인] 저장된 이메일 불러오기 실패:', v_5e9bfe);
      }
    };
    v_2a6af5();
  }, []);

  const v_8f2c24 = () => {
    v_99916a(!v_a964a4);
  };

  const v_ec4736 = async () => {

    if (!v_e0c7e8.trim()) {
      await v_889fad(v_8d41d7('common.messages.error'), v_8d41d7('screens.login.errors.emailRequired'));
      return;
    }

    if (!v_adc076.trim()) {
      await v_889fad(v_8d41d7('common.messages.error'), v_8d41d7('screens.login.errors.passwordRequired'));
      return;
    }

    v_deef62(true);

    try {
      console.log('[로그인] 로그인 시도:', { email: v_e0c7e8, rememberMe: v_a964a4 });

      const v_b84499 = await v_b699a9(
        v_e0c7e8.trim(),
        v_adc076,
        v_9b57fc,
      );

      if (v_b84499.status !== 'success') {
        await v_889fad(v_8d41d7('common.messages.error'), v_8d41d7('screens.login.errors.loginFailed'));
        v_deef62(false);
        return;
      }

      const v_ef7306 = v_b84499.data[0];
      if (!v_ef7306) {
        await v_889fad(v_8d41d7('common.messages.error'), v_8d41d7('screens.login.errors.userDataNotFound'));
        v_deef62(false);
        return;
      }

      const v_9e8d12 = v_ef7306.extrastr;
      if (v_9e8d12 && v_ef7306.member) {
        const v_06cee6 = v_a5170b(v_9e8d12);

        const v_aa0ad8 = await v_ea3493(v_ef7306.member, v_06cee6, v_9b57fc);
        if (!v_aa0ad8) {
          console.warn('[로그인] 세션 저장 실패');
        }
      }

      await v_e84827.removeItem('userData');
      await v_e84827.removeItem('userSessionToken');

      await v_e84827.setItem('userEmail', v_e0c7e8.trim());
      await v_e84827.setItem('userData', JSON.stringify(v_ef7306));

      const v_00b91e = v_ef7306.extrastr || '';
      await v_e84827.setItem('userSessionToken', v_00b91e);

      await v_e84827.setItem('isLoggedIn', 'true');

      if (v_a964a4) {
        await v_e84827.setItem('rememberMe', 'true');
        console.log('[로그인] 로그인 상태 유지 저장 완료');
      } else {
        await v_e84827.removeItem('rememberMe');
        console.log('[로그인] 로그인 상태 유지 해제');
      }

      console.log('[로그인] 로그인 성공');

      v_9b57fc(v_ce4741.map);
    } catch (v_5e9bfe) {
      console.error('[로그인] 로그인 오류:', v_5e9bfe);
      await v_889fad(
        v_8d41d7('common.messages.error'),
        v_8d41d7('screens.login.errors.loginError'),
      );
    } finally {
      v_deef62(false);
    }
  };

  return (
    <View style={v_d81136.container}>
      <Header
        title={v_8d41d7('screens.login.title')}
        onBackPress={v_648e0d}
        showBackButton
      />
      <SafeScrollView
        contentContainerStyle={v_d81136.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        autoAdjustKeyboardPadding={true}
      >
        <FormField
          label={v_8d41d7('screens.login.emailLabel')}
          placeholder={v_8d41d7('screens.login.emailPlaceholder')}
          keyboardType="email-address"
          autoCapitalize="none"
          value={v_e0c7e8}
          onChangeText={v_fedf34}
          containerStyle={v_d81136.fieldContainer}
          editable={!v_cd31a8}
        />

        <FormField
          label={v_8d41d7('screens.login.passwordLabel')}
          placeholder={v_8d41d7('screens.login.passwordPlaceholder')}
          secureTextEntry={!v_f872c3}
          value={v_adc076}
          onChangeText={v_52b279}
          containerStyle={v_d81136.fieldContainer}
          editable={!v_cd31a8}
          rightAccessory={
            <TouchableOpacity
              style={v_d81136.eyeButton}
              onPress={() => v_c6fe9e((v_ba2215) => !v_ba2215)}
              activeOpacity={0.7}
              disabled={v_cd31a8}
            >
              <Ionicons
                name={v_f872c3 ? 'eye-outline' : 'eye-off-outline'}
                size={20}
                color="#666666"
              />
            </TouchableOpacity>
          }
        />

        <View style={v_d81136.checkboxRow}>
          <View style={v_cd31a8 ? v_d81136.checkboxDisabled : undefined}>
            <FormCheckbox
              label={v_8d41d7('screens.login.rememberMe')}
              checked={v_a964a4}
              onToggle={v_cd31a8 ? () => { } : v_8f2c24}
              variant="square"
            />
          </View>
        </View>

        <View style={v_d81136.bottomSection}>
          <View style={v_d81136.loginButtonWrapper}>
            {v_cd31a8 ? (
              <View style={v_d81136.loadingContainer}>
                <ActivityIndicator size="small" color={v_1bfbd0.buttonPrimary} />
              </View>
            ) : (
              <PrimaryButton title={v_8d41d7('screens.login.loginButton')} fullWidth onPress={v_ec4736} />
            )}
          </View>

          <Text style={v_d81136.disclaimer}>
            {v_8d41d7('screens.login.disclaimer')}
          </Text>

          <TouchableOpacity
            style={v_d81136.emailVerification}
            onPress={() => v_9b57fc(v_0d972d)}
            activeOpacity={0.7}
            disabled={v_cd31a8}
          >
            <Text style={v_d81136.emailVerificationText}>{v_8d41d7('screens.login.emailVerification')}</Text>
          </TouchableOpacity>
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
    flex: 1,
    ...v_a61db3.scrollContent,
  },
  fieldContainer: {
    width: '100%',
    maxWidth: 780,
    alignSelf: 'center',
    marginBottom: v_9b1a04.large,
  },
  eyeButton: {
    height: 24,
    width: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxRow: {
    width: '100%',
    maxWidth: 780,
    alignSelf: 'center',
    marginBottom: 16,
  },
  bottomSection: {
    ...v_a61db3.bottomButtonContainer,
  },
  loginButtonWrapper: {
    width: '100%',
    marginBottom: v_9b1a04.medium, 
  },
  disclaimer: {
    width: '100%',
    fontSize: v_843035.size.small,
    lineHeight: 15,
    color: '#4c4e55',
    fontFamily: 'Roboto-Regular',
  },
  emailVerification: {
    marginTop: 24,
    width: '100%',
    alignItems: 'flex-start',
  },
  emailVerificationText: {
    fontSize: v_843035.size.msmall,
    lineHeight: 20,
    color: '#4c4e55',
    fontFamily: 'Roboto-Bold',
  },
  mapLink: {
    marginTop: 24,
    width: '100%',
    alignItems: 'flex-start',
  },
  mapLinkText: {
    fontSize: v_843035.size.msmall,
    lineHeight: 20,
    color: '#4c4e55',
    fontFamily: 'Roboto-Bold',
  },

  loadingContainer: {
    height: 56,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxDisabled: {
    opacity: 0.5,
  },
});

