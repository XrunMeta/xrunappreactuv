import React, { useMemo, useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, ScrollView, Text, ActivityIndicator, FlatList } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Header, ReferralMemberRow, ReferralStatsCard, SegmentedControl, SafeView } from '../components';
import { ROUTES, useAppNavigation } from '../navigation';
import { COLORS, COMMON_STYLES, LANG, SIZES, FONTS } from '../constants';
import { getRank, getRankSpesific } from '../services';
import { RankItem } from '../types';

interface TransformedRankData {
  id: string;
  email: string;
  rank: number;
  member: number;
  referralCount: number;
}

const transformRankData = (apiData: RankItem[]): TransformedRankData[] => {
  return apiData.map((item, index) => ({
    id: `rank_${item.referrer_id}_${index}`,
    email: item.referrer_email,
    rank: item.unique_rank,
    member: item.referrer_id,
    referralCount: item.referral_count,
  }));
};

const ITEMS_PER_PAGE = 15;

export const ReferralRankScreen = () => {
  const { navigate } = useAppNavigation();
  const [memberId, setMemberId] = useState<number | null>(null);
  const [rankData, setRankData] = useState<TransformedRankData[]>([]);
  const [currentData, setCurrentData] = useState<TransformedRankData[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [userRank, setUserRank] = useState<string>('-');
  const [userEmail, setUserEmail] = useState<string>('-');

  const { t } = useTranslation();
  const segmentedOptions = useMemo(
    () => [
      { label: t('screens.referralRank.group'), value: 'group' },
      { label: t('screens.referralRank.settlement'), value: 'settlement' },
      { label: t('screens.referralRank.rank'), value: 'rank' },
    ] as const,
    [t],
  );

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const userDataStr = await AsyncStorage.getItem('userData');
        if (userDataStr) {
          const userData = JSON.parse(userDataStr);
          if (userData.member) {
            setMemberId(userData.member);
          }
          if (userData.email) {
            setUserEmail(userData.email);
          }
        }
      } catch (error) {
        console.error('[Rank] 사용자 정보 로드 실패:', error);
      }
    };
    loadUserData();
  }, []);

  const fetchRankData = useCallback(async (member: number) => {
    try {
      setLoading(true);

      const [resultRank, resultMyRank] = await Promise.all([
        getRank(navigate),
        getRankSpesific(member, navigate),
      ]);

      if (resultRank.status === 'success') {
        const transformedData = transformRankData(resultRank.data);
        console.log('[Rank] 변환된 데이터 개수:', transformedData.length);
        console.log('[Rank] 원본 API 데이터 개수:', resultRank.data?.length || 0);
        setRankData(transformedData);

        const initialItems = transformedData.slice(0, ITEMS_PER_PAGE);
        setCurrentData(initialItems);
        setCurrentPage(1);
        setHasMore(transformedData.length > ITEMS_PER_PAGE);
        console.log('[Rank] 페이지네이션 설정:', {
          totalItems: transformedData.length,
          initialItems: initialItems.length,
          hasMore: transformedData.length > ITEMS_PER_PAGE,
        });
      } else {
        console.error('[Rank] 전체 순위 조회 실패:', resultRank.message);
        setRankData([]);
        setCurrentData([]);
        setHasMore(false);
      }

      if (resultMyRank.status === 'success' && resultMyRank.data && resultMyRank.data[0]) {
        const myRank = resultMyRank.data[0].unique_rank;
        setUserRank(myRank ? String(myRank) : '-');
      } else {
        setUserRank('-');
      }
    } catch (error) {
      console.error('[Rank] Rank 데이터 조회 실패:', error);
      setRankData([]);
      setCurrentData([]);
      setUserRank('-');
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    if (memberId) {
      fetchRankData(memberId);
    }
  }, [memberId, fetchRankData]);

  const loadMoreData = useCallback(() => {
    if (isLoadingMore || !hasMore) {
      console.log('[Rank] 페이지네이션 중단:', { isLoadingMore, hasMore });
      return;
    }

    setIsLoadingMore(true);

    setTimeout(() => {

      setCurrentData((prev) => {
        const currentCount = prev.length;
        const startIndex = currentCount;
        const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, rankData.length);

        if (startIndex >= rankData.length) {
          console.log('[Rank] 더 이상 로드할 데이터 없음:', { startIndex, totalData: rankData.length });
          setHasMore(false);
          setIsLoadingMore(false);
          return prev;
        }

        const newItems = rankData.slice(startIndex, endIndex);

        console.log('[Rank] 페이지네이션 로드:', {
          currentCount,
          startIndex,
          endIndex,
          totalData: rankData.length,
          newItemsCount: newItems.length,
          hasMore: endIndex < rankData.length,
        });

        const existingIds = new Set(prev.map((item) => item.id));
        const uniqueNewItems = newItems.filter((item) => !existingIds.has(item.id));
        console.log('[Rank] 현재 표시 중인 데이터 개수:', prev.length);
        console.log('[Rank] 추가될 데이터 개수:', uniqueNewItems.length);
        const newData = [...prev, ...uniqueNewItems];
        console.log('[Rank] 최종 데이터 개수:', newData.length);

        setHasMore(endIndex < rankData.length);
        setCurrentPage((prevPage) => prevPage + 1);
        setIsLoadingMore(false);

        return newData;
      });
    }, 200);
  }, [isLoadingMore, hasMore, rankData]);

  const handleSegmentChange = (value: typeof segmentedOptions[number]['value']) => {
    if (value === 'group') {
      navigate(ROUTES.referralMyGroup);
    } else if (value === 'settlement') {
      navigate(ROUTES.referralSettlement);
    }
  };

  const renderRankItem = ({ item, index }: { item: TransformedRankData; index: number }) => {

    const displayEmail =
      item.email && item.email.length > 15
        ? item.email.substring(0, 12) + '...'
        : item.email;

    const isCurrentUser = userEmail !== '-' && item.email === userEmail && String(item.rank) === userRank;

    const formattedRank = typeof item.rank === 'number'
      ? Number(item.rank.toFixed(2))
      : item.rank;

    return (
      <ReferralMemberRow
        key={item.id}
        rank={formattedRank}
        email={displayEmail}
        highlight={isCurrentUser} 
      />
    );
  };

  return (
    <SafeView style={styles.container}
      showBottomBackground={true}
      backgroundColor={"#f7f7fb"}>
      <Header title={t('screens.referralRank.title')} />
      <View style={styles.content}>
        <ReferralStatsCard title="">
          <View style={styles.rankCardContent}>
            <View style={styles.rankLeft}>
              <Text style={styles.rankHelper}>My Rank</Text>
              <Text style={styles.rankEmail} numberOfLines={1} ellipsizeMode="tail">
                {userEmail}
              </Text>
            </View>
            <View style={styles.rankDivider} />
            <View style={styles.rankRight}>
              <Text style={styles.rankValue}>
                {userRank !== '-'
                  ? Number(userRank).toLocaleString('ko-KR', {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 2
                  })
                  : userRank}
              </Text>
            </View>
          </View>
        </ReferralStatsCard>

        <SegmentedControl
          options={segmentedOptions}
          value="rank"
          onChange={handleSegmentChange}
          containerStyle={styles.segmented}
          hideIndicator={true}
        />

        <View style={styles.listContainer}>
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={COLORS.buttonPrimary} />
            </View>
          ) : currentData.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>순위 데이터가 없습니다.</Text>
            </View>
          ) : (
            <FlatList
              data={currentData}
              renderItem={renderRankItem}
              keyExtractor={(item) => item.id}
              onEndReached={loadMoreData}
              onEndReachedThreshold={0.5}
              ListFooterComponent={
                isLoadingMore ? (
                  <View style={styles.loadingMoreContainer}>
                    <ActivityIndicator size="small" color={COLORS.buttonPrimary} />
                  </View>
                ) : null
              }
              scrollEnabled={true}
            />
          )}
        </View>
      </View>
    </SafeView>
  );
};

const styles = StyleSheet.create({
  container: {
    ...COMMON_STYLES.container,
  },
  content: {
    flex: 1,
    ...COMMON_STYLES.scrollContent,
  },
  segmented: {
    marginVertical: SIZES.large,
  },
  listContainer: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: FONTS.fontSize.msmall,
    fontFamily: 'Roboto-Regular',
    color: '#7d7e83',
  },
  list: {
    width: '100%',
  },
  rankCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 0,
    flex: 1,
    justifyContent: 'center',
    paddingTop: 0,
  },
  rankLeft: {
    flex: 1,
    justifyContent: 'center',
    minHeight: 20,
  },
  rankHelper: {
    fontSize: FONTS.fontSize.medium,
    color: '#d2edf4',
    fontFamily: 'Roboto-Bold',
    marginBottom: 4,
    lineHeight: 20,
  },
  rankEmail: {
    fontSize: FONTS.fontSize.mmedium,
    fontFamily: 'Roboto-Bold',
    color: '#ffffff',
    lineHeight: 22,
  },
  rankDivider: {
    width: 1,
    height: 48,
    backgroundColor: 'rgba(255,255,255,0.4)',
    marginHorizontal: 20,
  },
  rankRight: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  rankValue: {
    fontSize: FONTS.fontSize.xxxlarge,
    color: '#ffffff',
    fontFamily: 'Roboto-Bold',
  },
  loadingMoreContainer: {
    paddingVertical: 16,
    alignItems: 'center',
  },
});
