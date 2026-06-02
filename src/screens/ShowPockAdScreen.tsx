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
import { v_2694e4 } from 'ahewcyoxtiosvtfuluxp';
import { v_b5df25 } from 'ernurodqvmtspux';
import { v_e0068c } from 'vvfgtwbmdpbnvhtfbtbgudicfmpscw';
import { v_772971 } from 'jmpfvteuuztnp';
import { v_700ef9 } from '../context';
import { v_4b1173 } from '../context/AlertDialogContext';
import { v_a0daa8, v_ce4741 } from '../navigation';
import { v_f3de6d } from '../utils/napApiUtils';
import { v_aa7dc1, v_167376, v_38f5f4, v_8cba1e, v_f4cc2d, v_563153, v_5e0191, v_fda57c } from '../services';
import { v_cba33f } from '../utils';
import v_e84827 from 'bkjbgtcoyuizqwgwtnaxmfkyvlqwevapsqmanbsnv';
import { v_143351, v_570c34 } from '../components';
import { v_843035 } from '../constants';
import { v_6b63f9 } from '../types';
import { v_25515d } from 'zvyjokvuouwvifyzks';

const SequentialDots: v_a3453e.FC = () => {
  const [v_9b82f3, v_67dd3d] = v_5ab095(0);

  v_c4deb2(() => {
    const v_ad1d65 = setInterval(() => {
      v_67dd3d(v_ba2215 => (v_ba2215 + 1) % 3);
    }, 300);
    return () => clearInterval(v_ad1d65);
  }, []);

  return (
    <View style={{ flexDirection: 'row', marginTop: 20 }}>
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
  isModal?: boolean; 
}

export const ShowPockAdScreen: v_a3453e.FC<ShowPockAdScreenProps> = ({ onClose: v_0890f8, isModal: v_bf1005 = false }) => {
  const { t: v_8d41d7 } = v_772971();
  const v_033e14 = v_e0068c();
  const { advertisementParams: v_d0b6d4, resetAdvertisementParams: v_e10ff9 } = v_700ef9();
  const { showAlert: v_889fad } = v_4b1173();
  const { navigate: v_9b57fc, reset: v_487a25, goBack: v_c7ac57 } = v_a0daa8();

  const v_7f2e65 = v_de06a3(() => {
    v_e10ff9();

    v_3e5456(false);
    v_73b253.current = false;
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
  const [v_cd0b08, v_1094fa] = v_5ab095(false);
  const [v_b2dceb, v_e60eaf] = v_5ab095('');
  const v_35f830 = v_e662ae<v_2694e4>(null);
  const v_3e9bc0 = v_e662ae<string>(''); 

  const v_27bab6 = v_e662ae<NodeJS.Timeout | null>(null);
  const v_d35ccb = v_e662ae<NodeJS.Timeout | null>(null);
  const v_64c30d = v_e662ae(false);
  const v_73b253 = v_e662ae(false); 

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

      if (v_64c30d.current) {
        console.log('[ShowPockAdScreen] 이미 광고 데이터를 가져오는 중입니다.');
        return;
      }

      if (!v_766d99 || !v_766d99.campid || v_766d99.campid === '') {
        console.error('❌ [ShowPockAdScreen] campid가 유효하지 않습니다:', {
          campid: v_766d99?.campid,
          advertisement: v_766d99?.advertisement,
          fullParams: JSON.stringify(v_766d99, null, 2),
        });
        v_deef62(false);
        await v_889fad(
          v_8d41d7('screens.showPockAd.alerts.error', { defaultValue: '알림' }),
          v_8d41d7('screens.showPockAd.alerts.invalidCampaign', { defaultValue: '광고 정보를 불러올 수 없습니다. 잠시 후 다시 시도해 주세요.' }),
          [{ text: v_8d41d7('screens.showPockAd.alerts.confirm', { defaultValue: '확인' }), onPress: v_7f2e65 }],
        );
        return;
      }

      const v_aa0917 = v_766d99.campid || '';

      if (!v_9f9e7d) {
        console.log('✅ [ShowPockAdScreen] 기본 정보로 UI 우선 표시');
        v_32baa9({
          ad_name: v_766d99.name || '',
          ad_description: '', 
          ad_profit: v_766d99.xrunPrice || 0,
          landing_url: v_766d99.urlAD || '',
        } as any);
        v_deef62(false); 
      }

      if (v_766d99?.urlAD && v_766d99.urlAD !== '') {
        console.log('✅ [ShowPockAdScreen] urlAD 사용, API 호출 불필요');

        if (v_9f9e7d) {
          v_32baa9(v_ba2215 => ({
            ...(v_ba2215 || {}),
            landing_url: v_766d99.urlAD || (v_ba2215?.landing_url || ''),
          }));
        }
        v_32baa9({
          ad_name: v_766d99.name || '',
          ad_description: '',
          ad_profit: v_766d99.xrunPrice || 0,
          landing_url: v_766d99.urlAD,
          ad_participation: v_766d99.joindesc || '',
        } as any);
        v_deef62(false);
        return;
      }

      console.warn('⚠️ [ShowPockAdScreen] urlAD가 없습니다. 서버 응답 확인 필요');
      v_deef62(false);
    } catch (v_5e9bfe) {
      console.error('Pock 광고 초기화 실패:', v_5e9bfe);
      v_deef62(false);

      if (!v_9f9e7d?.landing_url) {
        console.log('❌ 광고 초기화 실패 - 팝업 표시');
        v_ed6932(true);
      }
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
      console.log('WebView로 URL 표시:', v_f71b56);

      v_e60eaf(v_f71b56);
      v_3e9bc0.current = v_f71b56; 
      v_1094fa(true);
      console.log('✅ WebView 모달 표시');
    } catch (v_5e9bfe) {
      console.error('❌ WebView 표시 실패:', v_5e9bfe);
      throw v_5e9bfe;
    }
  };

  const v_3aa877 = v_de06a3(async () => {
    console.log('[WebView] 닫기 버튼 클릭');
    v_1094fa(false);
    v_e60eaf('');
    v_3e9bc0.current = ''; 
    v_73b253.current = false;
    v_3e5456(false);

    console.log('[WebView 닫기] 광고 모달 닫기 및 AR 화면으로 이동');
    v_e10ff9();
    v_7f2e65();

    if (v_9b57fc) {
      v_9b57fc(v_ce4741.map);
    }
  }, [v_9b57fc, v_e10ff9, v_7f2e65]);

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

      console.log('✅ 광고 완료 처리 (리워드는 이미 버튼 클릭 시 호출 완료)');

      try {
        console.log('[광고완료] TopAd5 새로고침 시작');
        await v_563153(v_9b57fc, true); 
        console.log('[광고완료] TopAd5 새로고침 완료');
      } catch (v_b87cac) {
        console.warn('[광고완료] TopAd5 새로고침 실패 (무시):', v_b87cac);
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

  const v_5ca23e = async () => {
    console.log('취소 버튼 클릭 - AR 화면으로 이동');
    v_e10ff9();

    await v_e84827.setItem('shouldNavigateToCamera', 'true');
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

    if (v_73b253.current) {
      console.log('⚠️ [광고보기] 이미 처리 중입니다. 중복 호출 무시');
      return;
    }

    console.log('광고 보기 버튼 클릭 (AsyncStorage URL 사용)');
    v_73b253.current = true;

    try {
      const v_aa0917 = v_d0b6d4?.campid || '';

      if (!v_aa0917 || v_aa0917 === '') {
        console.error('[광고보기] campid가 없습니다.');
        v_ed6932(true);
        v_73b253.current = false;
        return;
      }

      let v_86f7c0 = v_d0b6d4?.urlAD || v_9f9e7d?.landing_url || '';

      if (!v_86f7c0) {
        try {
          const v_90e1d7 = await v_e84827.getItem('cached_AD');
          if (v_90e1d7) {
            const v_4fc87f = JSON.parse(v_90e1d7);
            const v_ec0ea0 = v_d0b6d4?.campid || '';
            if (v_4fc87f[v_ec0ea0]?.urlAD) {
              v_86f7c0 = v_4fc87f[v_ec0ea0].urlAD;
              console.log('[광고보기] AsyncStorage cached_AD에서 landing_url 가져옴:', v_86f7c0);

              if (v_86f7c0.startsWith('market://') || v_86f7c0.startsWith('intent://')) {
                console.warn('[광고보기] 캐시에 market:// 또는 intent:// 발견 - 백엔드에서 변환되어야 함. 캐시에서 제거:', v_ec0ea0);
                delete v_4fc87f[v_ec0ea0];
                await v_e84827.setItem('cached_AD', JSON.stringify(v_4fc87f));
                v_86f7c0 = ''; 
              }
            }
          }
        } catch (v_2bf859) {
          console.warn('[광고보기] 캐시 확인 실패:', v_2bf859);
        }
      }

      if (!v_86f7c0 || v_86f7c0 === '') {
        console.error('[광고보기] landing_url이 없습니다. 서버 응답 확인 필요');
        v_ed6932(true);
        v_73b253.current = false;
        return;
      }

      console.log('[광고보기] [1-1] URL로 이동:', v_86f7c0);
      v_3e5456(true);
      await v_ece582(v_86f7c0);
      console.log('[광고보기] [1-1] WebView 모달 표시 완료');

      console.log('[광고보기] [1-2] TopAd5 새로고침 시작 (백그라운드)');
      v_563153(v_9b57fc, true).catch((v_b87cac) => {
        console.warn('[광고보기] [1-2] TopAd5 새로고침 실패 (무시):', v_b87cac);
      });

      (async () => {
        try {

          try {
            const v_ef7306 = await v_e84827.getItem('userData');
            if (v_ef7306) {
              const v_ff39bc = JSON.parse(v_ef7306);
              const v_660822 = v_ff39bc?.member;
              if (v_660822) {
                console.log('[광고보기] processAdReward 호출 시작 (백그라운드)');
                const v_6c45ed = await v_38f5f4(
                  parseInt(v_660822, 10),
                  v_aa0917,
                  'pointclick',
                  v_9b57fc,
                );
                console.log('[광고보기] processAdReward 응답:', v_6c45ed);
              }
            }
          } catch (v_53d118) {
            if (v_53d118?.code === 404 || v_53d118?.message?.includes('404')) {
              console.log('[광고보기] 이미 본 광고 (404) - 정상 처리');
            } else {
              console.warn('[광고보기] processAdReward 실패 (무시):', v_53d118);
            }
          }

          try {
            console.log('[광고보기] removeAdFromTopAd5 호출 (백그라운드)');
            await v_8cba1e(v_aa0917, v_9b57fc);
            console.log('[광고보기] removeAdFromTopAd5 완료');
          } catch (v_61e099) {
            console.warn('[광고보기] removeAdFromTopAd5 실패 (무시):', v_61e099);
          }

          await v_5e0191(v_aa0917);
          v_fda57c('point_click');

          await v_e84827.setItem('isAdCompleted', 'true');
          await v_e84827.setItem('shouldRefreshTopAd5', 'true');
          await v_e84827.setItem('shouldNavigateToCamera', 'true');
          await v_e84827.setItem('completedAdCampid', v_aa0917);
          console.log('[광고보기] [2단계] 백그라운드 처리 완료');

        } catch (v_39d018) {
          console.warn('[광고보기] 백그라운드 처리 실패:', v_39d018);
        }
      })();
    } catch (v_5e9bfe) {
      console.error('[광고보기] URL 열기 실패:', v_5e9bfe);
      v_ed6932(true);
    } finally {

      v_73b253.current = false;
    }
  }, [v_9f9e7d, v_ece582, v_d0b6d4, v_0890f8, v_e10ff9, v_7f2e65]);

  if (!v_d0b6d4) {
    return null;
  }

  return (
    <View style={[v_d81136.root, v_bf1005 && v_d81136.modalRoot]}>
      {!v_bf1005 && <StatusBar style="dark" />}

      {}
      {!v_bf1005 && (
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'flex-start',
          paddingHorizontal: 16,
          paddingTop: v_033e14.top + 12,
          paddingBottom: 12,
          borderBottomWidth: 1,
          borderBottomColor: '#e0e0e0',
          backgroundColor: '#fff',
        }}>
          <TouchableOpacity
            onPress={v_7f2e65}
            style={{
              padding: 8,
            }}
          >
            <Ionicons name="close" size={24} color="#000" />
          </TouchableOpacity>
        </View>
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
          <View style={[v_d81136.buttonContainers, { justifyContent: 'center', alignItems: 'center', marginTop: 20 }]}>
            <TouchableOpacity onPress={v_34fafc} style={[v_d81136.okButton, { flex: 0, minWidth: 200 }]}>
              <Text style={v_d81136.okButtonText}>{v_8d41d7('screens.showNapAd.confirm')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {}
      {!v_cd31a8 && !v_915a6b && !v_7a79cf && !v_7b73c7 && v_9f9e7d && (
        <View style={[v_d81136.campaignContainer, v_bf1005 && v_d81136.modalCampaignContainer]}>
          {}
          {v_bf1005 && (
            <TouchableOpacity
              onPress={v_7f2e65}
              style={{
                position: 'absolute',
                top: 12,
                right: 12,
                zIndex: 10,
                padding: 8,
                backgroundColor: 'transparent',
              }}
            >
              <Ionicons name="close" size={24} color="#000" />
            </TouchableOpacity>
          )}
          <View style={v_d81136.campaignBox}>
            <Text style={v_d81136.campaignTitle}>
              {v_9f9e7d.ad_name || v_d0b6d4.name || v_8d41d7('screens.showNapAd.campaignInfo')}
            </Text>
          </View>
          <Text style={v_d81136.campaignReward}>
            {v_8d41d7('screens.showNapAd.reward')} : {(() => {
              const v_6bbb57 = v_d0b6d4?.xrunPrice || 0;
              const v_123554 = parseFloat(String(v_6bbb57));
              return isNaN(v_123554) ? '0.00' : v_123554.toFixed(2);
            })()} XRUN
          </Text>
          <Text style={v_d81136.campaignDesc}>
            {v_9f9e7d.ad_description || ''}
          </Text>

          {}
          {(v_9f9e7d.ad_participation || v_d0b6d4.joindesc) && (
            <View style={v_d81136.joinDescContainer}>
              <Text style={v_d81136.joinDescTitle}>{v_8d41d7('screens.showNapAd.joinMethod')}</Text>
              <SafeScrollView
                style={v_d81136.joinDescScrollView}
                showsVerticalScrollIndicator={true}
                nestedScrollEnabled={true}
                contentContainerStyle={{ paddingBottom: 20 }}
                showBottomBackground={false}
              >
                <Text style={v_d81136.joinDescText}>
                  {v_9f9e7d.ad_participation || v_d0b6d4.joindesc}
                </Text>
              </SafeScrollView>
            </View>
          )}

        </View>
      )}

      {}
      {v_7a79cf && (
        <View style={v_d81136.bannerContainer}>
          <PangleBanner
            placementType="reward_OS_395x80"
            onLoadComplete={() => {
              console.log('[ShowPockAdScreen] Taboola 배너 로딩 완료');
              v_5a7a1a(true);
            }}
          />
        </View>
      )}

      {}
      <Modal
        visible={v_cd0b08}
        animationType="slide"
        onRequestClose={v_3aa877}
        presentationStyle="fullScreen"
      >
        <View style={v_d81136.webViewContainer}>
          <StatusBar style="dark" />
          <View style={[v_d81136.webViewHeader, { paddingTop: v_033e14.top + 12 }]}>
            <Text
              style={v_d81136.webViewTitle}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {v_9f9e7d?.ad_name || v_d0b6d4?.name || '광고 보기'}
            </Text>
          </View>
          {v_b2dceb ? (
            <View style={v_d81136.webViewWrapper}>
              <WebView
                ref={v_35f830}
                source={{ uri: v_b2dceb }}
                style={v_d81136.webView}
                onNavigationStateChange={(v_b8df7f) => {
                  console.log('[WebView] 네비게이션:', v_b8df7f.url);

                  const v_a74ae7 = v_3e9bc0.current;
                  if (v_a74ae7 && (v_a74ae7.includes('buzzvil.com') || v_a74ae7.includes('appsflyer.com'))) {
                    if (v_b8df7f.url && (v_b8df7f.url.startsWith('market://') || v_b8df7f.url.startsWith('intent://'))) {
                      console.warn('[WebView] ⚠️ 광고 URL이 마켓으로 리다이렉트됨. 원래 URL로 되돌림:', {
                        originalUrl: v_a74ae7,
                        redirectedUrl: v_b8df7f.url,
                      });

                      v_e60eaf(v_a74ae7);
                      return;
                    }

                    if (v_b8df7f.url && (v_b8df7f.url.includes('play.google.com') || v_b8df7f.url.includes('apps.apple.com'))) {

                      if (!v_a74ae7.includes('play.google.com') && !v_a74ae7.includes('apps.apple.com')) {
                        console.warn('[WebView] ⚠️ 광고 URL이 마켓으로 리다이렉트됨. 원래 URL로 되돌림:', {
                          originalUrl: v_a74ae7,
                          redirectedUrl: v_b8df7f.url,
                        });

                        v_e60eaf(v_a74ae7);
                        return;
                      }
                    }
                  }

                  if (v_b8df7f.url && v_b8df7f.url.startsWith('market://')) {
                    try {
                      const v_ae8a0a = v_b8df7f.url.match(/[?&]id=([^&?#]+)/);
                      if (v_ae8a0a) {
                        const v_77de37 = v_ae8a0a[1];
                        const v_a1e9b4 = `https://play.google.com/store/apps/details?id=${v_77de37}`;
                        console.log('[WebView] market://를 play.google.com으로 변환 (onNavigationStateChange):', v_a1e9b4);
                        v_e60eaf(v_a1e9b4);
                      }
                    } catch (v_5e9bfe) {
                      console.error('[WebView] market:// 변환 실패:', v_5e9bfe);
                    }
                  } else if (v_b8df7f.url && v_b8df7f.url.startsWith('intent://')) {
                    try {
                      let v_77de37 = '';
                      const v_ae8a0a = v_b8df7f.url.match(/[?&]id=([^&?#]+)/);
                      if (v_ae8a0a) {
                        v_77de37 = v_ae8a0a[1];
                      } else {
                        const v_d555bc = v_b8df7f.url.match(/package=([^;]+)/);
                        if (v_d555bc) {
                          v_77de37 = v_d555bc[1];
                        }
                      }
                      if (v_77de37) {
                        const v_a1e9b4 = `https://play.google.com/store/apps/details?id=${v_77de37}`;
                        console.log('[WebView] intent://를 play.google.com으로 변환 (onNavigationStateChange):', v_a1e9b4);
                        v_e60eaf(v_a1e9b4);
                      }
                    } catch (v_5e9bfe) {
                      console.error('[WebView] intent:// 변환 실패:', v_5e9bfe);
                    }
                  }
                }}
                onShouldStartLoadWithRequest={(v_576f5a) => {
                  const { url: v_f71b56 } = v_576f5a;
                  console.log('[WebView] 네비게이션 요청:', v_f71b56);

                  const v_a74ae7 = v_3e9bc0.current;
                  if (v_a74ae7 && (v_a74ae7.includes('buzzvil.com') || v_a74ae7.includes('appsflyer.com'))) {
                    if (v_f71b56.startsWith('market://') || v_f71b56.startsWith('intent://')) {
                      console.warn('[WebView] ⚠️ 광고 URL이 마켓으로 리다이렉트됨. 차단:', {
                        originalUrl: v_a74ae7,
                        redirectedUrl: v_f71b56,
                      });
                      return false; 
                    }

                    if (v_f71b56.includes('play.google.com') || v_f71b56.includes('apps.apple.com')) {

                      if (!v_a74ae7.includes('play.google.com') && !v_a74ae7.includes('apps.apple.com')) {
                        console.warn('[WebView] ⚠️ 광고 URL이 마켓으로 리다이렉트됨. 차단:', {
                          originalUrl: v_a74ae7,
                          redirectedUrl: v_f71b56,
                        });
                        return false; 
                      }
                    }
                  }

                  if (v_f71b56.startsWith('market://') || v_f71b56.startsWith('intent://')) {
                    console.warn('[WebView] market:// 또는 intent:// 스킴 감지 - 백엔드에서 변환되어야 함:', v_f71b56);
                    return false; 
                  }

                  const v_29ef18 = [
                    'coupang://', 'coupangapp://', 
                    '11st://', 'auction://', 'gmarket://', 'tmon://', 'wemakeprice://', 
                    'lotteon://', 'ssg://', 'shinsegae://', 
                    'instagram://', 'kakao://', 'kakaotalk://', 'line://', 'tiktok://', 
                    'youtube://', 'twitter://', 'x://', 
                    'netflix://', 'disneyplus://', 'watcha://', 
                    'kakaopay://', 'naverpay://', 'toss://', 'payco://', 
                  ];

                  for (const v_bee33e of v_29ef18) {
                    if (v_f71b56.startsWith(v_bee33e)) {
                      console.log(`[WebView] ${v_bee33e} 앱 스킴 감지, 외부 앱으로 열기:`, v_f71b56);
                      v_f2c756.openURL(v_f71b56).catch((v_49263d) => {
                        console.error(`[WebView] ${v_bee33e} 앱 열기 실패:`, v_49263d);
                      });
                      return false; 
                    }
                  }

                  if (v_f71b56.startsWith('tel:') ||
                    v_f71b56.startsWith('mailto:') ||
                    v_f71b56.startsWith('sms:') ||
                    v_f71b56.startsWith('fb://') ||
                    v_f71b56.startsWith('facebook://')) {
                    console.log('[WebView] 커스텀 스킴 감지, 외부 앱으로 열기:', v_f71b56);
                    v_f2c756.openURL(v_f71b56).catch((v_49263d) => {
                      console.error('[WebView] 외부 앱 열기 실패:', v_49263d);
                    });
                    return false; 
                  }

                  if (v_f71b56.includes('facebook.com') && !v_f71b56.startsWith('http://') && !v_f71b56.startsWith('https://')) {
                    console.log('[WebView] 페이스북 링크 감지, 외부 앱으로 열기 시도:', v_f71b56);
                    v_f2c756.openURL(v_f71b56).catch((v_49263d) => {
                      console.error('[WebView] 페이스북 앱 열기 실패, WebView에서 계속 로드:', v_49263d);
                    });
                    return false;
                  }

                  return true;
                }}
                onLoadStart={() => {
                  console.log('[WebView] 로딩 시작');
                }}
                onLoadEnd={() => {
                  console.log('[WebView] 로딩 완료');
                }}

                onError={(v_6f3a9d) => {
                  const { nativeEvent: v_76b943 } = v_6f3a9d;
                  console.error('[WebView] 에러:', v_76b943);

                  if (v_76b943.code === -10 && v_76b943.url) {
                    const v_f71b56 = v_76b943.url;
                    console.log('[WebView] ERR_UNKNOWN_URL_SCHEME 감지:', v_f71b56);

                    if (v_f71b56.startsWith('market://') || v_f71b56.startsWith('intent://')) {
                      console.warn('[WebView] market:// 또는 intent:// 스킴 감지 - 백엔드에서 변환되어야 함:', v_f71b56);
                    }

                    else {
                      const v_29ef18 = [
                        'tel:', 'mailto:', 'sms:', 'fb://', 'facebook://',
                        'coupang://', 'coupangapp://', '11st://', 'auction://', 'gmarket://',
                        'tmon://', 'wemakeprice://', 'lotteon://', 'ssg://', 'shinsegae://',
                        'instagram://', 'kakao://', 'kakaotalk://', 'line://', 'tiktok://',
                        'youtube://', 'twitter://', 'x://', 'netflix://', 'disneyplus://',
                        'watcha://', 'kakaopay://', 'naverpay://', 'toss://', 'payco://',
                      ];

                      const v_d6cc6e = v_29ef18.some(v_bee33e => v_f71b56.startsWith(v_bee33e));
                      if (v_d6cc6e) {
                        v_f2c756.openURL(v_f71b56).catch((v_49263d) => {
                          console.error('[WebView] 외부 앱 열기 실패:', v_49263d);
                        });
                      }
                    }
                  }
                }}
                javaScriptEnabled={true}
                domStorageEnabled={true}
                startInLoadingState={true}
                scalesPageToFit={true}
                mixedContentMode="always"
                originWhitelist={['*']}
                thirdPartyCookiesEnabled={true}
                sharedCookiesEnabled={true}
              />
            </View>
          ) : null}
        </View>
      </Modal>
    </View>
  );
};

const v_d81136 = v_472849.create({
  root: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  modalRoot: {
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: 'transparent',
    width: '100%',
    maxWidth: '100%',
  },
  modalCampaignContainer: {
    paddingTop: 20, 
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginHorizontal: 0,
    marginTop: 0,
    position: 'relative', 
    width: '100%',
    maxWidth: '100%',
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
    width:'100%',
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
  campaignBox:{
    width:'75%',
    alignSelf:'center',
    padding:10,
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
  buttonContainers: {
    justifyContent: 'center',
    width: '100%',
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
  webViewContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  webViewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 12,
    borderBottomWidth: 0,
    backgroundColor: '#FFFFFF',
    marginTop: 0,
  },
  webViewCloseButton: {
    padding: 8,
    minWidth: 50,
  },
  webViewCloseText: {
    fontSize: 16,
    color: '#007AFF',
    fontFamily: 'Roboto-Regular',
  },
  webViewTitle: {
    fontSize: v_843035.size.mmedium,
    fontFamily: 'Roboto-Bold',
    color: '#343a59',
    textAlign: 'center',
    flex: 1,
    overflow: 'hidden',
  },
  webViewWrapper: {
    flex: 1,
    padding: 10,
    paddingBottom: v_326be8.OS === 'android' ? 40 : 10, 
  },
  webView: {
    flex: 1,
    borderRadius: 8,
    overflow: 'hidden',
  },
});
