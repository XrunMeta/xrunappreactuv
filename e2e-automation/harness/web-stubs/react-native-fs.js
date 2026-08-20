

const { record } = require('./record');

const RNFS = {
  DocumentDirectoryPath: '/e2e/documents',
  CachesDirectoryPath: '/e2e/caches',
  TemporaryDirectoryPath: '/e2e/tmp',
  MainBundlePath: '/e2e/bundle',
  FileTypeRegular: 'regular',
  FileTypeDirectory: 'directory',
  exists: async (...a) => record('RNFS.exists', a, false),
  readFile: async (...a) => record('RNFS.readFile', a, ''),
  writeFile: async (...a) => record('RNFS.writeFile', a, undefined),
  unlink: async (...a) => record('RNFS.unlink', a, undefined),
  mkdir: async (...a) => record('RNFS.mkdir', a, undefined),
  readDir: async (...a) => record('RNFS.readDir', a, []),
  stat: async (...a) => record('RNFS.stat', a, { size: 0, isFile: () => false }),
  downloadFile: (...a) => record('RNFS.downloadFile', a, { promise: Promise.resolve({ statusCode: 200 }) }),
};

module.exports = RNFS;
module.exports.default = RNFS;
module.exports.__esModule = true;
