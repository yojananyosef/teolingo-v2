"use client";

import { playHebrewText } from "@/lib/tts";
import { cn } from "@/lib/utils";
import { Volume2 } from "lucide-react";
import type React from "react";
import { useState } from "react";

interface HebrewMultisensorialProps {
  text: string;
  className?: string;
  onPartClick?: (part: string) => void;
  showAudioButton?: boolean;
}

export const cleanHebrewMetadata = (rawText: string) => {
  return rawText
    .replace(/\[([^\]]+):[prs]\]/g, "$1")
    .replace(/\s+/g, " ")
    .trim();
};

export const HebrewMultisensorial: React.FC<HebrewMultisensorialProps> = ({
  text,
  className,
  onPartClick,
  showAudioButton = true,
}) => {
  // Why: Procesa el texto hebreo para identificar prefijos, raíces y sufijos
  // usando el formato [texto:tipo] donde tipo es p (prefijo), r (raíz) o s (sufijo).
  // Ejemplo: "[בְּ:p] [רֵאשִׁ:r] [ית:s]"

  const parseText = (rawText: string) => {
    const parts: { text: string; type: "p" | "r" | "s" | "default" }[] = [];
    const regex = /\[([^\]]+):([prs])\]|(-)|([^\[\s-]+)|(\s+)/g;
    let match;

    while ((match = regex.exec(rawText)) !== null) {
      if (match[1] && match[2]) {
        // Marcador [texto:tipo]
        parts.push({ text: match[1], type: match[2] as "p" | "r" | "s" });
      } else if (match[3]) {
        // Maquef (-)
        parts.push({ text: "־", type: "default" });
      } else if (match[4]) {
        // Texto normal
        parts.push({ text: match[4], type: "default" });
      } else if (match[5]) {
        // Espacios
        parts.push({ text: match[5], type: "default" });
      }
    }
    return parts;
  };

  const parts = parseText(text);

  const getColorClass = (type: string) => {
    switch (type) {
      case "p":
        return "text-[#1CB0F6]"; // Azul - Prefijo
      case "r":
        return "text-[#FF4B4B]"; // Rojo - Raíz
      case "s":
        return "text-[#58CC02]"; // Verde - Sufijo
      default:
        return "text-[#4B4B4B]"; // Gris oscuro por defecto (neutral)
    }
  };

  const getLabel = (type: string) => {
    switch (type) {
      case "p":
        return "pref";
      case "r":
        return "raíz";
      case "s":
        return "suf";
      default:
        return "";
    }
  };

  const fullText = cleanHebrewMetadata(text);

  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlayAudio = async () => {
    if (isPlaying) return;
    setIsPlaying(true);
    try {
      await playHebrewText(fullText);
    } finally {
      setIsPlaying(false);
    }
  };

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
                  getColorClass(part.type),
                )}
              >
                {part.text}
              </span>
              {part.type !== "default" && (
                <span
                  className={cn(
                    "text-[10px] lg:text-xs font-bold uppercase tracking-tighter opacity-0 group-hover/part:opacity-100 transition-opacity duration-300 mt-6",
                    getColorClass(part.type),
                  )}
                >
                  {getLabel(part.type)}
                </span>
              )}
            </div>
          ))}
        </div>

        {showAudioButton && (
          <button
            onClick={handlePlayAudio}
            disabled={isPlaying}
            className={cn(
              "p-2 text-[#E5E5E5] hover:text-[#1CB0F6] hover:bg-[#F7F7F7] rounded-full transition-all active:scale-90 disabled:opacity-50 disabled:cursor-not-allowed",
              isPlaying && "animate-pulse text-[#1CB0F6]",
            )}
            title="Escuchar palabra completa"
          >
            <Volume2 size={24} className="lg:w-8 lg:h-8" />
          </button>
        )}
      </div>
    </div>
  );
};
