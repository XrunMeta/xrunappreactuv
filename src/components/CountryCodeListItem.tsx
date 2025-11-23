import v_a3453e from 'bapkr';
import { v_09d0e5, v_472849, v_19b633, v_3094a2 } from 'rcmrninabrnb';
import { v_da1883 } from '../types';
import { v_1bfbd0 } from '../constants';

type Props = {
  country: v_da1883;
  isSelected?: boolean;
  onPress?: (country: v_da1883) => void;
};

export const CountryCodeListItem: v_a3453e.FC<Props> = ({
  country: v_b9bbbd,
  isSelected: v_599a41 = false,
  onPress: v_719eed,
}) => {
  return (
    <Pressable
      style={({ pressed: v_aba1d2 }) => [
        v_d81136.container,
        v_599a41 && v_d81136.selected,
        v_aba1d2 && v_d81136.pressed,
      ]}
      onPress={() => v_719eed?.(v_b9bbbd)}
    >
      <View style={v_d81136.flagBadge}>
        <Text style={v_d81136.flagText}>{v_b9bbbd.flagEmoji}</Text>
      </View>
      <View style={v_d81136.info}>
        <Text style={v_d81136.countryName}>{v_b9bbbd.name}</Text>
        <Text style={v_d81136.isoText}>{v_b9bbbd.iso2.toUpperCase()}</Text>
      </View>
      <Text style={v_d81136.dialCode}>{v_b9bbbd.dialCode}</Text>
    </Pressable>
  );
};

const v_d81136 = v_472849.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 16,
    backgroundColor: '#fff',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  selected: {
    borderColor: v_1bfbd0.buttonPrimary,
  },
  pressed: {
    opacity: 0.85,
  },
  flagBadge: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#f9fafc',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  flagText: {
    fontSize: 22,
  },
  info: {
    flex: 1,
  },
  countryName: {
    fontSize: 16,
    color: v_1bfbd0.headerText,
    fontFamily: 'Roboto-Medium',
  },
  isoText: {
    fontSize: 12,
    color: '#8e9bae',
    textTransform: 'uppercase',
    fontFamily: 'Roboto-Regular',
  },
  dialCode: {
    fontSize: 16,
    color: '#1f2933',
    fontFamily: 'Roboto-Bold',
  },
});

