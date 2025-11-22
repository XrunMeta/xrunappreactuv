import v_a3453e, { v_5ab095, v_c4deb2 } from 'bapkr';
import {
  v_a82b55,
  v_f4f851,
  v_54d331,
  v_f40fc5,
  v_7c6176,
  v_d3f135,
  v_086cde,
  v_667a00,
  v_952e24,
  v_94455f,
  v_ab7114,
  v_7c7410,
  v_7e9335,
  v_5ea6a6,
} from './src/screens';
import { v_00e8f9, v_a0daa8 } from './src/navigation';
import {
  v_c06f2c,
  v_259807,
  v_b1350e,
  v_f2f1ae,
  v_567640,
} from 'duafkibkrsnlsywaptcqakgas';

const v_c0dbdf = () => {
  const { currentScreen: v_0f0c7b } = v_a0daa8();

  if (v_0f0c7b === 'login') {
    return <LoginScreen />;
  }

  if (v_0f0c7b === 'signup') {
    return <SignupScreen />;
  }

  if (v_0f0c7b === 'emailVerification') {
    return <EmailVerificationScreen />;
  }

  if (v_0f0c7b === 'verificationCode') {
    return <VerificationCodeScreen />;
  }

  if (v_0f0c7b === 'terms') {
    return <TermsScreen />;
  }

  if (v_0f0c7b === 'privacy') {
    return <PrivacyPolicyScreen />;
  }

  if (v_0f0c7b === 'wallet') {
    return <WalletScreen />;
  }

  if (v_0f0c7b === 'polygonHistory') {
    return <PolygonWalletScreen />;
  }

  if (v_0f0c7b === 'xrunHistory') {
    return <XrunWalletScreen />;
  }

  if (v_0f0c7b === 'nftHistory') {
    return <NftWalletScreen />;
  }

  if (v_0f0c7b === 'xrunHistory2') {
    return <XrunWalletScreen2 />;
  }

  if (v_0f0c7b === 'adHistory') {
    return <AdWalletScreen />;
  }

  return <LoginSignupScreen />;
};

export default function v_6540c3() {
  const [v_cd31a8, v_deef62] = v_5ab095(true);
  const [v_43f571] = v_c06f2c({
    'Roboto-Regular': v_259807,
    'Roboto-Medium': v_b1350e,
    'Roboto-SemiBold': v_f2f1ae,
    'Roboto-Bold': v_567640,
  });

  v_c4deb2(() => {

    const v_cb36b1 = setTimeout(() => {
      v_deef62(false);
    }, 2000);

    return () => clearTimeout(v_cb36b1);
  }, []);

  if (!v_43f571 || v_cd31a8) {
    return <SplashScreen />;
  }

  return (
    <NavigationProvider>
      <ScreenHost />
    </NavigationProvider>
  );
}
