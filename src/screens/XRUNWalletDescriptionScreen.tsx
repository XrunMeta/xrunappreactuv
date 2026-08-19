import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeView } from '../components';
import { Header } from '../components';
import { useAppNavigation, ROUTES } from '../navigation';
import { COMMON_STYLES, FONTS, COLORS, SIZES } from '../constants';
import { TID } from '../testIDs';

export const XRUNWalletDescriptionScreen = () => {
  const { goBack, navigate } = useAppNavigation();

  return (
    <SafeView style={styles.container}>
      <Header title="XRUN 안내" onBackPress={goBack} showBackButton />
      <View style={styles.content}>
        <Text style={styles.title}>iOS에서는 현재 지갑 기능이 제공되지 않습니다.</Text>
        <Text style={styles.description}>
          XRUN으로 리워드를 획득하세요.{'\n'}
          오퍼월·퀘스트 등을 통해 XRUN을 모아 사용할 수 있습니다.
        </Text>
        <TouchableOpacity testID={TID.xrunwalletDescription.navigate}
          style={styles.ctaButton}
          activeOpacity={0.8}
          onPress={() => navigate(ROUTES.xrunInfo)}>
          <Text style={styles.ctaButtonText}>Xplay에서 리워드 받기</Text>
        </TouchableOpacity>
      </View>
    </SafeView>
  );
};

const styles = StyleSheet.create({
  container: {
    ...COMMON_STYLES.container,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
    paddingHorizontal: SIZES.large,
    paddingTop: SIZES.large * 2,
  },
  title: {
    fontSize: 18,
    fontFamily: 'Roboto-Medium',
    color: COLORS.text,
    marginBottom: SIZES.medium,
    lineHeight: 26,
  },
  description: {
    fontSize: FONTS.size.medium,
    fontFamily: 'Roboto-Regular',
    color: '#6a7282',
    lineHeight: 22,
    marginBottom: SIZES.large * 2,
  },
  ctaButton: {
    backgroundColor: '#343a59',
    paddingVertical: 14,
    paddingHorizontal: SIZES.large,
    borderRadius: 12,
    alignItems: 'center',
  },
  ctaButtonText: {
    fontSize: 16,
    fontFamily: 'Roboto-Medium',
    color: '#FFFFFF',
  },
});
