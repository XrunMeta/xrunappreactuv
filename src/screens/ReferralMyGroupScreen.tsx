import React, { useMemo, useRef } from 'react';
import { View, StyleSheet, TouchableOpacity, Share } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Feather } from '@expo/vector-icons';
import { Header, ReferralMemberRow, ReferralStatsCard, SegmentedControl, DataList, DataListRef } from '../components';
import { COLORS } from '../constants';
import { ROUTES, useAppNavigation } from '../navigation';
import { PaginationParams, PaginationResponse } from '../types/pagination';

interface MemberData {
  rank: number;
  email: string;
  date: string;
  highlight?: boolean;
}

const generateDemoMembers = (page: number, pageSize: number): MemberData[] => {
  const startIndex = (page - 1) * pageSize;
  const totalItems = 610; 
  const items: MemberData[] = [];

  for (let i = 0; i < pageSize && startIndex + i < totalItems; i++) {
    items.push({
      rank: startIndex + i + 1,
      email: `user${startIndex + i + 1}@user.com`,
      date: '2025.05.05' + i + ' 14:00',
      highlight: startIndex + i === 0, 
    });
  }

  return items;
};

const fetchReferralMembers = async (
  params: PaginationParams
): Promise<PaginationResponse<MemberData>> => {

  return new Promise((resolve) => {

    setTimeout(() => {
      const data = generateDemoMembers(params.page, params.pageSize);
      const total = 610;
      const hasMore = params.page * params.pageSize < total;

      resolve({
        data,
        total,
        hasMore,
      });
    }, 500); 
  });
};

export const ReferralMyGroupScreen = () => {
  const { navigate } = useAppNavigation();
  const dataListRef = useRef<DataListRef>(null);

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
    } else if (value === 'group') {

      dataListRef.current?.reloadData();
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
      <View style={styles.content}>
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
        </View>

        <View style={styles.listContainer}>
          <DataList<MemberData>
            ref={dataListRef}
            fetchData={fetchReferralMembers}
            ItemComponent={ReferralMemberRow}
            pageSize={20}
            keyExtractor={(item, index) => `member-${item.rank}-${item.email}-${index}`}
            onItemPress={() => navigate(ROUTES.referralDepthOne)}
            contentContainerStyle={styles.listContent}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f7fb',
  },
  content: {
    flex: 1,
  },
  wrapper: {
    width: '100%',
    maxWidth: 780,
    alignSelf: 'center',
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 16,
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
    marginBottom: 0,
  },
  listContainer: {
    flex: 1,
    width: '100%',
    maxWidth: 780,
    alignSelf: 'center',
    paddingHorizontal: 24,
  },
  listContent: {
    paddingBottom: 32,
  },
});

