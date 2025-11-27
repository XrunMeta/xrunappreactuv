import React, { useEffect } from 'react';
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

interface TaboolaBannerCoreProps {

  placementType: 'myinfo' | 'shop';

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

  const placement = getTaboolaPlacement(placementType, false);
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
  });

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
          console.log('[TaboolaBannerCore] WebView 로드 시작 - onLoadStart 호출됨');

          if (onLoadingChange) {
            console.log('[TaboolaBannerCore] onLoadingChange(false) 호출');
            onLoadingChange(false);
          } else {
            console.log('[TaboolaBannerCore] onLoadingChange가 없습니다');
          }
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

            if (data && data.message && typeof data.message === 'string') {
              const message = data.message;
              if (message.includes('콘텐츠 감지됨')) {
                console.log('[TaboolaBannerCore] 콘텐츠 감지됨 - 로딩 완료 처리');
                if (onLoadingChange) {
                  onLoadingChange(false);
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

