import { v_29269b, v_e1e4a1 } from '../fitFontSize';

describe('measureTextEm', () => {
  it('실측한 문자열 폭과 일치한다 (Roboto-Bold, em 단위)', () => {

    expect(v_29269b('1,000,000 XRUN')).toBeCloseTo(7.39697, 3);
    expect(v_29269b('10,000,000 XRUN')).toBeCloseTo(7.9707, 3);
    expect(v_29269b('123,456,789.12 XRUN')).toBeCloseTo(9.98193, 3);
    expect(v_29269b('1,234,567,890.12 XRUN')).toBeCloseTo(10.80176, 3);
    expect(v_29269b('1.95 XRUN')).toBeCloseTo(4.8999, 3);
    expect(v_29269b('0.0856 POL')).toBeCloseTo(5.28223, 3);
  });

  it('숫자는 모두 같은 폭이다 (tabular)', () => {
    for (const v_d5dda0 of '0123456789') {
      expect(v_29269b(v_d5dda0)).toBeCloseTo(0.57373, 5);
    }
  });

  it('빈 문자열은 0', () => {
    expect(v_29269b('')).toBe(0);
  });

  it('모르는 문자는 기본 폭으로 친다 (0 으로 세지 않는다)', () => {

    expect(v_29269b('한')).toBeGreaterThan(0.5);
  });
});

describe('fitFontSize', () => {
  const v_ec02d1 = { maxFontSize: 32, minFontSize: 18, letterSpacing: -0.8 };

  it('짧은 값은 최대 크기를 그대로 쓴다', () => {
    expect(v_e1e4a1({ text: '1.95 XRUN', availableWidth: 223, ...v_ec02d1 })).toBe(32);
    expect(v_e1e4a1({ text: '0.0856 POL', availableWidth: 223, ...v_ec02d1 })).toBe(32);
  });

  it('🔴 넘치는 값은 줄인다 — 폭 320px 카드(가용 223px)', () => {

    expect(v_e1e4a1({ text: '1,000,000 XRUN', availableWidth: 223, ...v_ec02d1 })).toBeLessThan(32);
    expect(v_e1e4a1({ text: '10,000,000 XRUN', availableWidth: 223, ...v_ec02d1 })).toBeLessThan(32);
  });

  it('🔴 계산 결과가 실제로 가용 폭 안에 들어간다', () => {
    const v_0f1aa6 = [
      { text: '1,000,000 XRUN', availableWidth: 223 },
      { text: '10,000,000 XRUN', availableWidth: 223 },
      { text: '123,456,789.12 XRUN', availableWidth: 223 },
      { text: '1,234,567,890.12 XRUN', availableWidth: 223 },
      { text: '123,456,789.12 XRUN', availableWidth: 278 },
      { text: '1,234,567,890.12 XRUN', availableWidth: 293 },
    ];
    for (const v_3f4e2e of v_0f1aa6) {
      const v_05b441 = v_e1e4a1({ ...v_3f4e2e, ...v_ec02d1 });
      const v_2383a7 = v_29269b(v_3f4e2e.text) * v_05b441 + v_ec02d1.letterSpacing * v_3f4e2e.text.length;

      expect({ case: `"${v_3f4e2e.text}" @ ${v_3f4e2e.availableWidth}px`, fits: v_2383a7 <= v_3f4e2e.availableWidth })
        .toEqual({ case: `"${v_3f4e2e.text}" @ ${v_3f4e2e.availableWidth}px`, fits: true });
    }
  });

  it('넓은 화면에서는 줄이지 않는다', () => {
    expect(v_e1e4a1({ text: '10,000,000 XRUN', availableWidth: 333, ...v_ec02d1 })).toBe(32);
  });

  it('아무리 길어도 최소 크기 아래로는 안 내려간다', () => {
    const v_05b441 = v_e1e4a1({ text: '999,999,999,999,999.99 XRUN', availableWidth: 100, ...v_ec02d1 });
    expect(v_05b441).toBe(18);
  });

  it('폭을 아직 모르면(0 · 음수) 최대 크기를 준다', () => {
    expect(v_e1e4a1({ text: '10,000,000 XRUN', availableWidth: 0, ...v_ec02d1 })).toBe(32);
    expect(v_e1e4a1({ text: '10,000,000 XRUN', availableWidth: -5, ...v_ec02d1 })).toBe(32);
  });

  it('빈 텍스트는 최대 크기', () => {
    expect(v_e1e4a1({ text: '', availableWidth: 223, ...v_ec02d1 })).toBe(32);
  });

  it('정수 크기를 준다 (소수 fontSize 는 플랫폼별 반올림이 갈린다)', () => {
    const v_05b441 = v_e1e4a1({ text: '123,456,789.12 XRUN', availableWidth: 223, ...v_ec02d1 });
    expect(Number.isInteger(v_05b441)).toBe(true);
  });
});
