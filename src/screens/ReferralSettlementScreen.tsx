import React, { useMemo, useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, ScrollView, ActivityIndicator, Text, FlatList, TouchableOpacity, Image } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useTranslation } from 'react-i18next';
import { Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Header, ReferralStatsCard, SegmentedControl, SafeView } from '../components';
import { useAppNavigation, ROUTES } from '../navigation';
import { COLORS, COMMON_STYLES, LANG, SIZES, FONTS } from '../constants';
import { getReferralIncome } from '../services';
import type { ReferralIncomeItem } from '../services';
import { SettlementListItem } from '../types';
import { formatXrunAmount, formatWonAmount, calculateWonEquivalent, shareReferralLink } from '../utils';
import { useAlertDialog } from '../context/AlertDialogContext';

interface TransformedSettlementData {
  id: string;
  type: string; 
  description: string;
  amount: string; 
  date: string;
  transaction: number;
  status?: 'pending' | 'sent' | string; 
  fromName?: string | null; 
}

const SOURCE_LABEL: Record<string, string> = {
  nas: 'AR 광고 (나스미디어)',
  nasmedia: 'AR 광고 (나스미디어)',
  pocr: 'AR 광고 (포인트클릭)',
  pointclick: 'AR 광고 (포인트클릭)',
  ayet: 'Xplay Zone 1',
  maf: 'Xplay Zone 2',
  mychips: 'Xplay Zone 2',
  recommand: '추천 가입',
  attendance: '출석체크',
};

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
        amount: `+${parseFloat(String(item.amountasxrun)).toFixed(2)} XRUN`,
        date: formatDateTime(item.datetime),
        transaction: item.transaction,
      };
    })
    .filter((item): item is TransformedSettlementData => item !== null);
};

const ITEMS_PER_PAGE = 15;

export const ReferralSettlementScreen = () => {
  const { navigate } = useAppNavigation();
  const { showAlert } = useAlertDialog();
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
  const [userEmail, setUserEmail] = useState<string>('');

  const { t } = useTranslation();

  const handleShare = async () => {
    if (!userEmail) {
      await showAlert(t('screens.referralMyGroup.shareFailed'), t('screens.referralMyGroup.shareFailedMessage'));
      return;
    }
    await shareReferralLink(
      t,
      { email: userEmail },
      showAlert,
      navigate,
    );
  };
  const segmentedOptions = useMemo(
    () => [
      { label: t('screens.referralSettlement.group'), value: 'group' },
      { label: t('screens.referralSettlement.settlement'), value: 'settlement' },
      { label: t('screens.referralSettlement.rank'), value: 'rank' },
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
        console.error('[정산] 사용자 정보 로드 실패:', error);
      }
    };
    loadUserData();
  }, []);

  const fetchSettlementData = useCallback(async (member: number) => {
    try {
      setLoading(true);

      console.log('═══════════════════════════════════════════');
      console.log('[정산 디버그] fetchSettlementData 시작, member:', member);
      console.log('═══════════════════════════════════════════');

      const resultRef = await getReferralIncome(member, navigate);

      console.log('[정산 디버그] 백엔드 응답 status:', resultRef.status);
      console.log('[정산 디버그] 백엔드 응답 message:', resultRef.message);
      console.log('[정산 디버그] 백엔드 응답 data 개수:', resultRef.data?.length ?? 0);
      if (resultRef.data && resultRef.data.length > 0) {
        console.log('[정산 디버그] 첫 행 샘플:', JSON.stringify(resultRef.data[0], null, 2));
        console.log('[정산 디버그] source_type 분포:', resultRef.data.reduce((acc: Record<string, number>, item: any) => {
          const s = item.source_type ?? 'NULL';
          acc[s] = (acc[s] || 0) + 1;
          return acc;
        }, {}));
        console.log('[정산 디버그] status 분포:', resultRef.data.reduce((acc: Record<string, number>, item: any) => {
          const s = item.status ?? 'NULL';
          acc[s] = (acc[s] || 0) + 1;
          return acc;
        }, {}));
        console.log('[정산 디버그] xrun_amount 합계 (Number 변환 전):',
          resultRef.data.reduce((sum: number, item: any) => sum + (Number(item.xrun_amount) || 0), 0));
      } else {
        console.log('[정산 디버그] ⚠️ 백엔드 응답 data 가 비어있음');
      }

      if (resultRef.status === 'success') {

        const rows: TransformedSettlementData[] = (resultRef.data || []).map((item: ReferralIncomeItem, idx: number) => {
          const label = SOURCE_LABEL[item.source_type] || item.source_type || '레퍼럴 분배';
          return {
            id: `ref_${item.id}_${idx}`,
            type: label,
            description: label,
            amount: `+${(Number(item.xrun_amount) || 0).toFixed(2)} XRUN`,
            date: formatDateTime(item.created_at),
            transaction: item.id,
            status: item.status,
            fromName: item.from_name || (item.from_member ? `#${item.from_member}` : null),
          };
        });
        console.log('[정산 디버그] 변환된 rows 개수:', rows.length);
        if (rows.length > 0) console.log('[정산 디버그] 변환 첫 행:', JSON.stringify(rows[0], null, 2));
        setSettlementData(rows);

        const totalAmountNum = (resultRef.data || []).reduce(
          (sum: number, item: ReferralIncomeItem) => sum + (Number(item.xrun_amount) || 0),
          0
        );
        const formattedAmount = totalAmountNum.toFixed(2);
        setTotalRevenue(`${formattedAmount} XRUN`);

        const price = gopaxPrice > 0 ? gopaxPrice : 176; 
        console.log('[정산] 원화 계산:', { totalAmountNum, price });

        const wonEquivalent = calculateWonEquivalent(totalAmountNum, price);
        console.log('[정산] 원화 환산 결과:', wonEquivalent);

        const formattedWon = formatWonAmount(wonEquivalent);
        console.log('[정산] 원화 포맷팅 결과:', formattedWon);
        setTotalRevenueWon(formattedWon);

        const initialItems = rows.slice(0, ITEMS_PER_PAGE);
        setCurrentData(initialItems);
        setCurrentPage(1);
        setHasMore(rows.length > ITEMS_PER_PAGE);
        console.log('[정산 디버그] ✅ 화면 표시 완료 — 총',
          formattedAmount, 'XRUN /', rows.length, '건 /', formattedWon);
        console.log('═══════════════════════════════════════════');
      } else {
        console.error('[정산 디버그] ❌ 백엔드 status !== success — message:', resultRef.message);
        setSettlementData([]);
        setCurrentData([]);
        setTotalRevenue('0 XRUN');
        setTotalRevenueWon('₩0');
        setHasMore(false);
      }
    } catch (error: any) {
      console.error('[정산 디버그] ❌ 예외 발생');
      console.error('  message:', error?.message);
      console.error('  response status:', error?.response?.status);
      console.error('  response data:', JSON.stringify(error?.response?.data ?? null));
      console.error('  stack:', error?.stack);
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
    const isPaid = item.status === 'sent';
    const paidColor = '#cccccc';
    return (
      <View style={[styles.listItem, isPaid && { opacity: 0.7 }]}>
        <View style={styles.listItemRow}>
          {item.description ? <Text
            style={[
              styles.descriptionText,
              isPaid && { color: paidColor },
            ]}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {item.description}
            {item.fromName ? <Text style={[styles.fromText, isPaid && { color: paidColor }]}>{`  · ${item.fromName} 님`}</Text> : null}
          </Text> : null}
          {item.date ? <Text style={[styles.dateText, isPaid && { color: paidColor }]}>{item.date}</Text> : null}
        </View>
        <View style={styles.listItemRow2}>
          <Text style={[
            styles.statusBadge,
            isPaid ? styles.statusPaid : styles.statusPending,
          ]}>
            {isPaid ? (t('screens.referralSettlement.paid') || '지급 완료') : (t('screens.referralSettlement.pending') || '지급 대기')}
          </Text>
          {item.amount ? <Text style={[styles.amountText, isPaid && { color: paidColor }]}>{item.amount}</Text> : null}
        </View>
      </View>
    );
  };

  return (
    <SafeView style={styles.container} backgroundColor={"#f7f7fb"}>
      <Header
        title={t('screens.referralSettlement.title')}
        rightComponent={
          <TouchableOpacity style={styles.headerShareButton} onPress={handleShare} activeOpacity={0.7}>
            <Feather name="share-2" size={18} color={COLORS.headerText} />
            <Text style={styles.headerShareText}>{t('screens.referralSettlement.referralLabel')}</Text>
          </TouchableOpacity>
        }
      />
      <View style={styles.content}>
        <ReferralStatsCard
          title={t('screens.referralSettlement.income')}
          subtitle={t('screens.referralSettlement.settlementIn45Days')}
          value={totalRevenue}
          helperText={totalRevenueWon}
        />

        <SegmentedControl
          options={segmentedOptions}
          value="settlement"
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
    paddingBottom: 0,
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
    fontSize: FONTS.size.msmall,
    fontFamily: 'Roboto-Regular',
    color: '#7d7e83',
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: SIZES.medium,
    paddingVertical: SIZES.large,
    borderRadius: SIZES.small,
    backgroundColor: '#FFFFFF',
    shadowColor: '#00000014',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: SIZES.small,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#ededed',
    marginBottom: SIZES.xsmall,
  },
  listItemRow: {
    flex: 1,
    flexDirection: 'column',
    gap: 4,
  },
  listItemRow2: {
    flex: 1,
    flexDirection: 'column',
    gap: 4,
    alignItems: 'flex-end',
  },

  statusBadge: {
    fontSize: 10,
    fontFamily: 'Roboto-Bold',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    overflow: 'hidden',
  },
  statusPaid: {
    backgroundColor: '#eeeeee',
    color: '#9a9a9a',
  },
  statusPending: {
    backgroundColor: '#fff4e5',
    color: '#e07b00',
  },
  refTypeText: {
    fontSize: FONTS.size.small,
    fontFamily: 'Roboto-SemiBold',
    color: COLORS.white,
    width: 'auto',
    backgroundColor: COLORS.info,
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 1,
    borderRadius: 4,
  },
  dateText: {
    fontSize: FONTS.size.small,
    fontFamily: 'Roboto-Regular',
    color: '#707070',
  },
  descriptionText: {
    fontSize: FONTS.size.msmall,
    fontFamily: 'Roboto-Regular',
    color: '#343434',
    letterSpacing: -1,
  },
  fromText: {
    fontSize: FONTS.size.small,
    fontFamily: 'Roboto-Regular',
    color: '#707070',
  },
  amountText: {
    fontSize: FONTS.size.medium,
    fontFamily: 'Roboto-SemiBold',
    color: COLORS.buttonPrimary,
  },
  loadingMoreContainer: {
    paddingVertical: 16,
  },
  headerShareButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerShareText: {
    marginTop: 2,
    fontSize: FONTS.size.xxsmall,
    fontFamily: 'Roboto-Medium',
    color: COLORS.headerText,
    lineHeight: 12,
  },
});
