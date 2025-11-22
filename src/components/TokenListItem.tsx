import v_a3453e from 'bapkr';
import { v_3094a2, v_19b633, v_472849, v_cf9c33, v_07a341 } from 'rcmrninabrnb';

interface TokenListItemProps {
  title: string;
  subtitle: string;
  amount: string;
  suffix?: string;
  badgeLabel?: string;
  iconSource?: v_07a341;
  fallbackLabel?: string;
  fallbackColors?: {
    background: string;
    text: string;
  };
}

export const TokenListItem: v_a3453e.FC<TokenListItemProps> = ({
  title: v_9f1622,
  subtitle: v_dda473,
  amount: v_f63e09,
  suffix: v_ae8e76,
  badgeLabel: v_3fd4b5,
  iconSource: v_c1dd95,
  fallbackLabel: v_4281e6,
  fallbackColors: v_94e1f9 = {
    background: '#EDEDED',
    text: '#343434',
  },
}) => {
  return (
    <View style={v_d81136.container}>
      <View style={v_d81136.left}>
        <View style={[v_d81136.iconWrapper, { backgroundColor: v_94e1f9.background }]}>
          {v_c1dd95 ? (
            <Image source={v_c1dd95} style={v_d81136.iconImage} resizeMode="contain" />
          ) : (
            <Text style={[v_d81136.iconText, { color: v_94e1f9.text }]}>
              {v_4281e6?.slice(0, 2).toUpperCase()}
            </Text>
          )}
        </View>
        {v_3fd4b5 ? <View style={v_d81136.badge}><Text style={v_d81136.badgeText}>{v_3fd4b5}</Text></View> : null}
      </View>
      <View style={v_d81136.middle}>
        <Text style={v_d81136.title}>{v_9f1622}</Text>
        <Text style={v_d81136.subtitle}>{v_dda473}</Text>
      </View>
      <View style={v_d81136.right}>
        <Text style={v_d81136.amount}>{v_f63e09}</Text>
        {v_ae8e76 ? <Text style={v_d81136.suffix}>{v_ae8e76}</Text> : null}
      </View>
    </View>
  );
};

const v_d81136 = v_472849.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 15,
    paddingHorizontal: 16,
    paddingVertical: 14,
    shadowColor: '#3629B7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.07,
    shadowRadius: 15,
    elevation: 3,
    marginBottom: 16,
  },
  left: {
    marginRight: 12,
  },
  iconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconImage: {
    width: 40,
    height: 40,
  },
  iconText: {
    fontSize: 16,
    fontFamily: 'Roboto-Bold',
  },
  badge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    backgroundColor: '#000000',
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  badgeText: {
    fontSize: 10,
    color: '#ffffff',
    fontFamily: 'Roboto-Bold',
  },
  middle: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontFamily: 'Roboto-Medium',
    color: '#343434',
  },
  subtitle: {
    fontSize: 12,
    fontFamily: 'Roboto-Regular',
    color: '#979797',
  },
  right: {
    alignItems: 'flex-end',
  },
  amount: {
    fontSize: 13,
    fontFamily: 'Roboto-Bold',
    color: '#363636',
  },
  suffix: {
    fontSize: 12,
    fontFamily: 'Roboto-Regular',
    color: '#979797',
  },
});


