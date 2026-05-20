"use client";

import { playHebrewText } from "@/lib/tts";
import { cn } from "@/lib/utils";
import { Volume2 } from "lucide-react";
import React, { useState } from "react";

interface HebrewMultisensorialProps {
  text: string;
  className?: string;
  onPartClick?: (part: string) => void;
  showAudioButton?: boolean;
  isLong?: boolean;
  compact?: boolean;
  colorNiqqud?: boolean;
  niqqudColorMode?: "all" | "none" | "non-suffix";
}

export const cleanHebrewMetadata = (rawText: string) => {
  return rawText
    .replace(/\[([^\]]+):[prscavn]\]/g, "$1")
    .replace(/\s+/g, " ")
    .trim();
};

export const HebrewMultisensorial: React.FC<HebrewMultisensorialProps> = ({
  text,
  className,
  onPartClick,
  showAudioButton = true,
  isLong = false,
  compact = false,
  colorNiqqud = true,
  niqqudColorMode,
}) => {
  // Why: Procesa el texto hebreo para identificar prefijos, raíces y sufijos
  // usando el formato [texto:tipo] donde tipo es p (prefijo), r (raíz) o s (sufijo).
  // Ejemplo: "[בְּ:p] [רֵאשִׁ:r] [ית:s]"

  const parseText = (rawText: string) => {
    const parts: { text: string; type: "p" | "r" | "s" | "n" | "c" | "a" | "v" | "default" }[] = [];
    // Soporta guiones normales, en-dash, em-dash y el maquef hebreo original
    const regex = /\[([^\]]+):([prscavn])\]|([-–—־])|([^\[\s\-–—־]+)|(\s+)/g;
    let match;

    while ((match = regex.exec(rawText)) !== null) {
      if (match[1] && match[2]) {
        // Marcador [texto:tipo]
        parts.push({ text: match[1], type: match[2] as "p" | "r" | "s" | "n" | "c" | "a" | "v" });
      } else if (match[3]) {
        // Maquef (cualquier tipo de guion se convierte al maquef hebreo U+05BE)
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
  const groups = (() => {
    const res: { text: string; type: "p" | "r" | "s" | "n" | "c" | "a" | "v" | "default" }[][] = [];
    let currentGroup: { text: string; type: "p" | "r" | "s" | "n" | "c" | "a" | "v" | "default" }[] = [];

    parts.forEach((part) => {
      if (part.type === "default" && part.text.trim() === "") {
        if (currentGroup.length > 0) {
          res.push(currentGroup);
          currentGroup = [];
        }
      } else {
        currentGroup.push(part);
      }
    });
    if (currentGroup.length > 0) {
      res.push(currentGroup);
    }
    return res;
  })();

  const getColorClass = (type: string) => {
    switch (type) {
      case "p":
        return "text-[#58CC02]"; // Verde - Prefijo
      case "r":
        return "text-[#4B4B4B]"; // Gris Oscuro - Raíz
      case "s":
        return "text-[#1CB0F6]"; // Azul - Sufijo
      case "n":
        return "text-[#FF6F3C]"; // Naranja - Pronombre
      case "c":
        return "text-[#FFC800]"; // Amarillo/Naranja - Conjunción
      case "a":
        return "text-[#CE82FF]"; // Morado - Artículo
      case "v":
        return "text-[#FF4B4B]"; // Rojo Suave - Vocal/Niqqud
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
      case "n":
        return "pron";
      case "c":
        return "conj";
      case "a":
        return "art";
      case "v":
        return "voc";
      default:
        return "";
    }
  };

  const getHexColor = (type: string) => {
    switch (type) {
      case "p": return "#58CC02"; // Verde
      case "r": return "#4B4B4B"; // Gris
      case "s": return "#1CB0F6"; // Azul
      case "n": return "#FF6F3C"; // Naranja
      case "v": return "#FF4B4B"; // Rojo
      case "a": return "#CE82FF"; // Morado
      default: return "#4B4B4B"; // Default gris oscuro
    }
  };

  const resolveNiqqudMode = () => {
    if (niqqudColorMode) return niqqudColorMode;
    return colorNiqqud ? "all" : "none";
  };

  const shouldHighlightNiqqud = (type: string) => {
    const mode = resolveNiqqudMode();
    if (mode === "none") return false;
    if (mode === "non-suffix") return type !== "s";
    return true;
  };

  const isNiqqudMark = (char: string) => /[\u0591-\u05C7]/.test(char);
  const isVowelMark = (char: string) => /[\u05B0-\u05BB\u05C7]/.test(char);
  const isHireqMark = (char: string) => char === "\u05B4";
  const isHolamMark = (char: string) => /[\u05B9\u05BA]/.test(char);
  const isShureqMark = (char: string) => char === "\u05BC";

  const splitHebrewClusters = (raw: string) => {
    const clusters: Array<{ base: string; marks: string }> = [];

    for (const char of Array.from(raw)) {
      if (isNiqqudMark(char)) {
        if (clusters.length === 0) {
          clusters.push({ base: "", marks: char });
        } else {
          clusters[clusters.length - 1].marks += char;
        }
      } else {
        clusters.push({ base: char, marks: "" });
      }
    }

    return clusters;
  };

  const renderTextWithVowels = (text: string, type: string) => {
    if (type === "v" || type === "c" || type === "a") {
      return text;
    }
    
    const baseColor = getHexColor(type);
    const highlightNiqqud = shouldHighlightNiqqud(type);

    if (!highlightNiqqud) {
      return <span style={{ color: baseColor }}>{text}</span>;
    }

    const clusters = splitHebrewClusters(text);

    // Detecta el patrón hiriq-yod (ִי) para colorear también la yod como vocal larga.
    const isHireqYodCarrier = (idx: number) => {
      if (idx <= 0) return false;
      const current = clusters[idx];
      const prev = clusters[idx - 1];
      if (!current || !prev) return false;

      return current.base === "י" && current.marks.length === 0 && Array.from(prev.marks).some(isHireqMark);
    };

    return (
      <span style={{ color: baseColor }}>
        {clusters.map((cluster, idx) => {
          if (!cluster.base) {
            const onlyVowels = Array.from(cluster.marks).every((mark) => isVowelMark(mark));
            return (
              <span key={idx} style={{ color: onlyVowels ? "#FF4B4B" : baseColor }}>
                {cluster.marks}
              </span>
            );
          }

          const marksChars = Array.from(cluster.marks);
          const nonVowelMarks = marksChars.filter((mark) => !isVowelMark(mark)).join("");
          const vowelMarks = marksChars.filter((mark) => isVowelMark(mark)).join("");
          const isHolamPlenoCluster = cluster.base === "ו" && marksChars.some((mark) => isHolamMark(mark));
          const isShureqCluster = cluster.base === "ו" && marksChars.some((mark) => isShureqMark(mark));
          const isHireqYodCluster = isHireqYodCarrier(idx);
          const fullCluster = `${cluster.base}${cluster.marks}`;
          const baseCluster = `${cluster.base}${nonVowelMarks}`;

          if (!vowelMarks) {
            return (
              <span
                key={idx}
                style={{
                  color:
                    isHolamPlenoCluster || isShureqCluster || isHireqYodCluster
                      ? "#FF4B4B"
                      : baseColor,
                }}
              >
                {fullCluster}
              </span>
            );
          }

          if (isHolamPlenoCluster) {
            return (
              <span key={idx} style={{ color: "#FF4B4B" }}>
                {fullCluster}
              </span>
            );
          }

          return (
            <span key={idx} className="relative inline-block leading-none align-baseline">
              <span style={{ color: "#FF4B4B" }}>{fullCluster}</span>
              <span aria-hidden className="absolute inset-0 pointer-events-none select-none" style={{ color: baseColor }}>
                {baseCluster}
              </span>
            </span>
          );
        })}
      </span>
    );
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
    <div className={cn("flex flex-col items-center gap-y-4 w-full", className)}>
      <div className="flex items-center justify-center gap-x-3 group w-full" dir="rtl">
        <div className="flex flex-wrap items-center justify-center gap-x-4 lg:gap-x-8 gap-y-4 lg:gap-y-8 max-w-full">
          {groups.map((group, groupIndex) => (
            <div key={groupIndex} className="flex items-center flex-nowrap whitespace-nowrap">
              {group.map((part, index) => (
                <div key={index} className="flex flex-col items-center group/part shrink-0">
                  <span
                    onClick={() => onPartClick?.(part.text)}
                    className={cn(
                      "font-black HebrewFont transition-all duration-300 cursor-pointer hover:scale-110",
                      compact
                        ? "text-3xl sm:text-4xl lg:text-5xl"
                        : isLong
                          ? "text-5xl sm:text-6xl md:text-7xl lg:text-5xl"
                          : "text-5xl sm:text-6xl md:text-7xl lg:text-8xl",
                      getColorClass(part.type),
                      part.text === "־" && "relative -top-[0.35em] scale-x-125 mx-1",
                    )}
                  >
                    {renderTextWithVowels(part.text, part.type)}
                  </span>
                  {part.type !== "default" && (
                    <span
                      className={cn(
                        "text-[8px] sm:text-[10px] lg:text-xs font-bold uppercase tracking-tighter opacity-0 group-hover/part:opacity-100 transition-opacity duration-300",
                        compact ? "mt-1 lg:mt-2" : "mt-2 lg:mt-6",
                        getColorClass(part.type),
                      )}
                    >
                      {getLabel(part.type)}
                    </span>
                  )}
                </div>
              ))}
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
