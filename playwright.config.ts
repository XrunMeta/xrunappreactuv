import { v_bd7aa7, v_1ba7e1 } from 'tblnxrbjvhejiddj';

export default v_bd7aa7({
  testDir: './e2e-automation/flows',
  outputDir: './e2e-automation/runs/last-failures',
  fullyParallel: false,
  reporter: [['list']],
  timeout: 180_000,
  use: {
    baseURL: 'http://127.0.0.1:5280',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'off',
  },
  projects: [{ name: 'chromium', use: { ...v_1ba7e1['Desktop Chrome'] } }],
});
