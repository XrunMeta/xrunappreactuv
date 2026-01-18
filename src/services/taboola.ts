

import { v_326be8 } from 'rcmrninabrnb';
import { v_573fcf } from '../utils/env';

let v_b02f3c = null;
try {
  v_b02f3c = require('oxnazmqqjnwuflnfgczxckuhqeiiyoo').Taboola;
} catch (v_5e9bfe) {

  console.log('[Taboola] 네이티브 모듈을 로드할 수 없습니다. WebView 방식으로 폴백합니다.');
}

export type TaboolaPlacement =
  | 'myinfo_aos_395x80' 
  | 'myinfo_ios_395x80' 
  | 'myinfo_OS_395x80' 
  | 'shop_aos_395x80' 
  | 'shop_ios_395x80' 
  | 'shop_OS_395x80' 
  | 'apploading_aos_vignette' 
  | 'apploading_ios_vignette' 
  | 'apploading_OS_vignette' 
  | 'reward_aos_395x80' 
  | 'reward_aos_vignette' 
  | 'reward_ios_395x80' 
  | 'reward_ios_vignette' 
  | 'reward_OS_395x80' 
  | 'reward_OS_vignette'; 

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
  'reward_aos_395x80': {
    placement: 'reward_aos_395x80',
    mode: 'thumbnails-stream-a',
    pageType: 'article',
    targetType: 'mix',
  },
  'reward_aos_vignette': {
    placement: 'reward_aos_vignette',
    mode: 'thumbnails-textunder-a',
    pageType: 'article',
    targetType: 'mix',
  },
  'reward_ios_395x80': {
    placement: 'reward_ios_395x80',
    mode: 'thumbnails-stream-a',
    pageType: 'article',
    targetType: 'mix',
  },
  'reward_ios_vignette': {
    placement: 'reward_ios_vignette',
    mode: 'thumbnails-textunder-a',
    pageType: 'article',
    targetType: 'mix',
  },

  'myinfo_OS_395x80': {
    placement: 'myinfo_OS_395x80', 
    mode: 'thumbnails-stream-a',
    pageType: 'article',
    targetType: 'mix',
  },
  'shop_OS_395x80': {
    placement: 'shop_OS_395x80', 
    mode: 'thumbnails-stream-a',
    pageType: 'article',
    targetType: 'mix',
  },
  'apploading_OS_vignette': {
    placement: 'apploading_OS_vignette', 
    mode: 'thumbnails-textunder-a',
    pageType: 'article',
    targetType: 'mix',
  },
  'reward_OS_395x80': {
    placement: 'reward_OS_395x80', 
    mode: 'thumbnails-stream-a',
    pageType: 'article',
    targetType: 'mix',
  },
  'reward_OS_vignette': {
    placement: 'reward_OS_vignette', 
    mode: 'thumbnails-textunder-a',
    pageType: 'article',
    targetType: 'mix',
  },
};

export const v_17555f = (v_bb5e8c): TaboolaPlacement => {

  if (!v_bb5e8c.includes('_OS_')) {
    return v_bb5e8c;
  }

  const v_c20e12 = v_326be8.OS === 'android' ? '_aos_' : '_ios_';
  const v_4ea608 = v_bb5e8c.replace('_OS_', v_c20e12) as TaboolaPlacement;

  console.log('[Taboola] 배치 타입 변환:', {
    original: v_bb5e8c,
    converted: v_4ea608,
    platform: v_326be8.OS,
  });

  return v_4ea608;
};

export const v_ce593f = (): boolean => {
  return v_b02f3c !== null && typeof v_b02f3c.init === 'function';
};

export const v_0b0acf = async (): Promise<void> => {
  try {

    if (!v_ce593f()) {
      console.log('[Taboola] 네이티브 모듈이 없습니다. WebView 방식으로 폴백합니다.');
      return;
    }

    const v_26f42c =
      v_326be8.OS === 'android'
        ? '' 
        : v_573fcf('TABOOLA_PUBLISHER_ID_IOS');

    if (!v_26f42c) {
      console.warn('[Taboola] Publisher ID가 설정되지 않았습니다.');
      return;
    }

    if (v_b02f3c && typeof v_b02f3c.init === 'function') {
      v_b02f3c.init(v_26f42c);
      console.log('[Taboola] 초기화 완료:', {
        publisherId: v_26f42c,
        platform: v_326be8.OS,
      });
    } else {
      console.log('[Taboola] Taboola 모듈을 사용할 수 없습니다. WebView 방식으로 폴백합니다.');
    }
  } catch (v_5e9bfe) {
    console.error('[Taboola] 초기화 실패:', v_5e9bfe);
    console.log('[Taboola] WebView 방식으로 폴백합니다.');
  }
};

export const v_995f93 = (): string => {

  return v_326be8.OS === 'android'
    ? '' 
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
          (document.head || document.getElementsByTagName('head')[0] || f.parentNode).appendChild(e);
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
        }, 1000); // 3000ms에서 1000ms로 단축 (더 빠른 폴백)
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
        }, 50); // 100ms에서 50ms로 단축 (최대한 빠른 감지)
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
      }, 100); // 200ms에서 100ms로 단축 (최대한 빠른 감지)

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

          if (status.hasContent || status.hasTaboolaElements || status.innerHTMLLength > 50) {
            logToRN('[Taboola WebView] 콘텐츠 감지됨: ' + JSON.stringify(status));
            clearInterval(checkInterval);
          }
        }
      }, 50); // 100ms에서 50ms로 단축 (최대한 빠른 감지)

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

export const v_295e39 = async (): Promise<void> => {
  try {
    const v_26f42c = v_995f93();
    const v_cdfaaa = v_33aee4();

    const v_ab9b34 = [
      v_dc5d8f('myinfo', false),
      v_dc5d8f('shop', false),
    ];

    for (const v_f36218 of v_ab9b34) {
      try {
        const v_74a79c = v_968eda[v_f36218];
        if (!v_74a79c) {
          console.warn(`[Taboola] 프리로드: ${v_f36218}에 대한 config가 없습니다.`);
          continue;
        }

        const v_d91d98 = v_0433f6(
          v_26f42c,
          v_74a79c.placement,
          v_74a79c.mode,
          v_cdfaaa,
          v_74a79c.pageType,
          v_74a79c.targetType,
        );

        console.log(`[Taboola] 프리로드 완료: ${v_f36218} (HTML 생성됨)`);
      } catch (v_5e9bfe) {
        console.error(`[Taboola] 프리로드 실패 (${v_f36218}):`, v_5e9bfe);
      }
    }

  } catch (v_5e9bfe) {

  }
};
