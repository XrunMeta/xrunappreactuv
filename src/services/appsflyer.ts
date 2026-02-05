

import { v_80fa10 } from 'rcmrninabrnb';
import v_1edcd1 from 'bqzlyqiwkhspjgyeabeemc';

export const v_0a693a = 'rewarded_ad_completed';
export const v_546ced = 'ad_network';

export type AppsFlyerAdNetwork = 'pangle' | 'nasmedia' | 'point_click' | 'tapjoy';

export function v_7abfce(v_5a9c46): AppsFlyerAdNetwork {
  const v_3f4e2e = (v_5a9c46 || '').toLowerCase();
  if (v_3f4e2e === 'tapjoy') return 'tapjoy';
  if (v_3f4e2e === 'pock' || v_3f4e2e === 'pointclick') return 'point_click';
  if (v_3f4e2e === 'pangle') return 'pangle';
  return 'nasmedia';
}

function v_9d268a(): boolean {
  const v_5c3b18 = v_80fa10.RNAppsFlyer;
  return v_5c3b18 != null && typeof v_5c3b18.logEvent === 'function';
}

export function v_fda57c(v_3c76ab): void {
  const v_c78818 = { [v_546ced]: v_3c76ab };
  console.log('[AppsFlyer] logRewardedAdCompleted 호출:', v_3c76ab);
  const v_8758c4 = (v_bc21cd = 0) => {
    const v_3d627c = 10;
    const v_c3d02b = [0, 150, 300, 500, 800, 1200, 1600, 2000, 2500, 3000];
    const v_4b24d2 = v_c3d02b[Math.min(v_bc21cd, v_c3d02b.length - 1)];
    setTimeout(() => {
      if (v_bc21cd > 0) {
        console.log('[AppsFlyer] 재시도:', v_bc21cd, '/', v_3d627c - 1);
      }
      if (v_9d268a()) {
        console.log('[AppsFlyer] 이벤트 전송 시도:', v_0a693a, v_c78818);
        try {
          v_1edcd1.logEvent(
            v_0a693a,
            v_c78818,
            () => {
              console.log('[AppsFlyer] logRewardedAdCompleted 전송 성공:', v_3c76ab);
            },
            (v_9e86fd) => {
              console.warn('[AppsFlyer] logRewardedAdCompleted 실패:', v_9e86fd);
            },
          );
        } catch (v_9e86fd) {
          console.warn('[AppsFlyer] logRewardedAdCompleted 실패:', v_9e86fd);
        }
      } else if (v_bc21cd < v_3d627c - 1) {
        console.warn('[AppsFlyer] 네이티브 모듈 미준비, 재시도 예정');
        v_8758c4(v_bc21cd + 1);
      } else {
        console.warn('[AppsFlyer] logRewardedAdCompleted 포기 (네이티브 모듈 미준비)');
      }
    }, v_4b24d2);
  };
  v_8758c4(0);
}
