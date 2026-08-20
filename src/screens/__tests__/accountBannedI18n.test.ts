

import ko from '../../locales/ko/screens/deviceBinding';
import en from '../../locales/en/screens/deviceBinding';
import ja from '../../locales/ja/screens/deviceBinding';
import zhCN from '../../locales/zh-CN/screens/deviceBinding';
import hi from '../../locales/hi/screens/deviceBinding';
import id from '../../locales/id/screens/deviceBinding';
import th from '../../locales/th/screens/deviceBinding';
import vi from '../../locales/vi/screens/deviceBinding';

const ALL_LOCALES: Record<string, any> = { ko, en, ja, 'zh-CN': zhCN, hi, id, th, vi };

describe('ko 확정 문구 — 한 글자도 다르면 안 된다', () => {
  it('accountBannedTitle', () => {
    expect(ko.accountBannedTitle).toBe('계정 영구 이용 제한 안내');
  });

  it('accountBannedBodyWithDate', () => {
    expect(ko.accountBannedBodyWithDate).toBe(
      '이용약관 및 운영정책을 심각하게 위반하여 해당 계정의 서비스 이용이 영구 제한되었습니다.\n\n' +
        '적용 일시: {{date}}\n\n' +
        '제한 사유: 부정 프로그램 사용 / 중대 약관 위반 등\n\n' +
        '이의 제기나 소명이 필요하신 경우 고객센터나 oth-staff@example.invalid 접수해 주시기 바랍니다.',
    );
  });

  it('accountBannedBodyNoDate — WithDate 에서 "적용 일시" 줄과 그 뒤 빈 줄만 제거한 것과 동일하다', () => {
    expect(ko.accountBannedBodyNoDate).toBe(
      '이용약관 및 운영정책을 심각하게 위반하여 해당 계정의 서비스 이용이 영구 제한되었습니다.\n\n' +
        '제한 사유: 부정 프로그램 사용 / 중대 약관 위반 등\n\n' +
        '이의 제기나 소명이 필요하신 경우 고객센터나 oth-staff@example.invalid 접수해 주시기 바랍니다.',
    );
  });

  it('NoDate 버전에는 "적용 일시" 문자열이 없다', () => {
    expect(ko.accountBannedBodyNoDate).not.toContain('적용 일시');
  });
});

describe.each(Object.keys(ALL_LOCALES))('%s 로케일 — accountBanned* 키 존재', (lang) => {
  const dict = ALL_LOCALES[lang];

  it('accountBannedTitle 이 비어있지 않다', () => {
    expect(typeof dict.accountBannedTitle).toBe('string');
    expect(dict.accountBannedTitle.length).toBeGreaterThan(0);
  });

  it('accountBannedBodyWithDate 에 {{date}} 플레이스홀더가 있다', () => {
    expect(typeof dict.accountBannedBodyWithDate).toBe('string');
    expect(dict.accountBannedBodyWithDate).toContain('{{date}}');
  });

  it('accountBannedBodyNoDate 가 존재하고, WithDate 버전보다 짧다(적용 일시 줄이 빠졌으므로)', () => {
    expect(typeof dict.accountBannedBodyNoDate).toBe('string');
    expect(dict.accountBannedBodyNoDate.length).toBeGreaterThan(0);
    expect(dict.accountBannedBodyNoDate.length).toBeLessThan(dict.accountBannedBodyWithDate.length);
  });

  it('accountBannedBodyNoDate 에는 {{date}} 플레이스홀더가 없다', () => {
    expect(dict.accountBannedBodyNoDate).not.toContain('{{date}}');
  });

  it('두 본문 모두 oth-staff@example.invalid 을 포함한다(언어 무관 고정값)', () => {
    expect(dict.accountBannedBodyWithDate).toContain('oth-staff@example.invalid');
    expect(dict.accountBannedBodyNoDate).toContain('oth-staff@example.invalid');
  });
});

describe('8개 언어 전부 로드 가능 — 누락 감지', () => {
  it('LANGUAGE_CODES 에 정의된 8개 언어 전부가 ALL_LOCALES 에 존재한다', () => {
    const expectedLangs = ['ko', 'en', 'ja', 'zh-CN', 'hi', 'id', 'th', 'vi'];
    expect(Object.keys(ALL_LOCALES).sort()).toEqual(expectedLangs.sort());
  });
});
