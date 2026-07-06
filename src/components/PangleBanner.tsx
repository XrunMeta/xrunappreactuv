

import React from 'react';
import { Platform, StyleSheet, View, requireNativeComponent } from 'react-native';
import { getEnvValue } from '../utils/env';

interface Props {
  style?: object;
}

const NativePangleBanner = requireNativeComponent<{ adUnitId: string; style?: object }>(
  'PangleBannerViewManager',
);

export const PangleBanner: React.FC<Props> = ({ style }) => {
  const adUnitId = Platform.OS === 'ios'
    ? getEnvValue('PANGLE_BANNER_AD_UNIT_ID_IOS')
    : getEnvValue('PANGLE_BANNER_AD_UNIT_ID');

  if (!adUnitId) return null;

  return (
    <View style={[styles.container, style]}>
      <NativePangleBanner adUnitId={adUnitId} style={styles.banner} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  banner: {
    width: 320,
    height: 50,
  },
});
