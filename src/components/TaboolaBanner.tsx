import React, { useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import { TaboolaBannerCore } from './TaboolaBannerCore';
import { COLORS } from '../constants';
import { TaboolaPlacement, convertPlacementForOS, getTaboolaPlacement } from '../services/taboola';

interface TaboolaBannerProps {

  placementType: TaboolaPlacement | 'myinfo' | 'shop' | 'apploading';

  pageUrl?: string;

  style?: any;

  containerStyle?: any;

  onLoadComplete?: () => void;
}

export const TaboolaBanner: React.FC<TaboolaBannerProps> = ({
  placementType,
  pageUrl,
  style,
  containerStyle,
  onLoadComplete,
}) => {

  const convertedPlacementType = useMemo(() => {

    if (placementType === 'myinfo' || placementType === 'shop' || placementType === 'apploading') {
      return getTaboolaPlacement(placementType, false);
    }

    return convertPlacementForOS(placementType);
  }, [placementType]);

  const handleTaboolaLoadingChange = (isLoading: boolean) => {
    if (!isLoading && onLoadComplete) {
      onLoadComplete();
    }
  };

  return (
    <TaboolaBannerCore
      placementType={convertedPlacementType}
      pageUrl={pageUrl}
      onLoadingChange={handleTaboolaLoadingChange}
    />
  );
};

