import React from 'react';
import { View, StyleSheet } from 'react-native';
import { SafeScrollView } from '../components';
import { StatusBar } from 'expo-status-bar';
import { useTranslation } from 'react-i18next';
import { Header, ReferralMemberRow } from '../components';
import { COMMON_STYLES, SIZES } from '../constants';

const rows = Array.from({ length: 7 }, (_, index) => ({
  rank: index === 0 ? 2 : 1,
  email: 'user1@user.com',
  date: '2025.05.05',
  highlight: index === 0,
}));

export const ReferralDepthTwoScreen = () => {
  const { t } = useTranslation();
  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <Header title={t('screens.referralDepthTwo.title')} />
      <SafeScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.wrapper}>
          {rows.map((row, index) => (
            <ReferralMemberRow
              key={`${row.email}-${index}`}
              rank={row.rank}
              email={row.email}
              date={row.date}
              highlight={row.highlight}
            />
          ))}
        </View>
      </SafeScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...COMMON_STYLES.container,
  },
  scrollContent: {
    ...COMMON_STYLES.scrollContent,
  },
  wrapper: {
    paddingVertical: SIZES.small,
  },
});


