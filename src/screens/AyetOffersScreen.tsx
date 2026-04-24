import v_a3453e, { v_c4deb2, v_5ab095, v_e662ae } from 'bapkr';
import {
  v_3094a2,
  v_472849,
  v_39a996,
  v_6b5698,
  v_1ed974,
  v_f2c756,
  v_326be8,
} from 'rcmrninabrnb';
import { v_2694e4 } from 'ahewcyoxtiosvtfuluxp';
import v_e84827 from 'bkjbgtcoyuizqwgwtnaxmfkyvlqwevapsqmanbsnv';
import { v_729608 } from '../components';
import { v_a0daa8 } from '../navigation';
import { v_a61db3, v_1bfbd0 } from '../constants';
import { v_5e4f0b } from '../services/ayet';

const v_e56d32 = v_326be8.OS === 'ios' ? '25755' : '25617';

export const AyetOffersScreen: v_a3453e.FC = () => {
  const { goBack: v_c7ac57 } = v_a0daa8();
  const v_35f830 = v_e662ae<v_2694e4>(null);
  const [v_43e90c, v_688dd2] = v_5ab095<string>('');
  const [v_cd31a8, v_deef62] = v_5ab095(true);

  const [v_a039ac, v_af9c21] = v_5ab095(0);

  const v_eb8c24 = v_e662ae(false);

  v_c4deb2(() => {
    (async () => {
      try {
        const v_e5066f = await v_e84827.getItem('userData');
        let v_717992 = '';
        if (v_e5066f) {
          const v_8decf8 = JSON.parse(v_e5066f);
          if (v_8decf8?.member != null) v_717992 = String(v_8decf8.member);
        }
        v_688dd2(v_717992);
        v_deef62(false);

        if (v_717992) {
          v_5e4f0b(v_717992).catch((v_9e86fd) => {
            console.warn('[ayeT] setAyetUserIdAsync 실패(백그라운드):', v_9e86fd);
          });
        }
      } catch (v_9e86fd) {
        console.warn('[ayeT] userData 로드 실패:', v_9e86fd);
        v_deef62(false);
      }
    })();
  }, []);

  v_c4deb2(() => {
    if (v_326be8.OS !== 'android') return;
    const v_f442f6 = () => {
      if (v_35f830.current) {
        v_35f830.current.goBack();
        return true;
      }
      return false;
    };
    const v_1ae212 = v_1ed974.addEventListener('hardwareBackPress', v_f442f6);
    return () => v_1ae212.remove();
  }, []);

  v_c4deb2(() => {
    let v_5c3267 = v_6b5698.currentState;
    const v_1ae212 = v_6b5698.addEventListener('change', (v_a448ad) => {
      if (v_5c3267 !== 'active' && v_a448ad === 'active' && v_eb8c24.current) {
        console.log('[ayeT WebView] 외부앱 복귀 → WebView remount');
        v_eb8c24.current = false;
        v_af9c21((v_0eb677) => v_0eb677 + 1);
      }
      v_5c3267 = v_a448ad;
    });
    return () => v_1ae212.remove();
  }, []);

  const v_6da94b = `https://offerwall.ayet.io/offers?adSlot=${v_e56d32}&external_identifier=${encodeURIComponent(v_43e90c)}`;

  if (v_cd31a8) {
    return (
      <View style={v_d81136.container}>
        <Header title="Xplay" onBackPress={v_c7ac57} showBackButton />
        <View style={v_d81136.loadingContainer}>
          <ActivityIndicator size="large" color={v_1bfbd0.primary} />
        </View>
      </View>
    );
  }

  return (
    <View style={v_d81136.container}>
      <Header title="Xplay" onBackPress={v_c7ac57} showBackButton />
      <WebView
        key={v_a039ac}
        ref={v_35f830}
        source={{ uri: v_6da94b }}
        style={v_d81136.webView}
        javaScriptEnabled
        domStorageEnabled
        thirdPartyCookiesEnabled
        sharedCookiesEnabled
        startInLoadingState
        allowsInlineMediaPlayback
        mediaPlaybackRequiresUserAction={false}
        setSupportMultipleWindows={false}
        onLoadStart={() => console.log(`[ayeT WebView] onLoadStart url=${v_6da94b}`)}
        onLoadEnd={() => console.log('[ayeT WebView] onLoadEnd')}
        onHttpError={(v_9e86fd) => console.warn('[ayeT WebView] HTTP 오류:', v_9e86fd.nativeEvent.statusCode, v_9e86fd.nativeEvent.url)}
        onShouldStartLoadWithRequest={(v_576f5a) => {
          console.log('[ayeT WebView] 네비게이션 요청:', v_576f5a.url);
          const { url: v_f71b56 } = v_576f5a;

          const v_1ed546 = ['itms-apps://', 'itms-appss://', 'itms-services://', 'tel:', 'sms:', 'mailto:', 'facetime:'];
          if (v_1ed546.some((v_fd5f43) => v_f71b56.startsWith(v_fd5f43))) {
            v_eb8c24.current = true;
            v_f2c756.openURL(v_f71b56).catch((v_9e86fd) => console.warn('[ayeT WebView] 외부 URL open 실패:', v_9e86fd));
            return false;
          }
          if (v_f71b56.startsWith('https://apps.apple.com') || v_f71b56.startsWith('https://itunes.apple.com')) {
            v_eb8c24.current = true;
            v_f2c756.openURL(v_f71b56).catch((v_9e86fd) => console.warn('[ayeT WebView] App Store open 실패:', v_9e86fd));
            return false;
          }
          if (v_f71b56.startsWith('market://') || v_f71b56.startsWith('intent://')) {
            v_eb8c24.current = true;
            v_f2c756.openURL(v_f71b56).catch((v_9e86fd) => console.warn('[ayeT WebView] Play Store/Intent open 실패:', v_9e86fd));
            return false;
          }
          return true;
        }}
        renderLoading={() => (
          <View style={v_d81136.loadingOverlay}>
            <ActivityIndicator size="large" color={v_1bfbd0.primary} />
          </View>
        )}
        onError={(v_6f3a9d) => {
          const { nativeEvent: v_76b943 } = v_6f3a9d;
          console.warn('[ayeT] WebView error:', v_76b943);
        }}
      />
    </View>
  );
};

const v_d81136 = v_472849.create({
  container: {
    ...v_a61db3.container,
  },
  webView: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});
