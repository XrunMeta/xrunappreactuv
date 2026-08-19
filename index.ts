const v_9e5220 = '[!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!부팅 느림]';
console.log(v_9e5220, '1. 엔트리 포인트 실행 (index.ts 최상단)');

import v_a3453e, { v_5ab095, v_c4deb2 } from 'bapkr';
import { v_3094a2, v_39a996, v_472849 } from 'rcmrninabrnb';
import { v_e4dfc3 } from 'tgjb';
import { v_8ecf08 } from './src/utils/env';

const v_80c051 = Date.now();
v_8ecf08();
console.log(v_9e5220, '2. index.ts loadEnvSync 완료', `${Date.now() - v_80c051}ms`);

const v_28f998 = v_472849.create({
  root: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});

function v_fafd0c() {
  const [v_1a64d7, v_b96ac3] = v_5ab095<v_a3453e.ComponentType | null>(null);

  v_c4deb2(() => {
    const v_b66f2c = Date.now();

    const v_0483af = process.env.EXPO_PUBLIC_E2E_HARNESS;
    if (v_0483af) {
      console.log('[E2E] 하니스 모드:', v_0483af);

      const v_b3a075 =
        v_0483af === 'changed-imports'
          ? import('./e2e-automation/harness/ChangedImportsHarness')
          : v_0483af === 'wallet-migration'
            ? import('./e2e-automation/harness/WalletMigrationHarness')
            : import('./e2e-automation/harness/HarnessApp');
      v_b3a075.then((v_35f85c) => {
        v_b96ac3(() => v_35f85c.default);
      });
      return;
    }
    console.log(v_9e5220, '3. App 동적 import 시작 (번들/모듈 로드 대기)');
    import('./App').then((v_35f85c) => {
      console.log(v_9e5220, '4. App 동적 import 완료 (App.tsx 및 의존 모듈 로드됨)', `${Date.now() - v_b66f2c}ms`);
      v_b96ac3(() => v_35f85c.default);
    });
  }, []);

  if (!v_1a64d7) {
    return v_a3453e.createElement(
      v_3094a2,
      { style: v_28f998.root },
      v_a3453e.createElement(v_39a996, { size: 'large', color: '#007aff' })
    );
  }
  return v_a3453e.createElement(v_1a64d7);
}

v_e4dfc3(v_fafd0c);
