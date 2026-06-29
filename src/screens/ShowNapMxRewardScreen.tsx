

import v_a3453e, { v_de06a3, v_df9f57, v_e662ae, v_5ab095 } from 'bapkr';
import { v_3094a2, v_472849, v_326be8, v_39a996, v_4623af, v_19b633 } from 'rcmrninabrnb';
import { v_2694e4, v_294b10 } from 'ahewcyoxtiosvtfuluxp';
import { v_e0068c } from 'vvfgtwbmdpbnvhtfbtbgudicfmpscw';
import { v_25515d } from 'zvyjokvuouwvifyzks';
import { v_a0daa8 } from '../navigation';
import { v_4b1173 } from '../context/AlertDialogContext';

const v_50fbed = { media_key: '11241', adunit_id: '105853' };
const v_52f250 = { media_key: '11242', adunit_id: '105854' };

const v_cc13a7 = (v_920111, v_906359) => `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
  <style>
    html, body { margin: 0; padding: 0; background: #000; width: 100vw; height: 100vh; overflow: hidden; }
    #${`admixer_${v_920111}_${v_906359}`} { width: 100%; height: 100%; }
  </style>
</head>
<body>
  <div id="admixer_${v_920111}_${v_906359}"></div>
  <script type="text/javascript" src="//cdnet.nasmob.com/axssp/websdk/v1/admixer.min.js"></script>
  <script type="text/javascript">
    (function () {
      function postRN(payload) {
        try {
          if (window.ReactNativeWebView && window.ReactNativeWebView.postMessage) {
            window.ReactNativeWebView.postMessage(JSON.stringify(payload));
          }
        } catch (e) { /* ignore */ }
      }
      try {
        admixer_m({
          media_key: "${v_920111}",
          adunits: [{
            adunit_id: "${v_906359}",
            target_id: "admixer_${v_920111}_${v_906359}",
            close_btn: false,
            callback: {
              success: function () { postRN({ type: 'reward_success' }); },
              fail: function (code, msg) { postRN({ type: 'reward_fail', code: code, msg: msg }); }
            }
          }],
          coppa: 1,
          log: true
        });
      } catch (e) {
        postRN({ type: 'reward_init_error', msg: String(e && e.message ? e.message : e) });
      }
    })();
  </script>
</body>
</html>`;

export const ShowNapMxRewardScreen: v_a3453e.FC = () => {
  const v_033e14 = v_e0068c();
  const { goBack: v_c7ac57 } = v_a0daa8();
  const { showAlert: v_889fad } = v_4b1173();
  const [v_683210, v_34a50a] = v_5ab095(true);
  const v_00b19b = v_e662ae(false);

  const { media_key: v_a2b8cb, adunit_id: v_3358c8 } = v_326be8.OS === 'ios' ? v_52f250 : v_50fbed;
  const v_d91d98 = v_df9f57(() => v_cc13a7(v_a2b8cb, v_3358c8), [v_a2b8cb, v_3358c8]);

  const v_99b1ed = v_de06a3(async (event: v_294b10) => {
    if (v_00b19b.current) return;
    let v_931bf0 = null;
    try { v_931bf0 = JSON.parse(v_d48baf.nativeEvent.data); } catch { return; }
    if (!v_931bf0?.type) return;
    if (v_931bf0.type === 'reward_success') {
      v_00b19b.current = true;

      await v_889fad(
        '광고 시청 완료',
        '광고 시청이 완료되었어요. 보상이 지급될 예정이에요.',
      );
      v_c7ac57();
    } else if (v_931bf0.type === 'reward_fail') {
      v_00b19b.current = true;
      await v_889fad(
        '광고 로드 실패',
        `광고를 불러오지 못했어요. (${v_931bf0.code ?? '-'})\n잠시 후 다시 시도해주세요.`,
      );
      v_c7ac57();
    } else if (v_931bf0.type === 'reward_init_error') {
      v_00b19b.current = true;
      await v_889fad('광고 오류', '광고 모듈을 초기화하지 못했어요.\n잠시 후 다시 시도해주세요.');
      v_c7ac57();
    }
  }, [v_c7ac57, v_889fad]);

  return (
    <View style={[v_d81136.container, { paddingTop: v_033e14.top }]}>
      <View style={v_d81136.header}>
        <TouchableOpacity onPress={v_c7ac57} style={v_d81136.closeBtn} hitSlop={{ top: 10, left: 10, right: 10, bottom: 10 }}>
          <Ionicons name="close" size={28} color="#fff" />
        </TouchableOpacity>
        <Text style={v_d81136.title}>광고 시청</Text>
        <View style={v_d81136.closeBtn} />
      </View>
      <View style={v_d81136.webViewWrapper}>
        <WebView
          originWhitelist={['*']}
          source={{ html: v_d91d98, baseUrl: 'https://oth-path-51a04e.example.invalid' }}
          javaScriptEnabled
          domStorageEnabled
          mediaPlaybackRequiresUserAction={false}
          allowsInlineMediaPlayback
          onMessage={v_99b1ed}
          onLoadEnd={() => v_34a50a(false)}
          style={{ flex: 1, backgroundColor: '#000' }}
        />
        {v_683210 && (
          <View style={v_d81136.loadingOverlay}>
            <ActivityIndicator size="large" color="#fff" />
          </View>
        )}
      </View>
    </View>
  );
};

const v_d81136 = v_472849.create({
  container: { flex: 1, backgroundColor: '#000' },
  header: {
    height: 48, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 12, backgroundColor: '#000',
  },
  title: { color: '#fff', fontSize: 16, fontFamily: 'Roboto-Bold' },
  closeBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  webViewWrapper: { flex: 1, backgroundColor: '#000' },
  loadingOverlay: {
    ...v_472849.absoluteFillObject, alignItems: 'center', justifyContent: 'center', backgroundColor: '#000',
  },
});

export default v_76ecb6;
