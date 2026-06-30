import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Header } from '../components';
import { useAppNavigation } from '../navigation';
import { useTranslation } from 'react-i18next';
import { COLORS, COMMON_STYLES, FONTS, SIZES } from '../constants';
import {
  bindAdisonUid,
  initAdison,
  isAdisonAvailable,
  showAdisonOfferwall,
} from '../services/adison';
import { showToast } from '../utils';
import { getToastBody } from '../services/nasmediaAd';

export const AdisonOfferwallScreen: React.FC = () => {
  const { goBack } = useAppNavigation();
  const { t } = useTranslation();
  const openedRef = useRef(false);

  useEffect(() => {
    if (openedRef.current) return;
    const open = async () => {
      openedRef.current = true;
      try {
        if (!isAdisonAvailable()) {
          showToast(getToastBody('toast_adison_not_in_build', 'Adison SDK가 이 빌드에 포함되어 있지 않습니다.'));
          goBack();
          return;
        }

        const ok = await initAdison();
        if (!ok) {
          showToast(getToastBody('toast_adison_init_fail', 'Adison 초기화에 실패했습니다.'));
          goBack();
          return;
        }

        try {
          const userDataStr = await AsyncStorage.getItem('userData');
          if (userDataStr) {
            const userData = JSON.parse(userDataStr);
            if (userData?.member != null) {
              bindAdisonUid(userData.member, {
                gender: userData.gender,
                age: userData.age,
              });
            }
          }
        } catch (_) {

        }

        const shown = await showAdisonOfferwall();
        if (!shown) {
          showToast(getToastBody('toast_adison_open_fail', 'Adison 오퍼월을 열 수 없습니다.'));
        }
      } catch (e: any) {
        showToast(e?.message ?? 'Adison 오퍼월 오류');
      } finally {
        goBack();
      }
    };
    open();
  }, [goBack, t]);

  return (
    <View style={styles.container}>
      <Header title={'Adison 오퍼월'} onBackPress={goBack} showBackButton />
      <View style={styles.centered}>
        <ActivityIndicator size="small" color={COLORS.buttonPrimary} />
        <Text style={styles.loadingText}>오퍼월을 여는 중...</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...COMMON_STYLES.container,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: SIZES.large,
  },
  loadingText: {
    marginTop: SIZES.small,
    fontSize: FONTS.size.medium,
    color: COLORS.text,
  },
});
