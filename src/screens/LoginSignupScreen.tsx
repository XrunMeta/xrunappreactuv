import React from 'react';
import { View, Text, StyleSheet, Platform, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useTranslation } from 'react-i18next';
import { PrimaryButton, SecondaryButton, TaboolaBannerCore, SafeScrollView } from '../components';
import { getTaboolaPlacement, getTaboolaPageUrl, isTaboolaNativeModuleAvailable } from '../services/taboola';
import { COLORS, SIZES, COMMON_STYLES, IS_DEV_MODE, FONTS } from '../constants';
import { ROUTES, useAppNavigation } from '../navigation';
import { CameraMainScreen } from './CameraMainScreen';

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

  const quickLinks = [

  ];

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <SafeScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
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
        <View style={styles.termsContainer}>
          <Text style={styles.termsText}>
            {t('screens.loginSignup.termsText')}{' '}
            <Text style={styles.linkText} onPress={handleTermsOfService}>
              {t('screens.loginSignup.termsLink')}
            </Text>
            {' '}{t('screens.loginSignup.termsAnd')}{' '}
            <Text style={styles.linkText} onPress={handlePrivacyPolicy}>
              {t('screens.loginSignup.privacyLink')}
            </Text>
            {' '}{t('screens.loginSignup.termsAgree')}
          </Text>
        </View>

        {}
        {

}
      </SafeScrollView>

      {}
      {Platform.OS === 'ios' && (
        <View style={styles.homeIndicator}>
          <View style={styles.homeIndicatorBar} />
        </View>
      )}
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
  adContainer: {
    width: '100%',
    height: 393,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 44, 
    alignSelf: 'center',
    overflow: 'hidden',
  },
  adWebView: {
    width: '100%',
    height: '100%',
    backgroundColor: '#ffffff',
    borderRadius: 10,
  },
  buttonContainer: {
    width: '100%',
    marginTop: 48, 
    gap: 15,
    alignSelf: 'center',
  },
  loginButton: {
    marginBottom: 0,
  },
  termsContainer: {
    ...COMMON_STYLES.bottomButtonContainer,
  },
  termsText: {
    fontSize: FONTS.size.small,
    lineHeight: 15,
    color: '#4c4e55',
    fontFamily: 'Roboto-Regular',
    textAlign: 'left',
    letterSpacing: 0.06,
  },
  linkText: {
    fontSize: FONTS.size.small,
    lineHeight: 15,
    color: '#4c4e55',
    fontFamily: 'Roboto-Bold',
    fontWeight: 'bold',
    letterSpacing: 0.06,
  },
  previewLink: {
    marginTop: 12,
    fontSize: 14,
    color: COLORS.buttonPrimary,
    fontFamily: 'Roboto-SemiBold',
  },
  homeIndicator: {
    height: 34,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 9,
  },
  homeIndicatorBar: {
    width: 134,
    height: 5,
    backgroundColor: '#10192d',
    borderRadius: 100,
    marginBottom: 9,
  },
  devLinksContainer: {
    marginTop: 24,
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  devLinksTitle: {
    fontSize: FONTS.size.msmall,
    fontFamily: 'Roboto-Bold',
    fontWeight: 'bold',
    color: '#10192d',
    marginBottom: 12,
  },
  devLinksGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  devLinkButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#f5f5f5',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  devLinkText: {
    fontSize: FONTS.size.xsmall,
    fontFamily: 'Roboto-Regular',
    color: COLORS.buttonPrimary,
  },
});

