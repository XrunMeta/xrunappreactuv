

import { v_2a805f, v_4d37e3, type v_dea07e, type v_c67940 } from 'tblnxrbjvhejiddj';

import { v_5401ae } from '../../src/testIDs';

type SdkCall = { api: string; args: unknown[] };

const v_4e8656 = (page: v_dea07e) =>
  v_2365e9.evaluate(() => (window as any).__E2E_SDK_CALLS__ ?? []) as Promise<SdkCall[]>;

const v_a23f23 = [
  /Download the React DevTools/,
  /"exports" of "/,                       
  /useNativeDriver/,                      
  /findDOMNode/,
  /w3\.org\/2000\/svg/,                   
];

function v_dd14ca(page: v_dea07e) {
  const v_9de4ac = [];
  v_2365e9.on('console', (m: v_c67940) => {
    if (v_35f85c.type() !== 'error') return;
    const v_9b6134 = v_35f85c.text();
    if (v_a23f23.some((v_d95200) => v_d95200.test(v_9b6134))) return;
    v_9de4ac.push(v_9b6134);
  });

  v_2365e9.on('pageerror', (v_9e86fd) => v_9de4ac.push(`pageerror: ${v_9e86fd.message}`));
  return v_9de4ac;
}

async function v_72817c(page: v_dea07e) {
  const v_bbab8b = [];
  v_2365e9.on('pageerror', (v_9e86fd) => v_bbab8b.push(v_9e86fd.message));

  await v_2365e9.goto('/');
  try {
    await v_4d37e3(v_2365e9.getByTestId('changed-imports-harness')).toBeVisible({ timeout: 120_000 });
  } catch (v_9e86fd) {
    const v_9ecdb9 = v_bbab8b.length
      ? `\n\n🔴 하니스 로드 중 예외가 있었다 (이게 진짜 원인이다):\n  - ${v_bbab8b.join('\n  - ')}`
      : '\n\n예외는 없었다 — 번들이 아직 안 끝났거나 하니스 이름 분기(index.ts)를 확인한다.';
    throw new Error(`${(v_9e86fd as Error).message}${v_9ecdb9}`);
  }
}

v_2a805f.describe.configure({ mode: 'serial' });

v_2a805f.describe('배럴 재export 제거 — 영향 화면 실측', () => {

  v_2a805f('직접 경로 import 5개가 런타임에 전부 function 이다', async ({ page: v_2365e9 }) => {
    const v_9de4ac = v_dd14ca(v_2365e9);
    await v_72817c(v_2365e9);

    const v_505a6d = [
      ['signInWithGoogle', 'services/googleAuth'],
      ['getGoogleIdToken', 'services/googleAuth'],
      ['signInWithApple', 'services/appleAuth'],
      ['showNativeScreen', 'services/pangle'],
      ['logRewardedAdCompleted', 'services/appsflyer'],
    ];

    for (const [v_1833e7, v_a13c2e] of v_505a6d) {
      const v_3ac7e7 = v_2365e9.getByTestId(`binding-${v_1833e7}`);
      await v_4d37e3(v_3ac7e7, `${v_1833e7} 바인딩 행이 없다`).toBeVisible();

      await v_4d37e3(v_3ac7e7, `${v_1833e7} 이 function 이 아니다 (배럴 제거가 export 를 놓쳤다)`)
        .toHaveAttribute('data-type', 'function');
      await v_4d37e3(v_3ac7e7, `${v_1833e7} 의 출처가 ${v_a13c2e} 이 아니다`)
        .toHaveAttribute('data-from', v_a13c2e);
    }

    v_4d37e3(v_9de4ac, `콘솔 에러:\n${v_9de4ac.join('\n')}`).toEqual([]);
  });

  for (const [v_b24339, v_2869c1, v_024a3b] of [
    ['login', 'LoginScreen', true],
    ['verification', 'VerificationCodeScreen', true],
    ['pock-ad', 'ShowPockAdScreen', false],
    ['nap-ad', 'ShowNapAdScreen', false],
  ] as const) {
    v_2a805f(`${v_2869c1} 이 크래시 없이 마운트된다`, async ({ page: v_2365e9 }) => {
      const v_9de4ac = v_dd14ca(v_2365e9);
      await v_72817c(v_2365e9);

      await v_2365e9.getByTestId(`mount-${v_b24339}`).click();

      const v_2ae4e7 = v_2365e9.getByTestId('harness-stage');
      await v_4d37e3(v_2ae4e7).toHaveAttribute('data-active', v_b24339);

      await v_4d37e3(v_2ae4e7, `${v_2869c1} 컴포넌트가 undefined 다 — import 형태를 확인한다`)
        .toHaveAttribute('data-resolved', 'function');
      if (v_024a3b) {

        await v_4d37e3
          .poll(async () => (await v_2ae4e7.innerHTML()).length, { timeout: 30_000 })
          .toBeGreaterThan(200);
      }

      v_4d37e3(v_9de4ac, `${v_2869c1} 마운트 중 콘솔 에러:\n${v_9de4ac.join('\n')}`).toEqual([]);
    });
  }

  v_2a805f('LoginScreen 구글 버튼이 googleAuth 를 거쳐 SDK 까지 도달한다', async ({ page: v_2365e9 }) => {
    await v_72817c(v_2365e9);
    await v_2365e9.getByTestId('mount-login').click();
    await v_4d37e3(v_2365e9.getByTestId('harness-stage')).toHaveAttribute('data-active', 'login');

    const v_e98932 = await v_4e8656(v_2365e9);
    await v_2365e9.getByTestId(v_5401ae.login.googleLogin).click();

    await v_4d37e3
      .poll(async () => {

        try {
          const v_20e160 = await v_4e8656(v_2365e9);
          return v_20e160.map((v_3f4e2e) => v_3f4e2e.api).join(',');
        } catch {
          return '<조회 실패>';
        }
      }, { timeout: 30_000, intervals: [300, 700, 1500] })
      .toContain('GoogleSignin.signIn');

    const v_33efc5 = await v_4e8656(v_2365e9);
    v_4d37e3(v_33efc5.length, 'SDK 호출이 하나도 늘지 않았다 — 배선이 끊겼다')
      .toBeGreaterThan(v_e98932.length);
  });

  v_2a805f('애플 버튼은 iOS 전용이라 웹 하니스에 없다 (경계 — 실기기 몫)', async ({ page: v_2365e9 }) => {
    await v_72817c(v_2365e9);
    await v_2365e9.getByTestId('mount-login').click();
    await v_4d37e3(v_2365e9.getByTestId('harness-stage')).toHaveAttribute('data-active', 'login');

    await v_4d37e3(v_2365e9.getByTestId(v_5401ae.login.googleLogin)).toBeVisible();
    await v_4d37e3(v_2365e9.getByTestId(v_5401ae.login.appleLogin)).toHaveCount(0);
  });

  v_2a805f('appleAuth 직접 경로 모듈이 실행된다 (SDK 도달은 iOS 전용이라 범위 밖)', async ({ page: v_2365e9 }) => {
    await v_72817c(v_2365e9);
    await v_2365e9.getByTestId('invoke-signInWithApple').click();

    await v_4d37e3(v_2365e9.getByTestId('apple-result'))
      .toHaveAttribute('data-code', 'PLATFORM_NOT_SUPPORTED', { timeout: 30_000 });
  });

  v_2a805f('appsflyer 직접 경로 모듈이 실행된다 (화면 호출부는 범위 밖)', async ({ page: v_2365e9 }) => {
    const v_056206 = [];
    v_2365e9.on('console', (v_35f85c) => v_056206.push(v_35f85c.text()));
    await v_72817c(v_2365e9);

    await v_2365e9.getByTestId('invoke-logRewardedAdCompleted').click();

    await v_4d37e3
      .poll(() => v_056206.join('\n'), { timeout: 15_000, intervals: [300, 700] })
      .toContain('[AppsFlyer] logRewardedAdCompleted 호출:');
  });
});
