

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

const AD_XRUN_SUBCURRENCY = 5100;

export function pickOkCurrencies(entries: RpcBalanceEntry[] | undefined | null): number[] {
  if (!Array.isArray(entries)) return [];
  const out: number[] = [];
  for (const e of entries) {
    const cur = Number(e?.currency);
    if (!isRpcRefetchableCurrency(cur)) continue;
    if (e?.status !== 'ok' || e.rpcAmount === null || e.rpcAmount === undefined) continue;
    if (!out.includes(cur)) out.push(cur);
  }
  return out;
}

export interface MergeRpcBalancesResult<T> {

  cards: T[];

  okCurrencies: number[];
}

export function mergeRpcBalances<T extends { currency: number | string; subcurrency?: number | null; amount?: any; Wamount?: any }>(
  cards: T[],
  entries: RpcBalanceEntry[] | undefined | null,
): MergeRpcBalancesResult<T> {
  if (!Array.isArray(cards) || !Array.isArray(entries) || entries.length === 0) {
    return { cards, okCurrencies: [] };
  }

  const byCurrency = new Map<number, string>();
  for (const e of entries) {
    const cur = Number(e?.currency);
    if (!isRpcRefetchableCurrency(cur)) continue;
    if (e?.status !== 'ok' || e.rpcAmount === null || e.rpcAmount === undefined) continue;
    byCurrency.set(cur, e.rpcAmount);
  }
  if (byCurrency.size === 0) return { cards, okCurrencies: [] };
  const okCurrencies = Array.from(byCurrency.keys());

  let changed = false;
  const next = cards.map((item) => {
    const cur = Number(item?.currency);
    if (!byCurrency.has(cur)) return item;
    if (Number(item?.subcurrency) === AD_XRUN_SUBCURRENCY) return item;

    const rpcAmt = byCurrency.get(cur)!;
    if (String(item?.amount) === rpcAmt) return item;

    changed = true;
    return { ...item, Wamount: rpcAmt, amount: rpcAmt };
  });

  return { cards: changed ? next : cards, okCurrencies };
}
