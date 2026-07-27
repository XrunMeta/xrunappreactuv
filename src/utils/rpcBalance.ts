

export interface RpcBalanceEntry {
  currency: number;
  address?: string;
  rpcAmount: string | null;
  status: string;
}

const RPC_CURRENCIES = [1, 2, 16, 18];

export function isRpcRefetchableCurrency(currency: number | undefined | null): boolean {
  return typeof currency === 'number' && RPC_CURRENCIES.includes(currency);
}

export function pickRpcBalance(
  results: RpcBalanceEntry[] | undefined | null,
  currency: number,
): string | null {
  if (!Array.isArray(results)) return null;

  const hit = results.find((r) => Number(r?.currency) === Number(currency));
  if (!hit || hit.status !== 'ok' || hit.rpcAmount === null || hit.rpcAmount === undefined) {
    return null;
  }

  return hit.rpcAmount;
}
