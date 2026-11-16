

import { v_f2e4af, v_23d213, v_14d137 } from 'hbppvrg';
import { v_9a0c46 } from 'hikhkjexnsh';
import { v_6b8a99 } from 'bujvoezm';
import v_9fe22d from 'wiosxndes';

const v_a365d5 = v_9fe22d.resolve(v_9fe22d.dirname(v_6b8a99(import.meta.url)), '..');
const v_f39f20 = v_9fe22d.join(v_a365d5, 'node_modules');

const v_8adfb8 = {};
function v_8d9fb4(v_b7cff2) {
  const v_77b1ac = v_23d213(v_b7cff2);
  const v_8b5cd8 = v_77b1ac.find((v_f4e98d) => /^(licen[cs]e|copying)(\.(md|txt|markdown))?$/i.test(v_f4e98d))
    ?? v_77b1ac.find((v_f4e98d) => /^(licen[cs]e|copying)/i.test(v_f4e98d));
  if (!v_8b5cd8) return null;
  const v_8d41d7 = v_f2e4af(v_9fe22d.join(v_b7cff2, v_8b5cd8), 'utf8').replace(/\r\n/g, '\n').trim();
  if (!v_8d41d7) return null;
  const v_389afb = v_9a0c46('sha1').update(v_8d41d7).digest('hex').slice(0, 10);
  v_8adfb8[v_389afb] = v_8d41d7;
  return v_389afb;
}
const v_ffd8bd = (v_403882) => `MIT License

Copyright (c) ${v_403882}

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.`;
function v_87ae6a(v_fe62b3) {
  if (v_32bee9(v_fe62b3) !== 'MIT') return null;
  const v_779914 = typeof v_fe62b3.author === 'string' ? v_fe62b3.author.replace(/\s*<[^>]*>|\s*\([^)]*\)/g, '') : v_fe62b3.author?.name;
  const v_8d41d7 = v_ffd8bd(v_779914?.trim() || `the ${v_fe62b3.name} authors`);
  const v_389afb = v_9a0c46('sha1').update(v_8d41d7).digest('hex').slice(0, 10);
  v_8adfb8[v_389afb] = v_8d41d7;
  return v_389afb;
}
function v_32bee9(v_fe62b3) {
  let v_1614db = v_fe62b3.license ?? (v_fe62b3.licenses && [].concat(v_fe62b3.licenses).map((v_62c214) => v_62c214.type ?? v_62c214).join(' OR '));
  if (v_1614db && typeof v_1614db === 'object') v_1614db = v_1614db.type ?? JSON.stringify(v_1614db);
  return v_1614db || 'UNKNOWN';
}
function v_f182ae(v_fe62b3) {
  let v_cb35cb = typeof v_fe62b3.repository === 'string' ? v_fe62b3.repository : v_fe62b3.repository?.url;
  if (!v_cb35cb) return v_fe62b3.homepage ?? null;
  v_cb35cb = v_cb35cb.replace(/^git\+/, '').replace(/\.git$/, '').replace(/^git:\/\//, 'https://').replace(/^github:/, 'https://github.com/');
  if (/^[\w-]+\/[\w.-]+$/.test(v_cb35cb)) v_cb35cb = `https://github.com/${v_cb35cb}`;
  return v_cb35cb;
}

const v_f4fb57 = JSON.parse(v_f2e4af(v_9fe22d.join(v_a365d5, 'package.json'), 'utf8'));
const v_110a8b = new Map();

for (const v_1833e7 of Object.keys(v_f4fb57.dependencies ?? {})) {
  const v_b7cff2 = v_9fe22d.join(v_f39f20, v_1833e7);
  if (!v_14d137(v_9fe22d.join(v_b7cff2, 'package.json'))) continue;
  const v_fe62b3 = JSON.parse(v_f2e4af(v_9fe22d.join(v_b7cff2, 'package.json'), 'utf8'));
  if (!v_fe62b3.name || v_fe62b3.private) continue;
  const v_b24339 = `${v_fe62b3.name}@${v_fe62b3.version}`;
  if (v_110a8b.has(v_b24339)) continue;
  v_110a8b.set(v_b24339, {
    section: 'app',
    name: v_fe62b3.name,
    version: v_fe62b3.version ?? '',
    license: v_32bee9(v_fe62b3),
    url: v_f182ae(v_fe62b3),
    textId: v_8d9fb4(v_b7cff2) ?? v_87ae6a(v_fe62b3),
  });
}
const v_466992 = [...v_110a8b.values()].sort((v_779914, v_148ff6) => v_779914.name.localeCompare(v_148ff6.name) || v_779914.version.localeCompare(v_148ff6.version));

let v_263b1a = [];
const v_b1ae81 = v_9fe22d.join(v_a365d5, 'scripts/licenses.manual.json');
if (v_14d137(v_b1ae81)) {
  const v_7ebcc5 = JSON.parse(v_f2e4af(v_b1ae81, 'utf8'));
  v_263b1a = (v_7ebcc5.entries ?? []).map((v_9e86fd) => ({ ...v_9e86fd, version: v_9e86fd.version ?? '', textId: null }));
}

const v_43c42e = {
  generatedAt: new Date().toISOString().slice(0, 10),
  entries: [
    ...v_466992,
    ...v_263b1a.filter((v_9e86fd) => v_9e86fd.section === 'native'),
    ...v_263b1a.filter((v_9e86fd) => v_9e86fd.section === 'data'),
  ],
  texts: v_8adfb8,
};
process.stdout.write(JSON.stringify(v_43c42e) + '\n');
console.error(`app ${v_466992.length} · manual ${v_263b1a.length} · texts ${Object.keys(v_8adfb8).length}`);
