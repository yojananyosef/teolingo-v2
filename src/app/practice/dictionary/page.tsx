"use client";

import { BookOpen, ArrowLeft, Search, Volume2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

interface VocabularyItem {
  hebrew: string;
  spanish: string;
}

import { LoadingSpinner } from "@/components/LoadingSpinner";

export default function DictionaryPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [vocabulary, setVocabulary] = useState<VocabularyItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVocabulary = async () => {
      try {
        const response = await fetch("/api/lessons/vocabulary");
        const data = await response.json();

        if (data.error) {
          setError(data.error);
        } else {
          setVocabulary(data);
        }
      } catch (error) {
        console.error("Error fetching vocabulary:", error);
        setError("Error al cargar el vocabulario");
      } finally {
        setIsLoading(false);
      }
    };

    fetchVocabulary();
  }, []);

  const filteredVocabulary = vocabulary.filter(
    (item: VocabularyItem) =>
      item.hebrew.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.spanish.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="h-full bg-white pb-20 lg:pb-12 overflow-y-auto">
      <div className="max-w-4xl mx-auto px-4 py-4 lg:py-8">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-[#777777] hover:text-[#1CB0F6] transition-colors mb-4 lg:mb-8 group"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform lg:w-5 lg:h-5" />
          <span className="font-black uppercase text-xs lg:text-sm tracking-widest">Volver a Práctica</span>
        </button>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 lg:gap-6 mb-6 lg:mb-12">
          <div className="flex items-center gap-3 lg:gap-4">
            <div className="p-2.5 lg:p-4 bg-[#DDF4FF] text-[#1CB0F6] rounded-xl lg:rounded-2xl border-2 border-[#84D8FF]">
              <BookOpen size={24} className="lg:w-8 lg:h-8" />
            </div>
            <div>
              <h1 className="text-xl lg:text-3xl font-black text-[#4B4B4B] uppercase tracking-tight">Diccionario Bíblico</h1>
              <p className="text-[#777777] font-bold text-xs lg:text-lg">Repasa el vocabulario que has descubierto</p>
            </div>
          </div>

          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#AFAFAF]" size={18} />
            <input
              type="text"
              placeholder="Buscar palabra..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 lg:py-3 bg-[#F7F7F7] border-2 border-[#E5E5E5] rounded-xl lg:rounded-2xl focus:outline-none focus:border-[#1CB0F6] transition-all font-bold text-[#4B4B4B] placeholder:text-[#AFAFAF]"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <LoadingSpinner size="lg" />
          </div>
        ) : error ? (
          <div className="text-center py-10 lg:py-20 bg-[#FFF5F5] rounded-2xl lg:rounded-3xl border-2 border-[#FFD9D9]">
            <p className="text-[#FF4B4B] font-bold">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-6 py-2 bg-[#FF4B4B] text-white rounded-xl font-black uppercase tracking-widest text-sm hover:bg-[#FF2B2B] transition-colors"
            >
              Reintentar
            </button>
          </div>
        ) : filteredVocabulary.length === 0 ? (
          <div className="text-center py-10 lg:py-20 bg-white rounded-2xl lg:rounded-3xl border-2 border-dashed border-[#E5E5E5]">
            <p className="text-[#777777] font-bold">No se encontraron palabras.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 lg:gap-4">
            {filteredVocabulary.map((item, index) => (
              <div
                key={index}
                className="bg-white p-4 lg:p-6 rounded-xl lg:rounded-2xl shadow-[0_4px_0_0_#E5E5E5] border-2 border-[#E5E5E5] flex items-center justify-between group hover:border-[#1CB0F6] transition-all cursor-default"
              >
                <div className="flex flex-col gap-0.5 lg:gap-1">
                  <div className="text-2xl lg:text-3xl font-serif text-[#1CB0F6]" dir="rtl">
                    {item.hebrew}
                  </div>
                  <div className="text-[#777777] font-black uppercase text-[10px] lg:text-xs tracking-widest">{item.spanish}</div>
                </div>
                <button
                  className="p-2 lg:p-3 text-[#AFAFAF] group-hover:text-[#1CB0F6] hover:bg-[#DDF4FF] rounded-xl transition-all"
                  title="Escuchar pronunciación"
                >
                  <Volume2 size={20} className="lg:w-6 lg:h-6" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
