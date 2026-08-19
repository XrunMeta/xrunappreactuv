import React from 'react';
import { SIZES } from '../constants';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    GestureResponderEvent,
} from 'react-native';
import { COLORS, FONTS } from '../constants';
import { TID } from '../testIDs';

export interface ShopSalesMemberData {
    id: string;        
    email: string;     
    name: string;      
    date: string;      
    settlement: string; 
}

interface ShopSalesMemberRowProps extends ShopSalesMemberData {
    onPress?: (event: GestureResponderEvent) => void;
}

export const ShopSalesMemberRow: React.FC<ShopSalesMemberRowProps> = ({
    id,
    email,
    name,
    date,
    settlement,
    onPress,
}) => {
    return (
        <TouchableOpacity
            style={styles.container}
            activeOpacity={onPress ? 0.8 : 1}
            onPress={onPress}
            disabled={!onPress}
        >
            <View style={styles.leftColumn}>
                <Text testID={TID.shopSalesMemberRow.emailLabel} style={styles.id} numberOfLines={1}>{email}</Text>
                <Text testID={TID.shopSalesMemberRow.nameLabel} style={styles.name} numberOfLines={1}>{name}</Text>
            </View>
            <View style={styles.rightColumn}>
                <Text style={styles.date}>{date}</Text>
                <Text style={styles.settlement}>{settlement}</Text>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: SIZES.medium,
        paddingVertical: SIZES.medium,
        borderRadius: SIZES.small,
        backgroundColor: '#FFFFFF',
        shadowColor: '#00000014',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: SIZES.small,
        elevation: 2,
        borderWidth: 1,
        borderColor: '#ededed',
        marginBottom: SIZES.xsmall,
    },
    leftColumn: {
        flex: 1,
        gap: 4,
    },
    rightColumn: {
        alignItems: 'flex-end',
        gap: 4,
    },
    id: {
        fontSize: FONTS.size.medium,
        fontFamily: 'Roboto-Medium',
        color: '#333333',
    },
    name: {
        fontSize: FONTS.size.medium,
        fontFamily: 'Roboto-Regular',
        color: '#707070',
    },
    date: {
        fontSize: FONTS.size.small,
        fontFamily: 'Roboto-Regular',
        color: '#707070',
    },
    settlement: {
        fontSize: FONTS.size.medium,
        fontFamily: 'Roboto-SemiBold',
        color: '#2196F3',
    },
});

