import { v_235370 } from '../walletKeyTutorialHelpers';

describe('홈 진입 가드 판단', () => {
  it('가입 직후(pending=true, completed=null) → 노출', () => {
    expect(v_235370('true', null)).toBe(true);
  });
  it('이미 완료 → 미노출', () => {
    expect(v_235370('true', 'true')).toBe(false);
  });
  it('일반 진입(pending 없음) → 미노출', () => {
    expect(v_235370(null, null)).toBe(false);
  });
});
