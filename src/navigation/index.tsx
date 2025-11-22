import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';

export const ROUTES = {
  authLanding: 'authLanding',
  login: 'login',
  signup: 'signup',
  emailVerification: 'emailVerification',
  verificationCode: 'verificationCode',
  terms: 'terms',
  privacy: 'privacy',
  wallet: 'wallet',
  map: 'map',
} as const;

export type ScreenName = keyof typeof ROUTES | (string & {});

interface NavigationContextValue {
  currentScreen: ScreenName;
  navigate: (screen: ScreenName) => void;
  goBack: () => void;
  reset: (screen: ScreenName) => void;
  canGoBack: boolean;
}

const NavigationContext = createContext<NavigationContextValue | undefined>(
  undefined,
);

export const NavigationProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [stack, setStack] = useState<ScreenName[]>(['authLanding']);

  const currentScreen = stack[stack.length - 1];

  const navigate = useCallback((screen: ScreenName) => {
    setStack((prev) => {
      if (prev[prev.length - 1] === screen) {
        return prev;
      }
      return [...prev, screen];
    });
  }, []);

  const goBack = useCallback(() => {
    setStack((prev) => {
      if (prev.length <= 1) {
        return prev;
      }
      return prev.slice(0, -1);
    });
  }, []);

  const reset = useCallback((screen: ScreenName) => {
    setStack([screen]);
  }, []);

  const value = useMemo(
    () => ({
      currentScreen,
      navigate,
      goBack,
      reset,
      canGoBack: stack.length > 1,
    }),
    [currentScreen, navigate, goBack, reset, stack.length],
  );

  return (
    <NavigationContext.Provider value={value}>
      {children}
    </NavigationContext.Provider>
  );
};

export const useAppNavigation = () => {
  const context = useContext(NavigationContext);

  if (!context) {
    throw new Error('useAppNavigation must be used within NavigationProvider');
  }

  return context;
};
