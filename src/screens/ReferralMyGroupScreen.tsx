import React, { useMemo, useRef, useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, TouchableOpacity, Share, Text } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Header, ReferralMemberRow, ReferralStatsCard, SegmentedControl, DataList, DataListRef } from '../components';
import { COLORS } from '../constants';
import { ROUTES, useAppNavigation } from '../navigation';
import { PaginationParams, PaginationResponse } from '../types/pagination';
import { getRecommendedToMe } from '../services';
import { RecommendedToMeItem } from '../types';

interface MemberData {
  rank: number;
  email: string;
  date: string;
  highlight?: boolean;
}

export const ReferralMyGroupScreen = () => {
  const { navigate } = useAppNavigation();
  const dataListRef = useRef<DataListRef>(null);
  const [memberId, setMemberId] = useState<number | null>(null);
  const [totalMembers, setTotalMembers] = useState<number>(0);
  const [allMembers, setAllMembers] = useState<MemberData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const isLoadingRef = useRef<boolean>(false);
  const hasLoadedRef = useRef<boolean>(false);
  const membersDataRef = useRef<MemberData[]>([]);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const userDataStr = await AsyncStorage.getItem('userData');
        if (userDataStr) {
          const userData = JSON.parse(userDataStr);
          if (userData.member) {
            setMemberId(userData.member);

            hasLoadedRef.current = false;
            setAllMembers([]);
            setTotalMembers(0);
          }
        }
      } catch (error) {
        console.error('[추천] 사용자 정보 로드 실패:', error);
      }
    };
    loadUserData();
  }, []);

  const fetchReferralMembers = useCallback(async (
    params: PaginationParams
  ): Promise<PaginationResponse<MemberData>> => {
    if (!memberId) {
      return { data: [], total: 0, hasMore: false };
    }

    try {

      if (params.page === 1 && !hasLoadedRef.current && !isLoadingRef.current) {
        isLoadingRef.current = true;

        try {
          const response = await getRecommendedToMe(memberId, navigate);

          if (response.status === 'success' && response.data) {

            const members: MemberData[] = response.data.map((item, index) => ({
              rank: index + 1,
              email: item.masked_email || item.email || '',
              date: '', 
              highlight: index === 0, 
            }));

            membersDataRef.current = members;
            setAllMembers(members);
            setTotalMembers(members.length);
            hasLoadedRef.current = true;
            setIsLoading(false);
          } else {
            membersDataRef.current = [];
            setAllMembers([]);
            setTotalMembers(0);
            hasLoadedRef.current = true;
            setIsLoading(false);
          }
        } finally {
          isLoadingRef.current = false;
        }
      }

      const members = membersDataRef.current;
      const startIndex = (params.page - 1) * params.pageSize;
      const endIndex = startIndex + params.pageSize;
      const paginatedData = members.slice(startIndex, endIndex);
      const hasMore = endIndex < members.length;

      return {
        data: paginatedData,
        total: members.length,
        hasMore,
      };
    } catch (error) {
      console.error('[추천] 내가 추천한 사람 목록 조회 실패:', error);
      isLoadingRef.current = false;
      setIsLoading(false);
      return { data: [], total: 0, hasMore: false };
    }
  }, [memberId, navigate]);

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

      hasLoadedRef.current = false;
      setAllMembers([]);
      setTotalMembers(0);
      setIsLoading(true);
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
            <ReferralStatsCard title="내 그룹 맴버" value={`${totalMembers} 맴버`} helperText=" " />
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
          {!isLoading && totalMembers === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyTitle}>그룹 멤버 없음</Text>
              <Text style={styles.emptyDescription}>
                아직 그룹에 멤버를 추가하지 않았습니다.{'\n'}
                네트워크를 확장하기 위해 사람들을 초대해보세요!
              </Text>
            </View>
          ) : (
            <DataList<MemberData>
              ref={dataListRef}
              fetchData={fetchReferralMembers}
              ItemComponent={ReferralMemberRow}
              pageSize={20}
              keyExtractor={(item, index) => `member-${item.rank}-${item.email}-${index}`}
              onItemPress={() => navigate(ROUTES.referralDepthOne)}
              contentContainerStyle={styles.listContent}
            />
          )}
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 18,
    fontFamily: 'Roboto-Bold',
    color: '#2a2727',
    marginBottom: 12,
    textAlign: 'center',
  },
  emptyDescription: {
    fontSize: 14,
    fontFamily: 'Roboto-Regular',
    color: '#7d7e83',
    textAlign: 'center',
    lineHeight: 20,
  },
});

