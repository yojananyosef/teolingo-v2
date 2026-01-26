"use client";

import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Dumbbell, Clock, Zap, BookOpen } from "lucide-react";

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
    <div className="max-w-4xl mx-auto py-12 px-4">
      <div className="flex items-center gap-6 mb-12">
        <div className="p-4 bg-[#58CC02] text-white rounded-3xl shadow-[0_4px_0_0_#46A302]">
          <Dumbbell size={40} />
        </div>
        <div>
          <h1 className="text-4xl font-black text-[#4B4B4B] uppercase tracking-tight">Práctica Personalizada</h1>
          <p className="text-[#777777] font-bold text-lg mt-1">Refuerza tus conocimientos a tu propio ritmo</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div 
          onClick={() => router.push("/lesson/practice")}
          className="bg-white p-10 rounded-[2rem] border-2 border-[#E5E5E5] shadow-[0_4px_0_0_#E5E5E5] flex flex-col items-center text-center space-y-6 hover:bg-[#F7F7F7] transition-all cursor-pointer group active:translate-y-1 active:shadow-none"
        >
          <div className="p-8 bg-[#DDF4FF] text-[#1CB0F6] rounded-3xl transition-transform group-hover:scale-110">
            <Clock size={64} />
          </div>
          <div>
            <h2 className="text-3xl font-black text-[#4B4B4B] uppercase tracking-tight">Repaso Rápido</h2>
            <p className="text-[#777777] font-bold text-lg mt-2 leading-relaxed">Practica lo que aprendiste hoy en 2 minutos.</p>
          </div>
          <button 
            className="w-full py-4 bg-[#1CB0F6] text-white font-black rounded-2xl border-b-8 border-[#1899D6] hover:bg-[#20C4FF] transition-all uppercase tracking-widest text-lg"
          >
            Comenzar
          </button>
        </div>

        <div 
          onClick={() => router.push("/lesson/practice")}
          className="bg-white p-10 rounded-[2rem] border-2 border-[#E5E5E5] shadow-[0_4px_0_0_#E5E5E5] flex flex-col items-center text-center space-y-6 hover:bg-[#F7F7F7] transition-all cursor-pointer group active:translate-y-1 active:shadow-none"
        >
          <div className="p-8 bg-[#FFF5E5] text-[#FF9600] rounded-3xl transition-transform group-hover:scale-110">
            <Zap size={64} />
          </div>
          <div>
            <h2 className="text-3xl font-black text-[#4B4B4B] uppercase tracking-tight">Modo Intenso</h2>
            <p className="text-[#777777] font-bold text-lg mt-2 leading-relaxed">Ejercicios de alta dificultad para subir de nivel.</p>
          </div>
          <button 
            className="w-full py-4 bg-[#FF9600] text-white font-black rounded-2xl border-b-8 border-[#CC7800] hover:bg-[#FFA31A] transition-all uppercase tracking-widest text-lg"
          >
            Comenzar
          </button>
        </div>

        <div 
          onClick={() => router.push("/practice/dictionary")}
          className="bg-white p-10 rounded-[2rem] border-2 border-[#E5E5E5] shadow-[0_4px_0_0_#E5E5E5] flex flex-col items-center text-center space-y-6 hover:bg-[#F7F7F7] transition-all cursor-pointer group active:translate-y-1 active:shadow-none col-span-1 md:col-span-2"
        >
          <div className="p-8 bg-[#F3E8FF] text-[#A855F7] rounded-3xl transition-transform group-hover:scale-110">
            <BookOpen size={64} />
          </div>
          <div className="max-w-xl">
            <h2 className="text-3xl font-black text-[#4B4B4B] uppercase tracking-tight">Diccionario Bíblico</h2>
            <p className="text-[#777777] font-bold text-lg mt-2 leading-relaxed">Repasa el vocabulario que has descubierto en tus lecciones y profundiza en su significado original.</p>
          </div>
          <button 
            className="w-full md:w-auto px-16 py-4 bg-[#A855F7] text-white font-black rounded-2xl border-b-8 border-[#9333EA] hover:bg-[#B469FF] transition-all uppercase tracking-widest text-lg"
          >
            Explorar
          </button>
        </div>
      </div>
    </div>
  );
}
