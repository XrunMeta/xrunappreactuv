import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BigNumber from 'bignumber.js';
import { useTranslation } from 'react-i18next';

import { DataList } from '../components';
import { formatCurrency, showToast, getColdStartResult, shareReferralLink } from '../utils';
import { useAppNavigation } from '../navigation';
import { useAlertDialog } from '../context/AlertDialogContext';

import {
  fetchADXRUNEstimateList,
  fetchQuestList,
  joinQuest,
  getSettlementCompletedList,
} from '../services';

import {
  loadAndShowRewardedAd,
  getPangleRewardedAdUnitId,
  isPangleReadySync,
} from '../services/pangle';

import { collectDeviceInfo } from '../utils/napApiUtils';
import { DataListRef, PaginationParams, PaginationResponse } from '../types/pagination';
import {
  ADXRUNEstimateItem,
  QuestItem,
  SettlementCompletedItem,
} from '../types';

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
  const [isColdStart, setIsColdStart] = useState<boolean | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [isJoiningQuest, setIsJoiningQuest] = useState(false);

  const pendingListRef = useRef<DataListRef>(null);
  const questListRef = useRef<DataListRef>(null);
  const settledListRef = useRef<DataListRef>(null);

  useEffect(() => {
    (async () => {
      const raw = await AsyncStorage.getItem('userData');
      if (!raw) return;
      const parsed = JSON.parse(raw);
      setMember(parsed.member);
      setUserEmail(parsed.email ?? null);
    })();
  }, []);

  useEffect(() => {
    (async () => {
      const result = await getColdStartResult();
      setIsColdStart(result?.isColdStart ?? true);
    })();
  }, []);

  const formatDate = useCallback(
    (utc?: string) => {
      if (!utc) return '-';
      const d = new Date(utc.endsWith('Z') ? utc : `${utc}Z`);
      if (isNaN(d.getTime())) return '-';

      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      const h = String(d.getHours()).padStart(2, '0');
      const min = String(d.getMinutes()).padStart(2, '0');

      return i18n.language === 'ko'
        ? `${y}.${m}.${day} ${h}:${min}`
        : `${m}/${day}/${y} ${h}:${min}`;
    },
    [i18n.language],
  );

  const convertEstimate = (item: ADXRUNEstimateItem): AdEntry => ({
    id: item.transaction || item.id,
    status: t('screens.adWallet.pending'),
    date: formatDate(item.datetime),
    expectedAdRevenue: `${Number(item.amountasxrun || 0).toFixed(2)} XRUN`,
    adRevenueSettlement: '-',
    expectedAdRevenueColor: '#707070',
    adRevenueSettlementColor: '#343434',
    extrastr3: item.extrastr3,
  });

  const convertQuest = (item: QuestItem): AdEntry => {
    const isInvite = item.event_type === 'recommendation_invite';
    const isReferral =
      item.event_type === 'recommendation' ||
      (typeof item.id === 'string' && item.id.startsWith('recommendation_'));

    const reward = isInvite ? 0 : Number(item.reward_amount_asxrun || 0);

    return {
      id: item.id,
      status: t('screens.adWallet.quest'),
      date: formatDate(item.start_date || item.created_at),
      expectedAdRevenue: `${reward.toFixed(2)} XRUN`,
      adRevenueSettlement: '-',
      expectedAdRevenueColor: '#707070',
      adRevenueSettlementColor: '#343434',
      title: item.title,
      description: item.description,
      eventStatus: item.event_status,
      isReferralEvent: isReferral,
      isReferralInvite: isInvite,
      eventType: item.event_type,
    };
  };

  const convertSettlement = (item: SettlementCompletedItem): AdEntry => ({
    id: item.txHash || `${item.member}-${item.created_at}`,
    status: t('screens.adWallet.settled'),
    date: formatDate(item.created_at),
    expectedAdRevenue: '',
    adRevenueSettlement: `${Number(item.amount || 0).toFixed(2)} XRUN`,
    expectedAdRevenueColor: '#111',
    adRevenueSettlementColor: '#111',
    txHash: item.txHash,
  });

  const fetchPendingData = async (
    params: PaginationParams,
  ): Promise<PaginationResponse<AdEntry>> => {
    if (!member) return { data: [], total: 0, hasMore: false };
    const res = await fetchADXRUNEstimateList(member, params.page);
    const items = (res.data?.items ?? []).map(convertEstimate);
    return { data: items, total: items.length, hasMore: false };
  };

  const fetchQuestData = async (): Promise<PaginationResponse<AdEntry>> => {
    const res = await fetchQuestList(member ?? undefined, goBack);
    const items = (res.data ?? []).map(convertQuest);
    return { data: items, total: items.length, hasMore: false };
  };

  const fetchSettledData = async (): Promise<PaginationResponse<AdEntry>> => {
    if (!member) return { data: [], total: 0, hasMore: false };
    const res = await getSettlementCompletedList(member, goBack);
    const items = (res.data ?? []).map(convertSettlement);
    return { data: items, total: items.length, hasMore: false };
  };

  const AdEntryItem = (item: AdEntry & { onPress?: () => void }) => {
    const isQuest = !!item.title;
    const isSettledTab = tab === 'settled';

    return (
      <TouchableOpacity style={styles.card} onPress={item.onPress}>
        <View style={styles.header}>
          <Text style={styles.status}>{item.status}</Text>
          <Text style={styles.date}>{item.date}</Text>
        </View>

        {isQuest && (
          <View>
            <Text style={styles.title}>{item.title}</Text>
            {item.description && (
              <Text style={styles.desc}>{item.description}</Text>
            )}
          </View>
        )}

        <View style={styles.row}>
          <Text style={styles.label}>
            {isQuest
              ? t('screens.adWallet.rewardAmount')
              : isSettledTab
              ? t('screens.adWallet.adRevenueSettlement')
              : t('screens.adWallet.expectedAdRevenue')}
          </Text>
          <Text style={styles.amount}>
            {isSettledTab
              ? item.adRevenueSettlement
              : item.expectedAdRevenue}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return null;
};

const styles = StyleSheet.create({
  card: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#fff',
    marginBottom: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  status: {
    fontSize: 12,
    fontWeight: '600',
  },
  date: {
    fontSize: 12,
    color: '#888',
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
    marginTop: 8,
  },
  desc: {
    fontSize: 13,
    color: '#666',
    marginTop: 4,
  },
  row: {
    marginTop: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  label: {
    fontSize: 13,
    color: '#666',
  },
  amount: {
    fontSize: 14,
    fontWeight: '600',
  },
});
