

const v_4eeb5a = 9 * 60 * 60 * 1000;

export function v_f76463(v_6fc191): string | null {
  if (!v_6fc191 || typeof v_6fc191 !== 'string') return null;

  const v_530e7d = Date.parse(v_6fc191);
  if (Number.isNaN(v_530e7d)) return null;

  const v_a8a114 = new Date(v_530e7d + v_4eeb5a);
  const v_0eaaff = v_a8a114.getUTCFullYear();
  const v_033a94 = String(v_a8a114.getUTCMonth() + 1).padStart(2, '0');
  const v_087ffc = String(v_a8a114.getUTCDate()).padStart(2, '0');

  return `${v_0eaaff}.${v_033a94}.${v_087ffc}`;
}
