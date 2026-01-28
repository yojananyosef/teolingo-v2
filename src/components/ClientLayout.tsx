"use client";

import { usePathname } from "next/navigation";
import { Sidebar } from "@/components/Sidebar";
import { cn } from "@/lib/utils";

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const isAuthPage = pathname.startsWith("/auth");
  const isLessonPage = pathname.startsWith("/lesson/");
  const isHomePage = pathname === "/";
  
  const showSidebar = !isAuthPage && !isLessonPage && !isHomePage;

  return (
    <div className="flex flex-col lg:flex-row min-h-screen max-w-[100vw] overflow-x-hidden">
      {showSidebar && (
        <>
          {/* Sidebar para desktop */}
          <Sidebar className="hidden lg:flex fixed left-0 top-0 bottom-0" />
          
          {/* Bottom Nav para mobile */}
          <div className="lg:hidden fixed bottom-0 left-0 right-0 h-16 bg-white border-t-2 border-[#E5E5E5] z-50 px-4">
            <nav className="flex items-center justify-around h-full">
              <Sidebar isMobile />
            </nav>
          </div>
        </>
      )}
      <main className={cn("flex-1", showSidebar ? "lg:ml-64 pb-24 lg:pb-8" : "")}>
        <div className={cn(showSidebar ? "max-w-4xl mx-auto" : "")}>
          {children}
        </div>
      </main>
    </div>
  );
}
