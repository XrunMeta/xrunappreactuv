

const { record: v_cbbd71 } = require('./record');

const v_e23cc8 = {
  DocumentDirectoryPath: '/e2e/documents',
  CachesDirectoryPath: '/e2e/caches',
  TemporaryDirectoryPath: '/e2e/tmp',
  MainBundlePath: '/e2e/bundle',
  FileTypeRegular: 'regular',
  FileTypeDirectory: 'directory',
  exists: async (...v_779914) => v_cbbd71('RNFS.exists', v_779914, false),
  readFile: async (...v_779914) => v_cbbd71('RNFS.readFile', v_779914, ''),
  writeFile: async (...v_779914) => v_cbbd71('RNFS.writeFile', v_779914, undefined),
  unlink: async (...v_779914) => v_cbbd71('RNFS.unlink', v_779914, undefined),
  mkdir: async (...v_779914) => v_cbbd71('RNFS.mkdir', v_779914, undefined),
  readDir: async (...v_779914) => v_cbbd71('RNFS.readDir', v_779914, []),
  stat: async (...v_779914) => v_cbbd71('RNFS.stat', v_779914, { size: 0, isFile: () => false }),
  downloadFile: (...v_779914) => v_cbbd71('RNFS.downloadFile', v_779914, { promise: Promise.resolve({ statusCode: 200 }) }),
};

module.exports = v_e23cc8;
module.exports.default = v_e23cc8;
module.exports.__esModule = true;
