

jest.mock('@react-native-google-signin/google-signin', () => ({
  GoogleSignin: { configure: jest.fn(), hasPlayServices: jest.fn(), signIn: jest.fn(), signOut: jest.fn() },
  statusCodes: {},
}));
jest.mock('react-native-appsflyer', () => ({
  __esModule: true,
  default: { logEvent: jest.fn(), initSdk: jest.fn(), onInstallConversionData: jest.fn() },
}));
jest.mock('@invertase/react-native-apple-authentication', () => ({
  __esModule: true,
  default: { performRequest: jest.fn(), Operation: {}, Scope: {} },
  appleAuthAndroid: {},
}));

describe('배럴 재export 제거 후 함수 해결', () => {
  it('googleAuth 직접 경로에서 함수가 나온다', () => {
    const m = require('../../services/googleAuth');
    expect(typeof m.signInWithGoogle).toBe('function');
    expect(typeof m.getGoogleIdToken).toBe('function');
  });

  it('appleAuth 직접 경로에서 함수가 나온다', () => {
    const m = require('../../services/appleAuth');
    expect(typeof m.signInWithApple).toBe('function');
  });

  it('pangle 직접 경로에서 함수가 나온다', () => {
    const m = require('../../services/pangle');
    expect(typeof m.showNativeScreen).toBe('function');
  });

  it('appsflyer 직접 경로에서 함수가 나온다', () => {
    const m = require('../../services/appsflyer');
    expect(typeof m.logRewardedAdCompleted).toBe('function');
  });

  it('🔴 배럴에는 더 이상 없어야 한다 (제거가 실제로 먹혔는가)', () => {
    const barrel = require('../../services');
    expect(barrel.signInWithGoogle).toBeUndefined();
    expect(barrel.signInWithApple).toBeUndefined();
    expect(barrel.showNativeScreen).toBeUndefined();
    expect(barrel.logRewardedAdCompleted).toBeUndefined();
  });

  it('배럴이 원래 갖고 있던 함수는 그대로 나온다', () => {
    const barrel = require('../../services');
    expect(typeof barrel.sendEmailVerificationCode).toBe('function');
    expect(typeof barrel.recordWalletTutorialComplete).toBe('function');
    expect(typeof barrel.loginWithEmailPassword).toBe('function');
  });
});
