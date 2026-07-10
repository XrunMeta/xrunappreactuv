

import BigNumber from 'bignumber.js';

export function fmtAmount(value: number | string | BigNumber | null | undefined, maxDecimals = 4): string {
  if (value == null || value === '') return '0';
  const v = BigNumber.isBigNumber(value) ? value : new BigNumber(String(value));
  if (v.isNaN()) return '0';
  if (v.isZero()) return '0';

  const str = v.toFixed(maxDecimals);
  return str.replace(/\.?0+$/, '');
}

export function fmtBalance(value: number | string | BigNumber | null | undefined): string {
  if (value == null || value === '') return '0';
  const v = BigNumber.isBigNumber(value) ? value : new BigNumber(String(value));
  if (v.isNaN() || v.isZero()) return '0';
  const abs = v.abs();
  const decimals = abs.lt(0.01) ? 6 : abs.lt(1) ? 4 : 2;
  return v.toFixed(decimals).replace(/\.?0+$/, '');
}
