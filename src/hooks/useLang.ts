import { translate } from '../utils/translate';
import { useProvider } from '../context/provider';
import { LanguageKey, TranslationKey } from '../constants/locales';

export const useLang = () => {
  const { value } = useProvider();
  const lang = value.config.lang as LanguageKey;

  return (key: TranslationKey, vars?: Record<string, string>) =>
    translate(key, lang, vars || {});
};
