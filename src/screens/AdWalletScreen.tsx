import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { View, Text, StyleSheet, Platform, ActivityIndicator, TouchableOpacity, Modal, Linking } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BigNumber from 'bignumber.js';
import { Header, SegmentedControl, DataList, SafeView } from '../components';
import { COLORS, COMMON_STYLES, FONTS, SIZES } from '../constants';
import { useAppNavigation, ROUTES } from '../navigation';
import { useAppContext } from '../context';
import { formatCurrency, showToast, getColdStartResult, shareReferralLink } from '../utils';
import { useAlertDialog } from '../context/AlertDialogContext';
import {
  fetchADXRUNEstimateList,
  fetchADXRUNResultList,
  fetchADXRUNTopBanners,
  fetchADXRUNTopBannersSettled,
  fetchQuestList,
  joinQuest,
  getXRUNGopaxPrice,
} from '../services';
import { loadAndShowRewardedAd, getPangleRewardedAdUnitId, isPangleReadySync, isPangleReady, initializePangle } from '../services/pangle';
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
  originalDescription?: string; 
  rewardDescription?: string; 
  extrastr3?: string; 
  extrastr4?: string; 
  adName?: string; 
  hasAttended?: boolean; 
  is_rewarded?: boolean; 
  attendance_date?: string; 
  txHash?: string | null; 
  eventStatus?: string; 
  isReferralEvent?: boolean; 
  eventType?: string; 
  isReferralInvite?: boolean; 
  originalDate?: string; 
}

export const AdWalletScreen = () => {
  const { t, i18n } = useTranslation();
  const { goBack, navigate } = useAppNavigation();
  const { setSelectedShopItem } = useAppContext();

  const { showAlert } = useAlertDialog();
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
  const [isJoiningQuest, setIsJoiningQuest] = useState(false);
  const [isColdStart, setIsColdStart] = useState<boolean | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);

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
        const emailData = parsedUserData.email;
        setMember(memberData);
        setUserEmail(emailData || null);
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
        const result = await getXRUNGopaxPrice();
        const price = result?.data?.gopaxPrice || null;
        if (price) {
          setGopaxPrice(price);

          await AsyncStorage.setItem('xrungopaxprice', JSON.stringify(result));
          console.log('[AdWallet] 고팍스 XRUN 가격 로드:', price);
        }
      } catch (error) {
        console.error('[AdWallet] 고팍스 XRUN 가격 API 오류, AsyncStorage fallback 시도:', error);

        try {
          const priceDataStr = await AsyncStorage.getItem('xrungopaxprice');
          if (priceDataStr) {
            const priceData = JSON.parse(priceDataStr);
            const price = priceData?.data?.gopaxPrice || null;
            setGopaxPrice(price);
          }
        } catch {}
      }
    };

    loadGopaxPrice();
  }, []);

  useEffect(() => {
    if (!member) return;

    const loadTopBanners = async () => {

      if (tab === 'pending') {

        setTimeout(() => {
          const totalXrun = pendingBannerRef.current.totalXrun;
          const amountasxrun = `${totalXrun.toFixed(2)} XRUN`;
          let krwamount = '0 KRW';
          if (gopaxPrice && totalXrun > 0) {
            const krwVal = new BigNumber(totalXrun).multipliedBy(gopaxPrice);
            const formatted = krwVal.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
            krwamount = `KRW ${formatted}`;
          }
          setTopBannersData({ krwamount, amountasxrun });
        }, 500);
        return;
      }

      if (tab === 'quest') {
        setTimeout(() => {
          const totalXrun = questBannerRef.current.totalXrun;
          const amountasxrun = `${totalXrun.toFixed(2)} XRUN`;
          let krwamount = '0 KRW';
          if (gopaxPrice && totalXrun > 0) {
            const krwVal = new BigNumber(totalXrun).multipliedBy(gopaxPrice);
            const formatted = krwVal.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
            krwamount = `KRW ${formatted}`;
          }
          setTopBannersData({ krwamount, amountasxrun });
        }, 500);
        return;
      }
      setTopBannersLoading(true);
      try {
        let response;
        response = await fetchADXRUNTopBannersSettled(member);

        const responseData = response.data || response;

        if (responseData && responseData.transactions && responseData.transactions.length > 0) {
          const transaction = responseData.transactions[0];

          const amountAsXrunNum = parseFloat(transaction.amountasxrun || '0');
          const amountasxrun = `${amountAsXrunNum.toFixed(2)} XRUN`;

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

        const yearMonthPattern = /^\d{4}-\d{2}$/;
        if (yearMonthPattern.test(utcDateString)) {
          return utcDateString;
        }

        const hasTimezone = utcDateString.endsWith('Z') ||
          utcDateString.includes('+') ||
          (utcDateString.length > 10 && utcDateString.slice(10).includes('-'));

        if (!hasTimezone) {

          if (/^\d{4}-\d{2}-\d{2}$/.test(utcDateString)) {
            utcDateString = `${utcDateString}T00:00:00Z`;
          } else if (!utcDateString.includes('T')) {

            utcDateString = utcDateString.replace(' ', 'T');

            if (!utcDateString.includes(':')) {
              utcDateString += 'T00:00:00';
            }
            utcDateString += 'Z'; 
          } else {
            utcDateString += 'Z'; 
          }
        }

        const localDate = new Date(utcDateString);

        if (isNaN(localDate.getTime())) {
          console.log('❌ 잘못된 날짜 형식:', utcString, '변환된 형식:', utcDateString);
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

  const formatAttendanceDateTime = useCallback((utcString: string | undefined): string => {
    if (!utcString) {
      return '-';
    }

    try {

      let utcDateString = utcString.trim();

      const hasTimezone = utcDateString.endsWith('Z') ||
        utcDateString.includes('+') ||
        (utcDateString.length > 10 && utcDateString.slice(10).includes('-'));

      if (!hasTimezone) {

        if (/^\d{4}-\d{2}-\d{2}$/.test(utcDateString)) {
          utcDateString = `${utcDateString}T00:00:00Z`;
        } else if (!utcDateString.includes('T')) {

          utcDateString = utcDateString.replace(' ', 'T');

          if (!utcDateString.includes(':')) {
            utcDateString += 'T00:00:00';
          }
          utcDateString += 'Z'; 
        } else {
          utcDateString += 'Z'; 
        }
      }

      const localDate = new Date(utcDateString);

      if (isNaN(localDate.getTime())) {
        console.log('❌ 잘못된 날짜 형식(출석체크):', utcString, '변환된 형식:', utcDateString);
        return '-';
      }

      const year = localDate.getFullYear();
      const month = String(localDate.getMonth() + 1).padStart(2, '0');
      const day = String(localDate.getDate()).padStart(2, '0');
      const hours = String(localDate.getHours()).padStart(2, '0');
      const minutes = String(localDate.getMinutes()).padStart(2, '0');

      return `${year}.${month}.${day} ${hours}:${minutes}`;
    } catch (error) {
      console.log('❌ 날짜 파싱 오류(출석체크):', error, '원본 데이터:', utcString);
      return '-';
    }
  }, []);

  const convertEstimateToAdEntry = useCallback(
    (item: ADXRUNEstimateItem): AdEntry => {
      const status = t('screens.adWallet.pending');
      const date = formatDate(item.datetime);
      console.log('🔍 [convertEstimateToAdEntry] item:', item);

      const amountValue = item.amountasxrun || item.priceasXrun || '0';

      const amountNum = parseFloat(amountValue);
      const flooredAmount = Math.floor(amountNum * 100) / 100;
      const expectedAdRevenue = `${flooredAmount.toFixed(2)} XRUN`;
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
        adName: (item as any).adName || undefined,
      };
    },
    [t, formatDate],
  );

  const convertQuestToAdEntry = useCallback(
    (item: QuestItem): AdEntry => {
      const status = t('screens.adWallet.quest');

      const eventType = item.event_type || 'quest';
      const isReferralInvite = eventType === 'recommendation_invite';
      const isReferralEvent = eventType === 'recommendation' ||
        (typeof item.id === 'string' && item.id.startsWith('recommendation_'));

      const isAttendanceCheck = eventType === 'attendance' ||
        (typeof item.id === 'string' && item.id.startsWith('attendance_'));

      const originalRewardValue = item.reward_amount_asxrun;
      const rewardAmount = typeof originalRewardValue === 'string'
        ? parseFloat(originalRewardValue)
        : originalRewardValue;

      if (isAttendanceCheck) {
        const flooredForLog = Math.floor(rewardAmount * 100) / 100;
        console.log('[AdWallet] 출석체크 보상 변환:', {
          id: item.id,
          title: item.title,
          attendance_date: item.attendance_date,
          is_rewarded: item.is_rewarded,
          원본값: originalRewardValue,
          원본타입: typeof originalRewardValue,
          변환후값: rewardAmount,
          변환후타입: typeof rewardAmount,
          최종표시값: `${flooredForLog.toFixed(2)} XRUN`,
        });
      }

      if (isReferralEvent) {
        const flooredForLog = Math.floor(rewardAmount * 100) / 100;
        console.log('[AdWallet] 추천인 이벤트 변환:', {
          id: item.id,
          title: item.title,
          원본값: originalRewardValue,
          원본타입: typeof originalRewardValue,
          변환후값: rewardAmount,
          변환후타입: typeof rewardAmount,
          최종표시값: `${flooredForLog.toFixed(2)} XRUN`,
        });
      }

      const date = isReferralInvite 
        ? ''
        : isAttendanceCheck
          ? formatAttendanceDateTime(item.created_at || item.attendance_date)
          : formatDate(item.start_date || item.created_at);

      const displayRewardAmount = rewardAmount;

      const flooredAmount = Math.floor(displayRewardAmount * 100) / 100;
      const expectedAdRevenue = `${flooredAmount.toFixed(2)} XRUN`;
      const adRevenueSettlement = '- XRUN';

      const isReviewStatus = item.event_status === 'review';
      const expectedAdRevenueColor = isReviewStatus ? '#cccccc' : '#707070';
      const adRevenueSettlementColor = isReviewStatus ? '#cccccc' : '#343434';

      const getQuestTitle = (): string => {
        switch (item.event_type) {
          case 'recommendation_invite':
            return t('screens.adWallet.exclusiveReferralCodeShare') || item.title || '';
          case 'recommendation':
            return t('screens.adWallet.referralEventRewardTitle') || item.title || '';
          case 'attendance':
            return t('screens.adWallet.attendanceCheck') || item.title || '';
          default:
            return item.title || '';
        }
      };

      const getQuestDescription = (): string => {
        switch (item.event_type) {
          case 'recommendation_invite':
            return t('screens.adWallet.referralInviteDescription') || item.description || '';
          case 'recommendation':
            if (item.event_status === 'review' && (Number(item.reward_amount) || 0) === 0)
              return t('screens.adWallet.referralEventUnderReview') || item.description || '';
            return item.description || t('screens.adWallet.referralEventReward') || '';
          case 'attendance':
            if (item.is_rewarded)
              return t('screens.adWallet.attendanceRewardCompleted') || item.description || '';
            return t('screens.adWallet.attendanceRewardOnLogin') || item.description || '';
          default:
            return item.description || '';
        }
      };

      const getQuestRewardDesc = (): string => {
        switch (item.event_type) {
          case 'recommendation_invite':
          case 'recommendation':
            return t('screens.adWallet.referralEvent') || item.reward_description || '';
          case 'attendance':
            return t('screens.adWallet.attendanceCheckCompletedReward') || item.reward_description || '';
          default:
            return item.reward_description || '';
        }
      };

      const displayTitle = getQuestTitle();
      const displayDescription = getQuestDescription();
      const displayRewardDescription = getQuestRewardDesc();

      return {
        id: item.id,
        status,
        date,
        expectedAdRevenue,
        adRevenueSettlement,
        expectedAdRevenueColor,
        adRevenueSettlementColor,
        title: displayTitle,
        description: displayDescription,
        originalDescription: item.description, 
        rewardDescription: displayRewardDescription,
        eventStatus: item.event_status,
        isReferralEvent,
        eventType,
        isReferralInvite,

        is_rewarded: isAttendanceCheck ? item.is_rewarded : undefined,
        attendance_date: isAttendanceCheck ? item.attendance_date : undefined,
        extrastr3: isAttendanceCheck ? '출석보상' : undefined,

        originalDate: isAttendanceCheck 
          ? (item.created_at || item.attendance_date)
          : (item.start_date || item.created_at),
      };
    },
    [t, formatDate, i18n],
  );

  const convertResultToAdEntry = useCallback(
    (item: ADXRUNResultItem): AdEntry => {

      const status =
        item.action === 3304 ? t('screens.adWallet.settled') : t('screens.adWallet.conditionNotMet');
      const date = formatDate(item.datetime);

      const extrastr3 = (item as any).extrastr3 || null;
      let typeLabel = '';
      if (extrastr3 === '출석보상') typeLabel = t('screens.adWallet.attendanceCheckLabel');
      else if (extrastr3 === '추천인이벤트') typeLabel = t('screens.adWallet.referralRewardLabel');
      else if (extrastr3 === 'zone1-instant') typeLabel = t('screens.adWallet.playZone1Reward');
      else if (extrastr3 === 'zone2-instant') typeLabel = t('screens.adWallet.playZone2Reward');

      let adRevenueSettlement = '0.00 XRUN';
      if (item.amountasxrun) {
        const settlementNum = parseFloat(item.amountasxrun);
        const flooredSettlement = Math.floor(settlementNum * 10000) / 10000;

        const formatted = flooredSettlement % 1 === 0 || Math.round(flooredSettlement * 100) / 100 === flooredSettlement
          ? flooredSettlement.toFixed(2)
          : parseFloat(flooredSettlement.toFixed(4)).toString();
        adRevenueSettlement = `${formatted} XRUN`;
      }

      const adName = (item as any).adName as string | undefined;
      let expectedAdRevenue = '0 XRUN';
      if (typeLabel) {
        expectedAdRevenue = typeLabel;
      } else if (adName && adName.trim()) {
        expectedAdRevenue = adName.trim();
      } else {
        expectedAdRevenue = `${item.expected} XRUN`;
      }

      const expectedAdRevenueColor = status === t('screens.adWallet.settled') ? '#111111' : '#707070';
      const adRevenueSettlementColor =
        status === t('screens.adWallet.settled') ? '#111111' : '#343434';

      return {
        id: item.id || item.transaction,
        status,
        date,
        expectedAdRevenue,
        adRevenueSettlement,
        expectedAdRevenueColor,
        adRevenueSettlementColor,
        extrastr3,
        extrastr4: (item as any).extrastr4 || undefined,
      };
    },
    [t, formatDate],
  );

  const pendingTotalRef = useRef<number>(0);
  const pendingBannerRef = useRef<{ totalXrun: number; updated: boolean }>({ totalXrun: 0, updated: false });

  const questBannerRef = useRef<{ totalXrun: number; updated: boolean }>({ totalXrun: 0, updated: false });

  const fetchPendingData = useCallback(
    async (params: PaginationParams): Promise<PaginationResponse<AdEntry>> => {
      if (!member) {
        return { data: [], total: 0, hasMore: false };
      }

      try {

        const estimateResponse = await fetchADXRUNEstimateList(member, params.page);
        const estimateResponseData = estimateResponse.data || estimateResponse;
        const estimateItems = estimateResponseData.items || estimateResponseData || [];
        const pagination = estimateResponseData.pagination;

        const estimateAdEntries: AdEntry[] = estimateItems.map(convertEstimateToAdEntry);

        const pageSum = estimateItems.reduce((sum: number, item: any) => {
          const val = parseFloat(item.amountasxrun || '0');
          const floored = Math.floor(val * 100) / 100;
          return sum + (isNaN(floored) ? 0 : floored);
        }, 0);

        if (params.page === 1) {
          pendingTotalRef.current = pageSum;
        } else {
          pendingTotalRef.current += pageSum;
        }

        pendingBannerRef.current = { totalXrun: pendingTotalRef.current, updated: true };

        let hasMore = false;
        if (pagination) {
          hasMore = pagination.hasNextPage || false;
        } else {
          hasMore = estimateItems.length > 0 && estimateItems.length >= params.pageSize;
        }

        return {
          data: estimateAdEntries,
          total: estimateAdEntries.length,
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

        const response = await fetchQuestList(member || undefined, goBack);

        const questItems = response.data || [];

        const filteredQuestItems = questItems;

        const adEntries: AdEntry[] = filteredQuestItems.map(convertQuestToAdEntry);

        const isAttendanceQuest = (entry: AdEntry): boolean => {
          return entry.eventType === 'attendance' ||
            (typeof entry.id === 'string' && entry.id.startsWith('attendance_'));
        };

        const sortedAdEntries = [...adEntries].sort((a, b) => {

          if (a.isReferralInvite && !b.isReferralInvite) return -1;
          if (!a.isReferralInvite && b.isReferralInvite) return 1;
          if (a.isReferralInvite && b.isReferralInvite) {

            const dateA = new Date(a.date || '').getTime();
            const dateB = new Date(b.date || '').getTime();
            if (dateA !== dateB) return dateA - dateB;
          }

          const aIsAttendanceNotRewarded = isAttendanceQuest(a) && (a.is_rewarded === false || a.is_rewarded === undefined);
          const bIsAttendanceNotRewarded = isAttendanceQuest(b) && (b.is_rewarded === false || b.is_rewarded === undefined);
          if (aIsAttendanceNotRewarded && !bIsAttendanceNotRewarded) return -1;
          if (!aIsAttendanceNotRewarded && bIsAttendanceNotRewarded) return 1;
          if (aIsAttendanceNotRewarded && bIsAttendanceNotRewarded) {

            const dateA = new Date(a.date || '').getTime();
            const dateB = new Date(b.date || '').getTime();
            if (dateA !== dateB) return dateA - dateB;
          }

          const aIsReferral = a.isReferralEvent && !a.isReferralInvite;
          const bIsReferral = b.isReferralEvent && !b.isReferralInvite;
          if (aIsReferral && !bIsReferral) return -1;
          if (!aIsReferral && bIsReferral) return 1;
          if (aIsReferral && bIsReferral) {

            const dateA = new Date(a.date || '').getTime();
            const dateB = new Date(b.date || '').getTime();
            if (dateA !== dateB) return dateA - dateB;
          }

          const aIsAttendanceRewarded = isAttendanceQuest(a) && a.is_rewarded === true;
          const bIsAttendanceRewarded = isAttendanceQuest(b) && b.is_rewarded === true;
          if (aIsAttendanceRewarded && !bIsAttendanceRewarded) return -1;
          if (!aIsAttendanceRewarded && bIsAttendanceRewarded) return 1;
          if (aIsAttendanceRewarded && bIsAttendanceRewarded) {

            const dateA = new Date(a.date || '').getTime();
            const dateB = new Date(b.date || '').getTime();
            if (dateA !== dateB) return dateA - dateB;
          }

          const aIsReferralRewardClicked = a.isReferralEvent && !a.isReferralInvite && a.eventStatus === 'completed';
          const bIsReferralRewardClicked = b.isReferralEvent && !b.isReferralInvite && b.eventStatus === 'completed';
          if (aIsReferralRewardClicked && !bIsReferralRewardClicked) return -1;
          if (!aIsReferralRewardClicked && bIsReferralRewardClicked) return 1;
          if (aIsReferralRewardClicked && bIsReferralRewardClicked) {

            const dateA = new Date(a.date || '').getTime();
            const dateB = new Date(b.date || '').getTime();
            if (dateA !== dateB) return dateA - dateB;
          }

          const dateA = new Date(a.date || '').getTime();
          const dateB = new Date(b.date || '').getTime();
          if (dateA !== dateB) return dateA - dateB;

          return 0;
        });

        const referralEvents = sortedAdEntries.filter((entry: AdEntry) => {
          return entry.isReferralEvent || entry.isReferralInvite;
        });

        console.log('[AdWallet] 퀘스트 리스트 조회 결과:', {
          전체퀘스트개수: sortedAdEntries.length,
          추천인이벤트개수: referralEvents.length,
          추천인이벤트목록: referralEvents.map((e: AdEntry) => ({
            id: e.id,
            title: e.title,
            eventStatus: e.eventStatus,
            eventType: e.eventType,
            isReferralInvite: e.isReferralInvite,
          })),
        });

        console.log('[AdWallet] 변환된 AdEntry 목록:', sortedAdEntries.map((entry) => ({
          id: entry.id,
          title: entry.title,
          expectedAdRevenue: entry.expectedAdRevenue,
          isReferralEvent: entry.isReferralEvent,
          isReferralInvite: entry.isReferralInvite,
          eventStatus: entry.eventStatus,
          eventType: entry.eventType,
          is_rewarded: entry.is_rewarded,
          attendance_date: entry.attendance_date,
          date: entry.date,
        })));

        const now = new Date();
        const seventyFiveDaysAgo = new Date(now.getTime() - 75 * 24 * 60 * 60 * 1000);

        const filteredByDate = sortedAdEntries.filter((entry: AdEntry) => {

          const isAttendanceRewarded = isAttendanceQuest(entry) && entry.is_rewarded === true;

          const isReferralReward = entry.isReferralEvent && !entry.isReferralInvite;
          const isReferralReview = isReferralReward && (
            entry.eventStatus === 'review' ||
            (entry.originalDescription && (
              entry.originalDescription.includes('심사중') ||
              entry.originalDescription.includes('완료')
            ))
          );

          if (isAttendanceRewarded || isReferralReview) {
            if (!entry.originalDate) {

              return true;
            }

            try {

              let dateString = entry.originalDate.trim();
              if (!dateString.endsWith('Z') && !dateString.includes('+') && !dateString.includes('-', 10)) {
                if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
                  dateString = `${dateString}T00:00:00Z`;
                } else if (!dateString.includes('T')) {
                  dateString = dateString.replace(' ', 'T');
                  if (!dateString.includes(':')) {
                    dateString += 'T00:00:00';
                  }
                  dateString += 'Z';
                } else {
                  dateString += 'Z';
                }
              }

              const entryDate = new Date(dateString);
              if (isNaN(entryDate.getTime())) {

                return true;
              }

              if (entryDate < seventyFiveDaysAgo) {
                console.log('[AdWallet] 75일 경과 항목 필터링:', {
                  id: entry.id,
                  title: entry.title,
                  originalDate: entry.originalDate,
                  entryDate: entryDate.toISOString(),
                  seventyFiveDaysAgo: seventyFiveDaysAgo.toISOString(),
                  isAttendanceRewarded,
                  isReferralReview,
                });
                return false;
              }
            } catch (error) {
              console.error('[AdWallet] 날짜 파싱 오류 (75일 필터링):', error, entry.originalDate);

              return true;
            }
          }

          return true;
        });

        console.log('[AdWallet] 75일 필터링 결과:', {
          필터링전: sortedAdEntries.length,
          필터링후: filteredByDate.length,
          제거된항목수: sortedAdEntries.length - filteredByDate.length,
        });

        const availableSum = filteredByDate.reduce((sum: number, entry: AdEntry) => {

          const isAttRewarded = isAttendanceQuest(entry) && entry.is_rewarded === true;

          const isRefReview = entry.isReferralEvent && !entry.isReferralInvite && entry.eventStatus === 'review';

          if (entry.isReferralInvite) return sum;
          if (isAttRewarded || isRefReview) return sum;
          const val = parseFloat(entry.expectedAdRevenue || '0');
          return sum + (isNaN(val) ? 0 : val);
        }, 0);
        questBannerRef.current = { totalXrun: availableSum, updated: true };

        return {
          data: filteredByDate,
          total: filteredByDate.length,
          hasMore: false,
        };
      } catch (error: any) {
        console.error('Failed to fetch quest data:', error);
        return { data: [], total: 0, hasMore: false };
      }
    },
    [convertQuestToAdEntry, member, goBack],
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
        const hasMore = pagination ? (pagination.hasNextPage || false) : (items.length > 0 && items.length >= params.pageSize);
        return { data: adEntries, total: adEntries.length, hasMore };
      } catch (error: any) {
        console.error('Failed to fetch settled data:', error);
        return { data: [], total: 0, hasMore: false };
      }
    },
    [member, convertResultToAdEntry, t],
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

    if (tab !== 'quest' || !member) {
      if (!member) {
        console.error('[AdWallet] member 정보가 없습니다.');
      }
      return;
    }

    if (item.isReferralInvite || item.eventType === 'recommendation_invite') {
      console.log('[AdWallet] 추천인 이벤트 초대하기 클릭:', item.id);
      console.log('[AdWallet] 현재 플랫폼:', Platform.OS);
      console.log('[AdWallet] userEmail:', userEmail);

      if (!userEmail) {
        console.error('[AdWallet] userEmail이 없습니다.');
        showToast('사용자 이메일 정보를 찾을 수 없습니다.');
        return;
      }

      try {
        console.log('[AdWallet] shareReferralLink 호출 시작');
        await shareReferralLink(t, { email: userEmail, member: member ?? undefined }, showAlert, goBack);
        console.log('[AdWallet] shareReferralLink 호출 완료');
      } catch (error) {
        console.error('[AdWallet] 공유하기 오류:', error);
        console.error('[AdWallet] 공유하기 오류 상세:', JSON.stringify(error, null, 2));
        showToast('공유하기에 실패했습니다.');
      }
      return;
    }

    const itemId = item.id;
    const isReferralEvent = item.isReferralEvent ||
      item.eventType === 'recommendation' ||
      (typeof itemId === 'string' && itemId.startsWith('recommendation_'));

    if (isReferralEvent) {
      console.log('[AdWallet] 추천인 이벤트 보상 클릭:', item.id);

      if (item.eventStatus === 'review') {
        showToast(t('screens.adWallet.referralEventAlreadyCompleted'));
        return;
      }

      const rewardAmount = parseFloat(item.expectedAdRevenue.replace(' XRUN', '')) || 0;
      if (item.eventStatus !== 'pending' || rewardAmount <= 0) {
        showToast(t('screens.adWallet.rewardNotAvailable'));
        return;
      }

      try {
        setIsJoiningQuest(true);

        let pangleReadyForReferral = isPangleReadySync();
        if (!pangleReadyForReferral) {
          console.log('[AdWallet] 추천인 이벤트: Pangle 즉시 준비 아님 → initializePangle 후 재확인');
          await initializePangle();
          pangleReadyForReferral = await isPangleReady();
        }

        if (pangleReadyForReferral) {
          try {
            console.log('[AdWallet] Pangle 광고 준비 완료 (Platform:', Platform.OS, ')');

            const deviceInfo = await collectDeviceInfo();

            await loadAndShowRewardedAd(
              getPangleRewardedAdUnitId(),
              member.toString(),
              deviceInfo,
              async (reward) => {
                console.log('[AdWallet] 추천인 이벤트 Pangle 광고 보상 수령:', reward);

                try {

                  let questId: number;
                  let recommendationEventId: number | null = null;

                  if (typeof item.id === 'string' && item.id.startsWith('recommendation_')) {

                    const match = item.id.match(/recommendation_(\d+)/);
                    recommendationEventId = match ? parseInt(match[1], 10) : null;
                    console.log('[AdWallet] 추천인 이벤트 ID 변환:', item.id, '->', recommendationEventId);

                    if (!recommendationEventId) {
                      console.error('[AdWallet] 유효하지 않은 추천인 이벤트 ID:', item.id);
                      showToast(t('screens.adWallet.invalidReferralEventId'));
                      setIsJoiningQuest(false);
                      return;
                    }

                    questId = `recommendation_${recommendationEventId}` as any;
                  } else {
                    questId = typeof item.id === 'string' ? parseInt(item.id, 10) : item.id;
                    if (isNaN(questId) || questId === 0) {
                      console.error('[AdWallet] 유효하지 않은 quest_id:', item.id, questId);
                      showToast('유효하지 않은 퀘스트 ID입니다.');
                      setIsJoiningQuest(false);
                      return;
                    }
                  }

                  const response = await joinQuest(
                    {
                      quest_id: questId,
                      member,

                      ...(recommendationEventId ? { detail1: 'recommendation' } : {}),
                    },
                    goBack,
                  );

                  if (response.status === 'success') {
                    showToast(t('screens.adWallet.referralEventRewardCompleted'));

                    if (questListRef.current) {
                      questListRef.current.reloadData();
                    }
                  } else {
                    showToast(response.message || '처리에 실패했습니다.');
                  }
                } catch (error) {
                  console.error('[AdWallet] 추천인 이벤트 보상 처리 오류:', error);
                  showToast('처리에 실패했습니다. 다시 시도해주세요.');
                } finally {
                  setIsJoiningQuest(false);
                }
              },
              () => {

                console.log('[AdWallet] 추천인 이벤트 Pangle 광고 닫힘 (시청 미완료)');
                setIsJoiningQuest(false);
              },
              (error) => {

                console.error('[AdWallet] 추천인 이벤트 Pangle 광고 로드 실패:', error);
                showToast(t('screens.adWallet.adLoadFailedForReward'));

                (async () => {
                  try {
                    let questId: number;
                    let recommendationEventId: number | null = null;

                    if (typeof item.id === 'string' && item.id.startsWith('recommendation_')) {
                      const match = item.id.match(/recommendation_(\d+)/);
                      recommendationEventId = match ? parseInt(match[1], 10) : null;

                      if (!recommendationEventId) {
                        showToast(t('screens.adWallet.invalidReferralEventId'));
                        setIsJoiningQuest(false);
                        return;
                      }

                      questId = `recommendation_${recommendationEventId}` as any;
                    } else {
                      questId = typeof item.id === 'string' ? parseInt(item.id, 10) : item.id;
                      if (isNaN(questId) || questId === 0) {
                        showToast('유효하지 않은 퀘스트 ID입니다.');
                        setIsJoiningQuest(false);
                        return;
                      }
                    }

                    const response = await joinQuest(
                      {
                        quest_id: questId,
                        member,
                        ...(recommendationEventId ? { detail1: 'recommendation' } : {}),
                      },
                      goBack,
                    );

                    if (response.status === 'success') {
                      showToast(t('screens.adWallet.referralEventRewardCompleted'));
                      if (questListRef.current) {
                        questListRef.current.reloadData();
                      }
                    } else {
                      showToast(response.message || '처리에 실패했습니다.');
                    }
                  } catch (error) {
                    console.error('[AdWallet] 추천인 이벤트 보상 처리 오류:', error);
                    showToast('처리에 실패했습니다. 다시 시도해주세요.');
                  } finally {
                    setIsJoiningQuest(false);
                  }
                })();
              }
            );
          } catch (error) {
            console.error('[AdWallet] 추천인 이벤트 Pangle 광고 표시 오류:', error);

            try {
              let questId: number;
              let recommendationEventId: number | null = null;

              if (typeof item.id === 'string' && item.id.startsWith('recommendation_')) {
                const match = item.id.match(/recommendation_(\d+)/);
                recommendationEventId = match ? parseInt(match[1], 10) : null;

                if (!recommendationEventId) {
                  showToast(t('screens.adWallet.invalidReferralEventId'));
                  setIsJoiningQuest(false);
                  return;
                }

                questId = `recommendation_${recommendationEventId}` as any;
              } else {
                questId = typeof item.id === 'string' ? parseInt(item.id, 10) : item.id;
                if (isNaN(questId) || questId === 0) {
                  showToast('유효하지 않은 퀘스트 ID입니다.');
                  setIsJoiningQuest(false);
                  return;
                }
              }

              const response = await joinQuest(
                {
                  quest_id: questId,
                  member,
                  ...(recommendationEventId ? { detail1: 'recommendation' } : {}),
                },
                goBack,
              );

              if (response.status === 'success') {
                showToast(t('screens.adWallet.referralEventRewardCompleted'));
                if (questListRef.current) {
                  questListRef.current.reloadData();
                }
              } else {
                showToast(response.message || '처리에 실패했습니다.');
              }
            } catch (questError) {
              console.error('[AdWallet] 추천인 이벤트 보상 처리 오류:', questError);
              showToast('처리에 실패했습니다. 다시 시도해주세요.');
            } finally {
              setIsJoiningQuest(false);
            }
          }
        } else {

          try {
            let questId: number;
            let recommendationEventId: number | null = null;

            if (typeof item.id === 'string' && item.id.startsWith('recommendation_')) {
              const match = item.id.match(/recommendation_(\d+)/);
              recommendationEventId = match ? parseInt(match[1], 10) : null;

              if (!recommendationEventId) {
                showToast(t('screens.adWallet.invalidReferralEventId'));
                setIsJoiningQuest(false);
                return;
              }

              questId = `recommendation_${recommendationEventId}` as any;
            } else {
              questId = typeof item.id === 'string' ? parseInt(item.id, 10) : item.id;
              if (isNaN(questId) || questId === 0) {
                showToast('유효하지 않은 퀘스트 ID입니다.');
                setIsJoiningQuest(false);
                return;
              }
            }

            const response = await joinQuest(
              {
                quest_id: questId,
                member,
                ...(recommendationEventId ? { detail1: 'recommendation' } : {}),
              },
              goBack,
            );

            if (response.status === 'success') {
              showToast(t('screens.adWallet.referralEventRewardCompleted'));
              if (questListRef.current) {
                questListRef.current.reloadData();
              }
            } else {
              showToast(response.message || '처리에 실패했습니다.');
            }
          } catch (error) {
            console.error('[AdWallet] 추천인 이벤트 보상 처리 오류:', error);
            showToast('처리에 실패했습니다. 다시 시도해주세요.');
          } finally {
            setIsJoiningQuest(false);
          }
        }
      } catch (error) {
        console.error('[AdWallet] 추천인 이벤트 보상 처리 오류:', error);
        showToast('처리에 실패했습니다. 다시 시도해주세요.');
        setIsJoiningQuest(false);
      }
      return;
    }

    const isAttendanceQuest = item.eventType === 'attendance' ||
      (typeof item.id === 'string' && item.id.startsWith('attendance_'));

    if (isAttendanceQuest) {
      console.log('[AdWallet] 출석체크 클릭', { id: item.id, eventType: item.eventType, is_rewarded: item.is_rewarded });

      if (item.is_rewarded === true) {
        console.log('[AdWallet] 출석체크 이미 수령 완료 → 클릭 무시');
        showToast(t('screens.adWallet.attendanceCheckAlreadyCompleted'));
        return;
      }

      setIsJoiningQuest(true);

      let pangleReady = isPangleReadySync();
      if (!pangleReady) {
        console.log('[AdWallet] 출석체크: Pangle 즉시 준비 아님 → initializePangle 후 재확인');
        await initializePangle();
        pangleReady = await isPangleReady();
      }
      console.log('[AdWallet] 출석체크 Pangle 준비:', pangleReady, 'Platform:', Platform.OS);

      if (pangleReady) {
        try {
          console.log('[AdWallet] 출석체크 Pangle 광고 표시 시도 (loadAndShowRewardedAd 호출 직전)');

          const deviceInfo = await collectDeviceInfo();

          await loadAndShowRewardedAd(
            getPangleRewardedAdUnitId(),
            member.toString(),
            deviceInfo,
            async (reward) => {
              console.log('[AdWallet] 출석체크 Pangle 광고 보상 수령:', reward);

              try {

                const questId = item.id;
                const response = await joinQuest(
                  {
                    quest_id: questId,
                    member,
                  },
                  undefined, 
                );

                if (response.status === 'success') {
                  showToast(t('screens.adWallet.attendanceCheckCompletedToast'));

                  if (questListRef.current) {
                    questListRef.current.reloadData();
                  }
                } else {
                  showToast(response.message || t('screens.adWallet.attendanceCheckRetryToast'));
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
              showToast(t('screens.adWallet.adLoadFailedForAttendance'));

              const questId = item.id;
              joinQuest(
                {
                  quest_id: questId,
                  member,
                },
                undefined,
              )
                .then((response) => {
                  if (response.status === 'success') {
                    showToast(t('screens.adWallet.attendanceCheckCompletedToast'));
                    if (questListRef.current) {
                      questListRef.current.reloadData();
                    }
                  } else {
                    showToast(response.message || t('screens.adWallet.attendanceCheckRetryToast'));
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
            const questId = item.id;
            const response = await joinQuest(
              {
                quest_id: questId,
                member,
              },
              undefined,
            );

            if (response.status === 'success') {
              showToast(t('screens.adWallet.attendanceCheckCompletedToast'));
              if (questListRef.current) {
                questListRef.current.reloadData();
              }
            } else {
              showToast(response.message || t('screens.adWallet.attendanceCheckRetryToast'));
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
          const questId = item.id;
          const response = await joinQuest(
            {
              quest_id: questId,
              member,
            },
            undefined,
          );

          if (response.status === 'success') {
            showToast(t('screens.adWallet.attendanceCheckCompletedToast'));
            if (questListRef.current) {
              questListRef.current.reloadData();
            }
          } else {
            showToast(response.message || t('screens.adWallet.attendanceCheckRetryToast'));
          }
        } catch (error) {
          console.error('[AdWallet] 출석 체크 참여 오류:', error);
          showToast(t('screens.adWallet.attendanceCheckRetryToast'));
        } finally {
          setIsJoiningQuest(false);
        }
      }
      return;
    }
  }, [tab, member, goBack, t, userEmail, showAlert]);

  const summaryLabel = useMemo(
    () => {
      if (tab === 'quest') return t('screens.adWallet.obtainableAmount');
      if (tab === 'pending') return t('screens.adWallet.expectedAmount');
      return t('screens.adWallet.confirmedAmount');
    },
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

  const AdEntryItem: React.FC<AdEntry & { onPress?: () => void; tab?: TabValue }> = (item) => {

    const { onPress, tab: itemTab, ...itemData } = item;
    const isQuest = (itemTab === 'pending' || itemTab === 'settled') ? false : (!!item.title || item.extrastr3 === '추천인이벤트');

    const isAttendanceQuest = item.eventType === 'attendance' ||
      (typeof item.id === 'string' && item.id.startsWith('attendance_'));

    const isAttendanceRewarded = isAttendanceQuest ? item.is_rewarded : undefined;

    const questHasAttended = isAttendanceRewarded === true;

    const isReferralInvite = item.isReferralInvite || item.eventType === 'recommendation_invite';

    const isReferralReward = item.isReferralEvent || item.eventType === 'recommendation';

    const isReferralRewardDisabled = isReferralReward && (
      item.eventStatus === 'review' ||
      (item.originalDescription && (
        item.originalDescription.includes('심사중') ||
        item.originalDescription.includes('완료')
      ))
    );

    const isDisabled = Boolean(!isReferralInvite && (isAttendanceRewarded === true || isReferralRewardDisabled));

    const cardStyle = styles.adCard;

    const disabledColor = '#cccccc';

    return (
      <TouchableOpacity
        style={cardStyle}
        onPress={isDisabled ? undefined : onPress}
        activeOpacity={isDisabled ? 1 : 0.7}
        disabled={isDisabled}
      >
        <View style={styles.adCardHeader}>
          <Text style={[
            styles.adCardStatus,
            isDisabled && { backgroundColor: disabledColor, color: '#ffffff' }
          ]}>
            {item.status}
          </Text>
          {item.date ? (
            <Text style={[
              styles.adCardDate,
              isDisabled && { color: disabledColor }
            ]}>
              {item.date}
            </Text>
          ) : null}
        </View>
        {isQuest && item.title && (
          <View style={styles.questTitleContainer}>
            <Text style={[
              styles.questTitle,
              isDisabled && { color: disabledColor }
            ]}>
              {item.title}
            </Text>
            {item.description && (
              <Text style={[
                styles.questDescription,
                isDisabled && { color: disabledColor }
              ]}>
                {item.description}
              </Text>
            )}
          </View>
        )}
        {isQuest ? (

          item.extrastr3 === '추천인이벤트' ? (
            <View style={styles.adCardRow}>
              <Text style={[
                styles.adCardRowLabel,
                isDisabled && { color: disabledColor }
              ]}>
                {t('screens.adWallet.referralInviteReward')}
              </Text>
              <Text style={[
                styles.adCardRowAmount,
                { color: item.expectedAdRevenueColor },
                isDisabled && { color: disabledColor }
              ]}>
                {item.expectedAdRevenue}
              </Text>
            </View>
          ) : (

            <View style={styles.adCardRow}>
              <Text style={[
                styles.adCardRowLabel,
                isDisabled && { color: disabledColor }
              ]}>
                {t('screens.adWallet.rewardAmount')}
              </Text>
              <Text style={[
                styles.adCardRowAmount,
                { color: item.expectedAdRevenueColor },
                isDisabled && { color: disabledColor }
              ]}>
                {item.expectedAdRevenue}
              </Text>
            </View>
          )
        ) : (itemTab === 'settled' && item.extrastr3 === '출석보상') ? (
          <View style={styles.adCardRow}>
            <Text style={styles.adCardRowLabel}>{t('screens.adWallet.attendanceCheckLabel')}</Text>
            <Text style={[styles.adCardRowAmount, { color: item.adRevenueSettlementColor }]}>
              {item.adRevenueSettlement}
            </Text>
          </View>
        ) : (itemTab !== 'pending' && item.extrastr3 === '출석보상') ? (
          <View style={styles.adCardRow}>
            <Text style={[
              styles.adCardRowLabel,
              questHasAttended === true && { color: disabledColor }
            ]}>
              {t('screens.adWallet.attendanceCheckCompletedReward')}
            </Text>
            <Text style={[
              styles.adCardRowAmount,
              { color: item.expectedAdRevenueColor },
              questHasAttended === true && { color: disabledColor }
            ]}>
              {item.expectedAdRevenue}
            </Text>
          </View>
        ) : (itemTab === 'settled' && item.extrastr3 === '추천인이벤트') ? (
          <View style={styles.adCardRow}>
            <Text style={[styles.adCardRowLabel, { maxWidth: '70%' }]} numberOfLines={1} ellipsizeMode="tail">{item.extrastr4 ? t('screens.adWallet.referralRewardWithName', { name: item.extrastr4 }) : t('screens.adWallet.referralRewardLabel')}</Text>
            <Text style={[styles.adCardRowAmount, { color: item.adRevenueSettlementColor }]}>
              {item.adRevenueSettlement}
            </Text>
          </View>
        ) : (itemTab === 'settled' && item.extrastr3 === 'zone1-instant') ? (
          <View style={styles.adCardRow}>
            <Text style={styles.adCardRowLabel}>{t('screens.adWallet.playZone1Reward')}</Text>
            <Text style={[styles.adCardRowAmount, { color: item.adRevenueSettlementColor }]}>
              {item.adRevenueSettlement}
            </Text>
          </View>
        ) : (itemTab === 'settled' && item.extrastr3 === 'zone2-instant') ? (
          <View style={styles.adCardRow}>
            <Text style={styles.adCardRowLabel}>{t('screens.adWallet.playZone2Reward')}</Text>
            <Text style={[styles.adCardRowAmount, { color: item.adRevenueSettlementColor }]}>
              {item.adRevenueSettlement}
            </Text>
          </View>
        ) : (itemTab !== 'pending' && item.extrastr3 === '추천인이벤트') ? (
          <View style={styles.adCardRow}>
            <Text style={[
              styles.adCardRowLabel,
              isDisabled && { color: disabledColor }
            ]}>
              {t('screens.adWallet.referralInviteReward')}
            </Text>
            <Text style={[
              styles.adCardRowAmount,
              { color: item.expectedAdRevenueColor },
              isDisabled && { color: disabledColor }
            ]}>
              {item.expectedAdRevenue}
            </Text>
          </View>
        ) : (
          <>
            {}
            {itemTab === 'pending' && item.adName && (
              <Text style={[styles.adCardRowLabel, { maxWidth: '70%', marginBottom: 4 }]} numberOfLines={1} ellipsizeMode="tail">
                {item.adName}
              </Text>
            )}
            {}
            {itemTab !== 'settled' && (
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
            )}
            {!isQuest && item.extrastr3 !== '출석보상' && itemTab === 'settled' && (
              <View style={styles.adCardRow}>
                <Text style={styles.adCardRowLabel}>{t('screens.adWallet.adRevenueSettlement')}</Text>
                <Text style={[styles.adCardRowAmount, { color: item.adRevenueSettlementColor }]}>
                  {item.adRevenueSettlement}
                </Text>
              </View>
            )}
          </>
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
                {tab === 'pending' && <Text style={styles.settlementNotice}>{t('screens.adWallet.settlementNotice')}</Text>}
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
              itemProps={{ tab }}
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
              itemProps={{ tab }}
            />
          ) : (
            <DataList
              ref={settledListRef}
              fetchData={fetchSettledData}
              ItemComponent={AdEntryItem}
              pageSize={20}
              contentContainerStyle={styles.dataList}
              keyExtractor={(item, index) => `settled-${item.id}-${index}`}
              itemProps={{ tab }}
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
  adCardRowRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  adCardRowSpacer: {
    flex: 1,
  },
  blockchainScannerLink: {
    fontSize: FONTS.size.small,
    fontFamily: 'Roboto-Regular',
    color: '#1E3A8A',
    textDecorationLine: 'underline',
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