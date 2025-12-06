import React, { useMemo, useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, ScrollView, ActivityIndicator, Text, FlatList } from 'react-native';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Header, ReferralStatsCard, SegmentedControl, SafeView } from '../components';
import { useAppNavigation, ROUTES } from '../navigation';
import { COLORS, COMMON_STYLES, LANG } from '../constants';
import { getSettlementList, getSettlementAmount } from '../services';
import { SettlementListItem } from '../types';
import { formatXrunAmount, formatWonAmount, calculateWonEquivalent } from '../utils';

interface TransformedSettlementData {
  id: string;
  type: string; 
  description: string;
  amount: string; 
  date: string;
  transaction: number;
}

const formatDateTime = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}.${month}.${day} ${hours}:${minutes}`;
  } catch {
    return dateString;
  }
};

const transformSettlementData = (
  apiData: SettlementListItem[],
  t: (key: string) => string,
): TransformedSettlementData[] => {

  const seen = new Set<string>();
  const seenIds = new Set<string>(); 

  return apiData
    .map((item, index) => {

      const uniqueKey = `${item.transaction}_${item.datetime}_${index}`;

      if (seen.has(uniqueKey)) {
        return null;
      }
      seen.add(uniqueKey);

      const description = item.description || item.actiontext || item.extratext || t('screens.referralSettlement.settlementDescription');

      let finalId = `settlement_${item.transaction}_${index}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      let retryCount = 0;
      while (seenIds.has(finalId) && retryCount < 10) {
        finalId = `settlement_${item.transaction}_${index}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        retryCount++;
      }
      seenIds.add(finalId);

      return {
        id: finalId,
        type: item.email || '',
        description,
        amount: `+${formatXrunAmount(item.amountasxrun)} XRUN`,
        date: formatDateTime(item.datetime),
        transaction: item.transaction,
      };
    })
    .filter((item): item is TransformedSettlementData => item !== null);
};

const ITEMS_PER_PAGE = 15;

export const ReferralSettlementScreen = () => {
  const { navigate } = useAppNavigation();
  const [memberId, setMemberId] = useState<number | null>(null);
  const [settlementData, setSettlementData] = useState<TransformedSettlementData[]>([]);
  const [currentData, setCurrentData] = useState<TransformedSettlementData[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [totalRevenue, setTotalRevenue] = useState<string>('0 XRUN');
  const [totalRevenueWon, setTotalRevenueWon] = useState<string>('₩0');
  const [gopaxPrice, setGopaxPrice] = useState<number>(0); 

  const { t } = useTranslation();
  const segmentedOptions = useMemo(
    () => [
      { label: t('screens.referralSettlement.group'), value: 'group' },
      { label: t('screens.referralSettlement.settlement'), value: 'settlement' },
      { label: 'Rank', value: 'rank' }, 
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
        }
      } catch (error) {
        console.error('[정산] 사용자 정보 로드 실패:', error);
      }
    };
    loadUserData();
  }, []);

  const fetchSettlementData = useCallback(async (member: number) => {
    try {
      setLoading(true);

      const [resultList, resultAmount] = await Promise.all([
        getSettlementList(member, navigate),
        getSettlementAmount(member, navigate),
      ]);

      if (
        resultList.status === 'success' &&
        resultAmount.status === 'success'
      ) {
        const transformedData = transformSettlementData(resultList.data, t);
        setSettlementData(transformedData);

        const totalAmount = resultAmount.data[0]?.amount || '0';
        const totalAmountNum = typeof totalAmount === 'string' ? parseFloat(totalAmount) : totalAmount;
        const formattedAmount = isNaN(totalAmountNum) ? '0' : totalAmountNum.toFixed(2);
        setTotalRevenue(`${formattedAmount} XRUN`);

        const price = gopaxPrice > 0 ? gopaxPrice : 176; 
        console.log('[정산] 원화 계산:', { totalAmount, totalAmountNum, price });

        const wonEquivalent = calculateWonEquivalent(totalAmountNum, price);
        console.log('[정산] 원화 환산 결과:', wonEquivalent);

        const formattedWon = formatWonAmount(wonEquivalent);
        console.log('[정산] 원화 포맷팅 결과:', formattedWon);
        setTotalRevenueWon(formattedWon);

        const initialItems = transformedData.slice(0, ITEMS_PER_PAGE);
        setCurrentData(initialItems);
        setCurrentPage(1);
        setHasMore(transformedData.length > ITEMS_PER_PAGE);
      } else {
        console.error(
          '정산 데이터 조회 실패:',
          resultList.message || resultAmount.message,
        );
        setSettlementData([]);
        setCurrentData([]);
        setTotalRevenue('0 XRUN');
        setTotalRevenueWon('₩0');
        setHasMore(false);
      }
    } catch (error) {
      console.error('[정산] 정산 데이터 조회 실패:', error);
      setSettlementData([]);
      setCurrentData([]);
      setTotalRevenue('0 XRUN');
      setTotalRevenueWon('₩0');
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  }, [navigate, gopaxPrice]);

  useEffect(() => {
    if (memberId) {
      fetchSettlementData(memberId);
    }
  }, [memberId, fetchSettlementData]);

  const loadMoreData = useCallback(() => {
    if (isLoadingMore || !hasMore) return;

    setIsLoadingMore(true);

    setTimeout(() => {
      const startIndex = currentPage * ITEMS_PER_PAGE;
      const endIndex = startIndex + ITEMS_PER_PAGE;
      const newItems = settlementData.slice(startIndex, endIndex);

      setCurrentData((prev) => {
        const existingIds = new Set(prev.map(item => item.id));
        const uniqueNewItems = newItems.filter(item => !existingIds.has(item.id));
        return [...prev, ...uniqueNewItems];
      });
      setCurrentPage((prev) => prev + 1);
      setHasMore(endIndex < settlementData.length);
      setIsLoadingMore(false);
    }, 200);
  }, [isLoadingMore, hasMore, currentPage, settlementData]);

  const handleSegmentChange = (value: typeof segmentedOptions[number]['value']) => {
    if (value === 'group') {
      navigate(ROUTES.referralMyGroup);
    } else if (value === 'rank') {
      navigate(ROUTES.referralRank);
    }
  };

  const renderSettlementItem = ({ item }: { item: TransformedSettlementData }) => {
    return (
      <SafeView style={styles.listItem}>
        <View style={styles.listItemRow}>
          <Text style={styles.refTypeText}>{item.type}</Text>
          <Text style={styles.dateText}>{item.date}</Text>
        </View>
        <View style={styles.listItemRow}>
          <Text
            style={[styles.descriptionText, { flex: 1, marginRight: 10 }]}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {item.description}
          </Text>
          <Text style={styles.amountText}>{item.amount}</Text>
        </View>
      </SafeView>
    );
  };

  return (
    <SafeView style={styles.container}>
      <Header title={t('screens.referralSettlement.title')} />
      <View style={styles.content}>
        <View style={styles.wrapper}>
          <View style={styles.topRow}>
            <ReferralStatsCard
              title={t('screens.referralSettlement.income')}
              subtitle={t('screens.referralSettlement.settlementIn45Days')}
              value={totalRevenue}
              helperText={totalRevenueWon}
            />
          </View>

          <SegmentedControl
            options={segmentedOptions}
            value="settlement"
            onChange={handleSegmentChange}
            containerStyle={styles.segmented}
            hideIndicator={true}
          />
        </View>

        <View style={styles.listContainer}>
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={COLORS.buttonPrimary} />
            </View>
          ) : currentData.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>{t('screens.referralSettlement.noSettlementHistory')}</Text>
            </View>
          ) : (
            <FlatList
              data={currentData}
              renderItem={renderSettlementItem}
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
              contentContainerStyle={styles.listContent}
            />
          )}
        </View>
      </View>
    </SafeView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f7fb',
  },
  content: {
    flex: 1,
    ...COMMON_STYLES.scrollContent,
  },
  wrapper: {
    width: '100%',
    maxWidth: 780,
    alignSelf: 'center',
  },
  topRow: {
    position: 'relative',
    marginBottom: 16,
  },
  segmented: {
    marginTop: 0,
    marginBottom: 0,
  },
  listContainer: {
    flex: 1,
    width: '100%',
    maxWidth: 780,
    alignSelf: 'center',
    paddingHorizontal: 24,
    paddingTop: 0,
  },
  listContent: {
    paddingBottom: 32,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 14,
    fontFamily: 'Roboto-Regular',
    color: '#7d7e83',
  },
  listItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginBottom: 14,
    shadowColor: '#00000014',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
    flexDirection: 'column',
    gap: 20,
  },
  listItemRow: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
  },
  refTypeText: {
    fontSize: 14,
    fontFamily: 'Roboto-SemiBold',
    color: '#343434',
  },
  dateText: {
    fontSize: 14,
    fontFamily: 'Roboto-Regular',
    color: '#707070',
  },
  descriptionText: {
    fontSize: 14,
    fontFamily: 'Roboto-Regular',
    color: '#343434',
  },
  amountText: {
    fontSize: 14,
    fontFamily: 'Roboto-SemiBold',
    color: '#1f6880',
  },
  loadingMoreContainer: {
    paddingVertical: 16,
    alignItems: 'center',
  },
});
