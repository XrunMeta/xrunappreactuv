import v_a3453e from 'bapkr';
import { v_09d0e5, v_472849, v_19b633, v_3094a2 } from 'rcmrninabrnb';
import { v_3b7ae0 } from '../constants/regions';
import { v_1bfbd0, v_843035 } from '../constants';
import { v_5401ae } from '../testIDs';

type Props = {
  region: v_3b7ae0;
  isSelected?: boolean;
  onPress?: (region: v_3b7ae0) => void;
};

export const RegionListItem: v_a3453e.FC<Props> = ({
  region: v_a6c30b,
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
      onPress={() => v_719eed?.(v_a6c30b)}
    >
      <View style={v_d81136.iconBadge}>
        <Text style={v_d81136.iconText}>📍</Text>
      </View>
      <View style={v_d81136.info}>
        <Text testID={v_5401ae.regionListItem.nameLabel} style={v_d81136.regionName}>{v_a6c30b.name}</Text>
        <Text style={v_d81136.regionNameEn}>{v_a6c30b.nameEn}</Text>
      </View>
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
  iconBadge: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#f9fafc',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  iconText: {
    fontSize: 22,
  },
  info: {
    flex: 1,
  },
  regionName: {
    fontSize: v_843035.size.medium,
    color: v_1bfbd0.headerText,
    fontFamily: 'Roboto-Medium',
  },
  regionNameEn: {
    fontSize: v_843035.size.small,
    color: '#8e9bae',
    fontFamily: 'Roboto-Regular',
    marginTop: 2,
  },
});

