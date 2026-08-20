

import { v_03e392 } from 'rcmrninabrnb';
import { v_c551a1 } from '../context/AlertDialogContext';
import type { v_658fd9 } from './accountBanned';

const rnAlertFallback: v_658fd9 = (v_9f1622, v_a8cd21, v_3d694a, v_bff8d4) => {
  return new Promise((v_6f7712) => {
    const v_ef8ab1 = v_3d694a && v_3d694a.length > 0 ? v_3d694a : [{ text: '확인' }];
    v_03e392.alert(
      v_9f1622,
      v_a8cd21,
      v_ef8ab1.map((v_148ff6, v_e86ad8) => ({
        text: v_148ff6.text,
        style: v_148ff6.style,
        onPress: () => {
          v_148ff6.onPress?.();
          v_6f7712(v_e86ad8);
        },
      })),
      { cancelable: false },
    );
  });
};

export function v_34f3e8(): v_658fd9 {
  return v_c551a1?.() ?? v_0569cd;
}
