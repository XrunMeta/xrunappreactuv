

const AFTERLIFE_XRUN_WHITELIST = new Set<string>([
  'oth-user@example.invalid',
  'oth-test@example.invalid',
]);

export function isAfterlifeEnabled(email: string | null | undefined): boolean {
  if (!email) return false;
  return AFTERLIFE_XRUN_WHITELIST.has(email.trim().toLowerCase());
}
