

import v_a3453e, { v_de06a3, v_c4deb2, v_5ab095 } from 'bapkr';
import {
  v_3094a2,
  v_19b633,
  v_472849,
  v_4623af,
  v_122070,
  v_6c4f62,
  v_39a996,
  v_f2c756,
} from 'rcmrninabrnb';
import v_e84827 from 'bkjbgtcoyuizqwgwtnaxmfkyvlqwevapsqmanbsnv';
import { v_772971 } from 'jmpfvteuuztnp';

import { v_729608, v_f16775, v_556baf } from '../components';
import { v_1bfbd0 } from '../constants';
import { v_4b1173 } from '../context/AlertDialogContext';
import { v_a0daa8, v_ce4741 } from '../navigation';
import {
  v_925786,
  v_921d50,
  type v_922496,
} from '../services/afterlifeRewards';
import { v_18f201 } from '../services/pangle';
import { v_dd87bc } from '../services';
import { v_b9db3d, v_d7e45e } from '../utils';
import { v_5f124d } from '../utils/walletEvents';

export const v_ccfe3c = 'pendingAfterlifeExpectedMember';

function v_e065e5(v_fd5f43): string {
  if (!v_fd5f43) return '';
  const v_d5dda0 = new Date(`${v_fd5f43.replace(' ', 'T')}Z`);
  if (Number.isNaN(v_d5dda0.getTime())) return '';
  return `${v_d5dda0.getMonth() + 1}월 ${v_d5dda0.getDate()}일 ${String(v_d5dda0.getHours()).padStart(2, '0')}:${String(v_d5dda0.getMinutes()).padStart(2, '0')}`;
}

export default function v_5320dd() {
  const { t: v_8d41d7 } = v_772971();
  const { showAlert: v_889fad } = v_4b1173();
  const { navigate: v_9b57fc } = v_a0daa8();
  const [v_483de2, v_266e0d] = v_5ab095<v_922496[]>([]);
  const [v_0a2cd1, v_3bc8b6] = v_5ab095<v_922496[]>([]);
  const [v_30ea43, v_06b04b] = v_5ab095(0);
  const [v_683210, v_34a50a] = v_5ab095(true);
  const [v_612e9f, v_575aad] = v_5ab095(false);
  const [v_56eae3, v_0141c0] = v_5ab095<number | null>(null);
  const [v_49263d, v_8a5996] = v_5ab095<string | null>(null);
  const [v_beea9d, v_0d9a89] = v_5ab095<number>(0);

  const v_f6f5de = v_de06a3(async () => {
    v_8a5996(null);
    try {
      const v_8f00b9 = await v_925786(v_9b57fc);
      v_266e0d(v_8f00b9.pending);
      v_3bc8b6(v_8f00b9.claimed);
      v_06b04b(v_8f00b9.pendingTotal);
    } catch (v_9e86fd) {
      console.warn('[AfterlifeRewards] load failed:', v_9e86fd?.message);
      v_8a5996(v_8d41d7('screens.afterlifeGifts.errors.loadFailed'));
    }
  }, [v_9b57fc, v_8d41d7]);

  v_c4deb2(() => {
    void (async () => {
      v_34a50a(true);
      await v_f6f5de();
      v_34a50a(false);
    })();
  }, [v_f6f5de]);

  const v_835a23 = v_de06a3(async () => {
    try {
      const v_505a6d = await v_e84827.getItem(v_ccfe3c);
      if (!v_505a6d) return;
      await v_e84827.removeItem(v_ccfe3c);
      const v_479f05 = await v_e84827.getItem('userData');
      const v_b32680 = v_479f05 ? Number(JSON.parse(v_479f05)?.member) : 0;
      if (v_b32680 && Number(v_505a6d) > 0 && Number(v_505a6d) !== v_b32680) {
        await v_889fad(
          v_8d41d7('screens.afterlifeGifts.p5Title', { defaultValue: '다른 계정으로 로그인되어 있어요' }),
          v_8d41d7('screens.afterlifeGifts.p5Body', {
            defaultValue: 'XRUN에 로그인된 계정이 Afterlife 계정과 달라요. 같은 계정으로 다시 로그인해주세요.',
          }),
          [
            { text: v_8d41d7('screens.afterlifeGifts.cancel', { defaultValue: '취소' }), style: 'cancel' },
            {
              text: v_8d41d7('screens.afterlifeGifts.relogin', { defaultValue: '다시 로그인' }),
              onPress: () => v_9b57fc(v_ce4741.myInfo as any),
            },
          ],
        );
      }
    } catch {

      }
  }, [v_9b57fc, v_889fad, v_8d41d7]);

  v_c4deb2(() => {
    void v_835a23();
  }, [v_835a23]);

  v_c4deb2(
    () =>
      v_5f124d(() => {
        void v_f6f5de();
        void v_835a23();
      }),
    [v_f6f5de, v_835a23],
  );

  v_c4deb2(() => {
    (async () => {
      try {
        const v_43c42e = await v_dd87bc();
        const v_6bbb57 = Number(v_43c42e?.data?.gopaxPrice ?? 0);
        if (v_6bbb57 > 0) {
          v_0d9a89(v_6bbb57);
          await v_e84827.setItem('xrungopaxprice', JSON.stringify(v_43c42e));
          return;
        }
      } catch {}
      try {
        const v_e2a6a6 = await v_e84827.getItem('xrungopaxprice');
        if (v_e2a6a6) {
          const v_6bbb57 = Number(JSON.parse(v_e2a6a6)?.data?.gopaxPrice ?? 0);
          if (v_6bbb57 > 0) v_0d9a89(v_6bbb57);
        }
      } catch {}
    })();
  }, []);

  const v_d5345f = v_de06a3(async () => {
    v_575aad(true);
    await v_f6f5de();
    v_575aad(false);
  }, [v_f6f5de]);

  const v_3249c2 = v_de06a3(
    async (item: v_922496) => {
      if (v_56eae3 !== null) return;
      v_0141c0(v_8c0b26.id);
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
              v_0141c0(null);
              await v_889fad(
                v_8d41d7('screens.afterlifeGifts.alerts.noticeTitle'),
                v_8d41d7('screens.afterlifeGifts.adNotWatchedReward', { defaultValue: '광고를 끝까지 시청해야 보상을 받을 수 있어요.' }),
              );
              return;
            }
            try {
              await v_921d50(v_8c0b26.id, v_9b57fc);
              void v_f6f5de();
              await v_889fad(
                v_8d41d7('screens.afterlifeGifts.claimDoneTitle', { defaultValue: '보상을 받았어요' }),
                v_8d41d7('screens.afterlifeGifts.claimDoneMsg', {
                  defaultValue: `${v_8c0b26.xrunAmount} XRUN이 지갑에 입금됐어요.`,
                  xrun: v_8c0b26.xrunAmount,
                }),
              );
            } catch (v_59289a) {
              const v_d308b5 = v_59289a?.response?.status;
              console.warn('[AfterlifeRewards] claim failed:', v_d308b5, v_59289a?.message);
              void v_f6f5de();
              await v_889fad(
                v_8d41d7('screens.afterlifeGifts.claimFailTitle', { defaultValue: '받지 못했어요' }),
                v_d308b5 === 409
                  ? v_8d41d7('screens.afterlifeGifts.alreadyClaimed', { defaultValue: '이미 받은 보상이에요.' })
                  : v_8d41d7('screens.afterlifeGifts.errors.retryLater'),
              );
            } finally {
              v_0141c0(null);
            }
          },
          (v_fd3c7b) => {
            console.warn('[AfterlifeRewards] ad load failed:', v_fd3c7b?.message);
            v_889fad(v_8d41d7('screens.afterlifeGifts.alerts.adLoadFailTitle'), v_8d41d7('screens.afterlifeGifts.errors.retryLater'));
            v_0141c0(null);
          },
        );
      } catch (v_663f77) {
        console.warn('[AfterlifeRewards] ad show failed:', v_663f77?.message);
        await v_889fad(v_8d41d7('screens.afterlifeGifts.alerts.adShowFailTitle'), v_8d41d7('screens.afterlifeGifts.errors.retryLater'));
        v_0141c0(null);
      }
    },
    [v_56eae3, v_f6f5de, v_9b57fc, v_889fad, v_8d41d7],
  );

  const v_7f243f = v_de06a3(async () => {
    try {
      const v_bee33e = 'afterlife://';
      if (await v_f2c756.canOpenURL(v_bee33e)) {
        await v_f2c756.openURL(v_bee33e);
        return;
      }
    } catch {}
    try {
      await v_f2c756.openURL('https://play.google.com/store/apps/details?id=run.xrun.afterlifeRN');
    } catch {}
  }, []);

  const v_039fee = String(+v_30ea43.toFixed(8));
  const v_f02564 = v_beea9d > 0 ? v_b9db3d(v_30ea43, v_beea9d) : 0;
  const v_80cae9 = v_8d41d7('screens.afterlifeGifts.flowerUnit');

  return (
    <SafeView style={v_d81136.container} backgroundColor={'#f7f7fb'}>
      <Header title={v_8d41d7('screens.afterlifeGifts.title')} />

      <ScrollView
        contentContainerStyle={v_d81136.scroll}
        refreshControl={<RefreshControl refreshing={v_612e9f} onRefresh={v_d5345f} />}
      >
        <ReferralStatsCard
          title={v_8d41d7('screens.afterlifeGifts.pendingTotal', { defaultValue: '받을 보상' })}
          value={`${v_039fee} XRUN`}
          helperText={v_d7e45e(v_f02564)}
          icon="flower"
        />

        {v_683210 && <ActivityIndicator style={{ marginTop: 24 }} color={v_1bfbd0.buttonPrimary} />}

        {!v_683210 && v_49263d && (
          <View style={v_d81136.errorBox}>
            <Text style={v_d81136.errorText}>{v_49263d}</Text>
            <TouchableOpacity onPress={v_d5345f} style={v_d81136.retryBtn}>
              <Text style={v_d81136.retryBtnText}>{v_8d41d7('screens.afterlifeGifts.retry')}</Text>
            </TouchableOpacity>
          </View>
        )}

        {!v_683210 && !v_49263d && v_483de2.length === 0 && (
          <TouchableOpacity style={v_d81136.emptyBox} onPress={v_7f243f} activeOpacity={0.75}>
            <Text style={v_d81136.emptyText}>
              {v_8d41d7('screens.afterlifeGifts.emptyRewardTitle', { defaultValue: '받을 보상이 없어요' })}
            </Text>
            <Text style={v_d81136.emptySub}>
              {v_8d41d7('screens.afterlifeGifts.emptyRewardSub', {
                defaultValue: '애프터라이프 앱 선물함에서 받은 선물을 교환하면 여기서 XRUN으로 받을 수 있어요.',
              })}
            </Text>
          </TouchableOpacity>
        )}

        {}
        {!v_683210 &&
          !v_49263d &&
          v_483de2.map((v_8c0b26) => (
            <TouchableOpacity
              key={`p-${v_8c0b26.id}`}
              style={v_d81136.card}
              onPress={() => void v_3249c2(v_8c0b26)}
              disabled={v_56eae3 !== null}
              activeOpacity={0.75}
            >
              <View style={v_d81136.cardBadge}>
                <Text style={v_d81136.cardBadgeText}>
                  {v_8d41d7('screens.afterlifeGifts.exchangeBadge', { defaultValue: '애프터라이프 교환' })}
                </Text>
              </View>
              <Text style={v_d81136.cardTitle}>
                {v_8c0b26.giftName ?? '선물'} {v_8c0b26.qty ?? ''}
                {v_8c0b26.qty ? v_80cae9 : ''}
              </Text>
              <Text style={v_d81136.cardSub}>{v_e065e5(v_8c0b26.createdAt)}</Text>
              <View style={v_d81136.divider} />
              <View style={v_d81136.cardFooter}>
                <Text style={v_d81136.cardFooterLabel}>
                  {v_8d41d7('screens.afterlifeGifts.tapToReceive', { defaultValue: '광고 보고 받기' })}
                </Text>
                {v_56eae3 === v_8c0b26.id ? (
                  <ActivityIndicator color={v_1bfbd0.buttonPrimary} />
                ) : (
                  <Text style={v_d81136.cardFooterValue}>{v_8c0b26.xrunAmount} XRUN</Text>
                )}
              </View>
            </TouchableOpacity>
          ))}

        {}
        {!v_683210 &&
          !v_49263d &&
          v_0a2cd1.map((v_8c0b26) => (
            <View key={`c-${v_8c0b26.id}`} style={[v_d81136.card, v_d81136.cardDone]}>
              <View style={[v_d81136.cardBadge, v_d81136.cardBadgeDone]}>
                <Text style={[v_d81136.cardBadgeText, v_d81136.cardBadgeTextDone]}>
                  {v_8d41d7('screens.afterlifeGifts.claimedBadge', { defaultValue: '받기 완료' })}
                </Text>
              </View>
              <Text style={[v_d81136.cardTitle, v_d81136.cardTitleDone]}>
                {v_8c0b26.giftName ?? '선물'} {v_8c0b26.qty ?? ''}
                {v_8c0b26.qty ? v_80cae9 : ''}
              </Text>
              <Text style={[v_d81136.cardSub, v_d81136.cardTitleDone]}>{v_e065e5(v_8c0b26.claimedAt)}</Text>
              <View style={v_d81136.divider} />
              <View style={v_d81136.cardFooter}>
                <Text style={[v_d81136.cardFooterLabel, v_d81136.cardTitleDone]}>
                  {v_8d41d7('screens.afterlifeGifts.received', { defaultValue: '입금 완료' })}
                </Text>
                <Text style={[v_d81136.cardFooterValue, v_d81136.cardTitleDone]}>{v_8c0b26.xrunAmount} XRUN</Text>
              </View>
            </View>
          ))}
      </ScrollView>
    </SafeView>
  );
}

const v_d81136 = v_472849.create({
  container: { flex: 1 },
  scroll: { padding: 16, paddingBottom: 48 },
  cardBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#E6F0FF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    marginBottom: 12,
  },
  cardBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#2563EB',
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
  emptyText: { fontSize: 15, fontWeight: '700', color: '#333' },
  emptySub: { fontSize: 12, color: '#888', marginTop: 8, textAlign: 'center', lineHeight: 17 },
  card: {
    backgroundColor: v_1bfbd0.white,
    borderWidth: 1,
    borderColor: '#EEF0F6',
    borderRadius: 12,
    padding: 20,
    marginTop: 20,
  },
  cardTitle: { fontSize: 20, fontWeight: '700', color: v_1bfbd0.headerText },
  cardSub: { fontSize: 12, color: '#888', marginTop: 4 },
  divider: {
    height: v_472849.hairlineWidth,
    backgroundColor: '#E5E7EB',
    marginVertical: 20,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardFooterLabel: { fontSize: 13, color: '#666', fontWeight: '500' },
  cardFooterValue: { fontSize: 16, fontWeight: '800', color: v_1bfbd0.headerText },
  cardDone: { backgroundColor: '#F3F4F6', borderColor: '#E5E7EB' },
  cardBadgeDone: { backgroundColor: '#E5E7EB' },
  cardBadgeTextDone: { color: '#6B7280' },
  cardTitleDone: { color: '#9CA3AF' },
});
