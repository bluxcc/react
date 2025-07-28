import translations, { LanguageKey } from '../constants/locales';

const interpolate = (template: string, vars: Record<string, string> = {}) => {
  return template.replace(/\$\{(\w+)\}/g, (_, key) => vars[key] || '');
};

export const translate = (
  key: keyof typeof translations,
  lang: LanguageKey,
  vars: Record<string, string> = {},
): string => {
  const template = translations[key]?.[lang] || translations[key]?.en || '';
  return interpolate(template, vars);
};
