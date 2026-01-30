"use client";

import { AutoScroll } from "@/components/AutoScroll";
import { LessonCard as LessonCardComponent } from "@/components/LessonCard";
import { LowEnergyBanner } from "@/components/LowEnergyBanner";
import { useUIStore } from "@/store/useUIStore";
import { BookOpen, Flame, Star, Trophy } from "lucide-react";

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
  const { isLowEnergyMode } = useUIStore();

  const unit1 = lessons.filter((l: any) => l.order <= 8);
  const unit2 = lessons.filter((l: any) => l.order > 8 && l.order <= 13);
  const unit3 = lessons.filter((l: any) => l.order > 13);

  // Encontrar la lección actual (la primera no completada)
  const activeLesson = lessons.find((l: any, index: number) => {
    const isPreviousCompleted = index === 0 || lessons[index - 1].isCompleted;
    return !l.isCompleted && isPreviousCompleted;
  });

  const renderUnit = (
    unitLessons: any[],
    unitTitle: string,
    unitSubtitle: string,
    bgColor: string,
    borderColor: string,
    startIndex: number,
  ) => {
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
          </div>
        </div>

        <div className="flex flex-col items-center gap-6 lg:gap-12 relative pt-4 lg:pt-8">
          <div className="absolute top-0 bottom-0 w-1.5 lg:w-2 bg-[#E5E5E5] -z-10 rounded-full" />
          {unitLessons.map((lesson: any, index: number) => {
            const globalIndex = startIndex + index;
            const offset = Math.sin(globalIndex * 1.5);

            const isPreviousCompleted = globalIndex === 0 || lessons[globalIndex - 1].isCompleted;

            // Lógica de bloqueo: Bloqueado si el anterior no está completado,
            // O si está en modo energía y la lección NO está completada.
            const isLocked = !isPreviousCompleted || (isLowEnergyMode && !lesson.isCompleted);

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
        <div>
          <h1 className="text-base lg:text-2xl font-black text-[#4B4B4B] tracking-wide uppercase">
            Mi Progreso
          </h1>
        </div>
        <div className="flex items-center gap-3 lg:gap-8">
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
          {renderUnit(unit1, "Unidad 1", "Fundamentos y Alef-Bet", "bg-[#58CC02]", "#46A302", 0)}
          {unit2.length > 0 &&
            renderUnit(
              unit2,
              "Unidad 2",
              "Vocabulario y Gramática",
              "bg-[#1CB0F6]",
              "#1899D6",
              unit1.length,
            )}
          {unit3.length > 0 &&
            renderUnit(
              unit3,
              "Unidad 3",
              "Gramática Intermedia",
              "bg-[#CE82FF]",
              "#A568CC",
              unit1.length + unit2.length,
            )}
        </div>
      </div>
    </div>
  );
}
