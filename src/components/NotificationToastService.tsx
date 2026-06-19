import React, { useEffect, useRef } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from 'react-i18next';
import { getNotificationList } from '../services';
import { showToast } from '../utils';

export const NotificationToastService: React.FC = () => {
  const { t } = useTranslation();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const appStateRef = useRef<AppStateStatus>(AppState.currentState);
  const inflightRef = useRef<boolean>(false);

  const toUtcMs = (raw: unknown): number => {
    const s = String(raw ?? '').trim();
    if (!s) return 0;
    const iso = s.includes('T') ? s : s.replace(' ', 'T') + (s.endsWith('Z') ? '' : 'Z');
    return new Date(iso).getTime();
  };

  const checkAndToast = async () => {
    if (inflightRef.current) return;
    inflightRef.current = true;
    try {
      const userDataStr = await AsyncStorage.getItem('userData');
      if (!userDataStr) return;
      const userData = JSON.parse(userDataStr);
      const member = userData?.member;
      if (!member) return;

      const response = await getNotificationList(member, 0);
      if (!response?.data || response.data.length === 0) return;

      const lastToastedRaw = await AsyncStorage.getItem('lastToastedNotificationTime');
      const lastToasted = lastToastedRaw ? new Date(lastToastedRaw).getTime() : 0;

      const untoasted = response.data.filter((n: any) => {
        const t = toUtcMs(n.datetime);
        return t > lastToasted;
      });
      if (untoasted.length === 0) return;

      const displayable = untoasted.filter((n: any) => Number(n.type) !== 9303);
      if (displayable.length > 0) {
        const latest = displayable[0];

        const more = displayable.length > 1
          ? t('screens.myInfoNotify.toast.moreCount', { count: displayable.length - 1 })
          : '';
        const type = Number(latest.type);
        const baseMsg = type === 9304
          ? t('screens.myInfoNotify.toast.inquiryReplyArrived')
          : (latest.title || t('screens.myInfoNotify.toast.newNotification'));
        showToast(`${baseMsg}${more}`);
      }

      const maxMs = Math.max(...untoasted.map((n: any) => toUtcMs(n.datetime)));
      if (maxMs > 0) {
        await AsyncStorage.setItem('lastToastedNotificationTime', new Date(maxMs).toISOString());
      }
    } catch (e) {

    } finally {
      inflightRef.current = false;
    }
  };

  const startInterval = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(checkAndToast, 30000);
  };
  const stopInterval = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  useEffect(() => {

    checkAndToast();
    startInterval();

    const sub = AppState.addEventListener('change', (nextAppState) => {
      const wasBackground = !!appStateRef.current.match(/inactive|background/);
      const isNowActive = nextAppState === 'active';
      if (wasBackground && isNowActive) {

        checkAndToast();
        startInterval();
      } else if (
        appStateRef.current === 'active' &&
        nextAppState.match(/inactive|background/)
      ) {
        stopInterval();
      }
      appStateRef.current = nextAppState;
    });

    return () => {
      stopInterval();
      sub.remove();
    };
  }, []); 

  return null;
};
