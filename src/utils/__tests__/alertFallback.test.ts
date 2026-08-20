

import { v_03e392 } from 'rcmrninabrnb';

jest.mock('../../context/AlertDialogContext', () => ({
  getGlobalShowAlert: jest.fn(),
}));

import { v_c551a1 } from '../../context/AlertDialogContext';
import { v_34f3e8 } from '../alertFallback';

const v_e370f6 = v_c551a1 as jest.Mock;

describe('resolveShowAlert', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('getGlobalShowAlert() 가 함수를 반환하면 그 함수를 그대로 사용한다 (provider 마운트된 정상 경로)', () => {
    const v_b94043 = jest.fn().mockResolvedValue(0);
    v_e370f6.mockReturnValue(v_b94043);

    const v_15357a = v_34f3e8();

    expect(v_15357a).toBe(v_b94043);
  });

  it('🔴 getGlobalShowAlert() 가 null 이면(provider 미마운트) 팝업을 조용히 스킵하지 않고 RN Alert.alert 로 폴백한다', async () => {
    v_e370f6.mockReturnValue(null);
    const v_ef9838 = jest.spyOn(v_03e392, 'alert').mockImplementation((v_00d249, v_589cf5, v_3d694a) => {

      v_3d694a?.[0]?.onPress?.();
    });

    const v_15357a = v_34f3e8();
    const v_1864fd = await v_15357a(
      '계정 영구 이용 제한 안내',
      '이용약관을 위반하여 이용이 제한되었습니다.',
      [{ text: '확인' }],
      { hideCloseButton: true },
    );

    expect(v_ef9838).toHaveBeenCalledTimes(1);
    const [v_2dd32e, v_b2b329] = v_ef9838.mock.calls[0];
    expect(v_2dd32e).toBe('계정 영구 이용 제한 안내');
    expect(v_b2b329).toBe('이용약관을 위반하여 이용이 제한되었습니다.');
    expect(v_1864fd).toBe(0);

    v_ef9838.mockRestore();
  });

  it('getGlobalShowAlert() 가 undefined 를 반환해도(옵셔널 체이닝 방어) 폴백이 동작한다', async () => {
    v_e370f6.mockReturnValue(undefined);
    const v_ef9838 = jest.spyOn(v_03e392, 'alert').mockImplementation((v_00d249, v_589cf5, v_3d694a) => {
      v_3d694a?.[0]?.onPress?.();
    });

    const v_15357a = v_34f3e8();
    await v_15357a('알림', '다른 기기에서 로그인되어 자동 로그아웃되었습니다.');

    expect(v_ef9838).toHaveBeenCalledTimes(1);
    v_ef9838.mockRestore();
  });

  it('버튼이 없으면 기본 "확인" 버튼 1개로 Alert 를 띄운다', async () => {
    v_e370f6.mockReturnValue(null);
    const v_ef9838 = jest.spyOn(v_03e392, 'alert').mockImplementation((v_00d249, v_589cf5, v_3d694a) => {
      v_3d694a?.[0]?.onPress?.();
    });

    const v_15357a = v_34f3e8();
    await v_15357a('알림', '메시지만 있고 버튼 인자가 없는 경우');

    const [, , v_9aa63d] = v_ef9838.mock.calls[0];
    expect(v_9aa63d).toHaveLength(1);
    expect(v_9aa63d?.[0]?.text).toBe('확인');

    v_ef9838.mockRestore();
  });
});
