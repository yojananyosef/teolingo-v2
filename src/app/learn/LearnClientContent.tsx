"use client";

import { AutoScroll } from "@/components/AutoScroll";
import { LessonNode } from "@/components/LessonNode";
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

  const sectionIntros: Record<string, { title: string; summary: string; topics: string[] }> = {
    module1: {
      title: "Introducción: Módulo 1 - Fundamentos",
      summary: "Comenzamos desde cero con una base sólida: alfabeto, vocales y silabificación.",
      topics: [
        "El Alfabeto Hebreo",
        "Las Vocales Hebreas",
        "Silabificación y Pronunciación",
      ],
    },
    module2: {
      title: "Introducción: Módulo 2 - Sustantivos y Partículas",
      summary: "Aprende cómo funcionan los sustantivos y las partículas más comunes.",
      topics: [
        "Sustantivos Hebreos (Género y Número)",
        "El Artículo Definido y la Conjunción Waw",
        "Preposiciones Hebreas",
      ],
    },
    module3: {
      title: "Introducción: Módulo 3 - Calificadores y Pronombres",
      summary: "Descubre cómo describir cosas y referirte a personas.",
      topics: [
        "Adjetivos Hebreos",
        "Pronombres Hebreos",
        "Sufijos Pronominales Hebreos",
      ],
    },
    module4: {
      title: "Introducción: Módulo 4 - Relaciones de Propiedad",
      summary: "Aprende a conectar palabras para mostrar posesión y a contar.",
      topics: [
        "La Cadena Constructa",
        "Números Hebreos",
      ],
    },
  };

  const allMainLessons = lessons.filter((l: any) => l.order < 900 && !isOptionalLesson(l));
  
  const module1Lessons = allMainLessons.filter((l: any) => l.order >= 1 && l.order <= 3);
  const module2Lessons = allMainLessons.filter((l: any) => l.order >= 4 && l.order <= 6);
  const module3Lessons = allMainLessons.filter((l: any) => l.order >= 7 && l.order <= 9);
  const module4Lessons = allMainLessons.filter((l: any) => l.order >= 10 && l.order <= 11);

  // Encontrar la lección actual (la primera no completada en toda la ruta)
  const activeLesson = allMainLessons.find((l: any, index: number) => {
    if (isOptionalLesson(l)) return false;
    const previousRequiredCompleted = isPreviousRequiredCompleted(allMainLessons, index);
    return !l.isCompleted && previousRequiredCompleted;
  });

  const renderUnit = (
    unitLessons: any[],
    unitTitle: string,
    unitSubtitle: string,
    bgColor: string,
    borderColor: string,
    sectionKey: string,
    useSequentialLocking = true,
  ) => {
    const intro = sectionIntros[sectionKey];
    const isIntroOpen = !!openIntros[sectionKey];
    
    // Find the starting index of this unit in the global array
    const startIndex = allMainLessons.findIndex(l => l.id === unitLessons[0]?.id);

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
          <div className="rounded-2xl border-2 border-[#E5E5E5] bg-[#FFFDF5] p-4 lg:p-6 shadow-[0_4px_0_0_#E5E5E5]">
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

        <div className="flex flex-col items-center gap-12 lg:gap-16 relative pt-4 lg:pt-8 w-full max-w-[300px] mx-auto">
          {unitLessons.map((lesson: any, index: number) => {
            const globalIndex = startIndex + index;
            const isOptional = isOptionalLesson(lesson);

            const previousRequiredCompleted = useSequentialLocking
              ? isPreviousRequiredCompleted(allMainLessons, globalIndex)
              : true;

            // Lógica de bloqueo
            const isLocked = useSequentialLocking
              ? !previousRequiredCompleted ||
                (isLowEnergyMode && !lesson.isCompleted && !isOptional)
              : false;

            // Determinar si es checkpoint (última lección de la unidad)
            const isCheckpoint = index === unitLessons.length - 1;

            return (
              <div
                key={lesson.id}
                id={`lesson-${lesson.id}`}
                className="w-full relative"
              >
                <LessonNode
                  lesson={{
                    ...lesson,
                    isCompleted: !!lesson.isCompleted,
                    isPerfect: !!lesson.isPerfect,
                    accuracy: lesson.accuracy,
                    isLocked,
                    isOptional,
                    type: isCheckpoint ? "checkpoint" : "normal",
                  }}
                  index={globalIndex}
                  totalNodes={allMainLessons.length}
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
      <header className="flex items-center justify-between bg-[#FFFDF5] p-4 lg:p-6 sticky top-0 z-20 border-b-2 border-[#E5E5E5] px-4 lg:px-8 shrink-0">
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
                : "border-[#E5E5E5] bg-[#FFFDF5] text-[#AFAFAF]"
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
          {module1Lessons.length > 0 &&
            renderUnit(
              module1Lessons,
              "Módulo 1",
              "Fundamentos",
              "bg-[#58CC02]",
              "#46A302",
              "module1",
            )}
          {module2Lessons.length > 0 &&
            renderUnit(
              module2Lessons,
              "Módulo 2",
              "Sustantivos y Partículas",
              "bg-[#CE82FF]",
              "#A855F7",
              "module2",
            )}
          {module3Lessons.length > 0 &&
            renderUnit(
              module3Lessons,
              "Módulo 3",
              "Calificadores y Pronombres",
              "bg-[#FF9600]",
              "#CC7800",
              "module3",
            )}
          {module4Lessons.length > 0 &&
            renderUnit(
              module4Lessons,
              "Módulo 4",
              "Relaciones de Propiedad",
              "bg-[#1CB0F6]",
              "#1899D6",
              "module4",
            )}
        </div>
      </div>
    </div>
  );
}
