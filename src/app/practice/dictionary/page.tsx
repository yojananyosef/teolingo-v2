"use client";

import { BookOpen, ArrowLeft, Search, Volume2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

interface VocabularyItem {
  hebrew: string;
  spanish: string;
}

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
    <div className="min-h-screen bg-gray-50 pb-12">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-500 hover:text-indigo-600 transition-colors mb-8 group"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span className="font-bold">Volver a Práctica</span>
        </button>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-100 text-purple-600 rounded-2xl">
              <BookOpen size={32} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Diccionario Bíblico</h1>
              <p className="text-gray-500">Repasa el vocabulario que has descubierto</p>
            </div>
          </div>

          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Buscar palabra..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all shadow-sm"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          </div>
        ) : error ? (
          <div className="text-center py-20 bg-red-50 rounded-3xl border-2 border-red-100">
            <p className="text-red-600 font-bold">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-4 px-6 py-2 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-colors"
            >
              Reintentar
            </button>
          </div>
        ) : filteredVocabulary.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-200">
            <p className="text-gray-500 font-medium">No se encontraron palabras.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredVocabulary.map((item, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between group hover:border-purple-200 hover:shadow-md transition-all cursor-default"
              >
                <div className="flex flex-col gap-1">
                  <div className="text-3xl font-serif text-indigo-600" dir="rtl">
                    {item.hebrew}
                  </div>
                  <div className="text-gray-500 font-bold capitalize">{item.spanish}</div>
                </div>
                <button 
                  className="p-3 text-gray-300 group-hover:text-purple-500 hover:bg-purple-50 rounded-xl transition-all"
                  title="Escuchar pronunciación"
                >
                  <Volume2 size={24} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
