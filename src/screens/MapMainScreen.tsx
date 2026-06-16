import v_a3453e, { v_5ab095, v_c4deb2, v_e662ae, v_de06a3, v_df9f57 } from 'bapkr';

import {

  v_3094a2,

  v_472849,

  v_326be8,

  v_700696,

  v_19b633,

  v_cf9c33,

  v_6b5698,

  v_09d0e5,

  v_39a996,

} from 'rcmrninabrnb';

import { v_b5df25 } from 'ernurodqvmtspux';

import v_2b5678, { v_a1c801, v_65a8f9, v_b4043e } from 'voblsepvtvpzyatxk';

import * as v_8a44cb from 'zryrlwvgokjhz';

import v_e84827 from 'bkjbgtcoyuizqwgwtnaxmfkyvlqwevapsqmanbsnv';

import { v_772971 } from 'jmpfvteuuztnp';

import { v_e0068c } from 'vvfgtwbmdpbnvhtfbtbgudicfmpscw';

import { v_f4e704, v_a77ce6, v_556baf, v_66b9cc, v_197924 } from '../components';

import { v_cc3e1f } from './CameraMainScreen';

import { v_ce4741, v_a0daa8 } from '../navigation';

import { v_4b1173 } from '../context/AlertDialogContext';
import { v_ba5086 } from '../context/OTAUpdateContext';

import { v_f71847 } from '../types';

import { v_f84ef5, v_c07360, v_91d5e4, v_965f93, v_563153, v_5d7ca4, v_e3e9a7, v_1c4683, v_aa7dc1, v_8cba1e, v_318c45, v_755eb9 } from '../services';
import { v_9bbbdc, v_9d7f6b } from '../services/walletKeyStore';
import { v_ecc3ca, v_5ed938 } from '../services';
import { v_295e39 } from '../services/taboola';

import { v_858bfa } from '../utils/imageCache';
import { v_e4a763 } from '../utils/env';
import { v_a61db3, v_843035 } from '../constants';
import { v_f3de6d, v_a4e2ac } from '../utils/napApiUtils';
import { v_cba33f } from '../utils';
import {
  v_235370,
  v_019a30,
  v_4e5f7b,
} from './walletKeyTutorialHelpers';

interface LocationData {

  latitude: number;

  longitude: number;

}

interface TopAd5Item {
  brandlogo: string;
  adthumbnail2: string;
  symbolimg: string;
  thumbnail: string;
  coins: number;
  nasPrice: number;
  campid: string;
  xrunPrice: number;
  gopaxPrice: number;
  iconurl: string;
  joindesc: string;
  name: string;
  ad_company: string;
}

let v_8daafe = null;

let v_e96568 = null;

let v_79011b = null;

let v_b636c9 = null;

let v_622956 = null;

let v_ee9562 = null;

let v_86146a = null;

let v_800dd2 = null;

try {

  v_8daafe = require('../../assets/images/icon_wallet.png');

} catch (v_9e86fd) {

  console.warn('icon_wallet.png not found');

}

try {

  v_e96568 = require('../../assets/images/icon_shop.png');

} catch (v_9e86fd) {

  console.warn('icon_shop.png not found');

}

try {

  v_79011b = require('../../assets/images/icon_referral.png');

} catch (v_9e86fd) {

  console.warn('icon_referral.png not found');

}

try {

  v_b636c9 = require('../../assets/images/icon_user.png');

} catch (v_9e86fd) {

  console.warn('icon_user.png not found');

}

try {

  v_622956 = require('../../assets/images/icon_xplay.png');

} catch (v_9e86fd) {

  console.warn('icon_xplay.png not found');

}

try {

  v_ee9562 = require('../../assets/images/icon_xrun_black.png');

} catch (v_9e86fd) {

  console.warn('icon_xrun_black.png not found');

}

try {

  v_86146a = require('../../assets/images/icon_advertisement.png');

} catch (v_9e86fd) {

  console.warn('icon_advertisement.png not found');

}

try {

  v_800dd2 = require('../../assets/images/icon_bell.png');

} catch (v_9e86fd) {

  console.warn('icon_bell.png not found');

}

let v_16772f = null;

try {

  v_16772f = require('../../assets/images/locationpin2.png');

} catch (v_9e86fd) {

  console.warn('locationpin2.png not found');

}

let v_232839 = null;

try {

  v_232839 = require('../../assets/logo_tempMarker.png');

} catch (v_9e86fd) {

  console.warn('❌ [MapMainScreen] logo_tempMarker.png not found:', v_9e86fd);

  try {
    v_232839 = require('../../assets/icon_xrun_round_logo.png');

  } catch (v_85f11a) {
    console.warn('❌ [MapMainScreen] 대체 마커 이미지도 없음:', v_85f11a);
  }
}

let v_5dede3 = null;

try {
  v_5dede3 = require('../../assets/xrun-horizontal-logo.png');
  console.log('✅ [MapMainScreen] 상단 로고 이미지 로드 성공');
} catch (v_9e86fd) {
  console.warn('❌ [MapMainScreen] xrun-horizontal-logo.png not found:', v_9e86fd);
}

export const MapMainScreen: v_a3453e.FC = () => {

  const { navigate: v_9b57fc, previousScreen: v_640ccc } = v_a0daa8();

  const { t: v_8d41d7 } = v_772971();

  const v_033e14 = v_e0068c();

  const { checkForUpdate: v_7e5bd3 } = v_ba5086();

  const v_4166d2 = v_e662ae<string | null>(null);

  const v_e790c7 = v_e662ae(false);

  v_c4deb2(() => {
    if (v_e790c7.current) return;
    v_e790c7.current = true;
    (async () => {
      try {
        const v_483de2 = await v_e84827.getItem(v_019a30);
        const v_0ba044 = await v_e84827.getItem(v_4e5f7b);

        if (v_235370(v_483de2, v_0ba044)) {
          await v_e84827.removeItem(v_019a30);
          v_9b57fc(v_ce4741.walletKeyTutorial);
          return;
        }

        if (v_0ba044 === 'true') return;
        const v_56b352 = await v_e84827.getItem('jwt');
        const v_717992 = v_56b352 ? v_9bbbdc(v_56b352) : null;
        let v_b4e012 = await v_e84827.getItem('userEmail');
        if (!v_b4e012) {
          try {
            const v_f21c33 = await v_e84827.getItem('userData');
            if (v_f21c33) v_b4e012 = (JSON.parse(v_f21c33) as { email?: string })?.email ?? null;
          } catch {  }
        }
        if (v_717992 == null || !v_b4e012) return;
        const v_7cbea7 = ['oth-test@example.invalid', 'oth-user@example.invalid', 'oth-user@example.invalid', 'oth-user@example.invalid', 'oth-user@example.invalid', 'oth-user@example.invalid', 'oth-user@example.invalid', 'oth-user@example.invalid'];
        const v_dabeaa = v_b4e012.toLowerCase().trim();
        if (!v_7cbea7.includes(v_dabeaa)) return;
        const v_1e6eca = await v_9d7f6b(v_b4e012, v_717992);
        const v_9034c6 = (v_9e86fd) =>
          v_9e86fd !== null && v_9e86fd.s === 's0' && !v_9e86fd.h;
        if (v_9034c6(v_1e6eca.eth) || v_9034c6(v_1e6eca.pol)) {
          v_9b57fc(v_ce4741.walletKeyTutorial);
        }
      } catch (v_9e86fd) {
        console.warn('[MapMain] 튜토리얼 가드 확인 실패:', v_9e86fd);
      }
    })();
  }, [v_9b57fc]);

  v_c4deb2(() => {
    v_7e5bd3();
  }, [v_7e5bd3]);

  v_c4deb2(() => {
    if (v_232839) {
      console.log('✅ [MapMainScreen] 마커 이미지 사용 가능');
    } else {
      console.warn('⚠️ [MapMainScreen] 마커 이미지 없음 - 기본 마커 사용');
    }
  }, []);

  const { showAlert: v_889fad } = v_4b1173();

  const [v_a55f0b, v_0326b2] = v_5ab095<LocationData | null>(null);

  const [v_976e82, v_a7e4fc] = v_5ab095<string | null>(null);

  const [v_ac1d22, v_02dd63] = v_5ab095<'Map' | 'Camera'>('Map');

  const [v_572bd3, v_6a4dcd] = v_5ab095(false);

  const [v_27aea1, v_22f943] = v_5ab095<v_f71847 | null>(null);

  const [v_4b9594, v_a18647] = v_5ab095<number | null>(null);

  const v_aae2cb = v_e662ae<number | null>(null);

  const [v_b4d4c5, v_14dd24] = v_5ab095<v_f71847[]>([]);

  const [v_818f4d, v_e1bb1a] = v_5ab095(false);

  const v_5db874 = v_e662ae(false); 

  const [v_b6e060, v_9cd9d5] = v_5ab095(false);

  const [v_4cf0ad, v_6549d0] = v_5ab095<TopAd5Item[]>([]);
  const v_0302dd = v_e662ae<TopAd5Item[]>([]); 
  const v_fd5fd4 = v_e662ae(false); 

  const [v_001c8f, v_d8a1fd] = v_5ab095(false);

  const [v_96b118, v_17f37a] = v_5ab095({ x: 0, y: 0 });

  const [v_456f34, v_94e8d8] = v_5ab095<v_f71847 | null>(null);

  const v_3ec640 = v_e662ae<v_2b5678>(null);

  const [v_c19838, v_b6ebe9] = v_5ab095<LocationData | null>(null);

  const [v_b8d9d3, v_c84980] = v_5ab095<LocationData | null>(null);

  const v_a2b40c = v_e662ae<LocationData | null>(null);

  const v_c38114 = v_e662ae<LocationData | null>(null);

  const v_bbb844 = v_e662ae<NodeJS.Timeout | null>(null);

  const v_e40b2a = v_e662ae<NodeJS.Timeout | null>(null);

  const v_a11b30 = v_e662ae<number>(Date.now());

  const v_9183ca = v_e662ae<number>(0);

  const v_de148f = v_e662ae({
    latitude: 37.5665,
    longitude: 126.9780,
    latitudeDelta: 0.005,
    longitudeDelta: 0.005,
  });

  const v_ca338a = v_e662ae(false);

  const v_43de51 = v_e662ae(false);

  const v_c675cc = v_e662ae<{ latitude: number; longitude: number } | null>(null);

  const [v_d5e3e8, v_c90e3b] = v_5ab095<LocationData | null>(null);

  const v_092ed4 = v_e662ae<LocationData | null>(null);

  const v_252c50 = v_e662ae<number>(0);

  const v_2651fc = 500;

  const v_14dc1f = 10000; 

  const v_13036a = 0.005;
  const v_419350 = 0.005;

  const v_b0d5ce = v_e662ae(false);

  const v_3e450c = v_e662ae(false);

  const v_a1bf82 = v_e662ae<v_8a44cb.LocationSubscription | null>(null);

  const v_f3d3c8 = 'lastGpsLocationForMapMove';
  const v_eaa10e = 'lastGpsLocationTimestamp';
  const v_8d9416 = 60 * 1000; 
  const v_f41f0d = 500; 
  const v_e03abc = 'lastMarkerCalculationLocation';
  const v_f41915 = 500; 

  const v_5f2e8e = v_e662ae(false);

  const v_9bf134 = v_e662ae(false);

  const v_772369 = v_e662ae(false);

  const v_9d72cd = v_e662ae(false);

  const v_1b0a7f = v_e662ae(false);

  const v_ceef35 = v_e662ae(false);

  const v_b37071 = v_e662ae<Set<string>>(new Set());
  const v_ba482c = v_e662ae(false);

  const v_79311c = v_e662ae<Set<string>>(new Set());

  const [v_25fba6, v_f4280a] = v_5ab095(false);
  const [v_00832d, v_b51724] = v_5ab095<{ memberId: number; email: string } | null>(null);

  v_c4deb2(() => {
    const v_43ed8b = async () => {
      try {
        const v_5885b8 = await v_e84827.getItem('failedPreFetchCampids');
        if (v_5885b8) {
          const v_ca8416 = JSON.parse(v_5885b8) as string[];
          const v_9b717b = new Set<string>(v_ca8416);
          v_79311c.current = v_9b717b;
          console.log(`[MapMainScreen] 저장된 pre-fetch 실패 정보 로드: ${v_9b717b.size}개`);
        }
      } catch (v_5e9bfe) {
        console.error('[MapMainScreen] 실패 정보 로드 실패:', v_5e9bfe);
      }
    };
    v_43ed8b();
  }, []);

  v_c4deb2(() => {
    let v_2008a4 = false;
    let v_d9e7b9 = v_6b5698.currentState;

    const v_63929d = async () => {
      try {

        const v_56b352 = await v_e84827.getItem('jwt');
        const v_717992 = v_56b352 ? v_9bbbdc(v_56b352) : null;

        let v_b4e012 = await v_e84827.getItem('userEmail');
        if (!v_b4e012) {
          try {
            const v_f21c33 = await v_e84827.getItem('userData');
            if (v_f21c33) v_b4e012 = (JSON.parse(v_f21c33) as { email?: string })?.email ?? null;
          } catch {

          }
        }

        if (v_717992 == null || !v_b4e012) return;

        const v_7cbea7 = ['oth-test@example.invalid', 'oth-user@example.invalid', 'oth-user@example.invalid', 'oth-user@example.invalid', 'oth-user@example.invalid', 'oth-user@example.invalid', 'oth-user@example.invalid', 'oth-user@example.invalid'];
        const v_dabeaa = v_b4e012.toLowerCase().trim();
        if (!v_7cbea7.includes(v_dabeaa)) return;

        const v_1e6eca = await v_9d7f6b(v_b4e012, v_717992);
        const v_9034c6 = (v_9e86fd) =>
          v_9e86fd !== null && v_9e86fd.s === 's0' && !v_9e86fd.h;
        const v_aa192c = v_9034c6(v_1e6eca.eth) || v_9034c6(v_1e6eca.pol);

        if (v_2008a4) return;
        if (v_aa192c) {

          v_b51724((v_ba2215) => {
            if (v_ba2215 && v_ba2215.memberId === v_717992 && v_ba2215.email === v_dabeaa) return v_ba2215;
            return { memberId: v_717992, email: v_dabeaa };
          });
          v_f4280a(true);
          return;
        }

        const v_b5ce2e = v_1e6eca.eth === null && v_1e6eca.pol === null;
        if (v_b5ce2e) {

          const v_53cc65 = `restoreLaterDismissedAt:${v_dabeaa}`;
          try {
            const v_620175 = await v_e84827.getItem(v_53cc65);
            if (v_620175) {
              const v_e56026 = Date.now() - Number(v_620175);
              if (v_e56026 < 10 * 60 * 1000) {

                return;
              }
            }
          } catch {  }
          const v_5a9fc7 = await v_ecc3ca().catch(() => ({ at: false, at_at: null, ok: false }));
          if (v_2008a4) return;
          console.log('[MapMain] AT 상태', v_5a9fc7, 'email=', v_dabeaa, 'member=', v_717992);
          const v_7be387 = await v_889fad(
            v_8d41d7('screens.walletRestore.restoreNeededTitle'),
            v_8d41d7('screens.walletRestore.restoreNeededMessage'),
            [
              { text: v_8d41d7('screens.walletRestore.restoreLater') },
              { text: v_8d41d7('screens.walletRestore.restoreNow') },
            ],
          );
          if (v_7be387 === 1) {
            v_9b57fc(v_ce4741.walletRestore);
          } else {

            try { await v_e84827.setItem(v_53cc65, String(Date.now())); } catch {  }
          }
        }
      } catch {

      }
    };

    v_63929d();

    const v_1ae212 = v_6b5698.addEventListener('change', (v_612414) => {
      const v_d19607 = !!v_d9e7b9.match(/inactive|background/);
      const v_1039f5 = v_612414 === 'active';
      v_d9e7b9 = v_612414;
      if (v_d19607 && v_1039f5) {
        v_63929d();
      }
    });
    return () => {
      v_2008a4 = true;
      v_1ae212.remove();
    };
  }, []);

  const v_89e09e = v_de06a3(async (v_04f49c) => {

    if (v_ba482c.current) {
      console.log('⚠️ [MapMainScreen] pre-fetch가 이미 실행 중입니다. 중복 실행 방지');
      return;
    }

    try {
      v_ba482c.current = true;
      console.log('🚀 [MapMainScreen] 백그라운드 urlAD pre-fetch 시작');
      const v_ef7306 = await v_e84827.getItem('userData');
      const v_ff39bc = v_ef7306 ? JSON.parse(v_ef7306) : null;
      const v_717992 = v_ff39bc?.member;

      if (!v_717992) {
        console.log('[MapMainScreen] memberId가 없어 pre-fetch를 중단합니다.');
        return;
      }

      const v_e7f87b = await v_f3de6d();

      const v_e1c39d = v_04f49c.filter((v_ddcfed) => {
        const v_aa0917 = String(v_ddcfed.campid || '');
        return v_aa0917 && !v_ddcfed.urlAD && !v_b37071.current.has(v_aa0917);
      });

      console.log(`🔍 [MapMainScreen] 고유 광고 pre-fetch 대상: ${v_e1c39d.length}개`);

      v_e1c39d.forEach((v_ddcfed, v_ebec57) => console.log(`📋 [PreFetch] 대상 ${v_ebec57}: id=${v_ddcfed.campid}, company=${v_ddcfed.ad_company}`));

      for (const v_ddcfed of v_e1c39d) {
        const v_aa0917 = String(v_ddcfed.campid || '');
        try {

          if (v_b37071.current.has(v_aa0917)) {
            console.log(`⏭️ [MapMainScreen] ${v_aa0917}는 이미 처리 중입니다. 건너뜀`);
            continue;
          }

          v_b37071.current.add(v_aa0917);

          const v_6030b8 = v_ddcfed.ad_check_url;
          let v_9cb87d = null;
          const v_693775 = (v_ddcfed.ad_company || '').toLowerCase();

          if (v_6030b8) {
            try {
              console.log(`🌐 [PreFetch] 요청 시작 (${v_693775}):`, v_6030b8);
              const v_3393e3 = await fetch(v_6030b8);
              const v_4e826f = await v_3393e3.json();

              if (v_693775 === 'nas') {
                const v_679b9e = typeof v_4e826f.result === 'string' ? parseInt(v_4e826f.result, 10) : v_4e826f.result;
                if (v_679b9e === 200 && v_4e826f.lurl) {
                  v_9cb87d = {
                    urlAD: v_4e826f.lurl,
                    name: v_4e826f.name,
                    joindesc: v_4e826f.rewarddesc,
                    xrunPrice: v_4e826f.price ? (v_4e826f.price / 2) : undefined
                  };
                } else {
                  console.warn(`⚠️ [PreFetch] NAS 실패: result=${v_679b9e}`);
                }
              } else if (v_693775 === 'pointclick') {
                if (v_4e826f.result_code === 200 && v_4e826f.landing_url) {
                  v_9cb87d = {
                    urlAD: v_4e826f.landing_url,
                    name: v_4e826f.ad_name,
                    joindesc: v_4e826f.ad_participation,
                    xrunPrice: v_4e826f.ad_profit
                  };
                } else {
                  console.warn(`⚠️ [PreFetch] PointClick 실패: code=${v_4e826f.result_code}`);
                }
              }
            } catch (v_da980a) {
              console.error(`❌ [PreFetch] Fetch 오류:`, v_da980a);
            }
          } else {
            console.warn(`⚠️ [PreFetch] ad_check_url 없음: ${v_ddcfed.campid}`);
          }

          if (v_9cb87d && v_9cb87d.urlAD) {

            const v_f22601 = v_9cb87d.urlAD;

            v_6549d0(v_ba2215 => {
              const v_42de16 = v_ba2215.map(v_8c0b26 =>
                (v_8c0b26.campid === v_ddcfed.campid) ? { ...v_8c0b26, urlAD: v_f22601 } : v_8c0b26
              );
              v_0302dd.current = v_42de16; 
              return v_42de16;
            });

            v_14dd24(v_ba2215 => v_ba2215.map(v_35f85c =>
              (v_35f85c.campid === v_ddcfed.campid) ? { ...v_35f85c, urlAD: v_f22601 } : v_35f85c
            ));

            try {
              const v_53db14 = await v_e84827.getItem('cached_AD');
              const v_a28e77 = v_53db14 ? JSON.parse(v_53db14) : {};

              const v_4d73f0 = {
                urlAD: v_f22601,
                joindesc: v_9cb87d.joindesc || v_ddcfed.joindesc || '',
                name: v_9cb87d.name || v_ddcfed.name || '',
                xrunPrice: v_9cb87d.xrunPrice !== undefined ? v_9cb87d.xrunPrice : (v_ddcfed.xrunPrice || 0)
              };

              v_a28e77[v_ddcfed.campid] = v_4d73f0;
              await v_e84827.setItem('cached_AD', JSON.stringify(v_a28e77));
              console.log(`💾 [MapMainScreen] 캐시 저장 완료: ${v_ddcfed.campid}`);
            } catch (v_6b2b87) {
              console.error('❌ [MapMainScreen] 캐시 저장 실패:', v_6b2b87);
            }

            console.log(`✅ [MapMainScreen] PointClick pre-fetch 성공: ${v_ddcfed.campid}`);
          } else {
            console.log(`⚠️ [MapMainScreen] 알 수 없는 회사 타입: ${v_693775}, campid: ${v_ddcfed.campid}`);
          }
        } catch (v_9e86fd) {
          console.log(`⚠️ [MapMainScreen] ${v_ddcfed.campid} pre-fetch 실패:`, v_9e86fd);

          v_79311c.current.add(v_aa0917);

          try {
            const v_ca8416 = Array.from(v_79311c.current);
            await v_e84827.setItem('failedPreFetchCampids', JSON.stringify(v_ca8416));
          } catch (v_ba483b) {
            console.error('[MapMainScreen] 실패 정보 저장 실패:', v_ba483b);
          }
        } finally {

          v_b37071.current.delete(v_aa0917);
        }
      }
    } catch (v_49263d) {
      console.error('❌ [MapMainScreen] 백그라운드 pre-fetch 오류:', v_49263d);
    } finally {

      v_ba482c.current = false;
      console.log('✅ [MapMainScreen] 백그라운드 urlAD pre-fetch 완료');
    }
  }, []);

  let v_be97ff = null;
  let v_8c4b15 = null;

  try {

    v_be97ff = require('../../assets/images/icon_xrun_black.png');

  } catch (v_9e86fd) {

    console.warn('icon_xrun_black.png not found');

  }

  try {

    v_8c4b15 = require('../../assets/images/logoMain_XRUN.png');

  } catch (v_9e86fd) {

    console.warn('logoMain_XRUN.png not found');

  }

  const v_b464ed = (v_34b365, v_a36282, v_ed3911, v_5d858d): number => {

    const v_bef3bf = 6371000; 

    const v_32a354 = (v_ed3911 - v_34b365) * Math.PI / 180;

    const v_84b828 = (v_5d858d - v_a36282) * Math.PI / 180;

    const v_779914 =

      Math.sin(v_32a354 / 2) * Math.sin(v_32a354 / 2) +

      Math.cos(v_34b365 * Math.PI / 180) * Math.cos(v_ed3911 * Math.PI / 180) *

      Math.sin(v_84b828 / 2) * Math.sin(v_84b828 / 2);

    const v_3f4e2e = 2 * Math.atan2(Math.sqrt(v_779914), Math.sqrt(1 - v_779914));

    return v_bef3bf * v_3f4e2e;

  };

  const v_524200 = v_de06a3(async (v_f18a9c, v_9d6a91 = false, v_e8ec67, v_32428f = 0) => {
    console.log('🚀 [loadMarkersForLocation] 시작:', { targetLocation: v_f18a9c, forceRefresh: v_9d6a91, hasCurrentGpsLocation: !!v_e8ec67 });

    if (v_5db874.current) {
      console.log('=== 맵 마커 로딩 중, 중복 호출 방지 ===');
      return;
    }

    const v_ef7306 = await v_e84827.getItem('userData');
    if (!v_ef7306) {
      console.log('❌ [loadMarkersForLocation] userData가 없습니다. 로그인이 필요할 수 있습니다.');
      return;
    }

    try {

      const v_ff39bc = JSON.parse(v_ef7306);
      const v_660822 = v_ff39bc?.member;
      if (!v_660822) {
        console.log('userData에 member가 없습니다.');
        return;
      }

      if (!v_9d6a91) {
        const v_99c46d = await v_e84827.getItem('astorCoinsData');
        if (v_99c46d) {

          try {
            const v_b9ce93 = JSON.parse(v_99c46d);
            if (v_b9ce93 && Array.isArray(v_b9ce93) && v_b9ce93.length > 0) {

              let v_129448 = true;
              try {
                const v_ff9d61 = await v_e84827.getItem(v_e03abc);
                if (v_ff9d61) {
                  const v_ece285 = JSON.parse(v_ff9d61);
                  const v_926d1c = v_b464ed(
                    v_f18a9c.latitude,
                    v_f18a9c.longitude,
                    v_ece285.latitude,
                    v_ece285.longitude
                  );

                  if (v_926d1c < v_f41915) {

                    const v_21c6a5 = v_b9ce93.some((v_51b584) => typeof v_51b584.distance === 'number');
                    if (v_21c6a5) {
                      v_129448 = false;
                      console.log(`✅ [MapMainScreen] 거리 재계산 생략 (${v_926d1c.toFixed(0)}m < ${v_f41915}m, 기존 거리 정보 사용)`);
                    }
                  } else {
                    console.log(`🔄 [MapMainScreen] 거리 재계산 필요 (${v_926d1c.toFixed(0)}m >= ${v_f41915}m)`);
                  }
                } else {
                  console.log('🔄 [MapMainScreen] 마지막 계산 위치 없음, 거리 재계산');
                }
              } catch (v_73747f) {
                console.error('[MapMainScreen] 마지막 계산 위치 확인 실패:', v_73747f);
              }

              const v_beddf3 = v_b9ce93
                .map((v_51b584) => {
                  const v_e1b1cf = v_51b584.latitude || v_51b584.lat;
                  const v_c87b30 = v_51b584.longitude || v_51b584.lng;

                  if (v_e1b1cf && v_c87b30) {

                    const v_926d1c = v_129448
                      ? v_b464ed(
                        v_f18a9c.latitude,
                        v_f18a9c.longitude,
                        v_e1b1cf,
                        v_c87b30
                      )
                      : (v_51b584.distance || 0);
                    return {
                      ...v_51b584,
                      distance: v_926d1c, 
                    };
                  } else {

                    return {
                      ...v_51b584,
                      distance: v_51b584.distance || Infinity,
                    };
                  }
                })
                .sort((v_779914, v_148ff6) => {

                  return (v_779914.distance || Infinity) - (v_148ff6.distance || Infinity);
                });

              if (v_129448) {
                try {
                  await v_e84827.setItem(v_e03abc, JSON.stringify(v_f18a9c));
                  await v_e84827.setItem('astorCoinsData', JSON.stringify(v_beddf3));
                  console.log('✅ [MapMainScreen] 캐시 데이터 거리 재계산 후 저장 완료');
                } catch (v_090638) {
                  console.error('[MapMainScreen] 캐시 데이터 정렬 후 저장 오류:', v_090638);
                }
              } else {

                console.log('✅ [MapMainScreen] 거리 재계산 생략, 저장 생략');
              }

              const spotDataArray: v_f71847[] = v_beddf3.map((v_51b584) => ({

                spotID: v_51b584.spotid || v_51b584.spotID || v_51b584.id || 0,
                distance: v_51b584.distance || 0,
                direction: v_51b584.direction || 0,
                name: v_51b584.name || v_51b584.title || v_51b584.brand || 'XRUN coin',
                latitude: v_51b584.latitude || v_51b584.lat,
                longitude: v_51b584.longitude || v_51b584.lng,
                xrunPrice: v_51b584.xrunprice || v_51b584.xrunPrice || v_51b584.price || 0,
                iconurl: v_51b584.iconurl || '',
                joindesc: v_51b584.joindesc || '',
                brand: v_51b584.brand || v_51b584.coin || '',
                coins: v_51b584.coins || v_51b584.coin || '',
                coin: v_51b584.coin || '',
                campid: v_51b584.campid || v_51b584.campId || '',
              } as v_f71847 & { campid?: string }));

              console.log('✅ [MapMainScreen] 캐시된 마커 데이터 사용 (개수:', v_22ecab.length, ', 거리순 정렬됨)');
              console.log('📌 [MapMainScreen] setMarkers 호출 (캐시 데이터):', v_22ecab.length, '개');
              v_14dd24(v_22ecab);
              v_c84980(v_f18a9c);
              v_a2b40c.current = v_f18a9c;
              v_9183ca.current = Date.now(); 

              const v_97e2bc = v_22ecab.find(v_5e3dbb => v_5e3dbb.latitude && v_5e3dbb.longitude);
              if (v_97e2bc && v_97e2bc.latitude && v_97e2bc.longitude) {
                if (!v_3ec640.current) return;
                console.log('📍 [MapMainScreen] 캐시 데이터 사용 시 첫 번째 마커 위치로 맵 이동:', v_97e2bc.latitude, v_97e2bc.longitude);

                v_ca338a.current = true;
                v_3ec640.current.animateToRegion({
                  latitude: v_97e2bc.latitude,
                  longitude: v_97e2bc.longitude,
                  latitudeDelta: 0.005,
                  longitudeDelta: 0.005,
                }, 500);

                v_de148f.current = {
                  latitude: v_97e2bc.latitude,
                  longitude: v_97e2bc.longitude,
                  latitudeDelta: 0.005,
                  longitudeDelta: 0.005,
                };

                setTimeout(() => {
                  v_ca338a.current = false;
                }, 600);

                if (v_e8ec67) {
                  setTimeout(() => {
                    console.log('📍 [MapMainScreen] 마커 위치 이동 후 현재 GPS 위치로 이동:', v_e8ec67.latitude, v_e8ec67.longitude);

                    if (!v_3ec640.current) return;
                    v_ca338a.current = true;

                    v_3ec640.current.animateToRegion({
                      latitude: v_e8ec67.latitude,
                      longitude: v_e8ec67.longitude,
                      latitudeDelta: 0.005,
                      longitudeDelta: 0.005,
                    }, 500);
                    v_de148f.current = {
                      latitude: v_e8ec67.latitude,
                      longitude: v_e8ec67.longitude,
                      latitudeDelta: 0.005,
                      longitudeDelta: 0.005,
                    };
                    setTimeout(() => {
                      v_ca338a.current = false;
                    }, 600);
                  }, 1000); 
                }
              } else if (!v_97e2bc && v_e8ec67 && v_3ec640.current) {

                console.log('📍 [MapMainScreen] 캐시 데이터에 마커 없음 - 현재 GPS 위치로 이동:', v_e8ec67.latitude, v_e8ec67.longitude);
                v_ca338a.current = true;
                v_3ec640.current.animateToRegion({
                  latitude: v_e8ec67.latitude,
                  longitude: v_e8ec67.longitude,
                  latitudeDelta: 0.005,
                  longitudeDelta: 0.005,
                }, 500);
                v_de148f.current = {
                  latitude: v_e8ec67.latitude,
                  longitude: v_e8ec67.longitude,
                  latitudeDelta: 0.005,
                  longitudeDelta: 0.005,
                };
                setTimeout(() => {
                  v_ca338a.current = false;
                }, 600);
              }

              v_5db874.current = false;

              v_e1bb1a(false);

              return;

            }

          } catch (v_5f9add) {

            console.error('[MapMainScreen] astorCoinsData 파싱 오류:', v_5f9add);

          }

        }

      }

      if (v_9d6a91) {
        console.log('🔄 [MapMainScreen] 서버에서 새 데이터 가져오기');
      } else {

      }

      v_5db874.current = true;

      v_e1bb1a(true);

      v_5db874.current = true;
      v_e1bb1a(true);
      console.log('=== 맵 마커 데이터 가져오기 시작 ===');
      console.log('위치:', v_f18a9c.latitude, v_f18a9c.longitude);

      const v_4eb397 = await Promise.race([
        v_f3de6d(),
        new Promise<never>((v_37eab7, v_bad6f3) => setTimeout(() => v_bad6f3(new Error('collectDeviceInfo timeout')), 2500)),
      ]).catch(() => v_a4e2ac());

      console.log('🚀 [loadMarkersForLocation] app2000-01 호출 시작 (마커 선표시)');
      let v_003147 = [];
      try {
        v_003147 = await v_f84ef5(
          v_f18a9c.latitude,
          v_f18a9c.longitude,
          v_660822,
          v_9b57fc,
          {
            adid: v_4eb397.adid,
            ip: v_4eb397.ipAddress,
            osver: v_4eb397.osVersion,
            devid: v_4eb397.deviceId,
            devmodel: v_4eb397.model,
            devbrand: v_4eb397.manufacturer,
            mnetwork: v_4eb397.mnetwork,
            carrier: v_4eb397.carrier
          }
        ) || [];
      } catch (v_a8e7ca) {
        console.warn('❌ [loadMarkersForLocation] app2000-01 실패:', v_a8e7ca);
      }
      console.log('✅ [loadMarkersForLocation] app2000-01 완료, 마커 개수:', v_003147.length);

      Promise.allSettled([
        v_91d5e4(v_660822, v_f18a9c.latitude, v_f18a9c.longitude, v_9b57fc).catch((v_9e86fd) => {
          console.warn('❌ [loadMarkersForLocation] virtualCoin 실패:', v_9e86fd);
          return { data: [] };
        }),
        v_965f93(v_9b57fc).catch((v_9e86fd) => {
          console.warn('❌ [loadMarkersForLocation] getCoinNasPrice 실패:', v_9e86fd);
          return { data: { coins: 0 } };
        }),
      ]).then(([v_f6123d, v_f85685]) => {
        const v_95b93a = v_f6123d.status === 'fulfilled' ? v_f6123d.value : { data: [] };
        const v_89c6de = v_f85685.status === 'fulfilled' ? v_f85685.value : { data: { coins: 0 } };
        const v_8f5869 = v_89c6de?.data?.coins || 0;
        const v_958ad1 = v_95b93a?.data && Array.isArray(v_95b93a.data)
          ? v_95b93a.data
            .slice(0, Math.random() < 0.5 ? 1 : 2)
            .map((v_8c0b26, v_a56041, v_09228c) => {
              if (v_09228c.length === 2 && v_a56041 === 1) {
                return {
                  ...v_8c0b26,
                  coin: 1,
                  lat: 0,
                  lng: 0,
                  title: v_8c0b26.title,
                  distance: (Math.random() * (10 - 0.1) + 0.1).toFixed(2),
                  advertisement: v_8c0b26.advertisement,
                  coins: v_8c0b26.coins,
                  iconurl: v_8c0b26.iconurl || 'https://www.xrun.run/assets/images/logo_visual_black.png',
                  joindesc: v_8c0b26.joindesc || '가상 코인 설명',
                  name: v_8c0b26.name || v_8c0b26.title || v_8c0b26.brand,
                  campid: v_8c0b26.campid || v_8c0b26.campId || '',
                  xrunPrice: v_8c0b26.xrunPrice || v_8c0b26.xrunprice || 0,
                };
              }
              return {
                ...v_8c0b26,
                currency: 18,
                lat: 0,
                lng: 0,
                title: v_8c0b26.title,
                distance: (Math.random() * (10 - 0.1) + 0.1).toFixed(2),
                coins: v_8f5869,
                advertisement: 672,
                iconurl: v_8c0b26.iconurl || 'https://www.xrun.run/assets/images/logo_visual_black.png',
                joindesc: v_8c0b26.joindesc || 'Virtual coin description',
                name: v_8c0b26.name || v_8c0b26.title || v_8c0b26.brand,
                campid: v_8c0b26.campid || v_8c0b26.campId || '',
                xrunPrice: v_8c0b26.xrunPrice || v_8c0b26.xrunprice || 0,
              };
            })
          : [];
        const v_2876a4 = [...v_958ad1, ...v_003147];
        const v_bf588a = [];
        v_2876a4.forEach((v_8c0b26) => {
          const v_23805a = v_8c0b26 as any;
          if (v_23805a.brandlogo_file) v_bf588a.push(v_23805a.brandlogo_file);
          if (v_23805a.adthumbnail2_file) v_bf588a.push(v_23805a.adthumbnail2_file);
          if (v_23805a.symbolimg_file) v_bf588a.push(v_23805a.symbolimg_file);
        });
        if (v_bf588a.length > 0) {
          const v_1a30c4 = v_e4a763();
          v_858bfa.downloadMultipleImages(v_bf588a, v_755eb9())
            .then(() => console.log('✅ 이미지 캐싱 완료 (백그라운드)'))
            .catch((v_67ab2b) => console.error('이미지 캐싱 오류:', v_67ab2b));
        }
        if (v_2876a4.length > 0) {
          const v_beddf3 = v_2876a4
            .map((v_51b584) => {
              const v_e1b1cf = v_51b584.latitude || v_51b584.lat;
              const v_c87b30 = v_51b584.longitude || v_51b584.lng;
              if (v_e1b1cf && v_c87b30) {
                return { ...v_51b584, distance: v_b464ed(v_f18a9c.latitude, v_f18a9c.longitude, v_e1b1cf, v_c87b30) };
              }
              return { ...v_51b584, distance: v_51b584.distance || Infinity };
            })
            .sort((v_779914, v_148ff6) => (v_779914.distance || Infinity) - (v_148ff6.distance || Infinity));
          v_e84827.setItem('astorCoinsData', JSON.stringify(v_beddf3))
            .then(() => console.log('✅ astorCoinsData AsyncStorage 저장 완료 (virtualCoin 반영):', v_beddf3.length))
            .catch((v_df17d5) => console.error('AsyncStorage 저장 오류:', v_df17d5));
        } else if (v_958ad1.length > 0) {
          const v_5ef6fa = v_958ad1
            .map((v_51b584) => {
              const v_e1b1cf = v_51b584.latitude || v_51b584.lat;
              const v_c87b30 = v_51b584.longitude || v_51b584.lng;
              if (v_e1b1cf && v_c87b30) {
                return { ...v_51b584, distance: v_b464ed(v_f18a9c.latitude, v_f18a9c.longitude, v_e1b1cf, v_c87b30) };
              }
              return { ...v_51b584, distance: v_51b584.distance || Infinity };
            })
            .sort((v_779914, v_148ff6) => (v_779914.distance || Infinity) - (v_148ff6.distance || Infinity));
          v_e84827.setItem('astorCoinsData', JSON.stringify(v_5ef6fa))
            .then(() => console.log('✅ astorCoinsData AsyncStorage 저장 (coinsDataVt):', v_5ef6fa.length))
            .catch((v_df17d5) => console.error('AsyncStorage 저장 오류:', v_df17d5));
        }
      });

      const v_1e6d95 = v_003147.reduce((v_9f1d92, v_275ccd) => {

        const v_c84c22 = v_275ccd.coin || `${v_275ccd.latitude}-${v_275ccd.longitude}`;
        const v_0bf6f9 = v_9f1d92.findIndex((v_35f85c) => {
          const v_e1ef47 = v_35f85c.coin || `${v_35f85c.latitude}-${v_35f85c.longitude}`;
          return v_e1ef47 === v_c84c22;
        });

        if (v_0bf6f9 === -1) {

          v_9f1d92.push(v_275ccd);
        } else {

          const v_3979c6 = v_275ccd.coin ? 'coin ID' : '좌표';
          console.warn(`⚠️ 중복 마커 발견: ${v_3979c6}=${v_c84c22}, 기존 마커 유지`);
        }
        return v_9f1d92;
      }, []);

      console.log('📊 [MapMainScreen] 서버 원본 마커 데이터 사용:', {
        원본개수: v_003147.length,
        중복제거후개수: v_1e6d95.length,
        제거된개수: v_003147.length - v_1e6d95.length,
      });

      const v_a8712d = [];
      v_1e6d95.forEach((v_8c0b26) => {
        const v_23805a = v_8c0b26 as any;
        if (v_23805a.brandlogo_file) v_a8712d.push(v_23805a.brandlogo_file);
        if (v_23805a.adthumbnail2_file) v_a8712d.push(v_23805a.adthumbnail2_file);
        if (v_23805a.symbolimg_file) v_a8712d.push(v_23805a.symbolimg_file);
      });
      if (v_a8712d.length > 0) {
        const v_1a30c4 = v_e4a763();
        v_858bfa.downloadMultipleImages(v_a8712d, v_755eb9())
          .then(() => console.log('✅ 마커 이미지 캐싱 완료 (백그라운드)'))
          .catch((v_67ab2b) => console.error('이미지 캐싱 오류:', v_67ab2b));
      }

      v_1e6d95.slice(0, 5).forEach((v_5e3dbb, v_e86ad8) => {

      });

      console.log('📌 [MapMainScreen] setMarkers 호출 (서버 데이터):', v_1e6d95.length, '개');
      v_14dd24(v_1e6d95);
      v_c84980(v_f18a9c);
      v_a2b40c.current = v_f18a9c;
      v_9183ca.current = Date.now(); 

      if (v_1e6d95.length === 0 && v_32428f < 1) {
        console.log(`⚠️ [MapMainScreen] 마커가 0개입니다. 2초 후 재시도합니다. (시도 ${v_32428f + 1}/1)`);
        setTimeout(() => {
          v_524200(v_f18a9c, true, v_e8ec67, v_32428f + 1);
        }, 2000);
      }

      const v_97e2bc = v_1e6d95.find(v_5e3dbb => v_5e3dbb.latitude && v_5e3dbb.longitude);
      if (v_97e2bc && v_97e2bc.latitude && v_97e2bc.longitude) {
        if (!v_3ec640.current) return;

        v_ca338a.current = true;
        v_3ec640.current.animateToRegion({
          latitude: v_97e2bc.latitude,
          longitude: v_97e2bc.longitude,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        }, 500);

        v_de148f.current = {
          latitude: v_97e2bc.latitude,
          longitude: v_97e2bc.longitude,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        };

        setTimeout(() => {
          v_ca338a.current = false;
        }, 600);

        if (v_e8ec67) {
          setTimeout(() => {
            console.log('📍 [MapMainScreen] 마커 위치 이동 후 현재 GPS 위치로 이동:', v_e8ec67.latitude, v_e8ec67.longitude);

            if (!v_3ec640.current) return;
            v_ca338a.current = true;
            v_3ec640.current.animateToRegion({
              latitude: v_e8ec67.latitude,
              longitude: v_e8ec67.longitude,
              latitudeDelta: 0.005,
              longitudeDelta: 0.005,
            }, 500);
            v_de148f.current = {
              latitude: v_e8ec67.latitude,
              longitude: v_e8ec67.longitude,
              latitudeDelta: 0.005,
              longitudeDelta: 0.005,
            };
            setTimeout(() => {
              v_ca338a.current = false;
            }, 600);
          }, 1000); 
        }
      } else if (!v_97e2bc && v_e8ec67 && v_3ec640.current) {

        v_ca338a.current = true;
        v_3ec640.current.animateToRegion({
          latitude: v_e8ec67.latitude,
          longitude: v_e8ec67.longitude,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        }, 500);
        v_de148f.current = {
          latitude: v_e8ec67.latitude,
          longitude: v_e8ec67.longitude,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        };
        setTimeout(() => {
          v_ca338a.current = false;
        }, 600);
      }

    } catch (v_5e9bfe) {
      console.error('❌ [loadMarkersForLocation] 에러 발생:', v_5e9bfe);
      const v_1744b9 = v_5e9bfe instanceof Error ? v_5e9bfe.message : String(v_5e9bfe);
      console.error('❌ [loadMarkersForLocation] 에러 상세:', v_1744b9);

      console.warn('[loadMarkersForLocation] 에러 발생, 기존 마커 유지');
    } finally {

      v_5db874.current = false;
      v_e1bb1a(false);
      v_9cd9d5(false); 

      v_ceef35.current = false;
    }
  }, [v_9b57fc]);

  const v_668889 = v_de06a3(async () => {

    if (v_5db874.current) {

      return;

    }

    const v_0ff02b = v_c19838;

    if (!v_0ff02b) {

      console.log('초기 위치가 없습니다.');

      return;

    }

    console.log('=== 20초 동안 드래그 없음, 초기 위치로 복귀 ===');

    const v_dfcc93 = v_de148f.current;

    v_ca338a.current = true;

    console.log('📍 [프로그램 이동] 초기 위치로 복귀 시작');

    console.log('  현재 위치:', v_dfcc93.latitude.toFixed(6), v_dfcc93.longitude.toFixed(6));

    console.log('  목표 위치:', v_0ff02b.latitude.toFixed(6), v_0ff02b.longitude.toFixed(6));

    if (v_3ec640.current) {

      v_3ec640.current.animateToRegion({

        latitude: v_0ff02b.latitude,

        longitude: v_0ff02b.longitude,

        latitudeDelta: v_dfcc93.latitudeDelta,

        longitudeDelta: v_dfcc93.longitudeDelta,

      }, 500);

      setTimeout(() => {

        v_ca338a.current = false;

        console.log('📍 [프로그램 이동] 플래그 리셋 완료');

      }, 600);

    }

    const v_6ffbdc = {

      latitude: v_0ff02b.latitude,

      longitude: v_0ff02b.longitude,

      latitudeDelta: v_dfcc93.latitudeDelta,

      longitudeDelta: v_dfcc93.longitudeDelta,

    };

    v_de148f.current = v_6ffbdc;

    await v_524200(v_0ff02b);

  }, [v_c19838, v_524200]);

  const v_30b908 = v_de06a3(() => {
    if (!v_a55f0b) {
      console.log('📍 현재 위치가 없습니다.');
      return;
    }

    if (!v_3ec640.current) {
      console.log('📍 맵 ref가 없습니다.');
      return;
    }

    console.log('📍 현재 위치로 이동:', v_a55f0b.latitude, v_a55f0b.longitude);

    v_ca338a.current = true;
    v_3ec640.current.animateToRegion({
      latitude: v_a55f0b.latitude,
      longitude: v_a55f0b.longitude,
      latitudeDelta: 0.005,
      longitudeDelta: 0.005,
    }, 500);

    v_de148f.current = {
      latitude: v_a55f0b.latitude,
      longitude: v_a55f0b.longitude,
      latitudeDelta: 0.005,
      longitudeDelta: 0.005,
    };

    setTimeout(() => {
      v_ca338a.current = false;
      console.log('📍 현재 위치 이동 완료');
    }, 600);
  }, [v_a55f0b]);

  const v_0db6cf = v_de06a3(async () => {
    try {
      console.log('📍 [GPS 위치 가져오기] 최신 GPS 위치 요청');
      const v_e8ec67 = await v_8a44cb.getCurrentPositionAsync({
        accuracy: v_8a44cb.Accuracy.High,
      });

      const v_20867b = {
        latitude: v_e8ec67.coords.latitude,
        longitude: v_e8ec67.coords.longitude,
      };

      console.log('📍 [GPS 위치 가져오기] GPS 위치:', v_20867b);

      if (!v_3ec640.current) {
        console.log('📍 맵 ref가 없습니다.');
        return;
      }

      v_ca338a.current = true;

      v_3ec640.current.animateToRegion({
        latitude: v_20867b.latitude,
        longitude: v_20867b.longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      }, 500);

      v_de148f.current = {
        latitude: v_20867b.latitude,
        longitude: v_20867b.longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      };

      v_0326b2(v_20867b);

      await v_e84827.setItem(v_f3d3c8, JSON.stringify(v_20867b));

      setTimeout(() => {
        v_ca338a.current = false;
        console.log('📍 GPS 위치로 이동 완료');
      }, 600);
    } catch (v_5e9bfe) {
      console.error('📍 [GPS 위치 가져오기] 실패:', v_5e9bfe);

      if (v_a55f0b) {
        v_30b908();
      }
    }
  }, [v_a55f0b, v_30b908]);

  const v_64543d = v_de06a3(async () => {

    v_1b0a7f.current = true;
    console.log('📍 [handleMapReady] 지도 로드 완료 - 최초 위치 이동 시작');

    if (!v_3ec640.current) {
      console.error('❌ [handleMapReady] mapRef가 없습니다.');
      return;
    }

    let v_f18a9c = null;
    let v_439b17 = '';

    try {

      try {
        const v_05f29b = await v_e84827.getItem(v_f3d3c8);
        if (v_05f29b) {
          const v_3a14d6 = JSON.parse(v_05f29b);
          if (v_3a14d6.latitude && v_3a14d6.longitude) {
            v_f18a9c = v_3a14d6;
            v_439b17 = 'AsyncStorage 마지막 위치';
            console.log('✅ [handleMapReady] AsyncStorage에서 마지막 위치 발견:', v_3a14d6);
          }
        }
      } catch (v_df17d5) {
        console.error('❌ [handleMapReady] AsyncStorage 읽기 실패:', v_df17d5);
      }

      if (!v_f18a9c) {
        try {

          const { status: v_d308b5 } = await v_8a44cb.getForegroundPermissionsAsync();
          if (v_d308b5 === 'granted') {
            const v_e8ec67 = await v_8a44cb.getCurrentPositionAsync({
              accuracy: v_8a44cb.Accuracy.High,
            });
            v_f18a9c = {
              latitude: v_e8ec67.coords.latitude,
              longitude: v_e8ec67.coords.longitude,
            };
            v_439b17 = '현재 GPS 위치';
            console.log('✅ [handleMapReady] 현재 GPS 위치 가져오기 성공:', v_f18a9c);

            await v_e84827.setItem(v_f3d3c8, JSON.stringify(v_f18a9c));
          } else {
            console.log('⚠️ [handleMapReady] 위치 권한 없음 - 다음 우선순위로');
          }
        } catch (v_3acd44) {
          console.error('❌ [handleMapReady] GPS 위치 가져오기 실패:', v_3acd44);
        }
      }

      if (!v_f18a9c) {
        try {
          const v_99c46d = await v_e84827.getItem('astorCoinsData');
          if (v_99c46d) {
            const v_b9ce93 = JSON.parse(v_99c46d);
            if (Array.isArray(v_b9ce93) && v_b9ce93.length > 0) {

              const v_97e2bc = v_b9ce93.find((v_51b584) =>
                (v_51b584.latitude || v_51b584.lat) && (v_51b584.longitude || v_51b584.lng)
              );

              if (v_97e2bc) {
                v_f18a9c = {
                  latitude: v_97e2bc.latitude || v_97e2bc.lat,
                  longitude: v_97e2bc.longitude || v_97e2bc.lng,
                };
                v_439b17 = '저장된 마커 중 첫 번째 마커';
                console.log('✅ [handleMapReady] 저장된 마커에서 첫 번째 마커 위치 발견:', v_f18a9c);
              }
            }
          }
        } catch (v_a8e7ca) {
          console.error('❌ [handleMapReady] 저장된 마커 읽기 실패:', v_a8e7ca);
        }
      }

      if (!v_f18a9c) {
        v_f18a9c = {
          latitude: 37.5665,
          longitude: 126.9780,
        };
        v_439b17 = '기본 위치(서울)';
        console.log('✅ [handleMapReady] 기본 위치(서울) 사용:', v_f18a9c);
      }

      if (v_f18a9c) {
        console.log(`📍 [handleMapReady] ${v_439b17}로 이동:`, v_f18a9c);

        v_ca338a.current = true;

        const v_8dcb51 = v_3ec640.current;
        if (!v_8dcb51 || typeof v_8dcb51.animateToRegion !== 'function') {
          console.warn('⚠️ [handleMapReady] animateToRegion 호출 불가: mapRef가 null이거나 메서드가 없습니다.');
          v_ca338a.current = false;
          return;
        }

        v_8dcb51.animateToRegion({
          latitude: v_f18a9c.latitude,
          longitude: v_f18a9c.longitude,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        }, 500);

        v_de148f.current = {
          latitude: v_f18a9c.latitude,
          longitude: v_f18a9c.longitude,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        };

        v_0326b2(v_f18a9c);

        if (!v_c38114.current) {
          v_b6ebe9(v_f18a9c);
          v_c84980(v_f18a9c);
          v_c38114.current = v_f18a9c;
          v_a2b40c.current = v_f18a9c;
          v_c675cc.current = {
            latitude: v_f18a9c.latitude,
            longitude: v_f18a9c.longitude,
          };
        }

        console.log('🔄 [handleMapReady] 마커 로드 시작');
        v_9183ca.current = Date.now();
        await v_524200(v_f18a9c, false);
        console.log('✅ [handleMapReady] 마커 로드 완료');

        v_9bf134.current = true;

        setTimeout(() => {
          v_ca338a.current = false;
          console.log('✅ [handleMapReady] 지도 이동 완료');
        }, 600);
      } else {
        console.error('❌ [handleMapReady] 이동할 위치를 찾을 수 없습니다.');
      }
    } catch (v_5e9bfe) {
      console.error('❌ [handleMapReady] 오류 발생:', v_5e9bfe);

      const v_3a1065 = {
        latitude: 37.5665,
        longitude: 126.9780,
      };

      if (v_3ec640.current) {
        v_ca338a.current = true;
        if (typeof v_3ec640.current.animateToRegion !== 'function') {
          console.warn('⚠️ [handleMapReady] fallback animateToRegion 호출 불가');
          v_ca338a.current = false;
          return;
        }
        v_3ec640.current.animateToRegion({
          latitude: v_3a1065.latitude,
          longitude: v_3a1065.longitude,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        }, 500);

        v_de148f.current = {
          latitude: v_3a1065.latitude,
          longitude: v_3a1065.longitude,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        };

        v_0326b2(v_3a1065);

        if (!v_c38114.current) {
          v_b6ebe9(v_3a1065);
          v_c84980(v_3a1065);
          v_c38114.current = v_3a1065;
          v_a2b40c.current = v_3a1065;
        }

        await v_524200(v_3a1065, false);

        setTimeout(() => {
          v_ca338a.current = false;
        }, 600);
      }
    }
  }, [v_524200]);

  const v_acecf6 = v_de06a3(async () => {

    if (v_5db874.current) {

      return;

    }

    const v_0ff02b = v_c38114.current;

    const v_5a477d = v_a2b40c.current;

    if (!v_0ff02b || !v_5a477d) {

      return;

    }

    const v_340e3c = v_de148f.current;

    const v_7dd198 = {

      latitude: v_340e3c.latitude,

      longitude: v_340e3c.longitude,

    };

    const v_926d1c = v_b464ed(

      v_7dd198.latitude,

      v_7dd198.longitude,

      v_5a477d.latitude,

      v_5a477d.longitude

    );

    const v_dcebe9 = Date.now();

    const v_f69ae0 =

      Math.abs(v_7dd198.latitude - v_5a477d.latitude) > 0.0001 ||

      Math.abs(v_7dd198.longitude - v_5a477d.longitude) > 0.0001;

    if (v_f69ae0) {

      v_a11b30.current = v_dcebe9;

    }

    if (
      v_9bf134.current &&
      !v_772369.current &&
      v_ca338a.current &&
      v_f69ae0
    ) {
      console.log('=== [초기 로드 후 첫 GPS 위치 이동] 거리 상관없이 마커 로드 ===');
      console.log('  현재 위치:', v_7dd198.latitude.toFixed(6), v_7dd198.longitude.toFixed(6));
      console.log('  마지막 마커 로드 위치:', v_5a477d.latitude.toFixed(6), v_5a477d.longitude.toFixed(6));
      console.log('  거리:', v_926d1c.toFixed(2), 'm');

      await v_524200(v_7dd198, true);

      v_772369.current = true;
      console.log('✅ [초기 로드 후 첫 GPS 위치 이동] 마커 로드 완료');
      return; 
    }

    if (v_926d1c >= 500) {

      console.log('=== 200m 이상 이동, 새로운 위치에서 마커 로드 ===');

      await v_524200(v_7dd198, true);

    }

    const v_6264da = v_dcebe9 - v_a11b30.current;

    if (v_6264da >= 20000) {

      const v_065b71 = v_b464ed(

        v_7dd198.latitude,

        v_7dd198.longitude,

        v_0ff02b.latitude,

        v_0ff02b.longitude

      );

      if (v_065b71 > 50) { 

        console.log('=== 20초 동안 위치 변경 없음, 초기 위치로 복귀 ===');

        await v_668889();

        v_a11b30.current = Date.now(); 

      }

    }

  }, [v_524200, v_668889]);

  v_c4deb2(() => {

    const v_f2c805 = async () => {

      try {

        console.log('[MapMainScreen] Taboola HTML 프리로드 시작');

        await v_295e39();

        console.log('[MapMainScreen] Taboola HTML 프리로드 완료');

        console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');

      } catch (v_5e9bfe) {

        console.error('[MapMainScreen] Taboola HTML 프리로드 실패:', v_5e9bfe);

      }

    };

    v_f2c805();
  }, []); 

  const v_6dea10 = v_de06a3(async (v_9d6a91 = false) => {

    if (v_fd5fd4.current) {
      console.log('[MapMainScreen] refreshTopAd5AndMapMarkers 이미 실행 중입니다. 중복 호출 무시');
      return;
    }

    v_fd5fd4.current = true;
    const v_b6483b = '[!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!부팅 느림]';
    const v_46e760 = Date.now();
    console.log(v_b6483b, '[MapMainScreen] refreshTopAd5AndMapMarkers 시작 (마커+TopAd5 로드)');
    try {

      let v_905ecb = new Set<string>();
      try {
        const v_ef7306 = await v_e84827.getItem('userData');
        if (v_ef7306) {
          const v_ff39bc = JSON.parse(v_ef7306);
          const v_660822 = v_ff39bc?.member;
          if (v_660822) {
            v_905ecb = await v_318c45(v_660822, v_9b57fc);
            console.log(`[MapMainScreen] 완료된 광고 목록: ${v_905ecb.size}개`);
          }
        }
      } catch (v_5e9bfe) {
        console.warn('[MapMainScreen] 완료된 광고 목록 조회 실패 (무시):', v_5e9bfe);
      }

      const v_99c46d = await v_e84827.getItem('astorCoinsData');
      if (v_99c46d) {
        const v_b9ce93 = JSON.parse(v_99c46d);
        if (Array.isArray(v_b9ce93) && v_b9ce93.length > 0) {

          const spotDataArray: v_f71847[] = v_b9ce93
            .filter((v_51b584) => {

              const v_e1b1cf = v_51b584.latitude || v_51b584.lat;
              const v_c87b30 = v_51b584.longitude || v_51b584.lng;
              return v_e1b1cf != null && v_c87b30 != null && v_e1b1cf !== 0 && v_c87b30 !== 0;
            })
            .map((v_51b584) => ({
              spotID: v_51b584.spotid || v_51b584.spotID || v_51b584.id || 0,
              distance: v_51b584.distance || 0,
              direction: v_51b584.direction || 0,
              name: v_51b584.name || v_51b584.title || v_51b584.brand || 'XRUN coin',
              latitude: v_51b584.latitude || v_51b584.lat,
              longitude: v_51b584.longitude || v_51b584.lng,
              xrunPrice: v_51b584.xrunprice || v_51b584.xrunPrice || v_51b584.price || 0,
              iconurl: v_51b584.iconurl || '',
              joindesc: v_51b584.joindesc || '',
              brand: v_51b584.brand || v_51b584.coin || '',
              coins: v_51b584.coins || v_51b584.coin || '',
              coin: v_51b584.coin || '',
              campid: v_51b584.campid || v_51b584.campId || '',
              ad_company: v_51b584.ad_company || '',
              urlAD: v_51b584.urlAD || '',
            } as v_f71847));

          if (v_22ecab.length > 0) {
            v_14dd24(v_22ecab);
            console.log('[MapMainScreen] 캐시된 마커 먼저 표시:', v_22ecab.length, '개 (본 광고 제외)');
          }
        }
      }

      const v_92ed2d = await v_5d7ca4();
      if (v_92ed2d && Array.isArray(v_92ed2d) && v_92ed2d.length > 0) {
        v_6549d0(v_92ed2d);
        v_0302dd.current = v_92ed2d;
        console.log('[MapMainScreen] 캐시된 TopAd5 먼저 표시:', v_92ed2d.length, '개 (API 응답 대기)');
      }

      const v_0322be = Date.now();
      console.log(v_b6483b, '[MapMainScreen] 1단계: TopAd5 API 호출 시작');
      let v_e36b07 = null;

      v_e36b07 = await v_563153(undefined, v_9d6a91);
      console.log(v_b6483b, '[MapMainScreen] 1단계: TopAd5 API 호출 완료', `${Date.now() - v_0322be}ms`);

      if (!v_e36b07 || !Array.isArray(v_e36b07) || v_e36b07.length === 0) {
        console.warn('[MapMainScreen] TopAd5 API 데이터가 없습니다. 캐시 유지.');
        return;
      }

      const v_6c877c = v_e36b07;

      if (v_6c877c.length === 0) {
        console.warn('[MapMainScreen] TopAd5 데이터가 없습니다.');
        return;
      }

      if (v_e36b07.length === 0) {
        console.warn('[MapMainScreen] 유효한 TopAd5 데이터가 없습니다 (모두 URL 검증 실패 또는 이미 본 광고)');
        return;
      }

      console.log('[MapMainScreen] 3단계: TopAd5 데이터 상태 저장:', v_e36b07.length, '개 광고');
      v_6549d0(v_e36b07);
      v_0302dd.current = v_e36b07; 

      if (!v_99c46d) {
        console.log('[MapMainScreen] 마커 데이터 없음 - 매핑 건너뛰기');
        return;
      }

      const v_b9ce93 = JSON.parse(v_99c46d);
      if (!Array.isArray(v_b9ce93) || v_b9ce93.length === 0) {
        console.log('[MapMainScreen] 마커 데이터가 배열이 아니거나 비어있음 - 매핑 건너뛰기');
        return;
      }

      console.log('[MapMainScreen] 4단계: TopAd5 매핑 최적화 시작');
      const v_c0d590 = v_e36b07.map((v_ddcfed) => v_ddcfed.campid).filter((v_389afb) => v_389afb != null && v_389afb !== '');
      const v_c05ac2 = v_0302dd.current.map((v_ddcfed) => v_ddcfed.campid).filter((v_389afb) => v_389afb != null && v_389afb !== '');

      const v_3f87ed = new Set(v_c0d590);
      const v_276c8d = new Set(v_c05ac2);
      const v_6c933c =
        v_c0d590.length !== v_c05ac2.length ||
        v_c0d590.some((v_389afb) => !v_276c8d.has(v_389afb)) ||
        v_c05ac2.some((v_389afb) => !v_3f87ed.has(v_389afb));

      let v_5fd150 = v_b9ce93;

      if (!v_6c933c && v_c05ac2.length > 0) {
        console.log('[MapMainScreen] TopAd5 데이터 변경 없음, 매핑 생략');

        v_5fd150 = v_b9ce93;
      } else {
        console.log('[MapMainScreen] TopAd5 데이터 변경됨, 매핑 시작');

        const v_d94215 = v_e36b07.filter((v_ddcfed) => {
          const v_aa0917 = String(v_ddcfed.campid || '');
          const v_4b4d55 = v_79311c.current.has(v_aa0917);
          if (v_4b4d55) {
            console.log(`⚠️ [MapMainScreen] ${v_aa0917}는 pre-fetch 실패로 매핑에서 제외`);
          }
          return !v_4b4d55;
        });

        if (v_d94215.length === 0) {
          console.warn('[MapMainScreen] 유효한 TopAd5 데이터가 없습니다 (모두 pre-fetch 실패)');

          v_5fd150 = v_b9ce93;
        } else {
          console.log(`[MapMainScreen] 유효한 TopAd5 데이터: ${v_d94215.length}/${v_e36b07.length}개 (${v_e36b07.length - v_d94215.length}개 제외)`);

          console.log('[MapMainScreen] 5단계: 마커-광고 매핑 시작 (전체 마커에 대해 순차 매핑)');

          const v_8ceeaa = v_b9ce93.map((v_5e3dbb, v_a56041) => {

            if (v_d94215.length > 0) {
              const v_ba7922 = v_a56041 % v_d94215.length;
              const v_127b33 = v_d94215[v_ba7922];

              return {
                ...v_5e3dbb,

                name: v_127b33?.name || v_5e3dbb.name,
                iconurl: v_127b33?.iconurl || v_5e3dbb.iconurl,
                joindesc: v_127b33?.joindesc || v_5e3dbb.joindesc,
                xrunPrice: v_127b33?.xrunPrice || v_5e3dbb.xrunPrice || v_5e3dbb.xrunprice || 0,
                campid: v_127b33?.campid || v_5e3dbb.campid || v_5e3dbb.campId || '',

                thumbnail: v_127b33?.thumbnail || v_5e3dbb.thumbnail,
                ad_company: v_127b33?.ad_company || v_5e3dbb.ad_company,
                coins: v_127b33?.coins?.toString() || v_5e3dbb.coins,
                brandlogo: v_127b33?.brandlogo || v_5e3dbb.brandlogo,
                adthumbnail2: v_127b33?.adthumbnail2 || v_5e3dbb.adthumbnail2,
                symbolimg: v_127b33?.symbolimg || v_5e3dbb.symbolimg,
              };
            }

            return v_5e3dbb;
          });

          console.log('[MapMainScreen] 6단계: 매핑된 마커 데이터 저장 시작');
          await v_e84827.setItem('astorCoinsData', JSON.stringify(v_8ceeaa));
          v_5fd150 = v_8ceeaa;
        }
      }

      console.log('[MapMainScreen] 7단계: 화면에 마커 표시 시작');
      console.log('[MapMainScreen] finalCoinsData 개수:', v_5fd150.length);

      if (v_5fd150.length === 0) {
        console.warn('[MapMainScreen] finalCoinsData가 비어있음, 기존 마커 유지');
        return; 
      }

      const spotDataArray: v_f71847[] = v_5fd150
        .filter((v_51b584) => {

          const v_e1b1cf = v_51b584.latitude || v_51b584.lat;
          const v_c87b30 = v_51b584.longitude || v_51b584.lng;
          return v_e1b1cf != null && v_c87b30 != null && v_e1b1cf !== 0 && v_c87b30 !== 0;
        })
        .map((v_51b584) => ({
          spotID: v_51b584.spotid || v_51b584.spotID || v_51b584.id || 0,
          distance: v_51b584.distance || 0,
          direction: v_51b584.direction || 0,
          name: v_51b584.name || v_51b584.title || v_51b584.brand || 'XRUN coin',
          latitude: v_51b584.latitude || v_51b584.lat,
          longitude: v_51b584.longitude || v_51b584.lng,
          xrunPrice: v_51b584.xrunprice || v_51b584.xrunPrice || v_51b584.price || 0,
          iconurl: v_51b584.iconurl || '',
          joindesc: v_51b584.joindesc || '',
          brand: v_51b584.brand || v_51b584.coin || '',
          coins: v_51b584.coins || v_51b584.coin || '',
          coin: v_51b584.coin || '',
          campid: v_51b584.campid || v_51b584.campId || '',
          ad_company: v_51b584.ad_company || '',
          urlAD: v_51b584.urlAD || '',
        } as v_f71847));

      console.log('[MapMainScreen] spotDataArray 개수:', v_22ecab.length);

      if (v_22ecab.length === 0) {
        console.warn('[MapMainScreen] spotDataArray가 비어있음, 기존 마커 유지');
        return; 
      }

      v_14dd24(v_22ecab);
      console.log('[MapMainScreen] 화면에 마커 표시 완료:', v_22ecab.length, '개 마커');

      console.log('[MapMainScreen] TopAd5 데이터 새로고침 및 마커 매핑 완료');

      const v_325f7b = new Set(v_e36b07.map((v_ddcfed) => String(v_ddcfed.campid || '')));
      const v_730f6c = Array.from(v_79311c.current).filter(v_aa0917 => v_325f7b.has(v_aa0917));
      v_79311c.current = new Set(v_730f6c);
      try {
        await v_e84827.setItem('failedPreFetchCampids', JSON.stringify(v_730f6c));
      } catch (v_5e9bfe) {
        console.error('[MapMainScreen] 실패 정보 업데이트 실패:', v_5e9bfe);
      }
      v_89e09e(v_e36b07);
    } catch (v_5e9bfe) {
      console.error('[MapMainScreen] TopAd5 데이터 새로고침 실패:', v_5e9bfe);

      try {
        const v_fe7102 = await v_5d7ca4();
        if (v_fe7102 && Array.isArray(v_fe7102) && v_fe7102.length > 0) {
          v_6549d0(v_fe7102);
          v_0302dd.current = v_fe7102; 
          console.log('[MapMainScreen] Fall over: 기존 TopAd5 데이터 사용:', v_fe7102.length, '개 광고');
        }
      } catch (v_741f30) {
        console.error('[MapMainScreen] Fall over 실패:', v_741f30);
      }
    } finally {

      v_fd5fd4.current = false;
    }
  }, [v_ac1d22, v_a55f0b, v_9b57fc, v_89e09e]); 

  v_c4deb2(() => {

    if (v_ac1d22 !== 'Map') {
      return;
    }

    if (v_fd5fd4.current) {
      return;
    }
    v_6dea10();
  }, [v_ac1d22]); 

  v_c4deb2(() => {

    if (v_ac1d22 !== 'Map') {

      v_ceef35.current = false;
      return;
    }

    const v_f10a0a = async () => {
      try {

        let v_7dd198 = null;

        if (!v_a55f0b) {

          console.log('📍 [MapMainScreen] 위치 정보 없음 - 위치 정보 대기 중...');
          v_9cd9d5(true);

          try {
            const v_4da25a = await v_8a44cb.getCurrentPositionAsync({
              accuracy: v_8a44cb.Accuracy.High,
            });
            v_7dd198 = {
              latitude: v_4da25a.coords.latitude,
              longitude: v_4da25a.coords.longitude,
            };
            v_0326b2(v_7dd198);
            console.log('📍 [MapMainScreen] 위치 정보 수신:', v_7dd198);

            v_ceef35.current = false;
          } catch (v_cd6da1) {
            console.warn('⚠️ [MapMainScreen] 위치 정보 가져오기 실패:', v_cd6da1);
            v_9cd9d5(false);
            return;
          }
        } else {
          v_7dd198 = v_a55f0b;
        }

        if (v_ceef35.current && v_7dd198) {
          return;
        }

        v_ceef35.current = true;

        const v_2be6ee = v_b4d4c5;
        if (v_2be6ee.length === 0) {

          console.log('📍 [MapMainScreen] 마커 없음 - 현재 위치 기준으로 마커 로드 시작');
          v_9cd9d5(true);

          if (v_7dd198) {
            await v_524200(v_7dd198, true);
          }
          return;
        }

        const v_97e2bc = v_2be6ee.find(v_5e3dbb => v_5e3dbb.latitude && v_5e3dbb.longitude);
        if (v_97e2bc && v_97e2bc.latitude && v_97e2bc.longitude && v_7dd198) {
          const v_926d1c = v_b464ed(
            v_7dd198.latitude,
            v_7dd198.longitude,
            v_97e2bc.latitude,
            v_97e2bc.longitude
          );

          if (v_926d1c >= 500) {

            console.log(`📍 [MapMainScreen] 첫번째 마커와 현재 위치 거리: ${v_926d1c.toFixed(2)}m (500m 이상) - 마커 재로드 시작`);
            v_9cd9d5(true);
            await v_524200(v_7dd198, true);
            return;
          }
        }

        v_9cd9d5(false);
      } catch (v_5e9bfe) {
        console.error('❌ [MapMainScreen] 마커 체크 중 오류:', v_5e9bfe);
        v_9cd9d5(false);
        v_ceef35.current = false; 
      }
    };

    v_f10a0a();
  }, [v_ac1d22, v_a55f0b, v_524200]); 

  v_c4deb2(() => {
    if (!v_a55f0b) return;
    const v_5c2f9f = Date.now();
    const v_7dea31 = v_092ed4.current;
    const v_7ed9ed = v_252c50.current;

    if (!v_7dea31) {
      console.log('[MapMainScreen] 매핑 위치 초기 설정');
      v_c90e3b(v_a55f0b);
      v_092ed4.current = v_a55f0b;
      v_252c50.current = v_5c2f9f;
      return;
    }

    const v_2ad33a = v_5c2f9f - v_7ed9ed;
    if (v_2ad33a < v_14dc1f) {

      return;
    }

    const v_926d1c = v_b464ed(
      v_7dea31.latitude,
      v_7dea31.longitude,
      v_a55f0b.latitude,
      v_a55f0b.longitude
    );
    if (v_926d1c >= v_2651fc) {
      console.log(`[MapMainScreen] 매핑 위치 업데이트: ${v_926d1c.toFixed(0)}m 이동, ${(v_2ad33a / 1000).toFixed(1)}초 경과`);
      v_c90e3b(v_a55f0b);
      v_092ed4.current = v_a55f0b;
      v_252c50.current = v_5c2f9f;
    }
  }, [v_a55f0b]);

  v_c4deb2(() => {

    let v_fd434d = null;

    const v_169317 = async () => {

      const { status: v_d308b5 } = await v_8a44cb.requestForegroundPermissionsAsync();

      if (v_d308b5 === 'granted') {
        v_3e450c.current = true;
      }

      if (v_d308b5 !== 'granted') {

        v_a7e4fc(v_8d41d7('common.messages.locationPermissionMessage'));
        await v_889fad(
          v_8d41d7('common.messages.locationPermissionRequired'),
          v_8d41d7('common.messages.locationPermissionMessage'),
          [{ text: v_8d41d7('common.buttons.confirm') }]
        );

        console.log('📍 위치 권한 거부 - 기본 위치(서울)로 마커 로드');
        const v_3a1065 = {
          latitude: 37.5665,
          longitude: 126.9780,
        };
        v_0326b2(v_3a1065);

        const v_6ffbdc = {
          latitude: v_3a1065.latitude,
          longitude: v_3a1065.longitude,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        };
        v_de148f.current = v_6ffbdc;

        if (!v_c38114.current) {
          v_b6ebe9(v_3a1065);
          v_c84980(v_3a1065);
          v_c38114.current = v_3a1065;
          v_a2b40c.current = v_3a1065;
          v_c675cc.current = {
            latitude: v_3a1065.latitude,
            longitude: v_3a1065.longitude,
          };
        }

        console.log('📍 [MapMainScreen] 권한 거부 - 기본 위치로 마커 로드 시작');
        v_9183ca.current = Date.now();
        await v_524200(v_3a1065);
        console.log('✅ [MapMainScreen] 권한 거부 - 기본 위치로 마커 로드 완료');
        return;

      }

      try {

        const v_7dd198 = await v_8a44cb.getCurrentPositionAsync({
          accuracy: v_8a44cb.Accuracy.High,
        });

        const v_4a8217 = {
          latitude: v_7dd198.coords.latitude,
          longitude: v_7dd198.coords.longitude,
        };

        let v_264a98 = v_4a8217;
        const v_7ce2d9 = !v_c38114.current;

        try {

          const v_05f29b = await v_e84827.getItem(v_f3d3c8);
          const v_45b2c8 = await v_e84827.getItem(v_eaa10e);

          if (v_05f29b && v_45b2c8) {
            const v_3a14d6 = JSON.parse(v_05f29b);
            const v_932c48 = parseInt(v_45b2c8, 10);
            const v_5c2f9f = Date.now();
            const v_e56026 = v_5c2f9f - v_932c48;

            if (v_e56026 < v_8d9416) {

              const v_926d1c = v_b464ed(
                v_4a8217.latitude,
                v_4a8217.longitude,
                v_3a14d6.latitude,
                v_3a14d6.longitude
              );

              if (v_926d1c < v_f41f0d) {
                v_264a98 = v_3a14d6;
                console.log(`📍 [위치 재사용] 마지막 위치 사용 (${Math.floor(v_e56026 / 1000)}초 전, ${v_926d1c.toFixed(0)}m)`);
              } else {
                console.log(`📍 [위치 재사용] 거리 초과 (${v_926d1c.toFixed(0)}m > ${v_f41f0d}m), 새 위치 사용`);
              }
            } else {
              console.log(`📍 [위치 재사용] 시간 초과 (${Math.floor(v_e56026 / 1000)}초 > ${v_8d9416 / 1000}초), 새 위치 사용`);
            }
          } else {
            console.log('📍 [위치 재사용] 저장된 위치 없음, 새 위치 사용');
          }
        } catch (v_df17d5) {
          console.error('📍 [위치 재사용] AsyncStorage 확인 실패:', v_df17d5);
        }

        await v_e84827.setItem(v_f3d3c8, JSON.stringify(v_264a98));
        await v_e84827.setItem(v_eaa10e, Date.now().toString());
        await v_e84827.setItem('selfCoordinate', JSON.stringify(v_264a98));

        if (v_7ce2d9) {
          v_b6ebe9(v_264a98);
          v_c84980(v_264a98);
          v_c38114.current = v_264a98;
          v_a2b40c.current = v_264a98;
          v_c675cc.current = {
            latitude: v_264a98.latitude,
            longitude: v_264a98.longitude,
          };
          console.log('=== 초기 위치 저장 ===', v_264a98);
        }

        v_0326b2(v_4a8217);

        const v_c9e79f = v_7ce2d9 ? v_264a98 : v_4a8217;
        const v_6ffbdc = {
          latitude: v_c9e79f.latitude,
          longitude: v_c9e79f.longitude,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        };

        v_de148f.current = v_6ffbdc;

        const v_eaf1be = Date.now() - v_9183ca.current;
        const v_6513eb = v_7ce2d9 || (v_eaf1be >= 30000 && v_9183ca.current > 0);
        console.log('🔍 [MapMainScreen] 마커 로드 조건 확인:', {
          isInitialLoad: v_7ce2d9,
          timeSinceLastRefresh: v_eaf1be,
          lastMarkerRefreshTime: v_9183ca.current,
          shouldLoadMarkers: v_6513eb,
        });

        if (v_7ce2d9) {
          console.log('🔄 [MapMainScreen] 초기 로드 - 마커 로드 시작 (재사용된 위치 사용)');
          v_9183ca.current = Date.now();
          await v_524200(v_264a98, false, v_4a8217);

          v_9bf134.current = true;
          console.log('✅ [MapMainScreen] 초기 로드 완료 플래그 설정');
        } else if (v_eaf1be >= 30000 && v_9183ca.current > 0) {

          console.log('🔄 [MapMainScreen] 시간 경과 후 갱신 - 마커 로드 시작');
          v_9183ca.current = Date.now();
          await v_524200(v_4a8217);
        } else {
          console.log('⚠️ [MapMainScreen] 마커 로드 건너뜀:', {
            isInitialLoad: v_7ce2d9,
            timeSinceLastRefresh: v_eaf1be,
            lastMarkerRefreshTime: v_9183ca.current,
            reason: v_7ce2d9 ? 'none' : (v_eaf1be < 30000 ? '시간 미경과' : '이전 로드 기록 없음'),
          });
        }

      } catch (v_5e9bfe) {

        const v_1744b9 = v_5e9bfe instanceof Error ? v_5e9bfe.message : '알 수 없는 오류';

        v_a7e4fc('위치를 가져오는 중 오류가 발생했습니다.');

        console.error('Location error:', v_5e9bfe);

        if (v_1744b9.includes('location services') || v_1744b9.includes('unavailable')) {

          await v_889fad(

            '위치 서비스 오류',

            '위치 정보를 가져올 수 없습니다.\n\n다음 사항을 확인해주세요:\n• 기기의 위치 서비스(GPS)가 켜져 있는지\n• 네트워크 위치 서비스가 활성화되어 있는지\n• 실내에서는 GPS 신호가 약할 수 있습니다.',

            [

              {
                text: '기본 위치 사용', onPress: async () => {

                  const v_3a1065 = {

                    latitude: 37.5665,

                    longitude: 126.9780,

                  };

                  v_0326b2(v_3a1065);
                  const v_6ffbdc = {
                    latitude: v_3a1065.latitude,
                    longitude: v_3a1065.longitude,
                    latitudeDelta: 0.005,
                    longitudeDelta: 0.005,
                  };

                  v_de148f.current = v_6ffbdc;

                  const v_d271aa = !v_c38114.current;
                  if (v_d271aa) {
                    v_b6ebe9(v_3a1065);
                    v_c84980(v_3a1065);
                    v_c38114.current = v_3a1065;
                    v_a2b40c.current = v_3a1065;

                    v_c675cc.current = {
                      latitude: v_3a1065.latitude,
                      longitude: v_3a1065.longitude,
                    };
                  }

                  const v_8fb4d1 = Date.now() - v_9183ca.current;
                  if (v_d271aa || (v_8fb4d1 >= 30000 && v_9183ca.current > 0)) {
                    v_9183ca.current = Date.now();
                    await v_524200(v_3a1065);
                  }

                }
              },

              { text: '확인', style: 'cancel' }

            ]

          );

        } else {

          const v_3a1065 = {

            latitude: 37.5665,

            longitude: 126.9780,

          };

          v_0326b2(v_3a1065);
          const v_6ffbdc = {
            latitude: v_3a1065.latitude,
            longitude: v_3a1065.longitude,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005,
          };

          v_de148f.current = v_6ffbdc;

          const v_818beb = !v_c38114.current;
          if (v_818beb) {
            v_b6ebe9(v_3a1065);
            v_c84980(v_3a1065);
            v_c38114.current = v_3a1065;
            v_a2b40c.current = v_3a1065;

            v_c675cc.current = {
              latitude: v_3a1065.latitude,
              longitude: v_3a1065.longitude,
            };
          }

          const v_1a2776 = Date.now() - v_9183ca.current;
          if (v_818beb || (v_1a2776 >= 30000 && v_9183ca.current > 0)) {
            v_9183ca.current = Date.now();
            await v_524200(v_3a1065);
          }

        }

      }

    };

    v_169317();

    const v_1f994c = async (): Promise<v_8a44cb.LocationSubscription | null> => {
      try {

        if (v_a1bf82.current) {
          v_a1bf82.current.remove();
          v_a1bf82.current = null;
        }

        const v_d1a6bb = await v_8a44cb.getForegroundPermissionsAsync();
        if (!v_d1a6bb.granted) {
          return null;
        }

        const v_4385ba = await v_8a44cb.watchPositionAsync(
          {
            accuracy: v_8a44cb.Accuracy.Low, 

            timeInterval: 2000, 

            distanceInterval: 10, 
          },
          (v_a55f0b) => {

            const v_66b19f = v_a55f0b.coords.heading;

            if (v_66b19f !== null && v_66b19f !== undefined && !isNaN(v_66b19f)) {
              const v_ca5264 = v_aae2cb.current;

              const v_6c0389 = 5;
              const v_d2e929 = v_ca5264 === null
                ? v_6c0389 + 1
                : Math.abs(v_66b19f - v_ca5264);
              if (v_d2e929 >= v_6c0389) {

                v_aae2cb.current = v_66b19f;

                v_a18647(v_66b19f);
              }
            }
          }
        );
        v_a1bf82.current = v_4385ba;
        return v_4385ba;
      } catch (v_5e9bfe) {
        console.error('헤딩 추적 오류:', v_5e9bfe);
        return null;
      }
    };

    v_1f994c();

    let v_d9e7b9 = v_6b5698.currentState;

    const v_269481 = v_6b5698.addEventListener('change', (v_3b10d8) => {

      if (v_d9e7b9 === v_3b10d8) {
        return;
      }

      if (v_d9e7b9.match(/inactive|background/) && v_3b10d8 === 'active') {

        if (v_ac1d22 === 'Map') {
          const v_2ba617 = async () => {
            try {

              const v_764826 = await v_e84827.getItem('shouldNavigateToCamera');
              if (v_764826 === 'true') {
                console.log('[MapMainScreen] 광고보기 완료 감지 - AR 화면으로 이동');
                await v_e84827.removeItem('shouldNavigateToCamera');

                v_02dd63('Camera');

                setTimeout(async () => {

                  const v_172d56 = await v_e84827.getItem('shouldRefreshTopAd5');
                  if (v_172d56 === 'true') {
                    await v_e84827.removeItem('shouldRefreshTopAd5');

                    const v_dc62a4 = await v_e84827.getItem('completedAdCampid');
                    if (v_dc62a4) {
                      await v_e84827.removeItem('completedAdCampid');
                      console.log(`[MapMainScreen] 완료된 광고 제거 및 대체 시작: ${v_dc62a4}`);

                      await v_8cba1e(v_dc62a4, v_9b57fc);
                    }

                    await v_6dea10(true);
                  }
                }, 300);
                return; 
              }

              const v_172d56 = await v_e84827.getItem('shouldRefreshTopAd5');
              if (v_172d56 === 'true') {
                console.log('[MapMainScreen] 광고보기 완료 감지 - TopAd5 및 마커 전체 새로고침');
                await v_e84827.removeItem('shouldRefreshTopAd5');

                const v_dc62a4 = await v_e84827.getItem('completedAdCampid');
                if (v_dc62a4) {
                  await v_e84827.removeItem('completedAdCampid');
                  console.log(`[MapMainScreen] 완료된 광고 제거 및 대체 시작: ${v_dc62a4}`);

                  await v_8cba1e(v_dc62a4, v_9b57fc);
                }

                setTimeout(async () => {
                  await v_6dea10(true);
                }, 500);
              } else {

                const v_e36b07 = await v_563153();
                if (v_e36b07 && Array.isArray(v_e36b07) && v_e36b07.length > 0) {

                  const v_6c877c = v_e36b07.filter((v_ddcfed) => {
                    const v_7ec08d = v_ddcfed.urlAD;

                    if (!v_7ec08d || typeof v_7ec08d !== 'string' || v_7ec08d.trim() === '' || v_7ec08d === '없음' || v_7ec08d === 'No') {
                      console.warn('[MapMainScreen] ⚠️ 백엔드에서 필터링되지 않은 항목 발견:', {
                        campid: v_ddcfed.campid,
                        urlAD: v_7ec08d,
                      });
                      return false;
                    }
                    return true;
                  });
                  if (v_6c877c.length > 0) {
                    v_6549d0(v_6c877c);
                    v_0302dd.current = v_6c877c; 
                    console.log('[MapMainScreen] AppState active - TopAd5 업데이트:', v_6c877c.length, '개');
                  }
                }
              }
            } catch (v_5e9bfe) {
              console.error('[MapMainScreen] AppState active - TopAd5 새로고침 실패:', v_5e9bfe);
            }
          };

          setTimeout(v_2ba617, 500);
        }

        v_8a44cb.getForegroundPermissionsAsync().then((v_d1a6bb) => {
          if (v_d1a6bb.granted) {

            v_8a44cb.getCurrentPositionAsync({
              accuracy: v_8a44cb.Accuracy.High,
            }).then((v_7dd198) => {
              const v_4a8217 = {
                latitude: v_7dd198.coords.latitude,
                longitude: v_7dd198.coords.longitude,
              };
              v_0326b2(v_4a8217);
              v_de148f.current = {
                latitude: v_4a8217.latitude,
                longitude: v_4a8217.longitude,
                latitudeDelta: 0.005,
                longitudeDelta: 0.005,
              };
            }).catch((v_5e9bfe) => {

              console.log('포그라운드 복귀 시 위치 가져오기 실패 (무시):', v_5e9bfe.message);
            });

            v_1f994c();
          } else {

            console.log('📍 포그라운드 복귀 시 권한 없음 - 권한 재요청');
            v_3e450c.current = false;
            v_169317();
          }
        }).catch(() => {

          v_8a44cb.getCurrentPositionAsync({
            accuracy: v_8a44cb.Accuracy.High,
          }).then((v_7dd198) => {
            const v_4a8217 = {
              latitude: v_7dd198.coords.latitude,
              longitude: v_7dd198.coords.longitude,
            };
            v_0326b2(v_4a8217);
            v_de148f.current = {
              latitude: v_4a8217.latitude,
              longitude: v_4a8217.longitude,
              latitudeDelta: 0.005,
              longitudeDelta: 0.005,
            };
          }).catch(() => {

          });
        });
      }

      v_d9e7b9 = v_3b10d8;
    });

    return () => {
      v_269481?.remove();

      if (v_a1bf82.current) {
        v_a1bf82.current.remove();
        v_a1bf82.current = null;
      }

      if (v_bbb844.current) {
        clearTimeout(v_bbb844.current);
        v_bbb844.current = null;
      }

      if (v_e40b2a.current) {
        clearInterval(v_e40b2a.current);
        v_e40b2a.current = null;
      }
    };
  }, []); 

  v_c4deb2(() => {

    if (!v_c19838 || !v_b8d9d3) {
      return;
    }

    if (v_e40b2a.current) {

      clearInterval(v_e40b2a.current);

      v_e40b2a.current = null;

    }

    v_e40b2a.current = setInterval(() => {
      v_acecf6();
    }, 5000); 

    v_a11b30.current = Date.now();
    return () => {

      if (v_e40b2a.current) {

        clearInterval(v_e40b2a.current);

        v_e40b2a.current = null;

      }

    };

  }, [v_c19838, v_b8d9d3, v_acecf6]);

  v_c4deb2(() => {

    if (
      v_640ccc &&
      v_640ccc !== 'map' &&
      v_4166d2.current !== v_640ccc
    ) {
      console.log('[MapMainScreen] 화면 이동 감지:', v_640ccc, '→ map');

      v_d8a1fd(false);
      v_94e8d8(null);

      v_0db6cf();
    }

    v_4166d2.current = v_640ccc;
  }, [v_640ccc, v_0db6cf]);

  const v_cb7215 = v_df9f57(() => {

    if (!v_d5e3e8 || v_b4d4c5.length === 0) {
      return new Map<string, TopAd5Item | null>();
    }

    if (v_4cf0ad.length === 0) {
      console.log('[MapMainScreen] TopAd5 광고 없음, getTopAd5 재호출 시도');
      return new Map<string, TopAd5Item | null>();
    }

    const v_b407aa = [...v_b4d4c5]
      .filter(v_5e3dbb => v_5e3dbb.latitude && v_5e3dbb.longitude)
      .map(v_5e3dbb => ({
        marker: v_5e3dbb,
        distance: v_b464ed(
          v_d5e3e8.latitude,
          v_d5e3e8.longitude,
          v_5e3dbb.latitude!,
          v_5e3dbb.longitude!
        ),
      }))
      .sort((v_779914, v_148ff6) => v_779914.distance - v_148ff6.distance);

    const v_b3439a = new Map<string, TopAd5Item | null>();
    v_b407aa.forEach(({ marker: v_5e3dbb }, v_a56041) => {

      let v_f81bc9;
      if (v_5e3dbb.spotID !== undefined && v_5e3dbb.spotID !== null && v_5e3dbb.spotID !== 0) {

        v_f81bc9 = `spot-${v_5e3dbb.spotID}`;
      } else if (v_5e3dbb.coin !== undefined && v_5e3dbb.coin !== null) {

        v_f81bc9 = `coin-${v_5e3dbb.coin}`;
      } else {

        const v_e1b1cf = v_5e3dbb.latitude?.toFixed(6) ?? '0';
        const v_c87b30 = v_5e3dbb.longitude?.toFixed(6) ?? '0';
        v_f81bc9 = `marker-${v_e1b1cf}-${v_c87b30}`;
      }

      const v_e149c8 = `${v_f81bc9}-${v_a56041}`;

      if (v_a56041 < 16 && v_4cf0ad.length > 0) {
        const v_ba7922 = v_a56041 % v_4cf0ad.length;
        const v_127b33 = v_4cf0ad[v_ba7922];
        v_b3439a.set(v_e149c8, v_127b33);
      } else {

        v_b3439a.set(v_e149c8, null);
      }

      if (v_a56041 < 10) {

      }
    });
    console.log('[MapMainScreen] 마커-광고 매핑 완료:', v_b3439a.size, '개 마커, TopAd5 개수:', v_4cf0ad.length);
    return v_b3439a;
  }, [v_d5e3e8, v_b4d4c5, v_4cf0ad]);

  v_c4deb2(() => {

    if (
      v_ac1d22 === 'Map' &&
      v_4cf0ad.length === 0 &&
      v_d5e3e8 &&
      v_b4d4c5.length > 0 &&
      !v_fd5fd4.current 
    ) {
      console.log('[MapMainScreen] TopAd5 광고 없음 감지, getTopAd5 재호출 시작');
      const v_29fd1b = async () => {

        if (v_fd5fd4.current) {
          console.log('[MapMainScreen] getTopAd5 이미 호출 중입니다. 중복 호출 무시');
          return;
        }

        v_fd5fd4.current = true;
        try {
          const v_e36b07 = await v_563153();
          if (v_e36b07 && Array.isArray(v_e36b07) && v_e36b07.length > 0) {
            console.log('[MapMainScreen] TopAd5 재호출 성공:', v_e36b07.length, '개 광고');
            v_6549d0(v_e36b07);
            v_0302dd.current = v_e36b07; 

            v_89e09e(v_e36b07);
          } else {
            console.warn('[MapMainScreen] TopAd5 재호출 결과: 데이터 없음');

            const v_fe7102 = await v_5d7ca4();
            if (v_fe7102 && Array.isArray(v_fe7102) && v_fe7102.length > 0) {
              v_6549d0(v_fe7102);
              v_0302dd.current = v_fe7102; 
              console.log('[MapMainScreen] 저장된 TopAd5 데이터 사용:', v_fe7102.length, '개 광고');
            }
          }
        } catch (v_5e9bfe) {
          console.error('[MapMainScreen] TopAd5 재호출 실패:', v_5e9bfe);
        } finally {

          v_fd5fd4.current = false;
        }
      };
      v_29fd1b();
    }
  }, [v_ac1d22, v_4cf0ad.length, v_d5e3e8, v_b4d4c5.length]);

  const v_3d837b = v_de06a3((marker: v_f71847): string => {

    if (v_5e3dbb.spotID !== undefined && v_5e3dbb.spotID !== null && v_5e3dbb.spotID !== 0) {
      return `spot-${v_5e3dbb.spotID}`;
    } else if (v_5e3dbb.coin !== undefined && v_5e3dbb.coin !== null) {
      return `coin-${v_5e3dbb.coin}`;
    } else {

      const v_e1b1cf = v_5e3dbb.latitude?.toFixed(6) ?? '0';
      const v_c87b30 = v_5e3dbb.longitude?.toFixed(6) ?? '0';
      return `marker-${v_e1b1cf}-${v_c87b30}`;
    }
  }, []);

  const v_335a76 = v_de06a3((marker: v_f71847): TopAd5Item | null | undefined => {
    const v_6845e8 = v_3d837b(v_5e3dbb);

    for (const [v_b24339, v_ddcfed] of v_cb7215.entries()) {
      if (v_b24339.startsWith(v_6845e8 + '-')) {
        return v_ddcfed;
      }
    }
    return undefined;
  }, [v_cb7215, v_3d837b]);

  const v_6a213b = (v_6e55b1) => {

    console.log('Navigation item pressed:', v_6e55b1);

    switch (v_6e55b1) {

      case 'xplay':
        v_9b57fc(v_ce4741.xplayInfo);
        break;

      case 'wallet':

        v_9b57fc(v_ce4741.wallet);

        break;

      case 'shop':
        console.log('[MapMainScreen] shop 클릭됨, ROUTES.shop으로 이동:', v_ce4741.shop);
        v_9b57fc(v_ce4741.shop);
        break;

      case 'referral':

        v_9b57fc(v_ce4741.referralMyGroup);

        break;

      case 'info':

        v_9b57fc(v_ce4741.myInfo);

        break;

      case 'map':

        console.log('📍 [하단 메뉴] 맵 클릭 - GPS 위치로 이동 및 콜아웃 숨기기');

        v_d8a1fd(false);
        v_94e8d8(null);

        if (v_ac1d22 === 'Map') {
          v_0db6cf();
        } else {

          v_02dd63('Map');
          setTimeout(() => {
            v_0db6cf();
          }, 100);
        }
        break;

      default:

        console.log('Unknown navigation item:', v_6e55b1);

    }

  };

  const v_42b5ed = (v_11083e) => {
    v_02dd63(v_11083e);
    console.log('Tab changed to:', v_11083e);

    if (v_11083e === 'Map') {

      v_d8a1fd(false);
      v_94e8d8(null);

      setTimeout(() => {
        v_0db6cf();
      }, 100);
    }
  };

  const v_fc58d0 = async (spot: v_f71847) => {

    const v_aa0917 = String(v_c5ac8b.campid || '');
    if (v_aa0917) {
      try {

      } catch (v_5e9bfe) {
        console.warn('[MapMainScreen] 본 광고 확인 실패 (무시):', v_5e9bfe);
      }
    }

    const v_f81bc9 = v_3d837b(v_c5ac8b);
    const v_127b33 = v_335a76(v_c5ac8b);

    console.log('🎯 마커 클릭 - 매핑 확인:', {
      markerKey: v_f81bc9,
      spotID: v_c5ac8b.spotID,
      coin: v_c5ac8b.coin,
      latitude: v_c5ac8b.latitude,
      longitude: v_c5ac8b.longitude,
      hasMappedAd: !!v_127b33,
      mappedAdName: v_127b33?.name || '없음',
      mappedAdCompany: v_127b33?.ad_company || '없음',
      mappingSize: v_cb7215.size,
    });

    if (v_c5ac8b.latitude && v_c5ac8b.longitude) {
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('📍 [임시 작업] 현재 마커와 주변 5개 마커 광고명');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

      const v_b50a7e = v_127b33?.name || v_c5ac8b.name || '광고 없음';
      console.log(`[현재 마커] ${v_b50a7e} (거리: 0m)`);

      const v_6442c3 = v_b4d4c5
        .filter(v_5e3dbb =>
          v_5e3dbb.latitude &&
          v_5e3dbb.longitude &&
          !(v_5e3dbb.spotID === v_c5ac8b.spotID && v_5e3dbb.latitude === v_c5ac8b.latitude && v_5e3dbb.longitude === v_c5ac8b.longitude) 
        )
        .map(v_5e3dbb => {
          const v_926d1c = v_b464ed(
            v_c5ac8b.latitude!,
            v_c5ac8b.longitude!,
            v_5e3dbb.latitude!,
            v_5e3dbb.longitude!
          );
          const v_ddcfed = v_335a76(v_5e3dbb);
          return {
            marker: v_5e3dbb,
            distance: v_926d1c,
            adName: v_ddcfed?.name || v_5e3dbb.name || '광고 없음',
            adCompany: v_ddcfed?.ad_company || '없음',
          };
        })
        .sort((v_779914, v_148ff6) => v_779914.distance - v_148ff6.distance)
        .slice(0, 5); 

      v_6442c3.forEach((v_8c0b26, v_a56041) => {
        console.log(`[주변 ${v_a56041 + 1}] ${v_8c0b26.adName} (거리: ${v_8c0b26.distance.toFixed(2)}m, 회사: ${v_8c0b26.adCompany})`);
      });

      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    }

    const v_c82943 = v_127b33 ? {
      ...v_c5ac8b,
      name: v_127b33.name || v_c5ac8b.name,
      iconurl: v_127b33.iconurl || v_c5ac8b.iconurl,
      joindesc: v_127b33.joindesc || v_c5ac8b.joindesc,
      xrunPrice: v_127b33.xrunPrice || v_c5ac8b.xrunPrice,
      brand: v_c5ac8b.brand, 

      advertisement: v_c5ac8b.advertisement,
      campid: v_127b33.campid || v_c5ac8b.campid,

      thumbnail: v_127b33.thumbnail,
      ad_company: v_127b33.ad_company,
      coins: v_127b33.coins?.toString() || v_c5ac8b.coins,
    } as v_f71847 & { thumbnail?: string; ad_company?: string } : v_c5ac8b;
    console.log('🎯 마커 클릭 - 전달된 데이터:', {
      markerKey: v_f81bc9,
      hasMappedAd: !!v_127b33,
      name: v_c82943.name,
      brand: v_c82943.brand,
      xrunPrice: v_c82943.xrunPrice,
      iconurl: v_c82943.iconurl,
      advertisement: v_c82943.advertisement,
      campid: (v_c82943 as any).campid,
      coin: v_c82943.coin,
      joindesc: v_c82943.joindesc,
      ad_company: (v_c82943 as any).ad_company,
    });
    v_22f943(v_c82943);

    if (!v_572bd3) {

      v_6a4dcd(true);

    }

    if (v_3ec640.current && v_c5ac8b.latitude && v_c5ac8b.longitude) {

      const v_340e3c = v_de148f.current;

      v_ca338a.current = true;

      console.log('📍 [프로그램 이동] 마커 클릭으로 맵 이동 시작');

      console.log('  현재 위치:', v_340e3c.latitude.toFixed(6), v_340e3c.longitude.toFixed(6));

      console.log('  목표 위치:', v_c5ac8b.latitude.toFixed(6), v_c5ac8b.longitude.toFixed(6));

      v_3ec640.current.animateToRegion({

        latitude: v_c5ac8b.latitude,

        longitude: v_c5ac8b.longitude,

        latitudeDelta: v_340e3c.latitudeDelta,

        longitudeDelta: v_340e3c.longitudeDelta,

      }, 500); 

      const v_6ffbdc = {

        latitude: v_c5ac8b.latitude,

        longitude: v_c5ac8b.longitude,

        latitudeDelta: v_340e3c.latitudeDelta,

        longitudeDelta: v_340e3c.longitudeDelta,

      };
      v_de148f.current = v_6ffbdc;

      v_a11b30.current = Date.now();

      setTimeout(() => {

        v_ca338a.current = false;

        console.log('📍 [프로그램 이동] 마커 클릭 이동 플래그 리셋 완료');

      }, 600);

      setTimeout(() => {

        if (v_3ec640.current && v_c5ac8b.latitude && v_c5ac8b.longitude) {

          v_3ec640.current.pointForCoordinate({

            latitude: v_c5ac8b.latitude!,

            longitude: v_c5ac8b.longitude!,

          }).then((v_49cb67) => {

            if (v_49cb67) {

              v_17f37a({

                x: v_49cb67.x - 110, 

                y: Math.max(50, v_49cb67.y - 80), 

              });

              console.log('🎯 중앙 팝업 표시 데이터:', {
                name: v_c82943.name,

                xrunPrice: v_c82943.xrunPrice,
                advertisement: v_c82943.advertisement,
                campid: (v_c82943 as any).campid,
                iconurl: v_c82943.iconurl,

                ad_company: (v_c82943 as any).ad_company,
              });
              v_94e8d8(v_c82943);

              v_d8a1fd(true);

            }

          }).catch((v_5e9bfe) => {

            console.error('좌표 변환 오류:', v_5e9bfe);

            const { width: v_8e4fb6 } = v_700696.get('window');

            v_17f37a({

              x: (v_8e4fb6 - 220) / 2, 

              y: 100, 

            });

            console.log('🎯 중앙 팝업 표시 데이터 (좌표 변환 실패):', {
              name: v_c82943.name,
              brand: v_c82943.brand,
              xrunPrice: v_c82943.xrunPrice,
              advertisement: v_c82943.advertisement,
              campid: (v_c82943 as any).campid,
              iconurl: v_c82943.iconurl,
              joindesc: v_c82943.joindesc,
              ad_company: (v_c82943 as any).ad_company,
            });
            v_94e8d8(v_c82943);

            v_d8a1fd(true);

          });

        }

      }, 600); 

    } else {

      const { width: v_8e4fb6 } = v_700696.get('window');

      v_17f37a({

        x: (v_8e4fb6 - 220) / 2, 

        y: 100,

      });

      console.log('🎯 중앙 팝업 표시 데이터 (맵 미준비):', {
        name: v_c82943.name,
        brand: v_c82943.brand,
        xrunPrice: v_c82943.xrunPrice,
        advertisement: v_c82943.advertisement,
        campid: (v_c82943 as any).campid,
        iconurl: v_c82943.iconurl,
        joindesc: v_c82943.joindesc,
        ad_company: (v_c82943 as any).ad_company,
      });
      v_94e8d8(v_c82943);

      v_d8a1fd(true);

    }

  };

  const v_4e890f = (v_d48baf) => {

    const v_87aa97 = v_d48baf.nativeEvent.coordinate;

    if (!v_87aa97 || !v_87aa97.latitude || !v_87aa97.longitude) {

      v_d8a1fd(false);

      v_94e8d8(null);
      v_6a4dcd(false);
      v_22f943(null);

      return;

    }

    if (v_b4d4c5.length === 0) {

      v_d8a1fd(false);

      v_94e8d8(null);
      v_6a4dcd(false);
      v_22f943(null);

      return;

    }

    let nearestMarker: v_f71847 | null = null;

    let v_2540f0 = Infinity;

    v_b4d4c5.forEach((v_5e3dbb) => {

      if (!v_5e3dbb.latitude || !v_5e3dbb.longitude) {

        return;

      }

      const v_926d1c = v_b464ed(

        v_87aa97.latitude,

        v_87aa97.longitude,

        v_5e3dbb.latitude,

        v_5e3dbb.longitude

      );

      if (v_926d1c < v_2540f0) {

        v_2540f0 = v_926d1c;

        v_386fb7 = v_5e3dbb;

      }

    });

    if (v_386fb7 === null || v_2540f0 > 100) {

      v_d8a1fd(false);
      v_94e8d8(null);
      v_6a4dcd(false);
      v_22f943(null);
      console.log('=== 맵 클릭: 100미터 이내 마커 없음 - 콜아웃 및 하단 패널 닫기 ===');
      console.log('가장 가까운 마커 거리:', v_2540f0 === Infinity ? '없음' : `${v_2540f0.toFixed(2)}m`);
      return;
    }

    const marker: v_f71847 = v_386fb7;

    if (!v_5e3dbb.latitude || !v_5e3dbb.longitude) {

      v_d8a1fd(false);
      v_94e8d8(null);
      v_6a4dcd(false);
      v_22f943(null);
      return;
    }

    const v_f81bc9 = v_3d837b(v_5e3dbb);
    const v_127b33 = v_335a76(v_5e3dbb);

    const v_d8547f = v_127b33 ? {
      ...v_5e3dbb,
      name: v_127b33.name || v_5e3dbb.name,
      iconurl: v_127b33.iconurl || v_5e3dbb.iconurl,
      joindesc: v_127b33.joindesc || v_5e3dbb.joindesc,
      xrunPrice: v_127b33.xrunPrice || v_5e3dbb.xrunPrice,
      brand: v_5e3dbb.brand,
      advertisement: v_5e3dbb.advertisement,
      campid: v_127b33.campid || v_5e3dbb.campid,
      thumbnail: v_127b33.thumbnail,
      ad_company: v_127b33.ad_company,
      coins: v_127b33.coins?.toString() || v_5e3dbb.coins,
    } as v_f71847 & { thumbnail?: string; ad_company?: string } : v_5e3dbb;
    console.log('=== 맵 클릭: 가장 가까운 마커 찾기 ===');
    console.log('클릭한 위치:', v_87aa97.latitude, v_87aa97.longitude);
    console.log('가장 가까운 마커:', v_d8547f.name || 'Unknown', '거리:', v_2540f0.toFixed(2), 'm');
    console.log('매핑된 광고 여부:', !!v_127b33, 'ad_company:', (v_d8547f as any).ad_company);

    v_22f943(v_d8547f);

    if (!v_572bd3) {

      v_6a4dcd(true);

    }

    const v_340e3c = v_de148f.current;

    if (v_3ec640.current && v_5e3dbb.latitude && v_5e3dbb.longitude) {

      v_ca338a.current = true;

      console.log('📍 [프로그램 이동] 맵 클릭으로 맵 이동 시작');

      console.log('  현재 위치:', v_340e3c.latitude.toFixed(6), v_340e3c.longitude.toFixed(6));

      console.log('  목표 위치:', v_5e3dbb.latitude.toFixed(6), v_5e3dbb.longitude.toFixed(6));

      v_3ec640.current.animateToRegion({

        latitude: v_5e3dbb.latitude,

        longitude: v_5e3dbb.longitude,

        latitudeDelta: v_340e3c.latitudeDelta,

        longitudeDelta: v_340e3c.longitudeDelta,

      }, 500); 

      setTimeout(() => {

        v_ca338a.current = false;

        console.log('📍 [프로그램 이동] 맵 클릭 이동 플래그 리셋 완료');

      }, 600);

    }

    const v_6ffbdc = {

      latitude: v_5e3dbb.latitude!,

      longitude: v_5e3dbb.longitude!,

      latitudeDelta: v_340e3c.latitudeDelta,

      longitudeDelta: v_340e3c.longitudeDelta,

    };
    v_de148f.current = v_6ffbdc;

    v_a11b30.current = Date.now();

    setTimeout(() => {

      if (v_3ec640.current && v_5e3dbb.latitude && v_5e3dbb.longitude) {

        v_3ec640.current.pointForCoordinate({

          latitude: v_5e3dbb.latitude,

          longitude: v_5e3dbb.longitude,

        }).then((v_49cb67) => {

          if (v_49cb67) {

            v_17f37a({

              x: v_49cb67.x - 110, 

              y: Math.max(50, v_49cb67.y - 80), 

            });

            v_94e8d8(v_d8547f);

            v_d8a1fd(true);

          }

        }).catch((v_5e9bfe) => {

          console.error('좌표 변환 오류:', v_5e9bfe);

          const { width: v_8e4fb6 } = v_700696.get('window');

          v_17f37a({

            x: (v_8e4fb6 - 220) / 2, 

            y: 100, 

          });

          v_94e8d8(v_5e3dbb);

          v_d8a1fd(true);

        });

      }

    }, 600); 

  };

  const v_2cf5bb = (spot: v_f71847) => {

    if (v_3ec640.current && v_c5ac8b.latitude && v_c5ac8b.longitude) {

      v_3ec640.current.pointForCoordinate({

        latitude: v_c5ac8b.latitude!,

        longitude: v_c5ac8b.longitude!,

      }).then((v_49cb67) => {

        if (v_49cb67) {

          v_17f37a({

            x: v_49cb67.x - 135, 

            y: Math.max(50, v_49cb67.y - 80), 

          });

        }

      }).catch((v_5e9bfe) => {

        console.error('좌표 변환 오류:', v_5e9bfe);

      });

    }

  };

  const v_0424a1 = (v_a6c30b) => {

  };

  const v_f127bf = () => {

    if (v_326be8.OS === 'ios') {

      console.log('👆 [iOS] 사용자 드래그 시작 감지');

      v_43de51.current = true;

    }

  };

  const v_6b4469 = async (v_a6c30b) => {

    const v_355a57 = v_ca338a.current;
    const v_81a27a = v_326be8.OS;
    const v_46e4e9 = v_c675cc.current;

    if (v_326be8.OS === 'ios' && v_ca338a.current) {
      console.log('⚠️ [iOS] 프로그램 이동 감지 - mapRegionRef 업데이트 건너뛰기');

      v_de148f.current = v_a6c30b;

      v_ca338a.current = false;
      return;
    }

    if (v_326be8.OS === 'ios' && !v_43de51.current) {
      console.log('⚠️ [iOS] 사용자 터치 없음 - mapRegionRef 업데이트 건너뛰기 및 지도 위치 복귀');

      if (v_3ec640.current) {
        const v_340e3c = v_de148f.current;
        v_3ec640.current.animateToRegion({
          latitude: v_340e3c.latitude,
          longitude: v_340e3c.longitude,
          latitudeDelta: v_340e3c.latitudeDelta,
          longitudeDelta: v_340e3c.longitudeDelta,
        }, 100); 
      }

      return;
    }

    if (v_326be8.OS === 'ios' && v_46e4e9) {

      const v_7358c4 = Math.abs(v_a6c30b.latitude - v_46e4e9.latitude);

      const v_85decc = Math.abs(v_a6c30b.longitude - v_46e4e9.longitude);

      const v_8cc066 = 0.0001; 

      if (v_7358c4 < v_8cc066 && v_85decc < v_8cc066) {

        console.log('⚠️ [iOS] 위치 변경이 너무 작음 - 무시 및 지도 위치 복귀');

        if (v_3ec640.current && v_46e4e9) {

          v_3ec640.current.animateToRegion({

            latitude: v_46e4e9.latitude,

            longitude: v_46e4e9.longitude,

            latitudeDelta: v_de148f.current.latitudeDelta,

            longitudeDelta: v_de148f.current.longitudeDelta,

          }, 100); 

        }

        return;

      }

    } else if (v_326be8.OS === 'ios' && !v_46e4e9) {

    }

    if (v_326be8.OS === 'ios') {

    } else {

    }

    v_de148f.current = v_a6c30b;

    v_c675cc.current = {

      latitude: v_a6c30b.latitude,

      longitude: v_a6c30b.longitude,

    };

    v_a11b30.current = Date.now();

    v_43de51.current = false;

  };

  const v_90608c = v_df9f57(() => {
    return v_de148f.current;
  }, []); 

  const v_15f7cd = v_df9f57(() => {
    return !!v_a55f0b;
  }, [v_a55f0b]);

  const v_0f8a7a = v_df9f57(() => {

    const v_e4cf17 = v_b4d4c5.filter((v_5e3dbb) => v_5e3dbb.latitude && v_5e3dbb.longitude); 

    const v_f15433 = v_e4cf17.map((v_5e3dbb) => {

      const v_f3fb62 = v_5e3dbb.campid ?? '';
      const v_761f48 = v_5e3dbb.coin ?? '';
      const v_27d5bf = v_5e3dbb.spotID ?? '';
      const v_e1b1cf = v_5e3dbb.latitude!.toFixed(6);
      const v_c87b30 = v_5e3dbb.longitude!.toFixed(6);
      const v_e149c8 = `marker-${v_f3fb62}-${v_761f48}-${v_27d5bf}-${v_e1b1cf}-${v_c87b30}`;
      return {
        ...v_5e3dbb,
        uniqueKey: v_e149c8,
      };
    });
    console.log('✅ [memoizedMarkers] 최종 마커 개수:', v_f15433.length);
    return v_f15433;
  }, [v_b4d4c5]);

  v_c4deb2(() => {
    console.log('📊 [markers 상태 변경] markers 개수:', v_b4d4c5.length);
    if (v_b4d4c5.length > 0) {
      console.log('✅ [markers 상태 변경] 마커 데이터 있음, 첫 번째 마커:', {
        coin: v_b4d4c5[0].coin,
        name: v_b4d4c5[0].name,
        latitude: v_b4d4c5[0].latitude,
        longitude: v_b4d4c5[0].longitude,
      });

      if (
        v_9bf134.current &&
        !v_9d72cd.current &&
        v_b4d4c5[0].latitude &&
        v_b4d4c5[0].longitude &&
        v_3ec640.current
      ) {
        console.log('📍 [초기 로드] 첫 번째 마커 위치로 맵 이동:', v_b4d4c5[0].latitude, v_b4d4c5[0].longitude);

        v_ca338a.current = true;
        v_3ec640.current.animateToRegion({
          latitude: v_b4d4c5[0].latitude,
          longitude: v_b4d4c5[0].longitude,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        }, 500);

        v_de148f.current = {
          latitude: v_b4d4c5[0].latitude,
          longitude: v_b4d4c5[0].longitude,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        };

        v_9d72cd.current = true;

        setTimeout(() => {
          v_ca338a.current = false;
        }, 600);
      }
    } else {
      console.log('⚠️ [markers 상태 변경] 마커 데이터 없음 (빈 배열)');
    }
  }, [v_b4d4c5]);

  const v_fce460 = [

    { id: 'xplay', label: v_8d41d7('components.bottomNavigationBar.xplay'), icon: v_622956 },

    { id: 'shop', label: v_8d41d7('components.bottomNavigationBar.shop'), icon: v_e96568 },

    { id: 'map', label: '' }, 

    { id: 'wallet', label: v_8d41d7('components.bottomNavigationBar.wallet'), icon: v_8daafe },

    { id: 'info', label: v_8d41d7('components.bottomNavigationBar.info'), icon: v_b636c9 },

  ];

  const v_05cebe = "93440b14d54bef4d8c7f9ddf";

  if (v_ac1d22 === 'Camera') {

    return (

      <CameraMainScreen

        activeTab={v_ac1d22}

        onTabChange={v_42b5ed}

      />

    );

  }

  return (

    <View style={v_d81136.container}>

      {}
      <LevelNotification navigation={v_9b57fc} />

      <StatusBar style="dark" />
      {}

      <View style={v_d81136.statusBar}>
        <View style={v_d81136.statusBarContent}>
          <View style={v_d81136.timeContainer}>
            {}
          </View>
        </View>
      </View>

      {}

      <View style={v_d81136.mapContainer}>

        <MapView
          ref={v_3ec640}
          provider={v_b4043e}
          style={v_d81136.map}
          userInterfaceStyle="light"
          initialRegion={v_90608c}
          showsUserLocation={v_15f7cd}
          showsMyLocationButton={false}
          onMapReady={v_64543d}
          onRegionChange={v_0424a1}
          onRegionChangeComplete={v_6b4469}
          onPanDrag={v_f127bf}
          onPress={v_4e890f}
          googleMapId={v_05cebe}
        >

          {}

          {v_0f8a7a.map((v_5e3dbb) => {
            return (
              <Marker

                key={v_5e3dbb.uniqueKey}

                coordinate={{
                  latitude: v_5e3dbb.latitude!,
                  longitude: v_5e3dbb.longitude!,
                }}

                anchor={{ x: 0.5, y: 0.5 }}
                onPress={() => v_fc58d0(v_5e3dbb)}
                tracksViewChanges={true}
              >

                {}
                {v_232839 ? (
                  <View style={v_d81136.markerImageContainer}>
                    <Image
                      source={v_232839}
                      style={v_d81136.markerImage}
                      resizeMode="contain"
                    />
                  </View>
                ) : (

                  <View style={v_d81136.defaultMarker} />
                )}

              </Marker>
            );
          })}
        </MapView>

        {}
        {

}

        {}
        <Pressable
          style={v_d81136.mapPinButton}
          onPress={v_30b908}
        >
          <Image
            source={require('../../assets/images/locationpin2.png')}
            style={v_d81136.mapPinIcon}
            resizeMode="contain"
          />
        </Pressable>

        {}

        {v_001c8f && v_456f34 && (

          <View
            style={[
              v_d81136.calloutPopup,
              {
                left: v_96b118.x,
                top: v_96b118.y,
              },
            ]}
            pointerEvents="box-none"
          >
            <View style={v_d81136.calloutContainer}>
              <View style={v_d81136.calloutLeft}>
                {}
                {v_456f34.iconurl ? (
                  <Image
                    source={{ uri: v_456f34.iconurl }}
                    style={[v_d81136.calloutImage, { borderRadius: 6 }]}
                    resizeMode="cover"
                  />
                ) : v_8c4b15 ? (
                  <Image
                    source={v_8c4b15}
                    style={v_d81136.calloutImage}
                    resizeMode="contain"
                  />
                ) : (
                  v_be97ff && (
                    <Image
                      source={v_be97ff}
                      style={v_d81136.calloutImage}
                      resizeMode="contain"
                    />
                  )
                )}

                {}

                <Text style={v_d81136.calloutDistance}>
                  {v_456f34.distance.toFixed(2)}m
                </Text>
              </View>

              <View style={v_d81136.calloutRight}>
                <Text style={v_d81136.calloutBrand} numberOfLines={2}>
                  {v_456f34.name || v_456f34.brand || 'XRUN'} 획득 가능합니다.
                </Text>
              </View>
            </View>
          </View>
        )}
      </View>

      {}

      <MapBottomPanel

        visible={v_572bd3}

        spotData={v_27aea1}

        deviceHeading={v_4b9594}

        onClose={() => {

          v_6a4dcd(false);

          v_22f943(null);

        }}

        onExpand={() => {

          v_6a4dcd(true);

        }}

      />

      {}

      {}

      <View style={{ zIndex: 10 }}>

        <BottomNavigationBar

          items={v_fce460}

          activeItemId="map"

          activeTab={v_ac1d22}

          onItemPress={v_6a213b}

          onTabChange={v_42b5ed}

        />

      </View>

      {}

      {v_b6e060 && (

        <View style={v_d81136.loadingOverlay}>

          <View style={v_d81136.loadingContainer}>

            <ActivityIndicator size="large" color="#343a5a" />

            <Text style={v_d81136.loadingText}>{v_8d41d7('common.messages.loading')}</Text>

          </View>

        </View>

      )}

      {}
      {v_00832d != null && (
        <WalletKeyPinSetupModal
          memberId={v_00832d.memberId}
          email={v_00832d.email}
          visible={v_25fba6}
          onSuccess={() => {
            v_f4280a(false);
            v_b51724(null);
          }}
        />
      )}

    </View>

  );

};

const v_d81136 = v_472849.create({

  container: {
    ...v_a61db3.container,

  },

  statusBar: {

    height: 44,

    backgroundColor: '#FFFFFF',

    justifyContent: 'center',

    paddingHorizontal: 21,

  },

  statusBarContent: {

    flexDirection: 'row',

    justifyContent: 'space-between',

    alignItems: 'center',

  },

  timeContainer: {

  },

  mapContainer: {

    flex: 1,

    position: 'relative',

  },

  map: {

    flex: 1,

    width: '100%',

    height: '100%',

  },

  mapPlaceholder: {

    flex: 1,

    backgroundColor: '#F8F8F8',

  },

  mapPinButton: {
    position: 'absolute',
    top: 26,
    right: 16,
    width: 35,
    height: 35,
    alignItems: 'center',
    justifyContent: 'center',
  },

  mapPinIcon: {
    width: 40,
    height: 40,
  },

  topLogo: {
    position: 'absolute',
    top: 32,
    left: 8,
    width: v_700696.get('window').width / 4,
    height: v_700696.get('window').width / 4,
    zIndex: 10, 
    alignItems: 'center',
    justifyContent: 'center',
  },

  calloutPopup: {

    position: 'absolute',

    zIndex: 1000,

    pointerEvents: 'box-none',

  },

  calloutContainer: {

    backgroundColor: 'white',

    borderColor: '#ffdc04',

    borderWidth: 5,

    flexDirection: 'row',

    width: 220,

    minHeight: 70,

    paddingVertical: 8,

    paddingHorizontal: 10,

    borderRadius: 15,

    alignItems: 'center',

    elevation: 10,

    shadowColor: '#000',

    shadowOffset: { width: 0, height: 2 },

    shadowOpacity: 0.25,

    shadowRadius: 3.84,

  },

  calloutLeft: {
    justifyContent: 'space-between',
    marginLeft: 0,
  },

  calloutImage: {
    marginLeft: 4,
    width: 32,
    height: 32,
  },

  calloutDistance: {
    fontSize: v_843035.size.small,
    fontFamily: 'Roboto-Regular',
    color: 'black',
    textAlign: 'center',
    marginBottom: 2,
  },

  calloutRight: {
    paddingLeft: 10,
    flex: 1,
    justifyContent: 'flex-end',
  },

  calloutBrand: {
    fontSize: v_843035.size.small,
    fontFamily: 'Roboto-Medium',
    color: 'black',
  },

  markerImageContainer: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },

  markerImage: {
    width: 20,
    height: 20,
  },

  defaultMarker: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#ff0000',
    borderWidth: 2,
    borderColor: '#ffffff',
  },

  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999, 
  },
  loadingContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 120,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    fontFamily: 'Roboto-Medium',
    color: '#10192d',
  },

});

