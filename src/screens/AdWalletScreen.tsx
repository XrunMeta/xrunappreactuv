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
import { useAppNavigation } from '../navigation';
import { formatCurrency, showToast, getColdStartResult, shareReferralLink } from '../utils';
import { useAlertDialog } from '../context/AlertDialogContext';
import {
  fetchADXRUNEstimateList,
  fetchADXRUNResultList,
  fetchADXRUNTopBanners,
  fetchADXRUNTopBannersSettled,
  fetchQuestList,
  joinQuest,
} from '../services';
import { loadAndShowRewardedAd, getPangleRewardedAdUnitId, isPangleReadySync } from '../services/pangle';
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
  hasAttended?: boolean; 
  is_rewarded?: boolean; 
  attendance_date?: string; 
  txHash?: string | null; 
  eventStatus?: string; 
  isReferralEvent?: boolean; 
  eventType?: string; 
  isReferralInvite?: boolean; 
}

export const AdWalletScreen = () => {
  const { t, i18n } = useTranslation();
  const { goBack } = useAppNavigation();
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

          const amountAsXrunNum = parseFloat(transaction.amountasxrun || '0');
          const flooredAmount = Math.floor(amountAsXrunNum * 100) / 100;
          const amountasxrun = `${flooredAmount.toFixed(2)} XRUN`;

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

      const translateText = (text: string | undefined): string | undefined => {
        if (!text) return text;

        let translated = text.trim().replace(/\s+/g, ' ');
        const originalText = text;

        if (__DEV__) {
          console.log('[AdWallet] 번역 전 텍스트:', {
            original: originalText,
            normalized: translated,
            language: i18n.language,
          });
        }

        if (translated === '초대를 받은 지인이 신규 가입을 완료하면, 초대자와 신규 가입자 두 분 모두에게 5 XRUN의 보상을 드립니다.') {
          return t('screens.adWallet.referralInviteDescription');
        }

        if (translated === '추천인 이벤트 보상을 받으세요' || translated.includes('추천인 이벤트 보상을 받으세요')) {
          return t('screens.adWallet.referralEventRewardReceive');
        }

        if (translated === '심사중인 추천인 이벤트입니다' || translated.includes('심사중인 추천인 이벤트입니다')) {
          return t('screens.adWallet.referralEventUnderReview');
        }

        if (translated.includes('보상') && translated.includes('지급이') && translated.includes('완료된') && translated.includes('추천인 이벤트') && translated.includes('입니다')) {
          return t('screens.adWallet.rewardPaymentCompletedReferralEvent');
        }

        if (translated === '보상 지급이 완료된 추천인 이벤트입니다' || translated.trim() === '보상 지급이 완료된 추천인 이벤트입니다') {
          return t('screens.adWallet.rewardPaymentCompletedReferralEvent');
        }

        if (translated === '추천인 이벤트 보상') {
          return t('screens.adWallet.referralEventReward');
        }

        if (translated === '로그인, 접속시에 출석 보상을 드립니다') {
          return t('screens.adWallet.attendanceRewardOnLogin');
        }

        if (translated === '전용 레퍼럴 코드를 지인에게 공유하기') {
          return t('screens.adWallet.exclusiveReferralCodeShare');
        }

        if (translated === '출석체크하기' || translated === '출석 체크하기') {
          return t('screens.adWallet.attendanceCheckDo');
        }

        if (translated === '소개 이벤트 보상을 받으세요') {
          return t('screens.adWallet.referralEventRewardTitle');
        }

        if (translated === '추천인 이벤트 보상 받기') {
          return t('screens.adWallet.referralEventRewardTitle');
        }

        if (translated.includes('보상을 받으세요')) {
          translated = translated.replace(/보상을 받으세요/g, t('screens.adWallet.receiveReward'));
        }

        if (translated.includes('보상 받기')) {
          translated = translated.replace(/보상 받기/g, t('screens.adWallet.receiveReward'));
        }

        if (translated.includes('출석보상')) {
          translated = translated.replace(/출석보상/g, t('screens.adWallet.attendanceCheckCompletedReward'));
        }

        if (translated.includes('정산완료')) {
          translated = translated.replace(/정산완료/g, t('screens.adWallet.settled'));
        }

        if (translated.includes('추천인 이벤트')) {
          translated = translated.replace(/추천인 이벤트/g, t('screens.adWallet.referralEvent'));
        }

        if (translated.includes('소개 이벤트')) {
          translated = translated.replace(/소개 이벤트/g, t('screens.adWallet.referralEvent'));
        }

        if (translated.includes('추천인초대보상')) {
          translated = translated.replace(/추천인초대보상/g, t('screens.adWallet.referralInviteReward'));
        }

        if (translated.includes('출석체크') && !translated.includes('출석체크하기') && !translated.includes('출석 체크하기')) {
          translated = translated.replace(/출석체크|출석 체크/g, t('screens.adWallet.attendanceCheck'));
        }

        if (translated.includes('전용 레퍼럴 코드') && !translated.includes('전용 레퍼럴 코드를 지인에게 공유하기')) {
          translated = translated.replace(/전용 레퍼럴 코드/g, t('screens.adWallet.exclusiveReferralCode'));
        }

        if (translated.includes('지인에게 공유하기') && !translated.includes('전용 레퍼럴 코드를 지인에게 공유하기')) {
          translated = translated.replace(/지인에게 공유하기/g, t('screens.adWallet.shareWithAcquaintances'));
        }

        if (translated.includes('심사중')) {
          translated = translated.replace(/심사중/g, t('screens.adWallet.pending'));
        }

        if (translated.includes('완료된')) {
          translated = translated.replace(/완료된/g, t('screens.adWallet.completedPast'));
        }

        if (translated.includes('완료')) {
          translated = translated.replace(/완료/g, t('screens.adWallet.completed'));
        }

        if (translated.includes('지급이 완료된')) {
          translated = translated.replace(/지급이 완료된/g, t('screens.adWallet.paymentCompleted'));
        }

        if (translated.includes('지급이')) {
          translated = translated.replace(/지급이/g, t('screens.adWallet.paymentIs'));
        }

        if (translated.includes('입니다')) {
          translated = translated.replace(/입니다/g, t('screens.adWallet.is'));
        }

        if (translated.includes('보상을 받으세요')) {
          translated = translated.replace(/보상을 받으세요/g, t('screens.adWallet.receiveReward'));
        }

        if (translated.includes('보상 받기')) {
          translated = translated.replace(/보상 받기/g, t('screens.adWallet.receiveReward'));
        }

        if (translated.includes('보상') && !translated.includes('보상을 받으세요') && !translated.includes('보상 받기')) {
          translated = translated.replace(/보상/g, t('screens.adWallet.reward'));
        }

        if (__DEV__ && originalText !== translated) {
          console.log('[AdWallet] 번역 후 텍스트:', {
            original: originalText,
            translated,
            language: i18n.language,
          });
        }

        return translated;
      };

      const displayTitle = isReferralEvent && !isReferralInvite 
        ? t('screens.adWallet.referralEventRewardTitle')
        : translateText(item.title);

      const displayDescription = translateText(item.description);
      const displayRewardDescription = translateText(item.reward_description);

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
      };
    },
    [t, formatDate, i18n],
  );

  const convertResultToAdEntry = useCallback(
    (item: ADXRUNResultItem): AdEntry => {

      const status =
        item.action === 3304 ? t('screens.adWallet.settled') : t('screens.adWallet.conditionNotMet');
      const date = formatDate(item.datetime);

      let expectedAdRevenue = '0 XRUN';
      expectedAdRevenue = `${item.expected} XRUN`;

      let adRevenueSettlement = '0.00 XRUN';
      if (item.amountasxrun) {
        const settlementNum = parseFloat(item.amountasxrun);
        const flooredSettlement = Math.floor(settlementNum * 100) / 100;
        adRevenueSettlement = `${flooredSettlement.toFixed(2)} XRUN`;
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

        const estimateResponse = await fetchADXRUNEstimateList(member, params.page);
        const estimateResponseData = estimateResponse.data || estimateResponse;
        const estimateItems = estimateResponseData.items || estimateResponseData || [];
        const pagination = estimateResponseData.pagination;

        let reviewReferralEvents: AdEntry[] = [];
        try {
          const questResponse = await fetchQuestList(member, goBack);
          const questItems = questResponse.data || [];

          const reviewEvents = questItems.filter((item: QuestItem) => {
            const isReferralEvent = item.event_type === 'recommendation' ||
              (typeof item.id === 'string' && item.id.startsWith('recommendation_'));

            return isReferralEvent && item.event_status === 'review';
          });

          reviewReferralEvents = reviewEvents.map((item: QuestItem) => {
            const adEntry = convertQuestToAdEntry(item);
            return {
              ...adEntry,
              extrastr3: '추천인이벤트', 
            };
          });

          console.log('[AdWallet] 심사중 탭 - review 상태 추천인 이벤트:', {
            개수: reviewReferralEvents.length,
            목록: reviewReferralEvents.map(e => ({
              id: e.id,
              title: e.title,
              eventStatus: e.eventStatus,
            })),
          });
        } catch (questError) {
          console.error('[AdWallet] 심사중 탭 - 추천인 이벤트 조회 오류:', questError);
        }

        const estimateAdEntries: AdEntry[] = estimateItems.map(convertEstimateToAdEntry);

        const filteredEstimateAdEntries = estimateAdEntries.filter((entry) => {

          if (entry.title) {
            return false;
          }
          return true;
        });

        const filteredReviewReferralEvents = reviewReferralEvents.filter((entry) => {

          if (entry.eventStatus === 'completed') {
            return false;
          }

          if (entry.originalDescription && entry.originalDescription.includes('완료')) {
            return false;
          }

          return entry.eventStatus === 'review';
        });

        const allAdEntries = [...filteredEstimateAdEntries, ...filteredReviewReferralEvents];

        let hasMore = false;
        if (pagination) {
          hasMore = pagination.hasNextPage || false;
        } else {
          hasMore = estimateItems.length > 0 && estimateItems.length >= params.pageSize;
        }

        return {
          data: allAdEntries,
          total: allAdEntries.length,
          hasMore,
        };
      } catch (error: any) {
        console.error('Failed to fetch pending data:', error);
        return { data: [], total: 0, hasMore: false };
      }
    },
    [member, convertEstimateToAdEntry, convertQuestToAdEntry, goBack],
  );

  const fetchQuestData = useCallback(
    async (params: PaginationParams): Promise<PaginationResponse<AdEntry>> => {
      try {

        const response = await fetchQuestList(member || undefined, goBack);

        const questItems = response.data || [];

        const adEntries: AdEntry[] = questItems.map(convertQuestToAdEntry);

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

        return {
          data: sortedAdEntries,
          total: sortedAdEntries.length,
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

        console.log('🔍 [fetchSettledData] responseData:', responseData);

        const adEntries: AdEntry[] = items.map(convertResultToAdEntry);

        let hasMore = false;
        if (pagination) {
          hasMore = pagination.hasNextPage || false;
        } else {
          hasMore = items.length > 0 && items.length >= params.pageSize;
        }

        console.log('🔍 [fetchSettledData] adEntries:', response);

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
        await shareReferralLink(t, { email: userEmail }, showAlert, goBack);
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

        if (isPangleReadySync()) {
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

                    questId = recommendationEventId;
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

                      questId = recommendationEventId;
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

                questId = recommendationEventId;
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

              questId = recommendationEventId;
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

      if (item.is_rewarded === true) {
        showToast(t('screens.adWallet.attendanceCheckAlreadyCompleted'));
        return;
      }

      setIsJoiningQuest(true);

      if (isPangleReadySync()) {
        try {
          console.log('[AdWallet] 출석체크 Pangle 광고 준비 완료 (Platform:', Platform.OS, ')');

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

  const AdEntryItem: React.FC<AdEntry & { onPress?: () => void; tab?: TabValue }> = (item) => {

    const isQuest = !!item.title || item.extrastr3 === '추천인이벤트';
    const { onPress, tab: itemTab, ...itemData } = item;

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
        ) : item.extrastr3 === '출석보상' ? (
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
        ) : item.extrastr3 === '추천인이벤트' ? (

          <View style={styles.adCardRow}>
            <Text style={[
              styles.adCardRowLabel,
              isDisabled && { color: disabledColor }
            ]}>
              추천인초대보상
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
            {!isQuest && item.extrastr3 !== '출석보상' && (
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