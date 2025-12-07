import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { SafeScrollView } from '../components';
import { Header } from '../components';
import { COMMON_STYLES, FONTS } from '../constants';

let xrunRoundLogo: any = null;
try {
  xrunRoundLogo = require('../../assets/xrun-round-logo.png');
} catch (e) {
  console.warn('xrun-round-logo.png not found');
}

export const XRUNinfoScreen = () => {
  return (
    <View style={styles.container}>
      <Header title="XRUN" />
      <SafeScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {}
        {xrunRoundLogo && (
          <View style={styles.logoContainer}>
            <Image
              source={xrunRoundLogo}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>
        )}

        {}
        <Text style={styles.title}>XRUN</Text>

        {}
        <View style={styles.descriptionContainer}>
          <Text style={styles.description}>
            누구나 참여할 수 있는{'\n'}
            에어드랍 광고 플랫폼으로 혜택을 받아보세요.{'\n'}
            {'\n'}
            일상에서 즐기는 AR XRUN 미션!{'\n'}
            XRUN 광고 플랫폼은 내 주변에 노출되는 광고 미션을 수행하고{'\n'}
            리워드를 받는 보상형 광고 플랫폼입니다.
          </Text>
        </View>
      </SafeScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...COMMON_STYLES.container,
  },
  scrollContent: {
    flexGrow: 1,
    ...COMMON_STYLES.scrollContent,
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 60,
    marginBottom: 20,
  },
  logo: {
    width: 113,
    height: 115,
  },
  title: {
    fontSize: FONTS.size.medium,
    fontFamily: 'Roboto-Medium',
    fontWeight: '500',
    lineHeight: 24,
    color: '#121212',
    textAlign: 'center',
    marginBottom: 20,
  },
  descriptionContainer: {
    width: '100%',
  },
  description: {
    fontSize: FONTS.size.msmall,
    fontFamily: 'Roboto-Regular',
    fontWeight: '400',
    lineHeight: 24,
    color: '#121212',
    textAlign: 'left',
  },
});

