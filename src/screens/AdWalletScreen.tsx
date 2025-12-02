import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { View, Text, StyleSheet, Platform, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Header, SegmentedControl, DataList } from '../components';
import { COLORS } from '../constants';
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

        let utcDateString = utcString;
        if (!utcDateString.includes('T')) {
          utcDateString = utcDateString.replace(' ', 'T') + 'Z';
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
      const date = formatDate(item.created_at);
      const expectedAdRevenue = item.priceasXrun 
        ? `${parseFloat(item.priceasXrun || '0').toFixed(2)} XRUN` 
        : '0.00 XRUN';
      const adRevenueSettlement = '- XRUN';

      return {
        id: item.id,
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
        item.action === 3307 ? t('screens.adWallet.settled') : t('screens.adWallet.conditionNotMet');
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
    <View style={styles.container}>
      <StatusBar style="dark" />
      <Header title={t('screens.adWallet.title')} onBackPress={goBack} showBackButton />
      <View style={styles.content}>
        <View style={styles.summaryCard}>
          <View style={styles.cardAccentOne} />
          <View style={styles.cardAccentTwo} />
          <Text style={styles.summaryLabel}>{summaryLabel}</Text>
          <Text style={styles.summaryValue}>
            {topBannersLoading ? '...' : topBannersData.amountasxrun}
          </Text>
          <Text style={styles.summaryExtra}>
            {topBannersLoading ? '...' : topBannersData.krwamount}
          </Text>
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
              contentContainerStyle={styles.dataListContent}
              keyExtractor={(item, index) => `pending-${item.id}-${index}`}
            />
          ) : (
            <DataList
              ref={settledListRef}
              fetchData={fetchSettledData}
              ItemComponent={AdEntryItem}
              pageSize={20}
              contentContainerStyle={styles.dataListContent}
              keyExtractor={(item, index) => `settled-${item.id}-${index}`}
            />
          )}
        </View>
      </View>

      {Platform.OS === 'ios' && (
        <View style={styles.homeIndicator}>
          <View style={styles.homeIndicatorBar} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  summaryCard: {
    height: 128,
    borderRadius: 20,
    backgroundColor: '#353A5B',
    paddingHorizontal: 24,
    paddingVertical: 20,
    justifyContent: 'center',
    marginBottom: 24,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 6,
  },
  cardAccentOne: {
    position: 'absolute',
    width: 200,
    height: 200,
    backgroundColor: 'rgba(255,255,255,0.12)',
    top: -40,
    right: -80,
    borderRadius: 100,
  },
  cardAccentTwo: {
    position: 'absolute',
    width: 140,
    height: 140,
    backgroundColor: 'rgba(0,0,0,0.15)',
    bottom: -60,
    left: -40,
    borderRadius: 70,
  },
  summaryLabel: {
    fontSize: 16,
    color: '#E6E6E6',
    fontFamily: 'Roboto-SemiBold',
  },
  summaryValue: {
    fontSize: 32,
    fontFamily: 'Roboto-Bold',
    color: '#FFFFFF',
    marginTop: 8,
  },
  summaryExtra: {
    fontSize: 16,
    color: '#FFFFFF',
    opacity: 0.8,
    marginTop: 4,
  },
  segmentedControl: {
    width: '100%',
    maxWidth: 780,
    alignSelf: 'center',
    marginBottom: 24,
  },
  listWrapper: {
    flex: 1,
    width: '100%',
    maxWidth: 780,
    alignSelf: 'center',
  },
  dataListContent: {
    paddingBottom: 32,
    gap: 12,
  },
  adCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    paddingHorizontal: 20,
    paddingVertical: 16,
    shadowColor: '#3629B7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.07,
    shadowRadius: 30,
    elevation: 5,
    marginBottom: 12,
  },
  adCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  adCardStatus: {
    fontSize: 16,
    fontFamily: 'Roboto-SemiBold',
    color: '#343434',
  },
  adCardDate: {
    fontSize: 16,
    fontFamily: 'Roboto-SemiBold',
    color: '#343434',
  },
  adCardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  adCardRowLabel: {
    fontSize: 12,
    fontFamily: 'Roboto-Regular',
    color: '#979797',
  },
  adCardRowAmount: {
    fontSize: 12,
    fontFamily: 'Roboto-SemiBold',
  },
  homeIndicator: {
    height: 34,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 9,
  },
  homeIndicatorBar: {
    width: 134,
    height: 5,
    backgroundColor: '#10192d',
    borderRadius: 100,
    marginBottom: 9,
  },
});
