

import { AxiosError } from 'axios';
import { isBlockedDeviceError, presentBlockedDeviceAlert } from '../blockedDeviceGate';

function makeAxiosError(status: number, data: any): AxiosError {
  const err = new AxiosError('Request failed');
  (err as any).response = { status, data };
  return err;
}

describe('isBlockedDeviceError', () => {
  it.each(['blocked_device', 'blocked_device_used', 'blocked_device_banned'])(
    '409 + reason=%s 면 true',
    (reason) => {
      const err = makeAxiosError(409, { reason });
      expect(isBlockedDeviceError(err)).toBe(true);
    },
  );

  it('409 여도 reason 이 다르면 false (예: 이메일 중복)', () => {
    const err = makeAxiosError(409, { reason: 'email_duplicate' });
    expect(isBlockedDeviceError(err)).toBe(false);
  });

  it('AxiosError 가 아니면 false', () => {
    expect(isBlockedDeviceError(new Error('boom'))).toBe(false);
  });

  it('status 가 409 가 아니면 false', () => {
    const err = makeAxiosError(500, { reason: 'blocked_device_used' });
    expect(isBlockedDeviceError(err)).toBe(false);
  });
});

describe('presentBlockedDeviceAlert', () => {
  const t = (key: string) => key;

  it('기기 차단 409 가 아니면 팝업 없이 handled:false 를 반환한다', async () => {
    const showAlert = jest.fn();
    const err = makeAxiosError(409, { reason: 'email_duplicate' });
    const result = await presentBlockedDeviceAlert(err, showAlert, t);
    expect(result).toEqual({ handled: false, requestUnblock: false });
    expect(showAlert).not.toHaveBeenCalled();
  });

  it('unblockRequestable=true 면 2버튼 팝업을 띄우고, 두 번째 버튼 선택 시 requestUnblock:true', async () => {
    const showAlert = jest.fn().mockResolvedValue(1);
    const err = makeAxiosError(409, {
      reason: 'blocked_device_used',
      data: { unblockRequestable: true },
    });
    const result = await presentBlockedDeviceAlert(err, showAlert, t);
    expect(result).toEqual({ handled: true, requestUnblock: true });
    expect(showAlert).toHaveBeenCalledTimes(1);
    const [, , buttons] = showAlert.mock.calls[0];
    expect(buttons).toHaveLength(2);
  });

  it('unblockRequestable=true 여도 첫 번째(확인) 버튼을 누르면 requestUnblock:false', async () => {
    const showAlert = jest.fn().mockResolvedValue(0);
    const err = makeAxiosError(409, {
      reason: 'blocked_device_banned',
      data: { unblockRequestable: true },
    });
    const result = await presentBlockedDeviceAlert(err, showAlert, t);
    expect(result).toEqual({ handled: true, requestUnblock: false });
  });

  it('unblockRequestable=false 면 단일 확인 팝업만 띄운다 (버튼 배열 없음)', async () => {
    const showAlert = jest.fn().mockResolvedValue(undefined);
    const err = makeAxiosError(409, {
      reason: 'blocked_device_used',
      data: { unblockRequestable: false },
    });
    const result = await presentBlockedDeviceAlert(err, showAlert, t);
    expect(result).toEqual({ handled: true, requestUnblock: false });
    expect(showAlert).toHaveBeenCalledTimes(1);
    expect(showAlert.mock.calls[0]).toHaveLength(2); 
  });
});
