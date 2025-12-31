import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { View, Text, StyleSheet, Platform, ActivityIndicator, TouchableOpacity, Modal } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BigNumber from 'bignumber.js';
import { Header, SegmentedControl, DataList, SafeView, Dialog } from '../components';
import { COLORS, COMMON_STYLES, FONTS, SIZES } from '../constants';
import { useAppNavigation } from '../navigation';
import { formatCurrency, showToast, getColdStartResult } from '../utils';
import {
  fetchADXRUNEstimateList,
  fetchADXRUNResultList,
  fetchADXRUNTopBanners,
  fetchADXRUNTopBannersSettled,
  fetchQuestList,
  checkQuestUser,
  joinQuest,
} from '../services';
import { loadAndShowRewardedAd, getAdMobMediationGroupId, isAdMobReady } from '../services/admob';
import { collectDeviceInfo } from '../utils/napApiUtils';
import { ADXRUNEstimateItem, ADXRUNResultItem, QuestItem } from '../types';
import { PaginationParams, PaginationResponse, DataListRef } from '../types/pagination';

type TabValue = 'pending' | 'quest' | 'settled';

interface AdEntry {
  id: string | number;
  status: string;
  date: string;
  expectedAdRevenue: string;
  adRevenueSettlement: string;
  expectedAdRevenueColor: string;
  adRevenueSettlementColor: string;
  title?: string; 
  description?: string; 
  rewardDescription?: string; 
  extrastr3?: string; 
  hasAttended?: boolean; 
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
  const [gopaxPrice, setGopaxPrice] = useState<number | null>(null);
  const [attendanceCheckVisible, setAttendanceCheckVisible] = useState(false);
  const [canReward, setCanReward] = useState<boolean | null>(null);
  const [hasAttended, setHasAttended] = useState<boolean | null>(null);
  const [attendanceCheckLoading, setAttendanceCheckLoading] = useState(false);
  const [isJoiningQuest, setIsJoiningQuest] = useState(false);
  const [isColdStart, setIsColdStart] = useState<boolean | null>(null);

  const pendingListRef = useRef<DataListRef>(null);
  const questListRef = useRef<DataListRef>(null);
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
    const checkAppState = async () => {
      try {
        const result = await getColdStartResult();
        if (result) {
          setIsColdStart(result.isColdStart);
        } else {

          setIsColdStart(true);
        }
      } catch (error) {
        console.error('[AdWallet] 앱 상태 확인 실패:', error);
        setIsColdStart(true);
      }
    };

    checkAppState();
  }, []);

  useEffect(() => {
    const loadGopaxPrice = async () => {
      try {
        const priceDataStr = await AsyncStorage.getItem('xrungopaxprice');
        if (priceDataStr) {
          const priceData = JSON.parse(priceDataStr);
          const price = priceData?.data?.gopaxPrice || null;
          setGopaxPrice(price);
          console.log('[AdWallet] 고팍스 XRUN 가격 로드:', price);
        }
      } catch (error) {
        console.error('[AdWallet] 고팍스 XRUN 가격 로드 오류:', error);
      }
    };

    loadGopaxPrice();
  }, []);

  useEffect(() => {
    if (!member) return;

    const loadTopBanners = async () => {
      setTopBannersLoading(true);
      try {
        let response;
        if (tab === 'pending' || tab === 'quest') {
          response = await fetchADXRUNTopBanners(member);
        } else {
          response = await fetchADXRUNTopBannersSettled(member);
        }

        const responseData = response.data || response;

        if (responseData && responseData.transactions && responseData.transactions.length > 0) {
          const transaction = responseData.transactions[0];

          const amountAsXrunValue = parseFloat(transaction.amountasxrun || '0').toFixed(2);
          const amountasxrun = `${amountAsXrunValue} XRUN`;

          let krwamount = '0 KRW';
          if (gopaxPrice && transaction.amountasxrun) {
            try {
              const balanceAmount = new BigNumber(transaction.amountasxrun || '0');
              const krwAmount = balanceAmount.multipliedBy(gopaxPrice);

              const formatted = krwAmount.toFixed(0);
              const parts = formatted.split('.');
              const integerPart = parts[0];
              const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

              krwamount = `KRW ${formattedInteger}`;
            } catch (error) {
              console.error('[AdWallet] KRW 금액 계산 오류:', error);

              const krwAmountValue = parseFloat(transaction.krwamount || '0');
              krwamount = formatCurrency(krwAmountValue, 'KRW');
            }
          } else {

            const krwAmountValue = parseFloat(transaction.krwamount || '0');
            krwamount = formatCurrency(krwAmountValue, 'KRW');
          }

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
  }, [member, tab, gopaxPrice]);

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
        extrastr3: item.extrastr3,
      };
    },
    [t, formatDate],
  );

  const convertQuestToAdEntry = useCallback(
    (item: QuestItem): AdEntry => {
      const status = t('screens.adWallet.quest');

      const date = formatDate(item.start_date || item.created_at);

      const rewardAmount = typeof item.reward_amount_asxrun === 'string' 
        ? parseFloat(item.reward_amount_asxrun) 
        : item.reward_amount_asxrun;
      const expectedAdRevenue = `${rewardAmount.toFixed(2)} XRUN`;
      const adRevenueSettlement = '- XRUN';

      return {
        id: item.id,
        status,
        date,
        expectedAdRevenue,
        adRevenueSettlement,
        expectedAdRevenueColor: '#707070',
        adRevenueSettlementColor: '#343434',
        title: item.title,
        description: item.description,
        rewardDescription: item.reward_description,
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

  const fetchQuestData = useCallback(
    async (params: PaginationParams): Promise<PaginationResponse<AdEntry>> => {
      try {
        const response = await fetchQuestList();

        const questItems = response.data || [];

        const adEntries: AdEntry[] = questItems.map(convertQuestToAdEntry);

        if (member) {
          const questIdOneEntry = adEntries.find(
            (entry) => entry.id === 1 || entry.id === '1'
          );

          if (questIdOneEntry) {
            try {
              const checkResponse = await checkQuestUser(member);
              const responseHasAttended = checkResponse.data?.hasAttended ?? false;
              questIdOneEntry.hasAttended = responseHasAttended;
              console.log('[AdWallet] 퀘스트 id 1 출석체크 상태:', responseHasAttended);
            } catch (error) {
              console.error('[AdWallet] 출석체크 상태 확인 오류:', error);

            }
          }
        }

        return {
          data: adEntries,
          total: adEntries.length,
          hasMore: false,
        };
      } catch (error: any) {
        console.error('Failed to fetch quest data:', error);
        return { data: [], total: 0, hasMore: false };
      }
    },
    [convertQuestToAdEntry, member],
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
    } else if (value === 'quest' && questListRef.current) {
      questListRef.current.reloadData();
    } else if (value === 'settled' && settledListRef.current) {
      settledListRef.current.reloadData();
    }
  }, []);

  const handleQuestItemPress = useCallback(async (item: AdEntry) => {

    try {
      await AsyncStorage.setItem('isColdStart', 'false');
      setIsColdStart(false);
      console.log('[AdWallet] 퀘스트 클릭으로 앱 상태를 웜스타트로 변경');
    } catch (error) {
      console.error('[AdWallet] 앱 상태 변경 실패:', error);
    }

    if (tab === 'quest' && (item.id === 1 || item.id === '1')) {
      if (!member) {
        console.error('[AdWallet] member 정보가 없습니다.');
        return;
      }

      setAttendanceCheckLoading(true);
      try {
        const response = await checkQuestUser(member);
        const responseHasAttended = response.data?.hasAttended ?? false;
        setHasAttended(responseHasAttended);

        if (responseHasAttended) {
          setCanReward(false);
          setAttendanceCheckVisible(true);
        } else {
          setCanReward(response.data?.canReward ?? false);
          setAttendanceCheckVisible(true);
        }
      } catch (error) {
        console.error('[AdWallet] 출석 체크 조회 오류:', error);

        setHasAttended(false);
        setCanReward(true);
        setAttendanceCheckVisible(true);
      } finally {
        setAttendanceCheckLoading(false);
      }
    }
  }, [tab, member]);

  const handleDialogClose = useCallback(() => {

    if (isJoiningQuest) {
      return;
    }
    setAttendanceCheckVisible(false);
    setCanReward(null);
    setHasAttended(null);
  }, [isJoiningQuest]);

  const handleAttendanceCheckConfirm = useCallback(async () => {

    if (isJoiningQuest) {
      return;
    }

    if (hasAttended === true) {
      setAttendanceCheckVisible(false);
      setCanReward(null);
      setHasAttended(null);
      return;
    }

    if (canReward && member) {
      setIsJoiningQuest(true);

      if (isAdMobReady()) {
        try {

          const deviceInfo = await collectDeviceInfo();

          await loadAndShowRewardedAd(
            getAdMobMediationGroupId(),
            member.toString(),
            deviceInfo,
            async (reward) => {
              console.log('[AdWallet] 출석체크 Pangle 광고 보상 수령:', reward);

              try {
                const response = await joinQuest(
                  {
                    quest_id: 1,
                    member,
                  },
                  undefined, 
                );

                if (response.status === 'success') {
                  showToast(t('screens.adWallet.attendanceCheckCompletedToast'));
                  setAttendanceCheckVisible(false);
                  setCanReward(null);
                  setHasAttended(null);

                  if (questListRef.current) {
                    questListRef.current.reloadData();
                  }
                } else {
                  showToast(t('screens.adWallet.attendanceCheckRetryToast'));
                }
              } catch (error) {
                console.error('[AdWallet] 출석 체크 참여 오류:', error);
                showToast(t('screens.adWallet.attendanceCheckRetryToast'));
              } finally {
                setIsJoiningQuest(false);
              }
            },
            () => {

              console.log('[AdWallet] 출석체크 Pangle 광고 닫힘 (시청 미완료)');
              setIsJoiningQuest(false);
            },
            (error) => {

              console.error('[AdWallet] 출석체크 Pangle 광고 로드 실패:', error);
              showToast('광고를 불러올 수 없습니다. 출석체크를 진행합니다.');

              joinQuest(
                {
                  quest_id: 1,
                  member,
                },
                undefined,
              )
                .then((response) => {
                  if (response.status === 'success') {
                    showToast(t('screens.adWallet.attendanceCheckCompletedToast'));
                    setAttendanceCheckVisible(false);
                    setCanReward(null);
                    setHasAttended(null);
                    if (questListRef.current) {
                      questListRef.current.reloadData();
                    }
                  } else {
                    showToast(t('screens.adWallet.attendanceCheckRetryToast'));
                  }
                })
                .catch((error) => {
                  console.error('[AdWallet] 출석 체크 참여 오류:', error);
                  showToast(t('screens.adWallet.attendanceCheckRetryToast'));
                })
                .finally(() => {
                  setIsJoiningQuest(false);
                });
            }
          );
        } catch (error) {
          console.error('[AdWallet] 출석체크 Pangle 광고 표시 오류:', error);

          try {
            const response = await joinQuest(
              {
                quest_id: 1,
                member,
              },
              undefined,
            );

            if (response.status === 'success') {
              showToast(t('screens.adWallet.attendanceCheckCompletedToast'));
              setAttendanceCheckVisible(false);
              setCanReward(null);
              setHasAttended(null);
              if (questListRef.current) {
                questListRef.current.reloadData();
              }
            } else {
              showToast(t('screens.adWallet.attendanceCheckRetryToast'));
            }
          } catch (questError) {
            console.error('[AdWallet] 출석 체크 참여 오류:', questError);
            showToast(t('screens.adWallet.attendanceCheckRetryToast'));
          } finally {
            setIsJoiningQuest(false);
          }
        }
      } else {

        try {
          const response = await joinQuest(
            {
              quest_id: 1,
              member,
            },
            undefined,
          );

          if (response.status === 'success') {
            showToast(t('screens.adWallet.attendanceCheckCompletedToast'));
            setAttendanceCheckVisible(false);
            setCanReward(null);
            setHasAttended(null);
            if (questListRef.current) {
              questListRef.current.reloadData();
            }
          } else {
            showToast(t('screens.adWallet.attendanceCheckRetryToast'));
          }
        } catch (error) {
          console.error('[AdWallet] 출석 체크 참여 오류:', error);
          showToast(t('screens.adWallet.attendanceCheckRetryToast'));
        } finally {
          setIsJoiningQuest(false);
        }
      }
    } else {

      setAttendanceCheckVisible(false);
      setCanReward(null);
      setHasAttended(null);
    }
  }, [canReward, hasAttended, member, t, isJoiningQuest]);

  const summaryLabel = useMemo(
    () => (tab === 'pending' || tab === 'quest' ? t('screens.adWallet.expectedAmount') : t('screens.adWallet.confirmedAmount')),
    [tab, t],
  );

  const tabs = useMemo(
    () => [
      { label: t('screens.adWallet.pending'), value: 'pending' as TabValue },
      { label: t('screens.adWallet.quest'), value: 'quest' as TabValue },
      { label: t('screens.adWallet.settled'), value: 'settled' as TabValue },
    ],
    [t],
  );

  const AdEntryItem: React.FC<AdEntry & { onPress?: () => void }> = (item) => {

    const isQuest = !!item.title;
    const { onPress, ...itemData } = item;

    const isQuestIdOne = isQuest && (item.id === 1 || item.id === '1');

    const questHasAttended = isQuestIdOne ? item.hasAttended : undefined;

    const cardStyle = isQuestIdOne
      ? questHasAttended === true
        ? styles.adCard 
        : isColdStart === true
        ? [styles.adCard, styles.questIdOneColdStart] 
        : isColdStart === false
        ? [styles.adCard, styles.questIdOneWarmStart] 
        : [styles.adCard, styles.questIdOneColdStart] 
      : styles.adCard;

    const disabledColor = '#cccccc';

    return (
      <TouchableOpacity
        style={cardStyle}
        onPress={onPress}
        activeOpacity={0.7}
      >
        <View style={styles.adCardHeader}>
          <Text style={[
            styles.adCardStatus,
            questHasAttended === true && { backgroundColor: disabledColor, color: '#ffffff' }
          ]}>
            {item.status}
          </Text>
          <Text style={[
            styles.adCardDate,
            questHasAttended === true && { color: disabledColor }
          ]}>
            {item.date}
          </Text>
        </View>
        {isQuest && item.title && (
          <View style={styles.questTitleContainer}>
            <Text style={[
              styles.questTitle,
              questHasAttended === true && { color: disabledColor }
            ]}>
              {item.title}
            </Text>
            {item.description && (
              <Text style={[
                styles.questDescription,
                questHasAttended === true && { color: disabledColor }
              ]}>
                {item.description}
              </Text>
            )}
          </View>
        )}
        <View style={styles.adCardRow}>
          <Text style={[
            styles.adCardRowLabel,
            questHasAttended === true && { color: disabledColor }
          ]}>
            {isQuest 
              ? t('screens.adWallet.rewardAmount') 
              : item.extrastr3 === '출석보상' 
                ? t('screens.adWallet.attendanceCheckCompletedReward')
                : t('screens.adWallet.expectedAdRevenue')}
          </Text>
          <Text style={[
            styles.adCardRowAmount,
            { color: item.expectedAdRevenueColor },
            questHasAttended === true && { color: disabledColor }
          ]}>
            {item.expectedAdRevenue}
          </Text>
        </View>
        {!isQuest && item.extrastr3 !== '출석보상' && (
        <View style={styles.adCardRow}>
          <Text style={styles.adCardRowLabel}>{t('screens.adWallet.adRevenueSettlement')}</Text>
          <Text style={[styles.adCardRowAmount, { color: item.adRevenueSettlementColor }]}>
            {item.adRevenueSettlement}
          </Text>
        </View>
        )}
        {

}
      </TouchableOpacity>
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
                <Text style={styles.settlementNotice}>{t('screens.adWallet.settlementNotice')}</Text>
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
          ) : tab === 'quest' ? (
            <DataList
              ref={questListRef}
              fetchData={fetchQuestData}
              ItemComponent={AdEntryItem}
              pageSize={20}
              contentContainerStyle={styles.dataList}
              keyExtractor={(item, index) => `quest-${item.id}-${index}`}
              onItemPress={handleQuestItemPress}
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

      <Dialog
        visible={attendanceCheckVisible}
        title={hasAttended === true 
          ? t('screens.adWallet.attendanceCheckCompletedTitle')
          : t('screens.adWallet.attendanceCheckTitle')}
        onClose={isJoiningQuest ? undefined : handleDialogClose}
        actions={[
          {
            label: isJoiningQuest
              ? t('screens.adWallet.processing')
              : hasAttended === true
              ? t('screens.adWallet.confirm')
              : canReward === true
              ? t('screens.adWallet.attendanceCheck')
              : t('screens.adWallet.confirm'),
            onPress: handleAttendanceCheckConfirm,
            variant: 'primary',
            disabled: isJoiningQuest,
          },
        ]}
      >
        {attendanceCheckLoading ? (
          <ActivityIndicator size="small" color={COLORS.buttonPrimary} />
        ) : (
          <Text style={styles.attendanceCheckMessage}>
            {hasAttended === true
              ? t('screens.adWallet.attendanceCheckNotAvailable')
              : canReward === true
              ? t('screens.adWallet.attendanceCheckRewardMessage')
              : t('screens.adWallet.attendanceCheckCompleted')}
          </Text>
        )}
      </Dialog>
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
  settlementNotice: {
    fontSize: FONTS.size.msmall,
    fontFamily: 'Roboto-Regular',
    color: 'rgba(255, 255, 255, 0.9)',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
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
  questTitleContainer: {
    marginBottom: 12,
  },
  questTitle: {
    fontSize: FONTS.size.medium,
    fontFamily: 'Roboto-Bold',
    color: '#111111',
    marginBottom: 4,
  },
  questDescription: {
    fontSize: FONTS.size.small,
    fontFamily: 'Roboto-Regular',
    color: '#666666',
    lineHeight: 20,
  },
  questRewardContainer: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#e5e5e5',
  },
  questRewardDescription: {
    fontSize: FONTS.size.small,
    fontFamily: 'Roboto-Regular',
    color: '#888888',
    fontStyle: 'italic',
  },
  attendanceCheckMessage: {
    fontSize: FONTS.size.medium,
    fontFamily: 'Roboto-Regular',
    color: '#121212',
    textAlign: 'center',
    lineHeight: 24,
  },
  loadingModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingModalContent: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 120,
  },
  loadingModalText: {
    marginTop: 16,
    fontSize: FONTS.size.medium,
    fontFamily: 'Roboto-Regular',
    color: '#121212',
  },
  questIdOneColdStart: {
    borderWidth: 2,
    borderColor: '#ffdc04', 
  },
  questIdOneWarmStart: {
    borderWidth: 0, 
  },
});
