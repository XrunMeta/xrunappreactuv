

const v_0728ac = new Set<string>([
  'oth-user@example.invalid',
  'oth-test@example.invalid',

  'oth-user@example.invalid',
  'oth-user@example.invalid',
  'oth-user@example.invalid',
]);

export function v_ef924b(v_e0c7e8): boolean {
  if (!v_e0c7e8) return false;
  return v_0728ac.has(v_e0c7e8.trim().toLowerCase());
}
