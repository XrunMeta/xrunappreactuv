import React, { useEffect } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
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
    minHeight: 80,
    backgroundColor: 'transparent', 
    marginVertical: SIZES.small, 
    marginHorizontal: 0, 
  },
  webView: {
    width: '100%',
    minHeight: 80,
    backgroundColor: 'transparent',
  },
});

