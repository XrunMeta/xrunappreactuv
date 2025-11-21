import v_a3453e from 'bapkr';
import { v_4623af, v_19b633, v_472849, v_629153 } from 'rcmrninabrnb';
import { v_1bfbd0, v_9b1a04 } from '../constants';

interface ButtonProps extends v_629153 {
  title: string;
  variant?: 'primary' | 'secondary';
}

export const Button: v_a3453e.FC<ButtonProps> = ({ 
  title: v_9f1622, 
  variant: v_46e192 = 'primary', 
  style: v_7fa4e4, 
  ...v_b1927c 
}) => {
  return (
    <TouchableOpacity
      style={[
        v_d81136.button,
        v_46e192 === 'primary' ? v_d81136.primary : v_d81136.secondary,
        v_7fa4e4,
      ]}
      {...v_b1927c}
    >
      <Text style={v_d81136.text}>{v_9f1622}</Text>
    </TouchableOpacity>
  );
};

const v_d81136 = v_472849.create({
  button: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primary: {
    backgroundColor: v_1bfbd0.primary,
  },
  secondary: {
    backgroundColor: v_1bfbd0.secondary,
  },
  text: {
    color: '#FFFFFF',
    fontSize: v_9b1a04.medium,
    fontWeight: '600',
  },
});

