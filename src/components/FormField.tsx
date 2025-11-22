import v_a3453e from 'bapkr';
import {
  v_3094a2,
  v_19b633,
  v_79c4f2,
  v_472849,
  v_b60ea2,
  v_7e4944,
  v_961e77,
} from 'rcmrninabrnb';

interface FormFieldProps extends v_b60ea2 {
  label: string;
  containerStyle?: v_961e77<v_7e4944>;
  rightAccessory?: v_a3453e.ReactNode;
  leftAccessory?: v_a3453e.ReactNode;
}

export const FormField: v_a3453e.FC<FormFieldProps> = ({
  label: v_2869c1,
  containerStyle: v_4affe9,
  rightAccessory: v_de8f73,
  leftAccessory: v_bea0eb,
  style: v_7fa4e4,
  placeholderTextColor: v_46ec3b = '#dedede',
  ...v_3a2a5d
}) => {
  return (
    <View style={[v_d81136.container, v_4affe9]}>
      <Text style={v_d81136.label}>{v_2869c1}</Text>
      <View style={v_d81136.inputWrapper}>
        {v_bea0eb ? <View style={v_d81136.leftAccessory}>{v_bea0eb}</View> : null}
        <TextInput
          style={[v_d81136.input, v_7fa4e4]}
          placeholderTextColor={v_46ec3b}
          {...v_3a2a5d}
        />
        {v_de8f73 ? (
          <View style={v_d81136.rightAccessory}>{v_de8f73}</View>
        ) : null}
      </View>
    </View>
  );
};

const v_d81136 = v_472849.create({
  container: {
    width: '100%',
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    lineHeight: 24,
    color: '#2a2727',
    fontFamily: 'Roboto-Medium',
    marginBottom: 8,
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
    fontSize: 14,
    color: '#2a2727',
    fontFamily: 'Roboto-Bold',
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
});


