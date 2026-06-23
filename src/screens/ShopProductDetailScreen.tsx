import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Image, ImageSourcePropType, ScrollView, Platform, TextInput, Modal, ActivityIndicator, KeyboardAvoidingView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeView, SafeScrollView } from '../components';
import { StatusBar } from 'expo-status-bar';
import { useTranslation } from 'react-i18next';
import { Header } from '../components';
import { useAppNavigation, ROUTES } from '../navigation';
import { useAppContext } from '../context';
import { useAlertDialog } from '../context/AlertDialogContext';
import { COLORS, COMMON_STYLES, FONTS, SIZES } from '../constants';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAndroidNavigationBarHeight } from 'react-native-navigation-bar-height';
import { Feather, Ionicons } from '@expo/vector-icons';
import { getAyetPointsBalance, getUserBalance, getMyPageUserInfo, purchaseGiftWithXplayPoints, fetchWalletData, purchaseXrunItem, purchaseXrunItemPrepare, purchaseXrunItemRecord, purchaseGiftPrepare, purchaseGiftRecord, purchaseIakWithXrun, purchaseIakPrepare, purchaseIakRecord } from '../services';
import { getProductDetail } from '../services/giftishowBiz';
import type { GiftishowProductDetailItem } from '../services/giftishowBiz';
import { WalletKeyPinPromptModal } from '../components';
import { sendOnchainLocal, isLocalSendEnabledForUser } from '../services/walletSendLocal';
import { findEntriesForUser, type WalletKey } from '../services/walletKeyStore';

const xplaySymbol = require('../../assets/xplay_symbol.png');
const xrunRoundLogo = require('../../assets/xrun-round-logo.png');
const xrunHorizontalLogo = require('../../assets/xrun-horizontal-logo.png');
const ethereumThumb = require('../../assets/images/ethereum_thumb.png');

const EXCHANGE_MIN_XPLAY = 30000;
const EXCHANGE_ETH_RATE = 3070000;
const EXCHANGE_CRYPTO_FEE = 2000;

interface ProductDetailData {
    id: string;
    brand: string;
    title: string;
    description?: string;
    price: number;
    image: ImageSourcePropType;
    isXrun?: boolean;
    isIak?: boolean;  
    iakCategory?: string | null;  
}

type IakInputKind = 'phone' | 'game_id' | 'meter' | 'generic';
function getIakInputKind(category?: string | null): IakInputKind {
    if (!category) return 'phone';
    const c = String(category).toLowerCase();
    if (c === 'game') return 'game_id';
    if (c === 'pln') return 'meter';

    return 'phone';
}

const defaultProductFallback: ProductDetailData = {
    id: '',
    brand: '',
    title: '',
    price: 0,
    image: require('../../assets/sample_cu.png'), 
    isXrun: false,
};

export const ShopProductDetailScreen = () => {
    const { goBack, navigate } = useAppNavigation();
    const { t } = useTranslation();
    const { showAlert } = useAlertDialog();
    const { selectedShopItem } = useAppContext();
    const insets = useSafeAreaInsets();
    const navBarHeight = useAndroidNavigationBarHeight(0);

    const bottomSafeArea = Platform.OS === 'ios'
        ? insets.bottom
        : Math.max(navBarHeight, insets.bottom);

    const product: ProductDetailData = selectedShopItem ? {
        id: selectedShopItem.id || '',
        brand: (selectedShopItem as any).brand ?? '',
        title: selectedShopItem.title || '',
        description: (selectedShopItem as any).description,
        price: parseFloat(selectedShopItem.priceLabel?.replace(/,/g, '') || '0'),
        image: selectedShopItem.image || defaultProductFallback.image,
        isXrun: (selectedShopItem as any).isXrun || false,
        isIak: (selectedShopItem as any).isIak || false,
        iakCategory: (selectedShopItem as any).iakCategory ?? null,
    } : defaultProductFallback;
    const iakInputKind: IakInputKind = product.isIak ? getIakInputKind(product.iakCategory) : 'phone';

    const isExchangeProduct = false;

    const isXplayShop = (selectedShopItem as any)?.shopTab === 'xplayShop';

    const isPurchasedView = !!(selectedShopItem as any)?.isPurchased;
    const purchasedPaidXrun = Number((selectedShopItem as any)?.paidXrun ?? 0);
    const purchasedDate = String((selectedShopItem as any)?.purchaseDate ?? '');
    useEffect(() => {
        if (isPurchasedView) {
            console.log('[상품 상세-구매완료] selectedShopItem:', JSON.stringify(selectedShopItem));
        }
    }, [isPurchasedView, selectedShopItem]);

    const [member, setMember] = useState<string | null>(null);

    const [purchasePinVisible, setPurchasePinVisible] = useState(false);
    const [purchaseCtx, setPurchaseCtx] = useState<{ memberId: number; email: string; kind: 'item' | 'gift' | 'iak'; iakCustomerId?: string } | null>(null);
    const [purchaseLocalLoading, setPurchaseLocalLoading] = useState(false);

    const [xplayBalanceState, setXplayBalanceState] = useState<number | null>(null);
    const [xplayBalanceLoading, setXplayBalanceLoading] = useState(false);
    const [xplayPurchaseLoading, setXplayPurchaseLoading] = useState(false);
    const [xplayPaymentSuccessVisible, setXplayPaymentSuccessVisible] = useState(false);

    const [iakPhone, setIakPhone] = useState<string>('');
    const [iakPurchaseLoading, setIakPurchaseLoading] = useState(false);
    const [iakPurchaseResult, setIakPurchaseResult] = useState<any>(null);
    const [iakSuccessVisible, setIakSuccessVisible] = useState(false);

    const [iakPhoneModalVisible, setIakPhoneModalVisible] = useState(false);

    const [xplayPurchaseResult, setXplayPurchaseResult] = useState<{
        tr_id?: string;
        coupon_img_url?: string;
        pin_no?: string;
        limit_date?: string;
    } | null>(null);

    const [xrunBalanceState, setXrunBalanceState] = useState<number | null>(null);
    const [xrunBalanceLoading, setXrunBalanceLoading] = useState(false);

    const [productDetail, setProductDetail] = useState<GiftishowProductDetailItem | null>(null);
    const [productDetailLoading, setProductDetailLoading] = useState(false);
    const [imageLoadFailed, setImageLoadFailed] = useState<boolean>(false);

    const [userPhone, setUserPhone] = useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;
        (async () => {
            try {
                const userDataStr = await AsyncStorage.getItem('userData');
                if (cancelled || !userDataStr) return;
                const userData = JSON.parse(userDataStr);
                const m = userData?.member;
                if (m != null && !cancelled) setMember(String(m));
                const phone = userData?.mobile ? String(userData.mobile).replace(/\s/g, '') : '';
                if (!cancelled) setUserPhone(phone || null);
            } catch {
                if (!cancelled) setMember(null);
                if (!cancelled) setUserPhone(null);
            }
        })();
        return () => { cancelled = true; };
    }, []);

    useEffect(() => {
        if (!member || userPhone !== null) return;
        let cancelled = false;
        (async () => {
            try {
                const res = await getMyPageUserInfo(Number(member), undefined);
                const user = res?.data?.[0];
                const phone = user?.mobile ? String(user.mobile).replace(/\s/g, '') : '';
                if (!cancelled && phone) setUserPhone(phone);
            } catch {
                if (!cancelled) setUserPhone(null);
            }
        })();
        return () => { cancelled = true; };
    }, [member, userPhone]);

    const loadXplayBalance = useCallback(async () => {
        if (!member) return;
        setXplayBalanceLoading(true);
        try {
            const res = await getAyetPointsBalance(member, undefined);
            const balance = res?.total_ayet_points ?? null;
            setXplayBalanceState(balance != null ? Number(balance) : null);
        } catch (e) {
            console.warn('[ShopProductDetail] Xplay 잔액 조회 실패:', e);
            setXplayBalanceState(null);
        } finally {
            setXplayBalanceLoading(false);
        }
    }, [member]);

    useEffect(() => {
        if ((isXplayShop || isExchangeProduct) && member) loadXplayBalance();
    }, [isXplayShop, isExchangeProduct, member, loadXplayBalance]);

    const loadXrunBalance = useCallback(async () => {
        if (!member) return;
        setXrunBalanceLoading(true);
        try {

            const res: any = await fetchWalletData(Number(member), 7, undefined);
            const list: any[] = Array.isArray(res?.data) ? res.data : [];
            const xrunPolygon = list.find((w) => Number(w?.currency) === 18);
            const balance = parseFloat(xrunPolygon?.Wamount || xrunPolygon?.amount || '0');
            console.log('[ShopProductDetail] XRUN 잔액 로드 완료', {
                member,
                walletList: list.map((w) => ({
                    currency: w?.currency,
                    Wamount: w?.Wamount,
                    amount: w?.amount,
                })),
                xrunPolygon,
                balance,
                productId: product?.id,
                productPrice: product?.price,
                productPriceType: typeof product?.price,
                comparison: `${balance} < ${product?.price} = ${balance < (product?.price ?? 0)}`,
            });
            setXrunBalanceState(Number.isFinite(balance) ? balance : 0);
        } catch (e) {
            console.warn('[ShopProductDetail] XRUN 잔액 조회 실패:', e);
            setXrunBalanceState(0);
        } finally {
            setXrunBalanceLoading(false);
        }
    }, [member, product?.id, product?.price]);

    useEffect(() => {
        if (member) loadXrunBalance();
    }, [member, loadXrunBalance]);

    useEffect(() => {
        if (!isXplayShop || !product.id) return;
        let cancelled = false;
        setProductDetailLoading(true);
        setProductDetail(null);
        getProductDetail(product.id)
            .then((res) => {
                if (!cancelled && res.detail) setProductDetail(res.detail);
            })
            .catch(() => {
                if (!cancelled) setProductDetail(null);
            })
            .finally(() => {
                if (!cancelled) setProductDetailLoading(false);
            });
        return () => { cancelled = true; };
    }, [isXplayShop, product.id]);

    useEffect(() => { setImageLoadFailed(false); }, [product.id]);

    const handleXplayPurchase = useCallback(async () => {
        console.log('[Xplay 구매] handleXplayPurchase 진입', {
            member, xplayPurchaseLoading, userPhone,
            productId: product?.id, productPrice: product?.price,
            xrunBalanceState, xrunBalanceLoading,
        });
        if (!member || xplayPurchaseLoading) {
            console.log('[Xplay 구매] 조기 종료', { member, xplayPurchaseLoading });
            return;
        }
        if (!userPhone || !userPhone.trim()) {
            showAlert(t('screens.shopProductDetail.alerts.notification'), t('screens.shopProductDetail.alerts.phoneNotRegistered'), [{ text: t('screens.shopProductDetail.confirm') }]);
            return;
        }

        const needPrice = product.price;
        if (xrunBalanceState === null || xrunBalanceLoading) {
            console.log('[Xplay 구매] 잔액 로딩 중 — 대기');
            showAlert(t('screens.shopProductDetail.alerts.notification'), 'XRUN 잔액을 불러오는 중입니다. 잠시 후 다시 시도해 주세요.', [{ text: t('screens.shopProductDetail.confirm') }]);
            return;
        }
        const balance = xrunBalanceState;
        console.log('[Xplay 구매] 잔액 비교', { balance, needPrice, ok: balance >= needPrice });
        if (balance < needPrice) {
            showAlert(t('screens.shopProductDetail.alerts.notification'), t('screens.shopProductDetail.alerts.insufficientXplay'), [{ text: t('screens.shopProductDetail.confirm') }]);
            return;
        }
        showAlert(t('screens.shopProductDetail.alerts.purchaseConfirmTitle'), t('screens.shopProductDetail.alerts.purchaseConfirmMessageXplay', { title: product.title }), [
            { text: t('screens.shopProductDetail.alerts.cancel') },
            {
                text: t('screens.shopProductDetail.alerts.purchase'),
                onPress: async () => {
                    setXplayPurchaseLoading(true);
                    try {
                        const res = await purchaseGiftWithXplayPoints(
                            {
                                member,
                                goods_code: product.id,
                                phone_no: userPhone ?? undefined,
                                price: product.price,
                                goods_name: product.title,
                                brand_name: (product as any).brand,
                                image_url: (product as any).image,
                            },
                            undefined,
                        );
                        if (res?.status === 'success') {
                            console.log('[Xplay 구매] 성공 — 상품:', product.id, product.title, res?.data);
                            setXplayPurchaseResult(res?.data ?? null);
                            setXplayPaymentSuccessVisible(true);
                            loadXplayBalance(); 
                        } else {
                            const msg = res?.message ?? '구매에 실패했습니다.';
                            const code = res?.code;

                            if (code === 410) {
                                try {
                                    const userDataStr = await AsyncStorage.getItem('userData');
                                    const ud = userDataStr ? JSON.parse(userDataStr) : null;
                                    const memberId = ud?.member != null ? Number(ud.member) : null;
                                    const email = (ud?.email ?? '').toLowerCase().trim();
                                    if (memberId && email && isLocalSendEnabledForUser(email)) {
                                        const entries = await findEntriesForUser(email, memberId);
                                        const hasKey = (entries.eth?.s === 's1') || (entries.pol?.s === 's1');
                                        if (hasKey) {
                                            setPurchaseCtx({ memberId, email, kind: 'gift' });
                                            setPurchasePinVisible(true);
                                            setXplayPurchaseLoading(false);
                                            return;
                                        }
                                    }
                                } catch {  }
                                showAlert(
                                    t('screens.shopProductDetail.alerts.purchaseFailed'),
                                    t('screens.walletRestore.restoreNeededShort'),
                                    [
                                        { text: t('screens.shopProductDetail.confirm') },
                                        { text: t('screens.walletRestore.restoreNow'), onPress: () => navigate(ROUTES.walletRestore) },
                                    ],
                                );
                                return;
                            }

                            const is402 = code === 402 || /잔액.*부족|insufficient/i.test(msg);

                            const is404 = code === 404 || /Goods not found|price not configured|등록되지|가격이 설정/i.test(msg);
                            const isE0010 = /E0010|비즈머니.*부족/i.test(msg);
                            const isEnglish = /^[\x00-\x7F\s]+$/.test(msg);
                            const userMsg = is402 || isE0010
                                ? '서비스 점검 중입니다. 잠시 후 다시 시도해 주세요.'
                                : is404
                                    ? '해당 상품이 등록되지 않았거나 XRUN 금액이 설정되지 않았습니다. 관리자에게 문의해 주세요.'
                                    : isEnglish
                                        ? '구매에 실패했습니다. 잠시 후 다시 시도해 주세요.'
                                        : msg;
                            console.warn('[Xplay 구매] 실패:', code, msg);
                            showAlert(t('screens.shopProductDetail.alerts.purchaseFailed'), userMsg, [{ text: t('screens.shopProductDetail.confirm') }]);
                        }
                    } catch (e) {
                        const err = e as any;
                        const status = err?.response?.status;
                        const msg = err?.response?.data?.message ?? err?.message ?? '구매 처리 중 오류가 발생했습니다.';

                        const isEnglish = typeof msg === 'string' && /^[\x00-\x7F\s]+$/.test(msg);
                        const userMsg = status === 402
                            ? '서비스 점검 중입니다. 잠시 후 다시 시도해 주세요.'
                            : status === 404
                                ? '해당 상품이 등록되지 않았거나 XRUN 금액이 설정되지 않았습니다. 관리자에게 문의해 주세요.'
                                : isEnglish
                                    ? '구매 처리 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.'
                                    : msg;
                        console.error('[Xplay 구매] 오류:', status, msg);
                        showAlert(t('screens.shopProductDetail.alerts.purchaseFailed'), userMsg, [{ text: t('screens.shopProductDetail.confirm') }]);
                    } finally {
                        setXplayPurchaseLoading(false);
                    }
                },
            },
        ]);
    }, [member, userPhone, product.id, product.title, product.price, xrunBalanceState, xrunBalanceLoading, xplayPurchaseLoading, showAlert, loadXplayBalance]);

    const [depositAddress, setDepositAddress] = useState<string>('');
    const [xplayAmount, setXplayAmount] = useState<string>('');
    const exchangeXplayBalance = xplayBalanceState ?? 0;
    const withdrawalFee = 0;

    const xplayToUse = xplayAmount ? parseInt(xplayAmount.replace(/,/g, ''), 10) : 0;
    const totalXplay = xplayToUse + EXCHANGE_CRYPTO_FEE + withdrawalFee;
    const ethereumAmount = xplayToUse > 0 ? (xplayToUse / EXCHANGE_ETH_RATE).toFixed(6) : '0';

    const handleMaxAmount = () => {
        setXplayAmount(exchangeXplayBalance.toLocaleString());
    };

    const handleQrScan = () => {

        navigate(ROUTES.walletQrScan);

    };

    const handleExchange = () => {
        if (!depositAddress.trim()) {
            showAlert(t('screens.shopProductDetail.alerts.notification'), t('screens.shopProductDetail.alerts.enterDepositAddress'), [{ text: t('screens.shopProductDetail.confirm') }]);
            return;
        }
        if (!xplayAmount || xplayToUse < EXCHANGE_MIN_XPLAY) {
            showAlert(t('screens.shopProductDetail.alerts.notification'), t('screens.shopProductDetail.alerts.minXplayRequired', { min: EXCHANGE_MIN_XPLAY.toLocaleString() }), [{ text: t('screens.shopProductDetail.confirm') }]);
            return;
        }
        showAlert(t('screens.shopProductDetail.alerts.exchangeTitle'), t('screens.shopProductDetail.alerts.exchangeConfirm'), [
            { text: t('screens.shopProductDetail.alerts.cancel') },
            { text: t('screens.shopProductDetail.alerts.exchange'), onPress: () => console.log('교환:', { depositAddress, xplayAmount }) },
        ]);
    };

    if (isExchangeProduct) {
        return (
            <SafeView style={styles.container} backgroundColor="#FFFFFF">
                <StatusBar style="dark" />
                <Header
                    title="Ethereum 교환"
                    onBackPress={goBack}
                    showBackButton
                />

                <SafeScrollView showsVerticalScrollIndicator={false} showBottomBackground={false} backgroundColor="transparent" disableBottomPadding={true}>
                    <View style={styles.exchangeContent}>
                        {}
                        <View style={styles.infoBanner}>
                            <Text style={styles.infoBannerText}>
                                암호화폐 출금은 전송되는 데 몇 분 정도 소요됩니다. 출금의 최소 금액은 {EXCHANGE_MIN_XPLAY.toLocaleString()} Xplay 입니다.
                            </Text>
                        </View>

                        {}
                        <View style={styles.inputSection}>
                            <Text style={styles.inputLabel}>{t('screens.shopProductDetail.depositAddress')}</Text>
                            <View style={styles.inputContainer}>
                                <TextInput
                                    style={styles.input}
                                    placeholder="..."
                                    value={depositAddress}
                                    onChangeText={setDepositAddress}
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                />
                                <TouchableOpacity onPress={handleQrScan} style={styles.qrButton}>
                                    <Ionicons name="qr-code-outline" size={22} color="#111827" />
                                </TouchableOpacity>
                            </View>
                        </View>

                        {}
                        <View style={styles.inputSection}>
                            <Text style={styles.inputLabel}>Xplay</Text>
                            {xplayBalanceLoading ? (
                                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                                    <ActivityIndicator size="small" color="#1E3A5F" />
                                    <Text style={styles.minAmountHint}>{t('screens.shopProductDetail.checkingBalance')}</Text>
                                </View>
                            ) : (
                                <Text style={styles.minAmountHint}>{t('screens.shopProductDetail.balanceHold', { amount: exchangeXplayBalance.toLocaleString() })}</Text>
                            )}
                            <View style={styles.inputContainer}>
                                <TextInput
                                    style={styles.input}
                                    placeholder=""
                                    value={xplayAmount}
                                    onChangeText={(text) => {
                                        const numbers = text.replace(/[^0-9]/g, '');
                                        setXplayAmount(numbers ? parseInt(numbers).toLocaleString() : '');
                                    }}
                                    keyboardType="numeric"
                                />
                                <TouchableOpacity onPress={handleMaxAmount} style={styles.maxButton}>
                                    <Text style={styles.maxButtonText}>{t('screens.shopProductDetail.maxAmount')}</Text>
                                </TouchableOpacity>
                            </View>
                            <Text style={styles.minAmountHint}>{t('screens.shopProductDetail.minXplay', { min: EXCHANGE_MIN_XPLAY.toLocaleString() })}</Text>
                        </View>

                        {}
                        <View style={styles.summarySection}>
                            <View style={styles.summaryRow}>
                                <Text style={styles.summaryLabel}>{t('screens.shopProductDetail.ethRate')}</Text>
                                <Text style={styles.summaryValue}>{EXCHANGE_ETH_RATE.toLocaleString()}</Text>
                            </View>
                            <View style={styles.summaryRow}>
                                <Text style={styles.summaryLabel}>{t('screens.shopProductDetail.cryptoFee')}</Text>
                                <Text style={styles.summaryValue}>{EXCHANGE_CRYPTO_FEE.toLocaleString()}</Text>
                            </View>
                            <View style={styles.summaryRow}>
                                <Text style={styles.summaryLabel}>{t('screens.shopProductDetail.withdrawalFee')}</Text>
                                <Text style={styles.summaryValue}>{withdrawalFee.toLocaleString()}</Text>
                            </View>
                            <View style={styles.summaryRow}>
                                <Text style={styles.summaryLabel}>{t('screens.shopProductDetail.xplayToUse')}</Text>
                                <Text style={styles.summaryValue}>{xplayToUse.toLocaleString()}</Text>
                            </View>
                            <View style={styles.summaryRowLast}>
                                <Text style={styles.summaryLabel}>{t('screens.shopProductDetail.receiveAmountEth')}</Text>
                                <Text style={styles.summaryValueBold}>{ethereumAmount}</Text>
                            </View>
                        </View>
                    </View>
                </SafeScrollView>

                {}
                <View style={[styles.exchangeButtonContainer, { paddingBottom: bottomSafeArea + 20 }]}>
                    <TouchableOpacity
                        style={styles.exchangeButton}
                        onPress={handleExchange}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.exchangeButtonText}>{t('screens.shopProductDetail.exchange')}</Text>
                    </TouchableOpacity>
                </View>
            </SafeView>
        );
    }

    const xrunBalance = xrunBalanceState ?? 0;
    const remainingBalance = xrunBalance - product.price;
    const [paymentSuccessVisible, setPaymentSuccessVisible] = useState<boolean>(false);
    const [xrunPurchaseLoading, setXrunPurchaseLoading] = useState<boolean>(false);

    const handlePurchase = () => {
        console.log('[XRUN 구매] handlePurchase 진입', {
            xrunPurchaseLoading,
            member,
            xrunBalance,
            productPrice: product?.price,
            productId: product?.id,
        });
        if (xrunPurchaseLoading) {
            console.log('[XRUN 구매] xrunPurchaseLoading=true 라 종료');
            return;
        }
        if (!member) {
            console.log('[XRUN 구매] member 없어서 종료');
            showAlert(t('screens.shopProductDetail.alerts.notification'), '로그인이 필요합니다.', [{ text: t('screens.shopProductDetail.confirm') }]);
            return;
        }
        if (xrunBalance < product.price) {
            console.error('[XRUN 구매] 잔액 부족 — 비교 상세', {
                member,
                productId: product.id,
                productTitle: product.title,
                productPrice: product.price,
                productPriceType: typeof product.price,
                productPriceKRW: (product as any).priceKRW,
                productPriceXrun: (product as any).priceXrun,
                xrunBalance,
                xrunBalanceType: typeof xrunBalance,
                xrunBalanceState,
                shortfall: product.price - xrunBalance,
                note: 'xrunBalance(XRUN 단위) 와 productPrice 가 같은 단위인지 확인 필요. productPriceKRW 가 KRW 라면 단위 불일치 가능성.',
            });
            showAlert(t('screens.shopProductDetail.alerts.notification'), t('screens.shopProductDetail.alerts.insufficientXRUN'), [{ text: t('screens.shopProductDetail.confirm') }]);
            return;
        }
        showAlert(t('screens.shop.purchaseConfirmTitle'), t('screens.shop.purchaseConfirmMessage', { title: product.title }), [
            { text: t('screens.shop.cancel') },
            {
                text: t('screens.shop.purchase'),
                onPress: async () => {
                    setXrunPurchaseLoading(true);
                    try {
                        const itemId = parseInt(String(product.id), 10);
                        const res = await purchaseXrunItem(member, itemId, String(product.price), navigate);
                        if (res?.status === 'success' && Number(res.code) === 200) {
                            console.log('[XRUN 구매] 성공:', product.id);
                            loadXrunBalance();
                            setPaymentSuccessVisible(true);
                        } else {
                            const code = Number(res?.code);
                            const rawMsg = res?.message || '';
                            console.warn('[XRUN 구매] 실패:', code, rawMsg, 'fullRes:', JSON.stringify(res));
                            let userMsg: string;
                            let showRestoreButton = false;
                            if (code === 409 || /max purchase|limit reached/i.test(rawMsg)) {
                                userMsg = '최대 구매 가능 개수를 초과했습니다.';
                            } else if (code === 410) {

                                try {
                                    const userDataStr = await AsyncStorage.getItem('userData');
                                    const ud = userDataStr ? JSON.parse(userDataStr) : null;
                                    const memberId = ud?.member != null ? Number(ud.member) : null;
                                    const email = (ud?.email ?? '').toLowerCase().trim();
                                    if (memberId && email && isLocalSendEnabledForUser(email)) {
                                        const entries = await findEntriesForUser(email, memberId);
                                        const hasKey = (entries.eth?.s === 's1') || (entries.pol?.s === 's1');
                                        if (hasKey) {
                                            setPurchaseCtx({ memberId, email, kind: 'item' });
                                            setPurchasePinVisible(true);
                                            setXrunPurchaseLoading(false);
                                            return;
                                        }
                                    }
                                } catch {  }
                                userMsg = t('screens.walletRestore.restoreNeededShort');
                                showRestoreButton = true;
                            } else if (code === 404 || /not found/i.test(rawMsg)) {
                                userMsg = '상품을 찾을 수 없습니다.';
                            } else if (code === 400) {
                                userMsg = '요청 정보가 올바르지 않습니다.';
                            } else {
                                const isEnglish = /^[\x00-\x7F\s]+$/.test(rawMsg);
                                userMsg = isEnglish || !rawMsg ? '구매에 실패했습니다. 잠시 후 다시 시도해 주세요.' : rawMsg;
                            }

                            const buttons = showRestoreButton
                                ? [
                                    { text: t('screens.shopProductDetail.confirm') },
                                    { text: '복원하기', onPress: () => navigate(ROUTES.walletRestore) },
                                ]
                                : [{ text: t('screens.shopProductDetail.confirm') }];
                            showAlert(t('screens.shopProductDetail.alerts.purchaseFailed'), userMsg, buttons);
                        }
                    } catch (e: any) {
                        const status = e?.response?.status;
                        const respData = e?.response?.data;
                        console.error('[XRUN 구매] 오류:', { status, respData, errMsg: e?.message, stack: e?.stack });
                        const msg = e?.response?.data?.message ?? e?.message ?? '구매 처리 중 오류가 발생했습니다.';
                        const isEnglish = typeof msg === 'string' && /^[\x00-\x7F\s]+$/.test(msg);
                        showAlert(
                            t('screens.shopProductDetail.alerts.purchaseFailed'),
                            isEnglish ? '구매 처리 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.' : msg,
                            [{ text: t('screens.shopProductDetail.confirm') }],
                        );
                    } finally {
                        setXrunPurchaseLoading(false);
                    }
                }
            },
        ]);
    };

    const handlePaymentSuccessClose = () => {
        setPaymentSuccessVisible(false);
        navigate(ROUTES.shopMyItems);
    };

    const inputPrefix = iakInputKind === 'game_id' ? 'gameId' : iakInputKind === 'meter' ? 'meter' : 'phone';
    const tkInput = useCallback((suffix: string) => `screens.shop.iak.${inputPrefix}${suffix}`, [inputPrefix]);
    const customerLabel = t(tkInput('Label'));
    const handleIakPurchase = useCallback(async () => {
        if (!member || iakPurchaseLoading) return;
        const phone = iakPhone.trim();
        if (!phone) {
            showAlert(t('screens.shop.iak.notice'), t(tkInput('Required')), [{ text: t('screens.shop.iak.ok') }]);
            return;
        }
        if (xrunBalanceState === null || xrunBalanceLoading) {
            showAlert(t('screens.shop.iak.notice'), t('screens.shop.iak.balanceLoading'), [{ text: t('screens.shop.iak.ok') }]);
            return;
        }
        if (xrunBalanceState < product.price) {
            showAlert(t('screens.shop.iak.notice'), t('screens.shop.iak.insufficientBalance'), [{ text: t('screens.shop.iak.ok') }]);
            return;
        }
        showAlert(
            t('screens.shop.iak.purchaseConfirmTitle'),
            t('screens.shop.iak.purchaseConfirmMessage', { title: product.title, price: product.price, label: customerLabel, customer: phone, phone }),
            [
                { text: t('screens.shop.iak.cancel') },
                {
                    text: t('screens.shop.iak.buyConfirm'),
                    onPress: async () => {
                        setIakPurchaseLoading(true);
                        try {
                            const res = await purchaseIakWithXrun({
                                member: Number(member),
                                product_code: String(product.id),
                                customer_id: phone,
                                env: 'prod',
                            }, navigate);

                            const innerData: any = res?.data ?? null;
                            const innerStatus = innerData?.txn_status;
                            const userMessage = innerData?.user_message ?? null;
                            const wasRefunded = !!innerData?.refunded || innerStatus === 'refunded';
                            if (res?.status === 'success' && innerStatus === 'success') {
                                setIakPurchaseResult(innerData);
                                setIakSuccessVisible(true);
                                loadXrunBalance();
                            } else if (res?.status === 'success' && (innerStatus === 'failed' || innerStatus === 'refunded')) {
                                const failTitle = t('screens.shop.iak.purchaseFailed');
                                const reason = userMessage || res?.message || t('screens.shop.iak.unknownError');
                                const refundLine = wasRefunded ? `\n\n${t('screens.shop.iak.autoRefunded')}` : '';
                                showAlert(failTitle, `${reason}${refundLine}`, [{ text: t('screens.shop.iak.ok') }]);
                                loadXrunBalance();
                            } else if (res?.code === 410) {

                                try {
                                    const userDataStr = await AsyncStorage.getItem('userData');
                                    const ud = userDataStr ? JSON.parse(userDataStr) : null;
                                    const memberId = ud?.member != null ? Number(ud.member) : null;
                                    const email = (ud?.email ?? '').toLowerCase().trim();
                                    if (memberId && email && isLocalSendEnabledForUser(email)) {
                                        const entries = await findEntriesForUser(email, memberId);
                                        const hasKey = (entries.pol?.s === 's1');
                                        if (hasKey) {
                                            setPurchaseCtx({ memberId, email, kind: 'iak', iakCustomerId: phone });
                                            setPurchasePinVisible(true);
                                            setIakPurchaseLoading(false);
                                            return;
                                        }
                                    }
                                } catch {  }
                                showAlert(t('screens.shop.iak.purchaseFailed'), t('screens.walletRestore.restoreNeededShort'), [
                                    { text: t('screens.shop.iak.ok') },
                                    { text: t('screens.walletRestore.restoreNow'), onPress: () => navigate(ROUTES.walletRestore) },
                                ]);
                            } else {

                                const innerData2: any = (res as any)?.data ?? null;
                                const userMsg2 = innerData2?.user_message ?? null;
                                const wasRefunded2 = !!innerData2?.refunded || innerData2?.txn_status === 'refunded';
                                const reason2 = userMsg2 || res?.message || t('screens.shop.iak.unknownError');
                                const refundLine2 = wasRefunded2 ? `\n\n${t('screens.shop.iak.autoRefunded')}` : '';
                                showAlert(t('screens.shop.iak.purchaseFailed'), `${reason2}${refundLine2}`, [{ text: t('screens.shop.iak.ok') }]);
                                loadXrunBalance();
                            }
                        } finally {
                            setIakPurchaseLoading(false);
                        }
                    },
                },
            ]);
    }, [t, member, iakPhone, iakPurchaseLoading, product.id, product.title, product.price, xrunBalanceState, xrunBalanceLoading, showAlert, navigate, loadXrunBalance, tkInput, customerLabel]);

    const handleIakSuccessClose = () => {
        setIakSuccessVisible(false);
        setIakPhone('');
        setIakPurchaseResult(null);
        navigate(ROUTES.shopMyItems);
    };

    const handleXplayPaymentSuccessClose = () => {
        setXplayPaymentSuccessVisible(false);
        setXplayPurchaseResult(null);
        navigate(ROUTES.shopMyItems);
    };

    const isXrun = product.isXrun || product.brand === 'XRUN';
    const coinIcon = xrunRoundLogo;

    const remoteUri = (isXplayShop && productDetail?.goodsImgB) || productDetail?.goodsImgS || productDetail?.mmsGoodsImg || '';
    const primarySource = remoteUri ? { uri: remoteUri } : product.image;
    const showPlaceholder = imageLoadFailed || !primarySource;
    console.log('[ShopProductDetail] 이미지 소스:', { remoteUri, hasProductImage: !!product.image, imageLoadFailed, usingFallback: !remoteUri || imageLoadFailed });
    const displayTitle = (isXplayShop && productDetail?.goodsName) ? productDetail.goodsName : product.title;
    const displayBrand = (isXplayShop && productDetail?.brandName) ? productDetail.brandName : product.brand;

    const displayPrice = product.price;
    const xplayRemainingBalance = xplayBalanceState == null ? null : (xplayBalanceState - displayPrice);
    const hasDetailDescription = isXplayShop && productDetail && (productDetail.content || productDetail.contentAddDesc);

    return (
        <SafeView style={styles.container} backgroundColor="#F8FAFC">
            <StatusBar style="dark" />
            <Header
                title={t('screens.shopProductDetail.productInfo')}
                onBackPress={goBack}
                showBackButton
            />
            <SafeScrollView showsVerticalScrollIndicator={false} showBottomBackground={false} backgroundColor="transparent" disableBottomPadding={true}>
                <View style={styles.content}>
                    {}
                    <View style={styles.productCard}>
                        {isXplayShop && productDetailLoading && (
                            <View style={styles.detailLoadingWrap}>
                                <ActivityIndicator size="small" color="#1E3A5F" />
                            </View>
                        )}
                        <View style={styles.productImageContainer}>
                            <View style={styles.productImageWrapper}>
                                {showPlaceholder ? (

                                    <View style={styles.productImage} />
                                ) : (
                                    <Image
                                        source={primarySource}
                                        style={styles.productImage}
                                        resizeMode="contain"
                                        onError={() => setImageLoadFailed(true)}
                                    />
                                )}
                            </View>
                        </View>
                        <View style={styles.productInfoContainer}>
                            <View style={styles.brandContainer}>
                                <Text style={styles.brand}>{displayBrand}</Text>
                            </View>
                            <Text style={styles.title}>{displayTitle}</Text>
                            {hasDetailDescription ? (
                                <Text style={styles.productDescription}>
                                    {(productDetail?.content || productDetail?.contentAddDesc || '').trim()}
                                </Text>
                            ) : null}
                        </View>
                    </View>

                    {}
                    {isPurchasedView ? (
                        <View style={styles.paymentCard}>
                            <View style={styles.sectionHeader}>
                                <Feather name="check-circle" size={18} color="#22c55e" />
                                <Text style={styles.sectionTitle}>구매 완료 정보</Text>
                            </View>
                            <View style={styles.divider} />
                            <View style={styles.paymentRow}>
                                <Text style={styles.paymentLabel}>결제 금액</Text>
                                <View style={styles.priceContainer}>
                                    <Image source={coinIcon} style={styles.coinIcon} resizeMode="contain" />
                                    <Text style={styles.paymentValue}>
                                        {(() => {

                                            const candidates = [
                                                purchasedPaidXrun,
                                                Number((selectedShopItem as any)?.priceXrun ?? 0),
                                                Number(product.price ?? 0),
                                            ];
                                            const val = candidates.find((n) => isFinite(n) && n > 0) ?? 0;
                                            return val > 0
                                                ? `${val.toFixed(4).replace(/\.?0+$/, '')} XRUN`
                                                : '-';
                                        })()}
                                    </Text>
                                </View>
                            </View>
                            <View style={styles.paymentRowLast}>
                                <Text style={styles.paymentLabel}>구매일</Text>
                                <Text style={styles.paymentBalance}>{purchasedDate || '-'}</Text>
                            </View>
                        </View>
                    ) : (
                    <View style={styles.paymentCard}>
                        <View style={styles.sectionHeader}>
                            <Feather name="credit-card" size={18} color="#1E3A5F" />
                            <Text style={styles.sectionTitle}>{t('screens.shopProductDetail.paymentInfo')}</Text>
                        </View>
                        <View style={styles.divider} />
                        {isXplayShop ? (
                            <>
                                <View style={styles.paymentRow}>
                                    <Text style={styles.paymentLabel}>{t('screens.shopProductDetail.paymentAmount')}</Text>
                                    <View style={styles.priceContainer}>
                                        <Image source={xrunRoundLogo} style={styles.coinIcon} resizeMode="contain" />
                                        <Text style={styles.paymentValue}>{displayPrice.toLocaleString()} XRUN</Text>
                                    </View>
                                </View>
                                <View style={styles.paymentRow}>
                                    <Text style={styles.paymentLabel}>{t('screens.shopProductDetail.myXRUNBalance')}</Text>
                                    {xrunBalanceLoading ? (
                                        <ActivityIndicator size="small" color="#1E3A5F" />
                                    ) : (
                                        <Text style={styles.paymentBalance}>
                                            {xrunBalanceState == null ? '-' : `${xrunBalanceState.toLocaleString()} XRUN`}
                                        </Text>
                                    )}
                                </View>
                                <View style={styles.paymentRowLast}>
                                    <Text style={styles.paymentLabel}>{t('screens.shopProductDetail.remainingXRUN')}</Text>
                                    <Text style={styles.paymentRemaining}>
                                        {xrunBalanceState == null ? '-' : `${(xrunBalanceState - displayPrice).toLocaleString()} XRUN`}
                                    </Text>
                                </View>
                            </>
                        ) : (
                            <>
                                <View style={styles.paymentRow}>
                                    <Text style={styles.paymentLabel}>{t('screens.shopProductDetail.paymentAmount')}</Text>
                                    <View style={styles.priceContainer}>
                                        <Image source={coinIcon} style={styles.coinIcon} resizeMode="contain" />
                                        <Text style={styles.paymentValue}>{product.price.toLocaleString()} XRUN</Text>
                                    </View>
                                </View>
                                <View style={styles.paymentRow}>
                                    <Text style={styles.paymentLabel}>{t('screens.shopProductDetail.myXrunBalance')}</Text>
                                    {xrunBalanceLoading ? (
                                        <ActivityIndicator size="small" color="#1E3A5F" />
                                    ) : (
                                        <Text style={styles.paymentBalance}>{xrunBalance.toLocaleString()} XRUN</Text>
                                    )}
                                </View>
                                <View style={styles.paymentRowLast}>
                                    <Text style={styles.paymentLabel}>{t('screens.shopProductDetail.remainingXrun')}</Text>
                                    <Text style={styles.paymentRemaining}>{remainingBalance.toLocaleString()} XRUN</Text>
                                </View>
                            </>
                        )}
                    </View>
                    )}

                    {}
                    <View style={styles.guideCard}>
                        <View style={styles.sectionHeader}>
                            <Feather name="info" size={18} color="#1E3A5F" />
                            <Text style={styles.sectionTitle}>{t('screens.shopProductDetail.guide')}</Text>
                        </View>
                        <View style={styles.divider} />

                        <View style={styles.guideItem}>
                            <View style={styles.guideItemHeader}>
                                <View style={styles.guideNumber}>
                                    <Text style={styles.guideNumberText}>1</Text>
                                </View>
                                <Text style={styles.guideSubtitle}>{t('screens.shopProductDetail.cancelRefund')}</Text>
                            </View>
                            <View style={styles.guideTextContainer}>
                                <Text style={styles.guideText}>• 본 상품은 구매 즉시 발송되는 디지털 쿠폰(모바일 쿠폰/바코드)입니다.</Text>
                                <Text style={styles.guideText}>• 쿠폰번호(PIN) 발행 후 사용 여부 확인이 불가능하므로 단순 변심에 의한 취소 및 환불은 불가능합니다.</Text>
                                <Text style={styles.guideText}>• 상품 품절 등 교환 불가 사유 발생 시에만 100% 환불 처리됩니다.</Text>
                            </View>
                        </View>

                        <View style={styles.guideItem}>
                            <View style={styles.guideItemHeader}>
                                <View style={styles.guideNumber}>
                                    <Text style={styles.guideNumberText}>2</Text>
                                </View>
                                <Text style={styles.guideSubtitle}>{t('screens.shopProductDetail.guideSubtitle')}</Text>
                            </View>
                            <View style={styles.guideTextContainer}>
                                <Text style={styles.guideText}>• 전국 교환처(해당 브랜드 매장)에서 결제 시 모바일 쿠폰을 제시해 주세요.</Text>
                                <Text style={styles.guideText}>• 매장 재고에 따라 상품이 제공되지 않을 수 있으며, 이 경우 동일 가격 이상의 다른 상품으로 교환 가능합니다(차액 지불).</Text>
                            </View>
                        </View>
                    </View>
                </View>
            </SafeScrollView>

            {}
            {!isPurchasedView && (
            <View style={[styles.buttonContainer, { paddingBottom: bottomSafeArea + 20 }]}>
                {product.isIak ? (

                    <TouchableOpacity
                        style={[styles.purchaseButton, iakPurchaseLoading && styles.purchaseButtonDisabled]}
                        onPress={() => { setIakPhone(''); setIakPhoneModalVisible(true); }}
                        disabled={iakPurchaseLoading || member == null}
                        activeOpacity={0.8}
                    >
                        <LinearGradient
                            colors={['#1E3A5F', '#2D4A6F']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={styles.purchaseButtonGradient}
                        >
                            {iakPurchaseLoading ? <ActivityIndicator size="small" color="#FFFFFF" style={styles.purchaseIcon} /> : null}
                            <Text style={styles.purchaseButtonText}>
                                {iakPurchaseLoading ? t('screens.shop.iak.processing') : t('screens.shop.iak.buyButton')}
                            </Text>
                        </LinearGradient>
                    </TouchableOpacity>
                ) : isXplayShop ? (
                    <TouchableOpacity
                        style={[styles.purchaseButton, xplayPurchaseLoading && styles.purchaseButtonDisabled]}
                        onPress={handleXplayPurchase}
                        disabled={xplayPurchaseLoading || xplayBalanceLoading || member == null}
                        activeOpacity={0.8}
                    >
                        <LinearGradient
                            colors={['#1E3A5F', '#2D4A6F']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={styles.purchaseButtonGradient}
                        >
                            {xplayPurchaseLoading ? (
                                <ActivityIndicator size="small" color="#FFFFFF" style={styles.purchaseIcon} />
                            ) : null}
                            <Text style={styles.purchaseButtonText}>
                                {xplayPurchaseLoading ? t('screens.shopProductDetail.processing') : t('screens.shopProductDetail.purchaseWithXRUN')}
                            </Text>
                        </LinearGradient>
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity
                        style={styles.purchaseButton}
                        onPress={handlePurchase}
                        activeOpacity={0.8}
                    >
                        <LinearGradient
                            colors={['#1E3A5F', '#2D4A6F']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={styles.purchaseButtonGradient}
                        >
                            <Text style={styles.purchaseButtonText}>{t('screens.shopProductDetail.purchaseButton')}</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                )}
            </View>
            )}

            {}
            <Modal
                visible={paymentSuccessVisible}
                transparent={true}
                animationType="fade"
                onRequestClose={handlePaymentSuccessClose}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.paymentSuccessModal}>
                        <View style={styles.modalLogoContainer}>
                            <Image source={xrunRoundLogo} style={styles.modalLogo} resizeMode="contain" />
                        </View>
                        <Text style={styles.paymentSuccessMessage}>{t('screens.shopProductDetail.paymentComplete')}</Text>
                        <TouchableOpacity style={styles.paymentSuccessButton} onPress={handlePaymentSuccessClose} activeOpacity={0.8}>
                            <Text style={styles.paymentSuccessButtonText}>{t('screens.shopProductDetail.confirm')}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            {}
            <Modal
                visible={iakPhoneModalVisible}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setIakPhoneModalVisible(false)}
            >
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={styles.modalOverlay}
                >
                    <View style={[styles.paymentSuccessModal, { paddingTop: 24 }]}>
                        <Text style={{ fontSize: 17, fontWeight: '700', color: '#111827', marginBottom: 8, textAlign: 'center' }}>
                            {t(tkInput('ModalTitle'))}
                        </Text>
                        <Text style={{ fontSize: 12, color: '#6b7280', marginBottom: 16, textAlign: 'center' }}>
                            {t(tkInput('ModalDesc'))}
                        </Text>
                        <TextInput
                            value={iakPhone}
                            onChangeText={setIakPhone}
                            placeholder={t(tkInput('Placeholder'))}
                            keyboardType={iakInputKind === 'game_id' ? 'numeric' : 'phone-pad'}
                            autoFocus
                            style={{ borderWidth: 1, borderColor: '#d1d5db', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, fontSize: 15, marginBottom: 16, backgroundColor: '#fff', width: '100%' }}
                        />
                        <View style={{ flexDirection: 'row', gap: 8, width: '100%' }}>
                            <TouchableOpacity
                                style={{ flex: 1, padding: 12, borderRadius: 8, backgroundColor: '#e5e7eb', alignItems: 'center' }}
                                onPress={() => setIakPhoneModalVisible(false)}
                                disabled={iakPurchaseLoading}
                                activeOpacity={0.8}
                            >
                                <Text style={{ color: '#374151', fontWeight: '600' }}>{t('screens.shop.iak.cancel')}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={{ flex: 1, padding: 12, borderRadius: 8, backgroundColor: iakPhone.trim() ? '#1E3A5F' : '#9ca3af', alignItems: 'center' }}
                                onPress={() => { setIakPhoneModalVisible(false); handleIakPurchase(); }}
                                disabled={iakPurchaseLoading || !iakPhone.trim()}
                                activeOpacity={0.8}
                            >
                                <Text style={{ color: '#fff', fontWeight: '700' }}>{t('screens.shop.iak.buyConfirm')}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </KeyboardAvoidingView>
            </Modal>

            {}
            <Modal
                visible={iakSuccessVisible}
                transparent={true}
                animationType="fade"
                onRequestClose={handleIakSuccessClose}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.paymentSuccessModal}>
                        <View style={styles.modalLogoContainer}>
                            <Image source={xrunRoundLogo} style={styles.modalLogo} resizeMode="contain" />
                        </View>
                        <Text style={[styles.paymentSuccessMessage, { marginBottom: 12 }]}>
                            {t('screens.shop.iak.successTitle')}
                        </Text>
                        {iakPurchaseResult?.iak?.sn ? (
                            <View style={{ alignItems: 'center', marginBottom: 16 }}>
                                <Text style={{ fontSize: 12, color: '#6b7280', marginBottom: 4 }}>{t('screens.shop.iak.snLabel')}</Text>
                                <Text style={{ fontSize: 16, fontWeight: '700', fontFamily: 'Roboto-Medium', color: '#111827', letterSpacing: 1 }}>
                                    {iakPurchaseResult.iak.sn}
                                </Text>
                            </View>
                        ) : null}
                        <View style={{ backgroundColor: '#eff6ff', borderRadius: 8, padding: 12, marginBottom: 16, width: '100%' }}>
                            <Text style={{ fontSize: 12, color: '#1e40af', lineHeight: 18, textAlign: 'center' }}>
                                {t('screens.shop.iak.smsNotice')}
                            </Text>
                        </View>
                        <TouchableOpacity style={styles.paymentSuccessButton} onPress={handleIakSuccessClose} activeOpacity={0.8}>
                            <Text style={styles.paymentSuccessButtonText}>{t('screens.shop.iak.ok')}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            {}
            <Modal
                visible={xplayPaymentSuccessVisible}
                transparent={true}
                animationType="fade"
                onRequestClose={handleXplayPaymentSuccessClose}
            >
                <View style={styles.modalOverlay}>
                    <View style={[styles.paymentSuccessModal, xplayPurchaseResult?.coupon_img_url ? styles.paymentSuccessModalWide : undefined]}>
                        <View style={styles.modalLogoContainer}>
                            <Image source={xrunRoundLogo} style={styles.modalLogo} resizeMode="contain" />
                        </View>
                        <Text style={styles.paymentSuccessMessage}>
                            {xplayPurchaseResult?.coupon_img_url ? '쿠폰이 발급되었습니다!' : 'XRUN 결제가 완료되었습니다'}
                        </Text>
                        {xplayPurchaseResult?.coupon_img_url ? (
                            <ScrollView style={styles.couponBarcodeScroll} showsVerticalScrollIndicator={false}>
                                <Image
                                    source={{ uri: xplayPurchaseResult.coupon_img_url }}
                                    style={styles.couponBarcodeImage}
                                    resizeMode="contain"
                                />
                                {xplayPurchaseResult.pin_no ? (
                                    <Text style={styles.couponPinNo}>핀번호: {xplayPurchaseResult.pin_no}</Text>
                                ) : null}
                                {xplayPurchaseResult.limit_date ? (
                                    <Text style={styles.couponLimitDate}>유효기간: ~ {xplayPurchaseResult.limit_date}까지</Text>
                                ) : null}
                            </ScrollView>
                        ) : null}
                        <TouchableOpacity style={styles.paymentSuccessButton} onPress={handleXplayPaymentSuccessClose} activeOpacity={0.8}>
                            <Text style={styles.paymentSuccessButtonText}>{t('screens.shopProductDetail.viewMyGift')}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            {}
            {purchasePinVisible && purchaseCtx && (
                <WalletKeyPinPromptModal
                    visible={purchasePinVisible}
                    memberId={purchaseCtx.memberId}
                    email={purchaseCtx.email}
                    processingLabel="결제 처리 중..."
                    onSuccess={async (wallets: WalletKey[]) => {

                        if (purchaseLocalLoading) return;
                        setPurchaseLocalLoading(true);
                        const kind = purchaseCtx.kind;
                        try {

                            const target = wallets.find((w) => w.wallet_code === 'c18')
                                ?? wallets.find((w) => w.wallet_code === 'c16');
                            if (!target?.private_key) {
                                throw new Error('지갑 키를 찾을 수 없어요. 복원을 먼저 해주세요.');
                            }
                            if (kind === 'iak') {

                                const customerId = purchaseCtx.iakCustomerId ?? '';
                                if (!customerId) throw new Error(t(tkInput('Required')));
                                const prep = await purchaseIakPrepare(member!, String(product.id), navigate);
                                if (prep?.status !== 'success' || !prep.data?.[0]) {
                                    throw new Error(prep?.message || 'IAK prepare 실패');
                                }
                                const meta = prep.data[0];
                                const send = await sendOnchainLocal({
                                    privateKey: target.private_key,
                                    fromAddress: meta.userAddress,
                                    toAddress: meta.casherAddress,
                                    amount: String(meta.actualPurchaseAmount),
                                    currency: 18,
                                });
                                if (!send.ok) {
                                    const detail = (send as any).detail ?? (send as any).reason ?? '송금 실패';
                                    const detailStr = typeof detail === 'string' ? detail : '';
                                    const isGasShort = (send as any).reason === 'broadcast-failed'
                                        && /수수료|가스|insufficient funds/i.test(detailStr);
                                    if (isGasShort) {
                                        setPurchasePinVisible(false);
                                        setPurchaseLocalLoading(false);
                                        await showAlert(t('common.gasInsufficient.title'), t('common.gasInsufficient.messagePurchase'));
                                        return;
                                    }
                                    throw new Error(detailStr || '송금 실패');
                                }
                                const rec = await purchaseIakRecord(
                                    member!, meta.ref_id, customerId, send.txHash, String(product.id), navigate
                                );

                                const recData: any = Array.isArray(rec?.data) ? rec.data[0] : rec?.data;
                                const recInnerStatus = recData?.txn_status;
                                if (rec?.status === 'success' && recInnerStatus === 'success') {
                                    console.log('[T-031 IAK 구매] 성공:', { txHash: send.txHash, ref_id: meta.ref_id });
                                    setIakPurchaseResult(recData);
                                    setPurchasePinVisible(false);
                                    setIakSuccessVisible(true);
                                    loadXrunBalance();
                                    return;
                                }
                                if (recInnerStatus === 'failed' || recInnerStatus === 'refunded' || rec?.status !== 'success') {
                                    setPurchasePinVisible(false);
                                    setPurchaseLocalLoading(false);
                                    const reason = recData?.user_message || rec?.message || t('screens.shop.iak.unknownError');
                                    const wasRefunded = !!recData?.refunded || recInnerStatus === 'refunded';
                                    const refundLine = wasRefunded ? `\n\n${t('screens.shop.iak.autoRefunded')}` : '';
                                    showAlert(t('screens.shop.iak.purchaseFailed'), `${reason}${refundLine}`, [{ text: t('screens.shop.iak.ok') }]);
                                    loadXrunBalance();
                                    return;
                                }

                                setIakPurchaseResult(recData);
                                setPurchasePinVisible(false);
                                setIakSuccessVisible(true);
                                loadXrunBalance();
                                return;
                            }
                            if (kind === 'gift') {

                                const prep = await purchaseGiftPrepare(member!, String(product.id), navigate);
                                if (prep?.status !== 'success' || !prep.data?.[0]) {
                                    throw new Error(prep?.message || 'prepare 실패');
                                }
                                const meta = prep.data[0];
                                const send = await sendOnchainLocal({
                                    privateKey: target.private_key,
                                    fromAddress: meta.userAddress,
                                    toAddress: meta.casherAddress,
                                    amount: String(meta.actualPurchaseAmount),
                                    currency: 18,
                                });
                                if (!send.ok) {
                                    const detail = (send as any).detail ?? (send as any).reason ?? '송금 실패';

                                    const detailStr = typeof detail === 'string' ? detail : '';
                                    const isGasShort = (send as any).reason === 'broadcast-failed'
                                        && /수수료|가스|insufficient funds/i.test(detailStr);
                                    if (isGasShort) {
                                        setPurchasePinVisible(false);
                                        setPurchaseLocalLoading(false);
                                        await showAlert(
                                            t('common.gasInsufficient.title'),
                                            t('common.gasInsufficient.messagePurchase'),
                                        );
                                        return;
                                    }
                                    throw new Error(detailStr || '송금 실패');
                                }
                                const rec = await purchaseGiftRecord(member!, String(product.id), userPhone ?? '', send.txHash, meta.actualPurchaseAmount, navigate);
                                if (rec?.status !== 'success') {
                                    const pendingManual = Array.isArray(rec?.data) && rec.data[0]?.pending_manual;
                                    const baseMsg = rec?.message || t('screens.shopProductDetail.alerts.couponSendFail');
                                    if (pendingManual) {

                                        setPurchasePinVisible(false);
                                        showAlert(
                                            t('screens.shopProductDetail.alerts.paymentCompletePendingCouponTitle'),
                                            t('screens.shopProductDetail.alerts.paymentCompletePendingCouponMessage', { reason: baseMsg, tx: send.txHash.slice(0, 16) }),
                                            [{ text: t('screens.shopProductDetail.confirm') }],
                                        );
                                        loadXrunBalance();
                                        return;
                                    }
                                    throw new Error(baseMsg);
                                }
                                console.log('[T-031 기프티콘 구매] 성공:', { txHash: send.txHash });

                                setXplayPurchaseResult(rec?.data?.[0] ?? rec?.data ?? null);
                                setPurchasePinVisible(false);
                                setXplayPaymentSuccessVisible(true);
                                loadXrunBalance();
                                return;
                            }

                            const prep = await purchaseXrunItemPrepare(member!, parseInt(String(product.id), 10), navigate);
                            if (prep?.status !== 'success' || !prep.data?.[0]) {
                                throw new Error(prep?.message || 'prepare 실패');
                            }
                            const meta = prep.data[0];
                            const send = await sendOnchainLocal({
                                privateKey: target.private_key,
                                fromAddress: meta.userAddress,
                                toAddress: meta.casherAddress,
                                amount: String(meta.actualPurchaseAmount),
                                currency: 18,
                            });
                            if (!send.ok) {
                                const detail = (send as any).detail ?? (send as any).reason ?? '송금 실패';

                                const detailStr = typeof detail === 'string' ? detail : '';
                                const isGasShort = (send as any).reason === 'broadcast-failed'
                                    && /수수료|가스|insufficient funds/i.test(detailStr);
                                if (isGasShort) {
                                    setPurchasePinVisible(false);
                                    setPurchaseLocalLoading(false);
                                    await showAlert(
                                        t('common.gasInsufficient.title'),
                                        t('common.gasInsufficient.messagePurchase'),
                                    );
                                    return;
                                }
                                throw new Error(detailStr || '송금 실패');
                            }
                            const rec = await purchaseXrunItemRecord(member!, parseInt(String(product.id), 10), send.txHash, meta.actualPurchaseAmount, navigate);
                            if (rec?.status !== 'success') {
                                throw new Error(rec?.message || 'record 실패');
                            }
                            console.log('[T-031 구매] 성공:', { txHash: send.txHash });
                            loadXrunBalance();

                            setPurchasePinVisible(false);
                            setPaymentSuccessVisible(true);
                        } catch (e: any) {
                            console.error('[T-031 구매] 실패:', e?.message);

                            setPurchasePinVisible(false);
                            showAlert(
                                t('screens.shopProductDetail.alerts.purchaseFailed'),
                                e?.message || '구매 처리 중 오류가 발생했어요. 잠시 후 다시 시도해주세요.',
                                [{ text: t('screens.shopProductDetail.confirm') }],
                            );
                        } finally {
                            setPurchaseLocalLoading(false);
                            setPurchaseCtx(null);
                        }
                    }}
                    onCancel={() => {
                        setPurchasePinVisible(false);
                        setPurchaseCtx(null);
                    }}
                />
            )}
        </SafeView>
    );
};

const styles = StyleSheet.create({
    container: {
        ...COMMON_STYLES.container,
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
