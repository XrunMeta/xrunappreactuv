import React from 'react';
import { View, Text, StyleSheet, Platform, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useTranslation } from 'react-i18next';
import { PrimaryButton, SecondaryButton, TaboolaBannerCore, SafeScrollView, SafeView } from '../components';
import { getTaboolaPlacement, getTaboolaPageUrl, isTaboolaNativeModuleAvailable } from '../services/taboola';
import { COLORS, SIZES, COMMON_STYLES, IS_DEV_MODE, FONTS } from '../constants';
import { ROUTES, useAppNavigation } from '../navigation';
import { CameraMainScreen } from './CameraMainScreen';
import { TaboolaBanner } from '../components/TaboolaBanner';
export const LoginSignupScreen = () => {
  const { navigate } = useAppNavigation();
  const { t } = useTranslation();

  const placement = getTaboolaPlacement('apploading', true);
  const pageUrl = getTaboolaPageUrl();

  const handleLogin = () => {
    navigate(ROUTES.login);
  };

  const handleSignUp = () => {
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

