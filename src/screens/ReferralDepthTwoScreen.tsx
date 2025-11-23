import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Header, ReferralMemberRow } from '../components';

const rows = Array.from({ length: 7 }, (_, index) => ({
  rank: index === 0 ? 2 : 1,
  email: 'user1@user.com',
  date: '2025.05.05',
  highlight: index === 0,
}));

export const ReferralDepthTwoScreen = () => {
  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <Header title="2 Depth" />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
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


