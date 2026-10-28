

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
import { v_5ade23 } from 'xbfwaaanosqvazmrqoah';
import { v_25515d } from 'zvyjokvuouwvifyzks';
import v_e84827 from 'bkjbgtcoyuizqwgwtnaxmfkyvlqwevapsqmanbsnv';
import { v_772971 } from 'jmpfvteuuztnp';

import { v_729608, v_556baf } from '../components';
import { v_1bfbd0, v_a61db3, v_843035, v_9b1a04 } from '../constants';
import { v_4b1173 } from '../context/AlertDialogContext';
import { v_a0daa8, v_ce4741 } from '../navigation';
import {
  v_925786,
  v_921d50,
  type v_922496,
} from '../services/afterlifeRewards';
import { v_18f201 } from '../services/pangle';
import { v_dd87bc } from '../services';
import { v_b9db3d } from '../utils';

function v_aa9295(v_f63e09): string {
  const v_0ad8c5 = parseFloat(String(v_f63e09));
  if (isNaN(v_0ad8c5) || v_0ad8c5 === 0) return 'KRW 0';
  const v_f52086 = Math.round(v_0ad8c5);
  const v_2294ac = String(v_f52086).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return `KRW ${v_2294ac}`;
}
import { v_5f124d } from '../utils/walletEvents';
import { v_02d115 } from '../services/afterlifeRelogin';

export const v_ccfe3c = 'pendingAfterlifeExpectedMember';
export const v_64d35b = 'pendingAfterlifeExpectedEmail';

function v_e065e5(v_562f33, v_05bb19 = 'ko'): string {
  if (!v_562f33) return '-';
  try {
    let v_2e53ec = v_562f33.trim();
    const v_2f628d = /^\d{4}-\d{2}$/;
    if (v_2f628d.test(v_2e53ec)) return v_2e53ec;

    const v_641853 =
      v_2e53ec.endsWith('Z') ||
      v_2e53ec.includes('+') ||
      (v_2e53ec.length > 10 && v_2e53ec.slice(10).includes('-'));

    if (!v_641853) {
      if (/^\d{4}-\d{2}-\d{2}$/.test(v_2e53ec)) {
        v_2e53ec = `${v_2e53ec}T00:00:00Z`;
      } else if (!v_2e53ec.includes('T')) {
        v_2e53ec = v_2e53ec.replace(' ', 'T');
        if (!v_2e53ec.includes(':')) v_2e53ec += 'T00:00:00';
        v_2e53ec += 'Z';
      } else {
        v_2e53ec += 'Z';
      }
    }

    const v_6453eb = new Date(v_2e53ec);
    if (Number.isNaN(v_6453eb.getTime())) return '-';

    const v_0eaaff = v_6453eb.getFullYear();
    const v_033a94 = String(v_6453eb.getMonth() + 1).padStart(2, '0');
    const v_087ffc = String(v_6453eb.getDate()).padStart(2, '0');
    const v_12ebc1 = String(v_6453eb.getHours()).padStart(2, '0');
    const v_ef3543 = String(v_6453eb.getMinutes()).padStart(2, '0');

    if ((v_05bb19 || 'ko').startsWith('ko')) {
      return `${v_0eaaff}.${v_033a94}.${v_087ffc} ${v_12ebc1}:${v_ef3543}`;
    }
    return `${v_033a94}/${v_087ffc}/${v_0eaaff} ${v_12ebc1}:${v_ef3543}`;
  } catch {
    return '-';
  }
}

export default function v_5320dd() {
  const { t: v_8d41d7, i18n: v_9c213b } = v_772971();
  const { showAlert: v_889fad } = v_4b1173();
  const { navigate: v_9b57fc, reset: v_487a25, goBack: v_c7ac57 } = v_a0daa8();
  const [v_483de2, v_266e0d] = v_5ab095<v_922496[]>([]);
  const [v_0a2cd1, v_3bc8b6] = v_5ab095<v_922496[]>([]);
  const [v_30ea43, v_06b04b] = v_5ab095(0);
  const [v_683210, v_34a50a] = v_5ab095(true);
  const [v_612e9f, v_575aad] = v_5ab095(false);
  const [v_56eae3, v_0141c0] = v_5ab095<number | null>(null);
  const [v_49263d, v_8a5996] = v_5ab095<string | null>(null);
  const [v_beea9d, v_0d9a89] = v_5ab095<number>(0);

  const [v_12d8d3, v_cb24a1] = v_5ab095(false);

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
      const v_2513b6 = await v_e84827.getItem(v_64d35b);
      await v_e84827.multiRemove([v_ccfe3c, v_64d35b]);
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

              onPress: async () => {
                await v_02d115(v_2513b6, v_9b57fc);
                v_487a25(v_ce4741.login);
              },
            },
          ],
        );
      }
    } catch {

    }
  }, [v_9b57fc, v_487a25, v_889fad, v_8d41d7]);

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

  const v_4b4f12 = 10;
  const v_aa143b = v_12d8d3 ? v_0a2cd1 : v_0a2cd1.slice(0, v_4b4f12);
  const v_bf5a04 = !v_12d8d3 && v_0a2cd1.length > v_4b4f12;

  return (
    <SafeView style={v_d81136.container} backgroundColor={'#f7f7fb'}>
      <Header title={v_8d41d7('screens.afterlifeGifts.title')} onBackPress={v_c7ac57} showBackButton />

      <ScrollView
        contentContainerStyle={v_d81136.scroll}
        refreshControl={<RefreshControl refreshing={v_612e9f} onRefresh={v_d5345f} />}
      >
        {}
        <View style={v_d81136.summaryCard}>
          <LinearGradient
            colors={['#6366F1', '#8B5CF6', '#A855F7']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={v_d81136.gradient}
          >
            <View style={v_d81136.backgroundIcon}>
              <Ionicons name="flower" size={120} color="#FFFFFF" style={v_d81136.iconStyle} />
            </View>
            <View style={v_d81136.summaryContent}>
              <View style={v_d81136.summaryTitleRow}>
                <View style={v_d81136.summaryTitleLeft}>
                  <View style={v_d81136.iconContainer}>
                    <Ionicons name="flower" size={20} color="#FFFFFF" />
                  </View>
                  <Text style={v_d81136.summaryLabel}>
                    {v_8d41d7('screens.afterlifeGifts.pendingTotal', { defaultValue: 'SWAP' })}
                  </Text>
                </View>
              </View>
              <Text style={v_d81136.summaryValue}>{`${v_039fee} XRUN`}</Text>
              <Text style={v_d81136.summaryExtra}>{v_aa9295(v_f02564)}</Text>
            </View>
          </LinearGradient>
        </View>

        {v_683210 && <ActivityIndicator style={{ marginTop: v_9b1a04.large }} color={v_1bfbd0.buttonPrimary} />}

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
              <View style={v_d81136.cardHeader}>
                <Text style={v_d81136.cardStatus}>
                  {v_8d41d7('screens.afterlifeGifts.exchangeBadge', { defaultValue: 'SWAP' })}
                </Text>
                <Text style={v_d81136.cardDate}>{v_e065e5(v_8c0b26.createdAt, v_9c213b.language)}</Text>
              </View>
              {}
              <Text style={v_d81136.cardName} numberOfLines={1} ellipsizeMode="tail">
                {v_8c0b26.giftName ?? '선물'} {v_8c0b26.qty ?? ''}
                {v_8c0b26.qty ? v_80cae9 : ''}
              </Text>
              <View style={v_d81136.cardRow}>
                <Text style={v_d81136.cardRowLabel}>
                  {v_8d41d7('screens.afterlifeGifts.tapToReceive', { defaultValue: '광고 보고 받기' })}
                </Text>
                {v_56eae3 === v_8c0b26.id ? (
                  <ActivityIndicator color={v_1bfbd0.buttonPrimary} />
                ) : (
                  <Text style={[v_d81136.cardRowAmount, { color: '#707070' }]}>{v_8c0b26.xrunAmount} XRUN</Text>
                )}
              </View>
            </TouchableOpacity>
          ))}

        {}
        {!v_683210 &&
          !v_49263d &&
          v_aa143b.map((v_8c0b26) => (
            <View key={`c-${v_8c0b26.id}`} style={v_d81136.card}>
              <View style={v_d81136.cardHeader}>
                <Text style={[v_d81136.cardStatus, v_d81136.cardStatusDone]}>
                  {v_8d41d7('screens.afterlifeGifts.claimedBadge', { defaultValue: 'SWAP' })}
                </Text>
                <Text style={v_d81136.cardDate}>{v_e065e5(v_8c0b26.claimedAt, v_9c213b.language)}</Text>
              </View>
              <Text style={v_d81136.cardName} numberOfLines={1} ellipsizeMode="tail">
                {v_8c0b26.giftName ?? '선물'} {v_8c0b26.qty ?? ''}
                {v_8c0b26.qty ? v_80cae9 : ''}
              </Text>
              <View style={v_d81136.cardRow}>
                <Text style={v_d81136.cardRowLabel}>
                  {v_8d41d7('screens.afterlifeGifts.received', { defaultValue: '입금 완료' })}
                </Text>
                <Text style={[v_d81136.cardRowAmount, { color: '#111111' }]}>{v_8c0b26.xrunAmount} XRUN</Text>
              </View>
            </View>
          ))}

        {!v_683210 && !v_49263d && v_bf5a04 && (
          <TouchableOpacity
            style={v_d81136.moreBtn}
            onPress={() => v_cb24a1(true)}
            activeOpacity={0.75}
          >
            <Text style={v_d81136.moreBtnText}>
              {v_8d41d7('screens.afterlifeGifts.showMore', {
                defaultValue: '더보기 ({{count}})',
                count: v_0a2cd1.length - v_4b4f12,
              })}
            </Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </SafeView>
  );
}

const v_d81136 = v_472849.create({
  container: {
    ...v_a61db3.container,
  },
  scroll: {
    ...v_a61db3.scrollContent,
    paddingBottom: 48,
  },
  summaryCard: {
    borderRadius: v_9b1a04.medium,
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.25,
    shadowRadius: 24,
    elevation: 10,
    height: 140,
    overflow: 'hidden',
    marginBottom: v_9b1a04.large,
  },
  gradient: {
    flex: 1,
    borderRadius: v_9b1a04.medium,
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

    fontSize: v_843035.size.msmall,
    fontFamily: 'Roboto-Bold',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
    letterSpacing: 0.3,
  },
  summaryValue: {
    fontSize: v_843035.size.xxxlarge,
    fontFamily: 'Roboto-Bold',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
    letterSpacing: -0.8,
  },
  summaryExtra: {
    fontSize: v_843035.size.medium,
    color: 'rgba(255, 255, 255, 0.9)',
    fontFamily: 'Roboto-Regular',
    opacity: 0.9,
  },
  errorBox: {
    paddingVertical: v_9b1a04.xlarge,
    alignItems: 'center',
  },
  errorText: {
    color: '#B91C1C',
    fontSize: v_843035.size.msmall,
    fontFamily: 'Roboto-Regular',
    textAlign: 'center',
  },
  retryBtn: {
    marginTop: v_9b1a04.small,
    paddingVertical: v_9b1a04.xsmall,
    paddingHorizontal: 20,
    borderRadius: v_9b1a04.xsmall,
    backgroundColor: v_1bfbd0.buttonPrimary,
  },
  retryBtnText: {
    color: v_1bfbd0.white,
    fontSize: v_843035.size.msmall,
    fontFamily: 'Roboto-Bold',
  },
  emptyBox: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: v_843035.size.medium,
    fontFamily: 'Roboto-Bold',
    color: '#111111',
  },
  emptySub: {
    fontSize: v_843035.size.small,
    fontFamily: 'Roboto-Regular',
    color: '#666666',
    marginTop: v_9b1a04.xsmall,
    textAlign: 'center',
    lineHeight: 20,
  },
  card: {
    backgroundColor: v_1bfbd0.background,
    borderRadius: v_9b1a04.medium,
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderWidth: 0.5,
    borderColor: '#d5dde0',
    shadowColor: '#00000014',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
    marginBottom: v_9b1a04.small,
    marginTop: 0,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  cardStatus: {

    fontSize: v_843035.size.msmall,
    fontFamily: 'Roboto',
    color: v_1bfbd0.white,
    paddingHorizontal: v_9b1a04.small,
    paddingVertical: 2,
    borderRadius: 4,
    backgroundColor: '#6366F1',
    overflow: 'hidden',
    letterSpacing: 0,
  },
  cardStatusDone: {
    backgroundColor: '#9CA3AF',
  },
  cardDate: {
    fontSize: v_843035.size.small,
    fontFamily: 'Roboto-regular',
    color: '#666666',
  },

  cardName: {
    fontSize: v_843035.size.msmall,
    fontFamily: 'Roboto-Regular',
    color: '#333333',
    letterSpacing: -0.5,
    maxWidth: '70%',
    marginBottom: 4,
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  cardRowLabel: {
    fontSize: v_843035.size.msmall,
    fontFamily: 'Roboto-Regular',
    color: '#333333',
    letterSpacing: -0.5,
  },
  cardRowAmount: {
    fontSize: v_843035.size.medium,
    fontFamily: 'Roboto-SemiBold',
  },
  moreBtn: {
    marginTop: v_9b1a04.large,
    paddingVertical: 14,
    borderRadius: v_9b1a04.medium,
    borderWidth: 0.5,
    borderColor: '#d5dde0',
    backgroundColor: v_1bfbd0.background,
    alignItems: 'center',
  },
  moreBtnText: {
    fontSize: v_843035.size.msmall,
    fontFamily: 'Roboto-SemiBold',
    color: '#333333',
  },
});
