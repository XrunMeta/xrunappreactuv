

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

import { useAppNavigation } from '../navigation';
import {
  fetchAfterlifeReceivedGifts,
  redeemAfterlifeGiftWithAd,
  type AfterlifeReceivedGift,
} from '../services/afterlifeBridge';
import { loadAndShowRewardedAd } from '../services/pangle';

interface FlatGiftItem {
  key: string;         
  giftId: string;
  name: string;
  emoji: string;
  xrunPerItem: number;
}

function flattenGifts(items: AfterlifeReceivedGift[]): FlatGiftItem[] {
  const out: FlatGiftItem[] = [];
  for (const it of items) {
    for (let i = 0; i < it.count; i++) {
      out.push({
        key: `${it.giftId}-${i}`,
        giftId: it.giftId,
        name: it.name,
        emoji: it.emoji,
        xrunPerItem: it.xrunPerItem,
      });
    }
  }
  return out;
}

export default function AfterlifeGiftsScreen() {
  const { goBack } = useAppNavigation();
  const [email, setEmail] = useState<string | null>(null);
  const [items, setItems] = useState<AfterlifeReceivedGift[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [redeemingKey, setRedeemingKey] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  const load = useCallback(async () => {
    setErr(null);
    try {
      const raw = await AsyncStorage.getItem('userData');
      const parsed = raw ? JSON.parse(raw) : null;
      const em = String(parsed?.email ?? '').trim();
      setEmail(em);
      if (!em) {
        setItems([]);
        setErr('이메일 정보를 불러오지 못했습니다.');
        return;
      }
      const res = await fetchAfterlifeReceivedGifts(em);
      if (!res.userFound) {
        setItems([]);
        setErr('아직 Afterlife 회원으로 등록되지 않았습니다.');
        return;
      }
      setItems(res.items);
    } catch (e: any) {
      console.warn('[AfterlifeGifts] load failed:', e?.message);
      setErr(e?.message || '불러오기 실패');
    }
  }, []);

  useEffect(() => {
    void (async () => {
      setLoading(true);
      await load();
      setLoading(false);
    })();
  }, [load]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  }, [load]);

  const flatItems = useMemo(() => flattenGifts(items), [items]);
  const totalCount = flatItems.length;

  const handleRedeem = useCallback(
    async (item: FlatGiftItem) => {
      if (redeemingKey || !email) return;
      setRedeemingKey(item.key);
      try {

        let rewarded = false;
        await loadAndShowRewardedAd(
          undefined,
          undefined,
          undefined,
          () => {
            rewarded = true;
          },
          async () => {

            if (!rewarded) {
              setRedeemingKey(null);
              Alert.alert('안내', '광고를 끝까지 시청해야 꽃이 교환돼요.');
              return;
            }
            try {
              const res = await redeemAfterlifeGiftWithAd(email, item.giftId);

              setItems((prev) =>
                prev
                  .map((g) => (g.giftId === item.giftId ? { ...g, count: Math.max(0, g.count - 1) } : g))
                  .filter((g) => g.count > 0),
              );
              Alert.alert(
                '교환 완료',
                `${item.emoji} ${item.name} 1송이 → 사용 가능한 꽃으로 전환됐어요!\nAfterlife 통화 화면 선물 시트에서 사용할 수 있습니다.\n(+${res.xrunAmount.toFixed(2)} XRUN 상당)`,
              );
            } catch (redeemErr: any) {
              console.warn('[AfterlifeGifts] redeem failed:', redeemErr?.message);
              Alert.alert('교환 실패', redeemErr?.message || '서버 오류로 교환에 실패했어요. 잠시 후 다시 시도해주세요.');
            } finally {
              setRedeemingKey(null);
            }
          },
          (loadErr) => {
            console.warn('[AfterlifeGifts] ad load failed:', loadErr?.message);
            Alert.alert('광고 로드 실패', '잠시 후 다시 시도해주세요.');
            setRedeemingKey(null);
          },
        );
      } catch (adErr: any) {
        console.warn('[AfterlifeGifts] ad show failed:', adErr?.message);
        Alert.alert('광고 표시 실패', '잠시 후 다시 시도해주세요.');
        setRedeemingKey(null);
      }
    },
    [redeemingKey, email],
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={goBack} style={styles.backButton} hitSlop={8}>
          <Ionicons name="chevron-back" size={24} color="#111" />
        </TouchableOpacity>
        <Text style={styles.title}>애프터라이프 받은 꽃</Text>
        <View style={styles.backButton} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scroll}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <View style={styles.summary}>
          <Text style={styles.summaryLabel}>받은 꽃 개수</Text>
          <Text style={styles.summaryValue}>{totalCount}송이</Text>
        </View>
        <Text style={styles.subtext}>
          각 꽃을 눌러 광고를 보면{'\n'}Afterlife 통화 중 보낼 수 있는 꽃으로 전환됩니다.
        </Text>

        {loading && <ActivityIndicator style={{ marginTop: 24 }} />}

        {!loading && err && (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{err}</Text>
            <TouchableOpacity onPress={onRefresh} style={styles.retryBtn}>
              <Text style={styles.retryBtnText}>다시 시도</Text>
            </TouchableOpacity>
          </View>
        )}

        {!loading && !err && flatItems.length === 0 && (
          <View style={styles.emptyBox}>
            <Text style={styles.emptyEmoji}>🌸</Text>
            <Text style={styles.emptyText}>아직 받은 꽃이 없어요</Text>
            <Text style={styles.emptySub}>
              Afterlife 앱 통화 중 다른 사용자가 보낸 꽃이 여기에 쌓입니다.
            </Text>
          </View>
        )}

        {!loading &&
          !err &&
          flatItems.map((item) => {
            const isRedeeming = redeemingKey === item.key;
            const disabled = !!redeemingKey;
            return (
              <TouchableOpacity
                key={item.key}
                style={[styles.card, disabled && !isRedeeming && { opacity: 0.4 }]}
                onPress={() => handleRedeem(item)}
                disabled={disabled}
                activeOpacity={0.75}
              >
                <View style={styles.iconWrap}>
                  <Text style={styles.iconEmoji}>{item.emoji || '🌸'}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.cardTitle}>{item.name}</Text>
                  <Text style={styles.cardSub}>광고 1회 시청 → 사용 가능 꽃 +1</Text>
                </View>
                {isRedeeming ? (
                  <ActivityIndicator />
                ) : (
                  <View style={styles.actionPill}>
                    <Text style={styles.actionPillText}>광고 보고 교환</Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  header: {
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E5E7EB',
  },
  backButton: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 16, fontWeight: '700', color: '#111' },
  scroll: { padding: 16, paddingBottom: 48 },
  summary: {
    backgroundColor: '#FFF4F8',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
  },
  summaryLabel: { fontSize: 13, color: '#666' },
  summaryValue: { fontSize: 28, fontWeight: '800', color: '#E8368F', marginTop: 6 },
  subtext: {
    fontSize: 13,
    color: '#666',
    textAlign: 'center',
    marginTop: 12,
    marginBottom: 20,
    lineHeight: 18,
  },
  errorBox: { padding: 24, alignItems: 'center' },
  errorText: { color: '#B91C1C', fontSize: 13, textAlign: 'center' },
  retryBtn: {
    marginTop: 12,
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: '#E8368F',
  },
  retryBtnText: { color: '#FFF', fontSize: 13, fontWeight: '700' },
  emptyBox: { padding: 40, alignItems: 'center' },
  emptyEmoji: { fontSize: 48 },
  emptyText: { fontSize: 15, fontWeight: '700', color: '#333', marginTop: 16 },
  emptySub: { fontSize: 12, color: '#888', marginTop: 8, textAlign: 'center', lineHeight: 17 },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#EFEFEF',
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFF4F8',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  iconEmoji: { fontSize: 22 },
  cardTitle: { fontSize: 14, fontWeight: '700', color: '#111' },
  cardSub: { fontSize: 11, color: '#888', marginTop: 3 },
  actionPill: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 999,
    backgroundColor: '#E8368F',
  },
  actionPillText: { color: '#FFF', fontSize: 12, fontWeight: '700' },
});
