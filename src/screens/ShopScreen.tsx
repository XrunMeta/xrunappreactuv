import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Image, ScrollView, ImageSourcePropType, Dimensions, ActivityIndicator, RefreshControl } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeScrollView, SafeView } from '../components';
import { Feather } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { Header, SegmentedControl, TaboolaBanner } from '../components';
import { useAlertDialog } from '../context/AlertDialogContext';
import { useAppNavigation, ROUTES } from '../navigation';
import { useAppContext } from '../context';
import { COLORS, COMMON_STYLES, SIZES, FONTS } from '../constants';
import { getProductList } from '../services/giftishowBiz';
import type { GiftishowProductItem } from '../services/giftishowBiz';
import { getAyetPointsBalance, getXrunWalletBalance, getUserBalance, getXrunBuyableItems, fetchWalletData } from '../services';
import type { ShopItemData } from '../types';

const xplaySymbol = require('../../assets/xplay_symbol.png');
const xrunRoundLogo = require('../../assets/xrun-round-logo.png');
const sampleStarbucks = require('../../assets/sample_starbugs.png');
const sampleCU = require('../../assets/sample_cu.png');
const sampleNaverPay = require('../../assets/sample_naverpay.png');
const blurYellow = require('../../assets/images/blur_yellow.png');
const ethereumThumb = require('../../assets/images/ethereum_thumb.png');
const xrunHorizontalLogo = require('../../assets/xrun-horizontal-logo.png');

interface ProductData {
    id: string;
    brand: string;
    title: string;
    description?: string;
    price: number;
    image: ImageSourcePropType;

    isXplayShop?: boolean;
}

const sampleProducts: ProductData[] = [
    {
        id: '1',
        brand: '스타벅스',
        title: '아이스 카페 아메리카노T 2잔+부드러운 생크림 카스텔라 모바일쿠폰',
        price: 2000,
        image: sampleStarbucks,
    },
    {
        id: '2',
        brand: 'Ethereum',
        title: 'Ethereum 교환권',
        description: '최소 30,000 XRUN 이상 교환가능',
        price: 30000,
        image: ethereumThumb,
    },
    {
        id: '3',
        brand: 'CU',
        title: 'CU 편의점 기프티콘',
        price: 2000,
        image: sampleCU,
    },
    {
        id: '4',
        brand: 'Ethereum',
        title: '네이버페이 포인트 1만원',
        price: 30000,
        image: sampleNaverPay,
    },
];

function shopItemToProductData(item: ShopItemData): ProductData {

    const imgSrc = item.thumbnail || item.image;
    const imgUri = typeof imgSrc === 'string' && imgSrc.startsWith('http') ? imgSrc : null;
    return {
        id: String(item.item),
        brand: 'XRUN',
        title: item.title || '-',
        description: item.description || undefined,
        price: Number(item.priceXrun) || 0,
        image: imgUri ? { uri: imgUri } : xrunHorizontalLogo,
    };
}

const KRW_PER_XRUN = 70;
function giftishowToProductData(item: GiftishowProductItem): ProductData {
    const krw = typeof item.price === 'number' ? item.price : 0;
    const xrunPrice = Math.ceil(krw / KRW_PER_XRUN);
    return {
        id: item.id ?? `g-${item.name ?? ''}`,
        brand: (item as any).brandName ?? '기프티콘',
        title: item.name ?? '-',
        price: xrunPrice,
        image: item.imageUrl ? { uri: item.imageUrl } : sampleCU,
        isXplayShop: true,
    };
}

export const ShopScreen = () => {
    console.log('[ShopScreen] ShopScreen 컴포넌트 렌더링됨');
    const { t } = useTranslation();
    const { showAlert } = useAlertDialog();
    const { setSelectedShopItem, selectedShopItem } = useAppContext();
    const [tab, setTab] = useState<'xrunStore' | 'myItems'>('xrunStore');

    const [xplayProductList, setXplayProductList] = useState<GiftishowProductItem[]>([]);
    const [xplayLoading, setXplayLoading] = useState(false);
    const [xplayRefreshing, setXplayRefreshing] = useState(false);
    const [xplayError, setXplayError] = useState<string | null>(null);
    const [xplayBalance, setXplayBalance] = useState<number | null>(null);
    const [xplayBalanceLoading, setXplayBalanceLoading] = useState(false);
    const [xrunBalance, setXrunBalance] = useState<number | null>(null);
    const [xrunBalanceLoading, setXrunBalanceLoading] = useState(false);
    const [xrunStoreProducts, setXrunStoreProducts] = useState<ProductData[]>([]);
    const [xrunStoreLoading, setXrunStoreLoading] = useState(false);
    const { navigate } = useAppNavigation();

    const XRUN_BALANCE_CACHE_KEY = 'shop:xrunBalance';
    const XPLAY_BALANCE_CACHE_KEY = 'shop:xplayBalance';

    const loadXrunBalance = useCallback(async () => {
        try {
            const userDataStr = await AsyncStorage.getItem('userData');
            if (!userDataStr) return;
            const userData = JSON.parse(userDataStr);
            const member = userData?.member;
            if (member == null) return;

            setXrunBalance((prev) => {
                if (prev == null) setXrunBalanceLoading(true);
                return prev;
            });
            console.log('[ShopScreen] fetchWalletData(Polygon currency=18) 호출 member=', member);
            const res: any = await fetchWalletData(Number(member), 7, navigate);
            const list: any[] = Array.isArray(res?.data) ? res.data : [];
            const xrunPolygon = list.find((w) => Number(w?.currency) === 18);
            const parsed = parseFloat(xrunPolygon?.Wamount || xrunPolygon?.amount || '0');
            console.log('[ShopScreen] XRUN Polygon 잔액:', parsed);
            const value = Number.isFinite(parsed) ? parsed : null;
            setXrunBalance(value);
            if (value != null) AsyncStorage.setItem(XRUN_BALANCE_CACHE_KEY, String(value)).catch(() => {});
        } catch (e) {
            console.warn('[ShopScreen] XRUN 잔액 조회 실패:', e);

        } finally {
            setXrunBalanceLoading(false);
        }
    }, [navigate]);

    const loadXplayBalance = useCallback(async () => {
        try {
            const userDataStr = await AsyncStorage.getItem('userData');
            if (!userDataStr) {
                setXplayBalance(null);
                return;
            }
            const userData = JSON.parse(userDataStr);
            const member = userData?.member;
            if (member == null) {
                setXplayBalance(null);
                return;
            }
            setXplayBalance((prev) => {
                if (prev == null) setXplayBalanceLoading(true);
                return prev;
            });
            console.log('[ShopScreen] getAyetPointsBalance 호출 member=', member);
            const result = await getAyetPointsBalance(member, navigate);
            console.log('[ShopScreen] getAyetPointsBalance 결과:', result);
            const value = result.total_ayet_points ?? null;
            setXplayBalance(value);
            if (value != null) AsyncStorage.setItem(XPLAY_BALANCE_CACHE_KEY, String(value)).catch(() => {});
        } catch (e) {
            console.warn('[ShopScreen] Xplay 잔액 조회 실패:', e);

        } finally {
            setXplayBalanceLoading(false);
        }
    }, [navigate]);

    useEffect(() => {
        let cancelled = false;
        (async () => {
            console.log('[ShopScreen] 잔액 마운트 fetch 시작');
            try {
                const userDataStr = await AsyncStorage.getItem('userData');
                if (!userDataStr) return;
                const userData = JSON.parse(userDataStr);
                const member = userData?.member;
                if (member == null) return;

                try {
                    const [cachedXrun, cachedXplay] = await Promise.all([
                        AsyncStorage.getItem(XRUN_BALANCE_CACHE_KEY),
                        AsyncStorage.getItem(XPLAY_BALANCE_CACHE_KEY),
                    ]);
                    if (!cancelled) {
                        if (cachedXrun != null) {
                            const n = parseFloat(cachedXrun);
                            if (Number.isFinite(n)) setXrunBalance(n);
                        }
                        if (cachedXplay != null) {
                            const n = parseFloat(cachedXplay);
                            if (Number.isFinite(n)) setXplayBalance(n);
                        }
                    }
                } catch {}

                const xrunRes = await Promise.allSettled([
                    fetchWalletData(Number(member), 7, undefined),
                ]);
                if (cancelled) return;
                if (xrunRes[0].status === 'fulfilled') {
                    const list: any[] = Array.isArray((xrunRes[0].value as any)?.data) ? (xrunRes[0].value as any).data : [];
                    const xrunPolygon = list.find((w) => Number(w?.currency) === 18);
                    const parsed = parseFloat(xrunPolygon?.Wamount || xrunPolygon?.amount || '0');
                    const v = Number.isFinite(parsed) ? parsed : 0;
                    console.log('[ShopScreen] XRUN Polygon 잔액:', v);
                    setXrunBalance(v);
                    setXplayBalance(v);
                    AsyncStorage.setItem(XRUN_BALANCE_CACHE_KEY, String(v)).catch(() => {});
                    AsyncStorage.setItem(XPLAY_BALANCE_CACHE_KEY, String(v)).catch(() => {});
                } else {
                    console.warn('[ShopScreen] Polygon 잔액 실패:', xrunRes[0].reason);
                }
            } catch (e) {
                console.warn('[ShopScreen] 잔액 마운트 fetch 에러:', e);
            } finally {
                if (!cancelled) {
                    setXplayBalanceLoading(false);
                    setXrunBalanceLoading(false);
                }
            }
        })();
        return () => { cancelled = true; };
    }, []);

    const loadXplayProducts = useCallback(async () => {
        setXplayError(null);
        try {
            const res = await getProductList({ start: 1, size: 50 });
            const list = Array.isArray(res.list) ? res.list : [];
            setXplayProductList(list);
            console.log('[Xplay Shop] 상품 목록 조회:', list.length, '건', list.map((item) => ({ id: item.id, name: item.name, price: item.price })));
            if (list.length === 0 && res.resultMsg) setXplayError(res.resultMsg);
        } catch (e) {
            setXplayError(e instanceof Error ? e.message : '기프티콘 목록을 불러오지 못했습니다.');
            setXplayProductList([]);
        }
    }, []);

    useEffect(() => {
        if (tab === 'xrunStore') {
            setXplayLoading(true);
            loadXplayProducts().finally(() => setXplayLoading(false));
        }
    }, [tab, loadXplayProducts]);

    const onXplayRefresh = useCallback(() => {
        setXplayRefreshing(true);
        Promise.all([loadXplayProducts(), loadXplayBalance()]).finally(() => setXplayRefreshing(false));
    }, [loadXplayProducts, loadXplayBalance]);

    useEffect(() => {
        if (selectedShopItem && (selectedShopItem as any).shopTab) {
            setTab('xrunStore');
            setSelectedShopItem(undefined);
        }
    }, [selectedShopItem, setSelectedShopItem]);
    const [showSearchBar, setShowSearchBar] = useState<boolean>(false);

    const loadXrunStoreProducts = useCallback(async () => {
        try {
            const userDataStr = await AsyncStorage.getItem('userData');
            if (!userDataStr) return;
            const userData = JSON.parse(userDataStr);
            const member = userData?.member;
            if (member == null) return;
            const res = await getXrunBuyableItems(String(member));
            if (res.status === 'success' && res.data) {
                setXrunStoreProducts(res.data.map(shopItemToProductData));
            }
        } catch (err) {
            console.error('[ShopScreen] XRUN Store 상품 로드 실패:', err);
        }
    }, []);

    useEffect(() => {
        if (tab === 'xrunStore') {
            loadXrunBalance();
            loadXrunStoreProducts();
        }
    }, [tab, loadXrunBalance, loadXrunStoreProducts]);

    const screenWidth = Dimensions.get('window').width;
    const productCardWidth = useMemo(() => {
        const paddingHorizontal = 16;
        const gap = 8;
        const availableWidth = screenWidth - paddingHorizontal * 2;
        return (availableWidth - gap) / 2;
    }, [screenWidth]);

    const segmentedOptions = useMemo(
        () => [
            { label: 'XRUN Store', value: 'xrunStore' },
            { label: 'My Items', value: 'myItems' },
        ] as const,
        [],
    );

    const handleTabChange = (value: typeof segmentedOptions[number]['value']) => {
        if (value === 'myItems') {
            navigate(ROUTES.shopMyItems);
            return;
        }
        setTab(value);
    };

    const handleProductClick = (product: ProductData) => {

        const shopItem = {
            id: product.id,
            title: product.title,
            priceLabel: `${product.price.toLocaleString()}`,
            image: product.image,
            detailTotal: '',
            brand: product.brand,
            description: product.description,
            isXrun: product.brand === 'XRUN',
            shopTab: product.isXplayShop ? ('xplayShop' as const) : undefined,
        };
        setSelectedShopItem(shopItem as any);
        navigate(ROUTES.shopProductDetail);
    };

    const handlePurchase = (product: ProductData) => {
        showAlert(t('screens.shop.purchaseConfirmTitle'), t('screens.shop.purchaseConfirmMessage', { title: product.title }), [
            { text: t('screens.shop.cancel') },
            { text: t('screens.shop.purchase'), onPress: () => console.log('구매:', product.id) },
        ]);
    };

    const [failedImages, setFailedImages] = useState<Set<string>>(new Set());

    const renderProductCard = (product: ProductData, showPurchaseButton: boolean = false) => {
        const isEthereum = product.brand === 'Ethereum' && product.description;

        const isXrun = product.brand === 'XRUN' || product.isXplayShop === true;

        const isRemote = product.image && typeof product.image === 'object' && 'uri' in product.image;
        const imgFailed = isRemote && failedImages.has(product.id);
        const displayImage = imgFailed ? xrunHorizontalLogo : product.image;

        return (
            <TouchableOpacity
                key={product.id}
                style={[styles.productCard, { width: productCardWidth }]}
                onPress={() => handleProductClick(product)}
                activeOpacity={0.8}
            >
                <View style={[
                    styles.productImageContainer,
                    isEthereum && styles.productImageContainerEthereum
                ]}>
                    <Image
                        source={displayImage}
                        style={styles.productImage}
                        resizeMode="contain"
                        onError={() => {
                            if (isRemote) {
                                setFailedImages(prev => new Set(prev).add(product.id));
                            }
                        }}
                    />
                    {isEthereum && product.description && (
                        <View style={styles.imageDescriptionOverlay}>
                            <Text style={styles.imageDescriptionText}>{product.description}</Text>
                        </View>
                    )}
                </View>
                <View style={styles.productInfo}>
                    <Text style={styles.productBrand}>{product.brand}</Text>
                    <Text style={styles.productTitle} numberOfLines={2}>
                        {product.title}
                    </Text>
                    <View style={styles.productFooter}>
                        <View style={styles.priceContainer}>
                            <View style={styles.xplayIconContainer}>
                                <Image
                                    source={xrunRoundLogo}
                                    style={styles.xrunIcon}
                                    resizeMode="contain"
                                />
                            </View>
                            <Text style={styles.priceText}>{product.price.toLocaleString()}</Text>
                        </View>
                        {showPurchaseButton && (
                            <TouchableOpacity
                                style={styles.purchaseButton}
                                onPress={() => handlePurchase(product)}
                                activeOpacity={0.8}
                            >
                                <Text style={styles.purchaseButtonText}>{t('screens.shop.purchase')}</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <SafeView style={styles.container} backgroundColor="#F8FAFC">
            <Header
                title={t('screens.shop.title')}
                rightComponent={
                    <TouchableOpacity
                        onPress={() => setShowSearchBar(!showSearchBar)}
                        activeOpacity={0.7}
                        style={styles.searchButton}
                    >
                        <Feather name="search" size={20} color="#007aff" />
                    </TouchableOpacity>
                }
            />
            <View style={styles.contentContainer}>
                {}
                {tab === 'xrunStore' && (
                    <View style={styles.balanceCardWrapper}>
                        <LinearGradient
                            colors={['#FFFFFF', '#F9FAFB', '#FFFFFF']}
                            locations={[0, 0.5, 1]}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={styles.balanceCard}
                        >
                            <Image source={blurYellow} style={styles.balanceBlurRight} resizeMode="cover" />
                            <View style={styles.balanceContent}>
                                <View style={styles.balanceLeft}>
                                    <Text style={styles.balanceLabel}>{t('screens.shop.myBalance')}</Text>
                                    <View style={styles.balanceAmountRow}>
                                        <View style={[styles.balanceXplayIconContainer, styles.balanceXrunIconContainer]}>
                                            <Image
                                                source={xrunRoundLogo}
                                                style={styles.balanceXplayIcon}
                                                resizeMode="contain"
                                            />
                                        </View>
                                        <Text style={styles.balanceAmount}>{xrunBalanceLoading ? '...' : xrunBalance == null ? '-' : xrunBalance.toLocaleString()}</Text>
                                    </View>
                                </View>
                                <View style={styles.xrunTag}>
                                    <Text style={styles.xrunTagText}>XRUN</Text>
                                </View>
                            </View>
                        </LinearGradient>
                    </View>
                )}

                {}
                <SegmentedControl
                    options={segmentedOptions}
                    value={tab}
                    onChange={handleTabChange}
                    containerStyle={styles.segmented}
                    hideIndicator={true}
                />

                {}
                <SafeScrollView
                    showsVerticalScrollIndicator={false}
                    showBottomBackground={false}
                    backgroundColor="transparent"
                    disableBottomPadding={true}
                    refreshControl={
                        tab === 'xrunStore' ? (
                            <RefreshControl refreshing={xplayRefreshing} onRefresh={onXplayRefresh} colors={[COLORS.buttonPrimary]} />
                        ) : undefined
                    }
                >
                    {tab === 'xrunStore' ? (
                        <>
                            {xplayLoading && !xplayRefreshing ? (
                                <View style={styles.loadingContainer}>
                                    <ActivityIndicator size="small" color={COLORS.buttonPrimary} />
                                    <Text style={styles.loadingText}>{t('screens.shop.loadingGiftList')}</Text>
                                </View>
                            ) : xplayError ? (
                                <View style={styles.errorContainer}>
                                    <Text style={styles.errorText}>{xplayError}</Text>
                                </View>
                            ) : (
                                <View style={styles.productGrid}>
                                    {xrunStoreProducts.map((product) => renderProductCard(product, false))}
                                    {xplayProductList.map((item) =>
                                        renderProductCard(giftishowToProductData(item), false)
                                    )}
                                </View>
                            )}
                        </>
                    ) : (
                        <View style={styles.emptyContainer}>
                            <Text style={styles.emptyText}>My Items는 별도 화면에서 확인하실 수 있습니다.</Text>
                        </View>
                    )}
                </SafeScrollView>
            </View>
            {}
            {tab !== 'xplayShop' ? (
                <View style={styles.taboolaContainer}>
                    <TaboolaBanner placementType="shop" />
                </View>
            ) : null}
        </SafeView>
    );
};

const styles = StyleSheet.create({
    container: {
        ...COMMON_STYLES.container,
    },
    contentContainer: {
        flex: 1,
        ...COMMON_STYLES.contentContainer,
        paddingHorizontal: 0,
        paddingBottom: 0,
    },
    searchButton: {
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    searchButtonText: {
        fontSize: FONTS.size.small,
        fontFamily: 'Roboto-Regular',
        color: '#007aff',
    },
    balanceCardWrapper: {
        marginHorizontal: 16,
        marginBottom: 16,
        position: 'relative',
    },
    balanceCard: {
        height: 100,
        borderRadius: 16,
        borderWidth: 1.108,
        borderColor: '#E5E7EB',
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 15,
        elevation: 5,
    },
    balanceBlurRight: {
        position: 'absolute',
        right: -10,
        top: -20,
        width: 170,
        height: 170,
        borderRadius: 37170400,
        opacity: 1,
    },
    balanceContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: SIZES.large,
        height: '100%',
    },
    balanceLeft: {
        flex: 1,
    },
    balanceLabel: {
        fontSize: 12,
        fontFamily: 'Roboto-Medium',
        color: '#6a7282',
        marginBottom: 4,
    },
    balanceAmountRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    balanceXplayIconContainer: {
        width: 28,
        height: 28,
        borderRadius: 17,
        borderWidth: 1.108,
        borderColor: '#e5e7eb',
        backgroundColor: '#ffffff',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    balanceXplayIcon: {
        width: 28,
        height: 28,
    },
    balanceXrunIconContainer: {
        backgroundColor: '#171c2d',
    },
    balanceAmount: {
        fontSize: 24,
        fontFamily: 'Roboto-SemiBold',
        color: '#343a5a',
        letterSpacing: -0.75,
    },
    xplayTag: {
        backgroundColor: '#00d4ff',
        paddingHorizontal: 8,
        paddingVertical: 5,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
        position: 'absolute',
        right: 14,
        top: 14,
        borderWidth: 1,
        borderColor: '#00d4ff',
    },
    xplayTagText: {
        fontSize: 12,
        fontFamily: 'Roboto-Bold',
        color: '#343a5a',
    },
    xrunTag: {
        backgroundColor: '#ffdc04',
        paddingHorizontal: 8,
        paddingVertical: 5,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
        position: 'absolute',
        right: 14,
        top: 14,
        borderWidth: 1,
        borderColor: '#ffdc04',
    },
    xrunTagText: {
        fontSize: 12,
        fontFamily: 'Roboto-Bold',
        color: '#1e3a5f',
    },
    segmented: {
        marginBottom: SIZES.large,
        marginHorizontal: 16,
    },
    productGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingHorizontal: 16,
        gap: 8,
        rowGap: 0,
    },
    productCard: {
        backgroundColor: '#ffffff',
        borderRadius: 14,
        borderWidth: 1.108,
        borderColor: '#e5e7eb',
        overflow: 'hidden',
        marginBottom: 8,
        minHeight: 255, 

    },
    productImageContainer: {
        width: '100%',
        height: 128,
        borderBottomWidth: 1.108,
        borderBottomColor: '#e2e2e2',
        backgroundColor: '#ffffff',
        overflow: 'hidden',
        position: 'relative',
    },
    productImageContainerEthereum: {
        backgroundColor: '#f2f2f2',
    },
    productImage: {
        width: '100%',
        height: '100%',
    },
    imageDescriptionOverlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        paddingHorizontal: 8,
        paddingVertical: 4,
    },
    imageDescriptionText: {
        fontSize: 10,
        fontFamily: 'Roboto-Regular',
        color: '#ffffff',
    },
    productInfo: {
        padding: 12,
        flex: 1,
        justifyContent: 'space-between',
    },
    productBrand: {
        fontSize: 12,
        fontFamily: 'Roboto-SemiBold',
        color: '#6a7282',
        marginBottom: 2,
    },
    productTitle: {
        fontSize: 14,
        fontFamily: 'Roboto-SemiBold',
        color: '#101828',
        marginBottom: 2,
        lineHeight: 18,
        height: 40, 
    },
    productFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 9,
        borderTopWidth: 1.108,
        borderTopColor: '#f3f4f6',
    },
    priceContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    xplayIconContainer: {
        width: 24,
        height: 24,
        borderRadius: 14,
        borderWidth: 1.108,
        borderColor: '#e5e7eb',
        backgroundColor: '#ffffff',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    xplayIcon: {
        width: 24,
        height: 24,
    },
    xrunIcon: {
        width: 24,
        height: 24,
    },
    priceText: {
        fontSize: 16,
        fontFamily: 'Roboto-Bold',
        color: '#343a5a',
        letterSpacing: -0.4,
    },
    purchaseButton: {
        backgroundColor: '#ffdc04',
        borderRadius: 5,
        paddingHorizontal: 16,
        paddingVertical: 7,
        marginLeft: 'auto',
    },
    purchaseButtonText: {
        fontSize: 12,
        fontFamily: 'Roboto-Bold',
        color: '#343a5a',
        textAlign: 'center',
    },
    loadingContainer: {
        paddingVertical: 40,
        alignItems: 'center',
        gap: 12,
    },
    loadingText: {
        fontSize: FONTS.size.msmall,
        fontFamily: 'Roboto-Regular',
        color: '#6a7282',
    },
    errorContainer: {
        paddingVertical: 40,
        paddingHorizontal: 16,
        alignItems: 'center',
    },
    errorText: {
        fontSize: FONTS.size.msmall,
        fontFamily: 'Roboto-Regular',
        color: '#b91c1c',
        textAlign: 'center',
    },
    emptyContainer: {
        paddingVertical: 40,
        alignItems: 'center',
        paddingHorizontal: 16,
    },
    emptyText: {
        fontSize: FONTS.size.msmall,
        fontFamily: 'Roboto-Regular',
        color: '#7d7e83',
    },
    taboolaContainer: {
        borderWidth: 2,
        borderColor: '#ededed',
        marginTop: 10,
    },
});
