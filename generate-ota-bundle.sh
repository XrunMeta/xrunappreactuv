#!/bin/bash

# dist 폴더가 없으면 생성, 있으면 내부 정리
rm -rf dist
mkdir -p dist/android
mkdir -p dist/ios

echo "🚀 Android 번들 생성 중..."
npx react-native bundle --platform android --dev false --entry-file index.ts --bundle-output dist/android/index.android.bundle --assets-dest dist/android

echo "📦 Android 에셋 압축 중..."
cd dist/android
zip -r -q ../ota-android.zip .
cd ../..

echo "🚀 iOS 번들 생성 중..."
npx react-native bundle --platform ios --dev false --entry-file index.ts --bundle-output dist/ios/index.ios.bundle --assets-dest dist/ios

echo "📦 iOS 에셋 압축 중..."
cd dist/ios
zip -r -q ../ota-ios.zip .
cd ../..

echo "✅ 번들 및 압축 완료!"
echo "📄 Android: dist/ota-android.zip"
echo "📄 iOS: dist/ota-ios.zip"
echo "업로드 시작..."

node scripts/upload-ota.js
node scripts/upload-version.js

echo "업로드 완료!"


