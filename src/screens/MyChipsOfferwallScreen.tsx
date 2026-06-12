import v_a3453e, { v_c4deb2, v_5ab095, v_e662ae } from 'bapkr';
import {
  v_3094a2,
  v_472849,
  v_39a996,
  v_1ed974,
  v_326be8,
} from 'rcmrninabrnb';
import { v_e0068c } from 'vvfgtwbmdpbnvhtfbtbgudicfmpscw';
import { v_2694e4 } from 'ahewcyoxtiosvtfuluxp';
import v_e84827 from 'bkjbgtcoyuizqwgwtnaxmfkyvlqwevapsqmanbsnv';
import { v_729608 } from '../components';
import { v_a0daa8 } from '../navigation';
import { v_a61db3, v_1bfbd0 } from '../constants';

const v_0625de = v_326be8.OS === 'ios'
  ? 'fe775420-0581-4fe7-b732-85d4ef03c367'
  : '93a7b6fa-d336-41d9-a653-cd657802faf2';

export const v_0ca15f = () => {
  const { goBack: v_c7ac57 } = v_a0daa8();
  const v_033e14 = v_e0068c();
  const v_35f830 = v_e662ae<v_2694e4>(null);
  const [v_43e90c, v_688dd2] = v_5ab095<string>('');
  const [v_cd31a8, v_deef62] = v_5ab095(true);

  v_c4deb2(() => {
    const v_0e1f49 = async () => {
      try {
        const v_e5066f = await v_e84827.getItem('userData');
        if (v_e5066f) {
          const v_8decf8 = JSON.parse(v_e5066f);
          if (v_8decf8.member) {
            v_688dd2(String(v_8decf8.member));
          }
        }
      } catch (v_9e86fd) {
        console.warn('[MyChips] userData 로드 실패:', v_9e86fd);
      }
      v_deef62(false);
    };
    v_0e1f49();
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

    const v_269481 = v_1ed974.addEventListener(
      'hardwareBackPress',
      v_f442f6,
    );
    return () => v_269481.remove();
  }, []);

  const v_6da94b = `https://sdk.mychips.io/content?content_id=${v_0625de}&user_id=${v_43e90c}&gender=&age=`;

  const v_0a35c3 = v_033e14.bottom;

  if (v_cd31a8) {
    return (
      <View style={[v_d81136.container, { paddingBottom: v_0a35c3 }]}>
        <Header title="Zone 2" onBackPress={v_c7ac57} showBackButton />
        <View style={v_d81136.loadingContainer}>
          <ActivityIndicator size="large" color={v_1bfbd0.primary} />
        </View>
      </View>
    );
  }

  return (
    <View style={[v_d81136.container, { paddingBottom: v_0a35c3 }]}>
      <Header title="Zone 2" onBackPress={v_c7ac57} showBackButton />
      <WebView
        ref={v_35f830}
        source={{ uri: v_6da94b }}
        style={v_d81136.webView}
        javaScriptEnabled
        domStorageEnabled
        startInLoadingState
        allowsInlineMediaPlayback
        mediaPlaybackRequiresUserAction={false}
        renderLoading={() => (
          <View style={v_d81136.loadingOverlay}>
            <ActivityIndicator size="large" color={v_1bfbd0.primary} />
          </View>
        )}
        onError={(v_6f3a9d) => {
          const { nativeEvent: v_76b943 } = v_6f3a9d;
          console.warn('[MyChips] WebView error:', v_76b943);
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
