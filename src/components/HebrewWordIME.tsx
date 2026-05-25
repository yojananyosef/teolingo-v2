"use client";

import { cn } from "@/lib/utils";
import React from "react";

// Definición estructural para partes morfológicas explícitas
export type MorphemeType =
  | "root"
  | "prefix"
  | "suffix"
  | "pronoun"
  | "marker"
  | "normal"
  | "p"
  | "r"
  | "s"
  | "n"
  | "c"
  | "a"
  | "v"
  | "default";

export interface MorphologicalPart {
  text: string;
  type: MorphemeType;
}

export interface HebrewWordIMEProps {
  /**
   * Arreglo con la palabra desglosada (Arqueología del Shoresh).
   * La base de datos debe enviar este formato en lo posible.
   */
  parts?: MorphologicalPart[];

  /**
   * Como fallback temporal, si solo se pasa un string, se renderiza como genérico/normal.
   */
  fallbackText?: string;

  /**
   * Controla si los niqqud se resaltan en rojo o conservan el color morfológico.
   * - all: resalta niqqud en todos los morfemas.
   * - none: nunca resalta niqqud.
   * - non-suffix: no resalta niqqud en sufijos.
   * - non-affix: no resalta niqqud en prefijos/sufijos/artículos.
   */
  niqqudColorMode?: "all" | "none" | "non-suffix" | "non-affix";

  className?: string;
  textSize?: string;
  course?: "hebrew" | "greek";
}

/**
 * Obtiene el color correspondiente según la directriz IME v1.1
 */
const getMorphemeColor = (type: MorphemeType): string => {
  switch (type) {
    case "root":
    case "r":
      return "#4B4B4B"; // Gris oscuro para la raíz/shoresh (ancla visual)
    case "prefix":
    case "p":
      return "#58CC02"; // Verde para prefijos (inicio alteración)
    case "suffix":
    case "s":
      return "#1CB0F6"; // Azul para sufijos (alteración final - persona/género)
    case "pronoun":
    case "n":
      return "#FF6F3C"; // Naranja para pronombres (ancla de identificación)
    case "marker":
    case "v":
      return "#FF4B4B"; // Rojo suave para vocales/niqqud (alteración)
    case "c":
      return "#FFC800"; // Amarillo/Naranja para conjunciones
    case "a":
      return "#CE82FF"; // Morado para artículos
    default:
      return "#4B4B4B"; // Default fallback black/gray
  }
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

/**
 * Render robusto en Chromium/WebKit para colorear niqqud y portadores vocálicos
 * sin perder color morfológico de raíz/prefijo/sufijo.
 */
const shouldHighlightNiqqud = (type: string, mode: "all" | "none" | "non-suffix" | "non-affix") => {
  if (mode === "none") return false;

  const isSuffix = type === "s" || type === "suffix";
  const isPrefix = type === "p" || type === "prefix";
  const isArticle = type === "a";

  if (mode === "non-suffix") return !isSuffix;
  if (mode === "non-affix") return !(isSuffix || isPrefix || isArticle);

  return true;
};

function renderTextWithVowels(
  text: string,
  baseColor: string,
  type: string,
  niqqudColorMode: "all" | "none" | "non-suffix" | "non-affix" = "all",
) {
  if (type === "v" || type === "marker") {
    return <span style={{ color: baseColor }}>{text}</span>;
  }

  if (!shouldHighlightNiqqud(type, niqqudColorMode)) {
    return <span style={{ color: baseColor }}>{text}</span>;
  }

  const clusters = splitHebrewClusters(text);

  const isHireqYodCarrier = (idx: number) => {
    if (idx <= 0) return false;
    const current = clusters[idx];
    const prev = clusters[idx - 1];
    if (!current || !prev) return false;

    return (
      current.base === "י" && current.marks.length === 0 && Array.from(prev.marks).some(isHireqMark)
    );
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
        const isHolamPlenoCluster =
          cluster.base === "ו" && marksChars.some((mark) => isHolamMark(mark));
        const isShureqCluster =
          cluster.base === "ו" && marksChars.some((mark) => isShureqMark(mark));
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
            <span
              aria-hidden
              className="absolute inset-0 pointer-events-none select-none"
              style={{ color: baseColor }}
            >
              {baseCluster}
            </span>
          </span>
        );
      })}
    </span>
  );
}

/**
 * Función para parsear texto manual desde JSON "[texto:tipo]" a arreglo de partes.
 */
export const parseHebrewString = (rawText: string): MorphologicalPart[] => {
  const parts: MorphologicalPart[] = [];
  const regex = /\[([^\]]+):([prscavn])\]|([-–—־])|([^\[\s\-–—־]+)|(\s+)/g;
  let match;

  while ((match = regex.exec(rawText)) !== null) {
    if (match[1] && match[2]) {
      parts.push({ text: match[1], type: match[2] as MorphemeType });
    } else if (match[3]) {
      parts.push({ text: "־", type: "default" });
    } else if (match[4]) {
      parts.push({ text: match[4], type: "default" });
    } else if (match[5]) {
      parts.push({ text: match[5], type: "default" });
    }
  }
  return parts;
};

export function HebrewWordIME({
  parts,
  fallbackText,
  className,
  textSize = "text-5xl lg:text-7xl",
  niqqudColorMode = "all",
  course = "hebrew",
}: HebrewWordIMEProps) {
  // Resolvemos la lista de partes a renderizar
  let finalParts: MorphologicalPart[] | null = null;

  if (parts && parts.length > 0) {
    finalParts = parts;
  } else if (fallbackText && fallbackText.includes("[")) {
    // Si viene crudo pero con marcas, lo parseamos on the fly
    finalParts = parseHebrewString(fallbackText);
  }

  if (finalParts && finalParts.length > 0) {
    return (
      <div
        dir={course === "greek" ? "ltr" : "rtl"}
        className={cn(
          "font-black flex gap-0.5 justify-center flex-nowrap items-center",
          course !== "greek" && "HebrewFont",
          textSize,
          className,
        )}
      >
        {finalParts.map((p, idx) => (
          <span
            key={idx}
            className={cn(
              "transition-colors duration-300",
              (p.type === "root" || p.type === "r") && "font-extrabold", // Énfasis en la raíz
            )}
          >
            {renderTextWithVowels(p.text, getMorphemeColor(p.type), p.type, niqqudColorMode)}
          </span>
        ))}
      </div>
    );
  }

  // Fallback puro si todo falla y no hay brackets, auto-coloreamos vocales
  return (
    <span
      dir={course === "greek" ? "ltr" : "rtl"}
      className={cn("font-black", course !== "greek" && "HebrewFont", textSize, className)}
    >
      {fallbackText
        ? renderTextWithVowels(fallbackText, "#4B4B4B", "normal", niqqudColorMode)
        : "—"}
    </span>
  );
}
