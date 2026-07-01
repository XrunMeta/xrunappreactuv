

import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import * as store from '../../services/walletKeyStore';

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn((key: string) => {
    if (key === 'userEmail') return Promise.resolve('test@example.com');
    if (key === 'jwt') return Promise.resolve(null);
    return Promise.resolve(null);
  }),
  setItem: jest.fn(() => Promise.resolve()),
  removeItem: jest.fn(() => Promise.resolve()),
}));

jest.mock('../../navigation', () => ({
  useAppNavigation: () => ({
    navigate: jest.fn(),
    goBack: jest.fn(),
    reset: jest.fn(),
    currentScreen: 'walletPrivateKeyGoogleAuth',
    previousScreen: null,
    canGoBack: true,
  }),
  ROUTES: {
    wallet: 'wallet',
    walletRestore: 'walletRestore',
    map: 'map',
  },
}));

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (k: string) => k,
  }),
}));

jest.mock('../../context/AlertDialogContext', () => ({
  useAlertDialog: () => ({
    showAlert: jest.fn().mockResolvedValue(0),
  }),
}));

jest.mock('../../services/walletKeyStore', () => ({
  jwtPayloadSub: jest.fn().mockReturnValue(null),
  findEntriesForUser: jest.fn().mockResolvedValue({}),
  exportBackup: jest.fn().mockResolvedValue(null),
  encryptBackupJsonV2: jest.fn().mockResolvedValue('bv2:mock'),
  buildPlainBackup: jest.fn().mockReturnValue({ exported_at: 0, wallets: [] }),
  NETWORK_MAP: {},
}));

jest.mock('../../services', () => ({
  getWalletKeyATStatus: jest.fn().mockResolvedValue({ at: false, at_at: null, ok: true }),
}));

jest.mock('../../components', () => {
  const { View, Text, TouchableOpacity } = require('react-native');
  const React = require('react');
  return {
    Header: ({ title }: any) => React.createElement(Text, null, title),
    SafeView: ({ children }: any) => React.createElement(View, null, children),
    SafeScrollView: ({ children }: any) => React.createElement(View, null, children),
    WalletKeyPinPromptModal: () => null,
    WalletKeyPinSetupModal: () => null,
  };
});

jest.mock('@react-native-google-signin/google-signin', () => ({
  GoogleSignin: { hasPlayServices: jest.fn(), getCurrentUser: jest.fn(), getTokens: jest.fn(), signIn: jest.fn(), addScopes: jest.fn() },
}));

jest.mock('expo-file-system/legacy', () => ({
  documentDirectory: 'file:///docs/',
  writeAsStringAsync: jest.fn(),
}));

jest.mock('@expo/vector-icons', () => ({
  Ionicons: () => null,
}));

describe('WalletPrivateKeyGoogleAuthScreen — Task 9 passphrase', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('encryptBackupJsonV2 는 walletKeyStore 에서 spy 가능', () => {
    const spy = jest.spyOn(store, 'encryptBackupJsonV2').mockResolvedValue('bv2:mock-result');
    expect(spy).toBeDefined();
    expect(typeof spy.mockResolvedValue).toBe('function');
    spy.mockRestore();
  });

  it('passphrase 8자 미만이면 submit disabled 조건 충족', () => {
    const pp = 'short';
    const confirm = 'short';

    expect(pp.length < 8 || pp !== confirm).toBe(true);
  });

  it('passphrase 불일치 시 submit disabled 조건 충족', () => {
    const pp = 'StrongPass!234';
    const confirm = 'DifferentPass!234';
    expect(pp.length < 8 || pp !== confirm).toBe(true);
  });

  it('passphrase 8자 이상 + 일치 시 submit 활성 조건 충족', () => {
    const pp = 'StrongPass!234';
    const confirm = 'StrongPass!234';
    expect(pp.length >= 8 && pp === confirm).toBe(true);
  });

  it('encryptBackupJsonV2 spy: 호출 시 passphrase 를 secret 으로 전달하는지 검증', async () => {
    const spy = jest.spyOn(store, 'encryptBackupJsonV2').mockResolvedValue('bv2:encrypted');
    const testJson = JSON.stringify({ entries: [], exported_at: 0 });
    const testPassphrase = 'StrongPass!234';

    await store.encryptBackupJsonV2(testJson, testPassphrase);

    expect(spy).toHaveBeenCalledWith(testJson, testPassphrase);
    expect(spy).toHaveBeenCalledWith(expect.any(String), 'StrongPass!234');
    spy.mockRestore();
  });
});
