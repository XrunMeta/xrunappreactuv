import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { View, Text, StyleSheet, Platform, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Header, SegmentedControl, DataList, SafeView } from '../components';
import { COLORS, COMMON_STYLES, FONTS, SIZES } from '../constants';
import { useAppNavigation } from '../navigation';
import { formatCurrency } from '../utils';
import {
  fetchADXRUNEstimateList,
  fetchADXRUNResultList,
  fetchADXRUNTopBanners,
  fetchADXRUNTopBannersSettled,
} from '../services';
import { ADXRUNEstimateItem, ADXRUNResultItem } from '../types';
import { PaginationParams, PaginationResponse, DataListRef } from '../types/pagination';

type TabValue = 'pending' | 'settled';

interface AdEntry {
  id: string | number;
  status: string;
  date: string;
  expectedAdRevenue: string;
  adRevenueSettlement: string;
  expectedAdRevenueColor: string;
  adRevenueSettlementColor: string;
}

export const AdWalletScreen = () => {
  const { t, i18n } = useTranslation();
  const { goBack } = useAppNavigation();
  const [tab, setTab] = useState<TabValue>('pending');
  const [member, setMember] = useState<number | null>(null);
  const [topBannersData, setTopBannersData] = useState<{
    krwamount: string;
    amountasxrun: string;
  }>({
    krwamount: '0 KRW',
    amountasxrun: '0 XRUN',
  });
  const [topBannersLoading, setTopBannersLoading] = useState(false);

  const pendingListRef = useRef<DataListRef>(null);
  const settledListRef = useRef<DataListRef>(null);

  useEffect(() => {
    const getMember = async () => {
      try {
        const resUserData = await AsyncStorage.getItem('userData');
        if (!resUserData) {
          console.log('No userData found in AsyncStorage');
          return;
        }

        const parsedUserData = JSON.parse(resUserData);
        const memberData = parsedUserData.member;
        setMember(memberData);
      } catch (err: any) {
        console.log(`Failed to get member from async storage: ${err}`);
      }
    };

    getMember();
  }, []);

  useEffect(() => {
    if (!member) return;

    const loadTopBanners = async () => {
      setTopBannersLoading(true);
      try {
        let response;
        if (tab === 'pending') {
          response = await fetchADXRUNTopBanners(member);
        } else {
          response = await fetchADXRUNTopBannersSettled(member);
        }

        const responseData = response.data || response;

        if (responseData && responseData.transactions && responseData.transactions.length > 0) {
          const transaction = responseData.transactions[0];

          const krwAmountValue = parseFloat(transaction.krwamount || '0');
          const krwamount = formatCurrency(krwAmountValue, 'KRW');

          const amountAsXrunValue = parseFloat(transaction.amountasxrun || '0').toFixed(2);
          const amountasxrun = `${amountAsXrunValue} XRUN`;

          setTopBannersData({
            krwamount,
            amountasxrun,
          });
        } else {
          setTopBannersData({
            krwamount: '0 KRW',
            amountasxrun: '0 XRUN',
          });
        }
      } catch (error: any) {
        console.error('Failed to fetch top banners:', error);
        setTopBannersData({
          krwamount: '0 KRW',
          amountasxrun: '0 XRUN',
        });
      } finally {
        setTopBannersLoading(false);
      }
    };

    loadTopBanners();
  }, [member, tab]);

  const formatDate = useCallback(
    (utcString: string | undefined): string => {
      if (!utcString) {
        return '-';
      }

      try {

        let utcDateString = utcString.trim();

        const hasTimezone = utcDateString.endsWith('Z') || 
          utcDateString.includes('+') || 
          (utcDateString.length > 10 && utcDateString.slice(10).includes('-'));

        if (!hasTimezone) {

          if (!utcDateString.includes('T')) {
            utcDateString = utcDateString.replace(' ', 'T');
          }
          utcDateString += 'Z'; 
        }

        const localDate = new Date(utcDateString);

        if (isNaN(localDate.getTime())) {
          console.log('❌ 잘못된 날짜 형식:', utcString);
          return '-';
        }

        const year = localDate.getFullYear();
        const month = String(localDate.getMonth() + 1).padStart(2, '0');
        const day = String(localDate.getDate()).padStart(2, '0');
        const hours = String(localDate.getHours()).padStart(2, '0');
        const minutes = String(localDate.getMinutes()).padStart(2, '0');

        const currentLanguage = i18n.language || 'ko';
        if (currentLanguage === 'ko') {

          return `${year}.${month}.${day} ${hours}:${minutes}`;
        } else {

          return `${month}/${day}/${year} ${hours}:${minutes}`;
        }
      } catch (error) {
        console.log('❌ 날짜 파싱 오류:', error, '원본 데이터:', utcString);
        return '-';
      }
    },
    [i18n.language],
  );

  const convertEstimateToAdEntry = useCallback(
    (item: ADXRUNEstimateItem): AdEntry => {
      const status = t('screens.adWallet.pending');
      const date = formatDate(item.datetime);
      console.log('🔍 [convertEstimateToAdEntry] item:', item);

      const amountValue = item.amountasxrun || item.priceasXrun || '0';
      const expectedAdRevenue = `${parseFloat(amountValue).toFixed(2)} XRUN`;
      const adRevenueSettlement = '- XRUN';

      const itemId = item.transaction || item.id;

      return {
        id: itemId,
        status,
        date,
        expectedAdRevenue,
        adRevenueSettlement,
        expectedAdRevenueColor: '#707070',
        adRevenueSettlementColor: '#343434',
      };
    },
    [t, formatDate],
  );

  const convertResultToAdEntry = useCallback(
    (item: ADXRUNResultItem): AdEntry => {

      const status =
        item.action === 3304 ? t('screens.adWallet.settled') : t('screens.adWallet.conditionNotMet');
      const date = formatDate(item.datetime);

      let expectedAdRevenue = '0 XRUN';
      if (item.amount && item.extrastr4) {
        try {
          const amountValue = parseFloat(item.amount);
          const extrastr4Value = parseFloat(item.extrastr4);

          if (!isNaN(amountValue) && !isNaN(extrastr4Value) && extrastr4Value !== 0) {
            const result = (amountValue / extrastr4Value).toFixed(2);
            expectedAdRevenue = `${result} XRUN`;
          }
        } catch (error) {
          console.log('❌ 광고수익 계산 오류:', error);
        }
      }

      let adRevenueSettlement = '0.00 XRUN';
      if (item.amountasxrun) {
        const settlementValue = parseFloat(item.amountasxrun).toFixed(2);
        adRevenueSettlement = `${settlementValue} XRUN`;
      }

      const expectedAdRevenueColor = status === t('screens.adWallet.settled') ? '#111111' : '#707070';
      const adRevenueSettlementColor =
        status === t('screens.adWallet.settled') ? '#111111' : '#343434';

      return {
        id: item.id,
        status,
        date,
        expectedAdRevenue,
        adRevenueSettlement,
        expectedAdRevenueColor,
        adRevenueSettlementColor,
      };
    },
    [t, formatDate],
  );

  const fetchPendingData = useCallback(
    async (params: PaginationParams): Promise<PaginationResponse<AdEntry>> => {
      if (!member) {
        return { data: [], total: 0, hasMore: false };
      }

      try {
        const response = await fetchADXRUNEstimateList(member, params.page);

        const responseData = response.data || response;
        const items = responseData.items || responseData || [];
        const pagination = responseData.pagination;

        const adEntries: AdEntry[] = items.map(convertEstimateToAdEntry);

        let hasMore = false;
        if (pagination) {
          hasMore = pagination.hasNextPage || false;
        } else {
          hasMore = items.length > 0 && items.length >= params.pageSize;
        }

        return {
          data: adEntries,
          total: adEntries.length,
          hasMore,
        };
      } catch (error: any) {
        console.error('Failed to fetch pending data:', error);
        return { data: [], total: 0, hasMore: false };
      }
    },
    [member, convertEstimateToAdEntry],
  );

  const fetchSettledData = useCallback(
    async (params: PaginationParams): Promise<PaginationResponse<AdEntry>> => {
      if (!member) {
        return { data: [], total: 0, hasMore: false };
      }

      try {
        const response = await fetchADXRUNResultList(member, params.page);

        const responseData = response.data || response;
        const items = responseData.items || responseData || [];
        const pagination = responseData.pagination;

        const adEntries: AdEntry[] = items.map(convertResultToAdEntry);

        let hasMore = false;
        if (pagination) {
          hasMore = pagination.hasNextPage || false;
        } else {
          hasMore = items.length > 0 && items.length >= params.pageSize;
        }

        return {
          data: adEntries,
          total: adEntries.length,
          hasMore,
        };
      } catch (error: any) {
        console.error('Failed to fetch settled data:', error);
        return { data: [], total: 0, hasMore: false };
      }
    },
    [member, convertResultToAdEntry],
  );

  const handleTabChange = useCallback((value: TabValue) => {
    setTab(value);

    if (value === 'pending' && pendingListRef.current) {
      pendingListRef.current.reloadData();
    } else if (value === 'settled' && settledListRef.current) {
      settledListRef.current.reloadData();
    }
  }, []);

  const summaryLabel = useMemo(
    () => (tab === 'pending' ? t('screens.adWallet.expectedAmount') : t('screens.adWallet.confirmedAmount')),
    [tab, t],
  );

  const tabs = useMemo(
    () => [
      { label: t('screens.adWallet.pending'), value: 'pending' as TabValue },
      { label: t('screens.adWallet.settled'), value: 'settled' as TabValue },
    ],
    [t],
  );

  const AdEntryItem: React.FC<AdEntry> = (item) => {
    return (
      <View style={styles.adCard}>
        <View style={styles.adCardHeader}>
          <Text style={styles.adCardStatus}>{item.status}</Text>
          <Text style={styles.adCardDate}>{item.date}</Text>
        </View>
        <View style={styles.adCardRow}>
          <Text style={styles.adCardRowLabel}>{t('screens.adWallet.expectedAdRevenue')}</Text>
          <Text style={[styles.adCardRowAmount, { color: item.expectedAdRevenueColor }]}>
            {item.expectedAdRevenue}
          </Text>
        </View>
        <View style={styles.adCardRow}>
          <Text style={styles.adCardRowLabel}>{t('screens.adWallet.adRevenueSettlement')}</Text>
          <Text style={[styles.adCardRowAmount, { color: item.adRevenueSettlementColor }]}>
            {item.adRevenueSettlement}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <SafeView style={styles.container} backgroundColor={"#f7f7fb"}>
      <Header title={t('screens.adWallet.title')} onBackPress={goBack} showBackButton />
      <View style={styles.content}>
        <View style={styles.summaryCard}>
          <LinearGradient
            colors={['#1E3A8A', '#1E40AF', '#1E293B']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.gradient}
          >
            {}
            <View style={styles.backgroundIcon}>
              <Ionicons name="wallet" size={120} color="#FFFFFF" style={styles.iconStyle} />
            </View>

            {}
            <View style={styles.summaryContent}>
              <View style={styles.summaryTitleRow}>
                <View style={styles.summaryTitleLeft}>
                  <View style={styles.iconContainer}>
                    <Ionicons name="wallet" size={20} color="#FFFFFF" />
                  </View>
                  <Text style={styles.summaryLabel}>{summaryLabel}</Text>
                </View>
              </View>
              <Text style={styles.summaryValue}>
                {topBannersLoading ? '...' : topBannersData.amountasxrun}
              </Text>
              <Text style={styles.summaryExtra}>
                {topBannersLoading ? '...' : topBannersData.krwamount}
              </Text>
            </View>
          </LinearGradient>
        </View>

        <SegmentedControl
          options={tabs}
          value={tab}
          onChange={handleTabChange}
          containerStyle={styles.segmentedControl}
          hideIndicator={true}
        />

        <View style={styles.listWrapper}>
          {tab === 'pending' ? (
            <DataList
              ref={pendingListRef}
              fetchData={fetchPendingData}
              ItemComponent={AdEntryItem}
              pageSize={20}
              contentContainerStyle={styles.dataList}
              keyExtractor={(item, index) => `pending-${item.id}-${index}`}
            />
          ) : (
            <DataList
              ref={settledListRef}
              fetchData={fetchSettledData}
              ItemComponent={AdEntryItem}
              pageSize={20}
              contentContainerStyle={styles.dataList}
              keyExtractor={(item, index) => `settled-${item.id}-${index}`}
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
  summaryCard: {
    borderRadius: SIZES.medium,
    shadowColor: '#1E3A8A',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.25,
    shadowRadius: 24,
    elevation: 10,
    height: 140,
    overflow: 'hidden',
  },
  gradient: {
    flex: 1,
    borderRadius: SIZES.medium,
    position: 'relative',
  },
  backgroundIcon: {
    position: 'absolute',
    right: -20,
    top: -20,
    opacity: 0.15,
  },
  iconStyle: {
    transform: [{ rotate: '-15deg' }],
  },
  summaryContent: {
    paddingHorizontal: 24,
    paddingVertical: 24,
    flex: 1,
    justifyContent: 'space-between',
    zIndex: 1,
  },
  summaryTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryTitleLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  summaryLabel: {
    fontSize: FONTS.size.msmall,
    fontFamily: 'Roboto-SemiBold',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
    letterSpacing: 0.3,
  },
  summaryValue: {
    fontSize: FONTS.size.xxxlarge,
    fontFamily: 'Roboto-Bold',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
    letterSpacing: -0.8,
  },
  summaryExtra: {
    fontSize: FONTS.size.medium,
    color: 'rgba(255, 255, 255, 0.9)',
    fontFamily: 'Roboto-Regular',
    opacity: 0.9,
  },
  segmentedControl: {
    marginVertical: SIZES.large,
  },
  listWrapper: {
    flex: 1,
    paddingTop: 0,
    paddingBottom: 0,
  },

  adCard: {
    backgroundColor: COLORS.background,
    borderRadius: SIZES.medium,
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderWidth: 0.5,
    borderColor: '#d5dde0',
    shadowColor: '#00000014',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
    marginBottom: SIZES.small,
    marginTop: 0,

  },
  adCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,

  },
  adCardStatus: {
    fontSize: FONTS.size.msmall,
    fontFamily: 'Roboto-medium',
    color: COLORS.white,
    paddingHorizontal: SIZES.small,
    paddingVertical: 2,
    borderRadius: 4,
    backgroundColor: '#1E3A8A',
  },
  adCardDate: {
    fontSize: FONTS.size.small,
    fontFamily: 'Roboto-regular',
    color: '#666666',
  },
  adCardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  adCardRowLabel: {
    fontSize: FONTS.size.msmall,
    fontFamily: 'Roboto-Regular',
    color: '#333333',
    letterSpacing: -0.5,
  },
  adCardRowAmount: {
    fontSize: FONTS.size.medium,
    fontFamily: 'Roboto-SemiBold',
  },
  dataList: {
    paddingTop: 0,
    paddingBottom: 0,
  },
});
