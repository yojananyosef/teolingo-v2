import { create } from "zustand";
import { persist } from "zustand/middleware";

export type AccessibilityFont = "default" | "accessible-sans";
export type AccessibilityTheme = "default" | "cream" | "pastel-blue" | "mint-green";
export type AccessibilitySpacing = "default" | "optimized" | "wcag";
export type AccessibilityTextSize = "normal" | "medium" | "large";
export type AccessibilityAlign = "default" | "left";

interface AccessibilityState {
  font: AccessibilityFont;
  theme: AccessibilityTheme;
  spacing: AccessibilitySpacing;
  textSize: AccessibilityTextSize;
  align: AccessibilityAlign;

  setFont: (font: AccessibilityFont) => void;
  setTheme: (theme: AccessibilityTheme) => void;
  setSpacing: (spacing: AccessibilitySpacing) => void;
  setTextSize: (textSize: AccessibilityTextSize) => void;
  setAlign: (align: AccessibilityAlign) => void;
  resetToDefault: () => void;
}

export const useAccessibilityStore = create<AccessibilityState>()(
  persist(
    (set) => ({
      font: "default",
      theme: "default",
      spacing: "default",
      textSize: "normal",
      align: "default",

      setFont: (font) => set({ font }),
      setTheme: (theme) => set({ theme }),
      setSpacing: (spacing) => set({ spacing }),
      setTextSize: (textSize) => set({ textSize }),
      setAlign: (align) => set({ align }),
      resetToDefault: () =>
        set({
          font: "default",
          theme: "default",
          spacing: "default",
          textSize: "normal",
          align: "default",
        }),
    }),
    {
      name: "teolingo-accessibility",
    }
  )
);
