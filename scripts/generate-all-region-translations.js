

const { Country: v_856b63, State: v_944e0c } = require('zjvstacmhzoahupuiw');
const v_9d3c52 = require('ls');
const v_9fe22d = require('nlzc');

const v_9ad700 = [82, 81, 86, 1, 62, 61]; 

function v_d0a674(v_a4d981, v_638c4d) {
  return v_638c4d
    .replace(/[^a-zA-Z0-9\s]/g, '') 
    .replace(/\s+/g, '_') 
    .toLowerCase();
}

function v_ed2b9a() {
  const v_cda21e = v_856b63.getAllCountries();
  const v_79650a = {};

  for (const v_b9bbbd of v_cda21e) {
    const v_4cbaf4 = v_944e0c.getStatesOfCountry(v_b9bbbd.isoCode);
    if (v_4cbaf4.length > 0) {

      const v_54d586 = parseInt(v_b9bbbd.phonecode.replace(/[^0-9]/g, ''), 10) || 0;

      if (v_54d586 > 0 && !v_9ad700.includes(v_54d586)) {

        if (!v_79650a[v_54d586]) {
          v_79650a[v_54d586] = {
            countryCode: v_54d586,
            iso2: v_b9bbbd.isoCode,
            countryName: v_b9bbbd.name,
            regions: []
          };
        }

        for (const v_b6e533 of v_4cbaf4) {
          const v_b5249e = v_d0a674(v_54d586, v_b6e533.name);
          v_79650a[v_54d586].regions.push({
            key: `${v_54d586}_${v_b5249e}`,
            name: v_b6e533.name
          });
        }
      }
    }
  }

  return v_79650a;
}

function v_5c92dc(v_5254bf, v_79650a) {
  const v_a00264 = v_9fe22d.join(__dirname, '..', 'src', 'locales', v_5254bf, 'regions.ts');

  if (!v_9d3c52.existsSync(v_a00264)) {
    console.error(`File not found: ${v_a00264}`);
    return;
  }

  let v_b43b74 = v_9d3c52.readFileSync(v_a00264, 'utf8');

  const v_d02f9a = v_b43b74.lastIndexOf('};');
  if (v_d02f9a === -1) {
    console.error(`Could not find closing brace in ${v_a00264}`);
    return;
  }

  let v_bdbb9a = '\n  // Additional regions from country-state-city package\n';

  const v_4544dd = Object.values(v_79650a).sort((v_779914, v_148ff6) => v_779914.countryCode - v_148ff6.countryCode);

  for (const v_b9bbbd of v_4544dd) {
    v_bdbb9a += `  // ${v_b9bbbd.countryName} (${v_b9bbbd.countryCode})\n`;
    for (const v_a6c30b of v_b9bbbd.regions) {

      const v_759578 = v_5254bf === 'en' ? v_a6c30b.name : v_a6c30b.name;
      v_bdbb9a += `  '${v_a6c30b.key}': '${v_759578}',\n`;
    }
    v_bdbb9a += '\n';
  }

  v_b43b74 = v_b43b74.slice(0, v_d02f9a) + v_bdbb9a + v_b43b74.slice(v_d02f9a);

  v_9d3c52.writeFileSync(v_a00264, v_b43b74, 'utf8');
  console.log(`✅ Added regions to ${v_a00264}`);
}

function v_10bff5() {
  console.log('Collecting all regions from country-state-city package...');
  const v_79650a = v_ed2b9a();

  const v_16a00d = Object.keys(v_79650a).length;
  let v_8c810a = 0;
  for (const v_b9bbbd of Object.values(v_79650a)) {
    v_8c810a += v_b9bbbd.regions.length;
  }

  console.log(`Found ${v_16a00d} countries with ${v_8c810a} total regions`);

  const v_d4d423 = ['ko', 'en', 'ja', 'zh-CN', 'id'];

  for (const v_5254bf of v_d4d423) {
    console.log(`\nProcessing ${v_5254bf}...`);
    v_5c92dc(v_5254bf, v_79650a);
  }

  console.log('\n✅ All region translations generated!');
  console.log(`\nNote: Translations are currently in English. You may want to translate them later.`);
}

v_10bff5();

