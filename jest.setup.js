

jest.mock('expo-crypto', () => ({
  getRandomBytes: (n) => {
    const { randomBytes } = require('crypto');
    return new Uint8Array(randomBytes(n));
  },
  digestStringAsync: jest.fn(),
}));

jest.mock('expo-secure-store', () => {
  const store = new Map();
  return {
    WHEN_UNLOCKED_THIS_DEVICE_ONLY: 'whenUnlockedThisDeviceOnly',
    setItemAsync: async (k, v) => { store.set(k, v); },
    getItemAsync: async (k) => (store.has(k) ? store.get(k) : null),
    deleteItemAsync: async (k) => { store.delete(k); },
    __reset: () => store.clear(),
  };
});

jest.mock('@react-native-firebase/analytics', () => {
  const instance = {
    logScreenView: jest.fn(() => Promise.resolve()),
    logEvent: jest.fn(() => Promise.resolve()),
    setUserId: jest.fn(() => Promise.resolve()),
    setUserProperty: jest.fn(() => Promise.resolve()),
  };
  return { __esModule: true, default: () => instance };
});

jest.mock('react-native-safe-area-context', () => {
  const actual = jest.requireActual('react-native-safe-area-context');
  const inset = { top: 0, right: 0, bottom: 0, left: 0 };
  return {
    ...actual,
    useSafeAreaInsets: () => inset,
    useSafeAreaFrame: () => ({ x: 0, y: 0, width: 390, height: 844 }),
  };
});
