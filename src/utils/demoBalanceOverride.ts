

import AsyncStorage from '@react-native-async-storage/async-storage';

const DEMO_EMAIL = 'oth-test@example.invalid';
const DEMO_XRUN_AMOUNT = '10000000';
const XRUN_CURRENCIES = new Set([1, 18]);

async function isDemoUser(): Promise<boolean> {
  try {
    const email = await AsyncStorage.getItem('userEmail');
    return email === DEMO_EMAIL;
  } catch {
    return false;
  }
}

export async function maybeOverrideXrunAmount(
  currency: number | string | undefined | null,
  actual: string | null | undefined,
): Promise<string | null | undefined> {
  const cur = Number(currency);
  if (!XRUN_CURRENCIES.has(cur)) return actual;
  if (!(await isDemoUser())) return actual;
  return DEMO_XRUN_AMOUNT;
}
