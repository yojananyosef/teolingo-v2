"use client";

import { Sidebar } from "@/components/Sidebar";
import { cn } from "@/lib/utils";
import { useUIStore } from "@/store/useUIStore";
import { useI18nStore } from "@/store/useI18nStore";
import { useAccessibilityStore } from "@/store/useAccessibilityStore";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { isSidebarCollapsed } = useUIStore();
  const { font, theme, spacing, textSize, align } = useAccessibilityStore();

  useEffect(() => {
    // Detect device/browser language only if the user hasn't saved a choice yet
    const storedLocale = localStorage.getItem("teolingo-locale");
    if (!storedLocale) {
      try {
        const browserLang = navigator.language || (navigator as any).userLanguage || "es";
        const languageCode = browserLang.split("-")[0].toLowerCase();
        
        if (languageCode === "pt" || languageCode === "br") {
          useI18nStore.getState().setLocale("pt");
        } else if (languageCode === "en") {
          useI18nStore.getState().setLocale("en");
        } else {
          useI18nStore.getState().setLocale("es");
        }
      } catch (e) {
        console.warn("Error detecting language, defaulting to 'es':", e);
      }
    }
  }, []);

  useEffect(() => {
    const html = document.documentElement;

    // 1. Limpiar clases previas de accesibilidad
    const classesToRemove = Array.from(html.classList).filter((c) =>
      c.startsWith("accessibility-")
    );
    classesToRemove.forEach((c) => html.classList.remove(c));

    // 2. Aplicar nuevas clases basadas en el store
    if (font !== "default") {
      html.classList.add(`accessibility-font-${font}`);
    }
    if (theme !== "default") {
      html.classList.add(`accessibility-theme-${theme}`);
    }
    if (spacing !== "default") {
      html.classList.add(`accessibility-spacing-${spacing}`);
    }
    if (textSize !== "normal") {
      html.classList.add(`accessibility-size-${textSize}`);
    }
    if (align !== "default") {
      html.classList.add(`accessibility-align-${align}`);
    }
  }, [font, theme, spacing, textSize, align]);

  const isAuthPage = pathname.startsWith("/auth");
  const isLessonPage = pathname.startsWith("/lesson/") || pathname.startsWith("/modes/israeli/");
  const isHomePage = pathname === "/";

  const showSidebar = !isAuthPage && !isLessonPage && !isHomePage;

  return (
    <div className="flex flex-col lg:flex-row h-screen max-w-[100vw] overflow-hidden">
      {showSidebar && (
        <>
          {/* Sidebar para desktop */}
          <Sidebar className="hidden lg:flex fixed left-0 top-0 bottom-0" />

          {/* Bottom Nav para mobile */}
          <div className="lg:hidden fixed bottom-0 left-0 right-0 h-16 bg-white border-t-2 border-[#E5E5E5] z-50 px-4 shrink-0">
            <nav className="flex items-center justify-around h-full">
              <Sidebar isMobile />
            </nav>
          </div>
        </>
      )}
      <main
        className={cn(
          "flex-1 overflow-y-auto no-scrollbar transition-all duration-300",
          showSidebar ? `${isSidebarCollapsed ? "lg:ml-20" : "lg:ml-64"} pb-16 lg:pb-0` : "",
        )}
      >
        <div className={cn(showSidebar ? "max-w-5xl mx-auto" : "")}>{children}</div>
      </main>
    </div>
  );
}
