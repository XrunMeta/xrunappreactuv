import v_a3453e, { v_c4deb2 } from 'bapkr';
import { v_3094a2, v_472849, v_326be8, v_f2c756 } from 'rcmrninabrnb';
import { v_2694e4 } from 'ahewcyoxtiosvtfuluxp';
import { v_1bfbd0, v_9b1a04 } from '../constants';
import {
  v_995f93,
  v_33aee4,
  v_968eda,
  v_0433f6,
  v_80493f,
} from '../services/taboola';
import { v_c436cb, v_27ace7 } from './TaboolaNativeView';

interface TaboolaBannerCoreProps {

  placementType: v_80493f;

  pageUrl?: string;

  style?: any;

  containerStyle?: any;

  onLoadingChange?: (isLoading: boolean) => void;
}

export const TaboolaBannerCore: v_a3453e.FC<TaboolaBannerCoreProps> = ({
  placementType: v_bb5e8c,
  pageUrl: v_cdfaaa,
  style: v_7fa4e4,
  containerStyle: v_4affe9,
  onLoadingChange: v_c83407,
}) => {

  const v_f36218 = v_bb5e8c;
  const v_74a79c = v_968eda[v_f36218];
  const v_40f839 = v_cdfaaa || v_33aee4();
  const v_26f42c = v_995f93();

  const v_d2b80a = v_27ace7();

  console.log('[TaboolaBannerCore] 렌더링:', {
    placementType: v_bb5e8c,
    placement: v_f36218,
    publisherId: v_26f42c,
    finalPageUrl: v_40f839,
    isNativeAvailable: v_d2b80a,
    configExists: !!v_74a79c,
  });

  if (!v_74a79c) {
    console.error('[TaboolaBannerCore] config가 없습니다:', v_f36218);
    return null;
  }

  if (!v_26f42c || v_26f42c.trim() === '') {
    console.warn('[TaboolaBannerCore] Publisher ID가 없습니다. Taboola 광고를 표시할 수 없습니다.');
    return null;
  }

  v_c4deb2(() => {
    if (v_d2b80a && v_c83407) {

      v_c83407(false);
    }
  }, [v_d2b80a, v_c83407]);

  if (v_d2b80a) {
    return (
      <View style={[v_d81136.container, v_4affe9, v_7fa4e4]}>
        <TaboolaNativeView
          publisherId={v_995f93()}
          placement={v_74a79c.placement}
          mode={v_74a79c.mode}
          pageUrl={v_40f839}
          pageType={v_74a79c.pageType}
          targetType={v_74a79c.targetType}
          style={v_d81136.webView}
        />
      </View>
    );
  }

  let v_6d4549 = v_0433f6(
    v_26f42c,
    v_74a79c.placement,
    v_74a79c.mode,
    v_40f839,
    v_74a79c.pageType,
    v_74a79c.targetType,
  );

  v_6d4549 = v_6d4549.replace(
    /#taboola-container\s*\{[^}]*\}/,
    `#taboola-container {
      width: 100%;
      height: 80px;
      min-height: 80px;
      max-height: 80px;
      overflow: hidden;
    }`
  );

  v_6d4549 = v_6d4549.replace(
    /body\s*\{[^}]*\}/,
    `body {
      margin: 0;
      padding: 0;
      overflow: hidden;
      width: 100%;
      height: 80px;
    }`
  );

  v_6d4549 = v_6d4549.replace(
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

  const v_24913e = `
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
    <View style={[v_d81136.container, v_4affe9, v_7fa4e4]}>
      <WebView
        source={{ html: v_6d4549 }}
        style={v_d81136.webView}
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
        injectedJavaScript={v_24913e}
        onShouldStartLoadWithRequest={(v_576f5a) => {
          const { url: v_f71b56 } = v_576f5a;
          console.log('[TaboolaBannerCore] 네비게이션 요청:', v_f71b56);

          if (v_f71b56 === 'about:blank' || v_f71b56.startsWith('data:')) {
            return true;
          }

          if (v_f71b56.startsWith('http://') || v_f71b56.startsWith('https://')) {
            v_f2c756.openURL(v_f71b56).catch((v_49263d) => {
              console.error('[TaboolaBannerCore] 외부 링크 열기 실패:', v_49263d);
            });
            return false; 
          }

          return false;
        }}
        onNavigationStateChange={(v_b8df7f) => {
          console.log('[TaboolaBannerCore] 네비게이션 상태 변경:', {
            url: v_b8df7f.url,
            loading: v_b8df7f.loading,
            canGoBack: v_b8df7f.canGoBack,
            canGoForward: v_b8df7f.canGoForward,
          });
        }}
        onLoadStart={() => {
          console.log('[TaboolaBannerCore] WebView 로드 시작 - onLoadStart 호출됨');

        }}
        onLoadEnd={() => {
          console.log('[TaboolaBannerCore] WebView 로드 완료 - onLoadEnd 호출됨');

        }}
        onError={(v_6f3a9d) => {
          const { nativeEvent: v_76b943 } = v_6f3a9d;
          console.error('[TaboolaBannerCore] WebView 오류:', v_76b943);

          if (v_c83407) {
            v_c83407(false);
          }
        }}
        onMessage={(v_d48baf) => {
          try {
            const v_9390e8 = JSON.parse(v_d48baf.nativeEvent.data);
            console.log('[TaboolaBannerCore] WebView 메시지:', v_9390e8);

            if (v_9390e8 && v_9390e8.type === 'linkClick' && v_9390e8.url) {
              console.log('[TaboolaBannerCore] 링크 클릭 감지:', v_9390e8.url);
              v_f2c756.openURL(v_9390e8.url).catch((v_49263d) => {
                console.error('[TaboolaBannerCore] 외부 링크 열기 실패:', v_49263d);
              });
              return;
            }

            if (v_9390e8 && v_9390e8.message && typeof v_9390e8.message === 'string') {
              const v_a8cd21 = v_9390e8.message;
              if (v_a8cd21.includes('콘텐츠 감지됨')) {
                try {

                  const v_6e21ec = v_a8cd21.match(/콘텐츠 감지됨:\s*({.*})/);
                  if (v_6e21ec) {
                    const v_8469e9 = JSON.parse(v_6e21ec[1]);

                    if (v_8469e9 && (v_8469e9.hasTaboolaElements === true || (v_8469e9.innerHTMLLength && v_8469e9.innerHTMLLength > 50))) {
                      console.log('[TaboolaBannerCore] Taboola 광고 콘텐츠 감지됨 - 로딩 완료 처리', v_8469e9);
                      if (v_c83407) {
                        v_c83407(false);
                      }
                    } else {
                      console.log('[TaboolaBannerCore] 콘텐츠는 있지만 Taboola 요소 없음, 대기 중...', v_8469e9);
                    }
                  } else {

                    console.log('[TaboolaBannerCore] 콘텐츠 감지됨 - 로딩 완료 처리 (JSON 파싱 실패)');
                    if (v_c83407) {
                      v_c83407(false);
                    }
                  }
                } catch (v_9e86fd) {

                  console.log('[TaboolaBannerCore] 콘텐츠 감지됨 - 로딩 완료 처리 (파싱 에러)', v_9e86fd);
                  if (v_c83407) {
                    v_c83407(false);
                  }
                }
              }
            }
          } catch (v_9e86fd) {
            console.log('[TaboolaBannerCore] WebView 원시 메시지:', v_d48baf.nativeEvent.data);
          }
        }}
      />
    </View>
  );
};

const v_d81136 = v_472849.create({
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

