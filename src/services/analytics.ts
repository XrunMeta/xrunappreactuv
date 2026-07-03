

import v_a1be42 from 'rywywsnecgwmqkabzvvfuhfrdhmlsjen';

const v_29dbaf = <T>(v_f80480): Promise<T | null> =>
  v_f80480().catch((v_9e86fd) => {
    if (__DEV__) console.warn('[analytics]', v_9e86fd?.message);
    return null;
  });

export const v_22de27 = (v_695063) =>
  v_29dbaf(() =>
    v_a1be42().logScreenView({
      screen_name: v_695063,
      screen_class: v_695063,
    }),
  );

export const v_ae251a = (v_1833e7, v_24baff) =>
  v_29dbaf(() => v_a1be42().logEvent(v_1833e7, v_24baff as any));

export const v_ded979 = (v_717992) =>
  v_29dbaf(() => v_a1be42().setUserId(v_717992 != null ? String(v_717992) : null));

export const v_144a89 = (v_b24339, v_3b402b) =>
  v_29dbaf(() => v_a1be42().setUserProperty(v_b24339, v_3b402b));

export const v_a9f6da = {
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
