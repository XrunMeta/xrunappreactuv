

import { v_ce4741 } from '../navigation';
import type { v_f0e370 } from '../services';

export const v_1d18c9 = (v_e6976c): v_f0e370 => {
  if (v_e6976c === v_ce4741.signup) return 'signup';
  if (v_e6976c === v_ce4741.myInfoEdit || v_e6976c === v_ce4741.myInfoPhoneEdit) {
    return 'email_change';
  }
  return 'login';
};
