module.exports = {
  preset: 'jest-expo',
  setupFiles: ['<rootDir>/jest.setup.js'],
  setupFilesAfterEnv: ['<rootDir>/jest-setup.ts'],
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|@react-native-async-storage/.*|react-native-svg|@testing-library/.*))',
  ],
  testMatch: ['**/__tests__/**/*.test.(ts|tsx)'],
};
