import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Locale = "es" | "en" | "pt";

interface I18nState {
  locale: Locale;
  setLocale: (locale: Locale) => void;
}

export const useI18nStore = create<I18nState>()(
  persist(
    (set) => ({
      locale: "es", // Español por defecto
      setLocale: (locale) => set({ locale }),
    }),
    {
      name: "teolingo-locale",
    }
  )
);
