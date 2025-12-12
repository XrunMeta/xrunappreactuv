import React from 'react';
import { View, Text, StyleSheet, Platform, TouchableOpacity, Image, Dimensions } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PrimaryButton, SecondaryButton, TaboolaBannerCore, SafeScrollView, SafeView } from '../components';
import { getTaboolaPlacement, getTaboolaPageUrl, isTaboolaNativeModuleAvailable } from '../services/taboola';
import { COLORS, SIZES, COMMON_STYLES, IS_DEV_MODE, FONTS } from '../constants';
import { ROUTES, useAppNavigation } from '../navigation';
import { CameraMainScreen } from './CameraMainScreen';
import { TaboolaBanner } from '../components/TaboolaBanner';

const XRUN_HORIZONTAL_LOGO = require('../../assets/xrun-horizontal-logo.png');
const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export const LoginSignupScreen = () => {
  const { navigate } = useAppNavigation();
  const { t } = useTranslation();

  const placement = getTaboolaPlacement('apploading', true);
  const pageUrl = getTaboolaPageUrl();

  const handleLogin = () => {
    navigate(ROUTES.login);
  };

  const handleSignUp = async () => {

    try {
      await AsyncStorage.removeItem('googleSignupRequired');
      await AsyncStorage.removeItem('googleSignupEmail');
      console.log('[회원가입] 일반 회원가입 버튼 클릭 - 구글 회원가입 플래그 제거');
    } catch (error) {
      console.error('[회원가입] 구글 회원가입 플래그 제거 실패:', error);
    }
    navigate(ROUTES.signup);
  };

  const handleTermsOfService = () => {
    navigate(ROUTES.terms);
  };

  const handlePrivacyPolicy = () => {
    navigate(ROUTES.privacy);
  };

  const handleMyInfoPreview = () => {
    navigate(ROUTES.myInfo);
  };

  return (
    <SafeView style={styles.container}>
      <StatusBar style="dark" />
      {}
      <View style={styles.logoContainer}>
        <Image
          source={XRUN_HORIZONTAL_LOGO}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      <SafeScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={true}
        showBottomBackground={false}
        disableBottomPadding={true}
      >
        {}
        <View style={styles.adContainer}>
          <TaboolaBannerCore
            placementType={placement}
            pageUrl={pageUrl}
            style={styles.adWebView}
            containerStyle={styles.adWebView}
          />
        </View>
      </SafeScrollView>
      {}
      <View style={styles.buttonContainer}>
        <PrimaryButton
          title={t('screens.loginSignup.loginButton')}
          onPress={handleLogin}
          fullWidth={true}
          style={styles.loginButton}
        />
        <SecondaryButton
          title={t('screens.loginSignup.signupButton')}
          onPress={handleSignUp}
          fullWidth={true}
        />
      </View>

      {}
      <View style={styles.taboolaContainer}>
        <TaboolaBanner placementType="shop" />
      </View>
    </SafeView>
  );
};

const styles = StyleSheet.create({
  container: {
    ...COMMON_STYLES.container,
  },
  scrollContent: {
    flexGrow: 1,
    ...COMMON_STYLES.scrollContent,
    minHeight: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    position: 'absolute',
    top: SCREEN_HEIGHT * 0.3,
    left: 0,
    right: 0,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  logo: {
    width: 200,
    height: 60,
  },
  adContainer: {
    marginBottom: SIZES.xlarge,
    width: '100%',
    aspectRatio: 3 / 4,
    height: 'auto',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 44, 
    alignSelf: 'center',
    overflow: 'hidden',
    backgroundColor: '#cccccc',
  },
  adWebView: {
    width: '100%',
    height: '100%',
  },
  buttonContainer: {
    width: '100%',
    marginTop: 'auto', 
    gap: SIZES.medium,
    alignSelf: 'flex-end',
    paddingHorizontal: SIZES.large,
    marginBottom: SIZES.xlarge,
  },
  loginButton: {
    marginBottom: 0,
  },

  taboolaContainer: {
    borderWidth: 2,
    borderColor: '#ededed',
  },

});

