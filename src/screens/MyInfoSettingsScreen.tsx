import v_a3453e, { v_5ab095, v_c4deb2 } from 'bapkr';
import { v_3094a2, v_19b633, v_472849, v_4623af, v_326be8 } from 'rcmrninabrnb';
import { v_570c34 } from '../components';
import { v_772971 } from 'jmpfvteuuztnp';
import { v_729608, v_073f91 } from '../components';
import { v_1bfbd0, v_731ab4, v_704d15, v_a61db3, v_843035, v_9b1a04 } from '../constants';
import { v_a0daa8, v_ce4741 } from '../navigation';
import {
  v_650134,
  v_de7bac,
  v_4503ee
} from '../services/versionCheck';
import { v_592061 } from '../services/tapjoy';

export const v_4a40b2 = () => {
  const { goBack: v_c7ac57, navigate: v_9b57fc } = v_a0daa8();
  const { t: v_8d41d7 } = v_772971();
  const [v_7b4f11, v_7f8510] = v_5ab095(false);
  const [v_ea6ee8, v_3a1e39] = v_5ab095<{
    androidCurrent: number;
    androidLatest: number;
    iosCurrent: number;
    iosLatest: number;
  } | null>(null);

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
            onPress={() => v_9b57fc(v_ce4741.myInfoCloseMembership)}
          >
            <Text style={v_d81136.cardText}>{v_8d41d7('screens.myInfoSettings.closeMembership')}</Text>
          </TouchableOpacity>

          <Text style={v_d81136.sectionTitle}>{v_8d41d7('screens.myInfoSettings.reward')}</Text>
          {v_326be8.OS === 'android' && (
            <>
              <TouchableOpacity
                style={v_d81136.card}
                activeOpacity={0.85}
                onPress={() => v_9b57fc(v_ce4741.ayetOffers)}
              >
                <Text style={v_d81136.cardText}>{v_8d41d7('screens.myInfoSettings.ayet_offers')}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={v_d81136.card}
                activeOpacity={0.85}
                onPress={() => v_9b57fc(v_ce4741.ayetOffersXplay)}
              >
                <Text style={v_d81136.cardText}>{v_8d41d7('screens.myInfoSettings.ayet_offers_xplay')}</Text>
              </TouchableOpacity>
            </>
          )}
          <TouchableOpacity
            style={v_d81136.card}
            activeOpacity={0.85}
            onPress={() => {
              v_592061();
              v_9b57fc(v_ce4741.tapjoyList);
            }}
          >
            <Text style={v_d81136.cardText}>{v_8d41d7('screens.myInfoSettings.tapjoy')}</Text>
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
  sectionTitle: {
    fontSize: v_843035.size.small,
    fontFamily: v_843035.family.semibold,
    color: '#888',
    marginTop: v_9b1a04.medium,
    marginBottom: v_9b1a04.small,
    paddingHorizontal: 4,
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

