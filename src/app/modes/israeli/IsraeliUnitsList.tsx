"use client";

import { ChevronRight, Lock, Star, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface IsraeliUnitsListProps {
  units: any[];
}

export function IsraeliUnitsList({ units }: IsraeliUnitsListProps) {
  const router = useRouter();

  return (
    <div className="flex flex-col min-h-screen bg-[#F7F7F7]">
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
            const isFirst = index === 0;
            // Para el MVP, permitimos todas las unidades o solo la primera si quisiéramos bloquear
            const isLocked = false;

            return (
              <Link
                key={unit.id}
                href={isLocked ? "#" : `/modes/israeli/${unit.id}`}
                className={`
                  group block bg-white border-2 border-[#E5E5E5] rounded-3xl p-6 transition-all
                  ${isLocked ? "opacity-60 cursor-not-allowed" : "hover:border-[#1CB0F6] hover:shadow-md active:translate-y-1 active:shadow-none"}
                `}
              >
                <div className="flex items-center gap-6">
                  <div
                    className={`
                    w-12 h-12 rounded-2xl flex items-center justify-center font-black text-xl shadow-sm
                    ${isLocked ? "bg-[#E5E5E5] text-[#AFAFAF]" : "bg-[#1CB0F6] text-white"}
                  `}
                  >
                    {index + 1}
                  </div>

                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-black text-lg text-[#4B4B4B] uppercase tracking-tight group-hover:text-[#1CB0F6] transition-colors">
                        {unit.title}
                      </h3>
                      {isLocked && <Lock size={16} className="text-[#AFAFAF]" />}
                    </div>
                    <p className="text-[#777777] text-sm font-medium">{unit.description}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-[10px] font-black uppercase tracking-widest bg-[#F7F7F7] px-2 py-1 rounded-lg text-[#AFAFAF] border border-[#E5E5E5]">
                        {unit.grammarScope}
                      </span>
                      <span className="text-[10px] font-black uppercase tracking-widest bg-[#F7F7F7] px-2 py-1 rounded-lg text-[#AFAFAF] border border-[#E5E5E5]">
                        {unit.maxWords} PALABRAS
                      </span>
                    </div>
                  </div>

                  {!isLocked && (
                    <ChevronRight
                      className="text-[#AFAFAF] group-hover:text-[#1CB0F6] transition-all transform group-hover:translate-x-1"
                      size={24}
                    />
                  )}
                </div>
              </Link>
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
