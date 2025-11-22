import React, { useState, useEffect } from 'react';
import {
  LoginScreen,
  LoginSignupScreen,
  SignupScreen,
  SplashScreen,
} from './src/screens';
import { NavigationProvider, useAppNavigation } from './src/navigation';
import {
  useFonts,
  Roboto_400Regular,
  Roboto_500Medium,
  Roboto_600SemiBold,
  Roboto_700Bold,
} from '@expo-google-fonts/roboto';

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
  const [fontsLoaded] = useFonts({
    'Roboto-Regular': Roboto_400Regular,
    'Roboto-Medium': Roboto_500Medium,
    'Roboto-SemiBold': Roboto_600SemiBold,
    'Roboto-Bold': Roboto_700Bold,
  });

  useEffect(() => {

    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (!fontsLoaded || isLoading) {
    return <SplashScreen />;
  }

  return (
    <NavigationProvider>
      <ScreenHost />
    </NavigationProvider>
  );
}
