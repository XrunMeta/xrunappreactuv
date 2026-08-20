import { shouldShowTutorial } from '../walletKeyTutorialHelpers';

describe('홈 진입 가드 판단', () => {
  it('가입 직후(pending=true, completed=null) → 노출', () => {
    expect(shouldShowTutorial('true', null)).toBe(true);
  });

  it('완료 이력이 남아 있어도 pending 이면 노출', () => {
    expect(shouldShowTutorial('true', 'true')).toBe(true);
  });
  it('일반 진입(pending 없음) → 미노출', () => {
    expect(shouldShowTutorial(null, null)).toBe(false);
  });
});
