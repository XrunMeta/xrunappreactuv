

import v_a3453e from 'bapkr';
import { v_3094a2, v_472849 } from 'rcmrninabrnb';
import { v_b2c639 } from 'vvfgtwbmdpbnvhtfbtbgudicfmpscw';
import { v_4b64f4 } from '../../src/context';
import { v_00e8f9 } from '../../src/navigation';
import { v_0c450d } from '../../src/context/AlertDialogContext';
import { v_10886b } from '../../src/screens/ShopScreen';

export default function v_e0bdde() {
  return (
    <SafeAreaProvider>
      <AppProvider>
        <NavigationProvider>
          <AlertDialogProvider>
            {
}
            <View style={v_d81136.root} testID="shop-server-only-harness">
              <ShopScreen />
            </View>
          </AlertDialogProvider>
        </NavigationProvider>
      </AppProvider>
    </SafeAreaProvider>
  );
}

const v_d81136 = v_472849.create({
  root: { flex: 1, backgroundColor: '#fff' },
});
