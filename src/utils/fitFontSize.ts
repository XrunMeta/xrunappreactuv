

const CHAR_EM: Record<string, number> = {
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

const FALLBACK_EM = 0.75;

export function measureTextEm(text: string): number {
  let sum = 0;
  for (const ch of text) sum += CHAR_EM[ch] ?? FALLBACK_EM;
  return sum;
}

export type FitFontSizeParams = {
  text: string;

  availableWidth: number;
  maxFontSize: number;
  minFontSize: number;

  letterSpacing?: number;
};

export function fitFontSize({
  text,
  availableWidth,
  maxFontSize,
  minFontSize,
  letterSpacing = 0,
}: FitFontSizeParams): number {
  if (!text || !(availableWidth > 0)) return maxFontSize;

  const em = measureTextEm(text);
  if (em <= 0) return maxFontSize;

  const spacing = letterSpacing * [...text].length;
  const fitted = Math.floor((availableWidth - spacing) / em);

  return Math.max(minFontSize, Math.min(maxFontSize, fitted));
}
