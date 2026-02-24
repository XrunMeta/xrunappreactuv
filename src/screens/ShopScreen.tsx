import v_a3453e, { v_5ab095, v_df9f57, v_c4deb2, v_de06a3 } from 'bapkr';
import { v_3094a2, v_472849, v_19b633, v_4623af, v_cf9c33, v_122070, v_07a341, v_700696, v_39a996, v_6c4f62 } from 'rcmrninabrnb';
import v_e84827 from 'bkjbgtcoyuizqwgwtnaxmfkyvlqwevapsqmanbsnv';
import { v_5ade23 } from 'xbfwaaanosqvazmrqoah';
import { v_570c34, v_556baf } from '../components';
import { v_dec439 } from 'zvyjokvuouwvifyzks';
import { v_772971 } from 'jmpfvteuuztnp';
import { v_729608, v_b34ce5, v_4c7b5d } from '../components';
import { v_4b1173 } from '../context/AlertDialogContext';
import { v_a0daa8, v_ce4741 } from '../navigation';
import { v_700ef9 } from '../context';
import { v_1bfbd0, v_a61db3, v_9b1a04, v_843035 } from '../constants';
import { v_25c73c } from '../services/giftishowBiz';
import type { v_d62ea7 } from '../services/giftishowBiz';
import { v_877de8 } from '../services';

const v_10664a = require('../../assets/xplay_symbol.png');
const v_33c40c = require('../../assets/xrun-round-logo.png');
const v_e98c55 = require('../../assets/sample_starbugs.png');
const v_b236ed = require('../../assets/sample_cu.png');
const v_da3188 = require('../../assets/sample_naverpay.png');
const v_10a702 = require('../../assets/images/blur_yellow.png');
const v_74bda9 = require('../../assets/images/ethereum_thumb.png');
const v_47af4d = require('../../assets/xrun-horizontal-logo.png');

interface ProductData {
    id: string;
    brand: string;
    title: string;
    description?: string;
    price: number;
    image: v_07a341;

    isXplayShop?: boolean;
}

const v_426e67 = [
    {
        id: '1',
        brand: '스타벅스',
        title: '아이스 카페 아메리카노T 2잔+부드러운 생크림 카스텔라 모바일쿠폰',
        price: 2000,
        image: v_e98c55,
    },
    {
        id: '2',
        brand: 'Ethereum',
        title: 'Ethereum 교환권',
        description: '최소 30,000 Xplay 이상 교환가능',
        price: 30000,
        image: v_74bda9,
    },
    {
        id: '3',
        brand: 'CU',
        title: 'CU 편의점 기프티콘',
        price: 2000,
        image: v_b236ed,
    },
    {
        id: '4',
        brand: 'Ethereum',
        title: '네이버페이 포인트 1만원',
        price: 30000,
        image: v_da3188,
    },
];

const v_7fb877 = [
    {
        id: 'xrun-1',
        brand: 'XRUN',
        title: 'Polygon 전송티켓',
        price: 10,
        image: v_47af4d,
    },
];

function v_9bd735(item: v_d62ea7): ProductData {
    return {
        id: v_8c0b26.id ?? `g-${v_8c0b26.name ?? ''}`,
        brand: (v_8c0b26 as any).brandName ?? '기프티콘',
        title: v_8c0b26.name ?? '-',
        price: typeof v_8c0b26.price === 'number' ? v_8c0b26.price : 0,
        image: v_8c0b26.imageUrl ? { uri: v_8c0b26.imageUrl } : v_b236ed,
        isXplayShop: true,
    };
}

export const v_10886b = () => {
    console.log('[ShopScreen] ShopScreen 컴포넌트 렌더링됨');
    const { t: v_8d41d7 } = v_772971();
    const { showAlert: v_889fad } = v_4b1173();
    const { setSelectedShopItem: v_d0fbad, selectedShopItem: v_dfe883 } = v_700ef9();
    const [v_11083e, v_94ee83] = v_5ab095<'xplayShop' | 'xrunStore' | 'myItems'>('xplayShop');

    const [v_50b846, v_4ff2fa] = v_5ab095<v_d62ea7[]>([]);
    const [v_32c9b7, v_0e5971] = v_5ab095(false);
    const [v_5605ec, v_ad5fd0] = v_5ab095(false);
    const [v_02e6ad, v_33ec67] = v_5ab095<string | null>(null);
    const [v_cd398d, v_d20f1f] = v_5ab095<number | null>(null);
    const [v_837630, v_2f87ed] = v_5ab095(false);
    const [v_1d54f1, v_67ba02] = v_5ab095<number>(0);
    const { navigate: v_9b57fc } = v_a0daa8();

    const v_c1e7a4 = v_de06a3(async () => {
        try {
            const v_f24fd5 = await v_e84827.getItem('userData');
            if (!v_f24fd5) {
                v_d20f1f(null);
                return;
            }
            const v_ef7306 = JSON.parse(v_f24fd5);
            const v_660822 = v_ef7306?.member;
            if (v_660822 == null) {
                v_d20f1f(null);
                return;
            }
            v_2f87ed(true);
            const v_43c42e = await v_877de8(v_660822, v_9b57fc);
            v_d20f1f(v_43c42e.total_ayet_points ?? 0);
        } catch {
            v_d20f1f(0);
        } finally {
            v_2f87ed(false);
        }
    }, [v_9b57fc]);

    const v_f61b49 = v_de06a3(async () => {
        v_33ec67(null);
        try {
            const v_8f00b9 = await v_25c73c({ start: 1, size: 50 });
            const v_ef8ab1 = Array.isArray(v_8f00b9.list) ? v_8f00b9.list : [];
            v_4ff2fa(v_ef8ab1);
            console.log('[Xplay Shop] 상품 목록 조회:', v_ef8ab1.length, '건', v_ef8ab1.map((v_8c0b26) => ({ id: v_8c0b26.id, name: v_8c0b26.name, price: v_8c0b26.price })));
            if (v_ef8ab1.length === 0 && v_8f00b9.resultMsg) v_33ec67(v_8f00b9.resultMsg);
        } catch (v_9e86fd) {
            v_33ec67(v_9e86fd instanceof Error ? v_9e86fd.message : '기프티콘 목록을 불러오지 못했습니다.');
            v_4ff2fa([]);
        }
    }, []);

    v_c4deb2(() => {
        if (v_11083e === 'xplayShop') {
            v_0e5971(true);
            v_f61b49().finally(() => v_0e5971(false));
        }
    }, [v_11083e, v_f61b49]);

    const v_f80453 = v_de06a3(() => {
        v_ad5fd0(true);
        Promise.all([v_f61b49(), v_c1e7a4()]).finally(() => v_ad5fd0(false));
    }, [v_f61b49, v_c1e7a4]);

    v_c4deb2(() => {
        if (v_dfe883 && (v_dfe883 as any).shopTab) {
            const v_378bd8 = (v_dfe883 as any).shopTab;
            if (v_378bd8 === 'xplayShop' || v_378bd8 === 'xrunStore') {
                v_94ee83(v_378bd8);

                v_d0fbad(undefined);
            }
        }
    }, [v_dfe883, v_d0fbad]);
    const [v_61d92f, v_f10880] = v_5ab095<boolean>(false);

    v_c4deb2(() => {
        if (v_11083e === 'xplayShop') {
            v_c1e7a4();
        }
    }, [v_11083e, v_c1e7a4]);

    const v_bcfa24 = v_700696.get('window').width;
    const v_3af450 = v_df9f57(() => {
        const v_d409bb = 16;
        const v_3c3231 = 8;
        const v_2f5c5c = v_bcfa24 - v_d409bb * 2;
        return (v_2f5c5c - v_3c3231) / 2;
    }, [v_bcfa24]);

    const v_1c4d31 = v_df9f57(
        () => [
            { label: 'Xplay Shop', value: 'xplayShop' },
            { label: 'XRUN Store', value: 'xrunStore' },
            { label: 'My Items', value: 'myItems' },
        ] as const,
        [],
    );

    const v_42b5ed = (value: typeof v_1c4d31[number]['value']) => {
        if (v_3b402b === 'myItems') {
            v_9b57fc(v_ce4741.shopMyItems);
            return;
        }
        v_94ee83(v_3b402b);
    };

    const v_8d97ed = (v_01bee9) => {

        const v_983c87 = {
            id: v_01bee9.id,
            title: v_01bee9.title,
            priceLabel: `${v_01bee9.price.toLocaleString()}`,
            image: v_01bee9.image,
            detailTotal: '',
            brand: v_01bee9.brand,
            description: v_01bee9.description,
            isXrun: v_01bee9.brand === 'XRUN',
            shopTab: v_01bee9.isXplayShop ? ('xplayShop' as const) : undefined,
        };
        v_d0fbad(v_983c87 as any);
        v_9b57fc(v_ce4741.shopProductDetail);
    };

    const v_dfaad1 = (v_01bee9) => {
        v_889fad('구매', `${v_01bee9.title}을(를) 구매하시겠습니까?`, [
            { text: '취소' },
            { text: '구매', onPress: () => console.log('구매:', v_01bee9.id) },
        ]);
    };

    const v_80b207 = (v_01bee9, v_80e8c0 = false) => {
        const v_2141e0 = v_01bee9.brand === 'Ethereum' && v_01bee9.description;
        const v_fa78fb = v_01bee9.brand === 'XRUN';

        return (
            <TouchableOpacity
                key={v_01bee9.id}
                style={[v_d81136.productCard, { width: v_3af450 }]}
                onPress={() => v_8d97ed(v_01bee9)}
                activeOpacity={0.8}
            >
                <View style={[
                    v_d81136.productImageContainer,
                    v_2141e0 && v_d81136.productImageContainerEthereum
                ]}>
                    <Image source={v_01bee9.image} style={v_d81136.productImage} resizeMode="contain" />
                    {v_2141e0 && v_01bee9.description && (
                        <View style={v_d81136.imageDescriptionOverlay}>
                            <Text style={v_d81136.imageDescriptionText}>{v_01bee9.description}</Text>
                        </View>
                    )}
                </View>
                <View style={v_d81136.productInfo}>
                    <Text style={v_d81136.productBrand}>{v_01bee9.brand}</Text>
                    <Text style={v_d81136.productTitle} numberOfLines={2}>
                        {v_01bee9.title}
                    </Text>
                    <View style={v_d81136.productFooter}>
                        <View style={v_d81136.priceContainer}>
                            <View style={v_d81136.xplayIconContainer}>
                                <Image
                                    source={v_fa78fb ? v_33c40c : v_10664a}
                                    style={v_fa78fb ? v_d81136.xrunIcon : v_d81136.xplayIcon}
                                    resizeMode="contain"
                                />
                            </View>
                            <Text style={v_d81136.priceText}>{v_01bee9.price.toLocaleString()}</Text>
                        </View>
                        {v_80e8c0 && (
                            <TouchableOpacity
                                style={v_d81136.purchaseButton}
                                onPress={() => v_dfaad1(v_01bee9)}
                                activeOpacity={0.8}
                            >
                                <Text style={v_d81136.purchaseButtonText}>구매</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <SafeView style={v_d81136.container} backgroundColor="#F8FAFC">
            <Header
                title={v_8d41d7('screens.shop.title')}
                rightComponent={
                    <TouchableOpacity
                        onPress={() => v_f10880(!v_61d92f)}
                        activeOpacity={0.7}
                        style={v_d81136.searchButton}
                    >
                        <Feather name="search" size={20} color="#007aff" />
                    </TouchableOpacity>
                }
            />
            <View style={v_d81136.contentContainer}>
                {}
                {(v_11083e === 'xplayShop' || v_11083e === 'xrunStore') && (
                    <View style={v_d81136.balanceCardWrapper}>
                        <LinearGradient
                            colors={['#FFFFFF', '#F9FAFB', '#FFFFFF']}
                            locations={[0, 0.5, 1]}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={v_d81136.balanceCard}
                        >
                            <Image source={v_10a702} style={v_d81136.balanceBlurRight} resizeMode="cover" />
                            <View style={v_d81136.balanceContent}>
                                <View style={v_d81136.balanceLeft}>
                                    <Text style={v_d81136.balanceLabel}>내 잔액</Text>
                                    <View style={v_d81136.balanceAmountRow}>
                                        <View style={[
                                            v_d81136.balanceXplayIconContainer,
                                            v_11083e === 'xrunStore' && v_d81136.balanceXrunIconContainer
                                        ]}>
                                            <Image
                                                source={v_11083e === 'xrunStore' ? v_33c40c : v_10664a}
                                                style={v_d81136.balanceXplayIcon}
                                                resizeMode="contain"
                                            />
                                        </View>
                                        {v_11083e === 'xplayShop' ? (
                                            v_837630 ? (
                                                <ActivityIndicator size="small" color="#343a5a" style={{ marginLeft: 8 }} />
                                            ) : (
                                                <Text style={v_d81136.balanceAmount}>
                                                    {(v_cd398d ?? 0).toLocaleString()}
                                                </Text>
                                            )
                                        ) : (
                                            <Text style={v_d81136.balanceAmount}>{v_1d54f1.toLocaleString()}</Text>
                                        )}
                                    </View>
                                </View>
                                {v_11083e === 'xplayShop' ? (
                                    <View style={v_d81136.xplayTag}>
                                        <Text style={v_d81136.xplayTagText}>Xplay</Text>
                                    </View>
                                ) : (
                                    <View style={v_d81136.xrunTag}>
                                        <Text style={v_d81136.xrunTagText}>XRUN</Text>
                                    </View>
                                )}
                            </View>
                        </LinearGradient>
                    </View>
                )}

                {}
                <SegmentedControl
                    options={v_1c4d31}
                    value={v_11083e}
                    onChange={v_42b5ed}
                    containerStyle={v_d81136.segmented}
                    hideIndicator={true}
                />

                {}
                <SafeScrollView
                    showsVerticalScrollIndicator={false}
                    showBottomBackground={false}
                    backgroundColor="transparent"
                    disableBottomPadding={true}
                    refreshControl={
                        v_11083e === 'xplayShop' ? (
                            <RefreshControl refreshing={v_5605ec} onRefresh={v_f80453} colors={[v_1bfbd0.buttonPrimary]} />
                        ) : undefined
                    }
                >
                    {v_11083e === 'xplayShop' ? (
                        <>
                            {v_32c9b7 && !v_5605ec ? (
                                <View style={v_d81136.loadingContainer}>
                                    <ActivityIndicator size="small" color={v_1bfbd0.buttonPrimary} />
                                    <Text style={v_d81136.loadingText}>기프티콘 목록 불러오는 중...</Text>
                                </View>
                            ) : v_02e6ad ? (
                                <View style={v_d81136.errorContainer}>
                                    <Text style={v_d81136.errorText}>{v_02e6ad}</Text>
                                </View>
                            ) : (
                                <View style={v_d81136.productGrid}>
                                    {v_50b846.map((v_8c0b26) =>
                                        v_80b207(v_9bd735(v_8c0b26), false)
                                    )}
                                </View>
                            )}
                        </>
                    ) : v_11083e === 'xrunStore' ? (
                        <View style={v_d81136.productGrid}>
                            {v_7fb877.map((v_01bee9) => v_80b207(v_01bee9, false))}
                        </View>
                    ) : (
                        <View style={v_d81136.emptyContainer}>
                            <Text style={v_d81136.emptyText}>My Items는 별도 화면에서 확인하실 수 있습니다.</Text>
                        </View>
                    )}
                </SafeScrollView>
            </View>
            {}
            <View style={v_d81136.taboolaContainer}>
                <TaboolaBanner placementType="shop" />
            </View>
        </SafeView>
    );
};

const v_d81136 = v_472849.create({
    container: {
        ...v_a61db3.container,
    },
    contentContainer: {
        flex: 1,
        ...v_a61db3.contentContainer,
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
        fontSize: v_843035.size.small,
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
        paddingHorizontal: v_9b1a04.large,
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
        marginBottom: v_9b1a04.large,
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
        fontSize: v_843035.size.msmall,
        fontFamily: 'Roboto-Regular',
        color: '#6a7282',
    },
    errorContainer: {
        paddingVertical: 40,
        paddingHorizontal: 16,
        alignItems: 'center',
    },
    errorText: {
        fontSize: v_843035.size.msmall,
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
        fontSize: v_843035.size.msmall,
        fontFamily: 'Roboto-Regular',
        color: '#7d7e83',
    },
    taboolaContainer: {
        borderWidth: 2,
        borderColor: '#ededed',
        marginTop: 10,
    },
});
