import v_a3453e, { v_5ab095, v_c4deb2, v_de06a3 } from 'bapkr';
import { v_3094a2, v_472849, v_19b633, v_4623af, v_cf9c33, v_7618c3, v_07a341, v_122070, v_326be8, v_79c4f2, v_aa7413, v_39a996, v_e767d1, v_1ed974 } from 'rcmrninabrnb';
import v_e84827 from 'bkjbgtcoyuizqwgwtnaxmfkyvlqwevapsqmanbsnv';
import { v_5ade23 } from 'xbfwaaanosqvazmrqoah';
import { v_556baf, v_570c34 } from '../components';
import { v_b5df25 } from 'ernurodqvmtspux';
import { v_772971 } from 'jmpfvteuuztnp';
import { v_729608 } from '../components';
import { v_a0daa8, v_ce4741 } from '../navigation';
import { v_700ef9 } from '../context';
import { v_4b1173 } from '../context/AlertDialogContext';
import { v_1bfbd0, v_a61db3, v_843035, v_9b1a04 } from '../constants';
import { v_e0068c } from 'vvfgtwbmdpbnvhtfbtbgudicfmpscw';
import { v_c18c22 } from 'svuoaeceudfxfjvvpmmmchnwljywbphjgb';
import { v_dec439, v_25515d } from 'zvyjokvuouwvifyzks';
import { v_877de8, v_54d016, v_a7ab3c, v_44edcc, v_4d25ff, v_9c9f1b, v_070bef, v_324bd9, v_01eada, v_48805f, v_960478, v_6acf4c, v_b20e92, v_ec4a4a } from '../services';
import { v_5e3aed } from '../services/giftishowBiz';
import type { v_214820 } from '../services/giftishowBiz';
import { v_f9f38e } from '../components';
import { v_412fbc } from '../components/AnimatedDots';
import { v_e134f3, v_5e6c2c } from '../services/walletSendLocal';
import { v_9d7f6b, type v_b9a3bd } from '../services/walletKeyStore';
import { v_5401ae } from '../testIDs';

const v_10664a = require('../../assets/xplay_symbol.png');
const v_33c40c = require('../../assets/xrun-round-logo.png');
const v_47af4d = require('../../assets/xrun-horizontal-logo.png');
const v_74bda9 = require('../../assets/images/ethereum_thumb.png');

const v_4e7e53 = 30000;
const v_1d021e = 3070000;
const v_47de40 = 2000;

interface ProductDetailData {
    id: string;
    brand: string;
    title: string;
    description?: string;
    price: number;
    image: v_07a341;
    isXrun?: boolean;
    isIak?: boolean;  
    iakCategory?: string | null;  
}

type IakInputKind = 'phone' | 'game_id' | 'meter' | 'generic';
function v_fa97b3(v_8b9cd4): IakInputKind {
    if (!v_8b9cd4) return 'phone';
    const v_3f4e2e = String(v_8b9cd4).toLowerCase();
    if (v_3f4e2e === 'game') return 'game_id';
    if (v_3f4e2e === 'pln') return 'meter';

    return 'phone';
}

const v_273f15 = {
    id: '',
    brand: '',
    title: '',
    price: 0,
    image: require('../../assets/sample_cu.png'), 
    isXrun: false,
};

export const v_a59951 = () => {
    const { goBack: v_c7ac57, navigate: v_9b57fc } = v_a0daa8();
    const { t: v_8d41d7 } = v_772971();
    const { showAlert: v_889fad } = v_4b1173();
    const { selectedShopItem: v_dfe883 } = v_700ef9();
    const v_033e14 = v_e0068c();
    const v_f9771e = v_c18c22(0);

    const v_365f44 = v_326be8.OS === 'ios'
        ? v_033e14.bottom
        : Math.max(v_f9771e, v_033e14.bottom);

    const v_01bee9 = v_dfe883 ? {
        id: v_dfe883.id || '',
        brand: (v_dfe883 as any).brand ?? '',
        title: v_dfe883.title || '',
        description: (v_dfe883 as any).description,
        price: parseFloat(v_dfe883.priceLabel?.replace(/,/g, '') || '0'),
        image: v_dfe883.image || v_273f15.image,
        isXrun: (v_dfe883 as any).isXrun || false,
        isIak: (v_dfe883 as any).isIak || false,
        iakCategory: (v_dfe883 as any).iakCategory ?? null,
    } : v_273f15;
    const v_d62ac8 = v_01bee9.isIak ? v_fa97b3(v_01bee9.iakCategory) : 'phone';

    const v_b3ea98 = false;

    const v_5db874 = (v_dfe883 as any)?.shopTab === 'xplayShop';

    const v_d0d89e = !!(v_dfe883 as any)?.isPurchased;
    const v_509dc4 = Number((v_dfe883 as any)?.paidXrun ?? 0);
    const v_6468c7 = String((v_dfe883 as any)?.purchaseDate ?? '');
    v_c4deb2(() => {
        if (v_d0d89e) {
            console.log('[상품 상세-구매완료] selectedShopItem:', JSON.stringify(v_dfe883));
        }
    }, [v_d0d89e, v_dfe883]);

    const [v_660822, v_06fdbc] = v_5ab095<string | null>(null);

    const [v_25cfbb, v_6bc978] = v_5ab095(1);

    const [v_32eda7, v_047920] = v_5ab095<'desc' | 'guide'>('desc');

    v_c4deb2(() => {
        const v_1ae212 = v_1ed974.addEventListener('hardwareBackPress', () => {
            v_9b57fc(v_ce4741.shop);
            return true;
        });
        return () => v_1ae212.remove();
    }, [v_9b57fc]);

    const [v_f5e16b, v_1c868b] = v_5ab095(false);
    const [v_d49490, v_04a3b7] = v_5ab095<{ memberId: number; email: string; kind: 'item' | 'gift' | 'iak'; iakCustomerId?: string } | null>(null);
    const [v_bd58fc, v_24bbbd] = v_5ab095(false);

    const [v_b7c830, v_179642] = v_5ab095<number | null>(null);
    const [v_837630, v_2f87ed] = v_5ab095(false);
    const [v_18a900, v_0409f2] = v_5ab095(false);
    const [v_809e5c, v_453192] = v_5ab095(false);

    const [v_f3e760, v_23d029] = v_5ab095<string>('');
    const [v_673bf2, v_beef40] = v_5ab095(false);
    const [v_889a26, v_303962] = v_5ab095<any>(null);
    const [v_818c63, v_c43513] = v_5ab095(false);

    const [v_417986, v_37f2b0] = v_5ab095(false);

    const [v_a71862, v_b75b27] = v_5ab095<{
        tr_id?: string;
        coupon_img_url?: string;
        pin_no?: string;
        limit_date?: string;
    } | null>(null);

    const [v_a1c497, v_0ce8dd] = v_5ab095<number | null>(null);
    const [v_19340b, v_14129c] = v_5ab095(false);

    const [v_90e57e, v_ccda6f] = v_5ab095<v_214820 | null>(null);
    const [v_39954a, v_8df718] = v_5ab095(false);
    const [v_ca5e50, v_aad6d1] = v_5ab095<boolean>(false);

    const [v_7496db, v_5617d2] = v_5ab095<string | null>(null);

    v_c4deb2(() => {
        let v_2008a4 = false;
        (async () => {
            try {
                const v_f24fd5 = await v_e84827.getItem('userData');
                if (v_2008a4 || !v_f24fd5) return;
                const v_ef7306 = JSON.parse(v_f24fd5);
                const v_35f85c = v_ef7306?.member;
                if (v_35f85c != null && !v_2008a4) v_06fdbc(String(v_35f85c));
                const v_d74a81 = v_ef7306?.mobile ? String(v_ef7306.mobile).replace(/\s/g, '') : '';
                if (!v_2008a4) v_5617d2(v_d74a81 || null);
            } catch {
                if (!v_2008a4) v_06fdbc(null);
                if (!v_2008a4) v_5617d2(null);
            }
        })();
        return () => { v_2008a4 = true; };
    }, []);

    v_c4deb2(() => {
        if (!v_660822 || v_7496db !== null) return;
        let v_2008a4 = false;
        (async () => {
            try {
                const v_8f00b9 = await v_a7ab3c(Number(v_660822), undefined);
                const v_625c74 = v_8f00b9?.data?.[0];
                const v_d74a81 = v_625c74?.mobile ? String(v_625c74.mobile).replace(/\s/g, '') : '';
                if (!v_2008a4 && v_d74a81) v_5617d2(v_d74a81);
            } catch {
                if (!v_2008a4) v_5617d2(null);
            }
        })();
        return () => { v_2008a4 = true; };
    }, [v_660822, v_7496db]);

    const v_c1e7a4 = v_de06a3(async () => {
        if (!v_660822) return;
        v_2f87ed(true);
        try {
            const v_8f00b9 = await v_877de8(v_660822, undefined);
            const v_c88e9b = v_8f00b9?.total_ayet_points ?? null;
            v_179642(v_c88e9b != null ? Number(v_c88e9b) : null);
        } catch (v_9e86fd) {
            console.warn('[ShopProductDetail] Xplay 잔액 조회 실패:', v_9e86fd);
            v_179642(null);
        } finally {
            v_2f87ed(false);
        }
    }, [v_660822]);

    v_c4deb2(() => {
        if ((v_5db874 || v_b3ea98) && v_660822) v_c1e7a4();
    }, [v_5db874, v_b3ea98, v_660822, v_c1e7a4]);

    const v_abb08d = v_de06a3(async () => {
        if (!v_660822) return;
        v_14129c(true);
        try {

            const v_8f00b9 = await v_4d25ff(Number(v_660822), 7, undefined);
            const v_ef8ab1 = Array.isArray(v_8f00b9?.data) ? v_8f00b9.data : [];
            const v_b25f51 = v_ef8ab1.find((v_32f7b8) => Number(v_32f7b8?.currency) === 18);
            const v_c88e9b = parseFloat(v_b25f51?.Wamount || v_b25f51?.amount || '0');
            console.log('[ShopProductDetail] XRUN 잔액 로드 완료', {
                member: v_660822,
                walletList: v_ef8ab1.map((v_32f7b8) => ({
                    currency: v_32f7b8?.currency,
                    Wamount: v_32f7b8?.Wamount,
                    amount: v_32f7b8?.amount,
                })),
                xrunPolygon: v_b25f51,
                balance: v_c88e9b,
                productId: v_01bee9?.id,
                productPrice: v_01bee9?.price,
                productPriceType: typeof v_01bee9?.price,
                comparison: `${v_c88e9b} < ${v_01bee9?.price} = ${v_c88e9b < (v_01bee9?.price ?? 0)}`,
            });
            v_0ce8dd(Number.isFinite(v_c88e9b) ? v_c88e9b : 0);
        } catch (v_9e86fd) {
            console.warn('[ShopProductDetail] XRUN 잔액 조회 실패:', v_9e86fd);
            v_0ce8dd(0);
        } finally {
            v_14129c(false);
        }
    }, [v_660822, v_01bee9?.id, v_01bee9?.price]);

    v_c4deb2(() => {
        if (v_660822) v_abb08d();
    }, [v_660822, v_abb08d]);

    v_c4deb2(() => {
        if (!v_5db874 || !v_01bee9.id) return;
        let v_2008a4 = false;
        v_8df718(true);
        v_ccda6f(null);
        v_5e3aed(v_01bee9.id)
            .then((v_8f00b9) => {
                if (!v_2008a4 && v_8f00b9.detail) v_ccda6f(v_8f00b9.detail);
            })
            .catch(() => {
                if (!v_2008a4) v_ccda6f(null);
            })
            .finally(() => {
                if (!v_2008a4) v_8df718(false);
            });
        return () => { v_2008a4 = true; };
    }, [v_5db874, v_01bee9.id]);

    v_c4deb2(() => { v_aad6d1(false); }, [v_01bee9.id]);

    const v_b000c1 = v_de06a3(async () => {
        console.log('[Xplay 구매] handleXplayPurchase 진입', {
            member: v_660822, xplayPurchaseLoading: v_18a900, userPhone: v_7496db,
            productId: v_01bee9?.id, productPrice: v_01bee9?.price,
            xrunBalanceState: v_a1c497, xrunBalanceLoading: v_19340b,
        });
        if (!v_660822 || v_18a900) {
            console.log('[Xplay 구매] 조기 종료', { member: v_660822, xplayPurchaseLoading: v_18a900 });
            return;
        }
        if (!v_7496db || !v_7496db.trim()) {
            v_889fad(v_8d41d7('screens.shopProductDetail.alerts.notification'), v_8d41d7('screens.shopProductDetail.alerts.phoneNotRegistered'), [{ text: v_8d41d7('screens.shopProductDetail.confirm') }]);
            return;
        }

        const v_c25eec = v_01bee9.price;
        if (v_a1c497 === null || v_19340b) {
            console.log('[Xplay 구매] 잔액 로딩 중 — 대기');
            v_889fad(v_8d41d7('screens.shopProductDetail.alerts.notification'), 'XRUN 잔액을 불러오는 중입니다. 잠시 후 다시 시도해 주세요.', [{ text: v_8d41d7('screens.shopProductDetail.confirm') }]);
            return;
        }
        const v_c88e9b = v_a1c497;
        console.log('[Xplay 구매] 잔액 비교', { balance: v_c88e9b, needPrice: v_c25eec, ok: v_c88e9b >= v_c25eec });
        if (v_c88e9b < v_c25eec) {

            const v_ff3b79 = (v_c25eec - v_c88e9b).toFixed(4).replace(/\.?0+$/, '');
            v_889fad(
                v_8d41d7('screens.shopProductDetail.alerts.notification'),
                v_8d41d7('screens.shopProductDetail.alerts.insufficientWithShortage', { shortage: v_ff3b79 }),
                [
                    { text: v_8d41d7('screens.shopProductDetail.alerts.collectXrun'), onPress: () => v_9b57fc(v_ce4741.xplayInfo) },
                    { text: v_8d41d7('screens.shopProductDetail.confirm') },
                ],
            );
            return;
        }
        v_889fad(v_8d41d7('screens.shopProductDetail.alerts.purchaseConfirmTitle'), v_8d41d7('screens.shopProductDetail.alerts.purchaseConfirmMessageXplay', { title: v_01bee9.title }), [
            { text: v_8d41d7('screens.shopProductDetail.alerts.cancel') },
            {
                text: v_8d41d7('screens.shopProductDetail.alerts.purchase'),
                onPress: async () => {
                    v_0409f2(true);
                    try {
                        const v_8f00b9 = await v_44edcc(
                            {
                                member: v_660822,
                                goods_code: v_01bee9.id,
                                phone_no: v_7496db ?? undefined,
                                price: v_01bee9.price,
                                goods_name: v_01bee9.title,
                                brand_name: (v_01bee9 as any).brand,
                                image_url: (v_01bee9 as any).image,
                            },
                            undefined,
                        );
                        if (v_8f00b9?.status === 'success') {
                            console.log('[Xplay 구매] 성공 — 상품:', v_01bee9.id, v_01bee9.title, v_8f00b9?.data);
                            v_b75b27(v_8f00b9?.data ?? null);
                            v_453192(true);
                            v_c1e7a4(); 
                        } else {
                            const v_badeaf = v_8f00b9?.message ?? '구매에 실패했습니다.';
                            const v_c99bd2 = v_8f00b9?.code;

                            if (v_c99bd2 === 410) {
                                try {
                                    const v_f24fd5 = await v_e84827.getItem('userData');
                                    const v_f21c33 = v_f24fd5 ? JSON.parse(v_f24fd5) : null;
                                    const v_717992 = v_f21c33?.member != null ? Number(v_f21c33.member) : null;
                                    const v_e0c7e8 = (v_f21c33?.email ?? '').toLowerCase().trim();
                                    if (v_717992 && v_e0c7e8 && v_5e6c2c(v_e0c7e8)) {
                                        const v_1e6eca = await v_9d7f6b(v_e0c7e8, v_717992);
                                        const v_dfc1c0 = (v_1e6eca.eth?.s === 's1') || (v_1e6eca.pol?.s === 's1');
                                        if (v_dfc1c0) {
                                            v_04a3b7({ memberId: v_717992, email: v_e0c7e8, kind: 'gift' });
                                            v_1c868b(true);
                                            v_0409f2(false);
                                            return;
                                        }
                                    }
                                } catch {  }
                                v_889fad(
                                    v_8d41d7('screens.shopProductDetail.alerts.purchaseFailed'),
                                    v_8d41d7('screens.walletRestore.restoreNeededShort'),
                                    [
                                        { text: v_8d41d7('screens.shopProductDetail.confirm') },
                                        { text: v_8d41d7('screens.walletRestore.restoreNow'), onPress: () => v_9b57fc(v_ce4741.walletRestore) },
                                    ],
                                );
                                return;
                            }

                            const v_f942f4 = v_c99bd2 === 402 || /잔액.*부족|insufficient/i.test(v_badeaf);

                            const v_ce37ad = v_c99bd2 === 404 || /Goods not found|price not configured|등록되지|가격이 설정/i.test(v_badeaf);
                            const v_a2d859 = /E0010|비즈머니.*부족/i.test(v_badeaf);
                            const v_d6be1a = /^[\x00-\x7F\s]+$/.test(v_badeaf);
                            const v_4d1536 = v_f942f4 || v_a2d859
                                ? '서비스 점검 중입니다. 잠시 후 다시 시도해 주세요.'
                                : v_ce37ad
                                    ? '해당 상품이 등록되지 않았거나 XRUN 금액이 설정되지 않았습니다. 관리자에게 문의해 주세요.'
                                    : v_d6be1a
                                        ? '구매에 실패했습니다. 잠시 후 다시 시도해 주세요.'
                                        : v_badeaf;
                            const v_43f890 = `${v_4d1536}\n\n[code=${v_c99bd2 ?? '-'}]\n${v_badeaf ?? ''}`;
                            console.warn('[Xplay 구매] 실패:', v_c99bd2, v_badeaf);
                            v_889fad(v_8d41d7('screens.shopProductDetail.alerts.purchaseFailed'), v_43f890, [{ text: v_8d41d7('screens.shopProductDetail.confirm') }]);
                        }
                    } catch (v_9e86fd) {
                        const v_49263d = v_9e86fd as any;
                        const v_d308b5 = v_49263d?.response?.status;
                        const v_badeaf = v_49263d?.response?.data?.message ?? v_49263d?.message ?? '구매 처리 중 오류가 발생했습니다.';

                        const v_d6be1a = typeof v_badeaf === 'string' && /^[\x00-\x7F\s]+$/.test(v_badeaf);
                        const v_4d1536 = v_d308b5 === 402
                            ? '서비스 점검 중입니다. 잠시 후 다시 시도해 주세요.'
                            : v_d308b5 === 404
                                ? '해당 상품이 등록되지 않았거나 XRUN 금액이 설정되지 않았습니다. 관리자에게 문의해 주세요.'
                                : v_d6be1a
                                    ? '구매 처리 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.'
                                    : v_badeaf;
                        const v_43f890 = `${v_4d1536}\n\n[status=${v_d308b5 ?? '-'}]\n${v_badeaf ?? ''}`;
                        console.error('[Xplay 구매] 오류:', v_d308b5, v_badeaf);
                        v_889fad(v_8d41d7('screens.shopProductDetail.alerts.purchaseFailed'), v_43f890, [{ text: v_8d41d7('screens.shopProductDetail.confirm') }]);
                    } finally {
                        v_0409f2(false);
                    }
                },
            },
        ]);
    }, [v_660822, v_7496db, v_01bee9.id, v_01bee9.title, v_01bee9.price, v_a1c497, v_19340b, v_18a900, v_889fad, v_c1e7a4]);

    const [v_b36076, v_a2ae27] = v_5ab095<string>('');
    const [v_a0d01e, v_80ea24] = v_5ab095<string>('');
    const v_87676e = v_b7c830 ?? 0;
    const v_e9e2a3 = 0;

    const v_c4aec5 = v_a0d01e ? parseInt(v_a0d01e.replace(/,/g, ''), 10) : 0;
    const v_af2c97 = v_c4aec5 + v_47de40 + v_e9e2a3;
    const v_438a3a = v_c4aec5 > 0 ? (v_c4aec5 / v_1d021e).toFixed(6) : '0';

    const v_8b5670 = () => {
        v_80ea24(v_87676e.toLocaleString());
    };

    const v_817006 = () => {

        v_9b57fc(v_ce4741.walletQrScan);

    };

    const v_735f3a = () => {
        if (!v_b36076.trim()) {
            v_889fad(v_8d41d7('screens.shopProductDetail.alerts.notification'), v_8d41d7('screens.shopProductDetail.alerts.enterDepositAddress'), [{ text: v_8d41d7('screens.shopProductDetail.confirm') }]);
            return;
        }
        if (!v_a0d01e || v_c4aec5 < v_4e7e53) {
            v_889fad(v_8d41d7('screens.shopProductDetail.alerts.notification'), v_8d41d7('screens.shopProductDetail.alerts.minXplayRequired', { min: v_4e7e53.toLocaleString() }), [{ text: v_8d41d7('screens.shopProductDetail.confirm') }]);
            return;
        }
        v_889fad(v_8d41d7('screens.shopProductDetail.alerts.exchangeTitle'), v_8d41d7('screens.shopProductDetail.alerts.exchangeConfirm'), [
            { text: v_8d41d7('screens.shopProductDetail.alerts.cancel') },
            { text: v_8d41d7('screens.shopProductDetail.alerts.exchange'), onPress: () => console.log('교환:', { depositAddress: v_b36076, xplayAmount: v_a0d01e }) },
        ]);
    };

    if (v_b3ea98) {
        return (
            <SafeView style={v_d81136.container} backgroundColor="#FFFFFF">
                <StatusBar style="dark" />
                <Header
                    title="Ethereum 교환"
                    onBackPress={v_c7ac57}
                    showBackButton
                />

                <SafeScrollView showsVerticalScrollIndicator={false} showBottomBackground={false} backgroundColor="transparent" disableBottomPadding={true}>
                    <View style={v_d81136.exchangeContent}>
                        {}
                        <View style={v_d81136.infoBanner}>
                            <Text style={v_d81136.infoBannerText}>
                                암호화폐 출금은 전송되는 데 몇 분 정도 소요됩니다. 출금의 최소 금액은 {v_4e7e53.toLocaleString()} Xplay 입니다.
                            </Text>
                        </View>

                        {}
                        <View style={v_d81136.inputSection}>
                            <Text style={v_d81136.inputLabel}>{v_8d41d7('screens.shopProductDetail.depositAddress')}</Text>
                            <View style={v_d81136.inputContainer}>
                                <TextInput testID={v_5401ae.shopProductDetail.depositAddressInput}
                                    style={v_d81136.input}
                                    placeholder="..."
                                    value={v_b36076}
                                    onChangeText={v_a2ae27}
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                />
                                <TouchableOpacity testID={v_5401ae.shopProductDetail.qrScan} onPress={v_817006} style={v_d81136.qrButton}>
                                    <Ionicons name="qr-code-outline" size={22} color="#111827" />
                                </TouchableOpacity>
                            </View>
                        </View>

                        {}
                        <View style={v_d81136.inputSection}>
                            <Text style={v_d81136.inputLabel}>Xplay</Text>
                            {v_837630 ? (
                                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                                    <ActivityIndicator size="small" color="#1E3A5F" />
                                    <Text style={v_d81136.minAmountHint}>{v_8d41d7('screens.shopProductDetail.checkingBalance')}</Text>
                                </View>
                            ) : (
                                <Text testID={v_5401ae.shopProductDetail.amountLabel} style={v_d81136.minAmountHint}>{v_8d41d7('screens.shopProductDetail.balanceHold', { amount: v_87676e.toLocaleString() })}</Text>
                            )}
                            <View style={v_d81136.inputContainer}>
                                <TextInput testID={v_5401ae.shopProductDetail.xplayAmountInput}
                                    style={v_d81136.input}
                                    placeholder=""
                                    value={v_a0d01e}
                                    onChangeText={(v_9b6134) => {
                                        const v_37256a = v_9b6134.replace(/[^0-9]/g, '');
                                        v_80ea24(v_37256a ? parseInt(v_37256a).toLocaleString() : '');
                                    }}
                                    keyboardType="numeric"
                                />
                                <TouchableOpacity testID={v_5401ae.shopProductDetail.maxAmount} onPress={v_8b5670} style={v_d81136.maxButton}>
                                    <Text style={v_d81136.maxButtonText}>{v_8d41d7('screens.shopProductDetail.maxAmount')}</Text>
                                </TouchableOpacity>
                            </View>
                            <Text style={v_d81136.minAmountHint}>{v_8d41d7('screens.shopProductDetail.minXplay', { min: v_4e7e53.toLocaleString() })}</Text>
                        </View>

                        {}
                        <View style={v_d81136.summarySection}>
                            <View style={v_d81136.summaryRow}>
                                <Text style={v_d81136.summaryLabel}>{v_8d41d7('screens.shopProductDetail.ethRate')}</Text>
                                <Text style={v_d81136.summaryValue}>{v_1d021e.toLocaleString()}</Text>
                            </View>
                            <View style={v_d81136.summaryRow}>
                                <Text style={v_d81136.summaryLabel}>{v_8d41d7('screens.shopProductDetail.cryptoFee')}</Text>
                                <Text style={v_d81136.summaryValue}>{v_47de40.toLocaleString()}</Text>
                            </View>
                            <View style={v_d81136.summaryRow}>
                                <Text style={v_d81136.summaryLabel}>{v_8d41d7('screens.shopProductDetail.withdrawalFee')}</Text>
                                <Text style={v_d81136.summaryValue}>{v_e9e2a3.toLocaleString()}</Text>
                            </View>
                            <View style={v_d81136.summaryRow}>
                                <Text style={v_d81136.summaryLabel}>{v_8d41d7('screens.shopProductDetail.xplayToUse')}</Text>
                                <Text style={v_d81136.summaryValue}>{v_c4aec5.toLocaleString()}</Text>
                            </View>
                            <View style={v_d81136.summaryRowLast}>
                                <Text style={v_d81136.summaryLabel}>{v_8d41d7('screens.shopProductDetail.receiveAmountEth')}</Text>
                                <Text style={v_d81136.summaryValueBold}>{v_438a3a}</Text>
                            </View>
                        </View>
                    </View>
                </SafeScrollView>

                {}
                <View style={[v_d81136.exchangeButtonContainer, { paddingBottom: v_365f44 + 20 }]}>
                    <TouchableOpacity
                        style={v_d81136.exchangeButton}
                        onPress={v_735f3a}
                        activeOpacity={0.8}
                    >
                        <Text style={v_d81136.exchangeButtonText}>{v_8d41d7('screens.shopProductDetail.exchange')}</Text>
                    </TouchableOpacity>
                </View>
            </SafeView>
        );
    }

    const v_1d54f1 = v_a1c497 ?? 0;
    const v_512b94 = v_1d54f1 - v_01bee9.price;
    const [v_80e2be, v_9375ae] = v_5ab095<boolean>(false);
    const [v_03c827, v_e94938] = v_5ab095<boolean>(false);

    const v_dfaad1 = () => {
        console.log('[XRUN 구매] handlePurchase 진입', {
            xrunPurchaseLoading: v_03c827,
            member: v_660822,
            xrunBalance: v_1d54f1,
            productPrice: v_01bee9?.price,
            productId: v_01bee9?.id,
        });
        if (v_03c827) {
            console.log('[XRUN 구매] xrunPurchaseLoading=true 라 종료');
            return;
        }
        if (!v_660822) {
            console.log('[XRUN 구매] member 없어서 종료');
            v_889fad(v_8d41d7('screens.shopProductDetail.alerts.notification'), '로그인이 필요합니다.', [{ text: v_8d41d7('screens.shopProductDetail.confirm') }]);
            return;
        }
        if (v_1d54f1 < v_01bee9.price) {
            console.error('[XRUN 구매] 잔액 부족 — 비교 상세', {
                member: v_660822,
                productId: v_01bee9.id,
                productTitle: v_01bee9.title,
                productPrice: v_01bee9.price,
                productPriceType: typeof v_01bee9.price,
                productPriceKRW: (v_01bee9 as any).priceKRW,
                productPriceXrun: (v_01bee9 as any).priceXrun,
                xrunBalance: v_1d54f1,
                xrunBalanceType: typeof v_1d54f1,
                xrunBalanceState: v_a1c497,
                shortfall: v_01bee9.price - v_1d54f1,
                note: 'xrunBalance(XRUN 단위) 와 productPrice 가 같은 단위인지 확인 필요. productPriceKRW 가 KRW 라면 단위 불일치 가능성.',
            });
            v_889fad(v_8d41d7('screens.shopProductDetail.alerts.notification'), v_8d41d7('screens.shopProductDetail.alerts.insufficientXRUN'), [{ text: v_8d41d7('screens.shopProductDetail.confirm') }]);
            return;
        }
        v_889fad(v_8d41d7('screens.shop.purchaseConfirmTitle'), v_8d41d7('screens.shop.purchaseConfirmMessage', { title: v_01bee9.title }), [
            { text: v_8d41d7('screens.shop.cancel') },
            {
                text: v_8d41d7('screens.shop.purchase'),
                onPress: async () => {
                    v_e94938(true);
                    try {
                        const v_6e55b1 = parseInt(String(v_01bee9.id), 10);
                        const v_8f00b9 = await v_9c9f1b(v_660822, v_6e55b1, String(v_01bee9.price), v_9b57fc);
                        if (v_8f00b9?.status === 'success' && Number(v_8f00b9.code) === 200) {
                            console.log('[XRUN 구매] 성공:', v_01bee9.id);
                            v_abb08d();
                            v_9375ae(true);
                        } else {
                            const v_c99bd2 = Number(v_8f00b9?.code);
                            const v_44854f = v_8f00b9?.message || '';
                            console.warn('[XRUN 구매] 실패:', v_c99bd2, v_44854f, 'fullRes:', JSON.stringify(v_8f00b9));
                            let v_43f890;
                            let v_252e2b = false;
                            if (v_c99bd2 === 409 || /max purchase|limit reached/i.test(v_44854f)) {
                                v_43f890 = '최대 구매 가능 개수를 초과했습니다.';
                            } else if (v_c99bd2 === 410) {

                                try {
                                    const v_f24fd5 = await v_e84827.getItem('userData');
                                    const v_f21c33 = v_f24fd5 ? JSON.parse(v_f24fd5) : null;
                                    const v_717992 = v_f21c33?.member != null ? Number(v_f21c33.member) : null;
                                    const v_e0c7e8 = (v_f21c33?.email ?? '').toLowerCase().trim();
                                    if (v_717992 && v_e0c7e8 && v_5e6c2c(v_e0c7e8)) {
                                        const v_1e6eca = await v_9d7f6b(v_e0c7e8, v_717992);
                                        const v_dfc1c0 = (v_1e6eca.eth?.s === 's1') || (v_1e6eca.pol?.s === 's1');
                                        if (v_dfc1c0) {
                                            v_04a3b7({ memberId: v_717992, email: v_e0c7e8, kind: 'item' });
                                            v_1c868b(true);
                                            v_e94938(false);
                                            return;
                                        }
                                    }
                                } catch {  }
                                v_43f890 = v_8d41d7('screens.walletRestore.restoreNeededShort');
                                v_252e2b = true;
                            } else if (v_c99bd2 === 404 || /not found/i.test(v_44854f)) {
                                v_43f890 = '상품을 찾을 수 없습니다.';
                            } else if (v_c99bd2 === 400) {
                                v_43f890 = '요청 정보가 올바르지 않습니다.';
                            } else {
                                const v_d6be1a = /^[\x00-\x7F\s]+$/.test(v_44854f);
                                v_43f890 = v_d6be1a || !v_44854f ? '구매에 실패했습니다. 잠시 후 다시 시도해 주세요.' : v_44854f;
                            }

                            const v_3d694a = v_252e2b
                                ? [
                                    { text: v_8d41d7('screens.shopProductDetail.confirm') },
                                    { text: '복원하기', onPress: () => v_9b57fc(v_ce4741.walletRestore) },
                                ]
                                : [{ text: v_8d41d7('screens.shopProductDetail.confirm') }];
                            v_889fad(v_8d41d7('screens.shopProductDetail.alerts.purchaseFailed'), v_43f890, v_3d694a);
                        }
                    } catch (v_9e86fd) {
                        const v_d308b5 = v_9e86fd?.response?.status;
                        const v_49b0b7 = v_9e86fd?.response?.data;
                        console.error('[XRUN 구매] 오류:', { status: v_d308b5, respData: v_49b0b7, errMsg: v_9e86fd?.message, stack: v_9e86fd?.stack });
                        const v_badeaf = v_9e86fd?.response?.data?.message ?? v_9e86fd?.message ?? '구매 처리 중 오류가 발생했습니다.';
                        const v_d6be1a = typeof v_badeaf === 'string' && /^[\x00-\x7F\s]+$/.test(v_badeaf);
                        v_889fad(
                            v_8d41d7('screens.shopProductDetail.alerts.purchaseFailed'),
                            v_d6be1a ? '구매 처리 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.' : v_badeaf,
                            [{ text: v_8d41d7('screens.shopProductDetail.confirm') }],
                        );
                    } finally {
                        v_e94938(false);
                    }
                }
            },
        ]);
    };

    const v_184ff4 = () => {
        v_9375ae(false);
        v_9b57fc(v_ce4741.shopMyItems);
    };

    const v_fde250 = v_d62ac8 === 'game_id' ? 'gameId' : v_d62ac8 === 'meter' ? 'meter' : 'phone';
    const v_d1823a = v_de06a3((v_ae8e76) => `screens.shop.iak.${v_fde250}${v_ae8e76}`, [v_fde250]);
    const v_fb1620 = v_8d41d7(v_d1823a('Label'));
    const v_1bfbb1 = v_de06a3(async () => {
        if (!v_660822 || v_673bf2) return;
        const v_d74a81 = v_f3e760.trim();
        if (!v_d74a81) {
            v_889fad(v_8d41d7('screens.shop.iak.notice'), v_8d41d7(v_d1823a('Required')), [{ text: v_8d41d7('screens.shop.iak.ok') }]);
            return;
        }
        if (v_a1c497 === null || v_19340b) {
            v_889fad(v_8d41d7('screens.shop.iak.notice'), v_8d41d7('screens.shop.iak.balanceLoading'), [{ text: v_8d41d7('screens.shop.iak.ok') }]);
            return;
        }
        if (v_a1c497 < v_01bee9.price) {

            const v_ff3b79 = (v_01bee9.price - v_a1c497).toFixed(2).replace(/\.?0+$/, '');
            v_889fad(
                v_8d41d7('screens.shop.iak.notice'),
                v_8d41d7('screens.shopProductDetail.alerts.insufficientWithShortage', { shortage: v_ff3b79 }),
                [
                    { text: v_8d41d7('screens.shopProductDetail.alerts.collectXrun'), onPress: () => v_9b57fc(v_ce4741.xplayInfo) },
                    { text: v_8d41d7('screens.shop.iak.ok') },
                ],
            );
            return;
        }
        v_889fad(
            v_8d41d7('screens.shop.iak.purchaseConfirmTitle'),
            v_8d41d7('screens.shop.iak.purchaseConfirmMessage', { title: v_01bee9.title, price: v_01bee9.price, label: v_fb1620, customer: v_d74a81, phone: v_d74a81 }),
            [
                { text: v_8d41d7('screens.shop.iak.cancel') },
                {
                    text: v_8d41d7('screens.shop.iak.buyConfirm'),
                    onPress: async () => {
                        v_beef40(true);
                        try {
                            const v_8f00b9 = await v_960478({
                                member: Number(v_660822),
                                product_code: String(v_01bee9.id),
                                customer_id: v_d74a81,
                                env: 'prod',
                            }, v_9b57fc);

                            const v_46d11c = v_8f00b9?.data ?? null;
                            const v_44c7d6 = v_46d11c?.txn_status;
                            const v_e629b5 = v_46d11c?.user_message ?? null;
                            const v_3bf403 = !!v_46d11c?.refunded || v_44c7d6 === 'refunded';
                            if (v_8f00b9?.status === 'success' && v_44c7d6 === 'success') {
                                v_303962(v_46d11c);
                                v_c43513(true);
                                v_abb08d();
                            } else if (v_8f00b9?.status === 'success' && (v_44c7d6 === 'failed' || v_44c7d6 === 'refunded')) {
                                const v_3d2fa3 = v_8d41d7('screens.shop.iak.purchaseFailed');
                                const v_58ca36 = v_e629b5 || v_8f00b9?.message || v_8d41d7('screens.shop.iak.unknownError');
                                const v_09a83a = v_3bf403 ? `\n\n${v_8d41d7('screens.shop.iak.autoRefunded')}` : '';
                                v_889fad(v_3d2fa3, `${v_58ca36}${v_09a83a}`, [{ text: v_8d41d7('screens.shop.iak.ok') }]);
                                v_abb08d();
                            } else if (v_8f00b9?.code === 410) {

                                try {
                                    const v_f24fd5 = await v_e84827.getItem('userData');
                                    const v_f21c33 = v_f24fd5 ? JSON.parse(v_f24fd5) : null;
                                    const v_717992 = v_f21c33?.member != null ? Number(v_f21c33.member) : null;
                                    const v_e0c7e8 = (v_f21c33?.email ?? '').toLowerCase().trim();
                                    if (v_717992 && v_e0c7e8 && v_5e6c2c(v_e0c7e8)) {
                                        const v_1e6eca = await v_9d7f6b(v_e0c7e8, v_717992);
                                        const v_dfc1c0 = (v_1e6eca.pol?.s === 's1');
                                        if (v_dfc1c0) {
                                            v_04a3b7({ memberId: v_717992, email: v_e0c7e8, kind: 'iak', iakCustomerId: v_d74a81 });
                                            v_1c868b(true);
                                            v_beef40(false);
                                            return;
                                        }
                                    }
                                } catch {  }
                                v_889fad(v_8d41d7('screens.shop.iak.purchaseFailed'), v_8d41d7('screens.walletRestore.restoreNeededShort'), [
                                    { text: v_8d41d7('screens.shop.iak.ok') },
                                    { text: v_8d41d7('screens.walletRestore.restoreNow'), onPress: () => v_9b57fc(v_ce4741.walletRestore) },
                                ]);
                            } else {

                                const v_45d3c9 = (v_8f00b9 as any)?.data ?? null;
                                const v_f6084d = v_45d3c9?.user_message ?? null;
                                const v_306ba5 = !!v_45d3c9?.refunded || v_45d3c9?.txn_status === 'refunded';
                                const v_5387f9 = v_f6084d || v_8f00b9?.message || v_8d41d7('screens.shop.iak.unknownError');
                                const v_c4199b = v_306ba5 ? `\n\n${v_8d41d7('screens.shop.iak.autoRefunded')}` : '';
                                v_889fad(v_8d41d7('screens.shop.iak.purchaseFailed'), `${v_5387f9}${v_c4199b}`, [{ text: v_8d41d7('screens.shop.iak.ok') }]);
                                v_abb08d();
                            }
                        } finally {
                            v_beef40(false);
                        }
                    },
                },
            ]);
    }, [v_8d41d7, v_660822, v_f3e760, v_673bf2, v_01bee9.id, v_01bee9.title, v_01bee9.price, v_a1c497, v_19340b, v_889fad, v_9b57fc, v_abb08d, v_d1823a, v_fb1620]);

    const v_435347 = () => {
        v_c43513(false);
        v_23d029('');
        v_303962(null);
        v_9b57fc(v_ce4741.shopMyItems);
    };

    const v_48c801 = () => {
        v_453192(false);
        v_b75b27(null);
        v_9b57fc(v_ce4741.shopMyItems);
    };

    const v_fa78fb = v_01bee9.isXrun || v_01bee9.brand === 'XRUN';
    const v_1efa5f = v_33c40c;

    const v_a7bcbf = (v_5db874 && v_90e57e?.goodsImgB) || v_90e57e?.goodsImgS || v_90e57e?.mmsGoodsImg || '';
    const v_6ef3ee = v_a7bcbf ? { uri: v_a7bcbf } : v_01bee9.image;
    const v_a12826 = v_ca5e50 || !v_6ef3ee;
    console.log('[ShopProductDetail] 이미지 소스:', { remoteUri: v_a7bcbf, hasProductImage: !!v_01bee9.image, imageLoadFailed: v_ca5e50, usingFallback: !v_a7bcbf || v_ca5e50 });
    const v_ba7f97 = (v_5db874 && v_90e57e?.goodsName) ? v_90e57e.goodsName : v_01bee9.title;
    const v_b034a8 = (v_5db874 && v_90e57e?.brandName) ? v_90e57e.brandName : v_01bee9.brand;

    const v_e72b09 = v_01bee9.price;
    const v_513fb9 = v_b7c830 == null ? null : (v_b7c830 - v_e72b09);
    const v_d0206c = v_5db874 && v_90e57e && (v_90e57e.content || v_90e57e.contentAddDesc);

    return (
        <SafeView style={v_d81136.container} backgroundColor="#F8FAFC">
            <StatusBar style="dark" />
            <Header
                title={v_8d41d7('screens.shopProductDetail.productInfo')}
                onBackPress={v_c7ac57}
                showBackButton
            />
            <SafeScrollView showsVerticalScrollIndicator={false} showBottomBackground={false} backgroundColor="transparent" disableBottomPadding={true}>
                <View style={v_d81136.content}>
                    {}
                    <View style={v_d81136.productCard}>
                        {v_5db874 && v_39954a && (
                            <View style={v_d81136.detailLoadingWrap}>
                                <ActivityIndicator size="small" color="#1E3A5F" />
                            </View>
                        )}
                        <View style={v_d81136.productImageContainer}>
                            {}
                            {!v_a12826 && (
                                <Image
                                    source={v_6ef3ee}
                                    style={{ width: '100%', aspectRatio: 1, borderRadius: 16 }}
                                    resizeMode="cover"
                                    onError={() => v_aad6d1(true)}
                                />
                            )}
                        </View>
                        {}
                        <View style={[v_d81136.productInfoContainer, { alignItems: 'flex-start' }]}>
                            <View style={v_d81136.brandContainer}>
                                <Text style={[v_d81136.brand, { textAlign: 'left' }]}>{v_b034a8}</Text>
                            </View>
                            <Text style={[v_d81136.title, { textAlign: 'left', alignSelf: 'stretch' }]}>{v_ba7f97}</Text>
                            {}
                            {!v_d0d89e && (
                                <Text style={v_d81136.detailPriceText}>{Number(v_01bee9.price ?? 0).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })} XRUN</Text>
                            )}
                            {}
                            {v_25cfbb > 9999 && null}
                        </View>
                    </View>

                    {}
                    {v_d0d89e ? (
                        <View style={v_d81136.paymentCard}>
                            <View style={v_d81136.sectionHeader}>
                                <Feather name="check-circle" size={18} color="#22c55e" />
                                <Text style={v_d81136.sectionTitle}>{v_8d41d7('screens.shopProductDetail.purchaseCompleteInfo')}</Text>
                            </View>
                            <View style={v_d81136.divider} />
                            <View style={v_d81136.paymentRow}>
                                <Text style={v_d81136.paymentLabel}>{v_8d41d7('screens.shopProductDetail.paymentAmount')}</Text>
                                <View style={v_d81136.priceContainer}>
                                    <Image source={v_1efa5f} style={v_d81136.coinIcon} resizeMode="contain" />
                                    <Text style={v_d81136.paymentValue}>
                                        {(() => {

                                            const v_6f7c85 = [
                                                v_509dc4,
                                                Number((v_dfe883 as any)?.priceXrun ?? 0),
                                                Number(v_01bee9.price ?? 0),
                                            ];
                                            const v_a057b5 = v_6f7c85.find((v_f4e98d) => isFinite(v_f4e98d) && v_f4e98d > 0) ?? 0;
                                            return v_a057b5 > 0
                                                ? `${v_a057b5.toFixed(4).replace(/\.?0+$/, '')} XRUN`
                                                : '-';
                                        })()}
                                    </Text>
                                </View>
                            </View>
                            <View style={v_d81136.paymentRowLast}>
                                <Text style={v_d81136.paymentLabel}>{v_8d41d7('screens.shopProductDetail.purchaseDateLabel')}</Text>
                                <Text style={v_d81136.paymentBalance}>{v_6468c7 || '-'}</Text>
                            </View>
                        </View>
                    ) : null}

                    {
}
                    {(() => {
                        const v_620603 = String(v_01bee9.description ?? '').trim();
                        const v_87a4e3 = v_620603 === '' || v_620603 === '-';
                        const v_4acbf9 = !!(v_d0206c || (v_01bee9.description && !v_87a4e3));

                        const v_dbeca6 = v_4acbf9 ? v_32eda7 : 'guide';
                        return (
                    <View style={v_d81136.guideCard}>
                        <View style={v_d81136.tabRow}>
                            {v_4acbf9 && (
                                <TouchableOpacity
                                    onPress={() => v_047920('desc')}
                                    style={[v_d81136.tabButton, v_dbeca6 === 'desc' && v_d81136.tabButtonActive]}
                                    activeOpacity={0.8}
                                >
                                    <Text style={[v_d81136.tabButtonText, v_dbeca6 === 'desc' && v_d81136.tabButtonTextActive]}>
                                        {v_8d41d7('screens.shopProductDetail.tabDescription')}
                                    </Text>
                                </TouchableOpacity>
                            )}
                            <TouchableOpacity testID={v_5401ae.shopProductDetail.detailTab}
                                onPress={() => v_047920('guide')}
                                style={[v_d81136.tabButton, v_dbeca6 === 'guide' && v_d81136.tabButtonActive]}
                                activeOpacity={0.8}
                            >
                                <Text style={[v_d81136.tabButtonText, v_dbeca6 === 'guide' && v_d81136.tabButtonTextActive]}>
                                    {v_8d41d7('screens.shopProductDetail.tabGuide')}
                                </Text>
                            </TouchableOpacity>
                        </View>

                        {}
                        {v_dbeca6 === 'desc' && v_4acbf9 && (
                            <View style={{ paddingTop: 16 }}>
                                {(() => {
                                    const v_453c44 = v_d0206c
                                        ? (v_90e57e?.content || v_90e57e?.contentAddDesc || '').trim()
                                        : String(v_01bee9.description).trim();

                                    const v_a52412 = v_453c44.split('\n').map((v_1614db) => v_1614db.trim()).filter(Boolean);
                                    const v_946c09 = [];
                                    let v_c3bc75 = null;
                                    const v_fea108 = /^(?:▶\s*(.+)|\[([^\]]+)\]\s*(.*))$/;
                                    for (const v_e6293e of v_a52412) {
                                        const v_35f85c = v_e6293e.match(v_fea108);
                                        if (v_35f85c) {
                                            if (v_c3bc75) v_946c09.push(v_c3bc75);
                                            const v_66b19f = (v_35f85c[1] ?? v_35f85c[2] ?? '').trim();
                                            v_c3bc75 = { heading: v_66b19f, body: [] };
                                            const v_25c4f7 = (v_35f85c[3] ?? '').trim();
                                            if (v_25c4f7) v_c3bc75.body.push(v_25c4f7);
                                        } else if (v_c3bc75) {
                                            v_c3bc75.body.push(v_e6293e);
                                        } else {

                                            v_c3bc75 = { heading: '', body: [v_e6293e] };
                                        }
                                    }
                                    if (v_c3bc75) v_946c09.push(v_c3bc75);

                                    if (v_946c09.length === 1 && !v_946c09[0].heading) {
                                        return (
                                            <Text style={[v_d81136.productDescription, { textAlign: 'left', marginTop: 0 }]}>
                                                {v_946c09[0].body.join('\n')}
                                            </Text>
                                        );
                                    }
                                    return v_946c09.map((v_b6a7e0, v_e86ad8) => (
                                        <View key={v_e86ad8} style={{ marginBottom: v_e86ad8 < v_946c09.length - 1 ? 16 : 0 }}>
                                            {v_b6a7e0.heading ? (
                                                <Text style={[v_d81136.productDescription, { textAlign: 'left', marginTop: 0, fontWeight: '700', color: '#111827', marginBottom: 6 }]}>
                                                    {v_b6a7e0.heading}
                                                </Text>
                                            ) : null}
                                            {v_b6a7e0.body.map((v_e6293e, v_ebec57) => (
                                                <Text key={v_ebec57} style={[v_d81136.productDescription, { textAlign: 'left', marginTop: 0, marginBottom: 4 }]}>
                                                    {v_e6293e}
                                                </Text>
                                            ))}
                                        </View>
                                    ));
                                })()}
                            </View>
                        )}

                        {}
                        {v_dbeca6 === 'guide' && (
                            <View style={{ paddingTop: 16 }}>
                                <Text style={[v_d81136.productDescription, { textAlign: 'left', marginTop: 0, fontWeight: '700', color: '#111827', marginBottom: 6 }]}>
                                    {v_8d41d7('screens.shopProductDetail.cancelRefund')}
                                </Text>
                                <Text style={[v_d81136.productDescription, { textAlign: 'left', marginTop: 0, marginBottom: 4 }]}>• {v_8d41d7('screens.shopProductDetail.cancelRefundLine1')}</Text>
                                <Text style={[v_d81136.productDescription, { textAlign: 'left', marginTop: 0, marginBottom: 4 }]}>• {v_8d41d7('screens.shopProductDetail.cancelRefundLine2')}</Text>
                                <Text style={[v_d81136.productDescription, { textAlign: 'left', marginTop: 0, marginBottom: 16 }]}>• {v_8d41d7('screens.shopProductDetail.cancelRefundLine3')}</Text>

                                <Text style={[v_d81136.productDescription, { textAlign: 'left', marginTop: 0, fontWeight: '700', color: '#111827', marginBottom: 6 }]}>
                                    {v_8d41d7('screens.shopProductDetail.guideSubtitle')}
                                </Text>
                                <Text style={[v_d81136.productDescription, { textAlign: 'left', marginTop: 0, marginBottom: 4 }]}>• {v_8d41d7('screens.shopProductDetail.guideLine1')}</Text>
                                <Text style={[v_d81136.productDescription, { textAlign: 'left', marginTop: 0, marginBottom: 4 }]}>• {v_8d41d7('screens.shopProductDetail.guideLine2')}</Text>
                            </View>
                        )}
                    </View>
                        );
                    })()}
                </View>
            </SafeScrollView>

            {}
            {!v_d0d89e && (
            <View style={[v_d81136.buttonContainer, { paddingBottom: v_365f44 + 20 }]}>
                {v_01bee9.isIak ? (

                    <TouchableOpacity
                        style={[v_d81136.purchaseButton, v_673bf2 && v_d81136.purchaseButtonDisabled]}
                        onPress={() => { v_23d029(''); v_37f2b0(true); }}
                        disabled={v_673bf2 || v_660822 == null}
                        activeOpacity={0.8}
                    >
                        <LinearGradient
                            colors={['#1E3A5F', '#2D4A6F']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={v_d81136.purchaseButtonGradient}
                        >
                            {v_673bf2 ? <ActivityIndicator size="small" color="#FFFFFF" style={v_d81136.purchaseIcon} /> : null}
                            {v_673bf2 ? (
                                <LoadingText text={v_8d41d7('screens.shop.iak.processing')} style={v_d81136.purchaseButtonText} />
                            ) : (
                                <Text style={v_d81136.purchaseButtonText}>{v_8d41d7('screens.shop.iak.buyButton')}</Text>
                            )}
                        </LinearGradient>
                    </TouchableOpacity>
                ) : v_5db874 ? (
                    <TouchableOpacity testID={v_5401ae.shopProductDetail.xplayPurchase}
                        style={[v_d81136.purchaseButton, v_18a900 && v_d81136.purchaseButtonDisabled]}
                        onPress={v_b000c1}
                        disabled={v_18a900 || v_837630 || v_660822 == null}
                        activeOpacity={0.8}
                    >
                        <LinearGradient
                            colors={['#1E3A5F', '#2D4A6F']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={v_d81136.purchaseButtonGradient}
                        >
                            {v_18a900 ? (
                                <ActivityIndicator size="small" color="#FFFFFF" style={v_d81136.purchaseIcon} />
                            ) : null}
                            {v_18a900 ? (
                                <LoadingText text={v_8d41d7('screens.shopProductDetail.processing')} style={v_d81136.purchaseButtonText} />
                            ) : (
                                <Text style={v_d81136.purchaseButtonText}>{v_8d41d7('screens.shopProductDetail.purchaseWithXRUN')}</Text>
                            )}
                        </LinearGradient>
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity testID={v_5401ae.shopProductDetail.purchase}
                        style={v_d81136.purchaseButton}
                        onPress={v_dfaad1}
                        activeOpacity={0.8}
                    >
                        <LinearGradient
                            colors={['#1E3A5F', '#2D4A6F']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={v_d81136.purchaseButtonGradient}
                        >
                            <Text style={v_d81136.purchaseButtonText}>{v_8d41d7('screens.shopProductDetail.purchaseButton')}</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                )}
            </View>
            )}

            {}
            <Modal
                visible={v_80e2be}
                transparent={true}
                animationType="fade"
                onRequestClose={v_184ff4}
            >
                <View style={v_d81136.modalOverlay}>
                    <View style={v_d81136.paymentSuccessModal}>
                        <View style={v_d81136.modalLogoContainer}>
                            <Image source={v_33c40c} style={v_d81136.modalLogo} resizeMode="contain" />
                        </View>
                        <Text style={v_d81136.paymentSuccessMessage}>{v_8d41d7('screens.shopProductDetail.paymentComplete')}</Text>
                        <TouchableOpacity testID={v_5401ae.shopProductDetail.paymentSuccessClose} style={v_d81136.paymentSuccessButton} onPress={v_184ff4} activeOpacity={0.8}>
                            <Text style={v_d81136.paymentSuccessButtonText}>{v_8d41d7('screens.shopProductDetail.confirm')}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            {}
            <Modal
                visible={v_417986}
                transparent={true}
                animationType="fade"
                onRequestClose={() => v_37f2b0(false)}
            >
                <KeyboardAvoidingView
                    behavior={v_326be8.OS === 'ios' ? 'padding' : 'height'}
                    style={v_d81136.modalOverlay}
                >
                    <View style={[v_d81136.paymentSuccessModal, { paddingTop: 24 }]}>
                        <Text style={{ fontSize: 17, fontWeight: '700', color: '#111827', marginBottom: 8, textAlign: 'center' }}>
                            {v_8d41d7(v_d1823a('ModalTitle'))}
                        </Text>
                        <Text style={{ fontSize: 12, color: '#6b7280', marginBottom: 16, textAlign: 'center' }}>
                            {v_8d41d7(v_d1823a('ModalDesc'))}
                        </Text>
                        <TextInput testID={v_5401ae.shopProductDetail.iakPhoneInput}
                            value={v_f3e760}
                            onChangeText={v_23d029}
                            placeholder={v_8d41d7(v_d1823a('Placeholder'))}
                            keyboardType={v_d62ac8 === 'game_id' ? 'numeric' : 'phone-pad'}
                            autoFocus
                            style={{ borderWidth: 1, borderColor: '#d1d5db', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, fontSize: 15, marginBottom: 16, backgroundColor: '#fff', width: '100%' }}
                        />
                        <View style={{ flexDirection: 'row', gap: 8, width: '100%' }}>
                            <TouchableOpacity
                                style={{ flex: 1, padding: 12, borderRadius: 8, backgroundColor: '#e5e7eb', alignItems: 'center' }}
                                onPress={() => v_37f2b0(false)}
                                disabled={v_673bf2}
                                activeOpacity={0.8}
                            >
                                <Text style={{ color: '#374151', fontWeight: '600' }}>{v_8d41d7('screens.shop.iak.cancel')}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={{ flex: 1, padding: 12, borderRadius: 8, backgroundColor: v_f3e760.trim() ? '#1E3A5F' : '#9ca3af', alignItems: 'center' }}
                                onPress={() => { v_37f2b0(false); v_1bfbb1(); }}
                                disabled={v_673bf2 || !v_f3e760.trim()}
                                activeOpacity={0.8}
                            >
                                <Text style={{ color: '#fff', fontWeight: '700' }}>{v_8d41d7('screens.shop.iak.buyConfirm')}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </KeyboardAvoidingView>
            </Modal>

            {}
            <Modal
                visible={v_818c63}
                transparent={true}
                animationType="fade"
                onRequestClose={v_435347}
            >
                <View style={v_d81136.modalOverlay}>
                    <View style={v_d81136.paymentSuccessModal}>
                        <View style={v_d81136.modalLogoContainer}>
                            <Image source={v_33c40c} style={v_d81136.modalLogo} resizeMode="contain" />
                        </View>
                        <Text style={[v_d81136.paymentSuccessMessage, { marginBottom: 12 }]}>
                            {v_8d41d7('screens.shop.iak.successTitle')}
                        </Text>
                        {v_889a26?.iak?.sn ? (
                            <View style={{ alignItems: 'center', marginBottom: 16 }}>
                                <Text style={{ fontSize: 12, color: '#6b7280', marginBottom: 4 }}>{v_8d41d7('screens.shop.iak.snLabel')}</Text>
                                <Text style={{ fontSize: 16, fontWeight: '700', fontFamily: 'Roboto-Medium', color: '#111827', letterSpacing: 1 }}>
                                    {v_889a26.iak.sn}
                                </Text>
                            </View>
                        ) : null}
                        <View style={{ backgroundColor: '#eff6ff', borderRadius: 8, padding: 12, marginBottom: 16, width: '100%' }}>
                            <Text style={{ fontSize: 12, color: '#1e40af', lineHeight: 18, textAlign: 'center' }}>
                                {v_8d41d7('screens.shop.iak.smsNotice')}
                            </Text>
                        </View>
                        <TouchableOpacity testID={v_5401ae.shopProductDetail.iakSuccessClose} style={v_d81136.paymentSuccessButton} onPress={v_435347} activeOpacity={0.8}>
                            <Text style={v_d81136.paymentSuccessButtonText}>{v_8d41d7('screens.shop.iak.ok')}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            {}
            <Modal
                visible={v_809e5c}
                transparent={true}
                animationType="fade"
                onRequestClose={v_48c801}
            >
                <View style={v_d81136.modalOverlay}>
                    <View style={[v_d81136.paymentSuccessModal, v_a71862?.coupon_img_url ? v_d81136.paymentSuccessModalWide : undefined]}>
                        <View style={v_d81136.modalLogoContainer}>
                            <Image source={v_33c40c} style={v_d81136.modalLogo} resizeMode="contain" />
                        </View>
                        <Text testID={v_5401ae.shopProductDetail.couponImgUrlLabel} style={v_d81136.paymentSuccessMessage}>
                            {v_a71862?.coupon_img_url ? v_8d41d7('screens.shopProductDetail.couponIssued') : v_8d41d7('screens.shopProductDetail.paymentComplete')}
                        </Text>
                        {v_a71862?.coupon_img_url ? (
                            <ScrollView style={v_d81136.couponBarcodeScroll} showsVerticalScrollIndicator={false}>
                                <Image
                                    source={{ uri: v_a71862.coupon_img_url }}
                                    style={v_d81136.couponBarcodeImage}
                                    resizeMode="contain"
                                />
                                {v_a71862.pin_no ? (
                                    <Text style={v_d81136.couponPinNo}>{v_8d41d7('screens.shopProductDetail.couponPinLabel')}: {v_a71862.pin_no}</Text>
                                ) : null}
                                {v_a71862.limit_date ? (
                                    <Text style={v_d81136.couponLimitDate}>{v_8d41d7('screens.shopProductDetail.couponValidityPrefix')} {v_a71862.limit_date} {v_8d41d7('screens.shopProductDetail.couponValiditySuffix')}</Text>
                                ) : null}
                            </ScrollView>
                        ) : null}
                        <TouchableOpacity testID={v_5401ae.shopProductDetail.xplayPaymentSuccessClose} style={v_d81136.paymentSuccessButton} onPress={v_48c801} activeOpacity={0.8}>
                            <Text style={v_d81136.paymentSuccessButtonText}>{v_8d41d7('screens.shopProductDetail.viewMyGift')}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            {}
            {v_f5e16b && v_d49490 && (
                <WalletKeyPinPromptModal
                    visible={v_f5e16b}
                    memberId={v_d49490.memberId}
                    email={v_d49490.email}
                    processingLabel={v_8d41d7('screens.shop.iak.processingPayment')}
                    onSuccess={async (wallets: v_b9a3bd[]) => {

                        if (v_bd58fc) return;
                        v_24bbbd(true);
                        const v_94302c = v_d49490.kind;
                        try {

                            const v_5f5d6d = v_53579f.find((v_32f7b8) => v_32f7b8.wallet_code === 'c18')
                                ?? v_53579f.find((v_32f7b8) => v_32f7b8.wallet_code === 'c16');
                            if (!v_5f5d6d?.private_key) {
                                throw new Error('지갑 키를 찾을 수 없어요. 복원을 먼저 해주세요.');
                            }
                            if (v_94302c === 'iak') {

                                const v_d61629 = v_d49490.iakCustomerId ?? '';
                                if (!v_d61629) throw new Error(v_8d41d7(v_d1823a('Required')));
                                const v_f91eae = await v_6acf4c(v_660822!, String(v_01bee9.id), v_9b57fc);
                                if (v_f91eae?.status !== 'success' || !v_f91eae.data?.[0]) {
                                    throw new Error(v_f91eae?.message || 'IAK prepare 실패');
                                }
                                const v_ab4c96 = v_f91eae.data[0];
                                const v_9c423d = await v_e134f3({
                                    privateKey: v_5f5d6d.private_key,
                                    fromAddress: v_ab4c96.userAddress,
                                    toAddress: v_ab4c96.casherAddress,
                                    amount: String(v_ab4c96.actualPurchaseAmount),
                                    currency: 18,
                                });
                                if (!v_9c423d.ok) {
                                    const v_3cfdfc = (v_9c423d as any).detail ?? (v_9c423d as any).reason ?? '송금 실패';
                                    const v_f2d01d = typeof v_3cfdfc === 'string' ? v_3cfdfc : '';
                                    const v_f17ac7 = (v_9c423d as any).reason === 'broadcast-failed'
                                        && /수수료|가스|insufficient funds/i.test(v_f2d01d);
                                    if (v_f17ac7) {
                                        v_1c868b(false);
                                        v_24bbbd(false);
                                        await v_889fad(v_8d41d7('common.gasInsufficient.title'), v_8d41d7('common.gasInsufficient.messagePurchase'));
                                        return;
                                    }
                                    throw new Error(v_f2d01d || '송금 실패');
                                }
                                const v_94a7a9 = await v_b20e92(
                                    v_660822!, v_ab4c96.ref_id, v_d61629, v_9c423d.txHash, String(v_01bee9.id), v_9b57fc
                                );

                                const v_9b4c90 = Array.isArray(v_94a7a9?.data) ? v_94a7a9.data[0] : v_94a7a9?.data;
                                const v_7a4a92 = v_9b4c90?.txn_status;
                                if (v_94a7a9?.status === 'success' && v_7a4a92 === 'success') {
                                    console.log('[T-031 IAK 구매] 성공:', { txHash: v_9c423d.txHash, ref_id: v_ab4c96.ref_id });
                                    v_303962(v_9b4c90);
                                    v_1c868b(false);
                                    v_c43513(true);
                                    v_abb08d();
                                    return;
                                }
                                if (v_7a4a92 === 'failed' || v_7a4a92 === 'refunded' || v_94a7a9?.status !== 'success') {
                                    v_1c868b(false);
                                    v_24bbbd(false);
                                    const v_58ca36 = v_9b4c90?.user_message || v_94a7a9?.message || v_8d41d7('screens.shop.iak.unknownError');
                                    const v_3bf403 = !!v_9b4c90?.refunded || v_7a4a92 === 'refunded';
                                    const v_09a83a = v_3bf403 ? `\n\n${v_8d41d7('screens.shop.iak.autoRefunded')}` : '';
                                    v_889fad(v_8d41d7('screens.shop.iak.purchaseFailed'), `${v_58ca36}${v_09a83a}`, [{ text: v_8d41d7('screens.shop.iak.ok') }]);
                                    v_abb08d();
                                    return;
                                }

                                v_303962(v_9b4c90);
                                v_1c868b(false);
                                v_c43513(true);
                                v_abb08d();
                                return;
                            }
                            if (v_94302c === 'gift') {

                                const v_f91eae = await v_01eada(v_660822!, String(v_01bee9.id), v_9b57fc);
                                if (v_f91eae?.status !== 'success' || !v_f91eae.data?.[0]) {
                                    throw new Error(v_f91eae?.message || 'prepare 실패');
                                }
                                const v_ab4c96 = v_f91eae.data[0];

                                try {
                                    const v_d0d301 = await v_ec4a4a(v_660822!, String(v_01bee9.id), v_9b57fc);
                                    if (v_d0d301?.status !== 'success' || !v_d0d301.data?.[0]?.pol_tx_hash) {
                                        console.warn('[gift purchase] sponsor gas warn:', v_d0d301?.message);

                                    } else {
                                        console.log('[gift purchase] sponsor gas ok:', v_d0d301.data[0]);
                                    }
                                } catch (v_f9601b) {
                                    console.warn('[gift purchase] sponsor gas exception:', v_f9601b?.message);

                                }
                                const v_9c423d = await v_e134f3({
                                    privateKey: v_5f5d6d.private_key,
                                    fromAddress: v_ab4c96.userAddress,
                                    toAddress: v_ab4c96.casherAddress,
                                    amount: String(v_ab4c96.actualPurchaseAmount),
                                    currency: 18,
                                });
                                if (!v_9c423d.ok) {
                                    const v_3cfdfc = (v_9c423d as any).detail ?? (v_9c423d as any).reason ?? '송금 실패';

                                    const v_f2d01d = typeof v_3cfdfc === 'string' ? v_3cfdfc : '';
                                    const v_f17ac7 = (v_9c423d as any).reason === 'broadcast-failed'
                                        && /수수료|가스|insufficient funds/i.test(v_f2d01d);
                                    if (v_f17ac7) {
                                        v_1c868b(false);
                                        v_24bbbd(false);
                                        await v_889fad(
                                            v_8d41d7('common.gasInsufficient.title'),
                                            v_8d41d7('common.gasInsufficient.messagePurchase'),
                                        );
                                        return;
                                    }
                                    throw new Error(v_f2d01d || '송금 실패');
                                }
                                const v_94a7a9 = await v_48805f(v_660822!, String(v_01bee9.id), v_7496db ?? '', v_9c423d.txHash, v_ab4c96.actualPurchaseAmount, v_9b57fc);
                                if (v_94a7a9?.status !== 'success') {
                                    const v_3aa4d9 = Array.isArray(v_94a7a9?.data) && v_94a7a9.data[0]?.pending_manual;
                                    const v_4d1536 = v_94a7a9?.message || v_8d41d7('screens.shopProductDetail.alerts.couponSendFail');
                                    if (v_3aa4d9) {

                                        v_1c868b(false);
                                        v_889fad(
                                            v_8d41d7('screens.shopProductDetail.alerts.paymentCompletePendingCouponTitle'),
                                            v_8d41d7('screens.shopProductDetail.alerts.paymentCompletePendingCouponMessage', { reason: v_4d1536, tx: v_9c423d.txHash.slice(0, 16) }),
                                            [{ text: v_8d41d7('screens.shopProductDetail.confirm') }],
                                        );
                                        v_abb08d();
                                        return;
                                    }
                                    throw new Error(v_4d1536);
                                }
                                console.log('[T-031 기프티콘 구매] 성공:', { txHash: v_9c423d.txHash });

                                v_b75b27(v_94a7a9?.data?.[0] ?? v_94a7a9?.data ?? null);
                                v_1c868b(false);
                                v_453192(true);
                                v_abb08d();
                                return;
                            }

                            const v_f91eae = await v_070bef(v_660822!, parseInt(String(v_01bee9.id), 10), v_9b57fc);
                            if (v_f91eae?.status !== 'success' || !v_f91eae.data?.[0]) {
                                throw new Error(v_f91eae?.message || 'prepare 실패');
                            }
                            const v_ab4c96 = v_f91eae.data[0];
                            const v_9c423d = await v_e134f3({
                                privateKey: v_5f5d6d.private_key,
                                fromAddress: v_ab4c96.userAddress,
                                toAddress: v_ab4c96.casherAddress,
                                amount: String(v_ab4c96.actualPurchaseAmount),
                                currency: 18,
                            });
                            if (!v_9c423d.ok) {
                                const v_3cfdfc = (v_9c423d as any).detail ?? (v_9c423d as any).reason ?? '송금 실패';

                                const v_f2d01d = typeof v_3cfdfc === 'string' ? v_3cfdfc : '';
                                const v_f17ac7 = (v_9c423d as any).reason === 'broadcast-failed'
                                    && /수수료|가스|insufficient funds/i.test(v_f2d01d);
                                if (v_f17ac7) {
                                    v_1c868b(false);
                                    v_24bbbd(false);
                                    await v_889fad(
                                        v_8d41d7('common.gasInsufficient.title'),
                                        v_8d41d7('common.gasInsufficient.messagePurchase'),
                                    );
                                    return;
                                }
                                throw new Error(v_f2d01d || '송금 실패');
                            }
                            const v_94a7a9 = await v_324bd9(v_660822!, parseInt(String(v_01bee9.id), 10), v_9c423d.txHash, v_ab4c96.actualPurchaseAmount, v_9b57fc);
                            if (v_94a7a9?.status !== 'success') {
                                throw new Error(v_94a7a9?.message || 'record 실패');
                            }
                            console.log('[T-031 구매] 성공:', { txHash: v_9c423d.txHash });
                            v_abb08d();

                            v_1c868b(false);
                            v_9375ae(true);
                        } catch (v_9e86fd) {
                            console.error('[T-031 구매] 실패:', v_9e86fd?.message);

                            v_1c868b(false);
                            v_889fad(
                                v_8d41d7('screens.shopProductDetail.alerts.purchaseFailed'),
                                v_9e86fd?.message || '구매 처리 중 오류가 발생했어요. 잠시 후 다시 시도해주세요.',
                                [{ text: v_8d41d7('screens.shopProductDetail.confirm') }],
                            );
                        } finally {
                            v_24bbbd(false);
                            v_04a3b7(null);
                        }
                    }}
                    onCancel={() => {
                        v_1c868b(false);
                        v_04a3b7(null);
                    }}
                />
            )}
        </SafeView>
    );
};

const v_d81136 = v_472849.create({
    container: {
        ...v_a61db3.container,
        backgroundColor: '#F8FAFC',
    },

    exchangeContent: {
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 120,
    },
    infoBanner: {
        backgroundColor: '#F3F4F6',
        borderRadius: 12,
        padding: 16,
        marginBottom: 24,
    },
    infoBannerText: {
        fontSize: 14,
        fontFamily: 'Roboto-Regular',
        color: '#374151',
        lineHeight: 20,
    },
    inputSection: {
        marginBottom: 24,
    },
    inputLabel: {
        fontSize: 15,
        fontFamily: 'Roboto-Medium',
        color: '#111827',
        marginBottom: 8,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        paddingHorizontal: 16,
        height: 52,
    },
    input: {
        flex: 1,
        fontSize: 15,
        fontFamily: 'Roboto-Regular',
        color: '#111827',
    },
    qrButton: {
        padding: 4,
    },
    maxButton: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        backgroundColor: '#F3F4F6',
        borderRadius: 8,
    },
    maxButtonText: {
        fontSize: 13,
        fontFamily: 'Roboto-Medium',
        color: '#6B7280',
    },
    minAmountHint: {
        fontSize: 12,
        fontFamily: 'Roboto-Regular',
        color: '#9CA3AF',
        marginTop: 6,
    },
    summarySection: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 20,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    summaryRowLast: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    summaryLabel: {
        fontSize: 15,
        fontFamily: 'Roboto-Regular',
        color: '#374151',
    },
    summaryValue: {
        fontSize: 15,
        fontFamily: 'Roboto-Regular',
        color: '#111827',
    },
    summaryValueBold: {
        fontSize: 15,
        fontFamily: 'Roboto-Bold',
        color: '#111827',
    },
    exchangeButtonContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        paddingHorizontal: 20,
        paddingTop: 16,
        backgroundColor: '#FFFFFF',
        borderTopWidth: 1,
        borderTopColor: '#E5E7EB',
    },
    exchangeButton: {
        backgroundColor: '#1E3A5F',
        paddingVertical: 18,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    exchangeButtonText: {
        fontSize: 17,
        fontFamily: 'Roboto-Bold',
        color: '#FFFFFF',
    },

    content: {
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 120,
    },
    productCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 20,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 5,
        borderWidth: 1,
        borderColor: '#F0F0F0',
    },
    productImageContainer: {
        marginBottom: 16,
        alignItems: 'center',
    },
    productImageWrapper: {
        width: '100%',
        height: 200,

        borderRadius: 16,
        overflow: 'hidden',
        backgroundColor: '#F3F4F6',
    },
    productImage: {
        width: '100%',
        height: '100%',
    },
    productInfoContainer: {
        alignItems: 'center',
    },
    brandContainer: {
        marginBottom: 8,
    },
    brand: {
        fontSize: 13,
        fontFamily: 'Roboto-Medium',
        color: '#6B7280',
        letterSpacing: 0.5,
    },
    title: {
        fontSize: 18,
        fontFamily: 'Roboto-Bold',
        color: '#111827',
        lineHeight: 26,
        textAlign: 'center',
        letterSpacing: -0.3,
    },

    bottomBalanceText: {
        fontSize: 13,
        color: '#6B7280',
        marginBottom: 10,
        textAlign: 'right',
    },

    tabRow: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
        marginBottom: 4,
    },
    tabButton: {
        flex: 1,
        paddingVertical: 12,
        alignItems: 'center',
        borderBottomWidth: 2,
        borderBottomColor: 'transparent',
        marginBottom: -1,
    },
    tabButtonActive: {
        borderBottomColor: '#1E3A5F',
    },
    tabButtonText: {
        fontSize: 14,
        color: '#9CA3AF',
        fontWeight: '500',
    },
    tabButtonTextActive: {
        color: '#1E3A5F',
        fontWeight: '700',
    },

    detailPriceText: {
        marginTop: 10,
        fontSize: 22,
        fontWeight: '700',
        color: '#111827',
        fontFamily: 'Roboto-Bold',
        alignSelf: 'flex-start',
    },
    productDescription: {
        marginTop: 12,
        fontSize: 14,
        fontFamily: 'Roboto-Regular',
        color: '#6B7280',
        lineHeight: 20,

        textAlign: 'center',
        alignSelf: 'stretch',
        width: '100%',
    },
    detailLoadingWrap: {
        position: 'absolute',
        top: 12,
        right: 12,
        zIndex: 1,
    },
    paymentCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 20,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 5,
        borderWidth: 1,
        borderColor: '#F0F0F0',
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
        gap: 8,
    },
    sectionTitle: {
        fontSize: 16,
        fontFamily: 'Roboto-Bold',
        color: '#111827',
        letterSpacing: -0.3,
    },
    divider: {
        height: 1,
        backgroundColor: '#F3F4F6',
        marginBottom: 16,
    },
    paymentRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
        paddingVertical: 4,
    },
    paymentRowLast: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 4,
    },
    paymentLabel: {
        fontSize: 15,
        fontFamily: 'Roboto-Medium',
        color: '#374151',
    },
    priceContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    coinIcon: {
        width: 20,
        height: 20,
    },
    paymentValue: {
        fontSize: 16,
        fontFamily: 'Roboto-Bold',
        color: '#1E3A5F',
        letterSpacing: -0.3,
    },
    paymentBalance: {
        fontSize: 15,
        fontFamily: 'Roboto-Regular',
        color: '#9CA3AF',
    },
    paymentRemaining: {
        fontSize: 16,
        fontFamily: 'Roboto-Bold',
        color: '#059669',
        letterSpacing: -0.3,
    },
    guideCard: {

        paddingHorizontal: 4,
        paddingBottom: 32,
        marginBottom: 20,
    },
    guideItem: {
        marginBottom: 20,
    },
    guideItemHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
        gap: 10,
    },
    guideNumber: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: '#1E3A5F',
        alignItems: 'center',
        justifyContent: 'center',
    },
    guideNumberText: {
        fontSize: 12,
        fontFamily: 'Roboto-Bold',
        color: '#FFFFFF',
    },
    guideSubtitle: {
        fontSize: 15,
        fontFamily: 'Roboto-Bold',
        color: '#111827',
        letterSpacing: -0.3,
    },
    guideTextContainer: {
        paddingLeft: 34,
    },
    guideText: {
        fontSize: 13,
        fontFamily: 'Roboto-Regular',
        color: '#6B7280',
        lineHeight: 20,
        marginBottom: 8,
        letterSpacing: -0.2,
    },
    buttonContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        paddingHorizontal: 20,
        paddingTop: 16,
        backgroundColor: '#FFFFFF',
        borderTopWidth: 1,
        borderTopColor: '#E5E7EB',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 8,
    },
    purchaseButton: {
        borderRadius: 14,
        overflow: 'hidden',
        shadowColor: '#1E3A5F',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
    },
    purchaseButtonDisabled: {
        opacity: 0.7,
    },
    purchaseButtonGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 18,
        gap: 8,
    },
    purchaseIcon: {
        marginRight: 4,
    },
    purchaseButtonText: {
        fontSize: 17,
        fontFamily: 'Roboto-Bold',
        color: '#FFFFFF',
        letterSpacing: 0.5,
    },

    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    paymentSuccessModal: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 32,
        width: '100%',
        maxWidth: 320,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 12,
        elevation: 8,
    },
    paymentSuccessModalWide: {
        maxWidth: 340,
        maxHeight: '85%',
    },
    couponBarcodeScroll: {
        width: '100%',
        maxHeight: 280,
        marginVertical: 16,
    },
    couponBarcodeImage: {
        width: '100%',
        height: 200,
        backgroundColor: '#F5F5F5',
        borderRadius: 12,
    },
    couponPinNo: {
        marginTop: 12,
        fontSize: 15,
        fontFamily: 'Roboto-Medium',
        color: '#111827',
        textAlign: 'center',
    },
    couponLimitDate: {
        marginTop: 4,
        fontSize: 14,
        fontFamily: 'Roboto-Regular',
        color: '#6B7280',
        textAlign: 'center',
    },
    modalLogoContainer: {
        marginBottom: 24,
        alignItems: 'center',
        justifyContent: 'center',
    },
    modalLogo: {
        width: 80,
        height: 80,
    },
    paymentSuccessMessage: {
        fontSize: 20,
        fontFamily: 'Roboto-Bold',
        color: '#111827',
        textAlign: 'center',
        marginBottom: 32,
        letterSpacing: -0.5,
    },
    paymentSuccessButton: {
        width: '100%',
        backgroundColor: '#1E3A5F',
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    paymentSuccessButtonText: {
        fontSize: 16,
        fontFamily: 'Roboto-Bold',
        color: '#FFFFFF',
        letterSpacing: 0.5,
    },
});
