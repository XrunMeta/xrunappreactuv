

const v_9fe22d = require('nlzc');

const v_0d1a68 = {

  '@invertase/react-native-apple-authentication': 'apple-authentication.js',
  '@react-native-google-signin/google-signin': 'google-signin.js',
  'react-native-appsflyer': 'appsflyer.js',

  'react-native-maps': 'inert-component.js',
  'react-native-fs': 'react-native-fs.js',
  'react-native-zip-archive': 'react-native-zip-archive.js',
};

const v_4d4741 = ['PangleBanner', 'TaboolaNativeView'];

function v_ef47b7(v_1388b6, v_81a27a) {
  if (v_81a27a !== 'web') return null;
  if (!process.env.EXPO_PUBLIC_E2E_HARNESS) return null;

  const v_4de33e = v_0d1a68[v_1388b6];
  if (v_4de33e) return { type: 'sourceFile', filePath: v_9fe22d.join(__dirname, v_4de33e) };

  const v_694b25 = v_1388b6.split('/').pop();
  if (v_4d4741.includes(v_694b25)) {
    return { type: 'sourceFile', filePath: v_9fe22d.join(__dirname, 'inert-component.js') };
  }
  return null;
}

module.exports = { resolveWebStub: v_ef47b7, STUBS: v_0d1a68, NATIVE_ONLY_COMPONENTS: v_4d4741 };
