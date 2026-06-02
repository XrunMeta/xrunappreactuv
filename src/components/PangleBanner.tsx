

import React, { useMemo } from 'react';
import { View, StyleSheet, requireNativeComponent, Platform, ViewStyle } from 'react-native';

interface PangleBannerNativeProps {
  slotId: string;
  style?: ViewStyle;
  onAdLoaded?: (e: any) => void;
  onAdFailedToLoad?: (e: any) => void;
  onAdClicked?: (e: any) => void;
  onAdImpression?: (e: any) => void;
}

const PangleBannerNative = requireNativeComponent<PangleBannerNativeProps>('PangleBannerView');

const DEFAULT_SLOT_ID = Platform.OS === 'ios' ? '983205194' : '983205100';
const PLACEMENT_TO_SLOT: Record<string, string> = {
  myinfo: DEFAULT_SLOT_ID,
  shop: DEFAULT_SLOT_ID,
  apploading: DEFAULT_SLOT_ID,
};

interface PangleBannerProps {

  placementType?: string;

  slotId?: string;

  pageUrl?: string;
  style?: ViewStyle;
  containerStyle?: ViewStyle;
  onLoadComplete?: () => void;
}

export const PangleBanner: React.FC<PangleBannerProps> = ({
  placementType,
  slotId,
  style,
  containerStyle,
  onLoadComplete,
}) => {
  const resolvedSlotId = useMemo(() => {
    if (slotId) return slotId;
    if (placementType && PLACEMENT_TO_SLOT[placementType]) return PLACEMENT_TO_SLOT[placementType];
    return DEFAULT_SLOT_ID;
  }, [slotId, placementType]);

  if (Platform.OS !== 'ios' && Platform.OS !== 'android') {
    return null;
  }

  return (
    <View style={[styles.container, containerStyle]}>
      <PangleBannerNative
        slotId={resolvedSlotId}
        style={[styles.banner, style]}
        onAdLoaded={() => { onLoadComplete?.() }}
        onAdFailedToLoad={(e) => { console.warn('[PangleBanner] load failed', e?.nativeEvent) }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  banner: {
    width: 320,
    height: 50,
  },
});
