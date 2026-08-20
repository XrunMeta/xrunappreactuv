

import v_04a966 from '../../locales/ko/screens/deviceBinding';
import v_5d6728 from '../../locales/en/screens/deviceBinding';
import v_062521 from '../../locales/ja/screens/deviceBinding';
import v_973506 from '../../locales/zh-CN/screens/deviceBinding';
import v_d54b9c from '../../locales/hi/screens/deviceBinding';
import v_389afb from '../../locales/id/screens/deviceBinding';
import v_3018ef from '../../locales/th/screens/deviceBinding';
import v_3889c0 from '../../locales/vi/screens/deviceBinding';

const v_cf0cf6 = { ko: v_04a966, en: v_5d6728, ja: v_062521, 'zh-CN': v_973506, hi: v_d54b9c, id: v_389afb, th: v_3018ef, vi: v_3889c0 };

describe('ko 확정 문구 — 한 글자도 다르면 안 된다', () => {
  it('accountBannedTitle', () => {
    expect(v_04a966.accountBannedTitle).toBe('계정 영구 이용 제한 안내');
  });

  it('accountBannedBodyWithDate', () => {
    expect(v_04a966.accountBannedBodyWithDate).toBe(
      '이용약관 및 운영정책을 심각하게 위반하여 해당 계정의 서비스 이용이 영구 제한되었습니다.\n\n' +
        '적용 일시: {{date}}\n\n' +
        '제한 사유: 부정 프로그램 사용 / 중대 약관 위반 등\n\n' +
        '이의 제기나 소명이 필요하신 경우 고객센터나 oth-staff@example.invalid 접수해 주시기 바랍니다.',
    );
  });

  it('accountBannedBodyNoDate — WithDate 에서 "적용 일시" 줄과 그 뒤 빈 줄만 제거한 것과 동일하다', () => {
    expect(v_04a966.accountBannedBodyNoDate).toBe(
      '이용약관 및 운영정책을 심각하게 위반하여 해당 계정의 서비스 이용이 영구 제한되었습니다.\n\n' +
        '제한 사유: 부정 프로그램 사용 / 중대 약관 위반 등\n\n' +
        '이의 제기나 소명이 필요하신 경우 고객센터나 oth-staff@example.invalid 접수해 주시기 바랍니다.',
    );
  });

  it('NoDate 버전에는 "적용 일시" 문자열이 없다', () => {
    expect(v_04a966.accountBannedBodyNoDate).not.toContain('적용 일시');
  });
});

describe.each(Object.keys(v_cf0cf6))('%s 로케일 — accountBanned* 키 존재', (v_5254bf) => {
  const v_e2d0d4 = v_cf0cf6[v_5254bf];

  it('accountBannedTitle 이 비어있지 않다', () => {
    expect(typeof v_e2d0d4.accountBannedTitle).toBe('string');
    expect(v_e2d0d4.accountBannedTitle.length).toBeGreaterThan(0);
  });

  it('accountBannedBodyWithDate 에 {{date}} 플레이스홀더가 있다', () => {
    expect(typeof v_e2d0d4.accountBannedBodyWithDate).toBe('string');
    expect(v_e2d0d4.accountBannedBodyWithDate).toContain('{{date}}');
  });

  it('accountBannedBodyNoDate 가 존재하고, WithDate 버전보다 짧다(적용 일시 줄이 빠졌으므로)', () => {
    expect(typeof v_e2d0d4.accountBannedBodyNoDate).toBe('string');
    expect(v_e2d0d4.accountBannedBodyNoDate.length).toBeGreaterThan(0);
    expect(v_e2d0d4.accountBannedBodyNoDate.length).toBeLessThan(v_e2d0d4.accountBannedBodyWithDate.length);
  });

  it('accountBannedBodyNoDate 에는 {{date}} 플레이스홀더가 없다', () => {
    expect(v_e2d0d4.accountBannedBodyNoDate).not.toContain('{{date}}');
  });

  it('두 본문 모두 oth-staff@example.invalid 을 포함한다(언어 무관 고정값)', () => {
    expect(v_e2d0d4.accountBannedBodyWithDate).toContain('oth-staff@example.invalid');
    expect(v_e2d0d4.accountBannedBodyNoDate).toContain('oth-staff@example.invalid');
  });
});

describe('8개 언어 전부 로드 가능 — 누락 감지', () => {
  it('LANGUAGE_CODES 에 정의된 8개 언어 전부가 ALL_LOCALES 에 존재한다', () => {
    const v_b0b8e2 = ['ko', 'en', 'ja', 'zh-CN', 'hi', 'id', 'th', 'vi'];
    expect(Object.keys(v_cf0cf6).sort()).toEqual(v_b0b8e2.sort());
  });
});
