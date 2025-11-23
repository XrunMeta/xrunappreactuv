import React, { useEffect, useRef, useState } from 'react';
import { AppState, AppStateStatus } from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { sendAliveSignal } from '../services';
import { useAppContext } from '../context';
import { useAppNavigation } from '../navigation';
import { ROUTES } from '../navigation';

export const AliveService: React.FC = () => {
  const { setEmergencyStop } = useAppContext();
  const { reset } = useAppNavigation();
  const [failureCount, setFailureCount] = useState(0);
  const failureCountRef = useRef(0); 
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const appStateRef = useRef<AppStateStatus>(AppState.currentState);

  useEffect(() => {
    failureCountRef.current = failureCount;
  }, [failureCount]);

  const sendAlive = async () => {
    try {
      const response = await sendAliveSignal();

      if (response.success) {

        setFailureCount(0);
        failureCountRef.current = 0;

        if (response.emergencyStop?.enabled) {
          setEmergencyStop({
            enabled: true,
            message: response.emergencyStop.message,
            link: response.emergencyStop.link,
          });
        } else {

          setEmergencyStop(null);
        }
      } else {

        handleFailure();
      }
    } catch (error) {

      console.error('Alive signal error:', error);
      handleFailure();
    }
  };

  const handleFailure = async () => {
    const newFailureCount = failureCountRef.current + 1;
    setFailureCount(newFailureCount);
    failureCountRef.current = newFailureCount;

    if (newFailureCount >= 2) {
      try {
        const isLoggedIn = await AsyncStorage.getItem('isLoggedIn');

        if (isLoggedIn === 'true') {

          reset(ROUTES.map);
        } else {

          reset(ROUTES.login);
        }

        setFailureCount(0);
        failureCountRef.current = 0;
      } catch (error) {
        console.error('Failed to handle alive signal failure:', error);

        reset(ROUTES.login);
        setFailureCount(0);
        failureCountRef.current = 0;
      }
    }
  };

  const handleAppStateChange = (nextAppState: AppStateStatus) => {
    if (
      appStateRef.current.match(/inactive|background/) &&
      nextAppState === 'active'
    ) {

      sendAlive();
      startInterval();
    } else if (
      appStateRef.current === 'active' &&
      nextAppState.match(/inactive|background/)
    ) {

      stopInterval();
    }

    appStateRef.current = nextAppState;
  };

  const startInterval = () => {

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    intervalRef.current = setInterval(() => {
      sendAlive();
    }, 30000); 
  };

  const stopInterval = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  useEffect(() => {

    sendAlive();

    startInterval();

    const subscription = AppState.addEventListener('change', handleAppStateChange);

    return () => {
      stopInterval();
      subscription.remove();
    };
  }, []); 

  return null;
};

