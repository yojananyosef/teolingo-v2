"use client";

import { useTranslation } from "@/lib/i18n/useTranslation";
import { cn } from "@/lib/utils";
import {
  AlertCircle,
  ArrowLeft,
  BookOpen,
  Brain,
  CheckCircle,
  Clock,
  Flame,
  GraduationCap,
  Target,
  Zap,
} from "lucide-react";
import Link from "next/link";

interface Student {
  id: string;
  displayName: string;
  email: string | null;
  points: number;
  level: number;
  streak: number;
}

interface CompletedLesson {
  id: string;
  accuracy: number;
  isPerfect: boolean;
  completedAt: string | null;
  lessonTitle: string;
  moduleIndex: number;
}

interface TopMistake {
  mistakeCount: number;
  lastMistakeAt: string;
  question: string;
  correctAnswer: string;
  type: string;
  lessonTitle: string;
}

interface TeacherStudentDetailsClientContentProps {
  student: Student;
  completedLessons: CompletedLesson[];
  averageAccuracy: number;
  perfectLessons: number;
  cardsLearned: number;
  cardsInReview: number;
  retentionQualityKey: "retentionExcellent" | "retentionGood" | "retentionNeedsReinforcement";
  israeliCount: number;
  topMistakes: TopMistake[];
  freq1Count: number;
  freq2Count: number;
  freq3Count: number;
}

export default function TeacherStudentDetailsClientContent({
  student,
  completedLessons,
  averageAccuracy,
  perfectLessons,
  cardsLearned,
  cardsInReview,
  retentionQualityKey,
  israeliCount,
  topMistakes,
  freq1Count,
  freq2Count,
  freq3Count,
}: TeacherStudentDetailsClientContentProps) {
  const { t } = useTranslation();

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      <div>
        <Link
          href="/teacher"
          className="inline-flex items-center gap-2 text-[#AFAFAF] hover:text-[#4B4B4B] font-black uppercase tracking-widest text-xs transition-colors mb-6"
        >
          <ArrowLeft size={16} /> {t("teacher.backToPanel")}
        </Link>
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-[#DDF4FF] text-[#1CB0F6] rounded-full flex items-center justify-center text-2xl font-black shadow-sm shrink-0">
            {student.displayName ? student.displayName[0].toUpperCase() : "?"}
          </div>
          <div>
            <h1 className="text-3xl font-black text-[#4B4B4B] uppercase tracking-tight">
              {student.displayName}
            </h1>
            <p className="text-[#777777] font-bold">{student.email}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border-2 border-[#E5E5E5] p-4 flex flex-col justify-center shadow-sm">
          <p className="text-[10px] text-[#AFAFAF] font-black uppercase tracking-widest mb-1">
            {t("teacher.level")}
          </p>
          <p className="text-2xl font-black text-[#1CB0F6] flex items-center gap-2">
            <GraduationCap size={24} /> {student.level}
          </p>
        </div>
        <div className="bg-white rounded-2xl border-2 border-[#E5E5E5] p-4 flex flex-col justify-center shadow-sm">
          <p className="text-[10px] text-[#AFAFAF] font-black uppercase tracking-widest mb-1">
            {t("profile.points")}
          </p>
          <p className="text-2xl font-black text-[#FFD900] flex items-center gap-2">
            <Zap size={24} /> {student.points} XP
          </p>
        </div>
        <div className="bg-white rounded-2xl border-2 border-[#E5E5E5] p-4 flex flex-col justify-center shadow-sm">
          <p className="text-[10px] text-[#AFAFAF] font-black uppercase tracking-widest mb-1">
            {t("teacher.currentStreak")}
          </p>
          <p className="text-2xl font-black text-[#FF9600] flex items-center gap-2">
            <Flame size={24} /> {student.streak} {t("profile.streak").split(" ")[0].toLowerCase()}
          </p>
        </div>
        <div className="bg-white rounded-2xl border-2 border-[#E5E5E5] p-4 flex flex-col justify-center shadow-sm">
          <p className="text-[10px] text-[#AFAFAF] font-black uppercase tracking-widest mb-1">
            {t("teacher.perfectLessons")}
          </p>
          <p className="text-2xl font-black text-[#58CC02] flex items-center gap-2">
            <Target size={24} /> {perfectLessons}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Neurocognitive & Learning Stats */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border-2 border-[#E5E5E5] overflow-hidden shadow-sm">
            <div className="p-6 border-b-2 border-[#E5E5E5]">
              <h2 className="text-xl font-black text-[#4B4B4B] uppercase tracking-tight flex items-center gap-2">
                <Brain className="text-[#CE82FF]" size={24} /> {t("teacher.neurocognitiveProfile")}
              </h2>
            </div>
            <div className="p-6 space-y-6">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-black text-[#777777] uppercase">
                    {t("teacher.averageScore")}
                  </span>
                  <span className="text-lg font-black text-[#58CC02]">{averageAccuracy}%</span>
                </div>
                <div className="w-full h-4 bg-[#E5E5E5] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#58CC02] rounded-full"
                    style={{ width: `${averageAccuracy}%` }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t-2 border-[#E5E5E5]">
                <div>
                  <p className="text-[10px] text-[#AFAFAF] font-black uppercase tracking-widest">
                    {t("teacher.srsCardsLearned")}
                  </p>
                  <p className="text-xl font-black text-[#4B4B4B]">{cardsLearned}</p>
                </div>
                <div>
                  <p className="text-[10px] text-[#AFAFAF] font-black uppercase tracking-widest">
                    {t("teacher.srsCardsInReview")}
                  </p>
                  <p className="text-xl font-black text-[#4B4B4B]">{cardsInReview}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-[10px] text-[#AFAFAF] font-black uppercase tracking-widest">
                    {t("teacher.retentionQuality")}
                  </p>
                  <p className="text-lg font-black text-[#1CB0F6]">{t(`teacher.${retentionQualityKey}`)}</p>
                </div>
              </div>

              {/* Dominio por Frecuencia Bíblica */}
              <div className="pt-4 border-t-2 border-[#E5E5E5]">
                <p className="text-[10px] text-[#AFAFAF] font-black uppercase tracking-widest mb-3">
                  {t("teacher.vocabularyMastery")}
                </p>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-xs font-bold text-[#777] mb-1">
                      <span>Freq 1 (Top 100)</span>
                      <span>{freq1Count} {t("sidebar.about").toLowerCase() === "about" ? "words" : "palabras"}</span>
                    </div>
                    <div className="w-full h-2 bg-[#E5E5E5] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#1CB0F6]"
                        style={{ width: `${Math.min((freq1Count / 100) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs font-bold text-[#777] mb-1">
                      <span>Freq 2 (101-200)</span>
                      <span>{freq2Count} {t("sidebar.about").toLowerCase() === "about" ? "words" : "palabras"}</span>
                    </div>
                    <div className="w-full h-2 bg-[#E5E5E5] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#CE82FF]"
                        style={{ width: `${Math.min((freq2Count / 100) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs font-bold text-[#777] mb-1">
                      <span>Freq 3 (201-300)</span>
                      <span>{freq3Count} {t("sidebar.about").toLowerCase() === "about" ? "words" : "palabras"}</span>
                    </div>
                    <div className="w-full h-2 bg-[#E5E5E5] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#FF9600]"
                        style={{ width: `${Math.min((freq3Count / 100) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl border-2 border-[#E5E5E5] overflow-hidden shadow-sm">
            <div className="p-6 border-b-2 border-[#E5E5E5]">
              <h2 className="text-xl font-black text-[#4B4B4B] uppercase tracking-tight flex items-center gap-2">
                <BookOpen className="text-[#FF4B4B]" size={24} /> {t("sidebar.israeli")}
              </h2>
            </div>
            <div className="p-6">
              <p className="text-[#777777] font-bold">
                {t("teacher.israeliUnitsCompleted")}
              </p>
              <p className="text-3xl font-black text-[#4B4B4B] mt-2">{israeliCount}</p>
            </div>
          </div>
        </div>

        {/* Lecciones Completadas Historial */}
        <div className="bg-white rounded-3xl border-2 border-[#E5E5E5] overflow-hidden shadow-sm h-fit">
          <div className="p-6 border-b-2 border-[#E5E5E5]">
            <h2 className="text-xl font-black text-[#4B4B4B] uppercase tracking-tight flex items-center gap-2">
              <CheckCircle className="text-[#58CC02]" size={24} /> {t("teacher.lessonHistory")}
            </h2>
          </div>
          <div className="max-h-[500px] overflow-y-auto p-4 space-y-3">
            {completedLessons.length === 0 ? (
              <p className="text-center text-[#AFAFAF] font-bold py-8">
                {t("teacher.noCompletedLessonsStudent")}
              </p>
            ) : (
              completedLessons.map((lesson) => (
                <div
                  key={lesson.id}
                  className="flex items-center justify-between p-4 rounded-2xl border-2 border-[#E5E5E5] hover:bg-[#F7F7F7] transition-colors gap-4"
                >
                  <div className="min-w-0 flex-1">
                    <span className="text-[10px] text-[#1CB0F6] font-black uppercase tracking-widest bg-[#DDF4FF] px-2 py-0.5 rounded-full mb-2 inline-block">
                      Módulo {lesson.moduleIndex}
                    </span>
                    <h3 className="font-black text-[#4B4B4B] text-sm truncate">{lesson.lessonTitle}</h3>
                    <p className="text-xs text-[#AFAFAF] font-bold flex items-center gap-1 mt-1">
                      <Clock size={12} />
                      {lesson.completedAt
                        ? new Date(lesson.completedAt).toLocaleDateString()
                        : "Completado"}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p
                      className={`text-lg font-black ${
                        lesson.accuracy >= 80 ? "text-[#58CC02]" : "text-[#FF9600]"
                      }`}
                    >
                      {lesson.accuracy}%
                    </p>
                    {lesson.isPerfect && (
                      <span className="text-[10px] text-[#FFD900] font-black uppercase tracking-widest flex items-center justify-end gap-0.5">
                        <Target size={10} /> {t("teacher.perfect")}
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Conceptos a Reforzar */}
      <div className="bg-white rounded-3xl border-2 border-[#E5E5E5] overflow-hidden shadow-sm mt-8">
        <div className="p-6 border-b-2 border-[#E5E5E5] flex items-center gap-2">
          <AlertCircle className="text-[#FF4B4B]" size={24} />
          <h2 className="text-xl font-black text-[#4B4B4B] uppercase tracking-tight">
            {t("teacher.conceptsToReinforce")}
          </h2>
        </div>
        <div className="p-6">
          {topMistakes.length === 0 ? (
            <p className="text-center text-[#AFAFAF] font-bold py-8">
              {t("teacher.noStudentMistakes")}
            </p>
          ) : (
            <div className="space-y-4">
              {topMistakes.map((mistake, index) => (
                <div key={index} className="p-4 rounded-2xl border-2 border-[#FFEBEB] bg-[#FFF5F5]">
                  <div className="flex justify-between items-start mb-2 gap-4">
                    <span className="text-[10px] text-[#FF4B4B] font-black uppercase tracking-widest bg-[#FFEBEB] px-2 py-0.5 rounded-full shrink-0">
                      {t("teacher.failedCount", { count: mistake.mistakeCount })}
                    </span>
                    <span className="text-xs text-[#AFAFAF] font-bold shrink-0">
                      {t("teacher.lastTime")} {new Date(mistake.lastMistakeAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm font-bold text-[#777] mb-1">
                    {t("teacher.lessonCol")}: {mistake.lessonTitle}
                  </p>
                  <p className="text-lg font-black text-[#4B4B4B] mb-2">{mistake.question}</p>
                  <div className="p-2 bg-white rounded-xl border border-[#E5E5E5]">
                    <span className="text-[10px] text-[#58CC02] font-black uppercase tracking-widest block mb-1">
                      {t("teacher.correctAnswer")}
                    </span>
                    <span className="font-bold text-[#4B4B4B]">{mistake.correctAnswer}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
