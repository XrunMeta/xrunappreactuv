

import BigNumber from 'bignumber.js';

function withThousandsCommas(str: string): string {
  if (!str) return str;
  const negative = str.startsWith('-');
  const body = negative ? str.slice(1) : str;
  const [intPart, decPart] = body.split('.');
  const intWithCommas = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  const result = decPart != null ? `${intWithCommas}.${decPart}` : intWithCommas;
  return negative ? `-${result}` : result;
}

function toBigNumber(value: number | string | BigNumber): BigNumber {
  if (BigNumber.isBigNumber(value)) return value;
  const raw = typeof value === 'string' ? value.replace(/,/g, '') : String(value);
  return new BigNumber(raw);
}

export function parseAmount(value: number | string | BigNumber | null | undefined): BigNumber | null {
  if (value == null) return null;
  if (typeof value === 'string' && value.trim() === '') return null;
  const v = toBigNumber(value);
  return v.isNaN() ? null : v;
}

export function fmtAmount(value: number | string | BigNumber | null | undefined, maxDecimals = 4): string {
  if (value == null || value === '') return '0';
  const v = toBigNumber(value);
  if (v.isNaN()) return '0';
  if (v.isZero()) return '0';
  const str = v.toFixed(maxDecimals).replace(/\.?0+$/, '');
  return withThousandsCommas(str);
}

export function fmtBalance(value: number | string | BigNumber | null | undefined): string {
  if (value == null || value === '') return '0';
  const v = toBigNumber(value);
  if (v.isNaN() || v.isZero()) return '0';
  const abs = v.abs();
  const decimals = abs.lt(0.01) ? 6 : abs.lt(1) ? 4 : 2;
  const str = v.toFixed(decimals).replace(/\.?0+$/, '');
  return withThousandsCommas(str);
}
