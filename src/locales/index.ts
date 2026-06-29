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
  const candidates: { source: string; value: string }[] = []

  try {
    const v = Intl?.DateTimeFormat?.()?.resolvedOptions?.()?.locale
    if (v) candidates.push({ source: 'Intl', value: String(v) })
  } catch {}

  try {
    if (Platform.OS === 'ios') {
      const settings = NativeModules.SettingsManager?.settings
      if (settings?.AppleLocale) {
        candidates.push({ source: 'AppleLocale', value: String(settings.AppleLocale) })
      }
      if (Array.isArray(settings?.AppleLanguages) && settings.AppleLanguages[0]) {
        candidates.push({ source: 'AppleLanguages[0]', value: String(settings.AppleLanguages[0]) })
      }
    }
  } catch {}

  try {
    const ident = NativeModules.I18nManager?.localeIdentifier
    if (ident) candidates.push({ source: 'I18nManager.localeIdentifier', value: String(ident) })
    const c2 = NativeModules.I18nManager?.constants?.localeIdentifier
    if (c2) candidates.push({ source: 'I18nManager.constants.localeIdentifier', value: String(c2) })
  } catch {}

  try {
    const pc = (NativeModules as any).PlatformConstants?.localeIdentifier
    if (pc) candidates.push({ source: 'PlatformConstants', value: String(pc) })
  } catch {}

  console.log('[i18n] 기기 언어 후보:', candidates)

  const nonDefault = candidates.find(
    (c) => c.value && c.value.toLowerCase() !== 'en-us' && c.value.toLowerCase() !== 'en_us'
  )
  if (nonDefault) {
    console.log('[i18n] 선택된 후보:', nonDefault)
    return nonDefault.value
  }

  return candidates[0]?.value || ''
}

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

    syncLanguageToServer(language).catch(e => console.warn('[i18n] server sync failed:', e?.message));
  } catch (error) {
    console.error('언어 설정 저장 실패:', error);
  }
};

const syncLanguageToServer = async (language: LanguageCode): Promise<void> => {
  try {
    const { getApiBaseUrl, getAuthHeader } = await import('../services');
    const baseUrl = getApiBaseUrl();
    const authHeader = await getAuthHeader();
    if (!authHeader) return; 

    await fetch(`${baseUrl}/me/language`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: authHeader },
      body: JSON.stringify({ language }),
    });
  } catch (e) {

  }
};

export const initI18nSync = (): typeof i18n => {

  let initialLng: 'ko' | 'en' = 'en'
  try {
    const deviceLocale = getDeviceLocale()
    const detected = normalizeLocaleToLanguage(deviceLocale)
    if (detected === 'ko') initialLng = 'ko'
    else if (detected === 'en') initialLng = 'en'
    else initialLng = 'en'  
  } catch {
    initialLng = 'en'
  }

  i18n.use(initReactI18next).init({
    resources: { ko: { translation: ko }, en: { translation: en } },
    lng: initialLng,
    fallbackLng: 'en',
    interpolation: { escapeValue: false },
    compatibilityJSON: 'v3',
  });
  return i18n;
};

export const applyStoredLanguageAsync = (): void => {
  getStoredLanguage()
    .then(async (lng) => {
      console.log('[i18n] 적용 대상 언어:', lng, '(현재:', i18n.language, ')');
      if (lng === i18n.language) {
        console.log('[i18n] 이미 적용됨 — skip');
        return;
      }
      if (lng === 'ko' || lng === 'en') {
        await i18n.changeLanguage(lng);
        return;
      }
      await loadLanguage(lng);
      await i18n.changeLanguage(lng);
    })
    .then(() => console.log('[App] i18n 저장 언어 적용 완료, 현재 언어:', i18n.language))
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

