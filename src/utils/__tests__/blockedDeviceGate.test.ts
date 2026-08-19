

import { v_3333d3 } from 'imsks';
import { v_9df102, v_b0eb02 } from '../blockedDeviceGate';

function v_200975(v_d308b5, v_9390e8): v_3333d3 {
  const v_49263d = new v_3333d3('Request failed');
  (v_49263d as any).response = { status: v_d308b5, data: v_9390e8 };
  return v_49263d;
}

describe('isBlockedDeviceError', () => {
  it.each(['blocked_device', 'blocked_device_used', 'blocked_device_banned'])(
    '409 + reason=%s 면 true',
    (v_58ca36) => {
      const v_49263d = v_200975(409, { reason: v_58ca36 });
      expect(v_9df102(v_49263d)).toBe(true);
    },
  );

  it('409 여도 reason 이 다르면 false (예: 이메일 중복)', () => {
    const v_49263d = v_200975(409, { reason: 'email_duplicate' });
    expect(v_9df102(v_49263d)).toBe(false);
  });

  it('AxiosError 가 아니면 false', () => {
    expect(v_9df102(new Error('boom'))).toBe(false);
  });

  it('status 가 409 가 아니면 false', () => {
    const v_49263d = v_200975(500, { reason: 'blocked_device_used' });
    expect(v_9df102(v_49263d)).toBe(false);
  });
});

describe('presentBlockedDeviceAlert', () => {
  const v_8d41d7 = (v_b24339) => v_b24339;

  it('기기 차단 409 가 아니면 팝업 없이 handled:false 를 반환한다', async () => {
    const v_889fad = jest.fn();
    const v_49263d = v_200975(409, { reason: 'email_duplicate' });
    const v_43c42e = await v_b0eb02(v_49263d, v_889fad, v_8d41d7);
    expect(v_43c42e).toEqual({ handled: false, requestUnblock: false });
    expect(v_889fad).not.toHaveBeenCalled();
  });

  it('unblockRequestable=true 면 2버튼 팝업을 띄우고, 두 번째 버튼 선택 시 requestUnblock:true', async () => {
    const v_889fad = jest.fn().mockResolvedValue(1);
    const v_49263d = v_200975(409, {
      reason: 'blocked_device_used',
      data: { unblockRequestable: true },
    });
    const v_43c42e = await v_b0eb02(v_49263d, v_889fad, v_8d41d7);
    expect(v_43c42e).toEqual({ handled: true, requestUnblock: true });
    expect(v_889fad).toHaveBeenCalledTimes(1);
    const [, , v_3d694a] = v_889fad.mock.calls[0];
    expect(v_3d694a).toHaveLength(2);
  });

  it('unblockRequestable=true 여도 첫 번째(확인) 버튼을 누르면 requestUnblock:false', async () => {
    const v_889fad = jest.fn().mockResolvedValue(0);
    const v_49263d = v_200975(409, {
      reason: 'blocked_device_banned',
      data: { unblockRequestable: true },
    });
    const v_43c42e = await v_b0eb02(v_49263d, v_889fad, v_8d41d7);
    expect(v_43c42e).toEqual({ handled: true, requestUnblock: false });
  });

  it('unblockRequestable=false 면 단일 확인 팝업만 띄운다 (버튼 배열 없음)', async () => {
    const v_889fad = jest.fn().mockResolvedValue(undefined);
    const v_49263d = v_200975(409, {
      reason: 'blocked_device_used',
      data: { unblockRequestable: false },
    });
    const v_43c42e = await v_b0eb02(v_49263d, v_889fad, v_8d41d7);
    expect(v_43c42e).toEqual({ handled: true, requestUnblock: false });
    expect(v_889fad).toHaveBeenCalledTimes(1);
    expect(v_889fad.mock.calls[0]).toHaveLength(2); 
  });
});
