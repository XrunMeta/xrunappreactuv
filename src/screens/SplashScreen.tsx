import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { COLORS } from '../constants';

const XRUN_ROUND_LOGO = require('../../assets/xrun-round-logo.png');
const XRUN_HORIZONTAL_LOGO = require('../../assets/xrun-horizontal-logo.png');

export const SplashScreen = () => {
  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      {}
      <View style={styles.centerLogoWrapper}>
        <Image
          source={XRUN_ROUND_LOGO}
          style={styles.centerLogo}
          resizeMode="contain"
        />
      </View>
      {}
      <View style={styles.bottomLogoContainer}>
        <Image
          source={XRUN_HORIZONTAL_LOGO}
          style={styles.bottomLogo}
          resizeMode="contain"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerLogoWrapper: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerLogo: {
    width: 113,
    height: 115,
  },
  bottomLogoContainer: {
    position: 'absolute',
    bottom: 100,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomLogo: {
    width: 200,
    height: 60,
  },
});

