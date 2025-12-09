import v_a3453e from 'bapkr';
import { v_3094a2, v_19b633, v_472849, v_4623af } from 'rcmrninabrnb';
import { v_25515d } from 'zvyjokvuouwvifyzks';
import { v_1bfbd0, v_843035, v_9b1a04 } from '../constants';

interface AddressInfoItemProps {
    symbol: string;
    address: string;
    network?: string;
    name: string;
    networkColor?: string;
    onPress?: () => void;
    onCopy?: () => void;
}

export const AddressInfoItem: v_a3453e.FC<AddressInfoItemProps> = ({
    symbol: v_ae69a0,
    address: v_157c04,
    network: v_74efc1,
    name: v_1833e7,
    networkColor: v_aeaf3c = v_1bfbd0.primary,
    onPress: v_719eed,
    onCopy: v_abd785,
}) => {

    const v_685cbf = (v_33c3a8) => {
        if (!v_33c3a8 || v_33c3a8.length < 16) return v_33c3a8;
        return `${v_33c3a8.slice(0, 8)}...${v_33c3a8.slice(-8)}`;
    };

    return (
        <TouchableOpacity
            style={v_d81136.container}
            onPress={v_719eed}
            activeOpacity={v_719eed ? 0.7 : 1}
            disabled={!v_719eed}
        >
            <View style={v_d81136.infoContainer}>
                <View style={v_d81136.nameContainer}>
                    <Text style={v_d81136.name} numberOfLines={1}>{v_1833e7}</Text>
                    {v_74efc1 && (
                        <View style={v_d81136.networkBadge}>
                            <Text style={[v_d81136.networkText, { color: v_aeaf3c }]}>{v_74efc1}</Text>
                            {v_ae69a0 && <Text style={v_d81136.symbolText}> • {v_ae69a0}</Text>}
                        </View>
                    )}
                </View>
                <Text style={v_d81136.address} numberOfLines={1} ellipsizeMode="middle">
                    {v_685cbf(v_157c04)}
                </Text>
            </View>
            {v_abd785 && (
                <TouchableOpacity onPress={v_abd785} style={v_d81136.copyButton}>
                    <Ionicons name="copy-outline" size={18} color={v_1bfbd0.headerText} />
                </TouchableOpacity>
            )}
        </TouchableOpacity>
    );
};

const v_d81136 = v_472849.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#ffffff',
        borderRadius: 16,
        padding: v_9b1a04.medium,
        marginBottom: v_9b1a04.small,
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
        fontSize: v_843035.size.medium,
        fontFamily: 'Roboto-Bold',
        color: v_1bfbd0.text,
        marginBottom: 4,
    },
    address: {
        fontSize: v_843035.size.msmall,
        fontFamily: 'Roboto-Regular',
        color: v_1bfbd0.headerText,
        marginBottom: 4,
    },
    networkBadge: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    networkText: {
        fontSize: v_843035.size.small,
        fontFamily: 'Roboto-Medium',
    },
    symbolText: {
        fontSize: v_843035.size.small,
        fontFamily: 'Roboto-Medium',
        color: v_1bfbd0.headerText,
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

