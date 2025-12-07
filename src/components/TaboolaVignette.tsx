import v_a3453e from 'bapkr';
import { v_3094a2, v_472849, v_39a996, v_19b633, v_aa7413, v_326be8, v_4623af } from 'rcmrninabrnb';
import { v_1bfbd0, v_843035, v_9b1a04 } from '../constants';
import {
  v_dc5d8f,
  v_995f93,
  v_33aee4,
  v_968eda,
} from '../services/taboola';
import { v_c436cb, v_27ace7 } from './TaboolaNativeView';

interface TaboolaVignetteProps {

  placementType: 'apploading';

  visible: boolean;

  onClose?: () => void;

  pageUrl?: string;
}

export const TaboolaVignette: v_a3453e.FC<TaboolaVignetteProps> = ({
  placementType: v_bb5e8c,
  visible: v_cf55be,
  onClose: v_0890f8,
  pageUrl: v_cdfaaa,
}) => {

  const v_f36218 = v_dc5d8f(v_bb5e8c, true);
  const v_74a79c = v_968eda[v_f36218];
  const v_40f839 = v_cdfaaa || v_33aee4();

  if (!v_cf55be) {
    return null;
  }

  if (!v_74a79c) {
    console.error('[TaboolaVignette] config가 없습니다:', v_f36218);
    return null;
  }

  return (
    <Modal
      visible={v_cf55be}
      transparent={false}
      animationType="fade"
      onRequestClose={v_0890f8}
    >
      <View style={v_d81136.container}>
        {v_27ace7() ? (
          <>
            <TaboolaNativeView
              publisherId={v_995f93()}
              placement={v_74a79c.placement}
              mode={v_74a79c.mode}
              pageUrl={v_40f839}
              pageType={v_74a79c.pageType}
              targetType={v_74a79c.targetType}
              style={v_d81136.webView}
            />
            {v_0890f8 && (
              <TouchableOpacity
                style={v_d81136.closeButton}
                onPress={v_0890f8}
                activeOpacity={0.7}
              >
                <Text style={v_d81136.closeButtonText}>닫기</Text>
              </TouchableOpacity>
            )}
          </>
        ) : (
          <View style={v_d81136.placeholder}>
            <ActivityIndicator size="large" color={v_1bfbd0.primary} />
            <Text style={v_d81136.placeholderText}>Taboola 전면광고</Text>
            {v_0890f8 && (
              <TouchableOpacity
                style={v_d81136.closeButton}
                onPress={v_0890f8}
                activeOpacity={0.7}
              >
                <Text style={v_d81136.closeButtonText}>닫기</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>
    </Modal>
  );
};

const v_d81136 = v_472849.create({
  container: {
    flex: 1,
    backgroundColor: v_1bfbd0.background,
  },
  webView: {
    flex: 1,
    width: '100%',
    backgroundColor: v_1bfbd0.background,
  },
  placeholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E0E0E0',
  },
  placeholderText: {
    fontSize: v_843035.size.medium,
    color: v_1bfbd0.text,
    opacity: 0.5,
    marginTop: v_9b1a04.medium,
  },
  closeButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 8,
    zIndex: 1000,
  },
  closeButtonText: {
    fontSize: v_843035.size.medium,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});
