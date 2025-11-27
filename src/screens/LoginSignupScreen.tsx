import React from 'react';
import { View, Text, StyleSheet, ScrollView, Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useTranslation } from 'react-i18next';
import { PrimaryButton, SecondaryButton, TaboolaBannerCore } from '../components';
import { getTaboolaPlacement, getTaboolaPageUrl, isTaboolaNativeModuleAvailable } from '../services/taboola';
import { COLORS, SIZES, COMMON_STYLES } from '../constants';
import { ROUTES, useAppNavigation } from '../navigation';

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
    <View style={styles.container}>
      <StatusBar style="dark" />
      <ScrollView
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
      </ScrollView>

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
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 58, 
    paddingBottom: Platform.OS === 'android' 
      ? 16 + SIZES.medium 
      : 34,
    justifyContent: 'space-between',
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
    ...COMMON_STYLES.bottomSection,
  },
  termsText: {
    fontSize: 12,
    lineHeight: 15,
    color: '#4c4e55',
    fontFamily: 'Roboto-Regular',
    textAlign: 'left',
    letterSpacing: 0.06,
  },
  linkText: {
    fontSize: 12,
    lineHeight: 15,
    color: '#4c4e55',
    fontFamily: 'Roboto-Bold',
    fontWeight: 'bold',
    letterSpacing: 0.06,
  },
  previewLink: {
    marginTop: 12,
    fontSize: 13,
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
});

