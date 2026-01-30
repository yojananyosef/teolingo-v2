"use client";

import { ArrowDown, Check, ChevronRight, Lock, Star, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";

interface IsraeliUnitsListProps {
  units: any[];
}

export function IsraeliUnitsList({ units }: IsraeliUnitsListProps) {
  const router = useRouter();

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b-2 border-[#E5E5E5] p-4 lg:p-6 flex items-center gap-4 sticky top-0 z-10">
        <button
          onClick={() => router.push("/learn")}
          className="text-[#AFAFAF] hover:text-[#4B4B4B] transition-colors"
        >
          <X size={24} />
        </button>
        <div className="flex items-center gap-3">
          <div className="bg-[#FFD700] p-2 rounded-xl shadow-sm">
            <Star size={24} className="text-white fill-white" />
          </div>
          <h1 className="text-xl lg:text-2xl font-black text-[#4B4B4B] uppercase tracking-tight">
            Modo Israelí: Roadmap
          </h1>
        </div>
      </header>

      <main className="flex-1 max-w-2xl mx-auto w-full p-6 lg:p-12 space-y-8">
        <div className="bg-white border-2 border-[#E5E5E5] p-6 rounded-3xl shadow-sm space-y-2">
          <h2 className="text-[#4B4B4B] font-black text-xl uppercase tracking-tight">
            Inmersión Léxica Cerrada
          </h2>
          <p className="text-[#777777] font-medium leading-relaxed">
            Domina el hebreo con un enfoque en vocabulario controlado, repetición multisensorial y
            comprensión real sin estrés ortográfico.
          </p>
        </div>

        <div className="space-y-4">
          {units.map((unit, index) => {
            // Para el MVP, permitimos todas las unidades o solo la primera si quisiéramos bloquear
            const isLocked = false;

            return (
              <React.Fragment key={unit.id}>
                <Link
                  href={isLocked ? "#" : `/modes/israeli/${unit.id}`}
                  className={`
                    group block bg-white border-2 border-[#E5E5E5] rounded-3xl p-6 transition-all
                    ${isLocked ? "opacity-60 cursor-not-allowed" : unit.isCompleted ? "hover:border-[#58CC02] hover:shadow-md active:translate-y-1 active:shadow-none" : "hover:border-[#1CB0F6] hover:shadow-md active:translate-y-1 active:shadow-none"}
                  `}
                >
                  <div className="flex items-center gap-6">
                    <div
                      className={`
                      w-12 h-12 rounded-2xl flex items-center justify-center font-black text-xl shadow-sm relative
                      ${isLocked ? "bg-[#E5E5E5] text-[#AFAFAF]" : unit.isCompleted ? "bg-[#58CC02] text-white" : "bg-[#1CB0F6] text-white"}
                    `}
                    >
                      {unit.isCompleted ? <Check size={28} strokeWidth={4} /> : index + 1}
                    </div>

                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <h3
                          className={`
                          font-black text-lg uppercase tracking-tight transition-colors
                          ${unit.isCompleted ? "text-[#58CC02]" : "text-[#4B4B4B] group-hover:text-[#1CB0F6]"}
                        `}
                        >
                          {unit.title}
                        </h3>
                        {isLocked && <Lock size={16} className="text-[#AFAFAF]" />}
                        {unit.isCompleted && (
                          <span className="text-[10px] font-black text-[#58CC02] bg-[#E5F7E5] px-2 py-0.5 rounded-full uppercase tracking-wider">
                            Completado
                          </span>
                        )}
                      </div>
                      <p className="text-[#777777] text-sm font-medium">{unit.description}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-[10px] font-black uppercase tracking-widest bg-white px-2 py-1 rounded-lg text-[#AFAFAF] border border-[#E5E5E5]">
                          {unit.grammarScope}
                        </span>
                        <span className="text-[10px] font-black uppercase tracking-widest bg-white px-2 py-1 rounded-lg text-[#AFAFAF] border border-[#E5E5E5]">
                          {unit.maxWords} PALABRAS
                        </span>
                      </div>
                    </div>

                    {!isLocked && (
                      <ChevronRight
                        className={`
                        text-[#AFAFAF] transition-all transform group-hover:translate-x-1
                        ${unit.isCompleted ? "group-hover:text-[#58CC02]" : "group-hover:text-[#1CB0F6]"}
                      `}
                        size={24}
                      />
                    )}
                  </div>
                </Link>
                {index < units.length - 1 && (
                  <div className="flex justify-center py-2">
                    <div className="bg-[#E5E5E5] p-2 rounded-full">
                      <ArrowDown size={20} className="text-[#AFAFAF]" />
                    </div>
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>

        <div className="text-center pt-8">
          <p className="text-[#AFAFAF] font-bold text-sm uppercase tracking-widest">
            Nuevas unidades próximamente
          </p>
        </div>
      </main>
    </div>
  );
}
