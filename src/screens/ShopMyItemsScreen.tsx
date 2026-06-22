import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { View, StyleSheet, TextInput, Text, TouchableOpacity, Image, ImageSourcePropType, ActivityIndicator, RefreshControl } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeScrollView, SafeView } from '../components';
import { StatusBar } from 'expo-status-bar';
import { Feather } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { Header, SegmentedControl, TaboolaBanner } from '../components';
import { useAppNavigation, ROUTES } from '../navigation';
import { useAppContext } from '../context';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, COMMON_STYLES, SIZES, FONTS } from '../constants';
import { getMyGiftishowCoupons, getXrunPurchasedItems, getMyIakTxns } from '../services';
import type { MyIakTxnItem } from '../services';
import type { MyGiftishowCouponItem } from '../types';
import type { PurchasedItemData } from '../types';

const defaultCouponImage = require('../../assets/sample_cu.png');

interface MyItemData {
    id: string;
    brand: string;
    title: string;
    image: ImageSourcePropType;
    status: 'available' | 'used' | 'pending';
    purchaseDate: string;
    tr_id?: string;

    type: 'xrun' | 'giftishow' | 'iak';  

    iakSn?: string;

    iakCustomerId?: string;
    storage?: string;
    txID?: string;
    item?: number;

    couponImgUrl?: string;

    sortKey: number;

    isTransferTicket?: boolean;
}

function mapPinStatusToAvailable(pin_status?: string): 'available' | 'used' | 'pending' {
  if (pin_status === '01') return 'available';
  if (pin_status === '99') return 'pending';
  return 'used';
}

function isCancelledGiftishowCoupon(coupon: MyGiftishowCouponItem): boolean {
  const cancelledStatusSet = new Set(['07', '12', '16', '22']); 
  if (coupon.pin_status && cancelledStatusSet.has(String(coupon.pin_status))) return true;

  const anyCoupon = coupon as any;
  const statusName = String(
    anyCoupon.pin_status_nm ??
    anyCoupon.pinStatusNm ??
    anyCoupon.pin_status_name ??
    ''
  );
  return /취소/i.test(statusName);
}

function formatPurchaseDate(raw?: string): string {
  if (!raw) return '-';
  const s = String(raw).replace(/-/g, '').slice(0, 8);
  if (s.length === 8) return `${s.slice(0, 4)}.${s.slice(4, 6)}.${s.slice(6, 8)}`;
  return raw;
}

function couponToMyItemData(c: MyGiftishowCouponItem): MyItemData {

  const candidates = [c.image_url, c.coupon_img_url];
  const validUrl = candidates.find((u) => typeof u === 'string' && /^https?:\/\//i.test(u));
  if (!validUrl) {
    console.log('[MyItems] 기본 이미지 fallback:', { tr_id: c.tr_id, image_url: c.image_url, coupon_img_url: c.coupon_img_url });
  }
  const image: ImageSourcePropType = validUrl ? { uri: validUrl } : defaultCouponImage;

  const trDigits = (c.tr_id ?? '').match(/\d{8}_?\d{0,6}/)?.[0]?.replace(/\D/g, '') ?? '';
  const pdDigits = (c.purchase_date ?? '').replace(/\D/g, '');
  const sortKey = Number(trDigits || pdDigits || 0);
  return {
    id: c.tr_id,
    tr_id: c.tr_id,
    brand: c.brand_name ?? '기프티콘',
    title: c.goods_name ?? '-',
    image,
    status: mapPinStatusToAvailable(c.pin_status),
    purchaseDate: formatPurchaseDate(c.purchase_date),
    type: 'giftishow',
    couponImgUrl: c.coupon_img_url || undefined,
    sortKey,
  };
}

function xrunPurchasedToMyItemData(p: PurchasedItemData, index: number): MyItemData {

  const rawImg = (p as any).image || (p as any).thumbnail || (p as any).icon;
  const imgUri = rawImg && typeof rawImg === 'string' && /^https?:\/\//i.test(rawImg) ? rawImg : null;
  if (!imgUri) {
    console.log('[MyItems-XRUN] 기본 이미지 fallback:', { storage: p.storage, txID: p.txID, title: p.title, image: (p as any).image, thumbnail: (p as any).thumbnail, icon: (p as any).icon });
  }
  const image: ImageSourcePropType = imgUri ? { uri: imgUri } : defaultCouponImage;
  const id = p.storage ? `xrun_${p.storage}_${index}` : `xrun_${p.txID}_${index}`;
  const dtDigits = String(p.datetime ?? '').replace(/\D/g, '').slice(0, 14);
  const fallback = Number(p.storage ?? 0) || 0;
  const sortKey = dtDigits ? Number(dtDigits) : fallback;
  const itemType = Number((p as any).type ?? 0);
  const isTransferTicket = itemType === 10151;

  const rawDate = String(p.datetime ?? '').replace('T', ' ').slice(0, 10);
  const formattedDate = /^\d{4}-\d{2}-\d{2}$/.test(rawDate) ? rawDate.replace(/-/g, '.') : '-';
  return {
    id,
    brand: isTransferTicket ? 'XRUN' : 'SHOP', 
    title: p.title ?? '-',
    image,
    status: p.status === 10306 ? 'available' : 'used',
    purchaseDate: formattedDate,
    type: 'xrun',
    isTransferTicket,
    storage: p.storage,
    txID: p.txID,
    item: p.item,
    sortKey,

    description: (p as any).description ?? '',
    paidXrun: (p as any).paidXrun ?? null,
    priceXrun: (p as any).priceXrun ?? null,
  } as any;
}

export const ShopMyItemsScreen = () => {
    const { navigate, currentScreen } = useAppNavigation();
    const { t } = useTranslation();
    const { setSelectedShopItem } = useAppContext();
    const [items, setItems] = useState<MyItemData[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [currentMember, setCurrentMember] = useState<string>('');
    const [showSearchBar, setShowSearchBar] = useState<boolean>(false);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [failedImageIds, setFailedImageIds] = useState<Set<string>>(new Set());

    const loadCoupons = useCallback(async () => {
        try {
            const userDataStr = await AsyncStorage.getItem('userData');
            if (!userDataStr) {
                setItems([]);
                return;
            }
            const userData = JSON.parse(userDataStr);
            const member = userData?.member;
            if (member == null) {
                setItems([]);
                return;
            }
            const memberStr = String(member);
            setCurrentMember(memberStr);
            const [giftishowRes, xrunRes, iakRes] = await Promise.all([
                getMyGiftishowCoupons(memberStr, navigate).catch(() => ({ status: 'error' as const, data: [] })),
                getXrunPurchasedItems(memberStr, navigate).catch(() => ({ status: 'error' as const, data: [] })),
                getMyIakTxns(memberStr, navigate).catch(() => ({ status: 'error' as const, data: [] as MyIakTxnItem[] })),
            ]);
            const giftishowList: MyItemData[] =
                giftishowRes?.status === 'success' && Array.isArray(giftishowRes.data)
                    ? giftishowRes.data
                        .filter((coupon) => !isCancelledGiftishowCoupon(coupon))
                        .map(couponToMyItemData)
                    : [];
            const xrunList: MyItemData[] =
                xrunRes?.status === 'success' && Array.isArray(xrunRes.data)
                    ? xrunRes.data.map((p, i) => xrunPurchasedToMyItemData(p, i))
                    : [];

            const iakList: MyItemData[] =
                iakRes?.status === 'success' && Array.isArray(iakRes.data)
                    ? iakRes.data.map((t) => ({
                        id: `iak-${t.ref_id}`,
                        brand: 'IAK 충전',
                        title: t.product_name || t.product_code,
                        image: defaultCouponImage,
                        status: t.status === 'success' ? 'available'
                              : t.status === 'pending' ? 'pending'
                              : 'used',  
                        purchaseDate: String(t.created_at ?? '').slice(0, 10).replace(/-/g, '.'),
                        tr_id: t.ref_id,
                        type: 'iak' as const,
                        iakSn: t.iak_sn ?? undefined,
                        iakCustomerId: t.customer_id,
                        sortKey: new Date(String(t.created_at)).getTime() || 0,
                    } as MyItemData))
                    : [];
            const merged = [...xrunList, ...giftishowList, ...iakList].sort((a, b) => b.sortKey - a.sortKey);
            setItems(merged);
        } catch {
            setItems([]);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, [navigate]);

    useEffect(() => {
        setLoading(true);
        loadCoupons();
    }, [loadCoupons]);

    useEffect(() => {
        if (currentScreen !== ROUTES.shopMyItems) return;
        loadCoupons();
    }, [currentScreen, loadCoupons]);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        loadCoupons();
    }, [loadCoupons]);

    const segmentedOptions = useMemo(
        () => [
            { label: 'XRUN Store', value: 'xrunStore' },
            { label: 'My Items', value: 'myItems' },
        ] as const,
        [],
    );

    const handleTabChange = (value: typeof segmentedOptions[number]['value']) => {
        if (value === 'xrunStore') {

            setSelectedShopItem({
                id: '',
                title: '',
                priceLabel: '',
                image: require('../../assets/xrun-horizontal-logo.png'),
                shopTab: value 
            } as any);
            navigate(ROUTES.shop);
        }
    };

    const handleUseItem = (item: MyItemData) => {

        if (item.type === 'iak') {
            const lines: string[] = [];
            if (item.iakCustomerId) lines.push(t('screens.shop.iak.phoneLabelLine', { phone: item.iakCustomerId }));
            if (item.iakSn) lines.push(t('screens.shop.iak.snInfoLine', { sn: item.iakSn }));
            if (item.status === 'pending') lines.push('\n' + t('screens.shop.iak.pendingNote'));
            else if (item.status === 'used') lines.push('\n' + t('screens.shop.iak.failedNote'));
            else lines.push('\n' + t('screens.shop.iak.successNote'));
            const msg = lines.join('\n');
            (require('react-native').Alert.alert)(item.title, msg, [{ text: t('screens.shop.iak.ok') }]);
            return;
        }
        if (item.type === 'xrun') {
            const shopItem = {
                id: item.id,
                title: item.title,
                priceLabel: '',
                image: item.image,
                detailTotal: '',
                brand: item.brand,
                storage: item.storage,
                txID: item.txID,
                item: item.item,
            };
            setSelectedShopItem(shopItem as any);
            navigate(ROUTES.shopTicketDetail);
            return;
        }
        const shopItem = {
            id: item.id,
            title: item.title,
            priceLabel: '',
            image: item.image,
            detailTotal: '',
            brand: item.brand,
            barcodeNumber: '',
            tr_id: item.tr_id ?? item.id,
            trId: item.tr_id ?? item.id,
            memberId: currentMember,
            couponImgUrl: item.couponImgUrl,
        };
        setSelectedShopItem(shopItem as any);
        navigate(ROUTES.shopMyTicketDetail);
    };

    const filteredItems = useMemo(() => {
        if (!searchQuery.trim()) return items;
        const query = searchQuery.toLowerCase().trim();
        return items.filter((item) => {
            const title = item.title.toLowerCase();
            const brand = item.brand.toLowerCase();
            return title.includes(query) || brand.includes(query);
        });
    }, [items, searchQuery]);

    const stats = useMemo(() => {
        const available = filteredItems.filter((item) => item.status === 'available').length;
        const used = filteredItems.filter((item) => item.status === 'used').length;
        return { available, used };
    }, [filteredItems]);

    const renderItemCard = (item: MyItemData) => {
        const isAvailable = item.status === 'available';
        const isPending = item.status === 'pending';
        const isRemoteImage = item.image && typeof item.image === 'object' && 'uri' in (item.image as any);
        const displayImage = isRemoteImage && failedImageIds.has(item.id) ? defaultCouponImage : item.image;

        return (
            <View key={item.id} style={styles.itemCard}>
                <View style={styles.itemImageContainer}>
                    <Image
                        source={displayImage}
                        style={styles.itemImage}
                        resizeMode="contain"
                        onError={(e) => {
                            if (isRemoteImage) {
                                console.log(`[MyItems] 이미지 로드 실패 → 기본 이미지로 대체:`, item.id, (item.image as any)?.uri, e.nativeEvent);
                                setFailedImageIds((prev) => new Set(prev).add(item.id));
                            }
                        }}
                    />
                </View>
                <View style={styles.itemContent}>
                    <View style={styles.itemHeader}>
                        <View style={styles.itemInfo}>
                            <View style={styles.itemTitleRow}>
                                <Text style={styles.itemBrand}>{item.brand === 'SHOP' ? t('screens.shop.shopBrand') : item.brand}</Text>
                                <View style={[styles.statusTag, isAvailable ? styles.statusTagAvailable : isPending ? styles.statusTagPending : styles.statusTagUsed]}>
                                    <Text style={[styles.statusTagText, isAvailable ? styles.statusTagTextAvailable : isPending ? styles.statusTagTextPending : styles.statusTagTextUsed]}>
                                        {isAvailable ? t('screens.shop.availableShort') : isPending ? t('screens.shop.pendingShort') : t('screens.shop.usedShort')}
                                    </Text>
                                </View>
                            </View>
                            <Text style={styles.itemTitle} numberOfLines={2}>
                                {item.title}
                            </Text>
                        </View>
                    </View>
                    <Text style={styles.purchaseDate}>{t('screens.shop.purchaseDateLabel')}: {item.purchaseDate}</Text>
                    {isAvailable && item.type === 'xrun' && item.isTransferTicket === false ? (

                        <TouchableOpacity
                            style={[styles.useButton, { backgroundColor: '#E5E7EB' }]}
                            activeOpacity={0.8}
                            onPress={() => {

                                const shopItem = {
                                    id: String(item.item ?? item.id),
                                    title: item.title,
                                    priceLabel: '',
                                    image: item.image,
                                    detailTotal: '',
                                    brand: item.brand,
                                    isXrun: true,
                                    storage: item.storage,
                                    txID: item.txID,
                                    item: item.item,
                                    isPurchased: true,                        
                                    description: (item as any).description,
                                    paidXrun: (item as any).paidXrun,
                                    priceXrun: (item as any).priceXrun,       
                                    purchaseDate: item.purchaseDate,
                                };
                                setSelectedShopItem(shopItem as any);
                                navigate(ROUTES.shopProductDetail);
                            }}
                        >
                            <Text style={[styles.useButtonText, { color: '#374151' }]}>{t('screens.shop.thankYou')}</Text>
                        </TouchableOpacity>
                    ) : isAvailable ? (
                        <TouchableOpacity
                            style={styles.useButton}
                            onPress={() => handleUseItem(item)}
                            activeOpacity={0.8}
                        >
                            <Text style={styles.useButtonText}>{t('screens.shop.useButton')}</Text>
                        </TouchableOpacity>
                    ) : null}
                </View>
            </View>
        );
    };

    return (
        <SafeView style={styles.container} backgroundColor="#F8FAFC">
            <StatusBar style="dark" />
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
                <View style={styles.statsCardWrapper}>
                    <LinearGradient
                        colors={['#FFFFFF', '#F9FAFB', '#FFFFFF']}
                        locations={[0, 0.5, 1]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.statsCard}
                    >
                        <View style={styles.statsContent}>
                            <View style={styles.statItem}>
                                <Text style={styles.statLabel}>{t('screens.shop.available')}</Text>
                                <Text style={styles.statValue}>{stats.available}</Text>
                            </View>
                            <View style={styles.statDivider} />
                            <View style={styles.statItem}>
                                <Text style={styles.statLabel}>{t('screens.shop.used')}</Text>
                                <Text style={[styles.statValue, styles.statValueUsed]}>{stats.used}</Text>
                            </View>
                        </View>
                    </LinearGradient>
                </View>

                {}
                <SegmentedControl
                    options={segmentedOptions}
                    value="myItems"
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
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[COLORS.buttonPrimary]} />
                    }
                >
                    {loading ? (
                        <View style={styles.loadingContainer}>
                            <ActivityIndicator size="small" color={COLORS.buttonPrimary} />
                            <Text style={styles.loadingText}>{t('screens.shop.loadingCouponList')}</Text>
                        </View>
                    ) : filteredItems.length > 0 ? (
                        <View style={styles.itemsList}>
                            {filteredItems.map((item) => renderItemCard(item))}
                        </View>
                    ) : (
                        <View style={styles.emptyContainer}>
                            <Text style={styles.emptyText}>
                                {searchQuery.trim() ? t('screens.shop.noSearchResults') : t('screens.shop.noPurchasedCoupons')}
                            </Text>
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
    segmented: {
        marginBottom: SIZES.large,
        marginHorizontal: 16,
    },
    statsCardWrapper: {
        marginHorizontal: 16,
        marginBottom: 16,
    },
    statsCard: {
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
    statsContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        height: '100%',
        paddingHorizontal: 20,
    },
    statItem: {
        alignItems: 'center',
        flex: 1,
    },
    statLabel: {
        fontSize: 12,
        fontFamily: 'Roboto-Medium',
        color: '#6a7282',
        marginBottom: 8,
    },
    statValue: {
        fontSize: 24,
        fontFamily: 'Roboto-Bold',
        color: '#1890FF',
    },
    statValueUsed: {
        color: '#707070',
    },
    statDivider: {
        width: 1,
        height: 40,
        backgroundColor: '#E5E7EB',
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
    itemsList: {
        paddingHorizontal: 16,
        paddingBottom: 20,
    },
    itemCard: {
        backgroundColor: '#ffffff',
        borderRadius: 14,
        borderWidth: 1.108,
        borderColor: '#e5e7eb',
        marginBottom: 12,
        overflow: 'hidden',
        flexDirection: 'row',
    },
    itemImageContainer: {
        width: 96,
        backgroundColor: '#ffffff',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        paddingHorizontal: 8,
    },
    itemImage: {
        width: 80,
        height: 80,
        alignSelf: 'center',
        resizeMode: 'contain',
    },
    itemContent: {
        flex: 1,
        padding: 16,
        justifyContent: 'space-between',
    },
    itemHeader: {
        marginBottom: 8,
    },
    itemInfo: {
        flex: 1,
    },
    itemTitleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    itemBrand: {
        fontSize: 12,
        fontFamily: 'Roboto-SemiBold',
        color: '#6a7282',
        flex: 1,
    },
    itemTitle: {
        fontSize: 14,
        fontFamily: 'Roboto-Bold',
        color: '#101828',
        lineHeight: 20,
        flex: 1,
    },
    statusTag: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    statusTagAvailable: {
        backgroundColor: '#E6F7FF',
    },
    statusTagUsed: {
        backgroundColor: '#F5F5F5',
    },

    statusTagPending: {
        backgroundColor: '#FFF7E6',
    },
    statusTagText: {
        fontSize: 10,
        fontFamily: 'Roboto-Medium',
    },
    statusTagTextAvailable: {
        color: '#1890FF',
    },
    statusTagTextUsed: {
        color: '#707070',
    },
    statusTagTextPending: {
        color: '#FA8C16',
    },
    purchaseDate: {
        fontSize: 12,
        fontFamily: 'Roboto-Regular',
        color: '#6a7282',
        marginBottom: 8,
    },
    useButton: {
        backgroundColor: '#1E3A5F',
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 8,
        width: '100%',
        alignItems: 'center',
    },
    useButtonText: {
        fontSize: 12,
        fontFamily: 'Roboto-Bold',
        color: '#ffffff',
    },
    loadingContainer: {
        paddingVertical: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    loadingText: {
        marginTop: 12,
        fontSize: FONTS.size.msmall,
        fontFamily: 'Roboto-Regular',
        color: '#7d7e83',
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
