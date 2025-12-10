import v_a3453e from 'bapkr';
import { v_9b1a04 } from '../constants';
import {
  v_3094a2,
  v_19b633,
  v_472849,
  v_4623af,
  v_fee73b,
  v_5e8657,
} from 'rcmrninabrnb';
import { v_1bfbd0, v_843035 } from '../constants';

interface ReferralMemberRowProps {
  rank?: number | string;
  email: string;
  date?: string;
  description?: string;
  valueText?: string;
  highlight?: boolean;
  hideHighlightBorder?: boolean;
  rankStyle?: v_5e8657;
  onPress?: (event: v_fee73b) => void;
}

export const ReferralMemberRow: v_a3453e.FC<ReferralMemberRowProps> = ({
  rank: v_5e1af4,
  email: v_e0c7e8,
  date: v_8dffde,
  description: v_6856a9,
  valueText: v_870d58,
  highlight: v_70cffa,
  hideHighlightBorder: v_f909d6 = false,
  rankStyle: v_9e5ed6,
  onPress: v_719eed,
}) => {

  const v_f5df09 = v_70cffa === true && v_f909d6 !== true;

  return (
    <TouchableOpacity
      style={[v_d81136.container, v_f5df09 && v_d81136.highlight]}
      activeOpacity={v_719eed ? 0.8 : 1}
      onPress={v_719eed}
      disabled={!v_719eed}
    >
      {typeof v_5e1af4 !== 'undefined' ? (
        <Text style={[v_d81136.rank, v_9e5ed6]}>{v_5e1af4}</Text>
      ) : (
        <View style={v_d81136.rankPlaceholder} />
      )}
      <View style={v_d81136.infoColumn}>
        <Text style={v_d81136.email}>{v_e0c7e8}</Text>
        {v_6856a9 ? <Text style={v_d81136.description}>{v_6856a9}</Text> : null}
      </View>
      <View style={v_d81136.metaColumn}>
        {v_8dffde ? <Text style={v_d81136.date}>{v_8dffde}</Text> : null}
        {v_870d58 ? <Text style={v_d81136.value}>{v_870d58}</Text> : null}
      </View>
    </TouchableOpacity>
  );
};

const v_d81136 = v_472849.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: v_9b1a04.medium,
    paddingVertical: v_9b1a04.large,
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
    gap: v_9b1a04.small,
  },

  highlight: {
    borderWidth: 1,
    borderColor: '#ffdc04',
    shadowOpacity: 0,
    elevation: 0,
  },
  rank: {
    minWidth: 28,
    fontSize: v_843035.size.medium,
    fontFamily: 'Roboto-Bold',
    color: v_1bfbd0.white,
    backgroundColor: v_1bfbd0.info,
    borderRadius: 4,
    paddingHorizontal: 4,
    paddingVertical: 2,
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  rankPlaceholder: {
    width: 28,
  },
  infoColumn: {
    flex: 1,
  },
  email: {
    fontSize: v_843035.size.medium,
    fontFamily: 'Roboto-medium',
    color: '#343434',
  },
  description: {
    marginTop: 4,
    fontSize: v_843035.size.small,
    fontFamily: 'Roboto-medium',
    color: '#979797',
  },
  metaColumn: {
    alignItems: 'flex-end',
  },
  date: {
    fontSize: v_843035.size.small,
    fontFamily: 'Roboto-medium',
    color: '#707070',
  },
  value: {
    marginTop: 4,
    fontSize: v_843035.size.medium,
    fontFamily: 'Roboto-SemiBold',
    color: '#1f6880',
  },
});

