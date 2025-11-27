import v_a3453e, { v_5ab095, v_c4deb2 } from 'bapkr';
import { v_3094a2, v_19b633, v_39a996, v_472849 } from 'rcmrninabrnb';
import { v_772971 } from 'jmpfvteuuztnp';
import { v_eaeabd } from './TaboolaBannerCore';
import { v_1bfbd0 } from '../constants';

interface TaboolaBannerProps {

  placementType: 'myinfo' | 'shop';

  pageUrl?: string;

  style?: any;

  containerStyle?: any;
}

export const TaboolaBanner: v_a3453e.FC<TaboolaBannerProps> = ({
  placementType: v_bb5e8c,
  pageUrl: v_cdfaaa,
  style: v_7fa4e4,
  containerStyle: v_4affe9,
}) => {
  const { t: v_8d41d7 } = v_772971();
  const [v_4ee138, v_75aef8] = v_5ab095(true);
  const [v_1ea9b3, v_2ce9d0] = v_5ab095(0);

  const v_69e114 = (v_cd31a8) => {
    if (!v_cd31a8) {

      v_2ce9d0((v_ba2215) => {
        const v_984be3 = v_ba2215 + 1;
        console.log('[TaboolaBanner] Taboola 로딩 카운터 증가:', v_984be3);
        return v_984be3;
      });
    }
  };

  v_c4deb2(() => {
    if (v_1ea9b3 >= 2) {
      console.log('[TaboolaBanner] Taboola 로딩 완료 (카운터 >= 2)');
      v_75aef8(false);
    }
  }, [v_1ea9b3]);

  return (
    <View style={[v_d81136.container, v_4affe9, v_7fa4e4]}>
      <TaboolaBannerCore
        placementType={v_bb5e8c}
        pageUrl={v_cdfaaa}
        onLoadingChange={v_69e114}
      />
      {v_4ee138 && (
        <View style={v_d81136.loadingOverlay}>
          <ActivityIndicator size="small" color={v_1bfbd0.headerText} />
          <Text style={v_d81136.loadingText}>
            {v_8d41d7('common.messages.loading')}
          </Text>
        </View>
      )}
    </View>
  );
};

const v_d81136 = v_472849.create({
  container: {
    position: 'relative',
    width: '100%',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
    gap: 8,
  },
  loadingText: {
    fontSize: 14,
    fontFamily: 'Roboto-Regular',
    color: v_1bfbd0.headerText,
    marginTop: 8,
  },
});
