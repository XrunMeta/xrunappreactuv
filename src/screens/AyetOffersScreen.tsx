import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Header } from '../components';
import { useAppNavigation } from '../navigation';
import { useTranslation } from 'react-i18next';
import { COLORS, COMMON_STYLES, FONTS, SIZES } from '../constants';
import { showAyetOfferwall, AYET_AD_SLOT_NAME } from '../services/ayet';
import { showToast } from '../utils';

const DEFAULT_SLOT = AYET_AD_SLOT_NAME;

export interface AyetOffersScreenProps {

  slotName?: string;
}

export const AyetOffersScreen: React.FC<AyetOffersScreenProps> = ({ slotName = DEFAULT_SLOT }) => {
  const { goBack } = useAppNavigation();
  const { t } = useTranslation();
  const openedRef = useRef(false);

  useEffect(() => {
    if (openedRef.current) return;
    const open = async () => {
      openedRef.current = true;
      try {
        let memberId: string | undefined;
        try {
          const userDataStr = await AsyncStorage.getItem('userData');
          if (userDataStr) {
            const userData = JSON.parse(userDataStr);
            if (userData.member != null) memberId = String(userData.member);
          }
        } catch (_) {}
        await showAyetOfferwall(slotName, { memberId });
        goBack();
      } catch (e) {
        const msg =
          e instanceof Error && e.message === 'OFFERWALL_UNAVAILABLE'
            ? t('screens.myInfoSettings.ayet_android_only')
            : (e instanceof Error ? e.message : t('screens.myInfoSettings.offers_error'));
        showToast(msg ?? '오퍼월을 열 수 없습니다.');
        goBack();
      }
    };
    open();
  }, [slotName, goBack, t]);

  const titleKey =
    slotName === 'Xplay'
      ? 'screens.myInfoSettings.ayet_offers_xplay'
      : 'screens.myInfoSettings.ayet_offers';

  return (
    <View style={styles.container}>
      <Header title={t(titleKey)} onBackPress={goBack} showBackButton />
      <View style={styles.centered}>
        <ActivityIndicator size="small" color={COLORS.buttonPrimary} />
        <Text style={styles.loadingText}>{t('screens.myInfoSettings.offers_loading')}</Text>
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
