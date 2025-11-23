import React, { useMemo } from 'react';
import { View, StyleSheet, ScrollView, Text } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Header, ReferralMemberRow, ReferralStatsCard, SegmentedControl } from '../components';
import { ROUTES, useAppNavigation } from '../navigation';

const rankEntries = [
  { rank: 1, email: '****12@user.com', highlight: true },
  { rank: 2, email: '****1@user.com' },
  { rank: 3, email: 'u**1@user.com' },
  { rank: 4, email: 'us****@user.com' },
  { rank: 6, email: 'u**1@user.com' },
  { rank: 7, email: 'us****@user.com' },
];

export const ReferralRankScreen = () => {
  const { navigate } = useAppNavigation();
  const segmentedOptions = useMemo(
    () => [
      { label: 'My Group', value: 'group' },
      { label: '정산목록', value: 'settlement' },
      { label: 'Rank', value: 'rank' },
    ] as const,
    [],
  );

  const handleSegmentChange = (value: typeof segmentedOptions[number]['value']) => {
    if (value === 'group') {
      navigate(ROUTES.referralMyGroup);
    } else if (value === 'settlement') {
      navigate(ROUTES.referralSettlement);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <Header title="Referral" />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.wrapper}>
          <ReferralStatsCard title="My Rank">
            <View style={styles.rankCardContent}>
              <View style={styles.rankLeft}>
                <Text style={styles.rankEmail}>oth-test@example.invalid</Text>
                <Text style={styles.rankHelper}>My Rank</Text>
              </View>
              <View style={styles.rankDivider} />
              <Text style={styles.rankValue}>512,000,000</Text>
            </View>
          </ReferralStatsCard>

          <SegmentedControl
            options={segmentedOptions}
            value="rank"
            onChange={handleSegmentChange}
            containerStyle={styles.segmented}
          />

          <View style={styles.list}>
            {rankEntries.map((item) => (
              <ReferralMemberRow
                key={`${item.rank}-${item.email}`}
                rank={item.rank}
                email={item.email}
                highlight={item.highlight}
                onPress={() => navigate(ROUTES.referralDepthOne)}
              />
            ))}
          </View>
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
  segmented: {
    marginTop: 16,
    marginBottom: 24,
  },
  list: {
    width: '100%',
  },
  rankCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },
  rankLeft: {
    flex: 1,
  },
  rankEmail: {
    fontSize: 20,
    fontFamily: 'Roboto-Bold',
    color: '#ffffff',
  },
  rankHelper: {
    marginTop: 4,
    fontSize: 14,
    color: '#d2edf4',
    fontFamily: 'Roboto-Regular',
  },
  rankDivider: {
    width: 1,
    height: 48,
    backgroundColor: 'rgba(255,255,255,0.4)',
    marginHorizontal: 20,
  },
  rankValue: {
    fontSize: 18,
    color: '#ffffff',
    fontFamily: 'Roboto-Bold',
  },
});


