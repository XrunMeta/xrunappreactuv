import v_a3453e from 'bapkr';
import {
  v_3094a2,
  v_19b633,
  v_79c4f2,
  v_472849,
  v_b60ea2,
  v_7e4944,
  v_961e77,
  v_4623af,
} from 'rcmrninabrnb';
import { v_f3168c } from '../context/KeyboardScrollContext';
import { v_843035 } from '../constants';

interface FormFieldProps extends v_b60ea2 {
  label: string;
  containerStyle?: v_961e77<v_7e4944>;
  labelRightAccessory?: v_a3453e.ReactNode;
  rightAccessory?: v_a3453e.ReactNode;
  leftAccessory?: v_a3453e.ReactNode;
  showDisabledStyle?: boolean; 
  onPress?: () => void; 
}

export const FormField: v_a3453e.FC<FormFieldProps> = ({
  label: v_2869c1,
  containerStyle: v_4affe9,
  labelRightAccessory: v_9de30f,
  rightAccessory: v_de8f73,
  leftAccessory: v_bea0eb,
  style: v_7fa4e4,
  placeholderTextColor: v_46ec3b = '#dedede',
  onFocus: v_cd3cee,
  onPress: v_719eed,
  editable: v_87d063 = true,
  showDisabledStyle: v_e3745c = true, 
  ...v_3a2a5d
}) => {
  const v_73e70b = v_f3168c();

  const v_086489 = (v_d48baf) => {

    if (!v_87d063) {
      return;
    }

    if (v_73e70b) {
      v_73e70b.scrollToFocusedInput(v_d48baf);
    }

    if (v_cd3cee) {
      v_cd3cee(v_d48baf);
    }
  };

  const v_1a6f6d = v_87d063 === false && v_e3745c;

  const v_56abc6 = v_719eed ? v_4623af : v_3094a2;

  return (
    <View style={[v_d81136.container, v_4affe9]}>
      <View style={v_d81136.labelRow}>
        <Text style={v_d81136.label}>{v_2869c1}</Text>
        {v_9de30f ? (
          <View style={v_d81136.labelRightAccessory}>{v_9de30f}</View>
        ) : null}
      </View>
      <InputWrapper
        style={[
          v_d81136.inputWrapper,
          v_1a6f6d && v_d81136.inputWrapperDisabled
        ]}
        onPress={v_719eed}
        disabled={v_1a6f6d || !v_719eed}
        activeOpacity={v_719eed ? 0.7 : 1}
      >
        {v_bea0eb ? <View style={v_d81136.leftAccessory}>{v_bea0eb}</View> : null}
        <TextInput
          style={[
            v_d81136.input,
            v_1a6f6d && v_d81136.inputDisabled,
            v_7fa4e4
          ]}
          placeholderTextColor={v_1a6f6d ? '#b3b6be' : v_46ec3b}
          onFocus={v_086489}
          editable={v_87d063}
          pointerEvents={v_719eed ? 'none' : 'auto'}
          {...v_3a2a5d}
        />
        {v_de8f73 ? (
          <View style={v_d81136.rightAccessory}>{v_de8f73}</View>
        ) : null}
      </InputWrapper>
    </View>
  );
};

const v_d81136 = v_472849.create({
  container: {
    width: '100%',

  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  label: {
    fontSize: v_843035.size.medium,
    lineHeight: 24,
    color: '#2a2727',
    fontFamily: 'Roboto-Medium',
    flexShrink: 1,
  },
  labelRightAccessory: {
    marginLeft: 12,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#dedede',
    backgroundColor: '#fefefe',
    minHeight: 52,
    paddingHorizontal: 16,
  },
  input: {
    flex: 1,
    fontSize: v_843035.size.medium,
    color: '#2a2727',
    fontFamily: 'Roboto-Medium',
    paddingVertical: 0,
  },
  leftAccessory: {
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rightAccessory: {
    marginLeft: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputWrapperDisabled: {
    backgroundColor: '#f5f5f5',
    borderColor: '#e0e0e0',
  },
  inputDisabled: {
    color: '#9e9e9e',
  },
});

