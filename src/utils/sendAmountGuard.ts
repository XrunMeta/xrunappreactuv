

import BigNumber from 'bignumber.js';
import { parseAmount } from './formatAmount';

export type SendAmountRejection =

  | 'invalidAmount'

  | 'invalidBalance'

  | 'insufficientBalance'

  | 'overLimit';

export type SendAmountVerdict =
  | { ok: true; amount: BigNumber }
  | { ok: false; reason: SendAmountRejection };

export type SendAmountParams = {

  input: string;

  balance: number | string | BigNumber | null | undefined;

  limit: number | null;
};

export function checkSendAmount({ input, balance, limit }: SendAmountParams): SendAmountVerdict {
  const amount = parseAmount(input);
  if (!amount || amount.lte(0)) {
    return { ok: false, reason: 'invalidAmount' };
  }

  const available = parseAmount(balance);
  if (!available) {

    return { ok: false, reason: 'invalidBalance' };
  }
  if (amount.gt(available)) {
    return { ok: false, reason: 'insufficientBalance' };
  }

  if (limit !== null && amount.gt(new BigNumber(limit))) {
    return { ok: false, reason: 'overLimit' };
  }

  return { ok: true, amount };
}
