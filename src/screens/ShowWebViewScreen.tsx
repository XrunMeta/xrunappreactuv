import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
  Platform,
  Modal,
  BackHandler,
} from 'react-native';
import { WebView } from 'react-native-webview';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppContext } from '../context';
import { useAppNavigation, ROUTES } from '../navigation';
import { useAlertDialog } from '../context/AlertDialogContext';
import { Ionicons } from '@expo/vector-icons';
import { FONTS } from '../constants';
import { ShowNapAdScreen } from './ShowNapAdScreen';
import { ShowPockAdScreen } from './ShowPockAdScreen';

interface ShowWebViewScreenProps {
  onClose?: () => void; 
  isModal?: boolean; 
}

export const ShowWebViewScreen: React.FC<ShowWebViewScreenProps> = ({ onClose, isModal = false }) => {
  const insets = useSafeAreaInsets();
  const { advertisementParams, resetAdvertisementParams } = useAppContext();
  const { navigate, reset, goBack } = useAppNavigation();
  const { showAlert } = useAlertDialog();

  const [webViewUrl, setWebViewUrl] = useState('');
  const [webViewTitle, setWebViewTitle] = useState(advertisementParams?.name || '광고');
  const [webViewError, setWebViewError] = useState(false);
  const [canGoBack, setCanGoBack] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const webViewRef = useRef<WebView>(null);
  const [showAdDetailModal, setShowAdDetailModal] = useState(false); 

  useEffect(() => {
    const resolveUrl = async () => {
      const rawUrl = advertisementParams?.urlAD || '';
      if (!rawUrl) {
        setIsLoading(false);
        return;
      }
      try {
        const resp = await fetch(rawUrl, { method: 'GET' });
        const contentType = resp.headers.get('content-type') || '';
        if (contentType.includes('application/json')) {
          const json = await resp.json();
          if (json.lurl) {
            console.log('[ShowWebView] JSON lurl 추출:', json.lurl);
            setWebViewUrl(json.lurl);
          } else {
            setWebViewUrl(rawUrl);
          }
        } else {
          setWebViewUrl(rawUrl);
        }
      } catch {

        setWebViewUrl(rawUrl);
      }
      setIsLoading(false);
    };
    resolveUrl();
  }, [advertisementParams?.urlAD]);

  const handleClose = useCallback(() => {
    resetAdvertisementParams();
    console.log('handleClose');
    console.log('onClose', onClose);
    if (onClose) {

      onClose();
    } else {

      if (reset) {
        reset(ROUTES.map);
      } else if (navigate) {
        navigate(ROUTES.map);
      }
    }
  }, [onClose, resetAdvertisementParams, reset, navigate]);

  const handleGoBack = useCallback(() => {
    if (canGoBack && webViewRef.current) {
      webViewRef.current.goBack();
    } else {
      handleClose();
    }
  }, [canGoBack, handleClose]);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      if (canGoBack && webViewRef.current) {
        webViewRef.current.goBack();
        return true;
      }
      handleClose();
      return true;
    });
    return () => backHandler.remove();
  }, [canGoBack, handleClose]);

  const handleInfoIconPress = useCallback(() => {
    console.log('[ShowWebView] i 아이콘 클릭됨', {
      platform: Platform.OS,
      hasAdParams: !!advertisementParams,
      adCompany: advertisementParams?.ad_company,
    });
    setShowAdDetailModal(true);
  }, [advertisementParams]);

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      {}
      <View style={[styles.header, { paddingTop: insets.top + (Platform.OS === 'ios' ? 20 : 40) }]}>
        {}
        <View style={styles.leftButtons}>
          <TouchableOpacity
            onPress={handleGoBack}
            style={styles.backButton}
          >
            <Ionicons name="chevron-back" size={24} color="#000" />
          </TouchableOpacity>
        </View>

        {}
        <Text
          style={styles.title}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {webViewTitle}
        </Text>

        {}
        <TouchableOpacity
          onPress={handleInfoIconPress}
          style={styles.infoButton}
        >
          <Ionicons name="information-circle-outline" size={24} color="#388Dc8" />
        </TouchableOpacity>
      </View>

      {}
      {isLoading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ color: '#888' }}>로딩 중...</Text>
        </View>
      ) : webViewUrl && !webViewError ? (
        <WebView
          ref={webViewRef}
          key={webViewUrl}
          source={{ uri: webViewUrl }}
          style={styles.webView}
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
          onMessage={(event) => {
            try {
              const data = JSON.parse(event.nativeEvent.data);
              if (data.type === 'marketRedirect') {
                const playStoreUrl = `https://play.google.com/store/apps/details?id=${data.packageId}`;
                console.log('[WebView] onMessage에서 market:// 변환:', playStoreUrl);
                setWebViewUrl(playStoreUrl);
              } else if (data.type === 'intentUrl') {
                console.log('[WebView] onMessage에서 intent:// url 파라미터:', data.url);
                Linking.openURL(data.url).catch((err) => {
                  console.error('[WebView] intent:// url 파라미터로 열기 실패:', err);
                });
              }
            } catch (error) {

            }
          }}
          onNavigationStateChange={(navState) => {
            console.log('[WebView] 네비게이션:', navState.url);
            setCanGoBack(navState.canGoBack);

            if (navState.url && navState.url.startsWith('market://')) {
              try {
                const idMatch = navState.url.match(/[?&]id=([^&?#]+)/);
                if (idMatch) {
                  const packageId = idMatch[1];
                  const playStoreUrl = `https://play.google.com/store/apps/details?id=${packageId}`;
                  console.log('[WebView] market://를 play.google.com으로 변환 (onNavigationStateChange):', playStoreUrl);
                  setWebViewUrl(playStoreUrl);
                }
              } catch (error) {
                console.error('[WebView] market:// 변환 실패:', error);
              }
            } else if (navState.url && navState.url.startsWith('intent://')) {
              try {

                const intentIndex = navState.url.indexOf('#Intent');
                const urlParamStart = navState.url.indexOf('url=');
                if (urlParamStart !== -1) {
                  const urlValueStart = urlParamStart + 4;
                  const urlValueEnd = intentIndex !== -1 ? intentIndex : navState.url.length;
                  let urlValue = navState.url.substring(urlValueStart, urlValueEnd);
                  const nextParamIndex = urlValue.indexOf('&');
                  if (nextParamIndex !== -1) {
                    urlValue = urlValue.substring(0, nextParamIndex);
                  }

                  if (urlValue) {
                    let decodedUrl = urlValue;
                    try {
                      decodedUrl = decodeURIComponent(urlValue);
                      if (decodedUrl.includes('%')) {
                        decodedUrl = decodeURIComponent(decodedUrl);
                      }
                    } catch (e) {
                      decodedUrl = urlValue;
                    }

                    console.log('[WebView] intent://에서 url 파라미터 추출 (onNavigationStateChange):', decodedUrl);
                    Linking.openURL(decodedUrl).catch((err) => {
                      console.error('[WebView] url 파라미터로 열기 실패:', err);

                      const idMatch = navState.url.match(/[?&]id=([^&?#]+)/);
                      if (idMatch) {
                        const packageId = idMatch[1];
                        const playStoreUrl = `https://play.google.com/store/apps/details?id=${packageId}`;
                        console.log('[WebView] Play Store URL로 폴백:', playStoreUrl);
                        setWebViewUrl(playStoreUrl);
                      }
                    });
                    return;
                  }
                }

                let packageId = '';
                const idMatch = navState.url.match(/[?&]id=([^&?#]+)/);
                if (idMatch) {
                  packageId = idMatch[1];
                } else {
                  const packageMatch = navState.url.match(/package=([^;]+)/);
                  if (packageMatch) {
                    packageId = packageMatch[1];
                  }
                }
                if (packageId) {
                  const playStoreUrl = `https://play.google.com/store/apps/details?id=${packageId}`;
                  console.log('[WebView] intent://를 play.google.com으로 변환 (onNavigationStateChange):', playStoreUrl);
                  setWebViewUrl(playStoreUrl);
                }
              } catch (error) {
                console.error('[WebView] intent:// 변환 실패:', error);
              }
            }
          }}
          onShouldStartLoadWithRequest={(request) => {
            const { url } = request;
            console.log('[WebView] 네비게이션 요청:', url);

            if (url.startsWith('market://')) {
              console.warn('[WebView] market:// 스킴 감지 - 백엔드에서 변환되어야 함:', url);
              return false; 
            }

            if (url.startsWith('intent://')) {
              console.log('[WebView] intent:// 스킴 감지:', url);

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
                    let decodedUrl = urlValue;
                    try {
                      decodedUrl = decodeURIComponent(urlValue);
                      if (decodedUrl.includes('%')) {
                        decodedUrl = decodeURIComponent(decodedUrl);
                      }
                    } catch (e) {
                      decodedUrl = urlValue;
                    }

                    console.log('[WebView] intent://에서 url 파라미터 추출:', decodedUrl);

                    Linking.openURL(decodedUrl).catch((err) => {
                      console.error('[WebView] url 파라미터로 열기 실패:', err);

                      const idMatch = url.match(/[?&]id=([^&?#]+)/);
                      if (idMatch) {
                        const packageId = idMatch[1];
                        const playStoreUrl = `https://play.google.com/store/apps/details?id=${packageId}`;
                        console.log('[WebView] Play Store URL로 폴백:', playStoreUrl);
                        Linking.openURL(playStoreUrl).catch((playStoreErr) => {
                          console.error('[WebView] Play Store URL 열기 실패:', playStoreErr);
                        });
                      }
                    });

                    return false;
                  }
                }

                const schemeMatch = url.match(/scheme=([^;]+)/);
                const hostMatch = url.match(/intent:\/\/([^#]+)/);

                if (schemeMatch && hostMatch) {
                  const scheme = schemeMatch[1];
                  const host = hostMatch[1];
                  const convertedUrl = `${scheme}://${host}`;

                  console.log('[WebView] intent://를 일반 URL로 변환:', convertedUrl);

                  Linking.openURL(convertedUrl).catch((err) => {
                    console.error('[WebView] 변환된 URL 열기 실패:', err);
                    Linking.openURL(url).catch((intentErr) => {
                      console.error('[WebView] Intent URL 열기 실패:', intentErr);
                    });
                  });

                  return false;
                }

                const packageMatch = url.match(/package=([^;]+)/);
                if (packageMatch) {
                  const packageName = packageMatch[1];
                  const playStoreUrl = `https://play.google.com/store/apps/details?id=${packageName}`;
                  console.log('[WebView] package 파라미터로 Play Store URL 생성:', playStoreUrl);

                  Linking.openURL(playStoreUrl).catch((err) => {
                    console.error('[WebView] Play Store URL 열기 실패:', err);
                    Linking.openURL(url).catch((intentErr) => {
                      console.error('[WebView] Intent URL 열기 실패:', intentErr);
                    });
                  });

                  return false;
                }

                console.log('[WebView] intent:// 파싱 실패, 원본 Intent URL로 열기 시도');
                Linking.openURL(url).catch((err) => {
                  console.error('[WebView] Intent URL 열기 실패:', err);
                });
              } catch (error) {
                console.error('[WebView] intent:// 처리 중 오류:', error);
                Linking.openURL(url).catch((err) => {
                  console.error('[WebView] Intent URL 열기 실패:', err);
                });
              }

              return false; 
            }

            if (url.startsWith('whale://')) {
              console.log('[WebView] whale:// 스킴 감지:', url);

              try {
                const urlMatch = url.match(/url=([^&]+)/);
                if (urlMatch) {
                  const decodedUrl = decodeURIComponent(urlMatch[1]);
                  console.log('[WebView] whale://에서 URL 추출:', decodedUrl);

                  Linking.openURL(decodedUrl).catch((err) => {
                    console.error('[WebView] 추출된 URL 열기 실패:', err);
                  });
                } else {
                  Linking.openURL(url).catch((err) => {
                    console.error('[WebView] whale:// URL 열기 실패:', err);
                  });
                }
              } catch (error) {
                console.error('[WebView] whale:// 처리 중 오류:', error);
                Linking.openURL(url).catch((err) => {
                  console.error('[WebView] whale:// URL 열기 실패:', err);
                });
              }

              return false; 
            }

            if (url.startsWith('http://') || url.startsWith('https://')) {
              return true;
            }

            return false;
          }}
          renderError={(errorDomain, errorCode, errorDesc) => {
            return <View style={{ flex: 1, backgroundColor: '#fff' }} />;
          }}
          onError={async (syntheticEvent) => {
            const { nativeEvent } = syntheticEvent;
            console.error('WebView 오류:', nativeEvent);

            if (nativeEvent.code === -10 && nativeEvent.url) {
              const url = nativeEvent.url;
              console.log('[WebView] ERR_UNKNOWN_URL_SCHEME 감지:', url);

              if (url.startsWith('intent://')) {
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
                      let decodedUrl = urlValue;
                      try {
                        decodedUrl = decodeURIComponent(urlValue);
                        if (decodedUrl.includes('%')) {
                          decodedUrl = decodeURIComponent(decodedUrl);
                        }
                      } catch (e) {
                        decodedUrl = urlValue;
                      }
                      console.log('[WebView] onError에서 intent:// url 파라미터 추출:', decodedUrl);
                      Linking.openURL(decodedUrl).catch((err) => {
                        console.error('[WebView] intent:// url 파라미터로 열기 실패:', err);
                      });
                      return;
                    }
                  }
                  const idMatch = url.match(/[?&]id=([^&?#]+)/);
                  if (idMatch) {
                    const packageId = idMatch[1];
                    const playStoreUrl = `https://play.google.com/store/apps/details?id=${packageId}`;
                    console.log('[WebView] onError에서 intent:// id 추출, Play Store URL:', playStoreUrl);
                    setWebViewUrl(playStoreUrl);
                    return;
                  }
                } catch (error) {
                  console.error('[WebView] onError에서 intent:// 처리 실패:', error);
                }
              } else if (url.startsWith('market://')) {
                try {
                  const idMatch = url.match(/[?&]id=([^&?#]+)/);
                  if (idMatch) {
                    const packageId = idMatch[1];
                    const playStoreUrl = `https://play.google.com/store/apps/details?id=${packageId}`;
                    console.log('[WebView] onError에서 market:// 변환:', playStoreUrl);
                    setWebViewUrl(playStoreUrl);
                    return;
                  }
                } catch (error) {
                  console.error('[WebView] onError에서 market:// 처리 실패:', error);
                }
              }
            }

            setWebViewError(true);

            if (Platform.OS === 'ios' && (nativeEvent.code === -1022 || nativeEvent.code === -1200)) {
              const errorType = nativeEvent.code === -1022 ? 'ATS' : 'TLS';
              console.error(`[WebView] ${errorType} 오류 감지 (${nativeEvent.code}):`, nativeEvent.url || webViewUrl);

              let url = nativeEvent.url || webViewUrl;

              if (url && url.startsWith('http://')) {
                const httpsUrl = url.replace('http://', 'https://');
                console.log('[WebView] HTTP를 HTTPS로 변환 시도:', httpsUrl);

                try {
                  setWebViewError(false);
                  setWebViewUrl(httpsUrl);
                  return;
                } catch (error) {
                  console.error('[WebView] HTTPS 변환 후 재시도 실패:', error);
                  url = httpsUrl;
                }
              }

              if (url) {
                await showAlert(
                  errorType === 'ATS' ? '보안 연결 오류' : '보안 연결 오류',
                  errorType === 'ATS' 
                    ? '이 페이지는 보안 연결(HTTPS)을 사용하지 않아 로드할 수 없습니다. 외부 브라우저로 열까요?'
                    : '이 페이지는 보안 연결을 사용할 수 없습니다. 외부 브라우저로 열까요?',
                  [
                    {
                      text: '취소',
                      style: 'cancel',
                      onPress: () => {
                        handleClose();
                      },
                    },
                    {
                      text: '외부 브라우저로 열기',
                      onPress: () => {
                        Linking.openURL(url).catch((err) => {
                          console.error('[WebView] 외부 브라우저 열기 실패:', err);
                        });
                        handleClose();
                      },
                    },
                  ],
                );
              }
            }
          }}
          onHttpError={(syntheticEvent) => {
            const { nativeEvent } = syntheticEvent;
            console.error('WebView HTTP 오류:', nativeEvent);
          }}
        />
      ) : null}

      {}
      {true && (
        <Modal
          visible={showAdDetailModal}
          transparent={true}
          animationType="fade"
          presentationStyle="overFullScreen"
          onRequestClose={() => setShowAdDetailModal(false)}
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
              const adCompany = advertisementParams?.ad_company || 'nas';

              if (adCompany === 'pock' || adCompany === 'pointclick' || adCompany === 'POCK') {
                return (
                  <ShowPockAdScreen
                    onClose={() => setShowAdDetailModal(false)}
                    isModal={true}
                  />
                );
              } else {
                return (
                  <ShowNapAdScreen
                    onClose={() => setShowAdDetailModal(false)}
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

const styles = StyleSheet.create({
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
  leftButtons: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    padding: 4,
  },
  closeButton: {
    padding: 4,
    marginLeft: 4,
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

