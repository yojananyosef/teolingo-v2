"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, token, isHydrated } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isHydrated) return;

    const isAuthPage = pathname.startsWith("/auth");
    
    if (!user || !token) {
      if (!isAuthPage && pathname !== "/") {
        router.push("/auth/login");
      }
    } else {
      if (isAuthPage) {
        router.push("/learn");
      }
    }
  }, [user, token, isHydrated, router, pathname]);

  if (!isHydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return <>{children}</>;
}
