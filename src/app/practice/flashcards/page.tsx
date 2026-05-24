"use client";

import { FlashcardIME } from "@/components/FlashcardIME";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { getFlashcardsAction, updateFlashcardProgressAction } from "@/features/lessons/actions";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { ArrowLeft, Brain, Sparkles, Zap } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function FlashcardsPage() {
  const [cards, setCards] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isFinished, setIsFinished] = useState(false);
  const [stats, setStats] = useState({ perfect: 0, total: 0 });
  const { t } = useTranslation();

  async function loadCards(category: string) {
    setLoading(true);
    setSelectedCategory(category);
    const result = await getFlashcardsAction(category);
    if (result.success && result.data) {
      setCards(result.data);
      setStats({ perfect: 0, total: result.data.length });
      setCurrentIndex(0);
      setIsFinished(false);
    }
    setLoading(false);
  }

  async function handleComplete(quality: number) {
    const currentCard = cards[currentIndex];

    // Actualizar progreso en DB (Server Action)
    await updateFlashcardProgressAction(currentCard.id, quality);

    if (quality === 5) setStats((prev) => ({ ...prev, perfect: prev.perfect + 1 }));

    // Siguiente carta o finalizar
    if (currentIndex < cards.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setIsFinished(true);
    }
  }

  if (!selectedCategory) {
    return (
      <div className="max-w-4xl mx-auto space-y-8 px-4 py-12">
        <div className="text-center space-y-4">
          <div className="w-20 h-20 bg-[#FFF5E5] text-[#FF9600] rounded-3xl mx-auto flex items-center justify-center shadow-lg">
            <Sparkles size={40} />
          </div>
          <h1 className="text-4xl font-black text-[#4B4B4B] uppercase tracking-tight">
            {t("practice.flashcards.title")}
          </h1>
          <p className="text-[#777777] font-bold text-lg">
            {t("practice.flashcards.subtitle")}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((level) => (
            <button
              key={level}
              onClick={() => loadCards(`freq-${level}`)}
              className="p-6 bg-white border-2 border-b-4 border-[#E5E5E5] rounded-2xl hover:border-[#FF9600] hover:bg-[#FFF5E5] transition-all group text-left active:translate-y-1 active:shadow-none cursor-pointer"
            >
              <span className="block font-black text-[#4B4B4B] text-xl group-hover:text-[#FF9600]">
                {t("practice.flashcards.level")} {level}
              </span>
              <span className="block text-[#AFAFAF] font-bold text-sm">{t("practice.flashcards.freqTitle")}</span>
            </button>
          ))}
          <button
            onClick={() => loadCards("general")}
            className="p-6 bg-white border-2 border-b-4 border-[#E5E5E5] rounded-2xl hover:border-[#1CB0F6] hover:bg-[#DDF4FF] transition-all group text-left active:translate-y-1 active:shadow-none cursor-pointer"
          >
            <span className="block font-black text-[#4B4B4B] text-xl group-hover:text-[#1CB0F6]">
              {t("practice.flashcards.general")}
            </span>
            <span className="block text-[#AFAFAF] font-bold text-sm">{t("practice.flashcards.generalDesc")}</span>
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    const categoryLabel = selectedCategory.split("-")[1] || selectedCategory;
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <LoadingSpinner size="lg" />
        <p className="text-[#AFAFAF] font-black uppercase tracking-widest animate-pulse">
          {t("practice.flashcards.preparing").replace("{level}", categoryLabel)}
        </p>
      </div>
    );
  }

  if (cards.length === 0 && !isFinished) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 text-center px-4">
        <div className="w-20 h-20 bg-[#F7F7F7] rounded-full flex items-center justify-center">
          <Sparkles className="text-[#AFAFAF]" size={40} />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-black text-[#4B4B4B]">{t("practice.flashcards.noCards")}</h2>
          <p className="text-[#777777] max-w-xs">
            {t("practice.flashcards.noCardsDesc")}
          </p>
        </div>
        <button
          onClick={() => setSelectedCategory(null)}
          className="px-8 py-3 bg-[#1CB0F6] text-white font-black rounded-2xl shadow-[0_4px_0_0_#1899D6] hover:bg-[#1899D6] transition-all active:translate-y-1 active:shadow-none uppercase tracking-widest cursor-pointer"
        >
          {t("practice.flashcards.backToSelection")}
        </button>
      </div>
    );
  }

  if (isFinished) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-8 text-center px-4 animate-in fade-in zoom-in duration-500">
        <div className="relative">
          <div className="w-32 h-32 bg-[#FFD900] rounded-full flex items-center justify-center shadow-[0_8px_0_0_#E5B800]">
            <Zap className="text-white" size={60} fill="currentColor" />
          </div>
          <div className="absolute -top-2 -right-2 bg-[#58CC02] text-white p-2 rounded-full shadow-md">
            <Sparkles size={20} />
          </div>
        </div>

        <div className="space-y-2">
          <h2 className="text-4xl font-black text-[#4B4B4B]">{t("practice.flashcards.sessionCompleted")}</h2>
          <p className="text-[#777777] font-bold text-lg">
            {t("practice.flashcards.sessionDesc").replace("{total}", String(stats.total))}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
          <div className="bg-white border-2 border-[#E5E5E5] rounded-2xl p-4 shadow-[0_4px_0_0_#E5E5E5]">
            <p className="text-[#AFAFAF] text-[10px] font-black uppercase tracking-widest mb-1">
              {t("practice.flashcards.perfect")}
            </p>
            <p className="text-2xl font-black text-[#58CC02]">{stats.perfect}</p>
          </div>
          <div className="bg-white border-2 border-[#E5E5E5] rounded-2xl p-4 shadow-[0_4px_0_0_#E5E5E5]">
            <p className="text-[#AFAFAF] text-[10px] font-black uppercase tracking-widest mb-1">
              {t("practice.flashcards.concepts")}
            </p>
            <p className="text-2xl font-black text-[#1CB0F6]">{stats.total}</p>
          </div>
        </div>

        <button
          onClick={() => setSelectedCategory(null)}
          className="w-full max-w-sm py-4 bg-[#58CC02] text-white font-black rounded-2xl shadow-[0_4px_0_0_#46A302] hover:bg-[#46A302] transition-all active:translate-y-1 active:shadow-none uppercase tracking-widest text-lg cursor-pointer"
        >
          {t("practice.flashcards.practiceAnother")}
        </button>
        <Link
          href="/practice"
          className="text-[#AFAFAF] font-black uppercase tracking-widest text-sm hover:text-[#4B4B4B] transition-colors"
        >
          {t("practice.flashcards.backToMenu")}
        </Link>
      </div>
    );
  }

  const currentCard = cards[currentIndex];

  return (
    <div className="max-w-4xl mx-auto space-y-8 px-4 py-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Link
          href="/practice"
          className="p-2 text-[#AFAFAF] hover:text-[#1CB0F6] transition-colors"
        >
          <ArrowLeft size={24} />
        </Link>

        <div className="flex-1 max-w-md mx-8">
          <div className="h-4 bg-[#E5E5E5] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#1CB0F6] transition-all duration-500 ease-out"
              style={{ width: `${((currentIndex + 1) / cards.length) * 100}%` }}
            />
          </div>
        </div>

        <div className="flex items-center gap-2 text-[#AFAFAF] font-black text-sm">
          <Brain size={18} />
          <span>
            {currentIndex + 1} / {cards.length}
          </span>
        </div>
      </div>

      {/* Instrucción General */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-black text-[#4B4B4B] uppercase tracking-tight flex items-center justify-center gap-2">
          {t("practice.flashcards.multisensoryTitle")} <Sparkles size={20} className="text-[#FFD900]" />
        </h1>
        <p className="text-[#777777] font-bold">
          {t("practice.flashcards.multisensoryDesc")}
        </p>
      </div>

      {/* Flashcard Component */}
      <div className="py-4">
        <FlashcardIME
          key={currentCard.id}
          type={currentCard.type}
          front={currentCard.frontContent}
          back={currentCard.backContent}
          onComplete={handleComplete}
        />
      </div>

      {/* Recordatorio IME */}
      <div className="max-w-md mx-auto p-4 bg-[#F0F9FF] border-2 border-[#BEE3F8] rounded-2xl flex items-start gap-3">
        <div className="p-2 bg-white rounded-xl shadow-sm">
          <Zap size={18} className="text-[#1CB0F6]" />
        </div>
        <p className="text-xs text-[#1899D6] font-bold leading-relaxed">
          <span className="block font-black uppercase mb-1">{t("practice.flashcards.imeReminder")}</span>
          {t("practice.flashcards.imeReminderDesc")}
        </p>
      </div>
    </div>
  );
}
