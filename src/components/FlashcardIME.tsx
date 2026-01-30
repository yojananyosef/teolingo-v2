"use client";

import { playHebrewText } from "@/lib/tts";
import { cn } from "@/lib/utils";
import { Brain, ChevronRight, MessageSquare, PenTool, Pointer, Volume2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

// Why: Componente de Flashcard basado en el paradigma IME (Inmersión Multisensorial Estructurada).
// Obliga a la recuperación activa (VAKT) antes de revelar la respuesta.

type FlashcardType = "vocabulary" | "morphological" | "phonetic";

interface FlashcardProps {
  type: FlashcardType;
  front: {
    text: string;
    audioUrl?: string;
    hints?: string[];
  };
  back: {
    meaning: string;
    translit: string;
    explanation?: string;
  };
  imeMetadata?: {
    root?: string;
    colors?: { [key: string]: string }; // Map de partes de la palabra a colores IME
    gestures?: string;
  };
  onComplete: (quality: number) => void;
}

export function FlashcardIME({ type, front, back, imeMetadata, onComplete }: FlashcardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isRevealed, setIsRevealed] = useState(false);
  const [audioError, setAudioError] = useState(false);
  const [isLoadingAudio, setIsLoadingAudio] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const hasPlayedOnMount = useRef(false);
  const isPlayingRef = useRef(false);
  const localAudioRef = useRef<HTMLAudioElement | null>(null);

  // Reproducción de audio con fallback a TTS
  const playAudio = async () => {
    if (isPlayingRef.current || isPlayingAudio) return;
    isPlayingRef.current = true;
    setIsPlayingAudio(true);
    setIsLoadingAudio(true);
    setAudioError(false);

    try {
      // 1. Detener cualquier audio previo (Local o TTS)
      if (localAudioRef.current) {
        localAudioRef.current.pause();
        localAudioRef.current.src = "";
        localAudioRef.current = null;
      }
      await playHebrewText("");

      // 2. Intentar audio pre-grabado si existe
      if (front.audioUrl) {
        try {
          const audio = new Audio(front.audioUrl);
          localAudioRef.current = audio;

          const playPromise = audio.play();
          const timeoutPromise = new Promise((_, reject) =>
            setTimeout(() => reject(new Error("TIMEOUT")), 5000),
          );

          await Promise.race([playPromise, timeoutPromise]);

          audio.onended = () => {
            if (localAudioRef.current === audio) localAudioRef.current = null;
            isPlayingRef.current = false;
            setIsPlayingAudio(false);
          };

          setIsLoadingAudio(false);
          return;
        } catch (err) {
          if (localAudioRef.current) {
            localAudioRef.current.pause();
            localAudioRef.current.src = "";
            localAudioRef.current = null;
          }
          console.warn("Audio pre-grabado falló, intentando TTS:", err);
        }
      }

      // 3. Fallback o principal: TTS (Native -> Proxy)
      await playHebrewText(front.text);
    } catch (err: any) {
      console.error("Fallo total de audio:", err);
      setAudioError(true);

      // Mensaje específico si es bloqueo del navegador
      if (err.message === "REPRODUCTION_BLOCKED") {
        toast.error("El navegador bloqueó el audio. Haz clic de nuevo para activarlo.");
      } else {
        toast.error("No se pudo reproducir el audio. Intentando reconectar...");
      }
    } finally {
      setIsLoadingAudio(false);
      isPlayingRef.current = false;
      setIsPlayingAudio(false);
    }
  };

  // Reproducción automática al montar
  useEffect(() => {
    if (hasPlayedOnMount.current) return;

    // Marcamos como reproducido inmediatamente para evitar doble ejecución en StrictMode
    hasPlayedOnMount.current = true;

    // Intentar reproducir, pero no marcar error si falla (autoplay block)
    if (front.audioUrl || front.text) {
      playAudio().catch(() => {
        // Silently fail for autoplay
      });
    }
  }, [front.audioUrl, front.text]);

  const handleFlip = () => {
    if (!isFlipped) {
      setIsFlipped(true);
      // No reproducimos aquí para evitar saturación, el usuario tiene el botón manual
    }
  };

  const handleReveal = () => {
    setIsRevealed(true);
    playAudio(); // Refuerzo auditivo al revelar la respuesta
  };

  const renderFrontText = (isLarge = true) => {
    if (!imeMetadata?.colors) {
      return (
        <span
          className={cn(
            "font-black text-[#4B4B4B]",
            isLarge ? "text-5xl lg:text-7xl" : "text-3xl lg:text-4xl",
          )}
        >
          {front.text}
        </span>
      );
    }

    // Algoritmo de color-coding por sub-strings (Raíces, prefijos, sufijos)
    let highlightedText: React.ReactNode[] = [front.text];

    // Ordenar keys por longitud descendente para evitar reemplazos parciales incorrectos
    const sortedKeys = Object.keys(imeMetadata.colors).sort((a, b) => b.length - a.length);

    for (const key of sortedKeys) {
      const color = imeMetadata.colors[key];
      const newHighlightedText: React.ReactNode[] = [];

      for (const part of highlightedText) {
        if (typeof part !== "string") {
          newHighlightedText.push(part);
          continue;
        }

        // Split conservando el separador (el key)
        const segments = part.split(key);
        for (let i = 0; i < segments.length; i++) {
          newHighlightedText.push(segments[i]);
          if (i < segments.length - 1) {
            newHighlightedText.push(
              <span key={`${key}-${i}`} style={{ color }}>
                {key}
              </span>,
            );
          }
        }
      }
      highlightedText = newHighlightedText;
    }

    return (
      <div
        className={cn(
          "font-black dir-rtl flex gap-0.5 justify-center flex-wrap",
          isLarge ? "text-5xl lg:text-7xl" : "text-3xl lg:text-4xl",
        )}
      >
        {highlightedText}
      </div>
    );
  };

  return (
    <div className="w-full max-w-xl mx-auto perspective-1000">
      <div
        className={cn(
          "relative w-full min-h-[480px] transition-all duration-700 preserve-3d",
          isFlipped ? "rotate-y-180" : "",
        )}
      >
        {/* CARA A (Input Mínimo + VAKT) */}
        <div className="absolute inset-0 backface-hidden bg-white border-4 border-[#E5E5E5] rounded-[2.5rem] p-6 lg:p-8 flex flex-col items-center justify-between shadow-[0_8px_0_0_#E5E5E5]">
          <div className="absolute top-6 left-8 flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#1CB0F6] animate-pulse" />
            <span className="text-xs font-black text-[#AFAFAF] uppercase tracking-widest">
              {type}
            </span>
          </div>

          <div className="flex-1 flex flex-col items-center justify-center gap-4 lg:gap-8 w-full py-8">
            <div className="relative group flex flex-col items-center gap-4">
              {renderFrontText()}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  playAudio();
                }}
                disabled={isPlayingAudio}
                className={cn(
                  "p-4 rounded-full transition-all active:scale-95 flex items-center gap-2 font-black uppercase text-sm border-2 border-[#84D8FF] disabled:opacity-50 disabled:cursor-not-allowed",
                  audioError
                    ? "bg-red-100 text-red-500"
                    : "bg-[#DDF4FF] hover:bg-[#BEE3FF] text-[#1CB0F6]",
                  isPlayingAudio && "animate-pulse",
                )}
              >
                <Volume2 size={24} className={cn(isPlayingAudio && "animate-bounce")} />
                {isLoadingAudio ? "Cargando..." : audioError ? "Error de Audio" : "Escuchar"}
              </button>
            </div>

            <div className="flex flex-col items-center gap-4 text-center">
              <p className="text-[#4B4B4B] font-black uppercase text-lg tracking-tight">
                ¿Qué significa esta palabra?
              </p>

              <div className="flex flex-wrap justify-center gap-3 opacity-60">
                {type === "vocabulary" && (
                  <div className="flex items-center gap-2 px-4 py-2 bg-[#DDF4FF] text-[#1CB0F6] rounded-xl font-bold text-xs uppercase border-2 border-[#BDE3FF]">
                    <MessageSquare size={16} /> Di el significado
                  </div>
                )}
                {type === "phonetic" && (
                  <div className="flex items-center gap-2 px-4 py-2 bg-[#E5FFFA] text-[#00CD9E] rounded-xl font-bold text-xs uppercase border-2 border-[#B5F5E9]">
                    <PenTool size={16} /> Traza en el aire
                  </div>
                )}
                {type === "morphological" && (
                  <div className="flex items-center gap-2 px-4 py-2 bg-[#FFF5E5] text-[#FF9600] rounded-xl font-bold text-xs uppercase border-2 border-[#FFE3B8]">
                    <Brain size={16} /> Identifica la forma
                  </div>
                )}
              </div>
            </div>
          </div>

          <button
            onClick={handleFlip}
            className="w-full py-4 bg-[#1CB0F6] hover:bg-[#1899D6] text-white font-black rounded-2xl shadow-[0_4px_0_0_#1899D6] transition-all active:translate-y-1 active:shadow-none uppercase tracking-widest flex items-center justify-center gap-2"
          >
            Voltear Carta <ChevronRight size={20} />
          </button>
        </div>

        {/* CARA B (Output Guiado + Acción Forzada) */}
        <div className="absolute inset-0 backface-hidden rotate-y-180 bg-white border-4 border-[#84D8FF] rounded-[2.5rem] p-6 lg:p-8 flex flex-col items-center justify-between shadow-[0_8px_0_0_#84D8FF] overflow-hidden">
          {!isRevealed ? (
            <div className="flex-1 flex flex-col items-center justify-center gap-4 lg:gap-6 w-full text-center py-4">
              <div className="p-4 lg:p-6 bg-[#DDF4FF] rounded-full text-[#1CB0F6] animate-pulse">
                {type === "vocabulary" ? (
                  <MessageSquare size={48} />
                ) : type === "phonetic" ? (
                  <PenTool size={48} />
                ) : (
                  <Brain size={48} />
                )}
              </div>

              <div className="space-y-3">
                <h3 className="text-2xl lg:text-3xl font-black text-[#4B4B4B] uppercase">
                  ¡Es tu turno!
                </h3>
                <p className="text-[#777777] font-bold text-base lg:text-lg">
                  {type === "vocabulary" && "Di el significado en voz alta y realiza el gesto."}
                  {type === "phonetic" && "Traza la letra en el aire y di su sonido."}
                  {type === "morphological" && "Explica la función de cada parte coloreada."}
                </p>
                {imeMetadata?.gestures && (
                  <div className="mt-2 p-3 bg-[#F7F7F7] rounded-2xl border-2 border-dashed border-[#E5E5E5] inline-flex items-center gap-3">
                    <Pointer size={20} className="text-[#1CB0F6]" />
                    <span className="text-[#4B4B4B] font-black uppercase tracking-tight text-xs lg:text-sm">
                      {imeMetadata.gestures}
                    </span>
                  </div>
                )}
              </div>

              <button
                onClick={handleReveal}
                className="w-full mt-4 py-4 bg-[#58CC02] hover:bg-[#46A302] text-white font-black rounded-2xl shadow-[0_4px_0_0_#46A302] transition-all active:translate-y-1 active:shadow-none uppercase tracking-widest"
              >
                Ya lo hice, mostrar respuesta
              </button>
            </div>
          ) : (
            <>
              <div className="flex flex-col items-center gap-6 w-full">
                <div className="text-center space-y-2">
                  <div className="flex items-center justify-center gap-4">
                    {renderFrontText(false)}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        playAudio();
                      }}
                      disabled={isPlayingAudio}
                      className={cn(
                        "p-2 rounded-full active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed",
                        audioError
                          ? "bg-red-100 text-red-500"
                          : "bg-[#F7F7F7] hover:bg-[#E5E5E5] text-[#1CB0F6]",
                        isPlayingAudio && "animate-pulse",
                      )}
                    >
                      <Volume2 size={20} className={cn(isPlayingAudio && "animate-bounce")} />
                    </button>
                  </div>
                  <div className="text-[#AFAFAF] font-bold text-lg">{back.translit}</div>
                </div>

                <div className="w-full h-px bg-[#E5E5E5]" />

                <div className="text-center space-y-4">
                  <div className="text-4xl font-black text-[#58CC02] uppercase tracking-tight">
                    {back.meaning}
                  </div>
                  {back.explanation && (
                    <p className="text-[#777777] font-medium text-sm max-w-sm leading-relaxed">
                      {back.explanation}
                    </p>
                  )}
                </div>
              </div>

              <div className="w-full space-y-4">
                <p className="text-center text-[#AFAFAF] font-black uppercase text-xs tracking-widest">
                  ¿Cómo te fue con la recuperación?
                </p>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    {
                      val: 1,
                      label: "Mal",
                      color: "bg-[#FF4B4B]",
                      shadow: "shadow-[0_4px_0_0_#D33131]",
                    },
                    {
                      val: 3,
                      label: "Meh",
                      color: "bg-[#FFB800]",
                      shadow: "shadow-[0_4px_0_0_#D99C00]",
                    },
                    {
                      val: 4,
                      label: "Bien",
                      color: "bg-[#1CB0F6]",
                      shadow: "shadow-[0_4px_0_0_#1899D6]",
                    },
                    {
                      val: 5,
                      label: "Perfecto",
                      color: "bg-[#58CC02]",
                      shadow: "shadow-[0_4px_0_0_#46A302]",
                    },
                  ].map((q) => (
                    <button
                      key={q.val}
                      onClick={() => onComplete(q.val)}
                      className={cn(
                        "py-3 rounded-xl text-white font-black text-xs uppercase transition-all active:translate-y-1 active:shadow-none",
                        q.color,
                        q.shadow,
                      )}
                    >
                      {q.label}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
