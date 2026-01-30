"use client";

import { completeIsraeliUnitAction } from "@/features/israeli-mode/actions";
import {
  HebrewMultisensorial,
  cleanHebrewMetadata,
} from "@/features/lessons/components/HebrewMultisensorial";
import { playHebrewText } from "@/lib/tts";
import { playFinished } from "@/lib/utils";
import { CheckCircle2, ChevronLeft, ChevronRight, Volume2, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface IsraeliModeClientProps {
  unit: any;
}

export function IsraeliModeClient({ unit }: IsraeliModeClientProps) {
  const router = useRouter();
  const [phase, setPhase] = useState(1); // 1, 2, or 3
  const [currentIdx, setCurrentIdx] = useState(0);
  const [showMeaning, setShowMeaning] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [accuracy] = useState(100);

  const vocabulary = unit.vocabulary;
  const sentences = unit.sentences;

  const handleNext = () => {
    if (phase === 1) {
      if (currentIdx < vocabulary.length - 1) {
        setCurrentIdx(currentIdx + 1);
        setShowMeaning(false);
      } else {
        setPhase(2);
        setCurrentIdx(0);
      }
    } else if (phase === 2) {
      if (currentIdx < sentences.length - 1) {
        setCurrentIdx(currentIdx + 1);
      } else {
        setPhase(3);
        setCurrentIdx(0);
      }
    } else if (phase === 3) {
      if (currentIdx < sentences.length - 1) {
        setCurrentIdx(currentIdx + 1);
      } else {
        handleFinish();
      }
    }
  };

  const handleBack = () => {
    if (currentIdx > 0) {
      setCurrentIdx(currentIdx - 1);
    } else if (phase > 1) {
      const prevPhase = phase - 1;
      setPhase(prevPhase);
      setCurrentIdx(prevPhase === 1 ? vocabulary.length - 1 : sentences.length - 1);
    }
  };

  const handleFinish = async () => {
    playFinished();
    setIsFinished(true);
    await completeIsraeliUnitAction(unit.id, accuracy);
  };

  if (isFinished) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-white">
        <div className="w-full max-w-md text-center space-y-8">
          <div className="flex justify-center">
            <div className="bg-[#58CC02] p-6 rounded-full shadow-lg">
              <CheckCircle2 size={80} className="text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-black text-[#4B4B4B]">¡Excelente trabajo!</h1>
          <p className="text-xl text-[#777777]">
            Has completado la inmersión de <strong>{unit.title}</strong>.
          </p>
          <div className="bg-[#F7F7F7] p-6 rounded-2xl border-2 border-[#E5E5E5]">
            <p className="text-[#4B4B4B] font-bold text-lg">Recompensas</p>
            <div className="flex justify-around mt-4">
              <div className="text-center">
                <p className="text-2xl font-black text-[#FF9600]">+30</p>
                <p className="text-xs font-bold text-[#777777] uppercase tracking-wider">XP</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-black text-[#1CB0F6]">100%</p>
                <p className="text-xs font-bold text-[#777777] uppercase tracking-wider">
                  Precisión
                </p>
              </div>
            </div>
          </div>
          <button
            onClick={() => router.push("/learn")}
            className="w-full bg-[#58CC02] hover:bg-[#46A302] text-white font-black py-4 rounded-2xl shadow-[0_4px_0_0_#46A302] transition-all active:translate-y-1 active:shadow-none text-xl"
          >
            CONTINUAR
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Header */}
      <header className="flex items-center gap-4 p-4 lg:p-6 border-b-2 border-[#E5E5E5]">
        <button
          onClick={() => router.back()}
          className="text-[#AFAFAF] hover:text-[#4B4B4B] transition-colors"
        >
          <X size={24} />
        </button>
        <div className="flex-1 h-4 bg-[#E5E5E5] rounded-full overflow-hidden">
          <div
            className="h-full bg-[#58CC02] transition-all duration-500"
            style={{
              width: `${(phase - 1) * 33.33 + ((currentIdx + 1) / (phase === 1 ? vocabulary.length : sentences.length)) * 33.33}%`,
            }}
          />
        </div>
        <div className="text-[#4B4B4B] font-black text-sm uppercase tracking-widest">
          Fase {phase}/3
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-6 max-w-4xl mx-auto w-full">
        {phase === 1 && (
          <div className="w-full space-y-12 animate-in fade-in slide-in-from-bottom-4">
            <div className="text-center space-y-4">
              <h2 className="text-[#777777] font-bold text-lg uppercase tracking-widest">
                Fase 1: Inmersión Léxica
              </h2>
              <p className="text-[#4B4B4B] text-2xl font-black">
                Familiarízate con el sonido y la forma
              </p>
            </div>

            <div className="flex flex-col items-center gap-8">
              <div
                className="bg-white border-4 border-[#E5E5E5] p-12 rounded-3xl shadow-xl w-full max-w-sm flex flex-col items-center gap-6 cursor-pointer hover:border-[#1CB0F6] transition-all group"
                onClick={() => {
                  playHebrewText(cleanHebrewMetadata(vocabulary[currentIdx].frontContent.text));
                  setShowMeaning(true);
                }}
              >
                <div className="flex flex-col items-center gap-4">
                  <HebrewMultisensorial
                    text={vocabulary[currentIdx].frontContent.text}
                    showAudioButton={false}
                    className="scale-110"
                  />
                </div>
                <div className="text-center space-y-4 w-full">
                  {showMeaning && (
                    <div className="animate-in zoom-in duration-300 border-t-2 border-[#E5E5E5] pt-4 mt-4 w-full">
                      <span className="text-2xl font-bold text-[#1CB0F6] block">
                        {vocabulary[currentIdx].backContent.translit}
                      </span>
                      <span className="text-xl font-medium text-[#777777] block mt-2">
                        {vocabulary[currentIdx].backContent.meaning}
                      </span>
                    </div>
                  )}
                </div>
              </div>
              <p className="text-[#AFAFAF] font-bold italic">
                {showMeaning
                  ? "Haz clic en SIGUIENTE para continuar"
                  : "Haz clic en la tarjeta para escuchar y ver el significado"}
              </p>
            </div>
          </div>
        )}

        {phase === 2 && (
          <div className="w-full space-y-12 animate-in fade-in slide-in-from-bottom-4">
            <div className="text-center space-y-4">
              <h2 className="text-[#777777] font-bold text-lg uppercase tracking-widest">
                Fase 2: Mundo Cerrado
              </h2>
              <p className="text-[#4B4B4B] text-2xl font-black">Escucha y observa las oraciones</p>
            </div>

            <div className="flex flex-col items-center gap-8">
              <div className="bg-[#F7F7F7] border-4 border-[#E5E5E5] p-12 rounded-3xl w-full flex flex-col items-center gap-8">
                <button
                  onClick={() =>
                    playHebrewText(cleanHebrewMetadata(sentences[currentIdx].hebrewText))
                  }
                  className="p-4 bg-white border-2 border-[#E5E5E5] rounded-2xl hover:bg-[#1CB0F6] hover:text-white hover:border-[#1CB0F6] transition-all shadow-md active:translate-y-1"
                >
                  <Volume2 size={32} />
                </button>
                <div className="text-center space-y-6 w-full flex flex-col items-center">
                  <HebrewMultisensorial
                    text={sentences[currentIdx].hebrewText}
                    showAudioButton={false}
                    className="scale-125"
                  />
                  <div className="h-px w-full bg-[#E5E5E5] mt-6" />
                  <span className="text-2xl font-bold text-[#777777] block italic">
                    {sentences[currentIdx].translation}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {phase === 3 && (
          <div className="w-full space-y-12 animate-in fade-in slide-in-from-bottom-4">
            <div className="text-center space-y-4">
              <h2 className="text-[#777777] font-bold text-lg uppercase tracking-widest">
                Fase 3: Traducción Guiada
              </h2>
              <p className="text-[#4B4B4B] text-2xl font-black">
                Explica el significado de la oración
              </p>
            </div>

            <div className="flex flex-col items-center gap-8">
              <div className="bg-white border-4 border-[#1CB0F6] p-12 rounded-3xl shadow-xl w-full flex flex-col items-center gap-8">
                <div className="w-full flex justify-center">
                  <HebrewMultisensorial
                    text={sentences[currentIdx].hebrewText}
                    showAudioButton={false}
                    className="scale-125"
                  />
                </div>

                <div className="w-full space-y-4">
                  <p className="text-[#777777] font-bold text-center">
                    ¿Qué significa esta oración?
                  </p>
                  <div className="bg-[#F7F7F7] p-6 rounded-2xl border-2 border-[#E5E5E5] text-center">
                    <p className="text-xl font-bold text-[#4B4B4B] blur-sm hover:blur-none transition-all cursor-help">
                      {sentences[currentIdx].translation}
                    </p>
                    <p className="text-xs text-[#AFAFAF] mt-2 font-bold uppercase tracking-wider">
                      Pasa el cursor para ver la respuesta
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 w-full">
                  <button
                    onClick={() =>
                      playHebrewText(cleanHebrewMetadata(sentences[currentIdx].hebrewText))
                    }
                    className="flex-1 flex items-center justify-center gap-2 bg-[#1CB0F6] text-white font-black py-4 rounded-2xl shadow-[0_4px_0_0_#1899D6] hover:bg-[#1899D6] transition-all active:translate-y-1 active:shadow-none"
                  >
                    <Volume2 size={24} /> ESCUCHAR
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="p-4 lg:p-8 border-t-2 border-[#E5E5E5]">
        <div className="max-w-4xl mx-auto flex justify-between gap-4">
          <button
            onClick={handleBack}
            disabled={phase === 1 && currentIdx === 0}
            className="px-6 lg:px-12 py-3 lg:py-4 rounded-2xl border-2 border-[#E5E5E5] text-[#AFAFAF] font-black hover:bg-[#F7F7F7] transition-all disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wider flex items-center gap-2"
          >
            <ChevronLeft size={20} /> ATRÁS
          </button>
          <button
            onClick={handleNext}
            className="flex-1 lg:flex-none px-12 lg:px-24 py-3 lg:py-4 rounded-2xl bg-[#58CC02] text-white font-black shadow-[0_4px_0_0_#46A302] hover:bg-[#46A302] transition-all active:translate-y-1 active:shadow-none uppercase tracking-wider flex items-center justify-center gap-2"
          >
            {phase === 3 && currentIdx === sentences.length - 1 ? "FINALIZAR" : "SIGUIENTE"}{" "}
            <ChevronRight size={20} />
          </button>
        </div>
      </footer>
    </div>
  );
}
