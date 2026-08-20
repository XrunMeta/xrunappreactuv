

import { test, expect, type Page, type ConsoleMessage } from '@playwright/test';

import { TID } from '../../src/testIDs';

type SdkCall = { api: string; args: unknown[] };

const readSdkCalls = (page: Page) =>
  page.evaluate(() => (window as any).__E2E_SDK_CALLS__ ?? []) as Promise<SdkCall[]>;

const IGNORED_ERROR_PATTERNS = [
  /Download the React DevTools/,
  /"exports" of "/,                       
  /useNativeDriver/,                      
  /findDOMNode/,
  /w3\.org\/2000\/svg/,                   
];

function collectErrors(page: Page) {
  const errors: string[] = [];
  page.on('console', (m: ConsoleMessage) => {
    if (m.type() !== 'error') return;
    const text = m.text();
    if (IGNORED_ERROR_PATTERNS.some((re) => re.test(text))) return;
    errors.push(text);
  });

  page.on('pageerror', (e) => errors.push(`pageerror: ${e.message}`));
  return errors;
}

async function openHarness(page: Page) {
  const fatal: string[] = [];
  page.on('pageerror', (e) => fatal.push(e.message));

  await page.goto('/');
  try {
    await expect(page.getByTestId('changed-imports-harness')).toBeVisible({ timeout: 120_000 });
  } catch (e) {
    const hint = fatal.length
      ? `\n\n🔴 하니스 로드 중 예외가 있었다 (이게 진짜 원인이다):\n  - ${fatal.join('\n  - ')}`
      : '\n\n예외는 없었다 — 번들이 아직 안 끝났거나 하니스 이름 분기(index.ts)를 확인한다.';
    throw new Error(`${(e as Error).message}${hint}`);
  }
}

test.describe.configure({ mode: 'serial' });

test.describe('배럴 재export 제거 — 영향 화면 실측', () => {

  test('직접 경로 import 5개가 런타임에 전부 function 이다', async ({ page }) => {
    const errors = collectErrors(page);
    await openHarness(page);

    const expected: Array<[string, string]> = [
      ['signInWithGoogle', 'services/googleAuth'],
      ['getGoogleIdToken', 'services/googleAuth'],
      ['signInWithApple', 'services/appleAuth'],
      ['showNativeScreen', 'services/pangle'],
      ['logRewardedAdCompleted', 'services/appsflyer'],
    ];

    for (const [name, from] of expected) {
      const row = page.getByTestId(`binding-${name}`);
      await expect(row, `${name} 바인딩 행이 없다`).toBeVisible();

      await expect(row, `${name} 이 function 이 아니다 (배럴 제거가 export 를 놓쳤다)`)
        .toHaveAttribute('data-type', 'function');
      await expect(row, `${name} 의 출처가 ${from} 이 아니다`)
        .toHaveAttribute('data-from', from);
    }

    expect(errors, `콘솔 에러:\n${errors.join('\n')}`).toEqual([]);
  });

  for (const [key, label, draws] of [
    ['login', 'LoginScreen', true],
    ['verification', 'VerificationCodeScreen', true],
    ['pock-ad', 'ShowPockAdScreen', false],
    ['nap-ad', 'ShowNapAdScreen', false],
  ] as const) {
    test(`${label} 이 크래시 없이 마운트된다`, async ({ page }) => {
      const errors = collectErrors(page);
      await openHarness(page);

      await page.getByTestId(`mount-${key}`).click();

      const stage = page.getByTestId('harness-stage');
      await expect(stage).toHaveAttribute('data-active', key);

      await expect(stage, `${label} 컴포넌트가 undefined 다 — import 형태를 확인한다`)
        .toHaveAttribute('data-resolved', 'function');
      if (draws) {

        await expect
          .poll(async () => (await stage.innerHTML()).length, { timeout: 30_000 })
          .toBeGreaterThan(200);
      }

      expect(errors, `${label} 마운트 중 콘솔 에러:\n${errors.join('\n')}`).toEqual([]);
    });
  }

  test('LoginScreen 구글 버튼이 googleAuth 를 거쳐 SDK 까지 도달한다', async ({ page }) => {
    await openHarness(page);
    await page.getByTestId('mount-login').click();
    await expect(page.getByTestId('harness-stage')).toHaveAttribute('data-active', 'login');

    const before = await readSdkCalls(page);
    await page.getByTestId(TID.login.googleLogin).click();

    await expect
      .poll(async () => {

        try {
          const calls = await readSdkCalls(page);
          return calls.map((c) => c.api).join(',');
        } catch {
          return '<조회 실패>';
        }
      }, { timeout: 30_000, intervals: [300, 700, 1500] })
      .toContain('GoogleSignin.signIn');

    const after = await readSdkCalls(page);
    expect(after.length, 'SDK 호출이 하나도 늘지 않았다 — 배선이 끊겼다')
      .toBeGreaterThan(before.length);
  });

  test('애플 버튼은 iOS 전용이라 웹 하니스에 없다 (경계 — 실기기 몫)', async ({ page }) => {
    await openHarness(page);
    await page.getByTestId('mount-login').click();
    await expect(page.getByTestId('harness-stage')).toHaveAttribute('data-active', 'login');

    await expect(page.getByTestId(TID.login.googleLogin)).toBeVisible();
    await expect(page.getByTestId(TID.login.appleLogin)).toHaveCount(0);
  });

  test('appleAuth 직접 경로 모듈이 실행된다 (SDK 도달은 iOS 전용이라 범위 밖)', async ({ page }) => {
    await openHarness(page);
    await page.getByTestId('invoke-signInWithApple').click();

    await expect(page.getByTestId('apple-result'))
      .toHaveAttribute('data-code', 'PLATFORM_NOT_SUPPORTED', { timeout: 30_000 });
  });

  test('appsflyer 직접 경로 모듈이 실행된다 (화면 호출부는 범위 밖)', async ({ page }) => {
    const logs: string[] = [];
    page.on('console', (m) => logs.push(m.text()));
    await openHarness(page);

    await page.getByTestId('invoke-logRewardedAdCompleted').click();

    await expect
      .poll(() => logs.join('\n'), { timeout: 15_000, intervals: [300, 700] })
      .toContain('[AppsFlyer] logRewardedAdCompleted 호출:');
  });
});
