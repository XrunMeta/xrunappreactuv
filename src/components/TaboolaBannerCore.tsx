import v_a3453e, { v_c4deb2 } from 'bapkr';
import { v_3094a2, v_472849, v_326be8 } from 'rcmrninabrnb';
import { v_2694e4 } from 'ahewcyoxtiosvtfuluxp';
import { v_1bfbd0, v_9b1a04 } from '../constants';
import {
  v_995f93,
  v_33aee4,
  v_968eda,
  v_0433f6,
  v_80493f,
} from '../services/taboola';
import { v_c436cb, v_27ace7 } from './TaboolaNativeView';

interface TaboolaBannerCoreProps {

  placementType: v_80493f;

  pageUrl?: string;

  style?: any;

  containerStyle?: any;

  onLoadingChange?: (isLoading: boolean) => void;
}

export const TaboolaBannerCore: v_a3453e.FC<TaboolaBannerCoreProps> = ({
  placementType: v_bb5e8c,
  pageUrl: v_cdfaaa,
  style: v_7fa4e4,
  containerStyle: v_4affe9,
  onLoadingChange: v_c83407,
}) => {

  const v_f36218 = v_bb5e8c;
  const v_74a79c = v_968eda[v_f36218];
  const v_40f839 = v_cdfaaa || v_33aee4();
  const v_26f42c = v_995f93();

  const v_d2b80a = v_27ace7();

  console.log('[TaboolaBannerCore] 렌더링:', {
    placementType: v_bb5e8c,
    placement: v_f36218,
    publisherId: v_26f42c,
    finalPageUrl: v_40f839,
    isNativeAvailable: v_d2b80a,
    configExists: !!v_74a79c,
  });

  if (!v_74a79c) {
    console.error('[TaboolaBannerCore] config가 없습니다:', v_f36218);
    return null;
  }

  v_c4deb2(() => {
    if (v_d2b80a && v_c83407) {

      v_c83407(false);
    }
  }, [v_d2b80a, v_c83407]);

  if (v_d2b80a) {
    return (
      <View style={[v_d81136.container, v_4affe9, v_7fa4e4]}>
        <TaboolaNativeView
          publisherId={v_995f93()}
          placement={v_74a79c.placement}
          mode={v_74a79c.mode}
          pageUrl={v_40f839}
          pageType={v_74a79c.pageType}
          targetType={v_74a79c.targetType}
          style={v_d81136.webView}
        />
      </View>
    );
  }

  const v_6d4549 = v_0433f6(
    v_26f42c,
    v_74a79c.placement,
    v_74a79c.mode,
    v_40f839,
    v_74a79c.pageType,
    v_74a79c.targetType,
  );

  return (
    <View style={[v_d81136.container, v_4affe9, v_7fa4e4]}>
      <WebView
        source={{ html: v_6d4549 }}
        style={v_d81136.webView}
        scrollEnabled={true}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        startInLoadingState={false}
        backgroundColor="#ffffff"
        allowsInlineMediaPlayback={true}
        mediaPlaybackRequiresUserAction={false}
        mixedContentMode="always"
        originWhitelist={['*']}
        thirdPartyCookiesEnabled={true}
        sharedCookiesEnabled={true}
        userAgent="Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1"
        onLoadStart={() => {
          console.log('[TaboolaBannerCore] WebView 로드 시작 - onLoadStart 호출됨');

          if (v_c83407) {
            console.log('[TaboolaBannerCore] onLoadingChange(false) 호출');
            v_c83407(false);
          } else {
            console.log('[TaboolaBannerCore] onLoadingChange가 없습니다');
          }
        }}
        onLoadEnd={() => {
          console.log('[TaboolaBannerCore] WebView 로드 완료 - onLoadEnd 호출됨');

        }}
        onError={(v_6f3a9d) => {
          const { nativeEvent: v_76b943 } = v_6f3a9d;
          console.error('[TaboolaBannerCore] WebView 오류:', v_76b943);

          if (v_c83407) {
            v_c83407(false);
          }
        }}
        onMessage={(v_d48baf) => {
          try {
            const v_9390e8 = JSON.parse(v_d48baf.nativeEvent.data);
            console.log('[TaboolaBannerCore] WebView 메시지:', v_9390e8);

            if (v_9390e8 && v_9390e8.message && typeof v_9390e8.message === 'string') {
              const v_a8cd21 = v_9390e8.message;
              if (v_a8cd21.includes('콘텐츠 감지됨')) {
                console.log('[TaboolaBannerCore] 콘텐츠 감지됨 - 로딩 완료 처리');
                if (v_c83407) {
                  v_c83407(false);
                }
              }
            }
          } catch (v_9e86fd) {
            console.log('[TaboolaBannerCore] WebView 원시 메시지:', v_d48baf.nativeEvent.data);
          }
        }}
      />
    </View>
  );
};

const v_d81136 = v_472849.create({
  container: {
    width: '100%',
    minHeight: 80,
    backgroundColor: '#F5F5F5',
    marginVertical: v_9b1a04.small, 
    marginHorizontal: 0, 
  },
  webView: {
    width: '100%',
    minHeight: 80,
    backgroundColor: 'transparent',
  },
});

