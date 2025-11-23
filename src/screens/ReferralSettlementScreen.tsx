import React, { useMemo } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Header, ReferralMemberRow, ReferralStatsCard, SegmentedControl } from '../components';
import { useAppNavigation, ROUTES } from '../navigation';
import { COLORS } from '../constants';

const settlements = Array.from({ length: 6 }, (_, index) => ({
  rank: index + 1,
  email: 'user1@user.com',
  date: '2025.04.30 14:00',
  description: '레퍼럴 광고수익정산',
  valueText: '+120.45 XRUN',
}));

export const ReferralSettlementScreen = () => {
  const { navigate } = useAppNavigation();
  const segmentedOptions = useMemo(
    () => [
      { label: '내 그룹', value: 'group' },
      { label: '정산목록', value: 'settlement' },
      { label: 'Rank', value: 'rank' },
    ] as const,
    [],
  );

  const handleSegmentChange = (value: typeof segmentedOptions[number]['value']) => {
    if (value === 'group') {
      navigate(ROUTES.referralMyGroup);
    } else if (value === 'rank') {
      navigate(ROUTES.referralRank);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <Header title="추천" />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.wrapper}>
          <ReferralStatsCard
            title="총수익"
            subtitle="45일 후 정산완료됨"
            value="34,010.00 xrun"
            helperText="$5,987"
          />

          <SegmentedControl
            options={segmentedOptions}
            value="settlement"
            onChange={handleSegmentChange}
            containerStyle={styles.segmented}
          />

          <View style={styles.list}>
            {settlements.map((item, index) => (
              <ReferralMemberRow
                key={`${item.email}-${index}`}
                rank={item.rank}
                email={item.email}
                date={item.date}
                description={item.description}
                valueText={item.valueText}
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
});


