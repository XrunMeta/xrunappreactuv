

import { Platform } from 'react-native';
import { getEnvValue } from '../utils/env';

let Taboola: any = null;
try {
  Taboola = require('@taboola/react-native-plugin-4x').Taboola;
} catch (error) {

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

export const TABOOLA_PLACEMENTS: Record<TaboolaPlacement, TaboolaPlacementConfig> = {

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

export const convertPlacementForOS = (placementType: TaboolaPlacement): TaboolaPlacement => {

  if (!placementType.includes('_OS_')) {
    return placementType;
  }

  const osSuffix = Platform.OS === 'android' ? '_aos_' : '_ios_';
  const convertedPlacement = placementType.replace('_OS_', osSuffix) as TaboolaPlacement;

  console.log('[Taboola] 배치 타입 변환:', {
    original: placementType,
    converted: convertedPlacement,
    platform: Platform.OS,
  });

  return convertedPlacement;
};

export const isTaboolaNativeModuleAvailable = (): boolean => {
  return Taboola !== null && typeof Taboola.init === 'function';
};

export const initializeTaboola = async (): Promise<void> => {
  try {

    if (!isTaboolaNativeModuleAvailable()) {
      console.log('[Taboola] 네이티브 모듈이 없습니다. WebView 방식으로 폴백합니다.');
      return;
    }

    const publisherId = getEnvValue('TABOOLA_PUBLISHER_ID_IOS');

    if (!publisherId) {
      console.warn('[Taboola] Publisher ID가 설정되지 않았습니다.');
      return;
    }

    if (Taboola && typeof Taboola.init === 'function') {
      Taboola.init(publisherId);
      console.log('[Taboola] 초기화 완료:', {
        publisherId,
        platform: Platform.OS,
      });
    } else {
      console.log('[Taboola] Taboola 모듈을 사용할 수 없습니다. WebView 방식으로 폴백합니다.');
    }
  } catch (error) {
    console.error('[Taboola] 초기화 실패:', error);
    console.log('[Taboola] WebView 방식으로 폴백합니다.');
  }
};

export const getTaboolaPublisherId = (): string => {

  return getEnvValue('TABOOLA_PUBLISHER_ID_IOS');
};

export const getTaboolaPlacement = (
  basePlacement: 'myinfo' | 'shop' | 'apploading',
  isVignette: boolean = false,
): TaboolaPlacement => {
  const platformSuffix = Platform.OS === 'android' ? '_aos' : '_ios';
  const sizeSuffix = isVignette ? '_vignette' : '_395x80';

  return `${basePlacement}${platformSuffix}${sizeSuffix}` as TaboolaPlacement;
};

export const getTaboolaPageUrl = (): string => {

  const appStoreUrl =
    Platform.OS === 'android'
      ? 'https://play.google.com/store/apps/details?id=com.anonymous.x112102'
      : 'https://apps.apple.com/app/id123456789'; 

  return appStoreUrl;
};

export const generateTaboolaHTML = (
  publisherId: string,
  placement: string,
  mode: string,
  pageUrl: string,
  pageType: string = 'article',
  targetType: string = 'mix',
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
      logToRN('[Taboola WebView] Publisher ID: ' + '${publisherId}');
      logToRN('[Taboola WebView] Placement: ' + '${placement}');
      logToRN('[Taboola WebView] Mode: ' + '${mode}');
      logToRN('[Taboola WebView] Page URL: ' + '${pageUrl}');

      window._taboola = window._taboola || [];

      var taboolaConfig = {
        mode: '${mode}',
        container: 'taboola-container',
        placement: '${placement}',
        target_type: '${targetType}',
        publisher: '${publisherId}',
        page_url: '${pageUrl}',
        page_type: '${pageType}',
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
        'https://cdn.taboola.com/libtrc/${publisherId}/mobile-loader.js',
        'tb-mobile-loader-script');

      function tryMethod2() {
        setTimeout(function() {
          if (!document.getElementById('tb-web-loader-script')) {
            logToRN('[Taboola WebView] 방법 2: 웹 위젯 스크립트 로드 시도');
            var webScript = document.createElement('script');
            webScript.src = 'https://cdn.taboola.com/libtrc/${publisherId}/loader.js';
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

export const preloadTaboolaHTML = async (): Promise<void> => {
  try {
    const publisherId = getTaboolaPublisherId();
    const pageUrl = getTaboolaPageUrl();

    const placementsToPreload: TaboolaPlacement[] = [
      getTaboolaPlacement('myinfo', false),
      getTaboolaPlacement('shop', false),
    ];

    for (const placement of placementsToPreload) {
      try {
        const config = TABOOLA_PLACEMENTS[placement];
        if (!config) {
          console.warn(`[Taboola] 프리로드: ${placement}에 대한 config가 없습니다.`);
          continue;
        }

        const html = generateTaboolaHTML(
          publisherId,
          config.placement,
          config.mode,
          pageUrl,
          config.pageType,
          config.targetType,
        );

        console.log(`[Taboola] 프리로드 완료: ${placement} (HTML 생성됨)`);
      } catch (error) {
        console.error(`[Taboola] 프리로드 실패 (${placement}):`, error);
      }
    }

  } catch (error) {

  }
};
