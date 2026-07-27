import { resolveBackAction } from '../backNavigationPolicy';

describe('resolveBackAction — 추천(referral) 화면', () => {
  it('헤더 뒤로가기: 스택이 남아있으면 이전 화면으로 돌아간다', () => {
    expect(
      resolveBackAction({ screen: 'referralMyGroup', canGoBack: true, source: 'header' }),
    ).toBe('goBack');
  });

  it('하드웨어 백키: 스택이 남아있으면 이전 화면으로 돌아간다', () => {
    expect(
      resolveBackAction({ screen: 'referralSettlement', canGoBack: true, source: 'hardware' }),
    ).toBe('goBack');
  });

  it('스택이 비어 있으면 맵으로 리셋한다', () => {
    expect(
      resolveBackAction({ screen: 'referralRank', canGoBack: false, source: 'hardware' }),
    ).toBe('resetMap');
  });
});

describe('resolveBackAction — 기존 화면 동작 유지', () => {
  it('지갑 화면은 스택이 있으면 뒤로가기', () => {
    expect(
      resolveBackAction({ screen: 'walletDetail', canGoBack: true, source: 'header' }),
    ).toBe('goBack');
  });

  it('마이페이지 화면은 스택이 없으면 맵으로 리셋', () => {
    expect(
      resolveBackAction({ screen: 'myInfoEdit', canGoBack: false, source: 'header' }),
    ).toBe('resetMap');
  });

  it('쇼핑 화면은 스택이 있어도 맵으로 리셋 (기존 정책 유지)', () => {
    expect(
      resolveBackAction({ screen: 'shopBuy', canGoBack: true, source: 'hardware' }),
    ).toBe('resetMap');
  });

  it('가입 튜토리얼은 하드웨어 백키를 차단한다', () => {
    expect(
      resolveBackAction({ screen: 'walletKeyTutorial', canGoBack: true, source: 'hardware' }),
    ).toBe('block');
  });

  it('그 외 화면 + 하드웨어 백키: 스택이 있으면 뒤로가기, 없으면 루트 종료 후보', () => {
    expect(resolveBackAction({ screen: 'shop', canGoBack: true, source: 'hardware' })).toBe(
      'resetMap',
    );
    expect(resolveBackAction({ screen: 'map', canGoBack: true, source: 'hardware' })).toBe(
      'goBack',
    );
    expect(resolveBackAction({ screen: 'map', canGoBack: false, source: 'hardware' })).toBe(
      'rootExit',
    );
  });

  it('그 외 화면 + 헤더 뒤로가기는 맵으로 리셋 (기존 정책 유지)', () => {
    expect(resolveBackAction({ screen: 'clauseDetail', canGoBack: true, source: 'header' })).toBe(
      'resetMap',
    );
  });
});
