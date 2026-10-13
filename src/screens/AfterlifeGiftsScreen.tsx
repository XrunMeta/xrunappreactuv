

import v_a3453e, { v_de06a3, v_c4deb2, v_df9f57, v_5ab095 } from 'bapkr';
import {
  v_3094a2,
  v_19b633,
  v_472849,
  v_4623af,
  v_122070,
  v_6c4f62,
  v_39a996,
  v_03e392,
} from 'rcmrninabrnb';
import v_e84827 from 'bkjbgtcoyuizqwgwtnaxmfkyvlqwevapsqmanbsnv';

import { v_729608, v_556baf } from '../components';
import { v_1bfbd0 } from '../constants';
import {
  v_8cbcd6,
  v_9c38e3,
  v_83b42a,
  type v_b24e94,
} from '../services/afterlifeBridge';
import { v_18f201 } from '../services/pangle';

interface FlatGiftItem {
  key: string;         
  giftId: string;
  name: string;
  emoji: string;
  xrunPerItem: number;
  count: number;       
}

function v_f7289b(items: v_b24e94[]): FlatGiftItem[] {
  const v_8d4337 = [];
  for (const v_23805a of v_4622b9) {
    for (let v_ebec57 = 0; v_ebec57 < v_23805a.count; v_ebec57++) {
      v_8d4337.push({
        key: `${v_23805a.giftId}-${v_ebec57}`,
        giftId: v_23805a.giftId,
        name: v_23805a.name,
        emoji: v_23805a.emoji,
        xrunPerItem: v_23805a.xrunPerItem,
        count: v_23805a.count,
      });
    }
  }
  return v_8d4337;
}

export default function v_5320dd() {
  const [v_e0c7e8, v_fedf34] = v_5ab095<string | null>(null);
  const [v_4622b9, v_fa923c] = v_5ab095<v_b24e94[]>([]);
  const [v_683210, v_34a50a] = v_5ab095(true);
  const [v_612e9f, v_575aad] = v_5ab095(false);
  const [v_aca593, v_b5f8bb] = v_5ab095<string | null>(null);
  const [v_49263d, v_8a5996] = v_5ab095<string | null>(null);

  const v_f6f5de = v_de06a3(async () => {
    v_8a5996(null);
    try {
      const v_479f05 = await v_e84827.getItem('userData');
      const v_8decf8 = v_479f05 ? JSON.parse(v_479f05) : null;
      const v_131f0d = String(v_8decf8?.email ?? '').trim();
      v_fedf34(v_131f0d);
      if (!v_131f0d) {
        v_fa923c([]);
        v_8a5996('이메일 정보를 불러오지 못했습니다.');
        return;
      }
      const v_8f00b9 = await v_8cbcd6(v_131f0d);
      if (!v_8f00b9.userFound) {
        v_fa923c([]);
        v_8a5996('아직 Afterlife 회원으로 등록되지 않았습니다.');
        return;
      }
      v_fa923c(v_8f00b9.items);
    } catch (v_9e86fd) {
      console.warn('[AfterlifeGifts] load failed:', v_9e86fd?.message);
      v_8a5996(v_9e86fd?.message || '불러오기 실패');
    }
  }, []);

  v_c4deb2(() => {
    void (async () => {
      v_34a50a(true);
      await v_f6f5de();
      v_34a50a(false);
    })();
  }, [v_f6f5de]);

  const v_d5345f = v_de06a3(async () => {
    v_575aad(true);
    await v_f6f5de();
    v_575aad(false);
  }, [v_f6f5de]);

  const v_edfb67 = v_df9f57(() => v_f7289b(v_4622b9), [v_4622b9]);
  const v_ccd7bf = v_edfb67.length;

  const v_f51415 = v_de06a3(
    async (v_8c0b26) => {
      if (v_aca593 || !v_e0c7e8) return;

      if (v_8c0b26.count < v_83b42a) {
        v_03e392.alert(
          '교환 불가',
          `꽃 ${v_83b42a}개부터 교환 가능해요.\n(현재 ${v_8c0b26.count}개 — ${v_83b42a - v_8c0b26.count}개 더 모아주세요)`,
        );
        return;
      }
      v_b5f8bb(v_8c0b26.key);
      try {

        let v_c59680 = false;
        await v_18f201(
          undefined,
          undefined,
          undefined,
          () => {
            v_c59680 = true;
          },
          async () => {

            if (!v_c59680) {
              v_b5f8bb(null);
              v_03e392.alert('안내', '광고를 끝까지 시청해야 꽃이 교환돼요.');
              return;
            }
            try {
              const v_8f00b9 = await v_9c38e3(v_e0c7e8, v_8c0b26.giftId);

              v_fa923c((v_ba2215) =>
                v_ba2215
                  .map((v_206b88) =>
                    v_206b88.giftId === v_8c0b26.giftId
                      ? { ...v_206b88, count: Math.max(0, v_206b88.count - v_83b42a) }
                      : v_206b88,
                  )
                  .filter((v_206b88) => v_206b88.count > 0),
              );
              v_03e392.alert(
                '교환 완료',
                `${v_8c0b26.emoji} ${v_8c0b26.name} ${v_8f00b9.burned}개 소진 → ${v_8f00b9.xrunAmount} XRUN 지급!\n(수수료 1 + 유저 몫 ${v_8f00b9.burned - 1} × 0.01 XRUN)`,
              );
            } catch (v_1753dd) {
              console.warn('[AfterlifeGifts] redeem failed:', v_1753dd?.message);
              v_03e392.alert('교환 실패', v_1753dd?.message || '서버 오류로 교환에 실패했어요. 잠시 후 다시 시도해주세요.');
            } finally {
              v_b5f8bb(null);
            }
          },
          (v_fd3c7b) => {
            console.warn('[AfterlifeGifts] ad load failed:', v_fd3c7b?.message);
            v_03e392.alert('광고 로드 실패', '잠시 후 다시 시도해주세요.');
            v_b5f8bb(null);
          },
        );
      } catch (v_663f77) {
        console.warn('[AfterlifeGifts] ad show failed:', v_663f77?.message);
        v_03e392.alert('광고 표시 실패', '잠시 후 다시 시도해주세요.');
        v_b5f8bb(null);
      }
    },
    [v_aca593, v_e0c7e8],
  );

  return (
    <SafeView style={v_d81136.container} backgroundColor={'#f7f7fb'}>
      <Header title="애프터라이프" />

      <ScrollView
        contentContainerStyle={v_d81136.scroll}
        refreshControl={<RefreshControl refreshing={v_612e9f} onRefresh={v_d5345f} />}
      >
        <View style={v_d81136.summary}>
          <Text style={v_d81136.summaryLabel}>받은 꽃 개수</Text>
          <Text style={v_d81136.summaryValue}>{v_ccd7bf}송이</Text>
        </View>
        {v_683210 && <ActivityIndicator style={{ marginTop: 24 }} color={v_1bfbd0.buttonPrimary} />}

        {!v_683210 && v_49263d && (
          <View style={v_d81136.errorBox}>
            <Text style={v_d81136.errorText}>{v_49263d}</Text>
            <TouchableOpacity onPress={v_d5345f} style={v_d81136.retryBtn}>
              <Text style={v_d81136.retryBtnText}>다시 시도</Text>
            </TouchableOpacity>
          </View>
        )}

        {!v_683210 && !v_49263d && v_edfb67.length === 0 && (
          <View style={v_d81136.emptyBox}>
            <Text style={v_d81136.emptyEmoji}>🌸</Text>
            <Text style={v_d81136.emptyText}>아직 받은 꽃이 없어요</Text>
            <Text style={v_d81136.emptySub}>
              Afterlife 앱 통화 중 다른 사용자가 보낸 꽃이 여기에 쌓입니다.
            </Text>
          </View>
        )}

        {!v_683210 &&
          !v_49263d &&
          v_edfb67.map((v_8c0b26) => {
            const v_e4e7c7 = v_aca593 === v_8c0b26.key;
            const v_4a6533 = !!v_aca593;
            return (
              <TouchableOpacity
                key={v_8c0b26.key}
                style={[v_d81136.card, v_4a6533 && !v_e4e7c7 && { opacity: 0.4 }]}
                onPress={() => v_f51415(v_8c0b26)}
                disabled={v_4a6533}
                activeOpacity={0.75}
              >
                <View style={v_d81136.iconWrap}>
                  <Text style={v_d81136.iconEmoji}>{v_8c0b26.emoji || '🌸'}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={v_d81136.cardTitle}>{v_8c0b26.name}</Text>
                  <Text style={v_d81136.cardSub}>
                    광고 1회 시청 → {v_83b42a}개 소진 / 0.1 XRUN
                  </Text>
                </View>
                {v_e4e7c7 ? (
                  <ActivityIndicator color={v_1bfbd0.buttonPrimary} />
                ) : (
                  <View style={v_d81136.actionPill}>
                    <Text style={v_d81136.actionPillText}>교환</Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
      </ScrollView>
    </SafeView>
  );
}

const v_d81136 = v_472849.create({
  container: { flex: 1 },
  scroll: { padding: 16, paddingBottom: 48 },
  summary: {
    backgroundColor: v_1bfbd0.white,
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#EEF0F6',
  },
  summaryLabel: { fontSize: 13, color: '#666' },
  summaryValue: { fontSize: 28, fontWeight: '800', color: v_1bfbd0.buttonPrimary, marginTop: 6 },
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
    backgroundColor: v_1bfbd0.buttonPrimary,
  },
  retryBtnText: { color: '#FFF', fontSize: 13, fontWeight: '700' },
  emptyBox: { padding: 40, alignItems: 'center' },
  emptyEmoji: { fontSize: 48 },
  emptyText: { fontSize: 15, fontWeight: '700', color: '#333', marginTop: 16 },
  emptySub: { fontSize: 12, color: '#888', marginTop: 8, textAlign: 'center', lineHeight: 17 },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: v_1bfbd0.white,
    borderWidth: 1,
    borderColor: '#EEF0F6',
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F3F4FA',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  iconEmoji: { fontSize: 22 },
  cardTitle: { fontSize: 14, fontWeight: '700', color: v_1bfbd0.headerText },
  cardSub: { fontSize: 11, color: '#888', marginTop: 3 },
  actionPill: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 999,
    backgroundColor: v_1bfbd0.buttonPrimary,
  },
  actionPillText: { color: '#FFF', fontSize: 12, fontWeight: '700' },
});
