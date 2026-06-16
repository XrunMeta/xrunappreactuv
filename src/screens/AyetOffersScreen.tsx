import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  StyleSheet,
  ActivityIndicator,
  AppState,
  BackHandler,
  Linking,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Header } from '../components';
import { useAppNavigation } from '../navigation';
import { COMMON_STYLES, COLORS } from '../constants';
import { setAyetUserIdAsync } from '../services/ayet';
import { openIntentUrlOrFallback } from '../utils';

const AYET_AD_SLOT_ID = Platform.OS === 'ios' ? '25755' : '25617';

export const AyetOffersScreen: React.FC = () => {
  const { goBack } = useAppNavigation();
  const insets = useSafeAreaInsets();
  const webViewRef = useRef<WebView>(null);
  const [userId, setUserId] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  const [webViewKey, setWebViewKey] = useState(0);

  const wentExternalRef = useRef(false);

  useEffect(() => {
    (async () => {
      try {
        const resUserData = await AsyncStorage.getItem('userData');
        let memberId = '';
        if (resUserData) {
          const parsed = JSON.parse(resUserData);
          if (parsed?.member != null) memberId = String(parsed.member);
        }
        setUserId(memberId);
        setIsLoading(false);

        if (memberId) {
          setAyetUserIdAsync(memberId).catch((e) => {
            console.warn('[ayeT] setAyetUserIdAsync 실패(백그라운드):', e);
          });
        }
      } catch (e) {
        console.warn('[ayeT] userData 로드 실패:', e);
        setIsLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    if (Platform.OS !== 'android') return;
    const onBackPress = () => {
      if (webViewRef.current) {
        webViewRef.current.goBack();
        return true;
      }
      return false;
    };
    const sub = BackHandler.addEventListener('hardwareBackPress', onBackPress);
    return () => sub.remove();
  }, []);

  useEffect(() => {
    let lastState = AppState.currentState;
    const sub = AppState.addEventListener('change', (next) => {
      if (lastState !== 'active' && next === 'active' && wentExternalRef.current) {
        console.log('[ayeT WebView] 외부앱 복귀 → WebView remount');
        wentExternalRef.current = false;
        setWebViewKey((k) => k + 1);
      }
      lastState = next;
    });
    return () => sub.remove();
  }, []);

  const offerwallUrl = `https://offerwall.ayet.io/offers?adSlot=${AYET_AD_SLOT_ID}&external_identifier=${encodeURIComponent(userId)}`;

  const bottomPadding = insets.bottom;

  if (isLoading) {
    return (
      <View style={[styles.container, { paddingBottom: bottomPadding }]}>
        <Header title="Zone 1" onBackPress={goBack} showBackButton />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingBottom: bottomPadding }]}>
      <Header title="Zone 1" onBackPress={goBack} showBackButton />
      <WebView
        key={webViewKey}
        ref={webViewRef}
        source={{ uri: offerwallUrl }}
        style={styles.webView}
        javaScriptEnabled
        domStorageEnabled
        thirdPartyCookiesEnabled
        sharedCookiesEnabled
        startInLoadingState
        allowsInlineMediaPlayback
        mediaPlaybackRequiresUserAction={false}
        setSupportMultipleWindows={false}
        onLoadStart={() => console.log(`[ayeT WebView] onLoadStart url=${offerwallUrl}`)}
        onLoadEnd={() => console.log('[ayeT WebView] onLoadEnd')}
        onHttpError={(e) => console.warn('[ayeT WebView] HTTP 오류:', e.nativeEvent.statusCode, e.nativeEvent.url)}
        onShouldStartLoadWithRequest={(request) => {
          console.log('[ayeT WebView] 네비게이션 요청:', request.url);
          const { url } = request;

          const externalSchemes = ['itms-apps://', 'itms-appss://', 'tel:', 'sms:', 'mailto:', 'facetime:'];
          if (externalSchemes.some((s) => url.startsWith(s))) {
            wentExternalRef.current = true;
            Linking.openURL(url).catch((e) => console.warn('[ayeT WebView] 외부 URL open 실패:', e));
            return false;
          }
          if (url.startsWith('https://apps.apple.com') || url.startsWith('https://itunes.apple.com')) {
            wentExternalRef.current = true;
            Linking.openURL(url).catch((e) => console.warn('[ayeT WebView] App Store open 실패:', e));
            return false;
          }
          if (url.startsWith('intent://')) {

            wentExternalRef.current = true;
            openIntentUrlOrFallback(url);
            return false;
          }
          if (url.startsWith('market://')) {
            wentExternalRef.current = true;
            Linking.openURL(url).catch((e) => {

              const idMatch = url.match(/[?&]id=([^&#]+)/);
              if (idMatch?.[1]) {
                Linking.openURL('https://play.google.com/store/apps/details?id=' + idMatch[1])
                  .catch((e2) => console.warn('[ayeT WebView] Play Store fallback 실패:', e2));
              } else {
                console.warn('[ayeT WebView] market:// open 실패:', e);
              }
            });
            return false;
          }
          return true;
        }}
        renderLoading={() => (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color={COLORS.primary} />
          </View>
        )}
        onError={(syntheticEvent) => {
          const { nativeEvent } = syntheticEvent;
          console.warn('[ayeT] WebView error:', nativeEvent);
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...COMMON_STYLES.container,
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
