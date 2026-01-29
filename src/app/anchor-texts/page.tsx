"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, BookOpen, Star, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { HebrewMultisensorial } from "@/features/lessons/components/HebrewMultisensorial";
import { listAnchorTextsAction } from "@/features/lessons/actions";
import { toast } from "sonner";
import { LoadingSpinner } from "@/components/LoadingSpinner";

// Why: Módulo de Teología Devocional (Textos Ancla) para inmersión profunda IME.
export default function AnchorTextsPage() {
  const router = useRouter();
  const [anchorTexts, setAnchorTexts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedText, setSelectedText] = useState<any | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const result = await listAnchorTextsAction();
        if (result.success && result.data) {
          setAnchorTexts(result.data);
          if (result.data.length > 0) {
            setSelectedText(result.data[0]);
          }
        } else {
          toast.error(result.error || "Error al cargar los textos ancla");
        }
      } catch (error) {
        toast.error("Error de conexión");
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-white no-scrollbar overflow-y-auto">
      {/* Header */}
      <div className="p-4 lg:p-6 flex items-center gap-x-4 bg-white border-b-2 border-[#E5E5E5] sticky top-0 z-10">
        <button
          onClick={() => router.back()}
          className="p-2 hover:bg-[#F7F7F7] rounded-full transition-colors"
        >
          <ArrowLeft className="w-6 h-6 text-[#AFAFAF] hover:text-[#4B4B4B]" />
        </button>
        <div className="flex items-center gap-x-3">
          <BookOpen className="w-8 h-8 text-[#1CB0F6]" />
          <h1 className="text-xl lg:text-2xl font-black text-[#4B4B4B] uppercase tracking-tight">
            Textos Ancla: Teología Devocional
          </h1>
        </div>
      </div>

      <div className="flex-1 max-w-5xl mx-auto w-full p-4 lg:p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sidebar: List of Texts */}
        <div className="lg:col-span-1 space-y-4">
          <h2 className="text-sm font-bold text-[#AFAFAF] uppercase tracking-widest px-2">
            Super-Nodos de Memoria
          </h2>
          <div className="space-y-2">
            {anchorTexts.map((text) => (
              <button
                key={text.id}
                onClick={() => setSelectedText(text)}
                className={`w-full p-4 rounded-2xl border-2 text-left transition-all active:scale-[0.98] ${selectedText?.id === text.id
                    ? "bg-[#DDF4FF] border-[#84D8FF] text-[#1899D6]"
                    : "bg-white border-[#E5E5E5] text-[#4B4B4B] hover:border-[#CECECE]"
                  }`}
              >
                <div className="font-black text-lg">{text.title}</div>
                <div className="text-sm opacity-70 font-bold">{text.reference}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Main Content: Viewer */}
        <div className="lg:col-span-2">
          {selectedText ? (
            <div className="bg-white rounded-3xl border-2 border-[#E5E5E5] p-6 lg:p-10 space-y-8 shadow-sm">
              {/* Hebrew Text Display */}
              <div className="text-center space-y-6">
                <div className="inline-flex items-center justify-center p-2 bg-[#F7F7F7] rounded-full px-4 text-[#AFAFAF] font-bold text-sm">
                  <Star className="w-4 h-4 mr-2 fill-[#FFC800] text-[#FFC800]" />
                  Texto Ancla: {selectedText.reference}
                </div>

                <div className="py-8">
                  <HebrewMultisensorial
                    text={selectedText.hebrewText}
                    className="text-4xl lg:text-6xl"
                  />
                </div>

                {/* Color Index (Legend) */}
                <div className="flex flex-wrap justify-center gap-4 py-4 border-y-2 border-[#F7F7F7]">
                  <div className="flex items-center gap-x-2">
                    <div className="w-3 h-3 rounded-full bg-[#1CB0F6]"></div>
                    <span className="text-[10px] font-black text-[#777] uppercase tracking-widest">Prefijos</span>
                  </div>
                  <div className="flex items-center gap-x-2">
                    <div className="w-3 h-3 rounded-full bg-[#FF4B4B]"></div>
                    <span className="text-[10px] font-black text-[#777] uppercase tracking-widest">Raíces</span>
                  </div>
                  <div className="flex items-center gap-x-2">
                    <div className="w-3 h-3 rounded-full bg-[#58CC02]"></div>
                    <span className="text-[10px] font-black text-[#777] uppercase tracking-widest">Sufijos</span>
                  </div>
                </div>

                {/* Morphological Index Details */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
                  {(["p", "r", "s"] as const).map((type) => {
                    const parts = selectedText.hebrewText.match(/\[([^\]]+):([prs])\]/g) || [];
                    const filtered = parts
                      .map((p: string) => {
                        const m = p.match(/\[([^\]]+):([prs])\]/);
                        return m ? { text: m[1], type: m[2] } : null;
                      })
                      .filter((p: any) => p && p.type === type);

                    if (filtered.length === 0) return null;

                    const colors = { p: "text-[#1CB0F6]", r: "text-[#FF4B4B]", s: "text-[#58CC02]" };
                    const labels = { p: "Prefijos", r: "Raíces", s: "Sufijos" };

                    return (
                      <div key={type} className="flex flex-col gap-y-2 p-3 bg-[#F7F7F7] rounded-2xl">
                        <span className={cn("text-[10px] font-black uppercase tracking-widest", colors[type])}>
                          {labels[type]}
                        </span>
                        <div className="flex flex-wrap gap-2" dir="rtl">
                          {filtered.map((p: any, i: number) => (
                            <span
                              key={i}
                              className={cn("HebrewFont text-lg font-bold p-1 px-2 bg-white rounded-lg shadow-sm border border-[#E5E5E5]", colors[type])}
                            >
                              {p.text}
                            </span>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="p-4 bg-[#F7F7F7] rounded-2xl border-2 border-[#E5E5E5]">
                  <p className="text-lg lg:text-xl font-bold text-[#4B4B4B] italic">
                    "{selectedText.translation}"
                  </p>
                </div>
              </div>

              {/* Devotional Insight (Dopamina Teológica) */}
              <div className="space-y-4">
                <div className="flex items-center gap-x-2 text-[#4B4B4B]">
                  <Info className="w-6 h-6 text-[#1CB0F6]" />
                  <h3 className="text-xl font-black uppercase tracking-tight">Dopamina Teológica</h3>
                </div>
                <div className="bg-[#FFF9E6] border-2 border-[#FFD900]/20 p-6 rounded-2xl">
                  <p className="text-[#4B4B4B] leading-relaxed text-lg">
                    {selectedText.explanation}
                  </p>
                </div>
              </div>

              {/* IME Tips */}
              <div className="pt-6 border-t-2 border-[#F7F7F7]">
                <h4 className="text-sm font-bold text-[#AFAFAF] uppercase tracking-widest mb-4">
                  Práctica IME Sugerida
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start gap-x-3 p-3 bg-[#F7F7F7] rounded-xl">
                    <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center font-bold text-[#1CB0F6] shrink-0">1</div>
                    <p className="text-sm text-[#777] font-medium">Toca las partes coloreadas para identificar la morfología.</p>
                  </div>
                  <div className="flex items-start gap-x-3 p-3 bg-[#F7F7F7] rounded-xl">
                    <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center font-bold text-[#1CB0F6] shrink-0">2</div>
                    <p className="text-sm text-[#777] font-medium">Repite el audio siguiendo el ritmo natural de la frase.</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-10 space-y-4 bg-white border-2 border-dashed border-[#E5E5E5] rounded-3xl">
              <BookOpen className="w-16 h-16 text-[#E5E5E5]" />
              <p className="text-[#AFAFAF] font-bold text-xl">Selecciona un texto ancla para comenzar la inmersión profunda.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
