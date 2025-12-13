import React, { useEffect } from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { COLORS } from '../constants';
import { checkColdStart } from '../utils';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppState } from 'react-native';

const XRUN_ROUND_LOGO = require('../../assets/xrun-round-logo.png');

export const SplashScreen = () => {
  useEffect(() => {

    const checkColdStartOnSplash = async () => {
      const result = await checkColdStart();
      if (result) {
        console.log(`[SplashScreen] 콜드스타트 체크 완료: ${result.isColdStart ? '콜드스타트' : '웜스타트'} (경과 시간: ${result.elapsedSeconds}초)`);
      }

      await AsyncStorage.setItem('app_last_state', AppState.currentState);
    };

    checkColdStartOnSplash();
  }, []);

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
});

