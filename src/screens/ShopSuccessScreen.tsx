import v_a3453e, { v_c4deb2 } from 'bapkr';
import { v_3094a2, v_472849, v_19b633, v_4623af, v_cf9c33 } from 'rcmrninabrnb';
import { v_772971 } from 'jmpfvteuuztnp';
import { v_729608, v_556baf } from '../components';
import { v_a0daa8, v_ce4741 } from '../navigation';
import { v_a61db3, v_843035 } from '../constants';
import { v_5401ae } from '../testIDs';

const v_16cea9 = require('../../assets/xrun-horizontal-logo.png');

export const v_8734da = () => {
  const { goBack: v_c7ac57, navigate: v_9b57fc } = v_a0daa8();
  const { t: v_8d41d7 } = v_772971();

  v_c4deb2(() => {
    import('../services/analytics').then(({ logEvent: v_ae251a, XRUN_EVENTS: v_a9f6da }) => {
      v_ae251a(v_a9f6da.SHOP_PURCHASE);
    }).catch(() => {});
  }, []);

  const v_03cae9 = () => {
    v_c7ac57(); 
    v_c7ac57(); 
    v_9b57fc(v_ce4741.shopMyTicket);
  };

  return (
    <SafeView style={v_d81136.container} backgroundColor='#f7f7fb'>
      <Header title={v_8d41d7('screens.shopSuccess.title')} showBackButton={false} />
      <View style={v_d81136.overlay}>
        <View style={v_d81136.card}>
          <Image source={v_16cea9} style={v_d81136.logo} resizeMode="contain" />
          <Text style={v_d81136.message}>{v_8d41d7('screens.shopSuccess.paymentComplete')}</Text>
          <TouchableOpacity testID={v_5401ae.shopSuccess.confirm} style={v_d81136.button} onPress={v_03cae9}>
            <Text style={v_d81136.buttonText}>{v_8d41d7('screens.shopSuccess.confirm')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeView>
  );
};

const v_d81136 = v_472849.create({
  container: {
    ...v_a61db3.container,
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
    fontSize: v_843035.size.mmedium,
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
    fontSize: v_843035.size.medium,
    fontFamily: 'Roboto-SemiBold',
  },
});

