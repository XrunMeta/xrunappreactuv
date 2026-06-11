import ko from '../../locales/ko/screens/walletKeyTutorial';
import en from '../../locales/en/screens/walletKeyTutorial';

describe('walletKeyTutorial i18n', () => {
  it('ko: page1~3 title + body(배열) + agree/button 키 존재', () => {
    expect(ko.page1.title).toBeTruthy();
    expect(Array.isArray(ko.page1.body)).toBe(true);
    expect(ko.page3.body.length).toBeGreaterThan(0);
    expect(ko.agree.label).toBeTruthy();
    expect(ko.button.start).toBeTruthy();
    expect(ko.readonly.close).toBeTruthy();
  });

  it('en: ko 와 동일한 키 구조', () => {
    expect(Object.keys(en)).toEqual(Object.keys(ko));
    expect(en.page1.title).toBeTruthy();
    expect(Array.isArray(en.page2.body)).toBe(true);
  });
});
