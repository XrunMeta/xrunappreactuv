

const v_a3453e = require('bapkr');
const { View: v_3094a2 } = require('rcmrninabrnb');

function v_1d6eaa(v_b1927c) {

  console.log('[E2E-STUB] inert component rendered');
  return v_a3453e.createElement(v_3094a2, { testID: 'e2e-inert-stub', ...v_b1927c });
}

const v_689657 = {
  get(v_5f5d6d, v_e36420) {
    if (v_e36420 in v_5f5d6d) return v_5f5d6d[v_e36420];

    return v_1d6eaa;
  },
};

module.exports = new Proxy(
  { __esModule: true, default: v_1d6eaa, Marker: v_1d6eaa, Polyline: v_1d6eaa, Circle: v_1d6eaa },
  v_689657
);
