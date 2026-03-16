

import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { BannerAd, BannerAdSize, TestIds } from 'react-native-google-mobile-ads';
import { getAdMobAdUnitId, isAdMobReady } from '../services/admob';
import { COLORS } from '../constants';

interface AdMobBannerProps {
  adUnitId?: string;
  size?: BannerAdSize;
  containerStyle?: ViewStyle;
  onAdLoaded?: () => void;
  onAdFailedToLoad?: (error: Error) => void;
  testMode?: boolean;
}

export const AdMobBanner: React.FC<AdMobBannerProps> = ({
  adUnitId,
  size = BannerAdSize.BANNER,
  containerStyle,
  onAdLoaded,
  onAdFailedToLoad,
  testMode = false,
}) => {
  const [isReady, setIsReady] = useState(false);
  const [finalAdUnitId, setFinalAdUnitId] = useState<string | null>(null);

  useEffect(() => {
    if (!isAdMobReady()) {
      console.warn('[AdMobBanner] AdMob이 초기화되지 않았습니다.');
      return;
    }

    if (testMode) {
      setFinalAdUnitId(TestIds.BANNER);
    } else if (adUnitId) {
      setFinalAdUnitId(adUnitId);
    } else {
      try {
        const envAdUnitId = getAdMobAdUnitId();
        setFinalAdUnitId(envAdUnitId || null);
      } catch (error) {
        console.error('[AdMobBanner] 광고 단위 ID를 가져올 수 없습니다:', error);
        return;
      }
    }

    setIsReady(true);
  }, [adUnitId, testMode]);

  if (!isReady || !finalAdUnitId) {
    return null;
  }

  return (
    <View style={[styles.container, containerStyle]}>
      <BannerAd
        unitId={finalAdUnitId}
        size={size}
        requestOptions={{
          requestNonPersonalizedAdsOnly: false,
        }}
        onAdLoaded={() => {
          console.log('[AdMobBanner] 광고 로드 완료');
          if (onAdLoaded) onAdLoaded();
        }}
        onAdFailedToLoad={(error) => {
          console.error('[AdMobBanner] 광고 로드 실패:', error);
          if (onAdFailedToLoad) onAdFailedToLoad(error);
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.background,
  },
});
