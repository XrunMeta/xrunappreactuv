import React, { useState, useEffect } from 'react';
import { LoginScreen, LoginSignupScreen, SplashScreen } from './src/screens';

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [currentScreen, setCurrentScreen] = useState<'authLanding' | 'login'>(
    'authLanding',
  );

  useEffect(() => {

    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <SplashScreen />;
  }

  if (currentScreen === 'login') {
    return <LoginScreen onBackPress={() => setCurrentScreen('authLanding')} />;
  }

  return (
    <LoginSignupScreen onLoginPress={() => setCurrentScreen('login')} />
  );
}
