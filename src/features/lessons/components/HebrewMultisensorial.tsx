"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Volume2 } from "lucide-react";
import { playHebrewText } from "@/lib/tts";

interface HebrewMultisensorialProps {
  text: string;
  className?: string;
  onPartClick?: (part: string) => void;
  showAudioButton?: boolean;
}

export const HebrewMultisensorial: React.FC<HebrewMultisensorialProps> = ({
  text,
  className,
  onPartClick,
  showAudioButton = true,
}) => {
  // Why: Procesa el texto hebreo para identificar prefijos, raíces y sufijos
  // usando el formato [texto:tipo] donde tipo es p (prefijo), r (raíz) o s (sufijo).
  // Ejemplo: "[בְּ:p] [רֵא:r] [שִׁית:s]"

  const parseText = (rawText: string) => {
    const parts: { text: string; type: "p" | "r" | "s" | "default" }[] = [];
    const regex = /\[([^\]]+):([prs])\]|([^\[\s]+)|(\s+)/g;
    let match;

    while ((match = regex.exec(rawText)) !== null) {
      if (match[1] && match[2]) {
        // Marcador [texto:tipo]
        parts.push({ text: match[1], type: match[2] as "p" | "r" | "s" });
      } else if (match[3]) {
        // Texto normal
        parts.push({ text: match[3], type: "default" });
      } else if (match[4]) {
        // Espacios
        parts.push({ text: match[4], type: "default" });
      }
    }
    return parts;
  };

  const parts = parseText(text);

  const getColorClass = (type: string) => {
    switch (type) {
      case "p": return "text-[#1CB0F6]"; // Azul - Prefijo
      case "r": return "text-[#FF4B4B]"; // Rojo - Raíz
      case "s": return "text-[#58CC02]"; // Verde - Sufijo
      default: return "text-[#1CB0F6]";  // Azul por defecto
    }
  };

  const getLabel = (type: string) => {
    switch (type) {
      case "p": return "pref";
      case "r": return "raíz";
      case "s": return "suf";
      default: return "";
    }
  };

  const fullText = parts.map(p => p.text).join("");

  return (
    <div className={cn("flex flex-col items-center gap-y-4", className)}>
      <div className="flex items-center justify-center gap-x-3 group" dir="rtl">
        <div className="flex flex-wrap items-center justify-center gap-x-1 lg:gap-x-2">
          {parts.map((part, index) => (
            <div key={index} className="flex flex-col items-center group/part">
              <span
                onClick={() => onPartClick?.(part.text)}
                className={cn(
                  "text-6xl lg:text-8xl font-black HebrewFont transition-all duration-300 cursor-pointer hover:scale-110",
                  getColorClass(part.type)
                )}
              >
                {part.text}
              </span>
              {part.type !== "default" && (
                <span className={cn(
                  "text-[10px] lg:text-xs font-bold uppercase tracking-tighter opacity-0 group-hover/part:opacity-100 transition-opacity duration-300",
                  getColorClass(part.type)
                )}>
                  {getLabel(part.type)}
                </span>
              )}
            </div>
          ))}
        </div>

        {showAudioButton && (
          <button
            onClick={() => playHebrewText(fullText)}
            className="p-2 text-[#E5E5E5] hover:text-[#1CB0F6] hover:bg-[#F7F7F7] rounded-full transition-all active:scale-90"
            title="Escuchar palabra completa"
          >
            <Volume2 size={24} className="lg:w-8 lg:h-8" />
          </button>
        )}
      </div>
    </div>
  );
};
