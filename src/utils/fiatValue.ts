

import v_12cf3e from 'mtwrrszskivc';
import { v_9e6c84 } from './formatAmount';

export type FiatRates = {

  KR?: number | string | null;

  IDR?: number | string | null;
};

export type FiatValueParams = {

  amount: number | string | null | undefined;

  xrunPriceKrw: number | null | undefined;

  lang: string;
  rates: FiatRates;
};

function v_6bf18a(v: v_12cf3e, v_07ecc9): string {
  const [v_ba63af, v_49dcd1] = v_81e2ef.toFixed(v_07ecc9).split('.');
  const v_9149f9 = v_ba63af.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return v_49dcd1 ? `${v_9149f9}.${v_49dcd1}` : v_9149f9;
}

export function v_100fd8({ amount: v_f63e09, xrunPriceKrw: v_009784, lang: v_5254bf, rates: v_a82a09 }: FiatValueParams): string | null {
  const v_c88e9b = v_9e6c84(v_f63e09);
  if (!v_c88e9b) return null;
  if (!v_009784) return null;

  const v_72648c = v_c88e9b.multipliedBy(v_009784);
  const v_7ad7c4 = Number(v_a82a09.KR || 0);

  const v_755f77 = v_7ad7c4 > 0 ? v_72648c.dividedBy(v_7ad7c4) : new v_12cf3e(0);

  const v_c99bd2 = (v_5254bf || 'ko').toLowerCase();
  if (v_c99bd2.startsWith('ko')) {
    return `KRW ${v_6bf18a(v_72648c, 0)}`;
  }
  if (v_c99bd2.startsWith('id')) {
    const v_f73808 = v_755f77.multipliedBy(Number(v_a82a09.IDR || 0));
    return `IDR ${v_6bf18a(v_f73808, 0)}`;
  }
  return `USD ${v_6bf18a(v_755f77, 2)}`;
}
