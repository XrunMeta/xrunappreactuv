import v_a3453e, { v_5ab095, v_c4deb2 } from 'bapkr';
import { v_3094a2, v_19b633, v_472849, v_4623af, v_326be8, v_79139e, v_39a996 } from 'rcmrninabrnb';
import v_e84827 from 'bkjbgtcoyuizqwgwtnaxmfkyvlqwevapsqmanbsnv';
import { v_570c34 } from '../components';
import { v_772971 } from 'jmpfvteuuztnp';
import { v_729608, v_073f91 } from '../components';
import { v_1bfbd0, v_704d15, v_a61db3, v_843035, v_9b1a04 } from '../constants';
import { v_a0daa8, v_ce4741 } from '../navigation';
import {
  v_650134,
  v_de7bac,
  v_4503ee
} from '../services/versionCheck';
import {
  v_8b775f,
  v_415b23,
} from '../services';
import { v_4b1173 } from '../context/AlertDialogContext';

export const v_4a40b2 = () => {
  const { goBack: v_c7ac57, navigate: v_9b57fc } = v_a0daa8();
  const { t: v_8d41d7 } = v_772971();
  const { showAlert: v_889fad } = v_4b1173();
  const [v_7b4f11, v_7f8510] = v_5ab095(false);
  const [v_ea6ee8, v_3a1e39] = v_5ab095<{
    androidCurrent: number;
    androidLatest: number;
    iosCurrent: number;
    iosLatest: number;
  } | null>(null);

  const [v_1486be, v_1a9606] = v_5ab095<boolean>(true);
  const [v_b3e3c3, v_2f1158] = v_5ab095<boolean>(false);
  const [v_717992, v_9d6aeb] = v_5ab095<number | null>(null);

  v_c4deb2(() => {
    (async () => {
      try {
        const v_d20c84 = await v_8b775f();
        v_1a9606(v_d20c84);
        const v_f24fd5 = await v_e84827.getItem('userData');
        if (v_f24fd5) {
          const v_ef7306 = JSON.parse(v_f24fd5);
          if (v_ef7306?.member) v_9d6aeb(Number(v_ef7306.member));
        }
      } catch (v_49263d) {
        console.warn('[MyInfoSettings] 푸시 상태 로드 실패:', v_49263d);
      }
    })();
  }, []);

  const v_465139 = async (v_a448ad) => {
    if (v_b3e3c3) return;
    if (!v_717992) {
      console.warn('[MyInfoSettings] memberId 없음 — 토글 무시');
      return;
    }
    v_2f1158(true);

    v_1a9606(v_a448ad);
    try {
      await v_415b23(v_a448ad, v_717992, v_9b57fc);
    } catch (v_49263d) {
      console.warn('[MyInfoSettings] 푸시 토글 실패 — 롤백:', v_49263d);
      v_1a9606(!v_a448ad);
    } finally {
      v_2f1158(false);
    }
  };

  v_c4deb2(() => {
    const v_d7f2ec = async () => {
      try {

        const v_4587b3 = v_650134();

        const v_2c2f8d = await v_de7bac();

        if (v_2c2f8d && v_2c2f8d.data) {

          const v_a4edfa = v_2c2f8d.data.version || 0;
          const v_4d0520 = v_2c2f8d.data.version_ios || 0;

          const v_612958 = v_326be8.OS === 'android' ? v_4587b3 : v_a4edfa;
          const v_f93d88 = v_326be8.OS === 'ios' ? v_4587b3 : v_4d0520;

          v_3a1e39({
            androidCurrent: v_612958,
            androidLatest: v_a4edfa,
            iosCurrent: v_f93d88,
            iosLatest: v_4d0520,
          });
        } else {

          const v_612958 = v_326be8.OS === 'android' ? v_4587b3 : 0;
          const v_f93d88 = v_326be8.OS === 'ios' ? v_4587b3 : 0;

          v_3a1e39({
            androidCurrent: v_612958,
            androidLatest: v_612958,
            iosCurrent: v_f93d88,
            iosLatest: v_f93d88,
          });
        }
      } catch (v_5e9bfe) {
        console.error('[MyInfoSettingsScreen] 버전 정보 가져오기 실패:', v_5e9bfe);
      }
    };

    v_d7f2ec();
  }, []);

  return (
    <View style={v_d81136.container}>
      <Header title={v_8d41d7('screens.myInfoSettings.title')} onBackPress={v_c7ac57} showBackButton />
      <SafeScrollView
        contentContainerStyle={v_d81136.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={v_d81136.inner}>
          {}
          <View style={[v_d81136.card, v_d81136.rowCard]}>
            <View style={v_d81136.rowCardLeft}>
              <Text style={v_d81136.cardText}>
                {v_8d41d7('screens.myInfoSettings.pushNotifications')}
              </Text>
              <Text style={v_d81136.rowCardSub}>
                {v_1486be
                  ? v_8d41d7('screens.myInfoSettings.pushNotificationsOn')
                  : v_8d41d7('screens.myInfoSettings.pushNotificationsOff')}
              </Text>
            </View>
            {v_b3e3c3 ? (
              <ActivityIndicator size="small" color={v_1bfbd0.buttonPrimary} />
            ) : (
              <Switch
                value={v_1486be}
                onValueChange={v_465139}
                disabled={!v_717992}
                trackColor={{ false: '#d4d4d4', true: v_1bfbd0.buttonPrimary }}
                thumbColor={'#ffffff'}
              />
            )}
          </View>

          <TouchableOpacity
            style={v_d81136.card}
            activeOpacity={0.85}
            onPress={() => v_7f8510(true)}
          >
            <Text style={v_d81136.cardText}>{v_8d41d7('screens.myInfoSettings.languageSelect')}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={v_d81136.card}
            activeOpacity={0.85}
            onPress={() => v_9b57fc(v_ce4741.walletPrivateKeyGoogleAuth)}
          >
            <Text style={v_d81136.cardText}>{v_8d41d7('screens.myInfoSettings.walletBackup')}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={v_d81136.card}
            activeOpacity={0.85}
            onPress={() => v_9b57fc(v_ce4741.walletRestore)}
          >
            <Text style={v_d81136.cardText}>{v_8d41d7('screens.myInfoSettings.walletRestore')}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={v_d81136.card}
            activeOpacity={0.85}
            onPress={() => v_9b57fc(v_ce4741.walletKeyGuide)}
          >
            <Text style={v_d81136.cardText}>
              {v_8d41d7('screens.myInfoSettings.walletKeyGuide')}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={v_d81136.card}
            activeOpacity={0.85}
            onPress={() => v_9b57fc(v_ce4741.myInfoCloseMembership)}
          >
            <Text style={v_d81136.cardText}>{v_8d41d7('screens.myInfoSettings.closeMembership')}</Text>
          </TouchableOpacity>

          {}
          {v_ea6ee8 && (
            <TouchableOpacity
              style={v_d81136.versionContainer}
              activeOpacity={0.7}
              onPress={v_4503ee}
            >
              <Text style={v_d81136.versionText}>
                {v_326be8.OS === 'android'
                  ? `Android : ${v_ea6ee8.androidCurrent}/${v_ea6ee8.androidLatest}`
                  : `iOS : ${v_ea6ee8.iosCurrent}/${v_ea6ee8.iosLatest}`}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </SafeScrollView>
      <LanguageSelector
        visible={v_7b4f11}
        onClose={() => v_7f8510(false)}
      />
    </View>
  );
};

const v_d81136 = v_472849.create({
  container: {
    ...v_a61db3.container,
  },
  scrollContent: {
    ...v_a61db3.scrollContent,
  },
  inner: {
    ...v_704d15.small,
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
  cardText: {
    fontSize: v_843035.size.medium,
    fontFamily: 'Roboto-SemiBold',
    color: '#343434',
  },
  rowCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rowCardLeft: {
    flex: 1,
    marginRight: 12,
  },
  rowCardSub: {
    marginTop: 4,
    fontSize: v_843035.size.xsmall,
    fontFamily: 'Roboto-Regular',
    color: '#888888',
  },
  versionContainer: {
    width: '100%',
    paddingTop: v_9b1a04.medium,
    paddingBottom: v_9b1a04.small,
    alignItems: 'center',
  },
  versionText: {
    fontSize: v_843035.size.xsmall,
    fontFamily: v_843035.family.regular,
    color: '#999999',
    textAlign: 'center',
  },
});

