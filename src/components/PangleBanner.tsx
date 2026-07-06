

import v_a3453e from 'bapkr';
import { v_326be8, v_472849, v_3094a2, v_027028 } from 'rcmrninabrnb';
import { v_573fcf } from '../utils/env';

interface Props {
  style?: object;
}

const v_9308d5 = v_027028<{ adUnitId: string; style?: object }>(
  'PangleBannerViewManager',
);

export const PangleBanner: v_a3453e.FC<Props> = ({ style: v_7fa4e4 }) => {
  const v_61418d = v_326be8.OS === 'ios'
    ? v_573fcf('PANGLE_BANNER_AD_UNIT_ID_IOS')
    : v_573fcf('PANGLE_BANNER_AD_UNIT_ID');

  if (!v_61418d) return null;

  return (
    <View style={[v_d81136.container, v_7fa4e4]}>
      <NativePangleBanner adUnitId={v_61418d} style={v_d81136.banner} />
    </View>
  );
};

const v_d81136 = v_472849.create({
  container: {
    width: '100%',
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  banner: {
    width: 320,
    height: 50,
  },
});
