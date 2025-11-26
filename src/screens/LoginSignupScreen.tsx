import v_a3453e from 'bapkr';
import { v_3094a2, v_19b633, v_472849, v_122070, v_326be8, v_4623af } from 'rcmrninabrnb';
import { v_b5df25 } from 'ernurodqvmtspux';
import { v_772971 } from 'jmpfvteuuztnp';
import { v_2694e4 } from 'ahewcyoxtiosvtfuluxp';
import { v_cb41de, v_8714fe, v_c436cb, v_27ace7 } from '../components';
import { v_dc5d8f, v_995f93, v_33aee4, v_968eda, v_0433f6 } from '../services/taboola';
import { v_1bfbd0, v_9b1a04, v_a61db3 } from '../constants';
import { v_ce4741, v_a0daa8 } from '../navigation';

export const v_54d331 = () => {
  const { navigate: v_9b57fc } = v_a0daa8();
  const { t: v_8d41d7 } = v_772971();

  const v_f36218 = v_dc5d8f('apploading', true);
  const v_74a79c = v_968eda[v_f36218];
  const v_cdfaaa = v_33aee4();
  const v_26f42c = v_995f93();

  console.log('[LoginSignupScreen] Taboola 설정:', {
    placement: v_f36218,
    publisherId: v_26f42c,
    pageUrl: v_cdfaaa,
    isNativeAvailable: v_27ace7(),
  });

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
    <View style={v_d81136.container}>
      <StatusBar style="dark" />
      <ScrollView
        contentContainerStyle={v_d81136.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {}
        <View style={v_d81136.adContainer}>
          {v_27ace7() ? (
            <TaboolaNativeView
              publisherId={v_995f93()}
              placement={v_74a79c.placement}
              mode={v_74a79c.mode}
              pageUrl={v_cdfaaa}
              pageType={v_74a79c.pageType}
              targetType={v_74a79c.targetType}
              style={v_d81136.adWebView}
            />
          ) : (
            <WebView
              source={{
                html: v_0433f6(
                  v_26f42c,
                  v_74a79c.placement,
                  v_74a79c.mode,
                  v_cdfaaa,
                  v_74a79c.pageType,
                  v_74a79c.targetType,
                ),
              }}
              style={v_d81136.adWebView}
              scrollEnabled={true}
              showsVerticalScrollIndicator={false}
              showsHorizontalScrollIndicator={false}
              javaScriptEnabled={true}
              domStorageEnabled={true}
              startInLoadingState={false}
              backgroundColor="#ffffff"
              allowsInlineMediaPlayback={true}
              mediaPlaybackRequiresUserAction={false}
              mixedContentMode="always"
              originWhitelist={['*']}
              thirdPartyCookiesEnabled={true}
              sharedCookiesEnabled={true}
              userAgent="Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1"
              onLoadStart={() => {
                console.log('[LoginSignupScreen] Taboola WebView 로드 시작');
              }}
              onLoadEnd={() => {
                console.log('[LoginSignupScreen] Taboola WebView 로드 완료');
              }}
              onError={(v_6f3a9d) => {
                const { nativeEvent: v_76b943 } = v_6f3a9d;
                console.error('[LoginSignupScreen] Taboola WebView 오류:', v_76b943);
              }}
              onMessage={(v_d48baf) => {
                try {
                  const v_9390e8 = JSON.parse(v_d48baf.nativeEvent.data);
                  console.log('[LoginSignupScreen] Taboola WebView 메시지:', v_9390e8);
                } catch (v_9e86fd) {
                  console.log('[LoginSignupScreen] Taboola WebView 원시 메시지:', v_d48baf.nativeEvent.data);
                }
              }}
            />
          )}
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
      </ScrollView>

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
    flex: 1,
    backgroundColor: v_1bfbd0.background,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 58, 
    paddingBottom: v_326be8.OS === 'android' 
      ? 16 + v_9b1a04.medium 
      : 34,
    justifyContent: 'space-between',
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
    ...v_a61db3.bottomSection,
  },
  termsText: {
    fontSize: 12,
    lineHeight: 15,
    color: '#4c4e55',
    fontFamily: 'Roboto-Regular',
    textAlign: 'left',
    letterSpacing: 0.06,
  },
  linkText: {
    fontSize: 12,
    lineHeight: 15,
    color: '#4c4e55',
    fontFamily: 'Roboto-Bold',
    fontWeight: 'bold',
    letterSpacing: 0.06,
  },
  previewLink: {
    marginTop: 12,
    fontSize: 13,
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
});

