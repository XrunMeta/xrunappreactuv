

import v_e84827 from 'bkjbgtcoyuizqwgwtnaxmfkyvlqwevapsqmanbsnv';

import { v_d7d5a2 } from './index';
import { v_21ef1f } from './adison';

const v_c687f5 = [
  'isLoggedIn',
  'userEmail',
  'userData',
  'rageProgress',
  'userTickets',
  'rageProgressLastUpdate',
  'userSessionToken',
  'jwt',
  'appleSignupCompleted',
  'appleSignupCompletedEmail',
  'appleSignupRequired',
  'appleSignupEmail',
  'googleSignupRequired',
  'googleSignupEmail',
  'loginType',
  'appleEditInfoAlertShownAt',
];

export async function v_02d115(v_d136d6, v_c65f5d): Promise<void> {
  try {
    const v_479f05 = await v_e84827.getItem('userData');
    const v_660822 = v_479f05 ? Number(JSON.parse(v_479f05)?.member) : 0;
    if (v_660822) await v_d7d5a2(v_660822, v_c65f5d).catch((v_9e86fd) => console.warn('[afterlife-relogin] logout API 실패:', v_9e86fd));
  } catch (v_9e86fd) {
    console.warn('[afterlife-relogin] userData 읽기 실패:', v_9e86fd);
  }
  try { v_21ef1f(); } catch (v_37eab7) {}
  await v_e84827.multiRemove(v_c687f5).catch(() => {});
  if (v_d136d6 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v_d136d6)) {
    await v_e84827.setItem('pendingPrefillEmail', v_d136d6).catch(() => {});
  }
}
