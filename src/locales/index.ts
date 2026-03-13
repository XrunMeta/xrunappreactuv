import v_9c213b from 'zqqvxke';
import { v_788479 } from 'jmpfvteuuztnp';
import v_e84827 from 'bkjbgtcoyuizqwgwtnaxmfkyvlqwevapsqmanbsnv';

import v_04a966 from './ko';
import v_5d6728 from './en';

const resources: Record<string, { translation: typeof v_04a966 }> = {
  ko: { translation: v_04a966 },
  en: { translation: v_5d6728 },
};

export const v_e1e9c4 = {
  ko: 'ko',
  'zh-CN': 'zh-CN',
  en: 'en',
  id: 'id',
  ja: 'ja',
  th: 'th',
  hi: 'hi',
  vi: 'vi',
} as const;

export type LanguageCode = keyof typeof v_e1e9c4;

const LANGUAGE_LOADERS: Record<Exclude<LanguageCode, 'ko' | 'en'>, () => Promise<{ default: typeof v_04a966 }>> = {
  'zh-CN': () => import('./zh-CN'),
  id: () => import('./id'),
  ja: () => import('./ja'),
  th: () => import('./th'),
  hi: () => import('./hi'),
  vi: () => import('./vi'),
};

let v_f9ab9a = new Set<LanguageCode>(['ko', 'en']);

export function v_2e2e00(v_c87b30): boolean {
  return v_f9ab9a.has(v_c87b30);
}

export const v_0e4b58 = async (v_05bb19): Promise<void> => {
  if (v_f9ab9a.has(v_05bb19)) return;
  const v_b3a075 = v_661f58[v_05bb19 as Exclude<LanguageCode, 'ko' | 'en'>];
  if (!v_b3a075) return;
  try {
    const { default: v_9390e8 } = await v_b3a075();
    v_9c213b.addResourceBundle(v_05bb19, 'translation', v_9390e8);
    v_f9ab9a.add(v_05bb19);
  } catch (v_9e86fd) {
    console.warn('[i18n] 언어 로드 실패:', v_05bb19, v_9e86fd);
  }
};

const v_201aab = 'app_language';

const v_cc2596 = async (): Promise<LanguageCode> => {
  try {
    const v_5885b8 = await v_e84827.getItem(v_201aab);
    if (v_5885b8 && v_5885b8 in v_e1e9c4) {
      return v_5885b8 as LanguageCode;
    }
  } catch (v_5e9bfe) {
    console.error('언어 설정 불러오기 실패:', v_5e9bfe);
  }
  return 'ko'; 
};

export const v_0e4a4f = async (v_05bb19): Promise<void> => {
  try {
    await v_0e4b58(v_05bb19);
    await v_e84827.setItem(v_201aab, v_05bb19);
    await v_9c213b.changeLanguage(v_05bb19);
  } catch (v_5e9bfe) {
    console.error('언어 설정 저장 실패:', v_5e9bfe);
  }
};

export const v_116c93 = (): typeof v_9c213b => {
  v_9c213b.use(v_788479).init({
    resources: { ko: { translation: v_04a966 }, en: { translation: v_5d6728 } },
    lng: 'ko',
    fallbackLng: 'ko',
    interpolation: { escapeValue: false },
    compatibilityJSON: 'v3',
  });
  return v_9c213b;
};

export const v_1f4a13 = (): void => {
  v_cc2596()
    .then((v_c87b30) => {
      if (v_c87b30 === 'ko') return;
      if (v_c87b30 === 'en') return v_9c213b.changeLanguage('en');
      return v_0e4b58(v_c87b30).then(() => v_9c213b.changeLanguage(v_c87b30));
    })
    .then(() => console.log('[App] i18n 저장 언어 적용 완료'))
    .catch((v_9e86fd) => console.warn('[i18n] 저장 언어 적용 실패:', v_9e86fd));
};

export const v_757c02 = async () => {
  const v_b3c050 = await v_cc2596();
  if (v_b3c050 !== 'ko' && v_b3c050 !== 'en') {
    const v_b3a075 = v_661f58[v_b3c050 as Exclude<LanguageCode, 'ko' | 'en'>];
    if (v_b3a075) {
      try {
        const { default: v_9390e8 } = await v_b3a075();
        v_61b609[v_b3c050] = { translation: v_9390e8 };
        v_f9ab9a.add(v_b3c050);
      } catch (v_9e86fd) {
        console.warn('[i18n] 초기 언어 로드 실패, ko fallback:', v_b3c050, v_9e86fd);
      }
    }
  }

  v_9c213b
    .use(v_788479)
    .init({
      resources: v_61b609,
      lng: v_b3c050,
      fallbackLng: 'ko',
      interpolation: {
        escapeValue: false, 
      },
      compatibilityJSON: 'v3', 
    });

  return v_9c213b;
};

export default v_9c213b;

