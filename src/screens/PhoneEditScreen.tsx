import v_a3453e, { v_5ab095, v_c4deb2 } from 'bapkr';
import {
  v_3094a2,
  v_472849,
  v_19b633,
  v_4623af,
  v_39a996,
} from 'rcmrninabrnb';
import { v_772971 } from 'jmpfvteuuztnp';
import v_e84827 from 'bkjbgtcoyuizqwgwtnaxmfkyvlqwevapsqmanbsnv';
import { v_570c34 } from '../components';
import { v_729608, v_368e80, v_cb41de } from '../components';
import { v_1bfbd0, v_a61db3, v_843035 } from '../constants';
import { v_a0daa8, v_ce4741 } from '../navigation';
import { v_700ef9 } from '../context';
import { v_53d723 } from '../services';
import { v_4b1173 } from '../context/AlertDialogContext';
import { v_db8d16, v_9b617e } from '../services/appleReauth';

export const v_e14579 = () => {
  const { t: v_8d41d7 } = v_772971();
  const { reset: v_487a25, canGoBack: v_7e32fb, goBack: v_c7ac57, navigate: v_9b57fc } = v_a0daa8();
  const { showAlert: v_889fad } = v_4b1173();
  const { selectedCountryDialCode: v_459d5e, setSelectedCountryDialCode: v_f693e7 } = v_700ef9();
  const [v_d74a81, v_fcce73] = v_5ab095('');
  const [v_e495db, v_433822] = v_5ab095(false);
  const [v_717992, v_9d6aeb] = v_5ab095<number | null>(null);

  v_c4deb2(() => {
    (async () => {
      if (!(await v_9b617e())) return;
      const v_43c42e = await v_db8d16();
      if (!v_43c42e.ok) {
        if (v_7e32fb()) v_c7ac57();
        else v_487a25(v_ce4741.myInfoEdit);
      }
    })();

  }, []);

  v_c4deb2(() => {
    const v_ea3fa6 = async () => {
      try {
        const v_f24fd5 = await v_e84827.getItem('userData');
        if (v_f24fd5) {
          const v_ef7306 = JSON.parse(v_f24fd5);
          const v_660822 = v_ef7306.member;

          if (v_660822) {
            v_9d6aeb(v_660822);

            if (v_ef7306.mobile) {
              v_fcce73(v_ef7306.mobile.replace(/\s/g, ''));
            }
          }
        }
      } catch (v_5e9bfe) {
        console.error('[전화번호수정] 사용자 정보 로드 실패:', v_5e9bfe);
      }
    };

    v_ea3fa6();
  }, []);

  const v_1b8283 = async () => {

    if (!v_d74a81.trim()) {
      await v_889fad(v_8d41d7('screens.phoneEdit.alerts.error'), v_8d41d7('screens.phoneEdit.alerts.phoneRequired'));
      return;
    }

    const v_3a6ac4 = v_d74a81.replace(/\s/g, '').replace(/-/g, '');
    if (!/^\d+$/.test(v_3a6ac4)) {
      await v_889fad(v_8d41d7('screens.phoneEdit.alerts.error'), v_8d41d7('screens.phoneEdit.alerts.phoneInvalid'));
      return;
    }

    if (!v_717992) {
      await v_889fad(v_8d41d7('screens.phoneEdit.alerts.error'), v_8d41d7('screens.phoneEdit.alerts.userDataNotFound'));
      return;
    }

    v_433822(true);

    try {
      console.log('[전화번호수정] 전화번호 수정 시도:', {
        memberId: v_717992,
        phone: v_3a6ac4,
        mobilecode: parseInt(v_459d5e.dialCode.replace('+', ''), 10),
      });

      await v_53d723(
        v_717992,
        v_3a6ac4,
        parseInt(v_459d5e.dialCode.replace('+', ''), 10),
        v_9b57fc,
      );

      await v_889fad(v_8d41d7('screens.phoneEdit.alerts.saveSuccess'), v_8d41d7('screens.phoneEdit.alerts.saveSuccessMessage'), [
        {
          text: v_8d41d7('screens.phoneEdit.alerts.confirm'),
          onPress: () => {

            v_487a25(v_ce4741.myInfoEdit);
          },
        },
      ]);
    } catch (v_5e9bfe) {
      console.error('[전화번호수정] 전화번호 수정 실패:', v_5e9bfe);
      await v_889fad(v_8d41d7('screens.phoneEdit.alerts.saveFailed'), v_8d41d7('screens.phoneEdit.alerts.saveFailedMessage'));
    } finally {
      v_433822(false);
    }
  };

  const v_129fff = () => {
    v_9b57fc(v_ce4741.countryCodeSelect);
  };

  return (
    <View style={v_d81136.container}>
      <Header
        title={v_8d41d7('screens.phoneEdit.title')}
        onBackPress={v_7e32fb ? v_c7ac57 : () => v_487a25(v_ce4741.myInfoEdit)}
        showBackButton
      />
      <SafeScrollView
        contentContainerStyle={v_d81136.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        autoAdjustKeyboardPadding={true}
      >
        <View style={v_d81136.formWrapper}>
          <FormField
            label={v_8d41d7('screens.phoneEdit.phoneLabel')}
            value={v_d74a81}
            onChangeText={v_fcce73}
            keyboardType="phone-pad"
            placeholder={v_8d41d7('screens.phoneEdit.phonePlaceholder')}
            editable={!v_e495db}
            leftAccessory={
              <TouchableOpacity
                style={v_d81136.phonePrefix}
                onPress={v_129fff}
                activeOpacity={0.7}
                disabled={v_e495db}
              >
                <Text style={v_d81136.flagEmoji}>{v_459d5e.flagEmoji}</Text>
                <Text style={v_d81136.phonePrefixText}>{v_459d5e.dialCode}</Text>
              </TouchableOpacity>
            }
          />
        </View>

        <View style={v_d81136.bottomSection}>
          {v_e495db ? (
            <View style={v_d81136.loadingButtonContainer}>
              <ActivityIndicator size="small" color={v_1bfbd0.buttonPrimary} />
            </View>
          ) : (
            <PrimaryButton
              title={v_8d41d7('screens.phoneEdit.saveButton')}
              fullWidth
              onPress={v_1b8283}
              style={v_d81136.primaryButton}
            />
          )}
        </View>
      </SafeScrollView>
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
  formWrapper: {
    width: '100%',
    maxWidth: 780,
    alignSelf: 'center',
  },
  phonePrefix: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 12,
    paddingVertical: 4,
    borderRightWidth: 1,
    borderRightColor: '#ededed',
  },
  flagEmoji: {
    fontSize: v_843035.size.large,
    marginRight: 6,
  },
  phonePrefixText: {
    fontSize: v_843035.size.medium,
    fontFamily: 'Roboto-Medium',
    color: '#1a2e35',
  },
  bottomSection: {
    ...v_a61db3.bottomButtonContainer,
  },
  primaryButton: {
    width: '100%',
  },
  loadingButtonContainer: {
    height: 56,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

