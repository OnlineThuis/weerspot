import 'server-only';

const dictionaries = {
  en: () => import('@/dictionaries/en').then((module) => module.default),
  nl: () => import('@/dictionaries/nl').then((module) => module.default),
  fr: () => import('@/dictionaries/fr').then((module) => module.default),
};

export type Locale = keyof typeof dictionaries;

export const getDictionary = async (locale: Locale) => {
  return dictionaries[locale]?.() ?? dictionaries.en();
};
