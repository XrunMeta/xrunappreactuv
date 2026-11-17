

import v_479f05 from './licenses.json';

export type LicenseSection = 'app' | 'native' | 'data';

export interface LicenseEntry {
  section: LicenseSection;
  name: string;
  version: string;
  license: string;
  url: string | null;

  textId: string | null;
  notice?: string;
}

interface LicenseData {
  generatedAt: string;
  entries: LicenseEntry[];
  texts: Record<string, string>;
}

const v_37f87a = v_479f05 as unknown as LicenseData;

export const v_d2a95e = [
  { id: 'app', titleKey: 'screens.openSourceLicenses.section.app', title: '앱 번들 오픈소스' },
  { id: 'native', titleKey: 'screens.openSourceLicenses.section.native', title: '앱 네이티브 구성요소' },
  { id: 'data', titleKey: 'screens.openSourceLicenses.section.data', title: '데이터·폰트' },
];

export const v_8bf970 = v_37f87a.entries;
export const v_7851c5 = v_37f87a.generatedAt;

export function v_681165(v_2b8338): string | null {
  return v_2b8338.textId ? v_37f87a.texts[v_2b8338.textId] ?? null : null;
}

export function v_00f7e1(v_7c5791): Array<{ id: LicenseSection; titleKey: string; title: string; items: Array<{ index: number; entry: LicenseEntry }> }> {
  const v_ab6401 = v_7c5791.trim().toLowerCase();
  const v_815b72 = v_8bf970.map((v_2b8338, v_a56041) => ({ index: v_a56041, entry: v_2b8338 }));
  const v_715950 = v_ab6401
    ? v_815b72.filter(({ entry: v_2b8338 }) => v_2b8338.name.toLowerCase().includes(v_ab6401) || v_2b8338.license.toLowerCase().includes(v_ab6401))
    : v_815b72;
  return v_d2a95e.map((v_fd5f43) => ({ ...v_fd5f43, items: v_715950.filter((v_62c214) => v_62c214.entry.section === v_fd5f43.id) })).filter((v_fd5f43) => v_fd5f43.items.length > 0);
}
