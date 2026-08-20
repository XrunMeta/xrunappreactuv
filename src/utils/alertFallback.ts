

import { Alert } from 'react-native';
import { getGlobalShowAlert } from '../context/AlertDialogContext';
import type { ShowAlertFn } from './accountBanned';

const rnAlertFallback: ShowAlertFn = (title, message, buttons, _options) => {
  return new Promise((resolve) => {
    const list = buttons && buttons.length > 0 ? buttons : [{ text: '확인' }];
    Alert.alert(
      title,
      message,
      list.map((b, idx) => ({
        text: b.text,
        style: b.style,
        onPress: () => {
          b.onPress?.();
          resolve(idx);
        },
      })),
      { cancelable: false },
    );
  });
};

export function resolveShowAlert(): ShowAlertFn {
  return getGlobalShowAlert?.() ?? rnAlertFallback;
}
