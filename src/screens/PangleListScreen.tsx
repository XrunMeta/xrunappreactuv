import v_a3453e, { v_5ab095, v_c4deb2, v_de06a3 } from 'bapkr';
import { v_3094a2, v_19b633, v_472849, v_4623af, v_39a996, v_cf9c33 } from 'rcmrninabrnb';
import { v_570c34 } from '../components';
import { v_772971 } from 'jmpfvteuuztnp';
import { v_729608 } from '../components';
import { v_1bfbd0, v_a61db3, v_843035, v_9b1a04 } from '../constants';
import { v_a0daa8, v_ce4741 } from '../navigation';
import { v_18f201, v_3dc1fd, v_ad3a98, v_8c8ab6, v_f095b0 } from '../services/pangle';
import { v_f3de6d } from '../utils/napApiUtils';
import { v_573fcf } from '../utils/env';
import v_e84827 from 'bkjbgtcoyuizqwgwtnaxmfkyvlqwevapsqmanbsnv';
import { v_cba33f } from '../utils';

interface PangleAd {
  campid: string | number;
  name: string;
  coins: number | string;
  xrunPrice: number;
  thumbnail?: string;
  iconurl?: string;
  joindesc?: string;
  ad_company: string;
  adUnitId?: string; 
}

export const v_4a5627 = () => {
  const { goBack: v_c7ac57 } = v_a0daa8();
  const { t: v_8d41d7 } = v_772971();
  const [v_e90e69, v_4480f6] = v_5ab095<PangleAd[]>([]);
  const [v_683210, v_34a50a] = v_5ab095(true);

  const v_95b2da = v_de06a3(async () => {
    try {
      v_34a50a(true);
      console.log('[PangleListScreen] 팽글 광고 로드 시작');

      const v_417f93 = v_573fcf('PANGLE_APP_ID') || '8747763';
      const v_df39ae = v_573fcf('PANGLE_REWARDED_AD_UNIT_ID') || '982684202';
      const v_769156 = 0.07422680412371134; 
      const v_bd63f1 = 'https://www.xrun.run/assets/images/logo_visual_black.png';

      const v_5c15a0 = Array.from({ length: 3 }, (v_37eab7, v_a56041) => ({
        campid: `pangle_${v_417f93}_${v_a56041 + 1}`,
        name: `팽글 보상형 광고 ${v_a56041 + 1}`,
        coins: '0.19',
        xrunPrice: v_769156,
        thumbnail: v_bd63f1,
        iconurl: v_bd63f1,
        joindesc: '동영상 광고를 시청하시면 리워드가 지급됩니다.',
        ad_company: 'pangle',

        adUnitId: v_df39ae,
      }));

      console.log('[PangleListScreen] 동적 팽글 광고 생성 완료:', {
        생성된_개수: v_5c15a0.length,
        pangleAppId: v_417f93,
        adUnitId: v_5c15a0[0].adUnitId,
      });

      v_4480f6(v_5c15a0);
    } catch (v_5e9bfe) {
      console.error('[PangleListScreen] 팽글 광고 로드 실패:', v_5e9bfe);
      v_cba33f('팽글 광고를 불러오는데 실패했습니다.');
    } finally {
      v_34a50a(false);
    }
  }, []);

  v_c4deb2(() => {
    v_95b2da();
  }, [v_95b2da]);

  const v_bf140a = v_de06a3(async (v_ddcfed) => {
    try {
      console.log('[PangleListScreen] 팽글 광고 클릭:', v_ddcfed);

      const v_ef7306 = await v_e84827.getItem('userData');
      if (!v_ef7306) {
        v_cba33f('로그인이 필요합니다.');
        return;
      }

      const v_ff39bc = JSON.parse(v_ef7306);
      const v_660822 = v_ff39bc?.member?.toString() || '';

      if (!v_660822) {
        v_cba33f('로그인이 필요합니다.');
        return;
      }

            let v_a0af7d = await v_ad3a98();

            if (!v_a0af7d) {
              console.log('[PangleListScreen] Pangle 초기화 시도');
              try {
                await v_f095b0();

                v_a0af7d = await v_ad3a98();
              } catch (v_dedc69) {
                console.error('[PangleListScreen] Pangle 초기화 실패:', v_dedc69);
              }
            }

            if (v_a0af7d) {
              console.log('[PangleListScreen] Pangle 보상형 광고 표시');
              try {

                const v_e7f87b = await v_f3de6d();

                const v_61418d = v_ddcfed.adUnitId || v_3dc1fd();
                console.log('[PangleListScreen] 사용할 광고 단위 ID:', v_61418d);

                await v_18f201(
                  v_61418d,
                  v_660822,
                  v_e7f87b,
                  (v_36c043) => {
                    console.log('[PangleListScreen] 보상 수령:', v_36c043);
                    v_cba33f(`보상 수령: ${v_36c043.amount} ${v_36c043.type}`);
                  },
                  () => {
                    console.log('[PangleListScreen] 광고 닫힘');
                  },
                  (v_5e9bfe) => {
                    console.error('[PangleListScreen] 광고 로드 실패:', v_5e9bfe);
                    v_cba33f('광고를 불러올 수 없습니다.');
                  }
                );
              } catch (v_5e9bfe) {
                console.error('[PangleListScreen] 광고 표시 오류:', v_5e9bfe);
                v_cba33f('광고를 표시할 수 없습니다.');
              }
            } else {
              console.warn('[PangleListScreen] Pangle이 준비되지 않았습니다.');
              v_cba33f('광고를 준비하는 중입니다. 잠시 후 다시 시도해주세요.');
            }
    } catch (v_5e9bfe) {
      console.error('[PangleListScreen] 광고 클릭 처리 오류:', v_5e9bfe);
      v_cba33f('오류가 발생했습니다.');
    }
  }, []);

  return (
    <View style={v_d81136.container}>
      <Header title="팽글 광고" onBackPress={v_c7ac57} showBackButton />
      <SafeScrollView
        contentContainerStyle={v_d81136.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {v_683210 ? (
          <View style={v_d81136.loadingContainer}>
            <ActivityIndicator size="large" color={v_1bfbd0.primary} />
            <Text style={v_d81136.loadingText}>팽글 광고를 불러오는 중...</Text>
          </View>
        ) : v_e90e69.length === 0 ? (
          <View style={v_d81136.emptyContainer}>
            <Text style={v_d81136.emptyText}>표시할 팽글 광고가 없습니다.</Text>
          </View>
        ) : (
          <View style={v_d81136.listContainer}>
            {v_e90e69.map((v_ddcfed, v_a56041) => (
              <TouchableOpacity
                key={`${v_ddcfed.campid}-${v_a56041}`}
                style={v_d81136.adCard}
                activeOpacity={0.7}
                onPress={() => v_bf140a(v_ddcfed)}
              >
                {v_ddcfed.thumbnail || v_ddcfed.iconurl ? (
                  <Image
                    source={{ uri: v_ddcfed.thumbnail || v_ddcfed.iconurl }}
                    style={v_d81136.adImage}
                    resizeMode="cover"
                  />
                ) : (
                  <View style={v_d81136.adImagePlaceholder}>
                    <Text style={v_d81136.adImagePlaceholderText}>이미지 없음</Text>
                  </View>
                )}
                <View style={v_d81136.adContent}>
                  <Text style={v_d81136.adName} numberOfLines={2}>
                    {v_ddcfed.name || '팽글 광고'}
                  </Text>
                  <View style={v_d81136.adReward}>
                    <Text style={v_d81136.adRewardText}>
                      보상: {v_ddcfed.xrunPrice?.toFixed(4) || v_ddcfed.coins || '0'} XRUN
                    </Text>
                  </View>
                  {v_ddcfed.joindesc && (
                    <Text style={v_d81136.adDesc} numberOfLines={2}>
                      {v_ddcfed.joindesc}
                    </Text>
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </SafeScrollView>
    </View>
  );
};

const v_d81136 = v_472849.create({
  container: {
    ...v_a61db3.container,
  },
  scrollContent: {
    ...v_a61db3.scrollContent,
    paddingHorizontal: v_9b1a04.medium,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: v_9b1a04.xlarge * 2,
  },
  loadingText: {
    marginTop: v_9b1a04.medium,
    fontSize: v_843035.size.medium,
    fontFamily: v_843035.family.regular,
    color: v_1bfbd0.text,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: v_9b1a04.xlarge * 2,
  },
  emptyText: {
    fontSize: v_843035.size.medium,
    fontFamily: v_843035.family.regular,
    color: v_1bfbd0.text,
  },
  listContainer: {
    paddingVertical: v_9b1a04.medium,
  },
  adCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    marginBottom: v_9b1a04.medium,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
    overflow: 'hidden',
  },
  adImage: {
    width: '100%',
    height: 200,
    backgroundColor: v_1bfbd0.background,
  },
  adImagePlaceholder: {
    width: '100%',
    height: 200,
    backgroundColor: v_1bfbd0.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  adImagePlaceholderText: {
    fontSize: v_843035.size.small,
    fontFamily: v_843035.family.regular,
    color: v_1bfbd0.text,
    opacity: 0.5,
  },
  adContent: {
    padding: v_9b1a04.medium,
  },
  adName: {
    fontSize: v_843035.size.medium,
    fontFamily: v_843035.family.bold,
    color: v_1bfbd0.text,
    marginBottom: v_9b1a04.small,
  },
  adReward: {
    marginBottom: v_9b1a04.small,
  },
  adRewardText: {
    fontSize: v_843035.size.medium,
    fontFamily: v_843035.family.semiBold,
    color: v_1bfbd0.primary,
  },
  adDesc: {
    fontSize: v_843035.size.small,
    fontFamily: v_843035.family.regular,
    color: v_1bfbd0.text,
    opacity: 0.7,
  },
});

