import v_a3453e, { v_5ab095, v_c4deb2 } from 'bapkr';
import { v_3094a2, v_19b633, v_472849, v_39a996 } from 'rcmrninabrnb';
import { v_570c34 } from '../components';
import { v_772971 } from 'jmpfvteuuztnp';
import v_e84827 from 'bkjbgtcoyuizqwgwtnaxmfkyvlqwevapsqmanbsnv';
import { v_729608, v_368e80, v_cb41de, v_8714fe } from '../components';
import { v_1bfbd0, v_a61db3, v_9b1a04, v_843035 } from '../constants';
import { v_ce4741, v_a0daa8 } from '../navigation';
import { v_01332e, v_4b1d5e } from '../services';
import { v_4b1173 } from '../context/AlertDialogContext';

export const v_0e5276 = () => {
  const { t: v_8d41d7 } = v_772971();
  const { reset: v_487a25 } = v_a0daa8();
  const { showAlert: v_889fad } = v_4b1173();
  const [v_9bf12c, v_fb6bbb] = v_5ab095('');
  const [v_88dca2, v_e33ec0] = v_5ab095(false);
  const [v_660822, v_06fdbc] = v_5ab095<number | null>(null);
  const [v_f4fb5e, v_d9bcc7] = v_5ab095('');

  v_c4deb2(() => {
    const v_0e1f49 = async () => {
      try {
        const v_f24fd5 = await v_e84827.getItem('userData');
        if (!v_f24fd5) {
          console.error('[추천인 입력] 사용자 데이터를 찾을 수 없습니다.');

          v_487a25(v_ce4741.map);
          return;
        }

        const v_ef7306 = JSON.parse(v_f24fd5);
        const v_717992 = v_ef7306?.member;
        const v_e0c7e8 = v_ef7306?.email || '';

        if (!v_717992) {
          console.error('[추천인 입력] member ID를 찾을 수 없습니다.');
          v_487a25(v_ce4741.map);
          return;
        }

        v_06fdbc(v_717992);
        v_d9bcc7(v_e0c7e8);
      } catch (v_5e9bfe) {
        console.error('[추천인 입력] 데이터 로드 오류:', v_5e9bfe);
        v_487a25(v_ce4741.map);
      }
    };

    v_0e1f49();
  }, [v_487a25]);

  const v_585b02 = async () => {
    if (!v_9bf12c.trim()) {
      await v_889fad(
        v_8d41d7('screens.referralInput.alerts.warning') || '알림',
        v_8d41d7('screens.referralInput.alerts.emailRequired') || '추천인 이메일을 입력해주세요.',
      );
      return;
    }

    if (!v_660822) {
      await v_889fad(
        v_8d41d7('screens.referralInput.alerts.error') || '오류',
        v_8d41d7('screens.referralInput.alerts.userDataNotFound') || '사용자 정보를 찾을 수 없습니다.',
      );
      return;
    }

    if (v_9bf12c.trim().toLowerCase() === v_f4fb5e.toLowerCase()) {
      await v_889fad(
        v_8d41d7('screens.referralInput.alerts.warning') || '알림',
        v_8d41d7('screens.referralInput.alerts.selfReferral') || '자기 자신을 추천인으로 등록할 수 없습니다.',
      );
      return;
    }

    v_e33ec0(true);

    try {

      console.log('[추천인 입력] 추천인 이메일 확인 요청:', v_9bf12c.trim());
      const v_65bdb1 = await v_01332e(v_9bf12c.trim(), v_487a25);

      if (!v_65bdb1) {

        const v_af3e48 = await v_889fad(
          v_8d41d7('screens.referralInput.alerts.referralConfirm') || '추천인 확인',
          v_8d41d7('screens.referralInput.errors.referralInvalid') || '유효하지 않은 추천인 이메일입니다. 계속 진행하시겠습니까?',
          [
            {
              text: v_8d41d7('screens.referralInput.alerts.cancel') || '취소',
              style: 'cancel',
              onPress: () => {
                v_e33ec0(false);
              },
            },
            {
              text: v_8d41d7('screens.referralInput.alerts.continue') || '계속',
              onPress: () => {

                v_78ac9c();
              },
            },
          ],
        );

        if (v_af3e48 === 0) {

          v_e33ec0(false);
          return;
        }

        return;
      }

      console.log('[추천인 입력] 추천인 등록 요청:', { member: v_660822, email: v_9bf12c.trim() });
      const v_92aa7e = await v_4b1d5e(v_660822, v_9bf12c.trim(), v_487a25);

      console.log('[추천인 입력] 추천인 등록 결과:', v_92aa7e);

      await v_889fad(
        v_8d41d7('screens.referralInput.alerts.success') || '완료',
        v_8d41d7('screens.referralInput.alerts.registered') || '추천인이 등록되었습니다.',
      );

      v_487a25(v_ce4741.map);
    } catch (v_5e9bfe) {
      console.error('[추천인 입력] 오류:', v_5e9bfe);
      await v_889fad(
        v_8d41d7('screens.referralInput.alerts.error') || '오류',
        v_5e9bfe.message || v_8d41d7('screens.referralInput.errors.registerFailed') || '추천인 등록에 실패했습니다.',
      );
      v_e33ec0(false);
    }
  };

  const v_78ac9c = () => {
    v_e33ec0(false);
    v_487a25(v_ce4741.map);
  };

  return (
    <View style={v_d81136.container}>
      <Header
        title={v_8d41d7('screens.referralInput.title') || '추천인 입력'}
        showBackButton={false}
      />

      <SafeScrollView contentContainerStyle={v_d81136.scrollContent}>
        <View style={v_d81136.content}>
          <Text style={v_d81136.description}>
            {v_8d41d7('screens.referralInput.description') || '추천인 이메일을 입력하시면 보너스를 받으실 수 있습니다.\n(선택사항)'}
          </Text>

          <FormField
            label={v_8d41d7('screens.referralInput.emailLabel') || '추천인 이메일'}
            value={v_9bf12c}
            onChangeText={v_fb6bbb}
            autoCapitalize="none"
            keyboardType="email-address"
            placeholder={v_8d41d7('screens.referralInput.emailPlaceholder') || 'oth-staff@example.invalid'}
            editable={!v_88dca2}
            containerStyle={v_d81136.formField}
          />

          {v_88dca2 && (
            <ActivityIndicator size="large" color={v_1bfbd0.buttonPrimary} style={v_d81136.loader} />
          )}

          <View style={v_d81136.buttonContainer}>
            <PrimaryButton
              title={v_88dca2 ? (v_8d41d7('screens.referralInput.processing') || '처리 중...') : (v_8d41d7('screens.referralInput.submit') || '등록')}
              fullWidth
              onPress={v_585b02}
              disabled={v_88dca2}
              style={v_d81136.submitButton}
            />

            <SecondaryButton
              title={v_8d41d7('screens.referralInput.skip') || '건너뛰기'}
              fullWidth
              onPress={v_78ac9c}
              disabled={v_88dca2}
              style={v_d81136.skipButton}
            />
          </View>
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
    paddingHorizontal: v_9b1a04.medium,
  },
  content: {
    flex: 1,
    paddingTop: v_9b1a04.large,
  },
  description: {
    ...v_843035.body,
    color: v_1bfbd0.text,
    marginBottom: v_9b1a04.xlarge,
    textAlign: 'center',
    lineHeight: 22,
  },
  formField: {
    marginBottom: v_9b1a04.xlarge,
  },
  loader: {
    marginVertical: v_9b1a04.medium,
  },
  buttonContainer: {
    ...v_a61db3.bottomSection,
    gap: v_9b1a04.medium,
  },
  submitButton: {
    marginBottom: 0,
  },
  skipButton: {
    marginBottom: 0,
  },
});
