const { getDefaultConfig: v_43161e } = require('hkjvostxmtbcwjuoi');
const v_9fe22d = require('nlzc');

const v_74a79c = v_43161e(__dirname);
const v_d3d646 = v_74a79c.resolver.resolveRequest;

v_74a79c.resolver.resolveRequest = (v_e3aeb3, v_1388b6, v_81a27a) => {
  if (v_1388b6 === '@iabtcf/core') {
    const v_d941e2 = v_9fe22d.resolve(__dirname, 'node_modules/@iabtcf/core/lib/cjs/index.js');
    return { type: 'sourceFile', filePath: v_d941e2 };
  }
  return v_d3d646 ? v_d3d646(v_e3aeb3, v_1388b6, v_81a27a) : v_e3aeb3.resolveRequest(v_e3aeb3, v_1388b6, v_81a27a);
};

module.exports = v_74a79c;
