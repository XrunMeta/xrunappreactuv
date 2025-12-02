import v_a3453e, { v_df9f57 } from 'bapkr';
import { v_3094a2, v_472849 } from 'rcmrninabrnb';
import { v_eaeabd } from './TaboolaBannerCore';
import { v_1bfbd0 } from '../constants';
import { v_80493f, v_17555f, v_dc5d8f } from '../services/taboola';

interface TaboolaBannerProps {

  placementType: v_80493f | 'myinfo' | 'shop' | 'apploading';

  pageUrl?: string;

  style?: any;

  containerStyle?: any;

  onLoadComplete?: () => void;
}

export const TaboolaBanner: v_a3453e.FC<TaboolaBannerProps> = ({
  placementType: v_bb5e8c,
  pageUrl: v_cdfaaa,
  style: v_7fa4e4,
  containerStyle: v_4affe9,
  onLoadComplete: v_5c5995,
}) => {

  const v_193481 = v_df9f57(() => {

    if (v_bb5e8c === 'myinfo' || v_bb5e8c === 'shop' || v_bb5e8c === 'apploading') {
      return v_dc5d8f(v_bb5e8c, false);
    }

    return v_17555f(v_bb5e8c);
  }, [v_bb5e8c]);

  const v_69e114 = (v_cd31a8) => {
    if (!v_cd31a8 && v_5c5995) {
      v_5c5995();
    }
  };

  return (
    <View style={[v_d81136.container, v_4affe9, v_7fa4e4]}>
      <TaboolaBannerCore
        placementType={v_193481}
        pageUrl={v_cdfaaa}
        onLoadingChange={v_69e114}
      />
      {}
    </View>
  );
};

const v_d81136 = v_472849.create({
  container: {
    position: 'relative',
    width: '100%',
  },
});
