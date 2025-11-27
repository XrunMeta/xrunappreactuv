import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { TaboolaBannerCore } from './TaboolaBannerCore';
import { COLORS } from '../constants';

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
  const { t } = useTranslation();
  const [isTaboolaLoading, setIsTaboolaLoading] = useState(true);
  const [taboolaLoadingCount, setTaboolaLoadingCount] = useState(0);

  const handleTaboolaLoadingChange = (isLoading: boolean) => {
    if (!isLoading) {

      setTaboolaLoadingCount((prev) => {
        const newCount = prev + 1;
        console.log('[TaboolaBanner] Taboola 로딩 카운터 증가:', newCount);
        return newCount;
      });
    }
  };

  useEffect(() => {
    if (taboolaLoadingCount >= 2) {
      console.log('[TaboolaBanner] Taboola 로딩 완료 (카운터 >= 2)');
      setIsTaboolaLoading(false);
    }
  }, [taboolaLoadingCount]);

  return (
    <View style={[styles.container, containerStyle, style]}>
      <TaboolaBannerCore
        placementType={placementType}
        pageUrl={pageUrl}
        onLoadingChange={handleTaboolaLoadingChange}
      />
      {isTaboolaLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="small" color={COLORS.headerText} />
          <Text style={styles.loadingText}>
            {t('common.messages.loading')}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    width: '100%',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
    gap: 8,
  },
  loadingText: {
    fontSize: 14,
    fontFamily: 'Roboto-Regular',
    color: COLORS.headerText,
    marginTop: 8,
  },
});
