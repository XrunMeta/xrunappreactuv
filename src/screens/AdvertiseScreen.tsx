import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  FlatList,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Header } from '../components';
import { COLORS } from '../constants';
import { useAppNavigation } from '../navigation';
import { getCompletedAds, getSavedAds } from '../services';
import { CompletedAdItem } from '../types';

interface CompletedAdData {
  transaction: string | number;
  title: string;
  coin: string;
  extracode: string | number;
  datetime: string;
  statusSuccess: string;
  statusPending: string;
}

const dateFormatter = (dateString: string): string => {
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

export const AdvertiseScreen = () => {
  const { t } = useTranslation();
  const { goBack } = useAppNavigation();
  const [memberId, setMemberId] = useState<number | null>(null);
  const [completedAds, setCompletedAds] = useState<CompletedAdData[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

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
        console.error('[광고] 사용자 정보 로드 실패:', error);
      }
    };
    loadUserData();
  }, []);

  const loadCompletedAds = useCallback(async () => {
    if (!memberId) return;

    try {
      setLoading(true);
      const response = await getCompletedAds(memberId, goBack);

      if (response && response.data && response.data.length > 0) {

        const filteredAds = response.data
          .filter((ad) => ad.title && ad.title.trim() !== '')
          .map((ad: CompletedAdItem) => {
            const localizedDatetime = dateFormatter(ad.datetime);
            return {
              transaction: ad.transaction,
              title: ad.title || ad.actiontext || ad.extratext || t('screens.advertiseScreen.coinAcquisition'),
              coin: `${ad.amount} ${ad.symbol}`,
              extracode: ad.extracode,
              datetime: localizedDatetime,
              statusSuccess: t('screens.advertiseScreen.statusSuccess'),
              statusPending: t('screens.advertiseScreen.statusPending'),
            };
          });

        setCompletedAds(filteredAds);

        try {
          await getSavedAds(memberId, 'datetime', goBack);
        } catch (error) {
          console.error('[광고] 저장된 광고 목록 조회 실패:', error);
        }
      } else {
        setCompletedAds([]);

        try {
          await getSavedAds(memberId, 'datetime', goBack);
        } catch (error) {
          console.error('[광고] 저장된 광고 목록 조회 실패:', error);
        }
      }
    } catch (error) {
      console.error('[광고] 완료된 광고 조회 실패:', error);
      setCompletedAds([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [memberId, goBack]);

  useEffect(() => {
    if (memberId) {
      loadCompletedAds();
    }
  }, [memberId, loadCompletedAds]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadCompletedAds();
  }, [loadCompletedAds]);

  const completedRenderItem = ({ item }: { item: CompletedAdData }) => {
    const statusText =
      item.extracode === '9416' || item.extracode === 9416
        ? item.statusPending
        : item.statusSuccess;

    return (
      <View style={styles.listItem} key={String(item.transaction)}>
        <View style={styles.listUpWrapper}>
          <Text
            style={[styles.mediumText, { width: 160 }]}
            ellipsizeMode="tail"
            numberOfLines={1}
          >
            {item.title}
          </Text>
          <Text style={[styles.smallText, { marginTop: -4 }]}>{statusText}</Text>
        </View>
        <View style={[styles.listUpWrapper, { marginTop: -5, marginBottom: 8 }]}>
          <Text style={[styles.smallText, { marginTop: -1 }]}>{item.datetime}</Text>
          <Text style={styles.mediumText}>{item.coin}</Text>
        </View>
      </View>
    );
  };

  const completedKeyExtractor = (item: CompletedAdData) => String(item.transaction);

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <Header title={t('screens.advertiseScreen.title')} onBackPress={goBack} showBackButton />
      <View style={styles.content}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={COLORS.buttonPrimary} />
            <Text style={[styles.normalText, { color: '#7d7e83', marginTop: 12 }]}>
              {t('screens.advertiseScreen.loading')}
            </Text>
          </View>
        ) : completedAds.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>{t('screens.advertiseScreen.emptyMessage')}</Text>
          </View>
        ) : (
          <FlatList
            data={completedAds}
            keyExtractor={completedKeyExtractor}
            renderItem={completedRenderItem}
            contentContainerStyle={styles.listContent}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            showsVerticalScrollIndicator={false}
          />
        )}
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
  listContent: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 32,
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
  },
  listUpWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  mediumText: {
    fontSize: 16,
    fontFamily: 'Roboto-SemiBold',
    color: '#343434',
  },
  smallText: {
    fontSize: 12,
    fontFamily: 'Roboto-Regular',
    color: '#707070',
  },
  normalText: {
    fontSize: 14,
    fontFamily: 'Roboto-Regular',
    color: '#343434',
  },
});

