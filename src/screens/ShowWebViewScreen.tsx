import v_a3453e, { v_5ab095, v_e662ae, v_de06a3 } from 'bapkr';
import {
  v_3094a2,
  v_19b633,
  v_472849,
  v_4623af,
  v_f2c756,
  v_326be8,
  v_aa7413,
} from 'rcmrninabrnb';
import { v_2694e4 } from 'ahewcyoxtiosvtfuluxp';
import { v_b5df25 } from 'ernurodqvmtspux';
import { v_e0068c } from 'vvfgtwbmdpbnvhtfbtbgudicfmpscw';
import { v_700ef9 } from '../context';
import { v_a0daa8, v_ce4741 } from '../navigation';
import { v_4b1173 } from '../context/AlertDialogContext';
import { v_25515d } from 'zvyjokvuouwvifyzks';
import { v_843035 } from '../constants';
import { v_287831 } from './ShowNapAdScreen';
import { v_540580 } from './ShowPockAdScreen';

interface ShowWebViewScreenProps {
  onClose?: () => void; 
  isModal?: boolean; 
}

export const ShowWebViewScreen: v_a3453e.FC<ShowWebViewScreenProps> = ({ onClose: v_0890f8, isModal: v_bf1005 = false }) => {
  const v_033e14 = v_e0068c();
  const { advertisementParams: v_d0b6d4, resetAdvertisementParams: v_e10ff9 } = v_700ef9();
  const { navigate: v_9b57fc, reset: v_487a25, goBack: v_c7ac57 } = v_a0daa8();
  const { showAlert: v_889fad } = v_4b1173();

  const [v_b2dceb, v_e60eaf] = v_5ab095(v_d0b6d4?.urlAD || '');
  const [v_6ced96, v_cb400d] = v_5ab095(v_d0b6d4?.name || '광고');
  const [v_fc9bd6, v_8aeec2] = v_5ab095(false);
  const v_35f830 = v_e662ae<v_2694e4>(null);
  const [v_46b261, v_d35a1d] = v_5ab095(false); 

  const v_7f2e65 = v_de06a3(() => {
    v_e10ff9();
    console.log('handleClose');
    console.log('onClose', v_0890f8);
    if (v_0890f8) {

      v_0890f8();
    } else {

      if (v_487a25) {
        v_487a25(v_ce4741.map);
      } else if (v_9b57fc) {
        v_9b57fc(v_ce4741.map);
      }
    }
  }, [v_0890f8, v_e10ff9, v_487a25, v_9b57fc]);

  const v_d59c80 = v_de06a3(() => {

    if (v_326be8.OS === 'ios') {
      v_d35a1d(true);
    }
  }, []);

  return (
    <View style={v_d81136.container}>
      <StatusBar style="dark" />
      {}
      <View style={[v_d81136.header, { paddingTop: v_033e14.top + (v_326be8.OS === 'ios' ? 20 : 40) }]}>
        {}
        <TouchableOpacity
          onPress={v_7f2e65}
          style={v_d81136.closeButton}
        >
          <Ionicons name="close" size={24} color="#000" />
        </TouchableOpacity>

        {}
        <Text 
          style={v_d81136.title}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {v_6ced96}
        </Text>

        {}
        <TouchableOpacity
          onPress={v_d59c80}
          style={v_d81136.infoButton}
        >
          <Ionicons name="information-circle-outline" size={24} color="#388Dc8" />
        </TouchableOpacity>
      </View>

      {}
      {v_b2dceb && !v_fc9bd6 ? (
        <WebView
          ref={v_35f830}
          key={v_b2dceb}
          source={{ uri: v_b2dceb }}
          style={v_d81136.webView}
          injectedJavaScript={`
            (function() {
              let currentUrl = window.location.href;
              const checkUrl = function() {
                if (window.location.href !== currentUrl) {
                  const newUrl = window.location.href;
                  currentUrl = newUrl;
                  if (newUrl.startsWith('market://')) {
                    try {
                      const idMatch = newUrl.match(/[?&]id=([^&?#]+)/);
                      if (idMatch) {
                        const packageId = idMatch[1];
                        console.log('[injectedJS] window.location market:// 감지, React Native에 알림:', packageId);
                        if (window.ReactNativeWebView && window.ReactNativeWebView.postMessage) {
                          window.ReactNativeWebView.postMessage(JSON.stringify({
                            type: 'marketRedirect',
                            packageId: packageId
                          }));
                        }
                        const playStoreUrl = 'https://play.google.com/store/apps/details?id=' + packageId;
                        window.location.href = playStoreUrl;
                        return;
                      }
                    } catch (error) {
                      console.error('[injectedJS] market:// 변환 실패:', error);
                    }
                  }
                }
              };

              setInterval(checkUrl, 100);

              function convertMarketLinks() {
                const links = document.querySelectorAll('a[href]');
                links.forEach(function(link) {
                  const href = link.getAttribute('href');
                  if (href && href.startsWith('market://')) {
                    try {
                      const idMatch = href.match(/[?&]id=([^&?#]+)/);
                      if (idMatch) {
                        const packageId = idMatch[1];
                        const playStoreUrl = 'https://play.google.com/store/apps/details?id=' + packageId;
                        link.setAttribute('href', playStoreUrl);
                        console.log('[injectedJS] market://를 play.google.com으로 변환:', playStoreUrl);
                      }
                    } catch (error) {
                      console.error('[injectedJS] market:// 변환 실패:', error);
                    }
                  }
                });
              }

              if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', convertMarketLinks);
              } else {
                convertMarketLinks();
              }

              const observer = new MutationObserver(function(mutations) {
                convertMarketLinks();
              });

              observer.observe(document.body, {
                childList: true,
                subtree: true
              });

              document.addEventListener('click', function(e) {
                let target = e.target;
                while (target && target !== document.body) {
                  if (target.tagName === 'A' && target.href) {
                    const url = target.href;
                    if (url.startsWith('market://')) {
                      e.preventDefault();
                      e.stopPropagation();
                      try {
                        const idMatch = url.match(/[?&]id=([^&?#]+)/);
                        if (idMatch) {
                          const packageId = idMatch[1];
                          const playStoreUrl = 'https://play.google.com/store/apps/details?id=' + packageId;
                          console.log('[injectedJS] market:// 클릭 가로채기, 변환:', playStoreUrl);
                          window.location.href = playStoreUrl;
                        }
                      } catch (error) {
                        console.error('[injectedJS] market:// 변환 실패:', error);
                      }
                      return false;
                    } else if (url.startsWith('intent://')) {
                      e.preventDefault();
                      e.stopPropagation();
                      try {
                        const intentIndex = url.indexOf('#Intent');
                        const urlParamStart = url.indexOf('url=');
                        if (urlParamStart !== -1) {
                          const urlValueStart = urlParamStart + 4;
                          const urlValueEnd = intentIndex !== -1 ? intentIndex : url.length;
                          let urlValue = url.substring(urlValueStart, urlValueEnd);
                          const nextParamIndex = urlValue.indexOf('&');
                          if (nextParamIndex !== -1) {
                            urlValue = urlValue.substring(0, nextParamIndex);
                          }
                          if (urlValue) {
                            let decodedUrl = decodeURIComponent(urlValue);
                            if (decodedUrl.includes('%')) {
                              decodedUrl = decodeURIComponent(decodedUrl);
                            }
                            console.log('[injectedJS] intent://에서 url 파라미터 추출:', decodedUrl);
                            if (window.ReactNativeWebView && window.ReactNativeWebView.postMessage) {
                              window.ReactNativeWebView.postMessage(JSON.stringify({
                                type: 'intentUrl',
                                url: decodedUrl
                              }));
                            }
                            return false;
                          }
                        }
                        const idMatch = url.match(/[?&]id=([^&?#]+)/);
                        if (idMatch) {
                          const packageId = idMatch[1];
                          const playStoreUrl = 'https://play.google.com/store/apps/details?id=' + packageId;
                          console.log('[injectedJS] intent://에서 id 추출, Play Store URL:', playStoreUrl);
                          window.location.href = playStoreUrl;
                        }
                      } catch (error) {
                        console.error('[injectedJS] intent:// 변환 실패:', error);
                      }
                      return false;
                    }
                  }
                  target = target.parentElement;
                }
              }, true);
            })();
            true;
          `}
          onMessage={(v_d48baf) => {
            try {
              const v_9390e8 = JSON.parse(v_d48baf.nativeEvent.data);
              if (v_9390e8.type === 'marketRedirect') {
                const v_a1e9b4 = `https://play.google.com/store/apps/details?id=${v_9390e8.packageId}`;
                console.log('[WebView] onMessage에서 market:// 변환:', v_a1e9b4);
                v_e60eaf(v_a1e9b4);
              } else if (v_9390e8.type === 'intentUrl') {
                console.log('[WebView] onMessage에서 intent:// url 파라미터:', v_9390e8.url);
                v_f2c756.openURL(v_9390e8.url).catch((v_49263d) => {
                  console.error('[WebView] intent:// url 파라미터로 열기 실패:', v_49263d);
                });
              }
            } catch (v_5e9bfe) {

            }
          }}
          onNavigationStateChange={(v_b8df7f) => {
            console.log('[WebView] 네비게이션:', v_b8df7f.url);

            if (v_b8df7f.url && v_b8df7f.url.startsWith('market://')) {
              try {
                const v_ae8a0a = v_b8df7f.url.match(/[?&]id=([^&?#]+)/);
                if (v_ae8a0a) {
                  const v_77de37 = v_ae8a0a[1];
                  const v_a1e9b4 = `https://play.google.com/store/apps/details?id=${v_77de37}`;
                  console.log('[WebView] market://를 play.google.com으로 변환 (onNavigationStateChange):', v_a1e9b4);
                  v_e60eaf(v_a1e9b4);
                }
              } catch (v_5e9bfe) {
                console.error('[WebView] market:// 변환 실패:', v_5e9bfe);
              }
            } else if (v_b8df7f.url && v_b8df7f.url.startsWith('intent://')) {
              try {

                const v_d06213 = v_b8df7f.url.indexOf('#Intent');
                const v_7339bb = v_b8df7f.url.indexOf('url=');
                if (v_7339bb !== -1) {
                  const v_9e3b3e = v_7339bb + 4;
                  const v_5dde79 = v_d06213 !== -1 ? v_d06213 : v_b8df7f.url.length;
                  let v_08a4b2 = v_b8df7f.url.substring(v_9e3b3e, v_5dde79);
                  const v_3dfc26 = v_08a4b2.indexOf('&');
                  if (v_3dfc26 !== -1) {
                    v_08a4b2 = v_08a4b2.substring(0, v_3dfc26);
                  }

                  if (v_08a4b2) {
                    let v_6a09e6 = v_08a4b2;
                    try {
                      v_6a09e6 = decodeURIComponent(v_08a4b2);
                      if (v_6a09e6.includes('%')) {
                        v_6a09e6 = decodeURIComponent(v_6a09e6);
                      }
                    } catch (v_9e86fd) {
                      v_6a09e6 = v_08a4b2;
                    }

                    console.log('[WebView] intent://에서 url 파라미터 추출 (onNavigationStateChange):', v_6a09e6);
                    v_f2c756.openURL(v_6a09e6).catch((v_49263d) => {
                      console.error('[WebView] url 파라미터로 열기 실패:', v_49263d);

                      const v_ae8a0a = v_b8df7f.url.match(/[?&]id=([^&?#]+)/);
                      if (v_ae8a0a) {
                        const v_77de37 = v_ae8a0a[1];
                        const v_a1e9b4 = `https://play.google.com/store/apps/details?id=${v_77de37}`;
                        console.log('[WebView] Play Store URL로 폴백:', v_a1e9b4);
                        v_e60eaf(v_a1e9b4);
                      }
                    });
                    return;
                  }
                }

                let v_77de37 = '';
                const v_ae8a0a = v_b8df7f.url.match(/[?&]id=([^&?#]+)/);
                if (v_ae8a0a) {
                  v_77de37 = v_ae8a0a[1];
                } else {
                  const v_d555bc = v_b8df7f.url.match(/package=([^;]+)/);
                  if (v_d555bc) {
                    v_77de37 = v_d555bc[1];
                  }
                }
                if (v_77de37) {
                  const v_a1e9b4 = `https://play.google.com/store/apps/details?id=${v_77de37}`;
                  console.log('[WebView] intent://를 play.google.com으로 변환 (onNavigationStateChange):', v_a1e9b4);
                  v_e60eaf(v_a1e9b4);
                }
              } catch (v_5e9bfe) {
                console.error('[WebView] intent:// 변환 실패:', v_5e9bfe);
              }
            }
          }}
          onShouldStartLoadWithRequest={(v_576f5a) => {
            const { url: v_f71b56 } = v_576f5a;
            console.log('[WebView] 네비게이션 요청:', v_f71b56);

            if (v_f71b56.startsWith('market://')) {
              console.warn('[WebView] market:// 스킴 감지 - 백엔드에서 변환되어야 함:', v_f71b56);
              return false; 
            }

            if (v_f71b56.startsWith('intent://')) {
              console.log('[WebView] intent:// 스킴 감지:', v_f71b56);

              try {

                const v_d06213 = v_f71b56.indexOf('#Intent');
                const v_7339bb = v_f71b56.indexOf('url=');
                if (v_7339bb !== -1) {
                  const v_9e3b3e = v_7339bb + 4;
                  const v_5dde79 = v_d06213 !== -1 ? v_d06213 : v_f71b56.length;
                  let v_08a4b2 = v_f71b56.substring(v_9e3b3e, v_5dde79);
                  const v_3dfc26 = v_08a4b2.indexOf('&');
                  if (v_3dfc26 !== -1) {
                    v_08a4b2 = v_08a4b2.substring(0, v_3dfc26);
                  }

                  if (v_08a4b2) {
                    let v_6a09e6 = v_08a4b2;
                    try {
                      v_6a09e6 = decodeURIComponent(v_08a4b2);
                      if (v_6a09e6.includes('%')) {
                        v_6a09e6 = decodeURIComponent(v_6a09e6);
                      }
                    } catch (v_9e86fd) {
                      v_6a09e6 = v_08a4b2;
                    }

                    console.log('[WebView] intent://에서 url 파라미터 추출:', v_6a09e6);

                    v_f2c756.openURL(v_6a09e6).catch((v_49263d) => {
                      console.error('[WebView] url 파라미터로 열기 실패:', v_49263d);

                      const v_ae8a0a = v_f71b56.match(/[?&]id=([^&?#]+)/);
                      if (v_ae8a0a) {
                        const v_77de37 = v_ae8a0a[1];
                        const v_a1e9b4 = `https://play.google.com/store/apps/details?id=${v_77de37}`;
                        console.log('[WebView] Play Store URL로 폴백:', v_a1e9b4);
                        v_f2c756.openURL(v_a1e9b4).catch((v_033f7e) => {
                          console.error('[WebView] Play Store URL 열기 실패:', v_033f7e);
                        });
                      }
                    });

                    return false;
                  }
                }

                const v_98e017 = v_f71b56.match(/scheme=([^;]+)/);
                const v_e6ce55 = v_f71b56.match(/intent:\/\/([^#]+)/);

                if (v_98e017 && v_e6ce55) {
                  const v_bee33e = v_98e017[1];
                  const v_e11752 = v_e6ce55[1];
                  const v_de56d9 = `${v_bee33e}://${v_e11752}`;

                  console.log('[WebView] intent://를 일반 URL로 변환:', v_de56d9);

                  v_f2c756.openURL(v_de56d9).catch((v_49263d) => {
                    console.error('[WebView] 변환된 URL 열기 실패:', v_49263d);
                    v_f2c756.openURL(v_f71b56).catch((v_8cdda4) => {
                      console.error('[WebView] Intent URL 열기 실패:', v_8cdda4);
                    });
                  });

                  return false;
                }

                const v_d555bc = v_f71b56.match(/package=([^;]+)/);
                if (v_d555bc) {
                  const v_548289 = v_d555bc[1];
                  const v_a1e9b4 = `https://play.google.com/store/apps/details?id=${v_548289}`;
                  console.log('[WebView] package 파라미터로 Play Store URL 생성:', v_a1e9b4);

                  v_f2c756.openURL(v_a1e9b4).catch((v_49263d) => {
                    console.error('[WebView] Play Store URL 열기 실패:', v_49263d);
                    v_f2c756.openURL(v_f71b56).catch((v_8cdda4) => {
                      console.error('[WebView] Intent URL 열기 실패:', v_8cdda4);
                    });
                  });

                  return false;
                }

                console.log('[WebView] intent:// 파싱 실패, 원본 Intent URL로 열기 시도');
                v_f2c756.openURL(v_f71b56).catch((v_49263d) => {
                  console.error('[WebView] Intent URL 열기 실패:', v_49263d);
                });
              } catch (v_5e9bfe) {
                console.error('[WebView] intent:// 처리 중 오류:', v_5e9bfe);
                v_f2c756.openURL(v_f71b56).catch((v_49263d) => {
                  console.error('[WebView] Intent URL 열기 실패:', v_49263d);
                });
              }

              return false; 
            }

            if (v_f71b56.startsWith('whale://')) {
              console.log('[WebView] whale:// 스킴 감지:', v_f71b56);

              try {
                const v_cd73e9 = v_f71b56.match(/url=([^&]+)/);
                if (v_cd73e9) {
                  const v_6a09e6 = decodeURIComponent(v_cd73e9[1]);
                  console.log('[WebView] whale://에서 URL 추출:', v_6a09e6);

                  v_f2c756.openURL(v_6a09e6).catch((v_49263d) => {
                    console.error('[WebView] 추출된 URL 열기 실패:', v_49263d);
                  });
                } else {
                  v_f2c756.openURL(v_f71b56).catch((v_49263d) => {
                    console.error('[WebView] whale:// URL 열기 실패:', v_49263d);
                  });
                }
              } catch (v_5e9bfe) {
                console.error('[WebView] whale:// 처리 중 오류:', v_5e9bfe);
                v_f2c756.openURL(v_f71b56).catch((v_49263d) => {
                  console.error('[WebView] whale:// URL 열기 실패:', v_49263d);
                });
              }

              return false; 
            }

            if (v_f71b56.startsWith('http://') || v_f71b56.startsWith('https://')) {
              return true;
            }

            return false;
          }}
          renderError={(v_d22b54, v_7a5fef, v_49df87) => {
            return <View style={{ flex: 1, backgroundColor: '#fff' }} />;
          }}
          onError={async (v_6f3a9d) => {
            const { nativeEvent: v_76b943 } = v_6f3a9d;
            console.error('WebView 오류:', v_76b943);

            if (v_76b943.code === -10 && v_76b943.url) {
              const v_f71b56 = v_76b943.url;
              console.log('[WebView] ERR_UNKNOWN_URL_SCHEME 감지:', v_f71b56);

              if (v_f71b56.startsWith('intent://')) {
                try {
                  const v_d06213 = v_f71b56.indexOf('#Intent');
                  const v_7339bb = v_f71b56.indexOf('url=');
                  if (v_7339bb !== -1) {
                    const v_9e3b3e = v_7339bb + 4;
                    const v_5dde79 = v_d06213 !== -1 ? v_d06213 : v_f71b56.length;
                    let v_08a4b2 = v_f71b56.substring(v_9e3b3e, v_5dde79);
                    const v_3dfc26 = v_08a4b2.indexOf('&');
                    if (v_3dfc26 !== -1) {
                      v_08a4b2 = v_08a4b2.substring(0, v_3dfc26);
                    }
                    if (v_08a4b2) {
                      let v_6a09e6 = v_08a4b2;
                      try {
                        v_6a09e6 = decodeURIComponent(v_08a4b2);
                        if (v_6a09e6.includes('%')) {
                          v_6a09e6 = decodeURIComponent(v_6a09e6);
                        }
                      } catch (v_9e86fd) {
                        v_6a09e6 = v_08a4b2;
                      }
                      console.log('[WebView] onError에서 intent:// url 파라미터 추출:', v_6a09e6);
                      v_f2c756.openURL(v_6a09e6).catch((v_49263d) => {
                        console.error('[WebView] intent:// url 파라미터로 열기 실패:', v_49263d);
                      });
                      return;
                    }
                  }
                  const v_ae8a0a = v_f71b56.match(/[?&]id=([^&?#]+)/);
                  if (v_ae8a0a) {
                    const v_77de37 = v_ae8a0a[1];
                    const v_a1e9b4 = `https://play.google.com/store/apps/details?id=${v_77de37}`;
                    console.log('[WebView] onError에서 intent:// id 추출, Play Store URL:', v_a1e9b4);
                    v_e60eaf(v_a1e9b4);
                    return;
                  }
                } catch (v_5e9bfe) {
                  console.error('[WebView] onError에서 intent:// 처리 실패:', v_5e9bfe);
                }
              } else if (v_f71b56.startsWith('market://')) {
                try {
                  const v_ae8a0a = v_f71b56.match(/[?&]id=([^&?#]+)/);
                  if (v_ae8a0a) {
                    const v_77de37 = v_ae8a0a[1];
                    const v_a1e9b4 = `https://play.google.com/store/apps/details?id=${v_77de37}`;
                    console.log('[WebView] onError에서 market:// 변환:', v_a1e9b4);
                    v_e60eaf(v_a1e9b4);
                    return;
                  }
                } catch (v_5e9bfe) {
                  console.error('[WebView] onError에서 market:// 처리 실패:', v_5e9bfe);
                }
              }
            }

            v_8aeec2(true);

            if (v_326be8.OS === 'ios' && (v_76b943.code === -1022 || v_76b943.code === -1200)) {
              const v_a4f1b0 = v_76b943.code === -1022 ? 'ATS' : 'TLS';
              console.error(`[WebView] ${v_a4f1b0} 오류 감지 (${v_76b943.code}):`, v_76b943.url || v_b2dceb);

              let v_f71b56 = v_76b943.url || v_b2dceb;

              if (v_f71b56 && v_f71b56.startsWith('http://')) {
                const v_3e273a = v_f71b56.replace('http://', 'https://');
                console.log('[WebView] HTTP를 HTTPS로 변환 시도:', v_3e273a);

                try {
                  v_8aeec2(false);
                  v_e60eaf(v_3e273a);
                  return;
                } catch (v_5e9bfe) {
                  console.error('[WebView] HTTPS 변환 후 재시도 실패:', v_5e9bfe);
                  v_f71b56 = v_3e273a;
                }
              }

              if (v_f71b56) {
                await v_889fad(
                  v_a4f1b0 === 'ATS' ? '보안 연결 오류' : '보안 연결 오류',
                  v_a4f1b0 === 'ATS' 
                    ? '이 페이지는 보안 연결(HTTPS)을 사용하지 않아 로드할 수 없습니다. 외부 브라우저로 열까요?'
                    : '이 페이지는 보안 연결을 사용할 수 없습니다. 외부 브라우저로 열까요?',
                  [
                    {
                      text: '취소',
                      style: 'cancel',
                      onPress: () => {
                        v_7f2e65();
                      },
                    },
                    {
                      text: '외부 브라우저로 열기',
                      onPress: () => {
                        v_f2c756.openURL(v_f71b56).catch((v_49263d) => {
                          console.error('[WebView] 외부 브라우저 열기 실패:', v_49263d);
                        });
                        v_7f2e65();
                      },
                    },
                  ],
                );
              }
            }
          }}
          onHttpError={(v_6f3a9d) => {
            const { nativeEvent: v_76b943 } = v_6f3a9d;
            console.error('WebView HTTP 오류:', v_76b943);
          }}
        />
      ) : null}

      {}
      {v_326be8.OS === 'ios' && (
        <Modal
          visible={v_46b261}
          transparent={true}
          animationType="fade"
          presentationStyle="overFullScreen"
          onRequestClose={() => v_d35a1d(false)}
        >
          <View style={{
            flex: 1,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            justifyContent: 'center',
            alignItems: 'center',
            padding: 20,
          }}>
            <View style={{
              width: '90%',
              maxWidth: 400,
            }}>
            {(() => {
              const v_5a9c46 = v_d0b6d4?.ad_company || 'nas';

              if (v_5a9c46 === 'pock' || v_5a9c46 === 'pointclick' || v_5a9c46 === 'POCK') {
                return (
                  <ShowPockAdScreen
                    onClose={() => v_d35a1d(false)}
                    isModal={true}
                  />
                );
              } else {
                return (
                  <ShowNapAdScreen
                    onClose={() => v_d35a1d(false)}
                    isModal={true}
                  />
                );
              }
            })()}
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

const v_d81136 = v_472849.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    backgroundColor: '#fff',
  },
  closeButton: {
    flex: 2,
    alignItems: 'flex-start',
    justifyContent: 'center',
    marginLeft: 8,
  },
  title: {
    fontSize: 18,
    fontFamily: 'Roboto-Bold',
    color: '#000',
    flex: 8,
    textAlign: 'center',
  },
  infoButton: {
    flex: 2,
    alignItems: 'flex-end',
    justifyContent: 'center',
    marginRight: 8,
  },
  webView: {
    flex: 1,
  },
});

