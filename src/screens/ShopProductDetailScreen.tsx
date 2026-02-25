import v_a3453e, { v_5ab095, v_c4deb2, v_de06a3 } from 'bapkr';
import { v_3094a2, v_472849, v_19b633, v_4623af, v_cf9c33, v_07a341, v_122070, v_326be8, v_79c4f2, v_aa7413, v_39a996 } from 'rcmrninabrnb';
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
import { v_877de8, v_54d016, v_a7ab3c, v_44edcc } from '../services';
import { v_5e3aed } from '../services/giftishowBiz';
import type { v_214820 } from '../services/giftishowBiz';

const v_10664a = require('../../assets/xplay_symbol.png');
const v_33c40c = require('../../assets/xrun-round-logo.png');
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
        price: parseInt(v_dfe883.priceLabel?.replace(/,/g, '') || '0', 10),
        image: v_dfe883.image || v_273f15.image,
        isXrun: (v_dfe883 as any).isXrun || false,
    } : v_273f15;

    const v_b3ea98 = false;

    const v_5db874 = (v_dfe883 as any)?.shopTab === 'xplayShop';

    const [v_660822, v_06fdbc] = v_5ab095<string | null>(null);

    const [v_b7c830, v_179642] = v_5ab095<number | null>(null);
    const [v_837630, v_2f87ed] = v_5ab095(false);
    const [v_18a900, v_0409f2] = v_5ab095(false);
    const [v_809e5c, v_453192] = v_5ab095(false);

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
            const v_8f00b9 = await v_54d016(v_660822, undefined);
            if (v_8f00b9?.status === 'success' && v_8f00b9?.data?.realtimeBalance) {
                const v_c88e9b = parseFloat(v_8f00b9.data.realtimeBalance.balance);
                v_0ce8dd(Number.isFinite(v_c88e9b) ? v_c88e9b : 0);
            } else {
                v_0ce8dd(0);
            }
        } catch (v_9e86fd) {
            console.warn('[ShopProductDetail] XRUN 잔액 조회 실패:', v_9e86fd);
            v_0ce8dd(0);
        } finally {
            v_14129c(false);
        }
    }, [v_660822]);

    v_c4deb2(() => {
        if (!v_5db874 && v_660822) v_abb08d();
    }, [v_5db874, v_660822, v_abb08d]);

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

    const v_b000c1 = v_de06a3(async () => {
        if (!v_660822 || v_18a900) return;
        if (!v_7496db || !v_7496db.trim()) {
            v_889fad('알림', '수신자 휴대폰 번호가 등록되지 않았습니다. 마이페이지에서 휴대폰 번호를 등록해 주세요.', [{ text: '확인' }]);
            return;
        }
        const v_c25eec = (v_90e57e && (v_90e57e.realPrice ?? v_90e57e.salePrice) != null)
            ? (typeof (v_90e57e.realPrice ?? v_90e57e.salePrice) === 'number'
                ? (v_90e57e.realPrice ?? v_90e57e.salePrice) as number
                : parseInt(String(v_90e57e.realPrice ?? v_90e57e.salePrice).replace(/,/g, ''), 10) || v_01bee9.price)
            : v_01bee9.price;
        const v_c88e9b = v_b7c830 ?? 0;
        if (v_c88e9b < v_c25eec) {
            v_889fad('알림', 'Xplay 잔액이 부족합니다.', [{ text: '확인' }]);
            return;
        }
        v_889fad('구매', `${v_01bee9.title}을(를) Xplay 포인트로 구매하시겠습니까?`, [
            { text: '취소' },
            {
                text: '구매',
                onPress: async () => {
                    v_0409f2(true);
                    try {
                        const v_8f00b9 = await v_44edcc(
                            { member: v_660822, goods_code: v_01bee9.id, phone_no: v_7496db ?? undefined },
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

                            const v_f942f4 = v_c99bd2 === 402 || /잔액.*부족|insufficient/i.test(v_badeaf);

                            const v_ce37ad = v_c99bd2 === 404 || /Goods not found|price not configured|등록되지|가격이 설정/i.test(v_badeaf);
                            const v_a2d859 = /E0010|비즈머니.*부족/i.test(v_badeaf);
                            const v_43f890 = v_f942f4 || v_a2d859
                                ? '서비스 점검 중입니다. 잠시 후 다시 시도해 주세요.'
                                : v_ce37ad
                                    ? '해당 상품이 등록되지 않았거나 Xplay 가격이 설정되지 않았습니다. 관리자에게 문의해 주세요.'
                                    : v_badeaf;
                            console.warn('[Xplay 구매] 실패:', v_c99bd2, v_badeaf);
                            v_889fad('구매 실패', v_43f890, [{ text: '확인' }]);
                        }
                    } catch (v_9e86fd) {
                        const v_49263d = v_9e86fd as any;
                        const v_d308b5 = v_49263d?.response?.status;
                        const v_badeaf = v_49263d?.response?.data?.message ?? v_49263d?.message ?? '구매 처리 중 오류가 발생했습니다.';

                        const v_43f890 = v_d308b5 === 402
                            ? '서비스 점검 중입니다. 잠시 후 다시 시도해 주세요.'
                            : v_d308b5 === 404
                                ? '해당 상품이 등록되지 않았거나 Xplay 가격이 설정되지 않았습니다. 관리자에게 문의해 주세요.'
                                : v_badeaf;
                        console.error('[Xplay 구매] 오류:', v_d308b5, v_badeaf);
                        v_889fad('구매 실패', v_43f890, [{ text: '확인' }]);
                    } finally {
                        v_0409f2(false);
                    }
                },
            },
        ]);
    }, [v_660822, v_7496db, v_01bee9.id, v_01bee9.title, v_01bee9.price, v_90e57e, v_b7c830, v_18a900, v_889fad, v_c1e7a4]);

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
            v_889fad('알림', '입금주소를 입력해주세요.', [{ text: '확인' }]);
            return;
        }
        if (!v_a0d01e || v_c4aec5 < v_4e7e53) {
            v_889fad('알림', `최소 ${v_4e7e53.toLocaleString()} Xplay 이상 입력해주세요.`, [{ text: '확인' }]);
            return;
        }
        v_889fad('교환', 'Ethereum으로 교환하시겠습니까?', [
            { text: '취소' },
            { text: '교환', onPress: () => console.log('교환:', { depositAddress: v_b36076, xplayAmount: v_a0d01e }) },
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
                            <Text style={v_d81136.inputLabel}>입금주소</Text>
                            <View style={v_d81136.inputContainer}>
                                <TextInput
                                    style={v_d81136.input}
                                    placeholder="..."
                                    value={v_b36076}
                                    onChangeText={v_a2ae27}
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                />
                                <TouchableOpacity onPress={v_817006} style={v_d81136.qrButton}>
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
                                    <Text style={v_d81136.minAmountHint}>잔액 조회 중</Text>
                                </View>
                            ) : (
                                <Text style={v_d81136.minAmountHint}>보유: {v_87676e.toLocaleString()} Xplay</Text>
                            )}
                            <View style={v_d81136.inputContainer}>
                                <TextInput
                                    style={v_d81136.input}
                                    placeholder=""
                                    value={v_a0d01e}
                                    onChangeText={(v_9b6134) => {
                                        const v_37256a = v_9b6134.replace(/[^0-9]/g, '');
                                        v_80ea24(v_37256a ? parseInt(v_37256a).toLocaleString() : '');
                                    }}
                                    keyboardType="numeric"
                                />
                                <TouchableOpacity onPress={v_8b5670} style={v_d81136.maxButton}>
                                    <Text style={v_d81136.maxButtonText}>최대 금액</Text>
                                </TouchableOpacity>
                            </View>
                            <Text style={v_d81136.minAmountHint}>최소 {v_4e7e53.toLocaleString()} Xplay</Text>
                        </View>

                        {}
                        <View style={v_d81136.summarySection}>
                            <View style={v_d81136.summaryRow}>
                                <Text style={v_d81136.summaryLabel}>Ethereum 환율</Text>
                                <Text style={v_d81136.summaryValue}>{v_1d021e.toLocaleString()}</Text>
                            </View>
                            <View style={v_d81136.summaryRow}>
                                <Text style={v_d81136.summaryLabel}>암호화폐 수수료</Text>
                                <Text style={v_d81136.summaryValue}>{v_47de40.toLocaleString()}</Text>
                            </View>
                            <View style={v_d81136.summaryRow}>
                                <Text style={v_d81136.summaryLabel}>출금 수수료</Text>
                                <Text style={v_d81136.summaryValue}>{v_e9e2a3.toLocaleString()}</Text>
                            </View>
                            <View style={v_d81136.summaryRow}>
                                <Text style={v_d81136.summaryLabel}>사용할 Xplay</Text>
                                <Text style={v_d81136.summaryValue}>{v_c4aec5.toLocaleString()}</Text>
                            </View>
                            <View style={v_d81136.summaryRowLast}>
                                <Text style={v_d81136.summaryLabel}>받으실 금액(Ethereum)</Text>
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
                        <Text style={v_d81136.exchangeButtonText}>교환하기</Text>
                    </TouchableOpacity>
                </View>
            </SafeView>
        );
    }

    const v_1d54f1 = v_a1c497 ?? 0;
    const v_512b94 = v_1d54f1 - v_01bee9.price;
    const [v_80e2be, v_9375ae] = v_5ab095<boolean>(false);

    const v_dfaad1 = () => {
        v_889fad('구매', `${v_01bee9.title}을(를) 구매하시겠습니까?`, [
            { text: '취소' },
            {
                text: '구매',
                onPress: () => {
                    console.log('구매:', v_01bee9.id);
                    v_9375ae(true);
                }
            },
        ]);
    };

    const v_184ff4 = () => {
        v_9375ae(false);
    };

    const v_48c801 = () => {
        v_453192(false);
        v_b75b27(null);
        v_9b57fc(v_ce4741.shopMyItems);
    };

    const v_fa78fb = v_01bee9.isXrun || v_01bee9.brand === 'XRUN';
    const v_1efa5f = v_fa78fb ? v_33c40c : v_10664a;

    const v_fafc7f = (v_5db874 && v_90e57e?.goodsImgB) || (v_90e57e?.goodsImgS || v_90e57e?.mmsGoodsImg)
        ? { uri: (v_90e57e?.goodsImgB || v_90e57e?.goodsImgS || v_90e57e?.mmsGoodsImg) as string }
        : v_01bee9.image;
    const v_ba7f97 = (v_5db874 && v_90e57e?.goodsName) ? v_90e57e.goodsName : v_01bee9.title;
    const v_b034a8 = (v_5db874 && v_90e57e?.brandName) ? v_90e57e.brandName : v_01bee9.brand;
    const v_4a4ff4 = v_90e57e?.realPrice ?? v_90e57e?.salePrice;
    const v_e72b09 = (v_5db874 && v_4a4ff4 != null)
        ? (typeof v_4a4ff4 === 'number' ? v_4a4ff4 : parseInt(String(v_4a4ff4).replace(/,/g, ''), 10) || v_01bee9.price)
        : v_01bee9.price;
    const v_513fb9 = (v_b7c830 ?? 0) - v_e72b09;
    const v_d0206c = v_5db874 && v_90e57e && (v_90e57e.content || v_90e57e.contentAddDesc);

    return (
        <SafeView style={v_d81136.container} backgroundColor="#F8FAFC">
            <StatusBar style="dark" />
            <Header
                title="상품정보"
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
                            <View style={v_d81136.productImageWrapper}>
                                <Image
                                    source={v_fafc7f}
                                    style={v_d81136.productImage}
                                    resizeMode="contain"
                                />
                            </View>
                        </View>
                        <View style={v_d81136.productInfoContainer}>
                            <View style={v_d81136.brandContainer}>
                                <Text style={v_d81136.brand}>{v_b034a8}</Text>
                            </View>
                            <Text style={v_d81136.title}>{v_ba7f97}</Text>
                            {v_d0206c ? (
                                <Text style={v_d81136.productDescription}>
                                    {(v_90e57e?.content || v_90e57e?.contentAddDesc || '').trim()}
                                </Text>
                            ) : null}
                        </View>
                    </View>

                    {}
                    <View style={v_d81136.paymentCard}>
                        <View style={v_d81136.sectionHeader}>
                            <Feather name="credit-card" size={18} color="#1E3A5F" />
                            <Text style={v_d81136.sectionTitle}>결제 정보</Text>
                        </View>
                        <View style={v_d81136.divider} />
                        {v_5db874 ? (
                            <>
                                <View style={v_d81136.paymentRow}>
                                    <Text style={v_d81136.paymentLabel}>결제금액</Text>
                                    <View style={v_d81136.priceContainer}>
                                        <Image source={v_10664a} style={v_d81136.coinIcon} resizeMode="contain" />
                                        <Text style={v_d81136.paymentValue}>{v_e72b09.toLocaleString()} Xplay</Text>
                                    </View>
                                </View>
                                <View style={v_d81136.paymentRow}>
                                    <Text style={v_d81136.paymentLabel}>내 Xplay 잔액</Text>
                                    {v_837630 ? (
                                        <ActivityIndicator size="small" color="#1E3A5F" />
                                    ) : (
                                        <Text style={v_d81136.paymentBalance}>
                                            {(v_b7c830 ?? 0).toLocaleString()} Xplay
                                        </Text>
                                    )}
                                </View>
                                <View style={v_d81136.paymentRowLast}>
                                    <Text style={v_d81136.paymentLabel}>구매 후 잔여 Xplay</Text>
                                    <Text style={v_d81136.paymentRemaining}>{v_513fb9.toLocaleString()} Xplay</Text>
                                </View>
                            </>
                        ) : (
                            <>
                                <View style={v_d81136.paymentRow}>
                                    <Text style={v_d81136.paymentLabel}>결제금액</Text>
                                    <View style={v_d81136.priceContainer}>
                                        <Image source={v_1efa5f} style={v_d81136.coinIcon} resizeMode="contain" />
                                        <Text style={v_d81136.paymentValue}>{v_01bee9.price.toLocaleString()} XRUN</Text>
                                    </View>
                                </View>
                                <View style={v_d81136.paymentRow}>
                                    <Text style={v_d81136.paymentLabel}>내보유 XRUN</Text>
                                    {v_19340b ? (
                                        <ActivityIndicator size="small" color="#1E3A5F" />
                                    ) : (
                                        <Text style={v_d81136.paymentBalance}>{v_1d54f1.toLocaleString()} XRUN</Text>
                                    )}
                                </View>
                                <View style={v_d81136.paymentRowLast}>
                                    <Text style={v_d81136.paymentLabel}>구매 후 잔여 XRUN</Text>
                                    <Text style={v_d81136.paymentRemaining}>{v_512b94.toLocaleString()} XRUN</Text>
                                </View>
                            </>
                        )}
                    </View>

                    {}
                    <View style={v_d81136.guideCard}>
                        <View style={v_d81136.sectionHeader}>
                            <Feather name="info" size={18} color="#1E3A5F" />
                            <Text style={v_d81136.sectionTitle}>이용 안내</Text>
                        </View>
                        <View style={v_d81136.divider} />

                        <View style={v_d81136.guideItem}>
                            <View style={v_d81136.guideItemHeader}>
                                <View style={v_d81136.guideNumber}>
                                    <Text style={v_d81136.guideNumberText}>1</Text>
                                </View>
                                <Text style={v_d81136.guideSubtitle}>취소 및 환불 규정</Text>
                            </View>
                            <View style={v_d81136.guideTextContainer}>
                                <Text style={v_d81136.guideText}>• 본 상품은 구매 즉시 발송되는 디지털 쿠폰(모바일 쿠폰/바코드)입니다.</Text>
                                <Text style={v_d81136.guideText}>• 쿠폰번호(PIN) 발행 후 사용 여부 확인이 불가능하므로 단순 변심에 의한 취소 및 환불은 불가능합니다.</Text>
                                <Text style={v_d81136.guideText}>• 상품 품절 등 교환 불가 사유 발생 시에만 100% 환불 처리됩니다.</Text>
                            </View>
                        </View>

                        <View style={v_d81136.guideItem}>
                            <View style={v_d81136.guideItemHeader}>
                                <View style={v_d81136.guideNumber}>
                                    <Text style={v_d81136.guideNumberText}>2</Text>
                                </View>
                                <Text style={v_d81136.guideSubtitle}>이용 안내</Text>
                            </View>
                            <View style={v_d81136.guideTextContainer}>
                                <Text style={v_d81136.guideText}>• 전국 교환처(해당 브랜드 매장)에서 결제 시 모바일 쿠폰을 제시해 주세요.</Text>
                                <Text style={v_d81136.guideText}>• 매장 재고에 따라 상품이 제공되지 않을 수 있으며, 이 경우 동일 가격 이상의 다른 상품으로 교환 가능합니다(차액 지불).</Text>
                            </View>
                        </View>
                    </View>
                </View>
            </SafeScrollView>

            {}
            <View style={[v_d81136.buttonContainer, { paddingBottom: v_365f44 + 20 }]}>
                {v_5db874 ? (
                    <TouchableOpacity
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
                            ) : (
                                <Feather name="shopping-cart" size={18} color="#FFFFFF" style={v_d81136.purchaseIcon} />
                            )}
                            <Text style={v_d81136.purchaseButtonText}>
                                {v_18a900 ? '처리 중...' : 'Xplay 포인트로 구매'}
                            </Text>
                        </LinearGradient>
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity
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
                            <Feather name="shopping-cart" size={18} color="#FFFFFF" style={v_d81136.purchaseIcon} />
                            <Text style={v_d81136.purchaseButtonText}>구매하기</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                )}
            </View>

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
                        <Text style={v_d81136.paymentSuccessMessage}>결제가 완료되었습니다</Text>
                        <TouchableOpacity style={v_d81136.paymentSuccessButton} onPress={v_184ff4} activeOpacity={0.8}>
                            <Text style={v_d81136.paymentSuccessButtonText}>확인</Text>
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
                            <Image source={v_10664a} style={v_d81136.modalLogo} resizeMode="contain" />
                        </View>
                        <Text style={v_d81136.paymentSuccessMessage}>
                            {v_a71862?.coupon_img_url ? '쿠폰이 발급되었습니다!' : 'Xplay 포인트 결제가 완료되었습니다'}
                        </Text>
                        {v_a71862?.coupon_img_url ? (
                            <ScrollView style={v_d81136.couponBarcodeScroll} showsVerticalScrollIndicator={false}>
                                <Image
                                    source={{ uri: v_a71862.coupon_img_url }}
                                    style={v_d81136.couponBarcodeImage}
                                    resizeMode="contain"
                                />
                                {v_a71862.pin_no ? (
                                    <Text style={v_d81136.couponPinNo}>핀번호: {v_a71862.pin_no}</Text>
                                ) : null}
                                {v_a71862.limit_date ? (
                                    <Text style={v_d81136.couponLimitDate}>유효기간: ~ {v_a71862.limit_date}까지</Text>
                                ) : null}
                            </ScrollView>
                        ) : null}
                        <TouchableOpacity style={v_d81136.paymentSuccessButton} onPress={v_48c801} activeOpacity={0.8}>
                            <Text style={v_d81136.paymentSuccessButtonText}>내 기프티콘 보기</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
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
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#ffffff',
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
    productDescription: {
        marginTop: 12,
        fontSize: 14,
        fontFamily: 'Roboto-Regular',
        color: '#6B7280',
        lineHeight: 20,
        textAlign: 'center',
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
