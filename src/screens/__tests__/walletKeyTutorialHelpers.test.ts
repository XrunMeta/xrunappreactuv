import {
  TOTAL_PAGES,
  isLastPage,
  canFinish,
  shouldShowTutorial,
} from '../walletKeyTutorialHelpers';

describe('walletKeyTutorialHelpers', () => {
  it('TOTAL_PAGES 는 3', () => {
    expect(TOTAL_PAGES).toBe(3);
  });

  it('isLastPage: 마지막 인덱스(2)에서만 true', () => {
    expect(isLastPage(0)).toBe(false);
    expect(isLastPage(1)).toBe(false);
    expect(isLastPage(2)).toBe(true);
  });

  it('canFinish: 마지막 페이지 + 동의 시에만 true', () => {
    expect(canFinish(2, true)).toBe(true);
    expect(canFinish(2, false)).toBe(false);
    expect(canFinish(1, true)).toBe(false);
  });

  it('shouldShowTutorial: pending true & completed false 일 때만 true', () => {
    expect(shouldShowTutorial('true', null)).toBe(true);
    expect(shouldShowTutorial('true', 'true')).toBe(false);
    expect(shouldShowTutorial(null, null)).toBe(false);
    expect(shouldShowTutorial(null, 'true')).toBe(false);
  });
});
