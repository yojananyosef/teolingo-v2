"use client";

import { playHebrewText } from "@/lib/tts";
import { cn } from "@/lib/utils";
import { ChevronRight, Volume2 } from "lucide-react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { HebrewWordIME } from "./HebrewWordIME";
import { useTranslation } from "@/lib/i18n/useTranslation";

// Why: Versión simplificada y fluida de Flashcards para memorización rápida.
// Prioriza la velocidad, menos clics y feedback auditivo automático.

interface FlashcardProps {
  type: string;
  front: {
    text: string;
    audioUrl?: string;
  };
  back: {
    meaning: string;
    translit: string;
  };
  onComplete: (quality: number) => void;
}

const useFitTextScale = (text: string) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const textRef = useRef<HTMLDivElement | null>(null);
  const [scale, setScale] = useState(1);

  useLayoutEffect(() => {
    const container = containerRef.current;
    const textEl = textRef.current;
    if (!container || !textEl) return;

    const updateScale = () => {
      const containerWidth = container.clientWidth;
      const textWidth = textEl.scrollWidth;
      if (!containerWidth || !textWidth) return;

      const paddingPx = Math.max(20, Math.round(containerWidth * 0.08));
      const availableWidth = Math.max(0, containerWidth - paddingPx);
      const nextScale = Math.min(1, availableWidth / textWidth);
      setScale(Number.isFinite(nextScale) ? nextScale : 1);
    };

    updateScale();

    const fontSet = document.fonts;
    let fontListener: (() => void) | null = null;
    if (fontSet) {
      fontSet.ready.then(updateScale).catch(() => undefined);
      fontListener = () => updateScale();
      if (fontSet.addEventListener) {
        fontSet.addEventListener("loadingdone", fontListener);
      }
    }

    let observer: ResizeObserver | null = null;
    if (typeof ResizeObserver !== "undefined") {
      observer = new ResizeObserver(updateScale);
      observer.observe(container);
      observer.observe(textEl);
    }

    const handleResize = () => updateScale();
    window.addEventListener("resize", handleResize);

    return () => {
      if (observer) observer.disconnect();
      if (fontSet && fontListener && fontSet.removeEventListener) {
        fontSet.removeEventListener("loadingdone", fontListener);
      }
      window.removeEventListener("resize", handleResize);
    };
  }, [text]);

  return { containerRef, textRef, scale };
};

export function FlashcardIME({ front, back, onComplete }: FlashcardProps) {
  const { t } = useTranslation();
  const [isFlipped, setIsFlipped] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const hasPlayedOnMount = useRef(false);
  const frontFit = useFitTextScale(front.text);
  const backFit = useFitTextScale(front.text);

  const cleanFrontText = front.text
    .replace(/\[([^\]]+):[prscavn]\]/g, "$1")
    .replace(/\s+/g, " ")
    .trim();

  const playAudio = async () => {
    if (isPlayingAudio) return;
    setIsPlayingAudio(true);
    try {
      await playHebrewText(cleanFrontText);
    } catch (err) {
      console.error("Audio failed", err);
    } finally {
      setIsPlayingAudio(false);
    }
  };

  useEffect(() => {
    if (!hasPlayedOnMount.current) {
      hasPlayedOnMount.current = true;
      playAudio();
    }
  }, []);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <div className="w-full max-w-xl mx-auto perspective-1000">
      <div
        onClick={handleFlip}
        className={cn(
          "grid w-full min-h-[400px] cursor-pointer transition-all duration-500 preserve-3d",
          isFlipped ? "rotate-y-180" : "",
        )}
      >
        {/* FRENTE */}
        <div className="col-start-1 row-start-1 w-full h-full backface-hidden bg-white border-4 border-[#E5E5E5] rounded-[2rem] p-8 flex flex-col items-center justify-center shadow-[0_8px_0_0_#E5E5E5] hover:bg-[#F7F7F7] transition-colors">
          <div
            ref={frontFit.containerRef}
            className="text-center max-w-[92%] mx-auto overflow-hidden"
          >
            <div
              ref={frontFit.textRef}
              className="inline-block transition-transform duration-200"
              style={{ transform: `scale(${frontFit.scale})`, transformOrigin: "center" }}
            >
              <HebrewWordIME
                fallbackText={front.text}
                textSize="text-[clamp(3.5rem,7vw,7rem)] lg:text-[clamp(4.5rem,6vw,8rem)]"
                className="whitespace-nowrap"
              />
            </div>
            <p className="mt-8 text-[#AFAFAF] font-black uppercase tracking-widest text-xs leading-tight">
              {t("flashcard.tapToSee")}
            </p>
          </div>
        </div>

        {/* DORSO */}
        <div className="col-start-1 row-start-1 w-full h-full backface-hidden rotate-y-180 bg-white border-4 border-[#58CC02] rounded-[2rem] p-8 flex flex-col items-center justify-center shadow-[0_8px_0_0_#58CC02]">
          <div className="text-center space-y-6 w-full">
            <div
              ref={backFit.containerRef}
              className="space-y-1 text-center max-w-[90%] mx-auto overflow-hidden"
            >
              <p className="text-[#AFAFAF] font-black uppercase tracking-widest text-xs">
                {t("flashcard.hebrewWord")}
              </p>
              <div
                ref={backFit.textRef}
                className="inline-block transition-transform duration-200"
                style={{ transform: `scale(${backFit.scale})`, transformOrigin: "center" }}
              >
                <HebrewWordIME
                  fallbackText={front.text}
                  textSize="text-[clamp(2.25rem,4vw,3rem)] lg:text-[clamp(2.75rem,3vw,3.75rem)]"
                  className="opacity-80 whitespace-nowrap"
                />
              </div>
            </div>

            <div className="space-y-1 text-center">
              <p className="text-[#AFAFAF] font-black uppercase tracking-widest text-xs">
                {t("flashcard.meaning")}
              </p>
              <h2 className="w-full px-2 max-w-[95%] mx-auto text-[clamp(1.15rem,2vw,2.25rem)] md:text-[clamp(1.4rem,2.2vw,2.65rem)] lg:text-[clamp(1.75rem,2.1vw,3rem)] font-black text-[#58CC02] uppercase tracking-tight leading-tight break-words whitespace-normal">
                {back.meaning}
              </h2>
            </div>

            <div className="space-y-1 text-center">
              <p className="text-[#AFAFAF] font-black uppercase tracking-widest text-xs">
                {t("flashcard.pronunciation")}
              </p>
              <p className="max-w-[90%] mx-auto text-2xl font-bold text-[#4B4B4B] italic break-words whitespace-normal">
                {back.translit}
              </p>
            </div>

            <div className="pt-4 flex justify-center gap-4">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  playAudio();
                }}
                className="p-4 rounded-2xl bg-[#F7F7F7] text-[#4B4B4B] hover:bg-[#E5E5E5] transition-colors border-2 border-[#E5E5E5]"
              >
                <Volume2 size={24} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* BOTÓN CONTINUAR (Solo visible cuando se ha volteado) */}
      <div
        className={cn(
          "mt-8 transition-all duration-300",
          isFlipped ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none",
        )}
      >
        <button
          onClick={() => onComplete(5)}
          className="w-full py-5 bg-[#58CC02] hover:bg-[#46A302] text-white font-black rounded-2xl shadow-[0_4px_0_0_#46A302] transition-all active:translate-y-1 active:shadow-none uppercase tracking-widest text-xl flex items-center justify-center gap-2"
        >
          {t("flashcard.next")} <ChevronRight size={24} />
        </button>
      </div>
    </div>
  );
}
