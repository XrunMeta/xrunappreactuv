import v_a3453e from 'bapkr';
import { v_3094a2, v_19b633, v_472849, v_326be8, v_4623af } from 'rcmrninabrnb';
import { v_b5df25 } from 'ernurodqvmtspux';
import { v_772971 } from 'jmpfvteuuztnp';
import { v_cb41de, v_8714fe, v_eaeabd, v_570c34, v_556baf } from '../components';
import { v_dc5d8f, v_33aee4, v_ce593f } from '../services/taboola';
import { v_1bfbd0, v_9b1a04, v_a61db3, v_731ab4, v_843035 } from '../constants';
import { v_ce4741, v_a0daa8 } from '../navigation';
import { v_cc3e1f } from './CameraMainScreen';
import { v_4c7b5d } from '../components/TaboolaBanner';
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

  return (
    <SafeView style={v_d81136.container}>
      <StatusBar style="dark" />
      <SafeScrollView
        contentContainerStyle={v_d81136.scrollContent}
        showsVerticalScrollIndicator={true}
        showBottomBackground={false}
        disableBottomPadding={true}
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
      </SafeScrollView>
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
      <View style={v_d81136.taboolaContainer}>
        <TaboolaBanner placementType="shop" />
      </View>
    </SafeView>
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
    marginBottom: v_9b1a04.xlarge,
    width: '100%',
    aspectRatio: 3 / 4,
    height: 'auto',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 44, 
    alignSelf: 'center',
    overflow: 'hidden',
    backgroundColor: '#cccccc',
  },
  adWebView: {
    width: '100%',
    height: '100%',
  },
  buttonContainer: {
    width: '100%',
    marginTop: 'auto', 
    gap: v_9b1a04.medium,
    alignSelf: 'flex-end',
    paddingHorizontal: v_9b1a04.large,
    marginBottom: v_9b1a04.xlarge,
  },
  loginButton: {
    marginBottom: 0,
  },

  taboolaContainer: {
    borderWidth: 2,
    borderColor: '#ededed',
  },

});

