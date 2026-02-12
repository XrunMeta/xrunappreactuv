import React, { useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Image, ImageSourcePropType, ScrollView, Platform, TextInput, Modal } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeView, SafeScrollView } from '../components';
import { StatusBar } from 'expo-status-bar';
import { useTranslation } from 'react-i18next';
import { Header } from '../components';
import { useAppNavigation, ROUTES } from '../navigation';
import { useAppContext } from '../context';
import { useAlertDialog } from '../context/AlertDialogContext';
import { COLORS, COMMON_STYLES, FONTS, SIZES } from '../constants';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAndroidNavigationBarHeight } from 'react-native-navigation-bar-height';
import { Feather, Ionicons } from '@expo/vector-icons';

const xplaySymbol = require('../../assets/xplay_symbol.png');
const xrunRoundLogo = require('../../assets/xrun-round-logo.png');
const ethereumThumb = require('../../assets/images/ethereum_thumb.png');

interface ProductDetailData {
    id: string;
    brand: string;
    title: string;
    description?: string;
    price: number;
    image: ImageSourcePropType;
    isXrun?: boolean;
}

const sampleProduct: ProductDetailData = {
    id: '1',
    brand: '스타벅스',
    title: '스타벅스 아메리카노 Tall 2 + 카스텔라 2 EA',
    price: 2000,
    image: require('../../assets/sample_starbugs.png'),
    isXrun: false,
};

export const ShopProductDetailScreen = () => {
    const { goBack, navigate } = useAppNavigation();
    const { t } = useTranslation();
    const { showAlert } = useAlertDialog();
    const { selectedShopItem } = useAppContext();
    const insets = useSafeAreaInsets();
    const navBarHeight = useAndroidNavigationBarHeight(0);

    const bottomSafeArea = Platform.OS === 'ios'
        ? insets.bottom
        : Math.max(navBarHeight, insets.bottom);

    const product: ProductDetailData = selectedShopItem ? {
        id: selectedShopItem.id || '1',
        brand: (selectedShopItem as any).brand || '스타벅스',
        title: selectedShopItem.title || '',
        description: (selectedShopItem as any).description,
        price: parseInt(selectedShopItem.priceLabel?.replace(/,/g, '') || '0'),
        image: selectedShopItem.image || sampleProduct.image,
        isXrun: (selectedShopItem as any).isXrun || false,
    } : sampleProduct;

    const isExchangeProduct = product.brand === 'Ethereum' || product.title.includes('교환권');

    const [depositAddress, setDepositAddress] = useState<string>('');
    const [xplayAmount, setXplayAmount] = useState<string>('');
    const [xplayBalance] = useState<number>(50000); 
    const minAmount = 30000;
    const ethereumRate = 3070000; 
    const cryptoFee = 2000; 
    const withdrawalFee = 0;

    const xplayToUse = xplayAmount ? parseInt(xplayAmount.replace(/,/g, '')) : 0;
    const totalXplay = xplayToUse + cryptoFee + withdrawalFee;
    const ethereumAmount = xplayToUse > 0 ? (xplayToUse / ethereumRate).toFixed(6) : '0';

    const handleMaxAmount = () => {
        setXplayAmount(xplayBalance.toLocaleString());
    };

    const handleQrScan = () => {

        navigate(ROUTES.walletQrScan);

    };

    const handleExchange = () => {
        if (!depositAddress.trim()) {
            showAlert('알림', '입금주소를 입력해주세요.', [{ text: '확인' }]);
            return;
        }
        if (!xplayAmount || xplayToUse < minAmount) {
            showAlert('알림', `최소 ${minAmount.toLocaleString()} Xplay 이상 입력해주세요.`, [{ text: '확인' }]);
            return;
        }
        showAlert('교환', 'Ethereum으로 교환하시겠습니까?', [
            { text: '취소' },
            { text: '교환', onPress: () => console.log('교환:', { depositAddress, xplayAmount }) },
        ]);
    };

    if (isExchangeProduct) {
        return (
            <SafeView style={styles.container} backgroundColor="#FFFFFF">
                <StatusBar style="dark" />
                <Header
                    title="Ethereum 교환"
                    onBackPress={goBack}
                    showBackButton
                />

                <SafeScrollView showsVerticalScrollIndicator={false} showBottomBackground={false} backgroundColor="transparent" disableBottomPadding={true}>
                    <View style={styles.exchangeContent}>
                        {}
                        <View style={styles.infoBanner}>
                            <Text style={styles.infoBannerText}>
                                암호화폐 출금은 전송되는 데 몇 분 정도 소요됩니다. 출금의 최소 금액은 30,000 Xplay 입니다.
                            </Text>
                        </View>

                        {}
                        <View style={styles.inputSection}>
                            <Text style={styles.inputLabel}>입금주소</Text>
                            <View style={styles.inputContainer}>
                                <TextInput
                                    style={styles.input}
                                    placeholder="..."
                                    value={depositAddress}
                                    onChangeText={setDepositAddress}
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                />
                                <TouchableOpacity onPress={handleQrScan} style={styles.qrButton}>
                                    <Ionicons name="qr-code-outline" size={22} color="#111827" />
                                </TouchableOpacity>
                            </View>
                        </View>

                        {}
                        <View style={styles.inputSection}>
                            <Text style={styles.inputLabel}>Xplay</Text>
                            <View style={styles.inputContainer}>
                                <TextInput
                                    style={styles.input}
                                    placeholder=""
                                    value={xplayAmount}
                                    onChangeText={(text) => {
                                        const numbers = text.replace(/[^0-9]/g, '');
                                        setXplayAmount(numbers ? parseInt(numbers).toLocaleString() : '');
                                    }}
                                    keyboardType="numeric"
                                />
                                <TouchableOpacity onPress={handleMaxAmount} style={styles.maxButton}>
                                    <Text style={styles.maxButtonText}>최대 금액</Text>
                                </TouchableOpacity>
                            </View>
                            <Text style={styles.minAmountHint}>최소 30,000 Xplay</Text>
                        </View>

                        {}
                        <View style={styles.summarySection}>
                            <View style={styles.summaryRow}>
                                <Text style={styles.summaryLabel}>Ethereum 환율</Text>
                                <Text style={styles.summaryValue}>{ethereumRate.toLocaleString()}</Text>
                            </View>
                            <View style={styles.summaryRow}>
                                <Text style={styles.summaryLabel}>암호화폐 수수료</Text>
                                <Text style={styles.summaryValue}>{cryptoFee.toLocaleString()}</Text>
                            </View>
                            <View style={styles.summaryRow}>
                                <Text style={styles.summaryLabel}>출금 수수료</Text>
                                <Text style={styles.summaryValue}>{withdrawalFee.toLocaleString()}</Text>
                            </View>
                            <View style={styles.summaryRow}>
                                <Text style={styles.summaryLabel}>사용할 Xplay</Text>
                                <Text style={styles.summaryValue}>{xplayToUse.toLocaleString()}</Text>
                            </View>
                            <View style={styles.summaryRowLast}>
                                <Text style={styles.summaryLabel}>받으실 금액(Ethereum)</Text>
                                <Text style={styles.summaryValueBold}>{ethereumAmount}</Text>
                            </View>
                        </View>
                    </View>
                </SafeScrollView>

                {}
                <View style={[styles.exchangeButtonContainer, { paddingBottom: bottomSafeArea + 20 }]}>
                    <TouchableOpacity
                        style={styles.exchangeButton}
                        onPress={handleExchange}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.exchangeButtonText}>교환하기</Text>
                    </TouchableOpacity>
                </View>
            </SafeView>
        );
    }

    const [xrunBalance] = useState<number>(20000);
    const remainingBalance = xrunBalance - product.price;
    const [paymentSuccessVisible, setPaymentSuccessVisible] = useState<boolean>(false);

    const handlePurchase = () => {
        showAlert('구매', `${product.title}을(를) 구매하시겠습니까?`, [
            { text: '취소' },
            {
                text: '구매',
                onPress: () => {

                    console.log('구매:', product.id);

                    setPaymentSuccessVisible(true);
                }
            },
        ]);
    };

    const handlePaymentSuccessClose = () => {
        setPaymentSuccessVisible(false);

    };

    const isXrun = product.isXrun || product.brand === 'XRUN';
    const coinIcon = isXrun ? xrunRoundLogo : xplaySymbol;

    return (
        <SafeView style={styles.container} backgroundColor="#F8FAFC">
            <StatusBar style="dark" />
            <Header
                title="상품정보"
                onBackPress={goBack}
                showBackButton
            />
            <SafeScrollView showsVerticalScrollIndicator={false} showBottomBackground={false} backgroundColor="transparent" disableBottomPadding={true}>
                <View style={styles.content}>
                    {}
                    <View style={styles.productCard}>
                        <View style={styles.productImageContainer}>
                            <View style={styles.productImageWrapper}>
                                <Image
                                    source={product.image}
                                    style={styles.productImage}
                                    resizeMode="contain"
                                />
                            </View>
                        </View>
                        <View style={styles.productInfoContainer}>
                            <View style={styles.brandContainer}>
                                <Text style={styles.brand}>{product.brand}</Text>
                            </View>
                            <Text style={styles.title}>{product.title}</Text>
                        </View>
                    </View>

                    {}
                    <View style={styles.paymentCard}>
                        <View style={styles.sectionHeader}>
                            <Feather name="credit-card" size={18} color="#1E3A5F" />
                            <Text style={styles.sectionTitle}>결제 정보</Text>
                        </View>
                        <View style={styles.divider} />
                        <View style={styles.paymentRow}>
                            <Text style={styles.paymentLabel}>결제금액</Text>
                            <View style={styles.priceContainer}>
                                <Image source={coinIcon} style={styles.coinIcon} resizeMode="contain" />
                                <Text style={styles.paymentValue}>{product.price.toLocaleString()} XRUN</Text>
                            </View>
                        </View>
                        <View style={styles.paymentRow}>
                            <Text style={styles.paymentLabel}>내보유 XRUN</Text>
                            <Text style={styles.paymentBalance}>{xrunBalance.toLocaleString()} XRUN</Text>
                        </View>
                        <View style={styles.paymentRowLast}>
                            <Text style={styles.paymentLabel}>구매 후 잔여 XRUN</Text>
                            <Text style={styles.paymentRemaining}>{remainingBalance.toLocaleString()} XRUN</Text>
                        </View>
                    </View>

                    {}
                    <View style={styles.guideCard}>
                        <View style={styles.sectionHeader}>
                            <Feather name="info" size={18} color="#1E3A5F" />
                            <Text style={styles.sectionTitle}>이용 안내</Text>
                        </View>
                        <View style={styles.divider} />

                        <View style={styles.guideItem}>
                            <View style={styles.guideItemHeader}>
                                <View style={styles.guideNumber}>
                                    <Text style={styles.guideNumberText}>1</Text>
                                </View>
                                <Text style={styles.guideSubtitle}>취소 및 환불 규정</Text>
                            </View>
                            <View style={styles.guideTextContainer}>
                                <Text style={styles.guideText}>• 본 상품은 구매 즉시 발송되는 디지털 쿠폰(모바일 쿠폰/바코드)입니다.</Text>
                                <Text style={styles.guideText}>• 쿠폰번호(PIN) 발행 후 사용 여부 확인이 불가능하므로 단순 변심에 의한 취소 및 환불은 불가능합니다.</Text>
                                <Text style={styles.guideText}>• 상품 품절 등 교환 불가 사유 발생 시에만 100% 환불 처리됩니다.</Text>
                            </View>
                        </View>

                        <View style={styles.guideItem}>
                            <View style={styles.guideItemHeader}>
                                <View style={styles.guideNumber}>
                                    <Text style={styles.guideNumberText}>2</Text>
                                </View>
                                <Text style={styles.guideSubtitle}>이용 안내</Text>
                            </View>
                            <View style={styles.guideTextContainer}>
                                <Text style={styles.guideText}>• 전국 교환처(해당 브랜드 매장)에서 결제 시 모바일 쿠폰을 제시해 주세요.</Text>
                                <Text style={styles.guideText}>• 매장 재고에 따라 상품이 제공되지 않을 수 있으며, 이 경우 동일 가격 이상의 다른 상품으로 교환 가능합니다(차액 지불).</Text>
                            </View>
                        </View>
                    </View>
                </View>
            </SafeScrollView>

            {}
            <View style={[styles.buttonContainer, { paddingBottom: bottomSafeArea + 20 }]}>
                <TouchableOpacity
                    style={styles.purchaseButton}
                    onPress={handlePurchase}
                    activeOpacity={0.8}
                >
                    <LinearGradient
                        colors={['#1E3A5F', '#2D4A6F']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.purchaseButtonGradient}
                    >
                        <Feather name="shopping-cart" size={18} color="#FFFFFF" style={styles.purchaseIcon} />
                        <Text style={styles.purchaseButtonText}>구매하기</Text>
                    </LinearGradient>
                </TouchableOpacity>
            </View>

            {}
            <Modal
                visible={paymentSuccessVisible}
                transparent={true}
                animationType="fade"
                onRequestClose={handlePaymentSuccessClose}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.paymentSuccessModal}>
                        {}
                        <View style={styles.modalLogoContainer}>
                            <Image
                                source={xrunRoundLogo}
                                style={styles.modalLogo}
                                resizeMode="contain"
                            />
                        </View>

                        {}
                        <Text style={styles.paymentSuccessMessage}>결제가 완료되었습니다</Text>

                        {}
                        <TouchableOpacity
                            style={styles.paymentSuccessButton}
                            onPress={handlePaymentSuccessClose}
                            activeOpacity={0.8}
                        >
                            <Text style={styles.paymentSuccessButtonText}>확인</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </SafeView>
    );
};

const styles = StyleSheet.create({
    container: {
        ...COMMON_STYLES.container,
        backgroundColor: '#F8FAFC',
    },

    exchangeContent: {
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 120,
    },
    infoBanner: {
        backgroundColor: '#F3F4F6',
        borderRadius: 12,
        padding: 16,
        marginBottom: 24,
    },
    infoBannerText: {
        fontSize: 14,
        fontFamily: 'Roboto-Regular',
        color: '#374151',
        lineHeight: 20,
    },
    inputSection: {
        marginBottom: 24,
    },
    inputLabel: {
        fontSize: 15,
        fontFamily: 'Roboto-Medium',
        color: '#111827',
        marginBottom: 8,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        paddingHorizontal: 16,
        height: 52,
    },
    input: {
        flex: 1,
        fontSize: 15,
        fontFamily: 'Roboto-Regular',
        color: '#111827',
    },
    qrButton: {
        padding: 4,
    },
    maxButton: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        backgroundColor: '#F3F4F6',
        borderRadius: 8,
    },
    maxButtonText: {
        fontSize: 13,
        fontFamily: 'Roboto-Medium',
        color: '#6B7280',
    },
    minAmountHint: {
        fontSize: 12,
        fontFamily: 'Roboto-Regular',
        color: '#9CA3AF',
        marginTop: 6,
    },
    summarySection: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 20,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    summaryRowLast: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    summaryLabel: {
        fontSize: 15,
        fontFamily: 'Roboto-Regular',
        color: '#374151',
    },
    summaryValue: {
        fontSize: 15,
        fontFamily: 'Roboto-Regular',
        color: '#111827',
    },
    summaryValueBold: {
        fontSize: 15,
        fontFamily: 'Roboto-Bold',
        color: '#111827',
    },
    exchangeButtonContainer: {
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
    exchangeButton: {
        backgroundColor: '#1E3A5F',
        paddingVertical: 18,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    exchangeButtonText: {
        fontSize: 17,
        fontFamily: 'Roboto-Bold',
        color: '#FFFFFF',
    },

    content: {
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 120,
    },
    productCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 20,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 5,
        borderWidth: 1,
        borderColor: '#F0F0F0',
    },
    productImageContainer: {
        marginBottom: 16,
        alignItems: 'center',
    },
    productImageWrapper: {
        width: '100%',
        height: 200,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#ffffff',
    },
    productImage: {
        width: '100%',
        height: '100%',
    },
    productInfoContainer: {
        alignItems: 'center',
    },
    brandContainer: {
        marginBottom: 8,
    },
    brand: {
        fontSize: 13,
        fontFamily: 'Roboto-Medium',
        color: '#6B7280',
        letterSpacing: 0.5,
    },
    title: {
        fontSize: 18,
        fontFamily: 'Roboto-Bold',
        color: '#111827',
        lineHeight: 26,
        textAlign: 'center',
        letterSpacing: -0.3,
    },
    paymentCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 20,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 5,
        borderWidth: 1,
        borderColor: '#F0F0F0',
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
        gap: 8,
    },
    sectionTitle: {
        fontSize: 16,
        fontFamily: 'Roboto-Bold',
        color: '#111827',
        letterSpacing: -0.3,
    },
    divider: {
        height: 1,
        backgroundColor: '#F3F4F6',
        marginBottom: 16,
    },
    paymentRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
        paddingVertical: 4,
    },
    paymentRowLast: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 4,
    },
    paymentLabel: {
        fontSize: 15,
        fontFamily: 'Roboto-Medium',
        color: '#374151',
    },
    priceContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    coinIcon: {
        width: 20,
        height: 20,
    },
    paymentValue: {
        fontSize: 16,
        fontFamily: 'Roboto-Bold',
        color: '#1E3A5F',
        letterSpacing: -0.3,
    },
    paymentBalance: {
        fontSize: 15,
        fontFamily: 'Roboto-Regular',
        color: '#9CA3AF',
    },
    paymentRemaining: {
        fontSize: 16,
        fontFamily: 'Roboto-Bold',
        color: '#059669',
        letterSpacing: -0.3,
    },
    guideCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 20,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 5,
        borderWidth: 1,
        borderColor: '#F0F0F0',
    },
    guideItem: {
        marginBottom: 20,
    },
    guideItemHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
        gap: 10,
    },
    guideNumber: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: '#1E3A5F',
        alignItems: 'center',
        justifyContent: 'center',
    },
    guideNumberText: {
        fontSize: 12,
        fontFamily: 'Roboto-Bold',
        color: '#FFFFFF',
    },
    guideSubtitle: {
        fontSize: 15,
        fontFamily: 'Roboto-Bold',
        color: '#111827',
        letterSpacing: -0.3,
    },
    guideTextContainer: {
        paddingLeft: 34,
    },
    guideText: {
        fontSize: 13,
        fontFamily: 'Roboto-Regular',
        color: '#6B7280',
        lineHeight: 20,
        marginBottom: 8,
        letterSpacing: -0.2,
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
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 8,
    },
    purchaseButton: {
        borderRadius: 14,
        overflow: 'hidden',
        shadowColor: '#1E3A5F',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
    },
    purchaseButtonGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 18,
        gap: 8,
    },
    purchaseIcon: {
        marginRight: 4,
    },
    purchaseButtonText: {
        fontSize: 17,
        fontFamily: 'Roboto-Bold',
        color: '#FFFFFF',
        letterSpacing: 0.5,
    },

    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    paymentSuccessModal: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 32,
        width: '100%',
        maxWidth: 320,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 12,
        elevation: 8,
    },
    modalLogoContainer: {
        marginBottom: 24,
        alignItems: 'center',
        justifyContent: 'center',
    },
    modalLogo: {
        width: 80,
        height: 80,
    },
    paymentSuccessMessage: {
        fontSize: 20,
        fontFamily: 'Roboto-Bold',
        color: '#111827',
        textAlign: 'center',
        marginBottom: 32,
        letterSpacing: -0.5,
    },
    paymentSuccessButton: {
        width: '100%',
        backgroundColor: '#1E3A5F',
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    paymentSuccessButtonText: {
        fontSize: 16,
        fontFamily: 'Roboto-Bold',
        color: '#FFFFFF',
        letterSpacing: 0.5,
    },
});
