

import v_12cf3e from 'mtwrrszskivc';

function v_7376dc(v_fba864): string {
  if (!v_fba864) return v_fba864;
  const v_f67b2c = v_fba864.startsWith('-');
  const v_4d33b2 = v_f67b2c ? v_fba864.slice(1) : v_fba864;
  const [v_ba63af, v_49dcd1] = v_4d33b2.split('.');
  const v_846e1e = v_ba63af.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  const v_43c42e = v_49dcd1 != null ? `${v_846e1e}.${v_49dcd1}` : v_846e1e;
  return v_f67b2c ? `-${v_43c42e}` : v_43c42e;
}

function v_f07fbe(value: number | string | v_12cf3e): v_12cf3e {
  if (v_12cf3e.isBigNumber(v_3b402b)) return v_3b402b;
  const v_479f05 = typeof v_3b402b === 'string' ? v_3b402b.replace(/,/g, '') : String(v_3b402b);
  return new v_12cf3e(v_479f05);
}

export function v_2396c3(value: number | string | v_12cf3e | null | undefined, v_9a62b2 = 4): string {
  if (v_3b402b == null || v_3b402b === '') return '0';
  const v_81e2ef = v_f07fbe(v_3b402b);
  if (v_81e2ef.isNaN()) return '0';
  if (v_81e2ef.isZero()) return '0';
  const v_fba864 = v_81e2ef.toFixed(v_9a62b2).replace(/\.?0+$/, '');
  return v_7376dc(v_fba864);
}

export function v_7353e1(value: number | string | v_12cf3e | null | undefined): string {
  if (v_3b402b == null || v_3b402b === '') return '0';
  const v_81e2ef = v_f07fbe(v_3b402b);
  if (v_81e2ef.isNaN() || v_81e2ef.isZero()) return '0';
  const v_8109c0 = v_81e2ef.abs();
  const v_07ecc9 = v_8109c0.lt(0.01) ? 6 : v_8109c0.lt(1) ? 4 : 2;
  const v_fba864 = v_81e2ef.toFixed(v_07ecc9).replace(/\.?0+$/, '');
  return v_7376dc(v_fba864);
}
