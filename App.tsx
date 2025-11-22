import v_a3453e, { v_5ab095, v_c4deb2 } from 'bapkr';
import {
  v_f4f851,
  v_54d331,
  v_f40fc5,
  v_7c6176,
} from './src/screens';
import { v_00e8f9, v_a0daa8 } from './src/navigation';

const v_c0dbdf = () => {
  const { currentScreen: v_0f0c7b } = v_a0daa8();

  if (v_0f0c7b === 'login') {
    return <LoginScreen />;
  }

  if (v_0f0c7b === 'signup') {
    return <SignupScreen />;
  }

  return <LoginSignupScreen />;
};

export default function v_6540c3() {
  const [v_cd31a8, v_deef62] = v_5ab095(true);

  v_c4deb2(() => {

    const v_cb36b1 = setTimeout(() => {
      v_deef62(false);
    }, 2000);

    return () => clearTimeout(v_cb36b1);
  }, []);

  if (v_cd31a8) {
    return <SplashScreen />;
  }

  return (
    <NavigationProvider>
      <ScreenHost />
    </NavigationProvider>
  );
}
