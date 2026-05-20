"use client";

import { createQuizAction } from "@/features/teacher/actions";
import { ArrowLeft, Check, Plus, Search, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

interface ExerciseData {
  id: string;
  question: string;
  correctAnswer: string;
  type: string;
  lessonTitle: string;
}

export function QuizBuilder({ initialExercises }: { initialExercises: ExerciseData[] }) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const filteredExercises = initialExercises.filter(
    (ex) =>
      ex.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ex.lessonTitle.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const selectedExercises = initialExercises.filter((ex) => selectedIds.includes(ex.id));

  const toggleSelect = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds((prev) => prev.filter((exId) => exId !== id));
    } else {
      setSelectedIds((prev) => [...prev, id]);
    }
  };

  const handleSave = async () => {
    if (!title.trim()) return toast.error("El título es obligatorio");
    if (selectedIds.length === 0) return toast.error("Selecciona al menos una pregunta");

    setIsSubmitting(true);
    try {
      const res = await createQuizAction({ title, description, exerciseIds: selectedIds });
      if (res.success) {
        toast.success("Quiz creado correctamente");
        router.push("/teacher/quizzes");
      } else {
        toast.error(res.error || "Error al crear quiz");
      }
    } catch (e) {
      toast.error("Error al conectar con el servidor");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      <div className="flex items-center gap-4">
        <Link
          href="/teacher/quizzes"
          className="p-3 bg-white rounded-2xl border-2 border-[#E5E5E5] hover:bg-[#F7F7F7] transition-colors"
        >
          <ArrowLeft className="text-[#AFAFAF]" size={24} />
        </Link>
        <div>
          <h1 className="text-3xl font-black text-[#4B4B4B] uppercase tracking-tight">
            Crear Quiz
          </h1>
          <p className="text-[#777777] font-bold">Selecciona ejercicios del banco de preguntas.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl border-2 border-[#E5E5E5] p-6 space-y-4">
            <h2 className="text-xl font-black text-[#4B4B4B] uppercase tracking-tight">
              Detalles Generales
            </h2>
            <div>
              <label className="text-[10px] text-[#AFAFAF] font-black uppercase tracking-widest block mb-2">
                Título del Quiz
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-[#F7F7F7] border-2 border-[#E5E5E5] rounded-xl px-4 py-3 font-bold text-[#4B4B4B] focus:border-[#1CB0F6] focus:outline-none transition-colors"
                placeholder="Ej. Control de Vocabulario Unidad 1"
              />
            </div>
            <div>
              <label className="text-[10px] text-[#AFAFAF] font-black uppercase tracking-widest block mb-2">
                Descripción (Opcional)
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-[#F7F7F7] border-2 border-[#E5E5E5] rounded-xl px-4 py-3 font-bold text-[#4B4B4B] focus:border-[#1CB0F6] focus:outline-none transition-colors resize-none"
                rows={3}
                placeholder="Instrucciones para el alumno"
              />
            </div>
          </div>

          <div className="bg-white rounded-3xl border-2 border-[#E5E5E5] p-6 space-y-4">
            <h2 className="text-xl font-black text-[#4B4B4B] uppercase tracking-tight">
              Banco de Preguntas
            </h2>
            <div className="relative">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-[#AFAFAF]"
                size={20}
              />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-[#F7F7F7] border-2 border-[#E5E5E5] rounded-xl pl-12 pr-4 py-3 font-bold text-[#4B4B4B] focus:border-[#1CB0F6] focus:outline-none transition-colors"
                placeholder="Buscar por pregunta o módulo..."
              />
            </div>

            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
              {filteredExercises.length === 0 ? (
                <p className="text-center text-[#AFAFAF] font-bold py-8">
                  No se encontraron preguntas.
                </p>
              ) : (
                filteredExercises.map((ex) => {
                  const isSelected = selectedIds.includes(ex.id);
                  return (
                    <div
                      key={ex.id}
                      onClick={() => toggleSelect(ex.id)}
                      className={`p-4 rounded-2xl border-2 cursor-pointer transition-colors flex items-center justify-between gap-4 ${
                        isSelected
                          ? "border-[#1CB0F6] bg-[#DDF4FF]"
                          : "border-[#E5E5E5] bg-white hover:bg-[#F7F7F7]"
                      }`}
                    >
                      <div className="flex-1">
                        <span className="text-[10px] text-[#AFAFAF] font-black uppercase tracking-widest block mb-1">
                          {ex.lessonTitle}
                        </span>
                        <p className="font-bold text-[#4B4B4B]">{ex.question}</p>
                      </div>
                      <div
                        className={`w-6 h-6 rounded-md flex items-center justify-center border-2 shrink-0 ${
                          isSelected ? "bg-[#1CB0F6] border-[#1CB0F6]" : "border-[#E5E5E5]"
                        }`}
                      >
                        {isSelected && <Check className="text-white" size={14} />}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-3xl border-2 border-[#E5E5E5] p-6 sticky top-8">
            <h2 className="text-xl font-black text-[#4B4B4B] uppercase tracking-tight mb-4">
              Resumen
            </h2>

            <div className="bg-[#F7F7F7] rounded-2xl p-4 border-2 border-[#E5E5E5] mb-6">
              <span className="text-[10px] text-[#AFAFAF] font-black uppercase tracking-widest block mb-1">
                Preguntas Seleccionadas
              </span>
              <p className="text-3xl font-black text-[#1CB0F6]">{selectedIds.length}</p>
            </div>

            <div className="space-y-3 mb-6 max-h-[300px] overflow-y-auto">
              {selectedExercises.map((ex, i) => (
                <div
                  key={ex.id}
                  className="flex justify-between items-center gap-2 bg-[#F7F7F7] p-2 rounded-lg border border-[#E5E5E5]"
                >
                  <span className="text-sm font-bold text-[#777] line-clamp-1 flex-1">
                    {i + 1}. {ex.question}
                  </span>
                  <button
                    onClick={() => toggleSelect(ex.id)}
                    className="p-1 hover:bg-[#FFEBEB] rounded-md text-[#FF4B4B] transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>

            <button
              onClick={handleSave}
              disabled={isSubmitting || selectedIds.length === 0}
              className={`w-full py-4 rounded-2xl text-white font-black uppercase tracking-widest text-sm border-b-4 active:border-b-0 active:translate-y-1 transition-all ${
                isSubmitting || selectedIds.length === 0
                  ? "bg-[#E5E5E5] border-[#AFAFAF] cursor-not-allowed"
                  : "bg-[#58CC02] border-[#46A302] hover:bg-[#61E002]"
              }`}
            >
              {isSubmitting ? "Guardando..." : "Guardar Quiz"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
