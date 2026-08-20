

import { Alert } from 'react-native';

jest.mock('../../context/AlertDialogContext', () => ({
  getGlobalShowAlert: jest.fn(),
}));

import { getGlobalShowAlert } from '../../context/AlertDialogContext';
import { resolveShowAlert } from '../alertFallback';

const mockedGetGlobalShowAlert = getGlobalShowAlert as jest.Mock;

describe('resolveShowAlert', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('getGlobalShowAlert() 가 함수를 반환하면 그 함수를 그대로 사용한다 (provider 마운트된 정상 경로)', () => {
    const providerShowAlert = jest.fn().mockResolvedValue(0);
    mockedGetGlobalShowAlert.mockReturnValue(providerShowAlert);

    const showAlertFn = resolveShowAlert();

    expect(showAlertFn).toBe(providerShowAlert);
  });

  it('🔴 getGlobalShowAlert() 가 null 이면(provider 미마운트) 팝업을 조용히 스킵하지 않고 RN Alert.alert 로 폴백한다', async () => {
    mockedGetGlobalShowAlert.mockReturnValue(null);
    const alertSpy = jest.spyOn(Alert, 'alert').mockImplementation((_title, _message, buttons) => {

      buttons?.[0]?.onPress?.();
    });

    const showAlertFn = resolveShowAlert();
    const resultIndex = await showAlertFn(
      '계정 영구 이용 제한 안내',
      '이용약관을 위반하여 이용이 제한되었습니다.',
      [{ text: '확인' }],
      { hideCloseButton: true },
    );

    expect(alertSpy).toHaveBeenCalledTimes(1);
    const [calledTitle, calledMessage] = alertSpy.mock.calls[0];
    expect(calledTitle).toBe('계정 영구 이용 제한 안내');
    expect(calledMessage).toBe('이용약관을 위반하여 이용이 제한되었습니다.');
    expect(resultIndex).toBe(0);

    alertSpy.mockRestore();
  });

  it('getGlobalShowAlert() 가 undefined 를 반환해도(옵셔널 체이닝 방어) 폴백이 동작한다', async () => {
    mockedGetGlobalShowAlert.mockReturnValue(undefined);
    const alertSpy = jest.spyOn(Alert, 'alert').mockImplementation((_title, _message, buttons) => {
      buttons?.[0]?.onPress?.();
    });

    const showAlertFn = resolveShowAlert();
    await showAlertFn('알림', '다른 기기에서 로그인되어 자동 로그아웃되었습니다.');

    expect(alertSpy).toHaveBeenCalledTimes(1);
    alertSpy.mockRestore();
  });

  it('버튼이 없으면 기본 "확인" 버튼 1개로 Alert 를 띄운다', async () => {
    mockedGetGlobalShowAlert.mockReturnValue(null);
    const alertSpy = jest.spyOn(Alert, 'alert').mockImplementation((_title, _message, buttons) => {
      buttons?.[0]?.onPress?.();
    });

    const showAlertFn = resolveShowAlert();
    await showAlertFn('알림', '메시지만 있고 버튼 인자가 없는 경우');

    const [, , calledButtons] = alertSpy.mock.calls[0];
    expect(calledButtons).toHaveLength(1);
    expect(calledButtons?.[0]?.text).toBe('확인');

    alertSpy.mockRestore();
  });
});
