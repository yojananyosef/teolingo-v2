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
    <div className="flex min-h-screen">
      {showSidebar && <Sidebar className="fixed left-0 top-0 bottom-0" />}
      <main className={cn("flex-1", showSidebar ? "ml-64 p-8" : "")}>
        <div className={cn(showSidebar ? "max-w-4xl mx-auto" : "")}>
          {children}
        </div>
      </main>
    </div>
  );
}
