import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';

import ko from './ko';
import zhCN from './zh-CN';
import en from './en';
import id from './id';
import ja from './ja';

const resources = {
  ko: { translation: ko },
  'zh-CN': { translation: zhCN },
  en: { translation: en },
  id: { translation: id },
  ja: { translation: ja },
};

export const LANGUAGE_CODES = {
  ko: 'ko',
  'zh-CN': 'zh-CN',
  en: 'en',
  id: 'id',
  ja: 'ja',
} as const;

export type LanguageCode = keyof typeof LANGUAGE_CODES;

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
    await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, language);
    await i18n.changeLanguage(language);
  } catch (error) {
    console.error('언어 설정 저장 실패:', error);
  }
};

export const initI18n = async () => {
  const defaultLanguage = await getStoredLanguage();

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

