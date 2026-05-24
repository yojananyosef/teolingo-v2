"use client";

import { useAuthStore } from "@/store/useAuthStore";
import { useUIStore } from "@/store/useUIStore";
import { useTranslation } from "@/lib/i18n/useTranslation";
import {
  BookOpen,
  Clock,
  Dumbbell,
  Flame,
  Heart,
  Layers,
  Link2,
  MessageSquareText,
  Music,
  Network,
  PenLine,
  Puzzle,
  Shuffle,
  Type,
  Volume2,
  VolumeX,
  X,
  Zap,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function PracticePage() {
  const { user } = useAuthStore();
  const {
    isRandomExerciseOrder,
    toggleRandomExerciseOrder,
    isAutoPlayExerciseAudioEnabled,
    toggleAutoPlayExerciseAudio,
  } = useUIStore();
  const { t } = useTranslation();
  const router = useRouter();
  const [showFreqModal, setShowFreqModal] = useState(false);

  useEffect(() => {
    if (!user) {
      router.push("/auth/login");
    }
  }, [user, router]);

  if (!user) return null;

  const randomQuery = isRandomExerciseOrder ? "1" : "0";

  return (
    <div className="max-w-4xl mx-auto py-4 lg:py-12 px-4 lg:px-8 pb-20 lg:pb-12">
      <div className="flex flex-col sm:flex-row items-center gap-3 lg:gap-6 mb-6 lg:mb-12 text-center sm:text-left">
        <div className="p-2 lg:p-4 bg-[#58CC02] text-white rounded-2xl lg:rounded-3xl shadow-[0_4px_0_0_#46A302]">
          <Dumbbell size={24} className="lg:w-10 lg:h-10" />
        </div>
        <div>
          <h1 className="text-xl lg:text-4xl font-black text-[#4B4B4B] uppercase tracking-tight">
            {t("practice.title")}
          </h1>
          <p className="text-[#777777] font-bold text-sm lg:text-lg mt-0.5 lg:mt-1">
            {t("practice.subtitle")}
          </p>
        </div>
      </div>

      <div className="mb-6 lg:mb-8 flex flex-wrap justify-center sm:justify-start gap-2.5">
        <button
          type="button"
          onClick={toggleRandomExerciseOrder}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border-2 border-[#E5E5E5] hover:bg-[#F7F7F7] transition-colors cursor-pointer"
          title={t("practice.randomOrder")}
        >
          <Shuffle
            size={16}
            className={isRandomExerciseOrder ? "text-[#1CB0F6]" : "text-[#AFAFAF]"}
          />
          <span className="text-[10px] lg:text-xs font-black uppercase tracking-widest text-[#777777]">
            {t("practice.randomOrder")}
          </span>
          <span
            className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wide ${
              isRandomExerciseOrder ? "bg-[#DDF4FF] text-[#1CB0F6]" : "bg-[#F1F1F1] text-[#AFAFAF]"
            }`}
          >
            {isRandomExerciseOrder ? "On" : "Off"}
          </span>
        </button>

        <button
          type="button"
          onClick={toggleAutoPlayExerciseAudio}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border-2 border-[#E5E5E5] hover:bg-[#F7F7F7] transition-colors cursor-pointer"
          title={t("practice.autoAudioTitle")}
        >
          {isAutoPlayExerciseAudioEnabled ? (
            <Volume2 size={16} className="text-[#1CB0F6]" />
          ) : (
            <VolumeX size={16} className="text-[#AFAFAF]" />
          )}
          <span className="text-[10px] lg:text-xs font-black uppercase tracking-widest text-[#777777]">
            {t("practice.autoAudio")}
          </span>
          <span
            className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wide ${
              isAutoPlayExerciseAudioEnabled
                ? "bg-[#DDF4FF] text-[#1CB0F6]"
                : "bg-[#F1F1F1] text-[#AFAFAF]"
            }`}
          >
            {isAutoPlayExerciseAudioEnabled ? "On" : "Off"}
          </span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-8">
        {/* 1. Frecuencia Bíblica */}
        <div
          onClick={() => setShowFreqModal(true)}
          className="bg-white p-6 lg:p-10 rounded-3xl lg:rounded-[2rem] border-2 border-[#E5E5E5] shadow-[0_4px_0_0_#E5E5E5] flex flex-col items-center text-center space-y-3 lg:space-y-6 hover:bg-[#F7F7F7] transition-all cursor-pointer group active:translate-y-1 active:shadow-none"
        >
          <div className="p-4 lg:p-8 bg-[#FFF5E5] text-[#FF9600] rounded-2xl lg:rounded-3xl transition-transform group-hover:scale-110">
            <Flame size={32} className="lg:w-16 lg:h-16" />
          </div>
          <div>
            <h2 className="text-lg lg:text-3xl font-black text-[#4B4B4B] uppercase tracking-tight">
              {t("practice.modes.freq.title")}
            </h2>
            <p className="text-[#777777] font-bold text-xs lg:text-lg mt-1 lg:mt-2 leading-relaxed">
              {t("practice.modes.freq.desc")}
            </p>
          </div>
          <button className="w-full py-2.5 lg:py-4 bg-[#FF9600] text-white font-black rounded-xl lg:rounded-2xl border-b-4 lg:border-b-8 border-[#CC7800] hover:bg-[#FFA31A] transition-all uppercase tracking-widest text-xs lg:text-lg cursor-pointer">
            {t("practice.select")}
          </button>
        </div>

        {/* 2. Sustantivos */}
        <div
          onClick={() => router.push(`/lesson/practice?mode=nouns&random=${randomQuery}`)}
          className="bg-white h-full p-6 lg:p-10 rounded-3xl lg:rounded-[2rem] border-2 border-[#E5E5E5] shadow-[0_4px_0_0_#E5E5E5] flex flex-col items-center text-center space-y-3 lg:space-y-6 hover:bg-[#F7F7F7] transition-all cursor-pointer group active:translate-y-1 active:shadow-none"
        >
          <div className="p-4 lg:p-8 bg-[#FFE8FC] text-[#CE82FF] rounded-2xl lg:rounded-3xl transition-transform group-hover:scale-110">
            <Network size={32} className="lg:w-16 lg:h-16" />
          </div>
          <div>
            <h2 className="text-lg lg:text-3xl font-black text-[#4B4B4B] uppercase tracking-tight">
              {t("practice.modes.nouns.title")}
            </h2>
            <p className="text-[#777777] font-bold text-xs lg:text-lg mt-1 lg:mt-2 leading-relaxed">
              {t("practice.modes.nouns.desc")}
            </p>
          </div>
          <button className="w-full mt-auto py-2.5 lg:py-4 bg-[#CE82FF] text-white font-black rounded-xl lg:rounded-2xl border-b-4 lg:border-b-8 border-[#A855F7] hover:bg-[#D99BFF] transition-all uppercase tracking-widest text-xs lg:text-lg cursor-pointer">
            {t("practice.analyze")}
          </button>
        </div>

        {/* 3. Adjetivos */}
        <div
          onClick={() => router.push(`/lesson/practice?mode=adjectives&random=${randomQuery}`)}
          className="bg-white h-full p-6 lg:p-10 rounded-3xl lg:rounded-[2rem] border-2 border-[#E5E5E5] shadow-[0_4px_0_0_#E5E5E5] flex flex-col items-center text-center space-y-3 lg:space-y-6 hover:bg-[#F7F7F7] transition-all cursor-pointer group active:translate-y-1 active:shadow-none"
        >
          <div className="p-4 lg:p-8 bg-[#E9FBEF] text-[#2EA44F] rounded-2xl lg:rounded-3xl transition-transform group-hover:scale-110">
            <Type size={32} className="lg:w-16 lg:h-16" />
          </div>
          <div>
            <h2 className="text-lg lg:text-3xl font-black text-[#4B4B4B] uppercase tracking-tight">
              {t("practice.modes.adjectives.title")}
            </h2>
            <p className="text-[#777777] font-bold text-xs lg:text-lg mt-1 lg:mt-2 leading-relaxed">
              {t("practice.modes.adjectives.desc")}
            </p>
          </div>
          <button className="w-full mt-auto py-2.5 lg:py-4 bg-[#2EA44F] text-white font-black rounded-xl lg:rounded-2xl border-b-4 lg:border-b-8 border-[#22863A] hover:bg-[#34B657] transition-all uppercase tracking-widest text-xs lg:text-lg cursor-pointer">
            {t("practice.practiceBtn")}
          </button>
        </div>

        {/* 4. Prefijos */}
        <div
          onClick={() => router.push(`/lesson/practice?mode=prefixes&random=${randomQuery}`)}
          className="bg-white h-full p-6 lg:p-10 rounded-3xl lg:rounded-[2rem] border-2 border-[#E5E5E5] shadow-[0_4px_0_0_#E5E5E5] flex flex-col items-center text-center space-y-3 lg:space-y-6 hover:bg-[#F7F7F7] transition-all cursor-pointer group active:translate-y-1 active:shadow-none"
        >
          <div className="p-4 lg:p-8 bg-[#EEF3FF] text-[#2B5CD9] rounded-2xl lg:rounded-3xl transition-transform group-hover:scale-110">
            <Layers size={32} className="lg:w-16 lg:h-16" />
          </div>
          <div>
            <h2 className="text-lg lg:text-3xl font-black text-[#4B4B4B] uppercase tracking-tight">
              {t("practice.modes.prefixes.title")}
            </h2>
            <p className="text-[#777777] font-bold text-xs lg:text-lg mt-1 lg:mt-2 leading-relaxed">
              {t("practice.modes.prefixes.desc")}
            </p>
          </div>
          <button className="w-full mt-auto py-2.5 lg:py-4 bg-[#2B5CD9] text-white font-black rounded-xl lg:rounded-2xl border-b-4 lg:border-b-8 border-[#1F46A7] hover:bg-[#3871FF] transition-all uppercase tracking-widest text-xs lg:text-lg cursor-pointer">
            {t("practice.analyze")}
          </button>
        </div>

        {/* 5. Inmersión */}
        <div
          onClick={() => router.push("/immerse")}
          className="bg-white p-6 lg:p-10 rounded-3xl lg:rounded-[2rem] border-2 border-[#E5E5E5] shadow-[0_4px_0_0_#E5E5E5] flex flex-col items-center text-center space-y-3 lg:space-y-6 hover:bg-[#F7F7F7] transition-all cursor-pointer group active:translate-y-1 active:shadow-none"
        >
          <div className="p-4 lg:p-8 bg-[#DDF4FF] text-[#1CB0F6] rounded-2xl lg:rounded-3xl transition-transform group-hover:scale-110">
            <Music size={32} className="lg:w-16 lg:h-16" />
          </div>
          <div>
            <h2 className="text-lg lg:text-3xl font-black text-[#4B4B4B] uppercase tracking-tight">
              {t("practice.modes.immerse.title")}
            </h2>
            <p className="text-[#777777] font-bold text-xs lg:text-lg mt-1 lg:mt-2 leading-relaxed">
              {t("practice.modes.immerse.desc")}
            </p>
          </div>
          <button className="w-full py-2.5 lg:py-4 bg-[#1CB0F6] text-white font-black rounded-xl lg:rounded-2xl border-b-4 lg:border-b-8 border-[#1899D6] hover:bg-[#20C4FF] transition-all uppercase tracking-widest text-xs lg:text-lg cursor-pointer">
            {t("practice.start")}
          </button>
        </div>

        {/* 5.5 Pronombres */}
        <div
          onClick={() => router.push(`/lesson/practice?mode=pronouns&random=${randomQuery}`)}
          className="bg-white h-full p-6 lg:p-10 rounded-3xl lg:rounded-[2rem] border-2 border-[#E5E5E5] shadow-[0_4px_0_0_#E5E5E5] flex flex-col items-center text-center space-y-3 lg:space-y-6 hover:bg-[#F7F7F7] transition-all cursor-pointer group active:translate-y-1 active:shadow-none"
        >
          <div className="p-4 lg:p-8 bg-[#FFF0EC] text-[#FF6F3C] rounded-2xl lg:rounded-3xl transition-transform group-hover:scale-110">
            <MessageSquareText size={32} className="lg:w-16 lg:h-16" />
          </div>
          <div>
            <h2 className="text-lg lg:text-3xl font-black text-[#4B4B4B] uppercase tracking-tight">
              {t("practice.modes.pronouns.title")}
            </h2>
            <p className="text-[#777777] font-bold text-xs lg:text-lg mt-1 lg:mt-2 leading-relaxed">
              {t("practice.modes.pronouns.desc")}
            </p>
          </div>
          <button className="w-full mt-auto py-2.5 lg:py-4 bg-[#FF6F3C] text-white font-black rounded-xl lg:rounded-2xl border-b-4 lg:border-b-8 border-[#D95B2F] hover:bg-[#FF7E50] transition-all uppercase tracking-widest text-xs lg:text-lg cursor-pointer">
            {t("practice.practiceBtn")}
          </button>
        </div>

        {/* 5.6 Sufijos Pronominales */}
        <div
          onClick={() => router.push(`/lesson/practice?mode=suffixes&random=${randomQuery}`)}
          className="bg-white h-full p-6 lg:p-10 rounded-3xl lg:rounded-[2rem] border-2 border-[#E5E5E5] shadow-[0_4px_0_0_#E5E5E5] flex flex-col items-center text-center space-y-3 lg:space-y-6 hover:bg-[#F7F7F7] transition-all cursor-pointer group active:translate-y-1 active:shadow-none"
        >
          <div className="p-4 lg:p-8 bg-[#EAF5FF] text-[#0091FF] rounded-2xl lg:rounded-3xl transition-transform group-hover:scale-110">
            <Link2 size={32} className="lg:w-16 lg:h-16" />
          </div>
          <div>
            <h2 className="text-lg lg:text-3xl font-black text-[#4B4B4B] uppercase tracking-tight">
              {t("practice.modes.suffixes.title")}
            </h2>
            <p className="text-[#777777] font-bold text-xs lg:text-lg mt-1 lg:mt-2 leading-relaxed">
              {t("practice.modes.suffixes.desc")}
            </p>
          </div>
          <button className="w-full mt-auto py-2.5 lg:py-4 bg-[#0091FF] text-white font-black rounded-xl lg:rounded-2xl border-b-4 lg:border-b-8 border-[#0076CC] hover:bg-[#1AA1FF] transition-all uppercase tracking-widest text-xs lg:text-lg cursor-pointer">
            {t("practice.analyze")}
          </button>
        </div>

        {/* 5.7 Verbos (Qal perfecto) */}
        <div
          onClick={() => router.push(`/lesson/practice?mode=verbs&random=${randomQuery}`)}
          className="bg-white h-full p-6 lg:p-10 rounded-3xl lg:rounded-[2rem] border-2 border-[#E5E5E5] shadow-[0_4px_0_0_#E5E5E5] flex flex-col items-center text-center space-y-3 lg:space-y-6 hover:bg-[#F7F7F7] transition-all cursor-pointer group active:translate-y-1 active:shadow-none"
        >
          <div className="p-4 lg:p-8 bg-[#EEF2FF] text-[#4F46E5] rounded-2xl lg:rounded-3xl transition-transform group-hover:scale-110">
            <PenLine size={32} className="lg:w-16 lg:h-16" />
          </div>
          <div>
            <h2 className="text-lg lg:text-3xl font-black text-[#4B4B4B] uppercase tracking-tight">
              {t("practice.modes.verbsPerfect.title")}
            </h2>
            <p className="text-[#777777] font-bold text-xs lg:text-lg mt-1 lg:mt-2 leading-relaxed">
              {t("practice.modes.verbsPerfect.desc")}
            </p>
          </div>
          <button className="w-full mt-auto py-2.5 lg:py-4 bg-[#4F46E5] text-white font-black rounded-xl lg:rounded-2xl border-b-4 lg:border-b-8 border-[#4338CA] hover:bg-[#6366F1] transition-all uppercase tracking-widest text-xs lg:text-lg cursor-pointer">
            {t("practice.practiceBtn")}
          </button>
        </div>

        {/* 5.8 Verbos (Qal imperfecto) */}
        <div
          onClick={() => router.push(`/lesson/practice?mode=imperfect&random=${randomQuery}`)}
          className="bg-white h-full p-6 lg:p-10 rounded-3xl lg:rounded-[2rem] border-2 border-[#E5E5E5] shadow-[0_4px_0_0_#E5E5E5] flex flex-col items-center text-center space-y-3 lg:space-y-6 hover:bg-[#F7F7F7] transition-all cursor-pointer group active:translate-y-1 active:shadow-none"
        >
          <div className="p-4 lg:p-8 bg-[#FFF0E8] text-[#E76228] rounded-2xl lg:rounded-3xl transition-transform group-hover:scale-110">
            <Puzzle size={32} className="lg:w-16 lg:h-16" />
          </div>
          <div>
            <h2 className="text-lg lg:text-3xl font-black text-[#4B4B4B] uppercase tracking-tight">
              {t("practice.modes.verbsImperfect.title")}
            </h2>
            <p className="text-[#777777] font-bold text-xs lg:text-lg mt-1 lg:mt-2 leading-relaxed">
              {t("practice.modes.verbsImperfect.desc")}
            </p>
          </div>
          <button className="w-full mt-auto py-2.5 lg:py-4 bg-[#E76228] text-white font-black rounded-xl lg:rounded-2xl border-b-4 lg:border-b-8 border-[#C34F1F] hover:bg-[#FF7B40] transition-all uppercase tracking-widest text-xs lg:text-lg cursor-pointer">
            {t("practice.practiceBtn")}
          </button>
        </div>

        {/* 5.9 Sufijos Verbales Qal */}
        <div
          onClick={() => router.push(`/lesson/practice?mode=verb-suffixes&random=${randomQuery}`)}
          className="bg-white h-full p-6 lg:p-10 rounded-3xl lg:rounded-[2rem] border-2 border-[#E5E5E5] shadow-[0_4px_0_0_#E5E5E5] flex flex-col items-center text-center space-y-3 lg:space-y-6 hover:bg-[#F7F7F7] transition-all cursor-pointer group active:translate-y-1 active:shadow-none"
        >
          <div className="p-4 lg:p-8 bg-[#F0EDFF] text-[#7158E2] rounded-2xl lg:rounded-3xl transition-transform group-hover:scale-110">
            <Puzzle size={32} className="lg:w-16 lg:h-16" />
          </div>
          <div>
            <h2 className="text-lg lg:text-3xl font-black text-[#4B4B4B] uppercase tracking-tight">
              {t("practice.modes.verbsSuffixes.title")}
            </h2>
            <p className="text-[#777777] font-bold text-xs lg:text-lg mt-1 lg:mt-2 leading-relaxed">
              {t("practice.modes.verbsSuffixes.desc")}
            </p>
          </div>
          <button className="w-full mt-auto py-2.5 lg:py-4 bg-[#7158E2] text-white font-black rounded-xl lg:rounded-2xl border-b-4 lg:border-b-8 border-[#5A45B8] hover:bg-[#8670EB] transition-all uppercase tracking-widest text-xs lg:text-lg cursor-pointer">
            {t("practice.practiceBtn")}
          </button>
        </div>

        {/* 6. Flashcards */}
        <div
          onClick={() => router.push("/practice/flashcards")}
          className="bg-white p-6 lg:p-10 rounded-3xl lg:rounded-[2rem] border-2 border-[#E5E5E5] shadow-[0_4px_0_0_#E5E5E5] flex flex-col items-center text-center space-y-3 lg:space-y-6 hover:bg-[#F7F7F7] transition-all cursor-pointer group active:translate-y-1 active:shadow-none"
        >
          <div className="p-4 lg:p-8 bg-[#E5FFFA] text-[#00CD9E] rounded-2xl lg:rounded-3xl transition-transform group-hover:scale-110">
            <Zap size={32} className="lg:w-16 lg:h-16" />
          </div>
          <div>
            <h2 className="text-lg lg:text-3xl font-black text-[#4B4B4B] uppercase tracking-tight">
              {t("practice.modes.flashcards.title")}
            </h2>
            <p className="text-[#777777] font-bold text-xs lg:text-lg mt-1 lg:mt-2 leading-relaxed">
              {t("practice.modes.flashcards.desc")}
            </p>
          </div>
          <button className="w-full py-2.5 lg:py-4 bg-[#00CD9E] text-white font-black rounded-xl lg:rounded-2xl border-b-4 lg:border-b-8 border-[#00A37E] hover:bg-[#00EBAB] transition-all uppercase tracking-widest text-xs lg:text-lg cursor-pointer">
            {t("practice.review")}
          </button>
        </div>

        {/* 7. Anclas */}
        <div
          onClick={() => router.push("/anchor-texts")}
          className="bg-white p-6 lg:p-10 rounded-3xl lg:rounded-[2rem] border-2 border-[#E5E5E5] shadow-[0_4px_0_0_#E5E5E5] flex flex-col items-center text-center space-y-3 lg:space-y-6 hover:bg-[#F7F7F7] transition-all cursor-pointer group active:translate-y-1 active:shadow-none"
        >
          <div className="p-4 lg:p-8 bg-[#FFE5E5] text-[#FF4B4B] rounded-2xl lg:rounded-3xl transition-transform group-hover:scale-110">
            <Heart size={32} className="lg:w-16 lg:h-16" />
          </div>
          <div>
            <h2 className="text-lg lg:text-3xl font-black text-[#4B4B4B] uppercase tracking-tight">
              {t("practice.modes.anchors.title")}
            </h2>
            <p className="text-[#777777] font-bold text-xs lg:text-lg mt-1 lg:mt-2 leading-relaxed">
              {t("practice.modes.anchors.desc")}
            </p>
          </div>
          <button className="w-full py-2.5 lg:py-4 bg-[#FF4B4B] text-white font-black rounded-xl lg:rounded-2xl border-b-4 lg:border-b-8 border-[#CC3C3C] hover:bg-[#FF5C5C] transition-all uppercase tracking-widest text-xs lg:text-lg cursor-pointer">
            {t("practice.explore")}
          </button>
        </div>

        {/* 8. Diccionario */}
        <div
          onClick={() => router.push("/practice/dictionary")}
          className="bg-white p-6 lg:p-10 rounded-3xl lg:rounded-[2rem] border-2 border-[#E5E5E5] shadow-[0_4px_0_0_#E5E5E5] flex flex-col items-center text-center space-y-3 lg:space-y-6 hover:bg-[#F7F7F7] transition-all cursor-pointer group active:translate-y-1 active:shadow-none"
        >
          <div className="p-4 lg:p-8 bg-[#F3E8FF] text-[#A855F7] rounded-2xl lg:rounded-3xl transition-transform group-hover:scale-110">
            <BookOpen size={32} className="lg:w-16 lg:h-16" />
          </div>
          <div>
            <h2 className="text-lg lg:text-3xl font-black text-[#4B4B4B] uppercase tracking-tight">
              {t("practice.modes.dictionary.title")}
            </h2>
            <p className="text-[#777777] font-bold text-xs lg:text-lg mt-1 lg:mt-2 leading-relaxed">
              {t("practice.modes.dictionary.desc")}
            </p>
          </div>
          <button className="w-full py-2.5 lg:py-4 bg-[#A855F7] text-white font-black rounded-xl lg:rounded-2xl border-b-4 lg:border-b-8 border-[#9333EA] hover:bg-[#B469FF] transition-all uppercase tracking-widest text-xs lg:text-lg cursor-pointer">
            {t("practice.explore")}
          </button>
        </div>

        {/* 9. Repaso Rápido */}
        <div
          onClick={() => router.push(`/lesson/practice?mode=quick&random=${randomQuery}`)}
          className="bg-white p-6 lg:p-10 rounded-3xl lg:rounded-[2rem] border-2 border-[#E5E5E5] shadow-[0_4px_0_0_#E5E5E5] flex flex-col items-center text-center space-y-3 lg:space-y-6 hover:bg-[#F7F7F7] transition-all cursor-pointer group active:translate-y-1 active:shadow-none"
        >
          <div className="p-4 lg:p-8 bg-[#DDF4FF] text-[#1CB0F6] rounded-2xl lg:rounded-3xl transition-transform group-hover:scale-110">
            <Clock size={32} className="lg:w-16 lg:h-16" />
          </div>
          <div>
            <h2 className="text-lg lg:text-3xl font-black text-[#4B4B4B] uppercase tracking-tight">
              {t("practice.modes.quick.title")}
            </h2>
            <p className="text-[#777777] font-bold text-xs lg:text-lg mt-1 lg:mt-2 leading-relaxed">
              {t("practice.modes.quick.desc")}
            </p>
          </div>
          <button className="w-full py-2.5 lg:py-4 bg-[#1CB0F6] text-white font-black rounded-xl lg:rounded-2xl border-b-4 lg:border-b-8 border-[#1899D6] hover:bg-[#20C4FF] transition-all uppercase tracking-widest text-xs lg:text-lg cursor-pointer">
            {t("practice.explore")}
          </button>
        </div>
      </div>

      {showFreqModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-[2rem] p-6 lg:p-8 w-full max-w-4xl max-h-[95vh] overflow-y-auto shadow-2xl relative animate-in zoom-in duration-200">
            <button
              onClick={() => setShowFreqModal(false)}
              className="absolute right-4 top-4 p-2 text-[#AFAFAF] hover:text-[#4B4B4B] transition-colors bg-[#F7F7F7] rounded-full hover:bg-[#E5E5E5] cursor-pointer"
            >
              <X size={20} />
            </button>

            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-[#FFF5E5] text-[#FF9600] rounded-2xl mx-auto flex items-center justify-center mb-4">
                <Flame size={32} />
              </div>
              <h2 className="text-2xl font-black text-[#4B4B4B] uppercase tracking-tight">
                {t("practice.freqModal.title")}
              </h2>
              <p className="text-[#777777] font-bold mt-2">
                {t("practice.freqModal.desc")}
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {[
                { range: "5000-2200", level: 1, desc: t("practice.freqModal.rangeDesc1") },
                { range: "2199-1000", level: 2, desc: t("practice.freqModal.rangeDesc2") },
                { range: "999-730", level: 3, desc: t("practice.freqModal.rangeDesc3") },
                { range: "729-500", level: 4, desc: t("practice.freqModal.rangeDesc4") },
                { range: "499-400", level: 5, desc: t("practice.freqModal.rangeDesc5") },
                { range: "399-310", level: 6, desc: t("practice.freqModal.rangeDesc6") },
                { range: "309-270", level: 7, desc: t("practice.freqModal.rangeDesc7") },
                { range: "269-220", level: 8, desc: t("practice.freqModal.rangeDesc8") },
                { range: "219-200", level: 9, desc: t("practice.freqModal.rangeDesc9") },
              ].map((lvl) => (
                <button
                  key={lvl.level}
                  onClick={() =>
                    router.push(`/lesson/practice?mode=freq&range=${lvl.range}&random=${randomQuery}`)
                  }
                  className="w-full p-4 rounded-2xl border-2 border-b-4 border-[#E5E5E5] hover:border-[#FF9600] hover:bg-[#FFF5E5] group transition-all text-left flex justify-between items-center cursor-pointer active:translate-y-[2px] active:border-b-2"
                >
                  <div>
                    <span className="block font-black text-[#4B4B4B] text-lg group-hover:text-[#FF9600]">
                      {t("practice.freqModal.level")} {lvl.level}
                    </span>
                    <span className="block text-[#777777] font-bold text-sm">
                      {lvl.desc}
                    </span>
                  </div>
                  <div className="text-[#FF9600] font-black">{">"}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
