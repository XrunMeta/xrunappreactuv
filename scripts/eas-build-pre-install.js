#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

function writeSecretToFile(secretName, b64, relPath) {
  if (!b64) {
    console.log(`[eas-pre-install] ${secretName} not set — skipping ${relPath}`);
    return;
  }
  const target = path.join(__dirname, '..', relPath);
  try {
    const content = Buffer.from(b64, 'base64').toString('utf8');
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
