

import { v_f76463 } from './kstDate';

export type ShowAlertFn = (
  title: string,
  message?: string,
  buttons?: Array<{ text: string; onPress?: () => void; style?: 'default' | 'cancel' | 'destructive' }>,
  options?: { hideCloseButton?: boolean },
) => Promise<number | undefined>;

export type TranslateFn = (key: string, opts?: any) => string;

export function v_cd12da(v_9390e8): boolean {
  return !!v_9390e8 && v_9390e8.reason === 'account_banned';
}

export async function v_00f25c(
  v_6bfd22,
  v_889fad,
  v_8d41d7,
): Promise<void> {
  const v_f3e994 = v_f76463(v_6bfd22);
  const v_9f1622 = v_8d41d7('screens.deviceBinding.accountBannedTitle') || '계정 영구 이용 제한 안내';
  const v_4d33b2 = v_f3e994
    ? v_8d41d7('screens.deviceBinding.accountBannedBodyWithDate', { date: v_f3e994 })
    : v_8d41d7('screens.deviceBinding.accountBannedBodyNoDate');

  await v_889fad(
    v_9f1622,
    v_4d33b2,
    [{ text: v_8d41d7('common.buttons.confirm') || '확인' }],
    { hideCloseButton: true },
  );
}
