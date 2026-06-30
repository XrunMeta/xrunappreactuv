

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { View, StyleSheet, Platform, ActivityIndicator, TouchableOpacity, Text } from 'react-native';
import { WebView, WebViewMessageEvent } from 'react-native-webview';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAppNavigation } from '../navigation';
import { useAlertDialog } from '../context/AlertDialogContext';
import { getStoredAdvertisingId } from '../utils/napApiUtils';

const NAP_AOS = { media_key: '11241', adunit_id: '105853' };
const NAP_IOS = { media_key: '11242', adunit_id: '105854' };

const NAP_BUNDLE = Platform.OS === 'ios' ? '6502924173' : 'run.xrun.xrunapp';

const NAP_USER_AGENT = Platform.OS === 'ios'
  ? `Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 ${NAP_BUNDLE}`
  : `Mozilla/5.0 (Linux; Android 15; SM-M156S) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36 ${NAP_BUNDLE}`;

const buildInlineHtml = (mediaKey: string, adunitId: string, ifa: string, bundle: string) => `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
  <style>
    html, body { margin: 0; padding: 0; background: #000; width: 100vw; height: 100vh; overflow: hidden; }
    #${`admixer_${mediaKey}_${adunitId}`} { width: 100%; height: 100%; }
  </style>
</head>
<body>
  <div id="admixer_${mediaKey}_${adunitId}"></div>
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
      ['log','warn','error'].forEach(function (lvl) {
        var orig = console[lvl];
        console[lvl] = function () {
          try {
            var args = Array.prototype.slice.call(arguments).map(function (a) {
              try { return typeof a === 'string' ? a : JSON.stringify(a); } catch (e) { return String(a); }
            });
            postRN({ type: 'console', level: lvl, args: args });
          } catch (e) {}
          orig.apply(console, arguments);
        };
      });
      postRN({ type: 'diag', ua: navigator.userAgent, href: location.href });
      try {
        postRN({ type: 'diag', admixer_m_type: typeof admixer_m });
      } catch (e) {
        postRN({ type: 'diag', admixer_m_check_error: String(e) });
      }
      try {
        admixer_m({
          media_key: "${mediaKey}",
          platform: "${Platform.OS === 'ios' ? 'ios' : 'android'}",
          bundle: "${bundle}",
          device: {
            ifa: "${ifa}",
            os: "${Platform.OS === 'ios' ? 'ios' : 'android'}",
            osv: "${Platform.Version}",
            ua: navigator.userAgent
          },
          adunits: [{
            adunit_id: "${adunitId}",
            target_id: "admixer_${mediaKey}_${adunitId}",
            close_btn: false,
            callback: {
              success: function () { postRN({ type: 'reward_success' }); },
              fail: function (code, msg) { postRN({ type: 'reward_fail', code: code, msg: msg }); }
            }
          }],
          coppa: 0,
          log: true
        });
      } catch (e) {
        postRN({ type: 'reward_init_error', msg: String(e && e.message ? e.message : e) });
      }
    })();
  </script>
</body>
</html>`;

export const ShowNapMxRewardScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const { goBack } = useAppNavigation();
  const { showAlert } = useAlertDialog();
  const [loading, setLoading] = useState(true);
  const handledRef = useRef(false);

  const { media_key, adunit_id } = Platform.OS === 'ios' ? NAP_IOS : NAP_AOS;
  const [ifa, setIfa] = useState<string | null>(null);
  useEffect(() => {
    getStoredAdvertisingId().then(v => setIfa(v || '00000000-0000-0000-0000-000000000000'));
  }, []);
  const html = useMemo(
    () => ifa ? buildInlineHtml(media_key, adunit_id, ifa, NAP_BUNDLE) : '',
    [media_key, adunit_id, ifa],
  );

  const handleMessage = useCallback(async (event: WebViewMessageEvent) => {
    if (handledRef.current) return;
    let payload: any = null;
    try { payload = JSON.parse(event.nativeEvent.data); } catch {
      console.log('[nap-mx] raw message (parse fail):', event.nativeEvent.data);
      return;
    }
    console.log('[nap-mx] message:', JSON.stringify(payload));
    if (!payload?.type) return;
    if (payload.type === 'console' || payload.type === 'diag') return;
    if (payload.type === 'reward_success') {
      handledRef.current = true;

      await showAlert(
        '광고 시청 완료',
        '광고 시청이 완료되었어요. 보상이 지급될 예정이에요.',
      );
      goBack();
    } else if (payload.type === 'reward_fail') {
      handledRef.current = true;
      await showAlert(
        '광고 로드 실패',
        `광고를 불러오지 못했어요. (${payload.code ?? '-'})\n잠시 후 다시 시도해주세요.`,
      );
      goBack();
    } else if (payload.type === 'reward_init_error') {
      handledRef.current = true;
      await showAlert('광고 오류', '광고 모듈을 초기화하지 못했어요.\n잠시 후 다시 시도해주세요.');
      goBack();
    }
  }, [goBack, showAlert]);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={goBack} style={styles.closeBtn} hitSlop={{ top: 10, left: 10, right: 10, bottom: 10 }}>
          <Ionicons name="close" size={28} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.title}>광고 시청</Text>
        <View style={styles.closeBtn} />
      </View>
      <View style={styles.webViewWrapper}>
        {ifa && (
        <WebView
          originWhitelist={['*']}
          source={{ html, baseUrl: 'https://oth-path-app.example.invalid' }}
          userAgent={NAP_USER_AGENT}
          javaScriptEnabled
          domStorageEnabled
          mediaPlaybackRequiresUserAction={false}
          allowsInlineMediaPlayback
          onMessage={handleMessage}
          onLoadEnd={() => setLoading(false)}
          style={{ flex: 1, backgroundColor: '#000' }}
        />
        )}
        {loading && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color="#fff" />
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  header: {
    height: 48, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 12, backgroundColor: '#000',
  },
  title: { color: '#fff', fontSize: 16, fontFamily: 'Roboto-Bold' },
  closeBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  webViewWrapper: { flex: 1, backgroundColor: '#000' },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject, alignItems: 'center', justifyContent: 'center', backgroundColor: '#000',
  },
});

export default ShowNapMxRewardScreen;
