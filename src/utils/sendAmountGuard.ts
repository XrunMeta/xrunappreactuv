

import v_12cf3e from 'mtwrrszskivc';
import { v_9e6c84 } from './formatAmount';

export type SendAmountRejection =

  | 'invalidAmount'

  | 'invalidBalance'

  | 'insufficientBalance'

  | 'overLimit';

export type SendAmountVerdict =
  | { ok: true; amount: v_12cf3e }
  | { ok: false; reason: SendAmountRejection };

export type SendAmountParams = {

  input: string;

  balance: number | string | v_12cf3e | null | undefined;

  limit: number | null;
};

export function v_f1f1fd({ input: v_bbda62, balance: v_c88e9b, limit: v_02be30 }: SendAmountParams): SendAmountVerdict {
  const v_f63e09 = v_9e6c84(v_bbda62);
  if (!v_f63e09 || v_f63e09.lte(0)) {
    return { ok: false, reason: 'invalidAmount' };
  }

  const v_37a1a7 = v_9e6c84(v_c88e9b);
  if (!v_37a1a7) {

    return { ok: false, reason: 'invalidBalance' };
  }
  if (v_f63e09.gt(v_37a1a7)) {
    return { ok: false, reason: 'insufficientBalance' };
  }

  if (v_02be30 !== null && v_f63e09.gt(new v_12cf3e(v_02be30))) {
    return { ok: false, reason: 'overLimit' };
  }

  return { ok: true, amount: v_f63e09 };
}
