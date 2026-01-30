"use client";

import { getSessionAction, logoutAction } from "@/features/auth/actions";
import { useAuthStore } from "@/store/useAuthStore";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { LoadingSpinner } from "./LoadingSpinner";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, token, isHydrated, logout, setAuth } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const [isChecking] = useState(false);

  useEffect(() => {
    if (!isHydrated) return;

    const isAuthPage = pathname.startsWith("/auth");

    const checkSession = async () => {
      if (user && token && !isAuthPage) {
        // Solo verificamos si la ruta ha cambiado o después de un tiempo
        // No bloqueamos la UI con isChecking cada vez que pathname cambia si ya tenemos usuario
        try {
          const session = await getSessionAction();
          if (!session) {
            await logoutAction();
            logout();
            router.push("/auth/login");
          } else {
            // Sincronizar estado local si el servidor tiene datos más frescos
            // Pero sin disparar un ciclo de renderizado infinito
            if (
              session.points !== user.points ||
              session.streak !== user.streak ||
              session.level !== user.level
            ) {
              setAuth(
                {
                  ...user,
                  points: session.points,
                  streak: session.streak,
                  level: session.level,
                },
                token,
              );
            }
          }
        } catch (error) {
          console.error("Error al validar sesión:", error);
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
      <div className="min-h-screen flex items-center justify-center bg-white">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return <>{children}</>;
}
