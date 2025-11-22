import React, { useState, useEffect } from 'react';
import { LoginSignupScreen, SplashScreen } from './src/screens';

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

  return <LoginSignupScreen />;
}
