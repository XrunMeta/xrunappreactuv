import v_a3453e, { v_5ab095, v_c4deb2 } from 'bapkr';
import { v_c316d8, v_7c6176 } from './src/screens';

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

  return <HomeScreen />;
}
