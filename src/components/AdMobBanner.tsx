

import v_a3453e, { v_c4deb2, v_5ab095 } from 'bapkr';
import { v_3094a2, v_472849, v_7e4944 } from 'rcmrninabrnb';
import { v_5d7455, v_dce6da, v_54fae1 } from 'mbbgvwchnlgdjovshfkutboodeoyky';
import { v_2ccc13, v_2b25f9 } from '../services/admob';
import { v_1bfbd0 } from '../constants';

interface AdMobBannerProps {
  adUnitId?: string;
  size?: v_dce6da;
  containerStyle?: v_7e4944;
  onAdLoaded?: () => void;
  onAdFailedToLoad?: (error: Error) => void;
  testMode?: boolean;
}

export const AdMobBanner: v_a3453e.FC<AdMobBannerProps> = ({
  adUnitId: v_61418d,
  size: v_05b441 = v_dce6da.BANNER,
  containerStyle: v_4affe9,
  onAdLoaded: v_428f6c,
  onAdFailedToLoad: v_0721a3,
  testMode: v_53fadb = false,
}) => {
  const [v_f31518, v_02234b] = v_5ab095(false);
  const [v_819f69, v_e0cd3a] = v_5ab095<string | null>(null);

  v_c4deb2(() => {
    if (!v_2b25f9()) {
      console.warn('[AdMobBanner] AdMob이 초기화되지 않았습니다.');
      return;
    }

    if (v_53fadb) {
      v_e0cd3a(v_54fae1.BANNER);
    } else if (v_61418d) {
      v_e0cd3a(v_61418d);
    } else {
      try {
        const v_3e6f2b = v_2ccc13();
        v_e0cd3a(v_3e6f2b || null);
      } catch (v_5e9bfe) {
        console.error('[AdMobBanner] 광고 단위 ID를 가져올 수 없습니다:', v_5e9bfe);
        return;
      }
    }

    v_02234b(true);
  }, [v_61418d, v_53fadb]);

  if (!v_f31518 || !v_819f69) {
    return null;
  }

  return (
    <View style={[v_d81136.container, v_4affe9]}>
      <BannerAd
        unitId={v_819f69}
        size={v_05b441}
        requestOptions={{
          requestNonPersonalizedAdsOnly: false,
        }}
        onAdLoaded={() => {
          console.log('[AdMobBanner] 광고 로드 완료');
          if (v_428f6c) v_428f6c();
        }}
        onAdFailedToLoad={(v_5e9bfe) => {
          console.error('[AdMobBanner] 광고 로드 실패:', v_5e9bfe);
          if (v_0721a3) v_0721a3(v_5e9bfe);
        }}
      />
    </View>
  );
};

const v_d81136 = v_472849.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: v_1bfbd0.background,
  },
});
