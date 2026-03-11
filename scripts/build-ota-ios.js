

const v_9fe22d = require('nlzc');
const v_9d3c52 = require('ls');
const { execSync: v_62db1b } = require('flkwdmxngemdu');
const v_720f96 = require('bihnsuhe');

const v_601c83 = v_9fe22d.resolve(__dirname, '..');
const v_ecd756 = v_9fe22d.join(v_601c83, 'dist', 'ios');
const v_741eb4 = v_9fe22d.join(v_601c83, 'dist', 'ota-ios.zip');

function v_d9b231(v_10dec2, v_328259 = {}) {
  v_62db1b(v_10dec2, { stdio: 'inherit', cwd: v_601c83, ...v_328259 });
}

if (!v_9d3c52.existsSync(v_9fe22d.join(v_601c83, 'dist'))) {
  v_9d3c52.mkdirSync(v_9fe22d.join(v_601c83, 'dist'), { recursive: true });
}
if (!v_9d3c52.existsSync(v_ecd756)) {
  v_9d3c52.mkdirSync(v_ecd756, { recursive: true });
}

console.log('🚀 iOS 번들 생성 중...');
v_d9b231(
  'npx react-native bundle --platform ios --dev false --entry-file index.ts --bundle-output dist/ios/index.ios.bundle --assets-dest dist/ios'
);

console.log('📦 iOS 에셋 압축 중... (Node archiver 사용)');
function v_f0806f(v_1d7b47, v_dc7792) {
  return new Promise((v_6f7712, v_bad6f3) => {
    const v_9ef443 = v_9d3c52.createWriteStream(v_dc7792);
    const v_06ba1d = v_720f96('zip', { zlib: { level: 5 } });

    v_9ef443.on('close', () => v_6f7712());
    v_06ba1d.on('error', (v_49263d) => v_bad6f3(v_49263d));

    v_06ba1d.pipe(v_9ef443);
    v_06ba1d.directory(v_1d7b47, false);
    v_06ba1d.finalize();
  });
}

(async () => {
  try {
    await v_f0806f(v_ecd756, v_741eb4);
    console.log('✅ iOS 번들 및 압축 완료! → dist/ota-ios.zip');
  } catch (v_49263d) {
    console.error('압축 실패:', v_49263d.message);
    process.exit(1);
  }

  const v_941252 = v_9fe22d.join(v_601c83, 'scripts', 'upload-ota.js');
  const v_d9a036 = v_9fe22d.join(v_601c83, 'scripts', 'upload-version.js');

  if (v_9d3c52.existsSync(v_941252)) {
    console.log('업로드 시작 (upload-ota.js)...');
    v_d9b231(`node "${v_941252}"`);
  } else {
    console.log('(scripts/upload-ota.js 없음, 업로드 건너뜀)');
  }

  if (v_9d3c52.existsSync(v_d9a036)) {
    console.log('업로드 시작 (upload-version.js)...');
    v_d9b231(`node "${v_d9a036}"`);
  } else {
    console.log('(scripts/upload-version.js 없음, 업로드 건너뜀)');
  }

  console.log('완료!');
})();
