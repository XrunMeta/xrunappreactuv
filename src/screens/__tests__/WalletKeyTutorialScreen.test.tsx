import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { WalletKeyTutorialScreen } from '../WalletKeyTutorialScreen';
import {
  TUTORIAL_PENDING_KEY,
  TUTORIAL_COMPLETED_KEY,
} from '../walletKeyTutorialHelpers';

jest.mock('../../components', () => {
  const { TouchableOpacity, View, Text } = require('react-native');
  const React = require('react');

  const SafeView = ({ children, style }: any) =>
    React.createElement(View, { style }, children);

  const PrimaryButton = ({ title, onPress, disabled, testID, style }: any) =>
    React.createElement(
      TouchableOpacity,
      { onPress, disabled, testID, accessibilityState: { disabled: !!disabled }, style },
      React.createElement(Text, null, title),
    );

  const FormCheckbox = ({ label, checked, onToggle, testID, style }: any) =>
    React.createElement(
      TouchableOpacity,
      { onPress: onToggle, testID, style },
      React.createElement(Text, null, label),
    );

  return { SafeView, PrimaryButton, FormCheckbox };
});

const mockReset = jest.fn();
const mockGoBack = jest.fn();
jest.mock('../../navigation', () => ({
  ...jest.requireActual('../../navigation'),
  useAppNavigation: () => ({
    reset: mockReset,
    goBack: mockGoBack,
    navigate: jest.fn(),
    currentScreen: 'walletKeyTutorial',
    previousScreen: null,
    canGoBack: false,
  }),
  ROUTES: jest.requireActual('../../navigation').ROUTES,
}));

const { ROUTES } = jest.requireActual('../../navigation');

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (k: string, opts?: any) =>
      opts?.returnObjects ? ['line1', 'line2'] : k,
    i18n: { language: 'ko' },
  }),
}));

describe('WalletKeyTutorialScreen (signup)', () => {
  beforeEach(() => {
    mockReset.mockClear();
    AsyncStorage.clear();
  });

  it('초기에는 "다음" 버튼, 체크박스 없음', () => {
    const { queryByTestId } = render(<WalletKeyTutorialScreen mode="signup" />);
    expect(queryByTestId('tutorial-next')).toBeTruthy();
    expect(queryByTestId('tutorial-agree')).toBeNull();
  });

  it('마지막 페이지 도달 시 체크박스 노출, 동의 전 시작하기 비활성', () => {
    const { getByTestId, queryByTestId } = render(
      <WalletKeyTutorialScreen mode="signup" />,
    );
    fireEvent.press(getByTestId('tutorial-next'));
    fireEvent.press(getByTestId('tutorial-next'));
    expect(getByTestId('tutorial-agree')).toBeTruthy();
    expect(getByTestId('tutorial-start').props.accessibilityState.disabled).toBe(true);
    expect(queryByTestId('tutorial-next')).toBeNull();
  });

  it('동의 후 시작하기 → 플래그 저장 + reset(map)', async () => {
    const { getByTestId } = render(<WalletKeyTutorialScreen mode="signup" />);
    fireEvent.press(getByTestId('tutorial-next'));
    fireEvent.press(getByTestId('tutorial-next'));
    fireEvent.press(getByTestId('tutorial-agree'));
    fireEvent.press(getByTestId('tutorial-start'));
    await waitFor(() => {
      expect(mockReset).toHaveBeenCalledWith(ROUTES.map);
    });
    expect(await AsyncStorage.getItem(TUTORIAL_COMPLETED_KEY)).toBe('true');
    expect(await AsyncStorage.getItem(TUTORIAL_PENDING_KEY)).toBeNull();
  });

  it('readonly 모드: 체크박스 없음, 닫기=goBack', () => {
    const { getByTestId, queryByTestId } = render(
      <WalletKeyTutorialScreen mode="readonly" />,
    );
    fireEvent.press(getByTestId('tutorial-next'));
    fireEvent.press(getByTestId('tutorial-next'));
    expect(queryByTestId('tutorial-agree')).toBeNull();
    fireEvent.press(getByTestId('tutorial-close'));
    expect(mockGoBack).toHaveBeenCalled();
  });
});
