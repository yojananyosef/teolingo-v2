"use client";

import { useUIStore } from "@/store/useUIStore";
import { BatteryLow, Heart, Music } from "lucide-react";
import Link from "next/link";

export function LowEnergyBanner() {
  const { isLowEnergyMode } = useUIStore();

  if (!isLowEnergyMode) return null;

  return (
    <div className="mb-8 animate-in slide-in-from-top-4 duration-500">
      <div className="bg-[#FFF9E5] border-2 border-[#FFC800] rounded-3xl p-6 lg:p-8 relative overflow-hidden group">
        <div className="absolute -right-4 -top-4 opacity-10 group-hover:scale-110 transition-transform duration-700">
          <BatteryLow size={120} className="text-[#FFC800]" />
        </div>

        <div className="relative z-10 flex flex-col lg:flex-row items-center gap-6">
          <div className="w-16 h-16 lg:w-20 lg:h-20 bg-white rounded-2xl flex items-center justify-center shadow-sm shrink-0">
            <BatteryLow size={32} className="text-[#FFC800]" />
          </div>

          <div className="flex-1 text-center lg:text-left">
            <h2 className="text-xl lg:text-2xl font-black text-[#4B4B4B] uppercase tracking-tight mb-2">
              Modo Baja Energía Activado
            </h2>
            <p className="text-[#777777] font-bold text-sm lg:text-base leading-relaxed max-w-xl">
              Hoy nos enfocamos en el ritmo y el audio. No hay gramática nueva, solo repaso
              multisensorial para cuidar tu energía cognitiva.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <Link
              href="/immerse"
              className="flex items-center justify-center gap-x-2 px-6 py-3 bg-[#FFC800] text-white rounded-2xl font-black uppercase tracking-widest text-sm border-b-4 border-[#E5B200] hover:bg-[#FFD133] active:translate-y-1 active:border-b-0 transition-all"
            >
              <Music size={18} />
              <span>Inmersión</span>
            </Link>
            <Link
              href="/anchor-texts"
              className="flex items-center justify-center gap-x-2 px-6 py-3 bg-white text-[#FFC800] rounded-2xl font-black uppercase tracking-widest text-sm border-2 border-[#FFC800] border-b-4 hover:bg-[#FFFDF5] active:translate-y-1 active:border-b-0 transition-all"
            >
              <Heart size={18} />
              <span>Anclas</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
