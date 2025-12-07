import v_a3453e from 'bapkr';
import {
  v_3094a2,
  v_19b633,
  v_472849,
  v_cf9c33,
  v_07a341,
  v_4623af,
  v_629153,
} from 'rcmrninabrnb';
import { v_843035 } from '../constants';

interface TransactionListItemProps extends v_629153 {
  title: string;
  subtitle: string;
  timestamp: string;
  amount: string;
  suffix?: string;
  iconSource?: v_07a341;
  fallbackLabel?: string;
  fallbackColors?: {
    background: string;
    text: string;
  };
}

export const TransactionListItem: v_a3453e.FC<TransactionListItemProps> = ({
  title: v_9f1622,
  subtitle: v_dda473,
  timestamp: v_42044e,
  amount: v_f63e09,
  suffix: v_ae8e76,
  iconSource: v_c1dd95,
  onPress: v_719eed,
  fallbackLabel: v_4281e6,
  fallbackColors: v_94e1f9 = { background: '#f2f2f2', text: '#343434' },
  ...v_29c333
}) => {
  return (
    <TouchableOpacity
      style={v_d81136.container}
      activeOpacity={v_719eed ? 0.85 : 1}
      onPress={v_719eed}
      {...v_29c333}
    >
      <View style={v_d81136.left}>
        {v_c1dd95 ? (
          <Image source={v_c1dd95} style={v_d81136.icon} />
        ) : (
          <View
            style={[
              v_d81136.icon,
              v_d81136.fallbackIcon,
              { backgroundColor: v_94e1f9.background },
            ]}
          >
            {v_4281e6 ? (
              <Text style={[v_d81136.fallbackLabel, { color: v_94e1f9.text }]}>
                {v_4281e6}
              </Text>
            ) : null}
          </View>
        )}
      </View>
      <View style={v_d81136.middle}>
        <Text style={v_d81136.title}>{v_9f1622}</Text>
        <Text style={v_d81136.subtitle}>{v_dda473}</Text>
      </View>
      <View style={v_d81136.right}>
        <Text style={v_d81136.timestamp}>{v_42044e}</Text>
        <Text style={v_d81136.amount}>{v_ae8e76 ? `${v_f63e09} ${v_ae8e76}` : v_f63e09}</Text>
      </View>
    </TouchableOpacity>
  );
};

const v_d81136 = v_472849.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 15,
    paddingVertical: 16,
    paddingHorizontal: 16,
    shadowColor: '#3629B7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.07,
    shadowRadius: 15,
    elevation: 3,
    marginBottom: 12,
  },
  left: {
    marginRight: 12,
  },
  icon: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  fallbackIcon: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  fallbackLabel: {
    fontSize: v_843035.size.ssmall,
    fontFamily: 'Roboto-Bold',
  },
  middle: {
    flex: 1,
  },
  title: {
    fontSize: v_843035.size.medium,
    color: '#343434',
    fontFamily: 'Roboto-Medium',
  },
  subtitle: {
    fontSize: v_843035.size.small,
    color: '#979797',
    fontFamily: 'Roboto-Regular',
  },
  right: {
    alignItems: 'flex-end',
  },
  timestamp: {
    fontSize: v_843035.size.xxsmall,
    color: '#aeaeae',
    fontFamily: 'Roboto-Medium',
    marginBottom: 6,
  },
  amount: {
    fontSize: v_843035.size.ssmall,
    color: '#363636',
    fontFamily: 'Roboto-Bold',
  },
});


