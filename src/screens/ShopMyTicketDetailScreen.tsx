import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Image, ImageSourcePropType, Platform } from 'react-native';
import { SafeView, SafeScrollView } from '../components';
import { StatusBar } from 'expo-status-bar';
import { useTranslation } from 'react-i18next';
import { Header } from '../components';
import { useAppNavigation } from '../navigation';
import { useAppContext } from '../context';
import { COMMON_STYLES } from '../constants';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAndroidNavigationBarHeight } from 'react-native-navigation-bar-height';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';

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
    const insets = useSafeAreaInsets();
    const navBarHeight = useAndroidNavigationBarHeight(0);

    const bottomSafeArea = Platform.OS === 'ios'
        ? insets.bottom
        : Math.max(navBarHeight, insets.bottom);

    const ticket: TicketData = selectedShopItem ? {
        id: selectedShopItem.id || '1',
        brand: (selectedShopItem as any).brand || '스타벅스',
        title: selectedShopItem.title || '',
        image: selectedShopItem.image || sampleTicket.image,
        barcodeNumber: (selectedShopItem as any).barcodeNumber || '1231 1231 1231 1231',
    } : sampleTicket;

    const handleSaveImage = () => {

    };

    return (
        <SafeView style={styles.container} backgroundColor="#FFFFFF">
            <StatusBar style="dark" />
            <Header
                title="내 티켓"
                onBackPress={goBack}
                showBackButton
            />
            <SafeScrollView showsVerticalScrollIndicator={false} showBottomBackground={false} backgroundColor="transparent" disableBottomPadding={true}>
                <View style={styles.content}>
                    {}
                    <View style={styles.ticketContainer}>
                        {}
                        <View style={styles.productImageContainer}>
                            <Image
                                source={ticket.image}
                                style={styles.productImage}
                                resizeMode="contain"
                            />
                        </View>

                        {}
                        <View style={styles.productInfo}>
                            <Text style={styles.brand}>{ticket.brand}</Text>
                            <Text style={styles.title}>{ticket.title}</Text>
                        </View>

                        {}
                        <View style={styles.barcodeContainer}>
                            {}
                            <View style={styles.barcodeImageContainer}>
                                {}
                                <View style={styles.barcodePlaceholder}>
                                    {}
                                    {(() => {
                                        const barcodeDigits = ticket.barcodeNumber.replace(/\s/g, '');
                                        const bars: Array<{ width: number; isBlack: boolean }> = [];

                                        for (let i = 0; i < barcodeDigits.length; i++) {
                                            const digit = parseInt(barcodeDigits[i]);

                                            const patterns: { [key: number]: number[] } = {
                                                0: [2, 1, 1, 2], 
                                                1: [2, 1, 2, 1],
                                                2: [1, 2, 2, 1],
                                                3: [2, 2, 1, 1],
                                                4: [1, 1, 2, 2],
                                                5: [2, 1, 1, 2],
                                                6: [1, 2, 1, 2],
                                                7: [2, 2, 1, 1],
                                                8: [1, 1, 2, 2],
                                                9: [2, 1, 2, 1],
                                            };

                                            const pattern = patterns[digit] || patterns[0];
                                            pattern.forEach((width, idx) => {
                                                bars.push({
                                                    width: width * 2,
                                                    isBlack: idx % 2 === 0,
                                                });
                                            });
                                        }

                                        return bars.map((bar, idx) => (
                                            <View
                                                key={idx}
                                                style={[
                                                    styles.barcodeLine,
                                                    {
                                                        width: bar.width,
                                                        height: bar.isBlack ? 90 : 0,
                                                        backgroundColor: bar.isBlack ? '#000000' : '#FFFFFF',
                                                    },
                                                ]}
                                            />
                                        ));
                                    })()}
                                </View>
                            </View>
                            <Text style={styles.barcodeNumber}>{ticket.barcodeNumber}</Text>
                        </View>
                    </View>
                </View>
            </SafeScrollView>

            {}
            <View style={[styles.buttonContainer, { paddingBottom: bottomSafeArea + 20 }]}>
                <TouchableOpacity
                    style={styles.saveButton}
                    onPress={handleSaveImage}
                    activeOpacity={0.85}
                >
                    <LinearGradient
                        colors={['#1E3A5F', '#2D4A6F']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.saveButtonGradient}
                    >
                        <Feather name="download" size={20} color="#FFFFFF" />
                        <Text style={styles.saveButtonText}>이미지 저장하기</Text>
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
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 120,
    },
    ticketContainer: {
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
        paddingBottom: 20,
    },
    productImageContainer: {
        width: '100%',
        maxWidth: 300,
        height: 300,
        marginBottom: 24,
        alignItems: 'center',
        justifyContent: 'center',
    },
    productImage: {
        width: '100%',
        height: '100%',
    },
    productInfo: {
        alignItems: 'center',
        marginBottom: 32,
    },
    brand: {
        fontSize: 16,
        fontFamily: 'Roboto-Medium',
        color: '#111827',
        marginBottom: 8,
    },
    title: {
        fontSize: 16,
        fontFamily: 'Roboto-Bold',
        color: '#111827',
        textAlign: 'center',
        lineHeight: 24,
    },
    barcodeContainer: {
        width: '100%',
        alignItems: 'center',
    },
    barcodeImageContainer: {
        width: '100%',
        maxWidth: 280,
        height: 120,
        marginBottom: 12,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FFFFFF',
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

