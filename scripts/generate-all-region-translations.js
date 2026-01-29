

const { Country, State } = require('country-state-city');
const fs = require('fs');
const path = require('path');

const COUNTRIES_WITH_MAPPING = [82, 81, 86, 1, 62, 61]; 

function generateRegionKey(countryCode, regionName) {
  return regionName
    .replace(/[^a-zA-Z0-9\s]/g, '') 
    .replace(/\s+/g, '_') 
    .toLowerCase();
}

function collectAllRegions() {
  const allCountries = Country.getAllCountries();
  const regionsByCountry = {};

  for (const country of allCountries) {
    const states = State.getStatesOfCountry(country.isoCode);
    if (states.length > 0) {

      const phonecode = parseInt(country.phonecode.replace(/[^0-9]/g, ''), 10) || 0;

      if (phonecode > 0 && !COUNTRIES_WITH_MAPPING.includes(phonecode)) {

        if (!regionsByCountry[phonecode]) {
          regionsByCountry[phonecode] = {
            countryCode: phonecode,
            iso2: country.isoCode,
            countryName: country.name,
            regions: []
          };
        }

        for (const state of states) {
          const regionKey = generateRegionKey(phonecode, state.name);
          regionsByCountry[phonecode].regions.push({
            key: `${phonecode}_${regionKey}`,
            name: state.name
          });
        }
      }
    }
  }

  return regionsByCountry;
}

function addRegionsToTranslationFile(lang, regionsByCountry) {
  const filePath = path.join(__dirname, '..', 'src', 'locales', lang, 'regions.ts');

  if (!fs.existsSync(filePath)) {
    console.error(`File not found: ${filePath}`);
    return;
  }

  let content = fs.readFileSync(filePath, 'utf8');

  const lastBraceIndex = content.lastIndexOf('};');
  if (lastBraceIndex === -1) {
    console.error(`Could not find closing brace in ${filePath}`);
    return;
  }

  let newRegions = '\n  // Additional regions from country-state-city package\n';

  const sortedCountries = Object.values(regionsByCountry).sort((a, b) => a.countryCode - b.countryCode);

  for (const country of sortedCountries) {
    newRegions += `  // ${country.countryName} (${country.countryCode})\n`;
    for (const region of country.regions) {

      const translation = lang === 'en' ? region.name : region.name;
      newRegions += `  '${region.key}': '${translation}',\n`;
    }
    newRegions += '\n';
  }

  content = content.slice(0, lastBraceIndex) + newRegions + content.slice(lastBraceIndex);

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`✅ Added regions to ${filePath}`);
}

function main() {
  console.log('Collecting all regions from country-state-city package...');
  const regionsByCountry = collectAllRegions();

  const countryCount = Object.keys(regionsByCountry).length;
  let totalRegions = 0;
  for (const country of Object.values(regionsByCountry)) {
    totalRegions += country.regions.length;
  }

  console.log(`Found ${countryCount} countries with ${totalRegions} total regions`);

  const languages = ['ko', 'en', 'ja', 'zh-CN', 'id'];

  for (const lang of languages) {
    console.log(`\nProcessing ${lang}...`);
    addRegionsToTranslationFile(lang, regionsByCountry);
  }

  console.log('\n✅ All region translations generated!');
  console.log(`\nNote: Translations are currently in English. You may want to translate them later.`);
}

main();

