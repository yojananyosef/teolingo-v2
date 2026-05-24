import { useI18nStore } from "@/store/useI18nStore";
import es from "./locales/es.json";
import en from "./locales/en.json";
import pt from "./locales/pt.json";

const translations: Record<string, any> = { es, en, pt };

export function useTranslation() {
  const locale = useI18nStore((state) => state.locale);
  const setLocale = useI18nStore((state) => state.setLocale);

  const t = (path: string, params?: Record<string, string | number>): string => {
    const keys = path.split(".");
    let current = translations[locale] || translations["es"];

    for (const key of keys) {
      if (current[key] === undefined) {
        // Fallback al español si falta alguna traducción específica
        let fallback = translations["es"];
        let found = true;
        for (const fKey of keys) {
          if (fallback[fKey] === undefined) {
            found = false;
            break;
          }
          fallback = fallback[fKey];
        }
        current = found ? fallback : path;
        break;
      }
      current = current[key];
    }

    if (typeof current !== "string") return path;

    if (params) {
      let result = current;
      for (const [key, value] of Object.entries(params)) {
        result = result.replace(new RegExp(`{${key}}`, "g"), String(value));
      }
      return result;
    }

    return current;
  };

  return { t, locale, setLocale };
}
