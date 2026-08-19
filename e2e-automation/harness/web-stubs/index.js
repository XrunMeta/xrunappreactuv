

const path = require('path');

const STUBS = {

  '@invertase/react-native-apple-authentication': 'apple-authentication.js',
  '@react-native-google-signin/google-signin': 'google-signin.js',
  'react-native-appsflyer': 'appsflyer.js',

  'react-native-maps': 'inert-component.js',
  'react-native-fs': 'react-native-fs.js',
  'react-native-zip-archive': 'react-native-zip-archive.js',
};

const NATIVE_ONLY_COMPONENTS = ['PangleBanner', 'TaboolaNativeView'];

function resolveWebStub(moduleName, platform) {
  if (platform !== 'web') return null;
  if (!process.env.EXPO_PUBLIC_E2E_HARNESS) return null;

  const file = STUBS[moduleName];
  if (file) return { type: 'sourceFile', filePath: path.join(__dirname, file) };

  const base = moduleName.split('/').pop();
  if (NATIVE_ONLY_COMPONENTS.includes(base)) {
    return { type: 'sourceFile', filePath: path.join(__dirname, 'inert-component.js') };
  }
  return null;
}

module.exports = { resolveWebStub, STUBS, NATIVE_ONLY_COMPONENTS };
