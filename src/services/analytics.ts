

import analytics from '@react-native-firebase/analytics';

const safe = <T>(fn: () => Promise<T>): Promise<T | null> =>
  fn().catch((e) => {
    if (__DEV__) console.warn('[analytics]', e?.message);
    return null;
  });

export const logScreen = (screenName: string) =>
  safe(() =>
    analytics().logScreenView({
      screen_name: screenName,
      screen_class: screenName,
    }),
  );

export const logEvent = (name: string, params?: Record<string, unknown>) =>
  safe(() => analytics().logEvent(name, params as any));

export const setAnalyticsUserId = (memberId: number | string | null) =>
  safe(() => analytics().setUserId(memberId != null ? String(memberId) : null));

export const setAnalyticsUserProperty = (key: string, value: string | null) =>
  safe(() => analytics().setUserProperty(key, value));

export const XRUN_EVENTS = {
  SIGN_UP: 'sign_up',
  TUTORIAL_COMPLETE: 'tutorial_complete',
  PIN_SETUP_COMPLETED: 'pin_setup_completed',
  AD_REWARD_RECEIVED: 'ad_reward_received',
  FIRST_AD_SLOT_SELECTED: 'first_ad_slot_selected',
  WALLET_BACKUP_COMPLETED: 'wallet_backup_completed',
  WALLET_RESTORE_COMPLETED: 'wallet_restore_completed',
  SEND_TRANSACTION: 'send_transaction',
  SHOP_PURCHASE: 'shop_purchase',
  ATTENDANCE_CHECKED: 'attendance_checked',
  NOTIFICATION_OPENED: 'notification_opened',
  REFERRAL_SHARED: 'referral_shared',
  REFERRAL_SIGNUP_COMPLETED: 'referral_signup_completed',
} as const;
