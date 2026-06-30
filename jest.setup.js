

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
