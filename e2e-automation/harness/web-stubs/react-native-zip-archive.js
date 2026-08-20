

const { record: v_cbbd71 } = require('./record');

module.exports = {
  __esModule: true,
  zip: async (...v_779914) => v_cbbd71('zip.zip', v_779914, '/e2e/out.zip'),
  unzip: async (...v_779914) => v_cbbd71('zip.unzip', v_779914, '/e2e/out'),
  unzipAssets: async (...v_779914) => v_cbbd71('zip.unzipAssets', v_779914, '/e2e/out'),
  subscribe: () => ({ remove() {} }),
  isPasswordProtected: async () => false,
};
