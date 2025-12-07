import v_a3453e from 'bapkr';
import { v_3094a2, v_4623af, v_19b633, v_472849, v_7e4944 } from 'rcmrninabrnb';
import { v_843035 } from '../constants';

interface SegmentedControlOption<T extends string> {
  label: string;
  value: T;
}

interface SegmentedControlProps<T extends string> {
  options: ReadonlyArray<SegmentedControlOption<T>>;
  value: T;
  onChange: (value: T) => void;
  containerStyle?: v_7e4944;
  hideIndicator?: boolean;
}

export const v_b34ce5 = <T extends string>({
  options: v_b36f96,
  value: v_3b402b,
  onChange: v_b187d9,
  containerStyle: v_4affe9,
  hideIndicator: v_175661 = false,
}: SegmentedControlProps<T>) => {
  return (
    <View style={[v_d81136.container, v_4affe9]}>
      {v_b36f96.map((v_0bd920) => {
        const v_26dce6 = v_0bd920.value === v_3b402b;
        return (
          <TouchableOpacity
            key={v_0bd920.value}
            style={[
              v_d81136.optionWrapper,
              v_26dce6 && v_d81136.optionActive,
              v_26dce6 && !v_175661 && v_d81136.optionActiveWithIndicator,
            ]}
            activeOpacity={0.85}
            onPress={() => v_b187d9(v_0bd920.value)}
          >
            <Text style={[v_d81136.optionLabel, v_26dce6 ? v_d81136.optionLabelActive : v_d81136.optionLabelInactive]}>
              {v_0bd920.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const v_d81136 = v_472849.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#e1e7ed',
    borderRadius: 8,
    padding: 4,
    gap: 8,
  },
  optionWrapper: {
    flex: 1,
    height: 40,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionActive: {
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  optionActiveWithIndicator: {
    borderBottomWidth: 3,
    borderBottomColor: '#ffdc04',
  },
  optionLabel: {
    fontSize: v_843035.size.medium,
    fontFamily: 'Roboto-SemiBold',
  },
  optionLabelActive: {
    color: '#111111',
  },
  optionLabelInactive: {
    color: '#566a7d',
  },
});


