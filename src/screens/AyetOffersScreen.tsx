import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  StyleSheet,
  ActivityIndicator,
  BackHandler,
  Linking,
  Platform,
} from 'react-native';
import { WebView } from 'react-native-webview';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Header } from '../components';
import { useAppNavigation } from '../navigation';
import { COMMON_STYLES, COLORS } from '../constants';
import { setAyetUserIdAsync } from '../services/ayet';

const AYET_AD_SLOT_ID = Platform.OS === 'ios' ? '25755' : '25617';

export const AyetOffersScreen: React.FC = () => {
  const { goBack } = useAppNavigation();
  const webViewRef = useRef<WebView>(null);
  const [userId, setUserId] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const resUserData = await AsyncStorage.getItem('userData');
        let memberId = '';
        if (resUserData) {
          const parsed = JSON.parse(resUserData);
          if (parsed?.member != null) memberId = String(parsed.member);
        }
        setUserId(memberId);

        if (memberId) {
          try {
            await setAyetUserIdAsync(memberId);
          } catch (e) {
            console.warn('[ayeT] setAyetUserIdAsync 실패:', e);
          }
        }
      } catch (e) {
        console.warn('[ayeT] userData 로드 실패:', e);
      }
      setIsLoading(false);
    };
    load();
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

  const offerwallUrl = `https://offerwall.ayet.io/offers?adSlot=${AYET_AD_SLOT_ID}&external_identifier=${encodeURIComponent(userId)}`;

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Header title="Xplay" onBackPress={goBack} showBackButton />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header title="Xplay" onBackPress={goBack} showBackButton />
      <WebView
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
        onShouldStartLoadWithRequest={(request) => {
          const { url } = request;

          const externalSchemes = ['itms-apps://', 'itms-appss://', 'itms-services://', 'tel:', 'sms:', 'mailto:', 'facetime:'];
          if (externalSchemes.some((s) => url.startsWith(s))) {
            Linking.openURL(url).catch((e) => console.warn('[ayeT WebView] 외부 URL open 실패:', e));
            return false;
          }
          if (url.startsWith('https://apps.apple.com') || url.startsWith('https://itunes.apple.com')) {
            Linking.openURL(url).catch((e) => console.warn('[ayeT WebView] App Store open 실패:', e));
            return false;
          }
          if (url.startsWith('market://') || url.startsWith('intent://')) {
            Linking.openURL(url).catch((e) => console.warn('[ayeT WebView] Play Store/Intent open 실패:', e));
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
