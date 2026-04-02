"use client";

import { AutoScroll } from "@/components/AutoScroll";
import { LessonCard as LessonCardComponent } from "@/components/LessonCard";
import { LowEnergyBanner } from "@/components/LowEnergyBanner";
import { useUIStore } from "@/store/useUIStore";
import { BookOpen, Flame, Shuffle, Star, Trophy } from "lucide-react";
import { useState } from "react";

interface LearnClientContentProps {
  lessons: any[];
  user: {
    displayName: string;
    streak: number;
    points: number;
    level: number;
  } | null;
}

export function LearnClientContent({ lessons, user }: LearnClientContentProps) {
  const { isLowEnergyMode, isRandomExerciseOrder, toggleRandomExerciseOrder } = useUIStore();
  const [openIntros, setOpenIntros] = useState<Record<string, boolean>>({});

  const isOptionalLesson = (lesson: any) =>
    typeof lesson?.id === "string" && lesson.id.endsWith("-opt");

  const isPreviousRequiredCompleted = (sourceLessons: any[], index: number) => {
    for (let i = index - 1; i >= 0; i--) {
      if (!isOptionalLesson(sourceLessons[i])) {
        return !!sourceLessons[i].isCompleted;
      }
    }
    return true;
  };

  const sectionIntros: Record<
    "section1" | "frequency",
    { title: string; summary: string; topics: string[] }
  > = {
    section1: {
      title: "Introducción: Section 1 - The Basics of Hebrew Writing",
      summary:
        "Comenzamos desde cero con una base ordenada: alfabeto, vocales y silabificación. Las primeras subsecciones son informativas y no evaluadas.",
      topics: [
        "Subsección informativa: Alfabeto",
        "Subsección informativa: Vocales",
        "Subsección informativa: Silabificación",
        "Lección 1 evaluada: Alef-Bet esencial",
      ],
    },
    frequency: {
      title: "Introducción: Frecuencia Bíblica",
      summary:
        "Práctica complementaria por frecuencia de vocabulario. Esta sección apoya la memoria y la exposición repetida.",
      topics: [
        "Nivel 1: palabras de muy alta frecuencia",
        "Nivel 2: palabras frecuentes intermedias",
      ],
    },
  };

  const section1Lessons = lessons.filter((l: any) => l.order < 900);
  const frequencyLessons = lessons.filter((l: any) => l.order >= 900);

  // Encontrar la lección actual (la primera no completada)
  const activeLesson = section1Lessons.find((l: any, index: number) => {
    if (isOptionalLesson(l)) return false;
    const previousRequiredCompleted = isPreviousRequiredCompleted(section1Lessons, index);
    return !l.isCompleted && previousRequiredCompleted;
  });

  const renderUnit = (
    unitLessons: any[],
    unitTitle: string,
    unitSubtitle: string,
    bgColor: string,
    borderColor: string,
    startIndex: number,
    sectionKey: "section1" | "frequency",
    useSequentialLocking = true,
  ) => {
    const intro = sectionIntros[sectionKey];
    const isIntroOpen = !!openIntros[sectionKey];

    return (
      <div className="space-y-6 lg:space-y-12">
        <div
          className={`flex items-center gap-3 lg:gap-4 mb-4 lg:mb-8 ${bgColor} text-white p-4 lg:p-6 rounded-2xl shadow-[0_4px_0_0_${borderColor}]`}
        >
          <div className="p-1.5 lg:p-3 bg-white/20 rounded-xl">
            <BookOpen size={20} className="text-white lg:w-7 lg:h-7" />
          </div>
          <div>
            <h2 className="text-[10px] lg:text-xl font-black uppercase tracking-widest opacity-80">
              {unitTitle}
            </h2>
            <p className="text-sm lg:text-2xl font-black">{unitSubtitle}</p>
            <button
              type="button"
              onClick={() =>
                setOpenIntros((prev) => ({
                  ...prev,
                  [sectionKey]: !prev[sectionKey],
                }))
              }
              className="mt-2 rounded-lg px-3 py-1 text-xs font-black tracking-wide uppercase bg-white/25 hover:bg-white/35 transition-colors"
            >
              {isIntroOpen ? "Ocultar Introducción" : "Ver Introducción"}
            </button>
          </div>
        </div>

        {isIntroOpen && (
          <div className="rounded-2xl border-2 border-[#E5E5E5] bg-white p-4 lg:p-6 shadow-[0_4px_0_0_#E5E5E5]">
            <h3 className="text-sm lg:text-lg font-black text-[#4B4B4B] uppercase tracking-wide">
              {intro.title}
            </h3>
            <p className="mt-2 text-sm font-bold text-[#666666]">{intro.summary}</p>
            <ul className="mt-3 space-y-1 text-xs lg:text-sm font-bold text-[#555555]">
              {intro.topics.map((topic) => (
                <li key={topic}>• {topic}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="flex flex-col items-center gap-6 lg:gap-12 relative pt-4 lg:pt-8">
          <div className="absolute top-0 bottom-0 w-1.5 lg:w-2 bg-[#E5E5E5] -z-10 rounded-full" />
          {unitLessons.map((lesson: any, index: number) => {
            const globalIndex = startIndex + index;
            const offset = Math.sin(globalIndex * 1.5);

            const isOptional = isOptionalLesson(lesson);

            const previousRequiredCompleted = useSequentialLocking
              ? isPreviousRequiredCompleted(unitLessons, index)
              : true;

            // Lógica de bloqueo: Bloqueado si el anterior no está completado,
            // O si está en modo energía y la lección NO está completada.
            const isLocked = useSequentialLocking
              ? !previousRequiredCompleted ||
                (isLowEnergyMode && !lesson.isCompleted && !isOptional)
              : false;

            return (
              <div
                key={lesson.id}
                id={`lesson-${lesson.id}`}
                style={{
                  transform: `translateX(calc(${offset} * clamp(20px, 8vw, 70px)))`,
                }}
                className="relative transition-transform duration-300"
              >
                <LessonCardComponent
                  lesson={{
                    ...lesson,
                    isCompleted: !!lesson.isCompleted,
                    isPerfect: !!lesson.isPerfect,
                    accuracy: lesson.accuracy,
                    isLocked,
                    isOptional,
                  }}
                  offset={offset * 60}
                />
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col min-h-full">
      {activeLesson && <AutoScroll targetId={`lesson-${activeLesson.id}`} />}
      <header className="flex items-center justify-between bg-white p-4 lg:p-6 sticky top-0 z-20 border-b-2 border-[#E5E5E5] px-4 lg:px-8 shrink-0">
        <div className="flex items-center gap-3 lg:gap-4">
          <h1 className="text-base lg:text-2xl font-black text-[#4B4B4B] tracking-wide uppercase">
            Mi Progreso
          </h1>

          <button
            type="button"
            onClick={toggleRandomExerciseOrder}
            className="hidden md:flex items-center gap-2 px-3 py-2 rounded-xl border-2 border-[#E5E5E5] hover:bg-[#F7F7F7] transition-colors"
            title="Activa/desactiva el orden aleatorio de ejercicios"
          >
            <Shuffle size={16} className={isRandomExerciseOrder ? "text-[#1CB0F6]" : "text-[#AFAFAF]"} />
            <span className="text-[10px] lg:text-xs font-black uppercase tracking-widest text-[#777777]">
              Orden Aleatorio
            </span>
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wide ${
                isRandomExerciseOrder
                  ? "bg-[#DDF4FF] text-[#1CB0F6]"
                  : "bg-[#F1F1F1] text-[#AFAFAF]"
              }`}
            >
              {isRandomExerciseOrder ? "On" : "Off"}
            </span>
          </button>
        </div>
        <div className="flex items-center gap-3 lg:gap-8">
          <button
            type="button"
            onClick={toggleRandomExerciseOrder}
            className={`md:hidden p-2 rounded-xl border-2 transition-colors ${
              isRandomExerciseOrder
                ? "border-[#BDE3FF] bg-[#DDF4FF] text-[#1CB0F6]"
                : "border-[#E5E5E5] bg-white text-[#AFAFAF]"
            }`}
            title="Orden aleatorio de ejercicios"
          >
            <Shuffle size={18} />
          </button>
          <div className="flex items-center gap-1 lg:gap-2 group cursor-help">
            <Flame size={18} className="text-[#FF9600] fill-[#FF9600] lg:w-6 lg:h-6" />
            <span className="font-black text-[#FF9600] text-sm lg:text-xl">
              {user?.streak || 0}
            </span>
          </div>
          <div className="flex items-center gap-1 lg:gap-2 group cursor-help">
            <Star size={18} className="text-[#1CB0F6] fill-[#1CB0F6] lg:w-6 lg:h-6" />
            <span className="font-black text-[#1CB0F6] text-sm lg:text-xl">
              {user?.points || 0}
            </span>
          </div>
          <div className="flex items-center gap-1 lg:gap-2 group cursor-help">
            <Trophy size={18} className="text-[#FFC800] fill-[#FFC800] lg:w-6 lg:h-6" />
            <span className="font-black text-[#FFC800] text-sm lg:text-xl">{user?.level || 1}</span>
          </div>
        </div>
      </header>

      <div className="px-4 lg:px-8 py-4 lg:py-8 flex-1">
        <div className="max-w-2xl mx-auto space-y-12 lg:space-y-24 pb-12 lg:pb-24">
          <LowEnergyBanner />
          {section1Lessons.length > 0 &&
            renderUnit(
              section1Lessons,
              "Unidad 1",
              "Section 1: The Basics of Hebrew Writing",
              "bg-[#58CC02]",
              "#46A302",
              0,
              "section1",
            )}
          {frequencyLessons.length > 0 &&
            renderUnit(
              frequencyLessons,
              "Práctica Complementaria",
              "Frecuencia Bíblica",
              "bg-[#FF9600]",
              "#CC7800",
              section1Lessons.length,
              "frequency",
              false,
            )}
        </div>
      </div>
    </div>
  );
}
