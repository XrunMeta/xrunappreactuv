const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);
const defaultResolveRequest = config.resolver.resolveRequest;

config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (moduleName === '@iabtcf/core') {
    const cjsPath = path.resolve(__dirname, 'node_modules/@iabtcf/core/lib/cjs/index.js');
    return { type: 'sourceFile', filePath: cjsPath };
  }
  return defaultResolveRequest ? defaultResolveRequest(context, moduleName, platform) : context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
