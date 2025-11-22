import v_a3453e, {
  v_af12cb,
  v_de06a3,
  v_76a8a9,
  v_df9f57,
  v_5ab095,
} from 'bapkr';

export type ScreenName = 'authLanding' | 'login' | 'signup';

interface NavigationContextValue {
  currentScreen: ScreenName;
  navigate: (screen: ScreenName) => void;
  goBack: () => void;
  reset: (screen: ScreenName) => void;
  canGoBack: boolean;
}

const v_e7c788 = v_af12cb<NavigationContextValue | undefined>(
  undefined,
);

export const NavigationProvider: v_a3453e.FC<{ children: v_a3453e.ReactNode }> = ({
  children: v_21f619,
}) => {
  const [v_8d490a, v_768005] = v_5ab095<ScreenName[]>(['authLanding']);

  const v_0f0c7b = v_8d490a[v_8d490a.length - 1];

  const v_9b57fc = v_de06a3((v_53746a) => {
    v_768005((v_ba2215) => {
      if (v_ba2215[v_ba2215.length - 1] === v_53746a) {
        return v_ba2215;
      }
      return [...v_ba2215, v_53746a];
    });
  }, []);

  const v_c7ac57 = v_de06a3(() => {
    v_768005((v_ba2215) => {
      if (v_ba2215.length <= 1) {
        return v_ba2215;
      }
      return v_ba2215.slice(0, -1);
    });
  }, []);

  const v_487a25 = v_de06a3((v_53746a) => {
    v_768005([v_53746a]);
  }, []);

  const v_3b402b = v_df9f57(
    () => ({
      currentScreen: v_0f0c7b,
      navigate: v_9b57fc,
      goBack: v_c7ac57,
      reset: v_487a25,
      canGoBack: v_8d490a.length > 1,
    }),
    [v_0f0c7b, v_9b57fc, v_c7ac57, v_487a25, v_8d490a.length],
  );

  return (
    <NavigationContext.Provider value={v_3b402b}>
      {v_21f619}
    </NavigationContext.Provider>
  );
};

export const v_a0daa8 = () => {
  const v_e3aeb3 = v_76a8a9(v_e7c788);

  if (!v_e3aeb3) {
    throw new Error('useAppNavigation must be used within NavigationProvider');
  }

  return v_e3aeb3;
};
