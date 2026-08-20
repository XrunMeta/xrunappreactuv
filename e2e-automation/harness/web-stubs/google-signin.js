

const { record } = require('./record');

const statusCodes = {
  SIGN_IN_CANCELLED: 'SIGN_IN_CANCELLED',
  IN_PROGRESS: 'IN_PROGRESS',
  PLAY_SERVICES_NOT_AVAILABLE: 'PLAY_SERVICES_NOT_AVAILABLE',
  SIGN_IN_REQUIRED: 'SIGN_IN_REQUIRED',
};

const GoogleSignin = {
  configure: (...a) => record('GoogleSignin.configure', a, undefined),
  hasPlayServices: async (...a) => record('GoogleSignin.hasPlayServices', a, true),
  signOut: async (...a) => record('GoogleSignin.signOut', a, undefined),
  signIn: async (...a) => {
    record('GoogleSignin.signIn', a, undefined);

    const err = new Error('Sign in action cancelled');
    err.code = statusCodes.SIGN_IN_CANCELLED;
    throw err;
  },
};

module.exports = { GoogleSignin, statusCodes };
