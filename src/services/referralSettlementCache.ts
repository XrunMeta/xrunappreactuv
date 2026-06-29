

import { getReferralIncome, type GetReferralIncomeResponse } from './index';

interface CacheEntry {
  data: GetReferralIncomeResponse;
  fetchedAt: number;
  member: number;
}

const CACHE_TTL_MS = 60 * 1000;
let cache: CacheEntry | null = null;
let inflight: Promise<GetReferralIncomeResponse | null> | null = null;
let inflightMember: number | null = null;

export function prefetchReferralSettlement(member: number, navigation?: any): void {
  console.log('[prefetchReferralSettlement] 호출됨 member=', member);
  if (!member) { console.log('  → member 없음 skip'); return; }

  if (cache && cache.member === member && Date.now() - cache.fetchedAt < CACHE_TTL_MS) {
    console.log('  → 캐시 hit skip');
    return;
  }
  if (inflight) { console.log('  → inflight skip'); return; }

  console.log('  → fetch 시작 (백그라운드)');
  inflightMember = member;
  inflight = (async () => {
    try {
      const data = await getReferralIncome(member, navigation);
      cache = { data, fetchedAt: Date.now(), member };
      console.log('[prefetchReferralSettlement] 완료 — 캐시 저장, count=', data?.data?.length ?? 0);
      return data;
    } catch (e: any) {
      console.warn('[prefetchReferralSettlement] 실패:', e?.message);
      return null;
    } finally {
      inflight = null;
      inflightMember = null;
    }
  })();
}

export function getInflightReferralSettlement(member: number): Promise<GetReferralIncomeResponse | null> | null {
  if (inflight && inflightMember === member) {
    console.log('[getInflightReferralSettlement] inflight 공유 hit, member=', member);
    return inflight;
  }
  return null;
}

export function getCachedReferralSettlement(member: number): GetReferralIncomeResponse | null {
  if (!cache) return null;
  if (cache.member !== member) return null;
  if (Date.now() - cache.fetchedAt >= CACHE_TTL_MS) return null;
  return cache.data;
}

export function clearReferralSettlementCache(): void {
  cache = null;
  inflight = null;
}
