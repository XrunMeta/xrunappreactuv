

const { record: v_cbbd71 } = require('./record');

const v_8d3720 = {
  SIGN_IN_CANCELLED: 'SIGN_IN_CANCELLED',
  IN_PROGRESS: 'IN_PROGRESS',
  PLAY_SERVICES_NOT_AVAILABLE: 'PLAY_SERVICES_NOT_AVAILABLE',
  SIGN_IN_REQUIRED: 'SIGN_IN_REQUIRED',
};

const v_4eac84 = {
  configure: (...v_779914) => v_cbbd71('GoogleSignin.configure', v_779914, undefined),
  hasPlayServices: async (...v_779914) => v_cbbd71('GoogleSignin.hasPlayServices', v_779914, true),
  signOut: async (...v_779914) => v_cbbd71('GoogleSignin.signOut', v_779914, undefined),
  signIn: async (...v_779914) => {
    v_cbbd71('GoogleSignin.signIn', v_779914, undefined);

    const v_49263d = new Error('Sign in action cancelled');
    v_49263d.code = v_8d3720.SIGN_IN_CANCELLED;
    throw v_49263d;
  },
};

module.exports = { GoogleSignin: v_4eac84, statusCodes: v_8d3720 };
