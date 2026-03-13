#!/bin/bash
# iOS OTA 번들만 생성 후 업로드 (Android 건드리지 않음)

set -e
mkdir -p dist/ios

echo "🚀 iOS 번들 생성 중..."
npx react-native bundle --platform ios --dev false --entry-file index.ts --bundle-output dist/ios/index.ios.bundle --assets-dest dist/ios

echo "📦 iOS 에셋 압축 중..."
cd dist/ios
zip -r -q ../ota-ios.zip .
cd ../..

echo "✅ iOS 번들 및 압축 완료! → dist/ota-ios.zip"
echo "업로드 시작..."
node scripts/upload-ota.js
node scripts/upload-version.js
echo "업로드 완료!"
