import v_a3453e from 'bapkr';
import {
  v_4623af,
  v_19b633,
  v_472849,
  v_961e77,
  v_7e4944,
} from 'rcmrninabrnb';
import { v_1bfbd0, v_843035 } from '../constants';


interface OptionButtonProps {
  label: string;
  selected: boolean;
  onPress: () => void;
  style?: v_961e77<v_7e4944>;
  flex?: number;
  disabled?: boolean;
}

export const OptionButton: v_a3453e.FC<OptionButtonProps> = ({
  label: v_2869c1,
  selected: v_587413,
  onPress: v_719eed,
  style: v_7fa4e4,
  flex: v_5c6564,
  disabled: v_4a6533 = false,
}) => {
  return (
    <TouchableOpacity
      style={[
        v_d81136.button,
        v_587413 && v_d81136.selected,
        v_4a6533 && v_d81136.disabled,
        typeof v_5c6564 === 'number' && { flex: v_5c6564 },
        v_7fa4e4,
      ]}
      onPress={v_719eed}
      activeOpacity={0.8}
      disabled={v_4a6533}
    >
      <Text style={[v_d81136.label, v_587413 && v_d81136.labelSelected, v_4a6533 && v_d81136.labelDisabled]}>
        {v_2869c1}
      </Text>
    </TouchableOpacity>
  );
};

const v_d81136 = v_472849.create({
  button: {
    height: 40,
    minWidth: 60,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e3e9ed',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 1,
  },
  selected: {
    backgroundColor: v_1bfbd0.buttonPrimary,
    borderColor: v_1bfbd0.buttonPrimary,
  },
  disabled: {
    opacity: 0.5,
  },
  label: {
    fontSize: v_843035.fontSize.ssmall,
    fontFamily: 'Roboto-Bold',
    color: '#2a2727',
  },
  labelSelected: {
    color: '#ffffff',
  },
  labelDisabled: {
    opacity: 0.6,
  },
});


