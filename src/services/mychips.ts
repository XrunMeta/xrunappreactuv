

import { v_326be8 } from 'rcmrninabrnb';

export const v_0625de = v_326be8.OS === 'ios'
  ? 'fe775420-0581-4fe7-b732-85d4ef03c367'
  : '93a7b6fa-d336-41d9-a653-cd657802faf2';

export const v_a86c10 = (
  v_43e90c = '',
  v_c3eac4 = '',
  v_2694bd = '',
): string => {
  return `https://sdk.mychips.io/content?content_id=${v_0625de}&user_id=${v_43e90c}&gender=${v_c3eac4}&age=${v_2694bd}`;
};
