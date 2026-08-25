

import { getEnv } from '../utils/env';

export interface AfterlifeReceivedGift {
  giftId: string;
  name: string;
  emoji: string;
  imageUrl: string | null;
  count: number;
  totalReceived: number;
  xrunPerItem: number; 
}

export interface AfterlifeReceivedGiftsResponse {
  items: AfterlifeReceivedGift[];
  userFound: boolean;
}

export interface AfterlifeRedeemResponse {
  ok: boolean;
  giftId: string;
  xrunCredited: number; 
  xrunAmount: number;   
}

function getAfterlifeApiBase(): string {
  const env = getEnv();
  const stage = String((env as any)?.EXPO_PUBLIC_API_ENV ?? '').toLowerCase();
  if (stage === 'production') return 'https://oth-path.afterlife.app';
  return 'https://edge-alt-preview.example.invalid';
}

function getBridgeSecret(): string {
  const env = getEnv();
  return String((env as any)?.EXPO_PUBLIC_AFTERLIFE_BRIDGE_SECRET ?? '');
}

async function bridgeFetch(path: string, init?: RequestInit): Promise<Response> {
  const url = getAfterlifeApiBase() + path;
  const secret = getBridgeSecret();
  const headers: Record<string, string> = {
    'X-Xrun-Bridge-Secret': secret,
    ...(init?.headers as Record<string, string> | undefined),
  };
  if (init?.body) headers['Content-Type'] = 'application/json';
  return fetch(url, { ...init, headers });
}

export async function fetchAfterlifeReceivedGifts(
  email: string,
): Promise<AfterlifeReceivedGiftsResponse> {
  const res = await bridgeFetch(
    `/oth-path?email=${encodeURIComponent(email)}`,
    { method: 'GET' },
  );
  if (!res.ok) {
    throw new Error(`Afterlife bridge fetch 실패: ${res.status}`);
  }
  return (await res.json()) as AfterlifeReceivedGiftsResponse;
}

export async function redeemAfterlifeGiftWithAd(
  email: string,
  giftId: string,
): Promise<AfterlifeRedeemResponse> {
  const res = await bridgeFetch(`/oth-path`, {
    method: 'POST',
    body: JSON.stringify({ email, giftId }),
  });
  const json = (await res.json().catch(() => ({}))) as any;
  if (!res.ok || json?.ok === false) {
    const msg = json?.error?.message || json?.message || `HTTP ${res.status}`;
    throw new Error(msg);
  }
  return json as AfterlifeRedeemResponse;
}
