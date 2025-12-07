import v_a3453e from 'bapkr';
import {
  v_4623af,
  v_3094a2,
  v_19b633,
  v_472849,
  v_7e4944,
  v_961e77,
} from 'rcmrninabrnb';
import { v_1bfbd0 } from '../constants';
import { v_843035 } from '../constants';

type CheckboxVariant = 'square' | 'circle';

interface FormCheckboxProps {
  label?: string;
  checked: boolean;
  onToggle: () => void;
  variant?: CheckboxVariant;
  style?: v_961e77<v_7e4944>;
}

export const FormCheckbox: v_a3453e.FC<FormCheckboxProps> = ({
  label: v_2869c1,
  checked: v_da90dc,
  onToggle: v_0a2cea,
  variant: v_46e192 = 'square',
  style: v_7fa4e4,
}) => {
  return (
    <TouchableOpacity
      onPress={v_0a2cea}
      activeOpacity={0.8}
      style={[v_d81136.container, v_7fa4e4]}
    >
      <View
        style={[
          v_d81136.indicatorBase,
          v_46e192 === 'circle' ? v_d81136.circle : v_d81136.square,
          v_da90dc && v_d81136.indicatorChecked,
          v_46e192 === 'circle' && v_da90dc && v_d81136.circleChecked,
        ]}
      >
        {v_da90dc &&
          (v_46e192 === 'circle' ? (
            <View style={v_d81136.circleDot} />
          ) : (
            <View style={v_d81136.squareCheck} />
          ))}
      </View>
      {v_2869c1 ? <Text style={v_d81136.label}>{v_2869c1}</Text> : null}
    </TouchableOpacity>
  );
};

const v_d81136 = v_472849.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  indicatorBase: {
    width: 24,
    height: 24,
    borderWidth: 1,
    borderColor: '#dedede',
    alignItems: 'center',
    justifyContent: 'center',
  },
  circle: {
    borderRadius: 12,
  },
  square: {
    borderRadius: 8,
  },
  indicatorChecked: {
    borderColor: v_1bfbd0.buttonPrimary,
    backgroundColor: v_1bfbd0.buttonPrimary,
  },
  circleChecked: {
    backgroundColor: 'transparent',
  },
  circleDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: v_1bfbd0.buttonPrimary,
  },
  squareCheck: {
    width: 10,
    height: 6,
    borderLeftWidth: 2,
    borderBottomWidth: 2,
    borderLeftColor: '#ffffff',
    borderBottomColor: '#ffffff',
    transform: [{ rotate: '-45deg' }],
  },
  label: {
    fontSize: v_843035.fontSize.ssmall,
    color: '#2a2727',
    fontFamily: 'Roboto-Bold',
  },
});


