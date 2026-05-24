import { useI18nStore } from "@/store/useI18nStore";
import es from "./locales/es.json";
import en from "./locales/en.json";
import pt from "./locales/pt.json";

const translations: Record<string, any> = { es, en, pt };

export function useTranslation() {
  const locale = useI18nStore((state) => state.locale);
  const setLocale = useI18nStore((state) => state.setLocale);

  const t = (path: string): string => {
    const keys = path.split(".");
    let current = translations[locale] || translations["es"];

    for (const key of keys) {
      if (current[key] === undefined) {
        // Fallback al español si falta alguna traducción específica
        let fallback = translations["es"];
        for (const fKey of keys) {
          if (fallback[fKey] === undefined) return path;
          fallback = fallback[fKey];
        }
        return typeof fallback === "string" ? fallback : path;
      }
      current = current[key];
    }

    return typeof current === "string" ? current : path;
  };

  return { t, locale, setLocale };
}
