import React, { useState, useEffect } from 'react';
import {
  LoginScreen,
  LoginSignupScreen,
  SignupScreen,
  SplashScreen,
} from './src/screens';
import { NavigationProvider, useAppNavigation } from './src/navigation';

const ScreenHost = () => {
  const { currentScreen } = useAppNavigation();

  if (currentScreen === 'login') {
    return <LoginScreen />;
  }

  if (currentScreen === 'signup') {
    return <SignupScreen />;
  }

  return <LoginSignupScreen />;
};

export default function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {

    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <SplashScreen />;
  }

  return (
    <NavigationProvider>
      <ScreenHost />
    </NavigationProvider>
  );
}
