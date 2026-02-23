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
import { getAyetPointsBalance } from '../services';

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
        description: '최소 30,000 Xplay 이상 교환가능',
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

const xrunStoreProducts: ProductData[] = [
    {
        id: 'xrun-1',
        brand: 'XRUN',
        title: 'Polygon 전송티켓',
        price: 10,
        image: xrunHorizontalLogo,
    },
];

function giftishowToProductData(item: GiftishowProductItem): ProductData {
    return {
        id: item.id ?? `g-${item.name ?? ''}`,
        brand: (item as any).brandName ?? '기프티콘',
        title: item.name ?? '-',
        price: typeof item.price === 'number' ? item.price : 0,
        image: item.imageUrl ? { uri: item.imageUrl } : sampleCU,
    };
}

export const ShopScreen = () => {
    console.log('[ShopScreen] ShopScreen 컴포넌트 렌더링됨');
    const { t } = useTranslation();
    const { showAlert } = useAlertDialog();
    const { setSelectedShopItem, selectedShopItem } = useAppContext();
    const [tab, setTab] = useState<'xplayShop' | 'xrunStore' | 'myItems'>('xplayShop');

    const [xplayProductList, setXplayProductList] = useState<GiftishowProductItem[]>([]);
    const [xplayLoading, setXplayLoading] = useState(false);
    const [xplayRefreshing, setXplayRefreshing] = useState(false);
    const [xplayError, setXplayError] = useState<string | null>(null);
    const [xplayBalance, setXplayBalance] = useState<number | null>(null);
    const [xplayBalanceLoading, setXplayBalanceLoading] = useState(false);
    const [xrunBalance, setXrunBalance] = useState<number>(0);
    const { navigate } = useAppNavigation();

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
            setXplayBalanceLoading(true);
            const result = await getAyetPointsBalance(member, navigate);
            setXplayBalance(result.total_ayet_points ?? 0);
        } catch {
            setXplayBalance(0);
        } finally {
            setXplayBalanceLoading(false);
        }
    }, [navigate]);

    const loadXplayProducts = useCallback(async () => {
        setXplayError(null);
        try {
            const res = await getProductList({ start: 1, size: 50 });
            const list = Array.isArray(res.list) ? res.list : [];
            setXplayProductList(list);
            if (list.length === 0 && res.resultMsg) setXplayError(res.resultMsg);
        } catch (e) {
            setXplayError(e instanceof Error ? e.message : '기프티콘 목록을 불러오지 못했습니다.');
            setXplayProductList([]);
        }
    }, []);

    useEffect(() => {
        if (tab === 'xplayShop') {
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
            const shopTab = (selectedShopItem as any).shopTab;
            if (shopTab === 'xplayShop' || shopTab === 'xrunStore') {
                setTab(shopTab);

                setSelectedShopItem(undefined);
            }
        }
    }, [selectedShopItem, setSelectedShopItem]);
    const [showSearchBar, setShowSearchBar] = useState<boolean>(false);

    useEffect(() => {
        if (tab === 'xplayShop') {
            loadXplayBalance();
        }
    }, [tab, loadXplayBalance]);

    const screenWidth = Dimensions.get('window').width;
    const productCardWidth = useMemo(() => {
        const paddingHorizontal = 16;
        const gap = 8;
        const availableWidth = screenWidth - paddingHorizontal * 2;
        return (availableWidth - gap) / 2;
    }, [screenWidth]);

    const segmentedOptions = useMemo(
        () => [
            { label: 'Xplay Shop', value: 'xplayShop' },
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
        };
        setSelectedShopItem(shopItem as any);
        navigate(ROUTES.shopProductDetail);
    };

    const handlePurchase = (product: ProductData) => {
        showAlert('구매', `${product.title}을(를) 구매하시겠습니까?`, [
            { text: '취소' },
            { text: '구매', onPress: () => console.log('구매:', product.id) },
        ]);
    };

    const renderProductCard = (product: ProductData, showPurchaseButton: boolean = false) => {
        const isEthereum = product.brand === 'Ethereum' && product.description;
        const isXrun = product.brand === 'XRUN';

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
                    <Image source={product.image} style={styles.productImage} resizeMode="contain" />
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
                                    source={isXrun ? xrunRoundLogo : xplaySymbol}
                                    style={isXrun ? styles.xrunIcon : styles.xplayIcon}
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
                                <Text style={styles.purchaseButtonText}>구매</Text>
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
                {(tab === 'xplayShop' || tab === 'xrunStore') && (
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
                                    <Text style={styles.balanceLabel}>내 잔액</Text>
                                    <View style={styles.balanceAmountRow}>
                                        <View style={[
                                            styles.balanceXplayIconContainer,
                                            tab === 'xrunStore' && styles.balanceXrunIconContainer
                                        ]}>
                                            <Image
                                                source={tab === 'xrunStore' ? xrunRoundLogo : xplaySymbol}
                                                style={styles.balanceXplayIcon}
                                                resizeMode="contain"
                                            />
                                        </View>
                                        {tab === 'xplayShop' ? (
                                            xplayBalanceLoading ? (
                                                <ActivityIndicator size="small" color="#343a5a" style={{ marginLeft: 8 }} />
                                            ) : (
                                                <Text style={styles.balanceAmount}>
                                                    {(xplayBalance ?? 0).toLocaleString()}
                                                </Text>
                                            )
                                        ) : (
                                            <Text style={styles.balanceAmount}>{xrunBalance.toLocaleString()}</Text>
                                        )}
                                    </View>
                                </View>
                                {tab === 'xplayShop' ? (
                                    <View style={styles.xplayTag}>
                                        <Text style={styles.xplayTagText}>Xplay</Text>
                                    </View>
                                ) : (
                                    <View style={styles.xrunTag}>
                                        <Text style={styles.xrunTagText}>XRUN</Text>
                                    </View>
                                )}
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
                        tab === 'xplayShop' ? (
                            <RefreshControl refreshing={xplayRefreshing} onRefresh={onXplayRefresh} colors={[COLORS.buttonPrimary]} />
                        ) : undefined
                    }
                >
                    {tab === 'xplayShop' ? (
                        <>
                            {xplayLoading && !xplayRefreshing ? (
                                <View style={styles.loadingContainer}>
                                    <ActivityIndicator size="small" color={COLORS.buttonPrimary} />
                                    <Text style={styles.loadingText}>기프티콘 목록 불러오는 중...</Text>
                                </View>
                            ) : xplayError ? (
                                <View style={styles.errorContainer}>
                                    <Text style={styles.errorText}>{xplayError}</Text>
                                </View>
                            ) : (
                                <View style={styles.productGrid}>
                                    {xplayProductList.map((item) =>
                                        renderProductCard(giftishowToProductData(item), false)
                                    )}
                                </View>
                            )}
                        </>
                    ) : tab === 'xrunStore' ? (
                        <View style={styles.productGrid}>
                            {xrunStoreProducts.map((product) => renderProductCard(product, false))}
                        </View>
                    ) : (
                        <View style={styles.emptyContainer}>
                            <Text style={styles.emptyText}>My Items는 별도 화면에서 확인하실 수 있습니다.</Text>
                        </View>
                    )}
                </SafeScrollView>
            </View>
            {}
            <View style={styles.taboolaContainer}>
                <TaboolaBanner placementType="shop" />
            </View>
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
