

import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import { WalletRestoreScreen } from '../WalletRestoreScreen';

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn((key: string) => {
    if (key === 'userEmail') return Promise.resolve('test@example.com');
    if (key === 'jwt') return Promise.resolve('header.payload.sig');
    return Promise.resolve(null);
  }),
  setItem: jest.fn(() => Promise.resolve()),
  removeItem: jest.fn(() => Promise.resolve()),
}));

const mockDecryptBackupJsonAny = jest.fn();
const mockDecryptBackupJson = jest.fn();
const mockRestoreBackup = jest.fn();
const mockRestorePlainBackup = jest.fn();
const mockJwtPayloadSub = jest.fn().mockReturnValue(42);

jest.mock('../../services/walletKeyStore', () => ({
  jwtPayloadSub: (...args: any[]) => mockJwtPayloadSub(...args),
  decryptBackupJson: (...args: any[]) => mockDecryptBackupJson(...args),
  decryptBackupJsonAny: (...args: any[]) => mockDecryptBackupJsonAny(...args),
  restoreBackup: (...args: any[]) => mockRestoreBackup(...args),
  restorePlainBackup: (...args: any[]) => mockRestorePlainBackup(...args),
}));

const mockGoBack = jest.fn();
const mockNavigate = jest.fn();
jest.mock('../../navigation', () => ({
  useAppNavigation: () => ({
    navigate: mockNavigate,
    goBack: mockGoBack,
    reset: jest.fn(),
    currentScreen: 'walletRestore',
    previousScreen: null,
    canGoBack: true,
  }),
  ROUTES: { wallet: 'wallet', map: 'map' },
}));

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (k: string, _opts?: any) => k,
  }),
}));

const mockShowAlert = jest.fn().mockResolvedValue(0);
jest.mock('../../context/AlertDialogContext', () => ({
  useAlertDialog: () => ({ showAlert: mockShowAlert }),
}));

jest.mock('../../components', () => {
  const { View, Text, TextInput, TouchableOpacity } = require('react-native');
  const React = require('react');
  return {
    Header: ({ title }: any) => React.createElement(Text, null, title),
    SafeView: ({ children, style }: any) => React.createElement(View, { style }, children),
    SafeScrollView: ({ children, contentContainerStyle }: any) =>
      React.createElement(View, { style: contentContainerStyle }, children),
    WalletKeyPinPromptModal: ({ visible }: any) =>
      visible ? React.createElement(View, { testID: 'pin-prompt-modal' }) : null,
    FormField: ({ testID, value, onChangeText, placeholder, secureTextEntry }: any) =>
      React.createElement(TextInput, { testID, value, onChangeText, placeholder, secureTextEntry }),
    PrimaryButton: ({ testID, title, onPress, disabled }: any) =>
      React.createElement(
        TouchableOpacity,
        { testID, onPress, disabled, accessibilityState: { disabled: !!disabled } },
        React.createElement(Text, null, title),
      ),
  };
});

let mockDocPickResult: any = { canceled: true, assets: [] };
jest.mock('expo-document-picker', () => ({
  getDocumentAsync: jest.fn(() => Promise.resolve(mockDocPickResult)),
}));

let mockFileContent = '';
jest.mock('expo-file-system/legacy', () => ({
  readAsStringAsync: jest.fn(() => Promise.resolve(mockFileContent)),
  documentDirectory: 'file:///docs/',
}));

jest.mock('@react-native-google-signin/google-signin', () => ({
  GoogleSignin: { hasPlayServices: jest.fn(), getCurrentUser: jest.fn(() => null), getTokens: jest.fn(), signIn: jest.fn(), addScopes: jest.fn() },
}));

jest.mock('@expo/vector-icons', () => ({ Ionicons: () => null }));

describe('WalletRestoreScreen — Task 9 자동판별', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockShowAlert.mockResolvedValue(0);
    mockJwtPayloadSub.mockReturnValue(42);
  });

  it('파일이 bv2: prefix 이면 passphrase 모달(restore-passphrase-input)이 표시됨', async () => {
    mockDocPickResult = {
      canceled: false,
      assets: [{ uri: 'file:///docs/test.keyencrypted', name: 'test.keyencrypted' }],
    };
    mockFileContent = 'bv2:aabbccddeeff00112233445566778899aabbccddeeff00112233445566778899:112233445566778899aabbccddeeff00:SomeCipherBase64==';
    mockDecryptBackupJsonAny.mockResolvedValue('{}');

    const { getByText, findByTestId } = render(<WalletRestoreScreen />);

    const fileBtn = await findByTestId('restore-from-file-btn', {}, { timeout: 3000 });
    await act(async () => { fireEvent.press(fileBtn); });

    const ppInput = await findByTestId('restore-passphrase-input', {}, { timeout: 3000 });
    expect(ppInput).toBeTruthy();
  });

  it('decryptBackupJsonAny 가 빈 문자열 반환 시 에러 alert 표시 (성공 오인 금지)', async () => {
    mockDocPickResult = {
      canceled: false,
      assets: [{ uri: 'file:///docs/test.keyencrypted', name: 'test.keyencrypted' }],
    };
    mockFileContent = 'bv2:aabbccddeeff00112233445566778899aabbccddeeff00112233445566778899:112233445566778899aabbccddeeff00:SomeCipherBase64==';

    mockDecryptBackupJsonAny.mockResolvedValue('');

    const { findByTestId } = render(<WalletRestoreScreen />);

    const fileBtn = await findByTestId('restore-from-file-btn', {}, { timeout: 3000 });
    await act(async () => { fireEvent.press(fileBtn); });
    const ppInput = await findByTestId('restore-passphrase-input', {}, { timeout: 3000 });

    fireEvent.changeText(ppInput, 'WrongPassphrase!1');
    const ppSubmit = await findByTestId('restore-passphrase-submit', {}, { timeout: 3000 });
    await act(async () => { fireEvent.press(ppSubmit); });

    await waitFor(() => {
      expect(mockShowAlert).toHaveBeenCalled();
      const [[title]] = mockShowAlert.mock.calls;
      expect(title).toBe('screens.walletRestore.alerts.decryptFailTitle');
    }, { timeout: 3000 });
  });

  it('파일이 hex:cipher 형식(v1)이면 PIN 모달(pin-prompt-modal)이 표시됨', async () => {
    mockDocPickResult = {
      canceled: false,
      assets: [{ uri: 'file:///docs/test.txt', name: 'test.txt' }],
    };

    mockFileContent = '0011223344556677889900112233445566778899001122334455667788990011:SomeCipherBase64==';

    const { findByTestId } = render(<WalletRestoreScreen />);
    const fileBtn = await findByTestId('restore-from-file-btn', {}, { timeout: 3000 });
    await act(async () => { fireEvent.press(fileBtn); });

    const pinModal = await findByTestId('pin-prompt-modal', {}, { timeout: 3000 });
    expect(pinModal).toBeTruthy();
  });
});
