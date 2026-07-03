

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
