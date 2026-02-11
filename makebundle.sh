npx react-native bundle \
  --platform android \
  --dev false \
  --entry-file App.tsx \
  --bundle-output ./build/android/index.android.bundle \
  --assets-dest ./build/android/res \
  --reset-cache
