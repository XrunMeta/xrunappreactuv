import v_a3453e from 'bapkr';
import { v_3094a2, v_472849, v_19b633, v_4623af, v_cf9c33, v_07a341, v_326be8 } from 'rcmrninabrnb';
import { v_556baf } from '../components';
import { v_b5df25 } from 'ernurodqvmtspux';
import { v_772971 } from 'jmpfvteuuztnp';
import { v_729608 } from '../components';
import { v_a0daa8 } from '../navigation';
import { v_700ef9 } from '../context';
import { v_a61db3 } from '../constants';
import { v_e0068c } from 'vvfgtwbmdpbnvhtfbtbgudicfmpscw';
import { v_c18c22 } from 'svuoaeceudfxfjvvpmmmchnwljywbphjgb';
import { v_5ade23 } from 'xbfwaaanosqvazmrqoah';
import { v_dec439 } from 'zvyjokvuouwvifyzks';

interface TicketData {
    id: string;
    brand: string;
    title: string;
    image: v_07a341;
    barcodeNumber: string;
}

const v_f158ec = {
    id: '1',
    brand: '스타벅스',
    title: '스타벅스 아메리카노 Tall 2 + 카스텔라 2EA',
    image: require('../../assets/sample_starbugs.png'),
    barcodeNumber: '1231 1231 1231 1231',
};

export const v_1184c4 = () => {
    const { goBack: v_c7ac57 } = v_a0daa8();
    const { t: v_8d41d7 } = v_772971();
    const { selectedShopItem: v_dfe883 } = v_700ef9();
    const v_033e14 = v_e0068c();
    const v_f9771e = v_c18c22(0);

    const v_365f44 = v_326be8.OS === 'ios'
        ? v_033e14.bottom
        : Math.max(v_f9771e, v_033e14.bottom);

    const v_467ee6 = (v_dfe883 as any)?.couponImgUrl;
    const v_e47051 = typeof v_467ee6 === 'string' && v_467ee6.trim().length > 0;

    const v_c9c6be = v_dfe883 ? {
        id: v_dfe883.id || '1',
        brand: (v_dfe883 as any).brand || '스타벅스',
        title: v_dfe883.title || '',
        image: v_dfe883.image || v_f158ec.image,
        barcodeNumber: (v_dfe883 as any).barcodeNumber || '1231 1231 1231 1231',
    } : v_f158ec;

    const v_dda6bb = () => {

    };

    return (
        <SafeView style={v_d81136.container} backgroundColor="#FFFFFF">
            <StatusBar style="dark" />
            <Header
                title="내 티켓"
                onBackPress={v_c7ac57}
                showBackButton
            />
            <View style={v_d81136.content}>
                <View style={v_d81136.ticketContainer}>
                    {}
                    <View style={v_d81136.barcodeContainer}>
                        <View style={[v_d81136.barcodeImageContainer, v_e47051 && v_d81136.barcodeImageContainerLarge]}>
                            {v_e47051 ? (
                                <Image
                                    source={{ uri: v_467ee6!.trim() }}
                                    style={v_d81136.couponImage}
                                    resizeMode="cover"
                                />
                            ) : (
                                <View style={v_d81136.barcodePlaceholder}>
                                    {v_c9c6be.barcodeNumber ? (
                                        (() => {
                                            const v_2d619f = v_c9c6be.barcodeNumber.replace(/\s/g, '');
                                            const v_192d5d = [];
                                            const v_10d904 = {
                                                0: [2, 1, 1, 2], 1: [2, 1, 2, 1], 2: [1, 2, 2, 1], 3: [2, 2, 1, 1],
                                                4: [1, 1, 2, 2], 5: [2, 1, 1, 2], 6: [1, 2, 1, 2], 7: [2, 2, 1, 1],
                                                8: [1, 1, 2, 2], 9: [2, 1, 2, 1],
                                            };
                                            for (let v_ebec57 = 0; v_ebec57 < v_2d619f.length; v_ebec57++) {
                                                const v_5f701e = parseInt(v_2d619f[v_ebec57]);
                                                const v_2b8b40 = v_10d904[v_5f701e] ?? v_10d904[0];
                                                v_2b8b40.forEach((v_8e4fb6, v_e86ad8) => {
                                                    v_192d5d.push({ width: v_8e4fb6 * 2, isBlack: v_e86ad8 % 2 === 0 });
                                                });
                                            }
                                            return v_192d5d.map((v_d54210, v_e86ad8) => (
                                                <View
                                                    key={v_e86ad8}
                                                    style={[
                                                        v_d81136.barcodeLine,
                                                        { width: v_d54210.width, height: v_d54210.isBlack ? 90 : 0, backgroundColor: v_d54210.isBlack ? '#000000' : '#FFFFFF' },
                                                    ]}
                                                />
                                            ));
                                        })()
                                    ) : (
                                        <Text style={v_d81136.barcodeNoImageText}>바코드 이미지가 없습니다.</Text>
                                    )}
                                </View>
                            )}
                        </View>
                        {!v_e47051 && v_c9c6be.barcodeNumber ? (
                            <Text style={v_d81136.barcodeNumber}>{v_c9c6be.barcodeNumber}</Text>
                        ) : null}
                    </View>
                </View>
            </View>

            {}
            <View style={[v_d81136.buttonContainer, { paddingBottom: v_365f44 + 20 }]}>
                <TouchableOpacity
                    style={v_d81136.saveButton}
                    onPress={v_dda6bb}
                    activeOpacity={0.85}
                >
                    <LinearGradient
                        colors={['#1E3A5F', '#2D4A6F']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={v_d81136.saveButtonGradient}
                    >
                        <Feather name="download" size={20} color="#FFFFFF" />
                        <Text style={v_d81136.saveButtonText}>이미지 저장하기</Text>
                    </LinearGradient>
                </TouchableOpacity>
            </View>
        </SafeView>
    );
};

const v_d81136 = v_472849.create({
    container: {
        ...v_a61db3.container,
        backgroundColor: '#FFFFFF',
    },
    content: {
        flex: 1,
        paddingHorizontal: 10,
        paddingTop: 10,
        paddingBottom: 120,
    },
    ticketContainer: {
        flex: 1,
        width: '100%',
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
    },
    barcodeContainer: {
        flex: 1,
        width: '100%',
        alignItems: 'center',
    },
    barcodeImageContainer: {
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FFFFFF',
    },
    barcodeImageContainerLarge: {
        width: '100%',
        height: '100%',
    },
    couponImage: {
        width: '100%',
        height: '100%',
        minHeight: 120,
    },
    barcodePlaceholder: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: 100,
        width: '100%',
        backgroundColor: '#FFFFFF',
        paddingVertical: 10,
    },
    barcodeLine: {
        marginHorizontal: 0.5,
        minHeight: 80,
    },
    barcodeNumber: {
        fontSize: 14,
        fontFamily: 'Roboto-Regular',
        color: '#111827',
        letterSpacing: 2,
    },
    barcodeNoImageText: {
        fontSize: 14,
        fontFamily: 'Roboto-Regular',
        color: '#6B7280',
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
    },
    saveButton: {
        borderRadius: 14,
        overflow: 'hidden',
        shadowColor: '#1E3A5F',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 10,
        elevation: 8,
    },
    saveButtonGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 18,
        gap: 10,
    },
    saveButtonText: {
        fontSize: 17,
        fontFamily: 'Roboto-Bold',
        color: '#FFFFFF',
        letterSpacing: 0.3,
    },
});

