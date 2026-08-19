

import BigNumber from 'bignumber.js';
import { parseAmount } from './formatAmount';

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

function withCommas(v: BigNumber, decimals: number): string {
  const [intPart, decPart] = v.toFixed(decimals).split('.');
  const withSep = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return decPart ? `${withSep}.${decPart}` : withSep;
}

export function formatFiatValue({ amount, xrunPriceKrw, lang, rates }: FiatValueParams): string | null {
  const balance = parseAmount(amount);
  if (!balance) return null;
  if (!xrunPriceKrw) return null;

  const krw = balance.multipliedBy(xrunPriceKrw);
  const krwPerUsd = Number(rates.KR || 0);

  const usd = krwPerUsd > 0 ? krw.dividedBy(krwPerUsd) : new BigNumber(0);

  const code = (lang || 'ko').toLowerCase();
  if (code.startsWith('ko')) {
    return `KRW ${withCommas(krw, 0)}`;
  }
  if (code.startsWith('id')) {
    const idr = usd.multipliedBy(Number(rates.IDR || 0));
    return `IDR ${withCommas(idr, 0)}`;
  }
  return `USD ${withCommas(usd, 2)}`;
}
