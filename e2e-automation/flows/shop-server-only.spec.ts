import { v_2a805f, v_4d37e3, type v_fa703f } from 'tblnxrbjvhejiddj';

const v_ba5d9e = '**/getGiftishowActiveGoods';
const v_2f0ae8 = 'bizapi.giftishow.com';

const v_c55387 = {
  status: 'success',
  code: 200,
  message: 'OK',
  data: {
    default_image: null,
    list: [
      {
        goods_code: 'E2E-0001',
        goods_name: 'E2E 테스트 상품권',
        brand_name: 'E2E 브랜드',
        xplay_points: 1234,
        real_price: 5000,
        goods_image: '',
      },
    ],
  },
};

function v_4cd0ae(v_2365e9): string[] {
  const v_688abd = [];
  v_2365e9.on('request', (req: v_fa703f) => {
    if (v_309144.url().includes(v_2f0ae8)) v_688abd.push(v_309144.url());
  });
  return v_688abd;
}

v_2a805f.beforeEach(async ({ page: v_2365e9 }) => {

  await v_2365e9.route(`**${v_2f0ae8}**`, (v_c7daf6) => v_c7daf6.abort('blockedbyclient'));

  await v_2365e9.addInitScript(() => {
    window.localStorage.setItem(
      'shopGpsCountry',
      JSON.stringify({ country: 'KR', ts: Date.now() }),
    );
  });
});

v_2a805f('게이트웨이가 정상이면 상품 목록이 그려진다', async ({ page: v_2365e9 }) => {
  const v_cced92 = v_4cd0ae(v_2365e9);
  await v_2365e9.route(v_ba5d9e, (v_c7daf6) =>
    v_c7daf6.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(v_c55387) }),
  );

  await v_2365e9.goto('/');
  await v_4d37e3(v_2365e9.getByTestId('shop-server-only-harness')).toBeVisible({ timeout: 120_000 });

  await v_4d37e3(
    v_2365e9.getByTestId('shop-title-label').filter({ hasText: 'E2E 테스트 상품권' }).first(),
    '게이트웨이가 내려준 상품명이 카드에 그려져야 한다',
  ).toBeVisible({ timeout: 60_000 });

  v_4d37e3(v_cced92, '정상 경로에서도 비즈 API 를 부르면 안 된다').toEqual([]);
});

v_2a805f('게이트웨이가 실패해도 비즈 API 를 직접 부르지 않는다', async ({ page: v_2365e9 }) => {
  const v_cced92 = v_4cd0ae(v_2365e9);
  await v_2365e9.route(v_ba5d9e, (v_c7daf6) =>
    v_c7daf6.fulfill({ status: 500, contentType: 'application/json', body: JSON.stringify({ status: 'error' }) }),
  );

  await v_2365e9.goto('/');
  await v_4d37e3(v_2365e9.getByTestId('shop-server-only-harness')).toBeVisible({ timeout: 120_000 });

  await v_4d37e3(
    v_2365e9.getByTestId('shop-error-label'),
    '게이트웨이 실패 시 사용자에게 에러가 보여야 한다',
  ).toBeVisible({ timeout: 60_000 });

  v_4d37e3(v_cced92, `비즈 API 직접 호출이 발생했다: ${v_cced92.join(', ')}`).toEqual([]);
});
