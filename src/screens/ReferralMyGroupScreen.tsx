import React, { useMemo } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Share } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Feather } from '@expo/vector-icons';
import { Header, ReferralMemberRow, ReferralStatsCard, SegmentedControl } from '../components';
import { COLORS } from '../constants';
import { ROUTES, useAppNavigation } from '../navigation';

const members = Array.from({ length: 8 }, (_, index) => ({
  rank: index + 1,
  email: 'user1@user.com',
  date: '2025.05.05',
}));

export const ReferralMyGroupScreen = () => {
  const { navigate } = useAppNavigation();

  const segmentedOptions = useMemo(
    () => [
      { label: '내 그룹', value: 'group' },
      { label: '정산목록', value: 'settlement' },
      { label: '순위', value: 'rank' },
    ] as const,
    [],
  );

  const handleSegmentChange = (value: typeof segmentedOptions[number]['value']) => {
    if (value === 'settlement') {
      navigate(ROUTES.referralSettlement);
    } else if (value === 'rank') {
      navigate(ROUTES.referralRank);
    }
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: 'XRUN referral 링크를 공유해 보세요!',
      });
    } catch (error) {
      console.warn(error);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <Header title="추천" />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.wrapper}>
          <View style={styles.topRow}>
            <ReferralStatsCard title="내 그룹 맴버" value="610 맴버" helperText=" " />
            <TouchableOpacity style={styles.iconButton} onPress={handleShare} activeOpacity={0.7}>
              <Feather name="share-2" size={18} color={COLORS.headerText} />
            </TouchableOpacity>
          </View>

          <SegmentedControl
            options={segmentedOptions}
            value="group"
            onChange={handleSegmentChange}
            containerStyle={styles.segmented}
          />

          <View style={styles.list}>
            {members.map((item) => (
              <ReferralMemberRow
                key={`${item.rank}-${item.email}`}
                rank={item.rank}
                email={item.email}
                date={item.date}
                highlight={item.rank === 1}
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
  topRow: {
    position: 'relative',
    marginBottom: 24,
  },
  iconButton: {
    position: 'absolute',
    right: 16,
    top: 16,
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  segmented: {
    marginTop: 16,
    marginBottom: 24,
  },
  list: {
    width: '100%',
  },
});


