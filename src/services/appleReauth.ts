

import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import appleAuth from '@invertase/react-native-apple-authentication';

export async function verifyAppleIdentity(): Promise<{ ok: boolean; cancelled?: boolean; reason?: string }> {
  if (Platform.OS !== 'ios') {
    return { ok: false, reason: 'not-ios' };
  }
  if (!appleAuth.isSupported) {
    return { ok: false, reason: 'not-supported' };
  }
  try {
    const response = await appleAuth.performRequest({
      requestedOperation: appleAuth.Operation.LOGIN,
      requestedScopes: [appleAuth.Scope.EMAIL],
    });
    if (!response.identityToken) {
      return { ok: false, reason: 'no-identity-token' };
    }
    return { ok: true };
  } catch (error: any) {
    if (error?.code === appleAuth.Error.CANCELED) {
      return { ok: false, cancelled: true, reason: 'user-cancelled' };
    }
    return { ok: false, reason: String(error?.code ?? error?.message ?? 'unknown') };
  }
}

export async function isAppleLoggedIn(): Promise<boolean> {
  try {
    const loginType = await AsyncStorage.getItem('loginType');
    return loginType === 'apple';
  } catch {
    return false;
  }
}
