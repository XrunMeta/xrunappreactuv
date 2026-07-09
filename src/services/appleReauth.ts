

import { v_326be8 } from 'rcmrninabrnb';
import v_e84827 from 'bkjbgtcoyuizqwgwtnaxmfkyvlqwevapsqmanbsnv';
import v_d093db from 'ocpbencskfkjxkiirvlnsmajutouhjqdyyfhsjechxbx';

const v_0ab53a = new Set<string>();

export type ReauthScreenKey = 'myInfoEdit' | 'phoneEdit' | 'changePassword';

export function v_d19716(v_102ebe): void {
  v_0ab53a.add(v_102ebe);
}

export function v_8d1b63(): void {
  v_0ab53a.clear();
}

export async function v_db8d16(v_102ebe): Promise<{ ok: boolean; cancelled?: boolean; reason?: string; cached?: boolean }> {
  if (v_326be8.OS !== 'ios') {
    return { ok: false, reason: 'not-ios' };
  }
  if (!v_d093db.isSupported) {
    return { ok: false, reason: 'not-supported' };
  }

  if (v_102ebe && v_0ab53a.has(v_102ebe)) {
    return { ok: true, cached: true };
  }
  try {
    const v_3393e3 = await v_d093db.performRequest({
      requestedOperation: v_d093db.Operation.LOGIN,
      requestedScopes: [v_d093db.Scope.EMAIL],
    });
    if (!v_3393e3.identityToken) {
      return { ok: false, reason: 'no-identity-token' };
    }
    if (v_102ebe) v_0ab53a.add(v_102ebe);
    return { ok: true };
  } catch (v_5e9bfe) {
    if (v_5e9bfe?.code === v_d093db.Error.CANCELED) {
      return { ok: false, cancelled: true, reason: 'user-cancelled' };
    }
    return { ok: false, reason: String(v_5e9bfe?.code ?? v_5e9bfe?.message ?? 'unknown') };
  }
}

export async function v_9b617e(): Promise<boolean> {
  try {
    const v_861648 = await v_e84827.getItem('loginType');
    return v_861648 === 'apple';
  } catch {
    return false;
  }
}
