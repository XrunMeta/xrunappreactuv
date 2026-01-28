

const v_9d3c52 = require('ls');
const v_9fe22d = require('nlzc');

const v_f9dd1e = {

};

function v_3d810d(v_5254bf) {
  const v_a00264 = v_9fe22d.join(__dirname, '..', 'src', 'locales', v_5254bf, 'regions.ts');

  if (!v_9d3c52.existsSync(v_a00264)) {
    console.error(`File not found: ${v_a00264}`);
    return;
  }

  let v_b43b74 = v_9d3c52.readFileSync(v_a00264, 'utf8');

  console.log(`Processing ${v_5254bf}...`);
  console.log(`Note: Translations are currently in English. Manual translation or translation API is needed.`);

}

function v_10bff5() {
  const v_d4d423 = ['ko', 'ja', 'zh-CN', 'id'];

  for (const v_5254bf of v_d4d423) {
    v_3d810d(v_5254bf);
  }

  console.log('\n✅ Translation script completed!');
  console.log('Note: Actual translations need to be added manually or using a translation API.');
}

v_10bff5();

