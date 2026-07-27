import { replaceTop } from '../stackOps';

describe('replaceTop', () => {
  it('스택 최상단 화면만 교체한다 (깊이 유지)', () => {
    expect(replaceTop(['map', 'wallet', 'referralMyGroup'], 'referralSettlement')).toEqual([
      'map',
      'wallet',
      'referralSettlement',
    ]);
  });

  it('같은 화면이면 원본 배열을 그대로 반환한다 (불필요한 리렌더 방지)', () => {
    const stack = ['map', 'referralMyGroup'];
    expect(replaceTop(stack, 'referralMyGroup')).toBe(stack);
  });

  it('빈 스택이면 해당 화면 하나로 채운다', () => {
    expect(replaceTop([], 'referralRank')).toEqual(['referralRank']);
  });
});
