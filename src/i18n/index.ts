'use client';

import { useAtom } from 'jotai';
import { langAtom } from '../store/atoms';
import { zh } from './locales/zh';
import { en } from './locales/en';

export type Language = 'zh' | 'en';
export type TranslationSchema = typeof zh;

export const dictionaries: Record<Language, TranslationSchema> = {
  zh,
  en,
};

/**
 * Global reactive hook for internationalization (i18n)
 * Provides current language, toggle utility, and type-safe translations
 */
export function useI18n() {
  const [lang, setLang] = useAtom(langAtom);
  const t = dictionaries[lang] || dictionaries.zh;

  const toggleLang = () => {
    setLang((prev) => (prev === 'zh' ? 'en' : 'zh'));
  };

  return {
    lang,
    setLang,
    toggleLang,
    t,
    isZh: lang === 'zh',
    isEn: lang === 'en',
  };
}
