"use client";

import React from "react";
import { cn } from "@/lib/utils";

// Definición estructural para partes morfológicas explícitas
export type MorphemeType = "root" | "prefix" | "suffix" | "marker" | "normal" | "p" | "r" | "s" | "c" | "a" | "v" | "default";

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
  
  className?: string;
  textSize?: string;
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

/**
 * Función para renderizar el texto base aplicando rojo automáticamente a los niqquds/vocales
 * si el bloque completo no es ya una vocal.
 */
function renderTextWithVowels(text: string, baseColor: string, type: string) {
  if (type === "v" || type === "marker") {
    return <span style={{ color: baseColor }}>{text}</span>;
  }

  // TRUCO DEFINITIVO DE RENDERIZADO HEBREO PARA CHROMIUM/WEBKIT: 
  // Envolvemos TODO el bloque en el color base. Las consonantes son nodos de texto puros
  // que heredan inteligentemente ese color, y CADA niqqud toma un span independiente en rojo.
  // Esto evita que el cluster unifique forzosamente los colores de spans hermanos.
  return (
    <span style={{ color: baseColor }}>
      {text.split("").map((char, idx) => {
        const isNiqqud = /[\u0591-\u05C7]/.test(char);
        if (isNiqqud) {
          return (
            <span key={idx} style={{ color: "#FF4B4B" }}>
              {char}
            </span>
          );
        }
        // Base de la consonante pura
        return <React.Fragment key={idx}>{char}</React.Fragment>;
      })}
    </span>
  );
}

/**
 * Función para parsear texto manual desde JSON "[texto:tipo]" a arreglo de partes.
 */
export const parseHebrewString = (rawText: string): MorphologicalPart[] => {
  const parts: MorphologicalPart[] = [];
  const regex = /\[([^\]]+):([prscav])\]|([-–—־])|([^\[\s\-–—־]+)|(\s+)/g;
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

export function HebrewWordIME({ parts, fallbackText, className, textSize = "text-5xl lg:text-7xl" }: HebrewWordIMEProps) {
  
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
        className={cn(
          "font-black dir-rtl flex gap-0.5 justify-center flex-wrap HebrewFont items-center",
          textSize,
          className
        )}
      >
        {finalParts.map((p, idx) => (
          <span 
            key={idx} 
            className={cn(
                "transition-colors duration-300", 
                (p.type === "root" || p.type === "r") && "font-extrabold" // Énfasis en la raíz
            )}
          >
            {renderTextWithVowels(p.text, getMorphemeColor(p.type), p.type)}
          </span>
        ))}
      </div>
    );
  }

  // Fallback puro si todo falla y no hay brackets, auto-coloreamos vocales
  return (
    <span
      className={cn(
        "font-black HebrewFont dir-rtl",
        textSize,
        className
      )}
    >
      {fallbackText ? renderTextWithVowels(fallbackText, "#4B4B4B", "normal") : "—"}
    </span>
  );
}
