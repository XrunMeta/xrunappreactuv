

import { v_2dc778, type v_55701f } from './index';

interface CacheEntry {
  data: v_55701f;
  fetchedAt: number;
  member: number;
}

const v_7478fc = 60 * 1000;
let v_a23604 = null;
let inflight: Promise<v_55701f | null> | null = null;
let v_ababc8 = null;

export function v_492864(v_660822, v_c65f5d): void {
  console.log('[prefetchReferralSettlement] 호출됨 member=', v_660822);
  if (!v_660822) { console.log('  → member 없음 skip'); return; }

  if (v_a23604 && v_a23604.member === v_660822 && Date.now() - v_a23604.fetchedAt < v_7478fc) {
    console.log('  → 캐시 hit skip');
    return;
  }
  if (v_d7fc78) { console.log('  → inflight skip'); return; }

  console.log('  → fetch 시작 (백그라운드)');
  v_ababc8 = v_660822;
  v_d7fc78 = (async () => {
    try {
      const v_9390e8 = await v_2dc778(v_660822, v_c65f5d);
      v_a23604 = { data: v_9390e8, fetchedAt: Date.now(), member: v_660822 };
      console.log('[prefetchReferralSettlement] 완료 — 캐시 저장, count=', v_9390e8?.data?.length ?? 0);
      return v_9390e8;
    } catch (v_9e86fd) {
      console.warn('[prefetchReferralSettlement] 실패:', v_9e86fd?.message);
      return null;
    } finally {
      v_d7fc78 = null;
      v_ababc8 = null;
    }
  })();
}

export function v_7ac54c(v_660822): Promise<v_55701f | null> | null {
  if (v_d7fc78 && v_ababc8 === v_660822) {
    console.log('[getInflightReferralSettlement] inflight 공유 hit, member=', v_660822);
    return v_d7fc78;
  }
  return null;
}

export function v_ca58e0(v_660822): v_55701f | null {
  if (!v_a23604) return null;
  if (v_a23604.member !== v_660822) return null;
  if (Date.now() - v_a23604.fetchedAt >= v_7478fc) return null;
  return v_a23604.data;
}

export function v_e755eb(): void {
  v_a23604 = null;
  v_d7fc78 = null;
}
