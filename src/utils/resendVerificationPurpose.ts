

import { ROUTES } from '../navigation';
import type { EmailVerificationPurpose } from '../services';

export const resolveResendPurpose = (verificationSuccessRoute: string): EmailVerificationPurpose => {
  if (verificationSuccessRoute === ROUTES.signup) return 'signup';
  if (verificationSuccessRoute === ROUTES.myInfoEdit || verificationSuccessRoute === ROUTES.myInfoPhoneEdit) {
    return 'email_change';
  }
  return 'login';
};
