

import { useEffect, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CryptoJS from 'crypto-js';
import { useTranslation } from 'react-i18next';
import { ROUTES, useAppNavigation } from '../navigation';
import { useAlertDialog } from '../context/AlertDialogContext';
import { clearUserUnlock } from '../services/walletKeyStore';

function isJwtExpiredLocally(jwt: string): boolean {
  try {
    const parts = jwt.split('.');
    if (parts.length !== 3) return false;
    let b64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    while (b64.length % 4 !== 0) b64 += '=';
    const json = CryptoJS.enc.Base64.parse(b64).toString(CryptoJS.enc.Utf8);
    const payload = JSON.parse(json);
    if (typeof payload?.exp !== 'number') return false;
    return Date.now() >= payload.exp * 1000;
  } catch (e) {
    console.warn('[useSessionGuard] JWT payload 디코드 실패 — 만료 판정 보류:', e);
    return false;
  }
}

export async function checkSessionValid(): Promise<boolean> {
  try {
    const isLoggedIn = await AsyncStorage.getItem('isLoggedIn');
    if (isLoggedIn !== 'true') return false;

    const jwt = await AsyncStorage.getItem('jwt');
    if (!jwt) {

      return true;
    }
    if (isJwtExpiredLocally(jwt)) return false;
    return true;
  } catch (e) {

    console.warn('[useSessionGuard] 세션 확인 중 오류 — 유효한 것으로 간주:', e);
    return true;
  }
}

async function clearWalletUnlockCacheBeforeAuthClear(): Promise<void> {
  try {
    const [email, userDataStr] = await Promise.all([
      AsyncStorage.getItem('userEmail'),
      AsyncStorage.getItem('userData'),
    ]);
    const member = userDataStr ? JSON.parse(userDataStr)?.member : undefined;
    if (email && typeof member === 'number') {
      clearUserUnlock(email, member);
    }
  } catch (e) {
    console.warn('[useSessionGuard] 지갑 PIN 언락 캐시 클리어 실패 (userData 파싱):', e);
  }
}

export function useSessionGuard(screenName: string): void {
  const { t } = useTranslation();
  const { reset } = useAppNavigation();
  const { showAlert } = useAlertDialog();
  const handledRef = useRef(false);

  useEffect(() => {
    handledRef.current = false;
    let cancelled = false;

    (async () => {
      const valid = await checkSessionValid();
      if (cancelled || handledRef.current) return;
      if (valid) return;

      handledRef.current = true;
      console.warn(`[useSessionGuard] ${screenName} 진입 — 세션 만료/무효 감지, 로그인 화면으로 이동`);

      await clearWalletUnlockCacheBeforeAuthClear();

      try {
        await Promise.all([
          AsyncStorage.removeItem('isLoggedIn'),
          AsyncStorage.removeItem('rememberMe'),
          AsyncStorage.removeItem('jwt'),
          AsyncStorage.removeItem('userData'),
        ]);
      } catch (e) {
        console.warn('[useSessionGuard] auth state 클리어 실패:', e);
      }

      await showAlert(t('common.notice'), t('common.sessionExpired.message'));

      if (cancelled) return;

      reset(ROUTES.login);
    })();

    return () => {
      cancelled = true;
    };

  }, []);
}
