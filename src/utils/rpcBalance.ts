

export interface RpcBalanceEntry {
  currency: number;
  address?: string;
  rpcAmount: string | null;
  status: string;
}

const v_ec4408 = [1, 2, 16, 18];

export function v_e830d4(v_a832b3): boolean {
  return typeof v_a832b3 === 'number' && v_ec4408.includes(v_a832b3);
}

export function v_480e99(
  v_a7f568,
  v_a832b3,
): string | null {
  if (!Array.isArray(v_a7f568)) return null;

  const v_715950 = v_a7f568.find((v_cb35cb) => Number(v_cb35cb?.currency) === Number(v_a832b3));
  if (!v_715950 || v_715950.status !== 'ok' || v_715950.rpcAmount === null || v_715950.rpcAmount === undefined) {
    return null;
  }

  return v_715950.rpcAmount;
}
