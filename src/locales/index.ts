import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeModules, Platform } from 'react-native';

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

const getDeviceLocale = (): string => {

  try {
    const intlLocale = Intl?.DateTimeFormat?.()?.resolvedOptions?.()?.locale;
    if (intlLocale && typeof intlLocale === 'string' && intlLocale.length >= 2) {
      return intlLocale;
    }
  } catch {

  }

  try {
    if (Platform.OS === 'ios') {
      const settings = NativeModules.SettingsManager?.settings;
      const raw =
        settings?.AppleLocale ||
        (Array.isArray(settings?.AppleLanguages) ? settings.AppleLanguages[0] : '') ||
        '';
      return String(raw);
    }

    return String(NativeModules.I18nManager?.localeIdentifier || '');
  } catch {
    return '';
  }
};

const normalizeLocaleToLanguage = (locale: string): LanguageCode => {
  if (!locale) return 'en';
  const normalized = locale.toLowerCase().replace('_', '-'); 
  const primary = normalized.split('-')[0];                  

  if (primary === 'zh') return 'zh-CN';

  if ((primary as LanguageCode) in LANGUAGE_CODES) {
    return primary as LanguageCode;
  }

  return 'en'; 
};

const getStoredLanguage = async (): Promise<LanguageCode> => {
  try {
    const stored = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (stored && stored in LANGUAGE_CODES) {
      return stored as LanguageCode;
    }

    const deviceLocale = getDeviceLocale();
    const auto = normalizeLocaleToLanguage(deviceLocale);
    console.log('[i18n] 기기 언어 자동 감지:', deviceLocale, '→', auto);
    return auto;
  } catch (error) {
    console.error('언어 설정 불러오기 실패:', error);
  }
  return 'en'; 
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

export const initI18nSync = (): typeof i18n => {
  i18n.use(initReactI18next).init({
    resources: { ko: { translation: ko }, en: { translation: en } },
    lng: 'ko',
    fallbackLng: 'ko',
    interpolation: { escapeValue: false },
    compatibilityJSON: 'v3',
  });
  return i18n;
};

export const applyStoredLanguageAsync = (): void => {
  getStoredLanguage()
    .then((lng) => {
      if (lng === 'ko') return;
      if (lng === 'en') return i18n.changeLanguage('en');
      return loadLanguage(lng).then(() => i18n.changeLanguage(lng));
    })
    .then(() => console.log('[App] i18n 저장 언어 적용 완료'))
    .catch((e) => console.warn('[i18n] 저장 언어 적용 실패:', e));
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

