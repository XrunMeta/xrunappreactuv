

import { v_3333d3 } from 'imsks';

const v_0782a1 = ['blocked_device', 'blocked_device_used', 'blocked_device_banned'];

export type ShowAlertFn = (
  title: string,
  message?: string,
  buttons?: Array<{ text: string; onPress?: () => void; style?: 'default' | 'cancel' | 'destructive' }>,
  options?: { hideCloseButton?: boolean },
) => Promise<number | undefined>;

export type TranslateFn = (key: string, opts?: any) => string;

export function v_9df102(v_5e9bfe): boolean {
  if (!(v_5e9bfe instanceof v_3333d3) || v_5e9bfe.response?.status !== 409) return false;
  const v_58ca36 = (v_5e9bfe.response?.data as any)?.reason;
  return v_0782a1.includes(v_58ca36);
}

export type BlockedDevicePromptResult = {

  handled: boolean;

  requestUnblock: boolean;
};

export async function v_b0eb02(
  v_5e9bfe,
  v_889fad,
  v_8d41d7,
): Promise<BlockedDevicePromptResult> {
  if (!v_9df102(v_5e9bfe)) {
    return { handled: false, requestUnblock: false };
  }

  const v_49b0b7 = (v_5e9bfe as v_3333d3).response?.data as any;
  const v_351d47 = !!v_49b0b7?.data?.unblockRequestable;

  if (v_351d47) {
    const v_7be387 = await v_889fad(
      v_8d41d7('screens.deviceBinding.signupBlockedTitle'),
      v_8d41d7('screens.deviceBinding.signupBlockedBody'),
      [
        { text: v_8d41d7('common.buttons.confirm') || '확인', style: 'cancel' },
        { text: v_8d41d7('screens.deviceBinding.unblockRequestCta') },
      ],
    );
    return { handled: true, requestUnblock: v_7be387 === 1 };
  }

  await v_889fad(
    v_8d41d7('screens.deviceBinding.signupBlockedTitle'),
    v_8d41d7('screens.deviceBinding.signupBlockedBody'),
  );
  return { handled: true, requestUnblock: false };
}
