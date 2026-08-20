const BOOT_SLOW = '[!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!부팅 느림]';
console.log(BOOT_SLOW, '1. 엔트리 포인트 실행 (index.ts 최상단)');

import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { registerRootComponent } from 'expo';
import { loadEnvSync } from './src/utils/env';

const envStart = Date.now();
loadEnvSync();
console.log(BOOT_SLOW, '2. index.ts loadEnvSync 완료', `${Date.now() - envStart}ms`);

const loadingStyle = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});

function Root() {
  const [AppComponent, setAppComponent] = useState<React.ComponentType | null>(null);

  useEffect(() => {
    const t0 = Date.now();

    const harness = process.env.EXPO_PUBLIC_E2E_HARNESS;
    if (harness) {
      console.log('[E2E] 하니스 모드:', harness);

      const loader =
        harness === 'changed-imports'
          ? import('./e2e-automation/harness/ChangedImportsHarness')
          : harness === 'wallet-migration'
            ? import('./e2e-automation/harness/WalletMigrationHarness')
            : import('./e2e-automation/harness/HarnessApp');
      loader.then((m) => {
        setAppComponent(() => m.default);
      });
      return;
    }
    console.log(BOOT_SLOW, '3. App 동적 import 시작 (번들/모듈 로드 대기)');
    import('./App').then((m) => {
      console.log(BOOT_SLOW, '4. App 동적 import 완료 (App.tsx 및 의존 모듈 로드됨)', `${Date.now() - t0}ms`);
      setAppComponent(() => m.default);
    });
  }, []);

  if (!AppComponent) {
    return React.createElement(
      View,
      { style: loadingStyle.root },
      React.createElement(ActivityIndicator, { size: 'large', color: '#007aff' })
    );
  }
  return React.createElement(AppComponent);
}

registerRootComponent(Root);
