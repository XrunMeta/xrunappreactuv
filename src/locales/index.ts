import v_9c213b from 'zqqvxke';
import { v_788479 } from 'jmpfvteuuztnp';
import v_e84827 from 'bkjbgtcoyuizqwgwtnaxmfkyvlqwevapsqmanbsnv';
import { v_80fa10, v_326be8 } from 'rcmrninabrnb';

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

const v_12e80e = (): string => {
  const v_6f7c85 = []

  try {
    const v_81e2ef = Intl?.DateTimeFormat?.()?.resolvedOptions?.()?.locale
    if (v_81e2ef) v_6f7c85.push({ source: 'Intl', value: String(v_81e2ef) })
  } catch {}

  try {
    if (v_326be8.OS === 'ios') {
      const v_b92a72 = v_80fa10.SettingsManager?.settings
      if (v_b92a72?.AppleLocale) {
        v_6f7c85.push({ source: 'AppleLocale', value: String(v_b92a72.AppleLocale) })
      }
      if (Array.isArray(v_b92a72?.AppleLanguages) && v_b92a72.AppleLanguages[0]) {
        v_6f7c85.push({ source: 'AppleLanguages[0]', value: String(v_b92a72.AppleLanguages[0]) })
      }
    }
  } catch {}

  try {
    const v_22ee42 = v_80fa10.I18nManager?.localeIdentifier
    if (v_22ee42) v_6f7c85.push({ source: 'I18nManager.localeIdentifier', value: String(v_22ee42) })
    const v_c8af91 = v_80fa10.I18nManager?.constants?.localeIdentifier
    if (v_c8af91) v_6f7c85.push({ source: 'I18nManager.constants.localeIdentifier', value: String(v_c8af91) })
  } catch {}

  try {
    const v_12cd99 = (v_80fa10 as any).PlatformConstants?.localeIdentifier
    if (v_12cd99) v_6f7c85.push({ source: 'PlatformConstants', value: String(v_12cd99) })
  } catch {}

  console.log('[i18n] 기기 언어 후보:', v_6f7c85)

  const v_4cc6df = v_6f7c85.find(
    (v_3f4e2e) => v_3f4e2e.value && v_3f4e2e.value.toLowerCase() !== 'en-us' && v_3f4e2e.value.toLowerCase() !== 'en_us'
  )
  if (v_4cc6df) {
    console.log('[i18n] 선택된 후보:', v_4cc6df)
    return v_4cc6df.value
  }

  return v_6f7c85[0]?.value || ''
}

const v_0eb4c4 = (v_6f298b): LanguageCode => {
  if (!v_6f298b) return 'en';
  const v_75195c = v_6f298b.toLowerCase().replace('_', '-'); 
  const v_127e92 = v_75195c.split('-')[0];                  

  if (v_127e92 === 'zh') return 'zh-CN';

  if ((v_127e92 as LanguageCode) in v_e1e9c4) {
    return v_127e92 as LanguageCode;
  }

  return 'en'; 
};

const v_cc2596 = async (): Promise<LanguageCode> => {
  try {
    const v_5885b8 = await v_e84827.getItem(v_201aab);
    if (v_5885b8 && v_5885b8 in v_e1e9c4) {
      return v_5885b8 as LanguageCode;
    }

    const v_081bb8 = v_12e80e();
    const v_96262f = v_0eb4c4(v_081bb8);
    console.log('[i18n] 기기 언어 자동 감지:', v_081bb8, '→', v_96262f);
    return v_96262f;
  } catch (v_5e9bfe) {
    console.error('언어 설정 불러오기 실패:', v_5e9bfe);
  }
  return 'en'; 
};

export const v_0e4a4f = async (v_05bb19): Promise<void> => {
  try {
    await v_0e4b58(v_05bb19);
    await v_e84827.setItem(v_201aab, v_05bb19);
    await v_9c213b.changeLanguage(v_05bb19);

    v_f93aba(v_05bb19).catch(v_9e86fd => console.warn('[i18n] server sync failed:', v_9e86fd?.message));
  } catch (v_5e9bfe) {
    console.error('언어 설정 저장 실패:', v_5e9bfe);
  }
};

const v_f93aba = async (v_05bb19): Promise<void> => {
  try {
    const { getApiBaseUrl: v_755eb9, getAuthHeader: v_23dd22 } = await import('../services');
    const v_c01615 = v_755eb9();
    const v_5c1e3a = await v_23dd22();
    if (!v_5c1e3a) return; 

    await fetch(`${v_c01615}/me/language`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: v_5c1e3a },
      body: JSON.stringify({ language: v_05bb19 }),
    });
  } catch (v_9e86fd) {

  }
};

export const v_116c93 = (): typeof v_9c213b => {

  let v_94d22b = 'en'
  try {
    const v_081bb8 = v_12e80e()
    const v_2df143 = v_0eb4c4(v_081bb8)
    if (v_2df143 === 'ko') v_94d22b = 'ko'
    else if (v_2df143 === 'en') v_94d22b = 'en'
    else v_94d22b = 'en'  
  } catch {
    v_94d22b = 'en'
  }

  v_9c213b.use(v_788479).init({
    resources: { ko: { translation: v_04a966 }, en: { translation: v_5d6728 } },
    lng: v_94d22b,
    fallbackLng: 'en',
    interpolation: { escapeValue: false },
    compatibilityJSON: 'v3',
  });
  return v_9c213b;
};

export const v_1f4a13 = (): void => {
  v_cc2596()
    .then(async (v_c87b30) => {
      console.log('[i18n] 적용 대상 언어:', v_c87b30, '(현재:', v_9c213b.language, ')');

      v_f93aba(v_c87b30).catch(v_9e86fd => console.warn('[i18n] startup server sync failed:', v_9e86fd?.message));
      if (v_c87b30 === v_9c213b.language) {
        console.log('[i18n] 이미 적용됨 — skip');
        return;
      }
      if (v_c87b30 === 'ko' || v_c87b30 === 'en') {
        await v_9c213b.changeLanguage(v_c87b30);
        return;
      }
      await v_0e4b58(v_c87b30);
      await v_9c213b.changeLanguage(v_c87b30);
    })
    .then(() => console.log('[App] i18n 저장 언어 적용 완료, 현재 언어:', v_9c213b.language))
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

