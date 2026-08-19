import { test, expect } from '@playwright/test';

const VIEWPORTS = [320, 375, 390, 430];

const CASES = [
  { id: 'small', expected: '1.95 XRUN' },
  { id: 'sub-one', expected: '0.0856 POL' },
  { id: 'thousand', expected: '1,000 XRUN' },
  { id: 'hundred-k', expected: '162,858 XRUN' },
  { id: 'million', expected: '1,000,000 XRUN' },
  { id: 'member-2624', expected: '10,000,000 XRUN' },
  { id: 'hundred-million', expected: '123,456,789.12 XRUN' },
  { id: 'billion', expected: '1,234,567,890.12 XRUN' },
];

test.beforeEach(async ({ page }) => {
  await page.goto('/');

  await expect(page.getByTestId('viewport-375')).toBeVisible({ timeout: 120_000 });
});

test('잔액 문자열이 모든 구간에서 콤마 규칙대로 나온다', async ({ page }) => {
  for (const c of CASES) {
    const card = page.getByTestId(`case-375-${c.id}`);
    const balance = card.getByTestId('wallet-header-main-value');
    await expect(balance, `${c.id} 잔액 문자열`).toHaveText(c.expected);
  }
});

test('🔴 잔액이 카드 안에서 한 줄로 들어간다 (줄바꿈·넘침 없음)', async ({ page }) => {
  const overflows: string[] = [];

  for (const width of VIEWPORTS) {
    for (const c of CASES) {
      const card = page.getByTestId(`case-${width}-${c.id}`);
      const balance = card.getByTestId('wallet-header-main-value');

      const m = await balance.evaluate((el) => {
        const s = getComputedStyle(el);
        const lineHeight = parseFloat(s.lineHeight) || parseFloat(s.fontSize) * 1.2;
        return {
          text: el.textContent ?? '',
          scrollWidth: el.scrollWidth,
          clientWidth: el.clientWidth,
          height: el.getBoundingClientRect().height,
          lines: Math.round(el.getBoundingClientRect().height / lineHeight),
          fontSize: s.fontSize,
        };
      });

      if (m.lines > 1 || m.scrollWidth > m.clientWidth + 1) {
        overflows.push(
          `폭 ${width}px · ${c.id} · "${m.text}" — ${m.lines}줄, ` +
            `scroll ${m.scrollWidth}px / client ${m.clientWidth}px (font ${m.fontSize})`,
        );
      }
    }
  }

  expect(overflows, `카드 잔액이 한 줄에 안 들어감:\n${overflows.join('\n')}`).toEqual([]);
});
