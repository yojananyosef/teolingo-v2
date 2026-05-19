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
  quizzes?: any[];
}

const MODULE_COLORS = [
  { bg: "bg-[#58CC02]", border: "#46A302" }, // 1 Verde
  { bg: "bg-[#CE82FF]", border: "#A855F7" }, // 2 Morado
  { bg: "bg-[#FF9600]", border: "#CC7800" }, // 3 Naranja
  { bg: "bg-[#1CB0F6]", border: "#1899D6" }, // 4 Celeste
  { bg: "bg-[#FF4B4B]", border: "#CC3C3C" }, // 5 Rojo
  { bg: "bg-[#FFC800]", border: "#E5A500" }, // 6 Amarillo
  { bg: "bg-[#2B70C9]", border: "#1F5193" }, // 7 Azul
  { bg: "bg-[#FF73A3]", border: "#D84B7D" }, // 8 Rosa
  { bg: "bg-[#00C2A8]", border: "#009B86" }, // 9 Turquesa
  { bg: "bg-[#8A2BE2]", border: "#6A1CB0" }, // 10 Violeta
];

const MODULE_METADATA: Record<
  number,
  { title: string; subtitle: string; summary: string; topics: string[] }
> = {
  1: {
    title: "Módulo 1",
    subtitle: "Fundamentos",
    summary: "Comenzamos desde cero con una base sólida: alfabeto, vocales y silabificación.",
    topics: ["El Alfabeto Hebreo", "Las Vocales Hebreas", "Silabificación y Pronunciación"],
  },
  2: {
    title: "Módulo 2",
    subtitle: "Sustantivos y Partículas",
    summary: "Aprende cómo funcionan los sustantivos y las partículas más comunes.",
    topics: [
      "Sustantivos Hebreos",
      "El Artículo Definido y la Conjunción Waw",
      "Preposiciones Hebreas",
    ],
  },
  3: {
    title: "Módulo 3",
    subtitle: "Calificadores y Pronombres",
    summary: "Descubre cómo describir cosas y referirte a personas.",
    topics: ["Adjetivos Hebreos", "Pronombres Hebreos", "Sufijos Pronominales Hebreos"],
  },
  4: {
    title: "Módulo 4",
    subtitle: "Relaciones de Propiedad",
    summary: "Aprende a conectar palabras para mostrar posesión y a contar.",
    topics: ["La Cadena Constructa", "Números Hebreos"],
  },
  5: {
    title: "Módulo 5",
    subtitle: "Introducción al Sistema Verbal",
    summary: "El motor del idioma hebreo: El Perfecto, Imperfecto y Volitivos en el tronco Qal.",
    topics: ["El Perfecto Qal", "El Imperfecto Qal", "Imperativo, Cohortativo y Jusivo"],
  },
  6: {
    title: "Módulo 6",
    subtitle: "Infinitivos y Participios",
    summary: "Formas verbales que actúan como sustantivos y adjetivos.",
    topics: ["El Infinitivo Constructo Qal", "El Infinitivo Absoluto Qal", "El Participio Qal"],
  },
  7: {
    title: "Módulo 7",
    subtitle: "Modificadores Verbales",
    summary: "Verbos con características especiales y sufijos.",
    topics: [
      "Sufijos Pronominales en Verbos",
      "Verbos Débiles (I-Gutural, I-Alef)",
      "Verbos Débiles (Guturales Múltiples)",
    ],
  },
  8: {
    title: "Módulo 8",
    subtitle: "Troncos Derivados (Pasiva e Intensiva)",
    summary: "Descubre cómo la acción cambia de significado o intensidad.",
    topics: ["Nifal (Pasivo/Reflexivo)", "Piel (Intensivo Activo)", "Pual (Intensivo Pasivo)"],
  },
  9: {
    title: "Módulo 9",
    subtitle: "Troncos Derivados (Causativos)",
    summary: "Expresa que alguien causó que algo sucediera.",
    topics: [
      "Hifil (Causativo Activo)",
      "Hofal (Causativo Pasivo)",
      "Hitpael (Reflexivo Intensivo)",
    ],
  },
  10: {
    title: "Módulo 10",
    subtitle: "Sintaxis Avanzada y Lectura",
    summary: "Conecta todas las piezas para leer textos bíblicos complejos.",
    topics: [
      "Clausulas Condicionales",
      "Acentos Disyuntivos y Conjuntivos",
      "Práctica de Lectura (Rut/Jonás)",
    ],
  },
};

export function LearnClientContent({ lessons, user, quizzes = [] }: LearnClientContentProps) {
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

  const allMainLessons = lessons.filter((l: any) => l.order < 900 && !isOptionalLesson(l));

  // Group dynamically
  const modulesMap = new Map<number, any[]>();
  allMainLessons.forEach((l: any) => {
    const mIndex = l.moduleIndex || 1;
    if (!modulesMap.has(mIndex)) modulesMap.set(mIndex, []);
    modulesMap.get(mIndex)!.push(l);
  });
  const moduleIndices = Array.from(modulesMap.keys()).sort((a, b) => a - b);

  // Encontrar la lección actual
  const activeLesson = allMainLessons.find((l: any, index: number) => {
    if (isOptionalLesson(l)) return false;
    const previousRequiredCompleted = isPreviousRequiredCompleted(allMainLessons, index);
    return !l.isCompleted && previousRequiredCompleted;
  });

  const renderUnit = (moduleIndex: number, unitLessons: any[]) => {
    const meta = MODULE_METADATA[moduleIndex] || {
      title: `Módulo ${moduleIndex}`,
      subtitle: "Lecciones Avanzadas",
      summary: "Continúa tu aprendizaje bíblico.",
      topics: ["Lecciones avanzadas de gramática hebrea"],
    };

    // Asignar color cíclico
    const colorTheme = MODULE_COLORS[(moduleIndex - 1) % MODULE_COLORS.length];
    const sectionKey = `module${moduleIndex}`;
    const isIntroOpen = !!openIntros[sectionKey];
    const startIndex = allMainLessons.findIndex((l) => l.id === unitLessons[0]?.id);

    return (
      <div key={sectionKey} className="space-y-6 lg:space-y-12">
        <div
          className={`flex items-center gap-3 lg:gap-4 mb-4 lg:mb-8 ${colorTheme.bg} text-white p-4 lg:p-6 rounded-2xl shadow-[0_4px_0_0_${colorTheme.border}] relative z-10`}
        >
          <div className="p-1.5 lg:p-3 bg-white/20 rounded-xl">
            <BookOpen size={20} className="text-white lg:w-7 lg:h-7" />
          </div>
          <div>
            <h2 className="text-[10px] lg:text-xl font-black uppercase tracking-widest opacity-80">
              {meta.title}
            </h2>
            <p className="text-sm lg:text-2xl font-black">{meta.subtitle}</p>
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
              Introducción: {meta.title} - {meta.subtitle}
            </h3>
            <p className="mt-2 text-sm font-bold text-[#666666]">{meta.summary}</p>
            <ul className="mt-3 space-y-1 text-xs lg:text-sm font-bold text-[#555555]">
              {meta.topics.map((topic) => (
                <li key={topic}>• {topic}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="flex flex-col items-center gap-12 lg:gap-16 relative pt-4 lg:pt-8 w-full max-w-[300px] mx-auto">
          {unitLessons.map((lesson: any, index: number) => {
            const globalIndex = startIndex + index;
            const isOptional = isOptionalLesson(lesson);
            const previousRequiredCompleted = isPreviousRequiredCompleted(
              allMainLessons,
              globalIndex,
            );

            const isLocked =
              !previousRequiredCompleted || (isLowEnergyMode && !lesson.isCompleted && !isOptional);
            const isCheckpoint = index === unitLessons.length - 1;

            return (
              <div key={lesson.id} id={`lesson-${lesson.id}`} className="w-full relative">
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
                  isLastInModule={index === unitLessons.length - 1}
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
            <Shuffle
              size={16}
              className={isRandomExerciseOrder ? "text-[#1CB0F6]" : "text-[#AFAFAF]"}
            />
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

          {/* Banner de Quizzes Pendientes */}
          {quizzes && quizzes.length > 0 && (
             <div className="space-y-4">
               {quizzes.map(quiz => (
                 <div key={quiz.id} className={`p-6 rounded-3xl border-2 ${quiz.isCompleted ? 'border-[#E5E5E5] bg-white' : 'border-[#1CB0F6] bg-[#DDF4FF]'} relative overflow-hidden shadow-sm`}>
                   {quiz.isCompleted && (
                     <div className="absolute top-4 right-4 bg-[#58CC02] text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full">
                       Completado: {quiz.score}%
                     </div>
                   )}
                   <h3 className={`text-xl font-black ${quiz.isCompleted ? 'text-[#AFAFAF]' : 'text-[#1CB0F6]'} mb-2`}>{quiz.title}</h3>
                   {quiz.description && <p className="text-[#777777] font-bold mb-4">{quiz.description}</p>}
                   <a
                     href={`/lesson/quiz-${quiz.id}`}
                     className={`inline-block px-6 py-3 rounded-xl text-white font-black uppercase tracking-widest text-sm border-b-4 active:border-b-0 active:translate-y-1 transition-all ${
                       quiz.isCompleted 
                         ? 'bg-[#E5E5E5] border-[#AFAFAF] hover:bg-[#D4D4D4] text-[#777]'
                         : 'bg-[#1CB0F6] border-[#1899D6] hover:bg-[#1899D6]'
                     }`}
                   >
                     {quiz.isCompleted ? "Repasar Quiz" : "Tomar Quiz"}
                   </a>
                 </div>
               ))}
             </div>
          )}

          {moduleIndices.map((mIndex) => renderUnit(mIndex, modulesMap.get(mIndex)!))}
        </div>
      </div>
    </div>
  );
}
