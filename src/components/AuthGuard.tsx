"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { getSessionAction, logoutAction } from "@/features/auth/actions";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, token, isHydrated, logout } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const [isChecking, setIsChecking] = useState(false);

  useEffect(() => {
    if (!isHydrated) return;

    const isAuthPage = pathname.startsWith("/auth");

    const checkSession = async () => {
      if (user && token && !isAuthPage) {
        setIsChecking(true);
        try {
          const session = await getSessionAction();
          if (!session) {
            await logoutAction();
            logout();
            router.push("/auth/login");
          }
        } catch (error) {
          console.error("Error al validar sesión:", error);
        } finally {
          setIsChecking(false);
        }
      }
    };

    if (!user || !token) {
      if (!isAuthPage && pathname !== "/") {
        router.push("/auth/login");
      }
    } else {
      if (isAuthPage) {
        router.push("/learn");
      } else {
        // Solo verificamos si no estamos ya en una página de autenticación
        checkSession();
      }
    }
  }, [user, token, isHydrated, router, pathname, logout]);

  if (!isHydrated || isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return <>{children}</>;
}
