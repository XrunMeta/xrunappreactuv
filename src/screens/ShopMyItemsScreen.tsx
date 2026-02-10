import React, { useState, useMemo } from 'react';
import { View, StyleSheet, TextInput, Text, TouchableOpacity, Image, ImageSourcePropType } from 'react-native';
import { SafeScrollView, SafeView } from '../components';
import { StatusBar } from 'expo-status-bar';
import { Feather } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { Header, SegmentedControl } from '../components';
import { useAppNavigation, ROUTES } from '../navigation';
import { useAppContext } from '../context';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, COMMON_STYLES, SIZES, FONTS } from '../constants';

const sampleStarbucks = require('../../assets/sample_starbugs.png');
const sampleCU = require('../../assets/sample_cu.png');
const sampleNaverPay = require('../../assets/sample_naverpay.png');

interface MyItemData {
    id: string;
    brand: string;
    title: string;
    image: ImageSourcePropType;
    status: 'available' | 'used'; 
    purchaseDate: string; 
}

const sampleItems: MyItemData[] = [
    {
        id: '1',
        brand: '스타벅스',
        title: '아이스 카페 아메리카노T 2잔+부드러운 생크림 카스텔라 모바일쿠폰',
        image: sampleStarbucks,
        status: 'available',
        purchaseDate: '2026.02.01',
    },
    {
        id: '2',
        brand: 'CU',
        title: 'CU 편의점 5천원 기프티콘',
        image: sampleCU,
        status: 'used',
        purchaseDate: '2026.01.15',
    },
    {
        id: '3',
        brand: '네이버',
        title: '네이버페이 포인트 1만원',
        image: sampleNaverPay,
        status: 'available',
        purchaseDate: '2026.01.28',
    },
];

export const ShopMyItemsScreen = () => {
    const { navigate } = useAppNavigation();
    const { t } = useTranslation();
    const { setSelectedShopItem } = useAppContext();
    const [pointsBalance] = useState<number>(5000); 
    const [showSearchBar, setShowSearchBar] = useState<boolean>(false);
    const [searchQuery, setSearchQuery] = useState<string>('');

    const segmentedOptions = useMemo(
        () => [
            { label: 'Xplay Shop', value: 'xplayShop' },
            { label: 'XRUN Store', value: 'xrunStore' },
            { label: 'My Items', value: 'myItems' },
        ] as const,
        [],
    );

    const handleTabChange = (value: typeof segmentedOptions[number]['value']) => {
        if (value === 'xplayShop' || value === 'xrunStore') {

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

        const shopItem = {
            id: item.id,
            title: item.title,
            priceLabel: '',
            image: item.image,
            detailTotal: '',
            brand: item.brand,
            barcodeNumber: '1231 1231 1231 1231', 
        };
        setSelectedShopItem(shopItem as any);
        navigate(ROUTES.shopMyTicketDetail);
    };

    const filteredItems = useMemo(() => {
        if (!searchQuery.trim()) {
            return sampleItems;
        }

        const query = searchQuery.toLowerCase().trim();
        return sampleItems.filter((item) => {
            const title = item.title.toLowerCase();
            const brand = item.brand.toLowerCase();
            return title.includes(query) || brand.includes(query);
        });
    }, [searchQuery]);

    const stats = useMemo(() => {
        const available = filteredItems.filter((item) => item.status === 'available').length;
        const used = filteredItems.filter((item) => item.status === 'used').length;
        return { available, used };
    }, [filteredItems]);

    const renderItemCard = (item: MyItemData) => {
        const isAvailable = item.status === 'available';

        return (
            <View key={item.id} style={styles.itemCard}>
                <View style={styles.itemImageContainer}>
                    <Image
                        source={item.image}
                        style={styles.itemImage}
                        resizeMode="contain"
                    />
                </View>
                <View style={styles.itemContent}>
                    <View style={styles.itemHeader}>
                        <View style={styles.itemInfo}>
                            <View style={styles.itemTitleRow}>
                                <Text style={styles.itemBrand}>{item.brand}</Text>
                                <View style={[styles.statusTag, isAvailable ? styles.statusTagAvailable : styles.statusTagUsed]}>
                                    <Text style={[styles.statusTagText, isAvailable ? styles.statusTagTextAvailable : styles.statusTagTextUsed]}>
                                        {isAvailable ? '사용가능' : '사용완료'}
                                    </Text>
                                </View>
                            </View>
                            <Text style={styles.itemTitle} numberOfLines={2}>
                                {item.title}
                            </Text>
                        </View>
                    </View>
                    <Text style={styles.purchaseDate}>구매일: {item.purchaseDate}</Text>
                    {isAvailable && (
                        <TouchableOpacity
                            style={styles.useButton}
                            onPress={() => handleUseItem(item)}
                            activeOpacity={0.8}
                        >
                            <Text style={styles.useButtonText}>사용하기 &gt;</Text>
                        </TouchableOpacity>
                    )}
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
                                <Text style={styles.statLabel}>사용 가능</Text>
                                <Text style={styles.statValue}>{stats.available}</Text>
                            </View>
                            <View style={styles.statDivider} />
                            <View style={styles.statItem}>
                                <Text style={styles.statLabel}>사용완료</Text>
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
                <SafeScrollView showsVerticalScrollIndicator={false} showBottomBackground={false} backgroundColor="transparent" disableBottomPadding={true}>
                    {filteredItems.length > 0 ? (
                        <View style={styles.itemsList}>
                            {filteredItems.map((item) => renderItemCard(item))}
                        </View>
                    ) : (
                        <View style={styles.emptyContainer}>
                            <Text style={styles.emptyText}>
                                {searchQuery.trim() ? 'No search results' : '구매한 아이템이 없습니다.'}
                            </Text>
                        </View>
                    )}
                </SafeScrollView>
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
        width: 120,
        backgroundColor: '#ffffff',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
    },
    itemImage: {
        width: 120,
        height: 120,
        alignSelf: 'center',
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
});
