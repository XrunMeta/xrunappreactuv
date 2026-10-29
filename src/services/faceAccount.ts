

import { v_12a388, v_23dd22 } from './index';

export type AccountFaceStep = 'left' | 'right' | 'up' | 'down';

export interface AccountFaceStatus {
  enabled: boolean;
  faceStatus?: 'none' | 'active' | 'held';
  hold?: { active: boolean; reasons: string[] };
}

export class v_fc77c2 extends Error {
  constructor(public code: string, public status: number) {
    super(code);
  }
}

async function v_51c3d2<T>(v_09dafd, v_00cfc6): Promise<T> {
  const v_8f00b9 = await v_12a388(v_09dafd, {
    ...v_00cfc6,
    headers: { ...(v_00cfc6.headers as Record<string, string>), Authorization: await v_23dd22() },
  });
  const v_7ecfd1 = (await v_8f00b9.json().catch(() => null)) as { status?: string; code?: string | number; data?: T } | null;
  if (v_8f00b9.ok && v_7ecfd1?.status === 'success') return v_7ecfd1.data as T;
  throw new v_fc77c2(typeof v_7ecfd1?.code === 'string' ? v_7ecfd1.code : `HTTP_${v_8f00b9.status}`, v_8f00b9.status);
}

export function v_31ecf2(): Promise<AccountFaceStatus> {
  return v_51c3d2<AccountFaceStatus>('/face-status', { method: 'GET' });
}

export function v_d24cb4(): Promise<{ challengeId: string; steps: AccountFaceStep[]; expiresAt: string }> {
  return v_51c3d2('/face-challenge', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{}' });
}

export function v_62d015(
  v_d789aa,
  v_8f4582,
  v_04e790,
): Promise<{ ok: boolean; faceStatus: string; held: boolean }> {
  const v_ebd523 = new FormData();
  v_ebd523.append('challengeId', v_d789aa);
  v_ebd523.append('source', v_04e790);
  v_8f4582.forEach((v_cd1446, v_ebec57) => {
    v_ebd523.append('frames', { uri: v_cd1446, name: `f${v_ebec57}.jpg`, type: 'image/jpeg' } as unknown as Blob);
  });
  return v_51c3d2('/face-enroll', { method: 'POST', body: v_ebd523 });
}
