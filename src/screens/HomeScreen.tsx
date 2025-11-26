import v_a3453e from 'bapkr';
import { v_3094a2, v_19b633, v_472849 } from 'rcmrninabrnb';
import { v_b5df25 } from 'ernurodqvmtspux';
import { v_772971 } from 'jmpfvteuuztnp';
import { v_1a40c4 } from '../components';

export const v_c316d8 = () => {
  const { t: v_8d41d7 } = v_772971();
  return (
    <View style={v_d81136.container}>
      <Text style={v_d81136.title}>{v_8d41d7('screens.home.title')}</Text>
      <Button title={v_8d41d7('screens.home.getStartedButton')} onPress={() => console.log('Pressed')} />
      <StatusBar style="auto" />
    </View>
  );
};

const v_d81136 = v_472849.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});

