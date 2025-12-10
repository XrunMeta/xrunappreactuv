import v_a3453e, { v_c4deb2, v_5ab095, v_e662ae, v_de06a3 } from 'bapkr';
import {
  v_3094a2,
  v_19b633,
  v_472849,
  v_4623af,
  v_09d0e5,
  v_39a996,
  v_f2c756,
  v_6b5698,
  v_aa7413,
  v_326be8,
} from 'rcmrninabrnb';
import { v_b5df25 } from 'ernurodqvmtspux';
import { v_772971 } from 'jmpfvteuuztnp';
import { v_700ef9 } from '../context';
import { v_a0daa8, v_ce4741 } from '../navigation';
import { v_f3de6d } from '../utils/napApiUtils';
import { v_aa7dc1, v_ad146c } from '../services';
import v_e84827 from 'bkjbgtcoyuizqwgwtnaxmfkyvlqwevapsqmanbsnv';
import { v_4c7b5d, v_570c34 } from '../components';
import { v_843035 } from '../constants';
import { v_6b63f9 } from '../types';

const SequentialDots: v_a3453e.FC = () => {
  const [v_9b82f3, v_67dd3d] = v_5ab095(0);

  v_c4deb2(() => {
    const v_ad1d65 = setInterval(() => {
      v_67dd3d(v_ba2215 => (v_ba2215 + 1) % 3);
    }, 300);
    return () => clearInterval(v_ad1d65);
  }, []);

  return (
    <View style={{ flexDirection: 'row', marginTop: 20}}>
      {[0, 1, 2].map(v_a56041 => (
        <View
          key={v_a56041}
          style={{
            width: 8,
            height: 8,
            borderRadius: 4,
            backgroundColor: v_9b82f3 === v_a56041 ? '#388Dc8' : '#ccc',
            marginHorizontal: 4,
          }}
        />
      ))}
    </View>
  );
};

interface ShowPockAdScreenProps {
  onClose?: () => void; 
}

export const ShowPockAdScreen: v_a3453e.FC<ShowPockAdScreenProps> = ({ onClose: v_0890f8 }) => {
  const { t: v_8d41d7 } = v_772971();
  const { advertisementParams: v_d0b6d4, resetAdvertisementParams: v_e10ff9 } = v_700ef9();
  const { navigate: v_9b57fc, reset: v_487a25, goBack: v_c7ac57 } = v_a0daa8();

  const v_7f2e65 = v_de06a3(() => {
    v_e10ff9();
    console.log('handleClose');
    console.log('onClose', v_0890f8);
    if (v_0890f8) {

      v_0890f8();
    } else {

      if (v_326be8.OS === 'ios') {

        if (v_c7ac57) {
          v_c7ac57();
        } else if (v_487a25) {
          v_487a25(v_ce4741.map);
        }
      } else {

        if (v_487a25) {
          v_487a25(v_ce4741.map);
        }
      }
    }
  }, [v_0890f8, v_e10ff9, v_c7ac57, v_487a25]);

  const [v_cd31a8, v_deef62] = v_5ab095(true);
  const [v_915a6b, v_d2702f] = v_5ab095(false);
  const [v_9f9e7d, v_32baa9] = v_5ab095<v_6b63f9['data'] | null>(null);
  const [v_7b73c7, v_ed6932] = v_5ab095(false);
  const [v_5267b5, v_9b0de5] = v_5ab095(false);
  const [v_9c4d53, v_8b3d54] = v_5ab095(false);
  const [v_94a194, v_3fff8d] = v_5ab095(v_6b5698.currentState);
  const [v_b42caf, v_3e5456] = v_5ab095(false);
  const [v_7a79cf, v_1a68d1] = v_5ab095(false);
  const [v_660822, v_06fdbc] = v_5ab095<string>('');
  const [v_452edc, v_5a7a1a] = v_5ab095(false);

  const v_27bab6 = v_e662ae<NodeJS.Timeout | null>(null);
  const v_d35ccb = v_e662ae<NodeJS.Timeout | null>(null);

  v_c4deb2(() => {
    console.log('=== ShowPockAdScreen 컴포넌트 마운트/업데이트 ===');
    console.log('advertisementParams:', v_d0b6d4 ? '있음' : '없음');
    console.log('advertisementParams 상세:', JSON.stringify(v_d0b6d4, null, 2));
    console.log('🔍 [ShowPockAdScreen] advertisementParams 값 검증:', {
      advertisement: v_d0b6d4?.advertisement,
      campid: v_d0b6d4?.campid,
      coin: v_d0b6d4?.coin,
      name: v_d0b6d4?.name,
      xrunPrice: v_d0b6d4?.xrunPrice,
      member: v_d0b6d4?.member,
    });

    if (!v_d0b6d4) {
      console.log('⚠️ [ShowPockAdScreen] 광고 파라미터가 없습니다. 화면을 렌더링하지 않습니다.');
      console.log('🔄 모달을 닫습니다.');

      const v_4b24d2 = v_326be8.OS === 'ios' && v_0890f8 ? 100 : 0;

      const v_3894d5 = setTimeout(() => {
        v_7f2e65();
      }, v_4b24d2);

      return () => {
        clearTimeout(v_3894d5);
      };
    }

    console.log('✅ [ShowPockAdScreen] 광고 파라미터 확인 완료:', {
      advertisement: v_d0b6d4.advertisement,
      campid: v_d0b6d4.campid,
      coin: v_d0b6d4.coin,
      name: v_d0b6d4.name,
      xrunPrice: v_d0b6d4.xrunPrice,
    });
  }, [v_d0b6d4, v_7f2e65]);

  v_c4deb2(() => {
    const v_b2bcc9 = async () => {
      try {
        if (v_d0b6d4?.member) {
          v_06fdbc(v_d0b6d4.member);
          return;
        }

        const v_ef7306 = await v_e84827.getItem('userData');
        if (v_ef7306) {
          const v_22a2f7 = JSON.parse(v_ef7306);
          const v_7aa673 = v_22a2f7.member?.toString() || '';
          v_06fdbc(v_7aa673);
        } else {
          v_06fdbc('userTest');
        }
      } catch (v_5e9bfe) {
        console.error('userData 가져오기 실패:', v_5e9bfe);
        v_06fdbc('userTest');
      }
    };

    v_b2bcc9();
  }, [v_d0b6d4]);

  const v_7d76f7 = async (params?: typeof v_d0b6d4) => {
    try {

      const v_766d99 = v_24baff || v_d0b6d4;

      console.log('Starting Pock advertisement initialization');
      v_deef62(true);

      console.log('=== ShowPockAdScreen 진입 advertisementParams ===');
      console.log('advertisement:', v_766d99?.advertisement);
      console.log('coin:', v_766d99?.coin);
      console.log('campid:', v_766d99?.campid);
      console.log('name:', v_766d99?.name);
      console.log('xrunPrice:', v_766d99?.xrunPrice);
      console.log('joindesc:', v_766d99?.joindesc);
      console.log('전체 advertisementParams:', JSON.stringify(v_766d99, null, 2));
      console.log('=== ShowPockAdScreen 진입 advertisementParams 끝 ===');

      if (!v_766d99 || !v_766d99.campid || v_766d99.campid === '') {
        console.error('❌ [ShowPockAdScreen] campid가 유효하지 않습니다:', {
          campid: v_766d99?.campid,
          advertisement: v_766d99?.advertisement,
          fullParams: JSON.stringify(v_766d99, null, 2),
        });
        v_deef62(false);
        v_7f2e65();
        return;
      }

      const v_e7f87b = await v_f3de6d();

      const v_aa0917 = v_766d99.campid || '';
      console.log('=== ShowPockAdScreen API 호출 정보 ===');
      console.log('member:', v_660822);
      console.log('adid:', v_e7f87b.adid);
      console.log('campid:', v_aa0917);
      console.log('advertisementParams (currentParams):', JSON.stringify(v_766d99, null, 2));
      console.log('deviceInfo:', JSON.stringify(v_e7f87b, null, 2));
      console.log('🔍 [ShowPockAdScreen] 최종 API 호출 campid 검증:', {
        campid: v_aa0917,
        advertisement: v_766d99?.advertisement,
        coin: v_766d99?.coin,
        name: v_766d99?.name,
      });
      console.log('=== API 호출 정보 끝 ===');

      const v_43c42e = await v_aa7dc1(
        v_660822,
        v_e7f87b.adid,
        v_e7f87b,
        v_aa0917,
        v_0890f8 ? undefined : v_9b57fc, 
      );

      if (v_43c42e.code === 200 && v_43c42e.data && v_43c42e.data.landing_url) {
        v_32baa9(v_43c42e.data);
        v_deef62(false);
        return;
      } else {
        throw new Error(`Pock 광고 API 응답 실패: code=${v_43c42e.code}`);
      }
    } catch (v_5e9bfe) {
      console.error('Pock 광고 초기화 실패:', v_5e9bfe);

      console.log('❌ 광고 초기화 실패 - 팝업 표시');
      v_deef62(false);
      v_ed6932(true);
    }
  };

  const v_57519b = v_e662ae<{ advertisement?: string; campid?: string } | null>(null);

  v_c4deb2(() => {
    if (v_d0b6d4) {
      const v_c84c22 = `${v_d0b6d4.advertisement}-${v_d0b6d4.campid}`;
      const v_28b331 = v_57519b.current
        ? `${v_57519b.current.advertisement}-${v_57519b.current.campid}`
        : null;

      if (v_28b331 && v_c84c22 !== v_28b331) {
        console.log('🔄 [ShowPockAdScreen] advertisementParams 변경 감지 - 상태 초기화');
        console.log('🔍 이전 파라미터:', v_57519b.current);
        console.log('🔍 새로운 파라미터:', {
          advertisement: v_d0b6d4.advertisement,
          campid: v_d0b6d4.campid,
          coin: v_d0b6d4.coin,
          name: v_d0b6d4.name,
        });

        v_32baa9(null);
        v_deef62(true);
        v_d2702f(false);
        v_ed6932(false);
        v_9b0de5(false);
        v_8b3d54(false);
        v_3e5456(false);
        v_1a68d1(false);

        if (v_27bab6.current) {
          clearTimeout(v_27bab6.current);
          v_27bab6.current = null;
        }
        if (v_d35ccb.current) {
          clearInterval(v_d35ccb.current);
          v_d35ccb.current = null;
        }

        console.log('✅ [ShowPockAdScreen] 상태 초기화 완료');
      }

      v_57519b.current = {
        advertisement: v_d0b6d4.advertisement,
        campid: v_d0b6d4.campid,
      };
    }
  }, [v_d0b6d4?.advertisement, v_d0b6d4?.campid]);

  v_c4deb2(() => {
    console.log('=== ShowPockAdScreen 광고 초기화 체크 ===');
    console.log('member:', v_660822 ? `있음 (${v_660822})` : '없음');
    console.log('advertisementParams:', v_d0b6d4 ? '있음' : '없음');
    console.log('🔍 [ShowPockAdScreen] advertisementParams 상세:', {
      advertisement: v_d0b6d4?.advertisement,
      campid: v_d0b6d4?.campid,
      coin: v_d0b6d4?.coin,
      name: v_d0b6d4?.name,
      xrunPrice: v_d0b6d4?.xrunPrice,
    });

    if (v_660822 && v_d0b6d4) {
      console.log('✅ member와 advertisementParams 모두 있음 - initPockAd 호출');
      console.log('🔍 [ShowPockAdScreen] initPockAd에 전달할 campid:', v_d0b6d4.campid);

      v_7d76f7(v_d0b6d4);
    } else {
      console.log('⏳ member 또는 advertisementParams 대기 중...');
      if (!v_660822) {
        console.log('  - member가 아직 설정되지 않음');
      }
      if (!v_d0b6d4) {
        console.log('  - advertisementParams가 아직 설정되지 않음');
      }
    }
  }, [v_660822, v_d0b6d4]);

  v_c4deb2(() => {
    return () => {
      if (v_27bab6.current) {
        clearTimeout(v_27bab6.current);
        v_27bab6.current = null;
      }
      if (v_d35ccb.current) {
        clearInterval(v_d35ccb.current);
        v_d35ccb.current = null;
      }
    };
  }, []);

  const v_ece582 = async (v_f71b56) => {
    try {
      console.log('URL 이동 시도:', v_f71b56);

      const v_a42ed3 = await v_f2c756.canOpenURL(v_f71b56);

      if (v_a42ed3) {
        await v_f2c756.openURL(v_f71b56);
        console.log('✅ URL 이동 성공 - 리워드 처리 대기');
        v_3e5456(true);
        v_deef62(false);
        v_d2702f(true);
        v_1a68d1(true); 

      } else {
        console.error('❌ 지원하지 않는 URL:', v_f71b56);
        throw new Error(v_8d41d7('screens.showNapAd.unsupportedUrl'));
      }
    } catch (v_5e9bfe) {
      console.error('❌ URL 이동 실패:', v_5e9bfe);
      throw v_5e9bfe;
    }
  };

  const v_653132 = async () => {
    try {
      v_d2702f(true);

      if (!v_9f9e7d?.landing_url) {
        throw new Error(v_8d41d7('screens.showNapAd.noAdUrl'));
      }

      console.log('=== 광고 완료 처리 정보 ===');
      console.log('joindesc:', v_d0b6d4?.joindesc);
      console.log('name:', v_d0b6d4?.name);
      console.log('xrunPrice:', v_d0b6d4?.xrunPrice);
      console.log('pockAdData:', v_9f9e7d);

      try {

        const v_871fbe = v_d0b6d4?.advertisement;

        if (!v_871fbe) {
          console.error('[ShowPockAdScreen] ❌ advertisement가 비어있습니다. 이 상태로는 올바른 리워드를 줄 수 없습니다.', {
            advertisementParams: v_d0b6d4,
            advertisement: v_d0b6d4?.advertisement,
            coin: v_d0b6d4?.coin,
            campid: v_d0b6d4?.campid,
            name: v_d0b6d4?.name,
          });

          v_e10ff9();
          v_7f2e65();
          v_d2702f(false);
          v_1a68d1(false);
          return;
        }

        const v_36e78d = parseInt(String(v_871fbe), 10);

        if (isNaN(v_36e78d) || v_36e78d === 0) {
          console.error('[ShowPockAdScreen] ❌ advertisement가 유효하지 않은 값입니다.', {
            adIdRaw: v_871fbe,
            adId: v_36e78d,
            advertisementParams: v_d0b6d4,
          });

          v_e10ff9();
          v_7f2e65();
          v_d2702f(false);
          v_1a68d1(false);
          return;
        }

        console.log('[ShowPockAdScreen] ✅ advertisement 검증 통과:', {
          adIdRaw: v_871fbe,
          adId: v_36e78d,
          coin: v_d0b6d4?.coin || '0',
          member: v_660822,
        });

        const v_3393e3 = await v_ad146c(
          v_36e78d,
          v_d0b6d4?.coin || '0',
          v_660822,
          v_d0b6d4?.joindesc || '',
          v_d0b6d4?.name || '',
          v_d0b6d4?.xrunPrice || 0,
          v_9b57fc,
        );

        if (v_3393e3 && v_3393e3.data) {
          console.log('API response received:', v_3393e3);
          v_d2702f(false);

          console.log('✅ 리워드 처리 완료 - 사용자 버튼 클릭 대기');
          v_1a68d1(true);
        }
      } catch (v_5e9bfe) {
        console.error('Error calling API:', v_5e9bfe);
        v_d2702f(false);

        console.log('✅ 리워드 처리 완료 (에러 발생) - 사용자 버튼 클릭 대기');
        v_1a68d1(true);
      }
    } catch (v_5e9bfe) {
      console.error('Error in ad completion process:', v_5e9bfe);
      v_d2702f(false);

      if (v_27bab6.current) {
        clearTimeout(v_27bab6.current);
        v_27bab6.current = null;
      }
      if (v_d35ccb.current) {
        clearInterval(v_d35ccb.current);
        v_d35ccb.current = null;
      }

      v_1a68d1(true);
      console.log('✅ 리워드 처리 완료 (전체 에러) - 사용자 버튼 클릭 대기');
    } finally {
      v_d2702f(false);
    }
  };

  v_c4deb2(() => {
    const v_7a424f = async (v_3b10d8) => {
      console.log('App state change:', v_94a194, '->', v_3b10d8);

      if (
        v_94a194.match(/inactive|background/) &&
        v_3b10d8 === 'active' &&
        v_b42caf &&
        v_9f9e7d &&
        !v_7a79cf &&
        !v_7b73c7
      ) {
        console.log('✅ App returned from ad - processing completion');
        await v_653132();
      }

      v_3fff8d(v_3b10d8 as 'active' | 'background' | 'inactive' | 'unknown' | 'extension');
    };

    const v_269481 = v_6b5698.addEventListener('change', v_7a424f);

    return () => {
      v_269481?.remove();
    };
  }, [v_94a194, v_b42caf, v_9f9e7d, v_7a79cf, v_7b73c7]);

  const v_812230 = () => {
    console.log('뒤로가기 버튼 클릭 - CameraMainScreen으로 이동');
    v_8b3d54(false);
    v_e10ff9();
    v_7f2e65();
  };

  const v_34fafc = () => {
    console.log('광고 호출 실패 확인 버튼 클릭 - CameraMainScreen으로 이동');
    v_ed6932(false);
    v_e10ff9();
    v_7f2e65();
  };

  const v_bde5d3 = () => {
    console.log('다른 광고 보기 버튼 클릭 - CameraMainScreen으로 이동');
    v_e10ff9();
    v_7f2e65();
  };

  const v_5ca23e = () => {
    console.log('취소 버튼 클릭 - CameraMainScreen으로 이동');
    v_e10ff9();
    v_7f2e65();
  };

  const v_ed89ba = () => {
    console.log('맵으로 이동 버튼 클릭 - MapMainScreen으로 이동');

    if (v_27bab6.current) {
      clearTimeout(v_27bab6.current);
      v_27bab6.current = null;
    }
    if (v_d35ccb.current) {
      clearInterval(v_d35ccb.current);
      v_d35ccb.current = null;
    }
    v_1a68d1(false);
    v_e10ff9();
    v_7f2e65();
  };

  const v_e36569 = v_de06a3(async () => {
    console.log('광고 보기 버튼 클릭');

    try {

      if (v_9f9e7d?.landing_url) {
        await v_ece582(v_9f9e7d.landing_url);
      } else {
        console.error('[광고보기] landing_url이 없습니다.');
        v_ed6932(true);
      }
    } catch (v_5e9bfe) {
      console.error('[광고보기] URL 열기 실패:', v_5e9bfe);
      v_ed6932(true);
    }
  }, [v_9f9e7d, v_ece582]);

  if (!v_d0b6d4) {
    return null;
  }

  return (
    <View style={v_d81136.root}>
      <StatusBar style="dark" />

      {}
      {!v_cd31a8 && !v_915a6b && !v_7a79cf && !v_7b73c7 && v_9f9e7d && (
        <Pressable
          style={v_d81136.topClickArea}
          onPress={v_e36569}
        />
      )}

      {}
      {(v_cd31a8 || v_915a6b || v_7a79cf) && (
        <View style={v_d81136.loadingContainer}>
          {!v_7a79cf || !v_452edc ? (
            <>
              <SequentialDots />
              <Text style={v_d81136.loadingText}>
                {v_7a79cf
                  ? v_8d41d7('screens.showNapAd.processingReward')
                  : v_8d41d7('screens.showNapAd.loading')}
              </Text>

              {v_7a79cf && <SequentialDots />}
            </>
          ) : null}

          {v_7a79cf && (
            <TouchableOpacity
              onPress={v_452edc ? v_ed89ba : undefined}
              activeOpacity={v_452edc ? 0.7 : 1}
              disabled={!v_452edc}
              style={v_d81136.goToMapLinkContainer}
            >
              <Text
                style={[
                  v_d81136.goToMapLink,
                  !v_452edc && v_d81136.goToMapLinkDisabled,
                ]}
              >
                {v_8d41d7('screens.showNapAd.goToMap')}
              </Text>
            </TouchableOpacity>
          )}

          {v_9c4d53 && (
            <TouchableOpacity
              style={v_d81136.backButton}
              onPress={v_812230}
              activeOpacity={0.7}
            >
              <Text style={v_d81136.backButtonText}>{v_8d41d7('screens.showNapAd.back')}</Text>
            </TouchableOpacity>
          )}

          {v_5267b5 && (
            <TouchableOpacity
              style={v_d81136.alternativeAdButton}
              onPress={v_bde5d3}
              activeOpacity={0.7}
            >
              <Text style={v_d81136.alternativeAdButtonText}>{v_8d41d7('screens.showNapAd.alternativeAd')}</Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      {}
      {!v_cd31a8 && !v_915a6b && !v_7a79cf && v_7b73c7 && (
        <View style={[v_d81136.campaignContainer, v_d81136.errorContainer]}>
          <Text style={v_d81136.modalText}>
            {v_8d41d7('screens.showNapAd.adCallFailed')}
          </Text>
          <Text style={v_d81136.modalSubText}>
            {v_8d41d7('screens.showNapAd.adCallFailedSub')}
          </Text>
          <View style={[v_d81136.buttonContainer, { justifyContent: 'center', marginTop: 20 }]}>
            <TouchableOpacity onPress={v_34fafc} style={[v_d81136.okButton, { flex: 0, minWidth: 200 }]}>
              <Text style={v_d81136.okButtonText}>{v_8d41d7('screens.showNapAd.confirm')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {}
      {!v_cd31a8 && !v_915a6b && !v_7a79cf && !v_7b73c7 && v_9f9e7d && (
        <View style={v_d81136.campaignContainer}>
          <Text style={v_d81136.campaignTitle}>
            {v_9f9e7d.ad_name || v_d0b6d4.name || v_8d41d7('screens.showNapAd.campaignInfo')}
          </Text>
          <Text style={v_d81136.campaignReward}>
            {v_8d41d7('screens.showNapAd.reward')} : {(v_d0b6d4.xrunPrice || 0).toFixed(2)} XRUN
          </Text>
          <Text style={v_d81136.campaignDesc}>
            {v_9f9e7d.ad_description || v_8d41d7('screens.showNapAd.campaignDesc')}
          </Text>

          {}
          {v_d0b6d4.joindesc && v_d0b6d4.joindesc !== '' && (
            <View style={v_d81136.joinDescContainer}>
              <Text style={v_d81136.joinDescTitle}>{v_8d41d7('screens.showNapAd.joinMethod')}</Text>
              <SafeScrollView
                style={v_d81136.joinDescScrollView}
                showsVerticalScrollIndicator={true}
                nestedScrollEnabled={true}
                contentContainerStyle={{ paddingBottom: 20 }}
              >
                <Text style={v_d81136.joinDescText}>
                  {v_d0b6d4.joindesc}
                </Text>
              </SafeScrollView>
            </View>
          )}

          <View style={v_d81136.buttonContainer}>
            <TouchableOpacity
              style={v_d81136.watchAdButton}
              onPress={v_e36569}
              activeOpacity={0.7}
            >
              <Text style={v_d81136.watchAdButtonText}>{v_8d41d7('screens.showNapAd.watchAd')}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={v_d81136.cancelButton}
              onPress={v_5ca23e}
              activeOpacity={0.7}
            >
              <Text style={v_d81136.cancelButtonText}>{v_8d41d7('screens.showNapAd.cancel')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {}
      {v_7a79cf && (
        <View style={v_d81136.bannerContainer}>
          <TaboolaBanner
            placementType="reward_OS_395x80"
            onLoadComplete={() => {
              console.log('[ShowPockAdScreen] Taboola 배너 로딩 완료');
              v_5a7a1a(true);
            }}
          />
        </View>
      )}
    </View>
  );
};

const v_d81136 = v_472849.create({
  root: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '80%',
    alignSelf: 'center',
    flex: 1,
    paddingBottom: 100, 
  },
  loadingText: {
    fontFamily: 'Roboto-Regular',
    fontSize: v_843035.size.medium,
    color: 'grey',
    textAlign: 'center',
    marginTop: 10,
    width: '100%',
    flexWrap: 'wrap',
  },
  retryText: {
    fontFamily: 'Roboto-Regular',
    fontSize: v_843035.size.msmall,
    color: '#388Dc8',
    textAlign: 'center',
    marginTop: 10,
    width: '100%',
    flexWrap: 'wrap',
  },
  alternativeAdButton: {
    backgroundColor: '#FFDC04',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 20,
    alignSelf: 'center',
    width: '80%',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  alternativeAdButtonText: {
    fontSize: v_843035.size.medium,
    fontFamily: 'Roboto-Bold',
    color: '#343a59',
    textAlign: 'center',
  },
  backButton: {
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 15,
    alignSelf: 'center',
    width: '60%',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  backButtonText: {
    fontSize: v_843035.size.medium,
    fontFamily: 'Roboto-Bold',
    color: 'white',
    textAlign: 'center',
  },
  goToMapLinkContainer: {
    marginTop: 20,
    alignSelf: 'center',
  },
  goToMapLink: {
    fontSize: v_843035.size.medium,
    fontFamily: 'Roboto-Medium',
    color: '#388Dc8',
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
  goToMapLinkDisabled: {
    color: '#999',
    textDecorationLine: 'none',
  },
  bannerContainer: {
    position: 'absolute',
    bottom: 65,
    left: 0,
    right: 0,
    width: '100%',
    zIndex: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    elevation: 5,
    position: 'absolute',
    width: '85%',
    paddingTop: 24,
    marginHorizontal: 'auto',
  },
  modalText: {
    fontSize: v_843035.size.mmedium,
    fontFamily: 'Roboto-Regular',
    marginBottom: 10,
    color: 'black',
    textAlign: 'center',
  },
  modalSubText: {
    fontSize: v_843035.size.msmall,
    fontFamily: 'Roboto-Regular',
    marginBottom: 20,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },
  okButton: {
    backgroundColor: '#388Dc8',
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 8,
    width: 110,
    alignSelf: 'center',
    marginTop: 2,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  okButtonText: {
    fontSize: v_843035.size.medium,
    fontFamily: 'Roboto-Bold',
    color: 'white',
    textAlign: 'center',
  },
  campaignContainer: {
    marginTop: 20,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 12,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    marginHorizontal: 20,
    alignItems: 'center',
    height: '70%',
    justifyContent: 'flex-start',
  },
  campaignTitle: {
    fontSize: v_843035.size.mmedium,
    fontFamily: 'Roboto-Bold',
    marginBottom: 10,
    color: '#343a59',
    textAlign: 'center',
  },
  campaignReward: {
    fontSize: v_843035.size.medium,
    fontFamily: 'Roboto-Medium',
    marginBottom: 10,
    color: '#388Dc8',
    textAlign: 'center',
  },
  campaignDesc: {
    fontSize: v_843035.size.msmall,
    fontFamily: 'Roboto-Regular',
    color: '#666',
    textAlign: 'center',
    lineHeight: 18,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 'auto',
    gap: 15,
    paddingTop: 10,
  },
  watchAdButton: {
    backgroundColor: '#FFDC04',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 8,
    flex: 1,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    alignItems: 'center',
  },
  watchAdButtonText: {
    fontSize: v_843035.size.medium,
    fontFamily: 'Roboto-Bold',
    color: '#343a59',
    textAlign: 'center',
  },
  cancelButton: {
    backgroundColor: '#E0E0E0',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 8,
    flex: 1,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: v_843035.size.medium,
    fontFamily: 'Roboto-Bold',
    color: '#666',
    textAlign: 'center',
  },
  joinDescContainer: {
    width: '100%',
    marginTop: 20,
    marginBottom: 15,
    flex: 1,
  },
  joinDescTitle: {
    fontSize: v_843035.size.medium,
    fontFamily: 'Roboto-Bold',
    color: '#343a59',
    textAlign: 'center',
    marginBottom: 8,
  },
  joinDescScrollView: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#e9ecef',
    marginBottom: 20,
  },
  joinDescText: {
    fontSize: v_843035.size.msmall,
    fontFamily: 'Roboto-Regular',
    color: '#495057',
    lineHeight: 18,
    textAlign: 'left',
  },
  errorContainer: {
    height: 'auto',
    minHeight: 200,
    maxHeight: 300,
    maxWidth: '80%',
    alignSelf: 'center',
    justifyContent: 'center',
  },
  topClickArea: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '50%',
    backgroundColor: 'transparent',
    zIndex: 1,
  },
});
