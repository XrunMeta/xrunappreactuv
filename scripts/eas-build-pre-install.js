#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const b64 = process.env.ENV_TS_B64;
if (!b64) {
  console.log('[eas-pre-install] ENV_TS_B64 not set — skipping (local build assumes env.ts exists)');
  process.exit(0);
}

const target = path.join(__dirname, '..', 'src', 'utils', 'env.ts');
try {
  const content = Buffer.from(b64, 'base64').toString('utf8');
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, content, 'utf8');
  console.log(`[eas-pre-install] wrote ${target} (${content.length} bytes)`);
} catch (e) {
  console.error('[eas-pre-install] failed to write env.ts:', e.message);
  process.exit(1);
}
