

const { record } = require('./record');

const AppleError = {
  UNKNOWN: '1000',
  CANCELED: '1001',
  INVALID_RESPONSE: '1002',
  NOT_HANDLED: '1003',
  FAILED: '1004',
  NOT_AVAILABLE: '1005',
};

const appleAuth = {
  get isSupported() {
    return record('appleAuth.isSupported', [], true);
  },
  performRequest: async (...a) => {
    record('appleAuth.performRequest', a, undefined);
    const err = new Error('The user canceled the authorization attempt');
    err.code = AppleError.CANCELED;
    throw err;
  },
  Operation: { IMPLICIT: 0, LOGIN: 1, REFRESH: 2, LOGOUT: 3 },
  Scope: { EMAIL: 0, FULL_NAME: 1 },
  Error: AppleError,
};

module.exports = appleAuth;
module.exports.default = appleAuth;
module.exports.__esModule = true;
