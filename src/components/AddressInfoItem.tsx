import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, SIZES } from '../constants';
import { TID } from '../testIDs';

interface AddressInfoItemProps {
    symbol: string;
    address: string;
    network?: string;
    name: string;
    networkColor?: string;
    onPress?: () => void;
    onCopy?: () => void;
}

export const AddressInfoItem: React.FC<AddressInfoItemProps> = ({
    symbol,
    address,
    network,
    name,
    networkColor = COLORS.primary,
    onPress,
    onCopy,
}) => {

    const shortenAddress = (addr: string) => {
        if (!addr || addr.length < 16) return addr;
        return `${addr.slice(0, 8)}...${addr.slice(-8)}`;
    };

    return (
        <TouchableOpacity
            style={styles.container}
            onPress={onPress}
            activeOpacity={onPress ? 0.7 : 1}
            disabled={!onPress}
        >
            <View style={styles.infoContainer}>
                <View style={styles.nameContainer}>
                    <Text testID={TID.addressInfoItem.nameLabel} style={styles.name} numberOfLines={1}>{name}</Text>
                    {network && (
                        <View style={styles.networkBadge}>
                            <Text testID={TID.addressInfoItem.networkLabel} style={[styles.networkText, { color: networkColor }]}>{network}</Text>
                            {symbol && <Text style={styles.symbolText}> • {symbol}</Text>}
                        </View>
                    )}
                </View>
                <Text testID={TID.addressInfoItem.addressLabel} style={styles.address} numberOfLines={1} ellipsizeMode="middle">
                    {shortenAddress(address)}
                </Text>
            </View>
            {onCopy && (
                <TouchableOpacity onPress={onCopy} style={styles.copyButton}>
                    <Ionicons name="copy-outline" size={18} color={COLORS.headerText} />
                </TouchableOpacity>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#ffffff',
        borderRadius: 16,
        padding: SIZES.medium,
        marginBottom: SIZES.small,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
        borderWidth: 1,
        borderColor: '#ededed',
    },
    infoContainer: {
        flex: 1,
    },
    name: {
        fontSize: FONTS.size.medium,
        fontFamily: 'Roboto-Bold',
        color: COLORS.text,
        marginBottom: 4,
    },
    address: {
        fontSize: FONTS.size.msmall,
        fontFamily: 'Roboto-Regular',
        color: COLORS.headerText,
        marginBottom: 4,
    },
    networkBadge: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    networkText: {
        fontSize: FONTS.size.small,
        fontFamily: 'Roboto-Medium',
    },
    symbolText: {
        fontSize: FONTS.size.small,
        fontFamily: 'Roboto-Medium',
        color: COLORS.headerText,
    },
    copyButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#f5f7fa',
        alignItems: 'center',
        justifyContent: 'center',
    },
    nameContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
});

