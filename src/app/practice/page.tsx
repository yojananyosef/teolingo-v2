"use client";

import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Dumbbell, Clock, Zap, BookOpen, Music, Heart } from "lucide-react";

export default function PracticePage() {
  const { user } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push("/auth/login");
    }
  }, [user, router]);

  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto py-4 lg:py-12 px-4 lg:px-8 pb-20 lg:pb-12">
      <div className="flex flex-col sm:flex-row items-center gap-3 lg:gap-6 mb-6 lg:mb-12 text-center sm:text-left">
        <div className="p-2 lg:p-4 bg-[#58CC02] text-white rounded-2xl lg:rounded-3xl shadow-[0_4px_0_0_#46A302]">
          <Dumbbell size={24} className="lg:w-10 lg:h-10" />
        </div>
        <div>
          <h1 className="text-xl lg:text-4xl font-black text-[#4B4B4B] uppercase tracking-tight">Práctica Personalizada</h1>
          <p className="text-[#777777] font-bold text-sm lg:text-lg mt-0.5 lg:mt-1">Refuerza tus conocimientos a tu propio ritmo</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-8">
        {/* 1. Repaso Rápido */}
        <div
          onClick={() => router.push("/lesson/practice?mode=quick")}
          className="bg-white p-6 lg:p-10 rounded-3xl lg:rounded-[2rem] border-2 border-[#E5E5E5] shadow-[0_4px_0_0_#E5E5E5] flex flex-col items-center text-center space-y-3 lg:space-y-6 hover:bg-[#F7F7F7] transition-all cursor-pointer group active:translate-y-1 active:shadow-none"
        >
          <div className="p-4 lg:p-8 bg-[#DDF4FF] text-[#1CB0F6] rounded-2xl lg:rounded-3xl transition-transform group-hover:scale-110">
            <Clock size={32} className="lg:w-16 lg:h-16" />
          </div>
          <div>
            <h2 className="text-lg lg:text-3xl font-black text-[#4B4B4B] uppercase tracking-tight">Repaso Rápido</h2>
            <p className="text-[#777777] font-bold text-xs lg:text-lg mt-1 lg:mt-2 leading-relaxed">Practica lo que aprendiste hoy en 5 ejercicios.</p>
          </div>
          <button
            className="w-full py-2.5 lg:py-4 bg-[#1CB0F6] text-white font-black rounded-xl lg:rounded-2xl border-b-4 lg:border-b-8 border-[#1899D6] hover:bg-[#20C4FF] transition-all uppercase tracking-widest text-xs lg:text-lg"
          >
            Explorar
          </button>
        </div>

        {/* 2. Repaso Intenso */}
        <div
          onClick={() => router.push("/lesson/practice?mode=intense")}
          className="bg-white p-6 lg:p-10 rounded-3xl lg:rounded-[2rem] border-2 border-[#E5E5E5] shadow-[0_4px_0_0_#E5E5E5] flex flex-col items-center text-center space-y-3 lg:space-y-6 hover:bg-[#F7F7F7] transition-all cursor-pointer group active:translate-y-1 active:shadow-none"
        >
          <div className="p-4 lg:p-8 bg-[#FFF5E5] text-[#FF9600] rounded-2xl lg:rounded-3xl transition-transform group-hover:scale-110">
            <Zap size={32} className="lg:w-16 lg:h-16" />
          </div>
          <div>
            <h2 className="text-lg lg:text-3xl font-black text-[#4B4B4B] uppercase tracking-tight">Modo Intenso</h2>
            <p className="text-[#777777] font-bold text-xs lg:text-lg mt-1 lg:mt-2 leading-relaxed">Ejercicios de alta dificultad para subir de nivel.</p>
          </div>
          <button
            className="w-full py-2.5 lg:py-4 bg-[#FF9600] text-white font-black rounded-xl lg:rounded-2xl border-b-4 lg:border-b-8 border-[#CC7800] hover:bg-[#FFA31A] transition-all uppercase tracking-widest text-xs lg:text-lg"
          >
            Comenzar
          </button>
        </div>

        {/* 3. Diccionario */}
        <div
          onClick={() => router.push("/practice/dictionary")}
          className="bg-white p-6 lg:p-10 rounded-3xl lg:rounded-[2rem] border-2 border-[#E5E5E5] shadow-[0_4px_0_0_#E5E5E5] flex flex-col items-center text-center space-y-3 lg:space-y-6 hover:bg-[#F7F7F7] transition-all cursor-pointer group active:translate-y-1 active:shadow-none"
        >
          <div className="p-4 lg:p-8 bg-[#F3E8FF] text-[#A855F7] rounded-2xl lg:rounded-3xl transition-transform group-hover:scale-110">
            <BookOpen size={32} className="lg:w-16 lg:h-16" />
          </div>
          <div>
            <h2 className="text-lg lg:text-3xl font-black text-[#4B4B4B] uppercase tracking-tight">Diccionario</h2>
            <p className="text-[#777777] font-bold text-xs lg:text-lg mt-1 lg:mt-2 leading-relaxed">Repasa el vocabulario de tus lecciones.</p>
          </div>
          <button
            className="w-full py-2.5 lg:py-4 bg-[#A855F7] text-white font-black rounded-xl lg:rounded-2xl border-b-4 lg:border-b-8 border-[#9333EA] hover:bg-[#B469FF] transition-all uppercase tracking-widest text-xs lg:text-lg"
          >
            Explorar
          </button>
        </div>

        {/* 4. Inmersivo */}
        <div
          onClick={() => router.push("/immerse")}
          className="bg-white p-6 lg:p-10 rounded-3xl lg:rounded-[2rem] border-2 border-[#E5E5E5] shadow-[0_4px_0_0_#E5E5E5] flex flex-col items-center text-center space-y-3 lg:space-y-6 hover:bg-[#F7F7F7] transition-all cursor-pointer group active:translate-y-1 active:shadow-none"
        >
          <div className="p-4 lg:p-8 bg-[#DDF4FF] text-[#1CB0F6] rounded-2xl lg:rounded-3xl transition-transform group-hover:scale-110">
            <Music size={32} className="lg:w-16 lg:h-16" />
          </div>
          <div>
            <h2 className="text-lg lg:text-3xl font-black text-[#4B4B4B] uppercase tracking-tight">Inmersión</h2>
            <p className="text-[#777777] font-bold text-xs lg:text-lg mt-1 lg:mt-2 leading-relaxed">Práctica multisensorial de trazado y ritmo.</p>
          </div>
          <button
            className="w-full py-2.5 lg:py-4 bg-[#1CB0F6] text-white font-black rounded-xl lg:rounded-2xl border-b-4 lg:border-b-8 border-[#1899D6] hover:bg-[#20C4FF] transition-all uppercase tracking-widest text-xs lg:text-lg"
          >
            Comenzar
          </button>
        </div>

        {/* 5. Anclas */}
        <div
          onClick={() => router.push("/anchor-texts")}
          className="bg-white p-6 lg:p-10 rounded-3xl lg:rounded-[2rem] border-2 border-[#E5E5E5] shadow-[0_4px_0_0_#E5E5E5] flex flex-col items-center text-center space-y-3 lg:space-y-6 hover:bg-[#F7F7F7] transition-all cursor-pointer group active:translate-y-1 active:shadow-none"
        >
          <div className="p-4 lg:p-8 bg-[#FFE5E5] text-[#FF4B4B] rounded-2xl lg:rounded-3xl transition-transform group-hover:scale-110">
            <Heart size={32} className="lg:w-16 lg:h-16" />
          </div>
          <div>
            <h2 className="text-lg lg:text-3xl font-black text-[#4B4B4B] uppercase tracking-tight">Anclas</h2>
            <p className="text-[#777777] font-bold text-xs lg:text-lg mt-1 lg:mt-2 leading-relaxed">Textos bíblicos para inmersión profunda.</p>
          </div>
          <button
            className="w-full py-2.5 lg:py-4 bg-[#FF4B4B] text-white font-black rounded-xl lg:rounded-2xl border-b-4 lg:border-b-8 border-[#CC3C3C] hover:bg-[#FF5C5C] transition-all uppercase tracking-widest text-xs lg:text-lg"
          >
            Explorar
          </button>
        </div>

        {/* 6. Flashcard */}
        <div
          onClick={() => router.push("/practice/flashcards")}
          className="bg-white p-6 lg:p-10 rounded-3xl lg:rounded-[2rem] border-2 border-[#E5E5E5] shadow-[0_4px_0_0_#E5E5E5] flex flex-col items-center text-center space-y-3 lg:space-y-6 hover:bg-[#F7F7F7] transition-all cursor-pointer group active:translate-y-1 active:shadow-none"
        >
          <div className="p-4 lg:p-8 bg-[#E5FFFA] text-[#00CD9E] rounded-2xl lg:rounded-3xl transition-transform group-hover:scale-110">
            <Zap size={32} className="lg:w-16 lg:h-16" />
          </div>
          <div>
            <h2 className="text-lg lg:text-3xl font-black text-[#4B4B4B] uppercase tracking-tight">Flashcards IME</h2>
            <p className="text-[#777777] font-bold text-xs lg:text-lg mt-1 lg:mt-2 leading-relaxed">Repaso espaciado con andamios multisensoriales.</p>
          </div>
          <button
            className="w-full py-2.5 lg:py-4 bg-[#00CD9E] text-white font-black rounded-xl lg:rounded-2xl border-b-4 lg:border-b-8 border-[#00A37E] hover:bg-[#00EBAB] transition-all uppercase tracking-widest text-xs lg:text-lg"
          >
            Repasar
          </button>
        </div>
      </div>
    </div>
  );
}
