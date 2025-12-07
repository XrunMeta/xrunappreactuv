import v_a3453e from 'bapkr';
import { v_3094a2, v_19b633, v_472849, v_326be8, v_4623af } from 'rcmrninabrnb';
import { v_b5df25 } from 'ernurodqvmtspux';
import { v_772971 } from 'jmpfvteuuztnp';
import { v_cb41de, v_8714fe, v_eaeabd, v_570c34 } from '../components';
import { v_dc5d8f, v_33aee4, v_ce593f } from '../services/taboola';
import { v_1bfbd0, v_9b1a04, v_a61db3, v_731ab4, v_843035 } from '../constants';
import { v_ce4741, v_a0daa8 } from '../navigation';
import { v_cc3e1f } from './CameraMainScreen';

export const v_54d331 = () => {
  const { navigate: v_9b57fc } = v_a0daa8();
  const { t: v_8d41d7 } = v_772971();

  const v_f36218 = v_dc5d8f('apploading', true);
  const v_cdfaaa = v_33aee4();

  const v_ec4736 = () => {
    v_9b57fc(v_ce4741.login);
  };

  const v_c5a058 = () => {
    v_9b57fc(v_ce4741.signup);
  };

  const v_f4f55f = () => {
    v_9b57fc(v_ce4741.terms);
  };

  const v_1354b4 = () => {
    v_9b57fc(v_ce4741.privacy);
  };

  const v_b315f8 = () => {
    v_9b57fc(v_ce4741.myInfo);
  };

  const v_3b9f13 = [

  ];

  return (
    <View style={v_d81136.container}>
      <StatusBar style="dark" />
      <SafeScrollView
        contentContainerStyle={v_d81136.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {}
        <View style={v_d81136.adContainer}>
          <TaboolaBannerCore
            placementType={v_f36218}
            pageUrl={v_cdfaaa}
            style={v_d81136.adWebView}
            containerStyle={v_d81136.adWebView}
          />
        </View>

        {}
        <View style={v_d81136.buttonContainer}>
          <PrimaryButton
            title={v_8d41d7('screens.loginSignup.loginButton')}
            onPress={v_ec4736}
            fullWidth={true}
            style={v_d81136.loginButton}
          />
          <SecondaryButton
            title={v_8d41d7('screens.loginSignup.signupButton')}
            onPress={v_c5a058}
            fullWidth={true}
          />
        </View>

        {}
        <View style={v_d81136.termsContainer}>
          <Text style={v_d81136.termsText}>
            {v_8d41d7('screens.loginSignup.termsText')}{' '}
            <Text style={v_d81136.linkText} onPress={v_f4f55f}>
              {v_8d41d7('screens.loginSignup.termsLink')}
            </Text>
            {' '}{v_8d41d7('screens.loginSignup.termsAnd')}{' '}
            <Text style={v_d81136.linkText} onPress={v_1354b4}>
              {v_8d41d7('screens.loginSignup.privacyLink')}
            </Text>
            {' '}{v_8d41d7('screens.loginSignup.termsAgree')}
          </Text>
        </View>

        {}
        {

}
      </SafeScrollView>

      {}
      {v_326be8.OS === 'ios' && (
        <View style={v_d81136.homeIndicator}>
          <View style={v_d81136.homeIndicatorBar} />
        </View>
      )}
    </View>
  );
};

const v_d81136 = v_472849.create({
  container: {
    ...v_a61db3.container,
  },
  scrollContent: {
    flexGrow: 1,
    ...v_a61db3.scrollContent,
  },
  adContainer: {
    width: '100%',
    height: 393,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 44, 
    alignSelf: 'center',
    overflow: 'hidden',
  },
  adWebView: {
    width: '100%',
    height: '100%',
    backgroundColor: '#ffffff',
    borderRadius: 10,
  },
  buttonContainer: {
    width: '100%',
    marginTop: 48, 
    gap: 15,
    alignSelf: 'center',
  },
  loginButton: {
    marginBottom: 0,
  },
  termsContainer: {
    ...v_a61db3.bottomButtonContainer,
  },
  termsText: {
    fontSize: v_843035.size.small,
    lineHeight: 15,
    color: '#4c4e55',
    fontFamily: 'Roboto-Regular',
    textAlign: 'left',
    letterSpacing: 0.06,
  },
  linkText: {
    fontSize: v_843035.size.small,
    lineHeight: 15,
    color: '#4c4e55',
    fontFamily: 'Roboto-Bold',
    fontWeight: 'bold',
    letterSpacing: 0.06,
  },
  previewLink: {
    marginTop: 12,
    fontSize: 14,
    color: v_1bfbd0.buttonPrimary,
    fontFamily: 'Roboto-SemiBold',
  },
  homeIndicator: {
    height: 34,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 9,
  },
  homeIndicatorBar: {
    width: 134,
    height: 5,
    backgroundColor: '#10192d',
    borderRadius: 100,
    marginBottom: 9,
  },
  devLinksContainer: {
    marginTop: 24,
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  devLinksTitle: {
    fontSize: v_843035.size.msmall,
    fontFamily: 'Roboto-Bold',
    fontWeight: 'bold',
    color: '#10192d',
    marginBottom: 12,
  },
  devLinksGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  devLinkButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#f5f5f5',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  devLinkText: {
    fontSize: v_843035.size.xsmall,
    fontFamily: 'Roboto-Regular',
    color: v_1bfbd0.buttonPrimary,
  },
});

