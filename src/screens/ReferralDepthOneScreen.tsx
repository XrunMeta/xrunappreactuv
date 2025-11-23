import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Header, ReferralMemberRow } from '../components';
import { useAppNavigation, ROUTES } from '../navigation';

const rows = Array.from({ length: 7 }, (_, index) => ({
  rank: 1,
  email: 'user1@user.com',
  date: '2025.05.05',
}));

export const ReferralDepthOneScreen = () => {
  const { navigate } = useAppNavigation();

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <Header title="1 Depth" />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.wrapper}>
          {rows.map((row, index) => (
            <ReferralMemberRow
              key={`${row.email}-${index}`}
              rank={row.rank}
              email={row.email}
              date={row.date}
              highlight={index === 0}
              onPress={() => navigate(ROUTES.referralDepthTwo)}
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f7fb',
  },
  scrollContent: {
    paddingBottom: 32,
  },
  wrapper: {
    width: '100%',
    maxWidth: 780,
    alignSelf: 'center',
    paddingHorizontal: 24,
    paddingTop: 24,
  },
});


