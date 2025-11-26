import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { WebView } from 'react-native-webview';
import { COLORS, SIZES } from '../constants';
import {
  getTaboolaPlacement,
  getTaboolaPublisherId,
  getTaboolaPageUrl,
  TABOOLA_PLACEMENTS,
  generateTaboolaHTML,
} from '../services/taboola';
import { TaboolaNativeView, isTaboolaNativeViewAvailable } from './TaboolaNativeView';

interface TaboolaBannerProps {

  placementType: 'myinfo' | 'shop';

  pageUrl?: string;

  style?: any;

  containerStyle?: any;
}

export const TaboolaBanner: React.FC<TaboolaBannerProps> = ({
  placementType,
  pageUrl,
  style,
  containerStyle,
}) => {

  const placement = getTaboolaPlacement(placementType, false);
  const config = TABOOLA_PLACEMENTS[placement];
  const finalPageUrl = pageUrl || getTaboolaPageUrl();
  const publisherId = getTaboolaPublisherId();

  console.log('[TaboolaBanner] 렌더링:', {
    placementType,
    placement,
    publisherId,
    finalPageUrl,
    isNativeAvailable: isTaboolaNativeViewAvailable(),
  });

  if (isTaboolaNativeViewAvailable()) {
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

  const htmlContent = generateTaboolaHTML(
    publisherId,
    config.placement,
    config.mode,
    finalPageUrl,
    config.pageType,
    config.targetType,
  );

  return (
    <View style={[styles.container, containerStyle, style]}>
      <WebView
        source={{ html: htmlContent }}
        style={styles.webView}
        scrollEnabled={true}
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
        onLoadStart={() => {
          console.log('[TaboolaBanner] WebView 로드 시작');
        }}
        onLoadEnd={() => {
          console.log('[TaboolaBanner] WebView 로드 완료');
        }}
        onError={(syntheticEvent) => {
          const { nativeEvent } = syntheticEvent;
          console.error('[TaboolaBanner] WebView 오류:', nativeEvent);
        }}
        onMessage={(event) => {
          try {
            const data = JSON.parse(event.nativeEvent.data);
            console.log('[TaboolaBanner] WebView 메시지:', data);
          } catch (e) {
            console.log('[TaboolaBanner] WebView 원시 메시지:', event.nativeEvent.data);
          }
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    minHeight: 80,
    backgroundColor: '#F5F5F5',
    marginVertical: SIZES.small, 
    marginHorizontal: 0, 
  },
  webView: {
    width: '100%',
    minHeight: 80,
    backgroundColor: 'transparent',
  },
});
