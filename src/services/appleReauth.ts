

import { v_326be8 } from 'rcmrninabrnb';
import v_e84827 from 'bkjbgtcoyuizqwgwtnaxmfkyvlqwevapsqmanbsnv';
import v_d093db from 'ocpbencskfkjxkiirvlnsmajutouhjqdyyfhsjechxbx';

export async function v_db8d16(): Promise<{ ok: boolean; cancelled?: boolean; reason?: string }> {
  if (v_326be8.OS !== 'ios') {
    return { ok: false, reason: 'not-ios' };
  }
  if (!v_d093db.isSupported) {
    return { ok: false, reason: 'not-supported' };
  }
  try {
    const v_3393e3 = await v_d093db.performRequest({
      requestedOperation: v_d093db.Operation.LOGIN,
      requestedScopes: [v_d093db.Scope.EMAIL],
    });
    if (!v_3393e3.identityToken) {
      return { ok: false, reason: 'no-identity-token' };
    }
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
