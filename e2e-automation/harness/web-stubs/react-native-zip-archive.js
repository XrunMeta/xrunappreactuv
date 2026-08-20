

const { record } = require('./record');

module.exports = {
  __esModule: true,
  zip: async (...a) => record('zip.zip', a, '/e2e/out.zip'),
  unzip: async (...a) => record('zip.unzip', a, '/e2e/out'),
  unzipAssets: async (...a) => record('zip.unzipAssets', a, '/e2e/out'),
  subscribe: () => ({ remove() {} }),
  isPasswordProtected: async () => false,
};
