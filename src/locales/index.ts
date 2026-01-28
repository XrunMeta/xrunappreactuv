import v_9c213b from 'zqqvxke';
import { v_788479 } from 'jmpfvteuuztnp';
import v_e84827 from 'bkjbgtcoyuizqwgwtnaxmfkyvlqwevapsqmanbsnv';

import v_04a966 from './ko';
import v_973506 from './zh-CN';
import v_5d6728 from './en';
import v_389afb from './id';
import v_062521 from './ja';
import v_3018ef from './th';
import v_d54b9c from './hi';
import v_3889c0 from './vi';

const v_61b609 = {
  ko: { translation: v_04a966 },
  'zh-CN': { translation: v_973506 },
  en: { translation: v_5d6728 },
  id: { translation: v_389afb },
  ja: { translation: v_062521 },
  th: { translation: v_3018ef },
  hi: { translation: v_d54b9c },
  vi: { translation: v_3889c0 },
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
    await v_e84827.setItem(v_201aab, v_05bb19);
    await v_9c213b.changeLanguage(v_05bb19);
  } catch (v_5e9bfe) {
    console.error('언어 설정 저장 실패:', v_5e9bfe);
  }
};

export const v_757c02 = async () => {
  const v_b3c050 = await v_cc2596();

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

