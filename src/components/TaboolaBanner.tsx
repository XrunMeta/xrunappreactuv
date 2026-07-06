import v_a3453e, { v_df9f57 } from 'bapkr';
import { v_3094a2, v_472849 } from 'rcmrninabrnb';
import { v_772971 } from 'jmpfvteuuztnp';
import { v_eaeabd } from './TaboolaBannerCore';
import { v_143351 } from './PangleBanner';
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

  const { i18n: v_9c213b } = v_772971();
  const v_2d4f8e = (v_9c213b.language || 'ko').toLowerCase().startsWith('ko');

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

  if (!v_2d4f8e) {
    return <PangleBanner style={v_4affe9} />;
  }

  return (
    <TaboolaBannerCore
      placementType={v_193481}
      pageUrl={v_cdfaaa}
      onLoadingChange={v_69e114}
    />
  );
};

