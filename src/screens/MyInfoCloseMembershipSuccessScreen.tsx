import React, { useEffect } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Image } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Header, SafeView } from '../components';
import { useAppNavigation, ROUTES } from '../navigation';
import { logout } from '../services';
import { COMMON_STYLES, FONTS } from '../constants';

const LOGO = require('../../assets/xrun-horizontal-logo.png');

export const MyInfoCloseMembershipSuccessScreen = () => {
  const { t } = useTranslation();
  const { reset } = useAppNavigation();

  const handleConfirm = async () => {
    try {

      const userDataStr = await AsyncStorage.getItem('userData');
      if (userDataStr) {
        const userData = JSON.parse(userDataStr);
        const member = userData.member;

        if (member) {

          try {
            await logout(member);
          } catch (error) {
            console.error('[회원 탈퇴] 로그아웃 API 호출 실패:', error);

          }
        }
      }

      await AsyncStorage.removeItem('isLoggedIn');
      await AsyncStorage.removeItem('userEmail');
      await AsyncStorage.removeItem('userData');
      await AsyncStorage.removeItem('rageProgress');
      await AsyncStorage.removeItem('userTickets');
      await AsyncStorage.removeItem('rageProgressLastUpdate');
      await AsyncStorage.removeItem('userSessionToken');

      reset(ROUTES.login);
    } catch (error) {
      console.error('[회원 탈퇴] 로그아웃 처리 중 오류:', error);

      try {
        await AsyncStorage.removeItem('isLoggedIn');
        await AsyncStorage.removeItem('userEmail');
        await AsyncStorage.removeItem('userData');
        await AsyncStorage.removeItem('rageProgress');
        await AsyncStorage.removeItem('userTickets');
        await AsyncStorage.removeItem('rageProgressLastUpdate');
        await AsyncStorage.removeItem('userSessionToken');
      } catch (storageError) {
        console.error('[회원 탈퇴] AsyncStorage 삭제 중 오류:', storageError);
      }
      reset(ROUTES.login);
    }
  };

  return (
    <SafeView style={styles.container} backgroundColor={"#f7f7fb"}>
      <StatusBar style="dark" />
      <Header title={t('screens.myInfoCloseMembershipSuccess.title')} showBackButton={false} />
      <View style={styles.overlay}>
        <View style={styles.card}>
          <Image source={LOGO} style={styles.logo} resizeMode="contain" />
          <Text style={styles.message}>{t('screens.myInfoCloseMembershipSuccess.message')}</Text>
          <Text style={styles.subMessage}>
            {t('screens.myInfoCloseMembershipSuccess.subMessage')}
          </Text>
          <TouchableOpacity style={styles.button} onPress={handleConfirm}>
            <Text style={styles.buttonText}>{t('screens.myInfoCloseMembershipSuccess.confirmButton')}</Text>
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
    marginBottom: 12,
    textAlign: 'center',
  },
  subMessage: {
    fontSize: FONTS.size.msmall,
    fontFamily: 'Roboto-Regular',
    color: '#747474',
    marginBottom: 24,
    textAlign: 'center',
    lineHeight: 20,
  },
  button: {
    width: '100%',
    height: 50,
    borderRadius: 16,
    backgroundColor: '#343a5a',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: FONTS.size.medium,
    fontFamily: 'Roboto-SemiBold',
  },
});

