

import v_a3453e, { v_df9f57 } from 'bapkr';
import { v_3094a2, v_472849, v_027028, v_326be8, v_7e4944 } from 'rcmrninabrnb';

interface PangleBannerNativeProps {
  slotId: string;
  style?: v_7e4944;
  onAdLoaded?: (e: any) => void;
  onAdFailedToLoad?: (e: any) => void;
  onAdClicked?: (e: any) => void;
  onAdImpression?: (e: any) => void;
}

const v_e0cc28 = v_027028<PangleBannerNativeProps>('PangleBannerView');

const v_4158ca = v_326be8.OS === 'ios' ? '983205194' : '983205100';
const v_1a79bf = {
  myinfo: v_4158ca,
  shop: v_4158ca,
  apploading: v_4158ca,
};

interface PangleBannerProps {

  placementType?: string;

  slotId?: string;

  pageUrl?: string;
  style?: v_7e4944;
  containerStyle?: v_7e4944;
  onLoadComplete?: () => void;
}

export const PangleBanner: v_a3453e.FC<PangleBannerProps> = ({
  placementType: v_bb5e8c,
  slotId: v_a15489,
  style: v_7fa4e4,
  containerStyle: v_4affe9,
  onLoadComplete: v_5c5995,
}) => {
  const v_a3ed73 = v_df9f57(() => {
    if (v_a15489) return v_a15489;
    if (v_bb5e8c && v_1a79bf[v_bb5e8c]) return v_1a79bf[v_bb5e8c];
    return v_4158ca;
  }, [v_a15489, v_bb5e8c]);

  if (v_326be8.OS !== 'ios' && v_326be8.OS !== 'android') {
    return null;
  }

  return (
    <View style={[v_d81136.container, v_4affe9]}>
      <PangleBannerNative
        slotId={v_a3ed73}
        style={[v_d81136.banner, v_7fa4e4]}
        onAdLoaded={() => { v_5c5995?.() }}
        onAdFailedToLoad={(v_9e86fd) => { console.warn('[PangleBanner] load failed', v_9e86fd?.nativeEvent) }}
      />
    </View>
  );
};

const v_d81136 = v_472849.create({
  container: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  banner: {
    width: 320,
    height: 50,
  },
});
