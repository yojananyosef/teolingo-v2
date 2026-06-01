"use client";

import { useTranslation } from "@/lib/i18n/useTranslation";
import {
  AlertCircle,
  ArrowRight,
  Award,
  ClipboardCheck,
  Flame,
  Sparkles,
  Star,
  Trophy,
} from "lucide-react";
import Link from "next/link";

interface Quiz {
  id: string;
  title: string;
  description: string | null;
  isActive: boolean;
  timeLimitSeconds: number;
  allowedAttempts: number;
  attemptsCount: number;
  createdAt: Date;
  isCompleted: boolean;
  score: number | null;
}

interface QuizzesClientContentProps {
  user: {
    displayName: string;
    streak: number;
    points: number;
    level: number;
  };
  quizzes: Quiz[];
}

export function QuizzesClientContent({ user, quizzes }: QuizzesClientContentProps) {
  const pendingQuizzes = quizzes.filter((q) => !q.isCompleted);
  const completedQuizzes = quizzes.filter((q) => q.isCompleted);
  const { t } = useTranslation();

  return (
    <div className="flex flex-col min-h-full bg-[#FDFBF7]">
      {/* Header */}
      <header className="flex items-center justify-between bg-[#FFFDF5] p-4 lg:p-6 sticky top-0 z-20 border-b-2 border-[#E5E5E5] px-4 lg:px-8 shrink-0">
        <div className="flex items-center gap-3 lg:gap-4">
          <div className="p-2 bg-[#DDF4FF] rounded-xl text-[#1CB0F6]">
            <ClipboardCheck size={24} className="lg:w-7 lg:h-7" />
          </div>
          <h1 className="text-base lg:text-2xl font-black text-[#4B4B4B] tracking-wide uppercase">
            {t("quizzes.title")}
          </h1>
        </div>
        <div className="flex items-center gap-3 lg:gap-8">
          <div className="flex items-center gap-1 lg:gap-2 group cursor-help" title="Racha actual">
            <Flame size={18} className="text-[#FF9600] fill-[#FF9600] lg:w-6 lg:h-6" />
            <span className="font-black text-[#FF9600] text-sm lg:text-xl">{user.streak}</span>
          </div>
          <div
            className="flex items-center gap-1 lg:gap-2 group cursor-help"
            title="Puntos totales"
          >
            <Star size={18} className="text-[#1CB0F6] fill-[#1CB0F6] lg:w-6 lg:h-6" />
            <span className="font-black text-[#1CB0F6] text-sm lg:text-xl">{user.points}</span>
          </div>
          <div
            className="flex items-center gap-1 lg:gap-2 group cursor-help"
            title="Nivel alcanzado"
          >
            <Trophy size={18} className="text-[#FFC800] fill-[#FFC800] lg:w-6 lg:h-6" />
            <span className="font-black text-[#FFC800] text-sm lg:text-xl">{user.level}</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="px-4 lg:px-8 py-6 lg:py-10 flex-1">
        <div className="max-w-3xl mx-auto space-y-12 pb-24">
          {/* Welcome Banner */}
          <div className="bg-gradient-to-r from-[#1CB0F6] to-[#00C2A8] text-white p-6 lg:p-8 rounded-3xl shadow-md relative overflow-hidden group">
            <div className="absolute right-0 bottom-0 opacity-10 transform translate-x-4 translate-y-4 group-hover:scale-110 transition-transform duration-500">
              <ClipboardCheck size={200} />
            </div>
            <div className="relative z-10 space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 rounded-full text-xs font-black uppercase tracking-wider">
                <Sparkles size={12} />
                {t("quizzes.bannerTag")}
              </div>
              <h2 className="text-xl lg:text-3xl font-black">{t("quizzes.bannerTitle")}</h2>
              <p className="text-white/90 text-sm lg:text-base font-bold max-w-xl">
                {t("quizzes.bannerDesc")}
              </p>
            </div>
          </div>

          {/* Pending Quizzes */}
          <section className="space-y-6">
            <div className="flex items-center gap-2 border-b-2 border-[#E5E5E5] pb-2">
              <h3 className="text-sm lg:text-lg font-black text-[#777777] uppercase tracking-wider">
                {t("quizzes.pendingTitle")}
              </h3>
              <span className="bg-[#1CB0F6] text-white text-xs font-black px-2 py-0.5 rounded-full">
                {pendingQuizzes.length}
              </span>
            </div>

            {pendingQuizzes.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-10 bg-white border-2 border-dashed border-[#E5E5E5] rounded-3xl text-center space-y-4">
                <div className="w-16 h-16 bg-[#FFFDF5] border-2 border-[#FFC800] rounded-full flex items-center justify-center text-[#FFC800]">
                  <Award size={32} />
                </div>
                <div className="space-y-1">
                  <h4 className="font-black text-[#4B4B4B] text-lg">
                    {t("quizzes.pendingEmpty").replace("{name}", user.displayName)}
                  </h4>
                  <p className="text-[#777777] font-bold text-sm">
                    {t("quizzes.pendingEmptyDesc")}
                  </p>
                </div>
              </div>
            ) : (
              <div className="grid gap-4">
                {pendingQuizzes.map((quiz) => {
                  const attemptsExhausted = quiz.attemptsCount >= quiz.allowedAttempts;
                  const timeLimitMin = Math.round((quiz.timeLimitSeconds ?? 300) / 60);

                  return (
                    <div
                      key={quiz.id}
                      className="p-6 bg-white border-2 border-[#E5E5E5] hover:border-[#1CB0F6] hover:bg-[#FDFDFF] rounded-3xl transition-all duration-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 group relative overflow-hidden"
                    >
                      <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#1CB0F6]" />
                      <div className="space-y-2 pl-2">
                        <h4 className="text-lg lg:text-xl font-black text-[#4B4B4B] group-hover:text-[#1CB0F6] transition-colors">
                          {quiz.title}
                        </h4>
                        {quiz.description && (
                          <p className="text-[#777777] font-bold text-sm lg:text-base leading-snug">
                            {quiz.description}
                          </p>
                        )}
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 pt-1">
                          <div className="inline-flex items-center gap-1 text-[11px] font-black text-[#AFAFAF] uppercase tracking-wider">
                            <AlertCircle size={12} />
                            {t("quizzes.timeLimitNote").replace("{min}", timeLimitMin.toString())}
                          </div>
                          <div className="inline-flex items-center gap-1 text-[11px] font-black text-[#FF9600] uppercase tracking-wider">
                            <Flame size={12} />
                            {t("quizzes.attemptsCountLabel")
                              ? t("quizzes.attemptsCountLabel")
                                  .replace("{count}", quiz.attemptsCount.toString())
                                  .replace("{limit}", quiz.allowedAttempts.toString())
                              : `Intento ${quiz.attemptsCount} de ${quiz.allowedAttempts}`}
                          </div>
                        </div>
                      </div>
                      {attemptsExhausted ? (
                        <button
                          disabled
                          className="shrink-0 flex items-center justify-center gap-2 px-6 py-3.5 bg-[#E5E5E5] text-[#AFAFAF] font-black uppercase tracking-widest text-xs lg:text-sm rounded-2xl border-b-4 border-[#D4D4D4] cursor-not-allowed"
                        >
                          {t("quizzes.attemptsExhausted") || "Intentos Agotados"}
                          <ArrowRight size={16} />
                        </button>
                      ) : (
                        <Link
                          href={`/lesson/quiz-${quiz.id}`}
                          className="shrink-0 flex items-center justify-center gap-2 px-6 py-3.5 bg-[#1CB0F6] hover:bg-[#1899D6] text-white font-black uppercase tracking-widest text-xs lg:text-sm rounded-2xl border-b-4 border-[#1899D6] active:border-b-0 active:translate-y-1 transition-all cursor-pointer"
                        >
                          {t("quizzes.takeBtn")}
                          <ArrowRight size={16} />
                        </Link>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          {/* Completed Quizzes */}
          <section className="space-y-6">
            <div className="flex items-center gap-2 border-b-2 border-[#E5E5E5] pb-2">
              <h3 className="text-sm lg:text-lg font-black text-[#777777] uppercase tracking-wider">
                {t("quizzes.completedTitle")}
              </h3>
              <span className="bg-[#AFAFAF] text-white text-xs font-black px-2 py-0.5 rounded-full">
                {completedQuizzes.length}
              </span>
            </div>

            {completedQuizzes.length === 0 ? (
              <div className="text-center py-8 text-[#AFAFAF] font-bold text-sm">
                {t("quizzes.completedEmpty")}
              </div>
            ) : (
              <div className="grid gap-4">
                {completedQuizzes.map((quiz) => {
                  const score = quiz.score || 0;
                  const isPassed = score >= 50;
                  const attemptsExhausted = quiz.attemptsCount >= quiz.allowedAttempts;

                  return (
                    <div
                      key={quiz.id}
                      className="p-6 bg-[#F7F7F7] border-2 border-[#E5E5E5] rounded-3xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden"
                    >
                      <div className="space-y-1">
                        <h4 className="text-base lg:text-lg font-black text-[#777777] line-through decoration-1">
                          {quiz.title}
                        </h4>
                        {quiz.description && (
                          <p className="text-[#AFAFAF] font-bold text-xs lg:text-sm">
                            {quiz.description}
                          </p>
                        )}
                        <div className="pt-1 flex flex-wrap items-center gap-2">
                          <span
                            className={`inline-block text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full border ${
                              isPassed
                                ? "bg-[#E8F8E8] text-[#58CC02] border-[#58CC02]/20"
                                : "bg-[#FDF1F1] text-[#FF4B4B] border-[#FF4B4B]/20"
                            }`}
                          >
                            {isPassed ? t("quizzes.passed") : t("quizzes.failed")}
                          </span>
                          <span className="inline-block text-[10px] font-black uppercase tracking-widest bg-white border border-[#E5E5E5] text-[#777777] px-2.5 py-0.5 rounded-full">
                            {t("quizzes.score")}: {score}%
                          </span>
                          <span className="inline-flex items-center gap-1 text-[11px] font-black text-[#FF9600] uppercase tracking-wider ml-1">
                            <Flame size={12} />
                            {t("quizzes.attemptsCountLabel")
                              ? t("quizzes.attemptsCountLabel")
                                  .replace("{count}", quiz.attemptsCount.toString())
                                  .replace("{limit}", quiz.allowedAttempts.toString())
                              : `Intento ${quiz.attemptsCount} de ${quiz.allowedAttempts}`}
                          </span>
                        </div>
                      </div>
                      {attemptsExhausted ? (
                        <button
                          disabled
                          className="shrink-0 flex items-center justify-center px-5 py-3 bg-[#E5E5E5] text-[#AFAFAF] font-black uppercase tracking-widest text-xs rounded-xl border border-[#D4D4D4] cursor-not-allowed"
                        >
                          {t("quizzes.attemptsExhausted") || "Intentos Agotados"}
                        </button>
                      ) : (
                        <Link
                          href={`/lesson/quiz-${quiz.id}`}
                          className="shrink-0 flex items-center justify-center px-5 py-3 bg-white hover:bg-[#F7F7F7] border-2 border-[#E5E5E5] hover:border-[#D4D4D4] text-[#777777] font-black uppercase tracking-widest text-xs rounded-xl active:translate-y-0.5 transition-all cursor-pointer"
                        >
                          {t("quizzes.reviewBtn")}
                        </Link>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
