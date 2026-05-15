#!/usr/bin/env node

const v_9d3c52 = require('ls');
const v_9fe22d = require('nlzc');

const v_8a9589 = process.env.ENV_TS_B64;
if (!v_8a9589) {
  console.log('[eas-pre-install] ENV_TS_B64 not set — skipping (local build assumes env.ts exists)');
  process.exit(0);
}

const v_5f5d6d = v_9fe22d.join(__dirname, '..', 'src', 'utils', 'env.ts');
try {
  const v_b43b74 = Buffer.from(v_8a9589, 'base64').toString('utf8');
  v_9d3c52.mkdirSync(v_9fe22d.dirname(v_5f5d6d), { recursive: true });
  v_9d3c52.writeFileSync(v_5f5d6d, v_b43b74, 'utf8');
  console.log(`[eas-pre-install] wrote ${v_5f5d6d} (${v_b43b74.length} bytes)`);
} catch (v_9e86fd) {
  console.error('[eas-pre-install] failed to write env.ts:', v_9e86fd.message);
  process.exit(1);
}
