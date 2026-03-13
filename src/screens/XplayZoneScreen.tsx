import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { SafeScrollView } from '../components';
import { Header } from '../components';
import { useAppNavigation } from '../navigation';
import { ROUTES } from '../navigation';
import { useAppContext } from '../context';
import { COMMON_STYLES, FONTS, COLORS } from '../constants';

let xplaySymbol: any = null;
try {
  xplaySymbol = require('../../assets/xplay_symbol.png');
} catch (e) {
  console.warn('xplay_symbol.png not found');
}

export const XplayZoneScreen = () => {
  const { goBack, navigate } = useAppNavigation();
  const { setSelectedShopItem } = useAppContext();

  const onZone1Press = () => {
    setSelectedShopItem({ shopTab: 'xplayShop' } as any);
    navigate(ROUTES.shop);
  };

  const onZone2Press = () => {
    navigate(ROUTES.ayetOffersXplay);
  };

  return (
    <View style={styles.container}>
      <Header title="Xplay" onBackPress={goBack} showBackButton />
      <SafeScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {xplaySymbol && (
          <View style={styles.logoContainer}>
            <Image source={xplaySymbol} style={styles.logo} resizeMode="contain" />
          </View>
        )}
        <Text style={styles.title}>Xplay Zone</Text>
        <Text style={styles.subtitle}>진입할 Zone을 선택하세요</Text>

        <TouchableOpacity
          style={styles.zoneCard}
          activeOpacity={0.8}
          onPress={onZone1Press}
        >
          <Text style={styles.zoneTitle}>Xplay Zone 1</Text>
          <Text style={styles.zoneDescription}>Xplay Shop · 리워드 상품</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.zoneCard}
          activeOpacity={0.8}
          onPress={onZone2Press}
        >
          <Text style={styles.zoneTitle}>Xplay Zone 2</Text>
          <Text style={styles.zoneDescription}>오퍼월 · 리워드 적립</Text>
        </TouchableOpacity>
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
    paddingHorizontal: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 16,
  },
  logo: {
    width: 72,
    height: 72,
  },
  title: {
    fontSize: FONTS.size.xlarge,
    fontFamily: 'Roboto-Medium',
    fontWeight: '500',
    color: COLORS.headerText,
    textAlign: 'center',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: FONTS.size.msmall,
    fontFamily: 'Roboto-Regular',
    color: '#666',
    textAlign: 'center',
    marginBottom: 28,
  },
  zoneCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    paddingVertical: 20,
    paddingHorizontal: 20,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  zoneTitle: {
    fontSize: FONTS.size.mmedium,
    fontFamily: 'Roboto-Medium',
    fontWeight: '500',
    color: COLORS.headerText,
    marginBottom: 4,
  },
  zoneDescription: {
    fontSize: FONTS.size.msmall,
    fontFamily: 'Roboto-Regular',
    color: '#64748B',
  },
});
