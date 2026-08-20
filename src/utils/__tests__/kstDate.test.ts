

import { formatUtcIsoToKstDate } from '../kstDate';

describe('formatUtcIsoToKstDate', () => {
  it('일반적인 UTC 시각을 KST YYYY.MM.DD 로 변환한다', () => {
    expect(formatUtcIsoToKstDate('2026-08-20T04:33:12.000Z')).toBe('2026.08.20');
  });

  it('🔴 타임존 경계 — UTC 늦은 밤 값이 KST 로는 다음날로 넘어간다', () => {

    expect(formatUtcIsoToKstDate('2026-08-19T15:30:00Z')).toBe('2026.08.20');
  });

  it('UTC 자정 직전 값도 KST 로 정확히 하루 넘어간다', () => {

    expect(formatUtcIsoToKstDate('2026-01-31T23:59:59Z')).toBe('2026.02.01');
  });

  it('월/일이 1~9 인 경우 0 패딩된다', () => {
    expect(formatUtcIsoToKstDate('2026-01-05T00:00:00Z')).toBe('2026.01.05');
  });

  it('연말/연초 경계도 정확하다', () => {

    expect(formatUtcIsoToKstDate('2025-12-31T15:00:00Z')).toBe('2026.01.01');
  });

  it('undefined 면 null 을 반환한다 (예외 던지지 않음)', () => {
    expect(formatUtcIsoToKstDate(undefined)).toBeNull();
  });

  it('null 이면 null 을 반환한다', () => {
    expect(formatUtcIsoToKstDate(null)).toBeNull();
  });

  it('빈 문자열이면 null 을 반환한다', () => {
    expect(formatUtcIsoToKstDate('')).toBeNull();
  });

  it('🔴 잘못된 형식의 문자열이어도 예외 없이 null 로 폴백한다', () => {
    expect(formatUtcIsoToKstDate('not-a-date')).toBeNull();
    expect(formatUtcIsoToKstDate('2026-13-99T99:99:99Z')).toBeNull();
    expect(formatUtcIsoToKstDate('   ')).toBeNull();
  });
});
