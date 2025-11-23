import v_a3453e from 'bapkr';
import { v_3094a2, v_472849, v_19b633, v_4623af, v_cf9c33 } from 'rcmrninabrnb';
import { v_b5df25 } from 'ernurodqvmtspux';
import { v_729608 } from '../components';
import { v_a0daa8, v_ce4741 } from '../navigation';

const v_16cea9 = require('../../assets/xrun-horizontal-logo.png');

export const v_8734da = () => {
  const { goBack: v_c7ac57, navigate: v_9b57fc } = v_a0daa8();

  const v_03cae9 = () => {
    v_c7ac57(); 
    v_c7ac57(); 
    v_9b57fc(v_ce4741.shopMyTicket);
  };

  return (
    <View style={v_d81136.container}>
      <StatusBar style="dark" />
      <Header title="Shop" showBackButton={false} />
      <View style={v_d81136.overlay}>
        <View style={v_d81136.card}>
          <Image source={v_16cea9} style={v_d81136.logo} resizeMode="contain" />
          <Text style={v_d81136.message}>결제가 완료되었습니다</Text>
          <TouchableOpacity style={v_d81136.button} onPress={v_03cae9}>
            <Text style={v_d81136.buttonText}>확인</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const v_d81136 = v_472849.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f7fb',
  },
  overlay: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    width: '80%',
    maxWidth: 320,
    borderRadius: 24,
    backgroundColor: '#fff',
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e3e3e3',
  },
  logo: {
    width: 88,
    height: 28,
    marginBottom: 16,
  },
  message: {
    fontSize: 18,
    fontFamily: 'Roboto-Bold',
    color: '#10192d',
    marginBottom: 24,
  },
  button: {
    width: '100%',
    height: 50,
    borderRadius: 16,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Roboto-SemiBold',
  },
});

