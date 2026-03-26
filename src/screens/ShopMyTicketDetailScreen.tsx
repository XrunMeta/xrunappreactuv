import v_a3453e from 'bapkr';
import { v_3094a2, v_472849, v_19b633, v_4623af, v_cf9c33, v_07a341, v_326be8 } from 'rcmrninabrnb';
import { v_556baf } from '../components';
import { v_b5df25 } from 'ernurodqvmtspux';
import { v_772971 } from 'jmpfvteuuztnp';
import { v_729608 } from '../components';
import { v_a0daa8 } from '../navigation';
import { v_700ef9 } from '../context';
import { v_4b1173 } from '../context/AlertDialogContext';
import { v_47cccc } from '../services';
import { v_a61db3 } from '../constants';
import { v_e0068c } from 'vvfgtwbmdpbnvhtfbtbgudicfmpscw';
import { v_c18c22 } from 'svuoaeceudfxfjvvpmmmchnwljywbphjgb';
import { v_5ade23 } from 'xbfwaaanosqvazmrqoah';
import { v_dec439 } from 'zvyjokvuouwvifyzks';
import * as v_f38d26 from 'lbosdxgirxcherxohyvziam';
import * as v_8682f1 from 'xfwnoqvryfjuilcdia';
import * as v_3c288d from 'bxoplsnixpmvnirxbbkstg';

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
    const { showAlert: v_889fad } = v_4b1173();
    const v_033e14 = v_e0068c();
    const v_f9771e = v_c18c22(0);

    const v_365f44 = v_326be8.OS === 'ios'
        ? v_033e14.bottom
        : Math.max(v_f9771e, v_033e14.bottom);

    const v_467ee6 = (v_dfe883 as any)?.couponImgUrl;
    const v_e47051 = typeof v_467ee6 === 'string' && v_467ee6.trim().length > 0;
    const v_02e0f3 = (v_dfe883 as any)?.trId || (v_dfe883 as any)?.tr_id;
    const v_717992 = (v_dfe883 as any)?.memberId || (v_dfe883 as any)?.member;
    const [v_4592c9, v_c3172e] = v_a3453e.useState(false);

    const v_c9c6be = v_dfe883 ? {
        id: v_dfe883.id || '1',
        brand: (v_dfe883 as any).brand || '스타벅스',
        title: v_dfe883.title || '',
        image: v_dfe883.image || v_f158ec.image,
        barcodeNumber: (v_dfe883 as any).barcodeNumber || '1231 1231 1231 1231',
    } : v_f158ec;

    const v_dda6bb = async () => {
        console.warn('[내 티켓] 이미지 저장 버튼 클릭됨');
        console.log('[내 티켓] 이미지 저장 시작');
        if (!v_e47051) {
            console.log('[내 티켓] 저장 중단: 바코드 이미지 URL 없음');
            await v_889fad(v_8d41d7('screens.shopMyTicket.alerts.notification'), v_8d41d7('screens.shopMyTicket.alerts.noBarcodeImage'));
            return;
        }

        try {
            const v_d1a6bb = await v_8682f1.requestPermissionsAsync();
            console.log('[내 티켓] MediaLibrary 권한:', v_d1a6bb.status, {
                canAskAgain: v_d1a6bb.canAskAgain,
                granted: v_d1a6bb.granted,
            });
            if (v_d1a6bb.status !== 'granted') {
                console.log('[내 티켓] 저장 중단: 권한 거부');
                await v_889fad(v_8d41d7('screens.shopMyTicket.alerts.permissionTitle'), v_8d41d7('screens.shopMyTicket.alerts.permissionRequired'));
                return;
            }

            const v_8a33c8 = v_467ee6!.trim();
            console.log('[내 티켓] 저장 대상 이미지 URL:', v_8a33c8);
            const v_d1aac0 = v_f38d26.cacheDirectory || v_f38d26.documentDirectory;
            console.log('[내 티켓] 저장 경로 확인:', {
                cacheDirectory: v_f38d26.cacheDirectory,
                documentDirectory: v_f38d26.documentDirectory,
                selected: v_d1aac0,
            });
            if (!v_d1aac0) {
                throw new Error('저장 경로를 찾을 수 없습니다.');
            }

            const v_760511 = v_8a33c8.includes('.png')
                ? 'png'
                : v_8a33c8.includes('.webp')
                    ? 'webp'
                    : 'jpg';
            const v_0c2fb2 = `${v_d1aac0}ticket_barcode_${Date.now()}.${v_760511}`;
            console.log('[내 티켓] 다운로드 시작:', { fileUri: v_0c2fb2, extension: v_760511 });

            const v_42ab49 = await v_f38d26.downloadAsync(v_8a33c8, v_0c2fb2);
            console.log('[내 티켓] 다운로드 완료:', v_42ab49);

            let v_fc67b4 = v_42ab49.uri;
            let v_70fb6d = null;
            if (v_326be8.OS === 'ios' && (v_760511 === 'webp' || !v_8a33c8.match(/\.(jpg|jpeg|png)$/i))) {
                try {
                    const v_43c42e = await v_3c288d.manipulateAsync(v_42ab49.uri, [], {
                        compress: 1,
                        format: v_3c288d.SaveFormat.JPEG,
                    });
                    v_fc67b4 = v_43c42e.uri;
                    v_70fb6d = v_43c42e.uri;
                    console.log('[내 티켓] iOS JPEG 변환 완료:', v_fc67b4);
                } catch (v_40b3c0) {
                    console.warn('[내 티켓] iOS JPEG 변환 실패, 원본으로 시도:', v_40b3c0);
                }
            }

            await v_8682f1.saveToLibraryAsync(v_fc67b4);
            console.log('[내 티켓] saveToLibraryAsync 완료:', v_fc67b4);

            try {
                const v_b76cd8 = await v_8682f1.createAssetAsync(v_fc67b4);
                console.log('[내 티켓] Asset 생성 완료:', v_b76cd8?.uri);
                try {
                    await v_8682f1.createAlbumAsync('XRUN', v_b76cd8, false);
                    console.log('[내 티켓] XRUN 앨범 생성 완료');
                } catch (v_52de11) {
                    console.warn('[내 티켓] XRUN 앨범 생성 스킵:', v_52de11);
                }
            } catch (v_c75bfa) {
                console.warn('[내 티켓] Asset 생성 스킵(저장은 완료):', v_c75bfa);
            }

            try {
                await v_f38d26.deleteAsync(v_42ab49.uri, { idempotent: true });
                console.log('[내 티켓] 임시 파일 삭제 완료:', v_42ab49.uri);
            } catch (v_fa1679) {
                console.warn('[내 티켓] 임시 파일 삭제 스킵:', v_fa1679);
            }
            if (v_70fb6d && v_70fb6d !== v_42ab49.uri) {
                try {
                    await v_f38d26.deleteAsync(v_70fb6d, { idempotent: true });
                } catch (v_37eab7) {}
            }

            console.log('[내 티켓] 이미지 저장 성공');
            await v_889fad(v_8d41d7('screens.shopMyTicket.alerts.saveSuccessTitle'), v_8d41d7('screens.shopMyTicket.alerts.saveSuccess'));
        } catch (v_5e9bfe) {
            console.error('[내 티켓] 이미지 저장 실패:', v_5e9bfe);
            await v_889fad(v_8d41d7('screens.shopMyTicket.alerts.saveFailedTitle'), v_8d41d7('screens.shopMyTicket.alerts.saveFailed'));
        }
    };

    const v_df2aa2 = async () => {
        if (!v_02e0f3 || !v_717992) {
            await v_889fad(v_8d41d7('screens.shopMyTicket.alerts.notification'), v_8d41d7('screens.shopMyTicket.alerts.cancelNoInfo'));
            return;
        }
        const v_af3e48 = await v_889fad(
            v_8d41d7('screens.shopMyTicket.alerts.cancelTitle'),
            v_8d41d7('screens.shopMyTicket.alerts.cancelConfirm'),
            [
                { text: v_8d41d7('screens.shopMyTicket.alerts.cancelNo') },
                { text: v_8d41d7('screens.shopMyTicket.alerts.cancelYes') },
            ],
        );
        if (v_af3e48 !== 1) return;

        v_c3172e(true);
        try {
            const v_8f00b9 = await v_47cccc(String(v_717992), v_02e0f3);
            if (v_8f00b9.status === 'success') {
                await v_889fad(v_8d41d7('screens.shopMyTicket.alerts.notification'), v_8d41d7('screens.shopMyTicket.alerts.cancelSuccess'));
                v_c7ac57();
            } else {
                await v_889fad(v_8d41d7('screens.shopMyTicket.alerts.cancelFailedTitle'), v_8f00b9.message || v_8d41d7('screens.shopMyTicket.alerts.cancelFailed'));
            }
        } catch (v_9e86fd) {
            await v_889fad(v_8d41d7('screens.shopMyTicket.alerts.cancelFailedTitle'), v_8d41d7('screens.shopMyTicket.alerts.cancelFailed'));
        } finally {
            v_c3172e(false);
        }
    };

    return (
        <SafeView style={v_d81136.container} backgroundColor="#FFFFFF">
            <StatusBar style="dark" />
            <Header
                title={v_8d41d7('screens.shopMyTicket.title')}
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
                    onPress={() => {
                        console.warn('[내 티켓] onPress 진입');
                        v_dda6bb();
                    }}
                    activeOpacity={0.85}
                >
                    <LinearGradient
                        colors={['#1E3A5F', '#2D4A6F']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={v_d81136.saveButtonGradient}
                    >
                        <Feather name="download" size={20} color="#FFFFFF" />
                        <Text style={v_d81136.saveButtonText}>{v_8d41d7('screens.shopMyTicket.saveImage')}</Text>
                    </LinearGradient>
                </TouchableOpacity>

                {v_02e0f3 && (
                    <TouchableOpacity
                        style={v_d81136.cancelButton}
                        onPress={v_df2aa2}
                        activeOpacity={0.85}
                        disabled={v_4592c9}
                    >
                        <View style={v_d81136.cancelButtonInner}>
                            <Feather name="trash-2" size={20} color="#DC2626" />
                            <Text style={v_d81136.cancelButtonText}>
                                {v_4592c9 ? '취소 중...' : v_8d41d7('screens.shopMyTicket.cancelCoupon')}
                            </Text>
                        </View>
                    </TouchableOpacity>
                )}
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
    cancelButton: {
        marginTop: 10,
        borderRadius: 14,
        overflow: 'hidden',
        borderWidth: 1.5,
        borderColor: '#DC2626',
    },
    cancelButtonInner: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
        gap: 10,
        backgroundColor: '#FFFFFF',
    },
    cancelButtonText: {
        fontSize: 17,
        fontFamily: 'Roboto-Bold',
        color: '#DC2626',
        letterSpacing: 0.3,
    },
});

