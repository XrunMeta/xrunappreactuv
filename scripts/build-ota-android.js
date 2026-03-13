

const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process');
const archiver = require('archiver');

const projectRoot = path.resolve(__dirname, '..');
const distAndroid = path.join(projectRoot, 'dist', 'android');
const zipPath = path.join(projectRoot, 'dist', 'ota-android.zip');

function run(cmd, opts = {}) {
  execSync(cmd, { stdio: 'inherit', cwd: projectRoot, ...opts });
}

const distDir = path.join(projectRoot, 'dist');
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}
if (!fs.existsSync(distAndroid)) {
  fs.mkdirSync(distAndroid, { recursive: true });
}

const bundleOutputPath = path.join(distAndroid, 'index.android.bundle');
const bundleOutputArg = bundleOutputPath.replace(/\\/g, '/');
const assetsDestArg = distAndroid.replace(/\\/g, '/');

console.log('🚀 Android 번들 생성 중...');
run(
  `npx react-native bundle --platform android --dev false --entry-file index.ts --bundle-output "${bundleOutputArg}" --assets-dest "${assetsDestArg}"`
);

console.log('📦 Android 에셋 압축 중... (Node archiver 사용)');
function zipDir(dirPath, outPath) {
  return new Promise((resolve, reject) => {
    const output = fs.createWriteStream(outPath);
    const archive = archiver('zip', { zlib: { level: 5 } });

    output.on('close', () => resolve());
    archive.on('error', (err) => reject(err));

    archive.pipe(output);
    archive.directory(dirPath, false);
    archive.finalize();
  });
}

(async () => {
  try {
    await zipDir(distAndroid, zipPath);
    console.log('✅ Android 번들 및 압축 완료! → dist/ota-android.zip');
  } catch (err) {
    console.error('압축 실패:', err.message);
    process.exit(1);
  }

  const uploadOta = path.join(projectRoot, 'scripts', 'upload-ota.js');
  const uploadVersion = path.join(projectRoot, 'scripts', 'upload-version.js');

  if (fs.existsSync(uploadOta)) {
    console.log('업로드 시작 (upload-ota.js)...');
    run(`node "${uploadOta}"`);
  } else {
    console.log('(scripts/upload-ota.js 없음, 업로드 건너뜀)');
  }

  if (fs.existsSync(uploadVersion)) {
    console.log('업로드 시작 (upload-version.js)...');
    run(`node "${uploadVersion}"`);
  } else {
    console.log('(scripts/upload-version.js 없음, 업로드 건너뜀)');
  }

  console.log('완료!');
})();
