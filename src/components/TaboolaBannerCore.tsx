import React, { useEffect } from 'react';
import { View, StyleSheet, Platform, Linking } from 'react-native';
import { WebView } from 'react-native-webview';
import { COLORS, SIZES } from '../constants';
import {
  getTaboolaPublisherId,
  getTaboolaPageUrl,
  TABOOLA_PLACEMENTS,
  generateTaboolaHTML,
  TaboolaPlacement,
} from '../services/taboola';
import { TaboolaNativeView, isTaboolaNativeViewAvailable } from './TaboolaNativeView';

interface TaboolaBannerCoreProps {

  placementType: TaboolaPlacement;

  pageUrl?: string;

  style?: any;

  containerStyle?: any;

  onLoadingChange?: (isLoading: boolean) => void;
}

export const TaboolaBannerCore: React.FC<TaboolaBannerCoreProps> = ({
  placementType,
  pageUrl,
  style,
  containerStyle,
  onLoadingChange,
}) => {

  const placement = placementType;
  const config = TABOOLA_PLACEMENTS[placement];
  const finalPageUrl = pageUrl || getTaboolaPageUrl();
  const publisherId = getTaboolaPublisherId();

  const isNativeAvailable = isTaboolaNativeViewAvailable();

  console.log('[TaboolaBannerCore] 렌더링:', {
    placementType,
    placement,
    publisherId,
    finalPageUrl,
    isNativeAvailable,
    configExists: !!config,
  });

  if (!config) {
    console.error('[TaboolaBannerCore] config가 없습니다:', placement);
    return null;
  }

  useEffect(() => {
    if (isNativeAvailable && onLoadingChange) {

      onLoadingChange(false);
    }
  }, [isNativeAvailable, onLoadingChange]);

  if (isNativeAvailable) {
    return (
      <View style={[styles.container, containerStyle, style]}>
        <TaboolaNativeView
          publisherId={getTaboolaPublisherId()}
          placement={config.placement}
          mode={config.mode}
          pageUrl={finalPageUrl}
          pageType={config.pageType}
          targetType={config.targetType}
          style={styles.webView}
        />
      </View>
    );
  }

  let htmlContent = generateTaboolaHTML(
    publisherId,
    config.placement,
    config.mode,
    finalPageUrl,
    config.pageType,
    config.targetType,
  );

  htmlContent = htmlContent.replace(
    /#taboola-container\s*\{[^}]*\}/,
    `#taboola-container {
      width: 100%;
      height: 80px;
      min-height: 80px;
      max-height: 80px;
      overflow: hidden;
    }`
  );

  htmlContent = htmlContent.replace(
    /body\s*\{[^}]*\}/,
    `body {
      margin: 0;
      padding: 0;
      overflow: hidden;
      width: 100%;
      height: 80px;
    }`
  );

  htmlContent = htmlContent.replace(
    /<style>/,
    `<style>
    html {
      margin: 0;
      padding: 0;
      overflow: hidden;
      width: 100%;
      height: 80px;
    }`
  );

  const injectedJavaScript = `
    (function() {
      function interceptLinkClicks() {
        document.addEventListener('click', function(e) {
          var target = e.target;

          while (target && target !== document.body) {
            if (target.tagName === 'A' && target.href) {
              var url = target.href;

              if (url.startsWith('http://') || url.startsWith('https://')) {
                e.preventDefault();
                e.stopPropagation();

                if (window.ReactNativeWebView && window.ReactNativeWebView.postMessage) {
                  window.ReactNativeWebView.postMessage(JSON.stringify({
                    type: 'linkClick',
                    url: url
                  }));
                }

                return false;
              }
            }

            if (target.onclick || target.getAttribute('onclick')) {
              var linkUrl = target.href || target.getAttribute('href') || target.getAttribute('data-url');
              if (linkUrl && (linkUrl.startsWith('http://') || linkUrl.startsWith('https://'))) {
                e.preventDefault();
                e.stopPropagation();

                if (window.ReactNativeWebView && window.ReactNativeWebView.postMessage) {
                  window.ReactNativeWebView.postMessage(JSON.stringify({
                    type: 'linkClick',
                    url: linkUrl
                  }));
                }

                return false;
              }
            }

            target = target.parentElement;
          }
        }, true); // capture phase에서 이벤트 가로채기

        var observer = new MutationObserver(function(mutations) {
          mutations.forEach(function(mutation) {
            mutation.addedNodes.forEach(function(node) {
              if (node.nodeType === 1) { // Element node
                var links = node.querySelectorAll ? node.querySelectorAll('a[href]') : [];
                links.forEach(function(link) {
                  if (link.href && (link.href.startsWith('http://') || link.href.startsWith('https://'))) {
                    link.addEventListener('click', function(e) {
                      e.preventDefault();
                      e.stopPropagation();

                      if (window.ReactNativeWebView && window.ReactNativeWebView.postMessage) {
                        window.ReactNativeWebView.postMessage(JSON.stringify({
                          type: 'linkClick',
                          url: link.href
                        }));
                      }

                      return false;
                    }, true);
                  }
                });
              }
            });
          });
        });

        var container = document.getElementById('taboola-container');
        if (container) {
          observer.observe(container, {
            childList: true,
            subtree: true
          });
        }
      }

      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', interceptLinkClicks);
      } else {
        interceptLinkClicks();
      }

      setTimeout(interceptLinkClicks, 1000);
      setTimeout(interceptLinkClicks, 3000);
    })();
    true; // injected JavaScript는 반드시 true를 반환해야 함
  `;

  return (
    <View style={[styles.container, containerStyle, style]}>
      <WebView
        source={{ html: htmlContent }}
        style={styles.webView}
        scrollEnabled={false}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        startInLoadingState={false}
        backgroundColor="#ffffff"
        allowsInlineMediaPlayback={true}
        mediaPlaybackRequiresUserAction={false}
        mixedContentMode="always"
        originWhitelist={['*']}
        thirdPartyCookiesEnabled={true}
        sharedCookiesEnabled={true}
        userAgent="Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1"
        injectedJavaScript={injectedJavaScript}
        onShouldStartLoadWithRequest={(request) => {
          const { url } = request;
          console.log('[TaboolaBannerCore] 네비게이션 요청:', url);

          if (url === 'about:blank' || url.startsWith('data:')) {
            return true;
          }

          if (url.startsWith('http://') || url.startsWith('https://')) {
            Linking.openURL(url).catch((err) => {
              console.error('[TaboolaBannerCore] 외부 링크 열기 실패:', err);
            });
            return false; 
          }

          return false;
        }}
        onNavigationStateChange={(navState) => {
          console.log('[TaboolaBannerCore] 네비게이션 상태 변경:', {
            url: navState.url,
            loading: navState.loading,
            canGoBack: navState.canGoBack,
            canGoForward: navState.canGoForward,
          });
        }}
        onLoadStart={() => {
          console.log('[TaboolaBannerCore] WebView 로드 시작 - onLoadStart 호출됨');

        }}
        onLoadEnd={() => {
          console.log('[TaboolaBannerCore] WebView 로드 완료 - onLoadEnd 호출됨');

        }}
        onError={(syntheticEvent) => {
          const { nativeEvent } = syntheticEvent;
          console.error('[TaboolaBannerCore] WebView 오류:', nativeEvent);

          if (onLoadingChange) {
            onLoadingChange(false);
          }
        }}
        onMessage={(event) => {
          try {
            const data = JSON.parse(event.nativeEvent.data);
            console.log('[TaboolaBannerCore] WebView 메시지:', data);

            if (data && data.type === 'linkClick' && data.url) {
              console.log('[TaboolaBannerCore] 링크 클릭 감지:', data.url);
              Linking.openURL(data.url).catch((err) => {
                console.error('[TaboolaBannerCore] 외부 링크 열기 실패:', err);
              });
              return;
            }

            if (data && data.message && typeof data.message === 'string') {
              const message = data.message;
              if (message.includes('콘텐츠 감지됨')) {
                try {

                  const jsonMatch = message.match(/콘텐츠 감지됨:\s*({.*})/);
                  if (jsonMatch) {
                    const contentData = JSON.parse(jsonMatch[1]);

                    if (contentData && (contentData.hasTaboolaElements === true || (contentData.innerHTMLLength && contentData.innerHTMLLength > 50))) {
                      console.log('[TaboolaBannerCore] Taboola 광고 콘텐츠 감지됨 - 로딩 완료 처리', contentData);
                      if (onLoadingChange) {
                        onLoadingChange(false);
                      }
                    } else {
                      console.log('[TaboolaBannerCore] 콘텐츠는 있지만 Taboola 요소 없음, 대기 중...', contentData);
                    }
                  } else {

                    console.log('[TaboolaBannerCore] 콘텐츠 감지됨 - 로딩 완료 처리 (JSON 파싱 실패)');
                    if (onLoadingChange) {
                      onLoadingChange(false);
                    }
                  }
                } catch (e) {

                  console.log('[TaboolaBannerCore] 콘텐츠 감지됨 - 로딩 완료 처리 (파싱 에러)', e);
                  if (onLoadingChange) {
                    onLoadingChange(false);
                  }
                }
              }
            }
          } catch (e) {
            console.log('[TaboolaBannerCore] WebView 원시 메시지:', event.nativeEvent.data);
          }
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 80,
    marginHorizontal: 0, 
  },
  webView: {
    width: '100%',
    height: 80,
    backgroundColor: '#ffffff',
  },
});

