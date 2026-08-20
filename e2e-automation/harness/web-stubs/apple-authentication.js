

const { record: v_cbbd71 } = require('./record');

const v_33cb0a = {
  UNKNOWN: '1000',
  CANCELED: '1001',
  INVALID_RESPONSE: '1002',
  NOT_HANDLED: '1003',
  FAILED: '1004',
  NOT_AVAILABLE: '1005',
};

const v_d093db = {
  get isSupported() {
    return v_cbbd71('appleAuth.isSupported', [], true);
  },
  performRequest: async (...v_779914) => {
    v_cbbd71('appleAuth.performRequest', v_779914, undefined);
    const v_49263d = new Error('The user canceled the authorization attempt');
    v_49263d.code = v_33cb0a.CANCELED;
    throw v_49263d;
  },
  Operation: { IMPLICIT: 0, LOGIN: 1, REFRESH: 2, LOGOUT: 3 },
  Scope: { EMAIL: 0, FULL_NAME: 1 },
  Error: v_33cb0a,
};

module.exports = v_d093db;
module.exports.default = v_d093db;
module.exports.__esModule = true;
