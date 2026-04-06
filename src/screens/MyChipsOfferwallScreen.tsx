import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  StyleSheet,
  ActivityIndicator,
  BackHandler,
  Platform,
} from 'react-native';
import { WebView } from 'react-native-webview';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Header } from '../components';
import { useAppNavigation } from '../navigation';
import { COMMON_STYLES, COLORS } from '../constants';

const MYCHIPS_CONTENT_ID = Platform.OS === 'ios'
  ? 'fe775420-0581-4fe7-b732-85d4ef03c367'
  : '93a7b6fa-d336-41d9-a653-cd657802faf2';

export const MyChipsOfferwallScreen = () => {
  const { goBack } = useAppNavigation();
  const webViewRef = useRef<WebView>(null);
  const [userId, setUserId] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const resUserData = await AsyncStorage.getItem('userData');
        if (resUserData) {
          const parsed = JSON.parse(resUserData);
          if (parsed.member) {
            setUserId(String(parsed.member));
          }
        }
      } catch (e) {
        console.warn('[MyChips] userData 로드 실패:', e);
      }
      setIsLoading(false);
    };
    loadUserData();
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

    const subscription = BackHandler.addEventListener(
      'hardwareBackPress',
      onBackPress,
    );
    return () => subscription.remove();
  }, []);

  const offerwallUrl = `https://sdk.mychips.io/content?content_id=${MYCHIPS_CONTENT_ID}&user_id=${userId}&gender=&age=`;

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
        startInLoadingState
        allowsInlineMediaPlayback
        mediaPlaybackRequiresUserAction={false}
        renderLoading={() => (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color={COLORS.primary} />
          </View>
        )}
        onError={(syntheticEvent) => {
          const { nativeEvent } = syntheticEvent;
          console.warn('[MyChips] WebView error:', nativeEvent);
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
