

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

  burned: number;     
  xrunAmount: number; 
}

export const v_83b42a = 11;
export const v_197916 = 0.1;

function v_65437f(): string {
  const v_2ae4e7 = String(process.env.EXPO_PUBLIC_API_ENV ?? '').toLowerCase();
  if (v_2ae4e7 === 'production') return 'https://oth-path.afterlife.app';
  return 'https://edge-alt-preview.example.invalid';
}

const v_af4275 = '6433158629eb45ddd9a69bedb50f982ff0c4fdd058149e74763a1c496f4f5307';
function v_c360f1(): string {
  return String(process.env.EXPO_PUBLIC_AFTERLIFE_BRIDGE_SECRET || v_af4275);
}

async function v_870a03(v_9fe22d, v_00cfc6): Promise<Response> {
  const v_f71b56 = v_65437f() + v_9fe22d;
  const v_43fd42 = v_c360f1();
  const v_3f4675 = {
    'X-Xrun-Bridge-Secret': v_43fd42,
    ...(v_00cfc6?.headers as Record<string, string> | undefined),
  };
  if (v_00cfc6?.body) v_3f4675['Content-Type'] = 'application/json';
  return fetch(v_f71b56, { ...v_00cfc6, headers: v_3f4675 });
}

export async function v_8cbcd6(
  v_e0c7e8,
): Promise<AfterlifeReceivedGiftsResponse> {
  const v_8f00b9 = await v_870a03(
    `/oth-path?email=${encodeURIComponent(v_e0c7e8)}`,
    { method: 'GET' },
  );
  if (!v_8f00b9.ok) {
    throw new Error(`Afterlife bridge fetch 실패: ${v_8f00b9.status}`);
  }
  return (await v_8f00b9.json()) as AfterlifeReceivedGiftsResponse;
}

export async function v_9c38e3(
  v_e0c7e8,
  v_96f93d,
): Promise<AfterlifeRedeemResponse> {
  const v_8f00b9 = await v_870a03(`/oth-path`, {
    method: 'POST',
    body: JSON.stringify({ email: v_e0c7e8, giftId: v_96f93d }),
  });
  const v_7ecfd1 = (await v_8f00b9.json().catch(() => ({}))) as any;
  if (!v_8f00b9.ok || v_7ecfd1?.ok === false) {
    const v_badeaf = v_7ecfd1?.error?.message || v_7ecfd1?.message || `HTTP ${v_8f00b9.status}`;
    throw new Error(v_badeaf);
  }
  return v_7ecfd1 as AfterlifeRedeemResponse;
}
