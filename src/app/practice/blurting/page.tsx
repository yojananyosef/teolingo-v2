"use client";

import { useTranslation } from "@/lib/i18n/useTranslation";
import { cn } from "@/lib/utils";
import { ArrowLeft, Lightbulb, Mic, MicOff, Play, RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

export default function PracticeBlurtingPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const [isRecording, setIsRecording] = useState(false);
  const [hasRecording, setHasRecording] = useState(false);
  const [activeStep, setActiveStep] = useState(1);

  const toggleRecording = () => {
    if (isRecording) {
      setIsRecording(false);
      setHasRecording(true);
    } else {
      setIsRecording(true);
      setHasRecording(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#FDFCFB]">
      {/* Header */}
      <div className="p-4 lg:p-6 flex items-center gap-x-4 bg-white border-b-2 border-[#E5E5E5]">
        <button
          onClick={() => router.back()}
          className="p-2 hover:bg-[#F7F7F7] rounded-full transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-6 h-6 text-[#AFAFAF]" />
        </button>
        <h1 className="text-xl font-black text-[#4B4B4B] uppercase tracking-tight">
          {t("practice.blurting.title")}
        </h1>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-4 max-w-4xl mx-auto w-full">
        {activeStep === 1 ? (
          <div className="w-full space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center space-y-4">
              <div className="inline-flex items-center gap-x-2 px-4 py-1 bg-[#FFC800]/10 text-[#FFC800] rounded-full text-xs font-black uppercase tracking-widest">
                <Lightbulb size={14} />
                <span>{t("practice.blurting.feynman")}</span>
              </div>
              <h2 className="text-3xl lg:text-4xl font-black text-[#4B4B4B]">
                {t("practice.blurting.explain")}
              </h2>
              <p className="text-[#777777] font-bold text-lg max-w-xl mx-auto">
                {t("practice.blurting.instruction")}
              </p>
            </div>

            <div className="bg-white rounded-3xl border-2 border-[#E5E5E5] p-10 lg:p-16 flex flex-col items-center justify-center space-y-8 shadow-sm">
              <div
                className={cn(
                  "w-32 h-32 lg:w-40 lg:h-40 rounded-full flex items-center justify-center transition-all duration-500",
                  isRecording
                    ? "bg-[#FF4B4B] animate-pulse scale-110 shadow-[0_0_40px_rgba(255,75,75,0.4)]"
                    : "bg-[#F7F7F7] border-4 border-dashed border-[#E5E5E5]",
                )}
              >
                <button
                  onClick={toggleRecording}
                  className={cn(
                    "w-24 h-24 lg:w-28 lg:h-28 rounded-full flex items-center justify-center transition-all cursor-pointer",
                    isRecording
                      ? "bg-white text-[#FF4B4B]"
                      : "bg-[#FF4B4B] text-white hover:scale-105",
                  )}
                >
                  {isRecording ? <MicOff size={40} /> : <Mic size={40} />}
                </button>
              </div>

              <div className="text-center space-y-2">
                <p
                  className={cn(
                    "font-black text-xl uppercase tracking-widest",
                    isRecording ? "text-[#FF4B4B]" : "text-[#4B4B4B]",
                  )}
                >
                  {isRecording
                    ? t("practice.blurting.recording")
                    : hasRecording
                      ? t("practice.blurting.ready")
                      : t("practice.blurting.tapToRecord")}
                </p>
                {isRecording && (
                  <p className="text-[#AFAFAF] font-bold animate-bounce">{t("practice.blurting.speakNow")}</p>
                )}
              </div>

              {hasRecording && !isRecording && (
                <div className="flex gap-x-4">
                  <button className="flex items-center gap-x-2 px-6 py-3 bg-[#F7F7F7] text-[#4B4B4B] rounded-2xl font-black uppercase tracking-widest text-sm border-2 border-[#E5E5E5] hover:bg-[#E5E5E5] transition-all cursor-pointer">
                    <Play size={18} />
                    <span>{t("practice.blurting.listen")}</span>
                  </button>
                  <button
                    onClick={() => setHasRecording(false)}
                    className="flex items-center gap-x-2 px-6 py-3 bg-[#F7F7F7] text-[#4B4B4B] rounded-2xl font-black uppercase tracking-widest text-sm border-2 border-[#E5E5E5] hover:bg-[#E5E5E5] transition-all cursor-pointer"
                  >
                    <RefreshCw size={18} />
                    <span>{t("practice.blurting.retry")}</span>
                  </button>
                </div>
              )}
            </div>

            <div className="flex justify-center">
              <button
                disabled={!hasRecording}
                onClick={() => setActiveStep(2)}
                className={cn(
                  "px-12 py-4 rounded-2xl font-black text-lg uppercase tracking-widest transition-all border-b-4 active:translate-y-1 active:border-b-0 cursor-pointer",
                  !hasRecording
                    ? "bg-[#E5E5E5] text-[#AFAFAF] border-[#AFAFAF] cursor-not-allowed"
                    : "bg-[#58CC02] text-white border-[#46A302]",
                )}
              >
                {t("practice.blurting.saveAndContinue")}
              </button>
            </div>
          </div>
        ) : (
          <div className="w-full space-y-8 animate-in fade-in slide-in-from-right-4 duration-500 text-center">
            <div className="space-y-4">
              <h2 className="text-3xl lg:text-4xl font-black text-[#4B4B4B]">
                {t("practice.blurting.excellent")}
              </h2>
              <p className="text-[#777777] font-bold text-lg max-w-xl mx-auto">
                {t("practice.blurting.successDesc")}
              </p>
            </div>

            <div className="bg-[#D7FFB7] rounded-3xl border-2 border-[#A5ED6E] p-10 flex flex-col items-center space-y-4">
              <div className="text-6xl">🎉</div>
              <h3 className="text-2xl font-black text-[#58A700]">{t("practice.blurting.gainedXp")}</h3>
              <div className="text-4xl font-black text-[#58A700]">+25 XP</div>
            </div>

            <button
              onClick={() => router.push("/learn")}
              className="px-12 py-4 bg-[#1CB0F6] text-white rounded-2xl font-black text-lg uppercase tracking-widest border-b-4 border-[#1899D6] active:translate-y-1 active:border-b-0 transition-all cursor-pointer"
            >
              {t("practice.blurting.back")}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
