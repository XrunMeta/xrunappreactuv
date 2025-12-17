import React, { useState, useCallback, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    Modal,
    FlatList,
    Image,
    ImageSourcePropType,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Header, SafeView, PrimaryButton } from '../components';
import { COLORS, COMMON_STYLES, FONTS, SIZES } from '../constants';
import { ROUTES, useAppNavigation } from '../navigation';
import { useAlertDialog } from '../context/AlertDialogContext';
import { useAppContext } from '../context';

interface AddressBookItem {
    id: string;
    name: string;
    address: string;
    network: string;
    createdAt: number;
}

interface NetworkOption {
    value: string;
    label: string;
    icon?: keyof typeof Ionicons.glyphMap;  
    image?: ImageSourcePropType;             
}

const NETWORK_OPTIONS: NetworkOption[] = [
    { value: 'Polygon', label: 'Polygon', image: require('../../assets/icon_polyganscan.png') },
    { value: 'Ethereum', label: 'Ethereum', icon: 'diamond-outline' },
];

const NetworkIcon = ({ option, size = 20, color = COLORS.headerText }: { option: NetworkOption; size?: number; color?: string }) => {
    if (option.image) {
        return <Image source={option.image} style={{ width: size, height: size }} resizeMode="contain" />;
    }
    if (option.icon) {
        return <Ionicons name={option.icon} size={size} color={color} />;
    }
    return null;
};

const STORAGE_KEY = 'wallet_address_book';

export const AddWalletAddressScreen = () => {
    const { t } = useTranslation();
    const { goBack, navigate } = useAppNavigation();
    const { showAlert } = useAlertDialog();
    const { walletSendAddress, resetWalletSendAddress } = useAppContext();

    const [name, setName] = useState('');
    const [address, setAddress] = useState('');
    const [network, setNetwork] = useState('Polygon');
    const [showNetworkPicker, setShowNetworkPicker] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const selectedNetwork = NETWORK_OPTIONS.find(n => n.value === network) || NETWORK_OPTIONS[0];

    useEffect(() => {
        if (walletSendAddress && walletSendAddress.trim()) {
            setAddress(walletSendAddress);
            resetWalletSendAddress(); 
        }
    }, [walletSendAddress, resetWalletSendAddress]);

    const handleQrScan = useCallback(() => {
        navigate(ROUTES.walletQrScan);
    }, [navigate]);

    const handleSave = useCallback(async () => {
        if (!name.trim()) {
            await showAlert(
                t('screens.walletAddressBook.alerts.error'),
                t('screens.walletAddressBook.alerts.nameRequired'),
            );
            return;
        }

        if (!address.trim()) {
            await showAlert(
                t('screens.walletAddressBook.alerts.error'),
                t('screens.walletAddressBook.alerts.addressRequired'),
            );
            return;
        }

        if (!address.trim().match(/^0x[a-fA-F0-9]{40}$/)) {
            await showAlert(
                t('screens.walletAddressBook.alerts.error'),
                t('screens.walletAddressBook.alerts.invalidAddress'),
            );
            return;
        }

        setIsSaving(true);

        try {

            const stored = await AsyncStorage.getItem(STORAGE_KEY);
            const existingAddresses: AddressBookItem[] = stored ? JSON.parse(stored) : [];

            const newItem: AddressBookItem = {
                id: Date.now().toString(),
                name: name.trim(),
                address: address.trim(),
                network: network,
                createdAt: Date.now(),
            };

            const updatedAddresses = [...existingAddresses, newItem];
            await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedAddresses));

            await showAlert(
                t('screens.walletAddressBook.alerts.success'),
                t('screens.walletAddressBook.alerts.addressSaved'),
            );

            goBack();
        } catch (error) {
            console.error('[주소록] 저장 실패:', error);
            await showAlert(
                t('screens.walletAddressBook.alerts.error'),
                t('screens.walletAddressBook.alerts.saveFailed'),
            );
        } finally {
            setIsSaving(false);
        }
    }, [name, address, network, showAlert, t, goBack]);

    return (
        <SafeView style={styles.container} backgroundColor="#f7f7fb">
            <StatusBar style="dark" />
            <Header
                title={t('screens.walletAddressBook.addTitle')}
                onBackPress={goBack}
                showBackButton
            />

            <View style={styles.content}>
                {}
                <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>{t('screens.walletAddressBook.name')}</Text>
                    <View style={styles.inputContainer}>
                        <Ionicons name="person-outline" size={20} color={COLORS.headerText} style={styles.inputIcon} />
                        <TextInput
                            style={styles.input}
                            placeholder={t('screens.walletAddressBook.namePlaceholder')}
                            placeholderTextColor="#999"
                            value={name}
                            onChangeText={setName}
                        />
                    </View>
                </View>

                {}
                <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>{t('screens.walletAddressBook.network')}</Text>
                    <TouchableOpacity
                        style={styles.selectContainer}
                        onPress={() => setShowNetworkPicker(true)}
                        activeOpacity={0.7}
                    >
                        <View style={styles.inputIcon}>
                            <NetworkIcon option={selectedNetwork} size={20} color={COLORS.headerText} />
                        </View>
                        <Text style={styles.selectText}>{selectedNetwork.label}</Text>
                        <Ionicons name="chevron-down" size={20} color={COLORS.headerText} />
                    </TouchableOpacity>
                </View>

                {}
                <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>{t('screens.walletAddressBook.address')}</Text>
                    <View style={styles.inputContainer}>
                        <Ionicons name="wallet-outline" size={20} color={COLORS.headerText} style={styles.inputIcon} />
                        <TextInput
                            style={styles.input}
                            placeholder={t('screens.walletAddressBook.addressPlaceholder')}
                            placeholderTextColor="#999"
                            value={address}
                            onChangeText={setAddress}
                            autoCapitalize="none"
                            autoCorrect={false}
                        />
                        <TouchableOpacity
                            style={styles.qrButton}
                            onPress={handleQrScan}
                            activeOpacity={0.7}
                        >
                            <Ionicons name="qr-code-outline" size={22} color={COLORS.headerText} />
                        </TouchableOpacity>
                    </View>
                </View>

                {}
                <View style={styles.buttonContainer}>
                    <PrimaryButton
                        title={isSaving ? t('screens.walletAddressBook.saving') : t('screens.walletAddressBook.save')}
                        onPress={handleSave}
                        disabled={isSaving}
                        fullWidth
                    />
                </View>
            </View>

            {}
            <Modal
                visible={showNetworkPicker}
                transparent
                animationType="fade"
                onRequestClose={() => setShowNetworkPicker(false)}
            >
                <TouchableOpacity
                    style={styles.modalOverlay}
                    activeOpacity={1}
                    onPress={() => setShowNetworkPicker(false)}
                >
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>{t('screens.walletAddressBook.network')}</Text>
                        <FlatList
                            data={NETWORK_OPTIONS}
                            keyExtractor={(item) => item.value}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={[
                                        styles.optionItem,
                                        network === item.value && styles.optionItemActive,
                                    ]}
                                    onPress={() => {
                                        setNetwork(item.value);
                                        setShowNetworkPicker(false);
                                    }}
                                >
                                    <NetworkIcon
                                        option={item}
                                        size={20}
                                        color={network === item.value ? COLORS.primary : COLORS.headerText}
                                    />
                                    <Text
                                        style={[
                                            styles.optionText,
                                            network === item.value && styles.optionTextActive,
                                        ]}
                                    >
                                        {item.label}
                                    </Text>
                                    {network === item.value && (
                                        <Ionicons name="checkmark" size={20} color={COLORS.primary} />
                                    )}
                                </TouchableOpacity>
                            )}
                        />
                    </View>
                </TouchableOpacity>
            </Modal>
        </SafeView>
    );
};

const styles = StyleSheet.create({
    container: {
        ...COMMON_STYLES.container,
    },
    content: {
        flex: 1,
        paddingHorizontal: SIZES.medium,
        paddingTop: SIZES.large,
    },
    inputGroup: {
        marginBottom: SIZES.large,
    },
    inputLabel: {
        fontSize: FONTS.size.medium,
        fontFamily: 'Roboto-Medium',
        color: COLORS.text,
        marginBottom: SIZES.small,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#ffffff',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#e3e7ec',
        paddingHorizontal: SIZES.medium,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    inputIcon: {
        marginRight: SIZES.small,
    },
    input: {
        flex: 1,
        paddingVertical: SIZES.medium,
        fontSize: FONTS.size.medium,
        fontFamily: 'Roboto-Regular',
        color: COLORS.text,
    },
    qrButton: {
        padding: SIZES.small,
        marginLeft: SIZES.small,
    },
    selectContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#ffffff',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#e3e7ec',
        paddingHorizontal: SIZES.medium,
        paddingVertical: SIZES.medium,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    selectText: {
        flex: 1,
        fontSize: FONTS.size.medium,
        fontFamily: 'Roboto-Regular',
        color: COLORS.text,
    },
    buttonContainer: {
        marginTop: 'auto',
        paddingBottom: SIZES.large,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        width: '80%',
        backgroundColor: '#ffffff',
        borderRadius: 16,
        padding: SIZES.medium,
        maxHeight: 300,
    },
    modalTitle: {
        fontSize: FONTS.size.large,
        fontFamily: 'Roboto-Bold',
        color: COLORS.headerText,
        marginBottom: SIZES.medium,
        textAlign: 'center',
    },
    optionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: SIZES.medium,
        paddingHorizontal: SIZES.small,
        borderRadius: 12,
        gap: SIZES.small,
    },
    optionItemActive: {
        backgroundColor: '#f0f4ff',
    },
    optionText: {
        flex: 1,
        fontSize: FONTS.size.medium,
        fontFamily: 'Roboto-Medium',
        color: COLORS.headerText,
    },
    optionTextActive: {
        color: COLORS.primary,
    },
});

