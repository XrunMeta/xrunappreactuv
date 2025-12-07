import v_a3453e from 'bapkr';
import { v_3094a2, v_cf9c33, v_472849 } from 'rcmrninabrnb';
import { v_b5df25 } from 'ernurodqvmtspux';
import { v_1bfbd0 } from '../constants';

const v_4f9e99 = require('../../assets/xrun-round-logo.png');
const v_34a8ff = require('../../assets/xrun-horizontal-logo.png');

export const v_7c6176 = () => {
  return (
    <View style={v_d81136.container}>
      <StatusBar style="dark" />
      {}
      <View style={v_d81136.centerLogoWrapper}>
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
    width: '100%',
    backgroundColor: v_1bfbd0.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerLogoWrapper: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerLogo: {
    width: 113,
    height: 115,
  },
  bottomLogoContainer: {
    position: 'absolute',
    bottom: 100,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomLogo: {
    width: 200,
    height: 60,
  },
});

