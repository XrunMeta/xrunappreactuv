

const { record } = require('./record');

const appsFlyer = {
  logEvent: (...a) => record('appsFlyer.logEvent', a, Promise.resolve()),
};

module.exports = appsFlyer;
module.exports.default = appsFlyer;
module.exports.__esModule = true;
