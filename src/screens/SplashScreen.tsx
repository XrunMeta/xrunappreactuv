import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { COLORS } from '../constants';
import { checkColdStart } from '../utils';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppState } from 'react-native';

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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    backgroundColor: COLORS.background,
  },
});

