import { fmtAmount, fmtBalance } from '../formatAmount';

describe('fmtBalance', () => {
  it('1,000 이상도 콤마를 붙여 표시한다', () => {
    expect(fmtBalance('162858.00000000')).toBe('162,858');
    expect(fmtBalance('1000.5')).toBe('1,000.5');
    expect(fmtBalance('1234567.89')).toBe('1,234,567.89');
  });

  it('🔴 이미 포맷된 문자열을 다시 넣어도 값이 사라지지 않는다 (멱등)', () => {

    expect(fmtBalance('162,858')).toBe('162,858');
    expect(fmtBalance('1,000.5')).toBe('1,000.5');
    expect(fmtBalance('1,234,567.89')).toBe('1,234,567.89');
  });

  it('두 번 적용해도 한 번 적용과 같다', () => {
    for (const raw of ['162858.00000000', '1000.5', '999.99', '27.26280417', '0.00688751', '0']) {
      const once = fmtBalance(raw);
      expect(fmtBalance(once)).toBe(once);
    }
  });

  it('1,000 미만 기존 동작은 그대로다', () => {
    expect(fmtBalance('27.26280417')).toBe('27.26');
    expect(fmtBalance('0.00688751')).toBe('0.006888');
    expect(fmtBalance('999.99')).toBe('999.99');
    expect(fmtBalance('3.65')).toBe('3.65');
  });

  it('0 · 빈값 · 널 · 진짜 NaN 은 "0"', () => {
    expect(fmtBalance('0')).toBe('0');
    expect(fmtBalance('')).toBe('0');
    expect(fmtBalance(null)).toBe('0');
    expect(fmtBalance(undefined)).toBe('0');
    expect(fmtBalance('abc')).toBe('0');
  });

  it('음수도 멱등이다', () => {
    expect(fmtBalance('-162858')).toBe('-162,858');
    expect(fmtBalance('-162,858')).toBe('-162,858');
  });
});

describe('fmtAmount', () => {
  it('1,000 이상도 콤마를 붙여 표시한다', () => {
    expect(fmtAmount('1234567.5')).toBe('1,234,567.5');
  });

  it('🔴 이미 포맷된 문자열을 다시 넣어도 값이 사라지지 않는다 (멱등)', () => {
    expect(fmtAmount('1,234,567.5')).toBe('1,234,567.5');
    expect(fmtAmount('162,858')).toBe('162,858');
  });

  it('기존 동작은 그대로다', () => {
    expect(fmtAmount('0.10')).toBe('0.1');
    expect(fmtAmount('10.00')).toBe('10');
    expect(fmtAmount('')).toBe('0');
    expect(fmtAmount('abc')).toBe('0');
  });
});
