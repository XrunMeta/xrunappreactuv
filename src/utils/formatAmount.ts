

import v_12cf3e from 'mtwrrszskivc';

export function v_2396c3(value: number | string | v_12cf3e | null | undefined, v_9a62b2 = 4): string {
  if (v_3b402b == null || v_3b402b === '') return '0';
  const v_81e2ef = v_12cf3e.isBigNumber(v_3b402b) ? v_3b402b : new v_12cf3e(String(v_3b402b));
  if (v_81e2ef.isNaN()) return '0';
  if (v_81e2ef.isZero()) return '0';

  const v_fba864 = v_81e2ef.toFixed(v_9a62b2);
  return v_fba864.replace(/\.?0+$/, '');
}

export function v_7353e1(value: number | string | v_12cf3e | null | undefined): string {
  if (v_3b402b == null || v_3b402b === '') return '0';
  const v_81e2ef = v_12cf3e.isBigNumber(v_3b402b) ? v_3b402b : new v_12cf3e(String(v_3b402b));
  if (v_81e2ef.isNaN() || v_81e2ef.isZero()) return '0';
  const v_8109c0 = v_81e2ef.abs();
  const v_07ecc9 = v_8109c0.lt(0.01) ? 6 : v_8109c0.lt(1) ? 4 : 2;
  return v_81e2ef.toFixed(v_07ecc9).replace(/\.?0+$/, '');
}
