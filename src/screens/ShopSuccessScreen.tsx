import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Image } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Header, SafeView } from '../components';
import { useAppNavigation, ROUTES } from '../navigation';
import { COMMON_STYLES, FONTS } from '../constants';

const LOGO = require('../../assets/xrun-horizontal-logo.png');

export const ShopSuccessScreen = () => {
  const { goBack, navigate } = useAppNavigation();
  const { t } = useTranslation();

  const handleConfirm = () => {
    goBack(); 
    goBack(); 
    navigate(ROUTES.shopMyTicket);
  };

  return (
    <SafeView style={styles.container} backgroundColor='#f7f7fb'>
      <Header title={t('screens.shopSuccess.title')} showBackButton={false} />
      <View style={styles.overlay}>
        <View style={styles.card}>
          <Image source={LOGO} style={styles.logo} resizeMode="contain" />
          <Text style={styles.message}>{t('screens.shopSuccess.paymentComplete')}</Text>
          <TouchableOpacity style={styles.button} onPress={handleConfirm}>
            <Text style={styles.buttonText}>{t('screens.shopSuccess.confirm')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeView>
  );
};

const styles = StyleSheet.create({
  container: {
    ...COMMON_STYLES.container,
  },
  overlay: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    width: '80%',
    maxWidth: 320,
    borderRadius: 24,
    backgroundColor: '#fff',
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e3e3e3',
  },
  logo: {
    width: 88,
    height: 28,
    marginBottom: 16,
  },
  message: {
    fontSize: FONTS.size.mmedium,
    fontFamily: 'Roboto-Bold',
    color: '#10192d',
    marginBottom: 24,
  },
  button: {
    width: '100%',
    height: 50,
    borderRadius: 16,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: FONTS.size.medium,
    fontFamily: 'Roboto-SemiBold',
  },
});

