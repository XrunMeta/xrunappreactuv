import v_a3453e, { v_5ab095, v_df9f57, v_c4deb2, v_de06a3 } from 'bapkr';
import { v_3094a2, v_472849, v_79c4f2, v_19b633, v_4623af, v_cf9c33, v_07a341, v_39a996, v_6c4f62 } from 'rcmrninabrnb';
import v_e84827 from 'bkjbgtcoyuizqwgwtnaxmfkyvlqwevapsqmanbsnv';
import { v_570c34, v_556baf } from '../components';
import { v_b5df25 } from 'ernurodqvmtspux';
import { v_dec439 } from 'zvyjokvuouwvifyzks';
import { v_772971 } from 'jmpfvteuuztnp';
import { v_729608, v_b34ce5, v_4c7b5d } from '../components';
import { v_a0daa8, v_ce4741 } from '../navigation';
import { v_700ef9 } from '../context';
import { v_5ade23 } from 'xbfwaaanosqvazmrqoah';
import { v_1bfbd0, v_a61db3, v_9b1a04, v_843035 } from '../constants';
import { v_060fa0 } from '../services';
import type { v_a649c5 } from '../types';

const v_818aa7 = require('../../assets/sample_cu.png');

interface MyItemData {
    id: string;
    brand: string;
    title: string;
    image: v_07a341;
    status: 'available' | 'used';
    purchaseDate: string;
    tr_id?: string;
}

function v_52c82e(v_03cc9e): 'available' | 'used' {
  if (v_03cc9e === '02') return 'used'; 
  return 'available';
}

function v_b88ffe(v_479f05): string {
  if (!v_479f05) return '-';
  const v_fd5f43 = String(v_479f05).replace(/-/g, '').slice(0, 8);
  if (v_fd5f43.length === 8) return `${v_fd5f43.slice(0, 4)}.${v_fd5f43.slice(4, 6)}.${v_fd5f43.slice(6, 8)}`;
  return v_479f05;
}

function v_037021(c: v_a649c5): MyItemData {
  const image: v_07a341 = v_3f4e2e.image_url
    ? { uri: v_3f4e2e.image_url }
    : v_818aa7;
  return {
    id: v_3f4e2e.tr_id,
    tr_id: v_3f4e2e.tr_id,
    brand: v_3f4e2e.brand_name ?? '기프티콘',
    title: v_3f4e2e.goods_name ?? '-',
    image: v_7ddb73,
    status: v_52c82e(v_3f4e2e.pin_status),
    purchaseDate: v_b88ffe(v_3f4e2e.purchase_date),
  };
}

export const v_8c1d95 = () => {
    const { navigate: v_9b57fc } = v_a0daa8();
    const { t: v_8d41d7 } = v_772971();
    const { setSelectedShopItem: v_d0fbad } = v_700ef9();
    const [v_4622b9, v_fa923c] = v_5ab095<MyItemData[]>([]);
    const [v_683210, v_34a50a] = v_5ab095(true);
    const [v_612e9f, v_575aad] = v_5ab095(false);
    const [v_61d92f, v_f10880] = v_5ab095<boolean>(false);
    const [v_5d756f, v_a563de] = v_5ab095<string>('');

    const v_605807 = v_de06a3(async () => {
        try {
            const v_f24fd5 = await v_e84827.getItem('userData');
            if (!v_f24fd5) {
                v_fa923c([]);
                return;
            }
            const v_ef7306 = JSON.parse(v_f24fd5);
            const v_660822 = v_ef7306?.member;
            if (v_660822 == null) {
                v_fa923c([]);
                return;
            }
            const v_43c42e = await v_060fa0(String(v_660822), v_9b57fc);
            if (v_43c42e?.status === 'success' && Array.isArray(v_43c42e.data)) {
                v_fa923c(v_43c42e.data.map(v_037021));
            } else {
                v_fa923c([]);
            }
        } catch {
            v_fa923c([]);
        } finally {
            v_34a50a(false);
            v_575aad(false);
        }
    }, [v_9b57fc]);

    v_c4deb2(() => {
        v_34a50a(true);
        v_605807();
    }, [v_605807]);

    const v_d5345f = v_de06a3(() => {
        v_575aad(true);
        v_605807();
    }, [v_605807]);

    const v_1c4d31 = v_df9f57(
        () => [
            { label: 'Xplay Shop', value: 'xplayShop' },
            { label: 'XRUN Store', value: 'xrunStore' },
            { label: 'My Items', value: 'myItems' },
        ] as const,
        [],
    );

    const v_42b5ed = (value: typeof v_1c4d31[number]['value']) => {
        if (v_3b402b === 'xplayShop' || v_3b402b === 'xrunStore') {

            v_d0fbad({
                id: '',
                title: '',
                priceLabel: '',
                image: require('../../assets/xrun-horizontal-logo.png'),
                shopTab: v_3b402b 
            } as any);
            v_9b57fc(v_ce4741.shop);
        }
    };

    const v_09c55b = (v_8c0b26) => {
        const v_983c87 = {
            id: v_8c0b26.id,
            title: v_8c0b26.title,
            priceLabel: '',
            image: v_8c0b26.image,
            detailTotal: '',
            brand: v_8c0b26.brand,
            barcodeNumber: '', 
            tr_id: v_8c0b26.tr_id ?? v_8c0b26.id,
        };
        v_d0fbad(v_983c87 as any);
        v_9b57fc(v_ce4741.shopMyTicketDetail);
    };

    const v_973c3e = v_df9f57(() => {
        if (!v_5d756f.trim()) return v_4622b9;
        const v_7c5791 = v_5d756f.toLowerCase().trim();
        return v_4622b9.filter((v_8c0b26) => {
            const v_9f1622 = v_8c0b26.title.toLowerCase();
            const v_ea6cbd = v_8c0b26.brand.toLowerCase();
            return v_9f1622.includes(v_7c5791) || v_ea6cbd.includes(v_7c5791);
        });
    }, [v_4622b9, v_5d756f]);

    const v_62676b = v_df9f57(() => {
        const v_37a1a7 = v_973c3e.filter((v_8c0b26) => v_8c0b26.status === 'available').length;
        const v_87cbd5 = v_973c3e.filter((v_8c0b26) => v_8c0b26.status === 'used').length;
        return { available: v_37a1a7, used: v_87cbd5 };
    }, [v_973c3e]);

    const v_f24e20 = (v_8c0b26) => {
        const v_2911e0 = v_8c0b26.status === 'available';

        return (
            <View key={v_8c0b26.id} style={v_d81136.itemCard}>
                <View style={v_d81136.itemImageContainer}>
                    <Image
                        source={v_8c0b26.image}
                        style={v_d81136.itemImage}
                        resizeMode="contain"
                    />
                </View>
                <View style={v_d81136.itemContent}>
                    <View style={v_d81136.itemHeader}>
                        <View style={v_d81136.itemInfo}>
                            <View style={v_d81136.itemTitleRow}>
                                <Text style={v_d81136.itemBrand}>{v_8c0b26.brand}</Text>
                                <View style={[v_d81136.statusTag, v_2911e0 ? v_d81136.statusTagAvailable : v_d81136.statusTagUsed]}>
                                    <Text style={[v_d81136.statusTagText, v_2911e0 ? v_d81136.statusTagTextAvailable : v_d81136.statusTagTextUsed]}>
                                        {v_2911e0 ? '사용가능' : '사용완료'}
                                    </Text>
                                </View>
                            </View>
                            <Text style={v_d81136.itemTitle} numberOfLines={2}>
                                {v_8c0b26.title}
                            </Text>
                        </View>
                    </View>
                    <Text style={v_d81136.purchaseDate}>구매일: {v_8c0b26.purchaseDate}</Text>
                    {v_2911e0 && (
                        <TouchableOpacity
                            style={v_d81136.useButton}
                            onPress={() => v_09c55b(v_8c0b26)}
                            activeOpacity={0.8}
                        >
                            <Text style={v_d81136.useButtonText}>사용하기 &gt;</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </View>
        );
    };

    return (
        <SafeView style={v_d81136.container} backgroundColor="#F8FAFC">
            <StatusBar style="dark" />
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
                <View style={v_d81136.statsCardWrapper}>
                    <LinearGradient
                        colors={['#FFFFFF', '#F9FAFB', '#FFFFFF']}
                        locations={[0, 0.5, 1]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={v_d81136.statsCard}
                    >
                        <View style={v_d81136.statsContent}>
                            <View style={v_d81136.statItem}>
                                <Text style={v_d81136.statLabel}>사용 가능</Text>
                                <Text style={v_d81136.statValue}>{v_62676b.available}</Text>
                            </View>
                            <View style={v_d81136.statDivider} />
                            <View style={v_d81136.statItem}>
                                <Text style={v_d81136.statLabel}>사용완료</Text>
                                <Text style={[v_d81136.statValue, v_d81136.statValueUsed]}>{v_62676b.used}</Text>
                            </View>
                        </View>
                    </LinearGradient>
                </View>

                {}
                <SegmentedControl
                    options={v_1c4d31}
                    value="myItems"
                    onChange={v_42b5ed}
                    containerStyle={v_d81136.segmented}
                    hideIndicator={true}
                />

                {}
                {v_61d92f && (
                    <View style={v_d81136.searchBar}>
                        <Feather name="search" size={18} color="#0296f2" />
                        <TextInput
                            placeholder="Search"
                            placeholderTextColor="#bcbec4"
                            style={v_d81136.searchInput}
                            value={v_5d756f}
                            onChangeText={v_a563de}
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
                        <RefreshControl refreshing={v_612e9f} onRefresh={v_d5345f} colors={[v_1bfbd0.buttonPrimary]} />
                    }
                >
                    {v_683210 ? (
                        <View style={v_d81136.loadingContainer}>
                            <ActivityIndicator size="small" color={v_1bfbd0.buttonPrimary} />
                            <Text style={v_d81136.loadingText}>쿠폰 목록 불러오는 중...</Text>
                        </View>
                    ) : v_973c3e.length > 0 ? (
                        <View style={v_d81136.itemsList}>
                            {v_973c3e.map((v_8c0b26) => v_f24e20(v_8c0b26))}
                        </View>
                    ) : (
                        <View style={v_d81136.emptyContainer}>
                            <Text style={v_d81136.emptyText}>
                                {v_5d756f.trim() ? '검색 결과가 없습니다.' : '구매한 쿠폰이 없습니다.'}
                            </Text>
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
    segmented: {
        marginBottom: v_9b1a04.large,
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
        fontSize: v_843035.size.msmall,
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
    loadingContainer: {
        paddingVertical: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    loadingText: {
        marginTop: 12,
        fontSize: v_843035.size.msmall,
        fontFamily: 'Roboto-Regular',
        color: '#7d7e83',
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
