

const v_edc1f3 = {
  '0': 0.57373, '1': 0.57373, '2': 0.57373, '3': 0.57373, '4': 0.57373,
  '5': 0.57373, '6': 0.57373, '7': 0.57373, '8': 0.57373, '9': 0.57373,
  ',': 0.24609,
  '.': 0.29004,
  ' ': 0.24854,
  '-': 0.33301,
  X: 0.63477, R: 0.64063, U: 0.65918, N: 0.70557,
  P: 0.64453, O: 0.68945, L: 0.54102,
  E: 0.5625, T: 0.61963, H: 0.70605,
};

const v_9967aa = 0.75;

export function v_29269b(v_9b6134): number {
  let v_dce0a8 = 0;
  for (const v_10a17d of v_9b6134) v_dce0a8 += v_edc1f3[v_10a17d] ?? v_9967aa;
  return v_dce0a8;
}

export type FitFontSizeParams = {
  text: string;

  availableWidth: number;
  maxFontSize: number;
  minFontSize: number;

  letterSpacing?: number;
};

export function v_e1e4a1({
  text: v_9b6134,
  availableWidth: v_2f5c5c,
  maxFontSize: v_020617,
  minFontSize: v_38e4f9,
  letterSpacing: v_222d13 = 0,
}: FitFontSizeParams): number {
  if (!v_9b6134 || !(v_2f5c5c > 0)) return v_020617;

  const v_131f0d = v_29269b(v_9b6134);
  if (v_131f0d <= 0) return v_020617;

  const v_124ad6 = v_222d13 * [...v_9b6134].length;
  const v_b3e626 = Math.floor((v_2f5c5c - v_124ad6) / v_131f0d);

  return Math.max(v_38e4f9, Math.min(v_020617, v_b3e626));
}
