import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';

import ko from './ko';
import en from './en';

const resources: Record<string, { translation: typeof ko }> = {
  ko: { translation: ko },
  en: { translation: en },
};

export const LANGUAGE_CODES = {
  ko: 'ko',
  'zh-CN': 'zh-CN',
  en: 'en',
  id: 'id',
  ja: 'ja',
  th: 'th',
  hi: 'hi',
  vi: 'vi',
} as const;

export type LanguageCode = keyof typeof LANGUAGE_CODES;

const LANGUAGE_LOADERS: Record<Exclude<LanguageCode, 'ko' | 'en'>, () => Promise<{ default: typeof ko }>> = {
  'zh-CN': () => import('./zh-CN'),
  id: () => import('./id'),
  ja: () => import('./ja'),
  th: () => import('./th'),
  hi: () => import('./hi'),
  vi: () => import('./vi'),
};

let languagesLoaded = new Set<LanguageCode>(['ko', 'en']);

export function isLanguageLoaded(lng: LanguageCode): boolean {
  return languagesLoaded.has(lng);
}

export const loadLanguage = async (language: LanguageCode): Promise<void> => {
  if (languagesLoaded.has(language)) return;
  const loader = LANGUAGE_LOADERS[language as Exclude<LanguageCode, 'ko' | 'en'>];
  if (!loader) return;
  try {
    const { default: data } = await loader();
    i18n.addResourceBundle(language, 'translation', data);
    languagesLoaded.add(language);
  } catch (e) {
    console.warn('[i18n] 언어 로드 실패:', language, e);
  }
};

const LANGUAGE_STORAGE_KEY = 'app_language';

const getStoredLanguage = async (): Promise<LanguageCode> => {
  try {
    const stored = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (stored && stored in LANGUAGE_CODES) {
      return stored as LanguageCode;
    }
  } catch (error) {
    console.error('언어 설정 불러오기 실패:', error);
  }
  return 'ko'; 
};

export const setStoredLanguage = async (language: LanguageCode): Promise<void> => {
  try {
    await loadLanguage(language);
    await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, language);
    await i18n.changeLanguage(language);
  } catch (error) {
    console.error('언어 설정 저장 실패:', error);
  }
};

export const initI18n = async () => {
  const defaultLanguage = await getStoredLanguage();
  if (defaultLanguage !== 'ko' && defaultLanguage !== 'en') {
    const loader = LANGUAGE_LOADERS[defaultLanguage as Exclude<LanguageCode, 'ko' | 'en'>];
    if (loader) {
      try {
        const { default: data } = await loader();
        resources[defaultLanguage] = { translation: data };
        languagesLoaded.add(defaultLanguage);
      } catch (e) {
        console.warn('[i18n] 초기 언어 로드 실패, ko fallback:', defaultLanguage, e);
      }
    }
  }

  i18n
    .use(initReactI18next)
    .init({
      resources,
      lng: defaultLanguage,
      fallbackLng: 'ko',
      interpolation: {
        escapeValue: false, 
      },
      compatibilityJSON: 'v3', 
    });

  return i18n;
};

export default i18n;

