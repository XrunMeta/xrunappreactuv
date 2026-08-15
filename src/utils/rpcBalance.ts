

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

const v_d6ba98 = 5100;

export function v_7f00b6(v_1e6eca): number[] {
  if (!Array.isArray(v_1e6eca)) return [];
  const v_8d4337 = [];
  for (const v_9e86fd of v_1e6eca) {
    const v_c3bc75 = Number(v_9e86fd?.currency);
    if (!v_e830d4(v_c3bc75)) continue;
    if (v_9e86fd?.status !== 'ok' || v_9e86fd.rpcAmount === null || v_9e86fd.rpcAmount === undefined) continue;
    if (!v_8d4337.includes(v_c3bc75)) v_8d4337.push(v_c3bc75);
  }
  return v_8d4337;
}

export interface MergeRpcBalancesResult<T> {

  cards: T[];

  okCurrencies: number[];
}

export function v_bd4c8c<T extends { currency: number | string; subcurrency?: number | null; amount?: any; Wamount?: any }>(
  v_4552ca,
  v_1e6eca,
): MergeRpcBalancesResult<T> {
  if (!Array.isArray(v_4552ca) || !Array.isArray(v_1e6eca) || v_1e6eca.length === 0) {
    return { cards: v_4552ca, okCurrencies: [] };
  }

  const v_51007b = new Map<number, string>();
  for (const v_9e86fd of v_1e6eca) {
    const v_c3bc75 = Number(v_9e86fd?.currency);
    if (!v_e830d4(v_c3bc75)) continue;
    if (v_9e86fd?.status !== 'ok' || v_9e86fd.rpcAmount === null || v_9e86fd.rpcAmount === undefined) continue;
    v_51007b.set(v_c3bc75, v_9e86fd.rpcAmount);
  }
  if (v_51007b.size === 0) return { cards: v_4552ca, okCurrencies: [] };
  const v_8cab55 = Array.from(v_51007b.keys());

  let v_40eb63 = false;
  const v_a448ad = v_4552ca.map((v_8c0b26) => {
    const v_c3bc75 = Number(v_8c0b26?.currency);
    if (!v_51007b.has(v_c3bc75)) return v_8c0b26;
    if (Number(v_8c0b26?.subcurrency) === v_d6ba98) return v_8c0b26;

    const v_b97674 = v_51007b.get(v_c3bc75)!;
    if (String(v_8c0b26?.amount) === v_b97674) return v_8c0b26;

    v_40eb63 = true;
    return { ...v_8c0b26, Wamount: v_b97674, amount: v_b97674 };
  });

  return { cards: v_40eb63 ? v_a448ad : v_4552ca, okCurrencies: v_8cab55 };
}
