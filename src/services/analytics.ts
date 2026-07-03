

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
