import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ActivityIndicator,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { Header, SafeView, PrimaryButton, SafeScrollView } from '../components';
import { COLORS, COMMON_STYLES, FONTS } from '../constants';
import { useAppNavigation, ROUTES } from '../navigation';
import { useAlertDialog } from '../context/AlertDialogContext';
import { getWalletPrivateKey } from '../services';
import { copyToClipboard, maskPrivateKey } from '../utils';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TID } from '../testIDs';

export const WalletPrivateKeyDisplayScreen = () => {
    const { t } = useTranslation();
    const { goBack, reset } = useAppNavigation();
    const { showAlert } = useAlertDialog();
    const [privateKey, setPrivateKey] = useState<string>('');
    const [isLoading, setIsLoading] = useState(true);
    const [isKeyVisible, setIsKeyVisible] = useState(false);

    useEffect(() => {
        console.log('[WalletPrivateKeyDisplayScreen] Mount');
        fetchPrivateKey();
    }, []);

    const fetchPrivateKey = async () => {
        try {
            setIsLoading(true);
            console.log('[WalletPrivateKeyDisplayScreen] Fetching private key...');

            const storedUserData = await AsyncStorage.getItem('userData');
            let memberId = null;
            if (storedUserData) {
                const parsed = JSON.parse(storedUserData);
                memberId = parsed.member;
            }

            console.log('[WalletPrivateKeyDisplayScreen] Member ID:', memberId);

            if (!memberId) {
                await showAlert(t('common.messages.error'), t('screens.wallet.missingInfo'));
                goBack();
                return;
            }

            const response = await getWalletPrivateKey(memberId);
            console.log('[WalletPrivateKeyDisplayScreen] API Response status:', response.status);

            if (response.status === 'success' && response.data?.[0]?.privateKey) {
                setPrivateKey(response.data[0].privateKey);
            } else {
                throw new Error('Failed to fetch private key');
            }
        } catch (error) {
            console.error('[PrivateKeyDisplay] Error fetching PK:', error);
            await showAlert(t('common.messages.error'), t('screens.walletPrivateKeyDisplay.errorFetching') || 'Failed to fetch private key');

            reset(ROUTES.wallet);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCopy = async () => {
        const confirmed = await showAlert(
            t('screens.walletPrivateKeyDisplay.copyConfirmTitle'),
            t('screens.walletPrivateKeyDisplay.copyConfirmMessage'),
            [
                { text: t('common.cancel') },
                { text: t('common.confirm') },
            ]
        );

        if (confirmed === 1) {
            await copyToClipboard(privateKey, showAlert, t('screens.walletPrivateKeyDisplay.copySuccess'));
        }
    };

    const toggleKeyVisibility = () => {
        setIsKeyVisible(!isKeyVisible);
    };

    const handleBackToWallet = () => {
        reset(ROUTES.wallet);
    };

    return (
        <SafeView style={styles.container}>
            <Header
                title={t('screens.walletPrivateKeyDisplay.title')}
                onBackPress={goBack}
                showBackButton
            />
            <SafeScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.warningCard}>
                    <View style={styles.warningHeader}>
                        <Ionicons name="warning-outline" size={24} color="#FF3B30" />
                        <Text style={styles.warningTitle}>{t('screens.walletPrivateKeyDisplay.warningTitle')}</Text>
                    </View>
                    <Text style={styles.warningText}>
                        {t('screens.walletPrivateKeyDisplay.warningMessage')}
                    </Text>
                </View>

                <View style={styles.keyContainer}>
                    <Text style={styles.label}>{t('screens.walletPrivateKeyDisplay.maskedKeyLabel')}</Text>
                    <View style={styles.keyBox}>
                        {isLoading ? (
                            <ActivityIndicator color={COLORS.primary} />
                        ) : (
                            <Text style={styles.keyText}>
                                {isKeyVisible ? privateKey : maskPrivateKey(privateKey)}
                            </Text>
                        )}
                        {!isLoading && (
                            <TouchableOpacity testID={TID.walletPrivateKeyDisplay.toggleKeyVisibility} onPress={toggleKeyVisibility} style={styles.visibilityBtn}>
                                <Ionicons
                                    name={isKeyVisible ? 'eye-off-outline' : 'eye-outline'}
                                    size={20}
                                    color={COLORS.headerText}
                                />
                            </TouchableOpacity>
                        )}
                    </View>
                </View>

                <View style={styles.buttonWrapper}>
                    <PrimaryButton
                        title={t('screens.walletPrivateKeyDisplay.copyKey')}
                        onPress={handleCopy}
                        disabled={isLoading || !privateKey}
                        fullWidth
                        style={styles.copyBtn}
                    />
                    <TouchableOpacity testID={TID.walletPrivateKeyDisplay.backToWallet} style={styles.backBtn} onPress={handleBackToWallet}>
                        <Text style={styles.backBtnText}>{t('screens.walletPrivateKeyDisplay.backToWallet')}</Text>
                    </TouchableOpacity>
                </View>
            </SafeScrollView>
        </SafeView>
    );
};

const styles = StyleSheet.create({
    container: {
        ...COMMON_STYLES.container,
        backgroundColor: '#F5F7FA',
    },
    scrollContent: {
        padding: 20,
        flexGrow: 1,
    },
    warningCard: {
        backgroundColor: '#FFF2F2',
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: '#FFD6D6',
        marginBottom: 24,
    },
    warningHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 8,
    },
    warningTitle: {
        fontSize: 16,
        fontFamily: FONTS.family.bold,
        color: '#FF3B30',
    },
    warningText: {
        fontSize: 14,
        lineHeight: 20,
        color: '#333',
        fontFamily: FONTS.family.regular,
    },
    keyContainer: {
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 3,
        marginBottom: 40,
    },
    label: {
        fontSize: 14,
        color: COLORS.headerText,
        opacity: 0.6,
        marginBottom: 12,
        fontFamily: FONTS.family.medium,
    },
    keyBox: {
        backgroundColor: '#F8F9FB',
        borderRadius: 12,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        minHeight: 60,
    },
    keyText: {
        fontSize: 15,
        fontFamily: FONTS.family.bold,
        color: COLORS.text,
        flex: 1,
        marginRight: 10,
    },
    visibilityBtn: {
        padding: 4,
    },
    buttonWrapper: {
        gap: 16,
    },
    copyBtn: {
        marginBottom: 0,
    },
    backBtn: {
        alignItems: 'center',
        paddingVertical: 12,
    },
    backBtnText: {
        fontSize: 15,
        fontFamily: FONTS.family.medium,
        color: COLORS.headerText,
        opacity: 0.6,
    },
});
