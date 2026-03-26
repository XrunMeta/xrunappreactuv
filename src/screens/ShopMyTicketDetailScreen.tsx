import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Image, ImageSourcePropType, Platform } from 'react-native';
import { SafeView } from '../components';
import { StatusBar } from 'expo-status-bar';
import { useTranslation } from 'react-i18next';
import { Header } from '../components';
import { useAppNavigation } from '../navigation';
import { useAppContext } from '../context';
import { useAlertDialog } from '../context/AlertDialogContext';
import { COMMON_STYLES } from '../constants';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAndroidNavigationBarHeight } from 'react-native-navigation-bar-height';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system/legacy';
import * as MediaLibrary from 'expo-media-library';
import * as ImageManipulator from 'expo-image-manipulator';

interface TicketData {
    id: string;
    brand: string;
    title: string;
    image: ImageSourcePropType;
    barcodeNumber: string;
}

const sampleTicket: TicketData = {
    id: '1',
    brand: '스타벅스',
    title: '스타벅스 아메리카노 Tall 2 + 카스텔라 2EA',
    image: require('../../assets/sample_starbugs.png'),
    barcodeNumber: '1231 1231 1231 1231',
};

export const ShopMyTicketDetailScreen = () => {
    const { goBack } = useAppNavigation();
    const { t } = useTranslation();
    const { selectedShopItem } = useAppContext();
    const { showAlert } = useAlertDialog();
    const insets = useSafeAreaInsets();
    const navBarHeight = useAndroidNavigationBarHeight(0);

    const bottomSafeArea = Platform.OS === 'ios'
        ? insets.bottom
        : Math.max(navBarHeight, insets.bottom);

    const couponImgUrl = (selectedShopItem as any)?.couponImgUrl;
    const hasBarcodeImageUrl = typeof couponImgUrl === 'string' && couponImgUrl.trim().length > 0;

    const ticket: TicketData = selectedShopItem ? {
        id: selectedShopItem.id || '1',
        brand: (selectedShopItem as any).brand || '스타벅스',
        title: selectedShopItem.title || '',
        image: selectedShopItem.image || sampleTicket.image,
        barcodeNumber: (selectedShopItem as any).barcodeNumber || '1231 1231 1231 1231',
    } : sampleTicket;

    const handleSaveImage = async () => {
        console.warn('[내 티켓] 이미지 저장 버튼 클릭됨');
        console.log('[내 티켓] 이미지 저장 시작');
        if (!hasBarcodeImageUrl) {
            console.log('[내 티켓] 저장 중단: 바코드 이미지 URL 없음');
            await showAlert(t('screens.shopMyTicket.alerts.notification'), t('screens.shopMyTicket.alerts.noBarcodeImage'));
            return;
        }

        try {
            const permission = await MediaLibrary.requestPermissionsAsync();
            console.log('[내 티켓] MediaLibrary 권한:', permission.status, {
                canAskAgain: permission.canAskAgain,
                granted: permission.granted,
            });
            if (permission.status !== 'granted') {
                console.log('[내 티켓] 저장 중단: 권한 거부');
                await showAlert(t('screens.shopMyTicket.alerts.permissionTitle'), t('screens.shopMyTicket.alerts.permissionRequired'));
                return;
            }

            const imageUrl = couponImgUrl!.trim();
            console.log('[내 티켓] 저장 대상 이미지 URL:', imageUrl);
            const cacheDir = FileSystem.cacheDirectory || FileSystem.documentDirectory;
            console.log('[내 티켓] 저장 경로 확인:', {
                cacheDirectory: FileSystem.cacheDirectory,
                documentDirectory: FileSystem.documentDirectory,
                selected: cacheDir,
            });
            if (!cacheDir) {
                throw new Error('저장 경로를 찾을 수 없습니다.');
            }

            const extension = imageUrl.includes('.png')
                ? 'png'
                : imageUrl.includes('.webp')
                    ? 'webp'
                    : 'jpg';
            const fileUri = `${cacheDir}ticket_barcode_${Date.now()}.${extension}`;
            console.log('[내 티켓] 다운로드 시작:', { fileUri, extension });

            const download = await FileSystem.downloadAsync(imageUrl, fileUri);
            console.log('[내 티켓] 다운로드 완료:', download);

            let uriToSave = download.uri;
            let jpegUri: string | null = null;
            if (Platform.OS === 'ios' && (extension === 'webp' || !imageUrl.match(/\.(jpg|jpeg|png)$/i))) {
                try {
                    const result = await ImageManipulator.manipulateAsync(download.uri, [], {
                        compress: 1,
                        format: ImageManipulator.SaveFormat.JPEG,
                    });
                    uriToSave = result.uri;
                    jpegUri = result.uri;
                    console.log('[내 티켓] iOS JPEG 변환 완료:', uriToSave);
                } catch (convertErr) {
                    console.warn('[내 티켓] iOS JPEG 변환 실패, 원본으로 시도:', convertErr);
                }
            }

            await MediaLibrary.saveToLibraryAsync(uriToSave);
            console.log('[내 티켓] saveToLibraryAsync 완료:', uriToSave);

            try {
                const asset = await MediaLibrary.createAssetAsync(uriToSave);
                console.log('[내 티켓] Asset 생성 완료:', asset?.uri);
                try {
                    await MediaLibrary.createAlbumAsync('XRUN', asset, false);
                    console.log('[내 티켓] XRUN 앨범 생성 완료');
                } catch (albumError) {
                    console.warn('[내 티켓] XRUN 앨범 생성 스킵:', albumError);
                }
            } catch (assetError) {
                console.warn('[내 티켓] Asset 생성 스킵(저장은 완료):', assetError);
            }

            try {
                await FileSystem.deleteAsync(download.uri, { idempotent: true });
                console.log('[내 티켓] 임시 파일 삭제 완료:', download.uri);
            } catch (deleteError) {
                console.warn('[내 티켓] 임시 파일 삭제 스킵:', deleteError);
            }
            if (jpegUri && jpegUri !== download.uri) {
                try {
                    await FileSystem.deleteAsync(jpegUri, { idempotent: true });
                } catch (_) {}
            }

            console.log('[내 티켓] 이미지 저장 성공');
            await showAlert(t('screens.shopMyTicket.alerts.saveSuccessTitle'), t('screens.shopMyTicket.alerts.saveSuccess'));
        } catch (error) {
            console.error('[내 티켓] 이미지 저장 실패:', error);
            await showAlert(t('screens.shopMyTicket.alerts.saveFailedTitle'), t('screens.shopMyTicket.alerts.saveFailed'));
        }
    };

    return (
        <SafeView style={styles.container} backgroundColor="#FFFFFF">
            <StatusBar style="dark" />
            <Header
                title={t('screens.shopMyTicket.title')}
                onBackPress={goBack}
                showBackButton
            />
            <View style={styles.content}>
                <View style={styles.ticketContainer}>
                    {}
                    <View style={styles.barcodeContainer}>
                        <View style={[styles.barcodeImageContainer, hasBarcodeImageUrl && styles.barcodeImageContainerLarge]}>
                            {hasBarcodeImageUrl ? (
                                <Image
                                    source={{ uri: couponImgUrl!.trim() }}
                                    style={styles.couponImage}
                                    resizeMode="cover"
                                />
                            ) : (
                                <View style={styles.barcodePlaceholder}>
                                    {ticket.barcodeNumber ? (
                                        (() => {
                                            const barcodeDigits = ticket.barcodeNumber.replace(/\s/g, '');
                                            const bars: Array<{ width: number; isBlack: boolean }> = [];
                                            const patterns: { [key: number]: number[] } = {
                                                0: [2, 1, 1, 2], 1: [2, 1, 2, 1], 2: [1, 2, 2, 1], 3: [2, 2, 1, 1],
                                                4: [1, 1, 2, 2], 5: [2, 1, 1, 2], 6: [1, 2, 1, 2], 7: [2, 2, 1, 1],
                                                8: [1, 1, 2, 2], 9: [2, 1, 2, 1],
                                            };
                                            for (let i = 0; i < barcodeDigits.length; i++) {
                                                const digit = parseInt(barcodeDigits[i]);
                                                const pattern = patterns[digit] ?? patterns[0];
                                                pattern.forEach((width, idx) => {
                                                    bars.push({ width: width * 2, isBlack: idx % 2 === 0 });
                                                });
                                            }
                                            return bars.map((bar, idx) => (
                                                <View
                                                    key={idx}
                                                    style={[
                                                        styles.barcodeLine,
                                                        { width: bar.width, height: bar.isBlack ? 90 : 0, backgroundColor: bar.isBlack ? '#000000' : '#FFFFFF' },
                                                    ]}
                                                />
                                            ));
                                        })()
                                    ) : (
                                        <Text style={styles.barcodeNoImageText}>바코드 이미지가 없습니다.</Text>
                                    )}
                                </View>
                            )}
                        </View>
                        {!hasBarcodeImageUrl && ticket.barcodeNumber ? (
                            <Text style={styles.barcodeNumber}>{ticket.barcodeNumber}</Text>
                        ) : null}
                    </View>
                </View>
            </View>

            {}
            <View style={[styles.buttonContainer, { paddingBottom: bottomSafeArea + 20 }]}>
                <TouchableOpacity
                    style={styles.saveButton}
                    onPress={() => {
                        console.warn('[내 티켓] onPress 진입');
                        handleSaveImage();
                    }}
                    activeOpacity={0.85}
                >
                    <LinearGradient
                        colors={['#1E3A5F', '#2D4A6F']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.saveButtonGradient}
                    >
                        <Feather name="download" size={20} color="#FFFFFF" />
                        <Text style={styles.saveButtonText}>{t('screens.shopMyTicket.saveImage')}</Text>
                    </LinearGradient>
                </TouchableOpacity>

            </View>
        </SafeView>
    );
};

const styles = StyleSheet.create({
    container: {
        ...COMMON_STYLES.container,
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

