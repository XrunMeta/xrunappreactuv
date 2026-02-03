#!/bin/bash

# dist 폴더가 없으면 생성
mkdir -p dist

echo "🚀 Android 번들 생성 중..."
npx react-native bundle --platform android --dev false --entry-file index.ts --bundle-output dist/index.android.bundle --assets-dest dist

echo "🚀 iOS 번들 생성 중..."
npx react-native bundle --platform ios --dev false --entry-file index.ts --bundle-output dist/index.ios.bundle --assets-dest dist

echo "✅ 번들 생성 완료! dist 폴더 내의 index.android.bundle 및 index.ios.bundle 파일을 R2에 업로드하세요."
