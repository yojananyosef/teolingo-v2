"use client";

import { useEffect } from "react";

interface AutoScrollProps {
  targetId: string;
}

export function AutoScroll({ targetId }: AutoScrollProps) {
  useEffect(() => {
    // Pequeño delay para asegurar que el DOM esté listo y las animaciones iniciales no interfieran
    const timer = setTimeout(() => {
      const element = document.getElementById(targetId);
      if (element) {
        element.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [targetId]);

  return null;
}
