import v_a3453e from 'bapkr';
import { v_9b1a04 } from '../constants';
import {
    v_3094a2,
    v_19b633,
    v_472849,
    v_4623af,
    v_fee73b,
} from 'rcmrninabrnb';
import { v_1bfbd0, v_843035 } from '../constants';

export interface ShopSalesMemberData {
    id: string;        
    email: string;     
    name: string;      
    date: string;      
    settlement: string; 
}

interface ShopSalesMemberRowProps extends ShopSalesMemberData {
    onPress?: (event: v_fee73b) => void;
}

export const ShopSalesMemberRow: v_a3453e.FC<ShopSalesMemberRowProps> = ({
    id: v_389afb,
    email: v_e0c7e8,
    name: v_1833e7,
    date: v_8dffde,
    settlement: v_16c36f,
    onPress: v_719eed,
}) => {
    return (
        <TouchableOpacity
            style={v_d81136.container}
            activeOpacity={v_719eed ? 0.8 : 1}
            onPress={v_719eed}
            disabled={!v_719eed}
        >
            <View style={v_d81136.leftColumn}>
                <Text style={v_d81136.id} numberOfLines={1}>{v_e0c7e8}</Text>
                <Text style={v_d81136.name} numberOfLines={1}>{v_1833e7}</Text>
            </View>
            <View style={v_d81136.rightColumn}>
                <Text style={v_d81136.date}>{v_8dffde}</Text>
                <Text style={v_d81136.settlement}>{v_16c36f}</Text>
            </View>
        </TouchableOpacity>
    );
};

const v_d81136 = v_472849.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: v_9b1a04.medium,
        paddingVertical: v_9b1a04.medium,
        borderRadius: v_9b1a04.small,
        backgroundColor: '#FFFFFF',
        shadowColor: '#00000014',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: v_9b1a04.small,
        elevation: 2,
        borderWidth: 1,
        borderColor: '#ededed',
        marginBottom: v_9b1a04.xsmall,
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
        fontSize: v_843035.size.medium,
        fontFamily: 'Roboto-Medium',
        color: '#333333',
    },
    name: {
        fontSize: v_843035.size.medium,
        fontFamily: 'Roboto-Regular',
        color: '#707070',
    },
    date: {
        fontSize: v_843035.size.small,
        fontFamily: 'Roboto-Regular',
        color: '#707070',
    },
    settlement: {
        fontSize: v_843035.size.medium,
        fontFamily: 'Roboto-SemiBold',
        color: '#2196F3',
    },
});

