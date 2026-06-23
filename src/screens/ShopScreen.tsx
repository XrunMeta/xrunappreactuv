import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Image, ScrollView, ImageSourcePropType, Dimensions, ActivityIndicator, RefreshControl, TextInput, Linking } from 'react-native';
import * as Location from 'expo-location';
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
import { getAyetPointsBalance, getXrunWalletBalance, getUserBalance, getXrunBuyableItems, fetchWalletData, getXRUNGopaxPrice } from '../services';
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

    isIak?: boolean;

    iakCategory?: string;
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

const FALLBACK_KRW_PER_XRUN = 70;

function giftishowToProductData(item: GiftishowProductItem, krwPerXrun: number, defaultImageUri?: string | null): ProductData {
    const rawPrice = typeof item.price === 'number' ? item.price : 0;

    const hasBackendXrun = typeof (item as any).priceKRW === 'number';
    let xrunPrice: number;
    if (hasBackendXrun) {
        xrunPrice = rawPrice; 
    } else {
        const divisor = typeof krwPerXrun === 'number' && krwPerXrun > 0 ? krwPerXrun : FALLBACK_KRW_PER_XRUN;
        xrunPrice = Math.ceil(rawPrice / divisor);
    }
    const fallbackImage = defaultImageUri ? { uri: defaultImageUri } : sampleCU;
    return {
        id: item.id ?? `g-${item.name ?? ''}`,

        brand: (item as any).brandName ?? (item as any).brand ?? '',
        title: item.name ?? '-',

        description: (item as any).description ?? undefined,
        price: xrunPrice,
        image: item.imageUrl ? { uri: item.imageUrl } : fallbackImage,
        isXplayShop: true,
        isIak: (item as any).source === 'iak',
        iakCategory: (item as any).iakCategory ?? (item as any).category ?? undefined,
    };
}

export const ShopScreen = () => {
    console.log('[ShopScreen] ShopScreen 컴포넌트 렌더링됨');
    const { t } = useTranslation();
    const { showAlert } = useAlertDialog();
    const { setSelectedShopItem, selectedShopItem } = useAppContext();
    const [tab, setTab] = useState<'xrunStore' | 'myItems'>('xrunStore');

    const [xplayProductList, setXplayProductList] = useState<GiftishowProductItem[]>([]);

    const [serverDefaultImage, setServerDefaultImage] = useState<string | null>(null);
    const [xplayLoading, setXplayLoading] = useState(false);
    const [xplayRefreshing, setXplayRefreshing] = useState(false);
    const [xplayError, setXplayError] = useState<string | null>(null);
    const [xplayBalance, setXplayBalance] = useState<number | null>(null);
    const [xplayBalanceLoading, setXplayBalanceLoading] = useState(false);
    const [xrunBalance, setXrunBalance] = useState<number | null>(null);
    const [xrunBalanceLoading, setXrunBalanceLoading] = useState(false);
    const [xrunStoreProducts, setXrunStoreProducts] = useState<ProductData[]>([]);
    const [xrunStoreLoading, setXrunStoreLoading] = useState(false);

    const [gopaxKrwPerXrun, setGopaxKrwPerXrun] = useState<number>(FALLBACK_KRW_PER_XRUN);

    const [shopCountry, setShopCountry] = useState<'KR' | 'ID' | null>(null);  
    const [gpsDenied, setGpsDenied] = useState<boolean>(false);

    const SHOP_DEV_EMAILS = ['oth-test@example.invalid', 'oth-staff@example.invalid', 'oth-user@example.invalid', 'oth-user@example.invalid', 'oth-user@example.invalid', 'oth-user@example.invalid', 'oth-user@example.invalid', 'oth-user@example.invalid', 'oth-user@example.invalid', 'oth-user@example.invalid', 'oth-user@example.invalid', 'oth-user@example.invalid', 'oth-user@example.invalid', 'oth-user@example.invalid', 'oth-user@example.invalid', 'oth-user@example.invalid', 'oth-user@example.invalid', 'oth-user@example.invalid'];
    const [isDevAccount, setIsDevAccount] = useState<boolean>(false);
    const [forceCountry, setForceCountry] = useState<'AUTO' | 'KR' | 'ID'>('AUTO');
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
            console.log('[ShopScreen] fetchWalletData(currency=18) 호출 member=', member);
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

    useEffect(() => {
        (async () => {
            try {
                const ud = await AsyncStorage.getItem('userData');
                const email = ud ? (JSON.parse(ud)?.email ?? '').toLowerCase().trim() : '';
                if (email && SHOP_DEV_EMAILS.includes(email)) {
                    setIsDevAccount(true);
                    const saved = await AsyncStorage.getItem('devShopForceCountry');
                    if (saved === 'KR' || saved === 'ID') {
                        setForceCountry(saved);

                        setShopCountry(saved);
                    }
                }
            } catch {  }
        })();

    }, []);

    const GPS_CACHE_KEY = 'shopGpsCountry';
    const GPS_CACHE_TTL = 30 * 60 * 1000; 
    const detectCountry = useCallback(async () => {
        if (forceCountry !== 'AUTO') {
            setShopCountry(forceCountry);
            setGpsDenied(false);
            return;
        }

        try {
            const cached = await AsyncStorage.getItem(GPS_CACHE_KEY);
            if (cached) {
                const parsed = JSON.parse(cached);
                if (parsed?.country && parsed?.ts && (Date.now() - parsed.ts) < GPS_CACHE_TTL) {
                    setShopCountry(parsed.country === 'ID' ? 'ID' : 'KR');
                    setGpsDenied(false);
                    console.log('[ShopScreen] GPS country cache hit:', parsed.country, '(age', Math.round((Date.now() - parsed.ts)/1000), 's)');
                    return;
                }
            }
        } catch {  }
        try {
            const perm = await Location.getForegroundPermissionsAsync();
            let granted = perm.granted;
            if (!granted) {
                const req = await Location.requestForegroundPermissionsAsync();
                granted = req.granted;
            }
            if (!granted) {
                setGpsDenied(true);
                setShopCountry('KR');
                return;
            }
            setGpsDenied(false);
            const pos = await Location.getLastKnownPositionAsync({ maxAge: 60_000, requiredAccuracy: 1000 })
                ?? await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
            if (!pos?.coords) { setShopCountry('KR'); return; }
            const geo = await Location.reverseGeocodeAsync({ latitude: pos.coords.latitude, longitude: pos.coords.longitude }).catch(() => []);
            const isoCountry = (geo?.[0]?.isoCountryCode ?? '').toUpperCase();
            const finalCountry = isoCountry === 'ID' ? 'ID' : 'KR';
            setShopCountry(finalCountry);
            console.log('[ShopScreen] GPS country detected:', isoCountry, '→', finalCountry);

            try {
                await AsyncStorage.setItem(GPS_CACHE_KEY, JSON.stringify({ country: finalCountry, ts: Date.now() }));
            } catch {  }
        } catch (e) {
            console.warn('[ShopScreen] GPS detect failed, fallback KR:', e);
            setGpsDenied(true);
            setShopCountry('KR');
        }
    }, [forceCountry]);

    const loadXplayProducts = useCallback(async () => {
        setXplayError(null);

        const endpoint = shopCountry === 'ID' ? '/getIakActiveGoods' : '/getGiftishowActiveGoods';
        try {
            const axiosInstance = (await import('../services')).createAxiosInstance();
            const res = await axiosInstance.post(endpoint, {});
            const raw = Array.isArray(res.data?.data?.list) ? res.data.data.list as any[] : [];

            setServerDefaultImage(typeof res.data?.data?.default_image === 'string' ? res.data.data.default_image : null);

            const list = raw.map((g: any) => ({
                id: g.goods_code,
                name: g.goods_name,
                brand: g.brand_name,
                price: Number(g.xplay_points ?? 0),    
                priceKRW: Number(g.real_price ?? 0),
                imageUrl: g.goods_image,

                source: shopCountry === 'ID' ? 'iak' : 'kr_giftishow',

                iakCategory: shopCountry === 'ID' ? (g.category ?? null) : null,

                description: typeof g.description === 'string' ? g.description : undefined,
            }));
            setXplayProductList(list as any);
            console.log('[Xplay Shop] DB 활성 상품:', list.length, '건');
            if (list.length === 0) setXplayError('등록된 기프티콘 상품이 없습니다.');
        } catch (e) {
            console.warn('[Xplay Shop] 백엔드 호출 실패, 비즈 API fallback:', e);

            try {
                const bizRes = await getProductList({ start: 1, size: 50 });
                const list = Array.isArray(bizRes.list) ? bizRes.list : [];
                setXplayProductList(list);
                if (list.length === 0 && bizRes.resultMsg) setXplayError(bizRes.resultMsg);
            } catch (e2) {
                setXplayError(e2 instanceof Error ? e2.message : '기프티콘 목록을 불러오지 못했습니다.');
                setXplayProductList([]);
            }
        }
    }, [shopCountry]);

    const loadGopaxKrwPerXrun = useCallback(async () => {
        try {
            const cached = await AsyncStorage.getItem('xrungopaxprice');
            if (cached) {
                const parsed = JSON.parse(cached) as { data?: { gopaxPrice?: number } };
                const p = parsed?.data?.gopaxPrice;
                if (typeof p === 'number' && p > 0) setGopaxKrwPerXrun(p);
            }
        } catch {

        }
        try {
            const result = await getXRUNGopaxPrice(navigate);
            const p = result?.data?.gopaxPrice;
            if (typeof p === 'number' && p > 0) {
                setGopaxKrwPerXrun(p);
                await AsyncStorage.setItem('xrungopaxprice', JSON.stringify(result));
                return;
            }
        } catch (e) {
            console.warn('[ShopScreen] 고팍스 XRUN 가격 API 실패:', e);
        }
        try {
            const s = await AsyncStorage.getItem('xrungopaxprice');
            if (s) {
                const parsed = JSON.parse(s) as { data?: { gopaxPrice?: number } };
                const p = parsed?.data?.gopaxPrice;
                if (typeof p === 'number' && p > 0) {
                    setGopaxKrwPerXrun(p);
                    return;
                }
            }
        } catch {

        }
    }, [navigate]);

    useEffect(() => {
        if (tab === 'xrunStore') {
            void detectCountry();
        }
    }, [tab, detectCountry]);

    useEffect(() => {
        if (tab === 'xrunStore' && shopCountry !== null) {
            setXplayLoading(true);
            void loadGopaxKrwPerXrun();
            loadXplayProducts().finally(() => setXplayLoading(false));
        }
    }, [tab, shopCountry, loadXplayProducts, loadGopaxKrwPerXrun]);

    const onXplayRefresh = useCallback(() => {
        setXplayRefreshing(true);
        Promise.all([loadXplayProducts(), loadXplayBalance(), loadGopaxKrwPerXrun()]).finally(() => setXplayRefreshing(false));
    }, [loadXplayProducts, loadXplayBalance, loadGopaxKrwPerXrun]);

    useEffect(() => {
        if (selectedShopItem && (selectedShopItem as any).shopTab) {
            setTab('xrunStore');
            setSelectedShopItem(undefined);
        }
    }, [selectedShopItem, setSelectedShopItem]);
    const [showSearchBar, setShowSearchBar] = useState<boolean>(false);
    const [searchQuery, setSearchQuery] = useState<string>('');

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

    const xplayProductsAsCards = useMemo(
        () => xplayProductList.map((item) => giftishowToProductData(item, gopaxKrwPerXrun, serverDefaultImage)),
        [xplayProductList, gopaxKrwPerXrun, serverDefaultImage],
    );

    const filterByQuery = useCallback((list: ProductData[]): ProductData[] => {
        const q = searchQuery.trim().toLowerCase();
        if (!q) return list;
        return list.filter((p) => {
            const hay = `${p.brand || ''} ${p.title || ''} ${p.description || ''}`.toLowerCase();
            return hay.includes(q);
        });
    }, [searchQuery]);

    const filteredXrunStoreProducts = useMemo(() => filterByQuery(xrunStoreProducts), [filterByQuery, xrunStoreProducts]);
    const filteredXplayProducts = useMemo(() => filterByQuery(xplayProductsAsCards), [filterByQuery, xplayProductsAsCards]);
    const hasAnyResult = filteredXrunStoreProducts.length + filteredXplayProducts.length > 0;

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

            isIak: product.isIak ?? false,
            iakCategory: product.iakCategory ?? null,
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
                    <Text style={styles.productBrand}>{product.brand || (product.isIak ? t('screens.shop.iakBrand') : t('screens.shop.giftBrand'))}</Text>
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
                        onPress={() => {
                            const next = !showSearchBar;
                            setShowSearchBar(next);
                            if (!next) setSearchQuery('');
                        }}
                        activeOpacity={0.7}
                        style={styles.searchButton}
                    >
                        <Feather name={showSearchBar ? 'x' : 'search'} size={20} color="#007aff" />
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
                {showSearchBar && (
                    <View style={styles.searchBar}>
                        <Feather name="search" size={18} color="#0296f2" />
                        <TextInput
                            placeholder="Search"
                            placeholderTextColor="#bcbec4"
                            style={styles.searchInput}
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                            autoCapitalize="none"
                            autoCorrect={false}
                            returnKeyType="search"
                        />
                    </View>
                )}

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
                            {}
                            {isDevAccount && (
                                <View style={styles.devCountryRow}>
                                    <Text style={styles.devCountryLabel}>DEV 국가:</Text>
                                    {(['AUTO', 'KR', 'ID'] as const).map((c) => (
                                        <TouchableOpacity
                                            key={c}
                                            onPress={async () => {
                                                setForceCountry(c);
                                                if (c === 'AUTO') {
                                                    await AsyncStorage.removeItem('devShopForceCountry');

                                                    await AsyncStorage.removeItem('shopGpsCountry');
                                                    setShopCountry(null); 
                                                } else {
                                                    await AsyncStorage.setItem('devShopForceCountry', c);

                                                    setShopCountry(c);
                                                }
                                            }}
                                            style={[styles.devCountryChip, forceCountry === c && styles.devCountryChipActive]}
                                        >
                                            <Text style={[styles.devCountryChipText, forceCountry === c && styles.devCountryChipTextActive]}>
                                                {c === 'AUTO' ? '🌐 GPS' : c === 'KR' ? '🇰🇷 KR' : '🇮🇩 ID'}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                    <Text style={styles.devCountryCurrent}>현재: {shopCountry ?? '...'}</Text>
                                </View>
                            )}

                            {}
                            {gpsDenied && (
                                <TouchableOpacity
                                    onPress={async () => {
                                        const req = await Location.requestForegroundPermissionsAsync();
                                        if (req.granted) {
                                            setShopCountry(null); 
                                        } else {

                                            Linking.openSettings();
                                        }
                                    }}
                                    activeOpacity={0.8}
                                    style={styles.gpsBanner}
                                >
                                    <Feather name="map-pin" size={16} color="#92400e" />
                                    <Text style={styles.gpsBannerText}>
                                        {t('screens.shop.iak.gpsBanner')}
                                    </Text>
                                </TouchableOpacity>
                            )}
                            {xplayLoading && !xplayRefreshing ? (
                                <View style={styles.loadingContainer}>
                                    <ActivityIndicator size="small" color={COLORS.buttonPrimary} />
                                    <Text style={styles.loadingText}>{t('screens.shop.loadingGiftList')}</Text>
                                </View>
                            ) : xplayError ? (
                                <View style={styles.errorContainer}>
                                    <Text style={styles.errorText}>{xplayError}</Text>
                                </View>
                            ) : searchQuery.trim() && !hasAnyResult ? (
                                <View style={styles.errorContainer}>
                                    <Text style={styles.noResultText}>"{searchQuery.trim()}"에 대한 검색 결과가 없습니다.</Text>
                                </View>
                            ) : (
                                <View style={styles.productGrid}>
                                    {filteredXrunStoreProducts.map((product) => renderProductCard(product, false))}
                                    {filteredXplayProducts.map((product) => renderProductCard(product, false))}
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
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 14,
        borderWidth: 1,
        borderColor: '#ededed',
        backgroundColor: '#ffffff',
        paddingHorizontal: 14,
        paddingVertical: 6,
        marginHorizontal: 16,
        marginBottom: 20,
        shadowColor: '#182b78',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 3.84,
        elevation: 5,
    },
    searchInput: {
        flex: 1,
        marginLeft: 8,
        fontSize: FONTS.size.msmall,
        fontFamily: 'Roboto-Regular',
        color: '#1a2e35',
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

        width: '80%',
        height: '80%',
        alignSelf: 'center',
        marginTop: '10%',
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
    devCountryRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginHorizontal: 16,
        marginTop: 8,
        paddingVertical: 6,
        paddingHorizontal: 10,
        backgroundColor: '#1f2937',
        borderRadius: 6,
        flexWrap: 'wrap',
    },
    devCountryLabel: {
        fontSize: 11,
        color: '#9ca3af',
        fontFamily: 'Roboto-Bold',
    },
    devCountryChip: {
        paddingVertical: 3,
        paddingHorizontal: 8,
        borderRadius: 4,
        backgroundColor: '#374151',
    },
    devCountryChipActive: {
        backgroundColor: '#3b82f6',
    },
    devCountryChipText: {
        fontSize: 11,
        color: '#d1d5db',
        fontFamily: 'Roboto-Medium',
    },
    devCountryChipTextActive: {
        color: '#fff',
        fontFamily: 'Roboto-Bold',
    },
    devCountryCurrent: {
        marginLeft: 'auto',
        fontSize: 10,
        color: '#fbbf24',
        fontFamily: 'Roboto-Regular',
    },
    gpsBanner: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginHorizontal: 16,
        marginTop: 8,
        marginBottom: 12,
        paddingVertical: 10,
        paddingHorizontal: 12,
        borderRadius: 8,
        backgroundColor: '#fef3c7',
        borderWidth: 1,
        borderColor: '#fbbf24',
    },
    gpsBannerText: {
        flex: 1,
        fontSize: FONTS.size.msmall,
        fontFamily: 'Roboto-Regular',
        color: '#92400e',
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
    noResultText: {
        fontSize: FONTS.size.msmall,
        fontFamily: 'Roboto-Regular',
        color: '#8e9bae',
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
