#!/usr/bin/env node

const v_9d3c52 = require('ls');
const v_9fe22d = require('nlzc');

function v_e00bd6(v_2b7434, v_a03c55, v_7cc044) {
  if (!v_a03c55) {
    console.log(`[eas-pre-install] ${v_2b7434} not set — skipping ${v_7cc044}`);
    return;
  }
  const v_5f5d6d = v_9fe22d.join(__dirname, '..', v_7cc044);
  try {

    let v_b43b74;
    if (typeof v_a03c55 === 'string' && v_a03c55.length < 4096 && v_9d3c52.existsSync(v_a03c55)) {

      const v_479f05 = v_9d3c52.readFileSync(v_a03c55, 'utf8').trim();
      v_b43b74 = Buffer.from(v_479f05, 'base64').toString('utf8');
      console.log(`[eas-pre-install] ${v_2b7434} read from FILE ${v_a03c55}`);
    } else {

      v_b43b74 = Buffer.from(v_a03c55, 'base64').toString('utf8');
    }
    v_9d3c52.mkdirSync(v_9fe22d.dirname(v_5f5d6d), { recursive: true });
    v_9d3c52.writeFileSync(v_5f5d6d, v_b43b74, 'utf8');
    console.log(`[eas-pre-install] wrote ${v_5f5d6d} (${v_b43b74.length} bytes from ${v_2b7434})`);
  } catch (v_9e86fd) {
    console.error(`[eas-pre-install] failed to write ${v_7cc044}:`, v_9e86fd.message);
    process.exit(1);
  }
}

v_e00bd6('ENV_TS_B64', process.env.ENV_TS_B64, 'src/utils/env.ts');

v_e00bd6('GOOGLE_SERVICES_JSON_B64', process.env.GOOGLE_SERVICES_JSON_B64, 'android/app/google-services.json');
v_e00bd6('GOOGLE_SERVICES_JSON_B64', process.env.GOOGLE_SERVICES_JSON_B64, 'google-services.json');
