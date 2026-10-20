

import { v_7488d5 } from './index';

export interface AfterlifeReward {
  id: number;
  xrunAmount: string;
  giftName: string | null;
  qty: number | null;
  status: 'pending' | 'claimed';
  settleStatus: string | null;
  txHash: string | null;
  createdAt: string;
  claimedAt: string | null;
}

export interface AfterlifeRewardsResponse {
  pending: AfterlifeReward[];
  claimed: AfterlifeReward[];
  pendingTotal: number;
}

export async function v_925786(v_c65f5d): Promise<AfterlifeRewardsResponse> {
  const v_8f00b9 = await v_7488d5(v_c65f5d).get('/afterlife-rewards');
  const v_9390e8 = v_8f00b9.data?.data ?? {};
  return {
    pending: v_9390e8.pending ?? [],
    claimed: v_9390e8.claimed ?? [],
    pendingTotal: Number(v_9390e8.pendingTotal ?? 0),
  };
}

export async function v_921d50(v_389afb, v_c65f5d): Promise<AfterlifeReward | null> {
  const v_8f00b9 = await v_7488d5(v_c65f5d).post('/afterlife-rewards/claim', { id: v_389afb });
  return (v_8f00b9.data?.data ?? null) as AfterlifeReward | null;
}
