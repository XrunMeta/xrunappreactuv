

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
import { v_772971 } from 'jmpfvteuuztnp';

import { v_729608, v_f16775, v_556baf } from '../components';
import { v_1bfbd0 } from '../constants';
import {
  v_8cbcd6,
  v_9c38e3,
  v_83b42a,
  v_197916,
  type v_b24e94,
} from '../services/afterlifeBridge';
import { v_18f201 } from '../services/pangle';
import { v_dd87bc } from '../services';
import { v_b9db3d, v_d7e45e } from '../utils';

export default function v_5320dd() {
  const { t: v_8d41d7 } = v_772971();
  const [v_e0c7e8, v_fedf34] = v_5ab095<string | null>(null);
  const [v_4622b9, v_fa923c] = v_5ab095<v_b24e94[]>([]);
  const [v_683210, v_34a50a] = v_5ab095(true);
  const [v_612e9f, v_575aad] = v_5ab095(false);
  const [v_cb38bc, v_b8069a] = v_5ab095(false);
  const [v_49263d, v_8a5996] = v_5ab095<string | null>(null);
  const [v_beea9d, v_0d9a89] = v_5ab095<number>(0);

  const v_f6f5de = v_de06a3(async () => {
    v_8a5996(null);
    try {
      const v_479f05 = await v_e84827.getItem('userData');
      const v_8decf8 = v_479f05 ? JSON.parse(v_479f05) : null;
      const v_131f0d = String(v_8decf8?.email ?? '').trim();
      v_fedf34(v_131f0d);
      if (!v_131f0d) {
        v_fa923c([]);
        v_8a5996(v_8d41d7('screens.afterlifeGifts.errors.noEmail'));
        return;
      }
      const v_8f00b9 = await v_8cbcd6(v_131f0d);
      if (!v_8f00b9.userFound) {
        v_fa923c([]);
        v_8a5996(v_8d41d7('screens.afterlifeGifts.errors.notRegistered'));
        return;
      }
      v_fa923c(v_8f00b9.items);
    } catch (v_9e86fd) {
      console.warn('[AfterlifeGifts] load failed:', v_9e86fd?.message);
      v_8a5996(v_9e86fd?.message || v_8d41d7('screens.afterlifeGifts.errors.loadFailed'));
    }
  }, [v_8d41d7]);

  v_c4deb2(() => {
    void (async () => {
      v_34a50a(true);
      await v_f6f5de();
      v_34a50a(false);
    })();
  }, [v_f6f5de]);

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
          const v_9390e8 = JSON.parse(v_e2a6a6);
          const v_6bbb57 = Number(v_9390e8?.data?.gopaxPrice ?? 0);
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

  const v_ccd7bf = v_df9f57(
    () => v_4622b9.reduce((v_fd5f43, v_23805a) => v_fd5f43 + (v_23805a.count || 0), 0),
    [v_4622b9],
  );

  const v_fcb9a4 = v_df9f57(
    () => v_4622b9.find((v_23805a) => v_23805a.count >= v_83b42a) ?? null,
    [v_4622b9],
  );
  const v_4f2dac = !!v_fcb9a4;

  const v_1cd9cf = Math.floor(v_ccd7bf / v_83b42a);
  const v_f541e7 = v_1cd9cf * v_197916;
  const v_f02564 = v_beea9d > 0 ? v_b9db3d(v_f541e7, v_beea9d) : 0;

  const v_2e0e88 =
    v_f541e7 > 0
      ? `${v_f541e7.toFixed(2)} XRUN · ${v_d7e45e(v_f02564)}`
      : `0 XRUN · ${v_d7e45e(0)}`;

  const v_f51415 = v_de06a3(async () => {
    if (v_cb38bc || !v_e0c7e8 || !v_fcb9a4) return;
    v_b8069a(true);
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
            v_b8069a(false);
            v_03e392.alert(
              v_8d41d7('screens.afterlifeGifts.alerts.noticeTitle'),
              v_8d41d7('screens.afterlifeGifts.alerts.adNotWatched'),
            );
            return;
          }
          try {
            const v_8f00b9 = await v_9c38e3(v_e0c7e8, v_fcb9a4.giftId);
            v_fa923c((v_ba2215) =>
              v_ba2215
                .map((v_206b88) =>
                  v_206b88.giftId === v_fcb9a4.giftId
                    ? { ...v_206b88, count: Math.max(0, v_206b88.count - v_83b42a) }
                    : v_206b88,
                )
                .filter((v_206b88) => v_206b88.count > 0),
            );
            v_03e392.alert(
              v_8d41d7('screens.afterlifeGifts.alerts.exchangeDoneTitle'),
              v_8d41d7('screens.afterlifeGifts.alerts.exchangeDoneMsg', {
                emoji: v_fcb9a4.emoji,
                name: v_fcb9a4.name,
                burned: v_8f00b9.burned,
                xrunAmount: v_8f00b9.xrunAmount,
                userShare: v_8f00b9.burned - 1,
              }),
            );
          } catch (v_1753dd) {
            console.warn('[AfterlifeGifts] redeem failed:', v_1753dd?.message);
            v_03e392.alert(
              v_8d41d7('screens.afterlifeGifts.alerts.exchangeFailTitle'),
              v_1753dd?.message || v_8d41d7('screens.afterlifeGifts.errors.serverFail'),
            );
          } finally {
            v_b8069a(false);
          }
        },
        (v_fd3c7b) => {
          console.warn('[AfterlifeGifts] ad load failed:', v_fd3c7b?.message);
          v_03e392.alert(
            v_8d41d7('screens.afterlifeGifts.alerts.adLoadFailTitle'),
            v_8d41d7('screens.afterlifeGifts.errors.retryLater'),
          );
          v_b8069a(false);
        },
      );
    } catch (v_663f77) {
      console.warn('[AfterlifeGifts] ad show failed:', v_663f77?.message);
      v_03e392.alert(
        v_8d41d7('screens.afterlifeGifts.alerts.adShowFailTitle'),
        v_8d41d7('screens.afterlifeGifts.errors.retryLater'),
      );
      v_b8069a(false);
    }
  }, [v_cb38bc, v_e0c7e8, v_fcb9a4, v_8d41d7]);

  const v_d2d720 = Math.max(0, v_83b42a - v_ccd7bf);

  return (
    <SafeView style={v_d81136.container} backgroundColor={'#f7f7fb'}>
      <Header title={v_8d41d7('screens.afterlifeGifts.title')} />

      <ScrollView
        contentContainerStyle={v_d81136.scroll}
        refreshControl={<RefreshControl refreshing={v_612e9f} onRefresh={v_d5345f} />}
      >
        <ReferralStatsCard
          title={v_8d41d7('screens.afterlifeGifts.totalFlowerCount')}
          value={`${v_ccd7bf}${v_8d41d7('screens.afterlifeGifts.flowerUnit')}`}
          helperText={v_2e0e88}
          icon="flower"
        />

        <Text style={v_d81136.sectionLabel}>{v_8d41d7('screens.afterlifeGifts.mySection')}</Text>

        {v_683210 && <ActivityIndicator style={{ marginTop: 24 }} color={v_1bfbd0.buttonPrimary} />}

        {!v_683210 && v_49263d && (
          <View style={v_d81136.errorBox}>
            <Text style={v_d81136.errorText}>{v_49263d}</Text>
            <TouchableOpacity onPress={v_d5345f} style={v_d81136.retryBtn}>
              <Text style={v_d81136.retryBtnText}>{v_8d41d7('screens.afterlifeGifts.retry')}</Text>
            </TouchableOpacity>
          </View>
        )}

        {!v_683210 && !v_49263d && v_ccd7bf === 0 && (
          <View style={v_d81136.emptyBox}>
            <Text style={v_d81136.emptyText}>{v_8d41d7('screens.afterlifeGifts.emptyTitle')}</Text>
            <Text style={v_d81136.emptySub}>{v_8d41d7('screens.afterlifeGifts.emptySub')}</Text>
          </View>
        )}

        {!v_683210 && !v_49263d && v_ccd7bf > 0 && (
          <View style={v_d81136.card}>
            <View style={{ flex: 1 }}>
              <Text style={v_d81136.cardTitle}>
                {v_8d41d7('screens.afterlifeGifts.summaryLabel')} {v_ccd7bf}
                {v_8d41d7('screens.afterlifeGifts.flowerUnit')}
              </Text>
              {v_4f2dac ? (
                <Text style={v_d81136.cardSub}>
                  {v_8d41d7('screens.afterlifeGifts.exchangeAmount')}  {v_197916} XRUN
                </Text>
              ) : (
                <Text style={[v_d81136.cardSub, v_d81136.cardSubWarn]}>
                  {v_8d41d7('screens.afterlifeGifts.needMoreFlowersFormat', { need: v_d2d720 })}
                </Text>
              )}
            </View>
            <TouchableOpacity
              style={[v_d81136.actionPill, !v_4f2dac && v_d81136.actionPillDisabled]}
              onPress={v_f51415}
              disabled={!v_4f2dac || v_cb38bc}
              activeOpacity={0.75}
            >
              {v_cb38bc ? (
                <ActivityIndicator color="#FFF" />
              ) : (
                <Text style={v_d81136.actionPillText}>{v_8d41d7('screens.afterlifeGifts.exchange')}</Text>
              )}
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeView>
  );
}

const v_d81136 = v_472849.create({
  container: { flex: 1 },
  scroll: { padding: 16, paddingBottom: 48 },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#666',
    marginTop: 20,
    marginBottom: 10,
    marginLeft: 2,
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
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: v_1bfbd0.white,
    borderWidth: 1,
    borderColor: '#EEF0F6',
    borderRadius: 12,
    padding: 16,
  },
  cardTitle: { fontSize: 15, fontWeight: '700', color: v_1bfbd0.headerText },
  cardSub: { fontSize: 12, color: '#666', marginTop: 4 },
  cardSubWarn: { color: '#B91C1C' },
  actionPill: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 999,
    backgroundColor: v_1bfbd0.buttonPrimary,
    minWidth: 72,
    alignItems: 'center',
  },
  actionPillDisabled: {
    backgroundColor: '#C7CBD9',
  },
  actionPillText: { color: '#FFF', fontSize: 13, fontWeight: '700' },
});
