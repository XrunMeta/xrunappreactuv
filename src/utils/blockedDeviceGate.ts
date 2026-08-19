

import { AxiosError } from 'axios';

const BLOCKED_DEVICE_REASONS = ['blocked_device', 'blocked_device_used', 'blocked_device_banned'];

export type ShowAlertFn = (
  title: string,
  message?: string,
  buttons?: Array<{ text: string; onPress?: () => void; style?: 'default' | 'cancel' | 'destructive' }>,
  options?: { hideCloseButton?: boolean },
) => Promise<number | undefined>;

export type TranslateFn = (key: string, opts?: any) => string;

export function isBlockedDeviceError(error: unknown): boolean {
  if (!(error instanceof AxiosError) || error.response?.status !== 409) return false;
  const reason = (error.response?.data as any)?.reason;
  return BLOCKED_DEVICE_REASONS.includes(reason);
}

export type BlockedDevicePromptResult = {

  handled: boolean;

  requestUnblock: boolean;
};

export async function presentBlockedDeviceAlert(
  error: unknown,
  showAlert: ShowAlertFn,
  t: TranslateFn,
): Promise<BlockedDevicePromptResult> {
  if (!isBlockedDeviceError(error)) {
    return { handled: false, requestUnblock: false };
  }

  const respData = (error as AxiosError).response?.data as any;
  const unblockRequestable = !!respData?.data?.unblockRequestable;

  if (unblockRequestable) {
    const choice = await showAlert(
      t('screens.deviceBinding.signupBlockedTitle'),
      t('screens.deviceBinding.signupBlockedBody'),
      [
        { text: t('common.buttons.confirm') || '확인', style: 'cancel' },
        { text: t('screens.deviceBinding.unblockRequestCta') },
      ],
    );
    return { handled: true, requestUnblock: choice === 1 };
  }

  await showAlert(
    t('screens.deviceBinding.signupBlockedTitle'),
    t('screens.deviceBinding.signupBlockedBody'),
  );
  return { handled: true, requestUnblock: false };
}
