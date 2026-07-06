#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

function writeSecretToFile(secretName, valueOrPath, relPath) {
  if (!valueOrPath) {
    console.log(`[eas-pre-install] ${secretName} not set — skipping ${relPath}`);
    return;
  }
  const target = path.join(__dirname, '..', relPath);
  try {

    let content;
    if (typeof valueOrPath === 'string' && valueOrPath.length < 4096 && fs.existsSync(valueOrPath)) {

      const raw = fs.readFileSync(valueOrPath, 'utf8').trim();
      content = Buffer.from(raw, 'base64').toString('utf8');
      console.log(`[eas-pre-install] ${secretName} read from FILE ${valueOrPath}`);
    } else {

      content = Buffer.from(valueOrPath, 'base64').toString('utf8');
    }
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.writeFileSync(target, content, 'utf8');
    console.log(`[eas-pre-install] wrote ${target} (${content.length} bytes from ${secretName})`);
  } catch (e) {
    console.error(`[eas-pre-install] failed to write ${relPath}:`, e.message);
    process.exit(1);
  }
}

writeSecretToFile('ENV_TS_B64', process.env.ENV_TS_B64, 'src/utils/env.ts');

writeSecretToFile('GOOGLE_SERVICES_JSON_B64', process.env.GOOGLE_SERVICES_JSON_B64, 'android/app/google-services.json');
writeSecretToFile('GOOGLE_SERVICES_JSON_B64', process.env.GOOGLE_SERVICES_JSON_B64, 'google-services.json');
