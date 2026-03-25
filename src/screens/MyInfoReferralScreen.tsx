import v_a3453e, { v_5ab095, v_c4deb2 } from 'bapkr';
import { v_3094a2, v_19b633, v_472849, v_39a996 } from 'rcmrninabrnb';
import { v_570c34 } from '../components';
import { v_772971 } from 'jmpfvteuuztnp';
import v_e84827 from 'bkjbgtcoyuizqwgwtnaxmfkyvlqwevapsqmanbsnv';
import { v_729608, v_368e80, v_cb41de } from '../components';
import { v_1bfbd0, v_a61db3, v_704d15, v_843035 } from '../constants';
import { v_ce4741, v_a0daa8 } from '../navigation';
import { v_08316d, v_c58856, v_794a74 } from '../services';
import { v_4b1173 } from '../context/AlertDialogContext';

export const v_6086b6 = () => {
  const { t: v_8d41d7 } = v_772971();
  const { goBack: v_c7ac57, navigate: v_9b57fc } = v_a0daa8();
  const { showAlert: v_889fad } = v_4b1173();
  const [v_35edd0, v_a8dd41] = v_5ab095('');
  const [v_c9aa64, v_77b468] = v_5ab095('');
  const [v_5bb914, v_addc15] = v_5ab095('');
  const [v_f4fb5e, v_d9bcc7] = v_5ab095('');
  const [v_cd31a8, v_deef62] = v_5ab095(true);
  const [v_1e6dba, v_dbca5e] = v_5ab095(false);
  const [v_660822, v_06fdbc] = v_5ab095<string | null>(null);

  v_c4deb2(() => {
    const v_4fa913 = async () => {
      try {
        const v_abe33b = await v_e84827.getItem('userData');
        if (!v_abe33b) {
          v_deef62(false);
          return;
        }

        const v_9390e8 = JSON.parse(v_abe33b);
        const v_717992 = v_9390e8?.member ? String(v_9390e8.member) : null;
        v_06fdbc(v_717992);
        v_d9bcc7(v_9390e8?.email || '');

        if (!v_717992) {
          v_deef62(false);
          return;
        }

        console.log('[레퍼럴 수정] 현재 레퍼럴 조회 요청, member:', v_717992);

        const v_43c42e = await v_08316d(v_717992, v_9b57fc);

        console.log('[레퍼럴 수정] getMyRecommender 응답:', v_43c42e);

        if (v_43c42e && v_43c42e.status === 'success') {

          const v_9740cd = v_43c42e.data;
          const v_10ede1 = Array.isArray(v_9740cd) ? v_9740cd[0] : v_9740cd;

          if (v_10ede1 && v_10ede1.email) {

            const v_b43178 = v_10ede1.masked_email || v_10ede1.email || '';
            const v_8a1355 =
              v_10ede1.email
                ? (v_10ede1.firstname || v_10ede1.lastname
                    ? `${v_10ede1.firstname || ''}${v_10ede1.lastname || ''}`
                    : v_10ede1.email)
                : '';

            v_77b468(v_b43178);
            v_addc15(v_8a1355);
          } else {

            v_77b468('');
            v_addc15('');
          }
        } else {

          console.error('[레퍼럴 수정] 레퍼럴 조회 오류:', v_43c42e?.message);
          v_77b468('');
          v_addc15('');
        }
      } catch (v_49263d) {
        console.error('[레퍼럴 수정] 데이터 로드 오류:', v_49263d);
        v_77b468('');
        v_addc15('');
      } finally {
        v_deef62(false);
      }
    };

    v_4fa913();
  }, [v_9b57fc]);

  const v_03cae9 = async () => {

    if (!v_35edd0 || v_35edd0.trim() === '') {
      await v_889fad(v_8d41d7('screens.myInfoReferral.alerts.warning'), v_8d41d7('screens.myInfoReferral.alerts.emailRequired'));
      return;
    }

    if (v_35edd0 === v_c9aa64) {
      await v_889fad(v_8d41d7('screens.myInfoReferral.alerts.warning'), v_8d41d7('screens.myInfoReferral.alerts.noChange'));
      return;
    }

    if (!v_660822) {
      await v_889fad(v_8d41d7('screens.myInfoReferral.alerts.error'), v_8d41d7('screens.myInfoReferral.alerts.userDataNotFound'));
      return;
    }

    try {
      v_dbca5e(true);

      console.log('[레퍼럴 수정] 레퍼럴 설정 가능 여부 검증 요청:', v_35edd0);
      const v_fd95d1 = await v_c58856(v_660822, v_35edd0.trim(), v_9b57fc);

      console.log('[레퍼럴 수정] checkCanSetRecommender 응답:', v_fd95d1);

      if (!v_fd95d1) {

        await v_889fad(v_8d41d7('screens.myInfoReferral.alerts.failed'), v_8d41d7('screens.myInfoReferral.alerts.failedMessage'));
        v_dbca5e(false);
        return;
      }

      const v_f1a123 = v_fd95d1.code || v_fd95d1.status_code || 500;
      const v_c0e79a = (v_fd95d1?.message || '').toLowerCase();

      const v_103d25 =
        v_35edd0.trim().toLowerCase() === v_f4fb5e.toLowerCase() ||
        v_f1a123 === 400 ||
        v_c0e79a.includes('self') ||
        v_c0e79a.includes('yourself') ||
        v_c0e79a.includes('own') ||
        v_c0e79a.includes('자기 자신') ||
        v_c0e79a.includes('본인') ||
        v_c0e79a.includes('cannot set yourself') ||
        (v_fd95d1?.data && v_fd95d1.data.canSet === false && v_f1a123 === 400);

      if (v_103d25) {
        await v_889fad(v_8d41d7('screens.myInfoReferral.alerts.warning'), v_8d41d7('screens.myInfoReferral.alerts.cannotSetSelf'));
        v_dbca5e(false);
        return;
      }

      if (v_f1a123 === 404) {
        await v_889fad(v_8d41d7('screens.myInfoReferral.alerts.failed'), v_8d41d7('screens.myInfoReferral.alerts.notFound'));
        v_dbca5e(false);
        return;
      }

      if (v_f1a123 === 409) {

        const v_f2f303 =
          v_c0e79a.includes('already has') ||
          v_c0e79a.includes('already have') ||
          v_c0e79a.includes('이미 추천') ||
          v_c0e79a.includes('추천 기록');

        const v_a8cd21 = v_f2f303
          ? v_8d41d7('screens.myInfoReferral.alerts.alreadyHasRecommender')
          : v_8d41d7('screens.myInfoReferral.alerts.alreadyRegistered');

        await v_889fad(v_8d41d7('screens.myInfoReferral.alerts.warning'), v_a8cd21);
        v_dbca5e(false);
        return;
      }

      if (v_f1a123 !== 200) {
        await v_889fad(v_8d41d7('screens.myInfoReferral.alerts.failed'), v_8d41d7('screens.myInfoReferral.alerts.cannotSet'));
        v_dbca5e(false);
        return;
      }

      console.log('[레퍼럴 수정] 레퍼럴 설정 요청:', v_35edd0);
      const v_47323f = await v_794a74(v_660822, v_35edd0.trim(), v_9b57fc);

      console.log('[레퍼럴 수정] setRecommender 응답:', v_47323f);

      if (v_47323f && v_47323f.status === 'success') {
        await v_889fad(
          v_8d41d7('screens.myInfoReferral.alerts.success'),
          v_8d41d7('screens.myInfoReferral.alerts.successMessage'),
          [
            {
              text: v_8d41d7('screens.myInfoReferral.alerts.ok'),
              onPress: () => {
                v_9b57fc(v_ce4741.myInfo);
              },
            },
          ],
        );
      } else {
        await v_889fad(v_8d41d7('screens.myInfoReferral.alerts.failed'), v_8d41d7('screens.myInfoReferral.alerts.failedMessage'));
      }
    } catch (v_5e9bfe) {
      console.error('[레퍼럴 수정] 레퍼럴 수정 오류:', v_5e9bfe);
      await v_889fad(v_8d41d7('screens.myInfoReferral.alerts.failed'), v_8d41d7('screens.myInfoReferral.alerts.failedMessage'));
    } finally {
      v_dbca5e(false);
    }
  };

  return (
    <View style={v_d81136.container}>
      <Header title={v_8d41d7('screens.myInfoReferral.title')} onBackPress={v_c7ac57} showBackButton />
      {v_cd31a8 ? (
        <View style={v_d81136.loadingContainer}>
          <ActivityIndicator size="large" color={v_1bfbd0.buttonPrimary} />
        </View>
      ) : (
        <SafeScrollView
          contentContainerStyle={v_d81136.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          autoAdjustKeyboardPadding={true}
        >
          <View style={v_d81136.inner}>
            {

}
            <FormField
              label={v_8d41d7('screens.myInfoReferral.currentReferral')}
              value={
                v_c9aa64 || v_5bb914
                  ? v_5bb914 && v_c9aa64
                    ? `${v_5bb914} (${v_c9aa64})`
                    : v_c9aa64 || v_5bb914 || ''
                  : v_8d41d7('screens.myInfoReferral.noReferral')
              }
              editable={false}
            />

            <FormField
              label={v_8d41d7('screens.myInfoReferral.newReferralLabel')}
              value={v_35edd0}
              onChangeText={v_a8dd41}
              autoCapitalize="none"
              keyboardType="email-address"
              placeholder={v_8d41d7('screens.myInfoReferral.newReferralPlaceholder')}
              editable={!v_1e6dba}
            />
          </View>

          <View style={v_d81136.bottomSection}>
            <PrimaryButton
              title={v_1e6dba ? v_8d41d7('screens.myInfoReferral.processing') : v_8d41d7('screens.myInfoReferral.saveButton')}
              fullWidth
              onPress={v_03cae9}
              style={[v_d81136.primaryButton, v_1e6dba && v_d81136.buttonDisabled]}
              disabled={v_1e6dba}
            />
          </View>
        </SafeScrollView>
      )}
    </View>
  );
};

const v_d81136 = v_472849.create({
  container: {
    ...v_a61db3.container,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    flexGrow: 1,
    ...v_a61db3.scrollContent,
  },
  inner: {
    ...v_704d15.large,
  },
  sectionLabel: {
    fontSize: v_843035.size.medium,
    lineHeight: 24,
    color: '#2a2727',
    fontFamily: 'Roboto-Medium',
    marginBottom: 8,
  },
  card: {
    width: '100%',
    borderRadius: 15,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 18,
    shadowColor: '#3629b7',
    shadowOpacity: 0.07,
    shadowRadius: 15,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  cardName: {
    fontSize: v_843035.size.mmedium,
    fontFamily: 'Roboto-Medium',
    color: '#33395b',
  },
  cardEmail: {
    fontSize: v_843035.size.small,
    fontFamily: 'Roboto-Regular',
    color: '#bababa',
  },
  bottomSection: {
    ...v_a61db3.bottomButtonContainer,
  },
  primaryButton: {
    width: '100%',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
});
