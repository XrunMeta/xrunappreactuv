import ko from './ko';

type TranslationKeys = typeof ko;

export type CommonTranslation = TranslationKeys['common'];
export type ScreensTranslation = TranslationKeys['screens'];
export type ComponentsTranslation = TranslationKeys['components'];

export type Translation = TranslationKeys;

