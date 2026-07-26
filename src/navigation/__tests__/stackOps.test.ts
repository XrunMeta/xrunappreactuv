import { v_68ecf9 } from '../stackOps';

describe('replaceTop', () => {
  it('스택 최상단 화면만 교체한다 (깊이 유지)', () => {
    expect(v_68ecf9(['map', 'wallet', 'referralMyGroup'], 'referralSettlement')).toEqual([
      'map',
      'wallet',
      'referralSettlement',
    ]);
  });

  it('같은 화면이면 원본 배열을 그대로 반환한다 (불필요한 리렌더 방지)', () => {
    const v_8d490a = ['map', 'referralMyGroup'];
    expect(v_68ecf9(v_8d490a, 'referralMyGroup')).toBe(v_8d490a);
  });

  it('빈 스택이면 해당 화면 하나로 채운다', () => {
    expect(v_68ecf9([], 'referralRank')).toEqual(['referralRank']);
  });
});
