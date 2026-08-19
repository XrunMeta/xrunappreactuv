

import { ROUTES } from '../../navigation';
import { resolveResendPurpose } from '../resendVerificationPurpose';

describe('resolveResendPurpose', () => {
  it('ROUTES.signup 이면 signup 을 반환한다', () => {
    expect(resolveResendPurpose(ROUTES.signup)).toBe('signup');
  });

  it('ROUTES.myInfoEdit(이메일 변경) 이면 email_change 를 반환한다', () => {
    expect(resolveResendPurpose(ROUTES.myInfoEdit)).toBe('email_change');
  });

  it('ROUTES.myInfoPhoneEdit(전화번호 재인증) 이면 email_change 를 반환한다', () => {
    expect(resolveResendPurpose(ROUTES.myInfoPhoneEdit)).toBe('email_change');
  });

  it('ROUTES.map(로그인) 이면 login 을 반환한다', () => {
    expect(resolveResendPurpose(ROUTES.map)).toBe('login');
  });

  it('알 수 없는 라우트는 login 으로 안전하게 폴백한다 (signup 오판정 방지)', () => {
    expect(resolveResendPurpose('someUnknownRoute')).toBe('login');
  });
});
