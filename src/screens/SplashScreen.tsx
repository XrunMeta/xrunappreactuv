import React from 'react';
import { View, Image, StyleSheet, Dimensions } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { COLORS } from '../constants';

const { width, height } = Dimensions.get('window');

const XRUN_ROUND_LOGO = 'https://www.figma.com/oth-path';
const XRUN_HORIZONTAL_LOGO = 'https://www.figma.com/oth-path';

export const SplashScreen = () => {
  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      {}
      <View style={styles.centerLogoContainer}>
        <Image
          source={{ uri: XRUN_ROUND_LOGO }}
          style={styles.centerLogo}
          resizeMode="contain"
        />
      </View>
      {}
      <View style={styles.bottomLogoContainer}>
        <Image
          source={{ uri: XRUN_HORIZONTAL_LOGO }}
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
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerLogoContainer: {
    position: 'absolute',
    top: height / 2 - 57.5, 
    left: width / 2 - 56.5, 
    width: 113,
    height: 115,
  },
  centerLogo: {
    width: '100%',
    height: '100%',
  },
  bottomLogoContainer: {
    position: 'absolute',
    bottom: 100,
    left: width / 2 - 100, 
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomLogo: {
    width: 200,
    height: 60,
  },
});

