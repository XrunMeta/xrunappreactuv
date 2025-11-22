import v_a3453e from 'bapkr';
import { v_3094a2, v_cf9c33, v_472849, v_700696 } from 'rcmrninabrnb';
import { v_b5df25 } from 'ernurodqvmtspux';
import { v_1bfbd0 } from '../constants';

const { width: v_8e4fb6, height: v_c86e33 } = v_700696.get('window');

const v_4f9e99 = require('../../assets/xrun-round-logo.png');
const v_34a8ff = require('../../assets/xrun-horizontal-logo.png');

export const v_7c6176 = () => {
  return (
    <View style={v_d81136.container}>
      <StatusBar style="dark" />
      {}
      <View style={v_d81136.centerLogoContainer}>
        <Image
          source={v_4f9e99}
          style={v_d81136.centerLogo}
          resizeMode="contain"
        />
      </View>
      {}
      <View style={v_d81136.bottomLogoContainer}>
        <Image
          source={v_34a8ff}
          style={v_d81136.bottomLogo}
          resizeMode="contain"
        />
      </View>
    </View>
  );
};

const v_d81136 = v_472849.create({
  container: {
    flex: 1,
    backgroundColor: v_1bfbd0.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerLogoContainer: {
    position: 'absolute',
    top: v_c86e33 / 2 - 57.5, 
    left: v_8e4fb6 / 2 - 56.5, 
    width: 113,
    height: 115,
  },
  centerLogo: {
    width: '100%',
    height: '100%',
  },
  bottomLogoContainer: {
    position: 'absolute',
    bottom: 100,
    left: v_8e4fb6 / 2 - 100, 
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomLogo: {
    width: 200,
    height: 60,
  },
});

