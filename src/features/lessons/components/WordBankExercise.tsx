"use client";

import { HebrewWordIME, type MorphologicalPart } from "@/components/HebrewWordIME";
import { playHebrewText } from "@/lib/tts";
import { cn } from "@/lib/utils";
import { useUIStore } from "@/store/useUIStore";
import { useState } from "react";
import { useTranslation } from "@/lib/i18n/useTranslation";

export type WordBlock = {
  id: string;
  text: string;
  parts?: MorphologicalPart[]; // Nuevo: Soporte explícito de Arqueología del Shoresh
  type?: "p" | "r" | "s" | "n" | "c" | "a" | "v" | "default"; // Para colores morfológicos (Hebreo)
};

interface WordBankExerciseProps {
  blocks: WordBlock[];
  selectedBlocks: WordBlock[];
  onChange: (blocks: WordBlock[]) => void;
  mode: "hebrew-to-spanish" | "spanish-to-hebrew";
  isFinished?: boolean;
}

export function WordBankExercise({
  blocks,
  selectedBlocks,
  onChange,
  mode,
  isFinished = false,
}: WordBankExerciseProps) {
  const { t } = useTranslation();
  const { isLowEnergyMode } = useUIStore();
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const isHebrew = mode === "spanish-to-hebrew";
  const containerDir = isHebrew ? "rtl" : "ltr";

  const sanitizeWordBlockForAudio = (rawText: string) => {
    return rawText
      .replace(/\[([^\]]+):[prscavn]\]/g, "$1")
      .replace(/\[([^\]]+):[^\]]+\]/g, "$1")
      .replace(/[[\]]/g, "")
      .replace(/\s+/g, " ")
      .trim();
  };

  // Manejo de Colores Morfológicos
  const getBlockColors = (type?: string) => {
    switch (type) {
      case "p":
        return "bg-[#D7FFB7] border-[#A5ED6E] text-[#58CC02]"; // Verde
      case "r":
        return "bg-[#F7F7F7] border-[#E5E5E5] text-[#4B4B4B]"; // Gris
      case "s":
        return "bg-[#DDF4FF] border-[#84D8FF] text-[#1CB0F6]"; // Azul
      case "n":
        return "bg-[#FFF0EC] border-[#FFB9A0] text-[#FF6F3C]"; // Naranja (Pronombre)
      case "c":
        return "bg-[#FFF4DA] border-[#FFC800] text-[#FFC800]"; // Amarillo
      case "a":
        return "bg-[#F3E5F5] border-[#CE82FF] text-[#CE82FF]"; // Morado
      case "v":
        return "bg-[#FFDADC] border-[#FF4B4B] text-[#FF4B4B]"; // Rojo
      default:
        return "bg-white border-[#E5E5E5] text-[#4B4B4B]"; // Base Neutral
    }
  };

  const handlePlayAudio = async (text: string) => {
    if (!isHebrew || isPlayingAudio) return;
    setIsPlayingAudio(true);
    try {
      await playHebrewText(sanitizeWordBlockForAudio(text));
    } finally {
      setIsPlayingAudio(false);
    }
  };

  const selectBlock = (block: WordBlock) => {
    if (isFinished) return;
    if (isHebrew) handlePlayAudio(block.text); // Reproducir audio si es hebreo (VAKT)
    onChange([...selectedBlocks, block]);
  };

  const deselectBlock = (block: WordBlock) => {
    if (isFinished) return;
    onChange(selectedBlocks.filter((b) => b.id !== block.id));
  };

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-4xl mx-auto gap-y-4 sm:gap-y-6 lg:gap-y-8">
      {/* Drop Zone (Línea de Respuesta) */}
      <div
        className={cn(
          "w-full min-h-[72px] sm:min-h-[100px] p-3 sm:p-4 border-[3px] sm:border-4 rounded-2xl sm:rounded-[20px] flex flex-wrap items-center justify-start gap-2 sm:gap-3 transition-all",
          isLowEnergyMode ? "border-solid border-[#E5E5E5]" : "border-dashed border-[#E5E5E5]",
          selectedBlocks.length === 0 && "justify-center",
        )}
        dir={containerDir}
      >
        {selectedBlocks.length === 0 && (
          <p className="text-[#AFAFAF] font-black uppercase tracking-widest text-[10px] sm:text-xs lg:text-sm">
            {t("wordBank.instruction")}
          </p>
        )}
        {selectedBlocks.map((block) => (
          <button
            key={block.id}
            onClick={() => deselectBlock(block)}
            className={cn(
              "px-3 py-2 sm:px-4 sm:py-3 lg:px-6 lg:py-4 font-black rounded-xl sm:rounded-2xl border-2 border-b-[3px] sm:border-b-4 transition-transform",
              isHebrew
                ? "text-xl sm:text-2xl lg:text-3xl"
                : "text-sm sm:text-base lg:text-xl leading-tight",
              !isLowEnergyMode &&
                !isFinished &&
                "active:scale-95 active:border-b-2 active:translate-y-1 hover:brightness-95",
              getBlockColors(block.type),
              isHebrew && "HebrewFont",
            )}
            style={{
              boxShadow: isLowEnergyMode ? "none" : "2px 2px 0px 0px rgba(0,0,0,0.05)",
            }}
          >
            {isHebrew ? (
              <HebrewWordIME
                parts={block.parts}
                fallbackText={block.text}
                niqqudColorMode="non-affix"
                textSize="text-xl sm:text-2xl lg:text-3xl"
              />
            ) : (
              block.text
            )}
          </button>
        ))}
      </div>

      {/* Word Bank (Banco de Palabras) */}
      <div
        className="w-full flex flex-wrap items-center justify-center gap-2 sm:gap-3 min-h-[60px] sm:min-h-[80px]"
        dir={containerDir}
      >
        {blocks.map((block) => {
          // Si el bloque está seleccionado, dejamos un hueco vacío (placeholder) en su lugar original
          const isSelected = selectedBlocks.some((b) => b.id === block.id);

          if (isSelected) {
            return (
              <div
                key={`placeholder-${block.id}`}
                className="px-3 py-2 sm:px-4 sm:py-3 lg:px-6 lg:py-4 bg-[#F7F7F7] border-2 border-transparent rounded-xl sm:rounded-2xl text-transparent select-none pointer-events-none text-sm sm:text-base lg:text-xl"
              >
                {block.text}
              </div>
            );
          }

          return (
            <button
              key={block.id}
              onClick={() => selectBlock(block)}
              className={cn(
                "px-3 py-2 sm:px-4 sm:py-3 lg:px-6 lg:py-4 font-black bg-white border-2 border-[#E5E5E5] border-b-[3px] sm:border-b-4 rounded-xl sm:rounded-2xl text-[#4B4B4B] transition-transform",
                isHebrew
                  ? "text-xl sm:text-2xl lg:text-3xl"
                  : "text-sm sm:text-base lg:text-xl leading-tight",
                !isLowEnergyMode &&
                  !isFinished &&
                  "hover:bg-[#F7F7F7] active:scale-95 active:border-b-2 active:translate-y-1",
                isHebrew && "HebrewFont",
                isFinished && "opacity-50 cursor-not-allowed",
              )}
              style={{
                boxShadow: isLowEnergyMode ? "none" : "3px 3px 0px 0px rgba(0,0,0,0.1)",
              }}
            >
              {isHebrew ? (
                <HebrewWordIME
                  parts={block.parts}
                  fallbackText={block.text}
                  niqqudColorMode="non-affix"
                  textSize="text-xl sm:text-2xl lg:text-3xl"
                />
              ) : (
                block.text
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
