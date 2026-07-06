import React, { useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { TaboolaBannerCore } from './TaboolaBannerCore';
import { PangleBanner } from './PangleBanner';
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

  const { i18n } = useTranslation();
  const isKoreanUser = (i18n.language || 'ko').toLowerCase().startsWith('ko');

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

  if (!isKoreanUser) {
    return <PangleBanner style={containerStyle} />;
  }

  return (
    <TaboolaBannerCore
      placementType={convertedPlacementType}
      pageUrl={pageUrl}
      onLoadingChange={handleTaboolaLoadingChange}
    />
  );
};

