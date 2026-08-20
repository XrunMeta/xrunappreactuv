

import { formatUtcIsoToKstDate } from './kstDate';

export type ShowAlertFn = (
  title: string,
  message?: string,
  buttons?: Array<{ text: string; onPress?: () => void; style?: 'default' | 'cancel' | 'destructive' }>,
  options?: { hideCloseButton?: boolean },
) => Promise<number | undefined>;

export type TranslateFn = (key: string, opts?: any) => string;

export function isAccountBannedResponse(data: any): boolean {
  return !!data && data.reason === 'account_banned';
}

export async function presentAccountBannedAlert(
  bannedAt: string | null | undefined,
  showAlert: ShowAlertFn,
  t: TranslateFn,
): Promise<void> {
  const kstDate = formatUtcIsoToKstDate(bannedAt);
  const title = t('screens.deviceBinding.accountBannedTitle') || '계정 영구 이용 제한 안내';
  const body = kstDate
    ? t('screens.deviceBinding.accountBannedBodyWithDate', { date: kstDate })
    : t('screens.deviceBinding.accountBannedBodyNoDate');

  await showAlert(
    title,
    body,
    [{ text: t('common.buttons.confirm') || '확인' }],
    { hideCloseButton: true },
  );
}
