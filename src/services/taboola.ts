

import { v_326be8 } from 'rcmrninabrnb';
import { v_573fcf } from '../utils/env';

export type TaboolaPlacement =
  | 'myinfo_aos_395x80' 
  | 'myinfo_ios_395x80' 
  | 'shop_aos_395x80' 
  | 'shop_ios_395x80' 
  | 'apploading_aos_vignette' 
  | 'apploading_ios_vignette'; 

export type TaboolaMode = 'thumbnails-stream-a' | 'thumbnails-textunder-a';

export interface TaboolaPlacementConfig {
  placement: TaboolaPlacement;
  mode: TaboolaMode;
  pageType: 'article';
  targetType: 'mix';
}

export const v_968eda = {

  'myinfo_aos_395x80': {
    placement: 'myinfo_aos_395x80',
    mode: 'thumbnails-stream-a',
    pageType: 'article',
    targetType: 'mix',
  },
  'shop_aos_395x80': {
    placement: 'shop_aos_395x80',
    mode: 'thumbnails-stream-a',
    pageType: 'article',
    targetType: 'mix',
  },
  'apploading_aos_vignette': {
    placement: 'apploading_aos_vignette',
    mode: 'thumbnails-textunder-a',
    pageType: 'article',
    targetType: 'mix',
  },

  'myinfo_ios_395x80': {
    placement: 'myinfo_ios_395x80',
    mode: 'thumbnails-stream-a',
    pageType: 'article',
    targetType: 'mix',
  },
  'shop_ios_395x80': {
    placement: 'shop_ios_395x80',
    mode: 'thumbnails-stream-a',
    pageType: 'article',
    targetType: 'mix',
  },
  'apploading_ios_vignette': {
    placement: 'apploading_ios_vignette',
    mode: 'thumbnails-textunder-a',
    pageType: 'article',
    targetType: 'mix',
  },
};

export const v_0b0acf = async (): Promise<void> => {
  try {
    const v_26f42c =
      v_326be8.OS === 'android'
        ? v_573fcf('TABOOLA_PUBLISHER_ID_ANDROID')
        : v_573fcf('TABOOLA_PUBLISHER_ID_IOS');

    if (!v_26f42c) {
      console.warn('[Taboola] Publisher ID가 설정되지 않았습니다.');
      return;
    }

    if (v_326be8.OS === 'android') {

      console.log('[Taboola] Android 초기화:', v_26f42c);
    } else if (v_326be8.OS === 'ios') {

      console.log('[Taboola] iOS 초기화:', v_26f42c);
    }
  } catch (v_5e9bfe) {
    console.error('[Taboola] 초기화 실패:', v_5e9bfe);
  }
};

export const v_995f93 = (): string => {
  return v_326be8.OS === 'android'
    ? v_573fcf('TABOOLA_PUBLISHER_ID_ANDROID')
    : v_573fcf('TABOOLA_PUBLISHER_ID_IOS');
};

export const v_dc5d8f = (
  v_fc2d38,
  v_f76dc8 = false,
): TaboolaPlacement => {
  const v_c3d4a5 = v_326be8.OS === 'android' ? '_aos' : '_ios';
  const v_1a48ff = v_f76dc8 ? '_vignette' : '_395x80';

  return `${v_fc2d38}${v_c3d4a5}${v_1a48ff}` as TaboolaPlacement;
};

export const v_33aee4 = (): string => {

  const v_957cb0 =
    v_326be8.OS === 'android'
      ? 'https://play.google.com/store/apps/details?id=com.anonymous.x112102'
      : 'https://apps.apple.com/app/id123456789'; 

  return v_957cb0;
};

export const v_0433f6 = (
  v_26f42c,
  v_f36218,
  v_34e5bb,
  v_cdfaaa,
  v_967a83 = 'article',
  v_37b355 = 'mix',
): string => {
  console.log('[Taboola] HTML 생성:', {
    publisherId: v_26f42c,
    placement: v_f36218,
    mode: v_34e5bb,
    pageUrl: v_cdfaaa,
    pageType: v_967a83,
    targetType: v_37b355,
  });

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      margin: 0;
      padding: 0;
      background-color: #ffffff;
      overflow-x: hidden;
      width: 100%;
    }
    #taboola-container {
      width: 100%;
      min-height: 100px;
      background-color: #ffffff;
    }
  </style>
</head>
<body>
  <div id="taboola-container"></div>
  <script type="text/javascript">
    (function() {
      function logToRN(message, type) {
        if (window.ReactNativeWebView && window.ReactNativeWebView.postMessage) {
          window.ReactNativeWebView.postMessage(JSON.stringify({
            type: type || 'log',
            message: message
          }));
        }
      }

      var originalLog = console.log;
      var originalError = console.error;
      console.log = function() {
        originalLog.apply(console, arguments);
        logToRN(Array.from(arguments).join(' '), 'log');
      };
      console.error = function() {
        originalError.apply(console, arguments);
        logToRN(Array.from(arguments).join(' '), 'error');
      };

      logToRN('[Taboola WebView] 스크립트 시작');
      logToRN('[Taboola WebView] Publisher ID: ' + '${v_26f42c}');
      logToRN('[Taboola WebView] Placement: ' + '${v_f36218}');
      logToRN('[Taboola WebView] Mode: ' + '${v_34e5bb}');
      logToRN('[Taboola WebView] Page URL: ' + '${v_cdfaaa}');

      window._taboola = window._taboola || [];

      var taboolaConfig = {
        mode: '${v_34e5bb}',
        container: 'taboola-container',
        placement: '${v_f36218}',
        target_type: '${v_37b355}',
        publisher: '${v_26f42c}',
        page_url: '${v_cdfaaa}',
        page_type: '${v_967a83}',
        sourceType: 'organic',
        viewId: 'taboola-' + Date.now()
      };

      logToRN('[Taboola WebView] 설정: ' + JSON.stringify(taboolaConfig));

      _taboola.push(taboolaConfig);

      logToRN('[Taboola WebView] _taboola 배열에 푸시 완료 (총 ' + _taboola.length + '개)');

      !function (e, f, u, i) {
        if (!document.getElementById(i)){
          logToRN('[Taboola WebView] 방법 1: 모바일 로더 스크립트 로드 시작');
          e.async = 1;
          e.src = u;
          e.id = i;
          e.onload = function() {
            logToRN('[Taboola WebView] 방법 1: 스크립트 로드 완료');
            checkTaboolaAPI();
          };
          e.onerror = function(err) {
            logToRN('[Taboola WebView] 방법 1: 스크립트 로드 실패: ' + (err ? err.toString() : 'unknown error'), 'error');
            tryMethod2();
          };
          f.parentNode.insertBefore(e, f);
        } else {
          logToRN('[Taboola WebView] 방법 1: 스크립트가 이미 로드됨');
          checkTaboolaAPI();
        }
      }(document.createElement('script'),
        document.getElementsByTagName('script')[0],
        'https://cdn.taboola.com/libtrc/${v_26f42c}/mobile-loader.js',
        'tb-mobile-loader-script');

      function tryMethod2() {
        setTimeout(function() {
          if (!document.getElementById('tb-web-loader-script')) {
            logToRN('[Taboola WebView] 방법 2: 웹 위젯 스크립트 로드 시도');
            var webScript = document.createElement('script');
            webScript.src = 'https://cdn.taboola.com/libtrc/${v_26f42c}/loader.js';
            webScript.async = true;
            webScript.id = 'tb-web-loader-script';
            webScript.onload = function() {
              logToRN('[Taboola WebView] 방법 2: 웹 위젯 스크립트 로드 완료');
              checkTaboolaAPI();
            };
            webScript.onerror = function(err) {
              logToRN('[Taboola WebView] 방법 2: 웹 위젯 스크립트 로드 실패', 'error');
            };
            document.head.appendChild(webScript);
          }
        }, 3000);
      }

      function checkTaboolaAPI() {
        setTimeout(function() {
          if (window._taboola && window._taboola.length > 0) {
            logToRN('[Taboola WebView] _taboola 배열 확인: ' + window._taboola.length + '개 항목');
          }

          var apiFound = false;
          if (window.taboola) {
            logToRN('[Taboola WebView] window.taboola 발견');
            apiFound = true;
            try {
              if (typeof window.taboola.init === 'function') {
                window.taboola.init();
                logToRN('[Taboola WebView] window.taboola.init() 호출');
              }
            } catch (e) {
              logToRN('[Taboola WebView] window.taboola.init() 실패: ' + e.toString(), 'error');
            }
          }
          if (window.Taboola) {
            logToRN('[Taboola WebView] window.Taboola 발견');
            apiFound = true;
          }
          if (window._taboola && window._taboola.init) {
            logToRN('[Taboola WebView] window._taboola.init 발견');
            apiFound = true;
            try {
              window._taboola.init();
              logToRN('[Taboola WebView] window._taboola.init() 호출');
            } catch (e) {
              logToRN('[Taboola WebView] window._taboola.init() 실패: ' + e.toString(), 'error');
            }
          }

          if (!apiFound) {
            logToRN('[Taboola WebView] Taboola API를 찾을 수 없습니다. 스크립트가 제대로 로드되지 않았을 수 있습니다.', 'error');
            tryMethod2();
          }
        }, 1500);
      }

      setTimeout(function() {
        if (window._taboola && window._taboola.length > 0) {
          logToRN('[Taboola WebView] _taboola 재확인: ' + window._taboola.length + '개 항목');
          if (typeof window.taboola !== 'undefined' && window.taboola.init) {
            logToRN('[Taboola WebView] Taboola 수동 초기화 시도');
            try {
              window.taboola.init();
            } catch (err) {
              logToRN('[Taboola WebView] 수동 초기화 실패: ' + err.toString(), 'error');
            }
          }
        }
      }, 2000);

      var checkInterval = setInterval(function() {
        var container = document.getElementById('taboola-container');
        if (container) {
          var status = {
            exists: true,
            innerHTMLLength: container.innerHTML.length,
            childrenCount: container.children.length,
            hasContent: container.innerHTML.trim().length > 0,
            hasTaboolaElements: container.querySelectorAll('[class*="taboola"], [id*="taboola"]').length > 0
          };

          if (status.hasContent || status.hasTaboolaElements) {
            logToRN('[Taboola WebView] 콘텐츠 감지됨: ' + JSON.stringify(status));
            clearInterval(checkInterval);
          }
        }
      }, 1000);

      setTimeout(function() {
        clearInterval(checkInterval);
        var container = document.getElementById('taboola-container');
        var finalStatus = {
          exists: !!container,
          innerHTMLLength: container ? container.innerHTML.length : 0,
          childrenCount: container ? container.children.length : 0,
          hasContent: container ? container.innerHTML.trim().length > 0 : false,
          hasTaboolaElements: container ? container.querySelectorAll('[class*="taboola"], [id*="taboola"]').length > 0 : false,
          windowTaboola: typeof window.taboola !== 'undefined',
          windowTaboolaUnderscore: typeof window._taboola !== 'undefined' && window._taboola.length > 0
        };
        logToRN('[Taboola WebView] 10초 후 최종 상태: ' + JSON.stringify(finalStatus));

        if (!finalStatus.hasContent && !finalStatus.hasTaboolaElements) {
          logToRN('[Taboola WebView] 경고: Taboola 광고가 렌더링되지 않았습니다. 네이티브 SDK 사용을 권장합니다.', 'error');
        }
      }, 10000);
    })();
  </script>
</body>
</html>
  `.trim();
};
