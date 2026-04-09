"use client";

import { useLayoutEffect } from "react";

interface AutoScrollProps {
  targetId: string;
}

export function AutoScroll({ targetId }: AutoScrollProps) {
  useLayoutEffect(() => {
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({
        behavior: "auto", // Salto instantáneo vs 'smooth'
        block: "center",
      });
    }
  }, [targetId]);

  return null;
}
